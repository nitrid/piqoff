# Satış Siparişi (Sales Order) Modülü

## Genel Bakış

`salesOrder.js`, ERP sisteminin satış siparişi yönetimi için geliştirilmiş React tabanlı bir bileşendir. Bu modül, müşterilere ürün ve hizmet siparişleri almak, yönetmek ve bunları sevkiyat veya faturaya dönüştürmek için kullanılır.

## Teknik Özellikler

### Sınıf Hiyerarşisi
```javascript
class salesOrder extends DocBase
```

### Temel Özellikler
- **Type**: 1 (Satış)
- **Doc Type**: 60 (Satış Siparişi)
- **Base Class**: DocBase
- **State Management**: React hooks ile entegre

### Constructor Parametreleri
```javascript
constructor(props) {
    super(props)
    this.type = 1;              // Satış tipi
    this.docType = 60;          // Döküman tipi
    this.rebate = 0;            // İskonto
    this.combineControl = true; // Aynı ürün birleştirme kontrolü
    this.combineNew = false;    // Yeni birleştirme modu
}
```

## Ana Fonksiyonlar

### 1. Component Lifecycle

#### `componentDidMount()`
```javascript
async componentDidMount() {
    await this.core.util.waitUntil(0)
    await this.init()
    if(typeof this.pagePrm != 'undefined') {
        setTimeout(() => {
            this.getDoc(this.pagePrm.GUID,'', -1)
        }, 1000);
    }
}
```
- **Açıklama**: Component yüklendiğinde çalışır
- **İşlevler**:
  - Sistem initilaization
  - Parametreli sayfa açılışı kontrolü
  - Otomatik belge yükleme

#### `init()`
```javascript
async init() {
    await super.init()
    this.grid = this["grdSlsOrder"+this.tabIndex]
    this.grid.devGrid.clearFilter("row")
    
    // Form kontrollerini sıfırla
    this.txtRef.readOnly = false
    this.txtRefno.readOnly = false
    this.docLocked = false
    this.frmDocItems.option('disabled',true)
    
    // Müşteri indirimi yükle
    await this.discObj.loadDocDisc({
        START_DATE: moment(this.dtDocDate.value).format("YYYY-MM-DD"), 
        FINISH_DATE: moment(this.dtDocDate.value).format("YYYY-MM-DD"),
    })
}
```

### 2. Belge İşlemleri

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
- **Parametreler**:
  - `pGuid`: Belge GUID'i
  - `pRef`: Belge referansı
  - `pRefno`: Belge numarası
- **İşlevler**:
  - Belge verilerini yükler
  - Marj hesaplamalarını yapar
  - Form durumunu günceller

### 3. Ürün İşlemleri

#### `addItem(pData, pIndex, pQuantity, pPrice)`
```javascript
addItem(pData, pIndex, pQuantity, pPrice) {
    return new Promise(async resolve => {
        App.instance.setState({isExecute:true})
        
        // Varsayılan miktar
        if(typeof pQuantity == 'undefined') {
            pQuantity = 1
        }
        
        // Aynı ürün kontrolü
        let tmpMergDt = await this.mergeItem(pData.CODE)
        if(typeof tmpMergDt != 'undefined' && this.combineNew == false) {
            // Mevcut ürünü birleştir
            tmpMergDt[0].QUANTITY = tmpMergDt[0].QUANTITY + pQuantity
            tmpMergDt[0].SUB_QUANTITY = tmpMergDt[0].SUB_QUANTITY + pQuantity / tmpMergDt[0].SUB_FACTOR
            // ... hesaplama işlemleri
            this.calculateTotal()
            App.instance.setState({isExecute:false})
            resolve()
            return
        }
        
        // Yeni satır oluştur
        if(pIndex == null) {
            let tmpDocOrders = {...this.docObj.docOrders.empty}
            // Belge bilgilerini doldur
            tmpDocOrders.DOC_GUID = this.docObj.dt()[0].GUID
            tmpDocOrders.TYPE = this.docObj.dt()[0].TYPE
            // ... diğer alanlar
            this.docObj.docOrders.addEmpty(tmpDocOrders)
            pIndex = this.docObj.docOrders.dt().length - 1
        }
        
        // Ürün bilgilerini al
        let tmpGrpQuery = {
            query: "SELECT ORGINS,UNIT_SHORT,... FROM ITEMS_VW_01 WHERE GUID = @GUID",
            param: ['GUID:string|50','ID:string|20'],
            value: [pData.GUID, this.sysParam.filter({ID:'secondFactor',USERS:this.user.CODE}).getValue().value]
        }
        
        // Fiyat hesaplama
        if(typeof pPrice == 'undefined') {
            let tmpQuery = {
                query: "SELECT dbo.FN_PRICE(@GUID,@QUANTITY,...) AS PRICE",
                param: ['GUID:string|50','QUANTITY:float',...],
                value: [pData.GUID, pQuantity, ...]
            }
            let tmpData = await this.core.sql.execute(tmpQuery)
            // Fiyat ve hesaplamaları set et
        }
        
        App.instance.setState({isExecute:false})
        resolve()
    })
}
```

