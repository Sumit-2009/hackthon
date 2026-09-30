import { Router, Request, Response } from 'express';
import { getFields, getFieldById, createField } from './controllers/fieldController.js';
import { getAdvisories, getAdvisoryById, generateAdvisory } from './controllers/advisoryController.js';
import { getScans, getScanById, scanPlant } from './controllers/diagnosticController.js';
import { db, DEFAULT_USER_ID } from './db.js';
import { geminiService } from './lib/gemini.js';

const router = Router();

// Field Management
router.get('/fields', getFields);
router.get('/fields/:id', getFieldById);
router.post('/fields', createField);

// Crop Advisory Engine
router.get('/advisories', getAdvisories);
router.get('/advisories/:id', getAdvisoryById);
router.post('/advisories/generate', generateAdvisory);

// Multimodal Visual Plant Pathology Doctor
router.get('/diagnostics', getScans);
router.get('/diagnostics/:id', getScanById);
router.post('/diagnostics/scan', scanPlant);

// Executive Dashboard Aggregated Statistics
router.get('/dashboard/stats', async (req: Request, res: Response) => {
  try {
    const userId = (req.headers['x-user-id'] as string) || DEFAULT_USER_ID;
    const stats = await db.getDashboardStats(userId);
    res.json({ success: true, data: stats });
  } catch (error) {
    console.error('[Dashboard] Error fetching dashboard stats:', error);
    res.status(500).json({ success: false, message: 'Internal server error fetching dashboard statistics' });
  }
});

// Tenant Profile
router.get('/user/profile', async (req: Request, res: Response) => {
  try {
    const userId = (req.headers['x-user-id'] as string) || DEFAULT_USER_ID;
    const user = await db.getOrCreateUser(userId);
    res.json({
      success: true,
      data: {
        ...user,
        aiConfigured: geminiService.hasActiveKey(),
        engineMode: geminiService.hasActiveKey() ? 'Gemini 2.5 Pro / Flash (Live)' : 'Agronomic Science Engine (Active)'
      }
    });
  } catch (error) {
    console.error('[User] Error fetching profile:', error);
    res.status(500).json({ success: false, message: 'Internal server error fetching profile' });
  }
});

// Optional Runtime Gemini API Key Update
router.post('/settings/key', (req: Request, res: Response) => {
  try {
    const { apiKey } = req.body;
    if (apiKey && typeof apiKey === 'string') {
      geminiService.reloadApiKey(apiKey);
      return res.json({ success: true, message: 'Gemini API key updated successfully' });
    }
    return res.status(400).json({ success: false, message: 'Missing valid apiKey string' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to set API key' });
  }
});

export default router;
