# itemCard.js Kullanım ve Teknik Dokümantasyon

## Amaç
`itemCard.js` ekranı, stok kartı (ürün kartı) yönetimi için kullanılır. Kullanıcılar bu ekranda yeni ürün ekleyebilir, mevcut ürünleri düzenleyebilir, fiyat, birim, barkod, müşteri kodu, promosyon, ekstra maliyet gibi tüm detayları görebilir ve yönetebilir.

---

## Ana Bileşenler ve Akış

### Ana Nesneler
- **itemsObj**: Ürün ana verilerini ve ilişkili alt tabloları (fiyat, birim, barkod, müşteri kodu, resim, vb.) tutar.
- **itemsPriceLogObj**: Ürünün fiyat geçmişi.
- **salesPriceLogObj**: Satış fiyatı geçmişi.
- **salesContractObj**: Satış sözleşmeleri.
- **otherShopObj**: Diğer mağazalardaki fiyatlar.
- **extraCostData**: Ekstra maliyetler (ör. şeker vergisi, fatura maliyeti).

---

## Ekran Bileşenleri

### Toolbar
- **Düzenle (btnEdit)**: Kartı düzenleme moduna alır/çıkarır.
- **Geri (btnBack)**: Önceki ürüne döner.
- **Yeni (btnNew)**: Yeni ürün kartı başlatır.
- **Kaydet (btnSave)**: Ürün kartını kaydeder.
- **Sil (btnDelete)**: Ürün kartını siler.
- **Kopyala (btnCopy)**: Ürün kartını kopyalar.
- **Analiz (btnAnalysis)**: Satış ve fatura analizlerini gösterir.
- **Kapat (btnClose)**: Sayfayı kapatır.

### Ana Form Alanları
- **Ürün Kodu (txtRef)**
- **Ürün Grubu (cmbItemGrp)**
- **Müşteri (txtCustomer)**
- **Ürün Türü (cmbItemGenus)**
- **Barkod (txtBarcode)**
- **Vergi (cmbTax)**
- **Ana Birim ve Katsayısı (cmbMainUnit, txtMainUnit)**
- **Menşei (cmbOrigin)**
- **Alt Birim ve Katsayısı (cmbUnderUnit, txtUnderUnit)**
- **Şeker Vergisi (txtTaxSugar, chkTaxSugarControl)**
- **Kısa Ad (txtShortName)**
- **Ekstra Alanlar**: Favori, katalog, parti/lot, vb. checkbox’lar.

### Tab Panelleri
- **Fiyatlar (tabTitlePrice)**
- **Birimler (tabTitleUnit)**
- **Barkodlar (tabTitleBarcode)**
- **Müşteri Kodları (tabTitleCustomer)**
- **Ekstra Maliyetler (tabExtraCost)**
- **Detaylar (tabTitleDetail)**
- **Diğer Mağaza Fiyatları (tabTitleOtherShop)**
- **Satış Fiyatı Geçmişi (tabTitleSalesPriceHistory)**
- **Satış Sözleşmeleri (tabTitleSalesContract)**
- **Ürün Bilgileri (tabTitleInfo)**

### Popuplar
- **Fiyat Ekleme (popPrice)**
- **Birim Ekleme (popUnit)**
- **Müşteri Ekleme (popCustomer)**
- **Açıklama (popDescription)**
- **Analiz (popAnalysis)**

---

## Teknik Özellikler

- **React PureComponent** olarak yazılmıştır.
- **State Yönetimi**: Ana state, ürünün detayları ve yardımcı flag’ler (ör. isPromotion, isItemGrpForOrginsValid) ile yönetilir.
- **Event Binding**: Tüm önemli event’ler (onItemRendered, taxSugarCalculate, cellRoleRender, saveState, loadState) constructor’da bind edilir.
- **Asenkron Veri Yükleme**: SQL sorguları ile ürün, fiyat, müşteri, sözleşme, analiz verileri çekilir.
- **Parametre ve Yetkilendirme**: Her alan için parametre ve access kontrolü yapılır.
- **Validator Kullanımı**: Gerekli alanlarda DevExtreme Validator ile zorunluluk ve aralık kontrolleri yapılır.
- **Dinamik Grid ve Formlar**: Fiyat, birim, barkod, müşteri kodu gibi alanlar dinamik grid ve formlar ile yönetilir.
- **Ekstra Maliyet Hesaplama**: Şeker vergisi ve fatura maliyeti gibi ek maliyetler otomatik hesaplanır ve gösterilir.
- **Popup ve Dialog Yönetimi**: Tüm ekleme/düzenleme işlemleri popup ve dialog ile yapılır.

---

## Kullanım Senaryosu (Detaylı)

