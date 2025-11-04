# 🌊 Floodzy - Real-time Pendeteksi/Prediksi Potensi Banjir & Monitoring Cuaca di Indonesia

<div align="center">
  <img src="public/assets/ChatGPT Image 4 Sep 2025, 08.50.45.png" alt="Floodzy Logo" width="200"/>
  
  <p align="center">
    <strong>Platform pemantauan banjir, pelacakan cuaca, dan peringatan dini yang komprehensif untuk warga Indonesia </strong>
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

Floodzy adalah sistem pemantauan banjir dan peringatan dini real-time yang memanfaatkan teknologi modern seperti **Next.js**, **ShadcnUI**, **TypeScript**, **React**, **Tailwind CSS**, dan **Supabase**. Platform ini menyediakan data ketinggian air, status pompa, prakiraan cuaca, analisis bencana, dan peta interaktif untuk mendukung mitigasi bencana di Indonesia. Data yang disajikan mencakup seluruh wilayah Indonesia hingga tingkat kecamatan dengan detail dan terstruktur.

---

### ✨ Fitur

Floodzy menyediakan serangkaian fitur lengkap untuk pemantauan bencana yang komprehensif:

- **🗺️ Peta Bencana Interaktif**: Visualisasi data banjir, cuaca, dan sensor secara real-time menggunakan Leaflet, lengkap dengan marker, layer, dan legenda yang interaktif.
  <div align="center">
    <img src="https://drive.google.com/thumbnail?id=1fGo6J4es_JFH7eIXztyDYh3TKCg9WCer" alt="Peta Bencana Interaktif" style="border: 2px solid #38B2AC; border-radius: 8px; margin: 10px 0; max-width: 100%;">
  </div>

- **📊 Dashboard Statistik & Analisis**: Halaman dashboard (`/statistika`) yang menampilkan statistik historis bencana, grafik curah hujan, dan laporan banjir dalam bentuk visual yang mudah dipahami dan data realtime.
  <div align="center">
    <img src="https://drive.google.com/thumbnail?id=1Z-ONZGvKl7riQOARz1Lqm3IQJZJuIgci" alt="Dashboard Statistik & Analisis" style="border: 2px solid #38B2AC; border-radius: 8px; margin: 10px 0; max-width: 100%;">
  </div>

- **🤖 Analisis Bencana Berbasis AI**: Integrasi dengan Gemini API untuk memberikan analisis otomatis terhadap data bencana, peringatan dini, dan ringkasan berita terkini.
  <div align="center">
    <img src="https://drive.google.com/thumbnail?id=1vh0Lq0UezQ4lw8oHMCv13ZbMnb_-OSAJ" alt="Analisis Bencana Berbasis AI" style="border: 2px solid #38B2AC; border-radius: 8px; margin: 10px 0; max-width: 100%;">
  </div>

- **🚨 Peringatan Dini Multi-Sumber**: Mengagregasi data peringatan dari berbagai sumber terpercaya untuk memberikan notifikasi bencana yang akurat.
  <div align="center">
    <img src="https://drive.google.com/thumbnail?id=1CrBlERMTVB5o8NlheViY1jxkxWrBsIbs" alt="Peringatan Dini Multi-Sumber" style="border: 2px solid #38B2AC; border-radius: 8px; margin: 10px 0; max-width: 100%;">
  </div>

- **🌦️ Prakiraan & Riwayat Cuaca**: Menyajikan data cuaca real-time (suhu, kelembapan, angin) dari OpenWeatherMap dan riwayat cuaca untuk analisis tren.
  <div align="center">
    <img src="https://drive.google.com/thumbnail?id=1SGVyChTnBIIG62nUXxEAFRupmP7cjSmp" alt="Prakiraan & Riwayat Cuaca" style="border: 2px solid #38B2AC; border-radius: 8px; margin: 10px 0; max-width: 100%;">
  </div>

- **🌬️ Pemantauan Kualitas Udara**: Fitur untuk memantau tingkat polusi udara di wilayah terpilih, memberikan informasi kesehatan lingkungan yang krusial.
  <div align="center">
    <img src="https://drive.google.com/thumbnail?id=1LE2UlyOrQDjqh-riWj09-3B8hjD9nL4X" alt="Pemantauan Kualitas Udara" style="border: 2px solid #38B2AC; border-radius: 8px; margin: 10px 0; max-width: 100%;">
  </div>

