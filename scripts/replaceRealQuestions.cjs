const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/data/questions.json');
const sorular = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const kaynak_ing = { tur: 'çıkmış_soru', yil: 2019, donem: 'güz', sinav: 'arasinav', sayfa: null, not: 'aof.tc/test/2019-ing102u' };
const kaynak_ikt = { tur: 'çıkmış_soru', yil: 2018, donem: 'güz', sinav: 'arasinav', sayfa: null, not: 'aof.tc/test/2018-ikt104u' };

const yeniING = [
  { id:'ING102-001', dersKodu:'İNG102U', dersAdi:'İngilizce II', unite:1, konu:'Dialogue / Agreement',
    soru:'A: I play soccer every weekend.\nB: -------\nWhich of the following completes the dialogue above?',
    secenekler:{A:'Me either.',B:"I don't either.",C:'I do too.',D:'I can too.',E:'I am too.'},
    dogruCevap:'C', aciklama:"'I do too.' kullanılır çünkü A olumlu bir cümle kurmuştur ('I play'). Olumlu bir cümleye olumlu katılmak için 'too' kullanılır. 'I do too.' = Ben de (oynuyorum). 'Me either' ve 'I don't either' olumsuz katılma ifadeleridir, burada yanlıştır.",
    nedenDigerleriDegil:"A ve B olumsuz katılma ifadesi; D ve E anlam olarak tutarsız.", ogretimNotu:'Agree with positive: too / so. Agree with negative: either / neither.',
    soruTipi:'çıkmış_soru', kaynak:kaynak_ing, guvenDurumu:'kontrol_edildi', kontrolEden:'aof.tc-gorsel' },

  { id:'ING102-002', dersKodu:'İNG102U', dersAdi:'İngilizce II', unite:1, konu:'Verb To Be',
    soru:'A: Are you a student?\nB: Yes, -------.',
    secenekler:{A:'they are',B:'we are',C:'I am',D:'she is',E:'you are'},
    dogruCevap:'C', aciklama:"Soru 'Are you...?' şeklinde sorulduğunda birinci tekil şahıs (I) için 'I am' ile cevap verilir. 'Yes, I am.' doğrudur. Diğer seçenekler farklı şahıs zamirlerine aittir.",
    nedenDigerleriDegil:'A (3.çoğul), B (1.çoğul), D (3.tekil dişil), E (2.tekil) — soru birinci tekil şahsa yönelik.', ogretimNotu:'Short answers: Yes, I am. / No, I am not.',
    soruTipi:'çıkmış_soru', kaynak:kaynak_ing, guvenDurumu:'kontrol_edildi', kontrolEden:'aof.tc-gorsel' },

  { id:'ING102-003', dersKodu:'İNG102U', dersAdi:'İngilizce II', unite:1, konu:'Dialogue / Agreement (Negative)',
    soru:"A: I can't speak German.\nB: -------.",
    secenekler:{A:'Me too.',B:"I don't either.",C:"I'm not either.",D:'I can too.',E:"I can't either."},
    dogruCevap:'E', aciklama:"A olumsuz bir cümle kurmuştur ('can't'). Olumsuz bir cümleye olumsuz katılmak için 'either' kullanılır ve yardımcı fiil korunur: 'I can't either.' (Ben de konuşamam). B yanlış çünkü 'don't' yerine 'can't' kullanılmalı.",
    nedenDigerleriDegil:"A ve D olumlu katılma; B yanlış yardımcı fiil (don't, can't değil); C 'not either' kullanımı 'can't' ile dil bilgisel uyumsuz.",
    soruTipi:'çıkmış_soru', kaynak:kaynak_ing, guvenDurumu:'kontrol_edildi', kontrolEden:'aof.tc-gorsel' },

  { id:'ING102-004', dersKodu:'İNG102U', dersAdi:'İngilizce II', unite:2, konu:'Prepositions',
    soru:'Ercan is very good ------- learning languages. He can speak English, French, and Italian.',
    secenekler:{A:'on',B:'at',C:'for',D:'in',E:'with'},
    dogruCevap:'B', aciklama:"'Good at' kalıp bir ifadedir: 'be good at something' (bir şeyde iyi olmak). Örnek: 'She is good at math.' Diğer edatlar bu kalıpta kullanılmaz.",
    nedenDigerleriDegil:"'Good on/for/in/with' + isim kalıbı İngilizce'de bu anlamda kullanılmaz.",
    soruTipi:'çıkmış_soru', kaynak:kaynak_ing, guvenDurumu:'kontrol_edildi', kontrolEden:'aof.tc-gorsel' },

  { id:'ING102-005', dersKodu:'İNG102U', dersAdi:'İngilizce II', unite:2, konu:'Gerund (-ing form)',
    soru:'Sally enjoys ------- poetry.',
    secenekler:{A:'read',B:'reads',C:'in reading',D:'to read',E:'reading'},
    dogruCevap:'E', aciklama:"'Enjoy' fiilinden sonra daima '-ing' (gerund) kullanılır: 'enjoy doing something'. Bu kalıpla to-infinitive kullanılmaz. 'Sally enjoys reading poetry.' doğrudur.",
    nedenDigerleriDegil:"A yalın mastar; B 3.tekil çekim; C edat+gerund kalıbı burada kullanılmaz; D to-infinitive enjoy sonrası yanlış.",
    soruTipi:'çıkmış_soru', kaynak:kaynak_ing, guvenDurumu:'kontrol_edildi', kontrolEden:'aof.tc-gorsel' },

  { id:'ING102-006', dersKodu:'İNG102U', dersAdi:'İngilizce II', unite:2, konu:'Object Pronouns',
    soru:"Our neighbor Dan is an interesting man but I don't really like -------.",
    secenekler:{A:'her',B:'us',C:'it',D:'them',E:'him'},
    dogruCevap:'E', aciklama:"'Dan' erkek bir isimdir, bu yüzden nesne zamiri 'him' kullanılmalıdır. 'I don't like him.' (Ondan hoşlanmıyorum.) A dişil (her), B birinci çoğul (us), C cansız/hayvan (it), D üçüncü çoğul (them).",
    nedenDigerleriDegil:'Zamir, önceki cümledeki ismin cinsiyetine ve sayısına uymalıdır.',
    soruTipi:'çıkmış_soru', kaynak:kaynak_ing, guvenDurumu:'kontrol_edildi', kontrolEden:'aof.tc-gorsel' },

  { id:'ING102-007', dersKodu:'İNG102U', dersAdi:'İngilizce II', unite:2, konu:'Object Pronouns',
    soru:'My music teacher is a very old woman but I really like -------.',
    secenekler:{A:'us',B:'her',C:'them',D:'it',E:'him'},
    dogruCevap:'B', aciklama:"'My music teacher' kadın bir kişidir ('woman'), bu yüzden nesne zamiri 'her' (onu/ona) kullanılmalıdır. 'I really like her.'",
    nedenDigerleriDegil:'A birinci çoğul; C üçüncü çoğul; D cansız; E erkek zamiri — hepsi yanlış cinsiyet veya sayı.',
    soruTipi:'çıkmış_soru', kaynak:kaynak_ing, guvenDurumu:'kontrol_edildi', kontrolEden:'aof.tc-gorsel' },

  { id:'ING102-008', dersKodu:'İNG102U', dersAdi:'İngilizce II', unite:3, konu:'Short Answers / Do',
    soru:'A: Do you go swimming every week?\nB: Yes, I -------.',
    secenekler:{A:'have',B:'can',C:'am',D:'do',E:'would'},
    dogruCevap:'D', aciklama:"'Do you...?' sorusuna 'Yes, I do.' ile cevap verilir. Kısa cevaplarda soru cümlesindeki yardımcı fiil tekrarlanır. 'Do' → 'I do.'",
    nedenDigerleriDegil:'Have/can/am/would farklı yardımcı fiiller; do-sorusuna do ile cevap verilir.',
    soruTipi:'çıkmış_soru', kaynak:kaynak_ing, guvenDurumu:'kontrol_edildi', kontrolEden:'aof.tc-gorsel' },

  { id:'ING102-009', dersKodu:'İNG102U', dersAdi:'İngilizce II', unite:3, konu:'Conjunctions / When',
    soru:'My father never goes to the doctor and takes a pill ------- he feels ill.',
    secenekler:{A:'than',B:'and',C:'when',D:'why',E:'how'},
    dogruCevap:'C', aciklama:"Cümlede zaman ilişkisi kurulmaktadır: hasta hissettiğinde (when he feels ill) hap alır. 'When' = -dığında/-ğında. 'Than' karşılaştırma, 'and' ekleme, 'why/how' anlam vermez.",
    nedenDigerleriDegil:'Than karşılaştırma; and bağlaç ama anlam yanlış; why/how soru sözcüğü burada bağlaç olamaz.',
    soruTipi:'çıkmış_soru', kaynak:kaynak_ing, guvenDurumu:'kontrol_edildi', kontrolEden:'aof.tc-gorsel' },

  { id:'ING102-010', dersKodu:'İNG102U', dersAdi:'İngilizce II', unite:3, konu:'Present Continuous',
    soru:'Kate ------- a lot of fast food these days.',
    secenekler:{A:'eat',B:'are eating',C:'am eating',D:'would eat',E:'is eating'},
    dogruCevap:'E', aciklama:"'These days' (bu günlerde) ifadesi geçici bir alışkanlık için Present Continuous (şimdiki sürekli) zamanı gerektirir. 'Kate' üçüncü tekil şahıs olduğundan 'is eating' doğrudur.",
    nedenDigerleriDegil:'A geniş zaman; B çoğul özne için; C birinci tekil için; D koşullu.',
    soruTipi:'çıkmış_soru', kaynak:kaynak_ing, guvenDurumu:'kontrol_edildi', kontrolEden:'aof.tc-gorsel' },

  { id:'ING102-011', dersKodu:'İNG102U', dersAdi:'İngilizce II', unite:4, konu:'Vocabulary / Health',
    soru:'Please turn it off. I have a really bad ------- because of that loud music.',
    secenekler:{A:'sore throat',B:'stomachache',C:'sneeze',D:'headache',E:'fever'},
    dogruCevap:'D', aciklama:"Yüksek sesli müzik başağrısına (headache) yol açar. 'I have a headache.' (Başım ağrıyor.) Boğaz ağrısı, mide ağrısı, hapşırık veya ateşin gürültülü müzikle doğrudan ilgisi yoktur.",
    nedenDigerleriDegil:'Sore throat boğaz için; stomachache mide için; sneeze hapşırık; fever yüksek ateş — hiçbiri gürültüyle ilgili değil.',
    soruTipi:'çıkmış_soru', kaynak:kaynak_ing, guvenDurumu:'kontrol_edildi', kontrolEden:'aof.tc-gorsel' },

  { id:'ING102-012', dersKodu:'İNG102U', dersAdi:'İngilizce II', unite:4, konu:'Present Continuous / Future',
    soru:'We ------- our friends at 8:30 this evening.',
    secenekler:{A:'are meeting',B:'going to meet',C:'is meeting',D:'meet',E:'meeting'},
    dogruCevap:'A', aciklama:"'This evening' gibi belirli bir gelecek zamanla yapılan planlar için Present Continuous kullanılabilir: 'We are meeting our friends at 8:30.' B seçeneği 'are going to meet' olsaydı kabul edilebilirdi fakat 'going to meet' yardımcı fiil eksik.",
    nedenDigerleriDegil:'C tekil özne için (is); D geniş zaman; E yardımcı fiil yok; B are eksik.',
    soruTipi:'çıkmış_soru', kaynak:kaynak_ing, guvenDurumu:'kontrol_edildi', kontrolEden:'aof.tc-gorsel' },

  { id:'ING102-013', dersKodu:'İNG102U', dersAdi:'İngilizce II', unite:4, konu:'Be Going To',
    soru:"What ------- to buy for Dad's birthday?",
    secenekler:{A:'you go',B:'are you going',C:'are you',D:'you are going',E:'do you go'},
    dogruCevap:'B', aciklama:"Gelecekteki bir niyet veya plan için 'be going to' yapısı kullanılır. Soru formunda: 'What are you going to buy?' Özne (you) yardımcı fiil (are) ile yer değiştirerek soru oluşturulur.",
    nedenDigerleriDegil:'A ve D özne-yardımcı fiil yer değiştirmemiş (soru formatı yanlış); C going to eksik; E do-soru yapısı niyet/plan için uygun değil.',
    soruTipi:'çıkmış_soru', kaynak:kaynak_ing, guvenDurumu:'kontrol_edildi', kontrolEden:'aof.tc-gorsel' },

  { id:'ING102-014', dersKodu:'İNG102U', dersAdi:'İngilizce II', unite:5, konu:'Vocabulary / Months',
    soru:'------- is the fifth month of the year.',
    secenekler:{A:'July',B:'May',C:'June',D:'April',E:'August'},
    dogruCevap:'B', aciklama:"Ayların sırası: Ocak(1), Şubat(2), Mart(3), Nisan(4), Mayıs(5)... Yılın beşinci ayı May (Mayıs)'dır. July=7, June=6, April=4, August=8.",
    nedenDigerleriDegil:'July 7., June 6., April 4., August 8. ay — hiçbiri 5. ay değil.',
    soruTipi:'çıkmış_soru', kaynak:kaynak_ing, guvenDurumu:'kontrol_edildi', kontrolEden:'aof.tc-gorsel' },

  { id:'ING102-015', dersKodu:'İNG102U', dersAdi:'İngilizce II', unite:5, konu:'Vocabulary / School Subjects',
    soru:'Laura wants to be an actress so her favorite subject is -------.',
    secenekler:{A:'drama',B:'geometry',C:'history',D:'choir',E:'physics'},
    dogruCevap:'A', aciklama:"Aktrist olmak isteyen birinin favori ders olarak Drama (Tiyatro/Dramatik Sanatlar) seçmesi mantıklıdır. Geometry, history, choir ve physics aktristlik mesleğiyle doğrudan ilgili değildir.",
    nedenDigerleriDegil:'Geometry matematik; history tarih; choir koro (müzik); physics fizik — aktristlikle alakası yok.',
    soruTipi:'çıkmış_soru', kaynak:kaynak_ing, guvenDurumu:'kontrol_edildi', kontrolEden:'aof.tc-gorsel' },

  { id:'ING102-016', dersKodu:'İNG102U', dersAdi:'İngilizce II', unite:5, konu:'Past Simple / Was-Were',
    soru:"A: Where ------- you born?\nB: I was born in Çanakkale.",
    secenekler:{A:'do',B:'are',C:'have',D:'were',E:'did'},
    dogruCevap:'D', aciklama:"'Born' geçmiş zaman ifadesi olduğundan Past Simple kullanılır. 'To be' fiilinin geçmişi 'was/were'dir. 'You' ile 'were' kullanılır: 'Where were you born?' B'nin cevabı da 'was born' ile bu zaman uyumunu doğruluyor.",
    nedenDigerleriDegil:'Do/are/have şimdiki zaman; did geçmiş soru için kullanılır ama be fiiliyle did kullanılmaz.',
    soruTipi:'çıkmış_soru', kaynak:kaynak_ing, guvenDurumu:'kontrol_edildi', kontrolEden:'aof.tc-gorsel' },

  { id:'ING102-017', dersKodu:'İNG102U', dersAdi:'İngilizce II', unite:6, konu:'Numbers / Years',
    soru:'My father was born in (1924) -------.',
    secenekler:{A:'twenty-nine fourteen',B:'one-nine-two-four',C:'nineteen twelve four',D:'nineteen twenty-four',E:'ninety twenty'},
    dogruCevap:'D', aciklama:"İngilizce'de yıllar genellikle ikiye bölünerek okunur: 19 | 24 → 'nineteen twenty-four'. 1924 = nineteen twenty-four. Diğer seçenekler yanlış okuma biçimleridir.",
    nedenDigerleriDegil:'A, B, C, E yılın okunuş kuralına uymayan yanlış formlardır.',
    soruTipi:'çıkmış_soru', kaynak:kaynak_ing, guvenDurumu:'kontrol_edildi', kontrolEden:'aof.tc-gorsel' },

  { id:'ING102-018', dersKodu:'İNG102U', dersAdi:'İngilizce II', unite:6, konu:'There Is/Are',
    soru:'------- a drugstore in your neighborhood?',
    secenekler:{A:'Is there',B:'Is it',C:'Is here',D:'Is this',E:'Is that'},
    dogruCevap:'A', aciklama:"Bir yerde bir şeyin var olup olmadığını sormak için 'Is there...?' / 'Are there...?' yapısı kullanılır. 'Is there a drugstore?' = Mahallenizde bir eczane var mı?",
    nedenDigerleriDegil:"'Is it/here/this/that' varlık sorgulamak için kullanılan doğru yapılar değildir.",
    soruTipi:'çıkmış_soru', kaynak:kaynak_ing, guvenDurumu:'kontrol_edildi', kontrolEden:'aof.tc-gorsel' },

  { id:'ING102-019', dersKodu:'İNG102U', dersAdi:'İngilizce II', unite:6, konu:'There Is/Are (Negative)',
    soru:'------- any students in the garden because they are in the class.',
    secenekler:{A:'There is no',B:"There isn't",C:"There aren't",D:'There are no',E:'There are'},
    dogruCevap:'C', aciklama:"'Students' çoğul olduğundan 'are' kullanılır. Olumsuz olduğundan 'aren't' doğrudur: 'There aren't any students.' D seçeneği (There are no) dilbilgisel olarak doğru ama 'any' ile kullanılamaz (any, olumsuz yardımcı fiille gelir).",
    nedenDigerleriDegil:"A ve B tekil yapı (is/isn't); D 'no' ile 'any' aynı cümlede kullanılmaz; E olumlu.",
    soruTipi:'çıkmış_soru', kaynak:kaynak_ing, guvenDurumu:'kontrol_edildi', kontrolEden:'aof.tc-gorsel' },

  { id:'ING102-020', dersKodu:'İNG102U', dersAdi:'İngilizce II', unite:7, konu:'Modal Verbs / Can',
    soru:"A: ------- I help you?\nB: Yes, I'd like to get some theater tickets.",
    secenekler:{A:'Can',B:'Have',C:'Do',D:'Did',E:'Would'},
    dogruCevap:'A', aciklama:"'Can I help you?' yardım teklif etmek için kullanılan standart bir ifadedir. Mağaza veya hizmet ortamında 'Can I help you?' (Size yardımcı olabilir miyim?) çok yaygındır.",
    nedenDigerleriDegil:"Have/Do/Did yardımcı fiil olarak burada anlamsız; Would = 'Would I help?' doğal değil.",
    soruTipi:'çıkmış_soru', kaynak:kaynak_ing, guvenDurumu:'kontrol_edildi', kontrolEden:'aof.tc-gorsel' },
];

