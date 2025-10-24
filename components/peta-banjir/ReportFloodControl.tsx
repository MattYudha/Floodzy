'use client';

import React, { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import ReactDOM from 'react-dom';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
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
  const controlContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!controlContainerRef.current) return;

    const CustomControl = (L as any).Control.extend({
      onAdd: function () {
        const div = (L as any).DomUtil.create(
          'div',
          'leaflet-bar leaflet-control',
        );
        // Append the React button container to the Leaflet control's div
        controlContainerRef.current?.appendChild(div);
        (L as any).DomEvent.disableClickPropagation(div);
        return div;
      },
      onRemove: function () {
        // Nothing to do here
      },
    });

    const control = new CustomControl({ position: 'topleft' });
    control.addTo(map);

    // Render the React component into the control container
    const portalDiv = (L as any).DomUtil.create('div', '');
    controlContainerRef.current.appendChild(portalDiv);
    ReactDOM.render(
      <Button
        variant={isReporting ? 'destructive' : 'default'}
        size="icon"
        className="shadow-lg pointer-events-auto"
        onClick={onToggleReporting}
        title={isReporting ? 'Batalkan Mode Lapor' : 'Aktifkan Mode Lapor'}
      >
        <Plus className="w-5 h-5" />
      </Button>,
      portalDiv,
    );

    return () => {
      control.remove();
      ReactDOM.unmountComponentAtNode(portalDiv);
    };
  }, [map, isReporting, onToggleReporting]);

  return (
    <div
      ref={controlContainerRef}
      className="leaflet-top leaflet-left z-[1000] p-2"
    ></div>
  );
}
