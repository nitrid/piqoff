# purchaseOffer.js Kullanım ve Teknik Dokümantasyonu

## Amaç
`purchaseOffer.js` modülü, satın alma teklif belgelerinin oluşturulması, düzenlenmesi ve yönetilmesi için kullanılır.  
Tedarikçilerden alınan teklifler bu modülde hazırlanır, kayıt altına alınır ve sipariş ya da faturaya dönüştürülebilir.

---

## Ana Bileşenler ve Akış

### Ana Nesneler
- **docObj**: Ana belge bilgilerini tutar (DOC tablosu - docCls)
- **docDetailObj**: Belgeye ait ürün satırlarını tutar (DOC_OFFERS tablosu)
- **extraObj**: Belge ekstra bilgilerini tutar (docExtraCls)
- **nf525**: NF525 uyumluluğu için (nf525Cls)
- **discObj**: İndirim hesaplamalarını yönetir (discountCls)

### Miras Alınan Base Class
- **DocBase**: Temel belge işlemlerini sağlayan ana sınıf
  - Ortak belge fonksiyonları (kaydetme, silme, yazdırma, vb.)
  - Hesaplama fonksiyonları (calculateTotal, calculateMargin)
  - Popup yönetimi ve grid işlemleri

---

## Ekran Bileşenleri

### Toolbar
- **Yeni (btnNew)**: Yeni teklif belgesi oluşturur
- **Kaydet (btnSave)**: Mevcut belgeyi kaydeder
- **Geri (btnBack)**: Son kaydedilen haline döner
- **Sil (btnDelete)**: Belgeyi siler
- **Kopyala (btnCopy)**: Belgeyi kopyalar
- **Yazdır (btnPrint)**: Belge çıktısı alır
- **Evrak No (Referans)**: Belgeler arası geçiş için
- **Depo Seçimi**: Hangi depodan satış yapılacağını belirler

### Ana Form (NdForm - frmPurcOffer)
**Belge Bilgileri:**
- **txtRef**: Belge referansı (otomatik/manuel)
- **txtRefno**: Belge numarası (otomatik)
- **dtDocDate**: Belge tarihi
- **dtShipDate**: Sevk tarihi
- **txtCustomerCode**: Tedarikçi kodu (popup ile seçim)
- **txtCustomerName**: Tedarikçi adı (readonly)

**Toplam Bilgileri:**
- **txtAmount**: Ara toplam
- **txtDiscount**: İndirim tutarı  
- **txtDocDiscount**: Belge indirimi
- **txtSubTotal**: Net toplam
- **txtVat**: KDV tutarı
- **txtTotal**: Genel toplam
- **txtTotalHt**: KDV hariç toplam

### Ürün Grid (NdGrid - grdPurcOffer)
- **Ürün bilgileri**: Kod, ad, açıklama
- **Miktar ve fiyat**: Quantity, Price, Amount
- **İndirim**: Discount, Discount Rate
- **KDV**: VAT Rate, VAT
- **Toplam**: Total, Total HT
- **Birim**: Unit, Unit Factor
- **Maliyet**: Cost Price, Margin

### Popup'lar
- **pg_txtCustomerCode**: Tedarikçi arama ve seçim
- **pg_txtItemsCode**: Ürün arama ve seçim
- **pg_txtBarcode**: Barkod ile ürün arama
- **popDiscount**: Satır indirimi girişi
- **popDocDiscount**: Belge indirimi girişi
- **msgQuantity**: Miktar ve birim girişi
- **msgUnit**: Birim dönüştürme
- **popMultiItem**: Toplu ürün ekleme

---

## Teknik Özellikler ve Detaylar

### Veri Yönetimi
- **DocBase inheritance**: Temel belge işlemleri miras alınır
- **Multi-table yapısı**: DOC, DOC_OFFERS, DOC_EXTRA tabloları koordineli çalışır
- **Real-time hesaplamalar**: Her değişiklikte otomatik toplam hesaplama
- **State management**: Belge durumu anlık takip edilir

### Belge Tipi Tanımları
```javascript
type: 1 (Giriş belgesi)
docType: 61 (Satın alma teklifi)
rebate: 0 (Normal belge)
```

