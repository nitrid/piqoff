import React from 'react';
import App from '../../../lib/app.js';
import moment from 'moment';

import Toolbar from 'devextreme-react/toolbar';
import Form, {Item, Label, EmptyItem} from 'devextreme-react/form';
import ScrollView from 'devextreme-react/scroll-view';

import NdGrid,{Column, ColumnChooser,StateStoring,Paging,Pager,Scrolling,Export, Summary, TotalItem} from '../../../../core/react/devex/grid.js';
import NdTextBox from '../../../../core/react/devex/textbox.js';
import NdPopUp from '../../../../core/react/devex/popup.js';
import NdButton from '../../../../core/react/devex/button.js';
import NbDateRange from '../../../../core/react/bootstrap/daterange.js';
import NdPopGrid from '../../../../core/react/devex/popgrid.js';

export default class supplierItemGroupReport extends React.PureComponent
{
    constructor(props)
    {
        super(props)
        this.core = App.instance.core
        this.tabIndex = props.data.tabKey
        this.state = 
        {
            selectedSupplier: this.props.selectedSupplier || null,
            selectedItemGroup: this.props.selectedItemGroup || null,
            showDetail: false,
            detailData: []
        }

        this.loadState = this.loadState.bind(this)
        this.saveState = this.saveState.bind(this)
        this.btnGetClick = this.btnGetClick.bind(this)
        this.getDetail = this.getDetail.bind(this)
    }

    componentDidMount()
    {
        this.init()
    }
    async init()
    {
    }

    loadState()
    {
        let tmpLoad = this.access.filter({ELEMENT:'grdItemSaleReportState',USERS:this.user.CODE})
        return tmpLoad.getValue()
    }

    saveState(e)
    {
        let tmpSave = this.access.filter({ELEMENT:'grdItemSaleReportState',USERS:this.user.CODE, PAGE:this.props.data.id, APP:"OFF"})
        tmpSave.setValue(e)
        tmpSave.save()
    }

    async btnGetClick()
    {
        App.instance.loading.show()
        
        // Parametreleri hazırla
        let hasDate = this.dtDate.startDate && this.dtDate.endDate
        let hasCustomer = this.cmbSupplier.GUID && this.cmbSupplier.GUID !== '00000000-0000-0000-0000-000000000000'
        let hasItemGroup = this.cmbItemGroup.GUID && this.cmbItemGroup.GUID !== '00000000-0000-0000-0000-000000000000'
        
        let tmpQuery = 
        {
            source: 
            {
                select: 
                {
                    query: `SELECT 
                            C.CODE AS SUPPLIER_CODE,
                            C.TITLE AS SUPPLIER_NAME,
                            IG.CODE AS ITEM_GROUP_CODE,
                            IG.NAME AS ITEM_GROUP_NAME,
                            COUNT(DISTINCT S.GUID) AS TICKET_COUNT,
                            SUM(S.QUANTITY) AS TOTAL_QUANTITY,
                            SUM(S.AMOUNT) AS TOTAL_AMOUNT,
                            AVG(S.AMOUNT) AS AVG_TICKET_AMOUNT,
                            COUNT(DISTINCT S.ITEM_GUID) AS ITEM_COUNT,
                            AVG(S.COST_PRICE) AS AVG_ITEM_PRICE,
                            COUNT(DISTINCT IM.GUID) AS MULTICODE_COUNT
                            FROM POS_SALE_VW_01 S
                            INNER JOIN ITEMS_GRP IGRP ON S.ITEM_GUID = IGRP.ITEM
                            INNER JOIN ITEM_GROUP IG ON IGRP.MAIN_GUID = IG.GUID
                            INNER JOIN ITEM_MULTICODE IM ON S.ITEM_GUID = IM.ITEM AND IM.DELETED = 0
                            INNER JOIN CUSTOMERS C ON IM.CUSTOMER = C.GUID
                            WHERE 1=1
                            ${hasDate ? 'AND (S.DOC_DATE >= @FIRST_DATE AND S.DOC_DATE <= @LAST_DATE)' : ''}
                            ${hasCustomer ? 'AND C.GUID = @CUSTOMER_GUID' : ''}
                            ${hasItemGroup ? 'AND IG.GUID = @MAIN_GUID' : ''}
                            GROUP BY C.CODE, C.TITLE, IG.CODE, IG.NAME
                            ORDER BY TOTAL_AMOUNT DESC`,
                    param: this.buildParams(hasDate, hasCustomer, hasItemGroup),
                    value: this.buildValues(hasDate, hasCustomer, hasItemGroup)
                },
                sql: this.core.sql
            }
        }
        
        await this.grdSupplierItemGroupReport.dataRefresh(tmpQuery)
        
        App.instance.loading.hide()
    }
    
