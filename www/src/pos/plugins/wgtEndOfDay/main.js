import moment from 'moment';
import React from 'react';
import i18n from 'i18next';
import App from '../../lib/app.js'
import posDoc from '../../pages/posDoc.js';
import { NdLayout,NdLayoutItem } from '../../../core/react/devex/layout';
import NbButton from "../../../core/react/bootstrap/button.js";
import NdDialog,{ dialog } from "../../../core/react/devex/dialog.js";
import NbPopDescboard from "../../tools/popdescboard.js";
import { dataset,datatable } from "../../../core/core.js";

const orgLoadPos = App.prototype.loadPos
const orgInit = posDoc.prototype.init
const orgRender = posDoc.prototype.render

App.prototype.loadPos = async function()
{
    let tmpLang = localStorage.getItem('lang') == null ? 'tr' : localStorage.getItem('lang')
    const resources = await import(`./meta/lang/${tmpLang}.js`)
    
    for (let i = 0; i < Object.keys(resources.default).length; i++) 
    {
        i18n.addResource(tmpLang, 'translation', Object.keys(resources.default)[i], resources.default[Object.keys(resources.default)[i]])
    }

    return orgLoadPos.call(this)
}
posDoc.prototype.init = function() 
{
    orgInit.call(this)
}
posDoc.prototype.render = function() 
{
    const originalRenderOutput = orgRender.call(this);
    const modifiedChildren = addChildToElementWithId(originalRenderOutput.props.children,'frmBtnGrp',(render.bind(this))());
    return React.cloneElement(originalRenderOutput, {}, ...modifiedChildren);
}
function render()
{
    return (
        <NdLayoutItem key={"btnEndOfDayLy"} id={"btnEndOfDayLy"} parent={this} data-grid={{x:40,y:122,h:16,w:5,minH:16,maxH:32,minW:3,maxW:10}} 
        access={this.acsObj.filter({ELEMENT:'btnEndOfDayLy',USERS:this.user.CODE})}>
            <div>
                <NbButton id={"btnEndOfDay"} parent={this} className="form-group btn btn-info btn-block" style={{height:"100%",width:"100%"}}
                onClick={onClick.bind(this)}>
                    <i className="text-white fa-solid fa-cash-register" style={{fontSize: "24px"}} />
                </NbButton>
            </div>
        </NdLayoutItem>
    )
}
async function onClick()
{
    
}
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