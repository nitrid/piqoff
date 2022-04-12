import React from 'react';
import App from '../../../lib/app.js';
import { docCls,docItemsCls, docCustomerCls } from '../../../../core/cls/doc.js';

import ScrollView from 'devextreme-react/scroll-view';
import Toolbar from 'devextreme-react/toolbar';
import Form, { Label,Item,EmptyItem } from 'devextreme-react/form';
import ContextMenu from 'devextreme-react/context-menu';
import TabPanel from 'devextreme-react/tab-panel';
import { Button } from 'devextreme-react/button';

import NdTextBox, { Validator, NumericRule, RequiredRule, CompareRule, EmailRule, PatternRule, StringLengthRule, RangeRule, AsyncRule } from '../../../../core/react/devex/textbox.js'
import NdNumberBox from '../../../../core/react/devex/numberbox.js';
import NdSelectBox from '../../../../core/react/devex/selectbox.js';
import NdCheckBox from '../../../../core/react/devex/checkbox.js';
import NdPopGrid from '../../../../core/react/devex/popgrid.js';
import NdPopUp from '../../../../core/react/devex/popup.js';
import NdGrid,{Column,Editing,Paging,Scrolling,Pager,KeyboardNavigation} from '../../../../core/react/devex/grid.js';
import NdButton from '../../../../core/react/devex/button.js';
import NdDatePicker from '../../../../core/react/devex/datepicker.js';
import NdImageUpload from '../../../../core/react/devex/imageupload.js';
import { dialog } from '../../../../core/react/devex/dialog.js';
import { datatable } from '../../../../core/core.js';
import tr from '../../../meta/lang/devexpress/tr.js';

