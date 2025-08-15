# 🌊 Floodzy - Real-time Flood Detection & Weather Monitoring System

<div align="center">
  <img src="public/assets/banjir.png" alt="Floodzy Logo" width="200"/>
  
  <p align="center">
    <strong>Comprehensive flood monitoring, weather tracking, and early warning platform for Indonesia</strong>
  </p>
  
  <p align="center">
    <img src="https://img.shields.io/badge/Next.js-13-black?style=for-the-badge&logo=next.js" alt="Next.js"/>
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript" alt="TypeScript"/>
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS"/>
    <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase" alt="Supabase"/>
  </p>
</div>

---

## 🚀 Overview
Floodzy adalah sistem pemantauan banjir dan peringatan dini real-time yang memanfaatkan teknologi modern seperti **Next.js**, **TypeScript**, **Tailwind CSS**, dan **Supabase**.  
Platform ini menyediakan data ketinggian air, status pompa, prakiraan cuaca, analisis bencana, dan peta interaktif untuk mendukung mitigasi bencana di Indonesia.

---

## ✨ Features

### 🗺️ Mapping & Visualization
- Peta interaktif berbasis Leaflet dengan marker sensor.
- Layer banjir, cuaca, dan titik evakuasi.
- Map legend dan kontrol interaktif.

### 🌡️ Weather & Flood Data
- Data cuaca real-time (temperatur, kelembapan, kecepatan angin).
- Integrasi OpenWeatherMap.
- Riwayat cuaca & banjir.

### 🚨 Alerts & Analysis
- Peringatan bencana dengan sumber data terintegrasi.
- Analisis bencana otomatis menggunakan Gemini API.
- Ringkasan berita bencana.

### 📍 Region & Evacuation
- Pilihan wilayah hingga tingkat kota/kecamatan.
- Informasi jalur & titik evakuasi.

### 💬 User Interaction
- Laporan banjir langsung dari pengguna.
- Chatbot informasi banjir & cuaca.

### 🛠 Developer Friendly
- API publik (`/api`) untuk integrasi data.
- Custom hooks untuk pengelolaan state & UI.

---

## 📁 Project Structure

```plaintext
floodzy/
├── 📂 app/                               # Halaman utama & API Routes (Next.js App Router)
│   ├── 📂 api/                           # Endpoint API
│   │   ├── 📂 analysis/route.ts          # Analisis bencana berbasis AI
│   │   ├── 📂 alerts-data/route.ts       # Data peringatan bencana
│   │   ├── 📂 chatbot/route.ts           # Chatbot banjir
│   │   ├── 📂 evakuasi/route.ts          # Titik evakuasi
│   │   ├── 📂 gemini-alerts/route.ts     # Peringatan AI (Gemini)
│   │   ├── 📂 gemini-analysis/route.ts   # Analisis AI (Gemini)
│   │   ├── 📂 health/route.ts            # Health check API
│   │   ├── 📂 laporan/route.ts           # Laporan banjir pengguna
│   │   ├── 📂 petabencana-proxy-new/route.ts # Proxy API PetaBencana
│   │   ├── 📂 pump-status-proxy/route.ts # Status pompa banjir
│   │   ├── 📂 regions/route.ts           # Data wilayah
│   │   ├── 📂 summarize-news-batch/route.ts # Ringkasan berita bencana
│   │   ├── 📂 water-level-proxy/route.ts # Data ketinggian air
│   │   ├── 📂 weather/                   # Data cuaca
│   │   │   ├── route.ts                  # Cuaca saat ini
│   │   │   └── 📂 tiles/[...tile]/route.ts # Tile map cuaca
│   │   └── 📂 weather-history/route.ts   # Riwayat cuaca
│   ├── 📄 data-sensor/page.tsx           # Halaman data sensor IoT
│   ├── 📄 info-evakuasi/page.tsx         # Info titik evakuasi
│   ├── 📄 lapor-banjir/page.tsx          # Form laporan banjir
│   ├── 📄 peta-banjir/page.tsx           # Peta banjir interaktif
│   ├── 📄 peringatan/page.tsx            # Peringatan bencana
│   ├── 📄 prakiraan-cuaca/page.tsx       # Prakiraan cuaca
│   ├── 📄 settings/page.tsx              # Pengaturan aplikasi
│   ├── 📄 statistika/page.tsx            # Statistik banjir
│   ├── 📄 test/route.ts                  # Endpoint testing
│   ├── 🎨 globals.css                    # Style global
│   ├── 📄 layout.tsx                     # Layout utama
│   ├── 📄 page.tsx                       # Landing page
│   └── 📄 state.ts                       # State management global
│
├── 📂 components/                        # Komponen UI & modul
│   ├── background/                       # Efek background
│   ├── contexts/                         # Context API
│   ├── data-sensor/                      # Komponen analisis data sensor
│   ├── dashboard/                        # Statistik & analisis
│   ├── flood/                            # Kartu & alert banjir
│   ├── layout/                           # Header, Sidebar
│   ├── map/                              # Peta & kontrol
│   ├── modals/                           # Modal popup
│   ├── providers/                        # Provider global
│   ├── region-selector/                  # Dropdown wilayah
│   ├── ui/                               # Shadcn/UI reusable components
│   └── weather/                          # Komponen cuaca
│
├── 📂 hooks/                             # Custom React Hooks
│   ├── useAirPollutionData.ts
│   ├── useBmkgQuakeData.ts
│   ├── useDebounce.ts
│   ├── useDisasterData.ts
│   ├── useMediaQuery.ts
│   ├── usePumpStatusData.ts
│   ├── useRegionData.ts
│   ├── useTheme.tsx
│   ├── use-toast.ts
│   └── useWaterLevelData.ts
│
├── 📂 lib/                               # Utilities & service API
│   ├── supabase/                         # Supabase client/server
│   ├── api.client.ts
│   ├── api.server.ts
│   ├── api.ts
│   ├── constants.ts
│   ├── fetch-utils.ts
│   ├── geocodingService.ts
│   ├── supabase.ts
│   ├── supabaseAdmin.ts
│   └── utils.ts
│
├── 📂 public/                            # Aset publik
│   ├── assets/                           # Gambar, ikon
│   └── leaflet/images/                   # Ikon peta
│
├── 📂 types/                             # TypeScript types
│   ├── airPollution.ts
│   ├── geocoding.ts
│   ├── index.d.ts
│   └── index.ts
│
├── ⚙️ Konfigurasi & metadata
│   ├── .bolt/                            # Config Bolt AI
│   ├── .eslintrc.json
│   ├── .gitignore
│   ├── next.config.js
│   ├── postcss.config.js
│   ├── tsconfig.json
│   ├── package.json
│   ├── package-lock.json
│   ├── components.json
│   ├── commit_message.txt
│   ├── eslint-errors.txt
│   ├── ts-errors.txt
│   ├── build.log
│   ├── test-supabase.js
│   └── README.md

```
| Endpoint                 | Deskripsi                              | Parameter            |
| ------------------------ | -------------------------------------- | -------------------- |
| `/api/analysis`          | Analisis data bencana berbasis AI      | -                    |
| `/api/alerts-data`       | Data peringatan bencana                | -                    |
| `/api/chatbot`           | Chatbot informasi banjir & cuaca       | `message`            |
| `/api/evakuasi`          | Titik evakuasi terdekat                | `regionId`           |
| `/api/gemini-alerts`     | Peringatan otomatis berbasis Gemini AI | -                    |
| `/api/gemini-analysis`   | Analisis mendalam banjir berbasis AI   | -                    |
| `/api/laporan`           | Laporan banjir pengguna                | `location`, `status` |
| `/api/pump-status-proxy` | Status pompa banjir                    | `pumpId`             |
| `/api/regions`           | Daftar wilayah monitoring              | -                    |
| `/api/water-level-proxy` | Ketinggian air                         | `stationId`          |
| `/api/weather`           | Cuaca terkini                          | `lat`, `lon`         |
| `/api/weather-history`   | Riwayat cuaca                          | `regionId`           |



