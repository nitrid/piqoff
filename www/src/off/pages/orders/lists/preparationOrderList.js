import React from 'react';
import App from '../../../lib/app.js';
import moment from 'moment';
import { docCls,docItemsCls,docCustomerCls,docExtraCls,deptCreditMatchingCls} from '../../../../core/cls/doc.js';

import Toolbar from 'devextreme-react/toolbar';
import Form, { Label,Item } from 'devextreme-react/form';
import ScrollView from 'devextreme-react/scroll-view';

import NdGrid,{Column,Editing,Button,Paging,Pager,Export,Summary,TotalItem,Scrolling,StateStoring,ColumnChooser} from '../../../../core/react/devex/grid.js';
import NdTextBox, { Validator, RequiredRule } from '../../../../core/react/devex/textbox.js'
import NdSelectBox from '../../../../core/react/devex/selectbox.js';
import NdButton from '../../../../core/react/devex/button.js';
import NdDatePicker from '../../../../core/react/devex/datepicker.js';
import NdPopGrid from '../../../../core/react/devex/popgrid.js';
import NdCheckBox from '../../../../core/react/devex/checkbox.js';

import NdPopUp from '../../../../core/react/devex/popup.js';
import { dialog } from '../../../../core/react/devex/dialog.js';
import {NdForm,NdItem,NdLabel,NdEmptyItem} from '../../../../core/react/devex/form.js';


