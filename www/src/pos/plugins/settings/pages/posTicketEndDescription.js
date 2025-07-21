import React from "react";
import App from "../../../lib/app.js";

import ScrollView from 'devextreme-react/scroll-view';
import Toolbar from 'devextreme-react/toolbar';
import Form, { Label,Item,EmptyItem } from 'devextreme-react/form';

import NdSelectBox from '../../../../core/react/devex/selectbox.js';
import { dialog } from '../../../../core/react/devex/dialog.js';
import NdTextArea from '../../../../core/react/devex/textarea.js';
import NbKeyboard from "../../../../core/react/bootstrap/keyboard.js";

export default class posTicketEndDescription extends React.PureComponent
{
    constructor()
    {
        super();
        this.core = App.instance.core;
        this.lang = App.instance.lang;
        this.user = this.core.auth.data
        this.prmObj = App.instance.prmObj

        Number.money = this.prmObj.filter({ID:'MoneySymbol',TYPE:0}).getValue()

        this.btnSave = this.btnSave.bind(this)
        this.getDescription = this.getDescription.bind(this)
    }
    async componentDidMount()
    {
        await this.core.util.waitUntil(0)
        this.init()
    }
    async init()
    {
        this.getDescription()
    }
    async getDescription()
    {
        let tmpQuery = 
        {
            query :"SELECT PRINT_DESCRIPTION FROM COMPANY_VW_01",
        }
        let tmpData = await this.core.sql.execute(tmpQuery) 
        if(tmpData.result.recordset.length > 0)
        {
           this.txtDescription.value = tmpData.result.recordset[0].PRINT_DESCRIPTION
        }
    }
    async btnSave()
    {
        let tmpQuery = 
        {
            query :"UPDATE  COMPANY SET PRINT_DESCRIPTION = @PRINT_DESCRIPTION WHERE((GUID = @GUID) OR (@GUID = '00000000-0000-0000-0000-000000000000'))",
            param : ['PRINT_DESCRIPTION:string|max','GUID:string|50'],
            value : [this.txtDescription.value,this.cmbFirm.value]
        }
        await this.core.sql.execute(tmpQuery)
        
        let tmpConfObj =
        {
            id:'msgSaveResult',showTitle:true,title:this.lang.t("posTicketEndDescription.msgSaveResult.title"),showCloseButton:true,width:'500px',height:'auto',
            button:[{id:"btn01",caption:this.lang.t("posTicketEndDescription.msgSaveResult.btn01"),location:'before'}],
            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("posTicketEndDescription.msgSaveResult.msgSuccess")}</div>)
        }
        await dialog(tmpConfObj);
    }
    render()
    {
        return (
            <div>
                <ScrollView>
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <Toolbar>
                                <Item location="after" locateInMenu="auto" widget="dxButton"
                                options=
                                {
                                    {
                                        type: 'default',
                                        icon: 'edit',
                                        onClick: async()=>
                                        {
                                            const tmpKeyboard = document.querySelector('.simple-keyboard');
                                            if(tmpKeyboard && !tmpKeyboard.contains(document.activeElement))
                                            {
                                                this.keyboardRef.hide()
                                            }
                                            else
                                            {
                                                this.keyboardRef.show('txtDescription')
                                                this.keyboardRef.inputName = "txtDescription"
                                                this.keyboardRef.setInput(this.txtDescription.value)
                                            }
                                        }
                                    }
                                }/>
                                <Item location="after" locateInMenu="auto" widget="dxButton"
                                options=
                                {
                                    {
                                        type: 'success',
                                        icon: 'floppy',
                                        onClick: async()=>
                                        {
                                            this.btnSave()
                                        }
                                    }
                                }/>
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
                                                id:'msgClose',showTitle:true,title:this.lang.t("msgWarning"),showCloseButton:true,width:'500px',height:'auto',
                                                button:[{id:"btn01",caption:this.lang.t("btnYes"),location:'before'},{id:"btn02",caption:this.lang.t("btnNo"),location:'after'}],
                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgClose")}</div>)
                                            }
                                            
                                            let pResult = await dialog(tmpConfObj);
                                            if(pResult == 'btn01')
                                            {
                                                App.instance.setPage('menu')
                                            }
                                        }
                                    }    
                                }/>
                            </Toolbar>
                        </div>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <Form colCount={1} id={"frm"}>
                                <Item>
                                    <Label text={this.lang.t("posTicketEndDescription.cmbFirm")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbFirm"
                                    displayExpr="NAME"
                                    valueExpr="GUID"
                                    value="00000000-0000-0000-0000-000000000000"
                                    searchEnabled={true}
                                    showClearButton={false}
                                    pageSize ={50}
                                    notRefresh={true}
                                    data={{source:{select:{query : "SELECT  '00000000-0000-0000-0000-000000000000' AS GUID,'ALL' AS NAME  UNION ALL SELECT GUID,NAME FROM COMPANY_VW_01"},sql:this.core.sql}}}
                                    onValueChanged={async (e)=>
                                    {
                                        this.getDescription()
                                    }}/>
                                </Item>
                                <Item>
                                    <NdTextArea simple={true} parent={this} id="txtDescription" height='300px' placeholder={this.lang.t("posTicketEndDescription.txtDescriptionPlaceHolder")}/>
                                </Item>
                            </Form>
                        </div>
                    </div>
                    <div>
                        <NbKeyboard id={"keyboardRef"} parent={this} autoPosition={true} enter={true} newLineOnEnter={true}
                        keyType={this.prmObj.filter({ID:'KeyType',TYPE:0,USERS:this.user.CODE}).getValue()}/>
                    </div>
                </ScrollView>
            </div>
        )
    }
}
