import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { DaerahIrigasi, KecamatanNagekeo, KECAMATAN_NAGEKEO_LIST } from '../types/irigasi';
import { Layers, MapPin, ZoomIn, Info } from 'lucide-react';

interface InteractiveMapProps {
  data: DaerahIrigasi[];
  onSelectDI: (di: DaerahIrigasi) => void;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({ data, onSelectDI }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});
  
  const [selectedKecamatan, setSelectedKecamatan] = useState<string>('all');
  const [activeDIId, setActiveDIId] = useState<string | null>(null);

  const filteredData = selectedKecamatan === 'all'
    ? data
    : data.filter((d) => d.kecamatan === selectedKecamatan);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Center of Kabupaten Nagekeo (Mbay / Aesesa)
      const map = L.map(mapContainerRef.current, {
        center: [-8.67, 121.28],
        zoom: 11,
        zoomControl: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Dinas PUPR Kab. Nagekeo',
        maxZoom: 18,
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear old markers
    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};

    const bounds = L.latLngBounds([]);

    filteredData.forEach((di) => {
      if (!di.koordinat?.lat || !di.koordinat?.lng) return;

      const latLng = L.latLng(di.koordinat.lat, di.koordinat.lng);
      bounds.extend(latLng);

      const colorHex =
        di.kondisiFisik === 'Baik'
          ? '#10B981'
          : di.kondisiFisik === 'Rusak Ringan'
          ? '#3B82F6'
          : di.kondisiFisik === 'Rusak Sedang'
          ? '#F59E0B'
          : '#EF4444';

      const customIcon = L.divIcon({
        className: 'custom-map-pin',
        html: `
          <div style="
            background-color: ${colorHex};
            width: 28px;
            height: 28px;
            border-radius: 50%;
            border: 2px solid #ffffff;
            box-shadow: 0 2px 6px rgba(0,0,0,0.35);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #ffffff;
            font-size: 11px;
            font-weight: bold;
            font-family: monospace;
          ">
            <span>DI</span>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
        popupAnchor: [0, -16],
      });

      const marker = L.marker(latLng, { icon: customIcon }).addTo(map);

      // Popup Content
      const popupContent = document.createElement('div');
      popupContent.className = 'p-1 font-sans text-xs';
      popupContent.innerHTML = `
        <div style="font-weight: 700; font-size: 13px; color: #0f172a; margin-bottom: 2px;">
          ${di.nama}
        </div>
        <div style="color: #64748b; font-size: 11px; margin-bottom: 6px;">
          ${di.kodeDI} · Kec. ${di.kecamatan}
        </div>
        <div style="border-top: 1px solid #e2e8f0; padding-top: 6px; margin-bottom: 6px; display: grid; grid-template-columns: 1fr 1fr; gap: 4px;">
          <div>
            <span style="color: #94a3b8; font-size: 10px; display: block;">Fungsional</span>
            <strong style="color: #0f172a; font-family: monospace;">${di.luasFungsional} Ha</strong>
          </div>
          <div>
            <span style="color: #94a3b8; font-size: 10px; display: block;">Nilai IKSI</span>
            <strong style="color: ${colorHex}; font-family: monospace;">${di.nilaiIKSI}%</strong>
          </div>
        </div>
        <div style="font-size: 11px; color: #334155; margin-bottom: 8px;">
          <strong>${di.bangunanUtama?.nama}</strong> (${di.sumberAir})
        </div>
        <button id="btn-detail-${di.id}" style="
          width: 100%;
          padding: 5px 8px;
          background: #0f172a;
          color: white;
          border-radius: 6px;
          border: none;
          cursor: pointer;
          font-weight: 600;
          font-size: 11px;
        ">
          Buka Profil Lengkap →
        </button>
      `;

      marker.bindPopup(popupContent);

      marker.on('popupopen', () => {
        const btn = document.getElementById(`btn-detail-${di.id}`);
        if (btn) {
          btn.onclick = () => {
            onSelectDI(di);
          };
        }
      });

      markersRef.current[di.id] = marker;
    });

    if (filteredData.length > 0 && bounds.isValid()) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 13 });
    }
  }, [filteredData, onSelectDI]);

  const handleZoomToDI = (di: DaerahIrigasi) => {
    setActiveDIId(di.id);
    const map = mapInstanceRef.current;
    const marker = markersRef.current[di.id];
    if (map && marker && di.koordinat) {
      map.setView([di.koordinat.lat, di.koordinat.lng], 14, { animate: true });
      marker.openPopup();
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Map Toolbar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-amber-500" />
            <span>Peta Geospasial Daerah Irigasi & Bendung Kab. Nagekeo</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Visualisasi koordinat intake/bendung utama dan sebaran jaringan di 7 kecamatan.
          </p>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          <select
            value={selectedKecamatan}
            onChange={(e) => setSelectedKecamatan(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            <option value="all">Semua Kecamatan (7)</option>
            {KECAMATAN_NAGEKEO_LIST.map((kec) => (
              <option key={kec} value={kec}>
                Kec. {kec}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Map + Sidebar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        
        {/* Left Side: DI Fast Selector */}
        <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs flex flex-col h-[560px]">
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 mb-2">
            <span className="text-xs font-bold text-slate-800">Daftar Titik Irigasi</span>
            <span className="text-[11px] font-mono text-slate-500 tabular-nums">
              {filteredData.length} Titik
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
            {filteredData.map((di) => (
              <button
                key={di.id}
                type="button"
                onClick={() => handleZoomToDI(di)}
                className={`w-full text-left p-2.5 rounded-lg border text-xs transition-colors flex items-center justify-between ${
                  activeDIId === di.id
                    ? 'border-amber-500 bg-amber-50/50 text-slate-900'
                    : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="min-w-0 pr-2">
                  <div className="font-semibold truncate">{di.nama}</div>
                  <div className="text-[11px] text-slate-500 truncate">
                    Kec. {di.kecamatan} · {di.luasFungsional} Ha
                  </div>
                </div>
                <div className="shrink-0 flex items-center gap-1.5">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{
                      backgroundColor:
                        di.kondisiFisik === 'Baik'
                          ? '#10B981'
                          : di.kondisiFisik === 'Rusak Ringan'
                          ? '#3B82F6'
                          : di.kondisiFisik === 'Rusak Sedang'
                          ? '#F59E0B'
                          : '#EF4444',
                    }}
                    title={di.kondisiFisik}
                  />
                  <ZoomIn className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </button>
            ))}
          </div>

          {/* Quick Legend at bottom of sidebar */}
          <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-500 space-y-1">
            <div className="font-semibold text-slate-700 text-xs mb-1">Legenda Kondisi:</div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
              <span>Baik (IKSI &ge; 77.5%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0" />
              <span>Rusak Ringan (IKSI 70 - 77.4%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
              <span>Rusak Sedang (IKSI 55 - 69.9%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0" />
              <span>Rusak Berat (IKSI &lt; 55%)</span>
            </div>
          </div>
        </div>

        {/* Right Side: Leaflet Canvas */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs relative h-[560px]">
          <div ref={mapContainerRef} className="w-full h-full z-10" />

          {/* Coordinates HUD overlay */}
          <div className="absolute bottom-3 left-3 z-20 bg-slate-900/90 text-white backdrop-blur-xs px-3 py-1.5 rounded-md text-[11px] font-mono border border-slate-700 flex items-center gap-2 shadow-sm pointer-events-none">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span>Kabupaten Nagekeo (-8.67° S, 121.28° E)</span>
          </div>
        </div>

      </div>
    </div>
  );
};
