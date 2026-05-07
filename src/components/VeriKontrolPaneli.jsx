import { useMemo } from 'react';
import { kaliteRaporu } from '../utils/validateQuestions.js';

export default function VeriKontrolPaneli({ sorular, onGeri }) {
  const rapor = useMemo(() => kaliteRaporu(sorular), [sorular]);

  return (
    <div className="sayfa">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <button className="btn-kucuk" onClick={onGeri}>← Geri</button>
        <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>Veri Kontrol Paneli</span>
        <span style={{ fontSize: '0.75rem', background: '#ffd', padding: '2px 8px', borderRadius: 4, border: '1px solid #cc0' }}>
          Sadece yönetici görür
        </span>
      </div>

      {/* Özet kartlar */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        <OzetKart baslik="Toplam Soru" deger={rapor.toplam} renk="var(--mavi)" />
        <OzetKart baslik="Kontrol Edildi" deger={rapor.toplam - rapor.kontrolEdilmemis} renk="var(--yesil)" />
        <OzetKart baslik="Kontrol Gerekli" deger={rapor.kontrolEdilmemis} renk="var(--sari)" />
        <OzetKart baslik="Şüpheli" deger={rapor.supheli} renk="var(--kirmizi)" />
        <OzetKart baslik="Kaynak Eksik" deger={rapor.kaynakEksik} renk="var(--kirmizi)" />
        <OzetKart baslik="Açıklama Eksik" deger={rapor.aciklamaEksik} renk="var(--kirmizi)" />
      </div>

      {/* Ders dağılımı */}
      <div className="kart" style={{ marginBottom: '1.25rem' }}>
        <div className="panel-baslik">Derse Göre Soru Sayısı</div>
        {Object.entries(rapor.dersler).map(([kod, sayi]) => (
          <div key={kod} className="liste-satir">
            <span>{kod}</span>
            <span style={{ fontWeight: 600 }}>{sayi} soru</span>
          </div>
        ))}
      </div>

      {/* Hata listesi */}
      {rapor.hatalar.length > 0 && (
        <div className="kart" style={{ marginBottom: '1.25rem', border: '2px solid var(--kirmizi)' }}>
          <div className="panel-baslik" style={{ color: 'var(--kirmizi)' }}>
            ✗ {rapor.hatalar.length} Hata Bulundu
          </div>
          {rapor.hatalar.map((h, i) => (
            <div key={i} className="liste-satir" style={{ fontSize: '0.82rem', color: 'var(--kirmizi)' }}>
              {h}
            </div>
          ))}
        </div>
      )}

      {/* Uyarı listesi */}
      {rapor.uyarilar.length > 0 && (
        <div className="kart" style={{ marginBottom: '1.25rem', border: '1px solid var(--sari)' }}>
          <div className="panel-baslik" style={{ color: '#997700' }}>
            ! {rapor.uyarilar.length} Uyarı
          </div>
          {rapor.uyarilar.slice(0, 20).map((u, i) => (
            <div key={i} className="liste-satir" style={{ fontSize: '0.82rem' }}>
              {u}
            </div>
          ))}
          {rapor.uyarilar.length > 20 && (
            <div style={{ fontSize: '0.8rem', color: 'var(--acik)', padding: '0.5rem' }}>
              ... ve {rapor.uyarilar.length - 20} uyarı daha
            </div>
          )}
        </div>
      )}

      {rapor.hatalar.length === 0 && rapor.uyarilar.length === 0 && (
        <div className="kart" style={{ textAlign: 'center', padding: '2rem' }}>
          <span style={{ color: 'var(--yesil)', fontSize: '1.5rem' }}>✓</span>
          <p style={{ marginTop: '0.5rem' }}>Veri doğrulaması başarılı, hata yok.</p>
        </div>
      )}
    </div>
  );
}

function OzetKart({ baslik, deger, renk }) {
  return (
    <div className="kart" style={{ flex: '1', minWidth: '120px', textAlign: 'center' }}>
      <div style={{ fontSize: '0.75rem', color: 'var(--acik)' }}>{baslik}</div>
      <div style={{ fontSize: '1.8rem', fontWeight: 700, color: renk }}>{deger}</div>
    </div>
  );
}
