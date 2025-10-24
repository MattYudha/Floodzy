'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface MapFilterControlProps {
  onApplyFilters: (filters: any) => void; // TODO: Define a proper type for filters
  initialFilters?: {
    severity: string[];
    timeRange: string;
    status: string;
  };
}

const MapFilterControl: React.FC<MapFilterControlProps> = ({ onApplyFilters, initialFilters }) => {
  const map = useMap();
  const controlRef = useRef<L.Control | null>(null);
  const [filters, setFilters] = useState(initialFilters || {
    severity: [],
    timeRange: 'all',
    status: 'all',
  });

  useEffect(() => {
    if (!map) return;

    const CustomControl = L.Control.extend({
      onAdd: function(map: L.Map) {
        const container = L.DomUtil.create('div');
        L.DomEvent.disableClickPropagation(container);
        L.DomEvent.disableScrollPropagation(container);
        return container;
      },
      onRemove: function(map: L.Map) {
        // Nothing to do here
      }
    });

    const control = new CustomControl({ position: 'topright' });
    controlRef.current = control.addTo(map);

    return () => {
      if (controlRef.current) {
        map.removeControl(controlRef.current);
      }
    };
  }, [map]);

  const handleChange = (filterType: string, value: any) => {
    const newFilters = { ...filters, [filterType]: value };
    setFilters(newFilters);
    onApplyFilters(newFilters);
  };

  return (
    <div className="leaflet-top leaflet-right z-[1000] p-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="secondary" size="icon" className="shadow-lg pointer-events-auto">
            <SlidersHorizontal className="w-5 h-5" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72 pointer-events-auto">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Filter Laporan</h4>
              <p className="text-sm text-muted-foreground">
                Saring laporan di peta.
              </p>
            </div>

            <div className="grid gap-2">
              <Label>Tingkat Keparahan</Label>
              <ToggleGroup
                type="multiple"
                variant="outline"
                defaultValue={filters.severity}
                onValueChange={(value) => handleChange('severity', value)}
              >
                <ToggleGroupItem value="low">Rendah</ToggleGroupItem>
                <ToggleGroupItem value="moderate">Sedang</ToggleGroupItem>
                <ToggleGroupItem value="high">Tinggi</ToggleGroupItem>
              </ToggleGroup>
            </div>

            <div className="grid gap-2">
              <Label>Rentang Waktu</Label>
              <Select defaultValue={filters.timeRange} onValueChange={(value) => handleChange('timeRange', value)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="24h">24 Jam Terakhir</SelectItem>
                  <SelectItem value="3d">3 Hari Terakhir</SelectItem>
                  <SelectItem value="all">Semua Waktu</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
               <Label>Status Laporan</Label>
               <RadioGroup defaultValue={filters.status} onValueChange={(value) => handleChange('status', value)}>
                 <div className="flex items-center space-x-2">
                   <RadioGroupItem value="all" id="r-all" />
                   <Label htmlFor="r-all">Semua</Label>
                 </div>
                 <div className="flex items-center space-x-2">
                   <RadioGroupItem value="verified" id="r-verified" />
                   <Label htmlFor="r-verified">Hanya Terverifikasi</Label>
                 </div>
               </RadioGroup>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default MapFilterControl;