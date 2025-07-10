# Fiyat Farkı Talebi (Price Difference Demand) Modülü

## Genel Bakış

`priceDiffDemand.js`, ERP sisteminin fiyat farkı talep yönetimi için geliştirilmiş React tabanlı bir bileşendir. Bu modül, faturalandırılan ürünler ile anlaşılan fiyatlar arasındaki farkları tespit ederek otomatik fiyat farkı talep dökümanları oluşturmak için kullanılır.

## Teknik Özellikler

### Sınıf Hiyerarşisi
```javascript
class priceDiffDemand extends DocBase
```

### Temel Özellikler
- **Type**: 1 (Satış)
- **Doc Type**: 63 (Fiyat Farkı Talebi)
- **Base Class**: DocBase
- **Data Table**: DOC_DEMAND

### Constructor Parametreleri
```javascript
constructor(props) {
    super(props)
    this.type = 1;                 // Satış tipi
    this.docType = 63;             // Döküman tipi (Fiyat Farkı Talebi)
    this.rebate = 0;               // İndirim
    this.docLocked = false;        // Döküman kilit durumu
    this.customerControl = true;   // Müşteri kontrolü
    this.customerClear = false;    // Müşteri temizleme
    this.combineControl = true;    // Birleştirme kontrolü
    this.combineNew = false;       // Yeni birleştirme
}
```

## Ana Fonksiyonlar

### 1. Başlatma İşlemleri

#### `componentDidMount()`
Bileşen yüklendiğinde çalışır ve gerekli başlatma işlemlerini yapar.
```javascript
async componentDidMount() {
    await this.core.util.waitUntil(100)
    await this.init()
    if(typeof this.pagePrm != 'undefined') {
        setTimeout(() => {
            this.getPriceDiff(this.pagePrm.GUID)
        }, 1000);
    }
}
```

#### `init()`
Modülün temel yapılandırmasını yapar:
- Grid referansını ayarlar
- Tarih alanlarını ayarlar
- Popup kaynaklarını yapılandırır

### 2. Fiyat Farkı İşlemleri

#### `getPriceDiff(pGuid)`
Ana fiyat farkı hesaplama ve döküman oluşturma fonksiyonu.

**Parametreler:**
- `pGuid`: Invoice döküman GUID'i

**İşlem Akışı:**
1. Mevcut fiyat farkı talebini kontrol eder
2. Eğer yoksa, fatura kalemlerini analiz eder
3. Fiyat farklarını hesaplar
4. Otomatik fiyat farkı talebi oluşturur

```javascript
async getPriceDiff(pGuid) {
    // Mevcut talep kontrolü
    let tmpQuery = {
        query: "SELECT DOC_GUID,REF,REF_NO FROM DOC_DEMAND_VW_01 WHERE INVOICE_DOC_GUID = @DOC_GUID",
        param: ['DOC_GUID:string|50'],
        value: [pGuid]
    };
    
    // Eğer mevcut talep varsa yükle
    if(tmpData.result.recordset.length > 0) {
        this.getDoc(tmpData.result.recordset.DOC_GUID, ...);
    }
    else {
        // Yeni fiyat farkı talebi oluştur
        this.createPriceDiffFromInvoice(pGuid);
    }
}
```

#### Fiyat Farkı Hesaplama Algoritması
```javascript
// Fiyat farkı kontrolü
if(parseFloat(tmpData.result.recordset[i].PRICE - tmpData.result.recordset[i].CUSTOMER_PRICE).toFixed(3) != 0.00) {
    // Fiyat farkı var, talep kalemi oluştur
    tmpDocDemand.PRICE = parseFloat(tmpData.result.recordset[i].PRICE - tmpData.result.recordset[i].CUSTOMER_PRICE).toFixed(3)
    tmpDocDemand.INVOICED_PRICE = tmpData.result.recordset[i].PRICE
    tmpDocDemand.PRICE_AGREED = tmpData.result.recordset[i].CUSTOMER_PRICE
}
```

### 3. Ürün Yönetimi

#### `addItem(pData, pIndex, pQuantity, pPrice, pDiscount, pDiscountPer, pVat)`
Fiyat farkı talebine yeni ürün ekler.

