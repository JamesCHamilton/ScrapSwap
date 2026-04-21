import type { Request, Response } from 'express';
import { supabase } from '../config/supabase.js';
import { calculateImpact } from '../services/impactCalculator.js';

export const createImpactReport = async (req: Request, res: Response) => {
  try {
    const { user_id, listing_id, weight_diverted, category_id } = req.body;

    // Fetch category factors
    const { data: category, error: catError } = await supabase
      .from('categories')
      .select('methane_reduction_factor, co2_reduction_factor')
      .eq('id', category_id)
      .single();

    if (catError) throw catError;

    const impact = calculateImpact(
      weight_diverted,
      category.methane_reduction_factor,
      category.co2_reduction_factor
    );

    const { data, error } = await supabase
      .from('impact_reports')
      .insert([{
        user_id,
        listing_id,
        weight_diverted,
        methane_saved: impact.methaneSaved,
        co2_equivalent_saved: impact.co2Saved
      }])
      .select();

    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserImpact = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { data, error } = await supabase
      .from('impact_reports')
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;

    const totals = data.reduce((acc, curr) => ({
      totalWeight: acc.totalWeight + curr.weight_diverted,
      totalMethane: acc.totalMethane + curr.methane_saved,
      totalCO2: acc.totalCO2 + curr.co2_equivalent_saved
    }), { totalWeight: 0, totalMethane: 0, totalCO2: 0 });

    res.json({ reports: data, totals });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
