import React from 'react';
import App from '../../../lib/app.js';
import {itemsCls,itemPriceCls,itemBarcodeCls,itemMultiCodeCls,unitCls} from '../../../../core/cls/items.js'

import ScrollView from 'devextreme-react/scroll-view';
import Toolbar from 'devextreme-react/toolbar';
import Form, { Label,Item } from 'devextreme-react/form';
import TabPanel from 'devextreme-react/tab-panel';
import { Button } from 'devextreme-react/button';

import NdTextBox, { Validator, NumericRule, RequiredRule, CompareRule, EmailRule, PatternRule, StringLengthRule, RangeRule, AsyncRule } from '../../../../core/react/devex/textbox.js'
import NdNumberBox from '../../../../core/react/devex/numberbox.js';
import NdSelectBox from '../../../../core/react/devex/selectbox.js';
import NdCheckBox from '../../../../core/react/devex/checkbox.js';
import NdPopGrid from '../../../../core/react/devex/popgrid.js';
import NdPopUp from '../../../../core/react/devex/popup.js';
import NdGrid,{Column,Editing,Paging,Scrolling,KeyboardNavigation,Pager} from '../../../../core/react/devex/grid.js';
import NdButton from '../../../../core/react/devex/button.js';
import NdDatePicker from '../../../../core/react/devex/datepicker.js';
import NdImageUpload from '../../../../core/react/devex/imageupload.js';
import { dialog } from '../../../../core/react/devex/dialog.js';

