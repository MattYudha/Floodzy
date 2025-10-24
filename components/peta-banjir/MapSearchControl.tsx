'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Search } from 'lucide-react';

interface MapSearchControlProps {
  onSearch: (query: string) => void;
}

const MapSearchControl: React.FC<MapSearchControlProps> = ({ onSearch }) => {
  const map = useMap();
  const controlRef = useRef<L.Control | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!map) return;

    // Create a custom control class
    const CustomControl = L.Control.extend({
      onAdd: function(map: L.Map) {
        const container = L.DomUtil.create('div');
        // Prevent map events from propagating to the map when interacting with the control
        L.DomEvent.disableClickPropagation(container);
        L.DomEvent.disableScrollPropagation(container);
        return container;
      },
      onRemove: function(map: L.Map) {
        // Nothing to do here
      }
    });

    // Add the control to the map
    const control = new CustomControl({ position: 'topleft' });
    controlRef.current = control.addTo(map);

    // Render the actual UI within the React component
    // The Leaflet control container will be managed by the CSS in globals.css
    // The React component itself will render into the DOM normally.

    return () => {
      if (controlRef.current) {
        map.removeControl(controlRef.current);
      }
    };
  }, [map]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  // Render the actual UI within the React component
  return (
    <div className="leaflet-top leaflet-left z-[1000] p-2">
      <Card className="p-2 shadow-lg pointer-events-auto">
        <form onSubmit={handleSearchSubmit} className="relative flex items-center">
          <Search className="absolute left-2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Cari lokasi..."
            className="pl-8 pr-2 py-1 w-64"
            value={searchQuery}
            onChange={handleInputChange}
          />
        </form>
      </Card>
    </div>
  );
};

export default MapSearchControl;