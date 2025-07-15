import React from 'react';
import App from '../../../lib/app.js';
import { itemPricingListCls } from '../../../../core/cls/items.js';


import ScrollView from 'devextreme-react/scroll-view';
import Toolbar from 'devextreme-react/toolbar';
import { Item } from 'devextreme-react/form';

import NdTextBox, { Validator, RequiredRule } from '../../../../core/react/devex/textbox.js'
import NdSelectBox from '../../../../core/react/devex/selectbox.js';
import NdPopGrid from '../../../../core/react/devex/popgrid.js';
import { Column } from '../../../../core/react/devex/grid.js';
import NdButton from '../../../../core/react/devex/button.js';
import { dialog } from '../../../../core/react/devex/dialog.js';
import { NdForm, NdItem, NdLabel } from '../../../../core/react/devex/form.js';
import { NdToast } from '../../../../core/react/devex/toast.js';

export default class itemPricingListCard extends React.PureComponent
{
    constructor(props)
    {
        super(props)
        this.core = App.instance.core;
        this.prmObj = this.param.filter({TYPE:1,USERS:this.user.CODE});
        this.itemPricingListObj = new itemPricingListCls();
        this.prevCode = null;
        this.tabIndex = props.data.tabkey
    }
    async componentDidMount()
    {
        await this.core.util.waitUntil(0)
        await this.init()
        console.log(this.param.filter({ELEMENT:'txtNo',USERS:this.user.CODE}))
    }
    async init()
    {
        this.itemPricingListObj.clearAll();
        this.itemPricingListObj.addEmpty();

        this.itemPricingListObj.ds.on('onAddRow',(pTblName,pData) =>
        {
            if(pData.stat == 'new')
            {
                if(this.prevCode != null)
                {
                    this.btnNew.setState({disabled:true});
                    this.btnBack.setState({disabled:false});
                }
                else
                {
                    this.btnNew.setState({disabled:false});
                    this.btnBack.setState({disabled:true});
                }
                
                this.btnSave.setState({disabled:false});
                this.btnDelete.setState({disabled:false});
            }
        })
        this.itemPricingListObj.ds.on('onEdit',(pTblName,pData) =>
        {            
            if(pData.rowData.stat == 'edit')
            {
                this.btnBack.setState({disabled:false});
                this.btnNew.setState({disabled:true});
                this.btnSave.setState({disabled:false});
                this.btnDelete.setState({disabled:false});

                pData.rowData.CUSER = this.user.CODE
            }                 
        })
        this.itemPricingListObj.ds.on('onRefresh',(pTblName) =>
        {            
            this.prevCode = this.itemPricingListObj.dt().length > 0 ? this.itemPricingListObj.dt()[0].NO : -1;
            this.btnBack.setState({disabled:true});
            this.btnNew.setState({disabled:false});
            this.btnSave.setState({disabled:true});
            this.btnDelete.setState({disabled:false});
        })
        this.itemPricingListObj.ds.on('onDelete',(pTblName) =>
        {            
            this.btnBack.setState({disabled:false});
            this.btnNew.setState({disabled:true});
            this.btnSave.setState({disabled:false});
            this.btnDelete.setState({disabled:false});
        })
    }
    async getPricingList(pNo)
    {
        this.itemPricingListObj.clearAll()
        await this.itemPricingListObj.load({NO:pNo});
    }
    async checkItems(pNo)
    {
        return new Promise(async resolve =>
        {
            if(pNo !== '')
            {
                let tmpQuery = 
                {
                    query : `SELECT TOP 1 NO FROM ITEM_PRICE_LIST_VW_01 WHERE NO = @NO`,
                    param : ['NO:int'],
                    value : [pNo]
                }
                let tmpData = await this.core.sql.execute(tmpQuery) 

                if(tmpData.result.recordset.length > 0)
                {
                    let tmpConfObj = 
                    {
                        id: 'msgCode',
                        showTitle:true,
                        title:this.t("msgCode.title"),
                        showCloseButton:true,
                        width:'500px',
                        height:'auto',
                        button:[{id:"btn01",caption:this.t("msgCode.btn01"),location:'before'},{id:"btn02",caption:this.t("msgCode.btn02"),location:'after'}],
                        content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgCode.msg")}</div>)
                    }
    
                    let pResult = await dialog(tmpConfObj);
                    if(pResult == 'btn01')
                    {
                        this.getPricingList(pNo)
                        resolve(2) //KAYIT VAR
                    }
                    else
                    {
                        resolve(3) // TAMAM BUTONU
                    }
                }
                else
                {
                    resolve(1) // KAYIT BULUNAMADI
                }
            }
            else
            {
                resolve(0) //PARAMETRE BOŞ
            }
        });
    }
    render()
    {
        return(
            <div id={this.props.data.id + this.tabIndex}>
                <ScrollView>
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <Toolbar>
                                <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnBack" parent={this} icon="revert" type="default"
                                        onClick={()=>
                                        {
                                            if(this.prevCode != null)
                                            {
                                                this.getPricingList(this.prevCode); 
                                            }
                                        }}/>
                                </Item>
                                <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnNew" parent={this} icon="file" type="default"
                                    onClick={()=>
                                    {
                                        this.init(); 
                                    }}/>
                                </Item>
                                <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnSave" parent={this} icon="floppy" type="success" validationGroup={"frmMain" + this.tabIndex}
                                    onClick={async (e)=>
                                    {
                                        if(e.validationGroup.validate().status == "valid")
                                        {
                                            let tmpConfObj =
                                            {
                                                id:'msgSave',showTitle:true,title:this.t("msgSave.title"),showCloseButton:true,width:'500px',height:'auto',
                                                button:[{id:"btn01",caption:this.t("msgSave.btn01"),location:'before'},{id:"btn02",caption:this.t("msgSave.btn02"),location:'after'}],
                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgSave.msg")}</div>)
                                            }
                                            
                                            let pResult = await dialog(tmpConfObj);
                                            if(pResult == 'btn01')
                                            {
                                                if((await this.itemPricingListObj.save()) == 0)
                                                {                                                    
                                                    this.toast.show({message:this.t("msgSaveResult.msgSuccess"),type:'success'})
                                                }
                                                else
                                                {
                                                    let tmpConfObj1 =
                                                    {
                                                        id:'msgSaveResult',showTitle:true,title:this.t("msgSave.title"),showCloseButton:true,width:'500px',height:'200px',
                                                        button:[{id:"btn01",caption:this.t("msgSave.btn01"),location:'after'}],
                                                        content:(<div style={{textAlign:"center",fontSize:"20px",color:"red"}}>{this.t("msgSaveResult.msgFailed")}</div>)
                                                    }
                                                    await dialog(tmpConfObj1);
                                                }
                                            }
                                        }                              
                                        else
                                        {
                                            this.toast.show({message:this.t("msgSaveValid.msg"),type:'warning'})
                                        }                                                 
                                    }}/>
                                </Item>
                                <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnDelete" parent={this} icon="trash" type="danger"
                                    onClick={async()=>
                                    {
                                        let tmpConfObj =
                                        {
                                            id:'msgDelete',showTitle:true,title:this.t("msgDelete.title"),showCloseButton:true,width:'500px',height:'auto',
                                            button:[{id:"btn01",caption:this.t("msgDelete.btn01"),location:'before'},{id:"btn02",caption:this.t("msgDelete.btn02"),location:'after'}],
                                            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgDelete.msg")}</div>)
                                        }
                                        
                                        let pResult = await dialog(tmpConfObj);
                                        if(pResult == 'btn01')
                                        {
                                            this.itemPricingListObj.dt().removeAt(0)
                                            await this.itemPricingListObj.dt().delete();
                                            this.init(); 
                                        }                                        
                                    }}/>
                                </Item>
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
                                }/>
                            </Toolbar>
                        </div>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <NdForm colCount={2} id={"frmMain" + this.tabIndex}>
                                {/* txtNo */}
                                <NdItem>
                                    <NdLabel text={this.t("txtNo")} alignment="right" />
                                    <NdTextBox id="txtNo" parent={this} simple={true} dt={{data:this.itemPricingListObj.dt(),field:"NO"}}  
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    button=
                                    {
                                        [
                                            {
                                                id:'01',
                                                icon:'more',
                                                onClick:()=>
                                                {
                                                    this.pg_txtNo.show()
                                                    this.pg_txtNo.onClick = (data) =>
                                                    {
                                                        if(data.length > 0)
                                                        {
                                                            this.getPricingList(data[0].NO)
                                                        }
                                                    }
                                                }
                                            }
                                        ]
                                    }
                                    onChange={(async()=>
                                    {
                                        let tmpResult = await this.checkItems(this.txtNo.value)
                                        if(tmpResult == 3)
                                        {
                                            this.txtNo.value = "";
                                        }
                                    }).bind(this)}
                                    param={this.param.filter({ELEMENT:'txtNo',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'txtNo',USERS:this.user.CODE})}
                                    >
                                        <Validator validationGroup={"frmMain"  + this.tabIndex}>
                                            <RequiredRule/>
                                        </Validator>  
                                    </NdTextBox>
                                    {/* LISTE SECIMI POPUP */}
                                    <NdPopGrid id={"pg_txtNo"} parent={this} container={'#' + this.props.data.id + this.tabIndex}
                                    visible={false}
                                    position={{of:'#' + this.props.data.id + this.tabIndex}} 
                                    showTitle={true} 
                                    showBorders={true}
                                    width={'90%'}
                                    height={'90%'}
                                    title={this.t("pg_txtNo.title")} //
                                    data={{source:{select:{query : "SELECT NO,NAME FROM ITEM_PRICE_LIST_VW_01"},sql:this.core.sql}}}
                                    >
                                        <Column dataField="NO" caption={this.t("pg_txtNo.clmNo")} width={150} />
                                        <Column dataField="NAME" caption={this.t("pg_txtNo.clmName")} width={300} defaultSortOrder="asc" />
                                    </NdPopGrid>
                                </NdItem>
                                {/* txtName */}
                                <NdItem>
                                    <NdLabel text={this.t("txtName")} alignment="right" />
                                    <NdTextBox id="txtName" parent={this} simple={true} dt={{data:this.itemPricingListObj.dt(),field:"NAME"}}  
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    param={this.param.filter({ELEMENT:'txtName',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'txtName',USERS:this.user.CODE})}
                                    >
                                        <Validator validationGroup={"frmMain"  + this.tabIndex}>
                                            <RequiredRule />
                                        </Validator>  
                                    </NdTextBox>
                                </NdItem>
                                {/* txtTag */}
                                <NdItem>
                                    <NdLabel text={this.t("txtTag")} alignment="right" />
                                    <NdTextBox id="txtTag" parent={this} simple={true} dt={{data:this.itemPricingListObj.dt(),field:"TAG"}}
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    param={this.param.filter({ELEMENT:'txtTag',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'txtTag',USERS:this.user.CODE})}
                                    />
                                </NdItem>
                                {/* cmbVatType */}
                                <NdItem>
                                    <NdLabel text={this.t("cmbVatType.title")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbVatType" height='fit-content' dt={{data:this.itemPricingListObj.dt(),field:"VAT_TYPE"}}
                                    displayExpr="NAME"                       
                                    valueExpr="ID"
                                    data={{source:[{ID:0,NAME:this.t("cmbVatType.vatInc")},{ID:1,NAME:this.t("cmbVatType.vatExt")}]}}
                                    param={this.param.filter({ELEMENT:'cmbVatType',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'cmbVatType',USERS:this.user.CODE})}
                                    />
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