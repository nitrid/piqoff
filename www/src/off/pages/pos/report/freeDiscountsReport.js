import React from 'react';
import App from '../../../lib/app.js';
import moment from 'moment';

import Toolbar from 'devextreme-react/toolbar';
import Form, {Item, Label } from 'devextreme-react/form';
import ScrollView from 'devextreme-react/scroll-view';
import NdGrid,{Column,ColumnChooser,StateStoring,Paging,Pager,Scrolling,Export,Summary,TotalItem} from '../../../../core/react/devex/grid.js';
import NdTextBox from '../../../../core/react/devex/textbox.js'

import NdPopUp from '../../../../core/react/devex/popup.js';
import NdButton from '../../../../core/react/devex/button.js';
import NdDatePicker from '../../../../core/react/devex/datepicker.js';
import NdPopGrid from '../../../../core/react/devex/popgrid.js';
import  { dialog } from '../../../../core/react/devex/dialog.js';
import { datatable} from "../../../../core/core.js";
import {posDeviceCls} from "../../../../core/cls/pos.js";
import { nf525Cls } from "../../../../core/cls/nf525.js";


export default class freeDiscountsReport extends React.PureComponent
{
    constructor(props)
    {
        super(props)
        
        this.core = App.instance.core;

        this.btnGetClick = this.btnGetClick.bind(this)
        this.btnGetDetail = this.btnGetDetail.bind(this)
        this.posDevice = new posDeviceCls();
        this.lastPosDt = new datatable();
        this.lastPosSaleDt = new datatable();
        this.lastPosPayDt = new datatable();
        this.lastPosPromoDt = new datatable();  
        this.nf525 = new nf525Cls();
        this.state={ticketId :""}
        this.loadState = this.loadState.bind(this)
        this.saveState = this.saveState.bind(this)
        
        Number.money = this.sysParam.filter({ID:'MoneySymbol',TYPE:0}).getValue()

        this.tabIndex = props.data.tabkey
    }
    componentDidMount()
    {
        setTimeout(async () =>  { this.Init() }, 1000);
    }
    async Init()
    {
        this.dtFirst.value=moment(new Date()).format("YYYY-MM-DD");
        this.dtLast.value=moment(new Date()).format("YYYY-MM-DD");
        this.txtCustomerCode.CODE = ''
    }