export default class barcodeCard extends React.Component
{
    constructor()
    {
        super() 
        this.core = App.instance.core;
        this.prmObj = this.param.filter({TYPE:1,USERS:this.user.CODE});
        this._getUnit = this._getUnit.bind(this)

        this.itemBarcodeObj = new itemBarcodeCls();
    }
    async componentDidMount()
    {
        await this.core.util.waitUntil(0)
        this.init(); 
    }  
    async init()
    {
        this.itemBarcodeObj.clearAll();
      
        
        let tmpEmpty = {...this.itemBarcodeObj.empty};
        this.itemBarcodeObj.addEmpty(tmpEmpty);  
        console.log(this.itemBarcodeObj.dt()[0])
    }
    async checkBarcode(pCode)
    {
        return new Promise(async resolve => 
        {
            if(pCode !== '')
            {
                let tmpData = await this.itemBarcodeObj.load({BARCODE:pCode});

                if(tmpData.length > 0)
                {
                    this.getBarcode(tmpData[0].BARCODE)
                    resolve(2) //KAYIT VAR
                }
                else
                {
                    resolve(1) //KAYIT BULUNMADI
                }
            }
            else
            {
                resolve(0) //PARAMETRE BOŞ
            }
        });
    }   
    async getBarcode(pCode)
    {
        this.itemBarcodeObj.clearAll();
        await this.itemBarcodeObj.load({BARCODE:pCode});
        this._getUnit(this.itemBarcodeObj.dt()[0].ITEM_GUID)
    }
    async _getUnit(pGuid)
    {
        let tmpSource =
        {
            source : 
            {
                select : 
                {
                    query : "SELECT GUID,NAME,FACTOR FROM ITEM_UNIT_VW_01 WHERE ITEM_GUID =@ITEM_GUID",
                    param : ['ITEM_GUID:string|50'],
                    value : [pGuid]
                },
                sql : this.core.sql
            }
        }
        await this.cmbBarUnit.dataRefresh(tmpSource)
    }
   render()
    {           
        return (
            <div>                
                <ScrollView>                    
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <Toolbar>
                                <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnBack" parent={this} icon="revert" type="default"
                                    onClick={()=>
                                    {
                                        if(this.prevCode != '')
                                        {
                                            this.getItem(this.prevCode); 
                                        }
                                    }}/>
                                </Item>
                                <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnNew" parent={this} icon="file" type="default"
                                    onClick={()=>
                                    {
                                        this.init(); 
                                    }}/>
                                </Item>
                                <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnSave" parent={this} icon="floppy" type="default" validationGroup="frmItems"
                                    onClick={async (e)=>
                                    {
                                        console.log(this.itemBarcodeObj.dt()[0])
                                        let tmpConfObj =
                                        {
                                            id:'msgSave',showTitle:true,title:this.t("msgSave.title"),showCloseButton:true,width:'500px',height:'200px',
                                            button:[{id:"btn01",caption:this.t("msgSave.btn01"),location:'before'},{id:"btn02",caption:this.t("msgSave.btn02"),location:'after'}],
                                            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgSave.msg")}</div>)
                                        }
                                        
                                        let pResult = await dialog(tmpConfObj);
                                        if(pResult == 'btn01')
                                        {
                                            let tmpConfObj1 =
                                            {
                                                id:'msgSaveResult',showTitle:true,title:this.t("msgSave.title"),showCloseButton:true,width:'500px',height:'200px',
                                                button:[{id:"btn01",caption:this.t("msgSave.btn01"),location:'after'}],
                                            }
                                            
                                            if((await this.itemBarcodeObj.save()) == 0)
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
                                </Item>
                                <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnDelete" parent={this} icon="trash" type="default"
                                    onClick={async()=>
                                    {
                                        let tmpConfObj =
                                        {
                                            id:'msgDelete',showTitle:true,title:this.t("msgDelete.title"),showCloseButton:true,width:'500px',height:'200px',
                                            button:[{id:"btn01",caption:this.t("msgDelete.btn01"),location:'before'},{id:"btn02",caption:this.t("msgDelete.btn02"),location:'after'}],
                                            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgDelete.msg")}</div>)
                                        }
                                        
                                        let pResult = await dialog(tmpConfObj);
                                        if(pResult == 'btn01')
                                        {
                                            this.itemBarcodeObj.dt('ITEM_BARCODE').removeAt(0)
                                            await this.itemBarcodeObj.dt('ITEM_BARCODE').delete();
                                            this.init(); 
                                        }
                                    }}/>
                                </Item>
                                <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnCopy" parent={this} icon="copy" type="default"
                                    onClick={()=>
                                    {
                                        
                                    }}/>
                                </Item>
                                <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnPrint" parent={this} icon="print" type="default"
                                    onClick={()=>
                                    {
                                        
                                    }}/>
                                </Item>
                            </Toolbar>
                        </div>
                    </div>
                    <div className="row px-2 pt-2">                        
                        <div className="col-9">
                            <Form colCount={2} id="frmItems">
                                {/* txtBarcode */}
                                <Item>                                    
                                    <Label text={this.t("txtBarcode")} alignment="right" />
                                    <NdTextBox id="txtBarcode" parent={this} simple={true} dt={{data:this.itemBarcodeObj.dt('ITEM_BARCODE'),field:"BARCODE"}}  validationGroup="frmItems"
                                    button=
                                    {
                                        [
                                            {
                                                id:'01',
                                                icon:'more',
                                                onClick:()=>
                                                {
                                                    this.pg_txtBarcode.show()
                                                    this.pg_txtBarcode.onClick = (data) =>
                                                    {
                                                        if(data.length > 0)
                                                        {
                                                            this.getBarcode(data[0].BARCODE)
                                                        }
                                                    }
                                                }
                                            },
                                            {
                                                id:'02',
                                                icon:'arrowdown',
                                                onClick:()=>
                                                {
                                                    this.txtBarcode.value = Math.floor(Date.now() / 1000)
                                                }
                                            }
                                        ]
                                    }
                                    onValueChanged={(e)=>
                                    {
                                        if(parseInt(e.value) == NaN || parseInt(e.value).toString() != e.value)
                                        {
                                            this.cmbPopBarType.value = "2"
                                            return;
                                        }
                                        if(e.value.length == 8)
                                        {                                            
                                            this.cmbPopBarType.value = "0"
                                        }
                                        else if(e.value.length == 13)
                                        {
                                            this.cmbPopBarType.value = "1"
                                        }
                                        else
                                        {
                                            this.cmbPopBarType.value = "2"
                                        }
                                    }}
                                    onChange={(async()=>
                                    {
                                        let tmpResult = await this.checkBarcode(this.txtBarcode.value)
                                        if(tmpResult == 3)
                                        {
                                            this.txtBarcode.value = "";
                                        }
                                    }).bind(this)} 
                                    param={this.param.filter({ELEMENT:'txtBarcode',USERS:this.user.CODE})} 
                                    access={this.access.filter({ELEMENT:'txtBarcode',USERS:this.user.CODE})}                                
                                    >     
                                    </NdTextBox>      
                                    {/* BARCODE SEÇİM POPUP */}
                                    <NdPopGrid id={"pg_txtBarcode"} parent={this} container={"#root"} 
                                    visible={false}
                                    position={{of:'#root'}} 
                                    showTitle={true} 
                                    showBorders={true}
                                    width={'90%'}
                                    height={'90%'}
                                    title={this.t("pg_txtBarcode.title")} 
                                    search={true}
                                    data = 
                                    {{
                                        source:
                                        {
                                            select:
                                            {
                                                query : "SELECT GUID,BARCODE,ITEM_CODE,ITEM_NAME FROM ITEM_BARCODE_VW_01 WHERE UPPER(BARCODE) LIKE UPPER(@VAL) OR UPPER(ITEM_NAME) LIKE UPPER(@VAL) OR UPPER(ITEM_CODE) LIKE UPPER(@VAL)",
                                                param : ['VAL:string|50']
                                            },
                                            sql:this.core.sql
                                        }
                                    }}
                                    >
                                        <Column dataField="BARCODE" caption={this.t("pg_txtBarcode.clmBarcode")} width={150} />
                                        <Column dataField="ITEM_CODE" caption={this.t("pg_txtBarcode.clmItemCode")} width={650} defaultSortOrder="asc" />
                                        <Column dataField="ITEM_NAME" caption={this.t("pg_txtBarcode.clmItemName")} width={650} defaultSortOrder="asc" />
                                        
                                    </NdPopGrid>
                                </Item> 
                                <Item></Item>
                                <Item>
                                    <Label text={this.t("cmbPopBarType")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbPopBarType"
                                    dt={{data:this.itemBarcodeObj.dt('ITEM_BARCODE'),field:"TYPE"}}
                                    displayExpr="VALUE"                       
                                    valueExpr="ID"
                                    value="0"
                                    data={{source:[{ID:"0",VALUE:"EAN8"},{ID:"1",VALUE:"EAN13"},{ID:"2",VALUE:"CODE39"}]}}
                                    />
                                </Item>
                                <Item></Item>
                                {/* txtItem */}
                                <Item>                                    
                                    <Label text={this.t("txtItem")} alignment="right" />
                                    <NdTextBox id="txtItem" parent={this} simple={true} dt={{data:this.itemBarcodeObj.dt('ITEM_BARCODE'),field:"ITEM_CODE"}}  validationGroup="frmItems"
                                    readOnly={true}
                                    button=
                                    {
                                        [
                                            {
                                                id:'01',
                                                icon:'more',
                                                onClick:()=>
                                                {
                                                    this.pg_txtItem.show()
                                                    this.pg_txtItem.onClick = (data) =>
                                                    {
                                                        if(data.length > 0)
                                                        {
                                                            let tmpEmpty = {...this.itemBarcodeObj.empty};
                                                            tmpEmpty.BARCODE = this.txtBarcode.value
                                                            tmpEmpty.TYPE = this.cmbPopBarType.value
                                                            tmpEmpty.UNIT_GUID = this.cmbBarUnit.value
                                                            tmpEmpty.UNIT_NAME = this.cmbBarUnit.displayValue
                                                            tmpEmpty.ITEM_GUID = data[0].GUID
                                                            tmpEmpty.ITEM_NAME = data[0].NAME
                                                            tmpEmpty.ITEM_CODE = data[0].CODE
                                                            this.itemBarcodeObj.addEmpty(tmpEmpty);  
                                                            this._getUnit(data[0].GUID)
                                                        }
                                                    }
                                                }
                                            },
                                        ]
                                    }                       
                                    >     
                                    </NdTextBox>      
                                    {/* STOK SEÇİM POPUP */}
                                    <NdPopGrid id={"pg_txtItem"} parent={this} container={"#root"} 
                                    visible={false}
                                    position={{of:'#root'}} 
                                    showTitle={true} 
                                    showBorders={true}
                                    width={'90%'}
                                    height={'90%'}
                                    title={this.t("pg_txtItem.title")} 
                                    search={true}
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
                                        <Column dataField="CODE" caption={this.t("pg_txtItem.clmCode")} width={150} />
                                        <Column dataField="NAME" caption={this.t("pg_txtItem.clmName")} width={650} defaultSortOrder="asc" />
                                    </NdPopGrid>
                                </Item>                           
                                {/* txtItemName */}
                                <Item>
                                    <Label text={this.t("txtItemName")} alignment="right" />
                                    <NdTextBox id="txtItemName" parent={this} simple={true} 
                                    readOnly={true}
                                    dt={{data:this.itemBarcodeObj.dt('ITEM_BARCODE'),field:"ITEM_NAME"}} 
                                   />
                                </Item>
                                {/* cmbBarUnit */}
                                <Item>
                                    <Label text={this.t("cmbBarUnit")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbBarUnit"
                                    dt={{data:this.itemBarcodeObj.dt('ITEM_BARCODE'),field:"UNIT_GUID"}} 
                                    displayExpr="NAME"                       
                                    valueExpr="GUID"
                                    onValueChanged={(async(e)=>
                                        {
                                            this.txtBarUnitFactor.setState({value:this.cmbBarUnit.data.datatable.where({'GUID':e.value})[0].FACTOR});
                                    }).bind(this)}
                                    />
                                </Item>
                                {/* cmbBarUnit */}
                                <Item>
                                    <Label text={this.t("txtBarUnitFactor")} alignment="right" />
                                    <NdTextBox simple={true} parent={this} id="txtBarUnitFactor" readOnly={true}
                                    dt={{data:this.itemBarcodeObj.dt('ITEM_BARCODE'),field:"UNIT_FACTOR"}} 
                                    />
                                </Item>
                            </Form>
                        </div>
                    </div>                                   
                </ScrollView>
            </div>
        )
        
    }
}