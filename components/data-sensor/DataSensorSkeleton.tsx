'use client';

import { Loader2, TableIcon } from 'lucide-react';

export const DataSensorSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-cyan-400 mx-auto mb-4" />
        <p className="text-gray-400 text-lg">Memuat data sensor...</p>
        <p className="text-gray-500 text-sm mt-2">Menganalisis laporan banjir terbaru</p>
      </div>
    </div>
  );
};
