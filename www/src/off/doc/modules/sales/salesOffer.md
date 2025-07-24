# Satış Teklifi (Sales Offer) Modülü

## Genel Bakış

`salesOffer.js`, ERP sisteminin satış teklifi yönetimi için geliştirilmiş React tabanlı bir bileşendir. Bu modül, müşterilere ürün ve hizmet teklifleri hazırlamak, yönetmek ve bunları irsaliye veya faturaya dönüştürmek için kullanılır.

## Teknik Özellikler

### Sınıf Hiyerarşisi
```javascript
class salesOffer extends DocBase
```

### Temel Özellikler
- **Type**: 1 (Satış)
- **Doc Type**: 61 (Satış Teklifi)
- **Base Class**: DocBase
- **State Management**: React hooks ile entegre

### Constructor Parametreleri
```javascript
constructor(props) {
    super(props)
    this.type = 1;              // Satış tipi
    this.docType = 61;          // Döküman tipi
    this.rebate = 0;            // İndirim
    this.docLocked = false;     // Döküman kilit durumu
    this.combineControl = true; // Birleştirme kontrolü
    this.combineNew = false;    // Yeni birleştirme
}
```

## Ana Fonksiyonlar

### 1. Başlatma İşlemleri

#### `componentDidMount()`
Bileşen yüklendiğinde çalışır ve gerekli başlatma işlemlerini yapar.
```javascript
async componentDidMount() {
    await this.core.util.waitUntil(0)
    await this.init()
    if(typeof this.pagePrm != 'undefined') {
        setTimeout(() => {
            this.getDoc(this.pagePrm.GUID,'',-1)
        }, 1000);
    }
}
```

#### `init()`
Modülün temel yapılandırmasını yapar.
- Grid referansını ayarlar
- Filtreleri temizler
- Popup kaynaklarını yapılandırır
- İndirim objelerini yükler

### 2. Döküman Yönetimi

#### `getDoc(pGuid, pRef, pRefno)`
Mevcut bir satış teklifini yükler.

**Parametreler:**
- `pGuid`: Döküman GUID'i
- `pRef`: Referans kodu
- `pRefno`: Referans numarası

**Kullanım:**
```javascript
await this.getDoc('550e8400-e29b-41d4-a716-446655440000', 'TKF', 1);
```

#### Kaydetme İşlemi
Toolbar'daki "Kaydet" butonu ile tetiklenir:
```javascript
onClick={async (e) => {
    if(this.docLocked == true) {
        this.toast.show({message:this.t("msgDocLocked.msg"),type:'warning'});
        return
    }
    if(e.validationGroup.validate().status == "valid") {
        // Kaydetme işlemi
        if((await this.docObj.save()) == 0) {
            this.toast.show({message:this.t("msgSaveResult.msgSuccess"),type:'success'});
        }
    }
}}
```

### 3. Ürün Yönetimi

#### `addItem(pData, pIndex, pQuantity, pPrice)`
Teklif dökümanına yeni ürün ekler.

**Parametreler:**
- `pData`: Ürün bilgileri objesi
- `pIndex`: Satır indeksi (null ise yeni satır)
- `pQuantity`: Miktar (varsayılan: 1)
- `pPrice`: Özel fiyat (undefined ise sistem fiyatı)

**Örnek Kullanım:**
```javascript
// Basit ürün ekleme
await this.addItem({
    GUID: '550e8400-e29b-41d4-a716-446655440000',
    CODE: 'URN001',
    NAME: 'Ürün Adı',
    VAT: 20,
    COST_PRICE: 10.00,
    UNIT: 'AD'
});

// Özel fiyat ve miktar ile ekleme
await this.addItem(productData, null, 5, 25.50);
```

#### `multiItemAdd()` ve `multiItemSave()`
Çoklu ürün ekleme işlemleri için kullanılır.

**Özellikler:**
- Tag-based ürün seçimi
- Müşteri koduna göre filtreleme
- Toplu ekleme öncesi önizleme

