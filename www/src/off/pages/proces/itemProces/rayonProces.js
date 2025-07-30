import React from 'react';
import App from '../../../lib/app.js';

import Toolbar from 'devextreme-react/toolbar';
import Form, { Label,Item } from 'devextreme-react/form';
import ScrollView from 'devextreme-react/scroll-view';

import NdGrid,{Column,Paging,Pager,Export,ColumnChooser,StateStoring,Scrolling } from '../../../../core/react/devex/grid.js';
import NdTextBox from '../../../../core/react/devex/textbox.js'
import NdSelectBox from '../../../../core/react/devex/selectbox.js';
import NdButton from '../../../../core/react/devex/button.js';
import NdTagBox from '../../../../core/react/devex/tagbox.js';
import { dialog } from '../../../../core/react/devex/dialog.js';
import {NdToast} from '../../../../core/react/devex/toast.js';


export default class rayonProces extends React.PureComponent
{
    constructor(props)
    {
        super(props)

        this.prmObj = this.param.filter({TYPE:1,USERS:this.user.CODE});
        
        this.core = App.instance.core;
        this.groupList = [];
        this.btnGetirClick = this.btnGetirClick.bind(this)
        this.updateGroup = this.updateGroup.bind(this)
        this.loadState = this.loadState.bind(this)
        this.saveState = this.saveState.bind(this)

    }
    componentDidMount()
    {
        
        setTimeout(async () => {}, 1000);
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

    async updateGroup()
    {
        let tmpConfObj =
        {
            id:'msgClose',showTitle:true,title:this.t("msgWarning.title"),showCloseButton:true,width:'500px',height:'auto',
            button:[{id:"btn01",caption:this.t("msgWarning.btn01"),location:'before'},{id:"btn02",caption:this.t("msgWarning.btn02"),location:'after'}],
            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgWarning.msg")}</div>)
        }
        
        let pResult = await dialog(tmpConfObj);
        if(pResult == 'btn01')
        {
            return
        }

        for (let i = 0; i < this.grdListe.getSelectedData().length; i++) 
        {
            let tmpQuery = 
            {
                query :`UPDATE ITEMS_GRP SET RAYON_GUID = @RAYON WHERE ITEM = @ITEM `,
                param : ['RAYON:string|50','ITEM:string|50'],
                value : [this.cmbRayon.value,this.grdListe.getSelectedData()[i].GUID]
            }
            await this.core.sql.execute(tmpQuery) 
        }
        this.toast.show({message:this.t("msgSaveResult.msgSuccess"),type:"success"})
        this.btnGetirClick()
       
    }
    async btnGetirClick()
    {
        if(this.txtUrunAdi.value != '' && this.txtUrunAdi.value.slice(-1) != '*')
        {
            let tmpUrunAdi = this.txtUrunAdi.value + '*'
            this.txtUrunAdi.setState({value:tmpUrunAdi})
        }
        
        let tmpSource =
        {
            source : 
            {
                groupBy : this.groupList,
                select : 
                {
                    query : 
                            `SELECT GUID,CODE,NAME,SNAME,MAIN_GRP_NAME,VAT,PRICE_SALE,MAIN_UNIT_NAME AS UNIT_NAME,RAYON_CODE,RAYON_NAME
                            FROM ITEMS_EDIT_VW_01 
                            WHERE {0}
                            ((NAME LIKE @NAME +'%') OR (@NAME = '')) AND 
                            ((MAIN_GRP = @MAIN_GRP) OR (@MAIN_GRP = '')) AND 
                            ((CUSTOMER_CODE = @CUSTOMER_CODE) OR (@CUSTOMER_CODE = '')) 
                            GROUP BY  GUID,CODE,NAME,SNAME,MAIN_GRP_NAME,VAT,PRICE_SALE,MAIN_UNIT_NAME,RAYON_CODE,RAYON_NAME`,
                    param : ['NAME:string|250','MAIN_GRP:string|25','CUSTOMER_CODE:string|25'],
                    value : [this.txtUrunAdi.value.replaceAll("*", "%"),this.cmbUrunGrup.value,this.cmbTedarikci.value]
                },
                sql : this.core.sql
            }
        }
        
        if(this.txtBarkod.value.length == 0)
        {
            tmpSource.source.select.query = tmpSource.source.select.query.replaceAll("{0}", "{1}")
        }
        else if(this.txtBarkod.value.length == 1)
        {
            tmpSource.source.select.query = tmpSource.source.select.query.replaceAll("{0}", "((CODE LIKE '" + this.txtBarkod.value[0] + "' + '%') OR (BARCODE LIKE '" + this.txtBarkod.value[0] + "' + '%') {1}) AND")
        }
        else
        {
            let TmpVal = ''
            for (let i = 0; i < this.txtBarkod.value.length; i++) 
            {
                TmpVal = TmpVal + ",'" + this.txtBarkod.value[i] + "'"
                
            }

            tmpSource.source.select.query = tmpSource.source.select.query.replaceAll("{0}", "((CODE IN (" + TmpVal.substring(1,TmpVal.length) + ")) OR (BARCODE IN (" + TmpVal.substring(1,TmpVal.length) + ")) {1}) AND")
        }

        if(this.txtMulticode.value.length == 0)
        {
            
            tmpSource.source.select.query = tmpSource.source.select.query.replaceAll("{1}", "")
        }
        else if(this.txtMulticode.value.length == 1)
        {
            if(this.txtBarkod.value.length == 0)
            {
                tmpSource.source.select.query = tmpSource.source.select.query.replaceAll("{1}", " (MULTICODE = '" + this.txtMulticode.value[0] + "') AND")
            }
            else
            {
                tmpSource.source.select.query = tmpSource.source.select.query.replaceAll("{1}", "OR (MULTICODE = '" + this.txtMulticode.value[0] + "')")
            }
        }
        else
        {
            let tmpMultiCode = ''
            for (let i = 0; i < this.txtMulticode.value.length; i++) 
            {
                tmpMultiCode = tmpMultiCode + ",'" + this.txtMulticode.value[i] + "'"
                
            }
            if(this.txtBarkod.value.length == 0)
            {
                tmpSource.source.select.query = tmpSource.source.select.query.replaceAll("{1}", " (MULTICODE IN (" + tmpMultiCode.substring(1,tmpMultiCode.length) + ")) AND")
            }
            else
            {
                tmpSource.source.select.query = tmpSource.source.select.query.replaceAll("{1}", "OR (MULTICODE IN (" + tmpMultiCode.substring(1,tmpMultiCode.length) + ")) ")
            }
            
        }

        await this.grdListe.dataRefresh(tmpSource)

        let tmpDatas = this.prmObj.filter({ID:'emptyCode',USERS:this.user.CODE}).getValue()

        if(typeof tmpDatas != 'undefined' && tmpDatas.value ==  true)
        {
            for (let i = 0; i < this.txtBarkod.value.length; i++) 
            {
                let TmpData = this.grdListe.data.datatable.find((item) => item.CODE === this.txtBarkod.value[i] || item.BARCODE === this.txtBarkod.value[i]);
                if(typeof TmpData == 'undefined')
                {
                    this.grdListe.data.datatable.push({CODE:this.txtBarkod.value[i]})
                }
            }
            for (let i = 0; i < this.txtMulticode.value.length; i++) 
            {
                let TmpMultiData = this.grdListe.data.datatable.find((item) => item.MULTICODE === this.txtMulticode.value[i]);
                if(typeof TmpMultiData == 'undefined')
                {
                    this.grdListe.data.datatable.push({MULTICODE:this.txtMulticode.value[i]})
                }
            }
            this.grdListe.dataRefresh(this.grdListe.data.datatable)
        }
      
    }
    render()
    {
        return(
            <div>
                <NdToast id="toast" parent={this} displayTime={2000} position={{at:"top center",offset:'0px 110px'}}/>
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
                                                id: 'stk_01_001',
                                                text: this.t("toolMenu01"),
                                                path: 'items/cards/itemCard.js'
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
                            <Form colCount={2} id="frmKriter">
                                <Item>
                                    <Label text={this.t("txtBarkod")} alignment="right" />
                                        <NdTagBox id="txtBarkod" parent={this} simple={true} value={[]} placeholder={this.t("barkodPlaceHolder")}/>
                                </Item>
                                <Item>
                                    <Label text={this.t("cmbCustomer")} alignment="right" />
                                        <NdSelectBox simple={true} parent={this} id="cmbTedarikci" showClearButton={true} notRefresh={true}  searchEnabled={true} 
                                        displayExpr="TITLE"                       
                                        valueExpr="CODE"
                                        data={{source: {select : {query:`SELECT CODE,TITLE FROM CUSTOMER_VW_03 WHERE GENUS IN(1,2) ORDER BY TITLE ASC`},sql : this.core.sql}}}/>
                                </Item>
                                <Item>
                                    <Label text={this.t("txtItemName")} alignment="right" />
                                        <NdTextBox id="txtUrunAdi" parent={this} simple={true} onEnterKey={this.btnGetirClick} placeholder={this.t("ItemNamePlaceHolder")}
                                        upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}/>
                                </Item>
                                <Item>
                                    <Label text={this.t("cmbMainGrp")} alignment="right" />
                                        <NdSelectBox simple={true} parent={this} id="cmbUrunGrup" showClearButton={true} notRefresh={true}  searchEnabled={true}
                                        displayExpr="NAME"                       
                                        valueExpr="CODE"
                                        data={{source: {select : {query:`SELECT CODE,NAME FROM ITEM_GROUP ORDER BY NAME ASC`},sql : this.core.sql}}}/>
                                </Item>
                                <Item>
                                    <Label text={this.t("txtMulticode")} alignment="right" />
                                        <NdTagBox id="txtMulticode" parent={this} simple={true} value={[]} placeholder={this.t("multicodePlaceHolder")}/>
                                </Item>
                            </Form>
                        </div>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-3">
                            <NdButton text={this.t("btnGet")} type="success" width="100%" onClick={this.btnGetirClick}/>
                        </div>
                        <div className="col-3">
                        </div>
                        <div className="col-3">
                              {/* cmbItemGrp */}
                                <NdSelectBox id="cmbRayon" simple={true} parent={this} text={this.t("chkMasterBarcode")}
                                displayExpr="NAME"                       
                                valueExpr="GUID"
                                searchEnabled={true} 
                                showClearButton={true}
                                pageSize ={50}
                                notRefresh={true}
                                data={{source:{select:{query : `SELECT GUID,CODE,NAME FROM RAYON ORDER BY NAME ASC`},sql:this.core.sql}}} />
                        </div>
                        <div className="col-3">
                            <NdButton text={this.t("btnOk")} type="default" width="100%" onClick={this.updateGroup}/>
                        </div>  
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <NdGrid id="grdListe" parent={this} 
                            selection={{mode:"multiple"}} 
                            showBorders={true}
                            filterRow={{visible:true}} 
                            headerFilter={{visible:true}}
                            columnAutoWidth={true}
                            allowColumnReordering={true}
                            allowColumnResizing={true}
                            loadPanel={{enabled:true}}
                            onCellPrepared={(e) =>
                            {
                               
                            }}
                            onRowDblClick={async(e)=>
                            {
                                App.instance.menuClick(
                                    {
                                        id: 'stk_01_001',
                                        text: e.data.NAME.substring(0,10),
                                        path: 'items/cards/itemCard.js',
                                        pagePrm:{CODE:e.data.CODE}
                                    })
                            }}
                            >                                    
                                {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Paging defaultPageSize={20} /> : <Paging enabled={false} />}
                                {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Pager visible={true} allowedPageSizes={[5,10,50]} showPageSizeSelector={true} /> : <Paging enabled={false} />}
                                {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Scrolling mode="standart" /> : <Scrolling mode="virtual" />}
                                <StateStoring enabled={true} type="custom" customLoad={this.loadState} customSave={this.saveState} storageKey={this.props.data.id + "_grdListe"}/>
                                <ColumnChooser enabled={true} />
                                <Export fileName={this.lang.t("menuOff.stk_03_001")} enabled={true} allowExportSelectedData={true} />
                                <Column dataField="CODE" caption={this.t("grdListe.clmCode")} visible={true}/> 
                                <Column dataField="NAME" caption={this.t("grdListe.clmName")} visible={true} defaultSortOrder="asc" /> 
                                <Column dataField="RAYON_CODE" caption={this.t("grdListe.clmRayonCode")} visible={false}/> 
                                <Column dataField="RAYON_NAME" caption={this.t("grdListe.clmRayonName")} visible={true}/> 
                                <Column dataField="BARCODE" caption={this.t("grdListe.clmBarcode")} visible={true}/> 
                                <Column dataField="SNAME" caption={this.t("grdListe.clmSname")} visible={false}/> 
                                <Column dataField="VAT" caption={this.t("grdListe.clmVat")} visible={true}/> 
                                <Column dataField="PRICE_SALE" caption={this.t("grdListe.clmPriceSale")} visible={true}/>               
                            </NdGrid>
                        </div>
                    </div>
                </ScrollView>
            </div>
        )
    }
}