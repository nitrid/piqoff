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
            <Form colCount={2}>
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
                    <div>
                        <h4 className="text-center">
                            {this.barcode.price}
                        </h4>
                    </div>
                </Item>
                <Item>
                    <div className="row">
                        <div className="col-6 px-4 pt-4">
                        <NdButton text={this.t("btnAddPrice")} type="default" width="100%" onClick={()=>{this.popPrice.show()}}></NdButton>
                        </div>
                        <div className="col-6 px-4 pt-4">
                        <NdButton text={this.t("btnChangePrice")} type="default" width="100%" onClick={()=>{this.popChangePrice.show()}}></NdButton>
                        </div>
                    </div>
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
            {/* FİYAT Ekle POPUP */}
            <NdPopUp parent={this} id={"popPrice"} 
            visible={false}                        
            showCloseButton={true}
            showTitle={true}
            title={this.t("popPrice.title")}
            container={"#root"} 
            width={'90%'}
            height={'350'}
            position={{of:'#root'}}
            >
                <Form colCount={2} height={'fit-content'} id={"frmPrice" + this.tabIndex}>
                    <Item>
                        <Label text={this.t("popPrice.dtPopPriStartDate")} alignment="right" />
                        <NdDatePicker simple={true}  parent={this} id={"dtPopPriStartDate"}
                        dt=""/>
                    </Item>
                    <Item>
                        <Label text={this.t("popPrice.dtPopPriEndDate")} alignment="right" />
                        <NdDatePicker simple={true}  parent={this} id={"dtPopPriEndDate"}
                        dt=""/>
                    </Item>
                    <Item>
                        <Label text={this.t("popPrice.txtPopPriQuantity")} alignment="right" />
                        <NdNumberBox id={"txtPopPriQuantity"} parent={this} simple={true}>
                            <Validator validationGroup={"frmPrice" + this.tabIndex}>
                                <RequiredRule message="Miktar'ı boş geçemezsiniz !" />
                            </Validator>
                        </NdNumberBox>
                    </Item>
                    <Item>
                        <Label text={this.t("popPrice.txtPopPriPrice")} alignment="right" />
                        <NdNumberBox id={"txtPopPriPrice"} parent={this} simple={true}>
                            <Validator validationGroup={"frmPrice" + this.tabIndex}>
                                <RequiredRule message="Fiyat'ı boş geçemezsiniz !" />
                                <RangeRule min={0.001} message={"Fiyat sıfırdan küçük olamaz !"} />
                            </Validator> 
                        </NdNumberBox>
                    </Item>
                    <Item>
                        <div className='row'>
                            <div className='col-6'>
                                <NdButton text={this.lang.t("btnSave")} type="normal" stylingMode="contained" width={'100%'}
                                onClick={async (e)=>
                                {

                                }}/>
                            </div>
                            <div className='col-6'>
                                <NdButton text={this.lang.t("btnCancel")} type="normal" stylingMode="contained" width={'100%'}
                                onClick={()=>
                                {
                                    this.popPrice.hide();  
                                }}/>
                            </div>
                        </div>
                    </Item>
                </Form>
            </NdPopUp>
            {/* FİYAT DEĞİŞTİR POPUP */}
            <NdPopGrid id={"popChangePrice"} parent={this} container={"#root"} 
            visible={false}
            position={{of:'#root'}} 
            showTitle={true} 
            showBorders={true}
            width={'90%'}
            height={'90%'}
            title={this.t("popChangePrice.title")} 
            data = 
            {{
                source:
                {
                    select:
                    {
                        query : "",
                        param : ['']
                    },
                    sql:this.core.sql
                }
            }}
            button=
            {
                [
                    {
                        id:'tst',
                        icon:'more',
                        onClick:()=>
                        {
                            console.log(1111)
                        }
                    }
                ]
            }
            >
                <Column dataField="CODE" caption={this.t("popChangePrice.clmCode")} width={150} />
                <Column dataField="NAME" caption={this.t("popChangePrice.clmName")} width={250} defaultSortOrder="asc" />
                <Column dataField="PRICE" caption={this.t("popChangePrice.clmPrice")} width={100} defaultSortOrder="asc" />

            </NdPopGrid>
        </div>
        )
    }
}