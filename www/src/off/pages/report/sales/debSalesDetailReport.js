import React from 'react';
import App from '../../../lib/app.js';
import moment from 'moment';

import Toolbar,{Item} from 'devextreme-react/toolbar';
import Form, { Label,EmptyItem } from 'devextreme-react/form';
import ScrollView from 'devextreme-react/scroll-view';

import NdGrid,{Column, ColumnChooser,ColumnFixing,Paging,Pager,Scrolling,Export, Summary, TotalItem} from '../../../../core/react/devex/grid.js';
import NdTextBox from '../../../../core/react/devex/textbox.js'
import NdSelectBox from '../../../../core/react/devex/selectbox.js';
import NdDropDownBox from '../../../../core/react/devex/dropdownbox.js';
import NbDateRange from '../../../../core/react/bootstrap/daterange.js';
import NdPopGrid from '../../../../core/react/devex/popgrid.js';
import NdListBox from '../../../../core/react/devex/listbox.js';
import NdButton from '../../../../core/react/devex/button.js';
import NdCheckBox from '../../../../core/react/devex/checkbox.js';
import { dialog } from '../../../../core/react/devex/dialog.js';
import { Workbook } from 'exceljs';
import { exportDataGrid } from 'devextreme/excel_exporter';
import saveAs from 'file-saver';

export default class debReport extends React.PureComponent
{
    constructor(props)
    {
        super(props)

   
        this.core = App.instance.core;
       
        this.groupList = [];
        this._btnGetirClick = this._btnGetirClick.bind(this)
    }
    componentDidMount()
    {
        setTimeout(async () => 
        {
        }, 1000);
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
                    "(SELECT TOP 1  CASE WHEN LEN(CUSTOMS_CODE) = 7 THEN '0'+ CUSTOMS_CODE ELSE CUSTOMS_CODE END FROM ITEMS_GRP WHERE ITEMS_GRP.ITEM = DOC_ITEMS_VW_01.ITEM) AS CUSTOMS_NO,   " +
                    "(SELECT TOP 1 ORGINS FROM ITEMS_GRP WHERE ITEMS_GRP.ITEM = DOC_ITEMS_VW_01.ITEM) AS ORIGIN,   " +
                    "(SELECT TOP 1 SECTOR_NO FROM COMPANY) AS REGIME,   " +
                    "TOTALHT AS QUANTITY, " +
                    "QUANTITY AS LINGE,   " +
                    "ROUND(QUANTITY * ISNULL((SELECT TOP 1 FACTOR FROM ITEM_UNIT WHERE (ID = '002' OR ID = '005') AND ITEM_UNIT.ITEM = DOC_ITEMS_VW_01.ITEM AND DELETED = 0),0),3) AS KG,   " +
                    "'11' AS NATURE,   " +
                    "'3' AS TRANSPORT,   " +
                    "(SELECT TOP 1 SUBSTRING(ZIPCODE,0,3) FROM COMPANY) AS ZIPCODE,   " +
                    "(SELECT TOP 1 COUNTRY FROM CUSTOMER_ADRESS WHERE CUSTOMER_ADRESS.ADRESS_NO = 0 AND CUSTOMER_ADRESS.CUSTOMER = DOC_ITEMS_VW_01.OUTPUT AND DELETED = 0) AS COUNTRY,   " +
                    "REF_NO,   " +
                    "(SELECT TOP 1  TITLE FROM CUSTOMER_VW_02 WHERE CUSTOMER_VW_02.GUID = DOC_ITEMS_VW_01.OUTPUT) AS CUSTOMER_NAME,   " +
                    "(SELECT TOP 1  MAIN_GRP_NAME FROM ITEMS_VW_01 WHERE ITEMS_VW_01.GUID = DOC_ITEMS_VW_01.ITEM) AS MAIN_GRP_NAME,   " +
                    "DOC_DATE AS DOC_DATE,   " +
                    "MULTICODE,   " +
                    "ITEM_BARCODE,   " +
                    "ITEM_NAME,   " +
                    "ITEM_CODE,   " +
                    "DESCRIPTION   " +
                    "FROM DOC_ITEMS_VW_01   " +
                    "WHERE    DOC_DATE >= @FIRST_DATE AND DOC_DATE <= @LAST_DATE AND " +
                    "(SELECT TOP 1 COUNTRY FROM CUSTOMER_VW_02 WHERE CUSTOMER_VW_02.GUID = DOC_ITEMS_VW_01.INPUT) <> 'FR' AND ITEM_TYPE  = 0 AND (SELECT TOP 1 TYPE FROM ITEMS WHERE ITEMS.GUID = DOC_ITEMS_VW_01.ITEM) = 0 " +
                    "AND TYPE = 1 AND (DOC_TYPE = 20 OR  (DOC_TYPE = 40 AND INVOICE_DOC_GUID <> '00000000-0000-0000-0000-000000000000')) AND QUANTITY > 0 ORDER BY OUTPUT" ,
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
        }).then(function() 
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
                            <Form colCount={2} id="frmKriter">
                            <Item>
                                <NbDateRange id={"dtDate"} parent={this} startDate={moment().subtract(1, 'month').startOf('month')} endDate={ moment().subtract(1, 'month').endOf('month')}/>
                            </Item>
                            </Form>
                        </div>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-3">
                            {/* <NdDropDownBox simple={true} parent={this} id="cmbColumn"
                            value={this.state.columnListValue}
                            displayExpr="NAME"                       
                            valueExpr="CODE"
                            data={{source: this.columnListData}}
                            contentRender={this._columnListBox}
                            /> */}
                        </div>
                        <div className="col-3">
                      
                        </div>
                        <div className="col-3">
                            
                        </div>
                        <div className="col-3">
                            <NdButton text={this.t("btnGet")} type="success" width="100%" onClick={this._btnGetirClick}></NdButton>
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
                            onExporting={this.onExporting}
                            >                            
                                {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Paging defaultPageSize={20} /> : <Paging enabled={false} />}
                                {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Pager visible={true} allowedPageSizes={[5,10,50]} showPageSizeSelector={true} /> : <Paging enabled={false} />}
                                {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Scrolling mode="standart" /> : <Scrolling mode="infinite" />}
                                <Export enabled={true} allowExportSelectedData={true} />
                                <ColumnChooser enabled={true} />
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
                            </NdGrid>
                        </div>
                    </div>
                </ScrollView>
            </div>
        )
    }
}