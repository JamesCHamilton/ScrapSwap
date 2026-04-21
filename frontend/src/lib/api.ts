const isProd = process.env.NODE_ENV === "production";
const API_BASE_URL = isProd 
  ? "/api" // Vercel rewrite handles this
  : (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000");


export async function fetchListings() {
  const response = await fetch(`${API_BASE_URL}/listings`);
  if (!response.ok) {
    throw new Error("Failed to fetch listings");
  }
  return response.json();
}

export async function fetchRecipes() {
  const response = await fetch(`${API_BASE_URL}/recipes`);
  if (!response.ok) {
    throw new Error("Failed to fetch recipes");
  }
  return response.json();
}

export async function fetchRecipeBySlug(slug: string) {
  const response = await fetch(`${API_BASE_URL}/recipes/slug/${slug}`);
  if (!response.ok) {
    throw new Error("Failed to fetch recipe");
  }
  return response.json();
}

export async function fetchCategories() {
  const response = await fetch(`${API_BASE_URL}/categories`);
  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }
  return response.json();
}

export async function createListing(data: any) {
  const response = await fetch(`${API_BASE_URL}/listings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to create listing");
  }
  return response.json();
}

export async function calculateImpact(data: any) {
  const response = await fetch(`${API_BASE_URL}/impact/calculate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Failed to calculate impact");
  }
  return response.json();
}

export async function analyzeImage(base64Image: string) {
  const response = await fetch(`${API_BASE_URL}/ai/classify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ image: base64Image }),
  });
  if (!response.ok) {
    throw new Error("Failed to analyze image");
  }
  return response.json();
}
