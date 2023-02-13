import React from 'react';
import App from '../../../lib/app.js';
import moment from 'moment';

import Toolbar,{Item} from 'devextreme-react/toolbar';
import Form, { Label,EmptyItem } from 'devextreme-react/form';
import ScrollView from 'devextreme-react/scroll-view';

import NdGrid,{Column, ColumnChooser,ColumnFixing,Paging,Pager,Scrolling,Export} from '../../../../core/react/devex/grid.js';
import NdTextBox from '../../../../core/react/devex/textbox.js'
import NdSelectBox from '../../../../core/react/devex/selectbox.js';
import NdDropDownBox from '../../../../core/react/devex/dropdownbox.js';
import NdPopGrid from '../../../../core/react/devex/popgrid.js';
import NdListBox from '../../../../core/react/devex/listbox.js';
import NdButton from '../../../../core/react/devex/button.js';
import NbDateRange from '../../../../core/react/bootstrap/daterange.js';
import NdCheckBox from '../../../../core/react/devex/checkbox.js';
import { dialog } from '../../../../core/react/devex/dialog.js';

export default class customerBalanceReport extends React.PureComponent
{
    constructor(props)
    {
        super(props)

        this.state = 
        {
            columnListValue : ['DOC_DATE','TYPE_NAME','REF','REF_NO','DEBIT','RECEIVE','BALANCE']
        }
        
        this.core = App.instance.core;
        this.columnListData = 
        [
            {CODE : "DOC_DATE",NAME : this.t("grdListe.clmDocDate")},                                   
            {CODE : "TYPE_NAME",NAME : this.t("grdListe.clmTypeName")},
            {CODE : "REF",NAME : this.t("grdListe.clmRef")},
            {CODE : "REF_NO",NAME : this.t("grdListe.clmRefNo")},
            {CODE : "DEBIT",NAME : this.t("grdListe.clmDebit")},
            {CODE : "RECEIVE",NAME : this.t("grdListe.clmReceive")},
            {CODE : "BALANCE",NAME : this.t("grdListe.clmBalance")},
        ]
        this.groupList = [];
        this._btnGetirClick = this._btnGetirClick.bind(this)
        this._columnListBox = this._columnListBox.bind(this)
    }
    componentDidMount()
    {
        setTimeout(async () => 
        {
            this.txtCustomerCode.GUID = ''
        }, 500);
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
                if(typeof e.value.find(x => x == 'TYPE_NAME') != 'undefined')
                {
                    this.groupList.push('TYPE_NAME')
                }                
                if(typeof e.value.find(x => x == 'REF') != 'undefined')
                {
                    this.groupList.push('REF')
                }
                if(typeof e.value.find(x => x == 'REF_NO') != 'undefined')
                {
                    this.groupList.push('REF_NO')
                }
                if(typeof e.value.find(x => x == 'BALANCE') != 'undefined')
                {
                    this.groupList.push('BALANCE')
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
        if(this.txtCustomerCode.GUID != '')
        {
            let tmpSource =
            {
                source : 
                {
                    groupBy : this.groupList,
                    select : 
                    {
                        query : "SELECT " +
                        "CONVERT(DATETIME,@FIRST_DATE) - 1 AS DOC_DATE,  " +
                        "'' AS REF,  " +
                        "0 AS REF_NO,  " +
                        "'' AS TYPE_NAME,  " +
                        "CASE WHEN (SELECT [dbo].[FN_CUSTOMER_BALANCE](@CUSTOMER,@FIRST_DATE)) < 0 THEN  (SELECT [dbo].[FN_CUSTOMER_BALANCE](@CUSTOMER,@FIRST_DATE)) ELSE 0 END AS DEBIT,  " +
                        "CASE WHEN (SELECT [dbo].[FN_CUSTOMER_BALANCE](@CUSTOMER,@FIRST_DATE)) > 0 THEN  (SELECT [dbo].[FN_CUSTOMER_BALANCE](@CUSTOMER,@FIRST_DATE)) ELSE 0  END AS RECEIVE,  " +
                        "(SELECT [dbo].[FN_CUSTOMER_BALANCE](@CUSTOMER,@FIRST_DATE)) AS BALANCE  " +
                        "UNION ALL " +
                        "SELECT  " +
                        "DOC_DATE, " +
                        "REF, " +
                        "REF_NO, " +
                        "(SELECT TOP 1 VALUE FROM DB_LANGUAGE WHERE TAG = (SELECT [dbo].[FN_DOC_CUSTOMER_TYPE_NAME](TYPE,DOC_TYPE,REBATE,PAY_TYPE)) AND LANG = @LANG) AS TYPE_NAME,  " +
                        "CASE TYPE WHEN 0 THEN (AMOUNT * -1) ELSE 0 END AS DEBIT,  " +
                        "CASE TYPE WHEN 1 THEN AMOUNT ELSE 0 END AS RECEIVE,  " +
                        "CASE TYPE WHEN 0 THEN (AMOUNT * -1) WHEN 1 THEN AMOUNT END AS BALANCE  " +
                        "FROM DOC_CUSTOMER_VW_01  " +
                        "WHERE (INPUT = @CUSTOMER OR OUTPUT = @CUSTOMER)  " +
                        "AND DOC_DATE >= @FIRST_DATE AND DOC_DATE <= @LAST_DATE  " ,
                        param : ['CUSTOMER:string|50','LANG:string|10','FIRST_DATE:date','LAST_DATE:date'],
                        value : [this.txtCustomerCode.GUID,localStorage.getItem('lang'),this.dtDate.startDate,this.dtDate.endDate]
                    },
                    sql : this.core.sql
                }
            }
            App.instance.setState({isExecute:true})
            await this.grdListe.dataRefresh(tmpSource)
            App.instance.setState({isExecute:false})
            let tmpBalance = this.grdListe.data.datatable.sum("BALANCE",2)
            this.txtTotalBalance.setState({value:tmpBalance})
            let tmpLineBalance = 0;
            for (let i = 0; i < this.grdListe.data.datatable.length; i++) 
            {
                tmpLineBalance += this.grdListe.data.datatable[i].BALANCE;
                this.grdListe.data.datatable[i].BALANCE = tmpLineBalance.toFixed(2);
                console.log(this.grdListe.data.datatable[i].BALANCE)
                console.log(tmpLineBalance)
            }
            await this.grdListe.dataRefresh(this.grdListe.data.datatable)
        }
        else
        {
            let tmpConfObj =
            {
                id:'msgNotCustomer',showTitle:true,title:this.t("msgNotCustomer.title"),showCloseButton:true,width:'500px',height:'200px',
                button:[{id:"btn01",caption:this.t("msgNotCustomer.btn01"),location:'after'}],
                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgNotCustomer.msg")}</div>)
            }
            await dialog(tmpConfObj);
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
                            <Form colCount={3} id="frmKriter">
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
                                                this.txtCustomerCode.GUID = data[0].GUID
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
                                                            this.txtCustomerCode.GUID = data[0].GUID
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
                                                    this.txtCustomerCode.GUID = ''
                                                }
                                            },
                                        ]
                                    }
                                    >
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
                                                query : "SELECT GUID,CODE,TITLE,NAME,LAST_NAME,[TYPE_NAME],[GENUS_NAME] FROM CUSTOMER_VW_01 WHERE UPPER(CODE) LIKE UPPER(@VAL) OR UPPER(TITLE) LIKE UPPER(@VAL)",
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
                                <Export fileName={this.lang.t("menu.cri_04_001")} enabled={true} allowExportSelectedData={true} />
                                <Column dataField="DOC_DATE" caption={this.t("grdListe.clmDocDate")} visible={true} dataType="date" width={100}
                                editorOptions={{value:null}}
                                cellRender={(e) => 
                                {
                                    if(moment(e.value).format("YYYY-MM-DD") != '1970-01-01')
                                    {
                                        return e.text
                                    }
                                    
                                    return
                                }}/>
                                <Column dataField="TYPE_NAME" caption={this.t("grdListe.clmTypeName")} visible={true} width={100}/> 
                                <Column dataField="REF" caption={this.t("grdListe.clmRef")} visible={true} width={100}/> 
                                <Column dataField="REF_NO" caption={this.t("grdListe.clmRefNo")} visible={true} width={80}/> 
                                <Column dataField="DEBIT" caption={this.t("grdListe.clmDebit")} format={{ style: "currency", currency: "EUR",precision: 2}} visible={true}/> 
                                <Column dataField="RECEIVE" caption={this.t("grdListe.clmReceive")} format={{ style: "currency", currency: "EUR",precision: 2}} visible={true}/> 
                                <Column dataField="BALANCE" caption={this.t("grdListe.clmBalance")} format={{ style: "currency", currency: "EUR",precision: 2}} visible={true}/> 
                            </NdGrid>
                        </div>
                    </div>
                    <Form colCount={4}>
                        <EmptyItem colSpan={3}></EmptyItem>
                        <Item>
                            <Label text={this.t("txtTotalBalance")} alignment="right" />
                                <NdTextBox id="txtTotalBalance" parent={this} simple={true} readOnly={true}
                                />
                        </Item>
                    </Form>
                </ScrollView>
            </div>
        )
    }
}