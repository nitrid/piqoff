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

export default class itemSalesReport extends React.PureComponent
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
            {CODE : "CDATE",NAME : this.t("grdListe.clmCDate")},
            {CODE : "WEIGHER_NAME",NAME : this.t("grdListe.clmUser")},
            {CODE : "TICKET_NO",NAME : this.t("grdListe.clmTicketNo")},
            {CODE : "ITEM_CODE",NAME : this.t("grdListe.clmCode")},
            {CODE : "ITEM_NAME",NAME : this.t("grdListe.clmName")},
            {CODE : "QUANTITY",NAME : this.t("grdListe.clmQuantity")},
            {CODE : "PRICE",NAME : this.t("grdListe.clmPrice")},
            {CODE : "STATUS",NAME : this.t("grdListe.clmStatus")},
            {CODE : "DESCRIPTIONS",NAME : this.t("grdListe.clmStatus")},
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
       
        let tmpSource =
        {
            source : 
            {
                groupBy : this.groupList,
                select : 
                {
                    query : "SELECT ITEM_NAME,ITEM_CODE,CDATE,TICKET_NO,QUANTITY,PRICE,AMOUNT,TICKET_DATE,STATUS,WEIGHER_NAME, " +
                    "ISNULL((SELECT TOP 1 DESCRIPTION + '/' FROM BALANCE_COUNTER_EXTRA WHERE BALANCE_COUNTER_EXTRA.BALANCE = BC.GUID AND TAG = 'PRICE'),'') + ' ' + ISNULL((SELECT TOP 1 DESCRIPTION + '/' FROM BALANCE_COUNTER_EXTRA WHERE BALANCE_COUNTER_EXTRA.BALANCE = BC.GUID AND TAG = 'QUANTITY'),'') + ''+ ISNULL((SELECT CASE WHEN COUNT(TAG) = 0 THEN '' ELSE CONVERT(NVARCHAR,COUNT(TAG)) + ' Réimprimé' END FROM BALANCE_COUNTER_EXTRA WHERE BALANCE_COUNTER_EXTRA.BALANCE = BC.GUID AND TAG = 'REPRINT'),'')  AS DESCRIPTIONS ," +
                    "CONVERT(NVARCHAR, CDATE , 108) AS TIME " +
                    "FROM BALANCE_COUNTER_VW_01 AS BC WHERE (CONVERT(NVARCHAR,CDATE,112) >= @FIRST_DATE AND CONVERT(NVARCHAR,CDATE,112) <= @LAST_DATE) AND TICKET_DATE <> '19700101' ORDER BY TICKET_NO ASC" ,
                    param : ['FIRST_DATE:date','LAST_DATE:date'],
                    value : [this.dtDate.startDate,this.dtDate.endDate]
                },
                sql : this.core.sql
            }
        }

        if([])
        {

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
                            onRowPrepared={(e) =>
                            {
                                if(e.rowType == 'data' && e.data.STATUS  == false)
                                {
                                    e.rowElement.style.color ="Silver"
                                }
                            }}
                            >                            
                                <Paging defaultPageSize={20} />
                                <Pager visible={true} allowedPageSizes={[5,10,20,50]} showPageSizeSelector={true} />
                                <Export fileName={this.lang.t("menuOff.pos_02_014")} enabled={true} allowExportSelectedData={true} />
                                <Column dataField="TICKET_DATE" caption={this.t("grdListe.clmCDate")} visible={true}  dataType="date" format={'dd/MM/yyyy'}  width={150}/> 
                                <Column dataField="TIME" caption={this.t("grdListe.clmTime")} visible={true} width={100}/> 
                                <Column dataField="WEIGHER_NAME" caption={this.t("grdListe.clmUser")} visible={true}  dataType="number"  width={120}/> 
                                <Column dataField="ITEM_CODE" caption={this.t("grdListe.clmCode")} visible={true}  dataType="number"  width={150}/> 
                                <Column dataField="ITEM_NAME" caption={this.t("grdListe.clmName")} visible={true} width={200}/> 
                                <Column dataField="TICKET_NO" caption={this.t("grdListe.clmTicketNo")} visible={true}  dataType="number"  width={100}/> 
                                <Column dataField="QUANTITY" caption={this.t("grdListe.clmQuantity")} visible={true}  dataType="number"  width={100}/> 
                                <Column dataField="PRICE" caption={this.t("grdListe.clmPrice")} visible={true}  dataType="number" format={{ style: "currency", currency: Number.money.code,precision: 2}}  width={100}/> 
                                <Column dataField="AMOUNT" caption={this.t("grdListe.clmAmount")} visible={true}  dataType="number" format={{ style: "currency", currency: Number.money.code,precision: 2}}  width={100}/> 
                                <Column dataField="DESCRIPTIONS" caption={this.t("grdListe.clmDescriptions")} visible={true} width={350}/> 
                                <Column dataField="STATUS" caption={this.t("grdListe.clmStatus")} visible={true}  dataType="boolean"  width={80}/> 
                                <Summary>
                                    <TotalItem
                                    column="QUANTITY"
                                    summaryType="sum"
                                    />
                                     <TotalItem
                                    column="PRICE"
                                    summaryType="sum"
                                    valueFormat={{ style: "currency", currency: Number.money.code,precision: 2}} />
                                      <TotalItem
                                    column="AMOUNT"
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