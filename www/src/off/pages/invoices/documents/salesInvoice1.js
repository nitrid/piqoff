import moment from 'moment';

import React from 'react';
import App from '../../../lib/app.js';
import DocBase from '../../../tools/DocBase.js';

import ScrollView from 'devextreme-react/scroll-view';
import Toolbar from 'devextreme-react/toolbar';
import Form, { Label, Item } from 'devextreme-react/form';
import ContextMenu from 'devextreme-react/context-menu';
import TabPanel from 'devextreme-react/tab-panel';
import validationEngine from 'devextreme/ui/validation_engine';

import NdTextBox, { Validator, RequiredRule, RangeRule } from '../../../../core/react/devex/textbox.js'
import NdNumberBox from '../../../../core/react/devex/numberbox.js';
import NdSelectBox from '../../../../core/react/devex/selectbox.js';
import NdPopUp from '../../../../core/react/devex/popup.js';
import NdGrid,{ Column, Editing, Paging, Pager, Scrolling, Export, ColumnChooser, StateStoring } from '../../../../core/react/devex/grid.js';
import NdButton from '../../../../core/react/devex/button.js';
import NdDatePicker from '../../../../core/react/devex/datepicker.js';
import { dialog } from '../../../../core/react/devex/dialog.js';
import NdHtmlEditor from '../../../../core/react/devex/htmlEditor.js';
import { NdForm, NdItem, NdLabel, NdEmptyItem } from '../../../../core/react/devex/form.js';
import { NdToast } from '../../../../core/react/devex/toast.js';
import NdDocItemSelect from '../../../tools/NdDocItemSelect.js';
import { NdLayout,NdLayoutItem } from '../../../../core/react/devex/layout';

import { datatable } from '../../../../core/core.js';
import doc from '../../../lib/components/doc.js';

