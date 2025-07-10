# barcodeCard.js Kullanım ve Teknik Dokümantasyonu

## Amaç
`barcodeCard.js` ekranı, ürünlere ait barkodların eklenmesi, düzenlenmesi ve yönetilmesi için kullanılır.  
Kullanıcı, bir ürüne yeni barkod ekleyebilir, mevcut barkodları güncelleyebilir veya silebilir.

---

## Ana Bileşenler ve Akış

### Ana Nesneler
- **itemBarcodeObj**: Barkod kartı ile ilgili tüm verileri ve işlemleri tutar ve yönetir.
- **core**: Uygulamanın ana çekirdeği, SQL işlemleri ve yardımcı fonksiyonlar için kullanılır.

---

## Ekran Bileşenleri

### Toolbar
- **Yeni (btnNew)**: Yeni barkod kartı oluşturur.
- **Kaydet (btnSave)**: Barkod kartını kaydeder.
- **Kapat (Clear)**: Sayfayı kapatır.

### Form (NdForm)
- **txtItem**: Ürün kodu (popup ile ürün seçimi yapılabilir, zorunlu alan).
- **txtItemName**: Ürün adı (otomatik dolar, sadece okunur).
- **txtBarcode**: Barkod (zorunlu alan, otomatik üretim butonu var).
- **txtPartiLot**: Parti/Lot kodu (popup ile seçim yapılabilir).
- **cmbPopBarType**: Barkod tipi (EAN8, EAN13, CODE39).
- **cmbBarUnit**: Barkodun bağlı olduğu birim (ürüne göre dinamik gelir).
- **txtBarUnitFactor**: Birim katsayısı (otomatik dolar, sadece okunur).
- **txtUnitTypeName**: Birim tipi (Ana birim/Alt birim, otomatik dolar).

### Popuplar
- **pg_txtItem**: Ürün arama ve seçim popup’ı.
- **pg_txtBarcode**: Barkod arama ve seçim popup’ı.
- **pg_txtPartiLot**: Parti/Lot arama ve seçim popup’ı.

### Toast
- **NdToast**: Başarı, uyarı ve hata mesajları için kullanılır.

---

## Teknik Özellikler ve Detaylar

### Veri Yönetimi
- **itemBarcodeObj**: Barkod kartı verilerini tutar. SQL sorguları ile veri çekilir, güncellenir ve silinir.
- **Barkod kontrolü**: Barkod alanı değiştiğinde, aynı barkodda kayıt var mı kontrol edilir ve kullanıcıya bilgi verilir.

### Ürün ve Barkod Seçimi/Ekleme
- **Ürün seçimi**: txtItem alanındaki "more" butonu ile popup açılır ve ürün seçimi yapılır. Seçilen ürünün birimleri otomatik olarak yüklenir.
- **Barkod üretimi**: txtBarcode alanındaki "arrowdown" butonu ile otomatik barkod üretilir (timestamp).
- **Barkod tipi**: Barkod uzunluğuna göre otomatik olarak barkod tipi seçilir (EAN8, EAN13, CODE39).

### Parti/Lot Seçimi
- **txtPartiLot**: Parti/Lot kodu popup ile seçilebilir. Seçim sonrası ilgili alanlar otomatik dolar.

### Kayıt İşlemleri
- **Kaydet**: Kaydet butonuna basıldığında, validasyon sonrası kullanıcıdan onay alınır ve kayıt işlemi yapılır.
- **Yeni**: Yeni butonuna basıldığında form temizlenir ve yeni kayıt için hazırlanır.

### Validasyon
- **txtItem** ve **txtBarcode**: Zorunlu alan, validator ile kontrol edilir.
- **Form**: Tüm alanlar için validasyon grubu kullanılır.

### Kullanıcı Deneyimi
- **Popup’lar**: Ürün, barkod ve parti/lot seçimi için popup kullanılır.
- **Toast mesajları**: Başarı, uyarı ve hata durumlarında kullanıcıya bilgi verilir.
- **Dialoglar**: Kayıt ve kapatma işlemlerinde kullanıcıdan onay alınır.

---

## Kullanım Senaryosu (Özet)
1. Kullanıcı sayfayı açar, yeni barkod eklemek için "Yeni" butonuna basar.
2. Ürün seçmek için "Ürün" alanındaki "more" butonuna basılır ve popup’tan ürün seçilir.
3. Barkod alanı doldurulur veya otomatik üretilir.
4. Gerekirse barkod tipi ve birim seçilir, parti/lot kodu eklenir.
5. "Kaydet" butonuna basılır, onay sonrası kayıt yapılır.
6. Mevcut bir barkodu düzenlemek için barkod arama popup’ı kullanılabilir.
7. "Kapat" ile sayfa kapatılır.

---

## Kodda Dikkat Edilmesi Gerekenler
- Her alanın id’si benzersiz olmalı.
- Form ve popup işlemlerinde asenkron işlemler dikkatli yönetilmeli.
- SQL sorguları ve veri güncellemeleri try/catch ile hata yönetimi yapılmalı.
- Barkod tipi ve birim seçimlerinde otomasyon ve validasyonlara dikkat edilmeli.

---

## Geliştiriciye Tavsiyeler
- Yeni alan eklerken, validator’ı custom component içinde değil, Form item’ında tanımla.
- Kullanıcıya her işlem sonrası toast veya dialog ile bilgi ver.
- Barkod ve ürün seçimlerinde popup’ların performansına dikkat et.
- Barkod tipi ve birim otomasyonunu kullanıcı dostu şekilde uygula.

--- 