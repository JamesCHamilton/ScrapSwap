import type { Request, Response } from 'express';
import { supabase } from '../config/supabase.js';

export const getListings = async (req: Request, res: Response) => {
  try {
    const { category, status } = req.query;
    
    let query = supabase
      .from('listings')
      .select(`
        *,
        categories (name, methane_reduction_factor, co2_reduction_factor),
        profiles (username, full_name)
      `);

    if (category) {
      query = query.eq('category_id', category);
    }
    
    if (status) {
      query = query.eq('status', status);
    } else {
      query = query.eq('status', 'available');
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      // Fallback to mock data for demo if DB is empty
      const mockListings = [
        {
          id: 'm1',
          title: "Spent coffee grounds",
          location: "Brooklyn, NY",
          quantity: 50,
          unit: 'lbs',
          categories: { name: 'Organic' },
          industrySource: 'Food & Beverage',
          condition: 'Clean / Dry'
        },
        {
          id: 'm2',
          title: "Denim offcuts (indigo)",
          location: "Jersey City, NJ",
          quantity: 120,
          unit: 'lbs',
          categories: { name: 'Textiles' },
          industrySource: 'Apparel Manufacturing',
          condition: 'Clean / Dry'
        },
        {
          id: 'm3',
          title: "Poly mailers (post-consumer)",
          location: "Newark, NJ",
          quantity: 65,
          unit: 'lbs',
          categories: { name: 'Plastic' },
          industrySource: 'E-commerce',
          condition: 'Mixed'
        }
      ];
      return res.json(mockListings);
    }
    
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getListingById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('listings')
      .select(`
        *,
        categories (*),
        profiles (*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Listing not found' });
    
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createListing = async (req: Request, res: Response) => {
  try {
    const listingData = req.body;
    
    // DEMO HACK: If no supplier_id is provided, use the first available profile
    if (!listingData.supplier_id) {
      const { data: profiles } = await supabase.from('profiles').select('id').limit(1);
      if (profiles && profiles.length > 0) {
        listingData.supplier_id = profiles[0].id;
      } else {
        return res.status(400).json({ error: 'No profiles found in database. Create a user first.' });
      }
    }

    const { data, error } = await supabase
      .from('listings')
      .insert([listingData])
      .select();

    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateListing = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const { data, error } = await supabase
      .from('listings')
      .update(updateData)
      .eq('id', id)
      .select();

    if (error) throw error;
    res.json(data[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteListing = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('listings')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
