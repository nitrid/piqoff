import React from 'react';
import App from '../../../lib/app.js';
import {itemPriceCls,itemBarcodeCls} from '../../../../core/cls/items.js'
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
        this.state = 
        {
            Grid:"hidden",
        }
        this.barcode = 
        {
            name:"",
            price:0,
            barcode: "",
            code:"",
            guid:"00000000-0000-0000-0000-000000000000"
        }
        this.core = App.instance.core;
        this.prmObj = this.param.filter({TYPE:1,USERS:this.user.CODE});
        this.acsobj = this.access.filter({TYPE:1,USERS:this.user.CODE});
        this.itemsPriceObj = new itemPriceCls();
        this.itemsPurcPriceObj = new itemPriceCls();   

        this.barcodeScan = this.barcodeScan.bind(this)
        this.otherShopObj = new datatable()
        this.barcodeObj = new itemBarcodeCls()
        this.otherShopObj.selectCmd =
        {
            query :"SELECT  " +
            "(CONVERT(NVARCHAR, OTHER_SHOP.UPDATE_DATE, 104) + ' ' + CONVERT(NVARCHAR, OTHER_SHOP.UPDATE_DATE, 24)) AS DATE, " + 
            "OTHER_SHOP.CODE, " +
            "OTHER_SHOP.NAME, " +
            "MAX(OTHER_SHOP.BARCODE) AS BARCODE, " +
            "OTHER_SHOP.MULTICODE, " +
            "OTHER_SHOP.SALE_PRICE, " +
            "OTHER_SHOP.CUSTOMER, " +
            "OTHER_SHOP.CUSTOMER_PRICE, " +
            "1 AS QUANTITY, " +
            "OTHER_SHOP.SHOP " +
            "FROM ITEM_BARCODE_VW_01 AS BARCODE " +
            "INNER JOIN OTHER_SHOP_ITEMS AS OTHER_SHOP " +
            "ON BARCODE.BARCODE = OTHER_SHOP.BARCODE " +
            "WHERE BARCODE.ITEM_GUID = @ITEM_GUID " +
            "GROUP BY OTHER_SHOP.CODE,OTHER_SHOP.NAME, OTHER_SHOP.MULTICODE, OTHER_SHOP.SALE_PRICE, OTHER_SHOP.CUSTOMER_PRICE, OTHER_SHOP.CUSTOMER,OTHER_SHOP.SHOP,OTHER_SHOP.UPDATE_DATE " ,
            param : ['ITEM_GUID:string|50']
        }

    }
    async componentDidMount()
    {
        await this.core.util.waitUntil(0)
        this.init()
    }
    async init()
    {
       this.txtBarcode.focus()
       this.otherShopObj.clear()
       await this.grdOtherShop.dataRefresh({source:this.otherShopObj});
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
                        query : "SELECT ITEM_CODE AS CODE,ITEM_NAME AS NAME,ITEM_GUID AS GUID,BARCODE,[dbo].[FN_PRICE_SALE](ITEM_GUID,1,GETDATE(),'00000000-0000-0000-0000-000000000000') AS PRICE FROM ITEM_BARCODE_VW_01  WHERE BARCODE = @BARCODE OR ITEM_CODE = @BARCODE ",
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
                            guid:tmpData.result.recordset[0].GUID
                        }
                        await this.itemsPriceObj.load({ITEM_GUID:tmpData.result.recordset[0].GUID,TYPE:0});
                        if(this.itemsPriceObj.dt().length > 0)
                        {
                            await this.setState({Grid:"visible"}) 
                            await this.grdSalePrice.dataRefresh({source:this.itemsPriceObj.dt('ITEM_PRICE')});
                        }
                        await this.itemsPurcPriceObj.load({ITEM_GUID:tmpData.result.recordset[0].GUID,TYPE:1});
                        if(this.itemsPurcPriceObj.dt().length > 0)
                        {
                            await this.setState({Grid:"visible"}) 
                            await this.grdPurcPrice.dataRefresh({source:this.itemsPurcPriceObj.dt('ITEM_PRICE')});
                        }
                        this.setState({tbBarcode:"visible"})

                        this.otherShopObj.selectCmd.value = [tmpData.result.recordset[0].GUID]
                        await this.otherShopObj.refresh();
                    }
                    else
                    {
                        document.getElementById("Sound").play(); 
                        let tmpConfObj = 
                        {
                            id:'msgBarcodeNotFound',showTitle:true,title:this.t("msgBarcodeNotFound.title"),showCloseButton:true,width:'350px',height:'200px',
                            button:[{id:"btn02",caption:this.t("msgBarcodeNotFound.btn02"),location:'after'}],
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
    async notBarcode()
    {
        let tmpConfObj = 
        {
            id:'msgBarcodeNotFound',showTitle:true,title:this.t("msgBarcodeNotFound.title"),showCloseButton:true,width:'350px',height:'200px',
            button:[{id:"btn01",caption:this.t("msgBarcodeNotFound.btn01"),location:'before'},{id:"btn02",caption:this.t("msgBarcodeNotFound.btn02"),location:'after'}],
            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgBarcodeNotFound.msg")}</div>)
        }
        let pResult = await dialog(tmpConfObj);

        if(pResult == 'btn01')
        {
            this.barcode = 
            {
                name:"",
                price:0,
                barcode: "",
                code:"",
                guid:"00000000-0000-0000-0000-000000000000"
            }
           this.popBarcodeAdd.show()
           this.txtNewBarcode.value = this.txtBarcode.value
           this.txtOldBarcode.readOnly = false
           this.txtOldBarcode.value = ''
           this.setState({tbBarcode:"visible"})
           setTimeout(() => {
            this.txtOldBarcode.focus()
           }, 500);
        }     
        else
        {
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
       
    }
    render()
    {
        return(
        <ScrollView>
            <div className="row px-1 pt-1">
                <Form colCount={2}>
                    <Item>
                    <div className="col-12">
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
                                                    guid:data[0].GUID
                                                }
                                                await this.itemsPriceObj.load({ITEM_GUID:tmpData.result.recordset[0].GUID,TYPE:0});
                                                if(this.itemsPriceObj.dt().length > 0)
                                                {
                                                    await this.setState({Grid:"visible"}) 
                                                    await this.grdSalePrice.dataRefresh({source:this.itemsPriceObj.dt('ITEM_PRICE')});
                                                }
                                                await this.itemsPurcPriceObj.load({ITEM_GUID:tmpData.result.recordset[0].GUID,TYPE:1});
                                                if(this.itemsPurcPriceObj.dt().length > 0)
                                                {
                                                    await this.setState({Grid:"visible"}) 
                                                    await this.grdPurcPrice.dataRefresh({source:this.itemsPurcPriceObj.dt('ITEM_PRICE')});
                                                }
                                                this.setState({tbBarcode:"visible"})
                                                this.otherShopObj.selectCmd.value = [data[0].GUID]
                                                await this.otherShopObj.refresh();
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
                                        this.barcode.price = tmpData.result.recordset[0].PRICE 
                                        this.barcode.guid = tmpData.result.recordset[0].GUID 
                                        await this.itemsPriceObj.load({ITEM_GUID:tmpData.result.recordset[0].GUID});
                                        this.txtBarcode.value = ""
                                        await this.itemsPriceObj.load({ITEM_GUID:tmpData.result.recordset[0].GUID,TYPE:0});
                                        if(this.itemsPriceObj.dt().length > 0)
                                        {
                                            await this.setState({Grid:"visible"}) 
                                            await this.grdSalePrice.dataRefresh({source:this.itemsPriceObj.dt('ITEM_PRICE')});
                                        }
                                        await this.itemsPurcPriceObj.load({ITEM_GUID:tmpData.result.recordset[0].GUID,TYPE:1});
                                        if(this.itemsPurcPriceObj.dt().length > 0)
                                        {
                                            await this.setState({Grid:"visible"}) 
                                            await this.grdPurcPrice.dataRefresh({source:this.itemsPurcPriceObj.dt('ITEM_PRICE')});
                                        }
                                        this.setState({tbBarcode:"visible"})
                                        this.otherShopObj.selectCmd.value = [ tmpData.result.recordset[0].GUID]
                                        await this.otherShopObj.refresh();
                                    }
                                    else
                                    {
                                        document.getElementById("Sound").play(); 
                                        this.notBarcode()
                                    }
                                    
                                }).bind(this)}></NdTextBox>
                        </div>
                    </Item>
                    <Item> 
                        
                            <h5 className="text-center">
                                {this.barcode.name}
                            </h5>
                    </Item>
                    <Item> 
                            <h5 className="text-center">
                                {this.barcode.price} €
                            </h5>
                    </Item>
                </Form>
                <div style={{visibility:this.state.Grid}}>
                <div className="p-1">
                    <Form>
                        <Item>
                            <NdGrid parent={this} id={"grdSalePrice"} 
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
                    </Form>    
                    </div>   
                    <div className="p-1">
                        <Form>
                            <Item>
                                <NdGrid parent={this} id={"grdOtherShop"} 
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
                                    <Column dataField="SHOP" caption={this.t("grdOtherShop.clmShop")}/>
                                    <Column dataField="QUANTITY" caption={this.t("grdOtherShop.clmQuantity")} width={50}/>
                                    <Column dataField="SALE_PRICE" caption={this.t("grdOtherShop.clmPrice")} dataType="number"  width={100} format={{ style: "currency", currency: "EUR",precision: 2}}/>
                                </NdGrid>
                            </Item>
                        </Form>   
                     </div>      
                    <div className="p-1">
                        <Form>
                            <Item>
                                <NdGrid parent={this} id={"grdPurcPrice"} 
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
                                    <Column dataField="CUSTOMER_NAME" caption={this.t("grdPurcPrice.clmCustomer")}/>
                                    <Column dataField="LDATE" caption={this.t("grdPurcPrice.clmStartDate")} dataType="date"  width={75}
                                        editorOptions={{value:null}}
                                        cellRender={(e) => 
                                        {
                                            if(moment(e.value).format("YYYY-MM-DD") != '1970-01-01')
                                            {
                                                return e.text
                                            }
                                            
                                            return
                                        }}/>
                                    <Column dataField="QUANTITY" caption={this.t("grdPurcPrice.clmQuantity")} width={50}/>
                                    <Column dataField="PRICE" caption={this.t("grdPurcPrice.clmPrice")} dataType="number"  width={100} format={{ style: "currency", currency: "EUR",precision: 2}}/>
                                </NdGrid>
                            </Item>
                        </Form>   
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
                {/* Barkod Ekle POPUP */}
                <NdPopUp parent={this} id={"popBarcodeAdd"} 
                visible={false}                        
                showCloseButton={true}
                showTitle={true}
                title={this.t("popBarcodeAdd.title")}
                container={"#root"} 
                width={'90%'}
                height={'300'}
                position={{of:'#root'}}
                >
                    <Form colCount={1} height={'fit-content'} id={"frmPrice" + this.tabIndex}>
                        <Item>
                            <Label text={this.t("txtNewBarcode")} alignment="right" />
                            <NdTextBox id="txtNewBarcode" parent={this} simple={true} validationGroup={"frmBarcode"  + this.tabIndex}
                            readOnly={true}
                            upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}             
                            >   
                            <Validator validationGroup={"frmBarcode"  + this.tabIndex}>
                                    <RequiredRule message={this.t("validCode")} />
                            </Validator>    
                            </NdTextBox>     
                        </Item> 
                        <Item>
                            <Label text={this.t("txtOldBarcode")} alignment="right" />
                            <NdTextBox id="txtOldBarcode" parent={this} simple={true} validationGroup={"frmBarcode"  + this.tabIndex}
                            readOnly={false}
                            upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}    
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
                                        this.txtOldBarcode.readOnly = true
                                        this.barcode.name = tmpData.result.recordset[0].NAME
                                        this.barcode.barcode = tmpData.result.recordset[0].BARCODE 
                                        this.barcode.code = tmpData.result.recordset[0].CODE 
                                        this.barcode.price = tmpData.result.recordset[0].PRICE 
                                        this.barcode.guid = tmpData.result.recordset[0].GUID 
                                        await this.itemsPriceObj.load({ITEM_GUID:tmpData.result.recordset[0].GUID});
                                        this.txtBarcode.value = ""
                                        await this.itemsPriceObj.load({ITEM_GUID:tmpData.result.recordset[0].GUID,TYPE:0});
                                        if(this.itemsPriceObj.dt().length > 0)
                                        {
                                            await this.setState({Grid:"visible"}) 
                                            await this.grdSalePrice.dataRefresh({source:this.itemsPriceObj.dt('ITEM_PRICE')});
                                        }
                                        await this.itemsPurcPriceObj.load({ITEM_GUID:tmpData.result.recordset[0].GUID,TYPE:1});
                                        if(this.itemsPurcPriceObj.dt().length > 0)
                                        {
                                            await this.setState({Grid:"visible"}) 
                                            await this.grdPurcPrice.dataRefresh({source:this.itemsPurcPriceObj.dt('ITEM_PRICE')});
                                        }
                                        this.setState({tbBarcode:"visible"})
                                        this.otherShopObj.selectCmd.value = [ tmpData.result.recordset[0].GUID]
                                        await this.otherShopObj.refresh();
                                    }
                                    else
                                    {
                                        this.txtOldBarcode.readOnly = false
                                        document.getElementById("Sound").play(); 
                                        let tmpConfObj = 
                                        {
                                            id:'msgBarcodeNotFound',showTitle:true,title:this.t("msgBarcodeNotFound.title"),showCloseButton:true,width:'350px',height:'200px',
                                            button:[{id:"btn02",caption:this.t("msgBarcodeNotFound.btn02"),location:'after'}],
                                            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgBarcodeNotFound.msg")}</div>)
                                        }
                                        await dialog(tmpConfObj);
                                    }
                                    
                                }).bind(this)}         
                            >   
                            <Validator validationGroup={"frmBarcode"  + this.tabIndex}>
                                    <RequiredRule message={this.t("validCode")} />
                            </Validator>    
                            </NdTextBox>     
                        </Item>
                            <Item> 
                            <div>
                                <h5 className="text-center">
                                    {this.barcode.name}
                                </h5>
                            </div>
                        </Item>
                        <Item>
                        <div className="row">
                            <div className="col-12 px-4 pt-4">
                            <NdButton text={this.t("btnAddBarcode")} type="default" width="100%" validationGroup={"frmBarcode" + this.tabIndex} onClick={async(e)=>
                            {
                                if(this.barcode.name == '')
                                {
                                    return
                                }
                                if(e.validationGroup.validate().status == "valid")
                                {
                                    let BarType = 0
                                    if(this.txtNewBarcode.value.length == 8)
                                    {                                            
                                        BarType = "0"
                                    }
                                    else if(this.txtNewBarcode.value.length == 13)
                                    {
                                        BarType = "1"
                                    }
                                    else
                                    {
                                        BarType = "2"
                                    }
                                    let tmpBarcodeObj = {...this.barcodeObj.empty}
                                    tmpBarcodeObj.ITEM_GUID = this.barcode.guid
                                    tmpBarcodeObj.BARCODE = this.txtNewBarcode.value
                                    tmpBarcodeObj.TYPE = BarType
                                    this.barcodeObj.addEmpty(tmpBarcodeObj); 
                                    this.barcodeObj.save()
                                    this.popBarcodeAdd.hide()
                                }
                            }}></NdButton>
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