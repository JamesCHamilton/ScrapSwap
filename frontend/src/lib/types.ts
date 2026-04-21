export type MaterialType = "Organic" | "Textile" | "Plastic" | "Food Waste" | "Wood Scraps" | "Coffee Grounds";
export type Condition = "Clean / Dry" | "Mixed" | "Wet";

export type Category = {
  id: number;
  name: string;
  slug: string;
  description: string;
  methane_reduction_factor: number;
  co2_reduction_factor: number;
};

export type WasteListing = {
  id: string;
  supplier_id?: string;
  category_id?: number;
  title: string;
  description?: string;
  quantity?: number;
  unit?: "kg" | "lbs" | "grams" | "yards" | "tonnes";
  price?: number;
  location: string;
  image_url?: string;
  status?: "available" | "pending" | "sold" | "archived";
  created_at?: string;
  updated_at?: string;
  
  // Virtual/Joined fields
  materialType?: string; // Mapped from categories.name
  weightLbs?: number; // Mapped from quantity and unit
  industrySource?: string; // Mapped from categories.name
  condition?: string; // Optional for frontend UI
  tags?: string[]; // Optional for frontend UI
  categories?: {
    name: string;
    methane_reduction_factor: number;
    co2_reduction_factor: number;
  };
};

export type Recipe = {
  id?: string;
  slug?: string;
  title: string;
  category_id?: number;
  description?: string;
  summary?: string; // For frontend compatibility
  time?: string; // For frontend compatibility
  difficulty_level?: "easy" | "medium" | "hard";
  difficulty?: "Easy" | "Medium" | "Advanced"; // For frontend compatibility
  materials_needed?: string[] | any;
  materials?: string[]; // For frontend compatibility
  instructions?: string[] | any;
  steps?: string[]; // For frontend compatibility
  suitableFor?: string[]; // Mapped from categories.name
  image_url?: string;
  categories?: {
    name: string;
  };
};

