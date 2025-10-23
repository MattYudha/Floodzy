'use client';

import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  Circle,
  useMap,
} from 'react-leaflet';
import L from 'leaflet';
import ReactDOMServer from 'react-dom/server';
import clsx from 'clsx';
import { Waves, User, Maximize, Minimize, Siren, PlusCircle } from 'lucide-react';
import MapEventsHandler from './MapEventsHandler'; // Menggunakan komponen asli
import FloodReportCard from './FloodReportCard'; // Import komponen popup kustom
import FloodReportPopup from './FloodReportPopup'; // Import komponen popup kustom
import MapInvalidator from './MapInvalidator'; // Import komponen untuk invalidate map size
import ReportFloodControl from './ReportFloodControl';
import ReportFloodModal from './ReportFloodModal';

// Tipe data props
interface FloodReport {
  id: string;
  position: [number, number];
  timestamp: string;
  waterLevel: number;
  locationName: string;
  trend: 'rising' | 'falling' | 'stable';
  severity: 'low' | 'moderate' | 'high';
}

interface EvacuationPoint {
  id: string;
  name: string;
  position: [number, number];
}

interface ImpactZone {
  center: [number, number];
  radius: number;
}

interface PetaBanjirClientProps {
  reports: FloodReport[];
  evacuationPoints: EvacuationPoint[];
  routeCoordinates?: [number, number][] | null;
  impactZones?: ImpactZone[];
  userLocation?: [number, number] | null;
  onMapClick: (coords: [number, number]) => void;
  selectedReportId?: string | null;
  onToggleFullScreen: () => void;
  isBrowserFullScreen: boolean;
}

// Komponen untuk memusatkan peta ke marker yang dipilih
function ChangeView({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom);
  }, [center, zoom, map]);
  return null;
}

