import React from 'react';
import App from '../../../lib/app.js';
import { docCls } from '../../../../core/cls/doc.js';
import moment from 'moment';

import ScrollView from 'devextreme-react/scroll-view';
import Toolbar,{ Item } from 'devextreme-react/toolbar';
import { Button } from 'devextreme-react/button';

import { Validator, RequiredRule } from '../../../../core/react/devex/textbox.js'
import NdSelectBox from '../../../../core/react/devex/selectbox.js';
import NdCheckBox from '../../../../core/react/devex/checkbox.js';
import NdPopUp from '../../../../core/react/devex/popup.js';
import NdGrid,{Column,Editing,Paging,Pager,KeyboardNavigation,Export,Scrolling} from '../../../../core/react/devex/grid.js';
import NdButton from '../../../../core/react/devex/button.js';
import NdDatePicker from '../../../../core/react/devex/datepicker.js';
import { dialog } from '../../../../core/react/devex/dialog.js';
import { NdForm, NdItem, NdLabel, NdEmptyItem } from '../../../../core/react/devex/form.js';
import { NdToast } from '../../../../core/react/devex/toast.js';
export default class countFinalization extends React.PureComponent
{
    constructor(props)
    {
        super(props)

        this.core = App.instance.core;
        this.prmObj = this.param.filter({TYPE:1,USERS:this.user.CODE});
        this.acsobj = this.access.filter({TYPE:1,USERS:this.user.CODE});
        this.docObj = new docCls();
       
        this.btnGetClick = this.btnGetClick.bind(this)
        this.btnSave = this.btnSave.bind(this)
        this.txtRef = Math.floor(Date.now() / 1000)
        this.tabIndex = props.data.tabkey
    }
    async componentDidMount()
    {
        await this.core.util.waitUntil(0)
        this.init()
    }
    async init()
    {
        this.docObj.clearAll()

        this.txtRef = Math.floor(Date.now() / 1000);
        this.dtFirstDate.value =  moment(new Date()).format("YYYY-MM-DD");
        this.dtLastDate.value =  moment(new Date()).format("YYYY-MM-DD");
    }
    async btnGetClick()
    {
        let tmpSource =
        {
            source : 
            {
                select : 
                {
                    query : `SELECT REF,REF_NO,CONVERT(NVARCHAR,DOC_DATE,104) AS DOC_DATE,SUM(QUANTITY) AS QUANTITY FROM ITEM_COUNT_VW_01 
                            WHERE DEPOT = @DEPOT AND DOC_DATE >=@FIRSTDATE AND DOC_DATE <= @LASTDATE  GROUP BY REF,REF_NO,DOC_DATE`,
                    param : ['DEPOT:string|50','FIRSTDATE:date','LASTDATE:date'],
                    value : [this.cmbDepot.value,this.dtFirstDate.value,this.dtLastDate.value]
                },
                sql : this.core.sql
            }
        }
        await this.grdCountDocument.dataRefresh(tmpSource)
    }
    async btnSave()
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
            if((await this.docObj.save()) == 0)
            {                                                    
                this.toast.show({message:this.docObj.dt()[0].REF + this.t("msgSaveResult.msgSuccess"),type:"success"})
            }
            else
            {
                let tmpConfObj1 =
                {
                    id:'msgSaveResult',showTitle:true,title:this.t("msgSave.title"),showCloseButton:true,width:'500px',height:'auto',
                    button:[{id:"btn01",caption:this.t("msgSave.btn01"),location:'after'}],
                    content: (<div style={{textAlign:"center",fontSize:"20px",color:"red"}}>{this.t("msgSaveResult.msgFailed")}</div>)
                }
                await dialog(tmpConfObj1);
            }
        }
        else
        {
            this.toast.show({message:this.t("msgNotItems.msg"),type:"warning"})
        }
        this.popCount.hide()
        this.docObj.clearAll()
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
                        query : `SELECT ITEM,ITEM_CODE,ITEM_NAME,SUM(QUANTITY) AS QUANTITY,DEPOT, 
                                [dbo].[FN_DEPOT_QUANTITY](ITEM,DEPOT,dbo.GETDATE()) AS DEPOT_QUANTITY FROM ITEM_COUNT_VW_01 
                                WHERE (REF+CONVERT(NVARCHAR,REF_NO)) IN(${tmpRefRefNo})  GROUP BY ITEM,ITEM_CODE,ITEM_NAME,DEPOT`,
                    },
                    sql : this.core.sql
                }
            }
            App.instance.setState({isExecute:true})
            await this.grdCountItems.dataRefresh(tmpSource)
            App.instance.setState({isExecute:false})
        }
        else if(this.chkNotCountItems.value == true)
        {
            let tmpSource =
            {
                source : 
                {
                    select : 
                    {
                        query : `SELECT GUID AS ITEM, 
                                [dbo].[FN_DEPOT_QUANTITY](GUID,@DEPOT,dbo.GETDATE()) AS DEPOT_QUANTITY, 
                                NAME AS ITEM_NAME, 
                                CODE AS ITEM_CODE, 
                                ISNULL((SELECT SUM(QUANTITY) FROM ITEM_COUNT WHERE ITEM_COUNT.ITEM = ITEMS.GUID AND (REF+CONVERT(NVARCHAR,REF_NO)) IN(${tmpRefRefNo})),0) AS QUANTITY, 
                                @DEPOT AS DEPOT 
                                FROM  ITEMS `,
                        param : ['DEPOT:string|50'],
                        value : [this.cmbDepot.value]
                    },
                    sql : this.core.sql
                }
            }

            App.instance.setState({isExecute:true})
            await this.grdCountItems.dataRefresh(tmpSource)
            App.instance.setState({isExecute:false})
        }
        this.popCount.show()
    }
    render()
    {
        return(
            <div id={this.props.data.id + this.tabIndex}>
                <ScrollView>
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <Toolbar>
                                <Item location="after"
                                locateInMenu="auto"
                                widget="dxButton"
                                options=
                                {
                                    {
                                        type: 'default',
                                        icon: 'clear',
                                        onClick: async () => 
                                        {
                                            let tmpConfObj =
                                            {
                                                id:'msgClose',showTitle:true,title:this.lang.t("msgWarning"),showCloseButton:true,width:'500px',height:'auto',
                                                button:[{id:"btn01",caption:this.lang.t("btnYes"),location:'before'},{id:"btn02",caption:this.lang.t("btnNo"),location:'after'}],
                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgClose")}</div>)
                                            }
                                            
                                            let pResult = await dialog(tmpConfObj);

                                            if(pResult == 'btn01')
                                            {
                                                App.instance.panel.closePage()
                                            }
                                        }
                                    }    
                                } />
                            </Toolbar>
                        </div>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <NdForm colCount={3} id="frmCriter">
                               {/* cmbDepot */}
                               <NdItem colSpan={2}>
                                    <NdLabel text={this.t("cmbDepot")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbDepot"
                                    displayExpr="NAME"                       
                                    valueExpr="GUID"
                                    value=""
                                    searchEnabled={true}
                                    notRefresh = {true}
                                    data={{source:{select:{query : "SELECT * FROM DEPOT_VW_01"},sql:this.core.sql}}}
                                    param={this.param.filter({ELEMENT:'cmbDepot',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'cmbDepot',USERS:this.user.CODE})}
                                    >
                                        <Validator validationGroup={"frmValidCount"  + this.tabIndex}>
                                            <RequiredRule message={this.t("validDepot")} />
                                        </Validator> 
                                    </NdSelectBox>
                                </NdItem>
                                <NdEmptyItem/>
                                <NdItem>
                                    <NdLabel text={this.t("dtFirstDate")} alignment="right" />
                                    <NdDatePicker simple={true}  parent={this} id={"dtFirstDate"}/>
                                </NdItem> 
                                <NdItem>
                                    <NdLabel text={this.t("dtLastDate")} alignment="right" />
                                    <NdDatePicker simple={true}  parent={this} id={"dtLastDate"}/>
                                </NdItem> 
                                <NdItem location="right">
                                    <NdLabel text={this.t("chkNotCountItems")} alignment="right" />
                                    <NdCheckBox id="chkNotCountItems" parent={this} defaultValue={false}
                                    param={this.param.filter({ELEMENT:'chkNotCountItems',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'chkNotCountItems',USERS:this.user.CODE})}/>
                                </NdItem>
                            </NdForm>
                        </div>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-3">
                            <NdButton text={this.t("btnGet")} type="success" width="100%" onClick={this.btnGetClick} validationGroup={"frmValidCount"  + this.tabIndex}></NdButton>
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
                            height={'700'} 
                            width={'100%'}
                            showBorders={true}
                            filterRow={{visible:true}} 
                            columnAutoWidth={true}
                            allowColumnReordering={true}
                            allowColumnResizing={true}
                            onRowDblClick={async(e)=>
                            {
                                App.instance.menuClick(
                                {
                                    id: 'stk_02_001',
                                    text: 'Sayım',
                                    path: 'items/documents/itemCount.js',
                                    pagePrm:{REF:e.data.REF,REF_NO:e.data.REF_NO}
                                })
                            }}
                            >                            
                                {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Paging defaultPageSize={20} /> : <Paging enabled={false} />}
                                {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Pager visible={true} allowedPageSizes={[5,10,50]} showPageSizeSelector={true} /> : <Paging enabled={false} />}
                                {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Scrolling mode="standart" /> : <Scrolling mode="virtual" />}
                                <Export fileName={this.lang.t("menuOff.stk_04_003")} enabled={true} allowExportSelectedData={true} />
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
                        container={'#' + this.props.data.id + this.tabIndex} 
                        width={'800'}
                        height={'auto'}
                        position={{of:'#' + this.props.data.id + this.tabIndex}}
                        >
                            <NdGrid parent={this} id={"grdCountItems"} 
                            showBorders={true} 
                            columnsAutoWidth={true} 
                            allowColumnReordering={true} 
                            allowColumnResizing={true} 
                            height={'80%'} 
                            width={'100%'}
                            dbApply={false}
                            >
                                <Paging defaultPageSize={12} />
                                <Pager visible={true} allowedPageSizes={[5,10,50]} showPageSizeSelector={true} />
                                <KeyboardNavigation editOnKeyPress={true} enterKeyAction={'moveFocus'} enterKeyDirection={'column'} />
                                <Editing mode="cell" allowUpdating={false} allowDeleting={false} />
                                <Export fileName={this.lang.t("menuOff.stk_02_005")} enabled={true} allowExportSelectedData={true} />
                                <Column dataField="ITEM_CODE" caption={this.t("grdCountItems.clmCode")} width={150} headerFilter={{visible:true}}/>
                                <Column dataField="ITEM_NAME" caption={this.t("grdCountItems.clmName")} width={350}  headerFilter={{visible:true}}/>
                                <Column dataField="QUANTITY" caption={this.t("grdCountItems.clmQuantity")} width={150}  headerFilter={{visible:true}}/>
                            </NdGrid>
                            <div className="row px-2 pt-2">
                                <NdForm colCount={3} height={'fit-content'}>
                                    <NdItem location="after">
                                        <Button text={this.t("btnSuccess")} width={200} type="success" onClick={async (e)=>{this.btnSave()}}/>
                                    </NdItem>
                                </NdForm>
                            </div>
                        </NdPopUp>
                    </div> 
                    <NdToast id={"toast"} parent={this} displayTime={2000} position={{at:"top center",offset:'0px 110px'}}/>
                </ScrollView>
            </div>
        )
    }
}