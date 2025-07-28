import React from 'react';
import App from '../../../lib/app.js';
import moment from 'moment';

import Toolbar,{Item} from 'devextreme-react/toolbar';
import ScrollView from 'devextreme-react/scroll-view';

import NdGrid,{Column, ColumnChooser,Paging,Pager,Scrolling,Export,StateStoring} from '../../../../core/react/devex/grid.js';
import NdTextBox from '../../../../core/react/devex/textbox.js'
import NdButton from '../../../../core/react/devex/button.js';
import NdPopGrid from '../../../../core/react/devex/popgrid';
import { NdToast } from '../../../../core/react/devex/toast.js';
import { NdForm,NdItem, NdLabel } from '../../../../core/react/devex/form.js';
import { dialog } from '../../../../core/react/devex/dialog.js';

export default class salesContList extends React.PureComponent
{
    constructor(props)
    {
        super(props)

        this.core = App.instance.core

        this.tabIndex = props.data.tabkey
        this.groupList = [];
        
        this.btnGetClick = this.btnGetClick.bind(this)
        this.loadState = this.loadState.bind(this)
        this.saveState = this.saveState.bind(this)
        
    }
    componentDidMount()
    {
        setTimeout(async () =>  { this.Init() }, 1000);
    }
    async Init()
    {
        this.txtCustomerCode.CODE = ''
    }
    async loadState() 
    {
        let tmpLoad = await this.access.filter({ELEMENT:'grdListeState',USERS:this.user.CODE})
        return tmpLoad.getValue()
    }
    async saveState(e)
    {
        let tmpSave = await this.access.filter({ELEMENT:'grdListeState',USERS:this.user.CODE,PAGE:this.props.data.id,APP:"OFF"})
        await tmpSave.setValue(e)
        await tmpSave.save()
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
                    query : `SELECT CDATE_FORMAT,LUSER_NAME,ITEM_CODE,ITEM_NAME,CUSTOMER_NAME,PRICE,QUANTITY,START_DATE 
                            FROM ITEM_PRICE_VW_01 WHERE ((CUSTOMER_CODE = @CUSTOMER_CODE) OR (@CUSTOMER_CODE = '')) AND 
                            TYPE = 0 AND CONTRACT_GUID <> '00000000-0000-0000-0000-000000000000' ORDER BY CUSTOMER_CODE,ITEM_CODE`,
                    param : ['CUSTOMER_CODE:string|50'],
                    value : [this.txtCustomerCode.CODE]
                },
                sql : this.core.sql
            }
        }
        App.instance.loading.show()
        await this.grdSlsContList.dataRefresh(tmpSource)
        App.instance.loading.hide()

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
                                        icon: 'add',
                                        onClick: async () => 
                                        {
                                            App.instance.menuClick(
                                                {
                                                    id: 'cnt_01_002',
                                                    text: this.t('menu'),
                                                    path: 'contracts/cards/salesContract.js'
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
                    <div className="row px-2 pt-1" style={{height:'80px'}}>
                        <div className="col-12">
                            <NdForm colCount={2} id="frmCriter">
                            <NdItem>
                                <NdLabel text={this.t("txtCustomerCode")} alignment="right" />
                                <NdTextBox id="txtCustomerCode" parent={this} simple={true} 
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
                                            query : `SELECT GUID,CODE,TITLE,NAME,LAST_NAME,[TYPE_NAME],[GENUS_NAME] 
                                                     FROM CUSTOMER_VW_03 WHERE (UPPER(CODE) LIKE UPPER(@VAL) OR UPPER(TITLE) LIKE 
                                                     UPPER(@VAL)) AND STATUS = 1`,
                                            param : ['VAL:string|50']
                                        },
                                        sql:this.core.sql
                                    }
                                }}
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
                            <NdGrid id="grdSlsContList" 
                            parent={this} 
                            selection={{mode:"multiple"}} 
                            height={700}
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
                                <StateStoring enabled={true} type="custom" customLoad={this.loadState} customSave={this.saveState} storageKey={this.props.data.id + "_grdSlsContList"}/>
                                <ColumnChooser enabled={true} />
                                <Export fileName={this.lang.t("menuOff.cnt_01_002")} enabled={true} allowExportSelectedData={true} />
                                <Column dataField="CDATE_FORMAT" caption={this.t("grdSlsContList.clmCreateDate")} visible={true} width={130}/> 
                                <Column dataField="LUSER_NAME" caption={this.t("grdSlsContList.clmUser")} visible={true} width={100}/>
                                <Column dataField="ITEM_CODE" caption={this.t("grdSlsContList.clmCode")} visible={true} width={140}/> 
                                <Column dataField="ITEM_NAME" caption={this.t("grdSlsContList.clmName")} visible={true} width={300}/> 
                                <Column dataField="CUSTOMER_NAME" caption={this.t("grdSlsContList.clmCustomerName")} visible={true} width={130}/> 
                                <Column dataField="PRICE" caption={this.t("grdSlsContList.clmPrıce")} visible={true} format={{ style: "currency", currency: Number.money.code,precision: 2}} width={150}/> 
                                <Column dataField="QUANTITY" caption={this.t("grdSlsContList.clmQuantity")} visible={true} width={80}/> 
                                <Column dataField="START_DATE" caption={this.t("grdSlsContList.clmStartDate")} visible={false} 
                                editorOptions={{value:null}}
                                cellRender={(e) => 
                                {
                                    if(moment(e.value).format("YYYY-MM-DD") != '1970-01-01')
                                    {
                                        return e.text
                                    }
                                    return
                                }}/>  
                                <Column dataField="FINISH_DATE" caption={this.t("grdSlsContList.clmFinishDate")} visible={false} 
                                editorOptions={{value:null}}
                                cellRender={(e) => 
                                {
                                    if(moment(e.value).format("YYYY-MM-DD") != '1970-01-01')
                                    {
                                        return e.text
                                    }
                                    return
                                }}/>  
                                <Column dataField="DEPOT_NAME" caption={this.t("grdSlsContList.clmDepotName")} visible={false} />              
                            </NdGrid>
                        </div>
                        <NdToast id={"toast"} parent={this} displayTime={3000} position={{at:"top center",offset:'0px 110px'}}/>
                    </div>
                </ScrollView>
            </div>
        )
    }
}