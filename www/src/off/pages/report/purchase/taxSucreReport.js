import React from 'react';
import App from '../../../lib/app.js';
import moment from 'moment';

import Toolbar,{Item} from 'devextreme-react/toolbar';
import ScrollView from 'devextreme-react/scroll-view';

import NdGrid,{Column, ColumnChooser,Paging,Pager,Scrolling,Export, Summary, StateStoring, TotalItem} from '../../../../core/react/devex/grid.js';
import NbDateRange from '../../../../core/react/bootstrap/daterange.js';
import NdButton from '../../../../core/react/devex/button.js';
import { dialog } from '../../../../core/react/devex/dialog.js';
import {NdForm,NdItem, NdLabel} from '../../../../core/react/devex/form.js';
export default class taxSucreReport extends React.PureComponent
{
    constructor(props)
    {
        super(props)

        this.core = App.instance.core;
        this.prmObj = this.param.filter({TYPE:1,USERS:this.user.CODE})

        this.btnGetirClick = this.btnGetirClick.bind(this)
        this.loadState = this.loadState.bind(this)
        this.saveState = this.saveState.bind(this)
    }
    componentDidMount()
    {
        setTimeout(async () => { }, 1000);
    }

   loadState()
    {
        let tmpLoad = this.access.filter({ELEMENT:'grdListeState',USERS:this.user.CODE})
        return tmpLoad.getValue()
    }
   saveState(e)
    {
        let tmpSave =  this.access.filter({ELEMENT:'grdListeState',USERS:this.user.CODE,PAGE:this.props.data.id,APP:"OFF"})
        tmpSave.setValue(e)
        tmpSave.save()
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
                    query :
                        `SELECT 
                        (SELECT TOP 1 CODE FROM ITEMS WHERE ITEMS.GUID = DOC_ITEMS.ITEM) AS ITEM_CODE, 
                        REF AS REF, 
                        REF_NO AS REF_NO, 
                        DOC_DATE AS DOC_DATE, 
                        MAX(ITEM_NAME) AS ITEM_NAME, 
                        OUTPUT_CODE AS OUTPUT_CODE, 
                        OUTPUT_NAME AS OUTPUT_NAME, 
                        (SELECT TOP 1 FACTOR FROM ITEM_UNIT_VW_01 WHERE ITEM_UNIT_VW_01.ITEM_GUID = DOC_ITEMS.ITEM AND ITEM_UNIT_VW_01.ID = '005') AS UNIT_LITRE, 
                        ((SELECT TOP 1 FACTOR / 100 FROM ITEM_UNIT WHERE ITEM_UNIT.ITEM = DOC_ITEMS.ITEM AND TYPE = 1)*(SELECT TOP 1 PRICE FROM TAX_SUGAR_TABLE_VW_01 WHERE DOC_ITEMS.DOC_DATE>= START_DATE AND DOC_ITEMS.DOC_DATE<= END_DATE AND MIN_VALUE <= (SELECT TOP 1 SUGAR_RATE FROM ITEMS WHERE ITEMS.GUID = DOC_ITEMS.ITEM ) AND MAX_VALUE >=  (SELECT TOP 1 SUGAR_RATE FROM ITEMS WHERE ITEMS.GUID = DOC_ITEMS.ITEM ))) * SUM(QUANTITY) AS AMOUNT, 
                        ROUND(SUM(QUANTITY),3) AS QUANTITY, 
                        ITEM FROM  DOC_ITEMS_VW_01 AS DOC_ITEMS  
                        WHERE TYPE = 0 AND DOC_TYPE IN(20,40) AND  REBATE = 0  AND DOC_DATE >= @FIRST_DATE AND DOC_DATE <= @LAST_DATE AND 
                        ((SELECT TOP 1 FACTOR / 100 FROM ITEM_UNIT WHERE ITEM_UNIT.ITEM = DOC_ITEMS.ITEM AND TYPE = 1)*(SELECT TOP 1 PRICE FROM TAX_SUGAR_TABLE_VW_01 WHERE DOC_ITEMS.DOC_DATE>= START_DATE AND DOC_ITEMS.DOC_DATE<= END_DATE  AND MIN_VALUE <= (SELECT TOP 1 SUGAR_RATE FROM ITEMS WHERE ITEMS.GUID = DOC_ITEMS.ITEM ) AND MAX_VALUE >=  (SELECT TOP 1 SUGAR_RATE FROM ITEMS WHERE ITEMS.GUID = DOC_ITEMS.ITEM )))  IS NOT NULL AND 
                        (SELECT TOP 1 TAX_SUGAR FROM ITEMS_SHOP WHERE ITEMS_SHOP.ITEM = DOC_ITEMS.ITEM) = 1   
                        AND  
                        (SELECT TOP 1 TAX_SUCRE FROM CUSTOMERS WHERE CUSTOMERS.GUID = DOC_ITEMS.OUTPUT ) = 1  
                        GROUP BY ITEM,REF,REF_NO,DOC_DATE,OUTPUT_CODE,OUTPUT_NAME HAVING ((SELECT TOP 1 FACTOR / 100 FROM ITEM_UNIT WHERE ITEM_UNIT.ITEM = DOC_ITEMS.ITEM AND TYPE = 1)*(SELECT TOP 1 PRICE FROM TAX_SUGAR_TABLE_VW_01 WHERE MIN_VALUE <= (SELECT TOP 1 SUGAR_RATE FROM ITEMS WHERE ITEMS.GUID = DOC_ITEMS.ITEM ) AND MAX_VALUE >=  (SELECT TOP 1 SUGAR_RATE FROM ITEMS WHERE ITEMS.GUID = DOC_ITEMS.ITEM ))) * SUM(QUANTITY) <> 0`,
                    param : ['FIRST_DATE:date','LAST_DATE:date'],
                    value : [this.dtDate.startDate,this.dtDate.endDate]
                },
                sql : this.core.sql
            }
        }
        await this.grdListe.dataRefresh(tmpSource)

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
                            <NdForm colCount={2} id="frmKriter">
                                <NdItem>
                                    <NdLabel text={this.t("grdListe.clmDocDate")}/>
                                    <NbDateRange id={"dtDate"} parent={this} startDate={moment().startOf('year')} endDate={moment().endOf('year')}/>
                                </NdItem>
                            </NdForm>
                        </div>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-3">
                        </div>
                        <div className="col-3">
                        </div>
                        <div className="col-3">
                        </div>
                        <div className="col-3">
                            <NdButton text={this.t("btnGet")} type="success" width="100%" onClick={this.btnGetirClick}/>
                        </div>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <NdGrid id="grdListe" parent={this} 
                            selection={{mode:"multiple"}} 
                            showBorders={true}
                            filterRow={{visible:false}} 
                            headerFilter={{visible:false}}
                            height={'690'} 
                            width={'100%'}
                            columnAutoWidth={true}
                            allowColumnReordering={true}
                            allowColumnResizing={true}
                            loadPanel={{enabled:true}}
                            >                            
                                {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Paging defaultPageSize={20} /> : <Paging enabled={false} />}
                                {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Pager visible={true} allowedPageSizes={[5,10,50]} showPageSizeSelector={true} /> : <Paging enabled={false} />}
                                {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Scrolling mode="standart" /> : <Scrolling mode="infinite" />}
                                <StateStoring enabled={true} type="custom" customLoad={this.loadState} customSave={this.saveState} storageKey={this.props.data.id + "_grdListe"}/>
                                <ColumnChooser enabled={true} />
                                <Export fileName={this.lang.t("menuOff.slsRpt_01_001")} enabled={true} allowExportSelectedData={true} />
                                <Column dataField="REF" caption={this.t("grdListe.clmRef")} visible={true} /> 
                                <Column dataField="REF_NO" caption={this.t("grdListe.clmRefNo")} visible={true} /> 
                                <Column dataField="DOC_DATE" caption={this.t("grdListe.clmDocDate")} dataType="datetime" format={"dd/MM/yyyy"} visible={true} /> 
                                <Column dataField="OUTPUT_CODE" caption={this.t("grdListe.clmOutputCode")} visible={true} /> 
                                <Column dataField="OUTPUT_NAME" caption={this.t("grdListe.clmOutputName")} visible={true}/> 
                                <Column dataField="ITEM_CODE" caption={this.t("grdListe.clmCode")} visible={true} /> 
                                <Column dataField="ITEM_NAME" caption={this.t("grdListe.clmName")} visible={true}/> 
                                <Column dataField="UNIT_LITRE" caption={this.t("grdListe.clmLitre")} visible={true}/> 
                                <Column dataField="QUANTITY" caption={this.t("grdListe.clmQuantity")} visible={true} /> 
                                <Column dataField="AMOUNT" caption={this.t("grdListe.clmAmount")} format={{ style: "currency", currency: Number.money.code,precision: 2}} visible={true} /> 
                                <Summary>
                                    <TotalItem
                                    column="AMOUNT"
                                    summaryType="sum"
                                    valueFormat={{ style: "currency", currency: Number.money.code,precision: 2}} />
                                </Summary> 
                            </NdGrid>
                        </div>
                    </div>
                </ScrollView>
            </div>
        )
    }
}