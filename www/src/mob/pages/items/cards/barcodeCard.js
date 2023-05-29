import React from 'react';
import App from '../../../lib/app.js';
import {itemsCls,itemPriceCls,itemBarcodeCls,itemMultiCodeCls,unitCls} from '../../../../core/cls/items.js'


import ScrollView from 'devextreme-react/scroll-view';
import Toolbar from 'devextreme-react/toolbar';
import Form, { Label,Item, EmptyItem } from 'devextreme-react/form';
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
        this.cmbBarUnit.value = ''
        this.txtBarUnitFactor.setState({value:'0'})
        this.txtItem.setState({value:''})
        this.txtItemName.setState({value:''})
        this.txtBarcode.value = ''
    }
    async checkBarcode(pCode)
    {
        return new Promise(async resolve => 
        {
            if(pCode !== '')
            {
                let tmpQuery = 
                {
                    query :"SELECT BARCODE FROM ITEM_BARCODE WHERE BARCODE = @CODE",
                    param : ['CODE:string|50'],
                    value : [pCode]
                }
                let tmpData = await this.core.sql.execute(tmpQuery) 

                if(tmpData.result.recordset.length > 0)
                {
                    let tmpConfObj =
                    {
                        id:'msgCheckBarcode',showTitle:true,title:this.t("msgCheckBarcode.title"),showCloseButton:true,width:'350px',height:'200px',
                        button:[{id:"btn01",caption:this.t("msgCheckBarcode.btn01"),location:'after'}],
                        content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgCheckBarcode.msg")}</div>)
                    }
                    
                    await dialog(tmpConfObj);
                    this.getBarcode(tmpData.result.recordset[0].BARCODE)
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
                    query : "SELECT GUID,NAME,FACTOR,TYPE FROM ITEM_UNIT_VW_01 WHERE ITEM_GUID =@ITEM_GUID",
                    param : ['ITEM_GUID:string|50'],
                    value : [pGuid]
                },
                sql : this.core.sql
            }
        }
        await this.cmbBarUnit.dataRefresh(tmpSource)
        if(this.cmbBarUnit.data.datatable.length > 0)
        {
            this.txtBarUnitFactor.setState({value:this.cmbBarUnit.data.datatable.where({'TYPE':0})[0].FACTOR});
            let tmpGuid = this.cmbBarUnit.data.datatable.where({'TYPE':0})[0].GUID
            this.cmbBarUnit.value = tmpGuid;
            this.txtUnitTypeName.setState({value:this.t("MainUnit")})
        }
    }
   render()
    {          
        return (
            <ScrollView>
            <div className="row p-2">       
                <div className="row px-2 py-2">                        
                    <div className="col-12">
                        <Form colCount={1} id={"frmBarcode"  + this.tabIndex}>
                            {/* txtItem */}
                            <Item>                                    
                                <Label text={this.t("txtItem")} alignment="right" />
                                <NdTextBox id="txtItem" parent={this} simple={true} dt={{data:this.itemBarcodeObj.dt('ITEM_BARCODE'),field:"ITEM_CODE"}}  validationGroup={"frmBarcode"  + this.tabIndex}
                                readOnly={true}
                                upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
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
                                                        tmpEmpty.ITEM_GUID = data[0].GUID
                                                        tmpEmpty.ITEM_NAME = data[0].NAME
                                                        tmpEmpty.ITEM_CODE = data[0].CODE
                                                        tmpEmpty.UNIT_GUID = ''
                                                        this.itemBarcodeObj.addEmpty(tmpEmpty);  
                                                        this._getUnit(data[0].GUID)
                                                    }
                                                }
                                            }
                                        },
                                    ]
                                }                       
                                >   
                                <Validator validationGroup={"frmBarcode"  + this.tabIndex}>
                                        <RequiredRule message={this.t("validCode")} />
                                </Validator>    
                                </NdTextBox>      
                                {/* STOK SEÇİM POPUP */}
                                <NdPopGrid id={"pg_txtItem"} parent={this} container={"#root"} 
                                visible={false}
                                position={{of:'#root'}} 
                                showTitle={true} 
                                showBorders={true}
                                width={'100%'}
                                height={'100%'}
                                title={this.t("pg_txtItem.title")} 
                                selection={{mode:"single"}}
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
                                upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                dt={{data:this.itemBarcodeObj.dt('ITEM_BARCODE'),field:"ITEM_NAME"}} 
                                />
                            </Item> 
                                {/* txtBarcode */}
                                <Item>                                    
                                <Label text={this.t("txtBarcode")} alignment="right" />
                                <NdTextBox id="txtBarcode" parent={this} simple={true} dt={{data:this.itemBarcodeObj.dt('ITEM_BARCODE'),field:"BARCODE"}}  validationGroup={"frmBarcode"  + this.tabIndex}
                                upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                button=
                                {
                                    [
                                        {
                                            id:'01',
                                            icon:'arrowdown',
                                            onClick:()=>
                                            {
                                                this.txtBarcode.value = Math.floor(Date.now() / 10)
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
                            </Item> 
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
                            {/* cmbBarUnit */}
                            <Item>
                                <Label text={this.t("cmbBarUnit")} alignment="right" />
                                <NdSelectBox simple={true} parent={this} id="cmbBarUnit" 
                                dt={{data:this.itemBarcodeObj.dt('ITEM_BARCODE'),field:"UNIT_GUID"}} 
                                displayExpr="NAME"                       
                                valueExpr="GUID"
                                onValueChanged={(async(e)=>
                                {
                                    if(e.value != '00000000-0000-0000-0000-000000000000' && e.value != '')
                                    {
                                        this.txtBarUnitFactor.setState({value:this.cmbBarUnit.data.datatable.where({'GUID':e.value})[0].FACTOR});
                                        let tmpUnitType = this.cmbBarUnit.data.datatable.where({'GUID':e.value})[0].TYPE
                                        if(tmpUnitType == 0)
                                        {
                                            this.txtUnitTypeName.setState({value:this.t("MainUnit")})
                                        }
                                        else
                                        {
                                            this.txtUnitTypeName.setState({value:this.t("SubUnit")})
                                        }
                                        
                                    }
                                }).bind(this)}
                                />
                            </Item>
                            {/* txtBarUnitFactor */}
                            <Item>
                                <Label text={this.t("txtBarUnitFactor")} alignment="right" />
                                <NdTextBox simple={true} parent={this} id="txtBarUnitFactor" readOnly={true}
                                upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                dt={{data:this.itemBarcodeObj.dt('ITEM_BARCODE'),field:"UNIT_FACTOR"}} 
                                />
                            </Item>
                                {/* txtBarUnitFactor */}
                                <Item>
                                <Label text={this.t("txtUnitTypeName")} alignment="right" />
                                <NdTextBox simple={true} parent={this} id="txtUnitTypeName" readOnly={true}
                                upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                />
                            </Item>
                            <Item>
                                <div className="row">
                                    <NdButton text={this.t("btnBarSave")} type="default" width="100%" validationGroup={"frmBarcode"  + this.tabIndex}
                                onClick={async (e)=>
                                {
                                    if(e.validationGroup.validate().status == "valid")
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
                                            console.log(this.itemBarcodeObj.dt()[0])
                                            if((await this.itemBarcodeObj.save()) == 0)
                                            {                                                    
                                                tmpConfObj1.content = (<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgSaveResult.msgSuccess")}</div>)
                                                await dialog(tmpConfObj1);
                                                this.init()
                                            }
                                            else
                                            {
                                                tmpConfObj1.content = (<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgSaveResult.msgFailed")}</div>)
                                                await dialog(tmpConfObj1);
                                            }
                                        }          
                                    }                              
                                    else
                                    {
                                        let tmpConfObj =
                                        {
                                            id:'msgSaveValid',showTitle:true,title:this.t("msgSaveValid.title"),showCloseButton:true,width:'350px',height:'200px',
                                            button:[{id:"btn01",caption:this.t("msgSaveValid.btn01"),location:'after'}],
                                            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgSaveValid.msg")}</div>)
                                        }
                                        
                                        await dialog(tmpConfObj);
                                    }                               
                                }}/>
                                </div>
                            </Item>
                        </Form>
                    </div>
                </div>                                   
            </div>
            </ScrollView>   
        )    
    }
}