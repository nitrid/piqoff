import React from 'react';
import App from '../../../lib/app.js';

import Toolbar,{ Item } from 'devextreme-react/toolbar';
import ScrollView from 'devextreme-react/scroll-view';
import { itemsCls } from '../../../../core/cls/items.js'
import NdGrid,{ Column, Editing, ColumnChooser, StateStoring, Paging, Pager, Scrolling, Export } from '../../../../core/react/devex/grid.js';
import NdTextBox from '../../../../core/react/devex/textbox.js'
import NdSelectBox from '../../../../core/react/devex/selectbox.js';
import NdButton from '../../../../core/react/devex/button.js';
import NdCheckBox from '../../../../core/react/devex/checkbox.js';
import { dialog } from '../../../../core/react/devex/dialog.js';
import NdPopGrid from '../../../../core/react/devex/popgrid.js';
import { NdForm, NdItem, NdLabel, NdEmptyItem } from '../../../../core/react/devex/form.js';

export default class partiLotQuantityReport extends React.PureComponent
{
    constructor(props)
    {
        super(props)

        this.itemsObj = new itemsCls()
        this.core = App.instance.core;
        
        this.btnGetClick = this.btnGetClick.bind(this)
        this.saveState = this.saveState.bind(this)
        this.loadState = this.loadState.bind(this)
        
        this.tabIndex = props.data.tabkey
    }
    componentDidMount()
    {
        this.core.util.waitUntil(0)
        this.init()
    }
    async init()
    {
        this.itemsObj.clearAll();
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
    async getItem(pCode)
    {
        App.instance.setState({isExecute:true})
        await this.itemsObj.load({CODE:pCode});
        this.txtRef.value = this.itemsObj.dt()[0].CODE
        this.txtRef.GUID = this.itemsObj.dt()[0].GUID
        App.instance.setState({isExecute:false})
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
                    query : `SELECT * FROM [dbo].[FN_ITEM_PARTILOT_INVENTORY](@DEPOT,@REF) {0}`,
                    param : ['DEPOT:string|50', 'REF:string|50'],
                    value : [this.cmbDepot.value, this.txtRef.GUID]
                },
                sql : this.core.sql
            }
        }

        if(this.chkZeroQuantity.value == false)
        {
            tmpSource.source.select.query = tmpSource.source.select.query.replace("{0}", "WHERE QUANTITY <> 0")
        }
        else
        {
            tmpSource.source.select.query = tmpSource.source.select.query.replace("{0}", "")
        }

        App.instance.setState({isExecute:true})
        await this.grdListe.dataRefresh(tmpSource)
        App.instance.setState({isExecute:false})
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
                            <NdForm colCount={2} id="frmKriter">
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
                                <NdEmptyItem/>
                                <NdItem>
                                    <NdLabel text={this.t("cmbDepot")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbDepot" showClearButton={true} notRefresh={true}  searchEnabled={true}
                                    displayExpr="NAME"                       
                                    valueExpr="GUID"
                                    value="1A428DFC-48A9-4AC6-AF20-4D0A4D33F316"
                                    param={this.param.filter({ELEMENT:'cmbDepot',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'cmbDepot',USERS:this.user.CODE})}
                                    data={{source: {select : {query:"SELECT GUID,CODE,NAME FROM DEPOT ORDER BY CODE ASC"},sql : this.core.sql}}}
                                    />
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
                            <NdCheckBox id="chkZeroQuantity" parent={this} text={this.t("chkZeroQuantity")}  value={false} ></NdCheckBox>
                        </div>
                        <div className="col-3">
                            <NdButton text={this.t("btnGet")} type="success" width="100%" onClick={this.btnGetClick}></NdButton>
                        </div>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <NdGrid id="grdListe" parent={this} 
                            selection={{mode:"multiple"}} 
                            showBorders={true}
                            filterRow={{visible:true}} 
                            headerFilter={{visible:true}}
                            height={'690'} 
                            width={'100%'}
                            columnAutoWidth={true}
                            allowColumnReordering={true}
                            allowColumnResizing={true}
                            loadPanel={{enabled:true}}
                            >                            
                                <StateStoring enabled={true} type="custom" customLoad={this.loadState} customSave={this.saveState} storageKey={this.props.data.id + "_grdSlsInv"}/>
                                <ColumnChooser enabled={true} />
                                <Paging defaultPageSize={10} />
                                <Pager visible={true} allowedPageSizes={[5,10,20,50,100]} showPageSizeSelector={true} />
                                <Scrolling mode="standart" />
                                <Editing mode="cell" allowUpdating={true} allowDeleting={true} confirmDelete={false}/>
                                <Export fileName={this.lang.t("menuOff.stk_05_007")} enabled={true} allowExportSelectedData={true} />
                                <Column dataField="NAME" caption={this.t("grdListe.clmName")} visible={true}/> 
                                <Column dataField="CODE" caption={this.t("grdListe.clmCode")} visible={true} /> 
                                <Column dataField="LOT_CODE" caption={this.t("grdListe.clmLotCode")} visible={true} /> 
                                <Column dataField="QUANTITY" caption={this.t("grdListe.clmQuantity")} visible={true} defaultSortOrder="desc"/>
                                <Column dataField="SKT" caption={this.t("grdListe.clmSkt")} dataType="datetime" format={"dd/MM/yyyy"} visible={true}/>  
                            </NdGrid>
                        </div>
                    </div>
                </ScrollView>
            </div>
        )
    }
}