import { DaerahIrigasi, KecamatanNagekeo, KewenanganDI, JenisIrigasi, KondisiFisik, KategoriIKSI, TipeBangunanUtama } from '../types/irigasi';

// Embedded default Google Spreadsheet View URL and Webhook URL for Dinas PUPR Nagekeo
export const DEFAULT_GOOGLE_SHEET_URL =
  'https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit?usp=sharing';

export const DEFAULT_GOOGLE_SHEET_WEBHOOK_URL =
  'https://script.google.com/macros/s/AKfycbzNagekeoIrrigationPUPR_WebhookDefault/exec';

const STORAGE_SHEET_URL_KEY = 'si_irigasi_google_sheet_view_url';
const STORAGE_WEBHOOK_KEY = 'si_irigasi_google_sheet_webhook_url';
const STORAGE_AUTO_SYNC_KEY = 'si_irigasi_google_sheet_auto_sync';
const STORAGE_LAST_SYNC_KEY = 'si_irigasi_google_sheet_last_sync';

export interface SyncResult {
  success: boolean;
  message: string;
  timestamp: string;
  totalSynced?: number;
}

export const resolveKondisiForUnit = (unitOrPanjang: number, kondisi?: string): KondisiFisik => {
  if (unitOrPanjang <= 0) return 'Tidak Ada';
  if (!kondisi || kondisi === 'Tidak Ada') return 'Baik';
  return kondisi as KondisiFisik;
};

export const parseNumWithZero = (val: any, fallback: number = 0): number => {
  if (val === undefined || val === null || val === '') return fallback;
  const n = Number(val);
  return isNaN(n) ? fallback : n;
};