### 4. Hesaplama İşlemleri

#### `calculateTotal()`
Dökümanın toplam tutarlarını hesaplar:
- Ara toplam
- İndirimler
- KDV
- Genel toplam

```javascript
async calculateTotal() {
    super.calculateTotal()
    this.calculateTotalMargin()
}
```

#### `calculateMargin()` ve `calculateTotalMargin()`
Kar marjı hesaplamaları yapar.

### 5. Grid Yönetimi

#### `_cellRoleRender(e)`
Grid hücrelerinin özel render işlemlerini yönetir.

**Desteklenen Alanlar:**
- `ITEM_CODE`: Ürün kodu girişi
- `QUANTITY`: Miktar girişi
- `DISCOUNT`: İndirim girişi
- `DISCOUNT_RATE`: İndirim oranı girişi

**Örnek:**
```javascript
if(e.column.dataField == "ITEM_CODE") {
    return (
        <NdTextBox 
            id={"txtGrdItemsCode"+e.rowIndex} 
            parent={this} 
            simple={true}
            value={e.value}
            onKeyDown={async(k) => {
                if(k.event.key == 'F10' || k.event.key == 'ArrowRight') {
                    // Ürün arama popup'ını aç
                }
            }}
        />
    )
}
```

## Ekran Bileşenleri

### 1. Ana Form
- **Referans/Referans No**: Döküman referans bilgileri
- **Depo**: Çıkış deposu seçimi
- **Fiyat Listesi**: Kullanılacak fiyat listesi
- **Müşteri Kodu/Adı**: Müşteri seçimi
- **Barkod**: Hızlı ürün ekleme
- **Döküman Tarihi**: Teklif tarihi

### 2. Ürün Grid'i
Grid kolonları:
- Line No
- Create Date / User
- Item Code
- Item Name
- Barcode
- Quantity
- Sub Factor/Quantity
- Price
- Amount
- Discount/Discount Rate
- Margin
- VAT/VAT Rate
- Total HT/Total
- Description

### 3. Özet Alanları
- **Amount**: Ara toplam
- **Discount**: Toplam indirim
- **Sub Total**: İndirim sonrası toplam
- **Doc Discount**: Döküman indirimi
- **Total HT**: KDV hariç toplam
- **VAT**: KDV tutarı
- **Total**: Genel toplam

## Popup'lar ve Diyaloglar

### 1. Ürün Seçimi (`pg_txtItemsCode`)
```javascript
this.pg_txtItemsCode.setSource({
    source: {
        select: {
            query: "SELECT GUID,CODE,NAME,VAT,COST_PRICE,UNIT, " + 
                   "(SELECT [dbo].[FN_PRICE](...)) AS PRICE " + 
                   "FROM ITEMS_VW_01 WHERE STATUS = 1 AND (...)",
            param: ['VAL:string|50']
        },
        sql: this.core.sql
    }
})
```

### 2. Barkod Arama (`pg_txtBarcode`)
Barkod ve multicode arama için özelleştirilmiş popup.

### 3. Müşteri Seçimi (`pg_txtCustomerCode`)
Müşteri arama ve seçim popup'ı.

### 4. İndirim Girişi (`msgDiscountEntry`)
Çoklu indirim seviyeleri için:
```javascript
this.msgDiscountEntry.onShowed = async () => {
    this.txtDiscount1.value = e.data.DISCOUNT_1
    this.txtDiscount2.value = e.data.DISCOUNT_2
    this.txtDiscount3.value = e.data.DISCOUNT_3
}
```

### 5. Birim Girişi (`msgUnit`)
Birim dönüşümleri ve miktar hesaplamaları.

### 6. Dizayn Seçimi (`popDesign`)
Yazdırma dizayn seçimi ve önizleme.

### 7. Mail Gönderimi (`popMailSend`)
E-posta gönderim ayarları ve HTML editörü.

## Dönüştürme İşlemleri

