import React from 'react';
import App from '../../../lib/app.js';
import moment from 'moment';

import Toolbar,{Item} from 'devextreme-react/toolbar';
import Form, { Label } from 'devextreme-react/form';
import ScrollView from 'devextreme-react/scroll-view';

import NdGrid,{Column, ColumnChooser,ColumnFixing,Paging,Pager,Scrolling,Export,Editing,StateStoring} from '../../../../core/react/devex/grid.js';
import NdTextBox from '../../../../core/react/devex/textbox.js'
import NdSelectBox from '../../../../core/react/devex/selectbox.js';
import NdDropDownBox from '../../../../core/react/devex/dropdownbox.js';
import NdListBox from '../../../../core/react/devex/listbox.js';
import NdButton from '../../../../core/react/devex/button.js';
import NdCheckBox from '../../../../core/react/devex/checkbox.js';
import NdTagBox from '../../../../core/react/devex/tagbox.js';
import { dialog } from '../../../../core/react/devex/dialog.js';
import DocBase from '../../../tools/DocBase.js';


export default class priceList extends DocBase
{
    constructor(props)
    {
        super(props)
        this.prmObj = this.param.filter({TYPE:1,USERS:this.user.CODE});
        this.core = App.instance.core;
        this.groupList = [];
        this._btnGetirClick = this._btnGetirClick.bind(this)
        this.saveState = this.saveState.bind(this)
        this.loadState = this.loadState.bind(this)
    }
    loadState() 
    {
        let tmpLoad = this.access.filter({ELEMENT:'grdPriceListe',USERS:this.user.CODE})
        return tmpLoad.getValue()
    }
    saveState(e)
    {
        let tmpSave = this.access.filter({ELEMENT:'grdPriceListe',USERS:this.user.CODE})
        tmpSave.setValue(e)
        tmpSave.save()
    }
    componentDidMount()
    {
    }
    async _btnGetirClick()
    {
        if(this.cmbPricingList.value == '')
        {
            App.instance.alert(this.lang.t("msgWarning"),"error")
            return;
        }
        let tmpSource =
        {
            source : 
            {
                select : 
                {
                    query : "SELECT * FROM ITEM_PRICE_VW_01 WHERE LIST_NO = @LIST_NO AND CUSTOMER_GUID = '00000000-0000-0000-0000-000000000000' AND TYPE = 0",
                    param : ['LIST_NO:int'],
                    value : [this.cmbPricingList.value]
                },
                sql : this.core.sql
            }
        }

        App.instance.setState({isExecute:true})
        await this.grdPriceListe.dataRefresh(tmpSource)
        App.instance.setState({isExecute:false})
        this.txtTotalCount.value = this.grdPriceListe.data.datatable.length
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
                                        icon: 'add',
                                        onClick: async () => 
                                        {
                                            App.instance.menuClick(
                                            {
                                                id: 'stk_03_002',
                                                text: this.lang.t('menuOff.stk_03_002'),
                                                path: 'items/lists/priceList.js',
                                            })
                                        }
                                    }    
                                } />
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
                        <div className="col-12">
                            <Form colCount={2} id="frmKriter">
                                <Item>
                                <Label text={this.t("cmbPricingList")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbPricingList" notRefresh={true}
                                    displayExpr = "NAME"
                                    valueExpr = "NO"
                                    value = ""
                                    searchEnabled = {true}
                                    data = {{source:{select:{query : "SELECT NO,NAME FROM ITEM_PRICE_LIST_VW_01 ORDER BY NO ASC"},sql:this.core.sql}}}
                                    param = {this.param.filter({ELEMENT:'cmbPricingList',USERS:this.user.CODE})}
                                    access = {this.access.filter({ELEMENT:'cmbPricingList',USERS:this.user.CODE})}

                                    >
                                    </NdSelectBox>
                                </Item>
                            </Form>
                        </div>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-3">
                        </div>
                        <div className="col-2">
                        </div>
                        <div className="col-2">
                        </div>
                        <div className="col-2">
                        </div>
                        <div className="col-3">
                            <NdButton text={this.t("btnGet")} type="success" width="100%" onClick={this._btnGetirClick}></NdButton>
                        </div>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <Form colCount={3} id="frmKriter">
                                <Item>
                                    <Label text={this.t("txtTotalCount")} alignment="right" />
                                    <NdTextBox id="txtTotalCount" parent={this} simple={true} readOnly={true}/>
                                </Item>
                            </Form>
                        </div>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <NdGrid id="grdPriceListe" parent={this} 
                            selection={{mode:"multiple"}} 
                            height={600}
                            showBorders={true}
                            filterRow={{visible:true}} 
                            headerFilter={{visible:true}}
                            columnAutoWidth={true}
                            allowColumnReordering={true}
                            allowColumnResizing={true}
                            loadPanel={{enabled:true}}
                            onRowDblClick={async(e)=>
                            {
                                App.instance.menuClick(
                                    {
                                        id: 'stk_01_001',
                                        text: e.data.ITEM_NAME.substring(0,10),
                                        path: 'items/cards/itemCard.js',
                                        pagePrm:{CODE:e.data.ITEM_CODE}
                            })
                            }}
                            >                                    
                                <StateStoring enabled={true} type="custom" customLoad={this.loadState} customSave={this.saveState} storageKey={this.props.data.id + "_grdPriceListe"}/>
                                <ColumnChooser enabled={true} />
                                <Paging defaultPageSize={10} />
                                <Pager visible={true} allowedPageSizes={[5,10,20,50,100]} showPageSizeSelector={true} />
                                <Scrolling mode="standart" />
                                <Editing mode="cell" allowUpdating={false} allowDeleting={false} confirmDelete={false}/>
                                <Export fileName={this.lang.t("menuOff.stk_03_001")} enabled={true} allowExportSelectedData={true} />
                                <Column dataField="LIST_NO" caption={this.t("grdPriceListe.clmListNo")} visible={true} width={80}/> 
                                <Column dataField="LIST_NAME" caption={this.t("grdPriceListe.clmListName")} visible={true} defaultSortOrder="asc" width={160}/> 
                                <Column dataField="ITEM_CODE" caption={this.t("grdPriceListe.clmItemCode")} visible={true} width={150}/> 
                                <Column dataField="ITEM_NAME" caption={this.t("grdPriceListe.clmItemName")} visible={true} /> 
                                <Column dataField="MAIN_GRP_NAME" caption={this.t("grdPriceListe.clmMainGrpName")} visible={true} width={150}/> 
                                <Column dataField="QUANTITY" caption={this.t("grdPriceListe.clmQuantity")} visible={true} width={80}/> 
                                <Column dataField="PRICE_HT" caption={this.t("grdPriceListe.clmPriceHt")} visible={true} format={{ style: "currency", currency: "EUR",precision: 2}} width={150}/> 
                                <Column dataField="PRICE_TTC" caption={this.t("grdPriceListe.clmPriceTtc")} visible={true} format={{ style: "currency", currency: "EUR",precision: 2}} width={150}/>                         
                            </NdGrid>
                        </div>
                    </div>
                </ScrollView>
            </div>
        )
    }
}