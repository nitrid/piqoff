import React from 'react';
import App from '../../../lib/app.js';
import { docCls,docItemsCls,docCustomerCls,deptCreditMatchingCls } from '../../../../core/cls/doc.js';
import moment from 'moment';

import ScrollView from 'devextreme-react/scroll-view';
import Toolbar from 'devextreme-react/toolbar';
import Form, { Label,Item,EmptyItem } from 'devextreme-react/form';
import ContextMenu from 'devextreme-react/context-menu';
import TabPanel from 'devextreme-react/tab-panel';
import { Button } from 'devextreme-react/button';

import NbDateRange from '../../../../core/react/bootstrap/daterange.js';
import NdGrid,{Column,Editing,Paging,Pager,Scrolling,KeyboardNavigation,Export,Summary,TotalItem,StateStoring,ColumnChooser} from '../../../../core/react/devex/grid.js';
import NdButton from '../../../../core/react/devex/button.js';
import NdDatePicker from '../../../../core/react/devex/datepicker.js';
import NdImageUpload from '../../../../core/react/devex/imageupload.js';
import { dialog } from '../../../../core/react/devex/dialog.js';
import { datatable } from '../../../../core/core.js';
import tr from '../../../meta/lang/devexpress/tr.js';
import NdTextBox, { Validator, NumericRule, RequiredRule, CompareRule, EmailRule, PatternRule, StringLengthRule, RangeRule, AsyncRule } from '../../../../core/react/devex/textbox.js'
import NdSelectBox from '../../../../core/react/devex/selectbox.js';
import NdDropDownBox from '../../../../core/react/devex/dropdownbox.js';
import NdPopGrid from '../../../../core/react/devex/popgrid.js';
import NdListBox from '../../../../core/react/devex/listbox.js';
import NdPopUp from '../../../../core/react/devex/popup.js';
import NdHtmlEditor from '../../../../core/react/devex/htmlEditor.js';
import NdCheckBox from '../../../../core/react/devex/checkbox.js';
import NdCollectionGrid, { groupCollection } from '../../../../core/react/devex/collectiongrid.js';
import NdOpenInvoiceReport from '../../../../core/react/devex/openinvoicereport.js';

export default class openInvoiceSalesReport extends React.PureComponent
{
    constructor(props)
    {
        super(props)
        this.state = 
        {
            columnListValue : ['DOC_DATE','INPUT_CODE','INPUT_NAME','DOC_REF','DOC_REF_NO','REMAINDER','DOC_TOTAL']
        }
        
        this.core = App.instance.core;
        this.columnListData = 
        [
            {CODE : "DOC_DATE",NAME : this.t("grdListe.clmDate")},                                   
            {CODE : "INPUT_CODE",NAME : this.t("grdListe.clmCode")},                                   
            {CODE : "INPUT_NAME",NAME : this.t("grdListe.clmName")},
            {CODE : "DOC_REF",NAME : this.t("grdListe.clmRef")},
            {CODE : "DOC_REF_NO",NAME : this.t("grdListe.clmRefNo")},
            {CODE : "REMAINDER",NAME : this.t("grdListe.clmRemainder")},
            {CODE : "DOC_TOTAL",NAME : this.t("grdListe.clmTotal")},
        ]
        this.groupList = [];
        this._btnGetirClick = this._btnGetirClick.bind(this)
        this._columnListBox = this._columnListBox.bind(this)
        this.saveState = this.saveState.bind(this)
        this.loadState = this.loadState.bind(this)
        this.groupOpenInvoices = this.groupOpenInvoices.bind(this)
    }
    loadState() 
    {
        let tmpLoad = this.access.filter({ELEMENT:'grdListe',USERS:this.user.CODE})
        return tmpLoad.getValue()
    }
    saveState(e)
    {
        let tmpSave = this.access.filter({ELEMENT:'grdListe',USERS:this.user.CODE})
        tmpSave.setValue(e)
        tmpSave.save()
    }

