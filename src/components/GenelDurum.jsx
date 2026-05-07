import { dersCevaplari, yanlislar } from '../utils/localStorage.js';
import { netHesapla, tahminPuanHesapla, dersRiskDurumu, dersleriSirala } from '../utils/hesaplamalar.js';

const DERSLER = [
  { kod: 'İŞL132U', ad: 'Finansal Muhasebe' },
  { kod: 'İŞL106U', ad: 'İşletme Fonksiyonları' },
  { kod: 'İŞL118U', ad: 'İşletme İletişimi' },
  { kod: 'İKT104U', ad: 'İktisada Giriş II' },
  { kod: 'SOS114U', ad: 'Davranış Bilimleri II' },
  { kod: 'İNG102U', ad: 'İngilizce II' },
];

export default function GenelDurum({ sorular, durum, onGeri }) {
  const dersVerileri = DERSLER.map(d => {
    const { dogru, yanlis } = dersCevaplari(durum, d.kod, sorular);
    return { ...d, dogru, yanlis };
  });

  const sirali = dersleriSirala(dersVerileri, durum);

  const riskliDersler = dersVerileri.filter(d =>
    dersRiskDurumu(d.dogru, d.yanlis).renk === 'kirmizi'
  );

  const oneriler = sirali.slice(0, 3);

  // En çok yanlış yapılan konular
  const tumYanlislar = yanlislar(durum, sorular, null);
  const konuSayaci = {};
  for (const s of tumYanlislar) {
    const key = `${s.dersAdi} – ${s.konu}`;
    konuSayaci[key] = (konuSayaci[key] || 0) + 1;
  }
  const konuListesi = Object.entries(konuSayaci)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  const toplamDogru = dersVerileri.reduce((t, d) => t + d.dogru, 0);
  const toplamYanlis = dersVerileri.reduce((t, d) => t + d.yanlis, 0);

  return (
    <div className="sayfa">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <button className="btn-kucuk" onClick={onGeri}>← Geri</button>
        <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>Genel Durum Paneli</span>
      </div>

      {/* Günlük öneri */}
      <div className="oneri-kutu">
        <div style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Bugün önce bu derslere çalış:</div>
        {oneriler.map((d, i) => {
          const risk = dersRiskDurumu(d.dogru, d.yanlis);
          return (
            <p key={d.kod}>
              <span className={`risk-etiketi risk-${risk.renk}`} style={{ marginRight: '0.5rem' }}>
                {i + 1}. {d.ad}
              </span>
              <span style={{ fontSize: '0.85rem', color: 'var(--acik)' }}>
                Net: {netHesapla(d.dogru, d.yanlis).toFixed(1)} · {risk.metin}
              </span>
            </p>
          );
        })}
      </div>

      {/* Özet istatistik */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div className="kart" style={{ flex: 1, minWidth: '140px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--acik)' }}>Toplam Doğru</div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--yesil)' }}>{toplamDogru}</div>
        </div>
        <div className="kart" style={{ flex: 1, minWidth: '140px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--acik)' }}>Toplam Yanlış</div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--kirmizi)' }}>{toplamYanlis}</div>
        </div>
        <div className="kart" style={{ flex: 1, minWidth: '140px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--acik)' }}>Tekrar Bekleyen</div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--sari)' }}>{tumYanlislar.length}</div>
        </div>
      </div>

      {/* Ders tablosu */}
      <div className="kart" style={{ marginBottom: '1.5rem' }}>
        <div className="panel-baslik">Dersler Özeti</div>
        {sirali.map(d => {
          const net = netHesapla(d.dogru, d.yanlis);
          const puan = tahminPuanHesapla(net);
          const risk = dersRiskDurumu(d.dogru, d.yanlis);
          return (
            <div key={d.kod} className="liste-satir">
              <div>
                <div style={{ fontWeight: 600 }}>{d.ad}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--acik)' }}>
                  ✓ {d.dogru} Doğru · ✗ {d.yanlis} Yanlış · Net: {net.toFixed(1)} · ~{puan.toFixed(0)} puan
                </div>
              </div>
              <span className={`risk-etiketi risk-${risk.renk}`}>{risk.metin}</span>
            </div>
          );
        })}
      </div>

      {/* En çok yanlış konular */}
      {konuListesi.length > 0 && (
        <div className="kart">
          <div className="panel-baslik">En Çok Yanlış Yapılan Konular</div>
          {konuListesi.map(([konu, sayi]) => (
            <div key={konu} className="liste-satir">
              <span>{konu}</span>
              <span style={{ fontWeight: 700, color: 'var(--kirmizi)' }}>{sayi} yanlış</span>
            </div>
          ))}
        </div>
      )}

      {konuListesi.length === 0 && (
        <div className="kart">
          <div className="panel-baslik">En Çok Yanlış Yapılan Konular</div>
          <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--acik)' }}>
            Henüz yanlış soru yok. Çalışmaya başlayın!
          </div>
        </div>
      )}
    </div>
  );
}
