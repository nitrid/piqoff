import React from 'react';
import App from '../../../lib/app.js';

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

export default class itemList extends React.Component
{
    constructor(props)
    {
        super(props)

        this.state = 
        {
            columnListValue : ['REF','REF_NO','OUTPUT_NAME','DOC_DATE_CONVERT','TOTAL']
        }
        
        this.core = App.instance.core;
        this.columnListData = 
        [
            {CODE : "REF",NAME : this.t("grdPurcDisList.clmRef")},
            {CODE : "REF_NO",NAME : this.t("grdPurcDisList.clmRefNo")},
            {CODE : "OUTPUT_CODE",NAME : this.t("grdPurcDisList.clmOutputCode")},                                   
            {CODE : "OUTPUT_NAME",NAME : this.t("grdPurcDisList.clmOutputName")},
            {CODE : "INPUT_NAME",NAME : this.t("grdPurcDisList.clmInputName")},
            {CODE : "DOC_DATE_CONVERT",NAME : this.t("grdPurcDisList.clmDate")},
            {CODE : "AMOUNT",NAME : this.t("grdPurcDisList.clmAmount")},
            {CODE : "VAT",NAME : this.t("grdPurcDisList.clmVat")},
            {CODE : "TOTAL",NAME : this.t("grdPurcDisList.clmTotal")},
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
                if(typeof e.value.find(x => x == 'DOC_DATE_CONVERT') != 'undefined')
                {
                    this.groupList.push('DOC_DATE_CONVERT')
                }
                if(typeof e.value.find(x => x == 'TOTAL') != 'undefined')
                {
                    this.groupList.push('TOTAL')
                }
                
                for (let i = 0; i < this.grdPurcDisList.devGrid.columnCount(); i++) 
                {
                    if(typeof e.value.find(x => x == this.grdPurcDisList.devGrid.columnOption(i).name) == 'undefined')
                    {
                        this.grdPurcDisList.devGrid.columnOption(i,'visible',false)
                    }
                    else
                    {
                        this.grdPurcDisList.devGrid.columnOption(i,'visible',true)
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
                            "WHERE ((OUTPUT_CODE = @OUTPUT_CODE) OR (@OUTPUT_CODE = '')) AND "+ 
                            "((DOC_DATE >= @FIRST_DATE) OR (@FIRST_DATE = '19700101')) AND ((DOC_DATE <= @LAST_DATE) OR (@LAST_DATE = '19700101'))  " +
                            " AND TYPE = 0 AND DOC_TYPE = 40 AND REBATE = 0 ",
                    param : ['OUTPUT_CODE:string|50','FIRST_DATE:date','LAST_DATE:date'],
                    value : [this.cmbCustomer.value,this.dtFirst.value,this.dtLast.value]
                },
                sql : this.core.sql
            }
        }
        
        await this.grdPurcDisList.dataRefresh(tmpSource)
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
                                                id: 'ftr_02_001',
                                                text: this.t('menu.ftr_02_001'),
                                                path: '../pages/invoices/documents/purchaseInvoice.js'
                                            })
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
                                    <Label text={this.t("cmbCustomer")} alignment="right" />
                                        <NdSelectBox simple={true} parent={this} id="cmbCustomer" showClearButton={true}
                                        pageSize ={50}
                                        notRefresh = {true}
                                        displayExpr="OUTPUT_NAME"                       
                                        valueExpr="OUTPUT_CODE"
                                        value=""
                                        data={{source: {select : {query:"SELECT OUTPUT_CODE,OUTPUT_NAME FROM DOC_VW_01 WHERE TYPE = 0 AND DOC_TYPE = 40 AND REBATE = 0 GROUP BY  OUTPUT_NAME,OUTPUT_CODE ORDER BY OUTPUT_NAME ASC"},sql : this.core.sql}}}
                                        // onValueChanged={onValueChanged}
                                        />
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
                            <NdGrid id="grdPurcDisList" parent={this} 
                            selection={{mode:"multiple"}} 
                            showBorders={true}
                            filterRow={{visible:true}} 
                            headerFilter={{visible:true}}
                            columnAutoWidth={true}
                            allowColumnReordering={true}
                            allowColumnResizing={true}
                            >                            
                                <Paging defaultPageSize={20} />
                                <Pager visible={true} allowedPageSizes={[5,10,50]} showPageSizeSelector={true} />

                                <Column dataField="REF" caption={this.t("grdPurcDisList.clmRef")} visible={true} width={200}/> 
                                <Column dataField="REF_NO" caption={this.t("grdPurcDisList.clmRefNo")} visible={true} width={100}/> 
                                <Column dataField="OUTPUT_CODE" caption={this.t("grdPurcDisList.clmOutputCode")} visible={false}/> 
                                <Column dataField="OUTPUT_NAME" caption={this.t("grdPurcDisList.clmOutputName")} visible={true}/> 
                                <Column dataField="INPUT_NAME" caption={this.t("grdPurcDisList.clmInputName")} visible={false}/> 
                                <Column dataField="DOC_DATE_CONVERT" caption={this.t("grdPurcDisList.clmDate")} visible={true} width={200}/> 
                                <Column dataField="AMOUNT" caption={this.t("grdPurcDisList.clmAmount")} visible={false} format={{ style: "currency", currency: "EUR",precision: 2}}/> 
                                <Column dataField="VAT" caption={this.t("grdPurcDisList.clmVat")} visible={false} format={{ style: "currency", currency: "EUR",precision: 2}}/> 
                                <Column dataField="TOTAL" caption={this.t("grdPurcDisList.clmTotal")} visible={true} format={{ style: "currency", currency: "EUR",precision: 2}}/>              
                            </NdGrid>
                        </div>
                    </div>
                </ScrollView>
            </div>
        )
    }
}