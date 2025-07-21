import React from 'react';
import App from '../../../lib/app.js';

import Toolbar,{ Item } from 'devextreme-react/toolbar';
import ScrollView from 'devextreme-react/scroll-view';

import NdGrid,{Column, Paging, Pager, Scrolling, Export} from '../../../../core/react/devex/grid.js';
import NdTextBox from '../../../../core/react/devex/textbox.js'
import NdSelectBox from '../../../../core/react/devex/selectbox.js';
import { dialog } from '../../../../core/react/devex/dialog.js';
import { NdForm, NdItem, NdLabel, NdEmptyItem } from '../../../../core/react/devex/form.js';
import NdButton from '../../../../core/react/devex/button.js';
import NdCheckBox from '../../../../core/react/devex/checkbox.js';

export default class QuantityList extends React.PureComponent
{
    constructor(props)
    {
        super(props)
        
        this.core = App.instance.core;
        this.btnGetirClick = this.btnGetirClick.bind(this)
    }
    async btnGetirClick()
    {
        if(this.chkZeroQuantity.value == true)
        {
            let tmpSource =
            {
                source : 
                {
                    select : 
                    {
                        query : `SELECT NAME,CODE,UNIT_NAME,
                                ISNULL((SELECT TOP 1 BARCODE FROM ITEM_BARCODE WHERE ITEM_BARCODE.ITEM = ITEMS_VW_01.GUID ORDER BY LDATE DESC),'') AS BARCODE,
                                [dbo].[FN_DEPOT_QUANTITY](GUID,@DEPOT,dbo.GETDATE()) AS QUANTITY FROM ITEMS_VW_01 
                                WHERE ((NAME like @NAME + '%') OR (@NAME = ''))`,
                        param : ['NAME:string|250','DEPOT:string|50'],
                        value : [this.txtUrunAdi.value,this.cmbDepot.value]
                    },
                    sql : this.core.sql
                }
            }

            App.instance.loading.show()
            await this.grdListe.dataRefresh(tmpSource)
            App.instance.loading.hide()
        }
        else
        {
            let tmpSource =
            {
                source : 
                {
                    select : 
                    {
                        query : `SELECT NAME,CODE,ISNULL((SELECT TOP 1 NAME FROM ITEM_UNIT_VW_01 WHERE ITEM_UNIT_VW_01.ITEM_GUID = ITEMS_VW_01.GUID AND ID = @UNIT_ID),UNIT_NAME) AS UNIT_NAME,ISNULL((SELECT TOP 1 BARCODE FROM ITEM_BARCODE WHERE ITEM_BARCODE.ITEM = ITEMS_VW_01.GUID ORDER BY LDATE DESC),'') AS BARCODE,([dbo].[FN_DEPOT_QUANTITY](GUID,@DEPOT,dbo.GETDATE())/ ISNULL((SELECT TOP 1 FACTOR FROM ITEM_UNIT_VW_01 WHERE ITEM_UNIT_VW_01.ITEM_GUID = ITEMS_VW_01.GUID AND ID = @UNIT_ID),1))  AS QUANTITY FROM ITEMS_VW_01 
                                WHERE [dbo].[FN_DEPOT_QUANTITY](GUID,@DEPOT,dbo.GETDATE()) <> 0 AND 
                                ((NAME like @NAME + '%') OR (@NAME = ''))`,
                        param : ['NAME:string|250','DEPOT:string|50','UNIT_ID:string|50'],
                        value : [this.txtUrunAdi.value,this.cmbDepot.value,this.sysParam.filter({ID:'secondFactor',USERS:this.user.CODE}).getValue().value]
                    },
                    sql : this.core.sql
                }
            }

            await this.grdListe.dataRefresh(tmpSource)
        }

        let tmpQuantity = this.grdListe.data.datatable.sum("QUANTITY",2)
        this.txtTotalQuantity.setState({value:tmpQuantity})
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
                                                id: 'stk_01_001',
                                                text: 'Stok Tanımları',
                                                path: 'items/cards/itemCard.js'
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
                                    <NdTextBox id="txtUrunAdi" parent={this} simple={true} placeholder={this.t("ItemNamePlaceHolder")}
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}/>
                                </NdItem>
                                <NdEmptyItem />
                                <NdItem>
                                    <NdLabel text={this.t("cmbDepot")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbDepot" showClearButton={true} notRefresh={true} searchEnabled={true}
                                    displayExpr="NAME"                       
                                    valueExpr="GUID"
                                    value="1A428DFC-48A9-4AC6-AF20-4D0A4D33F316"
                                    param={this.param.filter({ELEMENT:'cmbDepot',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'cmbDepot',USERS:this.user.CODE})}
                                    data={{source: {select : {query:"SELECT GUID,CODE,NAME FROM DEPOT ORDER BY CODE ASC"},sql : this.core.sql}}}
                                    />
                                </NdItem>
                            </NdForm>
                        </div>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-3 offset-6">
                            <NdCheckBox id="chkZeroQuantity" parent={this} text={this.t("chkZeroQuantity")}  value={false} ></NdCheckBox>
                        </div>
                        <div className="col-3">
                            <NdButton text={this.t("btnGet")} type="success" width="100%" onClick={this.btnGetirClick}></NdButton>
                        </div>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <NdGrid id="grdListe" parent={this} 
                            selection={{mode:"multiple"}} 
                            showBorders={true}
                            filterRow={{visible:true}} 
                            headerFilter={{visible:true}}
                            height={'690'} 
                            width={'100%'}
                            columnAutoWidth={true}
                            allowColumnReordering={true}
                            allowColumnResizing={true}
                            loadPanel={{enabled:true}}
                            >                            
                                {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Paging defaultPageSize={20} /> : <Paging enabled={false} />}
                                {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Pager visible={true} allowedPageSizes={[5,10,50]} showPageSizeSelector={true} /> : <Paging enabled={false} />}
                                {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Scrolling mode="standart" /> : <Scrolling mode="virtual" />}
                                <Export fileName={this.lang.t("menuOff.stk_03_006")} enabled={true} allowExportSelectedData={true} />
                                <Column dataField="NAME" caption={this.t("grdListe.clmName")} visible={true}/> 
                                <Column dataField="CODE" caption={this.t("grdListe.clmCode")} visible={true} /> 
                                <Column dataField="QUANTITY" caption={this.t("grdListe.clmQuantity")} visible={true} defaultSortOrder="desc"/> 
                                <Column dataField="UNIT_NAME" caption={this.t("grdListe.clmUnit")} visible={true} /> 
                                <Column dataField="BARCODE" caption={this.t("grdListe.clmBarcode")} visible={true}/> 
                            </NdGrid>
                        </div>
                    </div>
                    <NdForm colCount={4}>
                        <NdEmptyItem colSpan={3}></NdEmptyItem>
                        <NdItem>
                            <NdLabel text={this.t("txtTotalQuantity")} alignment="right" />
                            <NdTextBox id="txtTotalQuantity" parent={this} simple={true} readOnly={true}/>
                        </NdItem>
                    </NdForm>
                </ScrollView>
            </div>
        )
    }
}