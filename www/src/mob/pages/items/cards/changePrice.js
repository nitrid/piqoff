import React from 'react';
import App from '../../../lib/app.js';
import {itemPriceCls} from '../../../../core/cls/items.js'
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
            code:"",
            guid:"00000000-0000-0000-0000-000000000000",
            costPrice: 0
        }
        this.core = App.instance.core;
        this.prmObj = this.param.filter({TYPE:1,USERS:this.user.CODE});
        this.acsobj = this.access.filter({TYPE:1,USERS:this.user.CODE});
        this.itemsPriceObj = new itemPriceCls();   
        this.barcodeScan = this.barcodeScan.bind(this)

    }
    async componentDidMount()
    {
        await this.core.util.waitUntil(0)
        this.init()
    }
    async init()
    {
        await this.grdPrice.dataRefresh({source:this.itemsPriceObj.dt('ITEM_PRICE')});
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
                        query : "SELECT ITEM_CODE AS CODE,ITEM_NAME AS NAME,ITEM_GUID AS GUID,BARCODE,[dbo].[FN_PRICE_SALE](ITEM_GUID,1,GETDATE()) AS PRICE,COST_PRICE FROM ITEM_BARCODE_VW_01  WHERE BARCODE = @BARCODE OR ITEM_CODE = @BARCODE ",
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
                        await this.itemsPriceObj.load({ITEM_GUID:tmpData.result.recordset[0].GUID,TYPE:0});
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
    render()
    {
        return(
            <ScrollView>
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
                                            if(data.length > 0)
                                            {
                                                this.txtBarcode.value = data[0].CODE
                                                this.barcode = {
                                                    name:data[0].NAME,
                                                    code:data[0].CODE,
                                                    barcode:data[0].BARCODE,
                                                    price:data[0].PRICE,
                                                    guid:data[0].COST_PRICE,
                                                    costPrice:data[0].COST_PRICE
                                                }
                                                await this.itemsPriceObj.load({ITEM_GUID:data[0].GUID,TYPE:0});
                                                this.txtBarcode.value = ""
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
                                        query : "SELECT ITEM_CODE AS CODE,ITEM_NAME AS NAME,ITEM_GUID AS GUID,BARCODE,[dbo].[FN_PRICE_SALE](ITEM_GUID,1,GETDATE(),'00000000-0000-0000-0000-000000000000') AS PRICE,COST_PRICE FROM ITEM_BARCODE_VW_01  WHERE BARCODE = @BARCODE OR ITEM_CODE = @BARCODE ",
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
                                        await this.itemsPriceObj.load({ITEM_GUID:tmpData.result.recordset[0].GUID,TYPE:0});
                                        this.txtBarcode.value = ""
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
                                {this.barcode.price} €
                            </h4>
                        </div>
                    </Item>
                    <Item>
                        <div className="row">
                            <div className="col-12 px-4 pt-4">
                            <NdButton text={this.t("btnAddPrice")} type="default" width="100%" onClick={async()=>
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
                                this.txtPopPriQuantity.value = 1
                                this.txtPopPriPrice.value = 0
                                this.popPrice.show()
                            }}></NdButton>
                            </div>
                        </div>
                    </Item>
                    <Item>
                        <NdGrid parent={this} id={"grdPrice"} 
                        showBorders={true} 
                        columnsAutoWidth={true} 
                        allowColumnReordering={true} 
                        allowColumnResizing={true} 
                        height={'100%'} 
                        width={'100%'}
                        dbApply={false}
                        >
                            <Paging defaultPageSize={5} />
                            <Editing mode="cell" allowUpdating={true} allowDeleting={true} />
                            <Column dataField="FINISH_DATE" caption={this.t("grdSalePrice.clmStartDate")} dataType="date" 
                                    editorOptions={{value:null}}
                                    cellRender={(e) => 
                                    {
                                        if(moment(e.value).format("YYYY-MM-DD") != '1970-01-01')
                                        {
                                            return e.text
                                        }
                                        
                                        return
                                    }}/>
                                <Column dataField="QUANTITY" caption={this.t("grdSalePrice.clmQuantity")} width={50}/>
                                <Column dataField="PRICE" caption={this.t("grdSalePrice.clmPrice")} dataType="number" width={100} format={{ style: "currency", currency: "EUR",precision: 2}}/>
                        </NdGrid>
                    </Item>
                    <Item>
                        <div className='row'>
                            <div className='col-6'>
                                <NdButton text={this.lang.t("btnSave")} type="normal" stylingMode="contained" width={'100%'} validationGroup={"frmPrice" + this.tabIndex}
                                onClick={async (e)=>
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
                                        
                                        if((await this.itemsPriceObj.save()) == 0)
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
                                }}/>
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
                                        "COST_PRICE,   " +
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
                {/* FİYAT Ekle POPUP */}
                <NdPopUp parent={this} id={"popPrice"} 
                visible={false}                        
                showCloseButton={true}
                showTitle={true}
                title={this.t("popPrice.title")}
                container={"#root"} 
                width={'90%'}
                height={'400'}
                position={{of:'#root'}}
                >
                    <Form colCount={1} height={'fit-content'} id={"frmPrice" + this.tabIndex}>
                        {/* Depot */}
                        <Item>
                            <Label text={this.t("txtDepot")} alignment="right" />
                            <NdSelectBox simple={true} parent={this} id="popcmbDepot" notRefresh = {true}
                            dt=""
                            displayExpr="NAME"
                            valueExpr="GUID"
                            value=""
                            searchEnabled={true}
                            showClearButton={true}
                            onValueChanged={(async(e)=>
                                {
                                }).bind(this)}
                            data={{source:{select:{query : "SELECT * FROM DEPOT_VW_01"},sql:this.core.sql}}}
                            param={this.param.filter({ELEMENT:'popcmbDepot',USERS:this.user.CODE})}
                            access={this.access.filter({ELEMENT:'popcmbDepot',USERS:this.user.CODE})}
                            >
                            </NdSelectBox>
                        </Item>
                        <Item>
                            <Label text={this.t("popPrice.txtPopPriQuantity")} alignment="right" />
                            <NdNumberBox id={"txtPopPriQuantity"} parent={this} simple={true} value="1">
                                <Validator validationGroup={"frmPrice" + this.tabIndex}>
                                    <RequiredRule message="Miktar'ı boş geçemezsiniz !" />
                                    <RangeRule min={0.001} message={"Fiyat sıfırdan küçük olamaz !"} />
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
                                    <NdButton text={this.lang.t("btnSave")} type="normal" stylingMode="contained" width={'100%'} validationGroup={"frmPrice" + this.tabIndex}
                                    onClick={async (e)=>
                                    {
                                          //FİYAT GİRERKEN MALİYET FİYAT KONTROLÜ
                                          if(this.prmObj.filter({ID:'SalePriceCostCtrl'}).getValue() && this.this.barcode.costPrice.value >= this.txtPopPriPrice.value)
                                          {
                                              let tmpConfObj =
                                              {
                                                  id:'msgCostPriceValid',showTitle:true,title:this.t("msgCostPriceValid.title"),showCloseButton:true,width:'500px',height:'200px',
                                                  button:[{id:"btn01",caption:this.t("msgCostPriceValid.btn01"),location:'after'}],
                                                  content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgCostPriceValid.msg")}</div>)
                                              }
                                              await dialog(tmpConfObj);
                                              return;
                                          }
                                        if(e.validationGroup.validate().status == "valid")
                                        {
                                            let tmpPriceObj = {...this.itemsPriceObj.empty}
                                            tmpPriceObj.ITEM_GUID = this.barcode.guid
                                            tmpPriceObj.PRICE = this.txtPopPriPrice.value
                                            tmpPriceObj.DEPOT = this.popcmbDepot.value == '' ? '00000000-0000-0000-0000-000000000000' : this.popcmbDepot.value
                                            tmpPriceObj.QUANTITY = this.txtPopPriQuantity.value
                                            this.itemsPriceObj.addEmpty(tmpPriceObj); 
                                        
                                            let tmpConfObj1 =
                                            {
                                                id:'msgSaveResult',showTitle:true,title:this.t("msgSave.title"),showCloseButton:true,width:'350px',height:'200px',
                                                button:[{id:"btn01",caption:this.t("msgSave.btn01"),location:'after'}],
                                            }
                                            
                                            if((await this.itemsPriceObj.save()) == 0)
                                            {                       
                                                tmpConfObj1.content = (<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgSaveResult.msgSuccess")}</div>)
                                                await dialog(tmpConfObj1);
                                                this.popPrice.hide()
                                            }
                                            else
                                            {
                                                tmpConfObj1.content = (<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgSaveResult.msgFailed")}</div>)
                                                await dialog(tmpConfObj1);
                                                this.popPrice.hide()
                                            }
                                        }
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
            </div>
        </ScrollView>
        )
    }
}