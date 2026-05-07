# Sınav Hazırlık Uygulaması

Anadolu Üniversitesi Açıköğretim sınavlarına yönelik basit, hızlı ve sade bir çalışma aracı.

---

## Kurulum ve Çalıştırma

### Gereksinimler
- Node.js (v18 veya üzeri) — https://nodejs.org

### Adımlar

```bash
# 1. Bu klasöre girin
cd sinav-hazirlik

# 2. Bağımlılıkları kurun (ilk seferinde)
npm install

# 3. Uygulamayı başlatın
npm run dev
```

Tarayıcınızda `http://localhost:5173` adresine gidin.

### Derleme (paylaşmak için)
```bash
npm run build
# dist/ klasörü oluşur, herhangi bir statik host'a yüklenebilir
```

---

## Proje Klasör Yapısı

```
sinav-hazirlik/
├── index.html                    # Giriş HTML'i
├── vite.config.js                # Vite yapılandırması
├── package.json
├── README.md
└── src/
    ├── main.jsx                  # React başlangıç noktası
    ├── App.jsx                   # Ana uygulama, mod yönetimi
    ├── index.css                 # Tüm stiller
    ├── components/
    │   ├── DersSecimi.jsx        # Ders kartları ekranı
    │   ├── OgrenmeModu.jsx       # Soru çözme ekranı
    │   ├── YanliklarModu.jsx     # Yanlış soru tekrar ekranı
    │   ├── MiniSinav.jsx         # 20 soruluk sınav ekranı
    │   └── GenelDurum.jsx        # Özet ve öneri paneli
    ├── data/
    │   └── questions.json        # Soru bankası (düzenleyeceğiniz dosya)
    └── utils/
        ├── localStorage.js       # Veri kayıt/okuma fonksiyonları
        └── hesaplamalar.js       # Net, puan, risk hesaplama
```

---

## Soru JSON Formatı

Her soru şu yapıda olmalıdır:

```json
{
  "id": "ISL106-001",
  "dersKodu": "İŞL106U",
  "dersAdi": "İşletme Fonksiyonları",
  "unite": 1,
  "konu": "Yönetim Fonksiyonları",
  "soru": "Soru metni burada olacak",
  "secenekler": {
    "A": "Seçenek A",
    "B": "Seçenek B",
    "C": "Seçenek C",
    "D": "Seçenek D",
    "E": "Seçenek E"
  },
  "dogruCevap": "C",
  "aciklama": "Kısa, sade açıklama burada olacak.",
  "zorluk": "kolay",
  "etiketler": ["tanım", "sık çıkan"]
}
```

**Önemli kurallar:**
- `id` benzersiz olmalı (örn: ISL106-042)
- `dersKodu` tam olarak şunlardan biri olmalı: `İKT104U`, `İŞL106U`, `İŞL118U`, `İNG102U`, `İŞL132U`, `SOS114U`
- `dogruCevap` büyük harf: `A`, `B`, `C`, `D` veya `E`
- `secenekler` objesi en az 4, en fazla 5 seçenek içermeli
- `zorluk`: `kolay`, `orta` veya `zor`

---

## CSV'den JSON'a Çevirme

CSV dosyanızı şu formatta oluşturun:

```
id,dersKodu,dersAdi,unite,konu,soru,A,B,C,D,E,dogruCevap,aciklama,zorluk
ISL106-010,İŞL106U,İşletme Fonksiyonları,2,Pazarlama,"Soru metni",Seç A,Seç B,Seç C,Seç D,Seç E,B,"Açıklama",kolay
```

Dönüştürmek için terminalde şunu çalıştırın:

```bash
node csv_to_json.js sorular.csv >> src/data/questions.json
```

`csv_to_json.js` örnek içeriği:

```javascript
const fs = require('fs');
const dosya = process.argv[2];
const satirlar = fs.readFileSync(dosya, 'utf8').split('\n').slice(1).filter(Boolean);

const sorular = satirlar.map(satir => {
  const [id, dersKodu, dersAdi, unite, konu, soru, A, B, C, D, E, dogruCevap, aciklama, zorluk] =
    satir.split(',').map(s => s.replace(/^"|"$/g, '').trim());
  return {
    id, dersKodu, dersAdi, unite: Number(unite), konu, soru,
    secenekler: { A, B, C, D, E },
    dogruCevap, aciklama, zorluk, etiketler: []
  };
});

console.log(JSON.stringify(sorular, null, 2));
```

> Not: Soru metninde virgül varsa tırnak içine alın. Veya Excel'de "CSV UTF-8" olarak kaydedin.

---

## Uygulama Modu Açıklamaları

| Mod | Açıklama |
|-----|----------|
| **Dersler** | 6 ders kartı, her birinde risk durumu |
| **Öğrenme** | Karışık sırayla soru çöz, anında geri bildirim al |
| **Yanlışlar** | Sadece yanlış yapılan sorular, 2 kez doğru yapınca "öğrenildi" |
| **Mini Sınav** | 20 soruluk sınav, net ve tahmini puan hesabı |
| **Genel Durum** | Tüm dersler özeti, öneri, yanlış konu analizi |

---

## Soru Eklerken Dikkat Edilecekler

1. **ID benzersizliği:** Her sorunun ID'si tamamen farklı olmalı. Örnek format: `IKT104-023`
2. **Açıklama kısa tutun:** 1-3 cümle. Babam için kısa ve net açıklama daha etkili.
3. **dersKodu tam eşleşmeli:** Türkçe karakter dahil. Kopyala-yapıştır yapın.
4. **Seçenekler dengeli olsun:** Doğru cevap her zaman aynı harfte olmasın (A, B, C, D, E dağılımı dengeli olsun).
5. **Konuyu mutlaka doldurun:** Yanlış analizi konuya göre yapılıyor.
6. **"Gerçek çıkmış soru" iddiasında bulunmayın:** Uygulama bunu zaten söylemiyor; siz de soru metnine "çıkmış soru" yazmayın.

---

## Sonraki Adımlar

- [ ] **Daha fazla soru:** Her dersten en az 50 soru olursa mini sınav daha güvenilir sonuç verir.
- [ ] **Ünite filtresi:** Belirli bir üniteden soru çözme seçeneği eklenebilir.
- [ ] **Zorluk filtresi:** "Sadece kolay sorular" veya "sadece zor sorular" modu.
- [ ] **Yanlış soru istatistiği:** Kaç kez çözüldü, kaçta doğru yapıldı gösterimi.
- [ ] **Sınav geçmişi:** Önceki mini sınav sonuçlarını liste halinde görme.
- [ ] **Yazdırma:** Yanlış yapılan soruları PDF olarak yazdırma.
- [ ] **Veri yedekleme:** LocalStorage verisini dışa aktarma / içe aktarma.

---

## Notlar

- Tüm ilerleme verisi tarayıcının **localStorage** bölümünde saklanır. Tarayıcı geçmişi veya cache temizlenirse veri silinir.
- Aynı bilgisayarda farklı tarayıcı kullanılırsa veriler ayrı saklanır.
- Uygulamayı farklı cihaza taşımak için "Genel Durum" panelinden veri export özelliği eklenebilir (sonraki adımlar listesinde).
