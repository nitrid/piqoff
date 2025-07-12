import React from 'react';
import App from '../../../lib/app.js';

import ScrollView from 'devextreme-react/scroll-view';

import NdGrid,{ Column,Editing } from '../../../../core/react/devex/grid.js';

import { datatable } from '../../../../core/core.js';
import { NdToast } from '../../../../core/react/devex/toast.js';
export default class propertyCard extends React.PureComponent
{
    constructor(props)
    {
        super(props)
        this.core = App.instance.core;
        this.prmObj = this.param.filter({TYPE:1,USERS:this.user.CODE});
        this.prevCode = "";
        this.tabIndex = props.data.tabkey
        this.dialogOpene = false

        this.propertyDt = new datatable()
        this.propertyDt.selectCmd = 
        {
            query : `SELECT * FROM PROPERTY WHERE DELETED = 0`
        }
        this.propertyDt.insertCmd = 
        {
            query : `INSERT INTO PROPERTY (GUID,CDATE,CUSER,LDATE,LUSER,CODE,NAME,DELETED) VALUES (@GUID,dbo.GETDATE(),@CUSER,dbo.GETDATE(),@LUSER,@CODE,@NAME,0)`,
            param : ['GUID:string|50','CUSER:string|25','LUSER:string|25','CODE:string|25','NAME:string|50'],
            dataprm : ['GUID','CUSER','LUSER','CODE','NAME']
        }
        this.propertyDt.updateCmd = 
        {
            query : `UPDATE PROPERTY SET LDATE = dbo.GETDATE(),LUSER = @LUSER, CODE = @CODE, NAME = @NAME WHERE GUID = @GUID`,
            param : ['LUSER:string|25','CODE:string|25','NAME:string|50','GUID:string|50'],
            dataprm : ['LUSER','CODE','NAME','GUID']
        }
        this.propertyDt.deleteCmd = 
        {
            query : `UPDATE PROPERTY SET DELETED = 1 WHERE GUID = @GUID`,
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
        await this.propertyDt.refresh()
        await this.grdPropertyList.dataRefresh({source:this.propertyDt})
    }
    render()
    {
        return(
            <div>
                <ScrollView>
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <NdGrid id="grdPropertyList" parent={this} 
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
                                    if(typeof e.data.CODE == 'undefined' || e.data.CODE == null)
                                    {
                                        e.cancel = true;
                                        this.dialogOpened = true;
                                        this.toast.show({message:this.t("msgAlertCodeName.msg1"),type:'warning'})
                                        this.dialogOpened = false;
                                        return
                                    }
                                    if(typeof e.data.NAME == 'undefined' || e.data.NAME == null)
                                    {
                                        e.cancel = true;
                                        this.dialogOpened = true
                                        this.toast.show({message:this.t("msgAlertCodeName.msg2"),type:'warning'})
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
                                    if(typeof e.newData.CODE != 'undefined' && e.newData.CODE == '')
                                    {
                                        e.cancel = true;
                                        this.dialogOpened = true;
                                        this.toast.show({message:this.t("msgAlertCodeName.msg1"),type:'warning'})
                                        this.dialogOpened = false;
                                        return
                                    }
                                    if(typeof e.newData.NAME != 'undefined' && e.newData.NAME == '')
                                    {
                                        e.cancel = true;
                                        this.dialogOpened = true;
                                        this.toast.show({message:this.t("msgAlertCodeName.msg2"),type:'warning'})
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
                                <Column dataField="CODE" caption={this.t("grdPropertyList.clmCode")}/>
                                <Column dataField="NAME" caption={this.t("grdPropertyList.clmName")} />
                            </NdGrid>
                        </div>
                    </div>
                    <NdToast id={"toast"} parent={this} displayTime={2000} position={{at:"top center",offset:'0px 110px'}}/>
                </ScrollView>
            </div>
        )
    }
}
