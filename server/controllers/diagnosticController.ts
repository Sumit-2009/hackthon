import { Request, Response } from 'express';
import { db, DEFAULT_USER_ID } from '../db.js';
import { PathologyScanInputSchema } from '../../shared/validators.js';
import { geminiService } from '../lib/gemini.js';

export async function getScans(req: Request, res: Response) {
  try {
    const userId = (req.headers['x-user-id'] as string) || DEFAULT_USER_ID;
    const scans = await db.getScans(userId);
    res.json({ success: true, count: scans.length, data: scans });
  } catch (error) {
    console.error('[Diagnostics] Error fetching scans:', error);
    res.status(500).json({ success: false, message: 'Internal server error fetching scans' });
  }
}

export async function getScanById(req: Request, res: Response) {
  try {
    const userId = (req.headers['x-user-id'] as string) || DEFAULT_USER_ID;
    const { id } = req.params;
    const scan = await db.getScanById(id, userId);
    if (!scan) {
      return res.status(404).json({ success: false, message: `Pathology scan with ID ${id} not found` });
    }
    res.json({ success: true, data: scan });
  } catch (error) {
    console.error('[Diagnostics] Error fetching scan by id:', error);
    res.status(500).json({ success: false, message: 'Internal server error fetching scan details' });
  }
}

export async function scanPlant(req: Request, res: Response) {
  try {
    const userId = (req.headers['x-user-id'] as string) || DEFAULT_USER_ID;
    
    // Strict Zod validation of multimodal image payload
    const validation = PathologyScanInputSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: 'Invalid plant pathology payload',
        errors: validation.error.format()
      });
    }

    const { fieldId, cropName, imageBase64, mimeType } = validation.data;

    // Verify MIME types and basic base64 integrity
    const allowedMime = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedMime.includes(mimeType)) {
      return res.status(400).json({
        success: false,
        message: `Unsupported image MIME type: ${mimeType}. Allowed: JPEG, PNG, WEBP.`
      });
    }

    // Multimodal AI pathology triage via Gemini 2.5 Flash Vision
    const diagnosis = await geminiService.analyzePlantPathology({
      fieldId,
      cropName,
      imageBase64,
      mimeType
    });

    // Save scan diagnosis record to DB
    const savedScan = await db.createScan({
      userId,
      fieldId: fieldId || null,
      cropName: diagnosis.cropIdentified || cropName,
      imageUrl: imageBase64.startsWith('data:') ? imageBase64 : `data:${mimeType};base64,${imageBase64}`,
      diagnosisLabel: diagnosis.diagnosisLabel,
      severity: diagnosis.severity,
      pathogenType: diagnosis.pathogenType,
      treatmentProtocols: diagnosis,
    });

    res.status(201).json({
      success: true,
      message: 'Plant pathology scan analyzed successfully',
      data: savedScan,
      diagnosis
    });
  } catch (error) {
    console.error('[Diagnostics] Error analyzing plant pathology scan:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to analyze plant pathology scan due to internal server error'
    });
  }
}
