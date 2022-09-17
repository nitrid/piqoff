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

export default class collectiveCustomer extends React.PureComponent
{
    constructor(props)
    {
        super(props)
        this.core = App.instance.core;
        this.prmObj = this.param.filter({TYPE:1,USERS:this.user.CODE});
        this.customerObj = new customersCls();
        this.prevCode = "";
        this.state={officalVisible:true}
        this.tabIndex = props.data.tabkey
        this.sysPrmObj = this.param.filter({TYPE:0,USERS:this.user.CODE});
    }
    async componentDidMount()
    {
        await this.core.util.waitUntil(0)
        this.init()
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
    async btnRun()
    {
        this.popSettingCustomer.show()
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
                                    <NdButton id="btnNew" parent={this} icon="file" type="default"
                                    onClick={()=>
                                    {
                                        this.init(); 
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
                            <Form colCount={2} id={"frmCustomers"  + this.tabIndex}>
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
                                    param={this.param.filter({ELEMENT:'cmbType',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'cmbType',USERS:this.user.CODE})}
                                    />
                                </Item>       
                                {/* cmbGenus */}
                                <Item>
                                    <Label text={this.t("cmbGenus")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbGenus" height='fit-content' dt={{data:this.customerObj.dt('CUSTOMERS'),field:"GENUS"}}
                                    displayExpr="VALUE"                       
                                    valueExpr="ID"
                                    data={{source:[{ID:0,VALUE:this.t("cmbGenusData.Customer")},{ID:1,VALUE:this.t("cmbGenusData.supplier")},{ID:2,VALUE:this.t("cmbGenusData.both")}]}}
                                    param={this.param.filter({ELEMENT:'cmbType',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'cmbType',USERS:this.user.CODE})}
                                    />
                                </Item>       
                                {/* txtCustomerName */}
                                <Item>
                                    <Label text={this.t("txtCustomerName")} alignment="right" />
                                    <NdTextBox id="txtCustomerName" parent={this} simple={true} tabIndex={this.tabIndex} dt={{data:this.customerObj.dt('CUSTOMER_OFFICAL'),field:"NAME",filter:{TYPE:0}}}
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    maxLength={32}
                                    param={this.param.filter({ELEMENT:'txtCustomerName',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'txtCustomerName',USERS:this.user.CODE})}
                                    >                                      
                                    </NdTextBox>
                                </Item>
                                {/* txtCustomerLastname */}
                                <Item>
                                    <Label text={this.t("txtCustomerLastname")} alignment="right" />
                                        <NdTextBox id="txtCustomerLastname" parent={this} simple={true} tabIndex={this.tabIndex} 
                                        upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                        dt={{data:this.customerObj.dt('CUSTOMER_OFFICAL'),field:"LAST_NAME",filter:{TYPE:0}}}
                                        maxLength={32}
                                        param={this.param.filter({ELEMENT:'txtCustomerLastname',USERS:this.user.CODE})}
                                        access={this.access.filter({ELEMENT:'txtCustomerLastname',USERS:this.user.CODE})}
                                        >                                      
                                    </NdTextBox>
                                </Item>
                                 {/* txtPhone1 */}
                                 <Item>
                                    <Label text={this.t("txtPhone1")} alignment="right" />
                                        <NdTextBox id="txtPhone1" parent={this} simple={true} dt={{data:this.customerObj.dt('CUSTOMER_OFFICAL'),field:"PHONE1",filter:{TYPE:0}}}
                                        upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                        maxLength={32}
                                        access={this.access.filter({ELEMENT:'txtPhone1',USERS:this.user.CODE})}
                                       />
                                </Item>
                                 {/* txtPhone2 */}
                                 <Item>
                                    <Label text={this.t("txtPhone2")} alignment="right" />
                                        <NdTextBox id="txtPhone2" parent={this} simple={true} dt={{data:this.customerObj.dt('CUSTOMER_OFFICAL'),field:"PHONE2",filter:{TYPE:0}}}
                                        upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                        maxLength={32}
                                        access={this.access.filter({ELEMENT:'txtPhone2',USERS:this.user.CODE})}
                                        />
                                </Item>
                                 {/* txtGsmPhone */}
                                 <Item>
                                    <Label text={this.t("txtGsmPhone")} alignment="right" />
                                        <NdTextBox id="txtGsmPhone" parent={this} simple={true} dt={{data:this.customerObj.dt('CUSTOMER_OFFICAL'),field:"GSM_PHONE",filter:{TYPE:0}}}
                                        upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                        maxLength={32}
                                         access={this.access.filter({ELEMENT:'txtGsmPhone',USERS:this.user.CODE})}
                                        />
                                </Item>
                                 {/* txtOtherPhone */}
                                 <Item>
                                    <Label text={this.t("txtOtherPhone")} alignment="right" />
                                        <NdTextBox id="txtOtherPhone" parent={this} simple={true} dt={{data:this.customerObj.dt('CUSTOMER_OFFICAL'),field:"OTHER_PHONE",filter:{TYPE:0}}}
                                        upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                        maxLength={32}
                                         access={this.access.filter({ELEMENT:'txtOtherPhone',USERS:this.user.CODE})}
                                        />
                                </Item>
                                 {/* txtEmail */}
                                 <Item>
                                    <Label text={this.t("txtEmail")} alignment="right" />
                                        <NdTextBox id="txtEmail" parent={this} simple={true} dt={{data:this.customerObj.dt('CUSTOMER_OFFICAL'),field:"EMAIL",filter:{TYPE:0}}}
                                        upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                        maxLength={32}
                                         access={this.access.filter({ELEMENT:'txtEmail',USERS:this.user.CODE})}
                                        />
                                </Item>
                                 {/* txtWeb */}
                                 <Item>
                                    <Label text={this.t("txtWeb")} alignment="right" />
                                        <NdTextBox id="txtWeb" parent={this} simple={true} dt={{data:this.customerObj.dt('CUSTOMERS'),field:"WEB"}} 
                                        upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                        maxLength={32}
                                         access={this.access.filter({ELEMENT:'txtWeb',USERS:this.user.CODE})}
                                        />
                                </Item>
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
                            </Form>
                        </div>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-3">
                          
                        </div>
                        <div className="col-3">
                            
                        </div>
                        <div className="col-3">
                        </div>
                        <div className="col-3">
                        <NdButton text={this.t("btnGet")} type="success" width="100%" onClick={this.btnRun}></NdButton>
                        </div>
                    </div>
                         {/* Banka POPUP */}
                         <div>
                        <NdPopUp parent={this} id={"popSettingCustomer"} 
                        visible={false}
                        showCloseButton={true}
                        showTitle={true}
                        title={this.t("popSettingCustomer.title")}
                        container={"#root"} 
                        width={'500'}
                        height={'350'}
                        position={{of:'#root'}}
                        >
                            <Form colCount={1} height={'fit-content'}>
                                <Item>
                                    <Label text={this.t("popSettingCustomer.txtStartRef")} alignment="right" />
                                    <NdTextBox id={"txtStartRef"} parent={this} simple={true} 
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}/>
                                </Item>
                                <Item>
                                    <Label text={this.t("popSettingCustomer.txtFinishRef")} alignment="right" />
                                    <NdTextBox id={"txtFinishRef"} parent={this} simple={true} 
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}/>
                                </Item>
                                <Item>
                                    <Label text={this.t("popSettingCustomer.txtTotal")} alignment="right" />
                                    <NdTextBox id={"txtTotal"} parent={this} simple={true} 
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}/>
                                </Item>
                               <Item>
                                    <Label text={this.t("popSettingCustomer.ckhDigit")} alignment="right" />
                                        <NdCheckBox id="ckhDigit" parent={this} value={false} ></NdCheckBox>
                                </Item>
                                <Item>
                                    <div className='row'>
                                        <div className='col-6'>
                                            <NdButton text={this.lang.t("btnSave")} type="normal" stylingMode="contained" width={'100%'} 
                                            onClick={async ()=>
                                            {     
                                                let tmpCounter
                                                if(this.txtTotal.value == '')
                                                {
                                                    tmpCounter = Number(this.txtStartRef.value) - Number(this.txtFinishRef.value) 
                                                }
                                                else
                                                {
                                                    tmpCounter = Number(this.txtTotal.value)
                                                }
                                                for (let i = 0; i < tmpCounter.length; i++) 
                                                {
                                                    this.customerObj.clearAll()
                                                    if(this.chkDigit.value == true)
                                                    {
                                                    //     for (var i = 0, len = sNumber.length; i < len; i += 1) 
                                                    //     {
                                                    //         output.push(+sNumber.charAt(i));
                                                    //     }
                                                
                                                    //     var tek=(output[0]+output[2]+output[4]+output[6]+output[8]+output[10])
                                                    //     var cift=(output[1]+output[3]+output[5]+output[7]+output[9]+output[11])*3
                                                    //     var say = tek+cift
                                                    //     let sonuc = (10 - (say %= 10))
                                                    //     if(sonuc == 10)
                                                    //     {
                                                    //         sonuc = 0
                                                    //     }
                                                    //     this.customerObj.dt()[0].CODE
                                                    }
                                                    else
                                                    {
                                                        this.customerObj.dt()[0].CODE = Number(this.txtStartRef.value) + i
                                                    }
                                                    this.customerObj.dt()[0].GENUS = this.cmbGenus.value
                                                    this.customerObj.dt()[0].TYPE = this.cmbType.value
                                                    this.customerObj.dt('CUSTOMER_OFFICAL').NAME =  this.txtCustomerName.value
                                                    this.customerObj.dt('CUSTOMER_OFFICAL').LAST_NAME =  this.txtCustomerLastname.value
                                                    this.customerObj.dt('CUSTOMER_OFFICAL').PHONE1 =  this.txtPhone1.value
                                                    this.customerObj.dt('CUSTOMER_OFFICAL').PHONE2 =  this.txtPhone2.value
                                                    this.customerObj.dt('CUSTOMER_OFFICAL').PHONE1 =  this.txtPhone1.value
                                                    this.customerObj.dt('CUSTOMER_OFFICAL').PHONE1 =  this.txtPhone1.value
                                                    this.customerObj.dt('CUSTOMER_OFFICAL').PHONE1 =  this.txtPhone1.value
                                                    this.customerObj.dt('CUSTOMER_OFFICAL').PHONE1 =  this.txtPhone1.value


                                                }
                                               
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