**Parametreler:**
- `pData`: Ürün bilgileri objesi
- `pIndex`: Satır indeksi (null ise yeni satır)
- `pQuantity`: Miktar (varsayılan: 1)
- `pPrice`: Fiyat
- `pDiscount`: İndirim tutarı
- `pDiscountPer`: İndirim oranı
- `pVat`: KDV oranı

**Özellikler:**
- Müşteri fiyat kontrolü
- Birleştirme kontrolü
- Otomatik fiyat hesaplama

```javascript
// Müşteri fiyat sorgusu
let tmpQuery = {
    query: "SELECT (SELECT dbo.FN_PRICE(ITEM_GUID,@QUANTITY,dbo.GETDATE(),CUSTOMER_GUID,'00000000-0000-0000-0000-000000000000',0,1,0)) AS PRICE FROM ITEM_MULTICODE_VW_01 WHERE ITEM_CODE = @ITEM_CODE AND CUSTOMER_GUID = @CUSTOMER_GUID",
    param: ['ITEM_CODE:string|50','CUSTOMER_GUID:string|50','QUANTITY:float'],
    value: [pData.CODE, this.docObj.dt()[0].INPUT, pQuantity]
}
```

### 4. Grid Yönetimi

#### `_cellRoleRender(e)`
Grid hücrelerinin özel render işlemlerini yönetir.

**Desteklenen Alanlar:**
- `ITEM_CODE`: Ürün kodu girişi
- `QUANTITY`: Miktar girişi
- `DISCOUNT`: İndirim girişi
- `DISCOUNT_RATE`: İndirim oranı girişi

### 5. Hesaplama İşlemleri

#### `calculateTotal()`
Dökümanın toplam tutarlarını hesaplar:
- Ara toplam
- İndirimler
- KDV
- Genel toplam

```javascript
calculateTotal() {
    super.calculateTotal()
}
```

## Ekran Bileşenleri

### 1. Ana Form
- **Referans/Referans No**: Döküman referans bilgileri
- **Depo**: Çıkış deposu seçimi
- **Döküman No**: Manuel döküman numarası
- **Müşteri Kodu/Adı**: Müşteri seçimi
- **Döküman Tarihi**: Talep tarihi
- **Sevk Tarihi**: Sevkiyat tarihi
- **Barkod**: Hızlı ürün ekleme

### 2. Fiyat Farkı Grid'i
Grid kolonları:
- Line No
- Create Date / User
- Item Code
- Multicode
- Item Name
- Price Agreed (Anlaşılan Fiyat)
- Invoiced Price (Faturalandırılan Fiyat)
- Quantity
- Price (Fark)
- Discount/Discount Rate
- Amount
- VAT/VAT Rate
- Total HT/Total
- Invoice No/Date
- Description

### 3. Özet Alanları
- **Amount**: Ara toplam
- **Discount**: Toplam indirim
- **Sub Total**: İndirim sonrası toplam
- **Doc Discount**: Döküman indirimi
- **Total HT**: KDV hariç toplam
- **VAT**: KDV tutarı
- **Total**: Genel toplam

## İş Kuralları ve Validasyonlar

### 1. Fiyat Farkı Kontrolü
```javascript
// Fiyat farkı olup olmadığını kontrol et
if(parseFloat(invoicedPrice - agreedPrice).toFixed(3) != 0.00) {
    // Fiyat farkı var, talep oluşturulabilir
    createDemandItem(itemData);
}
```

### 2. Müşteri Kontrolü
```javascript
if(this.customerControl == true) {
    // Müşteri multicode kontrolü
    let tmpCheckQuery = {
        query: "SELECT MULTICODE FROM ITEM_MULTICODE_VW_01 WHERE ITEM_CODE = @ITEM_CODE AND CUSTOMER_GUID = @CUSTOMER_GUID",
        param: ['ITEM_CODE:string|50','CUSTOMER_GUID:string|50'],
        value: [itemCode, customerGuid]
    }
    
    if(tmpCheckData.result.recordset.length == 0) {
        // Müşteri için tanımlı olmayan ürün
        handleUnauthorizedItem();
    }
}
```

