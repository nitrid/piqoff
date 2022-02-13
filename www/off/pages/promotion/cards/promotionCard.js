import React from 'react';
import App from '../../../lib/app.js';
import {promotionCls} from '../../../lib/cls/promotion.js'

import ScrollView from 'devextreme-react/scroll-view';
import Toolbar from 'devextreme-react/toolbar';
import Form, { Label,Item,EmptyItem } from 'devextreme-react/form';
import { Button } from 'devextreme-react/button';
import { TextBox } from 'devextreme-react/text-box';

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
        this.state = 
        {
            prmType:0
        }               
        this.core = App.instance.core;
        this.prmObj = this.param.filter({TYPE:1,USERS:this.user.CODE});

        this.promoObj = new promotionCls();
    }   
    async componentDidMount()
    {
        await this.core.util.waitUntil(0)
        this.init();
        
        //this.frmPromo.itemOption("tst1","visible", false)
        console.log(this.frmPromo.itemOption("tst1"))
    }
    _txtPrmItemInit()
    {
        if(typeof this.txtPrmItem != 'undefined')
        {
            this.txtPrmItem.GUID = "";
            this.txtPrmItem.value = "";
        }
        
        let tmpQuery = ""

        if(this.state.prmType == 0)
        {
            tmpQuery = "SELECT GUID,CODE,NAME FROM ITEMS_VW_01"
        }
        else if(this.state.prmType == 1)
        {
            tmpQuery = "SELECT GUID,CODE,NAME FROM ITEM_GROUP"
        }

        if(this.state.prmType < 2)
        {
            return(
                <Item>
                    <Label text={this.t("txtPrmItem")} alignment="right" />
                    <NdTextBox id="txtPrmItem" parent={this} simple={true} readOnly={true}
                    dt={{data:this.promoObj.dt(),field:"PRM_V"}}
                    button=
                    {
                        [
                            {
                                id:'01',
                                icon:'more',
                                onClick:()=>
                                {
                                    this.pg_txtPrmItem.show()
                                    this.pg_txtPrmItem.onClick = (data) =>
                                    {
                                        if(data.length > 0)
                                        {
                                            this.txtPrmItem.GUID = data[0].GUID;
                                            this.txtPrmItem.value = data[0].NAME
                                        }
                                    }
                                }
                            }
                        ]
                    }
                    >     
                    </NdTextBox> 
                    {/* SEÇİM POPUP */}
                    <NdPopGrid id={"pg_txtPrmItem"} parent={this} container={"#root"} 
                    visible={false}
                    position={{of:'#root'}} 
                    showTitle={true} 
                    showBorders={true}
                    width={'90%'}
                    height={'90%'}
                    title={this.t("pg_txtPrmItem.title")} 
                    data={{source:{select:{query : tmpQuery},sql:this.core.sql}}}
                    >
                        <Column dataField="CODE" caption={this.t("pg_txtPrmItem.clmCode")} width={150} />
                        <Column dataField="NAME" caption={this.t("pg_txtPrmItem.clmName")} width={650} defaultSortOrder="asc" />
                    </NdPopGrid>
                </Item>                                                    
            )
        }
        else
        {
            return (<EmptyItem/>)
        }
        
    }  
    _txtPrmQuantityInit()
    {

    }
    async init()
    {
        this.promoObj.clearAll();
        this.promoObj.addEmpty();
    }
    async getPromotion(pCode)
    {
        this.promoObj.clearAll();
        await this.promoObj.load({CODE:pCode});
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
                            <Form colCount={3} id="frmPromo" 
                            onInitialized={(e)=>
                            {
                                this.frmPromo = e.component
                            }}>
                                {/* txtCode */}
                                <Item>                                    
                                    <Label text={this.t("txtCode")} alignment="right" />
                                    <NdTextBox id="txtCode" parent={this} simple={true} 
                                    dt={{data:this.promoObj.dt(),field:"CODE"}}
                                    button=
                                    {
                                        [
                                            {
                                                id:'01',
                                                icon:'more',
                                                onClick:()=>
                                                {
                                                    this.pg_txtCode.show()
                                                    this.pg_txtCode.onClick = (data) =>
                                                    {
                                                        if(data.length > 0)
                                                        {
                                                            this.getPromotion(data[0].CODE)
                                                        }
                                                    }
                                                }
                                            },
                                            {
                                                id:'02',
                                                icon:'arrowdown',
                                                onClick:()=>
                                                {
                                                    this.txtCode.value = Math.floor(Date.now() / 1000)
                                                }
                                            }
                                        ]
                                    }
                                    onChange={(async()=>
                                    {
                                        
                                    }).bind(this)} 
                                    >     
                                    </NdTextBox>  
                                    {/* PROMOSYON SEÇİM POPUP */}
                                    <NdPopGrid id={"pg_txtCode"} parent={this} container={"#root"} 
                                    visible={false}
                                    position={{of:'#root'}} 
                                    showTitle={true} 
                                    showBorders={true}
                                    width={'90%'}
                                    height={'90%'}
                                    title={this.t("txtCode.title")} 
                                    data={{source:{select:{query : "SELECT CODE,NAME FROM PROMOTION_VW_01 GROUP BY CODE,NAME"},sql:this.core.sql}}}
                                    >
                                        <Column dataField="CODE" caption={this.t("pg_txtRef.clmCode")} width={150} />
                                        <Column dataField="NAME" caption={this.t("pg_txtRef.clmName")} width={650} defaultSortOrder="asc" />
                                    </NdPopGrid>    
                                </Item>
                                {/* txtName */}
                                <Item colSpan={2}>                                    
                                    <Label text={this.t("txtName")} alignment="right" />
                                    <NdTextBox id="txtName" parent={this} simple={true} 
                                    dt={{data:this.promoObj.dt(),field:"NAME"}}
                                    />     
                                </Item>
                                {/* dtStartDate */}
                                <Item>
                                    <Label text={this.t("dtStartDate")} alignment="right" />
                                    <NdDatePicker simple={true}  parent={this} id={"dtStartDate"} 
                                    dt={{data:this.promoObj.dt(),field:"START_DATE"}}
                                    />
                                </Item>
                                {/* dtFinishDate */}
                                <Item>
                                    <Label text={this.t("dtFinishDate")} alignment="right" />
                                    <NdDatePicker simple={true}  parent={this} id={"dtFinishDate"} 
                                    dt={{data:this.promoObj.dt(),field:"FINISH_DATE"}}
                                    />
                                </Item>
                                {/* cmbDepot */}
                                <Item>
                                    <Label text={this.t("cmbDepot")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbDepot"
                                    dt={{data:this.promoObj.dt(),field:"DEPOT"}}
                                    displayExpr="NAME"                       
                                    valueExpr="CODE"
                                    value=""
                                    data={{source:{select:{query : "SELECT CODE,NAME FROM DEPOT_VW_01 ORDER BY CODE ASC"},sql:this.core.sql}}}
                                    onValueChanged={(e)=>
                                    {
                                    }}
                                    />
                                </Item>
                                {/* txtCustomerCode */}
                                <Item>                                    
                                    <Label text={this.t("txtCustomerCode")} alignment="right" />
                                    <NdTextBox id="txtCustomerCode" parent={this} simple={true} 
                                    dt={{data:this.promoObj.dt(),field:"CUSTOMER_CODE"}}
                                    button=
                                    {
                                        [
                                            {
                                                id:'01',
                                                icon:'more',
                                                onClick:()=>
                                                {
                                                    this.pg_txtCustomerCode.show()
                                                    this.pg_txtCustomerCode.onClick = (data) =>
                                                    {
                                                        if(data.length > 0)
                                                        {
                                                            this.txtCustomerCode.GUID = data[0].GUID
                                                            this.txtCustomerCode.value = data[0].CODE;
                                                            this.txtCustomerName.value = data[0].TITLE;
                                                        }
                                                    }
                                                }
                                            }
                                        ]
                                    }
                                    onChange={(async()=>
                                    {
                                        
                                    }).bind(this)} 
                                    >     
                                    </NdTextBox>      
                                    <NdPopGrid id={"pg_txtCustomerCode"} parent={this} container={".dx-multiview-wrapper"} 
                                    position={{of:'#page'}} 
                                    showTitle={true} 
                                    showBorders={true}
                                    width={'90%'}
                                    height={'90%'}
                                    title={this.t("pg_txtCustomerCode.title")} 
                                    columnAutoWidth={true}
                                    allowColumnResizing={true}
                                    data={{source:{select:{query:"SELECT GUID,CODE,TITLE FROM CUSTOMER_VW_01 WHERE TYPE = 1 "},sql:this.core.sql}}}
                                    >           
                                    <Scrolling mode="virtual" />                         
                                    <Column dataField="TITLE" caption={this.t("pg_txtCustomerCode.clmName")} width={650} defaultSortOrder="asc" />
                                    <Column dataField="CODE" caption={this.t("pg_txtCustomerCode.clmCode")} width={150} />
                                    </NdPopGrid>
                                </Item>
                                {/* txtCustomerName */}
                                <Item colSpan={2}>                                    
                                    <Label text={this.t("txtCustomerName")} alignment="right" />
                                    <NdTextBox id="txtCustomerName" parent={this} simple={true} readOnly={true}
                                    dt={{data:this.promoObj.dt(),field:"CUSTOMER_NAME"}}
                                    />     
                                </Item>
                                {/* cmbPrmType */}
                                <Item>
                                    <Label text={this.t("cmbPrmType")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbPrmType"
                                    dt={{data:this.promoObj.dt(),field:"PRM_T"}}
                                    displayExpr="NAME"                       
                                    valueExpr="ID"
                                    value={0}
                                    data={{source:[{ID:0,NAME:"Stok"},{ID:1,NAME:"Ürün Grup"},{ID:2,NAME:"Genel Tutar"}]}}
                                    onValueChanged={(e)=>
                                    {
                                        this.setState({prmType:e.value})
                                    }}
                                    />
                                </Item>
                                {/* txtPrmItem */}
                                {/* {this._txtPrmItemInit()}             */}
                                {/* txtPrmQuantity */}  
                                <Item name={"tst1"}>                                                                    
                                    <Label text={"this.state.prmType"} alignment="right" />
                                    {/* <NdTextBox id="txtPrmAmount" parent={this} simple={true} 
                                    dt={{data:this.promoObj.dt(),field:"PRM_Q"}}
                                    />      */}
                                    <TextBox value={this.state.prmType}/>
                                </Item>  
                                {/* cmbRstType */}
                                <Item>
                                    <Label text={this.t("cmbRstType")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbRstType"
                                    dt={{data:this.promoObj.dt(),field:"RST_T"}}
                                    displayExpr="NAME"                       
                                    valueExpr="ID"
                                    value={0}
                                    data={{source:[{ID:0,NAME:"Fiyat"},{ID:1,NAME:"İskonto Tutar"},{ID:2,NAME:"İskonto Oran"},{ID:3,NAME:"Para Puan"},{ID:4,NAME:"Stok"}]}}
                                    onValueChanged={(e)=>
                                    {
                                    }}
                                    />
                                </Item>
                                {/* txtRstQuantity */}
                                <Item colSpan={2}>                                    
                                    <Label text={this.t("txtRstQuantity")} alignment="right" />
                                    <NdTextBox id="txtRstQuantity" parent={this} simple={true}
                                    dt={{data:this.promoObj.dt(),field:"RST_V"}} 
                                    />     
                                </Item>
                                {/* cmbRstItemType */}
                                <Item>
                                    <Label text={this.t("cmbRstItemType")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbRstItemType"
                                    dt={{data:this.promoObj.dt(),field:"RST_ITEM_T"}}
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
                                    <NdTextBox id="txtRstItemQuantity" parent={this} simple={true} 
                                    dt={{data:this.promoObj.dt(),field:"RST_ITEM_V"}}
                                    />     
                                </Item>
                            </Form>
                        </div>
                    </div>
                </ScrollView>
            </div>
        )
    }
}