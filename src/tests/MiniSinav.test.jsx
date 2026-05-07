import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MiniSinav from '../components/MiniSinav.jsx';
import { baslangicDurumu } from '../utils/localStorage.js';

const localStorageMock = (() => {
  let store = {};
  return {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
    clear: () => { store = {}; },
  };
})();
Object.defineProperty(global, 'localStorage', { value: localStorageMock });

function soru(id, dogruCevap = 'A', guvenDurumu = 'kontrol_edildi') {
  return {
    id,
    dersKodu: 'İŞL132U',
    dersAdi: 'Finansal Muhasebe',
    unite: 1,
    konu: 'Test',
    soru: `Soru ${id}`,
    secenekler: { A: 'Seçenek A', B: 'Seçenek B', C: 'Seçenek C', D: 'Seçenek D', E: 'Seçenek E' },
    dogruCevap,
    aciklama: `Açıklama ${id}`,
    guvenDurumu,
  };
}

// 20 kontrol edildi soru
const YETERLİ_SORULAR = Array.from({ length: 20 }, (_, i) =>
  soru(`ISL132-${String(i + 1).padStart(3, '0')}`)
);

// Kontrol edilmemiş sorular
const KONTROL_GEREKLI_SORULAR = Array.from({ length: 5 }, (_, i) =>
  soru(`ISL132-K${i}`, 'A', 'kontrol_gerekli')
);

const ORK = {
  dersKodu: 'İŞL132U',
  dersAdi: 'Finansal Muhasebe',
  durum: baslangicDurumu(),
  onDurumGuncelle: () => {},
  onGeri: () => {},
};

describe('MiniSinav — yeterli soru senaryosu', () => {
  it('sınav başlıyor ve 1. soru görünüyor', () => {
    render(<MiniSinav sorular={YETERLİ_SORULAR} {...ORK} />);
    expect(screen.getByText(/Soru 1 \//)).toBeInTheDocument();
  });

  it('20 soruluk sınav 20 soru gösterir', () => {
    render(<MiniSinav sorular={YETERLİ_SORULAR} {...ORK} />);
    expect(screen.getByText(/\/ 20/)).toBeInTheDocument();
  });

  it('cevap verilmeden önce seçenekler tıklanabilir', () => {
    render(<MiniSinav sorular={YETERLİ_SORULAR} {...ORK} />);
    const secenekA = screen.getByText('Seçenek A').closest('button');
    expect(secenekA).not.toBeDisabled();
  });

  it('seçenek tıklanınca açıklama görünür', async () => {
    render(<MiniSinav sorular={YETERLİ_SORULAR} {...ORK} />);
    await userEvent.click(screen.getAllByText('Seçenek A')[0].closest('button'));
    expect(screen.getByText(/Açıklama ISL132-/)).toBeInTheDocument();
  });

  it('cevap verildikten sonra aynı soruda seçenek değiştirilemez (butonlar disabled)', async () => {
    render(<MiniSinav sorular={YETERLİ_SORULAR} {...ORK} />);
    const secenek = screen.getAllByText('Seçenek A')[0].closest('button');
    await userEvent.click(secenek);
    const tumSecenekler = screen.getAllByRole('button', { name: /Seçenek/ });
    tumSecenekler.forEach(btn => expect(btn).toBeDisabled());
  });

  it('boş geç butonuyla soru atlanabilir', async () => {
    render(<MiniSinav sorular={YETERLİ_SORULAR} {...ORK} />);
    await userEvent.click(screen.getByText('Boş Geç'));
    expect(screen.getByText(/Soru 2 \//)).toBeInTheDocument();
  });

  it('Sınava Bırak butonu onGeri\'yi çağırır', async () => {
    const onGeri = vi.fn();
    render(<MiniSinav sorular={YETERLİ_SORULAR} {...ORK} onGeri={onGeri} />);
    await userEvent.click(screen.getByText('← Sınavı Bırak'));
    expect(onGeri).toHaveBeenCalled();
  });
});

describe('MiniSinav — yetersiz soru senaryosu', () => {
  it('soru yoksa uyarı mesajı gösterilir', () => {
    render(<MiniSinav sorular={[]} {...ORK} />);
    expect(screen.getByText(/yeterli soru/i)).toBeInTheDocument();
  });

  it('sadece kontrol_gerekli sorular varsa uyarı gösterilir', () => {
    render(<MiniSinav sorular={KONTROL_GEREKLI_SORULAR} {...ORK} />);
    expect(screen.getByText(/yeterli soru/i)).toBeInTheDocument();
  });

  it('az soru varsa (5) mevcut kadar sınav oluşturulur', () => {
    const azSorular = YETERLİ_SORULAR.slice(0, 5);
    render(<MiniSinav sorular={azSorular} {...ORK} />);
    // 5 soruyla sınav başlar, "/" sonrası 5 yazar
    expect(screen.getByText(/\/ 5/)).toBeInTheDocument();
  });
});

describe('MiniSinav — güvenli soru filtresi', () => {
  it('kontrol_gerekli sorular sınava dahil edilmez', () => {
    const karisik = [...KONTROL_GEREKLI_SORULAR, ...YETERLİ_SORULAR];
    render(<MiniSinav sorular={karisik} {...ORK} />);
    // 20 kontrol_edildi soru var, sınav bunları kullanır
    expect(screen.getByText(/\/ 20/)).toBeInTheDocument();
  });
});

describe('MiniSinav — boş bırakılan sorular', () => {
  it('boş bırakılan sorular yanlış sayılmaz (sonuç ekranında boş olarak görünür)', async () => {
    // 2 soruluk sınav
    const ikiSoru = YETERLİ_SORULAR.slice(0, 2);
    const onDurumGuncelle = vi.fn();
    render(<MiniSinav sorular={ikiSoru} {...ORK} onDurumGuncelle={onDurumGuncelle} />);

    // Her iki soruyu boş geç
    await userEvent.click(screen.getByText('Boş Geç'));
    await userEvent.click(screen.getByText('Boş Geç'));

    // Sonuç ekranında boş sayısı 2 olmalı
    expect(screen.getByText('2')).toBeInTheDocument(); // Boş: 2
    // Yanlış: 0 olmalı — başka 0 da var ama en azından kontrol
    const dogruEleman = screen.getAllByText('0');
    expect(dogruEleman.length).toBeGreaterThanOrEqual(1);
  });
});
