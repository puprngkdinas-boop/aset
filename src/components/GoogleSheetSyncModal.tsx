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
  const [sheetUrl, setSheetUrl] = useState('');
  const [isEditingSheetUrl, setIsEditingSheetUrl] = useState(false);
  const [copiedSheetUrl, setCopiedSheetUrl] = useState(false);
  const [copiedWebhookUrl, setCopiedWebhookUrl] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [isEditingUrl, setIsEditingUrl] = useState(false);
  const [autoSync, setAutoSync] = useState(true);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [isPulling, setIsPulling] = useState(false);
  const [syncStatus, setSyncStatus] = useState<SyncResult | null>(null);
  const [copiedScript, setCopiedScript] = useState(false);
  const [showScriptTab, setShowScriptTab] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setWebhookUrl(googleSheetService.getWebhookUrl());
      setSheetUrl(googleSheetService.getSheetUrl());
      setAutoSync(googleSheetService.getAutoSync());
      setLastSync(googleSheetService.getLastSync());
      setSyncStatus(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveWebhookUrl = () => {
    googleSheetService.setWebhookUrl(webhookUrl);
    setIsEditingUrl(false);
    setSyncStatus({
      success: true,
      message: 'URL Webhook Google Apps Script berhasil diperbarui dan disimpan.',
      timestamp: new Date().toLocaleTimeString('id-ID'),
    });
  };

  const handleResetDefaultWebhook = () => {
    setWebhookUrl(DEFAULT_GOOGLE_SHEET_WEBHOOK_URL);
    googleSheetService.setWebhookUrl(DEFAULT_GOOGLE_SHEET_WEBHOOK_URL);
    setIsEditingUrl(false);
    setSyncStatus({
      success: true,
      message: 'URL Webhook dikembalikan ke pengaturan default dinas.',
      timestamp: new Date().toLocaleTimeString('id-ID'),
    });
  };

  const handleSaveSheetUrl = () => {
    googleSheetService.setSheetUrl(sheetUrl);
    setIsEditingSheetUrl(false);
    setSyncStatus({
      success: true,
      message: 'Link Google Sheet Spreadsheet berhasil diperbarui.',
      timestamp: new Date().toLocaleTimeString('id-ID'),
    });
  };

  const handleCopySheetUrl = () => {
    navigator.clipboard.writeText(sheetUrl);
    setCopiedSheetUrl(true);
    setTimeout(() => setCopiedSheetUrl(false), 2000);
  };

  const handleCopyWebhookUrl = () => {
    navigator.clipboard.writeText(webhookUrl);
    setCopiedWebhookUrl(true);
    setTimeout(() => setCopiedWebhookUrl(false), 2000);
  };

  const handleToggleAutoSync = () => {
    const nextVal = !autoSync;
    setAutoSync(nextVal);
    googleSheetService.setAutoSync(nextVal);
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
                <span>Integrasi Google Sheet & Webhook Dua Arah</span>
                <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Tertanam Langsung
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Pembaruan otomatis saat Simpan, Edit, dan Hapus data Daerah Irigasi Nagekeo
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
          
          {/* Realtime Action Guide Badge: Tombol Simpan langsung ke sheet */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 text-xs text-emerald-950 space-y-1.5">
            <div className="font-bold flex items-center gap-1.5 text-emerald-900">
              <Zap className="w-4 h-4 text-emerald-600" />
              <span>Sinkronisasi Otomatis Dua Arah Langsung Aktif (Tanpa Tombol Kirim Manual):</span>
            </div>
            <ul className="list-disc pl-5 space-y-1 text-emerald-900/90 text-[11px] leading-relaxed">
              <li><strong>Tombol Simpan (Tambah DI):</strong> Saat ditekan langsung otomatis menyimpan dan memunculkan baris baru di Google Sheet.</li>
              <li><strong>Tombol Edit (Perubahan DI):</strong> Saat disimpan langsung memperbarui data baris yang bersangkutan di Google Sheet.</li>
              <li><strong>Tombol Hapus (Hapus DI):</strong> Saat ditekan langsung menghapus baris data tersebut dari Google Sheet secara dua arah.</li>
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

          {/* Section 1: URL Link Google Sheet (Spreadsheet) */}
          <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Table className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold text-slate-900">URL Link Google Sheet (Spreadsheet)</span>
              </div>
              <a
                href={sheetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-xs"
              >
                <span>Buka Google Sheet</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={sheetUrl}
                  onChange={(e) => setSheetUrl(e.target.value)}
                  readOnly={!isEditingSheetUrl}
                  placeholder="https://docs.google.com/spreadsheets/d/..."
                  className={`w-full text-xs font-mono px-3 py-2 rounded-lg border transition-colors ${
                    isEditingSheetUrl
                      ? 'bg-white border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500'
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                />
              </div>

              {isEditingSheetUrl ? (
                <button
                  type="button"
                  onClick={handleSaveSheetUrl}
                  className="px-3 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shrink-0"
                >
                  Simpan
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditingSheetUrl(true)}
                  className="px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 transition-colors shrink-0"
                >
                  Ubah Link
                </button>
              )}

              <button
                type="button"
                onClick={handleCopySheetUrl}
                className="p-2 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 transition-colors shrink-0"
                title="Salin Link Google Sheet"
              >
                {copiedSheetUrl ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-500">
              Link spreadsheet utama Daerah Irigasi Nagekeo. Klik tombol <strong>Buka Google Sheet</strong> untuk melihat langsung data di tab baru.
            </p>
          </div>

          {/* Section 2: URL Webhook (Google Apps Script) */}
          <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Link className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-bold text-slate-900">URL Webhook (Google Apps Script Tertanam)</span>
              </div>
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Webhook Aktif
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  readOnly={!isEditingUrl}
                  placeholder="https://script.google.com/macros/s/.../exec"
                  className={`w-full text-xs font-mono px-3 py-2 rounded-lg border transition-colors ${
                    isEditingUrl
                      ? 'bg-white border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                />
              </div>

              {isEditingUrl ? (
                <button
                  type="button"
                  onClick={handleSaveWebhookUrl}
                  className="px-3 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shrink-0"
                >
                  Simpan
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditingUrl(true)}
                  className="px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 transition-colors shrink-0"
                >
                  Ubah Webhook
                </button>
              )}

              <button
                type="button"
                onClick={handleCopyWebhookUrl}
                className="p-2 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 transition-colors shrink-0"
                title="Salin URL Webhook"
              >
                {copiedWebhookUrl ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span>Webhook ini menangani aksi CREATE, UPDATE, dan DELETE dua arah secara realtime.</span>
              <button
                type="button"
                onClick={handleResetDefaultWebhook}
                className="text-blue-600 hover:text-blue-800 font-medium shrink-0 ml-2"
              >
                Reset Default
              </button>
            </div>
          </div>

          {/* Section 3: Tarik Pembaruan dari Sheet (Sheet -> Web Dua Arah) */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5 text-blue-600" />
                <span>Tarik Data Terbaru dari Google Sheet (Sheet &rarr; Web)</span>
              </span>
              <p className="text-[11px] text-slate-500 mt-1">
                Gunakan jika tim PUPR melakukan revisi atau penambahan kolom langsung di Google Spreadsheet.
              </p>
            </div>
            <button
              type="button"
              onClick={handlePullFromSheet}
              disabled={isPulling}
              className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-slate-800 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs disabled:opacity-50 shrink-0"
            >
              {isPulling ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-600" />
                  <span>Menarik Data...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-3.5 h-3.5 text-blue-600" />
                  <span>Tarik Data Sekarang</span>
                </>
              )}
            </button>
          </div>

          {/* Auto Sync Toggle */}
          <div className="border border-slate-200 rounded-xl p-4 flex items-center justify-between gap-4 bg-white">
            <div>
              <span className="text-xs font-bold text-slate-800 block">
                Sinkronisasi Otomatis (Auto-Sync Realtime Aktif)
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Setiap kali data Daerah Irigasi ditambah, diedit, atau dihapus, sistem langsung mengirim perubahan dua arah ke Google Sheet tanpa perlu kirim manual.
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
