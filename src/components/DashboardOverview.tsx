import React, { useMemo } from 'react';
import { DaerahIrigasi, KecamatanNagekeo, KECAMATAN_NAGEKEO_LIST } from '../types/irigasi';
import { 
  CheckCircle2, 
  AlertTriangle, 
  AlertCircle, 
  Layers, 
  Coins, 
  ChevronRight,
  TrendingUp,
  MapPin,
  Sparkles
} from 'lucide-react';

interface DashboardOverviewProps {
  data: DaerahIrigasi[];
  onSelectDI: (di: DaerahIrigasi) => void;
  onOpenAddModal: () => void;
  onViewAllTable: () => void;
  onViewMap: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  data,
  onSelectDI,
  onViewAllTable,
  onViewMap,
}) => {
  const stats = useMemo(() => {
    const totalDI = data.length;
    const totalLuasBaku = data.reduce((acc, curr) => acc + (curr.luasBaku || 0), 0);
    const totalLuasPotensial = data.reduce((acc, curr) => acc + (curr.luasPotensial || 0), 0);
    const totalLuasFungsional = data.reduce((acc, curr) => acc + (curr.luasFungsional || 0), 0);
    const rasioFungsional = totalLuasBaku > 0 ? (totalLuasFungsional / totalLuasBaku) * 100 : 0;

    const totalIKSI = data.reduce((acc, curr) => acc + (curr.nilaiIKSI || 0), 0);
    const rataRataIKSI = totalDI > 0 ? totalIKSI / totalDI : 0;

    const totalAnggaran = data.reduce((acc, curr) => acc + (curr.usulanPenanganan?.estimasiBiayaRp || 0), 0);

    // Bangunan Utama & Pelengkap Aggregates
    const totalPintuAir = data.reduce(
      (acc, curr) => acc + (curr.bangunanUtama?.jumlahPintuPengambilan || 0) + (curr.bangunanUtama?.jumlahPintuKuras || 0),
      0
    );
    const totalJalanInspeksiKm = data.reduce(
      (acc, curr) => acc + (curr.bangunanPelengkap?.jalanInspeksi?.panjangKm || 0),
      0
    );
    const totalJembatan = data.reduce(
      (acc, curr) => acc + (curr.bangunanPelengkap?.jembatanDesaTani?.jumlahUnit || 0),
      0
    );
    const totalBangunanSilang = data.reduce(
      (acc, curr) =>
        acc +
        (curr.bangunanPelengkap?.bangunanSilangDetail?.talang || 0) +
        (curr.bangunanPelengkap?.bangunanSilangDetail?.siphon || 0) +
        (curr.bangunanPelengkap?.bangunanSilangDetail?.gorongGorong || curr.jaringanSaluran?.jumlahGorongGorong || 0),
      0
    );

    const kondisiCount = {
      Baik: data.filter((d) => d.kondisiFisik === 'Baik').length,
      'Rusak Ringan': data.filter((d) => d.kondisiFisik === 'Rusak Ringan').length,
      'Rusak Sedang': data.filter((d) => d.kondisiFisik === 'Rusak Sedang').length,
      'Rusak Berat': data.filter((d) => d.kondisiFisik === 'Rusak Berat').length,
    };

    const kewenanganCount = {
      Pusat: data.filter((d) => d.kewenangan === 'Pusat').length,
      Provinsi: data.filter((d) => d.kewenangan === 'Provinsi').length,
      Kabupaten: data.filter((d) => d.kewenangan === 'Kabupaten').length,
    };

    const diKritis = data.filter((d) => d.kondisiFisik === 'Rusak Berat' || d.nilaiIKSI < 55);

    // Kecamatan stats
    const perKecamatan: Record<KecamatanNagekeo, { count: number; fungsional: number; avgIksi: number }> = {} as any;
    KECAMATAN_NAGEKEO_LIST.forEach((kec) => {
      const filtered = data.filter((d) => d.kecamatan === kec);
      const fungsional = filtered.reduce((acc, curr) => acc + (curr.luasFungsional || 0), 0);
      const avgIksi = filtered.length > 0 ? filtered.reduce((acc, curr) => acc + (curr.nilaiIKSI || 0), 0) / filtered.length : 0;
      perKecamatan[kec] = {
        count: filtered.length,
        fungsional,
        avgIksi,
      };
    });

    return {
      totalDI,
      totalLuasBaku,
      totalLuasPotensial,
      totalLuasFungsional,
      rasioFungsional,
      rataRataIKSI,
      totalAnggaran,
      totalPintuAir,
      totalJalanInspeksiKm,
      totalJembatan,
      totalBangunanSilang,
      kondisiCount,
      kewenanganCount,
      diKritis,
      perKecamatan,
    };
  }, [data]);

  return (
    <div className="space-y-6">
      {/* Hero Header Strip */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1">
              <span>Provinsi Nusa Tenggara Timur</span>
              <span>·</span>
              <span>Pemerintah Daerah Kabupaten Nagekeo</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Sistem Informasi Pengelolaan Aset & Kinerja Irigasi
            </h1>
            <p className="mt-1.5 text-sm text-slate-600 max-w-3xl leading-relaxed">
              Pangkalan data geospasial dan e-PAKSI inventarisasi prasarana fisik, bangunan utama (bendung/intake), 
              saluran pembawa, serta kelembagaan P3A di 7 Kecamatan Kabupaten Nagekeo.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onViewMap}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors inline-flex items-center gap-1.5"
            >
              <MapPin className="w-4 h-4 text-slate-600" />
              <span>Buka Peta GIS</span>
            </button>
            <button
              type="button"
              onClick={onViewAllTable}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors inline-flex items-center gap-1.5"
            >
              <span>Lihat Semua Data ({stats.totalDI})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total DI */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Total Daerah Irigasi</span>
            <span className="text-xs text-slate-400">7 Kecamatan</span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono tabular-nums text-slate-900">
              {stats.totalDI}
            </span>
            <span className="text-xs text-slate-600 font-medium">Daerah Irigasi</span>
          </div>
          <div className="mt-3 text-xs text-slate-500 flex items-center justify-between border-t border-slate-100 pt-2.5">
            <span>Kabupaten: <strong className="text-slate-700 font-mono tabular-nums">{stats.kewenanganCount.Kabupaten}</strong></span>
            <span>Pusat: <strong className="text-slate-700 font-mono tabular-nums">{stats.kewenanganCount.Pusat}</strong></span>
          </div>
        </div>

        {/* Luas Fungsional */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Luas Areal Fungsional</span>
            <span className="text-xs text-emerald-700 font-medium font-mono tabular-nums">
              {stats.rasioFungsional.toFixed(1)}% rasio
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono tabular-nums text-slate-900">
              {stats.totalLuasFungsional.toLocaleString('id-ID')}
            </span>
            <span className="text-xs text-slate-600 font-medium">Hektare (Ha)</span>
          </div>
          <div className="mt-3 text-xs text-slate-500 flex items-center justify-between border-t border-slate-100 pt-2.5">
            <span>Luas Baku: <strong className="text-slate-700 font-mono tabular-nums">{stats.totalLuasBaku.toLocaleString('id-ID')} Ha</strong></span>
          </div>
        </div>

        {/* Indeks Kinerja Rata-rata (IKSI) */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Rata-rata Nilai IKSI</span>
            <span className="text-xs text-amber-600 font-medium">Permen PUPR 12/2015</span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono tabular-nums text-slate-900">
              {stats.rataRataIKSI.toFixed(2)}%
            </span>
            <span className={`text-xs font-semibold ${stats.rataRataIKSI >= 70 ? 'text-emerald-700' : 'text-amber-700'}`}>
              {stats.rataRataIKSI >= 70 ? 'Kategori Baik' : 'Perlu Perhatian'}
            </span>
          </div>
          <div className="mt-3 text-xs text-slate-500 flex items-center justify-between border-t border-slate-100 pt-2.5">
            <span>Standar Min: <strong className="text-slate-700 font-mono tabular-nums">70.00%</strong></span>
            <span className="inline-flex items-center gap-1 text-slate-600 font-medium">
              <TrendingUp className="w-3 h-3 text-emerald-600" />
              e-PAKSI
            </span>
          </div>
        </div>

        {/* Usulan Kebutuhan Anggaran */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Estimasi Usulan Dana</span>
            <span className="text-xs text-slate-400">DAK / APBD</span>
          </div>
          <div className="mt-3 flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-slate-900">
              Rp {(stats.totalAnggaran / 1000000000).toFixed(2)}
            </span>
            <span className="text-xs text-slate-600 font-medium">Milyar</span>
          </div>
          <div className="mt-3 text-xs text-slate-500 flex items-center justify-between border-t border-slate-100 pt-2.5">
            <span>O&P Rutin & DAK Fisik</span>
            <Coins className="w-3.5 h-3.5 text-slate-400" />
          </div>
        </div>

      </div>

      {/* Bangunan Utama & Pelengkap Inventory Strip */}
      <div className="bg-slate-900 text-white rounded-xl border border-slate-800 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Rekapitulasi Fisik Bangunan Utama & Bangunan Pelengkap
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Inventarisasi aset fisik headworks, jembatan tani, pintu air, dan jalan inspeksi di Nagekeo
            </p>
          </div>
          <span className="text-[11px] font-mono text-slate-400 bg-slate-800 px-2.5 py-1 rounded-md">
            Permen PUPR No. 12/2015
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 text-xs">
          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
            <span className="text-slate-400 block text-[11px]">Pintu Pengambilan & Kuras</span>
            <strong className="text-2xl font-mono font-bold text-white mt-1 block tabular-nums">
              {stats.totalPintuAir} Unit
            </strong>
            <span className="text-[10px] text-slate-400 mt-0.5 block">Di 12 Bangunan Utama</span>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
            <span className="text-slate-400 block text-[11px]">Jalan Inspeksi Irigasi</span>
            <strong className="text-2xl font-mono font-bold text-amber-400 mt-1 block tabular-nums">
              {stats.totalJalanInspeksiKm.toFixed(1)} Km
            </strong>
            <span className="text-[10px] text-slate-400 mt-0.5 block">Rabat Beton & Sirtu</span>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
            <span className="text-slate-400 block text-[11px]">Jembatan Desa & Tani</span>
            <strong className="text-2xl font-mono font-bold text-white mt-1 block tabular-nums">
              {stats.totalJembatan} Unit
            </strong>
            <span className="text-[10px] text-slate-400 mt-0.5 block">Akses Petani & Alsintan</span>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
            <span className="text-slate-400 block text-[11px]">Bangunan Silang (Talang/Gorong)</span>
            <strong className="text-2xl font-mono font-bold text-emerald-400 mt-1 block tabular-nums">
              {stats.totalBangunanSilang} Unit
            </strong>
            <span className="text-[10px] text-slate-400 mt-0.5 block">Talang, Siphon, Gorong-gorong</span>
          </div>
        </div>
      </div>

      {/* Critical Alert Section (DI Kritis / Rusak Berat) */}
      {stats.diKritis.length > 0 && (
        <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-5">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h3 className="text-sm font-semibold text-amber-950">
                  Perhatian Khusus: {stats.diKritis.length} Daerah Irigasi Kritis / Kinerja Rendah (IKSI &lt; 55% atau Rusak Berat)
                </h3>
                <span className="text-xs text-amber-800 font-medium">
                  Prioritas Usulan DAK Fisik & Tanggap Darurat
                </span>
              </div>
              <p className="mt-1 text-xs text-amber-900/80 leading-relaxed">
                Daerah irigasi berikut mengalami kerusakan struktural pada bendung atau saluran primer/sekunder 
                yang berpotensi mengganggu pasokan air tanam petani Nagekeo:
              </p>

              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {stats.diKritis.map((di) => (
                  <div
                    key={di.id}
                    onClick={() => onSelectDI(di)}
                    className="cursor-pointer bg-white border border-amber-200/80 hover:border-amber-400 rounded-lg p-3 transition-colors flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900">{di.nama}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Kec. {di.kecamatan} · Luas Fungsional: {di.luasFungsional} Ha
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-mono font-bold text-red-600 tabular-nums">
                        IKSI: {di.nilaiIKSI}%
                      </div>
                      <div className="text-[10px] text-slate-500 font-medium">
                        {di.kondisiFisik}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Two Column Detailed Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Kondisi Fisik & Distribusi Saluran */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Distribusi Kondisi Fisik Jaringan</h2>
              <p className="text-xs text-slate-500 mt-0.5">Kondisi fisik seluruh sistem irigasi Kabupaten Nagekeo</p>
            </div>
            <span className="text-xs text-slate-500 font-mono tabular-nums">{stats.totalDI} Total DI</span>
          </div>

          {/* Progress Bars for Kondisi Fisik */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="border border-slate-100 rounded-lg p-4 bg-slate-50/50">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-emerald-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Kondisi Baik
                </span>
                <span className="font-mono tabular-nums font-bold text-slate-700">
                  {stats.kondisiCount['Baik']} DI ({((stats.kondisiCount['Baik'] / stats.totalDI) * 100).toFixed(0)}%)
                </span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-emerald-500 h-full rounded-full transition-all"
                  style={{ width: `${(stats.kondisiCount['Baik'] / stats.totalDI) * 100}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-2">
                Jaringan berfungsi optimal, pemeliharaan rutin berjalan lancar.
              </p>
            </div>

            <div className="border border-slate-100 rounded-lg p-4 bg-slate-50/50">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-blue-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                  Rusak Ringan
                </span>
                <span className="font-mono tabular-nums font-bold text-slate-700">
                  {stats.kondisiCount['Rusak Ringan']} DI ({((stats.kondisiCount['Rusak Ringan'] / stats.totalDI) * 100).toFixed(0)}%)
                </span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-blue-500 h-full rounded-full transition-all"
                  style={{ width: `${(stats.kondisiCount['Rusak Ringan'] / stats.totalDI) * 100}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-2">
                Kerusakan lokal minor, ditangani melalui O&P berkala APBD.
              </p>
            </div>

            <div className="border border-slate-100 rounded-lg p-4 bg-slate-50/50">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-amber-800 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                  Rusak Sedang
                </span>
                <span className="font-mono tabular-nums font-bold text-slate-700">
                  {stats.kondisiCount['Rusak Sedang']} DI ({((stats.kondisiCount['Rusak Sedang'] / stats.totalDI) * 100).toFixed(0)}%)
                </span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-amber-500 h-full rounded-full transition-all"
                  style={{ width: `${(stats.kondisiCount['Rusak Sedang'] / stats.totalDI) * 100}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-2">
                Penurunan debit suplai &gt;20%, membutuhkan rehabilitasi saluran.
              </p>
            </div>

            <div className="border border-slate-100 rounded-lg p-4 bg-slate-50/50">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-rose-800 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                  Rusak Berat
                </span>
                <span className="font-mono tabular-nums font-bold text-slate-700">
                  {stats.kondisiCount['Rusak Berat']} DI ({((stats.kondisiCount['Rusak Berat'] / stats.totalDI) * 100).toFixed(0)}%)
                </span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-rose-500 h-full rounded-full transition-all"
                  style={{ width: `${(stats.kondisiCount['Rusak Berat'] / stats.totalDI) * 100}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-2">
                Struktur bendung/saluran putus, prioritas DAK Fisik/Darurat.
              </p>
            </div>

          </div>

          {/* Quick List Preview of High Priority Systems */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Pembaruan Terkini Profil Jaringan Irigasi
              </h3>
              <button
                type="button"
                onClick={onViewAllTable}
                className="text-xs font-semibold text-amber-700 hover:text-amber-800 transition-colors"
              >
                Lihat Seluruh Tabel →
              </button>
            </div>

            <div className="border border-slate-200 rounded-lg divide-y divide-slate-100 overflow-hidden">
              {data.slice(0, 5).map((di) => (
                <div
                  key={di.id}
                  onClick={() => onSelectDI(di)}
                  className="p-3.5 hover:bg-slate-50 cursor-pointer transition-colors flex items-center justify-between gap-4"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 truncate">{di.nama}</span>
                      <span className="text-[11px] text-slate-400 font-mono">({di.kodeDI})</span>
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                      <span>Kec. {di.kecamatan}</span>
                      <span>·</span>
                      <span>{di.bangunanUtama?.nama}</span>
                      <span>·</span>
                      <span className="font-mono tabular-nums">{di.luasFungsional} Ha</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      <div className="text-xs font-mono font-bold text-slate-800 tabular-nums">
                        IKSI {di.nilaiIKSI}%
                      </div>
                      <div className="text-[10px] text-slate-500">{di.kategoriIKSI}</div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Sebaran Per Kecamatan di Nagekeo */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">Rekapitulasi 7 Kecamatan</h2>
                <p className="text-xs text-slate-500 mt-0.5">Sebaran DI & luas areal fungsional</p>
              </div>
              <Layers className="w-4 h-4 text-slate-400" />
            </div>

            <div className="mt-4 divide-y divide-slate-100">
              {KECAMATAN_NAGEKEO_LIST.map((kec) => {
                const info = stats.perKecamatan[kec];
                return (
                  <div key={kec} className="py-2.5 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-900">{kec}</div>
                      <div className="text-[11px] text-slate-500 font-mono tabular-nums">
                        {info.count} DI · {info.fungsional.toLocaleString('id-ID')} Ha
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-mono font-semibold text-slate-700 tabular-nums">
                        IKSI {info.avgIksi > 0 ? info.avgIksi.toFixed(1) + '%' : '-'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Notice Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 text-xs text-slate-600">
            <div className="flex items-center gap-1.5 font-bold text-slate-800 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Standar e-PAKSI Ditjen SDA</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-500">
              Penilaian Indeks Kinerja mencakup 6 aspek: Prasarana Fisik (45%), Produktivitas Tanam (15%), Sarana Penunjang (10%), Personalia (15%), Dokumentasi (5%), dan Kelembagaan P3A (10%).
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
