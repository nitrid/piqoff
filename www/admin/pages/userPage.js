import React from 'react';
import App from '../lib/app.js';
import NdGrid,{Column,Editing,Popup,Paging,Scrolling,KeyboardNavigation,} from  '../../core/react/devex/grid.js';
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

        this._cellRoleRender = this._cellRoleRender.bind(this)
    }
    _cellRoleRender(e)
    {
        let onValueChanged = function(data)
        {
            e.setValue(data.value)
        }
        return (
            <NdSelectBox 
                parent={this}                             
                id = "cmbRole"                             
                displayExpr = "NAME"                       
                valueExpr = "CODE"      
                defaultValue = {e.value}
                onValueChanged={onValueChanged}
                data={{source: {select : {query:"SELECT CODE,NAME FROM ROLE"},sql : this.core.sql}}}
            >
            </NdSelectBox>
        )
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
                >
                    <Editing
                    mode="popup"
                    allowUpdating={true}
                    allowAdding={true}
                    allowDeleting={true}>
                    <Popup title={this.t("UserEdit")} showTitle={true} width={700} height={525} />
                    <Form>
                    <Item itemType="group" colCount={2} colSpan={2}>
                        <Item dataField="CODE" />
                        <Item dataField="NAME" />
                        <Item dataField="PWD" />
                        <Item dataField="ROLE" />
                        <Item dataField="STATUS" editorType="boolean" />
                    </Item>
                    </Form>
                </Editing>
                <Column dataField="CODE" caption="CODE" />
                <Column dataField="NAME" caption="NAME" />
                <Column dataField="PWD" caption="PWD" visible={false}/>
                <Column dataField="ROLE" caption="ROLE" editCellRender={this._cellRoleRender} />
                <Column dataField="STATUS" caption="STATUS" dataType="boolean" />
                </NdGrid>
                </div>
            </div>
        )
    }
}