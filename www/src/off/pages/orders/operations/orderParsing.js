import React from 'react';
import App from '../../../lib/app.js';
import { docCls,docItemsCls, docCustomerCls } from '../../../../core/cls/doc.js';
import moment from 'moment';

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

export default class rebateOperation extends React.PureComponent
{
    constructor(props)
    {
        super(props)
        this.core = App.instance.core;
        this.prmObj = this.param.filter({TYPE:1,USERS:this.user.CODE});
        this.acsobj = this.access.filter({TYPE:1,USERS:this.user.CODE});
        this.docObj = new docCls();
       
        this._btnGetClick = this._btnGetClick.bind(this)
        this._btnSave = this._btnSave.bind(this)
        this._toGroupByCustomer = this._toGroupByCustomer.bind(this)
        this.txtRef = Math.floor(Date.now() / 1000)
        this.tabIndex = props.data.tabkey
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

        this.txtRef = Math.floor(Date.now() / 1000)
        this.txtCustomerCode.CODE = ''
    }
    async _btnGetClick()
    {
        let tmpSource =
        {
            source : 
            {
                select : 
                { 
                    query : "SELECT ORDERS.GUID,ORDERS.  " +
                    "ITEM_CODE,  " +
                    "ORDERS.ITEM_NAME,  " +
                    "QUANTITY, " +
                    "CUSTOMER_PRICE AS CUSTOMER_PRICE, " +
                    "CUSTOMER_NAME AS CUSTOMER_NAME, " +
                    "CUSTOMER_GUID AS CUSTOMER_GUID, " +
					"CUSTOMER_PRICE * QUANTITY AS AMOUNT,   " +
					"(CUSTOMER_PRICE * (ORDERS.VAT_RATE/100)) * QUANTITY AS VAT,   " +
					"(CUSTOMER_PRICE * QUANTITY) + ((CUSTOMER_PRICE * (ORDERS.VAT_RATE/100)) * QUANTITY) AS TOTAL   " +
                    "FROM   " +
                    "DOC_ORDERS_VW_01 AS ORDERS  " +
                    "INNER JOIN   " +
                    "ITEM_MULTICODE_VW_01 AS MULTICODE   " +
                    "ON ORDERS.ITEM = MULTICODE.ITEM_GUID  " +
                    "WHERE ORDERS.INPUT = @DEPOT AND OUTPUT = '00000000-0000-0000-0000-000000000000' AND ((MULTICODE.CUSTOMER_CODE = @CUSTOMER_CODE) OR (@CUSTOMER_CODE = '')) " ,
                    param : ['DEPOT:string|50','CUSTOMER_CODE:string|50'],
                    value : [this.cmbDepot.value,this.txtCustomerCode.CODE]
                },
                sql : this.core.sql
            }
        }
        App.instance.setState({isExecute:true})
        await this.grdOrderList.dataRefresh(tmpSource)
        App.instance.setState({isExecute:false})
    }
    async _btnSave(pType)
    {
        for(let i = 0; i < this.grdOrderList.getSelectedData().length; i++)
        {
           if(this.grdOrderList.getSelectedData()[i].CUSTOMER_NAME == '')
           {
                let tmpConfObj =
                {
                    id:'msgCustomerFound',showTitle:true,title:this.t("msgCustomerFound.title"),showCloseButton:true,width:'500px',height:'200px',
                    button:[{id:"btn01",caption:this.t("msgCustomerFound.btn01"),location:'after'}],
                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{ this.t("msgCustomerFound.msg")}</div>)
                }
            
                await dialog(tmpConfObj);
                return
           }
        }
        let tmpItem = await this._toGroupByCustomer(this.grdOrderList.getSelectedData(),'ITEM_CODE')
        for(let i = 0; i < Object.values(tmpItem).length; i++)
        {
           if(Object.values(tmpItem)[i].length > 1)
           {
                let tmpConfObj =
                {
                    id:'msgDublicateItem',showTitle:true,title:this.t("msgDublicateItem.title"),showCloseButton:true,width:'500px',height:'200px',
                    button:[{id:"btn01",caption:this.t("msgDublicateItem.btn01"),location:'after'}],
                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{Object.values(tmpItem)[i][0].ITEM_NAME + ' ' + this.t("msgDublicateItem.msg")}</div>)
                }
            
                await dialog(tmpConfObj);
                return
           }
        }

        let tmpConfObj =
        {
            id:'msgSave',showTitle:true,title:this.t("msgSave.title"),showCloseButton:true,width:'500px',height:'200px',
            button:[{id:"btn01",caption:this.t("msgSave.btn01"),location:'before'},{id:"btn02",caption:this.t("msgSave.btn02"),location:'after'}],
            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgSave.msg")}</div>)
        }
        
        let pResult = await dialog(tmpConfObj);
        if(pResult == 'btn02')
        {
            return
        }
        
        let tmpCustomer = await this._toGroupByCustomer(this.grdOrderList.getSelectedData(),'CUSTOMER_GUID')

        for (let i = 0; i < Object.keys(tmpCustomer).length; i++)
        {
            let tmpQuery = 
            {
                query:  "SELECT CODE,ISNULL((SELECT (MAX(REF_NO) + 1) FROM DOC_VW_01 WHERE DOC_TYPE = 60 AND REBATE = 0 AND TYPE = 0 AND DOC_VW_01.INPUT = CUSTOMERS.GUID),1) AS REF_NO FROM CUSTOMERS WHERE GUID = @GUID ",
                param:  ['GUID:string|50'],
                value:  [Object.keys(tmpCustomer)[i]]
            }

            let tmpData = await this.core.sql.execute(tmpQuery) 
           
            let tmpRef = tmpData.result.recordset[0].CODE
            let tmpRefNo = tmpData.result.recordset[0].REF_NO

            if(Object.keys(tmpCustomer)[i] != '00000000-0000-0000-0000-000000000000')
            {
                
                let tmpDoc = {...this.docObj.empty}
                tmpDoc.TYPE = 0
                tmpDoc.DOC_TYPE = 60
                tmpDoc.REBATE = 0
                tmpDoc.REF = tmpRef
                tmpDoc.REF_NO = tmpRefNo
                tmpDoc.OUTPUT =Object.keys(tmpCustomer)[i]
                tmpDoc.INPUT = this.cmbDepot.value
                this.docObj.addEmpty(tmpDoc);
                for(let x = 0; x < this.grdOrderList.getSelectedData().length; x++)
                {
                   if(Object.keys(tmpCustomer)[i] == this.grdOrderList.getSelectedData()[x].CUSTOMER_GUID)
                   {    
                        let tmpQuery = 
                        {
                            query: "EXEC [dbo].[PRD_DOC_ORDERS_UPDATE] " +
                            "@GUID = @PGUID , " +
                            "@CUSER = @PCUSER, " +
                            "@DOC_GUID = @PDOC_GUID, " + 
                            "@DOC_TYPE = @PDOC_TYPE, " +
                            "@REF = @PREF, " +
                            "@REF_NO = @PREF_NO, " +
                            "@OUTPUT = @POUTPUT, " +
                            "@PRICE = @PPRICE, " +
                            "@LINE_NO  = @PLINE_NO, " +
                            "@VAT = @PVAT, " +
                            "@AMOUNT = @PAMOUNT, " +
                            "@TOTAL = @PTOTAL " ,
                            param:  ['PGUID:string|50','PCUSER:string|50','PDOC_GUID:string|50','PDOC_TYPE:int','PREF:string|25','PREF_NO:int','POUTPUT:string|50','PPRICE:float','PLINE_NO:int','PVAT:float','PAMOUNT:float','PTOTAL:float'],
                            value:  [this.grdOrderList.getSelectedData()[x].GUID,this.user.CODE,this.docObj.dt()[this.docObj.dt().length - 1].GUID,60,this.docObj.dt()[this.docObj.dt().length - 1].REF,this.docObj.dt()[this.docObj.dt().length - 1].REF_NO,
                            this.docObj.dt()[this.docObj.dt().length - 1].OUTPUT,this.grdOrderList.getSelectedData()[x].CUSTOMER_PRICE,i,this.grdOrderList.getSelectedData()[x].VAT,this.grdOrderList.getSelectedData()[x].AMOUNT,this.grdOrderList.getSelectedData()[x].TOTAL]
                        }
                        await this.core.sql.execute(tmpQuery) 
                   }
                }
            }
        }
        let tmpConfObj1 =
        {
            id:'msgSaveResult',showTitle:true,title:this.t("msgSave.title"),showCloseButton:true,width:'500px',height:'200px',
            button:[{id:"btn01",caption:this.t("msgSave.btn01"),location:'after'}],
        }
        if((await this.docObj.save()) == 0)
        {                                                    
            tmpConfObj1.content = (<div style={{textAlign:"center",fontSize:"20px",color:"green"}}>{this.t("msgSaveResult.msgSuccess")}</div>)
            await dialog(tmpConfObj1);
            this.docObj.clearAll()
            this.txtRef = Math.floor(Date.now() / 1000)
            this._btnGetClick()
        }
        else
        {
            tmpConfObj1.content = (<div style={{textAlign:"center",fontSize:"20px",color:"red"}}>{this.t("msgSaveResult.msgFailed")}</div>)
            await dialog(tmpConfObj1);
        }
        
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
    render()
    {
        
        return(
            <div>
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
                                                id:'msgClose',showTitle:true,title:this.lang.t("msgWarning"),showCloseButton:true,width:'500px',height:'200px',
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
                            <Form colCount={2} id="frmCriter">
                               {/* cmbDepot */}
                               <Item>
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
                                        <Validator validationGroup={"frmSalesDis" + this.tabIndex}>
                                            <RequiredRule message={this.t("validDepot")} />
                                        </Validator> 
                                    </NdSelectBox>
                                </Item>
                                <EmptyItem/>
                                <Item>
                                <Label text={this.t("txtCustomerCode")} alignment="right" />
                                <NdTextBox id="txtCustomerCode" parent={this} simple={true}  notRefresh = {true}
                                onEnterKey={(async()=>
                                {
                                    await this.pg_txtCustomerCode.setVal(this.txtCustomerCode.value)
                                    this.pg_txtCustomerCode.show()
                                    this.pg_txtCustomerCode.onClick = (data) =>
                                    { 
                                        if(data.length > 0)
                                        {
                                            this.txtCustomerCode.setState({value:data[0].TITLE})
                                            this.txtCustomerCode.CODE = data[0].CODE
                                        }
                                    }
                                }).bind(this)}
                                button=
                                {
                                    [
                                        {
                                            id:'01',
                                            icon:'more',
                                            onClick:()=>
                                            {
                                                this.pg_txtCustomerCode.show()
                                                this.pg_txtCustomerCode.onClick = (data) =>
                                                {
                                                    if(data.length > 0)
                                                    {
                                                        this.txtCustomerCode.setState({value:data[0].TITLE})
                                                        this.txtCustomerCode.CODE = data[0].CODE
                                                    }
                                                }
                                            }
                                        },
                                        {
                                            id:'02',
                                            icon:'clear',
                                            onClick:()=>
                                            {
                                                this.txtCustomerCode.setState({value:''})
                                                this.txtCustomerCode.CODE =''
                                            }
                                        },
                                    ]
                                }
                                >
                                </NdTextBox>
                                {/*CARI SECIMI POPUP */}
                                <NdPopGrid id={"pg_txtCustomerCode"} parent={this} container={"#root"}
                                visible={false}
                                position={{of:'#root'}} 
                                showTitle={true} 
                                showBorders={true}
                                width={'90%'}
                                height={'90%'}
                                title={this.t("pg_txtCustomerCode.title")} //
                                search={true}
                                data = 
                                {{
                                    source:
                                    {
                                        select:
                                        {
                                            query : "SELECT GUID,CODE,TITLE,NAME,LAST_NAME,[TYPE_NAME],[GENUS_NAME] FROM CUSTOMER_VW_01 WHERE (UPPER(CODE) LIKE UPPER(@VAL) OR UPPER(TITLE) LIKE UPPER(@VAL)) AND STATUS = 1",
                                            param : ['VAL:string|50']
                                        },
                                        sql:this.core.sql
                                    }
                                }}
                                button=
                                {
                                    {
                                        id:'01',
                                        icon:'more',
                                        onClick:()=>
                                        {
                                            console.log(1111)
                                        }
                                    }
                                }
                                >
                                    <Column dataField="CODE" caption={this.t("pg_txtCustomerCode.clmCode")} width={150} />
                                    <Column dataField="TITLE" caption={this.t("pg_txtCustomerCode.clmTitle")} width={500} defaultSortOrder="asc" />
                                    <Column dataField="TYPE_NAME" caption={this.t("pg_txtCustomerCode.clmTypeName")} width={150} />
                                    <Column dataField="GENUS_NAME" caption={this.t("pg_txtCustomerCode.clmGenusName")} width={150} />
                                    
                                </NdPopGrid>
                                </Item> 
                            </Form>
                        </div>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-3">
                            <NdButton text={this.t("btnGet")} type="success" width="100%" onClick={this._btnGetClick}></NdButton>
                        </div>
                        <div className="col-3">
                        </div>
                        <div className="col-3">
                        </div>
                        <div className="col-3">
                            <NdButton text={this.t("btnOrder")} type="default" width="100%" onClick={()=>{this._btnSave(0)}}></NdButton>
                        </div>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <NdGrid id="grdOrderList" parent={this} 
                            selection={{mode:"multiple"}} 
                            showBorders={true}
                            filterRow={{visible:true}} 
                            headerFilter={{visible:true}}
                            columnAutoWidth={true}
                            allowColumnReordering={true}
                            loadPanel={{enabled:true}}
                            allowColumnResizing={true}
                            >                            
                                <Paging defaultPageSize={20} />
                                <Pager visible={true} allowedPageSizes={[5,10,50]} showPageSizeSelector={true} />
                                <Column dataField="ITEM_CODE" caption={this.t("grdOrderList.clmCode")} visible={true} width={200}/> 
                                <Column dataField="ITEM_NAME" caption={this.t("grdOrderList.clmName")} visible={true} width={300}/> 
                                <Column dataField="QUANTITY" caption={this.t("grdOrderList.clmQuantity")} visible={true}/> 
                                <Column dataField="CUSTOMER_NAME" caption={this.t("grdOrderList.clmCustomer")} visible={true}/> 
                                <Column dataField="CUSTOMER_PRICE" caption={this.t("grdOrderList.clmPrice")} visible={true}/> 
                            </NdGrid>
                        </div>
                    </div>
                </ScrollView>
            </div>
        )
    }
}