import React from 'react';
import App from '../../../lib/app.js';
import moment from 'moment';

import Toolbar,{Item} from 'devextreme-react/toolbar';
import Form, { Label,EmptyItem } from 'devextreme-react/form';
import ScrollView from 'devextreme-react/scroll-view';

import NdGrid,{Column, ColumnChooser,ColumnFixing,Paging,Pager,Scrolling,Export, Summary, TotalItem} from '../../../../core/react/devex/grid.js';
import NdTextBox, { Validator, NumericRule, RequiredRule, CompareRule, EmailRule, PatternRule, StringLengthRule, RangeRule, AsyncRule } from '../../../../core/react/devex/textbox.js'
import NdSelectBox from '../../../../core/react/devex/selectbox.js';
import NdDropDownBox from '../../../../core/react/devex/dropdownbox.js';
import NbDateRange from '../../../../core/react/bootstrap/daterange.js';
import NdPopGrid from '../../../../core/react/devex/popgrid.js';
import NdListBox from '../../../../core/react/devex/listbox.js';
import NdButton from '../../../../core/react/devex/button.js';
import NdCheckBox from '../../../../core/react/devex/checkbox.js';
import { dialog } from '../../../../core/react/devex/dialog.js';

export default class customerSaleRebateReport extends React.PureComponent
{
    constructor(props)
    {
        super(props)

        this.state = 
        {
            columnListValue : ['INPUT_CODE','INPUT_NAME','DISPATCH','INVOICE','REBATE']
        }
        
        this.core = App.instance.core;
        this.columnListData = 
        [
            {CODE : "INPUT_CODE",NAME : this.t("grdListe.clmCode")},                                   
            {CODE : "INPUT_NAME",NAME : this.t("grdListe.clmName")},
            {CODE : "DISPATCH",NAME : this.t("grdListe.clmDispatch")},
            {CODE : "INVOICE",NAME : this.t("grdListe.clmInvoice")},
            {CODE : "REBATE",NAME : this.t("grdListe.clmRebate")},
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
                if(typeof e.value.find(x => x == 'INPUT_CODE') != 'undefined')
                {
                    this.groupList.push('INPUT_CODE')
                }
                if(typeof e.value.find(x => x == 'INPUT_NAME') != 'undefined')
                {
                    this.groupList.push('INPUT_NAME')
                }                
                if(typeof e.value.find(x => x == 'DISPATCH') != 'undefined')
                {
                    this.groupList.push('DISPATCH')
                }
                if(typeof e.value.find(x => x == 'INVOICE') != 'undefined')
                {
                    this.groupList.push('INVOICE')
                }
                if(typeof e.value.find(x => x == 'REBATE') != 'undefined')
                {
                    this.groupList.push('REBATE')
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
                    query : "SELECT ITEM, " +
                    "ITEM_NAME, " +
                    "ITEM_CODE, " +
                    "INPUT, " +
                    "INPUT_NAME, " +
                    "INPUT_CODE, " +
                    "ISNULL((SELECT SUM(QUANTITY) FROM DOC_ITEMS WHERE DOC_ITEMS.INPUT = DOC_ITEMS_VW_01.INPUT AND DELETED = 0 AND TYPE = 1 AND DOC_TYPE = 40 AND REBATE = 0 AND DOC_DATE >= @FIRST_DATE AND DOC_DATE <= @LAST_DATE AND DOC_ITEMS.ITEM = DOC_ITEMS_VW_01.ITEM),0) AS DISPATCH, " +
                    "ISNULL((SELECT SUM(QUANTITY) FROM DOC_ITEMS_VW_01 AS FACTURE WHERE FACTURE.INPUT = DOC_ITEMS_VW_01.INPUT AND FACTURE.TYPE = 1 AND DOC_DATE >= @FIRST_DATE AND DOC_DATE <= @LAST_DATE AND (FACTURE.DOC_TYPE = 20 OR (FACTURE.DOC_TYPE = 40 AND FACTURE.INVOICE_DOC_GUID <> '00000000-0000-0000-0000-000000000000')) AND FACTURE.REBATE = 0 AND FACTURE.ITEM = DOC_ITEMS_VW_01.ITEM),0) AS INVOICE, " +
                    "ISNULL((SELECT SUM(QUANTITY) FROM DOC_ITEMS WHERE DOC_ITEMS.INPUT = DOC_ITEMS_VW_01.INPUT AND DELETED = 0 AND TYPE = 0 AND DOC_DATE >= @FIRST_DATE AND DOC_DATE <= @LAST_DATE AND DOC_TYPE IN(40,20) AND REBATE = 1 AND DOC_ITEMS.ITEM = DOC_ITEMS_VW_01.ITEM),0) AS REBATE " +
                    "FROM DOC_ITEMS_VW_01 " +
                    "WHERE TYPE = 1 AND DOC_TYPE IN(40,20) AND DOC_DATE >= @FIRST_DATE AND DOC_DATE <= @LAST_DATE AND INPUT_CODE = @CUSTOMER_CODE " +
                    "GROUP BY ITEM,INPUT,INPUT_NAME,ITEM_NAME,ITEM_CODE,INPUT_CODE ",
                    param : ['FIRST_DATE:date','LAST_DATE:date','CUSTOMER_CODE:string|50'],
                    value : [this.dtDate.startDate,this.dtDate.endDate,this.txtCustomerCode.CODE]
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
                            <Form colCount={2} id="itemSaleRabate">
                            <Item>
                                <Label text={this.t("txtCustomerCode")} alignment="right" />
                                <NdTextBox id="txtCustomerCode" parent={this} simple={true}  notRefresh = {true}
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
                            <Item>
                                <NbDateRange id={"dtDate"} parent={this} startDate={moment().startOf('month')} endDate={moment().endOf('month')}/>
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
                            <NdButton text={this.t("btnGet")} type="success" width="100%" validationGroup={"customerSaleRebate" + this.tabIndex} 
                             onClick={async (e)=>
                            {
                                if(e.validationGroup.validate().status == "valid")
                                {
                                    this._btnGetirClick()
                                }
                            }}
                            ></NdButton>
                        </div>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <NdGrid id="grdListe" parent={this} 
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
                            >
                                <Paging defaultPageSize={20} />
                                <Pager visible={true} allowedPageSizes={[5,10,20,50]} showPageSizeSelector={true} />
                                <Export fileName={this.lang.t("menuOff.slsRpt_01_005")} enabled={true} allowExportSelectedData={true} />
                                <Column dataField="ITEM_CODE" caption={this.t("grdListe.clmCode")} visible={true} /> 
                                <Column dataField="ITEM_NAME" caption={this.t("grdListe.clmName")} visible={true}/> 
                                <Column dataField="DISPATCH" caption={this.t("grdListe.clmDispatch")} visible={true}/> 
                                <Column dataField="INVOICE" caption={this.t("grdListe.clmInvoice")} width={120}  visible={true}/> 
                                <Column dataField="REBATE" caption={this.t("grdListe.clmRebate")} width={120} visible={true}/> 
                            </NdGrid>
                        </div>
                    </div>
                </ScrollView>
            </div>
        )
    }
}