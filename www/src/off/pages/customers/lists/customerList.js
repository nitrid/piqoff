import React from 'react';
import App from '../../../lib/app.js';
import Toolbar,{Item} from 'devextreme-react/toolbar';
import Form, { Label } from 'devextreme-react/form';
import ScrollView from 'devextreme-react/scroll-view';
import NdGrid,{Column, ColumnChooser,ColumnFixing,Paging,Pager,Scrolling,Export,StateStoring} from '../../../../core/react/devex/grid.js';
import NdTextBox from '../../../../core/react/devex/textbox.js'
import NdSelectBox from '../../../../core/react/devex/selectbox.js';
import NdDropDownBox from '../../../../core/react/devex/dropdownbox.js';
import NdListBox from '../../../../core/react/devex/listbox.js';
import NdButton from '../../../../core/react/devex/button.js';
import { dialog } from '../../../../core/react/devex/dialog.js';
import { NdForm, NdItem, NdLabel, NdEmptyItem} from '../../../../core/react/devex/form.js';
import { NdToast } from '../../../../core/react/devex/toast.js';

export default class customerList extends React.PureComponent
{
    constructor(props)
    {
        super(props)
        this.core = App.instance.core;
        this.groupList = [];
        this.btnGetirClick = this.btnGetirClick.bind(this)
        this.loadState = this.loadState.bind(this)
        this.saveState = this.saveState.bind(this)
    }
    componentDidMount()
    {
        setTimeout(async () => 
        {

        }, 1000);
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
    async btnGetirClick()
    {        
        let tmpSource =
        {
            source : 
            {
                groupBy : this.groupList,
                select : 
                {
                    query : "SELECT GUID, CODE, TITLE, TYPE_NAME, GENUS_NAME, CUSTOMER_TYPE, GENUS, MAIN_GROUP,ADRESS, STATUS FROM CUSTOMER_VW_02 WHERE (((TITLE like '%' + @CUSTOMER_NAME + '%') OR (@CUSTOMER_NAME = '')) OR ((CODE like '%' + @CUSTOMER_NAME + '%') OR (@CUSTOMER_NAME = '')) ) AND " +
                            "((GENUS = @GENUS) OR (@GENUS = -1)) AND ((MAIN_GROUP = @MAIN_GROUP) OR (@MAIN_GROUP = '00000000-0000-0000-0000-000000000000'))",
                    param : ['CUSTOMER_NAME:string|250','GENUS:string|25','MAIN_GROUP:string|50'],
                    value : [this.txtCustomerName.value,this.cmbGenus.value,this.cmbMainGrp.value]
                },
                sql : this.core.sql
            }
        }
        await this.grdListe.dataRefresh(tmpSource)
    }
    render()
    {
        return(
            <div >
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
                                                id: 'cri_01_001',
                                                text: this.t('menu'),
                                                path: 'customers/cards/customerCard.js'
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
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <NdForm colCount={2} id="frmKriter">
                                <NdItem>
                                    <NdLabel text={this.t("txtCustomerName")} alignment="right" />
                                        <NdTextBox id="txtCustomerName" parent={this} simple={true} onEnterKey={this.btnGetirClick} placeholder={this.t("customerPlace")}
                                        upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value} />
                                </NdItem>
                                <NdItem>
                                    <NdLabel text={this.t("cmbGenus")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbGenus" height='fit-content'
                                    displayExpr="VALUE"                       
                                    valueExpr="ID"
                                    value={-1}
                                    data={{source:[{ID:-1,VALUE:this.t("cmbGenusData.allGenus")},{ID:0,VALUE:this.t("cmbGenusData.Customer")},{ID:1,VALUE:this.t("cmbGenusData.supplier")},{ID:2,VALUE:this.t("cmbGenusData.both")}]}}
                                    />
                                </NdItem>       
                                <NdItem>
                                    <NdLabel text={this.t("cmbMainGrp")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbMainGrp" height='fit-content'
                                    displayExpr="NAME"                       
                                    valueExpr="GUID"
                                    value={"00000000-0000-0000-0000-000000000000"}
                                    data={{source:{select:{query : "SELECT '00000000-0000-0000-0000-000000000000' AS GUID,'' AS CODE,'" + this.t("cmbGenusData.allGenus") +"' AS NAME UNION ALL SELECT GUID,CODE,NAME FROM CUSTOMER_GROUP_VW_01"},sql:this.core.sql}}}
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
                            
                        </div>
                        <div className="col-3">
                            <NdButton text={this.t("btnGet")} type="success" width="100%" onClick={this.btnGetirClick}></NdButton>
                        </div>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <NdGrid id="grdListe" parent={this} 
                            selection={{mode:"multiple"}} 
                            height={600}
                            showBorders={true}
                            filterRow={{visible:true}} 
                            headerFilter={{visible:true}}
                            columnAutoWidth={true}
                            allowColumnReordering={true}
                            allowColumnResizing={true}
                            loadPanel={{enabled:true}}
                            onRowDblClick={async(e)=>
                            {
                                App.instance.menuClick(
                                {
                                    id: 'cri_01_001',
                                    text: e.data.TITLE.substring(0,10),
                                    path: 'customers/cards/customerCard.js',
                                    pagePrm:{GUID:e.data.GUID}
                                })
                            }}
                            onRowPrepared={(e) =>
                            {
                                if(e.rowType == 'data' && e.data.STATUS == false)
                                {
                                    e.rowElement.style.color ="Silver"
                                }
                                else if(e.rowType == 'data' && e.data.STATUS == true)
                                {
                                    e.rowElement.style.color ="Black"
                                }
                            }}
                            >                            
                                {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Paging defaultPageSize={20} /> : <Paging enabled={false} />}
                                {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Pager visible={true} allowedPageSizes={[5,10,50]} showPageSizeSelector={true} /> : <Paging enabled={false} />}
                                {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Scrolling mode="standart" /> : <Scrolling mode="infinite" />}
                                <StateStoring enabled={true} type="custom" customLoad={this.loadState} customSave={this.saveState} storageKey={this.props.data.id + "_grdListe"}/>
                                <ColumnChooser enabled={true} />
                                <Export fileName={this.lang.t("menuOff.cri_02_001")} enabled={true} allowExportSelectedData={true} />
                                <Column dataField="CODE" caption={this.t("grdListe.clmCode")} visible={true}/> 
                                <Column dataField="TITLE" caption={this.t("grdListe.clmTitle")} visible={true}/> 
                                <Column dataField="TYPE_NAME" caption={this.t("grdListe.clmType")} visible={true}/> 
                                <Column dataField="GENUS_NAME" caption={this.t("grdListe.clmGenus")} visible={true}/> 
                                <Column dataField="ADRESS" caption={this.t("grdListe.clmAdress")} visible={true}/> 
                                <Column dataField="ZIPCODE" caption={this.t("grdListe.clmZipcode")} visible={false}/> 
                                <Column dataField="COUNTRY" caption={this.t("grdListe.clmCountry")} visible={false}/> 
                                <Column dataField="CITY" caption={this.t("grdListe.clmCity")} visible={false}/> 
                                <Column dataField="PHONE1" caption={this.t("grdListe.clmPhone1")} visible={false}/> 
                                <Column dataField="GSM_PHONE" caption={this.t("grdListe.clmGsm")} visible={false}/> 
                                <Column dataField="EMAIL" caption={this.t("grdListe.clmEmail")} visible={false}/> 
                                <Column dataField="IBAN" caption={this.t("grdListe.clmIban")} visible={false}/>
                                <Column dataField="STATUS" caption={this.t("grdListe.clmStatus")} visible={true}/>
                            </NdGrid>
                        </div>
                        <NdToast id={"toast"} parent={this} displayTime={2000} position={{at:"top center",offset:'0px 110px'}}/>
                    </div>
                </ScrollView>
            </div>
        )
    }
}