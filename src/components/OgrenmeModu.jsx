import { useState, useEffect } from 'react';
import { cevapKaydet, ogrenildi } from '../utils/localStorage.js';
import { karistirilmisArray } from '../utils/hesaplamalar.js';

export default function OgrenmeModu({ sorular, dersKodu, dersAdi, durum, onDurumGuncelle, onGeri }) {
  const [sirali, setSirali] = useState([]);
  const [index, setIndex] = useState(0);
  const [secim, setSecim] = useState(null);
  const [tekrarList, setTekrarList] = useState([]);

  useEffect(() => {
    const dersS = sorular.filter(s => s.dersKodu === dersKodu);
    setSirali(karistirilmisArray(dersS));
    setIndex(0);
    setSecim(null);
    setTekrarList([]);
  }, [dersKodu, sorular]);

  const tumSorular = [...sirali, ...tekrarList];
  const soru = tumSorular[index];
  if (!soru) {
    return (
      <div className="sayfa">
        <div className="bos-durum">
          <h3>Bu ders için soru bulunamadı.</h3>
          <button className="btn-ikincil" onClick={onGeri} style={{ marginTop: '1rem' }}>
            Geri Dön
          </button>
        </div>
      </div>
    );
  }

  const cevaplandı = secim !== null;
  const dogru = secim === soru.dogruCevap;

  function secenek(harf) {
    if (cevaplandı) return;
    setSecim(harf);
    const yeniDurum = cevapKaydet(durum, soru.id, harf === soru.dogruCevap);
    onDurumGuncelle(yeniDurum);
  }

  function sonraki() {
    setIndex(i => i + 1);
    setSecim(null);
  }

  function tekrarEkle() {
    setTekrarList(l => [...l, soru]);
    sonraki();
  }

  function secenekSinifi(harf) {
    if (!cevaplandı) return '';
    if (harf === soru.dogruCevap) return 'dogru-goster';
    if (harf === secim) return 'yanlis-secim';
    return '';
  }

  const kalan = tumSorular.length - index - 1;
  const ilerleme = Math.round((index / Math.max(tumSorular.length, 1)) * 100);

  return (
    <div className="sayfa">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <button className="btn-kucuk" onClick={onGeri}>← Geri</button>
        <span style={{ fontWeight: 600 }}>{dersAdi}</span>
      </div>

      <div className="ilerleme-metin">
        {index + 1} / {tumSorular.length} soru
        {kalan > 0 && ` · Kalan: ${kalan}`}
      </div>
      <div className="ilerleme-cubuğu-kap">
        <div className="ilerleme-dolu" style={{ width: `${ilerleme}%` }} />
      </div>

      <div className="soru-kart">
        <div className="soru-meta">
          <span>Ünite {soru.unite}</span>
          <span>·</span>
          <span>{soru.konu}</span>
          {ogrenildi(durum, soru.id) && (
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
              {dogru ? '✓ Doğru!' : `✗ Yanlış — Doğru cevap: ${soru.dogruCevap}`}
            </div>
            <div className="geri-bildirim-aciklama">{soru.aciklama}</div>
          </div>
        )}
      </div>

      {cevaplandı && (
        <div className="buton-grup">
          {index + 1 < tumSorular.length ? (
            <button className="btn-birincil" onClick={sonraki}>
              Sonraki Soru →
            </button>
          ) : (
            <button className="btn-birincil" onClick={onGeri}>
              Derse Dön
            </button>
          )}
          <button className="btn-ikincil" onClick={tekrarEkle}>
            Tekrar Sor
          </button>
        </div>
      )}

      {index + 1 === tumSorular.length && cevaplandı && (
        <div className="geri-bildirim dogru" style={{ marginTop: '1rem', textAlign: 'center' }}>
          <strong>Tüm soruları tamamladınız!</strong>
        </div>
      )}
    </div>
  );
}
