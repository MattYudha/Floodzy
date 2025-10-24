import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine';



interface EvacuationRoutingProps {
  start: [number, number];
  end: [number, number];
}

const EvacuationRouting: React.FC<EvacuationRoutingProps> = ({ start, end }) => {
  const map = useMap();
  const routingControlRef = useRef<any>(null); // Ref untuk menyimpan instance kontrol

  useEffect(() => {
    if (!map || !start || !end) return;

    // Hapus rute lama jika ada
    if (routingControlRef.current) {
      map.removeControl(routingControlRef.current);
      routingControlRef.current = null;
    }

    // Buat instance kontrol routing
    const routingControl = L.Routing.control({
      waypoints: [L.latLng(start[0], start[1]), L.latLng(end[0], end[1])],
      routeWhileDragging: false,
      addWaypoints: false, // Tidak izinkan pengguna menambah/mengubah titik
      draggableWaypoints: false,
      show: false, // Sembunyikan panel instruksi belokan (kita hanya ingin garisnya)
      lineOptions: {
        styles: [
          { color: '#007BFF', opacity: 0.8, weight: 6 }, // Gaya garis rute
        ],
      },
    }).addTo(map);

    // Simpan instance ke ref
    routingControlRef.current = routingControl;

    // Cleanup saat komponen unmount
    return () => {
      if (routingControlRef.current) {
        map.removeControl(routingControlRef.current);
      }
    };
  }, [map, start, end]); // Dijalankan ulang jika map, start, atau end berubah

  return null; // Komponen ini tidak me-render DOM, hanya memanipulasi map
};

export default EvacuationRouting;