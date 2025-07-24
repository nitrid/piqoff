# DocBase.js Kullanım ve Teknik Dokümantasyonu

## Amaç
`DocBase.js`, tüm belge işlemleri için temel sınıftır (Base Class). Satış, satın alma, stok, fatura gibi tüm belge modülleri bu sınıftan miras alır.  
Ortak belge işlevselliği, hesaplama fonksiyonları, popup yönetimi ve veri işlemleri bu sınıfta toplanmıştır.

---

## Ana Bileşenler ve Akış

### Sınıf Hiyerarşisi
```
React.PureComponent
    ↓
DocBase (Base Class)
    ↓
├── purchaseOffer.js
├── salesInvoice.js  
├── purchaseInvoice.js
├── stockCard.js
└── ... (diğer belge modülleri)
```

### Ana Nesneler
- **docObj**: Ana belge bilgileri (docCls)
- **extraObj**: Ekstra belge bilgileri (docExtraCls)
- **nf525**: NF525 uyumluluk (nf525Cls)
- **discObj**: İndirim hesaplamaları (discountCls)
- **multiItemData**: Toplu ürün verisi (datatable)
- **unitDetailData**: Birim detay verisi (datatable)
- **newPrice/newVat**: Fiyat/KDV güncellemeleri (datatable)

### Belge Tipleri ve Ayırt Edici Özellikler
```javascript
type: 0/1 (Çıkış/Giriş)
docType: 20-129 (Belge tipi kodu)
rebate: 0/1 (Normal/İade belgesi)
```

---

## Temel Fonksiyonlar

### Constructor ve Initialization
```javascript
constructor(props) {
    // Core ve authentication setup
    this.core = App.instance.core;
    this.prmObj = parameters filter by user
    this.acsobj = access rights filter by user
    
    // Veri nesneleri oluşturma
    this.docObj = new docCls();
    this.extraObj = new docExtraCls();
    this.nf525 = new nf525Cls();
    this.discObj = new discountCls();
    
    // Binding işlemleri
    this.calculateTotal = this.calculateTotal.bind(this)
    this.getDispatch = this.getDispatch.bind(this)
    this.calculateTotalMargin = this.calculateTotalMargin.bind(this)
    this.calculateMargin = this.calculateMargin.bind(this)
}
```

### Getter/Setter Pattern
```javascript
get docDetailObj() {
    // Belge tipine göre detay objesi döner
    if((this.docType >= 20 && this.docType <= 59) || (this.docType >= 120 && this.docType <= 129)) {
        return this.docObj.docItems
    }
    else if(this.docType == 60 || this.docType == 62) {
        return this.docObj.docOrders
    }
    else if(this.docType == 61) {
        return this.docObj.docOffers
    }
    else if(this.docType == 63) {
        return this.docObj.docDemand
    }
}
```

---

## Çekirdek İşlevler

### 1. Belge Yönetimi

#### init() - Başlangıç İnisilatasyonu
```javascript
async init() {
    this.docObj.clearAll()
    this.extraObj.clearAll()
    
    // Event handler'ları tanımlama
    this.docObj.ds.on('onAddRow', (pTblName, pData) => {
        // Yeni kayıt ekleme işlemleri
        // Button state'leri güncelleme
    })
    
    this.docObj.ds.on('onEdit', (pTblName, pData) => {
        // Düzenleme işlemleri
    })
    
    // Boş belge oluşturma
    let tmpDoc = {...this.docObj.empty}
    tmpDoc.TYPE = this.type
    tmpDoc.DOC_TYPE = this.docType
    tmpDoc.REBATE = this.rebate
    this.docObj.addEmpty(tmpDoc);
}
```

#### getDoc() - Belge Yükleme
```javascript
async getDoc(pGuid, pRef, pRefno) {
    this.docObj.clearAll()
    await this.docObj.load({
        GUID: pGuid,
        REF: pRef, 
        REF_NO: pRefno,
        TYPE: this.type,
        DOC_TYPE: this.docType
    });
    
    // Kilit kontrolü
    if(this.docObj.dt()[0].LOCKED != 0) {
        this.docLocked = true
        this.toast.show({message: this.t("msgGetLocked.msg"), type: 'warning'})
    }
    
    // Hesaplamaları yenile
    this.calculateMargin()
    this.calculateTotalMargin()
}
```

