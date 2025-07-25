import React from 'react';
import App from '../../../lib/app.js';
import { itemPartiLotCls } from '../../../../core/cls/items.js';
import ScrollView from 'devextreme-react/scroll-view';
import Toolbar,{ Item } from 'devextreme-react/toolbar';

import NdTextBox, { Validator, RequiredRule } from '../../../../core/react/devex/textbox.js'
import NdPopGrid from '../../../../core/react/devex/popgrid.js';
import { Column, Paging } from '../../../../core/react/devex/grid.js';
import NdButton from '../../../../core/react/devex/button.js';
import NdDatePicker from '../../../../core/react/devex/datepicker.js';
import { dialog } from '../../../../core/react/devex/dialog.js';
import { NdForm, NdItem, NdLabel, NdEmptyItem } from '../../../../core/react/devex/form.js';
import { NdToast } from '../../../../core/react/devex/toast.js';
export default class itemPartiLotCard extends React.PureComponent
{
    constructor(props)
    {
        super(props)
        this.core = App.instance.core;
        this.prmObj = this.param.filter({TYPE:1,USERS:this.user.CODE});
        this.itemPartiLotObj = new itemPartiLotCls();
        this.prevCode = null;
        this.tabIndex = props.data.tabkey
    }
    async componentDidMount()
    {
        await this.core.util.waitUntil(0)
        await this.init()
    }
    async init()
    {
        this.itemPartiLotObj.clearAll();

        this.itemPartiLotObj.ds.on('onAddRow',(pTblName,pData) =>
        {
            if(pData.stat == 'new')
            {
                this.btnNew.setState({disabled:false});
                this.btnBack.setState({disabled:true});
                this.btnSave.setState({disabled:false});
                this.btnDelete.setState({disabled:false});
            }
        })
        this.itemPartiLotObj.ds.on('onEdit',(pTblName,pData) =>
        {            
            if(pData.rowData.stat == 'edit')
                {
                    this.btnNew.setState({disabled:false});
                    this.btnSave.setState({disabled:false});
                    this.btnDelete.setState({disabled:false});
    
                    pData.rowData.CUSER = this.user.CODE
                }                  
        })
        this.itemPartiLotObj.ds.on('onRefresh',(pTblName) =>
        {            
            this.btnNew.setState({disabled:false});
            this.btnSave.setState({disabled:true});
            this.btnDelete.setState({disabled:false});
        })
        this.itemPartiLotObj.ds.on('onDelete',(pTblName) =>
        {            
            this.btnNew.setState({disabled:false});
            this.btnSave.setState({disabled:false});
            this.btnDelete.setState({disabled:false});
        })
        this.itemPartiLotObj.addEmpty();
        this.txtCode.value = ''
    }
    async checkItems(pItem)
    {
        return new Promise(async resolve =>
        {
            if(pItem !== '')
            {
                let tmpQuery = 
                {
                    query : "SELECT TOP 1 ITEM FROM ITEM_PARTI_LOT_VW_01 WHERE ITEM = @ITEM",
                    param : ['ITEM:string'],
                    value : [pItem]
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
                                    <NdButton id="btnNew" parent={this} icon="file" type="default" onClick={()=>{this.init()}}/>
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
                                                if((await this.itemPartiLotObj.save()) == 0)
                                                {       
                                                    let tmpConfObj1 =
                                                    {
                                                        id:'msgSaveResult',showTitle:true,title:this.t("msgSave.title"),showCloseButton:true,width:'500px',height:'auto',
                                                        button:[{id:"btn01",caption:this.t("msgSave.btn01"),location:'after'}],
                                                        content:(<div style={{textAlign:"center",fontSize:"20px",color:"green"}}>{this.t("msgSaveResult.msgSuccess")}</div>)
                                                    }                                             
                                                    await dialog(tmpConfObj1);
                                                }
                                                else
                                                {
                                                    this.toast.show({message:this.t("msgSaveResult.msgFailed"),type:'error'})
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
                                            this.itemPartiLotObj.dt().removeAt(0)
                                            await this.itemPartiLotObj.dt().delete();
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
                                {/* ITEM Secme */}
                                <NdItem>
                                    <NdLabel text={this.t("txtCode")} alignment="right" />
                                    <NdTextBox id="txtCode" parent={this} simple={true} dt={{data:this.itemPartiLotObj.dt(),field:"ITEM_CODE"}}
                                    button={
                                    [
                                        {
                                            id:'01',
                                            icon:'more',
                                            onClick:()=>
                                            {
                                                this.popItemSelect.show()
                                                this.popItemSelect.onClick = async(data) =>
                                                {
                                                    if(data.length > 0)
                                                    {
                                                        this.itemPartiLotObj.dt()[0].ITEM = data[0].GUID
                                                        this.itemPartiLotObj.dt()[0].ITEM_CODE = data[0].CODE
                                                        this.itemPartiLotObj.dt()[0].ITEM_NAME = data[0].NAME
                                                        this.txtItemName.value = data[0].NAME
                                                    }
                                                }
                                            }
                                        }
                                    ]}
                                    onEnterKey={(async()=>
                                    {
                                        await this.popItemSelect.setVal(this.txtCode.value)
                                        this.popItemSelect.show()
                                        this.popItemSelect.onClick = async(data) =>
                                        {
                                            if(data.length > 0)
                                            {
                                                this.itemPartiLotObj.dt()[0].ITEM = data[0].GUID
                                                this.itemPartiLotObj.dt()[0].ITEM_CODE = data[0].CODE
                                                this.itemPartiLotObj.dt()[0].ITEM_NAME = data[0].NAME
                                                this.txtItemName.value = data[0].NAME
                                            }
                                        }
                                    }).bind(this)}
                                    param={this.param.filter({ELEMENT:'txtCode',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'txtCode',USERS:this.user.CODE})}
                                    >
                                        <Validator validationGroup={"frmMain"  + this.tabIndex}>
                                            <RequiredRule message={this.t("validCode")} />
                                        </Validator> 
                                    </NdTextBox>                                
                                    {/* STOK SEÇİM */}
                                    <NdPopGrid id={"popItemSelect"} parent={this} container={'#' + this.props.data.id + this.tabIndex}
                                    visible={false}
                                    position={{of:'#' + this.props.data.id + this.tabIndex}} 
                                    showTitle={true} 
                                    showBorders={true}
                                    width={'90%'}
                                    height={'90%'}
                                    title={this.t("popItemSelect.title")}
                                    search={true}
                                    data={{source:{select:{query:`SELECT GUID,CODE,NAME FROM ITEMS_VW_04 WHERE UPPER(CODE) LIKE UPPER(@VAL) OR UPPER(NAME) LIKE UPPER(@VAL)`,param : ['VAL:string|50']},sql:this.core.sql}}}
                                    >           
                                        <Paging defaultPageSize={22} />
                                        <Column dataField="CODE" caption={this.t("popItemSelect.clmCode")} width={150}/>
                                        <Column dataField="NAME" caption={this.t("popItemSelect.clmName")} width={200}/>
                                    </NdPopGrid>
                                </NdItem>
                                {/* ITEM NAME */}
                                <NdItem>
                                    <NdLabel text={this.t("txtItemName")} alignment="right" />
                                    <NdTextBox id="txtItemName" parent={this} simple={true}
                                    param={this.param.filter({ELEMENT:'txtItemName',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'txtItemName',USERS:this.user.CODE})}
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    dt={{data:this.itemPartiLotObj.dt(),field:"ITEM_NAME"}}
                                    >
                                        <Validator validationGroup={"frmMain" + this.tabIndex}>
                                            <RequiredRule message={this.t("valName")} />
                                        </Validator> 
                                    </NdTextBox>
                                </NdItem>
                                {/* PARTI LOT */}
                                <NdItem>
                                    <NdLabel text={this.t("txtPartiLotCode")} alignment="right" />
                                    <NdTextBox id="txtPartiLotCode" parent={this} simple={true} dt={{data:this.itemPartiLotObj.dt(),field:"LOT_CODE"}}
                                    button={
                                    [
                                        {
                                            id:'01',
                                            icon:'more',
                                            onClick:()=>
                                            {
                                                this.popItemPartiLotSelect.show()
                                                this.popItemPartiLotSelect.onClick = async(data) =>
                                                {
                                                    if(data.length > 0)
                                                    {
                                                        await this.itemPartiLotObj.load({GUID:data[0].GUID});
                                                    }
                                                }
                                            }
                                        }
                                    ]}
                                    onEnterKey={(async()=>
                                    {
                                        await this.popItemPartiLotSelect.setVal(this.txtPartiLotCode.value)
                                        this.popItemPartiLotSelect.show()
                                        this.popItemPartiLotSelect.onClick = async(data) =>
                                        {
                                            if(data.length > 0)
                                            {
                                                await this.itemPartiLotObj.load({GUID:data[0].GUID});
                                            }
                                        }
                                    }).bind(this)}
                                    param={this.param.filter({ELEMENT:'txtPartiLotCode',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'txtPartiLotCode',USERS:this.user.CODE})}
                                    >
                                        <Validator validationGroup={"frmMain"  + this.tabIndex}>
                                            <RequiredRule message={this.t("validCode")} />
                                        </Validator> 
                                    </NdTextBox>                                
                                    {/* PARTI LOT SEÇİM */}
                                    <NdPopGrid id={"popItemPartiLotSelect"} parent={this} container={'#' + this.props.data.id + this.tabIndex}
                                    visible={false}
                                    position={{of:'#' + this.props.data.id + this.tabIndex}} 
                                    showTitle={true} 
                                    showBorders={true}
                                    width={'90%'}
                                    height={'90%'}
                                    title={this.t("popItemPartiLotSelect.title")}
                                    search={true}
                                    data={{source:{select:{query:`SELECT GUID,LOT_CODE,ITEM_NAME FROM ITEM_PARTI_LOT_VW_01 WHERE UPPER(LOT_CODE) LIKE UPPER(@VAL)`,param : ['VAL:string|50']},sql:this.core.sql}}}
                                    >          
                                        <Paging defaultPageSize={22} />
                                        <Column dataField="LOT_CODE" caption={this.t("popItemPartiLotSelect.clmCode")} width={150} />
                                        <Column dataField="ITEM_NAME" caption={this.t("popItemPartiLotSelect.clmName")} width={200}/>
                                    </NdPopGrid>
                                </NdItem>
                                {/* dtFirst */}
                                <NdItem>
                                    <NdLabel text={this.t("dtFirst")} alignment="right" />
                                    <NdDatePicker simple={true} parent={this} id={"dtFirst"} dt={{data:this.itemPartiLotObj.dt('ITEM_PARTI_LOT'),field:"PRDCT_DATE"}}/>
                                </NdItem>
                                <NdEmptyItem />
                                {/* dtLast */}
                                <NdItem>
                                    <NdLabel text={this.t("dtLast")} alignment="right" />
                                    <NdDatePicker simple={true} parent={this} id={"dtLast"} dt={{data:this.itemPartiLotObj.dt('ITEM_PARTI_LOT'),field:"SKT"}}/>
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