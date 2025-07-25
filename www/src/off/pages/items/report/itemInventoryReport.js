import React from 'react';
import App from '../../../lib/app.js';

import Toolbar,{Item} from 'devextreme-react/toolbar';
import ScrollView from 'devextreme-react/scroll-view';

import NdGrid,{Column,ColumnChooser,Paging,Pager,Scrolling,Export} from '../../../../core/react/devex/grid.js';
import NdTextBox from '../../../../core/react/devex/textbox.js'
import NdSelectBox from '../../../../core/react/devex/selectbox.js';
import NdButton from '../../../../core/react/devex/button.js';
import NdCheckBox from '../../../../core/react/devex/checkbox.js';
import { dialog } from '../../../../core/react/devex/dialog.js';
import { NdForm, NdItem, NdLabel, NdEmptyItem } from '../../../../core/react/devex/form.js';

export default class itemInventoryReport extends React.PureComponent
{
    constructor(props)
    {
        super(props)

        this.core = App.instance.core;
        this.btnGetClick = this.btnGetClick.bind(this)
    }
    async btnGetClick()
    {
        if(this.chkZeroQuantity.value == true)
        {
            let tmpSource =
            {
                source : 
                {
                    select : 
                    {
                        query : `SELECT *, 
                                ROUND((COST_PRICE * QUANTITY),2) AS TOTAL_COST,ROUND((SALE_PRICE * QUANTITY),2) AS TOTAL_PRICE 
                                FROM [dbo].[FN_ITEM_INVENTORY](@DEPOT) `,
                        param : ['DEPOT:string|50'],
                        value : [this.cmbDepot.value]
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
                        query : `SELECT *,
                                ROUND((COST_PRICE * QUANTITY),2) AS TOTAL_COST, 
                                ROUND((SALE_PRICE * QUANTITY),2) AS TOTAL_PRICE 
                                FROM [dbo].[FN_ITEM_INVENTORY](@DEPOT) 
                                WHERE QUANTITY <> 0 `,
                        param : ['DEPOT:string|50'],
                        value : [this.cmbDepot.value]
                    },
                    sql : this.core.sql
                }
            }
            await this.grdListe.dataRefresh(tmpSource)
        }

        let tmpQuantity = this.grdListe.data.datatable.sum("QUANTITY",2)
        let tmpTotalCost = this.grdListe.data.datatable.sum("TOTAL_COST",2)

        this.txtTotalQuantity.setState({value:tmpQuantity})
        this.txtTotalCost.setState({value:tmpTotalCost})
    }
    render()
    {
        return(
            <div>
                <ScrollView>
                    <div className="row px-2 pt-1">
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
                    <div className="row px-2 pt-1" style={{height: '80px'}}>
                        <div className="col-12">
                            <NdForm colCount={2} id="frmKriter">
                                <NdItem>
                                    <NdLabel text={this.t("cmbDepot")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbDepot" showClearButton={true} notRefresh={true}  searchEnabled={true}
                                    displayExpr="NAME"                       
                                    valueExpr="GUID"
                                    value="1A428DFC-48A9-4AC6-AF20-4D0A4D33F316"
                                    param={this.param.filter({ELEMENT:'cmbDepot',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'cmbDepot',USERS:this.user.CODE})}
                                    data={{source: {select : {query:"SELECT GUID,CODE,NAME FROM DEPOT ORDER BY CODE ASC"},sql : this.core.sql}}}
                                    />
                                </NdItem>
                                <NdEmptyItem/>
                                <NdItem style={{margin: '20px 20px'}}>
                                    <NdCheckBox id="chkZeroQuantity" parent={this} text={this.t("chkZeroQuantity")}  value={false} />
                                </NdItem>
                            </NdForm>
                        </div>
                    </div>
                    <div className="row px-2 pt-1">
                        <div className="col-3">
                        </div>
                        <div className="col-3">
                        </div>
                        <div className="col-3">
                        </div>
                        <div className="col-3">
                            <NdButton text={this.t("btnGet")} type="success" width="100%" onClick={this.btnGetClick}></NdButton>
                        </div>
                    </div>
                    <div className="row px-2 pt-1">
                        <div className="col-12">
                            <NdForm colCount={1} id="frmGrid" height={'100%'}>
                                <NdItem height={'100%'}>
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
                                        <ColumnChooser enabled={true} />
                                        <Export fileName={this.lang.t("menuOff.stk_05_001")} enabled={true} allowExportSelectedData={true} />
                                        <Column dataField="NAME" caption={this.t("grdListe.clmName")} visible={true}/> 
                                        <Column dataField="CODE" caption={this.t("grdListe.clmCode")} visible={true} /> 
                                        <Column dataField="QUANTITY" caption={this.t("grdListe.clmQuantity")} visible={true} defaultSortOrder="desc"/> 
                                        <Column dataField="UNIT_SYMBOL" caption={this.t("grdListe.clmUnitSymbol")} visible={true}/> 
                                        <Column dataField="BARCODE" caption={this.t("grdListe.clmBarcode")} visible={true}/> 
                                        <Column dataField="COST_PRICE" caption={this.t("grdListe.clmCostPrice")} visible={true}/> 
                                        <Column dataField="TOTAL_COST" caption={this.t("grdListe.clmTotalCost")} visible={true}/> 
                                        <Column dataField="SALE_PRICE" caption={this.t("grdListe.clmSalePrice")} visible={false}/> 
                                        <Column dataField="TOTAL_PRICE" caption={this.t("grdListe.clmTotalPrice")} visible={false}/> 
                                    </NdGrid>
                                </NdItem>
                            </NdForm>

                        </div>
                    </div>
                    <NdForm colCount={4}>
                        <NdEmptyItem colSpan={2}></NdEmptyItem>
                        <NdItem>
                            <NdLabel text={this.t("txtTotalQuantity")} alignment="right" />
                            <NdTextBox id="txtTotalQuantity" parent={this} simple={true} readOnly={true}/>
                        </NdItem>
                        <NdItem>
                            <NdLabel text={this.t("txtTotalCost")} alignment="right" />
                            <NdTextBox id="txtTotalCost" parent={this} simple={true} readOnly={true}/>
                        </NdItem>
                    </NdForm>
                </ScrollView>
            </div>
        )
    }
}