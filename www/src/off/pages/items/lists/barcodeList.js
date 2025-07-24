import React from 'react';
import App from '../../../lib/app.js';

import Toolbar,{ Item } from 'devextreme-react/toolbar';
import ScrollView from 'devextreme-react/scroll-view';

import NdGrid,{Column,Paging,Pager,Scrolling,Export} from '../../../../core/react/devex/grid.js';
import NdTextBox from '../../../../core/react/devex/textbox.js'
import NdSelectBox from '../../../../core/react/devex/selectbox.js';
import NdButton from '../../../../core/react/devex/button.js';
import { dialog } from '../../../../core/react/devex/dialog.js';
import { NdForm, NdItem, NdLabel, NdEmptyItem } from '../../../../core/react/devex/form.js';
export default class barcodeList extends React.PureComponent
{
    constructor(props)
    {
        super(props)
        
        this.core = App.instance.core;
        
        this.btnGetirClick = this.btnGetirClick.bind(this)
    }
    async btnGetirClick()
    {
        let tmpSource =
        {
            source : 
            {
                groupBy : this.groupList,
                select : 
                {
                    query : `SELECT * FROM ITEM_BARCODE_VW_01 WHERE ((ITEM_NAME like @ITEM_NAME + '%') OR (@ITEM_NAME = '')) AND 
                            ((MAIN_GRP = @MAIN_GRP) OR (@MAIN_GRP = ''))`,
                    param : ['ITEM_NAME:string|250','MAIN_GRP:string|25'],
                    value : [this.txtUrunAdi.value,this.cmbUrunGrup.value]
                },
                sql : this.core.sql
            }
        }
        App.instance.loading.show()
        await this.grdListe.dataRefresh(tmpSource)
        App.instance.loading.hide()
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
                                                id: 'stk_01_002',
                                                text: 'Barcode Tanımları',
                                                path: 'items/cards/barcodeCard.js'
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
                            <NdForm colCount={2} id="frmKriter">
                                <NdItem>
                                    <NdLabel text={this.t("txtItemName")} alignment="right" />
                                    <NdTextBox id="txtUrunAdi" parent={this} simple={true} upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value} />
                                </NdItem>
                                <NdItem>
                                    <NdLabel text={this.t("cmbMainGrp")} alignment="right" />
                                        <NdSelectBox simple={true} parent={this} id="cmbUrunGrup" showClearButton={true} notRefresh={true}  searchEnabled={true}
                                        displayExpr="NAME"                       
                                        valueExpr="CODE"
                                        data={{source: {select : {query:"SELECT CODE,NAME FROM ITEM_GROUP ORDER BY NAME ASC"},sql : this.core.sql}}}
                                        />
                                </NdItem>
                                <NdEmptyItem/>
                            </NdForm>
                        </div>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-3 offset-9">
                            <NdButton text={this.t("btnGet")} type="success" width="100%" onClick={this.btnGetirClick}></NdButton>
                        </div>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <NdGrid id="grdListe" parent={this} 
                            selection={{mode:"multiple"}} 
                            height={600}
                            showBorders={true}
                            filterRow={{visible:true}} 
                            headerFilter={{visible:true}}
                            columnAutoWidth={true}
                            allowColumnReordering={true}
                            allowColumnResizing={true}
                            loadPanel={{enabled:true}}
                            >                            
                                {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Paging defaultPageSize={20} /> : <Paging enabled={false} />}
                                {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Pager visible={true} allowedPageSizes={[5,10,50]} showPageSizeSelector={true} /> : <Paging enabled={false} />}
                                {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Scrolling mode="standart" /> : <Scrolling mode="infinite" />}
                                <Export fileName={this.lang.t("menuOff.stk_03_003")} enabled={true} allowExportSelectedData={true} />
                                <Column dataField="ITEM_CODE" caption={this.t("grdListe.clmCode")} visible={true}/> 
                                <Column dataField="ITEM_NAME" caption={this.t("grdListe.clmName")} visible={true} defaultSortOrder="asc"/> 
                                <Column dataField="BARCODE" caption={this.t("grdListe.clmBarcode")} visible={true}/> 
                                <Column dataField="UNIT_NAME" caption={this.t("grdListe.clmUnit")} visible={true}/> 
                                <Column dataField="MAIN_GRP_NAME" caption={this.t("grdListe.clmMainGrp")} visible={true}/> 
                            </NdGrid>
                        </div>
                    </div>
                </ScrollView>
            </div>
        )
    }
}