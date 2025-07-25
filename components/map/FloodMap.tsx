// src/components/map/FloodMap.tsx
"use client";

// Impor React-Leaflet
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polygon,
  useMap,
} from "react-leaflet";
import { Icon, LatLngExpression } from "leaflet";

// Impor dari file proyek Anda
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Layers,
  Maximize2,
  Minimize2,
  RotateCcw,
  MapPin,
  AlertTriangle,
  Droplets,
  Navigation,
  Mountain, // ICON untuk longsor
  Waves as WavesIcon, // Rename Waves untuk menghindari konflik dengan komponen Waves
  CircleDot, // Icon untuk risiko umum/rendah
  Info, // Icon untuk level info
  XCircle, // Icon untuk level danger/critical
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { MapControls } from "./MapControls";
import { MapLegend } from "./MapLegend";
import {
  DEFAULT_MAP_CENTER,
  DEFAULT_MAP_ZOOM,
  FLOOD_RISK_COLORS, // Menggunakan konstanta ini untuk warna
  FLOOD_ZONES_MOCK,
  WEATHER_MOCK_DATA,
} from "@/lib/constants";
import { FloodZone, WeatherData, FloodAlert } from "@/types"; // Import FloodAlert
import { cn } from "@/lib/utils";
import { OverpassElement } from "@/lib/api";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

// Custom marker icons
const createCustomIcon = (color: string, iconHtml: string) => {
  // Ganti icon menjadi iconHtml
  const svgString = `
    <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12.5" cy="12.5" r="12" fill="${color}" stroke="white" stroke-width="2"/>
      <text x="12.5" y="17" text-anchor="middle" fill="white" font-size="12">${iconHtml}</text>
    </svg>
  `;

  const encodedSvg = btoa(unescape(encodeURIComponent(svgString)));

  return new Icon({
    iconUrl: `data:image/svg+xml;base64,${encodedSvg}`,
    iconSize: [25, 25],
    iconAnchor: [12, 25],
    popupAnchor: [0, -25],
  });
};

const floodIcon = createCustomIcon(FLOOD_RISK_COLORS.high, "🌊");
const weatherIcon = createCustomIcon("#3B82F6", "☀️");

// Komponen Helper untuk mengupdate view peta
interface MapUpdaterProps {
  center: LatLngExpression;
  zoom: number;
}
function MapUpdater({ center, zoom }: MapUpdaterProps) {
  const map = useMap();

  useEffect(() => {
    const currentCenter = map.getCenter();
    const currentZoom = map.getZoom();

    const isCenterChanged =
      currentCenter.lat !== center[0] || currentCenter.lng !== center[1];
    const isZoomChanged = currentZoom !== zoom;

    if (isCenterChanged || isZoomChanged) {
      map.setView(center, zoom, {
        animate: true,
        duration: 0.5,
      });
    }
  }, [center, zoom, map]);
  return null;
}

// Map reset component (tetap sama)
function MapReset({
  center,
  zoom,
}: {
  center: LatLngExpression;
  zoom: number;
}) {
  const map = useMap();

  const resetView = () => {
    map.setView(center, zoom, {
      animate: true,
      duration: 0.5,
    });
  };

  return (
    <Button
      variant="glass"
      size="icon"
      onClick={resetView}
      className="absolute top-20 right-4 z-[1000]"
    >
      <RotateCcw size={16} />
    </Button>
  );
}

interface FloodMapProps {
  className?: string;
  height?: string;
  onLocationSelect?: (location: LatLngExpression) => void;
  center?: [number, number];
  zoom?: number;
  floodProneData?: OverpassElement[];
  loadingFloodData?: boolean;
  floodDataError?: string | null;
  realtimeFloodAlerts?: FloodAlert[]; // Properti baru untuk peringatan real-time
  loadingRealtimeAlerts?: boolean; // Properti baru untuk status loading
  realtimeAlertsError?: string | null; // Properti baru untuk error
}

