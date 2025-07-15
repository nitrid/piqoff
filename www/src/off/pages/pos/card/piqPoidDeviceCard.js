import React from 'react';
import App from '../../../lib/app.js';
import ScrollView from 'devextreme-react/scroll-view';
import NdGrid,{Column,Editing} from '../../../../core/react/devex/grid.js';
import { dialog } from '../../../../core/react/devex/dialog.js';
import { datatable } from '../../../../core/core.js';

export default class piqPoidDeviceCard extends React.PureComponent
{
    constructor(props)
    {
        super(props)
        this.core = App.instance.core;
        this.prmObj = this.param.filter({TYPE:1,USERS:this.user.CODE});
        this.prevCode = "";
        this.tabIndex = props.data.tabkey
        this.dialogOpene = false

        this.deviceDt = new datatable()
        this.deviceDt.selectCmd = 
        {
            query : "SELECT * FROM BALANCE_DEVICES WHERE DELETED = 0"
        }
        this.deviceDt.insertCmd = 
        {
            query : "INSERT INTO BALANCE_DEVICES (GUID,CDATE,CUSER,LDATE,LUSER,CODE,NAME,MACID,LANG,USER_CODE,USER_PWD,DELETED) VALUES (@GUID,dbo.GETDATE(),@CUSER,dbo.GETDATE(),@LUSER,@CODE,@NAME,@MACID,@LANG,@USER_CODE,@USER_PWD,0)",
            param : ['GUID:string|50','CUSER:string|25','LUSER:string|25','CODE:string|10','NAME:string|50','MACID:string|50','LANG:string|5','USER_CODE:string|25','USER_PWD:string|50'],
            dataprm : ['GUID','CUSER','LUSER','CODE','NAME','MACID','LANG','USER_CODE','USER_PWD']
        }
        this.deviceDt.updateCmd = 
        {
            query : "UPDATE BALANCE_DEVICES SET LDATE = dbo.GETDATE(),LUSER = @LUSER, CODE = @CODE, NAME = @NAME, MACID = @MACID, LANG = @LANG, USER_CODE = @USER_CODE, USER_PWD = @USER_PWD WHERE GUID = @GUID",
            param : ['LUSER:string|25','CODE:string|10','NAME:string|50','MACID:string|50','LANG:string|5','USER_CODE:string|25','USER_PWD:string|50','GUID:string|50'],
            dataprm : ['LUSER','CODE','NAME','MACID','LANG','USER_CODE','USER_PWD','GUID']
        }
        this.deviceDt.deleteCmd = 
        {
            query : "UPDATE BALANCE_DEVICES SET DELETED = 1 WHERE GUID = @GUID",
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
        await this.deviceDt.refresh()
        await this.grdDeviceList.dataRefresh({source:this.deviceDt})
    }
    render()
    {
        return(
            <div id={this.props.data.id + this.tabIndex}>
                <ScrollView>
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <NdGrid id="grdDeviceList" parent={this} 
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
                                        id:'msgAlertCodeName',showTitle:true,title:this.t("msgAlertCodeName.title"),showCloseButton:true,width:'500px',height:'auto',
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
                                if(typeof e.data.MACID == 'undefined')
                                {
                                    e.data.MACID = ""
                                }
                                if(typeof e.data.LANG == 'undefined')
                                {
                                    e.data.LANG = ""
                                }
                                if(typeof e.data.USER_CODE == 'undefined')
                                {
                                    e.data.USER_CODE = ""
                                }
                                if(typeof e.data.USER_PWD == 'undefined')
                                {
                                    e.data.USER_PWD = ""
                                }
                            }}
                            onRowUpdating={async(e)=>
                            {
                                if (!this.dialogOpened) 
                                {
                                    let tmpConfObj =
                                    {
                                        id:'msgAlertCodeName',showTitle:true,title:this.t("msgAlertCodeName.title"),showCloseButton:true,width:'500px',height:'auto',
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
                                <Column dataField="CODE" caption={this.t("grdDeviceList.clmCode")}/>
                                <Column dataField="NAME" caption={this.t("grdDeviceList.clmName")} />
                                <Column dataField="MACID" caption={this.t("grdDeviceList.clmMacId")}/>
                                <Column dataField="LANG" caption={this.t("grdDeviceList.clmLang")} />
                                <Column dataField="USER_CODE" caption={this.t("grdDeviceList.clmUserCode")}/>
                                <Column dataField="USER_PWD" caption={this.t("grdDeviceList.clmUserPwd")} 
                                cellRender={(cellData) => 
                                {
                                    const passwordLength = cellData.value ? cellData.value.length : 0;
                                    const maskedValue = '•'.repeat(passwordLength);
                                    return <span>{maskedValue}</span>;
                                }}/>
                            </NdGrid>
                        </div>
                    </div>
                </ScrollView>
            </div>
        )
    }
}
