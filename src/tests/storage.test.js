import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  baslangicDurumu,
  durumYukle,
  cevapKaydet,
  sinavKaydet,
  dersCevaplari,
  yanlislar,
  ogrenildi,
  tumVeriyiSil,
} from '../utils/localStorage.js';

// localStorage mock
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] ?? null,
    setItem: (key, value) => { store[key] = String(value); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();

Object.defineProperty(global, 'localStorage', { value: localStorageMock });

beforeEach(() => {
  localStorageMock.clear();
});

const ORNEK_SORULAR = [
  { id: 'ISL132-001', dersKodu: 'İŞL132U', dogruCevap: 'C' },
  { id: 'ISL132-002', dersKodu: 'İŞL132U', dogruCevap: 'A' },
  { id: 'ISL106-001', dersKodu: 'İŞL106U', dogruCevap: 'B' },
];

describe('baslangicDurumu', () => {
  it('cevaplar ve sinavlar alanları boş başlar', () => {
    const durum = baslangicDurumu();
    expect(durum.cevaplar).toEqual({});
    expect(durum.sinavlar).toEqual([]);
  });
});

describe('durumYukle', () => {
  it('localStorage boşsa başlangıç durumu döner', () => {
    const durum = durumYukle();
    expect(durum.cevaplar).toEqual({});
    expect(durum.sinavlar).toEqual([]);
  });

  it('bozuk JSON varsa crash olmadan başlangıç durumu döner', () => {
    localStorageMock.setItem('sinav_hazirlik_v1', 'BU_GECERSIZ_JSON{{{');
    const durum = durumYukle();
    expect(durum.cevaplar).toEqual({});
  });

  it('daha önce kaydedilen durum geri yüklenir', () => {
    const durum = baslangicDurumu();
    const yeniDurum = cevapKaydet(durum, 'ISL132-001', true);
    const yuklenen = durumYukle();
    expect(yuklenen.cevaplar['ISL132-001'].dogru).toBe(true);
  });
});

describe('cevapKaydet', () => {
  it('doğru cevap kaydedilir', () => {
    const durum = baslangicDurumu();
    const yeni = cevapKaydet(durum, 'ISL132-001', true);
    expect(yeni.cevaplar['ISL132-001'].dogru).toBe(true);
    expect(yeni.cevaplar['ISL132-001'].sayac).toBe(1);
    expect(yeni.cevaplar['ISL132-001'].ardisikDogru).toBe(1);
  });

  it('yanlış cevap kaydedilir', () => {
    const durum = baslangicDurumu();
    const yeni = cevapKaydet(durum, 'ISL132-001', false);
    expect(yeni.cevaplar['ISL132-001'].dogru).toBe(false);
    expect(yeni.cevaplar['ISL132-001'].ardisikDogru).toBe(0);
  });

  it('ardışık doğru sayacı doğru artar', () => {
    let d = baslangicDurumu();
    d = cevapKaydet(d, 'ISL132-001', true);
    d = cevapKaydet(d, 'ISL132-001', true);
    expect(d.cevaplar['ISL132-001'].ardisikDogru).toBe(2);
    expect(d.cevaplar['ISL132-001'].sayac).toBe(2);
  });

  it('yanlıştan sonra ardısık doğru sayacı sıfırlanır', () => {
    let d = baslangicDurumu();
    d = cevapKaydet(d, 'ISL132-001', true);
    d = cevapKaydet(d, 'ISL132-001', false);
    expect(d.cevaplar['ISL132-001'].ardisikDogru).toBe(0);
    expect(d.cevaplar['ISL132-001'].sayac).toBe(2);
  });

  it('orijinal durumu değiştirmez (immutable)', () => {
    const durum = baslangicDurumu();
    cevapKaydet(durum, 'ISL132-001', true);
    expect(durum.cevaplar['ISL132-001']).toBeUndefined();
  });

  it('localStorage\'a yazılır', () => {
    const durum = baslangicDurumu();
    cevapKaydet(durum, 'ISL132-001', true);
    expect(localStorageMock.getItem('sinav_hazirlik_v1')).not.toBeNull();
  });
});

describe('ogrenildi', () => {
  it('2 kez ardışık doğru yapılan soru öğrenildi sayılır', () => {
    let d = baslangicDurumu();
    d = cevapKaydet(d, 'ISL132-001', true);
    d = cevapKaydet(d, 'ISL132-001', true);
    expect(ogrenildi(d, 'ISL132-001')).toBe(true);
  });

  it('1 kez doğru öğrenildi sayılmaz', () => {
    let d = baslangicDurumu();
    d = cevapKaydet(d, 'ISL132-001', true);
    expect(ogrenildi(d, 'ISL132-001')).toBe(false);
  });

  it('hiç cevap yoksa false döner', () => {
    expect(ogrenildi(baslangicDurumu(), 'ISL132-001')).toBe(false);
  });

  it('yanlış sonra 1 doğru → hâlâ öğrenilmedi', () => {
    let d = baslangicDurumu();
    d = cevapKaydet(d, 'ISL132-001', true);
    d = cevapKaydet(d, 'ISL132-001', false);
    d = cevapKaydet(d, 'ISL132-001', true);
    expect(ogrenildi(d, 'ISL132-001')).toBe(false);
  });
});

describe('yanlislar', () => {
  it('yanlış yapılan soru listeye eklenir', () => {
    let d = baslangicDurumu();
    d = cevapKaydet(d, 'ISL132-001', false);
    const liste = yanlislar(d, ORNEK_SORULAR, 'İŞL132U');
    expect(liste.map(s => s.id)).toContain('ISL132-001');
  });

  it('hiç çözülmemiş soru yanlışlar listesinde olmaz', () => {
    const liste = yanlislar(baslangicDurumu(), ORNEK_SORULAR, 'İŞL132U');
    expect(liste).toHaveLength(0);
  });

  it('2 kez ardışık doğru yapınca yanlışlar listesinden çıkar', () => {
    let d = baslangicDurumu();
    d = cevapKaydet(d, 'ISL132-001', false);
    d = cevapKaydet(d, 'ISL132-001', true);
    d = cevapKaydet(d, 'ISL132-001', true);
    const liste = yanlislar(d, ORNEK_SORULAR, 'İŞL132U');
    expect(liste.map(s => s.id)).not.toContain('ISL132-001');
  });

  it('duplicate kayıt oluşmaz — aynı soru iki kez yanlış yapılsa bile listede bir kez görünür', () => {
    let d = baslangicDurumu();
    d = cevapKaydet(d, 'ISL132-001', false);
    d = cevapKaydet(d, 'ISL132-001', false);
    const liste = yanlislar(d, ORNEK_SORULAR, 'İŞL132U');
    const ids = liste.map(s => s.id).filter(id => id === 'ISL132-001');
    expect(ids).toHaveLength(1);
  });

  it('dersKodu null geçilince tüm dersler döner', () => {
    let d = baslangicDurumu();
    d = cevapKaydet(d, 'ISL132-001', false);
    d = cevapKaydet(d, 'ISL106-001', false);
    const liste = yanlislar(d, ORNEK_SORULAR, null);
    expect(liste).toHaveLength(2);
  });
});

describe('dersCevaplari', () => {
  it('ders için doğru/yanlış sayısını doğru verir', () => {
    let d = baslangicDurumu();
    d = cevapKaydet(d, 'ISL132-001', true);
    d = cevapKaydet(d, 'ISL132-002', false);
    const { dogru, yanlis } = dersCevaplari(d, 'İŞL132U', ORNEK_SORULAR);
    expect(dogru).toBe(1);
    expect(yanlis).toBe(1);
  });

  it('başka dersin soruları sayılmaz', () => {
    let d = baslangicDurumu();
    d = cevapKaydet(d, 'ISL106-001', true);
    const { dogru } = dersCevaplari(d, 'İŞL132U', ORNEK_SORULAR);
    expect(dogru).toBe(0);
  });
});

describe('sinavKaydet', () => {
  it('sınav kaydı listeye eklenir', () => {
    let d = baslangicDurumu();
    d = sinavKaydet(d, 'İŞL132U', 10, 4, 6);
    expect(d.sinavlar).toHaveLength(1);
    expect(d.sinavlar[0].dogru).toBe(10);
    expect(d.sinavlar[0].yanlis).toBe(4);
    expect(d.sinavlar[0].dersKodu).toBe('İŞL132U');
  });
});
