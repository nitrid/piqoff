import React from 'react';
import App from '../../../lib/app.js';
import moment from 'moment';

import ScrollView from 'devextreme-react/scroll-view';
import Toolbar from 'devextreme-react/toolbar';
import  {Item} from 'devextreme-react/form'; 

import NbDateRange from '../../../../core/react/bootstrap/daterange.js';
import {Column} from '../../../../core/react/devex/grid.js';
import NdButton from '../../../../core/react/devex/button.js';
import { dialog } from '../../../../core/react/devex/dialog.js';
import NdTextBox, { Validator,  RequiredRule } from '../../../../core/react/devex/textbox.js'
import NdPopGrid from '../../../../core/react/devex/popgrid.js';
import NdOpenInvoiceReport from '../../../../core/react/devex/openinvoicereport.js';
import NdPopUp from '../../../../core/react/devex/popup.js';
import NdHtmlEditor from '../../../../core/react/devex/htmlEditor.js';
import NdSelectBox from '../../../../core/react/devex/selectbox.js';
import { NdForm, NdItem, NdLabel, NdEmptyItem} from '../../../../core/react/devex/form.js';
import { NdToast} from '../../../../core/react/devex/toast.js';

export default class openInvoiceSalesReport extends React.PureComponent
{
    constructor(props)
    {
        super(props)

        this.core = App.instance.core;

        this.btnGetirClick = this.btnGetirClick.bind(this)
        this.saveState = this.saveState.bind(this)
        this.loadState = this.loadState.bind(this)
        this.tabIndex = props.data.tabkey
    }

    loadState() 
    {
        let tmpLoad = this.access.filter({ELEMENT:'grdListe',USERS:this.user.CODE})
        return tmpLoad.getValue()
    }
    saveState(e)
    {
        let tmpSave = this.access.filter({ELEMENT:'grdListe',USERS:this.user.CODE,PAGE:this.props.data.id,APP:"OFF"})
        tmpSave.setValue(e)
        tmpSave.save()
    }

