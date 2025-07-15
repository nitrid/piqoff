import React from 'react';
import App from '../../../lib/app.js';
import moment from 'moment';
import Toolbar from 'devextreme-react/toolbar';
import Form, {Item, EmptyItem, Label } from 'devextreme-react/form';
import ScrollView from 'devextreme-react/scroll-view';
import NdGrid,{Column, ColumnChooser,StateStoring,Paging,Pager,Scrolling,Export, Summary, TotalItem} from '../../../../core/react/devex/grid.js';
import NdTextBox from '../../../../core/react/devex/textbox.js'
import NdButton from '../../../../core/react/devex/button.js';
import NbDateRange from '../../../../core/react/bootstrap/daterange.js';
import NdPopGrid from '../../../../core/react/devex/popgrid.js';
import { dialog } from '../../../../core/react/devex/dialog.js';

export default class itemSaleReport extends React.PureComponent
{
    constructor(props)
    {
        super(props)
        
        this.core = App.instance.core;
        this.groupList = [];
        this.btnGetClick = this.btnGetClick.bind(this)
        this.itemsCode = ''
        this.loadState = this.loadState.bind(this)
        this.saveState = this.saveState.bind(this)

        Number.money = this.sysParam.filter({ID:'MoneySymbol',TYPE:0}).getValue()


        this.tabIndex = props.data.tabkey
    }
    componentDidMount()
    {
        setTimeout(async () => 
        {
            this.Init()
        }, 1000);
    }
    async Init()
    {
        this.txtRef.GUID = '00000000-0000-0000-0000-000000000000'
    }
    loadState()
    {
        let tmpLoad = this.access.filter({ELEMENT:'grdItemSaleReportState',USERS:this.user.CODE})
        return tmpLoad.getValue()
    }
    saveState(e)
    {
        let tmpSave = this.access.filter({ELEMENT:'grdItemSaleReportState',USERS:this.user.CODE, PAGE:this.props.data.id, APP:"OFF"})
        tmpSave.setValue(e)
        tmpSave.save()
    }
    async btnGetClick()
    {
        console.log(this.itemsCode)
        let tmpSource =
        {
            source : 
            {
                groupBy : this.groupList,
                select : 
                {
                    query : "SELECT ITEM_CODE,ITEM_NAME,SUM(QUANTITY) AS QUANTITY, " +
                    "ROUND(SUM(TOTAL),2) AS TOTAL,  " +
                    "ROUND(SUM(FAMOUNT),2) AS FAMOUNT,  " +
                    "ROUND(SUM(VAT),2) AS VAT,  " +
                    "ROUND(SUM(COST_PRICE * QUANTITY),2) AS TOTAL_COST,  " +
                    "MAX(VAT_RATE) AS VAT_RATE, " +
                    "(SUM(FAMOUNT) - SUM(COST_PRICE * QUANTITY)) AS REST_TOTAL,  " +
                    "CASE WHEN SUM(TOTAL) <> 0 AND SUM(COST_PRICE * QUANTITY) <> 0 THEN  " +
                    "CONVERT(nvarchar,ROUND((SUM(TOTAL) / ((MAX(VAT_RATE) / 100) + 1)) - SUM(COST_PRICE * QUANTITY),2)) + '" + Number.money.sign + "' + '/ %' + CONVERT(nvarchar,ROUND((((SUM(TOTAL)  / ((MAX(VAT_RATE) / 100) + 1)) - SUM(COST_PRICE * QUANTITY)) / (SUM(TOTAL) / ((MAX(VAT_RATE) / 100) + 1))) * 100,2)) " +
                    "ELSE '0'  " +
                    "END AS GROSS_MARGIN " +
                    "FROM POS_SALE_DATEIL_REPORT_VW_01 WHERE DOC_DATE >= @FISRT_DATE AND DOC_DATE <= @LAST_DATE AND ITEM_CODE IN(" + this.itemsCode+ ") GROUP BY ITEM_CODE,ITEM_NAME ORDER BY ITEM_NAME",
                    param : ['FISRT_DATE:date','LAST_DATE:date','ITEMS:string|500'],
                    value : [this.dtDate.startDate,this.dtDate.endDate]
                },
                sql : this.core.sql
            }
        }
        App.instance.setState({isExecute:true})
        await this.grdItemSaleReport.dataRefresh(tmpSource)
        App.instance.setState({isExecute:false})
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
                            <Form colCount={3} id="frmCriter">
                                {/* dtDate */}
                                <Item>
                                <Label text={this.t("dtDate")} alignment="right" />
                                    <NbDateRange id={"dtDate"} parent={this} startDate={moment(new Date())} endDate={moment(new Date())}/>
                                </Item>
                                <EmptyItem colSpan={2}/>
                                {/* txtRef */}
                                <Item>                                    
                                    <Label text={this.t("txtRef")} alignment="right" />
                                    <NdTextBox id="txtRef" parent={this} simple={true} tabIndex={this.tabIndex}
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    button=
                                    {
                                        [
                                            {
                                                id:'01',
                                                icon:'more',
                                                onClick:()=>
                                                {
                                                    this.pg_txtRef.show()
                                                    this.pg_txtRef.onClick = (data) =>
                                                    {
                                                        if(data.length == 0)
                                                        {
                                                            this.txtRef.value = data[0].NAME
                                                            this.itemsCode = data[0].CODE
                                                        }
                                                        else
                                                        {
                                                            for (let i = 0; i < data.length; i++) 
                                                            {
                                                                this.txtRef.value = this.txtRef.value + ',' + data[i].NAME;
                                                                if(i == 0)
                                                                {
                                                                    this.itemsCode = "'"+ data[i].CODE + "'"
                                                                }
                                                                else
                                                                {
                                                                    this.itemsCode =  this.itemsCode +",'" + data[i].CODE + "'"
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            },
                                        ]
                                    }
                                    onEnterKey={(async()=>
                                        {
                                            await this.pg_txtRef.setVal(this.txtRef.value)
                                            this.pg_txtRef.show()
                                            this.pg_txtRef.onClick = (data) =>
                                            {
                                                if(data.length > 0)
                                                {
                                                    this.txtRef.value = data[0].NAME
                                                    this.txtRef.GUID = data[0].GUID
                                                }
                                            }
                                        }).bind(this)}
                                        selectAll={true}                           
                                    >     
                                    </NdTextBox>      
                                    {/* STOK SEÇİM POPUP */}
                                    <NdPopGrid id={"pg_txtRef"} parent={this} container={"#root"} 
                                    visible={false}
                                    position={{of:'#root'}} 
                                    showTitle={true} 
                                    showBorders={true}
                                    width={'90%'}
                                    height={'90%'}
                                    title={this.t("pg_txtRef.title")} 
                                    selection={{mode:"multiple"}}
                                    search={true}
                                    data = 
                                    {{
                                        source:
                                        {
                                            select:
                                            {
                                                query : "SELECT GUID,CODE,NAME,STATUS FROM ITEMS_VW_01 WHERE UPPER(CODE) LIKE UPPER(@VAL) OR UPPER(NAME) LIKE UPPER(@VAL)",
                                                param : ['VAL:string|50']
                                            },
                                            sql:this.core.sql
                                        }
                                    }}
                                    button=
                                    {
                                        [
                                            {
                                                id:'tst',
                                                icon:'more',
                                                onClick:()=>
                                                {
                                                    console.log(1111)
                                                }
                                            }
                                        ]
                                    }
                                    >
                                        <Column dataField="CODE" caption={this.t("pg_txtRef.clmCode")} width={'20%'} />
                                        <Column dataField="NAME" caption={this.t("pg_txtRef.clmName")} width={'70%'} defaultSortOrder="asc" />
                                        <Column dataField="STATUS" caption={this.t("pg_txtRef.clmStatus")} width={'10%'} />
                                    </NdPopGrid>
                                </Item>
                                <EmptyItem colSpan={1}/>
                                <Item>
                                <NdButton text={this.t("btnGet")} type="success" width="100%" onClick={this.btnGetClick}></NdButton>
                                </Item>
                            </Form>
                        </div>
                    </div>
                    {/* <div className="row px-2 pt-2">
                        <div className="col-3">
                        </div>
                        <div className="col-3">
                            
                        </div>
                        <div className="col-3">
                            
                        </div>
                        <div className="col-3">
                           
                        </div>
                    </div> */}
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <NdGrid id="grdItemSaleReport" parent={this} 
                            selection={{mode:"single"}} 
                            showBorders={true}
                            filterRow={{visible:true}} 
                            headerFilter={{visible:true}}
                            sorting={{ mode: 'single' }}
                            height={600}
                            width={"100%"}
                            columnAutoWidth={true}
                            allowColumnReordering={true}
                            allowColumnResizing={true}
                            onCellPrepared={(e) =>
                                {
                                  
                                }}
                            >                            
                                {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Paging defaultPageSize={20} /> : <Paging enabled={false} />}
                                {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Pager visible={true} allowedPageSizes={[5,10,50]} showPageSizeSelector={true} /> : <Paging enabled={false} />}
                                {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Scrolling mode="standart" /> : <Scrolling mode="infinite" />}
                                <StateStoring enabled={true} type="custom" customLoad={this.loadState} customSave={this.saveState} storageKey={this.props.data.id + "_grdItemSaleReport"}/>
                                <ColumnChooser enabled={true} />
                                <Scrolling mode="standart" />
                                <Export fileName={this.lang.t("menuOff.pos_02_008")} enabled={true} allowExportSelectedData={true} />
                                <Column dataField="ITEM_CODE" caption={this.t("grdListe.clmCode")} visible={true} width={100}/> 
                                <Column dataField="ITEM_NAME" caption={this.t("grdListe.clmName")} visible={true} width={300}/> 
                                <Column dataField="QUANTITY" caption={this.t("grdListe.clmQuantity")} visible={true} width={100}/> 
                                <Column dataField="TOTAL_COST" caption={this.t("grdListe.clmTotalCost")} visible={true} format={{ style: "currency", currency: Number.money.code,precision: 2}}  width={150} allowHeaderFiltering={false}/> 
                                <Column dataField="FAMOUNT" caption={this.t("grdListe.clmFamount")} visible={true} format={{ style: "currency", currency: Number.money.code,precision: 2}}  width={150} allowHeaderFiltering={false}/> 
                                <Column dataField="VAT" caption={this.t("grdListe.clmVat")} dataType="number" format={{ style: "currency", currency: Number.money.code,precision: 2}} visible={true} width={150} allowHeaderFiltering={false}/> 
                                <Column dataField="TOTAL" caption={this.t("grdListe.clmTotal")} dataType="number" format={{ style: "currency", currency: Number.money.code,precision: 2}} visible={true} width={150} allowHeaderFiltering={false}/> 
                                <Column dataField="REST_TOTAL" caption={this.t("grdListe.clmRestTotal")} visible={true}   format={{ style: "currency", currency: Number.money.code,precision: 2}} allowHeaderFiltering={false}/> 
                                <Column dataField="GROSS_MARGIN" caption={this.t("grdListe.clmMargin")} visible={true} width={150} allowHeaderFiltering={false}/> 
                                <Summary>
                                    <TotalItem
                                    column="TOTAL_COST"
                                    summaryType="sum"
                                    valueFormat={{ style: "currency", currency: Number.money.code,precision: 2}} />
                                     <TotalItem
                                    column="FAMOUNT"
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
                                    <TotalItem
                                    column="REST_TOTAL"
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