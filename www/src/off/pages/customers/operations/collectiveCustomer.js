import React from 'react';
import App from '../../../lib/app.js';
import { customersCls } from '../../../../core/cls/customers.js';
import ScrollView from 'devextreme-react/scroll-view';
import Toolbar from 'devextreme-react/toolbar';
import { Item } from 'devextreme-react/form';
import NdTextBox, { Validator, NumericRule, EmailRule } from '../../../../core/react/devex/textbox.js'
import NdSelectBox from '../../../../core/react/devex/selectbox.js';
import NdCheckBox from '../../../../core/react/devex/checkbox.js';
import NdPopUp from '../../../../core/react/devex/popup.js';
import NdButton from '../../../../core/react/devex/button.js';
import { dialog } from '../../../../core/react/devex/dialog.js';
import { NdForm, NdItem, NdLabel }from '../../../../core/react/devex/form.js';
import { NdToast } from '../../../../core/react/devex/toast.js';


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
        this.btnRun = this.btnRun.bind(this)
        
    }
    async componentDidMount()
    {
        await this.core.util.waitUntil(0)
        this.init()
    }
    async init()
    {
        this.customerObj.clearAll();


    }
    async checkZipcode(pCode)
    {
        return new Promise(async resolve =>
        {
            if(pCode !== '')
            {
                let tmpQuery = {
                    query :"SELECT COUNTRY_CODE, PLACE FROM ZIPCODE WHERE ZIPCODE = @ZIPCODE ",
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
    async btnRun()
    {
        this.popSettingCustomer.show()
    }
    render()
    {
        return(
            <div id={this.props.data.id + this.tabIndex}>
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
                            <NdForm colCount={2} id={"frmCustomers"  + this.tabIndex}>
                                {/* cmbType */}
                                <NdItem>
                                    <NdLabel text={this.t("cmbType")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbType" height='fit-content' dt={{data:this.customerObj.dt('CUSTOMERS'),field:"TYPE"}}
                                    displayExpr="VALUE"                       
                                    valueExpr="ID"
                                    data={{source:[{ID:0,VALUE:this.t("cmbTypeData.individual")},{ID:1,VALUE:this.t("cmbTypeData.company")}]}}
                                    onValueChanged={(async(e)=>
                                        {
                                                
                                        }).bind(this)}
                                    param={this.param.filter({ELEMENT:'cmbType',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'cmbType',USERS:this.user.CODE})}
                                    />
                                </NdItem>       
                                {/* cmbGenus */}
                                <NdItem>
                                    <NdLabel text={this.t("cmbGenus")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbGenus" height='fit-content' dt={{data:this.customerObj.dt('CUSTOMERS'),field:"GENUS"}}
                                    displayExpr="VALUE"                       
                                    valueExpr="ID"
                                    data={{source:[{ID:0,VALUE:this.t("cmbGenusData.Customer")},{ID:1,VALUE:this.t("cmbGenusData.supplier")},{ID:2,VALUE:this.t("cmbGenusData.both")}]}}
                                    param={this.param.filter({ELEMENT:'cmbType',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'cmbType',USERS:this.user.CODE})}
                                    />
                                </NdItem>       
                                {/* txtCustomerName */}
                                <NdItem>
                                    <NdLabel text={this.t("txtCustomerName")} alignment="right" />
                                    <NdTextBox id="txtCustomerName" parent={this} simple={true} tabIndex={this.tabIndex} dt={{data:this.customerObj.dt('CUSTOMER_OFFICAL'),field:"NAME",filter:{TYPE:0}}}
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    maxLength={32}
                                    param={this.param.filter({ELEMENT:'txtCustomerName',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'txtCustomerName',USERS:this.user.CODE})}
                                    >                                      
                                    </NdTextBox>
                                </NdItem>
                                {/* txtCustomerLastname */}
                                <NdItem>
                                    <NdLabel text={this.t("txtCustomerLastname")} alignment="right" />
                                        <NdTextBox id="txtCustomerLastname" parent={this} simple={true} tabIndex={this.tabIndex} 
                                        upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                        dt={{data:this.customerObj.dt('CUSTOMER_OFFICAL'),field:"LAST_NAME",filter:{TYPE:0}}}
                                        maxLength={32}
                                        param={this.param.filter({ELEMENT:'txtCustomerLastname',USERS:this.user.CODE})}
                                        access={this.access.filter({ELEMENT:'txtCustomerLastname',USERS:this.user.CODE})}
                                        >                                      
                                    </NdTextBox>
                                </NdItem>
                                 {/* txtPhone1 */}
                                 <NdItem>
                                    <NdLabel text={this.t("txtPhone1")} alignment="right" />
                                    <NdTextBox id="txtPhone1" 
                                        parent={this} 
                                        simple={true} 
                                        dt={{data:this.customerObj.dt('CUSTOMER_OFFICAL'),field:"PHONE1",filter:{TYPE:0}}}
                                        upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                        maxLength={32}
                                        access={this.access.filter({ELEMENT:'txtPhone1',USERS:this.user.CODE})}
                                    >
                                        <Validator>
                                            <NumericRule message={this.lang.t("phoneIsInvalid")}/>
                                        </Validator>
                                    </NdTextBox>
                                </NdItem>
                                 {/* txtPhone2 */}
                                 <NdItem>
                                    <NdLabel text={this.t("txtPhone2")} alignment="right" />
                                    <NdTextBox id="txtPhone2" 
                                        parent={this} 
                                        simple={true} 
                                        dt={{data:this.customerObj.dt('CUSTOMER_OFFICAL'),field:"PHONE2",filter:{TYPE:0}}}
                                        upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                        maxLength={32}
                                        access={this.access.filter({ELEMENT:'txtPhone2',USERS:this.user.CODE})}
                                    >
                                        <Validator>
                                            <NumericRule message={this.lang.t("phoneIsInvalid")}/>
                                        </Validator>
                                    </NdTextBox>
                                </NdItem>
                                 {/* txtGsmPhone */}
                                 <NdItem>
                                    <NdLabel text={this.t("txtGsmPhone")} alignment="right" />
                                    <NdTextBox id="txtGsmPhone" 
                                        parent={this} 
                                        simple={true} 
                                        dt={{data:this.customerObj.dt('CUSTOMER_OFFICAL'),field:"GSM_PHONE",filter:{TYPE:0}}}
                                        upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                        maxLength={32}
                                        access={this.access.filter({ELEMENT:'txtGsmPhone',USERS:this.user.CODE})}
                                    >
                                        <Validator>
                                            <NumericRule message={this.lang.t("phoneIsInvalid")}/>
                                        </Validator>
                                    </NdTextBox>
                                </NdItem>
                                 {/* txtOtherPhone */}
                                 <NdItem>
                                    <NdLabel text={this.t("txtOtherPhone")} alignment="right" />
                                    <NdTextBox id="txtOtherPhone"  
                                        parent={this} 
                                        simple={true} 
                                        dt={{data:this.customerObj.dt('CUSTOMER_OFFICAL'),field:"OTHER_PHONE",filter:{TYPE:0}}}
                                        upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                        maxLength={32}
                                        access={this.access.filter({ELEMENT:'txtOtherPhone',USERS:this.user.CODE})}
                                    >
                                        <Validator>
                                            <NumericRule message={this.lang.t("phoneIsInvalid")}/>
                                        </Validator>
                                    </NdTextBox>
                                </NdItem>
                                 {/* txtEmail */}
                                 <NdItem>
                                    <NdLabel text={this.t("txtEmail")} alignment="right" />
                                    <NdTextBox id="txtEmail" 
                                        parent={this} 
                                        simple={true} 
                                        dt={{data:this.customerObj.dt('CUSTOMER_OFFICAL'),field:"EMAIL",filter:{TYPE:0}}}
                                        upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                        maxLength={32}
                                        access={this.access.filter({ELEMENT:'txtEmail',USERS:this.user.CODE})}
                                    >
                                        <Validator>
                                            <EmailRule message={this.lang.t("mailIsInvalid")}/>
                                        </Validator>
                                    </NdTextBox>
                                </NdItem>
                                 {/* txtWeb */}
                                 <NdItem>
                                    <NdLabel text={this.t("txtWeb")} alignment="right" />
                                    <NdTextBox id="txtWeb" 
                                        parent={this} 
                                        simple={true} 
                                        dt={{data:this.customerObj.dt('CUSTOMERS'),field:"WEB"}} 
                                        upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                        maxLength={32}
                                        access={this.access.filter({ELEMENT:'txtWeb',USERS:this.user.CODE})}
                                    />
                                </NdItem>
                                <NdItem>
                                    <NdLabel text={this.t("popAdress.txtPopAdress")} alignment="right" />
                                    <NdTextBox id={"txtPopAdress"} parent={this} simple={true} 
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}/>
                                </NdItem>
                                <NdItem>
                                    <NdLabel text={this.t("popAdress.cmbPopZipcode")} alignment="right" />
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
                                </NdItem>
                                <NdItem>
                                    <NdLabel text={this.t("popAdress.cmbPopCity")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbPopCity"
                                    displayExpr="CITYNAME"                       
                                    valueExpr="PLACE"
                                    value=""
                                    searchEnabled={true}
                                    showClearButton={true}
                                    pageSize ={50}
                                    notRefresh = {true}
                                    data={{source:{select:{query : "SELECT COUNTRY_CODE, ZIPCODE, PLACE, PLACE + ' ' + ZIPCODE AS CITYNAME  FROM [dbo].[ZIPCODE]"},sql:this.core.sql}}}
                                    />
                                </NdItem>
                                <NdItem>
                                    <NdLabel text={this.t("popAdress.cmbPopCountry")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbPopCountry"
                                    displayExpr="NAME"                       
                                    valueExpr="CODE"
                                    value="FR"
                                    searchEnabled={true}
                                    showClearButton={true}
                                    data={{source:{select:{query : "SELECT CODE, NAME FROM COUNTRY ORDER BY NAME ASC"},sql:this.core.sql}}}
                                    />
                                </NdItem>
                            </NdForm>
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
                    {/* Ayar PopUp */}
                    <div>
                        <NdPopUp parent={this} id={"popSettingCustomer"} 
                        visible={false}
                        showCloseButton={true}
                        showTitle={true}
                        title={this.t("popSettingCustomer.title")}
                        container={'#' + this.props.data.id + this.tabIndex}     
                        width={'500'}
                        height={'350'}
                        position={{of:'#' + this.props.data.id + this.tabIndex}}
                        >
                            <NdForm colCount={1} height={'fit-content'}>
                                <NdItem>
                                    <NdLabel text={this.t("popSettingCustomer.txtStartRef")} alignment="right" />
                                    <NdTextBox id={"txtStartRef"} parent={this} simple={true} 
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}/>
                                </NdItem>
                                <NdItem>
                                    <NdLabel text={this.t("popSettingCustomer.txtFinishRef")} alignment="right" />
                                    <NdTextBox id={"txtFinishRef"} parent={this} simple={true} 
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}/>
                                </NdItem>
                                <NdItem>
                                    <NdLabel text={this.t("popSettingCustomer.txtTotal")} alignment="right" />
                                    <NdTextBox id={"txtTotal"} parent={this} simple={true} 
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}/>
                                </NdItem>
                                <NdItem>
                                    <NdLabel text={this.t("popSettingCustomer.chkDigit")} alignment="right" />
                                        <NdCheckBox id="chkDigit" parent={this} value={false} ></NdCheckBox>
                                </NdItem>
                                <NdItem>
                                    <div className='row'>
                                        <div className='col-6'>
                                            <NdButton text={this.lang.t("btnSave")} type="normal" stylingMode="contained" width={'100%'} 
                                            onClick={async ()=>
                                            {     
                                                App.instance.setState({isExecute:true})

                                                let tmpCounter
                                                if(this.txtTotal.value == '')
                                                {
                                                    tmpCounter =  Number(this.txtFinishRef.value) -Number(this.txtStartRef.value) 
                                                }
                                                else
                                                {
                                                    tmpCounter = Number(this.txtTotal.value)
                                                }
                                                for (let i = 0; i < tmpCounter; i++) 
                                                {
                                                    this.customerObj.clearAll()
                                                    this.customerObj.addEmpty()
                                                    let tmpOffical = {...this.customerObj.customerOffical.empty}
                                                    tmpOffical.CUSTOMER = this.customerObj.dt()[0].GUID 
                                                    this.customerObj.customerOffical.addEmpty(tmpOffical)
                                                    
                                                    let tmpEmpty = {...this.customerObj.customerAdress.empty};
                                                    tmpEmpty.TYPE = 0
                                                    tmpEmpty.ADRESS = this.txtPopAdress.value
                                                    tmpEmpty.ZIPCODE = this.cmbPopZipcode.value
                                                    tmpEmpty.CIYT = this.cmbPopCity.value
                                                    tmpEmpty.COUNTRY = this.cmbPopCountry.value
                                                    tmpEmpty.CUSTOMER = this.customerObj.dt()[0].GUID 

                                                    this.customerObj.customerAdress.addEmpty(tmpEmpty);    

                                                    
                                                    let tmpCode = Number(this.txtStartRef.value) + i
                                                    tmpCode = tmpCode.toString()
                                                    if(this.chkDigit.value == true)
                                                    {
                                                        let output = []
                                                        for (var x = 0, len = tmpCode.length; x < len; x += 1) 
                                                        {
                                                            output.push(+tmpCode.charAt(x));
                                                        }
                                                
                                                        var tek=(output[0]+output[2]+output[4]+output[6]+output[8]+output[10])
                                                        var cift=(output[1]+output[3]+output[5]+output[7]+output[9]+output[11])*3
                                                        var say = tek+cift
                                                        console.log(say)
                                                        let sonuc = (10 - (say %= 10))
                                                        if(sonuc == 10)
                                                        {
                                                            sonuc = 0
                                                        }
                                                        this.customerObj.dt()[0].CODE = tmpCode.toString() + sonuc.toString()
                                                    }
                                                    else
                                                    {
                                                        this.customerObj.dt()[0].CODE = Number(this.txtStartRef.value) + i
                                                    }
                                                    this.customerObj.dt()[0].GENUS = this.cmbGenus.value
                                                    this.customerObj.dt()[0].TYPE = this.cmbType.value
                                                    this.customerObj.customerOffical.dt('CUSTOMER_OFFICAL')[0].NAME =  this.txtCustomerName.value
                                                    this.customerObj.customerOffical.dt('CUSTOMER_OFFICAL')[0].LAST_NAME =  this.txtCustomerLastname.value
                                                    this.customerObj.customerOffical.dt('CUSTOMER_OFFICAL')[0].PHONE1 =  this.txtPhone1.value
                                                    this.customerObj.customerOffical.dt('CUSTOMER_OFFICAL')[0].PHONE2 =  this.txtPhone2.value
                                                    this.customerObj.customerOffical.dt('CUSTOMER_OFFICAL')[0].GSM_PHONE =  this.txtGsmPhone.value
                                                    this.customerObj.customerOffical.dt('CUSTOMER_OFFICAL')[0].OTHER_PHONE =  this.txtOtherPhone.value
                                                    this.customerObj.customerOffical.dt('CUSTOMER_OFFICAL')[0].EMAIL =  this.txtEmail.value
                                                    this.customerObj.customerOffical.dt('CUSTOMER_OFFICAL')[0].WEB =  this.customerObj.value
                                                    this.customerObj.customerAdress.dt('CUSTOMER_ADRESS').ADRESS =   this.txtPopAdress.value
                                                    this.customerObj.customerAdress.dt('CUSTOMER_ADRESS')[0].ZIPCODE =  this.cmbPopZipcode.value
                                                    this.customerObj.customerAdress.dt('CUSTOMER_ADRESS')[0].CIYT = this.cmbPopCity.value
                                                    this.customerObj.customerAdress.dt('CUSTOMER_ADRESS')[0].COUNTRY =  this.cmbPopCountry.value
                                                    await this.customerObj.save()
                                                }
                                                App.instance.setState({isExecute:false})

                                                this.toast.show({type:"success",message:this.t("msgSaveResult.msgSuccess")})
                                                this.popSettingCustomer.hide();  
                                            }}/>
                                        </div>
                                        <div className='col-6'>
                                            <NdButton text={this.lang.t("btnCancel")} type="normal" stylingMode="contained" width={'100%'}
                                            onClick={()=>
                                            {
                                                this.popSettingCustomer.hide();  
                                            }}/>
                                        </div>
                                    </div>
                                </NdItem>
                            </NdForm>
                        </NdPopUp>
                        <NdToast id={"toast"} parent={this} displayTime={2000} position={{at:"top center",offset:'0px 110px'}}/>
                    </div> 
                </ScrollView>
            </div>
        )
    }
}