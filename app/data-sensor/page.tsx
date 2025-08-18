import { Suspense, lazy } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { AlertCircle } from 'lucide-react';
import { DataSensorSkeleton } from '@/components/data-sensor/DataSensorSkeleton';
import { StatisticsDashboardSkeleton } from '@/components/dashboard/StatisticsDashboardSkeleton';

// Lazy load heavy components
const DataSensorClientContent = lazy(() => import('@/components/data-sensor/DataSensorClientContent'));
const StatisticsDashboard = lazy(() => import('@/components/dashboard/StatisticsDashboard'));

export const revalidate = 30; // Revalidate data every 30 seconds

// This is a Server Component that fetches data and orchestrates lazy-loaded components
async function DataSensorPage() {
  const supabase = createClient();
  const { data: laporan, error } = await supabase
    .from('laporan_banjir')
    .select('*')
    .order('created_at', { ascending: false });

  // The main page layout is returned immediately, not blocked by the data fetch
  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center text-cyan-400 hover:text-cyan-300 transition-colors duration-200">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Kembali ke Dashboard
              </Link>
              <h1 className="text-2xl font-bold text-white">Analisis Data Sensor</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Konten Utama */}
      <main className="container mx-auto px-6 py-8">
        <Suspense fallback={<StatisticsDashboardSkeleton />}>
          <StatisticsDashboard />
        </Suspense>
        
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg mt-8">
          {error ? (
            <div className="text-center bg-gray-800 p-8 rounded-xl border border-red-500/20">
              <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Gagal Memuat Data Laporan</h3>
              <p className="text-red-400">Terjadi kesalahan saat mengambil data: {error.message}</p>
            </div>
          ) : (
            <Suspense fallback={<DataSensorSkeleton />}>
              <DataSensorClientContent initialLaporan={laporan || []} />
            </Suspense>
          )}
        </div>
      </main>
    </div>
  );
}

export default DataSensorPage;
