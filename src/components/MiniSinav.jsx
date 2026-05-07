import { useState, useEffect } from 'react';
import { sinavKaydet } from '../utils/localStorage.js';
import { netHesapla, tahminPuanHesapla, riskDurumu, karistirilmisArray } from '../utils/hesaplamalar.js';

const SINAV_SORU_SAYISI = 20;

export default function MiniSinav({ sorular, dersKodu, dersAdi, durum, onDurumGuncelle, onGeri }) {
  const [sinavSorulari, setSinavSorulari] = useState([]);
  const [index, setIndex] = useState(0);
  const [secimler, setSecimler] = useState({});
  const [secim, setSecim] = useState(null);
  const [bitti, setBitti] = useState(false);

  useEffect(() => {
    const dersS = sorular.filter(s => s.dersKodu === dersKodu);
    const karisik = karistirilmisArray(dersS);
    setSinavSorulari(karisik.slice(0, SINAV_SORU_SAYISI));
    setIndex(0);
    setSecimler({});
    setSecim(null);
    setBitti(false);
  }, [dersKodu, sorular]);

  if (bitti) {
    return <Sonuc
      sorular={sinavSorulari}
      secimler={secimler}
      dersAdi={dersAdi}
      dersKodu={dersKodu}
      durum={durum}
      onDurumGuncelle={onDurumGuncelle}
      onGeri={onGeri}
    />;
  }

  const soru = sinavSorulari[index];
  if (!soru) {
    return (
      <div className="sayfa">
        <div className="bos-durum">
          <h3>Bu ders için yeterli soru yok.</h3>
          <button className="btn-ikincil" onClick={onGeri} style={{ marginTop: '1rem' }}>Geri Dön</button>
        </div>
      </div>
    );
  }

  const cevaplandı = secim !== null;

  function secenek(harf) {
    if (cevaplandı) return;
    setSecim(harf);
    setSecimler(s => ({ ...s, [soru.id]: harf }));
  }

  function sonraki() {
    if (index + 1 >= sinavSorulari.length) {
      setBitti(true);
    } else {
      setIndex(i => i + 1);
      setSecim(null);
    }
  }

  function bosGec() {
    if (index + 1 >= sinavSorulari.length) {
      setBitti(true);
    } else {
      setIndex(i => i + 1);
      setSecim(null);
    }
  }

  function secenekSinifi(harf) {
    if (!cevaplandı) return '';
    if (harf === soru.dogruCevap) return 'dogru-goster';
    if (harf === secim) return 'yanlis-secim';
    return '';
  }

  const ilerleme = Math.round((index / Math.max(sinavSorulari.length, 1)) * 100);

  return (
    <div className="sayfa">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <button className="btn-kucuk" onClick={onGeri}>← Sınavı Bırak</button>
        <span style={{ fontWeight: 600 }}>Mini Sınav – {dersAdi}</span>
      </div>

      <div className="ilerleme-metin">
        Soru {index + 1} / {sinavSorulari.length}
      </div>
      <div className="ilerleme-cubuğu-kap">
        <div className="ilerleme-dolu" style={{ width: `${ilerleme}%`, background: 'var(--sari)' }} />
      </div>

      <div className="soru-kart">
        <div className="soru-meta">
          <span>Ünite {soru.unite}</span>
          <span>·</span>
          <span>{soru.konu}</span>
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
          <div className={`geri-bildirim ${secim === soru.dogruCevap ? 'dogru' : 'yanlis'}`}>
            <div className="geri-bildirim-baslik">
              {secim === soru.dogruCevap ? '✓ Doğru!' : `✗ Yanlış — Doğru cevap: ${soru.dogruCevap}`}
            </div>
            <div className="geri-bildirim-aciklama">{soru.aciklama}</div>
          </div>
        )}
      </div>

      <div className="buton-grup">
        {cevaplandı ? (
          <button className="btn-birincil" onClick={sonraki}>
            {index + 1 < sinavSorulari.length ? 'Sonraki Soru →' : 'Sonuçları Gör'}
          </button>
        ) : (
          <button className="btn-ikincil" onClick={bosGec}>
            Boş Geç
          </button>
        )}
      </div>
    </div>
  );
}

function Sonuc({ sorular, secimler, dersAdi, dersKodu, durum, onDurumGuncelle, onGeri }) {
  useEffect(() => {
    let dogru = 0, yanlis = 0;
    for (const soru of sorular) {
      const s = secimler[soru.id];
      if (!s) continue;
      if (s === soru.dogruCevap) dogru++;
      else yanlis++;
    }
    const yeniDurum = sinavKaydet(durum, dersKodu, dogru, yanlis, sorular.length - dogru - yanlis);
    onDurumGuncelle(yeniDurum);
  }, []);

  let dogru = 0, yanlis = 0;
  for (const soru of sorular) {
    const s = secimler[soru.id];
    if (!s) continue;
    if (s === soru.dogruCevap) dogru++;
    else yanlis++;
  }
  const bos = sorular.length - dogru - yanlis;
  const net = netHesapla(dogru, yanlis);
  const puan = tahminPuanHesapla(net);
  const risk = riskDurumu(net);

  return (
    <div className="sayfa">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <button className="btn-kucuk" onClick={onGeri}>← Derse Dön</button>
      </div>

      <div className="sonuc-kart">
        <div style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>Mini Sınav Sonucu</div>
        <div style={{ fontSize: '1rem', color: 'var(--acik)', marginBottom: '0.75rem' }}>{dersAdi}</div>

        <span className={`risk-etiketi risk-${risk.renk}`} style={{ fontSize: '1rem', padding: '0.4rem 1.2rem' }}>
          {risk.emoji} {risk.metin}
        </span>

        <div className="sonuc-grid" style={{ marginTop: '1.5rem' }}>
          <div className="sonuc-satir">
            <div className="sonuc-satir-baslik">Doğru</div>
            <div className="sonuc-satir-deger" style={{ color: 'var(--yesil)' }}>{dogru}</div>
          </div>
          <div className="sonuc-satir">
            <div className="sonuc-satir-baslik">Yanlış</div>
            <div className="sonuc-satir-deger" style={{ color: 'var(--kirmizi)' }}>{yanlis}</div>
          </div>
          <div className="sonuc-satir">
            <div className="sonuc-satir-baslik">Boş</div>
            <div className="sonuc-satir-deger">{bos}</div>
          </div>
          <div className="sonuc-satir">
            <div className="sonuc-satir-baslik">Net (D - Y/4)</div>
            <div className="sonuc-satir-deger" style={{ color: 'var(--mavi)' }}>{net.toFixed(2)}</div>
          </div>
          <div className="sonuc-satir" style={{ gridColumn: '1 / -1' }}>
            <div className="sonuc-satir-baslik">Tahmini Puan (Net × 5)</div>
            <div className="sonuc-satir-deger" style={{ fontSize: '2rem', color: 'var(--mavi)' }}>
              {puan.toFixed(1)}
            </div>
          </div>
        </div>

        <div style={{ fontSize: '0.85rem', color: 'var(--acik)', marginTop: '0.5rem' }}>
          Durum eşikleri: 0-6 net → Riskli · 7-9 net → Sınırda · 10+ net → Daha Güvenli
        </div>
      </div>

      <div className="buton-grup" style={{ marginTop: '1.25rem', justifyContent: 'center' }}>
        <button className="btn-birincil" onClick={onGeri}>Derse Dön</button>
      </div>
    </div>
  );
}
