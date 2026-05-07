// Mevcut sorulara yeni alanlar ekler
const fs = require('fs');
const path = require('path');

const dosyaYolu = path.join(__dirname, '../src/data/questions.json');
const sorular = JSON.parse(fs.readFileSync(dosyaYolu, 'utf8'));

// Görüntüden okunan (gerçek sınav) soru ID'leri
const cikmisSorular = new Set([
  // ISL132U arasinav 2019 — Q11-20
  'ISL132-011','ISL132-012','ISL132-013','ISL132-014','ISL132-015',
  'ISL132-016','ISL132-017','ISL132-018','ISL132-019','ISL132-020',
  // ISL106U arasinav 2021 — Q9-20
  'ISL106-009','ISL106-010','ISL106-011','ISL106-012','ISL106-013',
  'ISL106-014','ISL106-015','ISL106-016','ISL106-017','ISL106-018',
  'ISL106-019','ISL106-020',
  // SOS114U arasinav 2019 — Q4-20
  'SOS114-004','SOS114-005','SOS114-006','SOS114-007','SOS114-008',
  'SOS114-009','SOS114-010','SOS114-011','SOS114-012','SOS114-013',
  'SOS114-014','SOS114-015','SOS114-016','SOS114-017','SOS114-018',
  'SOS114-019','SOS114-020',
]);

// ISL132U arasinav 2019 yıl bilgisi
const cikmisSinavBilgisi = {
  'ISL132': { yil: '2019', donem: 'Bahar', sinav: 'Arasinav' },
  'ISL106': { yil: '2021', donem: 'Bahar', sinav: 'Arasinav' },
  'SOS114': { yil: '2019', donem: 'Bahar', sinav: 'Arasinav' },
};

const guncellenmis = sorular.map(soru => {
  const cikmisMi = cikmisSorular.has(soru.id);
  const dersPrefix = soru.id.split('-')[0];
  const sinavBilgi = cikmisSinavBilgisi[dersPrefix] || {};

  return {
    ...soru,
    soruTipi: cikmisMi ? 'çıkmış_soru' : 'benzer_soru',
    kaynak: cikmisMi
      ? {
          tur: 'AÖF çıkmış sınav',
          yil: sinavBilgi.yil || null,
          donem: sinavBilgi.donem || null,
          sinav: sinavBilgi.sinav || null,
          sayfa: null,
          not: 'aof.tc sitesinden görüntü olarak elde edilmiştir.',
        }
      : {
          tur: 'Claude üretimi',
          yil: null,
          donem: null,
          sinav: null,
          sayfa: null,
          not: 'Ders müfredatına dayalı pratik/benzer soru. Gerçek çıkmış sınav sorusu değildir.',
        },
    nedenDigerleriDegil: {},
    ogretimNotu: '',
    guvenDurumu: cikmisMi ? 'kontrol_edildi' : 'kontrol_gerekli',
    kontrolEden: cikmisMi ? 'Sistem' : 'Belirtilmedi',
  };
});

fs.writeFileSync(dosyaYolu, JSON.stringify(guncellenmis, null, 2), 'utf8');
console.log(`✓ ${guncellenmis.length} soru güncellendi.`);
console.log(`  Çıkmış soru: ${guncellenmis.filter(s => s.soruTipi === 'çıkmış_soru').length}`);
console.log(`  Benzer soru: ${guncellenmis.filter(s => s.soruTipi === 'benzer_soru').length}`);
console.log(`  Kontrol edildi: ${guncellenmis.filter(s => s.guvenDurumu === 'kontrol_edildi').length}`);
console.log(`  Kontrol gerekli: ${guncellenmis.filter(s => s.guvenDurumu === 'kontrol_gerekli').length}`);
