import React from 'react';
import App from '../../../lib/app.js';
import moment from 'moment';
import Toolbar,{Item} from 'devextreme-react/toolbar';
import Form from 'devextreme-react/form';
import ScrollView from 'devextreme-react/scroll-view';
import NdGrid,{Column, Scrolling,Editing} from '../../../../core/react/devex/grid.js';
import NdButton from '../../../../core/react/devex/button.js';
import NdDatePicker from '../../../../core/react/devex/datepicker.js';
import NdPopGrid from '../../../../core/react/devex/popgrid.js';
import { dialog } from '../../../../core/react/devex/dialog.js';
import NdPopUp from '../../../../core/react/devex/popup.js';
import NdTextBox from '../../../../core/react/devex/textbox.js';
import NdCollectionGrid, { groupCollection } from '../../../../core/react/devex/collectiongrid.js';
import { NdForm,NdItem,NdLabel} from '../../../../core/react/devex/form.js';

export default class collectionReport extends React.PureComponent
{
    constructor(props)
    {
        super(props)
        
        this.core = App.instance.core;
        this.state = {
            expandedRowKeys: []
        }
        this.tabIndex = props.data.tabkey
    }
    async componentDidMount()
    {
        await this.core.util.waitUntil(0)
        this.init()
    }
    async init()
    {
        this.dtFirst.value=moment(new Date()).format("YYYY-MM-DD");
        this.dtLast.value=moment(new Date()).format("YYYY-MM-DD");
        this.txtCustomerCode.CODE = ''
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
                            <NdForm colCount={2} id="frmCriter">
                                {/* dtFirst */}
                                <NdItem>
                                    <NdLabel text={this.t("dtFirst")} alignment="right" />
                                    <NdDatePicker simple={true}  parent={this} id={"dtFirst"}>
                                    </NdDatePicker>
                                </NdItem>
                                {/* dtLast */}
                                <NdItem>
                                    <NdLabel text={this.t("dtLast")} alignment="right" />
                                    <NdDatePicker simple={true}  parent={this} id={"dtLast"}>
                                    </NdDatePicker>
                                </NdItem>
                                <NdItem>
                                    <NdLabel text={this.t("txtCustomerCode")} alignment="right" />
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
                                            query : "SELECT GUID,CODE,TITLE,NAME,LAST_NAME,[TYPE_NAME],[GENUS_NAME] FROM CUSTOMER_VW_03 WHERE (UPPER(CODE) LIKE UPPER(@VAL) OR UPPER(TITLE) LIKE UPPER(@VAL)) AND STATUS = 1",
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
                                            console.log(11)
                                        }
                                        }
                                    }
                                    >
                                        <Column dataField="CODE" caption={this.t("pg_txtCustomerCode.clmCode")} width={150} />
                                        <Column dataField="TITLE" caption={this.t("pg_txtCustomerCode.clmTitle")} width={500} defaultSortOrder="asc" />
                                        <Column dataField="TYPE_NAME" caption={this.t("pg_txtCustomerCode.clmTypeName")} width={150} />
                                        <Column dataField="GENUS_NAME" caption={this.t("pg_txtCustomerCode.clmGenusName")} width={150}/>
                                    
                                    </NdPopGrid>
                                </NdItem>
                            </NdForm>
                        </div>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <NdButton text={this.lang.t("btnGet")} type="default" stylingMode="contained" width={'100%'}
                            onClick={async (e)=>
                            {
                                let tmpQuery = 
                                {
                                    query :"SELECT " +
                                            "FACT.DOC_DATE AS FACT_DATE," +
                                            "FACT.REF  AS FACT_REF," +
                                            "FACT.REF_NO AS FACT_REF_NO," +
                                            "FACT.PAY_TYPE AS FACT_PAY_TYPE," +
                                            "FACT.INPUT_CODE AS CUSTOMER_CODE," +
                                            "FACT.INPUT_NAME AS CUSTOMER_NAME," +
                                            "(SELECT TOP 1 VALUE FROM DB_LANGUAGE WHERE TAG = (SELECT [dbo].[FN_DOC_CUSTOMER_TYPE_NAME](FACT.TYPE,FACT.DOC_TYPE,FACT.REBATE,FACT.PAY_TYPE)) AND LANG = 'FR') AS  FACT_TYPE_NAME," +
                                            "ISNULL((SELECT AMOUNT - (DISCOUNT + DOC_DISCOUNT_1 + DOC_DISCOUNT_2 + DOC_DISCOUNT_3) FROM DOC WHERE DOC.GUID = FACT.DOC_GUID),0) AS FACT_AMOUNT," +
                                            "ISNULL((SELECT VAT FROM DOC WHERE DOC.GUID = FACT.DOC_GUID),0) AS FACT_VAT," +
                                            "ISNULL((SELECT TOTAL FROM DOC WHERE DOC.GUID = FACT.DOC_GUID),0) AS FACT_TOTAL," +
                                            "TAH.DOC_DATE AS TAH_DATE," +
                                            "TAH.GUID AS TAH_GUID," +
                                            "TAH.REF AS TAH_REF," +
                                            "TAH.REF_NO AS TAH_REF_NO," +
                                            "(SELECT TOP 1 VALUE FROM DB_LANGUAGE WHERE TAG = (SELECT [dbo].[FN_DOC_CUSTOMER_TYPE_NAME](TAH.TYPE,TAH.DOC_TYPE,TAH.REBATE,TAH.PAY_TYPE)) AND LANG = @LANG) AS  TAH_PAY_TYPE," +
                                            "TAH.INPUT_NAME AS BANK_NAME," +
                                            "TAH.DESCRIPTION AS DESCRIPTION," +
                                            "TAH.AMOUNT " +
                                            "FROM DEPT_CREDIT_MATCHING AS DEPTH " +
                                            "INNER JOIN DOC_CUSTOMER_VW_01 AS FACT ON " +
                                            "DEPTH.PAYING_DOC = FACT.GUID " +
                                            "INNER JOIN DOC_CUSTOMER_VW_01 AS TAH ON " +
                                            "DEPTH.PAID_DOC = TAH.GUID WHERE " +
                                            "((FACT.INPUT_CODE = @INPUT_CODE) OR (@INPUT_CODE = '')) AND " +
                                            "((TAH.DOC_DATE >= @FIRST_DATE) OR (@FIRST_DATE = '19700101')) AND ((TAH.DOC_DATE <= @LAST_DATE) OR (@LAST_DATE = '19700101')) " +
                                            "AND TAH.TYPE = 0 AND TAH.DOC_TYPE = 200 " +
                                            "UNION ALL " +
                                            "SELECT " +
                                            "DOC_DATE AS FACT_DATE," +
                                            "REF  AS FACT_REF," +
                                            "REF_NO AS FACT_REF_NO," +
                                            "PAY_TYPE AS FACT_PAY_TYPE," +
                                            "OUTPUT_CODE AS CUSTOMER_CODE," +
                                            "OUTPUT_NAME AS CUSTOMER_NAME," +
                                            "(SELECT TOP 1 VALUE FROM DB_LANGUAGE WHERE TAG = (SELECT [dbo].[FN_DOC_CUSTOMER_TYPE_NAME](TYPE,DOC_TYPE,REBATE,PAY_TYPE)) AND LANG = @LANG) AS  FACT_TYPE_NAME," +
                                            "ISNULL((SELECT (AMOUNT - (DISCOUNT + DOC_DISCOUNT_1 + DOC_DISCOUNT_2 + DOC_DISCOUNT_3)) * -1 FROM DOC WHERE DOC.GUID = DOC_GUID),0) AS FACT_AMOUNT," +
                                            "ISNULL((SELECT VAT * -1 FROM DOC WHERE DOC.GUID = DOC_GUID),0) AS FACT_VAT," +
                                            "ISNULL((SELECT TOTAL * -1 FROM DOC WHERE DOC.GUID = DOC_GUID),0) AS FACT_TOTAL," +
                                            "(SELECT TOP 1 DOC_DATE FROM DOC_CUSTOMER_VW_01 AS CUST WHERE GUID = (SELECT TOP 1 PAYING_DOC FROM DEPT_CREDIT_MATCHING AS DEPT_FAC WHERE DEPT_FAC.PAID_DOC =(SELECT TOP 1 PAID_DOC FROM DEPT_CREDIT_MATCHING AS DEPT_RETURN WHERE DEPT_RETURN.PAYING_DOC = DOC_CUSTOMER_VW_01.GUID) AND DEPT_FAC.PAYING_DOC <> DOC_CUSTOMER_VW_01.GUID)) AS TAH_DATE," +
                                            "(SELECT TOP 1 GUID FROM DOC_CUSTOMER_VW_01 AS CUST WHERE GUID = (SELECT TOP 1 PAYING_DOC FROM DEPT_CREDIT_MATCHING AS DEPT_FAC WHERE DEPT_FAC.PAID_DOC =(SELECT TOP 1 PAID_DOC FROM DEPT_CREDIT_MATCHING AS DEPT_RETURN WHERE DEPT_RETURN.PAYING_DOC = DOC_CUSTOMER_VW_01.GUID) AND DEPT_FAC.PAYING_DOC <> DOC_CUSTOMER_VW_01.GUID)) AS TAH_GUID," +
                                            "(SELECT TOP 1 REF FROM DOC_CUSTOMER_VW_01 AS CUST WHERE GUID = (SELECT TOP 1 PAYING_DOC FROM DEPT_CREDIT_MATCHING AS DEPT_FAC WHERE DEPT_FAC.PAID_DOC =(SELECT TOP 1 PAID_DOC FROM DEPT_CREDIT_MATCHING AS DEPT_RETURN WHERE DEPT_RETURN.PAYING_DOC = DOC_CUSTOMER_VW_01.GUID) AND DEPT_FAC.PAYING_DOC <> DOC_CUSTOMER_VW_01.GUID)) AS TAH_REF," +
                                            "(SELECT TOP 1 REF_NO FROM DOC_CUSTOMER_VW_01 AS CUST WHERE GUID = (SELECT TOP 1 PAYING_DOC FROM DEPT_CREDIT_MATCHING AS DEPT_FAC WHERE DEPT_FAC.PAID_DOC =(SELECT TOP 1 PAID_DOC FROM DEPT_CREDIT_MATCHING AS DEPT_RETURN WHERE DEPT_RETURN.PAYING_DOC = DOC_CUSTOMER_VW_01.GUID) AND DEPT_FAC.PAYING_DOC <> DOC_CUSTOMER_VW_01.GUID)) AS TAH_REF_NO," +
                                            "'' AS TAH_PAY_TYPE," +
                                            "'' AS BANK_NAME," +
                                            "''  AS DESCRIPTION," +
                                            "(SELECT TOP 1 AMOUNT FROM DOC_CUSTOMER_VW_01 AS CUST WHERE GUID = (SELECT TOP 1 PAYING_DOC FROM DEPT_CREDIT_MATCHING AS DEPT_FAC WHERE DEPT_FAC.PAID_DOC =(SELECT TOP 1 PAID_DOC FROM DEPT_CREDIT_MATCHING AS DEPT_RETURN WHERE DEPT_RETURN.PAYING_DOC = DOC_CUSTOMER_VW_01.GUID) AND DEPT_FAC.PAYING_DOC <> DOC_CUSTOMER_VW_01.GUID)) AS AMOUNT " +
                                            "FROM DOC_CUSTOMER_VW_01 WHERE ((OUTPUT_CODE = @INPUT_CODE) OR (@INPUT_CODE = '')) AND GUID IN (SELECT PAYING_DOC FROM DEPT_CREDIT_MATCHING AS DEPT1 WHERE DEPT1.PAID_DOC IN ( SELECT PAID_DOC FROM DEPT_CREDIT_MATCHING WHERE PAYING_DOC IN (SELECT GUID FROM DOC_CUSTOMER_VW_01 WHERE TYPE = 0 AND DOC_TYPE = 200 AND ((DOC_CUSTOMER_VW_01.DOC_DATE >= @FIRST_DATE) " +
                                            "OR (@FIRST_DATE = '19700101')) AND ((DOC_CUSTOMER_VW_01.DOC_DATE <= @LAST_DATE) OR (@LAST_DATE = '19700101')))) AND ISNULL((SELECT TOP 1 TYPE FROM  DOC_CUSTOMER_VW_01 where DOC_CUSTOMER_VW_01.DOC_TYPE < 199 AND DOC_CUSTOMER_VW_01.GUID = DEPT1.PAYING_DOC),1) = 0)", 
                                            param : ['INPUT_CODE:string|50','FIRST_DATE:date','LAST_DATE:date','LANG:string|50'],
                                            value : [this.txtCustomerCode.CODE,this.dtFirst.value,this.dtLast.value,localStorage.getItem('lang')]
                                }
                                App.instance.setState({isExecute:true})
                                let tmpData = await this.core.sql.execute(tmpQuery)

                                App.instance.setState({isExecute:false})
                                if(tmpData.result.recordset.length > 0)
                                {
                                    this.pvtData.setDataSource(tmpData.result.recordset)
                                }
                                else
                                {
                                    this.pvtData.setDataSource([])
                                }
                            }}/>
                        </div>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                        </div>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <NdCollectionGrid
                                id="pvtData"
                                rowKeyExpr="TAH_KEY"
                                parent={this}
                                height={'750'}
                                data={[]}
                                group={groupCollection}
                                childField="FACTURAS"  
                                onReady={(grid) => this.pvtData = grid}
                                scrolling={{mode: 'virtual'}}
                            />
                        </div>
                    </div>
                    {/* Açık Fişler PopUp */}
                    <NdPopUp parent={this} id={"popOpenTike"} 
                    visible={false}
                    showCloseButton={true}
                    showTitle={true}
                    title={this.lang.t("popOpenTike.title")}
                    container={'#' + this.props.data.id + this.tabIndex} 
                    width={'900'}
                    height={'500'}
                    position={{of:'#' + this.props.data.id + this.tabIndex}}
                    >
                        <Form colCount={1} height={'fit-content'}>
                            <Item>
                            <NdGrid parent={this} id={"grdOpenTike"} 
                                    showBorders={true} 
                                    columnsAutoWidth={true} 
                                    allowColumnReordering={true} 
                                    allowColumnResizing={true} 
                                    filterRow={{visible:true}}
                                    height={350} 
                                    width={'100%'}
                                    dbApply={false}
                                    onRowDblClick={async(e)=>
                                    {
                                    }}
                                    onRowRemoved={async (e)=>{
                                    }}
                                    >
                                        <Scrolling mode="standart" />
                                        <Editing mode="cell" allowUpdating={false} allowDeleting={false} />
                                        <Column dataField="CUSER_NAME" caption={this.lang.t("grdOpenTike.clmUser")} width={110}  headerFilter={{visible:true}}/>
                                        <Column dataField="DEVICE" caption={this.lang.t("grdOpenTike.clmDevice")} width={60}  headerFilter={{visible:true}}/>
                                        <Column dataField="DATE" caption={this.lang.t("grdOpenTike.clmDate")} width={90} allowEditing={false} />
                                        <Column dataField="TICKET_ID" caption={this.lang.t("grdOpenTike.clmTicketId")} width={150}  headerFilter={{visible:true}}/>
                                        <Column dataField="TOTAL" caption={this.lang.t("grdOpenTike.clmTotal")} width={100} format={{ style: "currency", currency: Number.money.code,precision: 2}} headerFilter={{visible:true}}/>
                                        <Column dataField="DESCRIPTION" caption={this.lang.t("grdOpenTike.clmDescription")} width={250}  headerFilter={{visible:true}}/>
                                </NdGrid>
                            </Item>
                        </Form>
                    </NdPopUp>
                </ScrollView>
            </div>
        )
    }
}
