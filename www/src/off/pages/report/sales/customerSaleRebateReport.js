import React from 'react';
import App from '../../../lib/app.js';
import moment from 'moment';

import Toolbar,{Item} from 'devextreme-react/toolbar';
import ScrollView from 'devextreme-react/scroll-view';

import NdGrid,{Column, ColumnChooser,Paging,Pager,Scrolling,Export,StateStoring} from '../../../../core/react/devex/grid.js';
import NdTextBox, { Validator, RequiredRule } from '../../../../core/react/devex/textbox.js'
import NbDateRange from '../../../../core/react/bootstrap/daterange.js';
import NdPopGrid from '../../../../core/react/devex/popgrid.js';
import NdButton from '../../../../core/react/devex/button.js';
import { dialog } from '../../../../core/react/devex/dialog.js';
import {NdForm,NdItem,NdLabel} from '../../../../core/react/devex/form.js';
export default class customerSaleRebateReport extends React.PureComponent
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
    componentDidMount()
    {
        setTimeout(async () => { }, 1000);
    }

    loadState()
    {
        let tmpLoad = this.access.filter({ELEMENT:'grdListeState',USERS:this.user.CODE})
        return tmpLoad.getValue()
    }
    saveState(e)
    {
        let tmpSave = this.access.filter({ELEMENT:'grdListeState',USERS:this.user.CODE,PAGE:this.props.data.id,APP:"OFF"})
        tmpSave.setValue(e)
        tmpSave.save()
    }

    async btnGetirClick()
    {
       
        let tmpSource =
        {
            source : 
            {
                select : 
                {
                    query : 
                        `SELECT ITEM, 
                        ITEM_NAME, 
                        ITEM_CODE, 
                        INPUT, 
                        INPUT_NAME, 
                        INPUT_CODE, 
                        ISNULL((SELECT SUM(QUANTITY) FROM DOC_ITEMS WHERE DOC_ITEMS.INPUT = DOC_ITEMS_VW_01.INPUT AND DELETED = 0 AND TYPE = 1 AND DOC_TYPE = 40 AND REBATE = 0 AND DOC_DATE >= @FIRST_DATE AND DOC_DATE <= @LAST_DATE AND DOC_ITEMS.ITEM = DOC_ITEMS_VW_01.ITEM),0) AS DISPATCH, 
                        ISNULL((SELECT SUM(QUANTITY) FROM DOC_ITEMS_VW_01 AS FACTURE WHERE FACTURE.INPUT = DOC_ITEMS_VW_01.INPUT AND FACTURE.TYPE = 1 AND DOC_DATE >= @FIRST_DATE AND DOC_DATE <= @LAST_DATE AND (FACTURE.DOC_TYPE = 20 OR (FACTURE.DOC_TYPE = 40 AND FACTURE.INVOICE_DOC_GUID <> '00000000-0000-0000-0000-000000000000')) AND FACTURE.REBATE = 0 AND FACTURE.ITEM = DOC_ITEMS_VW_01.ITEM),0) AS INVOICE, 
                        ISNULL((SELECT SUM(QUANTITY) FROM DOC_ITEMS WHERE DOC_ITEMS.INPUT = DOC_ITEMS_VW_01.INPUT AND DELETED = 0 AND TYPE = 0 AND DOC_DATE >= @FIRST_DATE AND DOC_DATE <= @LAST_DATE AND DOC_TYPE IN(40,20) AND REBATE = 1 AND DOC_ITEMS.ITEM = DOC_ITEMS_VW_01.ITEM),0) AS REBATE 
                        FROM DOC_ITEMS_VW_01 
                        WHERE TYPE = 1 AND DOC_TYPE IN(40,20) AND DOC_DATE >= @FIRST_DATE AND DOC_DATE <= @LAST_DATE AND INPUT_CODE = @CUSTOMER_CODE 
                        GROUP BY ITEM,INPUT,INPUT_NAME,ITEM_NAME,ITEM_CODE,INPUT_CODE `,
                    param : ['FIRST_DATE:date','LAST_DATE:date','CUSTOMER_CODE:string|50'],
                    value : [this.dtDate.startDate,this.dtDate.endDate,this.txtCustomerCode.CODE]
                },
                sql : this.core.sql
            }
        }

        await this.grdListe.dataRefresh(tmpSource)
    }
    render()
    {
        return(
            <div id={this.props.data.id + this.tabIndex}>
                <ScrollView>
                    <div className="row px-2 pt-1">
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
                    <div className="row px-2 pt-1" style={{height:'80px'}}>
                        <div className="col-12">
                            <NdForm colCount={2} id="itemSaleRabate">
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
                                            this.txtCustomerCode.CODE = data[0].CODE
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
                                <NdItem>
                                    <NdLabel text={this.t("dtDate")} alignment="right" />
                                    <NbDateRange id={"dtDate"} parent={this} startDate={moment().startOf('month')} endDate={moment().endOf('month')}/>
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
                            <NdButton text={this.t("btnGet")} type="success" width="100%" validationGroup={"customerSaleRebate" + this.tabIndex} 
                            onClick={async (e)=>
                            {
                                if(e.validationGroup.validate().status == "valid")
                                {
                                    await this.btnGetirClick()
                                }
                            }}
                            ></NdButton>
                        </div>
                    </div>
                    <div className="row px-2 pt-1">
                        <div className="col-12">
                            <NdGrid id="grdListe" parent={this} 
                            selection={{mode:"multiple"}} 
                            showBorders={true}
                            filterRow={{visible:false}} 
                            headerFilter={{visible:false}}
                            height={'700px'} 
                            width={'100%'}
                            columnAutoWidth={true}
                            allowColumnReordering={true}
                            allowColumnResizing={true}
                            loadPanel={{enabled:true}}
                            >
                                {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Paging defaultPageSize={20} /> : <Paging enabled={false} />}
                                {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Pager visible={true} allowedPageSizes={[5,10,50]} showPageSizeSelector={true} /> : <Paging enabled={false} />}
                                {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Scrolling mode="standart" /> : <Scrolling mode="virtual" />}
                                <StateStoring enabled={true} type="custom" customLoad={this.loadState} customSave={this.saveState} storageKey={this.props.data.id + "_grdListe"}/>
                                <ColumnChooser enabled={true} />
                                <Export fileName={this.lang.t("menuOff.slsRpt_01_005")} enabled={true} allowExportSelectedData={true} />
                                <Column dataField="ITEM_CODE" caption={this.t("grdListe.clmCode")} visible={true} /> 
                                <Column dataField="ITEM_NAME" caption={this.t("grdListe.clmName")} visible={true}/> 
                                <Column dataField="DISPATCH" caption={this.t("grdListe.clmDispatch")} visible={true}/> 
                                <Column dataField="INVOICE" caption={this.t("grdListe.clmInvoice")} width={120}  visible={true}/> 
                                <Column dataField="REBATE" caption={this.t("grdListe.clmRebate")} width={120} visible={true}/> 
                            </NdGrid>
                        </div>
                    </div>
                </ScrollView>
            </div>
        )
    }
}