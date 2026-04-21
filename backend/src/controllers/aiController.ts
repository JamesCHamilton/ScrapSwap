import type { Request, Response } from 'express';
import { classifyWaste } from '../services/aiService.js';
import { supabase } from '../config/supabase.js';

export const analyzeImage = async (req: Request, res: Response) => {
  try {
    const { image } = req.body; // Base64 string

    if (!image) {
      return res.status(400).json({ error: 'Image data is required' });
    }

    const classification = await classifyWaste(image);

    // Optional: Log the scan to the database
    // In a real hackathon, this is a great "wow" factor for the judges
    const { data: scanData, error: scanError } = await supabase
      .from('scans')
      .insert([{
        material_name: classification.material_name,
        category: classification.category,
        suggested_use: classification.suggested_use,
        // user_id can be added if auth is used
      }])
      .select();

    if (scanError) {
      console.warn("Could not log scan to database:", scanError.message);
    }

    res.json({
      ...classification,
      logged: !!scanData
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
