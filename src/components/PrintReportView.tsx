import React from 'react';
import { DaerahIrigasi } from '../types/irigasi';
import { Printer, ArrowLeft } from 'lucide-react';

interface PrintReportViewProps {
  data: DaerahIrigasi[];
  singleDI?: DaerahIrigasi | null;
  onBack: () => void;
}

export const PrintReportView: React.FC<PrintReportViewProps> = ({
  data,
  singleDI,
  onBack,
}) => {
  const printData = singleDI ? [singleDI] : data;

  const totalBaku = printData.reduce((acc, curr) => acc + (curr.luasBaku || 0), 0);
  const totalFungsional = printData.reduce((acc, curr) => acc + (curr.luasFungsional || 0), 0);
  const avgIKSI = printData.length > 0
    ? printData.reduce((acc, curr) => acc + (curr.nilaiIKSI || 0), 0) / printData.length
    : 0;

  const handlePrint = () => {
    window.print();
  };

  const currentDate = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="bg-white min-h-screen text-slate-900 font-sans p-4 sm:p-8">
      {/* Floating Toolbar on Screen */}
      <div className="no-print max-w-5xl mx-auto mb-6 flex items-center justify-between bg-slate-900 text-white p-4 rounded-xl shadow-md">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Aplikasi</span>
        </button>

        <div className="text-xs text-slate-400">
          Format Dokumen Cetak Resmi A4 · Dinas PUPR Kab. Nagekeo
        </div>

        <button
          type="button"
          onClick={handlePrint}
          className="px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
        >
          <Printer className="w-4 h-4" />
          <span>Cetak / Simpan PDF</span>
        </button>
      </div>

      {/* Printable Sheet */}
      <div className="max-w-5xl mx-auto border border-slate-200 p-8 rounded-lg shadow-xs print:border-none print:p-0">
        
        {/* Kop Surat Resmi Dinas PUPR Kab. Nagekeo */}
        <div className="text-center pb-4 border-b-4 border-double border-slate-900 relative">
          <div className="text-sm font-bold tracking-wider text-slate-800 uppercase">
            Pemerintah Kabupaten Nagekeo
          </div>
          <div className="text-lg font-black tracking-tight text-slate-950 uppercase mt-0.5">
            Dinas Pekerjaan Umum dan Penataan Ruang
          </div>
          <div className="text-xs font-bold text-slate-700 tracking-wide uppercase mt-0.5">
            Bidang Sumber Daya Air (SDA)
          </div>
          <div className="text-[11px] text-slate-600 mt-1">
            Kompleks Perkantoran Civic Center Mbay, Kelurahan Danga, Kec. Aesesa, Kab. Nagekeo, Nusa Tenggara Timur 86472
          </div>
          <div className="text-[11px] text-slate-600">
            Email: puprngkdinas@gmail.com · Website Resmi: nagekeokab.go.id
          </div>
        </div>

        {/* Judul Laporan */}
        <div className="text-center my-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 underline decoration-1 underline-offset-4">
            {singleDI
              ? `Lembar Profil Teknis & Kinerja: ${singleDI.nama}`
              : 'Laporan Rekapitulasi Database Daerah Irigasi & Penilaian IKSI'}
          </h2>
          <div className="text-xs text-slate-600 mt-1">
            Standar Pengelolaan Aset Irigasi (PAI) & e-PAKSI Permen PUPR No. 12 & 14/PRT/M/2015
          </div>
        </div>

        {/* Tabel Data Irigasi */}
        <div className="overflow-x-auto my-4">
          <table className="w-full border-collapse border border-slate-900 text-[10px]">
            <thead>
              <tr className="bg-slate-100 text-slate-900 font-bold text-center border-b border-slate-900">
                <th className="border border-slate-900 p-1.5 w-7">No</th>
                <th className="border border-slate-900 p-1.5 text-left">Nama Daerah Irigasi</th>
                <th className="border border-slate-900 p-1.5">Kode DI</th>
                <th className="border border-slate-900 p-1.5 text-left">Kecamatan / Desa</th>
                <th className="border border-slate-900 p-1.5">Wenang</th>
                <th className="border border-slate-900 p-1.5 text-left">Sumber Air</th>
                <th className="border border-slate-900 p-1.5 text-right">Luas Baku (Ha)</th>
                <th className="border border-slate-900 p-1.5 text-right">Luas Fung. (Ha)</th>
                <th className="border border-slate-900 p-1.5">Kondisi Fisik</th>
                <th className="border border-slate-900 p-1.5 text-right">IKSI (%)</th>
                <th className="border border-slate-900 p-1.5">Kategori</th>
                <th className="border border-slate-900 p-1.5 text-left">Usulan Penanganan</th>
              </tr>
            </thead>
            <tbody>
              {printData.map((di, idx) => (
                <tr key={di.id} className="border-b border-slate-900/60">
                  <td className="border border-slate-900 p-1.5 text-center font-mono">{idx + 1}</td>
                  <td className="border border-slate-900 p-1.5 font-bold text-left">{di.nama}</td>
                  <td className="border border-slate-900 p-1.5 font-mono text-center">{di.kodeDI}</td>
                  <td className="border border-slate-900 p-1.5 text-left">
                    Kec. {di.kecamatan}, {di.desa}
                  </td>
                  <td className="border border-slate-900 p-1.5 text-center">{di.kewenangan}</td>
                  <td className="border border-slate-900 p-1.5 text-left">{di.sumberAir}</td>
                  <td className="border border-slate-900 p-1.5 text-right font-mono tabular-nums">
                    {di.luasBaku.toLocaleString('id-ID')}
                  </td>
                  <td className="border border-slate-900 p-1.5 text-right font-mono font-bold tabular-nums">
                    {di.luasFungsional.toLocaleString('id-ID')}
                  </td>
                  <td className="border border-slate-900 p-1.5 text-center font-medium">{di.kondisiFisik}</td>
                  <td className="border border-slate-900 p-1.5 text-right font-mono font-bold tabular-nums">
                    {di.nilaiIKSI.toFixed(1)}%
                  </td>
                  <td className="border border-slate-900 p-1.5 text-center">{di.kategoriIKSI}</td>
                  <td className="border border-slate-900 p-1.5 text-left">
                    {di.usulanPenanganan?.kategori}
                    <div className="text-[9px] text-slate-600">
                      (Rp {(di.usulanPenanganan?.estimasiBiayaRp || 0).toLocaleString('id-ID')})
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-slate-100 font-bold border-t-2 border-slate-900">
                <td colSpan={6} className="border border-slate-900 p-2 text-center uppercase">
                  Jumlah Total / Rata-rata
                </td>
                <td className="border border-slate-900 p-2 text-right font-mono tabular-nums">
                  {totalBaku.toLocaleString('id-ID')} Ha
                </td>
                <td className="border border-slate-900 p-2 text-right font-mono tabular-nums">
                  {totalFungsional.toLocaleString('id-ID')} Ha
                </td>
                <td className="border border-slate-900 p-2 text-center">-</td>
                <td className="border border-slate-900 p-2 text-right font-mono tabular-nums">
                  {avgIKSI.toFixed(2)}%
                </td>
                <td className="border border-slate-900 p-2 text-center font-bold">
                  {avgIKSI >= 77.5 ? 'Sangat Baik' : avgIKSI >= 70 ? 'Baik' : avgIKSI >= 55 ? 'Kurang' : 'Jelek'}
                </td>
                <td className="border border-slate-900 p-2 text-left">
                  {printData.length} Daerah Irigasi
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Tanda Tangan Pejabat Pengesahan */}
        <div className="mt-12 grid grid-cols-2 text-center text-xs print-break-inside-avoid">
          <div>
            <div>Mengetahui,</div>
            <div className="font-bold uppercase mt-1">Kepala Dinas Pekerjaan Umum dan Penataan Ruang</div>
            <div className="font-bold uppercase">Kabupaten Nagekeo</div>
            <div className="h-20" />
            <div className="font-bold underline uppercase">( ............................................................. )</div>
            <div className="text-[11px] text-slate-600">NIP. ........................................................</div>
          </div>

          <div>
            <div>Mbay, {currentDate}</div>
            <div className="font-bold uppercase mt-1">Kepala Bidang Sumber Daya Air (SDA)</div>
            <div className="font-bold uppercase">Dinas PUPR Kabupaten Nagekeo</div>
            <div className="h-20" />
            <div className="font-bold underline uppercase">( ............................................................. )</div>
            <div className="text-[11px] text-slate-600">NIP. ........................................................</div>
          </div>
        </div>

      </div>
    </div>
  );
};
