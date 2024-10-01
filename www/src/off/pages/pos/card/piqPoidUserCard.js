import React from 'react';
import App from '../../../lib/app.js';

import ScrollView from 'devextreme-react/scroll-view';
import Toolbar from 'devextreme-react/toolbar';

import NdButton from '../../../../core/react/devex/button.js';
import NdGrid,{Column,Editing,Paging,Scrolling} from '../../../../core/react/devex/grid.js';

import { dialog } from '../../../../core/react/devex/dialog.js';
import { datatable } from '../../../../core/core.js';

export default class piqPoidUserCard extends React.PureComponent
{
    constructor(props)
    {
        super(props)
        this.core = App.instance.core;
        this.prmObj = this.param.filter({TYPE:1,USERS:this.user.CODE});
        this.prevCode = "";
        this.tabIndex = props.data.tabkey
        this.dialogOpene = false

        this.userDt = new datatable()
        this.userDt.selectCmd = 
        {
            query : "SELECT * FROM BALANCE_USERS WHERE DELETED = 0"
        }
        this.userDt.insertCmd = 
        {
            query : "INSERT INTO BALANCE_USERS (GUID,CDATE,CUSER,LDATE,LUSER,CODE,NAME,DELETED) VALUES (@GUID,GETDATE(),@CUSER,GETDATE(),@LUSER,@CODE,@NAME,0)",
            param : ['GUID:string|50','CUSER:string|25','LUSER:string|25','CODE:string|25','NAME:string|50'],
            dataprm : ['GUID','CUSER','LUSER','CODE','NAME']
        }
        this.userDt.updateCmd = 
        {
            query : "UPDATE BALANCE_USERS SET LDATE = GETDATE(),LUSER = @LUSER, CODE = @CODE, NAME = @NAME WHERE GUID = @GUID",
            param : ['LUSER:string|25','CODE:string|25','NAME:string|50','GUID:string|50'],
            dataprm : ['LUSER','CODE','NAME','GUID']
        }
        this.userDt.deleteCmd = 
        {
            query : "UPDATE BALANCE_USERS SET DELETED = 1 WHERE GUID = @GUID",
            param : ['GUID:string|50'],
            dataprm : ['GUID']
        }
    }
    async componentDidMount()
    {
        await this.core.util.waitUntil(0)
        this.init()
    }
    async init()
    {
        await this.userDt.refresh()
        await this.grdUserList.dataRefresh({source:this.userDt})
    }
    render()
    {
        return(
            <div>
                <ScrollView>
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <NdGrid id="grdUserList" parent={this} 
                            showBorders={true}
                            allowColumnResizing={true}
                            selection={{mode:"single"}} 
                            width={'100%'}
                            height={'600'}
                            data={this.data}
                            dbApply={true}
                            filterRow={{visible:true}} headerFilter={{visible:true}}
                            onRowInserting={async(e)=>
                            {
                                if (!this.dialogOpened) 
                                {
                                    let tmpConfObj =
                                    {
                                        id:'msgAlertCodeName',showTitle:true,title:this.t("msgAlertCodeName.title"),showCloseButton:true,width:'500px',height:'200px',
                                        button:[{id:"btn01",caption:this.t("msgAlertCodeName.btn01"),location:'before'}],
                                    }
                                    if(typeof e.data.CODE == 'undefined' || e.data.CODE == null)
                                    {
                                        e.cancel = true;
                                        this.dialogOpened = true;
                                        tmpConfObj.content = (<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgAlertCodeName.msg1")}</div>)
                                        await dialog(tmpConfObj);
                                        this.dialogOpened = false;
                                        console.log(1)
                                        return
                                    }
                                    if(typeof e.data.NAME == 'undefined' || e.data.NAME == null)
                                    {
                                        e.cancel = true;
                                        this.dialogOpened = true;
                                        tmpConfObj.content = (<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgAlertCodeName.msg2")}</div>)
                                        await dialog(tmpConfObj);
                                        this.dialogOpened = false;
                                        return
                                    }
                                }
                                else
                                {
                                    e.cancel = true;
                                }
                                
                                if(typeof e.data.GUID == 'undefined')
                                {
                                    e.data.GUID = datatable.uuidv4()
                                }
                                if(typeof e.data.CUSER == 'undefined')
                                {
                                    e.data.CUSER = this.core.auth.data.CODE
                                }
                                if(typeof e.data.LUSER == 'undefined')
                                {
                                    e.data.LUSER = this.core.auth.data.CODE
                                }
                            }}
                            onRowUpdating={async(e)=>
                            {
                                if (!this.dialogOpened) 
                                {
                                    let tmpConfObj =
                                    {
                                        id:'msgAlertCodeName',showTitle:true,title:this.t("msgAlertCodeName.title"),showCloseButton:true,width:'500px',height:'200px',
                                        button:[{id:"btn01",caption:this.t("msgAlertCodeName.btn01"),location:'before'}],
                                    }
                                    if(typeof e.newData.CODE != 'undefined' && e.newData.CODE == '')
                                    {
                                        e.cancel = true;
                                        this.dialogOpened = true;
                                        tmpConfObj.content = (<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgAlertCodeName.msg1")}</div>)
                                        await dialog(tmpConfObj);
                                        this.dialogOpened = false;
                                        return
                                    }
                                    if(typeof e.newData.NAME != 'undefined' && e.newData.NAME == '')
                                    {
                                        e.cancel = true;
                                        this.dialogOpened = true;
                                        tmpConfObj.content = (<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgAlertCodeName.msg2")}</div>)
                                        await dialog(tmpConfObj);
                                        this.dialogOpened = false;
                                        return
                                    }
                                }
                                else
                                {
                                    e.cancel = true;
                                }
                                e.key.LUSER = this.core.auth.data.CODE
                            }}
                            >
                                <Editing mode="cell" allowUpdating={true} allowAdding={true} allowDeleting={true}/>
                                <Column dataField="CODE" caption={this.t("grdUserList.clmCode")}/>
                                <Column dataField="NAME" caption={this.t("grdUserList.clmName")} />
                            </NdGrid>
                        </div>
                    </div>
                </ScrollView>
            </div>
        )
    }
}
