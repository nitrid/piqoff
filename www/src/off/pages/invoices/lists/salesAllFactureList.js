import React from 'react';
import App from '../../../lib/app.js';
import moment from 'moment';
import ScrollView from 'devextreme-react/scroll-view';
import { NdForm,NdItem, NdLabel, NdEmptyItem } from '../../../../core/react/devex/form.js';
import NbDateRange from '../../../../core/react/bootstrap/daterange.js';
import NdSelectBox from '../../../../core/react/devex/selectbox.js';
import NdGrid,{Column, ColumnChooser,Paging,Pager,Scrolling,Export, Summary, TotalItem, StateStoring} from '../../../../core/react/devex/grid.js';
import NdButton from '../../../../core/react/devex/button.js';
import Toolbar,{Item} from 'devextreme-react/toolbar';
import NdPopUp from '../../../../core/react/devex/popup.js';
import { dialog } from '../../../../core/react/devex/dialog.js';

export default class salesAllFactureList extends React.PureComponent
{
    constructor(props)
    {
        super(props)

        this.core = App.instance.core;
        
        this.btnGetirClick = this.btnGetirClick.bind(this)
        this.loadState = this.loadState.bind(this)
        this.saveState = this.saveState.bind(this)
        this.btnPopDesign = this.btnPopDesign.bind(this)
        this.btnPrint = this.btnPrint.bind(this)
        this.openInvoicePage = this.openInvoicePage.bind(this)
        this.tabIndex = props.data.tabkey


        this.invoiceTypes = [            
            {ID: 'ALL', NAME: this.t("allInvoices")},
            {ID: 'SALES', NAME: this.t("salesInvoices")},
            {ID: 'BRANCH_SALES', NAME: this.t("branchSalesInvoices")},
            {ID: 'PRICE_DIFF', NAME: this.t("priceDifferencePurcInvoices")},
            {ID: 'REBATE_SALES', NAME: this.t("rebatePurcInvoices")},
            {ID: 'OUTAGE', NAME: this.t("outageInvoices")}
        ]
    }

    componentDidMount()
    {
        setTimeout(async () => 
        {
            await this.cmbInvoiceType.setData(this.invoiceTypes);
            this.cmbInvoiceType.value = 'ALL';
        }, 1000);
    }

    loadState()
    {
        let tmpLoad = this.access.filter({ELEMENT:'grdAllInvoicesState',USERS:this.user.CODE})
        return tmpLoad.getValue()
    }

    saveState(e)
    {
        let tmpSave = this.access.filter({ELEMENT:'grdAllInvoicesState',USERS:this.user.CODE,PAGE:this.props.data.id,APP:"OFF"})
        tmpSave.setValue(e)
        tmpSave.save()
    }