    loadState()
    {
        let tmpLoad = this.access.filter({ELEMENT:'grdSaleTicketReportState',USERS:this.user.CODE})
        return tmpLoad.getValue()
    }
    saveState(e)
    {
        let tmpSave = this.access.filter({ELEMENT:'grdSaleTicketReportState',USERS:this.user.CODE, PAGE:this.props.data.id, APP:"OFF"})
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
                    query : `SELECT * 
                            FROM POS_VW_01 
                            WHERE DOC_DATE >= @FIRST_DATE AND DOC_DATE <= @LAST_DATE AND  
                            ((CUSTOMER_CODE = @CUSTOMER_CODE) OR (@CUSTOMER_CODE = '')) AND 
                            DISCOUNT > 0 `,
                    param : ['FIRST_DATE:date','LAST_DATE:date','CUSTOMER_CODE:string|50'],
                    value : [this.dtFirst.value,this.dtLast.value,this.txtCustomerCode.value]
                },
                sql : this.core.sql
            }
        }
        App.instance.loading.show()
        await this.grdSaleTicketReport.dataRefresh(tmpSource)
        App.instance.loading.hide()
    }
    async btnGetDetail(pGuid)
    {
        this.lastPosSaleDt.selectCmd = 
        {
            query : `SELECT CONVERT(NVARCHAR,CDATE,108) AS TIME,* FROM POS_SALE_VW_01  WHERE POS_GUID = @POS_GUID `,
            param : ['POS_GUID:string|50'],
            value : [pGuid]
        }
        
        await this.lastPosSaleDt.refresh()
        await this.grdSaleTicketItems.dataRefresh({source:this.lastPosSaleDt});
        
        this.popDetail.show()
    }
    render()
    {
        return(
            <div id={this.props.data.id + this.tabIndex}>
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
                            <Form colCount={4} id="frmCriter">
                                {/* dtFirst */}
                                <Item>
                                    <Label text={this.t("dtFirst")} alignment="right" />
                                    <NdDatePicker simple={true}  parent={this} id={"dtFirst"} />
                                </Item>
                                {/* dtLast */}
                                <Item>
                                    <Label text={this.t("dtLast")} alignment="right" />
                                    <NdDatePicker simple={true}  parent={this} id={"dtLast"} />
                                </Item>
                                <Item>
                                <Label text={this.t("txtCustomerCode")} alignment="right" />
                                <NdTextBox id="txtCustomerCode" parent={this} simple={true}  
                                upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                button=
                                {
                                    [
                                        {
                                            id:'01',
                                            icon:'more',
                                            onClick:()=>
                                            {
                                                this.pg_txtCustomerCode.show()
                                                this.pg_txtCustomerCode.onClick = (data) =>
                                                {
                                                    if(data.length > 0)
                                                    {
                                                        this.txtCustomerCode.setState({value:data[0].CODE})
                                                    }
                                                }
                                            }
                                        },
                                    ]
                                }
                                onEnterKey={(async()=>
                                    {
                                        await this.pg_txtCustomerCode.setVal(this.txtCustomerCode.value)
                                        this.pg_txtCustomerCode.show()
                                        this.pg_txtCustomerCode.onClick = (data) =>
                                        {
                                            if(data.length > 0)
                                            {
                                                this.txtCustomerCode.setState({value:data[0].CODE})
                                                this.txtCustomerName.setState({value:data[0].TITLE})
                                                this.btnGetClick()
                                            }
                                        }
                                    }).bind(this)}
                                >
                                </NdTextBox>
                                {/*CARI SECIMI POPUP */}
                                <NdPopGrid id={"pg_txtCustomerCode"} parent={this} container={'#' + this.props.data.id + this.tabIndex}  
                                visible={false}
                                position={{of:'#' + this.props.data.id + this.tabIndex}} 
                                showTitle={true} 
                                showBorders={true}
                                width={'90%'}
                                height={'90%'}
                                title={this.t("pg_txtCustomerCode.title")} //
                                search={true}
                                data = 
                                {{
                                    source:
                                    {
                                        select:
                                        {
                                            query : `SELECT GUID,CODE,TITLE,NAME,LAST_NAME,[TYPE_NAME],[GENUS_NAME] FROM CUSTOMER_VW_03 WHERE (UPPER(CODE) LIKE UPPER(@VAL) OR UPPER(TITLE) LIKE UPPER(@VAL)) AND STATUS = 1`,
                                            param : ['VAL:string|50']
                                        },
                                        sql:this.core.sql
                                    }
                                }}
                                >
                                    <Column dataField="CODE" caption={this.t("pg_txtCustomerCode.clmCode")} width={150} />
                                    <Column dataField="TITLE" caption={this.t("pg_txtCustomerCode.clmTitle")} width={500} defaultSortOrder="asc" />
                                    <Column dataField="TYPE_NAME" caption={this.t("pg_txtCustomerCode.clmTypeName")} width={150} />
                                    <Column dataField="GENUS_NAME" caption={this.t("pg_txtCustomerCode.clmGenusName")} width={150}/>
                                    
                                </NdPopGrid>
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
                            <NdGrid id="grdSaleTicketReport" parent={this} 
                            selection={{mode:"multiple"}} 
                            showBorders={true}
                            filterRow={{visible:true}} 
                            headerFilter={{visible:true}}
                            sorting={{ mode: 'single' }}
                            height={600}
                            columnAutoWidth={true}
                            allowColumnReordering={true}
                            allowColumnResizing={true}
                            onRowDblClick={async(e)=>
                            {
                                this.btnGetDetail(e.data.GUID)
                            }}
                            >    
                                {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Paging defaultPageSize={20} /> : <Paging enabled={false} />}
                                {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Pager visible={true} allowedPageSizes={[5,10,50]} showPageSizeSelector={true} /> : <Paging enabled={false} />}
                                {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Scrolling mode="standart" /> : <Scrolling mode="virtual" />}                      
                                <StateStoring enabled={true} type="custom" customLoad={this.loadState} customSave={this.saveState} storageKey={this.props.data.id + "_grdSaleTicketReport"}/>
                                <ColumnChooser enabled={true} />
                                <Scrolling mode="standart" />
                                <Export fileName={this.lang.t("menuOff.pos_02_001")} enabled={true} allowExportSelectedData={true} />
                                <Column dataField="DOC_DATE" caption={this.t("grdSaleTicketReport.clmDate")} visible={true} width={150} dataType="datetime" format={"dd/MM/yyyy"}/>
                                <Column dataField="CUSER_NAME" caption={this.t("grdSaleTicketReport.slmUser")} visible={true} width={100}/> 
                                <Column dataField="CUSTOMER_NAME" caption={this.t("grdSaleTicketReport.clmCustomer")} visible={true} width={300}/> 
                                <Column dataField="CUSTOMER_CODE" caption={this.t("grdSaleTicketReport.clmCardId")} visible={true} width={150}/> 
                                <Column dataField="DISCOUNT" caption={this.t("grdSaleTicketReport.clmDiscount")} visible={true} width={100} format={{ style: "currency", currency: Number.money.code,precision: 2}}/> 
                                <Column dataField="TOTAL" caption={this.t("grdSaleTicketReport.clmTotal")} visible={true} width={100} format={{ style: "currency", currency: Number.money.code,precision: 2}}/>
                            </NdGrid>
                        </div>
                    </div>
                    <NdPopUp parent={this} id={"popDetail"} 
                        visible={false}                        
                        showCloseButton={true}
                        showTitle={true}
                        title={this.t("popDetail.title")}
                        container={'#' + this.props.data.id + this.tabIndex} 
                        width={'100%'}
                        height={'100%'}
                        position={{of:'#' + this.props.data.id + this.tabIndex}}
                        >
                          <div className="row">
                          <div className="col-1 pe-0"></div>
                            <div className="col-7 pe-0">
                            <NdGrid id="grdSaleTicketItems" parent={this} 
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
                                    <Export fileName={this.lang.t("menuOff.pos_02_001")} enabled={true} allowExportSelectedData={true} />
                                    <Column dataField="TIME" caption={this.t("grdSaleTicketItems.clmTime")} visible={true} width={100}/> 
                                    <Column dataField="BARCODE" caption={this.t("grdSaleTicketItems.clmBarcode")} visible={true} width={150}/> 
                                    <Column dataField="ITEM_NAME" caption={this.t("grdSaleTicketItems.clmName")} visible={true} width={250}/> 
                                    <Column dataField="QUANTITY" caption={this.t("grdSaleTicketItems.clmQuantity")} visible={true} width={100}/> 
                                    <Column dataField="DISCOUNT" caption={this.t("grdSaleTicketItems.clmDıscount")} visible={true} width={100} format={{ style: "currency", currency: Number.money.code,precision: 2}}/>
                                    <Column dataField="PRICE" caption={this.t("grdSaleTicketItems.clmPrice")} visible={true} width={150} format={{ style: "currency", currency: Number.money.code,precision: 2}}/> 
                                    <Column dataField="TOTAL" caption={this.t("grdSaleTicketItems.clmTotal")} visible={true} width={150} format={{ style: "currency", currency: Number.money.code,precision: 2}}/> 
                                    <Summary>
                                    <TotalItem
                                        column="DISCOUNT"
                                        summaryType="sum"
                                        valueFormat={{ style: "currency", currency: Number.money.code,precision: 2}} />
                                    <TotalItem
                                        column="TOTAL"
                                        summaryType="sum"
                                        valueFormat={{ style: "currency", currency: Number.money.code,precision: 2}} />
                                </Summary>
                            </NdGrid>
                            </div>
                            </div>
                    </NdPopUp>
                </ScrollView>
            </div>
        )
    }
}