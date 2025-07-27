import React from 'react';
import App from '../../../lib/app.js';
import moment from 'moment';

import Toolbar from 'devextreme-react/toolbar';
import Form, { Label,Item } from 'devextreme-react/form';
import ScrollView from 'devextreme-react/scroll-view';

import NdGrid,{Column,Paging,Pager,Export,Scrolling,Editing,StateStoring,ColumnChooser} from '../../../../core/react/devex/grid.js';
import NdTextBox from '../../../../core/react/devex/textbox.js'
import NdButton from '../../../../core/react/devex/button.js';
import NdDatePicker from '../../../../core/react/devex/datepicker.js';
import NdPopGrid from '../../../../core/react/devex/popgrid.js';
import { dialog } from '../../../../core/react/devex/dialog.js';

export default class salesOfrList extends React.PureComponent
{
    constructor(props)
    {
        super(props)
        
        this.core = App.instance.core;
        this.groupList = [];
        this.btnGetClick = this.btnGetClick.bind(this)
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
    async Init()
    {
        this.dtFirst.value=moment(new Date()).format("YYYY-MM-DD");
        this.dtLast.value=moment(new Date()).format("YYYY-MM-DD");
        this.txtCustomerCode.CODE = ''
        this.grdSlsOfrList.devGrid.clearFilter('header')
        this.grdSlsOfrList.devGrid.clearSorting()
        this.grdSlsOfrList.devGrid.clearFilter('row')
    }
    loadState() 
    {
        let tmpLoad = this.access.filter({ELEMENT:'grdSlsOfferState',USERS:this.user.CODE})
        return tmpLoad.getValue()
    }
    saveState(e)
    {
        let tmpSave = this.access.filter({ELEMENT:'grdSlsOfferState',USERS:this.user.CODE,PAGE:this.props.data.id,APP:"OFF"})
        tmpSave.setValue(e)
        tmpSave.save()
    }
    async btnGetClick()
    {
        
        let tmpSource =
        {
            source : 
            {
                groupBy : this.groupList,
                select : 
                {
                    query : `SELECT * FROM DOC_VW_01 
                            WHERE ((INPUT_CODE = @INPUT_CODE) OR (@INPUT_CODE = '')) AND 
                            ((DOC_DATE >= @FIRST_DATE) OR (@FIRST_DATE = '19700101')) AND ((DOC_DATE <= @LAST_DATE) OR (@LAST_DATE = '19700101'))  
                            AND TYPE = 1 AND DOC_TYPE = 61  AND REBATE = 0 ORDER BY DOC_DATE DESC,REF_NO DESC`,
                    param : ['INPUT_CODE:string|50','FIRST_DATE:date','LAST_DATE:date'],
                    value : [this.txtCustomerCode.CODE,this.dtFirst.value,this.dtLast.value]
                },
                sql : this.core.sql
            }
        }

        App.instance.loading.show()
        await this.grdSlsOfrList.dataRefresh(tmpSource)
        App.instance.loading.hide()
    }
    render()
    {
        return(
            <div id={this.props.data.id + this.props.data.tabkey}>
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
                                        icon: 'add',
                                        onClick: async () => 
                                        {
                                            App.instance.menuClick(
                                            {
                                                id: 'tkf_02_002',
                                                text: this.t('menu'),
                                                path: 'offers/documents/salesOffer.js',
                                            })
                                        }
                                    }    
                                } />
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
                    <div className="row px-2 pt-1" style={{height: '80px'}}>
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
                                }>
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
                                        }
                                    }
                                }>
                                    <Column dataField="CODE" caption={this.t("pg_txtCustomerCode.clmCode")} width={150} />
                                    <Column dataField="TITLE" caption={this.t("pg_txtCustomerCode.clmTitle")} width={500} defaultSortOrder="asc" />
                                    <Column dataField="TYPE_NAME" caption={this.t("pg_txtCustomerCode.clmTypeName")} width={150} />
                                    <Column dataField="GENUS_NAME" caption={this.t("pg_txtCustomerCode.clmGenusName")} width={150}/>
                                </NdPopGrid>
                                </Item> 
                            </Form>
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
                            <NdButton text={this.t("btnGet")} type="success" width="100%" onClick={this.btnGetClick}></NdButton>
                        </div>
                    </div>
                    <div className="row px-2 pt-1">
                        <div className="col-12">
                            <NdGrid id="grdSlsOfrList" parent={this} 
                            selection={{mode:"multiple"}} 
                            height={700}
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
                                    id: 'tkf_02_002',
                                    text: this.lang.t('menuOff.tkf_02_002'),
                                    path: 'offers/documents/salesOffer.js',
                                    pagePrm:{GUID:e.data.GUID}
                                })
                            }}
                            >                            
                                <StateStoring enabled={true} type="custom" customLoad={this.loadState} customSave={this.saveState} storageKey={this.props.data.id + "_grdSlsOffer"}/>
                                <ColumnChooser enabled={true} />
                                {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Paging defaultPageSize={20} /> : <Paging enabled={false} />}
                                {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Pager visible={true} allowedPageSizes={[5,10,50]} showPageSizeSelector={true} /> : <Paging enabled={false} />}
                                {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Scrolling mode="standart" /> : <Scrolling mode="infinite" />}
                                <Editing mode="cell" />
                                <Export fileName={this.lang.t("menuOff.sip_01_002")} enabled={true} allowExportSelectedData={true} />
                                <Column dataField="REF" caption={this.t("grdSlsOfrList.clmRef")} visible={true} width={200}/> 
                                <Column dataField="REF_NO" caption={this.t("grdSlsOfrList.clmRefNo")} visible={true} width={100}/> 
                                <Column dataField="INPUT_CODE" caption={this.t("grdSlsOfrList.clmInputCode")} visible={false}/> 
                                <Column dataField="INPUT_NAME" caption={this.t("grdSlsOfrList.clmInputName")} visible={true}/> 
                                <Column dataField="OUTPUT_NAME" caption={this.t("grdSlsOfrList.clmOutputName")} visible={false}/> 
                                <Column dataField="DOC_DATE" caption={this.t("grdSlsOfrList.clmDate")} visible={true} width={200} dataType="datetime" format={"dd/MM/yyyy"}/> 
                                <Column dataField="AMOUNT" caption={this.t("grdSlsOfrList.clmAmount")} visible={false} format={{ style: "currency", currency: Number.money.code,precision: 2}}/> 
                                <Column dataField="VAT" caption={this.t("grdSlsOfrList.clmVat")} visible={false} format={{ style: "currency", currency: Number.money.code,precision: 2}}/> 
                                <Column dataField="TOTAL" caption={this.t("grdSlsOfrList.clmTotal")} visible={true} format={{ style: "currency", currency: Number.money.code,precision: 2}}/>              
                            </NdGrid>
                        </div>
                    </div>
                </ScrollView>
            </div>
        )
    }
}