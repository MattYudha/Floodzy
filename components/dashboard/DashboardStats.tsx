// src/components/dashboard/DashboardStats.tsx
'use client';

import { motion } from 'framer-motion';
import {
  MapPin,
  Bell,
  Shield,
  Users,
  Activity, // Digunakan untuk Status Sistem (Monitoring Aktif)
  Clock, // Digunakan untuk Aktivitas Terkini
  Waves, // Ikon untuk air, mungkin bisa dipakai untuk pompa juga
  Gauge,
  ArrowUp,
  ArrowDown,
  Loader2, // Icon spinner
  CheckCircle, // Icon untuk status 'Online' atau 'Beroperasi'
  XCircle, // Icon untuk status 'Tidak Beroperasi' atau 'Rusak'
  AlertTriangle, // Icon untuk peringatan
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { getTimeAgo } from '@/lib/utils';

// Import untuk data API
import { WaterLevelPost, PumpData } from '@/lib/api'; // === IMPORT BARU: PumpData ===

// Definisi props untuk DashboardStats
interface DashboardStatsProps {
  stats: {
    totalRegions: number;
    activeAlerts: number;
    floodZones: number;
    peopleAtRisk: number;
    weatherStations: number;
    lastUpdate: string;
  };
  // PROPS UNTUK DATA PUPR TMA
  waterLevelPosts: WaterLevelPost[];
  loadingWaterLevel: boolean;
  waterLevelError: string | null;
  // === PROPS BARU UNTUK DATA POMPA BANJIR ===
  pumpStatusData: PumpData[];
  loadingPumpStatus: boolean;
  pumpStatusError: string | null;
  className?: string;
}

export function DashboardStats({
  stats,
  waterLevelPosts,
  loadingWaterLevel,
  waterLevelError,
  pumpStatusData, // Menerima data pompa
  loadingPumpStatus, // Menerima status loading pompa
  pumpStatusError, // Menerima status error pompa
  className,
}: DashboardStatsProps) {
  // === LOGIKA UNTUK MENGHITUNG STATUS POMPA ===
  const totalPumps = pumpStatusData.length;
  const activePumps = pumpStatusData.filter(
    (pump) =>
      pump.kondisi_bangunan &&
      pump.kondisi_bangunan.toLowerCase().includes('beroperasi'),
  ).length;
  const inactivePumps = totalPumps - activePumps;
  const pumpsNeedingMaintenance = pumpStatusData.filter(
    (pump) =>
      pump.kondisi_bangunan &&
      (pump.kondisi_bangunan.toLowerCase().includes('rusak') ||
        pump.kondisi_bangunan.toLowerCase().includes('tidak beroperasi')),
  ).length;

  const getPumpStatusBadge = (status: string) => {
    if (status.toLowerCase().includes('beroperasi'))
      return <Badge variant="success">Beroperasi</Badge>;
    if (
      status.toLowerCase().includes('tidak beroperasi') ||
      status.toLowerCase().includes('rusak')
    )
      return <Badge variant="danger">Tidak Beroperasi</Badge>;
    return <Badge variant="secondary">Tidak Diketahui</Badge>;
  };

  const statsConfig = [
    {
      title: 'Total Wilayah',
      value: stats.totalRegions,
      unit: '',
      icon: MapPin,
      color: 'text-blue-500',
      change: '2%',
      changeType: 'up',
    },
    {
      title: 'Peringatan Aktif',
      value: stats.activeAlerts,
      unit: '',
      icon: Bell,
      color: 'text-yellow-500',
      change: '5%',
      changeType: 'down',
    },
    {
      title: 'Zona Banjir',
      value: stats.floodZones,
      unit: '',
      icon: Shield,
      color: 'text-red-500',
      change: '3%',
      changeType: 'up',
    },
    {
      title: 'Orang Berisiko',
      value: `${(stats.peopleAtRisk / 1000000).toFixed(1)}M`, // Mengubah 2.5M menjadi 2.5M
      unit: '',
      icon: Users,
      color: 'text-purple-500',
      change: '12%',
      changeType: 'down',
    },
    {
      title: 'Stasiun Cuaca',
      value: stats.weatherStations,
      unit: '',
      icon: Activity,
      color: 'text-green-500',
      change: '1%',
      changeType: 'up',
    },
  ];

  return (
    <div className={cn('space-y-6', className)}>
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {statsConfig.map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <item.icon className={cn('h-4 w-4 sm:h-5 sm:w-5', item.color)} />
                    <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                      {item.title}
                    </span>
                  </div>
                  {item.change && (
                    <Badge
                      variant={item.changeType === 'up' ? 'success' : 'danger'}
                      className="text-xs"
                    >
                      {item.change}
                    </Badge>
                  )}
                </div>
                <div className="text-xl sm:text-2xl font-bold text-white">
                  {item.value}
                  <span className="text-sm sm:text-base text-muted-foreground ml-1">
                    {item.unit}
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* === BAGIAN STATUS SISTEM: MENGGUNAKAN DATA POMPA BANJIR === */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                <span className="text-base sm:text-lg font-semibold">Status Sistem Pompa</span> {/* Judul diubah */}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingPumpStatus ? (
                <div className="text-center text-xs sm:text-sm text-muted-foreground flex items-center justify-center space-x-2 h-[120px]">
                  <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                  <span>Memuat status pompa...</span>
                </div>
              ) : pumpStatusError ? (
                <div className="text-center text-xs sm:text-sm text-red-400 h-[120px] flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  <span>Error pompa: {pumpStatusError}</span>
                </div>
              ) : totalPumps > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm">Total Pompa Terdaftar</span>
                    <Badge variant="secondary">{totalPumps}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm">Pompa Beroperasi</span>
                    <Badge variant="success">
                      <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      {activePumps}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm">Pompa Tidak Beroperasi</span>
                    <Badge variant="danger">
                      <XCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      {inactivePumps}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm">Membutuhkan Perbaikan</span>
                    <Badge variant="warning">
                      <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      {pumpsNeedingMaintenance}
                    </Badge>
                  </div>
                </div>
              ) : (
                <div className="text-center text-xs sm:text-sm text-muted-foreground h-[120px] flex items-center justify-center">
                  <span>Pilih wilayah untuk melihat pompa.</span>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-secondary" />
                <span className="text-base sm:text-lg font-semibold">Aktivitas Terkini</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {/* MENAMPILKAN DATA TINGGI MUKA AIR DARI PUPR */}
                {loadingWaterLevel && (
                  <div className="text-center text-sm text-muted-foreground flex items-center justify-center space-x-2">
                    <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                    <span>Memuat data TMA...</span>
                  </div>
                )}
                {waterLevelError && (
                  <div className="text-center text-sm text-red-400">
                    Error TMA: {waterLevelError}
                  </div>
                )}
                {!loadingWaterLevel &&
                !waterLevelError &&
                waterLevelPosts.length > 0 ? (
                  waterLevelPosts.slice(0, 3).map(
                    (
                      post, // Tampilkan hingga 3 pos TMA terdekat
                    ) => (
                      <div
                        key={post.id}
                        className="flex items-center space-x-3"
                      >
                        <div className="w-2 h-2 bg-blue-400 rounded-full" />{' '}
                        {/* Warna biru untuk TMA */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white">
                            Tinggi Air {post.name}: {post.water_level || 'N/A'}{' '}
                            {post.unit || 'm'}
                            {post.status && ` (${post.status})`}
                          </p>
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            {post.timestamp
                              ? getTimeAgo(new Date(post.timestamp))
                              : 'Waktu tidak tersedia'}
                          </p>
                        </div>
                        {post.status && (
                          <Badge
                            variant={
                              post.status.toLowerCase().includes('awas')
                                ? 'danger'
                                : post.status.toLowerCase().includes('siaga')
                                  ? 'warning'
                                  : 'success'
                            }
                          >
                            {post.status}
                          </Badge>
                        )}
                      </div>
                    ),
                  )
                ) : !loadingWaterLevel &&
                  !waterLevelError &&
                  waterLevelPosts.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center">
                    Pilih wilayah untuk melihat data Pos Duga Air di dekat
                    wilayah anda.
                  </p>
                ) : null}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