export default class salesOrdList extends React.PureComponent
{
    constructor(props)
    {
        super(props)

      
        this.printGuid = ''
        
        this.core = App.instance.core;
        
        this.groupList = [];
        this.btnGetClick = this.btnGetClick.bind(this)
        this.btnGrdPrint = this.btnGrdPrint.bind(this)
        this.loadState = this.loadState.bind(this)
        this.saveState = this.saveState.bind(this)
    }
    componentDidMount()
    {
        setTimeout(async () => 
        {
            this.Init()
        }, 1000);
    }
    async loadState()
    {
        let tmpLoad = await this.access.filter({ELEMENT:'grdSlsOrdListState',USERS:this.user.CODE})
        return tmpLoad.getValue()
    }
    async saveState(e)
    {
        let tmpSave = await this.access.filter({ELEMENT:'grdSlsOrdListState',USERS:this.user.CODE,PAGE:this.props.data.id,APP:"OFF"})
        await tmpSave.setValue(e)
        await tmpSave.save()
    }
    async Init()
    {
        this.dtFirst.value=moment(new Date()).format("YYYY-MM-DD");
        this.dtLast.value=moment(new Date()).format("YYYY-MM-DD");
        this.txtCustomerCode.CODE = ''
    }
    async btnGetClick()
    {
        let tmpQuery = 
        {
            query : `SELECT * FROM (SELECT DOC_GUID AS GUID,   
            REF,   
            REF_NO,   
            REF + '-' + CONVERT(NVARCHAR,REF_NO) AS PRINT_REF,   
            DOC_DATE,   
            OUTPUT_NAME,   
            OUTPUT_CODE,   
            INPUT_CODE,   
            INPUT_NAME,   
            '' AS STATUS,   
            1 AS PALET,  
            1 AS BOX,  
            SUM(TOTAL) as TOTAL,   
            SUM(VAT) as VAT,   
            SUM(TOTALHT) as TOTALHT,  
            SUM(APPROVED_QUANTITY) as APPROVED_QUANTITY,  
            MAX(CLOSED) as CLOSED,  
            CASE WHEN SUM(APPROVED_QUANTITY) = 0 THEN SUM(PEND_QUANTITY) ELSE SUM(APPROVED_QUANTITY - COMP_QUANTITY) END AS PEND_QUANTITY,  
            CASE WHEN (SELECT TOP 1 TAG FROM DOC_EXTRA WHERE DOC_EXTRA.DOC = DOC_ORDERS_VW_01.DOC_GUID) IS NULL THEN 'X' ELSE 'OK' END as PRINTED, 
            (SELECT TOP 1 MAIN_GROUP_NAME FROM CUSTOMER_VW_01 WHERE CUSTOMER_VW_01.GUID = DOC_ORDERS_VW_01.INPUT) AS MAIN_GROUP_NAME,  
            (SELECT TOP 1 MAIN_GROUP_CODE FROM CUSTOMER_VW_01 WHERE CUSTOMER_VW_01.GUID = DOC_ORDERS_VW_01.INPUT) AS MAIN_GROUP_CODE,  
            (SELECT TOP 1 ZIPCODE + ' ' + CITY + ' ' + COUNTRY_NAME FROM CUSTOMER_ADRESS_VW_01 WHERE CUSTOMER_ADRESS_VW_01.CUSTOMER = DOC_ORDERS_VW_01.INPUT AND TYPE = 0) AS ADDRESS  
            FROM DOC_ORDERS_VW_01   
            WHERE  ((INPUT_CODE = @INPUT_CODE) OR (@INPUT_CODE = '')) AND    
            ((DOC_DATE >= @FIRST_DATE) OR (@FIRST_DATE = '19700101')) AND ((DOC_DATE <= @LAST_DATE) OR (@LAST_DATE = '19700101'))   
            AND TYPE = 1 AND APPROVED_QUANTITY > 0    
            GROUP BY DOC_GUID,REF,REF_NO,DOC_DATE,OUTPUT_NAME,OUTPUT_CODE,INPUT_NAME,INPUT_CODE,INPUT   
            ) AS TMP WHERE (( MAIN_GROUP_CODE = @MAIN_GROUP_CODE) OR (@MAIN_GROUP_CODE = ''))
            ORDER BY DOC_DATE DESC,REF_NO DESC   `,
            param : ['INPUT_CODE:string|50','FIRST_DATE:date','LAST_DATE:date','MAIN_GROUP_CODE:string|50'],
            value : [this.txtCustomerCode.CODE,this.dtFirst.value,this.dtLast.value,this.cmbMainGrp.value]
        }
        
        let tmpData = await this.core.sql.execute(tmpQuery)
        let tmpSource = tmpData.result.recordset    
        for (let i = 0; i < tmpSource.length; i++)
        {
            let tmpQuery = 
            {
                query : `SELECT  SUM(DO.APPROVED_QUANTITY / ISNULL(IU.FACTOR, 1)) AS COLIS FROM  
                        DOC_ORDERS_VW_01 DO 
                        LEFT JOIN  
                        ITEM_UNIT_VW_01 IU 
                        ON  
                        IU.ITEM_GUID = DO.ITEM AND IU.ID = '003' WHERE DO.DOC_GUID = @DOC_GUID `,
                param : ['DOC_GUID:string|50'],
                value : [tmpSource[i].GUID]
            }
            
            let tmpData = await this.core.sql.execute(tmpQuery)
            
            if(tmpData.result.recordset.length > 0)
            {
                tmpSource[i].COLIS = tmpData.result.recordset[0].COLIS
            }
            
            if(tmpSource[i].APPROVED_QUANTITY == tmpSource[i].PEND_QUANTITY)
            {
                tmpSource[i].STATUS = this.t("statusType.grey")
            }
            else if(tmpSource[i].CLOSED == 1)
            {
                tmpSource[i].STATUS = this.t("statusType.yellow")
            }
            else if(tmpSource[i].PEND_QUANTITY == 0)
            {
                tmpSource[i].STATUS = this.t("statusType.green")
            }
            else
            {
                tmpSource[i].STATUS = this.t("statusType.blue")
            }   
        }
               
        App.instance.loading.show()
        await this.grdSlsOrdList.dataRefresh({source:tmpSource})
        App.instance.loading.hide()
    }
    async btnGrdPrintControl(e)
    {
        let docExtra = new docExtraCls();
        
        docExtra.addEmpty({
            GUID: e,
            CUSER: this.user.CODE,
            TAG: 'PRINT',
            DOC: e,
            DESCRIPTION: '',
            SIGNATURE: '',
            SIGNATURE_SUM: ''
        });
        
        docExtra.save();
        
        this.grdSlsOrdList.dataRefresh()
        this.btnGetClick()
    }
    async btnGrdPrint(e)
    {
        this.printGuid = e.row.data.GUID
        this.popDesign.show() 
    }
    async printOrders()
    {
        let tmpLines = []
        for (let i = 0; i < this.grdSlsOrdList.getSelectedData().length; i++) 
        {
            let tmpPrintQuery = 
            {
                query: `SELECT *,ISNULL((SELECT TOP 1 PATH FROM LABEL_DESIGN WHERE TAG = @DESIGN),'') AS PATH FROM  [dbo].[FN_DOC_ORDERS_FOR_PRINT](@DOC_GUID) WHERE APPROVED_QUANTITY > 0 ORDER BY LINE_NO ` ,
                param:  ['DOC_GUID:string|50','DESIGN:string|25','LANG:string|10'],
                value:  [this.grdSlsOrdList.getSelectedData()[i].GUID,this.cmbAllDesignList.value,'']
            }
        
            let tmpData = await this.core.sql.execute(tmpPrintQuery) 
        
            for (let x = 0; x < tmpData.result.recordset.length; x++) 
            {
                tmpLines.push(tmpData.result.recordset[x])
            }
            
            this.btnGrdPrintControl(this.grdSlsOrdList.getSelectedData()[i].GUID)
        }
        this.core.socket.emit('devprint','{"TYPE":"REVIEW","PATH":"' + tmpLines[0].PATH.replaceAll('\\','/') + '","DATA":' + JSON.stringify(tmpLines) + '}',(pResult) => 
        {
            var mywindow = window.open('printview.html','_blank',"width=900,height=1000,left=500");                                                         

            mywindow.onload = function() 
            {
                mywindow.document.getElementById("view").innerHTML="<iframe src='data:application/pdf;base64," + pResult.split('|')[1] + "' type='application/pdf' width='100%' height='100%'></iframe>"      
            } 
        });
        let tmpDesign = 'pallet_etiket.repx'
        this.core.socket.emit('devprint','{"TYPE":"REVIEW","PATH":"' + tmpDesign.replaceAll('\\','/') + '","DATA":' + JSON.stringify(this.grdSlsOrdList.getSelectedData()) + '}',(pResult) => 
        {
            var mywindow = window.open('printview.html','_blank',"width=900,height=1000,left=500");                                                         

            mywindow.onload = function() 
            {
                mywindow.document.getElementById("view").innerHTML="<iframe src='data:application/pdf;base64," + pResult.split('|')[1] + "' type='application/pdf' width='100%' height='100%'></iframe>"      
            } 
        });
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
                            <Form colCount={2} id="frmCriter">
                                {/* dtFirst */}
                                <Item>
                                    <Label text={this.t("dtFirst")} alignment="right" />
                                    <NdDatePicker simple={true}  parent={this} id={"dtFirst"}
                                    />
                                </Item>
                                {/* dtLast */}
                                <Item>
                                    <Label text={this.t("dtLast")} alignment="right" />
                                    <NdDatePicker simple={true}  parent={this} id={"dtLast"}
                                    />
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
                                >
                                </NdTextBox>
                                {/*CARI SECIMI POPUP */}
                                <NdPopGrid id={"pg_txtCustomerCode"} parent={this} container={"#" + this.props.data.id + this.props.data.tabkey}
                                visible={false}
                                position={{of:'#' + this.props.data.id + this.props.data.tabkey}} 
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
                                            query : `SELECT GUID,CODE,TITLE,NAME,LAST_NAME,[TYPE_NAME],[GENUS_NAME] FROM CUSTOMER_VW_01 WHERE (UPPER(CODE) LIKE UPPER(@VAL) OR UPPER(TITLE) LIKE UPPER(@VAL)) AND STATUS = 1`,
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
                                <Item>
                                    <Label text={this.t("cmbMainGrp")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbMainGrp" showClearButton={true} notRefresh={true}  searchEnabled={true}
                                    displayExpr="NAME"                       
                                    valueExpr="CODE"
                                    data={{source: {select : {query:`SELECT CODE,NAME FROM CUSTOMER_GROUP ORDER BY NAME ASC`},sql : this.core.sql}}}
                                    />
                                </Item>
                            </Form>
                        </div>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-3">
                          
                        </div>
                        <div className="col-3">
                            
                        </div>
                        <div className="col-3">
                          
                        </div>
                        <div className="col-3">
                            <NdButton text={this.t("btnGet")} type="success" width="100%" onClick={this.btnGetClick}></NdButton>
                        </div>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <NdGrid id="grdSlsOrdList" parent={this} 
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
                                    id: 'sip_02_002',
                                    text: this.t('menu'),
                                    path: 'orders/documents/salesOrder.js',
                                    pagePrm:{GUID:e.data.GUID}
                                })
                            }}
                            onCellPrepared={(e) =>
                            {
                                if(e.rowType === "data" && e.column.dataField === "STATUS" )
                                {
                                    if(e.data.APPROVED_QUANTITY == e.data.PEND_QUANTITY)
                                    {
                                        e.cellElement.style.color ="grey"
                                        e.cellElement.style.fontWeight ="bold"
                                    }
                                    else if(e.data.CLOSED == 1)
                                    {
                                        e.cellElement.style.color ="yellow"
                                        e.cellElement.style.fontWeight ="bold"
                                    }
                                    else if(e.data.PEND_QUANTITY == 0)
                                    {
                                        e.cellElement.style.color ="green"
                                        e.cellElement.style.fontWeight ="bold"
                                    }
                                    else
                                    {
                                        e.cellElement.style.color ="blue" 
                                        e.cellElement.style.fontWeight ="bold"
                                    }
                                }
                            }}
                            >
                                {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Paging defaultPageSize={20} /> : <Paging enabled={false} />}
                                {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Pager visible={true} allowedPageSizes={[5,10,50]} showPageSizeSelector={true} /> : <Paging enabled={false} />}
                                {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Scrolling mode="standart" /> : <Scrolling mode="infinite" />}
                                <StateStoring enabled={true} type="custom" customLoad={this.loadState} customSave={this.saveState} storageKey={this.props.data.id + "_grdSlsOrdList"}/>
                                <ColumnChooser enabled={true}/>
                                <Export fileName={this.lang.t("menuOff.sip_01_002")} enabled={true} allowExportSelectedData={true} />
                                <Editing mode="cell" allowUpdating={true} allowDeleting={false} confirmDelete={false}/>
                                <Column dataField="REF" caption={this.t("grdSlsOrdList.clmRef")} visible={true} width={170} allowEditing={false}/> 
                                <Column dataField="REF_NO" caption={this.t("grdSlsOrdList.clmRefNo")} visible={true} width={100} allowEditing={false}/> 
                                <Column dataField="INPUT_NAME" caption={this.t("grdSlsOrdList.clmInputName")} visible={true} allowEditing={false}/>
                                <Column dataField="MAIN_GROUP_NAME" caption={this.t("grdSlsOrdList.clmMainGroup")} width={200} visible={true} allowEditing={false}/> 
                                <Column dataField="DOC_DATE" caption={this.t("grdSlsOrdList.clmDate")} visible={true} width={200} dataType="datetime" format={"dd/MM/yyyy"} allowEditing={false}/>
                                <Column dataField="TOTALHT" caption={this.t("grdSlsOrdList.clmAmount")} visible={true} width={120} format={{ style: "currency", currency: Number.money.code,precision: 2}} allowEditing={false}/> 
                                <Column dataField="VAT" caption={this.t("grdSlsOrdList.clmVat")} visible={false} width={120} format={{ style: "currency", currency: Number.money.code,precision: 2}} allowEditing={false}/> 
                                <Column dataField="TOTAL" caption={this.t("grdSlsOrdList.clmTotal")} visible={true} width={120} format={{ style: "currency", currency: Number.money.code,precision: 2}} allowEditing={false}/>              
                                <Column dataField="COLIS" caption={this.t("grdSlsOrdList.clmColis")} visible={true} width={80} allowEditing={false}/>
                                <Column dataField="PALET" caption={this.t("grdSlsOrdList.clmPalet")} visible={true} width={80}/>
                                <Column dataField="BOX" caption={this.t("grdSlsOrdList.clmBox")} visible={true} width={80}/>
                                <Column dataField="STATUS" caption={this.t("grdSlsOrdList.clmStatus")} visible={true} width={130} allowEditing={false}/>
                                <Column dataField="PRINTED" caption={this.t("grdSlsOrdList.clmPrinted")} visible={true} width={80} allowEditing={false}/>
                                <Column type="buttons" width={70}>
                                    <Button hint="Clone" icon="print" onClick={this.btnGrdPrint} />
                                </Column>
                                <Summary>
                                    <TotalItem
                                    column="TOTALHT"
                                    summaryType="sum"
                                    valueFormat={{ style: "currency", currency: Number.money.code,precision: 2}} />
                                      <TotalItem
                                    column="VAT"
                                    summaryType="sum"
                                    valueFormat={{ style: "currency", currency: Number.money.code,precision: 2}} />
                                    <TotalItem
                                    column="TOTAL"
                                    summaryType="sum"
                                    valueFormat={{ style: "currency", currency: Number.money.code,precision: 2}} />
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
                        container={"#" + this.props.data.id + this.props.data.tabkey} 
                        width={'500'}
                        height={'auto'}
                        position={{of:'#' + this.props.data.id + this.props.data.tabkey}}
                        >
                            <NdForm colCount={1} height={'fit-content'}>
                                <NdItem>
                                    <NdLabel text={this.t("popDesign.design")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbDesignList" notRefresh = {true}
                                    displayExpr="DESIGN_NAME"                       
                                    valueExpr="TAG"
                                    value=""
                                    searchEnabled={true}
                                    data={{source:{select:{query : `SELECT TAG,DESIGN_NAME FROM [dbo].[LABEL_DESIGN] WHERE PAGE = '111'`},sql:this.core.sql}}}
                                    param={this.param.filter({ELEMENT:'cmbDesignList',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'cmbDesignList',USERS:this.user.CODE})}
                                    >
                                        <Validator validationGroup={"frmSlsOrderMail" + this.tabIndex}>
                                            <RequiredRule message={this.t("validDesign")} />
                                        </Validator> 
                                    </NdSelectBox>
                                </NdItem>
                                <NdItem>
                                <NdLabel text={this.t("popDesign.lang")} alignment="right" />
                                <NdSelectBox simple={true} parent={this} id="cmbDesignLang" notRefresh = {true}
                                    displayExpr="VALUE"                       
                                    valueExpr="ID"
                                    value={localStorage.getItem('lang').toUpperCase()}
                                    searchEnabled={true}
                                   data={{source:[{ID:"FR",VALUE:"FR"},{ID:"DE",VALUE:"DE"},{ID:"TR",VALUE:"TR"}]}}
                                    />
                                </NdItem>
                                <NdItem>
                                    <div className='row'>
                                        <div className='col-6'>
                                            <NdButton text={this.lang.t("btnPrint")} type="normal" stylingMode="contained" width={'100%'} validationGroup={"frmSlsOrderMail" + this.tabIndex}
                                            onClick={async (e)=>
                                            {       
                                                if(e.validationGroup.validate().status == "valid")
                                                {
                                                    let tmpQuery = 
                                                    {
                                                        query: `SELECT *,ISNULL((SELECT TOP 1 PATH FROM LABEL_DESIGN WHERE TAG = @DESIGN),'') AS PATH FROM  [dbo].[FN_DOC_ORDERS_FOR_PRINT](@DOC_GUID) ORDER BY LINE_NO ` ,
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
                                                        this.btnGrdPrintControl(this.printGuid)
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
                                                        query: `SELECT *,ISNULL((SELECT TOP 1 PATH FROM LABEL_DESIGN WHERE TAG = @DESIGN),'') AS PATH FROM  [dbo].[FN_DOC_ORDERS_FOR_PRINT](@DOC_GUID) ORDER BY LINE_NO ` ,
                                                        param:  ['DOC_GUID:string|50','DESIGN:string|25','LANG:string|10'],
                                                        value:  [this.printGuid,this.cmbDesignList.value]
                                                    }

                                                    App.instance.loading.show()
                                                    let tmpData = await this.core.sql.execute(tmpQuery) 
                                                    App.instance.loading.hide()

                                                    this.core.socket.emit('devprint','{"TYPE":"REVIEW","PATH":"' + tmpData.result.recordset[0].PATH.replaceAll('\\','/') + '","DATA":' + JSON.stringify(tmpData.result.recordset) + '}',(pResult) => 
                                                    {
                                                        if(pResult.split('|')[0] != 'ERR')
                                                        {
                                                            var mywindow = window.open('printview.html','_blank',"width=900,height=1000,left=500");      
                                                            mywindow.onload = function() 
                                                            { 
                                                                mywindow.document.getElementById("view").innerHTML="<iframe src='data:application/pdf;base64," + pResult.split('|')[1] + "' type='application/pdf' width='100%' height='100%'></iframe>"      
                                                            } 
                                                            this.btnGrdPrintControl(this.printGuid)
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
                                </NdItem>
                            </NdForm>
                        </NdPopUp>
                    </div>  
                      {/* Dizayn Seçim PopUp */}
                      <div>
                        <NdPopUp parent={this} id={"popAllDesign"} 
                        visible={false}
                        showCloseButton={true}
                        showTitle={true}
                        title={this.t("popDesign.title")}
                        container={"#" + this.props.data.id + this.props.data.tabkey} 
                        width={'500'}
                        height={'auto'}
                        position={{of:'#' + this.props.data.id + this.props.data.tabkey}}
                        >
                            <NdForm colCount={1} height={'fit-content'}>
                                <NdItem>
                                    <NdLabel text={this.t("popDesign.design")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbAllDesignList" notRefresh = {true}
                                    displayExpr="DESIGN_NAME"                       
                                    valueExpr="TAG"
                                    value=""
                                    searchEnabled={true}
                                    data={{source:{select:{query : `SELECT TAG,DESIGN_NAME FROM [dbo].[LABEL_DESIGN] WHERE PAGE = '11'`},sql:this.core.sql}}}
                                    />
                                </NdItem>
                                <NdItem>
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
                                </NdItem>
                            </NdForm>
                        </NdPopUp>
                    </div>  
            </div>
        )
    }
}