    buildParams(hasDate, hasCustomer, hasItemGroup)
    {
        let params = []

        if(hasDate)
        {
            params.push('FIRST_DATE:date', 'LAST_DATE:date')
        }
        if(hasCustomer)
        {
            params.push('CUSTOMER_GUID:string|500')
        }
        if(hasItemGroup)
        {
            params.push('MAIN_GUID:string|500')
        }
        return params
    }
    
    buildValues(hasDate, hasCustomer, hasItemGroup)
    {
        let values = []

        if(hasDate)
        {
            values.push(this.dtDate.startDate, this.dtDate.endDate)
        }
        if(hasCustomer)
        {
            values.push(this.cmbSupplier.GUID)
        }
        if(hasItemGroup)
        {
            values.push(this.cmbItemGroup.GUID)
        }
        return values
    }

    async getDetail(e)
    {
        App.instance.loading.show()
        
        // Seçilen satırın ürün grubu bilgisini al
        let selectedItemGroup = e.data.ITEM_GROUP_NAME
        let hasCustomer = this.cmbSupplier.GUID && this.cmbSupplier.GUID !== '00000000-0000-0000-0000-000000000000'
        
        let tmpQuery = 
        {
            source: 
            {
                select: 
                {
                    query: `SELECT 
                            S.DOC_DATE,
                            S.ITEM_CODE,
                            S.ITEM_NAME,
                            S.QUANTITY,
                            S.AMOUNT,
                            S.COST_PRICE,
                            C.TITLE AS SUPPLIER_NAME,
                                IG.NAME AS ITEM_GROUP_NAME
                            FROM POS_SALE_VW_01 S
                            INNER JOIN ITEMS_GRP IGRP ON S.ITEM_GUID = IGRP.ITEM
                            INNER JOIN ITEM_GROUP IG ON IGRP.MAIN_GUID = IG.GUID
                            INNER JOIN ITEM_MULTICODE IM ON S.ITEM_GUID = IM.ITEM AND IM.DELETED = 0
                            INNER JOIN CUSTOMERS C ON IM.CUSTOMER = C.GUID
                            WHERE (S.DOC_DATE >= @FIRST_DATE AND S.DOC_DATE <= @LAST_DATE)
                            AND IG.NAME = @ITEM_GROUP_NAME
                            ${hasCustomer ? 'AND IM.CUSTOMER = @CUSTOMER_GUID' : ''}
                            ORDER BY S.DOC_DATE DESC`,
                    param: hasCustomer ? ['FIRST_DATE:date', 'LAST_DATE:date', 'ITEM_GROUP_NAME:string|100', 'CUSTOMER_GUID:string|500'] : ['FIRST_DATE:date', 'LAST_DATE:date', 'ITEM_GROUP_NAME:string|100'],
                    value: hasCustomer ? [this.dtDate.startDate, this.dtDate.endDate, selectedItemGroup, this.cmbSupplier.GUID] : [this.dtDate.startDate, this.dtDate.endDate, selectedItemGroup]
                },
                sql: this.core.sql
            }
        }
        
        await this.grdDetail.dataRefresh(tmpQuery)
        this.setState({showDetail: true})
        this.popGrpDetail.show()
        
        App.instance.loading.hide()
    }

