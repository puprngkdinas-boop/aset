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
  KategoriUsulan,
  SumberDana,
  StatusUsulan,
  KeaktifanIuran,
  hitungTotalIKSI
} from '../types/irigasi';
import { X, Save, Building, Layers, Zap, CheckCircle2, Table } from 'lucide-react';

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

  useEffect(() => {
    if (initialData) {
      setFormData(JSON.parse(JSON.stringify(initialData)));
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
            siphon: 0,
            gorongGorong: 6,
            gotMiringTerjunan: 2,
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
          jumlahBangunanSadap: 4,
          jumlahBangunanBagiSadap: 2,
          jumlahTalangSiphon: 1,
          jumlahGorongGorong: 5,
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
      bangunanPelengkap: formData.bangunanPelengkap || {
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
          siphon: 0,
          gorongGorong: 5,
          gotMiringTerjunan: 1,
        },
      },
      jaringanSaluran: formData.jaringanSaluran || {
        panjangPrimerM: 2000,
        kondisiPrimer: 'Baik',
        panjangSekunderM: 3000,
        kondisiSekunder: 'Baik',
        panjangTersierM: 4000,
        kondisiTersier: 'Rusak Ringan',
        jumlahBangunanBagi: 2,
        jumlahBangunanSadap: 4,
        jumlahBangunanBagiSadap: 2,
        jumlahTalangSiphon: 1,
        jumlahGorongGorong: 5,
      },
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
      updatedAt: new Date().toISOString().slice(0, 10),
    };

    onSave(finalDI);
    onClose();
  };

  const bp = formData.bangunanPelengkap;

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
                    onChange={(e) => setFormData({ ...formData, kecamatan: e.target.value as KecamatanNagekeo })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  >
                    {KECAMATAN_NAGEKEO_LIST.map((kec) => (
                      <option key={kec} value={kec}>
                        {kec}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Desa / Kelurahan
                  </label>
                  <input
                    type="text"
                    value={formData.desa || ''}
                    onChange={(e) => setFormData({ ...formData, desa: e.target.value })}
                    placeholder="Nama desa terlayani..."
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
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
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Jembatan Desa / Tani (Unit)</label>
                  <input
                    type="number"
                    value={bp?.jembatanDesaTani?.jumlahUnit ?? 2}
                    onChange={(e) => setFormData({
                      ...formData,
                      bangunanPelengkap: {
                        ...(bp as any),
                        jembatanDesaTani: {
                          jumlahUnit: parseInt(e.target.value, 10) || 0,
                          kondisi: bp?.jembatanDesaTani?.kondisi || 'Baik',
                        },
                      },
                    })}
                    className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Kubangan Cuci Ternak (Unit)</label>
                  <input
                    type="number"
                    value={bp?.kubanganCuciTernak?.jumlahUnit ?? 1}
                    onChange={(e) => setFormData({
                      ...formData,
                      bangunanPelengkap: {
                        ...(bp as any),
                        kubanganCuciTernak: {
                          jumlahUnit: parseInt(e.target.value, 10) || 0,
                          kondisi: bp?.kubanganCuciTernak?.kondisi || 'Baik',
                        },
                      },
                    })}
                    className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tangga Cuci Petani (Unit)</label>
                  <input
                    type="number"
                    value={bp?.tanggaCuciMandiPetani?.jumlahUnit ?? 3}
                    onChange={(e) => setFormData({
                      ...formData,
                      bangunanPelengkap: {
                        ...(bp as any),
                        tanggaCuciMandiPetani: {
                          jumlahUnit: parseInt(e.target.value, 10) || 0,
                          kondisi: bp?.tanggaCuciMandiPetani?.kondisi || 'Baik',
                        },
                      },
                    })}
                    className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Pelimpah Samping Wasteweir (Unit)</label>
                  <input
                    type="number"
                    value={bp?.pelimpahSampingWasteweir?.jumlahUnit ?? 1}
                    onChange={(e) => setFormData({
                      ...formData,
                      bangunanPelengkap: {
                        ...(bp as any),
                        pelimpahSampingWasteweir: {
                          jumlahUnit: parseInt(e.target.value, 10) || 0,
                          kondisi: bp?.pelimpahSampingWasteweir?.kondisi || 'Baik',
                        },
                      },
                    })}
                    className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Saringan Sampah Trashrack (Unit)</label>
                  <input
                    type="number"
                    value={bp?.trashrackSaringanSampah?.jumlahUnit ?? 1}
                    onChange={(e) => setFormData({
                      ...formData,
                      bangunanPelengkap: {
                        ...(bp as any),
                        trashrackSaringanSampah: {
                          jumlahUnit: parseInt(e.target.value, 10) || 0,
                          kondisi: bp?.trashrackSaringanSampah?.kondisi || 'Baik',
                        },
                      },
                    })}
                    className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Gardu Jaga / Pos POB (Unit)</label>
                  <input
                    type="number"
                    value={bp?.garduJagaRumahPintu?.jumlahUnit ?? 1}
                    onChange={(e) => setFormData({
                      ...formData,
                      bangunanPelengkap: {
                        ...(bp as any),
                        garduJagaRumahPintu: {
                          jumlahUnit: parseInt(e.target.value, 10) || 0,
                          kondisi: bp?.garduJagaRumahPintu?.kondisi || 'Baik',
                        },
                      },
                    })}
                    className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Panjang Jalan Inspeksi (Km)</label>
                  <input
                    type="number"
                    step="any"
                    value={bp?.jalanInspeksi?.panjangKm ?? 2.5}
                    onChange={(e) => setFormData({
                      ...formData,
                      bangunanPelengkap: {
                        ...(bp as any),
                        jalanInspeksi: {
                          ...(bp?.jalanInspeksi as any),
                          panjangKm: parseFloat(e.target.value) || 0,
                        },
                      },
                    })}
                    className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Jenis Perkerasan Jalan</label>
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
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  >
                    <option value="Rabat Beton">Rabat Beton</option>
                    <option value="Aspal">Aspal</option>
                    <option value="Sirtu/Krikil">Sirtu/Krikil</option>
                    <option value="Tanah">Tanah</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Patok Hektometer / Sempadan</label>
                  <input
                    type="number"
                    value={bp?.patokHektometerSempadan?.jumlahUnit ?? 25}
                    onChange={(e) => setFormData({
                      ...formData,
                      bangunanPelengkap: {
                        ...(bp as any),
                        patokHektometerSempadan: {
                          jumlahUnit: parseInt(e.target.value, 10) || 0,
                          kondisi: bp?.patokHektometerSempadan?.kondisi || 'Baik',
                        },
                      },
                    })}
                    className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* SECTION 4: SALURAN */}
          {formSection === 'saluran' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Saluran Primer (m)</label>
                  <input
                    type="number"
                    value={formData.jaringanSaluran?.panjangPrimerM ?? 0}
                    onChange={(e) => setFormData({
                      ...formData,
                      jaringanSaluran: {
                        ...(formData.jaringanSaluran as any),
                        panjangPrimerM: parseInt(e.target.value, 10) || 0,
                      },
                    })}
                    className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Saluran Sekunder (m)</label>
                  <input
                    type="number"
                    value={formData.jaringanSaluran?.panjangSekunderM ?? 0}
                    onChange={(e) => setFormData({
                      ...formData,
                      jaringanSaluran: {
                        ...(formData.jaringanSaluran as any),
                        panjangSekunderM: parseInt(e.target.value, 10) || 0,
                      },
                    })}
                    className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Saluran Tersier (m)</label>
                  <input
                    type="number"
                    value={formData.jaringanSaluran?.panjangTersierM ?? 0}
                    onChange={(e) => setFormData({
                      ...formData,
                      jaringanSaluran: {
                        ...(formData.jaringanSaluran as any),
                        panjangTersierM: parseInt(e.target.value, 10) || 0,
                      },
                    })}
                    className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Bangunan Bagi (Unit)</label>
                  <input
                    type="number"
                    value={formData.jaringanSaluran?.jumlahBangunanBagi ?? 2}
                    onChange={(e) => setFormData({
                      ...formData,
                      jaringanSaluran: {
                        ...(formData.jaringanSaluran as any),
                        jumlahBangunanBagi: parseInt(e.target.value, 10) || 0,
                      },
                    })}
                    className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Bangunan Sadap (Unit)</label>
                  <input
                    type="number"
                    value={formData.jaringanSaluran?.jumlahBangunanSadap ?? 4}
                    onChange={(e) => setFormData({
                      ...formData,
                      jaringanSaluran: {
                        ...(formData.jaringanSaluran as any),
                        jumlahBangunanSadap: parseInt(e.target.value, 10) || 0,
                      },
                    })}
                    className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Gorong-gorong (Unit)</label>
                  <input
                    type="number"
                    value={formData.jaringanSaluran?.jumlahGorongGorong ?? 5}
                    onChange={(e) => setFormData({
                      ...formData,
                      jaringanSaluran: {
                        ...(formData.jaringanSaluran as any),
                        jumlahGorongGorong: parseInt(e.target.value, 10) || 0,
                      },
                    })}
                    className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
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
