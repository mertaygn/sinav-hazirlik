const STORAGE_KEY = 'sinav_hazirlik_v1';

function yukle() {
  try {
    const veri = localStorage.getItem(STORAGE_KEY);
    return veri ? JSON.parse(veri) : null;
  } catch {
    return null;
  }
}

function kaydet(veri) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(veri));
  } catch {
    // localStorage dolmuş olabilir
  }
}

export function baslangicDurumu() {
  return {
    cevaplar: {},      // { soruId: { dogru: bool, sayac: number, sonTarih: string } }
    sinavlar: [],      // [{ dersKodu, tarih, dogru, yanlis, bos }]
  };
}

export function durumYukle() {
  return yukle() || baslangicDurumu();
}

export function durumKaydet(durum) {
  kaydet(durum);
}

export function cevapKaydet(durum, soruId, dogru) {
  const mevcutCevap = durum.cevaplar[soruId];
  const yeniCevap = {
    dogru,
    sayac: (mevcutCevap?.sayac || 0) + 1,
    ardisikDogru: dogru ? (mevcutCevap?.ardisikDogru || 0) + 1 : 0,
    sonTarih: new Date().toISOString(),
  };
  const yeniDurum = {
    ...durum,
    cevaplar: { ...durum.cevaplar, [soruId]: yeniCevap },
  };
  durumKaydet(yeniDurum);
  return yeniDurum;
}

export function sinavKaydet(durum, dersKodu, dogru, yanlis, bos) {
  const sinavKaydi = {
    dersKodu,
    tarih: new Date().toISOString(),
    dogru,
    yanlis,
    bos,
  };
  const yeniDurum = {
    ...durum,
    sinavlar: [...durum.sinavlar, sinavKaydi],
  };
  durumKaydet(yeniDurum);
  return yeniDurum;
}

export function dersCevaplari(durum, dersKodu, sorular) {
  const dersSorulari = sorular.filter(s => s.dersKodu === dersKodu);
  let dogru = 0, yanlis = 0;
  for (const soru of dersSorulari) {
    const cevap = durum.cevaplar[soru.id];
    if (!cevap) continue;
    if (cevap.dogru) dogru++;
    else yanlis++;
  }
  return { dogru, yanlis, toplam: dersSorulari.length };
}

// Yanlış yapılan ve henüz "öğrenilmedi" sayılan sorular
export function yanlislar(durum, sorular, dersKodu) {
  const filtreli = dersKodu
    ? sorular.filter(s => s.dersKodu === dersKodu)
    : sorular;

  return filtreli.filter(soru => {
    const cevap = durum.cevaplar[soru.id];
    if (!cevap) return false;
    // Son cevabı yanlışsa veya ardışık doğru < 2 ise yanlışlar listesinde tut
    return !cevap.dogru || cevap.ardisikDogru < 2;
  });
}

export function ogrenildi(durum, soruId) {
  const cevap = durum.cevaplar[soruId];
  return cevap?.ardisikDogru >= 2;
}

export function tumVeriyiSil() {
  localStorage.removeItem(STORAGE_KEY);
}
