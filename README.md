# CELestia — Redefined For All. ✨

> **CELestia** is a luxury digital flagship and high-fashion eCommerce platform for handcrafted Indian artisanal bangles, anti-tarnish fine jewellery, and bespoke celebration hampers.

---

## 🌟 Key Experience Highlights

1. **Fullscreen Scroll-Controlled Fashion Film Opening**:
   - $100\text{vh} \times 100\text{vw}$ full-screen video scrubbing engine with smooth `requestAnimationFrame` lerping.
   - Transitions into a multi-stage kinetic 3D typography and real product stage.

2. **Atelier Sound Synthesizer (Web Audio API)**:
   - Polyphonic harmonic chord pads (Cmaj9 / Fmaj7 voicing) with analog low-pass filtering and bell sparkles.
   - Automatically activates when scrolling past the film opening with live user audio state synchronization.

3. **Curated 5 Realms (The Collections)**:
   - *Artisanal Bangles* (Dual-tone pink and blue enamel, white pearl lustre, Kashmiri filigree).
   - *Fine Jewellery & Sets* (Anti-tarnish rings, red emerald suite, statement jhumkas).
   - *Bespoke Hampers & Gifting* (Desi Barbie, Purple Tulip boxes with double-satin ribbons).
   - *Polaroids & Personalised* (Custom 20-pack retro glossy polaroids with wax-sealed notes).
   - *Charms & Accessories* (Honeybee keychains, crochet charms).

4. **Complete Commerce & Customer Experience**:
   - **Dedicated Wishlist Suite**: Live heart icon in navigation with count badge, card-level saving, and persistent storage.
   - **Full Bag & Cart Drawer**: Free-shipping progress bar, promo code validation (`CELESTIA10`), custom note builder.
   - **Real Authentication & Member Hub**: Register, Login, dynamic Saved Addresses, Order Tracking, and session persistence.
   - **WhatsApp Concierge & Instant Ordering**: Direct payload generation for Pan-India express delivery and Mumbai same-day dispatch.

5. **High-Contrast Editorial Aesthetics**:
   - Deep Espresso (`#181411`), Pearl Ivory (`#FAF7F0`), Champagne Gold (`#D8C39A`), and Muted Gold design token architecture.

---

## 🛠️ Tech Stack

- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **3D & Graphics**: Three.js / WebGL (`@react-three/fiber`, `@react-three/drei`)
- **Animation**: GSAP, Lenis Smooth Scroll, Lucide Icons
- **Audio Engine**: Web Audio API Polyphonic Synthesizer

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Production Build
```bash
npm run build
```

---

## 🏛️ Project Structure

```
├── public/
│   ├── assets/
│   │   ├── founder/       # Approved founder portraits
│   │   └── products/      # Real product photography
│   └── videos/            # Opening fashion film slot (celestia-opening.mp4)
├── src/
│   ├── canvas/            # Three.js 3D product stages
│   ├── components/
│   │   ├── layout/        # Navigation, Footer, Modals, Drawers
│   │   ├── sections/      # 8-Act Homepage Experience
│   │   └── ui/            # Buttons, Badges, Loaders
│   ├── context/           # AuthContext, CartContext
│   ├── data/              # Real Shopify Product & Brand Catalog
│   ├── pages/             # All 15 Platform Routes
│   └── utils/             # Web Audio API Engine
└── package.json
```

---

© 2026 CELestia Amor. All rights reserved. • *redefined for all.*
