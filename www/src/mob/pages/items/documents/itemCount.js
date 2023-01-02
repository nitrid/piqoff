import React from 'react';
import App from '../../../lib/app.js';
import { itemCountCls } from '../../../../core/cls/count.js';
import moment from 'moment';

import ScrollView from 'devextreme-react/scroll-view';
import Toolbar from 'devextreme-react/toolbar';
import Form, { Label,Item,EmptyItem } from 'devextreme-react/form';
import TabPanel from 'devextreme-react/tab-panel';
import { Button } from 'devextreme-react/button';

import NdTextBox, { Validator, NumericRule, RequiredRule, CompareRule, EmailRule, PatternRule, StringLengthRule, RangeRule, AsyncRule } from '../../../../core/react/devex/textbox.js'
import NdNumberBox from '../../../../core/react/devex/numberbox.js';
import NdSelectBox from '../../../../core/react/devex/selectbox.js';
import NdCheckBox from '../../../../core/react/devex/checkbox.js';
import NdPopGrid from '../../../../core/react/devex/popgrid.js';
import NdPopUp from '../../../../core/react/devex/popup.js';
import NdGrid,{Column,Editing,Paging,Scrolling,KeyboardNavigation,Pager,Export} from '../../../../core/react/devex/grid.js';
import NdButton from '../../../../core/react/devex/button.js';
import NdDatePicker from '../../../../core/react/devex/datepicker.js';
import NdImageUpload from '../../../../core/react/devex/imageupload.js';
import NdDialog, { dialog } from '../../../../core/react/devex/dialog.js';
import NdDropDownBox from '../../../../core/react/devex/dropdownbox.js';
import NdListBox from '../../../../core/react/devex/listbox.js';
import { datatable } from '../../../../core/core.js';
import tr from '../../../meta/lang/devexpress/tr.js';
import NdPagerTab from '../../../../core/react/devex/pagertab.js';
import NbLabel from '../../../../core/react/bootstrap/label.js';

