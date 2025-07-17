import React from 'react';
import App from '../../../lib/app.js';
import moment from 'moment';

import Toolbar from 'devextreme-react/toolbar';
import Form, {Item, Label} from 'devextreme-react/form';
import ScrollView from 'devextreme-react/scroll-view';
import NdGrid,{Column, ColumnChooser,StateStoring,Paging,Pager,Scrolling,Export} from '../../../../core/react/devex/grid.js';
import NdSelectBox from '../../../../core/react/devex/selectbox.js';
import NdButton from '../../../../core/react/devex/button.js';
import NdDatePicker from '../../../../core/react/devex/datepicker.js';
import { dialog } from '../../../../core/react/devex/dialog.js';

export default class enddayReport extends React.PureComponent
{
    constructor(props)
    {
        super(props)
        
        this.core = App.instance.core;
        
        this.btnGetClick = this.btnGetClick.bind(this)
        this.loadState = this.loadState.bind(this)
        this.saveState = this.saveState.bind(this)
    }
    componentDidMount()
    {
        setTimeout(async () => { this.Init() }, 1000);
    }

    async Init()
    {
        this.dtFirst.value =  moment(new Date()).format("YYYY-MM-DD")
        this.dtLast.value =  moment(new Date()).format("YYYY-MM-DD")
    }

    loadState()
    {
        let tmpLoad = this.access.filter({ELEMENT:'grdEnddaDataState',USERS:this.user.CODE})
        return tmpLoad.getValue()
    }

    saveState(e)
    {
        let tmpSave = this.access.filter({ELEMENT:'grdEnddaDataState',USERS:this.user.CODE, PAGE:this.props.data.id, APP:"OFF"})
        tmpSave.setValue(e)
        tmpSave.save()
    }
    
