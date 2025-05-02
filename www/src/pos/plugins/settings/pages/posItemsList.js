import React from "react";
import App from "../../../lib/app.js";
import moment from "moment";

import { dataset,datatable } from "../../../../core/core.js";
import {itemsCls,unitCls,mainGroupCls} from "../../../../core/cls/items.js";

import Form, { Label,Item, EmptyItem } from 'devextreme-react/form';
import Toolbar from 'devextreme-react/toolbar';

import NbButton from "../../../../core/react/bootstrap/button.js";
import NbKeyboard from "../../../../core/react/bootstrap/keyboard.js";
import NdTextBox,{ Validator,RequiredRule } from "../../../../core/react/devex/textbox.js";
import NdGrid,{Column,Editing,Paging,Scrolling} from "../../../../core/react/devex/grid.js";
import NdPopUp from "../../../../core/react/devex/popup.js";
import NdSelectBox from "../../../../core/react/devex/selectbox.js";
import NdNumberBox from "../../../../core/react/devex/numberbox.js";
import NdCheckBox from "../../../../core/react/devex/checkbox.js";
import NdTabPanel from '../../../../core/react/devex/tabpanel.js';
import NdDatePicker from "../../../../core/react/devex/datepicker.js";
import NdButton from "../../../../core/react/devex/button.js";
import NdDialog,{ dialog } from "../../../../core/react/devex/dialog.js";

