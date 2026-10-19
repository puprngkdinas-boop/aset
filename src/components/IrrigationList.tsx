import React, { useState, useMemo } from 'react';
import { 
  DaerahIrigasi, 
  KecamatanNagekeo, 
  KECAMATAN_NAGEKEO_LIST,
  KewenanganDI,
  KondisiFisik 
} from '../types/irigasi';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  Eye, 
  Edit3, 
  Trash2, 
  Plus, 
  LayoutList, 
  LayoutGrid, 
  MapPin, 
  Droplet,
  RefreshCw,
  Table,
  ExternalLink
} from 'lucide-react';
import { googleSheetService } from '../services/googleSheetService';
import { getDaftarDesa } from '../data/wilayahNagekeo';

interface IrrigationListProps {
  data: DaerahIrigasi[];
  allDataCount?: number;
  isAdmin?: boolean;
  onSelectDI: (di: DaerahIrigasi) => void;
  onEditDI: (di: DaerahIrigasi) => void;
  onDeleteDI: (id: string, nama: string) => void;
  onOpenAddModal: () => void;
  onFetchFromGoogleSheet?: () => void;
  isSyncingSheet?: boolean;
}

type SortField = 'nama' | 'kecamatan' | 'luasFungsional' | 'nilaiIKSI' | 'kondisiFisik';
type SortOrder = 'asc' | 'desc';