    render()
    {
        return (
            <div id={this.props.data.id + this.tabIndex} style={{height:'100%'}}>
                <ScrollView>
                <div className="row px-2 pt-1">
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
                <div className="row px-2 pt-1" style={{height:'80px'}}>
                    <div className="col-12">
                        <Form colCount={3} id="frmCriter">
                            {/* dtDate */}
                            <Item colSpan={2}>
                                <Label text={this.lang.t("dtDate")} alignment="right" />
                                <NbDateRange id={"dtDate"} parent={this} startDate={moment(new Date())} endDate={moment(new Date())}/>
                            </Item>
                            <EmptyItem colSpan={1}/>
                            
                            {/* Tedarikçi */}
                            <Item colSpan={2}>                                    
                                <Label text={this.t("supplier")} alignment="right" />
                                <NdTextBox
                                    id="cmbSupplier"
                                    parent={this}
                                    simple={true}
                                    tabIndex={this.tabIndex}
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    button=
                                    {
                                        [
                                            {
                                                id:'01',
                                                icon:'more',
                                                onClick:()=>
                                                {
                                                    this.pg_cmbSupplier.show()
                                                    this.pg_cmbSupplier.onClick = (data) =>
                                                    {
                                                        if(data.length > 0)
                                                        {
                                                            this.cmbSupplier.value = data[0].TITLE
                                                            this.cmbSupplier.GUID = data[0].GUID
                                                        }
                                                    }
                                                }
                                            },
                                            {
                                                id:'02',
                                                icon:'clear',
                                                onClick:()=>
                                                {
                                                    this.cmbSupplier.value = ''
                                                    this.cmbSupplier.GUID = null
                                                }
                                            }
                                        ]
                                    }
                                    onEnterKey={(async()=>
                                        {
                                            await this.pg_cmbSupplier.setVal(this.cmbSupplier.value)
                                            this.pg_cmbSupplier.show()
                                            this.pg_cmbSupplier.onClick = (data) =>
                                            {
                                                if(data.length > 0)
                                                {
                                                    this.cmbSupplier.value = data[0].TITLE
                                                    this.cmbSupplier.GUID = data[0].GUID
                                                }
                                            }
                                        }).bind(this)}
                                    selectAll={true}                           
                                />      
                                {/* TEDARİKÇİ SEÇİM POPUP */}
                                <NdPopGrid id={"pg_cmbSupplier"} parent={this} container={'#' + this.props.data.id + this.tabIndex} 
                                visible={false}
                                position={{of:'#' + this.props.data.id + this.tabIndex}} 
                                showTitle={true} 
                                showBorders={true}
                                width={'90%'}
                                height={'90%'}
                                title={this.t("supplierSelect")} 
                                selection={{mode:"single"}}
                                search={true}
                                data = 
                                {{
                                    source:
                                    {
                                        select:
                                        {
                                            query : `SELECT GUID,CODE,TITLE FROM CUSTOMERS WHERE TYPE IN(1,2) AND STATUS = 1 AND DELETED = 0 AND (UPPER(CODE) LIKE UPPER(@VAL) OR UPPER(TITLE) LIKE UPPER(@VAL))`,
                                            param : ['VAL:string|50']
                                        },
                                        sql:this.core.sql
                                    }
                                }}
                                >
                                    <Column dataField="CODE" caption={this.lang.t("Kod")} width={'30%'} />
                                    <Column dataField="TITLE" caption={this.lang.t("Tedarikçi")} width={'70%'} defaultSortOrder="asc" />
                                </NdPopGrid>
                            </Item>
                            <EmptyItem colSpan={1}/>
                            
                            {/* Ürün Grubu */}
                            <Item colSpan={2}>                                    
                                <Label text={this.t("itemGroup")} alignment="right" />
                                <NdTextBox
                                    id="cmbItemGroup"
                                    parent={this}
                                    simple={true}
                                    tabIndex={this.tabIndex}
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    button=
                                    {
                                        [
                                            {
                                                id:'01',
                                                icon:'more',
                                                onClick:()=>
                                                {
                                                    this.pg_cmbItemGroup.show()
                                                    this.pg_cmbItemGroup.onClick = (data) =>
                                                    {
                                                        if(data.length > 0)
                                                        {
                                                            this.cmbItemGroup.value = data[0].NAME
                                                            this.cmbItemGroup.GUID = data[0].GUID
                                                        }
                                                    }
                                                }
                                            },
                                            {
                                                id:'02',
                                                icon:'clear',
                                                onClick:()=>
                                                {
                                                    this.cmbItemGroup.value = ''
                                                    this.cmbItemGroup.GUID = null
                                                }
                                            }
                                        ]
                                    }
                                    onEnterKey={(async()=>
                                        {
                                            await this.pg_cmbItemGroup.setVal(this.cmbItemGroup.value)
                                            this.pg_cmbItemGroup.show()
                                            this.pg_cmbItemGroup.onClick = (data) =>
                                            {
                                                if(data.length > 0)
                                                {
                                                    this.cmbItemGroup.value = data[0].NAME
                                                    this.cmbItemGroup.GUID = data[0].GUID
                                                }
                                            }
                                        }).bind(this)}
                                    selectAll={true}                           
                                />      
                                {/* ÜRÜN GRUBU SEÇİM POPUP */}
                                <NdPopGrid id={"pg_cmbItemGroup"} parent={this} container={'#' + this.props.data.id + this.tabIndex} 
                                visible={false}
                                position={{of:'#' + this.props.data.id + this.tabIndex}} 
                                showTitle={true} 
                                showBorders={true}
                                width={'90%'}
                                height={'90%'}
                                title={this.t("itemGroupSelect")} 
                                selection={{mode:"single"}}
                                search={true}
                                data = 
                                {{
                                    source:
                                    {
                                        select:
                                        {
                                            query : `SELECT GUID,CODE,NAME FROM ITEM_GROUP WHERE STATUS = 1 AND (UPPER(CODE) LIKE UPPER(@VAL) OR UPPER(NAME) LIKE UPPER(@VAL))`,
                                            param : ['VAL:string|50']
                                        },
                                        sql:this.core.sql
                                    }
                                }}
                                >
                                    <Column dataField="CODE" caption={this.lang.t("Kod")} width={'30%'} />
                                    <Column dataField="NAME" caption={this.lang.t("Ürün Grubu")} width={'70%'} defaultSortOrder="asc" />
                                </NdPopGrid>
                            </Item>
                            <EmptyItem colSpan={1}/>
                            
                            <Item colSpan={1}>
                                <EmptyItem/>
                            </Item>
                            <Item colSpan={1}>
                                <EmptyItem/>
                            </Item>
                            <Item colSpan={1}>
                                <EmptyItem/>
                            </Item>

                        </Form>
                    </div>
                </div>
                <div className="row px-2 pt-1">
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
                <div className="row px-2 pt-1">
                    <div className="col-12">
                        <NdGrid id="grdSupplierItemGroupReport" parent={this} 
                        selection={{mode:"single"}} 
                        showBorders={true}
                        height={'700px'} 
                        width={'100%'}
                        filterRow={{visible:true}} 
                        headerFilter={{visible:true}}
                        columnAutoWidth={true}
                        allowColumnReordering={true}
                        allowColumnResizing={true}
                        loadPanel={{enabled:true}}
                        onRowDblClick={(e) => {
                            if(this.cmbSupplier.GUID && this.cmbSupplier.GUID !== '') {
                                this.getDetail(e)
                            }
                        }}
                        >                            
                            {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Paging defaultPageSize={20} /> : <Paging enabled={false} />}
                            {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Pager visible={true} allowedPageSizes={[5,10,50]} showPageSizeSelector={true} /> : <Paging enabled={false} />}
                            {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Scrolling mode="standart" /> : <Scrolling mode="virtual" />}
                            <StateStoring enabled={true} type="custom" customLoad={this.loadState} customSave={this.saveState} storageKey={this.props.data.id + "_grdSupplierItemGroupReport"}/>
                            <ColumnChooser enabled={true} />
                            <Export fileName={this.lang.t("menuOff.pos_02_022")} enabled={true} allowExportSelectedData={true} />
                            <Column dataField="SUPPLIER_CODE" caption={this.t("supplierCode")} visible={true} width={150}/> 
                            <Column dataField="SUPPLIER_NAME" caption={this.t("supplierName")} visible={true} width={200}/> 
                            <Column dataField="ITEM_GROUP_CODE" caption={this.t("itemGroupCode")} visible={true} width={150}/> 
                            <Column dataField="ITEM_GROUP_NAME" caption={this.t("itemGroupName")} visible={true} width={200}/> 
                            <Column dataField="TICKET_COUNT" caption={this.t("ticketCount")} visible={true} width={120} allowHeaderFiltering={false}/> 
                            <Column dataField="TOTAL_AMOUNT" caption={this.t("totalAmount")} visible={true} format="€ #,##0.00" width={150} allowHeaderFiltering={false}/> 
                            <Column dataField="AVG_TICKET_AMOUNT" caption={this.t("avgTicketAmount")} visible={true} format="€ #,##0.00" width={150} allowHeaderFiltering={false}/> 
                            <Column dataField="ITEM_COUNT" caption={this.t("itemCount")} visible={true} width={120} allowHeaderFiltering={false}/> 
                            <Column dataField="AVG_ITEM_PRICE" caption={this.t("avgItemPrice")} visible={true} format="€ #,##0.00" width={150} allowHeaderFiltering={false}/> 
                            <Summary>
                                <TotalItem
                                column="TOTAL_AMOUNT"
                                summaryType="sum"
                                valueFormat="€ #,##0.00" />
                                <TotalItem
                                column="AVG_TICKET_AMOUNT"
                                summaryType="avg"
                                valueFormat="€ #,##0.00" />
                                <TotalItem
                                column="ITEM_COUNT"
                                summaryType="sum" />
                                <TotalItem
                                column="AVG_ITEM_PRICE"
                                summaryType="avg"
                                valueFormat="€ #,##0.00" />
                            </Summary>
                        </NdGrid>
                    </div>
                </div>
                </ScrollView>
                
                {/* DETAY POPUP */}
                <NdPopUp id={"popGrpDetail"} parent={this} container={'#' + this.props.data.id + this.tabIndex} 
                position={{of:'#' + this.props.data.id + this.tabIndex}} 
                showTitle={true} 
                showBorders={true}
                width={'90%'}
                height={'auto'}
                showCloseButton={true}
                title={this.t("detail")} 
                visible={this.state.showDetail}
                >
                    <NdGrid id="grdDetail" parent={this} 
                    selection={{mode:"single"}} 
                    showBorders={true}
                    height={'600px'} 
                    width={'100%'}
                    filterRow={{visible:true}} 
                    headerFilter={{visible:true}}
                    columnAutoWidth={true}
                    allowColumnReordering={true}
                    allowColumnResizing={true}
                    loadPanel={{enabled:true}}
                    >                            
                        {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Paging defaultPageSize={20} /> : <Paging enabled={false} />}
                        {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Pager visible={true} allowedPageSizes={[5,10,50]} showPageSizeSelector={true} /> : <Paging enabled={false} />}
                        {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Scrolling mode="standart" /> : <Scrolling mode="virtual" />}
                        <StateStoring enabled={true} type="custom" customLoad={this.loadState} customSave={this.saveState} storageKey={this.props.data.id + "_grdDetail"}/>
                        <ColumnChooser enabled={true} />
                        <Export fileName={this.lang.t("menuOff.pos_02_022")} enabled={true} allowExportSelectedData={true} />
                        <Column dataField="DOC_DATE" caption={this.t("docDate")} visible={true} width={150} dataType="date" format="dd.MM.yyyy"/> 
                        <Column dataField="ITEM_CODE" caption={this.t("itemCode")} visible={true} width={150}/> 
                        <Column dataField="ITEM_NAME" caption={this.t("itemName")} visible={true} width={200}/> 
                        <Column dataField="QUANTITY" caption={this.t("quantity")} visible={true} width={120} allowHeaderFiltering={false}/> 
                        <Column dataField="AMOUNT" caption={this.t("amount")} visible={true} format="€ #,##0.00" width={150} allowHeaderFiltering={false}/> 
                        <Column dataField="COST_PRICE" caption={this.t("costPrice")} visible={true} format="€ #,##0.00" width={150} allowHeaderFiltering={false}/> 
                        <Column dataField="SUPPLIER_NAME" caption={this.t("supplierName")} visible={true} width={200}/> 
                        <Column dataField="ITEM_GROUP_NAME" caption={this.t("itemGroupName")} visible={true} width={200}/> 
                        <Summary>
                            <TotalItem
                            column="QUANTITY"
                            summaryType="sum" />
                            <TotalItem
                            column="AMOUNT"
                            summaryType="sum"
                            valueFormat="€ #,##0.00" />
                            <TotalItem
                            column="COST_PRICE"
                            summaryType="avg"
                            valueFormat="€ #,##0.00" />
                        </Summary>
                    </NdGrid>
                </NdPopUp>
            </div>
        )
    }
} 