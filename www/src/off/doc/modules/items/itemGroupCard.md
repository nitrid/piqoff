# itemGroupCard.js Kullanım ve Teknik Dokümantasyonu

## Amaç
`itemGroupCard.js` ekranı, ürün ana grup (main group) kartlarının oluşturulması, düzenlenmesi, silinmesi ve yönetilmesi için kullanılır.  
Kullanıcı, yeni grup ekleyebilir, mevcut grupları düzenleyebilir veya silebilir.

---

## Ana Bileşenler ve Akış

### Ana Nesneler
- **mainGrpObj**: Ana grup kartı ile ilgili tüm verileri ve işlemleri tutar ve yönetir.
- **core**: Uygulamanın ana çekirdeği, SQL işlemleri ve yardımcı fonksiyonlar için kullanılır.

---

## Ekran Bileşenleri

### Toolbar
- **Geri (btnBack)**: Önceki grup kaydına döner.
- **Yeni (btnNew)**: Yeni grup kartı oluşturur.
- **Kaydet (btnSave)**: Grup kartını kaydeder.
- **Kapat (Clear)**: Sayfayı kapatır.

### Form (NdForm)
- **txtCode**: Grup kodu (zorunlu alan, validator var). Kod alanı üzerinden popup ile grup seçimi yapılabilir veya otomatik kod üretilebilir.
- **txtName**: Grup adı.
- **chkActive**: Grup aktif/pasif durumu.

### Popuplar
- **pg_txtCode**: Grup arama ve seçim popup’ı.

### Toast
- **NdToast**: Başarı, uyarı ve hata mesajları için kullanılır.

---

## Teknik Özellikler ve Detaylar

### Veri Yönetimi
- **mainGrpObj**: Grup kartı verilerini tutar. SQL sorguları ile veri çekilir, güncellenir ve silinir.
- **Kayıt kontrolü**: Kod alanı değiştiğinde, aynı kodda grup var mı kontrol edilir ve kullanıcıya bilgi verilir.

### Grup Seçimi ve Ekleme
- **Kod alanı butonları**: 
  - "more" butonu ile popup açılır ve grup seçimi yapılır.
  - "arrowdown" butonu ile otomatik kod üretilir (timestamp).
- **Popup ile seçim**: `pg_txtCode` popup’ı ile mevcut gruplar listelenir ve seçim yapılabilir.

### Kayıt İşlemleri
- **Kaydet**: Kaydet butonuna basıldığında, validasyon sonrası kullanıcıdan onay alınır ve kayıt işlemi yapılır.
- **Yeni**: Yeni butonuna basıldığında form temizlenir ve yeni kayıt için hazırlanır.
- **Geri**: Önceki grup kaydına dönüş yapılır.

### Validasyon
- **txtCode**: Zorunlu alan, validator ile kontrol edilir.
- **Form**: Tüm alanlar için validasyon grubu kullanılır.

### Kullanıcı Deneyimi
- **Popup’lar**: Grup seçimi için popup kullanılır.
- **Toast mesajları**: Başarı, uyarı ve hata durumlarında kullanıcıya bilgi verilir.
- **Dialoglar**: Kayıt ve kapatma işlemlerinde kullanıcıdan onay alınır.

---

## Kullanım Senaryosu (Özet)
1. Kullanıcı sayfayı açar, yeni grup eklemek için "Yeni" butonuna basar.
2. Grup kodu ve adı girilir, aktiflik durumu seçilir.
3. "Kaydet" butonuna basılır, onay sonrası kayıt yapılır.
4. Mevcut bir grup seçmek için kod alanındaki "more" butonuna basılır ve popup’tan seçim yapılır.
5. "Geri" butonu ile önceki grup kaydına dönülebilir, "Kapat" ile sayfa kapatılır.

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