import { dersCevaplari } from '../utils/localStorage.js';
import { netHesapla, dersRiskDurumu, dersOncelikAciklama } from '../utils/hesaplamalar.js';

const DERSLER = [
  { kod: 'İŞL132U', ad: 'Finansal Muhasebe' },
  { kod: 'İŞL106U', ad: 'İşletme Fonksiyonları' },
  { kod: 'İŞL118U', ad: 'İşletme İletişimi' },
  { kod: 'İKT104U', ad: 'İktisada Giriş II' },
  { kod: 'SOS114U', ad: 'Davranış Bilimleri II' },
  { kod: 'İNG102U', ad: 'İngilizce II' },
];

export default function DersSecimi({ sorular, durum, onDersSecildi }) {
  return (
    <div className="sayfa">
      <div className="baslik">
        <h1>Sınav Hazırlık</h1>
        <p>Çalışmak istediğiniz dersi seçin</p>
      </div>

      <div className="kart-grid">
        {DERSLER.map(ders => {
          const { dogru, yanlis } = dersCevaplari(durum, ders.kod, sorular);
          const net = netHesapla(dogru, yanlis);
          const risk = dersRiskDurumu(dogru, yanlis);
          const aciklama = dersOncelikAciklama(ders.kod);
          const toplamSoru = sorular.filter(s => s.dersKodu === ders.kod).length;
          const cozulen = dogru + yanlis;

          return (
            <div
              key={ders.kod}
              className="kart tiklanabilir"
              onClick={() => onDersSecildi(ders.kod, ders.ad)}
            >
              <div className="kart-baslik">{ders.ad}</div>
              <div className="kart-kod">{ders.kod}</div>

              <div className="kart-istatistik">
                <span className="istatistik-dogru">✓ {dogru} Doğru</span>
                <span className="istatistik-yanlis">✗ {yanlis} Yanlış</span>
              </div>

              <div style={{ fontSize: '0.85rem', color: 'var(--acik)', marginBottom: '0.6rem' }}>
                Çözülen: {cozulen} / {toplamSoru} soru
                &nbsp;|&nbsp;
                <span className="istatistik-net">Net: {net.toFixed(2)}</span>
              </div>

              {aciklama && (
                <div style={{ fontSize: '0.78rem', color: 'var(--acik)', marginBottom: '0.6rem', fontStyle: 'italic' }}>
                  {aciklama}
                </div>
              )}

              <span className={`risk-etiketi risk-${risk.renk}`}>
                {risk.emoji} {risk.metin}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
