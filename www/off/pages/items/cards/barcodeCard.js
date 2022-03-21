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
import NdGrid,{Column,Editing,Paging,Scrolling} from '../../../../core/react/devex/grid.js';
import NdButton from '../../../../core/react/devex/button.js';
import NdDatePicker from '../../../../core/react/devex/datepicker.js';
import NdImageUpload from '../../../../core/react/devex/imageupload.js';
import { dialog } from '../../../../core/react/devex/dialog.js';

export default class barcodeCard extends React.Component
{
    constructor(props)
    {
        this.state = {underPrice : 0,isItemGrpForOrginsValid : false,isItemGrpForMinMaxAccess : false}
        this.core = App.instance.core;
        this.prmObj = this.param.filter({TYPE:1,USERS:this.user.CODE});
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
             
        await this.grdBarcode.dataRefresh({source:this.itemBarcodeObj.dt('ITEM_BARCODE')});
    }
    async getItem(pCode)
    {
        this.itemBarcodeObj.clearAll();
        await this.itemBarcodeObj.load({CODE:pCode});
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
                                            
                                            if((await this.itemsObj.save()) == 0)
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
                                            this.itemsObj.dt('ITEMS').removeAt(0)
                                            await this.itemsObj.dt('ITEMS').delete();
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
                                {/* txtRef */}
                                <Item>                                    
                                    <Label text={this.t("txtRef")} alignment="right" />
                                    <NdTextBox id="txtRef" parent={this} simple={true} dt={{data:this.itemsObj.dt('ITEMS'),field:"CODE"}} 
                                    button=
                                    {
                                        [
                                            {
                                                id:'01',
                                                icon:'more',
                                                onClick:()=>
                                                {
                                                    this.pg_txtRef.show()
                                                    this.pg_txtRef.onClick = (data) =>
                                                    {
                                                        if(data.length > 0)
                                                        {
                                                            this.getItem(data[0].CODE)
                                                        }
                                                    }
                                                }
                                            },
                                            {
                                                id:'02',
                                                icon:'arrowdown',
                                                onClick:()=>
                                                {
                                                    this.txtRef.value = Math.floor(Date.now() / 1000)
                                                }
                                            }
                                        ]
                                    }
                                    onChange={(async()=>
                                    {
                                        let tmpResult = await this.checkItem(this.txtRef.value)
                                        if(tmpResult == 3)
                                        {
                                            this.txtRef.value = "";
                                        }
                                    }).bind(this)} 
                                    param={this.param.filter({ELEMENT:'txtRef',USERS:this.user.CODE})} 
                                    access={this.access.filter({ELEMENT:'txtRef',USERS:this.user.CODE})}                                
                                    >     
                                    </NdTextBox>      
                                    {/* STOK SEÇİM POPUP */}
                                    <NdPopGrid id={"pg_txtRef"} parent={this} container={"#root"} 
                                    visible={false}
                                    position={{of:'#root'}} 
                                    showTitle={true} 
                                    showBorders={true}
                                    width={'90%'}
                                    height={'90%'}
                                    title={this.t("pg_txtRef.title")} 
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
                                        <Column dataField="CODE" caption={this.t("pg_txtRef.clmCode")} width={150} />
                                        <Column dataField="NAME" caption={this.t("pg_txtRef.clmName")} width={650} defaultSortOrder="asc" />
                                    </NdPopGrid>
                                </Item>                           
                                {/* txtItemName */}
                                <Item>
                                    <Label text={this.t("txtItemName")} alignment="right" />
                                    <NdTextBox id="txtItemName" parent={this} simple={true} dt={{data:this.itemsObj.dt('ITEMS'),field:"NAME"}}
                                    param={this.param.filter({ELEMENT:'txtItemName',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'txtItemName',USERS:this.user.CODE})}
                                    onValueChanged={(e)=>
                                        {
                                            if(e.value.length <= 32)
                                                this.txtShortName.value = e.value
                                        }
                                    }/>
                                </Item>
                                <Item></Item>
                            </Form>
                        </div>
                    </div>        
                       {/* Grid */}
                       <div className="row px-2 pt-2">
                        <div className="col-12">
                            <Form colCount={1} onInitialized={(e)=>
                            {
                                this.frmContract = e.component
                            }}>
                                <Item location="after">
                                    <Button icon="add"
                                    validationGroup="frmContract"
                                    onClick={async (e)=>
                                    {
                                        if(e.validationGroup.validate().status == "valid")
                                        {
                                            this.popItems.show()
                                        }
                                        else
                                        {
                                            let tmpConfObj =
                                            {
                                                id:'msgContractValid',showTitle:true,title:this.t("msgContractValid.title"),showCloseButton:true,width:'500px',height:'200px',
                                                button:[{id:"btn01",caption:this.t("msgContractValid.btn01"),location:'after'}],
                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgContractValid.msg")}</div>)
                                            }
                                            
                                            await dialog(tmpConfObj);
                                        }
                                    }}/>
                                </Item>
                                 <Item>
                                    <NdGrid parent={this} id={"grdBarcode"} 
                                    showBorders={true} 
                                    columnsAutoWidth={true} 
                                    allowColumnReordering={true} 
                                    allowColumnResizing={true} 
                                    filterRow={{visible:true}}
                                    height={'100%'} 
                                    width={'100%'}
                                    dbApply={false}
                                    onRowUpdated={async(e)=>
                                    {
                                       
                                    }}
                                    onRowRemoved={async (e)=>{
                                        await this.itemBarcodeObj.save()
                                    }}
                                    >
                                        <KeyboardNavigation editOnKeyPress={true} enterKeyAction={'moveFocus'} enterKeyDirection={'row'} />
                                        <Editing mode="cell" allowUpdating={true} allowDeleting={true} />
                                        <Paging defaultPageSize={10} />
                                        <Pager
                                        visible={true} />
                                        <Column dataField="CDATE_FORMAT" caption={this.t("grdBarcode.clmCreateDate")} width={200}/>
                                        <Column dataField="ITEM_CODE" caption={this.t("grdBarcode.clmItemCode")} width={150} />
                                        <Column dataField="ITEM_NAME" caption={this.t("grdBarcode.clmItemName")} width={350} />
                                        <Column dataField="PRICE" caption={this.t("grdBarcode.clmPrice")} dataType={'number'} format={{ style: "currency", currency: "EUR",precision: 2}}/>
                                        <Column dataField="QUANTITY" caption={this.t("grdBarcode.clmQuantity")} dataType={'number'}/>
                                        <Column dataField="DEPOT_NAME" caption={this.t("grdBarcode.clmDepotName")} />
                                    </NdGrid>
                                </Item>
                            </Form>
                        </div>
                    </div>
                    {/* BARKOD POPUP */}
                    <div>
                        <NdPopUp parent={this} id={"popBarcode"} 
                        visible={false}
                        showCloseButton={true}
                        showTitle={true}
                        title={this.t("popBarcode.title")}
                        container={"#root"} 
                        width={'500'}
                        height={'275'}
                        position={{of:'#root'}}
                        >
                            <Form colCount={1} height={'fit-content'}>
                                <Item>
                                    <Label text={this.t("popBarcode.txtPopBarcode")} alignment="right" />
                                    <NdTextBox id={"txtPopBarcode"} parent={this} simple={true} 
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
                                    }}/>
                                </Item>
                                <Item>
                                    <Label text={this.t("popBarcode.cmbPopBarUnit")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbPopBarUnit"
                                    displayExpr="NAME"                       
                                    valueExpr="GUID"
                                    />
                                </Item>
                                <Item>
                                    <Label text={this.t("popBarcode.cmbPopBarType")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbPopBarType"
                                    displayExpr="VALUE"                       
                                    valueExpr="ID"
                                    value="0"
                                    data={{source:[{ID:"0",VALUE:"EAN8"},{ID:"1",VALUE:"EAN13"},{ID:"2",VALUE:"CODE39"}]}}
                                    />
                                </Item>
                                <Item>
                                    <div className='row'>
                                        <div className='col-6'>
                                            <NdButton text={this.lang.t("btnSave")} type="normal" stylingMode="contained" width={'100%'} 
                                            onClick={async ()=>
                                            {
                                                let tmpEmpty = {...this.itemsObj.itemBarcode.empty};
                                                let tmpEmptyStat = true
                                                
                                                if(typeof this.itemsObj.itemBarcode.dt().find(x => x.BARCODE == '') != 'undefined')
                                                {
                                                    tmpEmptyStat = false;
                                                    tmpEmpty = this.itemsObj.itemBarcode.dt().find(x => x.BARCODE == '')
                                                }
                                                
                                                tmpEmpty.BARCODE = this.txtPopBarcode.value
                                                tmpEmpty.TYPE = this.cmbPopBarType.value
                                                tmpEmpty.UNIT_GUID = this.cmbPopBarUnit.value
                                                tmpEmpty.UNIT_NAME = this.cmbPopBarUnit.displayValue
                                                tmpEmpty.ITEM_GUID = this.itemsObj.dt()[0].GUID 

                                                let tmpResult = await this.checkBarcode(this.txtPopBarcode.value)
                                                if(tmpResult == 2) //KAYIT VAR
                                                {
                                                    this.popBarcode.hide(); 
                                                }
                                                else if(tmpResult == 1) //KAYIT YOK
                                                {
                                                    if(tmpEmptyStat)
                                                    {
                                                        this.itemsObj.itemBarcode.addEmpty(tmpEmpty);    
                                                    }
                                                    this.popBarcode.hide(); 
                                                }
                                            }}/>
                                        </div>
                                        <div className='col-6'>
                                            <NdButton text={this.lang.t("btnCancel")} type="normal" stylingMode="contained" width={'100%'}
                                            onClick={()=>
                                            {
                                                this.popBarcode.hide();  
                                            }}/>
                                        </div>
                                    </div>
                                </Item>
                            </Form>
                        </NdPopUp>
                    </div>                                
                </ScrollView>
            </div>
        )
        
    }
}