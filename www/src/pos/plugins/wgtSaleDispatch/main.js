import React from 'react';
import i18n from 'i18next';
import App from '../../lib/app.js'
import posDoc from '../../pages/posDoc.js';
import { NdLayout,NdLayoutItem } from '../../../core/react/devex/layout';
import NbButton from "../../../core/react/bootstrap/button.js";
import NdDialog,{ dialog } from "../../../core/react/devex/dialog.js";
import { docCls,docItemsCls } from '../../../core/cls/doc.js';

const orgLoadPos = App.prototype.loadPos
const orgComponentDidMount = posDoc.prototype.componentDidMount
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
posDoc.prototype.componentDidMount = async function()
{
    orgComponentDidMount.call(this)
}
posDoc.prototype.render = function() 
{
    const originalRenderOutput = orgRender.call(this);
    const modifiedChildren = addChildToElementWithId(originalRenderOutput.props.children,'frmBtnGrp',(render.bind(this))());
    return React.cloneElement(originalRenderOutput, {}, ...modifiedChildren);
};
function render()
{
    return (
        <NdLayoutItem key={"btnSaleDispatchLy"} id={"btnSaleDispatchLy"} parent={this} data-grid={{x:60,y:138,h:16,w:5,minH:16,maxH:32,minW:3,maxW:10}} 
        access={this.acsObj.filter({ELEMENT:'btnSaleDispatchLy',USERS:this.user.CODE})}>
            <div>
                <NbButton id={"btnSaleDispatch"} parent={this} className="form-group btn btn-info btn-block" style={{height:"100%",width:"100%"}}
                onClick={onClick.bind(this)}>
                    <i className="text-white fa-solid fa-file-import" style={{fontSize: "24px"}} />
                </NbButton>
            </div>
        </NdLayoutItem>
    )
}
async function onClick()
{
    if(this.posObj.dt("POS_SALE").length == 0)
    {
        let tmpConfObj =
        {
            id:'msgDispatchNotRow',showTitle:true,title:this.lang.t("msgDispatchNotRow.title"),showCloseButton:true,width:'400px',height:'200px',
            button:[{id:"btn01",caption:this.lang.t("msgDispatchNotRow.btn01"),location:'after'}],
            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgDispatchNotRow.msg")}</div>)
        }
        
        await dialog(tmpConfObj);

        return
    }
    
    if(this.posObj.dt("POS")[0].CUSTOMER_GUID == '00000000-0000-0000-0000-000000000000')
    {
        let tmpConfObj =
        {
            id:'msgDispatchNotCustomer',showTitle:true,title:this.lang.t("msgDispatchNotCustomer.title"),showCloseButton:true,width:'400px',height:'200px',
            button:[{id:"btn01",caption:this.lang.t("msgDispatchNotCustomer.btn01"),location:'after'}],
            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgDispatchNotCustomer.msg")}</div>)
        }
        
        await dialog(tmpConfObj);

        return
    }

    let tmpConfObj =
    {
        id:'msgDispatchConvert',showTitle:true,title:this.lang.t("msgDispatchConvert.title"),showCloseButton:true,width:'400px',height:'200px',
        button:[{id:"btn01",caption:this.lang.t("msgDispatchConvert.btn01"),location:'before'},{id:"btn02",caption:this.lang.t("msgDispatchConvert.btn02"),location:'after'}],
        content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgDispatchConvert.msg")}</div>)
    }
    
    let tmpMsgResult = await dialog(tmpConfObj);

    if(tmpMsgResult == 'btn02')
    {
        return
    }

    (dispatchSave.bind(this))()
}
async function dispatchSave()
{
    this.loading.current.instance.show()

    let docObj = new docCls();
    let tmpMaxNo = 0

    let tmpQuery = 
    {
        query :"SELECT ISNULL(MAX(REF_NO) + 1,1) AS REF_NO FROM DOC WHERE TYPE = 1 AND DOC_TYPE = 40 AND REF = @REF ",
        param : ['REF:string|25'],
        value : [this.posObj.dt()[0].CUSTOMER_CODE]
    }
    let tmpData = await this.core.sql.execute(tmpQuery) 
    if(tmpData.result.recordset.length > 0)
    {
        tmpMaxNo = tmpData.result.recordset[0].REF_NO
    }

    let tmpDoc = {...docObj.empty}
    tmpDoc.TYPE = 1
    tmpDoc.DOC_TYPE = 40
    tmpDoc.REBATE = 0
    tmpDoc.REF = this.posObj.dt()[0].CUSTOMER_CODE
    tmpDoc.REF_NO = tmpMaxNo
    tmpDoc.DOC_DATE = this.posObj.dt()[0].DOC_DATE
    tmpDoc.SHIPMENT_DATE = this.posObj.dt()[0].DOC_DATE
    tmpDoc.INPUT = this.posObj.dt()[0].CUSTOMER_GUID
    tmpDoc.OUTPUT = this.posObj.dt()[0].DEPOT_GUID
    tmpDoc.AMOUNT = this.posObj.dt()[0].AMOUNT
    tmpDoc.DISCOUNT = this.posObj.dt()[0].DISCOUNT
    tmpDoc.DOC_DISCOUNT = this.posObj.dt()[0].DISCOUNT
    tmpDoc.VAT = this.posObj.dt()[0].VAT
    tmpDoc.TOTAL = this.posObj.dt()[0].TOTAL
    tmpDoc.TOTALHT = this.posObj.dt()[0].FAMOUNT
    tmpDoc.TAX_NO = this.posObj.dt()[0].CUSTOMER_TAX_NO
    tmpDoc.ZIPCODE = this.posObj.dt()[0].CUSTOMER_ZIPCODE
    
    docObj.addEmpty(tmpDoc);
    for (let i = 0; i < this.posObj.dt('POS_SALE').length; i++) 
    {
        let tmpDocItems = {...docObj.docItems.empty}
        tmpDocItems.DOC_GUID = docObj.dt()[0].GUID
        tmpDocItems.TYPE = docObj.dt()[0].TYPE
        tmpDocItems.DOC_TYPE = docObj.dt()[0].DOC_TYPE
        tmpDocItems.REBATE = docObj.dt()[0].REBATE
        tmpDocItems.REF = docObj.dt()[0].REF
        tmpDocItems.REF_NO = docObj.dt()[0].REF_NO
        tmpDocItems.DOC_DATE = docObj.dt()[0].DOC_DATE
        tmpDocItems.SHIPMENT_DATE = docObj.dt()[0].SHIPMENT_DATE
        tmpDocItems.INPUT = docObj.dt()[0].INPUT
        tmpDocItems.OUTPUT = docObj.dt()[0].OUTPUT
        tmpDocItems.ITEM = this.posObj.dt('POS_SALE')[i].ITEM_GUID
        tmpDocItems.ITEM_NAME = this.posObj.dt('POS_SALE')[i].ITEM_NAME
        tmpDocItems.LINE_NO = this.posObj.dt('POS_SALE')[i].LINE_NO
        tmpDocItems.UNIT = this.posObj.dt('POS_SALE')[i].UNIT_GUID
        tmpDocItems.UNIT_FACTOR = this.posObj.dt('POS_SALE')[i].UNIT_FACTOR
        tmpDocItems.QUANTITY = this.posObj.dt('POS_SALE')[i].QUANTITY
        tmpDocItems.PRICE = this.posObj.dt('POS_SALE')[i].PRICE
        tmpDocItems.DISCOUNT = this.posObj.dt('POS_SALE')[i].DISCOUNT
        tmpDocItems.VAT = this.posObj.dt('POS_SALE')[i].VAT
        tmpDocItems.AMOUNT = this.posObj.dt('POS_SALE')[i].AMOUNT
        tmpDocItems.TOTALHT = this.posObj.dt('POS_SALE')[i].FAMOUNT
        tmpDocItems.TOTAL = this.posObj.dt('POS_SALE')[i].TOTAL
        tmpDocItems.VAT_RATE = this.posObj.dt('POS_SALE')[i].VAT_RATE
        tmpDocItems.ITEM_BARCODE = this.posObj.dt('POS_SALE')[i].BARCODE

        docObj.docItems.addEmpty(tmpDocItems);
    }
    
    let tmpSaveResult = await docObj.save()
    
    if(tmpSaveResult == 0)
    {
        let tmpConfObj =
        {
            id:'msgDispatchResult',showTitle:true,title:this.lang.t("msgDispatchResult.title"),showCloseButton:true,width:'400px',height:'200px',
            button:[{id:"btn01",caption:this.lang.t("msgDispatchResult.btn01"),location:'after'}],
            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgDispatchResult.msg")}</div>)
        }
        
        await dialog(tmpConfObj);

        await this.delete()
    }
    console.log(tmpSaveResult)
    this.loading.current.instance.hide()
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
function findChildWithId(children, id) 
{
    let foundElement = null;

    React.Children.forEach(children, child => 
    {
        if (foundElement) 
        {
            return;
        }
        if (!React.isValidElement(child)) 
        {
            return;
        }
        if (child.props.id === id) 
        {
            foundElement = child;
        } 
        else if (child.props.children) 
        {
            foundElement = findChildWithId(child.props.children, id);
        }
    });

    return foundElement;
}