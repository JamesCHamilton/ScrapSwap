# ScrapSwap Backend API ⚙️

The robust backend infrastructure for the ScrapSwap platform, built with Node.js, Express, and Supabase. This API handles everything from real-time waste material listings to AI-powered image analysis and environmental impact calculations.

## 🚀 Key Features

- **Waste Listing Management**: Full CRUD operations for circular economy material exchanges.
- **AI Material Classification**: Integration with OpenAI GPT-4o Vision to identify waste and suggest upcycling paths.
- **Sustainability Engine**: Automated calculation of CO₂e and Methane reduction based on material diversion weight.
- **Recipe & Category Registry**: Management of upcycling instructions and standardized material categories.
- **Supabase Integration**: Secure data persistence with Row Level Security (RLS) and real-time capabilities.

## 🛠 Tech Stack

- **Framework**: [Express.js](https://expressjs.com/) (running as Serverless Functions on Vercel)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL)
- **AI**: [OpenAI GPT-4o](https://openai.com/)
- **Logging**: [Morgan](https://github.com/expressjs/morgan)
- **Dev Tools**: [tsx](https://tsx.is/) (for fast TypeScript execution)

## 📦 Getting Started

### Prerequisites
- Node.js 18+
- A Supabase Project
- OpenAI API Key

### Installation

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the `backend` directory:
   ```env
   PORT=5000
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   OPENAI_API_KEY=your_openai_api_key
   ```

4. Seed the database (Optional):
   ```bash
   npm run seed
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## 🏗 Project Structure

- `src/controllers/`: Route handlers and request validation.
- `src/routes/`: API endpoint definitions and middleware mapping.
- `src/services/`: Core business logic (AI classification, impact math).
- `src/config/`: Configuration for external services (Supabase, OpenAI).
- `supabase/`: Database schema (`schema.sql`) and migration scripts.

## 🔌 API Documentation

### Listings (`/listings`)
- `GET /listings`: Retrieve all available material listings.
- `POST /listings`: Create a new waste listing.
- `GET /listings/:id`: Get detailed info for a specific listing.

### AI Scanner (`/ai`)
- `POST /ai/analyze`: Send a base64 image to receive material classification and upcycling suggestions.

### Impact Tracking (`/impact`)
- `POST /impact/report`: Log a diversion event to calculate and store environmental savings.
- `GET /impact/user/:userId`: Fetch total sustainability stats for a specific user.

### Recipes & Categories (`/recipes`, `/categories`)
- `GET /recipes`: List all upcycling recipes.
- `GET /categories`: List all material categories and their associated reduction factors.

## 🌍 Impact Math
We use the following logic in `src/services/impactCalculator.ts`:
- **CO₂e Saved** = `Weight (kg)` × `Category CO₂ Factor`
- **Methane Saved** = `Weight (kg)` × `Category Methane Factor` (primarily for Organic/Food waste)

## 🌐 Deployment
The backend is designed to be deployed as **Vercel Functions**.
Ensure all environment variables are added to your Vercel project settings.
