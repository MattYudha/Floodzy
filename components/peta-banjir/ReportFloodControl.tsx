'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import ReactDOM from 'react-dom';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import clsx from 'clsx';

interface ReportFloodControlProps {
  isReporting: boolean;
  onToggleReporting: () => void;
}

export default function ReportFloodControl({
  isReporting,
  onToggleReporting,
}: ReportFloodControlProps) {
  const map = useMap();
  const controlRef = useRef<HTMLDivElement>(null);
  const [controlContainer, setControlContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (!controlRef.current) return;

    const CustomControl = L.Control.extend({
      onAdd: function () {
        const div = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
        L.DomEvent.disableClickPropagation(div);
        setControlContainer(div);
        return div;
      },
      onRemove: function () {
        // Nothing to do here
      },
    });

    const control = new CustomControl({ position: 'topleft' });
    control.addTo(map);

    return () => {
      control.remove();
    };
  }, [map]);

  if (!controlContainer) {
    return null;
  }

  return ReactDOM.createPortal(
    <Button
      variant={isReporting ? "destructive" : "default"}
      size="icon"
      className="shadow-lg pointer-events-auto"
      onClick={onToggleReporting}
      title={isReporting ? "Batalkan Mode Lapor" : "Aktifkan Mode Lapor"}
    >
      <Plus className="w-5 h-5" />
    </Button>,
    controlContainer
  );
}