export const IrrigationList: React.FC<IrrigationListProps> = ({
  data,
  allDataCount,
  isAdmin,
  onSelectDI,
  onEditDI,
  onDeleteDI,
  onOpenAddModal,
  onFetchFromGoogleSheet,
  isSyncingSheet,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedKecamatan, setSelectedKecamatan] = useState<string>('all');
  const [selectedDesa, setSelectedDesa] = useState<string>('all');
  const [selectedKewenangan, setSelectedKewenangan] = useState<string>('all');
  const [selectedKondisi, setSelectedKondisi] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('nilaiIKSI');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  const filteredData = useMemo(() => {
    return data
      .filter((item) => {
        const matchesSearch =
          searchTerm === '' ||
          item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.kodeDI.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.desa.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.sumberAir.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (item.bangunanUtama?.nama || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
          (item.dataP3A?.namaP3A || '').toLowerCase().includes(searchTerm.toLowerCase());

        const matchesKecamatan =
          selectedKecamatan === 'all' || item.kecamatan === selectedKecamatan;

        const matchesDesa =
          selectedDesa === 'all' ||
          item.desa.toLowerCase().includes(selectedDesa.toLowerCase()) ||
          selectedDesa.toLowerCase().includes(item.desa.toLowerCase());

        const matchesKewenangan =
          selectedKewenangan === 'all' || item.kewenangan === selectedKewenangan;

        const matchesKondisi =
          selectedKondisi === 'all' || item.kondisiFisik === selectedKondisi;

        return matchesSearch && matchesKecamatan && matchesDesa && matchesKewenangan && matchesKondisi;
      })
      .sort((a, b) => {
        let valA: any = a[sortField];
        let valB: any = b[sortField];

        if (typeof valA === 'string') {
          return sortOrder === 'asc'
            ? valA.localeCompare(valB)
            : valB.localeCompare(valA);
        }

        return sortOrder === 'asc' ? valA - valB : valB - valA;
      });
  }, [data, searchTerm, selectedKecamatan, selectedDesa, selectedKewenangan, selectedKondisi, sortField, sortOrder]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedKecamatan('all');
    setSelectedDesa('all');
    setSelectedKewenangan('all');
    setSelectedKondisi('all');
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter Toolbar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari nama DI, kode, desa, bendung, sungai, P3A..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-colors"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>

          {/* Filters Bar */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            
            {/* Kecamatan Filter */}
            <select
              value={selectedKecamatan}
              onChange={(e) => {
                setSelectedKecamatan(e.target.value);
                setSelectedDesa('all');
              }}
              className="px-2.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium"
            >
              <option value="all">Semua Kecamatan (7)</option>
              {KECAMATAN_NAGEKEO_LIST.map((kec) => (
                <option key={kec} value={kec}>
                  Kec. {kec}
                </option>
              ))}
            </select>

            {/* Desa / Kelurahan Filter (Disesuaikan dengan Kecamatan yang dipilih) */}
            {selectedKecamatan !== 'all' && (
              <select
                value={selectedDesa}
                onChange={(e) => setSelectedDesa(e.target.value)}
                className="px-2.5 py-2 text-xs bg-amber-50 border border-amber-300 rounded-lg text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                <option value="all">Semua Desa di Kec. {selectedKecamatan} ({getDaftarDesa(selectedKecamatan).length})</option>
                {getDaftarDesa(selectedKecamatan).map((desa) => (
                  <option key={desa} value={desa}>
                    {desa}
                  </option>
                ))}
              </select>
            )}

            {/* Kewenangan Filter */}
            <select
              value={selectedKewenangan}
              onChange={(e) => setSelectedKewenangan(e.target.value)}
              className="px-2.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value="all">Semua Kewenangan</option>
              <option value="Kabupaten">Kabupaten (&lt;1000 Ha)</option>
              <option value="Pusat">Pusat (&gt;3000 Ha)</option>
              <option value="Provinsi">Provinsi (1000-3000 Ha)</option>
            </select>

            {/* Kondisi Filter */}
            <select
              value={selectedKondisi}
              onChange={(e) => setSelectedKondisi(e.target.value)}
              className="px-2.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value="all">Semua Kondisi</option>
              <option value="Baik">Baik</option>
              <option value="Rusak Ringan">Rusak Ringan</option>
              <option value="Rusak Sedang">Rusak Sedang</option>
              <option value="Rusak Berat">Rusak Berat</option>
            </select>

            {/* View Switcher */}
            <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50 p-0.5">
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-md transition-colors ${
                  viewMode === 'table' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-400 hover:text-slate-600'
                }`}
                title="Tampilan Tabel"
              >
                <LayoutList className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md transition-colors ${
                  viewMode === 'grid' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-400 hover:text-slate-600'
                }`}
                title="Tampilan Kartu"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
            </div>

            {onFetchFromGoogleSheet && (
              <button
                type="button"
                onClick={onFetchFromGoogleSheet}
                disabled={isSyncingSheet}
                className="px-3 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 rounded-lg transition-colors whitespace-nowrap inline-flex items-center gap-1.5 shrink-0 disabled:opacity-50"
                title="Tarik data terbaru dari Google Sheet (Dua Arah: Sheet -> Web)"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-emerald-600 ${isSyncingSheet ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Tarik dari Sheet</span>
              </button>
            )}

            <a
              href={googleSheetService.getSheetUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 text-xs font-semibold text-emerald-800 bg-white hover:bg-emerald-50 border border-emerald-300 rounded-lg transition-colors whitespace-nowrap inline-flex items-center gap-1.5 shrink-0 shadow-2xs"
              title="Buka Spreadsheet Google Sheet di tab baru"
            >
              <Table className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden md:inline">Buka Sheet</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>

            {isAdmin && (
              <button
                type="button"
                onClick={onOpenAddModal}
                className="px-3 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors whitespace-nowrap inline-flex items-center gap-1.5 shrink-0"
                title="Tambah Data Baru (Langsung tersimpan & muncul di Google Sheet)"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah DI</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter Summary & Reset Bar */}
        {(selectedKecamatan !== 'all' || selectedDesa !== 'all' || selectedKewenangan !== 'all' || selectedKondisi !== 'all' || searchTerm !== '') && (
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <div>
              Ditemukan <strong className="text-slate-800 font-mono tabular-nums">{filteredData.length}</strong> dari{' '}
              <span className="font-mono tabular-nums">{data.length}</span> Daerah Irigasi
            </div>
            <button
              type="button"
              onClick={resetFilters}
              className="text-amber-700 hover:text-amber-800 font-medium"
            >
              Reset Semua Filter
            </button>
          </div>
        )}
      </div>

      {/* Main Content: Table or Grid */}
      {filteredData.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-xs">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Filter className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">Tidak ada data Daerah Irigasi ditemukan</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Tidak ada data irigasi yang cocok dengan kriteria pencarian atau filter yang dipilih. Silakan reset filter atau tambahkan data baru.
          </p>
          <div className="mt-4 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={resetFilters}
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Reset Filter
            </button>
            <button
              type="button"
              onClick={onOpenAddModal}
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors"
            >
              + Tambah Data DI
            </button>
          </div>
        </div>
      ) : viewMode === 'table' ? (
        /* TABLE VIEW */
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-900 text-slate-300 border-b border-slate-800 uppercase tracking-wider text-[11px] font-semibold">
                  <th className="py-3 px-4">
                    <button
                      type="button"
                      onClick={() => handleSort('nama')}
                      className="flex items-center gap-1 hover:text-white transition-colors"
                    >
                      <span>Daerah Irigasi / Kode</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="py-3 px-4">
                    <button
                      type="button"
                      onClick={() => handleSort('kecamatan')}
                      className="flex items-center gap-1 hover:text-white transition-colors"
                    >
                      <span>Kecamatan & Desa</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="py-3 px-4">Sumber Air & Bangunan</th>
                  <th className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => handleSort('luasFungsional')}
                      className="inline-flex items-center gap-1 hover:text-white transition-colors justify-end w-full"
                    >
                      <span>Luas Fungsional</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="py-3 px-4">
                    <button
                      type="button"
                      onClick={() => handleSort('kondisiFisik')}
                      className="flex items-center gap-1 hover:text-white transition-colors"
                    >
                      <span>Kondisi Fisik</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => handleSort('nilaiIKSI')}
                      className="inline-flex items-center gap-1 hover:text-white transition-colors justify-end w-full"
                    >
                      <span>IKSI (e-PAKSI)</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="py-3 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredData.map((di) => (
                  <tr
                    key={di.id}
                    className="hover:bg-slate-50 transition-colors group"
                  >
                    {/* Nama & Kode */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2 flex-wrap">
                        <div
                          onClick={() => onSelectDI(di)}
                          className="cursor-pointer font-bold text-slate-900 group-hover:text-amber-700 transition-colors"
                        >
                          {di.nama}
                        </div>
                        {isAdmin && (
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium shrink-0 ${
                            di.isPublished !== false 
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}>
                            {di.isPublished !== false ? '🌐 Publik' : '🔒 Khusus Admin'}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1.5 mt-0.5">
                        <span>{di.kodeDI}</span>
                        <span>·</span>
                        <span className="text-slate-600 font-sans font-medium">{di.kewenangan}</span>
                      </div>
                    </td>

                    {/* Wilayah */}
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-900">Kec. {di.kecamatan}</div>
                      <div className="text-[11px] text-slate-500 truncate max-w-[200px]" title={di.desa}>
                        Desa {di.desa}
                      </div>
                    </td>

                    {/* Sumber Air & Bangunan Utama */}
                    <td className="py-3 px-4">
                      <div className="text-slate-800 font-medium truncate max-w-[200px]" title={di.sumberAir}>
                        {di.sumberAir}
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <Droplet className="w-3 h-3 text-amber-500" />
                        <span>{di.bangunanUtama?.nama || di.bangunanUtama?.tipe}</span>
                        <span>({di.bangunanUtama?.debitRataRataM3s || '-'} m³/s)</span>
                      </div>
                    </td>

                    {/* Luas Fungsional */}
                    <td className="py-3 px-4 text-right">
                      <div className="font-mono font-bold text-slate-900 tabular-nums">
                        {di.luasFungsional.toLocaleString('id-ID')} Ha
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono tabular-nums">
                        Baku: {di.luasBaku.toLocaleString('id-ID')} Ha
                      </div>
                    </td>

                    {/* Kondisi Fisik (Zero-Pill: Clean unboxed text) */}
                    <td className="py-3 px-4">
                      <div className={`font-semibold ${
                        di.kondisiFisik === 'Baik' ? 'text-emerald-700' :
                        di.kondisiFisik === 'Rusak Ringan' ? 'text-blue-700' :
                        di.kondisiFisik === 'Rusak Sedang' ? 'text-amber-700' :
                        'text-rose-700'
                      }`}>
                        {di.kondisiFisik}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {di.bangunanUtama?.kondisi}
                      </div>
                    </td>

                    {/* IKSI Score */}
                    <td className="py-3 px-4 text-right">
                      <div className="font-mono font-bold text-slate-900 tabular-nums">
                        {di.nilaiIKSI.toFixed(2)}%
                      </div>
                      <div className={`text-[11px] font-medium ${
                        di.kategoriIKSI === 'Sangat Baik' ? 'text-emerald-700' :
                        di.kategoriIKSI === 'Baik' ? 'text-blue-700' :
                        di.kategoriIKSI === 'Kurang' ? 'text-amber-700' :
                        'text-rose-700'
                      }`}>
                        {di.kategoriIKSI}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-center">
                      <div className="inline-flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => onSelectDI(di)}
                          className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
                          title="Lihat Detail Profil DI"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        {isAdmin && (
                          <>
                            <button
                              type="button"
                              onClick={() => onEditDI(di)}
                              className="p-1.5 text-slate-500 hover:text-amber-700 hover:bg-amber-50 rounded-md transition-colors"
                              title="Ubah Data DI (Perubahan otomatis langsung tersimpan ke Web & Google Sheet)"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => onDeleteDI(di.id, di.nama)}
                              className="p-1.5 text-slate-500 hover:text-rose-700 hover:bg-rose-50 rounded-md transition-colors"
                              title="Hapus Data DI (Baris otomatis langsung terhapus dari Web & Google Sheet)"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Footer info */}
          <div className="bg-slate-50 px-4 py-2.5 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <div>
              Menampilkan <span className="font-mono tabular-nums font-semibold text-slate-700">{filteredData.length}</span> Daerah Irigasi
            </div>
            <div className="font-mono tabular-nums">
              Total Fungsional: {filteredData.reduce((acc, c) => acc + (c.luasFungsional || 0), 0).toLocaleString('id-ID')} Ha
            </div>
          </div>
        </div>
      ) : (
        /* GRID CARD VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredData.map((di) => (
            <div
              key={di.id}
              className="bg-white rounded-xl border border-slate-200 hover:border-slate-300 transition-colors p-5 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3
                      onClick={() => onSelectDI(di)}
                      className="font-bold text-sm text-slate-900 hover:text-amber-700 cursor-pointer transition-colors"
                    >
                      {di.nama}
                    </h3>
                    <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                      {di.kodeDI} · {di.kewenangan}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-mono text-sm font-bold text-slate-900 tabular-nums">
                      {di.nilaiIKSI.toFixed(1)}%
                    </span>
                    <div className={`text-[10px] font-semibold ${
                      di.kategoriIKSI === 'Sangat Baik' ? 'text-emerald-700' :
                      di.kategoriIKSI === 'Baik' ? 'text-blue-700' :
                      di.kategoriIKSI === 'Kurang' ? 'text-amber-700' :
                      'text-rose-700'
                    }`}>
                      {di.kategoriIKSI}
                    </div>
                  </div>
                </div>

                <div className="mt-3.5 space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-3">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">Kec. {di.kecamatan} · Desa {di.desa}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Droplet className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span className="truncate">{di.bangunanUtama?.nama} ({di.sumberAir})</span>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Luas Fungsional</span>
                    <div className="font-mono font-bold text-slate-800 tabular-nums">{di.luasFungsional} Ha</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Kondisi Jaringan</span>
                    <div className={`font-semibold ${
                      di.kondisiFisik === 'Baik' ? 'text-emerald-700' :
                      di.kondisiFisik === 'Rusak Ringan' ? 'text-blue-700' :
                      di.kondisiFisik === 'Rusak Sedang' ? 'text-amber-700' :
                      'text-rose-700'
                    }`}>{di.kondisiFisik}</div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => onSelectDI(di)}
                  className="text-xs font-semibold text-slate-800 hover:text-amber-700 transition-colors inline-flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Detail Profil</span>
                </button>

                <div className="flex items-center gap-1">
                  {isAdmin && (
                    <>
                      <button
                        type="button"
                        onClick={() => onEditDI(di)}
                        className="p-1.5 text-slate-500 hover:text-amber-700 hover:bg-slate-100 rounded-md transition-colors"
                        title="Ubah Data DI (Sinkronisasi Langsung ke Google Sheet)"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteDI(di.id, di.nama)}
                        className="p-1.5 text-slate-500 hover:text-rose-700 hover:bg-slate-100 rounded-md transition-colors"
                        title="Hapus Data DI (Otomatis Dihapus dari Web & Google Sheet)"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
