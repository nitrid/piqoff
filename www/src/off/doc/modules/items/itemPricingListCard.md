# itemPricingListCard.js Kullanım ve Teknik Dokümantasyonu

## Amaç
`itemPricingListCard.js` ekranı, ürün fiyat listelerinin oluşturulması, düzenlenmesi, silinmesi ve yönetilmesi için kullanılır.  
Kullanıcı, yeni bir fiyat listesi ekleyebilir, mevcut listeleri düzenleyebilir veya silebilir.

---

## Ana Bileşenler ve Akış

### Ana Nesneler
- **itemPricingListObj**: Fiyat listesi ile ilgili tüm verileri ve işlemleri tutar ve yönetir.
- **core**: Uygulamanın ana çekirdeği, SQL işlemleri ve yardımcı fonksiyonlar için kullanılır.

---

## Ekran Bileşenleri

### Toolbar
- **Geri (btnBack)**: Önceki fiyat listesine döner.
- **Yeni (btnNew)**: Yeni fiyat listesi oluşturur.
- **Kaydet (btnSave)**: Fiyat listesini kaydeder.
- **Sil (btnDelete)**: Fiyat listesini siler.
- **Kapat (Clear)**: Sayfayı kapatır.

### Form (NdForm)
- **txtNo**: Fiyat listesi numarası (zorunlu alan, validator var). Numara alanı üzerinden popup ile fiyat listesi seçimi yapılabilir.
- **txtName**: Fiyat listesi adı (zorunlu alan).
- **txtTag**: Fiyat listesi etiketi (isteğe bağlı).
- **cmbVatType**: KDV tipi (Dahil/Hariç).

### Popuplar
- **pg_txtNo**: Fiyat listesi arama ve seçim popup’ı.

### Toast
- **NdToast**: Başarı, uyarı ve hata mesajları için kullanılır.

---

## Teknik Özellikler ve Detaylar

### Veri Yönetimi
- **itemPricingListObj**: Fiyat listesi verilerini tutar. SQL sorguları ile veri çekilir, güncellenir ve silinir.
- **Kayıt kontrolü**: Numara alanı değiştiğinde, aynı numarada fiyat listesi var mı kontrol edilir ve kullanıcıya bilgi verilir.

### Fiyat Listesi Seçimi ve Ekleme
- **Numara alanı butonları**: 
  - "more" butonu ile popup açılır ve fiyat listesi seçimi yapılır.
- **Popup ile seçim**: `pg_txtNo` popup’ı ile mevcut fiyat listeleri listelenir ve seçim yapılabilir.

### Kayıt İşlemleri
- **Kaydet**: Kaydet butonuna basıldığında, validasyon sonrası kullanıcıdan onay alınır ve kayıt işlemi yapılır.
- **Sil**: Silme işlemi öncesi kullanıcıdan onay alınır.
- **Yeni**: Yeni butonuna basıldığında form temizlenir ve yeni kayıt için hazırlanır.
- **Geri**: Önceki fiyat listesine dönüş yapılır.

### Validasyon
- **txtNo** ve **txtName**: Zorunlu alan, validator ile kontrol edilir.
- **Form**: Tüm alanlar için validasyon grubu kullanılır.

### Kullanıcı Deneyimi
- **Popup’lar**: Fiyat listesi seçimi için popup kullanılır.
- **Toast mesajları**: Başarı, uyarı ve hata durumlarında kullanıcıya bilgi verilir.
- **Dialoglar**: Kayıt, silme ve kapatma işlemlerinde kullanıcıdan onay alınır.

---

## Kullanım Senaryosu (Özet)
1. Kullanıcı sayfayı açar, yeni fiyat listesi eklemek için "Yeni" butonuna basar.
2. Fiyat listesi numarası ve adı girilir, gerekirse etiket ve KDV tipi seçilir.
3. "Kaydet" butonuna basılır, onay sonrası kayıt yapılır.
4. Mevcut bir fiyat listesini seçmek için numara alanındaki "more" butonuna basılır ve popup’tan seçim yapılır.
5. Fiyat listesi silmek için "Sil" butonuna basılır, onay sonrası silinir.
6. "Geri" butonu ile önceki fiyat listesine dönülebilir, "Kapat" ile sayfa kapatılır.

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
- Numara alanı değişiminde, mevcut kayıt kontrolünü asenkron ve kullanıcı dostu şekilde yap.
- Popup ve grid işlemlerinde performans için virtual scrolling gibi özellikleri kullanabilirsin.

--- 