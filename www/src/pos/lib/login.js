import React from 'react';
import App from './app.js'
import TextBox from 'devextreme-react/text-box';
import Button from 'devextreme-react/button';
import Form, { Label,Item } from 'devextreme-react/form';
import NdTextBox, { Validator, NumericRule, RequiredRule, CompareRule, EmailRule, PatternRule, StringLengthRule, RangeRule, AsyncRule } from '../../core/react/devex/textbox.js'
import NdSelectBox from '../../core/react/devex/selectbox.js';
import NdPopGrid from '../../core/react/devex/popgrid.js';
import NdPopUp from '../../core/react/devex/popup.js';
import NdGrid,{Column,Editing,Paging,Scrolling,KeyboardNavigation,Export} from '../../core/react/devex/grid.js';
import i18n from './i18n.js'
import NbKeyboard from "../../core/react/bootstrap/keyboard.js";
import { Gallery } from 'devextreme-react/gallery';
import { locale, loadMessages, formatMessage } from 'devextreme/localization';
import NdDialog,{ dialog } from '../../core/react/devex/dialog.js';
import NbLabel from '../../core/react/bootstrap/label.js';

export default class Login extends React.Component
{
    constructor()
    {
        super()
        this.style =
        {
            body : 
            {
                backgroundColor : '#0d6efd',                
                height: '100%',
            },
            login_box :
            {
                position: 'inherit',
                margin:'auto',
                top: '30%',
                width: '490px',
                height: '460px',
            },
            keyboardBox :
            {
                position: 'inherit',
                backgroundColor : '#0d6efd',        
                margin:'auto',
                top: '30%',
                width: '90%',
                height: 'fit-content',
            }
        }  
        this.state = 
        {
            kullanici: '',
            sifre: '',
            alert: '',
            btnCardIdCancel:false,
            msgTransferStatus:''
        }  
        this.core = App.instance.core;    
        this.lang = App.instance.lang;

        this.cardIdCheck = this.cardIdCheck.bind(this)
        this.onLoginClick = this.onLoginClick.bind(this)
        this.cardIdRead = this.cardIdRead.bind(this)
        this.getUserList = this.getUserList.bind(this)
    }
    async componentDidMount()
    {
        await this.core.util.waitUntil(0)
        this.Kullanici.focus()        
        //YENİ KURULMUŞ CİHAZLARDA DEFAULT TR SEÇİMİ.
        if(localStorage.getItem('lang') == null)
        {
            localStorage.setItem('lang','tr')
            i18n.changeLanguage('tr')
            locale('tr')
            window.location.reload()
        }
    }
    async onLoginClick(e)
    {
        if(this.Kullanici.value == '' && this.Sifre.value == '')
        {
            return;
        }
        
        if((await this.core.auth.login(this.Kullanici.value,this.Sifre.value,'POS')))
        {            
            App.instance.setState({logined:true});
        }
        else
        {
            this.setState({logined:false,alert:this.lang.t("msgInvalidUser")})
        }
    }
    async getUserList()
    {
        let tmpData = await this.core.auth.getUserList()
        await this.pg_users.setData(tmpData)
        this.pg_users.show()
        this.pg_users.onClick = (data) =>
        {
            this.setState({kullanici: data[0].CODE});
            this.Kullanici.setState({value:data[0].CODE})
            this.Sifre.focus()
        }
    }
    async closePage()
    {
        window.close()
    }
    async cardIdRead()
    {
        this.setState({kullanici: ''});
        this.setState({sifre: ''});
        this.Kullanici.setState({value: ''});
        this.Sifre.setState({value: ''});
        await this.popCardId.show();
        setTimeout(() => {
            this.cardRead.focus()
        }, 500);
        
    }
    async cardIdCheck(pValue)
    {
        this.setState({btnCardIdCancel:true})
        let idCheck = false
        let tmpData = await this.core.auth.getUserList()
        for (let i = 0; i < tmpData.length; i++) 
        {
            if(tmpData[i].CARDID == pValue)
            {
                if(await this.core.auth.login(tmpData[i].CODE,tmpData[i].PWD,'OFF'))
                {
                    App.instance.setState({logined:true});
                    idCheck = true
                }
                else
                {
                    this.setState({logined:false,alert:this.lang.t("msgInvalidUser")})
                }
            }
        }

        if(idCheck == false)
        {
            let tmpConfObj =
            {
                id:'msgInvalidUser',showTitle:true,title:this.lang.t("msgInvalidUser"),showCloseButton:true,width:'500px',height:'200px',
                button:[{id:"btn01",caption:this.lang.t("btnOk"),location:'after'}],
                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgInvalidUser")}</div>)
            }
            await dialog(tmpConfObj);
        }
        this.setState({btnCardIdCancel:false})
    }
    render()
    {
        return (
            <div style={this.style.body}>
                <div className="p-1"></div>
                <div className="card" style={this.style.login_box}>
                    <div className="card-header">
                        <div className='row'>
                            <div className='col-9'>Login</div>
                        </div>
                    </div>
                    <div className="card-body">
                            <div className="row">
                                <div className="col-12 pb-2">
                                    <h6 className="text-center" style={{color:'#ff7675'}}>{this.state.alert}</h6>
                                </div>
                            </div>
                            <div className="dx-field">
                                <div className="dx-field-label">{this.lang.t("txtLangSelect")}</div>
                                <div className="dx-field-value">
                                <NdSelectBox simple={true} parent={this} id="cmbType" height='fit-content'
                                displayExpr="text"                       
                                valueExpr="id"
                                value= {localStorage.getItem('lang') == null ? 'tr' : localStorage.getItem('lang')}
                                data={{source:[{id:"en",text:"EN"},{id:"fr",text:"FR"},{id:"tr",text:"TR"}]}}
                                onValueChanged={(async(args)=>
                                {
                                    localStorage.setItem('lang',args.value)
                                    i18n.changeLanguage(args.value)
                                    locale(args.value)
                                    window.location.reload()
                                }).bind(this)}
                                />
                                </div>
                            </div>
                            <div className="dx-field">
                                <div className="dx-field-label">{this.lang.t("txtUser")}</div>
                                <div className="dx-field-value">
                                    <NdTextBox id="Kullanici" parent={this} simple={true} showClearButton={true} height='fit-content' valueChangeEvent="keyup" onValueChanging={(e)=>{this.keyboard.setInput(e)}}
                                    onFocusIn={()=>{this.keyboard.inputName = "Kullanici"}} placeholder={this.lang.t("txtUser")}
                                    />
                                </div>
                            </div>
                            <div className="dx-field">
                                <div className="dx-field-label">{this.lang.t("txtPass")}</div>
                                <div className="dx-field-value">
                                    <NdTextBox id="Sifre" parent={this} mode="password" showClearButton={true} height='fit-content' valueChangeEvent="keyup" onValueChanging={(e)=>{this.keyboard.setInput(e)}}
                                    onEnterKey={this.onLoginClick}
                                    onFocusIn={()=>{this.keyboard.inputName = "Sifre"}} placeholder={this.lang.t("txtPass")}
                                    />
                                </div>
                            </div>
                            <div className="row py-1">
                                <div className="col-12">
                                    <div className="dx-field">
                                        <Button
                                        width={'100%'}
                                        height='fit-content'
                                        text={this.lang.t("btnUserSelect")}
                                        type="success"
                                        stylingMode="contained"
                                        onClick={this.getUserList}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="row py-1">
                                <div className="col-6">
                                    <div className="dx-field">
                                        <Button
                                        width={'100%'}
                                        height='fit-content'
                                        text={this.lang.t("btnLogin")}
                                        type="default"
                                        stylingMode="contained"
                                        onClick={this.onLoginClick}
                                        />
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="dx-field">
                                        <Button
                                        width={'100%'}
                                        height='fit-content'
                                        text={this.lang.t("btnLogout")}
                                        type="danger"
                                        stylingMode="contained"
                                        onClick={this.closePage}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="row py-1">
                                <div className="col-12">
                                    <div className="dx-field">
                                        <Button
                                        icon={"fa-regular fa-id-card"}
                                        width={'100%'}
                                        height='50px'
                                        type="default"
                                        stylingMode="contained"
                                        onClick={this.cardIdRead}
                                        />
                                    </div>
                                </div>
                            </div>
                            {/* <div className="row">
                                <div className="col-12">
                                    <NbLabel id="info" parent={this} value={this.core.appInfo.name + " version : " + this.core.appInfo.version}/>
                                </div>
                            </div> */}
                             <div className="row">
                                <div className="col-5">
                                  
                                </div>
                                <div className="col-4">
                                    <img src="./css/img/Logo_NF_525-e1569399608233.jpg" height="70px"/>
                                </div>
                            </div>     
                            <div className="row">
                                <div className="col-4">
                                </div>
                                <div className="col-4">
                                <Button
                                        width={'100%'}
                                        height='fit-content'
                                        text={this.lang.t("about")}
                                        type="default"
                                        stylingMode="text"
                                        onClick={()=> {this.popAbout.show()}}
                                        />
                                </div>
                                <div className="col-4">
                                </div>
                            </div>     
                            <div>
                                <NdPopGrid id={"pg_users"} parent={this} container={"#root"}
                                visible={false}
                                position={{of:'#root'}} 
                                showTitle={true} 
                                showBorders={true}
                                width={'50%'}
                                height={'90%'}
                                title={this.lang.t("userListTitle")}
                                selection={{mode:"single"}}
                                >
                                    <Column dataField="CODE" caption="CODE" width={150} defaultSortOrder="asc"/>
                                    <Column dataField="NAME" caption="NAME" width={150} defaultSortOrder="asc" />                            
                                </NdPopGrid>
                            </div>
                            {/* CardId PopUp */}
                            <div>
                                <NdPopUp parent={this} id={"popCardId"} 
                                visible={false}
                                showCloseButton={false}
                                showTitle={true}
                                container={"#root"} 
                                width={'500'}
                                height={'500'}
                                position={{of:'#root'}}
                                >
                                    <Form colCount={1} height={'fit-content'}>
                                    <Item>
                                        <img src="./css/img/cardicon3.png" height="300px"/>
                                    </Item>
                                    <Item>
                                    <NdTextBox id="cardRead" parent={this} simple={true}  mode="password" showClearButton={true} height='fit-content'
                                    placeholder={this.lang.t("txtCardRead")}
                                    onKeyUp={async(k)=>
                                    {
                                        if(k.event.code != 'Enter')
                                        {
                                            setTimeout(() => {
                                                this.cardRead.value = ''
                                            }, 500);
                                        }
                                        else
                                        {
                                            this.cardIdCheck(this.cardRead.value)
                                        }
                                    }}
                                    />
                                    </Item>
                                    <Item>
                                        <Button width={'100%'} height='fit-content' text={this.lang.t("btnCancel")} type="default" stylingMode="contained"
                                        disabled={this.state.btnCardIdCancel}
                                        onClick={()=>{this.popCardId.hide()}}
                                        />
                                    </Item>
                                    </Form>
                                </NdPopUp>
                            </div>     
                            {/* About PopUp */}
                            <div>
                                <NdPopUp parent={this} id={"popAbout"} 
                                visible={false}
                                showCloseButton={true}
                                showTitle={true}
                                container={"#root"} 
                                width={'300'}
                                height={'250'}
                                title={this.lang.t("about")}
                                position={{my:'bottom',of:'#root'}}
                                >
                                    <Form colCount={1} height={'fit-content'}>
                                    <Item>
                                        <NbLabel id="abtCertificate" parent={this} value={this.lang.t("abtCertificate")}/>
                                    </Item>
                                    <Item>
                                        <NbLabel id="abtNrCertificate" parent={this} value={this.lang.t("abtNrCertificate")}/>
                                    </Item>
                                    <Item>
                                        <NbLabel id="abtLicence" parent={this} value={this.lang.t("abtLicence")}/>
                                    </Item>
                                    <Item>
                                        <NbLabel id="abtVersion" parent={this} value={this.lang.t("abtVersion") + this.core.appInfo.version}/>
                                    </Item>
                                    </Form>
                                </NdPopUp>
                            </div>                        
                    </div>
                </div>
                <div className="p-2"></div>
                <div className="card" style={this.style.keyboardBox}>
                    <NbKeyboard id={"keyboard"} parent={this} inputName="Kullanici"/>
                </div>
            </div>
        )
    }
}