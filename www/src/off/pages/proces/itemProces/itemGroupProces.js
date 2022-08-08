import React from 'react';
import App from '../../../lib/app.js';
import moment from 'moment';

import Toolbar,{Item} from 'devextreme-react/toolbar';
import Form, { Label } from 'devextreme-react/form';
import ScrollView from 'devextreme-react/scroll-view';

import NdGrid,{Column,Editing, ColumnChooser,ColumnFixing,Paging,Pager,Scrolling,Export} from '../../../../core/react/devex/grid.js';
import NdTextBox from '../../../../core/react/devex/textbox.js'
import NdSelectBox from '../../../../core/react/devex/selectbox.js';
import NdDropDownBox from '../../../../core/react/devex/dropdownbox.js';
import NdButton from '../../../../core/react/devex/button.js';
import NdCheckBox from '../../../../core/react/devex/checkbox.js';
import NdTagBox from '../../../../core/react/devex/tagbox.js';
import { dialog } from '../../../../core/react/devex/dialog.js';


export default class itemList extends React.PureComponent
{
    constructor(props)
    {
        super(props)

        this.prmObj = this.param.filter({TYPE:1,USERS:this.user.CODE});
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
            {CODE : "PRICE_SALE",NAME :  this.t("grdListe.clmPriceSale")},
        ]
        this.groupList = [];
        this._btnGetirClick = this._btnGetirClick.bind(this)
        this._updateGroup = this._updateGroup.bind(this)
    }
    componentDidMount()
    {
        
        setTimeout(async () => 
        {
           
        }, 1000);
    }
    async _updateGroup()
    {
        let tmpConfObj =
        {
            id:'msgClose',showTitle:true,title:this.t("msgWarning.title"),showCloseButton:true,width:'500px',height:'200px',
            button:[{id:"btn01",caption:this.t("msgWarning.btn01"),location:'before'},{id:"btn02",caption:this.t("msgWarning.btn02"),location:'after'}],
            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgWarning.msg")}</div>)
        }
        
        let pResult = await dialog(tmpConfObj);
        if(pResult == 'btn01')
        {
            return
        }

        for (let i = 0; i < this.grdListe.getSelectedData().length; i++) 
        {
            let tmpQuery = 
            {
                query :"UPDATE ITEMS_GRP SET MAIN = @MAIN WHERE ITEM = @ITEM ",
                param : ['MAIN:string|25','ITEM:string|50'],
                value : [this.cmbItemGrp.value,this.grdListe.getSelectedData()[i].GUID]
            }
            let tmpData = await this.core.sql.execute(tmpQuery) 
        }
        let tmpConfObj1 =
        {
            id:'msgSaveResult',showTitle:true,title:this.t("msgSave.title"),showCloseButton:true,width:'500px',height:'200px',
            button:[{id:"btn01",caption:this.t("msgSave.btn01"),location:'after'}],
        }
        tmpConfObj1.content = (<div style={{textAlign:"center",fontSize:"20px",color:"green"}}>{this.t("msgSaveResult.msgSuccess")}</div>)
        await dialog(tmpConfObj1);
        this._btnGetirClick()
       
    }
    async _btnGetirClick()
    {
        if(this.txtUrunAdi.value != '' && this.txtUrunAdi.value.slice(-1) != '*')
        {
            let tmpUrunAdi = this.txtUrunAdi.value + '*'
            this.txtUrunAdi.setState({value:tmpUrunAdi})
        }
        
      
        let tmpSource =
        {
            source : 
            {
                groupBy : this.groupList,
                select : 
                {
                    query : "SELECT GUID,CODE,NAME,SNAME,MAIN_GRP_NAME,VAT,PRICE_SALE,MAIN_UNIT_NAME AS UNIT_NAME " + 
                            "FROM ITEMS_EDIT_VW_01 " +
                            "WHERE {0}" +
                            "((NAME LIKE @NAME +'%') OR (@NAME = '')) AND " +
                            "((MAIN_GRP = @MAIN_GRP) OR (@MAIN_GRP = '')) AND " +
                            "((CUSTOMER_CODE = @CUSTOMER_CODE) OR (@CUSTOMER_CODE = '')) " + 
                            " GROUP BY  GUID,CODE,NAME,SNAME,MAIN_GRP_NAME,VAT,PRICE_SALE,MAIN_UNIT_NAME",
                    param : ['NAME:string|250','MAIN_GRP:string|25','CUSTOMER_CODE:string|25'],
                    value : [this.txtUrunAdi.value.replaceAll("*", "%"),this.cmbUrunGrup.value,this.cmbTedarikci.value]
                },
                sql : this.core.sql
            }
        }
        
        if(this.txtBarkod.value.length == 0)
        {
            tmpSource.source.select.query = tmpSource.source.select.query.replaceAll("{0}", "{1}")
        }
        else if(this.txtBarkod.value.length == 1)
        {
            tmpSource.source.select.query = tmpSource.source.select.query.replaceAll("{0}", "((CODE LIKE '" + this.txtBarkod.value[0] + "' + '%') OR (BARCODE LIKE '" + this.txtBarkod.value[0] + "' + '%') {1}) AND")
        }
        else
        {
            let TmpVal = ''
            for (let i = 0; i < this.txtBarkod.value.length; i++) 
            {
                TmpVal = TmpVal + ",'" + this.txtBarkod.value[i] + "'"
                
            }
            tmpSource.source.select.query = tmpSource.source.select.query.replaceAll("{0}", "((CODE IN (" + TmpVal.substring(1,TmpVal.length) + ")) OR (BARCODE IN (" + TmpVal.substring(1,TmpVal.length) + ")) {1}) AND")
        }
        if(this.txtMulticode.value.length == 0)
        {
            
            tmpSource.source.select.query = tmpSource.source.select.query.replaceAll("{1}", "")
        }
        else if(this.txtMulticode.value.length == 1)
        {
            if(this.txtBarkod.value.length == 0)
            {
                tmpSource.source.select.query = tmpSource.source.select.query.replaceAll("{1}", " (MULTICODE = '" + this.txtMulticode.value[0] + "') AND")
            }
            else
            {
                tmpSource.source.select.query = tmpSource.source.select.query.replaceAll("{1}", "OR (MULTICODE = '" + this.txtMulticode.value[0] + "')")
            }
        }
        else
        {
            let tmpMultiCode = ''
            for (let i = 0; i < this.txtMulticode.value.length; i++) 
            {
                tmpMultiCode = tmpMultiCode + ",'" + this.txtMulticode.value[i] + "'"
                
            }
            if(this.txtBarkod.value.length == 0)
            {
                tmpSource.source.select.query = tmpSource.source.select.query.replaceAll("{1}", " (MULTICODE IN (" + tmpMultiCode.substring(1,tmpMultiCode.length) + ")) AND")
            }
            else
            {
                tmpSource.source.select.query = tmpSource.source.select.query.replaceAll("{1}", "OR (MULTICODE IN (" + tmpMultiCode.substring(1,tmpMultiCode.length) + ")) ")
            }
            
        }
        await this.grdListe.dataRefresh(tmpSource)
        let tmpDatas = this.prmObj.filter({ID:'emptyCode',USERS:this.user.CODE}).getValue()
        if(typeof tmpDatas != 'undefined' && tmpDatas.value ==  true)
        {
            for (let i = 0; i < this.txtBarkod.value.length; i++) 
            {
                let TmpData = this.grdListe.data.datatable.find((item) => item.CODE === this.txtBarkod.value[i] || item.BARCODE === this.txtBarkod.value[i]);
                if(typeof TmpData == 'undefined')
                {
                    this.grdListe.data.datatable.push({CODE:this.txtBarkod.value[i]})
                }
            }
            for (let i = 0; i < this.txtMulticode.value.length; i++) 
            {
                let TmpMultiData = this.grdListe.data.datatable.find((item) => item.MULTICODE === this.txtMulticode.value[i]);
                if(typeof TmpMultiData == 'undefined')
                {
                    this.grdListe.data.datatable.push({MULTICODE:this.txtMulticode.value[i]})
                }
            }
            this.grdListe.dataRefresh(this.grdListe.data.datatable)
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
                                                text: 'Stok Tanımları',
                                                path: 'items/cards/itemCard.js'
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
                                        <NdTagBox id="txtBarkod" parent={this} simple={true} value={[]} placeholder={this.t("barkodPlaceHolder")}
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
                                        <NdTextBox id="txtUrunAdi" parent={this} simple={true} onEnterKey={this._btnGetirClick} placeholder={this.t("ItemNamePlaceHolder")}
                                        upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}/>
                                </Item>
                                <Item>
                                    <Label text={this.t("cmbMainGrp")} alignment="right" />
                                        <NdSelectBox simple={true} parent={this} id="cmbUrunGrup" showClearButton={true} notRefresh={true}  searchEnabled={true}
                                        displayExpr="NAME"                       
                                        valueExpr="CODE"
                                        data={{source: {select : {query:"SELECT CODE,NAME FROM ITEM_GROUP ORDER BY NAME ASC"},sql : this.core.sql}}}
                                        />
                                </Item>
                                <Item>
                                    <Label text={this.t("txtMulticode")} alignment="right" />
                                        <NdTagBox id="txtMulticode" parent={this} simple={true} value={[]} placeholder={this.t("multicodePlaceHolder")}
                                        />
                                </Item>
                            </Form>
                        </div>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-3">
                            <NdButton text={this.t("btnGet")} type="success" width="100%" onClick={this._btnGetirClick}></NdButton>
                        </div>
                        <div className="col-3">
                        </div>
                        <div className="col-3">
                              {/* cmbItemGrp */}
                                
                                <NdSelectBox id="cmbItemGrp" simple={true} parent={this} text={this.t("chkMasterBarcode")}
                                displayExpr="NAME"                       
                                valueExpr="CODE"
                                value=""
                                searchEnabled={true} 
                                showClearButton={true}
                                pageSize ={50}
                                notRefresh={true}
                                data={{source:{select:{query : "SELECT CODE,NAME FROM ITEM_GROUP ORDER BY NAME ASC"},sql:this.core.sql}}}
                                onValueChanged={(e)=>
                                {
                                  
                                }}
                                />
                        </div>
                        <div className="col-3">
                        <   NdButton text={this.t("btnOk")} type="default" width="100%" onClick={this._updateGroup}></NdButton>
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
                            loadPanel={{enabled:true}}
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
                                        path: 'items/cards/itemCard.js',
                                        pagePrm:{CODE:e.data.CODE}
                                    })
                            }}
                            >                                    
                                <Paging defaultPageSize={15} />
                                <Pager visible={true} allowedPageSizes={[5,10,50]} showPageSizeSelector={true} />
                                <Editing mode="cell" allowUpdating={false} allowDeleting={false} />
                                <Export fileName={this.lang.t("menu.stk_03_001")} enabled={true} allowExportSelectedData={true} />
                                <Column dataField="CODE" caption={this.t("grdListe.clmCode")} visible={true}/> 
                                <Column dataField="NAME" caption={this.t("grdListe.clmName")} visible={true} defaultSortOrder="asc" /> 
                                <Column dataField="BARCODE" caption={this.t("grdListe.clmBarcode")} visible={true}/> 
                                <Column dataField="SNAME" caption={this.t("grdListe.clmSname")} visible={false}/> 
                                <Column dataField="MAIN_GRP_NAME" caption={this.t("grdListe.clmMainGrp")} visible={true}/> 
                                <Column dataField="VAT" caption={this.t("grdListe.clmVat")} visible={true}/> 
                                <Column dataField="PRICE_SALE" caption={this.t("grdListe.clmPriceSale")} visible={true}/>               
                            </NdGrid>
                        </div>
                    </div>
                </ScrollView>
            </div>
        )
    }
}