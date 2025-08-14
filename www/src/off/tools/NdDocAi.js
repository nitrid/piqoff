import moment from 'moment';

import React from "react";
import Base from '../../core/react/devex/base.js';
import App from "../lib/app";
import Form, { Label, Item, EmptyItem } from 'devextreme-react/form';
import FileUploader from 'devextreme-react/file-uploader';

import NdPopUp from '../../core/react/devex/popup.js';
import NdButton from "../../core/react/devex/button";
import NdGrid,{ Column, Editing, Paging, Pager, KeyboardNavigation, Scrolling, Button } from '../../core/react/devex/grid';
import NdDialog, { dialog } from '../../core/react/devex/dialog.js';
import NdTextBox from '../../core/react/devex/textbox.js'
import NdDatePicker from '../../core/react/devex/datepicker.js';
import NdPopGrid from '../../core/react/devex/popgrid.js';

export default class NdDocAi extends Base
{
    constructor(props)
    {
        super(props)
        this.core = this.props.parent.core
        this.files = []
        this.importData = undefined
        this.customer = '00000000-0000-0000-0000-000000000000'
        this.cellRoleRender = this.cellRoleRender.bind(this)
        this.state.container = typeof props.container == 'undefined' ? '#root' : props.container
        this.state.position = typeof props.position == 'undefined' ? {of:'#root'} : props.position

    }
    async show(pCustomer)
    {
        this.customer = pCustomer
        this.popDocAi.show()
    }
    getValue(pData,pType)
    {
        let tmpValue = undefined
        if(typeof pData != 'undefined' && pType != 'price')
        {
            if(typeof pData.content != 'undefined')
            {
                tmpValue = pType == 'string' ? pData.content : this.parseNumber(pData.content)
            }
            else if(typeof pData.value != 'undefined')
            {
                tmpValue = pType == 'string' ? pData.value : this.parseNumber(pData.value)
            }
            if(typeof pData.value != 'undefined' && typeof pData.value.amount != 'undefined')
            {
                tmpValue = this.parseNumber(pData.value.amount)
            }

            if(typeof pData.kind != 'undefined' && pData.kind == 'number' && (typeof pType != 'undefined' && pType != 'string'))
            {
                tmpValue = Number(typeof tmpValue == 'undefined' || tmpValue == '' ? 0 : tmpValue)
            } 
        }
        else if(typeof pData != 'undefined' && pType == 'price')
        {
            if(typeof pData.content != 'undefined')
            {
                tmpValue = pType == 'string' ? pData.content : this.parseNumber(pData.content)

                if(typeof tmpValue == 'string' && tmpValue.includes(':'))
                {
                    tmpValue = pType == 'string' ? pData.value : this.parseNumber(pData.value)
                }
            }
            else if(typeof pData.value != 'undefined')
            {
                tmpValue = pType == 'string' ? pData.value : this.parseNumber(pData.value)
            }
        }
        return tmpValue
    }
    cellRoleRender(e)
    {
        if(e.column.dataField == "ItemCode")
        {
            return (
                <NdTextBox id={"txtGrdItemsCode"+e.rowIndex} parent={this} simple={true} 
                upper={true}
                value={e.value}
                onValueChanged={(v)=>
                {
                    e.value = v.value
                }}
                button=
                {
                    [
                        {
                            id:'01',
                            icon:'more',
                            onClick:async()  =>
                            {
                                this.pg_txtItemsCode.show()
                                this.pg_txtItemsCode.onClick = (data) =>
                                {
                                    e.key.ItemCode = data[0].CODE  
                                    e.key.ItemCost = data[0].COST_PRICE  
                                    e.key.ItemGuid = data[0].GUID  
                                    e.key.ItemName = data[0].NAME  
                                    e.key.ItemType = data[0].ITEM_TYPE  
                                    e.key.ItemUnit = data[0].UNIT
                                    e.key.ItemVat = data[0].VAT
                                    e.key.ItemTotal = Number((e.key.Quantity * e.key.UnitPrice) -((e.key.Quantity * e.key.UnitPrice) * (e.key.DiscountRate / 100))).round(2)
                                    this.grdList.devGrid.refresh(true)
                                    this.grdList.devGrid.repaint()
                                    this.txtRealHT.value = this.grdList.data.datatable.sum('ItemTotal')
                                }
                            }
                        },
                    ]
                }
                >  
                </NdTextBox>
            )
        }
    }    
    parseNumber(value) 
    {
        if(typeof value == 'undefined')
        {
            return value
        }

        if (!isNaN(value)) 
        {
            return Number(value);
        }

        value = value.replaceAll('€', '').replaceAll(/\s/g, '');
        value = value.replaceAll(',', '.');
    
        if (!isNaN(value)) 
        {
            return Number(value);
        }

        return value;
    }
    async getDoc(pData)
    {
        this.importData = undefined
        App.instance.loading.show()
        
        pData.VendorTaxId = typeof pData.VendorTaxId != 'undefined' ? pData.VendorTaxId.replaceAll(' ','') : ''
        pData.InvoiceDate = typeof pData.InvoiceDate != 'undefined' ? moment(pData.InvoiceDate) : moment(new Date())
        pData.DueDate = typeof pData.DueDate != 'undefined' ? moment(pData.DueDate) : moment(new Date())

        this.txtTaxId.value = pData.VendorTaxId
        this.dtDocDate.value = pData.InvoiceDate
        this.dtShipDate.value = pData.DueDate
        this.txtHT.value = typeof pData.HT != 'undefined' ? pData.HT : 0
        this.txtTax.value = typeof pData.VAT != 'undefined' ? pData.VAT : 0
        this.txtTTC.value = typeof pData.TTC != 'undefined' ? pData.TTC : 0

        let tmpCustomer = await this.getCustomer(this.txtTaxId.value)

        if(typeof tmpCustomer != 'undefined')
        {
            pData.CustomerCode = tmpCustomer.CODE
            pData.CustomerName = tmpCustomer.TITLE
            pData.CustomerGuid = tmpCustomer.GUID
            pData.CustomerVatZero = tmpCustomer.VAT_ZERO
            pData.CustomerTaxNo = tmpCustomer.TAX_NO
        }
        else
        {
            pData.CustomerCode = ''
            pData.CustomerName = ''
            pData.CustomerGuid = '00000000-0000-0000-0000-000000000000'
            pData.CustomerVatZero = 0
            pData.CustomerTaxNo = ''
        }
        this.txtTaxId.value = pData.CustomerTaxNo
        this.txtCustomerName.value = pData.CustomerName

        if(pData.CustomerGuid != '00000000-0000-0000-0000-000000000000')
        {
            pData.Items = []

            for (let i = 0; i < pData.Item.length; i++) 
            {
                pData.Items.push({...pData.Item[i]})
                pData.Item[i].ProductCode = this.getValue(pData.Item[i].ProductCode,'string')
                pData.Item[i].Description = this.getValue(pData.Item[i].Description,'string')

                if(typeof this.getValue(pData.Item[i].Quantity) == 'undefined' || this.getValue(pData.Item[i].Quantity) == 0)
                {
                    if(typeof this.getValue(pData.Item[i].ColisInQty) != 'undefined' && typeof this.getValue(pData.Item[i].ColisQty) != 'undefined')
                    {
                        pData.Item[i].Quantity = this.getValue(pData.Item[i].ColisInQty) * this.getValue(pData.Item[i].ColisQty)
                    }
                    else
                    {
                        pData.Item[i].Quantity = 0
                    }
                }
                else
                {
                    pData.Item[i].Quantity = this.getValue(pData.Item[i].Quantity)
                }
                
                pData.Item[i].Vat = typeof this.getValue(pData.Item[i].Tax) == 'undefined' ? 0 : this.getValue(pData.Item[i].Tax)
                pData.Item[i].Amount = typeof this.getValue(pData.Item[i].Amount) == 'undefined' ? 0 : this.getValue(pData.Item[i].Amount)
                pData.Item[i].UnitPrice = typeof this.getValue(pData.Item[i].UnitPrice,'price') == 'undefined' ? 0 : Number(this.getValue(pData.Item[i].UnitPrice,'price')).round(5) //typeof pData.Item[i].UnitPrice == 'undefined' ? 0 : Number(pData.Item[i].Amount / pData.Item[i].Quantity).round(5)
                pData.Item[i].Unit = typeof this.getValue(pData.Item[i].Unit) == 'undefined' ? '' : this.getValue(pData.Item[i].Unit) //typeof pData.Item[i].Unit == 'undefined' ? '' : pData.Item[i].Unit
                pData.Item[i].DiscountRate = typeof this.getValue(pData.Item[i].DiscountRate,'string') == 'undefined' ? 0 : this.getValue(pData.Item[i].DiscountRate,'string')
                
                if(typeof pData.Item[i].DiscountRate == 'string')
                {
                    pData.Item[i].DiscountRate = parseFloat(pData.Item[i].DiscountRate.replace("%", "").trim());
                }
                
                let tmpItem = await this.getItem(pData.Item[i].ProductCode,pData.CustomerGuid)
                
                if(typeof tmpItem != 'undefined')
                {
                    pData.Item[i].ItemCode = tmpItem.ITEM_CODE
                    pData.Item[i].ItemName = tmpItem.ITEM_NAME
                    pData.Item[i].Discount = 0
                    pData.Item[i].ItemGuid = tmpItem.ITEM_GUID
                    pData.Item[i].ItemType = tmpItem.ITEM_TYPE
                    pData.Item[i].ItemUnit = tmpItem.UNIT
                    pData.Item[i].ItemCost = tmpItem.COST_PRICE
                    pData.Item[i].ItemVat = tmpItem.VAT
                    pData.Item[i].ItemTotal = Number((pData.Item[i].Quantity * pData.Item[i].UnitPrice) - ((pData.Item[i].Quantity * pData.Item[i].UnitPrice) * (pData.Item[i].DiscountRate / 100))).round(2)
                }
                else
                {
                    pData.Item[i].ItemCode = ''
                    pData.Item[i].ItemName = typeof pData.Item[i].Description == 'undefined' ? '' : pData.Item[i].Description
                    pData.Item[i].Discount = 0
                    pData.Item[i].ItemGuid = '00000000-0000-0000-0000-000000000000'
                    pData.Item[i].ItemType = 0
                    pData.Item[i].ItemUnit = '00000000-0000-0000-0000-000000000000'
                    pData.Item[i].ItemCost = 0
                    pData.Item[i].ItemVat = 0
                    pData.Item[i].ItemTotal = 0
                }
            }
            
            pData.Item.forEach(item => 
            {
                this.txtRealHT.value = Number(this.txtRealHT.value) + Number(item.ItemTotal)
            })

            pData.Item = pData.Item.filter(item => typeof item.ProductCode === "string" && item.ProductCode.trim() !== "");
            await this.grdList.dataRefresh({source:pData.Item});
            this.importData = pData    
        }
        else
        {
            let tmpConfObj =
            {
                id:'msgCustomerNotFound',showTitle:true,title:this.lang.t("popDocAi.msgCustomerNotFound.title"),showCloseButton:true,width:'500px',height:'auto',
                button:[{id:"btn01",caption:this.lang.t("popDocAi.msgCustomerNotFound.btn01"),location:'after'}],
                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("popDocAi.msgCustomerNotFound.msg")}</div>)
            }

