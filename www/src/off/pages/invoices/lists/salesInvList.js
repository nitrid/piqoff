import React from 'react';
import App from '../../../lib/app.js';
import moment from 'moment';

import Toolbar,{Item} from 'devextreme-react/toolbar';
import Form, { Label } from 'devextreme-react/form';
import ScrollView from 'devextreme-react/scroll-view';

import NdGrid,{Column,Paging,Pager,Export,Scrolling} from '../../../../core/react/devex/grid.js';
import NdDropDownBox from '../../../../core/react/devex/dropdownbox.js';
import NdListBox from '../../../../core/react/devex/listbox.js';
import NdButton from '../../../../core/react/devex/button.js';
import NbDateRange from '../../../../core/react/bootstrap/daterange.js';
import NdPopGrid from '../../../../core/react/devex/popgrid.js';
import NdPopUp from '../../../../core/react/devex/popup.js';
import { dialog } from '../../../../core/react/devex/dialog.js';
import NdSelectBox from '../../../../core/react/devex/selectbox.js';
import NdTextBox, { Validator, RequiredRule, RangeRule } from '../../../../core/react/devex/textbox.js'

export default class salesInvList extends React.PureComponent
{
    constructor(props)
    {
        super(props)

        this.state = 
        {
            columnListValue : ['REF','REF_NO','INPUT_NAME','DOC_DATE','TOTAL','MAIL']
        }
        
        this.core = App.instance.core;
        this.columnListData = 
        [
            {CODE : "REF",NAME : this.t("grdSlsIvcList.clmRef")},
            {CODE : "REF_NO",NAME : this.t("grdSlsIvcList.clmRefNo")},
            {CODE : "INPUT_CODE",NAME : this.t("grdSlsIvcList.clmInputCode")},                                   
            {CODE : "INPUT_NAME",NAME : this.t("grdSlsIvcList.clmInputName")},
            {CODE : "OUTPUT_NAME",NAME : this.t("grdSlsIvcList.clmOutputName")},
            {CODE : "DOC_DATE",NAME : this.t("grdSlsIvcList.clmDate")},
            {CODE : "AMOUNT",NAME : this.t("grdSlsIvcList.clmAmount")},
            {CODE : "VAT",NAME : this.t("grdSlsIvcList.clmVat")},
            {CODE : "TOTAL",NAME : this.t("grdSlsIvcList.clmTotal")},
            {CODE : "MAIL",NAME : this.t("grdSlsIvcList.clmMail")},

        ]
        this.groupList = [];
        this._btnGetClick = this._btnGetClick.bind(this)
        this._columnListBox = this._columnListBox.bind(this)
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
        this.txtCustomerCode.CODE = '';
        this._btnGetClick()
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
                if(typeof e.value.find(x => x == 'MAIL') != 'undefined')
                {
                    this.groupList.push('MAIL')
                }
                
                for (let i = 0; i < this.grdSlsIvcList.devGrid.columnCount(); i++) 
                {
                    if(typeof e.value.find(x => x == this.grdSlsIvcList.devGrid.columnOption(i).name) == 'undefined')
                    {
                        this.grdSlsIvcList.devGrid.columnOption(i,'visible',false)
                    }
                    else
                    {
                        this.grdSlsIvcList.devGrid.columnOption(i,'visible',true)
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
                    query : "SELECT *,CASE WHEN ISNULL((SELECT TOP 1 RECIEVER_MAIL FROM MAIL_STATUS WHERE MAIL_STATUS.DOC_GUID = DOC_VW_01.GUID),'') <> '' THEN  'OK' ELSE 'X' END AS MAIL FROM DOC_VW_01 " +
                            "WHERE ((INPUT_CODE = @INPUT_CODE) OR (@INPUT_CODE = '')) AND "+ 
                            "((DOC_DATE >= @FIRST_DATE) OR (@FIRST_DATE = '19700101')) AND ((DOC_DATE <= @LAST_DATE) OR (@LAST_DATE = '19700101'))  " +
                            " AND TYPE = 1 AND DOC_TYPE = 20  AND REBATE = 0 ORDER BY DOC_DATE DESC,REF_NO DESC",
                    param : ['INPUT_CODE:string|50','FIRST_DATE:date','LAST_DATE:date'],
                    value : [this.txtCustomerCode.CODE,this.dtFirst.startDate,this.dtFirst.endDate]
                },
                sql : this.core.sql
            }
        }
        App.instance.setState({isExecute:true})
        await this.grdSlsIvcList.dataRefresh(tmpSource)
        App.instance.setState({isExecute:false})
    }
    async txtDownload()
    {
        let tmpQuery = 
        {
            query : "SELECT REPLACE(CONVERT(varchar,DOC_DATE,104),'.','') AS DOC_DATE, " +
                    "TYPE_NAME + '-' + CONVERT(nvarchar,REF_NO) AS REF, " +
                    "CASE WHEN TYPE_NAME = 'FAC' THEN 'Facture ' + INPUT_NAME ELSE 'Avoir ' + OUTPUT_NAME END AS CUSTOMER, " +
                    "TOTAL, TOTAL - VAT AS TOTALHT, VAT,(SELECT TOP 1 ACCOUNTING_CODE FROM CUSTOMER_VW_01 WHERE CUSTOMER_VW_01.GUID = DOC_VW_01.INPUT OR CUSTOMER_VW_01.GUID = DOC_VW_01.OUTPUT) AS ACCOUNTING_CODE, " +
                    "CASE WHEN REBATE = 0 THEN  INPUT_CODE ELSE OUTPUT_CODE END AS CUSTOMER_CODE, " +
                    " CASE WHEN REBATE = 0 THEN (SELECT TOP 1 COUNTRY FROM CUSTOMER_ADRESS_VW_01 WHERE CUSTOMER_ADRESS_VW_01.CUSTOMER = DOC_VW_01.INPUT AND CUSTOMER_ADRESS_VW_01.TYPE = 0) " +
                    " ELSE (SELECT TOP 1 COUNTRY FROM CUSTOMER_ADRESS_VW_01 WHERE CUSTOMER_ADRESS_VW_01.CUSTOMER = DOC_VW_01.OUTPUT AND CUSTOMER_ADRESS_VW_01.TYPE = 0) END AS COUNTRY, " +
                    "(SELECT TOP 1 REPLACE(CONVERT(varchar,EXPIRY_DATE,104),'.','') FROM DOC_CUSTOMER_VW_01 WHERE DOC_CUSTOMER_VW_01.DOC_GUID = DOC_VW_01.GUID) AS EXP_DATE " +
                    "FROM DOC_VW_01 WHERE DOC_TYPE = 20 AND ((TYPE = 1 AND REBATE = 0) OR (TYPE = 0 AND REBATE = 1)) " +
                    "AND ((INPUT_CODE = @INPUT_CODE) OR (@INPUT_CODE = '')) " +
                    "AND ((DOC_DATE >= @FIRST_DATE) OR (@FIRST_DATE = '19700101')) " + 
                    "AND ((DOC_DATE <= @LAST_DATE) OR (@LAST_DATE = '19700101')) " +
                    "ORDER BY DOC_DATE,REF_NO",
            param : ['INPUT_CODE:string|50','FIRST_DATE:date','LAST_DATE:date'],
            value : [this.txtCustomerCode.CODE,this.dtFirst.startDate,this.dtFirst.endDate]
        }

        let tmpData = await this.core.sql.execute(tmpQuery)
        
        let content = "Code journal;Date;N° Pièce;Désignation;Montant Net;Montant Brut;Compte;Compte;Taxe;Expiration\r\n";
        
        for(let i = 0; i < tmpData.result.recordset.length; i++)
        {
            let row = tmpData.result.recordset[i];
            
            if(row.TYPE == 0)
            {   
                if(row.COUNTRY == 'FR')
                {
                    content += `VE;${row.DOC_DATE};${row.REF};${row.CUSTOMER};${row.TOTAL};0;${row.ACCOUNTING_CODE};4110000;;${row.EXP_DATE}\r\n`;
            
                    // KDV'siz tutar satırı  
                    content += `VE;${row.DOC_DATE};${row.REF};${row.CUSTOMER};0;${row.TOTALHT};;7070000;;${row.EXP_DATE}\r\n`;
                    
                    // KDV satırı
                    content += `VE;${row.DOC_DATE};${row.REF};${row.CUSTOMER};0;${row.VAT};;4457151;;${row.EXP_DATE}\r\n`;
                }
                else if(row.COUNTRY == 'DE')
                {
                    content += `VE;${row.DOC_DATE};${row.REF};${row.CUSTOMER};${row.TOTAL};0;${row.ACCOUNTING_CODE};4110000;;${row.EXP_DATE}\r\n`;
            
                    // KDV'siz tutar satırı  
                    content += `VE;${row.DOC_DATE};${row.REF};${row.CUSTOMER};0;${row.TOTALHT};;7079120;;${row.EXP_DATE}\r\n`;
                }
                else if(row.COUNTRY == 'CH')
                {
                    content += `VE;${row.DOC_DATE};${row.REF};${row.CUSTOMER};${row.TOTAL};0;411${row.CUSTOMER_CODE};4110000;;${row.EXP_DATE}\r\n`;
            
                    // KDV'siz tutar satırı  
                    content += `VE;${row.DOC_DATE};${row.REF};${row.CUSTOMER};0;${row.TOTALHT};;7079200;;${row.EXP_DATE}\r\n`;
                }
              
            }
            else
            {
                if(row.COUNTRY == 'FR')
                {
                    content += `VE;${row.DOC_DATE};${row.REF};${row.CUSTOMER};0;${row.TOTAL};${row.ACCOUNTING_CODE};4110000;;${row.EXP_DATE}\r\n`;
            
                    if(row.VAT > 0)
                    {
                        // KDV'siz tutar satırı  
                        content += `VE;${row.DOC_DATE};${row.REF};${row.CUSTOMER};${row.TOTALHT};0;;7070000;;${row.EXP_DATE}\r\n`;
                        
                        // KDV satırı
                        content += `VE;${row.DOC_DATE};${row.REF};${row.CUSTOMER};${row.VAT};0;;4457151;;${row.EXP_DATE}\r\n`;
                    }
                    else
                    {
                        // KDV'siz tutar satırı  
                        content += `VE;${row.DOC_DATE};${row.REF};${row.CUSTOMER};${row.TOTALHT};0;;7087000;;${row.EXP_DATE}\r\n`;
                    }
                }
                else if(row.COUNTRY == 'DE')
                {
                    content += `VE;${row.DOC_DATE};${row.REF};${row.CUSTOMER};0;${row.TOTAL};${row.ACCOUNTING_CODE};4110000;;${row.EXP_DATE}\r\n`;
            
                    // KDV'siz tutar satırı  
                    content += `VE;${row.DOC_DATE};${row.REF};${row.CUSTOMER};${row.TOTALHT};0;;7079120;;${row.EXP_DATE}\r\n`;
                }
                else if(row.COUNTRY == 'CH')
                {
                    content += `VE;${row.DOC_DATE};${row.REF};${row.CUSTOMER};0;${row.TOTAL};${row.ACCOUNTING_CODE};4110000;;${row.EXP_DATE}\r\n`;
            
                    // KDV'siz tutar satırı  
                    content += `VE;${row.DOC_DATE};${row.REF};${row.CUSTOMER};${row.TOTALHT};0;;7079200;;${row.EXP_DATE}\r\n`;
                }

            }
            // Ana satır
          
        }

        console.log(content)
        // ANSI formatında dosya oluştur
        let encoder = new TextEncoder('windows-1252');
        let ansiContent = encoder.encode(content);
        let blob = new Blob([ansiContent], {type: 'text/plain;charset=windows-1252'});
        let url = window.URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.href = url;
        a.download = 'Journaux_VE_' + moment(this.dtFirst.startDate).format('DD/MM/YYYY') + ' - ' + moment(this.dtFirst.endDate).format('DD/MM/YYYY') + '.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }
    async InvPrint()
    {
        let tmpLines = []
        App.instance.setState({isExecute:true})
        for (let i = 0; i < this.grdSlsIvcList.getSelectedData().length; i++) 
        {
            let tmpQuery = 
            {
                query: "SELECT *,ISNULL((SELECT TOP 1 PATH FROM LABEL_DESIGN WHERE TAG = @DESIGN),'') AS PATH FROM  [dbo].[FN_DOC_ITEMS_FOR_PRINT](@DOC_GUID,@LANG) ORDER BY DOC_DATE,LINE_NO " ,
                param:  ['DOC_GUID:string|50','DESIGN:string|25','LANG:string|10'],
                value:  [this.grdSlsIvcList.getSelectedData()[i].GUID,this.cmbDesignList.value,localStorage.getItem('lang').toUpperCase()]
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
        App.instance.setState({isExecute:false})
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
                                                id: 'ftr_02_002',
                                                text: this.t('menu'),
                                                path: 'invoices/documents/salesInvoice.js'
                                            })
                                        }
                                    }    
                                } />
                                <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnTxtfile" parent={this} icon="txtfile" type="default"
                                    onClick={async()=>
                                    {
                                      this.txtDownload()
                                    }}/>
                                </Item>
                                <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnPrint" parent={this} icon="print" type="default"
                                    onClick={async()=>
                                    {
                                        this.popDesign.show()
                                    }}/>
                                </Item>
                                <Item location="after" locateInMenu="auto">
                                    <NdButton id="detailslayout" parent={this} icon="detailslayout" type="default"
                                    onClick={async()=>
                                    {
                                        let tmpQuery = 
                                        {
                                            query : "SELECT *,ISNULL((SELECT TOP 1 PATH FROM LABEL_DESIGN WHERE TAG = @DESIGN),'') AS PATH " +
                                                    "FROM DOC_VW_01 " +
                                                    "WHERE ((INPUT_CODE = @INPUT_CODE) OR (@INPUT_CODE = '')) AND " + 
                                                    "((DOC_DATE >= @FIRST_DATE) OR (@FIRST_DATE = '19700101')) AND ((DOC_DATE <= @LAST_DATE) OR (@LAST_DATE = '19700101'))  " +
                                                    " AND TYPE = 1 AND DOC_TYPE = 20  AND REBATE = 0 ORDER BY DOC_DATE DESC,REF_NO DESC",
                                            param : ['INPUT_CODE:string|50','FIRST_DATE:date','LAST_DATE:date','DESIGN:string|25',],
                                            value : [this.txtCustomerCode.CODE,this.dtFirst.startDate,this.dtFirst.endDate,'115']
                                        }
                                        let tmpData = await this.core.sql.execute(tmpQuery)
                                        App.instance.setState({isExecute:true})
                                        this.core.socket.emit('devprint','{"TYPE":"REVIEW","PATH":"' + tmpData.result.recordset[0].PATH.replaceAll('\\','/') + '","DATA":' + JSON.stringify(tmpData.result.recordset) + '}',async(pResult) => 
                                        {
                                            App.instance.setState({isExecute:false})
                                            if(pResult.split('|')[0] != 'ERR')
                                            {
                                                var mywindow = window.open('printview.html','_blank',"width=900,height=1000,left=500");      
                                                mywindow.onload = function() 
                                                {
                                                    mywindow.document.getElementById("view").innerHTML="<iframe src='data:application/pdf;base64," + pResult.split('|')[1] + "' type='application/pdf' width='100%' height='100%'></iframe>"      
                                                } 
                                                // let mywindow = window.open('','_blank',"width=900,height=1000,left=500");
                                                // mywindow.document.write("<iframe src='data:application/pdf;base64," + pResult.split('|')[1] + "' type='application/pdf' default-src='self' width='100%' height='100%'></iframe>");
                                            }
                                        });
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
                                    <NbDateRange id={"dtFirst"} parent={this} startDate={moment(new Date())} endDate={moment(new Date())}/>
                                </Item>
                                {/* dtLast */}
                                <Item>
                               
                                </Item>
                                <Item>
                                <Label text={this.t("txtCustomerCode")} alignment="right" />
                                <NdTextBox id="txtCustomerCode" parent={this} simple={true}
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
                            
                        </div>
                        <div className="col-3">
                            <NdButton text={this.t("btnGet")} type="success" width="100%" onClick={this._btnGetClick}></NdButton>
                        </div>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <NdGrid id="grdSlsIvcList" parent={this} 
                            selection={{mode:"multiple"}} 
                            height={600}
                            showBorders={true}
                            filterRow={{visible:true}} 
                            headerFilter={{visible:true}}
                            columnAutoWidth={true}
                            allowColumnReordering={true}
                            allowColumnResizing={true}
                            onRowDblClick={async(e)=>
                            {
                                App.instance.menuClick(
                                {
                                    id: 'ftr_02_002',
                                    text: this.t('menu'),
                                    path: 'invoices/documents/salesInvoice.js',
                                    pagePrm:{GUID:e.data.GUID}
                                })
                            }}
                            >                            
                                {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Paging defaultPageSize={20} /> : <Paging enabled={false} />}
                                {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Pager visible={true} allowedPageSizes={[5,10,50]} showPageSizeSelector={true} /> : <Paging enabled={false} />}
                                {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Scrolling mode="standart" /> : <Scrolling mode="infinite" />}
                               <Export fileName={this.lang.t("menuOff.ftr_01_002")} enabled={true} allowExportSelectedData={true} />
                                <Column dataField="REF" caption={this.t("grdSlsIvcList.clmRef")} visible={true} width={200}/> 
                                <Column dataField="REF_NO" caption={this.t("grdSlsIvcList.clmRefNo")} visible={true} width={100}/> 
                                <Column dataField="INPUT_CODE" caption={this.t("grdSlsIvcList.clmInputCode")} visible={false}/> 
                                <Column dataField="INPUT_NAME" caption={this.t("grdSlsIvcList.clmInputName")} visible={true}/> 
                                <Column dataField="OUTPUT_NAME" caption={this.t("grdSlsIvcList.clmOutputName")} visible={false}/> 
                                <Column dataField="DOC_DATE" caption={this.t("grdSlsIvcList.clmDate")} visible={true} width={200} dataType="datetime" format={"dd/MM/yyyy"}/> 
                                <Column dataField="AMOUNT" caption={this.t("grdSlsIvcList.clmAmount")} visible={false} format={{ style: "currency", currency: Number.money.code,precision: 2}}/> 
                                <Column dataField="VAT" caption={this.t("grdSlsIvcList.clmVat")} visible={false} format={{ style: "currency", currency: Number.money.code,precision: 2}}/> 
                                <Column dataField="TOTAL" caption={this.t("grdSlsIvcList.clmTotal")} visible={true} format={{ style: "currency", currency: Number.money.code,precision: 2}}/>              
                                <Column dataField="MAIL" caption={this.t("grdSlsIvcList.clmMail")} visible={true} /> 
                            </NdGrid>
                        </div>
                    </div>
                    <div>
                        <NdPopUp parent={this} id={"popDesign"} 
                        visible={false}
                        showCloseButton={true}
                        showTitle={true}
                        title={this.t("popDesign.title")}
                        container={"#root"} 
                        width={'500'}
                        height={'180'}
                        position={{of:'#root'}}
                        onShowing={async()=>
                            {
                                let tmpLength = this.grdSlsIvcList.getSelectedData().length;
                                this.setState({tmpLength: tmpLength});                            
                                if(tmpLength <= 1)
                                {
                                    let tmpSource ={source:{select:{query : "SELECT TAG,DESIGN_NAME FROM [dbo].[LABEL_DESIGN] WHERE PAGE = '15'"},sql:this.core.sql}}
                                    await this.cmbDesignList.dataRefresh(tmpSource)
                                }
                                else
                                {
                                    let tmpSource = {source:{select:{query : "SELECT TAG,DESIGN_NAME FROM [dbo].[LABEL_DESIGN] WHERE PAGE = '115'"},sql:this.core.sql}}
                                    await this.cmbDesignList.dataRefresh(tmpSource)
                                }
                            }}
                        deferRendering={true}
                        >
                            <Form colCount={1} height={'fit-content'}>
                                <Item>
                                    <Label text={this.t("popDesign.design")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbDesignList" notRefresh = {true}
                                    displayExpr="DESIGN_NAME"                       
                                    valueExpr="TAG"
                                    value=""
                                    searchEnabled={true}
                                    >
                                        <Validator validationGroup={"frmPrintPop" + this.tabIndex}>
                                            <RequiredRule message={this.t("validDesign")} />
                                        </Validator> 
                                    </NdSelectBox>
                                </Item>
                                <Item>
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
                                            <NdButton text={this.lang.t("btnCancel")} type="normal" stylingMode="contained" width={'100%'}
                                            onClick={()=>
                                            {
                                                this.popDesign.hide();  
                                            }}/>
                                        </div>
                                    </div>
                                </Item>
                            </Form>
                        </NdPopUp>
                    </div>
                </ScrollView>
            </div>
        )
    }
}