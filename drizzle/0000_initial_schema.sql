-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: Users / Tenant Identifiers
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    farm_name VARCHAR(255),
    region VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: Farm Fields / Land Parcels
CREATE TABLE IF NOT EXISTS fields (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    acreage NUMERIC(10, 2) NOT NULL,
    soil_type VARCHAR(100) NOT NULL,
    irrigation_type VARCHAR(100) NOT NULL,
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    historical_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: Crop Advisories
CREATE TABLE IF NOT EXISTS crop_advisories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    field_id UUID REFERENCES fields(id) ON DELETE SET NULL,
    crop_name VARCHAR(150) NOT NULL,
    variety VARCHAR(150),
    confidence_score NUMERIC(5, 2) NOT NULL,
    soil_nitrogen_ppm NUMERIC(8, 2),
    soil_phosphorus_ppm NUMERIC(8, 2),
    soil_potassium_ppm NUMERIC(8, 2),
    soil_ph NUMERIC(4, 2),
    projected_yield_quintals_per_acre NUMERIC(8, 2),
    advisory_summary TEXT NOT NULL,
    action_plan JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: Multimodal Pathology Scans
CREATE TABLE IF NOT EXISTS pathology_scans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    field_id UUID REFERENCES fields(id) ON DELETE SET NULL,
    crop_name VARCHAR(150) NOT NULL,
    image_url TEXT,
    diagnosis_label VARCHAR(255) NOT NULL,
    severity VARCHAR(50) NOT NULL CHECK (severity IN ('Low', 'Moderate', 'Severe', 'Critical')),
    pathogenType VARCHAR(100) NOT NULL,
    treatment_protocols JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexing for performant multi-tenant queries
CREATE INDEX IF NOT EXISTS idx_fields_user_id ON fields(user_id);
CREATE INDEX IF NOT EXISTS idx_advisories_user_id ON crop_advisories(user_id);
CREATE INDEX IF NOT EXISTS idx_advisories_field_id ON crop_advisories(field_id);
CREATE INDEX IF NOT EXISTS idx_pathology_user_id ON pathology_scans(user_id);

-- Row Level Security (RLS) Policies
ALTER TABLE fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE crop_advisories ENABLE ROW LEVEL SECURITY;
ALTER TABLE pathology_scans ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_fields'
  ) THEN
    CREATE POLICY tenant_isolation_fields ON fields
      FOR ALL
      USING (user_id = NULLIF(current_setting('app.current_user_id', true), '')::UUID);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_advisories'
  ) THEN
    CREATE POLICY tenant_isolation_advisories ON crop_advisories
      FOR ALL
      USING (user_id = NULLIF(current_setting('app.current_user_id', true), '')::UUID);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_pathology'
  ) THEN
    CREATE POLICY tenant_isolation_pathology ON pathology_scans
      FOR ALL
      USING (user_id = NULLIF(current_setting('app.current_user_id', true), '')::UUID);
  END IF;
END $$;
