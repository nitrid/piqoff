# Satın Alma Siparişi (Purchase Order) Modülü

## Genel Bakış

`purchaseOrder.js`, ERP sisteminin satın alma siparişi yönetimi için geliştirilmiş React tabanlı bir bileşendir. Bu modül, tedarikçilerden ürün ve hizmet siparişleri vermek, yönetmek ve bunları irsaliye veya faturaya dönüştürmek için kullanılır.

## Teknik Özellikler

### Sınıf Hiyerarşisi
```javascript
class purchaseOrder extends DocBase
```

### Temel Özellikler
- **Type**: 0 (Satın Alma)
- **Doc Type**: 60 (Satın Alma Siparişi)
- **Base Class**: DocBase

### Constructor
```javascript
constructor(props) {
    super(props)
    this.type = 0;              // Satın alma tipi
    this.docType = 60;          // Döküman tipi
    this.rebate = 0;            // İskonto
    this.combineControl = true; // Ürün birleştirme kontrolü
    this.combineNew = false;    // Yeni birleştirme modu
}
```

## Ana Fonksiyonlar

### 1. Belge İşlemleri

#### `getDoc(pGuid, pRef, pRefno)`
```javascript
async getDoc(pGuid, pRef, pRefno) {
    App.instance.setState({isExecute:true})
    await super.getDoc(pGuid, pRef, pRefno);
    App.instance.setState({isExecute:false})

    this.calculateMargin()
    this.calculateTotalMargin()
    
    this.txtRef.readOnly = true
    this.txtRefno.readOnly = true
    this.frmDocItems.option('disabled', this.docLocked)
}
```

### 2. Ürün Ekleme

#### `addItem(pData, pIndex, pQuantity, pPrice)`
```javascript
addItem(pData, pIndex, pQuantity, pPrice) {
    return new Promise(async resolve => {
        App.instance.setState({isExecute:true})
        
        if(typeof pQuantity == 'undefined') {
            pQuantity = 1
        }
        
        // Aynı ürün kontrolü
        let tmpMergDt = await this.mergeItem(pData.CODE)
        if(typeof tmpMergDt != 'undefined' && this.combineNew == false) {
            // Mevcut ürünü birleştir
            tmpMergDt[0].QUANTITY = tmpMergDt[0].QUANTITY + pQuantity
            // ... hesaplama işlemleri
            this.calculateTotal()
            App.instance.setState({isExecute:false})
            resolve()
            return
        }
        
        // Yeni satır oluştur
        // ... ürün bilgilerini set et
        // ... fiyat hesaplama
        
        App.instance.setState({isExecute:false})
        resolve()
    })
}
```

### 3. Teklif Entegrasyonu

#### `getOffers()`
```javascript
async getOffers() {
    let tmpQuery = {
        query: "SELECT *,REF + '-' + CONVERT(VARCHAR,REF_NO) AS REFERANS " +
               "FROM DOC_OFFERS_VW_01 " +
               "WHERE OUTPUT = @OUTPUT AND ORDER_LINE_GUID = '00000000-0000-0000-0000-000000000000' " +
               "AND TYPE = 0 AND DOC_TYPE IN (61)",
        param: ['OUTPUT:string|50'],
        value: [this.docObj.dt()[0].OUTPUT]
    }
    super.getOffers(tmpQuery)
}
```

## UI Bileşenleri

### Form Alanları
```javascript
// Tedarikçi Bilgileri
<NdTextBox id="txtCustomerCode" dt={{data:this.docObj.dt('DOC'),field:"OUTPUT_CODE"}} />
<NdTextBox id="txtCustomerName" dt={{data:this.docObj.dt('DOC'),field:"OUTPUT_NAME"}} />

// Depo ve Fiyat Listesi
<NdSelectBox id="cmbDepot" dt={{data:this.docObj.dt('DOC'),field:"INPUT"}} />
<NdSelectBox id="cmbPricingList" dt={{data:this.docObj.dt('DOC'),field:"PRICE_LIST_NO"}} />
```

### Grid Konfigürasyonu
```javascript
<NdGrid parent={this} id={"grdPurcOrder"+this.tabIndex} 
    showBorders={true} 
    columnsAutoWidth={true} 
    allowColumnReordering={true} 
    allowColumnResizing={true} 
    height={'500'} 
    width={'100%'}
    dbApply={false}
>
    <Column dataField="ITEM_CODE" caption="Ürün Kodu" editCellRender={this._cellRoleRender}/>
    <Column dataField="ITEM_NAME" caption="Ürün Adı" />
    <Column dataField="QUANTITY" caption="Miktar" editCellRender={this._cellRoleRender}/>
    <Column dataField="PRICE" caption="Fiyat" />
    <Column dataField="TOTAL" caption="Toplam" />
</NdGrid>
```

