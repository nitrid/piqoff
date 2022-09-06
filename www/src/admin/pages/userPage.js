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
        await this.userObj.load({});
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
                    filterRow={{visible:true}} headerFilter={{visible:true}}
                    param={this.param.filter({ELEMENT:'grdUserList',USERS:this.user.CODE})} 
                    access={this.access.filter({ELEMENT:'grdUserList',USERS:this.user.CODE})}
                    onRowUpdating={(e)=>
                    {
                        console.log(e)
                        if(typeof e.newData.PWD != 'undefined')
                        {
                            e.newData.PWD = btoa(e.newData.PWD)
                        }
                    }}
                >
                <Editing
                    mode="popup"
                    allowUpdating={true}
                    allowAdding={true}
                    allowDeleting={true}>
                    <Popup title={this.t("UserEdit")} showTitle={true} width={700} height={525} />
                    <Form>
                    <Item itemType="group" colCount={2}>
                        <Item dataField="CODE" />
                        <Item dataField="NAME" />
                        <Item dataField="PWD"/>
                        <Item dataField="ROLE" />
                        <Item dataField="STATUS" editorType="boolean" />
                    </Item>
                    </Form>
                </Editing>
                <Column dataField="CODE" caption={this.t("grdUserList.clmCode")} />
                <Column dataField="NAME" caption={this.t("grdUserList.clmName")} />
                <Column dataField="PWD" editorOptions={{mode:"password"}} caption={this.t("grdUserList.clmPwd")} visible={false}/>
                <Column dataField="ROLE" caption={this.t("grdUserList.clmRole")} >
                <Lookup dataSource={this.RoleCmb} valueExpr="CODE" displayExpr="CODE" /> </Column>
                <Column dataField="STATUS" caption={this.t("grdUserList.clmStatus")} dataType="boolean" />
                    </NdGrid>
                </div>
            </div>
        )
    }
}