### 3. Döküman Validasyonları
- **Müşteri Seçimi**: Zorunlu alan kontrolü
- **Depo Seçimi**: Geçerli depo kontrolü
- **Referans/Referans No**: Benzersizlik kontrolü
- **Döküman Tarihi**: Format ve mantık kontrolü

## Kullanım Senaryoları

### 1. Fatura Üzerinden Fiyat Farkı Talebi Oluşturma
```javascript
// 1. Fatura seç ve fiyat farkını analiz et
await this.getPriceDiff(invoiceGuid);

// 2. Otomatik oluşturulan kalemleri gözden geçir
// 3. Gerekirse manuel düzenleme yap
// 4. Kaydet
await this.docObj.save();
```

### 2. Manuel Fiyat Farkı Talebi Oluşturma
```javascript
// 1. Yeni döküman başlat
await this.init();

// 2. Müşteri seç
this.docObj.dt()[0].INPUT = customerGuid;

// 3. Ürünleri manuel ekle
await this.addItem(productData, null, quantity, priceDiff);

// 4. Kaydet
await this.docObj.save();
```

### 3. Mevcut Talebi Düzenleme
```javascript
// 1. Talebi yükle
await this.getDoc(demandGuid);

// 2. Değişiklikleri yap
this.grid.devGrid.cellValue(0, "QUANTITY", newQuantity);

// 3. Toplamları yenile
this.calculateTotal();

// 4. Kaydet
await this.docObj.save();
```

## Grid Row Update İşlemleri

```javascript
onRowUpdated={async(e) => {
    // Fiyat farkı hesaplama
    if(typeof e.data.PRICE_AGREED != 'undefined' || typeof e.data.INVOICED_PRICE != 'undefined') {
        e.key.PRICE = Number(e.key.INVOICED_PRICE - e.key.PRICE_AGREED).toFixed(3)
    }
    
    // İndirim hesaplamaları
    if(typeof e.data.DISCOUNT_RATE != 'undefined') {
        e.key.DISCOUNT = Number(e.key.PRICE * e.key.QUANTITY).rateInc(e.data.DISCOUNT_RATE, 4)
        e.key.DISCOUNT_1 = e.key.DISCOUNT
        e.key.DISCOUNT_2 = 0
        e.key.DISCOUNT_3 = 0
    }
    
    // Tutarlar hesaplama
    e.key.TOTALHT = Number((parseFloat((e.key.PRICE * e.key.QUANTITY).toFixed(3)) - (parseFloat(e.key.DISCOUNT)))).round(2)
    e.key.VAT = parseFloat(((((e.key.TOTALHT) - (parseFloat(e.key.DOC_DISCOUNT))) * (e.key.VAT_RATE) / 100))).round(6)
    e.key.AMOUNT = parseFloat((e.key.PRICE * e.key.QUANTITY).toFixed(3)).round(2)
    e.key.TOTAL = Number(((e.key.TOTALHT - e.key.DOC_DISCOUNT) + e.key.VAT)).round(2)
    
    this.calculateTotal()
}}
```

## Popup'lar ve Diyaloglar

