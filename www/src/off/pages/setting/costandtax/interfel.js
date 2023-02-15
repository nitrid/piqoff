import React from 'react';
import App from '../../../lib/app.js';
import { additionalTax,interfelCls } from '../../../../core/cls/additionalTax.js';
import moment from 'moment';


import Toolbar, { Item } from 'devextreme-react/toolbar';
import Form, { EmptyItem, Label } from 'devextreme-react/form';
import ScrollView from 'devextreme-react/scroll-view';
import { Button } from 'devextreme-react/button';

import NdTextBox, { Validator, NumericRule, RequiredRule, CompareRule, EmailRule, PatternRule, StringLengthRule, RangeRule, AsyncRule } from '../../../../core/react/devex/textbox.js'
import NdNumberBox from '../../../../core/react/devex/numberbox.js';
import NdButton from '../../../../core/react/devex/button.js';
import { dialog } from '../../../../core/react/devex/dialog.js';
import { datatable } from '../../../../core/core.js';
import tr from '../../../meta/lang/devexpress/tr.js';

export default class interfel extends React.PureComponent
{
    constructor(props)
    {
        super(props)
        this.core = App.instance.core;
        this.prmObj = this.param.filter({TYPE:1,USERS:this.user.CODE});
        this.interfelObj = new interfelCls();
        this.addTaxObj = new additionalTax()

    }
    componentDidMount()
    {
        setTimeout(async () => 
        {
            this.init()
        }, 500);
    }
    async init()
    {
        this.interfelObj.clearAll()
        this.addTaxObj.clearAll()
        this.getDoc()

        this.interfelObj.ds.on('onAddRow',(pTblName,pData) =>
        {
            if(pData.stat == 'new')
            {
                this.btnBack.setState({disabled:false});
                this.btnSave.setState({disabled:false});
            }
        })
        this.interfelObj.ds.on('onEdit',(pTblName,pData) =>
        {            
            if(pData.rowData.stat == 'edit')
            {
                this.btnBack.setState({disabled:false});
                this.btnSave.setState({disabled:false});

                pData.rowData.CUSER = this.user.CODE
            }                 
        })
        this.interfelObj.ds.on('onRefresh',(pTblName) =>
        {            
            this.btnBack.setState({disabled:false});
            this.btnSave.setState({disabled:false});
        })
        this.interfelObj.ds.on('onDelete',(pTblName) =>
        {            
            this.btnBack.setState({disabled:false});
            this.btnSave.setState({disabled:false});
        })

        let tmpAdd = {...this.addTaxObj.empty}
        tmpAdd.TYPE = 0
        this.addTaxObj.addEmpty(tmpAdd);
    }
    async getDoc()
    {
        
        this.addTaxObj.clearAll()
        this.interfelObj.clearAll()
        await this.addTaxObj.load({TYPE:1});
        if(this.addTaxObj.dt().length == 0)
        {
            let tmpAdd = {...this.addTaxObj.empty}
            tmpAdd.TYPE = 1
            this.addTaxObj.addEmpty(tmpAdd);
            let tmpDocItems = {...this.interfelObj.empty}
            this.interfelObj.addEmpty(tmpDocItems)
        }
        else
        {
            await this.interfelObj.load();
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
                                <Item location="after" locateInMenu="auto">
                                        <NdButton id="btnBack" parent={this} icon="revert" type="default"
                                            onClick={()=>
                                            {
                                                this.getDoc()
                                            }}/>
                                    </Item>
                                    <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnSave" parent={this} icon="floppy" type="default" 
                                    onClick={async(e)=>
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
                                            let Data = {data:this.interfelObj.dt().toArray()}
                                            console.log(this.addTaxObj.dt()[0].JSON )
                                            this.addTaxObj.dt()[0].JSON = JSON.stringify(Data)

                                            let tmpConfObj1 =
                                            {
                                                id:'msgSaveResult',showTitle:true,title:this.t("msgSave.title"),showCloseButton:true,width:'500px',height:'200px',
                                                button:[{id:"btn01",caption:this.t("msgSave.btn01"),location:'after'}],
                                            }
                                            
                                            if((await this.addTaxObj.save()) == 0)
                                            {                       
                                                tmpConfObj1.content = (<div style={{textAlign:"center",fontSize:"20px",color:"green"}}>{this.t("msgSaveResult.msgSuccess")}</div>)
                                                await dialog(tmpConfObj1);
                                                this.btnSave.setState({disabled:true});
                                            }
                                            else
                                            {
                                                tmpConfObj1.content = (<div style={{textAlign:"center",fontSize:"20px",color:"red"}}>{this.t("msgSaveResult.msgFailed")}</div>)
                                                await dialog(tmpConfObj1);
                                            }
                                        }
                                    }}/>
                                </Item>
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
                    {/* Grid */}
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <Form colCount={2} onInitialized={(e)=>
                            {
                                this.frmTrnsfItems = e.component
                            }}>
                                <Item>
                                    <Label text={this.t("txtFrRate")} alignment="right" />
                                    <NdNumberBox id="txtFrRate" parent={this} simple={true} step={0.001}
                                    maxLength={32} dt={{data:this.interfelObj.dt('INTERFEL_TABLE'),field:"FR"}}
                                    ></NdNumberBox>
                                </Item>
                                <EmptyItem/>
                                <Item>
                                    <Label text={this.t("txtNotFrRate")} alignment="right" />
                                    <NdNumberBox id="txtNotFrRate" parent={this} simple={true}
                                    maxLength={32} dt={{data:this.interfelObj.dt('INTERFEL_TABLE'),field:"NOTFR"}} 
                                    step={0.001}
                                    ></NdNumberBox>
                                </Item>
                            </Form>
                               {/* TaxSugar PopUp */}
                        </div>
                    </div>
                </ScrollView>
            </div>
        )
    }
}