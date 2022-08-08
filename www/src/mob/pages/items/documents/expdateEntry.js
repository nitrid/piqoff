import React from 'react';
import App from '../../../lib/app.js';
import {itemExpDateCls} from '../../../../core/cls/items.js'
import moment from 'moment';

import ScrollView from 'devextreme-react/scroll-view';
import Toolbar from 'devextreme-react/toolbar';
import Form, { Label,Item } from 'devextreme-react/form';
import DropDownButton from 'devextreme-react/drop-down-button';
import TabPanel from 'devextreme-react/tab-panel';
import { Button } from 'devextreme-react/button';

import NdTextBox, { Validator, NumericRule, RequiredRule, CompareRule, EmailRule, PatternRule, StringLengthRule, RangeRule, AsyncRule } from '../../../../core/react/devex/textbox.js'
import NdNumberBox from '../../../../core/react/devex/numberbox.js';
import NdSelectBox from '../../../../core/react/devex/selectbox.js';
import NdCheckBox from '../../../../core/react/devex/checkbox.js';
import NdPopGrid from '../../../../core/react/devex/popgrid.js';
import NdPopUp from '../../../../core/react/devex/popup.js';
import NdGrid,{Column,Editing,Paging,Scrolling} from '../../../../core/react/devex/grid.js';
import NdButton from '../../../../core/react/devex/button.js';
import NdDatePicker from '../../../../core/react/devex/datepicker.js';
import NdImageUpload from '../../../../core/react/devex/imageupload.js';
import NdDialog, { dialog } from '../../../../core/react/devex/dialog.js';
import { datatable } from '../../../../core/core.js';

export default class labelPrinting extends React.Component
{
    constructor()
    {
        super()
        this.state = 
        {
            tbMain:"visible",
            tbBarcode:"hidden",
            tbDocument: "hidden"
        }     
        this.barcode = 
        {
            name:"",
            barcode: "",
            code:"",
            guid : "00000000-0000-0000-0000-000000000000",
        }
        this.core = App.instance.core;
        this.prmObj = this.param.filter({TYPE:1,USERS:this.user.CODE});
        this.acsobj = this.access.filter({TYPE:1,USERS:this.user.CODE});

        this.barcodeScan = this.barcodeScan.bind(this)
        this.barcodeReset = this.barcodeReset.bind(this)
        this.dropmenuClick = this.dropmenuClick.bind(this)

        this.dropmenuMainItems = [this.t("btnNew"),this.t("btnSave")]

        this.expObj = new itemExpDateCls();
    }
    async componentDidMount()
    {
        await this.core.util.waitUntil(0)
        this.init()
    }
    async init()
    {
        this.expObj.clearAll()
        this.barcodeReset()
        this.dtlastDate.value = moment(new Date()).format("DD/MM/YYYY HH:mm:ss")
        await this.grdExpDate.dataRefresh({source:this.expObj.dt('ITEM_EXPDATE')});
        this.setState({tbBarcode:"visible"})
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
                        query : "SELECT ITEM_CODE AS CODE,ITEM_NAME AS NAME,ITEM_GUID AS GUID,BARCODE FROM ITEM_BARCODE_VW_01  WHERE BARCODE = @BARCODE OR ITEM_CODE = @BARCODE ",
                        param : ['BARCODE:string|50'],
                        value : [result.text]
                    }
                    let tmpData = await this.core.sql.execute(tmpQuery) 
                    if(tmpData.result.recordset.length >0)
                    {
                        this.txtBarcode.value = tmpData.result.recordset[0].CODE
                        this.barcode.name = tmpData.result.recordset[0].NAME
                        this.barcode.barcode = tmpData.result.recordset[0].BARCODE 
                        this.barcode.code = tmpData.result.recordset[0].CODE 
                        this.barcode.guid = tmpData.result.recordset[0].GUID 
                        this.txtBarcode.value= ''
                        this.txtPopQuantity.focus()
                        this.setState({tbBarcode:"visible"})
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
    async addItem()
    {
        if(this.barcode.code == '')
        {
            return
        }
        if(this.txtPopQuantity.value == 0)
        {
            let tmpConfObj = 
            {
                id:'msgZeroQuantity',showTitle:true,title:this.t("msgZeroQuantity.title"),showCloseButton:true,width:'350px',height:'200px',
                button:[{id:"btn01",caption:this.t("msgZeroQuantity.btn01"),location:'after'}],
                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgZeroQuantity.msg")}</div>)
            }
            await dialog(tmpConfObj);
            this.txtPopQuantity.focus()
            return
        }
        for (let i = 0; i < this.expObj.dt().length; i++) 
        {
            if(this.expObj.dt()[i].ITEM_CODE == this.barcode.code)
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
                    this.barcodeReset()
                    return
                }
                else
                {
                    break
                }
                
            }
        }
        let tmpDocItems = {...this.expObj.empty}
        tmpDocItems.ITEM_GUID = this.barcode.guid
        tmpDocItems.ITEM_CODE = this.barcode.code
        tmpDocItems.ITEM_NAME = this.barcode.name
        tmpDocItems.QUANTITY = this.txtPopQuantity.value
        tmpDocItems.EXP_DATE = this.dtlastDate.value
        this.expObj.addEmpty(tmpDocItems)
        this.barcodeReset()
        await this.expObj.save()
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
                
