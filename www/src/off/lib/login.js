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
import { i18n, loadLocaleResources } from './i18n';
import NbKeyboard from "../tools/keyboard.js";
import { Gallery } from 'devextreme-react/gallery';
import { locale, loadMessages, formatMessage } from 'devextreme/localization';
import { dialog } from '../../core/react/devex/dialog.js';
import NbLabel from '../../core/react/bootstrap/label.js';
import { datatable } from '../../core/core';

export default class Login extends React.PureComponent
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
                top: '40%',
                width: '450px',
                height: '450px',
            },

        }  
        this.state = 
        {
            kullanici: '',
            sifre: '',
            alert: '',
            isDbSelect: false
        }  
        this.core = App.instance.core;    
        this.lang = App.instance.lang;
        this.image = ['../../cardicon3.png'];

        this.cardIdCheck = this.cardIdCheck.bind(this)
        this.onLoginClick = this.onLoginClick.bind(this)
        this.cardIdRead = this.cardIdRead.bind(this)
        this.getUserList = this.getUserList.bind(this)
        this.textValueChanged = this.textValueChanged.bind(this)
        this.setUser = this.setUser.bind(this)
    }
    async componentDidMount()
    {
        await this.core.util.waitUntil(0)
        this.Kullanici.focus()
        // DATABASE SEÇİMİ İÇİN YAPILDI
        try
        {
            const response = await fetch('/config.js');
            const configText = await response.text();
            let pluginsConf = eval('(' + configText.replace('export default','').replace(/;$/, '') + ')');
            this.dbConfig = pluginsConf.databases;

            if(typeof this.dbConfig != 'undefined' && this.dbConfig.length > 0)
            {
                this.setState({isDbSelect: true})
                this.txtDbSelect.value = this.dbConfig[0].CODE
                this.core.sql.selectedDb = this.txtDbSelect.value
            }
        }
        catch (error) 
        {
            this.dbConfig = [];
            this.setState({isDbSelect: false})
        }
        //*************************************** */
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
        
        if((await this.core.auth.login(this.state.kullanici,this.state.sifre,'OFF')))
        {
            localStorage.setItem('lang',localStorage.getItem('lang') == null ? 'tr' : localStorage.getItem('lang'))
            // SADECE UYGULAMAYA AİT KULLANICILARININ GİREMEMESİ İÇİN YAPILDI
            let tmpDt = new datatable()
            tmpDt.import([this.core.auth.data])
            if(tmpDt.where({USER_APP : {"LIKE" : "OFF"}}).length == 0)
            {
                this.setState({logined:false,alert:this.lang.t("msgUserAccess")})
            }
            else
            {
                //ÇOKLU DATABASE SEÇİMİ İÇİN YAPILDI
                if(typeof this.dbConfig != 'undefined' && this.dbConfig.length > 0)
                {
                    window.sessionStorage.setItem('selectedDb',this.txtDbSelect.value)
                }

                App.instance.setState({logined:true});
                App.instance.setUser()
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
        let tmpDt = new datatable()
        tmpDt.import(tmpData)
        tmpDt = tmpDt.where({USER_APP : {"LIKE" : "OFF"}})
        await this.pg_users.setData(tmpDt)
        this.pg_users.show()
        this.pg_users.onClick = (data) =>
        {
            this.setState({kullanici: data[0].CODE});
            this.Kullanici.setState({value:data[0].CODE})
        }
    }
    closePage()
    {
        window.close()
    }
    setUser()
    {
        App.instance.setState({toolbarItems:[
            {
                widget : 'dxButton',
                location : 'before',
                options : 
                {
                    icon : 'menu',
                    onClick : () => this.setState({opened: !this.state.opened})
                }
            },
            {
                widget : 'dxButton',
                location : 'after',
                options : 
                {
                    text:this.lang.t("passChange"),
                    icon : 'repeat',
                    onClick : this.passChange
                }
            },
            {
                widget : 'dxButton',
                location : 'after',
                options : 
                {
                    text:this.core.auth.data.NAME,
                    icon : 'card',
                    onClick : App.instance.UserChange
                }
            },
            {
                widget : 'dxSelectBox',
                location : 'after',
                options : 
                {
                    width: 80,
                    items: [{id:"de",text:"DE"},{id:"en",text:"EN"},{id:"fr",text:"FR"},{id:"tr",text:"TR"}],
                    valueExpr: 'id',
                    displayExpr: 'text',
                    value: localStorage.getItem('lang') == null ? 'tr' : localStorage.getItem('lang'),
                    onValueChanged: (args) => 
                    {
                        localStorage.setItem('lang',args.value)
                        i18n.changeLanguage(args.value)
                        locale(args.value)
                        window.location.reload()
                    }
                }
            },
            {
                widget : 'dxButton',
                location : 'after',
                options : 
                {
                    icon : 'refresh',
                    onClick : () => window.location.reload()
                }
            },
            {
                widget : 'dxButton',
                location : 'after',
                options : 
                {
                    icon : 'fa-solid fa-arrow-right-to-bracket',
                    onClick : () => 
                    { 
                        window.sessionStorage.removeItem('selectedDb')                                                        
                        this.core.auth.logout()
                        window.location.reload()
                    }
                }
            }
        ]})
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
        let idCheck = false
        let tmpData = await this.core.auth.getUserList()
        for (let i = 0; i < tmpData.length; i++) 
        {
            if(tmpData[i].CARDID == pValue)
            {
                if(await this.core.auth.login(tmpData[i].CODE,tmpData[i].PWD,'OFF'))
                {
                    // SADECE UYGULAMAYA AİT KULLANICILARININ GİREMEMESİ İÇİN YAPILDI
                    let tmpDt = new datatable()
                    tmpDt.import([this.core.auth.data])
                    if(tmpDt.where({USER_APP : {"LIKE" : "OFF"}}).length == 0)
                    {
                        this.setState({logined:false,alert:this.lang.t("msgUserAccess")})
                    }
                    else
                    {
                        App.instance.setState({logined:true});
                        idCheck = true
                    }
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
                id:'msgInvalidUser',showTitle:true,title:this.lang.t("msgInvalidUser"),showCloseButton:true,width:'500px',height:'auto',
                button:[{id:"btn01",caption:this.lang.t("btnOk"),location:'after'}],
                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgInvalidUser")}</div>)
            }

            await dialog(tmpConfObj);
        }
    }
    dbSelectedView()
    {
        if(this.state.isDbSelect)
        {
            return(
                <div className="dx-field">
                    <div className="dx-field-label">{this.lang.t("txtDbSelect")}</div>
                    <div className="dx-field-value">
                        <NdTextBox id="txtDbSelect" parent={this} simple={true} tabIndex={this.tabIndex} readOnly={true}
                        button=
                        {
                            [
                                {
                                    id:'01',
                                    icon:'more',
                                    onClick:async()=>
                                    {
                                        await this.popDbList.setData(this.dbConfig)
                                        this.popDbList.show()
                                        this.popDbList.onClick = (data) =>
                                        {
                                            if(data.length > 0)
                                            {
                                                this.txtDbSelect.value = data[0].CODE
                                                this.core.sql.selectedDb = this.txtDbSelect.value
                                            }
                                        }
                                    }
                                }
                            ]
                        }
                        />
                        {/* DATABASE SEÇİM POPUP */}
                        <NdPopGrid id={"popDbList"} parent={this} container={"#root"} 
                        visible={false}
                        position={{of:'#root'}} 
                        showTitle={true} 
                        showBorders={true}
                        width={'40%'}
                        height={'50%'}
                        headerFilter={{visible:false}}
                        filterRow={{visible:false}}
                        title={this.lang.t("popDbList.title")} 
                        selection={{mode:"single"}}
                        >
                            <Column dataField="CODE" caption={this.lang.t("popDbList.clmCode")} width={'100%'} />
                        </NdPopGrid>    
                    </div>
                </div>
            )
        }
        else
        {
            return
        }
    }
    render()
    {
        return (
            <div style={this.style.body}>
                <div className="p-5" style={{WebkitAppRegion:'drag'}}></div>
                <div className="card" style={this.style.login_box}>
                    <div className="card-header">
                        <div className='row'>
                            <div className='col-4'></div>
                            <div className='col-8'>
                                <img src="./css/img/piqsoftlogo.png" height="48px"/>
                            </div>
                        </div>
                    </div>
                   <div className="card-body">
                        <div className="row">
                            <div className="col-12 pb-2">
                                <h6 className="text-center" style={{color:'#ff7675'}}>{this.state.alert}</h6>
                            </div>
                        </div>
                        <div className="dx-field" style={{margin:'0px'}}>
                            <div className="dx-field-label" style={{textAlign:'right',paddingRight:'10px',paddingTop:'3px'}}>{this.lang.t("txtLangSelect")}</div>
                            <div className="dx-field-value">
                                <NdSelectBox simple={true} parent={this} id="cmbType" height='fit-content'
                                displayExpr="text"                       
                                valueExpr="id"
                                value= {localStorage.getItem('lang') == null ? 'tr' : localStorage.getItem('lang')}
                                data={{source:[{id:"de",text:"DE"},{id:"en",text:"EN"},{id:"fr",text:"FR"},{id:"tr",text:"TR"},{id:"at",text:"AT"}]}}
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
                        {this.dbSelectedView()}
                        <div className="dx-field" style={{margin:'0px'}}>
                            <div className="dx-field-label" style={{textAlign:'right',paddingRight:'10px',paddingTop:'3px'}}>{this.lang.t("txtUser")}</div>
                            <div className="dx-field-value">
                                <NdTextBox id="Kullanici" parent={this} simple={true} showClearButton={true} height='fit-content' valueChangeEvent="keyup" onValueChanged={this.textValueChanged} 
                                placeholder={this.lang.t("txtUser")}
                                />
                            </div>
                        </div>
                        <div className="dx-field" style={{margin:'0px'}}>
                            <div className="dx-field-label" style={{textAlign:'right',paddingRight:'10px',paddingTop:'3px'}}>{this.lang.t("txtPass")}</div>
                            <div className="dx-field-value">
                                <NdTextBox id="Sifre" parent={this} mode="password" showClearButton={true} height='fit-content' valueChangeEvent="keyup" onValueChanged={this.textValueChanged}
                                onEnterKey={this.onLoginClick}
                                placeholder={this.lang.t("txtPass")}
                                />
                            </div>
                        </div>
                        <div className="row">
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
                        <div className="row">
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
                        <div className="row">
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
                        <div className="row pt-1">
                            <div className="col-3">
                                
                            </div>
                            <div className="col-3">
                                <img src="./css/img/LogoNF525.jpg" height="70px"/>
                            </div>
                            <div className="col-4">
                                <img src="./css/img/nf203.jpg" height="70px"/>
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
                        <NdPopGrid id={"pg_users"} parent={this} container={"#root"}
                        visible={false}
                        position={{of:'#root'}} 
                        showTitle={true} 
                        showBorders={true}
                        width={'50%'}
                        height={'90%'}
                        selection={{mode:"single"}}
                        title={this.lang.t("userListTitle")}
                        >
                            <Column dataField="CODE" caption="CODE" width={150} defaultSortOrder="asc"/>
                            <Column dataField="NAME" caption="NAME" width={150} defaultSortOrder="asc" />                            
                        </NdPopGrid>
                         {/* CardId PopUp */}              
                        <NdPopUp parent={this} id={"popCardId"} 
                        visible={false}
                        showCloseButton={true}
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
                                      }, 1200);
                                    }
                                    else
                                    {
                                       this.cardIdCheck(this.cardRead.value)
                                    }
                                }}
                                />
                            </Item>
                            </Form>
                        </NdPopUp>
                        {/* About PopUp */}
                        <div>
                            <NdPopUp parent={this} id={"popAbout"} 
                            visible={false}
                            showCloseButton={true}
                            showTitle={true}
                            container={"#root"} 
                            width={'300'}
                            height={'270'}
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
                                        <NbLabel id="abtNrCertificate2" parent={this} value={this.lang.t("abtNrCertificate2")}/>
                                    </Item>
                                    <Item>
                                        <NbLabel id="abtLicence" parent={this} value={this.lang.t("abtLicence")}/>
                                    </Item>
                                    <Item>
                                        <NbLabel id="abtVersion" parent={this} value={this.lang.t("abtVersion") + this.core.appInfo.version}/>
                                    </Item>
                                    <Item>
                                        <NbLabel id="abtMacId" parent={this} value={"MacId: " + App.instance.macid}/>
                                    </Item>
                                </Form>
                            </NdPopUp>
                        </div>  
                   </div>
                </div>
                <div className="p-2"></div>              
            </div>
        )
    }
}