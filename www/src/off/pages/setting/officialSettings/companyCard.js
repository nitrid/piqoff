import React from 'react';
import App from '../../../lib/app.js';
import { companyCls } from '../../../../core/cls/company.js';

import ScrollView from 'devextreme-react/scroll-view';
import Toolbar from 'devextreme-react/toolbar';
import  { Item } from 'devextreme-react/form';

import NdTextBox, { Validator, RequiredRule } from '../../../../core/react/devex/textbox.js'
import NdNumberBox from '../../../../core/react/devex/numberbox.js';
import NdSelectBox from '../../../../core/react/devex/selectbox.js';
import NdButton from '../../../../core/react/devex/button.js';
import { dialog } from '../../../../core/react/devex/dialog.js';
import {NdForm,NdItem,NdLabel} from '../../../../core/react/devex/form.js';
import {NdToast} from '../../../../core/react/devex/toast.js';

export default class CompanyCard extends React.PureComponent
{
    constructor(props)
    {
        super(props)
        this.core = App.instance.core;
        this.prmObj = this.param.filter({TYPE:1,USERS:this.user.CODE});
        this.companyObj = new companyCls();
        this.prevCode = "";
        this.state={officalVisible:true}
        this.tabIndex = props.data.tabkey
        this.sysPrmObj = this.param.filter({TYPE:0,USERS:this.user.CODE});

    }
    async componentDidMount()
    {
        await this.core.util.waitUntil(0)
        this.init()
        if(typeof this.pagePrm != 'undefined')
        {
            this.companyObj.clearAll()
            await this.companyObj.load({GUID:this.pagePrm.GUID});            
        }
    }
    async init()
    {
        this.companyObj.clearAll();

        this.companyObj.ds.on('onAddRow',(pTblName,pData) =>
        {
            if(pData.stat == 'new')
            {
                if(this.prevCode != '')
                {
                    this.btnBack.setState({disabled:false});
                }
                else
                {
                    this.btnBack.setState({disabled:true});
                }
                
                this.btnSave.setState({disabled:false});
            }
        })
        this.companyObj.ds.on('onEdit',(pTblName,pData) =>
        {            
            if(pData.rowData.stat == 'edit')
            {
                this.btnBack.setState({disabled:false});
                this.btnSave.setState({disabled:false});

                pData.rowData.CUSER = this.user.CODE
            }                 
        })
        this.companyObj.ds.on('onRefresh',(pTblName) =>
        {            
            this.btnBack.setState({disabled:true});
            this.btnSave.setState({disabled:false});         
        })
        this.companyObj.ds.on('onDelete',(pTblName) =>
        {            
            this.btnBack.setState({disabled:false});
            this.btnSave.setState({disabled:false});
        })
        await this.companyObj.load()
        if(this.companyObj.dt().length == 0)
        {
            this.companyObj.addEmpty();
        }
        if(this.companyObj.dt().length > 0)
        {
            let tmpQuery = 
            {
                query : "SELECT [ZIPCODE], ZIPCODE AS ZIPNAME  FROM [dbo].[ZIPCODE] WHERE COUNTRY_CODE = @COUNTRY_CODE GROUP BY ZIPCODE",
                param : ['COUNTRY_CODE:string|5'],
                value : [this.companyObj.dt()[0].COUNTRY]
            }
            let tmpData = await this.core.sql.execute(tmpQuery) 
            if(tmpData.result.recordset.length > 0)
            {   
                await this.cmbZipCode.setData(tmpData.result.recordset)
            }
            else
            {
                await this.cmbZipCode.setData([])
            }
            let tmpCityQuery = 
            {
                query : "SELECT [PLACE] FROM [dbo].[ZIPCODE] WHERE COUNTRY_CODE = @COUNTRY_CODE GROUP BY PLACE",
                param : ['COUNTRY_CODE:string|5'],
                value : [this.companyObj.dt()[0].COUNTRY]
            }
            let tmpCityData = await this.core.sql.execute(tmpCityQuery) 
            if(tmpCityData.result.recordset.length > 0)
            {   
                await this.cmbCity.setData(tmpCityData.result.recordset)
            }
            else
            {
                await this.cmbCity.setData([])
            }
        }
    }
    async getCustomer(pCode)
    {
        this.companyObj.clearAll()
        await this.companyObj.load({CODE:pCode});        
    }
    render()
    {
        return(
            <div>
                <NdToast id="toast" parent={this} displayTime={2000} position={{at:"top center",offset:'0px 110px'}}/>
                <ScrollView>
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <Toolbar>
                                <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnBack" parent={this} icon="revert" type="default"
                                        onClick={()=>
                                        {
                                            this.init()
                                        }}/>
                                </Item>
                                <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnSave" parent={this} icon="floppy" type="success" validationGroup={"frmCompany"  + this.tabIndex}
                                    onClick={async (e)=>
                                    {
                                        if(e.validationGroup.validate().status == "valid")
                                        {
                                            let tmpConfObj =
                                            {
                                                id:'msgSave',showTitle:true,title:this.t("msgSave.title"),showCloseButton:true,width:'500px',height:'auto',
                                                button:[{id:"btn01",caption:this.t("msgSave.btn01"),location:'before'},{id:"btn02",caption:this.t("msgSave.btn02"),location:'after'}],
                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgSave.msg")}</div>)
                                            }
                                            
                                            let pResult = await dialog(tmpConfObj);
                                            if(pResult == 'btn01')
                                            {
                                                let tmpConfObj1 =
                                                {
                                                    id:'msgSaveResult',showTitle:true,title:this.t("msgSave.title"),showCloseButton:true,width:'500px',height:'auto',
                                                    button:[{id:"btn01",caption:this.t("msgSave.btn01"),location:'after'}],
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

                                                    this.toast.show({message:this.t("msgSaveResult.msgSuccess"),type:"success"});
                                                    this.btnSave.setState({disabled:true});
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
                                                id:'msgSaveValid',showTitle:true,title:this.t("msgSaveValid.title"),showCloseButton:true,width:'500px',height:'auto',
                                                button:[{id:"btn01",caption:this.t("msgSaveValid.btn01"),location:'after'}],
                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgSaveValid.msg")}</div>)
                                            }
                                            
                                            await dialog(tmpConfObj);
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
                            <NdForm colCount={2} id={"frmCompany"  + this.tabIndex}>
                                {/* txtTitle */}
                                <NdItem colSpan={2}>
                                    <NdLabel text={this.t("txtTitle")} alignment="right" />
                                    <NdTextBox id="txtTitle" parent={this} simple={true} tabIndex={this.tabIndex} dt={{data:this.companyObj.dt('COMPANY'),field:"NAME"}}
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    onChange={(async()=>
                                    {
                                      
                                    }).bind(this)}
                                    >
                                        <Validator validationGroup={"frmCompany"  + this.tabIndex}>
                                            <RequiredRule message={this.t("validation.notValid")} />
                                        </Validator> 
                                    </NdTextBox>
                                </NdItem>
                                {/* txtBrandName */}
                                <NdItem colSpan={2}>
                                    <NdLabel text={this.t("txtBrandName")} alignment="right" />
                                    <NdTextBox id="txtBrandName" parent={this} simple={true} tabIndex={this.tabIndex} 
                                    dt={{data:this.companyObj.dt('COMPANY'),field:"BRAND_NAME"}}
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    maxLength={50}
                                    >
                                    </NdTextBox>
                                </NdItem>
                                {/* txtCustomerName */}
                                <NdItem>
                                    <NdLabel text={this.t("txtCustomerName")} alignment="right" />
                                    <NdTextBox id="txtCustomerName" parent={this} simple={true} tabIndex={this.tabIndex} 
                                    dt={{data:this.companyObj.dt('COMPANY'),field:"OFFICIAL_NAME"}}
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    maxLength={50}
                                    >                
                                        <Validator validationGroup={"frmCompany"  + this.tabIndex}>
                                            <RequiredRule message={this.t("validation.notValid")} />
                                        </Validator> 
                                    </NdTextBox>
                                </NdItem>
                                {/* txtCustomerLastname */}
                                <NdItem>
                                    <NdLabel text={this.t("txtCustomerLastname")} alignment="right" />
                                        <NdTextBox id="txtCustomerLastname" parent={this} simple={true} tabIndex={this.tabIndex} 
                                        upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                        dt={{data:this.companyObj.dt('COMPANY'),field:"OFFICIAL_SURNAME"}}
                                        maxLength={50}
                                        >       
                                        <Validator validationGroup={"frmCompany"  + this.tabIndex}>
                                            <RequiredRule message={this.t("validation.notValid")} />
                                        </Validator>                                
                                    </NdTextBox>
                                </NdItem>
                                {/* txtAddress1 */}
                                <NdItem colSpan={2}>
                                    <NdLabel text={this.t("txtAddress1")} alignment="right" />
                                    <NdTextBox id="txtAddress1" parent={this} simple={true} tabIndex={this.tabIndex} dt={{data:this.companyObj.dt('COMPANY'),field:"ADDRESS1"}}
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    onChange={(async()=>
                                    {
                                      
                                    }).bind(this)}
                                    >
                                        <Validator validationGroup={"frmCompany"  + this.tabIndex}>
                                            <RequiredRule message={this.t("validation.notValid")} />
                                        </Validator> 
                                    </NdTextBox>
                                </NdItem>
                                {/* txtAddress2 */}
                                <NdItem colSpan={1}>
                                    <NdLabel text={this.t("txtAddress2")} alignment="right" />
                                    <NdTextBox id="txtAddress2" parent={this} simple={true} tabIndex={this.tabIndex} dt={{data:this.companyObj.dt('COMPANY'),field:"ADDRESS2"}}
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    onChange={(async()=>
                                    {
                                      
                                    }).bind(this)}
                                    >
                                    </NdTextBox>
                                </NdItem>
                                 {/* cmbCountry */}
                                 <NdItem>
                                    <NdLabel text={this.t("cmbCountry")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbCountry"
                                    dt={{data:this.companyObj.dt('COMPANY'),field:"COUNTRY"}}
                                    displayExpr="NAME"                       
                                    valueExpr="CODE"
                                    value="FR"
                                    searchEnabled={true}
                                    showClearButton={true}
                                    data={{source:{select:{query : "SELECT CODE,NAME FROM COUNTRY ORDER BY NAME ASC"},sql:this.core.sql}}}
                                    onValueChanged={(async()=>
                                        {
                                            let tmpQuery = 
                                            {
                                                query : "SELECT [ZIPCODE], ZIPCODE AS ZIPNAME  FROM [dbo].[ZIPCODE] WHERE COUNTRY_CODE = @COUNTRY_CODE GROUP BY ZIPCODE",
                                                param : ['COUNTRY_CODE:string|5'],
                                                value : [this.cmbCountry.value]
                                            }
                                            let tmpData = await this.core.sql.execute(tmpQuery) 
                                            if(tmpData.result.recordset.length > 0)
                                            {   
                                                await this.cmbZipCode.setData(tmpData.result.recordset)
                                            }
                                            else
                                            {
                                                await this.cmbZipCode.setData([])
                                            }
                                            let tmpCityQuery = 
                                            {
                                                query : "SELECT [PLACE] FROM [dbo].[ZIPCODE] WHERE COUNTRY_CODE = @COUNTRY_CODE GROUP BY PLACE",
                                                param : ['COUNTRY_CODE:string|5'],
                                                value : [this.cmbCountry.value]
                                            }
                                            let tmpCityData = await this.core.sql.execute(tmpCityQuery) 
                                            if(tmpCityData.result.recordset.length > 0)
                                            {   
                                                await this.cmbCity.setData(tmpCityData.result.recordset)
                                            }
                                            else
                                            {
                                                await this.cmbCity.setData([])
                                            }
                                        }).bind(this)}
                                    >
                                        <Validator validationGroup={"frmCompany"  + this.tabIndex}>
                                            <RequiredRule message={this.t("validation.notValid")} />
                                        </Validator> 
                                    </NdSelectBox>
                                        
                                </NdItem>
                                {/* cmbZipCode */}
                                <NdItem>
                                    <NdLabel text={this.t("cmbZipCode")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbZipCode"
                                    dt={{data:this.companyObj.dt('COMPANY'),field:"ZIPCODE"}}
                                    displayExpr="ZIPNAME"                       
                                    valueExpr="ZIPCODE"
                                    value=""
                                    acceptCustomValue={true}
                                    searchEnabled={true}
                                    showClearButton={true}
                                    pageSize ={50}
                                    notRefresh = {true}
                                    onCustomItemCreating={async(e)=>
                                    {
                                        if (!e.text) 
                                        {
                                            e.customItem = null;
                                            return;
                                        }
                                        
                                        const { component, text } = e;
                                        const currentItems = component.option('items');
                                        
                                        const newItem = 
                                        {
                                            ZIPNAME: text.trim(),
                                            ZIPCODE: text.trim(),
                                        };
                                        
                                        const itemInDataSource = currentItems.find((item) => item.text === newItem.text)
                                        if (itemInDataSource) 
                                        {
                                            e.customItem = itemInDataSource;
                                        } 
                                        else 
                                        {    
                                            currentItems.push(newItem);
                                            component.option('items', currentItems);
                                            e.customItem = newItem;
                                        }
                                    }}
                                    >
                                          <Validator validationGroup={"frmCompany"  + this.tabIndex}>
                                            <RequiredRule message={this.t("validation.notValid")} />
                                        </Validator> 
                                    </NdSelectBox>
                                </NdItem>
                                {/* cmbCity */}
                                <NdItem>
                                    <NdLabel text={this.t("cmbCity")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbCity"
                                    dt={{data:this.companyObj.dt('COMPANY'),field:"CITY"}}
                                    displayExpr="PLACE"                       
                                    valueExpr="PLACE"
                                    value=""
                                    acceptCustomValue={true}
                                    searchEnabled={true}
                                    showClearButton={true}
                                    pageSize ={50}
                                    notRefresh = {true}
                                    onCustomItemCreating={async(e)=>
                                    {
                                        if (!e.text) 
                                        {
                                            e.customItem = null;
                                            return;
                                        }
                                        
                                        const { component, text } = e;
                                        const currentItems = component.option('items');
                                        
                                        const newItem = 
                                        {
                                            PLACE: text.trim(),
                                            PLACE: text.trim(),
                                        };
                                        
                                        const itemInDataSource = currentItems.find((item) => item.text === newItem.text)
                                        if (itemInDataSource) 
                                        {
                                            e.customItem = itemInDataSource;
                                        } 
                                        else 
                                        {    
                                            currentItems.push(newItem);
                                            component.option('items', currentItems);
                                            e.customItem = newItem;
                                        }
                                    }}
                                    >
                                          <Validator validationGroup={"frmCompany"  + this.tabIndex}>
                                            <RequiredRule message={this.t("validation.notValid")} />
                                        </Validator> 
                                    </NdSelectBox>
                                </NdItem>      
                                {/* txtPhone */}
                                <NdItem>
                                    <NdLabel text={this.t("txtPhone")} alignment="right" />
                                    <NdTextBox id="txtPhone" parent={this} simple={true} dt={{data:this.companyObj.dt('COMPANY'),field:"TEL"}}
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value} maxLength={50}>
                                        <Validator validationGroup={"frmCompany"  + this.tabIndex}>
                                            <RequiredRule message={this.t("validation.notValid")} />
                                        </Validator> 
                                    </NdTextBox>
                                </NdItem>
                                {/* txtEmail */}
                                <NdItem>
                                    <NdLabel text={this.t("txtEmail")} alignment="right" />
                                    <NdTextBox id="txtEmail" upper={false} parent={this} simple={true} dt={{data:this.companyObj.dt('COMPANY'),field:"MAIL"}} maxLength={50} >
                                    <Validator validationGroup={"frmCompany"  + this.tabIndex}>
                                            <RequiredRule message={this.t("validation.notValid")} />
                                        </Validator> 
                                    </NdTextBox>
                                </NdItem>
                                {/* txtWeb */}
                                <NdItem>
                                    <NdLabel text={this.t("txtWeb")} alignment="right" />
                                    <NdTextBox id="txtWeb" upper={false} parent={this} simple={true} dt={{data:this.companyObj.dt('COMPANY'),field:"WEB"}} maxLength={50}>
                                    <Validator validationGroup={"frmCompany"  + this.tabIndex}>
                                            <RequiredRule message={this.t("validation.notValid")} />
                                        </Validator> 
                                    </NdTextBox>
                                </NdItem>
                                {/* txtRSC */}
                                <NdItem>
                                    <NdLabel text={this.t("txtRSC")} alignment="right" />
                                    <NdTextBox id="txtRSC" parent={this} simple={true} dt={{data:this.companyObj.dt('COMPANY'),field:"RCS"}} 
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    maxLength={50}
                                    >
                                         <Validator validationGroup={"frmCompany"  + this.tabIndex}>
                                            <RequiredRule message={this.t("validation.notValid")} />
                                        </Validator> 
                                    </NdTextBox>
                                </NdItem>
                                {/* txtApeCode */}
                                <NdItem>
                                    <NdLabel text={this.t("txtApeCode")} alignment="right" />
                                        <NdTextBox id="txtApeCode" parent={this} simple={true} dt={{data:this.companyObj.dt('COMPANY'),field:"APE_CODE"}} 
                                        upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                        maxLength={50}
                                        >
                                             <Validator validationGroup={"frmCompany"  + this.tabIndex}>
                                                <RequiredRule message={this.t("validation.notValid")} />
                                            </Validator> 
                                    </NdTextBox>
                                </NdItem>
                                {/* txtTaxOffice */}
                                <NdItem>
                                    <NdLabel text={this.t("txtTaxOffice")} alignment="right" />
                                        <NdTextBox id="txtTaxOffice" parent={this} simple={true} dt={{data:this.companyObj.dt('COMPANY'),field:"TAX_OFFICE"}} 
                                        upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                        maxLength={50}>
                                             <Validator validationGroup={"frmCompany"  + this.tabIndex}>
                                            <RequiredRule message={this.t("validation.notValid")} />
                                        </Validator> 
                                    </NdTextBox>
                                </NdItem>
                                {/* txtTaxNo */}
                                <NdItem>
                                    <NdLabel text={this.t("txtTaxNo")} alignment="right" />
                                        <NdTextBox id="txtTaxNo" parent={this} simple={true} dt={{data:this.companyObj.dt('COMPANY'),field:"TAX_NO"}} 
                                        upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                        maxLength={50}
                                        >
                                             <Validator validationGroup={"frmCompany"  + this.tabIndex}>
                                            <RequiredRule message={this.t("validation.notValid")} />
                                        </Validator> 
                                    </NdTextBox>
                                </NdItem>
                                {/* txtIntVatNo */}
                                <NdItem>
                                    <NdLabel text={this.t("txtIntVatNo")} alignment="right" />
                                        <NdTextBox id="txtIntVatNo" parent={this} simple={true} dt={{data:this.companyObj.dt('COMPANY'),field:"INT_VAT_NO"}} 
                                        upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                        maxLength={50}>
                                             <Validator validationGroup={"frmCompany"  + this.tabIndex}>
                                            <RequiredRule message={this.t("validation.notValid")} />
                                        </Validator> 
                                    </NdTextBox>
                                </NdItem>
                                {/* txtSirenNo */}
                                <NdItem>
                                    <NdLabel text={this.t("txtSirenNo")} alignment="right" />
                                    <NdTextBox id="txtSirenNo" parent={this} simple={true} dt={{data:this.companyObj.dt('COMPANY'),field:"SIREN_NO"}} 
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    maxLength={50}
                                    >
                                         <Validator validationGroup={"frmCompany"  + this.tabIndex}>
                                            <RequiredRule message={this.t("validation.notValid")} />
                                        </Validator> 
                                    </NdTextBox>
                                </NdItem>
                                {/* txtSiretId */}
                                <NdItem>
                                <NdLabel text={this.t("txtSiretId")} alignment="right" />
                                    <NdTextBox id="txtSiretId" parent={this} simple={true} dt={{data:this.companyObj.dt('COMPANY'),field:"SIRET_ID"}} 
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    maxLength={50}
                                    >
                                            <Validator validationGroup={"frmCompany"  + this.tabIndex}>
                                            <RequiredRule message={this.t("validation.notValid")} />
                                        </Validator> 
                                    </NdTextBox>
                                </NdItem>                              
                                {/* txtCapital */}
                                <NdItem>
                                    <NdLabel text={this.t("txtCapital")} alignment="right" />
                                    <NdNumberBox id="txtCapital" parent={this} simple={true} dt={{data:this.companyObj.dt('COMPANY'),field:"CAPITAL"}} maxLength={50}/>
                                </NdItem>
                                {/* clmBankCode */}
                                <NdItem>
                                    <NdLabel text={this.t("clmBankCode")} alignment="right" />
                                    <NdTextBox id="clmBankCode" parent={this} simple={true} dt={{data:this.companyObj.dt('COMPANY'),field:"BANK_CODE"}} 
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    maxLength={50}
                                    >
                                         <Validator validationGroup={"frmCompany"  + this.tabIndex}>
                                            <RequiredRule message={this.t("validation.notValid")} />
                                        </Validator> 
                                    </NdTextBox>
                                </NdItem>
                                {/* clmAccountNo */}
                                <NdItem>
                                    <NdLabel text={this.t("clmAccountNo")} alignment="right" />
                                    <NdTextBox id="clmAccountNo" parent={this} simple={true} dt={{data:this.companyObj.dt('COMPANY'),field:"ACCOUNT_NO"}} 
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    maxLength={50}
                                    >
                                         <Validator validationGroup={"frmCompany"  + this.tabIndex}>
                                            <RequiredRule message={this.t("validation.notValid")} />
                                        </Validator> 
                                    </NdTextBox>
                                </NdItem>
                                {/* clmBIC */}
                                <NdItem>
                                    <NdLabel text={this.t("clmBIC")} alignment="right" />
                                    <NdTextBox id="clmBIC" parent={this} simple={true} dt={{data:this.companyObj.dt('COMPANY'),field:"BIC"}} 
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    maxLength={50}
                                    >
                                         <Validator validationGroup={"frmCompany"  + this.tabIndex}>
                                            <RequiredRule message={this.t("validation.notValid")} />
                                        </Validator> 
                                    </NdTextBox>
                                </NdItem>
                                {/* clmIBAN */}
                                <NdItem colSpan={2}>
                                    <NdLabel text={this.t("clmIBAN")} alignment="right" />
                                    <NdTextBox id="clmIBAN" parent={this} simple={true} dt={{data:this.companyObj.dt('COMPANY'),field:"IBAN"}} 
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    maxLength={50}
                                    >
                                        <Validator validationGroup={"frmCompany"  + this.tabIndex}>
                                            <RequiredRule message={this.t("validation.notValid")} />
                                        </Validator> 
                                    </NdTextBox>
                                </NdItem> 
                            </NdForm> 
                        </div>
                    </div>
                </ScrollView>
            </div>
        )
    }
}