🪝 Custom Hooks

useRegionData → Data wilayah & monitoring

usePumpStatusData → Status pompa banjir

useWaterLevelData → Data ketinggian air

useAirPollutionData → Data kualitas udara

useBmkgQuakeData → Data gempa dari BMKG

useDisasterData → Data bencana umum

useTheme → Manajemen tema UI

useDebounce → Input debouncing

use-toast → Notifikasi toast

## 💻 Usage

```plaintext
Basic Usage:
├── Jalankan development server:
│   └── npm run dev
├── Buka aplikasi:
│   └── http://localhost:3000
├── Pilih wilayah:
│   └── Gunakan dropdown atau klik peta
└── Pantau informasi:
    └── Lihat data banjir, cuaca, dan analisis bencana

Advanced Usage:
├── Kirim laporan banjir:
│   └── Menu "Lapor Banjir"
├── Gunakan chatbot:
│   └── Informasi cepat banjir & cuaca
└── Analisis bencana:
    └── Lihat hasil analisis AI di dashboard

```
🔧 Configuration

Buat file .env.local di root project dengan isi:

NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
OPENWEATHER_API_KEY=...
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=...

📊 Performance

Lighthouse Score: 95+

First Contentful Paint (FCP): < 1.5 detik

Time to Interactive (TTI): < 3 detik

🛡️ Security

Supabase Row Level Security (RLS)

Server-side Validation untuk semua input

API Keys disimpan di environment variables

## 🌟 Roadmap

- [x] 🌊 **Monitoring Banjir Dasar** – Peta interaktif & data ketinggian air.
- [x] 🌦 **Integrasi Cuaca & Peta** – Data cuaca real-time, prakiraan, dan visualisasi.
- [x] 📱 **Aplikasi Mobile** – Versi Android & iOS untuk pemantauan di genggaman.
- [x] 🤖 **Prediksi AI Banjir** – Analisis risiko banjir berbasis Machine Learning.
- [x] 📡 **Integrasi IoT Sensor** – Data real-time dari sensor fisik lapangan.
- [x] 🗣 **Laporan Komunitas** – Sistem pelaporan banjir berbasis partisipasi warga.



🎉 Acknowledgments

OpenWeatherMap

Supabase

Leaflet

BMKG

Kementerian PUPR



MIT License

Copyright (c) 2025 Matt

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
