import React from 'react';
import LoadIndicator from 'devextreme-react/load-indicator';
import App from '../lib/app.js';
import {datatable} from '../../core/core.js';

export default class Page extends React.Component
{
  constructor(props)
  {
    super(props)
    
    this.core = App.instance.core;
    this.page = React.lazy(() => import(props.data.path).then(async (obj)=>
    {
      //SAYFA YÜKLENMEDEN ÖNCE PARAMETRE, DİL, YETKİLENDİRME DEĞERLERİ GETİRİLİP CLASS PROTOTYPE A SET EDİLİYOR.
      let tmpDt = new datatable('PARAM')
          
      tmpDt.selectCmd = 
      {
        query : "SELECT * FROM PARAM WHERE PAGE_ID = @PAGE_ID AND USERS = @USERS AND APP = @APP",
        param : ['PAGE_ID:string|25','USERS:string|25','APP:string|50'],
        value : [props.data.id,App.instance.core.auth.data.CODE,'ADMIN']
      }
      await tmpDt.refresh()
      obj.default.prototype.param = tmpDt
      obj.default.prototype.user = this.core.auth.data
      return obj;
    }))
  }
  render()
  {
    return(
      <React.Fragment>
        <React.Suspense fallback={<div style={{position: 'relative',margin:'auto',top: '40%',left:'50%'}}><LoadIndicator height={40} width={40} /></div>}>
          <div>
            <this.page data={this.props} />
          </div>
        </React.Suspense>
      </React.Fragment>
    )
  }
}