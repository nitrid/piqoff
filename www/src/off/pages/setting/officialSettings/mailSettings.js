import React from 'react';
import App from '../../../lib/app.js';
import { transportTypeCls} from '../../../../core/cls/doc.js';


import ScrollView from 'devextreme-react/scroll-view';
import Toolbar from 'devextreme-react/toolbar';
import Form, { Label,Item,EmptyItem } from 'devextreme-react/form';
import TabPanel from 'devextreme-react/tab-panel';
import { Button } from 'devextreme-react/button';

import NdTextBox, { Validator, NumericRule, RequiredRule, CompareRule, EmailRule, PatternRule, StringLengthRule, RangeRule, AsyncRule } from '../../../../core/react/devex/textbox.js'
import NdCheckBox from '../../../../core/react/devex/checkbox.js';
import NdPopGrid from '../../../../core/react/devex/popgrid.js';
import NdPopUp from '../../../../core/react/devex/popup.js';
import NdButton from '../../../../core/react/devex/button.js';
import { dialog } from '../../../../core/react/devex/dialog.js';
import { datatable } from '../../../../core/core.js';
import NdSelectBox from '../../../../core/react/devex/selectbox.js';

import { docCls,docItemsCls, docCustomerCls } from '../../../../core/cls/doc.js';
import { supportCls } from '../../../../core/cls/company.js';
import moment from 'moment';

import ContextMenu from 'devextreme-react/context-menu';
import NdNumberBox from '../../../../core/react/devex/numberbox.js';
import NdGrid,{Column,Editing,Paging,Scrolling,Pager,KeyboardNavigation,Popup,Lookup} from '../../../../core/react/devex/grid.js';
import NdDatePicker from '../../../../core/react/devex/datepicker.js';
import NdImageUpload from '../../../../core/react/devex/imageupload.js';
import HTMLReactParser from 'html-react-parser';
import tr from '../../../meta/lang/devexpress/tr.js';

export default class mailSettings extends React.PureComponent
{
    constructor(props)
    {
        super(props)
        this.core = App.instance.core;
        this.prmObj = this.param.filter({TYPE:1,USERS:this.user.CODE});
        this.mailDt = new datatable();
        this.mailDt.selectCmd = 
        {
            query: "SELECT * FROM MAIL_SETTINGS",
        }
        this.mailDt.insertCmd = 
        {
            query: "EXEC [dbo].[PRD_MAIL_SETTINGS_INSERT]" +
                "@GUID = @PGUID," +
                "@CUSER = @PCUSER," +
                "@CDATE = @PCDATE," +
                "@MAIL_SERVICE = @PMAIL_SERVICE," +
                "@MAIL_ADDRESS = @PMAIL_ADDRESS," +
                "@MAIL_PASSWORD = @PMAIL_PASSWORD," +
                "@MAIL_SMTP = @PMAIL_SMTP," +
                "@MAIL_PORT = @PMAIL_PORT ",
            param : ['PGUID:string|50','PCUSER:string|25','PCDATE:date','PMAIL_SERVICE:string|40','PMAIL_ADDRESS:string|70','PMAIL_PASSWORD:string|70','PMAIL_SMTP:string|25'
                    ,'PMAIL_PORT:int'],
            dataprm : ['GUID','CUSER','CDATE','MAIL_SERVICE','MAIL_ADDRESS','MAIL_PASSWORD','MAIL_SMTP','MAIL_PORT']   
        }
        this.mailDt.updateCmd = 
        {
            query : "EXEC [dbo].[PRD_MAIL_SETTINGS_UPDATE]" +
                    "@GUID = @PGUID," +
                    "@CUSER = @PCUSER," +
                    "@CDATE = @PCDATE," +
                    "@MAIL_SERVICE = @PMAIL_SERVICE," +
                    "@MAIL_ADDRESS = @PMAIL_ADDRESS," +
                    "@MAIL_PASSWORD = @PMAIL_PASSWORD," +
                    "@MAIL_SMTP = @PMAIL_SMTP," +
                    "@MAIL_PORT = @PMAIL_PORT ",
            param : ['PGUID:string|50','PCUSER:string|25','PCDATE:date','PMAIL_SERVICE:string|40','PMAIL_ADDRESS:string|70','PMAIL_PASSWORD:string|70','PMAIL_SMTP:string|25'
                    ,'PMAIL_PORT:int'],
            dataprm : ['GUID','CUSER','CDATE','MAIL_SERVICE','MAIL_ADDRESS','MAIL_PASSWORD','MAIL_SMTP','MAIL_PORT']
        }
        this.mailDt.deleteCmd = 
        {
            query : "EXEC [dbo].[PRD_MAIL_SETTINGS_DELETE] @GUID = @PGUID", 
            param : ['PGUID:string|50'],
            dataprm : ['GUID']
        }

        this.init()
    }
    async init()
    {
        console.log(this.core)
        await this.mailDt.refresh();
        await this.grdMailSettings.dataRefresh({source:this.mailDt});
//         this.mailDt[0].MAIL_ID = 1453;

//         let x = 
//         {
//             CUSER:'',
//             CDATE:moment(new Date()).format("YYYY-MM-DD"),
//             MAIL_SERVICE:'',
//             MAIL_ADDRESS:'',
//             CODE:'001',
//             MAIL_PASSWORD:'',
//             MAIL_SMTP:'',
//             MAIL_PORT:'',
//             MAIL_ID:1454,
//         }
//         this.mailDt.push()
//         this.mailDt.removeAt(0)
// console.log(this.mailDt)
        // await this.mailDt.delete()
        // await this.mailDt.update()


    }