#### `_cellRoleRender(e)`
Grid hücrelerinin özel render işlemleri:

```javascript
_cellRoleRender(e) {
    if(e.column.dataField == "ITEM_CODE") {
        return (
            <NdTextBox id={"txtGrdItemsCode"+e.rowIndex} 
                parent={this} 
                simple={true}
                value={e.value}
                onKeyDown={async(k) => {
                    if(k.event.key == 'F10' || k.event.key == 'ArrowRight') {
                        // Ürün seçim popup'ını aç
                        this.pg_txtItemsCode.onClick = async(data) => {
                            for (let i = 0; i < data.length; i++) {
                                await this.addItem(data[i], e.rowIndex)
                            }
                        }
                        this.pg_txtItemsCode.setVal(e.value)
                    }
                }}
                onChange={async(r) => {
                    // Direkt ürün kodu ile arama
                    let tmpQuery = {
                        query: "SELECT ... FROM ITEMS_VW_01 WHERE CODE = @CODE ...",
                        param: ['CODE:string|50'],
                        value: [r.component._changedValue]
                    }
                    let tmpData = await this.core.sql.execute(tmpQuery)
                    if(tmpData.result.recordset.length > 0) {
                        await this.addItem(tmpData.result.recordset[0], e.rowIndex)
                    }
                }}
            />
        )
    }
    
    if(e.column.dataField == "QUANTITY") {
        // Miktar hücresi render
    }
    
    if(e.column.dataField == "DISCOUNT") {
        // İndirim hücresi render
    }
}
```

### 4. Multi-Item İşlemleri

#### `multiItemAdd()`
```javascript
async multiItemAdd() {
    let tmpMissCodes = []
    let tmpCounter = 0
    
    for (let i = 0; i < this.tagItemCode.value.length; i++) {
        if(this.cmbMultiItemType.value == 0) {
            // Müşteri koduna göre arama
            let tmpQuery = {
                query: "SELECT ... FROM ITEMS_VW_01 WHERE MULTICODE = @VALUE",
                param: ['VALUE:string|50'],
                value: [this.tagItemCode.value[i]]
            }
        } else if (this.cmbMultiItemType.value == 1) {
            // Ürün koduna göre arama
            let tmpQuery = {
                query: "SELECT ... FROM ITEMS_VW_01 WHERE CODE = @VALUE",
                param: ['VALUE:string|50'],
                value: [this.tagItemCode.value[i]]
            }
        }
        
        let tmpData = await this.core.sql.execute(tmpQuery)
        if(tmpData.result.recordset.length > 0) {
            this.multiItemData.push(tmpData.result.recordset[0])
            tmpCounter++
        } else {
            tmpMissCodes.push("'" + this.tagItemCode.value[i] + "'")
        }
    }
    
    // Sonuç mesajları göster
    if(tmpMissCodes.length > 0) {
        await dialog({
            id:'msgMissItemCode',
            content: `Bulunamayan kodlar: ${tmpMissCodes}`
        });
    }
}
```

#### `multiItemSave()`
```javascript
async multiItemSave() {
    this.checkboxReset()
    
    this.grid.devGrid.beginUpdate()
    for (let i = 0; i < this.multiItemData.length; i++) {
        await this.addItem(
            this.multiItemData[i],
            null,
            Number(this.multiItemData[i].QUANTITY * this.multiItemData[i].UNIT_FACTOR).round(3)
        )
    }
    this.grid.devGrid.endUpdate()
    this.popMultiItem.hide()
}
```