#### getDocs() - Belge Listesi
```javascript
async getDocs(pType) {
    let tmpQuery = {
        query: "SELECT GUID,REF,REF_NO,CLOSED,OUTPUT_CODE,OUTPUT_NAME,DOC_DATE_CONVERT,TOTAL " +
               "FROM DOC_VW_01 WHERE TYPE = " + this.type + " AND DOC_TYPE = " + this.docType
    }
    
    let tmpData = await this.core.sql.execute(tmpQuery)
    await this.pg_Docs.setData(tmpData.result.recordset)
    await this.pg_Docs.show()
}
```

### 2. Fiyat ve Hesaplama İşlemleri

#### getPrice() - Fiyat Hesaplama
```javascript
async getPrice(pItem, pQty, pCustomer, pDepot, pListNo, pType, pAddVat) {
    let tmpQuery = {
        query: "SELECT dbo.FN_PRICE(@GUID,@QUANTITY,dbo.GETDATE(),@CUSTOMER,@DEPOT,@PRICE_LIST_NO,@TYPE,@ADD_VAT) AS PRICE",
        param: ['GUID:string|50','QUANTITY:float','CUSTOMER:string|50','DEPOT:string|50','PRICE_LIST_NO:int','TYPE:int','ADD_VAT:bit'],
        value: [pItem, pQty, pCustomer, pDepot, pListNo, pType, pAddVat]
    }
    
    let tmpData = await this.core.sql.execute(tmpQuery)
    if(tmpData.result.recordset.length > 0) {
        return tmpData.result.recordset[0].PRICE
    }
}
```

#### calculateTotal() - Toplam Hesaplama
```javascript
async calculateTotal() {
    let tmpVat = 0
    
    // KDV toplamı hesaplama
    for (let i = 0; i < this.docDetailObj.dt().groupBy('VAT_RATE').length; i++) {
        if(this.docObj.dt()[0].VAT_ZERO != 1) {
            tmpVat += parseFloat(this.docDetailObj.dt()
                .where({'VAT_RATE': this.docDetailObj.dt().groupBy('VAT_RATE')[i].VAT_RATE})
                .sum("VAT", 2))
        }
    }
    
    // Belge toplamları
    this.docObj.dt()[0].AMOUNT = this.docDetailObj.dt().sum("AMOUNT", 2)
    this.docObj.dt()[0].DISCOUNT = this.docDetailObj.dt().sum("DISCOUNT", 2)
    this.docObj.dt()[0].VAT = Number(tmpVat).round(2)
    this.docObj.dt()[0].TOTAL = Number((this.docObj.dt()[0].TOTALHT + this.docObj.dt()[0].VAT)).round(2)
}
```

#### calculateMargin() - Marj Hesaplama
```javascript
async calculateMargin() {
    for(let i = 0; i < this.docDetailObj.dt().length; i++) {
        let tmpMargin = Number(this.docDetailObj.dt()[i].TOTAL - this.docDetailObj.dt()[i].VAT).round(4) - 
                       Number(this.docDetailObj.dt()[i].COST_PRICE * this.docDetailObj.dt()[i].QUANTITY).round(4)
        let tmpMarginRate = Number((this.docDetailObj.dt()[i].COST_PRICE * this.docDetailObj.dt()[i].QUANTITY))
                           .rate2Num(tmpMargin, 2)
        this.docDetailObj.dt()[i].MARGIN = tmpMargin.toFixed(2) + Number.money.sign + " / %" + tmpMarginRate.toFixed(2)
    }
}
```

### 3. Stok ve Depo İşlemleri

#### getDepotQty() - Depo Miktarı
```javascript
async getDepotQty(pItem, pDepot) {
    let tmpQuery = {
        query: "SELECT " +
               "dbo.FN_DEPOT_QUANTITY(@ITEM,@DEPOT,dbo.GETDATE()) AS DEPOT_QTY, " +
               "dbo.FN_ORDER_PEND_QTY(@ITEM,1,@DEPOT) AS RESERV_OUTPUT_QTY, " + 
               "dbo.FN_ORDER_PEND_QTY(@ITEM,0,@DEPOT) AS RESERV_INPUT_QTY",
        param: ['ITEM:string|50','DEPOT:string|50'],
        value: [pItem, pDepot]
    }
    
    let tmpData = await this.core.sql.execute(tmpQuery)
    if(tmpData.result.recordset.length > 0) {
        return tmpData.result.recordset[0]
    }
}
```

### 4. Ürün İlişkileri ve Kombine İşlemler

#### itemRelated() - İlişkili Ürün Ekleme
```javascript
itemRelated(pGuid, pQuantity) {
    return new Promise(async resolve => {
        let tmpRelatedQuery = {
            query: "SELECT ITEM_GUID,ITEM_CODE,ITEM_NAME,ITEM_QUANTITY,RELATED_GUID,RELATED_CODE,RELATED_NAME,RELATED_QUANTITY " +
                   "FROM ITEM_RELATED_VW_01 WHERE ITEM_GUID = @ITEM_GUID",
            param: ['ITEM_GUID:string|50'],
            value: [pGuid]
        }
        
        let tmpRelatedData = await this.core.sql.execute(tmpRelatedQuery)
        
        for (let i = 0; i < tmpRelatedData.result.recordset.length; i++) {
            let tmpRelatedQt = Math.floor(pQuantity / tmpRelatedData.result.recordset[i].ITEM_QUANTITY) * 
                              tmpRelatedData.result.recordset[i].RELATED_QUANTITY
            
            if(tmpRelatedQt > 0) {
                // İlişkili ürünü ekle
                await this.addItem(relatedItemData, null, tmpRelatedQt)
            }
        }
        resolve()
    })
}
```

#### mergeItem() - Ürün Birleştirme
```javascript
async mergeItem(pCode) {
    let tmpMergeDt = this.docDetailObj.dt().where({ITEM_CODE: pCode})
    if(tmpMergeDt.length > 0) {
        if(this.combineControl == true) {
            this.msgCombineItem.setTitle(tmpMergeDt[0].ITEM_NAME)
            let tmpBtnResult = await this.msgCombineItem.show();
            
            if(tmpBtnResult == 'btn01') {
                // Birleştir
                this.combineNew = false
            } else {
                // Yeni satır ekle
                this.combineNew = true
            }
        }
        return tmpMergeDt
    }
}
```

---

## Belge Dönüştürme İşlemleri

### convertDocOrders() - Sipariş Dönüştürme
```javascript
async convertDocOrders(data) {
    this.grid.devGrid.beginUpdate()
    
    for (let i = 0; i < data.length; i++) {
        let tmpDocItems = {...this.docObj.docItems.empty}
        
        // Sipariş verilerini fatura satırına kopyala
        tmpDocItems.DOC_GUID = this.docObj.dt()[0].GUID
        tmpDocItems.ITEM = data[i].ITEM
        tmpDocItems.QUANTITY = data[i].PEND_QUANTITY
        tmpDocItems.PRICE = data[i].PRICE
        tmpDocItems.ORDER_LINE_GUID = data[i].GUID
        // ... diğer alanlar
        
        await this.docObj.docItems.addEmpty(tmpDocItems)
    }
    
    this.grid.devGrid.endUpdate()
    this.calculateTotal()
}
```

### convertDocOffers() - Teklif Dönüştürme
```javascript
async convertDocOffers(data) {
    for (let i = 0; i < data.length; i++) {
        if(this.docType == 60) {
            // Siparişe dönüştür
            let tmpDocItems = {...this.docObj.docOrders.empty}
        } else {
            // Faturaya dönüştür
            let tmpDocItems = {...this.docObj.docItems.empty}
        }
        
        // Teklif verilerini hedef belgeye kopyala
        tmpDocItems.OFFER_LINE_GUID = data[i].GUID
        tmpDocItems.OFFER_DOC_GUID = data[i].DOC_GUID
        // ... veri transferi
        
        await this.docDetailObj.addEmpty(tmpDocItems)
    }
    this.calculateTotal()
}
```

---

## Validasyon ve Kontrol İşlemleri

### checkDocNo() - Belge No Kontrolü
```javascript
async checkDocNo(pDocNo) {
    if(this.prmObj.filter({ID:'checkDocNo',USERS:this.user.CODE}).getValue()) {
        if(pDocNo != '') {
            let tmpQuery = {
                query: "SELECT DOC_NO FROM DOC_VW_01 WHERE DOC_NO = @DOC_NO AND TYPE = @TYPE AND DOC_TYPE = @DOC_TYPE",
                param: ['DOC_NO:string|50','TYPE:int','DOC_TYPE:int'],
                value: [pDocNo, this.type, this.docType]
            }
            
            let tmpResult = await this.core.sql.execute(tmpQuery)
            if(tmpResult.result.recordset.length > 0) {
                await dialog({
                    title: this.lang.t("msgCheckDocNo.title"),
                    content: this.lang.t("msgCheckDocNo.msg")
                });
            }
        }
    }
}
```

### searchSameItems() - Aynı Ürün Kontrolü
```javascript
async searchSameItems() {
    let itemCodes = [];
    let duplicateItems = [];
    
    for(let i = 0; i < this.docDetailObj.dt().length; i++) {
        let itemCode = this.docDetailObj.dt()[i].ITEM_CODE;
        
        if(itemCodes.includes(itemCode)) {
            if(!duplicateItems.includes(itemCode)) {
                duplicateItems.push(itemCode);
            }
        } else {
            itemCodes.push(itemCode);
        }
    }
    
    if(duplicateItems.length > 0) {
        await dialog({
            title: this.t("msgDuplicateItems.title"),
            content: this.t("msgDuplicateItems.msg") + " " + duplicateItems.join(", ")
        });
    }
}
```

---

## Popup ve Dialog Yönetimi

### Ana Popup'lar

#### pg_txtCustomerCode - Cari Seçim
```javascript
<NdPopGrid id={"pg_txtCustomerCode"} parent={this} container={"#root"}
    visible={false}
    position={{of:'#root'}} 
    title={this.t("pg_txtCustomerCode.title")}
    search={true}>
    <Column dataField="CODE" caption={this.t("pg_txtCustomerCode.clmCode")} />
    <Column dataField="TITLE" caption={this.t("pg_txtCustomerCode.clmTitle")} />
    <Column dataField="TYPE_NAME" caption={this.t("pg_txtCustomerCode.clmTypeName")} />
</NdPopGrid>
```

#### pg_txtItemsCode - Ürün Seçim
```javascript
<NdPopGrid id={"pg_txtItemsCode"} parent={this} container={"#root"}
    visible={false}
    title={this.t("pg_txtItemsCode.title")}
    search={true}>
    <Column dataField="CODE" caption={this.t("pg_txtItemsCode.clmCode")} />
    <Column dataField="NAME" caption={this.t("pg_txtItemsCode.clmName")} />
    <Column dataField="PRICE" caption={this.t("pg_txtItemsCode.clmPrice")} />
</NdPopGrid>
```

#### popDiscount - İndirim Popup'ı
```javascript
<NdPopUp parent={this} id={"popDiscount"} 
    title={this.t("popDiscount.title")}
    width={'500'} height={'auto'}>
    <Form colCount={1}>
        <Item>
            <Label text={this.t("popDiscount.Percent1")} />
            <NdNumberBox id="txtDiscountPercent1" parent={this}
                onValueChanged={() => {
                    this.txtDiscountPrice1.value = Number(this.docObj.dt()[0].AMOUNT)
                        .rateInc(this.txtDiscountPercent1.value, 2)
                }}/>
        </Item>
        {/* Diğer indirim alanları */}
    </Form>
</NdPopUp>
```

### Dialog'lar

#### msgQuantity - Miktar Girişi
```javascript
<NdDialog id={"msgQuantity"} parent={this}
    title={this.lang.t("msgQuantity.title")}
    button={[{id:"btn01",caption:this.lang.t("msgQuantity.btn01")}]}>
    <Form>
        <Item>
            <NdSelectBox id="cmbPopQteUnit" parent={this}
                displayExpr="NAME" valueExpr="GUID"/>
        </Item>
        <Item>
            <Label text={this.lang.t("msgQuantity.txtQuantity")} />
            <NdNumberBox id="txtPopQuantity" parent={this}/>
        </Item>
    </Form>
</NdDialog>
```

---

## Event Handling

### Document Events
```javascript
this.docObj.ds.on('onAddRow', (pTblName, pData) => {
    if(pData.stat == 'new') {
        this.btnNew.setState({disabled: false});
        this.btnSave.setState({disabled: false});
        this.btnPrint.setState({disabled: false});
    }
})

this.docObj.ds.on('onEdit', (pTblName, pData) => {
    if(pData.rowData.stat == 'edit') {
        this.btnBack.setState({disabled: false});
        this.btnSave.setState({disabled: false});
        pData.rowData.CUSER = this.user.CODE
    }
})

this.docObj.ds.on('onRefresh', (pTblName) => {
    this.btnBack.setState({disabled: true});
    this.btnNew.setState({disabled: false});
    this.calculateMargin()
    this.calculateTotalMargin()
})
```

### Popup Events
```javascript
this.msgQuantity.onShowed = async () => {
    this.txtPopQuantity.focus()
    this.msgQuantity.setTitle(this.msgQuantity.tmpData.NAME)
    
    // Birim bilgilerini getir
    let tmpUnitDt = new datatable()
    tmpUnitDt.selectCmd = {
        query: "SELECT GUID,NAME,FACTOR,TYPE FROM ITEM_UNIT WHERE ITEM = @ITEM",
        param: ['ITEM:string|50'],
        value: [this.msgQuantity.tmpData.GUID]
    }
    await tmpUnitDt.refresh()
    this.cmbPopQteUnit.setData(tmpUnitDt)
}
```

---

## Performans Optimizasyonları

### Grid Performance
```javascript
// Virtual scrolling büyük veri setleri için
<Scrolling mode="virtual" />

// Batch updates için
this.grid.devGrid.beginUpdate()
// ... toplu işlemler
this.grid.devGrid.endUpdate()

// Debouncing hızlı değişiklikler için
await this.core.util.waitUntil(100)
```

### Memory Management
```javascript
// Component unmount'ta temizlik
componentWillUnmount() {
    // Event listener'ları temizle
    this.docObj.ds.off('onAddRow')
    this.docObj.ds.off('onEdit')
    this.docObj.ds.off('onRefresh')
    
    // Datatable'ları temizle
    this.multiItemData.clear()
    this.unitDetailData.clear()
}
```

---

## Hata Yönetimi

### Try-Catch Pattern
```javascript
async save() {
    try {
        // Validasyon kontrolü
        if(this.docDetailObj.dt().length == 0) {
            throw new Error(this.t("msgSaveError.noItems"))
        }
        
        // Kaydetme işlemi
        let result = await this.docObj.save()
        
        if(result.success) {
            this.toast.show({
                message: this.t("msgSaveResult.msgSuccess"),
                type: 'success'
            })
        }
    } catch(error) {
        this.toast.show({
            message: error.message,
            type: 'error'
        })
    }
}
```

### Custom Validation
```javascript
validateDocument() {
    let errors = []
    
    // Zorunlu alan kontrolü
    if(!this.docObj.dt()[0].INPUT && !this.docObj.dt()[0].OUTPUT) {
        errors.push(this.t("validation.customerRequired"))
    }
    
    // Tarih kontrolü
    if(new Date(this.docObj.dt()[0].DOC_DATE) > new Date()) {
        errors.push(this.t("validation.invalidDate"))
    }
    
    // Satır kontrolü
    if(this.docDetailObj.dt().length == 0) {
        errors.push(this.t("validation.noItems"))
    }
    
    return errors
}
```

---

## Güvenlik İmplementasyonu

### User Authorization
```javascript
// Sayfa erişim kontrolü
if(!this.acsobj.filter({ELEMENT:'btnSave'}).getValue()) {
    this.btnSave.setState({disabled: true})
}

// Alan bazlı yetki kontrolü
if(!this.acsobj.filter({ELEMENT:'txtPrice'}).getValue()) {
    this.txtPrice.option('readOnly', true)
}
```

### SQL Injection Prevention
```javascript
// Parameterized queries kullanımı
let tmpQuery = {
    query: "SELECT * FROM ITEMS WHERE CODE = @CODE AND STATUS = @STATUS",
    param: ['CODE:string|25', 'STATUS:int'],
    value: [itemCode, 1]
}
```

---

## Miras Alan Sınıflar İçin Geliştirme Rehberi

### Yeni Belge Modülü Oluşturma
```javascript
import DocBase from '../../../tools/DocBase.js';

export default class newDocumentType extends DocBase {
    constructor(props) {
        super(props)
        
        // Belge tipi tanımlamaları
        this.type = 0  // 0:Çıkış, 1:Giriş
        this.docType = 25  // Belge tipi kodu
        this.rebate = 0  // 0:Normal, 1:İade
    }
    
    async componentDidMount() {
        await this.core.util.waitUntil(0)
        await this.init()
    }
    
    // Özel işlevler buraya eklenir
    customFunction() {
        // Modüle özel fonksiyonlar
    }
    
    render() {
        return (
            <div>
                {/* DocBase'den gelen popup'lar */}
                {super.render()}
                
                {/* Modüle özel UI bileşenleri */}
                <div>Custom Content</div>
            </div>
        )
    }
}
```

### Override Edilebilir Fonksiyonlar
```javascript
// Özel hesaplama mantığı
async calculateTotal() {
    // Base fonksiyonu çağır
    await super.calculateTotal()
    
    // Modüle özel hesaplamalar
    this.customCalculations()
}

// Özel validasyon kuralları
validateDocument() {
    let baseErrors = super.validateDocument()
    
    // Modüle özel validasyonlar
    if(this.customValidation() == false) {
        baseErrors.push("Custom validation error")
    }
    
    return baseErrors
}
```

---

## Best Practices ve Tavsiyeler

### 1. Code Organization
- **Separation of concerns**: Her fonksiyon tek işe odaklansın
- **Consistent naming**: Tutarlı isimlendirme kuralları
- **Documentation**: Her fonksiyon dokümante edilsin
- **Error handling**: Tüm async işlemlerde hata yönetimi

### 2. Performance
- **Lazy loading**: Popup'lar deferRendering kullanın
- **Virtual scrolling**: Büyük grid'ler için
- **Debouncing**: Hızlı değişikliklerde
- **Memory cleanup**: Component unmount'ta temizlik

### 3. User Experience
- **Loading states**: Uzun işlemlerde loading göster
- **Validation feedback**: Anlık hata mesajları
- **Keyboard shortcuts**: Hızlı erişim için
- **Auto-save**: Veri kaybını önleme

### 4. Security
- **Input validation**: Tüm girişleri validate et
- **XSS prevention**: HTML content'i sanitize et
- **CSRF protection**: API çağrılarında token kullan
- **Authorization**: Her işlem için yetki kontrolü

---

## Troubleshooting

### Sık Karşılaşılan Sorunlar

**Grid güncellenmiyor**
- `this.grid.devGrid.refresh()` çağır
- `dataSource` referansını kontrol et
- `beginUpdate/endUpdate` kullanımını kontrol et

**Popup açılmıyor**
- `container` prop'unu kontrol et
- `deferRendering={true}` ayarını kontrol et
- `visible` state'ini kontrol et

**Hesaplama hataları**
- `Number.round()` precision'ını kontrol et
- `parseFloat/parseInt` kullanımını kontrol et
- `isNaN` kontrolü yap

**Memory leaks**
- Event listener'ları temizle
- Subscription'ları unsubscribe et
- Timer'ları clear et

--- 