export function FloodMap({
  className,
  height,
  onLocationSelect,
  center = DEFAULT_MAP_CENTER,
  zoom = DEFAULT_MAP_ZOOM,
  floodProneData = [],
  loadingFloodData = false,
  floodDataError = null,
  realtimeFloodAlerts = [], // Inisialisasi
  loadingRealtimeAlerts = false, // Inisialisasi
  realtimeAlertsError = null, // Inisialisasi
}: FloodMapProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedLayer, setSelectedLayer] = useState("street");
  const [showFloodZones, setShowFloodZones] = useState(true); // Untuk mock data FLOOD_ZONES_MOCK
  const [showWeatherStations, setShowWeatherStations] = useState(true);
  const [showRealtimeAlerts, setShowRealtimeAlerts] = useState(true); // State baru untuk toggle peringatan real-time
  const [floodZones] = useState<FloodZone[]>(FLOOD_ZONES_MOCK); // Mock data asli
  const [weatherData] = useState<WeatherData>(WEATHER_MOCK_DATA);
  const mapRef = useRef<L.Map | null>(null); // PERBAIKAN: Inisialisasi dengan null

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const getPolygonColor = (riskLevel: FloodZone["riskLevel"]) => {
    return FLOOD_RISK_COLORS[riskLevel];
  };

  // Fungsi helper untuk mendapatkan warna dan judul popup berdasarkan tags elemen Overpass
  // Fungsi ini sekarang mengembalikan objek info bencana yang lebih spesifik
  const getDisasterInfo = (element: OverpassElement) => {
    let iconToUse;
    let color;
    let cardTitle;
    let cardTitleColor;
    let riskLabel = "Tidak Dikategorikan"; // Label risiko di Legenda
    const detailText =
      element.tags.name ||
      element.tags.description ||
      element.tags.note ||
      `ID: ${element.id}`;

    // === LOGIKA PEMETAAN RISIKO DARI TAGS OVERPASS (PRIORITAS TINGGI KE RENDAH) ===

    // Prioritas 1: Risiko Kritis
    if (
      element.tags.flood_prone === "critical" ||
      element.tags.hazard === "critical_flood" ||
      element.tags.disaster_type === "extreme_flood"
    ) {
      iconToUse = createCustomIcon(FLOOD_RISK_COLORS.critical, "💀"); // Cokelat gelap (sesuai constants.ts)
      color = FLOOD_RISK_COLORS.critical; // Cokelat gelap (sesuai constants.ts)
      cardTitle = "Risiko Kritis (Bencana Ekstrim)";
      cardTitleColor = "text-red-800";
      riskLabel = "Risiko Kritis";
    }
    // Prioritas 2: Risiko Tinggi (Banjir Konkret) - MERAH
    else if (
      element.tags.hazard === "flood" ||
      element.tags.flood_prone === "yes" ||
      (element.tags.waterway === "river" &&
        element.tags.seasonal === "yes" &&
        element.tags.flood_risk === "high")
    ) {
      // Tambahan tag river, seasonal, flood_risk
      iconToUse = createCustomIcon(FLOOD_RISK_COLORS.high, "🚨"); // Merah (sesuai constants.ts)
      color = FLOOD_RISK_COLORS.high; // Merah (sesuai constants.ts)
      cardTitle = "Risiko Tinggi Banjir";
      cardTitleColor = "text-red-500";
      riskLabel = "Risiko Tinggi";
    }
    // Prioritas 3: Risiko Sedang (Longsor atau Area Rawan Lain) - KUNING
    else if (
      element.tags.natural === "landslide" ||
      element.tags.hazard === "landslide" ||
      element.tags.natural === "mudflow" ||
      element.tags.landuse === "landslide_prone"
    ) {
      // Tambahan mudflow, landslide_prone
      iconToUse = createCustomIcon("#FFFF00", "⛰️"); // KUNING (explicit hex code)
      color = "#FFFF00"; // KUNING (explicit hex code)
      cardTitle = "Risiko Sedang Longsor";
      cardTitleColor = "text-yellow-500";
      riskLabel = "Risiko Sedang";
    }
    // Prioritas 4: Risiko Rendah (Fitur Air Umum yang Berpotensi) - HIJAU
    // Hanya dirender jika tidak ada tag risiko yang lebih tinggi, dan tetap dengan warna hijau
    else if (
      element.tags.waterway ||
      element.tags.natural === "water" ||
      element.tags.man_made === "dyke" ||
      element.tags.landuse === "basin" ||
      element.tags.natural === "wetland"
    ) {
      iconToUse = createCustomIcon(FLOOD_RISK_COLORS.low, "💧"); // HIJAU (sesuai constants.ts)
      color = FLOOD_RISK_COLORS.low; // HIJAU (sesuai constants.ts)
      cardTitle = "Risiko Rendah (Fitur Air)";
      cardTitleColor = "text-green-500";
      riskLabel = "Risiko Rendah";
    }
    // Jika tidak ada tag bencana spesifik yang terdeteksi di atas, fungsi akan mengembalikan null
    else {
      return null; // Mengembalikan null agar elemen ini tidak dirender
    }

    return {
      iconToUse,
      color,
      cardTitle,
      cardTitleColor,
      detailText,
      riskLabel,
    };
  };

  // FUNGSI HELPER BARU: untuk mendapatkan info visual dari FloodAlert
  const getAlertInfo = (alert: FloodAlert) => {
    let iconToUse;
    let color;
    let cardTitle;
    let cardTitleColor;
    let badgeVariant: "info" | "warning" | "danger" | "success" = "info";

    switch (alert.level) {
      case "critical":
        iconToUse = createCustomIcon(FLOOD_RISK_COLORS.critical, "💀");
        color = FLOOD_RISK_COLORS.critical;
        cardTitle = "Peringatan KRITIS!";
        cardTitleColor = "text-red-800";
        badgeVariant = "danger";
        break;
      case "danger":
        iconToUse = createCustomIcon(FLOOD_RISK_COLORS.high, "🚨");
        color = FLOOD_RISK_COLORS.high;
        cardTitle = "Peringatan BAHAYA!";
        cardTitleColor = "text-red-500";
        badgeVariant = "danger";
        break;
      case "warning":
        iconToUse = createCustomIcon(FLOOD_RISK_COLORS.medium, "⚠️");
        color = FLOOD_RISK_COLORS.medium;
        cardTitle = "Peringatan!";
        cardTitleColor = "text-yellow-500";
        badgeVariant = "warning";
        break;
      case "info":
      default:
        iconToUse = createCustomIcon(FLOOD_RISK_COLORS.low, "ℹ️");
        color = FLOOD_RISK_COLORS.low;
        cardTitle = "Informasi";
        cardTitleColor = "text-blue-500";
        badgeVariant = "info";
        break;
    }

    return {
      iconToUse,
      color,
      cardTitle,
      cardTitleColor,
      badgeVariant,
    };
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "relative rounded-lg overflow-hidden shadow-lg",
        isFullscreen && "fixed inset-0 z-50 rounded-none",
        className
      )}
      style={{ height: isFullscreen ? "100vh" : height }}
    >
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        className="w-full h-full"
        ref={mapRef as any}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapUpdater center={center} zoom={zoom} />
        <MapReset center={DEFAULT_MAP_CENTER} zoom={DEFAULT_MAP_ZOOM} />

        {/* Marker di lokasi yang dipilih (dari RegionDropdown via page.tsx) */}
        {center[0] !== DEFAULT_MAP_CENTER[0] ||
        center[1] !== DEFAULT_MAP_CENTER[1] ? (
          <Marker position={center} icon={floodIcon}>
            <Popup>
              Lokasi Terpilih: <br /> Lat: {center[0].toFixed(6)}, Lng:{" "}
              {center[1].toFixed(6)}
            </Popup>
          </Marker>
        ) : null}

        {/* Flood Zones (menggunakan mock data yang sudah ada) */}
        {/* Ini tetap ada sebagai layer terpisah, bisa di toggle jika perlu */}
        {showFloodZones &&
          floodZones.map((zone) => (
            <Polygon
              key={zone.id}
              positions={zone.coordinates}
              pathOptions={{
                color: getPolygonColor(zone.riskLevel),
                fillColor: getPolygonColor(zone.riskLevel),
                fillOpacity: 0.3,
                weight: 2,
              }}
            >
              <Popup>
                <Card className="min-w-[200px] p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{zone.name}</h3>
                      <Badge
                        variant={
                          zone.riskLevel === "high"
                            ? "danger"
                            : zone.riskLevel === "medium"
                            ? "warning"
                            : "success"
                        }
                      >
                        {zone.riskLevel.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <MapPin size={14} className="text-muted-foreground" />
                        <span>Luas: {zone.area} km²</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <AlertTriangle
                          size={14}
                          className="text-muted-foreground"
                        />
                        <span>
                          Populasi: {zone.population.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {zone.description}
                    </p>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        Detail
                      </Button>
                      <Button size="sm" variant="secondary">
                        Rute Evakuasi
                      </Button>
                    </div>
                  </div>
                </Card>
              </Popup>
            </Polygon>
          ))}

        {/* Weather Stations (menggunakan mock data) */}
        {showWeatherStations && (
          <Marker position={[-6.2, 106.816]} icon={weatherIcon}>
            <Popup>
              <Card className="min-w-[250px] p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Stasiun Cuaca Jakarta</h3>
                    <Badge variant="info">Aktif</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-1">
                      <p className="text-muted-foreground">Suhu</p>
                      <p className="font-medium">{weatherData.temperature}°C</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-muted-foreground">Kelembaban</p>
                      <p className="font-medium">{weatherData.humidity}%</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-muted-foreground">Angin</p>
                      <p className="font-medium">
                        {weatherData.windSpeed} km/h
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-muted-foreground">Tekanan</p>
                      <p className="font-medium">{weatherData.pressure} hPa</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 p-2 bg-muted rounded">
                    <Droplets size={16} className="text-secondary" />
                    <span className="text-sm">{weatherData.description}</span>
                  </div>
                </div>
              </Card>
            </Popup>
          </Marker>
        )}

        {/* === MENAMPILKAN DATA RAWAN BANJIR/BENCANA DARI OVERPASS API === */}
        {loadingFloodData && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1001] bg-gray-800/70 p-4 rounded-lg text-white text-sm">
            Memuat data rawan bencana...
            <LoadingSpinner className="ml-2 inline-block" />
          </div>
        )}
        {floodDataError && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1001] bg-red-800/70 p-4 rounded-lg text-white text-sm">
            Error memuat data bencana: {floodDataError}
          </div>
        )}
        {!loadingFloodData &&
          !floodDataError &&
          floodProneData.length > 0 &&
          showFloodZones &&
          floodProneData.map((element) => {
            const disasterInfo = getDisasterInfo(element); // Panggil fungsi

            // HANYA RENDER JIKA FUNGSI MENGEMBALIKAN OBJEK (bukan null)
            if (!disasterInfo) {
              return null; // Tidak merender jika kategori tidak spesifik
            }

            const { iconToUse, color, cardTitle, cardTitleColor, detailText } =
              disasterInfo;

            // RENDER POLYGON UNTUK ELEMENT DENGAN GEOMETRI (WAY/RELATION)
            if (element.geometry && element.geometry.length > 0) {
              const positions = element.geometry.map(
                (coord) => [coord.lat, coord.lon] as LatLngExpression
              );

              return (
                <Polygon
                  key={`overpass-poly-${element.id}`}
                  positions={positions}
                  pathOptions={{
                    color: color,
                    fillColor: color,
                    fillOpacity: 0.3, // Lebih transparan untuk area
                    weight: 2,
                  }}
                >
                  <Popup>
                    <Card className="min-w-[200px] p-3">
                      <h4 className={`font-semibold ${cardTitleColor}`}>
                        {cardTitle}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        ID OSM: {element.id}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Tipe OSM: {element.type}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Detail: {detailText}
                      </p>
                      {Object.keys(element.tags).length > 0 && (
                        <div className="mt-2 text-xs text-gray-400">
                          <strong>Tags:</strong>
                          <ul className="list-disc list-inside">
                            {Object.entries(element.tags).map(
                              ([key, value]) => (
                                <li key={key}>
                                  {key}: {value}
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      )}
                    </Card>
                  </Popup>
                </Polygon>
              );
            }
            // RENDER MARKER UNTUK NODE
            else if (element.type === "node" && element.lat && element.lon) {
              return (
                <Marker
                  key={`overpass-node-${element.id}`}
                  position={[element.lat, element.lon]}
                  icon={iconToUse}
                >
                  <Popup>
                    <Card className="min-w-[180px] p-3">
                      <h4 className={`font-semibold ${cardTitleColor}`}>
                        {cardTitle}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Detail: {detailText}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Tipe OSM: {element.type}
                      </p>
                      {Object.keys(element.tags).length > 0 && (
                        <div className="mt-2 text-xs text-gray-400">
                          <strong>Tags:</strong>
                          <ul className="list-disc list-inside">
                            {Object.entries(element.tags).map(
                              ([key, value]) => (
                                <li key={key}>
                                  {key}: {value}
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      )}
                    </Card>
                  </Popup>
                </Marker>
              );
            }
            return null;
          })}

        {/* === MENAMPILKAN DATA PERINGATAN BANJIR REAL-TIME === */}
        {loadingRealtimeAlerts && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1001] bg-gray-800/70 p-4 rounded-lg text-white text-sm">
            Memuat peringatan banjir...
            <LoadingSpinner className="ml-2 inline-block" />
          </div>
        )}
        {realtimeAlertsError && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1001] bg-red-800/70 p-4 rounded-lg text-white text-sm">
            Error memuat peringatan banjir: {realtimeAlertsError}
          </div>
        )}
        {!loadingRealtimeAlerts &&
          !realtimeAlertsError &&
          realtimeFloodAlerts.length > 0 &&
          showRealtimeAlerts &&
          realtimeFloodAlerts.map((alert) => {
            const {
              iconToUse,
              color,
              cardTitle,
              cardTitleColor,
              badgeVariant,
            } = getAlertInfo(alert);

            // Render Polygon jika ada polygonCoordinates
            if (
              alert.polygonCoordinates &&
              alert.polygonCoordinates.length > 0
            ) {
              // Flattern array jika nested ([[lat,lng],[lat,lng]]) -> [[lat,lng],[lat,lng]]
              const flatCoordinates = alert.polygonCoordinates
                .flat()
                .map((coords) => [coords[0], coords[1]] as LatLngExpression);

              return (
                <Polygon
                  key={`alert-poly-${alert.id}`}
                  positions={flatCoordinates}
                  pathOptions={{
                    color: color,
                    fillColor: color,
                    fillOpacity: 0.4,
                    weight: 3,
                  }}
                >
                  <Popup>
                    <Card className="min-w-[200px] p-3">
                      <div className="flex items-center justify-between">
                        <h4 className={`font-semibold ${cardTitleColor}`}>
                          {cardTitle}
                        </h4>
                        <Badge variant={badgeVariant}>
                          {alert.level.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm mt-2">{alert.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {alert.message}
                      </p>
                      <div className="mt-2 text-xs text-gray-400">
                        <strong>Wilayah Terdampak:</strong>
                        <ul className="list-disc list-inside">
                          {alert.affectedAreas.map((area, index) => (
                            <li key={index}>{area}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="mt-2 text-xs text-gray-400">
                        <strong>Tindakan Disarankan:</strong>
                        <ul className="list-disc list-inside">
                          {alert.actions.map((action, index) => (
                            <li key={index}>{action}</li>
                          ))}
                        </ul>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Pembaruan terakhir:{" "}
                        {new Date(alert.timestamp).toLocaleString()}
                      </p>
                    </Card>
                  </Popup>
                </Polygon>
              );
            }
            // Render Marker jika ada coordinates (dan tidak ada polygon)
            else if (alert.coordinates) {
              return (
                <Marker
                  key={`alert-marker-${alert.id}`}
                  position={alert.coordinates}
                  icon={iconToUse}
                >
                  <Popup>
                    <Card className="min-w-[180px] p-3">
                      <div className="flex items-center justify-between">
                        <h4 className={`font-semibold ${cardTitleColor}`}>
                          {cardTitle}
                        </h4>
                        <Badge variant={badgeVariant}>
                          {alert.level.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm mt-2">{alert.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {alert.message}
                      </p>
                      <div className="mt-2 text-xs text-gray-400">
                        <strong>Wilayah Terdampak:</strong>
                        <ul className="list-disc list-inside">
                          {alert.affectedAreas.map((area, index) => (
                            <li key={index}>{area}</li>
                          ))}
                        </ul>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Pembaruan terakhir:{" "}
                        {new Date(alert.timestamp).toLocaleString()}
                      </p>
                    </Card>
                  </Popup>
                </Marker>
              );
            }
            return null; // Jangan render jika tidak ada data geografis
          })}
      </MapContainer>

      {/* Map Controls */}
      <MapControls
        onFullscreenToggle={toggleFullscreen}
        isFullscreen={isFullscreen}
        onLayerChange={setSelectedLayer}
        selectedLayer={selectedLayer}
        onFloodZonesToggle={() => setShowFloodZones(!showFloodZones)}
        showFloodZones={showFloodZones}
        onWeatherToggle={() => setShowWeatherStations(!showWeatherStations)}
        showWeatherStations={showWeatherStations}
        onRealtimeAlertsToggle={() =>
          setShowRealtimeAlerts(!showRealtimeAlerts)
        } // Properti baru
        showRealtimeAlerts={showRealtimeAlerts} // Properti baru
      />

      {/* Map Legend */}
      <MapLegend />

      {/* Fullscreen Toggle */}
      <Button
        variant="glass"
        size="icon"
        onClick={toggleFullscreen}
        className="absolute top-4 right-4 z-[1000]"
      >
        {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
      </Button>
    </motion.div>
  );
}
