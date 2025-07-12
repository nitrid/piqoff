import React from 'react';
import App from '../../../lib/app.js';
import moment from 'moment';
import ScrollView from 'devextreme-react/scroll-view';
import Toolbar from 'devextreme-react/toolbar';
import { Item } from 'devextreme-react/form';
import NbDateRange from '../../../../core/react/bootstrap/daterange.js';
import NdGrid,{Column,Editing,Paging,Pager,Scrolling,KeyboardNavigation,Export,Summary,TotalItem,StateStoring,ColumnChooser} from '../../../../core/react/devex/grid.js';
import NdButton from '../../../../core/react/devex/button.js';
import { dialog } from '../../../../core/react/devex/dialog.js';
import NdTextBox, { Validator, NumericRule, RequiredRule, CompareRule, EmailRule, PatternRule, StringLengthRule, RangeRule, AsyncRule } from '../../../../core/react/devex/textbox.js'
import NdPopGrid from '../../../../core/react/devex/popgrid.js';
import {NdForm,NdItem,NdLabel, NdEmptyItem} from '../../../../core/react/devex/form.js';

export default class openInvoicePurchaseReport extends React.PureComponent
{
    constructor(props)
    {
        super(props)
       
        this.core = App.instance.core;
        this.groupList = [];
        this.btnGetirClick = this.btnGetirClick.bind(this)
        this.loadState = this.loadState.bind(this)
        this.saveState = this.saveState.bind(this)
    }

    async componentDidMount()
    {
        setTimeout(async () => 
        {
        }, 1000);
    }
    loadState()
    {
        let tmpLoad = this.access.filter({ELEMENT:'grdListeState',USERS:this.user.CODE})
        return tmpLoad.getValue()
    }
    saveState(e)
    {   
        let tmpSave = this.access.filter({ELEMENT:'grdListeState',USERS:this.user.CODE,PAGE:this.props.data.id,APP:"OFF",EMPTY:true})
        tmpSave.setValue(e)
        tmpSave.save()
    }
    async calculateTotal()
    {
        this.docObj.dt()[0].AMOUNT = this.docObj.docCustomer.dt().sum("AMOUNT",2)
        this.docObj.dt()[0].TOTAL = this.docObj.docCustomer.dt().sum("AMOUNT",2)
    }
    async btnGetirClick()
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
                select : 
                {
                    query : "SELECT " +
                                "TYPE," +
                                "DOC_DATE," +
                                "DOC_TYPE," +
                                "OUTPUT_CODE," +
                                "OUTPUT_NAME," +
                                "DOC_REF," +
                                "DOC_REF_NO," +
                                "DOC_TOTAL," +
                                "PAYING_AMOUNT, " +
                                "ROUND((DOC_TOTAL -  PAYING_AMOUNT),2) AS REMAINDER " +
                            "FROM DEPT_CREDIT_MATCHING_VW_03 " +
                            "WHERE TYPE = 0 AND DOC_TYPE = 20 AND ((OUTPUT_CODE = @OUTPUT_CODE) OR (@OUTPUT_CODE = '')) AND DOC_DATE >= @FIRST_DATE AND DOC_DATE <= @LAST_DATE AND ((DOC_TOTAL - PAYING_AMOUNT) > 0) " +
                            "GROUP BY DOC_TYPE,TYPE,DOC_DATE,OUTPUT_NAME,DOC_REF_NO,DOC_REF,PAYING_AMOUNT,OUTPUT_CODE,DOC_TOTAL",
                    param : ['FIRST_DATE:date','LAST_DATE:date','OUTPUT_CODE:string|50'],
                    value : [this.dtDate.startDate,this.dtDate.endDate,this.txtCustomerCode.CODE],
                },
                sql : this.core.sql
            }
        }

        await this.grdListe.dataRefresh(tmpSource)
      
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
                            <NdForm colCount={2} id="frmKriter">
                                <NdItem>
                                    <NdLabel text={this.t("dtFirst")} alignment="right" />
                                    <NbDateRange id={"dtDate"} parent={this} startDate={moment().startOf('month')} endDate={moment().endOf('month')}/>
                                </NdItem>
                                <NdItem>
                                    <NdEmptyItem/>
                                </NdItem>
                                <NdItem>
                                    <NdLabel text={this.t("txtCustomerCode")} alignment="right" />
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
                                {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Paging defaultPageSize={20} /> : <Paging enabled={false} />}
                                {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Pager visible={true} allowedPageSizes={[5,10,50]} showPageSizeSelector={true} /> : <Paging enabled={false} />}
                                {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Scrolling mode="standart" /> : <Scrolling mode="infinite" />}
                                <StateStoring enabled={true} type="custom" customLoad={this.loadState} customSave={this.saveState} storageKey={this.props.data.id + "_grdListe"}/>
                                <ColumnChooser enabled={true} />
                                <Export fileName={this.lang.t("menuOff.slsRpt_01_003")} enabled={true} allowExportSelectedData={true} />
                                <Column dataField="DOC_DATE" caption={this.t("grdListe.clmDate")} visible={true} dataType="date" width={100}
                                editorOptions={{value:null}}
                                cellRender={(e) => 
                                {
                                    if(moment(e.value).format("YYYY-MM-DD") != '1970-01-01')
                                    {
                                        return e.text
                                    }
                                    
                                    return
                                }}/>
                                <Column dataField="OUTPUT_CODE" caption={this.t("grdListe.clmCode")} width={120} visible={true}/> 
                                <Column dataField="OUTPUT_NAME" caption={this.t("grdListe.clmName")} visible={true}/> 
                                <Column dataField="DOC_REF" caption={this.t("grdListe.clmRef")} visible={true}/> 
                                <Column dataField="DOC_REF_NO" caption={this.t("grdListe.clmRefNo")} width={120} visible={true}/> 
                                <Column dataField="REMAINDER" caption={this.t("grdListe.clmRemainder")} width={120} format={{ style: "currency", currency: Number.money.code,precision: 2}} visible={true}/> 
                                <Column dataField="DOC_TOTAL" caption={this.t("grdListe.clmTotal")} width={120} format={{ style: "currency", currency: Number.money.code,precision: 2}} visible={true}/> 
                                <Summary>
                                    <TotalItem
                                    column="AMOUNT"
                                    summaryType="sum"
                                    valueFormat={{ style: "currency", currency: Number.money.code,precision: 2}} />
                                        
                                       <TotalItem
                                    column="TOTALHT"
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