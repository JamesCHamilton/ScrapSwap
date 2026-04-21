import { supabase } from './config/supabase.js';

async function seed() {
  console.log("🌱 Starting Seed Process...");

  // 1. Check if Supabase is configured
  try {
    const { data: categories, error: catError } = await supabase.from('categories').select('*');
    if (catError) throw catError;
    console.log(`✅ Connection stable. Found ${categories.length} categories.`);
  } catch (err) {
    console.error("❌ Database connection failed. Is your .env configured properly?");
    process.exit(1);
  }

  // 2. Get the first profile to use as a supplier
  let { data: profiles, error: profError } = await supabase.from('profiles').select('id, username').limit(1);
  
  if (profError || !profiles || profiles.length === 0) {
    console.log("👤 No profiles found. Creating a dummy demo profile...");
    
    // We'll use a random UUID for the demo profile. 
    // Note: In a real app, this would be linked to a Supabase Auth user.
    const demoId = "00000000-0000-0000-0000-000000000000"; 
    
    const { data: newProfile, error: createError } = await supabase
      .from('profiles')
      .upsert([{ 
        id: demoId, 
        username: 'demo_supplier', 
        full_name: 'Demo Supplier',
        role: 'both' 
      }])
      .select();

    if (createError) {
      console.error("❌ Failed to create dummy profile:", createError.message);
      console.log("\n🛠️  FIX: This happens because 'profiles' requires a real Supabase Auth user.");
      console.log("For a quick demo fix, run this in your Supabase SQL Editor:");
      console.log("1. ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;");
      console.log("2. ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;");
      console.log("\n--- or ---");
      console.log("Create a real user in Supabase Dashboard -> Auth -> Users and re-run this script.\n");
      return;
    }
    
    profiles = newProfile;
  }

  const supplierId = profiles![0].id;
  console.log(`👤 Using user '${profiles[0].username}' as the mock supplier.`);

  // 3. Get category IDs
  const { data: cats } = await supabase.from('categories').select('*');
  const getCatId = (name: string) => cats?.find(c => c.name === name)?.id;

  const coffeeId = getCatId('Coffee Grounds');
  const textileId = getCatId('Textiles');
  const plasticId = getCatId('Plastic');
  const foodId = getCatId('Food Waste');
  const woodId = getCatId('Wood Scraps');

  // 4. Seed Listings
  console.log("📦 Seeding Listings...");
  const listings = [
    {
      supplier_id: supplierId,
      category_id: coffeeId,
      title: "Spent Espresso Grounds (High Acidity)",
      description: "Daily fresh grounds from high-volume cafe. Triple-sifted and relatively dry. Perfect for composite materials or high-end fertilizer.",
      quantity: 120,
      unit: "lbs",
      location: "Brooklyn, NY",
      status: "available",
    },
    {
      supplier_id: supplierId,
      category_id: textileId,
      title: "Denim Cut-offs (Indigo Mix)",
      description: "100% cotton denim scraps from boutique manufacturing. Various sizes, mostly strips. Clean and chemical-free.",
      quantity: 250,
      unit: "lbs",
      location: "Jersey City, NJ",
      status: "available",
    },
    {
      supplier_id: supplierId,
      category_id: plasticId,
      title: "LDPE Poly Mailer Scraps",
      description: "Industrial waste from poly mailer production. Post-industrial, clean, consistent white LDPE film.",
      quantity: 500,
      unit: "lbs",
      location: "Newark, NJ",
      status: "available",
    },
    {
      supplier_id: supplierId,
      category_id: foodId,
      title: "Citrus Peel Mix (Lemon & Orange)",
      description: "Freshly squeezed citrus peels. High essential oil content. Suitable for bio-leather prototyping or fragrance extraction.",
      quantity: 80,
      unit: "kg",
      location: "Queens, NY",
      status: "available",
    },
    {
      supplier_id: supplierId,
      category_id: woodId,
      title: "Oak & Walnut Offcuts",
      description: "Premium hardwood scraps from a custom furniture shop. Planed and ready for small-scale turning or craft projects.",
      quantity: 300,
      unit: "lbs",
      location: "Yonkers, NY",
      status: "available",
    }
  ];

  const { error: listErr } = await supabase.from('listings').insert(listings);
  if (listErr) console.error("❌ Error seeding listings:", listErr.message);
  else console.log("✅ 5 Listings added successfully.");

  // 5. Seed Recipes
  console.log("📜 Seeding Recipes...");
  const recipes = [
    {
      category_id: coffeeId,
      title: "Coffee-based Bio-Composite Tiles",
      slug: "coffee-tiles-v1",
      description: "A durable, moisture-resistant tile made from coffee grounds and a starch-based binder.",
      instructions: ["Dry grounds at 120F for 1 hour", "Mix with 20% cornstarch/glycerin binder", "Press into mold at 3000psi", "Cure at room temp for 48 hours"],
      materials_needed: ["Dry spent coffee grounds", "Glycerin", "Cornstarch", "Water", "Hydraulic press"],
      difficulty_level: "medium"
    },
    {
      category_id: textileId,
      title: "Non-Woven Denim Insulation",
      slug: "denim-insulation-batting",
      description: "Thermal and acoustic insulation batting created from shredded denim fibers.",
      instructions: ["Shred scraps into 1-inch fibers", "Blend with 5% polyester binder fiber", "Apply heat and card into 2-inch mats", "Cut to standard wall cavity dimensions"],
      materials_needed: ["Denim scraps", "Bonding fibers", "Carding machine", "Heat oven"],
      difficulty_level: "hard"
    },
    {
      category_id: foodId,
      title: "Pectin-based Citrus Leather",
      slug: "citrus-bioleather",
      description: "Flexible, vegan leather alternative made from citrus pulp and peels.",
      instructions: ["Boil peels to extract pectin", "Blend into smooth pulp", "Add organic plasticizers (glycerin)", "Spread thinly and dehydrate"],
      materials_needed: ["Citrus peels", "Organic glycerin", "Vinegar", "High-power blender"],
      difficulty_level: "medium"
    }
  ];

  const { error: recErr } = await supabase.from('recipes').insert(recipes);
  if (recErr) console.error("❌ Error seeding recipes:", recErr.message);
  else console.log("✅ 3 Recipes added successfully.");

  console.log("🎉 Seed Process Finished!");
}

seed();