            await dialog(tmpConfObj);
        }
        App.instance.loading.hide()
    }
    getCustomer(pVatId)
    {
        return new Promise(async resolve => 
        {
            let tmpQuery = undefined

            if(this.customer != '' && this.customer != '00000000-0000-0000-0000-000000000000')
            {
                tmpQuery = 
                {
                    query : "SELECT GUID,CODE,TITLE,VAT_ZERO,TAX_NO FROM CUSTOMER_VW_01 WHERE GUID = @GUID",
                    param : ['GUID:string|50'],
                    value : [this.customer]
                }
            }
            else
            {
                tmpQuery = 
                {
                    query : "SELECT GUID,CODE,TITLE,VAT_ZERO,TAX_NO FROM CUSTOMER_VW_01 WHERE TAX_NO = @TAX_NO",
                    param : ['TAX_NO:string|100'],
                    value : [pVatId]
                }
            }

            let tmpData = await this.core.sql.execute(tmpQuery)

            if(tmpData.result.recordset.length > 0)
            {
                resolve(tmpData.result.recordset[0])
                return
            }
            resolve()
        })
    }
    getItem(pItem,pCustomer)
    {
        return new Promise(async resolve => 
        {
            if(typeof pItem != 'undefined')
            {
                let tmpQuery = 
                {
                    query : "SELECT " +
                            "ITEM_MULTICODE.ITEM_GUID AS ITEM_GUID, " +
                            "ITEM_MULTICODE.ITEM_CODE AS ITEM_CODE, " +
                            "ITEM_MULTICODE.ITEM_NAME AS ITEM_NAME, " +
                            "0 AS ITEM_TYPE, " +
                            "ITEMS.UNIT AS UNIT, " +
                            "ITEMS.COST_PRICE AS COST_PRICE, " +
                            "ITEMS.VAT AS VAT " +
                            "FROM ITEM_MULTICODE_VW_01 AS ITEM_MULTICODE " +
                            "INNER JOIN ITEMS_VW_01 AS ITEMS ON " +
                            "ITEMS.CODE = ITEM_MULTICODE.ITEM_CODE " +
                            "WHERE MULTICODE = @MULTICODE AND CUSTOMER_GUID = @CUSTOMER_GUID AND STATUS = '1' "  ,
                    param : ['MULTICODE:string|25','CUSTOMER_GUID:string|50'],
                    value : [pItem,pCustomer]
                }

                let tmpData = await this.core.sql.execute(tmpQuery)
                
                if(typeof tmpData.result.err == 'undefined')
                {
                    if(tmpData.result.recordset.length > 0)
                    {
                        resolve(tmpData.result.recordset[0])
                        return
                    }
                    else
                    {
                        // MULTICODE ile bulunamadıysa, barkod ile sorgula
                        let barcodeQuery = 
                        {
                        query :	"SELECT " +
                                "ITEMS.GUID AS ITEM_GUID, " +
                                "ITEMS.CODE AS ITEM_CODE, " +
                                "ITEMS.NAME AS ITEM_NAME, " +
                                "0 AS ITEM_TYPE, " +
                                "ITEMS.UNIT_GUID AS UNIT, " +
                                "ITEMS.COST_PRICE AS COST_PRICE, " +
                                "ITEMS.VAT AS VAT " +
                                "FROM ITEMS_BARCODE_MULTICODE_VW_01 AS ITEMS " +
                                "WHERE BARCODE = @BARCODE AND STATUS = 1  ",
                        param : ['BARCODE:string|25'],      
                        value : [pItem]
                        }
                    
                        let barcodeData = await this.core.sql.execute(barcodeQuery)
                        
                        if(typeof barcodeData.result.err == 'undefined')
                        {
                            if(barcodeData.result.recordset.length > 0)
                            {
                                resolve(barcodeData.result.recordset[0])
                                return
                            }
                        }
                    }
                }
                else
                {
                    console.log(tmpData.result.err)
                }
            }
            resolve()
        })
    }
    sum(pArr,pField)
    {
        let tmpVal = 0;

        tmpVal = pArr.reduce((a,b) =>
        {
            return {[pField] : Number(a[pField]) + Number(b[pField])}
        },{[pField]:0})[pField]

        tmpVal = Number(tmpVal).round(2);
        tmpVal = tmpVal.toFixed(2)
        
        return tmpVal;
    }
    multiCodeAdd(pData)
    {
        return new Promise(async resolve => 
        {
            let isMsg = false

            for(let i = 0; i < pData.Item.length; i++)
            {
                let item = pData.Item[i]
                
                if(item.ItemGuid != '00000000-0000-0000-0000-000000000000')
                {
                    let tmpQuery = 
                    {
                        query : `SELECT TOP 1 CODE FROM ITEM_MULTICODE WHERE ITEM = @ITEM AND CUSTOMER = @CUSTOMER AND CODE = @CODE AND DELETED = 0`,
                        param : ['ITEM:string|50','CUSTOMER:string|50','CODE:string|25'],
                        value : [item.ItemGuid,this.importData.CustomerGuid,item.ProductCode]
                    }
    
                    let tmpData = await this.core.sql.execute(tmpQuery)
                    
                    if(tmpData.result.recordset.length == 0)
                    {
                        if(!isMsg)
                        {
                            isMsg = true
    
                            let tmpConfObj =
                            {
                                id:'msgMultiCodeAdd',showTitle:true,title:this.lang.t("popDocAi.msgMultiCodeAdd.title"),showCloseButton:true,width:'500px',height:'auto',
                                button:[{id:"btn01",caption:this.lang.t("popDocAi.msgMultiCodeAdd.btn01"),location:'before'},{id:"btn02",caption:this.lang.t("popDocAi.msgMultiCodeAdd.btn02"),location:'after'}],
                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("popDocAi.msgMultiCodeAdd.msg")}</div>)
                            }
    
                            let tmpResult = await dialog(tmpConfObj);
                            
                            if(tmpResult == 'btn02')
                            {
                                resolve()
                                return
                            }
                        }
    
                        let tmpQueryInsert =
                        {
                            query : `EXEC [dbo].[PRD_ITEM_MULTICODE_INSERT] @CUSER = @PCUSER, @ITEM = @PITEM, @CUSTOMER = @PCUSTOMER, @CODE = @PCODE`,
                            param : ['PCUSER:string|25','PITEM:string|50','PCUSTOMER:string|50','PCODE:string|25'],
                            value : [this.core.auth.data.CODE,item.ItemGuid,this.importData.CustomerGuid,item.ProductCode]
                        }
                        await this.core.sql.execute(tmpQueryInsert)
    
                        let tmpQueryPriceInsert =
                        {
                            query : `EXEC [dbo].[PRD_ITEM_PRICE_INSERT] @CUSER = @PCUSER, @ITEM = @PITEM, @CUSTOMER = @PCUSTOMER, @TYPE = @PTYPE, @PRICE = @PPRICE, @QUANTITY = @PQUANTITY`,
                            param : ['PCUSER:string|25','PITEM:string|50','PCUSTOMER:string|50','PTYPE:string|25','PPRICE:string|25','PQUANTITY:string|25'],
                            value : [this.core.auth.data.CODE,item.ItemGuid,this.importData.CustomerGuid,'1',item.UnitPrice,1]
                        }
                        await this.core.sql.execute(tmpQueryPriceInsert)
                    }
                }
            }
            resolve()
        })
        
    }
    openItem(pData)
    {
        App.instance.menuClick(
        {
            id: 'stk_01_001',
            text: pData.ProductCode,
            path: 'items/cards/itemCard.js',
            pagePrm:
            {
                PRM_TYPE:'new',
                CODE:pData.ItemCode,
                NAME:pData.ItemName,
                CUSTOMER_ITEM_CODE:pData.ProductCode,
                CUSTOMER_GUID :this.importData.CustomerGuid,
                CUSTOMER_CODE:this.importData.CustomerCode,
                CUSTOMER_NAME:this.importData.CustomerName,
                COST_PRICE:pData.UnitPrice,
                VAT:pData.Vat,
            }
        })
    }
    async refreshItem(pData)
    {
        let tmpItem = await this.getItem(pData.ProductCode,this.importData.CustomerGuid)

        if(typeof tmpItem != 'undefined')
        {
            pData.ItemCode = tmpItem.ITEM_CODE  
            pData.ItemCost = tmpItem.COST_PRICE  
            pData.ItemGuid = tmpItem.ITEM_GUID  
            pData.ItemName = tmpItem.ITEM_NAME  
            pData.ItemType = tmpItem.ITEM_TYPE  
            pData.ItemUnit = tmpItem.UNIT
            pData.ItemVat = tmpItem.VAT
            pData.ItemTotal = Number((pData.Quantity * pData.UnitPrice) -((pData.Quantity * pData.UnitPrice) * (pData.DiscountRate / 100))).round(2)
            this.grdList.devGrid.refresh(true)
            this.grdList.devGrid.repaint()
            this.txtRealHT.value = this.grdList.data.datatable.sum('ItemTotal')
        }
    }
    render()
    {
        return(
            <div>
            <NdPopUp parent={this} id={"popDocAi"} 
            visible={false}
            showCloseButton={true}
            showTitle={true}
            title={this.lang.t("popDocAi.title")}
            container={this.state.container} 
            width={'100%'}
            height={'100%'}
            position={this.state.position}
            deferRendering={true}
            onHiding={()=>
            {
                this.importData = undefined
            }}
            >
                <Form colCount={1} height={'fit-content'}>
                    <Item>
                        <div className="mb-3">
                            <label className="form-label">Allowed file extensions: .jpg, .jpeg, .gif, .png, .pdf</label>
                            <input className="form-control" type="file" multiple onChange={async(e)=>
                            {
                                e.preventDefault();
                                this.files = [];
                                if (e.target.files) 
                                {
                                    this.files = e.target.files
                                }
                            }}/>
                        </div>
                    </Item>
                    <Item>
                        <NdButton id="btnUpload" parent={this} text={this.lang.t('popDocAi.btnUpload')} type="default" width={'100%'}
                        onClick={async()=>
                        {
                            if (this.files.length > 0)
                            {
                                const formData = new FormData();
                                formData.append('file', this.files[0]);
                                App.instance.loading.show()
                                fetch('https://docai-gqgud5cga6f2bzb8.francecentral-01.azurewebsites.net/docai', 
                                {
                                    method: 'POST',
                                    body: formData
                                })
                                .then(response => 
                                {
                                    App.instance.loading.hide()
                                    if (!response.ok) 
                                    {
                                        throw new Error('Dosya yükleme başarısız. HTTP Hata: ' + response.status);
                                    }
                                    return response.json();
                                })
                                .then(data => 
                                {
                                    App.instance.loading.hide()
                                    if(data.success)
                                    {
                                        this.getDoc(data.result)
                                    }
                                    else
                                    {
                                        console.log(data.message, typeof data.error == 'undefined' ? '' : data.error)
                                    }
                                })
                                .catch(error => 
                                {
                                    App.instance.loading.hide()
                                    console.error('Hata:', error.message);
                                });
                            }
                        }}/>
                    </Item>
                    <Item>
                        <div className="row">
                            <div className="col-6">
                                <NdTextBox id="txtTaxId" parent={this} title={this.lang.t("popDocAi.txtTaxId") + ":"} readOnly={true}/>
                            </div>
                            <div className="col-6">
                                <NdTextBox id="txtCustomerName" parent={this} title={this.lang.t("popDocAi.txtCustomerName") + ":"} readOnly={true}/>
                            </div>
                        </div>
                    </Item>
                    <Item>
                        <div className="row">
                            <div className="col-6">
                                <NdDatePicker parent={this} id={"dtDocDate"} title={this.lang.t("popDocAi.dtDocDate") + ":"} readOnly={true}/>
                            </div>
                            <div className="col-6">
                                <NdDatePicker parent={this} id={"dtShipDate"} title={this.lang.t("popDocAi.dtShipDate") + ":"} readOnly={true}/>
                            </div>
                        </div>
                    </Item>
                    <Item>
                        <div className='row'>
                            <div className='col-12'>
                                <NdGrid parent={this} id={"grdList"} 
                                showBorders={true} 
                                columnsAutoWidth={true} 
                                allowColumnReordering={true} 
                                allowColumnResizing={true} 
                                headerFilter={{visible:false}}
                                height={'400'} 
                                width={'100%'}
                                dbApply={false}
                                sorting={{mode:'none'}}
                                loadPanel={{enabled:true}}
                                onCellPrepared={(e) =>
                                {
                                    if(e.rowType === "data" && e.column.dataField === "ItemCode" && e.data.ItemCode == '')
                                    {
                                        e.cellElement.style.backgroundColor = "red"
                                    }
                                   
                                    if(e.rowType === "data" && e.column.dataField === "ItemName" && e.data.ItemCode == '')
                                    {
                                        e.cellElement.style.backgroundColor = "red"
                                    }
                                    if(e.rowType === "data" && e.column.dataField === "Quantity" && e.data.Quantity == 0)
                                    {
                                        e.cellElement.style.backgroundColor = "red"
                                    }
                                    if(e.rowType === "data" && e.column.dataField === "UnitPrice" && e.data.UnitPrice == 0)
                                    {
                                        e.cellElement.style.backgroundColor = "red"
                                    }
                                    if(e.rowType === "data" && e.column.dataField === "Amount" && e.data.Amount == 0)
                                    {
                                        e.cellElement.style.backgroundColor = "red"
                                    }
                                    if(e.rowType === "data" && e.column.dataField === "ItemVat" && e.data.Vat != e.data.ItemVat)
                                    {
                                        e.cellElement.style.backgroundColor = "red"
                                    }
                                    if(e.rowType === "data" && e.column.dataField === "Amount" && e.data.ItemTotal != e.data.Amount)
                                    {
                                        e.cellElement.style.backgroundColor = "red"
                                    }
                                }}
                                onEditorPreparing={(e)=>
                                {
                                    if(e.dataField == 'Quantity')
                                    {
                                        e.editorOptions.onValueChanged = (c) =>
                                        {
                                            e.row.data.Quantity = c.value
                                            e.row.data.ItemTotal = Number((c.value * e.row.data.UnitPrice) - ((c.value * e.row.data.UnitPrice) * (e.row.data.DiscountRate / 100))).round(2)
                                            this.txtRealHT.value = this.grdList.data.datatable.sum('ItemTotal')
                                        }
                                    }
                                    if(e.dataField == 'UnitPrice')
                                    {
                                        e.editorOptions.onValueChanged = (c) =>
                                        {
                                            e.row.data.UnitPrice = c.value
                                            e.row.data.ItemTotal = Number((c.value * e.row.data.Quantity) - ((c.value * e.row.data.Quantity) * (e.row.data.DiscountRate / 100))).round(2)
                                            this.txtRealHT.value = this.grdList.data.datatable.sum('ItemTotal')
                                        }
                                    }
                                    if(e.dataField == 'DiscountRate')
                                    {
                                        e.editorOptions.onValueChanged = (c) =>
                                        {
                                            e.row.data.DiscountRate = c.value
                                            e.row.data.ItemTotal = Number((e.row.data.Quantity * e.row.data.UnitPrice) - ((e.row.data.Quantity * e.row.data.UnitPrice) * (c.value / 100))).round(2)
                                            this.txtRealHT.value = this.grdList.data.datatable.sum('ItemTotal')
                                        }
                                    }
                                }}
                                >
                                    <KeyboardNavigation editOnKeyPress={true} enterKeyAction={'moveFocus'} enterKeyDirection={'column'} />
                                    <Paging defaultPageSize={10} />
                                    <Pager visible={true} allowedPageSizes={[5,10,20,50,100]} showPageSizeSelector={true} />
                                    <Scrolling mode="standart" />
                                    <Editing mode="cell" allowUpdating={true} allowDeleting={false} confirmDelete={false}/>
                                    <Column dataField="ItemCode" caption={this.lang.t("popDocAi.clmItemCode")} allowEditing={true} width={120} editCellRender={this.cellRoleRender} allowHeaderFiltering={false}/>
                                    <Column dataField="ProductCode" caption={this.lang.t("popDocAi.clmMulticode")} allowEditing={false} width={120} allowHeaderFiltering={false}/>
                                    <Column dataField="ItemName" caption={this.lang.t("popDocAi.clmItemName")} allowEditing={false} width={350} allowHeaderFiltering={false}/>
                                    <Column dataField="Quantity" caption={this.lang.t("popDocAi.clmQuantity")}  width={70} dataType={'number'}/>
                                    <Column dataField="UnitPrice" caption={this.lang.t("popDocAi.clmPrice")} width={70} dataType={'number'} format={{ style: "currency", currency: Number.money.code,precision: 3}}/>
                                    <Column dataField="DiscountRate" caption={this.lang.t("popDocAi.clmDiscount") + ' %'} dataType={'number'} width={70} allowHeaderFiltering={false}/>
                                    <Column dataField="ItemVat" caption={this.lang.t("popDocAi.clmVat")} dataType={'number'} width={100} allowHeaderFiltering={false} allowEditing={true}
                                    cellRender={(e)=>
                                    {
                                        return Number(e.data.Vat).round(2) + '%' + ' / ' + Number(e.data.ItemVat).round(2) + '%'
                                    }}/>
                                    <Column dataField="Amount" caption={this.lang.t("popDocAi.clmAmount")} allowEditing={false} width={80} allowHeaderFiltering={false} alignment={'right'}
                                    cellRender={(e)=>
                                    {
                                        return Number(e.data.Amount).round(2).toFixed(2) + ' / ' + Number(e.data.ItemTotal).round(2).toFixed(2)
                                    }}
                                    />
                                    <Column type="buttons" width={70}>
                                        <Button hint="Add Item" icon="inserttable" onClick={(e) => this.openItem(e.row.data)} />
                                        <Button hint="Refresh" icon="refresh" onClick={(e) => this.refreshItem(e.row.data)} />
                                    </Column>
                                </NdGrid>
                            </div>
                        </div>
                    </Item>
                    <Item>
                        <div className="row pb-2">
                            <div className="col-4">
                                <NdTextBox id="txtRealHT" parent={this} title={this.lang.t("popDocAi.txtRealHT") + ":"} readOnly={true}/>
                            </div>
                            <div className="col-4 offset-4">
                                <NdTextBox id="txtHT" parent={this} title={this.lang.t("popDocAi.txtHT") + ":"} readOnly={true}/>
                            </div>
                        </div>
                        <div className="row pb-2">
                            <div className="col-4 offset-8">
                                <NdTextBox id="txtTax" parent={this} title={this.lang.t("popDocAi.txtTax") + ":"} readOnly={true}/>
                            </div>
                        </div>
                        <div className="row pb-2">
                            <div className="col-4 offset-8">
                                <NdTextBox id="txtTTC" parent={this} title={this.lang.t("popDocAi.txtTTC") + ":"} readOnly={true}/>
                            </div>
                        </div>
                    </Item>
                    <Item>
                        <NdButton id="btnImport" parent={this} text={this.lang.t('popDocAi.btnImport')} type="default" width={'100%'}
                        onClick={async()=>
                        {
                            await this.multiCodeAdd(this.importData)
                            
                            if(this.txtRealHT.value != this.txtHT.value)
                            {
                                let tmpConfObj =
                                {
                                    id:'msgHTControl',showTitle:true,title:this.lang.t("popDocAi.msgHTControl.title"),showCloseButton:true,width:'500px',height:'auto',
                                    button:[{id:"btn01",caption:this.lang.t("popDocAi.msgHTControl.btn01"),location:'before'},{id:"btn02",caption:this.lang.t("popDocAi.msgHTControl.btn02"),location:'after'}],
                                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("popDocAi.msgHTControl.msg")}</div>)
                                }

                                let tmpResult = await dialog(tmpConfObj);
                                
                                if(tmpResult == 'btn02')
                                {
                                    return
                                }
                            }

                            this.popDocAi.hide()
                            
                            if(typeof this.onImport != 'undefined')
                            {
                                this.onImport(this.importData)
                            }
                        }}/>
                    </Item>
                </Form>
            </NdPopUp>
            <NdPopGrid id={"pg_txtItemsCode"} parent={this} container={this.state.container} 
            visible={false}
            position={this.state.position} 
            showTitle={true} 
            showBorders={true}
            width={'90%'}
            height={'90%'}
            title={this.t("pg_txtItemsCode.title")} 
            search={true}
            data = 
            {{
                source:
                {
                    select:
                    {
                        query : `SELECT GUID,CODE,NAME,STATUS,0 AS ITEM_TYPE,MIN(UNIT_GUID) AS UNIT,COST_PRICE,VAT FROM ITEMS_BARCODE_MULTICODE_VW_01   WHERE UPPER(CODE) LIKE UPPER(@VAL) OR UPPER(NAME) LIKE UPPER(@VAL) OR BARCODE LIKE @VAL
                                GROUP BY  GUID,CODE,NAME,STATUS,COST_PRICE,VAT`,
                        param : ['VAL:string|50']
                    },
                    sql:this.core.sql
                }
            }}
            deferRendering={false}
            >
                <Column dataField="CODE" caption={this.t("pg_txtItemsCode.clmCode")} width={'20%'} />
                <Column dataField="NAME" caption={this.t("pg_txtItemsCode.clmName")} width={'70%'} defaultSortOrder="asc" />
                <Column dataField="STATUS" caption={this.t("pg_txtItemsCode.clmStatus")} width={'10%'} />
            </NdPopGrid>
        </div>
        )
    }
}