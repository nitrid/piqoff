import React from 'react';
import App from '../../../lib/app.js';
import Toolbar from 'devextreme-react/toolbar';
import moment from 'moment';

import Form, {Item, Label } from 'devextreme-react/form';
import ScrollView from 'devextreme-react/scroll-view';

import NdGrid,{Column, ColumnChooser,StateStoring,Paging,Pager,Scrolling,Export} from '../../../../core/react/devex/grid.js';
import NdSelectBox from '../../../../core/react/devex/selectbox.js';
import NdButton from '../../../../core/react/devex/button.js';
import NbDateRange from '../../../../core/react/bootstrap/daterange.js';
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
        setTimeout(async () => { }, 1000);
    }

    loadState()
    {
        let tmpLoad = this.access.filter({ELEMENT:'grdAdvanceDataState',USERS:this.user.CODE})
        return tmpLoad.getValue()
    }
    saveState(e)
    {
        let tmpSave = this.access.filter({ELEMENT:'grdAdvanceDataState',USERS:this.user.CODE, PAGE:this.props.data.id, APP:"OFF"})
        tmpSave.setValue(e)
        tmpSave.save()
    }

    async btnGetClick()
    {
        if(this.cmbDevice.value == '')
        {
            this.toast.show({message:this.t("msgDeviceSelect.msg"),type:"warning"})
            return
        }
        let tmpSource =
        {
            source : 
            {
                groupBy : this.groupList,
                select : 
                {
                    query : `SELECT * FROM DOC_CUSTOMER_VW_01 WHERE REF= 'POS' AND PAY_TYPE =20 AND ((INPUT_CODE = @INPUT_CODE) OR (@INPUT_CODE = '')) AND ((CONVERT(NVARCHAR,CDATE,112) >= @START_DATE) OR (@START_DATE = '19700101')) 
                            AND ((CONVERT(NVARCHAR,CDATE,112) <= @FINISH_DATE) OR (@FINISH_DATE = '19700101')) ORDER BY CDATE DESC`,
                    param : ['INPUT_CODE:string|50','START_DATE:date','FINISH_DATE:date'],
                    value : [this.cmbDevice.value, this.dtDate.startDate,this.dtDate.endDate]
                },
                sql : this.core.sql
            }
        }
        App.instance.setState({isExecute:true})
        await this.grdAdvanceData.dataRefresh(tmpSource)
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
                                    data={{source:{select:{query:"SELECT CODE + '-' + NAME AS DISPLAY,CODE,NAME FROM SAFE_VW_01 WHERE TYPE = 2 ORDER BY CODE ASC"},sql:this.core.sql}}}
                                    param={this.param.filter({ELEMENT:'cmbDevice',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'cmbDevice',USERS:this.user.CODE})}
                                    />
                                </Item>
                                {/* dtFirst */}
                                <Item>
                                    <Label text={this.t("dtFirst")} alignment="right" />
                                    <NbDateRange id={"dtDate"} parent={this} startDate={moment(new Date())} endDate={moment(new Date())}/>
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
                            <NdButton text={this.t("btnGet")} type="success" width="100%" onClick={this.btnGetClick}/>
                        </div>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <NdGrid id="grdAdvanceData" parent={this} 
                            selection={{mode:"single"}} 
                            height={600}
                            showBorders={true}
                            filterRow={{visible:true}} 
                            headerFilter={{visible:true}}
                            columnAutoWidth={true}
                            allowColumnReordering={true}
                            allowColumnResizing={true}
                            >                            
                                {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Paging defaultPageSize={20} /> : <Paging enabled={false} />}
                                {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Pager visible={true} allowedPageSizes={[5,10,50]} showPageSizeSelector={true} /> : <Paging enabled={false} />}
                                {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Scrolling mode="standart" /> : <Scrolling mode="virtual" />}
                                <StateStoring enabled={true} type="custom" customLoad={this.loadState} customSave={this.saveState} storageKey={this.props.data.id + "_grdAdvanceData"}/>
                                <ColumnChooser enabled={true} />
                                <Export fileName={this.lang.t("menuOff.pos_02_001")} enabled={true} allowExportSelectedData={true} />
                                <Column dataField="CDATE_FORMAT" caption={this.t("grdAdvanceData.clmDate")} visible={true}/> 
                                <Column dataField="CUSER_NAME" caption={this.t("grdAdvanceData.clmUser")} visible={true}/> 
                                <Column dataField="INPUT_NAME" caption={this.t("grdAdvanceData.clmSafe")} visible={true} /> 
                                <Column dataField="AMOUNT" caption={this.t("grdAdvanceData.clmCash")} visible={true} /> 
                            </NdGrid>
                        </div>
                    </div>
                </ScrollView>
            </div>
        )
    }
}