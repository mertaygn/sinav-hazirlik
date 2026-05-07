import { describe, it, expect } from 'vitest';
import { validateQuestions, kontrolEdilmisMi } from '../utils/validateQuestions.js';
import sorularJson from '../data/questions.json';

// Geçerli soru şablonu
function gecerliSoru(partial = {}) {
  return {
    id: 'TEST-001',
    dersKodu: 'İŞL132U',
    dersAdi: 'Finansal Muhasebe',
    unite: 1,
    konu: 'Test',
    soru: 'Test sorusu metni',
    secenekler: { A: 'Seçenek A', B: 'Seçenek B', C: 'Seçenek C', D: 'Doğru', E: 'Seçenek E' },
    dogruCevap: 'D',
    aciklama: 'Test açıklama.',
    zorluk: 'kolay',
    guvenDurumu: 'kontrol_edildi',
    kaynak: { tur: 'Claude üretimi', yil: null, donem: null, sinav: null, sayfa: null, not: '' },
    soruTipi: 'benzer_soru',
    ...partial,
  };
}

describe('validateQuestions — geçerli veri', () => {
  it('geçerli tekil soru hatasız geçer', () => {
    const { hatalar } = validateQuestions([gecerliSoru()]);
    expect(hatalar).toHaveLength(0);
  });

  it('geçerli sorular dizisi hatasız geçer', () => {
    const sorular = [
      gecerliSoru({ id: 'T-001', dogruCevap: 'A' }),
      gecerliSoru({ id: 'T-002', dogruCevap: 'B' }),
    ];
    const { hatalar } = validateQuestions(sorular);
    expect(hatalar).toHaveLength(0);
  });
});

describe('validateQuestions — zorunlu alan hataları', () => {
  it('eksik dogruCevap hata verir', () => {
    const { hatalar } = validateQuestions([gecerliSoru({ dogruCevap: undefined })]);
    expect(hatalar.some(h => h.includes('dogruCevap'))).toBe(true);
  });

  it('geçersiz dogruCevap (F harfi) hata verir', () => {
    const { hatalar } = validateQuestions([gecerliSoru({ dogruCevap: 'F' })]);
    expect(hatalar.some(h => h.includes('dogruCevap'))).toBe(true);
  });

  it('dogruCevap secenekler içinde yoksa hata verir', () => {
    const soru = gecerliSoru({ dogruCevap: 'E', secenekler: { A: 'a', B: 'b', C: 'c', D: 'd' } });
    const { hatalar } = validateQuestions([soru]);
    expect(hatalar.some(h => h.includes('secenekler'))).toBe(true);
  });

  it('geçersiz dersKodu hata verir', () => {
    const { hatalar } = validateQuestions([gecerliSoru({ dersKodu: 'YANLIS999' })]);
    expect(hatalar.some(h => h.includes('dersKodu'))).toBe(true);
  });

  it('boş soru metni hata verir', () => {
    const { hatalar } = validateQuestions([gecerliSoru({ soru: '' })]);
    expect(hatalar.some(h => h.includes('metni') || h.includes('Soru'))).toBe(true);
  });

  it('boş açıklama hata verir', () => {
    const { hatalar } = validateQuestions([gecerliSoru({ aciklama: '' })]);
    expect(hatalar.some(h => h.includes('Açıklama'))).toBe(true);
  });

  it('eksik ünite hata verir', () => {
    const { hatalar } = validateQuestions([gecerliSoru({ unite: undefined })]);
    expect(hatalar.some(h => h.includes('nite'))).toBe(true);
  });
});

describe('validateQuestions — duplicate kontrolleri', () => {
  it('duplicate ID yakalanır', () => {
    const sorular = [gecerliSoru({ id: 'AYNI-001' }), gecerliSoru({ id: 'AYNI-001' })];
    const { hatalar } = validateQuestions(sorular);
    expect(hatalar.some(h => h.toLowerCase().includes('duplicate'))).toBe(true);
  });

  it('duplicate soru metni uyarı verir', () => {
    const sorular = [
      gecerliSoru({ id: 'T-001', soru: 'Tamamen aynı soru metni' }),
      gecerliSoru({ id: 'T-002', soru: 'Tamamen aynı soru metni' }),
    ];
    const { uyarilar } = validateQuestions(sorular);
    expect(uyarilar.some(u => u.toLowerCase().includes('duplicate'))).toBe(true);
  });

  it('farklı ID ve farklı metin → hata yok', () => {
    const sorular = [
      gecerliSoru({ id: 'T-001', soru: 'Birinci soru' }),
      gecerliSoru({ id: 'T-002', soru: 'İkinci soru' }),
    ];
    const { hatalar } = validateQuestions(sorular);
    expect(hatalar).toHaveLength(0);
  });
});

describe('validateQuestions — kaynak ve güven uyarıları', () => {
  it('kaynak eksikse uyarı verir', () => {
    const { uyarilar } = validateQuestions([gecerliSoru({ kaynak: null })]);
    expect(uyarilar.some(u => u.toLowerCase().includes('kaynak'))).toBe(true);
  });

  it('"supheli" guvenDurumu uyarı verir', () => {
    const { uyarilar } = validateQuestions([gecerliSoru({ guvenDurumu: 'supheli' })]);
    expect(uyarilar.some(u => u.includes('pheli'))).toBe(true);
  });

  it('geçersiz guvenDurumu uyarı verir', () => {
    const { uyarilar } = validateQuestions([gecerliSoru({ guvenDurumu: 'bilinmiyor' })]);
    expect(uyarilar.some(u => u.includes('guvenDurumu'))).toBe(true);
  });
});

describe('kontrolEdilmisMi', () => {
  it('kontrol_edildi → true', () => {
    expect(kontrolEdilmisMi({ guvenDurumu: 'kontrol_edildi' })).toBe(true);
  });

  it('kontrol_gerekli → false', () => {
    expect(kontrolEdilmisMi({ guvenDurumu: 'kontrol_gerekli' })).toBe(false);
  });

  it('supheli → false', () => {
    expect(kontrolEdilmisMi({ guvenDurumu: 'supheli' })).toBe(false);
  });
});

describe('Gerçek questions.json doğrulaması', () => {
  it('ID\'ler benzersizdir', () => {
    const idler = sorularJson.map(s => s.id);
    const tekil = new Set(idler);
    expect(tekil.size).toBe(idler.length);
  });

  it('Tüm sorularda dersKodu geçerlidir', () => {
    const { hatalar } = validateQuestions(sorularJson);
    const dersHatalari = hatalar.filter(h => h.includes('dersKodu'));
    expect(dersHatalari).toHaveLength(0);
  });

  it('Tüm sorularda dogruCevap geçerlidir', () => {
    const { hatalar } = validateQuestions(sorularJson);
    const cevapHatalari = hatalar.filter(h => h.includes('dogruCevap') || h.includes('secenekler'));
    expect(cevapHatalari).toHaveLength(0);
  });

  it('Tüm sorularda açıklama var', () => {
    const { hatalar } = validateQuestions(sorularJson);
    const aciklamaHatalari = hatalar.filter(h => h.includes('Açıklama'));
    expect(aciklamaHatalari).toHaveLength(0);
  });

  it('6 dersin hepsi temsil ediliyor', () => {
    const dersler = new Set(sorularJson.map(s => s.dersKodu));
    expect(dersler.size).toBe(6);
  });

  it('Kontrol edildi sorular guvenDurumu alanına sahip', () => {
    const kontrolEdildi = sorularJson.filter(s => s.guvenDurumu === 'kontrol_edildi');
    expect(kontrolEdildi.length).toBeGreaterThan(0);
  });
});
