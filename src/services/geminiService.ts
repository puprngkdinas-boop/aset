import { GoogleGenAI } from '@google/genai';
import { DaerahIrigasi } from '../types/irigasi';

export interface AnalisisHasil {
  rekomendasiTeknis: string;
  prioritasPenanganan: 'Sangat Mendesak (Darurat)' | 'Prioritas Tinggi (DAK 2027)' | 'Prioritas Menengah (O&P Berkala)' | 'Pemeliharaan Rutin';
  estimasiAnggaranRekomendasi: string;
  saranKelembagaanP3A: string;
  poinKunci: string[];
}

export async function analisaKondisiIrigasiDenganAI(di: DaerahIrigasi): Promise<AnalisisHasil> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || (typeof process !== 'undefined' ? process.env?.GEMINI_API_KEY : '');

  // If no API key or error, use deterministic PUPR technical standard fallback
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return generateLocalPUPRAnalysis(di);
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `Anda adalah Ahli Teknik Pengairan Senior Ditjen Sumber Daya Air (SDA) Kementerian PUPR yang bertugas menyusun telaah teknis untuk Dinas PUPR Kabupaten Nagekeo, Nusa Tenggara Timur.

Berikut adalah data teknis Daerah Irigasi (DI):
- Nama DI: ${di.nama} (${di.kodeDI})
- Kecamatan: ${di.kecamatan}, Desa: ${di.desa}
- Kewenangan: ${di.kewenangan}
- Luas Baku: ${di.luasBaku} Ha, Fungsional: ${di.luasFungsional} Ha
- Kondisi Fisik Jaringan: ${di.kondisiFisik}
- Nilai IKSI (e-PAKSI): ${di.nilaiIKSI} (${di.kategoriIKSI})
  * Prasarana Fisik: ${di.rincianIKSI?.prasaranaFisik ?? 0}/45
  * Produktivitas Tanam: ${di.rincianIKSI?.produktivitasTanam ?? 0}/15
  * Sarana Penunjang: ${di.rincianIKSI?.saranaPenunjang ?? 0}/10
  * Organisasi Personalia: ${di.rincianIKSI?.organisasiPersonalia ?? 0}/15
  * Dokumentasi: ${di.rincianIKSI?.dokumentasi ?? 0}/5
  * P3A: ${di.rincianIKSI?.p3a ?? 0}/10
- Bangunan Utama: ${di.bangunanUtama?.tipe} (${di.bangunanUtama?.nama}), Kondisi: ${di.bangunanUtama?.kondisi}, Debit: ${di.bangunanUtama?.debitRataRataM3s} m³/s
- Saluran Primer: ${di.jaringanSaluran?.panjangPrimerM} m (Kondisi: ${di.jaringanSaluran?.kondisiPrimer})
- Saluran Sekunder: ${di.jaringanSaluran?.panjangSekunderM} m (Kondisi: ${di.jaringanSaluran?.kondisiSekunder})
- Saluran Tersier: ${di.jaringanSaluran?.panjangTersierM} m (Kondisi: ${di.jaringanSaluran?.kondisiTersier})
- Kelembagaan P3A: ${di.dataP3A?.namaP3A || 'Belum terbentuk'}, Keaktifan Iuran: ${di.dataP3A?.keaktifanIuran || 'Tidak Aktif'}
- Usulan Saat Ini: ${di.usulanPenanganan?.kategori} (Estimasi Rp ${di.usulanPenanganan?.estimasiBiayaRp?.toLocaleString('id-ID')})

Tolong berikan analisis teknis berdasar Permen PUPR No. 12/PRT/M/2015 dan Permen PUPR No. 14/PRT/M/2015 dalam format JSON murni tanpa markdown dengan keys:
{
  "prioritasPenanganan": "Sangat Mendesak (Darurat)" | "Prioritas Tinggi (DAK 2027)" | "Prioritas Menengah (O&P Berkala)" | "Pemeliharaan Rutin",
  "rekomendasiTeknis": "ringkasan uraian rekomendasi teknis sipil basah dan saluran",
  "estimasiAnggaranRekomendasi": "kisaran rekomendasi anggaran yang realistis untuk Nagekeo",
  "saranKelembagaanP3A": "arahan pemberdayaan petani pemakai air",
  "poinKunci": ["poin 1", "poin 2", "poin 3", "poin 4"]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    if (response && response.text) {
      const parsed = JSON.parse(response.text.trim());
      return parsed;
    }
    return generateLocalPUPRAnalysis(di);
  } catch (error) {
    console.warn('AI analysis fallback due to error:', error);
    return generateLocalPUPRAnalysis(di);
  }
}

function generateLocalPUPRAnalysis(di: DaerahIrigasi): AnalisisHasil {
  const isRusakBerat = di.kondisiFisik === 'Rusak Berat' || di.nilaiIKSI < 55;
  const isRusakSedang = di.kondisiFisik === 'Rusak Sedang' || (di.nilaiIKSI >= 55 && di.nilaiIKSI < 70);

  if (isRusakBerat) {
    return {
      prioritasPenanganan: 'Sangat Mendesak (Darurat)',
      rekomendasiTeknis: `Kondisi prasarana fisik Daerah Irigasi ${di.nama} berada di bawah ambang batas minimal e-PAKSI (IKSI ${di.nilaiIKSI}%). Diperlukan intervensi rekonstruksi bendung/intake serta lining ulang saluran primer/sekunder sepanjang ${(di.jaringanSaluran?.panjangPrimerM * 0.4).toFixed(0)} m guna mencegah kegagalan suplai air pada areal fungsional ${di.luasFungsional} Ha.`,
      estimasiAnggaranRekomendasi: `Rp ${(Math.max(di.usulanPenanganan?.estimasiBiayaRp || 0, di.luasFungsional * 4500000)).toLocaleString('id-ID')} (Usulan DAK Fisik Tematik Ketahanan Pangan)`,
      saranKelembagaanP3A: `Pemberdayaan intensif kelembagaan ${di.dataP3A?.namaP3A || 'P3A setempat'} melalui bimbingan teknis operasi pintu air dan reaktivasi iuran pengelolaan air (IPA).`,
      poinKunci: [
        `Tingkat kerusakan sistemik memerlukan penanganan struktur permanen`,
        `Potensi kehilangan debit akibat rembesan dan kerusakan lining mencapai >35%`,
        `Rekomendasi alokasi DAK Fisik Penugasan Bidang Irigasi Tahun Anggaran 2027`,
        `Penyusunan DED (Detail Engineering Design) dan uji sondir tanah di lokasi intake`,
      ],
    };
  }

  if (isRusakSedang) {
    return {
      prioritasPenanganan: 'Prioritas Tinggi (DAK 2027)',
      rekomendasiTeknis: `Perlu rehabilitasi parsial pada ruas saluran sekunder dan perbaikan pintu intake yang aus. Normalisasi sedimen pada kantong lumpur di ${di.bangunanUtama?.nama || 'Bendung'} untuk mengembalikan kapasitas debit rencana ${di.bangunanUtama?.debitRataRataM3s || 1.0} m³/detik.`,
      estimasiAnggaranRekomendasi: `Rp ${(di.usulanPenanganan?.estimasiBiayaRp || di.luasFungsional * 2500000).toLocaleString('id-ID')} (DAK Irigasi / APBD Nagekeo)`,
      saranKelembagaanP3A: `Penguatan koordinasi P3A dengan Juru Pengairan Dinas PUPR dalam penyusunan jadwal giliran air musim tanam II (Gadu).`,
      poinKunci: [
        `Rehabilitasi segmental pada titik-titik rawan bocor saluran pembawa`,
        `Penggantian stang ulir dan pelat pintu air pengatur`,
        `Pelatihan juru pintu air dan pengurus P3A terkait monitoring e-PAKSI`,
        `Pembersihan vegetasi liar di bantaran tanggul saluran`,
      ],
    };
  }

  return {
    prioritasPenanganan: 'Pemeliharaan Rutin',
    rekomendasiTeknis: `Kinerja sistem irigasi ${di.nama} berjalan sangat memuaskan dengan indeks IKSI ${di.nilaiIKSI}% (${di.kategoriIKSI}). Fokus kegiatan dititikberatkan pada Operasi & Pemeliharaan (O&P) rutin berkala, pelumasan pintu air, dan pembersihan gulma saluran.`,
    estimasiAnggaranRekomendasi: `Rp ${(di.usulanPenanganan?.estimasiBiayaRp || di.luasFungsional * 600000).toLocaleString('id-ID')} (Alokasi O&P APBD Kabupaten)`,
    saranKelembagaanP3A: `Pertahankan status keaktifan P3A ${di.dataP3A?.namaP3A || ''} dan replikasi model kemandirian iuran air ke D.I. lainnya di Kecamatan ${di.kecamatan}.`,
    poinKunci: [
      `Kondisi hidrolis dan struktural jaringan berada dalam kondisi prima`,
      `Efisiensi penyaluran air irigasi mencapai di atas 75%`,
      `Pertahankan jadwal rotasi pengaliran air yang tertib`,
      `Pengawasan berkala patok sempadan saluran terhadap alih fungsi lahan`,
    ],
  };
}
