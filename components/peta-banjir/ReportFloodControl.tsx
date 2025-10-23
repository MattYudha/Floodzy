'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import ReactDOM from 'react-dom';
import { PlusCircle, XCircle } from 'lucide-react';
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
    <div
      className={clsx(
        "flex items-center justify-center w-8 h-8 cursor-pointer",
        isReporting ? "bg-red-500 text-white" : "bg-white text-gray-700",
        "rounded shadow-md hover:bg-gray-100 transition-colors duration-200"
      )}
      title={isReporting ? "Batalkan Mode Lapor" : "Aktifkan Mode Lapor"}
      role="button"
      onClick={onToggleReporting}
    >
      {isReporting ? <XCircle size={18} /> : <PlusCircle size={18} />}
    </div>,
    controlContainer
  );
}
