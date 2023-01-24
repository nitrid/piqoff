import React from 'react';
import Form, { GroupItem,Item,Label } from 'devextreme-react/form';
import Toolbar from 'devextreme-react/toolbar';
import App from '../../../../admin/lib/app.js';
import NdSelectBox from '../../../../core/react/devex/selectbox.js';
import NdTextBox from '../../../../core/react/devex/textbox.js';
import {datatable,param} from '../../../../core/core.js';
import {prm} from '../../../../off/meta/prm.js'

export default class UserParam extends React.PureComponent
{
    constructor(props)
    {
        super(props)
        
        this.core = App.instance.core;
        
        this._cmbUserRender = this._cmbUserRender.bind(this)
        this._cmbParamRender = this._cmbParamRender.bind(this)
        this._txtTemplate = this._txtTemplate.bind(this)

        this.tmpMeta = prm.filter(x => x.APP === 'OFF');

        this.param = new param(prm);
        
        this.state = 
        {
            prmMeta : [] 
        }
    }
    async _pageLoad(pUserId,pPrmId)
    {
        await this.param.load({PAGE:pPrmId,APP:'OFF',USERS:pUserId})
        this.setState(
            {
                prmMeta : this.tmpMeta.filter(x => x.PAGE === pPrmId)
            }
        )
    }
    _cmbUserRender(e)
    {        
        let onValueChanged = function(data)
        {
            if(typeof this.parent.cmbUser.value != 'undefined' && typeof this.parent.cmbParam.value != 'undefined')
            {
                this.parent._pageLoad(this.parent.cmbUser.value,this.parent.cmbParam.value)
            }
        }
        return (
            <NdSelectBox 
                simple={true}
                parent={this}                             
                id = "cmbUser"                             
                displayExpr = "NAME"                       
                valueExpr = "CODE"
                data={{source: {select : {query:"SELECT CODE,NAME FROM USERS"},sql : this.core.sql}}}
                onValueChanged={onValueChanged}
            >
            </NdSelectBox>
        )
    }
    _cmbParamRender(e)
    {
        let tmpPrmCmb = [];

        for (let i = 0; i < Object.keys(this.tmpMeta.toGroupBy("PAGE")).length; i++) 
        {
            let tmpGrpData = this.tmpMeta.toGroupBy("PAGE")[Object.keys(this.tmpMeta.toGroupBy("PAGE"))[i]]            
            if(tmpGrpData.length > 0 && typeof tmpGrpData[0].PAGE != 'undefined' && typeof tmpGrpData[0].VIEW != 'undefined' && typeof tmpGrpData[0].VIEW.PAGE_NAME != 'undefined')
            {
                tmpPrmCmb.push({CODE : tmpGrpData[0].PAGE,NAME : tmpGrpData[0].VIEW.PAGE_NAME})
            }            
        }
        
        let onValueChanged = function(data)
        {
            if(typeof this.parent.cmbUser.value != 'undefined' && typeof this.parent.cmbParam.value != 'undefined')
            {
                this.parent._pageLoad(this.parent.cmbUser.value,this.parent.cmbParam.value)
            }
        }
        
        return (
            <NdSelectBox 
                simple={true}
                parent={this}                             
                id = "cmbParam"                             
                displayExpr = "NAME"                       
                valueExpr = "CODE"      
                data={{source: tmpPrmCmb}}
                onValueChanged={onValueChanged}
            >
            </NdSelectBox>
        )
    }
    _txtTemplate(e)
    {
        return (
            <NdTextBox id={e.editorOptions.value.ID} parent={this} simple={true} value={this.param.filter({ID:e.editorOptions.value.ID}).getValue()}/>
        )
    }
    _grpRender()
    {
        return(
            <GroupItem name="GrpItem" caption={" "} colCount={2}>
            {
                this.state.prmMeta.map((pItem,pIndex) => 
                {
                    if(typeof pItem.VIEW != 'undefined')
                    {
                        if(typeof pItem.VIEW.TYPE == 'undefined' || pItem.VIEW.TYPE == 'text')
                        {
                            return (
                                <Item key={pItem.ID} editorOptions={{value:pItem}} render={this._txtTemplate}><Label text={pItem.VIEW.CAPTION} /></Item>
                            )
                        }
                    }
                })
            }
            </GroupItem>
        )
    }
    componentDidMount()
    {
        
    }
    render()
    {
        return (
            <div>
                <div className="row p-2">
                    <div className="col-12">
                        <Toolbar>
                            <Item location="after"
                            locateInMenu="auto"
                            widget="dxButton"
                            options=
                            {
                                {
                                    type: 'default',
                                    icon: 'doc',
                                    onClick: () => 
                                    {
                                        console.log(111)
                                    }
                                }    
                            } />
                            <Item location="after"
                            locateInMenu="auto"
                            widget="dxButton"
                            options=
                            {
                                {
                                    type: 'default',
                                    icon: 'clear',
                                    onClick: () => 
                                    {
                                        console.log(111)
                                    }
                                }    
                            } />
                            <Item location="after"
                            locateInMenu="auto"
                            widget="dxButton"
                            options=
                            {
                                {
                                    type: 'default',
                                    icon: 'save',
                                    onClick: async () => 
                                    {
                                        let tmpData = [...this.state.prmMeta]
                                        for (let i = 0; i < tmpData.length; i++) 
                                        {
                                            tmpData[i].USERS = this.cmbUser.value
                                            tmpData[i].VALUE = this[tmpData[i].ID].value
                                            this.param.add(tmpData[i])
                                        }

                                        await this.param.save()
                                    }
                                }    
                            } />
                        </Toolbar>
                    </div>
                </div>
                <div className="row p-2">
                    <div className="col-12">                        
                        <Form
                        colCount={1}
                        id="form"
                        >
                            <GroupItem colCount={2}>
                                <Item render={this._cmbUserRender}><Label text={"Kullanıcı "} /></Item>
                                <Item render={this._cmbParamRender}><Label text={"Parametre "} /></Item>
                            </GroupItem>
                            {this._grpRender()}
                        </Form>
                    </div>
                </div>
            </div>
        )
    }
}
