# ScrapSwap ♻️

**"One industry's waste is another's raw material."**

ScrapSwap is a circular economy marketplace designed to bridge the gap between waste producers (suppliers) and sustainable creators. By transforming industrial and consumer waste into valuable resources, we help divert materials from landfills and reduce carbon footprints through data-driven impact tracking and AI-powered material analysis.

---

## 🌟 Key Features

- **Waste-to-Resource Catalog**: A marketplace for browsing and listing various waste materials (textiles, wood, plastics, organics, etc.).
- **AI Vision Scanner**: Upload images of waste to automatically identify materials and receive upcycling suggestions powered by GPT-4o.
- **Impact Dashboard**: Real-time tracking of environmental metrics, including total weight diverted and CO₂ equivalent savings.
- **Matching Engine**: Intelligent suggestions connecting suppliers with creators based on material categories and location.
- **DIY Recipe Library**: A community-driven repository of step-by-step instructions for repurposing specific waste streams.

---

## 🛠 Tech Stack

### Frontend
- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Icons/Components**: Custom UI system with Framer Motion animations.

### Backend
- **Framework**: [Express.js](https://expressjs.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL)
- **AI**: [OpenAI GPT-4o](https://openai.com/index/gpt-4o-and-more-capabilities-to-chatgpt/) (Vision API)
- **Deployment**: [Vercel](https://vercel.com/) (Backend via Vercel Functions)

---

## 📂 Project Structure

```text
ScrapSwap/
├── backend/            # Express API with Supabase integration
│   ├── src/
│   │   ├── controllers/# Route handlers
│   │   ├── services/   # Business logic (AI, Impact calculations)
│   │   └── routes/     # API Endpoints
│   └── supabase/       # SQL Schema and migrations
└── frontend/           # Next.js Web Application
    ├── src/
    │   ├── app/        # Pages and layouts
    │   ├── components/ # Reusable React components
    │   └── lib/        # API clients and utility functions
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A Supabase account and project
- An OpenAI API Key (for the Scan feature)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/scrapswap.git
   cd scrapswap
   ```

2. **Set up the Backend**:
   ```bash
   cd backend
   npm install
   # Create a .env file based on .env.example
   # Add your SUPABASE_URL, SUPABASE_ANON_KEY, and OPENAI_API_KEY
   npm run dev
   ```

3. **Set up the Frontend**:
   ```bash
   cd ../frontend
   npm install
   # Create a .env.local file
   # NEXT_PUBLIC_API_URL=http://localhost:5000
   npm run dev
   ```

---

## 📊 Database Schema

The system uses a relational PostgreSQL schema managed via Supabase. Key tables include:

- **Profiles**: Extended user data (Suppliers/Creators).
- **Listings**: Waste materials available for exchange.
- **Categories**: Material types with associated environmental impact factors.
- **Recipes**: Instructions for upcycling projects.
- **Impact Reports**: Records of diverted waste for sustainability auditing.
- **Scans**: History of AI-powered material classifications.

*See `backend/supabase/schema.sql` for the full SQL definition.*

---

## 🔌 API Endpoints (Quick Reference)

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/listings` | `GET` | Fetch all active waste listings |
| `/api/listings` | `POST` | Create a new listing |
| `/api/ai/analyze` | `POST` | Classify waste material from image |
| `/api/recipes` | `GET` | Browse upcycling instructions |
| `/api/impact/report`| `POST` | Log a successful waste diversion |

---

## 🌍 Impact Calculation
Our engine calculates savings using category-specific factors:
- **Methane Reduction**: Targeted primarily at organic waste diversion.
- **CO₂ Equivalent**: Based on the lifecycle emissions avoided by using recycled materials instead of virgin ones.

---

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.