export default class countFinalization extends React.Component
{
    constructor(props)
    {
        super()
        this.core = App.instance.core;
        this.prmObj = this.param.filter({TYPE:1,USERS:this.user.CODE});
        this.acsobj = this.access.filter({TYPE:1,USERS:this.user.CODE});
        this.docObj = new docCls();
       
        this._btnGetClick = this._btnGetClick.bind(this)
        this._btnSave = this._btnSave.bind(this)
        this.txtRef = Math.floor(Date.now() / 1000)
    }
    componentDidMount()
    {
        setTimeout(async () => 
        {
            this.Init()
        }, 1000);
    }
    async Init()
    {
        this.docObj.clearAll()

        this.txtRef = Math.floor(Date.now() / 1000);
        this.dtFirstDate.value =  moment(new Date()).format("YYYY-MM-DD");
        this.dtLastDate.value =  moment(new Date()).format("YYYY-MM-DD");
    }
    async _btnGetClick()
    {
        
        let tmpSource =
        {
            source : 
            {
                select : 
                {
                    query :"SELECT REF,REF_NO,CONVERT(NVARCHAR,DOC_DATE,104) AS DOC_DATE,SUM(QUANTITY) AS QUANTITY FROM ITEM_COUNT_VW_01 "+
                    " WHERE DEPOT = @DEPOT AND DOC_DATE >=@FIRSTDATE AND DOC_DATE <= @LASTDATE  GROUP BY REF,REF_NO,DOC_DATE",
                    param : ['DEPOT:string|50','FIRSTDATE:date','LASTDATE:date'],
                    value : [this.cmbDepot.value,this.dtFirstDate.value,this.dtLastDate.value]
                },
                sql : this.core.sql
            }
        }
        
        await this.grdCountDocument.dataRefresh(tmpSource)
    }
    async _btnSave()
    {
        let tmpDoc = {...this.docObj.empty}
        tmpDoc.TYPE = 1
        tmpDoc.DOC_TYPE = 0
        tmpDoc.REBATE = 0
        tmpDoc.REF = Math.floor(Date.now() / 1000)
        tmpDoc.REF_NO = 1
        tmpDoc.OUTPUT = this.cmbDepot.value
        tmpDoc.INPUT = this.cmbDepot.value
        tmpDoc.DOC_DATE =  moment(new Date()).format("YYYY-MM-DD"),
        this.docObj.addEmpty(tmpDoc);

        for (let i = 0; i < this.grdCountItems.data.datatable.length; i++) 
        {
            if(this.grdCountItems.data.datatable[i].QUANTITY > this.grdCountItems.data.datatable[i].DEPOT_QUANTITY)
            {
                let tmpDocItems = {...this.docObj.docItems.empty}
                    tmpDocItems.DOC_GUID = this.docObj.dt()[0].GUID
                    tmpDocItems.TYPE = 0
                    tmpDocItems.DOC_TYPE = 0
                    tmpDocItems.LINE_NO = this.docObj.docItems.dt().length
                    tmpDocItems.REF = this.docObj.dt()[0].REF
                    tmpDocItems.REF_NO = this.docObj.dt()[0].REF_NO
                    tmpDocItems.INPUT = this.docObj.dt()[0].INPUT
                    tmpDocItems.OUTPUT = this.docObj.dt()[0].OUTPUT
                    tmpDocItems.DOC_DATE = this.docObj.dt()[0].DOC_DATE
                    tmpDocItems.ITEM = this.grdCountItems.data.datatable[i].ITEM
                    tmpDocItems.ITEM_NAME = this.grdCountItems.data.datatable[i].ITEM_NAME
                    tmpDocItems.QUANTITY = (this.grdCountItems.data.datatable[i].QUANTITY - this.grdCountItems.data.datatable[i].DEPOT_QUANTITY)
                    await this.docObj.docItems.addEmpty(tmpDocItems)
            }
            else if(this.grdCountItems.data.datatable[i].QUANTITY < this.grdCountItems.data.datatable[i].DEPOT_QUANTITY)
            {
                let tmpDocItems = {...this.docObj.docItems.empty}
                tmpDocItems.DOC_GUID = this.docObj.dt()[0].GUID
                tmpDocItems.TYPE = 1
                tmpDocItems.DOC_TYPE = 0
                tmpDocItems.LINE_NO = this.docObj.docItems.dt().length
                tmpDocItems.REF = this.docObj.dt()[0].REF
                tmpDocItems.REF_NO = this.docObj.dt()[0].REF_NO
                tmpDocItems.INPUT = this.docObj.dt()[0].INPUT
                tmpDocItems.OUTPUT = this.docObj.dt()[0].OUTPUT
                tmpDocItems.DOC_DATE = this.docObj.dt()[0].DOC_DATE
                tmpDocItems.ITEM = this.grdCountItems.data.datatable[i].ITEM
                tmpDocItems.ITEM_NAME = this.grdCountItems.data.datatable[i].ITEM_NAME
                tmpDocItems.QUANTITY = (this.grdCountItems.data.datatable[i].DEPOT_QUANTITY - this.grdCountItems.data.datatable[i].QUANTITY)
                await this.docObj.docItems.addEmpty(tmpDocItems)
            }
        }
        if(this.docObj.docItems.dt().length > 0)
        {
            let tmpConfObj1 =
            {
                id:'msgSaveResult',showTitle:true,title:this.t("msgSave.title"),showCloseButton:true,width:'500px',height:'200px',
                button:[{id:"btn01",caption:this.t("msgSave.btn01"),location:'after'}],
            }
            
            if((await this.docObj.save()) == 0)
            {                                                    
                tmpConfObj1.content = (<div style={{textAlign:"center",fontSize:"20px"}}>{this.docObj.dt()[0].REF + this.t("msgSaveResult.msgSuccess")}</div>)
                await dialog(tmpConfObj1);
            }
            else
            {
                tmpConfObj1.content = (<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgSaveResult.msgFailed")}</div>)
                await dialog(tmpConfObj1);
            }
        }
        else
        {
            let tmpConfObj1 =
            {
                id:'msgNotItems',showTitle:true,title:this.t("msgNotItems.title"),showCloseButton:true,width:'500px',height:'200px',
                button:[{id:"btn01",caption:this.t("msgNotItems.btn01"),location:'after'}],
            }
            
            tmpConfObj1.content = (<div style={{textAlign:"center",fontSize:"20px"}}>{ this.t("msgNotItems.msg")}</div>)
            await dialog(tmpConfObj1);
        }
        this.popCount.hide()
        this.docObj.clearAll()

       
    }
    async _toGroupByCustomer(pData,pProperty)
    {
        return pData.reduce((acc, obj) => {
            const key = obj[pProperty];
            if (!acc[key]) {
               acc[key] = [];
            }
            
            acc[key].push(obj);
            return acc;
         }, {})
    }
    async calculateCountItems()
    {
        let tmpRefRefNo = ''
        for(let i = 0; i < this.grdCountDocument.getSelectedData().length; i++)
        {
            if(tmpRefRefNo == '')
            {
                tmpRefRefNo = "'"+ this.grdCountDocument.getSelectedData()[i].REF + this.grdCountDocument.getSelectedData()[i].REF_NO + "'"
            }
            else
            {
                tmpRefRefNo += ",'"+this.grdCountDocument.getSelectedData()[i].REF + this.grdCountDocument.getSelectedData()[i].REF_NO  + "'"
            }
        }
        if(this.chkNotCountItems.value == false)
        {
            let tmpSource =
            {
                source : 
                {
                    select : 
                    {
                        query :"SELECT ITEM,ITEM_CODE,ITEM_NAME,SUM(QUANTITY) AS QUANTITY,DEPOT, "+ 
                        " [dbo].[FN_DEPOT_QUANTITY](ITEM,DEPOT,GETDATE()) AS DEPOT_QUANTITY FROM ITEM_COUNT_VW_01 "+
                        " WHERE (REF+CONVERT(NVARCHAR,REF_NO)) IN("+tmpRefRefNo+")  GROUP BY ITEM,ITEM_CODE,ITEM_NAME,DEPOT",
                    },
                    sql : this.core.sql
                }
            }
            await this.grdCountItems.dataRefresh(tmpSource)
        }
        else if(this.chkNotCountItems.value == true)
        {
            let tmpSource =
            {
                source : 
                {
                    select : 
                    {
                        query :"SELECT " +
                        "GUID AS ITEM, " +
                        "[dbo].[FN_DEPOT_QUANTITY](GUID,@DEPOT,GETDATE()) AS DEPOT_QUANTITY, " +
                        "NAME AS ITEM_NAME, " +
                        "CODE AS ITEM_CODE, " +
                        "ISNULL((SELECT SUM(QUANTITY) FROM ITEM_COUNT WHERE ITEM_COUNT.ITEM = ITEMS.GUID AND (REF+CONVERT(NVARCHAR,REF_NO)) IN("+tmpRefRefNo+")),0) AS QUANTITY, " +
                        "@DEPOT AS DEPOT "+
                        "FROM  " +
                        "ITEMS ",
                        param : ['DEPOT:string|50'],
                        value : [this.cmbDepot.value]
                    },
                    sql : this.core.sql
                }
            }
            await this.grdCountItems.dataRefresh(tmpSource)
        }
        
        this.popCount.show()

    }
    render()
    {
        
        return(
            <div>
                <ScrollView>
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <Form colCount={3} id="frmCriter">
                               {/* cmbDepot */}
                               <Item colSpan={2}>
                                    <Label text={this.t("cmbDepot")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbDepot"
                                    displayExpr="NAME"                       
                                    valueExpr="GUID"
                                    value=""
                                    searchEnabled={true}
                                    notRefresh = {true}
                                    onValueChanged={(async()=>
                                        {
                                        }).bind(this)}
                                    data={{source:{select:{query : "SELECT * FROM DEPOT_VW_01"},sql:this.core.sql}}}
                                    param={this.param.filter({ELEMENT:'cmbDepot',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'cmbDepot',USERS:this.user.CODE})}
                                    >
                                        <Validator validationGroup={"frmValidCount"}>
                                            <RequiredRule message={this.t("validDepot")} />
                                        </Validator> 
                                    </NdSelectBox>
                                </Item>
                                <Item>
                                
                                </Item>
                                <Item>
                                <Label text={this.t("dtFirstDate")} alignment="right" />
                                    <NdDatePicker simple={true}  parent={this} id={"dtFirstDate"}
                                    onValueChanged={(async()=>
                                        {
                                    }).bind(this)}
                                    >
                                    </NdDatePicker>
                                </Item> 
                                <Item>
                                <Label text={this.t("dtLastDate")} alignment="right" />
                                    <NdDatePicker simple={true}  parent={this} id={"dtLastDate"}
                                    onValueChanged={(async()=>
                                    {
                                    }).bind(this)}
                                    >
                                    </NdDatePicker>
                                </Item> 
                                 <Item>
                                
                                </Item>
                                <Item>
                                    <NdCheckBox id="chkNotCountItems" parent={this} defaultValue={false}
                                    param={this.param.filter({ELEMENT:'chkNotCountItems',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'chkNotCountItems',USERS:this.user.CODE})}/>
                                     <Label text={this.t("chkNotCountItems")} alignment="left" />
                                </Item>
                            </Form>
                        </div>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-3">
                            <NdButton text={this.t("btnGet")} type="success" width="100%" onClick={this._btnGetClick} validationGroup="frmPurcOrder"></NdButton>
                        </div>
                        <div className="col-3">
                            
                        </div>
                        <div className="col-3">
                           
                        </div>
                        <div className="col-3">
                            <NdButton text={this.t("btnAddCount")} type="default" width="100%" onClick={()=>{this.calculateCountItems()}}></NdButton>
                        </div>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <NdGrid id="grdCountDocument" parent={this} 
                            selection={{mode:"multiple"}} 
                            height={'100%'} 
                            width={'100%'}
                            showBorders={true}
                            filterRow={{visible:true}} 
                            headerFilter={{visible:true}}
                            columnAutoWidth={true}
                            allowColumnReordering={true}
                            allowColumnResizing={true}
                            >                            
                                <Paging defaultPageSize={15} />
                                <Pager visible={true} allowedPageSizes={[5,10,50]} showPageSizeSelector={true} />

                                <Column dataField="REF" caption={this.t("grdCountDocument.clmRef")} visible={true} /> 
                                <Column dataField="REF_NO" caption={this.t("grdCountDocument.clmRefNo")} visible={true}/> 
                                <Column dataField="DOC_DATE" caption={this.t("grdCountDocument.clmDate")} visible={true}/> 
                                <Column dataField="QUANTITY" caption={this.t("grdCountDocument.clmQuantity")} visible={true}/>                                           
                            </NdGrid>
                        </div>
                    </div>
                     {/* CountItems PopUp */}
                     <div>
                        <NdPopUp parent={this} id={"popCount"} 
                        visible={false}
                        showCloseButton={true}
                        showTitle={true}
                        title={this.t("popCount.title")}
                        container={"#root"} 
                        width={'800'}
                        height={'800'}
                        position={{of:'#root'}}
                        >
                            <NdGrid parent={this} id={"grdCountItems"} 
                                showBorders={true} 
                                columnsAutoWidth={true} 
                                allowColumnReordering={true} 
                                allowColumnResizing={true} 
                                headerFilter={{visible:true}}
                                height={'80%'} 
                                width={'100%'}
                                dbApply={false}
                                >
                                    <Paging defaultPageSize={12} />
                                    <Pager visible={true} allowedPageSizes={[5,10,50]} showPageSizeSelector={true} />
                                    <KeyboardNavigation editOnKeyPress={true} enterKeyAction={'moveFocus'} enterKeyDirection={'row'} />
                                    <Editing mode="cell" allowUpdating={false} allowDeleting={false} />
                                    <Column dataField="ITEM_CODE" caption={this.t("grdCountItems.clmCode")} width={150} headerFilter={{visible:true}}/>
                                    <Column dataField="ITEM_NAME" caption={this.t("grdCountItems.clmName")} width={350}  headerFilter={{visible:true}}/>
                                    <Column dataField="QUANTITY" caption={this.t("grdCountItems.clmQuantity")} width={150}  headerFilter={{visible:true}}/>
                            </NdGrid>
                            <div className="row px-2 pt-2">
                            <Form colCount={3} height={'fit-content'}>
                                <Item location="after">
                                <Button  text={this.t("btnSuccess")} width={200} type="success"
                                    onClick={async (e)=>
                                    {
                                        this._btnSave()                                        
                                    }}/>
                                </Item>
                                <Item location="after">
                                </Item>
                                <Item location="after">
                                </Item>
                            </Form>
                            </div>
                        </NdPopUp>
                    </div> 
                </ScrollView>
            </div>
        )
    }
}