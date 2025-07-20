import React from 'react';
import App from '../../../lib/app.js';
import moment from 'moment';

import Toolbar,{Item} from 'devextreme-react/toolbar';
import ScrollView from 'devextreme-react/scroll-view';

import NdGrid,{Column, ColumnChooser,Paging,Pager,Scrolling,Export,StateStoring} from '../../../../core/react/devex/grid.js';
import NdTextBox from '../../../../core/react/devex/textbox.js'
import NdSelectBox from '../../../../core/react/devex/selectbox.js';
import NdPopGrid from '../../../../core/react/devex/popgrid.js';
import NdButton from '../../../../core/react/devex/button.js';
import NbDateRange from '../../../../core/react/bootstrap/daterange.js';
import { dialog } from '../../../../core/react/devex/dialog.js';
import NdPopUp from '../../../../core/react/devex/popup.js';
import { NdForm,NdItem,NdLabel} from '../../../../core/react/devex/form.js';

export default class InvoicesAndCollectionReport extends React.PureComponent
{
    constructor(props)
    {
        super(props)

        this.core = App.instance.core;
        
        this.loadState = this.loadState.bind(this)
        this.saveState = this.saveState.bind(this)
        this.btnGetirClick = this.btnGetirClick.bind(this)
        this.tabIndex = props.data.tabkey
    }
    componentDidMount()
    {
        setTimeout(async () => 
        {
            this.txtCustomerCode.GUID = '00000000-0000-0000-0000-000000000000'
        }, 500);
    }
    loadState() 
    {
        let tmpLoad = this.access.filter({ELEMENT:'grdListesState',USERS:this.user.CODE})
        return tmpLoad.getValue()
    }
    saveState(e)
    {
        let tmpSave = this.access.filter({ELEMENT:'grdListesState',USERS:this.user.CODE, PAGE:this.props.data.id, APP:"OFF"})
        tmpSave.setValue(e)
        tmpSave.save()
    }

