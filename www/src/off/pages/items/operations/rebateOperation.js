import React from 'react';
import App from '../../../lib/app.js';
import { docCls } from '../../../../core/cls/doc.js';

import ScrollView from 'devextreme-react/scroll-view';
import Toolbar,{ Item } from 'devextreme-react/toolbar';

import NdTextBox, { Validator, RequiredRule } from '../../../../core/react/devex/textbox.js'
import NdSelectBox from '../../../../core/react/devex/selectbox.js';
import NdPopGrid from '../../../../core/react/devex/popgrid.js';
import NdGrid,{Column,Paging,Pager,Export} from '../../../../core/react/devex/grid.js';
import NdButton from '../../../../core/react/devex/button.js';
import { dialog } from '../../../../core/react/devex/dialog.js';
import { NdForm, NdItem, NdLabel, NdEmptyItem } from '../../../../core/react/devex/form.js';
import { NdToast } from '../../../../core/react/devex/toast.js';
export default class rebateOperation extends React.PureComponent
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
        this.toGroupByCustomer = this.toGroupByCustomer.bind(this)

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

        this.txtRef = Math.floor(Date.now() / 1000)
        this.txtCustomerCode.CODE = ''
        this.txtCustomerCode.value = ''
    }
    async btnGetClick()
    {
        let tmpSource =
        {
            source : 
            {
                select : 
                { 
                    query : `SELECT ITEMS.GUID AS ITEM_GUID, 
                            ITEMS.NAME AS ITEM_NAME, 
                            ITEMS.CODE AS ITEM_CODE, 
                            ISNULL(MULTICODE.CUSTOMER_PRICE,0) AS CUSTOMER_PRICE, 
                            ISNULL(MULTICODE.VAT_RATE,0)  AS VAT_RATE, 
                            ISNULL(MULTICODE.CUSTOMER_NAME,'')  AS CUSTOMER_NAME, 
                            ISNULL(MULTICODE.CUSTOMER_CODE ,'')AS CUSTOMER_CODE, 
                            ISNULL(MULTICODE.CUSTOMER_GUID ,'00000000-0000-0000-0000-000000000000')AS CUSTOMER_GUID, 
                            [dbo].[FN_DEPOT_QUANTITY](ITEMS.GUID,'00000000-0000-0000-0000-000000000000',dbo.GETDATE()) AS QUANTITY 
                            FROM ITEMS_VW_04 AS ITEMS
                            LEFT OUTER JOIN ITEM_MULTICODE_VW_01 AS MULTICODE ON ITEMS.GUID = MULTICODE.ITEM_GUID 
                            WHERE [dbo].[FN_DEPOT_QUANTITY](ITEMS.GUID,@DEPOT,dbo.GETDATE()) > 0 
                            AND ((MULTICODE.CUSTOMER_CODE = @CUSTOMER_CODE) OR (@CUSTOMER_CODE = ''))`,
                    param : ['DEPOT:string|50','CUSTOMER_CODE:string|50'],
                    value : [this.cmbDepot.value,this.txtCustomerCode.CODE]
                },
                sql : this.core.sql
            }
        }
        
        App.instance.loading.show()
        await this.grdRebateList.dataRefresh(tmpSource)
        App.instance.loading.hide()
    }
    async btnSave(pType)
    {
        for(let i = 0; i < this.grdRebateList.getSelectedData().length; i++)
        {
           if(this.grdRebateList.getSelectedData()[i].CUSTOMER_NAME == '')
           {
                this.toast.show({message:this.t("msgCustomerFound.msg"),type:"warning"})
                return
           }
        }

        let tmpItem = await this.toGroupByCustomer(this.grdRebateList.getSelectedData(),'ITEM_CODE')

        for(let i = 0; i < Object.values(tmpItem).length; i++)
        {
           if(Object.values(tmpItem)[i].length > 1)
           {
                this.toast.show({message:Object.values(tmpItem)[i][0].ITEM_NAME + ' ' + this.t("msgDublicateItem.msg"),type:"warning"})
                return
           }
        }
        
        let tmpConfObj =
        {
            id:'msgSave',showTitle:true,title:this.t("msgSave.title"),showCloseButton:true,width:'500px',height:'auto',
            button:[{id:"btn01",caption:this.t("msgSave.btn01"),location:'before'},{id:"btn02",caption:this.t("msgSave.btn02"),location:'after'}],
            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgSave.msg")}</div>)
        }
        
        let pResult = await dialog(tmpConfObj);
        
        if(pResult == 'btn02')
        {
            return
        }
        
        let tmpCustomer = await this.toGroupByCustomer(this.grdRebateList.getSelectedData(),'CUSTOMER_GUID')

        for (let i = 0; i < Object.keys(tmpCustomer).length; i++)
        {
            let tmpQuery = 
            {
                query:  `SELECT CODE,ISNULL((SELECT (MAX(REF_NO) + 1) FROM DOC_VW_01 WHERE DOC_TYPE = 40 AND REBATE = 1 AND DOC_VW_01.INPUT = CUSTOMERS.GUID),1) AS REF_NO FROM CUSTOMERS WHERE GUID = @GUID`,
                param:  ['GUID:string|50'],
                value:  [Object.keys(tmpCustomer)[i]]
            }

            let tmpData = await this.core.sql.execute(tmpQuery) 
           
            let tmpRef = tmpData.result.recordset[0].CODE
            let tmpRefNo = tmpData.result.recordset[0].REF_NO

            if(Object.keys(tmpCustomer)[i] != '00000000-0000-0000-0000-000000000000')
            {
                if(pType == 0)
                {
                    let tmpDoc = {...this.docObj.empty}
                    tmpDoc.TYPE = 1
                    tmpDoc.DOC_TYPE = 40
                    tmpDoc.REBATE = 1
                    tmpDoc.REF = tmpRef
                    tmpDoc.REF_NO = tmpRefNo
                    tmpDoc.OUTPUT = this.cmbDepot.value
                    tmpDoc.INPUT = Object.keys(tmpCustomer)[i]
                    this.docObj.addEmpty(tmpDoc);
                }
                else if(pType == 1)
                {
                    let tmpDoc = {...this.docObj.empty}
                    tmpDoc.TYPE = 1
                    tmpDoc.DOC_TYPE = 20
                    tmpDoc.REBATE = 1
                    tmpDoc.REF = tmpRef
                    tmpDoc.REF_NO = tmpRefNo
                    tmpDoc.OUTPUT = this.cmbDepot.value
                    tmpDoc.INPUT = Object.keys(tmpCustomer)[i]
                    this.docObj.addEmpty(tmpDoc);
    
                    let tmpDocCustomer = {...this.docObj.docCustomer.empty}
                    tmpDocCustomer.DOC_GUID = this.docObj.dt()[this.docObj.dt().length - 1].GUID
                    tmpDocCustomer.TYPE = this.docObj.dt()[this.docObj.dt().length - 1].TYPE
                    tmpDocCustomer.DOC_TYPE = this.docObj.dt()[this.docObj.dt().length - 1].DOC_TYPE
                    tmpDocCustomer.REBATE = this.docObj.dt()[this.docObj.dt().length - 1].REBATE
                    tmpDocCustomer.REF = this.docObj.dt()[this.docObj.dt().length - 1].REF
                    tmpDocCustomer.REF_NO = this.docObj.dt()[this.docObj.dt().length - 1].REF_NO
                    tmpDocCustomer.DOC_DATE = this.docObj.dt()[this.docObj.dt().length - 1].DOC_DATE
                    tmpDocCustomer.OUTPUT =this.docObj.dt()[this.docObj.dt().length - 1].OUTPUT
                    tmpDocCustomer.INPUT = this.docObj.dt()[this.docObj.dt().length - 1].INPUT
                    this.docObj.docCustomer.addEmpty(tmpDocCustomer)
                }

                for(let x = 0; x < this.grdRebateList.getSelectedData().length; x++)
                {
                   if(Object.keys(tmpCustomer)[i] == this.grdRebateList.getSelectedData()[x].CUSTOMER_GUID)
                   {
                        let tmpDocItems = {...this.docObj.docItems.empty}
                        tmpDocItems.DOC_GUID = this.docObj.dt()[this.docObj.dt().length - 1].GUID
                        tmpDocItems.TYPE = this.docObj.dt()[0].TYPE
                        tmpDocItems.DOC_TYPE = this.docObj.dt()[0].DOC_TYPE
                        tmpDocItems.REBATE = this.docObj.dt()[0].REBATE
                        tmpDocItems.LINE_NO = this.docObj.docItems.dt().length
                        tmpDocItems.REF = this.docObj.dt()[this.docObj.dt().length - 1].REF
                        tmpDocItems.REF_NO = this.docObj.dt()[this.docObj.dt().length - 1].REF_NO
                        tmpDocItems.INPUT = Object.keys(tmpCustomer)[i]
                        tmpDocItems.OUTPUT = this.cmbDepot.value
                        tmpDocItems.DOC_DATE = this.docObj.dt()[this.docObj.dt().length - 1].DOC_DATE
                        tmpDocItems.SHIPMENT_DATE = this.docObj.dt()[this.docObj.dt().length - 1].SHIPMENT_DATE
                        tmpDocItems.ITEM = this.grdRebateList.getSelectedData()[x].ITEM_GUID
                        tmpDocItems.ITEM_NAME = this.grdRebateList.getSelectedData()[x].ITEM_NAME
                        tmpDocItems.PRICE = this.grdRebateList.getSelectedData()[x].CUSTOMER_PRICE
                        tmpDocItems.QUANTITY = this.grdRebateList.getSelectedData()[x].QUANTITY
                        tmpDocItems.AMOUNT = (this.grdRebateList.getSelectedData()[x].CUSTOMER_PRICE * this.grdRebateList.getSelectedData()[x].QUANTITY)
                        tmpDocItems.VAT = tmpDocItems.AMOUNT * (this.grdRebateList.getSelectedData()[x].VAT_RATE / 100)
                        tmpDocItems.TOTAL = tmpDocItems.AMOUNT + tmpDocItems.VAT
    
                        this.docObj.dt()[this.docObj.dt().length - 1].AMOUNT = tmpDocItems.AMOUNT + this.docObj.dt()[this.docObj.dt().length - 1].AMOUNT
                        this.docObj.dt()[this.docObj.dt().length - 1].VAT = tmpDocItems.VAT + this.docObj.dt()[this.docObj.dt().length - 1].VAT
                        this.docObj.dt()[this.docObj.dt().length - 1].TOTAL =  tmpDocItems.TOTAL + this.docObj.dt()[this.docObj.dt().length - 1].TOTAL
                        
                        if(pType == 1)
                        {
                            this.docObj.docCustomer.dt()[this.docObj.docCustomer.dt().length - 1].AMOUNT = this.docObj.dt()[this.docObj.dt().length - 1].TOTAL
                        }

                        await this.docObj.docItems.addEmpty(tmpDocItems)
                   }
                }
            }
        }

        if((await this.docObj.save()) == 0)
        {
            this.toast.show({message:this.t("msgSaveResult.msgSuccess"),type:"success"})
            this.docObj.clearAll()
            this.txtRef = Math.floor(Date.now() / 1000)
            this.btnGetClick()
        }
        else
        {
            let tmpConfObj1 =
            {
                id:'msgSaveResult',showTitle:true,title:this.t("msgSave.title"),showCloseButton:true,width:'500px',height:'auto',
                button:[{id:"btn01",caption:this.t("msgSave.btn01"),location:'after'}],
                content:(<div style={{textAlign:"center",fontSize:"20px",color:"red"}}>{this.t("msgSaveResult.msgFailed")}</div>)
            }
            await dialog(tmpConfObj1);
        }
    }
    async toGroupByCustomer(pData,pProperty)
    {
        return pData.reduce((acc, obj) => 
        {
            const key = obj[pProperty];
            if (!acc[key]) 
            {
               acc[key] = [];
            }
            
            acc[key].push(obj);
            return acc;
         }, {})
    }
    render()
    {
        return(
            <div id={this.props.data.id + this.tabIndex}>
                <ScrollView>
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <Toolbar>
                                <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnNew" parent={this} icon="file" type="default" onClick={()=>{this.init()}}/>
                                </Item>
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
                            <NdForm colCount={2} id="frmCriter">
                               {/* cmbDepot */}
                               <NdItem>
                                    <NdLabel text={this.t("cmbDepot")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbDepot"
                                    dt={{data:this.docObj.dt('DOC'),field:"OUTPUT"}}  
                                    displayExpr="NAME"                       
                                    valueExpr="GUID"
                                    value=""
                                    searchEnabled={true}
                                    notRefresh = {true}
                                    data={{source:{select:{query : `SELECT GUID,CODE,NAME FROM DEPOT_VW_01 WHERE TYPE = 1`},sql:this.core.sql}}}
                                    param={this.param.filter({ELEMENT:'cmbDepot',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'cmbDepot',USERS:this.user.CODE})}
                                    >
                                        <Validator validationGroup={"frmSalesDis" + this.tabIndex}>
                                            <RequiredRule message={this.t("validDepot")} />
                                        </Validator> 
                                    </NdSelectBox>
                                </NdItem>
                                <NdEmptyItem/>
                                <NdItem>
                                    <NdLabel text={this.t("txtCustomerCode")} alignment="right" />
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
                                    <NdPopGrid id={"pg_txtCustomerCode"} parent={this} container={'#' + this.props.data.id + this.tabIndex}
                                    visible={false}
                                    position={{of:'#' + this.props.data.id + this.tabIndex}} 
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
                                                query : `SELECT GUID,CODE,TITLE,NAME,LAST_NAME,[TYPE_NAME],[GENUS_NAME] FROM CUSTOMER_VW_03 WHERE (UPPER(CODE) LIKE UPPER(@VAL) OR UPPER(TITLE) LIKE UPPER(@VAL)) AND STATUS = 1`,
                                                param : ['VAL:string|50']
                                            },
                                            sql:this.core.sql
                                        }
                                    }}
                                    >
                                        <Column dataField="CODE" caption={this.t("pg_txtCustomerCode.clmCode")} width={150} />
                                        <Column dataField="TITLE" caption={this.t("pg_txtCustomerCode.clmTitle")} width={500} defaultSortOrder="asc" />
                                        <Column dataField="TYPE_NAME" caption={this.t("pg_txtCustomerCode.clmTypeName")} width={150} />
                                        <Column dataField="GENUS_NAME" caption={this.t("pg_txtCustomerCode.clmGenusName")} width={150} />
                                    </NdPopGrid>
                                </NdItem> 
                            </NdForm>
                        </div>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-3">
                            <NdButton text={this.t("btnGet")} type="success" width="100%" onClick={this.btnGetClick}/>
                        </div>
                        <div className="col-3">
                        </div>
                        <div className="col-3">
                        </div>
                        <div className="col-3">
                            <NdButton text={this.t("btnDispatch")} type="default" width="100%" onClick={()=>{this.btnSave(0)}}/>
                        </div>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <NdGrid id="grdRebateList" parent={this} 
                            selection={{mode:"multiple"}} 
                            showBorders={true}
                            filterRow={{visible:true}} 
                            height={'700'} 
                            width={'100%'}
                            columnAutoWidth={true}
                            allowColumnReordering={true}
                            loadPanel={{enabled:true}}
                            allowColumnResizing={true}
                            >                            
                                <Paging defaultPageSize={20} />
                                <Pager visible={true} allowedPageSizes={[5,10,50]} showPageSizeSelector={true} />
                                <Export fileName={this.lang.t("menuOff.stk_04_002")} enabled={true} allowExportSelectedData={true} />
                                <Column dataField="ITEM_CODE" caption={this.t("grdRebateList.clmCode")} visible={true} width={200}/> 
                                <Column dataField="ITEM_NAME" caption={this.t("grdRebateList.clmName")} visible={true} width={300}/> 
                                <Column dataField="QUANTITY" caption={this.t("grdRebateList.clmQuantity")} visible={true}/> 
                                <Column dataField="CUSTOMER_NAME" caption={this.t("grdRebateList.clmCustomer")} visible={true}/> 
                                <Column dataField="CUSTOMER_PRICE" caption={this.t("grdRebateList.clmPrice")} visible={true}/> 
                            </NdGrid>
                        </div>
                    </div>
                    <NdToast id={"toast"} parent={this} displayTime={2000} position={{at:"top center",offset:'0px 110px'}}/>
                </ScrollView>
            </div>
        )
    }
}