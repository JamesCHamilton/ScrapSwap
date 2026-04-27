# ScrapSwap Frontend 🎨

The user interface for ScrapSwap, built with Next.js, TypeScript, and Tailwind CSS. It provides a seamless experience for browsing waste materials, scanning items with AI, and tracking environmental impact.

## 🚀 Key Features

- **Circular Marketplace**: Interactive catalog for browsing and filtering waste materials.
- **AI Scan Interface**: Drag-and-drop or camera upload for instant material classification.
- **Impact Visualization**: Dashboards showing waste diversion metrics and CO₂ savings.
- **Recipe Browser**: Step-by-step guides for upcycling projects.
- **Responsive Design**: Fully optimized for both desktop and mobile users.

## 🛠 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **State Management**: React Hooks & Context API
- **API Client**: Fetch API with custom wrappers

## 📦 Getting Started

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root of the `frontend` directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🏗 Project Structure

- `src/app/`: Next.js pages and layouts.
- `src/components/`: Reusable UI components (Buttons, Cards, Modals).
- `src/lib/`: Utility functions, API clients, and constants.
- `public/`: Static assets (images, fonts, icons).

## 🎨 Design System

We use a custom design system defined in `tailwind.config.ts`.
- **Colors**: A "Scrap" palette featuring earthy greens (`scrap-600`), creams, and dark industrial grays.
- **Typography**: Optimized for readability with a focus on hierarchy.
- **Spacing**: Consistent 4px/8px grid system.

## 🌐 Deployment

The frontend is ready for deployment on [Vercel](https://vercel.com/).
Ensure the `NEXT_PUBLIC_API_URL` environment variable is set to your production backend URL.
