import React from 'react';
import App from '../../../lib/app.js';
import moment from 'moment';

import Toolbar,{Item} from 'devextreme-react/toolbar';
import Form, { Label,EmptyItem } from 'devextreme-react/form';
import ScrollView from 'devextreme-react/scroll-view';

import NdGrid,{Column, ColumnChooser,ColumnFixing,Paging,Pager,Scrolling,Export} from '../../../../core/react/devex/grid.js';
import NdDropDownBox from '../../../../core/react/devex/dropdownbox.js';
import NdListBox from '../../../../core/react/devex/listbox.js';
import NdButton from '../../../../core/react/devex/button.js';
import NdCheckBox from '../../../../core/react/devex/checkbox.js';
import NdDatePicker from '../../../../core/react/devex/datepicker.js';
import NdPopGrid from '../../../../core/react/devex/popgrid.js';
import { dialog } from '../../../../core/react/devex/dialog.js';
import NdPopUp from '../../../../core/react/devex/popup.js';
import NdSelectBox from '../../../../core/react/devex/selectbox.js';
import NdTextBox, { Validator, RequiredRule, RangeRule } from '../../../../core/react/devex/textbox.js'

export default class collectionList extends React.PureComponent
{
    constructor(props)
    {
        super(props)

        this.state = 
        {
            columnListValue : ['REF','REF_NO','OUTPUT_NAME','DOC_DATE_CONVERT','TOTAL']
        }
        
        this.core = App.instance.core;
        this.columnListData = 
        [
            {CODE : "REF",NAME : this.t("grdColList.clmRef")},
            {CODE : "REF_NO",NAME : this.t("grdColList.clmRefNo")},
            {CODE : "OUTPUT_CODE",NAME : this.t("grdColList.clmOutputCode")},                                   
            {CODE : "OUTPUT_NAME",NAME : this.t("grdColList.clmOutputName")},
            {CODE : "DOC_DATE_CONVERT",NAME : this.t("grdColList.clmDate")},
            {CODE : "TOTAL",NAME : this.t("grdColList.clmTotal")},
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
                if(typeof e.value.find(x => x == 'OUTPUT_NAME') != 'undefined')
                {
                    this.groupList.push('OUTPUT_NAME')
                }
                if(typeof e.value.find(x => x == 'DOC_DATE_CONVERT') != 'undefined')
                {
                    this.groupList.push('DOC_DATE_CONVERT')
                }
                if(typeof e.value.find(x => x == 'TOTAL') != 'undefined')
                {
                    this.groupList.push('TOTAL')
                }
                
                for (let i = 0; i < this.grdColList.devGrid.columnCount(); i++) 
                {
                    if(typeof e.value.find(x => x == this.grdColList.devGrid.columnOption(i).name) == 'undefined')
                    {
                        this.grdColList.devGrid.columnOption(i,'visible',false)
                    }
                    else
                    {
                        this.grdColList.devGrid.columnOption(i,'visible',true)
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
                    query : "SELECT * FROM DOC_VW_01 " +
                            "WHERE ((OUTPUT_CODE = @OUTPUT_CODE) OR (@OUTPUT_CODE = '')) AND "+ 
                            "((DOC_DATE >= @FIRST_DATE) OR (@FIRST_DATE = '19700101')) AND ((DOC_DATE <= @LAST_DATE) OR (@LAST_DATE = '19700101'))  " +
                            " AND TYPE = 0 AND DOC_TYPE = 200 ",
                    param : ['OUTPUT_CODE:string|50','FIRST_DATE:date','LAST_DATE:date'],
                    value : [this.txtCustomerCode.CODE,this.dtFirst.value,this.dtLast.value]
                },
                sql : this.core.sql
            }
        }
        App.instance.setState({isExecute:true})
        await this.grdColList.dataRefresh(tmpSource)
        App.instance.setState({isExecute:false})

        let tmpTotal =  this.grdColList.data.datatable.sum("AMOUNT",2)
        this.txtTotal.setState({value:tmpTotal + ' ' + Number.money.sign});
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
                                                id: 'fns_02_002',
                                                text: this.t('menu'),
                                                path: 'finance/documents/collection.js'
                                            })
                                        }
                                    }    
                                } />
                                <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnPrint" parent={this} icon="print" type="default"
                                    onClick={async()=>
                                    {
                                        this.popDesign.show()
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
                                    <NdDatePicker simple={true}  parent={this} id={"dtLast"}
                                    >
                                    </NdDatePicker>
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
                            <NdGrid id="grdColList" parent={this} 
                            selection={{mode:"multiple"}} 
                            height={600}
                            showBorders={true}
                            filterRow={{visible:true}} 
                            headerFilter={{visible:true}}
                            columnAutoWidth={true}
                            allowColumnReordering={true}
                            allowColumnResizing={true}
                            >                            
                                {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Paging defaultPageSize={20} /> : <Paging enabled={false} />}
                                {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Pager visible={true} allowedPageSizes={[5,10,50]} showPageSizeSelector={true} /> : <Paging enabled={false} />}
                                {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Scrolling mode="standart" /> : <Scrolling mode="infinite" />}
                                <Export fileName={this.lang.t("menuOff.fns_01_002")} enabled={true} allowExportSelectedData={true} />
                                <Column dataField="REF" caption={this.t("grdColList.clmRef")} visible={true} width={200}/> 
                                <Column dataField="REF_NO" caption={this.t("grdColList.clmRefNo")} visible={true} width={100}/> 
                                <Column dataField="OUTPUT_CODE" caption={this.t("grdColList.clmOutputCode")} visible={false}/> 
                                <Column dataField="OUTPUT_NAME" caption={this.t("grdColList.clmOutputName")} visible={true}/> 
                                <Column dataField="DOC_DATE_CONVERT" caption={this.t("grdColList.clmDate")} visible={true} width={200}/> 
                                <Column dataField="TOTAL" caption={this.t("grdColList.clmTotal")} visible={true} format={{ style: "currency", currency: Number.money.code,precision: 2}}/>              
                            </NdGrid>
                        </div>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <Form colCount={4} parent={this} >                            
                                {/* TOPLAM */}
                                <EmptyItem />
                                <Item>
                                <Label text={this.t("txtTotal")} alignment="right" />
                                    <NdTextBox id="txtTotal" parent={this} simple={true} readOnly={true}
                                    maxLength={32}
                                    param={this.param.filter({ELEMENT:'txtTotal',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'txtTotal',USERS:this.user.CODE})}
                                    ></NdTextBox>
                                </Item>
                            </Form>
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
                                    data={{source:{select:{query : "SELECT TAG,DESIGN_NAME FROM [dbo].[LABEL_DESIGN] WHERE PAGE = '1200'"},sql:this.core.sql}}}
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
                                                if(e.validationGroup.validate().status == "valid")
                                                {
                                                    let tmpQuery = 
                                                    {
                                                        query : `SELECT 
                                                                FACT.DOC_DATE AS FACT_DATE,
                                                                FACT.REF  AS FACT_REF,
                                                                FACT.REF_NO AS FACT_REF_NO,
                                                                FACT.PAY_TYPE AS FACT_PAY_TYPE,
                                                                FACT.INPUT_CODE AS CUSTOMER_CODE,
                                                                FACT.INPUT_NAME AS CUSTOMER_NAME,
                                                                ISNULL((SELECT AMOUNT - (DISCOUNT + DOC_DISCOUNT_1 + DOC_DISCOUNT_2 + DOC_DISCOUNT_3) FROM DOC WHERE DOC.GUID = FACT.DOC_GUID),0) AS FACT_AMOUNT,
                                                                ISNULL((SELECT VAT FROM DOC WHERE DOC.GUID = FACT.DOC_GUID),0) AS FACT_VAT,
                                                                ISNULL((SELECT TOTAL FROM DOC WHERE DOC.GUID = FACT.DOC_GUID),0) AS FACT_TOTAL,
                                                                TAH.DOC_DATE AS TAH_DATE,
                                                                TAH.REF AS TAH_REF,
                                                                TAH.REF_NO AS TAH_REF_NO,
                                                                TAH.PAY_TYPE_NAME AS TAH_PAY_TYPE,
                                                                TAH.INPUT_NAME AS BANK_NAME,
                                                                TAH.DESCRIPTION AS DESCRIPTION,
                                                                TAH.AMOUNT,
                                                                ISNULL((SELECT TOP 1 PATH FROM LABEL_DESIGN WHERE TAG = @DESIGN),'') AS PATH 
                                                                FROM DEPT_CREDIT_MATCHING AS DEPTH
                                                                INNER JOIN DOC_CUSTOMER_VW_01 AS FACT ON
                                                                DEPTH.PAYING_DOC = FACT.GUID
                                                                INNER JOIN DOC_CUSTOMER_VW_01 AS TAH ON
                                                                DEPTH.PAID_DOC = TAH.GUID WHERE
                                                                ((FACT.INPUT_CODE = @INPUT_CODE) OR (@INPUT_CODE = '')) AND 
                                                                ((TAH.DOC_DATE >= @FIRST_DATE) OR (@FIRST_DATE = '19700101')) AND ((TAH.DOC_DATE <= @LAST_DATE) OR (@LAST_DATE = '19700101'))  
                                                                AND 
                                                                TAH.TYPE = 0 AND TAH.DOC_TYPE = 200 
                                                                UNION ALL 
                                                                SELECT 
                                                                DOC_DATE AS FACT_DATE,
                                                                REF  AS FACT_REF,
                                                                REF_NO AS FACT_REF_NO,
                                                                PAY_TYPE AS FACT_PAY_TYPE,
                                                                OUTPUT_CODE AS CUSTOMER_CODE,
                                                                OUTPUT_NAME AS CUSTOMER_NAME,
                                                                ISNULL((SELECT (AMOUNT - (DISCOUNT + DOC_DISCOUNT_1 + DOC_DISCOUNT_2 + DOC_DISCOUNT_3)) * -1 FROM DOC WHERE DOC.GUID = DOC_GUID),0) AS FACT_AMOUNT,
                                                                ISNULL((SELECT VAT * -1 FROM DOC WHERE DOC.GUID = DOC_GUID),0) AS FACT_VAT,
                                                                ISNULL((SELECT TOTAL * -1 FROM DOC WHERE DOC.GUID = DOC_GUID),0) AS FACT_TOTAL,
                                                                (SELECT TOP 1 DOC_DATE FROM DOC_CUSTOMER_VW_01 AS CUST WHERE GUID = (SELECT TOP 1 PAYING_DOC FROM DEPT_CREDIT_MATCHING AS DEPT_FAC WHERE DEPT_FAC.PAID_DOC =(SELECT TOP 1 PAID_DOC FROM DEPT_CREDIT_MATCHING AS DEPT_RETURN WHERE DEPT_RETURN.PAYING_DOC = DOC_CUSTOMER_VW_01.GUID) AND DEPT_FAC.PAYING_DOC <> DOC_CUSTOMER_VW_01.GUID)) AS TAH_DATE,
                                                                (SELECT TOP 1 REF FROM DOC_CUSTOMER_VW_01 AS CUST WHERE GUID = (SELECT TOP 1 PAYING_DOC FROM DEPT_CREDIT_MATCHING AS DEPT_FAC WHERE DEPT_FAC.PAID_DOC =(SELECT TOP 1 PAID_DOC FROM DEPT_CREDIT_MATCHING AS DEPT_RETURN WHERE DEPT_RETURN.PAYING_DOC = DOC_CUSTOMER_VW_01.GUID) AND DEPT_FAC.PAYING_DOC <> DOC_CUSTOMER_VW_01.GUID)) AS TAH_REF,
                                                                (SELECT TOP 1 REF_NO FROM DOC_CUSTOMER_VW_01 AS CUST WHERE GUID = (SELECT TOP 1 PAYING_DOC FROM DEPT_CREDIT_MATCHING AS DEPT_FAC WHERE DEPT_FAC.PAID_DOC =(SELECT TOP 1 PAID_DOC FROM DEPT_CREDIT_MATCHING AS DEPT_RETURN WHERE DEPT_RETURN.PAYING_DOC = DOC_CUSTOMER_VW_01.GUID) AND DEPT_FAC.PAYING_DOC <> DOC_CUSTOMER_VW_01.GUID)) AS TAH_REF_NO,
                                                                (SELECT TOP 1 PAY_TYPE_NAME FROM DOC_CUSTOMER_VW_01 AS CUST WHERE GUID = (SELECT TOP 1 PAYING_DOC FROM DEPT_CREDIT_MATCHING AS DEPT_FAC WHERE DEPT_FAC.PAID_DOC =(SELECT TOP 1 PAID_DOC FROM DEPT_CREDIT_MATCHING AS DEPT_RETURN WHERE DEPT_RETURN.PAYING_DOC = DOC_CUSTOMER_VW_01.GUID) AND DEPT_FAC.PAYING_DOC <> DOC_CUSTOMER_VW_01.GUID)) AS TAH_PAY_TYPE,
                                                                '' AS BANK_NAME,
                                                                ''  AS DESCRIPTION,
                                                                (SELECT TOP 1 AMOUNT FROM DOC_CUSTOMER_VW_01 AS CUST WHERE GUID = (SELECT TOP 1 PAYING_DOC FROM DEPT_CREDIT_MATCHING AS DEPT_FAC WHERE DEPT_FAC.PAID_DOC =(SELECT TOP 1 PAID_DOC FROM DEPT_CREDIT_MATCHING AS DEPT_RETURN WHERE DEPT_RETURN.PAYING_DOC = DOC_CUSTOMER_VW_01.GUID) AND DEPT_FAC.PAYING_DOC <> DOC_CUSTOMER_VW_01.GUID)) AS AMOUNT,
                                                                ISNULL((SELECT TOP 1 PATH FROM LABEL_DESIGN WHERE TAG = @DESIGN),'') AS PATH 

                                                                FROM DOC_CUSTOMER_VW_01 WHERE GUID IN (SELECT PAYING_DOC FROM DEPT_CREDIT_MATCHING AS DEPT1 WHERE DEPT1.PAID_DOC IN ( SELECT PAID_DOC FROM DEPT_CREDIT_MATCHING WHERE PAYING_DOC IN (SELECT GUID FROM DOC_CUSTOMER_VW_01 WHERE TYPE = 0 AND DOC_TYPE = 200 AND ((DOC_CUSTOMER_VW_01.DOC_DATE >= @FIRST_DATE) OR (@FIRST_DATE = '19700101')) AND ((DOC_CUSTOMER_VW_01.DOC_DATE <= @LAST_DATE) OR (@LAST_DATE = '19700101')))) AND ISNULL((SELECT TOP 1 TYPE FROM  DOC_CUSTOMER_VW_01 where DOC_CUSTOMER_VW_01.DOC_TYPE < 199 AND DOC_CUSTOMER_VW_01.GUID = DEPT1.PAYING_DOC),1) = 0)
                                                                `,
                                                        param : ['INPUT_CODE:string|50','FIRST_DATE:date','LAST_DATE:date','DESIGN:string|25'],
                                                        value : [this.txtCustomerCode.CODE,this.dtFirst.value,this.dtLast.value,this.cmbDesignList.value]
                                                    }
                                                    let tmpData = await this.core.sql.execute(tmpQuery)
                                                    console.log(tmpData) 
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
                                </Item>
                            </Form>
                        </NdPopUp>
                    </div>
                </ScrollView>
            </div>
        )
    }
}