    async btnGetirClick()
    {
        let tmpSource =
        {
            source : 
            {
                groupBy : this.groupList,
                select : 
                {
                    query : 
                        `SELECT
                        CASE WHEN TYPE = 0
                            THEN OUTPUT_NAME
                            WHEN TYPE = 1
                            THEN INPUT_NAME END AS CUSTOMER_NAME,
                        CASE WHEN TYPE = 0
                            THEN OUTPUT_CODE
                            WHEN TYPE = 1
                            THEN INPUT_CODE END AS CUSTOMER_CODE,
                        DOC_DATE,
                        REF,
                        REF_NO,
                        (SELECT TOP 1 VALUE FROM DB_LANGUAGE WHERE TAG = (SELECT [dbo].[FN_DOC_CUSTOMER_TYPE_NAME](TYPE,DOC_TYPE,REBATE,PAY_TYPE)) AND LANG = @LANG) AS TYPE_NAME,
                        CASE TYPE WHEN 0 THEN (AMOUNT * -1) ELSE AMOUNT END AS DEBIT,
                        CASE TYPE WHEN 1 THEN AMOUNT ELSE 0 END AS RECEIVE,
                        CASE TYPE WHEN 0 THEN (AMOUNT * -1) WHEN 1 THEN AMOUNT END AS BALANCE
                        FROM DOC_CUSTOMER_VW_01
                        WHERE ((INPUT = @CUSTOMER OR OUTPUT = @CUSTOMER) OR (@CUSTOMER = '00000000-0000-0000-0000-000000000000')) AND TYPE IN (0,1)
                        AND DOC_DATE >= @FIRST_DATE AND DOC_DATE <= @LAST_DATE
                        ORDER BY DOC_DATE ASC`,
                    param : ['CUSTOMER:string|50','LANG:string|10','FIRST_DATE:date','LAST_DATE:date'],
                    value : [this.txtCustomerCode.GUID,localStorage.getItem('lang'),this.dtDate.startDate,this.dtDate.endDate]
                },
                sql : this.core.sql
            }
        }
        App.instance.setState({isExecute:true})
        await this.grdListe.dataRefresh(tmpSource)
        App.instance.setState({isExecute:false})

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
                                    <NdButton id="btnPrint" parent={this} icon="print" type="default"
                                    onClick={async()=> { this.popDesign.show() }}/>
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
                            <NdForm colCount={3} id="frmKriter">
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
                                                this.txtCustomerCode.GUID = data[0].GUID
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
                                                            this.txtCustomerCode.GUID = data[0].GUID
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
                                                    this.txtCustomerCode.GUID = '00000000-0000-0000-0000-000000000000'
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
                                                query : `SELECT GUID,CODE,TITLE,NAME,LAST_NAME,[TYPE_NAME],[GENUS_NAME],(SELECT [dbo].[FN_CUSTOMER_BALANCE](GUID,dbo.GETDATE())) AS BALANCE FROM CUSTOMER_VW_03 WHERE UPPER(CODE) LIKE UPPER(@VAL) OR UPPER(TITLE) LIKE UPPER(@VAL)`,
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
                                        <Column dataField="BALANCE" caption={this.t("pg_txtCustomerCode.clmBalance")} format={{ style: "currency", currency: Number.money.code,precision: 2}} visible={true} defaultSortOrder="desc"/> 
                                    </NdPopGrid>
                                </NdItem> 
                                <NdItem>
                                    <NdLabel text={this.t("dtDate")} alignment="right" />
                                    <NbDateRange id={"dtDate"} parent={this} startDate={moment().startOf('year')} endDate={moment().endOf('year')}/>
                                </NdItem>
                            </NdForm>
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
                            <NdButton text={this.t("btnGet")} type="success" width="100%" onClick={this.btnGetirClick}/>
                        </div>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <NdGrid id="grdListe" parent={this} 
                            selection={{mode:"multiple"}} 
                            showBorders={true}
                            filterRow={{visible:true}} 
                            headerFilter={{visible:true}}
                            height={'690'} 
                            width={'100%'}
                            columnAutoWidth={true}
                            allowColumnReordering={true}
                            allowColumnResizing={true}
                            loadPanel={{enabled:true}}
                            >                            
                                {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Paging defaultPageSize={20} /> : <Paging enabled={false} />}
                                {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Pager visible={true} allowedPageSizes={[5,10,50]} showPageSizeSelector={true} /> : <Paging enabled={false} />}
                                {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Scrolling mode="standart" /> : <Scrolling mode="virtual" />}
                                <StateStoring enabled={true} type="custom" customLoad={this.loadState} customSave={this.saveState} storageKey={this.props.data.id + "_grdSlsInv"}/>
                                <ColumnChooser enabled={true} />
                                <Export fileName={this.lang.t("menuOff.cri_04_001")} enabled={true} allowExportSelectedData={true} />
                                <Column dataField="CUSTOMER_CODE" caption={this.t("grdListe.clmCustomerCode")} visible={true} width={150}/> 
                                <Column dataField="CUSTOMER_NAME" caption={this.t("grdListe.clmCustomerName")} visible={true} width={300}/> 
                                <Column dataField="DOC_DATE" caption={this.t("grdListe.clmDocDate")} visible={true} dataType="date" width={100}
                                editorOptions={{value:null}}
                                cellRender={(e) => 
                                {
                                    if(moment(e.value).format("YYYY-MM-DD") != '1970-01-01')
                                    {
                                        return e.text
                                    }
                                    
                                    return
                                }}/>
                                <Column dataField="TYPE_NAME" caption={this.t("grdListe.clmTypeName")} visible={true} width={150}/> 
                                <Column dataField="REF" caption={this.t("grdListe.clmRef")} visible={true} width={100}/> 
                                <Column dataField="REF_NO" caption={this.t("grdListe.clmRefNo")} visible={true} width={100}/> 
                                <Column dataField="DEBIT" caption={this.t("grdListe.clmAmount")} format={{ style: "currency", currency: Number.money.code,precision: 2}} visible={true}/> 
                            </NdGrid>
                        </div>
                    </div>
                </ScrollView>
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
                                data={{source:{select:{query : `SELECT TAG,DESIGN_NAME FROM [dbo].[LABEL_DESIGN] WHERE PAGE = '1400'`},sql:this.core.sql}}}
                                >
                                </NdSelectBox>
                            </NdItem>
                            <NdItem>
                                <div className='row'>
                                    <div className='col-6'>
                                        <NdButton text={this.lang.t("btnPrint")} type="normal" stylingMode="contained" width={'100%'} validationGroup={"frmPrintPop" + this.tabIndex}
                                        onClick={async (e)=>
                                        {       
                                          
                                                let tmpQuery = 
                                                {
                                                    query : 
                                                        `SELECT
                                                        CASE WHEN TYPE = 0
                                                            THEN OUTPUT_NAME
                                                            WHEN TYPE = 1
                                                            THEN INPUT_NAME END AS CUSTOMER_NAME,
                                                        CASE WHEN TYPE = 0
                                                            THEN OUTPUT_CODE
                                                            WHEN TYPE = 1
                                                            THEN INPUT_CODE END AS CUSTOMER_CODE,
                                                        DOC_DATE,
                                                        REF,
                                                        REF_NO,
                                                        CASE WHEN TYPE = 0
                                                            THEN INPUT_NAME
                                                            WHEN TYPE = 1
                                                            THEN OUTPUT_NAME END AS ACCOUNT_NAME,
                                                        (SELECT TOP 1 VALUE FROM DB_LANGUAGE WHERE TAG = (SELECT [dbo].[FN_DOC_CUSTOMER_TYPE_NAME](TYPE,DOC_TYPE,REBATE,PAY_TYPE)) AND LANG = @LANG) AS TYPE_NAME,
                                                        CASE TYPE WHEN 0 THEN (AMOUNT * -1) ELSE AMOUNT END AS DEBIT,
                                                        CASE TYPE WHEN 1 THEN AMOUNT ELSE 0 END AS RECEIVE,
                                                        CASE TYPE WHEN 0 THEN (AMOUNT * -1) WHEN 1 THEN AMOUNT END AS BALANCE,
                                                        ISNULL((SELECT TOP 1 PATH FROM LABEL_DESIGN WHERE TAG = @DESIGN),'') AS PATH
                                                        FROM DOC_CUSTOMER_VW_01
                                                        WHERE ((INPUT = @CUSTOMER OR OUTPUT = @CUSTOMER) OR (@CUSTOMER = '00000000-0000-0000-0000-000000000000')) AND TYPE IN (0,1)
                                                        AND DOC_DATE >= @FIRST_DATE AND DOC_DATE <= @LAST_DATE
                                                        ORDER BY DOC_DATE ASC`,
                                                    param : ['CUSTOMER:string|50','LANG:string|10','FIRST_DATE:date','LAST_DATE:date','DESIGN:string|25'],
                                                    value : [this.txtCustomerCode.GUID,localStorage.getItem('lang'),this.dtDate.startDate,this.dtDate.endDate,this.cmbDesignList.value]
                                                }
                                                let tmpData = await this.core.sql.execute(tmpQuery)

                                                App.instance.setState({isExecute:true})

                                                if(tmpData.result.recordset.length > 0)
                                                {
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
                                                }
                                                this.popDesign.hide();  
                                        }}/>
                                    </div>
                                    <div className='col-6'>
                                        <NdButton text={this.lang.t("btnCancel")} type="normal" stylingMode="contained" width={'100%'}
                                        onClick={()=> { this.popDesign.hide() }}/>
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