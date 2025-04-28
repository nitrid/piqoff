import React from 'react';
import App from '../lib/app.js';
import moment from 'moment';
import ScrollView from 'devextreme-react/scroll-view';
import NbButton from '../../core/react/bootstrap/button.js';
import NdTextBox,{ Button,Validator, NumericRule, RequiredRule, CompareRule } from '../../core/react/devex/textbox.js'
import NdSelectBox from '../../core/react/devex/selectbox.js'
import NdButton from '../../core/react/devex/button.js'
import NbPopUp from '../../core/react/bootstrap/popup.js';
import Form, { Label,Item, EmptyItem } from 'devextreme-react/form';
import Toolbar from 'devextreme-react/toolbar';
import { LoadPanel } from 'devextreme-react/load-panel';
import NdGrid,{Column, ColumnChooser,ColumnFixing,Paging,Pager,Scrolling,Export, Summary, TotalItem}from '../../core/react/devex/grid.js';
import NbDateRange from '../../core/react/bootstrap/daterange.js';
import NdPopUp from '../../core/react/devex/popup.js';


export default class openInvoiceList extends React.PureComponent
{
    constructor(props)
    {
        super(props)
        this.core = App.instance.core;
        this.t = App.instance.lang.getFixedT(null,null,"openInvoiceList")
        this.lang = App.instance.lang;
        this.state = 
        {
            isExecute : false
        }

        this._customerSearch = this._customerSearch.bind(this)
        this._btnGetirClick = this._btnGetirClick.bind(this)
    }
    async componentDidMount()
    {
        await this.core.util.waitUntil(0)
        setTimeout(async () => 
        {
            this.txtCustomerCode.CODE = ''
        }, 500);
        this.init()
    }
    async init()
    {

    }
    async _btnGetirClick()
    {
        let tmpSource =
        {
            source : 
            {
                groupBy : this.groupList,
                select : 
                {
                    query : "SELECT " +
                    "TYPE," +
                    "DOC_DATE," +
                    "DOC_TYPE," +
                    "INPUT_CODE," +
                    "INPUT_NAME," +
                    "DOC_REF," +
                    "DOC_REF_NO," +
                    "DOC_TOTAL," +
                    "PAYING_AMOUNT, " +
                    "ROUND((DOC_TOTAL -  PAYING_AMOUNT),2) AS REMAINDER " +
                    "FROM DEPT_CREDIT_MATCHING_VW_03 " +
                    "WHERE TYPE = 1 AND DOC_TYPE = 20 AND ((INPUT_CODE = @INPUT_CODE) OR (@INPUT_CODE = '')) AND DOC_DATE >= @FIRST_DATE AND DOC_DATE <= @LAST_DATE AND ((DOC_TOTAL - PAYING_AMOUNT) > 0) " +
                    "GROUP BY DOC_TYPE,TYPE,DOC_DATE,INPUT_NAME,DOC_REF_NO,DOC_REF,PAYING_AMOUNT,INPUT_CODE,DOC_TOTAL",
                    param : ['FIRST_DATE:date','LAST_DATE:date','INPUT_CODE:string|50'],
                    value : [this.dtDate.startDate,this.dtDate.endDate,this.txtCustomerCode.CODE],
                },
                sql : this.core.sql
            }
        }
        this.setState({isExecute:true})
        await this.grdListe.dataRefresh(tmpSource)
        this.setState({isExecute:false})
        await this.grdListe.dataRefresh(this.grdListe.data.datatable)
    }
    async _customerSearch()
    {
        let tmpSource =
        {
            source : 
            {
                groupBy : this.groupList,
                select : 
                {
                    query : "SELECT GUID,CODE,TITLE,NAME,LAST_NAME,[TYPE_NAME],[GENUS_NAME] FROM CUSTOMER_VW_02 WHERE (UPPER(CODE) LIKE UPPER('%' + @VAL + '%') OR UPPER(TITLE) LIKE UPPER('%' + @VAL + '%')) AND STATUS = 1",
                    param : ['VAL:string|50'],
                    value : [this.txtCustomerSearch.value]
                },
                sql : this.core.sql
            }
        }
        this.setState({isExecute:true})
        await this.grdCustomer.dataRefresh(tmpSource)
        this.setState({isExecute:false})
    }
    async btnGetDetail(pGuid)
    {
        let tmpSource =
        {
            source : 
            {
                groupBy : this.groupList,
                select : 
                {
                    query : "SELECT ITEM_CODE,ITEM_NAME,QUANTITY,PRICE,TOTAL FROM DOC_ITEMS_VW_01 WHERE DOC_GUID = @DOC_GUID OR INVOICE_DOC_GUID = @DOC_GUID" ,
                    param : ['DOC_GUID:string|50'],
                    value : [pGuid]
                },
                sql : this.core.sql
            }
        }
        await this.grdDetail.dataRefresh(tmpSource)
        this.popDetail.show()
    }
    render()
    {
        return(
            <div>
                <LoadPanel
                shadingColor="rgba(0,0,0,0)"
                position={{ of: '#root' }}
                visible={this.state.isExecute}
                showIndicator={true}
                shading={true}
                showPane={true}
                />
                <div style={{height:'50px',backgroundColor:'#f5f6fa',top:'65px',position:'sticky',borderBottom:'1px solid #7f8fa6'}}>
                    <div className="row">
                        <div className="col-6" align="center" style={{paddingRight:'4px', paddingTop:'5px'}}>
                            <NdTextBox id={"txtCustomerCode"} parent={this} simple={true} placeholder={this.t("txtCustomerCode")} readOnly={true}
                            button={
                            [
                                {
                                    id:'01',
                                    icon:'more',
                                    location:'after',
                                    onClick:async()=>
                                    {
                                        this.popCustomer.show()
                                    }
                                },
                                {
                                    id:'02',
                                    icon:'clear',
                                    location:'after',
                                    onClick:async()=>
                                    {
                                        this.txtCustomerCode.value = ''
                                        this.txtCustomerCode.CODE = ''
                                        
                                    }
                                },                                            
                            ]}
                            />
                        </div>
                        <div className="col-6" align="left" style={{paddingTop:'5px'}}>
                            <NbDateRange id={"dtDate"} parent={this} startDate={moment().startOf('year')} endDate={moment().endOf('year')}/>
                        </div>
                        <div className='row'>
                            <div className="col-6" align="left" style={{paddingRight:'4px',paddingTop:'5px'}}>
                            </div>
                            <div className="col-6" align="left" style={{paddingRight:'4px',paddingTop:'5px'}}>
                                <NdButton text={this.t("btnGet")} type="success" width="100%" onClick={this._btnGetirClick}></NdButton>
                            </div>
                        </div>
                    </div>
                </div>
                <div style={{paddingTop:"65px", marginTop:"65px"}}>
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <NdGrid id="grdListe" parent={this} 
                            selection={{mode:"single"}} 
                            showBorders={true}
                            filterRow={{visible:true}} 
                            headerFilter={{visible:false}}
                            height={'800'} 
                            width={'100%'}
                            columnAutoWidth={true}
                            allowColumnReordering={true}
                            allowColumnResizing={true}
                            loadPanel={{enabled:true}}
                            onRowDblClick={async(e)=>
                            {
                                if(e.data.DOC_TYPE >= 20 && e.data.DOC_TYPE <= 39)
                                {
                                    this.btnGetDetail(e.data.DOC_GUID)
                                }
                            }}
                            >                            
                                <Paging defaultPageSize={20} />
                                <Pager visible={true} allowedPageSizes={[5,10,20,30,50]} showPageSizeSelector={true} />
                                <Export fileName={this.lang.t("report")} enabled={true} allowExportSelectedData={true} />
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
                                <Column dataField="INPUT_NAME" caption={this.t("grdListe.clmTypeName")} visible={true} width={250}/> 
                                <Column dataField="INPUT_CODE" caption={this.t("grdListe.clmRef")} visible={true} width={100}/> 
                                <Column dataField="DOC_REF_NO" caption={this.t("grdListe.clmRefNo")} visible={true} width={80}/> 
                                <Column dataField="DOC_TOTAL" caption={this.t("grdListe.clmDebit")} format={{ style: "currency", currency: "EUR",precision: 2}} visible={true}/> 
                                <Column dataField="PAYING_AMOUNT" caption={this.t("grdListe.clmReceive")} format={{ style: "currency", currency: "EUR",precision: 2}} visible={true}/> 
                                <Column dataField="REMAINDER" caption={this.t("grdListe.clmBalance")} format={{ style: "currency", currency: "EUR",precision: 2}} visible={true}/>
                                <Summary>
                                     <TotalItem
                                    column="REMAINDER"
                                    summaryType="sum"
                                    valueFormat={{ style: "currency", currency: "EUR",precision: 2}} />
                                </Summary> 
                            </NdGrid>
                        </div>
                    </div>
                    {/* CARI SECIMI POPUP */}
                    <div>                            
                        <NbPopUp id={"popCustomer"} parent={this} title={""} fullscreen={true}>
                            <div>
                                <div className='row' style={{paddingTop:"10px"}}>
                                    <div className='col-10' align={"left"}>
                                        <h2 className='text-danger'>{this.t('popCustomer.title')}</h2>
                                    </div>
                                    <div className='col-2' align={"right"}>
                                        <NbButton className="form-group btn btn-block btn-outline-dark" style={{height:"40px",width:"40px"}}
                                        onClick={()=>
                                        {
                                            this.popCustomer.hide();
                                        }}>
                                            <i className="fa-solid fa-xmark fa-1x"></i>
                                        </NbButton>
                                    </div>
                                </div>                                    
                                <div className='row' style={{paddingTop:"10px"}}>
                                    <div className='col-12'>
                                        <NdTextBox id="txtCustomerSearch" parent={this} simple={true} selectAll={true}
                                        onEnterKey={(async()=>
                                            {
                                                this._customerSearch()
                                            }).bind(this)}/>
                                    </div>
                                </div>
                                <div className='row' style={{paddingTop:"10px"}}>
                                    <div className='col-6'>
                                        <NbButton className="btn btn-block btn-primary" style={{width:"100%"}}
                                        onClick={()=>
                                        {
                                            this._customerSearch()
                                        }}>
                                            {this.t('popCustomer.btn01')}
                                        </NbButton>
                                    </div>
                                    <div className='col-6'>
                                        <NbButton className="btn btn-block btn-primary" style={{width:"100%"}}
                                        onClick={(async()=>
                                        {
                                            this.txtCustomerCode.CODE = this.grdCustomer.getSelectedData()[0].CODE
                                            this.txtCustomerCode.value = this.grdCustomer.getSelectedData()[0].TITLE
                                            this.popCustomer.hide();
                                        }).bind(this)}>
                                            {this.t('popCustomer.btn02')}
                                        </NbButton>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col-12'>
                                        <NdGrid parent={this} id={"grdCustomer"} 
                                        showBorders={true} 
                                        columnsAutoWidth={true} 
                                        headerFilter={{visible:true}}
                                        selection={{mode:"single"}}
                                        height={'400'}
                                        width={'100%'}
                                        >
                                            <Paging defaultPageSize={10} />
                                            <Pager visible={true} allowedPageSizes={[5,10,20,50,100]} showPageSizeSelector={true} />
                                            <Scrolling mode="standart" />
                                            <Column dataField="CODE" caption={this.t("popCustomer.clmCode")} width={200}/>
                                            <Column dataField="TITLE" caption={this.t("popCustomer.clmName")} width={400}/>
                                        </NdGrid>
                                    </div>
                                </div>
                            </div>
                        </NbPopUp>
                    </div>     
                    {/* DETAIL POPUP */}
                    <div>
                        <NdPopUp parent={this} id={"popDetail"} 
                        visible={false}                        
                        showCloseButton={true}
                        showTitle={true}
                        title={this.t("popDetail.title")}
                        container={"#root"} 
                        width={'100%'}
                        height={'100%'}
                        position={{of:'#root'}}
                        >
                            <div className="row">
                                <div className="col-12 pe-0">
                                    <NdGrid id="grdDetail" parent={this} 
                                        selection={{mode:"single"}} 
                                        showBorders={true}
                                        filterRow={{visible:true}} 
                                        headerFilter={{visible:true}}
                                        columnAutoWidth={true}
                                        allowColumnReordering={true}
                                        allowColumnResizing={true}
                                        >                            
                                            <Paging defaultPageSize={20} />
                                            <Pager visible={true} allowedPageSizes={[5,10,50]} showPageSizeSelector={true} />
                                            <Export fileName={this.lang.t("menu.pos_02_001")} enabled={true} allowExportSelectedData={true} />
                                            <Column dataField="ITEM_CODE" caption={this.t("grdDetail.clmCode")} visible={true} width={120}/> 
                                            <Column dataField="ITEM_NAME" caption={this.t("grdDetail.clmName")} visible={true} width={250}/> 
                                            <Column dataField="QUANTITY" caption={this.t("grdDetail.clmQuantity")} visible={true} width={100}/> 
                                            <Column dataField="PRICE" caption={this.t("grdDetail.clmPrice")} visible={true} width={100} format={{ style: "currency", currency: "EUR",precision: 2}}/> 
                                            <Column dataField="TOTAL" caption={this.t("grdDetail.clmTotal")} visible={true} width={150} format={{ style: "currency", currency: "EUR",precision: 2}}/> 
                                    </NdGrid>
                                </div>
                            </div>
                        </NdPopUp>
                    </div>                           
                </div>
            </div>
        )
    }
}