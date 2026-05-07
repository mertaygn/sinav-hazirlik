const GECERLI_DERSLER = new Set([
  'İKT104U', 'İŞL106U', 'İŞL118U', 'İNG102U', 'İŞL132U', 'SOS114U',
]);
const GECERLI_CEVAPLAR = new Set(['A', 'B', 'C', 'D', 'E']);
const GECERLI_GUVEN = new Set(['kontrol_edildi', 'kontrol_gerekli', 'supheli']);

export function validateQuestions(sorular) {
  const hatalar = [];
  const uyarilar = [];
  const idler = new Map();      // id → index
  const soruMetinleri = new Map(); // metin → id

  sorular.forEach((soru, i) => {
    const ref = `[${soru.id || `#${i}`}]`;

    // --- ZORUNLU ALAN KONTROLLERİ ---
    if (!soru.id) {
      hatalar.push(`${ref} id alanı eksik.`);
    } else if (idler.has(soru.id)) {
      hatalar.push(`${ref} Duplicate ID — daha önce #${idler.get(soru.id)} numaralı soruda da kullanılmış.`);
    } else {
      idler.set(soru.id, i);
    }

    if (!soru.dersKodu || !GECERLI_DERSLER.has(soru.dersKodu)) {
      hatalar.push(`${ref} Geçersiz dersKodu: "${soru.dersKodu}".`);
    }

    if (!soru.soru || soru.soru.trim() === '') {
      hatalar.push(`${ref} Soru metni boş.`);
    } else {
      const metin = soru.soru.trim().toLowerCase();
      if (soruMetinleri.has(metin)) {
        uyarilar.push(`${ref} Duplicate soru metni — ${soruMetinleri.get(metin)} ile aynı.`);
      } else {
        soruMetinleri.set(metin, soru.id);
      }
    }

    if (!soru.dogruCevap || !GECERLI_CEVAPLAR.has(soru.dogruCevap)) {
      hatalar.push(`${ref} Geçersiz dogruCevap: "${soru.dogruCevap}". A/B/C/D/E olmalı.`);
    } else if (!soru.secenekler || !soru.secenekler[soru.dogruCevap]) {
      hatalar.push(`${ref} dogruCevap "${soru.dogruCevap}" secenekler içinde yok.`);
    }

    if (!soru.aciklama || soru.aciklama.trim() === '') {
      hatalar.push(`${ref} Açıklama boş.`);
    }

    if (!soru.unite) {
      hatalar.push(`${ref} Ünite bilgisi eksik.`);
    }

    // --- UYARI SEVİYESİ KONTROLLER ---
    if (!soru.guvenDurumu || !GECERLI_GUVEN.has(soru.guvenDurumu)) {
      uyarilar.push(`${ref} guvenDurumu eksik veya geçersiz — "kontrol_gerekli" sayılacak.`);
    }

    if (!soru.kaynak || !soru.kaynak.tur) {
      uyarilar.push(`${ref} Kaynak bilgisi eksik.`);
    }

    if (soru.guvenDurumu === 'supheli') {
      uyarilar.push(`${ref} Şüpheli işaretli — sınav moduna dahil edilmeyecek.`);
    }
  });

  return { hatalar, uyarilar };
}

// Soru güvenilirliği kontrolü (mini sınav için)
export function kontrolEdilmisMi(soru) {
  return soru.guvenDurumu === 'kontrol_edildi';
}

// Kalite raporu (VeriKontrolPaneli için)
export function kaliteRaporu(sorular) {
  const dersler = {};
  const uniteler = {};
  let kaynakEksik = 0;
  let aciklamaEksik = 0;
  let kontrolEdilmemis = 0;
  let supheli = 0;

  sorular.forEach(s => {
    // Ders dağılımı
    if (!dersler[s.dersKodu]) dersler[s.dersKodu] = 0;
    dersler[s.dersKodu]++;

    // Ünite dağılımı
    const uniteKey = `${s.dersKodu} Ü${s.unite}`;
    if (!uniteler[uniteKey]) uniteler[uniteKey] = 0;
    uniteler[uniteKey]++;

    if (!s.kaynak?.tur) kaynakEksik++;
    if (!s.aciklama?.trim()) aciklamaEksik++;
    if (s.guvenDurumu !== 'kontrol_edildi') kontrolEdilmemis++;
    if (s.guvenDurumu === 'supheli') supheli++;
  });

  const { hatalar, uyarilar } = validateQuestions(sorular);

  return {
    toplam: sorular.length,
    dersler,
    uniteler,
    kaynakEksik,
    aciklamaEksik,
    kontrolEdilmemis,
    supheli,
    hataSayisi: hatalar.length,
    uyariSayisi: uyarilar.length,
    hatalar,
    uyarilar,
  };
}