const yeniIKT = [
  { id:'IKT104-001', dersKodu:'İKT104U', dersAdi:'İktisada Giriş II', unite:1, konu:'İktisat Ekolleri',
    soru:'"Bırakınız yapsınlar – Bırakınız geçsinler" felsefesi aşağıdaki iktisat ekollerinden hangisi tarafından savunulmuştur?',
    secenekler:{A:'Keynesyen',B:'Klasik',C:'Sürrealist',D:'Merkantalist',E:'Marksist'},
    dogruCevap:'B', aciklama:'"Laissez-faire, laissez-passer" (Bırakınız yapsınlar, bırakınız geçsinler) Klasik İktisat ekolünün temel ilkesidir. Serbest piyasanın kendi kendini düzenleyeceğini savunur; devlet müdahalesine karşı çıkarlar.',
    nedenDigerleriDegil:'Keynesyen devlet müdahalesini savunur; Merkantalist devlet düzenlemesini destekler; Marksist ise kapitalizme karşıdır; Sürrealist bir iktisat okulu değildir.',
    soruTipi:'çıkmış_soru', kaynak:kaynak_ikt, guvenDurumu:'kontrol_edildi', kontrolEden:'aof.tc-gorsel' },

  { id:'IKT104-002', dersKodu:'İKT104U', dersAdi:'İktisada Giriş II', unite:2, konu:'Makroekonomik Denge',
    soru:'Bir ekonomide makroekonomik dengenin sağlanması için aşağıdakilerden hangisinin birbirine eşit olması gerekir?',
    secenekler:{A:'Tüketim ve yatırım',B:'Gelir ve ithalat',C:'Tüketim ve tasarruf',D:'Gelir ve harcama',E:'Gelir ve yatırım'},
    dogruCevap:'D', aciklama:'Makroekonomik denge Y = C + I + G + NX formülüyle ifade edilir. Kapalı ekonomide gelir (Y) ile toplam harcama (C+I+G) eşit olduğunda denge sağlanır. Yani Gelir = Harcama eşitliği makroekonomik dengenin temelidir.',
    nedenDigerleriDegil:'Tüketim ≠ yatırım; gelir ≠ ithalat; tüketim ≠ tasarruf (bunlar gelirin kullanımı); gelir ≠ sadece yatırım.',
    soruTipi:'çıkmış_soru', kaynak:kaynak_ikt, guvenDurumu:'kontrol_edildi', kontrolEden:'aof.tc-gorsel' },

  { id:'IKT104-003', dersKodu:'İKT104U', dersAdi:'İktisada Giriş II', unite:3, konu:'Fiyat İstikrarı',
    soru:'Bir ekonomide fiyatlar genel düzeyinin aşağı ya da yukarı yönde hareket etme eğiliminin olmaması durumuna ne ad verilir?',
    secenekler:{A:'Deflasyon',B:'Enflasyon',C:'Senyoraj',D:'Fiyat istikrarı',E:'Devalüasyon'},
    dogruCevap:'D', aciklama:'Fiyat istikrarı; fiyatlar genel düzeyinin ne artmadığı ne de azalmadığı, yani sabit kaldığı durumu ifade eder. Merkez bankalarının temel hedeflerinden biridir. Enflasyon fiyatların artışı, deflasyon fiyatların düşüşüdür.',
    nedenDigerleriDegil:'Deflasyon fiyatların düşmesi; enflasyon fiyatların artması; senyoraj para basma geliri; devalüasyon paranın değer kaybetmesi.',
    soruTipi:'çıkmış_soru', kaynak:kaynak_ikt, guvenDurumu:'kontrol_edildi', kontrolEden:'aof.tc-gorsel' },

  { id:'IKT104-004', dersKodu:'İKT104U', dersAdi:'İktisada Giriş II', unite:3, konu:'GSYH',
    soru:'Bir ekonomide, belli bir dönemde üretilen tamamlanmış mal ve hizmetlerin parasal değerlerinin toplamına ne ad verilir?',
    secenekler:{A:'Arbitraj oranı',B:'Deflasyon',C:'Gayri safi yurtiçi hasıla',D:'Tüketici fiyatları endeksi',E:'Stagflasyon'},
    dogruCevap:'C', aciklama:'Gayri Safi Yurtiçi Hasıla (GSYH/GDP), bir ülkede belirli bir dönemde (genellikle 1 yıl) üretilen tüm nihai mal ve hizmetlerin piyasa değerlerinin toplamıdır. Ülkelerin ekonomik büyüklüğünü ölçmek için kullanılan temel göstergedir.',
    nedenDigerleriDegil:'Arbitraj fiyat farkından kazanç; deflasyon fiyat düşüşü; TÜFE tüketici sepetinin fiyatını ölçer; stagflasyon aynı anda enflasyon+durgunluk.',
    soruTipi:'çıkmış_soru', kaynak:kaynak_ikt, guvenDurumu:'kontrol_edildi', kontrolEden:'aof.tc-gorsel' },

  { id:'IKT104-005', dersKodu:'İKT104U', dersAdi:'İktisada Giriş II', unite:4, konu:'İşsizlik Türleri',
    soru:'İş gücüne yeni katılanları ve işinden çıkarılanları ya da yeni iş arayanları kapsayan ve geçici işsizlik olarak da adlandırılan işsizlik türü aşağıdakilerden hangisidir?',
    secenekler:{A:'Yapısal işsizlik',B:'Gayri iradi işsizlik',C:'Mevsimlik işsizlik',D:'Konjonktürel işsizlik',E:'Friksiyonel işsizlik'},
    dogruCevap:'E', aciklama:'Friksiyonel (arızi) işsizlik; iş arayanların uygun iş bulana kadar geçirdikleri geçici süreçtir. İş değiştirme, yeni mezun olma veya yeni bir şehre taşınma gibi durumları kapsar. Doğal işsizlik oranının bir parçasıdır.',
    nedenDigerleriDegil:'Yapısal: ekonomik yapı değişimi; gayri iradi: çalışmak isteyip bulamayanlar; mevsimlik: mevsime bağlı; konjonktürel: ekonomik daralma dönemindeki işsizlik.',
    soruTipi:'çıkmış_soru', kaynak:kaynak_ikt, guvenDurumu:'kontrol_edildi', kontrolEden:'aof.tc-gorsel' },

  { id:'IKT104-006', dersKodu:'İKT104U', dersAdi:'İktisada Giriş II', unite:5, konu:'Döviz Kuru',
    soru:'Bir ulusal paranın bir biriminin başka bir ulusal para cinsinden değerine ne ad verilir?',
    secenekler:{A:'Döviz arbitrajı',B:'Nominal döviz kuru',C:'Satın alma gücü paritesi',D:'Yurtdışı fiyat endeksi',E:'Yurtiçi fiyat endeksi'},
    dogruCevap:'B', aciklama:'Nominal döviz kuru, bir ülkenin para biriminin başka bir ülkenin para birimi cinsinden ifade edilen değeridir. Örneğin 1 Dolar = 32 Türk Lirası nominal döviz kurudur. Enflasyon etkisi arındırılmamıştır.',
    nedenDigerleriDegil:'Döviz arbitrajı farklı piyasalardaki fiyat farklarından yararlanmak; SGP fiyat düzeylerini karşılaştırır; endeksler fiyat ölçümü için.',
    soruTipi:'çıkmış_soru', kaynak:kaynak_ikt, guvenDurumu:'kontrol_edildi', kontrolEden:'aof.tc-gorsel' },

  { id:'IKT104-007', dersKodu:'İKT104U', dersAdi:'İktisada Giriş II', unite:3, kono:'GSYH / GSMH',
    soru:'Gayri safi yurtiçi hasılaya aşağıdakilerden hangisi eklendiğinde, gayri safi milli hasılaya ulaşılır?',
    secenekler:{A:'İstihdam oranı',B:'Amortismanlar',C:'Sübvansiyonlar',D:'Enflasyon oranı',E:'Net faktör gelirleri'},
    dogruCevap:'E', aciklama:'GSMH = GSYH + Net Faktör Gelirleri formülüyle hesaplanır. Net faktör gelirleri; yurtdışında çalışan vatandaşların gönderdiği gelirlerden, yabancıların ülkede elde ettiği gelirlerin çıkarılmasıyla bulunur.',
    nedenDigerleriDegil:'Amortismanlar GSYİH→NSYİH geçişinde; sübvansiyonlar transfer ödeme; enflasyon ve istihdam oranları ulusal gelir hesabıyla doğrudan ilgili değil.',
    soruTipi:'çıkmış_soru', kaynak:kaynak_ikt, guvenDurumu:'kontrol_edildi', kontrolEden:'aof.tc-gorsel' },

  { id:'IKT104-008', dersKodu:'İKT104U', dersAdi:'İktisada Giriş II', unite:2, konu:'Mal Türleri',
    soru:'Bir başka mal ya da hizmetin üretiminde kullanılan mallara ne ad verilir?',
    secenekler:{A:'Ara malı',B:'Dayanıksız mal',C:'Serbest mal',D:'Nihai mal',E:'Tamamlayıcı mal'},
    dogruCevap:'A', aciklama:"Ara mallar (intermediate goods), başka bir mal veya hizmetin üretiminde girdi olarak kullanılan mallardır. Örneğin ekmek yapmak için kullanılan un bir ara maldır. GSYH hesaplanırken mükerrer sayımı önlemek için ara mallar dahil edilmez, sadece nihai mallar sayılır.",
    nedenDigerleriDegil:'Dayanıksız: kısa sürede tüketilen; serbest: bedava (su, hava); nihai: son tüketiciye ulaşan; tamamlayıcı: birlikte kullanılan (çay+şeker).',
    soruTipi:'çıkmış_soru', kaynak:kaynak_ikt, guvenDurumu:'kontrol_edildi', kontrolEden:'aof.tc-gorsel' },

  { id:'IKT104-009', dersKodu:'İKT104U', dersAdi:'İktisada Giriş II', unite:3, konu:'GSYH Hesaplama',
    soru:'Aşağıdakilerden hangisi GSYH hesaplanırken dikkate alınamayan unsurlardan biri değildir?',
    secenekler:{A:'Yasa dışı ekonomik aktiviteler',B:'Piyasa dışı ekonomik aktiviteler',C:'Tamamlanmış mal ve hizmetler',D:'Mal ve hizmetlerin üretimi ve tüketimi sırasında çevreye verilen zarar',E:'Kayıt dışı ekonomik aktiviteler'},
    dogruCevap:'C', aciklama:"Soru 'dikkate alınamayan unsurlardan biri değildir' şeklinde sorulmaktadır; yani GSYH'ye dahil EDİLEN unsuru sormaktadır. Tamamlanmış (nihai) mal ve hizmetler GSYH hesaplamasına dahil edilir. Diğerleri kayıt dışı veya piyasa dışı olduğundan dahil edilemez.",
    nedenDigerleriDegil:'Yasa dışı, piyasa dışı, kayıt dışı aktiviteler ve dışsallıklar (çevre zararı) resmi GSYH hesabına alınmaz.',
    soruTipi:'çıkmış_soru', kaynak:kaynak_ikt, guvenDurumu:'kontrol_edildi', kontrolEden:'aof.tc-gorsel' },

  { id:'IKT104-010', dersKodu:'İKT104U', dersAdi:'İktisada Giriş II', unite:6, konu:'Uluslararası Kuruluşlar',
    soru:'İnsani Gelişme Endeksi, aşağıdakilerden hangisi tarafından geliştirilmiştir?',
    secenekler:{A:'Dünya Ticaret Örgütü',B:'Birleşmiş Milletler Kalkınma Programı',C:'Ekonomik İşbirliği Teşkilatı',D:'Uluslararası İş Örgütü',E:'Dünya Bankası'},
    dogruCevap:'B', aciklama:"İnsani Gelişme Endeksi (HDI - Human Development Index), BM Kalkınma Programı (UNDP) tarafından geliştirilmiştir (1990). Endeks; eğitim, sağlık ve gelir göstergelerini birleştirerek ülkelerin kalkınma düzeyini ölçer.",
    nedenDigerleriDegil:"DTÖ ticaret; EİT (OECD) ekonomik işbirliği; ILO çalışma standartları; Dünya Bankası borç ve kalkınma finansmanı — hiçbiri HDI'yi geliştirmedi.",
    soruTipi:'çıkmış_soru', kaynak:kaynak_ikt, guvenDurumu:'kontrol_edildi', kontrolEden:'aof.tc-gorsel' },

  { id:'IKT104-011', dersKodu:'İKT104U', dersAdi:'İktisada Giriş II', unite:4, konu:'Maliye',
    soru:'Devletin topladığı vergilerden, hanehalklarına transfer ödemeleri çıkarıldıktan sonra kalan kısma ne ad verilir?',
    secenekler:{A:'Kamu geliri',B:'Kamu tasarrufu',C:'Harcanabilir gelir',D:'Net vergi hasılatı',E:'Kamu yatırımı'},
    dogruCevap:'D', aciklama:"Net vergi hasılatı = Vergi gelirleri − Transfer ödemeleri. Devlet vatandaşlardan topladığı vergilerden sosyal yardım, emekli maaşı gibi transferleri düştükten sonra kalan net kaynağa net vergi hasılatı denir.",
    nedenDigerleriDegil:'Kamu geliri tüm kamu gelirlerini; kamu tasarrufu gelir-harcama farkını; harcanabilir gelir hane halkı için kullanılır; kamu yatırımı devletin yaptığı yatırım harcaması.',
    soruTipi:'çıkmış_soru', kaynak:kaynak_ikt, guvenDurumu:'kontrol_edildi', kontrolEden:'aof.tc-gorsel' },

  { id:'IKT104-012', dersKodu:'İKT104U', dersAdi:'İktisada Giriş II', unite:5, konu:'Faiz Oranları',
    soru:'Nominal faiz oranından, mal ve hizmetlerin fiyatlarındaki artış oranının çıkarılmasıyla elde edilen faiz oranına ne ad verilir?',
    secenekler:{A:'Reel faiz oranı',B:'Brüt faiz oranı',C:'Net değer oranı',D:'Arbitraj oranı',E:'Senyoraj oranı'},
    dogruCevap:'A', aciklama:'Reel faiz oranı = Nominal faiz oranı − Enflasyon oranı (Fisher Denklemi). Reel faiz; paranın satın alma gücündeki gerçek artışı gösterir. Örneğin nominal faiz %20, enflasyon %15 ise reel faiz %5\'tir.',
    nedenDigerleriDegil:'Brüt faiz vergi öncesi; net değer varlık-borç farkı; arbitraj farklı piyasalardan kazanç; senyoraj para basımından elde edilen gelir.',
    soruTipi:'çıkmış_soru', kaynak:kaynak_ikt, guvenDurumu:'kontrol_edildi', kontrolEden:'aof.tc-gorsel' },

  { id:'IKT104-013', dersKodu:'İKT104U', dersAdi:'İktisada Giriş II', unite:2, konu:'Temel Kavramlar',
    soru:'"Tasarruf" kavramının tanımı aşağıdakilerden hangisidir?',
    secenekler:{A:'Gelirin gayrimenkul kıymetlere aktarılan kısmıdır.',B:'Gelirin yatırımlara yöneltilen kısmıdır.',C:'Gelirin menkul kıymetlere aktarılan kısmıdır.',D:'Gelirin reel varlıklara aktarılan kısmıdır.',E:'Toplam gelirin devlet ve hanehalkları tarafından harcanmayan kısmıdır.'},
    dogruCevap:'E', aciklama:'Tasarruf; elde edilen gelirin tüketilmeyerek geleceğe aktarılan kısmıdır. Ekonomik tanımıyla: Tasarruf = Gelir − Tüketim. Bu nedenle toplam gelirin harcanmayan kısmıdır. Tasarruf mutlaka yatırıma veya belirli bir varlığa yöneltilmek zorunda değildir.',
    nedenDigerleriDegil:'A, B, C, D seçenekleri tasarrufun kullanım biçimlerini (yatırım araçlarını) tanımlar; tasarrufun kendisini değil.',
    soruTipi:'çıkmış_soru', kaynak:kaynak_ikt, guvenDurumu:'kontrol_edildi', kontrolEden:'aof.tc-gorsel' },

  { id:'IKT104-014', dersKodu:'İKT104U', dersAdi:'İktisada Giriş II', unite:1, konu:'Temel Kavramlar',
    soru:'"Ödünleşim" kavramının tanımı aşağıdakilerden hangisidir?',
    secenekler:{A:'Üretilen son birimin maliyetinin sıfırlanmasıdır.',B:'Bir şeyden daha fazla elde etmek için başka bir şeyden vazgeçme zorunluluğudur.',C:'Borçların ertelenmesidir.',D:'İktisadi aktörlerin uzlaşmasıdır.',E:'Vergi borcunun kapatılmasıdır.'},
    dogruCevap:'B', aciklama:'Ödünleşim (trade-off); kıt kaynaklarla yapılan seçimlerde bir şeyi elde etmek için başka bir şeyden vazgeçmek zorunda kalmayı ifade eder. Örneğin daha fazla dinlenme zamanı istiyorsanız çalışma saatinizden, dolayısıyla gelirinizden vazgeçersiniz.',
    nedenDigerleriDegil:'A marjinal maliyet; C borç yönetimi; D müzakere; E vergi ile ilgili — hiçbiri ödünleşim kavramı değil.',
    soruTipi:'çıkmış_soru', kaynak:kaynak_ikt, guvenDurumu:'kontrol_edildi', kontrolEden:'aof.tc-gorsel' },

  { id:'IKT104-015', dersKodu:'İKT104U', dersAdi:'İktisada Giriş II', unite:2, konu:'Yatırım',
    soru:'Sermaye mallarının maliyeti + finansal sermayenin maliyeti aşağıdakilerden hangisini ifade eder?',
    secenekler:{A:'Vergi maliyeti',B:'Senyoraj maliyeti',C:'Kredi maliyeti',D:'Yatırımın maliyeti',E:'Arbitraj maliyeti'},
    dogruCevap:'D', aciklama:"Yatırımın toplam maliyeti; fiziksel sermaye mallarının (makine, ekipman) maliyeti ile bu yatırımı finanse etmek için kullanılan finansal sermayenin (kredi faizi, öz kaynak fırsat maliyeti) toplamından oluşur.",
    nedenDigerleriDegil:'Vergi maliyeti devlete ödenen vergi; senyoraj para basımı geliri; kredi maliyeti sadece borçlanma bedeli; arbitraj farklı piyasalar arası kazanç.',
    soruTipi:'çıkmış_soru', kaynak:kaynak_ikt, guvenDurumu:'kontrol_edildi', kontrolEden:'aof.tc-gorsel' },

  { id:'IKT104-016', dersKodu:'İKT104U', dersAdi:'İktisada Giriş II', unite:2, konu:'Üretim Faktörleri',
    soru:'Firmanın istihdam ettiği son işçinin, firmanın toplam maliyetinde yaptığı değişime ne ad verilir?',
    secenekler:{A:'Marjinal sabit maliyet',B:'Marjinal ürün hasılası',C:'Ortalama faktör maliyeti',D:'Toplam ürün maliyeti',E:'Marjinal faktör maliyeti'},
    dogruCevap:'E', aciklama:'Marjinal faktör maliyeti (MFC); bir birim daha fazla üretim faktörü (bu durumda işçi) istihdam etmenin toplam maliyete yaptığı ek değişimdir. Bir işçi daha alındığında toplam maliyet ne kadar artar? Cevap: Marjinal faktör maliyeti.',
    nedenDigerleriDegil:'Marjinal sabit maliyet kavramı yoktur (sabit maliyetler marjinal değildir); marjinal ürün hasılası çıktıdaki değişim; ortalama faktör maliyeti toplam/birim.',
    soruTipi:'çıkmış_soru', kaynak:kaynak_ikt, guvenDurumu:'kontrol_edildi', kontrolEden:'aof.tc-gorsel' },

  { id:'IKT104-017', dersKodu:'İKT104U', dersAdi:'İktisada Giriş II', unite:2, konu:'Üretim / Verimlilik',
    soru:'Üretimin (hasılanın), bunu yaratan üretim faktörlerine oranına ne ad verilir?',
    secenekler:{A:'Faktör teknolojisi',B:'Faktör büyüme oranı',C:'Verimlilik',D:'Üretim teknolojisi',E:'Faktör oranı'},
    dogruCevap:'C', aciklama:'Verimlilik (productivity); birim üretim faktörü başına elde edilen çıktı miktarıdır. Formül: Verimlilik = Çıktı / Girdi. Emek verimliliği, sermaye verimliliği gibi alt türleri vardır. Yüksek verimlilik ekonomik büyümenin temelidir.',
    nedenDigerleriDegil:'Faktör teknolojisi ve üretim teknolojisi teknolojik bilgiyle ilgili; faktör büyüme oranı büyüme hızı; faktör oranı girdi bileşimi.',
    soruTipi:'çıkmış_soru', kaynak:kaynak_ikt, guvenDurumu:'kontrol_edildi', kontrolEden:'aof.tc-gorsel' },

  { id:'IKT104-018', dersKodu:'İKT104U', dersAdi:'İktisada Giriş II', unite:2, konu:'Marjinal Analiz',
    soru:'Üretime katılan son işçinin, işletmenin toplam hasılasında meydana getirdiği değişikliğe ne ad verilir?',
    secenekler:{A:'Optimum hasıla katsayısı',B:'Marjinal faktör maliyeti',C:'Marjinal ürün hasılası',D:'Optimum emek değeri',E:'Marjinal tüketim eğilimi'},
    dogruCevap:'C', aciklama:'Marjinal ürün hasılası (MPL - Marginal Product of Labour); işgücüne bir birim daha eklenmesinin toplam üretimi (çıktıyı) ne kadar artırdığını gösterir. MPL = ΔQ / ΔL. Azalan verimler yasası gereği ek işçiler giderek daha az marjinal ürün hasılası getirir.',
    nedenDigerleriDegil:'Marjinal faktör maliyeti maliyetteki değişim; marjinal tüketim eğilimi gelirdeki artışın tüketime giden payı; diğerleri gerçek kavram değil.',
    soruTipi:'çıkmış_soru', kaynak:kaynak_ikt, guvenDurumu:'kontrol_edildi', kontrolEden:'aof.tc-gorsel' },

  { id:'IKT104-019', dersKodu:'İKT104U', dersAdi:'İktisada Giriş II', unite:6, konu:'Büyüme',
    soru:'Bir ülkede yıllık büyüme oranı yüzde 10 ise bu ülkede kişi başına gelir kaç yıl sonra iki katına çıkar?',
    secenekler:{A:'7',B:'8',C:'9',D:'10',E:'12'},
    dogruCevap:'A', aciklama:'70 Kuralı (Rule of 70): Bir değerin iki katına çıkması için gereken süre ≈ 70 / büyüme oranı. %10 büyüme için: 70 / 10 = 7 yıl. Bu kural bileşik büyümenin hızını kolayca hesaplamak için kullanılır.',
    nedenDigerleriDegil:'8, 9, 10, 12 yıl 70 kuralına uymayan yanlış değerlerdir.',
    soruTipi:'çıkmış_soru', kaynak:kaynak_ikt, guvenDurumu:'kontrol_edildi', kontrolEden:'aof.tc-gorsel' },

  { id:'IKT104-020', dersKodu:'İKT104U', dersAdi:'İktisada Giriş II', unite:4, konu:'İşsizlik',
    soru:'Doğal işsizlik oranı ile cari işsizlik oranı arasındaki fark nedeniyle potansiyel hasıladaki kaybı ölçen katsayıya ne ad verilir?',
    secenekler:{A:"Okun Yasası",B:'Leontief Paradoksu',C:'Say Yasası',D:'Gresham Yasası',E:'Pareto Optimumu'},
    dogruCevap:'A', aciklama:"Okun Yasası (Okun's Law); işsizlik oranındaki her 1 puanlık artışın GSYH'yi yaklaşık 2 puan azalttığını belirtir. Yani cari işsizlik doğal oranın üzerinde olduğunda, ekonomi potansiyelinin altında üretim yapar.",
    nedenDigerleriDegil:"Leontief Paradoksu dış ticaret teorisi; Say Yasası 'her arz kendi talebini yaratır'; Gresham 'kötü para iyi parayı kovar'; Pareto optimallik kavramı.",
    soruTipi:'çıkmış_soru', kaynak:kaynak_ikt, guvenDurumu:'kontrol_edildi', kontrolEden:'aof.tc-gorsel' },
];

// Mevcut soruları filtrele ve yenileri ile değiştir
const guncellenmis = sorular
  .filter(s => s.dersKodu !== 'İNG102U' && s.dersKodu !== 'İKT104U')
  .concat(yeniING)
  .concat(yeniIKT);

fs.writeFileSync(filePath, JSON.stringify(guncellenmis, null, 2), 'utf8');
console.log(`✓ Toplam ${guncellenmis.length} soru. İNG102U: ${yeniING.length}, İKT104U: ${yeniIKT.length} gerçek soru eklendi.`);