### 1. Ürün Seçimi (`pg_txtItemsCode`)
```javascript
this.pg_txtItemsCode.setSource({
    source: {
        select: {
            query: "SELECT GUID,CODE,NAME,VAT,COST_PRICE,UNIT,STATUS,(SELECT [dbo].[FN_PRICE](...)) AS PRICE FROM ITEMS_VW_01 WHERE STATUS = 1 AND (...)",
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

### 4. İndirim Girişi
Çoklu indirim seviyeleri için popup'lar.

### 5. Birim Girişi (`msgUnit`)
Birim dönüşümleri ve miktar hesaplamaları.

### 6. Dizayn Seçimi (`popDesign`)
Yazdırma dizayn seçimi ve önizleme.

### 7. Mail Gönderimi (`popMailSend`)
E-posta gönderim ayarları ve HTML editörü.

## Yazdırma ve Mail İşlemleri

### Yazdırma
```javascript
let tmpQuery = {
    query: "SELECT *,ISNULL((SELECT TOP 1 PATH FROM LABEL_DESIGN WHERE TAG = @DESIGN),'') AS PATH FROM DOC_DEMAND_VW_01 WHERE DOC_GUID = @DOC_GUID ORDER BY LINE_NO",
    param: ['DOC_GUID:string|50','DESIGN:string|25'],
    value: [this.docObj.dt()[0].GUID, this.cmbDesignList.value, this.cmbDesignLang.value]
}
```

### NF525 İmzalama
```javascript
// Döküman kilitleme sırasında dijital imzalama
let tmpSignedData = await this.nf525.signatureDoc(this.docObj.dt()[0], this.docObj.docDemand.dt())
this.docObj.dt()[0].SIGNATURE = tmpSignedData.SIGNATURE
this.docObj.dt()[0].SIGNATURE_SUM = tmpSignedData.SIGNATURE_SUM
```

## Hata Yönetimi

### Yaygın Hatalar

#### 1. msgDocValid
```javascript
// Sebep: Zorunlu alanlar eksik
if(this.cmbDepot.value == '' || this.txtCustomerCode.value == '') {
    this.toast.show({message:this.t("msgDocValid.msg"), type:'warning'});
    return
}
```

#### 2. msgCustomerLock
```javascript
// Sebep: Müşteri değiştirmeye çalışma (kalemi varken)
if(this.docObj.docDemand.dt().length > 0) {
    this.toast.show({message:this.t("msgCustomerLock.msg"), type:'warning'});
    return;
}
```

#### 3. msgNotRow
```javascript
// Sebep: Kalem olmadan kaydetmeye çalışma
if(typeof this.docObj.docDemand.dt()[0] == 'undefined') {
    this.toast.show({message:this.t("msgNotRow.msg"), type:'warning'});
    return
}
```

#### 4. msgItemNotFound
```javascript
// Sebep: Geçersiz ürün kodu
this.toast.show({message:this.t("msgItemNotFound.msg"), type:'warning'});
```

### Debug İpuçları

1. **Fiyat Farkı Kontrolü**:
```javascript
console.log('Invoice Price:', invoicedPrice);
console.log('Agreed Price:', agreedPrice);
console.log('Price Difference:', invoicedPrice - agreedPrice);
```

2. **Döküman Durumu**:
```javascript
console.log('Doc Object:', this.docObj.dt()[0]);
console.log('Demand Items:', this.docObj.docDemand.dt());
```

3. **Grid Durumu**:
```javascript
console.log('Grid Data:', this.grid.devGrid.getDataSource().items());
```

## Performans Optimizasyonu

### 1. Grid Optimizasyonu
```javascript
// Virtual scrolling devre dışı (sorting none)
<Scrolling mode="standart" />
<Editing mode="cell" allowUpdating={true} allowDeleting={true} />

