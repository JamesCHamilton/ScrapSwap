export type UserRole = 'supplier' | 'creator' | 'both';
export type ListingStatus = 'available' | 'pending' | 'sold' | 'archived';
export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface Profile {
  id: string;
  username: string;
  full_name: string;
  role: UserRole;
  avatar_url?: string;
  website?: string;
  bio?: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  methane_reduction_factor: number;
  co2_reduction_factor: number;
  created_at: string;
}

export interface Listing {
  id: string;
  supplier_id: string;
  category_id: number;
  title: string;
  description?: string;
  quantity: number;
  unit: string;
  price: number;
  location?: string;
  image_url?: string;
  status: ListingStatus;
  created_at: string;
  updated_at: string;
}

export interface Recipe {
  id: string;
  category_id: number;
  creator_id?: string;
  title: string;
  description?: string;
  instructions: any; // JSONB
  materials_needed: any; // JSONB
  difficulty_level: DifficultyLevel;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface ImpactReport {
  id: string;
  user_id: string;
  listing_id?: string;
  category_id: number;
  weight_diverted: number;
  methane_saved: number;
  co2_equivalent_saved: number;
  created_at: string;
}
