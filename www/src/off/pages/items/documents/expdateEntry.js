import React from 'react';
import App from '../../../lib/app.js';
import {itemExpDateCls} from '../../../../core/cls/items.js'
import moment from 'moment';

import ScrollView from 'devextreme-react/scroll-view';
import Toolbar from 'devextreme-react/toolbar';
import Form, { Label,Item } from 'devextreme-react/form';
import DropDownButton from 'devextreme-react/drop-down-button';
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
import NdDialog, { dialog } from '../../../../core/react/devex/dialog.js';
import { datatable } from '../../../../core/core.js';

export default class labelPrinting extends React.Component
{
    constructor()
    {
        super()
        
        this.core = App.instance.core;
        this.prmObj = this.param.filter({TYPE:1,USERS:this.user.CODE});
        this.acsobj = this.access.filter({TYPE:1,USERS:this.user.CODE});

        this.expObj = new itemExpDateCls();
    }
    async componentDidMount()
    {
        await this.core.util.waitUntil(0)
        this.init()
    }
    async init()
    {
        this.expObj.clearAll()
        this.expObj.ds.on('onAddRow',(pTblName,pData) =>
        {
            if(pData.stat == 'new')
            {
                this.btnNew.setState({disabled:false});
                this.btnSave.setState({disabled:false});
                this.btnPrint.setState({disabled:false});
                this.btnDelete.setState({disabled:false});
            }
        })
        this.expObj.ds.on('onEdit',(pTblName,pData) =>
        {            
            if(pData.rowData.stat == 'edit')
            {
                this.btnNew.setState({disabled:true});
                this.btnSave.setState({disabled:false});
                this.btnPrint.setState({disabled:false});
                this.btnDelete.setState({disabled:false});

                pData.rowData.CUSER = this.user.CODE
            }                 
        })
        this.expObj.ds.on('onRefresh',(pTblName) =>
        {           
            this.btnNew.setState({disabled:false});
            this.btnSave.setState({disabled:true});
            this.btnPrint.setState({disabled:false});       
            this.btnDelete.setState({disabled:false});   
        })
        this.expObj.ds.on('onDelete',(pTblName) =>
        {
            this.btnNew.setState({disabled:false});
            this.btnSave.setState({disabled:false});
            this.btnPrint.setState({disabled:false});
            this.btnDelete.setState({disabled:true});
        })

        this.btnSave.setState({disabled:true});
        this.btnNew.setState({disabled:false});

        this.txtPopQuantity.value = 1;
        this.dtPopDate.value = moment(new Date()).format("YYYY-MM-DD")
        await this.grdExpDate.dataRefresh({source:this.expObj.dt('ITEM_EXPDATE')});
    }
    async addItem(pData,pIndex,pQuantity)
    {
        if(pData.CODE  == '')
        {
            return
        }
        if(pQuantity == 0)
        {
            let tmpConfObj = 
            {
                id:'msgZeroQuantity',showTitle:true,title:this.t("msgZeroQuantity.title"),showCloseButton:true,width:'350px',height:'200px',
                button:[{id:"btn01",caption:this.t("msgZeroQuantity.btn01"),location:'after'}],
                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgZeroQuantity.msg")}</div>)
            }
            await dialog(tmpConfObj);
            this.txtPopQuantity.focus()
            return
        }
        for (let i = 0; i < this.expObj.dt().length; i++) 
        {
            if(this.expObj.dt()[i].ITEM_CODE == pData.CODE)
            {
                let tmpConfObj = 
                {
                    id:'msgCombineItem',showTitle:true,title:this.t("msgCombineItem.title"),showCloseButton:true,width:'350px',height:'200px',
                    button:[{id:"btn01",caption:this.t("msgCombineItem.btn01"),location:'before'},{id:"btn02",caption:this.t("msgCombineItem.btn02"),location:'after'}],
                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgCombineItem.msg")}</div>)
                }
                let pResult = await dialog(tmpConfObj);
                if(pResult == 'btn01')
                {
                    await this.grdExpDate.devGrid.deleteRow(0)
                    return
                }
                else
                {
                    break
                }
                
            }
        }
        this.expObj.dt()[pIndex].ITEM_GUID = pData.GUID 
        this.expObj.dt()[pIndex].ITEM_CODE = pData.CODE 
        this.expObj.dt()[pIndex].ITEM_NAME = pData.NAME 
        this.expObj.dt()[pIndex].QUANTITY = pQuantity
        this.expObj.dt()[pIndex].EXP_DATE = this.dtPopDate.value
    }
    render()
    {
        return(
        <ScrollView>
            {/* Toolbar */}
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
                            <NdButton id="btnSave" parent={this} icon="floppy" type="default" 
                            onClick={async(e)=>
                            {
                                if(this.expObj.dt()[this.expObj.dt().length - 1].CODE == '')
                                {
                                    await this.grdExpDate.devGrid.deleteRow(this.expObj.dt().length - 1)
                                }

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
                                    
                                    if((await this.expObj.save()) == 0)
                                    {                       
                                        tmpConfObj1.content = (<div style={{textAlign:"center",fontSize:"20px",color:"green"}}>{this.t("msgSaveResult.msgSuccess")}</div>)
                                        await dialog(tmpConfObj1);
                                        this.btnSave.setState({disabled:true});
                                        this.btnNew.setState({disabled:false});
                                    }
                                    else
                                    {
                                        tmpConfObj1.content = (<div style={{textAlign:"center",fontSize:"20px",color:"red"}}>{this.t("msgSaveResult.msgFailed")}</div>)
                                        await dialog(tmpConfObj1);
                                    }
                                }
                            }}/>
                        </Item>
                        <Item location="after" locateInMenu="auto">
                            <NdButton id="btnPrint" parent={this} icon="print" type="default"
                            onClick={()=>
                            {
                                this.popDesign.show()
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
                                    this.expObj.dt('ITEM_EXPDATE').removeAt(0)
                                    await this.expObj.dt('ITEM_EXPDATE').delete();
                                    this.init(); 
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
            {/* Form */}
            <div className="row px-2 pt-2">
            <Form colCount={2}>
                <Item>
                    <Label text={this.t("txtBarcode")} alignment="right" />
                    <NdTextBox id="txtBarcode" simple={true} parent={this} placeholder={this.t("txtBarcodePlace")}
                    onEnterKey={(async(e)=>
                        {
                            if(e.component._changedValue == "")
                            {
                                return
                            }
                            let tmpQuery = 
                            {
                                query : "SELECT ITEM_CODE AS CODE,ITEM_NAME AS NAME,ITEM_GUID AS GUID,BARCODE FROM ITEM_BARCODE_VW_01  WHERE BARCODE = @BARCODE OR ITEM_CODE = @BARCODE ",
                                param : ['BARCODE:string|50'],
                                value : [e.component._changedValue]
                            }
                            let tmpData = await this.core.sql.execute(tmpQuery) 
                            if(tmpData.result.recordset.length > 0)
                            {
                                this.PopGrdItemData = tmpData.result.recordset;
                                this.txtPopItemsCode.GUID = tmpData.result.recordset[0].GUID 
                                this.txtPopItemsCode.value = tmpData.result.recordset[0].CODE 
                                this.txtPopItemsName.value = tmpData.result.recordset[0].NAME
                                this.popItems.show()
                                await this.core.util.waitUntil(500)
                                this.txtPopQuantity.focus()
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
                            }
                        }).bind(this)}>
                    </NdTextBox>
                </Item>
            </Form>
            <Form colCount={1}>
                <Item location="after">
                        <Button icon="add"
                        onClick={async (e)=>
                        {
                            await this.core.util.waitUntil(100)
                            this.popItems.show()
                        }}/>
                </Item>
                <Item>
                    <NdGrid parent={this} id={"grdExpDate"} 
                    showBorders={true} 
                    columnsAutoWidth={true} 
                    allowColumnReordering={true} 
                    allowColumnResizing={true} 
                    height={'400'} 
                    width={'100%'}
                    dbApply={false}
                    onRowUpdated={async(e)=>{
                        
                    }}
                    onRowRemoved={async (e)=>{
                        
                    }}
                    >
                        <Scrolling mode="standart" />
                        <Editing mode="cell" allowUpdating={true} allowDeleting={true} confirmDelete={false}/>
                        <Column dataField="ITEM_NAME" caption={this.t("grdExpDate.clmName")} width={250} />
                        <Column dataField="ITEM_CODE" caption={this.t("grdExpDate.clmCode")} width={150}/>
                        <Column dataField="QUANTITY" caption={this.t("grdExpDate.clmQuantity")} width={150}/>
                        <Column dataField="EXP_DATE" caption={this.t("grdExpDate.clmDate")} width={250} dataType="date"
                        editorOptions={{value:null}}
                        cellRender={(e) => 
                        {
                            if(moment(e.value).format("YYYY-MM-DD") != '1970-01-01')
                            {
                                return e.text
                            }
                            
                            return
                        }}/>
                    </NdGrid>
                </Item>
            </Form>
            {/* Stok Popup*/}
            <div>
                <NdPopUp parent={this} id={"popItems"} 
                visible={false}
                showCloseButton={true}
                showTitle={true}
                title={this.t("popItems.title")}
                container={"#root"} 
                width={'500'}
                height={'450'}
                position={{of:'#root'}}
                >
                    <Form colCount={1} height={'fit-content'}>
                        <Item>
                            <Label text={this.t("popItems.txtPopItemsCode")} alignment="right" />
                            <NdTextBox id={"txtPopItemsCode"} parent={this} simple={true}
                            upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                            onEnterKey={(async()=>
                                {
                                    await this.popItemsCode.setVal(this.txtPopItemsCode.value)
                                    this.popItemsCode.show()
                                    this.popItemsCode.onClick = (data) =>
                                    {
                                        console.log(data)
                                        if(data.length > 0)
                                        {
                                            this.PopGrdItemData = data;
                                            this.txtPopQuantity.focus()
                                         
                                            this.txtPopItemsCode.GUID = data[0].GUID
                                            this.txtPopItemsCode.value = data[0].CODE;
                                            this.txtPopItemsName.value = data[0].NAME;
                                        }
                                    }
                                }).bind(this)}
                            button=
                            {
                                [
                                    {
                                        id:'01',
                                        icon:'more',
                                        onClick:()=>
                                        {                  
                                                                        
                                            this.popItemsCode.show()
                                            this.popItemsCode.onClick = (data) =>
                                            {
                                                if(data.length > 0)
                                                {
                                                    this.PopGrdItemData = data;
                                                    this.txtPopQuantity.focus()

                                                    this.txtPopItemsCode.GUID = data[0].GUID
                                                    this.txtPopItemsCode.value = data[0].CODE;
                                                    this.txtPopItemsName.value = data[0].NAME;
                                                }
                                            }
                                        }
                                    },
                                ]
                            }>       
                            <Validator validationGroup={"frmPurcContItems"  + this.tabIndex}>
                                    <RequiredRule message={this.t("validItemsCode")} />
                            </Validator>                                 
                            </NdTextBox>
                        </Item>
                        <Item>
                            <Label text={this.t("popItems.txtPopItemsName")} alignment="right" />
                            <NdTextBox id={"txtPopItemsName"} parent={this} simple={true} editable={true}
                            upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}/>
                        </Item>
                        <Item>
                            <Label text={this.t("popItems.txtPopItemsQuantity")} alignment="right" />
                            <NdTextBox id="txtPopQuantity" parent={this} simple={true}>
                            </NdTextBox>
                        </Item>
                        <Item>
                            <Label text={this.t("popItems.dtPopDate")} alignment="right" />
                            <NdDatePicker simple={true}  parent={this} id={"dtPopDate"}/>
                        </Item>
                        <Item>
                            <div className='row'>
                                <div className='col-6'>
                                    <NdButton text={this.lang.t("btnSave")} type="normal" stylingMode="contained" width={'100%'} validationGroup={"frmPurcContItems"  + this.tabIndex}
                                    onClick={async (e)=>
                                    {       
                                        if(e.validationGroup.validate().status == "valid")
                                        {
                                            this.txtPopItemsCode.value = ''
                                            this.txtPopItemsName.value = ''
                                            if(typeof this.expObj.dt()[0] != 'undefined')
                                            {
                                                if(this.expObj.dt()[this.expObj.dt().length - 1].CODE == '')
                                                {
                                                    this.pg_txtItemsCode.show()
                                                    this.pg_txtItemsCode.onClick = async(data) =>
                                                    {
                                                        if(data.length == 1)
                                                        {
                                                            this.addItem(data[0],this.expObj.dt().length - 1,this.txtPopQuantity.value)
                                                        }
                                                    }
                                                    return
                                                }
                                            }
                                            console.log(this.PopGrdItemData[0].CODE)
                                            let tmpExpItems = {...this.expObj.empty}
                                            this.expObj.addEmpty(tmpExpItems)
                                            await this.addItem(this.PopGrdItemData[0],this.expObj.dt().length - 1,this.txtPopQuantity.value)
                                            this.PopGrdItemData = [];
                                            this.popItems.hide();
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
                                </div>
                                <div className='col-6'>
                                    <NdButton text={this.lang.t("btnCancel")} type="normal" stylingMode="contained" width={'100%'}
                                    onClick={()=>
                                    {
                                        this.popItems.hide();  
                                    }}/>
                                </div>
                            </div>
                        </Item>
                    </Form>
                </NdPopUp>
            </div>
            {/* Stok Seçim */}
            <NdPopGrid id={"popItemsCode"} parent={this} container={"#root"}
                    visible={false}
                    position={{of:'#root'}} 
                    showTitle={true} 
                    showBoffers={true}
                    width={'90%'}
                    height={'90%'}
                    title={this.t("popItemsCode.title")} //
                    search={true}
                    data = 
                    {{
                        source:
                        {
                            select:
                            {
                                query : "SELECT GUID,CODE,NAME,VAT,COST_PRICE FROM ITEMS_VW_01 WHERE STATUS = 1 AND UPPER(CODE) LIKE UPPER(@VAL) OR UPPER(NAME) LIKE UPPER(@VAL)",
                                param : ['VAL:string|50']
                            },
                            sql:this.core.sql
                        }
                    }}
                    >
                        <Column dataField="CODE" caption={this.t("popItemsCode.clmCode")} width={150} />
                        <Column dataField="NAME" caption={this.t("popItemsCode.clmName")} width={300} defaultSortoffer="asc" />
            </NdPopGrid>
            </div>
        </ScrollView>
        )
    }
}