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
  
  const [isPrintView, setIsPrintView] = useState(false);
  const [singlePrintDI, setSinglePrintDI] = useState<DaerahIrigasi | null>(null);

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

  const handleSaveDI = (saved: DaerahIrigasi) => {
    let updated: DaerahIrigasi[];
    const exists = data.some((d) => d.id === saved.id);
    if (exists) {
      updated = storageService.updateDI(saved);
    } else {
      updated = storageService.addDI(saved);
    }
    setData(updated);
    if (selectedDI?.id === saved.id) {
      setSelectedDI(saved);
    }
    setIsFormOpen(false);

    // Auto-sync single record to Google Sheet if enabled
    googleSheetService.sendRecordEvent(saved, 'UPSERT');
  };

  const handleDeleteDI = (id: string, nama: string) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus data "${nama}"?`)) {
      const deletedItem = data.find((d) => d.id === id);
      const updated = storageService.deleteDI(id);
      setData(updated);
      if (selectedDI?.id === id) {
        setIsDetailOpen(false);
        setSelectedDI(null);
      }
      if (deletedItem) {
        googleSheetService.sendRecordEvent(deletedItem, 'DELETE');
      }
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
      />

    </div>
  );
}
