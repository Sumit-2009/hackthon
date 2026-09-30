import { Request, Response } from 'express';
import { db, DEFAULT_USER_ID } from '../db.js';
import { CreateFieldSchema } from '../../shared/validators.js';

export async function getFields(req: Request, res: Response) {
  try {
    const userId = (req.headers['x-user-id'] as string) || DEFAULT_USER_ID;
    const fields = await db.getFields(userId);
    res.json({ success: true, count: fields.length, data: fields });
  } catch (error) {
    console.error('[Fields] Error fetching fields:', error);
    res.status(500).json({ success: false, message: 'Internal server error fetching fields' });
  }
}

export async function getFieldById(req: Request, res: Response) {
  try {
    const userId = (req.headers['x-user-id'] as string) || DEFAULT_USER_ID;
    const { id } = req.params;
    const field = await db.getFieldById(id, userId);
    if (!field) {
      return res.status(404).json({ success: false, message: `Field with ID ${id} not found` });
    }
    res.json({ success: true, data: field });
  } catch (error) {
    console.error('[Fields] Error fetching field by id:', error);
    res.status(500).json({ success: false, message: 'Internal server error fetching field' });
  }
}

export async function createField(req: Request, res: Response) {
  try {
    const userId = (req.headers['x-user-id'] as string) || DEFAULT_USER_ID;
    const validation = CreateFieldSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: 'Invalid field data',
        errors: validation.error.format()
      });
    }

    const newField = await db.createField({
      name: validation.data.name,
      soilType: validation.data.soilType,
      irrigationType: validation.data.irrigationType,
      acreage: String(validation.data.acreage),
      latitude: validation.data.latitude !== undefined && validation.data.latitude !== null ? String(validation.data.latitude) : null,
      longitude: validation.data.longitude !== undefined && validation.data.longitude !== null ? String(validation.data.longitude) : null,
      historicalNotes: validation.data.historicalNotes ?? null,
      userId,
    });

    res.status(201).json({ success: true, message: 'Field created successfully', data: newField });
  } catch (error) {
    console.error('[Fields] Error creating field:', error);
    res.status(500).json({ success: false, message: 'Internal server error creating field' });
  }
}