### Ürün Ekleme Yöntemleri
1. **Manuel girış**: Grid'e doğrudan yazarak
2. **Ürün kodu**: Popup ile arama ve seçim
3. **Barkod**: Barkod okuyarak
4. **Toplu ekleme**: Çoklu ürün seçimi

### Hesaplama Mantığı
```javascript
// Satır hesaplaması
Amount = Quantity * Price
Discount = Amount * (DiscountRate / 100)
TotalHT = Amount - Discount - DocDiscount
VAT = TotalHT * (VATRate / 100)
Total = TotalHT + VAT

// Belge toplamı
DocumentTotal = Sum(Total)
DocumentVAT = Sum(VAT)
DocumentSubTotal = Sum(TotalHT)
```

### Margin Hesaplama
- **Satır Marjı**: (Satış Fiyatı - Maliyet) / Satış Fiyatı * 100
- **Belge Marjı**: Toplam marj tutarı ve yüzdesi
- **Real-time güncelleme**: Her değişiklikte marj yeniden hesaplanır

### İndirim Yönetimi
- **3 kademeli indirim**: Discount1, Discount2, Discount3
- **Belge indirimi**: Tüm satırlara oransal dağıtım
- **Müşteri indirimi**: Otomatik uygulanan özel indirimler
- **Validasyon**: İndirim tutarının satır tutarını geçememesi

### Birim Dönüştürme
- **Ana birim**: Ürünün temel satış birimi
- **Alt birimler**: Farklı satış birimlerine dönüştürme
- **Faktör hesaplama**: Birimler arası çarpan hesaplama
- **Fiyat dönüştürme**: Birime göre fiyat ayarlama

---

## Kullanım Senaryoları

