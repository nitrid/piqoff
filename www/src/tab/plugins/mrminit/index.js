import React from 'react';
import i18n from 'i18next';
import App from '../../lib/app.js'
import NbButton from '../../../core/react/bootstrap/button';
import {core,param,access} from '../../../core/core.js'
import {prm} from '../../meta/prm.js'
import {acs} from '../../meta/acs.js'

const orgInit = App.prototype.init
const orgLoadPage = App.prototype.loadPage
const orgMenu = App.prototype.menu

App.prototype.init = async function()
{
    this.state.page = 'dashboard.js'
    orgInit.call(this)

    let tmpLang = localStorage.getItem('lang') == null ? 'tr' : localStorage.getItem('lang')
    const resources = await import(`./meta/lang/${tmpLang}.js`)
    
    for (let i = 0; i < Object.keys(resources.default).length; i++) 
    {
        i18n.addResource(tmpLang, 'translation', Object.keys(resources.default)[i], resources.default[Object.keys(resources.default)[i]])
    }
}
App.prototype.loadPage = function()
{
    return React.lazy(() => import('./pages/' + this.state.page).then(async (obj)=>
    {
        //SAYFA YÜKLENMEDEN ÖNCE PARAMETRE, DİL, YETKİLENDİRME DEĞERLERİ GETİRİLİP CLASS PROTOTYPE A SET EDİLİYOR.
        let tmpPrm = new param(prm);
        await tmpPrm.load({APP:'TAB'})

        let tmpAcs = new access(acs);
        await tmpAcs.load({APP:'TAB'})

        obj.default.prototype.param = tmpPrm.filter({PAGE:this.state.page});
        obj.default.prototype.sysParam = tmpPrm.filter({TYPE:0});
        obj.default.prototype.access = tmpAcs.filter({PAGE:this.state.page});
        obj.default.prototype.user = this.core.auth.data;

        return obj;
    }));
}
App.prototype.menu = function()
{
    let tmpMenu = []

    tmpMenu.push(
        <div className='col-4' style={{paddingTop:"30px"}} key={"saleCard"}>
            <NbButton className="form-group btn btn-block" style={{ height: "100%", width: "100%", backgroundColor: '#0d6efd' }} 
            onClick={() => 
            {
                this.popMenu.hide()
                this.setState({page:'repairTicket.js'})
            }}>
                <div className='row py-2'>
                    <div className='col-12'>
                        <i className={`fa-solid fa-ticket fa-4x`} style={{ color: '#ecf0f1' }}></i>
                    </div>
                </div>
                <div className='row'>
                    <div className='col-12'>
                        <h3 style={{ color: '#ecf0f1' }}>{this.lang.t('menu.repairTicket')}</h3>
                    </div>
                </div>
            </NbButton>
        </div>
    )

    return tmpMenu
}