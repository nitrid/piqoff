import React from 'react';
import App from '../../../lib/app.js';
import { posDeviceCls} from '../../../../core/cls/pos.js';
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
import NdTextArea from '../../../../core/react/devex/textarea.js';

export default class printDescription extends React.PureComponent
{
    constructor(props)
    {
        super(props)
        this.core = App.instance.core;
        this.prmObj = this.param.filter({TYPE:1,USERS:this.user.CODE});
        this.prevCode = "";
        this.tabIndex = props.data.tabkey

        this._btnSave = this._btnSave.bind(this)
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
    async _btnSave()
    {
        let tmpQuery = 
        {
            query :"UPDATE  COMPANY SET PRINT_DESCRIPTION = @PRINT_DESCRIPTION WHERE((GUID = @GUID) OR (@GUID = '00000000-0000-0000-0000-000000000000'))",
            param : ['PRINT_DESCRIPTION:string|max','GUID:string|50'],
            value : [this.txtDescription.value,this.cmbFirm.value]
        }
        await this.core.sql.execute(tmpQuery) 
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
                                        showClearButton={true}
                                        pageSize ={50}
                                        notRefresh={true}
                                        data={{source:{select:{query : "SELECT  '00000000-0000-0000-0000-000000000000' AS GUID,'ALL' AS NAME  UNION ALL SELECT GUID,NAME FROM COMPANY_VW_01"},sql:this.core.sql}}}
                                        onValueChanged={async (e)=>
                                        {
                                           this.getDescription()
                                        }}/>
                                </Item>
                                <Item>
                                    <NdButton text={this.t("btnSave")} type="success" width="100%" onClick={this._btnSave} ></NdButton>
                                </Item>
                                <Item colSpan={2}>
                                    <NdTextArea simple={true} parent={this} id="txtDescription" height='300px' placeholder={this.t("txtDescriptionPlaceHolder")}
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
