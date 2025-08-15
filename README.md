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




## 📁 Project Structure

```plaintext
floodzy/
├── app/                      # Halaman utama & API Routes
│   ├── api/                  # Endpoint API
│   │   ├── analysis/route.ts               # Analisis bencana
│   │   ├── alerts-data/route.ts            # Data peringatan
│   │   ├── chatbot/route.ts                # Chatbot banjir
│   │   ├── evakuasi/route.ts               # Titik evakuasi
│   │   ├── gemini-alerts/route.ts          # Peringatan berbasis AI
│   │   ├── gemini-analysis/route.ts        # Analisis bencana AI
│   │   ├── laporan/route.ts                # Laporan banjir pengguna
│   │   ├── pump-status-proxy/route.ts      # Status pompa banjir
│   │   ├── regions/route.ts                # Data wilayah
│   │   ├── summarize-news-batch/route.ts   # Ringkasan berita
│   │   ├── water-level-proxy/route.ts      # Data ketinggian air
│   │   ├── weather/route.ts                # Cuaca saat ini
│   │   ├── weather-history/route.ts        # Riwayat cuaca
│   │   └── ...
│   ├── peta-banjir/page.tsx                # Halaman peta banjir
│   ├── lapor-banjir/page.tsx               # Form laporan banjir
│   ├── prakiraan-cuaca/page.tsx            # Prakiraan cuaca
│   ├── statistika/page.tsx                 # Statistik banjir
│   └── ...
├── components/              # Komponen UI & modul
│   ├── dashboard/           # Statistik & analisis
│   ├── flood/               # Kartu & alert banjir
│   ├── map/                 # Komponen peta
│   ├── weather/             # Tampilan data cuaca
│   ├── ui/                  # Shadcn/UI reusable components
│   └── ...
├── hooks/                   # Custom React Hooks
│   ├── useAirPollutionData.ts
│   ├── useBmkgQuakeData.ts
│   ├── useDisasterData.ts
│   ├── usePumpStatusData.ts
│   ├── useRegionData.ts
│   └── ...
├── lib/                     # Utility & service API
│   ├── supabase/            # Client & server Supabase
│   ├── api.client.ts
│   ├── api.server.ts
│   ├── geocodingService.ts
│   └── ...
├── public/                  # Aset publik (gambar, ikon)
├── types/                   # Definisi TypeScript types
└── ...


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

useRegionData → Data wilayah & monitoring.

usePumpStatusData → Status pompa banjir.

useWaterLevelData → Data ketinggian air.

useAirPollutionData → Data kualitas udara.

useBmkgQuakeData → Data gempa dari BMKG.

useDisasterData → Data bencana umum.

useTheme → Manajemen tema UI.

useDebounce → Input debouncing.

use-toast → Notifikasi toast.

💻 Usage

Basic

Jalankan npm run dev

Buka http://localhost:3000

Pilih wilayah di dropdown/map.

Lihat data banjir, cuaca, dan analisis.

Advanced

Kirim laporan banjir via menu Lapor Banjir.

Gunakan chatbot untuk informasi cepat.

Lihat analisis bencana di dashboard.

🔧 Configuration

Buat file .env.local:

NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
OPENWEATHER_API_KEY=...
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=...

📊 Performance

Lighthouse Score: 95+

FCP: < 1.5s

TTI: < 3s

🛡️ Security

Supabase Row Level Security (RLS)

Validasi input di server

API key aman di environment variables

🌟 Roadmap

 Monitoring banjir dasar

 Integrasi cuaca & peta

 Aplikasi mobile

 Prediksi AI banjir

 IoT sensor

 Laporan komunitas

🎉 Acknowledgments

OpenWeatherMap

Supabase

Leaflet

BMKG

Kementerian PUPR
