export function netHesapla(dogru, yanlis) {
  return dogru - yanlis / 4;
}

export function tahminPuanHesapla(net) {
  return Math.round(net * 5 * 10) / 10;
}

export function riskDurumu(net) {
  if (net >= 10) return { renk: 'yesil', metin: 'Daha Güvenli', emoji: '✓' };
  if (net >= 7)  return { renk: 'sari',  metin: 'Sınırda',      emoji: '!' };
  return           { renk: 'kirmizi', metin: 'Riskli',       emoji: '✗' };
}

export function dersRiskDurumu(dogru, yanlis) {
  const net = netHesapla(dogru, yanlis);
  return riskDurumu(net);
}

const DERS_ONCELIGI = {
  'İŞL132U': { oncelik: 1, aciklama: 'Mesleki avantaj – önce bu dersi çalış' },
  'İŞL106U': { oncelik: 2, aciklama: 'Hızlı net çıkarılabilecek ders' },
  'İŞL118U': { oncelik: 3, aciklama: 'Hızlı net çıkarılabilecek ders' },
  'İKT104U': { oncelik: 4, aciklama: 'Kavram tekrarı gerekli' },
  'SOS114U': { oncelik: 5, aciklama: 'Kavram tekrarı gerekli' },
  'İNG102U': { oncelik: 6, aciklama: 'Temel kalıp ve pratik odaklı çalış' },
};

export function dersleriSirala(dersler, durum) {
  return [...dersler].sort((a, b) => {
    // Önce riskli dersler, sonra öncelik sırası
    const aRisk = dersRiskDurumu(a.dogru, a.yanlis).renk;
    const bRisk = dersRiskDurumu(b.dogru, b.yanlis).renk;
    const riskSira = { kirmizi: 0, sari: 1, yesil: 2 };
    if (riskSira[aRisk] !== riskSira[bRisk]) return riskSira[aRisk] - riskSira[bRisk];
    const aOncelik = DERS_ONCELIGI[a.dersKodu]?.oncelik || 99;
    const bOncelik = DERS_ONCELIGI[b.dersKodu]?.oncelik || 99;
    return aOncelik - bOncelik;
  });
}

export function dersOncelikAciklama(dersKodu) {
  return DERS_ONCELIGI[dersKodu]?.aciklama || '';
}

export function karistirilmisArray(arr) {
  const kopi = [...arr];
  for (let i = kopi.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [kopi[i], kopi[j]] = [kopi[j], kopi[i]];
  }
  return kopi;
}
