import React from 'react';
import App from '../../../lib/app.js';
import {itemBarcodeCls} from '../../../../core/cls/items.js'
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

export default class salesOrder extends React.Component
{
    constructor()
    {
        super()
        this.barcode = 
        {
            name:"",
            unit:"00000000-0000-0000-0000-000000000000",
            barcode: "",
            code:"",
            guid:"00000000-0000-0000-0000-000000000000"
        }
        this.core = App.instance.core;
        this.prmObj = this.param.filter({TYPE:1,USERS:this.user.CODE});
        this.acsobj = this.access.filter({TYPE:1,USERS:this.user.CODE});
        this.itemBarcodeObj = new itemBarcodeCls();   
        this.barcodeScan = this.barcodeScan.bind(this)

    }
    async componentDidMount()
    {
        await this.core.util.waitUntil(0)
        this.init()
    }
    async init()
    {
        this.barcode = 
        {
            name:"",
            unit:"00000000-0000-0000-0000-000000000000",
            barcode: "",
            code:"",
            guid:"00000000-0000-0000-0000-000000000000"
        }
        await this.grdBarcode.dataRefresh({source:this.itemBarcodeObj.dt('ITEM_BARCODE')});
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
                        query : "SELECT ITEM_CODE AS CODE,ITEM_NAME AS NAME,ITEM_GUID AS GUID,BARCODE,ISNULL((SELECT TOP 1 GUID FROM ITEM_UNIT WHERE ITEM = ITEM_GUID AND TYPE = 0),'00000000-0000-0000-0000-000000000000') AS UNIT FROM ITEM_BARCODE_VW_01  WHERE BARCODE = @BARCODE OR ITEM_CODE = @BARCODE ",
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
                            unit:tmpData.result.recordset[0].UNIT,
                            guid:tmpData.result.recordset[0].GUID
                        }
                        await this.itemBarcodeObj.load({ITEM_GUID:tmpData.result.recordset[0].GUID});
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
        let tmpQuery = 
        {
            query : "SELECT ITEM_CODE AS CODE,ITEM_NAME AS NAME,ITEM_GUID AS GUID,BARCODE,[dbo].[FN_PRICE_SALE](ITEM_GUID,1,GETDATE(),'00000000-0000-0000-0000-000000000000') AS PRICE FROM ITEM_BARCODE_VW_01  WHERE BARCODE = @BARCODE OR ITEM_CODE = @BARCODE ",
            param : ['BARCODE:string|50'],
            value : [this.txtNewBarcode.value]
        }
        let tmpData = await this.core.sql.execute(tmpQuery) 
        if(tmpData.result.recordset.length >0)
        {
            let tmpConfObj = 
            {
                id:'msgDoubleBarcode',showTitle:true,title:this.t("msgDoubleBarcode.title"),showCloseButton:true,width:'350px',height:'200px',
                button:[{id:"btn01",caption:this.t("msgDoubleBarcode.btn01"),location:'after'}],
                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgDoubleBarcode.msg")}</div>)
            }
            await dialog(tmpConfObj);
            return
        }
        let tmpBarcode = {...this.itemBarcodeObj.empty}
        tmpBarcode.UNIT_GUID = this.barcode.unit
        tmpBarcode.ITEM_GUID = this.barcode.guid
        tmpBarcode.BARCODE = this.txtNewBarcode.value
        this.itemBarcodeObj.addEmpty(tmpBarcode);
        this.itemBarcodeObj.save()
        this.txtNewBarcode.value = ''
    }
    render()
    {
        return(
            <ScrollView>
                <div className="row px-2 pt-2">
                    <Form colCount={2}>
                        <Item>
                        <div className="row">
                        <div className="col-9 px-1 pt-2">
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
                                                if(data.length > 0)
                                                {
                                                    this.txtBarcode.value = data[0].CODE
                                                    this.barcode = {
                                                        name:data[0].NAME,
                                                        code:data[0].CODE,
                                                        barcode:data[0].BARCODE,
                                                        unit:data[0].UNIT,
                                                        guid:data[0].GUID
                                                    }
                                                    await this.itemBarcodeObj.load({ITEM_GUID:data[0].GUID});
                                                    this.txtBarcode.value = ""
                                                    this.txtNewBarcode.focus()
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
                                            query : "SELECT ITEM_CODE AS CODE,ITEM_NAME AS NAME,ITEM_GUID AS GUID,BARCODE,ISNULL((SELECT TOP 1 GUID FROM ITEM_UNIT WHERE ITEM = ITEM_GUID AND TYPE = 0),'00000000-0000-0000-0000-000000000000') AS UNIT FROM ITEM_BARCODE_VW_01  WHERE BARCODE = @BARCODE OR ITEM_CODE = @BARCODE ",
                                            param : ['BARCODE:string|50'],
                                            value : [e.component._changedValue]
                                        }
                                        let tmpData = await this.core.sql.execute(tmpQuery) 
                                        if(tmpData.result.recordset.length >0)
                                        {
                                            this.barcode.name = tmpData.result.recordset[0].NAME
                                            this.barcode.barcode = tmpData.result.recordset[0].BARCODE 
                                            this.barcode.code = tmpData.result.recordset[0].CODE 
                                            this.barcode.unit = tmpData.result.recordset[0].UNIT 
                                            this.barcode.guid = tmpData.result.recordset[0].GUID 
                                            await this.itemBarcodeObj.load({ITEM_GUID:tmpData.result.recordset[0].GUID});
                                            this.txtBarcode.value = ""
                                            this.txtNewBarcode.focus()
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
                                            this.barcode = 
                                            {
                                                name:"",
                                                price:0,
                                                barcode: "",
                                                code:"",
                                                guid:"00000000-0000-0000-0000-000000000000"
                                            }
                                        }
                                        
                                    }).bind(this)}></NdTextBox>
                            </div>
                            <div className="col-3 px-1 pt-2">
                            <NdButton text={this.lang.t("btnGet")} type="default" width="100%" onClick={async()=>
                                {
                                    let tmpQuery = 
                                    {
                                        query : "SELECT ITEM_CODE AS CODE,ITEM_NAME AS NAME,ITEM_GUID AS GUID,BARCODE,ISNULL((SELECT TOP 1 GUID FROM ITEM_UNIT WHERE ITEM = ITEM_GUID AND TYPE = 0),'00000000-0000-0000-0000-000000000000') AS UNIT FROM ITEM_BARCODE_VW_01  WHERE BARCODE = @BARCODE OR ITEM_CODE = @BARCODE ",
                                        param : ['BARCODE:string|50'],
                                        value : [this.txtBarcode.value]
                                    }
                                    let tmpData = await this.core.sql.execute(tmpQuery) 
                                    if(tmpData.result.recordset.length >0)
                                    {
                                        this.barcode.name = tmpData.result.recordset[0].NAME
                                        this.barcode.barcode = tmpData.result.recordset[0].BARCODE 
                                        this.barcode.code = tmpData.result.recordset[0].CODE 
                                        this.barcode.unit = tmpData.result.recordset[0].UNIT 
                                        this.barcode.guid = tmpData.result.recordset[0].GUID 
                                        await this.itemBarcodeObj.load({ITEM_GUID:tmpData.result.recordset[0].GUID});
                                        this.txtBarcode.value = ""
                                        this.txtNewBarcode.focus()
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
                                        this.barcode = 
                                        {
                                            name:"",
                                            price:0,
                                            barcode: "",
                                            code:"",
                                            guid:"00000000-0000-0000-0000-000000000000"
                                        }
                                    }
                                }}></NdButton>
                            </div>
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
                            <NdTextBox id="txtNewBarcode" parent={this} placeholder={this.t("txtNewBarcodePlace")}
                            onEnterKey={(async(e)=>
                                {
                                this.addItem()
                                }).bind(this)}>
                                
                            </NdTextBox>
                        </Item>
                        <Item>
                            <div className="row">
                                <div className="col-12 px-4 pt-4">
                                <NdButton text={this.t("btnAdd")} type="default" width="100%" onClick={async()=>
                                {
                                    if(this.barcode.code == "")
                                    {
                                        let tmpConfObj = 
                                        {
                                            id:'msgItemNotSelect',showTitle:true,title:this.t("msgItemNotSelect.title"),showCloseButton:true,width:'350px',height:'200px',
                                            button:[{id:"btn01",caption:this.t("msgItemNotSelect.btn01"),location:'after'}],
                                            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgItemNotSelect.msg")}</div>)
                                        }
                                        await dialog(tmpConfObj);
                                        return
                                    }
                                    this.addItem()
                                
                                }}></NdButton>
                                </div>
                            </div>
                        </Item>
                        <Item>
                            <NdGrid parent={this} id={"grdBarcode"} 
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
                                <Column dataField="BARCODE" caption={this.t("grdBarcode.clmBarcode")}/>
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
                                            "ISNULL((SELECT TOP 1 GUID FROM ITEM_UNIT WHERE ITEM = ITEMS_VW_01.GUID AND TYPE = 0),'') AS UNIT " +
                                            "FROM ITEMS_VW_01 WHERE ISNULL((SELECT TOP 1 BARCODE FROM ITEM_BARCODE WHERE ITEM = ITEMS_VW_01.GUID),'00000000-0000-0000-0000-000000000000') <> '') AS TMP " +
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