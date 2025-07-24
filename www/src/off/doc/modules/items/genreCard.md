# genreCard.js Kullanım ve Teknik Dokümantasyonu

## Amaç
`genreCard.js` ekranı, ürün türü (genre) kartlarının oluşturulması, düzenlenmesi, silinmesi ve yönetilmesi için kullanılır.  
Kullanıcı, yeni tür ekleyebilir, mevcut türleri düzenleyebilir veya silebilir.

---

## Ana Bileşenler ve Akış

### Ana Nesneler
- **genreObj**: Tür kartı ile ilgili tüm verileri ve işlemleri tutar ve yönetir.
- **core**: Uygulamanın ana çekirdeği, SQL işlemleri ve yardımcı fonksiyonlar için kullanılır.

---

## Ekran Bileşenleri

### Toolbar
- **Geri (btnBack)**: Önceki tür kaydına döner.
- **Yeni (btnNew)**: Yeni tür kartı oluşturur.
- **Kaydet (btnSave)**: Tür kartını kaydeder.
- **Sil (btnDelete)**: Tür kartını siler.
- **Kapat (Clear)**: Sayfayı kapatır.

### Form (NdForm)
- **txtCode**: Tür kodu (zorunlu alan, validator var). Kod alanı üzerinden popup ile tür seçimi yapılabilir veya otomatik kod üretilebilir.
- **txtName**: Tür adı.

### Popuplar
- **pg_txtCode**: Tür arama ve seçim popup’ı.

### Toast
- **NdToast**: Başarı, uyarı ve hata mesajları için kullanılır.

---

## Teknik Özellikler ve Detaylar

### Veri Yönetimi
- **genreObj**: Tür kartı verilerini tutar. SQL sorguları ile veri çekilir, güncellenir ve silinir.
- **Kayıt kontrolü**: Kod alanı değiştiğinde, aynı kodda tür var mı kontrol edilir ve kullanıcıya bilgi verilir.

### Tür Seçimi ve Ekleme
- **Kod alanı butonları**: 
  - "more" butonu ile popup açılır ve tür seçimi yapılır.
  - "arrowdown" butonu ile otomatik kod üretilir (timestamp).
- **Popup ile seçim**: `pg_txtCode` popup’ı ile mevcut türler listelenir ve seçim yapılabilir.

### Kayıt İşlemleri
- **Kaydet**: Kaydet butonuna basıldığında, validasyon sonrası kullanıcıdan onay alınır ve kayıt işlemi yapılır.
- **Sil**: Silme işlemi öncesi kullanıcıdan onay alınır.
- **Yeni**: Yeni butonuna basıldığında form temizlenir ve yeni kayıt için hazırlanır.
- **Geri**: Önceki tür kaydına dönüş yapılır.

### Validasyon
- **txtCode**: Zorunlu alan, validator ile kontrol edilir.
- **Form**: Tüm alanlar için validasyon grubu kullanılır.

### Kullanıcı Deneyimi
- **Popup’lar**: Tür seçimi için popup kullanılır.
- **Toast mesajları**: Başarı, uyarı ve hata durumlarında kullanıcıya bilgi verilir.
- **Dialoglar**: Kayıt, silme ve kapatma işlemlerinde kullanıcıdan onay alınır.

---

## Kullanım Senaryosu (Özet)
1. Kullanıcı sayfayı açar, yeni tür eklemek için "Yeni" butonuna basar.
2. Tür kodu ve adı girilir.
3. "Kaydet" butonuna basılır, onay sonrası kayıt yapılır.
4. Mevcut bir türü seçmek için kod alanındaki "more" butonuna basılır ve popup’tan seçim yapılır.
5. Tür silmek için "Sil" butonuna basılır, onay sonrası silinir.
6. "Geri" butonu ile önceki tür kaydına dönülebilir, "Kapat" ile sayfa kapatılır.

---

## Kodda Dikkat Edilmesi Gerekenler
- Her alanın id’si benzersiz olmalı.
- Form ve popup işlemlerinde asenkron işlemler dikkatli yönetilmeli.
- SQL sorguları ve veri güncellemeleri try/catch ile hata yönetimi yapılmalı.
- Kayıt silme işleminde kullanıcı onayı alınmalı.

---

## Geliştiriciye Tavsiyeler
- Yeni alan eklerken, validator’ı custom component içinde değil, Form item’ında tanımla.
- Kullanıcıya her işlem sonrası toast veya dialog ile bilgi ver.
- Kod alanı değişiminde, mevcut kayıt kontrolünü asenkron ve kullanıcı dostu şekilde yap.
- Popup ve grid işlemlerinde performans için virtual scrolling gibi özellikleri kullanabilirsin.

--- 