import React from 'react';
import App from '../../../lib/app.js';
import moment from 'moment';

import Toolbar,{Item} from 'devextreme-react/toolbar';
import Form, { EmptyItem, Label } from 'devextreme-react/form';
import ScrollView from 'devextreme-react/scroll-view';

import NdGrid,{Column,Editing,ColumnChooser,ColumnFixing,Paging,Pager,Scrolling,Export,Summary,TotalItem} from '../../../../core/react/devex/grid.js';
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



export default class customerItemSaleReport extends React.PureComponent
{
    constructor(props)
    {
        super(props)
        
        this.core = App.instance.core;
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
        this.txtCustomer.GUID = '00000000-0000-0000-0000-000000000000'
    }
    async _btnGetClick()
    {
        if(this.txtCustomer.GUID == '00000000-0000-0000-0000-000000000000')
        {
            let tmpConfObj =
            {
                id:'msgCustomerSelect',showTitle:true,title:this.t("msgCustomerSelect.title"),showCloseButton:true,width:'500px',height:'200px',
                button:[{id:"btn01",caption:this.t("msgCustomerSelect.btn01"),location:'after'}],
                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgCustomerSelect.msg")}</div>)
            }

            await dialog(tmpConfObj);
            return
        }
        let tmpSource =
        {
            source : 
            {
                select : 
                {
                    query : "SELECT CUSER_NAME,LUSER_NAME,DEVICE,REF,DOC_DATE,ITEM_CODE,ITEM_NAME,ITEM_GRP_NAME,BARCODE,QUANTITY,UNIT_SHORT,PRICE,FAMOUNT,AMOUNT,DISCOUNT, " +
                            "LOYALTY,VAT,VAT_RATE,TOTAL FROM POS_SALE_VW_01 WHERE CUSTOMER_CODE = '14531453' AND DOC_DATE >= @FIRST_DATE AND DOC_DATE <= @LAST_DATE" ,
                    param : ['FIRST_DATE:date','LAST_DATE:date','CUSTOMER_CODE:string|50'],
                    value : [this.dtDate.startDate,this.dtDate.endDate,this.txtCustomer.GUID]
                },
                sql : this.core.sql
            }
        }
        App.instance.setState({isExecute:true})
        await this.grdList.dataRefresh(tmpSource)
        App.instance.setState({isExecute:false})
        let tmpTotal = this.grdList.data.datatable.sum("TOTAL",2)
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
                                {/* txtCustomer */}
                                <Item>                                    
                                    <Label text={this.t("txtCustomer")} alignment="right" />
                                    <NdTextBox id="txtCustomer" parent={this} simple={true} tabIndex={this.tabIndex}
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    button=
                                    {
                                        [
                                            {
                                                id:'01',
                                                icon:'more',
                                                onClick:()=>
                                                {
                                                    this.pg_txtCustomer.show()
                                                    this.pg_txtCustomer.onClick = (data) =>
                                                    {
                                                        if(data.length > 0)
                                                        {
                                                            this.txtCustomer.value = data[0].NAME
                                                            this.txtCustomer.GUID = data[0].GUID
                                                        }
                                                    }
                                                }
                                            },
                                        ]
                                    }
                                    onEnterKey={(async()=>
                                    {
                                        await this.pg_txtCustomer.setVal(this.txtCustomer.value)
                                        this.pg_txtCustomer.show()
                                        this.pg_txtCustomer.onClick = (data) =>
                                        {
                                            if(data.length > 0)
                                            {
                                                this.txtCustomer.value = data[0].NAME
                                                this.txtCustomer.GUID = data[0].GUID
                                            }
                                        }
                                    }).bind(this)}
                                    selectAll={true}                           
                                    >     
                                    </NdTextBox>      
                                    {/* MÜŞTERİ SEÇİM POPUP */}
                                    <NdPopGrid id={"pg_txtCustomer"} parent={this} container={"#root"} 
                                    visible={false}
                                    position={{of:'#root'}} 
                                    showTitle={true} 
                                    showBorders={true}
                                    width={'90%'}
                                    height={'90%'}
                                    title={this.t("pg_txtCustomer.title")} 
                                    selection={{mode:"single"}}
                                    search={true}
                                    data = 
                                    {{
                                        source:
                                        {
                                            select:
                                            {
                                                query : "SELECT GUID,CODE,NAME FROM CUSTOMER_VW_01 WHERE UPPER(CODE) LIKE UPPER(@VAL) OR UPPER(NAME) LIKE UPPER(@VAL)",
                                                param : ['VAL:string|50']
                                            },
                                            sql:this.core.sql
                                        }
                                    }}
                                    >
                                        <Column dataField="CODE" caption={this.t("pg_txtCustomer.clmCode")} width={'20%'} />
                                        <Column dataField="NAME" caption={this.t("pg_txtCustomer.clmName")} width={'70%'} defaultSortOrder="asc" />
                                    </NdPopGrid>
                                </Item>
                                <EmptyItem colSpan={1}/>
                                <Item>
                                <NdButton text={this.t("btnGet")} type="success" width="100%" onClick={this._btnGetClick}></NdButton>
                                </Item>
                            </Form>
                        </div>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <NdGrid id="grdList" parent={this} 
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
                                <Scrolling mode="standart" />
                                <ColumnChooser enabled={true} />
                                <Export fileName={this.lang.t("menu.pos_02_008")} enabled={true} allowExportSelectedData={true} />
                                <Column dataField="CUSER_NAME" caption={this.t("grdList.cuserName")} visible={true} width={100}/> 
                                <Column dataField="LUSER_NAME" caption={this.t("grdList.luserName")} visible={true} width={100}/> 
                                <Column dataField="DEVICE" caption={this.t("grdList.device")} visible={true} width={50}/> 
                                <Column dataField="REF" caption={this.t("grdList.ref")} visible={true} width={50}/> 
                                <Column dataField="DOC_DATE" caption={this.t("grdList.docDate")} visible={true} width={100} dataType="date"/> 
                                <Column dataField="ITEM_CODE" caption={this.t("grdList.itemCode")} visible={true} width={100}/> 
                                <Column dataField="BARCODE" caption={this.t("grdList.barcode")} visible={true} width={100}/> 
                                <Column dataField="ITEM_NAME" caption={this.t("grdList.itemName")} visible={true} width={150}/> 
                                <Column dataField="ITEM_GRP_NAME" caption={this.t("grdList.itemGrpName")} visible={true} width={100}/> 
                                <Column dataField="QUANTITY" caption={this.t("grdList.clmQuantity")} visible={true} width={80}/> 
                                <Column dataField="UNIT_SHORT" caption={this.t("grdList.unitShort")} visible={true} width={50}/> 
                                <Column dataField="PRICE" caption={this.t("grdList.clmPrice")} visible={true} dataType="number" format={{ style: "currency", currency: "EUR",precision: 2}}  width={80}/> 
                                <Column dataField="FAMOUNT" caption={this.t("grdList.clmFAmount")} visible={true}  dataType="number" format={{ style: "currency", currency: "EUR",precision: 2}}  width={80}/> 
                                <Column dataField="AMOUNT" caption={this.t("grdList.clmAmount")} visible={true}  dataType="number" format={{ style: "currency", currency: "EUR",precision: 2}}  width={80}/> 
                                <Column dataField="DISCOUNT" caption={this.t("grdList.clmDiscount")} visible={true}  dataType="number" format={{ style: "currency", currency: "EUR",precision: 2}}  width={80}/> 
                                <Column dataField="LOYALTY" caption={this.t("grdList.clmLoyalty")} visible={true}  dataType="number" format={{ style: "currency", currency: "EUR",precision: 2}}  width={80}/> 
                                <Column dataField="VAT" caption={this.t("grdList.clmVat")} visible={true}  dataType="number" format={{ style: "currency", currency: "EUR",precision: 2}}  width={80}/> 
                                <Column dataField="VAT_RATE" caption={this.t("grdList.clmVatRate")} visible={true}  dataType="number"width={50}/> 
                                <Column dataField="TOTAL" caption={this.t("grdList.clmTotal")} visible={true}  dataType="number" format={{ style: "currency", currency: "EUR",precision: 2}}  width={80}/> 
                                <Summary>
                                    <TotalItem column="FAMOUNT" summaryType="sum" valueFormat={{ style: "currency", currency: "EUR",precision: 2}} customizeText={(e)=>{return e.value + Number.money.sign;}}/>
                                    <TotalItem column="AMOUNT" summaryType="sum" valueFormat={{ style: "currency", currency: "EUR",precision: 2}} customizeText={(e)=>{return e.value + Number.money.sign;}}/>
                                    <TotalItem column="DISCOUNT" summaryType="sum" valueFormat={{ style: "currency", currency: "EUR",precision: 2}} customizeText={(e)=>{return e.value + Number.money.sign;}}/>
                                    <TotalItem column="LOYALTY" summaryType="sum" valueFormat={{ style: "currency", currency: "EUR",precision: 2}} customizeText={(e)=>{return e.value + Number.money.sign;}}/>
                                    <TotalItem column="VAT" summaryType="sum" valueFormat={{ style: "currency", currency: "EUR",precision: 2}} customizeText={(e)=>{return e.value + Number.money.sign;}}/>
                                    <TotalItem column="TOTAL" summaryType="sum" valueFormat={{ style: "currency", currency: "EUR",precision: 2}} customizeText={(e)=>{return e.value + Number.money.sign;}}/>
                                </Summary>
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