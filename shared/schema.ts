import { pgTable, text, varchar, numeric, timestamp, uuid, jsonb } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

// Categorical Constants from Specification
export const CROP_TYPES = [
  "Cereals & Grains",
  "Pulses & Legumes",
  "Oilseeds",
  "Vegetables & Greens",
  "Fruits & Orchards",
  "Fiber Crops",
  "Cash & Sugarcane",
  "Root & Tuber"
] as const;

export const SOIL_TYPES = [
  "Alluvial Soil",
  "Black Cotton Soil",
  "Red & Yellow Soil",
  "Laterite Soil",
  "Sandy Loam",
  "Clay Loam",
  "Saline / Alkaline",
  "Silty Clay",
  "Loam",
  "Peat",
  "Chalky"
] as const;

export const IRRIGATION_TYPES = [
  "Drip Irrigation (High Efficiency)",
  "Sprinkler System",
  "Flood / Furrow Irrigation",
  "Rainfed / Monsoonal Only",
  "Canal / Siphon System",
  "Center Pivot",
  "Sub-irrigation"
] as const;

export const CLIMATE_TYPES = [
  "Arid",
  "Semi-Arid",
  "Tropical Wet",
  "Tropical Wet-and-Dry",
  "Humid Subtropical",
  "Temperate",
  "Mediterranean"
] as const;

export const SEVERITY_LEVELS = [
  "Low",
  "Moderate",
  "Severe",
  "Critical"
] as const;

// 1. Users / Tenant Identifiers Table
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  fullName: varchar('full_name', { length: 255 }).notNull(),
  farmName: varchar('farm_name', { length: 255 }),
  region: varchar('region', { length: 100 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// 2. Farm Fields / Land Parcels Table
export const fields = pgTable('fields', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  name: varchar('name', { length: 150 }).notNull(),
  acreage: numeric('acreage', { precision: 10, scale: 2 }).notNull(),
  soilType: varchar('soil_type', { length: 100 }).notNull(),
  irrigationType: varchar('irrigation_type', { length: 100 }).notNull(),
  latitude: numeric('latitude', { precision: 10, scale: 7 }),
  longitude: numeric('longitude', { precision: 10, scale: 7 }),
  historicalNotes: text('historical_notes'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// 3. Crop Advisories Table
export const cropAdvisories = pgTable('crop_advisories', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  fieldId: uuid('field_id').references(() => fields.id, { onDelete: 'set null' }),
  cropName: varchar('crop_name', { length: 150 }).notNull(),
  variety: varchar('variety', { length: 150 }),
  confidenceScore: numeric('confidence_score', { precision: 5, scale: 2 }).notNull(),
  soilNitrogenPpm: numeric('soil_nitrogen_ppm', { precision: 8, scale: 2 }),
  soilPhosphorusPpm: numeric('soil_phosphorus_ppm', { precision: 8, scale: 2 }),
  soilPotassiumPpm: numeric('soil_potassium_ppm', { precision: 8, scale: 2 }),
  soilPh: numeric('soil_ph', { precision: 4, scale: 2 }),
  projectedYieldQuintalsPerAcre: numeric('projected_yield_quintals_per_acre', { precision: 8, scale: 2 }),
  advisorySummary: text('advisory_summary').notNull(),
  actionPlan: jsonb('action_plan').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// 4. Multimodal Pathology Scans Table
export const pathologyScans = pgTable('pathology_scans', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  fieldId: uuid('field_id').references(() => fields.id, { onDelete: 'set null' }),
  cropName: varchar('crop_name', { length: 150 }).notNull(),
  imageUrl: text('image_url'),
  diagnosisLabel: varchar('diagnosis_label', { length: 255 }).notNull(),
  severity: varchar('severity', { length: 50 }).notNull(),
  pathogenType: varchar('pathogen_type', { length: 100 }).notNull(),
  treatmentProtocols: jsonb('treatment_protocols').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// TypeScript Inferred Types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Field = typeof fields.$inferSelect;
export type NewField = typeof fields.$inferInsert;

export type CropAdvisory = typeof cropAdvisories.$inferSelect;
export type NewCropAdvisory = typeof cropAdvisories.$inferInsert;

export type PathologyScan = typeof pathologyScans.$inferSelect;
export type NewPathologyScan = typeof pathologyScans.$inferInsert;

// Detailed Action Plan Types
export interface LifecyclePhase {
  phaseName: string;
  dayRange: string;
  irrigationSchedule: string;
  fertilizationAction: string;
  pestSurveillance: string;
}

export interface EconomicOutlook {
  estimatedCostPerAcre: number;
  estimatedRevenuePerAcre: number;
  recommendedMarketWindow: string;
}

export interface AdvisoryActionPlan {
  cropName: string;
  variety: string;
  confidenceScore: number;
  projectedYieldQuintals: number;
  summary: string;
  soilAmendments: string[];
  lifecyclePhases: LifecyclePhase[];
  economicOutlook: EconomicOutlook;
  targetSeason?: string;
  weatherForecast?: {
    avgTemperatureCelsius: number;
    rainfallForecastMm: number;
    relativeHumidityPercent: number;
  };
}

export interface PathologyTreatmentProtocols {
  cropIdentified: string;
  diagnosisLabel: string;
  severity: 'Low' | 'Moderate' | 'Severe' | 'Critical';
  pathogenType: string;
  symptomsObserved: string[];
  treatments: {
    chemicalIntervention: string;
    organicAlternative: string;
    culturalPreventativeMeasures: string;
  };
  quarantineRequired: boolean;
}
