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

import {prm} from './meta/prm.js'

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

    this.prmObj.meta = this.prmObj.meta.concat(prm)
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
        <NdLayoutItem key={"btnPersonTrackLy"} id={"btnPersonTrackLy"} parent={this} data-grid={{x:5,y:154,h:16,w:5,minH:16,maxH:32,minW:3,maxW:10}} 
        access={this.acsObj.filter({ELEMENT:'btnPersonTrackLy',USERS:this.user.CODE})}>
            <div>
                <NbButton id={"btnPersonTrack"} parent={this} className="form-group btn btn-info btn-block" style={{height:"100%",width:"100%"}}
                onClick={onClick.bind(this)}>
                    <i className="text-white fa-solid fa-person-circle-question" style={{fontSize: "24px"}} />
                </NbButton>
            </div>
            {/* Discount Description Popup */} 
            <div>
                <NbPopDescboard id={"popPersonTrackDesc"} parent={this} width={"900"} height={"700"} position={"#root"} head={this.lang.t("popPersonTrackDesc.head")} title={this.lang.t("popDiscountDesc.title")}     
                param={this.prmObj.filter({ID:'popPersonTrackDesc',TYPE:0})}
                onClick={async(pData)=>
                {
                    let personTrackDt = new datatable()
                    personTrackDt.insertCmd = 
                    {
                        query : "INSERT INTO [dbo].[SPC_PERSON_TRACK] ([CDATE],[CUSER],[DESCRIPTION]) VALUES (@CDATE,@CUSER,@DESCRIPTION)",
                        param : ['CDATE:datetime','CUSER:string|25','DESCRIPTION:string|250'],
                        dataprm : ['CDATE','CUSER','DESCRIPTION'],
                    }
                    personTrackDt.push({CDATE:moment(new Date().toISOString()).utcOffset(0,true),CUSER:this.core.auth.data.CODE,DESCRIPTION:pData})
                    personTrackDt.update()

                    import("./meta/personPrint").then(async(e)=>
                    {
                        let tmpData =
                        {
                            firm : this.firm,
                            special : 
                            {
                                user : this.user.CODE,
                                device : window.localStorage.getItem('device'),
                                description : pData
                            }
                        }

                        let tmpPrint = e.print(tmpData)

                        //YAZDIRMA İŞLEMİNDEN ÖNCE KULLANICIYA SORULUYOR
                        let tmpConfObj =
                        {
                            id:'msgMailPrintAlert',showTitle:true,title:this.lang.t("msgMailPrintAlert.title"),showCloseButton:true,width:'500px',height:'250px',
                            button:[{id:"btn01",caption:this.lang.t("msgMailPrintAlert.btn01"),location:'before'},{id:"btn02",caption:this.lang.t("msgMailPrintAlert.btn02"),location:'after'}],
                            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgMailPrintAlert.msg")}</div>)
                        }
                        let pResult = await dialog(tmpConfObj);
                        if(pResult == 'btn01')
                        {
                            let tmpMail = 'alikemal@piqsoft.fr'
                            await this.posDevice.pdfPrint(tmpPrint,tmpMail)
                            return
                        }

                        await this.posDevice.escPrinter(tmpPrint)
                    })
                }}></NbPopDescboard>
            </div>
        </NdLayoutItem>
    )
}
async function onClick()
{
    this.popPersonTrackDesc.show()
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