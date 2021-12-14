import React from 'react';
import App from '../../../lib/app.js';
import {itemsCls} from '../../../lib/cls/itemsCls.js'

import ScrollView from 'devextreme-react/scroll-view';
import Toolbar,{Item} from 'devextreme-react/toolbar';
import Form, { Label } from 'devextreme-react/form';

import NdTextBox from '../../../../core/react/devex/textbox.js'
import NdSelectBox from '../../../../core/react/devex/selectbox.js';
import NdCheckBox from '../../../../core/react/devex/checkbox.js';

export default class itemCard extends React.Component
{
    constructor()
    {
        super()
 
        this.core = App.instance.core;
        this.itemsCls = new itemsCls();
        
    }
    async componentDidMount()
    {
        await this.itemsCls.load('') 
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
                                        icon: 'floppy',
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
                                    <NdTextBox id="txtRef" parent={this} simple={true} 
                                    button=
                                    {
                                        [
                                            {
                                                id:'001',
                                                icon:'more'
                                            },
                                            {
                                                id:'002',
                                                icon:'add'
                                            }
                                        ]
                                    }>
                                        <div>Ekrem</div>
                                    </NdTextBox>
                                </Item>
                                <Item>
                                    <Label text={"Ürün Grubu "} alignment="right" />
                                    <NdTextBox id="txtUrunGrp" parent={this} simple={true} popgrid={{id:"001"}}/>
                                </Item>
                                <Item>
                                    <Label text={"Tedarikçi "} alignment="right" />
                                    <NdTextBox id="txtTedarikci" parent={this} simple={true} popgrid={{id:"001"}}/>
                                </Item>
                                <Item>
                                    <Label text={"Tedarikçi Stok "} alignment="right" />
                                    <NdTextBox id="txtTedarikciStok" parent={this} simple={true} />
                                </Item>
                                <Item>
                                    <Label text={"Barkod "} alignment="right" />
                                    <NdTextBox id="txtBarkod" parent={this} simple={true} popgrid={{id:"001"}}/>
                                </Item>
                                <Item>
                                    <Label text={"Ürün Cinsi "} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbUrunCins" showClearButton={true}
                                    displayExpr="NAME"                       
                                    valueExpr="CODE"
                                    />
                                </Item>
                                <Item>
                                    <Label text={"Ana Birim "} alignment="right" />
                                    <div className="row">
                                        <div className="col-4 pe-0">
                                            <NdSelectBox simple={true} parent={this} id="cmbAnaBirim" showClearButton={true} height='fit-content' 
                                            style={{borderTopRightRadius:'0px',borderBottomRightRadius:'0px'}}
                                            displayExpr="NAME"                       
                                            valueExpr="CODE"
                                            />
                                        </div>
                                        <div className="col-4 ps-0">
                                            <NdTextBox id="txtAnaBirim" parent={this} simple={true} style={{borderTopLeftRadius:'0px',borderBottomLeftRadius:'0px'}}/>
                                        </div>
                                    </div>
                                </Item>
                                <Item>
                                    <Label text={"Vergi "} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbVergi" showClearButton={true} height='fit-content'
                                    displayExpr="NAME"                       
                                    valueExpr="CODE"
                                    />
                                </Item>
                                <Item>
                                    <Label text={"Alt Birim "} alignment="right" />
                                    <div className="row">
                                        <div className="col-4 pe-0">
                                            <NdSelectBox simple={true} parent={this} id="cmbAltBirim" showClearButton={true} height='fit-content' 
                                            style={{borderTopRightRadius:'0px',borderBottomRightRadius:'0px'}}
                                            displayExpr="NAME"                       
                                            valueExpr="CODE"
                                            />
                                        </div>
                                        <div className="col-4 ps-0">
                                            <NdTextBox id="txtAltBirim" parent={this} simple={true} style={{borderTopLeftRadius:'0px',borderBottomLeftRadius:'0px'}}/>
                                        </div>
                                    </div>                                     
                                </Item>
                                <Item>
                                    <Label text={"Menşei "} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbMensei" showClearButton={true} height='fit-content'
                                    displayExpr="NAME"                       
                                    valueExpr="CODE"
                                    />
                                </Item>
                                <Item>
                                    <Label text={"Ürün Adı "} alignment="right" />
                                    <NdTextBox id="txtUrunAdi" parent={this} simple={true} />
                                </Item>
                                <Item>
                                    <Label text={"Aktif "} alignment="right" />
                                    <NdCheckBox id="chkAktif" parent={this} defaultValue={true}></NdCheckBox>
                                </Item>
                                <Item>
                                    <Label text={"Kısa Adı "} alignment="right" />
                                        <NdTextBox id="txtKisaAdi" parent={this} simple={true} />
                                </Item>
                                <Item>
                                    <Label text={"Kasada Tartılsın "} alignment="right" />
                                    <NdCheckBox id="chkKasaTartilsin" parent={this} defaultValue={false}></NdCheckBox>
                                </Item>
                                <Item>
                                    <Label text={"Şeker Oranı "} alignment="right" />
                                        <NdTextBox id="txtSekerOrani" parent={this} simple={true} />
                                </Item>
                                <Item>
                                    <Label text={"Satış da Satır Birleştir "} alignment="right" />
                                    <NdCheckBox id="chkSatisBirlestir" parent={this} defaultValue={false}></NdCheckBox>
                                </Item>
                                <Item> </Item>
                                <Item>
                                    <Label text={"Ticket Rest. "} alignment="right" />
                                    <NdCheckBox id="chkTicketRest" parent={this} defaultValue={false}></NdCheckBox>
                                </Item>
                            </Form>
                        </div>
                        <div className="col-3">
                        IMAJ
                        </div>
                    </div>
                </ScrollView>
            </div>
        )
    }
}