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
import { dialog } from '../../../../core/react/devex/dialog.js';
import { datatable } from '../../../../core/core.js';
import tr from '../../../meta/lang/devexpress/tr.js';
import { triggerHandler } from 'devextreme/events';
import NdPagerTab from '../../../../core/react/devex/pagertab.js';
import NbLabel from '../../../../core/react/bootstrap/label.js';

export default class depotTransfer extends React.Component
{
    constructor()
    {
        super()
        this.barcode = 
        {
            guid:"00000000-0000-0000-0000-000000000000",
            name:"",
            barcode: "",
            code:""
        }
        this.core = App.instance.core;
        this.prmObj = this.param.filter({TYPE:1,USERS:this.user.CODE});
        this.acsobj = this.access.filter({TYPE:1,USERS:this.user.CODE});

        this.docObj = new docCls();

        this.dropmenuMainItems = [this.t("btnNew"),this.t("btnSave")]
        this.dropmenuDocItems = [this.t("btnSave")]
        this._onItemRendered = this._onItemRendered.bind(this)
        this.dropmenuClick = this.dropmenuClick.bind(this)
        this.barcodeScan = this.barcodeScan.bind(this)
        this.quantityControl = this.prmObj.filter({ID:'negativeQuantity',USERS:this.user.CODE}).getValue().value
    }
    async init()
    {
        this.docObj.clearAll()

        this.txtRef.setState({value:this.user.CODE})
        this.txtRef.value = this.user.CODE
        let tmpDoc = {...this.docObj.empty}
        tmpDoc.REF = this.user.CODE
        tmpDoc.TYPE = 2
        tmpDoc.DOC_TYPE = 2
        tmpDoc.REBATE = 0
        this.docObj.addEmpty(tmpDoc);

        this.txtRef.readOnly = true
        this.txtRefno.readOnly = true
        this.docLocked = false
        
        this.txtRef.props.onChange()
    }
    async getDoc(pGuid,pRef,pRefno)
    {
        this.docObj.clearAll()
        await this.docObj.load({GUID:pGuid,REF:pRef,REF_NO:pRefno,TYPE:2,DOC_TYPE:2});

        this.txtRef.readOnly = true
        this.txtRefno.readOnly = true
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
    barcodeReset()
    {
        
        this.barcode = 
        {
            guid:"00000000-0000-0000-0000-000000000000",
            name:"",
            barcode: "",
            code:""
        }
        this.txtBarcode.value = ""
        this.txtQuantity.value=1
        this.itemName.value = this.barcode.name
        this.txtBarcode.focus()
    }
    async addItem(pQuantity)
    {
        if(pQuantity > 999)
        {
            let tmpConfObj = 
            {
                id:'msgBigQuantity',showTitle:true,title:this.t("msgBigQuantity.title"),showCloseButton:true,width:'350px',height:'200px',
                button:[{id:"btn01",caption:this.t("msgBigQuantity.btn01"),location:'before'},{id:"btn02",caption:this.t("msgBigQuantity.btn02"),location:'after'}],
                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{pQuantity + " " + this.t("msgBigQuantity.msg")}</div>)
            }
            let pResult = await dialog(tmpConfObj);
            if(pResult == 'btn01')
            {                   
               
            }
            else
            {
                this.txtQuantity.focus()
                return
            }
        }
        if(typeof this.quantityControl != 'undefined' && this.quantityControl ==  true)
        {
            let tmpCheckQuery = 
            {
                query :"SELECT [dbo].[FN_DEPOT_QUANTITY](@GUID,@DEPOT,GETDATE()) AS QUANTITY ",
                param : ['GUID:string|50','DEPOT:string|50'],
                value : [this.barcode.guid,this.docObj.dt()[0].OUTPUT]
            }
            let tmpQuantity = await this.core.sql.execute(tmpCheckQuery) 
            if(tmpQuantity.result.recordset.length > 0)
            {
               if(tmpQuantity.result.recordset[0].QUANTITY < pQuantity)
               {
                    App.instance.setState({isExecute:false})
                    let tmpConfObj =
                    {
                        id:'msgNotQuantity',showTitle:true,title:this.t("msgNotQuantity.title"),showCloseButton:true,width:'500px',height:'200px',
                        button:[{id:"btn01",caption:this.t("msgNotQuantity.btn01"),location:'after'}],
                        content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgNotQuantity.msg") + tmpQuantity.result.recordset[0].QUANTITY}</div>)
                    }
        
                    await dialog(tmpConfObj);
                    await this.grdSlsDispatch.devGrid.deleteRow(pIndex)
                    return
               }
               else
               {
                    this.docObj.docItems.dt()[pIndex].DEPOT_QUANTITY = tmpQuantity.result.recordset[0].QUANTITY
               }
            }
        }
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
                    this.docObj.docItems.dt()[i].QUANTITY = Number(this.docObj.docItems.dt()[i].QUANTITY) + Number(pQuantity)
                    this.barcodeReset()
                    return
                }
                else
                {
                    this.docObj.docItems.dt()[i].QUANTITY = pQuantity
                    this.barcodeReset()
                    return
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
        tmpDocItems.REBATE = this.docObj.dt()[0].REBATE
        tmpDocItems.LINE_NO = this.docObj.docItems.dt().length
        tmpDocItems.REF = this.docObj.dt()[0].REF
        tmpDocItems.REF_NO = this.docObj.dt()[0].REF_NO
        tmpDocItems.OUTPUT = this.docObj.dt()[0].OUTPUT
        tmpDocItems.INPUT = this.docObj.dt()[0].INPUT
        tmpDocItems.DOC_DATE = this.docObj.dt()[0].DOC_DATE
        tmpDocItems.SHIPMENT_DATE = this.docObj.dt()[0].SHIPMENT_DATE
        tmpDocItems.QUANTITY = pQuantity
        this.docObj.docItems.addEmpty(tmpDocItems)
        if(typeof this.quantityControl != 'undefined' && this.quantityControl ==  true)
        {
            let tmpCheckQuery = 
            {
                query :"SELECT [dbo].[FN_DEPOT_QUANTITY](@GUID,@DEPOT,GETDATE()) AS QUANTITY ",
                param : ['GUID:string|50','DEPOT:string|50'],
                value : [this.barcode.guid,this.docObj.dt()[0].OUTPUT]
            }
            let tmpQuantity = await this.core.sql.execute(tmpCheckQuery) 
            if(tmpQuantity.result.recordset.length > 0)
            {
               if(tmpQuantity.result.recordset[0].QUANTITY < pQuantity)
               {
                    App.instance.setState({isExecute:false})
                    let tmpConfObj =
                    {
                        id:'msgNotQuantity',showTitle:true,title:this.t("msgNotQuantity.title"),showCloseButton:true,width:'350px',height:'200px',
                        button:[{id:"btn01",caption:this.t("msgNotQuantity.btn01"),location:'after'}],
                        content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgNotQuantity.msg") + tmpQuantity.result.recordset[0].QUANTITY}</div>)
                    }
        
                    await dialog(tmpConfObj);
                    await this.grdSlsDispatch.devGrid.deleteRow(pIndex)
                    return
               }
               else
               {
                    tmpDocItems.DEPOT_QUANTITY = tmpQuantity.result.recordset[0].QUANTITY
               }
            }
        }
        this.barcodeReset()
        await this.docObj.save()
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
                        query : "SELECT ITEM_CODE AS CODE,ITEM_NAME AS NAME,ITEM_GUID AS GUID,BARCODE,[dbo].[FN_PRICE_SALE](ITEM_GUID,1,GETDATE(),'00000000-0000-0000-0000-000000000000') AS PRICE FROM ITEM_BARCODE_VW_01  WHERE BARCODE = @BARCODE OR ITEM_CODE = @BARCODE ",
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
                        this.itemName.value =  tmpData.result.recordset[0].NAME
                        this.txtQuantity.focus()
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
                        this.barcodeReset()
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
    async _onItemRendered(e)
    {
        await this.core.util.waitUntil(100)
        
        if(e.itemData.name == "Main")
        {
            this.init()
        }
        else if(e.itemData.name == "Barcode")
        {
            
        }
        else if(e.itemData.name == "Document")
        {
            await this.grdDepotTransfer.dataRefresh({source:this.docObj.docItems.dt('DOC_ITEMS')});
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
                            {/* <Item>
                                <div className="row">
                                    <div className="col-8"></div>
                                    <div className="col-4">
                                        <DropDownButton text={this.t("btnDropmenu")} icon="menu" items={this.dropmenuMainItems}  onItemClick={this.dropmenuClick}/>
                                    </div>
                                </div>
                            </Item> */}
                        {/* txtRef-Refno */}
                            <Item>
                                <Label text={this.t("txtRefRefno")} alignment="right" />
                                <div className="row">
                                    <div className="col-4 pe-0">
                                        <NdTextBox id="txtRef" parent={this} simple={true} dt={{data:this.docObj.dt('DOC'),field:"REF"}}
                                        upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                        readOnly={true}
                                        maxLength={32}
                                        onChange={(async(e)=>
                                        {
                                            let tmpQuery = 
                                            {
                                                query :"SELECT ISNULL(MAX(REF_NO) + 1,1) AS REF_NO FROM DOC WHERE TYPE = 2 AND DOC_TYPE = 2 AND REF = @REF ",
                                                param : ['REF:string|25'],
                                                value : [this.txtRef.value]
                                            }
                                            let tmpData = await this.core.sql.execute(tmpQuery) 
                                            if(tmpData.result.recordset.length > 0)
                                            {
                                                this.txtRefno.value = tmpData.result.recordset[0].REF_NO
                                            }
                                        }).bind(this)}
                                        param={this.param.filter({ELEMENT:'txtRef',USERS:this.user.CODE})}
                                        access={this.access.filter({ELEMENT:'txtRef',USERS:this.user.CODE})}
                                        >
                                        <Validator validationGroup={"frmRbtDoc"}>
                                                <RequiredRule message={this.t("validRef")} />
                                            </Validator>  
                                        </NdTextBox>
                                    </div>
                                    <div className="col-8 ps-0">
                                        <NdTextBox id="txtRefno" mode="number" parent={this} simple={true} dt={{data:this.docObj.dt('DOC'),field:"REF_NO"}}
                                        readOnly={true}
                                        button=
                                        {
                                            [
                                                {
                                                    id:'01',
                                                    icon:'more',
                                                    onClick:()=>
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
                                        <Validator validationGroup={"frmRbtDoc"}>
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
                                title={this.t("pg_Docs.title")} 
                                selection={{mode:"single"}}
                                data={{source:{select:{query : "SELECT GUID,REF,REF_NO,INPUT_CODE,INPUT_NAME FROM DOC_VW_01 WHERE TYPE = 2 AND DOC_TYPE = 2 AND REBATE = 0"},sql:this.core.sql}}}
                                >
                                    <Column dataField="REF" caption={this.t("pg_Docs.clmRef")} width={70} defaultSortOrder="asc"/>
                                    <Column dataField="REF_NO" caption={this.t("pg_Docs.clmRefNo")} width={50} defaultSortOrder="asc" />
                                </NdPopGrid>
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
                                    <Validator validationGroup={"frmRbtDoc"}>
                                        <RequiredRule message={this.t("validDocDate")} />
                                    </Validator> 
                                </NdDatePicker>
                            </Item>
                            {/* cmbDepot */}
                            <Item>
                                <Label text={this.t("cmbDepot1")} alignment="right" />
                                <NdSelectBox simple={true} parent={this} id="cmbDepot1"
                                dt={{data:this.docObj.dt('DOC'),field:"OUTPUT"}}  
                                displayExpr="NAME"                       
                                valueExpr="GUID"
                                value=""
                                searchEnabled={true}
                                onValueChanged={(async(e)=>
                                    {
                                        if(this.cmbDepot2.value == e.value)
                                        {
                                            let tmpConfObj =
                                            {
                                                id:'msgDblDepot',showTitle:true,title:this.t("msgDblDepot.title"),showCloseButton:true,width:'500px',height:'200px',
                                                button:[{id:"btn01",caption:this.t("msgDblDepot.btn01"),location:'after'}],
                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgDblDepot.msg")}</div>)
                                            }
                                        
                                            await dialog(tmpConfObj);
                                            this.cmbDepot1.setState({value:''});
                                            return
                                        }
                                    }).bind(this)}
                                data={{source:{select:{query : "SELECT * FROM DEPOT_VW_01"},sql:this.core.sql}}}
                                param={this.param.filter({ELEMENT:'cmbDepot1',USERS:this.user.CODE})}
                                access={this.access.filter({ELEMENT:'cmbDepot1',USERS:this.user.CODE})}
                                >
                                    <Validator validationGroup={"frmRbtDoc"}>
                                        <RequiredRule message={this.t("validDepot")} />
                                    </Validator> 
                                </NdSelectBox>
                            </Item>
                            {/* cmbDepot */}
                            <Item>
                                <Label text={this.t("cmbDepot2")} alignment="right" />
                                <NdSelectBox simple={true} parent={this} id="cmbDepot2"
                                dt={{data:this.docObj.dt('DOC'),field:"INPUT"}}  
                                displayExpr="NAME"                       
                                valueExpr="GUID"
                                value=""
                                searchEnabled={true}
                                onValueChanged={(async(e)=>
                                    {
                                        if(this.cmbDepot1.value == e.value)
                                        {
                                            let tmpConfObj =
                                            {
                                                id:'msgDblDepot',showTitle:true,title:this.t("msgDblDepot.title"),showCloseButton:true,width:'500px',height:'200px',
                                                button:[{id:"btn01",caption:this.t("msgDblDepot.btn01"),location:'after'}],
                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgDblDepot.msg")}</div>)
                                            }
                                        
                                            await dialog(tmpConfObj);
                                            this.cmbDepot2.setState({value:''});
                                            return
                                        }
                                    }).bind(this)}
                                data={{source:{select:{query : "SELECT * FROM DEPOT_VW_01"},sql:this.core.sql}}}
                                param={this.param.filter({ELEMENT:'cmbDepot2',USERS:this.user.CODE})}
                                access={this.access.filter({ELEMENT:'cmbDepot2',USERS:this.user.CODE})}
                                >
                                    <Validator validationGroup={"frmRbtDoc"}>
                                        <RequiredRule message={this.t("validDepot")} />
                                    </Validator> 
                                </NdSelectBox>
                            </Item>
                            <Item>
                                <div className="row">
                                    <div className="col-6 px-2 pt-2">
                                        <NdButton text={this.t("btnBarcodeEntry")} type="default" width="100%" onClick={async()=>{
                                            if(this.cmbDepot1.value == "")
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
                                            else if(this.cmbDepot2.value == "")
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
                                            this.txtBarcode.focus()
                                            this.page.pageSelect("Barcode")
                                        }}></NdButton>
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
                    <div className="row px-1 py-1">
                        <Form colCount={1}>
                            <Item>
                            <div className="row">
                                <div className="col-4">
                                    <NdButton icon="arrowleft" type="default" width="100%" onClick={()=>this.page.pageSelect("Main")}></NdButton>
                                </div>
                                <div className="col-4">
                                    <NdButton icon="detailslayout" type="default" width="100%" onClick={()=>this.page.pageSelect("Document")}></NdButton>
                                </div>
                                <div className="col-4">
                                    
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
                                                this.barcodeReset()
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
                                                            guid:data[0].GUID
                                                        }
                                                        this.itemName.value = data[0].NAME
                                                        this.txtQuantity.focus()
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
                                                                guid:data[0].GUID
                                                            }
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
                                                query : "SELECT ITEM_CODE AS CODE,ITEM_NAME AS NAME,ITEM_GUID AS GUID,BARCODE,[dbo].[FN_PRICE_SALE](ITEM_GUID,1,GETDATE(),'00000000-0000-0000-0000-000000000000') AS PRICE FROM ITEM_BARCODE_VW_01  WHERE BARCODE = @BARCODE OR ITEM_CODE = @BARCODE ",
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
                                                this.itemName.value = tmpData.result.recordset[0].NAME
                                                this.txtQuantity.focus()
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
                                                this.barcodeReset()
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
                                <NdTextBox id="txtQuantity" parent={this} simple={true}  value={1}
                                    param={this.param.filter({ELEMENT:'txtQuantity',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'txtQuantity',USERS:this.user.CODE})}
                                    onEnterKey={(async(e)=>
                                        {
                                            this.addItem(this.txtQuantity.value)
                                        }).bind(this)}></NdTextBox>
                            </Item>
                            <Item>
                                <div className="row">
                                    <div className="col-12 px-4 pt-4">
                                        <NdButton text={this.t("btnItemAdd")} type="default" width="100%" onClick={()=>this.addItem(this.txtQuantity.value)}></NdButton>
                                    </div>
                                </div>
                            </Item>
                        </Form>
                    </div>
                </Item>
                <Item name={"Document"}>
                    <div className="row px-1 py-1">
                        <Form>
                        <Item>
                            <div className="row">
                                <div className="col-4">
                                    <NdButton icon="arrowleft" type="default" width="100%" onClick={()=>this.page.pageSelect("Main")}></NdButton>
                                </div>
                                <div className="col-4">
                                    <NdButton icon="plus" type="default" width="100%"  onClick={async()=>{
                                        if(this.cmbDepot1.value == "")
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
                                        else if(this.cmbDepot2.value == "")
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
                                        this.txtBarcode.focus()
                                        this.page.pageSelect("Barcode")
                                    }}></NdButton>
                                </div>
                                <div className="col-4">
                                        {/* <DropDownButton text={this.t("btnDropmenu")} icon="menu" items={this.dropmenuDocItems}  onItemClick={this.dropmenuClick}/> */}
                                </div>
                            </div>
                        </Item>
                        <Item>
                            <NdGrid parent={this} id={"grdDepotTransfer"} 
                            showBorders={true} 
                            columnsAutoWidth={true} 
                            allowColumnReordering={true} 
                            allowColumnResizing={true} 
                            height={'400'} 
                            width={'100%'}
                            dbApply={false}
                            loadPanel={{enabled:true}}
                            onContentReady={async(e)=>{
                                e.component.columnOption("command:edit", 'visibleIndex', -1)
                            }}
                            onRowUpdated={async(e)=>{
                                await this.docObj.save()
                            }}
                            onRowRemoved={async(e)=>{
                                await this.docObj.save()
                            }}
                            >
                                <KeyboardNavigation editOnKeyPress={true} enterKeyAction={'moveFocus'} enterKeyDirection={'column'} />
                                <Scrolling mode="standard" />
                                <Editing mode="cell" allowUpdating={true} allowDeleting={true} confirmDelete={false}/>
                                <Column dataField="ITEM_CODE" caption={this.t("grdDepotTransfer.clmItemCode")} width={150} allowEditing={false}/>
                                <Column dataField="ITEM_NAME" caption={this.t("grdDepotTransfer.clmItemName")} width={350} allowEditing={false}/>
                                <Column dataField="QUANTITY" caption={this.t("grdDepotTransfer.clmQuantity")} dataType={'number'} width={150}/>
                                <Column dataField="DESCRIPTION" caption={this.t("grdDepotTransfer.clmDescription")} />
                            </NdGrid>
                        </Item>
                        </Form>
                    </div>
                </Item>
                </NdPagerTab>
                {/* Stok Seçim */}
                <NdPopGrid id={"popItemCode"} parent={this} container={"#root"}
                    visible={false}
                    position={{of:'#root'}} 
                    showTitle={true} 
                    showBorders={true}
                    width={'90%'}
                    height={'90%'}
                    title={this.t("popItemCode.title")} //
                    selection={{mode:"single"}}
                    search={true}
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
                                        "ISNULL((SELECT TOP 1 BARCODE FROM ITEM_BARCODE WHERE ITEM = ITEMS_VW_01.GUID ORDER BY CDATE DESC),'') AS BARCODE,   " +
                                        "MAIN_GRP AS ITEM_GRP,   " +
                                        "MAIN_GRP_NAME AS ITEM_GRP_NAME,   " +
                                        "(SELECT [dbo].[FN_PRICE_SALE](GUID,1,GETDATE(),'00000000-0000-0000-0000-000000000000')) AS PRICE  , " +
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
            </div>
        </div>
        </ScrollView>

        )
    }
}