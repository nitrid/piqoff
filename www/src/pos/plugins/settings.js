import moment from 'moment';
import React from 'react';
import i18n from 'i18next';
import App from '../lib/app.js'
import { LoadPanel } from 'devextreme-react/load-panel';
import { NdLayout,NdLayoutItem } from '../../core/react/devex/layout.js';
import NbButton from "../../core/react/bootstrap/button.js";

import posDoc from '../pages/posDoc.js';
import NdAcsDialog,{acsDialog} from "../../core/react/devex/acsdialog.js";
import PosSetting from './settings/pages/posSetting.js'
import PosItemsList from './settings/pages/posItemsList.js'
import PosSaleReport from './settings/pages/posSaleReport.js'
import PosCustomerPointReport from './settings/pages/posCustomerPointReport.js'
import PosTicketEndDescription from './settings/pages/posTicketEndDescription.js'
import PosGrpSalesReport from './settings/pages/posGrpSalesReport.js'
import PosCompanyInfo from './settings/pages/posCompanyInfo.js'

import {prm} from './settings/meta/prm.js'
import {acs} from './settings/meta/acs.js'

const orgLoadPos = App.prototype.loadPos
const orgRender = posDoc.prototype.render
const orgAppRender = App.prototype.render

function addChildToElementWithId(children, id, newChild) 
{
    return React.Children.map(children, child => 
    {
        if (!React.isValidElement(child)) 
        {
            return child;
        }
        if (child.props.id === id) 
        {
            const newChildren = React.Children.toArray(child.props.children);
            newChildren.push(newChild);
            return React.cloneElement(child, {}, ...newChildren);
        } 
        else if (child.props.children) 
        {
            return React.cloneElement(child, {}, addChildToElementWithId(child.props.children, id, newChild));
        }
        return child;
    });
}
function renderBtnSettings()
{
    return (
        <NdLayoutItem key={"btnSystemLy"} id={"btnSystemLy"} parent={this} data-grid={{x:30,y:154,h:16,w:5,minH:16,maxH:32,minW:3,maxW:10}} 
        access={this.acsObj.filter({ELEMENT:'btnSystemLy',USERS:this.user.CODE})}>
            <div>
                <NbButton id={"btnSystem"} parent={this} className="form-group btn btn-info btn-block" style={{height:"100%",width:"100%"}}
                onClick={async()=>
                {
                    //burayı Yusuf Kaan 14.02.2025 tarihinde yaptı.
                    let tmpAcsVal = this.acsObj.filter({ID:'btnSystem',USERS:this.user.CODE})
        
                    if(typeof tmpAcsVal.getValue().dialog != 'undefined' && tmpAcsVal.getValue().dialog.type != -1)
                    {   
                        let tmpResult = await acsDialog({id:"AcsDialog",parent:this,type:tmpAcsVal.getValue().dialog.type})
                        if(!tmpResult)
                        {
                            return
                        }
                    }
                    //***************************************** */
                    App.instance.setPage('menu')
                }}>
                    <i className="text-white fa-solid fa-cog" style={{fontSize: "24px"}} />
                </NbButton>
            </div>
        </NdLayoutItem>
    )
}
App.prototype.loadPos = async function()
{
    orgLoadPos.call(this)
    let tmpLang = localStorage.getItem('lang') == null ? 'tr' : localStorage.getItem('lang')
    const resources = await import(`./settings/meta/lang/${tmpLang}.js`)
    
    for (let i = 0; i < Object.keys(resources.default).length; i++) 
    {
        i18n.addResource(tmpLang, 'translation', Object.keys(resources.default)[i], resources.default[Object.keys(resources.default)[i]])
    }
    
    this.acsObj.meta = this.acsObj.meta.concat(acs)
    this.prmObj.meta = this.prmObj.meta.concat(prm)

    await this.prmObj.load({APP:'POS',USERS:this.core.auth.data.CODE})
    await this.acsObj.load({APP:'POS',USERS:this.core.auth.data.CODE})
}
posDoc.prototype.render = function() 
{
    let originalRenderOutput = orgRender.call(this);
    let modifiedChildren = addChildToElementWithId(originalRenderOutput.props.children,'frmBtnGrp',(renderBtnSettings.bind(this))());
    
    return React.cloneElement(originalRenderOutput, {}, ...modifiedChildren);
}
App.prototype.render = function()
{
    const { page } = this.state;
    if(page == 'menu')
    {
        return <PosSetting/>
    }
    else if(page == 'itemsList')
    {
        return <PosItemsList/>
    }
    else if(page == 'posSaleReport')
    {
        return <PosSaleReport/>
    }
    else if(page == 'posCustomerPointReport')
    {
        return (
            <div>
                <LoadPanel
                shadingColor="rgba(0,0,0,0.4)"
                position={{ of: '#root' }}
                visible={this.state.isExecute}
                showIndicator={true}
                shading={true}
                showPane={true}
                />
                <PosCustomerPointReport/>
            </div>
        )
    }
    else if(page == 'posTicketEndDescription')
    {
        return <PosTicketEndDescription/>
    }
    else if(page == 'posGrpSalesReport')
    {
        return (
            <div>
                <LoadPanel
                shadingColor="rgba(0,0,0,0.4)"
                position={{ of: '#root' }}
                visible={this.state.isExecute}
                showIndicator={true}
                shading={true}
                showPane={true}
                />
                <PosGrpSalesReport/>
            </div>
        )
    }
    else if(page == 'posCompanyInfo')
    {
        return <PosCompanyInfo/>
    }

    return orgAppRender.call(this)
}
