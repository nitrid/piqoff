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
        console.log(this.sysPrmObj)
        

        
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
                    this.btnNew.setState({disabled:true});
                    this.btnBack.setState({disabled:false});
                }
                else
                {
                    this.btnNew.setState({disabled:false});
                    this.btnBack.setState({disabled:true});
                }
                
                this.btnSave.setState({disabled:false});
                this.btnDelete.setState({disabled:false});
                this.btnCopy.setState({disabled:false});
                this.btnPrint.setState({disabled:false});
            }
        })
        this.companyObj.ds.on('onEdit',(pTblName,pData) =>
        {            
            if(pData.rowData.stat == 'edit')
            {
                this.btnBack.setState({disabled:false});
                this.btnNew.setState({disabled:true});
                this.btnSave.setState({disabled:false});
                this.btnDelete.setState({disabled:false});
                this.btnCopy.setState({disabled:false});
                this.btnPrint.setState({disabled:false});

                pData.rowData.CUSER = this.user.CODE
            }                 
        })
        this.companyObj.ds.on('onRefresh',(pTblName) =>
        {            
            this.prevCode = this.companyObj.dt('COMPANY').length > 0 ? this.companyObj.dt('COMPANY')[0].CODE : '';
            this.btnBack.setState({disabled:true});
            this.btnNew.setState({disabled:false});
            this.btnSave.setState({disabled:true});
            this.btnDelete.setState({disabled:false});
            this.btnCopy.setState({disabled:false});
            this.btnPrint.setState({disabled:false});          
        })
        this.companyObj.ds.on('onDelete',(pTblName) =>
        {            
            this.btnBack.setState({disabled:false});
            this.btnNew.setState({disabled:true});
            this.btnSave.setState({disabled:false});
            this.btnDelete.setState({disabled:false});
            this.btnCopy.setState({disabled:false});
            this.btnPrint.setState({disabled:false});
        })

        this.companyObj.addEmpty();
        let tmpOffical = {...this.companyObj.customerOffical.empty}
        tmpOffical.CUSTOMER = this.companyObj.dt()[0].GUID 
        this.companyObj.customerOffical.addEmpty(tmpOffical)

        this.txtTitle.readOnly = true
        this.txtCode.value = ''
        this.setState({officalVisible:false})
        this.cmbType.props.onValueChanged()
        
    }
    async getCustomer(pCode)
    {
        this.companyObj.clearAll()
        await this.companyObj.load({CODE:pCode});
    }
    async checkZipcode(pCode)
    {
        return new Promise(async resolve =>
        {
            if(pCode !== '')
            {
                let tmpQuery = {
                    query :"SELECT COUNTRY_CODE,PLACE FROM ZIPCODE WHERE ZIPCODE = @ZIPCODE ",
                    param : ['ZIPCODE:string|50'],
                    value : [pCode]
                }
                let tmpData = await this.core.sql.execute(tmpQuery) 
                if(tmpData.result.recordset.length > 0)
                {
                    
                    this.cmbPopCity.value = tmpData.result.recordset[0].PLACE
                    this.cmbPopCountry.value = tmpData.result.recordset[0].COUNTRY_CODE
                    resolve(1)
                }
                else
                {
                    resolve(1) // KAYIT BULUNAMADI
                }
            }
            else
            {
                resolve(0) //PARAMETRE BOŞ
            }
        });
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
                                            if(this.prevCode != '')
                                            {
                                               this.init()
                                            }
                                        }}/>
                                </Item>
                                <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnSave" parent={this} icon="floppy" type="default" validationGroup={"frmCompany"  + this.tabIndex}
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
                                                    tmpConfObj1.content = (<div style={{textAlign:"center",fontSize:"20px",color:"green"}}>{this.t("msgSaveResult.msgSuccess")}</div>)
                                                    await dialog(tmpConfObj1);
                                                    this.btnSave.setState({disabled:true});
                                                    this.btnNew.setState({disabled:false});
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
                                    </NdTextBox>
                                </Item>
                                {/* txtCustomerName */}
                                <Item>
                                    <Label text={this.t("txtCustomerName")} alignment="right" />
                                    <NdTextBox id="txtCustomerName" parent={this} simple={true} tabIndex={this.tabIndex} dt={{data:this.companyObj.dt('COMPANY'),field:"OFFICIAL_NAME",filter:{TYPE:0}}}
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    maxLength={32}
                                    >                                      
                                    </NdTextBox>
                                </Item>
                                {/* txtCustomerLastname */}
                                <Item>
                                    <Label text={this.t("txtCustomerLastname")} alignment="right" />
                                        <NdTextBox id="txtCustomerLastname" parent={this} simple={true} tabIndex={this.tabIndex} 
                                        upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                        dt={{data:this.companyObj.dt('COMPANY'),field:"OFFICIAL_SURNAME",filter:{TYPE:0}}}
                                        maxLength={32}
                                        >                                      
                                    </NdTextBox>
                                </Item>
                                 {/* txtPhone1 */}
                                 <Item>
                                    <Label text={this.t("txtPhone")} alignment="right" />
                                        <NdTextBox id="txtPhone" parent={this} simple={true} dt={{data:this.companyObj.dt('COMPANY'),field:"TEL",filter:{TYPE:0}}}
                                        upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                        maxLength={32}
                                        access={this.access.filter({ELEMENT:'txtPhone1',USERS:this.user.CODE})}
                                       />
                                </Item>
                                 {/* txtEmail */}
                                 <Item>
                                    <Label text={this.t("txtEmail")} alignment="right" />
                                        <NdTextBox id="txtEmail" parent={this} simple={true} dt={{data:this.companyObj.dt('COMPANY'),field:"EMAIL",filter:{TYPE:0}}}
                                        upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                        maxLength={32}
                                         access={this.access.filter({ELEMENT:'txtEmail',USERS:this.user.CODE})}
                                        />
                                </Item>
                                 {/* txtWeb */}
                                 <Item>
                                    <Label text={this.t("txtWeb")} alignment="right" />
                                        <NdTextBox id="txtWeb" parent={this} simple={true} dt={{data:this.companyObj.dt('COMPANY'),field:"WEB"}} 
                                        upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                        maxLength={32}
                                         access={this.access.filter({ELEMENT:'txtWeb',USERS:this.user.CODE})}
                                        />
                                </Item>
                            </Form>
                        </div>
                        <div className='row px-2 pt-2'>
                            <div className='col-12'>
                                <TabPanel height="100%" onItemRendered={this._onItemRendered}>
                                    <Item title={this.t("tabTitleAdress")}>
                                        <div className='row px-2 py-2'>
                                            <div className='col-12'>
                                                <Toolbar>
                                                    <Item location="after">
                                                        <Button icon="add"
                                                        onClick={async ()=>
                                                        {
                                                            this.txtPopAdress.value = "";
                                                            this.cmbPopZipcode.value = "";
                                                            this.cmbPopCity.value = "";
                                                            this.cmbPopCountry.value = ''
                                                            this.popAdress.show();
                                                        }}/>
                                                    </Item>
                                                </Toolbar>
                                            </div>
                                        </div>
                                        <div className='row px-2 py-2'>
                                            <div className='col-12'>
                                                <NdGrid parent={this} id={"grdAdress"} 
                                                showBorders={true} 
                                                columnsAutoWidth={true} 
                                                allowColumnReordering={true} 
                                                allowColumnResizing={true} 
                                                height={'100%'} 
                                                width={'100%'}
                                                dbApply={false}
                                                >
                                                    <Paging defaultPageSize={5} />
                                                    <Editing mode="popup" allowUpdating={true} allowDeleting={true} />
                                                    <Column dataField="ADRESS" caption={this.t("grdAdress.clmAdress")} />
                                                    <Column dataField="ZIPCODE" caption={this.t("grdAdress.clmZipcode")} />
                                                    <Column dataField="CITY" caption={this.t("grdAdress.clmCity")}/>
                                                    <Column dataField="COUNTRY" caption={this.t("grdAdress.clmCountry")}/>
                                                </NdGrid>
                                            </div>
                                        </div>
                                    </Item>   
                                    <Item title={this.t("tabTitleLegal")}>
                                        <div className='row px-2 py-2'>
                                            <div className='col-12'>
                                                <NdGrid parent={this} id={"grdLegal"} 
                                                showBorders={true} 
                                                columnsAutoWidth={true} 
                                                allowColumnReordering={true} 
                                                allowColumnResizing={true} 
                                                height={'100%'} 
                                                width={'100%'}
                                                dbApply={false}
                                                >
                                                    <Paging defaultPageSize={5} />
                                                    <Editing mode="cell" allowUpdating={true} allowDeleting={false} />
                                                    <Column dataField="SIRET_ID" caption={this.t("grdLegal.clmSiretID")}/>
                                                    <Column dataField="APE_CODE" caption={this.t("grdLegal.clmApeCode")}/>
                                                    <Column dataField="TAX_OFFICE" caption={this.t("grdLegal.clmTaxOffice")}/>
                                                    <Column dataField="TAX_NO" caption={this.t("grdLegal.clmTaxNo")}/>
                                                    <Column dataField="INT_VAT_NO" caption={this.t("grdLegal.clmIntVatNo")}/>
                                                    <Column dataField="TAX_TYPE" caption={this.t("grdLegal.clmTaxType")} editCellRender={this._cellRoleRender}/>
                                                </NdGrid>
                                            </div>
                                        </div>
                                    </Item>  
                                    <Item title={this.t("tabTitleOffical")} visible={this.state.officalVisible}>
                                        <div className='row px-2 py-2'>
                                            <div className='col-12'>
                                                <Toolbar>
                                                    <Item location="after">
                                                        <Button icon="add"
                                                        onClick={async ()=>
                                                        {
                                                            this.txtPopName.value = "";
                                                            this.txtPopLastName.value = "";
                                                            this.txtPopPhone1.value = "";
                                                            this.txtPopPhone2.value = ''
                                                            this.txtPopGsmPhone.value = ''
                                                            this.txtPopOtherPhone.value = ''
                                                            this.txtPopMail.value = ''
                                                            this.popOffical.show();
                                                        }}/>
                                                    </Item>
                                                </Toolbar>
                                            </div>
                                        </div>
                                        <div className='row px-2 py-2'>
                                            <div className='col-12'>
                                                <NdGrid parent={this} id={"grdOffical"} 
                                                showBorders={true} 
                                                columnsAutoWidth={true} 
                                                allowColumnReordering={true} 
                                                allowColumnResizing={true} 
                                                height={'100%'} 
                                                width={'100%'}
                                                dbApply={false}
                                                >
                                                    <Paging defaultPageSize={5} />
                                                    <Editing mode="cell" allowUpdating={true} allowDeleting={true} />
                                                    <Column dataField="NAME" caption={this.t("grdOffical.clmName")}/>
                                                    <Column dataField="LAST_NAME" caption={this.t("grdOffical.clmLastName")}/>
                                                    <Column dataField="PHONE1" caption={this.t("grdOffical.clmPhone1")}/>
                                                    <Column dataField="PHONE2" caption={this.t("grdOffical.clmPhone2")}/>
                                                    <Column dataField="GSM_PHONE" caption={this.t("grdOffical.clmGsmPhone")}/>
                                                    <Column dataField="EMAIL" caption={this.t("grdOffical.clmEMail")}/>
                                                </NdGrid>
                                            </div>
                                        </div>
                                    </Item>  
                                    <Item title={this.t("tabCustomerBank")}>
                                    <div className='row px-2 py-2'>
                                            <div className='col-12'>
                                                <Toolbar>
                                                    <Item location="after">
                                                        <Button icon="add"
                                                        onClick={async ()=>
                                                        {
                                                            this.txtBankName.value = "";
                                                            this.txtBankIban.value = "";
                                                            this.txtBankOffice.value = "";
                                                            this.txtBankSwift.value = ''
                                                            this.popBank.show();
                                                        }}/>
                                                    </Item>
                                                </Toolbar>
                                            </div>
                                        </div>
                                        <div className='row px-2 py-2'>
                                            <div className='col-12'>
                                                <NdGrid parent={this} id={"grdBank"} 
                                                showBorders={true} 
                                                columnsAutoWidth={true} 
                                                allowColumnReordering={true} 
                                                allowColumnResizing={true} 
                                                height={'100%'} 
                                                width={'100%'}
                                                dbApply={false}
                                                >
                                                    <Paging defaultPageSize={5} />
                                                    <Editing mode="cell" allowUpdating={true} allowDeleting={true} />
                                                    <Column dataField="NAME" caption={this.t("grdBank.clmName")}/>
                                                    <Column dataField="IBAN" caption={this.t("grdBank.clmIban")}/>
                                                    <Column dataField="OFFICE" caption={this.t("grdBank.clmOffice")}/>
                                                    <Column dataField="SWIFT" caption={this.t("grdBank.clmSwift")}/>
                                                </NdGrid>
                                            </div>
                                        </div>
                                    </Item>
                                    <Item title={this.t("tabTitleDetail")}>
                                        <div className='row px-2 py-2'>
                                            <div className='col-12'>
                                               <Form colCount={6}>
                                                 {/* chkRebate */}
                                                <Item>
                                                    <Label text={this.t("chkRebate")} alignment="right" />
                                                        <NdCheckBox id="chkRebate" parent={this} value={false}  dt={{data:this.companyObj.dt('COMPANY'),field:"REBATE"}} ></NdCheckBox>
                                                </Item>
                                                {/* chkTaxSucre */}
                                                <Item>
                                                <Label text={this.t("chkTaxSucre")} alignment="right" />
                                                    <NdCheckBox id="chkTaxSucre" parent={this} value={false}  dt={{data:this.companyObj.dt('COMPANY'),field:"TAX_SUCRE"}} ></NdCheckBox>
                                                </Item>
                                               </Form>
                                            </div>
                                        </div>
                                    </Item>  
                                                                 
                                </TabPanel>
                            </div>
                        </div> 
                       
                    </div>
                     {/* Adres POPUP */}
                     <div>
                        <NdPopUp parent={this} id={"popAdress"} 
                        visible={false}
                        showCloseButton={true}
                        showTitle={true}
                        title={this.t("popAdress.title")}
                        container={"#root"} 
                        width={'500'}
                        height={'350'}
                        position={{of:'#root'}}
                        >
                            <Form colCount={1} height={'fit-content'}>
                                <Item>
                                    <Label text={this.t("popAdress.txtPopAdress")} alignment="right" />
                                    <NdTextBox id={"txtPopAdress"} parent={this} simple={true} 
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}/>
                                </Item>
                                <Item>
                                    <Label text={this.t("popAdress.cmbPopZipcode")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbPopZipcode" acceptCustomValue={true}
                                    displayExpr="ZIPNAME"                       
                                    valueExpr="ZIPCODE"
                                    value=""
                                    searchEnabled={true}
                                    showClearButton={true}
                                    pageSize={50}
                                    notRefresh={true}
                                    data={{source:{select:{query : "SELECT [COUNTRY_CODE],[ZIPCODE],[PLACE],ZIPCODE + ' ' + PLACE AS ZIPNAME  FROM [dbo].[ZIPCODE]"},sql:this.core.sql}}}
                                    />
                                </Item>
                                <Item>
                                    <Label text={this.t("popAdress.cmbPopCity")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbPopCity"
                                    displayExpr="CITYNAME"                       
                                    valueExpr="PLACE"
                                    value=""
                                    searchEnabled={true}
                                    showClearButton={true}
                                    pageSize ={50}
                                    notRefresh = {true}
                                    data={{source:{select:{query : "SELECT COUNTRY_CODE,ZIPCODE,PLACE,PLACE + ' ' + ZIPCODE AS CITYNAME  FROM [dbo].[ZIPCODE]"},sql:this.core.sql}}}
                                    />
                                </Item>
                                <Item>
                                    <Label text={this.t("popAdress.cmbPopCountry")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbPopCountry"
                                    displayExpr="NAME"                       
                                    valueExpr="CODE"
                                    value="FR"
                                    searchEnabled={true}
                                    showClearButton={true}
                                    data={{source:{select:{query : "SELECT CODE,NAME FROM COUNTRY ORDER BY NAME ASC"},sql:this.core.sql}}}
                                    />
                                </Item>
                                <Item>
                                    <div className='row'>
                                        <div className='col-6'>
                                            <NdButton text={this.lang.t("btnSave")} type="normal" stylingMode="contained" width={'100%'} 
                                            onClick={async ()=>
                                            {
                                                let tmpEmpty = {...this.companyObj.customerAdress.empty};
                                               
                                                
                                                tmpEmpty.TYPE = this.companyObj.customerAdress.dt().length
                                                tmpEmpty.ADRESS = this.txtPopAdress.value
                                                tmpEmpty.ZIPCODE = this.cmbPopZipcode.value
                                                tmpEmpty.CIYT = this.cmbPopCity.value
                                                tmpEmpty.COUNTRY = this.cmbPopCountry.value
                                                tmpEmpty.CUSTOMER = this.companyObj.dt()[0].GUID 

                                                this.companyObj.customerAdress.addEmpty(tmpEmpty);    
                                                this.popAdress.hide(); 
                                                
                                            }}/>
                                        </div>
                                        <div className='col-6'>
                                            <NdButton text={this.lang.t("btnCancel")} type="normal" stylingMode="contained" width={'100%'}
                                            onClick={()=>
                                            {
                                                this.popAdress.hide();  
                                            }}/>
                                        </div>
                                    </div>
                                </Item>
                            </Form>
                        </NdPopUp>
                    </div> 
                    {/* Yetkili POPUP */}
                    <div>
                        <NdPopUp parent={this} id={"popOffical"} 
                        visible={false}
                        showCloseButton={true}
                        showTitle={true}
                        title={this.t("popOffical.title")}
                        container={"#root"} 
                        width={'500'}
                        height={'500'}
                        position={{of:'#root'}}
                        >
                            <Form colCount={1} height={'fit-content'}>
                                <Item>
                                    <Label text={this.t("popOffical.txtPopName")}alignment="right" />
                                    <NdTextBox id={"txtPopName"} parent={this} simple={true} 
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}/>
                                </Item>
                                <Item>
                                    <Label text={this.t("popOffical.txtPopLastName")} alignment="right" />
                                    <NdTextBox simple={true} parent={this} id="txtPopLastName"
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    />
                                </Item>
                                <Item>
                                    <Label text={this.t("popOffical.txtPopPhone1")} alignment="right" />
                                    <NdTextBox simple={true} parent={this} id="txtPopPhone1"
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    />
                                </Item>
                                <Item>
                                    <Label text={this.t("popOffical.txtPopPhone2")} alignment="right" />
                                    <NdTextBox simple={true} parent={this} id="txtPopPhone2"
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    />
                                </Item>
                                <Item>
                                    <Label text={this.t("popOffical.txtPopGsmPhone")} alignment="right" />
                                    <NdTextBox simple={true} parent={this} id="txtPopGsmPhone"
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    />
                                </Item>
                                <Item>
                                    <Label text={this.t("popOffical.txtPopOtherPhone")} alignment="right" />
                                    <NdTextBox simple={true} parent={this} id="txtPopOtherPhone"
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    />
                                </Item>
                                <Item>
                                    <Label text={this.t("popOffical.txtPopMail")} alignment="right" />
                                    <NdTextBox simple={true} parent={this} id="txtPopMail"
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    />
                                </Item>
                                <Item>
                                    <div className='row'>
                                        <div className='col-6'>
                                            <NdButton text={this.lang.t("btnSave")} type="normal" stylingMode="contained" width={'100%'} 
                                            onClick={async ()=>
                                            {
                                                let tmpEmpty = {...this.companyObj.customerOffical.empty};
                                               
                                                
                                                tmpEmpty.TYPE = 1
                                                tmpEmpty.NAME = this.txtPopName.value
                                                tmpEmpty.LAST_NAME = this.txtPopLastName.value
                                                tmpEmpty.PHONE1 = this.txtPopPhone1.value
                                                tmpEmpty.PHONE2 = this.txtPopPhone2.value
                                                tmpEmpty.GSM_PHONE = this.txtPopGsmPhone.value
                                                tmpEmpty.OTHER_PHONE = this.txtPopOtherPhone.value          
                                                tmpEmpty.EMAIL = this.txtPopMail.value
                                                tmpEmpty.CUSTOMER = this.companyObj.dt()[0].GUID 

                                                this.companyObj.customerOffical.addEmpty(tmpEmpty);    
                                                this.popOffical.hide(); 
                                                
                                            }}/>
                                        </div>
                                        <div className='col-6'>
                                            <NdButton text={this.lang.t("btnCancel")} type="normal" stylingMode="contained" width={'100%'}
                                            onClick={()=>
                                            {
                                                this.popOffical.hide();  
                                            }}/>
                                        </div>
                                    </div>
                                </Item>
                            </Form>
                        </NdPopUp>
                    </div>  
                     {/* Banka POPUP */}
                     <div>
                        <NdPopUp parent={this} id={"popBank"} 
                        visible={false}
                        showCloseButton={true}
                        showTitle={true}
                        title={this.t("popBank.title")}
                        container={"#root"} 
                        width={'500'}
                        height={'350'}
                        position={{of:'#root'}}
                        >
                            <Form colCount={1} height={'fit-content'}>
                                <Item>
                                    <Label text={this.t("popBank.txtName")} alignment="right" />
                                    <NdTextBox id={"txtBankName"} parent={this} simple={true} 
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}/>
                                </Item>
                                <Item>
                                    <Label text={this.t("popBank.txtIban")} alignment="right" />
                                    <NdTextBox id={"txtBankIban"} parent={this} simple={true} 
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}/>
                                </Item>
                                <Item>
                                    <Label text={this.t("popBank.txtOffice")} alignment="right" />
                                    <NdTextBox id={"txtBankOffice"} parent={this} simple={true} 
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}/>
                                </Item>
                                <Item>
                                    <Label text={this.t("popBank.txtSwift")} alignment="right" />
                                    <NdTextBox id={"txtBankSwift"} parent={this} simple={true} 
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}/>
                                </Item>
                                <Item>
                                    <div className='row'>
                                        <div className='col-6'>
                                            <NdButton text={this.lang.t("btnSave")} type="normal" stylingMode="contained" width={'100%'} 
                                            onClick={async ()=>
                                            {
                                                let tmpEmpty = {...this.companyObj.customerBank.empty};
                                               
                                                
                                                tmpEmpty.NAME = this.txtBankName.value
                                                tmpEmpty.IBAN = this.txtBankIban.value
                                                tmpEmpty.OFFICE = this.txtBankOffice.value
                                                tmpEmpty.SWIFT = this.txtBankSwift.value
                                                tmpEmpty.CUSTOMER = this.companyObj.dt()[0].GUID 

                                                this.companyObj.customerBank.addEmpty(tmpEmpty);    
                                                this.popBank.hide(); 
                                                
                                            }}/>
                                        </div>
                                        <div className='col-6'>
                                            <NdButton text={this.lang.t("btnCancel")} type="normal" stylingMode="contained" width={'100%'}
                                            onClick={()=>
                                            {
                                                this.popBank.hide();  
                                            }}/>
                                        </div>
                                    </div>
                                </Item>
                            </Form>
                        </NdPopUp>
                    </div> 
                </ScrollView>
            </div>
        )
    }
}