    async btnGetirClick()
    {
        let query = ""
        let param = ['FIRST_DATE:date','LAST_DATE:date']
        let value = [this.dtDate.startDate,this.dtDate.endDate]

        switch(this.cmbInvoiceType.value)
        {
            case 'ALL':
                query = `SELECT 
                        CONCAT(TYPE, '_', DOC_TYPE, '_', REBATE) AS INVOICE_TYPE_CODE,
                        CASE 
                        WHEN TYPE = 1 AND DOC_TYPE = 20 AND REBATE = 0 THEN '${this.t("salesInvoices")}'
                        WHEN TYPE = 0 AND DOC_TYPE = 20 AND REBATE = 1 THEN '${this.t("rebatePurcInvoices")}'
                        WHEN TYPE = 1 AND DOC_TYPE = 22 AND REBATE = 0 THEN '${this.t("branchSalesInvoices")}'
                        WHEN TYPE = 0 AND DOC_TYPE = 21 AND REBATE = 0 THEN '${this.t("priceDifferencePurcInvoices")}'
                        WHEN TYPE = 0 AND DOC_TYPE = 23 AND REBATE = 1 THEN '${this.t("outageInvoices")}'
                        ELSE '${this.t("otherInvoices")}'
                        END AS INVOICE_TYPE,
                        DOC_DATE, REF, 
                        CASE WHEN TYPE = 1 THEN INPUT_CODE ELSE OUTPUT_CODE END AS CUSTOMER_CODE,
                        CASE WHEN TYPE = 1 THEN INPUT_NAME ELSE OUTPUT_NAME END AS CUSTOMER_NAME,
                        AMOUNT, DISCOUNT, VAT, TOTAL, GUID
                        FROM DOC_VW_01 
                        WHERE 
                        ((TYPE = 1 AND DOC_TYPE = 20 AND REBATE = 0) OR  
                        (TYPE = 0 AND DOC_TYPE = 20 AND REBATE = 1) OR  
                        (TYPE = 1 AND DOC_TYPE = 22 AND REBATE = 0) OR  
                        (TYPE = 0 AND DOC_TYPE = 21 AND REBATE = 0) OR  
                        (TYPE = 0 AND DOC_TYPE = 23 AND REBATE = 1))
                        AND ((DOC_DATE >= @FIRST_DATE) OR (@FIRST_DATE = '19700101')) 
                        AND ((DOC_DATE <= @LAST_DATE) OR (@LAST_DATE = '19700101'))
                        ORDER BY DOC_DATE DESC`
                break;
            case 'SALES':
                query = `SELECT 
                        CONCAT(TYPE, '_', DOC_TYPE, '_', REBATE) AS INVOICE_TYPE_CODE,
                        '${this.t("salesInvoices")}' AS INVOICE_TYPE, 
                        DOC_DATE, REF, INPUT_CODE AS CUSTOMER_CODE, INPUT_NAME AS CUSTOMER_NAME, 
                        AMOUNT, DISCOUNT, VAT, TOTAL, GUID
                        FROM DOC_VW_01 WHERE TYPE = 1 AND DOC_TYPE = 20 AND REBATE = 0
                        AND ((DOC_DATE >= @FIRST_DATE) OR (@FIRST_DATE = '19700101')) 
                        AND ((DOC_DATE <= @LAST_DATE) OR (@LAST_DATE = '19700101'))
                        ORDER BY DOC_DATE DESC` 
                break;
            case 'REBATE_SALES':
                query = `SELECT 
                        CONCAT(TYPE, '_', DOC_TYPE, '_', REBATE) AS INVOICE_TYPE_CODE,
                        '${this.t("rebatePurcInvoices")}' AS INVOICE_TYPE, 
                        DOC_DATE, REF, INPUT_CODE AS CUSTOMER_CODE, INPUT_NAME AS CUSTOMER_NAME, 
                        AMOUNT, DISCOUNT, VAT, TOTAL, GUID
                        FROM DOC_VW_01 WHERE TYPE = 0 AND DOC_TYPE = 20 AND REBATE = 1
                        AND ((DOC_DATE >= @FIRST_DATE) OR (@FIRST_DATE = '19700101')) 
                        AND ((DOC_DATE <= @LAST_DATE) OR (@LAST_DATE = '19700101'))
                        ORDER BY DOC_DATE DESC`
                break;
            case 'BRANCH_SALES':
                query = `SELECT 
                        CONCAT(TYPE, '_', DOC_TYPE, '_', REBATE) AS INVOICE_TYPE_CODE,
                        '${this.t("branchSalesInvoices")}' AS INVOICE_TYPE, 
                        DOC_DATE, REF, INPUT_CODE AS CUSTOMER_CODE, INPUT_NAME AS CUSTOMER_NAME, 
                        AMOUNT, DISCOUNT, VAT, TOTAL, GUID
                        FROM DOC_VW_01 WHERE TYPE = 1 AND DOC_TYPE = 22 AND REBATE = 0
                        AND ((DOC_DATE >= @FIRST_DATE) OR (@FIRST_DATE = '19700101')) 
                        AND ((DOC_DATE <= @LAST_DATE) OR (@LAST_DATE = '19700101'))
                        ORDER BY DOC_DATE DESC`
                break;
            case 'PRICE_DIFF':
                query = `SELECT 
                        CONCAT(TYPE, '_', DOC_TYPE, '_', REBATE) AS INVOICE_TYPE_CODE,
                        '${this.t("priceDifferencePurcInvoices")}' AS INVOICE_TYPE, 
                        DOC_DATE, REF, INPUT_CODE AS CUSTOMER_CODE, INPUT_NAME AS CUSTOMER_NAME, 
                        AMOUNT, DISCOUNT, VAT, TOTAL, GUID
                        FROM DOC_VW_01 WHERE TYPE = 0 AND DOC_TYPE = 21 AND REBATE = 0
                        AND ((DOC_DATE >= @FIRST_DATE) OR (@FIRST_DATE = '19700101')) 
                        AND ((DOC_DATE <= @LAST_DATE) OR (@LAST_DATE = '19700101'))
                        ORDER BY DOC_DATE DESC`
                break;
            case 'OUTAGE':
                query = `SELECT 
                        CONCAT(TYPE, '_', DOC_TYPE, '_', REBATE) AS INVOICE_TYPE_CODE,
                        '${this.t("outageInvoices")}' AS INVOICE_TYPE, 
                        DOC_DATE, REF, OUTPUT_CODE AS CUSTOMER_CODE, OUTPUT_NAME AS CUSTOMER_NAME, 
                        AMOUNT, DISCOUNT, VAT, TOTAL, GUID
                        FROM DOC_VW_01 WHERE TYPE = 0 AND DOC_TYPE = 23 AND REBATE = 1
                        AND ((DOC_DATE >= @FIRST_DATE) OR (@FIRST_DATE = '19700101')) 
                        AND ((DOC_DATE <= @LAST_DATE) OR (@LAST_DATE = '19700101'))
                        ORDER BY DOC_DATE DESC`
                break;
            default:
                return; // Query null ise işlem yapma
        }

        let tmpSource =
        {
            source : 
            {
                select : 
                {
                    query : query,
                    param : param,
                    value : value
                },
                sql : this.core.sql
            }
        }
        await this.grdAllInvoices.dataRefresh(tmpSource)
    }

