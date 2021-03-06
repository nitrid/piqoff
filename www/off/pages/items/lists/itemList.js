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
import NdTagBox from '../../../../core/react/devex/tagbox.js';
import { dialog } from '../../../../core/react/devex/dialog.js';


export default class itemList extends React.PureComponent
{
    constructor(props)
    {
        super(props)

        this.state = 
        {
            columnListValue : ['NAME','CODE','BARCODE','MULTICODE','CUSTOMER_NAME','PRICE_SALE','VAT','MAIN_GRP_NAME']
        }
        
        this.core = App.instance.core;
        this.columnListData = 
        [
            {CODE : "NAME",NAME : this.t("grdListe.clmName")},
            {CODE : "SNAME",NAME : this.t("grdListe.clmSname")},
            {CODE : "MAIN_GRP_NAME",NAME : this.t("grdListe.clmMainGrp")},                        
            {CODE : "UNIT_NAME",NAME :  this.t("grdListe.clmUnit")},
            {CODE : "CODE",NAME :  this.t("grdListe.clmCode")},
            {CODE : "BARCODE",NAME :  this.t("grdListe.clmBarcode")},
            {CODE : "MULTICODE",NAME : this.t("grdListe.clmMulticode")},
            {CODE : "CUSTOMER_NAME",NAME :  this.t("grdListe.clmCustomer")},
            {CODE : "PRICE_SALE",NAME :  this.t("grdListe.clmPriceSale")},
            {CODE : "COST_PRICE",NAME :  this.t("grdListe.clmCostPrice")},
            {CODE : "MARGIN",NAME :  this.t("grdListe.clmMargin")},
            {CODE : "NETMARGIN",NAME :  this.t("grdListe.clmNetMargin")},
            {CODE : "VAT",NAME :  this.t("grdListe.clmVat")},  
            {CODE : "MIN_PRICE",NAME :  this.t("grdListe.clmMinPrice")},
            {CODE : "MAX_PRICE",NAME :  this.t("grdListe.clmMaxPrice")},
            {CODE : "STATUS",NAME :  this.t("grdListe.clmStatus")},
        ]
        this.groupList = [];
        this._btnGetirClick = this._btnGetirClick.bind(this)
        this._columnListBox = this._columnListBox.bind(this)
    }
    componentDidMount()
    {
        setTimeout(async () => 
        {
            // this.test.data.source.groupBy = ["NAME"]
            // await this.test.dataRefresh()
            //console.log(this.test.data.datatable)
            // this.test.data.store.load().then(
            //     (data) => { console.log(data)},
            //     (error) => { /* Handle the "error" here */ }
            // );
        }, 1000);
    }
    _columnListBox(e)
    {
        let onOptionChanged = (e) =>
        {
            if (e.name == 'selectedItemKeys') 
            {
                this.groupList = [];
                if(typeof e.value.find(x => x == 'MULTICODE') != 'undefined')
                {
                    this.groupList.push('MULTICODE')
                }
                if(typeof e.value.find(x => x == 'BARCODE') != 'undefined')
                {
                    this.groupList.push('BARCODE')
                }                
                if(typeof e.value.find(x => x == 'CODE') != 'undefined')
                {
                    this.groupList.push('CODE')
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
       
        if(this.txtUrunAdi.value != '' && this.txtUrunAdi.value.slice(-1) != '*')
        {
            let tmpUrunAdi = this.txtUrunAdi.value + '*'
            this.txtUrunAdi.setState({value:tmpUrunAdi})
        }
        
        if(this.chkMasterBarcode.value == true)
        {
            let tmpSource =
            {
                source : 
                {
                    groupBy : this.groupList,
                    select : 
                    {
                        query : "SELECT *,MAIN_UNIT_NAME AS UNIT_NAME," + 
                                "CASE WHEN PRICE_SALE <> 0 THEN " +
                                "CONVERT(nvarchar,ROUND((PRICE_SALE / ((VAT / 100) + 1)) - COST_PRICE,2)) + '/ %' + CONVERT(nvarchar,ROUND((((PRICE_SALE / ((VAT / 100) + 1)) - COST_PRICE) / (PRICE_SALE / ((VAT / 100) + 1))) * 100,2)) " +
                                "ELSE '0'  " +
                                "END AS MARGIN, " +
                                "CASE WHEN PRICE_SALE <> 0 THEN " +
                                "CONVERT(nvarchar,ROUND(((PRICE_SALE / ((VAT / 100) + 1)) - COST_PRICE) / 1.12,2)) + '/ %' + CONVERT(nvarchar,ROUND(((((PRICE_SALE / ((VAT / 100) + 1)) - COST_PRICE) / 1.12) / (PRICE_SALE / ((VAT / 100) + 1))) * 100,2)) " +
                                "ELSE '0' " +
                                "END AS NETMARGIN " +
                                "FROM ITEMS_EDIT_VW_01 " +
                                "WHERE {0} " +
                                "((NAME LIKE @NAME +'%') OR (@NAME = '')) AND " +
                                "((MAIN_GRP = @MAIN_GRP) OR (@MAIN_GRP = '')) AND " +
                                "((CUSTOMER_CODE = @CUSTOMER_CODE) OR (@CUSTOMER_CODE = ''))",
                        param : ['NAME:string|250','MAIN_GRP:string|25','CUSTOMER_CODE:string|25'],
                        value : [this.txtUrunAdi.value.replaceAll("*", "%"),this.cmbUrunGrup.value,this.cmbTedarikci.value]
                    },
                    sql : this.core.sql
                }
            }
            
            if(this.txtBarkod.value.length == 0)
            {
                tmpSource.source.select.query = tmpSource.source.select.query.replaceAll("{0}", "")
            }
            else if(this.txtBarkod.value.length == 1)
            {
                tmpSource.source.select.query = tmpSource.source.select.query.replaceAll("{0}", "((CODE LIKE '" + this.txtBarkod.value[0] + "' + '%') OR (BARCODE LIKE '" + this.txtBarkod.value[0] + "' + '%') OR (MULTICODE LIKE '" + this.txtBarkod.value[0] + "' + '%')) AND")
            }
            else
            {
                let TmpVal = ''
                for (let i = 0; i < this.txtBarkod.value.length; i++) 
                {
                    TmpVal = TmpVal + ",'" + this.txtBarkod.value[i] + "'"
                    
                }
                tmpSource.source.select.query = tmpSource.source.select.query.replaceAll("{0}", "((CODE IN (" + TmpVal.substring(1,TmpVal.length) + ")) OR (BARCODE IN (" + TmpVal.substring(1,TmpVal.length) + ")) OR (MULTICODE IN (" + TmpVal.substring(1,TmpVal.length) + "))) AND")
            }
            await this.grdListe.dataRefresh(tmpSource)
        }
        else
        {
            let tmpSource =
            {
                source : 
                {
                    groupBy : this.groupList,
                    select : 
                    {
                        query : "SELECT *," +
                                "CASE WHEN PRICE_SALE <> 0 THEN " +
                                "CONVERT(nvarchar,ROUND((PRICE_SALE / ((VAT / 100) + 1)) - COST_PRICE,2)) + '/ %' + CONVERT(nvarchar,ROUND((((PRICE_SALE / ((VAT / 100) + 1)) - COST_PRICE) / (PRICE_SALE / ((VAT / 100) + 1))) * 100,2)) " +
                                "ELSE '0'  " +
                                "END AS MARGIN, " +
                                "CASE WHEN PRICE_SALE <> 0 THEN " +
                                "CONVERT(nvarchar,ROUND(((PRICE_SALE / ((VAT / 100) + 1)) - COST_PRICE) / 1.12,2)) + '/ %' + CONVERT(nvarchar,ROUND(((((PRICE_SALE / ((VAT / 100) + 1)) - COST_PRICE) / 1.12) / (PRICE_SALE / ((VAT / 100) + 1))) * 100,2)) " +
                                "ELSE '0' " +
                                "END AS NETMARGIN " +
                                "FROM ITEMS_BARCODE_MULTICODE_VW_01 " +
                                "WHERE {0} " +
                                "((NAME LIKE @NAME +'%') OR (@NAME = '')) AND " +
                                "((MAIN_GRP = @MAIN_GRP) OR (@MAIN_GRP = '')) AND " +
                                "((CUSTOMER_CODE = @CUSTOMER_CODE) OR (@CUSTOMER_CODE = ''))",
                        param : ['NAME:string|250','MAIN_GRP:string|25','CUSTOMER_CODE:string|25'],
                        value : [this.txtUrunAdi.value.replaceAll("*", "%"),this.cmbUrunGrup.value,this.cmbTedarikci.value]
                    },
                    sql : this.core.sql
                }
            }
            
            
            if(this.txtBarkod.value.length == 0)
            {
                tmpSource.source.select.query = tmpSource.source.select.query.replaceAll("{0}", "")
            }
            else if(this.txtBarkod.value.length == 1)
            {
                tmpSource.source.select.query = tmpSource.source.select.query.replaceAll("{0}", "((CODE LIKE '" + this.txtBarkod.value[0] + "' + '%') OR (BARCODE LIKE '" + this.txtBarkod.value[0] + "' + '%') OR (MULTICODE LIKE '" + this.txtBarkod.value[0] + "' + '%')) AND")
            }
            else
            {
                let TmpVal = ''
                for (let i = 0; i < this.txtBarkod.value.length; i++) 
                {
                    TmpVal = TmpVal + ",'" + this.txtBarkod.value[i] + "'"
                    
                }
                tmpSource.source.select.query = tmpSource.source.select.query.replaceAll("{0}", "((CODE IN (" + TmpVal.substring(1,TmpVal.length) + ")) OR (BARCODE IN (" + TmpVal.substring(1,TmpVal.length) + ")) OR (MULTICODE IN (" + TmpVal.substring(1,TmpVal.length) + "))) AND")
            }
            await this.grdListe.dataRefresh(tmpSource)
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
                                                id: 'stk_01_001',
                                                text: 'Stok Tan??mlar??',
                                                path: '../pages/items/cards/itemCard.js'
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
                            <Form colCount={2} id="frmKriter">
                                <Item>
                                    <Label text={this.t("txtBarkod")} alignment="right" />
                                        <NdTagBox id="txtBarkod" parent={this} simple={true} value={[]}
                                        />
                                </Item>
                                <Item>
                                    <Label text={this.t("cmbCustomer")} alignment="right" />
                                        <NdSelectBox simple={true} parent={this} id="cmbTedarikci" showClearButton={true} notRefresh={true}  searchEnabled={true}
                                        displayExpr="TITLE"                       
                                        valueExpr="CODE"
                                        data={{source: {select : {query:"SELECT CODE,TITLE FROM CUSTOMER_VW_01 WHERE TYPE IN(1,2) ORDER BY TITLE ASC"},sql : this.core.sql}}}
                                        />
                                </Item>
                                <Item>
                                    <Label text={this.t("txtItemName")} alignment="right" />
                                        <NdTextBox id="txtUrunAdi" parent={this} simple={true} onEnterKey={this._btnGetirClick}/>
                                </Item>
                                <Item>
                                    <Label text={this.t("cmbMainGrp")} alignment="right" />
                                        <NdSelectBox simple={true} parent={this} id="cmbUrunGrup" showClearButton={true} notRefresh={true}  searchEnabled={true}
                                        displayExpr="NAME"                       
                                        valueExpr="CODE"
                                        data={{source: {select : {query:"SELECT CODE,NAME FROM ITEM_GROUP ORDER BY NAME ASC"},sql : this.core.sql}}}
                                        />
                                </Item>
                                <Item> </Item>
                                <Item>
                                    <Label text={this.t("btnCheck")} alignment="right" />
                                        <NdCheckBox id="chkAktif" parent={this} value={true}></NdCheckBox>
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
                        <NdCheckBox id="chkMasterBarcode" parent={this} text={this.t("chkMasterBarcode")}  value={true} ></NdCheckBox>
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
                            filterRow={{visible:true}} 
                            headerFilter={{visible:true}}
                            columnAutoWidth={true}
                            allowColumnReordering={true}
                            allowColumnResizing={true}
                            onCellPrepared={(e) =>
                            {
                                if(e.rowType === "data" && e.column.dataField === "MARGIN")
                                {
                                    if(typeof e.data.MARGIN.split("%")[1] != 'undefined' )
                                    {
                                        e.cellElement.style.color = e.data.MARGIN.split("%")[1] < 30 ? "red" : "blue";
                                    }
                                }
                                if(e.rowType === "data" && e.column.dataField === "NETMARGIN")
                                {
                                    if(typeof e.data.NETMARGIN.split("%")[1] != 'undefined' )
                                    {
                                        e.cellElement.style.color = e.data.NETMARGIN.split("%")[1] < 30 ? "red" : "blue";
                                    }
                                }
                            }}
                            onRowDblClick={async(e)=>
                            {
                                App.instance.menuClick(
                                    {
                                        id: 'stk_01_001',
                                        text: e.data.NAME.substring(0,10),
                                        path: '../pages/items/cards/itemCard.js',
                                        pagePrm:{CODE:e.data.CODE}
                                    })
                            }}
                            >                                    
                                <Paging defaultPageSize={15} />
                                <Pager visible={true} allowedPageSizes={[5,10,50]} showPageSizeSelector={true} />

                                <Column dataField="CODE" caption={this.t("grdListe.clmCode")} visible={true}/> 
                                <Column dataField="NAME" caption={this.t("grdListe.clmName")} visible={true} defaultSortOrder="asc" /> 
                                <Column dataField="BARCODE" caption={this.t("grdListe.clmBarcode")} visible={true}/> 
                                <Column dataField="SNAME" caption={this.t("grdListe.clmSname")} visible={false}/> 
                                <Column dataField="MAIN_GRP_NAME" caption={this.t("grdListe.clmMainGrp")} visible={true}/> 
                                <Column dataField="VAT" caption={this.t("grdListe.clmVat")} visible={true}/> 
                                <Column dataField="PRICE_SALE" caption={this.t("grdListe.clmPriceSale")} visible={true}/> 
                                <Column dataField="COST_PRICE" caption={this.t("grdListe.clmCostPrice")} visible={false}/> 
                                <Column dataField="MARGIN" caption={this.t("grdListe.clmMargin")} visible={false}/> 
                                <Column dataField="NETMARGIN" caption={this.t("grdListe.clmNetMargin")} visible={false}/> 
                                <Column dataField="MIN_PRICE" caption={this.t("grdListe.clmMinPrice")} visible={false}/> 
                                <Column dataField="MAX_PRICE" caption={this.t("grdListe.clmMaxPrice")} visible={false}/> 
                                <Column dataField="UNIT_NAME" caption={this.t("grdListe.clmUnit")} visible={false}/> 
                                <Column dataField="MULTICODE" caption={this.t("grdListe.clmMulticode")} visible={true}/> 
                                <Column dataField="CUSTOMER_NAME" caption={this.t("grdListe.clmCustomer")} visible={true}/> 
                                <Column dataField="STATUS" caption={this.t("grdListe.clmStatus")} visible={false}/>                             
                            </NdGrid>
                        </div>
                    </div>
                </ScrollView>
            </div>
        )
    }
}