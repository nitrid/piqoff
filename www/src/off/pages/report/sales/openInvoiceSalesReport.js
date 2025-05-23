import React from 'react';
import App from '../../../lib/app.js';
import { docCls,docItemsCls,docCustomerCls,deptCreditMatchingCls } from '../../../../core/cls/doc.js';
import moment from 'moment';

import ScrollView from 'devextreme-react/scroll-view';
import Toolbar from 'devextreme-react/toolbar';
import Form, { Label,Item,EmptyItem } from 'devextreme-react/form';
import ContextMenu from 'devextreme-react/context-menu';
import TabPanel from 'devextreme-react/tab-panel';
import { Button } from 'devextreme-react/button';

import NbDateRange from '../../../../core/react/bootstrap/daterange.js';
import NdGrid,{Column,Editing,Paging,Pager,Scrolling,KeyboardNavigation,Export,Summary,TotalItem,StateStoring,ColumnChooser} from '../../../../core/react/devex/grid.js';
import NdButton from '../../../../core/react/devex/button.js';
import NdDatePicker from '../../../../core/react/devex/datepicker.js';
import NdImageUpload from '../../../../core/react/devex/imageupload.js';
import { dialog } from '../../../../core/react/devex/dialog.js';
import { datatable } from '../../../../core/core.js';
import tr from '../../../meta/lang/devexpress/tr.js';
import NdTextBox, { Validator, NumericRule, RequiredRule, CompareRule, EmailRule, PatternRule, StringLengthRule, RangeRule, AsyncRule } from '../../../../core/react/devex/textbox.js'
import NdSelectBox from '../../../../core/react/devex/selectbox.js';
import NdDropDownBox from '../../../../core/react/devex/dropdownbox.js';
import NdPopGrid from '../../../../core/react/devex/popgrid.js';
import NdListBox from '../../../../core/react/devex/listbox.js';
import NdPopUp from '../../../../core/react/devex/popup.js';
import NdHtmlEditor from '../../../../core/react/devex/htmlEditor.js';
import NdCheckBox from '../../../../core/react/devex/checkbox.js';

export default class openInvoiceSalesReport extends React.PureComponent
{
    constructor(props)
    {
        super(props)
        this.state = 
        {
            columnListValue : ['DOC_DATE','INPUT_CODE','INPUT_NAME','DOC_REF','DOC_REF_NO','REMAINDER','DOC_TOTAL']
        }
        
        this.core = App.instance.core;
        this.columnListData = 
        [
            {CODE : "DOC_DATE",NAME : this.t("grdListe.clmDate")},                                   
            {CODE : "INPUT_CODE",NAME : this.t("grdListe.clmCode")},                                   
            {CODE : "INPUT_NAME",NAME : this.t("grdListe.clmName")},
            {CODE : "DOC_REF",NAME : this.t("grdListe.clmRef")},
            {CODE : "DOC_REF_NO",NAME : this.t("grdListe.clmRefNo")},
            {CODE : "REMAINDER",NAME : this.t("grdListe.clmRemainder")},
            {CODE : "DOC_TOTAL",NAME : this.t("grdListe.clmTotal")},
        ]
        this.groupList = [];
        this._btnGetirClick = this._btnGetirClick.bind(this)
        this._columnListBox = this._columnListBox.bind(this)
        this.saveState = this.saveState.bind(this)
        this.loadState = this.loadState.bind(this)
    }
    loadState() 
    {
        let tmpLoad = this.access.filter({ELEMENT:'grdListe',USERS:this.user.CODE})
        return tmpLoad.getValue()
    }
    saveState(e)
    {
        let tmpSave = this.access.filter({ELEMENT:'grdListe',USERS:this.user.CODE})
        tmpSave.setValue(e)
        tmpSave.save()
    }

