import React from 'react';
import App from '../../../lib/app.js';

import moment from 'moment';

import ScrollView from 'devextreme-react/scroll-view';
import Toolbar from 'devextreme-react/toolbar';
import Form, { Label,Item,EmptyItem,GroupItem, SimpleItem } from 'devextreme-react/form';

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
            barcode: "",
            code:"",
            grp:"",
            guid: "00000000-0000-0000-0000-000000000000",
        }
        this.grp = ''
        this.core = App.instance.core;
        this.prmObj = this.param.filter({TYPE:1,USERS:this.user.CODE});
        this.acsobj = this.access.filter({TYPE:1,USERS:this.user.CODE});
        this.barcodeScan = this.barcodeScan.bind(this)
        this.save = ''
    }
    async componentDidMount()
    {
        await this.core.util.waitUntil(0)
        this.init()
    }
    async init()
    {
        this.popitemGrpSelect.show()
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
                        query : "SELECT ITEM_CODE AS CODE,ITEM_NAME AS NAME,ITEM_GUID AS GUID,BARCODE, " +
                        "ISNULL((SELECT TOP 1 NAME FROM ITEM_GROUP WHERE CODE = ISNULL((SELECT TOP 1 MAIN FROM ITEMS_GRP WHERE ITEMS_GRP.ITEM = ITEM_BARCODE_VW_01.ITEM_GUID),'')),'') AS GRP FROM ITEM_BARCODE_VW_01  WHERE BARCODE = @BARCODE OR ITEM_CODE = @BARCODE ",
                        param : ['BARCODE:string|50'],
                        value : [result.text]
                    }
                    let tmpData = await this.core.sql.execute(tmpQuery) 
                    if(tmpData.result.recordset.length >0)
                    {
                        this.barcode.name = tmpData.result.recordset[0].NAME
                        this.barcode.barcode = tmpData.result.recordset[0].BARCODE 
                        this.barcode.code = tmpData.result.recordset[0].CODE 
                        this.barcode.grp = tmpData.result.recordset[0].GRP 
                        this.barcode.guid = tmpData.result.recordset[0].GUID 
                        this.txtBarcode.value = ""
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
                        this.barcode = 
                        {
                            name:"",
                            barcode: "",
                            code:"",
                            grp:"",
                            guid: "00000000-0000-0000-0000-000000000000",
                        }
                        this.txtBarcode.value = ""
                        this.setState({tbBarcode:"visible"})
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
    async updateGroup()
    {
        let tmpQuery = 
        {
            query : "UPDATE ITEMS_GRP SET MAIN = @MAIN,LUSER = @LUSER,LDATE=GETDATE() WHERE ITEM = @ITEM",
            param : ['MAIN:string|25','ITEM:string|50','ITEM:string|50'],
            value : [this.cmbItemGrp.value,this.barcode.guid,this.user.CODE]
        }
        await this.core.sql.execute(tmpQuery) 
        this.save = this.t("Succes")
        this.setState({tbBarcode:"visible"})
    }
    render()
    {
        return(
        <ScrollView>
            <div className="row px-1 pt-1">
                <Form colCount={2}>
                    {/* <Item>
                        <div className="row">
                            <div className="col-4">
                            </div>
                            <div className="col-4">
                            </div>
                            <div className="col-4">
                                
                                <NdCheckBox id="chkAutoAdd" text={this.t("chkAutoAdd")} parent={this} defaultValue={true} 
                                param={this.param.filter({ELEMENT:'chkAutoAdd',USERS:this.user.CODE})}
                                access={this.access.filter({ELEMENT:'chkAutoAdd',USERS:this.user.CODE})}/>
                            </div>
                        </div>
                    </Item> */}
                     <Item> 
                        <div>
                            <h5 className='text-danger'>
                                {this.t("thisGrp")} : {this.grp}
                            </h5>
                        </div>
                    </Item>
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
                                            if(data.length == 1)
                                            {
                                                this.txtBarcode.value = data[0].CODE
                                                this.barcode = {
                                                    name:data[0].NAME,
                                                    code:data[0].CODE,
                                                    barcode:data[0].BARCODE,
                                                    grp:data[0].GRP,
                                                    guid:data[0].GUID
                                                }
                                                this.txtBarcode.value = ""
                                                
                                                    this.updateGroup()
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
                                        query : "SELECT ITEM_CODE AS CODE,ITEM_NAME AS NAME,ITEM_GUID AS GUID,BARCODE, " +
                                        "ISNULL((SELECT TOP 1 NAME FROM ITEM_GROUP WHERE CODE = ISNULL((SELECT TOP 1 MAIN FROM ITEMS_GRP WHERE ITEMS_GRP.ITEM = ITEM_BARCODE_VW_01.ITEM_GUID),'')),'') AS GRP FROM ITEM_BARCODE_VW_01  WHERE BARCODE = @BARCODE OR ITEM_CODE = @BARCODE ",
                                        param : ['BARCODE:string|50'],
                                        value : [e.component._changedValue]
                                    }
                                    let tmpData = await this.core.sql.execute(tmpQuery) 
                                    if(tmpData.result.recordset.length >0)
                                    {
                                        this.barcode.name = tmpData.result.recordset[0].NAME
                                        this.barcode.barcode = tmpData.result.recordset[0].BARCODE 
                                        this.barcode.code = tmpData.result.recordset[0].CODE 
                                        this.barcode.grp = tmpData.result.recordset[0].GRP 
                                        this.barcode.guid = tmpData.result.recordset[0].GUID 
                                        this.txtBarcode.value = ""
                                      
                                        this.updateGroup()
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
                                        this.barcode = 
                                        {
                                            name:"",
                                            barcode: "",
                                            code:"",
                                            grp:"",
                                            guid: "00000000-0000-0000-0000-000000000000",
                                        }
                                        this.txtBarcode.value = ""
                                        this.setState({tbBarcode:"visible"})
                                    }
                                }).bind(this)}></NdTextBox>
                        </div>
                    </Item>
                    <Item> 
                        <div>
                            <h5 className="text-center">
                                {this.barcode.name}
                            </h5>
                        </div>
                    </Item>
                    <Item> 
                        <div>
                            <h5 className="text-center text-success">
                                {this.save}
                            </h5>
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
                    title={this.t("popItemCode.title")} 
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
                                        "(SELECT [dbo].[FN_PRICE_SALE](GUID,1,GETDATE()),'00000000-0000-0000-0000-000000000000') AS PRICE  , " +
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
                   {/* Ürün :Grubu Seçimi */}
                   <NdPopUp parent={this} id={"popitemGrpSelect"} 
                visible={false}                        
                showTitle={true}
                title={this.t("popitemGrpSelect.title")}
                container={"#root"} 
                width={'100%'}
                height={'200'}
                position={{of:'#root'}}
                >
                    <Form colCount={1} height={'fit-content'} id={"frmPrice" + this.tabIndex}>
                    {/* cmbItemGrp */}
                    <Item>
                        <Label text={this.t("cmbItemGrp")} alignment="right" />
                        <NdSelectBox simple={true} parent={this} id="cmbItemGrp" tabIndex={this.tabIndex}
                        displayExpr="NAME"                       
                        valueExpr="CODE"
                        value=""
                        searchEnabled={true} 
                        showClearButton={true}
                        pageSize ={50}
                        notRefresh={true}
                        param={this.param.filter({ELEMENT:'cmbItemGrp',USERS:this.user.CODE})}
                        access={this.access.filter({ELEMENT:'cmbItemGrp',USERS:this.user.CODE})}
                        data={{source:{select:{query : "SELECT CODE,NAME FROM ITEM_GROUP ORDER BY NAME ASC"},sql:this.core.sql}}}
                        onValueChanged={(e)=>
                        {
                            this.grp = this.cmbItemGrp.displayValue
                            this.setState({tbBarcode:"visible"})
                        }}
                        />
                    </Item>
                        <Item>
                        <div className="row">
                            <div className="col-12 px-4 pt-4">
                            <NdButton text={this.t("btnApprove")} type="default" width="100%" validationGroup={"frmBarcode" + this.tabIndex} onClick={async(e)=>
                            {
                               this.popitemGrpSelect.hide()
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