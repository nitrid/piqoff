import React from 'react';
import App from '../../../lib/app.js';
import moment from 'moment';

import Toolbar,{Item} from 'devextreme-react/toolbar';
import Form, { EmptyItem, Label } from 'devextreme-react/form';
import ScrollView from 'devextreme-react/scroll-view';
import {itemsCls} from '../../../../core/cls/items.js'
import {docCls} from '../../../../core/cls/doc.js'
import NdGrid,{Column,Editing,ColumnChooser,ColumnFixing,Paging,Pager,Scrolling,Export} from '../../../../core/react/devex/grid.js';
import NdTextBox from '../../../../core/react/devex/textbox.js'
import NdSelectBox from '../../../../core/react/devex/selectbox.js';
import NdNumberBox from '../../../../core/react/devex/numberbox.js';
import NdDropDownBox from '../../../../core/react/devex/dropdownbox.js';
import NdListBox from '../../../../core/react/devex/listbox.js';
import NdPopUp from '../../../../core/react/devex/popup.js';
import NdButton from '../../../../core/react/devex/button.js';
import NdCheckBox from '../../../../core/react/devex/checkbox.js';
import NdDatePicker from '../../../../core/react/devex/datepicker.js';
import NbDateRange from '../../../../core/react/bootstrap/daterange.js';
import NbRadioButton from "../../../../core/react/bootstrap/radiogroup.js";
import NbLabel from "../../../../core/react/bootstrap/label.js";
import NdPopGrid from '../../../../core/react/devex/popgrid.js';
import NbButton from "../../../../core/react/bootstrap/button.js";
import { dialog } from '../../../../core/react/devex/dialog.js';
import { dataset,datatable,param,access } from "../../../../core/core.js";
import { posExtraCls} from "../../../../core/cls/pos.js";



export default class itemMovementReport extends React.PureComponent
{
    constructor(props)
    {
        super(props)
        
        this.core = App.instance.core;
        this.groupList = [];
        this._btnGetClick = this._btnGetClick.bind(this)
        this.docObj = new docCls()
        this.itemsObj = new itemsCls()

        Number.money = this.sysParam.filter({ID:'MoneySymbol',TYPE:0}).getValue()


        this.tabIndex = props.data.tabkey
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
        this.docObj.clearAll();
        this.itemsObj.clearAll();
        this.docObj.docItems.addEmpty()
        
    }