// Nama komponen diubah agar sesuai dengan nama file
export default function PetaBanjirClient({
  reports,
  evacuationPoints,
  routeCoordinates,
  impactZones,
  userLocation,
  onMapClick,
  selectedReportId,
  onToggleFullScreen,
  isBrowserFullScreen,
}: PetaBanjirClientProps) {
  const jakartaPosition: [number, number] = [-6.2088, 106.8456];
  const [mapCenter, setMapCenter] = useState<[number, number]>(jakartaPosition);
  const [isReporting, setIsReporting] = useState(false);
  const [reportLocation, setReportLocation] = useState<L.LatLng | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const markerRefs = useRef<Map<string, L.Marker>>(new Map());

  useEffect(() => {
    if (selectedReportId) {
      const report = reports?.find((r) => r.id === selectedReportId);
      if (report) {
        setMapCenter(report.position);
        // Open the popup for the selected marker
        const markerInstance = markerRefs.current.get(selectedReportId);
        if (markerInstance) {
          markerInstance.openPopup();
        }
      }
    }
  }, [selectedReportId, reports]);

  const handleMapClick = useCallback((coords: [number, number]) => {
    if (isReporting) {
      setReportLocation(L.latLng(coords[0], coords[1]));
      setIsModalOpen(true);
      setIsReporting(false); // Exit reporting mode after selecting location
    } else {
      onMapClick(coords);
    }
  }, [isReporting, onMapClick]);

  const handleReportSubmit = useCallback((formData: { waterLevel: number; notes: string; image?: File }) => {
    console.log("Laporan Banjir Baru:", {
      ...formData,
      location: reportLocation ? [reportLocation.lat, reportLocation.lng] : null,
    });
    // TODO: Implement actual submission logic (e.g., API call)
    setIsModalOpen(false);
    setReportLocation(null);
  }, [reportLocation]);

  const reportMarkerIcon = useMemo(() => {
    return L.divIcon({
      className: 'my-custom-pin',
      iconAnchor: [12, 24],
      popupAnchor: [0, -24],
      html: ReactDOMServer.renderToString(
        <div className="relative flex items-center justify-center">
          <svg className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></svg>
          <PlusCircle className="relative inline-flex rounded-full h-6 w-6 text-blue-600 bg-white" />
        </div>
      ),
    });
  }, []);

  const mostRecentReportId = useMemo(() => {
    if (!reports || reports.length === 0) return null;
    const sortedReports = [...reports].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    return sortedReports[0].id;
  }, [reports]);

  const { evacuationIcon, userLocationIcon, getFloodIcon } = useMemo(() => {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl:
        'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });

    const baseIconProps = {
      className: 'bg-transparent border-none',
      iconSize: [24, 24] as L.PointExpression,
      iconAnchor: [12, 24] as L.PointExpression,
      popupAnchor: [0, -24] as L.PointExpression,
    };

    const evacuationIcon = new L.Icon({
      iconUrl: '/assets/evacuation_marker.svg',
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40],
    });

    const userLocationIcon = new L.DivIcon({
      ...baseIconProps,
      html: ReactDOMServer.renderToString(
        <User className="text-red-600 bg-white rounded-full p-1" size={24} />,
      ),
    });

    const getFloodIcon = (report: FloodReport, isSelected: boolean, isMostRecent: boolean) => {
        let iconComponent;
        let iconColorClass;
        let iconSize = 24;
        let iconAnchor = 12;
        let popupAnchor = -24;

        if (isSelected) {
            iconComponent = <Siren />;
            iconColorClass = "text-red-600";
            iconSize = 32;
            iconAnchor = 16;
            popupAnchor = -32;
        } else {
            switch (report.severity) {
                case 'low':
                    iconComponent = <Waves />;
                    iconColorClass = "text-green-600";
                    break;
                case 'moderate':
                    iconComponent = <Waves />;
                    iconColorClass = "text-orange-500";
                    break;
                case 'high':
                    iconComponent = <Siren />;
                    iconColorClass = "text-red-600";
                    break;
                default:
                    iconComponent = <Waves />;
                    iconColorClass = "text-blue-600";
            }
        }

        const animationClass = isMostRecent ? 'animate-pulse' : '';

        return new L.DivIcon({
            ...baseIconProps,
            iconSize: [iconSize, iconSize] as L.PointExpression,
            iconAnchor: [iconAnchor, iconSize] as L.PointExpression,
            popupAnchor: [0, popupAnchor] as L.PointExpression,
            html: ReactDOMServer.renderToString(
                <div className={clsx("bg-white rounded-full p-1", iconColorClass, animationClass)}>
                    {React.cloneElement(iconComponent, { size: iconSize })}
                </div>
            ),
        });
    };

    return { evacuationIcon, userLocationIcon, getFloodIcon };
  }, [reports]);

  return (
    <>
      <MapContainer
      center={jakartaPosition}
      zoom={12}
      scrollWheelZoom={true}
      zoomControl={false}
      className={
        'w-full h-full z-10 transition-all duration-300 relative'
      }
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {/* Menggunakan komponen event handler yang asli */}
      <MapEventsHandler onMapClick={handleMapClick} />
      <ChangeView center={mapCenter} zoom={14} />
      <MapInvalidator isBrowserFullScreen={isBrowserFullScreen} />

      <div className="leaflet-top leaflet-right z-[1000] p-2">
        <div className="leaflet-control leaflet-bar bg-white rounded shadow">
          <a
            className="flex items-center justify-center w-8 h-8 cursor-pointer"
            href="#"
            title={'Tampilan Layar Penuh'}
            role="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleFullScreen();
            }}
          >
            {isBrowserFullScreen ? <Minimize size={18} /> : <Maximize size={18} />}
          </a>
        </div>
      </div>

      <ReportFloodControl isReporting={isReporting} onToggleReporting={() => setIsReporting(!isReporting)} />

      {reportLocation && (
        <Marker position={reportLocation} icon={reportMarkerIcon}>
          <Popup>Lokasi Laporan Anda</Popup>
        </Marker>
      )}

      {userLocation && (
        <Marker position={userLocation} icon={userLocationIcon}>
          <Popup>Titik Awal Anda</Popup>
        </Marker>
      )}

      {reports?.map((report) => (
        <Marker
          key={report.id}
          position={report.position}
          icon={getFloodIcon(report, report.id === selectedReportId, report.id === mostRecentReportId)}
          ref={(marker) => {
            if (marker) {
              markerRefs.current.set(report.id, marker);
            } else {
              markerRefs.current.delete(report.id);
            }
          }}
        >
          <Popup>
            <FloodReportPopup
              report={report}
            />
          </Popup>
        </Marker>
      ))}

      {evacuationPoints?.map((point) => (
        <Marker key={point.id} position={point.position} icon={evacuationIcon}>
          <Popup>
            <b>Posko Evakuasi</b>
            <br />
            {point.name}
          </Popup>
        </Marker>
      ))}

      {routeCoordinates && (
        <Polyline
          pathOptions={{ color: 'blue', weight: 5 }}
          positions={routeCoordinates}
        />
      )}

      {impactZones?.map((zone, index) => (
        <Circle
          key={index}
          center={zone.center}
          radius={zone.radius}
          pathOptions={{ color: 'red', fillColor: 'red', fillOpacity: 0.3 }}
        />
      ))}
    </MapContainer>
    <ReportFloodModal
      isOpen={isModalOpen}
      onOpenChange={setIsModalOpen}
      onSubmit={handleReportSubmit}
      location={reportLocation}
    />
    </>
  );
}
