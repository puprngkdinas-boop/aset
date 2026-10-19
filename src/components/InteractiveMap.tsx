import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { DaerahIrigasi, KECAMATAN_NAGEKEO_LIST } from '../types/irigasi';
import { Layers, MapPin, ZoomIn, Satellite, Map as MapIcon, Mountain, Compass, RotateCcw } from 'lucide-react';

interface InteractiveMapProps {
  data: DaerahIrigasi[];
  onSelectDI: (di: DaerahIrigasi) => void;
}

export type MapTileMode = 'satellite-hybrid' | 'esri-satellite' | 'streets' | 'topo';

interface TileLayerDefinition {
  id: MapTileMode;
  name: string;
  badge: string;
  url: string;
  options: L.TileLayerOptions;
  sublayer?: {
    url: string;
    options: L.TileLayerOptions;
  };
}

const TILE_LAYERS: Record<MapTileMode, TileLayerDefinition> = {
  'satellite-hybrid': {
    id: 'satellite-hybrid',
    name: 'Satelit Hybrid',
    badge: 'Citra Satelit + Nama Jalan & Batas',
    url: 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
    options: {
      maxZoom: 20,
      attribution: '&copy; Google Maps · Citra Satelit Hybrid | Dinas PUPR Kab. Nagekeo',
    },
  },
  'esri-satellite': {
    id: 'esri-satellite',
    name: 'Satelit Esri',
    badge: 'Citra Resolusi Tinggi Esri World Imagery',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    options: {
      maxZoom: 19,
      attribution: 'Tiles &copy; Esri, Maxar, Earthstar Geographics | Dinas PUPR Kab. Nagekeo',
    },
    sublayer: {
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
      options: {
        maxZoom: 19,
      },
    },
  },
  streets: {
    id: 'streets',
    name: 'Peta Jalan',
    badge: 'OpenStreetMap Standar',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    options: {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Dinas PUPR Kab. Nagekeo',
    },
  },
  topo: {
    id: 'topo',
    name: 'Topografi',
    badge: 'Kontur Elevasi & Morfologi Lahan',
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    options: {
      maxZoom: 17,
      attribution: 'Peta: &copy; OpenTopoMap (CC-BY-SA) | Data: OpenStreetMap | Dinas PUPR Kab. Nagekeo',
    },
  },
};