    async getItem(pCode)
    {
        App.instance.setState({isExecute:true})
        await this.itemsObj.load({CODE:pCode});
        this.txtRef.value = this.itemsObj.dt()[0].CODE
        this.txtRef.GUID = this.itemsObj.dt()[0].GUID
        //this.docObj.docItems.dt()[0].ITEM = this.itemsObj.dt()[0].GUID
        App.instance.setState({isExecute:false})

    }
    async findPartiLot(pGuid)
    {
        App.instance.setState({isExecute:true})


        let tmpSource =
            {
                source:
                {
                    select:
                    {
                        query : "SELECT GUID,LOT_CODE,SKT FROM ITEM_PARTI_LOT_VW_01 WHERE UPPER(LOT_CODE) LIKE UPPER(@VAL) AND ITEM = '" + pGuid + "'",
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
        App.instance.setState({isExecute:false})
    }
   
    async _btnGetClick()
    {
        console.log('this.txtRef.GUID ',this.txtRef.GUID )
        
        if(this.txtRef.GUID == '00000000-0000-0000-0000-000000000000')
        {
            let tmpConfObj =
            {
                id:'msgItemSelect',showTitle:true,title:this.t("msgItemSelect.title"),showCloseButton:true,width:'500px',height:'200px',
                button:[{id:"btn01",caption:this.t("msgItemSelect.btn01"),location:'after'}],
                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgItemSelect.msg")}</div>)
            }

            await dialog(tmpConfObj);
            return
        }
        console.log('this.txtPartiLot.value',this.txtPartiLot.value)
        console.log('this.txtRef.GUID',this.txtRef.GUID)
        let tmpSource =
        {
            source : 
            {
                groupBy : this.groupList,
                select : 
                {
                    query : `SELECT *, (SELECT TOP 1 VALUE FROM DB_LANGUAGE WHERE TAG = (SELECT [dbo].[FN_DOC_TYPE_NAME](TYPE,DOC_TYPE,REBATE)) AND LANG = @LANG) AS TYPE_NAMES FROM DOC_ITEMS_VW_01 WHERE ITEM = @ITEM AND LOT_CODE = @LOT_CODE`,
                    param : ['ITEM:string|50','LOT_CODE:string|50','LANG:string|50'],
                    value : [this.txtRef.GUID,this.txtPartiLot.value,localStorage.getItem('lang')]
                },
                sql : this.core.sql
            }
        }
        App.instance.setState({isExecute:true})
        await this.grdItemMovementReport.dataRefresh(tmpSource)
        console.log('this.grdItemMovementReport.dt()',this.grdItemMovementReport)
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
                            <Form colCount={3} id="frmCriter">
                                {/* txtRef */}
                                <Item>                                    
                                    <Label text={this.t("txtRef")} alignment="right" />
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
                                                            console.log('data',data)
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
                                        >     
                                        </NdTextBox>      
                                        {/* STOK SEÇİM POPUP */}
                                        <NdPopGrid id={"pg_txtRef"} parent={this} container={"#root"} 
                                        visible={false}
                                        position={{of:'#root'}} 
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
                                                    query : "SELECT GUID,CODE,NAME,STATUS FROM ITEMS_VW_01 WHERE UPPER(CODE) LIKE UPPER(@VAL) OR UPPER(NAME) LIKE UPPER(@VAL)",
                                                    param : ['VAL:string|50']
                                                },
                                                sql:this.core.sql
                                            }
                                        }}
                                        button=
                                        {
                                            [
                                                {
                                                    id:'tst',
                                                    icon:'more',
                                                    onClick:()=>
                                                    {
                                                        console.log(1111)
                                                    }
                                                }
                                            ]
                                        }
                                        deferRendering={true}
                                        >
                                            <Column dataField="CODE" caption={this.t("pg_txtRef.clmCode")} width={'20%'} />
                                            <Column dataField="NAME" caption={this.t("pg_txtRef.clmName")} width={'70%'} defaultSortOrder="asc" />
                                            <Column dataField="STATUS" caption={this.t("pg_txtRef.clmStatus")} width={'10%'} />
                                    </NdPopGrid>
                                </Item>
                                <EmptyItem colSpan={2}/>
                                {/* txtPartiLot */}
                                <Item>                                    
                                    <Label text={this.t("txtPartiLot")} alignment="right" />
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
                                    >     
                                    </NdTextBox>      
                                    {/* PARTILOT SEÇİM POPUP */}
                                    <NdPopGrid id={"pg_partiLot"} parent={this} container={"#root"} 
                                    visible={false}
                                    position={{of:'#root'}} 
                                    showTitle={true} 
                                    showBorders={true}
                                    width={'90%'}
                                    height={'90%'}
                                    title={this.t("pg_partiLot.title")} 
                                    selection={{mode:"single"}}
                                    search={true}
                                    button=
                                    {
                                        [
                                            {
                                                id:'tst',
                                                icon:'more',
                                                onClick:()=>
                                                {

                                                }
                                            }
                                        ]
                                    }
                                    >
                                        <Column dataField="LOT_CODE" caption={this.t("pg_partiLot.clmCode")} width={'20%'} />
                                        <Column dataField="SKT" caption={this.t("pg_partiLot.clmSkt")} width={'50%'} dataType="date" format={"dd/MM/yyyy"} defaultSortOrder="asc" />
                                    </NdPopGrid>
                                </Item>
                                <EmptyItem colSpan={1}/>
                                <Item>
                                <NdButton text={this.t("btnGet")} type="success" width="100%" onClick={this._btnGetClick}></NdButton>
                                </Item>
                            </Form>
                        </div>
                    </div>
                    {/* <div className="row px-2 pt-2">
                        <div className="col-3">
                        </div>
                        <div className="col-3">
                            
                        </div>
                        <div className="col-3">
                            
                        </div>
                        <div className="col-3">
                           
                        </div>
                    </div> */}
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <NdGrid id="grdItemMovementReport" parent={this} 
                            selection={{mode:"single"}} 
                            showBorders={true}
                            filterRow={{visible:true}} 
                            headerFilter={{visible:true}}
                            sorting={{ mode: 'single' }}
                            height={600}
                            width={"100%"}
                            columnAutoWidth={true}
                            allowColumnReordering={true}
                            allowColumnResizing={true}
                            onRowDblClick={async(e)=>
                                {
                                }}
                            >                            
                                {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Paging defaultPageSize={20} /> : <Paging enabled={false} />}
                                {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Pager visible={true} allowedPageSizes={[5,10,50]} showPageSizeSelector={true} /> : <Paging enabled={false} />}
                                {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Scrolling mode="standart" /> : <Scrolling mode="infinite" />}
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
                        </div>
                    </div>
                </ScrollView>
            </div>
        )
    }
}