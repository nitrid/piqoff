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

export default class itemDetailSalesReport extends React.PureComponent
{
    constructor(props)
    {
        super(props)

        this.state = 
        {
            columnListValue : ['ITEM_CODE','ITEM_NAME','QUANTITY','AMOUNT','VAT','TOTAL']
        }
        
        this.core = App.instance.core;
        this.columnListData = 
        [
            {CODE : "ITEM_CODE",NAME : this.t("grdListe.clmCode")},                                   
            {CODE : "ITEM_NAME",NAME : this.t("grdListe.clmName")},
            {CODE : "QUANTITY",NAME : this.t("grdListe.clmQuantity")},
            {CODE : "AMOUNT",NAME : this.t("grdListe.clmAmount")},
            {CODE : "VAT",NAME : this.t("grdListe.clmVat")},
            {CODE : "TOTAL",NAME : this.t("grdListe.clmTotal")},
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
                if(typeof e.value.find(x => x == 'ORDERS') != 'undefined')
                {
                    this.groupList.push('ORDERS')
                }
                if(typeof e.value.find(x => x == 'DISPATCH') != 'undefined')
                {
                    this.groupList.push('DISPATCH')
                }
                if(typeof e.value.find(x => x == 'INVOICE') != 'undefined')
                {
                    this.groupList.push('INVOICE')
                }
                if(typeof e.value.find(x => x == 'COLLECTION') != 'undefined')
                {
                    this.groupList.push('COLLECTION')
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
       if(this.chkItemCreated.value === false)
       {
           let tmpSource =
           {
               source : 
               {
                   groupBy : this.groupList,
                   select : 
                   {
                       query : "SELECT ITEM_CODE,ITEM_NAME,SUM(QUANTITY) AS QUANTITY,ROUND(SUM(FAMOUNT),2) AS AMOUNT,ROUND(SUM(VAT),2) AS VAT,ROUND(SUM(TOTAL),2) AS TOTAL,(SELECT CDATE FROM ITEMS WHERE ITEMS.GUID = POS_SALE_VW_01.ITEM_GUID) AS CDATE " +
                               " FROM POS_SALE_VW_01 WHERE DOC_DATE >= @FIRST_DATE AND DOC_DATE <= @LAST_DATE GROUP BY  ITEM_CODE,ITEM_NAME, ITEM_GUID",
                       param : ['FIRST_DATE:date','LAST_DATE:date'],
                       value : [this.dtDate.startDate,this.dtDate.endDate]
                   },
                   sql : this.core.sql
               }
           }
           await this.grdListe.dataRefresh(tmpSource)
       }else
       {    
            let tmpSource2 =
            {
                source : 
                {
                    groupBy : this.groupList,
                    select : 
                    {
                        query : "SELECT POS_SALE_VW_01.ITEM_CODE, " +
                                    "POS_SALE_VW_01.ITEM_NAME, " +
                                    "SUM(POS_SALE_VW_01.QUANTITY) AS QUANTITY, " +
                                    "ROUND(SUM(POS_SALE_VW_01.FAMOUNT),2) AS AMOUNT, " +
                                    "ROUND(SUM(POS_SALE_VW_01.VAT),2) AS VAT, " +
                                    "ROUND(SUM(POS_SALE_VW_01.TOTAL),2) AS TOTAL, " +
                                    "ITEMS.CDATE " +
                                "FROM POS_SALE_VW_01 " +
                                "INNER JOIN ITEMS ON ITEMS.GUID = POS_SALE_VW_01.ITEM_GUID " +
                                "WHERE ITEMS.CDATE >= @FIRST_DATE AND  ITEMS.CDATE <= @LAST_DATE AND ITEMS.DELETED = 0 " +
                                "GROUP BY  POS_SALE_VW_01.ITEM_CODE, POS_SALE_VW_01.ITEM_NAME, ITEMS.CDATE",
                        param : ['FIRST_DATE:date','LAST_DATE:date'],
                        value : [this.dtDate.startDate,this.dtDate.endDate]
                    },
                    sql : this.core.sql
                }
            }
            await this.grdListe.dataRefresh(tmpSource2)
       }
      
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
                                <NbDateRange id={"dtDate"} parent={this} startDate={moment(new Date())} endDate={moment(new Date())}/>
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
                            <Form>
                                <Item>
                                    <Label text={this.t("chkItemCreated")} alignment="left" />
                                    <NdCheckBox id="chkItemCreated" parent={this} defaultValue={true} value={false} />
                                </Item>
                            </Form>
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
                            headerFilter={{visible:true}}
                            height={'690'} 
                            width={'100%'}
                            columnAutoWidth={true}
                            allowColumnReordering={true}
                            allowColumnResizing={true}
                            loadPanel={{enabled:true}}
                            >                            
                                {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Paging defaultPageSize={20} /> : <Paging enabled={false} />}
                                {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Pager visible={true} allowedPageSizes={[5,10,50]} showPageSizeSelector={true} /> : <Paging enabled={false} />}
                                {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Scrolling mode="standart" /> : <Scrolling mode="infinite" />}
                                <Export fileName={this.lang.t("menuOff.pos_02_010")} enabled={true} allowExportSelectedData={true} />
                                <Column dataField="CDATE" caption={this.t("grdListe.clmDate")} visible={true} dataType="datetime" format={"dd/MM/yyyy"}/> 
                                <Column dataField="ITEM_CODE" caption={this.t("grdListe.clmCode")} visible={true} defaultSortOrder="asc"/> 
                                <Column dataField="ITEM_NAME" caption={this.t("grdListe.clmName")} visible={true}/> 
                                <Column dataField="QUANTITY" caption={this.t("grdListe.clmQuantity")} visible={true} /> 
                                <Column dataField="AMOUNT" caption={this.t("grdListe.clmAmount")} format={{ style: "currency", currency: Number.money.code,precision: 2}} visible={true} /> 
                                <Column dataField="VAT" caption={this.t("grdListe.clmVat")} format={{ style: "currency", currency: Number.money.code,precision: 2}} visible={true} /> 
                                <Column dataField="TOTAL" caption={this.t("grdListe.clmTotal")} format={{ style: "currency", currency: Number.money.code,precision: 2}} visible={true}/> 
                                <Summary>
                                    <TotalItem
                                    column="QUANTITY"
                                    summaryType="sum"
                                    />
                                     <TotalItem
                                    column="AMOUNT"
                                    summaryType="sum"
                                    valueFormat={{ style: "currency", currency: Number.money.code,precision: 2}} />
                                       <TotalItem
                                    column="VAT"
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
                </ScrollView>
            </div>
        )
    }
}