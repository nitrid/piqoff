import React from 'react';
import Form, { GroupItem,Item,Label } from 'devextreme-react/form';
import Toolbar from 'devextreme-react/toolbar';
import App from '../../../../admin/lib/app.js';
import NdSelectBox from '../../../../core/react/devex/selectbox.js';
import NdCheckBox from '../../../../core/react/devex/checkbox.js';
import {datatable,access} from '../../../../core/core.js';
import {acs} from '../../../../off/meta/acs.js'

export default class UserAccess extends React.PureComponent
{
    constructor(props)
    {
        super(props)
        
        this.core = App.instance.core;
        
        this._cmbUserRender = this._cmbUserRender.bind(this)
        this._cmbAcsRender = this._cmbAcsRender.bind(this)

        this.tmpMeta = acs.filter(x => x.APP === 'OFF');

        this.access = new access(acs);
        
        this.state = 
        {
            acsMeta : [] ,
        }
        
    }
    async _pageLoad(pUserId,pPrmId)
    {
        await this.access.load({PAGE:pPrmId,APP:'OFF',USERS:pUserId})
        this.setState(
            {
                acsMeta : this.tmpMeta.filter(x => x.PAGE === pPrmId),
            }
        )
    }
    _cmbUserRender(e)
    {        
        let onValueChanged = function(data)
        {
            if(typeof this.parent.cmbUser.value != 'undefined' && typeof this.parent.cmbAcs.value != 'undefined')
            {
                this.parent._pageLoad(this.parent.cmbUser.value,this.parent.cmbAcs.value)
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
    _cmbAcsRender(e)
    {
        let tmpAcsCmb = [];

        for (let i = 0; i < Object.keys(this.tmpMeta.toGroupBy("PAGE")).length; i++) 
        {
            let tmpGrpData = this.tmpMeta.toGroupBy("PAGE")[Object.keys(this.tmpMeta.toGroupBy("PAGE"))[i]]            
            if(tmpGrpData.length > 0 && typeof tmpGrpData[0].PAGE != 'undefined' && typeof tmpGrpData[0].VIEW != 'undefined' && typeof tmpGrpData[0].VIEW.PAGE_NAME != 'undefined')
            {
                tmpAcsCmb.push({CODE : tmpGrpData[0].PAGE,NAME : tmpGrpData[0].VIEW.PAGE_NAME})
            }            
        }
        
        let onValueChanged = function(data)
        {
            if(typeof this.parent.cmbUser.value != 'undefined' && typeof this.parent.cmbAcs.value != 'undefined')
            {
                this.parent._pageLoad(this.parent.cmbUser.value,this.parent.cmbAcs.value)
            }
        }
        
        return (
            <NdSelectBox 
                simple={true}
                parent={this}                             
                id = "cmbAcs"                             
                displayExpr = "NAME"                       
                valueExpr = "CODE"      
                data={{source: tmpAcsCmb}}
                onValueChanged={onValueChanged}
            >
            </NdSelectBox>
        )
    }
    _grpRender()
    {
        let tmpCheckBox = (function(e)
        {
            return (
                <NdCheckBox id={e.name}  text={e.editorOptions.text} parent={this} simple={true} defaultValue={e.editorOptions.value}  />
            )
        }).bind(this)
        return(
            <GroupItem name="GrpItem" caption={" "} colCount={2}>
            {
                this.state.acsMeta.map((pItem,pIndex) => 
                {
                    if(typeof pItem.VIEW != 'undefined')
                    {
                        if(typeof pItem.VIEW.TYPE == 'undefined' || pItem.VIEW.TYPE == 'text')
                        {
                            let tmpVisible = false;
                            let tmpEditable = false;
                            if(typeof  pItem.VALUE != 'undefined')
                            {
                                let tmpD = this.access.filter({ID:pItem.ID}).getValue()
                                console.log(tmpD.visible)
                                if(typeof tmpD.visible != 'undefined')
                                {
                                    tmpVisible = tmpD.visible
                                }
                                if(typeof pItem.VALUE.editable != 'undefined')
                                {
                                    tmpEditable = tmpD.editable
                                }
                            }

                            return (
                                <Item key={pItem.ID + "_M"}><Label text={pItem.VIEW.CAPTION} />
                                    <Form colCount={2}>
                                        <Item name={pItem.ID + "_1"} editorOptions={{value:tmpVisible,text:"Visible"}} render={tmpCheckBox}></Item>
                                        <Item name={pItem.ID + "_2"} editorOptions={{value:tmpEditable,text:"Editable"}} render={tmpCheckBox}></Item>
                                    </Form>
                                </Item>
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
                                        
                                        let tmpData = [...this.state.acsMeta]
                                       
                                        for (let i = 0; i < tmpData.length; i++) 
                                        {
                                            let tmpObj = {}
                                            tmpObj.visible = this[tmpData[i].ID + "_1"].value
                                            tmpObj.editable = this[tmpData[i].ID + "_2"].value

                                            tmpData[i].VALUE = tmpObj
                                            tmpData[i].USERS = this.cmbUser.value
                                            this.access.add(tmpData[i])                                            
                                        }

                                        await this.access.save()
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
                                <Item render={this._cmbAcsRender}><Label text={"Parametre "} /></Item>
                                <Item render={this._cmbUserRender}><Label text={"Kullanıcı "} /></Item>
                            </GroupItem>
                            {this._grpRender()}
                        </Form>
                    </div>
                </div>
            </div>
        )
    }
}
