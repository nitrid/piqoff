import React from 'react';
import App from '../../../lib/app.js';
import moment from 'moment';
import { docCls,docItemsCls,docCustomerCls,docExtraCls,deptCreditMatchingCls} from '../../../../core/cls/doc.js';

import Toolbar,{Item} from 'devextreme-react/toolbar';
import Form, { Label } from 'devextreme-react/form';
import ScrollView from 'devextreme-react/scroll-view';

import NdGrid,{Column,Button,Paging,Pager,Export,Summary,TotalItem} from '../../../../core/react/devex/grid.js';
import NdTextBox, { Validator, RequiredRule } from '../../../../core/react/devex/textbox.js'
import NdSelectBox from '../../../../core/react/devex/selectbox.js';
import NdDropDownBox from '../../../../core/react/devex/dropdownbox.js';
import NdListBox from '../../../../core/react/devex/listbox.js';
import NdButton from '../../../../core/react/devex/button.js';
import NdDatePicker from '../../../../core/react/devex/datepicker.js';
import NdPopGrid from '../../../../core/react/devex/popgrid.js';
import NdCheckBox from '../../../../core/react/devex/checkbox.js';

import NdPopUp from '../../../../core/react/devex/popup.js';
import { dialog } from '../../../../core/react/devex/dialog.js';

