import React from 'react';
import App from '../../../lib/app.js';
import moment from 'moment';

import Toolbar,{Item} from 'devextreme-react/toolbar';
import Form, { Label } from 'devextreme-react/form';
import ScrollView from 'devextreme-react/scroll-view';

import NdGrid,{Column,Paging,Pager,Export,Button,Scrolling,Editing} from '../../../../core/react/devex/grid.js';
import NdTextBox from '../../../../core/react/devex/textbox.js'
import NdDropDownBox from '../../../../core/react/devex/dropdownbox.js';
import NdListBox from '../../../../core/react/devex/listbox.js';
import NdButton from '../../../../core/react/devex/button.js';
import NdDatePicker from '../../../../core/react/devex/datepicker.js';
import NdPopGrid from '../../../../core/react/devex/popgrid.js';
import NdPopUp from '../../../../core/react/devex/popup.js';
import NdSelectBox from '../../../../core/react/devex/selectbox.js';
import { dialog } from '../../../../core/react/devex/dialog.js';
import { docCls,docItemsCls,docCustomerCls } from '../../../../core/cls/doc.js';

export default class piqXIncomingList extends React.PureComponent
{
    constructor(props)
    {
        super(props)

        this.core = App.instance.core;
        
        this.btnGetClick = this.btnGetClick.bind(this)
        this.jData = []
    }
    componentDidMount()
    {
        setTimeout(async () => 
        {
            this.Init()
        }, 1000);
    }
    async Init()
    {
        this.dtFirst.value=moment(new Date(0)).format("YYYY-MM-DD");
        this.dtLast.value=moment(new Date(0)).format("YYYY-MM-DD");
    }
    async btnGetClick()
    {
        this.core.socket.emit('piqXInvoiceList',{taxId:'FR23885339697',first:moment(this.dtFirst.value).utcOffset(0, true),last:moment(this.dtLast.value).utcOffset(0, true)},async(pData)=>
        {
            await this.grdList.dataRefresh({source:[]})
            let tmpSource =
            {
                source : pData
            }
            App.instance.setState({isExecute:true})
            await this.grdList.dataRefresh({source:pData})
            App.instance.setState({isExecute:false})
        })
        
    }
    import(pData)
    {
        return new Promise(async resolve =>
        {
            let docObj = new docCls();
            let tmpDoc = {...docObj.empty}

            tmpDoc.TYPE = 0
            tmpDoc.DOC_TYPE = 20
            tmpDoc.REBATE = 0
            tmpDoc.REF = this.txtCustomerCode.value
            tmpDoc.REF_NO = Math.floor(Date.now() / 1000)
            tmpDoc.INPUT = this.cmbDepot.value
            tmpDoc.OUTPUT = pData[0].COMPANY
            tmpDoc.DOC_DATE = pData[0].DOC_DATE
            tmpDoc.SHIPMENT_DATE = pData[0].SHIPMENT_DATE
            tmpDoc.AMOUNT = pData[0].DOC_AMOUNT
            tmpDoc.DISCOUNT = pData[0].DOC_DISCOUNT
            tmpDoc.VAT = pData[0].DOC_VAT
            tmpDoc.TOTAL = pData[0].DOC_TOTAL
            tmpDoc.TOTALHT = pData[0].DOC_TOTALHT

            docObj.addEmpty(tmpDoc);

            let tmpDocCustomer = {...docObj.docCustomer.empty}

            tmpDocCustomer.DOC_GUID = docObj.dt()[0].GUID
            tmpDocCustomer.TYPE = docObj.dt()[0].TYPE
            tmpDocCustomer.DOC_TYPE = docObj.dt()[0].DOC_TYPE
            tmpDocCustomer.REBATE = docObj.dt()[0].REBATE
            tmpDocCustomer.REF = docObj.dt()[0].REF
            tmpDocCustomer.REF_NO = docObj.dt()[0].REF_NO
            tmpDocCustomer.DOC_DATE = docObj.dt()[0].DOC_DATE
            tmpDocCustomer.INPUT = docObj.dt()[0].INPUT
            tmpDocCustomer.OUTPUT = docObj.dt()[0].OUTPUT
            tmpDocCustomer.AMOUNT = docObj.dt()[0].AMOUNT

            docObj.docCustomer.addEmpty(tmpDocCustomer)
            
            for (let i = 0; i < pData.length; i++) 
            {
                let tmpDocItems = {...docObj.docItems.empty}

                tmpDocItems.DOC_GUID = docObj.dt()[0].GUID
                tmpDocItems.TYPE = docObj.dt()[0].TYPE
                tmpDocItems.DOC_TYPE = docObj.dt()[0].DOC_TYPE
                tmpDocItems.REBATE = docObj.dt()[0].REBATE
                tmpDocItems.LINE_NO = i
                tmpDocItems.REF = docObj.dt()[0].REF
                tmpDocItems.REF_NO = docObj.dt()[0].REF_NO
                tmpDocItems.OUTPUT = docObj.dt()[0].OUTPUT
                tmpDocItems.INPUT = docObj.dt()[0].INPUT
                tmpDocItems.DOC_DATE = docObj.dt()[0].DOC_DATE
                tmpDocItems.SHIPMENT_DATE = docObj.dt()[0].SHIPMENT_DATE

                tmpDocItems.ITEM = pData[i].OITEM
                tmpDocItems.ITEM_CODE = pData[i].OITEM_CODE
                tmpDocItems.ITEM_NAME = pData[i].OITEM_NAME
                tmpDocItems.UNIT = pData[i].OUNIT
                tmpDocItems.QUANTITY = pData[i].QUANTITY
                tmpDocItems.PRICE = pData[i].PRICE
                tmpDocItems.VAT = pData[i].VAT
                tmpDocItems.VAT_RATE = pData[i].VAT_RATE
                tmpDocItems.AMOUNT = pData[i].AMOUNT
                tmpDocItems.TOTAL =  pData[i].TOTAL
                tmpDocItems.TOTALHT = pData[i].TOTALHT
                tmpDocItems.DISCOUNT = pData[i].DISCOUNT
                tmpDocItems.DISCOUNT_RATE = pData[i].DISCOUNT_RATE
                
                await docObj.docItems.addEmpty(tmpDocItems)
            }
            
            await docObj.save()

            this.core.socket.emit('piqXInvoiceSetStatus',{invoiceId:this.jData[0].INVOICEID,user:this.core.auth.data.CODE,status:1})
            
            this.btnGetClick()

            let tmpConfObj =
            {
                id:'msgImport',showTitle:true,title:this.t("popImport.msgImport.title"),showCloseButton:true,width:'500px',height:'200px',
                button:[{id:"btn01",caption:this.t("popImport.msgImport.btn01"),location:'after'}],
                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{"Ref : " + docObj.dt()[0].REF + " - " + docObj.dt()[0].REF_NO + " " + this.t("popImport.msgImport.msg5")}</div>)
            }
            await dialog(tmpConfObj);

            resolve()
        })

    }
    render()
    {
        return(
            <div>
                <ScrollView>
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <Toolbar>
                                <Item location="after"
                                locateInMenu="auto"
                                widget="dxButton"
                                options=
                                {
                                    {
                                        type: 'default',
                                        icon: 'clear',
                                        onClick: async () => 
                                        {
                                            let tmpConfObj =
                                            {
                                                id:'msgClose',showTitle:true,title:this.lang.t("msgWarning"),showCloseButton:true,width:'500px',height:'200px',
                                                button:[{id:"btn01",caption:this.lang.t("btnYes"),location:'before'},{id:"btn02",caption:this.lang.t("btnNo"),location:'after'}],
                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgClose")}</div>)
                                            }
                                            
                                            let pResult = await dialog(tmpConfObj);
                                            if(pResult == 'btn01')
                                            {
                                                App.instance.panel.closePage()
                                            }
                                        }
                                    }    
                                } />
                            </Toolbar>
                        </div>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <Form colCount={2} id="frmFilter">
                                {/* dtFirst */}
                                <Item>
                                    <Label text={this.t("dtFirst")} alignment="right" />
                                    <NdDatePicker simple={true}  parent={this} id={"dtFirst"}/>
                                </Item>
                                {/* dtLast */}
                                <Item>
                                    <Label text={this.t("dtLast")} alignment="right" />
                                    <NdDatePicker simple={true}  parent={this} id={"dtLast"}/>
                                </Item>
                            </Form>
                        </div>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-3 offset-9">
                            <NdButton text={this.t("btnGet")} type="success" width="100%" onClick={this.btnGetClick}/>
                        </div>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <NdGrid id="grdList" parent={this} 
                            selection={{mode:"multiple"}} 
                            showBorders={true}
                            filterRow={{visible:true}} 
                            headerFilter={{visible:true}}
                            columnAutoWidth={true}
                            allowColumnReordering={true}
                            allowColumnResizing={true}
                            width={'100%'}
                            >                            
                                <Paging defaultPageSize={20} />
                                <Pager visible={true} allowedPageSizes={[5,10,50]} showPageSizeSelector={true} />
                                <Column dataField="DOC_DATE" caption={this.t("grdList.clmDate")} visible={true} width={'10%'} dataType={'date'}/> 
                                <Column dataField="DOC_FROM_NO" caption={this.t("grdList.clmFromNo")} visible={true} width={'35%'}/> 
                                <Column dataField="DOC_FROM_TITLE" caption={this.t("grdList.clmFromTitle")} visible={true} width={'40%'}/> 
                                <Column dataField="STATUS" caption={this.t("grdList.clmStatus")} visible={true} width={'5%'} 
                                cellRender={(e)=>
                                {
                                    if(e.value == 0)
                                    {
                                        return (<div style={{display:'flex',alignItems:'center',gap:'10px',justifyContent:'center',color:'red'}}><i className="dx-icon-remove"></i></div>)    
                                    }
                                    else if(e.value == 1)
                                    {
                                        return (<div style={{display:'flex',alignItems:'center',gap:'10px',justifyContent:'center',color:'green'}}><i className="dx-icon-todo"></i></div>)
                                    }
                                    else
                                    {
                                        return (<div></div>)
                                    }
                                }}/>
                                <Column type="buttons" width={'10%'}>
                                    <Button icon="pdffile"
                                    onClick={(e)=>
                                    {
                                        this.core.socket.emit('piqXInvoice',{invoiceId:e.row.data.GUID},
                                        (pData) =>
                                        {
                                            if(typeof pData != 'undefined' && typeof pData.err == 'undefined' && pData.length > 0)
                                            {
                                                let mywindow = window.open('printview.html','_blank',"width=900,height=1000,left=500");      
                                                mywindow.onload = function() 
                                                { 
                                                    mywindow.document.getElementById("view").innerHTML="<iframe src='" + pData[0].PDF + "' type='application/pdf' width='100%' height='100%'></iframe>"      
                                                }
                                            }
                                        })
                                    }}/>
                                    <Button icon="download"
                                    onClick={(e)=>
                                    {
                                        this.core.socket.emit('piqXInvoice',{invoiceId:e.row.data.GUID},
                                        async(pData) =>
                                        {
                                            if(typeof pData != 'undefined' && typeof pData.err == 'undefined' && pData.length > 0)
                                            {
                                                try
                                                {
                                                    if(pData[0].STATUS == 1)
                                                    {
                                                        let tmpConfObj =
                                                        {
                                                            id:'msgImport',showTitle:true,title:this.t("popImport.msgImport.title"),showCloseButton:true,width:'500px',height:'200px',
                                                            button:[{id:"btn01",caption:this.t("popImport.msgImport.btn01"),location:'after'}],
                                                            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("popImport.msgImport.msg6")}</div>)
                                                        }
                                                        await dialog(tmpConfObj);
                                                        return
                                                    }

                                                    await this.popImport.show()

                                                    this.jData = JSON.parse(pData[0].JSON)
                                                    console.log(JSON.parse(pData[0].JSON))
                                                    console.log(pData[0].DOC_FROM_NO)
                                                    if(this.jData.length > 0)
                                                    {
                                                        this.jData[0].INVOICEID = e.row.data.GUID
                                                        let tmpQuery = 
                                                        {
                                                            query : "SELECT * FROM CUSTOMERS WHERE TAX_NO = @TAX_NO",
                                                            param : ['TAX_NO:string|25'],
                                                            value : [pData[0].DOC_FROM_NO]
                                                        }

                                                        let tmpData = await this.core.sql.execute(tmpQuery) 

                                                        if(tmpData?.result?.recordset?.length > 0)
                                                        {
                                                            this.txtCustomerCode.value = tmpData.result.recordset[0].CODE
                                                            this.txtCustomerName.value = tmpData.result.recordset[0].TITLE

                                                            this.jData[0].COMPANY = tmpData.result.recordset[0].GUID
                                                        }
                                                        
                                                        this.dtDocDate.value = this.jData[0].DOC_DATE
                                                        this.dtShipDate.value = this.jData[0].SHIPMENT_DATE
                                                        this.txtHT.value = this.jData[0].DOC_TOTALHT
                                                        this.txtTax.value = this.jData[0].DOC_VAT
                                                        this.txtTTC.value = this.jData[0].DOC_TOTAL
                                                        
                                                        for (let i = 0; i < this.jData.length; i++) 
                                                        {
                                                            tmpQuery = 
                                                            {
                                                                query : "SELECT " + 
                                                                        "I.GUID AS ITEM, " + 
                                                                        "I.CODE AS ITEM_CODE, " + 
                                                                        "I.NAME AS ITEM_NAME, " + 
                                                                        "I.UNIT AS UNIT " + 
                                                                        "FROM ITEM_MULTICODE AS M " + 
                                                                        "INNER JOIN ITEMS_VW_01 AS I ON " + 
                                                                        "M.ITEM = I.GUID " + 
                                                                        "WHERE M.CODE = @CODE AND M.CUSTOMER = @CUSTOMER",
                                                                param : ['CODE:string|50','CUSTOMER:string|50'],
                                                                value : [this.jData[i].ITEM_CODE,this.jData[0].COMPANY]
                                                            }

                                                            tmpData = await this.core.sql.execute(tmpQuery) 
                                                            
                                                            if(tmpData?.result?.recordset?.length > 0)
                                                            {
                                                                this.jData[i].OITEM = tmpData.result.recordset[0].ITEM
                                                                this.jData[i].OITEM_CODE = tmpData.result.recordset[0].ITEM_CODE
                                                                this.jData[i].OITEM_NAME = tmpData.result.recordset[0].ITEM_NAME
                                                                this.jData[i].OUNIT = tmpData.result.recordset[0].UNIT
                                                            }
                                                            else
                                                            {
                                                                this.jData[i].OITEM = '00000000-0000-0000-0000-000000000000'
                                                                this.jData[i].OITEM_CODE = ''
                                                                this.jData[i].OITEM_NAME = ''
                                                                this.jData[i].OUNIT = '00000000-0000-0000-0000-000000000000'
                                                            }
                                                        }
                                                        
                                                        await this.grdImportList.dataRefresh({source:this.jData})
                                                    }
                                                }
                                                catch (err) 
                                                {
                                                    console.log(err)
                                                }
                                            }
                                        })
                                    }}/>
                                </Column> 
                            </NdGrid>
                        </div>
                    </div>
                    {/* Import PopUp */}
                    <div>
                        <NdPopUp parent={this} id={"popImport"} 
                        visible={false}
                        showCloseButton={true}
                        showTitle={true}
                        title={this.t("popImport.title")}
                        container={"#root"} 
                        width={'100%'}
                        height={'100%'}
                        position={{of:'#root'}}
                        deferRendering={true}
                        >
                            <Form colCount={1} height={'fit-content'}>
                                <Item>
                                    <div className="row">
                                        <div className="col-6">
                                            
                                        </div>
                                        <div className="col-6">
                                            <NdSelectBox title={this.t("popImport.cmbDepot") + ":"} parent={this} id="cmbDepot" notRefresh = {true}
                                            displayExpr="NAME"                       
                                            valueExpr="GUID"
                                            value=""
                                            searchEnabled={true}
                                            data={{source:{select:{query : "SELECT * FROM DEPOT_VW_01 WHERE TYPE IN(0,2)"},sql:this.core.sql}}}
                                            >
                                            </NdSelectBox>
                                        </div>
                                    </div>
                                </Item>
                                <Item>
                                    <div className="row">
                                        <div className="col-6">
                                            <NdTextBox id="txtCustomerCode" parent={this} title={this.t("popImport.txtCustomerCode") + ":"} readOnly={true}/>
                                        </div>
                                        <div className="col-6">
                                            <NdTextBox id="txtCustomerName" parent={this} title={this.t("popImport.txtCustomerName") + ":"} readOnly={true}/>
                                        </div>
                                    </div>
                                </Item>
                                <Item>
                                    <div className="row">
                                        <div className="col-6">
                                            <NdDatePicker parent={this} id={"dtDocDate"} title={this.t("popImport.dtDocDate") + ":"} readOnly={true}/>
                                        </div>
                                        <div className="col-6">
                                            <NdDatePicker parent={this} id={"dtShipDate"} title={this.t("popImport.dtShipDate") + ":"} readOnly={true}/>
                                        </div>
                                    </div>
                                </Item>
                                <Item>
                                    <div className='row'>
                                        <div className='col-12'>
                                            <NdGrid parent={this} id={"grdImportList"} 
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
                                                if(e.rowType === "data" && e.column.dataField === "OITEM_CODE" && e.data.OITEM_CODE == '')
                                                {
                                                    e.cellElement.style.backgroundColor = "red"
                                                }
                                                if(e.rowType === "data" && e.column.dataField === "OITEM_NAME" && e.data.OITEM_CODE == '')
                                                {
                                                    e.cellElement.style.backgroundColor = "red"
                                                }
                                                if(e.rowType === "data" && e.column.dataField === "QUANTITY" && e.data.QUANTITY == 0)
                                                {
                                                    e.cellElement.style.backgroundColor = "red"
                                                }
                                                if(e.rowType === "data" && e.column.dataField === "PRICE" && e.data.PRICE == 0)
                                                {
                                                    e.cellElement.style.backgroundColor = "red"
                                                }
                                                if(e.rowType === "data" && e.column.dataField === "AMOUNT" && e.data.AMOUNT == 0)
                                                {
                                                    e.cellElement.style.backgroundColor = "red"
                                                }
                                            }}
                                            >
                                                <Paging defaultPageSize={10} />
                                                <Pager visible={true} allowedPageSizes={[5,10,20,50,100]} showPageSizeSelector={true} />
                                                <Scrolling mode="standart" />
                                                <Editing mode="cell" allowUpdating={true} allowDeleting={false} confirmDelete={false}/>
                                                <Column dataField="OITEM_CODE" caption={this.t("popImport.clmItemCode")} allowEditing={false} width={120} editCellRender={this._cellRoleRender} allowHeaderFiltering={false}/>
                                                <Column dataField="ITEM_CODE" caption={this.t("popImport.clmMulticode")} allowEditing={false} width={120} allowHeaderFiltering={false}/>
                                                <Column dataField="OITEM_NAME" caption={this.t("popImport.clmItemName")} allowEditing={false} width={350} allowHeaderFiltering={false}/>
                                                <Column dataField="QUANTITY" caption={this.t("popImport.clmQuantity")}  width={70} dataType={'number'} cellRender={(e)=>{return e.value + " / " + e.data.UNITE_SYMBOL}}/>
                                                <Column dataField="PRICE" caption={this.t("popImport.clmPrice")} width={70} dataType={'number'} format={{ style: "currency", currency: Number.money.code,precision: 3}}/>
                                                <Column dataField="DISCOUNT" caption={this.t("popImport.clmDiscount")} dataType={'number'}  format={{ style: "currency", currency: Number.money.code,precision: 2}} editCellRender={this._cellRoleRender} width={70} allowHeaderFiltering={false}/>
                                                <Column dataField="AMOUNT" caption={this.t("popImport.clmAmount")} format={{ style: "currency", currency: Number.money.code,precision: 2}} allowEditing={false} width={80} allowHeaderFiltering={false}/>
                                            </NdGrid>
                                        </div>
                                    </div>
                                </Item>
                                <Item>
                                    <div className="row pb-2">
                                        <div className="col-3 offset-9">
                                            <NdTextBox id="txtHT" parent={this} title={this.t("popImport.txtHT") + ":"} readOnly={true}/>
                                        </div>
                                    </div>
                                    <div className="row pb-2">
                                        <div className="col-3 offset-9">
                                            <NdTextBox id="txtTax" parent={this} title={this.t("popImport.txtTax") + ":"} readOnly={true}/>
                                        </div>
                                    </div>
                                    <div className="row pb-2">
                                        <div className="col-3 offset-9">
                                            <NdTextBox id="txtTTC" parent={this} title={this.t("popImport.txtTTC") + ":"} readOnly={true}/>
                                        </div>
                                    </div>
                                </Item>
                                <Item>
                                    <NdButton id="btnImport" parent={this} text={this.t('popImport.btnImport')} type="default" width={'100%'}
                                    onClick={async()=>
                                    {
                                        let tmpConfObj =
                                        {
                                            id:'msgImport',showTitle:true,title:this.t("popImport.msgImport.title"),showCloseButton:true,width:'500px',height:'200px',
                                            button:[{id:"btn01",caption:this.t("popImport.msgImport.btn01"),location:'after'}],
                                        }

                                        if(this.jData.length == 0)
                                        {
                                            tmpConfObj.content = (<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("popImport.msgImport.msg1")}</div>)
                                            await dialog(tmpConfObj);
                                            return
                                        }
                                        if(this.cmbDepot.value == '')
                                        {
                                            tmpConfObj.content = (<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("popImport.msgImport.msg2")}</div>)
                                            await dialog(tmpConfObj);
                                            return
                                        }
                                        if(typeof this.jData[0].COMPANY == 'undefined')
                                        {
                                            tmpConfObj.content = (<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("popImport.msgImport.msg3")}</div>)
                                            await dialog(tmpConfObj);
                                            return
                                        }
                                        
                                        for (let i = 0; i < this.jData.length; i++) 
                                        {
                                            if(typeof this.jData[i].OITEM == 'undefined' || this.jData[i].OITEM == '00000000-0000-0000-0000-000000000000')
                                            {
                                                tmpConfObj.content = (<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("popImport.msgImport.msg4")}</div>)
                                                await dialog(tmpConfObj);
                                                return
                                            }
                                        }

                                        await this.import(this.jData)
                                        this.popImport.hide()
                                    }}/>
                                </Item>
                            </Form>
                        </NdPopUp>
                    </div>
                </ScrollView>
            </div>
        )
    }
}