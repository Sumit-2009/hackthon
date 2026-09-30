import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from '../shared/schema.js';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import os from 'os';

// Default Demo User / Tenant
export const DEFAULT_USER_ID = '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d';
export const DEFAULT_USER: schema.User = {
  id: DEFAULT_USER_ID,
  email: 'agronomist@farmcorp.com',
  fullName: 'Dr. Rajesh Patel',
  farmName: 'Patel Agro-Ecosystems Research & Production Farm',
  region: 'Indo-Gangetic Basin, Punjab',
  createdAt: new Date('2026-01-01T00:00:00Z'),
  updatedAt: new Date('2026-01-01T00:00:00Z'),
};

export const INITIAL_FIELDS: schema.Field[] = [
  {
    id: 'a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d',
    userId: DEFAULT_USER_ID,
    name: 'North Delta Valley - Plot A',
    acreage: '45.50',
    soilType: 'Alluvial Soil',
    irrigationType: 'Drip Irrigation (High Efficiency)',
    latitude: '30.9009650',
    longitude: '75.8572750',
    historicalNotes: 'Previously cultivated with Wheat-Rice rotation. Responds well to split-nitrogen dosing.',
    createdAt: new Date(Date.now() - 30 * 24 * 3600 * 1000),
  },
  {
    id: 'b2c3d4e5-f6a1-4b2c-9d3e-4f5a6b7c8d9e',
    userId: DEFAULT_USER_ID,
    name: 'Deccan Plateau Cotton Plot',
    acreage: '72.00',
    soilType: 'Black Cotton Soil',
    irrigationType: 'Sprinkler System',
    latitude: '19.8761650',
    longitude: '75.3433140',
    historicalNotes: 'High clay swelling dynamics. Deep crack retention in dry months. Requires monitored potassium.',
    createdAt: new Date(Date.now() - 20 * 24 * 3600 * 1000),
  },
  {
    id: 'c3d4e5f6-a1b2-4c3d-ae4f-5a6b7c8d9e0f',
    userId: DEFAULT_USER_ID,
    name: 'Eastern Sandy Loam Highlands',
    acreage: '28.30',
    soilType: 'Sandy Loam',
    irrigationType: 'Canal / Siphon System',
    latitude: '23.3441000',
    longitude: '85.3095620',
    historicalNotes: 'Rapid percolation and leaching vulnerability. Organic carbon enrichment required prior to sowing.',
    createdAt: new Date(Date.now() - 10 * 24 * 3600 * 1000),
  },
];

