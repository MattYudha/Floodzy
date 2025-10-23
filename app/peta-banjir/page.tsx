'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious, 
  type CarouselApi 
} from "@/components/ui/carousel";
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';
import { ChevronDown, ChevronUp } from 'lucide-react';
import clsx from 'clsx';
import FloodReportCard from '@/components/peta-banjir/FloodReportCard'; // New import

// Dinamis impor PetaBanjirClient untuk menghindari masalah SSR dengan Leaflet
const PetaBanjirClient = dynamic(() => import('@/components/peta-banjir/PetaBanjirClient'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-muted animate-pulse" />
});

// Tipe data harus cocok dengan yang ada di PetaBanjirClient
interface FloodReport {
  id: string;
  position: [number, number];
  timestamp: string;
  waterLevel: number;
  locationName: string; // New property
  trend: 'rising' | 'falling' | 'stable'; // New property
  severity: 'low' | 'moderate' | 'high'; // New property
  imageUrl?: string; // New property
}

interface EvacuationPoint {
  id: string;
  name: string;
  position: [number, number];
}

// Mock data dipindahkan ke sini karena kita butuh akses di client component
const mockFloodReports: FloodReport[] = [
  {
    id: 'report-1',
    position: [-6.2088, 106.8456],
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    waterLevel: 50,
    locationName: "Jl. Thamrin, Jakarta Pusat",
    trend: 'rising',
    severity: 'moderate',
    imageUrl: 'https://placehold.co/600x400/FF9800/FFFFFF/png?text=Banjir+Sedang',
  },
  {
    id: 'report-2',
    position: [-6.2188, 106.8556],
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    waterLevel: 120,
    locationName: "Kelapa Gading, Jakarta Utara",
    trend: 'rising',
    severity: 'high',
    imageUrl: 'https://placehold.co/600x400/F44336/FFFFFF/png?text=Banjir+Tinggi',
  },
  {
    id: 'report-3',
    position: [-6.1988, 106.8256],
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    waterLevel: 20,
    locationName: "Kebayoran Baru, Jakarta Selatan",
    trend: 'stable',
    severity: 'low',
  },
  {
    id: 'report-4',
    position: [-6.2288, 106.8656],
    timestamp: new Date(Date.now() - 15 * 60 * 60 * 1000).toISOString(),
    waterLevel: 70,
    locationName: "Tanah Abang, Jakarta Pusat",
    trend: 'falling',
    severity: 'high',
    imageUrl: 'https://placehold.co/600x400/F44336/FFFFFF/png?text=Banjir+Tinggi',
  },
  {
    id: 'report-5',
    position: [-6.1888, 106.8356],
    timestamp: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(),
    waterLevel: 35,
    locationName: "Cilandak, Jakarta Selatan",
    trend: 'stable',
    severity: 'moderate',
  },
];

const mockEvacuationPoints: EvacuationPoint[] = [
  { id: 'evac-1', name: 'Posko Evakuasi Utama', position: [-6.1754, 106.8272] },
  { id: 'evac-2', name: 'Gedung Serbaguna', position: [-6.2488, 106.8856] },
];

export default function PetaBanjirPage() {
  const [selectedReportId, setSelectedReportId] = useState<string | null>(
    mockFloodReports.length > 0 ? mockFloodReports[0].id : null
  );
  const [api, setApi] = useState<CarouselApi>();
  const [isCarouselOpen, setIsCarouselOpen] = useState(true);
  const [isBrowserFullScreen, setIsBrowserFullScreen] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const reports = mockFloodReports;
  const evacuationPoints = mockEvacuationPoints;

  const handleFullScreenToggle = () => {
    if (mapContainerRef.current) {
      if (!document.fullscreenElement) {
        mapContainerRef.current.requestFullscreen().catch((err) => {
          console.error(
            `Error attempting to enable full-screen mode: ${err.message} (${err.name})`,
            err,
          );
        });
      } else {
        document.exitFullscreen();
      }
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 100);
    }
  };

  useEffect(() => {
    if (!api) return;
 
    const onSelect = () => {
      const selectedId = reports[api.selectedScrollSnap()].id;
      setSelectedReportId(selectedId);
    };

    api.on("select", onSelect);
 
    return () => {
      api.off("select", onSelect);
    };
  }, [api, reports]);

  const handleMapClick = (coords: [number, number]) => {
    console.log('Map clicked at:', coords);
  };

  const handleCardClick = (reportId: string, index: number) => {
    setSelectedReportId(reportId);
    if (api) {
      api.scrollTo(index);
    }
  };

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsBrowserFullScreen(!!document.fullscreenElement);
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 100);
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
    };
  }, []);

  return (
    <div
      ref={mapContainerRef}
      className={clsx(
        "w-full h-[calc(100vh-var(--header-height))] flex flex-col md:relative",
        isBrowserFullScreen && "overflow-hidden"
      )}
    >
      <div className={clsx(
        "w-full transition-all duration-300 ease-in-out",
        isCarouselOpen ? "h-3/5" : "h-[calc(100%-3rem)]",
        "md:h-full",
        isBrowserFullScreen && "h-full" // Ensure it takes full height when in fullscreen
      )}>
        <PetaBanjirClient
          reports={reports}
          evacuationPoints={evacuationPoints}
          onMapClick={handleMapClick}
          selectedReportId={selectedReportId}
          onToggleFullScreen={handleFullScreenToggle}
          isBrowserFullScreen={isBrowserFullScreen}
        />
      </div>
      
      <div className={clsx(
        "relative bg-card border-t",
        "transition-all duration-300 ease-in-out",
        isCarouselOpen ? "h-2/5" : "h-12",
        "md:absolute md:bottom-0 md:left-0 md:right-0 md:z-[1000] md:h-auto md:bg-transparent md:border-none",
        isBrowserFullScreen && "hidden"
      )}>
        <button 
          onClick={() => setIsCarouselOpen(!isCarouselOpen)}
          className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 bg-card p-1 rounded-full border shadow-md md:hidden"
          aria-label="Toggle report panel"
        >
          {isCarouselOpen ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
        </button>

        <div className={clsx(
            "p-4 h-full w-full transition-opacity duration-100",
            isCarouselOpen ? 'opacity-100' : 'opacity-0 invisible'
        )}>
          <Carousel 
            setApi={setApi}
            opts={{ align: "start", loop: reports.length > 3 }}
            className="w-full max-w-4xl mx-auto"
          >
            <CarouselContent>
              {reports.map((report, index) => (
                <CarouselItem key={report.id} className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                  <div className="p-1">
                    <FloodReportCard
                      id={report.id}
                      locationName={report.locationName}
                      waterLevel={report.waterLevel}
                      timestamp={report.timestamp}
                      trend={report.trend}
                      severity={report.severity}
                      isSelected={selectedReportId === report.id}
                      onClick={() => handleCardClick(report.id, index)}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className='hidden sm:flex' />
            <CarouselNext className='hidden sm:flex' />
          </Carousel>
        </div>
      </div>
    </div>
  );
}
