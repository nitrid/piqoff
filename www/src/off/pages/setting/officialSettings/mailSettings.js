import React from 'react';
import App from '../../../lib/app.js';
import ScrollView from 'devextreme-react/scroll-view';
import { Label,Item,EmptyItem } from 'devextreme-react/form';
import { datatable } from '../../../../core/core.js';
import NdGrid,{Column,Editing,Paging,Scrolling,Pager,KeyboardNavigation,Popup,Lookup,Form} from '../../../../core/react/devex/grid.js';

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
            query: "SELECT * FROM MAIL_SETTINGS ORDER BY MAIL_ID DESC",
        }
        this.mailDt.insertCmd = 
        {
            query: "EXEC [dbo].[PRD_MAIL_SETTINGS_INSERT]" +
                    "@GUID = @PGUID," +
                    "@CUSER = @PCUSER," +
                    "@MAIL_SERVICE = @PMAIL_SERVICE," +
                    "@MAIL_ADDRESS = @PMAIL_ADDRESS," +
                    "@MAIL_PASSWORD = @PMAIL_PASSWORD," +
                    "@MAIL_SMTP = @PMAIL_SMTP," +
                    "@MAIL_PORT = @PMAIL_PORT ",
            param : ['PGUID:string|50','PCUSER:string|25','PMAIL_SERVICE:string|40','PMAIL_ADDRESS:string|70','PMAIL_PASSWORD:string|70',
                    'PMAIL_SMTP:string|25','PMAIL_PORT:int'],
            dataprm : ['GUID','CUSER','MAIL_SERVICE','MAIL_ADDRESS','MAIL_PASSWORD','MAIL_SMTP','MAIL_PORT']   
        }
        this.mailDt.updateCmd = 
        {
            query : "EXEC [dbo].[PRD_MAIL_SETTINGS_UPDATE]" +
                    "@GUID = @PGUID," +
                    "@CUSER = @PCUSER," +
                    "@MAIL_SERVICE = @PMAIL_SERVICE," +
                    "@MAIL_ADDRESS = @PMAIL_ADDRESS," +
                    "@MAIL_PASSWORD = @PMAIL_PASSWORD," +
                    "@MAIL_SMTP = @PMAIL_SMTP," +
                    "@MAIL_PORT = @PMAIL_PORT ",
            param : ['PGUID:string|50','PCUSER:string|25','PMAIL_SERVICE:string|40','PMAIL_ADDRESS:string|70','PMAIL_PASSWORD:string|70',
                    'PMAIL_SMTP:string|25','PMAIL_PORT:int'],
            dataprm : ['GUID','CUSER','MAIL_SERVICE','MAIL_ADDRESS','MAIL_PASSWORD','MAIL_SMTP','MAIL_PORT']
        }
        this.mailDt.deleteCmd = 
        {
            query : "EXEC [dbo].[PRD_MAIL_SETTINGS_DELETE] @GUID = @PGUID", 
            param : ['PGUID:string|50'],
            dataprm : ['GUID']
        }

        this.RoleCmb = [{CODE:'gmail',NAME:'gmail'},
                        {CODE:'yahoo',NAME:'yahoo'},
                        {CODE:'outlook',NAME:'outlook'},
                        {CODE:'laposte',NAME:'laposte'},
                        {CODE:'diğer',NAME:'diğer'}]

        this.init()
    }
    async init()
    {
        await this.mailDt.refresh();
        await this.grdMailSettings.dataRefresh({source:this.mailDt});
    }
    
    render()
    {
        return(
            <ScrollView>
                <div>
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <NdGrid id="grdMailSettings" 
                            parent={this} 
                            selection={{mode:"single"}} 
                            showBorders={true}
                            filterRow={{visible:true}} 
                            headerFilter={{visible:true}}
                            columnAutoWidth={true}
                            allowColumnReordering={true}
                            loadPanel={{enabled:true}}
                            allowColumnResizing={true}
                            onRowInserting={(e)=>
                            {
                                e.data.CUSER = this.core.auth.data.CODE
                                if(e.data.MAIL_SERVICE === 'gmail') 
                                {
                                    e.data.MAIL_SMTP = 'smtp.mail.gmail.com'
                                    e.data.MAIL_PORT = '587'
                                }
                                if(e.data.MAIL_SERVICE === 'yahoo') 
                                {
                                    e.data.MAIL_SMTP = 'stmp.mail.yahoo.com'
                                    e.data.MAIL_PORT = '465'
                                }
                                if(e.data.MAIL_SERVICE === 'outlook') 
                                {
                                   e.data.MAIL_SMTP = 'smtp.office365.com'
                                   e.data.MAIL_PORT = '587'
                                }
                                if(e.data.MAIL_SERVICE === 'laposte') 
                                {
                                    e.data.MAIL_SMTP = 'smtp.laposte.net'
                                    e.data.MAIL_PORT = '465'
                                }
                            }}>                            
                                <Paging defaultPageSize={20} />
                                <Pager visible={true} allowedPageSizes={[5,10,50]} showPageSizeSelector={true} />
                                <Editing mode="popup" allowUpdating={true} allowAdding={true} allowDeleting={true}>
                                <Popup title="Mail Info" showTitle={true} width={750} height={343}/>
                                    <Form colCount={2}>
                                        <Item dataField="MAIL_SERVICE"/>
                                        <Item dataField="MAIL_ADDRESS" />
                                        <Item dataField="MAIL_PASSWORD" />
                                        <Item dataField="MAIL_SMTP" />
                                        <Item dataField="MAIL_PORT"/>
                                    </Form>
                                </Editing>
                                <Column dataField="MAIL_SERVICE" caption={this.t("grdMailSettings.clmMailService")} visible={true} allowEditing={true}>
                                    <Lookup dataSource={this.RoleCmb} valueExpr="CODE" displayExpr="CODE" />
                                </Column>
                                <Column dataField="MAIL_ADDRESS" caption={this.t("grdMailSettings.clmMail")} visible={true}/> 
                                <Column dataField="MAIL_PASSWORD" editorOptions={{mode:"password"}} caption={this.t("grdMailSettings.clmMailPassword")} visible={true}/>
                                <Column dataField="MAIL_SMTP" caption={this.t("grdMailSettings.clmSMTP")}  width={180}/>
                                <Column dataField="MAIL_PORT" caption={this.t("grdMailSettings.clmPORT")}  width={80}/>
                            </NdGrid>
                        </div>
                    </div>
                </div>
            </ScrollView>
        )
    }
}