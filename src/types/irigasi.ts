export type KecamatanNagekeo = 
  | 'Aesesa'
  | 'Aesesa Selatan'
  | 'Wolowae'
  | 'Boawae'
  | 'Mauponggo'
  | 'Keo Tengah'
  | 'Nangaroro';

export type KewenanganDI = 'Pusat' | 'Provinsi' | 'Kabupaten';
export type JenisIrigasi = 'Permukaan' | 'Rawa' | 'Air Tanah' | 'Pompa';
export type KondisiFisik = 'Baik' | 'Rusak Ringan' | 'Rusak Sedang' | 'Rusak Berat';
export type KategoriIKSI = 'Sangat Baik' | 'Baik' | 'Kurang' | 'Jelek';
export type KeaktifanIuran = 'Aktif' | 'Kurang Aktif' | 'Tidak Aktif';
export type KategoriUsulan = 'O&P Rutin' | 'O&P Berkala' | 'Rehabilitasi Jaringan' | 'Peningkatan Jaringan';
export type SumberDana = 'APBD Kab. Nagekeo' | 'DAK Irigasi' | 'APBD Prov. NTT' | 'APBN';
export type StatusUsulan = 'Diusulkan' | 'Diverifikasi' | 'Disetujui' | 'Sedang Berjalan' | 'Selesai';
export type TipeBangunanUtama = 'Bendung Tetap' | 'Bendung Gerak' | 'Intake Bebas' | 'Embung' | 'Pompa';

export interface RincianIKSI {
  prasaranaFisik: number; // Max 45
  produktivitasTanam: number; // Max 15
  saranaPenunjang: number; // Max 10
  organisasiPersonalia: number; // Max 15
  dokumentasi: number; // Max 5
  p3a: number; // Max 10
}

export interface BangunanUtama {
  tipe: TipeBangunanUtama;
  nama: string;
  lebarBendungM: number;
  tinggiMercuM: number;
  kondisi: KondisiFisik;
  jumlahPintuPengambilan: number;
  jumlahPintuKuras: number;
  kantongLumpur: boolean;
  debitRataRataM3s: number;
}

export interface JaringanSaluran {
  panjangPrimerM: number;
  kondisiPrimer: KondisiFisik;
  panjangSekunderM: number;
  kondisiSekunder: KondisiFisik;
  panjangTersierM: number;
  kondisiTersier: KondisiFisik;
  jumlahBangunanBagi: number;
  jumlahBangunanSadap: number;
  jumlahBangunanBagiSadap: number;
  jumlahTalangSiphon: number;
  jumlahGorongGorong: number;
}

export interface DataP3A {
  namaP3A: string;
  namaKetua: string;
  noKontak: string;
  statusBadanHukum: boolean;
  jumlahAnggota: number;
  keaktifanIuran: KeaktifanIuran;
}

export interface UsulanPenanganan {
  kategori: KategoriUsulan;
  estimasiBiayaRp: number;
  sumberDana: SumberDana;
  tahunUsulan: number;
  catatanTeknis: string;
  statusUsulan: StatusUsulan;
}

export interface FotoDokumentasi {
  id: string;
  url: string;
  keterangan: string;
  tanggal: string;
  kategori: 'Bangunan Utama' | 'Saluran' | 'Bangunan Bagi/Sadap' | 'Dokumentasi Kerusakan';
}

export interface DaerahIrigasi {
  id: string;
  kodeDI: string;
  nama: string;
  kecamatan: KecamatanNagekeo;
  desa: string;
  kewenangan: KewenanganDI;
  jenisIrigasi: JenisIrigasi;
  sumberAir: string;
  luasBaku: number; // Ha
  luasPotensial: number; // Ha
  luasFungsional: number; // Ha
  tahunPembangunan: number;
  tahunRehabTerakhir?: number;
  koordinat: {
    lat: number;
    lng: number;
  };
  kondisiFisik: KondisiFisik;
  nilaiIKSI: number;
  kategoriIKSI: KategoriIKSI;
  rincianIKSI: RincianIKSI;
  bangunanUtama: BangunanUtama;
  jaringanSaluran: JaringanSaluran;
  dataP3A: DataP3A;
  usulanPenanganan: UsulanPenanganan;
  galeriFoto: FotoDokumentasi[];
  catatanOp?: string;
  updatedAt: string;
}

// Utility to calculate IKSI total and classification according to Permen PUPR No. 12/PRT/M/2015
export function hitungTotalIKSI(rincian: RincianIKSI): { nilai: number; kategori: KategoriIKSI } {
  const total = Number((
    (rincian.prasaranaFisik || 0) +
    (rincian.produktivitasTanam || 0) +
    (rincian.saranaPenunjang || 0) +
    (rincian.organisasiPersonalia || 0) +
    (rincian.dokumentasi || 0) +
    (rincian.p3a || 0)
  ).toFixed(2));

  let kategori: KategoriIKSI = 'Jelek';
  if (total >= 77.5) {
    kategori = 'Sangat Baik';
  } else if (total >= 70) {
    kategori = 'Baik';
  } else if (total >= 55) {
    kategori = 'Kurang';
  } else {
    kategori = 'Jelek';
  }

  return { nilai: total, kategori };
}

export const KECAMATAN_NAGEKEO_LIST: KecamatanNagekeo[] = [
  'Aesesa',
  'Aesesa Selatan',
  'Wolowae',
  'Boawae',
  'Mauponggo',
  'Keo Tengah',
  'Nangaroro',
];
