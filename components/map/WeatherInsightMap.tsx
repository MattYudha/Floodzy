'use client';

import React, { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card } from '@/components/ui/card';
import { Play, Pause, Loader2, Info, ZoomIn, MapPin, Cloud, CloudRain, Sun, CloudSun, Wind } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useTheme } from 'next-themes';

// Dynamic imports for Leaflet components
const MapContainer = dynamic<any>(
    () => import('react-leaflet').then((mod) => mod.MapContainer),
    { ssr: false },
);
const TileLayer = dynamic<any>(
    () => import('react-leaflet').then((mod) => mod.TileLayer),
    { ssr: false },
);
const Marker = dynamic<any>(
    () => import('react-leaflet').then((mod) => mod.Marker),
    { ssr: false },
);

// --- CONFIGURATION ---
const INDONESIA_BOUNDS: any[] = [
    [-11.0, 94.0], // South West (Rote/Sabang overlap)
    [6.5, 142.0],  // North East (Miangas/Papua)
];
const MIN_AQI_ZOOM = 7;

// --- HELPER COMPONENTS ---

// 1. Weather Marker Icon
const createCustomIcon = () => {
    return (L as any).divIcon({
        className: 'custom-pin',
        html: `<div class="relative flex h-4 w-4">
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span class="relative inline-flex rounded-full h-4 w-4 bg-cyan-500 border-2 border-white shadow-lg"></span>
                </div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8],
    });
};

function LocationMarker({ position }: { position: [number, number] }) {
    const map = useMap();

    useEffect(() => {
        if (position) {
            map.flyTo(position, 10, { duration: 1.5 });
        }
    }, [position, map]);

    return <Marker position={position} icon={createCustomIcon()} />;
}

interface RadarLoopProps {
    isPlaying: boolean;
    onFrameChange: (index: number, total: number) => void;
}

function RadarLoop({ isPlaying, onFrameChange }: RadarLoopProps) {
    const map = useMap();
    const [frames, setFrames] = useState<any[]>([]);
    const [host, setHost] = useState<string>('https://tile.rainviewer.com');
    const layerRefs = useRef<any[]>([]);
    const [hasLoaded, setHasLoaded] = useState(false);

    // 1. Lazy Load Data: Only fetch when user first clicks play
    useEffect(() => {
        if (!isPlaying && !hasLoaded) return;

        if (!hasLoaded) {
            setHasLoaded(true);
            fetch('https://api.rainviewer.com/public/weather-maps.json')
                .then(res => res.json())
                .then((data) => {
                    if (data.radar && data.radar.past) {
                        setHost(data.host || 'https://tile.rainviewer.com');
                        const pastFrames = data.radar.past;
                        const nowcastFrames = data.radar.nowcast || [];
                        const allFrames = [...pastFrames, ...nowcastFrames];
                        setFrames(allFrames);
                        onFrameChange(0, allFrames.length);
                    }
                })
                .catch(err => console.error("Radar fetch error:", err));
        }
    }, [isPlaying, hasLoaded, onFrameChange]);

    // 2. Initialize Layers (only after frames are loaded)
    useEffect(() => {
        if (frames.length === 0 || !host) return;

        // Clean up old layers
        layerRefs.current.forEach(layer => map.removeLayer(layer));
        layerRefs.current = [];

        // Create new layers
        frames.forEach((frame) => {
            const layer = (L as any).tileLayer(
                `${host}${frame.path}/256/{z}/{x}/{y}/2/1_1.png`,
                { opacity: 0, zIndex: 10, attribution: 'RainViewer' }
            );
            layer.addTo(map);
            layerRefs.current.push(layer);
        });

        return () => { layerRefs.current.forEach(layer => map.removeLayer(layer)); };
    }, [frames, host, map]);

    // 3. Animation Loop
    useEffect(() => {
        if (!isPlaying) {
            // Hide all layers immediately when paused/stopped
            layerRefs.current.forEach(l => l.setOpacity(0));
            return;
        }

        // Wait for layers to be ready
        if (layerRefs.current.length === 0) return;

        // Ensure we start with a visible frame
        const anyVisible = layerRefs.current.some(l => l.options.opacity > 0);
        if (!anyVisible && layerRefs.current[0]) {
            layerRefs.current[0].setOpacity(0.75);
            onFrameChange(0, frames.length);
        }

        const intervalId = setInterval(() => {
            if (layerRefs.current.length === 0) return;
            const current = layerRefs.current.findIndex(l => l.options.opacity > 0);
            const next = (current + 1) % frames.length;

            layerRefs.current.forEach(l => l.setOpacity(0));
            if (layerRefs.current[next]) layerRefs.current[next].setOpacity(0.75);
            onFrameChange(next, frames.length);
        }, 1500);

        return () => clearInterval(intervalId);
    }, [isPlaying, frames]);

    return null;
}

function AQILayer({ visible }: { visible: boolean }) {
    if (!visible) return null;
    return (
        <TileLayer
            url="https://tiles.aqicn.org/tiles/usepa-aqi/{z}/{x}/{y}.png"
            attribution='&copy; WAQI'
            opacity={0.7}
            zIndex={10}
            bounds={INDONESIA_BOUNDS as any}
        />
    );
}

interface MapEventHandlerProps {
    onInteractionStart: () => void;
    onInteractionEnd: () => void;
    onZoomChange?: (zoom: number) => void;
    onMapClick?: (lat: number, lon: number) => void;
}

function MapEventHandler({ onInteractionStart, onInteractionEnd, onZoomChange, onMapClick }: MapEventHandlerProps) {
    const map = useMapEvents({
        movestart: () => onInteractionStart(),
        zoomstart: () => onInteractionStart(),
        moveend: () => onInteractionEnd(),
        zoomend: () => onInteractionEnd(),
        click: (e) => {
            if (onMapClick) {
                onMapClick(e.latlng.lat, e.latlng.lng);
            }
        },
    });
    useEffect(() => {
        if (onZoomChange) {
            onZoomChange(map.getZoom());
        }
    }, [map, onZoomChange]);
    return null;
}

// --- MAIN COMPONENT ---

interface WeatherInsightMapProps {
    center: [number, number];
    zoom: number;
    activeMode: 'radar' | 'aqi';
    className?: string;
    selectedLocationName?: string;
    weatherData?: any;
    onMapClick?: (lat: number, lon: number) => void;
    activeFloodCount?: number;
}

export default function WeatherInsightMap({
    center,
    zoom,
    activeMode,
    className,
    selectedLocationName,
    weatherData,
    onMapClick,
    activeFloodCount = 0,
}: WeatherInsightMapProps) {
    const { theme, systemTheme } = useTheme();
    const [isPlaying, setIsPlaying] = useState(false);
    const [isUserInteracting, setIsUserInteracting] = useState(false);
    const [frameInfo, setFrameInfo] = useState({ index: 0, total: 0 });
    const [currentZoom, setCurrentZoom] = useState(zoom);
    const [mounted, setMounted] = useState(false);
    const [showLegend, setShowLegend] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Close legend when interacting with map (zooming/panning/clicking)
    useEffect(() => {
        if (isUserInteracting) {
            setShowLegend(false);
        }
    }, [isUserInteracting]);

    const currentTheme = theme === 'system' ? systemTheme : theme;
    const isDark = currentTheme === 'dark';

    const tileUrl = isDark
        ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

    const showAqiData = activeMode === 'aqi' && currentZoom >= MIN_AQI_ZOOM;

    // Logic: Radar is enabled if mode is radar AND user has clicked play.
    const radarVisible = activeMode === 'radar' && isPlaying;

    const getWeatherIcon = (condition: string) => {
        const lower = condition?.toLowerCase() || '';
        if (lower.includes('hujan')) return <CloudRain className="text-blue-500 dark:text-blue-400" size={24} />;
        if (lower.includes('awan') || lower.includes('berawan')) return <Cloud className="text-gray-500 dark:text-gray-400" size={24} />;
        if (lower.includes('cerah')) return <Sun className="text-yellow-500 dark:text-yellow-400" size={24} />;
        return <CloudSun className="text-cyan-500 dark:text-cyan-400" size={24} />;
    };

    if (!mounted) return null; // Prevent hydration mismatch

    return (
        <div className={`relative w-full h-full rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-900 ${className}`}>
            <MapContainer
                center={center}
                zoom={zoom}
                minZoom={4}
                maxBounds={INDONESIA_BOUNDS as any}
                maxBoundsViscosity={1.0}
                className="w-full h-full z-0"
                zoomControl={false}
            >
                <TileLayer
                    key={isDark ? 'dark' : 'light'} // Force re-render on theme change
                    url={tileUrl}
                    attribution={isDark ? '&copy; CARTO' : '&copy; OpenStreetMap'}
                />

                {/* RadarLoop is now always mounted but handles its own visibility based on isPlaying */}
                {activeMode === 'radar' && (
                    <RadarLoop
                        isPlaying={radarVisible}
                        onFrameChange={(idx, total) => setFrameInfo({ index: idx, total })}
                    />
                )}
                {activeMode === 'aqi' && <AQILayer visible={showAqiData} />}

                <MapEventHandler
                    onZoomChange={setCurrentZoom}
                    onInteractionStart={() => setIsUserInteracting(true)}
                    onInteractionEnd={() => setIsUserInteracting(false)}
                    onMapClick={onMapClick}
                />

                {selectedLocationName && <LocationMarker position={center} />}
            </MapContainer>

            {/* --- TOP RIGHT: FLOOD STATUS SYSTEM INDICATOR & LEGEND --- */}
            {/* Shifted to right-16 to avoid overlapping with Close button in IDialog */}
            <div className="absolute top-3 right-16 z-[500] pointer-events-none flex flex-col items-end">
                {selectedLocationName && (
                    <div className="flex items-start gap-2 pointer-events-auto relative">

                        {/* Legend Popup (Click triggered) */}
                        <div className={`
                            absolute top-full right-0 mt-2 w-48 p-3 rounded-xl bg-slate-900/95 backdrop-blur-md border border-white/10 text-slate-200 shadow-2xl 
                            transition-all duration-200 transform origin-top-right z-[600]
                            ${showLegend ? 'opacity-100 visible scale-100' : 'opacity-0 invisible scale-95'}
                        `}>
                            <div className="flex justify-between items-center mb-2 border-b border-white/5 pb-1">
                                <h4 className="font-bold text-[10px] uppercase tracking-widest text-slate-400">Panduan Status</h4>
                            </div>
                            <div className="space-y-2 text-[11px]">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]"></div>
                                    <span className="font-medium text-emerald-100">Zona Aman</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                    </span>
                                    <span className="font-medium text-red-100">Waspada Banjir</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                                    <span className="text-slate-400">Data Netral / Umum</span>
                                </div>
                            </div>
                        </div>

                        {/* Status Badge */}
                        <div
                            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/10 shadow-lg transition-colors hover:bg-slate-900"
                        >
                            {activeFloodCount > 0 ? (
                                <>
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                    </span>
                                    <span className="text-[10px] font-semibold tracking-wider text-slate-100 uppercase">
                                        Waspada ({activeFloodCount})
                                    </span>
                                </>
                            ) : (
                                <>
                                    <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                                    <span className="text-[10px] font-medium tracking-wider text-slate-200 uppercase">
                                        Zona Aman
                                    </span>
                                </>
                            )}

                            {/* Info Toggle Button */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowLegend(!showLegend);
                                }}
                                className={`
                                    ml-1 p-0.5 rounded-full transition-colors hover:bg-slate-700 focus:outline-none
                                    ${showLegend ? 'bg-slate-700 text-white' : 'text-slate-500'}
                                `}
                            >
                                <Info size={12} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* --- BOTTOM LEFT: MINIMAL RADAR CONTROL --- */}
            {activeMode === 'radar' && (
                <div className="absolute bottom-3 left-3 z-[400] flex items-center gap-2">
                    <Button
                        size="sm"
                        variant="ghost"
                        className={`
                            h-8 px-3 rounded-full backdrop-blur-md border border-white/10 shadow-lg transition-all
                            ${isPlaying
                                ? 'bg-slate-900/80 text-cyan-400 hover:bg-slate-900'
                                : 'bg-slate-900/60 text-slate-200 hover:bg-slate-900/80'}
                        `}
                        onClick={() => setIsPlaying(!isPlaying)}
                    >
                        {isPlaying ? (
                            <>
                                <Pause size={12} className="mr-2" />
                                <span className="text-[10px] font-medium tracking-wide">STOP RADAR</span>
                            </>
                        ) : (
                            <>
                                <Play size={12} className="mr-2" />
                                <span className="text-[10px] font-medium tracking-wide">PUTAR RADAR</span>
                            </>
                        )}
                    </Button>

                    {isPlaying && (
                        <div className="px-2 py-1 rounded-full bg-slate-900/60 backdrop-blur border border-white/5 animate-in fade-in slide-in-from-left-2 duration-300">
                            <p className="text-[9px] font-mono text-slate-400">
                                FRAME {frameInfo.index + 1}/{frameInfo.total}
                            </p>
                        </div>
                    )}
                </div>
            )}

            {activeMode === 'aqi' && !showAqiData && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[500]">
                    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 flex items-center gap-2 shadow-2xl">
                        <ZoomIn size={16} className="text-yellow-500 dark:text-yellow-400" />
                        <span className="text-sm font-medium text-slate-900 dark:text-white">Perbesar untuk detail AQI</span>
                    </div>
                </div>
            )}

        </div>
    );
}
