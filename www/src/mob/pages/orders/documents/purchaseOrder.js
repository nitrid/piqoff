import React from 'react';
import App from '../../../lib/app.js';
import { labelCls,labelMainCls } from '../../../../core/cls/label.js';
import { docCls,docOrdersCls, docCustomerCls } from '../../../../core/cls/doc.js';
import moment from 'moment';

import ScrollView from 'devextreme-react/scroll-view';
import Toolbar from 'devextreme-react/toolbar';
import Form, { Label,Item,EmptyItem,GroupItem, SimpleItem } from 'devextreme-react/form';
import DropDownButton from 'devextreme-react/drop-down-button';
import TabPanel from 'devextreme-react/tab-panel';
import { Button } from 'devextreme-react/button';

import NdTextBox, { Validator, NumericRule, RequiredRule, CompareRule, EmailRule, PatternRule, StringLengthRule, RangeRule, AsyncRule } from '../../../../core/react/devex/textbox.js'
import NdNumberBox from '../../../../core/react/devex/numberbox.js';
import NdSelectBox from '../../../../core/react/devex/selectbox.js';
import NdCheckBox from '../../../../core/react/devex/checkbox.js';
import NdPopGrid from '../../../../core/react/devex/popgrid.js';
import NdPopUp from '../../../../core/react/devex/popup.js';
import NdGrid,{Column,Editing,Paging,Scrolling,KeyboardNavigation,Export} from '../../../../core/react/devex/grid.js';
import NdButton from '../../../../core/react/devex/button.js';
import NdDatePicker from '../../../../core/react/devex/datepicker.js';
import NdDialog, { dialog } from '../../../../core/react/devex/dialog.js';
import { datatable } from '../../../../core/core.js';
import tr from '../../../meta/lang/devexpress/tr.js';
import { triggerHandler } from 'devextreme/events';

