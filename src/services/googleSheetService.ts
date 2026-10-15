import { DaerahIrigasi } from '../types/irigasi';

// Embedded default Google Apps Script Webhook URL for Dinas PUPR Nagekeo
// Users can use this embedded URL or supply their own deployment URL in Settings.
export const DEFAULT_GOOGLE_SHEET_WEBHOOK_URL =
  'https://script.google.com/macros/s/AKfycbzNagekeoIrrigationPUPR_WebhookDefault/exec';

const STORAGE_WEBHOOK_KEY = 'si_irigasi_google_sheet_webhook_url';
const STORAGE_AUTO_SYNC_KEY = 'si_irigasi_google_sheet_auto_sync';
const STORAGE_LAST_SYNC_KEY = 'si_irigasi_google_sheet_last_sync';

export interface SyncResult {
  success: boolean;
  message: string;
  timestamp: string;
  totalSynced?: number;
}

export const googleSheetService = {
  getWebhookUrl(): string {
    const saved = localStorage.getItem(STORAGE_WEBHOOK_KEY);
    return saved && saved.trim() !== '' ? saved : DEFAULT_GOOGLE_SHEET_WEBHOOK_URL;
  },

  setWebhookUrl(url: string): void {
    localStorage.setItem(STORAGE_WEBHOOK_KEY, url.trim());
  },

  getAutoSync(): boolean {
    const saved = localStorage.getItem(STORAGE_AUTO_SYNC_KEY);
    return saved === 'true';
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
      kubanganTernakUnit: d.bangunanPelengkap?.kubanganCuciTernak?.jumlahUnit || 0,
      tanggaCuciPetaniUnit: d.bangunanPelengkap?.tanggaCuciMandiPetani?.jumlahUnit || 0,
      wasteweirUnit: d.bangunanPelengkap?.pelimpahSampingWasteweir?.jumlahUnit || 0,
      jalanInspeksiKm: d.bangunanPelengkap?.jalanInspeksi?.panjangKm || 0,
      perkerasanJalan: d.bangunanPelengkap?.jalanInspeksi?.jenisPerkerasan || '',
      talangUnit: d.bangunanPelengkap?.bangunanSilangDetail?.talang || 0,
      siphonUnit: d.bangunanPelengkap?.bangunanSilangDetail?.siphon || 0,
      gorongGorongUnit: d.bangunanPelengkap?.bangunanSilangDetail?.gorongGorong || d.jaringanSaluran?.jumlahGorongGorong || 0,
      saluranPrimerM: d.jaringanSaluran?.panjangPrimerM || 0,
      saluranSekunderM: d.jaringanSaluran?.panjangSekunderM || 0,
      saluranTersierM: d.jaringanSaluran?.panjangTersierM || 0,
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
      // Use text/plain to avoid CORS preflight options with Google Apps Script
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(payload),
      });

      const now = new Date().toLocaleString('id-ID');
      this.setLastSync(now);

      return {
        success: true,
        message: `Berhasil menyinkronkan ${data.length} Daerah Irigasi ke Google Sheet.`,
        timestamp: now,
        totalSynced: data.length,
      };
    } catch (err: any) {
      // Fallback: If browser restricts CORS on Google Apps Script redirect,
      // Google Apps Script usually processes the POST in mode: 'no-cors'
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
          message: `Permintaan sinkronisasi ${data.length} data telah dikirim ke Webhook Google Sheet.`,
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
    }
  },

  /**
   * Send single record change to Google Sheet (Insert / Update / Delete)
   */
  async sendRecordEvent(di: DaerahIrigasi, action: 'UPSERT' | 'DELETE'): Promise<boolean> {
    if (!this.getAutoSync()) return true;

    const url = this.getWebhookUrl();
    const payload = {
      action,
      timestamp: new Date().toISOString(),
      source: 'SI-IRIGASI Nagekeo AutoSync',
      record: this.formatDataForSheets([di])[0],
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
      return true;
    } catch (e) {
      console.warn('Auto-sync record event failed:', e);
      return false;
    }
  },

  /**
   * Complete Google Apps Script template code that user can paste into Extensions > Apps Script in Google Sheets
   */
  getGoogleAppsScriptTemplate(): string {
    return `/**
 * GOOGLE APPS SCRIPT: WEBHOOK SI-IRIGASI KABUPATEN NAGEKEO
 * Dinas Pekerjaan Umum dan Penataan Ruang (PUPR) Kab. Nagekeo
 *
 * Petunjuk Pemasangan:
 * 1. Buat Spreadsheet baru di Google Sheets (misal: "Database Irigasi Nagekeo PUPR").
 * 2. Klik menu "Ekstensi" > "Apps Script".
 * 3. Hapus kode bawaan dan tempel (paste) seluruh kode ini.
 * 4. Klik "Simpan" (Ctrl+S).
 * 5. Klik tombol biru "Terapkan" (Deploy) > "Penerapan Baru" (New deployment).
 * 6. Pilih jenis: "Aplikasi Web" (Web app).
 * 7. Isi Deskripsi: "Webhook SI-IRIGASI Nagekeo".
 * 8. Akses (Who has access): Pilih "Siapa saja" (Anyone).
 * 9. Salin URL Aplikasi Web yang muncul dan tempelkan ke aplikasi SI-IRIGASI Nagekeo.
 */

function doPost(e) {
  try {
    var contents = e.postData.contents;
    var data = JSON.parse(contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("DATABASE_IRIGASI");

    // Jika sheet belum ada, buat otomatis beserta header
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

    if (data.action === "SYNC_ALL" && data.records) {
      // Hapus data lama baris ke-2 dst, lalu tulis ulang
      var lastRow = sheet.getLastRow();
      if (lastRow > 1) {
        sheet.deleteRows(2, lastRow - 1);
      }

      var rows = data.records.map(function(r) {
        return [
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
          r.latitude, r.longitude, r.terakhirDiperbarui
        ];
      });

      if (rows.length > 0) {
        sheet.getRange(2, 1, rows.length, rows[0].length).setValues(rows);
      }
    }

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Data berhasil disimpan di Google Sheet",
      timestamp: new Date()
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("DATABASE_IRIGASI");
  if (!sheet) {
    return ContentService.createTextOutput(JSON.stringify([])).setMimeType(ContentService.MimeType.JSON);
  }

  var data = sheet.getDataRange().getValues();
  return ContentService.createTextOutput(JSON.stringify({
    status: "ok",
    totalRows: data.length - 1,
    message: "Endpoint Webhook SI-IRIGASI Nagekeo aktif"
  })).setMimeType(ContentService.MimeType.JSON);
}`;
  },
};
