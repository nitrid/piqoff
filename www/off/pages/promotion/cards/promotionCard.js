import React from 'react';
import App from '../../../lib/app.js';
import {promotionCls} from '../../../lib/cls/promotion.js'

import ScrollView from 'devextreme-react/scroll-view';
import Toolbar from 'devextreme-react/toolbar';
import Form, { Label,Item,EmptyItem,GroupItem } from 'devextreme-react/form';
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
        this.state = 
        {
            prmType:0,
            rstType:0
        }               
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
                                    <NdButton id="btnSave" parent={this} icon="floppy" type="default" validationGroup="frmPromo"
                                    onClick={async (e)=>
                                    {
                                        if(e.validationGroup.validate().status == "valid")
                                        {
                                            let tmpConfObj =
                                            {
                                                id:'msgSave',showTitle:true,title:this.t("msgSave.title"),showCloseButton:true,width:'500px',height:'200px',
                                                button:[{id:"btn01",caption:this.t("msgSave.btn01"),location:'before'},{id:"btn02",caption:this.t("msgSave.btn02"),location:'after'}],
                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgSave.msg")}</div>)
                                            }
                                            
                                            let pResult = await dialog(tmpConfObj);
                                            if(pResult == 'btn01')
                                            {
                                                let tmpConfObj1 =
                                                {
                                                    id:'msgSaveResult',showTitle:true,title:this.t("msgSave.title"),showCloseButton:true,width:'500px',height:'200px',
                                                    button:[{id:"btn01",caption:this.t("msgSave.btn01"),location:'after'}],
                                                }
                                                
                                                if((await this.promoObj.save()) == 0)
                                                {                                                    
                                                    tmpConfObj1.content = (<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgSaveResult.msgSuccess")}</div>)
                                                    await dialog(tmpConfObj1);
                                                }
                                                else
                                                {
                                                    tmpConfObj1.content = (<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgSaveResult.msgFailed")}</div>)
                                                    await dialog(tmpConfObj1);
                                                }
                                            }
                                        }
                                        else
                                        {
                                            let tmpConfObj =
                                            {
                                                id:'msgSaveValid',showTitle:true,title:this.t("msgSaveValid.title"),showCloseButton:true,width:'500px',height:'200px',
                                                button:[{id:"btn01",caption:this.t("msgSaveValid.btn01"),location:'after'}],
                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgSaveValid.msg")}</div>)
                                            }
                                            
                                            await dialog(tmpConfObj);
                                        } 
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
                                <GroupItem colSpan={3}>
                                <GroupItem colCount={3}>
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
                                    param={this.param.filter({ELEMENT:'txtCode',USERS:this.user.CODE})} 
                                    >     
                                        <Validator validationGroup={"frmPromo"}>
                                            <RequiredRule />
                                        </Validator>  
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
                                </GroupItem>
                                </GroupItem>
                                <GroupItem colSpan={3} colCount={3} caption={"Promosyon Koşulları"}>
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
                                <EmptyItem />
                                <EmptyItem />
                                <GroupItem colSpan={3}>
                                <GroupItem colCount={3} visible={this.state.prmType == 0 ? true : false}>
                                {/* txtPrmItem */}                                
                                <Item>
                                    <Label text={this.t("txtPrmItem")} alignment="right" />
                                    <NdTextBox id="txtPrmItem" parent={this} simple={true} readOnly={true}
                                    dt={{data:this.promoObj.dt(),field:"PRM_V",display:"PRM_NAME"}}
                                    displayValue={""}
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
                                                            this.txtPrmItem.value = data[0].GUID;
                                                            this.txtPrmItem.displayValue = data[0].NAME
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
                                    data={{source:{select:{query : "SELECT GUID,CODE,NAME FROM ITEMS_VW_01"},sql:this.core.sql}}}
                                    >
                                        <Column dataField="CODE" caption={this.t("pg_txtPrmItem.clmCode")} width={150} />
                                        <Column dataField="NAME" caption={this.t("pg_txtPrmItem.clmName")} width={650} defaultSortOrder="asc" />
                                    </NdPopGrid>
                                </Item>     
                                {/* txtPrmQuantity */}  
                                <Item>                                                                    
                                    <Label text={this.t("txtPrmQuantity")} alignment="right" />
                                    <NdTextBox id="txtPrmQuantity" parent={this} simple={true} 
                                    dt={{data:this.promoObj.dt(),field:"PRM_Q"}}
                                    />     
                                </Item> 
                                <EmptyItem /> 
                                </GroupItem>
                                <GroupItem colCount={3} visible={this.state.prmType == 1 ? true : false}>
                                {/* txtPrmItemGrp */}                                
                                <Item>
                                    <Label text={this.t("txtPrmItemGrp")} alignment="right" />
                                    <NdTextBox id="txtPrmItemGrp" parent={this} simple={true} readOnly={true}
                                    dt={{data:this.promoObj.dt(),field:"PRM_V",display:"PRM_NAME"}}
                                    displayValue={""}
                                    button=
                                    {
                                        [
                                            {
                                                id:'01',
                                                icon:'more',
                                                onClick:()=>
                                                {
                                                    this.pg_txtPrmItemGrp.show()
                                                    this.pg_txtPrmItemGrp.onClick = (data) =>
                                                    {
                                                        if(data.length > 0)
                                                        {
                                                            this.txtPrmItemGrp.value = data[0].GUID;
                                                            this.txtPrmItemGrp.displayValue = data[0].NAME
                                                        }
                                                    }
                                                }
                                            }
                                        ]
                                    }
                                    >     
                                    </NdTextBox> 
                                    {/* SEÇİM POPUP */}
                                    <NdPopGrid id={"pg_txtPrmItemGrp"} parent={this} container={"#root"} 
                                    visible={false}
                                    position={{of:'#root'}} 
                                    showTitle={true} 
                                    showBorders={true}
                                    width={'90%'}
                                    height={'90%'}
                                    title={this.t("pg_txtPrmItemGrp.title")} 
                                    data={{source:{select:{query : "SELECT GUID,CODE,NAME FROM ITEM_GROUP"},sql:this.core.sql}}}
                                    >
                                        <Column dataField="CODE" caption={this.t("pg_txtPrmItemGrp.clmCode")} width={150} />
                                        <Column dataField="NAME" caption={this.t("pg_txtPrmItemGrp.clmName")} width={650} defaultSortOrder="asc" />
                                    </NdPopGrid>
                                </Item>     
                                <EmptyItem /> 
                                <EmptyItem /> 
                                </GroupItem>
                                <GroupItem colCount={3} visible={this.state.prmType == 2 ? true : false}>
                                {/* txtPrmAmount */}  
                                <Item>                                                                    
                                    <Label text={this.t("txtPrmAmount")} alignment="right" />
                                    <NdTextBox id="txtPrmAmount" parent={this} simple={true} 
                                    dt={{data:this.promoObj.dt(),field:"PRM_Q"}}
                                    />     
                                </Item> 
                                <EmptyItem /> 
                                <EmptyItem /> 
                                </GroupItem>
                                </GroupItem>
                                </GroupItem>           
                                <GroupItem colSpan={3} colCount={3} caption={"Promosyon Sonuç"}>
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
                                        this.setState({rstType:e.value})
                                    }}
                                    />
                                </Item>                                
                                <EmptyItem/>
                                <EmptyItem/>
                                <GroupItem colSpan={3}>
                                <GroupItem colCount={3} visible={this.state.rstType != 4 ? true : false}>
                                {/* txtRstQuantity */}
                                <Item>                                    
                                    <Label text={this.t("txtRstQuantity")} alignment="right" />
                                    <NdTextBox id="txtRstQuantity" parent={this} simple={true}
                                    dt={{data:this.promoObj.dt(),field:"RST_V"}} 
                                    />     
                                </Item>
                                <EmptyItem/>
                                <EmptyItem/>
                                </GroupItem>
                                <GroupItem colCount={3} visible={this.state.rstType == 4 ? true : false}>
                                {/* txtRstItem */}                                
                                <Item>
                                    <Label text={this.t("txtRstItem")} alignment="right" />
                                    <NdTextBox id="txtRstItem" parent={this} simple={true} readOnly={true}
                                    dt={{data:this.promoObj.dt(),field:"RST_ITEM"}}
                                    button=
                                    {
                                        [
                                            {
                                                id:'01',
                                                icon:'more',
                                                onClick:()=>
                                                {
                                                    this.pg_txtRstItem.show()
                                                    this.pg_txtRstItem.onClick = (data) =>
                                                    {
                                                        if(data.length > 0)
                                                        {
                                                            this.txtRstItem.GUID = data[0].GUID;
                                                            this.txtRstItem.value = data[0].NAME
                                                        }
                                                    }
                                                }
                                            }
                                        ]
                                    }
                                    >     
                                    </NdTextBox> 
                                    {/* SEÇİM POPUP */}
                                    <NdPopGrid id={"pg_txtRstItem"} parent={this} container={"#root"} 
                                    visible={false}
                                    position={{of:'#root'}} 
                                    showTitle={true} 
                                    showBorders={true}
                                    width={'90%'}
                                    height={'90%'}
                                    title={this.t("pg_txtRstItem.title")} 
                                    data={{source:{select:{query : "SELECT GUID,CODE,NAME FROM ITEMS_VW_01"},sql:this.core.sql}}}
                                    >
                                        <Column dataField="CODE" caption={this.t("pg_txtRstItem.clmCode")} width={150} />
                                        <Column dataField="NAME" caption={this.t("pg_txtRstItem.clmName")} width={650} defaultSortOrder="asc" />
                                    </NdPopGrid>
                                </Item>     
                                {/* txtPrmQuantity */}  
                                <Item>                                                                    
                                    <Label text={this.t("txtPrmQuantity")} alignment="right" />
                                    <NdTextBox id="txtPrmQuantity" parent={this} simple={true} 
                                    dt={{data:this.promoObj.dt(),field:"RST_ITEM_Q"}}
                                    />     
                                </Item> 
                                <EmptyItem /> 
                                {/* cmbRstItemType */}
                                <Item>
                                    <Label text={this.t("cmbRstItemType")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbRstItemType"
                                    dt={{data:this.promoObj.dt(),field:"RST_ITEM_T"}}
                                    displayExpr="NAME"                       
                                    valueExpr="ID"
                                    value={0}
                                    data={{source:[{ID:0,NAME:"Fiyat"},{ID:1,NAME:"İskonto Tutar"},{ID:2,NAME:"İskonto Oran"},{ID:3,NAME:"Para Puan"}]}}
                                    onValueChanged={(e)=>
                                    {
                                    }}
                                    />
                                </Item>
                                {/* txtRstItemQuantity */}
                                <Item>                                    
                                    <Label text={this.t("txtRstItemQuantity")} alignment="right" />
                                    <NdTextBox id="txtRstItemQuantity" parent={this} simple={true} 
                                    dt={{data:this.promoObj.dt(),field:"RST_ITEM_V"}}
                                    />     
                                </Item>
                                <EmptyItem/>
                                </GroupItem>
                                </GroupItem>
                                </GroupItem>                     
                                
                            </Form>
                        </div>
                    </div>
                </ScrollView>
            </div>
        )
    }
}