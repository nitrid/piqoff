import React from 'react';
import App from '../../../lib/app.js';
import { companyCls } from '../../../../core/cls/company.js';

import ScrollView from 'devextreme-react/scroll-view';
import Toolbar from 'devextreme-react/toolbar';
import Form, { Label,Item } from 'devextreme-react/form';

import NdTextBox, { Validator, NumericRule, RequiredRule, CompareRule, EmailRule, PatternRule, StringLengthRule, RangeRule, AsyncRule } from '../../../../core/react/devex/textbox.js'
import { dialog } from '../../../../core/react/devex/dialog.js';
import NbKeyboard from "../../../../core/react/bootstrap/keyboard.js";

export default class posCompanyInfo extends React.PureComponent
{
    constructor(props)
    {
        super(props);
        this.core = App.instance.core;
        this.lang = App.instance.lang;
        this.user = this.core.auth.data
        this.prmObj = App.instance.prmObj

        Number.money = this.prmObj.filter({ID:'MoneySymbol',TYPE:0}).getValue()

        this.companyObj = new companyCls();
    }
    async componentDidMount()
    {
        await this.core.util.waitUntil(0)
        this.init()
    }
    async init()
    {
        this.companyObj.clearAll();

        await this.companyObj.load()
        
        if(this.companyObj.dt().length == 0)
        {
            this.companyObj.addEmpty();
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
                                <Item location="after" locateInMenu="auto" widget="dxButton"
                                options=
                                {
                                    {
                                        type: 'default',
                                        icon: 'revert',
                                        onClick: async () => 
                                        {
                                            this.init()
                                        }
                                    }
                                }/>
                                <Item location="after" locateInMenu="auto" widget="dxButton"
                                options=
                                {
                                    {
                                        type: 'success',
                                        icon: 'floppy',
                                        onClick: async (e)=>
                                        {
                                            if(e.validationGroup.validate().status == "valid")
                                            {
                                                let tmpConfObj =
                                                {
                                                    id:'msgSave',showTitle:true,title:this.lang.t("posCompanyInfo.msgSave.title"),showCloseButton:true,width:'500px',height:'auto',
                                                    button:[{id:"btn01",caption:this.lang.t("posCompanyInfo.msgSave.btn01"),location:'before'},{id:"btn02",caption:this.lang.t("posCompanyInfo.msgSave.btn02"),location:'after'}],
                                                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("posCompanyInfo.msgSave.msg")}</div>)
                                                }
                                                
                                                let pResult = await dialog(tmpConfObj);
                                                if(pResult == 'btn01')
                                                {
                                                    let tmpConfObj1 =
                                                    {
                                                        id:'msgSaveResult',showTitle:true,title:this.lang.t("posCompanyInfo.msgSaveResult.title"),showCloseButton:true,width:'500px',height:'auto',
                                                        button:[{id:"btn01",caption:this.lang.t("posCompanyInfo.msgSaveResult.btn01"),location:'after'}],
                                                    }
                                                    if((await this.companyObj.save()) == 0)
                                                    {          
                                                        let tmpJetData =
                                                        {
                                                            CUSER:this.core.auth.data.CODE,            
                                                            DEVICE:'',
                                                            CODE:'410',
                                                            NAME:"Modification des informations de l'asujetti.", //BAK
                                                            DESCRIPTION:'',
                                                            APP_VERSION:this.core.appInfo.version
                                                        }
                                                        this.core.socket.emit('nf525',{cmd:"jet",data:tmpJetData})
        
                                                        tmpConfObj1.content = (<div style={{textAlign:"center",fontSize:"20px",color:"green"}}>{this.lang.t("posCompanyInfo.msgSaveResult.msgSuccess")}</div>)
                                                        await dialog(tmpConfObj1);
                                                    }
                                                    else
                                                    {
                                                        tmpConfObj1.content = (<div style={{textAlign:"center",fontSize:"20px",color:"red"}}>{this.lang.t("posCompanyInfo.msgSaveResult.msgFailed")}</div>)
                                                        await dialog(tmpConfObj1);
                                                    }
                                                }
                                            }                              
                                            else
                                            {
                                                let tmpConfObj =
                                                {
                                                    id:'msgSaveValid',showTitle:true,title:this.lang.t("posCompanyInfo.msgSaveValid.title"),showCloseButton:true,width:'500px',height:'auto',
                                                    button:[{id:"btn01",caption:this.lang.t("posCompanyInfo.msgSaveValid.btn01"),location:'after'}],
                                                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("posCompanyInfo.msgSaveValid.msg")}</div>)
                                                }
                                                
                                                await dialog(tmpConfObj);
                                            }
                                        }
                                    }
                                }/>
                                <Item location="after" locateInMenu="auto" widget="dxButton"
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
                            <Form colCount={2} id={"frmCompany"}>
                                {/* txtTitle */}
                                <Item>
                                    <Label text={this.lang.t("posCompanyInfo.txtTitle")} alignment="right" />
                                    <NdTextBox id="txtTitle" parent={this} simple={true} selectAll={false}
                                    dt={{data:this.companyObj.dt('COMPANY'),field:"NAME"}}
                                    onFocusIn={()=>
                                    {
                                        this.keyboardRef.inputName = "txtTitle"
                                        this.keyboardRef.setInput(this.txtTitle.value)
                                    }}>
                                        <Validator validationGroup={"frmCompany"}>
                                            <RequiredRule message={this.lang.t("posCompanyInfo.validation.notValid")} />
                                        </Validator> 
                                    </NdTextBox>
                                </Item>
                                {/* txtBrandName */}
                                <Item>
                                    <Label text={this.lang.t("posCompanyInfo.txtBrandName")} alignment="right" />
                                    <NdTextBox id="txtBrandName" parent={this} simple={true} selectAll={false} maxLength={50}
                                    dt={{data:this.companyObj.dt('COMPANY'),field:"BRAND_NAME"}}
                                    onFocusIn={()=>
                                    {
                                        this.keyboardRef.inputName = "txtBrandName"
                                        this.keyboardRef.setInput(this.txtBrandName.value)
                                    }}/>
                                </Item>
                                {/* txtCustomerName */}
                                <Item>
                                    <Label text={this.lang.t("posCompanyInfo.txtCustomerName")} alignment="right" />
                                    <NdTextBox id="txtCustomerName" parent={this} simple={true} selectAll={false} maxLength={50}
                                    dt={{data:this.companyObj.dt('COMPANY'),field:"OFFICIAL_NAME"}}
                                    onFocusIn={()=>
                                    {
                                        this.keyboardRef.inputName = "txtCustomerName"
                                        this.keyboardRef.setInput(this.txtCustomerName.value)
                                    }}>
                                        <Validator validationGroup={"frmCompany"}>
                                            <RequiredRule message={this.lang.t("posCompanyInfo.validation.notValid")} />
                                        </Validator> 
                                    </NdTextBox>
                                </Item>
                                {/* txtCustomerLastname */}
                                <Item>
                                    <Label text={this.lang.t("posCompanyInfo.txtCustomerLastname")} alignment="right" />
                                    <NdTextBox id="txtCustomerLastname" parent={this} simple={true} selectAll={false} maxLength={50}
                                    dt={{data:this.companyObj.dt('COMPANY'),field:"OFFICIAL_SURNAME"}}
                                    onFocusIn={()=>
                                    {
                                        this.keyboardRef.inputName = "txtCustomerLastname"
                                        this.keyboardRef.setInput(this.txtCustomerLastname.value)
                                    }}>       
                                        <Validator validationGroup={"frmCompany"}>
                                            <RequiredRule message={this.lang.t("posCompanyInfo.validation.notValid")} />
                                        </Validator>                                
                                    </NdTextBox>
                                </Item>                                
                                {/* txtPhone */}
                                <Item>
                                    <Label text={this.lang.t("posCompanyInfo.txtPhone")} alignment="right" />
                                    <NdTextBox id="txtPhone" parent={this} simple={true} selectAll={false} maxLength={50}
                                    dt={{data:this.companyObj.dt('COMPANY'),field:"TEL"}}
                                    onFocusIn={()=>
                                    {
                                        this.keyboardRef.inputName = "txtPhone"
                                        this.keyboardRef.setInput(this.txtPhone.value)
                                    }}>
                                        <Validator validationGroup={"frmCompany"}>
                                            <RequiredRule message={this.lang.t("posCompanyInfo.validation.notValid")} />
                                        </Validator> 
                                    </NdTextBox>
                                </Item>
                                {/* txtEmail */}
                                <Item>
                                    <Label text={this.lang.t("posCompanyInfo.txtEmail")} alignment="right" />
                                    <NdTextBox id="txtEmail" upper={false} parent={this} simple={true} selectAll={false} maxLength={50}
                                    dt={{data:this.companyObj.dt('COMPANY'),field:"MAIL"}}
                                    onFocusIn={()=>
                                    {
                                        this.keyboardRef.inputName = "txtEmail"
                                        this.keyboardRef.setInput(this.txtEmail.value)
                                    }}>
                                        <Validator validationGroup={"frmCompany"}>
                                            <RequiredRule message={this.lang.t("posCompanyInfo.validation.notValid")} />
                                        </Validator> 
                                    </NdTextBox>
                                </Item>
                                {/* txtWeb */}
                                <Item>
                                    <Label text={this.lang.t("posCompanyInfo.txtWeb")} alignment="right" />
                                    <NdTextBox id="txtWeb" upper={false} parent={this} simple={true} selectAll={false} maxLength={50}
                                    dt={{data:this.companyObj.dt('COMPANY'),field:"WEB"}}
                                    onFocusIn={()=>
                                    {
                                        this.keyboardRef.inputName = "txtWeb"
                                        this.keyboardRef.setInput(this.txtWeb.value)
                                    }}>
                                        <Validator validationGroup={"frmCompany"}>
                                            <RequiredRule message={this.lang.t("posCompanyInfo.validation.notValid")} />
                                        </Validator> 
                                    </NdTextBox>
                                </Item>
                                {/* txtRSC */}
                                <Item>
                                    <Label text={this.lang.t("posCompanyInfo.txtRSC")} alignment="right" />
                                    <NdTextBox id="txtRSC" parent={this} simple={true} selectAll={false} maxLength={50}
                                    dt={{data:this.companyObj.dt('COMPANY'),field:"RCS"}}
                                    onFocusIn={()=>
                                    {
                                        this.keyboardRef.inputName = "txtRSC"
                                        this.keyboardRef.setInput(this.txtRSC.value)
                                    }}>
                                        <Validator validationGroup={"frmCompany"}>
                                            <RequiredRule message={this.lang.t("posCompanyInfo.validation.notValid")} />
                                        </Validator> 
                                    </NdTextBox>
                                </Item>
                                {/* txtApeCode */}
                                <Item>
                                    <Label text={this.lang.t("posCompanyInfo.txtApeCode")} alignment="right" />
                                    <NdTextBox id="txtApeCode" parent={this} simple={true} selectAll={false} maxLength={50}
                                    dt={{data:this.companyObj.dt('COMPANY'),field:"APE_CODE"}}
                                    onFocusIn={()=>
                                    {
                                        this.keyboardRef.inputName = "txtApeCode"
                                        this.keyboardRef.setInput(this.txtApeCode.value)
                                    }}>
                                        <Validator validationGroup={"frmCompany"}>
                                            <RequiredRule message={this.lang.t("posCompanyInfo.validation.notValid")} />
                                        </Validator> 
                                    </NdTextBox>
                                </Item>
                                {/* txtTaxOffice */}
                                <Item>
                                    <Label text={this.lang.t("posCompanyInfo.txtTaxOffice")} alignment="right" />
                                    <NdTextBox id="txtTaxOffice" parent={this} simple={true} selectAll={false} maxLength={50}
                                    dt={{data:this.companyObj.dt('COMPANY'),field:"TAX_OFFICE"}}
                                    onFocusIn={()=>
                                    {
                                        this.keyboardRef.inputName = "txtTaxOffice"
                                        this.keyboardRef.setInput(this.txtTaxOffice.value)
                                    }}>
                                        <Validator validationGroup={"frmCompany"}>
                                            <RequiredRule message={this.lang.t("posCompanyInfo.validation.notValid")} />
                                        </Validator> 
                                    </NdTextBox>
                                </Item>
                                {/* txtTaxNo */}
                                <Item>
                                    <Label text={this.lang.t("posCompanyInfo.txtTaxNo")} alignment="right" />
                                    <NdTextBox id="txtTaxNo" parent={this} simple={true} selectAll={false} maxLength={50}
                                    dt={{data:this.companyObj.dt('COMPANY'),field:"TAX_NO"}}
                                    onFocusIn={()=>
                                    {
                                        this.keyboardRef.inputName = "txtTaxNo"
                                        this.keyboardRef.setInput(this.txtTaxNo.value)
                                    }}>
                                        <Validator validationGroup={"frmCompany"}>
                                            <RequiredRule message={this.lang.t("posCompanyInfo.validation.notValid")} />
                                        </Validator> 
                                    </NdTextBox>
                                </Item>
                                {/* txtIntVatNo */}
                                <Item>
                                        <Label text={this.lang.t("posCompanyInfo.txtIntVatNo")} alignment="right" />
                                        <NdTextBox id="txtIntVatNo" parent={this} simple={true} selectAll={false} maxLength={50}
                                        dt={{data:this.companyObj.dt('COMPANY'),field:"INT_VAT_NO"}}
                                        onFocusIn={()=>
                                        {
                                            this.keyboardRef.inputName = "txtIntVatNo"
                                            this.keyboardRef.setInput(this.txtIntVatNo.value)
                                        }}> 
                                            <Validator validationGroup={"frmCompany"}>
                                                <RequiredRule message={this.lang.t("posCompanyInfo.validation.notValid")} />
                                            </Validator> 
                                    </NdTextBox>
                                </Item>
                                {/* txtSirenNo */}
                                <Item>
                                    <Label text={this.lang.t("posCompanyInfo.txtSirenNo")} alignment="right" />
                                    <NdTextBox id="txtSirenNo" parent={this} simple={true} selectAll={false} maxLength={50}
                                    dt={{data:this.companyObj.dt('COMPANY'),field:"SIREN_NO"}}
                                    onFocusIn={()=>
                                    {
                                        this.keyboardRef.inputName = "txtSirenNo"
                                        this.keyboardRef.setInput(this.txtSirenNo.value)
                                    }}>
                                        <Validator validationGroup={"frmCompany"}>
                                            <RequiredRule message={this.lang.t("posCompanyInfo.validation.notValid")} />
                                        </Validator> 
                                    </NdTextBox>
                                </Item>
                                {/* txtSiretId */}
                                <Item>
                                    <Label text={this.lang.t("posCompanyInfo.txtSiretId")} alignment="right" />
                                    <NdTextBox id="txtSiretId" parent={this} simple={true} selectAll={false} maxLength={50}
                                    dt={{data:this.companyObj.dt('COMPANY'),field:"SIRET_ID"}}
                                    onFocusIn={()=>
                                    {
                                        this.keyboardRef.inputName = "txtSiretId"
                                        this.keyboardRef.setInput(this.txtSiretId.value)
                                    }}>
                                        <Validator validationGroup={"frmCompany"}>
                                            <RequiredRule message={this.lang.t("posCompanyInfo.validation.notValid")} />
                                        </Validator> 
                                    </NdTextBox>
                                </Item>
                                {/* txtAddress */}
                                <Item>
                                    <Label text={this.lang.t("posCompanyInfo.txtAddress")} alignment="right" />
                                    <NdTextBox id="txtAddress" parent={this} simple={true} selectAll={false} maxLength={50}
                                    dt={{data:this.companyObj.dt('COMPANY'),field:"ADDRESS"}}
                                    onFocusIn={()=>
                                    {
                                        this.keyboardRef.inputName = "txtAddress"
                                        this.keyboardRef.setInput(this.txtAddress.value)
                                    }}>
                                        <Validator validationGroup={"frmCompany"}>
                                            <RequiredRule message={this.lang.t("posCompanyInfo.validation.notValid")} />
                                        </Validator> 
                                    </NdTextBox>
                                </Item>
                                {/* txtCountry */}
                                <Item>
                                    <Label text={this.lang.t("posCompanyInfo.txtCountry")} alignment="right"/>
                                    <NdTextBox id="txtCountry" simple={true} parent={this} selectAll={false} maxLength={50}
                                    dt={{data:this.companyObj.dt('COMPANY'),field:"COUNTRY"}}
                                    onFocusIn={()=>
                                    {
                                        this.keyboardRef.inputName = "txtCountry"
                                        this.keyboardRef.setInput(this.txtCountry.value)
                                    }}>
                                        <Validator validationGroup={"frmCompany"}>
                                            <RequiredRule message={this.lang.t("posCompanyInfo.validation.notValid")} />
                                        </Validator> 
                                    </NdTextBox>
                                </Item>
                                {/* txtZipCode */}
                                <Item>
                                    <Label text={this.lang.t("posCompanyInfo.txtZipCode")} alignment="right" />
                                    <NdTextBox id="txtZipCode" simple={true} parent={this} selectAll={false} maxLength={7}
                                    dt={{data:this.companyObj.dt('COMPANY'),field:"ZIPCODE"}}
                                    onFocusIn={()=>
                                    {
                                        this.keyboardRef.inputName = "txtZipCode"
                                        this.keyboardRef.setInput(this.txtZipCode.value)
                                    }}>
                                        <Validator validationGroup={"frmCompany"}>
                                            <RequiredRule message={this.lang.t("posCompanyInfo.validation.notValid")}/>
                                        </Validator> 
                                    </NdTextBox>
                                </Item>
                                {/* txtCity */}
                                <Item>
                                    <Label text={this.lang.t("posCompanyInfo.txtCity")} alignment="right" />
                                    <NdTextBox id="txtCity" simple={true} parent={this} selectAll={false} maxLength={50}
                                    dt={{data:this.companyObj.dt('COMPANY'),field:"CITY"}}
                                    onFocusIn={()=>
                                    {
                                        this.keyboardRef.inputName = "txtCity"
                                        this.keyboardRef.setInput(this.txtCity.value)
                                    }}>
                                        <Validator validationGroup={"frmCompany"}>
                                            <RequiredRule message={this.lang.t("posCompanyInfo.validation.notValid")}/>
                                        </Validator> 
                                    </NdTextBox>
                                </Item>
                            </Form>
                        </div>
                    </div>
                    <div style={{position:"fixed",bottom:0,left:0,width:"100%",zIndex:1000}}>
                        <NbKeyboard id={"keyboardRef"} parent={this} autoPosition={false} keyType={this.prmObj.filter({ID:'KeyType',TYPE:0,USERS:this.user.CODE}).getValue()}/>
                    </div>
                </ScrollView>
            </div>
        )
    }
}