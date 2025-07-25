import React from 'react';
import App from '../../../lib/app.js';
import { transportTypeCls} from '../../../../core/cls/doc.js';


import ScrollView from 'devextreme-react/scroll-view';
import Toolbar,{ Item } from 'devextreme-react/toolbar';
import { Button } from 'devextreme-react/button';
import * as xlsx from 'xlsx'

import NdTextBox, { Validator, RequiredRule } from '../../../../core/react/devex/textbox.js'
import NdPopGrid from '../../../../core/react/devex/popgrid.js';
import NdPopUp from '../../../../core/react/devex/popup.js';
import { Column } from '../../../../core/react/devex/grid.js';
import { dialog } from '../../../../core/react/devex/dialog.js';
import { datatable } from '../../../../core/core.js';
import { NdForm, NdItem, NdLabel, NdEmptyItem } from '../../../../core/react/devex/form.js';
import { NdToast } from '../../../../core/react/devex/toast.js';
export default class excelItemImport extends React.PureComponent
{
    constructor(props)
    {
        super(props)

        this.core = App.instance.core;
        this.prmObj = this.param.filter({TYPE:1,USERS:this.user.CODE});
        this.transportObj = new transportTypeCls();
        this.prevCode = "";
        this.tabIndex = props.data.tabkey
        this.excelData = new datatable
    }
    async componentDidMount()
    {
        await this.core.util.waitUntil(0)
        this.init()
    }
    async init()
    {
       this.txtPopCode.value = "CODE",
       this.txtPopName.value = "NAME",
       this.txtPopType.value = "TYPE",
       this.txtPopVat.value = "VAT",
       this.txtPopCostPrice.value = "COST_PRICE",
       this.txtPopMinPrice.value = "MIN_PRICE",
       this.txtPopMaxPrice.value = "MAX_PRICE",
       this.txtPopStatus.value = "STATUS",
       this.txtPopMainCode.value = "MAIN_CODE",
       this.txtPopOrgins.value = "ORGINS",
       this.txtPopSaleJoinLine.value = "SALE_JOIN_LINE",
       this.txtPopTicketRest.value = "TICKET_REST",
       this.txtPopSugerRate.value = "SUGAR_RATE",
       this.txtPopDescription.value = "DESCRIPTION",
       this.txtPopSalePrice.value = "SALE_PRICE",
       this.txtPopUnitId.value = "UNIT_CODE",
       this.txtPopUnitId2.value = "UNIT_CODE_2",
       this.txtPopFactor2.value = "FACTOR_2",
       this.txtPopBarcode.value = "BARCODE",
       this.txtPopMulticode.value = "MULTICODE",
       this.customerGuid = ''
    }
    async excelAdd(pData)
    {
        console.log(pData)
        let empty = 
        {
           CUSER:this.user.CODE,
           TYPE:0,
           CODE:'',
           NAME:'',
           SNAME:'',
           VAT:0,
           COST_PRICE:0,
           MIN_PRICE:0,
           MAX_PRICE:0,
           STATUS:1,
           MAIN_CODE:'',
           ORGINS:'',
           SALE_JOIN_LINE:0,
           TICKET_REST:0,
           SUGAR_RATE:0,
           DESCRIPTION:'',
           CUSTOMER:this.customerGuid,
           SALE_PRICE:0,
           UNIT_CODE:'001',
           UNIT_CODE_2:'001',
           BARCODE:'',
           MULTICODE:'',
           FACTOR_2:1
        }

        this.excelData.insertCmd = 
        {
            query : `EXEC [dbo].[PRD_ITEMS_EXCEL_INSERT] 
                    @CUSER  = @PCUSER, 
                    @TYPE   = @PTYPE, 
                    @CODE   = @PCODE, 
                    @NAME   = @PNAME, 
                    @SNAME  = @PSNAME, 
                    @VAT  = @PVAT, 
                    @COST_PRICE = @PCOST_PRICE, 
                    @MIN_PRICE  = @PMIN_PRICE, 
                    @MAX_PRICE  = @PMAX_PRICE, 
                    @STATUS  = @PSTATUS, 
                    @MAIN_CODE  = @PMAIN_CODE, 
                    @ORGINS = @PORGINS, 
                    @SALE_JOIN_LINE  = @PSALE_JOIN_LINE, 
                    @TICKET_REST  = @PTICKET_REST, 
                    @SUGAR_RATE  = @PSUGAR_RATE, 
                    @DESCRIPTION = @PDESCRIPTION, 
                    @CUSTOMER = @PCUSTOMER, 
                    @SALE_PRICE  = @PSALE_PRICE, 
                    @UNIT_CODE  = @PUNIT_CODE, 
                    @UNIT_CODE_2 = @PUNIT_CODE_2, 
                    @BARCODE  = @PBARCODE, 
                    @MULTICODE = @PMULTICODE, 
                    @FACTOR_2   = @PFACTOR_2`,
            param : ['PCUSER:string|50','PTYPE:int','PCODE:string|50','PNAME:string|250','PSNAME:string|32','PVAT:float','PCOST_PRICE:float',
                    'PMIN_PRICE:float','PMAX_PRICE:float','PSTATUS:int','PMAIN_CODE:string|50','PORGINS:string|50','PSALE_JOIN_LINE:int',
                    'PTICKET_REST:int','PSUGAR_RATE:float','PDESCRIPTION:string|max','PCUSTOMER:string|50','PSALE_PRICE:float','PUNIT_CODE:string|50',
                    'PUNIT_CODE_2:string|50','PBARCODE:string|50','PMULTICODE:string|50','PFACTOR_2:float'],
            dataprm :   ['CUSER','TYPE','CODE','NAME','SNAME','VAT','COST_PRICE','MIN_PRICE','MAX_PRICE','STATUS','MAIN_CODE','ORGINS','SALE_JOIN_LINE',
                        'TICKET_REST','SUGAR_RATE','DESCRIPTION','CUSTOMER','SALE_PRICE','UNIT_CODE','UNIT_CODE_2','BARCODE','MULTICODE','FACTOR_2']
        } 

        App.instance.loading.show()
        
        for (let i = 0; i < pData.length; i++) 
        {
            if(typeof pData[i].CODE != 'undefined' && pData[i].CODE != '')
            {
                let tmpEmpty =  {...empty};

                tmpEmpty.TYPE = typeof pData[i].TYPE == 'undefined' ? 0 : pData[i].TYPE;
                tmpEmpty.CODE = typeof pData[i].CODE == 'undefined' ? '' : pData[i].CODE;
                tmpEmpty.NAME = typeof pData[i].NAME == 'undefined' ? '' : pData[i].NAME;
                tmpEmpty.SNAME = typeof pData[i].SNAME == 'undefined' ? 0 : pData[i].SNAME;
                tmpEmpty.VAT = typeof pData[i].VAT == 'undefined' ? 0 : pData[i].VAT;
                tmpEmpty.COST_PRICE = typeof pData[i].COST_PRICE == 'undefined' ? 0 : pData[i].COST_PRICE;
                tmpEmpty.MIN_PRICE = typeof pData[i].MIN_PRICE == 'undefined' ? 0 : pData[i].MIN_PRICE;
                tmpEmpty.MAX_PRICE = typeof pData[i].MAX_PRICE == 'undefined' ? 0 : pData[i].MAX_PRICE;
                tmpEmpty.STATUS = typeof pData[i].STATUS == 'undefined' ? 0 : pData[i].STATUS;
                tmpEmpty.MAIN_CODE = typeof pData[i].MAIN_CODE == 'undefined' ? '' : pData[i].MAIN_CODE;
                tmpEmpty.ORGINS = typeof pData[i].ORGINS == 'undefined' ? '' : pData[i].ORGINS;
                tmpEmpty.SALE_JOIN_LINE = typeof pData[i].SALE_JOIN_LINE == 'undefined' ? 0 : pData[i].SALE_JOIN_LINE;
                tmpEmpty.TICKET_REST = typeof pData[i].TICKET_REST == 'undefined' ? 0 : pData[i].TICKET_REST;
                tmpEmpty.SUGAR_RATE = typeof pData[i].SUGAR_RATE == 'undefined' ? 0 : pData[i].SUGAR_RATE;
                tmpEmpty.DESCRIPTION = typeof pData[i].DESCRIPTION == 'undefined' ? '' : pData[i].DESCRIPTION;
                tmpEmpty.SALE_PRICE = typeof pData[i].SALE_PRICE == 'undefined' ? 0 : pData[i].SALE_PRICE;
                tmpEmpty.UNIT_CODE = typeof pData[i].UNIT_CODE == 'undefined' ? '' : pData[i].UNIT_CODE;
                tmpEmpty.UNIT_CODE_2 = typeof pData[i].UNIT_CODE_2 == 'undefined' ? '' : pData[i].UNIT_CODE_2;
                tmpEmpty.BARCODE = typeof pData[i].BARCODE == 'undefined' ? '' : pData[i].BARCODE;
                tmpEmpty.MULTICODE = typeof pData[i].MULTICODE == 'undefined' ? '' : pData[i].MULTICODE;
                tmpEmpty.FACTOR_2 = typeof pData[i].FACTOR_2 == 'undefined' ? 1 : pData[i].FACTOR_2;
                tmpEmpty.CUSTOMS = typeof pData[i].CUSTOMS == 'undefined' ? '' : pData[i].CUSTOMS;

                this.excelData.push(tmpEmpty)
            }
        }

        await this.excelData.update()
        App.instance.loading.hide()
        this.excelData.clear()

        this.toast.show({message:this.t("msgSucces.msg"),type:"success"})
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
                            <NdForm colCount={3} id="frmCustoms">
                                {/* txtCustomerCode */}
                                <NdItem>
                                    <NdLabel text={this.t("txtCustomerCode")} alignment="right" />
                                    <NdTextBox id="txtCustomerCode" parent={this} simple={true}  
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    onEnterKey={(async()=>
                                    {
                                        await this.pg_txtCustomerCode.setVal(this.txtCustomerCode.value)
                                        this.pg_txtCustomerCode.show()
                                        this.pg_txtCustomerCode.onClick = async(data) =>
                                        {
                                            if(data.length > 0)
                                            {
                                                this.customerGuid = data[0].GUID
                                                this.txtCustomerCode.value = data[0].CODE
                                                this.txtCustomerName.value  = data[0].TITLE
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
                                                    this.pg_txtCustomerCode.onClick = async(data) =>
                                                    {
                                                        if(data.length > 0)
                                                        {
                                                            this.customerGuid = data[0].GUID
                                                            this.txtCustomerCode.value = data[0].CODE
                                                            this.txtCustomerName.value  = data[0].TITLE
                                                        }
                                                    }
                                                }
                                            },
                                        ]
                                    }
                                    >
                                        <Validator validationGroup={"frmslsDoc" + this.tabIndex}>
                                            <RequiredRule message={this.t("validCustomerCode")} />
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
                                                query : `SELECT GUID,CODE,TITLE,NAME,LAST_NAME,[TYPE_NAME],[GENUS_NAME] 
                                                        FROM CUSTOMER_VW_03 WHERE (UPPER(CODE) LIKE UPPER(@VAL) OR UPPER(TITLE) LIKE UPPER(@VAL)) AND STATUS = 1`,
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
                                {/* txtCustomerName */}
                                <NdItem>
                                    <NdLabel text={this.t("txtCustomerName")} alignment="right" />
                                    <NdTextBox id="txtCustomerName" parent={this} simple={true} readOnly={true} 
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    />
                                </NdItem> 
                                <NdEmptyItem />
                                <NdItem>
                                    <Button icon="xlsxfile" text={this.t("excelAdd")}
                                    validationGroup={"frmslsDoc"  + this.tabIndex}
                                    onClick={async (e)=>
                                    {
                                        if(this.customerGuid == '')
                                        {
                                            let tmpConfObj =
                                            {
                                                id:'msgNotCustomer',showTitle:true,title:this.t("msgNotCustomer.title"),showCloseButton:false,width:'500px',height:'auto',
                                                button:[{id:"btn01",caption:this.t("msgNotCustomer.btn01"),location:'after'}],
                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgNotCustomer.msg")}</div>)
                                            }
                                            
                                            let pResult = await dialog(tmpConfObj);

                                            if(pResult == 'btn01')
                                            {
                                               return
                                            }
                                        }
                                        this.popExcel.show()
                                    }}/>  
                                </NdItem>
                            </NdForm>
                        </div>
                    </div>
                       {/* Excel PopUp */}
                       <div>
                        <NdPopUp parent={this} id={"popExcel"} 
                        visible={false}
                        showCloseButton={true}
                        showTitle={true}
                        title={this.t("popExcel.title")}
                        container={'#' + this.props.data.id + this.tabIndex} 
                        width={'650'}
                        height={'650'}
                        position={{of:'#' + this.props.data.id + this.tabIndex}}
                        >
                            <NdForm colCount={2} height={'fit-content'}>
                                <NdItem>
                                    <NdLabel text={this.t("popExcel.txtPopCode")} alignment="right" />
                                    <NdTextBox id="txtPopCode" parent={this} simple={true}  notRefresh = {true} readOnly={true}
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    />
                                </NdItem>
                                <NdItem>
                                    <NdLabel text={this.t("popExcel.txtPopName")} alignment="right" />
                                    <NdTextBox id="txtPopName" parent={this} simple={true}  notRefresh = {true} readOnly={true}
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    />
                                </NdItem>
                                <NdItem>
                                    <NdLabel text={this.t("popExcel.txtPopType")} alignment="right" />
                                    <NdTextBox id="txtPopType" parent={this} simple={true}  notRefresh = {true} readOnly={true}
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    />
                                </NdItem>
                                <NdItem>
                                    <NdLabel text={this.t("popExcel.txtPopStatus")} alignment="right" />
                                    <NdTextBox id="txtPopStatus" parent={this} simple={true}  notRefresh = {true} readOnly={true}
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    />
                                </NdItem>
                                <NdItem>
                                    <NdLabel text={this.t("popExcel.txtPopVat")} alignment="right" />
                                    <NdTextBox id="txtPopVat" parent={this} simple={true}  notRefresh = {true}  readOnly={true}
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    />
                                </NdItem>
                                <NdItem>
                                    <NdLabel text={this.t("popExcel.txtPopCostPrice")} alignment="right" />
                                    <NdTextBox id="txtPopCostPrice" parent={this} simple={true}  notRefresh = {true}  readOnly={true}
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    />
                                </NdItem>
                                <NdItem>
                                    <NdLabel text={this.t("popExcel.txtPopMinPrice")} alignment="right" />
                                    <NdTextBox id="txtPopMinPrice" parent={this} simple={true}  notRefresh = {true}  readOnly={true}
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    />
                                </NdItem>
                                <NdItem>
                                    <NdLabel text={this.t("popExcel.txtPopMaxPrice")} alignment="right" />
                                    <NdTextBox id="txtPopMaxPrice" parent={this} simple={true}  notRefresh = {true}  readOnly={true}
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    />
                                </NdItem>
                                <NdItem>
                                    <NdLabel text={this.t("popExcel.txtPopMainCode")} alignment="right" />
                                    <NdTextBox id="txtPopMainCode" parent={this} simple={true}  notRefresh = {true}  readOnly={true}
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    />
                                </NdItem>
                                <NdItem>
                                    <NdLabel text={this.t("popExcel.txtPopOrgins")} alignment="right" />
                                    <NdTextBox id="txtPopOrgins" parent={this} simple={true}  notRefresh = {true}  readOnly={true}
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    />
                                </NdItem>
                                <NdItem>
                                    <NdLabel text={this.t("popExcel.txtPopSaleJoinLine")} alignment="right" />
                                    <NdTextBox id="txtPopSaleJoinLine" parent={this} simple={true}  notRefresh = {true}  readOnly={true}
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    />
                                </NdItem>
                                <NdItem>
                                    <NdLabel text={this.t("popExcel.txtPopTicketRest")} alignment="right" />
                                    <NdTextBox id="txtPopTicketRest" parent={this} simple={true}  notRefresh = {true}  readOnly={true}
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    />
                                </NdItem>
                                <NdItem>
                                    <NdLabel text={this.t("popExcel.txtPopSugerRate")} alignment="right" />
                                    <NdTextBox id="txtPopSugerRate" parent={this} simple={true}  notRefresh = {true}  readOnly={true}
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    />
                                </NdItem> 
                                <NdItem>
                                    <NdLabel text={this.t("popExcel.txtPopDescription")} alignment="right" />
                                    <NdTextBox id="txtPopDescription" parent={this} simple={true}  notRefresh = {true}  readOnly={true}
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    />
                                </NdItem> 
                                <NdItem>
                                    <NdLabel text={this.t("popExcel.txtPopSalePrice")} alignment="right" />
                                    <NdTextBox id="txtPopSalePrice" parent={this} simple={true}  notRefresh = {true}  readOnly={true}
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    />
                                </NdItem> 
                                <NdItem>
                                    <NdLabel text={this.t("popExcel.txtPopUnitId")} alignment="right" />
                                    <NdTextBox id="txtPopUnitId" parent={this} simple={true}  notRefresh = {true}  readOnly={true}
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    />
                                </NdItem>
                                <NdItem>
                                    <NdLabel text={this.t("popExcel.txtPopUnitId2")} alignment="right" />
                                    <NdTextBox id="txtPopUnitId2" parent={this} simple={true}  notRefresh = {true}  readOnly={true}
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    />
                                </NdItem>
                                <NdItem>
                                    <NdLabel text={this.t("popExcel.txtPopBarcode")} alignment="right" />
                                    <NdTextBox id="txtPopBarcode" parent={this} simple={true}  notRefresh = {true}  readOnly={true}
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    />
                                </NdItem>
                                <NdItem>
                                    <NdLabel text={this.t("popExcel.txtPopMulticode")} alignment="right" />
                                    <NdTextBox id="txtPopMulticode" parent={this} simple={true}  notRefresh = {true}  readOnly={true}
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    />
                                </NdItem>
                                <NdItem>
                                    <NdLabel text={this.t("popExcel.txtPopFactor2")} alignment="right" />
                                    <NdTextBox id="txtPopFactor2" parent={this} simple={true}  notRefresh = {true}  readOnly={true}
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    />
                                </NdItem>
                            </NdForm>
                            <NdForm colCount={2}>
                                <NdItem>
                                    <input type="file" name="upload" id="upload" text={"Excel Aktarım"} onChange={(e)=>
                                    {
                                        e.preventDefault();
                                        if (e.target.files) 
                                        {
                                            const reader = new FileReader();
                                            reader.onload = (e) => 
                                            {
                                                const data = e.target.result;
                                                const workbook = xlsx.read(data, { type: "array" });
                                                const sheetName = workbook.SheetNames[0];
                                                const worksheet = workbook.Sheets[sheetName];
                                                const json = xlsx.utils.sheet_to_json(worksheet);
                                                this.popExcel.hide()

                                                for(let i = 0; i < json.length; i++)
                                                {
                                                    if(json[i].VAT == undefined)
                                                    {
                                                        this.toast.show({message:this.t("msgVat.msg") + " " + json[i].CODE,type:"warning"})
                                                        return
                                                    }
                                                }
                                                this.excelAdd(json)
                                            };
                                            reader.readAsArrayBuffer(e.target.files[0]);
                                        }
                                    }}/>    
                                </NdItem>
                            </NdForm>
                        </NdPopUp>
                    </div>
                    <NdToast id={"toast"} parent={this} displayTime={2000} position={{at:"top center",offset:'0px 110px'}}/>
                </ScrollView>
            </div>
        )
    }
}
