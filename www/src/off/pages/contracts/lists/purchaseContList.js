import React from 'react';
import App from '../../../lib/app.js';
import moment from 'moment';
import Toolbar,{Item} from 'devextreme-react/toolbar';
import ScrollView from 'devextreme-react/scroll-view';
import NdGrid,{Column, Paging,Pager,Scrolling,Export, StateStoring, ColumnChooser} from '../../../../core/react/devex/grid.js';
import NdTextBox from '../../../../core/react/devex/textbox.js'
import NdButton from '../../../../core/react/devex/button.js';
import NdPopGrid from '../../../../core/react/devex/popgrid.js';
import { dialog } from '../../../../core/react/devex/dialog.js';
import { NdToast } from '../../../../core/react/devex/toast.js';
import { NdForm,NdItem, NdLabel } from '../../../../core/react/devex/form.js';

export default class purchaseContList extends React.PureComponent
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
        this.txtCustomerCode.CODE = ''
    }
    loadState() 
    {
        let tmpLoad = this.access.filter({ELEMENT:'grdListeState',USERS:this.user.CODE})
        return tmpLoad.getValue()
    }
    saveState(e)
    {
        let tmpSave = this.access.filter({ELEMENT:'grdListeState',USERS:this.user.CODE})
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
                    query : "SELECT CDATE_FORMAT,LUSER_NAME,ITEM_CODE,ITEM_NAME,CUSTOMER_NAME,PRICE,QUANTITY,START_DATE FROM ITEM_PRICE_VW_01 " +
                            "WHERE ((CUSTOMER_CODE = @CUSTOMER_CODE) OR (@CUSTOMER_CODE = '')) AND "+ 
                            " TYPE = 1  AND CONTRACT_GUID <> '00000000-0000-0000-0000-000000000000' ORDER BY CUSTOMER_CODE,ITEM_CODE",
                    param : ['CUSTOMER_CODE:string|50'],
                    value : [this.txtCustomerCode.CODE]
                },
                sql : this.core.sql
            }
        }
        App.instance.setState({isExecute:true})
        await this.grdPurcContList.dataRefresh(tmpSource)
        App.instance.setState({isExecute:false})
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
                                                id: 'cnt_01_001',
                                                text: this.t('menu'),
                                                path: 'contracts/cards/purchaseContract.js'
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
                                    <Column dataField="GENUS_NAME" caption={this.t("pg_txtCustomerCode.clmGenusName")} width={150} />
                                    
                                </NdPopGrid>
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
                            <NdButton text={this.t("btnGet")} type="success" width="100%" onClick={this.btnGetClick}></NdButton>
                        </div>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <NdGrid id="grdPurcContList"
                            parent={this} 
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
                                <StateStoring enabled={true} type="custom" customLoad={this.loadState} customSave={this.saveState} storageKey={this.props.data.id + "_grdPurcContList"}/>
                                <ColumnChooser enabled={true} />
                                <Export fileName={this.lang.t("menuOff.cnt_01_001")} enabled={true} allowExportSelectedData={true} />
                                <Column dataField="CDATE_FORMAT" caption={this.t("grdPurcContList.clmCreateDate")} visible={true} width={130}/> 
                                <Column dataField="LUSER_NAME" caption={this.t("grdPurcContList.clmUser")} visible={true} width={100}/> 
                                <Column dataField="ITEM_CODE" caption={this.t("grdPurcContList.clmCode")} visible={true} width={140}/> 
                                <Column dataField="ITEM_NAME" caption={this.t("grdPurcContList.clmName")} visible={true} width={300}/> 
                                <Column dataField="CUSTOMER_NAME" caption={this.t("grdPurcContList.clmCustomerName")} visible={true} width={200}/> 
                                <Column dataField="PRICE" caption={this.t("grdPurcContList.clmPrıce")} visible={true} format={{ style: "currency", currency:Number.money.code,precision: 2}} width={150}/> 
                                <Column dataField="QUANTITY" caption={this.t("grdPurcContList.clmQuantity")} visible={true} width={80}/> 
                                <Column dataField="START_DATE" caption={this.t("grdPurcContList.clmStartDate")} visible={false} 
                                editorOptions={{value:null}}
                                cellRender={(e) => 
                                {
                                    if(moment(e.value).format("YYYY-MM-DD") != '1970-01-01')
                                    {
                                        return e.text
                                    }
                                    
                                    return
                                }}/>  
                                <Column dataField="FINISH_DATE" caption={this.t("grdPurcContList.clmFinishDate")} visible={false} 
                                editorOptions={{value:null}}
                                cellRender={(e) => 
                                {
                                    if(moment(e.value).format("YYYY-MM-DD") != '1970-01-01')
                                    {
                                        return e.text
                                    }
                                    
                                    return
                                }}/>  
                                <Column dataField="DEPOT_NAME" caption={this.t("grdPurcContList.clmDepotName")} visible={false} />              
                            </NdGrid>
                        </div>
                        <NdToast id={"toast"} parent={this} displayTime={2000} position={{at:"top center",offset:'0px 110px'}}/>
                    </div> 
                </ScrollView>
            </div>
        )
    }
}