import { DaerahIrigasi } from '../types/irigasi';
import { INITIAL_DAERAH_IRIGASI } from '../data/initialData';

const STORAGE_KEY = 'si_irigasi_nagekeo_data_v2';

export const storageService = {
  getData(): DaerahIrigasi[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DAERAH_IRIGASI));
        return INITIAL_DAERAH_IRIGASI;
      }
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DAERAH_IRIGASI));
        return INITIAL_DAERAH_IRIGASI;
      }

      // Merge defaults if bangunanPelengkap is missing from older stored records
      const merged = parsed.map((item) => {
        const foundInitial = INITIAL_DAERAH_IRIGASI.find((d) => d.id === item.id);
        if (!item.bangunanPelengkap && foundInitial?.bangunanPelengkap) {
          return {
            ...item,
            bangunanPelengkap: foundInitial.bangunanPelengkap,
          };
        }
        return item;
      });

      return merged;
    } catch (err) {
      console.error('Gagal membaca data dari localStorage:', err);
      return INITIAL_DAERAH_IRIGASI;
    }
  },

  saveData(data: DaerahIrigasi[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (err) {
      console.error('Gagal menyimpan data ke localStorage:', err);
    }
  },

  addDI(di: DaerahIrigasi): DaerahIrigasi[] {
    const list = this.getData();
    const updated = [di, ...list];
    this.saveData(updated);
    return updated;
  },

  updateDI(di: DaerahIrigasi): DaerahIrigasi[] {
    const list = this.getData();
    const updated = list.map((item) => (item.id === di.id ? di : item));
    this.saveData(updated);
    return updated;
  },

  deleteDI(id: string): DaerahIrigasi[] {
    const list = this.getData();
    const updated = list.filter((item) => item.id !== id);
    this.saveData(updated);
    return updated;
  },

  resetToDefault(): DaerahIrigasi[] {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DAERAH_IRIGASI));
    return INITIAL_DAERAH_IRIGASI;
  },

  exportToJSON(): void {
    const data = this.getData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_database_irigasi_nagekeo_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  },

  exportToCSV(): void {
    const data = this.getData();
    const headers = [
      'Kode DI',
      'Nama Daerah Irigasi',
      'Kecamatan',
      'Desa',
      'Kewenangan',
      'Jenis Irigasi',
      'Sumber Air',
      'Luas Baku (Ha)',
      'Luas Potensial (Ha)',
      'Luas Fungsional (Ha)',
      'Kondisi Fisik',
      'Nilai IKSI (%)',
      'Kategori IKSI',
      'Tipe Bangunan Utama',
      'Nama Bendung/Intake',
      'Bahan Konstruksi',
      'Tipe Mercu',
      'Lebar Mercu (m)',
      'Tinggi Mercu (m)',
      'Elevasi Mercu (m dpl)',
      'Kolam Olak',
      'Pintu Pengambilan (Unit)',
      'Pintu Kuras (Unit)',
      'Kantong Lumpur',
      'Debit (m3/s)',
      'Jembatan Desa/Tani (Unit)',
      'Kubangan Ternak (Unit)',
      'Tangga Cuci Petani (Unit)',
      'Pelimpah Samping (Unit)',
      'Jalan Inspeksi (km)',
      'Perkerasan Jalan',
      'Talang (Unit)',
      'Siphon (Unit)',
      'Gorong-gorong (Unit)',
      'Panjang Primer (m)',
      'Panjang Sekunder (m)',
      'Panjang Tersier (m)',
      'Nama P3A',
      'Nama Ketua P3A',
      'Kontak P3A',
      'Usulan Penanganan',
      'Estimasi Biaya (Rp)',
      'Sumber Dana',
      'Latitude',
      'Longitude',
    ];

    const rows = data.map((d) => [
      `"${d.kodeDI}"`,
      `"${d.nama.replace(/"/g, '""')}"`,
      `"${d.kecamatan}"`,
      `"${d.desa.replace(/"/g, '""')}"`,
      `"${d.kewenangan}"`,
      `"${d.jenisIrigasi}"`,
      `"${d.sumberAir.replace(/"/g, '""')}"`,
      d.luasBaku,
      d.luasPotensial,
      d.luasFungsional,
      `"${d.kondisiFisik}"`,
      d.nilaiIKSI,
      `"${d.kategoriIKSI}"`,
      `"${d.bangunanUtama?.tipe || ''}"`,
      `"${(d.bangunanUtama?.nama || '').replace(/"/g, '""')}"`,
      `"${d.bangunanUtama?.bahanKonstruksi || ''}"`,
      `"${d.bangunanUtama?.tipeMercu || ''}"`,
      d.bangunanUtama?.lebarBendungM || 0,
      d.bangunanUtama?.tinggiMercuM || 0,
      d.bangunanUtama?.elevasiMercuMdpl || 0,
      `"${d.bangunanUtama?.tipeKolamOlak || ''}"`,
      d.bangunanUtama?.jumlahPintuPengambilan || 0,
      d.bangunanUtama?.jumlahPintuKuras || 0,
      d.bangunanUtama?.kantongLumpur ? 'Ya' : 'Tidak',
      d.bangunanUtama?.debitRataRataM3s || 0,
      d.bangunanPelengkap?.jembatanDesaTani?.jumlahUnit || 0,
      d.bangunanPelengkap?.kubanganCuciTernak?.jumlahUnit || 0,
      d.bangunanPelengkap?.tanggaCuciMandiPetani?.jumlahUnit || 0,
      d.bangunanPelengkap?.pelimpahSampingWasteweir?.jumlahUnit || 0,
      d.bangunanPelengkap?.jalanInspeksi?.panjangKm || 0,
      `"${d.bangunanPelengkap?.jalanInspeksi?.jenisPerkerasan || ''}"`,
      d.bangunanPelengkap?.bangunanSilangDetail?.talang || d.jaringanSaluran?.jumlahTalangSiphon || 0,
      d.bangunanPelengkap?.bangunanSilangDetail?.siphon || 0,
      d.bangunanPelengkap?.bangunanSilangDetail?.gorongGorong || d.jaringanSaluran?.jumlahGorongGorong || 0,
      d.jaringanSaluran?.panjangPrimerM || 0,
      d.jaringanSaluran?.panjangSekunderM || 0,
      d.jaringanSaluran?.panjangTersierM || 0,
      `"${(d.dataP3A?.namaP3A || '').replace(/"/g, '""')}"`,
      `"${(d.dataP3A?.namaKetua || '').replace(/"/g, '""')}"`,
      `"${d.dataP3A?.noKontak || ''}"`,
      `"${d.usulanPenanganan?.kategori || ''}"`,
      d.usulanPenanganan?.estimasiBiayaRp || 0,
      `"${d.usulanPenanganan?.sumberDana || ''}"`,
      d.koordinat?.lat || 0,
      d.koordinat?.lng || 0,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(';'), ...rows.map((e) => e.join(';'))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `rekap_data_irigasi_nagekeo_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  importFromJSON(jsonString: string): DaerahIrigasi[] {
    const parsed = JSON.parse(jsonString);
    if (!Array.isArray(parsed)) {
      throw new Error('Format JSON tidak valid: Data harus berupa array.');
    }
    this.saveData(parsed);
    return parsed;
  },
};
