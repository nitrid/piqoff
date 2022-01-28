import React from 'react';
import LoadIndicator from 'devextreme-react/load-indicator';
import App from '../lib/app.js';
import {datatable,param,access} from '../../core/core.js';
import {prm} from '../meta/prm.js'
import {acs} from '../meta/acs.js'

export default class Page extends React.Component
{
  constructor(props)
  {
    super(props)
    
    this.core = App.instance.core;

    this.page = React.lazy(() => import(props.data.path).then(async (obj)=>
    {
      //SAYFA YÜKLENMEDEN ÖNCE PARAMETRE, DİL, YETKİLENDİRME DEĞERLERİ GETİRİLİP CLASS PROTOTYPE A SET EDİLİYOR.
      let tmpPrm = new param(prm);
      await tmpPrm.load({PAGE:props.data.id,APP:'OFF'})

      let tmpAcs = new access(acs);
      await tmpAcs.load({PAGE:props.data.id,APP:'OFF'})
      
      obj.default.prototype.param = tmpPrm;
      obj.default.prototype.access = tmpAcs;
      obj.default.prototype.user = this.core.auth.data;
      obj.default.prototype.lang = App.instance.lang;
      obj.default.prototype.init = (function()
      {
        let tmpCached = obj.default.prototype.init;
        return function()
        {          
          tmpCached.apply(this,arguments)
          this.emit('onInit')
        }
      }());
      //EVENT PAGE - ALI KEMAL KARACA - 25.01.2022 *****/
      obj.default.prototype.listeners = Object();
      obj.default.prototype.on = function(pEvt, pCallback) 
      {
        if (!this.listeners.hasOwnProperty(pEvt))
        this.listeners[pEvt] = Array();
        this.listeners[pEvt].push(pCallback); 
      }
      obj.default.prototype.emit = function(pEvt, pParams)
      {
          if (pEvt in this.listeners) 
          {
              let callbacks = this.listeners[pEvt];
              for (var x in callbacks)
              {
                  callbacks[x](pParams);
              }
          } 
      }
      //***********************************************/      
      return obj;
    }))
  }
  render()
  {
    return(
      <React.Fragment>
        <React.Suspense fallback={<div style={{position: 'relative',margin:'auto',top: '40%',left:'50%'}}><LoadIndicator height={40} width={40} /></div>}>
          <this.page data={this.props.data}/>
        </React.Suspense>
      </React.Fragment>
    )
  }
}