### 5. Teklif Entegrasyonu

#### `getOffers()`
```javascript
async getOffers() {
    let tmpQuery = {
        query: "SELECT *,REF + '-' + CONVERT(VARCHAR,REF_NO) AS REFERANS " +
               "FROM DOC_OFFERS_VW_01 " +
               "WHERE INPUT = @INPUT AND ORDER_LINE_GUID = '00000000-0000-0000-0000-000000000000' " +
               "AND TYPE = 1 AND DOC_TYPE IN (61)",
        param: ['INPUT:string|50'],
        value: [this.docObj.dt()[0].INPUT]
    }
    super.getOffers(tmpQuery)
}
```

## UI Bileşenleri

### Form Alanları

#### Belge Başlık Bilgileri
```javascript
// Referans ve Numara
<NdTextBox id="txtRef" dt={{data:this.docObj.dt('DOC'),field:"REF"}} />
<NdTextBox id="txtRefno" dt={{data:this.docObj.dt('DOC'),field:"REF_NO"}} />

// Müşteri Bilgileri
<NdTextBox id="txtCustomerCode" dt={{data:this.docObj.dt('DOC'),field:"INPUT_CODE"}} />
<NdTextBox id="txtCustomerName" dt={{data:this.docObj.dt('DOC'),field:"INPUT_NAME"}} />

// Depo ve Fiyat Listesi
<NdSelectBox id="cmbDepot" dt={{data:this.docObj.dt('DOC'),field:"OUTPUT"}} />
<NdSelectBox id="cmbPricingList" dt={{data:this.docObj.dt('DOC'),field:"PRICE_LIST_NO"}} />

// Tarihler
<NdDatePicker id="dtDocDate" dt={{data:this.docObj.dt('DOC'),field:"DOC_DATE"}} />
<NdDatePicker id="dtShipmentDate" dt={{data:this.docObj.dt('DOC'),field:"SHIPMENT_DATE"}} />
```

#### Grid Konfigürasyonu
```javascript
<NdGrid parent={this} id={"grdSlsOrder"+this.tabIndex} 
    showBorders={true} 
    columnsAutoWidth={true} 
    allowColumnReordering={true} 
    allowColumnResizing={true} 
    filterRow={{visible:true}}
    headerFilter={{visible:true}}
    height={'500'} 
    width={'100%'}
    dbApply={false}
    sorting={{mode:'none'}}
    selection={{mode:"single"}}
>
    <Column dataField="ITEM_CODE" caption="Ürün Kodu" editCellRender={this._cellRoleRender}/>
    <Column dataField="ITEM_NAME" caption="Ürün Adı" />
    <Column dataField="QUANTITY" caption="Miktar" editCellRender={this._cellRoleRender}/>
    <Column dataField="PRICE" caption="Fiyat" format={{ style: "currency", currency: Number.money.code}}/>
    <Column dataField="DISCOUNT" caption="İndirim" editCellRender={this._cellRoleRender}/>
    <Column dataField="VAT" caption="KDV" />
    <Column dataField="TOTAL" caption="Toplam" />
</NdGrid>
```

### Popup'lar ve Dialog'lar

#### Ürün Seçim Popup'ı
```javascript
this.pg_txtItemsCode.setSource({
    source: {
        select: {
            query: "SELECT GUID,CODE,NAME,VAT,COST_PRICE,UNIT, " +
                   "(SELECT [dbo].[FN_PRICE](GUID,1,dbo.GETDATE(),...)) AS PRICE " +
                   "FROM ITEMS_VW_01 WHERE STATUS = 1 AND (UPPER(CODE) LIKE UPPER(@VAL) OR UPPER(NAME) LIKE UPPER(@VAL))",
            param: ['VAL:string|50']
        },
        sql: this.core.sql
    }
})
```

#### Barkod Seçim Popup'ı
```javascript
this.pg_txtBarcode.setSource({
    source: {
        select: {
            query: "SELECT ITEMS_VW_01.GUID,CODE,NAME,COST_PRICE,VAT,BARCODE " +
                   "FROM ITEMS_VW_01 INNER JOIN ITEM_BARCODE_VW_01 ON ITEMS_VW_01.GUID = ITEM_BARCODE_VW_01.ITEM_GUID " +
                   "WHERE STATUS = 1 AND (ITEM_BARCODE_VW_01.BARCODE LIKE '%' + @BARCODE)",
            param: ['BARCODE:string|50']
        },
        sql: this.core.sql
    }
})
```

