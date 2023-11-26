import React from 'react';
import App from '../../../lib/app.js';
import { transportTypeCls} from '../../../../core/cls/doc.js';


import ScrollView from 'devextreme-react/scroll-view';
import Toolbar from 'devextreme-react/toolbar';
import Form, { Label,Item,EmptyItem } from 'devextreme-react/form';
import TabPanel from 'devextreme-react/tab-panel';
import { Button } from 'devextreme-react/button';

import NdTextBox, { Validator, NumericRule, RequiredRule, CompareRule, EmailRule, PatternRule, StringLengthRule, RangeRule, AsyncRule } from '../../../../core/react/devex/textbox.js'
import NdCheckBox from '../../../../core/react/devex/checkbox.js';
import NdPopGrid from '../../../../core/react/devex/popgrid.js';
import NdPopUp from '../../../../core/react/devex/popup.js';
import NdGrid,{Column,Editing,Paging,Scrolling} from '../../../../core/react/devex/grid.js';
import NdButton from '../../../../core/react/devex/button.js';
import { dialog } from '../../../../core/react/devex/dialog.js';
import { datatable } from '../../../../core/core.js';
import NdSelectBox from '../../../../core/react/devex/selectbox.js';


export default class mailSettings extends React.PureComponent
{
    // constructor(props)
    // {}
    // init()
    // {}
    state = {
        selectedCheckbox: null,
        otherMailValue: "",
    };
    
    handleCheckboxChange = (checkboxId) => {
        this.setState((prevState) => ({
            selectedCheckbox: prevState.selectedCheckbox === checkboxId ? null : checkboxId,
            otherMailValue: "",
        }));
    };
    render
    (

    )
    {
        return(
            <ScrollView>
                <div>
                    <div className='row pt-4'>
                        <div className='col-10 mx-auto'>
                            <Form colCount={4}>
                                <Item colSpan={3}>
                                    <Label text={this.t("txtMailService.title")} alignment="right" />
                                    <NdSelectBox id="txtMailService" parent={this} displayExpr="VALUE" valueExpr="ID" data={{source:[{ID:0,VALUE:this.t("txtMailService.gmail")},{ID:1,VALUE:this.t("txtMailService.outlook")},{ID:2,VALUE:this.t("txtMailService.yahoo")},{ID:3,VALUE:this.t("txtMailService.laposte")}]}}></NdSelectBox>
                                </Item>
                                <Item colSpan={1}> 
                                    <Label text={this.t("txtBoxOther")} alignment="right" />
                                    <NdTextBox id="txtBoxOther" parent={this} simple={true} placeholder={this.t("txtBoxOtherPlace")} maxLength={32}/>
                                </Item> 
                                <Item colSpan={4}>
                                    <Label text={this.t("txtBoxMail")} alignment="right" />
                                    <NdTextBox id="txtBoxMail" parent={this} simple={true} placeholder={this.t("txtBoxMailPlace")} maxLength={32}/>
                                </Item>
                                <Item colSpan={4}>
                                    <Label text={this.t("txtBoxPsswd")} alignment="right" />
                                    <NdTextBox id="txtBoxPsswd" parent={this} simple={true} placeholder={this.t("txtBoxPsswdPlace")} maxLength={32} mode='password'/>     
                                </Item> 
                                <Item colSpan={2}> 
                                    <Label text={this.t("txtBoxSmtp")} alignment="right" />
                                    <NdTextBox id="txtBoxSmtp" parent={this} simple={true} placeholder={this.t("txtBoxSmtpPlace")} maxLength={32}/>
                                </Item>
                                <Item colSpan={2}>
                                    <Label text={this.t("txtBoxPort")} alignment="right" />
                                    <NdTextBox id="txtBoxPort" parent={this} simple={true} placeholder={this.t("txtBoxPortPlace")} maxLength={32}/>
                                </Item>
                                <Item location="after" locateInMenu="auto" colSpan={4}>
                                    <NdButton id="btnSave" parent={this} icon="floppy" type="default" width="100%" text={this.t("btnSave")}/>
                                </Item>
                            </Form>
                        </div>
                    </div>  
                </div>
            </ScrollView>
        )
    }
}