## Kullanım Senaryoları

### Senaryo 1: Yeni Satın Alma Siparişi
```javascript
// 1. Yeni belge başlat
await this.init();

// 2. Tedarikçi seç
this.txtCustomerCode.value = "SUPPLIER001";

// 3. Depo seç
this.cmbDepot.value = "MAIN-DEPOT";

// 4. Ürün ekle
await this.addItem(productData, null, 10, 15.00);

// 5. Kaydet
await this.docObj.save();
```

### Senaryo 2: Tekliften Sipariş
```javascript
// Mevcut tedarikçi için teklifleri getir
await this.getOffers();
// Teklif seçildiğinde otomatik satırlar eklenir
```

## Hesaplama Sistemleri

### Fiyat Hesaplama
```javascript
// Tedarikçi fiyat hesaplama
let tmpQuery = {
    query: "SELECT dbo.FN_PRICE(@GUID,@QUANTITY,dbo.GETDATE(),@SUPPLIER,@DEPOT,@PRICE_LIST_NO,0,0) AS PRICE",
    param: ['GUID:string|50','QUANTITY:float','SUPPLIER:string|50','DEPOT:string|50','PRICE_LIST_NO:int'],
    value: [pData.GUID, pQuantity, this.docObj.dt()[0].OUTPUT, this.cmbDepot.value, this.cmbPricingList.value]
}
```

### Marj Hesaplama
```javascript
let tmpMargin = tmpData.result.recordset[0].PRICE - this.docObj.docOrders.dt()[pIndex].COST_PRICE
let tmpMarginRate = ((tmpMargin / tmpData.result.recordset[0].PRICE)) * 100
this.docObj.docOrders.dt()[pIndex].MARGIN = tmpMargin.toFixed(2) + Number.money.sign + " / %" + tmpMarginRate.toFixed(2)
```

## Yazdırma ve E-posta

### Yazdırma Sistemi
```javascript
// Dizayn seçimi
data={{source:{select:{query: "SELECT TAG,DESIGN_NAME FROM [dbo].[LABEL_DESIGN] WHERE PAGE = '12'"}}}}

// Yazdırma sorgusu
let tmpQuery = {
    query: "SELECT * FROM [dbo].[FN_DOC_ORDERS_FOR_PRINT](@DOC_GUID) ORDER BY ITEM_NAME",
    param: ['DOC_GUID:string|50','DESIGN:string|25','LANG:string|10'],
    value: [this.docObj.dt()[0].GUID, this.cmbDesignList.value, this.cmbDesignLang.value]
}
```

### E-posta Gönderimi
```javascript
// Tedarikçi e-posta adresini al
let tmpQuery = {
    query: "SELECT EMAIL FROM CUSTOMER_OFFICAL WHERE CUSTOMER = @GUID AND DELETED = 0",
    param: ['GUID:string|50'],
    value: [this.docObj.dt()[0].OUTPUT]
}
```

## Sık Karşılaşılan Sorunlar

### Problem 1: Tedarikçi Seçilemiyor
**Çözüm**: Tedarikçi listesini kontrol edin
```javascript
if(this.txtCustomerCode.value == '') {
    this.toast.show({message: "Tedarikçi seçimi zorunludur", type:'warning'})
}
```

### Problem 2: Fiyat Hesaplanmıyor
**Çözüm**: Fiyat listesi ve tedarikçi ayarlarını kontrol edin
```javascript
if(this.cmbPricingList.value == '') {
    this.cmbPricingList.value = this.docObj.dt()[0].PRICE_LIST_NO
}
```

### Problem 3: Sipariş Kaydedilmiyor
**Çözüm**: Zorunlu alanları kontrol edin
```javascript
// Validation kontrolü
if(e.validationGroup.validate().status == "valid") {
    // Kaydetme işlemi
} else {
    this.toast.show({message: "Zorunlu alanlar doldurulmalıdır", type:'warning'})
}
```

## Performance İpuçları

### 1. Grid Optimizasyonu
```javascript
// Batch update
this.grdPurcOrder.devGrid.beginUpdate()
// İşlemler
this.grdPurcOrder.devGrid.endUpdate()
```

### 2. Asenkron İşlemler
```javascript
// Loading state
App.instance.setState({isExecute:true})
// Uzun işlem
App.instance.setState({isExecute:false})
```

Bu dokümantasyon, `purchaseOrder.js` modülünün temel özelliklerini ve kullanım senaryolarını kapsar. 