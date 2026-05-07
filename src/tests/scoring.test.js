import { describe, it, expect } from 'vitest';
import {
  netHesapla,
  netHesaplaHam,
  tahminPuanHesapla,
  riskDurumu,
  dersRiskDurumu,
} from '../utils/hesaplamalar.js';

describe('netHesapla — Doğru - Yanlış/4 formülü', () => {
  it('10 doğru 4 yanlış → 9 net', () => {
    expect(netHesapla(10, 4)).toBe(9);
  });

  it('8 doğru 0 yanlış → 8 net', () => {
    expect(netHesapla(8, 0)).toBe(8);
  });

  it('7 doğru 8 yanlış → 5 net', () => {
    expect(netHesapla(7, 8)).toBe(5);
  });

  it('0 doğru 0 yanlış → 0 net', () => {
    expect(netHesapla(0, 0)).toBe(0);
  });

  it('negatif sonuç 0\'a sabitlenir', () => {
    expect(netHesapla(0, 8)).toBe(0);   // ham = -2, sabitlenir
    expect(netHesapla(1, 20)).toBe(0);  // ham = -4, sabitlenir
  });

  it('netHesaplaHam negatif değer döner (ham versiyon)', () => {
    expect(netHesaplaHam(0, 8)).toBe(-2);
    expect(netHesaplaHam(1, 20)).toBe(-4);
  });

  it('tam sayı olmalı — 4\'ün tam katı yanlış', () => {
    expect(netHesapla(20, 0)).toBe(20);
    expect(netHesapla(0, 4)).toBe(0); // 0 - 1 = -1 → sabitlenir
  });

  it('kesirli net doğru hesaplanır', () => {
    // 5 doğru, 2 yanlış → 5 - 0.5 = 4.5
    expect(netHesapla(5, 2)).toBeCloseTo(4.5);
  });
});

describe('tahminPuanHesapla — Net × 5', () => {
  it('10 net → 50 puan', () => {
    expect(tahminPuanHesapla(10)).toBe(50);
  });

  it('7 net → 35 puan', () => {
    expect(tahminPuanHesapla(7)).toBe(35);
  });

  it('12 net → 60 puan', () => {
    expect(tahminPuanHesapla(12)).toBe(60);
  });

  it('0 net → 0 puan', () => {
    expect(tahminPuanHesapla(0)).toBe(0);
  });

  it('kesirli net için yuvarlama doğru çalışır', () => {
    // 9.5 net → 47.5 puan
    expect(tahminPuanHesapla(9.5)).toBeCloseTo(47.5);
  });
});

describe('riskDurumu — Sınır değer testleri', () => {
  it('6 net → Riskli', () => {
    const sonuc = riskDurumu(6);
    expect(sonuc.renk).toBe('kirmizi');
    expect(sonuc.metin).toBe('Riskli');
  });

  it('7 net → Sınırda', () => {
    const sonuc = riskDurumu(7);
    expect(sonuc.renk).toBe('sari');
    expect(sonuc.metin).toBe('Sınırda');
  });

  it('9 net → Sınırda', () => {
    const sonuc = riskDurumu(9);
    expect(sonuc.renk).toBe('sari');
    expect(sonuc.metin).toBe('Sınırda');
  });

  it('10 net → Daha Güvenli', () => {
    const sonuc = riskDurumu(10);
    expect(sonuc.renk).toBe('yesil');
    expect(sonuc.metin).toBe('Daha Güvenli');
  });

  it('0 net → Riskli', () => {
    expect(riskDurumu(0).renk).toBe('kirmizi');
  });

  it('20 net → Daha Güvenli', () => {
    expect(riskDurumu(20).renk).toBe('yesil');
  });

  it('6.9 net → Riskli (7\'nin altı)', () => {
    expect(riskDurumu(6.9).renk).toBe('kirmizi');
  });

  it('9.9 net → Sınırda (10\'un altı)', () => {
    expect(riskDurumu(9.9).renk).toBe('sari');
  });
});

describe('dersRiskDurumu — Doğru/Yanlış üzerinden risk', () => {
  it('hiç soru çözülmemişse Riskli', () => {
    expect(dersRiskDurumu(0, 0).renk).toBe('kirmizi');
  });

  it('10 doğru 4 yanlış → net 9 → Sınırda', () => {
    expect(dersRiskDurumu(10, 4).renk).toBe('sari');
  });

  it('14 doğru 0 yanlış → net 14 → Daha Güvenli', () => {
    expect(dersRiskDurumu(14, 0).renk).toBe('yesil');
  });
});
