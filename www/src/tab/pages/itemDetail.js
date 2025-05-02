import React from 'react';
import App from '../lib/app.js';
import moment from 'moment';
import ScrollView from 'devextreme-react/scroll-view';
import NbButton from '../../core/react/bootstrap/button';
import NdTextBox,{ Button,Validator, NumericRule, RequiredRule, CompareRule } from '../../core/react/devex/textbox'
import NdSelectBox from '../../core/react/devex/selectbox'
import NdButton from '../../core/react/devex/button'
import NbPopUp from '../../core/react/bootstrap/popup';
import Form, { Label,Item, EmptyItem } from 'devextreme-react/form';
import Toolbar from 'devextreme-react/toolbar';
import { LoadPanel } from 'devextreme-react/load-panel';
import NdGrid,{Column, ColumnChooser,ColumnFixing,Paging,Pager,Scrolling,Export, Summary, TotalItem}from '../../core/react/devex/grid.js';
import NbDateRange from '../../core/react/bootstrap/daterange.js';
import NbLabel from '../../core/react/bootstrap/label.js';

import NdPopGrid from '../../core/react/devex/popgrid.js';
import NdDialog, { dialog } from '../../core/react/devex/dialog.js';
import NbItemView from '../tools/itemView.js';

export default class itemDetail extends React.PureComponent
{
    constructor(props)
    {
        super(props)
        this.core = App.instance.core;
        this.t = App.instance.lang.getFixedT(null,null,"itemDetail")
        this.lang = App.instance.lang;
        this.state = 
        {
            isExecute : false
        }

        this._ItemSearch = this._ItemSearch.bind(this)
        this._btnGetirClick = this._btnGetirClick.bind(this)
    }
    async componentDidMount()
    {
        await this.core.util.waitUntil(0)
        setTimeout(async () => 
        {
            this.itemName.GUID = ''
        }, 500);
        this.init()
    }
    async init()
    {
        
    }
    async _btnGetirClick()
    {
        if(this.itemName.GUID != '')
        {
            let tmpSource =
            {
                source : 
                {
                    groupBy : this.groupList,
                    select : 
                    {
                        query : "SELECT  ITEM_QUANTITY.QUANTITY AS QUANTITY ,DEPOT_VW_01.NAME AS NAME FROM DEPOT_VW_01 INNER JOIN ITEM_QUANTITY ON ITEM_QUANTITY.DEPOT = DEPOT_VW_01.GUID WHERE ITEM_QUANTITY.ITEM = @ITEM ",
                        param : ['ITEM:string|50'],
                        value : [this.itemName.GUID]
                    },
                    sql : this.core.sql
                }
            }
            this.setState({isExecute:true})
            await this.grdListe.dataRefresh(tmpSource)
            await this.grdListe.dataRefresh(this.grdListe.data.datatable)
            let tmpQuery = 
            {
                query : "SELECT * FROM ITEMS_BARCODE_MULTICODE_VW_01 WHERE GUID = @ITEM ",
                param : ['ITEM:string|50'],
                value : [this.itemName.GUID]
            }
            let tmpData = await this.core.sql.execute(tmpQuery) 
            if(tmpData.result.recordset.length >0)
            {
                this.txtItemGroup.value = tmpData.result.recordset[0].MAIN_GRP_NAME
                this.txtItemPrice.value = Number(tmpData.result.recordset[0].PRICE_SALE_VAT_EXT).round(3) + ' €'
            }
            this.setState({isExecute:false})

        }
        else
        {
            let tmpConfObj =
            {
                id:'msgNotItem',showTitle:true,title:this.t("msgNotItem.title"),showCloseButton:true,width:'500px',height:'200px',
                button:[{id:"btn01",caption:this.t("msgNotItem.btn01"),location:'after'}],
                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgNotItem.msg")}</div>)
            }
            await dialog(tmpConfObj);
        }
           
    }
    async _ItemSearch()
    {
        let tmpSource =
        {
            source : 
            {
                groupBy : this.groupList,
                select : 
                {
                    query : "SELECT GUID,CODE,NAME FROM ITEMS_VW_01 WHERE (UPPER(CODE) LIKE UPPER(@VAL + '%') OR UPPER(NAME) LIKE UPPER(@VAL + '%')) AND STATUS = 1",
                    param : ['VAL:string|50'],
                    value : [this.txtItemSearch.value]
                },
                sql : this.core.sql
            }
        }
        this.setState({isExecute:true})
        await this.grdItem.dataRefresh(tmpSource)
        this.setState({isExecute:false})
    }
    render()
    {
        return(
            <div>
                <LoadPanel
                shadingColor="rgba(0,0,0,0)"
                position={{ of: '#root' }}
                visible={this.state.isExecute}
                showIndicator={true}
                shading={true}
                showPane={true}
                />
                <div style={{height:'50px',backgroundColor:'#f5f6fa',top:'65px',position:'sticky',borderBottom:'1px solid #7f8fa6'}}>
                    <div className="row">
                        <div className="col-3" align="left" style={{paddingTop:'5px'}}>
                        </div>
                        <div className="col-6" align="center" style={{paddingRight:'4px', paddingTop:'5px'}}>
                            <NdTextBox id={"txtItem"} parent={this} simple={true} placeholder={this.t("txtItem")} readOnly={true}
                             button={
                            [
                                {
                                    id:'01',
                                    icon:'more',
                                    location:'after',
                                    onClick:async()=>
                                    {
                                        this.popItem.show()
                                    }
                                }                                                    
                            ]}
                            />
                        </div>
                    </div>
                </div>
                <div style={{paddingTop:"65px"}}>
                    <div className="row px-2 pt-2">
                        <Form colCount={3}>
                            <Item colSpan={3}> 
                                <div>
                                    <h3 className="text-center">
                                        <NbLabel id="itemName" parent={this} value={""}/>
                                    </h3>
                                </div>
                            </Item>
                            <Item colSpan={3}> 
                                <div>
                                    <h5 className="text-center">
                                        <NbLabel  value={this.t("txtItemGroup")+ ": "} />
                                        <NbLabel id="txtItemGroup" parent={this} value={""}/>
                                    </h5>
                                </div>
                            </Item>
                            <Item colSpan={4}> 
                                <Label text={this.t("txtItemListName")} alignment="right" />
                                <NdSelectBox simple={true} 
                                    parent={this} 
                                    id="txtItemListName" 
                                    showClearButton={true} 
                                    notRefresh={true}  
                                    searchEnabled={true}
                                    displayExpr="LIST_NAME"                       
                                    valueExpr="LIST_NO"
                                    data={{source: {select : {query:"SELECT DISTINCT LIST_NAME,LIST_NO FROM ITEM_PRICE_VW_01 WHERE TYPE= 0 ORDER BY LIST_NAME ASC"},sql : this.core.sql}}}
                                    onValueChanged={async (e)=>
                                    {
                                        if(!e.value)
                                        {
                                            if(!this.dialogShown)
                                            {
                                                this.dialogShown = true;
                                                dialog({
                                                    id:'msgItemListNameRequired',
                                                    showTitle:true,
                                                    title:this.t("msgItemListNameRequired.title"),
                                                    showCloseButton:true,
                                                    width:'500px',
                                                    height:'200px',
                                                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgItemListNameRequired.msg")}</div>),
                                                    onHidden: () => {
                                                        this.dialogShown = false;
                                                    }
                                                });
                                            }
                                            return;
                                        }

                                        if(!this.itemName.CODE)
                                        {
                                            if(!this.dialogShown)
                                            {
                                                this.dialogShown = true;
                                                dialog({
                                                    id:'msgItemNameRequired',
                                                    showTitle:true,
                                                    title:this.t("msgItemNameRequired.title"),
                                                    showCloseButton:true,
                                                    width:'500px',
                                                    height:'200px',
                                                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgItemNameRequired.msg")}</div>),
                                                    onHidden: () => {
                                                        this.dialogShown = false;
                                                    }
                                                });
                                            }
                                            return;
                                        }

                                        let tmpQuery = {
                                            query: "SELECT PRICE FROM ITEM_PRICE_VW_01 WHERE ITEM_CODE = @ITEM AND LIST_NO = @LIST_NO",
                                            param: ['ITEM:string|50','LIST_NO:int'],
                                            value: [this.itemName.CODE, e.value]
                                        }
                                        let tmpData = await this.core.sql.execute(tmpQuery);
                                        if(tmpData.result.recordset.length > 0)
                                        {
                                            this.txtItemPrice.value = tmpData.result.recordset[0].PRICE;                                                
                                        }
                                        else
                                        {
                                            this.txtItemPrice.value = '';
                                        }
                                    }}
                                />
                            </Item>
                            <Item colSpan={3}> 
                                <div>
                                    <h5 className="text-center">
                                        <NbLabel  value={this.t("txtItemPrice")+ ": "} />
                                        <NbLabel id="txtItemPrice" parent={this} value={""}/>
                                    </h5>
                                </div>
                            </Item>
                        </Form>    
                        <div className="row px-2 pt-2">
                        <div className="col-12">
                            <NdGrid id="grdListe" parent={this} 
                            selection={{mode:"single"}} 
                            showBorders={true}
                            height={'auto'} 
                            width={'100%'}
                            columnAutoWidth={true}
                            allowColumnReordering={true}
                            allowColumnResizing={true}
                            loadPanel={{enabled:true}}
                            > 
                                <Column dataField="NAME" caption={this.t("grdListe.clmName")} visible={true} width={350}/> 
                                <Column dataField="QUANTITY" caption={this.t("grdListe.clmQuantity")} visible={true} width={100}/> 
                            </NdGrid>
                        </div>
                    </div>
                    </div>
                     {/* CARI SECIMI POPUP */}
                     <div>                            
                        <NbPopUp id={"popItem"} parent={this} title={""} fullscreen={true}>
                            <div>
                                <div className='row' style={{paddingTop:"10px"}}>
                                    <div className='col-10' align={"left"}>
                                        <h2 className='text-danger'>{this.t('popItem.title')}</h2>
                                    </div>
                                    <div className='col-2' align={"right"}>
                                        <NbButton className="form-group btn btn-block btn-outline-dark" style={{height:"40px",width:"40px",backgroundColor:"#154c79"}}
                                        onClick={()=>
                                        {
                                            this.popItem.hide();
                                        }}>
                                            <i className="fa-solid fa-xmark fa-1x"></i>
                                        </NbButton>
                                    </div>
                                </div>                                    
                                <div className='row' style={{paddingTop:"10px"}}>
                                    <div className='col-12'>
                                        <NdTextBox id="txtItemSearch" parent={this} simple={true} selectAll={true}
                                        onEnterKey={(async()=>
                                            {
                                                this._ItemSearch()
                                            }).bind(this)}/>
                                    </div>
                                </div>
                                <div className='row' style={{paddingTop:"10px"}}>
                                    <div className='col-6'>
                                        <NbButton className="btn btn-block btn-primary" style={{width:"100%", backgroundColor:"#154c79"}}
                                        onClick={()=>
                                        {
                                            this._ItemSearch()
                                        }}>
                                            {this.t('popItem.btn01')}
                                        </NbButton>
                                    </div>
                                    <div className='col-6'>
                                        <NbButton className="btn btn-block btn-primary" style={{width:"100%", backgroundColor:"#154c79"}}
                                        onClick={(async()=>
                                        {
                                            this.itemName.GUID = this.grdItem.getSelectedData()[0].GUID
                                            this.itemName.value = this.grdItem.getSelectedData()[0].NAME
                                            this.itemName.CODE = this.grdItem.getSelectedData()[0].CODE
                                            this._btnGetirClick()
                                            this.popItem.hide();
                                        }).bind(this)}>
                                            {this.t('popItem.btn02')}
                                        </NbButton>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col-12'>
                                        <NdGrid parent={this} id={"grdItem"} 
                                        showBorders={true} 
                                        columnsAutoWidth={true} 
                                        headerFilter={{visible:true}}
                                        selection={{mode:"single"}}
                                        height={'400'}
                                        width={'100%'}
                                        >
                                            <Paging defaultPageSize={10} />
                                            <Pager visible={true} allowedPageSizes={[5,10,20,50,100]} showPageSizeSelector={true} />
                                            <Scrolling mode="standart" />
                                            <Column dataField="CODE" caption={this.t("popItem.clmCode")} width={200}/>
                                            <Column dataField="NAME" caption={this.t("popItem.clmName")} width={400}/>
                                        </NdGrid>
                                    </div>
                                </div>
                            </div>
                        </NbPopUp>
                    </div>                                     
                </div>
            </div>
        )
    }
}