import React from 'react';
import i18n from 'i18next';
import App from '../../lib/app.js'
import posDoc from '../../pages/posDoc.js';
import NdGrid,{Column,Editing,Paging,Scrolling} from "../../../core/react/devex/grid.js";

const orgLoadPos = App.prototype.loadPos
const orgRender = posDoc.prototype.render
const orgSaleRowAdd = posDoc.prototype.saleRowAdd

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
posDoc.prototype.saleRowAdd = function saleRowAdd(pItemData) 
{
    pItemData.NAME = pItemData.NAME + " " + pItemData.LIST_TAG
    pItemData.SNAME = pItemData.NAME.substring(0,50)
    return orgSaleRowAdd.call(this,pItemData)
}