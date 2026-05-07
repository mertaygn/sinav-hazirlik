# Soru Verisi Kalite Kılavuzu

## 1. Soru Kalite Kontrol Checklist'i

Bir soruyu `kontrol_edildi` olarak işaretlemeden önce şu adımları uygula:

- [ ] Soru metni net ve anlaşılır mı?
- [ ] Beş seçenek (A–E) var mı, hepsi dolu mu?
- [ ] Doğru cevap harfi (`dogruCevap`) seçenekler içinde mi?
- [ ] Açıklama neden o seçeneğin doğru olduğunu açıklıyor mu?
- [ ] Diğer seçeneklerin neden yanlış olduğu belirtilmiş mi? (`nedenDigerleriDegil`)
- [ ] Ünite numarası doğru mu?
- [ ] Kaynak bilgisi (`kaynak.tur`, yıl, dönem, sınav türü) doldurulmuş mu?
- [ ] Soru tipi (`soruTipi`) doğru atandı mı? (`çıkmış_soru` / `benzer_soru` / `konu_pekiştirme`)
- [ ] Soru daha önce başka bir ID ile girilmemiş mi?

---

## 2. Yeni Soru Ekleme Şablonu (JSON)

```json
{
  "id": "İŞL132U-021",
  "dersKodu": "İŞL132U",
  "dersAdi": "Finansal Muhasebe",
  "unite": 3,
  "konu": "Dönem Sonu İşlemleri",
  "soru": "Soru metni buraya gelir?",
  "secenekler": {
    "A": "Birinci seçenek",
    "B": "İkinci seçenek",
    "C": "Üçüncü seçenek",
    "D": "Dördüncü seçenek",
    "E": "Beşinci seçenek"
  },
  "dogruCevap": "C",
  "aciklama": "Doğru cevap C'dir çünkü...",
  "nedenDigerleriDegil": "A yanlış çünkü... B yanlış çünkü...",
  "ogretimNotu": "Bu konuya Ünite 3 sayfa 12'de değinilmiştir.",
  "soruTipi": "çıkmış_soru",
  "kaynak": {
    "tur": "vize",
    "yil": 2021,
    "donem": "güz",
    "sinav": "arasinav",
    "sayfa": null,
    "not": ""
  },
  "guvenDurumu": "kontrol_edildi",
  "kontrolEden": "manuel"
}
```

**Geçerli dersKodu değerleri:**
`İŞL132U`, `İŞL106U`, `İŞL118U`, `İKT104U`, `SOS114U`, `İNG102U`

**Geçerli soruTipi değerleri:**
- `çıkmış_soru` — AÖF sınavından birebir alınmış
- `benzer_soru` — AÖF tarzında hazırlanmış, orijinal değil
- `konu_pekiştirme` — Konu anlaşılması için ek alıştırma

**Geçerli guvenDurumu değerleri:**
- `kontrol_edildi` — Mini sınava dahil edilir
- `kontrol_gerekli` — Henüz incelenmedi, sınava girmez
- `supheli` — Yanlış olabilir, doğrulanmadan kullanılmaz

---

## 3. CSV Formatı

Toplu soru eklemek için aşağıdaki CSV sütun sırası kullanılır:

```
id,dersKodu,dersAdi,unite,konu,soru,A,B,C,D,E,dogruCevap,aciklama,soruTipi,guvenDurumu
```

**Örnek satır:**
```
İŞL132U-021,İŞL132U,Finansal Muhasebe,3,Dönem Sonu,Soru metni?,Seç A,Seç B,Seç C,Seç D,Seç E,C,Açıklama metni.,çıkmış_soru,kontrol_gerekli
```

CSV import etmeden önce aşağıdaki adımları uygula (bkz. Madde 4).

---

## 4. Veriyi İçeri Almadan Önce Manuel Kontrol Listesi

1. **ID benzersizliği:** Her satırdaki ID başka bir soruda kullanılıyor mu? Kontrol: `questions.json` içinde ara.
2. **dersKodu doğruluğu:** 6 geçerli koddan biri mi? Büyük harf ve Türkçe karakter dahil tam eşleşme gerekli.
3. **dogruCevap tutarlılığı:** Belirtilen harf (A/B/C/D/E) aynı satırda dolu mu?
4. **Açıklama varlığı:** `aciklama` sütunu boş değil mi? En az 1 tam cümle olmalı.
5. **Ünite numarası:** 1–15 arası pozitif tam sayı. 0 veya boş kabul edilmez.
6. **Soru tekrarı:** Aynı soru metni başka bir ID ile daha önce girilmiş mi?
7. **Kaynak:** Sınav kaynağı biliniyorsa yıl, dönem, sınav türü doldurulmuş mu?
8. **guvenDurumu:** Yeni eklenen sorular `kontrol_gerekli` olarak başlamalı; manuel incelemeden sonra `kontrol_edildi` yapılabilir.

Uygulama Veri Kontrol Paneli (`Veri Kontrol` menüsü) otomatik hata/uyarı listesi üretir.

---

## 5. Babana Yönelik Açıklama Yazma Rehberi

Bu uygulama Baba'nın AÖF sınavına hazırlanmasına yardımcı olmak için yapıldı. Açıklamalar onun düzeyinde, yani:

**Açıklama nasıl yazılmalı:**

- Tek paragraf, 2–4 cümle. Daha uzun gerek yok.
- "Bu sorunun doğru cevabı C'dir çünkü..." şeklinde başla.
- Terim kullanacaksan hemen yanında parantez içinde Türkçe karşılığını yaz.
- Soyut kural yerine somut örnek ver: "Şirketin kasasında 1.000 TL varsa, borç tarafına yazılır."
- Diğer seçeneklerin neden yanlış olduğunu 1 cümleyle belirt.

**Kötü açıklama örneği:**
> "Doğru cevap muhasebe eşitliğidir."

**İyi açıklama örneği:**
> "Doğru cevap C'dir çünkü muhasebe eşitliği (Varlıklar = Kaynaklar) her zaman sağlanmak zorundadır. Bir varlık artarsa, ya bir borç ya da öz kaynak aynı miktarda artmalıdır. A yanlıştır çünkü aktif ve pasif toplamlarının eşit olmak zorunda olmadığını iddia eder — bu temel muhasebe kuralına aykırıdır."