    render()
    {
        return(
            <ScrollView>
                <div>
                    <div className='row col p-2'>
                        <Toolbar>
                            <Item location="after" locateInMenu="auto">
                                <NdButton id="btnSave" parent={this} icon="floppy" type="default"
                                onClick={async ()=>
                                {
                                    console.log(this.mailDt.length)
                                    if(this.mailDt.length > 0)
                                    {
                                        await this.mailDt.update()
                                    }                                                                      
                                }}/>
                            </Item>
                            <Item location="after">
                            <Button icon="add" type='default' onClick={async () => {

                                await this.popAddMail.show();

                                this.cmbMailService.value = 0;
                                this.txtBoxOther.value = "";
                                this.txtBoxMail.value = "";
                                this.txtBoxPsswd.value = "";
                                this.txtBoxSmtp.value = "";
                                this.txtBoxPort.value = "";
                            }} />
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
                                        this.mailDt.removeAt(0)
                                        this.init(); 
                                    }
                                }}/>
                            </Item>
                        </Toolbar>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <NdGrid id="grdMailSettings" parent={this} 
                            selection={{mode:"single"}} 
                            showBorders={true}
                            filterRow={{visible:true}} 
                            headerFilter={{visible:true}}
                            columnAutoWidth={true}
                            allowColumnReordering={true}
                            loadPanel={{enabled:true}}
                            allowColumnResizing={true}
                            >                            
                                <Paging defaultPageSize={20} />
                                <Pager visible={true} allowedPageSizes={[5,10,50]} showPageSizeSelector={true} />
                                <Editing mode="popup" allowUpdating={true} allowAdding={true} allowDeleting={true}>
                                <Popup title="Mail Info" showTitle={true} width={750} height={525}/>
                                    <Form>
                                        <Column dataField="MAIL_SERVICE" visible={true}/>
                                        <Item dataField="MAIL_ADDRESS" visible={true}/>
                                        <Item dataField="MAIL_PASSWORD" visible={true}/>
                                        <Item dataField="MAIL_SMTP" visible={true}/>
                                        <Item dataField="MAIL_PORT" visible={true}/>
                                    </Form>
                                </Editing>
                                <Column dataField="CDATE" caption={this.t("grdMailSettings.clmDate")} visible={true} dataType="date" width={150}
                                editorOptions={{value:null}}
                                cellRender={(e) => 
                                {
                                    if(moment(e.value).format("YYYY-MM-DD") != '1970-01-01')
                                    {
                                        return e.text
                                    }
                                    return
                                }}/>
                                <Column dataField="CUSER" caption={this.t("grdMailSettings.clmUser")} visible={true} width={180}/> 
                                <Column dataField="MAIL_SERVICE" caption={this.t("grdMailSettings.clmMailService")} visible={true}>
                                    <Lookup dataSource={{source:[{ID:0,VALUE:("gmail")},{ID:1,VALUE:("outlook")},{ID:2,VALUE:("yahoo")},{ID:3,VALUE:("laposte")}]}.RoleCmb} valueExpr="MAIL_SERVICE" displayExpr="MAIL_SERVICE" />
                                </Column>
                                <Column dataField="MAIL_ADDRESS" caption={this.t("grdMailSettings.clmMail")} visible={true}/> 
                                <Column dataField="MAIL_PASSWORD" caption={this.t("grdMailSettings.clmMailPassword")} visible={true}/> 
                                <Column dataField="MAIL_SMTP" caption={this.t("grdMailSettings.clmSMTP")} visible={true} width={180}/> 
                                <Column dataField="MAIL_PORT" caption={this.t("grdMailSettings.clmPORT")} visible={true} width={80}/> 
                                <Column dataField="MAIL_ID" caption={this.t("grdMailSettings.clmID")} visible={true} width={80}/> 
                            </NdGrid>
                        </div>
                    </div>
                </div>
                {/* Mail add POPUP */}
                {/* <NdPopUp parent={this} id={"popAddMail"} 
                        visible={false}
                        showCloseButton={true}
                        showTitle={true}
                        title={this.t("popAddMail.title")}
                        container={"#root"} 
                        width={'800'}
                        height={'380'}
                        position={{of:'#root'}}
                        >
                        <div className='row pt-4'>
                            <div className='col-10 mx-auto'>
                                <Form colCount={4}>
                                    <Item colSpan={2}>
                                        <Label text={this.t("cmbMailService.title")} alignment="right" />
                                        <NdSelectBox id="cmbMailService" parent={this} displayExpr="VALUE" valueExpr="ID" height='fit-content' simple={true} 
                                        data={{source:[{ID:0,VALUE:("gmail")},{ID:1,VALUE:("outlook")},{ID:2,VALUE:("yahoo")},{ID:3,VALUE:("laposte")}]}}/>                                     
                                    </Item>
                                    <Item colSpan={2}> 
                                        <Label text={this.t("txtMailService.other")} alignment="right" />
                                        <NdTextBox id="txtBoxOther" parent={this} simple={true} placeholder={this.t("txtMailService.otherPlace")} maxLength={32}/>
                                    </Item> 
                                    <Item colSpan={4}>
                                        <Label text={this.t("txtMailService.mail")} alignment="right" />
                                        <NdTextBox id="txtBoxMail" parent={this} simple={true} placeholder={this.t("txtMailService.mailPlace")} maxLength={32}/>
                                    </Item>
                                    <Item colSpan={4}>
                                        <Label text={this.t("txtMailService.password")} alignment="right" />
                                        <NdTextBox id="txtBoxPsswd" parent={this} simple={true} placeholder={this.t("txtMailService.passwordPlace")} maxLength={32} mode='password'/>     
                                    </Item> 
                                    <Item colSpan={2}> 
                                        <Label text={this.t("txtMailService.smtp")} alignment="right" />
                                        <NdTextBox id="txtBoxSmtp" parent={this} simple={true} placeholder={this.t("txtMailService.smtpPlace")} maxLength={32}/>
                                    </Item>
                                    <Item colSpan={2}>
                                        <Label text={this.t("txtMailService.port")} alignment="right" />
                                        <NdTextBox id="txtBoxPort" parent={this} simple={true} placeholder={this.t("txtMailService.portPlace")} maxLength={32}/>
                                    </Item>
                                    <Item location="after" locateInMenu="auto" colSpan={4}>
                                        <NdButton id="btnSave" parent={this} icon="floppy" type="default" width="100%" text={this.t("txtMailService.btnSave")}  onClick={()=>
                                        {
                                            let tmpData = 
                                            {
                                                CUSER :this.core.auth.data.CUSER,
                                                CDATE:moment(new Date()).format("YYYY-MM-DD"),
                                                MAIL_SERVICE:this.cmbMailService.value,
                                                MAIL_ADDRESS:this.txtBoxMail.value,
                                                MAIL_PASSWORD:this.txtBoxPsswd.value,
                                                MAIL_SMTP:this.txtBoxSmtp.value,
                                                MAIL_PORT:this.txtBoxPort.value,
                                            }
                                            this.mailDt.push(tmpData)
                                            this.popAddMail.hide()
                                        }}/>
                                    </Item>
                                </Form>
                            </div>
                        </div>
                </NdPopUp> */}
            </ScrollView>
        )
    }
}