    async btnPopDesign()
    {
        let selectedData = this.grdAllInvoices.getSelectedData()
        
        if(selectedData.length == 0)
        {
            let tmpConfObj =
            {
                id:'msgSelectData',showTitle:true,title:this.t("msgWarning"),showCloseButton:true,width:'500px',height:'auto',
                button:[{id:"btn01",caption:this.t("btnOk"),location:'after'}],
                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgSelectInvoice")}</div>)
            }
            await dialog(tmpConfObj);
            return
        }

        // Seçili faturaların tipleri
        let invoiceTypes = [...new Set(selectedData.map(x => x.INVOICE_TYPE_CODE))]
        
        if(invoiceTypes.length > 1)
        {
            let tmpConfObj =
            {
                id:'msgDifferentTypes',showTitle:true,title:this.t("msgWarning"),showCloseButton:true,width:'500px',height:'auto',
                button:[{id:"btn01",caption:this.t("btnOk"),location:'after'}],
                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgSameTypeRequired")}</div>)
            }
            await dialog(tmpConfObj);
            return
        }

        // Design listesini yükle ve popup göster
        try 
        {
            await this.loadDesignList(invoiceTypes[0])
            this.popDesign.show()
        } 
        catch (error) 
        {
            console.error("ERROR: ", error)
        }
    }

    async loadDesignList(invoiceTypeCode)
    {
        let pageType = await this.getInvoicePageTypeByCode(invoiceTypeCode)
        
        let tmpQuery = 
        {
            query : "SELECT TAG,DESIGN_NAME FROM LABEL_DESIGN WHERE PAGE = @PAGE",
            param : ['PAGE:string'],
            value : [pageType]
        }
        
        let tmpData = await this.core.sql.execute(tmpQuery)
        
        if(tmpData.result.recordset.length > 0)
        {
            await this.cmbDesignList.setData(tmpData.result.recordset)
        }
        else 
        {
            await this.cmbDesignList.setData([])
        }
    }

    async btnPrint()
    {
        if(this.cmbDesignList.value == '')
        {
            let tmpConfObj =
            {
                id:'msgSelectDesign',showTitle:true,title:this.t("msgWarning"),showCloseButton:true,width:'500px',height:'auto',
                button:[{id:"btn01",caption:this.t("btnOk"),location:'after'}],
                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgSelectDesign")}</div>)
            }
            await dialog(tmpConfObj);
            return
        }

        let selectedData = this.grdAllInvoices.getSelectedData()

        await this.printWithDesign(this.cmbDesignList.value, selectedData)
        this.popDesign.hide()
    }