### Yeni Teklif Oluşturma
1. **Yeni** butonuna tıkla
2. **Tedarikçi seç** (txtCustomerCode popup)
3. **Belge tarihi** ve **sevk tarihi** gir
4. **Ürün ekle** (grid'e manuel veya popup ile)
5. **Miktar ve fiyat** bilgilerini gir
6. **İndirim uygula** (gerekirse)
7. **Kaydet**

### Ürün Ekleme Süreci
1. **Grid'de yeni satır** oluştur
2. **Ürün kodu gir** veya popup'tan seç
3. **Miktar belirle** (birim seçimi ile)
4. **Fiyat gir** (otomatik fiyat listesinden gelir)
5. **İndirim uygula** (satır veya belge indirimi)
6. **Marj kontrol et**

### Belge Dönüşümü
- **Siparişe dönüştürme**: Onaylanan teklif sipariş olur
- **Faturaya dönüştürme**: Direkt faturalaştırma
- **Irsaliyeye dönüştürme**: Fiziki sevkiyat belgesi

---

## Grid Özellikleri ve İşlemler

### Editing Özellikleri
- **Cell editing**: Satır bazında düzenleme
- **Row operations**: Satır ekleme, silme, kopyalama
- **Keyboard navigation**: Enter ile hızlı geçiş
- **Validation**: Gerekli alanların kontrolü

### Hesaplama Otomasyonu
- **Quantity değişimi**: Otomatik amount hesaplama
- **Price değişimi**: Otomatik total yenileme
- **Discount girişi**: Anında net tutar hesaplama
- **VAT rate değişimi**: KDV yeniden hesaplama

### Ürün Bilgileri
- **Otomatik doldurma**: Ürün seçiminde bilgiler gelir
- **Depo miktarı**: Anlık stok kontrolü
- **Fiyat listesi**: Müşteriye özel fiyat getirir
- **Maliyet bilgisi**: Marj hesaplama için

---

## Validasyon ve Kontroller

### Zorunlu Alanlar
- **Tedarikçi**: Mutlaka seçilmeli
- **Belge tarihi**: Boş olamaz
- **En az bir ürün**: Belge'de ürün olmalı

### İş Kuralları
- **Negatif miktar**: Kontrol edilir
- **Sıfır fiyat**: Uyarı verilir
- **Yüksek indirim**: Tutar kontrolü
- **Geçersiz tarih**: Tarih validasyonu

### Hata Yönetimi
- **SQL hataları**: Try-catch ile yakalanır
- **Validation hataları**: Kullanıcıya gösterilir
- **Network hataları**: Retry mekanizması
- **Data integrity**: Tutarlılık kontrolleri

---

## Performans Optimizasyonları

### Grid Performansı
- **Virtual scrolling**: Büyük veri setleri için
- **Lazy loading**: İhtiyaç halinde yükleme
- **Caching**: Sık kullanılan veriler cache'lenir
- **Debouncing**: Hızlı değişikliklerde bekleme

### Veritabanı Optimizasyonu
- **Batch operations**: Toplu kayıt işlemleri
- **Stored procedures**: Karmaşık işlemler için
- **Index usage**: Optimal sorgu performansı
- **Connection pooling**: Bağlantı yönetimi

---

## Güvenlik ve Yetkilendirme

### Kullanıcı Yetkileri
- **Görüntüleme**: Belgeleri görebilme
- **Düzenleme**: Değişiklik yapabilme
- **Silme**: Belge silebilme
- **Onaylama**: Belge onayı verebilme

### Veri Güvenliği
- **SQL Injection**: Parameterized queries
- **XSS koruması**: Input sanitization
- **Authorization**: API seviyesinde kontrol
- **Audit trail**: İşlem logları

---

## Entegrasyonlar

### Diğer Modüllerle
- **Stok modülü**: Ürün bilgileri ve stok takibi
- **Cari modül**: Tedarikçi bilgileri
- **Fiyat modülü**: Fiyat listesi entegrasyonu
- **Muhasebe**: Mali kayıtlar

### Dış Sistemler
- **E-fatura**: Elektronik belge gönderimi
- **ERP entegrasyonu**: Ana sistem senkronizasyonu
- **Barkod okuyucu**: Donanım entegrasyonu
- **Yazıcı**: Rapor çıktıları

---

## Kodda Dikkat Edilmesi Gerekenler

### Best Practices
- **tabIndex kullanımı**: Her ekran için benzersiz ID
- **Validation groups**: Form ve grid ayrı gruplar
- **Memory management**: Unutulan subscription'lar temizlenir
- **Error boundaries**: Hata yakalama mekanizmaları

### Code Organization
- **Component separation**: Her popup ayrı bileşen
- **State management**: Centralized state kontrolü
- **Event handling**: Proper event binding/unbinding
- **Async operations**: Promise/async-await kullanımı

---

## Geliştiriciye Tavsiyeler

### Yeni Özellik Ekleme
- **DocBase pattern'i takip et**: Temel işlevselliği genişlet
- **Grid column eklerken**: cellRender ve editor tanımla
- **Popup eklerken**: onShowed ve onClick eventleri tanımla
- **Hesaplama eklerken**: calculateTotal'a entegre et

### Debug ve Test
- **Console logging**: Development'ta detaylı log
- **Data validation**: Her input'u validate et
- **Error scenarios**: Edge case'leri test et
- **Performance monitoring**: Yavaş işlemleri tespit et

### Maintenance
- **Code documentation**: Her fonksiyonu dokümante et
- **Regular refactoring**: Kod kalitesini koru
- **Dependency updates**: Kütüphaneleri güncelle
- **Security patches**: Güvenlik güncellemelerini takip et

---

## Sık Karşılaşılan Sorunlar ve Çözümleri

### Grid İşlemleri
**Problem**: Grid'de hesaplama hatası  
**Çözüm**: calculateTotal fonksiyonunu kontrol et, onRowUpdated event'ini düzelt

**Problem**: Satır silinmiyor  
**Çözüm**: Grid'in allowDeleting prop'unu true yap, onRowRemoved handler'ı kontrol et

### Popup İşlemleri
**Problem**: Popup açılmıyor  
**Çözüm**: Container prop'unu kontrol et (#root), deferRendering ayarını kontrol et

**Problem**: Popup'tan veri gelmiyor  
**Çözüm**: onClick handler'ında data[0] kontrolü yap, setData işlemini kontrol et

### Hesaplama Sorunları
**Problem**: Toplam yanlış hesaplanıyor  
**Çözüm**: Number.round() kullanımını kontrol et, floating point hassasiyetini ayarla

**Problem**: KDV hesabı hatalı  
**Çözüm**: VAT_ZERO flag'ini kontrol et, VAT_RATE'in doğru olduğunu teyit et

--- 