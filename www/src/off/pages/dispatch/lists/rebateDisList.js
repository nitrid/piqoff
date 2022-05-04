import React from 'react';
import App from '../../../lib/app.js';
import moment from 'moment';

import Toolbar,{Item} from 'devextreme-react/toolbar';
import Form, { Label } from 'devextreme-react/form';
import ScrollView from 'devextreme-react/scroll-view';

import NdGrid,{Column, ColumnChooser,ColumnFixing,Paging,Pager,Scrolling} from '../../../../core/react/devex/grid.js';
import NdTextBox from '../../../../core/react/devex/textbox.js'
import NdSelectBox from '../../../../core/react/devex/selectbox.js';
import NdDropDownBox from '../../../../core/react/devex/dropdownbox.js';
import NdListBox from '../../../../core/react/devex/listbox.js';
import NdButton from '../../../../core/react/devex/button.js';
import NdCheckBox from '../../../../core/react/devex/checkbox.js';
import NdDatePicker from '../../../../core/react/devex/datepicker.js';
import NdPopGrid from '../../../../core/react/devex/popgrid.js';
import { dialog } from '../../../../core/react/devex/dialog.js';

export default class rebateDisList extends React.Component
{
    constructor(props)
    {
        super(props)

        this.state = 
        {
            columnListValue : ['REF','REF_NO','INPUT_NAME','DOC_DATE_CONVERT','TOTAL']
        }
        
        this.core = App.instance.core;
        this.columnListData = 
        [
            {CODE : "REF",NAME : this.t("grdSlsDisList.clmRef")},
            {CODE : "REF_NO",NAME : this.t("grdSlsDisList.clmRefNo")},
            {CODE : "INPUT_CODE",NAME : this.t("grdSlsDisList.clmInputCode")},                                   
            {CODE : "INPUT_NAME",NAME : this.t("grdSlsDisList.clmInputName")},
            {CODE : "OUTPUT_NAME",NAME : this.t("grdSlsDisList.clmOutputName")},
            {CODE : "DOC_DATE_CONVERT",NAME : this.t("grdSlsDisList.clmDate")},
            {CODE : "AMOUNT",NAME : this.t("grdSlsDisList.clmAmount")},
            {CODE : "VAT",NAME : this.t("grdSlsDisList.clmVat")},
            {CODE : "TOTAL",NAME : this.t("grdSlsDisList.clmTotal")},
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
        this.dtFirst.value=moment(new Date(0)).format("YYYY-MM-DD");
        this.dtLast.value=moment(new Date(0)).format("YYYY-MM-DD");
        this.txtCustomerCode.CODE = '';
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
                if(typeof e.value.find(x => x == 'INPUT_NAME') != 'undefined')
                {
                    this.groupList.push('INPUT_NAME')
                }
                if(typeof e.value.find(x => x == 'DOC_DATE_CONVERT') != 'undefined')
                {
                    this.groupList.push('DOC_DATE_CONVERT')
                }
                if(typeof e.value.find(x => x == 'TOTAL') != 'undefined')
                {
                    this.groupList.push('TOTAL')
                }
                
                for (let i = 0; i < this.grdSlsDisList.devGrid.columnCount(); i++) 
                {
                    if(typeof e.value.find(x => x == this.grdSlsDisList.devGrid.columnOption(i).name) == 'undefined')
                    {
                        this.grdSlsDisList.devGrid.columnOption(i,'visible',false)
                    }
                    else
                    {
                        this.grdSlsDisList.devGrid.columnOption(i,'visible',true)
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
        
        let tmpSource =
        {
            source : 
            {
                groupBy : this.groupList,
                select : 
                {
                    query : "SELECT * FROM DOC_VW_01 " +
                            "WHERE ((INPUT_CODE = @INPUT_CODE) OR (@INPUT_CODE = '')) AND "+ 
                            "((DOC_DATE >= @FIRST_DATE) OR (@FIRST_DATE = '19700101')) AND ((DOC_DATE <= @LAST_DATE) OR (@LAST_DATE = '19700101'))  " +
                            " AND TYPE = 1 AND DOC_TYPE = 40  AND REBATE = 1 ",
                    param : ['INPUT_CODE:string|50','FIRST_DATE:date','LAST_DATE:date'],
                    value : [this.txtCustomerCode.CODE,this.dtFirst.value,this.dtLast.value]
                },
                sql : this.core.sql
            }
        }
        
        await this.grdSlsDisList.dataRefresh(tmpSource)
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
                                                id: 'irs_02_003',
                                                text: this.t('menu'),
                                                path: '../pages/dispatch/documents/rebateDispatch.js',
                                            })
                                        }
                                    }    
                                } />
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
                            <Form colCount={2} id="frmCriter">
                                {/* dtFirst */}
                                <Item>
                                    <Label text={this.t("dtFirst")} alignment="right" />
                                    <NdDatePicker simple={true}  parent={this} id={"dtFirst"}
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
                                data={{source:{select:{query : "SELECT GUID,CODE,TITLE,NAME,LAST_NAME,[TYPE_NAME],[GENUS_NAME] FROM CUSTOMER_VW_01 WHERE GENUS IN(1,2) "},sql:this.core.sql}}}
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
                            
                        </div>
                        <div className="col-3">
                            
                        </div>
                        <div className="col-3">
                            <NdButton text={this.t("btnGet")} type="success" width="100%" onClick={this._btnGetClick}></NdButton>
                        </div>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <NdGrid id="grdSlsDisList" parent={this} 
                            selection={{mode:"multiple"}} 
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
                                            id: 'irs_02_003',
                                            text: this.t('menu'),
                                            path: '../pages/dispatch/documents/rebateDispatch.js',
                                            pagePrm:{GUID:e.data.GUID}
                                        })
                                }}
                            >                            
                                <Paging defaultPageSize={20} />
                                <Pager visible={true} allowedPageSizes={[5,10,50]} showPageSizeSelector={true} />

                                <Column dataField="REF" caption={this.t("grdSlsDisList.clmRef")} visible={true} width={200}/> 
                                <Column dataField="REF_NO" caption={this.t("grdSlsDisList.clmRefNo")} visible={true} width={100}/> 
                                <Column dataField="INPUT_CODE" caption={this.t("grdSlsDisList.clmInputCode")} visible={false}/> 
                                <Column dataField="INPUT_NAME" caption={this.t("grdSlsDisList.clmInputName")} visible={true}/> 
                                <Column dataField="OUTPUT_NAME" caption={this.t("grdSlsDisList.clmOutputName")} visible={false}/> 
                                <Column dataField="DOC_DATE_CONVERT" caption={this.t("grdSlsDisList.clmDate")} visible={true} width={200}/> 
                                <Column dataField="AMOUNT" caption={this.t("grdSlsDisList.clmAmount")} visible={false} format={{ style: "currency", currency: "EUR",precision: 2}}/> 
                                <Column dataField="VAT" caption={this.t("grdSlsDisList.clmVat")} visible={false} format={{ style: "currency", currency: "EUR",precision: 2}}/> 
                                <Column dataField="TOTAL" caption={this.t("grdSlsDisList.clmTotal")} visible={true} format={{ style: "currency", currency: "EUR",precision: 2}}/>              
                            </NdGrid>
                        </div>
                    </div>
                </ScrollView>
            </div>
        )
    }
}