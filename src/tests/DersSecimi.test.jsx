import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DersSecimi from '../components/DersSecimi.jsx';
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

const MOCK_SORULAR = [
  { id: 'ISL132-001', dersKodu: 'İŞL132U', dersAdi: 'Finansal Muhasebe' },
  { id: 'ISL132-002', dersKodu: 'İŞL132U', dersAdi: 'Finansal Muhasebe' },
  { id: 'ISL106-001', dersKodu: 'İŞL106U', dersAdi: 'İşletme Fonksiyonları' },
  { id: 'ISL118-001', dersKodu: 'İŞL118U', dersAdi: 'İşletme İletişimi' },
  { id: 'IKT104-001', dersKodu: 'İKT104U', dersAdi: 'İktisada Giriş II' },
  { id: 'SOS114-001', dersKodu: 'SOS114U', dersAdi: 'Davranış Bilimleri II' },
  { id: 'ING102-001', dersKodu: 'İNG102U', dersAdi: 'İngilizce II' },
];

describe('DersSecimi bileşeni', () => {
  it('6 ders kartı render edilir', () => {
    render(
      <DersSecimi
        sorular={MOCK_SORULAR}
        durum={baslangicDurumu()}
        onDersSecildi={() => {}}
      />
    );
    expect(screen.getByText('Finansal Muhasebe')).toBeInTheDocument();
    expect(screen.getByText('İşletme Fonksiyonları')).toBeInTheDocument();
    expect(screen.getByText('İşletme İletişimi')).toBeInTheDocument();
    expect(screen.getByText('İktisada Giriş II')).toBeInTheDocument();
    expect(screen.getByText('Davranış Bilimleri II')).toBeInTheDocument();
    expect(screen.getByText('İngilizce II')).toBeInTheDocument();
  });

  it('ders kartına tıklanınca onDersSecildi callback\'i doğru parametrelerle çağrılır', async () => {
    const onDersSecildi = vi.fn();
    render(
      <DersSecimi
        sorular={MOCK_SORULAR}
        durum={baslangicDurumu()}
        onDersSecildi={onDersSecildi}
      />
    );
    await userEvent.click(screen.getByText('Finansal Muhasebe'));
    expect(onDersSecildi).toHaveBeenCalledWith('İŞL132U', 'Finansal Muhasebe');
  });

  it('her kart ders kodunu gösterir', () => {
    render(
      <DersSecimi
        sorular={MOCK_SORULAR}
        durum={baslangicDurumu()}
        onDersSecildi={() => {}}
      />
    );
    expect(screen.getByText('İŞL132U')).toBeInTheDocument();
    expect(screen.getByText('İŞL106U')).toBeInTheDocument();
  });

  it('başlangıçta doğru/yanlış sayısı 0 gösterilir', () => {
    render(
      <DersSecimi
        sorular={MOCK_SORULAR}
        durum={baslangicDurumu()}
        onDersSecildi={() => {}}
      />
    );
    const dogrus = screen.getAllByText(/✓ 0 Doğru/);
    expect(dogrus.length).toBeGreaterThanOrEqual(1);
  });
});
