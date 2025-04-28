import React from 'react';
import App from '../lib/app.js';
import moment from 'moment';
import ScrollView from 'devextreme-react/scroll-view';
import NbButton from '../../core/react/bootstrap/button';
import NdTextBox,{ Button,Validator, NumericRule, RequiredRule, CompareRule } from '../../core/react/devex/textbox'
import NdSelectBox from '../../core/react/devex/selectbox'
import NdButton from '../../core/react/devex/button'
import NbPopUp from '../../core/react/bootstrap/popup';
import Form, { Label,Item, EmptyItem } from 'devextreme-react/form';
import Toolbar from 'devextreme-react/toolbar';
import { LoadPanel } from 'devextreme-react/load-panel';
import NdGrid,{Column, ColumnChooser,ColumnFixing,Paging,Pager,Scrolling,Export, Summary, TotalItem}from '../../core/react/devex/grid.js';
import NbDateRange from '../../core/react/bootstrap/daterange.js';
import NdPopUp from '../../core/react/devex/popup.js';


export default class extract extends React.PureComponent
{
    constructor(props)
    {
        super(props)
        this.core = App.instance.core;
        this.t = App.instance.lang.getFixedT(null,null,"extract")
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
            this.txtCustomerCode.GUID = ''
        }, 500);
        this.init()
    }
    async init()
    {
        
    }
    async _btnGetirClick()
    {
        if(this.txtCustomerCode.GUID != '')
        {
            let tmpSource =
            {
                source : 
                {
                    groupBy : this.groupList,
                    select : 
                    {
                        query : "SELECT 0 AS DOC_TYPE,'00000000-0000-0000-0000-000000000000' AS DOC_GUID," +
                        "CONVERT(DATETIME,@FIRST_DATE) - 1 AS DOC_DATE,  " +
                        "'' AS REF,  " +
                        "0 AS REF_NO,  " +
                        "'' AS TYPE_NAME,  " +
                        "CASE WHEN (SELECT [dbo].[FN_CUSTOMER_BALANCE](@CUSTOMER,@FIRST_DATE)) < 0 THEN  (SELECT [dbo].[FN_CUSTOMER_BALANCE](@CUSTOMER,@FIRST_DATE)) ELSE 0 END AS DEBIT,  " +
                        "CASE WHEN (SELECT [dbo].[FN_CUSTOMER_BALANCE](@CUSTOMER,@FIRST_DATE)) > 0 THEN  (SELECT [dbo].[FN_CUSTOMER_BALANCE](@CUSTOMER,@FIRST_DATE)) ELSE 0  END AS RECEIVE,  " +
                        "(SELECT [dbo].[FN_CUSTOMER_BALANCE](@CUSTOMER,@FIRST_DATE)) AS BALANCE  " +
                        "UNION ALL " +
                        "SELECT DOC_TYPE,  " +
                        "DOC_GUID, " +
                        "DOC_DATE, " +
                        "REF, " +
                        "REF_NO, " +
                        "(SELECT TOP 1 VALUE FROM DB_LANGUAGE WHERE TAG = (SELECT [dbo].[FN_DOC_CUSTOMER_TYPE_NAME](TYPE,DOC_TYPE,REBATE,PAY_TYPE)) AND LANG = @LANG) AS TYPE_NAME,  " +
                        "CASE TYPE WHEN 0 THEN (AMOUNT * -1) ELSE 0 END AS DEBIT,  " +
                        "CASE TYPE WHEN 1 THEN AMOUNT ELSE 0 END AS RECEIVE,  " +
                        "CASE TYPE WHEN 0 THEN (AMOUNT * -1) WHEN 1 THEN AMOUNT END AS BALANCE  " +
                        "FROM DOC_CUSTOMER_VW_01  " +
                        "WHERE (INPUT = @CUSTOMER OR OUTPUT = @CUSTOMER)  " +
                        "AND DOC_DATE >= @FIRST_DATE AND DOC_DATE <= @LAST_DATE  " ,
                        param : ['CUSTOMER:string|50','LANG:string|10','FIRST_DATE:date','LAST_DATE:date'],
                        value : [this.txtCustomerCode.GUID,localStorage.getItem('lang'),this.dtDate.startDate,this.dtDate.endDate]
                    },
                    sql : this.core.sql
                }
            }
            this.setState({isExecute:true})
            await this.grdListe.dataRefresh(tmpSource)
            this.setState({isExecute:false})
            let tmpBalance = this.grdListe.data.datatable.sum("BALANCE",2)
            this.txtTotalBalance.setState({value:tmpBalance})
            let tmpLineBalance = 0;
            for (let i = 0; i < this.grdListe.data.datatable.length; i++) 
            {
                tmpLineBalance += this.grdListe.data.datatable[i].BALANCE;
                this.grdListe.data.datatable[i].BALANCE = tmpLineBalance.toFixed(2);
                console.log(this.grdListe.data.datatable[i].BALANCE)
                console.log(tmpLineBalance)
            }
            await this.grdListe.dataRefresh(this.grdListe.data.datatable)
        }
        else
        {
            let tmpConfObj =
            {
                id:'msgNotCustomer',showTitle:true,title:this.t("msgNotCustomer.title"),showCloseButton:true,width:'500px',height:'200px',
                button:[{id:"btn01",caption:this.t("msgNotCustomer.btn01"),location:'after'}],
                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgNotCustomer.msg")}</div>)
            }
            await dialog(tmpConfObj);
        }
           
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
                                }                                                    
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
                                <Column dataField="TYPE_NAME" caption={this.t("grdListe.clmTypeName")} visible={true} width={100}/> 
                                <Column dataField="REF" caption={this.t("grdListe.clmRef")} visible={true} width={100}/> 
                                <Column dataField="REF_NO" caption={this.t("grdListe.clmRefNo")} visible={true} width={80}/> 
                                <Column dataField="DEBIT" caption={this.t("grdListe.clmDebit")} format={{ style: "currency", currency: "EUR",precision: 2}} visible={true}/> 
                                <Column dataField="RECEIVE" caption={this.t("grdListe.clmReceive")} format={{ style: "currency", currency: "EUR",precision: 2}} visible={true}/> 
                                <Column dataField="BALANCE" caption={this.t("grdListe.clmBalance")} format={{ style: "currency", currency: "EUR",precision: 2}} visible={true}/>
                                <Summary>
                                    <TotalItem
                                    column="DEBIT"
                                    summaryType="sum"
                                    valueFormat={{ style: "currency", currency: "EUR",precision: 2}} />
                                     <TotalItem
                                    column="RECEIVE"
                                    summaryType="sum"
                                    valueFormat={{ style: "currency", currency: "EUR",precision: 2}} />
                                </Summary> 
                            </NdGrid>
                        </div>
                        <div style={{paddingTop:"15px"}}>
                            <Form colCount={2}>
                                <EmptyItem colSpan={1}></EmptyItem>
                                <Item>
                                    <Label text={this.t("txtTotalBalance")} alignment="right" />
                                        <NdTextBox id="txtTotalBalance" parent={this} simple={true} readOnly={true}/>
                                </Item>
                            </Form>    
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
                                            this.txtCustomerCode.GUID = this.grdCustomer.getSelectedData()[0].GUID
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
                    {/* Detail PopUp      */}
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
                          <div className="col-1 pe-0"></div>
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