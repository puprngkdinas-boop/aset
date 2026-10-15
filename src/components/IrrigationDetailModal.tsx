import React, { useState } from 'react';
import { DaerahIrigasi } from '../types/irigasi';
import { 
  X, 
  MapPin, 
  Droplet, 
  Layers, 
  Users, 
  FileText, 
  Sparkles, 
  Printer, 
  Edit3, 
  CheckCircle2, 
  AlertTriangle,
  Calendar,
  Building,
  Activity
} from 'lucide-react';
import { analisaKondisiIrigasiDenganAI, AnalisisHasil } from '../services/geminiService';

interface IrrigationDetailModalProps {
  di: DaerahIrigasi | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (di: DaerahIrigasi) => void;
  onPrintSingle: (di: DaerahIrigasi) => void;
}

type DetailTab = 'ringkasan' | 'saluran' | 'epaksi' | 'p3a' | 'usulan' | 'analisis-ai';

export const IrrigationDetailModal: React.FC<IrrigationDetailModalProps> = ({
  di,
  isOpen,
  onClose,
  onEdit,
  onPrintSingle,
}) => {
  const [activeTab, setActiveTab] = useState<DetailTab>('ringkasan');
  const [aiAnalysis, setAiAnalysis] = useState<AnalisisHasil | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  if (!isOpen || !di) return null;

  const handleRunAiAnalysis = async () => {
    setIsLoadingAi(true);
    try {
      const res = await analisaKondisiIrigasiDenganAI(di);
      setAiAnalysis(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingAi(false);
    }
  };

  const getKondisiColorClass = (kondisi: string) => {
    switch (kondisi) {
      case 'Baik':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'Rusak Ringan':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'Rusak Sedang':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      default:
        return 'text-rose-700 bg-rose-50 border-rose-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 no-print">
      <div className="bg-white w-full max-w-4xl rounded-2xl border border-slate-200 shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-5 border-b border-slate-800 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-amber-400 font-mono">
              <span>{di.kodeDI}</span>
              <span>·</span>
              <span>Kewenangan: {di.kewenangan}</span>
              <span>·</span>
              <span>Kec. {di.kecamatan}</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white mt-1">
              {di.nama}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Desa {di.desa} · Sumber Air: {di.sumberAir}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => onPrintSingle(di)}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              title="Cetak Lembar Profil Resmi"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onEdit(di)}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              title="Ubah Data DI"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              title="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Header */}
        <div className="bg-slate-100 border-b border-slate-200 px-5 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab('ringkasan')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'ringkasan'
                ? 'border-amber-500 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Ringkasan Teknis
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('saluran')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'saluran'
                ? 'border-amber-500 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Bangunan & Saluran
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('epaksi')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'epaksi'
                ? 'border-amber-500 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Penilaian IKSI (e-PAKSI)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('p3a')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'p3a'
                ? 'border-amber-500 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Kelembagaan P3A
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('usulan')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'usulan'
                ? 'border-amber-500 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Rencana Penanganan
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('analisis-ai');
              if (!aiAnalysis) handleRunAiAnalysis();
            }}
            className={`py-3 px-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'analisis-ai'
                ? 'border-amber-500 text-amber-900'
                : 'border-transparent text-amber-700 hover:text-amber-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Asisten Analisis PUPR</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* TAB 1: RINGKASAN */}
          {activeTab === 'ringkasan' && (
            <div className="space-y-6">
              
              {/* Top Highlights Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <span className="text-[11px] text-slate-500">Kondisi Fisik</span>
                  <div className={`text-sm font-bold mt-1 ${
                    di.kondisiFisik === 'Baik' ? 'text-emerald-700' :
                    di.kondisiFisik === 'Rusak Ringan' ? 'text-blue-700' :
                    di.kondisiFisik === 'Rusak Sedang' ? 'text-amber-700' :
                    'text-rose-700'
                  }`}>
                    {di.kondisiFisik}
                  </div>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <span className="text-[11px] text-slate-500">Nilai IKSI (e-PAKSI)</span>
                  <div className="text-sm font-mono font-bold text-slate-900 mt-1 tabular-nums">
                    {di.nilaiIKSI.toFixed(2)}% ({di.kategoriIKSI})
                  </div>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <span className="text-[11px] text-slate-500">Luas Fungsional</span>
                  <div className="text-sm font-mono font-bold text-slate-900 mt-1 tabular-nums">
                    {di.luasFungsional} Ha
                  </div>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <span className="text-[11px] text-slate-500">Luas Baku / Potensial</span>
                  <div className="text-sm font-mono font-bold text-slate-900 mt-1 tabular-nums">
                    {di.luasBaku} Ha / {di.luasPotensial} Ha
                  </div>
                </div>
              </div>

              {/* Data Specifications Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <div className="border border-slate-200 rounded-xl p-4 space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5 border-b border-slate-100 pb-2">
                    <MapPin className="w-3.5 h-3.5 text-amber-600" />
                    <span>Administrasi & Geospasial</span>
                  </h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-500">Kabupaten:</span>
                      <strong className="text-slate-800">Nagekeo, NTT</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-500">Kecamatan:</span>
                      <strong className="text-slate-800">Kec. {di.kecamatan}</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-500">Desa Terlayani:</span>
                      <strong className="text-slate-800">{di.desa}</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-500">Koordinat GPS:</span>
                      <strong className="font-mono text-slate-800 tabular-nums">
                        {di.koordinat?.lat}, {di.koordinat?.lng}
                      </strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-500">Tahun Pembangunan:</span>
                      <strong className="font-mono text-slate-800">{di.tahunPembangunan || '-'}</strong>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">Tahun Rehab Terakhir:</span>
                      <strong className="font-mono text-slate-800">{di.tahunRehabTerakhir || 'Belum pernah'}</strong>
                    </div>
                  </div>
                </div>

                <div className="border border-slate-200 rounded-xl p-4 space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5 border-b border-slate-100 pb-2">
                    <Building className="w-3.5 h-3.5 text-amber-600" />
                    <span>Bangunan Utama & Hidrolika</span>
                  </h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-500">Tipe Bangunan:</span>
                      <strong className="text-slate-800">{di.bangunanUtama?.tipe}</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-500">Nama Bendung / Intake:</span>
                      <strong className="text-slate-800">{di.bangunanUtama?.nama}</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-500">Sumber Air:</span>
                      <strong className="text-slate-800">{di.sumberAir}</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-500">Lebar & Tinggi Mercu:</span>
                      <strong className="font-mono text-slate-800 tabular-nums">
                        L: {di.bangunanUtama?.lebarBendungM} m · H: {di.bangunanUtama?.tinggiMercuM} m
                      </strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-500">Debit Rata-rata:</span>
                      <strong className="font-mono text-slate-800 tabular-nums">
                        {di.bangunanUtama?.debitRataRataM3s} m³/detik
                      </strong>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">Kantong Lumpur:</span>
                      <strong className="text-slate-800">
                        {di.bangunanUtama?.kantongLumpur ? 'Tersedia' : 'Tidak Ada'}
                      </strong>
                    </div>
                  </div>
                </div>

              </div>

              {/* Catatan O&P */}
              {di.catatanOp && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs">
                  <span className="font-bold text-slate-800 block mb-1">Catatan Operasi & Pemeliharaan:</span>
                  <p className="text-slate-600 leading-relaxed">{di.catatanOp}</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: SALURAN & BANGUNAN */}
          {activeTab === 'saluran' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
                  <div className="text-[11px] font-semibold text-slate-500">Saluran Primer</div>
                  <div className="text-lg font-mono font-bold text-slate-900 mt-1 tabular-nums">
                    {(di.jaringanSaluran?.panjangPrimerM || 0).toLocaleString('id-ID')} m
                  </div>
                  <div className="text-xs mt-1 text-slate-600">
                    Kondisi: <strong className="font-semibold">{di.jaringanSaluran?.kondisiPrimer}</strong>
                  </div>
                </div>

                <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
                  <div className="text-[11px] font-semibold text-slate-500">Saluran Sekunder</div>
                  <div className="text-lg font-mono font-bold text-slate-900 mt-1 tabular-nums">
                    {(di.jaringanSaluran?.panjangSekunderM || 0).toLocaleString('id-ID')} m
                  </div>
                  <div className="text-xs mt-1 text-slate-600">
                    Kondisi: <strong className="font-semibold">{di.jaringanSaluran?.kondisiSekunder}</strong>
                  </div>
                </div>

                <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
                  <div className="text-[11px] font-semibold text-slate-500">Saluran Tersier</div>
                  <div className="text-lg font-mono font-bold text-slate-900 mt-1 tabular-nums">
                    {(di.jaringanSaluran?.panjangTersierM || 0).toLocaleString('id-ID')} m
                  </div>
                  <div className="text-xs mt-1 text-slate-600">
                    Kondisi: <strong className="font-semibold">{di.jaringanSaluran?.kondisiTersier}</strong>
                  </div>
                </div>
              </div>

              {/* Rincian Bangunan Air */}
              <div className="border border-slate-200 rounded-xl p-5 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Inventarisasi Bangunan Pembawa & Pengatur Air
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-slate-500 block">Bangunan Bagi</span>
                    <strong className="text-base font-mono tabular-nums text-slate-900">
                      {di.jaringanSaluran?.jumlahBangunanBagi || 0} Unit
                    </strong>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-slate-500 block">Bangunan Sadap</span>
                    <strong className="text-base font-mono tabular-nums text-slate-900">
                      {di.jaringanSaluran?.jumlahBangunanSadap || 0} Unit
                    </strong>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-slate-500 block">Bangunan Bagi Sadap</span>
                    <strong className="text-base font-mono tabular-nums text-slate-900">
                      {di.jaringanSaluran?.jumlahBangunanBagiSadap || 0} Unit
                    </strong>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-slate-500 block">Talang & Siphon</span>
                    <strong className="text-base font-mono tabular-nums text-slate-900">
                      {di.jaringanSaluran?.jumlahTalangSiphon || 0} Unit
                    </strong>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-slate-500 block">Gorong-gorong</span>
                    <strong className="text-base font-mono tabular-nums text-slate-900">
                      {di.jaringanSaluran?.jumlahGorongGorong || 0} Unit
                    </strong>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-slate-500 block">Pintu Pengambilan</span>
                    <strong className="text-base font-mono tabular-nums text-slate-900">
                      {di.bangunanUtama?.jumlahPintuPengambilan || 0} Pintu
                    </strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: e-PAKSI & IKSI */}
          {activeTab === 'epaksi' && (
            <div className="space-y-6">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="text-xs text-slate-500">Nilai Indeks Kinerja Sistem Irigasi (IKSI)</div>
                  <div className="text-3xl font-mono font-extrabold text-slate-900 tabular-nums mt-0.5">
                    {di.nilaiIKSI.toFixed(2)}%
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    Klasifikasi Kinerja: <strong className="font-semibold text-slate-900">{di.kategoriIKSI}</strong>
                  </p>
                </div>

                <div className="text-xs text-slate-500 sm:text-right border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-200">
                  <div>Standar: Permen PUPR No. 12/PRT/M/2015</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Minimal Kinerja Baik: &ge; 70.00%
                  </div>
                </div>
              </div>

              {/* 6 Aspects Breakdown */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Rincian 6 Parameter Penilaian e-PAKSI
                </h3>

                <div className="space-y-3">
                  {/* 1. Prasarana Fisik */}
                  <div className="border border-slate-200 rounded-lg p-3.5">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-medium text-slate-800">1. Prasarana Fisik (Maks 45%)</span>
                      <span className="font-mono font-bold text-slate-900 tabular-nums">
                        {di.rincianIKSI?.prasaranaFisik || 0} / 45.00
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-amber-500 h-full rounded-full"
                        style={{ width: `${((di.rincianIKSI?.prasaranaFisik || 0) / 45) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* 2. Produktivitas Tanam */}
                  <div className="border border-slate-200 rounded-lg p-3.5">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-medium text-slate-800">2. Produktivitas Tanam (Maks 15%)</span>
                      <span className="font-mono font-bold text-slate-900 tabular-nums">
                        {di.rincianIKSI?.produktivitasTanam || 0} / 15.00
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full rounded-full"
                        style={{ width: `${((di.rincianIKSI?.produktivitasTanam || 0) / 15) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* 3. Sarana Penunjang */}
                  <div className="border border-slate-200 rounded-lg p-3.5">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-medium text-slate-800">3. Sarana Penunjang (Maks 10%)</span>
                      <span className="font-mono font-bold text-slate-900 tabular-nums">
                        {di.rincianIKSI?.saranaPenunjang || 0} / 10.00
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-500 h-full rounded-full"
                        style={{ width: `${((di.rincianIKSI?.saranaPenunjang || 0) / 10) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* 4. Organisasi Personalia */}
                  <div className="border border-slate-200 rounded-lg p-3.5">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-medium text-slate-800">4. Organisasi Personalia (Maks 15%)</span>
                      <span className="font-mono font-bold text-slate-900 tabular-nums">
                        {di.rincianIKSI?.organisasiPersonalia || 0} / 15.00
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-indigo-500 h-full rounded-full"
                        style={{ width: `${((di.rincianIKSI?.organisasiPersonalia || 0) / 15) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* 5. Dokumentasi */}
                  <div className="border border-slate-200 rounded-lg p-3.5">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-medium text-slate-800">5. Dokumentasi PAI (Maks 5%)</span>
                      <span className="font-mono font-bold text-slate-900 tabular-nums">
                        {di.rincianIKSI?.dokumentasi || 0} / 5.00
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-teal-500 h-full rounded-full"
                        style={{ width: `${((di.rincianIKSI?.dokumentasi || 0) / 5) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* 6. Kelembagaan P3A */}
                  <div className="border border-slate-200 rounded-lg p-3.5">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-medium text-slate-800">6. Kelembagaan P3A (Maks 10%)</span>
                      <span className="font-mono font-bold text-slate-900 tabular-nums">
                        {di.rincianIKSI?.p3a || 0} / 10.00
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-rose-500 h-full rounded-full"
                        style={{ width: `${((di.rincianIKSI?.p3a || 0) / 10) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: P3A */}
          {activeTab === 'p3a' && (
            <div className="space-y-6">
              <div className="border border-slate-200 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      {di.dataP3A?.namaP3A || 'Belum Terbentuk P3A'}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Perkumpulan Petani Pemakai Air (P3A / GP3A)
                    </p>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-md ${
                    di.dataP3A?.keaktifanIuran === 'Aktif'
                      ? 'bg-emerald-50 text-emerald-700'
                      : di.dataP3A?.keaktifanIuran === 'Kurang Aktif'
                      ? 'bg-amber-50 text-amber-700'
                      : 'bg-rose-50 text-rose-700'
                  }`}>
                    Iuran: {di.dataP3A?.keaktifanIuran || 'Tidak Aktif'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <span className="text-slate-500 block">Nama Ketua P3A</span>
                    <strong className="text-sm text-slate-800 mt-0.5 block">
                      {di.dataP3A?.namaKetua || '-'}
                    </strong>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg">
                    <span className="text-slate-500 block">Nomor Kontak / WhatsApp</span>
                    <strong className="text-sm font-mono text-slate-800 mt-0.5 block">
                      {di.dataP3A?.noKontak || '-'}
                    </strong>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg">
                    <span className="text-slate-500 block">Status Badan Hukum (Kemenkumham/Akta Notaris)</span>
                    <strong className="text-sm text-slate-800 mt-0.5 block">
                      {di.dataP3A?.statusBadanHukum ? 'Berbadan Hukum Resmi' : 'Belum Berbadan Hukum'}
                    </strong>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg">
                    <span className="text-slate-500 block">Jumlah Anggota Petani</span>
                    <strong className="text-sm font-mono tabular-nums text-slate-800 mt-0.5 block">
                      {di.dataP3A?.jumlahAnggota || 0} Orang Petani
                    </strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: USULAN PENANGANAN */}
          {activeTab === 'usulan' && (
            <div className="space-y-6">
              <div className="border border-slate-200 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      {di.usulanPenanganan?.kategori}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Sumber Dana: {di.usulanPenanganan?.sumberDana} · Tahun Anggaran: {di.usulanPenanganan?.tahunUsulan}
                    </p>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-slate-800">
                    Status: {di.usulanPenanganan?.statusUsulan}
                  </span>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <span className="text-[11px] text-slate-500">Estimasi Rencana Anggaran Biaya (RAB):</span>
                  <div className="text-2xl font-mono font-bold text-slate-900 mt-0.5 tabular-nums">
                    Rp {(di.usulanPenanganan?.estimasiBiayaRp || 0).toLocaleString('id-ID')}
                  </div>
                </div>

                <div>
                  <span className="text-xs font-bold text-slate-700 block mb-1">
                    Uraian Catatan Teknis & Justifikasi Lapangan:
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed bg-white border border-slate-200 p-3.5 rounded-lg">
                    {di.usulanPenanganan?.catatanTeknis || 'Tidak ada catatan teknis penanganan.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: AI / PUPR ASSISTANT */}
          {activeTab === 'analisis-ai' && (
            <div className="space-y-5">
              <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-700 flex items-center justify-center shrink-0">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-amber-950">
                      Asisten Telaah Teknis Standar Ditjen SDA PUPR
                    </h4>
                    <p className="text-[11px] text-amber-900/80 mt-0.5">
                      Evaluasi kesesuaian IKSI, justifikasi usulan DAK, dan prioritas O&P.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleRunAiAnalysis}
                  disabled={isLoadingAi}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors whitespace-nowrap disabled:opacity-50"
                >
                  {isLoadingAi ? 'Menganalisis...' : 'Perbarui Analisis'}
                </button>
              </div>

              {isLoadingAi ? (
                <div className="py-12 text-center text-xs text-slate-500 space-y-2">
                  <Activity className="w-6 h-6 text-amber-500 animate-spin mx-auto" />
                  <div>Menyusun telaah teknis irigasi berdasarkan data lapangan...</div>
                </div>
              ) : aiAnalysis ? (
                <div className="space-y-4">
                  <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500">Tingkat Prioritas Rekomendasi:</span>
                      <strong className="text-xs font-bold text-rose-700">{aiAnalysis.prioritasPenanganan}</strong>
                    </div>

                    <div className="border-t border-slate-100 pt-3">
                      <span className="text-xs font-bold text-slate-800 block mb-1">Rekomendasi Teknis:</span>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {aiAnalysis.rekomendasiTeknis}
                      </p>
                    </div>

                    <div className="border-t border-slate-100 pt-3">
                      <span className="text-xs font-bold text-slate-800 block mb-1">Estimasi Kebutuhan Biaya Ideal:</span>
                      <p className="text-xs font-mono font-semibold text-slate-800">
                        {aiAnalysis.estimasiAnggaranRekomendasi}
                      </p>
                    </div>

                    <div className="border-t border-slate-100 pt-3">
                      <span className="text-xs font-bold text-slate-800 block mb-1">Arahan P3A:</span>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {aiAnalysis.saranKelembagaanP3A}
                      </p>
                    </div>
                  </div>

                  {aiAnalysis.poinKunci?.length > 0 && (
                    <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
                      <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Poin Kunci Tindak Lanjut Dinas PUPR Nagekeo:
                      </h4>
                      <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                        {aiAnalysis.poinKunci.map((pk, idx) => (
                          <li key={idx}>{pk}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 px-6 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Terakhir diperbarui: {di.updatedAt || '2026-03-10'}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors"
            >
              Tutup
            </button>
            <button
              type="button"
              onClick={() => onEdit(di)}
              className="px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors"
            >
              Ubah Data DI
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
