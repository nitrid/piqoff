import React from 'react';
import App from '../../../lib/app.js';
import moment from 'moment';
import Toolbar from 'devextreme-react/toolbar';
import Form, {Item, Label} from 'devextreme-react/form';
import ScrollView from 'devextreme-react/scroll-view';
import NdGrid,{Column, ColumnChooser,StateStoring,Paging,Pager,Scrolling,Export} from '../../../../core/react/devex/grid.js';
import NdButton from '../../../../core/react/devex/button.js';
import NdCheckBox from '../../../../core/react/devex/checkbox.js';
import NbDateRange from '../../../../core/react/bootstrap/daterange.js';
import { dialog } from '../../../../core/react/devex/dialog.js';

export default class useingPointReport extends React.PureComponent
{
    constructor(props)
    {
        super(props)
        this.state = {dataSource : {}} 
        this.core = App.instance.core;
        this.groupList = [];
        this.btnGetClick = this.btnGetClick.bind(this)
        this.loadState = this.loadState.bind(this)
        this.saveState = this.saveState.bind(this)
    }
    componentDidMount()
    {
        setTimeout(async () => 
        {
            this.Init()
        }, 1000);
    }
    async Init()
    {

    }
    loadState()
    {
        let tmpLoad = this.access.filter({ELEMENT:'grdUseingPointReportState',USERS:this.user.CODE})
        return tmpLoad.getValue()
    }
    saveState(e)
    {
        let tmpSave = this.access.filter({ELEMENT:'grdUseingPointReportState',USERS:this.user.CODE,PAGE:this.props.data.id,APP:"OFF"})
        tmpSave.setValue(e)
        tmpSave.save()
    }
    async btnGetClick()
    {
        if(this.chkTicket.value == true)
        {
            let tmpSource =
            {
                source : 
                {
                    groupBy : this.groupList,
                    select : 
                    {
                        query : "SELECT *,SUBSTRING(CONVERT(NVARCHAR(50),GUID),20,25) AS TICKET,CASE WHEN TYPE = 0 THEN POINT WHEN TYPE = 1 THEN POINT * -1 END AS USE_POINT FROM CUSTOMER_POINT_VW_01 WHERE DOC = '00000000-0000-0000-0000-000000000000' AND CONVERT(NVARCHAR,CDATE,112) >= @FISRT_DATE AND CONVERT(NVARCHAR,CDATE,112) <= @LAST_DATE ORDER BY CDATE DESC",
                        param : ['FISRT_DATE:date','LAST_DATE:date'],
                        value : [this.dtDate.startDate,this.dtDate.endDate]
                    },
                    sql : this.core.sql
                }
            }
            App.instance.setState({isExecute:true})
            await this.grdUseingPointReport.dataRefresh(tmpSource)
            App.instance.setState({isExecute:false})
        }
        else
        {
            let tmpSource =
            {
                source : 
                {
                    groupBy : this.groupList,
                    select : 
                    {
                        query : "SELECT *,SUBSTRING(CONVERT(NVARCHAR(50),GUID),20,25) AS TICKET,CASE WHEN TYPE = 0 THEN POINT WHEN TYPE = 1 THEN POINT * -1 END AS USE_POINT FROM CUSTOMER_POINT_VW_01 WHERE CONVERT(NVARCHAR,CDATE,112) >= @FISRT_DATE AND CONVERT(NVARCHAR,CDATE,112) <= @LAST_DATE ORDER BY CDATE DESC",
                        param : ['FISRT_DATE:date','LAST_DATE:date'],
                        value : [this.dtDate.startDate,this.dtDate.endDate]
                    },
                    sql : this.core.sql
                }
            }
            App.instance.setState({isExecute:true})
            await this.grdUseingPointReport.dataRefresh(tmpSource)
            App.instance.setState({isExecute:false})
        }
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
                        </div>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-6">
                            <Form>
                                <Item>
                                    <Label text={this.lang.t("dtDate")} alignment="right" />
                                    <NbDateRange id={"dtDate"} parent={this} startDate={moment(new Date())} endDate={moment(new Date())}/>
                                </Item>
                            </Form>
                           
                        </div>
                        <div className="col-3">
                            <Form>
                                <Item>
                                    <Label text={this.t("chkTicket")} alignment="right" />
                                    <NdCheckBox id="chkTicket" parent={this} defaultValue={false}
                                    onValueChanged={(e)=>
                                    {
                                    }}/>
                                </Item>
                            </Form>
                        </div>
                        <div className="col-3">
                            <NdButton text={this.t("btnGet")} type="success" width="100%" onClick={this.btnGetClick}></NdButton>
                        </div>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <NdGrid id="grdUseingPointReport" parent={this} 
                            selection={{mode:"single"}} 
                            showBorders={true}
                            height={'700'} 
                            width={'100%'}
                            filterRow={{visible:true}} 
                            headerFilter={{visible:true}}
                            columnAutoWidth={true}
                            allowColumnReordering={true}
                            allowColumnResizing={true}
                            loadPanel={{enabled:true}}
                            onRowDblClick={async(e)=>
                                {
                                    this.getDetail(e.data.ITEM_GRP_NAME)
                                }}
                            >                            
                                {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Paging defaultPageSize={20} /> : <Paging enabled={false} />}
                                {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Pager visible={true} allowedPageSizes={[5,10,50]} showPageSizeSelector={true} /> : <Paging enabled={false} />}
                                {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Scrolling mode="standart" /> : <Scrolling mode="infinite" />}
                                <StateStoring enabled={true} type="custom" customLoad={this.loadState} customSave={this.saveState} storageKey={this.props.data.id + "_grdGroupSalesReport"}/>
                                <ColumnChooser enabled={true} />
                                <Export fileName={this.lang.t("menuOff.pos_02_009")} enabled={true} allowExportSelectedData={true} />
                                <Column dataField="CDATE" caption={this.t("grdUseingPointReport.clmDate")} dataType="datetime" format={"dd/MM/yyyy - HH:mm:ss"} visible={true} width={100}/> 
                                <Column dataField="CUSTOMER_CODE" caption={this.t("grdUseingPointReport.clmCustomerCode")} visible={true} width={100}/> 
                                <Column dataField="CUSTOMER_NAME" caption={this.t("grdUseingPointReport.clmCustomerName")} visible={true} width={300}/> 
                                <Column dataField="TICKET" caption={this.t("grdUseingPointReport.clmTicket")} visible={true} width={150} allowHeaderFiltering={false}/> 
                                <Column dataField="USE_POINT" caption={this.t("grdUseingPointReport.clmPoint")} visible={true} width={150} allowHeaderFiltering={false}/> 
                                <Column dataField="DESCRIPTION" caption={this.t("grdUseingPointReport.clmDescription")} visible={true} width={150} allowHeaderFiltering={false}/> 
                            </NdGrid>
                        </div>
                    </div>
                </ScrollView>
            </div>
        )
    }
}