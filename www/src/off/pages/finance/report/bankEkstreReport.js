import React from 'react';
import App from '../../../lib/app.js';
import moment from 'moment';

import Toolbar,{Item} from 'devextreme-react/toolbar';
import Form, { Label,EmptyItem } from 'devextreme-react/form';
import ScrollView from 'devextreme-react/scroll-view';

import NdGrid,{Column,ColumnChooser,ColumnFixing,Paging,Pager,Scrolling,Export,Summary,TotalItem} from '../../../../core/react/devex/grid.js';
import NdTextBox from '../../../../core/react/devex/textbox.js'
import NdSelectBox from '../../../../core/react/devex/selectbox.js';
import NdDropDownBox from '../../../../core/react/devex/dropdownbox.js';
import NbDateRange from '../../../../core/react/bootstrap/daterange.js';
import NdPopGrid from '../../../../core/react/devex/popgrid.js';
import NdListBox from '../../../../core/react/devex/listbox.js';
import NdButton from '../../../../core/react/devex/button.js';
import NdCheckBox from '../../../../core/react/devex/checkbox.js';
import { dialog } from '../../../../core/react/devex/dialog.js';

export default class bankEkstreReport extends React.PureComponent
{
    constructor(props)
    {
        super(props)

        this.core = App.instance.core;

        this.groupList = [];
        this._btnGetirClick = this._btnGetirClick.bind(this)
    }
    componentDidMount()
    {
        setTimeout(async () => 
        {
        }, 1000);
    }
    async _btnGetirClick()
    {
       
        let tmpSource =
        {
            source : 
            {
                groupBy : this.groupList,
                select : 
                {
                    query : "SELECT *,CASE WHEN INPUT = @BANK THEN AMOUNT ELSE (AMOUNT * -1) END AS DOC_AMOUNT, " + 
                    "(SELECT TOP 1 VALUE FROM DB_LANGUAGE WHERE TAG = (SELECT [dbo].[FN_DOC_CUSTOMER_TYPE_NAME](TYPE,DOC_TYPE,REBATE,PAY_TYPE)) AND LANG = @LANG) AS TYPE_NAME " + 
                    " FROM DOC_CUSTOMER_VW_01 WHERE ((INPUT = @BANK) OR (OUTPUT  = @BANK)) AND DOC_DATE >= @FIRST_DATE AND DOC_DATE <= @LAST_DATE ORDER BY DOC_DATE" ,
                    param : ['FIRST_DATE:date','LAST_DATE:date','BANK:string|50','LANG:string|50'],
                    value : [this.dtDate.startDate,this.dtDate.endDate,this.cmbBank.value,localStorage.getItem('lang')]
                },
                sql : this.core.sql
            }
        }

        await this.grdListe.dataRefresh(tmpSource)
      
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
                            <Form colCount={2} id="frmKriter">
                                <Item>
                                    <Label text={this.t("cmbBank")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbBank"
                                    displayExpr="NAME"                       
                                    valueExpr="GUID"
                                    value=""
                                    searchEnabled={true}
                                    notRefresh={true}
                                    onValueChanged={(async()=>
                                        {

                                        }).bind(this)}
                                    data={{source:{select:{query : "SELECT * FROM BANK_VW_01"},sql:this.core.sql}}}
                                    >
                                    </NdSelectBox>
                                </Item>
                                <Item>
                                    <NbDateRange id={"dtDate"} parent={this} startDate={moment().startOf('month')} endDate={moment().endOf('month')}/>
                                </Item>
                            </Form>
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
                            <NdButton text={this.t("btnGet")} type="success" width="100%" onClick={this._btnGetirClick}></NdButton>
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
                                <Export fileName={this.lang.t("menuOff.slsRpt_01_003")} enabled={true} allowExportSelectedData={true} />
                                <Column dataField="DOC_DATE" caption={this.t("grdListe.clmDocDate")} visible={true} dataType="date" width={100}
                                editorOptions={{value:null}}
                                cellRender={(e) => 
                                {
                                    if(moment(e.value).format("YYYY-MM-DD") != '1970-01-01')
                                    {
                                        return e.text
                                    }
                                    
                                    return
                                }}/>
                                <Column dataField="TYPE_NAME" caption={this.t("grdListe.clmTypeName")} width={120} visible={true}/> 
                                <Column dataField="OUTPUT_NAME" caption={this.t("grdListe.clmOutputName")} width={120} visible={true}/> 
                                <Column dataField="INPUT_NAME" caption={this.t("grdListe.clmInputName")} width={120} visible={true}/> 
                                <Column dataField="REF" caption={this.t("grdListe.clmRef")} width={90} visible={true}/> 
                                <Column dataField="REF_NO" caption={this.t("grdListe.clmRefNo")} width={90} visible={true}/> 
                                <Column dataField="DOC_AMOUNT" caption={this.t("grdListe.clmAmount")} width={100} visible={true}/> 
                                <Column dataField="DESCRIPTION" caption={this.t("grdListe.clmDescription")} width={100} visible={true}/> 
                                <Summary>
                                    <TotalItem
                                    column="DOC_AMOUNT"
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