export default class incompleteShippedOrdersReport extends React.PureComponent
{
    constructor(props)
    {
        super(props)

        this.state = 
        {
            columnListValue : ['REF','REF_NO','INPUT_NAME','DOC_DATE','TOTAL']
        }
        this.printGuid = ''
        
        this.core = App.instance.core;
        this.columnListData = 
        [
            {CODE : "REF",NAME : this.t("grdSlsOrdList.clmRef")},
            {CODE : "REF_NO",NAME : this.t("grdSlsOrdList.clmRefNo")},
            {CODE : "INPUT_CODE",NAME : this.t("grdSlsOrdList.clmInputCode")},                                   
            {CODE : "INPUT_NAME",NAME : this.t("grdSlsOrdList.clmInputName")},
            {CODE : "ITEM_NAME",NAME : this.t("grdSlsOrdList.clmItemName")},
            {CODE : "DOC_DATE",NAME : this.t("grdSlsOrdList.clmDate")},
            {CODE : "QUANTITY",NAME : this.t("grdSlsOrdList.clmQuantıty")},
            {CODE : "COMP_QUANTITY",NAME : this.t("grdSlsOrdList.clmCompQuantıty")},
            {CODE : "PEND_QUANTITY",NAME : this.t("grdSlsOrdList.clmPendQuantıty")},
        ]
        this.groupList = [];
        this._btnGetClick = this._btnGetClick.bind(this)
        this._columnListBox = this._columnListBox.bind(this)
        this._btnGrdPrint = this._btnGrdPrint.bind(this)
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
        this.dtFirst.value=moment(new Date()).format("YYYY-MM-DD");
        this.dtLast.value=moment(new Date()).format("YYYY-MM-DD");
        this.txtCustomerCode.CODE = ''
    }
    _columnListBox(e)
    {
        let onOptionChanged = (e) =>
        {
            if (e.name == 'selectedItemKeys') 
            {
                this.groupList = [];
                if(typeof e.value.find(x => x == 'REF') != 'undefined')
                {
                    this.groupList.push('REF')
                }
                if(typeof e.value.find(x => x == 'REF_NO') != 'undefined')
                {
                    this.groupList.push('REF_NO')
                }                
                if(typeof e.value.find(x => x == 'INPUT_NAME') != 'undefined')
                {
                    this.groupList.push('INPUT_NAME')
                }
                if(typeof e.value.find(x => x == 'DOC_DATE') != 'undefined')
                {
                    this.groupList.push('DOC_DATE')
                }
                if(typeof e.value.find(x => x == 'TOTAL') != 'undefined')
                {
                    this.groupList.push('TOTAL')
                }
                
                for (let i = 0; i < this.grdSlsOrdList.devGrid.columnCount(); i++) 
                {
                    if(typeof e.value.find(x => x == this.grdSlsOrdList.devGrid.columnOption(i).name) == 'undefined')
                    {
                        this.grdSlsOrdList.devGrid.columnOption(i,'visible',false)
                    }
                    else
                    {
                        this.grdSlsOrdList.devGrid.columnOption(i,'visible',true)
                    }
                }

                this.setState(
                    {
                        columnListValue : e.value
                    }
                )
            }
        }
        
        return(
            <NdListBox id='columnListBox' parent={this}
            data={{source: this.columnListData}}
            width={'100%'}
            showSelectionControls={true}
            selectionMode={'multiple'}
            displayExpr={'NAME'}
            keyExpr={'CODE'}
            value={this.state.columnListValue}
            onOptionChanged={onOptionChanged}
            >
            </NdListBox>
        )
    }
    async _btnGetClick()
    {
       
        let tmpSource =
        {
            source : 
            {
                groupBy : this.groupList,
                select : 
                {
                    query : "SELECT MAX(GUID) AS GUID,REF,REF_NO,INPUT_CODE,INPUT_NAME,ITEM_NAME,DOC_DATE,QUANTITY,COMP_QUANTITY,PEND_QUANTITY " +
                            "FROM DOC_ORDERS_VW_01    " +
                            "WHERE  ((INPUT_CODE = @INPUT_CODE) OR (@INPUT_CODE = '')) AND     " +
                            "((DOC_DATE >= @FIRST_DATE) OR (@FIRST_DATE = '19700101')) AND ((DOC_DATE <= @LAST_DATE) OR (@LAST_DATE = '19700101'))    " +
                            "AND TYPE = 1 AND DOC_TYPE = 60 AND CLOSED = 0  AND PEND_QUANTITY > 0 " +
                            "GROUP BY REF,REF_NO,INPUT_CODE,INPUT_NAME,ITEM_NAME,DOC_DATE,QUANTITY,COMP_QUANTITY,PEND_QUANTITY   ",
                            param : ['INPUT_CODE:string|50','FIRST_DATE:date','LAST_DATE:date'],
                            value : [this.txtCustomerCode.CODE,this.dtFirst.value,this.dtLast.value]
                },
                sql : this.core.sql
            }
        }
        App.instance.setState({isExecute:true})
        await this.grdSlsOrdList.dataRefresh(tmpSource)
        App.instance.setState({isExecute:false})
    
    }
    async _btnGrdPrint(e)
    {
        this.printGuid = e.row.data.GUID
        this.popDesign.show() 
    }
    async convertDispatch()
    {
        let tmpConfObj =
        {
            id:'msgConvertDispatch',showTitle:true,title:this.t("msgConvertDispatch.title"),showCloseButton:true,width:'500px',height:'200px',
            button:[{id:"btn01",caption:this.t("msgConvertDispatch.btn01"),location:'before'},{id:"btn02",caption:this.t("msgConvertDispatch.btn02"),location:'after'}],
            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgConvertDispatch.msg")}</div>)
        }
        
        let pResult = await dialog(tmpConfObj);
        if(pResult == 'btn02')
        {
            return
        }
        for (let i = 0; i < this.grdSlsOrdList.getSelectedData().length; i++) 
        {
            let tmpDocCls =  new docCls

            let tmpDoc = {...tmpDocCls.empty}
            tmpDoc.TYPE = 1
            tmpDoc.DOC_TYPE = 40
            tmpDoc.REBATE = 0
            tmpDoc.INPUT = this.grdSlsOrdList.getSelectedData()[i].INPUT
            tmpDoc.OUTPUT = this.grdSlsOrdList.getSelectedData()[i].OUTPUT
            tmpDoc.AMOUNT = this.grdSlsOrdList.getSelectedData()[i].AMOUNT
            tmpDoc.VAT = this.grdSlsOrdList.getSelectedData()[i].VAT
            tmpDoc.VAT_ZERO = this.grdSlsOrdList.getSelectedData()[i].VAT_ZERO
            tmpDoc.TOTALHT = this.grdSlsOrdList.getSelectedData()[i].TOTALHT
            tmpDoc.TOTAL = this.grdSlsOrdList.getSelectedData()[i].TOTAL
            tmpDoc.DOC_DISCOUNT = this.grdSlsOrdList.getSelectedData()[i].DOC_DISCOUNT
            tmpDoc.DOC_DISCOUNT_1 = this.grdSlsOrdList.getSelectedData()[i].DOC_DISCOUNT_1
            tmpDoc.DOC_DISCOUNT_2 = this.grdSlsOrdList.getSelectedData()[i].DOC_DISCOUNT_2
            tmpDoc.DOC_DISCOUNT_3 = this.grdSlsOrdList.getSelectedData()[i].DOC_DISCOUNT_3
            tmpDoc.DISCOUNT = this.grdSlsOrdList.getSelectedData()[i].DISCOUNT
            tmpDoc.REF = this.grdSlsOrdList.getSelectedData()[i].REF

            let tmpQuery = 
            {
                query :"SELECT ISNULL(MAX(REF_NO) + 1,1) AS REF_NO FROM DOC WHERE TYPE = 1 AND DOC_TYPE = 40 --AND REF = @REF ",
            }

            let tmpData = await this.core.sql.execute(tmpQuery) 
            
            if(tmpData.result.recordset.length > 0)
            {
                tmpDoc.REF_NO = tmpData.result.recordset[0].REF_NO
            }

            tmpDocCls.addEmpty(tmpDoc);     
            
            let tmpLineQuery = 
            {
                query :"SELECT * FROM DOC_ORDERS WHERE DOC_GUID = @DOC_GUID ",
                param : ['DOC_GUID:string|50'],
                value : [this.grdSlsOrdList.getSelectedData()[i].GUID]
            }
            
            let tmpLineData = await this.core.sql.execute(tmpLineQuery) 
            
            if(tmpLineData.result.recordset.length > 0)
            {
                for (let x = 0; x < tmpLineData.result.recordset.length; x++) 
                {
                    let tmpdocItems = {...tmpDocCls.docItems.empty}
                    tmpdocItems.DOC_GUID = tmpDocCls.dt()[0].GUID
                    tmpdocItems.TYPE = tmpDocCls.dt()[0].TYPE
                    tmpdocItems.DOC_TYPE = tmpDocCls.dt()[0].DOC_TYPE
                    tmpdocItems.LINE_NO = tmpDocCls.docItems.dt().length
                    tmpdocItems.REF = tmpDocCls.dt()[0].REF
                    tmpdocItems.REF_NO = tmpDocCls.dt()[0].REF_NO
                    tmpdocItems.OUTPUT = tmpDocCls.dt()[0].OUTPUT
                    tmpdocItems.INPUT = tmpDocCls.dt()[0].INPUT
                    tmpdocItems.DOC_DATE = tmpDocCls.dt()[0].DOC_DATE
                    tmpdocItems.LINE_NO = tmpDocCls.docOrders.dt().length
                    tmpdocItems.ITEM = tmpLineData.result.recordset[x].ITEM
                    tmpdocItems.ITEM_NAME = tmpLineData.result.recordset[x].ITEM_NAME
                    tmpdocItems.UNIT = tmpLineData.result.recordset[x].UNIT
                    tmpdocItems.OUTPUT = tmpDocCls.dt()[0].OUTPUT
                    tmpdocItems.DISCOUNT = tmpLineData.result.recordset[x].DISCOUNT
                    tmpdocItems.DISCOUNT_1 = tmpLineData.result.recordset[x].DISCOUNT_1
                    tmpdocItems.DISCOUNT_2 = tmpLineData.result.recordset[x].DISCOUNT_2
                    tmpdocItems.DISCOUNT_3 = tmpLineData.result.recordset[x].DISCOUNT_3
                    tmpdocItems.DOC_DISCOUNT_1 = tmpLineData.result.recordset[x].DOC_DISCOUNT_1
                    tmpdocItems.DOC_DISCOUNT_2 = tmpLineData.result.recordset[x].DOC_DISCOUNT_2
                    tmpdocItems.DOC_DISCOUNT_3 = tmpLineData.result.recordset[x].DOC_DISCOUNT_3
                    tmpdocItems.DISCOUNT_RATE = tmpLineData.result.recordset[x].DISCOUNT_RATE
                    tmpdocItems.INPUT = tmpDocCls.dt()[0].INPUT
                    tmpdocItems.DOC_DATE = tmpDocCls.dt()[0].DOC_DATE
                    tmpdocItems.QUANTITY = tmpLineData.result.recordset[x].QUANTITY
                    tmpdocItems.VAT_RATE = tmpLineData.result.recordset[x].VAT_RATE
                    tmpdocItems.PRICE = tmpLineData.result.recordset[x].PRICE
                    tmpdocItems.VAT = tmpLineData.result.recordset[x].VAT
                    tmpdocItems.AMOUNT = tmpLineData.result.recordset[x].AMOUNT
                    tmpdocItems.TOTALHT = tmpLineData.result.recordset[x].TOTALHT
                    tmpdocItems.TOTAL = tmpLineData.result.recordset[x].SUM_AMOUNT
                    tmpdocItems.ORDER_DOC_GUID = tmpLineData.result.recordset[x].DOC_GUID
                    tmpdocItems.ORDER_LINE_GUID = tmpLineData.result.recordset[x].GUID

                    tmpDocCls.docItems.addEmpty(tmpdocItems)
                }
            }
            if(tmpDocCls.docItems.dt().length > 0)
            {
                await tmpDocCls.save()
            }

            let tmpConfObj =
            {
                id:'msgConvertSucces',showTitle:true,title:this.t("msgConvertSucces.title"),showCloseButton:true,width:'500px',height:'200px',
                button:[{id:"btn01",caption:this.t("msgConvertSucces.btn01"),location:'after'}],
                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgConvertSucces.msg")}</div>)
            }

            await dialog(tmpConfObj);
        }
    }
    async printOrders()
    {
        for (let i = 0; i < this.grdSlsOrdList.getSelectedData().length; i++) 
        {
            let tmpPrintQuery = 
            {
                query: "SELECT *,ISNULL((SELECT TOP 1 PATH FROM LABEL_DESIGN WHERE TAG = @DESIGN),'') AS PATH FROM  [dbo].[FN_DOC_ORDERS_FOR_PRINT](@DOC_GUID) WHERE APPROVED_QUANTITY > 0 ORDER BY LINE_NO " ,
                param:  ['DOC_GUID:string|50','DESIGN:string|25','LANG:string|10'],
                value:  [this.grdSlsOrdList.getSelectedData()[i].GUID,this.cmbAllDesignList.value,'']
            }
            let tmpData = await this.core.sql.execute(tmpPrintQuery) 
            this.core.socket.emit('devprint','{"TYPE":"REVIEW","PATH":"' + tmpData.result.recordset[0].PATH.replaceAll('\\','/') + '","DATA":' + JSON.stringify(tmpData.result.recordset) + '}',(pResult) => 
            {
                var mywindow = window.open('printview.html','_blank',"width=900,height=1000,left=500");                                                         

                mywindow.onload = function() 
                {
                    mywindow.document.getElementById("view").innerHTML="<iframe src='data:application/pdf;base64," + pResult.split('|')[1] + "' type='application/pdf' width='100%' height='100%'></iframe>"      
                } 
            });
        }
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
                                        icon: 'add',
                                        onClick: async () => 
                                        {
                                            App.instance.menuClick(
                                            {
                                                id: 'sip_02_002',
                                                text: this.t('menu'),
                                                path: 'orders/documents/salesOrder.js',
                                            })
                                        }
                                    }    
                                } />
                                <Item location="after"
                                locateInMenu="auto"
                                widget="dxButton"
                                options=
                                {
                                    {
                                        type: 'default',
                                        icon: 'detailslayout',
                                        onClick: async () => 
                                        {
                                            this.convertDispatch()
                                        }
                                    }    
                                } />
                                <Item location="after" locateInMenu="auto">
                                <NdButton id="btnPrint" parent={this} icon="print" type="default"
                                    onClick={()=>
                                    {
                                        if(this.grdSlsOrdList.getSelectedData().length > 0)
                                            {
                                                this.popAllDesign.show()
                                            }
                                    }}/>
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
                                {/* dtFirst */}
                                <Item>
                                    <Label text={this.t("dtFirst")} alignment="right" />
                                    <NdDatePicker simple={true}  parent={this} id={"dtFirst"}
                                    >
                                    </NdDatePicker>
                                </Item>
                                {/* dtLast */}
                                <Item>
                                    <Label text={this.t("dtLast")} alignment="right" />
                                    <NdDatePicker simple={true}  parent={this} id={"dtLast"}/>
                                </Item>
                                <Item>
                                <Label text={this.t("txtCustomerCode")} alignment="right" />
                                <NdTextBox id="txtCustomerCode" parent={this} simple={true}  notRefresh = {true}
                                upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                onEnterKey={(async()=>
                                    {
                                        await this.pg_txtCustomerCode.setVal(this.txtCustomerCode.value)
                                        this.pg_txtCustomerCode.show()
                                        this.pg_txtCustomerCode.onClick = (data) =>
                                        { 
                                            if(data.length > 0)
                                            {
                                                if(data.length > 0)
                                                {
                                                    this.txtCustomerCode.setState({value:data[0].TITLE})
                                                    this.txtCustomerCode.CODE = data[0].CODE
                                                }
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
                                    ]
                                }
                                />
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
                                    <Column dataField="GENUS_NAME" caption={this.t("pg_txtCustomerCode.clmGenusName")} width={150}/>       
                                </NdPopGrid>
                                </Item> 
                            </Form>
                        </div>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-3">
                            <NdDropDownBox simple={true} parent={this} id="cmbColumn"
                            value={this.state.columnListValue}
                            displayExpr="NAME"                       
                            valueExpr="CODE"
                            data={{source: this.columnListData}}
                            contentRender={this._columnListBox}
                            />
                        </div>
                        <div className="col-3">
                            
                        </div>
                        <div className="col-3">
                            <NdButton text={this.t("btnGet")} type="success" width="100%" onClick={this._btnGetClick}></NdButton>
                        </div>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <NdGrid id="grdSlsOrdList" parent={this} 
                            selection={{mode:"multiple"}} 
                            showBorders={true}
                            filterRow={{visible:true}} 
                            headerFilter={{visible:true}}
                            columnAutoWidth={true}
                            allowColumnReordering={true}
                            allowColumnResizing={true}
                             >                            
                                <Paging defaultPageSize={20} />
                                <Pager visible={true} allowedPageSizes={[5,10,50]} showPageSizeSelector={true} />
                                <Export fileName={this.lang.t("menuOff.sip_01_002")} enabled={true} allowExportSelectedData={true} />
                                <Column dataField="REF" caption={this.t("grdSlsOrdList.clmRef")} visible={true} width={200}/> 
                                <Column dataField="REF_NO" caption={this.t("grdSlsOrdList.clmRefNo")} visible={false} width={100}/> 
                                <Column dataField="INPUT_CODE" caption={this.t("grdSlsOrdList.clmInputCode")} visible={false}/> 
                                <Column dataField="INPUT_NAME" caption={this.t("grdSlsOrdList.clmInputName")} visible={true}/>                                
                                <Column dataField="ITEM_NAME" caption={this.t("grdSlsOrdList.clmItemName")} visible={true}/> 
                                <Column dataField="DOC_DATE" caption={this.t("grdSlsOrdList.clmDate")} visible={true} width={200} dataType="datetime" format={"dd/MM/yyyy"}/>
                                <Column dataField="QUANTITY" caption={this.t("grdSlsOrdList.clmQuantıty")} visible={true} width={100} /> 
                                <Column dataField="COMP_QUANTITY" caption={this.t("grdSlsOrdList.clmCompQuantıty")} visible={true} width={100} /> 
                                <Column dataField="PEND_QUANTITY" caption={this.t("grdSlsOrdList.clmPendQuantıty")} visible={true} width={125} />              
                                <Column type="buttons" width={70}>
                                    <Button hint="Clone" icon="print" onClick={this._btnGrdPrint} />
                                </Column>
                                <Summary>
                                    <TotalItem
                                    column="QUANTITY"
                                    summaryType="sum"
                                    valueFormat={{ style: "decimal"}} />
                                    <TotalItem
                                    column="COMP_QUANTITY"
                                    summaryType="sum"
                                    valueFormat={{ style: "decimal"}} />
                                    <TotalItem
                                    column="PEND_QUANTITY"
                                    summaryType="sum"
                                    valueFormat={{ style: "decimal"}} />
                                </Summary>
                            </NdGrid>
                        </div>
                    </div>
                </ScrollView>
                {/* Dizayn Seçim PopUp */}
                <div>
                    <NdPopUp parent={this} id={"popDesign"} 
                    visible={false}
                    showCloseButton={true}
                    showTitle={true}
                    title={this.t("popDesign.title")}
                    container={"#root"} 
                    width={'500'}
                    height={'280'}
                    position={{of:'#root'}}
                    >
                        <Form colCount={1} height={'fit-content'}>
                            <Item>
                                <Label text={this.t("popDesign.design")} alignment="right" />
                                <NdSelectBox simple={true} parent={this} id="cmbDesignList" notRefresh = {true}
                                displayExpr="DESIGN_NAME"                       
                                valueExpr="TAG"
                                value=""
                                searchEnabled={true}
                                data={{source:{select:{query : "SELECT TAG,DESIGN_NAME FROM [dbo].[LABEL_DESIGN] WHERE PAGE = '11'"},sql:this.core.sql}}}
                                param={this.param.filter({ELEMENT:'cmbDesignList',USERS:this.user.CODE})}
                                access={this.access.filter({ELEMENT:'cmbDesignList',USERS:this.user.CODE})}
                                >
                                    <Validator validationGroup={"frmSlsOrderMail" + this.tabIndex}>
                                        <RequiredRule message={this.t("validDesign")} />
                                    </Validator> 
                                </NdSelectBox>
                            </Item>
                            <Item>
                                <Label text={this.t("popDesign.lang")} alignment="right" />
                                <NdSelectBox simple={true} parent={this} id="cmbDesignLang" notRefresh = {true}
                                displayExpr="VALUE"                       
                                valueExpr="ID"
                                value={localStorage.getItem('lang').toUpperCase()}
                                searchEnabled={true}
                                data={{source:[{ID:"FR",VALUE:"FR"},{ID:"DE",VALUE:"DE"},{ID:"TR",VALUE:"TR"}]}}
                                />
                            </Item>
                            <Item>
                                <div className='row'>
                                    <div className='col-6'>
                                        <NdButton text={this.lang.t("btnPrint")} type="normal" stylingMode="contained" width={'100%'} validationGroup={"frmSlsOrderMail" + this.tabIndex}
                                        onClick={async (e)=>
                                        {       
                                            if(e.validationGroup.validate().status == "valid")
                                            {
                                                let tmpQuery = 
                                                {
                                                    query: "SELECT *,ISNULL((SELECT TOP 1 PATH FROM LABEL_DESIGN WHERE TAG = @DESIGN),'') AS PATH FROM  [dbo].[FN_DOC_ORDERS_FOR_PRINT](@DOC_GUID) ORDER BY LINE_NO " ,
                                                    param:  ['DOC_GUID:string|50','DESIGN:string|25','LANG:string|10'],
                                                    value:  [this.printGuid,this.cmbDesignList.value]
                                                }

                                                let tmpData = await this.core.sql.execute(tmpQuery) 

                                                this.core.socket.emit('devprint','{"TYPE":"REVIEW","PATH":"' + tmpData.result.recordset[0].PATH.replaceAll('\\','/') + '","DATA":' + JSON.stringify(tmpData.result.recordset) + '}',(pResult) => 
                                                {
                                                    var mywindow = window.open('printview.html','_blank',"width=900,height=1000,left=500");                                                         

                                                    mywindow.onload = function() 
                                                    {
                                                        mywindow.document.getElementById("view").innerHTML="<iframe src='data:application/pdf;base64," + pResult.split('|')[1] + "' type='application/pdf' width='100%' height='100%'></iframe>"      
                                                    } 
                                                });
                                                this.popDesign.hide();  
                                            }
                                        }}/>
                                    </div>
                                    <div className='col-6'>
                                        <NdButton text={this.lang.t("btnCancel")} type="normal" stylingMode="contained" width={'100%'}
                                        onClick={()=>
                                        {
                                            this.popDesign.hide();  
                                        }}/>
                                    </div>
                                </div>
                                <div className='row py-2'>
                                    <div className='col-6'>
                                        <NdButton text={this.t("btnView")} type="normal" stylingMode="contained" width={'100%'}  validationGroup={"frmSlsOrderMail" + this.tabIndex}
                                        onClick={async (e)=>
                                        {       
                                            if(e.validationGroup.validate().status == "valid")
                                            {
                                                let tmpQuery = 
                                                {
                                                    query: "SELECT *,ISNULL((SELECT TOP 1 PATH FROM LABEL_DESIGN WHERE TAG = @DESIGN),'') AS PATH FROM  [dbo].[FN_DOC_ORDERS_FOR_PRINT](@DOC_GUID) ORDER BY LINE_NO " ,
                                                    param:  ['DOC_GUID:string|50','DESIGN:string|25','LANG:string|10'],
                                                    value:  [this.printGuid,this.cmbDesignList.value]
                                                }
                                                App.instance.setState({isExecute:true})
                                                let tmpData = await this.core.sql.execute(tmpQuery) 
                                                App.instance.setState({isExecute:false})
                                                this.core.socket.emit('devprint','{"TYPE":"REVIEW","PATH":"' + tmpData.result.recordset[0].PATH.replaceAll('\\','/') + '","DATA":' + JSON.stringify(tmpData.result.recordset) + '}',(pResult) => 
                                                {
                                                    if(pResult.split('|')[0] != 'ERR')
                                                    {
                                                        var mywindow = window.open('printview.html','_blank',"width=900,height=1000,left=500");      
                                                        mywindow.onload = function() 
                                                        { 
                                                            mywindow.document.getElementById("view").innerHTML="<iframe src='data:application/pdf;base64," + pResult.split('|')[1] + "' type='application/pdf' width='100%' height='100%'></iframe>"      
                                                        } 
                                                    }
                                                });
                                            }
                                        }}/>
                                    </div>
                                    <div className='col-6'>
                                        <NdButton text={this.t("btnMailsend")} type="normal" stylingMode="contained" width={'100%'}  validationGroup={"frmSlsOrderMail" + this.tabIndex}
                                        onClick={async (e)=>
                                        {    
                                            if(e.validationGroup.validate().status == "valid")
                                            {
                                                this.popMailSend.show()
                                            }
                                        }}/>
                                    </div>
                                </div>
                            </Item>
                        </Form>
                    </NdPopUp>
                </div>  
                {/* Dizayn Seçim PopUp */}
                <div>
                    <NdPopUp parent={this} id={"popAllDesign"} 
                    visible={false}
                    showCloseButton={true}
                    showTitle={true}
                    title={this.t("popDesign.title")}
                    container={"#root"} 
                    width={'500'}
                    height={'200'}
                    position={{of:'#root'}}
                    >
                        <Form colCount={1} height={'fit-content'}>
                            <Item>
                                <Label text={this.t("popDesign.design")} alignment="right" />
                                <NdSelectBox simple={true} parent={this} id="cmbAllDesignList" notRefresh = {true}
                                displayExpr="DESIGN_NAME"                       
                                valueExpr="TAG"
                                value=""
                                searchEnabled={true}
                                data={{source:{select:{query : "SELECT TAG,DESIGN_NAME FROM [dbo].[LABEL_DESIGN] WHERE PAGE = '11'"},sql:this.core.sql}}}
                                />
                            </Item>
                            <Item>
                                <div className='row'>
                                    <div className='col-6'>
                                        <NdButton text={this.lang.t("btnPrint")} type="normal" stylingMode="contained" width={'100%'} validationGroup={"frmSlsOrderMail" + this.tabIndex}
                                        onClick={async (e)=>
                                        {       
                                            this.printOrders()
                                        }}/>
                                    </div>
                                    <div className='col-6'>
                                        <NdButton text={this.lang.t("btnCancel")} type="normal" stylingMode="contained" width={'100%'}
                                        onClick={()=>
                                        {
                                            this.popAllDesign.hide();  
                                        }}/>
                                    </div>
                                </div>
                            </Item>
                        </Form>
                    </NdPopUp>
                </div>  
            </div>
        )
    }
}