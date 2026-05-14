# FenceVision 🏗️

**AI Vizualizacija Ograda** | **AI Fence Visualization**

---

## 🇷🇸 Opis (Srpski)

FenceVision je progresivna web aplikacija (PWA) koja vam omogućava da vizualizujete kako će ograda izgledati na vašem imanju. Jednostavno učitajte fotografiju, odaberite tip ograde, nacrtajte gde želite ogradu, i dobijte AI generisane fotorealistične prikaze.

### Mogućnosti:
- 📸 Učitajte fotografiju sa kamere ili galerije
- 🪵 Odaberite tip ograde: drvena, metalna ili betonska
- ✏️ Nacrtajte liniju ograde na fotografiji
- 🤖 AI generiše 3 fotorealistična prikaza (široki, detalj, ugaoni)
- 📥 Preuzmite generisane slike

---

## 🇬🇧 Description (English)

FenceVision is a Progressive Web App (PWA) that lets you visualize how a fence will look on your property. Simply upload a photo, select a fence type, draw where you want the fence, and get AI-generated photorealistic preview images.

### Features:
- 📸 Upload photos from camera or gallery
- 🪵 Choose fence type: wooden, metal, or concrete
- ✏️ Draw fence line on the photo
- 🤖 AI generates 3 photorealistic views (wide shot, detail, angled)
- 📥 Download generated images

---

## 🛠️ Tech Stack

- **Next.js 16** with App Router
- **TypeScript** (strict mode)
- **Tailwind CSS v4**
- **Google Gemini API** (gemini-2.5-flash-image) for image generation
- **Lucide React** for icons

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- A Google Gemini API key

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/fence-vision.git
cd fence-vision
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Gemini API key:

```
GEMINI_API_KEY=your_actual_api_key_here
```

### 4. Get a Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/apikey)
2. Sign in with your Google account
3. Click "Create API key"
4. Copy the key and paste it in `.env.local`

### 5. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 Deploy to Vercel

### Option 1: Deploy via Vercel CLI

```bash
npm i -g vercel
vercel
```

### Option 2: Deploy via GitHub

1. Push your code to GitHub:

```bash
git remote add origin https://github.com/YOUR_USERNAME/fence-vision.git
git push -u origin main
```

2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your GitHub repository
5. In the "Environment Variables" section, add:
   - **Key:** `GEMINI_API_KEY`
   - **Value:** Your Gemini API key
6. Click "Deploy"

### Important Vercel Settings

- **Framework Preset:** Next.js (auto-detected)
- **Node.js Version:** 18.x or later
- **Build Command:** `next build`
- **Output Directory:** `.next`

---

## 📁 Project Structure

```
fence-vision/
├── public/
│   ├── manifest.json         # PWA manifest
│   ├── icons/                # PWA icons (SVG)
│   └── fences/               # Fence preview images
├── src/
│   ├── app/
│   │   ├── layout.tsx        # Root layout with PWA meta
│   │   ├── page.tsx          # Main multi-step wizard
│   │   ├── globals.css       # Global styles
│   │   └── api/generate/     # Gemini API route
│   ├── components/           # UI components
│   │   ├── ImageUploader.tsx
│   │   ├── FenceSelector.tsx
│   │   ├── FenceDrawCanvas.tsx
│   │   ├── ResultGallery.tsx
│   │   └── LoadingState.tsx
│   ├── lib/                  # Utilities
│   │   ├── fences.ts         # Fence configurations
│   │   ├── gemini.ts         # Gemini API client
│   │   └── utils.ts          # Helper functions
│   └── types/                # TypeScript types
│       └── index.ts
├── .env.example
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

---

## 📝 License

MIT
