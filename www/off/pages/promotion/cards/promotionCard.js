import React from 'react';
import App from '../../../lib/app.js';
import {promotionCls} from '../../../lib/cls/promotion.js'

import ScrollView from 'devextreme-react/scroll-view';
import Toolbar from 'devextreme-react/toolbar';
import Form, { Label,Item } from 'devextreme-react/form';
import { Button } from 'devextreme-react/button';

import NdTextBox, { Validator, NumericRule, RequiredRule, CompareRule, EmailRule, PatternRule, StringLengthRule, RangeRule, AsyncRule } from '../../../../core/react/devex/textbox.js'
import NdNumberBox from '../../../../core/react/devex/numberbox.js';
import NdSelectBox from '../../../../core/react/devex/selectbox.js';
import NdCheckBox from '../../../../core/react/devex/checkbox.js';
import NdPopGrid from '../../../../core/react/devex/popgrid.js';
import NdPopUp from '../../../../core/react/devex/popup.js';
import NdGrid,{Column,Editing,Paging,Scrolling} from '../../../../core/react/devex/grid.js';
import NdButton from '../../../../core/react/devex/button.js';
import NdDatePicker from '../../../../core/react/devex/datepicker.js';
import { dialog } from '../../../../core/react/devex/dialog.js';

export default class promotionCard extends React.Component
{
    constructor()
    {
        super()                
        this.core = App.instance.core;
        this.prmObj = this.param.filter({TYPE:1,USERS:this.user.CODE});

        this.promoObj = new promotionCls();
    }   
    async componentDidMount()
    {
        await this.core.util.waitUntil(0)
        this.init(); 
    }  
    async init()
    {
        this.promoObj.clearAll();
    }
    render()
    {
        return (
            <div>
                <ScrollView>
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <Toolbar>
                                <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnNew" parent={this} icon="file" type="default"
                                    onClick={()=>
                                    {
                                    }}/>
                                </Item>
                                <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnSave" parent={this} icon="floppy" type="default" validationGroup="frmItems"
                                    onClick={async (e)=>
                                    {
                                    }}/>
                                </Item>
                                <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnDelete" parent={this} icon="trash" type="default"
                                    onClick={async()=>
                                    {
                                    }}/>
                                </Item>
                            </Toolbar>
                        </div>
                    </div>
                    <div className="row px-2 pt-2"> 
                        <div className="col-12">
                            <Form colCount={3} id="frmPromo">
                                {/* txtCode */}
                                <Item>                                    
                                    <Label text={this.t("txtCode")} alignment="right" />
                                    <NdTextBox id="txtCode" parent={this} simple={true} 
                                    button=
                                    {
                                        [
                                            {
                                                id:'01',
                                                icon:'more',
                                                onClick:()=>
                                                {
                                                }
                                            },
                                            {
                                                id:'02',
                                                icon:'arrowdown',
                                                onClick:()=>
                                                {
                                                }
                                            }
                                        ]
                                    }
                                    onChange={(async()=>
                                    {
                                        
                                    }).bind(this)} 
                                    >     
                                    </NdTextBox>      
                                </Item>
                                {/* txtName */}
                                <Item colSpan={2}>                                    
                                    <Label text={this.t("txtName")} alignment="right" />
                                    <NdTextBox id="txtName" parent={this} simple={true} />     
                                </Item>
                                {/* dtStartDate */}
                                <Item>
                                    <Label text={this.t("dtStartDate")} alignment="right" />
                                    <NdDatePicker simple={true}  parent={this} id={"dtStartDate"}/>
                                </Item>
                                {/* dtFinishDate */}
                                <Item>
                                    <Label text={this.t("dtFinishDate")} alignment="right" />
                                    <NdDatePicker simple={true}  parent={this} id={"dtFinishDate"}/>
                                </Item>
                                {/* empty */}
                                <Item> </Item>
                                {/* txtCustomerCode */}
                                <Item>                                    
                                    <Label text={this.t("txtCustomerCode")} alignment="right" />
                                    <NdTextBox id="txtCustomerCode" parent={this} simple={true} 
                                    button=
                                    {
                                        [
                                            {
                                                id:'01',
                                                icon:'more',
                                                onClick:()=>
                                                {
                                                }
                                            }
                                        ]
                                    }
                                    onChange={(async()=>
                                    {
                                        
                                    }).bind(this)} 
                                    >     
                                    </NdTextBox>      
                                </Item>
                                {/* txtCustomerName */}
                                <Item colSpan={2}>                                    
                                    <Label text={this.t("txtCustomerName")} alignment="right" />
                                    <NdTextBox id="txtCustomerName" parent={this} simple={true} />     
                                </Item>
                                {/* cmbPrmType */}
                                <Item>
                                    <Label text={this.t("cmbPrmType")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbPrmType"
                                    displayExpr="NAME"                       
                                    valueExpr="CODE"
                                    value=""
                                    data={{source:{select:{query : "SELECT CODE,NAME FROM ITEM_GROUP ORDER BY NAME ASC"},sql:this.core.sql}}}
                                    onValueChanged={(e)=>
                                    {
                                    }}
                                    />
                                </Item>
                                {/* txtPrmItem */}
                                <Item>                                    
                                    <Label text={this.t("txtPrmItem")} alignment="right" />
                                    <NdTextBox id="txtPrmItem" parent={this} simple={true} 
                                    button=
                                    {
                                        [
                                            {
                                                id:'01',
                                                icon:'more',
                                                onClick:()=>
                                                {
                                                }
                                            }
                                        ]
                                    }
                                    onChange={(async()=>
                                    {
                                        
                                    }).bind(this)} 
                                    >     
                                    </NdTextBox>      
                                </Item>
                                {/* txtPrmQuantity */}
                                <Item colSpan={2}>                                    
                                    <Label text={this.t("txtPrmQuantity")} alignment="right" />
                                    <NdTextBox id="txtPrmQuantity" parent={this} simple={true} />     
                                </Item>
                                {/* cmbRstType */}
                                <Item>
                                    <Label text={this.t("cmbRstType")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbRstType"
                                    displayExpr="NAME"                       
                                    valueExpr="CODE"
                                    value=""
                                    data={{source:{select:{query : "SELECT CODE,NAME FROM ITEM_GROUP ORDER BY NAME ASC"},sql:this.core.sql}}}
                                    onValueChanged={(e)=>
                                    {
                                    }}
                                    />
                                </Item>
                                {/* txtRstQuantity */}
                                <Item colSpan={2}>                                    
                                    <Label text={this.t("txtRstQuantity")} alignment="right" />
                                    <NdTextBox id="txtRstQuantity" parent={this} simple={true} />     
                                </Item>
                                {/* cmbRstItemType */}
                                <Item>
                                    <Label text={this.t("cmbRstItemType")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbRstItemType"
                                    displayExpr="NAME"                       
                                    valueExpr="CODE"
                                    value=""
                                    data={{source:{select:{query : "SELECT CODE,NAME FROM ITEM_GROUP ORDER BY NAME ASC"},sql:this.core.sql}}}
                                    onValueChanged={(e)=>
                                    {
                                    }}
                                    />
                                </Item>
                                {/* txtRstItemQuantity */}
                                <Item colSpan={2}>                                    
                                    <Label text={this.t("txtRstItemQuantity")} alignment="right" />
                                    <NdTextBox id="txtRstItemQuantity" parent={this} simple={true} />     
                                </Item>
                            </Form>
                        </div>
                    </div>
                </ScrollView>
            </div>
        )
    }
}