## Event Handling

### Grid Events

#### `onRowUpdating`
```javascript
onRowUpdating={async (e) => {
    // Sevkiyat kontrolü
    if(e.key.SHIPMENT_LINE_GUID != '00000000-0000-0000-0000-000000000000') {
        e.cancel = true
        await dialog({
            id:'msgRowNotUpdate',
            content: 'Sevkiyat yapılmış satırlar güncellenemez!'
        });
        e.component.cancelEditData()
    }
    
    // Maliyet kontrolü
    if(typeof e.newData.PRICE != 'undefined' && e.key.COST_PRICE > e.newData.PRICE) {
        let tmpData = this.sysParam.filter({ID:'underMinCostPrice',USERS:this.user.CODE}).getValue()
        if(tmpData == true) {
            let pResult = await dialog({
                id:'msgUnderPrice1',
                content: 'Maliyet fiyatının altında satış yapıyorsunuz!'
            });
        } else {
            e.cancel = true
            await dialog({
                id:'msgUnderPrice2',
                content: 'Maliyet fiyatının altında satış yapılamaz!'
            });
            e.component.cancelEditData()
        }
    }
}}
```

#### `onRowUpdated`
```javascript
onRowUpdated={async(e) => {
    // Miktar değişimi
    if(typeof e.data.QUANTITY != 'undefined') {
        e.key.SUB_QUANTITY = e.data.QUANTITY / e.key.SUB_FACTOR
        
        // Yeni fiyat hesaplama
        let tmpQuery = {
            query: "SELECT [dbo].[FN_PRICE](@ITEM_GUID,@QUANTITY,...) AS PRICE",
            param: ['ITEM_GUID:string|50','CUSTOMER_GUID:string|50','QUANTITY:float',...],
            value: [e.key.ITEM, this.docObj.dt()[0].INPUT, e.data.QUANTITY, ...]
        }
        let tmpData = await this.core.sql.execute(tmpQuery)
        if(tmpData.result.recordset.length > 0) {
            e.key.PRICE = parseFloat((tmpData.result.recordset[0].PRICE).toFixed(4))
            this.calculateTotal()
        }
    }
    
    // İndirim hesaplama
    if(typeof e.data.DISCOUNT_RATE != 'undefined') {
        e.key.DISCOUNT = Number(e.key.PRICE * e.key.QUANTITY).rateInc(e.data.DISCOUNT_RATE,4)
    }
    
    // Toplam hesaplama
    e.key.TOTALHT = Number((parseFloat((e.key.PRICE * e.key.QUANTITY).toFixed(3)) - (parseFloat(e.key.DISCOUNT)))).round(2)
    
    if(this.docObj.dt()[0].VAT_ZERO != 1) {
        e.key.VAT = parseFloat(((((e.key.TOTALHT) - (parseFloat(e.key.DOC_DISCOUNT))) * (e.key.VAT_RATE) / 100))).round(6);
    } else {
        e.key.VAT = 0
        e.key.VAT_RATE = 0
    }
    
    e.key.TOTAL = Number(((e.key.TOTALHT - e.key.DOC_DISCOUNT) + e.key.VAT)).round(2)
    
    // Marj hesaplama
    let tmpMargin = (e.key.TOTAL - e.key.VAT) - (e.key.COST_PRICE * e.key.QUANTITY)
    let tmpMarginRate = (tmpMargin /(e.key.TOTAL - e.key.VAT)) * 100
    e.key.MARGIN = tmpMargin + Number.money.sign + " / %" + tmpMarginRate
    
    this.calculateTotal()
}}
```

## Kullanım Senaryoları

### Senaryo 1: Yeni Satış Siparişi Oluşturma

```javascript
// 1. Adım: Yeni belge başlat
await this.init();

// 2. Adım: Müşteri seç
this.txtCustomerCode.value = "CUST001";
// Müşteri bilgileri otomatik doldurulur

// 3. Adım: Depo ve fiyat listesi seç
this.cmbDepot.value = "DEPOT001";
this.cmbPricingList.value = 1;

// 4. Adım: Ürün ekle
await this.addItem({
    GUID: "item-guid",
    CODE: "ITEM001",
    NAME: "Ürün Adı",
    VAT: 18,
    COST_PRICE: 10.00,
    UNIT: "unit-guid"
}, null, 5, 12.00); // 5 adet, 12.00 fiyat

// 5. Adım: Kaydet
await this.docObj.save();
```