export default class posItemsList extends React.PureComponent
{
    constructor()
    {
        super()
        
        this.core = App.instance.core;
        this.lang = App.instance.lang;
        this.user = this.core.auth.data
        this.prmObj = App.instance.prmObj
        this.itemsObj = new itemsCls();
        this.itemListDt = new datatable()

        Number.money = this.prmObj.filter({ID:'MoneySymbol',TYPE:0}).getValue()

        this.onItemRendered = this.onItemRendered.bind(this)
        this.onSave = this.onSave.bind(this)
        this.onDelete = this.onDelete.bind(this)
    }
    async init()
    {
        this.itemsObj.clearAll();
        this.itemsObj.addEmpty();
        
        this.popTxtRef.value = Math.floor(Date.now() / 1000)

        let tmpUnit = new unitCls();
        await tmpUnit.load()

        if(typeof this.itemsObj.dt()[0] != 'undefined')
        {
            let tmpMainUnitObj = {...this.itemsObj.itemUnit.empty}
            tmpMainUnitObj.TYPE = 0
            tmpMainUnitObj.TYPE_NAME = this.lang.t("posItemsList.popItemEdit.cmbMainUnit")   
            tmpMainUnitObj.ITEM_GUID = this.itemsObj.dt()[0].GUID 

            if(tmpUnit.dt(0).length > 0)
            {
                tmpMainUnitObj.ID = tmpUnit.dt(0)[0].ID
            }
            
            let tmpUnderUnitObj = {...this.itemsObj.itemUnit.empty}
            tmpUnderUnitObj.TYPE = 1
            tmpUnderUnitObj.TYPE_NAME = this.lang.t("posItemsList.popItemEdit.cmbUnderUnit")   
            tmpUnderUnitObj.ID  = '002'
            tmpUnderUnitObj.ITEM_GUID = this.itemsObj.dt()[0].GUID    
            tmpUnderUnitObj.FACTOR = 0.100

            this.itemsObj.itemUnit.addEmpty(tmpMainUnitObj);
            this.itemsObj.itemUnit.addEmpty(tmpUnderUnitObj);
        }

        let tmpMainGrpDt = new datatable();
        tmpMainGrpDt.selectCmd = 
        {
            query : `SELECT '' AS CODE,'' AS NAME, '00000000-0000-0000-0000-000000000000' AS GUID
                    UNION ALL SELECT CODE,NAME,GUID FROM ITEM_GROUP WHERE STATUS = 1 ORDER BY NAME ASC`
        }

        await tmpMainGrpDt.refresh();
        await this.popCmbItemGrp.dataRefresh({source:tmpMainGrpDt});

        await this.grdPrice.dataRefresh({source:this.itemsObj.itemPrice.dt('ITEM_PRICE')});
    }
    async componentDidMount()
    {
        await this.grdItemList.dataRefresh({source:this.itemListDt});
    }
    async getItems()
    {
        this.itemListDt.clear()
        console.log(this.cmbMainGrply.value)

        let query = "SELECT * FROM ITEMS_VW_01 WHERE 1=1";
        let param = [];
        let value = [];
        
        // URUN ARAMASI VAR MI KONTROLÜ
        if(this.txtItemSearch.value && this.txtItemSearch.value !== '')
        {
            query += " AND (CODE LIKE @VAL +'%' OR NAME LIKE @VAL +'%' OR @VAL = '')";
            param.push('VAL:string|25');
            value.push(this.txtItemSearch.value.replaceAll("*", "%"));
        }
        
        //ANA GRUP VAR MI KONTROLÜ
        if(this.cmbMainGrply.value && this.cmbMainGrply.value !== '')
        {
            query += " AND MAIN_GUID = @MAIN_GUID";
            param.push('MAIN_GUID:string|36');
            value.push(this.cmbMainGrply.value);
        }
        
        this.itemListDt.selectCmd = {
            query: query,
            param: param,
            value: value
        }
        
        await this.itemListDt.refresh()
    }
    async getGrpList()
    {
        let tmpGrpListDt = new datatable();
        tmpGrpListDt.selectCmd = 
        {
            query : "SELECT CODE,NAME FROM ITEM_GROUP WHERE STATUS = 1 ORDER BY NAME ASC"
        }

        await tmpGrpListDt.refresh();
        await this.grdGrpList.dataRefresh({source:tmpGrpListDt});
    }
    async onItemRendered(e)
    {
        if(e.itemData.title == this.lang.t("posItemsList.popItemEdit.tabTitlePrice") && typeof this.grdPrice != 'undefined')
        {
            await this.grdPrice.dataRefresh({source:this.itemsObj.itemPrice.dt('ITEM_PRICE')});
        }
        else if(e.itemData.title == this.lang.t("posItemsList.popItemEdit.tabTitleUnit") && typeof this.grdUnit != 'undefined')
        {
            await this.grdUnit.dataRefresh({source:this.itemsObj.itemUnit.dt('ITEM_UNIT')});
        }
        else if(e.itemData.title == this.lang.t("posItemsList.popItemEdit.tabTitleBarcode") && typeof this.grdBarcode != 'undefined')
        {
            await this.grdBarcode.dataRefresh({source:this.itemsObj.itemBarcode.dt('ITEM_BARCODE')});
        }
    }
    async onSave()
    {
        let tmpMsgType = ""

        if(this.itemsObj.dt()[0].CODE == "")
        {
            tmpMsgType = "msg1"
        }
        if(this.itemsObj.dt()[0].NAME == "")
        {
            tmpMsgType = "msg2"
        }

        if(tmpMsgType != "")
        {
            let tmpConfObj =
            {
                id:"msgItemValidation",showTitle:true,title:this.lang.t("posItemsList.popItemEdit.msgItemValidation.title"),showCloseButton:true,width:'500px',height:'200px',
                button:[{id:"btn01",caption:this.lang.t("posItemsList.popItemEdit.msgItemValidation.btn01"),location:'after'}],
                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("posItemsList.popItemEdit.msgItemValidation." + tmpMsgType)}</div>)
            }
            await dialog(tmpConfObj);
            return;
        }
        
        //FIYAT GİRMEDEN KAYIT EDİLEMEZ KONTROLÜ
        let tmpData = this.prmObj.filter({ID:'ItemGrpForNotPriceSave'}).getValue()
        if(typeof tmpData == 'undefined' || !Array.isArray(tmpData) || typeof tmpData.find(x => x == this.cmbItemGrp.value) == 'undefined')
        {
            if(this.itemsObj.dt('ITEM_PRICE').length == 0)
            {
                let tmpConfObj =
                {
                    id:'msgPriceSave',showTitle:true,title:this.lang.t("posItemsList.popItemEdit.msgPriceSave.title"),showCloseButton:true,width:'500px',height:'200px',
                    button:[{id:"btn01",caption:this.lang.t("posItemsList.popItemEdit.msgPriceSave.btn01"),location:'after'}],
                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("posItemsList.popItemEdit.msgPriceSave.msg")}</div>)
                }
                await dialog(tmpConfObj);
                return;
            }
        }
        //************************************ */
        let tmpConfObj =
        {
            id:'msgSave',showTitle:true,title:this.lang.t("posItemsList.popItemEdit.msgSave.title"),showCloseButton:true,width:'500px',height:'200px',
            button:[{id:"btn01",caption:this.lang.t("posItemsList.popItemEdit.msgSave.btn01"),location:'before'},{id:"btn02",caption:this.lang.t("posItemsList.popItemEdit.msgSave.btn02"),location:'after'}],
            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("posItemsList.popItemEdit.msgSave.msg")}</div>)
        }

        let pResult = await dialog(tmpConfObj);

        if(pResult == 'btn01')
        {
            let tmpConfObj1 =
            {
                id:'msgSaveResult',showTitle:true,title:this.lang.t("posItemsList.popItemEdit.msgSaveResult.title"),showCloseButton:true,width:'500px',height:'200px',
                button:[{id:"btn01",caption:this.lang.t("posItemsList.popItemEdit.msgSaveResult.btn01"),location:'after'}],
            }

            this.itemsObj.dt('ITEMS')[0].SNAME = this.itemsObj.dt('ITEMS')[0].NAME.substring(0,32)
            console.log(this.itemsObj.dt('ITEMS')[0])
            if((await this.itemsObj.save()) == 0)
            {         
                tmpConfObj1.content = (<div style={{textAlign:"center",fontSize:"20px",color:"green"}}>{this.lang.t("posItemsList.popItemEdit.msgSaveResult.msgSuccess")}</div>)
                await dialog(tmpConfObj1);
            }
            else
            {
                tmpConfObj1.content = (<div style={{textAlign:"center",fontSize:"20px",color:"red"}}>{this.lang.t("posItemsList.popItemEdit.msgSaveResult.msgFailed")}</div>)
                await dialog(tmpConfObj1);
            }
        }
    }
    async onDelete()
    {
        let tmpQuery = 
        {
            query : "SELECT TOP 1 * FROM POS_SALE_VW_01 WHERE ITEM_GUID = @CODE ",

            param : ['CODE:string|50'],
            value : [this.itemsObj.dt()[0].GUID]
        }

        let tmpData = await this.core.sql.execute(tmpQuery) 
        
        if(tmpData.result.recordset.length > 0)
        {
            let tmpConfObj =
            {
                id:'msgNotDelete',showTitle:true,title:this.lang.t("posItemsList.popItemEdit.msgNotDelete.title"),showCloseButton:true,width:'500px',height:'200px',
                button:[{id:"btn01",caption:this.lang.t("posItemsList.popItemEdit.msgNotDelete.btn01"),location:'after'}],
                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("posItemsList.popItemEdit.msgNotDelete.msg")}</div>)
            }
            await dialog(tmpConfObj); 
            return
        }

        let tmpConfObj =
        {
            id:'msgDelete',showTitle:true,title:this.lang.t("posItemsList.popItemEdit.msgDelete.title"),showCloseButton:true,width:'500px',height:'200px',
            button:[{id:"btn01",caption:this.lang.t("posItemsList.popItemEdit.msgDelete.btn01"),location:'before'},{id:"btn02",caption:this.lang.t("posItemsList.popItemEdit.msgDelete.btn02"),location:'after'}],
            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("posItemsList.popItemEdit.msgDelete.msg")}</div>)
        }

        let pResult = await dialog(tmpConfObj);

        if(pResult == 'btn01')
        {
            this.itemsObj.dt('ITEMS').removeAt(0)
            await this.itemsObj.dt('ITEMS').delete();
            this.init(); 
        }
    }
    async getItem(pCode)
    {
        this.itemsObj.clearAll();

        let tmpMainGrpDt = new datatable();
        tmpMainGrpDt.selectCmd = 
        {
            query : `SELECT '' AS CODE,'' AS NAME, '00000000-0000-0000-0000-000000000000' AS GUID
                    UNION ALL SELECT CODE,NAME,GUID FROM ITEM_GROUP WHERE STATUS = 1 ORDER BY NAME ASC`
        }

        await tmpMainGrpDt.refresh();
        await this.popCmbItemGrp.dataRefresh({source:tmpMainGrpDt});

        await this.itemsObj.load({CODE:pCode})
        await this.grdPrice.dataRefresh({source:this.itemsObj.itemPrice.dt('ITEM_PRICE')});
    }
    render()
    {
        return (
            <div style={{display:'flex',flexDirection:'column',height:'100%',backgroundColor:'#fff'}}>
                <div className="row px-2 pt-2">
                    <div className="col-12">
                        <Toolbar>
                            <Item location="after"
                            locateInMenu="auto"
                            widget="dxButton"
                            options=
                            {{
                                type: 'default',
                                icon: 'file',
                                onClick: async () => 
                                {
                                    await this.popItemEdit.show()
                                    this.init();
                                }
                            }}/>
                            <Item location="after"
                            locateInMenu="auto"
                            widget="dxButton"
                            options=
                            {{
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
                                        App.instance.setPage('menu')
                                    }
                                }
                            }}/>
                        </Toolbar>
                    </div>
                </div>
                <div style={{flex:1,padding:'0.5rem',overflowY:'auto'}}>
                    <div className="row pt-2">
                        <div className="col-6">
                            <NdTextBox id="txtItemSearch" 
                                parent={this} 
                                simple={true} 
                                placeholder={this.lang.t("posItemsList.txtItemSearchPholder")}
                                selectAll={false}
                                onFocusIn={()=>
                                {
                                    this.keyboardRef.show('txtItemSearch')
                                    this.keyboardRef.inputName = "txtItemSearch"
                                    this.keyboardRef.setInput(this.txtItemSearch.value)
                                }}

                                button=
                                {[
                                    {
                                        id:'01',
                                        icon:'edit',
                                        onClick:async()=>
                                        {
                                            const tmpKeyboard = document.querySelector('.simple-keyboard');
                                            if(tmpKeyboard && !tmpKeyboard.contains(document.activeElement))
                                            {
                                                this.keyboardRef.hide()
                                            }
                                            else
                                            {
                                                this.keyboardRef.show('txtItemSearch')
                                                this.keyboardRef.inputName = "txtItemSearch"
                                                this.keyboardRef.setInput(this.txtItemSearch.value)
                                            }
                                        }
                                    },
                                ]}>     
                            </NdTextBox>
                        </div>
                        <div className="col-4">
                            <NdSelectBox parent={this} id="cmbMainGrply" height='fit-content' simple={true}
                                displayExpr="NAME"                       
                                valueExpr="GUID"
                                value=""
                                placeholder={this.lang.t("posItemsList.cmbMainGrpPlaceholder")}
                                searchEnabled={true} 
                                showClearButton={true}
                                data={{source:{select:{query:"SELECT GUID, NAME FROM ITEM_GROUP WHERE STATUS = 1 ORDER BY NAME ASC"},sql:this.core.sql}}}
                            />
                        </div>
                        <div className="col-2">
                            <NbButton id={"btnItemSearch"} parent={this} className="form-group btn btn-primary btn-block" 
                            style={{height:"36px",width:"100%"}}
                            onClick={() =>
                            {
                                this.getItems()
                            }}>
                                {this.lang.t("posItemsList.btnItemSearch")}
                            </NbButton>
                        </div>
                    </div>
                    <div className="row pt-2">
                        <div className="col-12">
                            <NdGrid parent={this} id={"grdItemList"} 
                            showBorders={true} 
                            columnsAutoWidth={true} 
                            allowColumnReordering={true} 
                            allowColumnResizing={true} 
                            height={"100%"} 
                            width={"100%"}
                            dbApply={false}
                            selection={{mode:"single"}}
                            onRowDblClick={async(e)=>
                            {
                                await this.popItemEdit.show()
                                this.getItem(e.data.CODE)
                            }}
                            onRowPrepared={(e)=>
                            {
                                if(e.rowType == "header")
                                {
                                    e.rowElement.style.fontWeight = "bold";    
                                }
                                e.rowElement.style.fontSize = "18px";
                            }}
                            onCellPrepared={(e)=>
                            {
                                e.cellElement.style.padding = "6px"
                            }}
                            >
                                <Paging defaultPageSize={14} />
                                <Column dataField="CODE" caption={this.lang.t("posItemsList.grdItemList.CODE")} width={200}/>
                                <Column dataField="NAME" caption={this.lang.t("posItemsList.grdItemList.NAME")} width={700}/>
                                <Column dataField="VAT" caption={this.lang.t("posItemsList.grdItemList.VAT")} width={100}/>
                            </NdGrid>
                        </div>
                    </div>
                </div>
                {/* Item Popup */} 
                <div>
                    <NdPopUp id="popItemEdit" parent={this} title={this.lang.t("posItemsList.popItemEdit.title")} 
                    width={"100%"} height={"100%"}
                    style={{zIndex:'1000px'}}
                    showCloseButton={true}
                    showTitle={true}
                    deferRendering={true}
                    >
                        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end'}}>
                            <div className="px-1">
                                <NbButton id={"btnNew"} parent={this} className="form-group btn btn-primary btn-block" 
                                style={{height:"50px",width:"50px"}}
                                onClick={async() => 
                                {
                                    let tmpConfObj =
                                    {
                                        id:'msgNewItem',showTitle:true,title:this.lang.t("posItemsList.popItemEdit.msgNewItem.title"),showCloseButton:true,width:'500px',height:'200px',
                                        button:[{id:"btn01",caption:this.lang.t("posItemsList.popItemEdit.msgNewItem.btn01"),location:'before'},{id:"btn02",caption:this.lang.t("posItemsList.popItemEdit.msgNewItem.btn02"),location:'after'}],
                                        content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("posItemsList.popItemEdit.msgNewItem.msg")}</div>)
                                    }
                                    let tmpResult = await dialog(tmpConfObj);
                                    if(tmpResult == "btn01")
                                    {
                                        this.init();
                                    }
                                }}>
                                    <i className="fa-regular fa-file" style={{fontSize:'20px'}}></i>
                                </NbButton>
                            </div>
                            <div className="px-1">
                                <NbButton id={"btnSave"} parent={this} className="form-group btn btn-success btn-block" 
                                style={{height:"50px",width:"50px"}}
                                onClick={this.onSave}>
                                    <i className="fa-regular fa-floppy-disk" style={{fontSize:'20px'}}></i>
                                </NbButton>
                            </div>
                            <div className="px-1">
                                <NbButton id={"btnDelete"} parent={this} className="form-group btn btn-danger btn-block" 
                                style={{height:"50px",width:"50px"}}
                                onClick={this.onDelete}>
                                    <i className="fa-regular fa-trash-can" style={{fontSize:'20px'}}></i>
                                </NbButton>
                            </div>
                        </div>
                        <div className="row pt-2">
                            <div className="col-6">
                                <div className="row py-1">
                                    <div className='col-4 p-0 pe-1'>
                                        <label className="col-form-label d-flex justify-content-end">{this.lang.t("posItemsList.popItemEdit.txtRef") + " :"}</label>
                                    </div>
                                    <div className="col-8 p-0">
                                        <NdTextBox id="popTxtRef" parent={this} dt={{data:this.itemsObj.dt('ITEMS'),field:"CODE"}} simple={true}
                                        selectAll={false}
                                        onFocusIn={()=>
                                        {
                                            this.keyboardRef.show('popTxtRef')
                                            this.keyboardRef.inputName = "popTxtRef"
                                            this.keyboardRef.setInput(this.popTxtRef.value)
                                        }}
                                        button=
                                        {
                                            [
                                                {
                                                    id:'01',
                                                    icon:'arrowdown',
                                                    onClick:()=>
                                                    {
                                                        this.popTxtRef.value = Math.floor(Date.now() / 1000)
                                                    }
                                                },
                                                {
                                                    id:'02',
                                                    icon:'edit',
                                                    onClick:async()=>
                                                    {
                                                        const tmpKeyboard = document.querySelector('.simple-keyboard');
                                                        if(tmpKeyboard && !tmpKeyboard.contains(document.activeElement))
                                                        {
                                                            this.keyboardRef.hide()
                                                        }
                                                        else
                                                        {
                                                            this.keyboardRef.show('popTxtRef')
                                                            this.keyboardRef.inputName = "popTxtRef"
                                                            this.keyboardRef.setInput(this.popTxtRef.value)
                                                        }
                                                    }
                                                }
                                            ]
                                        }
                                        onChange={(async()=>
                                        {
                                            let tmpQuery = 
                                            {
                                                query : `SELECT TOP 1 * FROM ITEMS WHERE CODE = '${this.popTxtRef.value}'`
                                            }
                                            let tmpData = await this.core.sql.execute(tmpQuery)
                                            if(tmpData.result.recordset.length > 0)
                                            {
                                                let tmpConfObj =
                                                {
                                                    id:'msgItemExist',showTitle:true,title:this.lang.t("posItemsList.popItemEdit.msgItemExist.title"),showCloseButton:true,width:'500px',height:'200px',
                                                    button:[{id:"btn01",caption:this.lang.t("posItemsList.popItemEdit.msgItemExist.btn01"),location:'before'},{id:"btn02",caption:this.lang.t("posItemsList.popItemEdit.msgItemExist.btn02"),location:'after'}],
                                                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("posItemsList.popItemEdit.msgItemExist.msg")}</div>)
                                                }
                                                let tmpResult = await dialog(tmpConfObj);
                                                if(tmpResult == "btn01")
                                                {
                                                    this.getItem(tmpData.result.recordset[0].CODE)
                                                }
                                                else
                                                {
                                                    this.init();
                                                }
                                            }
                                        }).bind(this)}


                                        onValueChanged={(e)=>
                                        {
                                            console.log(e)
                                        }}
                                        >     
                                        </NdTextBox>      
                                    </div>
                                </div>
                                <div className="row py-1">
                                    <div className='col-4 p-0 pe-1'>
                                        <label className="col-form-label d-flex justify-content-end">{this.lang.t("posItemsList.popItemEdit.txtName") + " :"}</label>
                                    </div>
                                    <div className="col-8 p-0">
                                        <NdTextBox id="popTxtName" parent={this} dt={{data:this.itemsObj.dt('ITEMS'),field:"NAME"}} 
                                        simple={true} upper={true} selectAll={false}
                                        onFocusIn={()=>
                                            {
                                                this.keyboardRef.show('popTxtName')
                                                this.keyboardRef.inputName = "popTxtName"
                                                this.keyboardRef.setInput(this.popTxtName.value)
                                            }}
                                        button=
                                        {[
                                            {
                                                id:'01',
                                                icon:'edit',
                                                onClick:async()=>
                                                {
                                                    const tmpKeyboard = document.querySelector('.simple-keyboard');
                                                    if(tmpKeyboard && !tmpKeyboard.contains(document.activeElement))
                                                    {
                                                        this.keyboardRef.hide()
                                                    }
                                                    else
                                                    {
                                                        this.keyboardRef.show('popTxtName')
                                                        this.keyboardRef.inputName = "popTxtName"
                                                        this.keyboardRef.setInput(this.popTxtName.value)
                                                    }
                                                }
                                            }
                                        ]} />
                                    </div>
                                </div>
                                <div className="row py-1">
                                    <div className='col-4 p-0 pe-1'>
                                        <label className="col-form-label d-flex justify-content-end">{this.lang.t("posItemsList.popItemEdit.cmbMainUnit") + " :"}</label>
                                    </div>
                                    <div className="col-4 p-0">
                                        <NdSelectBox parent={this} id="popCmbMainUnit" height='fit-content' simple={true}
                                        dt={{data:this.itemsObj.dt('ITEM_UNIT'),field:"ID",display:"NAME",filter:{TYPE:0}}}
                                        style={{borderTopRightRadius:'0px',borderBottomRightRadius:'0px'}}
                                        displayExpr="NAME"                       
                                        valueExpr="ID"
                                        data={{source:{select:{query:"SELECT ID,NAME,SYMBOL FROM UNIT ORDER BY ID ASC"},sql:this.core.sql}}}
                                        />
                                    </div>
                                    <div className="col-4 p-0">
                                        <NdNumberBox id="popTxtMainUnit" parent={this} simple={true} tabIndex={this.tabIndex} style={{borderTopLeftRadius:'0px',borderBottomLeftRadius:'0px'}} 
                                        showSpinButtons={true} step={1.00} format={"###.000"}
                                        dt={{data:this.itemsObj.dt('ITEM_UNIT'),field:"FACTOR",filter:{TYPE:0}}}/>
                                    </div>
                                </div>
                                <div className="row py-1">
                                    <div className='col-4 p-0 pe-1'>
                                        <label className="col-form-label d-flex justify-content-end">{this.lang.t("posItemsList.popItemEdit.cmbUnderUnit") + " :"}</label>
                                    </div>
                                    <div className="col-4 p-0">
                                        <NdSelectBox parent={this} id="popCmbUnderUnit" height='fit-content' simple={true}
                                        dt={{data:this.itemsObj.dt('ITEM_UNIT'),field:"ID",display:"NAME",filter:{TYPE:1}}}
                                        style={{borderTopRightRadius:'0px',borderBottomRightRadius:'0px'}}
                                        displayExpr="NAME"                       
                                        valueExpr="ID"
                                        data={{source:{select:{query:"SELECT ID,NAME,SYMBOL FROM UNIT ORDER BY ID ASC"},sql:this.core.sql}}}
                                        />
                                    </div>
                                    <div className="col-4 p-0">
                                        <NdNumberBox id="popTxtUnderUnit" parent={this} simple={true} tabIndex={this.tabIndex} style={{borderTopLeftRadius:'0px',borderBottomLeftRadius:'0px'}} 
                                        showSpinButtons={true} step={0.1} format={"##0.000"}
                                        dt={{id:"popTxtUnderUnit",data:this.itemsObj.dt('ITEM_UNIT'),field:"FACTOR",filter:{TYPE:1}}}/>
                                    </div>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="row py-1">
                                    <div className='col-3 p-0 pe-1'>
                                        <label className="col-form-label d-flex justify-content-end">{this.lang.t("posItemsList.popItemEdit.cmbItemGrp") + " :"}</label>
                                    </div>
                                    <div className="col-7 p-0">
                                        <NdSelectBox parent={this} id="popCmbItemGrp" tabIndex={this.tabIndex} simple={true}
                                        dt={{data:this.itemsObj.dt('ITEMS'),field:"MAIN_GUID",display:"MAIN_GRP_NAME"}}
                                        displayExpr="NAME"                 
                                        valueExpr="GUID"
                                        value=""
                                        searchEnabled={true} 
                                        showClearButton={true}
                                        pageSize ={50}
                                        notRefresh={true}
                                        />
                                    </div>
                                    <div className="col-2 p-0 pe-3">
                                        <NdButton text={"+"} type="normal" stylingMode="contained" width={'100%'} 
                                        onClick={()=>
                                        {
                                            this.popAddItemGrp.show();
                                        }}/>
                                    </div>
                                </div>
                                <div className="row py-1">
                                    <div className='col-3 p-0 pe-1'>
                                        <label className="col-form-label d-flex justify-content-end">{this.lang.t("posItemsList.popItemEdit.cmbTax") + " :"}</label>
                                    </div>
                                    <div className="col-9 p-0 pe-3">
                                        <NdSelectBox parent={this} id="popCmbTax" height='fit-content' dt={{data:this.itemsObj.dt('ITEMS'),field:"VAT"}} simple={true}
                                        displayExpr="VAT"                       
                                        valueExpr="VAT"
                                        data={{source:{select:{query:"SELECT VAT FROM VAT ORDER BY ID ASC"},sql:this.core.sql}}}
                                        />
                                    </div>
                                </div>
                                <div className="row py-1">
                                    <div className='col-3 p-0 pe-1'>
                                        <label className="col-form-label d-flex justify-content-end">{this.lang.t("posItemsList.popItemEdit.cmbOrigin") + " :"}</label>
                                    </div>
                                    <div className="col-9 p-0 pe-3">
                                        <NdSelectBox simple={true} parent={this} id="popCmbOrigin"
                                        dt={{data:this.itemsObj.dt('ITEMS'),field:"ORGINS",display:"ORGINS_NAME"}}
                                        displayExpr="NAME"                       
                                        valueExpr="CODE"
                                        value=""
                                        searchEnabled={true} showClearButton={true}
                                        data={{source:{select:{query : "SELECT CODE,NAME FROM COUNTRY ORDER BY CODE ASC"},sql:this.core.sql}}}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row pt-2">
                            <div className="col-2">
                                <div className="row pe-3">
                                    <div className='col-10 p-0 pe-1'>
                                        <label className="col-form-label d-flex justify-content-end">{this.lang.t("posItemsList.popItemEdit.chkActive") + " :"}</label>
                                    </div>
                                    <div className="col-2 p-0 d-flex align-items-center">
                                        <NdCheckBox id="popChkActive" parent={this} defaultValue={true} dt={{data:this.itemsObj.dt('ITEMS'),field:"STATUS"}}/>
                                    </div>
                                </div>
                            </div>
                            <div className="col-2">
                                <div className="row pe-3">
                                    <div className='col-10 p-0 pe-1'>
                                        <label className="col-form-label d-flex justify-content-end">{this.lang.t("posItemsList.popItemEdit.chkCaseWeighed") + " :"}</label>
                                    </div>
                                    <div className="col-2 p-0 d-flex align-items-center">
                                        <NdCheckBox id="popChkCaseWeighed" parent={this} defaultValue={false} dt={{data:this.itemsObj.dt('ITEMS'),field:"WEIGHING"}}/>
                                    </div>
                                </div>
                            </div>
                            <div className="col-3">
                                <div className="row pe-3">
                                    <div className='col-10 p-0 pe-1'>
                                        <label className="col-form-label d-flex justify-content-end">{this.lang.t("posItemsList.popItemEdit.chkLineMerged") + " :"}</label>
                                    </div>
                                    <div className="col-2 p-0 d-flex align-items-center">
                                        <NdCheckBox id="popChkLineMerged" parent={this} defaultValue={false} dt={{data:this.itemsObj.dt('ITEMS'),field:"SALE_JOIN_LINE"}}/>
                                    </div>
                                </div>
                            </div>
                            <div className="col-2">
                                <div className="row pe-3">
                                    <div className='col-10 p-0 pe-1'>
                                        <label className="col-form-label d-flex justify-content-end">{this.lang.t("posItemsList.popItemEdit.chkTicketRest") + " :"}</label>
                                    </div>
                                    <div className="col-1 p-0 d-flex align-items-center">
                                        <NdCheckBox id="popChkTicketRest" parent={this} defaultValue={false} dt={{data:this.itemsObj.dt('ITEMS'),field:"TICKET_REST"}}/>
                                    </div>
                                </div>
                            </div>
                            <div className="col-2">
                                <div className="row pe-3">
                                    <div className='col-10 p-0 pe-1'>
                                        <label className="col-form-label d-flex justify-content-end">{"Piq Poid" + " :"}</label>
                                    </div>
                                    <div className="col-2 p-0 d-flex align-items-center">
                                        <NdCheckBox id="popChkPiqPoid" parent={this} defaultValue={false} dt={{data:this.itemsObj.dt('ITEMS'),field:"PIQPOID"}}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row pt-2">
                            <div className='col-12'>
                                <NdTabPanel id={"tabPanel"} parent={this} height="100%" onItemRendered={this.onItemRendered}>
                                    <Item title={this.lang.t("posItemsList.popItemEdit.tabTitlePrice")} text={"tbPrice"}>
                                        <div className='row px-2 py-2'>
                                            <div className='col-12'>
                                                <NdGrid parent={this} id={"grdPrice"} 
                                                showBorders={true} 
                                                columnsAutoWidth={true} 
                                                allowColumnReordering={true} 
                                                allowColumnResizing={true} 
                                                height={'100%'} 
                                                width={'100%'}
                                                dbApply={false}
                                                selection={{mode: 'single'}}
                                                onToolbarPreparing={(e)=>
                                                {
                                                    e.toolbarOptions.items.unshift(
                                                    {
                                                        location: 'after',
                                                        widget: 'dxButton',
                                                        options: 
                                                        {
                                                            icon: 'minus',
                                                            onClick: async () => 
                                                            {
                                                                let tmpData = this.grdPrice.getSelectedData();
                                                                if(tmpData.length > 0)
                                                                {
                                                                    this.itemsObj.itemPrice.dt().removeAt(this.itemsObj.itemPrice.dt().indexOf(tmpData[0]));
                                                                    await this.grdPrice.dataRefresh({source:this.itemsObj.itemPrice.dt('ITEM_PRICE')});
                                                                }
                                                            }
                                                        }
                                                    });
                                                    e.toolbarOptions.items.unshift(
                                                    {
                                                        location: 'after',
                                                        widget: 'dxButton',
                                                        options: 
                                                        {
                                                            icon: 'add',
                                                            onClick: async () => 
                                                            {
                                                                this.dtPopPriStartDate.value = "1970-01-01"
                                                                this.dtPopPriEndDate.value = "1970-01-01"
                                                                this.txtPopPriQuantity.value = 1
                                                                this.txtPopPriPrice.value = 0
                                                                
                                                                this.editMode = false;
                                                                this.editRow = null;

                                                                this.popPrice.show();
                                                            }
                                                        }
                                                    });
                                                }}
                                                onRowDblClick={(e)=>
                                                {
                                                    this.dtPopPriStartDate.value = e.data.START_DATE;
                                                    this.dtPopPriEndDate.value = e.data.FINISH_DATE;
                                                    this.txtPopPriQuantity.value = e.data.QUANTITY;
                                                    this.txtPopPriPrice.value = e.data.PRICE;
                                                    this.editMode = true;
                                                    this.editRow = e.data;
                                                    
                                                    this.popPrice.show();
                                                }}
                                                >
                                                    <Paging defaultPageSize={6} />
                                                    <Column dataField="START_DATE" caption={this.lang.t("posItemsList.popItemEdit.grdPrice.clmStartDate")} dataType="date" 
                                                    editorOptions={{value:null}}
                                                    cellRender={(e) => 
                                                    {
                                                        if(moment(e.value).format("YYYY-MM-DD") != '1970-01-01')
                                                        {
                                                            return e.text
                                                        }
                                                        
                                                        return
                                                    }}/>
                                                    <Column dataField="FINISH_DATE" caption={this.lang.t("posItemsList.popItemEdit.grdPrice.clmFinishDate")} dataType="date"
                                                    editorOptions={{value:null}}
                                                    cellRender={(e) => 
                                                    {

                                                        if(moment(e.value).format("YYYY-MM-DD") != '1970-01-01')
                                                        {
                                                            return e.text
                                                        }
                                                        
                                                        return
                                                    }}/>
                                                    <Column dataField="QUANTITY" caption={this.lang.t("posItemsList.popItemEdit.grdPrice.clmQuantity")}/>
                                                    <Column dataField="PRICE" caption={this.lang.t("posItemsList.popItemEdit.grdPrice.clmPrice")} dataType="number" format={Number.money.sign +"##0.000"}/>
                                                </NdGrid>
                                            </div>
                                        </div>
                                    </Item>
                                    <Item title={this.lang.t("posItemsList.popItemEdit.tabTitleUnit")} text={"tbUnit"}>
                                        <div className='row px-2 py-2'>
                                            <div className='col-12'>
                                                <NdGrid parent={this} id={"grdUnit"} 
                                                showBorders={true} 
                                                columnsAutoWidth={true} 
                                                allowColumnReordering={true} 
                                                allowColumnResizing={true} 
                                                height={'100%'} 
                                                width={'100%'}
                                                dbApply={false}
                                                selection={{mode: 'single'}}
                                                onToolbarPreparing={(e)=>
                                                {
                                                    e.toolbarOptions.items.unshift(
                                                    {
                                                        location: 'after',
                                                        widget: 'dxButton',
                                                        options: 
                                                        {
                                                            icon: 'minus',
                                                            onClick: async () => 
                                                            {
                                                                let tmpData = this.grdUnit.getSelectedData();
                                                                if(tmpData.length > 0)
                                                                {
                                                                    if(tmpData[0].TYPE != 2)
                                                                    {
                                                                        let tmpConfObj =
                                                                        {
                                                                            id:'msgUnitRowNotDelete',showTitle:true,title:this.lang.t("posItemsList.popItemEdit.popUnit.msgUnitRowNotDelete.title"),showCloseButton:true,width:'500px',height:'200px',
                                                                            button:[{id:"btn01",caption:this.lang.t("posItemsList.popItemEdit.popUnit.msgUnitRowNotDelete.btn01"),location:'after'}],
                                                                            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("posItemsList.popItemEdit.popUnit.msgUnitRowNotDelete.msg")}</div>)
                                                                        }                                                                    

                                                                        dialog(tmpConfObj);
                                                                        return;
                                                                    }

                                                                    this.itemsObj.itemUnit.dt().removeAt(this.itemsObj.itemUnit.dt().indexOf(tmpData[0]));
                                                                    await this.grdUnit.dataRefresh({source:this.itemsObj.itemUnit.dt('ITEM_UNIT')});
                                                                }
                                                            }
                                                        }
                                                    });
                                                    e.toolbarOptions.items.unshift(
                                                    {
                                                        location: 'after',
                                                        widget: 'dxButton',
                                                        options: 
                                                        {
                                                            icon: 'add',
                                                            onClick: async () => 
                                                            {
                                                                this.cmbPopUnitName.value = "001"
                                                                this.txtPopUnitFactor.value = 1

                                                                this.editMode = false;
                                                                this.editRow = null;

                                                                this.popUnit.show();
                                                            }
                                                        }
                                                    });
                                                }}
                                                onRowDblClick={(e)=>
                                                {
                                                    if(e.data.TYPE != 2)
                                                    {
                                                        let tmpConfObj =
                                                        {
                                                            id:'msgUnitRowNotEdit',showTitle:true,title:this.lang.t("posItemsList.popItemEdit.popUnit.msgUnitRowNotEdit.title"),showCloseButton:true,width:'500px',height:'200px',
                                                            button:[{id:"btn01",caption:this.lang.t("posItemsList.popItemEdit.popUnit.msgUnitRowNotEdit.btn01"),location:'after'}],
                                                            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("posItemsList.popItemEdit.popUnit.msgUnitRowNotEdit.msg")}</div>)
                                                        }                                                                    

                                                        dialog(tmpConfObj);
                                                        return;
                                                    }

                                                    this.cmbPopUnitName.value = e.data.ID
                                                    this.txtPopUnitFactor.value = e.data.FACTOR

                                                    this.editMode = true;
                                                    this.editRow = e.data;
                                                    
                                                    this.popUnit.show();
                                                }}
                                                >
                                                    <Paging defaultPageSize={5} />
                                                    <Column dataField="TYPE_NAME" caption={this.lang.t("posItemsList.popItemEdit.grdUnit.clmType")} width={250}/>
                                                    <Column dataField="NAME" caption={this.lang.t("posItemsList.popItemEdit.grdUnit.clmName")}/>
                                                    <Column dataField="FACTOR" caption={this.lang.t("posItemsList.popItemEdit.grdUnit.clmFactor")}/>
                                                </NdGrid>
                                            </div>
                                        </div>
                                    </Item>
                                    <Item title={this.lang.t("posItemsList.popItemEdit.tabTitleBarcode")} text={"tbBarcode"}>
                                        <div className='row px-2 py-2'>
                                            <div className='col-12'>
                                                <NdGrid parent={this} id={"grdBarcode"} 
                                                showBorders={true} 
                                                columnsAutoWidth={true} 
                                                allowColumnReordering={true} 
                                                allowColumnResizing={true} 
                                                height={'100%'} 
                                                width={'100%'}
                                                dbApply={false}
                                                selection={{mode: 'single'}}
                                                onToolbarPreparing={(e)=>
                                                {
                                                    e.toolbarOptions.items.unshift(

                                                    {
                                                        location: 'after',
                                                        widget: 'dxButton',
                                                        options: 
                                                        {
                                                            icon: 'minus',
                                                            onClick: async () => 
                                                            {
                                                                let tmpData = this.grdBarcode.getSelectedData();
                                                                if(tmpData.length > 0)
                                                                {
                                                                    this.itemsObj.itemBarcode.dt().removeAt(this.itemsObj.itemBarcode.dt().indexOf(tmpData[0]));
                                                                    await this.grdBarcode.dataRefresh({source:this.itemsObj.itemBarcode.dt('ITEM_BARCODE')});
                                                                }
                                                            }
                                                        }
                                                    });
                                                    e.toolbarOptions.items.unshift(
                                                    {
                                                        location: 'after',
                                                        widget: 'dxButton',
                                                        options: 
                                                        {
                                                            icon: 'add',
                                                            onClick: async () => 
                                                            {
                                                                this.txtPopBarcode.value = ""
                                                                this.cmbPopBarType.value = "0"
                                                                this.cmbPopBarUnitType.value = this.itemsObj.dt('ITEM_UNIT').where({TYPE:0}).length > 0 ? this.itemsObj.dt('ITEM_UNIT').where({TYPE:0})[0].GUID : ''

                                                                this.editMode = false;
                                                                this.editRow = null;

                                                                this.popBarcode.show();

                                                                await this.cmbPopBarUnitType.dataRefresh({source : this.itemsObj.dt('ITEM_UNIT').where({TYPE:{'in':[0,2]}})})
                                                            }
                                                        }
                                                    });
                                                }}
                                                onRowDblClick={(e)=>
                                                {
                                                    this.txtPopBarcode.value = e.data.BARCODE
                                                    this.cmbPopBarType.value = e.data.TYPE
                                                    this.cmbPopBarUnitType.value = e.data.UNIT_GUID

                                                    this.editMode = true;
                                                    this.editRow = e.data;
                                                    
                                                    this.popBarcode.show();
                                                }}
                                                >
                                                    <Paging defaultPageSize={5} />
                                                    <Column dataField="BARCODE" caption={this.lang.t("posItemsList.popItemEdit.grdBarcode.clmBarcode")} allowEditing={false}/>
                                                    <Column dataField="UNIT_NAME" caption={this.lang.t("posItemsList.popItemEdit.grdBarcode.clmUnit")} allowEditing={false}/>
                                                    <Column dataField="TYPE_NAME" caption={this.lang.t("posItemsList.popItemEdit.grdBarcode.clmType")} allowEditing={false}/>
                                                </NdGrid>
                                            </div>
                                        </div>
                                    </Item>
                                </NdTabPanel>
                            </div>
                        </div>
                    </NdPopUp>
                </div>
                {/* Fiyat Popup */}
                <div>
                    <NdPopUp id="popPrice" parent={this} 
                    visible={false}
                    showCloseButton={true}
                    showTitle={true}
                    title={this.lang.t("posItemsList.popItemEdit.popPrice.title")}
                    container={"#root"} 
                    width={"500"}
                    height={"320"}
                    position={{of:"#root"}}
                    >
                        <Form colCount={1} height={'fit-content'} id={"frmPrice"}>
                            {/* dtPopPriStartDate */}
                            <Item>
                                <Label text={this.lang.t("posItemsList.popItemEdit.popPrice.dtPopPriStartDate")} alignment="right" />
                                <NdDatePicker simple={true}  parent={this} id={"dtPopPriStartDate"}/>
                            </Item>
                            {/* dtPopPriEndDate */}
                            <Item>
                                <Label text={this.lang.t("posItemsList.popItemEdit.popPrice.dtPopPriEndDate")} alignment="right" />
                                <NdDatePicker simple={true}  parent={this} id={"dtPopPriEndDate"}/>
                            </Item>
                            {/* txtPopPriQuantity */}
                            <Item>
                                <Label text={this.lang.t("posItemsList.popItemEdit.popPrice.txtPopPriQuantity")} alignment="right" />
                                <NdTextBox id={"txtPopPriQuantity"} parent={this} simple={true} selectAll={false}
                                onFocusIn={()=>
                                {
                                    this.keyboardRef.show('txtPopPriQuantity')
                                    this.keyboardRef.inputName = "txtPopPriQuantity"
                                    this.keyboardRef.setInput(this.txtPopPriQuantity.value)
                                }}
                                button=
                                {[
                                    {
                                        id:'01',
                                        icon:'edit',
                                        onClick:async()=>
                                        {
                                            const tmpKeyboard = document.querySelector('.simple-keyboard');
                                            if(tmpKeyboard && !tmpKeyboard.contains(document.activeElement))
                                            {
                                                this.keyboardRef.hide()
                                            }
                                            else
                                            {
                                                this.keyboardRef.show('txtPopPriQuantity')
                                                this.keyboardRef.inputName = "txtPopPriQuantity"
                                                this.keyboardRef.setInput(this.txtPopPriQuantity.value)
                                            }
                                        }
                                    }
                                ]}>
                                </NdTextBox>
                            </Item>
                            {/* txtPopPriPrice */}
                            <Item>
                                <Label text={this.lang.t("posItemsList.popItemEdit.popPrice.txtPopPriPrice")} alignment="right" />
                                <NdTextBox id={"txtPopPriPrice"} parent={this} simple={true} selectAll={false}
                                onFocusIn={()=>
                                {
                                    this.keyboardRef.show('txtPopPriPrice')
                                    this.keyboardRef.inputName = "txtPopPriPrice"
                                    this.keyboardRef.setInput(this.txtPopPriPrice.value)
                                }}
                                button=
                                {[
                                    {
                                        id:'01',
                                        icon:'edit',
                                        onClick:async()=>
                                        {
                                            const tmpKeyboard = document.querySelector('.simple-keyboard');
                                            if(tmpKeyboard && !tmpKeyboard.contains(document.activeElement))
                                            {
                                                this.keyboardRef.hide()
                                            }
                                            else
                                            {
                                                this.keyboardRef.show('txtPopPriPrice')
                                                this.keyboardRef.inputName = "txtPopPriPrice"
                                                this.keyboardRef.setInput(this.txtPopPriPrice.value)
                                            }
                                        }
                                    }
                                ]}>                                    
                                </NdTextBox>
                            </Item>                           
                            <Item>
                                <div className='row'>
                                    <div className='col-6'>
                                        <NdButton text={this.lang.t("posItemsList.popItemEdit.popPrice.btnSave")} type="normal" stylingMode="contained" width={'100%'}
                                        onClick={async (e)=>
                                        {
                                            if(this.txtPopPriQuantity.value == "" || this.txtPopPriQuantity.value == 0)
                                            {
                                                let tmpConfObj =
                                                {
                                                    id:'msgPriceQuantityEmpty',showTitle:true,title:this.lang.t("posItemsList.popItemEdit.popPrice.msgPriceQuantityEmpty.title"),showCloseButton:true,width:'500px',height:'200px',
                                                    button:[{id:"btn01",caption:this.lang.t("posItemsList.popItemEdit.popPrice.msgPriceQuantityEmpty.btn01"),location:'after'}],
                                                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("posItemsList.popItemEdit.popPrice.msgPriceQuantityEmpty.msg")}</div>)
                                                }
                                                await dialog(tmpConfObj);
                                                return;
                                            }
                                            if(isNaN(this.txtPopPriQuantity.value))
                                            {
                                                let tmpConfObj =
                                                {
                                                    id:'msgPriceQuantityNotNumber',showTitle:true,title:this.lang.t("posItemsList.popItemEdit.popPrice.msgPriceQuantityNotNumber.title"),showCloseButton:true,width:'500px',height:'200px',
                                                    button:[{id:"btn01",caption:this.lang.t("posItemsList.popItemEdit.popPrice.msgPriceQuantityNotNumber.btn01"),location:'after'}],
                                                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("posItemsList.popItemEdit.popPrice.msgPriceQuantityNotNumber.msg")}</div>)
                                                }
                                                await dialog(tmpConfObj);
                                                return;
                                            }
                                            if(this.txtPopPriPrice.value == "" || this.txtPopPriPrice.value == 0)
                                            {
                                                let tmpConfObj =
                                                {
                                                    id:'msgPriceEmpty',showTitle:true,title:this.lang.t("posItemsList.popItemEdit.popPrice.msgPriceEmpty.title"),showCloseButton:true,width:'500px',height:'200px',
                                                    button:[{id:"btn01",caption:this.lang.t("posItemsList.popItemEdit.popPrice.msgPriceEmpty.btn01"),location:'after'}],
                                                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("posItemsList.popItemEdit.popPrice.msgPriceEmpty.msg")}</div>)
                                                }
                                                await dialog(tmpConfObj);
                                                return;
                                            }
                                            if(isNaN(this.txtPopPriPrice.value))
                                            {
                                                let tmpConfObj =
                                                {
                                                    id:'msgPriceNotNumber',showTitle:true,title:this.lang.t("posItemsList.popItemEdit.popPrice.msgPriceNotNumber.title"),showCloseButton:true,width:'500px',height:'200px',
                                                    button:[{id:"btn01",caption:this.lang.t("posItemsList.popItemEdit.popPrice.msgPriceNotNumber.btn01"),location:'after'}],
                                                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("posItemsList.popItemEdit.popPrice.msgPriceNotNumber.msg")}</div>)
                                                }
                                                await dialog(tmpConfObj);
                                                return;
                                            }
                                            //*********************************** */
                                            //FİYAT GİRERKEN MALİYET FİYAT KONTROLÜ
                                            if(this.prmObj.filter({ID:'SalePriceCostCtrl'}).getValue() && this.txtCostPrice.value != 0 && this.txtCostPrice.value >= this.txtPopPriPrice.value)
                                            {
                                                let tmpConfObj =
                                                {
                                                    id:'msgCostPriceValid',showTitle:true,title:this.lang.t("posItemsList.popItemEdit.popPrice.msgCostPriceValid.title"),showCloseButton:true,width:'500px',height:'200px',
                                                    button:[{id:"btn01",caption:this.lang.t("posItemsList.popItemEdit.popPrice.msgCostPriceValid.btn01"),location:'after'}],
                                                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("posItemsList.popItemEdit.popPrice.msgCostPriceValid.msg")}</div>)
                                                }
                                                await dialog(tmpConfObj);
                                                return;
                                            }
                                            // BENZER FİYAT KAYIT KONTROLÜ                                               
                                            let tmpCheckData = this.itemsObj.itemPrice.dt('ITEM_PRICE').where({START_DATE:new Date(moment(this.dtPopPriStartDate.value).format("YYYY-MM-DD")).toISOString()})

                                            tmpCheckData = tmpCheckData.where({FINISH_DATE:new Date(moment(this.dtPopPriEndDate.value).format("YYYY-MM-DD")).toISOString()})
                                            tmpCheckData = tmpCheckData.where({TYPE:0})
                                            tmpCheckData = tmpCheckData.where({QUANTITY:this.txtPopPriQuantity.value})
                                            tmpCheckData = tmpCheckData.where({DEPOT:'00000000-0000-0000-0000-000000000000'})
                                            tmpCheckData = tmpCheckData.where({LIST_NO:1})

                                            if(this.editMode)
                                            {
                                                tmpCheckData = tmpCheckData.where({GUID:{'<>':this.editRow.GUID}})
                                            }

                                            if(tmpCheckData.length > 0)
                                            {
                                                let tmpConfObj =
                                                {
                                                    id:'msgCheckPrice',showTitle:true,title:this.lang.t("posItemsList.popItemEdit.popPrice.msgCheckPrice.title"),showCloseButton:true,width:'500px',height:'200px',
                                                    button:[{id:"btn01",caption:this.lang.t("posItemsList.popItemEdit.popPrice.msgCheckPrice.btn01"),location:'after'}],
                                                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("posItemsList.popItemEdit.popPrice.msgCheckPrice.msg")}</div>)
                                                }
                                                await dialog(tmpConfObj);
                                                return
                                            }

                                            if(this.editMode)
                                            {
                                                let tmpData = this.itemsObj.itemPrice.dt().where({GUID:this.editRow.GUID})
                                                if(tmpData.length > 0)
                                                {
                                                    tmpData[0].START_DATE = new Date(moment(this.dtPopPriStartDate.value).format("YYYY-MM-DD")).toISOString()
                                                    tmpData[0].FINISH_DATE = new Date(moment(this.dtPopPriEndDate.value).format("YYYY-MM-DD")).toISOString()
                                                    tmpData[0].QUANTITY = this.txtPopPriQuantity.value
                                                    tmpData[0].PRICE = this.txtPopPriPrice.value
                                                }
                                                this.popPrice.hide();
                                            }
                                            else
                                            {
                                                let tmpEmpty = {...this.itemsObj.itemPrice.empty};
                                            
                                                tmpEmpty.TYPE = 0
                                                tmpEmpty.LIST_NO = 1
                                                tmpEmpty.TYPE_NAME = 'Satis'
                                                tmpEmpty.ITEM_GUID = this.itemsObj.dt()[0].GUID 
                                                tmpEmpty.DEPOT = '00000000-0000-0000-0000-000000000000'
                                                tmpEmpty.START_DATE = new Date(moment(this.dtPopPriStartDate.value).format("YYYY-MM-DD")).toISOString()
                                                tmpEmpty.FINISH_DATE = new Date(moment(this.dtPopPriEndDate.value).format("YYYY-MM-DD")).toISOString()
                                                tmpEmpty.QUANTITY = this.txtPopPriQuantity.value
                                                tmpEmpty.PRICE = this.txtPopPriPrice.value

                                                this.itemsObj.itemPrice.addEmpty(tmpEmpty); 
                                                
                                                this.popPrice.hide();
                                            }
                                        }}/>
                                    </div>
                                    <div className='col-6'>
                                        <NdButton text={this.lang.t("posItemsList.popItemEdit.popPrice.btnCancel")} type="normal" stylingMode="contained" width={'100%'}
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
                {/* Birim Popup */}
                <div>
                    <NdPopUp id="popUnit" parent={this} 
                    visible={false}
                    showCloseButton={true}
                    showTitle={true}
                    title={this.lang.t("posItemsList.popItemEdit.popUnit.title")}
                    container={"#root"} 
                    width={"500"}
                    height={"230"}
                    position={{of:"#root"}}
                    >
                        <Form colCount={1} height={'fit-content'} id={"frmUnit"}>
                            {/* cmbPopUnitName */}
                            <Item>
                                <Label text={this.lang.t("posItemsList.popItemEdit.popUnit.cmbPopUnitName")} alignment="right" />
                                <NdSelectBox simple={true} parent={this} id="cmbPopUnitName"
                                displayExpr="NAME"                       
                                valueExpr="ID"
                                value="001"
                                data={{source:{select:{query:"SELECT ID,NAME,SYMBOL FROM UNIT ORDER BY ID ASC"},sql:this.core.sql}}}
                                />
                            </Item>
                            {/* txtPopUnitQuantity */}
                            <Item>
                                <Label text={this.lang.t("posItemsList.popItemEdit.popUnit.txtPopUnitFactor")} alignment="right" />
                                <NdTextBox id={"txtPopUnitFactor"} parent={this} simple={true} selectAll={false}
                                onFocusIn={()=>
                                {
                                    this.keyboardRef.show('txtPopUnitFactor')
                                    this.keyboardRef.inputName = "txtPopUnitFactor"
                                    this.keyboardRef.setInput(this.txtPopUnitFactor.value)
                                }}
                                button=
                                {[
                                    {
                                        id:'01',
                                        icon:'edit',
                                        onClick:async()=>
                                        {
                                            const tmpKeyboard = document.querySelector('.simple-keyboard');
                                            if(tmpKeyboard && !tmpKeyboard.contains(document.activeElement))
                                            {
                                                this.keyboardRef.hide()
                                            }
                                            else
                                            {
                                                this.keyboardRef.show('txtPopUnitFactor')
                                                this.keyboardRef.inputName = "txtPopUnitFactor"
                                                this.keyboardRef.setInput(this.txtPopUnitFactor.value)
                                            }
                                        }
                                    }
                                ]}>
                                </NdTextBox>
                            </Item>
                            <Item>
                                <div className='row'>
                                    <div className='col-6'>
                                        <NdButton text={this.lang.t("posItemsList.popItemEdit.popUnit.btnSave")} type="normal" stylingMode="contained" width={'100%'}
                                        onClick={async (e)=>
                                        {
                                            if(this.txtPopUnitFactor.value == "" || this.txtPopUnitFactor.value == 0)
                                            {
                                                let tmpConfObj =
                                                {
                                                    id:'msgUnitFactorEmpty',showTitle:true,title:this.lang.t("posItemsList.popItemEdit.popUnit.msgUnitFactorEmpty.title"),showCloseButton:true,width:'500px',height:'200px',
                                                    button:[{id:"btn01",caption:this.lang.t("posItemsList.popItemEdit.popUnit.msgUnitFactorEmpty.btn01"),location:'after'}],
                                                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("posItemsList.popItemEdit.popUnit.msgUnitFactorEmpty.msg")}</div>)
                                                }
                                                await dialog(tmpConfObj);
                                                return;
                                            }

                                            if(isNaN(this.txtPopUnitFactor.value))
                                            {
                                                let tmpConfObj =
                                                {
                                                    id:'msgUnitFactorNotNumber',showTitle:true,title:this.lang.t("posItemsList.popItemEdit.popUnit.msgUnitFactorNotNumber.title"),showCloseButton:true,width:'500px',height:'200px',
                                                    button:[{id:"btn01",caption:this.lang.t("posItemsList.popItemEdit.popUnit.msgUnitFactorNotNumber.btn01"),location:'after'}],
                                                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("posItemsList.popItemEdit.popUnit.msgUnitFactorNotNumber.msg")}</div>)
                                                }
                                                await dialog(tmpConfObj);
                                                return;
                                            }

                                            if(this.editMode)

                                            {
                                                let tmpData = this.itemsObj.itemUnit.dt().where({GUID:this.editRow.GUID})
                                                if(tmpData.length > 0)
                                                {
                                                    tmpData[0].ID = this.cmbPopUnitName.value
                                                    tmpData[0].NAME = this.cmbPopUnitName.displayValue
                                                    tmpData[0].FACTOR = this.txtPopUnitFactor.value
                                                }
                                                this.popUnit.hide();
                                            }
                                            else
                                            {
                                                let tmpEmpty = {...this.itemsObj.itemUnit.empty};

                                                tmpEmpty.TYPE = 2
                                                tmpEmpty.TYPE_NAME = 'Condition'
                                                tmpEmpty.ID = this.cmbPopUnitName.value
                                                tmpEmpty.NAME = this.cmbPopUnitName.displayValue
                                                tmpEmpty.FACTOR = this.txtPopUnitFactor.value
                                                tmpEmpty.WEIGHT = 0
                                                tmpEmpty.VOLUME = 0
                                                tmpEmpty.WIDTH = 0
                                                tmpEmpty.HEIGHT = 0
                                                tmpEmpty.SIZE = 0
                                                tmpEmpty.ITEM_GUID = this.itemsObj.dt()[0].GUID 

                                                this.itemsObj.itemUnit.addEmpty(tmpEmpty); 
                                                this.popUnit.hide();
                                            }
                                        }}/>
                                    </div>
                                    <div className='col-6'>
                                        <NdButton text={this.lang.t("posItemsList.popItemEdit.popUnit.btnCancel")} type="normal" stylingMode="contained" width={'100%'}
                                        onClick={()=>
                                        {
                                            this.popUnit.hide();  
                                        }}/>
                                    </div>
                                </div>
                            </Item>
                        </Form>
                    </NdPopUp>
                </div>
                {/* Barkod Popup */}
                <div>
                    <NdPopUp id="popBarcode" parent={this} 
                    visible={false}
                    showCloseButton={true}
                    showTitle={true}
                    title={this.lang.t("posItemsList.popItemEdit.popBarcode.title")}
                    container={"#root"} 
                    width={"500"}
                    height={"270"}
                    position={{of:"#root"}}
                    >
                        <Form colCount={1} height={'fit-content'} id={"frmBarcode"}>
                            {/* txtPopBarcode */}
                            <Item>
                                <Label text={this.lang.t("posItemsList.popItemEdit.popBarcode.txtPopBarcode")} alignment="right" />
                                <NdTextBox id={"txtPopBarcode"} parent={this} simple={true} selectAll={false}
                                onFocusIn={()=>
                                {
                                    this.keyboardRef.show('txtPopBarcode')
                                    this.keyboardRef.inputName = "txtPopBarcode"
                                    this.keyboardRef.setInput(this.txtPopBarcode.value)
                                }}
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
                                button=
                                {[
                                    {
                                        id:'01',
                                        icon:'edit',
                                        onClick:async()=>
                                        {
                                            const tmpKeyboard = document.querySelector('.simple-keyboard');
                                            if(tmpKeyboard && !tmpKeyboard.contains(document.activeElement))
                                            {
                                                this.keyboardRef.hide()
                                            }
                                            else
                                            {
                                                this.keyboardRef.show('txtPopBarcode')
                                                this.keyboardRef.inputName = "txtPopBarcode"
                                                this.keyboardRef.setInput(this.txtPopBarcode.value)
                                            }
                                        }
                                    }
                                ]}>
                                </NdTextBox>
                            </Item>
                            {/* cmbPopBarUnitType */}
                            <Item>
                                <Label text={this.lang.t("posItemsList.popItemEdit.popBarcode.cmbPopBarUnitType")} alignment="right" />
                                <NdSelectBox simple={true} parent={this} id="cmbPopBarUnitType" displayExpr="NAME" valueExpr="GUID"/>
                            </Item>
                            {/* cmbPopBarType */}
                            <Item>
                                <Label text={this.lang.t("posItemsList.popItemEdit.popBarcode.cmbPopBarType")} alignment="right" />
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
                                        <NdButton text={this.lang.t("posItemsList.popItemEdit.popBarcode.btnSave")} type="normal" stylingMode="contained" width={'100%'}
                                        onClick={async (e)=>
                                        {
                                            if(this.txtPopBarcode.value == "")
                                            {
                                                let tmpConfObj =
                                                {
                                                    id:'msgBarcodeEmpty',showTitle:true,title:this.lang.t("posItemsList.popItemEdit.popBarcode.msgBarcodeEmpty.title"),showCloseButton:true,width:'500px',height:'200px',
                                                    button:[{id:"btn01",caption:this.lang.t("posItemsList.popItemEdit.popBarcode.msgBarcodeEmpty.btn01"),location:'after'}],
                                                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("posItemsList.popItemEdit.popBarcode.msgBarcodeEmpty.msg")}</div>)
                                                }
                                                await dialog(tmpConfObj);
                                                return;
                                            }

                                            let tmpChkBarDt = new datatable();                                        
                                            tmpChkBarDt.selectCmd =
                                            {

                                                query : `SELECT * FROM ITEM_BARCODE WHERE BARCODE = '${this.txtPopBarcode.value}'`
                                            }
                                            
                                            await tmpChkBarDt.refresh();

                                            if(tmpChkBarDt.length > 0 || this.itemsObj.itemBarcode.dt().where({BARCODE:this.txtPopBarcode.value}).length > 0)
                                            {
                                                let tmpConfObj =
                                                {
                                                    id:'msgBarcodeExist',showTitle:true,title:this.lang.t("posItemsList.popItemEdit.popBarcode.msgBarcodeExist.title"),showCloseButton:true,width:'500px',height:'200px',
                                                    button:[{id:"btn01",caption:this.lang.t("posItemsList.popItemEdit.popBarcode.msgBarcodeExist.btn01"),location:'after'}],
                                                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("posItemsList.popItemEdit.popBarcode.msgBarcodeExist.msg")}</div>)
                                                }
                                                await dialog(tmpConfObj);
                                                return;
                                            }

                                            if(this.editMode)
                                            {
                                                let tmpData = this.itemsObj.itemUnit.dt().where({GUID:this.editRow.GUID})
                                                if(tmpData.length > 0)
                                                {
                                                    tmpData[0].BARCODE = this.txtPopBarcode.value
                                                    tmpData[0].TYPE = this.cmbPopBarType.displayValue
                                                    tmpData[0].UNIT_GUID = this.cmbPopBarUnitType.value
                                                    tmpData[0].UNIT_NAME = this.cmbPopBarUnitType.displayValue
                                                }
                                                this.popBarcode.hide();
                                            }
                                            else
                                            {
                                                let tmpEmpty = {...this.itemsObj.itemBarcode.empty};

                                                tmpEmpty.BARCODE = this.txtPopBarcode.value
                                                tmpEmpty.TYPE = this.cmbPopBarType.value
                                                tmpEmpty.UNIT_GUID = this.cmbPopBarUnitType.value
                                                tmpEmpty.UNIT_NAME = this.cmbPopBarUnitType.displayValue
                                                tmpEmpty.ITEM_GUID = this.itemsObj.dt()[0].GUID 

                                                this.itemsObj.itemBarcode.addEmpty(tmpEmpty); 
                                                this.popBarcode.hide();
                                            }
                                        }}/>
                                    </div>
                                    <div className='col-6'>
                                        <NdButton text={this.lang.t("posItemsList.popItemEdit.popBarcode.btnCancel")} type="normal" stylingMode="contained" width={'100%'}
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
                {/* Item Group Popup */}
                <div>
                    <NdPopUp id="popAddItemGrp" parent={this}
                    visible={false}
                    showCloseButton={true}
                    showTitle={true}
                    title={this.lang.t("posItemsList.popItemEdit.popAddItemGrp.title")}
                    container={"#root"}
                    width={"500"}
                    height={"230"}
                    position={{of:"#root"}}
                    >
                        <Form colCount={1} height={'fit-content'} id={"frmAddItemGrp"}>
                            <Item>
                                <Label text={this.lang.t("posItemsList.popItemEdit.popAddItemGrp.txtAddItemGrpCode")} alignment="right" />
                                <NdTextBox simple={true} parent={this} id="txtAddItemGrpCode" selectAll={false}
                                onFocusIn={()=>
                                {
                                    this.keyboardRef.show('txtAddItemGrpCode')
                                    this.keyboardRef.inputName = "txtAddItemGrpCode"
                                    this.keyboardRef.setInput(this.txtAddItemGrpCode.value)
                                }}
                                button=
                                {[
                                    {
                                        id:'01',
                                        icon:'edit',
                                        onClick:async()=>
                                        {
                                            const tmpKeyboard = document.querySelector('.simple-keyboard');
                                            if(tmpKeyboard && !tmpKeyboard.contains(document.activeElement))
                                            {
                                                this.keyboardRef.hide()
                                            }
                                            else
                                            {
                                                this.keyboardRef.show('txtAddItemGrpCode')
                                                this.keyboardRef.inputName = "txtAddItemGrpCode"
                                                this.keyboardRef.setInput(this.txtAddItemGrpCode.value)
                                            }
                                        }
                                    },
                                    {
                                        id:'02',
                                        icon:'fa-solid fa-arrow-up-right-from-square',
                                        onClick:async()=>
                                        {
                                            this.grpListPopup.show();
                                            await this.getGrpList();
                                            this.keyboardRef.hide()
                                        }
                                    }
                                ]}/>
                            </Item>
                            <Item>
                                <Label text={this.lang.t("posItemsList.popItemEdit.popAddItemGrp.txtAddItemGrpName")} alignment="right" />
                                <NdTextBox simple={true} parent={this} id="txtAddItemGrpName" selectAll={false}
                                onFocusIn={()=>
                                {
                                    this.keyboardRef.show('txtAddItemGrpName')
                                    this.keyboardRef.inputName = "txtAddItemGrpName"
                                    this.keyboardRef.setInput(this.txtAddItemGrpName.value)
                                }}
                                button=
                                {[
                                    {
                                        id:'01',
                                        icon:'edit',
                                        onClick:async()=>
                                        {
                                            const tmpKeyboard = document.querySelector('.simple-keyboard');
                                            if(tmpKeyboard && !tmpKeyboard.contains(document.activeElement))
                                            {
                                                this.keyboardRef.hide()
                                            }
                                            else
                                            {
                                                this.keyboardRef.show('txtAddItemGrpName')
                                                this.keyboardRef.inputName = "txtAddItemGrpName"    
                                                this.keyboardRef.setInput(this.txtAddItemGrpName.value)
                                            }
                                        }
                                    }
                                ]}/>
                            </Item>
                            <Item>
                                <div className='row'>
                                    <div className='col-6'>
                                        <NdButton text={this.lang.t("posItemsList.popItemEdit.popAddItemGrp.btnSave")} type="normal" stylingMode="contained" width={'100%'}
                                        onClick={async (e)=>
                                        {
                                            if(this.txtAddItemGrpCode.value == "" || this.txtAddItemGrpName.value == "")
                                            {
                                                let tmpConfObj =
                                                {
                                                    id:'msgAddItemGrpEmpty',showTitle:true,title:this.lang.t("posItemsList.popItemEdit.popAddItemGrp.msgAddItemGrpEmpty.title"),showCloseButton:true,width:'500px',height:'200px',
                                                    button:[{id:"btn01",caption:this.lang.t("posItemsList.popItemEdit.popAddItemGrp.msgAddItemGrpEmpty.btn01"),location:'after'}],
                                                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("posItemsList.popItemEdit.popAddItemGrp.msgAddItemGrpEmpty.msg")}</div>)
                                                }
                                                await dialog(tmpConfObj);
                                                return;
                                            }

                                            let tmpMainGrpObj = new mainGroupCls();
                                            await tmpMainGrpObj.load({CODE:this.txtAddItemGrpCode.value});

                                            if(tmpMainGrpObj.dt().length > 0)
                                            {
                                                let tmpConfObj = 
                                                {
                                                    id:'msgAddItemGrpExist',showTitle:true,title:this.lang.t("posItemsList.popItemEdit.popAddItemGrp.msgAddItemGrpExist.title"),showCloseButton:true,width:'500px',height:'200px',
                                                    button:[{id:"btn01",caption:this.lang.t("posItemsList.popItemEdit.popAddItemGrp.msgAddItemGrpExist.btn01"),location:'after'}],
                                                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("posItemsList.popItemEdit.popAddItemGrp.msgAddItemGrpExist.msg")}</div>)
                                                }
                                                await dialog(tmpConfObj);
                                                return;
                                            }

                                            let tmpEmpty = {...tmpMainGrpObj.empty};
                                            tmpEmpty.CODE = this.txtAddItemGrpCode.value
                                            tmpEmpty.NAME = this.txtAddItemGrpName.value

                                            tmpMainGrpObj.addEmpty(tmpEmpty);
                                            await tmpMainGrpObj.save();

                                            let tmpMainGrpDt = new datatable();
                                            tmpMainGrpDt.selectCmd = 
                                            {
                                                query : `SELECT '' AS CODE,'' AS NAME, '00000000-0000-0000-0000-000000000000' AS GUID
                                                        UNION ALL SELECT CODE,NAME,GUID FROM ITEM_GROUP WHERE STATUS = 1 ORDER BY NAME ASC`
                                            }

                                            await tmpMainGrpDt.refresh();
                                            await this.popCmbItemGrp.dataRefresh({source:tmpMainGrpDt});

                                            this.popAddItemGrp.hide();
                                        }}/>
                                    </div>
                                    <div className='col-6'>
                                        <NdButton text={this.lang.t("posItemsList.popItemEdit.popAddItemGrp.btnCancel")} type="normal" stylingMode="contained" width={'100%'}
                                        onClick={()=>
                                        {
                                            this.popAddItemGrp.hide();  
                                        }}/>
                                    </div>
                                </div>
                            </Item>
                        </Form>
                    </NdPopUp>
                    {/* Grp List Popup */}
                    <div>
                        <NdPopUp id="grpListPopup" parent={this}
                        visible={false}
                        showCloseButton={true}
                        showTitle={true}
                        title={this.lang.t("posItemsList.popItemEdit.popAddItemGrp.grpListPopup.title")}
                        container={"#root"}
                        width={"800"}
                        height={"600"}
                        position={{of:"#root"}}
                        >
                            <Form colCount={1} height={'fit-content'} id={"frmGrpList"}>
                                <Item>
                                    <NdGrid parent={this} id={"grdGrpList"} 
                                    height={'500px'} 
                                    width={'100%'}
                                    dbApply={false}
                                    selection={{mode: 'single'}}
                                    onRowDblClick={async(e)=>
                                    {
                                        this.txtAddItemGrpCode.value = e.data.CODE
                                        this.txtAddItemGrpName.value = e.data.NAME
                                        this.grpListPopup.hide()
                                    }}
                                    onToolbarPreparing={(e)=>
                                    {
                                        e.toolbarOptions.items.unshift(
                                        {
                                            location: 'after',
                                            widget: 'dxButton',
                                            options: 
                                            {
                                                icon: 'trash',
                                                onClick: async () => 
                                                {
                                                    let tmpData = this.grdGrpList.getSelectedData();
                                                    if(tmpData.length > 0)
                                                    {
                                                        let tmpConfObj =
                                                        {
                                                            id:'msgGrpDelete',showTitle:true,title:this.lang.t("posItemsList.popItemEdit.popAddItemGrp.grpListPopup.msgGrpDelete.title"),showCloseButton:true,width:'500px',height:'200px',
                                                            button:[{id:"btn01",caption:this.lang.t("posItemsList.popItemEdit.popAddItemGrp.grpListPopup.msgGrpDelete.btn01"),location:'before'},{id:"btn02",caption:this.lang.t("posItemsList.popItemEdit.popAddItemGrp.grpListPopup.msgGrpDelete.btn02"),location:'after'}],
                                                            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("posItemsList.popItemEdit.popAddItemGrp.grpListPopup.msgGrpDelete.msg")}</div>)
                                                        }

                                                        let pResult = await dialog(tmpConfObj);

                                                        if(pResult == 'btn01')
                                                        {
                                                            let tmpQuery = 
                                                            {
                                                                query : "UPDATE ITEM_GROUP SET STATUS = 0 WHERE CODE = @CODE",
                                                                param : ['CODE:string|25'],
                                                                value : [tmpData[0].CODE]
                                                            }
                                                            await this.core.sql.execute(tmpQuery)
                                                            await this.getGrpList()
                                                        }
                                                        else if(pResult == 'btn02')
                                                        {
                                                            return;
                                                        }
                                                    }
                                                }
                                            }
                                        });
                                    }}
                                    >
                                        <Paging defaultPageSize={10} />
                                        <Column dataField="CODE" caption={this.lang.t("posItemsList.popItemEdit.popAddItemGrp.grpListPopup.grdGrpList.clmCode")} width={150}/>
                                        <Column dataField="NAME" caption={this.lang.t("posItemsList.popItemEdit.popAddItemGrp.grpListPopup.grdGrpList.clmName")}/>
                                    </NdGrid>
                                </Item>
                            </Form> 
                        </NdPopUp>
                    </div>  
                </div>
                <div>
                    <NbKeyboard id={"keyboardRef"} closeButton={true} parent={this} autoPosition={true} keyType={this.prmObj.filter({ID:'KeyType',TYPE:0,USERS:this.user.CODE}).getValue()}/>
                </div>
            </div>
        )
    }
}