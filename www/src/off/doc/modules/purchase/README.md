# Purchase Module Dokümantasyonu

Bu klasör, satın alma (Purchase) modülü ile ilgili teknik ve kullanım dokümantasyonlarını içerir.

## 📋 Modül Genel Bakış

Purchase modülü, şirketin satın alma süreçlerini yönetmek için kullanılır. Tedarikçilerden alınan teklifler, siparişler, faturalar ve ilgili tüm belgeler bu modül aracılığıyla işlenir.

## 📁 Dokümantasyon Dosyaları

### 1. [DocBase.md](./DocBase.md)
**Temel Sınıf Dokümantasyonu**
- Tüm belge modüllerinin miras aldığı temel sınıf
- Ortak fonksiyonlar ve metodlar
- Popup yönetimi ve grid işlemleri
- Hesaplama fonksiyonları
- Event handling sistemleri

**Hedef Kitle**: Geliştiriciler, Sistem Mimarları

### 2. [purchaseOffer.md](./purchaseOffer.md)
**Satın Alma Teklifi Dokümantasyonu**
- Satın alma teklif belgelerinin oluşturulması
- Ürün ekleme ve düzenleme işlemleri
- Fiyat ve indirim hesaplamaları
- Belge dönüştürme işlemleri (sipariş, fatura)

**Hedef Kitle**: Son Kullanıcılar, Geliştiriciler

### 3. [priceDiffDemand.md](./priceDiffDemand.md)
**Fiyat Farkı Talebi Dokümantasyonu**
- Fatura ile anlaşılan fiyat arasındaki fark hesaplama
- Otomatik fiyat farkı talep dökümanı oluşturma
- Müşteri özel fiyat kontrolü ve validasyonları
- NF525 dijital imzalama sistemi entegrasyonu

**Hedef Kitle**: Son Kullanıcılar, Geliştiriciler, Muhasebe Personeli

## 🚀 Hızlı Başlangıç

### Yeni Geliştirici İçin
1. Önce [DocBase.md](./DocBase.md) dokümantasyonunu okuyun
2. Temel yapıları ve pattern'leri anlayın
3. [purchaseOffer.md](./purchaseOffer.md) ile spesifik modül özelliklerini öğrenin
4. Fiyat işlemleri için [priceDiffDemand.md](./priceDiffDemand.md) dokümantasyonunu inceleyin

### Son Kullanıcı İçin
1. [purchaseOffer.md](./purchaseOffer.md) dosyasının "Kullanım Senaryoları" bölümünü okuyun
2. Fiyat farkı işlemleri için [priceDiffDemand.md](./priceDiffDemand.md) kılavuzunu takip edin
3. Adım adım kılavuzları takip edin
4. "Sık Karşılaşılan Sorunlar" bölümlerini inceleyin

## 🔧 Teknik Gereksinimler

### Minimum Sistem Gereksinimleri
- React 16.8+
- DevExtreme 22.x
- Node.js 16.9.0+
- Modern web browser (Chrome, Firefox, Edge)

### Geliştirme Ortamı
- Visual Studio Code (önerilen)
- ES6+ JavaScript desteği
- JSX syntax highlighting
- Git version control

## 📊 Modül Yapısı

```
purchase/
├── documents/
│   ├── purchaseOffer.js      # Satın alma teklifi
│   ├── purchaseOrder.js      # Satın alma siparişi
│   ├── purchaseInvoice.js    # Satın alma faturası
│   ├── purchaseDispatch.js   # Satın alma irsaliyesi
│   └── priceDiffDemand.js    # Fiyat farkı talebi
├── tools/
│   └── DocBase.js           # Temel sınıf
└── components/
    ├── grids/              # Grid bileşenleri
    ├── popups/             # Popup bileşenleri
    └── dialogs/            # Dialog bileşenleri
```

## 🎯 Ana Özellikler

