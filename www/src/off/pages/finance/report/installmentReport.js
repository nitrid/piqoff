import React from 'react';
import App from '../../../lib/app.js';
import moment from 'moment';
import Toolbar,{Item} from 'devextreme-react/toolbar';
import ScrollView from 'devextreme-react/scroll-view';
import NdGrid,{Column,ColumnChooser,Paging,Pager,Scrolling,Export,Summary,TotalItem,StateStoring} from '../../../../core/react/devex/grid.js';
import NbDateRange from '../../../../core/react/bootstrap/daterange.js';
import NdButton from '../../../../core/react/devex/button.js';
import { dialog } from '../../../../core/react/devex/dialog.js';
import { NdForm,NdItem,NdLabel} from '../../../../core/react/devex/form.js';

export default class installmentReport extends React.PureComponent
{
    constructor(props)
    {
        super(props)
        this.core = App.instance.core;
        this.loadState = this.loadState.bind(this)
        this.saveState = this.saveState.bind(this)
        this.btnGetirClick = this.btnGetirClick.bind(this)
    }
    componentDidMount()
    {
        setTimeout(async () => 
        {
        }, 1000);
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
                    query : "SELECT * FROM [DOC_INSTALLMENT_VW_01] WHERE INSTALLMENT_DATE >= @FIRST_DATE AND INSTALLMENT_DATE <= @LAST_DATE ORDER BY INSTALLMENT_DATE" ,
                    param : ['FIRST_DATE:date','LAST_DATE:date'],
                    value : [this.dtDate.startDate,this.dtDate.endDate]
                },
                sql : this.core.sql
            }
        }
        await this.grdListe.dataRefresh(tmpSource)
    }
    loadState()
    {
        let tmpLoad = this.access.filter({ELEMENT:'grdListeState',USERS:this.user.CODE})
        return tmpLoad.getValue()
    }
    saveState(e)
    {
        let tmpSave = this.access.filter({ELEMENT:'grdListeState',USERS:this.user.CODE})
        tmpSave.setValue(e)
        tmpSave.save()
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
                                    <NdLabel text={this.t("dtDate")} alignment="right" />
                                    <NbDateRange id={"dtDate"} parent={this} startDate={moment().startOf('month')} endDate={moment().endOf('month')}/>
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
                                {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Scrolling mode="standart" /> : <Scrolling mode="infinite" />}
                                <StateStoring enabled={true} type="custom" customLoad={this.loadState} customSave={this.saveState} storageKey={this.props.data.id + "_grdColListe"}/>
                                <ColumnChooser enabled={true} />
                                <Export fileName={this.lang.t("menuOff.slsRpt_01_003")} enabled={true} allowExportSelectedData={true} />
                                <Column dataField="CUSTOMER_CODE" caption={this.t("grdListe.clmCustomerCode")} width={200} visible={true}/> 
                                <Column dataField="CUSTOMER_NAME" caption={this.t("grdListe.clmCustomerName")} width={300} visible={true}/> 
                                <Column dataField="INSTALLMENT_DATE" caption={this.t("grdListe.clmDocDate")} visible={true} dataType="date" width={120}
                                editorOptions={{value:null}}
                                cellRender={(e) => 
                                {
                                    if(moment(e.value).format("YYYY-MM-DD") != '1970-01-01')
                                    {
                                        return e.text
                                    }
                                    
                                    return
                                }}/>
                                <Column dataField="INSTALLMENT_NO" caption={this.t("grdListe.clmInstallmentNo")} width={90} visible={true}/> 
                                <Column dataField="AMOUNT" caption={this.t("grdListe.clmAmount")} width={150} visible={true}/> 
                                <Column dataField="STATUS" caption={this.t("grdListe.clmStatus")} width={100} visible={true}/> 
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