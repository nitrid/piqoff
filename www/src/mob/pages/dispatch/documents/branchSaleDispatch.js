import React from 'react';
import App from '../../../lib/app.js';
import { docCls,docItemsCls, docCustomerCls } from '../../../../core/cls/doc.js';
import moment from 'moment';

import ScrollView from 'devextreme-react/scroll-view';
import Toolbar from 'devextreme-react/toolbar';
import Form, { Label,Item,EmptyItem } from 'devextreme-react/form';
import DropDownButton from 'devextreme-react/drop-down-button';
import ContextMenu from 'devextreme-react/context-menu';
import TabPanel from 'devextreme-react/tab-panel';
import { Button } from 'devextreme-react/button';

import NdTextBox, { Validator, NumericRule, RequiredRule, CompareRule, EmailRule, PatternRule, StringLengthRule, RangeRule, AsyncRule } from '../../../../core/react/devex/textbox.js'
import NdNumberBox from '../../../../core/react/devex/numberbox.js';
import NdSelectBox from '../../../../core/react/devex/selectbox.js';
import NdCheckBox from '../../../../core/react/devex/checkbox.js';
import NdPopGrid from '../../../../core/react/devex/popgrid.js';
import NdPopUp from '../../../../core/react/devex/popup.js';
import NdGrid,{Column,Editing,Paging,Pager,Scrolling,KeyboardNavigation,Export} from '../../../../core/react/devex/grid.js';
import NdButton from '../../../../core/react/devex/button.js';
import NdDatePicker from '../../../../core/react/devex/datepicker.js';
import NdImageUpload from '../../../../core/react/devex/imageupload.js';
import NdDialog, { dialog } from '../../../../core/react/devex/dialog.js';
import { datatable } from '../../../../core/core.js';
import tr from '../../../meta/lang/devexpress/tr.js';
import NdPagerTab from '../../../../core/react/devex/pagertab.js';
import NbLabel from '../../../../core/react/bootstrap/label.js';