- **🌍 Informasi Gempa Bumi**: Menampilkan data gempa bumi terkini langsung dari BMKG untuk meningkatkan kesiapsiagaan terhadap bencana geologi maupun bencana banjir secara realtime.
  <div align="center">
    <img src="https://drive.google.com/thumbnail?id=1YbOs2aPQNskv_5rB2xrqGXLXxHhk8bjs" alt="Informasi Gempa Bumi" style="border: 2px solid #38B2AC; border-radius: 8px; margin: 10px 0; max-width: 100%;">
  </div>

- **📱 Dukungan Progressive Web App (PWA)**: Floodzy dapat diinstal di perangkat mobile layaknya aplikasi native, serta mendukung fungsionalitas offline untuk akses di kondisi darurat.
  <div align="center">
    <img src="https://drive.google.com/thumbnail?id=1e1gYjYEo8vlc-Aa1UezjypglABkTYtiQ" alt="Dukungan Progressive Web App (PWA)" style="border: 2px solid #38B2AC; border-radius: 8px; margin: 10px 0; max-width: 100%;">
  </div>

- **💬 Laporan Pengguna & Chatbot**: Memungkinkan pengguna melaporkan kejadian banjir secara langsung dan menyediakan chatbot interaktif untuk menjawab pertanyaan seputar cuaca dan bencana.
  <div align="center">
    <img src="https://drive.google.com/thumbnail?id=1fvamK7WQD5vNaPxA9Nf09T8zelbxk3Me" alt="Laporan Pengguna & Chatbot" style="border: 2px solid #38B2AC; border-radius: 8px; margin: 10px 0; max-width: 100%;">
  </div>

### 🌡️ Cuaca & Data Banjir Di Indonesia 
<div align="center">
  <img src="https://drive.google.com/thumbnail?id=1N1r0adgwvHxjyhBP1ZV-XLlcCQ4oFUYQ" alt="Cuaca & Data Banjir" style="border: 2px solid #38B2AC; border-radius: 8px; margin: 10px 0; max-width: 100%;">
</div>

- Data cuaca real-time (temperatur, kelembapan, kecepatan angin).
- Integrasi OpenWeatherMap.
- Riwayat cuaca & banjir.

### 🚨 Peringatan & Analisis
<div align="center">
  <img src="https://drive.google.com/thumbnail?id=1H4k4ylseAh6ePZ3ppiPrtSYF2IebiP4l" alt="Peringatan & Analisis" style="border: 2px solid #38B2AC; border-radius: 8px; margin: 10px 0; max-width: 100%;">
</div>

- Peringatan bencana dengan sumber data terintegrasi.
- Analisis bencana otomatis menggunakan Gemini API.
- Ringkasan berita bencana.

### 📍 Wilayah & Titik Evakuasi
<div align="center">
  <img src="https://drive.google.com/thumbnail?id=1dNG7jdIcfTQWoK3bTUP0qH1cushyfJQT" alt="Wilayah & Titik Evakuasi" style="border: 2px solid #38B2AC; border-radius: 8px; margin: 10px 0; max-width: 100%;">
</div>

- Pilihan wilayah hingga tingkat provinsi/kota/kecamatan.
- Informasi jalur & titik evakuasi.

### 💬 Interaksi User
<div align="center">
  <img src="https://drive.google.com/thumbnail?id=1CvF2Hu0XJLwWFf2AbCWms4pZUMdiuPBn" alt="Interaksi User" style="border: 2px solid #38B2AC; border-radius: 8px; margin: 10px 0; max-width: 100%;">
</div>

- Laporan banjir langsung dari pengguna.
- Chatbot informasi banjir & cuaca.

### 🛠 Developer Friendly
<div align="center">
  <img src="https://drive.google.com/thumbnail?id=1VqNCH2Z5YNYjeQg8DGXCWNmRa_dOlona" alt="Developer Friendly" style="border: 2px solid #38B2AC; border-radius: 8px; margin: 10px 0; max-width: 100%;">
</div>

- API publik (`/api`) untuk integrasi data.
- Custom hooks untuk pengelolaan state & UI.

---

## 📁 Struktur Project

## API Hardening: Rate Limiting & Caching

Untuk menjaga stabilitas API dan mencegah penyalahgunaan, Floodzy API menerapkan mekanisme rate limiting dan caching.

**Rate Limiting**: API dibatasi hingga 60 permintaan per menit per alamat IP. Jika melebihi batas ini, akan muncul respons `429 Too Many Requests`.

**Caching**: Respons API disimpan dalam cache untuk mengurangi beban server dan mempercepat waktu respon. Nilai default cache TTL (Time-To-Live) adalah 60 detik.

Kedua fitur ini dijalankan menggunakan Upstash Redis. Pastikan variabel lingkungan berikut sudah disetel di file `.env.local`:
