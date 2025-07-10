# POS Satış Siparişi (POS Sales Order) Modülü

## Genel Bakış

`posSalesOrder.js`, ERP sisteminin POS (Point of Sale) satış siparişi yönetimi için geliştirilmiş React tabanlı bir bileşendir. Bu modül, perakende satış noktalarında hızlı ve etkili sipariş alma süreçleri için optimize edilmiştir.

## Teknik Özellikler

### Sınıf Hiyerarşisi
```javascript
class posSalesOrder extends DocBase
```

### Temel Özellikler
- **Type**: 1 (Satış)
- **Doc Type**: 62 (POS Satış Siparişi)
- **Base Class**: DocBase
- **Optimization**: POS hızlı satış için optimize edilmiş

### Constructor Parametreleri
```javascript
constructor(props) {
    super(props)
    this.type = 1;              // Satış tipi
    this.docType = 62;          // POS Sipariş tipi
    this.rebate = 0;            // İskonto
    this.combineControl = true; // Ürün birleştirme kontrolü
    this.combineNew = false;    // Yeni birleştirme modu
}
```

## POS'a Özel Özellikler

### 1. Hızlı Barkod İşleme

#### Gelişmiş Barkod Pattern Sistemi
```javascript
getBarPattern(pBarcode) {
    pBarcode = pBarcode.toString().trim()
    let tmpPrm = this.sysParam.filter({ID:'BarcodePattern',TYPE:0}).getValue();
    
    if(typeof tmpPrm == 'undefined' || tmpPrm.length == 0) {            
        return {barcode:pBarcode}
    }
    
    // Örnek: 201234012550 formatında barkod analizi
    for (let i = 0; i < tmpPrm.length; i++) {
        let tmpFlag = tmpPrm[i].substring(0,tmpPrm[i].indexOf('N'))
        if(tmpFlag != '' && tmpPrm[i].length == pBarcode.length && 
           pBarcode.substring(0,tmpFlag.length) == tmpFlag) {
            
            // Fiyat bilgisi çıkarma (M: Money, C: Cent)
            let tmpMoney = pBarcode.substring(tmpPrm[i].indexOf('M'),tmpPrm[i].lastIndexOf('M') + 1)
            let tmpCent = pBarcode.substring(tmpPrm[i].indexOf('C'),tmpPrm[i].lastIndexOf('C') + 1)
            
            // Ağırlık bilgisi çıkarma (K: Kg, G: Gram)
            let tmpKg = pBarcode.substring(tmpPrm[i].indexOf('K'),tmpPrm[i].lastIndexOf('K') + 1)
            let tmpGram = pBarcode.substring(tmpPrm[i].indexOf('G'),tmpPrm[i].lastIndexOf('G') + 1)
            
            // Özel factory hesaplama
            let tmpFactory = 1
            if(tmpPrm[i].indexOf('F') > -1) {
                tmpFactory = this.sysParam.filter({ID:'ScalePriceFactory',TYPE:0}).getValue()
            }
            
            return {
                barcode: pBarcode.substring(0,tmpPrm[i].lastIndexOf('N') + 1) + "...",
                price: parseFloat((tmpMoney == '' ? "0" : tmpMoney) + "." + (tmpCent == '' ? "0" : tmpCent)) * tmpFactory,
                quantity: parseFloat((tmpKg == '' ? "0" : tmpKg) + "." + (tmpGram == '' ? "0" : tmpGram))
            }
        }
    }
    return {barcode: pBarcode}
}
```

#### Hızlı Barkod Girişi
```javascript
onEnterKey={(async(e) => {
    if(this.cmbDepot.value == '' || this.txtCustomerCode.value == '') {
        this.toast.show({message:this.t("msgDocValid.msg"),type:'warning',displayTime:2000})
        this.txtBarcode.setState({value:""})
        return
    }
    
    // Barkod pattern analizi
    let tmpBarPattern = this.getBarPattern(this.txtBarcode.value)
    let tmpPrice = typeof tmpBarPattern.price == 'undefined' ? 0 : tmpBarPattern.price
    let tmpQuantity = typeof tmpBarPattern.quantity == 'undefined' ? 0 : tmpBarPattern.quantity
    let pCode = tmpBarPattern.barcode  
    
    // Ürün arama (Barkod, Kod, Müşteri Kodu)
    let tmpQuery = {  
        query: "SELECT GUID,CODE,NAME,COST_PRICE,UNIT_GUID AS UNIT,VAT,MULTICODE,CUSTOMER_NAME,BARCODE " +
               "FROM ITEMS_BARCODE_MULTICODE_VW_01 " +
               "WHERE STATUS = 1 AND (BARCODE = @CODE OR CODE = @CODE OR " +
               "(MULTICODE = @CODE AND CUSTOMER_GUID = @CUSTOMER))",
        param: ['CODE:string|50','CUSTOMER:string|50'],
        value: [pCode, this.docObj.dt()[0].INPUT]
    }
    let tmpData = await this.core.sql.execute(tmpQuery)
    
    if(tmpData.result.recordset.length > 0) {
        if(tmpPrice != 0 || tmpQuantity != 0) {
            // Barkoddan gelen fiyat/miktar ile ekleme
            this.addItem(tmpData.result.recordset[0], null, 
                        tmpQuantity == 0 ? 1 : tmpQuantity, tmpPrice)
        } else {
            // Manuel miktar girişi
            this.msgQuantity.tmpData = tmpData.result.recordset[0]
            await this.msgQuantity.show()
            this.addItem(tmpData.result.recordset[0], null, 
                        this.txtPopQteUnitQuantity.value, this.txtPopQteUnitPrice.value)
        }
        this.txtBarcode.focus()
    } else {
        // Ürün bulunamadı - arama popup'ı aç
        this.pg_txtItemsCode.onClick = async(data) => {
            if(data.length > 0) {
                // Tek ürün bulundu
                if(data.length == 1) {
                    this.msgQuantity.tmpData = data[0]
                    await this.msgQuantity.show()
                    this.addItem(data[0], null, 
                               this.txtPopQteUnitQuantity.value, this.txtPopQteUnitPrice.value)
                } else {
                    // Çoklu ürün bulundu - hepsini ekle
                    for (let i = 0; i < data.length; i++) {
                        await this.addItem(data[i], null)
                    }
                }
            }
        }
        await this.pg_txtItemsCode.setVal(this.txtBarcode.value)
    }
    this.txtBarcode.value = ''
})}
```

### 2. POS Optimize Grid İşlemleri

#### Hızlı Grid Güncelleme
```javascript
// POS için optimize edilmiş grid özellikleri
<NdGrid parent={this} id={"grdSlsOrder"} 
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
    onRowPrepared={(e) => {
        if(e.rowType == 'data' && e.data.SHIPMENT_LINE_GUID != '00000000-0000-0000-0000-000000000000') {
            e.rowElement.style.color = "Silver"
        }
    }}
    onRowUpdating={async (e) => {
        // POS'a özel validasyonlar
        if(e.key.SHIPMENT_LINE_GUID != '00000000-0000-0000-0000-000000000000') {
            e.cancel = true
            let tmpConfObj = {
                id:'msgRowNotUpdate',
                title: this.t("msgRowNotUpdate.title"),
                content: this.t("msgRowNotUpdate.msg")
            }
            dialog(tmpConfObj);
            e.component.cancelEditData()
        }
        
        // Maliyet kontrolü
        if(typeof e.newData.PRICE != 'undefined' && e.key.COST_PRICE > e.newData.PRICE) {
            let tmpData = this.sysParam.filter({ID:'underMinCostPrice',USERS:this.user.CODE}).getValue()
            if(typeof tmpData != 'undefined' && tmpData == true) {
                let tmpConfObj = {
                    id:'msgUnderPrice1',
                    title: this.t("msgUnderPrice1.title"),
                    content: this.t("msgUnderPrice1.msg")
                }
                await dialog(tmpConfObj);
            } else {
                e.cancel = true
                let tmpConfObj = {
                    id:'msgUnderPrice2',
                    title: "Uyarı",
                    content: this.t("msgUnderPrice2.msg")
                }
                dialog(tmpConfObj);
                e.component.cancelEditData()
            }
        }
    }}
>
```

#### Sayfalama Kontrolü (POS Optimize)
```javascript
// POS için dinamik sayfalama
{this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? 
    <Paging defaultPageSize={20} /> : 
    <Paging enabled={false} />
}
{this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? 
    <Pager visible={true} allowedPageSizes={[5,10,50]} showPageSizeSelector={true} /> : 
    <Paging enabled={false} />
}
{this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? 
    <Scrolling mode="standart" /> : 
    <Scrolling mode="infinite" />
}
```

### 3. POS Multi-Item İşlemleri

#### Toplu Ürün Ekleme (POS Optimize)
```javascript
async multiItemAdd() {
    let tmpMissCodes = []
    let tmpCounter = 0
    
    // Mevcut veri kontrolü
    if(this.multiItemData.length > 0) {
        let tmpConfObj = {
            id:'msgMultiData',
            title: this.t("msgMultiData.title"),
            content: this.t("msgMultiData.msg")
        }
        let pResult = await dialog(tmpConfObj);
        if(pResult == 'btn01') {
            this.multiItemData.clear()
        }
    }
    
    for (let i = 0; i < this.tagItemCode.value.length; i++) {
        if(this.cmbMultiItemType.value == 0) {
            // Müşteri koduna göre arama
            let tmpQuery = {
                query: "SELECT GUID,CODE,NAME,VAT,1 AS QUANTITY,UNIT," + 
                       "ISNULL((SELECT TOP 1 MULTICODE FROM ITEM_MULTICODE_VW_01 WHERE ITEM_GUID = ITEMS_VW_04.GUID AND CUSTOMER_GUID = '"+this.docObj.dt()[0].INPUT+"'),'') AS MULTICODE" +
                       " FROM ITEMS_VW_04 WHERE ISNULL((SELECT TOP 1 MULTICODE FROM ITEM_MULTICODE_VW_01 WHERE ITEM_GUID = ITEMS_VW_04.GUID AND CUSTOMER_GUID = '"+this.docObj.dt()[0].INPUT+"'),'') = @VALUE",
                param: ['VALUE:string|50'],
                value: [this.tagItemCode.value[i]]
            }
        } else if (this.cmbMultiItemType.value == 1) {
            // Ürün koduna göre arama
            let tmpQuery = {
                query: "SELECT GUID,CODE,NAME,VAT,1 AS QUANTITY,UNIT," + 
                       "ISNULL((SELECT TOP 1 MULTICODE FROM ITEM_MULTICODE_VW_01 WHERE ITEM_GUID = ITEMS_VW_04.GUID AND CUSTOMER_GUID = '"+this.docObj.dt()[0].INPUT+"'),'') AS MULTICODE" +
                       " FROM ITEMS_VW_04 WHERE UPPER(CODE) LIKE UPPER(@VALUE) OR UPPER(NAME) LIKE UPPER(@VALUE)",
                param: ['VALUE:string|50'],
                value: [this.tagItemCode.value[i]]
            }
        }
        
        let tmpData = await this.core.sql.execute(tmpQuery)
        if(tmpData.result.recordset.length > 0) {
            if(typeof this.multiItemData.where({'CODE':tmpData.result.recordset[0].CODE})[0] == 'undefined') {
                this.multiItemData.push(tmpData.result.recordset[0])
                tmpCounter = tmpCounter + 1
            }
        } else {
            tmpMissCodes.push("'" + this.tagItemCode.value[i] + "'")
        }
    }
    
    // Sonuç mesajları
    if(tmpMissCodes.length > 0) {
        let tmpConfObj = {
            id:'msgMissItemCode',
            title: this.t("msgMissItemCode.title"),
            content: this.t("msgMissItemCode.msg") + ' ' + tmpMissCodes
        }
        await dialog(tmpConfObj);
    }
    
    let tmpConfObj = {
        id:'msgMultiCodeCount',
        title: this.t("msgMultiCodeCount.title"),
        content: this.t("msgMultiCodeCount.msg") + ' ' + tmpCounter
    }
    await dialog(tmpConfObj);
}
```

### 4. POS Özel Cell Rendering

#### Miktar Hücresi (POS Optimize)
```javascript
if(e.column.dataField == "QUANTITY") {
    return (
        <NdTextBox id={"txtGrdQuantity"+e.rowIndex} parent={this} simple={true} 
        value={e.value}
        onChange={(r) => {
            this.grdSlsOrder.devGrid.cellValue(e.rowIndex,"QUANTITY",r.component._changedValue)
        }}
        button={[
            {
                id:'01',
                icon:'more',
                onClick: async () => {
                    // Birim değişim popup'ı
                    this.msgUnit.tmpData = e.data
                    await this.msgUnit.show()
                    
                    // Birim bilgilerini güncelle
                    e.key.UNIT = this.cmbUnit.value
                    e.key.UNIT_FACTOR = this.txtUnitFactor.value
                    e.data.PRICE = parseFloat((this.txtUnitPrice.value).toFixed(4))
                    e.data.QUANTITY = this.txtTotalQuantity.value
                    
                    // KDV hesaplama
                    if(this.docObj.dt()[0].VAT_ZERO != 1) {
                        e.data.VAT = Number(((((e.data.PRICE * e.data.QUANTITY) - e.data.DISCOUNT) * (e.data.VAT_RATE) / 100))).round(6)
                    } else {
                        e.data.VAT = 0
                        e.data.VAT_RATE = 0
                    }
                    
                    // Toplam hesaplama
                    e.data.AMOUNT = Number((e.data.PRICE * e.data.QUANTITY)).round(4)
                    e.data.TOTALHT = Number(((e.data.PRICE * e.data.QUANTITY) - e.data.DISCOUNT)).round(2)
                    e.data.TOTAL = Number((((e.data.PRICE * e.data.QUANTITY) - e.data.DISCOUNT) + e.data.VAT)).round(2)
                    e.data.DISCOUNT_RATE = Number(e.data.AMOUNT).rate2Num(e.data.DISCOUNT,4)
                    
                    // Bağlı ürün güncelleme
                    await this.itemRelatedUpdate(e.data.ITEM, this.txtTotalQuantity.value)
                    this.calculateTotal() 
                }
            }
        ]}
        />
    )
}
```

#### İndirim Hücresi (Çoklu İndirim)
```javascript
if(e.column.dataField == "DISCOUNT") {
    return (
        <NdTextBox id={"txtGrdDiscount"+e.rowIndex} parent={this} simple={true} 
        value={e.value}
        onChange={(r) => {
            this.grdSlsOrder.devGrid.cellValue(e.rowIndex,"DISCOUNT",r.component._changedValue)
        }}
        button={[
            {
                id:'01',
                icon:'more',
                onClick: async () => {
                    // Çoklu indirim popup'ı
                    this.msgDiscountEntry.onShowed = async () => {
                        this.txtDiscount1.value = e.data.DISCOUNT_1
                        this.txtDiscount2.value = e.data.DISCOUNT_2
                        this.txtDiscount3.value = e.data.DISCOUNT_3
                        this.txtTotalDiscount.value = (parseFloat(e.data.DISCOUNT_1) + parseFloat(e.data.DISCOUNT_2) + parseFloat(e.data.DISCOUNT_3))
                    }
                    
                    await this.msgDiscountEntry.show()
                    
                    // İndirim değerlerini güncelle
                    e.data.DISCOUNT_1 = this.txtDiscount1.value
                    e.data.DISCOUNT_2 = this.txtDiscount2.value
                    e.data.DISCOUNT_3 = this.txtDiscount3.value
                    e.data.DISCOUNT = (parseFloat(this.txtDiscount1.value) + parseFloat(this.txtDiscount2.value) + parseFloat(this.txtDiscount3.value))
                    
                    // KDV yeniden hesaplama
                    if(this.docObj.dt()[0].VAT_ZERO != 1) {
                        e.data.VAT = parseFloat(((((e.data.PRICE * e.data.QUANTITY) - e.data.DISCOUNT) * (e.data.VAT_RATE) / 100)).toFixed(6));
                    } else {
                        e.data.VAT = 0
                        e.data.VAT_RATE = 0
                    }
                    
                    // Toplam güncelleme
                    e.data.AMOUNT = parseFloat((e.data.PRICE * e.data.QUANTITY)).round(2)
                    e.data.TOTALHT = Number(((e.data.PRICE * e.data.QUANTITY) - e.data.DISCOUNT)).round(2)
                    e.data.TOTAL = Number((((e.data.PRICE * e.data.QUANTITY) - e.data.DISCOUNT) + e.data.VAT)).round(2)
                    e.data.DISCOUNT_RATE = Number(e.data.AMOUNT).rate2Num(e.data.DISCOUNT,4)
                    this.calculateTotal()
                }
            }
        ]}
        />
    )
}
```

### 5. POS Özel Hesaplama Sistemleri

#### Hızlı Fiyat Hesaplama
```javascript
async addItem(pData, pIndex, pQuantity, pPrice) {
    return new Promise(async resolve => {
        App.instance.setState({isExecute:true})
        
        // POS için optimized merge kontrolü
        let tmpMergDt = await this.mergeItem(pData.CODE)
        if(typeof tmpMergDt != 'undefined' && this.combineNew == false) {
            tmpMergDt[0].QUANTITY = tmpMergDt[0].QUANTITY + pQuantity
            tmpMergDt[0].SUB_QUANTITY = tmpMergDt[0].SUB_QUANTITY / tmpMergDt[0].SUB_FACTOR
            
            if(this.docObj.dt()[0].VAT_ZERO != 1) {
                tmpMergDt[0].VAT = Number((tmpMergDt[0].VAT + (tmpMergDt[0].PRICE * (tmpMergDt[0].VAT_RATE / 100) * pQuantity))).round(6)
            } else {
                tmpMergDt[0].VAT = 0
                tmpMergDt[0].VAT_RATE = 0
            }
            
            tmpMergDt[0].AMOUNT = Number((tmpMergDt[0].QUANTITY * tmpMergDt[0].PRICE)).round(4)
            tmpMergDt[0].TOTAL = Number((((tmpMergDt[0].QUANTITY * tmpMergDt[0].PRICE) - tmpMergDt[0].DISCOUNT) + tmpMergDt[0].VAT)).round(2)
            tmpMergDt[0].TOTALHT = Number((tmpMergDt[0].AMOUNT - tmpMergDt[0].DISCOUNT)).round(2)
            this.calculateTotal()
            
            // Bağlı ürün kontrolü
            await this.itemRelated(pData.GUID, tmpMergDt[0].QUANTITY)
            
            App.instance.setState({isExecute:false})
            resolve()
            return
        }
        
        // Yeni satır oluşturma (standart işlem)
        if(pIndex == null) {
            let tmpDocOrders = {...this.docObj.docOrders.empty}
            tmpDocOrders.DOC_GUID = this.docObj.dt()[0].GUID
            tmpDocOrders.TYPE = this.docObj.dt()[0].TYPE
            tmpDocOrders.DOC_TYPE = this.docObj.dt()[0].DOC_TYPE
            tmpDocOrders.LINE_NO = this.docObj.docOrders.dt().length
            tmpDocOrders.REF = this.docObj.dt()[0].REF
            tmpDocOrders.REF_NO = this.docObj.dt()[0].REF_NO
            tmpDocOrders.OUTPUT = this.docObj.dt()[0].OUTPUT
            tmpDocOrders.INPUT = this.docObj.dt()[0].INPUT
            tmpDocOrders.DOC_DATE = this.docObj.dt()[0].DOC_DATE
            this.docObj.docOrders.addEmpty(tmpDocOrders)
            pIndex = this.docObj.docOrders.dt().length - 1
        }
        
        // POS için optimize grup sorgusu
        let tmpGrpQuery = {
            query: "SELECT ORGINS,UNIT_SHORT," +
                   "ISNULL((SELECT TOP 1 FACTOR FROM ITEM_UNIT_VW_01 WHERE ITEM_UNIT_VW_01.ITEM_GUID = ITEMS_GRP_VW_01.GUID AND ITEM_UNIT_VW_01.TYPE = 1),1) AS SUB_FACTOR, " +
                   "ISNULL((SELECT TOP 1 SYMBOL FROM ITEM_UNIT_VW_01 WHERE ITEM_UNIT_VW_01.ITEM_GUID = ITEMS_GRP_VW_01.GUID AND ITEM_UNIT_VW_01.TYPE = 1),'') AS SUB_SYMBOL " +
                   "FROM ITEMS_GRP_VW_01 WHERE GUID = @GUID",
            param: ['GUID:string|50'],
            value: [pData.GUID]
        }
        let tmpGrpData = await this.core.sql.execute(tmpGrpQuery)
        
        if(tmpGrpData.result.recordset.length > 0) {
            this.docObj.docOrders.dt()[pIndex].ORIGIN = tmpGrpData.result.recordset[0].ORGINS
            this.docObj.docOrders.dt()[pIndex].SUB_FACTOR = tmpGrpData.result.recordset[0].SUB_FACTOR
            this.docObj.docOrders.dt()[pIndex].SUB_SYMBOL = tmpGrpData.result.recordset[0].SUB_SYMBOL
            this.docObj.docOrders.dt()[pIndex].UNIT_SHORT = tmpGrpData.result.recordset[0].UNIT_SHORT
        }
        
        // Ürün bilgilerini set et
        this.docObj.docOrders.dt()[pIndex].ITEM_CODE = pData.CODE
        this.docObj.docOrders.dt()[pIndex].ITEM = pData.GUID
        this.docObj.docOrders.dt()[pIndex].ITEM_BARCODE = pData.BARCODE
        this.docObj.docOrders.dt()[pIndex].VAT_RATE = pData.VAT
        this.docObj.docOrders.dt()[pIndex].ITEM_NAME = pData.NAME
        this.docObj.docOrders.dt()[pIndex].COST_PRICE = pData.COST_PRICE
        this.docObj.docOrders.dt()[pIndex].UNIT = pData.UNIT
        this.docObj.docOrders.dt()[pIndex].DISCOUNT = 0
        this.docObj.docOrders.dt()[pIndex].DISCOUNT_RATE = 0
        this.docObj.docOrders.dt()[pIndex].QUANTITY = pQuantity
        this.docObj.docOrders.dt()[pIndex].SUB_QUANTITY = pQuantity * this.docObj.docOrders.dt()[pIndex].SUB_FACTOR
        
        // POS için hızlı fiyat hesaplama
        if(typeof pPrice == 'undefined') {
            let tmpQuery = {
                query: "SELECT dbo.FN_PRICE(@GUID,@QUANTITY,dbo.GETDATE(),@CUSTOMER,@DEPOT,@PRICE_LIST_NO,0,0) AS PRICE",
                param: ['GUID:string|50','QUANTITY:float','CUSTOMER:string|50','DEPOT:string|50','PRICE_LIST_NO:int'],
                value: [pData.GUID, pQuantity, this.docObj.dt()[0].INPUT, this.cmbDepot.value, this.cmbPricingList.value]
            }
            let tmpData = await this.core.sql.execute(tmpQuery)
            
            if(tmpData.result.recordset.length > 0) {
                let tmpMargin = tmpData.result.recordset[0].PRICE - this.docObj.docOrders.dt()[pIndex].COST_PRICE
                let tmpMarginRate = ((tmpData.result.recordset[0].PRICE - this.docObj.docOrders.dt()[pIndex].COST_PRICE) - tmpData.result.recordset[0].PRICE) * 100
                
                this.docObj.docOrders.dt()[pIndex].MARGIN = tmpMargin.toFixed(2) + Number.money.sign + " / %" + tmpMarginRate.toFixed(2)
                this.docObj.docOrders.dt()[pIndex].PRICE = parseFloat((tmpData.result.recordset[0].PRICE).toFixed(4))
                this.docObj.docOrders.dt()[pIndex].VAT = parseFloat((tmpData.result.recordset[0].PRICE * (pData.VAT / 100) * pQuantity).toFixed(6))
                this.docObj.docOrders.dt()[pIndex].AMOUNT = parseFloat((tmpData.result.recordset[0].PRICE * pQuantity).toFixed(4))
                this.docObj.docOrders.dt()[pIndex].TOTAL = Number(((tmpData.result.recordset[0].PRICE * pQuantity) + this.docObj.docOrders.dt()[pIndex].VAT)).round(2)
                this.docObj.docOrders.dt()[pIndex].TOTALHT = Number((this.docObj.docOrders.dt()[pIndex].AMOUNT - this.docObj.docOrders.dt()[pIndex].DISCOUNT)).round(2)
                this.docObj.docOrders.dt()[pIndex].SUB_PRICE = Number(parseFloat((tmpData.result.recordset[0].PRICE).toFixed(4)) / this.docObj.docOrders.dt()[pIndex].SUB_FACTOR).round(2)
                this.calculateTotal()
            }
        } else {
            // Manuel fiyat ile ekleme
            this.docObj.docOrders.dt()[pIndex].PRICE = parseFloat((pPrice).toFixed(4))
            this.docObj.docOrders.dt()[pIndex].VAT = parseFloat((((pPrice * pQuantity) - this.docObj.docOrders.dt()[pIndex].DISCOUNT) * (this.docObj.docOrders.dt()[pIndex].VAT_RATE / 100)).toFixed(6))
            this.docObj.docOrders.dt()[pIndex].AMOUNT = parseFloat((pPrice * pQuantity)).round(2)
            this.docObj.docOrders.dt()[pIndex].TOTALHT = Number(((pPrice * pQuantity) - this.docObj.docOrders.dt()[pIndex].DISCOUNT)).round(2)
            this.docObj.docOrders.dt()[pIndex].TOTAL = Number((this.docObj.docOrders.dt()[pIndex].TOTALHT + this.docObj.docOrders.dt()[pIndex].VAT)).round(2)
            this.calculateTotal()
        }
        
        // KDV sıfır kontrolü
        if(this.docObj.dt()[0].VAT_ZERO == 1) {
            this.docObj.docOrders.dt()[pIndex].VAT = 0
            this.docObj.docOrders.dt()[pIndex].VAT_RATE = 0
        }
        
        // Bağlı ürün kontrolü
        await this.itemRelated(pData.GUID, pQuantity)
        
        App.instance.setState({isExecute:false})
        resolve()
    })
}
```

## POS Kullanım Senaryoları

### Senaryo 1: Hızlı Barkod Satışı
```javascript
// 1. Müşteri ve depo hazır
this.txtCustomerCode.value = "WALK-IN"
this.cmbDepot.value = "POS-DEPOT"

// 2. Barkod okutma
this.txtBarcode.value = "1234567890123"
// Enter tuşu ile otomatik ekleme

// 3. Miktar değişikliği (isteğe bağlı)
// Grid'de quantity hücresine tıklayıp değiştir

// 4. Hızlı kaydet
await this.docObj.save()
```

### Senaryo 2: Tartılı Ürün Satışı
```javascript
// Özel barkod formatı: 201234012550
// 20: Prefix, 1234: Ürün kodu, 01: TL, 25: Kuruş, 50: Check digit
let barcode = "201234012550"
let pattern = this.getBarPattern(barcode)

// Sonuç:
// pattern.barcode = "201234..."
// pattern.price = 1.25
// pattern.quantity = 0 (tartılı ürünler için genelde 1)

await this.addItem(productData, null, 1, pattern.price)
```

### Senaryo 3: Toplu İndirim İşlemi
```javascript
// Grid'de indirim hücresine tıkla
// Çoklu indirim popup'ı açılır
this.txtDiscount1.value = 5.00  // 1. İndirim
this.txtDiscount2.value = 2.00  // 2. İndirim
this.txtDiscount3.value = 1.00  // 3. İndirim
// Toplam indirim: 8.00

// Otomatik hesaplama yapılır
// KDV yeniden hesaplanır
```