    async componentDidMount()
    {
        setTimeout(async () => { }, 1000);
    }
    async InvPrint()
    {
        let tmpLines = []
        App.instance.loading.show()
        for (let i = 0; i < this.grdListe.getSelectedData().length; i++) 
        {
            let tmpQuery = 
            {
                query:  `SELECT *,ISNULL((SELECT TOP 1 PATH FROM LABEL_DESIGN WHERE TAG = @DESIGN),'') AS PATH FROM  [dbo].[FN_DOC_ITEMS_FOR_PRINT](@DOC_GUID,@LANG) ORDER BY DOC_DATE,LINE_NO `,
                param:  ['DOC_GUID:string|50','DESIGN:string|25','LANG:string|10'],
                value:  [this.grdListe.getSelectedData()[i].DOC_GUID,this.cmbDesignList.value,localStorage.getItem('lang').toUpperCase()]
            }

            let tmpData = await this.core.sql.execute(tmpQuery) 

            for (let x = 0; x < tmpData.result.recordset.length; x++) 
            {
                tmpLines.push(tmpData.result.recordset[x])
            }
        }
       
        this.core.socket.emit('devprint','{"TYPE":"REVIEW","PATH":"' + tmpLines[0].PATH.replaceAll('\\','/') + '","DATA":' + JSON.stringify(tmpLines) + '}',async(pResult) =>
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
        App.instance.loading.hide()
    }

    async btnGetirClick()
    {
        try {
            if(this.txtCustomerCode.value == '')
            {
                this.txtCustomerCode.GUID = ''
                let tmpSource =
                {
                    source : 
                    {
                        select: 
                        {
                            query: 
                                   `SELECT *, 
                                   CASE WHEN REBATE = 0 THEN ROUND((DOC_TOTAL - PAYING_AMOUNT), 2) 
                                   ELSE ROUND((PAYING_AMOUNT - DOC_TOTAL), 2) END AS REMAINDER 
                                   FROM ( 
                                   SELECT 
                                   TYPE, 
                                   DOC_TYPE, 
                                   DOC_DATE, 
                                   INPUT_CODE, 
                                   CASE WHEN TYPE = 1 AND REBATE = 0 THEN INPUT_NAME ELSE OUTPUT_NAME END AS INPUT_NAME, 
                                   DOC_REF, 
                                   DOC_REF_NO, 
                                   DOC_GUID ,
                                   REBATE, 
                                   MAX(DOC_TOTAL) AS DOC_TOTAL,  
                                   SUM(PAYING_AMOUNT) AS PAYING_AMOUNT  
                                   FROM DEPT_CREDIT_MATCHING_VW_03 
                                   WHERE ((TYPE = 1 AND DOC_TYPE = 20 AND REBATE = 0) OR (TYPE = 0 AND DOC_TYPE = 20 AND REBATE = 1)) 
                                   AND DOC_DATE >= @FIRST_DATE AND DOC_DATE <= @LAST_DATE 
                                   GROUP BY DOC_TYPE, TYPE, DOC_DATE, 
                                   CASE WHEN TYPE = 1 AND REBATE = 0 THEN INPUT_NAME ELSE OUTPUT_NAME END, 
                                   DOC_REF_NO, DOC_REF, INPUT_CODE, DOC_GUID, REBATE 
                                   ) AS TMP 
                                   WHERE ROUND((DOC_TOTAL - PAYING_AMOUNT), 2) > 0`,
                            param : ['FIRST_DATE:date','LAST_DATE:date'],
                            value : [this.dtDate.startDate,this.dtDate.endDate],
                        },
                        sql : this.core.sql
                    }
                }
                
                let tmpData = await this.core.sql.execute(tmpSource.source.select);

                if(tmpData && tmpData.result && tmpData.result.recordset && tmpData.result.recordset.length > 0)
                {
                    this.grdListe.setDataSource(tmpData.result.recordset);
                } 
                else
                {
                    this.grdListe.setDataSource([]);
                }
                return;
            }
            let tmpSource =
            {
                source : 
                {
                    select: 
                    {
                        query: 
                               `SELECT *, 
                               CASE WHEN REBATE = 0 THEN ROUND((DOC_TOTAL - PAYING_AMOUNT), 2) 
                               ELSE ROUND((PAYING_AMOUNT - DOC_TOTAL), 2) END AS REMAINDER 
                               FROM ( 
                               SELECT 
                               TYPE, 
                               DOC_TYPE, 
                               DOC_DATE, 
                               INPUT_CODE, 
                               CASE WHEN TYPE = 1 AND REBATE = 0 THEN INPUT_NAME ELSE OUTPUT_NAME END AS INPUT_NAME, 
                               DOC_REF, 
                               DOC_REF_NO, 
                               DOC_GUID ,
                               REBATE, 
                               MAX(DOC_TOTAL) AS DOC_TOTAL, 
                               SUM(PAYING_AMOUNT) AS PAYING_AMOUNT  
                               FROM DEPT_CREDIT_MATCHING_VW_03 
                               WHERE ((TYPE = 1 AND DOC_TYPE = 20 AND REBATE = 0 AND INPUT = @INPUT) 
                               OR (TYPE = 0 AND DOC_TYPE = 20 AND REBATE = 1 AND OUTPUT = @INPUT)) 
                               AND DOC_DATE >= @FIRST_DATE AND DOC_DATE <= @LAST_DATE 
                               GROUP BY DOC_TYPE, TYPE, DOC_DATE, 
                               CASE WHEN TYPE = 1 AND REBATE = 0 THEN INPUT_NAME ELSE OUTPUT_NAME END, 
                               DOC_REF_NO, DOC_REF, INPUT_CODE, DOC_GUID, REBATE 
                               ) AS TMP 
                               WHERE ROUND((DOC_TOTAL - PAYING_AMOUNT), 2) > 0`,
                        param : ['FIRST_DATE:date','LAST_DATE:date','INPUT:string|36'],
                        value : [this.dtDate.startDate,this.dtDate.endDate,this.txtCustomerCode.GUID],
                    },
                    sql : this.core.sql
                }
            }
            
            let tmpData = await this.core.sql.execute(tmpSource.source.select);
            
            if(tmpData && tmpData.result && tmpData.result.recordset && tmpData.result.recordset.length > 0) 
            {
                this.grdListe.setDataSource(tmpData.result.recordset);
            } 
            else 
            {
                this.grdListe.setDataSource([]);
            }
        } 
        catch (error)
        {
            this.grdListe.setDataSource([]);
            await dialog({
                id: 'msgError',
                showTitle: true,
                title: this.t("msgError.title"),
                showCloseButton: true,
                width: '500px',
                height: 'auto',
                button: [{id: "btn01", caption: this.t("msgError.btn01"), location: 'after'}],
                content: (<div style={{textAlign: "center", fontSize: "20px"}}>{this.t("msgError.msg") + ": " + error.message}</div>)
            });
        }
    }

    render(){
        return (
            <div id={this.props.data.id + this.tabIndex}>
                <ScrollView>
                    {/* Toolbar */}
                    <div className="row px-2 pt-1">
                        <div className="col-12">
                            <Toolbar>
                                <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnPrint" parent={this} icon="print" type="default" onClick={async()=> { this.popDesign.show() }}/>
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
                    <div className="row px-2 pt-1" style={{height:'80px'}}>
                        <div className="col-12">
                            <NdForm colCount={2} id="frmKriter">
                                <NdItem>
                                    <NdLabel text={this.t("dtDate")} alignment="right" />
                                    <NbDateRange id={"dtDate"} parent={this} startDate={moment().startOf('month')} endDate={moment().endOf('month')}/>
                                </NdItem>
                                <NdItem>
                                    <NdEmptyItem/>
                                </NdItem>
                                <NdItem>
                                    <NdLabel text={this.t("txtCustomerCode")} alignment="right" />
                                    {/* <Label text={this.t("txtCustomerCode")} alignment="right" /> */}
                                    <NdTextBox id="txtCustomerCode" parent={this} simple={true}  notRefresh = {true} placeholder = {this.t("txtCustomerCode")}
                                    onEnterKey={(async()=>
                                    {
                                        await this.pg_txtCustomerCode.setVal(this.txtCustomerCode.value)
                                        this.pg_txtCustomerCode.show()
                                        this.pg_txtCustomerCode.onClick = (data) =>
                                        { 
                                            if(data.length > 0)
                                            {
                                                this.txtCustomerCode.setState({value:data[0].TITLE})
                                                this.txtCustomerCode.GUID = data[0].GUID
                                            }
                                        }
                                    }).bind(this)}
                                    onValueChanged={(async(e)=>
                                    {
                                        if(e.value == '')
                                        {
                                            this.txtCustomerCode.CODE = ""
                                        }
                                    }    
                                    )}
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
                                                    this.txtCustomerCode.GUID ='00000000-0000-0000-0000-000000000000'
                                                }
                                            },
                                        ]
                                    }
                                    >
                                        <Validator validationGroup={"customerSaleRebate" + this.tabIndex}>
                                            <RequiredRule message={this.t("validCode")} />
                                        </Validator>  
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
                    <div className="row px-2 pt-1">
                        <div className="col-3">
                        </div>
                        <div className="col-3">
                        </div>
                        <div className="col-3">
                        </div>
                        <div className="col-3">
                            <NdButton text={this.t("btnGet")} type="success" width="100%" onClick={this.btnGetirClick}/>
                        </div>
                    </div>
                    <div className="row px-2 pt-1">
                        <div className="col-12">
                            <NdOpenInvoiceReport 
                                id="grdListe" 
                                parent={this} 
                                ref={(r) => { this.grdListe = r; }}
                                height={'700px'}
                                currency="EUR"
                                allowFiltering={true}
                                allowSorting={true}
                                allowExporting={true}
                                showGroupPanel={false}
                                onSelectionChanged={(e) => 
                                {
                                    // Seçilen satırları sakla
                                    this.selectedRows = e.selectedRowsData;
                                }}
                                onRowDblClick={async (e) => 
                                {
                                    if (e.data.REBATE == 1) 
                                    {
                                        App.instance.menuClick({
                                          id: 'ftr_02_003',
                                          text: this.t("menu"),
                                          path: 'invoices/documents/rebatePurcInvoice.js',
                                          pagePrm: { GUID: e.data.DOC_GUID }
                                        });
                                      } 
                                      else 
                                      {
                                        console.log("e222",e)
                                        App.instance.menuClick({
                                          id: 'ftr_02_002',
                                          text: this.t("menu"),
                                          path: 'invoices/documents/salesInvoice.js',
                                          pagePrm: { GUID: e.data.DOC_GUID }
                                        });
                                      }
                                  }}
                            />
                        </div>
                    </div>
                    <div>
                        <NdPopUp parent={this} id={"popDesign"} 
                        visible={false}
                        showCloseButton={true}
                        showTitle={true}
                        title={this.t("popDesign.title")}
                        container={'#' + this.props.data.id + this.tabIndex} 
                        width={'500'}
                        height={'180'}
                        position={{of:'#' + this.props.data.id + this.tabIndex}}
                        deferRendering={true}
                        >
                            <NdForm colCount={1} height={'fit-content'}>
                                <NdItem>
                                    <NdLabel text={this.t("popDesign.design")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbDesignList" notRefresh = {true}
                                    displayExpr="DESIGN_NAME"                       
                                    valueExpr="TAG"
                                    value=""
                                    searchEnabled={true}
                                    data={{source:{select:{query : "SELECT TAG,DESIGN_NAME FROM [dbo].[LABEL_DESIGN] WHERE PAGE = '115'"},sql:this.core.sql}}}
                                    param={this.param.filter({ELEMENT:'cmbDesignList',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'cmbDesignList',USERS:this.user.CODE})}
                                    >
                                        <Validator validationGroup={"frmPrintPop" + this.tabIndex}>
                                            <RequiredRule message={this.t("validDesign")} />
                                        </Validator> 
                                    </NdSelectBox>
                                </NdItem>
                                <NdItem>
                                    <div className='row'>
                                        <div className='col-6'>
                                            <NdButton text={this.lang.t("btnPrint")} type="normal" stylingMode="contained" width={'100%'} validationGroup={"frmPrintPop" + this.tabIndex}
                                            onClick={async (e)=>
                                            {       
                                                this.InvPrint()
                                                this.popDesign.hide();  
                                            }}/>
                                        </div>
                                        <div className='col-6'>
                                            <NdButton text={this.t("btnMailSend")} type="normal" stylingMode="contained" width={'100%'}  validationGroup={"frmPrintPop" + this.tabIndex}
                                            onClick={async (e)=>
                                            {    
                                                if(e.validationGroup.validate().status == "valid")
                                                {
                                                    let tmpLines = []       
                                                    for (let i = 0; i < this.grdListe.getSelectedData().length; i++) 
                                                        {
                                                            let tmpQuery = 
                                                            {
                                                                query: `SELECT *,ISNULL((SELECT TOP 1 PATH FROM LABEL_DESIGN WHERE TAG = @DESIGN),'') AS PATH FROM  [dbo].[FN_DOC_ITEMS_FOR_PRINT](@DOC_GUID,@LANG) ORDER BY DOC_DATE,LINE_NO `,
                                                                param:  ['DOC_GUID:string|50','DESIGN:string|25','LANG:string|10'],
                                                                value:  [this.grdListe.getSelectedData()[i].DOC_GUID,this.cmbDesignList.value,localStorage.getItem('lang').toUpperCase()]
                                                            }
                                                            let tmpData = await this.core.sql.execute(tmpQuery) 
                                                            for (let x = 0; x < tmpData.result.recordset.length; x++) 
                                                            {
                                                                tmpLines.push(tmpData.result.recordset[x])
                                                            }
                                                        }
                                                    if(tmpLines.length > 0)
                                                    {
                                                        await this.popMailSend.show()
                                                        let tmpQuery = 
                                                        {
                                                            query :`SELECT EMAIL FROM CUSTOMER_OFFICAL WHERE CUSTOMER = @GUID AND DELETED = 0`,
                                                            param:  ['GUID:string|50'],
                                                            value:  [tmpLines[0].INPUT]
                                                        }
                                                        let tmpData = await this.core.sql.execute(tmpQuery) 
                                                        if(tmpData.result.recordset.length > 0)
                                                        {
                                                            this.txtSendMail.value = tmpData.result.recordset[0].EMAIL
                                                        }
                                                    }
                                                }
                                            }}/>
                                        </div>
                                        <div className='col-6'>
                                            <NdButton text={this.lang.t("btnCancel")} type="normal" stylingMode="contained" width={'100%'}
                                            onClick={()=>  { this.popDesign.hide() }}/>
                                        </div>
                                    </div>
                                </NdItem>
                            </NdForm>
                        </NdPopUp>
                    </div> 
                    <div>
                        <NdPopUp parent={this} id={"popMailSend"} 
                        visible={false}
                        showCloseButton={true}
                        showTitle={true}
                        title={this.t("popMailSend.title")}
                        container={'#' + this.props.data.id + this.tabIndex} 
                        width={'600'}
                        height={'600'}
                        position={{of:'#' + this.props.data.id + this.tabIndex}}
                        deferRendering={true}
                        >
                            <NdForm colCount={1} height={'fit-content'}>
                                <NdItem>
                                    <NdLabel text={this.t("popMailSend.cmbMailAddress")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbMailAddress" notRefresh = {true}
                                    displayExpr="MAIL_ADDRESS"                       
                                    valueExpr="GUID"
                                    value=""
                                    searchEnabled={true}
                                    data={{source:{select:{query : "SELECT * FROM MAIL_SETTINGS "},sql:this.core.sql}}}
                                    >
                                        <Validator validationGroup={"frmMailsend" + this.tabIndex}>
                                            <RequiredRule message={this.t("validMail")} />
                                        </Validator> 
                                    </NdSelectBox>
                                </NdItem>
                                <NdItem>
                                    <NdLabel text={this.t("popMailSend.txtMailSubject")} alignment="right" />
                                    <NdTextBox id="txtMailSubject" parent={this} simple={true}
                                    maxLength={128}
                                    >
                                        <Validator validationGroup={"frmMailsend" + this.tabIndex}>
                                            <RequiredRule message={this.t("validMail")} />
                                        </Validator> 
                                    </NdTextBox>
                                </NdItem>
                                <NdItem>
                                <NdLabel text={this.t("popMailSend.txtSendMail")} alignment="right" />
                                    <NdTextBox id="txtSendMail" parent={this} simple={true}
                                    maxLength={128}
                                    >
                                        <Validator validationGroup={"frmMailsend" + this.tabIndex}>
                                            <RequiredRule message={this.t("validMail")} />
                                        </Validator> 
                                    </NdTextBox>
                                </NdItem>
                                <NdItem>
                                    <NdHtmlEditor id="htmlEditor" parent={this} height={300} placeholder={this.t("placeMailHtmlEditor")}>
                                    </NdHtmlEditor>
                                </NdItem>
                                <NdItem>
                                    <div className='row'>
                                        <div className='col-6'>
                                            <NdButton text={this.t("popMailSend.btnSend")} type="normal" stylingMode="contained" width={'100%'}  
                                            validationGroup={"frmMailsend"  + this.tabIndex}
                                            onClick={async (e)=>
                                            {       
                                                if(e.validationGroup.validate().status == "valid")
                                                {
                                                    
                                                    let tmpLines = []
                                                    App.instance.loading.show()
                                                    for (let i = 0; i < this.grdListe.getSelectedData().length; i++) 
                                                    {
                                                        let tmpQuery = 
                                                        {
                                                            query: `SELECT *,ISNULL((SELECT TOP 1 PATH FROM LABEL_DESIGN WHERE TAG = @DESIGN),'') AS PATH FROM  [dbo].[FN_DOC_ITEMS_FOR_PRINT](@DOC_GUID,@LANG) ORDER BY DOC_DATE,LINE_NO `,
                                                            param:  ['DOC_GUID:string|50','DESIGN:string|25','LANG:string|10'],
                                                            value:  [this.grdListe.getSelectedData()[i].DOC_GUID,this.cmbDesignList.value,localStorage.getItem('lang').toUpperCase()]
                                                        }
                                                        let tmpData = await this.core.sql.execute(tmpQuery) 
                                                        for (let x = 0; x < tmpData.result.recordset.length; x++) 
                                                        {
                                                            tmpLines.push(tmpData.result.recordset[x])
                                                        }
                                                    }
                                                
                                                    this.core.socket.emit('devprint','{"TYPE":"REVIEW","PATH":"' + tmpLines[0].PATH.replaceAll('\\','/') + '","DATA":' + JSON.stringify(tmpLines) + '}',async(pResult) =>
                                                    {
                                                      
                                                            let tmpAttach = pResult.split('|')[1]
                                                            let tmpHtml = this.htmlEditor.value
                                                            if(this.htmlEditor.value.length == 0)
                                                            {
                                                                tmpHtml = ''
                                                            }
                                                            if(pResult.split('|')[0] != 'ERR')
                                                            {
                                                            }
                                                            let tmpMailData = {html:tmpHtml,subject:this.txtMailSubject.value,sendMail:this.txtSendMail.value,attachName:"Rapport Facture"+".pdf",attachData:tmpAttach,text:"",mailGuid:this.cmbMailAddress.value}
                                                            this.core.socket.emit('mailer',tmpMailData,async(pResult1) => 
                                                            {
                                                                App.instance.loading.hide()
                                                                let tmpConfObj1 =
                                                                {
                                                                    id:'msgMailSendResult',showTitle:true,title:this.t("msgMailSendResult.title"),showCloseButton:true,width:'500px',height:'auto',
                                                                    button:[{id:"btn01",caption:this.t("msgMailSendResult.btn01"),location:'after'}],
                                                                }
                                                                
                                                                if((pResult1) == 0)
                                                                {  
                                                                    this.toast.show({message:this.t("msgMailSendResult.msgSuccess"),type:"success"})
                                                                    this.htmlEditor.value = '',
                                                                    this.txtMailSubject.value = '',
                                                                    this.txtSendMail.value = ''
                                                                    this.popMailSend.hide();  
    
                                                                }
                                                                else
                                                                {
                                                                    tmpConfObj1.content = (<div style={{textAlign:"center",fontSize:"20px",color:"red"}}>{this.t("msgMailSendResult.msgFailed")}</div>)
                                                                    await dialog(tmpConfObj1);
                                                                    this.popMailSend.hide(); 
                                                                }
                                                            });
                                                    });
                                                    App.instance.loading.hide()
                                                }
                                                    
                                            }}/>
                                        </div>
                                        <div className='col-6'>
                                            <NdButton text={this.lang.t("btnCancel")} type="normal" stylingMode="contained" width={'100%'}
                                            onClick={()=> { this.popMailSend.hide() }}/>
                                        </div>
                                    </div>
                                </NdItem>
                            </NdForm>
                        </NdPopUp>
                        <NdToast id={"toast"} parent={this} displayTime={3000} position={{at:"top center",offset:'0px 110px'}}/>
                    </div>                     
                </ScrollView>
            </div>
        )
    }
}