export default class salesDispartch extends React.PureComponent
{
    constructor(props)
    {
        super(props)
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
        this.dropmenuMainItems = [this.t("btnNew"),this.t("btnSave")]
        this.dropmenuDocItems = [this.t("btnSave")]

        this._calculateTotal = this._calculateTotal.bind(this)
        this._onItemRendered = this._onItemRendered.bind(this)
        this.setBarcode = this.setBarcode.bind(this)
        this.dropmenuClick = this.dropmenuClick.bind(this)



        this.frmDocItems = undefined;
        this.docLocked = false;
        this.combineControl = true
        this.combineNew = false        

    }
    async init()
    {
        this.docObj.clearAll()

        let tmpDoc = {...this.docObj.empty}
        tmpDoc.TYPE = 1
        tmpDoc.DOC_TYPE = 42
        tmpDoc.REBATE = 0
        this.docObj.addEmpty(tmpDoc);

        this.txtRef.readOnly = false
        this.txtRefno.readOnly = false
        this.docLocked = false
        
        this.frmDocItems.option('disabled',false)
        await this.grdRebtDispatch.dataRefresh({source:this.docObj.docItems.dt('DOC_ITEMS')});
    }
    async getDoc(pGuid,pRef,pRefno)
    {
        this.docObj.clearAll()
        await this.docObj.load({GUID:pGuid,REF:pRef,REF_NO:pRefno,TYPE:1,DOC_TYPE:42});
        this._calculateMargin()
        this._calculateTotalMargin()

        this.txtRef.readOnly = true
        this.txtRefno.readOnly = true
        
        if(this.docObj.dt()[0].LOCKED != 0)
        {
            this.docLocked = true
            let tmpConfObj =
            {
                id:'msgGetLocked',showTitle:true,title:this.t("msgGetLocked.title"),showCloseButton:true,width:'350px',height:'200px',
                button:[{id:"btn01",caption:this.t("msgGetLocked.btn01"),location:'after'}],
                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgGetLocked.msg")}</div>)
            }

            await dialog(tmpConfObj);
            this.frmDocItems.option('disabled',true)
        }
        else
        {
            this.docLocked = false
            this.frmDocItems.option('disabled',false)
        }
    }
    async checkDoc(pGuid,pRef,pRefno)
    {
        return new Promise(async resolve =>
        {
            if(pRef !== '')
            {
                let tmpData = await new docCls().load({GUID:pGuid,REF:pRef,REF_NO:pRefno});

                if(tmpData.length > 0)
                {
                    let tmpConfObj = 
                    {
                        id: 'msgCode',
                        showTitle:true,
                        title:"Dikkat",
                        showCloseButton:true,
                        width:'500px',
                        height:'200px',
                        button:[{id:"btn01",caption:"Evrağa Git",location:'before'}],
                        content:(<div style={{textAlign:"center",fontSize:"20px"}}>{"Evrak Bulundu"}</div>)
                    }
    
                    let pResult = await dialog(tmpConfObj);
                    if(pResult == 'btn01')
                    {
                        this.getDoc(pGuid,pRef,pRefno)
                        resolve(2) //KAYIT VAR
                    }
                    else
                    {
                        resolve(3) // TAMAM BUTONU
                    }
                }
                else
                {
                    resolve(1) // KAYIT BULUNAMADI
                }
            }
            else
            {
                resolve(0) //PARAMETRE BOŞ
            }
        });
    }
    async _calculateTotal()
    {
        this.docObj.dt()[0].AMOUNT = this.docObj.docItems.dt().sum("AMOUNT",2)
        this.docObj.dt()[0].DISCOUNT = this.docObj.docItems.dt().sum("DISCOUNT",2)
        this.docObj.dt()[0].VAT = this.docObj.docItems.dt().sum("VAT",2)
        this.docObj.dt()[0].TOTAL = this.docObj.docItems.dt().sum("TOTAL",2)
        this._calculateTotalMargin()
    }
    async _calculateTotalMargin()
    {
        let tmpTotalCost = 0

        for (let  i= 0; i < this.docObj.docItems.dt().length; i++) 
        {
            tmpTotalCost += this.docObj.docItems.dt()[i].COST_PRICE * this.docObj.docItems.dt()[i].QUANTITY
        }
        let tmpMargin = ((this.docObj.dt()[0].TOTAL - this.docObj.dt()[0].VAT) - tmpTotalCost)
        let tmpMarginRate = ((( this.docObj.dt()[0].TOTAL - this.docObj.dt()[0].VAT) - tmpTotalCost) - (this.docObj.dt()[0].TOTAL - this.docObj.dt()[0].VAT)) * 100
        this.docObj.dt()[0].MARGIN = tmpMargin.toFixed(2) + "€ / %" +  tmpMarginRate.toFixed(2)
    }
    async _calculateMargin()
    {
        for(let  i= 0; i < this.docObj.docItems.dt().length; i++)
        {
            let tmpMargin = (this.docObj.docItems.dt()[i].TOTAL - this.docObj.docItems.dt()[i].VAT) - (this.docObj.docItems.dt()[i].COST_PRICE * this.docObj.docItems.dt()[i].QUANTITY)
            let tmpMarginRate = (tmpMargin /(this.docObj.docItems.dt()[i].TOTAL - this.docObj.docItems.dt()[i].VAT)) * 100
            this.docObj.docItems.dt()[i].MARGIN = tmpMargin.toFixed(2) + "€ / %" +  tmpMarginRate.toFixed(2)
        }
       
    }
    async addItem(pQuantity)
    {
        if(typeof pQuantity == 'undefined')
        {
            pQuantity = 1
        }
        if(this.txtBarcode.value == "")
        {
            let tmpConfObj = 
            {
                id:'msgBarcodeCheck',showTitle:true,title:this.t("msgBarcodeCheck.title"),showCloseButton:true,width:'350px',height:'200px',
                button:[{id:"btn01",caption:this.t("msgBarcodeCheck.btn01"),location:'after'}],
                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgBarcodeCheck.msg")}</div>)
            }
            await dialog(tmpConfObj);
            return
        }
        for (let i = 0; i < this.docObj.docItems.dt().length; i++) 
        {
            if(this.docObj.docItems.dt()[i].ITEM_CODE == this.barcode.code)
            {
                document.getElementById("Sound2").play(); 
                let tmpConfObj = 
                {
                    id:'msgCombineItem',showTitle:true,title:this.t("msgCombineItem.title"),showCloseButton:true,width:'350px',height:'200px',
                    button:[{id:"btn01",caption:this.t("msgCombineItem.btn01"),location:'before'},{id:"btn02",caption:this.t("msgCombineItem.btn02"),location:'after'}],
                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgCombineItem.msg")}</div>)
                }
                let pResult = await dialog(tmpConfObj);
                if(pResult == 'btn01')
                {                   
                    this.docObj.docItems.dt()[i].QUANTITY = this.docObj.docItems.dt()[i].QUANTITY + pQuantity
                    this.docObj.docItems.dt()[i].VAT = parseFloat((this.docObj.docItems.dt()[i].VAT + (this.docObj.docItems.dt()[i].PRICE * (this.docObj.docItems.dt()[i].VAT_RATE / 100)) * pQuantity))
                    this.docObj.docItems.dt()[i].AMOUNT = parseFloat((this.docObj.docItems.dt()[i].QUANTITY * this.docObj.docItems.dt()[i].PRICE))
                    this.docObj.docItems.dt()[i].TOTAL = parseFloat((((this.docObj.docItems.dt()[i].QUANTITY * this.docObj.docItems.dt()[i].PRICE) - this.docObj.docItems.dt()[i].DISCOUNT) + this.docObj.docItems.dt()[i].VAT))
                    this._calculateTotal()
                    this.barcodeReset()
                    return
                }
                else
                {
                    break
                }
                
            }
        }
        let tmpDocItems = {...this.docObj.docItems.empty}
        tmpDocItems.REF = this.docObj.dt()[0].REF
        tmpDocItems.REF_NO = this.docObj.dt()[0].REF_NO
        tmpDocItems.ITEM_NAME = this.barcode.name
        tmpDocItems.ITEM_CODE = this.barcode.code
        tmpDocItems.ITEM = this.barcode.guid
        tmpDocItems.DOC_GUID = this.docObj.dt()[0].GUID
        tmpDocItems.TYPE = this.docObj.dt()[0].TYPE
        tmpDocItems.DOC_TYPE = this.docObj.dt()[0].DOC_TYPE
        tmpDocItems.LINE_NO = this.docObj.docItems.dt().length
        tmpDocItems.REF = this.docObj.dt()[0].REF
        tmpDocItems.REF_NO = this.docObj.dt()[0].REF_NO
        tmpDocItems.OUTPUT = this.docObj.dt()[0].OUTPUT
        tmpDocItems.INPUT = this.docObj.dt()[0].INPUT
        tmpDocItems.DOC_DATE = this.docObj.dt()[0].DOC_DATE
        tmpDocItems.QUANTITY = pQuantity
        tmpDocItems.VAT_RATE = this.barcode.vat
        tmpDocItems.PRICE = this.txtPrice.value
        tmpDocItems.VAT = ((this.txtPrice.value * (this.barcode.vat / 100)) * pQuantity).toFixed(2)
        tmpDocItems.AMOUNT = (this.txtPrice.value * pQuantity).toFixed(2)
        tmpDocItems.TOTAL = parseFloat(((this.txtPrice.value * pQuantity) + (this.txtVat.value * pQuantity))).toFixed(2)
        this.docObj.docItems.addEmpty(tmpDocItems)
        this.barcodeReset()
        this._calculateTotal()
        await this.docObj.save()
        this.txtPopQuantity.value = 1
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
        this.txtBarcode.focus()
        this.itemName.value = this.barcode.name
    }
    calculateItemPrice()
    {
        this.txtVat.value =  parseFloat((this.txtPrice.value * (this.barcode.vat / 100) * this.txtQuantity.value).toFixed(2))
        this.txtAmount.value = parseFloat(((this.txtPrice.value * this.txtQuantity.value) + this.txtVat.value)).toFixed(2)
    }
    async setBarcode()
    {
        this.txtQuantity.value = 1
        let tmpQuery = 
        {
            query :"SELECT COST_PRICE AS PRICE FROM ITEMS_VW_01 WHERE GUID = @GUID",
            param : ['GUID:string|50'],
            value : [this.barcode.guid]
        }
        let tmpData = await this.core.sql.execute(tmpQuery) 
        if(tmpData.result.recordset.length > 0)
        {
            this.txtPrice.value = parseFloat((tmpData.result.recordset[0].PRICE).toFixed(2))
            this.txtVat.value = parseFloat((tmpData.result.recordset[0].PRICE * (this.barcode.vat / 100)).toFixed(2))
            this.txtAmount.value = parseFloat((Number(this.txtPrice.value) + Number(this.txtVat.value)).toFixed(2))
        }
        this.itemName.value = this.barcode.name
        if(this.chkAutoAdd.value == true)
        {
            setTimeout(async () => 
                {
                   this.txtPopQuantity.focus()
                }, 500);
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
    }
    async dropmenuClick(e)
    {
        if(e.itemData == this.t("btnNew"))
        {
            this.init()
        }
    }
    async _onItemRendered(e)
    {
        await this.core.util.waitUntil(1000)
        
        if(e.itemData.name == "Main")
        {
            this.init()
        }
        else if(e.itemData.name == "Barcode")
        {
            
        }
        else if(e.itemData.name == "Document")
        {
            await this.grdRebtDispatch.dataRefresh({source:this.docObj.docItems.dt('DOC_ITEMS')});
        }
    }
    render()
    {
        return(
            <ScrollView>
            <div className="row p-2">
                <div className="row px-1 py-1">
                    <NdPagerTab id={"page"} parent={this} onItemRendered={this._onItemRendered}>
                    <Item name={"Main"}>
                        <div className="row px-1 py-1">
                            <Form colCount={1}>
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
                                                    query :"SELECT ISNULL(MAX(REF_NO) + 1,1) AS REF_NO FROM DOC WHERE TYPE = 1 AND DOC_TYPE = 42 AND REF = @REF ",
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
                                            <NdTextBox id="txtRefno" mode="number" parent={this} simple={true} dt={{data:this.docObj.dt('DOC'),field:"REF_NO"}}
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
                                                    },
                                                    {
                                                        id:'03',
                                                        icon:'revert',
                                                        onClick:()=>
                                                        {
                                                        this.init()
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
                                    width={'100%'}
                                    height={'100%'}
                                    selection={{mode:"single"}}
                                    title={this.t("pg_Docs.title")} 
                                    data={{source:{select:{query : "SELECT GUID,REF,REF_NO,INPUT_CODE,INPUT_NAME FROM DOC_VW_01 WHERE TYPE = 1 AND DOC_TYPE = 42 AND REBATE = 0"},sql:this.core.sql}}}
                                    >
                                    <Column dataField="REF" caption={this.t("pg_Docs.clmRef")} width={150} defaultSortOrder="asc"/>
                                    <Column dataField="REF_NO" caption={this.t("pg_Docs.clmRefNo")} width={100} defaultSortOrder="asc" />
                                    <Column dataField="INPUT_NAME" caption={this.t("pg_Docs.clmInputName")} width={300} defaultSortOrder="asc" />
                                    <Column dataField="INPUT_CODE" caption={this.t("pg_Docs.clmInputCode")} width={300} defaultSortOrder="asc" />
                                    </NdPopGrid>
                                </Item>
                                {/* cmbDepot */}
                                <Item>
                                        <Label text={this.t("cmbDepot")} alignment="right" />
                                        <NdSelectBox simple={true} parent={this} id="cmbDepot" notRefresh = {true}
                                        dt={{data:this.docObj.dt('DOC'),field:"OUTPUT"}}  
                                        displayExpr="NAME"                       
                                        valueExpr="GUID"
                                        value=""
                                        searchEnabled={true}
                                        onValueChanged={(async()=>
                                            {
                                            }).bind(this)}
                                        data={{source:{select:{query : "SELECT * FROM DEPOT_VW_01"},sql:this.core.sql}}}
                                        param={this.param.filter({ELEMENT:'cmbDepot',USERS:this.user.CODE})}
                                        access={this.access.filter({ELEMENT:'cmbDepot',USERS:this.user.CODE})}
                                        >
                                            <Validator validationGroup={"frmSalesDis"}>
                                                <RequiredRule message={this.t("validDepot")} />
                                            </Validator> 
                                        </NdSelectBox>
                                    </Item>
                                {/* txtCustomerCode */}
                                    <Item>
                                        <Label text={this.t("txtCustomerCode")} alignment="right" />
                                        <NdTextBox id="txtCustomerCode" parent={this} simple={true} 
                                        upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                        dt={{data:this.docObj.dt('DOC'),field:"INPUT_CODE"}} 
                                        onEnterKey={(async()=>
                                            {
                                                await this.pg_txtCustomerCode.setVal(this.txtCustomerCode.value)
                                                this.pg_txtCustomerCode.show()
                                                this.pg_txtCustomerCode.onClick = (data) =>
                                                {
                                                    if(data.length > 0)
                                                    {
                                                        this.docObj.dt()[0].INPUT = data[0].GUID
                                                        this.docObj.dt()[0].INPUT_CODE = data[0].CODE
                                                        this.docObj.dt()[0].INPUT_NAME = data[0].TITLE
                                                        let tmpData = this.sysParam.filter({ID:'refForCustomerCode',USERS:this.user.CODE}).getValue()
                                                        if(typeof tmpData != 'undefined' && tmpData.value ==  true)
                                                        {
                                                            this.txtRef.value = data[0].CODE 
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
                                                    onClick:()=>
                                                    {
                                                        this.pg_txtCustomerCode.show()
                                                        this.pg_txtCustomerCode.onClick = (data) =>
                                                        {
                                                            if(data.length > 0)
                                                            {
                                                                this.docObj.dt()[0].INPUT = data[0].GUID
                                                                this.docObj.dt()[0].INPUT_CODE = data[0].CODE
                                                                this.docObj.dt()[0].INPUT_NAME = data[0].TITLE
                                                                let tmpData = this.sysParam.filter({ID:'refForCustomerCode',USERS:this.user.CODE}).getValue()
                                                                if(typeof tmpData != 'undefined' && tmpData.value ==  true)
                                                                {
                                                                    this.txtRef.value = data[0].CODE 
                                                                    this.txtRef.props.onChange()
                                                                }
                                                            }
                                                        }
                                                    }
                                                },
                                            ]
                                        }
                                        param={this.param.filter({ELEMENT:'txtCustomerCode',USERS:this.user.CODE})}
                                        access={this.access.filter({ELEMENT:'txtCustomerCode',USERS:this.user.CODE})}
                                        >
                                            <Validator validationGroup={"frmSalesDis"}>
                                                <RequiredRule message={this.t("validCustomerCode")} />
                                            </Validator>  
                                        </NdTextBox>
                                        {/*CARI SECIMI POPUP */}
                                        <NdPopGrid id={"pg_txtCustomerCode"} parent={this} container={"#root"}
                                        visible={false}
                                        position={{of:'#root'}} 
                                        showTitle={true} 
                                        showBorders={true}
                                        selection={{mode:"single"}}
                                        width={'100%'}
                                        height={'100%'}
                                        title={this.t("pg_txtCustomerCode.title")} //
                                        search={true}
                                        data = 
                                        {{
                                            source:
                                            {
                                                select:
                                                {
                                                    query : "SELECT GUID,CODE,TITLE,NAME,LAST_NAME,[TYPE_NAME],[GENUS_NAME] FROM CUSTOMER_VW_01 WHERE ((UPPER(CODE) LIKE UPPER(@VAL) OR UPPER(TITLE) LIKE UPPER(@VAL)))  AND GENUS = 3",
                                                    param : ['VAL:string|50']
                                                },
                                                sql:this.core.sql
                                            }
                                        }}
                                        button=
                                        {
                                            {
                                                id:'01',
                                                icon:'more',
                                                onClick:()=>
                                                {
                                                    console.log(1111)
                                                }
                                            }
                                        }
                                        >
                                            <Column dataField="CODE" caption={this.t("pg_txtCustomerCode.clmCode")} width={150} />
                                            <Column dataField="TITLE" caption={this.t("pg_txtCustomerCode.clmTitle")} width={500} defaultSortOrder="asc" />
                                            <Column dataField="TYPE_NAME" caption={this.t("pg_txtCustomerCode.clmTypeName")} width={150} />
                                            <Column dataField="GENUS_NAME" caption={this.t("pg_txtCustomerCode.clmGenusName")} width={150} />
                                            
                                        </NdPopGrid>
                                    </Item> 
                                {/* txtCustomerName */}
                                <Item>
                                    <Label text={this.t("txtCustomerName")} alignment="right" />
                                    <NdTextBox id="txtCustomerName" parent={this} simple={true}  
                                    readOnly={true}
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    dt={{data:this.docObj.dt('DOC'),field:"INPUT_NAME"}} 
                                    param={this.param.filter({ELEMENT:'txtCustomerName',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'txtCustomerName',USERS:this.user.CODE})}
                                    >
                                    </NdTextBox>
                                </Item> 
                                {/* dtDocDate */}
                                <Item>
                                    <Label text={this.t("dtDocDate")} alignment="right" />
                                    <NdDatePicker simple={true}  parent={this} id={"dtDocDate"} pickerType={"rollers"}
                                    dt={{data:this.docObj.dt('DOC'),field:"DOC_DATE"}}
                                    onValueChanged={(async()=>
                                        {
                                    }).bind(this)}
                                    >
                                        <Validator validationGroup={"frmSalesDis"}>
                                            <RequiredRule message={this.t("validDocDate")} />
                                        </Validator> 
                                    </NdDatePicker>
                                </Item>
                                {/* dtShipDate */}
                                <Item>
                                    <Label text={this.t("dtShipDate")} alignment="right" />
                                    <NdDatePicker simple={true}  parent={this} id={"dtShipDate"} pickerType={"rollers"}
                                    dt={{data:this.docObj.dt('DOC'),field:"SHIPMENT_DATE"}}
                                    onValueChanged={(async()=>
                                    {
                                    }).bind(this)}
                                    >
                                        <Validator validationGroup={"frmSalesDis"}>
                                            <RequiredRule message={this.t("validDocDate")} />
                                        </Validator> 
                                    </NdDatePicker>
                                </Item>
                                <Item>
                                    <div className="row">
                                        <div className="col-6 px-2 pt-2">
                                            <NdButton text={this.t("btnBarcodeEntry")} type="default" width="100%"onClick={async()=>{
                                                if(this.cmbDepot.value == "")
                                                {
                                                    let tmpConfObj = 
                                                    {
                                                        id:'msgDepotSelect',showTitle:true,title:this.t("msgDepotSelect.title"),showCloseButton:true,width:'350px',height:'200px',
                                                        button:[{id:"btn01",caption:this.t("msgDepotSelect.btn01"),location:'after'}],
                                                        content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgDepotSelect.msg")}</div>)
                                                    }
                                                    await dialog(tmpConfObj);
                                                    return
                                                }
                                                else if(this.docObj.dt()[0].INPUT_CODE == "")
                                                {
                                                    let tmpConfObj = 
                                                    {
                                                        id:'msgCustomerSelect',showTitle:true,title:this.t("msgCustomerSelect.title"),showCloseButton:true,width:'350px',height:'200px',
                                                        button:[{id:"btn01",caption:this.t("msgCustomerSelect.btn01"),location:'after'}],
                                                        content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgCustomerSelect.msg")}</div>)
                                                    }
                                                    await dialog(tmpConfObj);
                                                    return
                                                }
                                                this.txtBarcode.focus()
                                                this.page.pageSelect("Barcode")
                                            }}
                                            ></NdButton>
                                        </div>
                                        <div className="col-6 px-2 pt-2">
                                            <NdButton text={this.t("btnDocument")} type="default" width="100%" onClick={()=>this.page.pageSelect("Document")}></NdButton>
                                        </div>
                                    </div>
                                </Item>
                            </Form>
                        </div>
                    </Item>
                    <Item name={"Barcode"}>
                        <div className="row px-1 py-1" >
                            <Form colCount={1}>
                                <Item>
                                <div className="row">
                                    <div className="col-4 px-1 pt-1">
                                        <NdButton icon="arrowleft" type="default" width="100%" onClick={()=>this.page.pageSelect("Main")}></NdButton>
                                    </div>
                                    <div className="col-4 px-1 pt-1">
                                        <NdButton icon="detailslayout" type="default" width="100%" onClick={()=>this.page.pageSelect("Document")}></NdButton>
                                    </div>
                                    <div className="col-4 px-1 pt-1">
                                        
                                        <NdCheckBox id="chkAutoAdd" text={this.t("chkAutoAdd")} parent={this} defaultValue={true} value={true} 
                                        param={this.param.filter({ELEMENT:'chkAutoAdd',USERS:this.user.CODE})}
                                        access={this.access.filter({ELEMENT:'chkAutoAdd',USERS:this.user.CODE})}/>
                                    </div>
                                </div>
                                </Item>
                                <Item>
                                <div className="col-12 px-2 pt-2">
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
                                                    document.getElementById("Sound").play(); 
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
                                        <h5 className="text-center">
                                            <NbLabel id="itemName" parent={this} value={""}/>
                                        </h5>
                                    </div>
                                </Item>
                                {/* txtQuantity */}
                                <Item>
                                    <Label text={this.t("txtQuantity")}/>
                                    <NdNumberBox id="txtQuantity" parent={this} simple={true}  
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
                                        }).bind(this)}>
                                    </NdNumberBox>
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
                                    }).bind(this)}>
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
                        </div>
                    </Item>
                    <Item name={"Document"}>
                        <div className="row px-1 py-1" >
                            <Form colCount={1} >
                            <Item>
                                <div className="row">
                                    <div className="col-4 px-1 pt-1">
                                        <NdButton icon="arrowleft" type="default" width="100%" onClick={()=>this.page.pageSelect("Main")}></NdButton>
                                    </div>
                                    <div className="col-4 px-1 pt-1">
                                        <NdButton icon="plus" type="default" width="100%" onClick={async()=>{
                                                if(this.cmbDepot.value == "")
                                                {
                                                    let tmpConfObj = 
                                                    {
                                                        id:'msgDepotSelect',showTitle:true,title:this.t("msgDepotSelect.title"),showCloseButton:true,width:'350px',height:'200px',
                                                        button:[{id:"btn01",caption:this.t("msgDepotSelect.btn01"),location:'after'}],
                                                        content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgDepotSelect.msg")}</div>)
                                                    }
                                                    await dialog(tmpConfObj);
                                                    return
                                                }
                                                else if(this.docObj.dt()[0].INPUT_CODE == "")
                                                {
                                                    let tmpConfObj = 
                                                    {
                                                        id:'msgCustomerSelect',showTitle:true,title:this.t("msgCustomerSelect.title"),showCloseButton:true,width:'350px',height:'200px',
                                                        button:[{id:"btn01",caption:this.t("msgCustomerSelect.btn01"),location:'after'}],
                                                        content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgCustomerSelect.msg")}</div>)
                                                    }
                                                    await dialog(tmpConfObj);
                                                    return
                                                }
                                                this.txtBarcode.focus()
                                                this.page.pageSelect("Barcode")
                                            }}
                                        ></NdButton>
                                    </div>
                                    <div className="col-4">
                                
                                    </div>
                                </div>
                            </Item>
                            </Form>
                            <div className='col-12 px-2 pt-2'>
                            <Form colCount={1} onInitialized={(e)=>
                                {
                                    this.frmDocItems = e.component
                                }}>
                            <Item>
                                    <React.Fragment>
                                    <NdGrid parent={this} id={"grdRebtDispatch"} 
                                    showBorders={true} 
                                    columnsAutoWidth={true} 
                                    allowColumnReordering={true} 
                                    allowColumnResizing={true} 
                                    height={'350'} 
                                    width={'100%'}
                                    dbApply={false}
                                    onRowUpdated={async(e)=>{

                                        if(e.key.DISCOUNT > (e.key.PRICE * e.key.QUANTITY))
                                        {
                                            let tmpConfObj =
                                            {
                                                id:'msgDiscount',showTitle:true,title:"Uyarı",showCloseButton:true,width:'350px',height:'200px',
                                                button:[{id:"btn01",caption:this.t("msgDiscount.btn01"),location:'after'}],
                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgDiscount.msg")}</div>)
                                            }
                                        
                                            dialog(tmpConfObj);
                                            e.key.DISCOUNT = 0 
                                            return
                                        }
                                        if(e.key.VAT > 0)
                                        {
                                            e.key.VAT = parseFloat(((((e.key.PRICE * e.key.QUANTITY) - e.key.DISCOUNT) * (e.key.VAT_RATE) / 100)).toFixed(3));
                                        }
                                        e.key.AMOUNT = parseFloat((e.key.PRICE * e.key.QUANTITY).toFixed(3))
                                        e.key.TOTAL = parseFloat((((e.key.PRICE * e.key.QUANTITY) - e.key.DISCOUNT) +e.key.VAT).toFixed(3))

                                        
                                        if(e.key.DISCOUNT > 0)
                                        {
                                            e.key.DISCOUNT_RATE = parseFloat((100 - ((((e.key.PRICE * e.key.QUANTITY) - e.key.DISCOUNT) / (e.key.PRICE * e.key.QUANTITY)) * 100)).toFixed(3))
                                        }
                                        this._calculateTotal()
                                        
                                    }}
                                    onRowRemoved={async (e)=>{
                                        this._calculateTotal()
                                        await this.docObj.save()
                                    }}
                                    onContentReady={async(e)=>{
                                        e.component.columnOption("command:edit", 'visibleIndex', -1)
                                    }}
                                    >
                                        <KeyboardNavigation editOnKeyPress={true} enterKeyAction={'moveFocus'} enterKeyDirection={'row'} />
                                        <Scrolling mode="standart" />
                                        <Paging defaultPageSize={10} />
                                        <Pager visible={true} allowedPageSizes={[5,10,20,50,100]} showPageSizeSelector={true} />
                                        <Editing mode="cell" allowUpdating={true} allowDeleting={true} confirmDelete={false}/>
                                        <Column dataField="ITEM_NAME" caption={this.t("grdRebtDispatch.clmItemName")} width={150} />
                                        <Column dataField="QUANTITY" caption={this.t("grdRebtDispatch.clmQuantity")} dataType={'number'} width={40}/>
                                        <Column dataField="PRICE" caption={this.t("grdRebtDispatch.clmPrice")} dataType={'number'} width={50} format={{ style: "currency", currency: "EUR",precision: 3}}/>
                                        <Column dataField="ITEM_CODE" caption={this.t("grdRebtDispatch.clmItemCode")} width={150} />
                                        <Column dataField="AMOUNT" caption={this.t("grdRebtDispatch.clmAmount")} allowEditing={false} format={{ style: "currency", currency: "EUR",precision: 3}} width={80}/>
                                        <Column dataField="VAT" caption={this.t("grdRebtDispatch.clmVat")} format={{ style: "currency", currency: "EUR",precision: 3}} width={80} allowEditing={false}/>
                                        <Column dataField="TOTAL" caption={this.t("grdRebtDispatch.clmTotal")} format={{ style: "currency", currency: "EUR",precision: 3}} width={100} allowEditing={false}/>
                                    </NdGrid>
                                    <ContextMenu
                                    dataSource={this.rightItems}
                                    width={200}
                                    target="#grdRebtDispatch"
                                    onItemClick={(async(e)=>
                                    {
                                        
                                    }).bind(this)} />
                                </React.Fragment> 
                                </Item>
                            </Form>
                            </div>
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
                                                                    id:'msgVatDelete',showTitle:true,title:this.t("msgVatDelete.title"),showCloseButton:true,width:'350px',height:'200px',
                                                                    button:[{id:"btn01",caption:this.t("msgVatDelete.btn01"),location:'before'},{id:"btn02",caption:this.t("msgSave.btn02"),location:'after'}],
                                                                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgVatDelete.msg")}</div>)
                                                                }
                                                                