### Senaryo 4: Birim Değişimi
```javascript
// Quantity hücresindeki "more" butonuna tıkla
// Birim değişim popup'ı açılır
this.cmbUnit.value = "KG"
this.txtUnitFactor.value = 1000  // 1 KG = 1000 gram
this.txtUnitPrice.value = 12.50  // KG fiyatı
this.txtTotalQuantity.value = 2.5 // 2.5 KG

// Hesaplama:
// Adet miktarı: 2.5 * 1000 = 2500 gram
// Birim fiyat: 12.50 / 1000 = 0.0125 TL/gram
```

## POS Performance Optimizasyonları

### 1. Hızlı Grid Güncellemeleri
```javascript
// Batch update kullanımı
this.grdSlsOrder.devGrid.beginUpdate()
// Çoklu işlemler
this.grdSlsOrder.devGrid.endUpdate()

// Lazy loading
if(this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true) {
    // Sayfalama aktif
} else {
    // Infinite scroll
}
```

### 2. Cache Mekanizması
```javascript
// Frequently used data cache
this.itemCache = new Map()
this.customerCache = new Map()
this.priceCache = new Map()

// Cache kullanımı
if(this.itemCache.has(itemCode)) {
    return this.itemCache.get(itemCode)
} else {
    let result = await this.getItemFromDB(itemCode)
    this.itemCache.set(itemCode, result)
    return result
}
```