    async btnGetClick()
    {
        
        let tmpSource =
        {
            source : 
            {                select : 
                {
                    query : `SELECT *, 
                            ROUND(ISNULL((SELECT SUM(AMOUNT - CHANGE) FROM POS_PAYMENT_VW_01 AS PAY1 
                                WHERE PAY1.DEVICE = ENDDAY_DATA_VW_01.SAFE_CODE 
                                AND DOC_DATE = CONVERT(NVARCHAR, ENDDAY_DATA_VW_01.CDATE, 112) 
                                AND TYPE = 0 AND PAY_TYPE = 0), 0) 
                            - ISNULL((SELECT SUM(AMOUNT - CHANGE) FROM POS_PAYMENT_VW_01 AS PAY1 
                                WHERE PAY1.DEVICE = ENDDAY_DATA_VW_01.SAFE_CODE 
                                AND DOC_DATE = CONVERT(NVARCHAR, ENDDAY_DATA_VW_01.CDATE, 112) 
                                AND TYPE = 1 AND PAY_TYPE = 0), 0), 2) AS POS_CASH,  
                            CASH - (ROUND(ISNULL((SELECT SUM(AMOUNT - CHANGE) FROM POS_PAYMENT_VW_01 AS PAY1 
                                WHERE PAY1.DEVICE = ENDDAY_DATA_VW_01.SAFE_CODE 
                                AND DOC_DATE = CONVERT(NVARCHAR, ENDDAY_DATA_VW_01.CDATE, 112) 
                                AND TYPE = 0 AND PAY_TYPE = 0), 0) 
                            - ISNULL((SELECT SUM(AMOUNT - CHANGE) FROM POS_PAYMENT_VW_01 AS PAY1 
                                WHERE PAY1.DEVICE = ENDDAY_DATA_VW_01.SAFE_CODE 
                                AND DOC_DATE = CONVERT(NVARCHAR, ENDDAY_DATA_VW_01.CDATE, 112) 
                                AND TYPE = 1 AND PAY_TYPE = 0), 0), 2) + ADVANCE) AS DIFF_CASH, 
                            ISNULL((SELECT ROUND(SUM(AMOUNT - CHANGE), 2) FROM POS_PAYMENT_VW_01 AS PAY1 
                                WHERE PAY1.DEVICE = ENDDAY_DATA_VW_01.SAFE_CODE 
                                AND DOC_DATE = CONVERT(NVARCHAR, ENDDAY_DATA_VW_01.CDATE, 112) 
                                AND TYPE = 0 AND (PAY_TYPE = 1 OR PAY_TYPE = 9)), 0) AS POS_CREDIT,  
                            CREDIT - ISNULL((SELECT ROUND(SUM(AMOUNT - CHANGE), 2) FROM POS_PAYMENT_VW_01 AS PAY1 
                                WHERE PAY1.DEVICE = ENDDAY_DATA_VW_01.SAFE_CODE 
                                AND DOC_DATE = CONVERT(NVARCHAR, ENDDAY_DATA_VW_01.CDATE, 112) 
                                AND TYPE = 0 AND (PAY_TYPE = 1 OR PAY_TYPE = 9)), 0) AS DIFF_CREDIT,  
                            ISNULL((SELECT ROUND(SUM(AMOUNT - CHANGE), 2) FROM POS_PAYMENT_VW_01 AS PAY1 
                                WHERE PAY1.DEVICE = ENDDAY_DATA_VW_01.SAFE_CODE 
                                AND DOC_DATE = CONVERT(NVARCHAR, ENDDAY_DATA_VW_01.CDATE, 112) 
                                AND TYPE = 0 AND PAY_TYPE = 2), 0) AS POS_CHECK,  
                            [CHECK] - ISNULL((SELECT ROUND(SUM(AMOUNT - CHANGE), 2) FROM POS_PAYMENT_VW_01 AS PAY1 
                                WHERE PAY1.DEVICE = ENDDAY_DATA_VW_01.SAFE_CODE 
                                AND DOC_DATE = CONVERT(NVARCHAR, ENDDAY_DATA_VW_01.CDATE, 112) 
                                AND TYPE = 0 AND PAY_TYPE = 2), 0) AS DIFF_CHECK,  
                            ISNULL((SELECT ROUND(SUM(AMOUNT - CHANGE), 2) FROM POS_PAYMENT_VW_01 AS PAY1 
                                WHERE PAY1.DEVICE = ENDDAY_DATA_VW_01.SAFE_CODE 
                                AND DOC_DATE = CONVERT(NVARCHAR, ENDDAY_DATA_VW_01.CDATE, 112) 
                                AND TYPE = 0 AND PAY_TYPE = 3), 0) AS POS_TICKET,  
                            TICKET - ISNULL((SELECT ROUND(SUM(AMOUNT - CHANGE), 2) FROM POS_PAYMENT_VW_01 AS PAY1 
                                WHERE PAY1.DEVICE = ENDDAY_DATA_VW_01.SAFE_CODE 
                                AND DOC_DATE = CONVERT(NVARCHAR, ENDDAY_DATA_VW_01.CDATE, 112) 
                                AND TYPE = 0 AND PAY_TYPE = 3), 0) AS DIFF_TICKET  
                            FROM ENDDAY_DATA_VW_01 
                            WHERE ((SAFE_CODE = @SAFE_CODE) OR (@SAFE_CODE = '')) 
                            AND ((CONVERT(NVARCHAR, CDATE, 112) >= @START_DATE) OR (@START_DATE = '19700101')) 
                            AND ((CONVERT(NVARCHAR, CDATE, 112) <= @FINISH_DATE) OR (@FINISH_DATE = '19700101')) 
                            ORDER BY CDATE DESC`,
                    param : ['SAFE_CODE:string|50','START_DATE:date','FINISH_DATE:date'],
                    value : [this.cmbDevice.value,this.dtFirst.value,this.dtLast.value]
                },
                sql : this.core.sql
            }
        }
        App.instance.setState({isExecute:true})
        await this.grdEnddaData.dataRefresh(tmpSource)
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
                            <Form colCount={3} id="frmCriter">
                            {/* cmbDevice */}
                            <Item>
                                <Label text={this.t("cmbDevice")} alignment="right" />
                                <NdSelectBox simple={true} parent={this} id="cmbDevice"
                                displayExpr="DISPLAY"                       
                                valueExpr="CODE"
                                showClearButton={true}
                                notRefresh={true}
                                data={{source:{select:{query:`SELECT CODE + '-' + NAME AS DISPLAY,CODE,NAME FROM SAFE_VW_01 WHERE TYPE = 2 ORDER BY CODE ASC`},sql:this.core.sql}}}
                                param={this.param.filter({ELEMENT:'cmbDevice',USERS:this.user.CODE})}
                                access={this.access.filter({ELEMENT:'cmbDevice',USERS:this.user.CODE})}
                                />
                            </Item>
                            {/* dtFirst */}
                            <Item>
                                <Label text={this.t("dtFirst")} alignment="right" />
                                <NdDatePicker simple={true}  parent={this} id={"dtFirst"}/ >
                            </Item>
                            {/* dtLast */}
                            <Item>
                                <Label text={this.t("dtLast")} alignment="right" />
                                <NdDatePicker simple={true}  parent={this} id={"dtLast"} />
                            </Item>
                            </Form>
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
                            <NdButton text={this.t("btnGet")} type="success" width="100%" onClick={this.btnGetClick}></NdButton>
                        </div>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <NdGrid id="grdEnddaData" parent={this} 
                            selection={{mode:"single"}} 
                            showBorders={true}
                            filterRow={{visible:true}} 
                            headerFilter={{visible:true}}
                            columnAutoWidth={true}
                            allowColumnReordering={true}
                            allowColumnResizing={true}
                            onCellPrepared={(e) =>
                                {
                                    if(e.rowType === "data" && e.column.dataField === "DIFF_CASH")
                                    {
                                        if(e.data.DIFF_CASH < 0 )
                                        {
                                            e.cellElement.style.color ="red"
                                            e.cellElement.style.fontWeight ="bold"
                                        }
                                        else if(e.data.DIFF_CASH > 0)
                                        {
                                            e.cellElement.style.color ="blue"
                                            e.cellElement.style.fontWeight ="bold"
                                        }
                                        else
                                        {
                                            e.cellElement.style.color ="green"
                                        }
                                    }
                                    if(e.rowType === "data" && e.column.dataField === "DIFF_CREDIT")
                                    {
                                        if(e.data.DIFF_CREDIT < 0 )
                                        {
                                            e.cellElement.style.color ="red"
                                            e.cellElement.style.fontWeight ="bold"
                                        }
                                        else if(e.data.DIFF_CREDIT > 0)
                                        {
                                            e.cellElement.style.color ="blue"
                                            e.cellElement.style.fontWeight ="bold"
                                        }
                                        else
                                        {
                                            e.cellElement.style.color ="green"
                                        }
                                    }
                                    if(e.rowType === "data" && e.column.dataField === "DIFF_CHECK")
                                    {
                                        if(e.data.DIFF_CHECK < 0 )
                                        {
                                            e.cellElement.style.color ="red"
                                            e.cellElement.style.fontWeight ="bold"
                                        }
                                        else if(e.data.DIFF_CHECK > 0)
                                        {
                                            e.cellElement.style.color ="blue"
                                            e.cellElement.style.fontWeight ="bold"
                                        }
                                        else
                                        {
                                            e.cellElement.style.color ="green"
                                        }
                                    }
                                    if(e.rowType === "data" && e.column.dataField === "DIFF_TICKET")
                                    {
                                        if(e.data.DIFF_TICKET < 0 )
                                        {
                                            e.cellElement.style.color ="red"
                                            e.cellElement.style.fontWeight ="bold"
                                        }
                                        else if(e.data.DIFF_TICKET > 0)
                                        {
                                            e.cellElement.style.color ="blue"
                                            e.cellElement.style.fontWeight ="bold"
                                        }
                                        else
                                        {
                                            e.cellElement.style.color ="green"
                                        }
                                    }
                                }}
                            >                            
                                {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Paging defaultPageSize={20} /> : <Paging enabled={false} />}
                                {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Pager visible={true} allowedPageSizes={[5,10,50]} showPageSizeSelector={true} /> : <Paging enabled={false} />}
                                {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Scrolling mode="standart" /> : <Scrolling mode="infinite" />}
                                <StateStoring enabled={true} type="custom" customLoad={this.loadState} customSave={this.saveState} storageKey={this.props.data.id + "_grdEnddaData"}/>
                                <ColumnChooser enabled={true} />
                                <Export fileName={this.lang.t("menuOff.pos_02_001")} enabled={true} allowExportSelectedData={true} />
                                <Column dataField="CDATE_FORMAT" caption={this.t("grdEnddaData.clmDate")} visible={true} dataType="datetime" format={"dd/MM/yyyy HH:mm:ss"} width={80}/> 
                                <Column dataField="CUSER_NAME" caption={this.t("grdEnddaData.clmUser")} visible={true} width={90}/> 
                                <Column dataField="SAFE_NAME" caption={this.t("grdEnddaData.clmSafe")} visible={true} width={110}/> 
                                <Column dataField="ADVANCE" caption={this.t("grdEnddaData.clmAdvance")} visible={true}  format={{ style: "currency", currency: Number.money.code,precision: 2}} /> 
                                <Column dataField="CASH" caption={this.t("grdEnddaData.clmCash")} visible={true}  format={{ style: "currency", currency: Number.money.code,precision: 2}} width={90}/> 
                                <Column dataField="POS_CASH" caption={this.t("grdEnddaData.clmPosCash")} visible={true}  format={{ style: "currency", currency: Number.money.code,precision: 2}} width={90}/> 
                                <Column dataField="DIFF_CASH" caption={this.t("grdEnddaData.clmDiffCash")} visible={true}  format={{ style: "currency", currency: Number.money.code,precision: 2}} width={90}/> 
                                <Column dataField="CREDIT" caption={this.t("grdEnddaData.clmCredit")} visible={true}  format={{ style: "currency", currency: Number.money.code,precision: 2}} width={90}/> 
                                <Column dataField="POS_CREDIT" caption={this.t("grdEnddaData.clmPosCredit")} visible={true}  format={{ style: "currency", currency: Number.money.code,precision: 2}} width={90}/> 
                                <Column dataField="DIFF_CREDIT" caption={this.t("grdEnddaData.clmDiffCredit")} visible={true}  format={{ style: "currency", currency: Number.money.code,precision: 2}} width={90}/> 
                                <Column dataField="CHECK" caption={this.t("grdEnddaData.clmCheck")} visible={true}  format={{ style: "currency", currency: Number.money.code,precision: 2}} width={90}/> 
                                <Column dataField="POS_CHECK" caption={this.t("grdEnddaData.clmPosCheck")} visible={true}  format={{ style: "currency", currency: Number.money.code,precision: 2}} width={90}/> 
                                <Column dataField="DIFF_CHECK" caption={this.t("grdEnddaData.clmDiffCheck")} visible={true}  format={{ style: "currency", currency: Number.money.code,precision: 2}} width={90}/> 
                                <Column dataField="TICKET" caption={this.t("grdEnddaData.clmTicket")} visible={true}  format={{ style: "currency", currency: Number.money.code,precision: 2}} width={90}/> 
                                <Column dataField="POS_TICKET" caption={this.t("grdEnddaData.clmPosTicket")} visible={true}  format={{ style: "currency", currency: Number.money.code,precision: 2}} width={90}/> 
                                <Column dataField="DIFF_TICKET" caption={this.t("grdEnddaData.clmDiffTicket")} visible={true}  format={{ style: "currency", currency: Number.money.code,precision: 2}} width={90}/> 
                            </NdGrid>
                        </div>
                    </div>
                </ScrollView>
            </div>
        )
    }
}