import React from 'react';
import App from '../../../lib/app.js';
import moment from 'moment';

import Toolbar,{Item} from 'devextreme-react/toolbar';
import Form, { Label,EmptyItem } from 'devextreme-react/form';
import ScrollView from 'devextreme-react/scroll-view';

import NdGrid,{Column, ColumnChooser,ColumnFixing,Paging,Pager,Scrolling,Export, Summary, TotalItem} from '../../../../core/react/devex/grid.js';
import NdTextBox from '../../../../core/react/devex/textbox.js'
import NdSelectBox from '../../../../core/react/devex/selectbox.js';
import NdDropDownBox from '../../../../core/react/devex/dropdownbox.js';
import NbDateRange from '../../../../core/react/bootstrap/daterange.js';
import NdPopGrid from '../../../../core/react/devex/popgrid.js';
import NdListBox from '../../../../core/react/devex/listbox.js';
import NdButton from '../../../../core/react/devex/button.js';
import NdCheckBox from '../../../../core/react/devex/checkbox.js';
import { dialog } from '../../../../core/react/devex/dialog.js';

export default class debReport extends React.PureComponent
{
    constructor(props)
    {
        super(props)

        this.state = 
        {
            columnListValue : ['OUTPUT_CODE','OUTPUT_NAME','ADRESS','TOTALHT','KG']
        }
        
        this.core = App.instance.core;
        this.columnListData = 
        [
            {CODE : "OUTPUT_CODE",NAME : this.t("grdListe.clmCode")},                                   
            {CODE : "OUTPUT_NAME",NAME : this.t("grdListe.clmName")},
            {CODE : "ADRESS",NAME : this.t("grdListe.clmAdress")},
            {CODE : "TOTALHT",NAME : this.t("grdListe.clmTotalHt")},
            {CODE : "KG",NAME : this.t("grdListe.clmKg")},
        ]
        this.groupList = [];
        this._btnGetirClick = this._btnGetirClick.bind(this)
        this._columnListBox = this._columnListBox.bind(this)
    }
    componentDidMount()
    {
        setTimeout(async () => 
        {
        }, 1000);
    }
    _columnListBox(e)
    {
        let onOptionChanged = (e) =>
        {
            if (e.name == 'selectedItemKeys') 
            {
                this.groupList = [];
                if(typeof e.value.find(x => x == 'OUTPUT_CODE') != 'undefined')
                {
                    this.groupList.push('OUTPUT_CODE')
                }
                if(typeof e.value.find(x => x == 'OUTPUT_NAME') != 'undefined')
                {
                    this.groupList.push('OUTPUT_NAME')
                }                
                if(typeof e.value.find(x => x == 'ADRESS') != 'undefined')
                {
                    this.groupList.push('ADRESS')
                }
                if(typeof e.value.find(x => x == 'TOTALHT') != 'undefined')
                {
                    this.groupList.push('TOTALHT')
                }
                if(typeof e.value.find(x => x == 'KG') != 'undefined')
                {
                    this.groupList.push('KG')
                }
                for (let i = 0; i < this.grdListe.devGrid.columnCount(); i++) 
                {
                    if(typeof e.value.find(x => x == this.grdListe.devGrid.columnOption(i).name) == 'undefined')
                    {
                        this.grdListe.devGrid.columnOption(i,'visible',false)
                    }
                    else
                    {
                        this.grdListe.devGrid.columnOption(i,'visible',true)
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
    async _btnGetirClick()
    {
       
        let tmpSource =
        {
            source : 
            {
                groupBy : this.groupList,
                select : 
                {
                    query : "SELECT " +
                            "OUTPUT_CODE,OUTPUT_NAME," +
                            "MAX(ADRESS) AS ADRESS ," +
                            "SUM(TOTALHT) AS TOTALHT," +
                            "ROUND(SUM(KG),3) AS KG FROM [DEB_ITEMS_VW_01] " +
                            "WHERE DOC_DATE >= @FIRST_DATE AND DOC_DATE <= @LAST_DATE " +
                            "GROUP BY OUTPUT_CODE,OUTPUT_NAME" ,
                    param : ['FIRST_DATE:date','LAST_DATE:date'],
                    value : [this.dtDate.startDate,this.dtDate.endDate]
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
                                <NbDateRange id={"dtDate"} parent={this} startDate={moment().startOf('year')} endDate={moment().endOf('year')}/>
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
                                <Paging defaultPageSize={20} />
                                <Pager visible={true} allowedPageSizes={[5,10,20,50]} showPageSizeSelector={true} />
                                <Export fileName={this.lang.t("menuOff.slsRpt_01_001")} enabled={true} allowExportSelectedData={true} />
                                <Column dataField="OUTPUT_CODE" caption={this.t("grdListe.clmCode")} visible={true} /> 
                                <Column dataField="OUTPUT_NAME" caption={this.t("grdListe.clmName")} visible={true}/> 
                                <Column dataField="ADRESS" caption={this.t("grdListe.clmAdress")} visible={true} /> 
                                <Column dataField="TOTALHT" caption={this.t("grdListe.clmTotalHt")} format={{ style: "currency", currency: Number.money.code,precision: 2}} visible={true} /> 
                                <Column dataField="KG" caption={this.t("grdListe.clmKg")}  visible={true} /> 
                                <Summary>
                                    <TotalItem
                                    column="TOTALHT"
                                    summaryType="sum"
                                    valueFormat={{ style: "currency", currency: Number.money.code,precision: 2}} />
                                     <TotalItem
                                    column="KG"
                                    summaryType="sum" valueFormat={'##0.00'}/>
                                </Summary> 
                            </NdGrid>
                        </div>
                    </div>
                </ScrollView>
            </div>
        )
    }
}