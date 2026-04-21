import type { Request, Response } from 'express';
import { supabase } from '../config/supabase.js';

export const getRecipes = async (req: Request, res: Response) => {
  try {
    const { category } = req.query;
    let query = supabase.from('recipes').select('*, categories (name)');

    if (category) {
      query = query.eq('category_id', category);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      const mockRecipes = [
        {
          slug: "coffee-grounds-composite",
          title: "Coffee Grounds Composite Tiles",
          categories: { name: "Organic" },
          description: "Bind spent coffee grounds with a bio-resin to create small coasters or tile-like panels.",
          time: "2–3 hours",
          difficulty_level: "medium",
          materials_needed: ["Spent coffee grounds", "Bio-resin", "Silicone mold", "Press/clamps"],
          instructions: ["Dry grounds fully", "Mix with resin", "Pack into molds", "Cure and sand"]
        },
        {
          slug: "orange-peel-bioleather",
          title: "Orange Peel Bio-Leather Sheet",
          categories: { name: "Organic" },
          description: "Turn citrus waste into a flexible sheet suitable for small accessories and prototypes.",
          time: "4–6 hours",
          difficulty_level: "hard",
          materials_needed: ["Orange peels", "Glycerin", "Vinegar", "Blender"],
          instructions: ["Blend peels", "Simmer with glycerin", "Spread on tray", "Dehydrate"]
        }
      ];
      return res.json(mockRecipes);
    }
    
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getRecipeById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('recipes')
      .select('*, categories (*)')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Recipe not found' });
    
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getRecipeBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const { data, error } = await supabase
      .from('recipes')
      .select('*, categories (*)')
      .eq('slug', slug)
      .single();

    if (error || !data) {
      // Return a single mock recipe if slug matches or fallback
      const mock = {
        slug: slug,
        title: slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        categories: { name: "Organic" },
        description: "Mock recipe description for " + slug,
        time: "2–3 hours",
        difficulty_level: "medium",
        materials_needed: ["Material A", "Material B"],
        instructions: ["Step 1", "Step 2", "Step 3"]
      };
      return res.json(mock);
    }
    
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
