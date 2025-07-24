# depotCard.js Kullanım ve Teknik Dokümantasyonu

## Amaç
`depotCard.js` ekranı, depo (depot) kartlarının oluşturulması, düzenlenmesi, silinmesi ve yönetilmesi için kullanılır.  
Kullanıcı, yeni depo ekleyebilir, mevcut depoları düzenleyebilir veya silebilir.

---

## Ana Bileşenler ve Akış

### Ana Nesneler
- **depotObj**: Depo kartı ile ilgili tüm verileri ve işlemleri tutar ve yönetir.
- **core**: Uygulamanın ana çekirdeği, SQL işlemleri ve yardımcı fonksiyonlar için kullanılır.

---

## Ekran Bileşenleri

### Toolbar
- **Geri (btnBack)**: Önceki depoya döner.
- **Yeni (btnNew)**: Yeni depo kartı oluşturur.
- **Kaydet (btnSave)**: Depo kartını kaydeder.
- **Sil (btnDelete)**: Depo kartını siler.
- **Kapat (Clear)**: Sayfayı kapatır.

### Form (NdForm)
- **txtCode**: Depo kodu (zorunlu alan, validator var). Kod alanı üzerinden popup ile depo seçimi yapılabilir veya otomatik kod üretilebilir.
- **txtName**: Depo adı.
- **cmbType**: Depo tipi (Normal, İade, Mağaza, Kesinti).
- **chkActive**: Depo aktif/pasif durumu.

### Popuplar
- **pg_txtCode**: Depo arama ve seçim popup’ı.

### Toast
- **NdToast**: Başarı, uyarı ve hata mesajları için kullanılır.

---

## Teknik Özellikler ve Detaylar

### Veri Yönetimi
- **depotObj**: Depo kartı verilerini tutar. SQL sorguları ile veri çekilir, güncellenir ve silinir.
- **Kayıt kontrolü**: Kod alanı değiştiğinde, aynı kodda depo var mı kontrol edilir ve kullanıcıya bilgi verilir.

### Depo Seçimi ve Ekleme
- **Kod alanı butonları**: 
  - "more" butonu ile popup açılır ve depo seçimi yapılır.
  - "arrowdown" butonu ile otomatik kod üretilir (timestamp).
- **Popup ile seçim**: `pg_txtCode` popup’ı ile mevcut depolar listelenir ve seçim yapılabilir.

### Kayıt İşlemleri
- **Kaydet**: Kaydet butonuna basıldığında, validasyon sonrası kullanıcıdan onay alınır ve kayıt işlemi yapılır.
- **Sil**: Silme işlemi öncesi, depoya bağlı hareket olup olmadığı kontrol edilir. Varsa silme engellenir.
- **Yeni**: Yeni butonuna basıldığında form temizlenir ve yeni kayıt için hazırlanır.
- **Geri**: Önceki depoya dönüş yapılır.

### Validasyon
- **txtCode**: Zorunlu alan, validator ile kontrol edilir.
- **Form**: Tüm alanlar için validasyon grubu kullanılır.

### Kullanıcı Deneyimi
- **Popup’lar**: Depo seçimi için popup kullanılır.
- **Toast mesajları**: Başarı, uyarı ve hata durumlarında kullanıcıya bilgi verilir.
- **Dialoglar**: Kayıt, silme ve kapatma işlemlerinde kullanıcıdan onay alınır.

---

## Kullanım Senaryosu (Özet)
1. Kullanıcı sayfayı açar, yeni depo eklemek için "Yeni" butonuna basar.
2. Depo kodu ve adı girilir, depo tipi ve aktiflik durumu seçilir.
3. "Kaydet" butonuna basılır, onay sonrası kayıt yapılır.
4. Mevcut bir depo seçmek için kod alanındaki "more" butonuna basılır ve popup’tan seçim yapılır.
5. Depo silmek için "Sil" butonuna basılır, eğer depoya bağlı hareket yoksa silinir.
6. "Geri" butonu ile önceki depoya dönülebilir, "Kapat" ile sayfa kapatılır.

---

## Kodda Dikkat Edilmesi Gerekenler
- Her alanın id’si benzersiz olmalı.
- Form ve popup işlemlerinde asenkron işlemler dikkatli yönetilmeli.
- SQL sorguları ve veri güncellemeleri try/catch ile hata yönetimi yapılmalı.
- Kayıt silme işleminde depo hareket kontrolü yapılmalı.

---

## Geliştiriciye Tavsiyeler
- Yeni alan eklerken, validator’ı custom component içinde değil, Form item’ında tanımla.
- Kullanıcıya her işlem sonrası toast veya dialog ile bilgi ver.
- Kod alanı değişiminde, mevcut kayıt kontrolünü asenkron ve kullanıcı dostu şekilde yap.
- Popup ve grid işlemlerinde performans için virtual scrolling gibi özellikleri kullanabilirsin.

--- 