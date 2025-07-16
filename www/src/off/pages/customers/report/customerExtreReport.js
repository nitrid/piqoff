import React from 'react';
import App from '../../../lib/app.js';
import moment from 'moment';
import Toolbar,{Item} from 'devextreme-react/toolbar';
import ScrollView from 'devextreme-react/scroll-view';
import NdGrid,{Column, ColumnChooser,Paging,Pager,Scrolling,Export, Summary, TotalItem,StateStoring} from '../../../../core/react/devex/grid.js';
import NdTextBox from '../../../../core/react/devex/textbox.js'
import NdPopGrid from '../../../../core/react/devex/popgrid.js';
import NdButton from '../../../../core/react/devex/button.js';
import NbDateRange from '../../../../core/react/bootstrap/daterange.js';
import { dialog } from '../../../../core/react/devex/dialog.js';
import { NdForm, NdItem, NdLabel, NdEmptyItem }from '../../../../core/react/devex/form.js';
import { NdToast } from '../../../../core/react/devex/toast.js';

export default class customerExtreReport extends React.PureComponent
{
    constructor(props)
    {
        super(props)
        
        this.core = App.instance.core;
        this.groupList = [];
        this.btnGetirClick = this.btnGetirClick.bind(this)
        this.saveState = this.saveState.bind(this)
        this.loadState = this.loadState.bind(this)
        this.tabIndex = props.data.tabkey
    }
    componentDidMount()
    {
        setTimeout(async () => 
        {
            this.txtCustomerCode.GUID = ''
        }, 500);
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
                        "'00000000-0000-0000-0000-000000000000' AS DOC_GUID,  " +
                        "0 AS TYPE, " +
                        "0 AS DOC_TYPE, " +
                        "0 AS REBATE, " +
                        "0 AS PAY_TYPE, " +
                        "'' AS TYPE_NAME,  " +
                        "CASE WHEN (SELECT [dbo].[FN_CUSTOMER_BALANCE](@CUSTOMER,@FIRST_DATE)) < 0 THEN  (SELECT [dbo].[FN_CUSTOMER_BALANCE](@CUSTOMER,@FIRST_DATE)) ELSE 0 END AS DEBIT,  " +
                        "CASE WHEN (SELECT [dbo].[FN_CUSTOMER_BALANCE](@CUSTOMER,@FIRST_DATE)) > 0 THEN  (SELECT [dbo].[FN_CUSTOMER_BALANCE](@CUSTOMER,@FIRST_DATE)) ELSE 0  END AS RECEIVE,  " +
                        "(SELECT [dbo].[FN_CUSTOMER_BALANCE](@CUSTOMER,@FIRST_DATE)) AS BALANCE  " +
                        "UNION ALL " +
                        "SELECT  " +
                        "DOC_DATE, " +
                        "REF, " +
                        "REF_NO, " +
                        "DOC_GUID, " +
                        "TYPE, " +
                        "DOC_TYPE, " +
                        "REBATE, " +
                        "PAY_TYPE, " +
                        "(SELECT TOP 1 VALUE FROM DB_LANGUAGE WHERE TAG = (SELECT [dbo].[FN_DOC_CUSTOMER_TYPE_NAME](TYPE,DOC_TYPE,REBATE,PAY_TYPE)) AND LANG = @LANG) AS TYPE_NAME,  " +
                        "CASE TYPE WHEN 0 THEN (AMOUNT * -1) ELSE 0 END AS DEBIT,  " +
                        "CASE TYPE WHEN 1 THEN AMOUNT ELSE 0 END AS RECEIVE,  " +
                        "CASE TYPE WHEN 0 THEN (AMOUNT * -1) WHEN 1 THEN AMOUNT END AS BALANCE  " +
                        "FROM DOC_CUSTOMER_VW_01  " +
                        "WHERE (INPUT = @CUSTOMER OR OUTPUT = @CUSTOMER)  " +
                        "AND DOC_DATE >= @FIRST_DATE AND DOC_DATE <= @LAST_DATE  ORDER BY DOC_DATE ASC" ,
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
                
            }
            await this.grdListe.dataRefresh(this.grdListe.data.datatable)
        }
        else
        {
            let tmpConfObj =
            {
                id:'msgNotCustomer',showTitle:true,title:this.t("msgNotCustomer.title"),showCloseButton:true,width:'500px',height:'auto',
                button:[{id:"btn01",caption:this.t("msgNotCustomer.btn01"),location:'after'}],
                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgNotCustomer.msg")}</div>)
            }
            await dialog(tmpConfObj);
        }
           
    }

    render()
    {
        return(
            <div id={this.props.data.id + this.tabIndex}>
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
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <NdForm colCount={3} id="frmKriter">
                                <NdItem>
                                    <NdLabel text={this.t("txtCustomerCode")} alignment="right" />
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
                                    <NdPopGrid id={"pg_txtCustomerCode"} parent={this} container={'#' + this.props.data.id + this.tabIndex}
                                    visible={false}
                                    position={{of:'#' + this.props.data.id + this.tabIndex}} 
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
                                                query : "SELECT GUID,CODE,TITLE,NAME,LAST_NAME,[TYPE_NAME],[GENUS_NAME],(SELECT [dbo].[FN_CUSTOMER_BALANCE](GUID,dbo.GETDATE())) AS BALANCE FROM CUSTOMER_VW_03 WHERE UPPER(CODE) LIKE UPPER(@VAL) OR UPPER(TITLE) LIKE UPPER(@VAL)",
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
                                        <Column dataField="BALANCE" caption={this.t("pg_txtCustomerCode.clmBalance")} format={{ style: "currency", currency: Number.money.code,precision: 2}} visible={true} defaultSortOrder="desc"/> 
                                    </NdPopGrid>
                                </NdItem> 
                                <NdItem>
                                    <NdLabel text={this.t("txtDate")} alignment="right" />
                                    <NbDateRange id={"dtDate"} parent={this} startDate={moment().startOf('year')} endDate={moment().endOf('year')}/>
                                </NdItem>
                            </NdForm>
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
                            <NdButton text={this.t("btnGet")} type="success" width="100%" onClick={this.btnGetirClick}></NdButton>
                        </div>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <NdGrid id={"grdListe"} parent={this} 
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
                            onCellPrepared={(e) => 
                            {
                                if (e.rowType === "data" && (e.column.dataField === "BALANCE")) 
                                {
                                    if (e.value > 0) 
                                    {
                                        e.cellElement.style.color = "green"
                                        e.cellElement.style.fontWeight = "bold"
                                    }
                                    else if (e.value < 0) 
                                    {
                                        e.cellElement.style.color = "red"
                                        e.cellElement.style.fontWeight = "bold"
                                    } 
                                    else 
                                    {
                                        e.cellElement.style.color = ""
                                        e.cellElement.style.fontWeight = ""
                                    }
                                }
                            }}
                            onRowDblClick={async(e)=>
                            {
                                if(e.data.DOC_GUID != '00000000-0000-0000-0000-000000000000')
                                {
                                    if(e.data.TYPE == 0 && e.data.DOC_TYPE == 20 && e.data.REBATE == 0)    
                                    {
                                        App.instance.menuClick({
                                            id: 'ftr_02_001',
                                            text: e.data.TYPE_NAME,
                                            path: 'invoices/documents/purchaseInvoice.js',
                                            pagePrm:{GUID:e.data.DOC_GUID}
                                        });
                                    }
                                    else if(e.data.TYPE == 1 && e.data.DOC_TYPE == 20 && e.data.REBATE == 0)
                                    {
                                        App.instance.menuClick({
                                            id: 'ftr_02_002',
                                            text: e.data.TYPE_NAME,
                                            path: 'invoices/documents/salesInvoice.js',
                                            pagePrm:{GUID:e.data.DOC_GUID}
                                        });
                                    }
                                    else if(e.data.TYPE == 0 && e.data.DOC_TYPE == 20 && e.data.REBATE == 1)
                                    {
                                        App.instance.menuClick({
                                            id: 'ftr_02_007',
                                            text: e.data.TYPE_NAME,
                                            path: 'invoices/documents/rebatePurcInvoice.js',
                                            pagePrm:{GUID:e.data.DOC_GUID}
                                        });
                                    }
                                    else if(e.data.TYPE == 1 && e.data.DOC_TYPE == 20 && e.data.REBATE == 1)
                                    {
                                        App.instance.menuClick({
                                            id: 'ftr_02_003',
                                            text: e.data.TYPE_NAME,
                                            path: 'invoices/documents/rebateInvoice.js',
                                            pagePrm:{GUID:e.data.DOC_GUID}
                                        });
                                    }
                                    else if(e.data.TYPE == 0 && e.data.DOC_TYPE == 200 && e.data.REBATE == 0)
                                    {
                                        App.instance.menuClick({
                                            id: 'fns_02_002',
                                            text: e.data.TYPE_NAME,
                                            path: 'finance/documents/collection.js',
                                            pagePrm:{GUID:e.data.DOC_GUID}
                                        }); 
                                    }
                                }
                               
                            }}
                            >
                                {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Paging defaultPageSize={20} /> : <Paging enabled={false} />}
                                {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Pager visible={true} allowedPageSizes={[5,10,50]} showPageSizeSelector={true} /> : <Paging enabled={false} />}
                                {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Scrolling mode="standart" /> : <Scrolling mode="infinite" />}
                                <StateStoring enabled={true} type="custom" customLoad={this.loadState} customSave={this.saveState} storageKey={this.props.data.id + "_grdListe"}/>
                                <ColumnChooser enabled={true} />
                                <Export fileName={this.lang.t("menuOff.cri_04_001")} enabled={true} allowExportSelectedData={true} formats={['xlsx','pdf']} />
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
                                <Column dataField="DEBIT" caption={this.t("grdListe.clmDebit")} format={{ style: "currency", currency: Number.money.code,precision: 2}} visible={true} 
                                cellRender={(e) => {
                                    return e.value ? e.text : ' ';
                                }}/> 
                                <Column dataField="RECEIVE" caption={this.t("grdListe.clmReceive")} format={{ style: "currency", currency: Number.money.code,precision: 2}} visible={true}
                                cellRender={(e) => {
                                    return e.value ? e.text : ' ';
                                }}/> 
                                <Column dataField="BALANCE" caption={this.t("grdListe.clmBalance")} format={{ style: "currency", currency: Number.money.code,precision: 2}} visible={true}/>
                                <Summary>
                                    <TotalItem
                                    column="DEBIT"
                                    summaryType="sum"
                                    valueFormat={{ style: "currency", currency: Number.money.code,precision: 2}} />
                                     <TotalItem
                                    column="RECEIVE"
                                    summaryType="sum"
                                    valueFormat={{ style: "currency", currency: Number.money.code,precision: 2}} />
                                </Summary> 
                            </NdGrid>
                        </div>
                    </div>
                    <NdForm colCount={4}>
                        <NdEmptyItem colSpan={3}></NdEmptyItem>
                        <NdItem>
                            <NdLabel text={this.t("txtTotalBalance")} alignment="right" />
                                <NdTextBox id="txtTotalBalance" parent={this} simple={true} readOnly={true}
                                />
                        </NdItem>
                    </NdForm>
                    <NdToast id={"toast"} parent={this} displayTime={2000} position={{at:"top center",offset:'0px 110px'}}/>
                </ScrollView>
            </div>
        )
    }
}