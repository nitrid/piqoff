import React from 'react';
import App from '../lib/app.js';
import NdGrid,{Column,Editing,Popup,Paging,Scrolling,KeyboardNavigation,Lookup} from  '../../core/react/devex/grid.js';
import Form, { Label,Item,EmptyItem } from 'devextreme-react/form';
import NdSelectBox from '../../core/react/devex/selectbox.js';
import { userCls } from '../../core/cls/users.js';
import ScrollView from 'devextreme-react/scroll-view.js';
import DropDownBox from 'devextreme-react/drop-down-box';
import NdListBox from '../../core/react/devex/listbox.js';
import List from 'devextreme-react/list';
import { datatable } from '../../core/core.js';

export default class userPage extends React.Component
{
    constructor(props)
    {
        super(props)

        this.core = App.instance.core;
        this.userObj = new userCls()
        this.RoleCmb = [{CODE:'Administrator',NAME:'Administrator'},{CODE:'User',NAME:'User'},{CODE:'Pos',NAME:'Pos'}]
        this.AppCmb = [{CODE:'OFF',NAME:'OFF'},{CODE: 'POS',NAME:'POS'},{CODE:'MOB',NAME:'MOB'},{CODE:'TAB',NAME:'TAB'},{CODE:'ADMIN',NAME:'ADMIN'},{CODE:'BOSS',NAME:'BOSS'}]

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
            <ScrollView>
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
                        onRowUpdating={async (e)=>
                        {
                            if(typeof e.newData.PWD != 'undefined')
                            {
                                e.newData.PWD = btoa(e.newData.PWD)
                            }
                        }}
                        onRowPrepared={async (e)=>
                        {
                        
                        }}
                        onRowUpdated={async (e)=>
                        {
                            let tmpJetData =
                            {
                                CUSER:this.core.auth.data.CODE,            
                                DEVICE:'',
                                CODE:'130',
                                NAME:"information et autorisation de l'utilisateur modifier.", //BAK
                                DESCRIPTION:'',
                                APP_VERSION:this.core.appInfo.version
                            }
                            this.core.socket.emit('nf525',{cmd:"jet",data:tmpJetData})
                            await this.userObj.save()
                        }}
                        onRowInserted={async (e)=>
                        {
                            let data = this.userObj.dt().where({CODE:e.data.CODE})
                            if(data.length > 0)
                            {
                                this.userObj.dt()[this.userObj.dt().length - 1].PWD = btoa(data[0].PWD)
                                this.userObj.dt()[this.userObj.dt().length - 1].GUID = datatable.uuidv4()
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
                                <Item dataField="LAST_NAME" />
                                <Item dataField="PWD"/>
                                <Item dataField="ROLE" />
                                <Item dataField="SHA" />
                                <Item dataField="USER_APP" />
                                <Item dataField="STATUS" editorType="boolean" />
                            </Item>
                            </Form>
                            </Editing>
                            <Column dataField="CODE" caption={this.t("grdUserList.clmCode")}/>
                            <Column dataField="NAME" caption={this.t("grdUserList.clmName")} />
                            <Column dataField="LAST_NAME" caption={this.t("grdUserList.clmLastName")} />
                            <Column dataField="PWD" editorOptions={{mode:"password"}} caption={this.t("grdUserList.clmPwd")} visible={false}/>
                            <Column dataField="CARDID" caption={this.t("grdUserList.clmCardId")}/>
                            <Column dataField="ROLE" caption={this.t("grdUserList.clmRole")} >
                                <Lookup dataSource={this.RoleCmb} valueExpr="CODE" displayExpr="CODE" /> 
                            </Column>
                            <Column dataField="USER_APP" caption={this.t("grdUserList.clmApp")} editCellComponent={(e)=>
                            {
                                if(typeof e.data.value == 'undefined')
                                {
                                    e.data.value = ""
                                }
                                return (<DropDownBox 
                                    dataSource={e.data.column.lookup.dataSource}
                                    value={e.data.value.split(',')}
                                    valueExpr="CODE"
                                    displayExpr="NAME"
                                    showClearButton={true}
                                    contentRender={()=>
                                    {
                                        return(
                                            <NdListBox id='columnListBox' parent={this} data={{source: e.data.column.lookup.dataSource}}
                                            width={'100%'}
                                            showSelectionControls={true}
                                            selectionMode={'multiple'}
                                            displayExpr={'NAME'}
                                            keyExpr={'CODE'}
                                            value={e.data.value.split(',')}
                                            onOptionChanged={(x)=>
                                            {
                                                if (x.name == 'selectedItemKeys') 
                                                {
                                                    e.data.setValue(x.value.join(','))
                                                    e.data.data.USER_APP = x.value.join(',')
                                                }
                                            }}
                                            />
                                        )
                                    }}
                                ></DropDownBox>)
                            }}
                            cellTemplate={(container, options) => 
                            {
                                container.textContent = options.value;
                                container.title = options.value;
                            }}
                            >
                                <Lookup dataSource={this.AppCmb} valueExpr="CODE" displayExpr="NAME" /> 
                            </Column>
                            <Column dataField="STATUS" caption={this.t("grdUserList.clmStatus")} dataType="boolean" />
                        </NdGrid>
                    </div>
                </div>
            </ScrollView>
        )
    }
}