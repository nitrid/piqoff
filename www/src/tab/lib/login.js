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
import { locale, loadMessages, formatMessage } from 'devextreme/localization';
import NdDialog from '../../core/react/devex/dialog.js';
import NdButton from '../../core/react/devex/button.js';
import NdCheckBox from 'devextreme-react/check-box';

export default class Login extends React.PureComponent
{
    constructor()
    {
        super()
        this.style =
        {
            body : 
            {
                backgroundColor : '#154c79',                
                height : '100%',
                paddingTop : '100px' 
            },
            login_box :
            {
                position : 'inherit',
                margin :'auto',
                top : '50%',
                width : '350px',
                height : 'fit-content',
                backgroundColor : 'rgba(255,255,255,0.95)',  
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                borderRadius: '8px'
            }
        }  
        this.state = 
        {
            kullanici: '',
            sifre: '',
            alert: '',
            showTransferButton: false,
            rememberMe: false
        }  
        this.core = App.instance.core;    
        this.lang = App.instance.lang;

        this.onLoginClick = this.onLoginClick.bind(this)
        this.getUserList = this.getUserList.bind(this)
        this.textValueChanged = this.textValueChanged.bind(this)
    }
    async componentDidMount()
    {
        await this.core.util.waitUntil(0)
        
        if(typeof localStorage.userName != 'undefined' && typeof localStorage.userPwd != 'undefined')
        {
            this.setState({rememberMe: true})
            this.setState({
                kullanici: localStorage.userName,
                sifre: localStorage.userPwd
            })
            this.Kullanici.value = localStorage.userName 
            this.Sifre.value = localStorage.userPwd
        }
        this.Kullanici.focus()
    }
    textValueChanged(e) 
    {      
        if(e.element.id == 'Kullanici')
        {
            this.setState({kullanici: e.value});
        } 
        else if(e.element.id == 'Sifre')
        {
            this.setState({sifre: e.value});
        }
    }
    async onLoginClick(e)
    {
        if(this.state.kullanici == '' && this.state.sifre == '')
        {
            return;
        }

        if(this.state.rememberMe)
        {
            localStorage.userName = this.state.kullanici
            localStorage.userPwd = this.state.sifre
        }
        else
        {
            localStorage.removeItem('userName')
            localStorage.removeItem('userPwd')
        }
        
        if((await this.core.auth.login(this.state.kullanici,this.state.sifre,'TAB')))
        {
            localStorage.setItem('lang',localStorage.getItem('lang') == null ? 'tr' : localStorage.getItem('lang'))
            
            if(this.core.local.platform != '')
            {
                this.setState({showTransferButton: true});
                this.msgDataTransferOption.show();
            }
            else 
            {
                await this.completeLogin();
            }
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
    closePage()
    {
        window.close()
    }
    async completeLogin(withTransfer = false)
    {
        if(withTransfer)
        {
            this.msgDataTransfer.show()
            await App.instance.transfer.transferSql(true)
            this.msgDataTransfer.hide()
        }
        
        await App.instance.loadTab()
        App.instance.setState({logined:true});
    }
    render()
    {
        return (
            <div style={this.style.body}>
                <div className="card" style={this.style.login_box}>
                   <div className="card-header" style={{backgroundColor:'#154c79',color:'white',borderRadius:'8px 8px 0 0'}}>Login</div>
                   <div className="card-body">
                        <div className="row">
                            <div className="col-12">
                                <h6 className="text-center" style={{color:'#FF6B6B'}}>{this.state.alert}</h6>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-10 pb-2">
                            
                            </div>
                            <div className="col-2 pb-2">
                                <Button icon="preferences" visible={App.instance.device}
                                onClick={()=>window.location="../tab/appUpdate.html"}
                                />
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
                                <NdTextBox id="Kullanici" parent={this} simple={true} showClearButton={true} height='fit-content' valueChangeEvent="keyup" onValueChanged={this.textValueChanged}  
                                placeholder={this.lang.t("txtUser")}/>
                            </div>
                        </div>
                        <div className="dx-field">
                            <div className="dx-field-label">{this.lang.t("txtPass")}</div>
                            <div className="dx-field-value">
                                <NdTextBox id="Sifre" parent={this} mode="password" showClearButton={true} height='fit-content' valueChangeEvent="keyup" onValueChanged={this.textValueChanged} 
                                onEnterKey={this.onLoginClick}
                                placeholder={this.lang.t("txtPass")}
                                />
                            </div>
                        </div>
                        <div className="dx-field">
                            <NdCheckBox id="chkRememberMe" 
                                parent={this} 
                                text={this.lang.t("chkRememberMe")} 
                                value={this.state.rememberMe}
                                onValueChanged={(e) => this.setState({rememberMe: e.value})}
                            />
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
                                    style={{backgroundColor:'#154c79',color:'white'}}
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
                                    style={{backgroundColor:'#FF6B6B',color:'white'}}
                                    />
                                </div>
                            </div>
                        </div>
                        <NdPopGrid id={"pg_users"} parent={this} container={"#root"}
                        visible={false}
                        position={{of:'#root'}} 
                        showTitle={true} 
                        showBorders={true}
                        width={'100%'}
                        height={'100%'}
                        selection={{mode:"single"}}
                        title={this.lang.t("userListTitle")}
                        >
                            <Column dataField="CODE" caption="CODE" width={150} defaultSortOrder="asc"/>
                            <Column dataField="NAME" caption="NAME" width={150} defaultSortOrder="asc" />                            
                        </NdPopGrid>
                   </div>
                </div>
                <div className="p-2"></div>
                {/* Veri Transfer Seçenek Popup'ı */}
                <div>
                    <NdDialog id={"msgDataTransferOption"} container={"#root"} parent={this}
                    position={{of:'#root'}} 
                    showTitle={true} 
                    title={this.lang.t("msgDataTransferOption.title")} 
                    showCloseButton={false}
                    width={"400px"}
                    height={"200px"}
                    >
                        <div className="row">
                            <div className="col-12 py-2">
                                <div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgDataTransferOption.msg")}</div>
                            </div>
                            <div className='col-6'>
                                <NdButton text={this.lang.t("msgDataTransferOption.btnYes")} type="normal" stylingMode="contained" width={'100%'}
                                onClick={async()=>
                                {
                                    this.msgDataTransferOption.hide();
                                    await this.completeLogin(true);  
                                }}/>
                            </div>
                            <div className="col-6">
                                <NdButton text={this.lang.t("msgDataTransferOption.btnNo")} type="normal" stylingMode="contained" width={'100%'}
                                onClick={async()=>
                                {
                                    this.msgDataTransferOption.hide();
                                    await this.completeLogin(false);  
                                }}/>
                            </div>
                        </div>
                    </NdDialog>
                </div>
                {/* Mevcut Data Transfer Popup'ı */}
                <div>
                    <NdDialog id={"msgDataTransfer"} container={"#root"} parent={this}
                    position={{of:'#root'}} 
                    showTitle={true} 
                    title={this.lang.t("msgDataTransfer.title")} 
                    showCloseButton={false}
                    width={"400px"}
                    height={"120px"}
                    >
                        <div className="row">
                            <div className="col-12 py-2">
                                <div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgDataTransfer.msg")}</div>
                            </div>
                        </div>
                    </NdDialog>
                </div>
            </div>
        )
    }
}