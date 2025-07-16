import React from 'react';
import App from '../../../lib/app.js';

import Toolbar,{ Item } from 'devextreme-react/toolbar';
import ScrollView from 'devextreme-react/scroll-view';

import NdGrid,{ Column, ColumnChooser, Paging, Pager, Scrolling, Export, GroupPanel, StateStoring } from '../../../../core/react/devex/grid.js';
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

        this.saveState = this.saveState.bind(this)
        this.loadState = this.loadState.bind(this)
        
        this.core = App.instance.core;
        
        this.btnGetClick = this.btnGetClick.bind(this)
    }
    loadState() 
    {
        let tmpLoad = this.access.filter({ELEMENT:'grdPromoListState',USERS:this.user.CODE})
        return tmpLoad.getValue()
    }
    saveState(e)
    {
        let tmpSave = this.access.filter({ELEMENT:'grdPromoListState',USERS:this.user.CODE})
        tmpSave.setValue(e)
        tmpSave.save()
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
                            CODE AS CODE,
                            MAX(NAME) AS NAME,
                            MAX(START_DATE) AS START_DATE,
                            MAX(FINISH_DATE) AS FINISH_DATE,
                            MAX(COND_TYPE_NAME) AS COND_TYPE_NAME,
                            MAX(COND_ITEM_CODE) AS COND_ITEM_CODE,
                            MAX(COND_ITEM_NAME) AS COND_ITEM_NAME,
                            MAX(COND_QUANTITY) AS COND_QUANTITY,
                            MAX(COND_AMOUNT) AS COND_AMOUNT,
                            MAX(APP_TYPE_NAME) AS APP_TYPE_NAME,
                            MAX(APP_ITEM_CODE) AS APP_ITEM_CODE,
                            MAX(APP_ITEM_NAME) AS APP_ITEM_NAME,
                            MAX(APP_QUANTITY) AS APP_QUANTITY,
                            MAX(APP_AMOUNT) AS APP_AMOUNT,
                            CASE WHEN MAX(START_DATE) <= dbo.GETDATE() AND MAX(FINISH_DATE) >= (dbo.GETDATE() - 1) THEN 1 ELSE 0 END AS ACTIVE
                            FROM PROMO_COND_APP_VW_01 WHERE ((CODE LIKE '%' + @CODE + '%') OR (COND_ITEM_CODE LIKE '%' + @CODE + '%') OR 
                            (COND_BARCODE LIKE '%' + @CODE + '%') OR (APP_ITEM_CODE LIKE '%' + @CODE + '%') OR (APP_BARCODE LIKE '%' + @CODE + '%') OR (@CODE = '')) AND 
                            ((NAME LIKE '%' + @NAME + '%') OR (COND_ITEM_NAME LIKE '%' + @NAME + '%') OR (APP_ITEM_NAME LIKE '%' + @NAME + '%') OR (@NAME = '')) AND 
                            ((START_DATE >= @START_DATE) OR (@START_DATE = '19700101')) AND ((FINISH_DATE <= @FINISH_DATE) OR (@FINISH_DATE = '19700101')) 
                            GROUP BY CODE`,
                    param : ['CODE:string|25','NAME:string|250','START_DATE:date','FINISH_DATE:date'],
                    value : [this.txtCode.value,this.txtName.value,this.dtStartDate.value,this.dtFinishDate.value]
                },
                sql : this.core.sql
            }
        }
        
        App.instance.setState({isExecute:true})
        await this.grdListe.dataRefresh(tmpSource)
        App.instance.setState({isExecute:false})
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
                                <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnDelete" parent={this} icon="trash" type="danger"
                                    onClick={async()=>
                                    {                                        
                                        let tmpConfObj =
                                        {
                                            id:'msgDelete',showTitle:true,title:this.t("msgDelete.title"),showCloseButton:true,width:'500px',height:'auto',
                                            button:[{id:"btn01",caption:this.t("msgDelete.btn01"),location:'before'},{id:"btn02",caption:this.t("msgDelete.btn02"),location:'after'}],
                                            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgDelete.msg")}</div>)
                                        }
                                        
                                        let pResult = await dialog(tmpConfObj);

                                        if(pResult == 'btn01')
                                        {
                                            App.instance.setState({isExecute:true})
                                            for (let i = 0; i < this.grdListe.getSelectedData().length; i++) 
                                            {
                                                let tmpQuery = 
                                                {
                                                    query : `EXEC [dbo].[PRD_PROMO_DELETE] @CUSER = @PCUSER, @UPDATE = 1, @CODE = @PCODE `, 
                                                    param : ['PCUSER:string|50','PCODE:string|25'],
                                                    value : [this.user.CODE,this.grdListe.getSelectedData()[i].CODE]
                                                }
                                                await this.core.sql.execute(tmpQuery) 
                                            }
                                            App.instance.setState({isExecute:false})
                                            this.btnGetClick()
                                        }
                                    }}/>
                                </Item>
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
                            <NdButton text={this.t("btnGet")} type="success" width="100%" onClick={this.btnGetClick}></NdButton>
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
                            onRowDblClick={async(e)=>
                            {
                                App.instance.menuClick(
                                {
                                    id: 'promo_01_001',
                                    text: e.data.CODE,
                                    path: 'promotion/cards/promotionCard',
                                    pagePrm:{CODE:e.data.CODE}
                                })
                            }}
                            onRowPrepared={(e)=>
                            {
                                if(e.rowType == "data")
                                {
                                    if(e.data.ACTIVE == 1)
                                    {
                                        e.rowElement.style.backgroundColor = "#00cec9";
                                    }
                                    else
                                    {
                                        e.rowElement.style.backgroundColor = "white";
                                    }
                                }
                            }}>
                                <StateStoring enabled={true} type="custom" customLoad={this.loadState} customSave={this.saveState} storageKey={this.props.data.id + "_grdPromoList"}/>
                                <ColumnChooser enabled={true} />
                                <GroupPanel visible={true} allowColumnDragging={false}/>
                                {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Paging defaultPageSize={20} /> : <Paging enabled={false} />}
                                {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Pager visible={true} allowedPageSizes={[5,10,50]} showPageSizeSelector={true} /> : <Paging enabled={false} />}
                                {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Scrolling mode="standart" /> : <Scrolling mode="infinite" />}
                                <Export fileName={"promo"} enabled={true} allowExportSelectedData={true} />
                                <Column dataField="ACTIVE" caption={this.t("grdListe.clmCode")} visible={false} defaultSortOrder="desc"/> 
                                <Column dataField="CODE" caption={this.t("grdListe.clmCode")} visible={true}/> 
                                <Column dataField="NAME" caption={this.t("grdListe.clmName")} visible={true}/> 
                                <Column dataField="START_DATE" caption={this.t("grdListe.clmStartDate")} visible={true} dataType="date" /> 
                                <Column dataField="FINISH_DATE" caption={this.t("grdListe.clmFinishDate")} visible={true} dataType="date" /> 
                                <Column dataField="COND_TYPE_NAME" caption={this.t("grdListe.clmCondTypeName")} visible={true}/> 
                                <Column dataField="COND_ITEM_CODE" caption={this.t("grdListe.clmCondItemCode")} visible={true}/> 
                                <Column dataField="COND_ITEM_NAME" caption={this.t("grdListe.clmCondItemName")} visible={true}/> 
                                <Column dataField="COND_BARCODE" caption={this.t("grdListe.clmCondBarcode")} visible={false}/> 
                                <Column dataField="COND_QUANTITY" caption={this.t("grdListe.clmCondQuantity")} visible={true}/> 
                                <Column dataField="COND_AMOUNT" caption={this.t("grdListe.clmCondAmount")} visible={true}/> 
                                <Column dataField="APP_TYPE_NAME" caption={this.t("grdListe.clmAppTypeName")} visible={true}/> 
                                <Column dataField="APP_ITEM_CODE" caption={this.t("grdListe.clmAppItemCode")} visible={true}/> 
                                <Column dataField="APP_ITEM_NAME" caption={this.t("grdListe.clmAppItemName")} visible={true}/> 
                                <Column dataField="APP_BARCODE" caption={this.t("grdListe.clmAppBarcode")} visible={false}/> 
                                <Column dataField="APP_QUANTITY" caption={this.t("grdListe.clmAppQuantity")} visible={true}/> 
                                <Column dataField="APP_AMOUNT" caption={this.t("grdListe.clmAppAmount")} visible={true}/> 
                            </NdGrid>
                        </div>
                    </div>
                </ScrollView>
            </div>
        )
    }
}