                                                                let pResult = await dialog(tmpConfObj);
                                                                if(pResult == 'btn01')
                                                                {
                                                                    for (let i = 0; i < this.docObj.docItems.dt().length; i++) 
                                                                    {
                                                                        this.docObj.docItems.dt()[i].VAT = 0  
                                                                        this.docObj.docItems.dt()[i].VAT_RATE = 0
                                                                        this.docObj.docItems.dt()[i].TOTAL = (this.docObj.docItems.dt()[i].PRICE * this.docObj.docItems.dt()[i].QUANTITY) - this.docObj.docItems.dt()[i].DISCOUNT
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
                    </Item>
                    </NdPagerTab>
                    {/* Stok Seçim */}
                    <NdPopGrid id={"popItemCode"} parent={this} container={"#root"}
                        visible={false}
                        position={{of:'#root'}} 
                        showTitle={true} 
                        showBorders={true}
                        width={'100%'}
                        height={'100%'}
                        title={this.t("popItemCode.title")} //
                        search={true}
                        selection={{mode:"single"}}
                        data = 
                        {{
                            source:
                        {
                            select:
                            {
                                query : "SELECT GUID,CODE,NAME,VAT FROM ITEMS_VW_01 WHERE UPPER(CODE) LIKE UPPER(@VAL) OR UPPER(NAME) LIKE UPPER(@VAL)",
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
                                                                id:'msgDiscountPercent',showTitle:true,title:this.t("msgDiscountPercent.title"),showCloseButton:true,width:'350px',height:'200px',
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
                                                        id:'msgDiscountPrice',showTitle:true,title:this.t("msgDiscountPrice.title"),showCloseButton:true,width:'350px',height:'200px',
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
                                                    for (let i = 0; i < this.docObj.docItems.dt().length; i++) 
                                                    {
                                                        this.docObj.docItems.dt()[i].DISCOUNT_RATE = this.txtDiscountPercent.value
                                                        this.docObj.docItems.dt()[i].DISCOUNT =  parseFloat((((this.docObj.docItems.dt()[i].PRICE * this.docObj.docItems.dt()[i].QUANTITY) * this.txtDiscountPercent.value) / 100).toFixed(3))
                                                        if(this.docObj.docItems.dt()[i].VAT > 0)
                                                        {
                                                            this.docObj.docItems.dt()[i].VAT = parseFloat(((this.docObj.docItems.dt()[i].PRICE * this.docObj.docItems.dt()[i].QUANTITY) * (this.docObj.docItems.dt()[i].VAT_RATE / 100)).toFixed(3))
                                                        }
                                                        this.docObj.docItems.dt()[i].TOTAL = parseFloat(((this.docObj.docItems.dt()[i].PRICE * this.docObj.docItems.dt()[i].QUANTITY) + this.docObj.docItems.dt()[i].VAT - this.docObj.docItems.dt()[i].DISCOUNT).toFixed(3))
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
                        <div className="row px-3">
                            <div className="col-12 py-2">
                                <div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgQuantity.msg")}</div>
                            </div>
                            <div className="col-12 py-2">
                            <Form>
                                {/* checkCustomer */}
                                <Item>
                                    <Label text={this.t("txtQuantity")} alignment="right" />
                                    <NdNumberBox id="txtPopQuantity" parent={this} simple={true}  
                                    onEnterKey={(async()=>
                                    {
                                        this.addItem(this.txtPopQuantity.value)
                                        this.msgQuantity.hide()
                                    }).bind(this)}  
                                    >
                                </NdNumberBox>
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