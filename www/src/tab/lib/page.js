import React from 'react';
import LoadIndicator from 'devextreme-react/load-indicator';
import App from '../lib/app.js';
import {datatable,param,access} from '../../core/core.js';
import {prm} from '../meta/prm.js'
import {acs} from '../meta/acs.js'
import { dialog } from '../../core/react/devex/dialog.js';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

export default class Page extends React.Component
{
  constructor(props)
  {
    super(props)
    
    this.core = App.instance.core;
    //this.openPage(props.data)
  }
  openPage(pData)
  {
    this.data = pData
    // this.page = React.lazy(() => import("../pages/" + pData.path).then(async (obj)=>
    // {
    //   //SAYFA YÜKLENMEDEN ÖNCE PARAMETRE, DİL, YETKİLENDİRME DEĞERLERİ GETİRİLİP CLASS PROTOTYPE A SET EDİLİYOR.
    //   let tmpPrm = new param(prm);
    //   await tmpPrm.load({APP:'TAB'})
      
    //   let tmpAcs = new access(acs);
    //   await tmpAcs.load({APP:'TAB'})
      
    //   obj.default.prototype.param = tmpPrm.filter({PAGE:pData.id});
    //   obj.default.prototype.sysParam = tmpPrm.filter({TYPE:0});
    //   obj.default.prototype.access = tmpAcs.filter({PAGE:pData.id});
    //   obj.default.prototype.user = this.core.auth.data;
    //   obj.default.prototype.lang = App.instance.lang;
    //   obj.default.prototype.t = App.instance.lang.getFixedT(null,null,pData.id)
    //   obj.default.prototype.pagePrm = pData.pagePrm;

    //   obj.default.prototype.init = (function()
    //   {
    //     let tmpCached = obj.default.prototype.init;
    //     return function()
    //     {          
    //       tmpCached.apply(this,arguments)
    //       this.emit('onInit')
    //     }
    //   }());
    //   //EVENT PAGE - ALI KEMAL KARACA - 25.01.2022 *****/
    //   obj.default.prototype.listeners = Object();
    //   obj.default.prototype.on = function(pEvt, pCallback) 
    //   {
    //     if (!this.listeners.hasOwnProperty(pEvt))
    //     this.listeners[pEvt] = Array();
    //     this.listeners[pEvt].push(pCallback); 
    //   }
    //   obj.default.prototype.emit = function(pEvt, pParams)
    //   {
    //       if (pEvt in this.listeners) 
    //       {
    //           let callbacks = this.listeners[pEvt];
    //           for (var x in callbacks)
    //           {
    //               callbacks[x](pParams);
    //           }
    //       } 
    //   }
    //   return obj;
    // }))    
  }
  shouldComponentUpdate(nextProps) 
  {
    if(nextProps.data != this.data)
    {
      this.openPage(nextProps.data)
      return true
    }
    
    return false
  }
  render()
  {
    return(
      // <React.Fragment>
      //   <React.Suspense fallback={<div style={{position: 'relative',margin:'auto',top: '40%',left:'50%'}}><LoadIndicator height={40} width={40} /></div>}>          
      //     <this.page/>
      //   </React.Suspense>
      // </React.Fragment>
      <div>
        <Navbar bg="light" expand="lg">
        <Container>
        <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#link">Link</Nav.Link>
            <NavDropdown title="Dropdown" id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">
                Another action
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">
                Separated link
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
        </Navbar>
      </div>
    )
  }
}