                if((await this.expObj.save()) == 0)
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
    barcodeReset()
    {
        this.barcode = 
        {
            name:"",
            barcode: "",
            code:"",
            guid : "00000000-0000-0000-0000-000000000000",
        }
        this.txtPopQuantity.value = 1
        this.dtlastDate.value = moment(new Date()).format("DD/MM/YYYY HH:mm:ss")
        this.txtBarcode.focus()
    }
    render()
    {
        return(

        <ScrollView>
            <div className="row px-2 pt-2">
            <Form colCount={1}>
            <Item>
                        <div className="row">
                            <div className="col-8"></div>
                            <div className="col-4">
                                <DropDownButton text={this.t("btnDropmenu")} icon="menu" items={this.dropmenuMainItems}  onItemClick={this.dropmenuClick}/>
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
                                            this.barcode.name = data[0].NAME
                                            this.barcode.barcode = data[0].BARCODE 
                                            this.barcode.code = data[0].CODE 
                                            this.barcode.guid = data[0].GUID 
                                            this.txtBarcode.value= ''
                                            this.txtPopQuantity.focus()
                                            this.setState({tbBarcode:"visible"})
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
                                    query : "SELECT ITEM_CODE AS CODE,ITEM_NAME AS NAME,ITEM_GUID AS GUID,BARCODE FROM ITEM_BARCODE_VW_01  WHERE BARCODE = @BARCODE OR ITEM_CODE = @BARCODE ",
                                    param : ['BARCODE:string|50'],
                                    value : [e.component._changedValue]
                                }
                                let tmpData = await this.core.sql.execute(tmpQuery) 
                                if(tmpData.result.recordset.length >0)
                                {
                                    this.txtBarcode.value = tmpData.result.recordset[0].CODE
                                    this.barcode.name = tmpData.result.recordset[0].NAME
                                    this.barcode.barcode = tmpData.result.recordset[0].BARCODE 
                                    this.barcode.code = tmpData.result.recordset[0].CODE 
                                    this.barcode.guid = tmpData.result.recordset[0].GUID 
                                    this.txtBarcode.value= ''
                                    this.txtPopQuantity.focus()
                                    this.setState({tbBarcode:"visible"})
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
                        <h4 className="text-center">
                            {this.barcode.name}
                        </h4>
                    </div>
                </Item>
                <Item>
                    <Label text={this.t("txtQuantity")} alignment="right" />
                    <NdTextBox id="txtPopQuantity" parent={this} simple={true}  
                       onEnterKey={(async(e)=>
                        {
                            this.addItem()
                        }).bind(this)}
                    >
                    </NdTextBox>
                </Item>
                <Item>
                    <Label text={this.t("dtlastDate")} alignment="right" />
                    <NdDatePicker simple={true}  parent={this} id={"dtlastDate"}
                    onValueChanged={(async()=>
                        {
                    }).bind(this)}
                    >
                    </NdDatePicker>
                </Item>
                <Item>
                    <div className="row">
                        <div className="col-12 px-4 pt-4">
                            <NdButton text={this.t("btnItemAdd")} type="default" width="100%" onClick={()=>this.addItem()}></NdButton>
                        </div>
                    </div>
                </Item>
                <Item>
                    <NdGrid parent={this} id={"grdExpDate"} 
                    showBorders={true} 
                    columnsAutoWidth={true} 
                    allowColumnReordering={true} 
                    allowColumnResizing={true} 
                    height={'400'} 
                    width={'100%'}
                    dbApply={false}
                    onRowUpdated={async(e)=>{
                        
                    }}
                    onRowRemoved={async (e)=>{
                       this.expObj.save()
                    }}
                    >
                        <Scrolling mode="infinite" />
                        <Editing mode="cell" allowUpdating={true} allowDeleting={true} confirmDelete={false}/>
                        <Column dataField="ITEM_NAME" caption={this.t("grdExpDate.clmName")} width={250} />
                        <Column dataField="EXP_DATE" caption={this.t("grdExpDate.clmDate")} width={250} />
                        <Column dataField="ITEM_CODE" caption={this.t("grdExpDate.clmCode")} width={150}/>
                    </NdGrid>
                </Item>
            </Form>
            {/* Stok Seçim */}
            <NdPopGrid id={"popItemCode"} parent={this} container={"#root"}
                visible={false}
                position={{of:'#root'}} 
                showTitle={true} 
                showBorders={true}
                width={'90%'}
                height={'90%'}
                selection={{mode:"single"}}
                title={this.t("popItemCode.title")} //
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
            </div>
        </ScrollView>
            
        )
    }
}