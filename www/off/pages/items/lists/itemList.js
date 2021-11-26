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

export default class itemList extends React.Component
{
    constructor(props)
    {
        super(props)

        this.state = 
        {
            columnListValue : ['NAME','CODE','BARCODE','MULTICODE','CUSTOMER_NAME']
        }
        
        this.core = App.instance.core;
        this.columnListData = 
        [
            {CODE : "NAME",NAME : "ÜRÜN TAM ADI"},
            {CODE : "SNAME",NAME : "ÜRÜN KISA ADI"},
            {CODE : "MAIN_GRP_NAME",NAME : "ÜRÜN GRUBU"},                                   
            {CODE : "UNIT_NAME",NAME : "BİRİM"},
            {CODE : "CODE",NAME : "ÜRÜN KODU"},
            {CODE : "BARCODE",NAME : "BARKODU"},
            {CODE : "MULTICODE",NAME : "TEDARİKÇİ ÜRÜN KODU"},
            //{CODE : "CUSTOMER_ITEM_PRICE",NAME : db.Language($scope.Lang,"TEDARİKÇİ ÜRÜN FİYATI")},
            {CODE : "CUSTOMER_NAME",NAME : "TEDARİKÇİ"},
            {CODE : "COST_PRICE",NAME : "MALİYET FİYATI"},
            //{CODE : "PRICE",NAME : db.Language($scope.Lang,"SATIŞ FİYATI")},    
            {CODE : "VAT",NAME : "VERGİ DİLİMİ"},         
            //{CODE : "BRUTMARJ",NAME : db.Language($scope.Lang,"BRUTMARJ")},
            //{CODE : "NETMARJ",NAME : db.Language($scope.Lang,"NETMARJ")},
            {CODE : "MIN_PRICE",NAME : "MİNİMUM SATIŞ FİYATI"},
            {CODE : "MAX_PRICE",NAME : "MAKSİMUM SATIŞ FİYATI"},
            {CODE : "STATUS",NAME : "DURUM"}
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
        let TmpVal = ""
        
        for (let i = 0; i < this.txtBarkod.value.split(' ').length; i++) 
        {
            TmpVal += "'" + this.txtBarkod.value.split(' ')[i] + "'"
            if(this.txtBarkod.value.split(' ').length > 1 && i !=  (this.txtBarkod.value.split(' ').length - 1))
            {
                TmpVal += ","
            }
        }
        
        let tmpSource =
        {
            source : 
            {
                groupBy : this.groupList,
                select : 
                {
                    query : "SELECT * FROM ITEMS_BARCODE_MULTICODE_VW_01 " +
                            "WHERE {0} " +
                            "((NAME = @NAME) OR (@NAME = '')) AND " +
                            "((MAIN_GRP = @MAIN_GRP) OR (@MAIN_GRP = '')) AND " +
                            "((CUSTOMER_CODE = @CUSTOMER_CODE) OR (@CUSTOMER_CODE = ''))",
                    param : ['NAME:string|250','MAIN_GRP:string|25','CUSTOMER_CODE:string|25'],
                    value : [this.txtUrunAdi.value,this.cmbUrunGrup.value,this.cmbTedarikci.value]
                },
                sql : this.core.sql
            }
        }
        
        if(this.txtBarkod.value == '')
        {
            tmpSource.source.select.query = tmpSource.source.select.query.replaceAll("{0}", "")
        }
        else if(this.txtBarkod.value.split(' ').length > 1)
        {
            tmpSource.source.select.query = tmpSource.source.select.query.replaceAll("{0}", "((CODE IN (" + TmpVal + ")) OR (BARCODE IN (" + TmpVal + ")) OR (MULTICODE IN (" + TmpVal + "))) AND")
        }
        else
        {
            tmpSource.source.select.query = tmpSource.source.select.query.replaceAll("{0}", "((CODE LIKE " + TmpVal + " + '%') OR (BARCODE LIKE " + TmpVal + " + '%') OR (MULTICODE LIKE " + TmpVal + " + '%')) AND")
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
                                        icon: 'add',
                                        onClick: async () => 
                                        {
                                            App.instance.menuClick(
                                            {
                                                id: 'stk_01_001',
                                                text: 'Stok Tanımları',
                                                path: '../pages/items/cards/itemCard.js'
                                            })
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
                                    <Label text={"Barkod "} alignment="right" />
                                        <NdTextBox id="txtBarkod" parent={this} simple={true} />
                                </Item>
                                <Item>
                                    <Label text={"Tedarikçi "} alignment="right" />
                                        <NdSelectBox simple={true} parent={this} id="cmbTedarikci" showClearButton={true}
                                        displayExpr="NAME"                       
                                        valueExpr="CODE"
                                        data={{source: {select : {query:"SELECT CODE,NAME FROM CUSTOMERS WHERE TYPE = 1 ORDER BY NAME ASC"},sql : this.core.sql}}}
                                        // onValueChanged={onValueChanged}
                                        />
                                </Item>
                                <Item>
                                    <Label text={"Ürün Adı "} alignment="right" />
                                        <NdTextBox id="txtUrunAdi" parent={this} simple={true} />
                                </Item>
                                <Item>
                                    <Label text={"Ürün Grubu "} alignment="right" />
                                        <NdSelectBox simple={true} parent={this} id="cmbUrunGrup" showClearButton={true}
                                        displayExpr="NAME"                       
                                        valueExpr="CODE"
                                        data={{source: {select : {query:"SELECT CODE,NAME FROM ITEM_GROUP ORDER BY NAME ASC"},sql : this.core.sql}}}
                                        // onValueChanged={onValueChanged}
                                        />
                                </Item>
                                <Item> </Item>
                                <Item>
                                    <Label text={"Aktif "} alignment="right" />
                                        <NdCheckBox id="chkAktif" parent={this} defaultValue={true}></NdCheckBox>
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
                            <NdButton text="Getir" type="success" width="100%" onClick={this._btnGetirClick}></NdButton>
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
                            >                            
                                <Paging defaultPageSize={20} />
                                <Pager visible={true} allowedPageSizes={[5,10,50]} showPageSizeSelector={true} />

                                <Column dataField="CODE" caption="ÜRÜN KODU" visible={true}/> 
                                <Column dataField="NAME" caption="ÜRÜN TAM ADI" visible={true}/> 
                                <Column dataField="BARCODE" caption="BARKODU" visible={true}/> 
                                <Column dataField="SNAME" caption="ÜRÜN KISA ADI" visible={false}/> 
                                <Column dataField="MAIN_GRP_NAME" caption="ÜRÜN GRUBU" visible={false}/> 
                                <Column dataField="VAT" caption="VERGİ DİLİMİ" visible={false}/> 
                                <Column dataField="COST_PRICE" caption="MALİYET FİYATI" visible={false}/> 
                                <Column dataField="MIN_PRICE" caption="MİNİMUM SATIŞ FİYATI" visible={false}/> 
                                <Column dataField="MAX_PRICE" caption="MAKSİMUM SATIŞ FİYATI" visible={false}/> 
                                <Column dataField="UNIT_NAME" caption="BİRİM" visible={false}/> 
                                {/* <Column dataField="CODE" caption="SATIŞ FİYATI"/>  */}
                                <Column dataField="MULTICODE" caption="TEDARİKÇİ ÜRÜN KODU" visible={true}/> 
                                {/* <Column dataField="CODE" caption="TEDARİKÇİ ÜRÜN FİYATI"/>  */}
                                <Column dataField="CUSTOMER_NAME" caption="TEDARİKÇİ" visible={true}/> 
                                <Column dataField="STATUS" caption="DURUM" visible={false}/>                             
                            </NdGrid>
                        </div>
                    </div>
                </ScrollView>
            </div>
        )
    }
}