import { useState } from 'react';
import { durumYukle, tumVeriyiSil } from './utils/localStorage.js';
import DersSecimi from './components/DersSecimi.jsx';
import OgrenmeModu from './components/OgrenmeModu.jsx';
import YanliklarModu from './components/YanliklarModu.jsx';
import MiniSinav from './components/MiniSinav.jsx';
import GenelDurum from './components/GenelDurum.jsx';
import VeriKontrolPaneli from './components/VeriKontrolPaneli.jsx';
import sorularJson from './data/questions.json';

const MODLAR = {
  DERSLER:      'dersler',
  OGRENME:      'ogrenme',
  YANLISLAR:    'yanlislar',
  SINAV:        'sinav',
  GENEL:        'genel',
  VERI_KONTROL: 'veri_kontrol',
};

export default function App() {
  const [mod, setMod] = useState(MODLAR.DERSLER);
  const [secilenDers, setSecilenDers] = useState({ kod: null, ad: null });
  const [durum, setDurum] = useState(() => durumYukle());
  const [onayVeriSil, setOnayVeriSil] = useState(false);

  function dersSec(kod, ad) {
    setSecilenDers({ kod, ad });
    setMod(MODLAR.OGRENME);
  }

  function modGec(yeniMod) {
    setMod(yeniMod);
  }

  function geriDon() {
    setMod(MODLAR.DERSLER);
    setSecilenDers({ kod: null, ad: null });
  }

  function veriSil() {
    tumVeriyiSil();
    setDurum(durumYukle());
    setOnayVeriSil(false);
  }

  const ortak = {
    sorular: sorularJson,
    durum,
    onDurumGuncelle: setDurum,
    dersKodu: secilenDers.kod,
    dersAdi: secilenDers.ad,
    onGeri: geriDon,
  };

  const anaEkran = mod === MODLAR.DERSLER || mod === MODLAR.GENEL;

  return (
    <>
      <nav className="nav">
        <div className="nav-ic">
          <span className="nav-baslik">Sınav Hazırlık</span>
          <button
            className={`nav-btn ${mod === MODLAR.DERSLER ? 'aktif' : ''}`}
            onClick={() => modGec(MODLAR.DERSLER)}
          >
            Dersler
          </button>
          {secilenDers.kod && (
            <>
              <button
                className={`nav-btn ${mod === MODLAR.OGRENME ? 'aktif' : ''}`}
                onClick={() => modGec(MODLAR.OGRENME)}
              >
                Öğrenme
              </button>
              <button
                className={`nav-btn ${mod === MODLAR.YANLISLAR ? 'aktif' : ''}`}
                onClick={() => modGec(MODLAR.YANLISLAR)}
              >
                Yanlışlar
              </button>
              <button
                className={`nav-btn ${mod === MODLAR.SINAV ? 'aktif' : ''}`}
                onClick={() => modGec(MODLAR.SINAV)}
              >
                Mini Sınav
              </button>
            </>
          )}
          <button
            className={`nav-btn ${mod === MODLAR.GENEL ? 'aktif' : ''}`}
            onClick={() => modGec(MODLAR.GENEL)}
          >
            Genel Durum
          </button>
          <button
            className={`nav-btn ${mod === MODLAR.VERI_KONTROL ? 'aktif' : ''}`}
            onClick={() => modGec(MODLAR.VERI_KONTROL)}
            style={{ fontSize: '0.8rem', color: 'var(--acik)' }}
          >
            Veri Kontrol
          </button>
          {anaEkran && (
            <>
              {!onayVeriSil ? (
                <button
                  className="nav-btn"
                  style={{ marginLeft: 'auto', color: 'var(--kirmizi)', fontSize: '0.8rem' }}
                  onClick={() => setOnayVeriSil(true)}
                >
                  Veriyi Sıfırla
                </button>
              ) : (
                <div style={{ display: 'flex', gap: '0.4rem', marginLeft: 'auto', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--kirmizi)' }}>Emin misiniz?</span>
                  <button className="btn-tehlike" style={{ padding: '0.3rem 0.7rem', fontSize: '0.8rem' }} onClick={veriSil}>Evet</button>
                  <button className="btn-kucuk" style={{ padding: '0.3rem 0.7rem', fontSize: '0.8rem' }} onClick={() => setOnayVeriSil(false)}>Hayır</button>
                </div>
              )}
            </>
          )}
        </div>
      </nav>

      {mod === MODLAR.DERSLER && (
        <DersSecimi
          sorular={sorularJson}
          durum={durum}
          onDersSecildi={dersSec}
        />
      )}

      {mod === MODLAR.OGRENME && secilenDers.kod && (
        <OgrenmeModu {...ortak} />
      )}

      {mod === MODLAR.YANLISLAR && secilenDers.kod && (
        <YanliklarModu {...ortak} />
      )}

      {mod === MODLAR.SINAV && secilenDers.kod && (
        <MiniSinav {...ortak} />
      )}

      {mod === MODLAR.GENEL && (
        <GenelDurum
          sorular={sorularJson}
          durum={durum}
          onGeri={geriDon}
        />
      )}

      {mod === MODLAR.VERI_KONTROL && (
        <VeriKontrolPaneli
          sorular={sorularJson}
          onGeri={geriDon}
        />
      )}
    </>
  );
}
