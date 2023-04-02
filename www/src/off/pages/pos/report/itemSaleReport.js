import React from 'react';
import App from '../../../lib/app.js';
import moment from 'moment';

import Toolbar,{Item} from 'devextreme-react/toolbar';
import Form, { EmptyItem, Label } from 'devextreme-react/form';
import ScrollView from 'devextreme-react/scroll-view';

import NdGrid,{Column,Editing,ColumnChooser,ColumnFixing,Paging,Pager,Scrolling,Export} from '../../../../core/react/devex/grid.js';
import NdTextBox from '../../../../core/react/devex/textbox.js'
import NdSelectBox from '../../../../core/react/devex/selectbox.js';
import NdNumberBox from '../../../../core/react/devex/numberbox.js';
import NdDropDownBox from '../../../../core/react/devex/dropdownbox.js';
import NdListBox from '../../../../core/react/devex/listbox.js';
import NdPopUp from '../../../../core/react/devex/popup.js';
import NdButton from '../../../../core/react/devex/button.js';
import NdCheckBox from '../../../../core/react/devex/checkbox.js';
import NdDatePicker from '../../../../core/react/devex/datepicker.js';
import NbDateRange from '../../../../core/react/bootstrap/daterange.js';
import NbRadioButton from "../../../../core/react/bootstrap/radiogroup.js";
import NbLabel from "../../../../core/react/bootstrap/label.js";
import NdPopGrid from '../../../../core/react/devex/popgrid.js';
import NbButton from "../../../../core/react/bootstrap/button.js";
import { dialog } from '../../../../core/react/devex/dialog.js';
import { dataset,datatable,param,access } from "../../../../core/core.js";
import { posExtraCls} from "../../../../core/cls/pos.js";



export default class itemSaleReport extends React.PureComponent
{
    constructor(props)
    {
        super(props)
        
        this.core = App.instance.core;
        this.groupList = [];
        this._btnGetClick = this._btnGetClick.bind(this)
       
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
    async _btnGetClick()
    {
        if(this.txtRef.GUID == '00000000-0000-0000-0000-000000000000')
        {
            let tmpConfObj =
            {
                id:'msgItemSelect',showTitle:true,title:this.t("msgItemSelect.title"),showCloseButton:true,width:'500px',height:'200px',
                button:[{id:"btn01",caption:this.t("msgItemSelect.btn01"),location:'after'}],
                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgItemSelect.msg")}</div>)
            }

            await dialog(tmpConfObj);
            return
        }
        let tmpSource =
        {
            source : 
            {
                groupBy : this.groupList,
                select : 
                {
                    query : "SELECT MIN(DOC_DATE) AS FIRST_DATE, MAX(DOC_DATE) AS LAST_DATE, SUM(QUANTITY) AS QUANTITY, PRICE AS PRICE,(PRICE * SUM(QUANTITY)) AS AMOUNT,SUM(DISCOUNT) AS DISCOUNT,SUM(LOYALTY) AS LOYALTY,SUM(TOTAL) AS TOTAL,ITEM_NAME " +
                    "FROM POS_SALE_VW_01 WHERE (DOC_DATE >= @FIRST_DATE AND DOC_DATE <= @LAST_DATE) AND ((ITEM_GUID = @ITEM) OR (@ITEM = '00000000-0000-0000-0000-000000000000')) GROUP BY PRICE,ITEM_GUID,ITEM_NAME ORDER BY ITEM_NAME,MIN(DOC_DATE) " ,
                    param : ['FIRST_DATE:date','LAST_DATE:date','ITEM:string|50'],
                    value : [this.dtDate.startDate,this.dtDate.endDate,this.txtRef.GUID]
                },
                sql : this.core.sql
            }
        }
        App.instance.setState({isExecute:true})
        await this.grdItemSaleReport.dataRefresh(tmpSource)
        App.instance.setState({isExecute:false})
        let tmpTotal = this.grdItemSaleReport.data.datatable.sum("TOTAL",2)
        this.txtTotal.value = parseFloat(tmpTotal)
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
                                    <NdPopGrid id={"pg_txtRef"} parent={this} container={"#root"} 
                                    visible={false}
                                    position={{of:'#root'}} 
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
                                <NdButton text={this.t("btnGet")} type="success" width="100%" onClick={this._btnGetClick}></NdButton>
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
                            onRowDblClick={async(e)=>
                                {
                                }}
                            >                            
                                <Scrolling mode="standart" />
                                <Export fileName={this.lang.t("menu.pos_02_008")} enabled={true} allowExportSelectedData={true} />
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
                                <Column dataField="PRICE" caption={this.t("grdItemSaleReport.clmPrice")} visible={true}  dataType="number" format={{ style: "currency", currency: "EUR",precision: 2}}  width={150}/> 
                                <Column dataField="AMOUNT" caption={this.t("grdItemSaleReport.clmAmount")} visible={true}  dataType="number" format={{ style: "currency", currency: "EUR",precision: 2}}  width={150}/> 
                                <Column dataField="DISCOUNT" caption={this.t("grdItemSaleReport.clmDiscount")} visible={true}  dataType="number" format={{ style: "currency", currency: "EUR",precision: 2}}  width={150}/> 
                                <Column dataField="LOYALTY" caption={this.t("grdItemSaleReport.clmLoyalty")} visible={true}  dataType="number" format={{ style: "currency", currency: "EUR",precision: 2}}  width={150}/> 
                                <Column dataField="TOTAL" caption={this.t("grdItemSaleReport.clmTotal")} visible={true}  dataType="number" format={{ style: "currency", currency: "EUR",precision: 2}}  width={200}/> 
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
                                    <NdNumberBox id="txtTotal" parent={this} simple={true} readOnly={true} 
                                    maxLength={32} format={{ style: "currency", currency: "EUR",precision: 2}}
                                    ></NdNumberBox>
                                </Item>
                            </Form>
                        </div>
                    </div>
                </ScrollView>
            </div>
        )
    }
}