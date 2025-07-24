import React from 'react';
import App from '../lib/app.js';
import NdGrid,{Column,Editing,Popup,Paging,Scrolling,KeyboardNavigation,Lookup} from  '../../core/react/devex/grid.js';
import Form, { Label,Item,EmptyItem } from 'devextreme-react/form';
import NdSelectBox from '../../core/react/devex/selectbox.js';
import NdPopUp from '../../core/react/devex/popup.js';
import NdPopGrid from '../../core/react/devex/popgrid.js';
import { roleCls } from '../../core/cls/roles.js';

export default class userPage extends React.PureComponent
{
    constructor(props)
    {
        super(props)

        this.core = App.instance.core;
        this.roleObj = new roleCls();

        this._cellRoleRender = this._cellRoleRender.bind(this)
    }
    _cellRoleRender(e)
    {
       
    }
    async init()
    {
        await this.roleObj.load({});
        await this.grdRoleList.dataRefresh({source:this.roleObj.dt('ROLE')});
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
                <NdGrid id="grdRoleList" parent={this} onSelectionChanged={this.onSelectionChanged} 
                    showBorders={true}
                    allowColumnResizing={true}
                    selection={{mode:"single"}} 
                    width={'100%'}
                    height={'100%'}
                    data={this.data}
                    filterRow={{visible:true}} headerFilter={{visible:true}}
                    param={this.param.filter({ELEMENT:'grdRoleList',USERS:this.user.CODE})} 
                    access={this.access.filter({ELEMENT:'grdRoleList',USERS:this.user.CODE})}
                >
                    <Editing
                    mode="popup"
                    allowUpdating={true}
                    allowAdding={true}
                    allowDeleting={true}>
                    <Popup title={this.t("RoleEdit")} showTitle={true} width={700} height={525} />
                    <Form>
                        <Item itemType="group" colCount={2}>
                            <Item dataField="CODE" />
                            <Item dataField="NAME" />
                        </Item>
                    </Form>
                </Editing>
                <Column dataField="CODE" caption={this.t("grdRoleList.clmCode")} />
                <Column dataField="NAME" caption={this.t("grdRoleList.clmName")} />
                </NdGrid>
                </div>
            </div>
        )
    }
}