### Senaryo 2: Barkod ile Ürün Ekleme

```javascript
// Barkod okutma
this.txtBarcode.value = "1234567890123";

// Enter tuşu ile ürün ekleme (otomatik)
// onEnterKey event'i tetiklenir ve ürün eklenir
```

### Senaryo 3: Toplu Ürün Ekleme

```javascript
// Multi-item popup'ını aç
await this.popMultiItem.show();

// Ürün kodlarını gir
this.tagItemCode.value = ["ITEM001", "ITEM002", "ITEM003"];

// Arama tipini seç (0: Müşteri kodu, 1: Ürün kodu)
this.cmbMultiItemType.value = 1;

// Ürünleri ara ve ekle
await this.multiItemAdd();
await this.multiItemSave();
```

### Senaryo 4: Tekliften Sipariş Oluşturma

```javascript
// Mevcut müşteri siparişi için teklifleri getir
await this.getOffers();

// Teklif seçildiğinde otomatik olarak satırlar eklenir
```

## Hesaplama Sistemleri

### Fiyat Hesaplama
```javascript
// Dinamik fiyat hesaplama fonksiyonu
FN_PRICE(
    @ITEM_GUID,      // Ürün GUID
    @QUANTITY,       // Miktar
    @DATE,           // Tarih
    @CUSTOMER,       // Müşteri
    @DEPOT,          // Depo
    @PRICE_LIST_NO,  // Fiyat listesi
    @DISCOUNT_RATE,  // İndirim oranı
    @CURRENCY        // Para birimi
)
```

### İndirim Hesaplama
```javascript
// Satır indirimi
e.key.DISCOUNT = Number(e.key.PRICE * e.key.QUANTITY).rateInc(discountRate, 4)

// İndirim oranı
e.key.DISCOUNT_RATE = Number(e.key.AMOUNT).rate2Num(e.key.DISCOUNT, 4)

// Toplam hesaplama
e.key.TOTALHT = Number((e.key.AMOUNT - e.key.DISCOUNT)).round(2)
```

### KDV Hesaplama
```javascript
if(this.docObj.dt()[0].VAT_ZERO != 1) {
    e.key.VAT = parseFloat(((e.key.TOTALHT * (e.key.VAT_RATE / 100))).toFixed(6));
} else {
    e.key.VAT = 0;
    e.key.VAT_RATE = 0;
}
```

### Marj Hesaplama
```javascript
let tmpMargin = (e.key.TOTAL - e.key.VAT) - (e.key.COST_PRICE * e.key.QUANTITY)
let tmpMarginRate = (tmpMargin / (e.key.TOTAL - e.key.VAT)) * 100
e.key.MARGIN = tmpMargin + Number.money.sign + " / %" + tmpMarginRate
```

## Yazdırma Sistemi

### Dizayn Seçimi
```javascript
// Kullanılabilir dizaynları listele
data={{source:{select:{query: "SELECT TAG,DESIGN_NAME FROM [dbo].[LABEL_DESIGN] WHERE PAGE = '11'"}}}}

// Yazdırma sorgusu
let tmpQuery = {
    query: "SELECT *,ISNULL((SELECT TOP 1 PATH FROM LABEL_DESIGN WHERE TAG = @DESIGN),'') AS PATH " +
           "FROM [dbo].[FN_DOC_ORDERS_FOR_PRINT](@DOC_GUID) ORDER BY ITEM_NAME",
    param: ['DOC_GUID:string|50','DESIGN:string|25','LANG:string|10'],
    value: [this.docObj.dt()[0].GUID, this.cmbDesignList.value, this.cmbDesignLang.value]
}
```

