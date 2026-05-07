import { describe, it, expect } from 'vitest';
import { validateQuestions, kaliteRaporu } from '../utils/validateQuestions.js';

function temelSoru(overrides = {}) {
  return {
    id: 'TST001-001',
    dersKodu: 'İŞL132U',
    dersAdi: 'Finansal Muhasebe',
    unite: 1,
    konu: 'Hesap',
    soru: 'Bu bir test sorusudur?',
    secenekler: { A: 'Bir', B: 'İki', C: 'Üç', D: 'Dört', E: 'Beş' },
    dogruCevap: 'A',
    aciklama: 'Bu açıklama yeterince uzun ve bilgilendirici olmalıdır.',
    soruTipi: 'benzer_soru',
    guvenDurumu: 'kontrol_edildi',
    kaynak: { tur: 'benzer_soru' },
    ...overrides,
  };
}

describe('Geçerli soru verisi', () => {
  it('hatasız geçmeli', () => {
    const { hatalar } = validateQuestions([temelSoru()]);
    expect(hatalar).toHaveLength(0);
  });
});

describe('Eksik zorunlu alanlar', () => {
  it('eksik dogruCevap hata vermeli', () => {
    const { hatalar } = validateQuestions([temelSoru({ dogruCevap: '' })]);
    expect(hatalar.some(h => /dogruCevap/i.test(h) || /cevap/i.test(h))).toBe(true);
  });

  it('dogruCevap seçeneklerde yoksa hata vermeli', () => {
    const { hatalar } = validateQuestions([temelSoru({ dogruCevap: 'Z' })]);
    expect(hatalar.some(h => /Z/i.test(h) || /seçenek/i.test(h) || /secenek/i.test(h))).toBe(true);
  });

  it('boş soru metni hata vermeli', () => {
    const { hatalar } = validateQuestions([temelSoru({ soru: '' })]);
    expect(hatalar.some(h => /soru/i.test(h))).toBe(true);
  });

  it('boş açıklama hata vermeli', () => {
    const { hatalar } = validateQuestions([temelSoru({ aciklama: '' })]);
    expect(hatalar.some(h => /açıklama/i.test(h) || /aciklama/i.test(h))).toBe(true);
  });

  it('geçersiz unite (0) hata vermeli', () => {
    const { hatalar } = validateQuestions([temelSoru({ unite: 0 })]);
    expect(hatalar.some(h => /ünite/i.test(h) || /unite/i.test(h))).toBe(true);
  });

  it('geçersiz dersKodu hata vermeli', () => {
    const { hatalar } = validateQuestions([temelSoru({ dersKodu: 'XYZ999' })]);
    expect(hatalar.some(h => /dersKodu/i.test(h) || /ders/i.test(h))).toBe(true);
  });
});

describe('Tekrar eden veriler', () => {
  it('aynı ID iki kez kullanılırsa hata vermeli', () => {
    const s1 = temelSoru({ id: 'TEKRAR-001' });
    const s2 = temelSoru({ id: 'TEKRAR-001', soru: 'Farklı soru metni?' });
    const { hatalar } = validateQuestions([s1, s2]);
    expect(hatalar.some(h => /TEKRAR-001/i.test(h) || /tekrar/i.test(h) || /duplicate/i.test(h))).toBe(true);
  });

  it('aynı soru metni iki kez kullanılırsa uyarı vermeli', () => {
    const s1 = temelSoru({ id: 'A001', soru: 'Tamamen aynı soru metni?' });
    const s2 = temelSoru({ id: 'A002', soru: 'Tamamen aynı soru metni?' });
    const { uyarilar } = validateQuestions([s1, s2]);
    expect(uyarilar.some(u => /aynı/i.test(u) || /tekrar/i.test(u) || /duplicate/i.test(u))).toBe(true);
  });
});

describe('Kalite raporu', () => {
  it('kaliteRaporu toplam sayıyı doğru hesaplar', () => {
    const sorular = [temelSoru({ id: 'A001' }), temelSoru({ id: 'A002' })];
    const rapor = kaliteRaporu(sorular);
    expect(rapor.toplam).toBe(2);
  });

  it('kontrol_gerekli sorular kontrolEdilmemis sayacına eklenir', () => {
    const sorular = [
      temelSoru({ id: 'A001', guvenDurumu: 'kontrol_edildi' }),
      temelSoru({ id: 'A002', guvenDurumu: 'kontrol_gerekli' }),
    ];
    const rapor = kaliteRaporu(sorular);
    expect(rapor.kontrolEdilmemis).toBe(1);
  });

  it('supheli sorular supheli sayacına eklenir', () => {
    const sorular = [
      temelSoru({ id: 'A001', guvenDurumu: 'kontrol_edildi' }),
      temelSoru({ id: 'A002', guvenDurumu: 'supheli' }),
    ];
    const rapor = kaliteRaporu(sorular);
    expect(rapor.supheli).toBe(1);
  });

  it('boş açıklama aciklamaEksik sayacına eklenir', () => {
    const sorular = [
      temelSoru({ id: 'A001' }),
      temelSoru({ id: 'A002', aciklama: '' }),
    ];
    const rapor = kaliteRaporu(sorular);
    expect(rapor.aciklamaEksik).toBe(1);
  });
});
