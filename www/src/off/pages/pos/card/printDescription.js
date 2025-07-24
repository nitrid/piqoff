import React from 'react';
import App from '../../../lib/app.js';

import ScrollView from 'devextreme-react/scroll-view';
import Toolbar from 'devextreme-react/toolbar';
import Form, { Label,Item } from 'devextreme-react/form';

import NdSelectBox from '../../../../core/react/devex/selectbox.js';
import NdButton from '../../../../core/react/devex/button.js';
import { dialog } from '../../../../core/react/devex/dialog.js';
import NdTextArea from '../../../../core/react/devex/textarea.js';
import  { NdToast } from '../../../../core/react/devex/toast.js';

export default class printDescription extends React.PureComponent
{
    constructor(props)
    {
        super(props)

        this.core = App.instance.core;
        this.prmObj = this.param.filter({TYPE:1,USERS:this.user.CODE});

        this.prevCode = "";
        this.tabIndex = props.data.tabkey

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
            query : `SELECT PRINT_DESCRIPTION FROM COMPANY_VW_01`,
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
            query : `UPDATE COMPANY SET PRINT_DESCRIPTION = @PRINT_DESCRIPTION WHERE((GUID = @GUID) OR (@GUID = '00000000-0000-0000-0000-000000000000'))`,
            param : ['PRINT_DESCRIPTION:string|max','GUID:string|50'],
            value : [this.txtDescription.value,this.cmbFirm.value]
        }
        await this.core.sql.execute(tmpQuery)
        this.toast.show({message:this.t("msgSaveResult.msgSuccess"),type:"success"})
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
                                                App.instance.panel.closePage()
                                            }
                                        }
                                    }    
                                } />
                            </Toolbar>
                        </div>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <Form colCount={2} id={"frmCopy"  + this.tabIndex}>
                                <Item>
                                        <Label text={this.t("cmbFirm")} alignment="right" />
                                        <NdSelectBox simple={true} parent={this} id="cmbFirm"
                                        displayExpr="NAME"
                                        valueExpr="GUID"
                                        value="00000000-0000-0000-0000-000000000000"
                                        searchEnabled={true}
                                        showClearButton={false}
                                        pageSize ={50}
                                        notRefresh={true}
                                        data={{source:{select:{query : `SELECT  '00000000-0000-0000-0000-000000000000' AS GUID,'ALL' AS NAME  UNION ALL SELECT GUID,NAME FROM COMPANY_VW_01`},sql:this.core.sql}}}
                                        onValueChanged={async ()=> { this.getDescription() }}/>
                                </Item>
                                <Item>
                                    <NdButton text={this.t("btnSave")} type="success" width="100%" onClick={this.btnSave} />
                                </Item>
                                <Item colSpan={2}>
                                    <NdTextArea simple={true} parent={this} id="txtDescription" height='300px' placeholder={this.t("txtDescriptionPlaceHolder")}/>
                                </Item>
                            </Form>
                        </div>
                    </div>
                    <NdToast id="toast" parent={this} displayTime={2000} position={{at:"top center",offset:'0px 110px'}}/>
                </ScrollView>
            </div>
        )
    }
}