export default class salesInvoice extends React.PureComponent
{
    constructor(props)
    {
        super(props)
        
        this.core = App.instance.core;
        this.prmObj = this.param.filter({TYPE:1,USERS:this.user.CODE});
        this.acsobj = this.access.filter({TYPE:1,USERS:this.user.CODE});

        this.doc = new doc({parent:this});

        this.onGridToolbarPreparing = this.onGridToolbarPreparing.bind(this);
    }
    async componentDidMount()
    {
        await this.core.util.waitUntil(100)
        this.init()
    }
    init()
    {
        this.doc.type = 1;
        this.doc.docType = 20;
        this.doc.rebate = 0;
        this.doc.grid = this.grid;

        this.doc.init()
        this.doc.addDocEmpty()
        this.doc.addDocCustomerEmpty()
    }
    onGridToolbarPreparing(e) 
    {
        e.toolbarOptions.items.push(
        {
            location: 'before',
            widget: 'dxButton',
            options: 
            {
                icon: 'add',
                validationGroup: 'frmDoc' + this.tabIndex,
                onClick: (async(c) => 
                {
                    
                }).bind(this)
            }
        })
        e.toolbarOptions.items.push(
        {
            location: 'before',
            widget: 'dxButton',
            options: 
            {
                icon: 'search',
                validationGroup: 'frmDoc' + this.tabIndex,
                onClick: ((c) => 
                {
                    
                }).bind(this)
            }
        })
        e.toolbarOptions.items.push(
        {
            location: 'before',
            widget: 'dxButton',
            options: 
            {
                icon: 'add',
                text: this.t("serviceAdd"),
                validationGroup: 'frmDoc' + this.tabIndex,
                onClick: (async(c) => 
                {
                    
                }).bind(this)
            }
        })
        e.toolbarOptions.items.push(
        {
            location: 'before',
            widget: 'dxButton',
            options: 
            {
                icon: 'increaseindent',
                text: this.lang.t("collectiveItemAdd"),
                validationGroup: 'frmDoc' + this.tabIndex,
                onClick: (async(c) => 
                {
                    
                }).bind(this)
            }
        })
    }
    render()
    {
        return(
            <div id={this.props.data.id + this.tabIndex}>
                <ScrollView>
                    {/* Toolbar */}
                    <div className="row px-2 pt-1">
                        <div className="col-12">
                            <Toolbar>
                                <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnBack" parent={this} icon="revert" type="default"
                                    onClick={()=>
                                    {
                                        
                                    }}/>
                                </Item>
                                <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnNew" parent={this} icon="file" type="default"
                                    onClick={()=>{this.init()}}/>
                                </Item>
                                <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnSave" parent={this} icon="floppy" type="success" validationGroup={"frmDoc"  + this.tabIndex}
                                    onClick={async (e)=>
                                    {
                                        
                                    }}/>
                                </Item>
                                <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnInfo" parent={this} icon="info" type="default"
                                    onClick={async()=>
                                    {
                                        
                                    }}/>
                                </Item>
                                <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnPrint" parent={this} icon="print" type="default"
                                    onClick={async()=>
                                    {
                                        
                                    }}/>
                                </Item>
                                <Item location="after" locateInMenu="auto"
                                widget="dxButton"
                                options={
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
                                }}/>
                            </Toolbar>
                        </div>
                    </div>
                    {/* Form */}
                    <div className="row px-2 pt-1" style={{height: '120px'}}>
                        <div className="col-12">
                            <NdForm colCount={3} id="frmDoc">
                                {/* txtRef-Refno */}
                                <NdItem>
                                    <NdLabel text={this.t("txtRefRefno")} alignment="right" />
                                    <div className="row">
                                        <div className="col-6 pe-0">
                                            <NdTextBox id="txtRef" parent={this} simple={true} dt={{data:this.doc.docObj.dt('DOC'),field:"REF"}}
                                            upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                            readOnly={false}
                                            maxLength={32}
                                            onValueChanged={(async(e)=>{this.doc.updateDoc()}).bind(this)}
                                            param={this.param.filter({ELEMENT:'txtRef',USERS:this.user.CODE})}
                                            access={this.access.filter({ELEMENT:'txtRef',USERS:this.user.CODE})}
                                            /> 
                                        </div>
                                        <div className="col-6 ps-0">
                                            <NdTextBox id="txtRefno" parent={this} simple={true} dt={{data:this.doc.docObj.dt('DOC'),field:"REF_NO"}}
                                            upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                            readOnly={false}
                                            button={
                                            [
                                                {
                                                    id:'01',
                                                    icon:'more',
                                                    onClick:()=>
                                                    {
                                                        this.doc.getPopDoc(0)
                                                    }
                                                },
                                            ]}
                                            onChange={(async()=>
                                            {
                                                this.doc.docObj.docCustomer.dt()[0].REF_NO = this.txtRefno.value

                                                let tmpResult = await this.doc.checkDoc({ref:this.txtRef.value,refNo:this.txtRefno.value,deleted:true})

                                                if(tmpResult == 3)
                                                {
                                                    this.txtRefno.value = "";
                                                    this.docObj.docCustomer.dt()[0].REF_NO = this.txtRefno.value
                                                }
                                            }).bind(this)}
                                            param={this.param.filter({ELEMENT:'txtRefno',USERS:this.user.CODE})}
                                            access={this.access.filter({ELEMENT:'txtRefno',USERS:this.user.CODE})}
                                            >
                                                <Validator validationGroup={"frmDoc"  + this.tabIndex}>
                                                    <RequiredRule message={this.t("validRefNo")} />
                                                    <RangeRule min={1} message={this.t("validRefNo")}/>
                                                </Validator> 
                                            </NdTextBox>
                                        </div>
                                    </div>
                                </NdItem>
                                {/* cmbDepot */}
                                <NdItem>
                                    <NdLabel text={this.t("cmbDepot")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbDepot" notRefresh = {true}
                                    dt={{data:this.doc.docObj.dt('DOC'),field:"OUTPUT"}}  
                                    displayExpr="NAME"                       
                                    valueExpr="GUID"
                                    value=""
                                    searchEnabled={true}
                                    onValueChanged={(async()=>{this.doc.updateDoc()}).bind(this)}
                                    data={{source:{select:{query : `SELECT * FROM DEPOT_VW_01 WHERE TYPE IN(0,2)`},sql:this.core.sql}}}
                                    param={this.param.filter({ELEMENT:'cmbDepot',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'cmbDepot',USERS:this.user.CODE})}
                                    >
                                        <Validator validationGroup={"frmDoc"  + this.tabIndex}>
                                            <RequiredRule message={this.t("validDepot")} />
                                        </Validator> 
                                    </NdSelectBox>
                                </NdItem>
                                {/* Boş */}
                                <NdItem>
                                    <NdLabel text={this.t("txtDocNo")} alignment="right" />
                                    <NdTextBox id="txtDocNo" parent={this} simple={true}  
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    dt={{data:this.doc.docObj.dt('DOC'),field:"DOC_NO"}} 
                                    readOnly={false}
                                    onFocusOut={()=>{this.doc.checkDoc({docNo:this.txtDocNo.value})}}
                                    /> 
                                </NdItem>
                                {/* txtCustomerName */}
                                <NdItem>
                                    <NdLabel text={this.t("txtCustomerName")} alignment="right" />
                                    <NdSelectBox id="txtCustomerName" parent={this} simple={true}  
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    dt={{data:this.doc.docObj.dt('DOC'),field:"INPUT_NAME"}} 
                                    displayExpr="NAME"                       
                                    valueExpr="NAME"
                                    value=""
                                    searchEnabled={true}
                                    searchTimeout={200}
                                    minSearchLength={3}
                                    acceptCustomValue={true}
                                    openOnFieldClick={false}
                                    buttons={[
                                    {
                                        location:'after',name: 'searchButton',
                                        options:
                                        {
                                            icon:'more',
                                            elementAttr: {style: 'border:none; box-shadow:none; background:none;'},
                                            onClick:async()=>
                                            {
                                                let tmpData = await this.doc.customer.popCustomerShow()
                                                if(tmpData != null)
                                                {
                                                    this.doc.customer.setDocCustomer(tmpData)
                                                }
                                            }
                                        }
                                    }]}
                                    data={{
                                        source:
                                        {
                                            select:
                                            {
                                                query : `SELECT TOP 20 GUID,ISNULL(TITLE,'') + ISNULL(' - ' + CITY,'') AS NAME FROM CUSTOMER_VW_04 WHERE UPPER(TITLE) LIKE UPPER(@SEARCH + '%') OR UPPER(CODE) LIKE UPPER(@SEARCH + '%') ORDER BY TITLE ASC`,
                                                param : ['SEARCH:string|50']
                                            },
                                            sql:this.core.sql
                                        },
                                        dbSearch:true
                                    }}
                                    onSelectionChanged={(async(e)=>
                                    {
                                        let tmpData = this.doc.docObj.dt().length > 0 ? this.doc.docObj.dt()[0] : null
                                        if(tmpData != null && typeof tmpData.INPUT != "undefined")
                                        {
                                            if(e.selectedItem?.GUID != tmpData.INPUT && e.selectedItem?.NAME != tmpData.INPUT_NAME)
                                            {
                                                this.doc.customer.autoCompleteCustomer(e.selectedItem)
                                            }
                                        }
                                    }).bind(this)}
                                    onCustomItemCreating={(async(e)=>
                                    {
                                        e.customItem = {GUID:'',NAME:e.text};
                                        this.doc.customer.autoCompleteCustomer(e.customItem)
                                    }).bind(this)}
                                    param={this.param.filter({ELEMENT:'txtCustomerName',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'txtCustomerName',USERS:this.user.CODE})}
                                    >
                                        <Validator validationGroup={"frmDoc"  + this.tabIndex}>
                                            <RequiredRule message={this.t("validCustomerCode")} />
                                        </Validator> 
                                    </NdSelectBox>
                                </NdItem> 
                                {/* dtDocDate */}
                                <NdItem>
                                    <NdLabel text={this.t("dtDocDate")} alignment="right" />
                                    <NdDatePicker simple={true}  parent={this} id={"dtDocDate"}
                                    dt={{data:this.doc.docObj.dt('DOC'),field:"DOC_DATE"}}
                                    onValueChanged={(async(e)=>
                                    {
                                        this.doc.updateDoc()
                                        
                                        if(typeof this.dtExpDate.day != 'undefined')
                                        {
                                            this.dtExpDate.value = moment(e.value).add(this.dtExpDate.day, 'days')
                                        }
                                        
                                        if(moment(this.dtExpDate.value).diff(moment(e.value), 'days') == 0)
                                        {
                                            this.cmbExpiryType.value = 1
                                            this.dtExpDate.value = this.dtDocDate.value
                                        }
                                        else if(moment(this.dtExpDate.value).diff(moment(e.value), 'days') > 0)
                                        {
                                            this.cmbExpiryType.value = 0
                                        }
                                        else
                                        {
                                            this.dtExpDate.value = this.dtDocDate.value
                                        }
                                    }).bind(this)}
                                    >
                                        <Validator validationGroup={"frmDoc"  + this.tabIndex}>
                                            <RequiredRule message={this.t("validDocDate")} />
                                        </Validator> 
                                    </NdDatePicker>
                                </NdItem>
                                {/* cmbPricingList */}
                                <NdItem>
                                    <NdLabel text={this.t("cmbPricingList")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbPricingList" notRefresh={true}
                                    displayExpr="NAME"
                                    valueExpr="NO"
                                    dt={{data:this.doc.docObj.dt('DOC'),field:"PRICE_LIST_NO"}} 
                                    data={{source:{select:{query : `SELECT NO,NAME FROM ITEM_PRICE_LIST_VW_01 ORDER BY NO ASC`},sql:this.core.sql}}}
                                    param={this.param.filter({ELEMENT:'cmbPricingList',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'cmbPricingList',USERS:this.user.CODE})}
                                    onValueChanged={(async()=>{this.doc.priceListChange()}).bind(this)}
                                    />
                                </NdItem>
                                {/* txtCustomerCode */}
                                <NdItem>
                                    <NdLabel text={this.t("txtCustomerCode")} alignment="right" />
                                    <NdTextBox id="txtCustomerCode" parent={this} simple={true}  
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    dt={{data:this.doc.docObj.dt('DOC'),field:"INPUT_CODE"}} 
                                    readOnly={true}
                                    param={this.param.filter({ELEMENT:'txtCustomerCode',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'txtCustomerCode',USERS:this.user.CODE})}
                                    />
                                </NdItem>
                                {/* dtShipDate */}
                                <NdItem>
                                    <NdLabel text={this.t("dtShipDate")} alignment="right" />
                                    <NdDatePicker simple={true}  parent={this} id={"dtShipDate"}
                                    dt={{data:this.doc.docObj.dt('DOC'),field:"SHIPMENT_DATE"}}
                                    onValueChanged={(()=>{this.doc.updateDoc()}).bind(this)}
                                    >
                                        <Validator validationGroup={"frmDoc"  + this.tabIndex}>
                                            <RequiredRule message={this.t("validDocDate")} />
                                        </Validator> 
                                    </NdDatePicker>
                                </NdItem>
                                {/* cmbExpiryType */}
                                <NdItem>
                                    <NdLabel text={this.t("cmbExpiryType")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbExpiryType" height='fit-content' 
                                    displayExpr="VALUE"                       
                                    valueExpr="ID"
                                    dt={{data:this.doc.docObj.docCustomer.dt('DOC_CUSTOMER'),field:"EXPIRY_TYPE"}}
                                    data={{source:[{ID:0,VALUE:this.t("cmbTypeData.encaissement")},{ID:1,VALUE:this.t("cmbTypeData.debit")}]}}
                                    onValueChanged={(async(e)=>
                                    {
                                        if(this.cmbExpiryType.value == 1)
                                        {
                                            this.dtExpDate.value = this.dtDocDate.value
                                        }
                                    }).bind(this)}
                                    />
                                </NdItem>
                                {/* txtBarcode */}
                                <NdItem>
                                    <NdLabel text={this.t("txtBarcode")} alignment="right" />
                                    <NdTextBox id="txtBarcode" parent={this} simple={true}  placeholder={this.t("txtBarcodePlace")}
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    button=
                                    {
                                        [
                                            {
                                                id:'01',
                                                icon:"fa-solid fa-barcode",
                                                onClick:async(e)=>
                                                {
                                                    
                                                }
                                            }
                                        ]
                                    }
                                    onEnterKey={(async(e)=>
                                    {
                                        
                                    }).bind(this)}
                                    param={this.param.filter({ELEMENT:'txtBarcode',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'txtBarcode',USERS:this.user.CODE})}
                                    />
                                </NdItem>
                                {/* dtExpDate */}
                                <NdItem>
                                    <NdLabel text={this.t("dtExpDate")} alignment="right" />
                                    <NdDatePicker simple={true}  parent={this} id={"dtExpDate"}
                                    dt={{data:this.doc.docObj.docCustomer.dt('DOC_CUSTOMER'),field:"EXPIRY_DATE"}}
                                    startFormatDay={()=>{return this.dtDocDate.value}}
                                    onValueChanged={(async(e)=>
                                    {
                                        if(moment(e.value).diff(moment(this.dtDocDate.value), 'days') == 0)
                                        {
                                            this.cmbExpiryType.value = 1
                                        }
                                        else if(moment(e.value).diff(moment(this.dtDocDate.value), 'days') > 0)
                                        {
                                            this.cmbExpiryType.value = 0
                                        }
                                    }).bind(this)}
                                    >
                                        <Validator validationGroup={"frmPurcInv"  + this.tabIndex}>
                                            <RequiredRule message={this.t("validDocDate")} />
                                        </Validator> 
                                    </NdDatePicker>
                                </NdItem>
                                <NdEmptyItem/>                                
                            </NdForm>
                        </div>
                    </div>
                    {/* Grid */}
                    <div className="row px-2 pt-1">
                        <div className="col-12">
                            <NdForm colCount={1} onInitialized={(e)=>{this.doc.frmDocItems = e.component}} style={{height: '100%'}}> 
                                <NdItem style={{height: '100%'}}>
                                    <React.Fragment>
                                        <NdGrid parent={this} id={"grdSlsInv"+this.tabIndex} 
                                        showBorders={true} 
                                        columnsAutoWidth={true} 
                                        allowColumnReordering={true}
                                        allowColumnResizing={true} 
                                        filterRow={{visible:true}}
                                        height={'590px'} 
                                        width={'100%'}
                                        dbApply={false}
                                        sorting={{mode:'none'}}
                                        selection={{mode:"single"}}
                                        loadPanel={{enabled:true}}
                                        onRowPrepared={async(e)=>
                                        {
                                                                                     
                                        }}
                                        onRowUpdating={async(e)=>
                                        {
                                            
                                        }}
                                        onRowUpdated={async(e)=>
                                        {
                                            
                                        }}
                                        onRowRemoved={async (e)=>
                                        {
                                            
                                        }}
                                        onReady={async()=>
                                        {
                                            // this.grid = this["grdSlsInv" + this.tabIndex]
                                            // await this.grid.dataRefresh({source:this.doc.docObj.docItems.dt('DOC_ITEMS')});
                                        }}
                                        onToolbarPreparing={this.onGridToolbarPreparing}
                                        >
                                            <StateStoring enabled={true} type="custom" customLoad={this.loadState} customSave={this.saveState} storageKey={this.props.data.id + "_grdSlsInv"}/>
                                            <ColumnChooser enabled={true} />
                                            {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Paging defaultPageSize={20} /> : <Paging enabled={false} />}
                                            {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Pager visible={true} allowedPageSizes={[5,10,50]} showPageSizeSelector={true} /> : <Paging enabled={false} />}
                                            {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Scrolling mode="virtual" /> : <Scrolling mode="virtual" />}
                                            <Editing mode="cell" allowUpdating={true} allowDeleting={true} confirmDelete={false}/>
                                            <Export fileName={this.lang.t("menuOff.ftr_02_002")} enabled={true} allowExportSelectedData={true} />
                                            <Column dataField="LINE_NO" caption={this.t("LINE_NO")} visible={false} width={50} dataType={'number'} allowEditing={false} defaultSortOrder="desc"/>
                                            <Column dataField="CDATE_FORMAT" caption={this.t("grdSlsInv.clmCreateDate")} width={70} allowEditing={false} visible={false}/>
                                            <Column dataField="CUSER_NAME" caption={this.t("grdSlsInv.clmCuser")} width={75} allowEditing={false} visible={false}/>
                                            <Column dataField="ITEM_CODE" caption={this.t("grdSlsInv.clmItemCode")} width={150} editCellRender={this.cellRoleRender}/>
                                            <Column dataField="ITEM_NAME" caption={this.t("grdSlsInv.clmItemName")} width={350} editCellRender={this.cellRoleRender}/>
                                            <Column dataField="ORIGIN" caption={this.t("grdSlsInv.clmOrigin")} width={60} allowEditing={true} editCellRender={this.cellRoleRender} visible={false}/>
                                            <Column dataField="UNIT_QUANTITY" caption={this.t("grdSlsInv.clmSubQuantity")} dataType={'number'} width={100} 
                                                editorOptions={{step: 0.01, format: "#,##0.000"}} allowHeaderFiltering={false} 
                                                cellRender={(e)=>{return e.value + " / " + e.data.UNIT_SHORT}}/>
                                            <Column dataField="UNIT" caption={this.t("grdSlsInv.clmUnit")} width={120} allowEditing={true} editCellRender={this.cellRoleRender} 
                                                cellRender={(e)=>{return e.data.UNIT_NAME}}/>
                                            <Column dataField="QUANTITY" caption={this.t("grdSlsInv.clmQuantity")} width={90} dataType={'number'} 
                                                editorOptions={{step: 0.01, format: "#,##0.000"}}
                                                cellRender={(e)=>{return e.value + " / " + e.data.MAIN_UNIT_SHORT}} editCellRender={this.cellRoleRender} 
                                                allowEditing={this.sysParam.filter({ID:'fixedUnitForCondition',USERS:this.user.CODE}).getValue() == true ? false : true}/>
                                            <Column dataField="PRICE" caption={this.t("grdSlsInv.clmPrice")} width={85} dataType={'number'} 
                                                format={{ style: "currency", currency: Number.money.code, precision: 2}} editorOptions={{step: 0.01, format: "#,##0.0000"}}/>
                                            <Column dataField="UNIT_PRICE" caption={this.t("grdSlsInv.clmSubPrice")} dataType={'number'} width={90} allowHeaderFiltering={false} 
                                                cellRender={(e)=>{return e.value.toFixed(2) + Number.money.sign + " / " + e.data.UNIT_SHORT}} editorOptions={{step: 0.01, format: "#,##0.0000"}}/>
                                            <Column dataField="AMOUNT" caption={this.t("grdSlsInv.clmAmount")} width={90} 
                                                format={{ style: "currency", currency: Number.money.code,precision: 3}} allowEditing={false}/>
                                            <Column dataField="DISCOUNT" caption={this.t("grdSlsInv.clmDiscount")} dataType={'number'} width={85} 
                                                editCellRender={this.cellRoleRender} format={{ style: "currency", currency: Number.money.code,precision: 3}}/>
                                            <Column dataField="DISCOUNT_RATE" caption={this.t("grdSlsInv.clmDiscountRate")} width={60} dataType={'number'} visible={false}
                                                editCellRender={this.cellRoleRender}/>
                                            <Column dataField="MARGIN" caption={this.t("grdSlsInv.clmMargin")} dataType={'text'} width={80} allowEditing={false} visible={false}/>
                                            <Column dataField="VAT" caption={this.t("grdSlsInv.clmVat")} width={80} 
                                                format={{ style: "currency", currency: Number.money.code,precision: 3}} allowEditing={false}/>
                                            <Column dataField="VAT_RATE" caption={this.t("grdSlsInv.clmVatRate")} width={50} allowEditing={false} visible={false}/>
                                            <Column dataField="TOTALHT" caption={this.t("grdSlsInv.clmTotalHt")} allowEditing={false} width={135}
                                                format={{ style: "currency", currency: Number.money.code,precision: 2}} allowHeaderFiltering={false}/>
                                            <Column dataField="TOTAL" caption={this.t("grdSlsInv.clmTotal")} width={145} 
                                                format={{ style: "currency", currency: Number.money.code,precision: 3}} allowEditing={false}/>
                                            <Column dataField="CONNECT_REF" caption={this.t("grdSlsInv.clmDispatch")} width={100} allowEditing={false} visible={false}/>
                                            <Column dataField="LOT_CODE" caption={this.t("grdSlsInv.clmPartiLot")} width={100} allowEditing={false} visible={false}/>
                                            <Column dataField="DESCRIPTION" caption={this.t("grdSlsInv.clmDescription")} width={100} visible={false}/>
                                        </NdGrid>
                                        <ContextMenu dataSource={this.rightItems} width={200} target={"#grdSlsInv"+this.tabIndex}
                                        onItemClick={(async(e)=>
                                        {
                                            if(e.itemData.text == this.t("getDispatch"))
                                            {
                                                this.getDispatch()
                                            }
                                            else if(e.itemData.text == this.t("getOrders"))
                                            {
                                                this.getOrders()
                                            }
                                            else if(e.itemData.text == this.t("getOffers"))
                                            {
                                                this.getOffers()
                                            }
                                            else if(e.itemData.text == this.t("getProforma"))
                                            {
                                                this.getProforma()
                                            }
                                        }).bind(this)} />
                                    </React.Fragment>    
                                </NdItem>
                            </NdForm>
                        </div>
                    </div>
                    {/* Document */}
                    <div>
                        {this.doc.render()}
                    </div>
                </ScrollView>                
            </div>
        )
    }
}