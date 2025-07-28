import React from 'react';
import App from '../../../lib/app.js';
import moment from 'moment';

import Toolbar,{Item} from 'devextreme-react/toolbar';
import ScrollView from 'devextreme-react/scroll-view';

import NdGrid,{Column, ColumnChooser,Paging,Pager,Scrolling,Export,StateStoring} from '../../../../core/react/devex/grid.js';
import NbDateRange from '../../../../core/react/bootstrap/daterange.js';
import NdButton from '../../../../core/react/devex/button.js';
import { dialog } from '../../../../core/react/devex/dialog.js';
import { Workbook } from 'exceljs';
import { exportDataGrid } from 'devextreme/excel_exporter';
import saveAs from 'file-saver';
import { NdForm,NdItem,NdLabel } from '../../../../core/react/devex/form.js';

export default class debDetailReport extends React.PureComponent
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
        setTimeout(async () => { }, 1000);
    }

    loadState()
    {
        let tmpLoad = this.access.filter({ELEMENT:'grdListeState',USERS:this.user.CODE})
        return tmpLoad.getValue()
    }
    saveState(e)
    {
        let tmpSave = this.access.filter({ELEMENT:'grdListeState',USERS:this.user.CODE,PAGE:this.props.data.id,APP:"OFF"})
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
                    query :
                        `SELECT 
                        (SELECT TOP 1  CASE WHEN LEN(CUSTOMS_CODE) = 7 THEN '0'+ CUSTOMS_CODE ELSE CUSTOMS_CODE END FROM ITEMS_GRP WHERE ITEMS_GRP.ITEM = DOC_ITEMS_VW_01.ITEM) AS CUSTOMS_NO,   
                        ORIGIN,   
                        (SELECT TOP 1 SECTOR_NO FROM COMPANY) AS REGIME,   
                        TOTALHT AS QUANTITY, 
                        QUANTITY AS LINGE,   
                        ROUND(QUANTITY * ISNULL((SELECT TOP 1 FACTOR FROM ITEM_UNIT WHERE (ID = '002' OR ID = '005') AND ITEM_UNIT.ITEM = DOC_ITEMS_VW_01.ITEM AND DELETED = 0),0),3) AS KG,   
                        (SELECT TOP 1 GENRE FROM ITEMS_GRP WHERE ITEMS_GRP.ITEM = DOC_ITEMS_VW_01.ITEM) AS NATURE,   
                        (SELECT TOP 1 TRANSPORT_TYPE FROM DOC WHERE DOC.GUID = DOC_ITEMS_VW_01.DOC_GUID) AS TRANSPORT,   
                        (SELECT TOP 1 SUBSTRING(ZIPCODE,0,3) FROM COMPANY) AS ZIPCODE,   
                        (SELECT TOP 1 COUNTRY FROM CUSTOMER_ADRESS WHERE CUSTOMER_ADRESS.ADRESS_NO = 0 AND CUSTOMER_ADRESS.CUSTOMER = DOC_ITEMS_VW_01.OUTPUT AND DELETED = 0) AS COUNTRY,   
                        REF_NO,   
                        (SELECT TOP 1  TITLE FROM CUSTOMER_VW_02 WHERE CUSTOMER_VW_02.GUID = DOC_ITEMS_VW_01.OUTPUT) AS CUSTOMER_NAME,   
                        (SELECT TOP 1  MAIN_GRP_NAME FROM ITEMS_VW_01 WHERE ITEMS_VW_01.GUID = DOC_ITEMS_VW_01.ITEM) AS MAIN_GRP_NAME,   
                        DOC_DATE AS DOC_DATE,   
                        MULTICODE,   
                        ITEM_BARCODE,   
                        ITEM_NAME,   
                        ITEM_CODE,   
                        DESCRIPTION  
                        FROM DOC_ITEMS_VW_01   
                        WHERE DOC_DATE >= @FIRST_DATE AND DOC_DATE <= @LAST_DATE AND 
                        (SELECT TOP 1 DEB FROM CUSTOMERS WHERE CUSTOMERS.GUID = DOC_ITEMS_VW_01.OUTPUT AND DELETED = 0) = 1 AND ITEM_TYPE  = 0 AND (SELECT TOP 1 TYPE FROM ITEMS WHERE ITEMS.GUID = DOC_ITEMS_VW_01.ITEM) = 0 
                        AND TYPE = 0 AND (DOC_TYPE = 20 OR  (DOC_TYPE = 40 AND INVOICE_DOC_GUID <> '00000000-0000-0000-0000-000000000000')) AND QUANTITY > 0 ORDER BY OUTPUT`,
                    param : ['FIRST_DATE:date','LAST_DATE:date'], 
                    value : [this.dtDate.startDate,this.dtDate.endDate]
                },
                sql : this.core.sql
            }
        }

        await this.grdListe.dataRefresh(tmpSource)
    }
    
    onExporting(e) 
    {
        const workbook = new Workbook();
        const worksheet = workbook.addWorksheet('Main sheet');
        exportDataGrid(
        {
            component: e.component,
            worksheet: worksheet,
            customizeCell: function(options) {
                const excelCell = options;
                excelCell.font = { name: 'Arial', size: 12 };
                excelCell.alignment = { horizontal: 'left' };
            } 
        })
        .then(function() 
        {
            workbook.csv.writeBuffer().then(function(buffer) 
            {
                let csvContent = new TextDecoder().decode(buffer);
                csvContent = csvContent.replace(/,/g, ';');
                saveAs(new Blob([csvContent], { type: 'application/octet-stream' }), 'Rapport-DEBWEB.csv');
            });
        });
        e.cancel = true;
    }
    render()
    {
        return(
            <div>
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
                            <NdForm colCount={2} id="frmKriter">
                                <NdItem>
                                    <NdLabel text={this.t("dtDate")} alignment="right" />
                                    <NbDateRange id={"dtDate"} parent={this} startDate={moment().subtract(1, 'month').startOf('month')} endDate={ moment().subtract(1, 'month').endOf('month')}/>
                                </NdItem>
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
                            <NdButton text={this.t("btnGet")} type="success" width="100%" onClick={this.btnGetirClick}/>
                        </div>
                    </div>
                    <div className="row px-2 pt-1">
                        <div className="col-12">
                            <NdGrid id="grdListe" parent={this} 
                            selection={{mode:"multiple"}} 
                            showBorders={true}
                            filterRow={{visible:true}} 
                            headerFilter={{visible:true}}
                            height={'700px'} 
                            width={'100%'}
                            columnAutoWidth={true}
                            allowColumnReordering={true}
                            allowColumnResizing={true}
                            loadPanel={{enabled:true}}
                            onExporting={this.onExporting}
                            >                            
                                {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Paging defaultPageSize={20} /> : <Paging enabled={false} />}
                                {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Pager visible={true} allowedPageSizes={[5,10,50]} showPageSizeSelector={true} /> : <Paging enabled={false} />}
                                {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Scrolling mode="standart" /> : <Scrolling mode="virtual" />}
                                <StateStoring enabled={true} type="custom" customLoad={this.loadState} customSave={this.saveState} storageKey={this.props.data.id + "_grdListe"}/>
                                <ColumnChooser enabled={true} />
                                <Export enabled={true} allowExportSelectedData={true} />
                                <Column caption="1"><Column dataField="CUSTOMS_NO" caption={this.t("grdListe.clmCustomsNo")} visible={true} /></Column>
                                <Column caption="2"><Column dataField="ORIGIN" caption={this.t("grdListe.clmOrigin")} visible={true}/></Column>
                                <Column caption="3"><Column dataField="REGIME" caption={this.t("grdListe.clmRegime")} visible={true} /></Column>
                                <Column caption="4"><Column dataField="QUANTITY" caption={this.t("grdListe.clmQuantity")} visible={true} /></Column> 
                                <Column caption="5"><Column dataField="KG" caption={this.t("grdListe.clmKg")}  visible={true} /></Column> 
                                <Column caption="6"><Column dataField="LINGE" caption={this.t("grdListe.clmLinge")}  visible={true} /></Column> 
                                <Column caption="7"><Column dataField="NATURE" caption={this.t("grdListe.clmNature")}  visible={true} /></Column> 
                                <Column caption="8"><Column dataField="TRANSPORT" caption={this.t("grdListe.clmTransport")}  visible={true} /></Column> 
                                <Column caption="10"><Column dataField="ZIPCODE" caption={this.t("grdListe.clmZipcode")}  visible={true} /></Column> 
                                <Column caption="11"><Column dataField="COUNTRY" caption={this.t("grdListe.clmCountry")}  visible={true} /></Column> 
                                <Column caption="12"><Column dataField="REF_NO" caption={this.t("grdListe.clmRefno")}  visible={true} /></Column> 
                                <Column caption="13"><Column dataField="CUSTOMER_NAME" caption={this.t("grdListe.clmCustomerName")}  visible={true} /></Column> 
                                <Column caption="14"><Column dataField="DOC_DATE" caption={this.t("grdListe.clmDocDate")}  visible={true}  dataType="datetime" format={"dd/MM/yyyy"} /></Column> 
                                <Column caption="15"><Column dataField="MULTICODE" caption={this.t("grdListe.clmMulticode")}  visible={true} /></Column> 
                                <Column caption="16"><Column dataField="ITEM_NAME" caption={this.t("grdListe.clmItemName")}  visible={true} /></Column> 
                                <Column caption="17"><Column dataField="ITEM_CODE" caption={this.t("grdListe.clmItemCode")}  visible={true} /></Column> 
                                <Column caption="18"><Column dataField="MAIN_GRP_NAME" caption={this.t("grdListe.clmItemGroup")}  visible={true} /></Column> 
                                <Column caption="19"><Column dataField="ITEM_BARCODE" caption={this.t("grdListe.clmItemBarcode")}  visible={true} /></Column> 
                                <Column caption="20"><Column dataField="DESCRIPTION" caption={this.t("grdListe.clmDescription")}  visible={true} /></Column> 
                            </NdGrid>
                        </div>
                    </div>
                </ScrollView>
            </div>
        )
    }
}