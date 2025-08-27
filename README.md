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
.
├── app
│   ├── api
│   │   ├── analysis
│   │   │   └── route.ts
│   │   ├── alerts-data
│   │   │   └── route.ts
│   │   ├── chatbot
│   │   │   └── route.ts
│   │   ├── evakuasi
│   │   │   └── route.ts
│   │   ├── gemini-alerts
│   │   │   └── route.ts
│   │   ├── gemini-analysis
│   │   │   └── route.ts
│   │   ├── health
│   │   │   └── route.ts
│   │   ├── laporan
│   │   │   └── route.ts
│   │   ├── petabencana-proxy-new
│   │   │   └── route.ts
│   │   ├── pump-status-proxy
│   │   │   └── route.ts
│   │   ├── regions
│   │   │   └── route.ts
│   │   ├── summarize-news-batch
│   │   │   └── route.ts
│   │   ├── water-level-proxy
│   │   │   └── route.ts
│   │   ├── weather
│   │   │   ├── route.ts
│   │   │   └── tiles
│   │   │       └── [...tile]
│   │   │           └── route.ts
│   │   └── weather-history
│   │       └── route.ts
│   ├── data-sensor
│   │   └── page.tsx
│   ├── info-evakuasi
│   │   └── page.tsx
│   ├── lapor-banjir
│   │   └── page.tsx
│   ├── peta-banjir
│   │   └── page.tsx
│   ├── peringatan
│   │   └── page.tsx
│   ├── prakiraan-cuaca
│   │   └── page.tsx
│   ├── settings
│   │   └── page.tsx
│   ├── statistika
│   │   └── page.tsx
│   ├── test
│   │   └── route.ts
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   └── state.ts
├── components
│   ├── background
│   │   ├── Lightning.css
│   │   └── Lightning.tsx
│   ├── contexts
│   │   └── AlertCountContext.tsx
│   ├── data-sensor
│   │   ├── CurrentWeatherModal.tsx
│   │   ├── DataSensorAnalysis.tsx
│   │   ├── FloodReportChart.tsx
│   │   ├── FloodReportList.tsx
│   │   ├── HistoricalRainfallChart.tsx
│   │   └── ReportEmergencyModal.tsx
│   ├── dashboard
│   │   ├── AnalysisSection.tsx
│   │   ├── DashboardStats.tsx
│   │   └── StatisticsDashboard.tsx
│   ├── flood
│   │   ├── FloodAlert.tsx
│   │   ├── PeringatanBencanaCard.css
│   │   └── PeringatanBencanaCard.tsx
│   ├── layout
│   │   ├── ClientLayoutWrapper.tsx
│   │   ├── Header.tsx
│   │   └── Sidebar.tsx
│   ├── map
│   │   ├── FloodMap.tsx
│   │   ├── MapControls.tsx
│   │   ├── MapLegend.tsx
│   │   └── MapPicker.tsx
│   ├── modals
│   │   └── LocationPickerModal.tsx
│   ├── providers
│   │   └── ReactQueryProvider.tsx
│   ├── region-selector
│   │   └── RegionDropdown.tsx
│   ├── ui
│   │   ├── accordion.tsx
│   │   ├── alert-dialog.tsx
│   │   ├── alert.tsx
│   │   ├── aspect-ratio.tsx
│   │   ├── avatar.tsx
│   │   ├── badge.tsx
│   │   ├── breadcrumb.tsx
│   │   ├── Button.tsx
│   │   ├── calendar.tsx
│   │   ├── card.tsx
│   │   ├── carousel.tsx
│   │   ├── chart.tsx
│   │   ├── checkbox.tsx
│   │   ├── collapsible.tsx
│   │   ├── command.tsx
│   │   ├── context-menu.tsx
│   │   ├── dialog.tsx
│   │   ├── drawer.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── form.tsx
│   │   ├── hover-card.tsx
│   │   ├── input-otp.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── loading-spinner.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── menubar.tsx
│   │   ├── navigation-menu.tsx
│   │   ├── pagination.tsx
│   │   ├── popover.tsx
│   │   ├── progress.tsx
│   │   ├── radio-group.tsx
│   │   ├── resizable.tsx
│   │   ├── scroll-area.tsx
│   │   ├── select.tsx
│   │   ├── separator.tsx
│   │   ├── sheet.tsx
│   │   ├── skeleton.tsx
│   │   ├── slider.tsx
│   │   ├── sonner.tsx
│   │   ├── switch.tsx
│   │   ├── table.tsx
│   │   ├── tabs.tsx
│   │   ├── textarea.tsx
│   │   ├── toast.tsx
│   │   ├── toaster.tsx
│   │   ├── toggle-group.tsx
│   │   ├── toggle.tsx
│   │   └── tooltip.tsx
│   └── weather
│       ├── AirQualityDisplay.tsx
│       ├── WeatherDisplay.tsx
│       ├── WeatherMap.tsx
│       └── WeatherMapIframe.tsx
├── hooks
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
├── lib
│   ├── supabase
│   │   ├── client.ts
│   │   └── server.ts
│   ├── api.client.ts
│   ├── api.server.ts
│   ├── api.ts
│   ├── constants.ts
│   ├── fetch-utils.ts
│   ├── geocodingService.ts
│   ├── supabase.ts
│   ├── supabaseAdmin.ts
│   └── utils.ts
├── public
│   ├── assets
│   │   ├── banjir.png
│   │   └── evacuation_marker.svg
│   └── leaflet
│       └── images
│           ├── marker-icon-2x.png
│           ├── marker-icon.png
│           └── marker-shadow.png
├── types
│   ├── airPollution.ts
│   ├── geocoding.ts
│   ├── index.d.ts
│   └── index.ts
├── .bolt
│   ├── config.json
│   ├── ignore
│   └── prompt
├── .eslintrc.json
├── .gitignore
├── build.log
├── commit_message.txt
├── components.json
├── eslint-errors.txt
├── next.config.js
├── package-lock.json
├── package.json
├── postcss.config.js
├── README.md
├── test-supabase.js
├── ts-errors.txt
└── tsconfig.json
```
## API Hardening: Rate Limiting & Caching

To ensure API stability and prevent abuse, Floodzy APIs implement rate limiting and caching mechanisms.

- **Rate Limiting**: APIs are limited to **60 requests per minute per IP address**. Exceeding this limit will result in a `429 Too Many Requests` response.
- **Caching**: API responses are cached to reduce server load and improve response times. The default cache TTL (Time-To-Live) is **60 seconds**.

Both features are powered by **Upstash Redis**. Ensure the following environment variables are set in your `.env.local` file:

```
UPSTASH_REDIS_REST_URL=YOUR_UPSTASH_REDIS_REST_URL
UPSTASH_REDIS_REST_TOKEN=YOUR_UPSTASH_REDIS_REST_TOKEN
```

You can override the default cache TTL for specific routes by passing an `ttl` option to the caching function within the route handler. For example:

```typescript
await setCache(cacheKey, data, { ttl: 300 }); // Cache for 5 minutes
```

## Observability

Floodzy integrates with Sentry for error monitoring and performance tracing, and implements structured logging for API routes to enhance observability.

### Sentry Configuration

Sentry helps in real-time error tracking and performance monitoring. To enable Sentry, set the following environment variables in your `.env.local` (for local development) and your deployment environment (e.g., Vercel) for preview and production stages:

```
SENTRY_DSN="https://<your-dsn>.ingest.sentry.io/<project-id>"
SENTRY_TRACES_SAMPLE_RATE="0.1"
SENTRY_PROFILES_SAMPLE_RATE="0.0"
SENTRY_ENVIRONMENT="development" # or "production", "preview"
```

- `SENTRY_DSN`: Your project's DSN from Sentry.
- `SENTRY_TRACES_SAMPLE_RATE`: Percentage of transactions to sample for performance monitoring (e.g., 0.1 for 10%).
- `SENTRY_PROFILES_SAMPLE_RATE`: Percentage of transactions to sample for profiling (e.g., 0.0 for disabled).
- `SENTRY_ENVIRONMENT`: The environment name (e.g., `development`, `production`, `preview`).

You can view captured errors and performance traces in your Sentry dashboard under the "Issues" and "Performance" tabs, respectively.

### Structured API Logging

API routes (`/api/*`) now produce structured JSON logs to provide better insights into request processing. Each API response includes an `X-Request-Id` header, which can be used to correlate logs for a single request.

Example log entry (you can `grep` for `X-Request-Id` in your Vercel logs):

```json
{
  "level": "info",
  "ts": "2025-08-27T12:34:56.789Z",
  "route": "/api/petabencana",
  "method": "GET",
  "status": 200,
  "ip": "192.168.1.1",
  "cache": "HIT",
  "rlRemaining": 59,
  "durationMs": 15,
  "requestId": "some-uuid-1234"
}
```

Key fields in the logs:
- `route`: The API endpoint path.
- `method`: HTTP method (e.g., `GET`, `POST`).
- `status`: HTTP response status code.
- `ip`: Client IP address.
- `cache`: Cache status (`HIT`, `MISS`, `BYPASS`).
- `rlRemaining`: Remaining requests in the rate limit window.
- `durationMs`: Request duration in milliseconds.
- `error`: Error message if an error occurred.
- `requestId`: Unique ID for the request (`X-Request-Id` header).

## 🌟 Roadmap

- [x] 🌊 **Monitoring Banjir Dasar** – Peta interaktif & data ketinggian air.
- [x] 🌦 **Integrasi Cuaca & Peta** – Data cuaca real-time, prakiraan, dan visualisasi.
- [x] 📱 **Aplikasi Mobile** – Versi Android & iOS untuk pemantauan di genggaman.
- [x] 🤖 **Prediksi AI Banjir** – Analisis risiko banjir berbasis Machine Learning.
- [x] 📡 **Integrasi IoT Sensor** – Data real-time dari sensor fisik lapangan.
- [x] 🗣 **Laporan Komunitas** – Sistem pelaporan banjir berbasis partisipasi warga.

```plaintext
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


```
```plaintext
## Custom Hooks

useRegionData → Data wilayah & monitoring

usePumpStatusData → Status pompa banjir

useWaterLevelData → Data ketinggian air

useAirPollutionData → Data kualitas udara

useBmkgQuakeData → Data gempa dari BMKG

useDisasterData → Data bencana umum

useTheme → Manajemen tema UI

useDebounce → Input debouncing

use-toast → Notifikasi toast

```

```plaintext
💻 Usage

Basic

Jalankan npm run dev

Buka http://localhost:3000

Pilih wilayah di dropdown/map

Lihat data banjir, cuaca, dan analisis

Advanced

Kirim laporan banjir via menu Lapor Banjir

Gunakan chatbot untuk informasi cepat

Lihat analisis bencana di dashboard
```

```plaintext
Buat file .env.local:
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
OPENWEATHER_API_KEY=...
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=...

```
```plaintext
📊 Performance

Lighthouse Score: 95+

FCP: < 1.5s

TTI: < 3s

🛡️ Security

Supabase Row Level Security (RLS)

Validasi input di server

API key aman di environment variables
```



```plaintext
🎉 Acknowledgments

OpenWeatherMap

Supabase

Leaflet

BMKG

Kementerian PUPR
```


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