### Transform Seçimi
```javascript
<NdButton id="btnTransform" 
onClick={async() => {
    if(this.docObj.isSaved == false) {
        this.toast.show({message:this.t("isMsgSave.msg")});
        return
    }
    await this.popTransformSelect.show()
}}/>
```

### İrsaliyeye Dönüştürme
```javascript
App.instance.menuClick({
    id: 'irs_02_002',
    text: 'Satış İrsaliyesi',
    path: 'dispatch/documents/salesDispatch.js',
    pagePrm: {offerGuid: this.docObj.dt()[0].GUID, type: 40}
})
```

### Faturaya Dönüştürme
```javascript
App.instance.menuClick({
    id: 'ftr_02_002',
    text: 'Satış Faturası',
    path: 'invoices/documents/salesInvoice.js',
    pagePrm: {offerGuid: this.docObj.dt()[0].GUID, type: 20}
})
```

## Yazdırma ve Mail

### Yazdırma İşlemi
```javascript
let tmpQuery = {
    query: "SELECT *,ISNULL((SELECT TOP 1 PATH FROM LABEL_DESIGN WHERE TAG = @DESIGN),'') AS PATH FROM [dbo].[FN_DOC_OFFERS_FOR_PRINT](@DOC_GUID) ORDER BY LINE_NO",
    param: ['DOC_GUID:string|50','DESIGN:string|25','LANG:string|10'],
    value: [this.docObj.dt()[0].GUID, this.cmbDesignList.value, this.cmbDesignLang.value]
}
```

### Mail Gönderimi
```javascript
let tmpMailData = {
    html: tmpHtml,
    subject: this.txtMailSubject.value,
    sendMail: this.txtSendMail.value,
    attachName: "offer " + this.docObj.dt()[0].REF + "-" + this.docObj.dt()[0].REF_NO + ".pdf",
    attachData: tmpAttach,
    mailGuid: this.cmbMailAddress.value
}
```

## Validasyonlar ve Kontroller

### Döküman Validasyonları
1. **Müşteri Seçimi**: Zorunlu alan kontrolü
2. **Depo Seçimi**: Stok çıkış deposu kontrolü
3. **Referans/Referans No**: Benzersizlik kontrolü
4. **Döküman Tarihi**: Format ve mantık kontrolü

### Satır Validasyonları
1. **Ürün Kodu**: Geçerli ürün kontrolü
2. **Miktar**: Pozitif sayı kontrolü
3. **Fiyat**: Maliyet fiyat kontrolü
4. **İndirim**: Maksimum tutar kontrolü

### İş Kuralları
```javascript
// Maliyet fiyatının altında satış kontrolü
if(e.key.COST_PRICE > e.newData.PRICE) {
    let tmpData = this.sysParam.filter({ID:'underMinCostPrice',USERS:this.user.CODE}).getValue()
    if(tmpData == true) {
        // Uyarı göster
    } else {
        // İşlemi iptal et
        e.cancel = true
    }
}
```

## Kullanım Senaryoları

### 1. Yeni Teklif Oluşturma
```javascript
// 1. Modülü başlat
await this.init();

// 2. Müşteriyi seç
this.docObj.dt()[0].INPUT = customerGuid;
this.docObj.dt()[0].INPUT_CODE = customerCode;

// 3. Depo seç
this.cmbDepot.value = depotGuid;

// 4. Ürünleri ekle
await this.addItem(productData1);
await this.addItem(productData2);

// 5. Kaydet
await this.docObj.save();
```

### 2. Mevcut Teklifi Düzenleme
```javascript
// 1. Teklifi yükle
await this.getDoc(offerGuid);

// 2. Değişiklikleri yap
this.grid.devGrid.cellValue(0, "QUANTITY", newQuantity);

// 3. Toplamları yenile
this.calculateTotal();

// 4. Kaydet
await this.docObj.save();
```