### Belge Yönetimi
- ✅ Teklif oluşturma ve düzenleme
- ✅ Sipariş dönüştürme
- ✅ Fatura entegrasyonu
- ✅ İrsaliye oluşturma
- ✅ Belge durumu takibi

### Ürün İşlemleri
- ✅ Ürün arama ve seçim
- ✅ Barkod ile ürün ekleme
- ✅ Toplu ürün işlemleri
- ✅ Birim dönüştürme
- ✅ Fiyat hesaplamaları

### Hesaplama Sistemleri
- ✅ Otomatik toplam hesaplama
- ✅ İndirim hesaplamaları
- ✅ KDV işlemleri
- ✅ Marj hesaplama
- ✅ Para birimi desteği
- ✅ Fiyat farkı hesaplama ve talep oluşturma

### Entegrasyonlar
- ✅ Stok modülü entegrasyonu
- ✅ Cari hesap entegrasyonu
- ✅ Muhasebe entegrasyonu
- ✅ Raporlama sistemi

## 🔍 Debugging ve Sorun Giderme

### Log Seviyeleri
- **Error**: Kritik hatalar
- **Warning**: Uyarı mesajları
- **Info**: Bilgilendirme
- **Debug**: Geliştirici bilgileri

### Yaygın Sorunlar
1. **Grid güncellenmiyor** → [DocBase.md](./DocBase.md#troubleshooting) kontrol edin
2. **Popup açılmıyor** → Container prop'larını kontrol edin
3. **Hesaplama hataları** → Number precision ayarlarını kontrol edin

## 📈 Performans Önerileri

### Grid Optimizasyonu
- Virtual scrolling kullanın
- Lazy loading uygulayın
- Batch operations tercih edin

### Memory Management
- Event listener'ları temizleyin
- Unused subscriptions'ları kaldırın
- Component lifecycle'ı doğru yönetin

## 🔒 Güvenlik

### Veri Güvenliği
- SQL Injection koruması
- XSS prevention
- Input validation
- Authorization kontrolleri

### En İyi Uygulamalar
- Parameterized queries kullanın
- User input'larını sanitize edin
- Error messages'ı kullanıcıya uygun şekilde gösterin

## 📞 Destek ve İletişim

### Teknik Destek
- İç geliştirme ekibi ile iletişime geçin
- GitHub issues kullanın
- Dokümantasyon güncellemeleri için PR oluşturun

### Katkıda Bulunma
1. Fork yapın
2. Feature branch oluşturun
3. Changes commit edin
4. Pull request gönderin

## 📚 Ek Kaynaklar

### Harici Dokümantasyonlar
- [DevExtreme Documentation](https://js.devexpress.com/Documentation/)
- [React Documentation](https://reactjs.org/docs/)
- [JavaScript ES6+ Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

### Video Tutorials
- Purchase Module Giriş (Coming Soon)
- DocBase Deep Dive (Coming Soon)
- Debugging Best Practices (Coming Soon)

## 📋 Changelog

### v2.1.0 (Current)
- ✅ DocBase.md dokümantasyonu eklendi
- ✅ purchaseOffer.md detaylı kılavuzu eklendi
- ✅ priceDiffDemand.md fiyat farkı talebi dokümantasyonu eklendi
- ✅ README.md genel bakış hazırlandı
- ✅ Troubleshooting bölümleri genişletildi

### v2.0.0
- ✅ React hooks migration tamamlandı
- ✅ Performance optimizasyonları
- ✅ Security güncellemeleri

### v1.5.0
- ✅ Multi-language support
- ✅ Advanced grid features
- ✅ Enhanced popup system

---

**Son Güncelleme**: {Bugünün Tarihi}  
**Güncelleme Yapan**: AI Assistant  
**Versiyon**: 2.1.0

---

💡 **Not**: Bu dokümantasyon sürekli güncellenmektedir. Yeni özellikler ve değişiklikler düzenli olarak eklenmektedir. 