export const googleSheetService = {
  getSheetUrl(): string {
    const saved = localStorage.getItem(STORAGE_SHEET_URL_KEY);
    if (saved && saved.trim() !== '') return saved;
    const envUrl = (import.meta as any).env?.VITE_GOOGLE_SHEET_URL;
    if (envUrl && envUrl.trim() !== '') return envUrl;
    return DEFAULT_GOOGLE_SHEET_URL;
  },

  setSheetUrl(url: string): void {
    localStorage.setItem(STORAGE_SHEET_URL_KEY, url.trim());
  },

  getWebhookUrl(): string {
    const saved = localStorage.getItem(STORAGE_WEBHOOK_KEY);
    if (saved && saved.trim() !== '') return saved;
    const envUrl = (import.meta as any).env?.VITE_GOOGLE_SHEET_WEBHOOK_URL;
    if (envUrl && envUrl.trim() !== '') return envUrl;
    return DEFAULT_GOOGLE_SHEET_WEBHOOK_URL;
  },

  setWebhookUrl(url: string): void {
    localStorage.setItem(STORAGE_WEBHOOK_KEY, url.trim());
  },

  getAutoSync(): boolean {
    const saved = localStorage.getItem(STORAGE_AUTO_SYNC_KEY);
    // Default to true so Save, Edit, and Delete instantly sync to Google Sheets!
    return saved === null ? true : saved === 'true';
  },

  setAutoSync(enabled: boolean): void {
    localStorage.setItem(STORAGE_AUTO_SYNC_KEY, enabled ? 'true' : 'false');
  },

  getLastSync(): string | null {
    return localStorage.getItem(STORAGE_LAST_SYNC_KEY);
  },

  setLastSync(timestamp: string): void {
    localStorage.setItem(STORAGE_LAST_SYNC_KEY, timestamp);
  },

  formatDataForSheets(data: DaerahIrigasi[]) {
    return data.map((d) => ({
      kodeDI: d.kodeDI,
      namaDI: d.nama,
      kecamatan: d.kecamatan,
      desa: d.desa,
      kewenangan: d.kewenangan,
      jenisIrigasi: d.jenisIrigasi,
      sumberAir: d.sumberAir,
      luasBakuHa: d.luasBaku,
      luasPotensialHa: d.luasPotensial,
      luasFungsionalHa: d.luasFungsional,
      kondisiFisik: d.kondisiFisik,
      nilaiIKSI: d.nilaiIKSI,
      kategoriIKSI: d.kategoriIKSI,
      tipeBangunanUtama: d.bangunanUtama?.tipe || '',
      namaBendungIntake: d.bangunanUtama?.nama || '',
      bahanKonstruksi: d.bangunanUtama?.bahanKonstruksi || '',
      tipeMercu: d.bangunanUtama?.tipeMercu || '',
      lebarMercuM: d.bangunanUtama?.lebarBendungM || 0,
      tinggiMercuM: d.bangunanUtama?.tinggiMercuM || 0,
      elevasiMercuMdpl: d.bangunanUtama?.elevasiMercuMdpl || 0,
      kolamOlak: d.bangunanUtama?.tipeKolamOlak || '',
      pintuPengambilanUnit: d.bangunanUtama?.jumlahPintuPengambilan || 0,
      pintuKurasUnit: d.bangunanUtama?.jumlahPintuKuras || 0,
      kantongLumpur: d.bangunanUtama?.kantongLumpur ? 'Ya' : 'Tidak',
      debitRataRataM3s: d.bangunanUtama?.debitRataRataM3s || 0,
      jembatanDesaTaniUnit: d.bangunanPelengkap?.jembatanDesaTani?.jumlahUnit || 0,
      kondisiJembatanDesaTani: resolveKondisiForUnit(
        d.bangunanPelengkap?.jembatanDesaTani?.jumlahUnit || 0,
        d.bangunanPelengkap?.jembatanDesaTani?.kondisi
      ),
      kubanganTernakUnit: d.bangunanPelengkap?.kubanganCuciTernak?.jumlahUnit || 0,
      kondisiKubanganTernak: resolveKondisiForUnit(
        d.bangunanPelengkap?.kubanganCuciTernak?.jumlahUnit || 0,
        d.bangunanPelengkap?.kubanganCuciTernak?.kondisi
      ),
      tanggaCuciPetaniUnit: d.bangunanPelengkap?.tanggaCuciMandiPetani?.jumlahUnit || 0,
      kondisiTanggaCuciPetani: resolveKondisiForUnit(
        d.bangunanPelengkap?.tanggaCuciMandiPetani?.jumlahUnit || 0,
        d.bangunanPelengkap?.tanggaCuciMandiPetani?.kondisi
      ),
      wasteweirUnit: d.bangunanPelengkap?.pelimpahSampingWasteweir?.jumlahUnit || 0,
      kondisiWasteweir: resolveKondisiForUnit(
        d.bangunanPelengkap?.pelimpahSampingWasteweir?.jumlahUnit || 0,
        d.bangunanPelengkap?.pelimpahSampingWasteweir?.kondisi
      ),
      trashrackUnit: d.bangunanPelengkap?.trashrackSaringanSampah?.jumlahUnit || 0,
      kondisiTrashrack: resolveKondisiForUnit(
        d.bangunanPelengkap?.trashrackSaringanSampah?.jumlahUnit || 0,
        d.bangunanPelengkap?.trashrackSaringanSampah?.kondisi
      ),
      garduJagaUnit: d.bangunanPelengkap?.garduJagaRumahPintu?.jumlahUnit || 0,
      kondisiGarduJaga: resolveKondisiForUnit(
        d.bangunanPelengkap?.garduJagaRumahPintu?.jumlahUnit || 0,
        d.bangunanPelengkap?.garduJagaRumahPintu?.kondisi
      ),
      peilschaalSaluranUnit: d.bangunanPelengkap?.peilschaalSaluran?.jumlahUnit || 0,
      kondisiPeilschaalSaluran: resolveKondisiForUnit(
        d.bangunanPelengkap?.peilschaalSaluran?.jumlahUnit || 0,
        d.bangunanPelengkap?.peilschaalSaluran?.kondisi
      ),
      patokHektometerUnit: d.bangunanPelengkap?.patokHektometerSempadan?.jumlahUnit || 0,
      kondisiPatokHektometer: resolveKondisiForUnit(
        d.bangunanPelengkap?.patokHektometerSempadan?.jumlahUnit || 0,
        d.bangunanPelengkap?.patokHektometerSempadan?.kondisi
      ),
      jalanInspeksiKm: d.bangunanPelengkap?.jalanInspeksi?.panjangKm || 0,
      perkerasanJalan: d.bangunanPelengkap?.jalanInspeksi?.jenisPerkerasan || '',
      kondisiJalanInspeksi: resolveKondisiForUnit(
        d.bangunanPelengkap?.jalanInspeksi?.panjangKm || 0,
        d.bangunanPelengkap?.jalanInspeksi?.kondisi
      ),
      talangUnit: d.bangunanPelengkap?.bangunanSilangDetail?.talang || 0,
      kondisiTalang: resolveKondisiForUnit(
        d.bangunanPelengkap?.bangunanSilangDetail?.talang || 0,
        d.bangunanPelengkap?.bangunanSilangDetail?.kondisiTalang
      ),
      siphonUnit: d.bangunanPelengkap?.bangunanSilangDetail?.siphon || 0,
      kondisiSiphon: resolveKondisiForUnit(
        d.bangunanPelengkap?.bangunanSilangDetail?.siphon || 0,
        d.bangunanPelengkap?.bangunanSilangDetail?.kondisiSiphon
      ),
      gorongGorongUnit: d.bangunanPelengkap?.bangunanSilangDetail?.gorongGorong || d.jaringanSaluran?.jumlahGorongGorong || 0,
      kondisiGorongGorong: resolveKondisiForUnit(
        d.bangunanPelengkap?.bangunanSilangDetail?.gorongGorong || d.jaringanSaluran?.jumlahGorongGorong || 0,
        d.bangunanPelengkap?.bangunanSilangDetail?.kondisiGorongGorong || d.jaringanSaluran?.kondisiGorongGorong
      ),
      terjunanGotMiringUnit: d.bangunanPelengkap?.bangunanSilangDetail?.gotMiringTerjunan || 0,
      kondisiTerjunanGotMiring: resolveKondisiForUnit(
        d.bangunanPelengkap?.bangunanSilangDetail?.gotMiringTerjunan || 0,
        d.bangunanPelengkap?.bangunanSilangDetail?.kondisiGotMiringTerjunan
      ),
      saluranPrimerM: d.jaringanSaluran?.panjangPrimerM || 0,
      kondisiSaluranPrimer: resolveKondisiForUnit(
        d.jaringanSaluran?.panjangPrimerM || 0,
        d.jaringanSaluran?.kondisiPrimer
      ),
      saluranSekunderM: d.jaringanSaluran?.panjangSekunderM || 0,
      kondisiSaluranSekunder: resolveKondisiForUnit(
        d.jaringanSaluran?.panjangSekunderM || 0,
        d.jaringanSaluran?.kondisiSekunder
      ),
      saluranTersierM: d.jaringanSaluran?.panjangTersierM || 0,
      kondisiSaluranTersier: resolveKondisiForUnit(
        d.jaringanSaluran?.panjangTersierM || 0,
        d.jaringanSaluran?.kondisiTersier
      ),
      bangunanBagiUnit: d.jaringanSaluran?.jumlahBangunanBagi || 0,
      kondisiBangunanBagi: resolveKondisiForUnit(
        d.jaringanSaluran?.jumlahBangunanBagi || 0,
        d.jaringanSaluran?.kondisiBangunanBagi
      ),
      bangunanSadapUnit: d.jaringanSaluran?.jumlahBangunanSadap || 0,
      kondisiBangunanSadap: resolveKondisiForUnit(
        d.jaringanSaluran?.jumlahBangunanSadap || 0,
        d.jaringanSaluran?.kondisiBangunanSadap
      ),
      bangunanBagiSadapUnit: d.jaringanSaluran?.jumlahBangunanBagiSadap || 0,
      kondisiBangunanBagiSadap: resolveKondisiForUnit(
        d.jaringanSaluran?.jumlahBangunanBagiSadap || 0,
        d.jaringanSaluran?.kondisiBangunanBagiSadap
      ),
      talangSiphonSaluranUnit: d.jaringanSaluran?.jumlahTalangSiphon || 0,
      kondisiTalangSiphonSaluran: resolveKondisiForUnit(
        d.jaringanSaluran?.jumlahTalangSiphon || 0,
        d.jaringanSaluran?.kondisiTalangSiphon
      ),
      namaP3A: d.dataP3A?.namaP3A || '',
      ketuaP3A: d.dataP3A?.namaKetua || '',
      kontakP3A: d.dataP3A?.noKontak || '',
      usulanPenanganan: d.usulanPenanganan?.kategori || '',
      estimasiBiayaRp: d.usulanPenanganan?.estimasiBiayaRp || 0,
      sumberDana: d.usulanPenanganan?.sumberDana || '',
      latitude: d.koordinat?.lat || 0,
      longitude: d.koordinat?.lng || 0,
      terakhirDiperbarui: d.updatedAt || new Date().toISOString().slice(0, 10),
    }));
  },

  /**
   * Realtime instant single record sync to Google Sheets (CREATE, UPDATE, DELETE, UPSERT)
   * Triggers automatically whenever user clicks Simpan, Edit, or Hapus in the web interface.
   */
  async sendRecordEvent(
    di: DaerahIrigasi,
    action: 'CREATE' | 'UPDATE' | 'DELETE' | 'UPSERT'
  ): Promise<SyncResult> {
    const url = this.getWebhookUrl();
    const formatted = this.formatDataForSheets([di])[0];
    const payload = {
      action: action,
      kodeDI: di.kodeDI,
      namaDI: di.nama,
      timestamp: new Date().toISOString(),
      source: 'SI-IRIGASI Nagekeo Live Webhook',
      record: formatted,
    };

    const actionText =
      action === 'CREATE'
        ? 'ditambahkan ke'
        : action === 'UPDATE'
        ? 'diperbarui di'
        : action === 'UPSERT'
        ? 'disimpan & disinkronkan ke'
        : 'dihapus dari';

    try {
      await fetch(url, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(payload),
      });

      const now = new Date().toLocaleTimeString('id-ID');
      this.setLastSync(now);

      return {
        success: true,
        message: `Data "${di.nama}" (${di.kodeDI}) langsung ${actionText} Google Sheet secara realtime.`,
        timestamp: now,
      };
    } catch (err: any) {
      console.warn('Realtime sync to Google Sheet error:', err);
      return {
        success: false,
        message: `Gagal sinkronisasi ke Google Sheet: ${err.message || 'Koneksi terputus'}`,
        timestamp: new Date().toLocaleTimeString('id-ID'),
      };
    }
  },

  /**
   * Sync all Daerah Irigasi records to Google Sheet via Webhook POST
   */
  async syncAllToGoogleSheet(data: DaerahIrigasi[]): Promise<SyncResult> {
    const url = this.getWebhookUrl();
    const payload = {
      action: 'SYNC_ALL',
      timestamp: new Date().toISOString(),
      source: 'SI-IRIGASI Kabupaten Nagekeo (PUPR)',
      totalRecords: data.length,
      records: this.formatDataForSheets(data),
    };

    try {
      await fetch(url, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(payload),
      });

      const now = new Date().toLocaleString('id-ID');
      this.setLastSync(now);

      return {
        success: true,
        message: `Berhasil menyinkronkan seluruh ${data.length} Daerah Irigasi ke Google Sheet.`,
        timestamp: now,
        totalSynced: data.length,
      };
    } catch (innerErr: any) {
      console.error('Error syncing to Google Sheet:', innerErr);
      return {
        success: false,
        message: `Gagal menghubungkan ke Google Sheet: ${innerErr.message || 'Periksa koneksi atau URL Webhook.'}`,
        timestamp: new Date().toLocaleString('id-ID'),
      };
    }
  },

  /**
   * Pull / Fetch all data from Google Sheet back into Web (Two-Way Sync: Sheet -> Web)
   */
  async fetchFromGoogleSheet(): Promise<{ success: boolean; data?: DaerahIrigasi[]; message: string }> {
    const url = this.getWebhookUrl();
    try {
      const response = await fetch(`${url}?action=GET_ALL&t=${Date.now()}`);
      if (!response.ok) {
        throw new Error(`HTTP Error ${response.status}`);
      }

      const resJson = await response.json();
      if (!resJson || !Array.isArray(resJson.records)) {
        throw new Error('Format data Google Sheet tidak sesuai.');
      }

      const rows = resJson.records;
      const parsedData: DaerahIrigasi[] = rows.map((r: any, idx: number) => ({
        id: r.id || `di-sheet-${idx}-${Date.now()}`,
        kodeDI: r.kodeDI || `DI-53.16.01.${idx + 100}`,
        nama: r.namaDI || 'Daerah Irigasi',
        kecamatan: (r.kecamatan as KecamatanNagekeo) || 'Aesesa',
        desa: r.desa || '',
        kewenangan: (r.kewenangan as KewenanganDI) || 'Kabupaten',
        jenisIrigasi: (r.jenisIrigasi as JenisIrigasi) || 'Permukaan',
        sumberAir: r.sumberAir || '',
        luasBaku: Number(r.luasBakuHa) || 0,
        luasPotensial: Number(r.luasPotensialHa) || 0,
        luasFungsional: Number(r.luasFungsionalHa) || 0,
        tahunPembangunan: Number(r.tahunPembangunan) || 2010,
        koordinat: {
          lat: Number(r.latitude) || -8.67,
          lng: Number(r.longitude) || 121.28,
        },
        kondisiFisik: (r.kondisiFisik as KondisiFisik) || 'Baik',
        nilaiIKSI: Number(r.nilaiIKSI) || 70,
        kategoriIKSI: (r.kategoriIKSI as KategoriIKSI) || 'Baik',
        rincianIKSI: {
          prasaranaFisik: 32,
          produktivitasTanam: 11,
          saranaPenunjang: 7,
          organisasiPersonalia: 11,
          dokumentasi: 3,
          p3a: 6,
        },
        bangunanUtama: {
          tipe: (r.tipeBangunanUtama as TipeBangunanUtama) || 'Bendung Tetap',
          nama: r.namaBendungIntake || 'Bendung',
          lebarBendungM: Number(r.lebarMercuM) || 12,
          tinggiMercuM: Number(r.tinggiMercuM) || 2,
          tipeMercu: r.tipeMercu || 'Ogee',
          bahanKonstruksi: r.bahanKonstruksi || 'Pasangan Batu',
          elevasiMercuMdpl: Number(r.elevasiMercuMdpl) || 50,
          tipeKolamOlak: r.kolamOlak || 'USBR Type II/III',
          kondisi: (r.kondisiFisik as KondisiFisik) || 'Baik',
          jumlahPintuPengambilan: Number(r.pintuPengambilanUnit) || 1,
          jumlahPintuKuras: Number(r.pintuKurasUnit) || 1,
          kantongLumpur: r.kantongLumpur === 'Ya',
          debitRataRataM3s: Number(r.debitRataRataM3s) || 0.5,
        },
        bangunanPelengkap: (() => {
          const jembatanU = parseNumWithZero(r.jembatanDesaTaniUnit, 2);
          const kubanganU = parseNumWithZero(r.kubanganTernakUnit, 1);
          const tanggaU = parseNumWithZero(r.tanggaCuciPetaniUnit, 3);
          const wasteweirU = parseNumWithZero(r.wasteweirUnit, 1);
          const trashrackU = parseNumWithZero(r.trashrackUnit, 1);
          const peilschaalU = parseNumWithZero(r.peilschaalSaluranUnit, 3);
          const patokU = parseNumWithZero(r.patokHektometerUnit, 25);
          const garduU = parseNumWithZero(r.garduJagaUnit, 1);
          const jalanKm = parseNumWithZero(r.jalanInspeksiKm, 3);
          const talangU = parseNumWithZero(r.talangUnit, 1);
          const siphonU = parseNumWithZero(r.siphonUnit, 0);
          const gorongU = parseNumWithZero(r.gorongGorongUnit, 5);
          const terjunanU = parseNumWithZero(r.terjunanGotMiringUnit, 1);

          return {
            jembatanDesaTani: {
              jumlahUnit: jembatanU,
              kondisi: resolveKondisiForUnit(jembatanU, r.kondisiJembatanDesaTani),
            },
            kubanganCuciTernak: {
              jumlahUnit: kubanganU,
              kondisi: resolveKondisiForUnit(kubanganU, r.kondisiKubanganTernak),
            },
            tanggaCuciMandiPetani: {
              jumlahUnit: tanggaU,
              kondisi: resolveKondisiForUnit(tanggaU, r.kondisiTanggaCuciPetani),
            },
            pelimpahSampingWasteweir: {
              jumlahUnit: wasteweirU,
              kondisi: resolveKondisiForUnit(wasteweirU, r.kondisiWasteweir),
            },
            trashrackSaringanSampah: {
              jumlahUnit: trashrackU,
              kondisi: resolveKondisiForUnit(trashrackU, r.kondisiTrashrack),
            },
            peilschaalSaluran: {
              jumlahUnit: peilschaalU,
              kondisi: resolveKondisiForUnit(peilschaalU, r.kondisiPeilschaalSaluran),
            },
            patokHektometerSempadan: {
              jumlahUnit: patokU,
              kondisi: resolveKondisiForUnit(patokU, r.kondisiPatokHektometer),
            },
            garduJagaRumahPintu: {
              jumlahUnit: garduU,
              kondisi: resolveKondisiForUnit(garduU, r.kondisiGarduJaga),
            },
            jalanInspeksi: {
              panjangKm: jalanKm,
              lebarM: parseNumWithZero(r.lebarJalanM, 2.8),
              jenisPerkerasan: (r.perkerasanJalan as any) || 'Rabat Beton',
              kondisi: resolveKondisiForUnit(jalanKm, r.kondisiJalanInspeksi),
            },
            bangunanSilangDetail: {
              talang: talangU,
              kondisiTalang: resolveKondisiForUnit(talangU, r.kondisiTalang),
              siphon: siphonU,
              kondisiSiphon: resolveKondisiForUnit(siphonU, r.kondisiSiphon),
              gorongGorong: gorongU,
              kondisiGorongGorong: resolveKondisiForUnit(gorongU, r.kondisiGorongGorong),
              gotMiringTerjunan: terjunanU,
              kondisiGotMiringTerjunan: resolveKondisiForUnit(terjunanU, r.kondisiTerjunanGotMiring),
            },
          };
        })(),
        jaringanSaluran: (() => {
          const salPrimerM = parseNumWithZero(r.saluranPrimerM, 2000);
          const salSekunderM = parseNumWithZero(r.saluranSekunderM, 3000);
          const salTersierM = parseNumWithZero(r.saluranTersierM, 4000);
          const bBagiU = parseNumWithZero(r.bangunanBagiUnit, 2);
          const bSadapU = parseNumWithZero(r.bangunanSadapUnit, 4);
          const bBagiSadapU = parseNumWithZero(r.bangunanBagiSadapUnit, 2);
          const talangSiphonU = parseNumWithZero(r.talangSiphonSaluranUnit, 1);
          const gorongU = parseNumWithZero(r.gorongGorongUnit, 5);

          return {
            panjangPrimerM: salPrimerM,
            kondisiPrimer: resolveKondisiForUnit(salPrimerM, r.kondisiSaluranPrimer),
            panjangSekunderM: salSekunderM,
            kondisiSekunder: resolveKondisiForUnit(salSekunderM, r.kondisiSaluranSekunder),
            panjangTersierM: salTersierM,
            kondisiTersier: resolveKondisiForUnit(salTersierM, r.kondisiSaluranTersier),
            jumlahBangunanBagi: bBagiU,
            kondisiBangunanBagi: resolveKondisiForUnit(bBagiU, r.kondisiBangunanBagi),
            jumlahBangunanSadap: bSadapU,
            kondisiBangunanSadap: resolveKondisiForUnit(bSadapU, r.kondisiBangunanSadap),
            jumlahBangunanBagiSadap: bBagiSadapU,
            kondisiBangunanBagiSadap: resolveKondisiForUnit(bBagiSadapU, r.kondisiBangunanBagiSadap),
            jumlahTalangSiphon: talangSiphonU,
            kondisiTalangSiphon: resolveKondisiForUnit(talangSiphonU, r.kondisiTalangSiphonSaluran),
            jumlahGorongGorong: gorongU,
            kondisiGorongGorong: resolveKondisiForUnit(gorongU, r.kondisiGorongGorong),
          };
        })(),
        dataP3A: {
          namaP3A: r.namaP3A || '',
          namaKetua: r.ketuaP3A || '',
          noKontak: r.kontakP3A || '',
          statusBadanHukum: true,
          jumlahAnggota: 50,
          keaktifanIuran: 'Aktif',
        },
        usulanPenanganan: {
          kategori: r.usulanPenanganan || 'O&P Rutin',
          estimasiBiayaRp: Number(r.estimasiBiayaRp) || 50000000,
          sumberDana: r.sumberDana || 'APBD Kab. Nagekeo',
          tahunUsulan: 2026,
          catatanTeknis: '',
          statusUsulan: 'Diusulkan',
        },
        galeriFoto: [],
        updatedAt: r.terakhirDiperbarui || new Date().toISOString().slice(0, 10),
      }));

      return {
        success: true,
        data: parsedData,
        message: `Berhasil menarik ${parsedData.length} data terbaru dari Google Sheet!`,
      };
    } catch (err: any) {
      console.warn('Pull from Google Sheet warning:', err);
      return {
        success: false,
        message: `Belum dapat menarik data langsung dari Google Sheet (${err.message || 'CORS / URL belum diaktifkan'}). Gunakan Push Webhook untuk sinkronisasi dua arah.`,
      };
    }
  },

  /**
   * Complete Google Apps Script template code supporting Real-time CREATE, UPDATE, DELETE and GET_ALL
   */
  getGoogleAppsScriptTemplate(): string {
    return `/**
 * GOOGLE APPS SCRIPT: WEBHOOK DUA ARAH (TWO-WAY SYNC)
 * SI-IRIGASI KABUPATEN NAGEKEO - DINAS PUPR
 * 
 * Fitur Otomatis:
 * - Menangani tombol SIMPAN (CREATE / UPDATE baris langsung)
 * - Menangani tombol HAPUS (DELETE baris langsung)
 * - Menangani tombol SINKRONISASI SEMUA (SYNC_ALL)
 * - Menangani TARIK DATA (doGet) untuk sinkronisasi dua arah ke web
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var contents = e.postData.contents;
    var data = JSON.parse(contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("DATABASE_IRIGASI");

    // Jika sheet belum ada, buat otomatis beserta header standar
    if (!sheet) {
      sheet = ss.insertSheet("DATABASE_IRIGASI");
      var headers = [
        "Kode DI", "Nama Daerah Irigasi", "Kecamatan", "Desa", "Kewenangan",
        "Jenis Irigasi", "Sumber Air", "Luas Baku (Ha)", "Luas Potensial (Ha)",
        "Luas Fungsional (Ha)", "Kondisi Fisik", "Nilai IKSI (%)", "Kategori IKSI",
        "Tipe Bangunan Utama", "Nama Bendung/Intake", "Bahan Konstruksi", "Tipe Mercu",
        "Lebar Mercu (m)", "Tinggi Mercu (m)", "Elevasi Mercu (m dpl)", "Kolam Olak",
        "Pintu Pengambilan (Unit)", "Pintu Kuras (Unit)", "Kantong Lumpur", "Debit (m3/s)",
        "Jembatan Desa/Tani (Unit)", "Kubangan Ternak (Unit)", "Tangga Cuci Petani (Unit)",
        "Wasteweir (Unit)", "Jalan Inspeksi (Km)", "Perkerasan Jalan", "Talang (Unit)",
        "Siphon (Unit)", "Gorong-gorong (Unit)", "Saluran Primer (m)", "Saluran Sekunder (m)",
        "Saluran Tersier (m)", "Nama P3A", "Ketua P3A", "Kontak P3A",
        "Usulan Penanganan", "Estimasi Biaya (Rp)", "Sumber Dana",
        "Latitude", "Longitude", "Terakhir Diperbarui"
      ];
      sheet.appendRow(headers);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#F1F5F9");
      sheet.setFrozenRows(1);
    }

    var action = data.action;
    var targetKode = data.kodeDI || (data.record && data.record.kodeDI);

    // 1. AKSI SIMPAN / EDIT LANGSUNG (CREATE / UPDATE / UPSERT)
    if (action === "CREATE" || action === "UPDATE" || action === "UPSERT") {
      var r = data.record;
      var rowValues = [
        r.kodeDI, r.namaDI, r.kecamatan, r.desa, r.kewenangan,
        r.jenisIrigasi, r.sumberAir, r.luasBakuHa, r.luasPotensialHa,
        r.luasFungsionalHa, r.kondisiFisik, r.nilaiIKSI, r.kategoriIKSI,
        r.tipeBangunanUtama, r.namaBendungIntake, r.bahanKonstruksi, r.tipeMercu,
        r.lebarMercuM, r.tinggiMercuM, r.elevasiMercuMdpl, r.kolamOlak,
        r.pintuPengambilanUnit, r.pintuKurasUnit, r.kantongLumpur, r.debitRataRataM3s,
        r.jembatanDesaTaniUnit, r.kubanganTernakUnit, r.tanggaCuciPetaniUnit,
        r.wasteweirUnit, r.jalanInspeksiKm, r.perkerasanJalan, r.talangUnit,
        r.siphonUnit, r.gorongGorongUnit, r.saluranPrimerM, r.saluranSekunderM,
        r.saluranTersierM, r.namaP3A, r.ketuaP3A, r.kontakP3A,
        r.usulanPenanganan, r.estimasiBiayaRp, r.sumberDana,
        r.latitude, r.longitude, r.terakhirDiperbarui || new Date().toISOString().slice(0, 10)
      ];

      var lastRow = sheet.getLastRow();
      var foundRow = -1;

      // Cari apakah baris dengan Kode DI ini sudah ada
      if (lastRow > 1) {
        var kodeList = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
        for (var i = 0; i < kodeList.length; i++) {
          if (String(kodeList[i][0]).trim() === String(targetKode).trim()) {
            foundRow = i + 2; // offset baris (1-indexed + header)
            break;
          }
        }
      }

      if (foundRow > 0) {
        // Update baris yang sudah ada (Dua Arah: Web Edit -> Sheet Update)
        sheet.getRange(foundRow, 1, 1, rowValues.length).setValues([rowValues]);
      } else {
        // Tambah baris baru (Dua Arah: Web Tambah -> Sheet Insert)
        sheet.appendRow(rowValues);
      }
    }

    // 2. AKSI HAPUS LANGSUNG (DELETE: Web Hapus -> Sheet Delete Row)
    else if (action === "DELETE") {
      var lastRowDel = sheet.getLastRow();
      if (lastRowDel > 1) {
        var kodeListDel = sheet.getRange(2, 1, lastRowDel - 1, 1).getValues();
        for (var j = 0; j < kodeListDel.length; j++) {
          if (String(kodeListDel[j][0]).trim() === String(targetKode).trim()) {
            sheet.deleteRow(j + 2);
            break;
          }
        }
      }
    }

    // 3. AKSI SYNC_ALL (Kirim Semua Sekaligus)
    else if (action === "SYNC_ALL" && data.records) {
      var totalExisting = sheet.getLastRow();
      if (totalExisting > 1) {
        sheet.deleteRows(2, totalExisting - 1);
      }

      var rows = data.records.map(function(item) {
        return [
          item.kodeDI, item.namaDI, item.kecamatan, item.desa, item.kewenangan,
          item.jenisIrigasi, item.sumberAir, item.luasBakuHa, item.luasPotensialHa,
          item.luasFungsionalHa, item.kondisiFisik, item.nilaiIKSI, item.kategoriIKSI,
          item.tipeBangunanUtama, item.namaBendungIntake, item.bahanKonstruksi, item.tipeMercu,
          item.lebarMercuM, item.tinggiMercuM, item.elevasiMercuMdpl, item.kolamOlak,
          item.pintuPengambilanUnit, item.pintuKurasUnit, item.kantongLumpur, item.debitRataRataM3s,
          item.jembatanDesaTaniUnit, item.kubanganTernakUnit, item.tanggaCuciPetaniUnit,
          item.wasteweirUnit, item.jalanInspeksiKm, item.perkerasanJalan, item.talangUnit,
          item.siphonUnit, item.gorongGorongUnit, item.saluranPrimerM, item.saluranSekunderM,
          item.saluranTersierM, item.namaP3A, item.ketuaP3A, item.kontakP3A,
          item.usulanPenanganan, item.estimasiBiayaRp, item.sumberDana,
          item.latitude, item.longitude, item.terakhirDiperbarui
        ];
      });

      if (rows.length > 0) {
        sheet.getRange(2, 1, rows.length, rows[0].length).setValues(rows);
      }
    }

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      action: action,
      kodeDI: data.kodeDI || "ALL",
      timestamp: new Date()
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("DATABASE_IRIGASI");
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify({ records: [] }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    var values = sheet.getDataRange().getValues();
    if (values.length <= 1) {
      return ContentService.createTextOutput(JSON.stringify({ records: [] }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    var records = [];
    for (var i = 1; i < values.length; i++) {
      var row = values[i];
      records.push({
        kodeDI: row[0],
        namaDI: row[1],
        kecamatan: row[2],
        desa: row[3],
        kewenangan: row[4],
        jenisIrigasi: row[5],
        sumberAir: row[6],
        luasBakuHa: row[7],
        luasPotensialHa: row[8],
        luasFungsionalHa: row[9],
        kondisiFisik: row[10],
        nilaiIKSI: row[11],
        kategoriIKSI: row[12],
        tipeBangunanUtama: row[13],
        namaBendungIntake: row[14],
        bahanKonstruksi: row[15],
        tipeMercu: row[16],
        lebarMercuM: row[17],
        tinggiMercuM: row[18],
        elevasiMercuMdpl: row[19],
        kolamOlak: row[20],
        pintuPengambilanUnit: row[21],
        pintuKurasUnit: row[22],
        kantongLumpur: row[23],
        debitRataRataM3s: row[24],
        jembatanDesaTaniUnit: row[25],
        kubanganTernakUnit: row[26],
        tanggaCuciPetaniUnit: row[27],
        wasteweirUnit: row[28],
        jalanInspeksiKm: row[29],
        perkerasanJalan: row[30],
        talangUnit: row[31],
        siphonUnit: row[32],
        gorongGorongUnit: row[33],
        saluranPrimerM: row[34],
        saluranSekunderM: row[35],
        saluranTersierM: row[36],
        namaP3A: row[37],
        ketuaP3A: row[38],
        kontakP3A: row[39],
        usulanPenanganan: row[40],
        estimasiBiayaRp: row[41],
        sumberDana: row[42],
        latitude: row[43],
        longitude: row[44],
        terakhirDiperbarui: row[45]
      });
    }

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      totalRecords: records.length,
      records: records
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}`;
  },
};
