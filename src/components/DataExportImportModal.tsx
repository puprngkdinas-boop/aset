import React, { useRef, useState } from 'react';
import { X, Download, Upload, RefreshCw, FileSpreadsheet, Database, AlertCircle, CheckCircle2 } from 'lucide-react';
import { storageService } from '../services/storageService';
import { DaerahIrigasi } from '../types/irigasi';

interface DataExportImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataUpdated: (newData: DaerahIrigasi[]) => void;
}

export const DataExportImportModal: React.FC<DataExportImportModalProps> = ({
  isOpen,
  onClose,
  onDataUpdated,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  if (!isOpen) return null;

  const handleExportCSV = () => {
    storageService.exportToCSV();
    setStatusMessage({ text: 'File CSV berhasil diunduh.', type: 'success' });
  };

  const handleExportJSON = () => {
    storageService.exportToJSON();
    setStatusMessage({ text: 'Cadangan database JSON berhasil diunduh.', type: 'success' });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const updated = storageService.importFromJSON(content);
        onDataUpdated(updated);
        setStatusMessage({ text: `Berhasil memulihkan ${updated.length} data Daerah Irigasi.`, type: 'success' });
      } catch (err: any) {
        setStatusMessage({ text: err.message || 'Gagal memproses file cadangan.', type: 'error' });
      }
    };
    reader.readAsText(file);
  };

  const handleResetToDefault = () => {
    if (window.confirm('Apakah Anda yakin ingin mengembalikan seluruh data ke data standar awal Kabupaten Nagekeo?')) {
      const resetData = storageService.resetToDefault();
      onDataUpdated(resetData);
      setStatusMessage({ text: 'Database berhasil dikembalikan ke data awal standar Nagekeo.', type: 'success' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 no-print">
      <div className="bg-white w-full max-w-lg rounded-2xl border border-slate-200 shadow-xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Database className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold">Pengelolaan Data & Cadangan</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          
          {statusMessage && (
            <div className={`p-3 rounded-lg text-xs flex items-center gap-2 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}>
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

          {/* Export to CSV */}
          <div className="border border-slate-200 rounded-xl p-4 hover:border-slate-300 transition-colors">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  <span>Ekspor ke Excel / CSV</span>
                </h3>
                <p className="text-[11px] text-slate-500 mt-1">
                  Format tabel lengkap kompatibel dengan Microsoft Excel dan Google Sheets.
                </p>
              </div>
              <button
                type="button"
                onClick={handleExportCSV}
                className="px-3 py-1.5 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors shrink-0"
              >
                Unduh CSV
              </button>
            </div>
          </div>

          {/* Export to JSON */}
          <div className="border border-slate-200 rounded-xl p-4 hover:border-slate-300 transition-colors">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Download className="w-4 h-4 text-blue-600" />
                  <span>Cadangkan Database (JSON)</span>
                </h3>
                <p className="text-[11px] text-slate-500 mt-1">
                  Menyimpan salinan utuh seluruh data Daerah Irigasi untuk arsip komputer dinas.
                </p>
              </div>
              <button
                type="button"
                onClick={handleExportJSON}
                className="px-3 py-1.5 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors shrink-0"
              >
                Cadangkan
              </button>
            </div>
          </div>

          {/* Import JSON */}
          <div className="border border-slate-200 rounded-xl p-4 hover:border-slate-300 transition-colors">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Upload className="w-4 h-4 text-purple-600" />
                  <span>Pulihkan Data dari File JSON</span>
                </h3>
                <p className="text-[11px] text-slate-500 mt-1">
                  Unggah file cadangan sebelumnya untuk memperbarui atau memulihkan data.
                </p>
              </div>
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".json"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors shrink-0"
                >
                  Pilih File
                </button>
              </div>
            </div>
          </div>

          {/* Reset to Default */}
          <div className="border border-rose-100 bg-rose-50/40 rounded-xl p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-xs font-bold text-rose-950 flex items-center gap-1.5">
                  <RefreshCw className="w-4 h-4 text-rose-600" />
                  <span>Reset ke Data Awal Nagekeo</span>
                </h3>
                <p className="text-[11px] text-rose-800/80 mt-1">
                  Mengembalikan data ke 12 Daerah Irigasi default (Mbay Kanan/Kiri, Malawaru, Wulu, Rendu, dll).
                </p>
              </div>
              <button
                type="button"
                onClick={handleResetToDefault}
                className="px-3 py-1.5 text-xs font-semibold text-rose-700 bg-white border border-rose-200 hover:bg-rose-50 rounded-lg transition-colors shrink-0"
              >
                Reset Data
              </button>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 px-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