    async componentDidMount()
    {
        setTimeout(async () => 
        {
        }, 1000);
    }
    _columnListBox(e)
    {
        let onOptionChanged = (e) =>
        {
            if (e.name == 'selectedItemKeys') 
            {
                this.groupList = [];
                if(typeof e.value.find(x => x == 'DOC_DATE') != 'undefined')
                {
                    this.groupList.push('DOC_DATE')
                }
                if(typeof e.value.find(x => x == 'INPUT_CODE') != 'undefined')
                {
                    this.groupList.push('INPUT_CODE')
                }
                if(typeof e.value.find(x => x == 'INPUT_NAME') != 'undefined')
                {
                    this.groupList.push('INPUT_NAME')
                }                
                if(typeof e.value.find(x => x == 'DOC_REF') != 'undefined')
                {
                    this.groupList.push('DOC_REF')
                }
                if(typeof e.value.find(x => x == 'DOC_REF_NO') != 'undefined')
                {
                    this.groupList.push('DOC_REF_NO')
                }
                if(typeof e.value.find(x => x == 'REMAINDER') != 'undefined')
                {
                    this.groupList.push('REMAINDER')
                }
                if(typeof e.value.find(x => x == 'DOC_TOTAL') != 'undefined')
                {
                    this.groupList.push('DOC_TOTAL')
                }
                
                for (let i = 0; i < this.grdListe.devGrid.columnCount(); i++) 
                {
                    if(typeof e.value.find(x => x == this.grdListe.devGrid.columnOption(i).name) == 'undefined')
                    {
                        this.grdListe.devGrid.columnOption(i,'visible',false)
                    }
                    else
                    {
                        this.grdListe.devGrid.columnOption(i,'visible',true)
                    }
                }

                this.setState(
                {
                    columnListValue : e.value
                })
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
   
    async _btnGetirClick()
    {
        if(this.txtCustomerCode.value == '')
        {
            this.txtCustomerCode.CODE = ''
        }
        let tmpSource =
        {
            source : 
            {
                groupBy : this.groupList,
                select: 
                {
                    query: "SELECT *, ROUND((DOC_TOTAL - PAYING_AMOUNT), 2) AS REMAINDER " + 
                           "FROM ( " +
                           "SELECT " +
                           "TYPE, " +
                           "DOC_DATE, " +
                           "DOC_TYPE, " +
                           "INPUT_CODE, " +
                           "INPUT_NAME, " +
                           "DOC_REF, " +
                           "DOC_REF_NO, " +
                           "DOC_GUID ," +
                           "MAX(DOC_TOTAL) AS DOC_TOTAL, " +  // Faturanın toplamı
                           "SUM(PAYING_AMOUNT) AS PAYING_AMOUNT  " + // Ödeme ve iadelerin toplamı
                           " FROM DEPT_CREDIT_MATCHING_VW_03 " +
                           " WHERE TYPE = 1 AND DOC_TYPE = 20 AND ((INPUT_CODE = @INPUT_CODE) OR (@INPUT_CODE = '')) " +
                           " AND DOC_DATE >= @FIRST_DATE AND DOC_DATE <= @LAST_DATE " +
                           " GROUP BY DOC_TYPE, TYPE, DOC_DATE, INPUT_NAME, DOC_REF_NO, DOC_REF, INPUT_CODE , DOC_GUID " +
                           ") AS TMP " +
                           "WHERE ROUND((DOC_TOTAL - PAYING_AMOUNT), 2) > 0",  // Ödenmemiş bakiye kontrolü
                    param : ['FIRST_DATE:date','LAST_DATE:date','INPUT_CODE:string|50'],
                    value : [this.dtDate.startDate,this.dtDate.endDate,this.txtCustomerCode.CODE],
                },
                sql : this.core.sql
            }
        }

        await this.grdListe.dataRefresh(tmpSource)
      
    }

    async InvPrint()
    {
        let tmpLines = []
        App.instance.setState({isExecute:true})
        for (let i = 0; i < this.grdListe.getSelectedData().length; i++) 
        {
            let tmpQuery = 
            {
                query: "SELECT *,ISNULL((SELECT TOP 1 PATH FROM LABEL_DESIGN WHERE TAG = @DESIGN),'') AS PATH FROM  [dbo].[FN_DOC_ITEMS_FOR_PRINT](@DOC_GUID,@LANG) ORDER BY DOC_DATE,LINE_NO " ,
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
        App.instance.setState({isExecute:false})
    }

    render(){
        return (
            <div>
                <ScrollView>
                    {/* Toolbar */}
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <Toolbar>
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
                            <Form colCount={2} id="frmKriter">
                                <Item>
                                    <NbDateRange id={"dtDate"} parent={this} startDate={moment().startOf('month')} endDate={moment().endOf('month')}/>
                                </Item>
                                <Item>
                                    <EmptyItem/>
                                </Item>
                                <Item>
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
                                                this.txtCustomerCode.CODE = data[0].CODE
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
                                                    this.txtCustomerCode.CODE =''
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

                        </div>
                        <div className="col-3">
                      
                        </div>
                        <div className="col-3">
                            
                        </div>
                        <div className="col-3">
                            <NdButton text={this.t("btnGet")} type="success" width="100%" onClick={this._btnGetirClick}></NdButton>
                        </div>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <NdGrid id="grdListe" parent={this} 
                            selection={{mode:"multiple"}} 
                            showBorders={true}
                            filterRow={{visible:false}} 
                            headerFilter={{visible:false}}
                            height={'690'} 
                            width={'100%'}
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
                                    pagePrm:{GUID:e.data.DOC_GUID}
                                })
                            }}
                            loadPanel={{enabled:true}}
                            >
                                <StateStoring enabled={true} type="custom" customLoad={this.loadState} customSave={this.saveState} storageKey={this.props.data.id + "_grdListe"}/>
                                <ColumnChooser enabled={true} />
                                <Paging defaultPageSize={10} />
                                <Pager visible={true} allowedPageSizes={[5,10,20,50,100]} showPageSizeSelector={true} />
                                <Scrolling mode="standart" />
                                <Editing mode="cell" allowUpdating={false} allowDeleting={false} confirmDelete={false}/>
                                <Export fileName={this.lang.t("menuOff.slsRpt_01_003")} enabled={true} allowExportSelectedData={true} />
                                <Column dataField="DOC_DATE" caption={this.t("grdListe.clmDate")} visible={true} dataType="date" width={100}
                                editorOptions={{value:null}}
                                cellRender={(e) => 
                                {
                                    if(moment(e.value).format("YYYY-MM-DD") != '1970-01-01')
                                    {
                                        return e.text
                                    }
                                    
                                    return
                                }}/>
                                <Column dataField="INPUT_CODE" caption={this.t("grdListe.clmCode")} width={120} visible={true}/> 
                                <Column dataField="INPUT_NAME" caption={this.t("grdListe.clmName")} visible={true}/> 
                                <Column dataField="DOC_REF" caption={this.t("grdListe.clmRef")} visible={true}/> 
                                <Column dataField="DOC_REF_NO" caption={this.t("grdListe.clmRefNo")} width={120} visible={true}/> 
                                <Column dataField="REMAINDER" caption={this.t("grdListe.clmRemainder")} width={120} format={{ style: "currency", currency: Number.money.code,precision: 2}} visible={true}/> 
                                <Column dataField="DOC_TOTAL" caption={this.t("grdListe.clmTotal")} width={120} format={{ style: "currency", currency: Number.money.code,precision: 2}} visible={true}/> 
                                <Summary>
                                    <TotalItem
                                    column="REMAINDER"
                                    summaryType="sum"
                                    valueFormat={{ style: "currency", currency: Number.money.code,precision: 2}} />
                                        
                                       <TotalItem
                                    column="DOC_TOTAL"
                                    summaryType="sum"
                                    valueFormat={{ style: "currency", currency: Number.money.code,precision: 2}} />

                                </Summary> 
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
                                    data={{source:{select:{query : "SELECT TAG,DESIGN_NAME FROM [dbo].[LABEL_DESIGN] WHERE PAGE = '115'"},sql:this.core.sql}}}
                                    param={this.param.filter({ELEMENT:'cmbDesignList',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'cmbDesignList',USERS:this.user.CODE})}
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
                                                                query: "SELECT *,ISNULL((SELECT TOP 1 PATH FROM LABEL_DESIGN WHERE TAG = @DESIGN),'') AS PATH FROM  [dbo].[FN_DOC_ITEMS_FOR_PRINT](@DOC_GUID,@LANG) ORDER BY DOC_DATE,LINE_NO " ,
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
                                                        this.txtSendMail.value = tmpLines[0].EMAIL
                                                    }
                                                    else
                                                    {
                                                        this.popMailSend.show()
                                                    }
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
                    <div>
                        <NdPopUp parent={this} id={"popMailSend"} 
                        visible={false}
                        showCloseButton={true}
                        showTitle={true}
                        title={this.t("popMailSend.title")}
                        container={"#root"} 
                        width={'600'}
                        height={'600'}
                        position={{of:'#root'}}
                        deferRendering={true}
                        >
                            <Form colCount={1} height={'fit-content'}>
                                <Item>
                                    <Label text={this.t("popMailSend.cmbMailAddress")} alignment="right" />
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
                                </Item>
                                <Item>
                                    <Label text={this.t("popMailSend.txtMailSubject")} alignment="right" />
                                    <NdTextBox id="txtMailSubject" parent={this} simple={true}
                                    maxLength={128}
                                    >
                                        <Validator validationGroup={"frmMailsend" + this.tabIndex}>
                                            <RequiredRule message={this.t("validMail")} />
                                        </Validator> 
                                    </NdTextBox>
                                </Item>
                                <Item>
                                <Label text={this.t("popMailSend.txtSendMail")} alignment="right" />
                                    <NdTextBox id="txtSendMail" parent={this} simple={true}
                                    maxLength={128}
                                    >
                                        <Validator validationGroup={"frmMailsend" + this.tabIndex}>
                                            <RequiredRule message={this.t("validMail")} />
                                        </Validator> 
                                    </NdTextBox>
                                </Item>
                                <Item>
                                    <NdHtmlEditor id="htmlEditor" parent={this} height={300} placeholder={this.t("placeMailHtmlEditor")}>
                                    </NdHtmlEditor>
                                </Item>
                                <Item>
                                    <div className='row'>
                                        <div className='col-6'>
                                            <NdButton text={this.t("popMailSend.btnSend")} type="normal" stylingMode="contained" width={'100%'}  
                                            validationGroup={"frmMailsend"  + this.tabIndex}
                                            onClick={async (e)=>
                                            {       
                                                if(e.validationGroup.validate().status == "valid")
                                                {
                                                    
                                                    let tmpLines = []
                                                    App.instance.setState({isExecute:true})
                                                    for (let i = 0; i < this.grdListe.getSelectedData().length; i++) 
                                                    {
                                                        let tmpQuery = 
                                                        {
                                                            query: "SELECT *,ISNULL((SELECT TOP 1 PATH FROM LABEL_DESIGN WHERE TAG = @DESIGN),'') AS PATH FROM  [dbo].[FN_DOC_ITEMS_FOR_PRINT](@DOC_GUID,@LANG) ORDER BY DOC_DATE,LINE_NO " ,
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
                                                                App.instance.setState({isExecute:false})
                                                                let tmpConfObj1 =
                                                                {
                                                                    id:'msgMailSendResult',showTitle:true,title:this.t("msgMailSendResult.title"),showCloseButton:true,width:'500px',height:'200px',
                                                                    button:[{id:"btn01",caption:this.t("msgMailSendResult.btn01"),location:'after'}],
                                                                }
                                                                
                                                                if((pResult1) == 0)
                                                                {  
                                                                    tmpConfObj1.content = (<div style={{textAlign:"center",fontSize:"20px",color:"green"}}>{this.t("msgMailSendResult.msgSuccess")}</div>)
                                                                    await dialog(tmpConfObj1);
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
                                                    App.instance.setState({isExecute:false})
                                                  
                                                }
                                                    
                                            }}/>
                                        </div>
                                        <div className='col-6'>
                                            <NdButton text={this.lang.t("btnCancel")} type="normal" stylingMode="contained" width={'100%'}
                                            onClick={()=>
                                            {
                                                this.popMailSend.hide();  
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