    async printWithDesign(designTag, selectedData)
    {
        App.instance.loading.show()
        
        // İlk fatura tipine göre PAGE değerini kontrol et
        let firstInvoiceType = selectedData[0].INVOICE_TYPE_CODE
        let pageType = await this.getInvoicePageTypeByCode(firstInvoiceType)
        
        // PAGE 18, 19, 22 ise ayrı ayrı PDF - diğerleri için birleşik PDF
        if(pageType === '18' || pageType === '19' || pageType === '22')
        {
            // Her fatura için ayrı ayrı PDF oluştur
            for(let i = 0; i < selectedData.length; i++)
            {
                let tmpQuery = 
                {
                    query: "SELECT *,ISNULL((SELECT TOP 1 PATH FROM LABEL_DESIGN WHERE TAG = @DESIGN),'') AS PATH FROM FN_DOC_ITEMS_FOR_PRINT(@DOC_GUID,@LANG) ORDER BY DOC_DATE,LINE_NO",
                    param: ['DOC_GUID:string|50','DESIGN:string|25','LANG:string|10'],
                    value: [selectedData[i].GUID, designTag, localStorage.getItem('lang').toUpperCase()]
                }

                let tmpData = await this.core.sql.execute(tmpQuery)
                
                if(tmpData.result.recordset.length > 0)
                {
                    // Her fatura için ayrı devprint call'ı
                    this.core.socket.emit('devprint','{"TYPE":"REVIEW","PATH":"' + tmpData.result.recordset[0].PATH.replaceAll('\\','/') + '","DATA":' + JSON.stringify(tmpData.result.recordset) + '}',async(pResult) =>
                    {
                        if(pResult.split('|')[0] != 'ERR')
                        {
                            var mywindow = window.open('printview.html','_blank',"width=900,height=1000,left=500");      
                            mywindow.onload = function() 
                            { 
                                mywindow.document.getElementById("view").innerHTML="<iframe src='data:application/pdf;base64," + pResult.split('|')[1] + "' type='application/pdf' width='100%' height='100%'></iframe>"      
                            } 
                        }
                    });
                }
            }
        }
        else
        {
            // Diğer PAGE'ler için birleşik PDF (eski sistem)
            let tmpLines = []
            
            for(let i = 0; i < selectedData.length; i++)
            {
                let tmpQuery = 
                {
                    query: "SELECT *,ISNULL((SELECT TOP 1 PATH FROM LABEL_DESIGN WHERE TAG = @DESIGN),'') AS PATH FROM FN_DOC_ITEMS_FOR_PRINT(@DOC_GUID,@LANG) ORDER BY DOC_DATE,LINE_NO",
                    param: ['DOC_GUID:string|50','DESIGN:string|25','LANG:string|10'],
                    value: [selectedData[i].GUID, designTag, localStorage.getItem('lang').toUpperCase()]
                }

                let tmpData = await this.core.sql.execute(tmpQuery)
                
                for(let x = 0; x < tmpData.result.recordset.length; x++)
                {
                    tmpLines.push(tmpData.result.recordset[x])
                }
            }

            if(tmpLines.length > 0)
            {
                this.core.socket.emit('devprint','{"TYPE":"REVIEW","PATH":"' + tmpLines[0].PATH.replaceAll('\\','/') + '","DATA":' + JSON.stringify(tmpLines) + '}',async(pResult) =>
                {
                    if(pResult.split('|')[0] != 'ERR')
                    {
                        var mywindow = window.open('printview.html','_blank',"width=900,height=1000,left=500");      
                        mywindow.onload = function() 
                        { 
                            mywindow.document.getElementById("view").innerHTML="<iframe src='data:application/pdf;base64," + pResult.split('|')[1] + "' type='application/pdf' width='100%' height='100%'></iframe>"      
                        } 
                    }
                });
            }
        }
        
        App.instance.loading.hide()
        
        // Grid seçimlerini sıfırla
        this.grdAllInvoices.devGrid.clearSelection()
    }

    async openInvoicePage(rowData)
    {
        // Fatura tipine göre hangi sayfanın açılacağını belirle
        let pageConfig = await this.getPageConfigByInvoiceTypeCode(rowData.INVOICE_TYPE_CODE)
        
        if(pageConfig)
        {
            App.instance.menuClick({
                id: pageConfig.id,
                text: pageConfig.text,
                path: pageConfig.path,
                pagePrm: {GUID: rowData.GUID}
            })
        }
    }