export const INITIAL_ADVISORIES: schema.CropAdvisory[] = [
  {
    id: 'd4e5f6a1-b2c3-4d4e-bf5a-6b7c8d9e0f1a',
    userId: DEFAULT_USER_ID,
    fieldId: 'a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d',
    cropName: 'HD-3226 High-Yield Wheat',
    variety: 'Pusa Yashasvi (HD-3226)',
    confidenceScore: '94.50',
    soilNitrogenPpm: '220.00',
    soilPhosphorusPpm: '28.50',
    soilPotassiumPpm: '310.00',
    soilPh: '6.80',
    projectedYieldQuintalsPerAcre: '24.50',
    advisorySummary: 'Optimal sowing window recommended for late Rabi cycle. Soil pH (6.8) is in prime neutral range. Balanced basal NPK recommended with second split during Crown Root Initiation.',
    actionPlan: {
      cropName: 'HD-3226 High-Yield Wheat',
      variety: 'Pusa Yashasvi (HD-3226)',
      confidenceScore: 94.5,
      projectedYieldQuintals: 24.5,
      summary: 'Optimal sowing window recommended for late Rabi cycle. Soil pH (6.8) is in prime neutral range. Balanced basal NPK recommended with second split during Crown Root Initiation.',
      soilAmendments: [
        'Apply 10 tonnes Farmyard Manure (FYM) per acre prior to primary tillage',
        'Basal dose of 50kg DAP + 25kg MOP per acre',
        'Top dressing with 40kg Urea at 21 days after sowing (CRI stage)'
      ],
      lifecyclePhases: [
        {
          phaseName: 'Sowing & Crown Root Initiation',
          dayRange: 'Days 1-25',
          irrigationSchedule: 'Light pre-sowing soaking followed by first crucial irrigation at Day 21 (CRI).',
          fertilizationAction: 'Basal application: 50% N + 100% P + 100% K during final seedbed preparation.',
          pestSurveillance: 'Inspect for termite attack and pre-emergence weed flushes (Phalaris minor).'
        },
        {
          phaseName: 'Tillering & Stem Elongation',
          dayRange: 'Days 26-60',
          irrigationSchedule: 'Second irrigation at active tillering (Day 40-45). Maintain uniform moisture.',
          fertilizationAction: 'First top dressing: 25% Nitrogen (Urea) broadcast immediately prior to irrigation.',
          pestSurveillance: 'Monitor for yellow rust pustules on lower leaves; install yellow sticky traps.'
        },
        {
          phaseName: 'Booting & Flowering / Heading',
          dayRange: 'Days 61-90',
          irrigationSchedule: 'Critical irrigation at heading stage. Avoid water stress to prevent floret abortion.',
          fertilizationAction: 'Final foliar spray of 1% Potassium Nitrate (13:0:45) to enhance grain filling.',
          pestSurveillance: 'Scout for wheat aphids (Sitobion avenae); threshold 10 aphids per earhead.'
        },
        {
          phaseName: 'Grain Hardening & Maturation',
          dayRange: 'Days 91-125',
          irrigationSchedule: 'Last light irrigation at dough stage. Discontinue irrigation 12 days before harvest.',
          fertilizationAction: 'Zero fertilization. Allow natural senescence and nutrient remobilization.',
          pestSurveillance: 'Monitor grain moisture; target 12-14% moisture content for mechanical combine harvest.'
        }
      ],
      economicOutlook: {
        estimatedCostPerAcre: 14500,
        estimatedRevenuePerAcre: 58800,
        recommendedMarketWindow: 'Early April peak procurement with MSP window'
      },
      targetSeason: 'Rabi / Winter',
      weatherContext: {
        avgTemperatureCelsius: 18.5,
        rainfallForecastMm: 45,
        relativeHumidityPercent: 62
      }
    },
    createdAt: new Date(Date.now() - 5 * 24 * 3600 * 1000),
  }
];

export const INITIAL_SCANS: schema.PathologyScan[] = [
  {
    id: 'e5f6a1b2-c3d4-4e5f-cf6a-7b8c9d0e1f2b',
    userId: DEFAULT_USER_ID,
    fieldId: 'b2c3d4e5-f6a1-4b2c-9d3e-4f5a6b7c8d9e',
    cropName: 'Cotton (Gossypium hirsutum)',
    imageUrl: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=600&q=80',
    diagnosisLabel: 'Cotton Leaf Curl Virus (CLCuV) & Whitefly Infestation',
    severity: 'Moderate',
    pathogenType: 'Viral (Begomovirus transmitted by Bemisia tabaci)',
    treatmentProtocols: {
      cropIdentified: 'Cotton (Gossypium hirsutum)',
      diagnosisLabel: 'Cotton Leaf Curl Virus (CLCuV)',
      severity: 'Moderate',
      pathogenType: 'Viral / Insect Vector',
      symptomsObserved: [
        'Upward and downward curling of upper leaves',
        'Thickening of veins on underside of foliage',
        'Enation (leaf-like outgrowths) on veins',
        'Stunted internodes on active branches'
      ],
      treatments: {
        chemicalIntervention: 'Foliar application of Diafenthiuron 50% WP @ 250g/acre or Pyriproxyfen 10% EC @ 400ml/acre to suppress vector whitefly population.',
        organicAlternative: 'Neem seed kernel extract (NSKE 5%) or 1500 ppm Azadirachtin @ 5ml/liter of water with sticker agent; release Chrysoperla carnea predators.',
        culturalPreventativeMeasures: 'Eradicate alternate weed hosts (Abutilon indicum, Parthenium hysterophorus) along field bunds. Install yellow sticky traps (15 traps/acre).'
      },
      quarantineRequired: false
    },
    createdAt: new Date(Date.now() - 2 * 24 * 3600 * 1000),
  }
];

// Persistent File-backed Store for Resilient Local Deployment
interface LocalDbStore {
  users: schema.User[];
  fields: schema.Field[];
  cropAdvisories: schema.CropAdvisory[];
  pathologyScans: schema.PathologyScan[];
}

