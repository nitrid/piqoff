import React from 'react';
import App from '../../../lib/app.js';
import {itemsCls} from '../../../lib/cls/itemsCls.js'

import ScrollView from 'devextreme-react/scroll-view';
import Toolbar,{Item} from 'devextreme-react/toolbar';
import Form, { Label } from 'devextreme-react/form';

import NdTextBox from '../../../../core/react/devex/textbox.js'

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
        console.log(this.itemsCls.data)
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
                            <Form colCount={2} id="frmItems">
                                <Item>
                                    <Label text={"Referans "} alignment="right" />
                                        <NdTextBox id="txtRef" parent={this} simple={true}/>
                                </Item>
                                <Item>
                                    <Label text={"Ürün Grubu "} alignment="right" />
                                        <NdTextBox id="txtUrunGrp" parent={this} simple={true}/>
                                </Item>
                                <Item>
                                    <Label text={"Tedarikçi "} alignment="right" />
                                        <NdTextBox id="txtTedarikci" parent={this} simple={true} />
                                </Item>
                                <Item>
                                    <Label text={"Tedarikçi Stok "} alignment="right" />
                                        <NdTextBox id="txtTedarikciStok" parent={this} simple={true} />
                                </Item>
                                <Item>
                                    <Label text={"Barkod "} alignment="right" />
                                        <NdTextBox id="txtBarkod" parent={this} simple={true} />
                                </Item>
                                <Item>
                                    <Label text={"Barkod "} alignment="right" />
                                        <NdTextBox id="txtBarkod" parent={this} simple={true} />
                                </Item>
                            </Form>
                        </div>
                    </div>
                </ScrollView>
            </div>
        )
    }
}