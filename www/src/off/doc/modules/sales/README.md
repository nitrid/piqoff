# Sales Modülü Dokümantasyonu

## Genel Bakış

Sales (Satış) modülü, işletmelerin satış süreçlerini yönetmek için geliştirilmiş kapsamlı bir ERP modülüdür. Bu modül, satış tekliflerinden faturalara kadar tüm satış döngüsünü destekler.

## Modül Yapısı

```
sales/
├── documents/
│   ├── salesOffer.js      # Satış Teklifi Yönetimi
│   ├── salesDispatch.js   # Satış İrsaliyesi
│   └── salesInvoice.js    # Satış Faturası
├── reports/               # Satış Raporları
└── operations/           # Satış Operasyonları
```

## Hızlı Başlangıç

### Geliştiriciler İçin

1. **Gerekli İmportlar**:
```javascript
import DocBase from '../../../tools/DocBase.js';
import { docCls } from '../../../../core/cls/doc.js';
```

2. **Temel Kullanım**:
```javascript
// Yeni satış teklifi oluşturma
const offer = new salesOffer();
await offer.init();

// Müşteri atama
offer.docObj.dt()[0].INPUT = customerGuid;
offer.docObj.dt()[0].INPUT_CODE = customerCode;
```

### Son Kullanıcılar İçin

1. **Yeni Teklif Oluşturma**: Toolbar'dan "Yeni" butonuna tıklayın
2. **Müşteri Seçimi**: Müşteri kodu girin veya arama yapın
3. **Ürün Ekleme**: Barkod okutun veya ürün kodu girin
4. **Kaydetme**: Toolbar'dan "Kaydet" butonuna tıklayın

## Ana Özellikler

### 📋 Döküman Yönetimi
- Yeni teklif oluşturma
- Mevcut teklif düzenleme
- Teklif kopyalama
- Teklif silme ve kilitleme

### 👥 Müşteri Yönetimi
- Müşteri arama ve seçimi
- Müşteri bilgilerini otomatik doldurma
- Müşteri özel fiyat listesi desteği
- Müşteri indirim oranları

### 📦 Ürün Yönetimi
- Barkod ile ürün ekleme
- Ürün kodu ile arama
- Çoklu ürün ekleme
- Birim dönüşümleri

### 💰 Fiyat Hesaplamaları
- Dinamik fiyat hesaplama
- Çoklu indirim seviyeleri
- KDV hesaplamaları
- Kar marjı hesaplamaları

### 🔄 Dönüştürme İşlemleri
- Teklifi irsaliyeye dönüştürme
- Teklifi faturaya dönüştürme
- Otomatik veri aktarımı

## Teknik Özellikler

### Sistem Gereksinimleri
- React 18.0+
- DevExtreme 22.0+
- Node.js 14.0+
- SQL Server 2016+

### Veritabanı Tabloları
- `DOC` - Ana döküman tablosu
- `DOC_ITEMS` - Döküman kalemleri
- `CUSTOMER` - Müşteri bilgileri
- `ITEMS` - Ürün bilgileri
- `ITEM_PRICE` - Ürün fiyatları

### API Endpoints
- `GET /api/docs/offers` - Teklif listesi
- `POST /api/docs/offers` - Yeni teklif
- `PUT /api/docs/offers/:id` - Teklif güncelleme
- `DELETE /api/docs/offers/:id` - Teklif silme

## Entegrasyonlar

### İç Modüller
- **Stok Modülü**: Ürün bilgileri ve stok durumu
- **Müşteri Modülü**: Müşteri bilgileri ve fiyat listeleri
- **Fatura Modülü**: Teklif → Fatura dönüşümü
- **İrsaliye Modülü**: Teklif → İrsaliye dönüşümü

### Dış Sistemler
- **E-posta Sistemi**: Teklif gönderimi
- **Yazıcı Sistemi**: Teklif yazdırma
- **Barkod Okuyucu**: Ürün ekleme

## Güvenlik

### Erişim Kontrolleri
- Kullanıcı bazlı yetkilendirme
- Departman bazlı kısıtlamalar
- Döküman kilitleme sistemi

### Veri Güvenliği
- SQL Injection koruması
- XSS koruması
- CSRF token kullanımı

## Performans

### Optimizasyonlar
- Lazy loading
- Virtual scrolling
- Caching mekanizmaları
- Asenkron işlemler

### Limitler
- Maksimum 1000 kalem per teklif
- 50MB maksimum ek boyutu
- 100 eşzamanlı kullanıcı

## Sorun Giderme

### Yaygın Hatalar

1. **"msgDocValid" Hatası**
   - **Sebep**: Zorunlu alanlar eksik
   - **Çözüm**: Müşteri ve depo seçimi yapın

2. **"msgUnderPrice" Hatası**
   - **Sebep**: Maliyet fiyatının altında satış
   - **Çözüm**: Sistem parametrelerini kontrol edin

3. **"msgRowNotUpdate" Hatası**
   - **Sebep**: İrsaliye/Fatura bağlantılı satır
   - **Çözüm**: Bağlantıyı kesin veya yeni satır ekleyin

### Debug Araçları
- Browser Developer Tools
- React DevTools
- Redux DevTools

### Log Dosyaları
- `/logs/sales-error.log` - Hata logları
- `/logs/sales-audit.log` - İşlem logları
- `/logs/sales-performance.log` - Performans logları

## Dosya Yapısı

### Detaylı Dokümantasyon
- [Sales Offer (Satış Teklifi)](./salesOffer.md) - Satış teklifi detaylı kullanım
- [DocBase](../purchase/DocBase.md) - Temel döküman sınıfı (Purchase ile paylaşımlı)

### Kod Örnekleri
```javascript
// Ürün ekleme örneği
await this.addItem({
    GUID: itemGuid,
    CODE: itemCode,
    NAME: itemName,
    PRICE: itemPrice
}, null, quantity, customPrice);

// Toplam hesaplama
this.calculateTotal();

// Dönüştürme işlemi
App.instance.menuClick({
    id: 'irs_02_002',
    text: 'Satış İrsaliyesi',
    path: 'dispatch/documents/salesDispatch.js',
    pagePrm: {offerGuid: this.docObj.dt()[0].GUID, type: 40}
});
```

## Katkı Sağlama

### Geliştirme Ortamı
1. Repository'yi klonlayın
2. `npm install` çalıştırın
3. `.env.example`'ı `.env` olarak kopyalayın
4. `npm start` ile geliştirme sunucusunu başlatın

### Test Etme
```bash
npm test                    # Tüm testler
npm test sales             # Sadece sales testleri
npm test -- --coverage    # Coverage raporu
```

### Pull Request Süreci
1. Feature branch oluşturun
2. Testleri yazın
3. Code review sürecinden geçirin
4. Merge edin

## Lisans ve Destek

- **Lisans**: Proprietary
- **Destek**: support@company.com
- **Döküman Versiyonu**: 1.0.0
- **Son Güncelleme**: 2024

---

**Not**: Bu dokümantasyon sürekli güncellenmektedir. Son sürüm için GitHub repository'sini kontrol edin. 