    async getPageConfigByInvoiceTypeCode(invoiceTypeCode)
    {
        switch(invoiceTypeCode)
        {
            case '1_20_0': // Satış Faturası
                return {
                    id: 'ftr_02_002',
                    text: this.lang.t('menuOff.ftr_02_002'),
                    path: 'invoices/documents/salesInvoice.js'
                }
            case '0_21_0': // Fiyat Fark Faturası
                return {
                    id: 'ftr_02_004',
                    text: this.lang.t('menuOff.ftr_02_004'), 
                    path: 'invoices/documents/priceDifferencePurcInvoice.js'
                }
            case '0_20_1': // Alış İade Faturası
                return {
                    id: 'ftr_02_007',
                    text: this.lang.t('menuOff.ftr_02_007'),
                    path: 'invoices/documents/rebatePurcInvoice.js'
                }
            case '0_23_1': // Fire Faturası
                return {
                    id: 'ftr_02_009',
                    text: this.lang.t('menuOff.ftr_02_009'),
                    path: 'invoices/documents/outagePurcInvoice.js'
                }
            case '1_22_0': // Şube Satış Faturası
                return {
                    id: 'ftr_02_005',
                    text: this.lang.t('menuOff.ftr_02_005'),
                    path: 'invoices/documents/branchSaleInvoice.js'
                }
            default:
                console.warn('UNKNOWN INVOICE TYPE CODE: ', invoiceTypeCode)
                return null
        }
    }

    async getDefaultDesignByCode(invoiceTypeCode)
    {
        let pageType = await this.getInvoicePageTypeByCode(invoiceTypeCode)
        
        let tmpQuery = 
        {
            query : "SELECT TOP 1 TAG FROM LABEL_DESIGN WHERE PAGE = @PAGE ORDER BY DESIGN_NAME",
            param : ['PAGE:string'],
            value : [pageType]
        }
        
        let tmpData = await this.core.sql.execute(tmpQuery)

        if(tmpData.result.recordset.length > 0)
        {
            return tmpData.result.recordset[0].TAG
        }
        
        return null
    }

    async getInvoicePageTypeByCode(invoiceTypeCode)
    {
        switch(invoiceTypeCode)
        {
            case '1_20_0': return '115' // Satış
            case '0_20_1': return '116' // Alış İade
            case '1_22_0': return '22' // Şubelerarasi Satış
            case '0_21_0': return '18' // Fiyat Fark alis
            case '0_23_1': return '19' // Fire alis
            default: return '115'
        }
    }

