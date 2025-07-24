# labelPrinting.js Kullanım ve Teknik Dokümantasyonu

## Amaç
`labelPrinting.js` ekranı, ürün etiketlerinin toplu olarak hazırlanması, düzenlenmesi ve yazdırılması için kullanılır.  
Kullanıcı, bir veya birden fazla ürünü seçip, etiket tasarımını belirleyip, toplu olarak etiket çıktısı alabilir.

---

## Ana Bileşenler ve Akış

### Ana Nesneler
- **mainLblObj**: Ana etiket kuyruğu (MAIN_LABEL_QUEUE) ile ilgili işlemleri ve verileri tutar.
- **lblObj**: Etiket kuyruğundaki (her bir ürün için) satırları tutar ve yönetir.

---

## Ekran Bileşenleri

### Toolbar
- **Kaydet (btnSave)**: Etiket kuyruğunu kaydeder.
- **Yazdır (btnPrint)**: Seçili tasarımla etiketleri yazdırır.
- **Kapat (Clear)**: Sayfayı kapatır.

### Form (NdForm)
- **txtRef**: Evrak referans numarası (readonly).
- **txtPage**: Sayfa numarası (readonly).
- **cmbDesignList**: Etiket tasarım listesinden seçim yapılır. (Zorunlu alan, validator var)
- **txtFreeLabel**: Boş etiket adedi (readonly).
- **txtBarcode**: Barkod girilerek ürün eklenir.
- **txtLineCount**: Satır sayısı (readonly).

### Grid (NdGrid - grdLabelQueue)
- Eklenen ürünlerin listelendiği, düzenlenebildiği ve silinebildiği ana tablo.
- **Kolonlar:** Satır no, kullanıcı, ürün kodu, barkod, ürün adı, grup adı, menşei, fiyat, alt birim, alt birim fiyatı, açıklama.
- Grid üzerinde satır güncelleme ve silme işlemleri yapılabilir.

### Popuplar
- **pg_txtItemsCode**: Ürün arama ve seçim popup’ı.
- **pg_Docs, pg_DocsCombine**: Evrak arama ve birleştirme popup’ları.
- **popWizard**: Toplu ürün ekleme sihirbazı.

---

## Teknik Özellikler ve Detaylar

### Veri Yönetimi
- **mainLblObj** ve **lblObj**: Her biri kendi datatable yapısını kullanır. SQL sorguları ile veri çekilir ve güncellenir.
- **Eklenen ürünler**: `lblObj`’de tutulur, grid’e yansır ve kaydedildiğinde `mainLblObj`’ye JSON olarak yazılır.

### Etiket Tasarımı
- **cmbDesignList**: SQL’den tasarım listesi çekilir. Seçilen tasarımın sayfa başına kaç etiket basacağı bilgisi alınır (`PAGE_COUNT`).
- **Validator**: Tasarım seçimi zorunludur, validator ile kontrol edilir.

### Ürün Ekleme
- **Barkod ile ekleme**: txtBarcode alanına barkod girilerek ürün eklenir.
- **Popup ile ekleme**: pg_txtItemsCode popup’ı ile ürün arama ve seçim yapılabilir.
- **Toplu ekleme**: popWizard ile çeşitli filtrelerle toplu ürün eklenebilir.

### Grid Özellikleri
- **Düzenleme**: Gridde satır güncelleme ve silme yapılabilir.
- **Filtreleme**: Kolon başlıklarında filtre satırı vardır.
- **Export**: Grid verisi Excel’e aktarılabilir.
- **Sanal kaydırma**: Büyük veri setlerinde performans için virtual scrolling kullanılır.

### Yazdırma
- **btnPrint**: Seçili tasarımla, seçili ürünler için etiket çıktısı alınır.
- **Sunucuya veri gönderimi**: SQL’den etiket verisi çekilir, socket ile yazıcıya gönderilir.
- **Önizleme**: Yazıcıdan dönen PDF base64 olarak yeni pencerede gösterilir.

### Validasyon
- **Tasarım seçimi**: Zorunlu alan, validator ile kontrol edilir.
- **Grid satırları**: Fiyat, alt birim gibi alanlarda güncelleme sonrası hesaplamalar yapılır.

### Kullanıcı Deneyimi
- **Klavye ile hızlı giriş**: Barkod alanında enter ile ürün eklenebilir.
- **Popup’lar**: Ürün, evrak, toplu ekleme gibi işlemler için popup’lar kullanılır.
- **Toast mesajları**: Başarı, uyarı ve hata durumlarında kullanıcıya bilgi verilir.

---

## Kullanım Senaryosu (Özet)
1. Kullanıcı sayfayı açar, mevcut bir etiket kuyruğu varsa yüklenir.
2. Ürün eklemek için barkod girer veya popup’tan ürün seçer.
3. Tasarım listesinden bir etiket tasarımı seçer (zorunlu).
4. Gerekirse toplu ürün ekleme sihirbazını kullanır.
5. Gridde ürünleri düzenler veya siler.
6. Kaydet butonuna basarak kuyruğu kaydeder.
7. Yazdır butonuna basarak seçili tasarımla etiket çıktısı alır.

---

## Kodda Dikkat Edilmesi Gerekenler
- Her alanın id’si benzersiz olmalı.
- Form ve gridlerde validationGroup’lar atanırken {"formItem" + this.tabIndex} kullanılmalı. this.tabIndex açılan her ekran için benzersiz id dir.
- Popup ve grid işlemlerinde asenkron işlemler dikkatli yönetilmeli.
- SQL sorguları ve veri güncellemeleri try/catch ile hata yönetimi yapılmalı.

---

## Geliştiriciye Tavsiyeler
- Yeni alan eklerken, validator’ı custom component içinde değil, Form item’ında tanımla.
- Grid ve formda aynı validationGroup’u birden fazla yerde kullanma.
- Kullanıcıya her işlem sonrası toast veya dialog ile bilgi ver.

---