import React from 'react';
import App from '../../../lib/app.js';
import moment from 'moment';

import Toolbar from 'devextreme-react/toolbar';
import Form, {Item, EmptyItem, Label } from 'devextreme-react/form';
import ScrollView from 'devextreme-react/scroll-view';

import NdGrid,{Column,ColumnChooser,StateStoring,Paging,Pager,Scrolling,Export} from '../../../../core/react/devex/grid.js';
import NdTextBox from '../../../../core/react/devex/textbox.js'
import NdNumberBox from '../../../../core/react/devex/numberbox.js';
import NdButton from '../../../../core/react/devex/button.js';
import NbDateRange from '../../../../core/react/bootstrap/daterange.js';
import NdPopGrid from '../../../../core/react/devex/popgrid.js';
import { dialog } from '../../../../core/react/devex/dialog.js';
import { NdToast } from '../../../../core/react/devex/toast.js';



export default class itemSaleReport extends React.PureComponent
{
    constructor(props)
    {
        super(props)
        
        this.core = App.instance.core;

        this.btnGetirClick = this.btnGetirClick.bind(this)
        this.loadState = this.loadState.bind(this)
        this.saveState = this.saveState.bind(this)
       
        Number.money = this.sysParam.filter({ID:'MoneySymbol',TYPE:0}).getValue()

        this.tabIndex = props.data.tabkey
    }
    componentDidMount()
    {
        setTimeout(async () => { this.Init() }, 1000);
    }
    async Init()
    {
        this.txtRef.GUID = '00000000-0000-0000-0000-000000000000'
    }

    loadState() 
    {
        let tmpLoad = this.access.filter({ELEMENT:'grdSlsOrderState',USERS:this.user.CODE})
        return tmpLoad.getValue()
    }
    saveState(e)
    {
        let tmpSave = this.access.filter({ELEMENT:'grdSlsOrderState',USERS:this.user.CODE, PAGE:this.props.data.id, APP:"OFF"})
        tmpSave.setValue(e)
        tmpSave.save()
    }

