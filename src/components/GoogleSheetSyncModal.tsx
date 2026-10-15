import React, { useState, useEffect } from 'react';
import { 
  X, 
  Send, 
  Link, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Copy, 
  Check, 
  Settings, 
  ExternalLink,
  Table,
  Zap
} from 'lucide-react';
import { googleSheetService, DEFAULT_GOOGLE_SHEET_WEBHOOK_URL, SyncResult } from '../services/googleSheetService';
import { DaerahIrigasi } from '../types/irigasi';

interface GoogleSheetSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: DaerahIrigasi[];
  onDataUpdated?: (newData: DaerahIrigasi[]) => void;
}

export const GoogleSheetSyncModal: React.FC<GoogleSheetSyncModalProps> = ({
  isOpen,
  onClose,
  data,
  onDataUpdated,
}) => {
  const [webhookUrl, setWebhookUrl] = useState('');
  const [isEditingUrl, setIsEditingUrl] = useState(false);
  const [autoSync, setAutoSync] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isPulling, setIsPulling] = useState(false);
  const [syncStatus, setSyncStatus] = useState<SyncResult | null>(null);
  const [copiedScript, setCopiedScript] = useState(false);
  const [showScriptTab, setShowScriptTab] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setWebhookUrl(googleSheetService.getWebhookUrl());
      setAutoSync(googleSheetService.getAutoSync());
      setLastSync(googleSheetService.getLastSync());
      setSyncStatus(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveUrl = () => {
    googleSheetService.setWebhookUrl(webhookUrl);
    setIsEditingUrl(false);
    setSyncStatus({
      success: true,
      message: 'URL Webhook Google Sheet berhasil disimpan.',
      timestamp: new Date().toLocaleTimeString('id-ID'),
    });
  };

  const handleResetDefaultUrl = () => {
    setWebhookUrl(DEFAULT_GOOGLE_SHEET_WEBHOOK_URL);
    googleSheetService.setWebhookUrl(DEFAULT_GOOGLE_SHEET_WEBHOOK_URL);
    setIsEditingUrl(false);
  };

  const handleToggleAutoSync = () => {
    const nextVal = !autoSync;
    setAutoSync(nextVal);
    googleSheetService.setAutoSync(nextVal);
  };

  const handleSyncNow = async () => {
    setIsSyncing(true);
    setSyncStatus(null);
    try {
      const result = await googleSheetService.syncAllToGoogleSheet(data);
      setSyncStatus(result);
      if (result.success) {
        setLastSync(result.timestamp);
      }
    } catch (err: any) {
      setSyncStatus({
        success: false,
        message: err.message || 'Gagal menyinkronkan data.',
        timestamp: new Date().toLocaleTimeString('id-ID'),
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const handlePullFromSheet = async () => {
    setIsPulling(true);
    setSyncStatus(null);
    try {
      const result = await googleSheetService.fetchFromGoogleSheet();
      if (result.success && result.data && result.data.length > 0) {
        if (onDataUpdated) {
          onDataUpdated(result.data);
        }
        setSyncStatus({
          success: true,
          message: `Berhasil menarik ${result.data.length} data Daerah Irigasi terbaru dari Google Sheet!`,
          timestamp: new Date().toLocaleTimeString('id-ID'),
        });
      } else {
        setSyncStatus({
          success: false,
          message: result.message,
          timestamp: new Date().toLocaleTimeString('id-ID'),
        });
      }
    } catch (err: any) {
      setSyncStatus({
        success: false,
        message: err.message || 'Gagal menarik data dari Google Sheet.',
        timestamp: new Date().toLocaleTimeString('id-ID'),
      });
    } finally {
      setIsPulling(false);
    }
  };

  const handleCopyScript = () => {
    const script = googleSheetService.getGoogleAppsScriptTemplate();
    navigator.clipboard.writeText(script);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 no-print">
      <div className="bg-white w-full max-w-2xl rounded-2xl border border-slate-200 shadow-xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Table className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold flex items-center gap-2">
                <span>Integrasi Google Sheets & Webhook Dua Arah</span>
                <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Tertanam Langsung
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Sinkronisasi otomatis saat Simpan, Edit, dan Hapus data Daerah Irigasi Nagekeo
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          
          {/* Realtime Action Guide Badge */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-950 space-y-1.5">
            <div className="font-bold flex items-center gap-1.5 text-amber-900">
              <Zap className="w-4 h-4 text-amber-600" />
              <span>Sinkronisasi Otomatis Dua Arah Telah Aktif Secara Default:</span>
            </div>
            <ul className="list-disc pl-5 space-y-1 text-amber-900/90 text-[11px] leading-relaxed">
              <li><strong>Tambah Data:</strong> Saat menekan tombol <em>Simpan</em>, data langsung masuk dan muncul di baris Google Sheet baru tanpa perlu tombol kirim.</li>
              <li><strong>Edit Data:</strong> Saat mengedit dan menyimpan, baris dengan Kode DI tersebut otomatis diperbarui di Google Sheet.</li>
              <li><strong>Hapus Data:</strong> Saat tombol hapus ditekan di web, baris data tersebut otomatis terhapus dari Google Sheet.</li>
              <li><strong>Tarik Data (Sheet &rarr; Web):</strong> Ambil pembaruan bila ada tim dinas yang mengedit langsung di spreadsheet.</li>
            </ul>
          </div>

          {/* Status Alert if any */}
          {syncStatus && (
            <div className={`p-3.5 rounded-xl text-xs flex items-start gap-2.5 ${
              syncStatus.success
                ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                : 'bg-rose-50 text-rose-900 border border-rose-200'
            }`}>
              {syncStatus.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <div className="font-semibold">{syncStatus.message}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Waktu: {syncStatus.timestamp}</div>
              </div>
            </div>
          )}

          {/* Two-Way Actions Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Kirim Semua ke Sheet */}
            <div className="border border-slate-200 rounded-xl p-4 bg-white flex flex-col justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Send className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Kirim Semua Data ke Sheet</span>
                </span>
                <p className="text-[11px] text-slate-500 mt-1">
                  Sinkronkan seluruh {data.length} DI sekaligus ke Google Sheet dinas.
                </p>
              </div>
              <button
                type="button"
                onClick={handleSyncNow}
                disabled={isSyncing}
                className="w-full px-3 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs disabled:opacity-50"
              >
                {isSyncing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Mengirim...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Kirim {data.length} Data (Web &rarr; Sheet)</span>
                  </>
                )}
              </button>
            </div>

            {/* Tarik Pembaruan dari Sheet */}
            <div className="border border-slate-200 rounded-xl p-4 bg-white flex flex-col justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5 text-blue-600" />
                  <span>Tarik Pembaruan dari Sheet</span>
                </span>
                <p className="text-[11px] text-slate-500 mt-1">
                  Ambil data terbaru dari Google Sheet jika ada pengeditan langsung di spreadsheet.
                </p>
              </div>
              <button
                type="button"
                onClick={handlePullFromSheet}
                disabled={isPulling}
                className="w-full px-3 py-2 text-xs font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs disabled:opacity-50"
              >
                {isPulling ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Menarik...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 text-slate-600" />
                    <span>Tarik Data (Sheet &rarr; Web)</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Auto Sync Toggle */}
          <div className="border border-slate-200 rounded-xl p-4 flex items-center justify-between gap-4 bg-white">
            <div>
              <span className="text-xs font-bold text-slate-800 block">
                Sinkronisasi Otomatis (*Auto-Sync Realtime*)
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Setiap kali data Daerah Irigasi ditambahkan atau diubah, sistem akan otomatis mengirim pembaruan ke Google Sheet.
              </p>
            </div>

            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={autoSync}
                onChange={handleToggleAutoSync}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          {/* Apps Script Guide Accordion */}
          <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
            <button
              type="button"
              onClick={() => setShowScriptTab(!showScriptTab)}
              className="w-full p-4 text-left flex items-center justify-between text-xs font-bold text-slate-800 hover:bg-slate-50 transition-colors"
            >
              <span>Kode Google Apps Script Siap Tempel (1-Menit Setup)</span>
              <span className="text-amber-700 font-semibold">{showScriptTab ? 'Sembunyikan' : 'Buka Kode'}</span>
            </button>

            {showScriptTab && (
              <div className="p-4 pt-0 border-t border-slate-100 space-y-3">
                <p className="text-xs text-slate-600 leading-relaxed">
                  Buka Google Sheets baru, klik <strong>Ekstensi &gt; Apps Script</strong>, lalu salin dan tempel kode berikut:
                </p>

                <div className="relative">
                  <pre className="p-3 bg-slate-900 text-slate-200 rounded-lg text-[10px] font-mono overflow-x-auto max-h-48 leading-relaxed">
                    {googleSheetService.getGoogleAppsScriptTemplate()}
                  </pre>
                  <button
                    type="button"
                    onClick={handleCopyScript}
                    className="absolute top-2 right-2 px-2.5 py-1 text-[11px] font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-md transition-colors flex items-center gap-1 shadow-sm"
                  >
                    {copiedScript ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedScript ? 'Tersalin!' : 'Salin Kode'}</span>
                  </button>
                </div>
              </div>
            )}
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
