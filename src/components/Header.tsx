import React from 'react';
import { 
  Droplets, 
  MapPin, 
  Plus, 
  Download, 
  Printer, 
  Calculator, 
  LayoutDashboard, 
  Database, 
  Map as MapIcon 
} from 'lucide-react';

export type ActiveTab = 'dashboard' | 'database' | 'map' | 'kalkulator-iksi';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenAddModal: () => void;
  onOpenExportModal: () => void;
  onOpenPrintView: () => void;
  totalDI: number;
  totalLuasFungsional: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenAddModal,
  onOpenExportModal,
  onOpenPrintView,
  totalDI,
  totalLuasFungsional,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-slate-900 border-b border-slate-800 text-white shadow-md no-print">
      {/* Top Banner with Nagekeo & PUPR Branding */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand Identity */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Droplets className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold tracking-tight text-white whitespace-nowrap">
                  SI-IRIGASI NAGEKEO
                </span>
                <span className="text-slate-500 hidden sm:inline">|</span>
                <span className="text-xs text-amber-400 font-medium hidden sm:inline uppercase tracking-wider">
                  Dinas PUPR Kab. Nagekeo
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden md:block">
                Sistem Database & e-PAKSI Sumber Daya Air · Flores, NTT
              </p>
            </div>
          </div>

          {/* Quick Metrics Bar in Desktop */}
          <div className="hidden xl:flex items-center gap-6 text-xs text-slate-400 border-x border-slate-800 px-6 py-1">
            <div>
              <span className="text-slate-500">Daerah Irigasi:</span>{' '}
              <strong className="text-white font-mono tabular-nums">{totalDI} DI</strong>
            </div>
            <div className="w-px h-3 bg-slate-800" />
            <div>
              <span className="text-slate-500">Luas Fungsional:</span>{' '}
              <strong className="text-white font-mono tabular-nums">{totalLuasFungsional.toLocaleString('id-ID')} Ha</strong>
            </div>
            <div className="w-px h-3 bg-slate-800" />
            <div className="flex items-center gap-1.5 text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>7 Kecamatan Terdata</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onOpenPrintView}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white rounded-md border border-slate-700 transition-colors"
              title="Cetak Rekapitulasi Laporan Resmi PUPR"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cetak Laporan</span>
            </button>

            <button
              type="button"
              onClick={onOpenExportModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white rounded-md border border-slate-700 transition-colors"
              title="Ekspor CSV / Cadangkan Data JSON"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Data / CSV</span>
            </button>

            <button
              type="button"
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-md transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah DI</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation Navigation */}
      <div className="bg-slate-950 border-t border-slate-800/80 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto no-scrollbar">
          <nav className="flex items-center gap-1 py-1.5">
            <button
              type="button"
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                activeTab === 'dashboard'
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Dashboard & Statistik</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('database')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                activeTab === 'database'
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>Daftar Daerah Irigasi</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('map')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                activeTab === 'map'
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>Peta Spasial GIS Nagekeo</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('kalkulator-iksi')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                activeTab === 'kalkulator-iksi'
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Kalkulator IKSI (Permen PUPR)</span>
            </button>
          </nav>

          <div className="hidden lg:flex items-center text-[11px] text-slate-500 py-1.5">
            <span>Standar Permen PUPR No. 12 & 14/PRT/M/2015</span>
          </div>
        </div>
      </div>
    </header>
  );
};
