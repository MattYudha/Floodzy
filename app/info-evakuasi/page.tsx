'use client';

import React, { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { motion, AnimatePresence } from 'framer-motion'; // Import motion dan AnimatePresence
import {
  MapPin,
  Users,
  Home,
  Phone,
  ExternalLink,
  Info,
  CheckCircle,
  XCircle,
  Loader2,
  Navigation,
  Shield,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import { EvacuationLocation } from '@/types';
import dynamic from 'next/dynamic';

const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false },
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false },
);
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false },
);
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false },
);

// Custom marker icon
const DEFAULT_MAP_CENTER: [number, number] = [-6.2088, 106.8456]; // Jakarta
const DEFAULT_MAP_ZOOM = 10;

export default function InfoEvakuasiPage() {
  const [evacuationLocations, setEvacuationLocations] = useState<
    EvacuationLocation[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] =
    useState<EvacuationLocation | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [evacuationIcon, setEvacuationIcon] = useState<L.Icon | null>(null);

  useEffect(() => {
    // Only create the icon on the client side
    if (typeof window !== 'undefined') {
      setEvacuationIcon(
        new L.Icon({
          iconUrl: '/assets/evacuation_marker.svg',
          iconSize: [32, 32],
          iconAnchor: [16, 32],
          popupAnchor: [0, -32],
        }),
      );
    }

    const fetchEvacuationLocations = async () => {
      try {
        const response = await fetch('/api/evakuasi');
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.statusText}`);
        }
        const data: EvacuationLocation[] = await response.json();
        setEvacuationLocations(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvacuationLocations();
  }, []);

  const handleLocationClick = (location: EvacuationLocation) => {
    setSelectedLocation(location);
    setIsDialogOpen(true);
  };

  const openGoogleMaps = (lat: number, lon: number) => {
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`,
      '_blank',
    );
  };

  const getStatusColor = (location: EvacuationLocation) => {
    const percentage =
      (location.capacity_current / location.capacity_total) * 100;
    if (percentage >= 90) return 'text-red-400';
    if (percentage >= 70) return 'text-orange-400';
    return 'text-green-400';
  };

  const getStatusBadge = (location: EvacuationLocation) => {
    const percentage =
      (location.capacity_current / location.capacity_total) * 100;
    if (percentage >= 90)
      return {
        text: 'Penuh',
        color: 'bg-red-500/20 text-red-400 border-red-500/30',
      };
    if (percentage >= 70)
      return {
        text: 'Hampir Penuh',
        color: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      };
    return {
      text: 'Tersedia',
      color: 'bg-green-500/20 text-green-400 border-green-500/30',
    };
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-4"
      >
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-xl font-medium text-white">
              Memuat lokasi evakuasi...
            </p>
            <p className="text-slate-400 mt-2">Mohon tunggu sebentar</p>
          </div>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-4"
      >
        <div className="flex flex-col justify-center items-center min-h-[60vh]">
          <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-8 text-center">
            <XCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <p className="text-xl font-medium text-white mb-2">
              Gagal Memuat Data
            </p>
            <p className="text-red-400 mb-4">{error}</p>
            <p className="text-slate-400">Silakan coba lagi nanti</p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto mb-8"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-cyan-500 rounded-lg flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Floodzie</h1>
            <p className="text-cyan-400 text-sm">Informasi Lokasi Evakuasi</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-6"
      >
        {/* Statistics Cards */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {/* Total Lokasi */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-slate-800/80 backdrop-blur-sm border border-slate-600/50 rounded-xl p-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Home className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
                  {evacuationLocations.length}
                </p>
                <p className="text-slate-400 text-sm">Total Lokasi</p>
              </div>
            </div>
          </motion.div>
          {/* Kapasitas Tersisa */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-slate-800/80 backdrop-blur-sm border border-slate-600/50 rounded-xl p-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
                  {evacuationLocations.reduce(
                    (acc, loc) =>
                      acc + (loc.capacity_total - loc.capacity_current),
                    0,
                  )}
                </p>
                <p className="text-slate-400 text-sm">Kapasitas Tersisa</p>
              </div>
            </div>
          </motion.div>
          {/* Lokasi Hampir Penuh */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-slate-800/80 backdrop-blur-sm border border-slate-600/50 rounded-xl p-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
                  {
                    evacuationLocations.filter(
                      (loc) => loc.capacity_current / loc.capacity_total >= 0.7,
                    ).length
                  }
                </p>
                <p className="text-slate-400 text-sm">Hampir Penuh</p>
              </div>
            </div>
          </motion.div>
          {/* Status Update */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-slate-800/80 backdrop-blur-sm border border-slate-600/50 rounded-xl p-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">Live</p>
                <p className="text-slate-400 text-sm">Update Real-time</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Map Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="lg:col-span-2"
        >
          <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-600/50 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-cyan-400" />
              <h3 className="text-lg font-semibold text-white">
                Peta Lokasi Evakuasi
              </h3>
            </div>

            <div className="h-96 w-full rounded-lg overflow-hidden border border-slate-600/30">
              {evacuationIcon && (
                <MapContainer
                  center={DEFAULT_MAP_CENTER}
                  zoom={DEFAULT_MAP_ZOOM}
                  scrollWheelZoom={true}
                  className="h-full w-full"
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                  />
                  {evacuationLocations.map((loc) => (
                    <Marker
                      key={loc.id}
                      position={[loc.latitude, loc.longitude]}
                      icon={evacuationIcon}
                      eventHandlers={{
                        click: () => handleLocationClick(loc),
                      }}
                    >
                      <Popup>
                        <div className="text-sm">
                          <p className="font-bold">{loc.name}</p>
                          <button
                            onClick={() => handleLocationClick(loc)}
                            className="text-cyan-500 hover:underline mt-1"
                          >
                            Lihat Detail
                          </button>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              )}
            </div>
          </div>
        </motion.div>

        {/* List Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="lg:col-span-1"
        >
          <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-600/50 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Home className="w-5 h-5 text-blue-400" />
              <h3 className="text-lg font-semibold text-white">
                Daftar Lokasi
              </h3>
            </div>
            {evacuationLocations.length === 0 ? (
              <p className="text-slate-400 text-center py-8">
                Tidak ada lokasi evakuasi.
              </p>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {evacuationLocations.map((loc, index) => {
                  const statusBadge = getStatusBadge(loc);
                  return (
                    <motion.div
                      key={loc.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.9 + index * 0.05 }}
                    >
                      <div
                        className="bg-slate-700/50 border border-slate-600/30 rounded-lg p-4 cursor-pointer hover:bg-slate-700/70 transition-all group"
                        onClick={() => handleLocationClick(loc)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-white text-sm group-hover:text-cyan-400 transition-colors">
                            {loc.name}
                          </h4>
                          <span
                            className={`px-2 py-1 rounded-full text-xs border ${statusBadge.color}`}
                          >
                            {statusBadge.text}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 mb-2">
                          <MapPin className="w-3 h-3 text-slate-500 flex-shrink-0" />
                          <p className="text-xs text-slate-400 line-clamp-1">
                            {loc.address}
                          </p>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3 text-slate-500" />
                            <span className={`text-xs ${getStatusColor(loc)}`}>
                              {loc.capacity_current}/{loc.capacity_total}
                            </span>
                          </div>
                          <Navigation className="w-3 h-3 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* Location Detail Modal */}
      <AnimatePresence>
        {isDialogOpen && selectedLocation && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <div className="bg-slate-800 border border-slate-600/50 rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-white mb-1">
                      {selectedLocation.name}
                    </h2>
                    <p className="text-slate-400 text-sm">
                      {selectedLocation.address}
                    </p>
                  </div>
                  <button
                    onClick={() => setIsDialogOpen(false)}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Capacity */}
                  <div className="bg-slate-700/50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-blue-400" />
                        <span className="text-white font-medium">
                          Kapasitas
                        </span>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm border ${getStatusBadge(selectedLocation).color}`}
                      >
                        {getStatusBadge(selectedLocation).text}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Terisi:</span>
                      <span className="text-white font-medium">
                        {selectedLocation.capacity_current} /{' '}
                        {selectedLocation.capacity_total} orang
                      </span>
                    </div>
                    <div className="w-full bg-slate-600 rounded-full h-2 mt-2">
                      <div
                        className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all"
                        style={{
                          width: `${(selectedLocation.capacity_current / selectedLocation.capacity_total) * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Facilities */}
                  {selectedLocation.facilities &&
                    selectedLocation.facilities.length > 0 && (
                      <div className="bg-slate-700/50 rounded-lg p-4">
                        <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                          <Info className="w-5 h-5 text-green-400" />
                          Fasilitas Tersedia
                        </h4>
                        <div className="grid grid-cols-2 gap-2">
                          {selectedLocation.facilities.map((facility, idx) => (
                            <div
                              key={idx}
                              className="bg-slate-600/50 rounded-lg px-3 py-2"
                            >
                              <span className="text-slate-300 text-sm">
                                {facility}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Contact Info */}
                  <div className="bg-slate-700/50 rounded-lg p-4 space-y-3">
                    <h4 className="text-white font-medium mb-2 flex items-center gap-2">
                      <Phone className="w-5 h-5 text-orange-400" />
                      Informasi Kontak
                    </h4>
                    {selectedLocation.contact_person && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400">Narahubung:</span>
                        <span className="text-white">
                          {selectedLocation.contact_person}
                        </span>
                      </div>
                    )}
                    {selectedLocation.contact_phone && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400">Telepon:</span>
                        <a
                          href={`tel:${selectedLocation.contact_phone}`}
                          className="text-cyan-400 hover:text-cyan-300 transition-colors"
                        >
                          {selectedLocation.contact_phone}
                        </a>
                      </div>
                    )}
                    {selectedLocation.last_updated && (
                      <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-700">
                        <span className="text-slate-500">Update:</span>
                        <span className="text-slate-400">
                          {new Date(
                            selectedLocation.last_updated,
                          ).toLocaleString('id-ID')}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() =>
                      openGoogleMaps(
                        selectedLocation.latitude,
                        selectedLocation.longitude,
                      )
                    }
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <ExternalLink className="w-5 h-5" />
                    Navigasi ke Lokasi
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