const isServerless = !!(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
const bundledSeedPath = path.resolve(process.cwd(), 'server', 'data', 'agrismart_db.json');
const dataDir = isServerless ? os.tmpdir() : path.resolve(process.cwd(), 'server', 'data');
const dbFilePath = path.resolve(dataDir, 'agrismart_db.json');

function ensureDataStore(): LocalDbStore {
  // 1. Try reading from target file path (in /tmp on Vercel, or local server/data)
  if (fs.existsSync(dbFilePath)) {
    try {
      const content = fs.readFileSync(dbFilePath, 'utf-8');
      const parsed = JSON.parse(content);
      return {
        users: parsed.users || [DEFAULT_USER],
        fields: parsed.fields || INITIAL_FIELDS,
        cropAdvisories: parsed.cropAdvisories || INITIAL_ADVISORIES,
        pathologyScans: parsed.pathologyScans || INITIAL_SCANS,
      };
    } catch (e) {
      console.warn('[DB] Could not parse existing store, attempting re-initialization.');
    }
  }

  // 2. If in serverless mode and bundled seed file exists, seed from bundled file
  if (isServerless && fs.existsSync(bundledSeedPath)) {
    try {
      const content = fs.readFileSync(bundledSeedPath, 'utf-8');
      const parsed = JSON.parse(content);
      const store: LocalDbStore = {
        users: parsed.users || [DEFAULT_USER],
        fields: parsed.fields || INITIAL_FIELDS,
        cropAdvisories: parsed.cropAdvisories || INITIAL_ADVISORIES,
        pathologyScans: parsed.pathologyScans || INITIAL_SCANS,
      };
      try {
        fs.writeFileSync(dbFilePath, JSON.stringify(store, null, 2), 'utf-8');
      } catch {
        // If write fails, continue with in-memory store
      }
      return store;
    } catch (e) {
      console.warn('[DB] Could not read bundled seed file, initializing defaults.');
    }
  }

  // 3. Fallback to hardcoded initial dataset
  const initialStore: LocalDbStore = {
    users: [DEFAULT_USER],
    fields: INITIAL_FIELDS,
    cropAdvisories: INITIAL_ADVISORIES,
    pathologyScans: INITIAL_SCANS,
  };

  try {
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(dbFilePath, JSON.stringify(initialStore, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[DB] Local filesystem write skipped or read-only, using memory store:', (err as Error).message);
  }

  return initialStore;
}

function saveStore(store: LocalDbStore) {
  try {
    fs.writeFileSync(dbFilePath, JSON.stringify(store, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[DB] Note: Could not persist store to disk:', (err as Error).message);
  }
}

// Database Service Interface
export class AgriDatabase {
  private localStore: LocalDbStore;
  private pool: Pool | null = null;
  public isPostgres = false;

  constructor() {
    this.localStore = ensureDataStore();
    this.initPostgres();
  }

  private async initPostgres() {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl || dbUrl.includes('localhost:5432') && process.env.NODE_ENV !== 'production') {
      console.log('[DB] Running with local persistent data engine.');
      return;
    }

    try {
      this.pool = new Pool({
        connectionString: dbUrl,
        ssl: dbUrl.includes('neon.tech') || dbUrl.includes('supabase') ? { rejectUnauthorized: false } : undefined,
      });

      await this.pool.query('SELECT NOW()');
      this.isPostgres = true;
      console.log('[DB] Connected to PostgreSQL successfully.');
      await this.runPostgresMigrations();
    } catch (err) {
      console.warn('[DB] PostgreSQL connection unavailable. Gracefully falling back to persistent local engine:', (err as Error).message);
      this.isPostgres = false;
      this.pool = null;
    }
  }

  private async runPostgresMigrations() {
    if (!this.pool) return;
    try {
      await this.pool.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

      await this.pool.query(`
        CREATE TABLE IF NOT EXISTS users (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            email VARCHAR(255) UNIQUE NOT NULL,
            full_name VARCHAR(255) NOT NULL,
            farm_name VARCHAR(255),
            region VARCHAR(100) NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );

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

        CREATE TABLE IF NOT EXISTS pathology_scans (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            field_id UUID REFERENCES fields(id) ON DELETE SET NULL,
            crop_name VARCHAR(150) NOT NULL,
            image_url TEXT,
            diagnosis_label VARCHAR(255) NOT NULL,
            severity VARCHAR(50) NOT NULL CHECK (severity IN ('Low', 'Moderate', 'Severe', 'Critical')),
            pathogen_type VARCHAR(100) NOT NULL,
            treatment_protocols JSONB NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `);
      console.log('[DB] PostgreSQL schema verified.');
    } catch (err) {
      console.error('[DB] Migration verification error:', err);
    }
  }

  // Tenant / User Resolution
  public async getOrCreateUser(userId: string = DEFAULT_USER_ID): Promise<schema.User> {
    const existing = this.localStore.users.find(u => u.id === userId);
    if (existing) return existing;
    return DEFAULT_USER;
  }

  // Field Queries
  public async getFields(userId: string = DEFAULT_USER_ID): Promise<schema.Field[]> {
    if (this.isPostgres && this.pool) {
      const res = await this.pool.query(
        'SELECT * FROM fields WHERE user_id = $1 ORDER BY created_at DESC',
        [userId]
      );
      return res.rows;
    }
    return this.localStore.fields.filter(f => f.userId === userId);
  }

  public async getFieldById(id: string, userId: string = DEFAULT_USER_ID): Promise<schema.Field | undefined> {
    if (this.isPostgres && this.pool) {
      const res = await this.pool.query(
        'SELECT * FROM fields WHERE id = $1 AND user_id = $2',
        [id, userId]
      );
      return res.rows[0];
    }
    return this.localStore.fields.find(f => f.id === id && f.userId === userId);
  }

  public async createField(input: schema.NewField): Promise<schema.Field> {
    const newField: schema.Field = {
      id: crypto.randomUUID(),
      userId: input.userId || DEFAULT_USER_ID,
      name: input.name,
      acreage: String(input.acreage),
      soilType: input.soilType,
      irrigationType: input.irrigationType,
      latitude: input.latitude ? String(input.latitude) : null,
      longitude: input.longitude ? String(input.longitude) : null,
      historicalNotes: input.historicalNotes || null,
      createdAt: new Date(),
    };

    if (this.isPostgres && this.pool) {
      const res = await this.pool.query(
        `INSERT INTO fields (id, user_id, name, acreage, soil_type, irrigation_type, latitude, longitude, historical_notes, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
        [newField.id, newField.userId, newField.name, newField.acreage, newField.soilType, newField.irrigationType, newField.latitude, newField.longitude, newField.historicalNotes, newField.createdAt]
      );
      return res.rows[0];
    }

    this.localStore.fields.unshift(newField);
    saveStore(this.localStore);
    return newField;
  }

  // Crop Advisory Queries
  public async getAdvisories(userId: string = DEFAULT_USER_ID): Promise<schema.CropAdvisory[]> {
    if (this.isPostgres && this.pool) {
      const res = await this.pool.query(
        'SELECT * FROM crop_advisories WHERE user_id = $1 ORDER BY created_at DESC',
        [userId]
      );
      return res.rows;
    }
    return this.localStore.cropAdvisories.filter(a => a.userId === userId);
  }

  public async getAdvisoryById(id: string, userId: string = DEFAULT_USER_ID): Promise<schema.CropAdvisory | undefined> {
    if (this.isPostgres && this.pool) {
      const res = await this.pool.query(
        'SELECT * FROM crop_advisories WHERE id = $1 AND user_id = $2',
        [id, userId]
      );
      return res.rows[0];
    }
    return this.localStore.cropAdvisories.find(a => a.id === id && a.userId === userId);
  }

  public async createAdvisory(input: schema.NewCropAdvisory): Promise<schema.CropAdvisory> {
    const newAdv: schema.CropAdvisory = {
      id: crypto.randomUUID(),
      userId: input.userId || DEFAULT_USER_ID,
      fieldId: input.fieldId || null,
      cropName: input.cropName,
      variety: input.variety || null,
      confidenceScore: String(input.confidenceScore),
      soilNitrogenPpm: input.soilNitrogenPpm ? String(input.soilNitrogenPpm) : null,
      soilPhosphorusPpm: input.soilPhosphorusPpm ? String(input.soilPhosphorusPpm) : null,
      soilPotassiumPpm: input.soilPotassiumPpm ? String(input.soilPotassiumPpm) : null,
      soilPh: input.soilPh ? String(input.soilPh) : null,
      projectedYieldQuintalsPerAcre: input.projectedYieldQuintalsPerAcre ? String(input.projectedYieldQuintalsPerAcre) : null,
      advisorySummary: input.advisorySummary,
      actionPlan: input.actionPlan,
      createdAt: new Date(),
    };

    if (this.isPostgres && this.pool) {
      const res = await this.pool.query(
        `INSERT INTO crop_advisories (id, user_id, field_id, crop_name, variety, confidence_score, soil_nitrogen_ppm, soil_phosphorus_ppm, soil_potassium_ppm, soil_ph, projected_yield_quintals_per_acre, advisory_summary, action_plan, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *`,
        [newAdv.id, newAdv.userId, newAdv.fieldId, newAdv.cropName, newAdv.variety, newAdv.confidenceScore, newAdv.soilNitrogenPpm, newAdv.soilPhosphorusPpm, newAdv.soilPotassiumPpm, newAdv.soilPh, newAdv.projectedYieldQuintalsPerAcre, newAdv.advisorySummary, JSON.stringify(newAdv.actionPlan), newAdv.createdAt]
      );
      return res.rows[0];
    }

    this.localStore.cropAdvisories.unshift(newAdv);
    saveStore(this.localStore);
    return newAdv;
  }

  // Pathology Scans Queries
  public async getScans(userId: string = DEFAULT_USER_ID): Promise<schema.PathologyScan[]> {
    if (this.isPostgres && this.pool) {
      const res = await this.pool.query(
        'SELECT * FROM pathology_scans WHERE user_id = $1 ORDER BY created_at DESC',
        [userId]
      );
      return res.rows;
    }
    return this.localStore.pathologyScans.filter(s => s.userId === userId);
  }

  public async getScanById(id: string, userId: string = DEFAULT_USER_ID): Promise<schema.PathologyScan | undefined> {
    if (this.isPostgres && this.pool) {
      const res = await this.pool.query(
        'SELECT * FROM pathology_scans WHERE id = $1 AND user_id = $2',
        [id, userId]
      );
      return res.rows[0];
    }
    return this.localStore.pathologyScans.find(s => s.id === id && s.userId === userId);
  }

  public async createScan(input: schema.NewPathologyScan): Promise<schema.PathologyScan> {
    const newScan: schema.PathologyScan = {
      id: crypto.randomUUID(),
      userId: input.userId || DEFAULT_USER_ID,
      fieldId: input.fieldId || null,
      cropName: input.cropName,
      imageUrl: input.imageUrl || null,
      diagnosisLabel: input.diagnosisLabel,
      severity: input.severity,
      pathogenType: input.pathogenType,
      treatmentProtocols: input.treatmentProtocols,
      createdAt: new Date(),
    };

    if (this.isPostgres && this.pool) {
      const res = await this.pool.query(
        `INSERT INTO pathology_scans (id, user_id, field_id, crop_name, image_url, diagnosis_label, severity, pathogen_type, treatment_protocols, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
        [newScan.id, newScan.userId, newScan.fieldId, newScan.cropName, newScan.imageUrl, newScan.diagnosisLabel, newScan.severity, newScan.pathogenType, JSON.stringify(newScan.treatmentProtocols), newScan.createdAt]
      );
      return res.rows[0];
    }

    this.localStore.pathologyScans.unshift(newScan);
    saveStore(this.localStore);
    return newScan;
  }

  // Dashboard Aggregated Stats
  public async getDashboardStats(userId: string = DEFAULT_USER_ID) {
    const fieldsList = await this.getFields(userId);
    const advisoriesList = await this.getAdvisories(userId);
    const scansList = await this.getScans(userId);

    const totalAcres = fieldsList.reduce((acc, curr) => acc + Number(curr.acreage || 0), 0);
    const criticalScans = scansList.filter(s => s.severity === 'Critical' || s.severity === 'Severe').length;

    // Calculate average projected yield from advisories
    const totalYield = advisoriesList.reduce((acc, curr) => acc + Number(curr.projectedYieldQuintalsPerAcre || 0), 0);
    const avgYield = advisoriesList.length > 0 ? (totalYield / advisoriesList.length).toFixed(1) : '0';

    return {
      activeFieldsCount: fieldsList.length,
      totalAcres: totalAcres.toFixed(1),
      advisoriesGenerated: advisoriesList.length,
      pathologyScansCompleted: scansList.length,
      highRiskThreats: criticalScans,
      averageProjectedYield: `${avgYield} q/acre`,
      recentFields: fieldsList.slice(0, 3),
      recentAdvisories: advisoriesList.slice(0, 3),
      recentScans: scansList.slice(0, 3),
    };
  }
}

export const db = new AgriDatabase();
