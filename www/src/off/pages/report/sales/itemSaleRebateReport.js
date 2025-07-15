import React from 'react';
import App from '../../../lib/app.js';
import moment from 'moment';
import Toolbar,{Item} from 'devextreme-react/toolbar';
import ScrollView from 'devextreme-react/scroll-view';
import NdGrid,{Column, ColumnChooser,Paging,Pager,Scrolling,Export,StateStoring} from '../../../../core/react/devex/grid.js';
import NdTextBox, { Validator,  RequiredRule } from '../../../../core/react/devex/textbox.js'
import NbDateRange from '../../../../core/react/bootstrap/daterange.js';
import NdPopGrid from '../../../../core/react/devex/popgrid.js';
import { NdForm, NdItem, NdLabel} from '../../../../core/react/devex/form.js';
import NdButton from '../../../../core/react/devex/button.js';
import { dialog } from '../../../../core/react/devex/dialog.js';

export default class itemSaleRebateReport extends React.PureComponent
{
    constructor(props)
    {
        super(props)

        this.core = App.instance.core;
        this.groupList = [];
        this.btnGetirClick = this.btnGetirClick.bind(this)
        this.loadState = this.loadState.bind(this)
        this.saveState = this.saveState.bind(this)
        this.tabIndex = props.data.tabkey
    }
    componentDidMount()
    {
        setTimeout(async () => 
        {
        }, 1000);
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
                groupBy : this.groupList,
                select : 
                {
                    query : "SELECT ITEM, " +
                    "ITEM_CODE, " +
                    "INPUT, " +
                    "INPUT_NAME, " +
                    "INPUT_CODE, " +
                    "ISNULL((SELECT SUM(QUANTITY) FROM DOC_ITEMS WHERE DOC_ITEMS.INPUT = DOC_ITEMS_VW_01.INPUT AND DELETED = 0 AND TYPE = 1 AND DOC_TYPE = 40 AND REBATE = 0 AND DOC_DATE >= @FIRST_DATE AND DOC_DATE <= @LAST_DATE AND DOC_ITEMS.ITEM = DOC_ITEMS_VW_01.ITEM),0) AS DISPATCH, " +
                    "ISNULL((SELECT SUM(QUANTITY) FROM DOC_ITEMS_VW_01 AS FACTURE WHERE FACTURE.INPUT = DOC_ITEMS_VW_01.INPUT AND FACTURE.TYPE = 1 AND DOC_DATE >= @FIRST_DATE AND DOC_DATE <= @LAST_DATE AND (FACTURE.DOC_TYPE = 20 OR (FACTURE.DOC_TYPE = 40 AND FACTURE.INVOICE_DOC_GUID <> '00000000-0000-0000-0000-000000000000')) AND FACTURE.REBATE = 0 AND FACTURE.ITEM = DOC_ITEMS_VW_01.ITEM),0) AS INVOICE, " +
                    "ISNULL((SELECT SUM(QUANTITY) FROM DOC_ITEMS WHERE DOC_ITEMS.INPUT = DOC_ITEMS_VW_01.INPUT AND DELETED = 0 AND TYPE = 0 AND DOC_DATE >= @FIRST_DATE AND DOC_DATE <= @LAST_DATE AND DOC_TYPE IN(40,20) AND REBATE = 1 AND DOC_ITEMS.ITEM = DOC_ITEMS_VW_01.ITEM),0) AS REBATE " +
                    "FROM DOC_ITEMS_VW_01 " +
                    "WHERE TYPE = 1 AND DOC_TYPE IN(40,20) AND DOC_DATE >= @FIRST_DATE AND DOC_DATE <= @LAST_DATE AND ITEM_CODE = @ITEM_CODE " +
                    "GROUP BY ITEM,INPUT,INPUT_NAME,ITEM_CODE,INPUT_CODE ",
                    param : ['FIRST_DATE:date','LAST_DATE:date','ITEM_CODE:string|50'],
                    value : [this.dtDate.startDate,this.dtDate.endDate,this.txtItemCode.CODE]
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
                            <NdForm colCount={2} id="itemSaleRabate">
                                <NdItem>
                                    <NdLabel text={this.t("txtItemCode")} alignment="right" />
                                    <NdTextBox id="txtItemCode" parent={this} simple={true} 
                                    onEnterKey={(async()=>
                                    {
                                        await this.pg_txtItemCode.setVal(this.txtItemCode.value)
                                        this.pg_txtItemCode.show()
                                        this.pg_txtItemCode.onClick = (data) =>
                                        { 
                                            if(data.length > 0)
                                            {
                                                this.txtItemCode.setState({value:data[0].NAME})
                                                this.txtItemCode.CODE = data[0].CODE
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
                                                    this.pg_txtItemCode.show()
                                                    this.pg_txtItemCode.onClick = (data) =>
                                                    {
                                                        if(data.length > 0)
                                                        {
                                                            this.txtItemCode.setState({value:data[0].NAME})
                                                            this.txtItemCode.CODE = data[0].CODE
                                                        }
                                                    }
                                                }
                                            },
                                            {
                                                id:'02',
                                                icon:'clear',
                                                onClick:()=>
                                                {
                                                    this.txtItemCode.setState({value:''})
                                                    this.txtItemCode.CODE =''
                                                }
                                            },
                                        ]
                                    }
                                    >
                                    <Validator validationGroup={"itemSaleRebate" + this.tabIndex}>
                                        <RequiredRule message={this.t("validCode")} />
                                    </Validator>  
                                    </NdTextBox>
                                    {/*Stok SECIMI POPUP */}
                                    <NdPopGrid id={"pg_txtItemCode"} parent={this} container={'#' + this.props.data.id + this.tabIndex}  
                                    visible={false}
                                    position={{of:'#' + this.props.data.id + this.tabIndex}} 
                                    showTitle={true} 
                                    showBorders={true}
                                    width={'90%'}
                                    height={'90%'}
                                    title={this.t("pg_txtItemCode.title")} //
                                    search={true}
                                    data = 
                                    {{
                                        source:
                                        {
                                            select:
                                            {  
                                                query : "SELECT GUID,CODE,NAME,VAT,COST_PRICE,UNIT, " 
                                                        + "ISNULL((SELECT TOP 1 BARCODE FROM ITEM_BARCODE WHERE DELETED = 0 AND ITEM_BARCODE.ITEM = ITEMS_VW_01.GUID ORDER BY CDATE DESC),'') AS BARCODE FROM ITEMS_VW_01 WHERE UPPER(CODE) LIKE UPPER(@VAL) OR UPPER(NAME) LIKE UPPER(@VAL)",
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
                                        <Column dataField="CODE" caption={this.t("pg_txtItemCode.clmCode")} width={150} />
                                        <Column dataField="NAME" caption={this.t("pg_txtItemCode.clmName")} width={500} defaultSortOrder="asc" />
                                    </NdPopGrid>
                                </NdItem> 
                                <NdItem>
                                    <NbDateRange id={"dtDate"} parent={this} startDate={moment().startOf('month')} endDate={moment().endOf('month')}/>
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
                            <NdButton text={this.t("btnGet")} type="success" width="100%" validationGroup={"itemSaleRebate" + this.tabIndex} 
                             onClick={async (e)=>
                            {
                                if(e.validationGroup.validate().status == "valid")
                                {
                                    this.btnGetirClick()
                                }
                            }}
                            ></NdButton>
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
                            loadPanel={{enabled:true}}
                            >
                                {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Paging defaultPageSize={20} /> : <Paging enabled={false} />}
                                {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Pager visible={true} allowedPageSizes={[5,10,50]} showPageSizeSelector={true} /> : <Paging enabled={false} />}
                                {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Scrolling mode="standart" /> : <Scrolling mode="infinite" />}
                                <StateStoring enabled={true} type="custom" customLoad={this.loadState} customSave={this.saveState} storageKey={this.props.data.id + "_grdListe"}/>
                                <ColumnChooser enabled={true} />
                                <Export fileName={this.lang.t("menuOff.slsRpt_01_005")} enabled={true} allowExportSelectedData={true} />
                                <Column dataField="INPUT_CODE" caption={this.t("grdListe.clmCode")} visible={true} /> 
                                <Column dataField="INPUT_NAME" caption={this.t("grdListe.clmName")} visible={true}/> 
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