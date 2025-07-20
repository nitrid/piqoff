import React from 'react';
import App from '../../../lib/app.js';
import moment from 'moment';

import Toolbar,{Item} from 'devextreme-react/toolbar';
import ScrollView from 'devextreme-react/scroll-view';

import NdGrid,{Column, ColumnChooser,Paging,Pager,Scrolling,Export,StateStoring} from '../../../../core/react/devex/grid.js';
import NdTextBox from '../../../../core/react/devex/textbox.js'
import NdSelectBox from '../../../../core/react/devex/selectbox.js';
import NdButton from '../../../../core/react/devex/button.js';
import NdDatePicker from '../../../../core/react/devex/datepicker.js';
import { dialog } from '../../../../core/react/devex/dialog.js';
import { NdForm, NdItem, NdLabel, NdEmptyItem }from '../../../../core/react/devex/form.js';
import { NdToast } from '../../../../core/react/devex/toast.js';

export default class virement extends React.PureComponent
{
    constructor(props)
    {
        super(props)

        this.btnGetClick = this.btnGetClick.bind(this)
        this.core = App.instance.core;
        this.loadState = this.loadState.bind(this)
        this.saveState = this.saveState.bind(this)
    }
    componentDidMount()
    {
        setTimeout(async () => { this.Init() }, 1000);
    }
    async Init()
    {
        this.dtFirst.value=moment(new Date()).format("YYYY-MM-DD");
        this.dtLast.value=moment(new Date()).format("YYYY-MM-DD");
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
    async btnGetClick()
    {
        if(this.cmbBank.value == '')
        {
            this.toast.show({type:"warning",message:this.t("msgNotBank.msg")})
            return
        }
        let tmpSource =
        {
            source : 
            {
                select : 
                {
                    query : `SELECT REF,REF_NO,OUTPUT_NAME,INPUT_NAME,AMOUNT,DOC_DATE FROM DOC_CUSTOMER_VW_01 
                            WHERE ((INPUT = @BANK) OR (OUTPUT = @BANK)) AND 
                            ((DOC_DATE >= @FIRST_DATE) OR (@FIRST_DATE = '19700101')) AND ((DOC_DATE <= @LAST_DATE) OR (@LAST_DATE = '19700101'))  
                            AND  DOC_TYPE IN(200,201) `,
                    param : ['BANK:string|50','FIRST_DATE:date','LAST_DATE:date'],
                    value : [this.cmbBank.value,this.dtFirst.value,this.dtLast.value]
                },
                sql : this.core.sql
            }
        }
        App.instance.setState({isExecute:true})
        await this.grdBankList.dataRefresh(tmpSource)
        App.instance.setState({isExecute:false})

        let tmpQuery = 
        {
            query : `SELECT [dbo].[FN_BANK_AMOUNT](@BANK,dbo.GETDATE()) AS TOTAL`,
            param : ['BANK:string|50'],
            value : [this.cmbBank.value]
        }

        let tmpData = await this.core.sql.execute(tmpQuery) 

        if(tmpData.result.recordset.length > 0)
        {
            let txtTotal = tmpData.result.recordset[0].TOTAL
            this.txtAmount.setState({value:txtTotal + ' ' + Number.money.sign});
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
                                        icon: 'add',
                                        onClick: async () => 
                                        {
                                            App.instance.menuClick(
                                            {
                                                id: 'fns_02_001',
                                                text: this.t('menu'),
                                                path: 'finance/documents/payment.js'
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
                            <NdForm colCount={2} id="frmCriter">
                                {/* dtFirst */}
                                <NdItem>
                                    <NdLabel text={this.t("dtFirst")} alignment="right" />
                                    <NdDatePicker simple={true}  parent={this} id={"dtFirst"} />  
                                </NdItem>
                                {/* dtLast */}
                                <NdItem>
                                    <NdLabel text={this.t("dtLast")} alignment="right" />
                                    <NdDatePicker simple={true}  parent={this} id={"dtLast"} />  
                                </NdItem>
                                 {/* cmbBank */}
                                 <NdItem>
                                    <NdLabel text={this.t("cmbBank")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbBank" notRefresh = {true}
                                    displayExpr="NAME"                       
                                    valueExpr="GUID"
                                    value=""
                                    searchEnabled={true}
                                    data={{source:{select:{query : `SELECT * FROM BANK_VW_01`},sql:this.core.sql}}}
                                    param={this.param.filter({ELEMENT:'cmbBank',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'cmbBank',USERS:this.user.CODE})}
                                    />
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
                            <NdButton text={this.t("btnGet")} type="success" width="100%" onClick={this.btnGetClick}></NdButton>
                        </div>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <NdGrid id="grdBankList" parent={this} 
                            selection={{mode:"multiple"}} 
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
                                <StateStoring enabled={true} type="custom" customLoad={this.loadState} customSave={this.saveState} storageKey={this.props.data.id + "_grdSlsContList"}/>
                                <ColumnChooser enabled={true} />
                                <Export fileName={this.lang.t("menuOff.fns_01_003")} enabled={true} allowExportSelectedData={true} />
                                <Column dataField="REF" caption={this.t("grdBankList.clmRef")} visible={true} width={200}/> 
                                <Column dataField="REF_NO" caption={this.t("grdBankList.clmRefNo")} visible={true} width={100}/> 
                                <Column dataField="OUTPUT_NAME" caption={this.t("grdBankList.clmOutputName")} visible={true}/> 
                                <Column dataField="INPUT_NAME" caption={this.t("grdBankList.clmInputName")} visible={true}/> 
                                <Column dataField="AMOUNT" caption={this.t("grdBankList.clmAmount")} visible={true} format={{ style: "currency", currency: Number.money.code,precision: 2}}/> 
                                <Column dataField="DOC_DATE" caption={this.t("grdBankList.clmDate")} visible={true} width={200}
                                editorOptions={{value:null}}
                                cellRender={(e) => 
                                {
                                    if(moment(e.value).format("YYYY-MM-DD") != '1970-01-01')
                                    {
                                        return moment(e.value).format("YYYY-MM-DD")
                                    }
                                    
                                    return
                                }}/> 
                            </NdGrid>
                        </div>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <NdForm colCount={4} parent={this}>                            
                                {/* TOPLAM */}
                                <NdEmptyItem />
                                <NdItem>
                                <NdLabel text={this.t("txtAmount")} alignment="right" />
                                    <NdTextBox id="txtAmount" parent={this} simple={true} readOnly={true}/>
                                </NdItem>
                            </NdForm>
                        </div>
                        <NdToast id={"toast"} parent={this} displayTime={2000} position={{at:"top center",offset:'0px 110px'}}/>
                    </div>
                </ScrollView>
            </div>
        )
    }
}