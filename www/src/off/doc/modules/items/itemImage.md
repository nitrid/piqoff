# itemImage.js Kullanım ve Teknik Dokümantasyonu

## Amaç
`itemImage.js` ekranı, ürünlere ait görsellerin (resimlerin) eklenmesi, güncellenmesi, silinmesi ve yönetilmesi için kullanılır.  
Kullanıcı, bir ürüne birden fazla görsel ekleyebilir, mevcut görselleri güncelleyebilir veya silebilir.

---

## Ana Bileşenler ve Akış

### Ana Nesneler
- **itemImageObj**: Ürün görselleri ile ilgili tüm verileri ve işlemleri tutar ve yönetir.
- **core**: Uygulamanın ana çekirdeği, SQL işlemleri ve yardımcı fonksiyonlar için kullanılır.

---

## Ekran Bileşenleri

### Toolbar
- **Yeni (btnNew)**: Formu temizler, yeni görsel eklemek için hazırlar.
- **Kaydet (btnSave)**: Görselleri kaydeder.
- **Sil (btnDelete)**: Tüm görselleri siler.
- **Kapat (Clear)**: Sayfayı kapatır.

### Form (NdForm)
- **txtRef**: Ürün kodu (popup ile ürün seçimi yapılabilir).
- **lblName**: Ürün adı (otomatik dolar, sadece okunur).

### Popuplar
- **pg_txtRef**: Ürün arama ve seçim popup’ı.

### Görsel Yükleme Alanları
- **imgFile1**: Küçük görsel (360x270).
- **imgFile2, imgFile3, imgFile4, imgFile5**: Büyük görseller (620x465 veya serbest).
- Her görsel için ayrı ekle ve sil butonları bulunur.

### Toast
- **NdToast**: Başarı, uyarı ve hata mesajları için kullanılır.

---

## Teknik Özellikler ve Detaylar

### Veri Yönetimi
- **itemImageObj**: Ürün görsellerini tutar. SQL sorguları ile veri çekilir, güncellenir ve silinir.
- **Görsel ekleme/güncelleme**: Her görsel için çözünürlük bilgisiyle birlikte veri kaydedilir.
- **Görsel silme**: Seçili görsel veya tüm görseller silinebilir.

### Ürün Seçimi ve Görsel Ekleme
- **Ürün seçimi**: txtRef alanındaki "more" butonu ile popup açılır ve ürün seçimi yapılır. Seçilen ürünün adı otomatik olarak doldurulur.
- **Görsel yükleme**: Her görsel alanında yükleme sonrası çözünürlük alınır ve ilgili kayda eklenir.
- **Görsel silme**: Her görsel için ayrı silme butonu bulunur.

### Kayıt İşlemleri
- **Kaydet**: Kaydet butonuna basıldığında, kullanıcıdan onay alınır ve kayıt işlemi yapılır.
- **Sil**: Sil butonuna basıldığında, kullanıcıdan onay alınır ve tüm görseller silinir.
- **Yeni**: Yeni butonuna basıldığında form temizlenir ve yeni kayıt için hazırlanır.

### Validasyon
- Görsel yükleme alanlarında validasyon yoktur, ancak ürün seçimi zorunludur.

### Kullanıcı Deneyimi
- **Popup’lar**: Ürün seçimi için popup kullanılır.
- **Toast mesajları**: Başarı, uyarı ve hata durumlarında kullanıcıya bilgi verilir.
- **Dialoglar**: Kayıt, silme ve kapatma işlemlerinde kullanıcıdan onay alınır.

---

## Kullanım Senaryosu (Özet)
1. Kullanıcı sayfayı açar, yeni görsel eklemek için "Yeni" butonuna basar.
2. Ürün seçmek için "Ürün" alanındaki "more" butonuna basılır ve popup’tan ürün seçilir.
3. Küçük ve büyük görseller ilgili alanlardan yüklenir.
4. "Kaydet" butonuna basılır, onay sonrası kayıt yapılır.
5. Mevcut bir ürünün görsellerini silmek için "Sil" butonuna basılır, onay sonrası tüm görseller silinir.
6. Her görsel için ayrı silme butonları ile tekil görseller de silinebilir.
7. "Kapat" ile sayfa kapatılır.

---

## Kodda Dikkat Edilmesi Gerekenler
- Her alanın id’si benzersiz olmalı.
- Form ve popup işlemlerinde asenkron işlemler dikkatli yönetilmeli.
- SQL sorguları ve veri güncellemeleri try/catch ile hata yönetimi yapılmalı.
- Görsel yükleme ve silme işlemlerinde kullanıcı onayı alınmalı.

---

## Geliştiriciye Tavsiyeler
- Yeni görsel alanı eklerken, çözünürlük ve veri yapısına dikkat et.
- Kullanıcıya her işlem sonrası toast veya dialog ile bilgi ver.
- Ürün seçimi ve görsel yükleme işlemlerinde kullanıcı dostu arayüzler kullan.
- Görsel yükleme sonrası çözünürlük bilgisini mutlaka kaydet.

--- 