// State storage etkin
<StateStoring enabled={true} type="custom" customLoad={this.loadState} customSave={this.saveState} />
```

### 2. Hesaplama Optimizasyonu
```javascript
// Batch updates kullanımı
this.grid.devGrid.beginUpdate()
// ... çoklu değişiklikler
this.grid.devGrid.endUpdate()
```

### 3. Veri Yükleme Optimizasyonu
```javascript
// Gerekli alanları seçerek veri yükleme
SELECT GUID,CODE,NAME,PRICE_AGREED,INVOICED_PRICE,(INVOICED_PRICE - PRICE_AGREED) AS PRICE_DIFF
FROM INVOICE_ITEMS_VW WHERE INVOICE_GUID = @GUID AND (INVOICED_PRICE - PRICE_AGREED) != 0
```

## Güvenlik Özellikleri

### 1. SQL Injection Koruması
```javascript
let tmpQuery = {
    query: "SELECT * FROM DOC_DEMAND WHERE DOC_GUID = @DOC_GUID",
    param: ['DOC_GUID:string|50'],
    value: [userInput]
}
```

### 2. İş Kuralı Kontrolü
```javascript
// Müşteri yetki kontrolü
if(this.customerControl == true) {
    // Müşteri için ürün yetkisi kontrolü
}
```

### 3. Döküman Güvenliği
```javascript
// Döküman kilitleme kontrolü
if(this.docObj.dt()[0].LOCKED != 0) {
    this.docLocked = true
    this.toast.show({message:this.t("msgGetLocked.msg")});
    return
}
```

## Context Menu İşlemleri

### Sağ Tık Menüsü
```javascript
<ContextMenu dataSource={this.rightItems}
width={200}
target={"#grdDiffOff"+this.tabIndex}
onItemClick={(async(e) => {
    if(e.itemData.text == this.t("getContract")) {
        this._getContract()
    }
    else if(e.itemData.text == this.t("getProforma")) {
        this.getProforma()
    }
}).bind(this)} />
```

## Çoklu Ürün Ekleme

### `multiItemAdd()`
```javascript
async multiItemAdd() {
    let tmpMissCodes = []
    let tmpCounter = 0
    
    for (let i = 0; i < this.tagItemCode.value.length; i++) {
        if(this.cmbMultiItemType.value == 0) {
            // Multicode'a göre arama
            let tmpQuery = {
                query: "SELECT GUID,CODE,NAME,VAT,UNIT,1 AS QUANTITY,0 AS ITEM_TYPE,COST_PRICE, ISNULL((SELECT TOP 1 CODE FROM ITEM_MULTICODE WHERE ITEM_MULTICODE.ITEM = ITEMS_VW_01.GUID AND CUSTOMER = @CUSTOMER AND DELETED = 0),'') AS MULTICODE FROM ITEMS_VW_01 WHERE MULTICODE = @VALUE AND STATUS = 1",
                param: ['VALUE:string|50'],
                value: [this.tagItemCode.value[i]]
            }
        }
        else if (this.cmbMultiItemType.value == 1) {
            // Ürün koduna göre arama
            let tmpQuery = {
                query: "SELECT GUID,CODE,NAME,VAT,UNIT,1 AS QUANTITY,0 AS ITEM_TYPE FROM ITEMS_VW_01 WHERE CODE = @VALUE AND STATUS = 1",
                param: ['VALUE:string|50'],
                value: [this.tagItemCode.value[i]]
            }
        }
        
        // Sonuçları işle
        if(tmpData.result.recordset.length > 0) {
            this.multiItemData.push(tmpData.result.recordset[0])
            tmpCounter++
        } else {
            tmpMissCodes.push("'" + this.tagItemCode.value[i] + "'")
        }
    }
    
    // Sonuç mesajları göster
    if(tmpMissCodes.length > 0) {
        // Bulunamayan kodları göster
    }
    
    // Eklenen ürün sayısını göster
}
```

## Geliştirilecek Özellikler

### 1. Öncelikli
- [ ] Toplu fiyat farkı işleme
- [ ] Excel import/export
- [ ] Otomatik e-posta bildirimleri
- [ ] Fiyat farkı analiz raporları

### 2. Gelecek Versiyonlar
- [ ] AI destekli fiyat farkı tahminleri
- [ ] Blockchain tabanlı fiyat doğrulama
- [ ] Mobil onay sistemi
- [ ] Real-time fiyat güncellemeleri

## API Entegrasyonları

### Fiyat Servisi
```javascript
// Müşteri özel fiyat sorgulama
SELECT dbo.FN_PRICE(ITEM_GUID, QUANTITY, GETDATE(), CUSTOMER_GUID, DEPOT_GUID, PRICE_LIST_NO, DISCOUNT_RATE, VAT_RATE) AS PRICE
```

### Döküman Servisi
```javascript
// Fatura bilgilerini getirme
SELECT * FROM DOC_ITEMS_VW_01 WHERE DOC_GUID = @DOC_GUID
```

## State Management

### Sayfa Durumu Kaydetme
```javascript
saveState(e) {
    let tmpSave = this.access.filter({ELEMENT:'grdDiffOffState',USERS:this.user.CODE})
    tmpSave.setValue(e)
    tmpSave.save()
}

loadState() {
    let tmpLoad = this.access.filter({ELEMENT:'grdDiffOffState',USERS:this.user.CODE})
    return tmpLoad.getValue()
}
```

---

**Son Güncelleme**: 2024
**Versiyon**: 1.0.0
**Maintainer**: ERP Development Team 