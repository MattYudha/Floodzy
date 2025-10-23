export async function getCurrentWeather(latitude: number, longitude: number) {
  // Ini adalah placeholder. Anda perlu mengganti ini dengan panggilan API cuaca yang sebenarnya.
  // Contoh menggunakan OpenWeatherMap API (Anda perlu mendapatkan API key sendiri)
  const API_KEY = 'YOUR_OPENWEATHERMAP_API_KEY'; // Ganti dengan API key Anda
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric&lang=id`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Gagal mengambil data cuaca.');
  }
  const data = await response.json();
  return data;
}