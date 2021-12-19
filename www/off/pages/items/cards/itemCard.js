import React from 'react';
import App from '../../../lib/app.js';
import {itemsCls} from '../../../lib/cls/items.js'

import ScrollView from 'devextreme-react/scroll-view';
import Toolbar from 'devextreme-react/toolbar';
import Form, { Label,Item } from 'devextreme-react/form';
import TabPanel from 'devextreme-react/tab-panel';
import { Button } from 'devextreme-react/button';

import NdTextBox from '../../../../core/react/devex/textbox.js'
import NdSelectBox from '../../../../core/react/devex/selectbox.js';
import NdCheckBox from '../../../../core/react/devex/checkbox.js';
import NdPopGrid from '../../../../core/react/devex/popgrid.js';
import NdPopUp from '../../../../core/react/devex/popup.js';
import NdGrid,{Column,Editing,Paging} from '../../../../core/react/devex/grid.js';
import NdButton from '../../../../core/react/devex/button.js';

export default class itemCard extends React.Component
{
    constructor()
    {
        super()
 
        this.core = App.instance.core;
        this.itemsObj = new itemsCls();
    }
    async componentDidMount()
    {
        await this.core.util.waitUntil(0)
        this.init();          
    }
    async init()
    {
        //await this.itemsCls.getItems() 
        this.itemsObj.clearAll();

        let tmpUnderUnitObj = {...this.itemsObj.itemUnit.empty}
        tmpUnderUnitObj.TYPE = 1
        
        this.itemsObj.addEmpty();
        this.itemsObj.itemUnit.addEmpty();
        this.itemsObj.itemUnit.addEmpty(tmpUnderUnitObj);
        
        //this.itemsObj.dt('ITEM_UNIT').find(x => x.TYPE == 0).TYPE = 1;
        //this.itemsObj.dt('ITEM_UNIT').where({TYPE:0})[0].TYPE = 1
        this.x = this.itemsObj.dt('ITEM_UNIT').where({TYPE:0})
        console.log(this.x)
        //this.itemsObj.dt('ITEM_UNIT').where({TYPE:0})[0].TYPE = 2
        //console.log(this.itemsObj.dt('ITEM_UNIT'))
        //this.itemsObj.dt('ITEMS')[0].CODE = '111'
        //this.dtToForm();
        // this.itemsCls.dt('ITEMS')[0].CODE = 1111
        // this.itemsCls.dt('ITEMS')[0].CODE = 1111222
        // console.log(this.txtRef.value)  
        // await this.itemsCls.getVat()
        // await this.cmbVergi.dataRefresh(
        //     {
        //         source : 
        //         {
        //             select : 
        //             {
        //                 query : "SELECT * FROM [dbo].[VAT] ",
        //             },
        //             sql : this.core.sql
        //         }
        //     })
        //await this.cmbVergi.dataRefresh({source:this.itemsCls.data.get('VAT').toArray()})
    }
    async getItem(pCode)
    {
        this.itemsObj.clearAll();
        await this.itemsObj.load({CODE:pCode});
    }
    render()
    {
        return (
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
                                        icon: 'file',
                                        onClick: async () => 
                                        {
                                            this.init();
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
                                        icon: 'floppy',
                                        onClick: async () => 
                                        {
                                            console.log(this.itemsObj.dt('ITEMS'))
                                            console.log(this.itemsObj.dt('ITEM_UNIT'))
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
                                        icon: 'trash',
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
                                <Item location="after"
                                locateInMenu="auto"
                                widget="dxButton"
                                options=
                                {
                                    {
                                        type: 'default',
                                        icon: 'copy',
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
                                <Item location="after"
                                locateInMenu="auto"
                                widget="dxButton"
                                options=
                                {
                                    {
                                        type: 'default',
                                        icon: 'print',
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
                        <div className="col-9">
                            <Form colCount={2} id="frmItems">
                                <Item>
                                    <Label text={"Referans "} alignment="right" />
                                    <NdTextBox id="txtRef" parent={this} simple={true} dt={this.itemsObj.dt('ITEMS')} dtField={"CODE"}
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
                                                            this.getItem(data[0].CODE)
                                                        }
                                                    }
                                                }
                                            }
                                        ]
                                    }>
                                        <NdPopGrid id={"pg_txtRef"} parent={this} container={".dx-multiview-wrapper"} 
                                        position={{of:'#page'}} 
                                        showTitle={true} 
                                        showBorders={true}
                                        width={'90%'}
                                        height={'90%'}
                                        title={'Stok Seçim'} 
                                        data={{source:{select:{query : "SELECT CODE,NAME FROM ITEMS"},sql:this.core.sql}}}
                                        />
                                    </NdTextBox>
                                </Item>
                                <Item>
                                    <Label text={"Ürün Grubu "} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbUrunGrup" showClearButton={true} dt={this.itemsObj.dt('ITEMS')} dtField={"MAIN_GRP"}
                                    displayExpr="NAME"                       
                                    valueExpr="CODE"
                                    searchEnabled={true}
                                    searchExpr={"NAME"}
                                    data={{source:{select:{query:"SELECT CODE,NAME FROM ITEM_GROUP ORDER BY CODE ASC"},sql:this.core.sql}}}
                                    />
                                </Item>
                                <Item>
                                    <Label text={"Tedarikçi "} alignment="right" />
                                    <NdTextBox id="txtTedarikci" parent={this} simple={true}
                                    button=
                                    {
                                        [
                                            {
                                                id:'001',
                                                icon:'add',
                                                onClick:()=>
                                                {
                                                    this.pop_txtTedarikci.show()                                                    
                                                }
                                            }
                                        ]
                                    }>
                                        <NdPopUp parent={this} id={"pop_txtTedarikci"} 
                                        visible={false}
                                        showCloseButton={true}
                                        showTitle={true}
                                        title={"Tedarikçi Ekle"}
                                        container={".dx-multiview-wrapper"} 
                                        width={'500'}
                                        height={'320'}
                                        position={{of:'#page'}}
                                        >
                                            <Form colCount={1} height={'fit-content'}>
                                                <Item>
                                                    <Label text={"Kodu "} alignment="right" />
                                                    <NdTextBox id={"txtTedKodu"} parent={this} simple={true} />
                                                </Item>
                                                <Item>
                                                    <Label text={"Adı "} alignment="right" />
                                                    <NdTextBox id={"txtTedAdi"} parent={this} simple={true} />
                                                </Item>
                                                <Item>
                                                    <Label text={"Stok Kodu "} alignment="right" />
                                                    <NdTextBox id={"txtTedStokKodu"} parent={this} simple={true} />
                                                </Item>
                                                <Item>
                                                    <Label text={"Fiyat "} alignment="right" />
                                                    <NdTextBox id={"txtTedFiyat"} parent={this} simple={true} />
                                                </Item>
                                                <Item>
                                                    <div className='row'>
                                                        <div className='col-6'>
                                                            <NdButton text="Kaydet" type="normal" stylingMode="contained" width={'100%'}/>
                                                        </div>
                                                        <div className='col-6'>
                                                            <NdButton text="İptal" type="normal" stylingMode="contained" width={'100%'}/>
                                                        </div>
                                                    </div>
                                                </Item>
                                            </Form>
                                        </NdPopUp>
                                    </NdTextBox>
                                </Item>
                                <Item>
                                    <Label text={"Tedarikçi Stok "} alignment="right" />
                                    <NdTextBox id="txtTedarikciStok" parent={this} simple={true} />
                                </Item>
                                <Item>
                                    <Label text={"Barkod "} alignment="right" />
                                    <NdTextBox id="txtBarkod" parent={this} simple={true} popgrid={{id:"001"}}
                                    button={[{id:'001',icon:'add'}]}/>
                                </Item>
                                <Item>
                                    <Label text={"Ürün Cinsi "} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbUrunCins" showClearButton={true} dt={this.itemsObj.dt('ITEMS')} dtField={"TYPE"}
                                    displayExpr="VALUE"                       
                                    valueExpr="ID"
                                    data={{source:{select:{query:"SELECT ID,VALUE FROM ITEM_TYPE ORDER BY ID ASC"},sql:this.core.sql}}}
                                    />
                                </Item>
                                <Item>
                                    <Label text={"Ana Birim "} alignment="right" />
                                    <div className="row">
                                        <div className="col-4 pe-0">
                                            <NdSelectBox simple={true} parent={this} id="cmbAnaBirim" showClearButton={true} height='fit-content' dt={this.x} dtField={"NAME"} dtWhere={{TYPE:0}}
                                            style={{borderTopRightRadius:'0px',borderBottomRightRadius:'0px'}}
                                            displayExpr="NAME"                       
                                            valueExpr="NAME"
                                            data={{source:{select:{query:"SELECT NAME,SYMBOL FROM UNIT ORDER BY ID ASC"},sql:this.core.sql}}}
                                            />
                                        </div>
                                        <div className="col-4 ps-0">
                                            <NdTextBox id="txtAnaBirim" parent={this} simple={true} style={{borderTopLeftRadius:'0px',borderBottomLeftRadius:'0px'}} dt={this.x} dtField={"FACTOR"}/>
                                        </div>
                                    </div>
                                </Item>
                                <Item>
                                    <Label text={"Vergi "} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbVergi" showClearButton={true} height='fit-content' dt={this.itemsObj.dt('ITEMS')} dtField={"VAT"}
                                    displayExpr="VAT"                       
                                    valueExpr="VAT"
                                    data={{source:{select:{query:"SELECT VAT FROM VAT ORDER BY ID ASC"},sql:this.core.sql}}}
                                    />
                                </Item>
                                <Item>
                                    <Label text={"Alt Birim "} alignment="right" />
                                    <div className="row">
                                        <div className="col-4 pe-0">
                                            <NdSelectBox simple={true} parent={this} id="cmbAltBirim" showClearButton={true} height='fit-content' 
                                            style={{borderTopRightRadius:'0px',borderBottomRightRadius:'0px'}}
                                            displayExpr="NAME"                       
                                            valueExpr="NAME"
                                            data={{source:{select:{query:"SELECT NAME,SYMBOL FROM UNIT ORDER BY ID ASC"},sql:this.core.sql}}}
                                            />
                                        </div>
                                        <div className="col-4 ps-0">
                                            <NdTextBox id="txtAltBirim" parent={this} simple={true} style={{borderTopLeftRadius:'0px',borderBottomLeftRadius:'0px'}}/>
                                        </div>
                                    </div>                                     
                                </Item>
                                <Item>
                                    <Label text={"Menşei "} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbMensei" showClearButton={true} height='fit-content' dt={this.itemsObj.dt('ITEMS')} dtField={"ORGINS_GRP"}
                                    displayExpr="NAME"                       
                                    valueExpr="CODE"
                                    data={{source:{select:{query:"SELECT CODE,NAME FROM COUNTRY ORDER BY CODE ASC"},sql:this.core.sql}}}
                                    />
                                </Item>
                                <Item>
                                    <Label text={"Ürün Adı "} alignment="right" />
                                    <NdTextBox id="txtUrunAdi" parent={this} simple={true} dt={this.itemsObj.dt('ITEMS')} dtField={"NAME"}/>
                                </Item>
                                <Item>
                                    <Label text={"Kısa Adı "} alignment="right" />
                                        <NdTextBox id="txtKisaAdi" parent={this} simple={true} dt={this.itemsObj.dt('ITEMS')} dtField={"SNAME"}/>
                                </Item>
                            </Form>
                        </div>
                        <div className="col-3">
                        IMAJ
                        </div>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <Form colCount={6} id="frmChkBox">
                                <Item>
                                    <Label text={"Aktif "} alignment="right" />
                                    <NdCheckBox id="chkAktif" parent={this} defaultValue={true} dt={this.itemsObj.dt('ITEMS')} dtField={"STATUS"}></NdCheckBox>
                                </Item>
                                <Item>
                                    <Label text={"Kasada Tartılsın "} alignment="right" />
                                    <NdCheckBox id="chkKasaTartilsin" parent={this} defaultValue={false} dt={this.itemsObj.dt('ITEMS')} dtField={"WEIGHING"}></NdCheckBox>
                                </Item>
                                <Item>
                                    <Label text={"Satış da Satır Birleştir "} alignment="right" />
                                    <NdCheckBox id="chkSatisBirlestir" parent={this} defaultValue={false} dt={this.itemsObj.dt('ITEMS')} dtField={"SALE_JOIN_LINE"}></NdCheckBox>
                                </Item>
                                <Item>
                                    <Label text={"Ticket Rest. "} alignment="right" />
                                    <NdCheckBox id="chkTicketRest" parent={this} defaultValue={false} dt={this.itemsObj.dt('ITEMS')} dtField={"TICKET_REST"}></NdCheckBox>
                                </Item>
                            </Form>
                        </div>
                    </div>
                    <div className='row px-2 pt-2'>
                        <div className='col-12'>
                            <TabPanel height="100%">
                                <Item title="Fiyat">
                                    <div className='row px-2 py-2'>
                                        <div className='col-2'>
                                            <NdTextBox id="txtMaliyetFiyat" parent={this} title={"Maliyet Fiyatı"} titleAlign={"top"} dt={this.itemsObj.dt('ITEMS')} dtField={"COST_PRICE"}/>
                                        </div>
                                        <div className='col-2'>
                                            <NdTextBox id="txtMinSatisFiyat" parent={this} title={"Min. Satış Fiyatı"} titleAlign={"top"} dt={this.itemsObj.dt('ITEMS')} dtField={"MIN_PRICE"}/>
                                        </div>
                                        <div className='col-2'>
                                            <NdTextBox id="txtMaxSatisFiyat" parent={this} title={"Max. Satış Fiyatı"} titleAlign={"top"} dt={this.itemsObj.dt('ITEMS')} dtField={"MAX_PRICE"}/>
                                        </div>
                                        <div className='col-2'>
                                            <NdTextBox id="txtSonAlisFiyat" parent={this} title={"Son Alış Fiyatı"} titleAlign={"top"}/>
                                        </div>
                                        <div className='col-4'>
                                            <Toolbar>
                                                <Item location="after">
                                                    <Button icon="add"/>
                                                </Item>
                                            </Toolbar>
                                        </div>
                                    </div>
                                    <div className='row px-2 py-2'>
                                        <div className='col-12'>
                                            <NdGrid parent={this} id={"grdFiyat"} 
                                            data={{source:{select:{query : "SELECT TOP 20 TYPE_NAME,DEPOT,START_DATE,FINISH_DATE,QUANTITY,0 AS VAT_EXT,CUSTOMER_NAME,PRICE,0 AS GROSS_MARGIN,0 AS NET_MARGIN FROM ITEM_PRICE_VW_01"},sql:this.core.sql}}}
                                            showBorders={true} 
                                            columnsAutoWidth={true} 
                                            allowColumnReordering={true} 
                                            allowColumnResizing={true} 
                                            height={'100%'} 
                                            width={'100%'}
                                            >
                                                <Paging defaultPageSize={5} />
                                                <Editing mode="cell" allowUpdating={true} allowDeleting={true} />
                                                <Column dataField="TYPE_NAME" caption="Tip" />
                                                <Column dataField="DEPOT" caption="Depo" />
                                                <Column dataField="START_DATE" caption="Baş.Tarih" dataType="date"/>
                                                <Column dataField="FINISH_DATE" caption="Bit.Tarih" dataType="date"/>
                                                <Column dataField="QUANTITY" caption="Miktar"/>
                                                <Column dataField="VAT_EXT" caption="Vergi Hariç" dataType="number" format={{ style: "currency", currency: "EUR",precision: 2}}/>
                                                <Column dataField="CUSTOMER_NAME" caption="Cari"/>
                                                <Column dataField="PRICE" caption="Fiyat" dataType="number" format={{ style: "currency", currency: "EUR",precision: 2}}/>
                                                <Column dataField="GROSS_MARGIN" caption="Brüt Marj" dataType="number" format={{ style: "currency", currency: "EUR",precision: 2}}/>
                                                <Column dataField="NET_MARGIN" caption="Net Marj" dataType="number" format={{ style: "currency", currency: "EUR",precision: 2}}/>
                                            </NdGrid>
                                        </div>
                                    </div>
                                </Item>
                                <Item title="Birim">
                                    <div className='row px-2 py-2'>
                                        <div className='col-2'>
                                            <NdTextBox id="txtAltBirimFiyat" parent={this} title={"Alt Birim Fiyatı"} titleAlign={"top"}/>
                                        </div>
                                        <div className='col-10'>
                                            <Toolbar>
                                                <Item location="after">
                                                    <Button icon="add"/>
                                                </Item>
                                            </Toolbar>
                                        </div>
                                    </div>
                                    <div className='row px-2 py-2'>
                                        <div className='col-12'>
                                            <NdGrid parent={this} id={"grdBirim"} 
                                            data={{source:{select:{query : "SELECT TOP 20 TYPE_NAME,NAME,FACTOR,WEIGHT,VOLUME,WIDTH,HEIGHT,SIZE FROM ITEM_UNIT_VW_01"},sql:this.core.sql}}}
                                            showBorders={true} 
                                            columnsAutoWidth={true} 
                                            allowColumnReordering={true} 
                                            allowColumnResizing={true} 
                                            height={'100%'} 
                                            width={'100%'}
                                            >
                                                <Paging defaultPageSize={5} />
                                                <Editing mode="cell" allowUpdating={true} allowDeleting={true} />
                                                <Column dataField="TYPE_NAME" caption="Tip" />
                                                <Column dataField="NAME" caption="Adı" />
                                                <Column dataField="FACTOR" caption="Katsayı"/>
                                                <Column dataField="WEIGHT" caption="Ağırlık"/>
                                                <Column dataField="VOLUME" caption="Hacim"/>
                                                <Column dataField="WIDTH" caption="En"/>
                                                <Column dataField="HEIGHT" caption="Boy"/>
                                                <Column dataField="SIZE" caption="Yükseklik"/>
                                            </NdGrid>
                                        </div>
                                    </div>
                                </Item>
                                <Item title="Barkod">
                                    <div className='row px-2 py-2'>
                                        <div className='col-12'>
                                            <Toolbar>
                                                <Item location="after">
                                                    <Button icon="add"/>
                                                </Item>
                                            </Toolbar>
                                        </div>
                                    </div>
                                    <div className='row px-2 py-2'>
                                        <div className='col-12'>
                                            <NdGrid parent={this} id={"grdBarkod"} 
                                            data={{source:{select:{query : "SELECT TOP 20 BARCODE,UNIT_NAME,TYPE FROM ITEM_BARCODE_VW_01"},sql:this.core.sql}}}
                                            showBorders={true} 
                                            columnsAutoWidth={true} 
                                            allowColumnReordering={true} 
                                            allowColumnResizing={true} 
                                            height={'100%'} 
                                            width={'100%'}
                                            >
                                                <Paging defaultPageSize={5} />
                                                <Editing mode="cell" allowUpdating={true} allowDeleting={true} />
                                                <Column dataField="BARCODE" caption="Barkod" />
                                                <Column dataField="UNIT_NAME" caption="Birim" />
                                                <Column dataField="TYPE" caption="Tip"/>
                                            </NdGrid>
                                        </div>
                                    </div>
                                </Item>
                                <Item title="Tedarikçi">
                                    <div className='row px-2 py-2'>
                                        <div className='col-2'>
                                            <NdTextBox id="txtMinAlisFiyat" parent={this} title={"Min. Alış Fiyatı"} titleAlign={"top"}/>
                                        </div>
                                        <div className='col-2'>
                                            <NdTextBox id="txtMaxAlisFiyat" parent={this} title={"Max. Alış Fiyatı"} titleAlign={"top"}/>
                                        </div>
                                        <div className='col-8'>
                                            <Toolbar>
                                                <Item location="after">
                                                    <Button icon="add"/>
                                                </Item>
                                            </Toolbar>
                                        </div>
                                    </div>
                                    <div className='row px-2 py-2'>
                                        <div className='col-12'>
                                            <NdGrid parent={this} id={"grdTedarikci"} 
                                            data={{source:{select:{query : "SELECT TOP 20 [CUSTOMER_CODE],[CUSTOMER_NAME],[MULTICODE],[CUSTOMER_ITEM_PRICE],[CUSTOMER_ITEM_PRICE_DATE] FROM [ITEM_MULTICODE_VW_01]"},sql:this.core.sql}}}
                                            showBorders={true} 
                                            columnsAutoWidth={true} 
                                            allowColumnReordering={true} 
                                            allowColumnResizing={true} 
                                            height={'100%'} 
                                            width={'100%'}
                                            >
                                                <Paging defaultPageSize={5} />
                                                <Editing mode="cell" allowUpdating={true} allowDeleting={true} />
                                                <Column dataField="CUSTOMER_CODE" caption="Kodu" />
                                                <Column dataField="CUSTOMER_NAME" caption="Adı" />
                                                <Column dataField="CUSTOMER_ITEM_PRICE_DATE" caption="Son Fiyat Tarih" allowEditing={false} dataType="date"/>
                                                <Column dataField="CUSTOMER_ITEM_PRICE" caption="Fiyat" allowEditing={false} dataType="number" format={{ style: "currency", currency: "EUR",precision: 2}}/>
                                                <Column dataField="MULTICODE" caption="Tedarikçi Stok Kodu" />
                                            </NdGrid>
                                        </div>
                                    </div>
                                </Item>
                                <Item title="Bilgi"></Item>
                            </TabPanel>
                        </div>
                    </div>
                </ScrollView>
            </div>
        )
    }
}