### 3. Çoklu Ürün Ekleme
```javascript
// 1. Multi-item popup'ını aç
await this.popMultiItem.show();

// 2. Ürün kodlarını gir
this.tagItemCode.value = ['URN001', 'URN002', 'URN003'];

// 3. Ürünleri ara ve ekle
await this.multiItemAdd();
await this.multiItemSave();
```

## Hata Yönetimi

### Yaygın Hatalar

#### 1. msgDocValid
```javascript
// Sebep: Zorunlu alanlar eksik
// Çözüm:
if(this.cmbDepot.value == '' || this.txtCustomerCode.value == '') {
    this.toast.show({message:this.t("msgDocValid.msg"),type:'warning'});
    return
}
```

#### 2. msgUnderPrice1/2
```javascript
// Sebep: Maliyet fiyatının altında satış
// Kontrol:
if(e.key.COST_PRICE > e.newData.PRICE) {
    // Sistem parametresine göre uyarı veya engelleme
}
```

#### 3. msgRowNotUpdate/Delete
```javascript
// Sebep: İrsaliye/Fatura bağlantılı satır
// Kontrol:
if(e.key.ORDER_LINE_GUID != '00000000-0000-0000-0000-000000000000' || 
   e.key.SHIPMENT_LINE_GUID != '00000000-0000-0000-0000-000000000000') {
    e.cancel = true
}
```

#### 4. msgDiscount
```javascript
// Sebep: İndirim tutarı satır toplamından fazla
if(e.key.DISCOUNT > (e.key.PRICE * e.key.QUANTITY)) {
    e.key.DISCOUNT = 0;
    return;
}
```

### Debug İpuçları

1. **Console Logları**:
```javascript
console.log('DocObj State:', this.docObj.dt()[0]);
console.log('Grid Data:', this.grid.devGrid.getDataSource().items());
```

2. **State Takibi**:
```javascript
// Döküman durumu
console.log('Is Saved:', this.docObj.isSaved);
console.log('Is Locked:', this.docLocked);
```

3. **Validation Durumu**:
```javascript
let validationResult = e.validationGroup.validate();
console.log('Validation Status:', validationResult.status);
```

## Performans Optimizasyonu

### 1. Grid Optimizasyonu
```javascript
// Virtual scrolling etkin
<Scrolling mode="virtual" />

// Lazy loading
<Paging defaultPageSize={10} />

// State storage
<StateStoring enabled={true} type="custom" 
customLoad={this.loadState} 
customSave={this.saveState} />
```

### 2. Hesaplama Optimizasyonu
```javascript
// Batch updates
this.grid.devGrid.beginUpdate()
// ... çoklu değişiklikler
this.grid.devGrid.endUpdate()
```

### 3. Memory Management
```javascript
// Component unmount'ta temizlik
componentWillUnmount() {
    // Event listener'ları temizle
    // Timer'ları iptal et
}
```

## Güvenlik Özellikleri

### 1. SQL Injection Koruması
Tüm veritabanı sorguları parametreli:
```javascript
let tmpQuery = {
    query: "SELECT * FROM ITEMS WHERE CODE = @CODE",
    param: ['CODE:string|50'],
    value: [userInput]
}
```

### 2. XSS Koruması
HTML içerik düzenleme için DevExtreme HtmlEditor kullanılır.

### 3. Erişim Kontrolü
```javascript
// Parametre bazlı erişim
param={this.param.filter({ELEMENT:'txtRef',USERS:this.user.CODE})}
access={this.access.filter({ELEMENT:'txtRef',USERS:this.user.CODE})}
```

## Geliştirilecek Özellikler

### 1. Öncelikli
- [ ] Offline çalışma desteği
- [ ] Mobil responsive tasarım
- [ ] Toplu operasyonlar
- [ ] Gelişmiş filtreleme

### 2. Gelecek Versiyonlar
- [ ] AI destekli fiyat önerileri
- [ ] Blockchain entegrasyonu
- [ ] IoT cihaz bağlantısı
- [ ] Sesli komut desteği

---

**Son Güncelleme**: 2024
**Versiyon**: 1.0.0
**Maintainer**: ERP Development Team 