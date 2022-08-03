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

export default class salesOrder extends React.Component
{
    constructor()
    {
        super()
        this.barcode = 
        {
            name:"",
            price:0,
            barcode: "",
            code:""
        }
        this.core = App.instance.core;
        this.prmObj = this.param.filter({TYPE:1,USERS:this.user.CODE});
        this.acsobj = this.access.filter({TYPE:1,USERS:this.user.CODE});
    }
    async componentDidMount()
    {
        await this.core.util.waitUntil(0)
        this.init()
    }
    async init()
    {
    }
    render()
    {
        return(
        <div className="row px-2 pt-2">
            <Form colCount={1}>
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
                                                price:data[0].PRICE
                                            }
                                            this.numPrice.value = data[0].PRICE
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
                                                    price:data[i].PRICE
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
                                    query : "SELECT ITEM_CODE AS CODE,ITEM_NAME AS NAME,ITEM_GUID AS GUID,BARCODE,[dbo].[FN_PRICE_SALE](ITEM_GUID,1,GETDATE()) AS PRICE FROM ITEM_BARCODE_VW_01  WHERE BARCODE = @BARCODE OR ITEM_CODE = @BARCODE ",
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
                                    this.numPrice.value = parseFloat(tmpData.result.recordset[0].PRICE)
                                    this.setState({tbBarcode:"visible"})
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
                <Item>
                    <NdGrid parent={this} id={"grdChkCustomer"} 
                    showBorders={true} 
                    columnsAutoWidth={true} 
                    allowColumnReordering={true} 
                    allowColumnResizing={true} 
                    height={'400'} 
                    width={'100%'}
                    dbApply={false}
                    onRowUpdated={async(e)=>
                    {

                    }}
                    onRowRemoved={async (e)=>
                    {

                    }}
                    >
                        <KeyboardNavigation editOnKeyPress={true} enterKeyAction={'moveFocus'} enterKeyDirection={'row'} />
                        <Scrolling mode="infinite" />
                        <Editing mode="cell" allowUpdating={true} allowDeleting={true} confirmDelete={false}/>
                        <Column dataField="DATE" caption={this.t("grdChkCustomer.clmDate")} width={100} />
                        <Column dataField="CODE" caption={this.t("grdChkCustomer.clmCustomerCode")} width={150}/>
                        <Column dataField="NAME" caption={this.t("grdChkCustomer.clmCustomerName")} width={350} />
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
                    <Column dataField="CODE" caption={this.t("popItemCode.clmCode")} width={150} />
                    <Column dataField="NAME" caption={this.t("popItemCode.clmName")} width={300} defaultSortOrder="asc" />
            </NdPopGrid>
        </div>
        )
    }
}