    render()
    {
        return(
            <div id={this.props.data.id + this.tabIndex} >
                <ScrollView>
                    <div className="row px-2 pt-1">
                        <div className="col-12">
                            <Toolbar>
                                <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnPrint" parent={this} icon="print" type="default"
                                    onClick={this.btnPopDesign}/>
                                </Item>
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
                                                id:'msgClose',showTitle:true,title:this.t("msgWarning"),showCloseButton:true,width:'500px',height:'auto',
                                                button:[{id:"btn01",caption:this.t("btnYes"),location:'before'},{id:"btn02",caption:this.t("btnNo"),location:'after'}],
                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgClose")}</div>)
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
                    <div className="row px-2 pt-1">
                        <div className="col-12">
                            <NdForm colCount={2} id="frmCriter">
                                <NdItem>
                                    <NdLabel text={this.t("dtDate")}/>
                                    <NbDateRange id={"dtDate"} parent={this} startDate={moment().startOf('month')} endDate={moment().endOf('month')}/>
                                </NdItem>
                                <NdEmptyItem/>
                                <NdItem>
                                    <NdLabel text={this.t("invoiceType")}/>
                                    <NdSelectBox simple={true} parent={this} id="cmbInvoiceType" notRefresh={true}
                                        displayExpr="NAME"                       
                                        valueExpr="ID"
                                        value=""
                                    />
                                </NdItem>
                                <NdEmptyItem/>
                            </NdForm>
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
                            <NdButton text={this.t("btnGet")} type="success" width="100%" onClick={this.btnGetirClick}></NdButton>
                        </div>
                    </div>
                    <div className="row px-2 pt-1">
                        <div className="col-12">
                            <NdGrid id="grdAllInvoices" parent={this} 
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
                            onRowDblClick={async(e)=>
                            {
                                this.openInvoicePage(e.data)
                            }}
                            >
                                {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Paging defaultPageSize={20} /> : <Paging enabled={false} />}
                                {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Pager visible={true} allowedPageSizes={[5,10,50]} showPageSizeSelector={true} /> : <Paging enabled={false} />}
                                {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Scrolling mode="standart" /> : <Scrolling mode="infinite" />}
                                <StateStoring enabled={true} type="custom" customLoad={this.loadState} customSave={this.saveState} storageKey={this.props.data.id + "_grdAllInvoices"}/>
                                <ColumnChooser enabled={true} />
                                <Export fileName={this.lang.t("menuOff.ftr_01_008")} enabled={true} allowExportSelectedData={true} />
                                <Column dataField="INVOICE_TYPE" caption={this.t("invoiceType")} visible={true} width={180}/>
                                <Column dataField="DOC_DATE" caption={this.t("date")} visible={true} dataType="date" width={100}/>
                                <Column dataField="REF" caption={this.t("reference")} visible={true} width={120}/> 
                                <Column dataField="CUSTOMER_CODE" caption={this.t("customerCode")} visible={true} width={120}/> 
                                <Column dataField="CUSTOMER_NAME" caption={this.t("customerName")} visible={true} width={200}/> 
                                <Column dataField="AMOUNT" caption={this.t("amount")} width={120} format={{ style: "currency", currency: Number.money.code,precision: 2}} visible={true}/> 
                                <Column dataField="DISCOUNT" caption={this.t("discount")} width={120} format={{ style: "currency", currency: Number.money.code,precision: 2}} visible={true}/> 
                                <Column dataField="VAT" caption={this.t("vat")} width={120} format={{ style: "currency", currency: Number.money.code,precision: 2}} visible={true}/> 
                                <Column dataField="TOTAL" caption={this.t("total")} width={120} format={{ style: "currency", currency: Number.money.code,precision: 2}} visible={true}/> 
                                <Summary>
                                    <TotalItem column="AMOUNT" summaryType="sum" valueFormat={{ style: "currency", currency: Number.money.code,precision: 2}} />
                                    <TotalItem column="DISCOUNT" summaryType="sum" valueFormat={{ style: "currency", currency: Number.money.code,precision: 2}} />
                                    <TotalItem column="VAT" summaryType="sum" valueFormat={{ style: "currency", currency: Number.money.code,precision: 2}} />
                                    <TotalItem column="TOTAL" summaryType="sum" valueFormat={{ style: "currency", currency: Number.money.code,precision: 2}} />
                                </Summary> 
                            </NdGrid>
                        </div>
                    </div>
                    {/* DESIGN SEÇİM POPUP */}
                    <div>
                        <NdPopUp parent={this} id={"popDesign"} 
                        visible={false}
                        showCloseButton={true}
                        showTitle={true}
                        title={this.t("printDesign")}
                        container={"#" + this.props.data.id + this.tabIndex} 
                        width={'500'}
                        height={'auto'}
                        position={{of:'#' + this.props.data.id + this.tabIndex}}
                        >
                            <NdForm colCount={1} height={'fit-content'}>
                                <NdItem>
                                    <NdLabel text={this.t("design")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbDesignList" showClearButton={true} notRefresh={true}
                                    displayExpr="DESIGN_NAME"                       
                                    valueExpr="TAG"
                                    value=""
                                    searchEnabled={true}
                                    >
                                    </NdSelectBox>
                                </NdItem>
                                <NdItem>
                                    <div className="row">
                                        <div className="col-6">
                                            <NdButton text={this.t("btnPrint")} type="success" width="100%" onClick={this.btnPrint}/>
                                        </div>
                                        <div className="col-6">
                                            <NdButton text={this.t("btnCancel")} type="normal" width="100%" onClick={()=>
                                            {
                                                this.popDesign.hide(); 
                                            }}/>
                                        </div>
                                    </div>
                                </NdItem>
                            </NdForm>
                        </NdPopUp>
                    </div>

                </ScrollView>
            </div>
        )
    }
}