### E-posta Gönderimi
```javascript
// Müşteri e-posta adresini al
let tmpQuery = {
    query: "SELECT EMAIL FROM CUSTOMER_OFFICAL WHERE CUSTOMER = @GUID AND DELETED = 0",
    param: ['GUID:string|50'],
    value: [this.docObj.dt()[0].INPUT]
}

// E-posta gönder
let tmpMailData = {
    html: this.htmlEditor.value,
    subject: this.txtMailSubject.value,
    sendMail: this.txtSendMail.value,
    attachName: "commande " + this.docObj.dt()[0].REF + "-" + this.docObj.dt()[0].REF_NO + ".pdf",
    attachData: pdfBase64,
    mailGuid: this.cmbMailAddress.value
}
this.core.socket.emit('mailer', tmpMailData, callback)
```

## Güvenlik ve Validasyon

### Belge Kilitleme
```javascript
if(this.docObj.dt()[0].LOCKED != 0) {
    this.docLocked = true
    this.toast.show({message: "Belge kilitli!", type:'warning'})
    return
}
```

### Validation Kuralları
```javascript
<Validator validationGroup={"frmslsDoc" + this.tabIndex}>
    <RequiredRule message="Müşteri kodu zorunludur" />
</Validator>

// Form validation kontrolü
if(e.validationGroup.validate().status == "valid") {
    // İşlemi devam ettir
} else {
    this.toast.show({message: "Form validasyonu başarısız", type:'warning'})
}
```

### Yetki Kontrolü
```javascript
// Parametre kontrolü
param={this.param.filter({ELEMENT:'txtCustomerCode',USERS:this.user.CODE})}
access={this.access.filter({ELEMENT:'txtCustomerCode',USERS:this.user.CODE})}
```

## Sık Karşılaşılan Sorunlar

### Problem 1: Ürün Eklenmiyor
**Sebep**: Müşteri veya depo seçilmemiş
**Çözüm**:
```javascript
if(this.cmbDepot.value == '' || this.txtCustomerCode.value == '') {
    this.toast.show({message: "Müşteri ve depo seçimi zorunludur", type:'warning'})
    return
}
```

### Problem 2: Fiyat Hesaplanmıyor
**Sebep**: Fiyat listesi ayarlanmamış
**Çözüm**:
```javascript
// Fiyat listesi kontrolü
if(this.cmbPricingList.value == '') {
    this.cmbPricingList.value = this.docObj.dt()[0].PRICE_LIST_NO
}
```

### Problem 3: Grid Güncelleme Sorunu
**Sebep**: DevGrid cache problemi
**Çözüm**:
```javascript
// Grid'i yenile
this.grid.devGrid.beginUpdate()
// Değişiklikleri yap
this.grid.devGrid.endUpdate()
```

### Problem 4: Element Type Invalid Hatası
**Sebep**: Import/Export uyumsuzluğu
**Çözüm**:
```javascript
// Yanlış
import NdForm, { NdItem } from './form.js';

// Doğru
import { NdForm, NdItem } from './form.js';
```

## Performance İpuçları

### 1. Grid Optimizasyonu
```javascript
// Sayfalama kontrolü
{this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? 
    <Paging defaultPageSize={20} /> : 
    <Paging enabled={false} />
}

// Sonsuz scroll
{this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? 
    <Scrolling mode="standart" /> : 
    <Scrolling mode="infinite" />
}
```

### 2. Asenkron İşlemler
```javascript
// setState kullanımı
App.instance.setState({isExecute:true})
// Uzun işlem
App.instance.setState({isExecute:false})
```

### 3. Memory Yönetimi
```javascript
// Component unmount'ta cleanup
componentWillUnmount() {
    // Event listener'ları temizle
    // Timer'ları iptal et
    // Reference'ları null yap
}
```

## API Entegrasyonu

### Veritabanı Sorguları
```javascript
// Standart sorgu formatı
let tmpQuery = {
    query: "SELECT ... FROM TABLE WHERE CONDITION = @PARAM",
    param: ['PARAM:type|size'],
    value: [paramValue]
}
let tmpData = await this.core.sql.execute(tmpQuery)
```

### Socket İletişimi
```javascript
// PDF oluşturma
this.core.socket.emit('devprint', printData, (pResult) => {
    // Sonuç işleme
});

// E-posta gönderme
this.core.socket.emit('mailer', mailData, (pResult) => {
    // Sonuç işleme
});
```

Bu dokümantasyon, `salesOrder.js` modülünün tüm özelliklerini ve kullanım senaryolarını kapsamlı bir şekilde açıklar. Geliştiriciler ve son kullanıcılar için gerekli tüm bilgileri içerir. 