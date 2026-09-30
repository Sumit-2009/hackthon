import { Request, Response } from 'express';
import { db, DEFAULT_USER_ID } from '../db.js';
import { GenerateAdvisoryInputSchema } from '../../shared/validators.js';
import { geminiService } from '../lib/gemini.js';

export async function getAdvisories(req: Request, res: Response) {
  try {
    const userId = (req.headers['x-user-id'] as string) || DEFAULT_USER_ID;
    const advisories = await db.getAdvisories(userId);
    res.json({
      success: true,
      count: advisories.length,
      data: advisories
    });
  } catch (error) {
    console.error('[Advisories] Error fetching advisories:', error);
    res.status(500).json({ success: false, message: 'Internal server error fetching advisories' });
  }
}

export async function getAdvisoryById(req: Request, res: Response) {
  try {
    const userId = (req.headers['x-user-id'] as string) || DEFAULT_USER_ID;
    const { id } = req.params;
    const advisory = await db.getAdvisoryById(id, userId);
    if (!advisory) {
      return res.status(404).json({ success: false, message: `Advisory with ID ${id} not found` });
    }

    // Attach field information if fieldId exists
    let field = null;
    if (advisory.fieldId) {
      field = await db.getFieldById(advisory.fieldId, userId);
    }

    res.json({
      success: true,
      data: {
        ...advisory,
        field
      }
    });
  } catch (error) {
    console.error('[Advisories] Error fetching advisory by id:', error);
    res.status(500).json({ success: false, message: 'Internal server error fetching advisory details' });
  }
}

export async function generateAdvisory(req: Request, res: Response) {
  try {
    const userId = (req.headers['x-user-id'] as string) || DEFAULT_USER_ID;
    
    // Validate request payload with Zod
    const validation = GenerateAdvisoryInputSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: 'Invalid advisory generation payload',
        errors: validation.error.format()
      });
    }

    const input = validation.data;
    
    // Retrieve associated field to calibrate agronomic plan
    const field = await db.getFieldById(input.fieldId, userId);
    const fieldMetadata = field ? {
      name: field.name,
      soilType: field.soilType,
      irrigationType: field.irrigationType,
      acreage: String(field.acreage)
    } : undefined;

    // Run AI Synthesis via Gemini 2.5 Pro or Agronomic Science Engine
    const actionPlan = await geminiService.generateAdvisory(input, fieldMetadata);

    // Save generated crop advisory to database
    const savedRecord = await db.createAdvisory({
      userId,
      fieldId: input.fieldId,
      cropName: actionPlan.cropName,
      variety: actionPlan.variety,
      confidenceScore: String(actionPlan.confidenceScore),
      soilNitrogenPpm: input.soilMetrics.nitrogenPpm !== undefined ? String(input.soilMetrics.nitrogenPpm) : undefined,
      soilPhosphorusPpm: input.soilMetrics.phosphorusPpm !== undefined ? String(input.soilMetrics.phosphorusPpm) : undefined,
      soilPotassiumPpm: input.soilMetrics.potassiumPpm !== undefined ? String(input.soilMetrics.potassiumPpm) : undefined,
      soilPh: input.soilMetrics.ph !== undefined ? String(input.soilMetrics.ph) : undefined,
      projectedYieldQuintalsPerAcre: String(actionPlan.projectedYieldQuintals),
      advisorySummary: actionPlan.summary,
      actionPlan: actionPlan,
    });

    res.status(201).json({
      success: true,
      message: 'Crop advisory synthesized successfully',
      data: savedRecord,
      plan: actionPlan
    });
  } catch (error) {
    console.error('[Advisories] Error synthesizing crop advisory:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate crop advisory due to internal server error'
    });
  }
}