export default class salesOrder extends React.Component
{
    constructor()
    {
        super()
        this.state = 
        {
            tbMain:"visible",
            tbBarcode:"hidden",
            tbDocument: "hidden",
            grid : "hidden"
        }     
        this.barcode = 
        {
            name:"",
            vat:0,
            barcode: "",
            code:"",
            guid : "00000000-0000-0000-0000-000000000000",
        }
        this.core = App.instance.core;
        this.prmObj = this.param.filter({TYPE:1,USERS:this.user.CODE});
        this.acsobj = this.access.filter({TYPE:1,USERS:this.user.CODE});

        this.docObj = new docCls();
        this.itemCustomerObj = new datatable  

        this.dropmenuMainItems = [this.t("btnNew"),this.t("btnSave")]
        this.dropmenuDocItems = [this.t("btnSave")]
        this.pageChange = this.pageChange.bind(this)
        this.setBarcode = this.setBarcode.bind(this)
        this._calculateTotal = this._calculateTotal.bind(this)
        this.dropmenuClick = this.dropmenuClick.bind(this)
        this.barcodeScan = this.barcodeScan.bind(this)

    }
    async componentDidMount()
    {
        await this.core.util.waitUntil(0)
        this.init()
    }
    async init()
    {
        this.docObj.clearAll()

        let tmpDoc = {...this.docObj.empty}
        tmpDoc.TYPE = 0
        tmpDoc.DOC_TYPE = 60
        this.docObj.addEmpty(tmpDoc);

        this.txtCustomerCode.readOnly = false;
        this.txtRef.readOnly = false
        this.txtRefno.readOnly = false
        this.txtRef.readOnly = true
        await this.grdSlsOrder.dataRefresh({source:this.docObj.docOrders.dt('DOC_ORDERS')});
        await this.grdChkCustomer.dataRefresh({source:this.itemCustomerObj});

    }
    async dropmenuClick(e)
    {
        if(e.itemData == this.t("btnNew"))
        {
            this.init()
        }
        else if(e.itemData == this.t("btnSave"))
        {
            let tmpConfObj =
            {
                id:'msgSave',showTitle:true,title:this.t("msgSave.title"),showCloseButton:true,width:'350px',height:'200px',
                button:[{id:"btn01",caption:this.t("msgSave.btn01"),location:'before'},{id:"btn02",caption:this.t("msgSave.btn02"),location:'after'}],
                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgSave.msg")}</div>)
            }
            
            let pResult = await dialog(tmpConfObj);
            if(pResult == 'btn01')
            {
                let tmpConfObj1 =
                {
                    id:'msgSaveResult',showTitle:true,title:this.t("msgSave.title"),showCloseButton:true,width:'350px',height:'200px',
                    button:[{id:"btn01",caption:this.t("msgSave.btn01"),location:'after'}],
                }
                
                if((await this.docObj.save()) == 0)
                {                       
                    tmpConfObj1.content = (<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgSaveResult.msgSuccess")}</div>)
                    await dialog(tmpConfObj1);
                }
                else
                {
                    tmpConfObj1.content = (<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgSaveResult.msgFailed")}</div>)
                    await dialog(tmpConfObj1);
                }
            }
        }
    }
    async getDoc(pGuid,pRef,pRefno)
    {
        this.docObj.clearAll()
        await this.docObj.load({GUID:pGuid,REF:pRef,REF_NO:pRefno,TYPE:0,DOC_TYPE:60});

        this.txtRef.readOnly = true
        this.txtRefno.readOnly = true
    }
    async pageChange(pPage)
    {
        if(pPage == "Main")
        {
            this.setState({tbMain:"visible"})
            this.setState({tbBarcode:"hidden"})
            this.setState({tbDocument:"hidden"})
        }
        if(pPage == "Barcode")
        {
            if(this.cmbDepot.value == "")
            {
                let tmpConfObj = 
                {
                    id:'msgDepotSelect',showTitle:true,title:this.t("msgDepotSelect.title"),showCloseButton:true,width:'350px',height:'200px',
                    button:[{id:"btn01",caption:this.t("msgDepotSelect.btn01"),location:'after'}],
                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgDepotSelect.msg")}</div>)
                }
                let pResult = await dialog(tmpConfObj);
                return
            }
            else if(this.docObj.dt()[0].OUTPUT_CODE == "")
            {
                let tmpConfObj = 
                {
                    id:'msgCustomerSelect',showTitle:true,title:this.t("msgCustomerSelect.title"),showCloseButton:true,width:'350px',height:'200px',
                    button:[{id:"btn01",caption:this.t("msgCustomerSelect.btn01"),location:'after'}],
                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgCustomerSelect.msg")}</div>)
                }
                let pResult = await dialog(tmpConfObj);
                return
            }
            this.setState({tbMain:"hidden"})
            this.setState({tbBarcode:"visible"})
            this.setState({tbDocument:"hidden"})
            this.txtBarcode.focus()
        }
        if(pPage == "Document")
        {
            this.setState({tbMain:"hidden"})
            this.setState({tbBarcode:"hidden"})
            this.setState({tbDocument:"visible"})
        }
    }    
    async barcodeScan()
    {
        
        cordova.plugins.barcodeScanner.scan(
            async function (result) 
            {
                if(result.cancelled == false)
                {
                    this.txtBarcode.value = result.text;
                    let tmpQuery = 
                    {
                        query : "SELECT ITEM_CODE AS CODE,ITEM_NAME AS NAME,ITEM_GUID AS GUID,BARCODE, ISNULL((SELECT VAT FROM ITEMS WHERE ITEMS.GUID = ITEM_BARCODE_VW_01.ITEM_GUID),0) AS VAT FROM ITEM_BARCODE_VW_01  WHERE BARCODE = @BARCODE OR ITEM_CODE = @BARCODE ",
                        param : ['BARCODE:string|50'],
                        value : [result.text]
                    }
                    let tmpData = await this.core.sql.execute(tmpQuery) 
                    if(tmpData.result.recordset.length >0)
                    {
                        this.barcode.name = tmpData.result.recordset[0].NAME
                        this.barcode.barcode = tmpData.result.recordset[0].BARCODE 
                        this.barcode.code = tmpData.result.recordset[0].CODE 
                        this.barcode.guid = tmpData.result.recordset[0].GUID 
                        this.barcode.vat = tmpData.result.recordset[0].VAT 
                        this.setBarcode()
                        
                    }
                    else
                    {
                        let tmpConfObj = 
                        {
                            id:'msgBarcodeNotFound',showTitle:true,title:this.t("msgBarcodeNotFound.title"),showCloseButton:true,width:'350px',height:'200px',
                            button:[{id:"btn01",caption:this.t("msgBarcodeNotFound.btn01"),location:'after'}],
                            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgBarcodeNotFound.msg")}</div>)
                        }
                        await dialog(tmpConfObj);
                        this.txtBarcode.value = ""
                    }
                }
            }.bind(this),
            function (error) 
            {
                //alert("Scanning failed: " + error);
            },
            {
              prompt : "Scan",
              orientation : "portrait"
            }
        );
    }
    async setBarcode()
    {
        this.itemCustomerObj.clear()
        this.txtQuantity.value = 1
        let tmpCheckQuery = 
        {
            query :"SELECT MULTICODE,CUSTOMER_PRICE AS PRICE FROM ITEM_MULTICODE_VW_01 WHERE ITEM_CODE = @ITEM_CODE AND CUSTOMER_GUID = @CUSTOMER_GUID",
            param : ['ITEM_CODE:string|50','CUSTOMER_GUID:string|50'],
            value : [this.barcode.code,this.docObj.dt()[0].OUTPUT]
        }
        let tmpCheckData = await this.core.sql.execute(tmpCheckQuery) 
        if(tmpCheckData.result.recordset.length == 0)
        {
            let tmpConfObj = 
            {
                id:'msgCustomerNotFound',showTitle:true,title:this.t("msgCustomerNotFound.title"),showCloseButton:true,width:'350px',height:'200px',
                button:[{id:"btn01",caption:this.t("msgCustomerNotFound.btn01"),location:'before'},{id:"btn02",caption:this.t("msgCustomerNotFound.btn02"),location:'after'}],
                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgCustomerNotFound.msg")}</div>)
            }
            let pResult = await dialog(tmpConfObj);
            if(pResult == 'btn02')
            {                
                this.barcodeReset()   
                return
            }
        }
        
        if(tmpCheckData.result.recordset.length > 0)
        {
            this.txtPrice.value = parseFloat((tmpCheckData.result.recordset[0].PRICE).toFixed(2))
            this.txtVat.value = parseFloat((tmpCheckData.result.recordset[0].PRICE * (this.barcode.vat / 100)).toFixed(2))
            //this.txtDiscount.value = 0
            this.txtAmount.value = parseFloat((Number(this.txtPrice.value) + Number(this.txtVat.value)).toFixed(2))
            let tmpQuery2 =
            {
                query :"SELECT CUSTOMER_PRICE AS PRICE,SUBSTRING(CUSTOMER_NAME, 1,10) AS CUSTOMER,CUSTOMER_PRICE_DATE AS PRICE_DATE FROM ITEM_MULTICODE_VW_01 WHERE ITEM_CODE = @ITEM_CODE",
                param : ['ITEM_CODE:string|50','CUSTOMER_GUID:string|50'],
                value : [this.barcode.code,this.docObj.dt()[0].OUTPUT]
            }
            let tmpData2 = await this.core.sql.execute(tmpQuery2) 
            if(tmpData2.result.recordset.length > 1)
            {
                for (let i = 0; i < tmpData2.result.recordset.length; i++) 
                {
                    this.itemCustomerObj.push(tmpData2.result.recordset[i])
                }
                this.setState({grid:"visible"})
            }
            else
            {
                this.setState({grid:"hidden"})
            }
        }
        if(this.chkAutoAdd.value == true)
        {
            setTimeout(async () => 
            {
               this.txtPopQuantity.focus()
            }, 700);
            await this.msgQuantity.show().then(async (e) =>
            {
               
                if(e == 'btn01')
                {
                    this.addItem(this.txtPopQuantity.value)
                }
            })
        }
        else
        {
            this.txtQuantity.focus()
        }
        this.setState({tbBarcode:"visible"})
    }
    barcodeReset()
    {
        if(this.chkAutoAdd.value == false)
        {
            this.barcode = 
            {
                name:"",
                vat:0,
                barcode: "",
                code:"",
                guid : "00000000-0000-0000-0000-000000000000",
            }
        }
        this.txtBarcode.value = ""
        this.txtAmount.value = 0
        this.txtVat.value = 0
        this.txtQuantity.value = 0
        this.txtPrice.value = 0
        this.setState({tbBarcode:"visible"})
        this.setState({grid:"hidden"})
        this.txtBarcode.focus()
    }
    async addItem(pQuantity)
    {
        if(this.txtBarcode.value == "")
        {
            let tmpConfObj = 
            {
                id:'msgBarcodeCheck',showTitle:true,title:this.t("msgBarcodeCheck.title"),showCloseButton:true,width:'350px',height:'200px',
                button:[{id:"btn01",caption:this.t("msgBarcodeCheck.btn01"),location:'after'}],
                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgBarcodeCheck.msg")}</div>)
            }
            let pResult = await dialog(tmpConfObj);
            return
        }
        for (let i = 0; i < this.docObj.docOrders.dt().length; i++) 
        {
            if(this.docObj.docOrders.dt()[i].ITEM_CODE == this.barcode.code)
            {
                let tmpConfObj = 
                {
                    id:'msgCombineItem',showTitle:true,title:this.t("msgCombineItem.title"),showCloseButton:true,width:'350px',height:'200px',
                    button:[{id:"btn01",caption:this.t("msgCombineItem.btn01"),location:'before'},{id:"btn02",caption:this.t("msgCombineItem.btn02"),location:'after'}],
                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgCombineItem.msg")}</div>)
                }
                let pResult = await dialog(tmpConfObj);
                if(pResult == 'btn01')
                {                   
                    this.barcode = 
                    {
                        name:"",
                        vat:0,
                        barcode: "",
                        code:"",
                        guid : "00000000-0000-0000-0000-000000000000",
                    }
                    this.barcodeReset()
                    return
                }
                else
                {
                    break
                }
                
            }
        }
        let tmpDocItems = {...this.docObj.docOrders.empty}
        tmpDocItems.REF = this.docObj.dt()[0].REF
        tmpDocItems.REF_NO = this.docObj.dt()[0].REF_NO
        tmpDocItems.ITEM_NAME = this.barcode.name
        tmpDocItems.ITEM_CODE = this.barcode.code
        tmpDocItems.ITEM = this.barcode.guid
        tmpDocItems.DOC_GUID = this.docObj.dt()[0].GUID
        tmpDocItems.TYPE = this.docObj.dt()[0].TYPE
        tmpDocItems.DOC_TYPE = this.docObj.dt()[0].DOC_TYPE
        tmpDocItems.LINE_NO = this.docObj.docOrders.dt().length
        tmpDocItems.REF = this.docObj.dt()[0].REF
        tmpDocItems.REF_NO = this.docObj.dt()[0].REF_NO
        tmpDocItems.INPUT = this.docObj.dt()[0].INPUT
        tmpDocItems.OUTPUT = this.docObj.dt()[0].OUTPUT
        tmpDocItems.DOC_DATE = this.docObj.dt()[0].DOC_DATE
        tmpDocItems.QUANTITY = pQuantity
        tmpDocItems.VAT_RATE = this.barcode.vat
        tmpDocItems.PRICE = this.txtPrice.value
        tmpDocItems.VAT = (this.txtVat.value * pQuantity).toFixed(2)
        tmpDocItems.AMOUNT = (this.txtPrice.value * pQuantity).toFixed(2)
        tmpDocItems.TOTAL = parseFloat(((this.txtPrice.value * pQuantity) + (this.txtVat.value * pQuantity))).toFixed(2)
        this.docObj.docOrders.addEmpty(tmpDocItems)
        this.barcodeReset()
        this._calculateTotal()
        await this.docObj.save()
    }
    calculateItemPrice()
    {
        this.txtVat.value =  parseFloat((this.txtPrice.value * (this.barcode.vat / 100) * this.txtQuantity.value).toFixed(2))
        this.txtAmount.value = parseFloat(((this.txtPrice.value * this.txtQuantity.value) + this.txtVat.value)).toFixed(2)
    }
    async _calculateTotal()
    {
        this.docObj.dt()[0].AMOUNT = this.docObj.docOrders.dt().sum("AMOUNT",2)
        this.docObj.dt()[0].DISCOUNT = this.docObj.docOrders.dt().sum("DISCOUNT",2)
        this.docObj.dt()[0].VAT = this.docObj.docOrders.dt().sum("VAT",2)
        this.docObj.dt()[0].TOTAL = this.docObj.docOrders.dt().sum("TOTAL",2)
    }
    render()
    {
        return(
            <ScrollView>
            <div>
                 <div className="row px-2 pt-2">
                    <div className="row px-2 pt-2" style={{visibility:this.state.tbMain,position:"absolute"}}>
                        <Form colCount={1}>
                            <Item>
                                <div className="row">
                                    <div className="col-8"></div>
                                    <div className="col-4">
                                        <DropDownButton text={this.t("btnDropmenu")} icon="menu" items={this.dropmenuMainItems}  onItemClick={this.dropmenuClick}/>
                                    </div>
                                </div>
                            </Item>
                            {/* txtRef-Refno */}
                            <Item>
                                <Label text={this.t("txtRefRefno")} alignment="right" />
                                <div className="row">
                                    <div className="col-5 pe-0">
                                        <NdTextBox id="txtRef" parent={this} simple={true} dt={{data:this.docObj.dt('DOC'),field:"REF"}}
                                        upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                        readOnly={true}
                                        maxLength={32}
                                        onChange={(async()=>
                                        {
                                            let tmpQuery = 
                                            {
                                                query :"SELECT ISNULL(MAX(REF_NO) + 1,1) AS REF_NO FROM DOC WHERE TYPE = 0 AND DOC_TYPE = 60 AND REF = @REF ",
                                                param : ['REF:string|25'],
                                                value : [this.txtRef.value]
                                            }
                                            let tmpData = await this.core.sql.execute(tmpQuery) 
                                            if(tmpData.result.recordset.length > 0)
                                            {
                                                this.txtRefno.value=tmpData.result.recordset[0].REF_NO
                                            }
                                        }).bind(this)}
                                        param={this.param.filter({ELEMENT:'txtRef',USERS:this.user.CODE})}
                                        access={this.access.filter({ELEMENT:'txtRef',USERS:this.user.CODE})}
                                        >
                                        <Validator validationGroup={"frmLabelQeueu"}>
                                                <RequiredRule message={this.t("validRef")} />
                                            </Validator>  
                                        </NdTextBox>
                                    </div>
                                    <div className="col-7 ps-0">
                                        <NdTextBox id="txtRefno" parent={this} simple={true} dt={{data:this.docObj.dt('DOC'),field:"REF_NO"}}
                                        upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                        readOnly={true}
                                        button=
                                        {
                                            [
                                                {
                                                    id:'01',
                                                    icon:'more',
                                                    onClick:async()=>
                                                    {
                                                        this.pg_Docs.show()
                                                        this.pg_Docs.onClick = (data) =>
                                                        {
                                                            if(data.length > 0)
                                                            {
                                                                this.getDoc(data[0].GUID,data[0].REF,data[0].REF_NO)
                                                            }
                                                        }
                                                    }
                                                },
                                                {
                                                    id:'02',
                                                    icon:'arrowdown',
                                                    onClick:()=>
                                                    {
                                                        this.txtRefno.value = Math.floor(Date.now() / 1000)
                                                    }
                                                }
                                            ]
                                        }
                                        onChange={(async()=>
                                        {
                                            let tmpResult = await this.checkDoc('00000000-0000-0000-0000-000000000000',this.txtRef.value,this.txtRefno.value)
                                            if(tmpResult == 3)
                                            {
                                                this.txtRefno.value = "";
                                            }
                                        }).bind(this)}
                                        param={this.param.filter({ELEMENT:'txtRefno',USERS:this.user.CODE})}
                                        access={this.access.filter({ELEMENT:'txtRefno',USERS:this.user.CODE})}
                                        >
                                        <Validator validationGroup={"frmLabelQeueu"}>
                                                <RequiredRule message={this.t("validRefNo")} />
                                            </Validator> 
                                        </NdTextBox>
                                    </div>
                                </div>
                                {/*EVRAK SEÇİM */}
                                <NdPopGrid id={"pg_Docs"} parent={this} container={"#root"}
                                visible={false}
                                position={{of:'#root'}}
                                showTitle={true} 
                                showBorders={true}
                                width={'90%'}
                                height={'90%'}
                                selection={{mode:"single"}}
                                title={this.t("pg_Docs.title")} 
                                data={{source:{select:{query : "SELECT GUID,REF,REF_NO,OUTPUT_CODE,OUTPUT_NAME FROM DOC_VW_01 WHERE TYPE = 0 AND DOC_TYPE = 60 AND REBATE = 0"},sql:this.core.sql}}}
                                button=
                                {
                                    [
                                        {
                                            id:'01',
                                            icon:'more',
                                            onClick:()=>
                                            {

                                            }
                                        }
                                    ]
                                }
                                >
                                <Column dataField="REF" caption={this.t("pg_Docs.clmRef")} width={150} defaultSortOrder="asc"/>
                                <Column dataField="REF_NO" caption={this.t("pg_Docs.clmRefNo")} width={300} defaultSortOrder="asc" />
                                <Column dataField="OUTPUT_NAME" caption={this.t("pg_Docs.clmOutputName")} width={300} defaultSortOrder="asc" />
                                <Column dataField="OUTPUT_CODE" caption={this.t("pg_Docs.clmOutputCode")} width={300} defaultSortOrder="asc" />
                                </NdPopGrid>
                            </Item>
                            {/* Depot */}
                            <Item>
                                <Label text={this.t("txtDepot")} alignment="right" />
                                <NdSelectBox simple={true} parent={this} id="cmbDepot" notRefresh = {true}
                                dt={{data:this.docObj.dt('DOC'),field:"INPUT"}}  
                                displayExpr="NAME"
                                valueExpr="GUID"
                                value=""
                                searchEnabled={true}
                                onValueChanged={(async(e)=>
                                    {
                                        
                                    }).bind(this)}
                                data={{source:{select:{query : "SELECT * FROM DEPOT_VW_01"},sql:this.core.sql}}}
                                param={this.param.filter({ELEMENT:'cmbDepot',USERS:this.user.CODE})}
                                access={this.access.filter({ELEMENT:'cmbDepot',USERS:this.user.CODE})}
                                >
                                </NdSelectBox>
                            </Item>
                            {/* txtCustomerCode */}
                            <Item>
                                <Label text={this.t("txtCustomerCode")} alignment="right" />
                                <div className="row">
                                    <div className="col-12">
                                        <NdTextBox id="txtCustomerCode" parent={this} simple={true}
                                        upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                        dt={{data:this.docObj.dt('DOC'),field:"OUTPUT_CODE"}}
                                        onEnterKey={(async()=>
                                            {
                                                await this.pg_CustomerSelect.setVal(this.txtCustomerCode.value)
                                                this.pg_CustomerSelect.show()
                                                this.pg_CustomerSelect.onClick = (data) =>
                                                {
                                                    if(data.length > 0)
                                                    {
                                                        this.docObj.dt()[0].OUTPUT = data[0].GUID
                                                        this.docObj.dt()[0].OUTPUT_CODE = data[0].CODE
                                                        this.docObj.dt()[0].OUTPUT_NAME = data[0].TITLE
                                                        let tmpData = this.sysParam.filter({ID:'refForCustomerCode',USERS:this.user.CODE}).getValue()
                                                        if(typeof tmpData != 'undefined' && tmpData.value ==  true)
                                                        {
                                                            this.txtRef.value=data[0].CODE;
                                                            this.txtRef.props.onChange()
                                                        }
                                                    }
                                                }
                                            }).bind(this)}
                                        button=
                                        {
                                            [
                                                {
                                                    id:'01',
                                                    icon:'more',
                                                    onClick:async()=>
                                                    {
                                                        console.log(111111)
                                                        this.pg_CustomerSelect.show()
                                                        this.pg_CustomerSelect.onClick = (data) =>
                                                        {
                                                            if(data.length > 0)
                                                            {
                                                                console.log(this.docObj.dt())
                                                                this.docObj.dt()[0].OUTPUT = data[0].GUID
                                                                this.docObj.dt()[0].OUTPUT_CODE = data[0].CODE
                                                                this.docObj.dt()[0].OUTPUT_NAME = data[0].TITLE
                                                                let tmpData = this.sysParam.filter({ID:'refForCustomerCode',USERS:this.user.CODE}).getValue()
                                                                console.log(this.txtCustomerCode)
                                                                if(typeof tmpData != 'undefined' && tmpData.value ==  true)
                                                                {
                                                                    this.txtRef.value=data[0].CODE;
                                                                    this.txtRef.props.onChange()
                                                                }
                                                            }
                                                        }
                                                    }
                                                },
                                                {
                                                    id:'02',
                                                    icon:'arrowdown',
                                                    onClick:()=>
                                                    {
                                                        
                                                    }
                                                }
                                            ]
                                        }
                                        onChange={(async()=>
                                        {
                                            
                                        }).bind(this)}
                                        param={this.param.filter({ELEMENT:'txtCustomerCode',USERS:this.user.CODE})}
                                        access={this.access.filter({ELEMENT:'txtCustomerCode',USERS:this.user.CODE})}
                                        >
                                        </NdTextBox>
                                    </div>
                                </div>
                                {/*CARİ SEÇİM */}
                                <NdPopGrid id={"pg_CustomerSelect"} parent={this} container={"#root"}
                                visible={false}
                                position={{of:'#root'}} 
                                showTitle={true} 
                                showBorders={true}
                                width={'90%'}
                                height={'90%'}
                                selection={{mode:"single"}}
                                title={this.t("pg_CustomerSelect.title")} 
                                search={true}
                                data = 
                                {{
                                    source:
                                    {
                                        select:
                                        {
                                            query : "SELECT GUID,CODE,TITLE,NAME,LAST_NAME,[TYPE_NAME],[GENUS_NAME] FROM CUSTOMER_VW_01 WHERE UPPER(CODE) LIKE UPPER(@VAL) OR UPPER(TITLE) LIKE UPPER(@VAL)",
                                            param : ['VAL:string|50']
                                        },
                                        sql:this.core.sql
                                    }
                                }}
                                >
                                    <Column dataField="CODE" caption={this.t("pg_CustomerSelect.clmCode")} width={150} />
                                    <Column dataField="TITLE" caption={this.t("pg_CustomerSelect.clmTitle")} width={200} defaultSortOrder="asc" />
                                    <Column dataField="TYPE_NAME" caption={this.t("pg_CustomerSelect.clmTypeName")} width={100} />
                                    <Column dataField="GENUS_NAME" caption={this.t("pg_CustomerSelect.clmGenusName")} width={100} />
                                </NdPopGrid>
                            </Item> 
                            {/* txtCustomerName */}
                            <Item>
                                <Label text={this.t("txtCustomerName")} alignment="right" />
                                <NdTextBox id="txtCustomerName" parent={this} simple={true}  
                                readOnly={true}
                                upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                dt={{data:this.docObj.dt('DOC'),field:"OUTPUT_NAME"}} 
                                param={this.param.filter({ELEMENT:'txtCustomerName',USERS:this.user.CODE})}
                                access={this.access.filter({ELEMENT:'txtCustomerName',USERS:this.user.CODE})}
                                >
                                </NdTextBox>
                            </Item> 
                            {/* txtDate */}
                            <Item>
                                <Label text={this.t("txtDate")} alignment="right" />
                                <NdDatePicker simple={true}  parent={this} id={"dtDocDate"}
                                dt={{data:this.docObj.dt('DOC'),field:"DOC_DATE"}}
                                onValueChanged={(async()=>
                                    {
                                }).bind(this)}
                                >
                                    <Validator validationGroup={"frmslsDoc"}>
                                        <RequiredRule message={this.t("validDocDate")} />
                                    </Validator> 
                                </NdDatePicker>
                            </Item>
                            <Item>
                                <div className="row">
                                    <div className="col-6 px-4 pt-4">
                                        <NdButton text={this.t("btnBarcodeEntry")} type="default" width="100%" onClick={()=>this.pageChange("Barcode")}></NdButton>
                                    </div>
                                    <div className="col-6 px-4 pt-4">
                                        <NdButton text={this.t("btnDocument")} type="default" width="100%" onClick={()=>this.pageChange("Document")}></NdButton>
                                    </div>
                                </div>
                            </Item>
                        </Form>
                    </div>
                    <div className="row px-2 pt-2" style={{visibility:this.state.tbBarcode,position:"absolute"}}>
                        <Form colCount={1}>
                            <Item>
                            <div className="row">
                                <div className="col-4 px-2 pt-2">
                                    <NdButton icon="arrowleft" type="default" width="100%" onClick={()=>this.pageChange("Main")}></NdButton>
                                </div>
                                <div className="col-4 px-2 pt-2">
                                    <NdButton icon="detailslayout" type="default" width="100%" onClick={()=>this.pageChange("Document")}></NdButton>
                                </div>
                                <div className="col-4 px-2 pt-2">
                                    
                                    <NdCheckBox id="chkAutoAdd" text={this.t("chkAutoAdd")} parent={this} defaultValue={false} 
                                    param={this.param.filter({ELEMENT:'chkAutoAdd',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'chkAutoAdd',USERS:this.user.CODE})}/>
                                </div>
                            </div>
                            </Item>
                            <Item>
                            <div className="col-12 px-1 pt-1">
                                    <NdTextBox id="txtBarcode" parent={this} placeholder={this.t("txtBarcodePlace")}
                                    button=
                                    {
                                    [
                                        {
                                            id:'01',
                                            icon:'more',
                                            onClick:async()=>
                                            {
                                                this.popItemCode.show()
                                                this.popItemCode.onClick = async(data) =>
                                                {
                                                    if(data.length == 1)
                                                    {
                                                        this.txtBarcode.value = data[0].CODE
                                                        this.barcode = {
                                                            name:data[0].NAME,
                                                            code:data[0].CODE,
                                                            barcode:data[0].BARCODE,
                                                            guid : data[0].GUID,
                                                            vat : data[0].VAT
                                                        }
                                                        await this.setBarcode()
                                                        this.setState({tbBarcode:"visible"})
                                                    }
                                                    else if(data.length > 1)
                                                    {
                                                        for (let i = 0; i < data.length; i++) 
                                                        {
                                                            this.txtBarcode.value = data[i].CODE
                                                            this.barcode = {
                                                                name:data[i].NAME,
                                                                code:data[i].CODE,
                                                                barcode:data[i].BARCODE,
                                                                guid : data[0].GUID,
                                                                vat : data[0].VAT
                                                            }
                                                            await this.setBarcode()
                                                            await this.addItem()
                                                        }
                                                        let tmpConfObj = 
                                                        {
                                                            id:'msgItemsAdd',showTitle:true,title:this.t("msgItemsAdd.title"),showCloseButton:true,width:'350px',height:'200px',
                                                            button:[{id:"btn01",caption:this.t("msgItemsAdd.btn01"),location:'after'}],
                                                            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgItemsAdd.msg")}</div>)
                                                        }
                                                        await dialog(tmpConfObj);
                                                    }
                                                }
                                            }
                                        },
                                        {
                                            id:'02',
                                            icon:'photo',
                                            onClick:async()=>
                                            {
                                                this.barcodeScan()
                                            }
                                        }
                                    ]
                                    }
                                    onEnterKey={(async(e)=>
                                        {
                                            if(e.component._changedValue == "")
                                            {
                                                return
                                            }
                                            let tmpQuery = 
                                            {
                                                query : "SELECT ITEM_CODE AS CODE,ITEM_NAME AS NAME,ITEM_GUID AS GUID,BARCODE, ISNULL((SELECT VAT FROM ITEMS WHERE ITEMS.GUID = ITEM_BARCODE_VW_01.ITEM_GUID),0) AS VAT FROM ITEM_BARCODE_VW_01  WHERE BARCODE = @BARCODE OR ITEM_CODE = @BARCODE ",
                                                param : ['BARCODE:string|50'],
                                                value : [e.component._changedValue]
                                            }
                                            let tmpData = await this.core.sql.execute(tmpQuery) 
                                            if(tmpData.result.recordset.length >0)
                                            {
                                                this.barcode.name = tmpData.result.recordset[0].NAME
                                                this.barcode.barcode = tmpData.result.recordset[0].BARCODE 
                                                this.barcode.code = tmpData.result.recordset[0].CODE 
                                                this.barcode.guid = tmpData.result.recordset[0].GUID 
                                                this.barcode.vat = tmpData.result.recordset[0].VAT 
                                                this.setBarcode()
                                                
                                            }
                                            else
                                            {
                                                let tmpConfObj = 
                                                {
                                                    id:'msgBarcodeNotFound',showTitle:true,title:this.t("msgBarcodeNotFound.title"),showCloseButton:true,width:'350px',height:'200px',
                                                    button:[{id:"btn01",caption:this.t("msgBarcodeNotFound.btn01"),location:'after'}],
                                                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgBarcodeNotFound.msg")}</div>)
                                                }
                                                await dialog(tmpConfObj);
                                                this.txtBarcode.value = ""
                                            }
                                            
                                        }).bind(this)}></NdTextBox>
                                </div>
                            </Item>
                            <Item> 
                                <div>
                                    <h4 className="text-center">
                                        {this.barcode.name}
                                    </h4>
                                </div>
                            </Item>
                            {/* txtQuantity */}
                        <Item>
                                <Label text={this.t("txtQuantity")}/>
                                <NdTextBox id="txtQuantity" parent={this} simple={true}  
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    param={this.param.filter({ELEMENT:'txtQuantity',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'txtQuantity',USERS:this.user.CODE})}
                                    onValueChanged={(async(e)=>
                                    {
                                    this.calculateItemPrice()
                                    }).bind(this)}
                                    onEnterKey={(async(e)=>
                                        {
                                            this.addItem()
                                        }).bind(this)}
                                    >
                                </NdTextBox>
                            </Item>
                            {/* txtPrice */}
                            <Item>
                            <Label text={this.t("txtPrice")} alignment="right" />
                            <NdNumberBox id="txtPrice" parent={this} simple={true}
                            param={this.param.filter({ELEMENT:'txtPrice',USERS:this.user.CODE})}
                            access={this.access.filter({ELEMENT:'txtPrice',USERS:this.user.CODE})}
                            onValueChanged={(async(e)=>
                                {
                                this.calculateItemPrice()
                                }).bind(this)}
                                onEnterKey={(async(e)=>
                                    {
                                        this.addItem()
                                    }).bind(this)}
                            >
                            </NdNumberBox>
                            </Item>
                            {/* txtVat */}
                            <Item>
                                <Label text={this.t("txtVat")} alignment="right" />
                                <NdTextBox id="txtVat" parent={this} simple={true}  
                                readOnly={true}
                                param={this.param.filter({ELEMENT:'txtVat',USERS:this.user.CODE})}
                                access={this.access.filter({ELEMENT:'txtVat',USERS:this.user.CODE})}
                                >
                                </NdTextBox>
                            </Item>
                            {/* txtDiscount */}
                            {/* <Item>
                                <Label text={this.t("txtDiscount")} alignment="right" />
                                <NdTextBox id="txtDiscount" parent={this} simple={true}  
                                upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                readOnly={true}
                                param={this.param.filter({ELEMENT:'txtDiscount',USERS:this.user.CODE})}
                                access={this.access.filter({ELEMENT:'txtDiscount',USERS:this.user.CODE})}
                                >
                                </NdTextBox>
                            </Item> */}
                            {/* txtAmount */}
                            <Item>
                                <Label text={this.t("txtAmount")} alignment="right" />
                                <NdTextBox id="txtAmount" parent={this} simple={true}  
                                upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                readOnly={true}
                                param={this.param.filter({ELEMENT:'txtAmount',USERS:this.user.CODE})}
                                access={this.access.filter({ELEMENT:'txtAmount',USERS:this.user.CODE})}
                                >
                                </NdTextBox>
                            </Item>
                            <Item>
                                <div className="row">
                                    <div className="col-12 px-1 pt-1">
                                        <NdButton text={this.t("btnItemAdd")} type="default" width="100%" onClick={()=>this.addItem(this.txtQuantity.value)}></NdButton>
                                    </div>
                                </div>
                            </Item>
                        </Form>
                        <div style={{visibility:this.state.grid}}>
                            <Form>
                                <Item>
                                    <NdGrid parent={this} id={"grdChkCustomer"} 
                                    showBorders={true} 
                                    columnsAutoWidth={true} 
                                    allowColumnReordering={true} 
                                    allowColumnResizing={true} 
                                    height={'100%'} 
                                    width={'100%'}
                                    dbApply={false}
                                    >
                                        <Paging defaultPageSize={5} />
                                        <Editing mode="cell" allowUpdating={false} allowDeleting={false} />
                                        <Column dataField="CUSTOMER" caption={this.t("grdChkCustomer.clmCustomer")} width={80}/>
                                        <Column dataField="PRICE" caption={this.t("grdChkCustomer.clmPrice")} dataType="number" format={{ style: "currency", currency: "EUR",precision: 2}} width={70}/>
                                        <Column dataField="PRICE_DATE" caption={this.t("grdChkCustomer.clmDate")} width={100} />
                                    </NdGrid>
                                </Item>
                            </Form>           
                        </div>
                    </div>
                    <div className="row px-2 pt-2" style={{visibility:this.state.tbDocument,position:"absolute"}}>
                        <Form colCount={1} >
                        <Item>
                            <div className="row">
                                <div className="col-4 px-2 pt-2">
                                    <NdButton icon="arrowleft" type="default" width="100%" onClick={()=>this.pageChange("Main")}></NdButton>
                                </div>
                                <div className="col-4 px-2 pt-2">
                                    <NdButton icon="plus" type="default" width="100%" onClick={()=>this.pageChange("Barcode")}></NdButton>
                                </div>
                                <div className="col-4">
                                        <DropDownButton text={this.t("btnDropmenu")} icon="menu" items={this.dropmenuDocItems}  onItemClick={this.dropmenuClick}/>
                                </div>
                            </div>
                        </Item>
                        <Item>
                            <NdGrid parent={this} id={"grdSlsOrder"} 
                            showBorders={true} 
                            columnsAutoWidth={true} 
                            allowColumnReordering={true} 
                            allowColumnResizing={true} 
                            height={'250'} 
                            width={'100%'}
                            dbApply={false}
                            onRowUpdated={async(e)=>{
                                let rowIndex = e.component.getRowIndexByKey(e.key)

                                if(typeof e.data.DISCOUNT_RATE != 'undefined')
                                {
                                    e.key.DISCOUNT = parseFloat((((this.docObj.docOrders.dt()[rowIndex].AMOUNT * e.data.DISCOUNT_RATE) / 100)).toFixed(2))
                                }

                                if(e.key.COST_PRICE > e.key.PRICE )
                                {
                                    let tmpData = this.acsobj.filter({ID:'underMinCostPrice',USERS:this.user.CODE}).getValue()
                                    if(typeof tmpData != 'undefined' && tmpData ==  true)
                                    {
                                        let tmpConfObj =
                                        {
                                            id:'msgUnderPrice1',showTitle:true,title:this.t("msgUnderPrice1.title"),showCloseButton:true,width:'500px',height:'200px',
                                            button:[{id:"btn01",caption:this.t("msgUnderPrice1.btn01"),location:'before'},{id:"btn02",caption:this.t("msgUnderPrice1.btn02"),location:'after'}],
                                            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgUnderPrice1.msg")}</div>)
                                        }
                                        
                                        let pResult = await dialog(tmpConfObj);
                                        if(pResult == 'btn01')
                                        {
                                            
                                        }
                                        else if(pResult == 'btn02')
                                        {
                                            return
                                        }
                                    }
                                    else
                                    {
                                        let tmpConfObj =
                                        {
                                            id:'msgUnderPrice2',showTitle:true,title:"Uyarı",showCloseButton:true,width:'500px',height:'200px',
                                            button:[{id:"btn01",caption:this.t("msgUnderPrice2.btn01"),location:'after'}],
                                            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{"msgUnderPrice2.msg"}</div>)
                                        }
                                        dialog(tmpConfObj);
                                        return
                                    }
                                }
                                if(e.key.DISCOUNT > (e.key.PRICE * e.key.QUANTITY))
                                {
                                    let tmpConfObj =
                                    {
                                        id:'msgDiscount',showTitle:true,title:"Uyarı",showCloseButton:true,width:'500px',height:'200px',
                                        button:[{id:"btn01",caption:this.t("msgDiscount.btn01"),location:'after'}],
                                        content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgDiscount.msg")}</div>)
                                    }
                                
                                    dialog(tmpConfObj);
                                    this.docObj.docOrders.dt()[rowIndex].DISCOUNT = 0 
                                    return
                                }
                                if(this.docObj.docOrders.dt()[rowIndex].VAT > 0)
                                {
                                    this.docObj.docOrders.dt()[rowIndex].VAT = parseFloat(((((e.key.PRICE * e.key.QUANTITY) - e.key.DISCOUNT) * (e.key.VAT_RATE) / 100)).toFixed(2));
                                }
                                this.docObj.docOrders.dt()[rowIndex].AMOUNT = parseFloat((e.key.PRICE * e.key.QUANTITY).toFixed(2))
                                this.docObj.docOrders.dt()[rowIndex].TOTAL = parseFloat((((e.key.PRICE * e.key.QUANTITY) - e.key.DISCOUNT) +this.docObj.docOrders.dt()[rowIndex].VAT).toFixed(2))

                                let tmpMargin = (this.docObj.docOrders.dt()[rowIndex].TOTAL - this.docObj.docOrders.dt()[rowIndex].VAT) - (this.docObj.docOrders.dt()[rowIndex].COST_PRICE * this.docObj.docOrders.dt()[rowIndex].QUANTITY)
                                let tmpMarginRate = (tmpMargin /(this.docObj.docOrders.dt()[rowIndex].TOTAL - this.docObj.docOrders.dt()[rowIndex].VAT)) * 100
                                this.docObj.docOrders.dt()[rowIndex].MARGIN = tmpMargin.toFixed(2) + "€ / %" +  tmpMarginRate.toFixed(2)
                                if(this.docObj.docOrders.dt()[rowIndex].DISCOUNT > 0)
                                {
                                    this.docObj.docOrders.dt()[rowIndex].DISCOUNT_RATE = parseFloat((100 - ((((e.key.PRICE * e.key.QUANTITY) - e.key.DISCOUNT) / (e.key.PRICE * e.key.QUANTITY)) * 100)).toFixed(2))
                                }
                                console.log(this.docObj.docOrders.dt()[rowIndex].MARGIN)
                                this._calculateTotal()
                                
                            }}
                            onRowRemoved={async (e)=>{
                                this._calculateTotal()
                                await this.docObj.save()
                            }}
                            >
                                <KeyboardNavigation editOnKeyPress={true} enterKeyAction={'moveFocus'} enterKeyDirection={'row'} />
                                <Scrolling mode="infinite" />
                                <Editing mode="cell" allowUpdating={true} allowDeleting={true} confirmDelete={false}/>
                                <Export fileName={this.lang.t("menu.sip_02_002")} enabled={true} allowExportSelectedData={true} />
                                <Column dataField="CDATE_FORMAT" caption={this.t("grdSlsOrder.clmCreateDate")} width={150} allowEditing={false}/>
                                <Column dataField="ITEM_CODE" caption={this.t("grdSlsOrder.clmItemCode")} width={150} editCellRender={this._cellRoleRender}/>
                                <Column dataField="ITEM_NAME" caption={this.t("grdSlsOrder.clmItemName")} width={350} />
                                <Column dataField="PRICE" caption={this.t("grdSlsOrder.clmPrice")} dataType={'number'} format={{ style: "currency", currency: "EUR",precision: 3}} width={150}/>
                                <Column dataField="QUANTITY" caption={this.t("grdSlsOrder.clmQuantity")} dataType={'number'} width={150}/>
                                <Column dataField="AMOUNT" caption={this.t("grdSlsOrder.clmAmount")} allowEditing={false} format={{ style: "currency", currency: "EUR",precision: 3}} width={150}/>
                                <Column dataField="DISCOUNT" caption={this.t("grdSlsOrder.clmDiscount")} dataType={'number'} format={{ style: "currency", currency: "EUR",precision: 3}} width={150}/>
                                <Column dataField="DISCOUNT_RATE" caption={this.t("grdSlsOrder.clmDiscountRate")} dataType={'number'} width={150}/>
                                <Column dataField="VAT" caption={this.t("grdSlsOrder.clmVat")} format={{ style: "currency", currency: "EUR",precision: 3}} allowEditing={false} width={150}/>
                                <Column dataField="TOTAL" caption={this.t("grdSlsOrder.clmTotal")} format={{ style: "currency", currency: "EUR",precision: 3}} allowEditing={false} width={150}/>
                            </NdGrid>
                        </Item>
                        </Form>
                        <div className="row px-1 pt-1">
                                <div className="col-12">
                                    <Form colCount={4} parent={this} id="frmslsDoc">
                                        {/* Ara Toplam */}
                                        <Item  >
                                        <Label text={this.t("txtAmount")} alignment="right" />
                                            <NdTextBox id="txtGrandAmount" parent={this} simple={true} readOnly={true} dt={{data:this.docObj.dt('DOC'),field:"AMOUNT"}}
                                            maxLength={32}
                                        
                                            ></NdTextBox>
                                        </Item>
                                        {/* İndirim */}
                                        <Item>
                                        <Label text={this.t("txtDiscount")} alignment="right" />
                                            <NdTextBox id="txtGrandDiscount" parent={this} simple={true} readOnly={true} dt={{data:this.docObj.dt('DOC'),field:"DISCOUNT"}}
                                            maxLength={32}
                                            button=
                                            {
                                                [
                                                    {
                                                        id:'01',
                                                        icon:'more',
                                                        onClick:()  =>
                                                        {
                                                            if(this.docObj.dt()[0].DISCOUNT > 0 )
                                                            {
                                                                this.txtDiscountPercent.value  = parseFloat((100 - (((this.docObj.dt()[0].AMOUNT - this.docObj.dt()[0].DISCOUNT) / this.docObj.dt()[0].AMOUNT) * 100)).toFixed(2))
                                                                this.txtDiscountPrice.value = this.docObj.dt()[0].DISCOUNT
                                                            }
                                                            this.popDiscount.show()
                                                        }
                                                    },
                                                ]
                                            }
                                            ></NdTextBox>
                                        </Item>
                                        {/* KDV */}
                                        <Item>
                                        <Label text={this.t("txtVat")} alignment="right" />
                                            <NdTextBox id="txtGrandVat" parent={this} simple={true} readOnly={true} dt={{data:this.docObj.dt('DOC'),field:"VAT"}}
                                            maxLength={32}
                                            button=
                                            {
                                                [
                                                    {
                                                        id:'01',
                                                        icon:'clear',
                                                        onClick:async ()  =>
                                                        {
                                                            
                                                            let tmpConfObj =
                                                            {
                                                                id:'msgVatDelete',showTitle:true,title:this.t("msgVatDelete.title"),showCloseButton:true,width:'500px',height:'200px',
                                                                button:[{id:"btn01",caption:this.t("msgVatDelete.btn01"),location:'before'},{id:"btn02",caption:this.t("msgSave.btn02"),location:'after'}],
                                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgVatDelete.msg")}</div>)
                                                            }
                                                            
                                                            let pResult = await dialog(tmpConfObj);
                                                            if(pResult == 'btn01')
                                                            {
                                                                for (let i = 0; i < this.docObj.docOrders.dt().length; i++) 
                                                                {
                                                                    this.docObj.docOrders.dt()[i].VAT = 0  
                                                                    this.docObj.docOrders.dt()[i].VAT_RATE = 0
                                                                    this.docObj.docOrders.dt()[i].TOTAL = (this.docObj.docOrders.dt()[i].PRICE * this.docObj.docOrders.dt()[i].QUANTITY) - this.docObj.docOrders.dt()[i].DISCOUNT
                                                                    this._calculateTotal()
                                                                }
                                                            }
                                                        }
                                                    },
                                                ]
                                            }
                                            ></NdTextBox>
                                        </Item>
                                        {/* KDV */}
                                        <Item>
                                        <Label text={this.t("txtGrandTotal")} alignment="right" />
                                            <NdTextBox id="txtGrandTotal" parent={this} simple={true} readOnly={true} dt={{data:this.docObj.dt('DOC'),field:"TOTAL"}}
                                            maxLength={32}
                                            //param={this.param.filter({ELEMENT:'txtRef',USERS:this.user.CODE})}
                                            //access={this.access.filter({ELEMENT:'txtRef',USERS:this.user.CODE})}
                                            ></NdTextBox>
                                        </Item>
                                    </Form>
                                </div>
                            </div>
                    </div>
                    {/* Stok Seçim */}
                    <NdPopGrid id={"popItemCode"} parent={this} container={"#root"}
                        visible={false}
                        position={{of:'#root'}} 
                        showTitle={true} 
                        showBorders={true}
                        width={'90%'}
                        height={'90%'}
                        title={this.t("popItemCode.title")} //
                        search={true}
                        selection={{mode:"single"}}
                        data = 
                        {{
                            source:
                            {
                                select:
                                {
                                    query : "SELECT  *,  " +
                                            "CASE WHEN UNDER_UNIT_VALUE =0  " +
                                            "THEN 0 " +
                                            "ELSE " +
                                            "ROUND((PRICE * UNDER_UNIT_VALUE),2) " +
                                            "END AS UNDER_UNIT_PRICE " +
                                            "FROM  (  SELECT GUID,   " +
                                            "CODE,   " +
                                            "NAME,   " +
                                            "VAT,   " +
                                            "ISNULL((SELECT TOP 1 BARCODE FROM ITEM_BARCODE WHERE ITEM = ITEMS_VW_01.GUID ORDER BY CDATE DESC),'') AS BARCODE,   " +
                                            "MAIN_GRP AS ITEM_GRP,   " +
                                            "MAIN_GRP_NAME AS ITEM_GRP_NAME,   " +
                                            "(SELECT [dbo].[FN_PRICE_SALE](GUID,1,GETDATE())) AS PRICE  , " +
                                            "ISNULL((SELECT TOP 1 FACTOR FROM ITEM_UNIT WHERE TYPE = 1 AND ITEM_UNIT.ITEM = ITEMS_VW_01.GUID),0) AS UNDER_UNIT_VALUE " +
                                            "FROM ITEMS_VW_01 WHERE ISNULL((SELECT TOP 1 BARCODE FROM ITEM_BARCODE WHERE ITEM = ITEMS_VW_01.GUID),'') <> '') AS TMP " +
                                            "WHERE UPPER(CODE) LIKE UPPER(@VAL) OR UPPER(NAME) LIKE UPPER(@VAL) " ,
                                    param : ['VAL:string|50']
                                },
                                sql:this.core.sql
                            }
                        }}
                        >
                            <Column dataField="CODE" caption={this.t("popItemCode.clmCode")} width={100} />
                            <Column dataField="NAME" caption={this.t("popItemCode.clmName")} defaultSortOrder="asc" />
                        </NdPopGrid>
                        {/* İndirim PopUp */}
                        <div>
                                <NdPopUp parent={this} id={"popDiscount"} 
                                visible={false}
                                showCloseButton={true}
                                showTitle={true}
                                title={this.t("popDiscount.title")}
                                container={"#root"} 
                                width={'350'}
                                height={'250'}
                                position={{of:'#root'}}
                                >
                                    <Form colCount={1} height={'fit-content'}>
                                        <Item>
                                            <Label text={this.t("popDiscount.Percent")} alignment="right" />
                                            <NdNumberBox id="txtDiscountPercent" parent={this} simple={true}
                                                    maxLength={32}
                                                    onValueChanged={(async()=>
                                                        {
                                                            if( this.txtDiscountPercent.value > 100)
                                                            {
                                                                let tmpConfObj =
                                                                {
                                                                    id:'msgDiscountPercent',showTitle:true,title:this.t("msgDiscountPercent.title"),showCloseButton:true,width:'500px',height:'200px',
                                                                    button:[{id:"btn01",caption:this.t("msgDiscountPercent.btn01"),location:'after'}],
                                                                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgDiscountPercent.msg")}</div>)
                                                                }
                                                    
                                                                await dialog(tmpConfObj);
                                                                this.txtDiscountPercent.value = 0;
                                                                this.txtDiscountPrice.value = 0;
                                                                return
                                                            }
                                                            this.txtDiscountPrice.value =  parseFloat((this.docObj.dt()[0].AMOUNT * this.txtDiscountPercent.value / 100).toFixed(3))
                                                    }).bind(this)}
                                            ></NdNumberBox>
                                        </Item>
                                        <Item>
                                        <Label text={this.t("popDiscount.Price")} alignment="right" />
                                        <NdNumberBox id="txtDiscountPrice" parent={this} simple={true}
                                            maxLength={32}
                                            onValueChanged={(async()=>
                                                {
                                                    if( this.txtDiscountPrice.value > this.docObj.dt()[0].AMOUNT)
                                                    {
                                                        let tmpConfObj =
                                                        {
                                                            id:'msgDiscountPrice',showTitle:true,title:this.t("msgDiscountPrice.title"),showCloseButton:true,width:'500px',height:'200px',
                                                            button:[{id:"btn01",caption:this.t("msgDiscountPrice.btn01"),location:'after'}],
                                                            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgDiscountPrice.msg")}</div>)
                                                        }
                                            
                                                        await dialog(tmpConfObj);
                                                        this.txtDiscountPercent.value = 0;
                                                        this.txtDiscountPrice.value = 0;
                                                        return
                                                    }
                                                    this.txtDiscountPercent.value = parseFloat((100 - (((this.docObj.dt()[0].AMOUNT - this.txtDiscountPrice.value) / this.docObj.dt()[0].AMOUNT) * 100)).toFixed(3))
                                            }).bind(this)}
                                        ></NdNumberBox>
                                        </Item>
                                        <Item>
                                            <div className='row'>
                                                <div className='col-6'>
                                                    <NdButton text={this.lang.t("btnSave")} type="normal" stylingMode="contained" width={'100%'} 
                                                    onClick={async ()=>
                                                    {       
                                                        for (let i = 0; i < this.docObj.docOrders.dt().length; i++) 
                                                        {
                                                            this.docObj.docOrders.dt()[i].DISCOUNT_RATE = this.txtDiscountPercent.value
                                                            this.docObj.docOrders.dt()[i].DISCOUNT =  parseFloat((((this.docObj.docOrders.dt()[i].PRICE * this.docObj.docOrders.dt()[i].QUANTITY) * this.txtDiscountPercent.value) / 100).toFixed(3))
                                                            if(this.docObj.docOrders.dt()[i].VAT > 0)
                                                            {
                                                                this.docObj.docOrders.dt()[i].VAT = parseFloat(((this.docObj.docOrders.dt()[i].PRICE * this.docObj.docOrders.dt()[i].QUANTITY) * (this.docObj.docOrders.dt()[i].VAT_RATE / 100)).toFixed(3))
                                                            }
                                                            this.docObj.docOrders.dt()[i].TOTAL = parseFloat(((this.docObj.docOrders.dt()[i].PRICE * this.docObj.docOrders.dt()[i].QUANTITY) + this.docObj.docOrders.dt()[i].VAT - this.docObj.docOrders.dt()[i].DISCOUNT).toFixed(3))
                                                        }
                                                        this._calculateTotal()
                                                        this.popDiscount.hide(); 
                                                    }}/>
                                                </div>
                                                <div className='col-6'>
                                                    <NdButton text={this.lang.t("btnCancel")} type="normal" stylingMode="contained" width={'100%'}
                                                    onClick={()=>
                                                    {
                                                        this.popDiscount.hide();  
                                                    }}/>
                                                </div>
                                            </div>
                                        </Item>
                                    </Form>
                                </NdPopUp>
                        </div>  
                        {/* Miktar Dialog  */}
                        <NdDialog id={"msgQuantity"} container={"#root"} parent={this}
                            position={{of:'#root'}} 
                            showTitle={true} 
                            title={this.t("msgQuantity.title")} 
                            showCloseButton={false}
                            width={"350px"}
                            height={"250px"}
                            button={[{id:"btn01",caption:this.t("msgQuantity.btn01"),location:'after'}]}
                            >
                                <div className="row">
                                    <div className="col-12 py-2">
                                        <div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgQuantity.msg")}</div>
                                    </div>
                                    <div className="col-12 py-2">
                                    <Form>
                                        {/* checkCustomer */}
                                        <Item>
                                            <Label text={this.t("txtQuantity")} alignment="right" />
                                            <NdTextBox id="txtPopQuantity" parent={this} simple={true}  
                                            >
                                        </NdTextBox>
                                        </Item>
                                    </Form>
                                </div>
                                </div>
                                <div className='row'>
                                
                                </div>
                            
                        </NdDialog>  
                </div>
            </div>
            </ScrollView>
       
        )
    }
}