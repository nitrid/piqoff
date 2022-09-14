import React from 'react';
import App from '../lib/app.js';
import NdGrid,{Column,Editing,Popup,Paging,Scrolling,KeyboardNavigation,Lookup} from  '../../core/react/devex/grid.js';
import Form, { Label,Item,EmptyItem } from 'devextreme-react/form';
import NdSelectBox from '../../core/react/devex/selectbox.js';
import { userCls } from '../../core/cls/users.js';

export default class userPage extends React.Component
{
    constructor(props)
    {
        super(props)

        this.core = App.instance.core;
        this.userObj = new userCls()
        this.RoleCmb = [{CODE: 'Administrator', NAME: 'Administrator'}, {CODE: 'User', NAME: 'User'}]

        this._cellRoleRender = this._cellRoleRender.bind(this)
    }
    _cellRoleRender(e)
    {
       
    }
    async init()
    {
        await this.userObj.load();
        await this.grdUserList.dataRefresh({source:this.userObj.dt('USERS')});
    }
    componentDidMount()
    {
        this.init()
    }
    render()
    {
        return(
            <div className="row p-2">
                <div className="col-12">
                    <NdGrid id="grdUserList" parent={this} onSelectionChanged={this.onSelectionChanged} 
                    showBorders={true}
                    allowColumnResizing={true}
                    selection={{mode:"single"}} 
                    width={'100%'}
                    height={'100%'}
                    data={this.data}
                    dbApply={false}
                    filterRow={{visible:true}} headerFilter={{visible:true}}
                    param={this.param.filter({ELEMENT:'grdUserList',USERS:this.user.CODE})} 
                    access={this.access.filter({ELEMENT:'grdUserList',USERS:this.user.CODE})}
                    onRowUpdating={(e)=>
                    {
                        if(typeof e.newData.PWD != 'undefined')
                        {
                            e.newData.PWD = btoa(e.newData.PWD)
                        }
                    }}
                    onRowInserted={async (e)=>
                    {
                        let data = this.userObj.dt().where({CODE:e.data.CODE})
                        if(data.length > 0)
                        {
                            this.userObj.dt()[this.userObj.dt().length - 1].PWD = btoa(data[0].PWD)
                            await this.userObj.save()
                            
                            let tmpQuery = 
                            {
                                query :"SELECT GUID,CODE FROM USERS WHERE CODE = @CODE " ,
                                param : ['CODE:string|50'],
                                value : [e.data.CODE]
                            }

                            let tmpData = await this.core.sql.execute(tmpQuery) 
                            
                            if(tmpData.result.recordset.length > 0)
                            {
                                await this.core.auth.refreshToken(tmpData.result.recordset[0].GUID)
                            }
                        }
                    }}
                    >
                        <Editing
                        mode="popup"
                        allowUpdating={true}
                        allowAdding={true}
                        allowDeleting={false}
                        >
                        <Popup title={this.t("UserEdit")} showTitle={true} width={700} height={525} />
                        <Form>
                        <Item itemType="group" colCount={2}>
                            <Item dataField="CODE" />
                            <Item dataField="NAME" />
                            <Item dataField="PWD"/>
                            <Item dataField="ROLE" />
                            <Item dataField="SHA" />
                            <Item dataField="STATUS" editorType="boolean" />
                        </Item>
                        </Form>
                        </Editing>
                        <Column dataField="CODE" caption={this.t("grdUserList.clmCode")} />
                        <Column dataField="NAME" caption={this.t("grdUserList.clmName")} />
                        <Column dataField="PWD" editorOptions={{mode:"password"}} caption={this.t("grdUserList.clmPwd")} visible={false}/>
                        <Column dataField="CARDID" caption={this.t("grdUserList.clmCardId")}/>
                        <Column dataField="ROLE" caption={this.t("grdUserList.clmRole")} >
                        <Lookup dataSource={this.RoleCmb} valueExpr="CODE" displayExpr="CODE" /> </Column>
                        <Column dataField="STATUS" caption={this.t("grdUserList.clmStatus")} dataType="boolean" />
                    </NdGrid>
                </div>
            </div>
        )
    }
}