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



export default class itemMoveReport extends React.PureComponent
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
                    query : "SELECT LUSER,LDATE,REF,REF_NO,DOC_DATE,ITEM_NAME,INPUT_NAME,OUTPUT_NAME,QUANTITY,PRICE,TOTALHT,CASE WHEN TYPE = 0 THEN (SELECT [dbo].[FN_DEPOT_DATE_QUANTITY](ITEM,INPUT,DOC_DATE)) WHEN TYPE = 1  THEN (SELECT [dbo].[FN_DEPOT_DATE_QUANTITY](ITEM,OUTPUT,DOC_DATE)) WHEN TYPE = 2 THEN (SELECT [dbo].[FN_DEPOT_DATE_QUANTITY](ITEM,INPUT,DOC_DATE)) END AS DEPOT_QUANTITY,(SELECT TOP 1 VALUE FROM DB_LANGUAGE WHERE TAG = (SELECT [dbo].[FN_DOC_TYPE_NAME](TYPE,DOC_TYPE,REBATE)) AND LANG = '" + localStorage.getItem('lang') + "') AS TYPE_NAMES from DOC_ITEMS_VW_01 WHERE ITEM = @ITEM AND (DOC_DATE >= @FIRST_DATE AND DOC_DATE <= @LAST_DATE)",
                    param : ['FIRST_DATE:date','LAST_DATE:date','ITEM:string|50'],
                    value : [this.dtDate.startDate,this.dtDate.endDate,this.txtRef.GUID]
                },
                sql : this.core.sql
            }
        }
        App.instance.setState({isExecute:true})
        await this.grdItemMoveReport.dataRefresh(tmpSource)
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
                                                query : "SELECT GUID,CODE,NAME,BARCODE,STATUS FROM ITEMS_BARCODE_MULTICODE_VW_01 WHERE UPPER(CODE) LIKE UPPER(@VAL) OR UPPER(NAME) LIKE UPPER(@VAL) OR BARCODE LIKE @VAL",
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
                                        <Column dataField="NAME" caption={this.t("pg_txtRef.clmName")} width={'50%'} defaultSortOrder="asc" />
                                        <Column dataField="BARCODE" caption={this.t("pg_txtRef.clmBarcode")} width={'20%'} defaultSortOrder="asc" />
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
                            <NdGrid id="grdItemMoveReport" parent={this} 
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
                                {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Paging defaultPageSize={20} /> : <Paging enabled={false} />}
                                {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Pager visible={true} allowedPageSizes={[5,10,50]} showPageSizeSelector={true} /> : <Paging enabled={false} />}
                                {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Scrolling mode="standart" /> : <Scrolling mode="infinite" />}
                                <Export fileName={this.lang.t("menuOff.stk_05_005")} enabled={true} allowExportSelectedData={true} />                                
                                <Column dataField="LUSER" caption={this.t("grdItemMoveReport.clmLuser")} visible={true} width={80}/> 
                                <Column dataField="LDATE" caption={this.t("grdItemMoveReport.clmLdate")} visible={true} width={150}  dataType="datetime" format={"dd/MM/yyyy - HH:mm:ss"}/>
                                <Column dataField="TYPE_NAMES" caption={this.t("grdItemMoveReport.clmTypeName")} visible={true} width={130}/>
                                <Column dataField="REF" caption={this.t("grdItemMoveReport.clmRef")} visible={true} width={150}/> 
                                <Column dataField="REF_NO" caption={this.t("grdItemMoveReport.clmRefNo")} visible={true}  width={70}/> 
                                <Column dataField="DOC_DATE" caption={this.t("grdItemMoveReport.clmDocDate")} visible={true}  width={100} dataType="datetime" format={"dd/MM/yyyy"}/> 
                                <Column dataField="ITEM_NAME" caption={this.t("grdItemMoveReport.clmItemName")} visible={true}  width={150}/> 
                                <Column dataField="INPUT_NAME" caption={this.t("grdItemMoveReport.clmInputName")} visible={true}  width={150}/> 
                                <Column dataField="OUTPUT_NAME" caption={this.t("grdItemMoveReport.clmOutputName")} visible={true}  width={150}/> 
                                <Column dataField="QUANTITY" caption={this.t("grdItemMoveReport.clmQuantity")} visible={true}  width={100}/> 
                                <Column dataField="PRICE" caption={this.t("grdItemMoveReport.clmPrice")} visible={true}  dataType="number" format={{ style: "currency", currency: Number.money.code,precision: 2}}  width={100}/> 
                                <Column dataField="TOTALHT" caption={this.t("grdItemMoveReport.clmTotalHt")} visible={true}  dataType="number" format={{ style: "currency", currency: Number.money.code,precision: 2}}  width={100}/>
                                <Column dataField="DEPOT_QUANTITY" caption={this.t("grdItemMoveReport.clmDepoQuantity")} visible={true} width={100}/>
                            </NdGrid>
                        </div>
                    </div>
                </ScrollView>
            </div>
        )
    }
}