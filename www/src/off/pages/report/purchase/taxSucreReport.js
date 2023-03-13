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

export default class taxSucreReport extends React.PureComponent
{
    constructor(props)
    {
        super(props)

        this.state = 
        {
            columnListValue : ['ITEM_CODE','ITEM_NAME','QUANTITY','AMOUNT']
        }
        
        this.core = App.instance.core;
        this.columnListData = 
        [
            {CODE : "ITEM_CODE",NAME : this.t("grdListe.clmCode")},                                   
            {CODE : "ITEM_NAME",NAME : this.t("grdListe.clmName")},
            {CODE : "QUANTITY",NAME : this.t("grdListe.clmQuantity")},
            {CODE : "AMOUNT",NAME : this.t("grdListe.clmAmount")},
        ]
        this.groupList = [];
        this._btnGetirClick = this._btnGetirClick.bind(this)
        this._columnListBox = this._columnListBox.bind(this)
        this.prmObj = this.param.filter({TYPE:1,USERS:this.user.CODE})
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
                if(typeof e.value.find(x => x == 'ITEM_CODE') != 'undefined')
                {
                    this.groupList.push('ITEM_CODE')
                }
                if(typeof e.value.find(x => x == 'ITEM_NAME') != 'undefined')
                {
                    this.groupList.push('ITEM_NAME')
                }                
                if(typeof e.value.find(x => x == 'QUANTITY') != 'undefined')
                {
                    this.groupList.push('QUANTITY')
                }
                if(typeof e.value.find(x => x == 'AMOUNT') != 'undefined')
                {
                    this.groupList.push('AMOUNT')
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
        let tmpData = this.prmObj.filter({ID:'taxSugarGroupValidation'}).getValue()
        let tmpSource =
        {
            source : 
            {
                groupBy : this.groupList,
                select : 
                {
                    query :"SELECT " + 
                    "(SELECT TOP 1 CODE FROM ITEMS WHERE ITEMS.GUID = DOC_ITEMS.ITEM) AS ITEM_CODE, " +
                    "MAX(ITEM_NAME) AS ITEM_NAME, " +
                    "((SELECT TOP 1 FACTOR / 100 FROM ITEM_UNIT WHERE ITEM_UNIT.ITEM = DOC_ITEMS.ITEM AND TYPE = 1)*(SELECT TOP 1 PRICE FROM TAX_SUGAR_TABLE_VW_01 WHERE MIN_VALUE <= (SELECT TOP 1 SUGAR_RATE FROM ITEMS WHERE ITEMS.GUID = DOC_ITEMS.ITEM ) AND MAX_VALUE >=  (SELECT TOP 1 SUGAR_RATE FROM ITEMS WHERE ITEMS.GUID = DOC_ITEMS.ITEM ))) * SUM(QUANTITY) AS AMOUNT, " +
                    "SUM(QUANTITY) AS QUANTITY, " +
                    "ITEM FROM DOC_ITEMS  " +
                    "WHERE TYPE = 0 AND DOC_TYPE IN(20,40) AND  REBATE = 0 AND DELETED = 0 AND DOC_DATE >= @FIRST_DATE AND DOC_DATE <= @LAST_DATE AND " +
                    "(SELECT TOP 1 MAIN_GUID FROM ITEMS_GRP WHERE ITEMS_GRP.ITEM = DOC_ITEMS.ITEM)   " +
                    "IN(@GROUPS) AND  " +
                    "(SELECT TOP 1 TAX_SUCRE FROM CUSTOMERS WHERE CUSTOMERS.GUID = DOC_ITEMS.OUTPUT ) = 1  " +
                    "GROUP BY ITEM ",
                    param : ['FIRST_DATE:date','LAST_DATE:date','GROUPS:string|250'],
                    value : [this.dtDate.startDate,this.dtDate.endDate,tmpData]
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
                                <NbDateRange id={"dtDate"} parent={this} startDate={moment().startOf('year')} endDate={moment().endOf('year')}/>
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
                                <Export fileName={this.lang.t("menuOff.slsRpt_01_001")} enabled={true} allowExportSelectedData={true} />
                                <Column dataField="ITEM_CODE" caption={this.t("grdListe.clmCode")} visible={true} /> 
                                <Column dataField="ITEM_NAME" caption={this.t("grdListe.clmName")} visible={true}/> 
                                <Column dataField="QUANTITY" caption={this.t("grdListe.clmQuantity")} visible={true} /> 
                                <Column dataField="AMOUNT" caption={this.t("grdListe.clmAmount")} format={{ style: "currency", currency: "EUR",precision: 2}} visible={true} /> 
                                <Summary>
                                    <TotalItem
                                    column="AMOUNT"
                                    summaryType="sum"
                                    valueFormat={{ style: "currency", currency: "EUR",precision: 2}} />
                                </Summary> 
                            </NdGrid>
                        </div>
                    </div>
                </ScrollView>
            </div>
        )
    }
}