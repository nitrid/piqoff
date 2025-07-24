# itemSubGroupCard.js Kullanım ve Teknik Dokümantasyonu

## Amaç
`itemSubGroupCard.js` ekranı, ürün alt grup (sub group) kartlarının oluşturulması, düzenlenmesi, silinmesi ve yönetilmesi için kullanılır.  
Kullanıcı, yeni alt grup ekleyebilir, mevcut alt grupları düzenleyebilir veya silebilir.
Bir alt grup a birden fazla alt grup bağlanabilir.

---

## Ana Bileşenler ve Akış

### Ana Nesneler
- **subGrpObj**: Alt grup kartı ile ilgili tüm verileri ve işlemleri tutar ve yönetir.
- **core**: Uygulamanın ana çekirdeği, SQL işlemleri ve yardımcı fonksiyonlar için kullanılır.

---

## Ekran Bileşenleri

### Toolbar
- **Geri (btnBack)**: Önceki alt grup kaydına döner.
- **Yeni (btnNew)**: Yeni alt grup kartı oluşturur.
- **Kaydet (btnSave)**: Alt grup kartını kaydeder.
- **Kapat (Clear)**: Sayfayı kapatır.

### Form (NdForm)
- **txtCode**: Alt grup kodu (zorunlu alan, validator var). Kod alanı üzerinden popup ile alt grup seçimi yapılabilir veya otomatik kod üretilebilir.
- **txtName**: Alt grup adı.
- **chkActive**: Alt grup aktif/pasif durumu.

### Popuplar
- **pg_txtCode**: Alt grup arama ve seçim popup’ı.

### Toast
- **NdToast**: Başarı, uyarı ve hata mesajları için kullanılır.

---

## Teknik Özellikler ve Detaylar

### Veri Yönetimi
- **subGrpObj**: Alt grup kartı verilerini tutar. SQL sorguları ile veri çekilir, güncellenir ve silinir.
- **Kayıt kontrolü**: Kod alanı değiştiğinde, aynı kodda alt grup var mı kontrol edilir ve kullanıcıya bilgi verilir.

### Alt Grup Seçimi ve Ekleme
- **Kod alanı butonları**: 
  - "more" butonu ile popup açılır ve alt grup seçimi yapılır.
  - "arrowdown" butonu ile otomatik kod üretilir (timestamp).
- **Popup ile seçim**: `pg_txtCode` popup’ı ile mevcut alt gruplar listelenir ve seçim yapılabilir.

### Kayıt İşlemleri
- **Kaydet**: Kaydet butonuna basıldığında, validasyon sonrası kullanıcıdan onay alınır ve kayıt işlemi yapılır.
- **Yeni**: Yeni butonuna basıldığında form temizlenir ve yeni kayıt için hazırlanır.
- **Geri**: Önceki alt grup kaydına dönüş yapılır.

### Validasyon
- **txtCode**: Zorunlu alan, validator ile kontrol edilir.
- **Form**: Tüm alanlar için validasyon grubu kullanılır.

### Kullanıcı Deneyimi
- **Popup’lar**: Alt grup seçimi için popup kullanılır.
- **Toast mesajları**: Başarı, uyarı ve hata durumlarında kullanıcıya bilgi verilir.
- **Dialoglar**: Kayıt ve kapatma işlemlerinde kullanıcıdan onay alınır.

---

## Kullanım Senaryosu (Özet)
1. Kullanıcı sayfayı açar, yeni alt grup eklemek için "Yeni" butonuna basar.
2. Alt grup kodu ve adı girilir, aktiflik durumu seçilir.
3. "Kaydet" butonuna basılır, onay sonrası kayıt yapılır.
4. Mevcut bir alt grup seçmek için kod alanındaki "more" butonuna basılır ve popup’tan seçim yapılır.
5. "Geri" butonu ile önceki alt grup kaydına dönülebilir, "Kapat" ile sayfa kapatılır.

---

## Kodda Dikkat Edilmesi Gerekenler
- Her alanın id’si benzersiz olmalı.
- Form ve popup işlemlerinde asenkron işlemler dikkatli yönetilmeli.
- SQL sorguları ve veri güncellemeleri try/catch ile hata yönetimi yapılmalı.

---

## Geliştiriciye Tavsiyeler
- Yeni alan eklerken, validator’ı custom component içinde değil, Form item’ında tanımla.
- Kullanıcıya her işlem sonrası toast veya dialog ile bilgi ver.
- Kod alanı değişiminde, mevcut kayıt kontrolünü asenkron ve kullanıcı dostu şekilde yap.
- Popup ve grid işlemlerinde performans için virtual scrolling gibi özellikleri kullanabilirsin.

--- 