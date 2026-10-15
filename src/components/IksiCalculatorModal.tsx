import React, { useState } from 'react';
import { X, Calculator, Info, CheckCircle2, AlertTriangle, AlertCircle, Sparkles } from 'lucide-react';
import { KategoriIKSI, hitungTotalIKSI } from '../types/irigasi';

interface IksiCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const IksiCalculatorModal: React.FC<IksiCalculatorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [prasaranaFisik, setPrasaranaFisik] = useState(32.5);
  const [produktivitasTanam, setProduktivitasTanam] = useState(11.8);
  const [saranaPenunjang, setSaranaPenunjang] = useState(7.0);
  const [organisasiPersonalia, setOrganisasiPersonalia] = useState(11.0);
  const [dokumentasi, setDokumentasi] = useState(3.5);
  const [p3a, setP3a] = useState(6.5);

  if (!isOpen) return null;

  const totalCalc = hitungTotalIKSI({
    prasaranaFisik,
    produktivitasTanam,
    saranaPenunjang,
    organisasiPersonalia,
    dokumentasi,
    p3a,
  });

  const getKategoriBadgeColor = (kategori: KategoriIKSI) => {
    switch (kategori) {
      case 'Sangat Baik':
        return 'bg-emerald-50 text-emerald-800 border-emerald-300';
      case 'Baik':
        return 'bg-blue-50 text-blue-800 border-blue-300';
      case 'Kurang':
        return 'bg-amber-50 text-amber-800 border-amber-300';
      default:
        return 'bg-rose-50 text-rose-800 border-rose-300';
    }
  };

  const resetToStandard = () => {
    setPrasaranaFisik(35.0);
    setProduktivitasTanam(12.0);
    setSaranaPenunjang(7.5);
    setOrganisasiPersonalia(11.5);
    setDokumentasi(3.8);
    setP3a(7.0);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 no-print">
      <div className="bg-white w-full max-w-3xl rounded-2xl border border-slate-200 shadow-xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Kalkulator IKSI e-PAKSI PUPR</h2>
              <p className="text-xs text-slate-400">
                Simulasi Indeks Kinerja Sistem Irigasi Permen PUPR No. 12/PRT/M/2015
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

        {/* Score Hero Banner */}
        <div className="bg-slate-50 border-b border-slate-200 p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Skor IKSI Terhitung
            </span>
            <div className="text-4xl font-mono font-extrabold text-slate-900 tabular-nums mt-1">
              {totalCalc.nilai.toFixed(2)}%
            </div>
            <div className="mt-1 flex items-center gap-2 text-xs">
              <span className={`px-2.5 py-0.5 rounded-md font-semibold border ${getKategoriBadgeColor(totalCalc.kategori)}`}>
                Kinerja: {totalCalc.kategori}
              </span>
              <span className="text-slate-500">
                {totalCalc.nilai >= 70 ? 'Memenuhi Standar Minimal PUPR' : 'Di Bawah Standar Kelayakan'}
              </span>
            </div>
          </div>

          <div className="text-xs space-y-1 text-slate-600 border-l border-slate-200 pl-4">
            <div className="font-semibold text-slate-800">Kriteria Kinerja Permen PUPR:</div>
            <div>&gt; 77.5% : <strong>Sangat Baik</strong> (O&P Rutin)</div>
            <div>70.0 - 77.4% : <strong>Baik</strong> (O&P Berkala)</div>
            <div>55.0 - 69.9% : <strong>Kurang</strong> (Rehabilitasi)</div>
            <div>&lt; 55.0% : <strong>Jelek</strong> (Darurat / Rekonstruksi)</div>
          </div>
        </div>

        {/* Interactive Sliders Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          <div className="space-y-4">
            
            {/* 1. Prasarana Fisik */}
            <div className="border border-slate-200 rounded-xl p-4 bg-white">
              <div className="flex items-center justify-between text-xs mb-2">
                <div>
                  <span className="font-bold text-slate-800">1. Prasarana Fisik</span>
                  <span className="text-slate-400 ml-1">(Bobot Maks: 45.00%)</span>
                </div>
                <span className="font-mono font-bold text-slate-900 text-sm tabular-nums">
                  {prasaranaFisik.toFixed(1)} / 45.0
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="45"
                step="0.5"
                value={prasaranaFisik}
                onChange={(e) => setPrasaranaFisik(parseFloat(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>0% (Rusak Total)</span>
                <span>Bendung, Saluran Primer, Sekunder, Bangunan Bagi</span>
                <span>45% (Sempurna)</span>
              </div>
            </div>

            {/* 2. Produktivitas Tanam */}
            <div className="border border-slate-200 rounded-xl p-4 bg-white">
              <div className="flex items-center justify-between text-xs mb-2">
                <div>
                  <span className="font-bold text-slate-800">2. Produktivitas Tanam</span>
                  <span className="text-slate-400 ml-1">(Bobot Maks: 15.00%)</span>
                </div>
                <span className="font-mono font-bold text-slate-900 text-sm tabular-nums">
                  {produktivitasTanam.toFixed(1)} / 15.0
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="15"
                step="0.5"
                value={produktivitasTanam}
                onChange={(e) => setProduktivitasTanam(parseFloat(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>0% (Puso / Gagal)</span>
                <span>Indeks Pertanaman (IP) & Hasil Panen (Ton/Ha)</span>
                <span>15% (Optimal)</span>
              </div>
            </div>

            {/* 3. Sarana Penunjang */}
            <div className="border border-slate-200 rounded-xl p-4 bg-white">
              <div className="flex items-center justify-between text-xs mb-2">
                <div>
                  <span className="font-bold text-slate-800">3. Sarana Penunjang</span>
                  <span className="text-slate-400 ml-1">(Bobot Maks: 10.00%)</span>
                </div>
                <span className="font-mono font-bold text-slate-900 text-sm tabular-nums">
                  {saranaPenunjang.toFixed(1)} / 10.0
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                step="0.5"
                value={saranaPenunjang}
                onChange={(e) => setSaranaPenunjang(parseFloat(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>0%</span>
                <span>Kendaraan Operasional, Alat Ukur Debit, Komunikasi</span>
                <span>10%</span>
              </div>
            </div>

            {/* 4. Organisasi Personalia */}
            <div className="border border-slate-200 rounded-xl p-4 bg-white">
              <div className="flex items-center justify-between text-xs mb-2">
                <div>
                  <span className="font-bold text-slate-800">4. Organisasi Personalia</span>
                  <span className="text-slate-400 ml-1">(Bobot Maks: 15.00%)</span>
                </div>
                <span className="font-mono font-bold text-slate-900 text-sm tabular-nums">
                  {organisasiPersonalia.toFixed(1)} / 15.0
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="15"
                step="0.5"
                value={organisasiPersonalia}
                onChange={(e) => setOrganisasiPersonalia(parseFloat(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>0%</span>
                <span>Struktur UPTD/Dinas, Juru Pengairan, Petugas Pintu Air (POB)</span>
                <span>15%</span>
              </div>
            </div>

            {/* 5. Dokumentasi */}
            <div className="border border-slate-200 rounded-xl p-4 bg-white">
              <div className="flex items-center justify-between text-xs mb-2">
                <div>
                  <span className="font-bold text-slate-800">5. Dokumentasi Pengelolaan Aset</span>
                  <span className="text-slate-400 ml-1">(Bobot Maks: 5.00%)</span>
                </div>
                <span className="font-mono font-bold text-slate-900 text-sm tabular-nums">
                  {dokumentasi.toFixed(1)} / 5.0
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="5"
                step="0.1"
                value={dokumentasi}
                onChange={(e) => setDokumentasi(parseFloat(e.target.value))}
                className="w-full accent-teal-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>0%</span>
                <span>Buku PAI, Skema Jaringan, Peta As-built Drawing</span>
                <span>5%</span>
              </div>
            </div>

            {/* 6. Kelembagaan P3A */}
            <div className="border border-slate-200 rounded-xl p-4 bg-white">
              <div className="flex items-center justify-between text-xs mb-2">
                <div>
                  <span className="font-bold text-slate-800">6. Kelembagaan P3A</span>
                  <span className="text-slate-400 ml-1">(Bobot Maks: 10.00%)</span>
                </div>
                <span className="font-mono font-bold text-slate-900 text-sm tabular-nums">
                  {p3a.toFixed(1)} / 10.0
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                step="0.5"
                value={p3a}
                onChange={(e) => setP3a(parseFloat(e.target.value))}
                className="w-full accent-rose-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>0%</span>
                <span>Badan Hukum P3A, Iuran IPA, Jadwal Giliran Air</span>
                <span>10%</span>
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 px-6 flex items-center justify-between">
          <button
            type="button"
            onClick={resetToStandard}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900"
          >
            Reset ke Nilai Standar Baik
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors"
          >
            Selesai Simulasi
          </button>
        </div>

      </div>
    </div>
  );
};