export default class itemCount extends React.PureComponent
{
    constructor(props)
    {
        super(props)
        this.barcode = 
        {
            guid:"00000000-0000-0000-0000-000000000000",
            name:"",
            barcode: "",
            code:"",
            costPrice : 0
        }
        this.core = App.instance.core;
        this.prmObj = this.param.filter({TYPE:1,USERS:this.user.CODE});
        this.acsobj = this.access.filter({TYPE:1,USERS:this.user.CODE});
        this.countObj = new itemCountCls();

        this._onItemRendered = this._onItemRendered.bind(this)
    }
    async init()
    {
        this.countObj.clearAll()

        this.txtRef.setState({value:this.user.CODE})
        
        this.dtDocDate.value =  moment(new Date()).format("YYYY-MM-DD"),
        this.txtRef.readOnly = true
        this.txtRefno.readOnly = false
        
        this.txtRef.props.onChange()

    }
    async getDoc(pGuid,pRef,pRefno)
    {
        this.countObj.clearAll()
        await this.countObj.load({GUID:pGuid,REF:pRef,REF_NO:pRefno});

        this.txtRef.readOnly = true
        this.txtRefno.readOnly = true

        let totalPrice= await this.countObj.dt().sum("TOTAL_COST",2)
        // this.txtAmount.setState({value :totalPrice})
    }
    async checkDoc(pGuid,pRef,pRefno)
    {
        return new Promise(async resolve =>
        {
            if(pRef !== '')
            {
                let tmpData = await new countObj().load({GUID:pGuid,REF:pRef,REF_NO:pRefno});

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
                        this.getDoc('00000000-0000-0000-0000-000000000000',pRef,pRefno)
                        resolve(2) //KAYIT VAR
                    }
                    else
                    {
                        this.init()
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
       
    }
    barcodeReset()
    {
        
        this.barcode = 
        {
            guid:"00000000-0000-0000-0000-000000000000",
            name:"",
            barcode: "",
            code:"",
            costPrice : 0
        }
        this.txtBarcode.value = ""
        this.txtQuantity.value=1
        this.itemName.value = this.barcode.name
        this.txtBarcode.focus()
    }
    async addItem(pQuantity)
    {    
        if(pQuantity > 10001)
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
        for (let i = 0; i < this.countObj.dt().length; i++) 
        {
            if(this.countObj.dt()[i].ITEM_CODE == this.barcode.code)
            {
                let tmpConfObj = 
                {
                    id:'msgCombineItem',showTitle:true,title:this.t("msgCombineItem.title"),showCloseButton:true,width:'350px',height:'250px',
                    button:[{id:"btn01",caption:this.t("msgCombineItem.btn01"),location:'before'},{id:"btn02",caption:this.t("msgCombineItem.btn02"),location:'before'},{id:"btn03",caption:this.t("msgCombineItem.btn03"),location:'after'}],
                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgCombineItem.msg")}</div>)
                }
                let pResult = await dialog(tmpConfObj);
                if(pResult == 'btn01')
                {
                    this.countObj.dt()[i].QUANTITY = parseFloat(this.countObj.dt()[i].QUANTITY) + parseFloat(pQuantity)
                    let totalPrice= await this.countObj.dt().sum("TOTAL_COST",2)
                    // this.txtAmount.value = totalPrice
                    if(this.countObj.dt()[this.countObj.dt().length - 1].ITEM_CODE == '')
                    {
                        await this.grdItemCount.devGrid.deleteRow(this.countObj.dt().length - 1)
                    }
                    this.barcodeReset()
                    return
                }
                if(pResult == 'btn02')
                {
                    this.countObj.dt()[i].QUANTITY =  parseFloat(pQuantity)
                    let totalPrice= await this.countObj.dt().sum("TOTAL_COST",2)
                    // this.txtAmount.value = totalPrice
                    if(this.countObj.dt()[this.countObj.dt().length - 1].ITEM_CODE == '')
                    {
                        await this.grdItemCount.devGrid.deleteRow(this.countObj.dt().length - 1)
                    }
                    this.barcodeReset()
                    return
                }
                if(pResult == 'btn03')
                {
                    this.barcodeReset()
                    return
                }
                
            }
        }
        let tmpDocItems = {...this.countObj.empty}
        tmpDocItems.LINE_NO = this.countObj.dt().length
        tmpDocItems.REF = this.txtRef.value
        tmpDocItems.REF_NO = this.txtRefno.value
        tmpDocItems.DEPOT = this.cmbDepot.value
        tmpDocItems.DOC_DATE = this.dtDocDate.value
        tmpDocItems.ITEM_CODE = this.barcode.code
        tmpDocItems.ITEM = this.barcode.guid
        tmpDocItems.ITEM_NAME = this.barcode.name
        tmpDocItems.QUANTITY = pQuantity
        tmpDocItems.COST_PRICE = this.barcode.costPrice
        tmpDocItems.BARCODE = this.barcode.barcode
        tmpDocItems.TOTAL_COST =parseFloat(this.barcode.costPrice *pQuantity).toFixed(2)
        this.txtRef.readOnly = true
        this.txtRefno.readOnly = true
        await this.countObj.addEmpty(tmpDocItems)
        let totalPrice= await this.countObj.dt().sum("TOTAL_COST",2)
        // this.txtAmount.value = totalPrice
        if((await this.countObj.save()) == 1)
        {
            document.getElementById("Sound").play(); 
            let tmpConfObj = 
            {
                id:'msgSaveResult',showTitle:true,title:this.t("msgSaveResult.title"),showCloseButton:true,width:'350px',height:'200px',
                button:[{id:"btn01",caption:this.t("msgSaveResult.btn01"),location:'after'}],
                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgSaveResult.msgFailed")}</div>)
            }
            await dialog(tmpConfObj);
        }
        this.txtQuantity.value = 1
        this.barcodeReset()
    }
    async checkRow()
    {
        for (let i = 0; i < this.countObj.dt().length; i++) 
        {
            this.countObj.dt()[i].DEPOT = this.countObj.dt()[0].DEPOT
            this.countObj.dt()[i].DOC_DATE = this.countObj.dt()[0].DOC_DATE
        }
    }  
    async barcodeScan()
    {
        
        cordova.plugins.barcodeScanner.scan(
            async function (result) 
            {
                if(result.cancelled == false)
                {
                    let tmpQuery = 
                    {
                        query : "SELECT ITEM_CODE AS CODE,ITEM_NAME AS NAME,ITEM_GUID AS GUID,BARCODE,[dbo].[FN_PRICE_SALE](ITEM_GUID,1,GETDATE()) AS PRICE,ISNULL((SELECT TOP 1 COST_PRICE FROM ITEMS WHERE ITEMS.GUID = ITEM_BARCODE_VW_01.ITEM_GUID AND DELETED = 0),0) AS COST_PRICE FROM ITEM_BARCODE_VW_01  WHERE BARCODE = @BARCODE OR ITEM_CODE = @BARCODE ",
                        param : ['BARCODE:string|50'],
                        value : [result.text]
                    }
                    let tmpData = await this.core.sql.execute(tmpQuery) 
                    if(tmpData.result.recordset.length >0)
                    {
                        this.barcode = {
                            name:tmpData.result.recordset[0].NAME,
                            code:tmpData.result.recordset[0].CODE,
                            barcode:tmpData.result.recordset[0].BARCODE,
                            price:tmpData.result.recordset[0].PRICE,
                            guid:tmpData.result.recordset[0].GUID,
                            costPrice : tmpData.result.recordset[0].COST_PRICE
                        }                        
                        this.itemName.value = this.barcode.name
                        this.txtBarcode.focus()
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
        await this.core.util.waitUntil(700)
        
        if(e.itemData.name == "Main")
        {
            this.init()
        }
        else if(e.itemData.name == "Barcode")
        {
            
        }
        else if(e.itemData.name == "Document")
        {
            await this.grdItemCount.dataRefresh({source:this.countObj.dt('ITEM_COUNT')});
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
                                    {/* Form */}
                                    <div className="row px-1 pt-1">
                                        <div className="col-12">
                                            <Form colCount={1} id="frmCountFrom">
                                                {/* txtRef-Refno */}
                                                <Item>
                                                    <Label text={this.t("txtRefRefno")} alignment="right" />
                                                    <div className="row">
                                                        <div className="col-4 pe-0">
                                                            <NdTextBox id="txtRef" parent={this} simple={true} dt={{data:this.countObj.dt('ITEM_COUNT'),field:"REF"}}
                                                            upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                                            readOnly={true}
                                                            maxLength={32}
                                                            onChange={(async(e)=>
                                                            {
                                                                let tmpQuery = 
                                                                {
                                                                    query :"SELECT ISNULL(MAX(REF_NO) + 1,1) AS REF_NO FROM ITEM_COUNT WHERE REF = @REF ",
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
                                                            <Validator validationGroup={"frmCountFrom"}>
                                                                    <RequiredRule message={this.t("validRef")} />
                                                                </Validator>  
                                                            </NdTextBox>
                                                        </div>
                                                        <div className="col-8 ps-0">
                                                            <NdTextBox id="txtRefno" parent={this} simple={true} dt={{data:this.countObj.dt('ITEM_COUNT'),field:"REF_NO"}}
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
                                                                                    this.getDoc('00000000-0000-0000-0000-000000000000',data[0].REF,data[0].REF_NO)
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
                                                            <Validator validationGroup={"frmCountFrom"}>
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
                                                    data={{source:{select:{query : "SELECT REF,REF_NO,CONVERT(NVARCHAR,DOC_DATE,104) AS DOC_DATE,DEPOT_NAME,SUM(QUANTITY) AS QUANTITY,COUNT(REF) AS TOTAL_LINE  FROM ITEM_COUNT_VW_01 GROUP BY REF,REF_NO,DOC_DATE,DEPOT_NAME ORDER BY DOC_DATE DESC"},sql:this.core.sql}}}
                                                    >
                                                        <Column dataField="REF" caption={this.t("pg_Docs.clmRef")} width={60} />
                                                        <Column dataField="REF_NO" caption={this.t("pg_Docs.clmRefNo")} width={60}  />                                        
                                                        <Column dataField="DEPOT_NAME" caption={this.t("pg_Docs.clmDepotName")} width={150}  />
                                                        <Column dataField="DOC_DATE" caption={this.t("pg_Docs.clmDocDate")} width={100}  />
                                                    </NdPopGrid>
                                                </Item>
                                                {/* cmbDepot */}
                                                <Item>
                                                    <Label text={this.t("cmbDepot")} alignment="right" />
                                                    <NdSelectBox simple={true} parent={this} id="cmbDepot"
                                                    dt={{data:this.countObj.dt('ITEM_COUNT'),field:"DEPOT"}}  
                                                    displayExpr="NAME"                       
                                                    valueExpr="GUID"
                                                    value=""
                                                    searchEnabled={true}
                                                    notRefresh = {true}
                                                    onValueChanged={(async()=>
                                                    {
                                                        this.checkRow()
                                                    }).bind(this)}
                                                    data={{source:{select:{query : "SELECT * FROM DEPOT_VW_01 "},sql:this.core.sql}}}
                                                    param={this.param.filter({ELEMENT:'cmbDepot',USERS:this.user.CODE})}
                                                    access={this.access.filter({ELEMENT:'cmbDepot',USERS:this.user.CODE})}
                                                    >
                                                        <Validator validationGroup={"frmCountFrom"}>
                                                            <RequiredRule message={this.t("validDepot")} />
                                                        </Validator> 
                                                    </NdSelectBox>
                                                </Item>
                                                {/* dtDocDate */}
                                                <Item>
                                                    <Label text={this.t("dtDocDate")} alignment="right" />
                                                    <NdDatePicker simple={true}  parent={this} id={"dtDocDate"}
                                                    dt={{data:this.countObj.dt('ITEM_COUNT'),field:"DOC_DATE"}}
                                                    onValueChanged={(async()=>
                                                    {
                                                        this.checkRow()
                                                    }).bind(this)}
                                                    >
                                                        <Validator validationGroup={"frmCountFrom"}>
                                                            <RequiredRule message={this.t("validDocDate")} />
                                                        </Validator> 
                                                    </NdDatePicker>
                                                </Item>
                                                <Item>
                                                    <div className="row">
                                                        <div className="col-6 px-2 pt-2">
                                                            <NdButton text={this.t("btnBarcodeEntry")} type="default" width="100%" onClick={async()=>{
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
                                    </div>
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
                                                                        guid:data[0].GUID,
                                                                        costPrice:data[0].COST_PRICE
                                                                    }
                                                                    this.itemName.value = this.barcode.name
                                                                    this.txtQuantity.focus()
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
                                                            query : "SELECT ITEM_CODE AS CODE,ITEM_NAME AS NAME,ITEM_GUID AS GUID,BARCODE,[dbo].[FN_PRICE_SALE](ITEM_GUID,1,GETDATE(),'00000000-0000-0000-0000-000000000000') AS PRICE," + 
                                                            "ISNULL(( SELECT TOP 1 COST_PRICE FROM ITEMS WHERE ITEMS.GUID = ITEM_BARCODE_VW_01.ITEM_GUID AND DELETED = 0),0) AS COST_PRICE FROM ITEM_BARCODE_VW_01  WHERE BARCODE = @BARCODE OR ITEM_CODE = @BARCODE ",
                                                            param : ['BARCODE:string|50'],
                                                            value : [e.component._changedValue]
                                                        }
                                                        let tmpData = await this.core.sql.execute(tmpQuery) 
                                                        if(tmpData.result.recordset.length >0)
                                                        {
                                                            this.barcode.name = tmpData.result.recordset[0].NAME
                                                            this.barcode.barcode = tmpData.result.recordset[0].BARCODE 
                                                            this.barcode.code = tmpData.result.recordset[0].CODE 
                                                            this.barcode.price = tmpData.result.recordset[0].PRICE 
                                                            this.barcode.guid = tmpData.result.recordset[0].GUID 
                                                            this.barcode.costPrice = tmpData.result.recordset[0].COST_PRICE 
                                                            this.txtBarcode.value = ""
                                                            this.itemName.value = this.barcode.name
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
                                                            this.txtBarcode.value = ""
                                                            this.barcode = 
                                                            {
                                                                name:"",
                                                                price:0,
                                                                barcode: "",
                                                                code:"",
                                                                guid:"00000000-0000-0000-0000-000000000000",
                                                                costPrice :0, 
                                                            }
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
                                        <NdGrid parent={this} id={"grdItemCount"} 
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
                                            if((await this.countObj.save()) == 1)
                                            {
                                              
                                            }
                                        }}
                                        onRowRemoved={async(e)=>{
                                            if((await this.countObj.save()) == 1)
                                            {
                                              
                                            }
                                        }}
                                        >
                                            <KeyboardNavigation editOnKeyPress={true} enterKeyAction={'moveFocus'} enterKeyDirection={'column'} />
                                            <Scrolling mode="standard" />
                                            <Editing mode="cell" allowUpdating={true} allowDeleting={true} confirmDelete={false}/>
                                            <Column dataField="ITEM_CODE" caption={this.t("grdItemCount.clmItemCode")} width={150} allowEditing={false}/>
                                            <Column dataField="ITEM_NAME" caption={this.t("grdItemCount.clmItemName")} width={350} allowEditing={false}/>
                                            <Column dataField="QUANTITY" caption={this.t("grdItemCount.clmQuantity")} dataType={'number'} width={150}/>
                                            <Column dataField="DESCRIPTION" caption={this.t("grdItemCount.clmDescription")} />
                                        </NdGrid>
                                    </Item>
                                    </Form>
                                    <div className="row px-2 pt-2">
                                            <div className="col-12">
                                                <Form colCount={4} parent={this} id="frmslsDoc">
                                                    <EmptyItem colSpan={3}/>
                                                    {/*  Toplam Maliyet */}
                                                    {/* <Item>
                                                        <Label text={this.t("txtAmount")} alignment="right" />
                                                        <NdTextBox id="txtAmount" parent={this} simple={true} readOnly={true} 
                                                        maxLength={32}
                                                        ></NdTextBox>
                                                    </Item> */}
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