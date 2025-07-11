import React from 'react';
import App from '../../../lib/app.js';
import moment from 'moment';

import Toolbar,{Item} from 'devextreme-react/toolbar';
import Form, { Label } from 'devextreme-react/form';
import ScrollView from 'devextreme-react/scroll-view';

import NdGrid,{Column, Paging,Pager,Export,Scrolling} from '../../../../core/react/devex/grid.js';
import NdTextBox from '../../../../core/react/devex/textbox.js'
import NdPopGrid from '../../../../core/react/devex/popgrid.js';
import NdDropDownBox from '../../../../core/react/devex/dropdownbox.js';
import NdListBox from '../../../../core/react/devex/listbox.js';
import NdButton from '../../../../core/react/devex/button.js';
import NdCheckBox from '../../../../core/react/devex/checkbox.js';
import NdDatePicker from '../../../../core/react/devex/datepicker.js';
import { dialog } from '../../../../core/react/devex/dialog.js';
import {NdForm,NdItem,NdLabel,NdEmptyItem} from '../../../../core/react/devex/form.js';

export default class purchaseOrdList extends React.PureComponent
{
    constructor(props)
    {
        super(props)

        this.state = 
        {
            columnListValue : ['REF','REF_NO','OUTPUT_NAME','DOC_DATE','TOTAL']
        }
        
        this.core = App.instance.core;
        this.columnListData = 
        [
            {CODE : "REF",NAME : this.t("grdPurcOrdList.clmRef")},
            {CODE : "REF_NO",NAME : this.t("grdPurcOrdList.clmRefNo")},
            {CODE : "OUTPUT_CODE",NAME : this.t("grdPurcOrdList.clmOutputCode")},                                   
            {CODE : "OUTPUT_NAME",NAME : this.t("grdPurcOrdList.clmOutputName")},
            {CODE : "INPUT_NAME",NAME : this.t("grdPurcOrdList.clmInputName")},
            {CODE : "DOC_DATE",NAME : this.t("grdPurcOrdList.clmDate")},
            {CODE : "AMOUNT",NAME : this.t("grdPurcOrdList.clmAmount")},
            {CODE : "VAT",NAME : this.t("grdPurcOrdList.clmVat")},
            {CODE : "TOTAL",NAME : this.t("grdPurcOrdList.clmTotal")},
        ]
        this.groupList = [];
        this._btnGetClick = this._btnGetClick.bind(this)
        this._columnListBox = this._columnListBox.bind(this)
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
        this.dtFirst.value=moment(new Date()).format("YYYY-MM-DD");
        this.dtLast.value=moment(new Date()).format("YYYY-MM-DD");
        this.txtCustomerCode.CODE = ''
    }
    _columnListBox(e)
    {
        let onOptionChanged = (e) =>
        {
            if (e.name == 'selectedItemKeys') 
            {
                this.groupList = [];
                if(typeof e.value.find(x => x == 'REF') != 'undefined')
                {
                    this.groupList.push('REF')
                }
                if(typeof e.value.find(x => x == 'REF_NO') != 'undefined')
                {
                    this.groupList.push('REF_NO')
                }                
                if(typeof e.value.find(x => x == 'OUTPUT_NAME') != 'undefined')
                {
                    this.groupList.push('OUTPUT_NAME')
                }
                if(typeof e.value.find(x => x == 'DOC_DATE') != 'undefined')
                {
                    this.groupList.push('DOC_DATE')
                }
                if(typeof e.value.find(x => x == 'TOTAL') != 'undefined')
                {
                    this.groupList.push('TOTAL')
                }
                
                for (let i = 0; i < this.grdPurcOrdList.devGrid.columnCount(); i++) 
                {
                    if(typeof e.value.find(x => x == this.grdPurcOrdList.devGrid.columnOption(i).name) == 'undefined')
                    {
                        this.grdPurcOrdList.devGrid.columnOption(i,'visible',false)
                    }
                    else
                    {
                        this.grdPurcOrdList.devGrid.columnOption(i,'visible',true)
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
    async _btnGetClick()
    {
        if(this.chkInvOrDisp.value == false)
        {
            let tmpSource =
            {
                source : 
                {
                    groupBy : this.groupList,
                    select : 
                    {
                        query : "SELECT * FROM DOC_VW_01 " +
                                "WHERE ((OUTPUT_CODE = @OUTPUT_CODE) OR (@OUTPUT_CODE = '')) AND "+ 
                                "((DOC_DATE >= @FIRST_DATE) OR (@FIRST_DATE = '19700101')) AND ((DOC_DATE <= @LAST_DATE) OR (@LAST_DATE = '19700101'))  " +
                                " AND TYPE = 0 AND DOC_TYPE = 60 AND REBATE = 0 ORDER BY DOC_DATE DESC,REF_NO DESC",
                        param : ['OUTPUT_CODE:string|50','FIRST_DATE:date','LAST_DATE:date'],
                        value : [this.txtCustomerCode.CODE,this.dtFirst.value,this.dtLast.value]
                    },
                    sql : this.core.sql
                }
            }
            App.instance.setState({isExecute:true})
            await this.grdPurcOrdList.dataRefresh(tmpSource)
            App.instance.setState({isExecute:false})
        }
        else
        {
            let tmpSource2 =
            {
                source : 
                {
                    groupBy : this.groupList,
                    select : 
                    {
                        query : "SELECT DOC_GUID AS GUID, " +
                                    "REF, " +
                                    "REF_NO, " +
                                    "DOC_DATE, " +
                                    "OUTPUT_NAME, " +
                                    "OUTPUT_CODE, " +
                                    "INPUT_CODE, " +
                                    "INPUT_NAME, " +
                                    "SUM(TOTAL) as TOTAL, " +
                                    "SUM(VAT) as VAT, " +
                                    "SUM(AMOUNT) as AMOUNT " +
                                "FROM DOC_ORDERS_VW_01 " +
                                "WHERE ((OUTPUT_CODE = @OUTPUT_CODE) OR (@OUTPUT_CODE = '')) AND  " +
                                    "((DOC_DATE >= @FIRST_DATE) OR (@FIRST_DATE = '19700101')) AND ((DOC_DATE <= @LAST_DATE) OR (@LAST_DATE = '19700101')) " +
                                    "AND TYPE = 0 AND PEND_QUANTITY > 0 AND CLOSED = 0 " +
                                "GROUP BY DOC_GUID,REF,REF_NO,DOC_DATE,OUTPUT_NAME,OUTPUT_CODE,INPUT_NAME,INPUT_CODE " +
                                "ORDER BY DOC_DATE DESC,REF_NO DESC " ,
                        param : ['OUTPUT_CODE:string|50','FIRST_DATE:date','LAST_DATE:date'],
                        value : [this.txtCustomerCode.CODE,this.dtFirst.value,this.dtLast.value]
                    },
                    sql : this.core.sql
                }
            }
            App.instance.setState({isExecute:true})
            await this.grdPurcOrdList.dataRefresh(tmpSource2)
            App.instance.setState({isExecute:false})
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
                                        icon: 'add',
                                        onClick: async () => 
                                        {
                                            App.instance.menuClick(
                                            {
                                                id: 'sip_02_001',
                                                text: this.t('menu'),
                                                path: 'orders/documents/purchaseOrder.js',
                                            })
                                        }
                                    }    
                                }/>
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
                            <Form colCount={2} id="frmCriter">
                                {/* dtFirst */}
                                <Item>
                                    <Label text={this.t("dtFirst")} alignment="right" />
                                    <NdDatePicker simple={true}  parent={this} id={"dtFirst"} showClearButton={true}
                                    >
                                    </NdDatePicker>
                                </Item>
                                {/* dtLast */}
                                <Item>
                                    <Label text={this.t("dtLast")} alignment="right" />
                                    <NdDatePicker simple={true}  parent={this} id={"dtLast"}
                                    >
                                    </NdDatePicker>
                                </Item>
                                <Item>
                                <Label text={this.t("txtCustomerCode")} alignment="right" />
                                <NdTextBox id="txtCustomerCode" parent={this} simple={true}  notRefresh = {true}
                                upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                onEnterKey={(async()=>
                                    {
                                        await this.pg_txtCustomerCode.setVal(this.txtCustomerCode.value)
                                        this.pg_txtCustomerCode.show()
                                        this.pg_txtCustomerCode.onClick = (data) =>
                                        { 
                                            if(data.length > 0)
                                            {
                                                if(data.length > 0)
                                                {
                                                    this.txtCustomerCode.setState({value:data[0].TITLE})
                                                    this.txtCustomerCode.CODE = data[0].CODE
                                                }
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
                                                        this.txtCustomerCode.CODE = data[0].CODE
                                                    }
                                                }
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
                                    <Column dataField="GENUS_NAME" caption={this.t("pg_txtCustomerCode.clmGenusName")} width={150}/>
                
                                </NdPopGrid>
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
                                    <Label text={this.t("chkInvOrDisp")} alignment="left" />
                                    <NdCheckBox id="chkInvOrDisp" parent={this} defaultValue={true} value={false} />
                                </Item>
                            </Form>
                        </div>
                        <div className="col-3">
                            
                        </div>
                        <div className="col-3">
                            <NdButton text={this.t("btnGet")} type="success" width="100%" onClick={this._btnGetClick}></NdButton>
                        </div>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <NdGrid id="grdPurcOrdList" parent={this} 
                            selection={{mode:"multiple"}} 
                            height={600}
                            showBorders={true}
                            filterRow={{visible:true}} 
                            headerFilter={{visible:true}}
                            columnAutoWidth={true}
                            allowColumnReordering={true}
                            allowColumnResizing={true}
                            onRowDblClick={async(e)=>
                            {
                                App.instance.menuClick(
                                {
                                    id: 'sip_02_001',
                                    text: this.t('menu'),
                                    path: 'orders/documents/purchaseOrder.js',
                                    pagePrm:{GUID:e.data.GUID}
                                })
                            }}
                            >                            
                                {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Paging defaultPageSize={20} /> : <Paging enabled={false} />}
                                {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Pager visible={true} allowedPageSizes={[5,10,50]} showPageSizeSelector={true} /> : <Paging enabled={false} />}
                                {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Scrolling mode="standart" /> : <Scrolling mode="infinite" />}
                                <Export fileName={this.lang.t("menu")} enabled={true} allowExportSelectedData={true} />
                                <Column dataField="REF" caption={this.t("grdPurcOrdList.clmRef")} visible={true} width={200}/> 
                                <Column dataField="REF_NO" caption={this.t("grdPurcOrdList.clmRefNo")} visible={true} width={100}/> 
                                <Column dataField="OUTPUT_CODE" caption={this.t("grdPurcOrdList.clmOutputCode")} visible={false}/> 
                                <Column dataField="OUTPUT_NAME" caption={this.t("grdPurcOrdList.clmOutputName")} visible={true}/> 
                                <Column dataField="INPUT_NAME" caption={this.t("grdPurcOrdList.clmInputName")} visible={false}/> 
                                <Column dataField="DOC_DATE" caption={this.t("grdPurcOrdList.clmDate")} visible={true} width={200} dataType="datetime" format={"dd/MM/yyyy"}/> 
                                <Column dataField="AMOUNT" caption={this.t("grdPurcOrdList.clmAmount")} visible={false} format={{ style: "currency", currency: Number.money.code,precision: 2}}/> 
                                <Column dataField="VAT" caption={this.t("grdPurcOrdList.clmVat")} visible={false} format={{ style: "currency", currency: Number.money.code,precision: 2}}/> 
                                <Column dataField="TOTAL" caption={this.t("grdPurcOrdList.clmTotal")} visible={true} format={{ style: "currency", currency: Number.money.code,precision: 2}}/>              
                            </NdGrid>
                        </div>
                    </div>
                </ScrollView>
            </div>
        )
    }
}