### 3. Keyboard Shortcuts
```javascript
// POS için hızlı tuşlar
onKeyDown={async(k) => {
    switch(k.event.key) {
        case 'F1': // Yeni sipariş
            await this.init()
            break
        case 'F2': // Kaydet
            await this.save()
            break
        case 'F3': // Yazdır
            await this.print()
            break
        case 'F4': // Müşteri seç
            await this.selectCustomer()
            break
        case 'F10': // Ürün ara
            await this.searchItem()
            break
    }
}}
```

## POS Özel Validasyonlar

### 1. Hızlı Validasyon
```javascript
// POS için basitleştirilmiş validasyon
validatePOSOrder() {
    if(this.docObj.docOrders.dt().length == 0) {
        this.toast.show({message: "En az bir ürün eklenmelidir", type:'warning'})
        return false
    }
    
    if(this.cmbDepot.value == '') {
        this.toast.show({message: "Depo seçimi zorunludur", type:'warning'})
        return false
    }
    
    return true
}
```

### 2. Otomatik Düzeltmeler
```javascript
// Müşteri yoksa varsayılan müşteri ata
if(this.txtCustomerCode.value == '') {
    this.txtCustomerCode.value = this.sysParam.filter({ID:'defaultPOSCustomer'}).getValue()
}

// Fiyat listesi yoksa varsayılan ata
if(this.cmbPricingList.value == '') {
    this.cmbPricingList.value = 1 // Varsayılan fiyat listesi
}
```

## POS Raporlama

### 1. Günlük Satış Raporu
```javascript
getDailySalesReport() {
    let tmpQuery = {
        query: "SELECT SUM(TOTAL) AS DAILY_TOTAL, COUNT(*) AS ORDER_COUNT " +
               "FROM DOC WHERE DOC_TYPE = 62 AND " +
               "CONVERT(DATE, DOC_DATE) = CONVERT(DATE, GETDATE())",
        param: [],
        value: []
    }
    return this.core.sql.execute(tmpQuery)
}
```

### 2. Ürün Satış Analizi
```javascript
getItemSalesAnalysis() {
    let tmpQuery = {
        query: "SELECT ITEM_CODE, ITEM_NAME, SUM(QUANTITY) AS TOTAL_QTY, " +
               "SUM(TOTAL) AS TOTAL_AMOUNT " +
               "FROM DOC_ORDERS_VW_01 WHERE DOC_TYPE = 62 AND " +
               "CONVERT(DATE, DOC_DATE) = CONVERT(DATE, GETDATE()) " +
               "GROUP BY ITEM_CODE, ITEM_NAME " +
               "ORDER BY TOTAL_AMOUNT DESC",
        param: [],
        value: []
    }
    return this.core.sql.execute(tmpQuery)
}
```

## Sık Karşılaşılan POS Sorunları

### Problem 1: Barkod Okumama
**Sebep**: Barkod formatı tanınmıyor
**Çözüm**:
```javascript
// Barkod pattern'ini kontrol et
let patterns = this.sysParam.filter({ID:'BarcodePattern',TYPE:0}).getValue()
console.log('Available patterns:', patterns)

// Manuel barkod girişi dene
this.txtBarcode.value = "test123"
```

### Problem 2: Fiyat Hesaplanmıyor
**Sebep**: Fiyat listesi veya müşteri ayarı yok
**Çözüm**:
```javascript
// Varsayılan değerleri kontrol et
if(this.cmbPricingList.value == '') {
    this.cmbPricingList.value = 1
}
if(this.txtCustomerCode.value == '') {
    this.txtCustomerCode.value = this.sysParam.filter({ID:'defaultCustomer'}).getValue()
}
```

### Problem 3: Grid Donması
**Sebep**: Çok fazla veri yüklü
**Çözüm**:
```javascript
// Sayfalama aktif et
this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).setValue(true)

// Veya infinite scroll kullan
<Scrolling mode="infinite" />
```

### Problem 4: Performans Sorunu
**Sebep**: Gereksiz hesaplamalar
**Çözüm**:
```javascript
// Batch operations kullan
this.grid.devGrid.beginUpdate()
// Tüm operations
this.grid.devGrid.endUpdate()

// Cache kullan
if(!this.priceCache.has(key)) {
    this.priceCache.set(key, calculatedPrice)
}
```

Bu dokümantasyon, `posSalesOrder.js` modülünün POS'a özel tüm özelliklerini ve optimizasyonlarını kapsamlı bir şekilde açıklar. Hızlı satış süreçleri için gerekli tüm bilgileri içerir. 