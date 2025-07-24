import React from 'react';
import App from '../../../lib/app.js';

import Toolbar,{ Item } from 'devextreme-react/toolbar';
import ScrollView from 'devextreme-react/scroll-view';

import NdGrid,{Column, ColumnChooser,Paging,Pager,Scrolling,Export,GroupPanel,StateStoring} from '../../../../core/react/devex/grid.js';
import NdTextBox from '../../../../core/react/devex/textbox.js'
import NdButton from '../../../../core/react/devex/button.js';
import { dialog } from '../../../../core/react/devex/dialog.js';
import NdDatePicker from '../../../../core/react/devex/datepicker.js';
import { NdForm, NdItem, NdLabel } from '../../../../core/react/devex/form.js';
export default class promotionList extends React.PureComponent
{
    constructor(props)
    {
        super(props)

        this.core = App.instance.core;
        
        this.btnGetClick = this.btnGetClick.bind(this)
    }
    async btnGetClick()
    {        
        let tmpSource =
        {
            source : 
            {
                select : 
                {
                    query : `SELECT 
                            CODE,NAME,START_DATE,FINISH_DATE,COND_TYPE_NAME,COND_ITEM_CODE,COND_ITEM_NAME,COND_BARCODE,COND_QUANTITY,COND_AMOUNT,APP_TYPE_NAME,
                            APP_ITEM_CODE,APP_ITEM_NAME,APP_BARCODE,APP_QUANTITY,APP_AMOUNT,
                            CASE APP_TYPE WHEN 0 THEN CONVERT(NVARCHAR,APP_AMOUNT) + ' %' WHEN 5 THEN CONVERT(NVARCHAR,APP_AMOUNT) + '${Number.money.sign}' ELSE '' END AS APP_VALUE 
                            FROM PROMO_COND_APP_VW_01 WHERE ((CODE LIKE '%' + @CODE + '%') OR (COND_ITEM_CODE LIKE '%' + @CODE + '%') OR 
                            (COND_BARCODE LIKE '%' + @CODE + '%') OR (APP_ITEM_CODE LIKE '%' + @CODE + '%') OR (APP_BARCODE LIKE '%' + @CODE + '%') OR (@CODE = '')) AND 
                            ((NAME LIKE '%' + @NAME + '%') OR (COND_ITEM_NAME LIKE '%' + @NAME + '%') OR (APP_ITEM_NAME LIKE '%' + @NAME + '%') OR (@NAME = '')) AND 
                            ((START_DATE >= @START_DATE) OR (@START_DATE = '19700101')) AND ((FINISH_DATE <= @FINISH_DATE) OR (@FINISH_DATE = '19700101'))`,
                    param : ['CODE:string|25','NAME:string|250','START_DATE:date','FINISH_DATE:date'],
                    value : [this.txtCode.value,this.txtName.value,this.dtStartDate.value,this.dtFinishDate.value]
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
                                {{
                                    type: 'default',
                                    icon: 'add',
                                    onClick: async () => 
                                    {
                                        App.instance.menuClick(
                                        {
                                            id: 'promo_01_001',
                                            text: this.lang.t('menuOff.promo_01_001'),
                                            path: 'promotion/cards/promotionCard.js'
                                        })
                                    }
                                }} />
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
                                }}/>
                            </Toolbar>
                        </div>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <NdForm colCount={2} id="frmKriter">
                                <NdItem>
                                    <NdLabel text={this.t("txtCode")} alignment="right" />
                                    <NdTextBox id="txtCode" parent={this} simple={true} onEnterKey={this.btnGetClick} placeholder={this.t("txtCodePlace")}/>
                                </NdItem>
                                <NdItem>
                                    <NdLabel text={this.t("txtName")} alignment="right" />
                                    <NdTextBox id="txtName" parent={this} simple={true} onEnterKey={this.btnGetClick} placeholder={this.t("txtNamePlace")}/>
                                </NdItem>       
                                <NdItem>
                                    <NdLabel text={this.t("dtStartDate")} alignment="right" />
                                    <NdDatePicker simple={true} parent={this} id={"dtStartDate"}/>
                                </NdItem>
                                <NdItem>
                                    <NdLabel text={this.t("dtFinishDate")} alignment="right" />
                                    <NdDatePicker simple={true} parent={this} id={"dtFinishDate"}/>
                                </NdItem>
                            </NdForm>
                        </div>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-3 offset-9">
                            <NdButton text={this.t("btnGet")} type="success" width="100%" onClick={this.btnGetClick}/>
                        </div>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <NdGrid id="grdListe" parent={this} 
                            selection={{mode:"single"}} 
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
                                    id: 'promo_01_001',
                                    text: e.data.CODE,
                                    path: 'promotion/cards/promotionCard',
                                    pagePrm:{CODE:e.data.CODE}
                                })
                            }}>    
                                <StateStoring enabled={true} type="custom" customLoad={this.loadState} customSave={this.saveState} storageKey={this.props.data.id + "_grdPromoList"}/>
                                <ColumnChooser enabled={true} />          
                                <GroupPanel visible={true} allowColumnDragging={false}/>              
                                {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Paging defaultPageSize={20} /> : <Paging enabled={false} />}
                                {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Pager visible={true} allowedPageSizes={[5,10,50]} showPageSizeSelector={true} /> : <Paging enabled={false} />}
                                {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Scrolling mode="standart" /> : <Scrolling mode="virtual" />}
                                <Export fileName={"promo"} enabled={true} allowExportSelectedData={true} />
                                <Column dataField="CODE" caption={this.t("grdListe.clmCode")} visible={true} groupIndex={0}/> 
                                <Column dataField="NAME" caption={this.t("grdListe.clmName")} visible={true}/> 
                                <Column dataField="START_DATE" caption={this.t("grdListe.clmStartDate")} visible={true} dataType="date" /> 
                                <Column dataField="FINISH_DATE" caption={this.t("grdListe.clmFinishDate")} visible={true} dataType="date" /> 
                                <Column dataField="COND_TYPE_NAME" caption={this.t("grdListe.clmCondTypeName")} visible={true} groupIndex={1}/> 
                                <Column dataField="COND_ITEM_CODE" caption={this.t("grdListe.clmCondItemCode")} visible={true}/> 
                                <Column dataField="COND_ITEM_NAME" caption={this.t("grdListe.clmCondItemName")} visible={true}/> 
                                <Column dataField="COND_BARCODE" caption={this.t("grdListe.clmCondBarcode")} visible={true}/> 
                                <Column dataField="COND_QUANTITY" caption={this.t("grdListe.clmCondQuantity")} visible={false}/> 
                                <Column dataField="COND_AMOUNT" caption={this.t("grdListe.clmCondAmount")} visible={false}/> 
                                <Column dataField="APP_TYPE_NAME" caption={this.t("grdListe.clmAppTypeName")} visible={true} groupIndex={2}/> 
                                <Column dataField="APP_ITEM_CODE" caption={this.t("grdListe.clmAppItemCode")} visible={true}/> 
                                <Column dataField="APP_ITEM_NAME" caption={this.t("grdListe.clmAppItemName")} visible={true}/> 
                                <Column dataField="APP_BARCODE" caption={this.t("grdListe.clmAppBarcode")} visible={true}/> 
                                <Column dataField="APP_QUANTITY" caption={this.t("grdListe.clmAppQuantity")} visible={false}/> 
                                <Column dataField="APP_AMOUNT" caption={this.t("grdListe.clmAppAmount")} visible={false}/> 
                                <Column dataField="APP_VALUE" caption={this.t("grdListe.clmAppValue")} visible={true}/> 
                            </NdGrid>
                        </div>
                    </div>
                </ScrollView>
            </div>
        )
    }
}