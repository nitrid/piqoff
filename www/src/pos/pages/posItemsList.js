import React from "react";
import App from "../lib/app.js";

import { dataset,datatable } from "../../core/core.js";
import {itemsCls} from "../../core/cls/items.js";

import NbButton from "../../core/react/bootstrap/button.js";
import NbKeyboard from "../../core/react/bootstrap/keyboard.js";
import NdTextBox from "../../core/react/devex/textbox.js";
import NdGrid,{Column,Editing,Paging,Scrolling} from "../../core/react/devex/grid.js";
import NdPopUp from "../../core/react/devex/popup.js";
import NdSelectBox from "../../core/react/devex/selectbox.js";
import NdNumberBox from "../../core/react/devex/numberbox.js";
import NdCheckBox from "../../core/react/devex/checkbox.js";
export default class posItemsList extends React.PureComponent
{
    constructor()
    {
        super()
        
        this.core = App.instance.core;
        this.lang = App.instance.lang;
        this.user = this.core.auth.data
        this.prmObj = App.instance.prmObj
        this.acsObj = App.instance.acsObj
        this.itemsObj = new itemsCls();
        this.itemListDt = new datatable()

        Number.money = this.prmObj.filter({ID:'MoneySymbol',TYPE:0}).getValue()
    }
    async componentDidMount()
    {
        await this.grdItemList.dataRefresh({source:this.itemListDt});
    }
    async getItems()
    {
        this.itemListDt.clear()
        this.itemListDt.selectCmd = 
        {
            query:`SELECT * FROM ITEMS_VW_01 WHERE CODE LIKE @VAL +'%' OR NAME LIKE @VAL +'%' OR @VAL = ''`,
            param:['VAL:string|25'],
            value:[this.txtItemSearch.value.replaceAll("*", "%")]
        }
        await this.itemListDt.refresh()
    }
    render()
    {
        return (
            <div style={{display:'flex',flexDirection:'column',height:'100%',backgroundColor:'#fff'}}>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0.5rem',borderBottom:'1px solid #dee2e6',backgroundColor:'#f8f9fa'}}>
                    <div style={{margin:0,fontWeight:'500',color:'#212529', textAlign:'center', flexGrow: 1}}>
                        <h3 style={{margin: 0}}>{this.lang.t("posSettings.posItemsList")}</h3>
                    </div>
                    <div style={{display:'flex',alignItems:'center',justifyContent:'flex-end'}}>
                        <button type="button" className="btn-close" onClick={() => App.instance.setPage('menu')}></button>
                    </div>
                </div>
                <div style={{flex:1,padding:'0.5rem',overflowY:'auto'}}>
                    <div className="row">
                        <div className="col-1 offset-11">
                            <NbButton id={"btnNewItem"} parent={this} className="form-group btn btn-primary btn-block" 
                            style={{height:"50px",width:"100%"}}
                            onClick={() => 
                            {
                                this.popItemEdit.show()
                            }}>
                                <i className="fa-regular fa-file" style={{fontSize:'20px'}}></i>
                            </NbButton>
                        </div>
                    </div>
                    <div className="row pt-2">
                        <div className="col-10">
                            <NdTextBox id="txtItemSearch" 
                                parent={this} 
                                simple={true} 
                                placeholder={this.lang.t("posItemsList.txtItemSearchPholder")}
                                selectAll={false}
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
                            onRowDblClick={(e)=>
                            {
                                this.popItemEdit.show()
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
                    <NdPopUp id="popItemEdit" parent={this} title={this.lang.t("posItemsList.popItemEdit.title")} width={"100%"} height={"100%"}
                    style={{zIndex:'1000px'}}
                    showCloseButton={true}
                    showTitle={true}
                    >
                        <div className="row">
                            <div className="col-6">
                                <div className="row py-1">
                                    <div className='col-4 p-0 pe-1'>
                                        <label className="col-form-label d-flex justify-content-end">{this.lang.t("posItemsList.popItemEdit.txtRef") + " :"}</label>
                                    </div>
                                    <div className="col-8 p-0">
                                        <NdTextBox id="popTxtRef" parent={this} dt={{data:this.itemsObj.dt('ITEMS'),field:"CODE"}} simple={true}
                                        upper={true}
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
                                            let tmpResult = await this.checkItem(this.popTxtRef.value)
                                            if(tmpResult == 3)
                                            {
                                                this.popTxtRef.value = "";
                                            }
                                        }).bind(this)}
                                        selectAll={false}                        
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
                                    <div className='col-4 p-0 pe-1'>
                                        <label className="col-form-label d-flex justify-content-end">{this.lang.t("posItemsList.popItemEdit.cmbItemGrp") + " :"}</label>
                                    </div>
                                    <div className="col-8 p-0 pe-3">
                                        <NdSelectBox parent={this} id="popCmbItemGrp" tabIndex={this.tabIndex} simple={true}
                                        dt={{data:this.itemsObj.dt('ITEMS'),field:"MAIN_GUID",display:"MAIN_GRP_NAME"}}
                                        displayExpr="NAME"                 
                                        valueExpr="GUID"
                                        value=""
                                        searchEnabled={true} 
                                        showClearButton={true}
                                        pageSize ={50}
                                        notRefresh={true}
                                        data={{source:{select:{query : "SELECT CODE,NAME,GUID FROM ITEM_GROUP WHERE STATUS = 1 ORDER BY NAME ASC"},sql:this.core.sql}}}
                                        />
                                    </div>
                                </div>
                                <div className="row py-1">
                                    <div className='col-4 p-0 pe-1'>
                                        <label className="col-form-label d-flex justify-content-end">{this.lang.t("posItemsList.popItemEdit.cmbTax") + " :"}</label>
                                    </div>
                                    <div className="col-8 p-0 pe-3">
                                        <NdSelectBox parent={this} id="popCmbTax" height='fit-content' dt={{data:this.itemsObj.dt('ITEMS'),field:"VAT"}} simple={true}
                                        displayExpr="VAT"                       
                                        valueExpr="VAT"
                                        data={{source:{select:{query:"SELECT VAT FROM VAT ORDER BY ID ASC"},sql:this.core.sql}}}
                                        />
                                    </div>
                                </div>
                                <div className="row py-1">
                                    <div className='col-4 p-0 pe-1'>
                                        <label className="col-form-label d-flex justify-content-end">{this.lang.t("posItemsList.popItemEdit.cmbOrigin") + " :"}</label>
                                    </div>
                                    <div className="col-8 p-0 pe-3">
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
                            <div className="col-2">
                                <div className="row pe-3">
                                    <div className='col-10 p-0 pe-1'>
                                        <label className="col-form-label d-flex justify-content-end">{this.lang.t("posItemsList.popItemEdit.chkLineMerged") + " :"}</label>
                                    </div>
                                    <div className="col-2 p-0 d-flex align-items-center">
                                        <NdCheckBox id="popChkLineMerged" parent={this} defaultValue={false} dt={{data:this.itemsObj.dt('ITEMS'),field:"SALE_JOIN_LINE"}}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </NdPopUp>
                </div>
                <div>
                    <NbKeyboard id={"keyboardRef"} parent={this} autoPosition={true} keyType={this.prmObj.filter({ID:'KeyType',TYPE:0,USERS:this.user.CODE}).getValue()}/>
                </div>
            </div>
        )
    }
}