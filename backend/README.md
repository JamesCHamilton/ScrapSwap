# ScrapSwap Backend API

The backend API for the ScrapSwap platform, built with Node.js, Express, and Supabase.

## Features
- **Waste-to-Resource Catalog**: CRUD operations for waste listings.
- **Impact Calculation**: Automated methane and CO2 reduction tracking.
- **Recipe Library**: Browse DIY instructions for sustainable projects.
- **Matching Engine**: Suggestions based on material categories.

## Tech Stack
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **API Documentation**: [Endpoint List](#endpoints)

## Getting Started

### Prerequisites
- Node.js 18+
- A Supabase Project

### Installation
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   - Copy `.env.example` to `.env`.
   - Fill in your `SUPABASE_URL` and `SUPABASE_ANON_KEY`.

4. Run the development server:
   ```bash
   npm run dev
   ```

## Endpoints

### Listings
- `GET /api/listings`: Get all available listings.
- `GET /api/listings/:id`: Get a specific listing.
- `POST /api/listings`: Create a new waste listing.
- `PUT /api/listings/:id`: Update a listing.
- `DELETE /api/listings/:id`: Remove a listing.

### Categories
- `GET /api/categories`: List all material categories and their impact factors.

### Recipes
- `GET /api/recipes`: List all recipes.
- `GET /api/recipes?category=ID`: List recipes by category.

### Impact
- `POST /api/impact/report`: Log a waste diversion event.
- `GET /api/impact/user/:userId`: Get impact stats for a specific user.

## Database Schema
The schema is defined in `supabase/schema.sql`. You can apply this in your Supabase SQL Editor.
