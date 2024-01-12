import React from 'react';
import App from '../../../lib/app.js';
import { companyCls } from '../../../../core/cls/company.js';

import ScrollView from 'devextreme-react/scroll-view';
import Toolbar from 'devextreme-react/toolbar';
import Form, { Label,Item } from 'devextreme-react/form';
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

export default class CustomerCard extends React.PureComponent
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
            console.log(this.pagePrm.GUID)
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
                this.btnPrint.setState({disabled:false});
            }
        })
        this.companyObj.ds.on('onEdit',(pTblName,pData) =>
        {            
            if(pData.rowData.stat == 'edit')
            {
                this.btnBack.setState({disabled:false});
                this.btnSave.setState({disabled:false});
                this.btnPrint.setState({disabled:false});

                pData.rowData.CUSER = this.user.CODE
            }                 
        })
        this.companyObj.ds.on('onRefresh',(pTblName) =>
        {            
            this.btnBack.setState({disabled:true});
            this.btnSave.setState({disabled:false});
            this.btnPrint.setState({disabled:false});          
        })
        this.companyObj.ds.on('onDelete',(pTblName) =>
        {            
            this.btnBack.setState({disabled:false});
            this.btnSave.setState({disabled:false});
            this.btnPrint.setState({disabled:false});
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
                                    <NdButton id="btnPrint" parent={this} icon="print" type="default"
                                    onClick={()=>
                                    {
                                        this.popDesign.show()
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
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <Form colCount={2} id={"frmCompany"  + this.tabIndex}>
                                {/* txtTitle */}
                                <Item colSpan={2}>
                                    <Label text={this.t("txtTitle")} alignment="right" />
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
                                </Item>
                                {/* txtBrandName */}
                                <Item colSpan={2}>
                                    <Label text={this.t("txtBrandName")} alignment="right" />
                                    <NdTextBox id="txtBrandName" parent={this} simple={true} tabIndex={this.tabIndex} 
                                    dt={{data:this.companyObj.dt('COMPANY'),field:"BRAND_NAME"}}
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    maxLength={50}
                                    >
                                    </NdTextBox>
                                </Item>
                                {/* txtCustomerName */}
                                <Item>
                                    <Label text={this.t("txtCustomerName")} alignment="right" />
                                    <NdTextBox id="txtCustomerName" parent={this} simple={true} tabIndex={this.tabIndex} 
                                    dt={{data:this.companyObj.dt('COMPANY'),field:"OFFICIAL_NAME"}}
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    maxLength={50}
                                    >                
                                        <Validator validationGroup={"frmCompany"  + this.tabIndex}>
                                            <RequiredRule message={this.t("validation.notValid")} />
                                        </Validator> 
                                    </NdTextBox>
                                </Item>
                                {/* txtCustomerLastname */}
                                <Item>
                                    <Label text={this.t("txtCustomerLastname")} alignment="right" />
                                        <NdTextBox id="txtCustomerLastname" parent={this} simple={true} tabIndex={this.tabIndex} 
                                        upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                        dt={{data:this.companyObj.dt('COMPANY'),field:"OFFICIAL_SURNAME"}}
                                        maxLength={50}
                                        >       
                                        <Validator validationGroup={"frmCompany"  + this.tabIndex}>
                                            <RequiredRule message={this.t("validation.notValid")} />
                                        </Validator>                                
                                    </NdTextBox>
                                </Item>
                                {/* txtAddress1 */}
                                <Item colSpan={2}>
                                    <Label text={this.t("txtAddress1")} alignment="right" />
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
                                </Item>
                                {/* txtAddress2 */}
                                <Item colSpan={1}>
                                    <Label text={this.t("txtAddress2")} alignment="right" />
                                    <NdTextBox id="txtAddress2" parent={this} simple={true} tabIndex={this.tabIndex} dt={{data:this.companyObj.dt('COMPANY'),field:"ADDRESS2"}}
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    onChange={(async()=>
                                    {
                                      
                                    }).bind(this)}
                                    >
                                    </NdTextBox>
                                </Item>
                                 {/* cmbCountry */}
                                 <Item>
                                    <Label text={this.t("cmbCountry")} alignment="right" />
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
                                        
                                </Item>
                                {/* cmbZipCode */}
                                <Item>
                                    <Label text={this.t("cmbZipCode")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbZipCode"
                                    dt={{data:this.companyObj.dt('COMPANY'),field:"ZIPCODE"}}
                                    displayExpr="ZIPNAME"                       
                                    valueExpr="ZIPCODE"
                                    value=""
                                    searchEnabled={true}
                                    showClearButton={true}
                                    pageSize ={50}
                                    notRefresh = {true}
                                    >
                                          <Validator validationGroup={"frmCompany"  + this.tabIndex}>
                                            <RequiredRule message={this.t("validation.notValid")} />
                                        </Validator> 
                                    </NdSelectBox>
                                </Item>
                                {/* cmbCity */}
                                <Item>
                                    <Label text={this.t("cmbCity")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbCity"
                                    dt={{data:this.companyObj.dt('COMPANY'),field:"CITY"}}
                                    displayExpr="PLACE"                       
                                    valueExpr="PLACE"
                                    value=""
                                    searchEnabled={true}
                                    showClearButton={true}
                                    pageSize ={50}
                                    notRefresh = {true}
                                    >
                                          <Validator validationGroup={"frmCompany"  + this.tabIndex}>
                                            <RequiredRule message={this.t("validation.notValid")} />
                                        </Validator> 
                                    </NdSelectBox>
                                </Item>
                               
                                {/* txtPhone */}
                                <Item>
                                    <Label text={this.t("txtPhone")} alignment="right" />
                                    <NdTextBox id="txtPhone" parent={this} simple={true} dt={{data:this.companyObj.dt('COMPANY'),field:"TEL"}}
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value} maxLength={50}>
                                        <Validator validationGroup={"frmCompany"  + this.tabIndex}>
                                            <RequiredRule message={this.t("validation.notValid")} />
                                        </Validator> 
                                    </NdTextBox>
                                </Item>
                                {/* txtEmail */}
                                <Item>
                                    <Label text={this.t("txtEmail")} alignment="right" />
                                    <NdTextBox id="txtEmail" upper={false} parent={this} simple={true} dt={{data:this.companyObj.dt('COMPANY'),field:"MAIL"}} maxLength={50} >
                                    <Validator validationGroup={"frmCompany"  + this.tabIndex}>
                                            <RequiredRule message={this.t("validation.notValid")} />
                                        </Validator> 
                                    </NdTextBox>
                                </Item>
                                {/* txtWeb */}
                                <Item>
                                    <Label text={this.t("txtWeb")} alignment="right" />
                                    <NdTextBox id="txtWeb" upper={false} parent={this} simple={true} dt={{data:this.companyObj.dt('COMPANY'),field:"WEB"}} maxLength={50}>
                                    <Validator validationGroup={"frmCompany"  + this.tabIndex}>
                                            <RequiredRule message={this.t("validation.notValid")} />
                                        </Validator> 
                                    </NdTextBox>
                                </Item>
                                {/* txtRSC */}
                                <Item>
                                    <Label text={this.t("txtRSC")} alignment="right" />
                                    <NdTextBox id="txtRSC" parent={this} simple={true} dt={{data:this.companyObj.dt('COMPANY'),field:"RCS"}} 
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    maxLength={50}
                                    >
                                         <Validator validationGroup={"frmCompany"  + this.tabIndex}>
                                            <RequiredRule message={this.t("validation.notValid")} />
                                        </Validator> 
                                    </NdTextBox>
                                </Item>
                                {/* txtApeCode */}
                                <Item>
                                    <Label text={this.t("txtApeCode")} alignment="right" />
                                        <NdTextBox id="txtApeCode" parent={this} simple={true} dt={{data:this.companyObj.dt('COMPANY'),field:"APE_CODE"}} 
                                        upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                        maxLength={50}
                                        >
                                             <Validator validationGroup={"frmCompany"  + this.tabIndex}>
                                                <RequiredRule message={this.t("validation.notValid")} />
                                            </Validator> 
                                    </NdTextBox>
                                </Item>
                                {/* txtTaxOffice */}
                                <Item>
                                    <Label text={this.t("txtTaxOffice")} alignment="right" />
                                        <NdTextBox id="txtTaxOffice" parent={this} simple={true} dt={{data:this.companyObj.dt('COMPANY'),field:"TAX_OFFICE"}} 
                                        upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                        maxLength={50}>
                                             <Validator validationGroup={"frmCompany"  + this.tabIndex}>
                                            <RequiredRule message={this.t("validation.notValid")} />
                                        </Validator> 
                                    </NdTextBox>
                                </Item>
                                {/* txtTaxNo */}
                                <Item>
                                    <Label text={this.t("txtTaxNo")} alignment="right" />
                                        <NdTextBox id="txtTaxNo" parent={this} simple={true} dt={{data:this.companyObj.dt('COMPANY'),field:"TAX_NO"}} 
                                        upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                        maxLength={50}
                                        >
                                             <Validator validationGroup={"frmCompany"  + this.tabIndex}>
                                            <RequiredRule message={this.t("validation.notValid")} />
                                        </Validator> 
                                    </NdTextBox>
                                </Item>
                                {/* txtIntVatNo */}
                                <Item>
                                    <Label text={this.t("txtIntVatNo")} alignment="right" />
                                        <NdTextBox id="txtIntVatNo" parent={this} simple={true} dt={{data:this.companyObj.dt('COMPANY'),field:"INT_VAT_NO"}} 
                                        upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                        maxLength={50}>
                                             <Validator validationGroup={"frmCompany"  + this.tabIndex}>
                                            <RequiredRule message={this.t("validation.notValid")} />
                                        </Validator> 
                                    </NdTextBox>
                                </Item>
                                {/* txtSirenNo */}
                                <Item>
                                    <Label text={this.t("txtSirenNo")} alignment="right" />
                                    <NdTextBox id="txtSirenNo" parent={this} simple={true} dt={{data:this.companyObj.dt('COMPANY'),field:"SIREN_NO"}} 
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    maxLength={50}
                                    >
                                         <Validator validationGroup={"frmCompany"  + this.tabIndex}>
                                            <RequiredRule message={this.t("validation.notValid")} />
                                        </Validator> 
                                    </NdTextBox>
                                </Item>
                                  {/* txtSiretId */}
                                  <Item>
                                    <Label text={this.t("txtSiretId")} alignment="right" />
                                        <NdTextBox id="txtSiretId" parent={this} simple={true} dt={{data:this.companyObj.dt('COMPANY'),field:"SIRET_ID"}} 
                                        upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                        maxLength={50}

                                        >
                                             <Validator validationGroup={"frmCompany"  + this.tabIndex}>
                                            <RequiredRule message={this.t("validation.notValid")} />
                                        </Validator> 
                                    </NdTextBox>
                                </Item>
                               
                                {/* txtCapital */}
                                <Item>
                                    <Label text={this.t("txtCapital")} alignment="right" />
                                    <NdNumberBox id="txtCapital" parent={this} simple={true} dt={{data:this.companyObj.dt('COMPANY'),field:"CAPITAL"}} maxLength={50}/>
                                </Item>
                            </Form>
                        </div>
                    </div>
                </ScrollView>
            </div>
        )
    }
}