import React from 'react';
import App from '../../../lib/app.js';
import {editItemCls} from '../../../../core/cls/items.js'

import ScrollView from 'devextreme-react/scroll-view';
import Toolbar from 'devextreme-react/toolbar';
import Form, { Label,Item,EmptyItem } from 'devextreme-react/form';

import NdTextBox, { Validator, StringLengthRule } from '../../../../core/react/devex/textbox.js'
import NdSelectBox from '../../../../core/react/devex/selectbox.js';
import NdGrid,{Column,Editing,Paging,Pager,Export} from '../../../../core/react/devex/grid.js';
import NdButton from '../../../../core/react/devex/button.js';
import NdTagBox from '../../../../core/react/devex/tagbox.js';
import { dialog } from '../../../../core/react/devex/dialog.js';
import { NdForm, NdItem, NdLabel } from '../../../../core/react/devex/form.js';
import { NdToast } from '../../../../core/react/devex/toast.js';
export default class collectiveItemEdit extends React.PureComponent
{
    constructor(props)
    {
        super(props)

        this.core = App.instance.core;
        this.prmObj = this.param.filter({TYPE:1,USERS:this.user.CODE});
        this.acsobj = this.access.filter({TYPE:1,USERS:this.user.CODE});
        this.editObj = new editItemCls();

        this.cellRoleRender = this.cellRoleRender.bind(this)
        this.btnGetClick = this.btnGetClick.bind(this)
    }
    async componentDidMount()
    {
        await this.core.util.waitUntil(0)
        this.init()
    }
    async init()
    {
        this.editObj.clearAll()
        await this.grdItemList.dataRefresh({source:this.editObj.dt('ITEM_EDIT')});
    }
    async btnGetClick()
    {
        if(this.txtName.value != '' && this.txtName.value.slice(-1) != '*')
        {
            let txtName = this.txtName.value + '*'
            this.txtName.setState({value:txtName})
        }
        
        let tmpSrc = ""
        if(this.txtCode.value.length == 1)
        {
            tmpSrc = "((CODE LIKE '" + this.txtCode.value[0] + "' + '%') OR (BARCODE LIKE '" + this.txtCode.value[0] + "' + '%') OR (MULTICODE LIKE '" + this.txtCode.value[0] + "' + '%')) AND"
        }
        else if(this.txtCode.value.length > 1 )
        {
            let TmpVal = ''
            for (let i = 0; i < this.txtCode.value.length; i++) 
            {
                TmpVal = TmpVal + ",'" + this.txtCode.value[i] + "'"
                
            }
            tmpSrc = "((CODE IN (" + TmpVal.substring(1,TmpVal.length) + ")) OR (BARCODE IN (" + TmpVal.substring(1,TmpVal.length) + ")) OR (MULTICODE IN (" + TmpVal.substring(1,TmpVal.length) + "))) AND"
        }

        App.instance.loading.show()
        await this.editObj.load({NAME:this.txtName.value.replaceAll("*", "%"),MAIN_GRP:this.cmbItemGroup.value,CUSTOMER_CODE:this.cmbTedarikci.value,QUERY:tmpSrc})
        App.instance.loading.hide()

        this.netMargin()
        this.grossMargin()
    }
    cellRoleRender(e)
    {
        if(e.column.dataField == 'ORGINS')
        {
            let onValueChanged = function(data)
            {
                e.setValue(data.value)
            }
            return (
                <NdSelectBox simple={true} parent={this} id="cmbOrigin"
                displayExpr="NAME"                       
                valueExpr="CODE"
                notRefresh = {true}
                value="0"
                searchEnabled={true} pageSize ={50} showClearButton={true}
                onValueChanged={onValueChanged}
                data={{source:{select:{query : "SELECT CODE,NAME FROM COUNTRY ORDER BY CODE ASC"},sql:this.core.sql}}}
                />
            )
        }
        else if(e.column.dataField == 'VAT')
        {
            let onValueChanged = function(data)
            {
                e.setValue(data.value)
            }
            return (
                <NdSelectBox simple={true} parent={this} id="clmVat"
                displayExpr="VAT"                       
                valueExpr="VAT"
                notRefresh = {true}
                value="0"
                searchEnabled={true} pageSize ={50} showClearButton={true}
                onValueChanged={onValueChanged}
                data={{source:{select:{query : "SELECT VAT FROM VAT ORDER BY ID ASC"},sql:this.core.sql}}}
                />
            ) 
        }
        else if(e.column.dataField == 'UNDER_UNIT_NAME')
        {
            let onValueChanged = function(data)
            {
                e.setValue(data.value)
            }
            return (
                <NdSelectBox simple={true} parent={this} id="clmUnit"
                displayExpr="SYMBOL"                       
                valueExpr="SYMBOL"
                notRefresh = {true}
                value="0"
                searchEnabled={true} pageSize ={50} showClearButton={true}
                onValueChanged={onValueChanged}
                data={{source:{select:{query : "SELECT SYMBOL FROM UNIT ORDER BY ID"},sql:this.core.sql}}}
                />
            ) 
        }
        else if(e.column.dataField == 'CUSTOMS')
        {
            let onValueChanged = function(data)
            {
                e.setValue(data)
            }
            return (
                <NdTextBox id={"txtCustoms"+e.rowIndex} parent={this} simple={true} tabIndex={this.tabIndex}
                upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value} 
                onValueChanged={async (v)=>
                {
                    const punctuationKeyCodes = [' ','.',',', ';', ':', '/', '?', '%', ']', '[', '{', '}','\n'];

                    if (punctuationKeyCodes.includes(v.event.key)) 
                    {
                        this["txtCustoms"+e.rowIndex].value = v.previousValue
                    }
                    
                    onValueChanged(this["txtCustoms"+e.rowIndex].value)
                }}
                >     
                    <Validator validationGroup={"frmItems" + this.tabIndex}>
                        <StringLengthRule message={this.t("validOriginMax8")} max={8} min={8} ignoreEmptyValue={true}/>
                    </Validator>
                </NdTextBox>      
            )
        }
    }
    async grossMargin()
    {
        for (let i = 0; i < this.editObj.dt().length; i++) 
        {
            let tmpExVat = this.editObj.dt()[i].PRICE_SALE / ((this.editObj.dt()[i].VAT / 100) + 1)
            let tmpMargin = tmpExVat - this.editObj.dt()[i].CUSTOMER_PRICE;
            let tmpMarginRate = ((tmpExVat - this.editObj.dt()[i].CUSTOMER_PRICE) / tmpExVat) * 100
            this.editObj.dt()[i].GROSS_MARGIN = tmpMargin.toFixed(2) + Number.money.sign + " / %" +  tmpMarginRate.toFixed(2);        
            this.editObj.dt()[i].GROSS_MARGIN_RATE = tmpMarginRate.toFixed(2);  
            this.editObj.dt()[i].MARGIN =  Number((tmpMargin / Number(this.editObj.dt()[i].PRICE_SALE).rateInNum(this.editObj.dt()[i].VAT,3)) * 100).round(2)
        }
        await this.grdItemList.dataRefresh({source:this.editObj.dt()});
    }
    async netMargin()
    {
        for (let i = 0; i < this.editObj.dt().length; i++) 
        {
            let tmpExVat = this.editObj.dt()[i].PRICE_SALE / ((this.editObj.dt()[i].VAT / 100) + 1)
            let tmpMargin = (tmpExVat -this.editObj.dt()[i].CUSTOMER_PRICE) / 1.12;
            let tmpMarginRate = (((tmpExVat - this.editObj.dt()[i].CUSTOMER_PRICE) / 1.12) / tmpExVat) * 100
            this.editObj.dt()[i].NET_MARGIN = tmpMargin.toFixed(2) + Number.money.sign + " / %" +  tmpMarginRate.toFixed(2);
            this.editObj.dt()[i].NET_MARGIN_RATE = tmpMarginRate.toFixed(2);    
        }
        await this.grdItemList.dataRefresh({source:this.editObj.dt()});
    }   
    render()
    {
        return(
            <div>
                <ScrollView>
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <Toolbar>
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
                                                id:'msgClose',showTitle:true,title:this.lang.t("msgWarning"),showCloseButton:true,width:'500px',height:'auto',
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
                        <div className="col-12">
                            <NdForm colCount={2} id="frmCriter">
                                {/* txtCode */}
                                <NdItem>
                                    <NdLabel text={this.t("txtCode")} alignment="right" />
                                    <NdTagBox id="txtCode" parent={this} simple={true} value={[]} placeholder={this.t("codePlaceHolder")}/>
                                </NdItem>
                                <NdItem>
                                    <NdLabel text={this.t("txtCustomerCode")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbTedarikci" showClearButton={true} notRefresh={true}  searchEnabled={true} 
                                    displayExpr="TITLE"                       
                                    valueExpr="CODE"
                                    data={{source: {select : {query:"SELECT CODE,TITLE FROM CUSTOMER_VW_01 WHERE GENUS IN(1,2) ORDER BY TITLE ASC"},sql : this.core.sql}}}
                                    />
                                </NdItem>
                                {/* txtName */}
                                <NdItem>
                                    <NdLabel text={this.t("txtName")} alignment="right" />
                                    <NdTextBox id="txtName" parent={this} simple={true}  placeholder={this.t("namePlaceHolder")} onEnterKey={this.btnGetClick}
                                    param={this.param.filter({ELEMENT:'txtName',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'txtName',USERS:this.user.CODE})}
                                    />
                                </NdItem>
                                 {/* cmbItemGroup */}
                                 <NdItem>
                                    <NdLabel text={this.t("cmbItemGroup")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbItemGroup"
                                    displayExpr="NAME"                       
                                    valueExpr="CODE"
                                    value=""
                                    showClearButton={true}
                                    searchEnabled={true}
                                    notRefresh = {true}
                                    data={{source:{select:{query : "SELECT CODE,NAME FROM ITEM_GROUP ORDER BY NAME ASC"},sql:this.core.sql}}}
                                    param={this.param.filter({ELEMENT:'cmbItemGroup',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'cmbItemGroup',USERS:this.user.CODE})}
                                    button=
                                    {
                                        [
                                            {
                                                id:'02',
                                                icon:'clear',
                                                onClick:()=>
                                                {
                                                    this.cmbItemGroup.valueExpr =''
                                                }
                                            },
                                        ]
                                    }
                                    />
                                </NdItem>
                            </NdForm>
                        </div>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-3 offset-9">
                            <NdButton text={this.t("btnGet")} type="success" width="100%" onClick={this.btnGetClick}></NdButton>
                        </div>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <NdGrid id="grdItemList" parent={this} 
                            showBorders={true}
                            filterRow={{visible:true}} 
                            columnAutoWidth={true}
                            allowColumnReordering={false}
                            allowColumnResizing={true}
                            loadPanel={{enabled:true}}
                            height={'100%'} 
                            width={'100%'}
                            dbApply={false}
                            selection={{mode:"single"}}
                            onRowClick={async(e)=>
                            {
                                let tmpIndexes = []
                                for (let i = 0; i <this.editObj.dt().length; i++) 
                                {
                                    if(this.editObj.dt()[i].CODE == e.data.CODE)
                                    {
                                        tmpIndexes.push(this.grdItemList.devGrid.getRowIndexByKey(this.editObj.dt()[i]))
                                    }
                                }
                                this.grdItemList.devGrid.selectRowsByIndexes(tmpIndexes)
                            }}
                            onSaving={async(e)=>
                            {
                                App.instance.loading.show()
                            }}
                            onSaved={async(e)=>
                            {
                                App.instance.loading.show()
                                
                                
                                if(await this.editObj.save() == 0)
                                {                                                    
                                    App.instance.loading.hide()
                                    this.toast.show({message:this.t("msgSaveResult.msgSuccess"),type:"success"})
                                }
                                else
                                {
                                    App.instance.loading.hide()
                                    let tmpConfObj1 =
                                    {
                                        id:'msgSaveResult',showTitle:true,title:this.t("msgSave.title"),showCloseButton:true,width:'500px',height:'auto',
                                        button:[{id:"btn01",caption:this.t("msgSave.btn01"),location:'after'}],
                                        content: (<div style={{textAlign:"center",fontSize:"20px",color:"red"}}>{this.t("msgSaveResult.msgFailed")}</div>)
                                    }
                                    await dialog(tmpConfObj1);
                                }
                            }}
                            onCellPrepared={(e) =>
                            {
                                if(e.rowType === "data" && e.column.dataField === "GROSS_MARGIN")
                                {
                                    e.cellElement.style.color = e.data.GROSS_MARGIN_RATE < 30 ? "red" : "blue";
                                }

                                if(e.rowType === "data" && e.column.dataField === "NET_MARGIN")
                                {
                                    e.cellElement.style.color = e.data.NET_MARGIN_RATE < 30 ? "red" : "blue";
                                }

                                if(e.rowType === "data" && e.column.dataField === "PRICE_SALE")
                                {
                                    //GROSS_MARGIN ANINDA ETKI ETSİN DİYE YAPILDI
                                    let tmpExVat = e.data.PRICE_SALE / ((e.data.VAT / 100) + 1)
                                    let tmpMargin = e.data.CUSTOMER_PRICE == 0 || tmpExVat == 0 ? 0 : tmpExVat - e.data.CUSTOMER_PRICE;
                                    let tmpMarginRate = tmpMargin == 0 ? 0 : (tmpMargin /  e.data.CUSTOMER_PRICE) * 100   //((tmpExVat - e.data.CUSTOMER_PRICE)/tmpExVat) * 100
                                    e.data.GROSS_MARGIN =  tmpMarginRate.toFixed(2) + "% / " + Number.money.sign + tmpMargin.toFixed(2);        
                                    e.data.GROSS_MARGIN_RATE = tmpMarginRate.toFixed(2); 
                                    e.values[8] = tmpMarginRate.toFixed(2) + "% / " + Number.money.sign + tmpMargin.toFixed(2); 
                                    e.values[10] =  Number(tmpMargin / Number(tmpExVat) * 100).round(2)

                                    // NET_MARGIN ANINDA ETKI ETSİN DİYE YAPILDI
                                    let tmpNetExVat = e.data.PRICE_SALE / ((e.data.VAT / 100) + 1)
                                    let tmpNetMargin = tmpNetExVat == 0 || e.data.CUSTOMER_PRICE == 0 ? 0 : (tmpNetExVat - e.data.CUSTOMER_PRICE) / 1.15;
                                    let tmpNetMarginRate = tmpNetMargin == 0 ? 0 : (tmpNetMargin / e.data.CUSTOMER_PRICE) * 100
                                    e.data.NET_MARGIN = tmpNetMargin.toFixed(2) + Number.money.sign + " / %" +  tmpNetMarginRate.toFixed(2);
                                    e.data.NET_MARGIN_RATE = tmpNetMarginRate.toFixed(2);    
                                    e.values[9] =   tmpNetMargin.toFixed(2) + Number.money.sign + "  %" +  tmpNetMarginRate.toFixed(2);
                                }
                            }}
                            >                            
                                <Paging defaultPageSize={14} />
                                <Pager visible={true} allowedPageSizes={[5,10,50]} showPageSizeSelector={true} />
                                <Editing mode="batch" allowUpdating={true} allowDeleting={false} confirmDelete={false}/>
                                <Export fileName={this.lang.t("menuOff.stk_04_001")} enabled={true} allowExportSelectedData={true} />
                                <Column dataField="CODE" caption={this.t("grdItemList.clmCode")} visible={true} width={110} allowEditing={false}/> 
                                <Column dataField="BARCODE" caption={this.t("grdItemList.clmBarcode")} visible={true} width={130} allowEditing={false}/> 
                                <Column dataField="NAME" caption={this.t("grdItemList.clmName")} visible={true} width={320} defaultSortOrder="asc"  /> 
                                <Column dataField="CUSTOMER_NAME" caption={this.t("grdItemList.clmCustomerName")} visible={true}  width={110} allowEditing={false}/> 
                                <Column dataField="MULTICODE" caption={this.t("grdItemList.clmMulticode")} visible={true} width={110}/> 
                                <Column dataField="CUSTOMER_PRICE" caption={this.t("grdItemList.clmCustomerPrice")} visible={true} width={75}/> 
                                <Column dataField="MAIN_UNIT_NAME" caption={this.t("grdItemList.clmMainUnit")} visible={false} width={100} allowEditing={false}/> 
                                <Column dataField="PRICE_SALE" caption={this.t("grdItemList.clmPriceSale")} visible={true} width={75} /> 
                                <Column dataField="ORGINS" caption={this.t("grdItemList.clmOrgins")} visible={true} width={130} editCellRender={this.cellRoleRender}/> 
                                <Column dataField="GROSS_MARGIN" caption={this.t("grdItemList.clmGrossMargin")} visible={true} width={75} allowEditing={false}/> 
                                <Column dataField="NET_MARGIN" caption={this.t("grdItemList.clmNetMargin")} visible={true} width={75} allowEditing={false}/> 
                                <Column dataField="MARGIN" caption={this.t("grdItemList.clmMargin")} visible={true} width={75} allowEditing={false}/>
                                <Column dataField="CUSTOMS" caption={this.t("grdItemList.clmCustoms")} visible={true} width={75} editCellRender={this.cellRoleRender}>
                                    <StringLengthRule message={this.t("validOriginMax8")} max={8} min={8} ignoreEmptyValue={true}/>    
                                </Column>   
                                <Column dataField="UNDER_UNIT_NAME" caption={this.t("grdItemList.clmUnderUnit")} visible={true} width={100}  editCellRender={this.cellRoleRender}/> 
                                <Column dataField="UNDER_FACTOR" caption={this.t("grdItemList.clmUnderFactor")} visible={true} width={70}/> 
                                <Column dataField="VAT" caption={this.t("grdItemList.clmVat")} visible={true} width={110} editCellRender={this.cellRoleRender}/>    
                                <Column dataField="WEIGHING" caption={this.t("grdItemList.clmWeighing")} visible={true} width={70}/>  
                                <Column dataField="STATUS" caption={this.t("grdItemList.clmStatus")} visible={true} width={50}/>    
                            </NdGrid>
                        </div>
                    </div>
                    <NdToast id={"toast"} parent={this} displayTime={2000} position={{at:"top center",offset:'0px 110px'}}/>
                </ScrollView>
            </div>
        )
    }
}