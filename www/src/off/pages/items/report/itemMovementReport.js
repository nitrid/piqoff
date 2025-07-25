import React from 'react';
import App from '../../../lib/app.js';

import Toolbar,{Item} from 'devextreme-react/toolbar';
import Form, { EmptyItem, Label } from 'devextreme-react/form';
import ScrollView from 'devextreme-react/scroll-view';

import { itemsCls } from '../../../../core/cls/items.js'
import { docCls } from '../../../../core/cls/doc.js'
import NdGrid,{ Column, Editing, ColumnChooser, StateStoring, Paging, Pager, Scrolling, Export } from '../../../../core/react/devex/grid.js';
import NdTextBox from '../../../../core/react/devex/textbox.js'
import NdButton from '../../../../core/react/devex/button.js';
import NdPopGrid from '../../../../core/react/devex/popgrid.js';
import { dialog } from '../../../../core/react/devex/dialog.js';
import { NdForm, NdItem, NdLabel, NdEmptyItem } from '../../../../core/react/devex/form.js';
import { NdToast } from '../../../../core/react/devex/toast.js';
export default class itemMovementReport extends React.PureComponent
{
    constructor(props)
    {
        super(props)
        
        this.core = App.instance.core;
        
        this.docObj = new docCls()
        this.itemsObj = new itemsCls()

        Number.money = this.sysParam.filter({ID:'MoneySymbol',TYPE:0}).getValue()

        this.btnGetClick = this.btnGetClick.bind(this)
        this.saveState = this.saveState.bind(this)
        this.loadState = this.loadState.bind(this)

        this.tabIndex = props.data.tabkey
    }
    async componentDidMount()
    {
        await this.core.util.waitUntil(0)
        this.init()
    }
    async init()
    {
        this.docObj.clearAll();
        this.itemsObj.clearAll();
        this.docObj.docItems.addEmpty()
    }
    async getItem(pCode)
    {
        App.instance.loading.show()
        await this.itemsObj.load({CODE:pCode});
        this.txtRef.value = this.itemsObj.dt()[0].CODE
        this.txtRef.GUID = this.itemsObj.dt()[0].GUID
        App.instance.loading.hide()
    }
    loadState() 
    {
        let tmpLoad = this.access.filter({ELEMENT:'grdSlsInvState',USERS:this.user.CODE})
        return tmpLoad.getValue()
    }
    saveState(e)
    {
        let tmpSave = this.access.filter({ELEMENT:'grdSlsInvState',USERS:this.user.CODE})
        tmpSave.setValue(e)
        tmpSave.save()
    }
    async findPartiLot(pGuid)
    {
        App.instance.loading.show()

        let tmpSource =
        {
            source:
            {
                select:
                {
                    query : `SELECT GUID,LOT_CODE,SKT FROM ITEM_PARTI_LOT_VW_01 WHERE UPPER(LOT_CODE) LIKE UPPER(@VAL) AND ITEM = '${pGuid}'`,
                    param : ['VAL:string|50'],
                },
                sql:this.core.sql
            }
        }
        
        this.pg_partiLot.setSource(tmpSource)
        this.pg_partiLot.onClick = async(data) =>
        {
            this.txtPartiLot.value = data[0].LOT_CODE
        }

        App.instance.loading.hide()
    }
   
