import { useState } from 'react';
import { cevapKaydet, yanlislar, ogrenildi } from '../utils/localStorage.js';
import { karistirilmisArray } from '../utils/hesaplamalar.js';

export default function YanliklarModu({ sorular, dersKodu, dersAdi, durum, onDurumGuncelle, onGeri }) {
  const [secim, setSecim] = useState(null);
  const [index, setIndex] = useState(0);
  const [liste, setListe] = useState(() =>
    karistirilmisArray(yanlislar(durum, sorular, dersKodu))
  );

  function yenile(yeniDurum) {
    setListe(karistirilmisArray(yanlislar(yeniDurum, sorular, dersKodu)));
    setIndex(0);
    setSecim(null);
  }

  if (liste.length === 0) {
    return (
      <div className="sayfa">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <button className="btn-kucuk" onClick={onGeri}>← Geri</button>
          <span style={{ fontWeight: 600 }}>Yanlışlar – {dersAdi || 'Tüm Dersler'}</span>
        </div>
        <div className="bos-durum">
          <h3>Harika! Yanlış soru kalmadı.</h3>
          <p>Tüm yanlışlarınızı düzelttiniz.</p>
          <button className="btn-birincil" onClick={onGeri} style={{ marginTop: '1rem' }}>
            Geri Dön
          </button>
        </div>
      </div>
    );
  }

  const soru = liste[index];
  const cevaplandı = secim !== null;
  const dogru = secim === soru.dogruCevap;

  function secenek(harf) {
    if (cevaplandı) return;
    setSecim(harf);
    const yeniDurum = cevapKaydet(durum, soru.id, harf === soru.dogruCevap);
    onDurumGuncelle(yeniDurum);
  }

  function sonraki() {
    if (index + 1 < liste.length) {
      setIndex(i => i + 1);
      setSecim(null);
    } else {
      yenile(durum);
    }
  }

  function secenekSinifi(harf) {
    if (!cevaplandı) return '';
    if (harf === soru.dogruCevap) return 'dogru-goster';
    if (harf === secim) return 'yanlis-secim';
    return '';
  }

  const ilerleme = Math.round((index / Math.max(liste.length, 1)) * 100);
  const ogrenildiMi = ogrenildi(durum, soru.id);

  return (
    <div className="sayfa">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <button className="btn-kucuk" onClick={onGeri}>← Geri</button>
        <span style={{ fontWeight: 600 }}>Yanlışlar – {dersAdi || 'Tüm Dersler'}</span>
      </div>

      <div className="ilerleme-metin">
        {index + 1} / {liste.length} yanlış soru
      </div>
      <div className="ilerleme-cubuğu-kap">
        <div className="ilerleme-dolu" style={{ width: `${ilerleme}%`, background: 'var(--kirmizi)' }} />
      </div>

      <div className="soru-kart">
        <div className="soru-meta">
          <span>{soru.dersAdi}</span>
          <span>·</span>
          <span>Ünite {soru.unite}</span>
          <span>·</span>
          <span>{soru.konu}</span>
          {ogrenildiMi && (
            <>
              <span>·</span>
              <span style={{ color: 'var(--yesil)', fontWeight: 600 }}>✓ Öğrenildi</span>
            </>
          )}
        </div>

        <div className="soru-metin">{soru.soru}</div>

        <div className="secenekler">
          {Object.entries(soru.secenekler).map(([harf, metin]) => (
            <button
              key={harf}
              className={`secenek-btn ${secenekSinifi(harf)}`}
              onClick={() => secenek(harf)}
              disabled={cevaplandı}
            >
              <span className="secenek-harf">{harf}</span>
              <span>{metin}</span>
            </button>
          ))}
        </div>

        {cevaplandı && (
          <div className={`geri-bildirim ${dogru ? 'dogru' : 'yanlis'}`}>
            <div className="geri-bildirim-baslik">
              {dogru
                ? ogrenildiMi
                  ? '✓ Doğru! Bu soru öğrenildi sayılacak.'
                  : '✓ Doğru! Bir kez daha doğru yaparsanız öğrenildi sayılır.'
                : `✗ Yanlış — Doğru cevap: ${soru.dogruCevap}`}
            </div>
            <div className="geri-bildirim-aciklama">{soru.aciklama}</div>
          </div>
        )}
      </div>

      {cevaplandı && (
        <div className="buton-grup">
          <button className="btn-birincil" onClick={sonraki}>
            {index + 1 < liste.length ? 'Sonraki Soru →' : 'Başa Dön'}
          </button>
        </div>
      )}
    </div>
  );
}
