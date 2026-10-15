import React, { useState, useEffect } from 'react';
import { DaerahIrigasi } from './types/irigasi';
import { storageService } from './services/storageService';
import { Header, ActiveTab } from './components/Header';
import { DashboardOverview } from './components/DashboardOverview';
import { IrrigationList } from './components/IrrigationList';
import { InteractiveMap } from './components/InteractiveMap';
import { IrrigationDetailModal } from './components/IrrigationDetailModal';
import { IrrigationFormModal } from './components/IrrigationFormModal';
import { IksiCalculatorModal } from './components/IksiCalculatorModal';
import { DataExportImportModal } from './components/DataExportImportModal';
import { GoogleSheetSyncModal } from './components/GoogleSheetSyncModal';
import { PrintReportView } from './components/PrintReportView';
import { ToastContainer, ToastMessage } from './components/Toast';
import { googleSheetService } from './services/googleSheetService';

export default function App() {
  const [data, setData] = useState<DaerahIrigasi[]>([]);
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  
  // Modals state
  const [selectedDI, setSelectedDI] = useState<DaerahIrigasi | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  
  const [editingDI, setEditingDI] = useState<DaerahIrigasi | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isGoogleSheetOpen, setIsGoogleSheetOpen] = useState(false);
  const [isSyncingSheet, setIsSyncingSheet] = useState(false);
  
  const [isPrintView, setIsPrintView] = useState(false);
  const [singlePrintDI, setSinglePrintDI] = useState<DaerahIrigasi | null>(null);

  // Toast notifications state
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (
    message: string,
    type: 'success' | 'warning' | 'info' | 'error' = 'success',
    duration = 5000
  ) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type, duration }]);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Load initial data
  useEffect(() => {
    const loaded = storageService.getData();
    setData(loaded);
  }, []);

  // Compute top bar quick stats
  const totalDI = data.length;
  const totalLuasFungsional = data.reduce((acc, curr) => acc + (curr.luasFungsional || 0), 0);

  // Handlers
  const handleOpenAddModal = () => {
    setEditingDI(null);
    setIsFormOpen(true);
  };

  const handleEditDI = (di: DaerahIrigasi) => {
    setEditingDI(di);
    setIsFormOpen(true);
  };

  // Realtime two-way save: immediately stores locally AND posts to Google Sheet webhook
  const handleSaveDI = async (saved: DaerahIrigasi) => {
    const isEdit = data.some((d) => d.id === saved.id);
    let updated: DaerahIrigasi[];
    if (isEdit) {
      updated = storageService.updateDI(saved);
    } else {
      updated = storageService.addDI(saved);
    }
    setData(updated);
    if (selectedDI?.id === saved.id) {
      setSelectedDI(saved);
    }
    setIsFormOpen(false);

    // Instant Google Sheet Sync via embedded Webhook
    const actionType = isEdit ? 'UPDATE' : 'CREATE';
    showToast(
      isEdit
        ? `Memperbarui "${saved.nama}" dan mengirim perubahan langsung ke Google Sheet...`
        : `Menyimpan "${saved.nama}" dan memasukkan baris baru langsung ke Google Sheet...`,
      'info',
      2500
    );

    try {
      const res = await googleSheetService.sendRecordEvent(saved, actionType);
      if (res.success) {
        showToast(
          isEdit
            ? `✓ Perubahan "${saved.nama}" (${saved.kodeDI}) tersimpan di Web & diperbarui di Google Sheet!`
            : `✓ Data "${saved.nama}" (${saved.kodeDI}) berhasil disimpan & langsung muncul di Google Sheet!`,
          'success',
          5000
        );
      } else {
        showToast(`Tersimpan di web lokal. Catatan Google Sheet: ${res.message}`, 'warning', 6000);
      }
    } catch (err: any) {
      showToast(`Tersimpan di web lokal. Google Sheet: ${err.message}`, 'warning', 6000);
    }
  };

  // Realtime two-way delete: deletes locally AND deletes the exact row in Google Sheet
  const handleDeleteDI = async (id: string, nama: string) => {
    const targetDI = data.find((d) => d.id === id);
    const kode = targetDI?.kodeDI || '';

    if (
      window.confirm(
        `Hapus Daerah Irigasi "${nama}" (${kode})?\n\nData akan dihapus dari web dan baris di Google Sheet akan otomatis dihapus secara realtime dua arah.`
      )
    ) {
      const updated = storageService.deleteDI(id);
      setData(updated);
      if (selectedDI?.id === id) {
        setIsDetailOpen(false);
        setSelectedDI(null);
      }

      if (targetDI) {
        showToast(`Menghapus "${nama}" dari sistem dan Google Sheet...`, 'info', 2500);
        try {
          const res = await googleSheetService.sendRecordEvent(targetDI, 'DELETE');
          if (res.success) {
            showToast(`✓ Data "${nama}" (${kode}) berhasil dihapus dari Web & Google Sheet!`, 'success', 5000);
          } else {
            showToast(`Dihapus dari web. Catatan Google Sheet: ${res.message}`, 'warning', 5000);
          }
        } catch (err: any) {
          showToast(`Dihapus dari web. Google Sheet: ${err.message}`, 'warning', 5000);
        }
      }
    }
  };

  // Two-way sync: Pull updates from Google Sheet into Web
  const handleFetchFromGoogleSheet = async () => {
    setIsSyncingSheet(true);
    showToast('Menghubungkan ke Google Sheet dan menarik data terbaru...', 'info', 3000);
    try {
      const res = await googleSheetService.fetchFromGoogleSheet();
      if (res.success && res.data && res.data.length > 0) {
        storageService.saveData(res.data);
        setData(res.data);
        showToast(`✓ Berhasil menarik ${res.data.length} data Daerah Irigasi terbaru dari Google Sheet!`, 'success', 5000);
      } else {
        showToast(res.message, 'warning', 6000);
      }
    } catch (err: any) {
      showToast(`Gagal menarik data dari Google Sheet: ${err.message}`, 'error', 6000);
    } finally {
      setIsSyncingSheet(false);
    }
  };

  const handleSelectDI = (di: DaerahIrigasi) => {
    setSelectedDI(di);
    setIsDetailOpen(true);
  };

  const handlePrintSingle = (di: DaerahIrigasi) => {
    setSinglePrintDI(di);
    setIsPrintView(true);
    setIsDetailOpen(false);
  };

  const handlePrintAll = () => {
    setSinglePrintDI(null);
    setIsPrintView(true);
  };

  if (isPrintView) {
    return (
      <PrintReportView
        data={data}
        singleDI={singlePrintDI}
        onBack={() => {
          setIsPrintView(false);
          setSinglePrintDI(null);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
      
      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === 'kalkulator-iksi') {
            setIsCalculatorOpen(true);
          } else {
            setActiveTab(tab);
          }
        }}
        onOpenAddModal={handleOpenAddModal}
        onOpenExportModal={() => setIsExportOpen(true)}
        onOpenGoogleSheetModal={() => setIsGoogleSheetOpen(true)}
        onOpenPrintView={handlePrintAll}
        totalDI={totalDI}
        totalLuasFungsional={totalLuasFungsional}
      />

      {/* Main Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <DashboardOverview
            data={data}
            onSelectDI={handleSelectDI}
            onOpenAddModal={handleOpenAddModal}
            onViewAllTable={() => setActiveTab('database')}
            onViewMap={() => setActiveTab('map')}
          />
        )}

        {activeTab === 'database' && (
          <IrrigationList
            data={data}
            onSelectDI={handleSelectDI}
            onEditDI={handleEditDI}
            onDeleteDI={handleDeleteDI}
            onOpenAddModal={handleOpenAddModal}
            onFetchFromGoogleSheet={handleFetchFromGoogleSheet}
            isSyncingSheet={isSyncingSheet}
          />
        )}

        {activeTab === 'map' && (
          <InteractiveMap
            data={data}
            onSelectDI={handleSelectDI}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-6 px-4 sm:px-6 lg:px-8 text-xs no-print mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-200">
              Dinas Pekerjaan Umum dan Penataan Ruang (PUPR) Kabupaten Nagekeo
            </span>
            <span>·</span>
            <span>Bidang Sumber Daya Air</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>Civic Center Mbay - Flores, NTT</span>
            <span>·</span>
            <span>Permen PUPR No. 12 & 14/PRT/M/2015</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <IrrigationDetailModal
        di={selectedDI}
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedDI(null);
        }}
        onEdit={(di) => {
          setIsDetailOpen(false);
          handleEditDI(di);
        }}
        onPrintSingle={handlePrintSingle}
        onDelete={handleDeleteDI}
      />

      <IrrigationFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingDI(null);
        }}
        onSave={handleSaveDI}
        initialData={editingDI}
      />

      <IksiCalculatorModal
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
      />

      <DataExportImportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        onDataUpdated={(newData) => setData(newData)}
      />

      <GoogleSheetSyncModal
        isOpen={isGoogleSheetOpen}
        onClose={() => setIsGoogleSheetOpen(false)}
        data={data}
        onDataUpdated={(newData) => setData(newData)}
      />

      {/* Realtime Toast Notifications for Two-Way Google Sheet Sync and Actions */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

    </div>
  );
}
