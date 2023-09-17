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

export default class debReport extends React.PureComponent
{
    constructor(props)
    {
        super(props)

        this.state = 
        {
            columnListValue : ['CUSTOMS_NO','ORIGIN','REGIME','QUANTITY','KG','LINGE','NATURE','TRANSPORT','ZIPCODE','REF_NO','CUSTOMER_NAME','DOC_DATE','COUNTRY','MULTICODE','ITEM_NAME','ITEM_CODE','ITEM_BARCODE','DESCRIPTION']
        }
        
        this.core = App.instance.core;
        this.columnListData = 
        [
            {CODE : "CUSTOMS_NO",NAME : this.t("grdListe.clmCustomsNo")},                                   
            {CODE : "ORIGIN",NAME : this.t("grdListe.clmOrigin")},
            {CODE : "REGIME",NAME : this.t("grdListe.clmRegime")},
            {CODE : "QUANTITY",NAME : this.t("grdListe.clmQuantity")},
            {CODE : "KG",NAME : this.t("grdListe.clmKg")},
            {CODE : "LINGE",NAME : this.t("grdListe.clmLinge")},
            {CODE : "ZIPCODE",NAME : this.t("grdListe.clmZipcode")},
            {CODE : "REF_NO",NAME : this.t("grdListe.clmRefno")},
            {CODE : "CUSTOMER_NAME",NAME : this.t("grdListe.clmCustomerName")},
            {CODE : "DOC_DATE",NAME : this.t("grdListe.clmDocDate")},
            {CODE : "MULTICODE",NAME : this.t("grdListe.clmMulticode")},
            {CODE : "ITEM_BARCODE",NAME : this.t("grdListe.clmItemBarcode")},
            {CODE : "ITEM_CODE",NAME : this.t("grdListe.clmItemCode")},
            {CODE : "ITEM_NAME",NAME : this.t("grdListe.clmItemName")},
            {CODE : "DESCRIPTION",NAME : this.t("grdListe.clmDescription")},
            {CODE : "COUNTRY",NAME : this.t("grdListe.clmCountry")},
            {CODE : "NATURE",NAME : this.t("grdListe.clmNature")},
            {CODE : "TRANSPORT",NAME : this.t("grdListe.clmTransport")},

        ]
        this.groupList = [];
        this._btnGetirClick = this._btnGetirClick.bind(this)
        this._columnListBox = this._columnListBox.bind(this)
    }
    componentDidMount()
    {
        setTimeout(async () => 
        {
        }, 1000);
    }
    _columnListBox(e)
    {
        let onOptionChanged = (e) =>
        {
            if (e.name == 'selectedItemKeys') 
            {
                this.groupList = [];
                if(typeof e.value.find(x => x == 'CUSTOMS_NO') != 'undefined')
                {
                    this.groupList.push('CUSTOMS_NO')
                }
                if(typeof e.value.find(x => x == 'ORIGIN') != 'undefined')
                {
                    this.groupList.push('ORIGIN')
                }                
                if(typeof e.value.find(x => x == 'REGIME') != 'undefined')
                {
                    this.groupList.push('REGIME')
                }
                if(typeof e.value.find(x => x == 'QUANTITY') != 'undefined')
                {
                    this.groupList.push('QUANTITY')
                }
                if(typeof e.value.find(x => x == 'KG') != 'undefined')
                {
                    this.groupList.push('KG')
                }
                if(typeof e.value.find(x => x == 'LINGE') != 'undefined')
                {
                    this.groupList.push('LINGE')
                }
                if(typeof e.value.find(x => x == 'ZIPCODE') != 'undefined')
                {
                    this.groupList.push('ZIPCODE')
                }
                if(typeof e.value.find(x => x == 'REF_NO') != 'undefined')
                {
                    this.groupList.push('REF_NO')
                }
                if(typeof e.value.find(x => x == 'CUSTOMER_NAME') != 'undefined')
                {
                    this.groupList.push('CUSTOMER_NAME')
                }
                if(typeof e.value.find(x => x == 'DOC_DATE') != 'undefined')
                {
                    this.groupList.push('DOC_DATE')
                }
                if(typeof e.value.find(x => x == 'MULTICODE') != 'undefined')
                {
                    this.groupList.push('MULTICODE')
                }
                if(typeof e.value.find(x => x == 'ITEM_NAME') != 'undefined')
                {
                    this.groupList.push('ITEM_NAME')
                }
                if(typeof e.value.find(x => x == 'ITEM_CODE') != 'undefined')
                {
                    this.groupList.push('ITEM_CODE')
                }
                if(typeof e.value.find(x => x == 'ITEM_BARCODE') != 'undefined')
                {
                    this.groupList.push('ITEM_BARCODE')
                }
                if(typeof e.value.find(x => x == 'DESCRIPTION') != 'undefined')
                {
                    this.groupList.push('DESCRIPTION')
                }
                if(typeof e.value.find(x => x == 'COUNTRY') != 'undefined')
                {
                    this.groupList.push('COUNTRY')
                }
                if(typeof e.value.find(x => x == 'NATURE') != 'undefined')
                {
                    this.groupList.push('NATURE')
                }
                if(typeof e.value.find(x => x == 'TRANSPORT') != 'undefined')
                {
                    this.groupList.push('TRANSPORT')
                }
                for (let i = 0; i < this.grdListe.devGrid.columnCount(); i++) 
                {
                    if(typeof e.value.find(x => x == this.grdListe.devGrid.columnOption(i).name) == 'undefined')
                    {
                        this.grdListe.devGrid.columnOption(i,'visible',false)
                    }
                    else
                    {
                        this.grdListe.devGrid.columnOption(i,'visible',true)
                    }
                }

                this.setState(
                    {
                        columnListValue : e.value
                    }
                )
            }
        }
        
        return(
            <NdListBox id='columnListBox' parent={this}
            data={{source: this.columnListData}}
            width={'100%'}
            showSelectionControls={true}
            selectionMode={'multiple'}
            displayExpr={'NAME'}
            keyExpr={'CODE'}
            value={this.state.columnListValue}
            onOptionChanged={onOptionChanged}
            >
            </NdListBox>
        )
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
                    "ORIGIN,   " +
                    "(SELECT TOP 1 SECTOR_NO FROM COMPANY) AS REGIME,   " +
                    "QUANTITY,   " +
                    "ROUND(QUANTITY * ISNULL((SELECT TOP 1 FACTOR FROM ITEM_UNIT WHERE (ID = '002' OR ID = '005') AND ITEM_UNIT.ITEM = DOC_ITEMS_VW_01.ITEM AND DELETED = 0),0),3) AS KG,   " +
                    "CASE WHEN ISNULL((SELECT TOP 1 FACTOR FROM ITEM_UNIT WHERE ID = '005' AND ITEM_UNIT.ITEM = DOC_ITEMS_VW_01.ITEM AND DELETED = 0),0) <> 0 THEN QUANTITY ELSE 0 END  AS LINGE,   " +
                    "(SELECT TOP 1 GENRE FROM ITEMS_GRP WHERE ITEMS_GRP.ITEM = DOC_ITEMS_VW_01.ITEM) AS NATURE,   " +
                    "(SELECT TOP 1 TRANSPORT_TYPE FROM DOC WHERE DOC.GUID = DOC_ITEMS_VW_01.DOC_GUID) AS TRANSPORT,   " +
                    "(SELECT TOP 1 SUBSTRING(ZIPCODE,0,3) FROM COMPANY) AS ZIPCODE,   " +
                    "(SELECT TOP 1 COUNTRY FROM CUSTOMER_ADRESS WHERE CUSTOMER_ADRESS.ADRESS_NO = 0 AND CUSTOMER_ADRESS.CUSTOMER = DOC_ITEMS_VW_01.OUTPUT AND DELETED = 0) AS COUNTRY,   " +
                    "REF_NO,   " +
                    "(SELECT TOP 1  TITLE FROM CUSTOMER_VW_02 WHERE CUSTOMER_VW_02.GUID = DOC_ITEMS_VW_01.OUTPUT) AS CUSTOMER_NAME,   " +
                    "DOC_DATE AS DOC_DATE,   " +
                    "MULTICODE,   " +
                    "ITEM_BARCODE,   " +
                    "ITEM_NAME,   " +
                    "ITEM_CODE,   " +
                    "DESCRIPTION   " +
                    "FROM DOC_ITEMS_VW_01   " +
                    "WHERE    DOC_DATE >= @FIRST_DATE AND DOC_DATE <= @LAST_DATE AND " +
                    "(SELECT TOP 1 DEB FROM CUSTOMERS WHERE CUSTOMERS.GUID = DOC_ITEMS_VW_01.OUTPUT AND DELETED = 0) = 1 AND ITEM_TYPE  = 0 AND (SELECT TOP 1 TYPE FROM ITEMS WHERE ITEMS.GUID = DOC_ITEMS_VW_01.ITEM) = 0 " +
                    "AND TYPE = 0 AND (DOC_TYPE = 20 OR  (DOC_TYPE = 40 AND INVOICE_DOC_GUID <> '00000000-0000-0000-0000-000000000000')) ORDER BY OUTPUT" ,
                    param : ['FIRST_DATE:date','LAST_DATE:date'], 
                    value : [this.dtDate.startDate,this.dtDate.endDate]
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
                            <Form colCount={2} id="frmKriter">
                            <Item>
                                <NbDateRange id={"dtDate"} parent={this} startDate={moment().subtract(1, 'month').startOf('month')} endDate={ moment().subtract(1, 'month').endOf('month')}/>
                            </Item>
                            </Form>
                        </div>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-3">
                            <NdDropDownBox simple={true} parent={this} id="cmbColumn"
                            value={this.state.columnListValue}
                            displayExpr="NAME"                       
                            valueExpr="CODE"
                            data={{source: this.columnListData}}
                            contentRender={this._columnListBox}
                            />
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
                            >                            
                                <Paging defaultPageSize={20} />
                                <Pager visible={true} allowedPageSizes={[5,10,20,50]} showPageSizeSelector={true} />
                                <Export fileName={this.lang.t("menuOff.slsRpt_02_005")} enabled={true} allowExportSelectedData={true} />
                                <Column dataField="CUSTOMS_NO" caption={this.t("grdListe.clmCustomsNo")} visible={true} /> 
                                <Column dataField="ORIGIN" caption={this.t("grdListe.clmOrigin")} visible={true}/> 
                                <Column dataField="REGIME" caption={this.t("grdListe.clmRegime")} visible={true} /> 
                                <Column dataField="QUANTITY" caption={this.t("grdListe.clmQuantity")} visible={true} /> 
                                <Column dataField="KG" caption={this.t("grdListe.clmKg")}  visible={true} /> 
                                <Column dataField="LINGE" caption={this.t("grdListe.clmLinge")}  visible={true} /> 
                                <Column dataField="NATURE" caption={this.t("grdListe.clmNature")}  visible={true} /> 
                                <Column dataField="TRANSPORT" caption={this.t("grdListe.clmTransport")}  visible={true} /> 
                                <Column dataField="ZIPCODE" caption={this.t("grdListe.clmZipcode")}  visible={true} /> 
                                <Column dataField="COUNTRY" caption={this.t("grdListe.clmCountry")}  visible={true} /> 
                                <Column dataField="REF_NO" caption={this.t("grdListe.clmRefno")}  visible={true} /> 
                                <Column dataField="CUSTOMER_NAME" caption={this.t("grdListe.clmCustomerName")}  visible={true} /> 
                                <Column dataField="DOC_DATE" caption={this.t("grdListe.clmDocDate")}  visible={true}  dataType="datetime" format={"dd/MM/yyyy"} /> 
                                <Column dataField="MULTICODE" caption={this.t("grdListe.clmMulticode")}  visible={true} /> 
                                <Column dataField="ITEM_NAME" caption={this.t("grdListe.clmItemName")}  visible={true} /> 
                                <Column dataField="ITEM_CODE" caption={this.t("grdListe.clmItemCode")}  visible={true} /> 
                                <Column dataField="ITEM_BARCODE" caption={this.t("grdListe.clmItemBarcode")}  visible={true} /> 
                                <Column dataField="DESCRIPTION" caption={this.t("grdListe.clmDescription")}  visible={true} /> 
                            </NdGrid>
                        </div>
                    </div>
                </ScrollView>
            </div>
        )
    }
}