import React from 'react';
import App from '../../../lib/app.js';
import moment from 'moment';

import Toolbar,{Item} from 'devextreme-react/toolbar';
import Form, { Label,EmptyItem } from 'devextreme-react/form';
import ScrollView from 'devextreme-react/scroll-view';

import NdGrid,{Column, ColumnChooser,ColumnFixing,Paging,Pager,Scrolling,Export} from '../../../../core/react/devex/grid.js';
import NdTextBox from '../../../../core/react/devex/textbox.js'
import NdSelectBox from '../../../../core/react/devex/selectbox.js';
import NdDropDownBox from '../../../../core/react/devex/dropdownbox.js';
import NdListBox from '../../../../core/react/devex/listbox.js';
import NdButton from '../../../../core/react/devex/button.js';
import NdCheckBox from '../../../../core/react/devex/checkbox.js';
import NdDatePicker from '../../../../core/react/devex/datepicker.js';
import NdPopGrid from '../../../../core/react/devex/popgrid.js';
import { dialog } from '../../../../core/react/devex/dialog.js';

export default class safeList extends React.PureComponent
{
    constructor(props)
    {
        super(props)

        this.state = 
        {
            columnListValue : ['REF','REF_NO','OUTPUT_NAME','INPUT_NAME','AMOUNT','DOC_DATE_CONVERT']
        }
        
        this.core = App.instance.core;
        this.columnListData = 
        [
            {CODE : "REF",NAME : this.t("grdSafeList.clmRef")},
            {CODE : "REF_NO",NAME : this.t("grdSafeList.clmRefNo")},
            {CODE : "OUTPUT_NAME",NAME : this.t("grdSafeList.clmOutputName")},                                   
            {CODE : "INPUT_NAME",NAME : this.t("grdSafeList.clmInputName")},
            {CODE : "DOC_DATE_CONVERT",NAME : this.t("grdSafeList.clmDate")},
            {CODE : "AMOUNT",NAME : this.t("grdSafeList.clmAmount")},
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
                if(typeof e.value.find(x => x == 'INPUT_NAME') != 'undefined')
                {
                    this.groupList.push('INPUT_NAME')
                }
                if(typeof e.value.find(x => x == 'OUTPUT_NAME') != 'undefined')
                {
                    this.groupList.push('OUTPUT_NAME')
                }
                if(typeof e.value.find(x => x == 'DOC_DATE_CONVERT') != 'undefined')
                {
                    this.groupList.push('DOC_DATE_CONVERT')
                }
                if(typeof e.value.find(x => x == 'AMOUNT') != 'undefined')
                {
                    this.groupList.push('AMOUNT')
                }
                
                for (let i = 0; i < this.grdSafeList.devGrid.columnCount(); i++) 
                {
                    if(typeof e.value.find(x => x == this.grdSafeList.devGrid.columnOption(i).name) == 'undefined')
                    {
                        this.grdSafeList.devGrid.columnOption(i,'visible',false)
                    }
                    else
                    {
                        this.grdSafeList.devGrid.columnOption(i,'visible',true)
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
        if(this.cmbSafe.value == '')
        {
            let tmpConfObj =
            {
                id:'msgNotBank',showTitle:true,title:this.t("msgNotBank.title"),showCloseButton:true,width:'500px',height:'200px',
                button:[{id:"btn01",caption:this.t("msgNotBank.btn01"),location:'after'}],
                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgNotBank.msg")}</div>)
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
                    query : "SELECT * FROM DOC_CUSTOMER_VW_01 " +
                            "WHERE ((INPUT = @SAFE) OR (OUTPUT = @SAFE)) AND  "+ 
                            "((DOC_DATE >= @FIRST_DATE) OR (@FIRST_DATE = '19700101')) AND ((DOC_DATE <= @LAST_DATE) OR (@LAST_DATE = '19700101'))  " +
                            " AND  DOC_TYPE IN(200,201) ",
                    param : ['SAFE:string|50','FIRST_DATE:date','LAST_DATE:date'],
                    value : [this.cmbSafe.value,this.dtFirst.value,this.dtLast.value]
                },
                sql : this.core.sql
            }
        }
        App.instance.setState({isExecute:true})
        await this.grdSafeList.dataRefresh(tmpSource)
        App.instance.setState({isExecute:false})

        let tmpQuery = 
        {
            query :"SELECT [dbo].[FN_SAFE_AMOUNT](@SAFE,GETDATE()) AS TOTAL",
            param : ['SAFE:string|50'],
            value : [this.cmbSafe.value]
        }
        let tmpData = await this.core.sql.execute(tmpQuery) 
        if(tmpData.result.recordset.length > 0)
        {
            let txtTotal = tmpData.result.recordset[0].TOTAL
            this.txtAmount.setState({value:txtTotal + ' ' + Number.money.sign});
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
                                                id: 'fns_02_001',
                                                text: this.t('menu'),
                                                path: 'finance/documents/payment.js'
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
                                 {/* cmbSafe */}
                                 <Item>
                                    <Label text={this.t("cmbSafe")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbSafe" notRefresh = {true}
                                    displayExpr="NAME"                       
                                    valueExpr="GUID"
                                    value=""
                                    searchEnabled={true}
                                    onValueChanged={(async()=>
                                        {
                                        }).bind(this)}
                                    data={{source:{select:{query : "SELECT * FROM SAFE_VW_01"},sql:this.core.sql}}}
                                    param={this.param.filter({ELEMENT:'cmbSafe',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'cmbSafe',USERS:this.user.CODE})}
                                    >
                                       
                                    </NdSelectBox>
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
                            <NdGrid id="grdSafeList" parent={this} 
                            selection={{mode:"multiple"}} 
                            showBorders={true}
                            filterRow={{visible:true}} 
                            headerFilter={{visible:true}}
                            columnAutoWidth={true}
                            allowColumnReordering={true}
                            allowColumnResizing={true}
                            >                            
                                <Paging defaultPageSize={10} />
                                <Pager visible={true} allowedPageSizes={[5,10,50]} showPageSizeSelector={true} />
                                <Export fileName={this.lang.t("menuOff.fns_01_004")} enabled={true} allowExportSelectedData={true} />
                                <Column dataField="REF" caption={this.t("grdSafeList.clmRef")} visible={true} width={200}/> 
                                <Column dataField="REF_NO" caption={this.t("grdSafeList.clmRefNo")} visible={true} width={100}/> 
                                <Column dataField="OUTPUT_NAME" caption={this.t("grdSafeList.clmOutputName")} visible={true}/> 
                                <Column dataField="INPUT_NAME" caption={this.t("grdSafeList.clmInputName")} visible={true}/> 
                                <Column dataField="AMOUNT" caption={this.t("grdSafeList.clmAmount")} visible={true} format={{ style: "currency", currency: Number.money.code,precision: 2}}/> 
                                <Column dataField="DOC_DATE" caption={this.t("grdSafeList.clmDate")} visible={true} width={200}
                                editorOptions={{value:null}}
                                cellRender={(e) => 
                                {
                                    if(moment(e.value).format("YYYY-MM-DD") != '1970-01-01')
                                    {
                                        return moment(e.value).format("YYYY-MM-DD")
                                    }
                                    
                                    return
                                }}/> 
                            </NdGrid>
                        </div>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <Form colCount={4} parent={this}>                            
                                {/* TOPLAM */}
                                <EmptyItem />
                                <Item>
                                <Label text={this.t("txtAmount")} alignment="right" />
                                    <NdTextBox id="txtAmount" parent={this} simple={true} readOnly={true}
                                    ></NdTextBox>
                                </Item>
                            </Form>
                        </div>
                    </div>
                </ScrollView>
            </div>
        )
    }
}