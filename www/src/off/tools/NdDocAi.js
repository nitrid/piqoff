import moment from 'moment';

import React from "react";
import Base from '../../core/react/devex/base.js';
import App from "../lib/app";
import Form, { Label,Item,EmptyItem } from 'devextreme-react/form';
import FileUploader from 'devextreme-react/file-uploader';
import NdPopUp from '../../core/react/devex/popup.js';
import NdButton from "../../core/react/devex/button";
import NdGrid,{Column,Editing,Paging,Pager,Scrolling} from '../../core/react/devex/grid';
import NdDialog, { dialog } from '../../core/react/devex/dialog.js';
import NdTextBox from '../../core/react/devex/textbox.js'
import NdDatePicker from '../../core/react/devex/datepicker.js';

export default class NdDocAi extends Base
{
    constructor(props)
    {
        super(props)
        this.core = this.props.parent.core
        this.files = []
        this.importData = undefined
        this.customer = '00000000-0000-0000-0000-000000000000'
    }
    async show(pCustomer)
    {
        this.customer = pCustomer
        this.popDocAi.show()
    }
    getValue(pData)
    {
        let tmpValue = undefined
        if(typeof pData != 'undefined')
        {
            if(typeof pData.content != 'undefined')
            {
                tmpValue = pData.content
            }
            if(typeof pData.value != 'undefined')
            {
                tmpValue = pData.value
            }
            if(typeof pData.value != 'undefined' && typeof pData.value.amount != 'undefined')
            {
                tmpValue = pData.value.amount
            }

            if(typeof pData.kind != 'undefined' && pData.kind == 'number')
            {
                tmpValue = Number(typeof tmpValue == 'undefined' || tmpValue == '' ? 0 : tmpValue)
            } 
        }

        return tmpValue
    }
    async getDoc(pData)
    {
        this.importData = undefined
        App.instance.setState({isExecute:true})
        
        pData.VendorTaxId = typeof pData.VendorTaxId != 'undefined' ? pData.VendorTaxId.replaceAll(' ','') : ''
        pData.InvoiceDate = typeof pData.InvoiceDate != 'undefined' ? moment(pData.InvoiceDate) : moment(new Date())
        pData.DueDate = typeof pData.DueDate != 'undefined' ? moment(pData.DueDate) : moment(new Date())

        this.txtTaxId.value = pData.VendorTaxId
        this.dtDocDate.value = pData.InvoiceDate
        this.dtShipDate.value = pData.DueDate
        this.txtHT.value = typeof pData.HT != 'undefined' ? pData.HT : 0
        this.txtTax.value = typeof pData.VAT != 'undefined' ? pData.VAT : 0
        this.txtTTC.value = typeof pData.TTC != 'undefined' ? pData.TTC : 0

        let tmpCustomer = await this.getCustomer(pData.VendorTaxId)

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
                console.log(pData.Item[i].Quantity)
                console.log(pData.Item[i].UnitPrice)
                pData.Item[i].ProductCode = this.getValue(pData.Item[i].ProductCode)
                pData.Item[i].Description = this.getValue(pData.Item[i].Description)
                pData.Item[i].Quantity = typeof this.getValue(pData.Item[i].Quantity) == 'undefined' ? 0 : this.getValue(pData.Item[i].Quantity)
                pData.Item[i].Amount = typeof this.getValue(pData.Item[i].Amount) == 'undefined' ? 0 : this.getValue(pData.Item[i].Amount)
                pData.Item[i].UnitPrice = typeof this.getValue(pData.Item[i].UnitPrice) == 'undefined' ? 0 : Number(this.getValue(pData.Item[i].UnitPrice)).round(5) //typeof pData.Item[i].UnitPrice == 'undefined' ? 0 : Number(pData.Item[i].Amount / pData.Item[i].Quantity).round(5)
                pData.Item[i].Unit = typeof this.getValue(pData.Item[i].Unit) == 'undefined' ? '' : this.getValue(pData.Item[i].Unit) //typeof pData.Item[i].Unit == 'undefined' ? '' : pData.Item[i].Unit

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
                }
            }

            await this.grdList.dataRefresh({source:pData.Item});
            this.importData = pData    
        }
        else
        {
            let tmpConfObj =
            {
                id:'msgCustomerNotFound',showTitle:true,title:this.lang.t("popDocAi.msgCustomerNotFound.title"),showCloseButton:true,width:'500px',height:'200px',
                button:[{id:"btn01",caption:this.lang.t("popDocAi.msgCustomerNotFound.btn01"),location:'after'}],
                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("popDocAi.msgCustomerNotFound.msg")}</div>)
            }

            await dialog(tmpConfObj);
        }
        App.instance.setState({isExecute:false})
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
                            "WHERE MULTICODE = @MULTICODE AND CUSTOMER_GUID = @CUSTOMER_GUID",
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
                }
                else
                {
                    console.log(tmpQuery)
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
    render()
    {
        return(
            <NdPopUp parent={this} id={"popDocAi"} 
            visible={false}
            showCloseButton={true}
            showTitle={true}
            title={this.lang.t("popDocAi.title")}
            container={"#root"} 
            width={'100%'}
            height={'100%'}
            position={{of:'#root'}}
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
                                App.instance.setState({isExecute:true})
                                fetch('http://piqsoft.piqpos.com:8090/docai', 
                                {
                                    method: 'POST',
                                    body: formData
                                })
                                .then(response => 
                                {
                                    App.instance.setState({isExecute:false})
                                    if (!response.ok) 
                                    {
                                        throw new Error('Dosya yükleme başarısız. HTTP Hata: ' + response.status);
                                    }
                                    return response.json();
                                })
                                .then(data => 
                                {
                                    App.instance.setState({isExecute:false})
                                    if(data.success)
                                    {
                                        console.log(data.result)
                                        this.getDoc(data.result)
                                    }
                                    else
                                    {
                                        console.log(data.message, typeof data.error == 'undefined' ? '' : data.error)
                                    }
                                })
                                .catch(error => 
                                {
                                    App.instance.setState({isExecute:false})
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
                                }}
                                >
                                    <Paging defaultPageSize={10} />
                                    <Pager visible={true} allowedPageSizes={[5,10,20,50,100]} showPageSizeSelector={true} />
                                    <Scrolling mode="standart" />
                                    <Editing mode="cell" allowUpdating={true} allowDeleting={true} confirmDelete={false}/>
                                    <Column dataField="ItemCode" caption={this.lang.t("popDocAi.clmItemCode")} allowEditing={false} width={120} editCellRender={this._cellRoleRender} allowHeaderFiltering={false}/>
                                    <Column dataField="ProductCode" caption={this.lang.t("popDocAi.clmMulticode")} allowEditing={false} width={120} allowHeaderFiltering={false}/>
                                    <Column dataField="ItemName" caption={this.lang.t("popDocAi.clmItemName")} allowEditing={false} width={350} allowHeaderFiltering={false}/>
                                    <Column dataField="Quantity" caption={this.lang.t("popDocAi.clmQuantity")}  width={70} dataType={'number'} cellRender={(e)=>{return e.value + " / " + e.data.Unit}}/>
                                    <Column dataField="UnitPrice" caption={this.lang.t("popDocAi.clmPrice")} width={70} dataType={'number'} format={{ style: "currency", currency: "EUR",precision: 3}}/>
                                    <Column dataField="Discount" caption={this.lang.t("popDocAi.clmDiscount")} dataType={'number'}  format={{ style: "currency", currency: "EUR",precision: 2}} editCellRender={this._cellRoleRender} width={70} allowHeaderFiltering={false}/>
                                    <Column dataField="Amount" caption={this.lang.t("popDocAi.clmAmount")} format={{ style: "currency", currency: "EUR",precision: 2}} allowEditing={false} width={80} allowHeaderFiltering={false}/>
                                </NdGrid>
                            </div>
                        </div>
                    </Item>
                    <Item>
                        <div className="row pb-2">
                            <div className="col-3 offset-9">
                                <NdTextBox id="txtHT" parent={this} title={this.lang.t("popDocAi.txtHT") + ":"} readOnly={true}/>
                            </div>
                        </div>
                        <div className="row pb-2">
                            <div className="col-3 offset-9">
                                <NdTextBox id="txtTax" parent={this} title={this.lang.t("popDocAi.txtTax") + ":"} readOnly={true}/>
                            </div>
                        </div>
                        <div className="row pb-2">
                            <div className="col-3 offset-9">
                                <NdTextBox id="txtTTC" parent={this} title={this.lang.t("popDocAi.txtTTC") + ":"} readOnly={true}/>
                            </div>
                        </div>
                    </Item>
                    <Item>
                        <NdButton id="btnImport" parent={this} text={this.lang.t('popDocAi.btnImport')} type="default" width={'100%'}
                        onClick={async()=>
                        {
                            this.popDocAi.hide()
                            if(typeof this.onImport != 'undefined')
                            {
                                this.onImport(this.importData)
                            }
                        }}/>
                    </Item>
                </Form>
            </NdPopUp>
        )
    }
}