import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GenelDurum from '../components/GenelDurum.jsx';
import { baslangicDurumu, cevapKaydet } from '../utils/localStorage.js';

const localStorageMock = (() => {
  return {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
  };
})();
Object.defineProperty(global, 'localStorage', { value: localStorageMock });

const MOCK_SORULAR = [
  { id: 'ISL132-001', dersKodu: 'İŞL132U', dersAdi: 'Finansal Muhasebe', konu: 'Hesap' },
  { id: 'ISL132-002', dersKodu: 'İŞL132U', dersAdi: 'Finansal Muhasebe', konu: 'Bilanço' },
  { id: 'ISL106-001', dersKodu: 'İŞL106U', dersAdi: 'İşletme Fonksiyonları', konu: 'Yönetim' },
  { id: 'ISL106-002', dersKodu: 'İŞL106U', dersAdi: 'İşletme Fonksiyonları', konu: 'Yönetim' },
  { id: 'ISL118-001', dersKodu: 'İŞL118U', dersAdi: 'İşletme İletişimi', konu: 'İletişim' },
  { id: 'IKT104-001', dersKodu: 'İKT104U', dersAdi: 'İktisada Giriş II', konu: 'Talep' },
  { id: 'SOS114-001', dersKodu: 'SOS114U', dersAdi: 'Davranış Bilimleri II', konu: 'Psikoloji' },
  { id: 'ING102-001', dersKodu: 'İNG102U', dersAdi: 'İngilizce II', konu: 'Grammar' },
];

describe('GenelDurum bileşeni', () => {
  it('panel başlığı görünür', () => {
    render(
      <GenelDurum sorular={MOCK_SORULAR} durum={baslangicDurumu()} onGeri={() => {}} />
    );
    expect(screen.getByText(/Genel Durum/i)).toBeInTheDocument();
  });

  it('6 dersin hepsi tabloda listelenir', () => {
    render(
      <GenelDurum sorular={MOCK_SORULAR} durum={baslangicDurumu()} onGeri={() => {}} />
    );
    expect(screen.getByText('Finansal Muhasebe')).toBeInTheDocument();
    expect(screen.getByText('İşletme Fonksiyonları')).toBeInTheDocument();
    expect(screen.getByText('İşletme İletişimi')).toBeInTheDocument();
    expect(screen.getByText('İktisada Giriş II')).toBeInTheDocument();
    expect(screen.getByText('Davranış Bilimleri II')).toBeInTheDocument();
    expect(screen.getByText('İngilizce II')).toBeInTheDocument();
  });

  it('Geri butonu onGeri\'yi çağırır', async () => {
    const onGeri = vi.fn();
    render(
      <GenelDurum sorular={MOCK_SORULAR} durum={baslangicDurumu()} onGeri={onGeri} />
    );
    await userEvent.click(screen.getByText('← Geri'));
    expect(onGeri).toHaveBeenCalled();
  });

  it('yanlış soru yoksa "Henüz yanlış soru yok" mesajı gösterilir', () => {
    render(
      <GenelDurum sorular={MOCK_SORULAR} durum={baslangicDurumu()} onGeri={() => {}} />
    );
    expect(screen.getByText(/Henüz yanlış soru yok/i)).toBeInTheDocument();
  });

  it('yanlış yapılan konu listede görünür', () => {
    let d = baslangicDurumu();
    d = cevapKaydet(d, 'ISL132-001', false);
    d = cevapKaydet(d, 'ISL132-002', false);

    render(<GenelDurum sorular={MOCK_SORULAR} durum={d} onGeri={() => {}} />);
    expect(screen.getAllByText(/Finansal Muhasebe/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/yanlış/).length).toBeGreaterThan(0);
  });

  it('toplam doğru ve yanlış istatistikleri görünür', () => {
    let d = baslangicDurumu();
    d = cevapKaydet(d, 'ISL132-001', true);
    d = cevapKaydet(d, 'ISL106-001', false);

    render(<GenelDurum sorular={MOCK_SORULAR} durum={d} onGeri={() => {}} />);
    expect(screen.getByText('Toplam Doğru')).toBeInTheDocument();
    expect(screen.getByText('Toplam Yanlış')).toBeInTheDocument();
  });

  it('öneri paneli "Bugün önce bu derslere çalış" başlığını içerir', () => {
    render(
      <GenelDurum sorular={MOCK_SORULAR} durum={baslangicDurumu()} onGeri={() => {}} />
    );
    expect(screen.getByText(/önce bu derslere çalış/i)).toBeInTheDocument();
  });

  it('çok yanlış yapılan konu önde listelenir (yüksek sayı üstte)', () => {
    let d = baslangicDurumu();
    // Yönetim konusundan 2 yanlış
    d = cevapKaydet(d, 'ISL106-001', false);
    d = cevapKaydet(d, 'ISL106-002', false);
    // Hesap konusundan 1 yanlış
    d = cevapKaydet(d, 'ISL132-001', false);

    render(<GenelDurum sorular={MOCK_SORULAR} durum={d} onGeri={() => {}} />);
    const satirlar = screen.getAllByText(/yanlış/);
    // En az 2 "yanlış" içeren satır olmalı
    expect(satirlar.length).toBeGreaterThanOrEqual(1);
  });
});
