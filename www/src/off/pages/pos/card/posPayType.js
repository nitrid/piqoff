import React from 'react';
import App from '../../../lib/app.js';
import { posPayTypeCls} from '../../../../core/cls/pos';
import moment from 'moment';

import ScrollView from 'devextreme-react/scroll-view';
import Toolbar from 'devextreme-react/toolbar';
import Form, { Label,Item,EmptyItem } from 'devextreme-react/form';
import TabPanel from 'devextreme-react/tab-panel';
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
import NdImageUpload from '../../../../core/react/devex/imageupload.js';
import { dialog } from '../../../../core/react/devex/dialog.js';
import { datatable } from '../../../../core/core.js';

export default class posPayTypeCard extends React.PureComponent
{
    constructor(props)
    {
        super(props)
        this.core = App.instance.core;
        this.payTypeObj = new posPayTypeCls();
        this.tabIndex = props.data.tabkey
    }
    async componentDidMount()
    {
        await this.core.util.waitUntil(0)
        this.init()
    }
    async getPayType(pCode)
    {
        this.payTypeObj.clearAll()
        await this.payTypeObj.load({GUID:pCode});
        console.log(pCode)
    }
    async init()
    {
        this.payTypeObj.clearAll();
        this.payTypeObj.addEmpty();
    }
    render()
    {
        return(
            <div>
                <ScrollView>
                    <div className="row px-2 py-2">
                        <div className="col-12">
                            <Toolbar>
                                <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnNew" parent={this} icon="file" type="default"
                                    onClick={()=>
                                    {
                                        this.init(); 
                                    }}/>
                                </Item>
                                <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnSave" parent={this} icon="floppy" type="success" validationGroup={"frmPayType" + this.tabIndex}
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
                                                
                                                if((await this.payTypeObj.save()) == 0)
                                                {                                                    
                                                    tmpConfObj1.content = (<div style={{textAlign:"center",fontSize:"20px",color:"green"}}>{this.t("msgSaveResult.msgSuccess")}</div>)
                                                    await dialog(tmpConfObj1);
                                                }
                                                else
                                                {
                                                    tmpConfObj1.content = (<div style={{textAlign:"center",fontSize:"20px",color:"red"}}>{this.t("msgSaveResult.msgFailed")}</div>)
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
                                    <NdButton id="btnDelete" parent={this} icon="trash" type="danger"
                                    onClick={async()=>
                                    {
                                        let tmpConfObj =
                                        {
                                            id:'msgDelete',showTitle:true,title:this.t("msgDelete.title"),showCloseButton:true,width:'500px',height:'200px',
                                            button:[{id:"btn01",caption:this.t("msgDelete.btn01"),location:'before'},{id:"btn02",caption:this.t("msgDelete.btn02"),location:'after'}],
                                            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgDelete.msg")}</div>)
                                        }
                                        
                                        let pResult = await dialog(tmpConfObj);
                                        if(pResult == 'btn01')
                                        {
                                            this.payTypeObj.dt('POS_PAY_TYPE').removeAt(0)
                                            await this.payTypeObj.dt('POS_PAY_TYPE').delete();
                                            this.init(); 
                                        }
                                    }}/>
                                </Item>
                            </Toolbar>
                        </div>
                    </div>
                    <div className="alert alert-info m-0" role="alert">
                        {this.t("alert1")}
                    </div>
                    <div className="row px-2 py-2">
                        <div className="col-12">
                            <Form colCount={2} id={"frmPayType"}>
                            <Item>
                                <Label text={this.t("txtPayType")} alignment="right" />
                                <NdTextBox id="txtPayType" parent={this} simple={true}
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    dt={{data:this.payTypeObj.dt('POS_PAY_TYPE'),field:"TYPE"}}
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
                                                            this.getPayType(data[0].GUID)
                                                        }
                                                    }
                                                }
                                            },
                                            {
                                                id:'02',
                                                icon:'arrowdown',
                                                onClick:async()=>
                                                {
                                                    let tmpQuery = 
                                                    {
                                                        query :"SELECT ISNULL(MAX(TYPE),0) + 1 AS TYPE FROM POS_PAY_TYPE",
                                                    }
                                                    let tmpData = await this.core.sql.execute(tmpQuery) 
                                                   
                                                    this.txtPayType.value = tmpData.result.recordset[0].TYPE;
                                                
                                                }
                                            }
                                        ]
                                    }
                                    onChange={(async()=>
                                    {
                                      
                                    }).bind(this)}
                                    >
                                        <Validator validationGroup={"frmPayType" + this.tabIndex}>
                                            <RequiredRule message={this.t("validName")}/>
                                        </Validator>
                                    </NdTextBox>
                                    <NdPopGrid id={"pg_txtCode"} parent={this} container={"#root"}
                                    visible={false}
                                    position={{of:'#root'}} 
                                    showTitle={true} 
                                    showBorders={true}
                                    width={'90%'}
                                    height={'90%'}
                                    title={this.t("pg_txtCode.title")} 
                                    data={{source:{select:{query : "SELECT * FROM POS_PAY_TYPE"},sql:this.core.sql}}}
                                    button=
                                    {
                                        {
                                            id:'01',
                                            icon:'more',
                                            onClick:()=>
                                            {
                                            }
                                        }
                                    }
                                    >
                                        <Column dataField="TYPE" caption={this.t("pg_txtCode.clmCode")} width={300} defaultSortOrder="asc"/>
                                        <Column dataField="NAME" caption={this.t("pg_txtCode.clmName")} width={300}  />
                                    </NdPopGrid>
                                </Item>
                                <Item>
                                    <Label text={this.t("txtPayTypeName")} alignment="right" />
                                    <NdTextBox id="txtPayTypeName" parent={this} simple={true}
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    dt={{data:this.payTypeObj.dt('POS_PAY_TYPE'),field:"NAME"}}
                                    onChange={(async()=>
                                    {
                                      
                                    }).bind(this)}
                                    >
                                        <Validator validationGroup={"frmPayType" + this.tabIndex}>
                                            <RequiredRule message={this.t("validName")}/>
                                        </Validator> 
                                    </NdTextBox>
                                </Item>
                                <Item>
                                    <Label text={this.t("txtPayTypeRate")} alignment="right" />
                                    <NdNumberBox id="txtPayTypeRate" parent={this} simple={true}
                                    dt={{data:this.payTypeObj.dt('POS_PAY_TYPE'),field:"RATE"}}
                                    onChange={(async()=>
                                    {
                                      
                                    }).bind(this)}
                                    >
                                        <Validator validationGroup={"frmPayType" + this.tabIndex}>
                                            <RequiredRule message={this.t("validName")}/>
                                        </Validator>
                                    </NdNumberBox>
                                </Item>
                                <Item>
                                    <Label text={this.t("txtPayTypeIcon")} alignment="right" />
                                    <NdTextBox id="txtPayTypeIcon" parent={this} simple={true}
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    dt={{data:this.payTypeObj.dt('POS_PAY_TYPE'),field:"ICON"}}
                                    onChange={(async()=>
                                    {
                                      
                                    }).bind(this)}
                                    />
                                </Item>
                                <EmptyItem/>
                                <Item>
                                    <NdCheckBox id="chkPayTypeVisible" parent={this} value={false} text={this.t("chkPayTypeVisible")}
                                    dt={{data:this.payTypeObj.dt('POS_PAY_TYPE'),field:"TOTAL_VISIBLE"}}
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
