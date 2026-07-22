# SD Gold Hub

A premium, luxury B2B and B2C e-commerce ecosystem built for trading authenticated 22K and 24K gold masterpieces, sovereign bullion, and heritage temple jewelry.

## Key Features

- **Fluid Edge-to-Edge UI:** An immersive, high-end design aesthetic using dark navy vault colors (`#0A1021`) accented by sovereign gold (`#C5A059`).
- **Comprehensive E-Commerce Directory:** A high-performance product catalog with robust filtering and edge-to-edge product grids.
- **Sovereign Live Auctions:** Real-time heritage bidding system for high-society jewelry and rare bullion.
- **Vendor Dashboards & Showrooms:** Dedicated public profiles and management interfaces for verified jewelers and BVC insured vendors.
- **Impersonation System:** Admin bypass and impersonation architecture for managing complex B2B vendor state.
- **Real-Time Data Sync:** (Work in progress) Firebase/Firestore integration for live inventory and pricing.

## Technology Stack

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS v4
- **Language:** TypeScript
- **Icons:** Lucide React
- **Backend/Database:** Firebase / Firestore (In Progress)
- **State Management:** React Hooks

## Local Development Setup

To run this project on your local machine, follow these steps:

### 1. Clone the repository

```bash
git clone https://github.com/odishamedical/sd-gold-hub.git
cd sd-gold-hub
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a new file named `.env.local` in the root of the project. You can use the `.env.example` file as a template:

```bash
cp .env.example .env.local
```

Fill in the required Firebase credentials and other keys in `.env.local`.

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Contribution Guidelines

1. Ensure your code follows the established Prettier formatting (if configured) or linting rules by running `npm run lint`.
2. Follow the fluid, edge-to-edge UI paradigms established in `src/app/shop/page.tsx` and `src/app/product/[id]/page.tsx`.
3. Submit a Pull Request detailing the purpose of the change.

## License

Private and Confidential - SD Gold Ecosystem
