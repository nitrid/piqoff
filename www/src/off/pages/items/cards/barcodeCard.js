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

export default class barcodeCard extends React.PureComponent
{
    constructor(props)
    {
        super(props) 
        this.core = App.instance.core;
        this.prmObj = this.param.filter({TYPE:1,USERS:this.user.CODE});
        this._getUnit = this._getUnit.bind(this)

        this.itemBarcodeObj = new itemBarcodeCls();
        this.tabIndex = props.data.tabkey
    }
    async componentDidMount()
    {
        await this.core.util.waitUntil(0)
        this.init(); 
        document.getElementById("Sound").play();
    }  
    async init()
    {
        this.itemBarcodeObj.clearAll();
        this.cmbBarUnit.value= ''
        this.txtBarUnitFactor.setState({value:'0'})
        this.txtItem.setState({value:''})
        this.txtItemName.setState({value:''})
        this.txtBarcode.setState({value:''})

    }
    async checkBarcode(pCode)
    {
        return new Promise(async resolve => 
        {
            if(pCode !== '')
            {
                let tmpQuery = 
                {
                    query :"SELECT BARCODE,ITEM_GUID,ITEM_NAME,ITEM_CODE FROM ITEM_BARCODE_vw_01 WHERE BARCODE = @CODE",
                    param : ['CODE:string|50'],
                    value : [pCode]
                }
                let tmpData = await this.core.sql.execute(tmpQuery) 

                if(tmpData.result.recordset.length > 0)
                {
                    let tmpConfObj =
                    {
                        id:'msgCheckBarcode',showTitle:true,title:this.t("msgCheckBarcode.title"),showCloseButton:true,width:'500px',height:'200px',
                        button:[{id:"btn01",caption:this.t("msgCheckBarcode.btn01"),location:'after'}],
                        content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgCheckBarcode.msg")}</div>)
                    }
                    
                    await dialog(tmpConfObj);
                    let tmpEmpty = {...this.itemBarcodeObj.empty};
                    tmpEmpty.BARCODE = ""
                    tmpEmpty.ITEM_GUID = tmpData.result.recordset[0].ITEM_GUID
                    tmpEmpty.ITEM_NAME = tmpData.result.recordset[0].ITEM_NAME
                    tmpEmpty.ITEM_CODE = tmpData.result.recordset[0].ITEM_CODE
                    tmpEmpty.UNIT_GUID = ''
                    this.itemBarcodeObj.addEmpty(tmpEmpty);  
                    this._getUnit( tmpData.result.recordset[0].ITEM_GUID)
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
        
        await this.core.util.waitUntil(0)
        await this.itemBarcodeObj.load({BARCODE:pCode});
        console.log(this.itemBarcodeObj.dt())
        this._getUnit(this.itemBarcodeObj.dt()[0].ITEM_GUID)
    }
    async _getUnit(pGuid)
    {
        let tmpQuery = 
        {
            query : "SELECT GUID,NAME,FACTOR,TYPE FROM ITEM_UNIT_VW_01 WHERE ITEM_GUID = @ITEM_GUID",
            param : ['ITEM_GUID:string|50'],
            value : [pGuid]
        }
        let tmpData = await this.core.sql.execute(tmpQuery) 
        if(tmpData.result.recordset.length > 0)
        {
            await this.cmbBarUnit.dataRefresh({source:tmpData.result.recordset})
        }
        if(this.cmbBarUnit.data.datatable.length > 0)
        {
            this.txtBarUnitFactor.setState({value:this.cmbBarUnit.data.datatable.where({'TYPE':0})[0].FACTOR});
            let tmpGuid = this.cmbBarUnit.data.datatable.where({'TYPE':0})[0].GUID
            this.cmbBarUnit.value = tmpGuid;
            this.txtUnitTypeName.setState({value:this.t("MainUnit")})
        }
        await this.cmbBarUnit.data.datatable.refresh()

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
                                    <NdButton id="btnNew" parent={this} icon="file" type="default"
                                    onClick={()=>
                                    {
                                        this.init(); 
                                    }}/>
                                </Item>
                                <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnSave" parent={this} icon="floppy" type="default" validationGroup={"frmBarcode"  + this.tabIndex}
                                    onClick={async (e)=>
                                    {
                                        if(e.validationGroup.validate().status == "valid")
                                        {
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
                                                console.log(this.itemBarcodeObj.dt()[0])
                                                if((await this.itemBarcodeObj.save()) == 0)
                                                {                                                    
                                                    tmpConfObj1.content = (<div style={{textAlign:"center",fontSize:"20px",color:"green"}}>{this.t("msgSaveResult.msgSuccess")}</div>)
                                                    await dialog(tmpConfObj1);
                                                    this.init()
                                                }
                                                else
                                                {
                                                    tmpConfObj1.content = (<div style={{textAlign:"center",fontSize:"20px",color:"red"}}>{this.t("msgSaveResult.msgFailed")}</div>)
                                                    await dialog(tmpConfObj1);
                                                }
                                            }          
                                        }                              
                                        else
                                        {
                                            let tmpConfObj =
                                            {
                                                id:'msgSaveValid',showTitle:true,title:this.t("msgSaveValid.title"),showCloseButton:true,width:'500px',height:'200px',
                                                button:[{id:"btn01",caption:this.t("msgSaveValid.btn01"),location:'after'}],
                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgSaveValid.msg")}</div>)
                                            }
                                            
                                            await dialog(tmpConfObj);
                                        }                               
                                    }}/>
                                </Item>
                                <Item location="after"
                                locateInMenu="auto"
                                widget="dxButton"
                                options=
                                {
                                    {
                                        type: 'default',
                                        icon: 'clear',
                                        onClick: async () => 
                                        {
                                            let tmpConfObj =
                                            {
                                                id:'msgClose',showTitle:true,title:this.lang.t("msgWarning"),showCloseButton:true,width:'500px',height:'200px',
                                                button:[{id:"btn01",caption:this.lang.t("btnYes"),location:'before'},{id:"btn02",caption:this.lang.t("btnNo"),location:'after'}],
                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgClose")}</div>)
                                            }
                                            
                                            let pResult = await dialog(tmpConfObj);
                                            if(pResult == 'btn01')
                                            {
                                                App.instance.panel.closePage()
                                            }
                                        }
                                    }    
                                } />
                            </Toolbar>
                        </div>
                    </div>
                    <div className="row px-2 pt-2">                        
                        <div className="col-9">
                            <Form colCount={2} id={"frmBarcode"  + this.tabIndex}>
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
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    dt={{data:this.itemBarcodeObj.dt('ITEM_BARCODE'),field:"ITEM_NAME"}} 
                                   />
                                </Item>
                                
                                 {/* txtBarcode */}
                                 <Item>                                    
                                    <Label text={this.t("txtBarcode")} alignment="right" />
                                    <NdTextBox id="txtBarcode" parent={this} simple={true} dt={{data:this.itemBarcodeObj.dt('ITEM_BARCODE'),field:"BARCODE"}}  placeholder={this.t("barcodePlace")} validationGroup={"frmBarcode"  + this.tabIndex}
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
                                     <Validator validationGroup={"frmBarcode"  + this.tabIndex}>
                                            <RequiredRule message={this.t("validCode")} />
                                    </Validator>   
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
                                <EmptyItem/>
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
                                <EmptyItem/>
                                {/* cmbBarUnit */}
                                <Item>
                                    <Label text={this.t("cmbBarUnit")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbBarUnit"  searchEnabled={true}
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
                            </Form>
                        </div>
                    </div>                                   
                </ScrollView>
            </div>
        )        
    }
}