    async btnGetirClick()
    {
        if(this.txtRef.GUID == '00000000-0000-0000-0000-000000000000')
        {
            this.toast.show({message:this.t("msgItemSelect.msg"),type:"warning"})
            return
        }
        let tmpSource =
        {
            source : 
            {
                select : 
                {
                    query : `SELECT MIN(DOC_DATE) AS FIRST_DATE, MAX(DOC_DATE) AS LAST_DATE, 
                            CASE WHEN TYPE = 0 THEN SUM(QUANTITY) WHEN TYPE = 1 THEN SUM(QUANTITY) * -1 END AS QUANTITY,
                            CASE WHEN TYPE = 0 THEN (PRICE -(DISCOUNT/QUANTITY)) WHEN TYPE = 1 THEN (PRICE -(DISCOUNT/QUANTITY)) * -1 END  AS PRICE,
                            CASE WHEN TYPE = 0 THEN (PRICE * SUM(QUANTITY)) WHEN TYPE = 1 THEN (PRICE * SUM(QUANTITY)) *-1 END AS AMOUNT,
                            SUM(DISCOUNT) AS DISCOUNT,
                            SUM(LOYALTY) AS LOYALTY,
                            CASE WHEN TYPE = 0 THEN SUM(TOTAL) WHEN TYPE = 1 THEN SUM(TOTAL) * -1 END AS TOTAL,
                            ITEM_NAME 
                            FROM POS_SALE_VW_01 
                            WHERE (DOC_DATE >= @FIRST_DATE AND DOC_DATE <= @LAST_DATE) 
                            AND ((ITEM_GUID = @ITEM) OR (@ITEM = '00000000-0000-0000-0000-000000000000')) 
                            GROUP BY PRICE,ITEM_GUID,ITEM_NAME,(PRICE -(DISCOUNT/QUANTITY)),TYPE 
                            ORDER BY ITEM_NAME,MIN(DOC_DATE)`,
                    param : ['FIRST_DATE:date','LAST_DATE:date','ITEM:string|50'],
                    value : [this.dtDate.startDate,this.dtDate.endDate,this.txtRef.GUID]
                },
                sql : this.core.sql
            }
        }
        App.instance.loading.show()
        await this.grdItemSaleReport.dataRefresh(tmpSource)
        App.instance.loading.hide()

        let tmpTotal = this.grdItemSaleReport.data.datatable.sum("TOTAL",2)

        this.txtTotal.value = parseFloat(tmpTotal)
    }
    render()
    {
        return(
            <div  id={this.props.data.id + this.tabIndex}>
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
                                                        if(data.length > 0)
                                                        {
                                                            this.txtRef.value = data[0].NAME
                                                            this.txtRef.GUID = data[0].GUID
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
                                    <NdPopGrid id={"pg_txtRef"} parent={this} container={'#' + this.props.data.id + this.tabIndex} 
                                    visible={false}
                                    position={{of:'#' + this.props.data.id + this.tabIndex}} 
                                    showTitle={true} 
                                    showBorders={true}
                                    width={'90%'}
                                    height={'90%'}
                                    title={this.t("pg_txtRef.title")} 
                                    selection={{mode:"single"}}
                                    search={true}
                                    data = 
                                    {{
                                        source:
                                        {
                                            select:
                                            {
                                                query : `SELECT GUID,CODE,NAME,BARCODE,STATUS FROM ITEMS_BARCODE_MULTICODE_VW_01 WHERE UPPER(CODE) LIKE UPPER(@VAL) OR UPPER(NAME) LIKE UPPER(@VAL) OR BARCODE LIKE @VAL`,
                                                param : ['VAL:string|50']
                                            },
                                            sql:this.core.sql
                                        }
                                    }}
                                    >
                                        <Column dataField="CODE" caption={this.t("pg_txtRef.clmCode")} width={'20%'} />
                                        <Column dataField="NAME" caption={this.t("pg_txtRef.clmName")} width={'50%'} defaultSortOrder="asc" />
                                        <Column dataField="BARCODE" caption={this.t("pg_txtRef.clmBarcode")} width={'20%'} defaultSortOrder="asc" />
                                        <Column dataField="STATUS" caption={this.t("pg_txtRef.clmStatus")} width={'10%'} />
                                    </NdPopGrid>
                                </Item>
                                <EmptyItem colSpan={1}/>
                                <Item>
                                <NdButton text={this.t("btnGet")} type="success" width="100%" onClick={this.btnGetirClick}></NdButton>
                                </Item>
                            </Form>
                        </div>
                    </div>
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
                            >                            
                                {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Paging defaultPageSize={20} /> : <Paging enabled={false} />}
                                {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Pager visible={true} allowedPageSizes={[5,10,50]} showPageSizeSelector={true} /> : <Paging enabled={false} />}
                                {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Scrolling mode="standart" /> : <Scrolling mode="virtual" />}
                                <StateStoring enabled={true} type="custom" customLoad={this.loadState} customSave={this.saveState} storageKey={this.props.data.id + "_grdGroupSalesReport"}/>
                                <ColumnChooser enabled={true} />
                                <Export fileName={this.lang.t("menuOff.pos_02_008")} enabled={true} allowExportSelectedData={true} />
                                <Column dataField="ITEM_NAME" caption={this.t("grdItemSaleReport.itemName")} visible={true} width={200}/> 
                                <Column dataField="FIRST_DATE" caption={this.t("grdItemSaleReport.clmFirstDate")} visible={true} width={180} dataType="date"
                                editorOptions={{value:null}}
                                cellRender={(e) => 
                                {
                                    if(moment(e.value).format("YYYY-MM-DD") != '1970-01-01')
                                    {
                                        return e.text
                                    }
                                    return
                                }}/>
                                <Column dataField="LAST_DATE" caption={this.t("grdItemSaleReport.clmLastDate")} visible={true} width={180} dataType="date"
                                editorOptions={{value:null}}
                                cellRender={(e) => 
                                {
                                    if(moment(e.value).format("YYYY-MM-DD") != '1970-01-01')
                                    {
                                        return e.text
                                    }
                                    return
                                }}/>
                                <Column dataField="QUANTITY" caption={this.t("grdItemSaleReport.clmQuantity")} visible={true} width={150}/> 
                                <Column dataField="PRICE" caption={this.t("grdItemSaleReport.clmPrice")} visible={true}  dataType="number" format={{ style: "currency", currency: Number.money.code,precision: 2}}  width={150}/> 
                                <Column dataField="AMOUNT" caption={this.t("grdItemSaleReport.clmAmount")} visible={true}  dataType="number" format={{ style: "currency", currency: Number.money.code,precision: 2}}  width={150}/> 
                                <Column dataField="DISCOUNT" caption={this.t("grdItemSaleReport.clmDiscount")} visible={true}  dataType="number" format={{ style: "currency", currency: Number.money.code,precision: 2}}  width={150}/> 
                                <Column dataField="LOYALTY" caption={this.t("grdItemSaleReport.clmLoyalty")} visible={true}  dataType="number" format={{ style: "currency", currency: Number.money.code,precision: 2}}  width={150}/> 
                                <Column dataField="TOTAL" caption={this.t("grdItemSaleReport.clmTotal")} visible={true}  dataType="number" format={{ style: "currency", currency: Number.money.code,precision: 2}}  width={200}/> 
                            </NdGrid>
                        </div>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <Form colCount={4} parent={this} id={"frmSlsInv"  + this.tabIndex}>
                                {/* Ara Toplam */}
                                <EmptyItem colSpan={3}/>
                                <Item>
                                    <Label text={this.t("txtTotal")} alignment="right" />
                                    <NdNumberBox id="txtTotal" parent={this} simple={true} readOnly={true} maxLength={32} format={{ style: "currency", currency: Number.money.code,precision: 2}}></NdNumberBox>
                                </Item>
                            </Form>
                        </div>
                    </div>
                    <NdToast id="toast" parent={this} displayTime={2000} position={{at:"top center",offset:'0px 110px'}}/>       
                </ScrollView>
            </div>
        )
    }
}