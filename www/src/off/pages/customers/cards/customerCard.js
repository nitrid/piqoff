import React from 'react';
import App from '../../../lib/app.js';
import { customersCls,customerAdressCls, customerOfficalCls } from '../../../../core/cls/customers.js';

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

export default class CustomerCard extends React.Component
{
    constructor()
    {
        super()
        this.core = App.instance.core;
        this.prmObj = this.param.filter({TYPE:1,USERS:this.user.CODE});
        this.customerObj = new customersCls();
        this.prevCode = "";
        this.state={officalVisible:true}
        

        this._onItemRendered = this._onItemRendered.bind(this)
        this._cellRoleRender = this._cellRoleRender.bind(this)
        this.typeChange = this.typeChange.bind(this)
        
    }
    async componentDidMount()
    {
        await this.core.util.waitUntil(0)
        await this.init()
        if(typeof this.pagePrm != 'undefined')
        {
            this.getCustomer(this.pagePrm.CODE)
        }
    }
    async init()
    {
        this.customerObj.clearAll();

        this.customerObj.ds.on('onAddRow',(pTblName,pData) =>
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
        this.customerObj.ds.on('onEdit',(pTblName,pData) =>
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
        this.customerObj.ds.on('onRefresh',(pTblName) =>
        {            
            this.prevCode = this.customerObj.dt('CUSTOMERS').length > 0 ? this.customerObj.dt('CUSTOMERS')[0].CODE : '';
            this.btnBack.setState({disabled:true});
            this.btnNew.setState({disabled:false});
            this.btnSave.setState({disabled:true});
            this.btnDelete.setState({disabled:false});
            this.btnCopy.setState({disabled:false});
            this.btnPrint.setState({disabled:false});          
        })
        this.customerObj.ds.on('onDelete',(pTblName) =>
        {            
            this.btnBack.setState({disabled:false});
            this.btnNew.setState({disabled:true});
            this.btnSave.setState({disabled:false});
            this.btnDelete.setState({disabled:false});
            this.btnCopy.setState({disabled:false});
            this.btnPrint.setState({disabled:false});
        })

        this.customerObj.addEmpty();
        let tmpOffical = {...this.customerObj.customerOffical.empty}
        tmpOffical.CUSTOMER = this.customerObj.dt()[0].GUID 
        this.customerObj.customerOffical.addEmpty(tmpOffical)

        this.txtTitle.readOnly = true
        this.txtCode.value = ''
        this.setState({officalVisible:false})
        this.cmbType.props.onValueChanged()
        
    }
    async getCustomer(pCode)
    {
        this.customerObj.clearAll()
        await this.customerObj.load({CODE:pCode});
    }
    typeChange(pType)
    {
        if(pType== 0)
        {
            this.txtTitle.readOnly = true
            this.setState({officalVisible:false})
            this.txtTitle.setState({value:''})
        }
        else if(pType == 1)
        {
            this.txtTitle.readOnly = false
            this.setState({officalVisible:true})
        }
    }
    async checkCustomer(pCode)
    {
        return new Promise(async resolve =>
        {
            if(pCode !== '')
            {
                let tmpData = await new customersCls().load({CODE:pCode});

                if(tmpData.length > 0)
                {
                    let tmpConfObj = 
                    {
                        id: 'msgCode',
                        showTitle:true,
                        title:this.t("msgCode.title"),
                        showCloseButton:true,
                        width:'500px',
                        height:'200px',
                        button:[{id:"btn01",caption:this.t("msgCode.btn01"),location:'before'},{id:"btn02",caption:this.t("msgCode.btn02"),location:'after'}],
                        content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgCode.msg")}</div>)
                    }
    
                    let pResult = await dialog(tmpConfObj);
                    if(pResult == 'btn01')
                    {
                        this.getCustomer(pCode)
                        resolve(2) //KAYIT VAR
                    }
                    else
                    {
                        resolve(3) // TAMAM BUTONU
                    }
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
    async _onCustomerRendered(e)
    {
        await this.core.util.waitUntil(10)
    }
    async _onItemRendered(e)
    {
        await this.core.util.waitUntil(10)
        if(e.itemData.title == this.t("tabTitleAdress"))
        {        
            await this.grdAdress.dataRefresh({source:this.customerObj.customerAdress.dt('CUSTOMER_ADRESS')});
        }
        if(e.itemData.title == this.t("tabTitleOffical"))
        {        
            await this.grdOffical.dataRefresh({source:this.customerObj.customerOffical.dt('CUSTOMER_OFFICAL')});
        }
        if(e.itemData.title == this.t("tabTitleLegal"))
        {        
            await this.grdLegal.dataRefresh({source:this.customerObj.dt('CUSTOMERS')});
        }
        if(e.itemData.title == this.t("tabCustomerBank"))
        {        
            await this.grdBank.dataRefresh({source:this.customerObj.customerBank.dt('CUSTOMER_BANK')});
        }
    }
    _cellRoleRender(e)
    {
        return (
            <NdSelectBox 
                parent={this}                             
                id = "cmbTaxType"                             
                displayExpr="VALUE"                       
                valueExpr="ID"
                data={{source:[{ID:0,VALUE:this.t("cmbTaxTypeData.individual")},{ID:1,VALUE:this.t("cmbTaxTypeData.company")}]}}
            >
            </NdSelectBox>
        )
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
                                                this.getCustomer(this.prevCode); 
                                            }
                                        }}/>
                                </Item>
                                <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnNew" parent={this} icon="file" type="default"
                                    onClick={()=>
                                    {
                                        this.init(); 
                                    }}/>
                                </Item>
                                <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnSave" parent={this} icon="floppy" type="default" validationGroup="frmCustomers"
                                    onClick={async (e)=>
                                    {
                                        if(this.customerObj.dt()[0].SIRET_ID == '' || this.customerObj.dt()[0].APE_CODE == '' || this.customerObj.dt()[0].TAX_OFFICE == '' || this.customerObj.dt()[0].TAX_NO == '')
                                        {
                                            let tmpConfObj =
                                            {
                                                id:'msgLegalNotValid',showTitle:true,title:this.t("msgLegalNotValid.title"),showCloseButton:true,width:'500px',height:'200px',
                                                button:[{id:"btn01",caption:this.t("msgLegalNotValid.btn01"),location:'after'}],
                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgLegalNotValid.msg")}</div>)
                                            }
                                            
                                            await dialog(tmpConfObj);
                                            return
                                        }
                                        if(typeof this.customerObj.customerAdress.dt()[0] == 'undefined' || this.customerObj.customerAdress.dt()[0].COUNTRY == '' )
                                        {
                                            let tmpConfObj =
                                            {
                                                id:'msgAdressNotValid',showTitle:true,title:this.t("msgAdressNotValid.title"),showCloseButton:true,width:'500px',height:'200px',
                                                button:[{id:"btn01",caption:this.t("msgAdressNotValid.btn01"),location:'after'}],
                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgAdressNotValid.msg")}</div>)
                                            }
                                            
                                            await dialog(tmpConfObj);
                                            return
                                        }
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
                                                
                                                if((await this.customerObj.save()) == 0)
                                                {                                                    
                                                    tmpConfObj1.content = (<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgSaveResult.msgSuccess")}</div>)
                                                    await dialog(tmpConfObj1);
                                                }
                                                else
                                                {
                                                    tmpConfObj1.content = (<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgSaveResult.msgFailed")}</div>)
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
                                    <NdButton id="btnDelete" parent={this} icon="trash" type="default"
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
                                            this.customerObj.dt('CUSTOMERS').removeAt(0)
                                            await this.customerObj.dt('CUSTOMERS').delete();
                                            this.init(); 
                                        }
                                        
                                    }}/>
                                </Item>
                                <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnCopy" parent={this} icon="copy" type="default"
                                    onClick={()=>
                                    {
                                        
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
                            <Form colCount={2} id="frmCustomers">
                                {/* cmbType */}
                                <Item>
                                    <Label text={this.t("cmbType")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbType" height='fit-content' dt={{data:this.customerObj.dt('CUSTOMERS'),field:"TYPE"}}
                                    displayExpr="VALUE"                       
                                    valueExpr="ID"
                                    data={{source:[{ID:0,VALUE:this.t("cmbTypeData.individual")},{ID:1,VALUE:this.t("cmbTypeData.company")}]}}
                                    onValueChanged={(async(e)=>
                                            {
                                                if(typeof e != 'undefined')
                                                {
                                                    this.typeChange(e.value)
                                                }
                                        }).bind(this)}
                                    //param={this.param.filter({ELEMENT:'cmbType',USERS:this.user.CODE})}
                                    //access={this.access.filter({ELEMENT:'cmbType',USERS:this.user.CODE})}
                                    />
                                </Item>       
                                {/* cmbGenus */}
                                <Item>
                                    <Label text={this.t("cmbGenus")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbGenus" height='fit-content' dt={{data:this.customerObj.dt('CUSTOMERS'),field:"GENUS"}}
                                    displayExpr="VALUE"                       
                                    valueExpr="ID"
                                    data={{source:[{ID:0,VALUE:this.t("cmbGenusData.Customer")},{ID:1,VALUE:this.t("cmbGenusData.supplier")},{ID:2,VALUE:this.t("cmbGenusData.both")}]}}
                                    //param={this.param.filter({ELEMENT:'cmbType',USERS:this.user.CODE})}
                                    //access={this.access.filter({ELEMENT:'cmbType',USERS:this.user.CODE})}
                                    />
                                </Item>       
                                {/* txtCode */}
                                <Item>
                                    <Label text={this.t("txtCode")} alignment="right" />
                                    <NdTextBox id="txtCode" parent={this} simple={true} dt={{data:this.customerObj.dt('CUSTOMERS'),field:"CODE"}}  
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
                                                            this.getCustomer(data[0].CODE)
                                                        }
                                                    }
                                                }
                                            },
                                            {
                                                id:'02',
                                                icon:'arrowdown',
                                                onClick:()=>
                                                {
                                                    this.txtCode.value = Math.floor(Date.now() / 1000)
                                                }
                                            }
                                        ]
                                    }
                                    onChange={(async()=>
                                    {
                                        let tmpResult = await this.checkCustomer(this.txtCode.value)
                                        if(tmpResult == 3)
                                        {
                                            this.txtCode.value = "";
                                        }
                                    }).bind(this)}
                                    param={this.param.filter({ELEMENT:'txtCode',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'txtCode',USERS:this.user.CODE})}
                                    >
                                        <Validator validationGroup={"frmCustomers"}>
                                            <RequiredRule message="Kodu boş geçemezsiniz !" />
                                        </Validator>  
                                    </NdTextBox>
                                    {/*CARI SECIMI POPUP */}
                                    <NdPopGrid id={"pg_txtCode"} parent={this} container={"#root"}
                                    visible={false}
                                    position={{of:'#root'}} 
                                    showTitle={true} 
                                    showBorders={true}
                                    width={'90%'}
                                    height={'90%'}
                                    title={this.t("pg_txtCode.title")} //
                                    search={true}
                                    data = 
                                    {{
                                        source:
                                        {
                                            select:
                                            {
                                                query : "SELECT GUID,CODE,TITLE,NAME,LAST_NAME,[TYPE_NAME],[GENUS_NAME] FROM CUSTOMER_VW_01 WHERE UPPER(CODE) LIKE UPPER(@VAL) OR UPPER(TITLE) LIKE UPPER(@VAL)",
                                                param : ['VAL:string|50']
                                            },
                                            sql:this.core.sql
                                        }
                                    }}
                                    button=
                                    {
                                        {
                                            id:'01',
                                            icon:'more',
                                            onClick:()=>
                                            {
                                                console.log(1111)
                                            }
                                        }
                                    }
                                    >
                                         <Column dataField="CODE" caption={this.t("pg_txtCode.clmCode")} width={150} />
                                        <Column dataField="TITLE" caption={this.t("pg_txtCode.clmTitle")} width={300} defaultSortOrder="asc" />
                                        <Column dataField="NAME" caption={this.t("pg_txtCode.clmName")} width={300} defaultSortOrder="asc" />
                                        <Column dataField="LAST_NAME" caption={this.t("pg_txtCode.clmLastName")} width={300} defaultSortOrder="asc" />
                                    </NdPopGrid>
                                </Item>
                                 {/* txtTitle */}
                                 <Item>
                                    <Label text={this.t("txtTitle")} alignment="right" />
                                    <NdTextBox id="txtTitle" parent={this} simple={true} dt={{data:this.customerObj.dt('CUSTOMERS'),field:"TITLE"}}
                                    onChange={(async()=>
                                    {
                                      
                                    }).bind(this)}
                                    param={this.param.filter({ELEMENT:'txtTitle',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'txtTitle',USERS:this.user.CODE})}
                                    >
                                    </NdTextBox>
                                </Item>
                                {/* txtCustomerName */}
                                <Item>
                                    <Label text={this.t("txtCustomerName")} alignment="right" />
                                    <NdTextBox id="txtCustomerName" parent={this} simple={true} dt={{data:this.customerObj.dt('CUSTOMER_OFFICAL'),field:"NAME",filter:{TYPE:0}}}
                                    maxLength={32}
                                    param={this.param.filter({ELEMENT:'txtCustomerName',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'txtCustomerName',USERS:this.user.CODE})}
                                    >
                                     <Validator validationGroup={"frmCustomers"}>
                                            <RequiredRule message="Adı boş geçemezsiniz !" />
                                        </Validator>  
                                    </NdTextBox>
                                </Item>
                                {/* txtCustomerLastname */}
                                <Item>
                                    <Label text={this.t("txtCustomerLastname")} alignment="right" />
                                        <NdTextBox id="txtCustomerLastname" parent={this} simple={true} dt={{data:this.customerObj.dt('CUSTOMER_OFFICAL'),field:"LAST_NAME",filter:{TYPE:0}}}
                                        maxLength={32}
                                        param={this.param.filter({ELEMENT:'txtCustomerLastname',USERS:this.user.CODE})}
                                        access={this.access.filter({ELEMENT:'txtCustomerLastname',USERS:this.user.CODE})}
                                        >
                                     <Validator validationGroup={"frmCustomers"}>
                                            <RequiredRule message="Soyadı boş geçemezsiniz !" />
                                        </Validator>  
                                    </NdTextBox>
                                </Item>
                                 {/* txtPhone1 */}
                                 <Item>
                                    <Label text={this.t("txtPhone1")} alignment="right" />
                                        <NdTextBox id="txtPhone1" parent={this} simple={true} dt={{data:this.customerObj.dt('CUSTOMER_OFFICAL'),field:"PHONE1",filter:{TYPE:0}}}
                                        maxLength={32}
                                        access={this.access.filter({ELEMENT:'txtPhone1',USERS:this.user.CODE})}
                                       />
                                </Item>
                                 {/* txtPhone2 */}
                                 <Item>
                                    <Label text={this.t("txtPhone2")} alignment="right" />
                                        <NdTextBox id="txtPhone2" parent={this} simple={true} dt={{data:this.customerObj.dt('CUSTOMER_OFFICAL'),field:"PHONE2",filter:{TYPE:0}}}
                                        maxLength={32}
                                        access={this.access.filter({ELEMENT:'txtPhone2',USERS:this.user.CODE})}
                                        />
                                </Item>
                                 {/* txtGsmPhone */}
                                 <Item>
                                    <Label text={this.t("txtGsmPhone")} alignment="right" />
                                        <NdTextBox id="txtGsmPhone" parent={this} simple={true} dt={{data:this.customerObj.dt('CUSTOMER_OFFICAL'),field:"GSM_PHONE",filter:{TYPE:0}}}
                                        maxLength={32}
                                         access={this.access.filter({ELEMENT:'txtGsmPhone',USERS:this.user.CODE})}
                                        />
                                </Item>
                                 {/* txtOtherPhone */}
                                 <Item>
                                    <Label text={this.t("txtOtherPhone")} alignment="right" />
                                        <NdTextBox id="txtOtherPhone" parent={this} simple={true} dt={{data:this.customerObj.dt('CUSTOMER_OFFICAL'),field:"OTHER_PHONE",filter:{TYPE:0}}}
                                        maxLength={32}
                                         access={this.access.filter({ELEMENT:'txtOtherPhone',USERS:this.user.CODE})}
                                        />
                                </Item>
                                 {/* txtEmail */}
                                 <Item>
                                    <Label text={this.t("txtEmail")} alignment="right" />
                                        <NdTextBox id="txtEmail" parent={this} simple={true} dt={{data:this.customerObj.dt('CUSTOMER_OFFICAL'),field:"EMAIL",filter:{TYPE:0}}}
                                        maxLength={32}
                                         access={this.access.filter({ELEMENT:'txtEmail',USERS:this.user.CODE})}
                                        />
                                </Item>
                                 {/* txtWeb */}
                                 <Item>
                                    <Label text={this.t("txtWeb")} alignment="right" />
                                        <NdTextBox id="txtWeb" parent={this} simple={true} dt={{data:this.customerObj.dt('CUSTOMERS'),field:"WEB"}} 
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
                                                    <Editing mode="cell" allowUpdating={true} allowDeleting={true} />
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
                                    <NdTextBox id={"txtPopAdress"} parent={this} simple={true} />
                                </Item>
                                <Item>
                                    <Label text={this.t("popAdress.cmbPopZipcode")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbPopZipcode"
                                    displayExpr="ZIPNAME"                       
                                    valueExpr="ZIPCODE"
                                    value=""
                                    searchEnabled={true}
                                    pageSize ={50}
                                    notRefresh = {true}
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
                                    data={{source:{select:{query : "SELECT CODE,NAME FROM COUNTRY ORDER BY NAME ASC"},sql:this.core.sql}}}
                                    />
                                </Item>
                                <Item>
                                    <div className='row'>
                                        <div className='col-6'>
                                            <NdButton text={this.lang.t("btnSave")} type="normal" stylingMode="contained" width={'100%'} 
                                            onClick={async ()=>
                                            {
                                                let tmpEmpty = {...this.customerObj.customerAdress.empty};
                                               
                                                
                                                tmpEmpty.TYPE = 0
                                                tmpEmpty.ADRESS = this.txtPopAdress.value
                                                tmpEmpty.ZIPCODE = this.cmbPopZipcode.value
                                                tmpEmpty.CITY = this.cmbPopCity.value
                                                tmpEmpty.COUNTRY = this.cmbPopCountry.value
                                                tmpEmpty.CUSTOMER = this.customerObj.dt()[0].GUID 

                                                this.customerObj.customerAdress.addEmpty(tmpEmpty);    
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
                                    <NdTextBox id={"txtPopName"} parent={this} simple={true} />
                                </Item>
                                <Item>
                                    <Label text={this.t("popOffical.txtPopLastName")} alignment="right" />
                                    <NdTextBox simple={true} parent={this} id="txtPopLastName"
                                    />
                                </Item>
                                <Item>
                                    <Label text={this.t("popOffical.txtPopPhone1")} alignment="right" />
                                    <NdTextBox simple={true} parent={this} id="txtPopPhone1"
                                    />
                                </Item>
                                <Item>
                                    <Label text={this.t("popOffical.txtPopPhone2")} alignment="right" />
                                    <NdTextBox simple={true} parent={this} id="txtPopPhone2"
                                    />
                                </Item>
                                <Item>
                                    <Label text={this.t("popOffical.txtPopGsmPhone")} alignment="right" />
                                    <NdTextBox simple={true} parent={this} id="txtPopGsmPhone"
                                    />
                                </Item>
                                <Item>
                                    <Label text={this.t("popOffical.txtPopOtherPhone")} alignment="right" />
                                    <NdTextBox simple={true} parent={this} id="txtPopOtherPhone"
                                    />
                                </Item>
                                <Item>
                                    <Label text={this.t("popOffical.txtPopMail")} alignment="right" />
                                    <NdTextBox simple={true} parent={this} id="txtPopMail"
                                    />
                                </Item>
                                <Item>
                                    <div className='row'>
                                        <div className='col-6'>
                                            <NdButton text={this.lang.t("btnSave")} type="normal" stylingMode="contained" width={'100%'} 
                                            onClick={async ()=>
                                            {
                                                let tmpEmpty = {...this.customerObj.customerOffical.empty};
                                               
                                                
                                                tmpEmpty.TYPE = 1
                                                tmpEmpty.NAME = this.txtPopName.value
                                                tmpEmpty.LAST_NAME = this.txtPopLastName.value
                                                tmpEmpty.PHONE1 = this.txtPopPhone1.value
                                                tmpEmpty.PHONE2 = this.txtPopPhone2.value
                                                tmpEmpty.GSM_PHONE = this.txtPopGsmPhone.value
                                                tmpEmpty.OTHER_PHONE = this.txtPopOtherPhone.value          
                                                tmpEmpty.EMAIL = this.txtPopMail.value
                                                tmpEmpty.CUSTOMER = this.customerObj.dt()[0].GUID 

                                                this.customerObj.customerOffical.addEmpty(tmpEmpty);    
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
                                    <NdTextBox id={"txtBankName"} parent={this} simple={true} />
                                </Item>
                                <Item>
                                    <Label text={this.t("popBank.txtIban")} alignment="right" />
                                    <NdTextBox id={"txtBankIban"} parent={this} simple={true} />
                                </Item>
                                <Item>
                                    <Label text={this.t("popBank.txtOffice")} alignment="right" />
                                    <NdTextBox id={"txtBankOffice"} parent={this} simple={true} />
                                </Item>
                                <Item>
                                    <Label text={this.t("popBank.txtSwift")} alignment="right" />
                                    <NdTextBox id={"txtBankSwift"} parent={this} simple={true} />
                                </Item>
                                <Item>
                                    <div className='row'>
                                        <div className='col-6'>
                                            <NdButton text={this.lang.t("btnSave")} type="normal" stylingMode="contained" width={'100%'} 
                                            onClick={async ()=>
                                            {
                                                let tmpEmpty = {...this.customerObj.customerBank.empty};
                                               
                                                
                                                tmpEmpty.NAME = this.txtBankName.value
                                                tmpEmpty.IBAN = this.txtBankIban.value
                                                tmpEmpty.OFFICE = this.txtBankOffice.value
                                                tmpEmpty.SWIFT = this.txtBankSwift.value
                                                tmpEmpty.CUSTOMER = this.customerObj.dt()[0].GUID 

                                                this.customerObj.customerBank.addEmpty(tmpEmpty);    
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