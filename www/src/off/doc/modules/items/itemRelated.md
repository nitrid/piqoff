# itemRelated.js Kullanım ve Teknik Dokümantasyonu

## Amaç
`itemRelated.js` ekranı, bir ürünün ilişkili (bağlı) ürünlerini tanımlamak, düzenlemek ve yönetmek için kullanılır.  
Kullanıcı, bir ürüne bağlı ürünler ekleyebilir, mevcut ilişkileri güncelleyebilir veya silebilir.
Fatura yada başka bir evrak ekranında ilişkili ürün seçildiğinde diğer ürünler otomatik olarak eklenir.

---

## Ana Bileşenler ve Akış

### Ana Nesneler
- **itemRelatedObj**: İlişkili ürünler ile ilgili tüm verileri ve işlemleri tutar ve yönetir.
- **core**: Uygulamanın ana çekirdeği, SQL işlemleri ve yardımcı fonksiyonlar için kullanılır.

---

## Ekran Bileşenleri

### Toolbar
- **Yeni (btnNew)**: Formu temizler, yeni ilişki eklemek için hazırlar.
- **Kaydet (btnSave)**: İlişkili ürünleri kaydeder.
- **Sil (btnDelete)**: Tüm ilişkili ürünleri siler.
- **Kapat (Clear)**: Sayfayı kapatır.

### Form (NdForm)
- **txtCode**: Ana ürün kodu (popup ile ürün seçimi yapılabilir, zorunlu alan).
- **txtName**: Ana ürün adı (otomatik dolar, sadece okunur).
- **txtQuantity**: Ana ürün miktarı (isteğe bağlı).

### Grid (NdGrid)
- **grdRelated**: Eklenen ilişkili ürünlerin listelendiği tablo.
  - **RELATED_CODE**: Bağlı ürün kodu
  - **RELATED_NAME**: Bağlı ürün adı
  - **RELATED_QUANTITY**: Bağlı ürün miktarı

### Popuplar
- **popItemSelect**: Ana ürün arama ve seçim popup’ı.
- **popRelatedSelect**: Bağlı ürün arama ve seçim popup’ı.

### Toast
- **NdToast**: Başarı, uyarı ve hata mesajları için kullanılır.

---

## Teknik Özellikler ve Detaylar

### Veri Yönetimi
- **itemRelatedObj**: İlişkili ürün verilerini tutar. SQL sorguları ile veri çekilir, güncellenir ve silinir.
- **Bağlı ürün ekleme**: Grid üzerinden birden fazla bağlı ürün eklenebilir.

### Ürün ve Bağlı Ürün Seçimi/Ekleme
- **Ana ürün seçimi**: txtCode alanındaki "more" butonu ile popup açılır ve ürün seçimi yapılır. Seçilen ürünün adı otomatik olarak doldurulur.
- **Bağlı ürün ekleme**: Grid üzerindeki "+" butonu ile popup açılır ve birden fazla bağlı ürün seçilebilir. Seçilen ürünler grid’e eklenir.

### Kayıt İşlemleri
- **Kaydet**: Kaydet butonuna basıldığında, validasyon sonrası kullanıcıdan onay alınır ve kayıt işlemi yapılır.
- **Sil**: Sil butonuna basıldığında, kullanıcıdan onay alınır ve tüm ilişkili ürünler silinir.
- **Yeni**: Yeni butonuna basıldığında form temizlenir ve yeni kayıt için hazırlanır.

### Validasyon
- **txtCode**: Zorunlu alan, validator ile kontrol edilir.
- **Form**: Tüm alanlar için validasyon grubu kullanılır.

### Kullanıcı Deneyimi
- **Popup’lar**: Ana ürün ve bağlı ürün seçimi için popup kullanılır.
- **Toast mesajları**: Başarı, uyarı ve hata durumlarında kullanıcıya bilgi verilir.
- **Dialoglar**: Kayıt, silme ve kapatma işlemlerinde kullanıcıdan onay alınır.
- **Grid**: Bağlı ürünler gridde listelenir, silinebilir ve güncellenebilir.

---

## Kullanım Senaryosu (Özet)
1. Kullanıcı sayfayı açar, yeni ilişki eklemek için "Yeni" butonuna basar.
2. Ana ürün seçmek için "Ürün" alanındaki "more" butonuna basılır ve popup’tan ürün seçilir.
3. Grid üzerindeki "+" butonuna basılır, popup’tan bir veya birden fazla bağlı ürün seçilir.
4. Gerekirse miktar bilgileri girilir.
5. "Kaydet" butonuna basılır, onay sonrası kayıt yapılır.
6. Mevcut ilişkili ürünleri silmek için "Sil" butonuna basılır, onay sonrası tüm ilişkiler silinir.
7. "Kapat" ile sayfa kapatılır.

---

## Kodda Dikkat Edilmesi Gerekenler
- Her alanın id’si benzersiz olmalı.
- Form, popup ve grid işlemlerinde asenkron işlemler dikkatli yönetilmeli.
- SQL sorguları ve veri güncellemeleri try/catch ile hata yönetimi yapılmalı.
- Kayıt silme işleminde kullanıcı onayı alınmalı.

---

## Geliştiriciye Tavsiyeler
- Yeni alan eklerken, validator’ı custom component içinde değil, Form item’ında tanımla.
- Kullanıcıya her işlem sonrası toast veya dialog ile bilgi ver.
- Grid ve popup işlemlerinde performans için virtual scrolling gibi özellikleri kullanabilirsin.
- Bağlı ürün eklerken, aynı ürünün tekrar eklenmesini engellemek için kontrol ekleyebilirsin.

--- 