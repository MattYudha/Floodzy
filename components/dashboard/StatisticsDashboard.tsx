'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { format, parseISO, subDays } from 'date-fns';
import { id } from 'date-fns/locale';
import {
  ArrowLeft,
  TrendingUp,
  Activity,
  AlertTriangle,
  CheckCircle,
  Users,
  MapPin,
  Thermometer,
  Droplets,
  Wind,
  Eye,
  BarChart3,
  Calendar,
  Filter,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { normalizeSeries, ChartRow } from '@/lib/utils';

// Helper to generate random data
const generateRandomData = (days: number) => {
  const data = [];
  const regions = [
    'Jakarta',
    'Bandung',
    'Surabaya',
    'Medan',
    'Yogyakarta',
    'Lainnya',
  ];
  for (let i = 0; i < days; i++) {
    const date = subDays(new Date(), i);
    for (const region of regions) {
      data.push({
        date: date.toISOString(),
        region,
        laporan: Math.floor(Math.random() * 20) + 1,
        resolved: Math.floor(Math.random() * 15) + 1,
      });
    }
  }
  return data;
};

interface ChartData {
  line: ChartRow[];
  bar: ChartRow[];
  pie: ChartRow[];
}

const DATA_KEYS = ['jumlah', 'resolved'];

const StatisticsDashboard = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const [isLoading, setIsLoading] = useState(false);
  const [chartData, setChartData] = useState<ChartData>({ line: [], bar: [], pie: [] });
  const [masterData, setMasterData] = useState(() => generateRandomData(90));

  // Effect to regenerate masterData every 24 hours
  useEffect(() => {
    const refreshInterval = setInterval(
      () => {
        setMasterData(generateRandomData(90));
        console.log('Master data refreshed!');
      },
      24 * 60 * 60 * 1000,
    ); // 24 hours in milliseconds

    return () => clearInterval(refreshInterval);
  }, []);

  useEffect(() => {
    const fetchData = () => {
      setIsLoading(true);
      const days = parseInt(
        selectedTimeRange.replace('d', '').replace('h', ''),
      );
      const isHours = selectedTimeRange.includes('h');
      const now = new Date();
      let dataToProcess;

        if (selectedTimeRange === '30d') {
          dataToProcess = generateRandomData(30); // Generate fresh mock data for 30 days
        } else if (selectedTimeRange === '90d') {
          dataToProcess = generateRandomData(90); // Generate fresh mock data for 90 days
        } else {
          // For 24h and 7d, filter from masterData as before
          const cutoff = isHours ? subDays(now, days / 24) : subDays(now, days);
          dataToProcess = masterData.filter((d) => new Date(d.date) >= cutoff);
        }

      // Process data for charts
      const line = normalizeSeries(
        dataToProcess
          .reduce((acc, curr) => {
            const day = format(parseISO(curr.date), 'yyyy-MM-dd');
            const existing = acc.find((item) => item.date === day);
            if (existing) {
              existing.jumlah += curr.laporan ?? 0;
              existing.resolved += curr.resolved ?? 0;
            } else {
              acc.push({
                date: day,
                day: format(parseISO(curr.date), 'eee'),
                jumlah: curr.laporan ?? 0,
                resolved: curr.resolved ?? 0,
              });
            }
            return acc;
          }, [] as ChartRow[])
          .sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
          ),
        DATA_KEYS,
      ) as ChartRow[];

      const bar = normalizeSeries(
        dataToProcess.reduce((acc, curr) => {
          const existing = acc.find((item) => item.name === curr.region);
          if (existing) {
            existing.jumlah += curr.laporan ?? 0;
          } else {
            acc.push({ name: curr.region, jumlah: curr.laporan ?? 0 });
          }
          return acc;
        }, [] as ChartRow[]),
        DATA_KEYS,
      ) as ChartRow[];

      console.log('[Chart] range=', selectedTimeRange, 'len=', Array.isArray(line) ? line.length : 0);
      if (line.length > 0) {
        console.table(line.slice(0, 3));
      }

      setChartData({ line, bar, pie: bar });
      setIsLoading(false);
    };

    fetchData();
  }, [selectedTimeRange, masterData]); // Add masterData to dependency array

  const COLORS = [
    '#06b6d4',
    '#3b82f6',
    '#8b5cf6',
    '#ec4899',
    '#f59e0b',
    '#10b981',
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dataItem = payload[0].payload;
      return (
        <div className="bg-gray-700/80 backdrop-blur-sm text-white p-3 rounded-lg border border-gray-600 shadow-lg">
          <p className="font-bold text-cyan-400">{label}</p>
          {dataItem.jumlah !== undefined && (
            <p className="text-sm">{`Laporan: ${dataItem.jumlah}`}</p>
          )}
          {dataItem.resolved !== undefined && (
            <p className="text-sm">{`Terselesaikan: ${dataItem.resolved}`}</p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button className="flex items-center text-cyan-400 hover:text-cyan-300 transition-colors"></button>
              <div className="text-2xl font-bold text-white">
                Statistik Data
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={selectedTimeRange}
                onChange={(e) => setSelectedTimeRange(e.target.value)}
                className="bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="24h">24 Jam</option>
                <option value="7d">7 Hari</option>
                <option value="30d">30 Hari</option>
                <option value="90d">90 Hari</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`container mx-auto px-6 py-8 transition-opacity duration-300 ${isLoading ? 'opacity-50' : 'opacity-100'}`}
      >
        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Bar Chart: Lokasi Paling Rawan */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 lg:col-span-1">
            <h3 className="text-lg font-semibold text-white mb-4">
              Lokasi Paling Rawan
            </h3>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                {chartData.bar && chartData.bar.length > 0 ? (
                  <BarChart
                    data={chartData.bar}
                    margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
                    <XAxis dataKey="name" stroke="#a0aec0" fontSize={12} />
                    <YAxis stroke="#a0aec0" fontSize={12} />
                    <Tooltip
                      content={<CustomTooltip />}
                      cursor={{ fill: 'rgba(100, 116, 139, 0.1)' }}
                    />
                    <Bar dataKey="jumlah" fill="#2dd4bf" radius={[4, 4, 0, 0]} />
                  </BarChart>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    Tidak ada data tersedia untuk grafik ini.
                  </div>
                )}
              </ResponsiveContainer>
            </div>
          </div>

          {/* Line Chart: Tren Kejadian Banjir */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 lg:col-span-2">
            <h3 className="text-lg font-semibold text-white mb-4">
              Tren Kejadian Banjir
            </h3>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                {Array.isArray(chartData.line) && chartData.line.length > 0 ? (
                  <LineChart
                    data={chartData.line}
                    margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
                    <XAxis dataKey="day" stroke="#a0aec0" fontSize={12} />
                    <YAxis stroke="#a0aec0" fontSize={12} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="jumlah"
                      stroke="#2dd4bf"
                      strokeWidth={2}
                      activeDot={{ r: 8 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="resolved"
                      stroke="#818cf8"
                      strokeWidth={2}
                    />
                  </LineChart>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    Tidak ada data tersedia untuk grafik ini.
                  </div>
                )}
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart: Komposisi Laporan */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 lg:col-span-1">
            <h3 className="text-lg font-semibold text-white mb-4">
              Komposisi Laporan
            </h3>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                {Array.isArray(chartData.pie) && chartData.pie.length > 0 ? (
                  <PieChart>
                    <Pie
                      data={chartData.pie}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={110}
                      fill="#8884d8"
                      dataKey="jumlah"
                      nameKey="name"
                    >
                      {chartData.pie.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                  </PieChart>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    Tidak ada data tersedia untuk grafik ini.
                  </div>
                )}
              </ResponsiveContainer>
            </div>
          </div>

          {/* New Stacked Bar Chart: Laporan Harian & Terselesaikan */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 lg:col-span-2">
            <h3 className="text-lg font-semibold text-white mb-4">
              Laporan Harian & Terselesaikan
            </h3>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                {chartData.line && chartData.line.length > 0 ? (
                  <BarChart
                    data={chartData.line}
                    margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
                    <XAxis dataKey="day" stroke="#a0aec0" fontSize={12} />
                    <YAxis stroke="#a0aec0" fontSize={12} />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="jumlah"
                      stackId="a"
                      fill="#2dd4bf"
                      name="Total Laporan"
                    />
                    <Bar
                      dataKey="resolved"
                      stackId="a"
                      fill="#818cf8"
                      name="Terselesaikan"
                    />
                  </BarChart>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    Tidak ada data tersedia untuk grafik ini.
                  </div>
                )}
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsDashboard;