export const InteractiveMap: React.FC<InteractiveMapProps> = ({ data, onSelectDI }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const currentLayersRef = useRef<L.TileLayer[]>([]);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});
  
  const [selectedKecamatan, setSelectedKecamatan] = useState<string>('all');
  const [activeDIId, setActiveDIId] = useState<string | null>(null);
  // Default map mode is satellite-hybrid as requested by user
  const [mapMode, setMapMode] = useState<MapTileMode>('satellite-hybrid');
  const [currentZoom, setCurrentZoom] = useState<number>(11);

  const filteredData = selectedKecamatan === 'all'
    ? data
    : data.filter((d) => d.kecamatan === selectedKecamatan);

  // Function to switch tile layers dynamically
  const applyTileLayer = (map: L.Map, mode: MapTileMode) => {
    // Remove existing tile layers
    currentLayersRef.current.forEach((layer) => {
      try {
        map.removeLayer(layer);
      } catch (e) {
        // ignore
      }
    });
    currentLayersRef.current = [];

    const def = TILE_LAYERS[mode];
    if (!def) return;

    const baseLayer = L.tileLayer(def.url, def.options).addTo(map);
    currentLayersRef.current.push(baseLayer);

    if (def.sublayer) {
      const sub = L.tileLayer(def.sublayer.url, def.sublayer.options).addTo(map);
      currentLayersRef.current.push(sub);
    }
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Center of Kabupaten Nagekeo (Mbay / Aesesa)
      const map = L.map(mapContainerRef.current, {
        center: [-8.67, 121.28],
        zoom: 11,
        zoomControl: false, // Custom placed zoom control
      });

      // Add custom zoom control at top-left
      L.control.zoom({ position: 'topleft' }).addTo(map);

      // Track zoom
      map.on('zoomend', () => {
        setCurrentZoom(map.getZoom());
      });

      // Apply satellite-hybrid by default
      applyTileLayer(map, 'satellite-hybrid');

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        currentLayersRef.current = [];
      }
    };
  }, []);

  // Update Tile Layer when mode changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (map) {
      applyTileLayer(map, mapMode);
    }
  }, [mapMode]);

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
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 32px;
            height: 32px;
          ">
            <div style="
              position: absolute;
              width: 32px;
              height: 32px;
              border-radius: 50%;
              background-color: ${colorHex};
              opacity: 0.35;
              animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
            "></div>
            <div style="
              background: linear-gradient(135deg, ${colorHex}, ${colorHex}dd);
              width: 30px;
              height: 30px;
              border-radius: 50%;
              border: 2.5px solid #ffffff;
              box-shadow: 0 0 0 1.5px rgba(0,0,0,0.5), 0 4px 10px rgba(0,0,0,0.45);
              display: flex;
              align-items: center;
              justify-content: center;
              color: #ffffff;
              font-size: 11px;
              font-weight: 800;
              font-family: monospace;
              letter-spacing: -0.5px;
            ">
              <span>DI</span>
            </div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -18],
      });

      const marker = L.marker(latLng, { icon: customIcon }).addTo(map);

      // Add hovering tooltip for rapid identification on satellite view
      marker.bindTooltip(
        `<div style="font-weight:700; font-size:11px; padding:2px 4px;">${di.nama}</div><div style="font-size:10px; color:#64748b;">${di.kecamatan} · ${di.luasFungsional} Ha</div>`,
        {
          permanent: false,
          direction: 'top',
          offset: [0, -18],
          className: 'satelit-marker-tooltip',
        }
      );

      // Popup Content
      const popupContent = document.createElement('div');
      popupContent.className = 'p-1 font-sans text-xs';
      popupContent.innerHTML = `
        <div style="font-weight: 800; font-size: 13px; color: #0f172a; margin-bottom: 2px;">
          ${di.nama}
        </div>
        <div style="color: #64748b; font-size: 11px; margin-bottom: 6px;">
          ${di.kodeDI} · Kec. ${di.kecamatan}
        </div>
        <div style="border-top: 1px solid #e2e8f0; padding-top: 6px; margin-bottom: 6px; display: grid; grid-template-columns: 1fr 1fr; gap: 4px;">
          <div style="background:#f8fafc; padding:4px 6px; border-radius:4px; border:1px solid #e2e8f0;">
            <span style="color: #64748b; font-size: 10px; display: block;">Luas Fungsional</span>
            <strong style="color: #0f172a; font-family: monospace; font-size:12px;">${di.luasFungsional} Ha</strong>
          </div>
          <div style="background:#f8fafc; padding:4px 6px; border-radius:4px; border:1px solid #e2e8f0;">
            <span style="color: #64748b; font-size: 10px; display: block;">Indeks IKSI</span>
            <strong style="color: ${colorHex}; font-family: monospace; font-size:12px;">${di.nilaiIKSI}% (${di.kategoriIKSI})</strong>
          </div>
        </div>
        <div style="font-size: 11px; color: #334155; margin-bottom: 8px;">
          📍 <strong>${di.bangunanUtama?.nama || di.bangunanUtama?.tipe}</strong> · Sumber: <em>${di.sumberAir}</em>
        </div>
        <button id="btn-detail-${di.id}" style="
          width: 100%;
          padding: 6px 10px;
          background: #0f172a;
          color: white;
          border-radius: 6px;
          border: none;
          cursor: pointer;
          font-weight: 700;
          font-size: 11px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        ">
          Buka Profil Lengkap Irigasi →
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
      map.setView([di.koordinat.lat, di.koordinat.lng], 15, { animate: true });
      marker.openPopup();
    }
  };

  const handleResetView = () => {
    const map = mapInstanceRef.current;
    if (!map) return;
    const bounds = L.latLngBounds([]);
    filteredData.forEach((di) => {
      if (di.koordinat?.lat && di.koordinat?.lng) {
        bounds.extend([di.koordinat.lat, di.koordinat.lng]);
      }
    });
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 13 });
    } else {
      map.setView([-8.67, 121.28], 11);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Map Toolbar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <Satellite className="w-4 h-4 text-emerald-600 animate-pulse" />
            <span>Peta Citra Satelit Geospasial Irigasi & Bendung Kab. Nagekeo</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Visualisasi citra satelit resolusi tinggi koordinat intake, bendung utama, dan sebaran jaringan irigasi di 7 kecamatan.
          </p>
        </div>

        {/* Filter & Controls */}
        <div className="flex flex-wrap items-center gap-2 self-stretch md:self-auto">
          {/* Kecamatan Dropdown */}
          <select
            value={selectedKecamatan}
            onChange={(e) => setSelectedKecamatan(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="all">Semua Kecamatan (7)</option>
            {KECAMATAN_NAGEKEO_LIST.map((kec) => (
              <option key={kec} value={kec}>
                Kec. {kec}
              </option>
            ))}
          </select>

          {/* Reset Zoom Button */}
          <button
            type="button"
            onClick={handleResetView}
            className="px-2.5 py-1.5 text-xs bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-1 shadow-2xs font-medium cursor-pointer transition-colors"
            title="Reset tampilan seluruh Nagekeo"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Reset Posisi</span>
          </button>
        </div>
      </div>

      {/* Main Map + Sidebar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        
        {/* Left Side: DI Fast Selector */}
        <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs flex flex-col h-[600px]">
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 mb-2">
            <span className="text-xs font-bold text-slate-800">Daftar Titik Irigasi</span>
            <span className="text-[11px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 tabular-nums">
              {filteredData.length} Titik
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
            {filteredData.map((di) => (
              <button
                key={di.id}
                type="button"
                onClick={() => handleZoomToDI(di)}
                className={`w-full text-left p-2.5 rounded-lg border text-xs transition-colors flex items-center justify-between cursor-pointer ${
                  activeDIId === di.id
                    ? 'border-emerald-500 bg-emerald-50/60 text-slate-900 shadow-2xs'
                    : 'border-slate-100 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="min-w-0 pr-2">
                  <div className="font-semibold text-slate-900 truncate">{di.nama}</div>
                  <div className="text-[11px] text-slate-500 truncate">
                    Kec. {di.kecamatan} · {di.luasFungsional} Ha
                  </div>
                </div>
                <div className="shrink-0 flex items-center gap-1.5">
                  <span
                    className="w-2.5 h-2.5 rounded-full shadow-2xs"
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
                    title={`Kondisi: ${di.kondisiFisik}`}
                  />
                  <ZoomIn className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </button>
            ))}
          </div>

          {/* Quick Legend at bottom of sidebar */}
          <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-600 space-y-1.5">
            <div className="font-bold text-slate-800 text-xs mb-1 flex items-center gap-1">
              <span>Legenda Kondisi Fisik:</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0 shadow-2xs" />
              <span>Baik (IKSI &ge; 77.5%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0 shadow-2xs" />
              <span>Rusak Ringan (IKSI 70 - 77.4%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0 shadow-2xs" />
              <span>Rusak Sedang (IKSI 55 - 69.9%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0 shadow-2xs" />
              <span>Rusak Berat (IKSI &lt; 55%)</span>
            </div>
          </div>
        </div>

        {/* Right Side: Leaflet Canvas with Satellite Floating Layer Switcher */}
        <div className="lg:col-span-3 bg-slate-900 rounded-xl border border-slate-200 overflow-hidden shadow-xs relative h-[600px]">
          {/* Floating Layer Switcher Pill on Top-Right */}
          <div className="absolute top-3 right-3 z-20 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-700 shadow-xl flex items-center gap-1 text-xs">
            <button
              type="button"
              onClick={() => setMapMode('satellite-hybrid')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium transition-all cursor-pointer ${
                mapMode === 'satellite-hybrid'
                  ? 'bg-emerald-600 text-white shadow-sm font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
              title="Citra Satelit Hybrid dengan Label Jalan & Wilayah"
            >
              <Satellite className="w-3.5 h-3.5" />
              <span>Satelit Hybrid</span>
            </button>

            <button
              type="button"
              onClick={() => setMapMode('esri-satellite')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium transition-all cursor-pointer ${
                mapMode === 'esri-satellite'
                  ? 'bg-emerald-600 text-white shadow-sm font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
              title="Citra Satelit Resolusi Tinggi Esri"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Satelit Esri</span>
            </button>

            <button
              type="button"
              onClick={() => setMapMode('streets')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium transition-all cursor-pointer ${
                mapMode === 'streets'
                  ? 'bg-emerald-600 text-white shadow-sm font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
              title="Peta Jalan OpenStreetMap"
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>Peta Jalan</span>
            </button>

            <button
              type="button"
              onClick={() => setMapMode('topo')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium transition-all cursor-pointer ${
                mapMode === 'topo'
                  ? 'bg-emerald-600 text-white shadow-sm font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
              title="Peta Kontur & Elevasi Topografi"
            >
              <Mountain className="w-3.5 h-3.5" />
              <span>Topografi</span>
            </button>
          </div>

          {/* Leaflet DOM container */}
          <div ref={mapContainerRef} className="w-full h-full z-10" />

          {/* Coordinates & Active Layer HUD overlay bottom-left */}
          <div className="absolute bottom-3 left-3 z-20 flex flex-wrap items-center gap-2 pointer-events-none">
            <div className="bg-slate-900/90 text-white backdrop-blur-md px-3 py-1.5 rounded-lg text-[11px] font-mono border border-slate-700/80 flex items-center gap-2 shadow-lg">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>Kab. Nagekeo (-8.67° S, 121.28° E)</span>
            </div>

            <div className="bg-emerald-950/90 text-emerald-300 backdrop-blur-md px-2.5 py-1.5 rounded-lg text-[10px] font-medium border border-emerald-700/60 flex items-center gap-1.5 shadow-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Mode: {TILE_LAYERS[mapMode].name}</span>
            </div>

            <div className="bg-slate-900/80 text-slate-300 backdrop-blur-md px-2 py-1.5 rounded-lg text-[10px] font-mono border border-slate-700/60 shadow-lg">
              Zoom: {currentZoom}x
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