    async componentDidMount()
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
                if(typeof e.value.find(x => x == 'DOC_DATE') != 'undefined')
                {
                    this.groupList.push('DOC_DATE')
                }
                if(typeof e.value.find(x => x == 'INPUT_CODE') != 'undefined')
                {
                    this.groupList.push('INPUT_CODE')
                }
                if(typeof e.value.find(x => x == 'INPUT_NAME') != 'undefined')
                {
                    this.groupList.push('INPUT_NAME')
                }                
                if(typeof e.value.find(x => x == 'DOC_REF') != 'undefined')
                {
                    this.groupList.push('DOC_REF')
                }
                if(typeof e.value.find(x => x == 'DOC_REF_NO') != 'undefined')
                {
                    this.groupList.push('DOC_REF_NO')
                }
                if(typeof e.value.find(x => x == 'REMAINDER') != 'undefined')
                {
                    this.groupList.push('REMAINDER')
                }
                if(typeof e.value.find(x => x == 'DOC_TOTAL') != 'undefined')
                {
                    this.groupList.push('DOC_TOTAL')
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
                })
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
        if(this.txtCustomerCode.value == '')
        {
            this.txtCustomerCode.CODE = ''
        }
        let tmpSource =
        {
            source : 
            {
                groupBy : this.groupList,
                select: 
                {
                    query: "SELECT *, ROUND((DOC_TOTAL - PAYING_AMOUNT), 2) AS REMAINDER " + 
                           "FROM ( " +
                           "SELECT " +
                           "TYPE, " +
                           "DOC_TYPE, " +
                           "DOC_DATE, " +
                           "INPUT_CODE, " +
                           "INPUT_NAME, " +
                           "DOC_REF, " +
                           "DOC_REF_NO, " +
                           "DOC_GUID ," +
                           "MAX(DOC_TOTAL) AS DOC_TOTAL, " +  // Faturanın toplamı
                           "SUM(PAYING_AMOUNT) AS PAYING_AMOUNT  " + // Ödeme ve iadelerin toplamı
                           " FROM DEPT_CREDIT_MATCHING_VW_03 " +
                           " WHERE TYPE = 1 AND DOC_TYPE = 20 AND ((INPUT_CODE = @INPUT_CODE) OR (@INPUT_CODE = '')) " +
                           " AND DOC_DATE >= @FIRST_DATE AND DOC_DATE <= @LAST_DATE " +
                           " GROUP BY DOC_TYPE, TYPE, DOC_DATE, INPUT_NAME, DOC_REF_NO, DOC_REF, INPUT_CODE , DOC_GUID " +
                           ") AS TMP " +
                           "WHERE ROUND((DOC_TOTAL - PAYING_AMOUNT), 2) > 0",  // Ödenmemiş bakiye kontrolü
                    param : ['FIRST_DATE:date','LAST_DATE:date','INPUT_CODE:string|50'],
                    value : [this.dtDate.startDate,this.dtDate.endDate,this.txtCustomerCode.CODE],
                },
                sql : this.core.sql
            }
        }

        let tmpData = await this.core.sql.execute(tmpSource.source.select);
        if(tmpData.result.recordset.length > 0) {
            // NdOpenInvoiceReport bileşeni kendi içinde veriyi müşteri bazında grupluyor
            this.openInvoiceGrid.setDataSource(tmpData.result.recordset);
        } else {
            this.openInvoiceGrid.setDataSource([]);
        }
    }

    groupOpenInvoices(rows) {
        let map = new Map();

        for (let row of rows) {
            let key = row.INPUT_NAME;
            
            if (!map.has(key)) {
                map.set(key, {
                    INVOICE_KEY: key, 
                    INPUT_NAME: row.INPUT_NAME,
                    REMAINDER: 0,
                    DOC_TOTAL: 0,
                    INVOICE_COUNT: 0,  
                    INVOICES: []
                });
            }

            let invoice = {
                DOC_DATE: row.DOC_DATE,
                DOC_GUID: row.DOC_GUID,
                DOC_REF: row.DOC_REF,
                DOC_REF_NO: row.DOC_REF_NO,
                REMAINDER: row.REMAINDER,
                DOC_TOTAL: row.DOC_TOTAL,
                TYPE: row.TYPE,
                DOC_TYPE: row.DOC_TYPE,
                INPUT_NAME: row.INPUT_NAME
            };

            map.get(key).INVOICES.push(invoice);
            
            // Toplamları hesapla ve fatura sayısını artır
            map.get(key).REMAINDER += Number(row.REMAINDER || 0);
            map.get(key).DOC_TOTAL += Number(row.DOC_TOTAL || 0);
            map.get(key).INVOICE_COUNT += 1;
        }

        let result = Array.from(map.values());
        return result;
    }

    render(){
        return (
            <div>
                <ScrollView>
                    {/* Toolbar */}
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
                                    <NbDateRange id={"dtDate"} parent={this} startDate={moment().startOf('month')} endDate={moment().endOf('month')}/>
                                </Item>
                                <Item>
                                    <EmptyItem/>
                                </Item>
                                <Item>
                                    {/* <Label text={this.t("txtCustomerCode")} alignment="right" /> */}
                                    <NdTextBox id="txtCustomerCode" parent={this} simple={true}  notRefresh = {true} placeholder = {this.t("txtCustomerCode")}
                                    onEnterKey={(async()=>
                                    {
                                        await this.pg_txtCustomerCode.setVal(this.txtCustomerCode.value)
                                        this.pg_txtCustomerCode.show()
                                        this.pg_txtCustomerCode.onClick = (data) =>
                                        { 
                                            if(data.length > 0)
                                            {
                                                this.txtCustomerCode.setState({value:data[0].TITLE})
                                                this.txtCustomerCode.CODE = data[0].CODE
                                            }
                                        }
                                    }).bind(this)}
                                    onValueChanged={(async(e)=>
                                    {
                                        if(e.value == '')
                                        {
                                            this.txtCustomerCode.CODE = ""
                                        }
                                    }    
                                    )}
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
                                                            this.txtCustomerCode.setState({value:data[0].TITLE})
                                                            this.txtCustomerCode.CODE = data[0].CODE
                                                        }
                                                    }
                                                }
                                            },
                                            {
                                                id:'02',
                                                icon:'clear',
                                                onClick:()=>
                                                {
                                                    this.txtCustomerCode.setState({value:''})
                                                    this.txtCustomerCode.CODE =''
                                                }
                                            },
                                        ]
                                    }
                                    >
                                    <Validator validationGroup={"customerSaleRebate" + this.tabIndex}>
                                        <RequiredRule message={this.t("validCode")} />
                                    </Validator>  
                                    </NdTextBox>
                                    {/*CARI SECIMI POPUP */}
                                    <NdPopGrid id={"pg_txtCustomerCode"} parent={this} container={"#root"}
                                    visible={false}
                                    position={{of:'#root'}} 
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
                                                query : "SELECT GUID,CODE,TITLE,NAME,LAST_NAME,[TYPE_NAME],[GENUS_NAME] FROM CUSTOMER_VW_01 WHERE (UPPER(CODE) LIKE UPPER(@VAL) OR UPPER(TITLE) LIKE UPPER(@VAL)) AND STATUS = 1",
                                                param : ['VAL:string|50']
                                            },
                                            sql:this.core.sql
                                        }
                                    }}
                                    button=
                                    {
                                        {
                                            id:'01',
                                            icon:'more',
                                            onClick:()=>
                                            {
                                                console.log(1111)
                                            }
                                        }
                                    }
                                    >
                                        <Column dataField="CODE" caption={this.t("pg_txtCustomerCode.clmCode")} width={150} />
                                        <Column dataField="TITLE" caption={this.t("pg_txtCustomerCode.clmTitle")} width={500} defaultSortOrder="asc" />
                                        <Column dataField="TYPE_NAME" caption={this.t("pg_txtCustomerCode.clmTypeName")} width={150} />
                                        <Column dataField="GENUS_NAME" caption={this.t("pg_txtCustomerCode.clmGenusName")} width={150} />
                                        
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
                            <NdButton text={this.t("btnGet")} type="success" width="100%" onClick={this._btnGetirClick}></NdButton>
                        </div>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <NdOpenInvoiceReport
                                id="openInvoiceGrid"
                                parent={this}
                                height={'650px'}
                                currency="EUR"
                                allowFiltering={true}
                                allowSorting={true}
                                allowExporting={true}
                                showGroupPanel={false}
                                onReady={(grid) => this.openInvoiceGrid = grid}
                            />
                        </div>
                    </div>          
                </ScrollView>
            </div>
        )
    }
}