    async btnGetClick()
    {
        if(this.txtRef.GUID == '00000000-0000-0000-0000-000000000000')
        {
            this.toast.show({message:this.t("msgItemSelect.msg"),type:"warning"})
            return
        }

        let tmpSource =
        {
            source : 
            {
                groupBy : this.groupList,
                select : 
                {
                    query : `SELECT *, (SELECT TOP 1 VALUE FROM DB_LANGUAGE WHERE TAG = (SELECT [dbo].[FN_DOC_TYPE_NAME](TYPE,DOC_TYPE,REBATE)) 
                            AND LANG = @LANG) AS TYPE_NAMES FROM DOC_ITEMS_VW_01 WHERE ITEM = @ITEM AND LOT_CODE = @LOT_CODE`,
                    param : ['ITEM:string|50','LOT_CODE:string|50','LANG:string|50'],
                    value : [this.txtRef.GUID,this.txtPartiLot.value,localStorage.getItem('lang')]
                },
                sql : this.core.sql
            }
        }

        App.instance.loading.show()
        await this.grdItemMovementReport.dataRefresh(tmpSource)
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
                            <NdForm colCount={3} id="frmCriter">
                                {/* txtRef */}
                                <NdItem>                                    
                                    <NdLabel text={this.t("txtRef")} alignment="right" />
                                    <NdTextBox id="txtRef" parent={this} tabIndex={this.tabIndex} dt={{data:this.itemsObj.dt('ITEMS'),field:"CODE"}} simple={true}
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    button=
                                    {
                                        [
                                            {
                                                id:'01',
                                                icon:'more',
                                                onClick:()=>
                                                {
                                                    this.pg_txtRef.show()
                                                    this.pg_txtRef.onClick = (data) =>
                                                    {
                                                        if(data.length > 0)
                                                        {
                                                            this.getItem(data[0].CODE)
                                                        }
                                                    }
                                                }
                                            },
                                        ]
                                    }
                                    onEnterKey={(async()=>
                                    {
                                        await this.pg_txtRef.setVal(this.txtRef.value)
                                        this.pg_txtRef.show()
                                        this.pg_txtRef.onClick = async(data) =>
                                        {
                                            if(data.length > 0)
                                            {
                                                this.getItem(data[0].CODE)
                                            }
                                        }
                                    }).bind(this)}
                                    param={this.param.filter({ELEMENT:'txtRef',USERS:this.user.CODE})}
                                    selectAll={true}                           
                                    />     
                                    {/* STOK SEÇİM POPUP */}
                                    <NdPopGrid id={"pg_txtRef"} parent={this} container={'#' + this.props.data.id + this.tabIndex} 
                                    visible={false}
                                    position={{of:'#' + this.props.data.id + this.tabIndex}} 
                                    showTitle={true} 
                                    showBorders={true}
                                    width={'90%'}
                                    height={'90%'}
                                    title={this.t("pg_txtRef.title")} 
                                    search={true}
                                    data = 
                                    {{
                                        source:
                                        {
                                            select:
                                            {
                                                query : `SELECT GUID,CODE,NAME,STATUS FROM ITEMS_VW_04 WHERE UPPER(CODE) LIKE UPPER(@VAL) OR UPPER(NAME) LIKE UPPER(@VAL)`,
                                                param : ['VAL:string|50']
                                            },
                                            sql:this.core.sql
                                        }
                                    }}
                                    deferRendering={true}
                                    >
                                        <Column dataField="CODE" caption={this.t("pg_txtRef.clmCode")} width={'20%'} />
                                        <Column dataField="NAME" caption={this.t("pg_txtRef.clmName")} width={'70%'} defaultSortOrder="asc" />
                                        <Column dataField="STATUS" caption={this.t("pg_txtRef.clmStatus")} width={'10%'} />
                                    </NdPopGrid>
                                </NdItem>
                                <NdEmptyItem colSpan={2}/>
                                {/* txtPartiLot */}
                                <NdItem>                                    
                                    <NdLabel text={this.t("txtPartiLot")} alignment="right" />
                                    <NdTextBox id="txtPartiLot" parent={this} simple={true} tabIndex={this.tabIndex}
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    button=
                                    {
                                        [
                                            {
                                                id:'01',
                                                icon:'more',
                                                onClick:()=>
                                                {
                                                    if(this.itemsObj.dt().length == 0)
                                                    {
                                                        return
                                                    }
                                                    else 
                                                    {
                                                        this.pg_partiLot.show()
                                                        this.findPartiLot(this.itemsObj.dt()[0].GUID)
                                                    }
                                                }
                                            },
                                        ]
                                    }
                                    readOnly={true}
                                    param={this.param.filter({ELEMENT:'txtPartiLot',USERS:this.user.CODE})}
                                    selectAll={true}                           
                                    />     
                                    {/* PARTILOT SEÇİM POPUP */}
                                    <NdPopGrid id={"pg_partiLot"} parent={this} container={'#' + this.props.data.id + this.tabIndex} 
                                    visible={false}
                                    position={{of:'#' + this.props.data.id + this.tabIndex}} 
                                    showTitle={true} 
                                    showBorders={true}
                                    width={'90%'}
                                    height={'90%'}
                                    title={this.t("pg_partiLot.title")} 
                                    selection={{mode:"single"}}
                                    search={true}
                                    >
                                        <Column dataField="LOT_CODE" caption={this.t("pg_partiLot.clmCode")} width={'20%'} />
                                        <Column dataField="SKT" caption={this.t("pg_partiLot.clmSkt")} width={'50%'} dataType="date" format={"dd/MM/yyyy"} defaultSortOrder="asc" />
                                    </NdPopGrid>
                                </NdItem>
                                <NdEmptyItem colSpan={1}/>
                                <NdItem>
                                    <NdButton text={this.t("btnGet")} type="success" width="100%" onClick={this.btnGetClick}></NdButton>
                                </NdItem>
                            </NdForm>
                        </div>
                    </div>
                    <div className="row px-2 pt-1">
                        <div className="col-12">
                            <NdForm colCount={1} id="frmGrid" height={'100%'}>
                                <NdItem height={'100%'}>
                                <NdGrid id="grdItemMovementReport" parent={this} 
                                selection={{mode:"single"}} 
                                showBorders={true}
                                filterRow={{visible:true}} 
                                headerFilter={{visible:true}}
                                sorting={{ mode: 'single' }}
                                height={'690px'}
                                width={"100%"}
                                columnAutoWidth={true}
                                allowColumnReordering={true}
                                allowColumnResizing={true}
                                >                            
                                    <StateStoring enabled={true} type="custom" customLoad={this.loadState} customSave={this.saveState} storageKey={this.props.data.id + "_grdSlsInv"}/>
                                    <ColumnChooser enabled={true} />
                                    <Paging defaultPageSize={10} />
                                    <Pager visible={true} allowedPageSizes={[5,10,20,50,100]} showPageSizeSelector={true} />
                                    <Scrolling mode="standart" />
                                    <Editing mode="cell" allowUpdating={true} allowDeleting={true} confirmDelete={false}/>
                                    <Export fileName={this.lang.t("menuOff.stk_05_006")} enabled={true} allowExportSelectedData={true} />                                
                                    <Column dataField="LUSER" caption={this.t("grdItemMovementReport.clmLuser")} visible={true} width={80}/> 
                                    <Column dataField="LDATE" caption={this.t("grdItemMovementReport.clmLdate")} visible={true} width={150}  dataType="datetime" format={"dd/MM/yyyy - HH:mm:ss"}/>
                                    <Column dataField="TYPE_NAMES" caption={this.t("grdItemMovementReport.clmTypeName")} visible={true} width={130}/>
                                    <Column dataField="REF" caption={this.t("grdItemMovementReport.clmRef")} visible={true} width={150}/> 
                                    <Column dataField="REF_NO" caption={this.t("grdItemMovementReport.clmRefNo")} visible={true}  width={70}/> 
                                    <Column dataField="DOC_DATE" caption={this.t("grdItemMovementReport.clmDocDate")} visible={true}  width={100} dataType="datetime" format={"dd/MM/yyyy"}/> 
                                    <Column dataField="ITEM_NAME" caption={this.t("grdItemMovementReport.clmItemName")} visible={true}  width={150}/> 
                                    <Column dataField="QUANTITY" caption={this.t("grdItemMovementReport.clmQuantity")} visible={true}  width={100}/> 
                                    <Column dataField="INPUT_NAME" caption={this.t("grdItemMovementReport.clmInputName")} visible={true}  width={150}/> 
                                    <Column dataField="OUTPUT_NAME" caption={this.t("grdItemMovementReport.clmOutputName")} visible={true}  width={150}/> 
                                </NdGrid>
                                </NdItem>
                            </NdForm>

                        </div>
                    </div>
                    <NdToast id={"toast"} parent={this} displayTime={2000} position={{at:"top center",offset:'0px 110px'}}/>
                </ScrollView>
            </div>
        )
    }
}