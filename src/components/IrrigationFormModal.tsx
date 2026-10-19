import React, { useState, useEffect } from 'react';
import { 
  DaerahIrigasi, 
  KecamatanNagekeo, 
  KECAMATAN_NAGEKEO_LIST,
  KewenanganDI,
  JenisIrigasi,
  KondisiFisik,
  TipeBangunanUtama,
  BangunanPelengkap,
  JaringanSaluran,
  KategoriUsulan,
  SumberDana,
  StatusUsulan,
  KeaktifanIuran,
  hitungTotalIKSI
} from '../types/irigasi';
import { getDaftarDesa } from '../data/wilayahNagekeo';
import { X, Save, Building, Layers, Zap, CheckCircle2, Table, MapPin } from 'lucide-react';

interface IrrigationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (di: DaerahIrigasi) => void;
  initialData?: DaerahIrigasi | null;
}

export const IrrigationFormModal: React.FC<IrrigationFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [formData, setFormData] = useState<Partial<DaerahIrigasi>>({
    nama: '',
    kodeDI: `DI-53.16.01.${Math.floor(100 + Math.random() * 900)}`,
    kecamatan: 'Aesesa',
    desa: '',
    kewenangan: 'Kabupaten',
    jenisIrigasi: 'Permukaan',
    sumberAir: 'Sungai Aesesa',
    luasBaku: 200,
    luasPotensial: 200,
    luasFungsional: 180,
    tahunPembangunan: 2010,
    tahunRehabTerakhir: 2022,
    koordinat: { lat: -8.67, lng: 121.28 },
    kondisiFisik: 'Baik',
    nilaiIKSI: 75.0,
    kategoriIKSI: 'Baik',
    rincianIKSI: {
      prasaranaFisik: 34.0,
      produktivitasTanam: 12.0,
      saranaPenunjang: 7.5,
      organisasiPersonalia: 11.0,
      dokumentasi: 3.5,
      p3a: 7.0,
    },
    bangunanUtama: {
      tipe: 'Bendung Tetap',
      nama: 'Bendung',
      lebarBendungM: 12.0,
      tinggiMercuM: 2.2,
      tipeMercu: 'Ogee',
      bahanKonstruksi: 'Pasangan Batu',
      elevasiMercuMdpl: 50.0,
      tipeKolamOlak: 'USBR Type II/III',
      kondisi: 'Baik',
      jumlahPintuPengambilan: 1,
      tipePintuPengambilan: 'Stang Ulir Ganda',
      jumlahPintuKuras: 1,
      tipePintuKuras: 'Sorong Baja',
      kantongLumpur: true,
      volumeKantongLumpurM3: 300,
      papanDugaPeilschaal: true,
      jembatanPelayanBendung: true,
      debitRataRataM3s: 0.6,
    },
    bangunanPelengkap: {
      jembatanDesaTani: { jumlahUnit: 3, kondisi: 'Baik' },
      kubanganCuciTernak: { jumlahUnit: 1, kondisi: 'Baik' },
      tanggaCuciMandiPetani: { jumlahUnit: 4, kondisi: 'Baik' },
      pelimpahSampingWasteweir: { jumlahUnit: 1, kondisi: 'Baik' },
      trashrackSaringanSampah: { jumlahUnit: 1, kondisi: 'Baik' },
      peilschaalSaluran: { jumlahUnit: 3, kondisi: 'Baik' },
      patokHektometerSempadan: { jumlahUnit: 30, kondisi: 'Baik' },
      garduJagaRumahPintu: { jumlahUnit: 1, kondisi: 'Baik' },
      jalanInspeksi: {
        panjangKm: 3.0,
        lebarM: 2.8,
        jenisPerkerasan: 'Rabat Beton',
        kondisi: 'Baik',
      },
      bangunanSilangDetail: {
        talang: 1,
        siphon: 0,
        gorongGorong: 6,
        gotMiringTerjunan: 2,
      },
    },
    jaringanSaluran: {
      panjangPrimerM: 3000,
      kondisiPrimer: 'Baik',
      panjangSekunderM: 4500,
      kondisiSekunder: 'Baik',
      panjangTersierM: 6000,
      kondisiTersier: 'Rusak Ringan',
      jumlahBangunanBagi: 2,
      jumlahBangunanSadap: 4,
      jumlahBangunanBagiSadap: 2,
      jumlahTalangSiphon: 1,
      jumlahGorongGorong: 6,
    },
    dataP3A: {
      namaP3A: 'P3A',
      namaKetua: '',
      noKontak: '',
      statusBadanHukum: true,
      jumlahAnggota: 60,
      keaktifanIuran: 'Aktif',
    },
    usulanPenanganan: {
      kategori: 'O&P Rutin',
      estimasiBiayaRp: 80000000,
      sumberDana: 'APBD Kab. Nagekeo',
      tahunUsulan: 2026,
      catatanTeknis: '',
      statusUsulan: 'Diusulkan',
    },
    galeriFoto: [],
    catatanOp: '',
  });

  const [formSection, setFormSection] = useState<'umum' | 'bangunan-utama' | 'bangunan-pelengkap' | 'saluran' | 'iksi' | 'p3a' | 'usulan'>('umum');
  const [isCustomDesa, setIsCustomDesa] = useState(false);

  useEffect(() => {
    if (initialData) {
      const cloned = JSON.parse(JSON.stringify(initialData)) as DaerahIrigasi;
      if (cloned.bangunanPelengkap) {
        const bp = cloned.bangunanPelengkap;
        if (bp.jembatanDesaTani && bp.jembatanDesaTani.jumlahUnit <= 0) bp.jembatanDesaTani.kondisi = 'Tidak Ada';
        if (bp.kubanganCuciTernak && bp.kubanganCuciTernak.jumlahUnit <= 0) bp.kubanganCuciTernak.kondisi = 'Tidak Ada';
        if (bp.tanggaCuciMandiPetani && bp.tanggaCuciMandiPetani.jumlahUnit <= 0) bp.tanggaCuciMandiPetani.kondisi = 'Tidak Ada';
        if (bp.pelimpahSampingWasteweir && bp.pelimpahSampingWasteweir.jumlahUnit <= 0) bp.pelimpahSampingWasteweir.kondisi = 'Tidak Ada';
        if (bp.trashrackSaringanSampah && bp.trashrackSaringanSampah.jumlahUnit <= 0) bp.trashrackSaringanSampah.kondisi = 'Tidak Ada';
        if (bp.garduJagaRumahPintu && bp.garduJagaRumahPintu.jumlahUnit <= 0) bp.garduJagaRumahPintu.kondisi = 'Tidak Ada';
        if (bp.peilschaalSaluran && bp.peilschaalSaluran.jumlahUnit <= 0) bp.peilschaalSaluran.kondisi = 'Tidak Ada';
        if (bp.patokHektometerSempadan && bp.patokHektometerSempadan.jumlahUnit <= 0) bp.patokHektometerSempadan.kondisi = 'Tidak Ada';
        if (bp.jalanInspeksi && (bp.jalanInspeksi.panjangKm || 0) <= 0) bp.jalanInspeksi.kondisi = 'Tidak Ada';
        if (bp.bangunanSilangDetail) {
          if ((bp.bangunanSilangDetail.talang || 0) <= 0) bp.bangunanSilangDetail.kondisiTalang = 'Tidak Ada';
          if ((bp.bangunanSilangDetail.siphon || 0) <= 0) bp.bangunanSilangDetail.kondisiSiphon = 'Tidak Ada';
          if ((bp.bangunanSilangDetail.gorongGorong || 0) <= 0) bp.bangunanSilangDetail.kondisiGorongGorong = 'Tidak Ada';
          if ((bp.bangunanSilangDetail.gotMiringTerjunan || 0) <= 0) bp.bangunanSilangDetail.kondisiGotMiringTerjunan = 'Tidak Ada';
        }
      }
      if (cloned.jaringanSaluran) {
        const js = cloned.jaringanSaluran;
        if ((js.panjangPrimerM || 0) <= 0) js.kondisiPrimer = 'Tidak Ada';
        if ((js.panjangSekunderM || 0) <= 0) js.kondisiSekunder = 'Tidak Ada';
        if ((js.panjangTersierM || 0) <= 0) js.kondisiTersier = 'Tidak Ada';
        if ((js.jumlahBangunanBagi || 0) <= 0) js.kondisiBangunanBagi = 'Tidak Ada';
        if ((js.jumlahBangunanSadap || 0) <= 0) js.kondisiBangunanSadap = 'Tidak Ada';
        if ((js.jumlahBangunanBagiSadap || 0) <= 0) js.kondisiBangunanBagiSadap = 'Tidak Ada';
        if ((js.jumlahGorongGorong || 0) <= 0) js.kondisiGorongGorong = 'Tidak Ada';
        if ((js.jumlahTalangSiphon || 0) <= 0) js.kondisiTalangSiphon = 'Tidak Ada';
      }
      setFormData(cloned);
      setIsCustomDesa(false);
    } else {
      setFormData({
        id: `di-${Date.now()}`,
        nama: '',
        kodeDI: `DI-53.16.0${Math.floor(1 + Math.random() * 7)}.${Math.floor(100 + Math.random() * 900)}`,
        kecamatan: 'Aesesa',
        desa: '',
        kewenangan: 'Kabupaten',
        jenisIrigasi: 'Permukaan',
        sumberAir: '',
        luasBaku: 250,
        luasPotensial: 250,
        luasFungsional: 200,
        tahunPembangunan: 2012,
        koordinat: { lat: -8.67, lng: 121.28 },
        kondisiFisik: 'Baik',
        nilaiIKSI: 75.0,
        kategoriIKSI: 'Baik',
        rincianIKSI: {
          prasaranaFisik: 34.0,
          produktivitasTanam: 12.0,
          saranaPenunjang: 7.5,
          organisasiPersonalia: 11.0,
          dokumentasi: 3.5,
          p3a: 7.0,
        },
        bangunanUtama: {
          tipe: 'Bendung Tetap',
          nama: '',
          lebarBendungM: 12.0,
          tinggiMercuM: 2.0,
          tipeMercu: 'Ogee',
          bahanKonstruksi: 'Pasangan Batu',
          elevasiMercuMdpl: 50.0,
          tipeKolamOlak: 'USBR Type II/III',
          kondisi: 'Baik',
          jumlahPintuPengambilan: 1,
          tipePintuPengambilan: 'Stang Ulir Ganda',
          jumlahPintuKuras: 1,
          tipePintuKuras: 'Sorong Baja',
          kantongLumpur: true,
          volumeKantongLumpurM3: 300,
          papanDugaPeilschaal: true,
          jembatanPelayanBendung: true,
          debitRataRataM3s: 0.5,
        },
        bangunanPelengkap: {
          jembatanDesaTani: { jumlahUnit: 3, kondisi: 'Baik' },
          kubanganCuciTernak: { jumlahUnit: 1, kondisi: 'Baik' },
          tanggaCuciMandiPetani: { jumlahUnit: 4, kondisi: 'Baik' },
          pelimpahSampingWasteweir: { jumlahUnit: 1, kondisi: 'Baik' },
          trashrackSaringanSampah: { jumlahUnit: 1, kondisi: 'Baik' },
          peilschaalSaluran: { jumlahUnit: 3, kondisi: 'Baik' },
          patokHektometerSempadan: { jumlahUnit: 30, kondisi: 'Baik' },
          garduJagaRumahPintu: { jumlahUnit: 1, kondisi: 'Baik' },
          jalanInspeksi: {
            panjangKm: 3.0,
            lebarM: 2.8,
            jenisPerkerasan: 'Rabat Beton',
            kondisi: 'Baik',
          },
          bangunanSilangDetail: {
            talang: 1,
            kondisiTalang: 'Baik',
            siphon: 0,
            kondisiSiphon: 'Tidak Ada',
            gorongGorong: 6,
            kondisiGorongGorong: 'Baik',
            gotMiringTerjunan: 2,
            kondisiGotMiringTerjunan: 'Baik',
          },
        },
        jaringanSaluran: {
          panjangPrimerM: 2500,
          kondisiPrimer: 'Baik',
          panjangSekunderM: 3500,
          kondisiSekunder: 'Baik',
          panjangTersierM: 5000,
          kondisiTersier: 'Rusak Ringan',
          jumlahBangunanBagi: 2,
          kondisiBangunanBagi: 'Baik',
          jumlahBangunanSadap: 4,
          kondisiBangunanSadap: 'Baik',
          jumlahBangunanBagiSadap: 2,
          kondisiBangunanBagiSadap: 'Baik',
          jumlahTalangSiphon: 1,
          kondisiTalangSiphon: 'Baik',
          jumlahGorongGorong: 5,
          kondisiGorongGorong: 'Baik',
        },
        dataP3A: {
          namaP3A: '',
          namaKetua: '',
          noKontak: '',
          statusBadanHukum: true,
          jumlahAnggota: 50,
          keaktifanIuran: 'Aktif',
        },
        usulanPenanganan: {
          kategori: 'O&P Rutin',
          estimasiBiayaRp: 75000000,
          sumberDana: 'APBD Kab. Nagekeo',
          tahunUsulan: 2026,
          catatanTeknis: '',
          statusUsulan: 'Diusulkan',
        },
        galeriFoto: [],
        catatanOp: '',
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  // Helper otomatis: jika unit <= 0 maka kondisi otomatis 'Tidak Ada'.
  // Jika unit > 0 dan sebelumnya 'Tidak Ada', otomatis 'Baik'.
  const autoKondisiForUnit = (unit: number, currentKondisi?: KondisiFisik): KondisiFisik => {
    if (unit <= 0) return 'Tidak Ada';
    if (!currentKondisi || currentKondisi === 'Tidak Ada') return 'Baik';
    return currentKondisi;
  };

  const getDisplayKondisi = (unit: number, currentKondisi?: KondisiFisik): KondisiFisik => {
    if (unit <= 0) return 'Tidak Ada';
    if (!currentKondisi || currentKondisi === 'Tidak Ada') return 'Baik';
    return currentKondisi;
  };

  const handleKecamatanChange = (newKec: KecamatanNagekeo) => {
    const listDesa = getDaftarDesa(newKec);
    setFormData((prev) => ({
      ...prev,
      kecamatan: newKec,
      desa: listDesa.includes(prev.desa || '') ? prev.desa : '',
    }));
    setIsCustomDesa(false);
  };

  const handleIksiSubChange = (field: keyof DaerahIrigasi['rincianIKSI'], val: number) => {
    const updatedRincian = {
      ...(formData.rincianIKSI || {
        prasaranaFisik: 0,
        produktivitasTanam: 0,
        saranaPenunjang: 0,
        organisasiPersonalia: 0,
        dokumentasi: 0,
        p3a: 0,
      }),
      [field]: val,
    };

    const calc = hitungTotalIKSI(updatedRincian);

    setFormData({
      ...formData,
      rincianIKSI: updatedRincian,
      nilaiIKSI: calc.nilai,
      kategoriIKSI: calc.kategori,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama) {
      alert('Nama Daerah Irigasi wajib diisi.');
      return;
    }

    const sanitizeBp = (b?: BangunanPelengkap): BangunanPelengkap => {
      const defBp: BangunanPelengkap = b || {
        jembatanDesaTani: { jumlahUnit: 2, kondisi: 'Baik' },
        kubanganCuciTernak: { jumlahUnit: 1, kondisi: 'Baik' },
        tanggaCuciMandiPetani: { jumlahUnit: 3, kondisi: 'Baik' },
        pelimpahSampingWasteweir: { jumlahUnit: 1, kondisi: 'Baik' },
        trashrackSaringanSampah: { jumlahUnit: 1, kondisi: 'Baik' },
        peilschaalSaluran: { jumlahUnit: 2, kondisi: 'Baik' },
        patokHektometerSempadan: { jumlahUnit: 20, kondisi: 'Baik' },
        garduJagaRumahPintu: { jumlahUnit: 1, kondisi: 'Baik' },
        jalanInspeksi: {
          panjangKm: 2.5,
          lebarM: 2.8,
          jenisPerkerasan: 'Rabat Beton',
          kondisi: 'Baik',
        },
        bangunanSilangDetail: {
          talang: 1,
          kondisiTalang: 'Baik',
          siphon: 0,
          kondisiSiphon: 'Tidak Ada',
          gorongGorong: 5,
          kondisiGorongGorong: 'Baik',
          gotMiringTerjunan: 1,
          kondisiGotMiringTerjunan: 'Baik',
        },
      };

      const res = JSON.parse(JSON.stringify(defBp)) as BangunanPelengkap;
      const fixK = (unit: number, k?: KondisiFisik): KondisiFisik => {
        if (unit <= 0) return 'Tidak Ada';
        if (!k || k === 'Tidak Ada') return 'Baik';
        return k;
      };

      if (res.jembatanDesaTani) res.jembatanDesaTani.kondisi = fixK(res.jembatanDesaTani.jumlahUnit || 0, res.jembatanDesaTani.kondisi);
      if (res.kubanganCuciTernak) res.kubanganCuciTernak.kondisi = fixK(res.kubanganCuciTernak.jumlahUnit || 0, res.kubanganCuciTernak.kondisi);
      if (res.tanggaCuciMandiPetani) res.tanggaCuciMandiPetani.kondisi = fixK(res.tanggaCuciMandiPetani.jumlahUnit || 0, res.tanggaCuciMandiPetani.kondisi);
      if (res.pelimpahSampingWasteweir) res.pelimpahSampingWasteweir.kondisi = fixK(res.pelimpahSampingWasteweir.jumlahUnit || 0, res.pelimpahSampingWasteweir.kondisi);
      if (res.trashrackSaringanSampah) res.trashrackSaringanSampah.kondisi = fixK(res.trashrackSaringanSampah.jumlahUnit || 0, res.trashrackSaringanSampah.kondisi);
      if (res.garduJagaRumahPintu) res.garduJagaRumahPintu.kondisi = fixK(res.garduJagaRumahPintu.jumlahUnit || 0, res.garduJagaRumahPintu.kondisi);
      if (res.peilschaalSaluran) res.peilschaalSaluran.kondisi = fixK(res.peilschaalSaluran.jumlahUnit || 0, res.peilschaalSaluran.kondisi);
      if (res.patokHektometerSempadan) res.patokHektometerSempadan.kondisi = fixK(res.patokHektometerSempadan.jumlahUnit || 0, res.patokHektometerSempadan.kondisi);
      if (res.jalanInspeksi) res.jalanInspeksi.kondisi = fixK(res.jalanInspeksi.panjangKm || 0, res.jalanInspeksi.kondisi);
      if (res.bangunanSilangDetail) {
        res.bangunanSilangDetail.kondisiTalang = fixK(res.bangunanSilangDetail.talang || 0, res.bangunanSilangDetail.kondisiTalang);
        res.bangunanSilangDetail.kondisiSiphon = fixK(res.bangunanSilangDetail.siphon || 0, res.bangunanSilangDetail.kondisiSiphon);
        res.bangunanSilangDetail.kondisiGorongGorong = fixK(res.bangunanSilangDetail.gorongGorong || 0, res.bangunanSilangDetail.kondisiGorongGorong);
        res.bangunanSilangDetail.kondisiGotMiringTerjunan = fixK(res.bangunanSilangDetail.gotMiringTerjunan || 0, res.bangunanSilangDetail.kondisiGotMiringTerjunan);
      }
      return res;
    };

    const sanitizeJs = (j?: JaringanSaluran): JaringanSaluran => {
      const defJs: JaringanSaluran = j || {
        panjangPrimerM: 2000,
        kondisiPrimer: 'Baik',
        panjangSekunderM: 3000,
        kondisiSekunder: 'Baik',
        panjangTersierM: 4000,
        kondisiTersier: 'Rusak Ringan',
        jumlahBangunanBagi: 2,
        kondisiBangunanBagi: 'Baik',
        jumlahBangunanSadap: 4,
        kondisiBangunanSadap: 'Baik',
        jumlahBangunanBagiSadap: 2,
        kondisiBangunanBagiSadap: 'Baik',
        jumlahTalangSiphon: 1,
        kondisiTalangSiphon: 'Baik',
        jumlahGorongGorong: 5,
        kondisiGorongGorong: 'Baik',
      };

      const res = JSON.parse(JSON.stringify(defJs)) as JaringanSaluran;
      const fixK = (unit: number, k?: KondisiFisik): KondisiFisik => {
        if (unit <= 0) return 'Tidak Ada';
        if (!k || k === 'Tidak Ada') return 'Baik';
        return k;
      };

      res.kondisiPrimer = fixK(res.panjangPrimerM || 0, res.kondisiPrimer);
      res.kondisiSekunder = fixK(res.panjangSekunderM || 0, res.kondisiSekunder);
      res.kondisiTersier = fixK(res.panjangTersierM || 0, res.kondisiTersier);
      res.kondisiBangunanBagi = fixK(res.jumlahBangunanBagi || 0, res.kondisiBangunanBagi);
      res.kondisiBangunanSadap = fixK(res.jumlahBangunanSadap || 0, res.kondisiBangunanSadap);
      res.kondisiBangunanBagiSadap = fixK(res.jumlahBangunanBagiSadap || 0, res.kondisiBangunanBagiSadap);
      res.kondisiTalangSiphon = fixK(res.jumlahTalangSiphon || 0, res.kondisiTalangSiphon);
      res.kondisiGorongGorong = fixK(res.jumlahGorongGorong || 0, res.kondisiGorongGorong);
      return res;
    };

    const finalDI: DaerahIrigasi = {
      id: formData.id || `di-${Date.now()}`,
      kodeDI: formData.kodeDI || `DI-53.16.01.${Math.floor(100 + Math.random() * 900)}`,
      nama: formData.nama,
      kecamatan: (formData.kecamatan as KecamatanNagekeo) || 'Aesesa',
      desa: formData.desa || '',
      kewenangan: (formData.kewenangan as KewenanganDI) || 'Kabupaten',
      jenisIrigasi: (formData.jenisIrigasi as JenisIrigasi) || 'Permukaan',
      sumberAir: formData.sumberAir || 'Sungai Aesesa',
      luasBaku: Number(formData.luasBaku) || 0,
      luasPotensial: Number(formData.luasPotensial) || 0,
      luasFungsional: Number(formData.luasFungsional) || 0,
      tahunPembangunan: Number(formData.tahunPembangunan) || 2010,
      tahunRehabTerakhir: formData.tahunRehabTerakhir ? Number(formData.tahunRehabTerakhir) : undefined,
      koordinat: {
        lat: Number(formData.koordinat?.lat) || -8.67,
        lng: Number(formData.koordinat?.lng) || 121.28,
      },
      kondisiFisik: (formData.kondisiFisik as KondisiFisik) || 'Baik',
      nilaiIKSI: Number(formData.nilaiIKSI) || 70,
      kategoriIKSI: formData.kategoriIKSI || 'Baik',
      rincianIKSI: formData.rincianIKSI || {
        prasaranaFisik: 30,
        produktivitasTanam: 10,
        saranaPenunjang: 7,
        organisasiPersonalia: 10,
        dokumentasi: 3,
        p3a: 7,
      },
      bangunanUtama: formData.bangunanUtama || {
        tipe: 'Bendung Tetap',
        nama: 'Bendung',
        lebarBendungM: 10,
        tinggiMercuM: 2,
        tipeMercu: 'Ogee',
        bahanKonstruksi: 'Pasangan Batu',
        kondisi: 'Baik',
        jumlahPintuPengambilan: 1,
        jumlahPintuKuras: 1,
        kantongLumpur: true,
        debitRataRataM3s: 0.5,
      },
      bangunanPelengkap: sanitizeBp(formData.bangunanPelengkap),
      jaringanSaluran: sanitizeJs(formData.jaringanSaluran),
      dataP3A: formData.dataP3A || {
        namaP3A: '',
        namaKetua: '',
        noKontak: '',
        statusBadanHukum: false,
        jumlahAnggota: 0,
        keaktifanIuran: 'Kurang Aktif',
      },
      usulanPenanganan: formData.usulanPenanganan || {
        kategori: 'O&P Rutin',
        estimasiBiayaRp: 50000000,
        sumberDana: 'APBD Kab. Nagekeo',
        tahunUsulan: 2026,
        catatanTeknis: '',
        statusUsulan: 'Diusulkan',
      },
      galeriFoto: formData.galeriFoto || [],
      catatanOp: formData.catatanOp,
      isPublished: formData.isPublished ?? true,
      updatedAt: new Date().toISOString().slice(0, 10),
    };

    onSave(finalDI);
    onClose();
  };

  const bp = formData.bangunanPelengkap;
  const daftarDesa = getDaftarDesa(formData.kecamatan || 'Aesesa');

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 no-print">
      <div className="bg-white w-full max-w-5xl rounded-2xl border border-slate-200 shadow-xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold">
              {initialData ? `Ubah Data: ${initialData.nama}` : 'Tambah Data Daerah Irigasi Baru'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Dinas PUPR Kabupaten Nagekeo · Form Inventarisasi Bangunan Utama & Pelengkap
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section Navigation Tabs */}
        <div className="bg-slate-100 border-b border-slate-200 px-5 flex items-center gap-1 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setFormSection('umum')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors ${
              formSection === 'umum'
                ? 'border-amber-500 text-slate-900 bg-white/70'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            1. Info Umum
          </button>
          <button
            type="button"
            onClick={() => setFormSection('bangunan-utama')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              formSection === 'bangunan-utama'
                ? 'border-amber-500 text-slate-900 bg-white/70'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Building className="w-3.5 h-3.5 text-amber-600" />
            <span>2. Bangunan Utama</span>
          </button>
          <button
            type="button"
            onClick={() => setFormSection('bangunan-pelengkap')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              formSection === 'bangunan-pelengkap'
                ? 'border-amber-500 text-slate-900 bg-white/70'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-amber-600" />
            <span>3. Bangunan Pelengkap</span>
          </button>
          <button
            type="button"
            onClick={() => setFormSection('saluran')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors ${
              formSection === 'saluran'
                ? 'border-amber-500 text-slate-900 bg-white/70'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            4. Saluran
          </button>
          <button
            type="button"
            onClick={() => setFormSection('iksi')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors ${
              formSection === 'iksi'
                ? 'border-amber-500 text-slate-900 bg-white/70'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            5. Nilai IKSI
          </button>
          <button
            type="button"
            onClick={() => setFormSection('p3a')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors ${
              formSection === 'p3a'
                ? 'border-amber-500 text-slate-900 bg-white/70'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            6. P3A
          </button>
          <button
            type="button"
            onClick={() => setFormSection('usulan')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors ${
              formSection === 'usulan'
                ? 'border-amber-500 text-slate-900 bg-white/70'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            7. Usulan Penanganan
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* SECTION 1: UMUM */}
          {formSection === 'umum' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nama Daerah Irigasi <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nama || ''}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                    placeholder="Contoh: D.I. Mbay Kanan"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Kode DI (Permen PUPR)
                  </label>
                  <input
                    type="text"
                    value={formData.kodeDI || ''}
                    onChange={(e) => setFormData({ ...formData, kodeDI: e.target.value })}
                    placeholder="Contoh: DI-53.16.01.001"
                    className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Kecamatan <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.kecamatan || 'Aesesa'}
                    onChange={(e) => handleKecamatanChange(e.target.value as KecamatanNagekeo)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium"
                  >
                    {KECAMATAN_NAGEKEO_LIST.map((kec) => (
                      <option key={kec} value={kec}>
                        Kec. {kec}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-700">
                      Desa / Kelurahan <span className="text-rose-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsCustomDesa(!isCustomDesa)}
                      className="text-[10px] text-amber-700 hover:text-amber-800 font-semibold hover:underline"
                    >
                      {isCustomDesa ? '← Pilihan Dropdown' : '+ Input Manual'}
                    </button>
                  </div>

                  {!isCustomDesa ? (
                    <select
                      value={formData.desa || ''}
                      onChange={(e) => {
                        if (e.target.value === '__CUSTOM__') {
                          setIsCustomDesa(true);
                        } else {
                          setFormData({ ...formData, desa: e.target.value });
                        }
                      }}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium"
                    >
                      <option value="">-- Pilih Desa / Kelurahan di Kec. {formData.kecamatan} --</option>
                      {daftarDesa.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                      {formData.desa && !daftarDesa.includes(formData.desa) && (
                        <option value={formData.desa}>
                          {formData.desa} (Tersimpan)
                        </option>
                      )}
                      <option value="__CUSTOM__">✍️ Ketik Nama Desa Lainnya (Manual)...</option>
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={formData.desa || ''}
                      onChange={(e) => setFormData({ ...formData, desa: e.target.value })}
                      placeholder={`Ketik nama desa di Kec. ${formData.kecamatan}...`}
                      className="w-full px-3 py-2 text-xs bg-white border border-amber-400 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                      autoFocus
                    />
                  )}
                  <p className="text-[10px] text-slate-400 mt-1">
                    {!isCustomDesa 
                      ? `${daftarDesa.length} desa/kelurahan terdaftar di Kec. ${formData.kecamatan}`
                      : 'Ketik nama desa bebas atau multi-desa terlayani.'}
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Status Kewenangan
                  </label>
                  <select
                    value={formData.kewenangan || 'Kabupaten'}
                    onChange={(e) => setFormData({ ...formData, kewenangan: e.target.value as KewenanganDI })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  >
                    <option value="Kabupaten">Kabupaten (&lt; 1000 Ha)</option>
                    <option value="Provinsi">Provinsi (1000 - 3000 Ha)</option>
                    <option value="Pusat">Pusat (&gt; 3000 Ha)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Sumber Air (Sungai / Mata Air)
                  </label>
                  <input
                    type="text"
                    value={formData.sumberAir || ''}
                    onChange={(e) => setFormData({ ...formData, sumberAir: e.target.value })}
                    placeholder="Contoh: Sungai Aesesa, Kali Watuapi..."
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Kondisi Fisik Keseluruhan
                  </label>
                  <select
                    value={formData.kondisiFisik || 'Baik'}
                    onChange={(e) => setFormData({ ...formData, kondisiFisik: e.target.value as KondisiFisik })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  >
                    <option value="Baik">Baik</option>
                    <option value="Rusak Ringan">Rusak Ringan</option>
                    <option value="Rusak Sedang">Rusak Sedang</option>
                    <option value="Rusak Berat">Rusak Berat</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Luas Baku (Ha)</label>
                  <input
                    type="number"
                    step="any"
                    value={formData.luasBaku ?? ''}
                    onChange={(e) => setFormData({ ...formData, luasBaku: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Luas Potensial (Ha)</label>
                  <input
                    type="number"
                    step="any"
                    value={formData.luasPotensial ?? ''}
                    onChange={(e) => setFormData({ ...formData, luasPotensial: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Luas Fungsional (Ha) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={formData.luasFungsional ?? ''}
                    onChange={(e) => setFormData({ ...formData, luasFungsional: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 text-xs font-mono font-bold bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Latitude Koordinat GPS</label>
                  <input
                    type="number"
                    step="any"
                    value={formData.koordinat?.lat ?? -8.67}
                    onChange={(e) => setFormData({
                      ...formData,
                      koordinat: {
                        lat: parseFloat(e.target.value) || -8.67,
                        lng: formData.koordinat?.lng || 121.28,
                      },
                    })}
                    className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Longitude Koordinat GPS</label>
                  <input
                    type="number"
                    step="any"
                    value={formData.koordinat?.lng ?? 121.28}
                    onChange={(e) => setFormData({
                      ...formData,
                      koordinat: {
                        lat: formData.koordinat?.lat || -8.67,
                        lng: parseFloat(e.target.value) || 121.28,
                      },
                    })}
                    className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2: BANGUNAN UTAMA */}
          {formSection === 'bangunan-utama' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tipe Bangunan Utama</label>
                  <select
                    value={formData.bangunanUtama?.tipe || 'Bendung Tetap'}
                    onChange={(e) => setFormData({
                      ...formData,
                      bangunanUtama: {
                        ...(formData.bangunanUtama as any),
                        tipe: e.target.value as TipeBangunanUtama,
                      },
                    })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  >
                    <option value="Bendung Tetap">Bendung Tetap</option>
                    <option value="Bendung Gerak">Bendung Gerak</option>
                    <option value="Intake Bebas">Intake Bebas</option>
                    <option value="Embung">Embung</option>
                    <option value="Pompa">Pompa</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nama Bendung / Intake</label>
                  <input
                    type="text"
                    value={formData.bangunanUtama?.nama || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      bangunanUtama: {
                        ...(formData.bangunanUtama as any),
                        nama: e.target.value,
                      },
                    })}
                    placeholder="Contoh: Bendung Sutami"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Kondisi Bangunan Utama</label>
                  <select
                    value={formData.bangunanUtama?.kondisi || 'Baik'}
                    onChange={(e) => setFormData({
                      ...formData,
                      bangunanUtama: {
                        ...(formData.bangunanUtama as any),
                        kondisi: e.target.value as KondisiFisik,
                      },
                    })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  >
                    <option value="Baik">Baik</option>
                    <option value="Rusak Ringan">Rusak Ringan</option>
                    <option value="Rusak Sedang">Rusak Sedang</option>
                    <option value="Rusak Berat">Rusak Berat</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tipe Bentuk Mercu</label>
                  <select
                    value={formData.bangunanUtama?.tipeMercu || 'Ogee'}
                    onChange={(e) => setFormData({
                      ...formData,
                      bangunanUtama: {
                        ...(formData.bangunanUtama as any),
                        tipeMercu: e.target.value,
                      },
                    })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  >
                    <option value="Ogee">Ogee</option>
                    <option value="Bulat">Bulat</option>
                    <option value="Vlugter">Vlugter</option>
                    <option value="Trapesium">Trapesium</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Bahan Konstruksi</label>
                  <select
                    value={formData.bangunanUtama?.bahanKonstruksi || 'Pasangan Batu'}
                    onChange={(e) => setFormData({
                      ...formData,
                      bangunanUtama: {
                        ...(formData.bangunanUtama as any),
                        bahanKonstruksi: e.target.value,
                      },
                    })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  >
                    <option value="Pasangan Batu">Pasangan Batu</option>
                    <option value="Beton Bertulang">Beton Bertulang</option>
                    <option value="Kombinasi Batu-Beton">Kombinasi Batu-Beton</option>
                    <option value="Bronjong">Bronjong</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Lebar Mercu (m)</label>
                  <input
                    type="number"
                    step="any"
                    value={formData.bangunanUtama?.lebarBendungM ?? 12}
                    onChange={(e) => setFormData({
                      ...formData,
                      bangunanUtama: {
                        ...(formData.bangunanUtama as any),
                        lebarBendungM: parseFloat(e.target.value) || 0,
                      },
                    })}
                    className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tinggi Mercu (m)</label>
                  <input
                    type="number"
                    step="any"
                    value={formData.bangunanUtama?.tinggiMercuM ?? 2}
                    onChange={(e) => setFormData({
                      ...formData,
                      bangunanUtama: {
                        ...(formData.bangunanUtama as any),
                        tinggiMercuM: parseFloat(e.target.value) || 0,
                      },
                    })}
                    className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Pintu Pengambilan (Unit)</label>
                  <input
                    type="number"
                    value={formData.bangunanUtama?.jumlahPintuPengambilan ?? 1}
                    onChange={(e) => setFormData({
                      ...formData,
                      bangunanUtama: {
                        ...(formData.bangunanUtama as any),
                        jumlahPintuPengambilan: parseInt(e.target.value, 10) || 0,
                      },
                    })}
                    className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Pintu Penguras (Unit)</label>
                  <input
                    type="number"
                    value={formData.bangunanUtama?.jumlahPintuKuras ?? 1}
                    onChange={(e) => setFormData({
                      ...formData,
                      bangunanUtama: {
                        ...(formData.bangunanUtama as any),
                        jumlahPintuKuras: parseInt(e.target.value, 10) || 0,
                      },
                    })}
                    className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Debit Rata-rata (m³/detik)</label>
                  <input
                    type="number"
                    step="any"
                    value={formData.bangunanUtama?.debitRataRataM3s ?? 0.5}
                    onChange={(e) => setFormData({
                      ...formData,
                      bangunanUtama: {
                        ...(formData.bangunanUtama as any),
                        debitRataRataM3s: parseFloat(e.target.value) || 0,
                      },
                    })}
                    className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <label className="flex items-center gap-2 text-xs font-medium text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.bangunanUtama?.kantongLumpur || false}
                    onChange={(e) => setFormData({
                      ...formData,
                      bangunanUtama: {
                        ...(formData.bangunanUtama as any),
                        kantongLumpur: e.target.checked,
                      },
                    })}
                    className="rounded text-amber-500"
                  />
                  <span>Ada Kantong Lumpur</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-medium text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.bangunanUtama?.papanDugaPeilschaal ?? true}
                    onChange={(e) => setFormData({
                      ...formData,
                      bangunanUtama: {
                        ...(formData.bangunanUtama as any),
                        papanDugaPeilschaal: e.target.checked,
                      },
                    })}
                    className="rounded text-amber-500"
                  />
                  <span>Ada Papan Duga (Peilschaal)</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-medium text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.bangunanUtama?.jembatanPelayanBendung ?? true}
                    onChange={(e) => setFormData({
                      ...formData,
                      bangunanUtama: {
                        ...(formData.bangunanUtama as any),
                        jembatanPelayanBendung: e.target.checked,
                      },
                    })}
                    className="rounded text-amber-500"
                  />
                  <span>Ada Jembatan Pelayan</span>
                </label>
              </div>
            </div>
          )}

          {/* SECTION 3: BANGUNAN PELENGKAP */}
          {formSection === 'bangunan-pelengkap' && (
            <div className="space-y-5">
              {/* Grup 1: Fasilitas Sosial & Pertanian */}
              <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    1. Fasilitas Pelengkap Sosial & Pertanian
                  </h4>
                  <span className="text-[10px] text-slate-500 font-medium">Jika Unit = 0, Kondisi Otomatis "Tidak Ada"</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {/* Jembatan Desa / Tani */}
                  <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-2xs space-y-2">
                    <span className="text-xs font-bold text-slate-800 block">Jembatan Desa / Tani</span>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">Jumlah Unit</label>
                        <input
                          type="number"
                          value={bp?.jembatanDesaTani?.jumlahUnit ?? 0}
                          onChange={(e) => {
                            const u = Math.max(0, parseInt(e.target.value, 10) || 0);
                            setFormData({
                              ...formData,
                              bangunanPelengkap: {
                                ...(bp as any),
                                jembatanDesaTani: {
                                  jumlahUnit: u,
                                  kondisi: u <= 0 ? 'Tidak Ada' : autoKondisiForUnit(u, bp?.jembatanDesaTani?.kondisi),
                                },
                              },
                            });
                          }}
                          className="w-full px-2 py-1.5 text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">Kondisi</label>
                        <select
                          value={getDisplayKondisi(bp?.jembatanDesaTani?.jumlahUnit ?? 0, bp?.jembatanDesaTani?.kondisi)}
                          onChange={(e) => {
                            const k = e.target.value as KondisiFisik;
                            const currU = bp?.jembatanDesaTani?.jumlahUnit ?? 0;
                            setFormData({
                              ...formData,
                              bangunanPelengkap: {
                                ...(bp as any),
                                jembatanDesaTani: {
                                  jumlahUnit: k === 'Tidak Ada' ? 0 : (currU <= 0 ? 1 : currU),
                                  kondisi: k,
                                },
                              },
                            });
                          }}
                          className={`w-full px-2 py-1.5 text-xs rounded-lg font-medium focus:outline-none focus:ring-1 focus:ring-amber-500 border ${
                            (bp?.jembatanDesaTani?.jumlahUnit ?? 0) <= 0 || bp?.jembatanDesaTani?.kondisi === 'Tidak Ada'
                              ? 'bg-slate-100 text-slate-500 border-slate-200 italic font-medium'
                              : 'bg-slate-50 border-slate-300 text-slate-900'
                          }`}
                        >
                          <option value="Tidak Ada">Tidak Ada (0 Unit)</option>
                          <option value="Baik">Baik</option>
                          <option value="Rusak Ringan">Rusak Ringan</option>
                          <option value="Rusak Sedang">Rusak Sedang</option>
                          <option value="Rusak Berat">Rusak Berat</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Kubangan Cuci Ternak */}
                  <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-2xs space-y-2">
                    <span className="text-xs font-bold text-slate-800 block">Kubangan Cuci Ternak</span>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">Jumlah Unit</label>
                        <input
                          type="number"
                          value={bp?.kubanganCuciTernak?.jumlahUnit ?? 0}
                          onChange={(e) => {
                            const u = Math.max(0, parseInt(e.target.value, 10) || 0);
                            setFormData({
                              ...formData,
                              bangunanPelengkap: {
                                ...(bp as any),
                                kubanganCuciTernak: {
                                  jumlahUnit: u,
                                  kondisi: u <= 0 ? 'Tidak Ada' : autoKondisiForUnit(u, bp?.kubanganCuciTernak?.kondisi),
                                },
                              },
                            });
                          }}
                          className="w-full px-2 py-1.5 text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">Kondisi</label>
                        <select
                          value={getDisplayKondisi(bp?.kubanganCuciTernak?.jumlahUnit ?? 0, bp?.kubanganCuciTernak?.kondisi)}
                          onChange={(e) => {
                            const k = e.target.value as KondisiFisik;
                            const currU = bp?.kubanganCuciTernak?.jumlahUnit ?? 0;
                            setFormData({
                              ...formData,
                              bangunanPelengkap: {
                                ...(bp as any),
                                kubanganCuciTernak: {
                                  jumlahUnit: k === 'Tidak Ada' ? 0 : (currU <= 0 ? 1 : currU),
                                  kondisi: k,
                                },
                              },
                            });
                          }}
                          className={`w-full px-2 py-1.5 text-xs rounded-lg font-medium focus:outline-none focus:ring-1 focus:ring-amber-500 border ${
                            (bp?.kubanganCuciTernak?.jumlahUnit ?? 0) <= 0 || bp?.kubanganCuciTernak?.kondisi === 'Tidak Ada'
                              ? 'bg-slate-100 text-slate-500 border-slate-200 italic font-medium'
                              : 'bg-slate-50 border-slate-300 text-slate-900'
                          }`}
                        >
                          <option value="Tidak Ada">Tidak Ada (0 Unit)</option>
                          <option value="Baik">Baik</option>
                          <option value="Rusak Ringan">Rusak Ringan</option>
                          <option value="Rusak Sedang">Rusak Sedang</option>
                          <option value="Rusak Berat">Rusak Berat</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Tangga Cuci Petani */}
                  <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-2xs space-y-2">
                    <span className="text-xs font-bold text-slate-800 block">Tangga Cuci Petani</span>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">Jumlah Unit</label>
                        <input
                          type="number"
                          value={bp?.tanggaCuciMandiPetani?.jumlahUnit ?? 0}
                          onChange={(e) => {
                            const u = Math.max(0, parseInt(e.target.value, 10) || 0);
                            setFormData({
                              ...formData,
                              bangunanPelengkap: {
                                ...(bp as any),
                                tanggaCuciMandiPetani: {
                                  jumlahUnit: u,
                                  kondisi: u <= 0 ? 'Tidak Ada' : autoKondisiForUnit(u, bp?.tanggaCuciMandiPetani?.kondisi),
                                },
                              },
                            });
                          }}
                          className="w-full px-2 py-1.5 text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">Kondisi</label>
                        <select
                          value={getDisplayKondisi(bp?.tanggaCuciMandiPetani?.jumlahUnit ?? 0, bp?.tanggaCuciMandiPetani?.kondisi)}
                          onChange={(e) => {
                            const k = e.target.value as KondisiFisik;
                            const currU = bp?.tanggaCuciMandiPetani?.jumlahUnit ?? 0;
                            setFormData({
                              ...formData,
                              bangunanPelengkap: {
                                ...(bp as any),
                                tanggaCuciMandiPetani: {
                                  jumlahUnit: k === 'Tidak Ada' ? 0 : (currU <= 0 ? 1 : currU),
                                  kondisi: k,
                                },
                              },
                            });
                          }}
                          className={`w-full px-2 py-1.5 text-xs rounded-lg font-medium focus:outline-none focus:ring-1 focus:ring-amber-500 border ${
                            (bp?.tanggaCuciMandiPetani?.jumlahUnit ?? 0) <= 0 || bp?.tanggaCuciMandiPetani?.kondisi === 'Tidak Ada'
                              ? 'bg-slate-100 text-slate-500 border-slate-200 italic font-medium'
                              : 'bg-slate-50 border-slate-300 text-slate-900'
                          }`}
                        >
                          <option value="Tidak Ada">Tidak Ada (0 Unit)</option>
                          <option value="Baik">Baik</option>
                          <option value="Rusak Ringan">Rusak Ringan</option>
                          <option value="Rusak Sedang">Rusak Sedang</option>
                          <option value="Rusak Berat">Rusak Berat</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Pelimpah Samping Wasteweir */}
                  <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-2xs space-y-2">
                    <span className="text-xs font-bold text-slate-800 block">Pelimpah Samping (Wasteweir)</span>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">Jumlah Unit</label>
                        <input
                          type="number"
                          value={bp?.pelimpahSampingWasteweir?.jumlahUnit ?? 0}
                          onChange={(e) => {
                            const u = Math.max(0, parseInt(e.target.value, 10) || 0);
                            setFormData({
                              ...formData,
                              bangunanPelengkap: {
                                ...(bp as any),
                                pelimpahSampingWasteweir: {
                                  jumlahUnit: u,
                                  kondisi: u <= 0 ? 'Tidak Ada' : autoKondisiForUnit(u, bp?.pelimpahSampingWasteweir?.kondisi),
                                },
                              },
                            });
                          }}
                          className="w-full px-2 py-1.5 text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">Kondisi</label>
                        <select
                          value={getDisplayKondisi(bp?.pelimpahSampingWasteweir?.jumlahUnit ?? 0, bp?.pelimpahSampingWasteweir?.kondisi)}
                          onChange={(e) => {
                            const k = e.target.value as KondisiFisik;
                            const currU = bp?.pelimpahSampingWasteweir?.jumlahUnit ?? 0;
                            setFormData({
                              ...formData,
                              bangunanPelengkap: {
                                ...(bp as any),
                                pelimpahSampingWasteweir: {
                                  jumlahUnit: k === 'Tidak Ada' ? 0 : (currU <= 0 ? 1 : currU),
                                  kondisi: k,
                                },
                              },
                            });
                          }}
                          className={`w-full px-2 py-1.5 text-xs rounded-lg font-medium focus:outline-none focus:ring-1 focus:ring-amber-500 border ${
                            (bp?.pelimpahSampingWasteweir?.jumlahUnit ?? 0) <= 0 || bp?.pelimpahSampingWasteweir?.kondisi === 'Tidak Ada'
                              ? 'bg-slate-100 text-slate-500 border-slate-200 italic font-medium'
                              : 'bg-slate-50 border-slate-300 text-slate-900'
                          }`}
                        >
                          <option value="Tidak Ada">Tidak Ada (0 Unit)</option>
                          <option value="Baik">Baik</option>
                          <option value="Rusak Ringan">Rusak Ringan</option>
                          <option value="Rusak Sedang">Rusak Sedang</option>
                          <option value="Rusak Berat">Rusak Berat</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Kisi Saringan Sampah Trashrack */}
                  <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-2xs space-y-2">
                    <span className="text-xs font-bold text-slate-800 block">Saringan Sampah (Trashrack)</span>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">Jumlah Unit</label>
                        <input
                          type="number"
                          value={bp?.trashrackSaringanSampah?.jumlahUnit ?? 0}
                          onChange={(e) => {
                            const u = Math.max(0, parseInt(e.target.value, 10) || 0);
                            setFormData({
                              ...formData,
                              bangunanPelengkap: {
                                ...(bp as any),
                                trashrackSaringanSampah: {
                                  jumlahUnit: u,
                                  kondisi: u <= 0 ? 'Tidak Ada' : autoKondisiForUnit(u, bp?.trashrackSaringanSampah?.kondisi),
                                },
                              },
                            });
                          }}
                          className="w-full px-2 py-1.5 text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">Kondisi</label>
                        <select
                          value={getDisplayKondisi(bp?.trashrackSaringanSampah?.jumlahUnit ?? 0, bp?.trashrackSaringanSampah?.kondisi)}
                          onChange={(e) => {
                            const k = e.target.value as KondisiFisik;
                            const currU = bp?.trashrackSaringanSampah?.jumlahUnit ?? 0;
                            setFormData({
                              ...formData,
                              bangunanPelengkap: {
                                ...(bp as any),
                                trashrackSaringanSampah: {
                                  jumlahUnit: k === 'Tidak Ada' ? 0 : (currU <= 0 ? 1 : currU),
                                  kondisi: k,
                                },
                              },
                            });
                          }}
                          className={`w-full px-2 py-1.5 text-xs rounded-lg font-medium focus:outline-none focus:ring-1 focus:ring-amber-500 border ${
                            (bp?.trashrackSaringanSampah?.jumlahUnit ?? 0) <= 0 || bp?.trashrackSaringanSampah?.kondisi === 'Tidak Ada'
                              ? 'bg-slate-100 text-slate-500 border-slate-200 italic font-medium'
                              : 'bg-slate-50 border-slate-300 text-slate-900'
                          }`}
                        >
                          <option value="Tidak Ada">Tidak Ada (0 Unit)</option>
                          <option value="Baik">Baik</option>
                          <option value="Rusak Ringan">Rusak Ringan</option>
                          <option value="Rusak Sedang">Rusak Sedang</option>
                          <option value="Rusak Berat">Rusak Berat</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Grup 2: Prasarana O&P, Patok Sempadan & Jalan Inspeksi */}
              <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    2. Prasarana O&P, Patok Sempadan & Jalan Inspeksi
                  </h4>
                  <span className="text-[10px] text-slate-500 font-medium">Jika Unit = 0, Kondisi Otomatis "Tidak Ada"</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* Gardu Jaga / Pos Juru POB */}
                  <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-2xs space-y-2">
                    <span className="text-xs font-bold text-slate-800 block">Gardu Jaga / Pos POB</span>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">Jumlah Unit</label>
                        <input
                          type="number"
                          value={bp?.garduJagaRumahPintu?.jumlahUnit ?? 0}
                          onChange={(e) => {
                            const u = Math.max(0, parseInt(e.target.value, 10) || 0);
                            setFormData({
                              ...formData,
                              bangunanPelengkap: {
                                ...(bp as any),
                                garduJagaRumahPintu: {
                                  jumlahUnit: u,
                                  kondisi: autoKondisiForUnit(u, bp?.garduJagaRumahPintu?.kondisi),
                                },
                              },
                            });
                          }}
                          className="w-full px-2 py-1.5 text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">Kondisi</label>
                        <select
                          value={bp?.garduJagaRumahPintu?.kondisi || 'Tidak Ada'}
                          onChange={(e) => {
                            const k = e.target.value as KondisiFisik;
                            const currU = bp?.garduJagaRumahPintu?.jumlahUnit ?? 0;
                            setFormData({
                              ...formData,
                              bangunanPelengkap: {
                                ...(bp as any),
                                garduJagaRumahPintu: {
                                  jumlahUnit: k === 'Tidak Ada' ? 0 : (currU <= 0 ? 1 : currU),
                                  kondisi: k,
                                },
                              },
                            });
                          }}
                          className={`w-full px-2 py-1.5 text-xs rounded-lg font-medium focus:outline-none focus:ring-1 focus:ring-amber-500 border ${
                            bp?.garduJagaRumahPintu?.kondisi === 'Tidak Ada'
                              ? 'bg-slate-100 text-slate-500 border-slate-200 italic'
                              : 'bg-slate-50 border-slate-300 text-slate-900'
                          }`}
                        >
                          <option value="Tidak Ada">Tidak Ada (0 Unit)</option>
                          <option value="Baik">Baik</option>
                          <option value="Rusak Ringan">Rusak Ringan</option>
                          <option value="Rusak Sedang">Rusak Sedang</option>
                          <option value="Rusak Berat">Rusak Berat</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Papan Duga Air (Peilschaal) */}
                  <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-2xs space-y-2">
                    <span className="text-xs font-bold text-slate-800 block">Papan Duga Air (Peilschaal)</span>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">Jumlah Unit</label>
                        <input
                          type="number"
                          value={bp?.peilschaalSaluran?.jumlahUnit ?? 0}
                          onChange={(e) => {
                            const u = Math.max(0, parseInt(e.target.value, 10) || 0);
                            setFormData({
                              ...formData,
                              bangunanPelengkap: {
                                ...(bp as any),
                                peilschaalSaluran: {
                                  jumlahUnit: u,
                                  kondisi: autoKondisiForUnit(u, bp?.peilschaalSaluran?.kondisi),
                                },
                              },
                            });
                          }}
                          className="w-full px-2 py-1.5 text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">Kondisi</label>
                        <select
                          value={bp?.peilschaalSaluran?.kondisi || 'Tidak Ada'}
                          onChange={(e) => {
                            const k = e.target.value as KondisiFisik;
                            const currU = bp?.peilschaalSaluran?.jumlahUnit ?? 0;
                            setFormData({
                              ...formData,
                              bangunanPelengkap: {
                                ...(bp as any),
                                peilschaalSaluran: {
                                  jumlahUnit: k === 'Tidak Ada' ? 0 : (currU <= 0 ? 1 : currU),
                                  kondisi: k,
                                },
                              },
                            });
                          }}
                          className={`w-full px-2 py-1.5 text-xs rounded-lg font-medium focus:outline-none focus:ring-1 focus:ring-amber-500 border ${
                            bp?.peilschaalSaluran?.kondisi === 'Tidak Ada'
                              ? 'bg-slate-100 text-slate-500 border-slate-200 italic'
                              : 'bg-slate-50 border-slate-300 text-slate-900'
                          }`}
                        >
                          <option value="Tidak Ada">Tidak Ada (0 Unit)</option>
                          <option value="Baik">Baik</option>
                          <option value="Rusak Ringan">Rusak Ringan</option>
                          <option value="Rusak Sedang">Rusak Sedang</option>
                          <option value="Rusak Berat">Rusak Berat</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Patok Hm & Sempadan */}
                  <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-2xs space-y-2">
                    <span className="text-xs font-bold text-slate-800 block">Patok Hektometer (Hm)</span>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">Jumlah Patok</label>
                        <input
                          type="number"
                          value={bp?.patokHektometerSempadan?.jumlahUnit ?? 0}
                          onChange={(e) => {
                            const u = Math.max(0, parseInt(e.target.value, 10) || 0);
                            setFormData({
                              ...formData,
                              bangunanPelengkap: {
                                ...(bp as any),
                                patokHektometerSempadan: {
                                  jumlahUnit: u,
                                  kondisi: autoKondisiForUnit(u, bp?.patokHektometerSempadan?.kondisi),
                                },
                              },
                            });
                          }}
                          className="w-full px-2 py-1.5 text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">Kondisi</label>
                        <select
                          value={bp?.patokHektometerSempadan?.kondisi || 'Tidak Ada'}
                          onChange={(e) => {
                            const k = e.target.value as KondisiFisik;
                            const currU = bp?.patokHektometerSempadan?.jumlahUnit ?? 0;
                            setFormData({
                              ...formData,
                              bangunanPelengkap: {
                                ...(bp as any),
                                patokHektometerSempadan: {
                                  jumlahUnit: k === 'Tidak Ada' ? 0 : (currU <= 0 ? 1 : currU),
                                  kondisi: k,
                                },
                              },
                            });
                          }}
                          className={`w-full px-2 py-1.5 text-xs rounded-lg font-medium focus:outline-none focus:ring-1 focus:ring-amber-500 border ${
                            bp?.patokHektometerSempadan?.kondisi === 'Tidak Ada'
                              ? 'bg-slate-100 text-slate-500 border-slate-200 italic'
                              : 'bg-slate-50 border-slate-300 text-slate-900'
                          }`}
                        >
                          <option value="Tidak Ada">Tidak Ada (0 Unit)</option>
                          <option value="Baik">Baik</option>
                          <option value="Rusak Ringan">Rusak Ringan</option>
                          <option value="Rusak Sedang">Rusak Sedang</option>
                          <option value="Rusak Berat">Rusak Berat</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Jalan Inspeksi Lengkap */}
                <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-2xs space-y-2 mt-2">
                  <span className="text-xs font-bold text-slate-800 block">Jalan Inspeksi Saluran Irigasi</span>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">Panjang (Km)</label>
                      <input
                        type="number"
                        step="any"
                        value={bp?.jalanInspeksi?.panjangKm ?? 0}
                        onChange={(e) => {
                          const p = Math.max(0, parseFloat(e.target.value) || 0);
                          setFormData({
                            ...formData,
                            bangunanPelengkap: {
                              ...(bp as any),
                              jalanInspeksi: {
                                ...(bp?.jalanInspeksi as any),
                                panjangKm: p,
                                kondisi: autoKondisiForUnit(p, bp?.jalanInspeksi?.kondisi),
                              },
                            },
                          });
                        }}
                        className="w-full px-2.5 py-1.5 text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">Lebar (Meter)</label>
                      <input
                        type="number"
                        step="any"
                        value={bp?.jalanInspeksi?.lebarM ?? 3.0}
                        onChange={(e) => setFormData({
                          ...formData,
                          bangunanPelengkap: {
                            ...(bp as any),
                            jalanInspeksi: {
                              ...(bp?.jalanInspeksi as any),
                              lebarM: parseFloat(e.target.value) || 0,
                            },
                          },
                        })}
                        className="w-full px-2.5 py-1.5 text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">Jenis Perkerasan</label>
                      <select
                        value={bp?.jalanInspeksi?.jenisPerkerasan || 'Rabat Beton'}
                        onChange={(e) => setFormData({
                          ...formData,
                          bangunanPelengkap: {
                            ...(bp as any),
                            jalanInspeksi: {
                              ...(bp?.jalanInspeksi as any),
                              jenisPerkerasan: e.target.value as any,
                            },
                          },
                        })}
                        className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                      >
                        <option value="Rabat Beton">Rabat Beton</option>
                        <option value="Aspal">Aspal</option>
                        <option value="Sirtu/Krikil">Sirtu/Krikil</option>
                        <option value="Tanah">Tanah</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">Penilaian Kondisi</label>
                      <select
                        value={bp?.jalanInspeksi?.kondisi || 'Tidak Ada'}
                        onChange={(e) => {
                          const k = e.target.value as KondisiFisik;
                          const currP = bp?.jalanInspeksi?.panjangKm ?? 0;
                          setFormData({
                            ...formData,
                            bangunanPelengkap: {
                              ...(bp as any),
                              jalanInspeksi: {
                                ...(bp?.jalanInspeksi as any),
                                panjangKm: k === 'Tidak Ada' ? 0 : (currP <= 0 ? 1.0 : currP),
                                kondisi: k,
                              },
                            },
                          });
                        }}
                        className={`w-full px-2.5 py-1.5 text-xs rounded-lg font-medium focus:outline-none focus:ring-1 focus:ring-amber-500 border ${
                          bp?.jalanInspeksi?.kondisi === 'Tidak Ada'
                            ? 'bg-slate-100 text-slate-500 border-slate-200 italic'
                            : 'bg-slate-50 border-slate-300 text-slate-900'
                        }`}
                      >
                        <option value="Tidak Ada">Tidak Ada (0 Km)</option>
                        <option value="Baik">Baik</option>
                        <option value="Rusak Ringan">Rusak Ringan</option>
                        <option value="Rusak Sedang">Rusak Sedang</option>
                        <option value="Rusak Berat">Rusak Berat</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Grup 3: Bangunan Silang Detail (Cross Structures) */}
              <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    3. Bangunan Silang Saluran (Cross Structures)
                  </h4>
                  <span className="text-[10px] text-slate-500 font-medium">Jika Unit = 0, Kondisi Otomatis "Tidak Ada"</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {/* Talang Air */}
                  <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-2xs space-y-2">
                    <span className="text-xs font-bold text-slate-800 block">Talang Air (Aqueduct)</span>
                    <div className="space-y-1.5">
                      <div>
                        <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">Jumlah Unit</label>
                        <input
                          type="number"
                          value={bp?.bangunanSilangDetail?.talang ?? 0}
                          onChange={(e) => {
                            const u = Math.max(0, parseInt(e.target.value, 10) || 0);
                            setFormData({
                              ...formData,
                              bangunanPelengkap: {
                                ...(bp as any),
                                bangunanSilangDetail: {
                                  ...(bp?.bangunanSilangDetail as any),
                                  talang: u,
                                  kondisiTalang: autoKondisiForUnit(u, bp?.bangunanSilangDetail?.kondisiTalang),
                                },
                              },
                            });
                          }}
                          className="w-full px-2 py-1.5 text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">Penilaian Kondisi</label>
                        <select
                          value={bp?.bangunanSilangDetail?.kondisiTalang || 'Tidak Ada'}
                          onChange={(e) => {
                            const k = e.target.value as KondisiFisik;
                            const currU = bp?.bangunanSilangDetail?.talang ?? 0;
                            setFormData({
                              ...formData,
                              bangunanPelengkap: {
                                ...(bp as any),
                                bangunanSilangDetail: {
                                  ...(bp?.bangunanSilangDetail as any),
                                  talang: k === 'Tidak Ada' ? 0 : (currU <= 0 ? 1 : currU),
                                  kondisiTalang: k,
                                },
                              },
                            });
                          }}
                          className={`w-full px-2 py-1.5 text-xs rounded-lg font-medium focus:outline-none focus:ring-1 focus:ring-amber-500 border ${
                            bp?.bangunanSilangDetail?.kondisiTalang === 'Tidak Ada'
                              ? 'bg-slate-100 text-slate-500 border-slate-200 italic'
                              : 'bg-slate-50 border-slate-300 text-slate-900'
                          }`}
                        >
                          <option value="Tidak Ada">Tidak Ada (0 Unit)</option>
                          <option value="Baik">Baik</option>
                          <option value="Rusak Ringan">Rusak Ringan</option>
                          <option value="Rusak Sedang">Rusak Sedang</option>
                          <option value="Rusak Berat">Rusak Berat</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Siphon */}
                  <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-2xs space-y-2">
                    <span className="text-xs font-bold text-slate-800 block">Siphon (Inverted Siphon)</span>
                    <div className="space-y-1.5">
                      <div>
                        <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">Jumlah Unit</label>
                        <input
                          type="number"
                          value={bp?.bangunanSilangDetail?.siphon ?? 0}
                          onChange={(e) => {
                            const u = Math.max(0, parseInt(e.target.value, 10) || 0);
                            setFormData({
                              ...formData,
                              bangunanPelengkap: {
                                ...(bp as any),
                                bangunanSilangDetail: {
                                  ...(bp?.bangunanSilangDetail as any),
                                  siphon: u,
                                  kondisiSiphon: autoKondisiForUnit(u, bp?.bangunanSilangDetail?.kondisiSiphon),
                                },
                              },
                            });
                          }}
                          className="w-full px-2 py-1.5 text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">Penilaian Kondisi</label>
                        <select
                          value={bp?.bangunanSilangDetail?.kondisiSiphon || 'Tidak Ada'}
                          onChange={(e) => {
                            const k = e.target.value as KondisiFisik;
                            const currU = bp?.bangunanSilangDetail?.siphon ?? 0;
                            setFormData({
                              ...formData,
                              bangunanPelengkap: {
                                ...(bp as any),
                                bangunanSilangDetail: {
                                  ...(bp?.bangunanSilangDetail as any),
                                  siphon: k === 'Tidak Ada' ? 0 : (currU <= 0 ? 1 : currU),
                                  kondisiSiphon: k,
                                },
                              },
                            });
                          }}
                          className={`w-full px-2 py-1.5 text-xs rounded-lg font-medium focus:outline-none focus:ring-1 focus:ring-amber-500 border ${
                            bp?.bangunanSilangDetail?.kondisiSiphon === 'Tidak Ada'
                              ? 'bg-slate-100 text-slate-500 border-slate-200 italic'
                              : 'bg-slate-50 border-slate-300 text-slate-900'
                          }`}
                        >
                          <option value="Tidak Ada">Tidak Ada (0 Unit)</option>
                          <option value="Baik">Baik</option>
                          <option value="Rusak Ringan">Rusak Ringan</option>
                          <option value="Rusak Sedang">Rusak Sedang</option>
                          <option value="Rusak Berat">Rusak Berat</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Gorong-gorong Silang */}
                  <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-2xs space-y-2">
                    <span className="text-xs font-bold text-slate-800 block">Gorong-gorong Pembawa</span>
                    <div className="space-y-1.5">
                      <div>
                        <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">Jumlah Unit</label>
                        <input
                          type="number"
                          value={bp?.bangunanSilangDetail?.gorongGorong ?? 0}
                          onChange={(e) => {
                            const u = Math.max(0, parseInt(e.target.value, 10) || 0);
                            setFormData({
                              ...formData,
                              bangunanPelengkap: {
                                ...(bp as any),
                                bangunanSilangDetail: {
                                  ...(bp?.bangunanSilangDetail as any),
                                  gorongGorong: u,
                                  kondisiGorongGorong: autoKondisiForUnit(u, bp?.bangunanSilangDetail?.kondisiGorongGorong),
                                },
                              },
                            });
                          }}
                          className="w-full px-2 py-1.5 text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">Penilaian Kondisi</label>
                        <select
                          value={bp?.bangunanSilangDetail?.kondisiGorongGorong || 'Tidak Ada'}
                          onChange={(e) => {
                            const k = e.target.value as KondisiFisik;
                            const currU = bp?.bangunanSilangDetail?.gorongGorong ?? 0;
                            setFormData({
                              ...formData,
                              bangunanPelengkap: {
                                ...(bp as any),
                                bangunanSilangDetail: {
                                  ...(bp?.bangunanSilangDetail as any),
                                  gorongGorong: k === 'Tidak Ada' ? 0 : (currU <= 0 ? 1 : currU),
                                  kondisiGorongGorong: k,
                                },
                              },
                            });
                          }}
                          className={`w-full px-2 py-1.5 text-xs rounded-lg font-medium focus:outline-none focus:ring-1 focus:ring-amber-500 border ${
                            bp?.bangunanSilangDetail?.kondisiGorongGorong === 'Tidak Ada'
                              ? 'bg-slate-100 text-slate-500 border-slate-200 italic'
                              : 'bg-slate-50 border-slate-300 text-slate-900'
                          }`}
                        >
                          <option value="Tidak Ada">Tidak Ada (0 Unit)</option>
                          <option value="Baik">Baik</option>
                          <option value="Rusak Ringan">Rusak Ringan</option>
                          <option value="Rusak Sedang">Rusak Sedang</option>
                          <option value="Rusak Berat">Rusak Berat</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Terjunan / Got Miring */}
                  <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-2xs space-y-2">
                    <span className="text-xs font-bold text-slate-800 block">Terjunan / Got Miring</span>
                    <div className="space-y-1.5">
                      <div>
                        <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">Jumlah Unit</label>
                        <input
                          type="number"
                          value={bp?.bangunanSilangDetail?.gotMiringTerjunan ?? 0}
                          onChange={(e) => {
                            const u = Math.max(0, parseInt(e.target.value, 10) || 0);
                            setFormData({
                              ...formData,
                              bangunanPelengkap: {
                                ...(bp as any),
                                bangunanSilangDetail: {
                                  ...(bp?.bangunanSilangDetail as any),
                                  gotMiringTerjunan: u,
                                  kondisiGotMiringTerjunan: autoKondisiForUnit(u, bp?.bangunanSilangDetail?.kondisiGotMiringTerjunan),
                                },
                              },
                            });
                          }}
                          className="w-full px-2 py-1.5 text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">Penilaian Kondisi</label>
                        <select
                          value={bp?.bangunanSilangDetail?.kondisiGotMiringTerjunan || 'Tidak Ada'}
                          onChange={(e) => {
                            const k = e.target.value as KondisiFisik;
                            const currU = bp?.bangunanSilangDetail?.gotMiringTerjunan ?? 0;
                            setFormData({
                              ...formData,
                              bangunanPelengkap: {
                                ...(bp as any),
                                bangunanSilangDetail: {
                                  ...(bp?.bangunanSilangDetail as any),
                                  gotMiringTerjunan: k === 'Tidak Ada' ? 0 : (currU <= 0 ? 1 : currU),
                                  kondisiGotMiringTerjunan: k,
                                },
                              },
                            });
                          }}
                          className={`w-full px-2 py-1.5 text-xs rounded-lg font-medium focus:outline-none focus:ring-1 focus:ring-amber-500 border ${
                            bp?.bangunanSilangDetail?.kondisiGotMiringTerjunan === 'Tidak Ada'
                              ? 'bg-slate-100 text-slate-500 border-slate-200 italic'
                              : 'bg-slate-50 border-slate-300 text-slate-900'
                          }`}
                        >
                          <option value="Tidak Ada">Tidak Ada (0 Unit)</option>
                          <option value="Baik">Baik</option>
                          <option value="Rusak Ringan">Rusak Ringan</option>
                          <option value="Rusak Sedang">Rusak Sedang</option>
                          <option value="Rusak Berat">Rusak Berat</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 4: SALURAN & BANGUNAN PENGATUR */}
          {formSection === 'saluran' && (
            <div className="space-y-5">
              {/* Bagian 1: Saluran Pembawa (Primer, Sekunder, Tersier) */}
              <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    1. Saluran Pembawa (Primer, Sekunder, Tersier)
                  </h4>
                  <span className="text-[10px] text-slate-500 font-medium">Jika Panjang = 0 m, Kondisi Otomatis "Tidak Ada"</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* Saluran Primer */}
                  <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-2xs space-y-2">
                    <span className="text-xs font-bold text-slate-800 block">Saluran Primer</span>
                    <div className="space-y-1.5">
                      <div>
                        <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">Panjang (Meter)</label>
                        <input
                          type="number"
                          value={formData.jaringanSaluran?.panjangPrimerM ?? 0}
                          onChange={(e) => {
                            const p = Math.max(0, parseInt(e.target.value, 10) || 0);
                            setFormData({
                              ...formData,
                              jaringanSaluran: {
                                ...(formData.jaringanSaluran as any),
                                panjangPrimerM: p,
                                kondisiPrimer: autoKondisiForUnit(p, formData.jaringanSaluran?.kondisiPrimer),
                              },
                            });
                          }}
                          placeholder="Contoh: 3500"
                          className="w-full px-2.5 py-1.5 text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">Penilaian Kondisi</label>
                        <select
                          value={formData.jaringanSaluran?.kondisiPrimer || 'Tidak Ada'}
                          onChange={(e) => {
                            const k = e.target.value as KondisiFisik;
                            const currP = formData.jaringanSaluran?.panjangPrimerM ?? 0;
                            setFormData({
                              ...formData,
                              jaringanSaluran: {
                                ...(formData.jaringanSaluran as any),
                                panjangPrimerM: k === 'Tidak Ada' ? 0 : (currP <= 0 ? 500 : currP),
                                kondisiPrimer: k,
                              },
                            });
                          }}
                          className={`w-full px-2.5 py-1.5 text-xs rounded-lg font-medium focus:outline-none focus:ring-1 focus:ring-amber-500 border ${
                            formData.jaringanSaluran?.kondisiPrimer === 'Tidak Ada'
                              ? 'bg-slate-100 text-slate-500 border-slate-200 italic'
                              : 'bg-slate-50 border-slate-300 text-slate-900'
                          }`}
                        >
                          <option value="Tidak Ada">Tidak Ada (0 Meter)</option>
                          <option value="Baik">Baik</option>
                          <option value="Rusak Ringan">Rusak Ringan</option>
                          <option value="Rusak Sedang">Rusak Sedang</option>
                          <option value="Rusak Berat">Rusak Berat</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Saluran Sekunder */}
                  <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-2xs space-y-2">
                    <span className="text-xs font-bold text-slate-800 block">Saluran Sekunder</span>
                    <div className="space-y-1.5">
                      <div>
                        <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">Panjang (Meter)</label>
                        <input
                          type="number"
                          value={formData.jaringanSaluran?.panjangSekunderM ?? 0}
                          onChange={(e) => {
                            const p = Math.max(0, parseInt(e.target.value, 10) || 0);
                            setFormData({
                              ...formData,
                              jaringanSaluran: {
                                ...(formData.jaringanSaluran as any),
                                panjangSekunderM: p,
                                kondisiSekunder: autoKondisiForUnit(p, formData.jaringanSaluran?.kondisiSekunder),
                              },
                            });
                          }}
                          placeholder="Contoh: 5000"
                          className="w-full px-2.5 py-1.5 text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">Penilaian Kondisi</label>
                        <select
                          value={formData.jaringanSaluran?.kondisiSekunder || 'Tidak Ada'}
                          onChange={(e) => {
                            const k = e.target.value as KondisiFisik;
                            const currP = formData.jaringanSaluran?.panjangSekunderM ?? 0;
                            setFormData({
                              ...formData,
                              jaringanSaluran: {
                                ...(formData.jaringanSaluran as any),
                                panjangSekunderM: k === 'Tidak Ada' ? 0 : (currP <= 0 ? 500 : currP),
                                kondisiSekunder: k,
                              },
                            });
                          }}
                          className={`w-full px-2.5 py-1.5 text-xs rounded-lg font-medium focus:outline-none focus:ring-1 focus:ring-amber-500 border ${
                            formData.jaringanSaluran?.kondisiSekunder === 'Tidak Ada'
                              ? 'bg-slate-100 text-slate-500 border-slate-200 italic'
                              : 'bg-slate-50 border-slate-300 text-slate-900'
                          }`}
                        >
                          <option value="Tidak Ada">Tidak Ada (0 Meter)</option>
                          <option value="Baik">Baik</option>
                          <option value="Rusak Ringan">Rusak Ringan</option>
                          <option value="Rusak Sedang">Rusak Sedang</option>
                          <option value="Rusak Berat">Rusak Berat</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Saluran Tersier */}
                  <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-2xs space-y-2">
                    <span className="text-xs font-bold text-slate-800 block">Saluran Tersier / Pembuang</span>
                    <div className="space-y-1.5">
                      <div>
                        <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">Panjang (Meter)</label>
                        <input
                          type="number"
                          value={formData.jaringanSaluran?.panjangTersierM ?? 0}
                          onChange={(e) => {
                            const p = Math.max(0, parseInt(e.target.value, 10) || 0);
                            setFormData({
                              ...formData,
                              jaringanSaluran: {
                                ...(formData.jaringanSaluran as any),
                                panjangTersierM: p,
                                kondisiTersier: autoKondisiForUnit(p, formData.jaringanSaluran?.kondisiTersier),
                              },
                            });
                          }}
                          placeholder="Contoh: 8000"
                          className="w-full px-2.5 py-1.5 text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">Penilaian Kondisi</label>
                        <select
                          value={formData.jaringanSaluran?.kondisiTersier || 'Tidak Ada'}
                          onChange={(e) => {
                            const k = e.target.value as KondisiFisik;
                            const currP = formData.jaringanSaluran?.panjangTersierM ?? 0;
                            setFormData({
                              ...formData,
                              jaringanSaluran: {
                                ...(formData.jaringanSaluran as any),
                                panjangTersierM: k === 'Tidak Ada' ? 0 : (currP <= 0 ? 500 : currP),
                                kondisiTersier: k,
                              },
                            });
                          }}
                          className={`w-full px-2.5 py-1.5 text-xs rounded-lg font-medium focus:outline-none focus:ring-1 focus:ring-amber-500 border ${
                            formData.jaringanSaluran?.kondisiTersier === 'Tidak Ada'
                              ? 'bg-slate-100 text-slate-500 border-slate-200 italic'
                              : 'bg-slate-50 border-slate-300 text-slate-900'
                          }`}
                        >
                          <option value="Tidak Ada">Tidak Ada (0 Meter)</option>
                          <option value="Baik">Baik</option>
                          <option value="Rusak Ringan">Rusak Ringan</option>
                          <option value="Rusak Sedang">Rusak Sedang</option>
                          <option value="Rusak Berat">Rusak Berat</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bagian 2: Bangunan Pengatur & Pembagi Aliran Air */}
              <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    2. Bangunan Pengatur, Pembagi & Silang Saluran
                  </h4>
                  <span className="text-[10px] text-slate-500 font-medium">Jika Unit = 0, Kondisi Otomatis "Tidak Ada"</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {/* Bangunan Bagi (B) */}
                  <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-2xs space-y-2">
                    <span className="text-xs font-bold text-slate-800 block">Bangunan Bagi (B)</span>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">Jumlah Unit</label>
                        <input
                          type="number"
                          value={formData.jaringanSaluran?.jumlahBangunanBagi ?? 0}
                          onChange={(e) => {
                            const u = Math.max(0, parseInt(e.target.value, 10) || 0);
                            setFormData({
                              ...formData,
                              jaringanSaluran: {
                                ...(formData.jaringanSaluran as any),
                                jumlahBangunanBagi: u,
                                kondisiBangunanBagi: autoKondisiForUnit(u, formData.jaringanSaluran?.kondisiBangunanBagi),
                              },
                            });
                          }}
                          className="w-full px-2 py-1.5 text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">Kondisi</label>
                        <select
                          value={formData.jaringanSaluran?.kondisiBangunanBagi || 'Tidak Ada'}
                          onChange={(e) => {
                            const k = e.target.value as KondisiFisik;
                            const currU = formData.jaringanSaluran?.jumlahBangunanBagi ?? 0;
                            setFormData({
                              ...formData,
                              jaringanSaluran: {
                                ...(formData.jaringanSaluran as any),
                                jumlahBangunanBagi: k === 'Tidak Ada' ? 0 : (currU <= 0 ? 1 : currU),
                                kondisiBangunanBagi: k,
                              },
                            });
                          }}
                          className={`w-full px-2 py-1.5 text-xs rounded-lg font-medium focus:outline-none focus:ring-1 focus:ring-amber-500 border ${
                            formData.jaringanSaluran?.kondisiBangunanBagi === 'Tidak Ada'
                              ? 'bg-slate-100 text-slate-500 border-slate-200 italic'
                              : 'bg-slate-50 border-slate-300 text-slate-900'
                          }`}
                        >
                          <option value="Tidak Ada">Tidak Ada (0 Unit)</option>
                          <option value="Baik">Baik</option>
                          <option value="Rusak Ringan">Rusak Ringan</option>
                          <option value="Rusak Sedang">Rusak Sedang</option>
                          <option value="Rusak Berat">Rusak Berat</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Bangunan Sadap (S) */}
                  <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-2xs space-y-2">
                    <span className="text-xs font-bold text-slate-800 block">Bangunan Sadap (S)</span>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">Jumlah Unit</label>
                        <input
                          type="number"
                          value={formData.jaringanSaluran?.jumlahBangunanSadap ?? 0}
                          onChange={(e) => {
                            const u = Math.max(0, parseInt(e.target.value, 10) || 0);
                            setFormData({
                              ...formData,
                              jaringanSaluran: {
                                ...(formData.jaringanSaluran as any),
                                jumlahBangunanSadap: u,
                                kondisiBangunanSadap: autoKondisiForUnit(u, formData.jaringanSaluran?.kondisiBangunanSadap),
                              },
                            });
                          }}
                          className="w-full px-2 py-1.5 text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">Kondisi</label>
                        <select
                          value={formData.jaringanSaluran?.kondisiBangunanSadap || 'Tidak Ada'}
                          onChange={(e) => {
                            const k = e.target.value as KondisiFisik;
                            const currU = formData.jaringanSaluran?.jumlahBangunanSadap ?? 0;
                            setFormData({
                              ...formData,
                              jaringanSaluran: {
                                ...(formData.jaringanSaluran as any),
                                jumlahBangunanSadap: k === 'Tidak Ada' ? 0 : (currU <= 0 ? 1 : currU),
                                kondisiBangunanSadap: k,
                              },
                            });
                          }}
                          className={`w-full px-2 py-1.5 text-xs rounded-lg font-medium focus:outline-none focus:ring-1 focus:ring-amber-500 border ${
                            formData.jaringanSaluran?.kondisiBangunanSadap === 'Tidak Ada'
                              ? 'bg-slate-100 text-slate-500 border-slate-200 italic'
                              : 'bg-slate-50 border-slate-300 text-slate-900'
                          }`}
                        >
                          <option value="Tidak Ada">Tidak Ada (0 Unit)</option>
                          <option value="Baik">Baik</option>
                          <option value="Rusak Ringan">Rusak Ringan</option>
                          <option value="Rusak Sedang">Rusak Sedang</option>
                          <option value="Rusak Berat">Rusak Berat</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Bangunan Bagi-Sadap (BS) */}
                  <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-2xs space-y-2">
                    <span className="text-xs font-bold text-slate-800 block">Bangunan Bagi-Sadap (BS)</span>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">Jumlah Unit</label>
                        <input
                          type="number"
                          value={formData.jaringanSaluran?.jumlahBangunanBagiSadap ?? 0}
                          onChange={(e) => {
                            const u = Math.max(0, parseInt(e.target.value, 10) || 0);
                            setFormData({
                              ...formData,
                              jaringanSaluran: {
                                ...(formData.jaringanSaluran as any),
                                jumlahBangunanBagiSadap: u,
                                kondisiBangunanBagiSadap: autoKondisiForUnit(u, formData.jaringanSaluran?.kondisiBangunanBagiSadap),
                              },
                            });
                          }}
                          className="w-full px-2 py-1.5 text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">Kondisi</label>
                        <select
                          value={formData.jaringanSaluran?.kondisiBangunanBagiSadap || 'Tidak Ada'}
                          onChange={(e) => {
                            const k = e.target.value as KondisiFisik;
                            const currU = formData.jaringanSaluran?.jumlahBangunanBagiSadap ?? 0;
                            setFormData({
                              ...formData,
                              jaringanSaluran: {
                                ...(formData.jaringanSaluran as any),
                                jumlahBangunanBagiSadap: k === 'Tidak Ada' ? 0 : (currU <= 0 ? 1 : currU),
                                kondisiBangunanBagiSadap: k,
                              },
                            });
                          }}
                          className={`w-full px-2 py-1.5 text-xs rounded-lg font-medium focus:outline-none focus:ring-1 focus:ring-amber-500 border ${
                            formData.jaringanSaluran?.kondisiBangunanBagiSadap === 'Tidak Ada'
                              ? 'bg-slate-100 text-slate-500 border-slate-200 italic'
                              : 'bg-slate-50 border-slate-300 text-slate-900'
                          }`}
                        >
                          <option value="Tidak Ada">Tidak Ada (0 Unit)</option>
                          <option value="Baik">Baik</option>
                          <option value="Rusak Ringan">Rusak Ringan</option>
                          <option value="Rusak Sedang">Rusak Sedang</option>
                          <option value="Rusak Berat">Rusak Berat</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Gorong-gorong Pembawa */}
                  <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-2xs space-y-2">
                    <span className="text-xs font-bold text-slate-800 block">Gorong-gorong Saluran</span>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">Jumlah Unit</label>
                        <input
                          type="number"
                          value={formData.jaringanSaluran?.jumlahGorongGorong ?? 0}
                          onChange={(e) => {
                            const u = Math.max(0, parseInt(e.target.value, 10) || 0);
                            setFormData({
                              ...formData,
                              jaringanSaluran: {
                                ...(formData.jaringanSaluran as any),
                                jumlahGorongGorong: u,
                                kondisiGorongGorong: autoKondisiForUnit(u, formData.jaringanSaluran?.kondisiGorongGorong),
                              },
                            });
                          }}
                          className="w-full px-2 py-1.5 text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">Kondisi</label>
                        <select
                          value={formData.jaringanSaluran?.kondisiGorongGorong || 'Tidak Ada'}
                          onChange={(e) => {
                            const k = e.target.value as KondisiFisik;
                            const currU = formData.jaringanSaluran?.jumlahGorongGorong ?? 0;
                            setFormData({
                              ...formData,
                              jaringanSaluran: {
                                ...(formData.jaringanSaluran as any),
                                jumlahGorongGorong: k === 'Tidak Ada' ? 0 : (currU <= 0 ? 1 : currU),
                                kondisiGorongGorong: k,
                              },
                            });
                          }}
                          className={`w-full px-2 py-1.5 text-xs rounded-lg font-medium focus:outline-none focus:ring-1 focus:ring-amber-500 border ${
                            formData.jaringanSaluran?.kondisiGorongGorong === 'Tidak Ada'
                              ? 'bg-slate-100 text-slate-500 border-slate-200 italic'
                              : 'bg-slate-50 border-slate-300 text-slate-900'
                          }`}
                        >
                          <option value="Tidak Ada">Tidak Ada (0 Unit)</option>
                          <option value="Baik">Baik</option>
                          <option value="Rusak Ringan">Rusak Ringan</option>
                          <option value="Rusak Sedang">Rusak Sedang</option>
                          <option value="Rusak Berat">Rusak Berat</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Talang / Siphon Pembawa */}
                  <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-2xs space-y-2">
                    <span className="text-xs font-bold text-slate-800 block">Talang / Siphon Saluran</span>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">Jumlah Unit</label>
                        <input
                          type="number"
                          value={formData.jaringanSaluran?.jumlahTalangSiphon ?? 0}
                          onChange={(e) => {
                            const u = Math.max(0, parseInt(e.target.value, 10) || 0);
                            setFormData({
                              ...formData,
                              jaringanSaluran: {
                                ...(formData.jaringanSaluran as any),
                                jumlahTalangSiphon: u,
                                kondisiTalangSiphon: autoKondisiForUnit(u, formData.jaringanSaluran?.kondisiTalangSiphon),
                              },
                            });
                          }}
                          className="w-full px-2 py-1.5 text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">Kondisi</label>
                        <select
                          value={formData.jaringanSaluran?.kondisiTalangSiphon || 'Tidak Ada'}
                          onChange={(e) => {
                            const k = e.target.value as KondisiFisik;
                            const currU = formData.jaringanSaluran?.jumlahTalangSiphon ?? 0;
                            setFormData({
                              ...formData,
                              jaringanSaluran: {
                                ...(formData.jaringanSaluran as any),
                                jumlahTalangSiphon: k === 'Tidak Ada' ? 0 : (currU <= 0 ? 1 : currU),
                                kondisiTalangSiphon: k,
                              },
                            });
                          }}
                          className={`w-full px-2 py-1.5 text-xs rounded-lg font-medium focus:outline-none focus:ring-1 focus:ring-amber-500 border ${
                            formData.jaringanSaluran?.kondisiTalangSiphon === 'Tidak Ada'
                              ? 'bg-slate-100 text-slate-500 border-slate-200 italic'
                              : 'bg-slate-50 border-slate-300 text-slate-900'
                          }`}
                        >
                          <option value="Tidak Ada">Tidak Ada (0 Unit)</option>
                          <option value="Baik">Baik</option>
                          <option value="Rusak Ringan">Rusak Ringan</option>
                          <option value="Rusak Sedang">Rusak Sedang</option>
                          <option value="Rusak Berat">Rusak Berat</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 5: NILAI IKSI */}
          {formSection === 'iksi' && (
            <div className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <span className="text-xs text-amber-900 font-semibold block">
                    Total Indeks Kinerja Sistem Irigasi (IKSI)
                  </span>
                  <div className="text-2xl font-mono font-extrabold text-slate-900 mt-0.5 tabular-nums">
                    {(formData.nilaiIKSI || 0).toFixed(2)}%
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-500 block">Klasifikasi</span>
                  <strong className="text-sm font-bold text-amber-900">{formData.kategoriIKSI}</strong>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                    <span>1. Prasarana Fisik (Maksimal 45.00)</span>
                    <span className="font-mono">{formData.rincianIKSI?.prasaranaFisik}</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="45"
                    step="0.5"
                    value={formData.rincianIKSI?.prasaranaFisik || 0}
                    onChange={(e) => handleIksiSubChange('prasaranaFisik', parseFloat(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                </div>

                <div>
                  <label className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                    <span>2. Produktivitas Tanam (Maksimal 15.00)</span>
                    <span className="font-mono">{formData.rincianIKSI?.produktivitasTanam}</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="15"
                    step="0.5"
                    value={formData.rincianIKSI?.produktivitasTanam || 0}
                    onChange={(e) => handleIksiSubChange('produktivitasTanam', parseFloat(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                </div>

                <div>
                  <label className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                    <span>3. Sarana Penunjang (Maksimal 10.00)</span>
                    <span className="font-mono">{formData.rincianIKSI?.saranaPenunjang}</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.5"
                    value={formData.rincianIKSI?.saranaPenunjang || 0}
                    onChange={(e) => handleIksiSubChange('saranaPenunjang', parseFloat(e.target.value))}
                    className="w-full accent-blue-500"
                  />
                </div>

                <div>
                  <label className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                    <span>4. Organisasi Personalia (Maksimal 15.00)</span>
                    <span className="font-mono">{formData.rincianIKSI?.organisasiPersonalia}</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="15"
                    step="0.5"
                    value={formData.rincianIKSI?.organisasiPersonalia || 0}
                    onChange={(e) => handleIksiSubChange('organisasiPersonalia', parseFloat(e.target.value))}
                    className="w-full accent-indigo-500"
                  />
                </div>

                <div>
                  <label className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                    <span>5. Dokumentasi Pengelolaan Aset (Maksimal 5.00)</span>
                    <span className="font-mono">{formData.rincianIKSI?.dokumentasi}</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="5"
                    step="0.1"
                    value={formData.rincianIKSI?.dokumentasi || 0}
                    onChange={(e) => handleIksiSubChange('dokumentasi', parseFloat(e.target.value))}
                    className="w-full accent-teal-500"
                  />
                </div>

                <div>
                  <label className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                    <span>6. Kelembagaan Petani P3A (Maksimal 10.00)</span>
                    <span className="font-mono">{formData.rincianIKSI?.p3a}</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.5"
                    value={formData.rincianIKSI?.p3a || 0}
                    onChange={(e) => handleIksiSubChange('p3a', parseFloat(e.target.value))}
                    className="w-full accent-rose-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* SECTION 6: P3A */}
          {formSection === 'p3a' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nama P3A / GP3A</label>
                  <input
                    type="text"
                    value={formData.dataP3A?.namaP3A || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      dataP3A: {
                        ...(formData.dataP3A as any),
                        namaP3A: e.target.value,
                      },
                    })}
                    placeholder="Contoh: P3A Mitra Tirta"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nama Ketua P3A</label>
                  <input
                    type="text"
                    value={formData.dataP3A?.namaKetua || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      dataP3A: {
                        ...(formData.dataP3A as any),
                        namaKetua: e.target.value,
                      },
                    })}
                    placeholder="Nama lengkap ketua..."
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nomor Kontak / WA</label>
                  <input
                    type="text"
                    value={formData.dataP3A?.noKontak || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      dataP3A: {
                        ...(formData.dataP3A as any),
                        noKontak: e.target.value,
                      },
                    })}
                    placeholder="0812-xxxx-xxxx"
                    className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Keaktifan Iuran Air</label>
                  <select
                    value={formData.dataP3A?.keaktifanIuran || 'Aktif'}
                    onChange={(e) => setFormData({
                      ...formData,
                      dataP3A: {
                        ...(formData.dataP3A as any),
                        keaktifanIuran: e.target.value as KeaktifanIuran,
                      },
                    })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Kurang Aktif">Kurang Aktif</option>
                    <option value="Tidak Aktif">Tidak Aktif</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Jumlah Anggota Petani</label>
                  <input
                    type="number"
                    value={formData.dataP3A?.jumlahAnggota || 0}
                    onChange={(e) => setFormData({
                      ...formData,
                      dataP3A: {
                        ...(formData.dataP3A as any),
                        jumlahAnggota: parseInt(e.target.value, 10) || 0,
                      },
                    })}
                    className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* SECTION 7: USULAN */}
          {formSection === 'usulan' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Kategori Usulan</label>
                  <select
                    value={formData.usulanPenanganan?.kategori || 'O&P Rutin'}
                    onChange={(e) => setFormData({
                      ...formData,
                      usulanPenanganan: {
                        ...(formData.usulanPenanganan as any),
                        kategori: e.target.value as KategoriUsulan,
                      },
                    })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  >
                    <option value="O&P Rutin">O&P Rutin</option>
                    <option value="O&P Berkala">O&P Berkala</option>
                    <option value="Rehabilitasi Jaringan">Rehabilitasi Jaringan</option>
                    <option value="Peningkatan Jaringan">Peningkatan Jaringan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Estimasi Biaya (Rp)</label>
                  <input
                    type="number"
                    value={formData.usulanPenanganan?.estimasiBiayaRp || 0}
                    onChange={(e) => setFormData({
                      ...formData,
                      usulanPenanganan: {
                        ...(formData.usulanPenanganan as any),
                        estimasiBiayaRp: parseInt(e.target.value, 10) || 0,
                      },
                    })}
                    className="w-full px-3 py-2 text-xs font-mono font-bold bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Sumber Dana</label>
                  <select
                    value={formData.usulanPenanganan?.sumberDana || 'APBD Kab. Nagekeo'}
                    onChange={(e) => setFormData({
                      ...formData,
                      usulanPenanganan: {
                        ...(formData.usulanPenanganan as any),
                        sumberDana: e.target.value as SumberDana,
                      },
                    })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  >
                    <option value="APBD Kab. Nagekeo">APBD Kab. Nagekeo</option>
                    <option value="DAK Irigasi">DAK Irigasi (Fisik)</option>
                    <option value="APBD Prov. NTT">APBD Prov. NTT</option>
                    <option value="APBN">APBN (Kemen PUPR)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Catatan Teknis Penanganan & Masalah di Lapangan
                </label>
                <textarea
                  rows={3}
                  value={formData.usulanPenanganan?.catatanTeknis || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    usulanPenanganan: {
                      ...(formData.usulanPenanganan as any),
                      catatanTeknis: e.target.value,
                    },
                  })}
                  placeholder="Uraikan kerusakan, lokasi saluran, atau penanganan mendesak..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Catatan Operasi & Pemeliharaan (O&P) Umum
                </label>
                <textarea
                  rows={2}
                  value={formData.catatanOp || ''}
                  onChange={(e) => setFormData({ ...formData, catatanOp: e.target.value })}
                  placeholder="Catatan debit air saat musim tanam, kendala endapan..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="bg-amber-50/60 border border-amber-200 p-3.5 rounded-xl space-y-2 mt-3">
                <label className="block text-xs font-bold text-slate-900">
                  Status Publikasi &amp; Akses Data Irigasi
                </label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="isPublished"
                      checked={formData.isPublished ?? true}
                      onChange={() => setFormData({ ...formData, isPublished: true })}
                      className="text-amber-500"
                    />
                    <span>🌐 <strong>Publik</strong> (Tampil untuk Umum &amp; Laporan Dinas)</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="isPublished"
                      checked={formData.isPublished === false}
                      onChange={() => setFormData({ ...formData, isPublished: false })}
                      className="text-amber-500"
                    />
                    <span>🔒 <strong>Data Khusus Admin</strong> (Internal Dinas / Draft)</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Form Actions Footer with Instant Google Sheet Sync Notice */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-3 py-1.5 rounded-lg">
              <Zap className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>
                <strong>Webhook Langsung:</strong> Saat tombol Simpan ditekan, data otomatis masuk & muncul di Google Sheet secara realtime.
              </span>
            </div>

            <div className="flex items-center gap-2 justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors"
              >
                Batal
              </button>

              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <Save className="w-4 h-4" />
                <span>
                  {initialData
                    ? 'Simpan Perubahan & Update Google Sheet'
                    : 'Simpan Data & Kirim Langsung ke Google Sheet'}
                </span>
              </button>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
};