### 1. Yeni Ürün Ekleme
1. **Yeni Butonuna Tıkla:**  
   Ekranın üst kısmındaki "Yeni" (`btnNew`) butonuna tıkla. Sistem, boş bir ürün kartı açar.
2. **Zorunlu Alanları Doldur:**  
   Ürün Kodu, Ürün Grubu, Ana Birim, Kısa Ad, Vergi, Menşei gibi alanları doldur.
3. **Ek Bilgileri Gir:**  
   Barkod, müşteri kodu, ekstra maliyet, açıklama, promosyon, vb. ekleyebilirsin.
4. **Kaydet Butonuna Tıkla:**  
   "Kaydet" (`btnSave`) butonuna tıkla. Eksik/zorunlu alan varsa validator uyarısı çıkar. Her şey uygunsa ürün kaydedilir.

### 2. Mevcut Ürünü Düzenleme
1. **Ürün Seçimi:**  
   Ürün kodu alanına (`txtRef`) mevcut bir ürün kodu gir veya popup ile ürün seç.
2. **Bilgileri Güncelle:**  
   İstediğin alanlarda değişiklik yapabilirsin. Fiyat, birim, barkod gibi detaylar ilgili tab’larda düzenlenebilir.
3. **Kaydet:**  
   "Kaydet" butonuna tıkla. Değişiklikler kaydedilir.

### 3. Fiyat/Birim/Barkod/Müşteri Kodu Ekleme veya Düzenleme
1. **İlgili Tab’a Geç:**  
   Fiyat için "Fiyatlar", birim için "Birimler", barkod için "Barkodlar", müşteri kodu için "Müşteri Kodları" tab’ına tıkla.
2. **Ekle veya Düzenle:**  
   "Ekle" butonuna tıkla veya grid’deki satırı düzenle. Açılan popup veya grid satırında gerekli bilgileri gir.
3. **Kaydet:**  
   Popup’ta "Kaydet" butonuna tıkla veya grid’de Enter ile kaydet.

### 4. Ekstra Maliyet ve Analiz
- **Ekstra Maliyet:**  
  Şeker vergisi, fatura maliyeti gibi ek maliyetler otomatik hesaplanır ve "Ekstra Maliyetler" tab’ında gösterilir.
- **Analiz:**  
  "Analiz" (`btnAnalysis`) butonuna tıkla. Açılan popup’ta tarih aralığı ve analiz tipi seç. Satış ve fatura adetleri grafik olarak görüntülenir.

### 5. Ürün Silme
1. **Sil Butonuna Tıkla:**  
   "Sil" (`btnDelete`) butonuna tıkla.
2. **Onayla:**  
   Açılan onay penceresinde "Evet" seçilirse ürün silinir.

### 6. Ürün Kopyalama
1. **Kopyala Butonuna Tıkla:**  
   "Kopyala" (`btnCopy`) butonuna tıkla.
2. **Yeni Ürün Kodu Gir:**  
   Sistem, mevcut ürünün tüm bilgilerini yeni bir karta kopyalar ve yeni bir ürün kodu girmeni ister.

### 7. Popup ve Yardımcı Ekranlar
- **Fiyat Ekleme:** Fiyat tab’ında "Ekle" ile yeni fiyat popup’ı açılır.
- **Birim Ekleme:** Birim tab’ında "Ekle" ile yeni birim popup’ı açılır.
- **Müşteri Ekleme:** Müşteri kodu tab’ında "Ekle" ile yeni müşteri popup’ı açılır.
- **Açıklama:** Açıklama tab’ında çoklu dil desteğiyle açıklama eklenebilir.

### 8. Kapatma ve Geri Dönme
- "Kapat" butonuna tıklayarak sayfadan çıkabilirsin.
- "Geri" butonuyla bir önceki ürüne dönebilirsin.

---

## Dikkat Edilmesi Gerekenler

- **Her alanın id’si benzersiz olmalı** ve parametre/access kontrolü yapılmalı.
- **Asenkron işlemler** ve event’lerde component unmount kontrolü yapılmalı (`this.isUnmounted`).
- **Validator’lar** sadece bir yerde tanımlanmalı, hem param’dan hem JSX’te eklenmemeli.
- **Grid ve Formlar**da state ve data güncellemeleri dikkatli yönetilmeli.

---

## Sürüm ve Bağımlılıklar

- **React** (PureComponent)
- **DevExtreme** (Grid, Form, Validator, Popup, vb.)
- **moment.js** (Tarih işlemleri)
- **Kendi yazılmış core ve datatable sınıfları**

---

> **Not:** Kodun tamamı modüler ve parametre-yetki tabanlıdır. Geliştirici, yeni alan eklerken param ve access yapılarını da güncellemelidir. 