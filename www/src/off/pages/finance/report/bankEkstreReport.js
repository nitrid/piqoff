import React from 'react';
import App from '../../../lib/app.js';
import moment from 'moment';
import Toolbar,{Item} from 'devextreme-react/toolbar';
import ScrollView from 'devextreme-react/scroll-view';
import NdGrid,{Column,ColumnChooser,Paging,Pager,Scrolling,Export,Summary,TotalItem,StateStoring} from '../../../../core/react/devex/grid.js';
import NdSelectBox from '../../../../core/react/devex/selectbox.js';
import NbDateRange from '../../../../core/react/bootstrap/daterange.js';
import NdButton from '../../../../core/react/devex/button.js';
import { dialog } from '../../../../core/react/devex/dialog.js';
import { NdForm,NdItem,NdLabel} from '../../../../core/react/devex/form.js';

export default class bankEkstreReport extends React.PureComponent
{
    constructor(props)
    {
        super(props)

        this.core = App.instance.core;

        this.btnGetirClick = this.btnGetirClick.bind(this)
        this.loadState = this.loadState.bind(this)
        this.saveState = this.saveState.bind(this)
    }
    componentDidMount()
    {
        setTimeout(async () => { this.Init() }, 1000);
    }
    loadState()
    {
        let tmpLoad = this.access.filter({ELEMENT:'grdListeState',USERS:this.user.CODE})
        return tmpLoad.getValue()
    }
    saveState(e)
    {
        let tmpSave = this.access.filter({ELEMENT:'grdListeState',USERS:this.user.CODE, PAGE:this.props.data.id, APP:"OFF"})
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
                    query : `SELECT *,CASE WHEN INPUT = @BANK THEN AMOUNT ELSE (AMOUNT * -1) END AS DOC_AMOUNT, 
                            (SELECT TOP 1 VALUE FROM DB_LANGUAGE WHERE TAG = (SELECT [dbo].[FN_DOC_CUSTOMER_TYPE_NAME](TYPE,DOC_TYPE,REBATE,PAY_TYPE)) AND LANG = @LANG) AS TYPE_NAME 
                            FROM DOC_CUSTOMER_VW_01 WHERE ((INPUT = @BANK) OR (OUTPUT  = @BANK)) AND DOC_DATE >= @FIRST_DATE AND DOC_DATE <= @LAST_DATE ORDER BY DOC_DATE`,
                            param : ['FIRST_DATE:date','LAST_DATE:date','BANK:string|50','LANG:string|50'],
                    value : [this.dtDate.startDate,this.dtDate.endDate,this.cmbBank.value,localStorage.getItem('lang')]
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
                                                id:'msgClose',showTitle:true,title:this.lang.t("msgWarning"),showCloseButton:true,width:'500px',height:'200px',
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
                                    <NdLabel text={this.t("cmbBank")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbBank"
                                    displayExpr="NAME"                       
                                    valueExpr="GUID"
                                    value=""
                                    searchEnabled={true}
                                    notRefresh={true}
                                    data={{source:{select:{query : `SELECT * FROM BANK_VW_01`},sql:this.core.sql}}}
                                    />
                                </NdItem>
                                <NdItem>
                                    <NdLabel text={this.t("dtDate")} alignment="right" />
                                    <NbDateRange id={"dtDate"} parent={this} startDate={moment().startOf('month')} endDate={moment().endOf('month')}/>
                                </NdItem>
                            </NdForm>
                        </div>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-3"></div>
                        <div className="col-3"></div>
                        <div className="col-3"></div>
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
                                <StateStoring enabled={true} type="custom" customLoad={this.loadState} customSave={this.saveState} storageKey={this.props.data.id + "_grdSlsContList"}/>
                                <ColumnChooser enabled={true} />
                                <Export fileName={this.lang.t("menuOff.slsRpt_01_003")} enabled={true} allowExportSelectedData={true} />
                                <Column dataField="DOC_DATE" caption={this.t("grdListe.clmDocDate")} visible={true} dataType="date" width={100}
                                editorOptions={{value:null}}
                                cellRender={(e) => 
                                {
                                    if(moment(e.value).format("YYYY-MM-DD") != '1970-01-01')
                                    {
                                        return e.text
                                    }
                                    return
                                }}/>
                                <Column dataField="TYPE_NAME" caption={this.t("grdListe.clmTypeName")} width={120} visible={true}/> 
                                <Column dataField="OUTPUT_NAME" caption={this.t("grdListe.clmOutputName")} width={120} visible={true}/> 
                                <Column dataField="INPUT_NAME" caption={this.t("grdListe.clmInputName")} width={120} visible={true}/> 
                                <Column dataField="REF" caption={this.t("grdListe.clmRef")} width={90} visible={true}/> 
                                <Column dataField="REF_NO" caption={this.t("grdListe.clmRefNo")} width={90} visible={true}/> 
                                <Column dataField="DOC_AMOUNT" caption={this.t("grdListe.clmAmount")}  format={{ style: "currency", currency: Number.money.code,precision: 2}} width={100} visible={true}/> 
                                <Column dataField="DESCRIPTION" caption={this.t("grdListe.clmDescription")} width={100} visible={true}/> 
                                <Summary>
                                    <TotalItem
                                    column="DOC_AMOUNT"
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