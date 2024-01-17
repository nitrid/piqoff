import React from 'react';
import App from '../../../lib/app.js';
import { itemRelatedCls } from '../../../../core/cls/items.js';
import moment from 'moment';

import ScrollView from 'devextreme-react/scroll-view';
import Toolbar from 'devextreme-react/toolbar';
import Form, { Label,Item,EmptyItem,GroupItem } from 'devextreme-react/form';
import { Button } from 'devextreme-react/button';

import NdTextBox, { Validator, NumericRule, RequiredRule, CompareRule, EmailRule, PatternRule, StringLengthRule, RangeRule, AsyncRule } from '../../../../core/react/devex/textbox.js'
import NdPopGrid from '../../../../core/react/devex/popgrid.js';
import NdGrid,{Column,Editing,Paging,Scrolling,KeyboardNavigation,Pager,Export, ColumnChooser} from '../../../../core/react/devex/grid.js';
import NdButton from '../../../../core/react/devex/button.js';
import NdDialog, { dialog } from '../../../../core/react/devex/dialog.js';
import { datatable } from '../../../../core/core.js';
import NdNumberBox from '../../../../core/react/devex/numberbox.js';

export default class itemRelated extends React.PureComponent
{
    constructor(props)
    {
        super(props) 
               
        this.core = App.instance.core;
        this.prmObj = this.param.filter({TYPE:1,USERS:this.user.CODE});
        this.itemRelatedObj = new itemRelatedCls();
        this.tabIndex = props.data.tabkey
    } 
    async componentDidMount()
    {
        await this.core.util.waitUntil(0)
        this.init();
    }
    async init()
    {
        this.itemRelatedObj.clearAll();

        this.itemRelatedObj.ds.on('onAddRow',(pTblName,pData) =>
        {
            if(pData.stat == 'new')
            {
                this.btnNew.setState({disabled:false});
                this.btnSave.setState({disabled:false});
                this.btnDelete.setState({disabled:false});
            }
        })
        this.itemRelatedObj.ds.on('onEdit',(pTblName,pData) =>
        {            
            if(pData.rowData.stat == 'edit')
            {
                this.btnNew.setState({disabled:false});
                this.btnSave.setState({disabled:false});
                this.btnDelete.setState({disabled:false});

                pData.rowData.CUSER = this.user.CODE
            }                 
        })
        this.itemRelatedObj.ds.on('onRefresh',(pTblName) =>
        {            
            this.btnNew.setState({disabled:false});
            this.btnSave.setState({disabled:true});
            this.btnDelete.setState({disabled:false});
        })
        this.itemRelatedObj.ds.on('onDelete',(pTblName) =>
        {            
            this.btnNew.setState({disabled:false});
            this.btnSave.setState({disabled:false});
            this.btnDelete.setState({disabled:false});
        })
             
        this.txtCode.value = ''
        this.txtName.value = ''

        await this.grdRelated.dataRefresh({source:this.itemRelatedObj.dt()});
    }
    async addItem(pData)
    {
        App.instance.setState({isExecute:true})
        let tmpEmpty = {...this.itemRelatedObj.empty};
                                                    
        tmpEmpty.CUSER = this.core.auth.data.CODE,  
        tmpEmpty.LUSER = this.core.auth.data.CODE,
        tmpEmpty.ITEM_GUID = this.txtCode.GUID
        tmpEmpty.ITEM_CODE = this.txtCode.value
        tmpEmpty.ITEM_NAME = this.txtName.value,  
        tmpEmpty.RELATED_GUID = pData.GUID
        tmpEmpty.RELATED_CODE = pData.CODE
        tmpEmpty.RELATED_NAME = pData.NAME
        
        this.itemRelatedObj.addEmpty(tmpEmpty);
        App.instance.setState({isExecute:false})
    }
    render()
    {
        return(
            <div>
                <ScrollView>
                    {/* Toolbar */}
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <Toolbar>
                                <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnNew" parent={this} icon="file" type="default"
                                    onClick={()=>
                                    {
                                        this.init(); 
                                    }}/>
                                </Item>
                                <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnSave" parent={this} icon="floppy" type="success" validationGroup={"frmRelated"  + this.tabIndex}
                                    onClick={async (e)=>
                                    {
                                        if(e.validationGroup.validate().status == "valid")
                                        {
                                            let tmpConfObj =
                                            {
                                                id:'msgSave',showTitle:true,title:this.t("msgSave.title"),showCloseButton:true,width:'500px',height:'200px',
                                                button:[{id:"btn01",caption:this.t("msgSave.btn01"),location:'before'},{id:"btn02",caption:this.t("msgSave.btn02"),location:'after'}],
                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgSave.msg")}</div>)
                                            }
                                            
                                            let pResult = await dialog(tmpConfObj);
                                            if(pResult == 'btn01')
                                            {
                                                let tmpConfObj1 =
                                                {
                                                    id:'msgSaveResult',showTitle:true,title:this.t("msgSave.title"),showCloseButton:true,width:'500px',height:'200px',
                                                    button:[{id:"btn01",caption:this.t("msgSave.btn01"),location:'after'}],
                                                }
                                                console.log(this.itemRelatedObj)
                                                if((await this.itemRelatedObj.save()) == 0)
                                                {                                                    
                                                    tmpConfObj1.content = (<div style={{textAlign:"center",fontSize:"20px",color:"green"}}>{this.t("msgSaveResult.msgSuccess")}</div>)
                                                    await dialog(tmpConfObj1);
                                                    this.btnSave.setState({disabled:true});
                                                    this.btnNew.setState({disabled:false});
                                                }
                                                else
                                                {
                                                    tmpConfObj1.content = (<div style={{textAlign:"center",fontSize:"20px",color:"red"}}>{this.t("msgSaveResult.msgFailed")}</div>)
                                                    await dialog(tmpConfObj1);
                                                }
                                            }
                                        }                              
                                        else
                                        {
                                            let tmpConfObj =
                                            {
                                                id:'msgSaveValid',showTitle:true,title:this.t("msgSaveValid.title"),showCloseButton:true,width:'500px',height:'200px',
                                                button:[{id:"btn01",caption:this.t("msgSaveValid.btn01"),location:'after'}],
                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgSaveValid.msg")}</div>)
                                            }
                                            
                                            await dialog(tmpConfObj);
                                        }                                                 
                                    }}/>
                                </Item>
                                <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnDelete" parent={this} icon="trash" type="danger"
                                    onClick={async()=>
                                    {
                                        let tmpConfObj =
                                        {
                                            id:'msgDelete',showTitle:true,title:this.t("msgDelete.title"),showCloseButton:true,width:'500px',height:'200px',
                                            button:[{id:"btn01",caption:this.t("msgDelete.btn01"),location:'before'},{id:"btn02",caption:this.t("msgDelete.btn02"),location:'after'}],
                                            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgDelete.msg")}</div>)
                                        }
                                        
                                        let pResult = await dialog(tmpConfObj);
                                        if(pResult == 'btn01')
                                        {
                                            
                                            this.itemRelatedObj.dt().removeAll()
                                            await this.itemRelatedObj.dt().delete();
                                            this.init(); 
                                        }
                                        
                                    }}/>
                                </Item>
                                <Item location="after" locateInMenu="auto"
                                widget="dxButton"
                                options= { 
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
                                }} />
                            </Toolbar>
                        </div>
                    </div>
                    {/* Form */}
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <Form colCount={3} id="frmHeader">
                                {/* txtCode */}
                                <Item>
                                    <Label text={this.t("txtCode")} alignment="right" />
                                    <NdTextBox id="txtCode" parent={this} simple={true} dt={{data:this.itemRelatedObj.dt(),field:"ITEM_CODE"}}
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
                                                        await this.itemRelatedObj.load({ITEM_GUID:data[0].GUID});
                                                        this.txtCode.GUID = data[0].GUID
                                                        this.txtCode.value = data[0].CODE
                                                        this.txtName.value = data[0].NAME
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
                                                    await this.itemRelatedObj.load({ITEM_GUID:data[0].GUID});
                                                    this.txtCode.GUID = data[0].GUID
                                                    this.txtCode.value = data[0].CODE
                                                    this.txtName.value = data[0].NAME
                                                }
                                            }
                                        }).bind(this)}
                                    param={this.param.filter({ELEMENT:'txtCode',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'txtCode',USERS:this.user.CODE})}
                                    >
                                        <Validator validationGroup={"frmRelated"  + this.tabIndex}>
                                            <RequiredRule message={this.t("validCode")} />
                                        </Validator> 
                                    </NdTextBox>                                
                                    {/* STOK SEÇİM */}
                                    <NdPopGrid id={"popItemSelect"} parent={this} container={"#root"}
                                    visible={false}
                                    position={{of:'#root'}} 
                                    showTitle={true} 
                                    showBorders={true}
                                    width={'90%'}
                                    height={'90%'}
                                    title={this.t("popItemSelect.title")}
                                    search={true}
                                    data={{source:{select:{query : "SELECT GUID,CODE,NAME FROM ITEMS_VW_01 WHERE UPPER(CODE) LIKE UPPER(@VAL) OR UPPER(NAME) LIKE UPPER(@VAL)",param : ['VAL:string|50']},sql:this.core.sql}}}
                                    >           
                                        <Paging defaultPageSize={22} />
                                        <Column dataField="CODE" caption={this.t("popItemSelect.clmCode")} width={150} />
                                        <Column dataField="NAME" caption={this.t("popItemSelect.clmName")} width={200}/>
                                    </NdPopGrid>
                                </Item>
                                {/* txtName */}
                                <Item>                                
                                    <Label text={this.t("txtName")} alignment="right" />
                                    <NdTextBox id="txtName" parent={this} simple={true} dt={{data:this.itemRelatedObj.dt(),field:"ITEM_NAME"}} readOnly={true}
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    param={this.param.filter({ELEMENT:'txtName',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'txtName',USERS:this.user.CODE})}
                                    >
                                    </NdTextBox>
                                </Item>
                                <Item>                                
                                    <Label text={this.t("txtQuantity")} alignment="right" />
                                    <NdNumberBox id="txtQuantity" parent={this} simple={true} dt={{data:this.itemRelatedObj.dt(),field:"ITEM_QUANTITY"}}
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    param={this.param.filter({ELEMENT:'txtQuantity',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'txtQuantity',USERS:this.user.CODE})}
                                    >
                                    </NdNumberBox>
                                </Item>
                            </Form>
                        </div>
                    </div>
                    {/* Grid */}
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <Form colCount={1} onInitialized={(e)=>
                            {
                                this.frmRelated = e.component
                            }}>
                                <Item location="after">
                                    <Button icon="add"
                                    validationGroup={"frmRelated"  + this.tabIndex}
                                    onClick={async (e)=>
                                    {
                                        if(e.validationGroup.validate().status == "valid")
                                        {
                                            this.popRelatedSelect.show()
                                            this.popRelatedSelect.onClick = async(data) =>
                                            {
                                                for (let i = 0; i < data.length; i++) 
                                                {                                                        
                                                    await this.addItem(data[i])
                                                }
                                            }
                                        }
                                        else
                                        {
                                            let tmpConfObj =
                                            {
                                                id:'msgRelatedValid',showTitle:true,title:this.t("msgRelatedValid.title"),showCloseButton:true,width:'500px',height:'200px',
                                                button:[{id:"btn01",caption:this.t("msgRelatedValid.btn01"),location:'after'}],
                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgRelatedValid.msg")}</div>)
                                            }
                                            
                                            await dialog(tmpConfObj);
                                        }
                                    }}/>
                                </Item>
                                <Item>
                                    <NdGrid parent={this} id={"grdRelated"} 
                                    showBorders={true} 
                                    columnsAutoWidth={true} 
                                    allowColumnReordering={true} 
                                    allowColumnResizing={true} 
                                    filterRow={{visible:true}}
                                    height={'400'} 
                                    width={'100%'}
                                    dbApply={false}
                                    >
                                        <ColumnChooser enabled={true} />
                                        <KeyboardNavigation editOnKeyPress={true} enterKeyAction={'moveFocus'} enterKeyDirection={'column'} />
                                        <Editing mode="cell" allowUpdating={true} allowDeleting={true} />
                                        <Paging defaultPageSize={10} />
                                        <Pager visible={true} allowedPageSizes={[5,10,20,50,100]} showPageSizeSelector={true} />
                                        <Column dataField="RELATED_CODE" caption={this.t("grdRelated.clmItemCode")} width={150} allowEditing={false}/>
                                        <Column dataField="RELATED_NAME" caption={this.t("grdRelated.clmItemName")} width={300} allowEditing={false}/>
                                        <Column dataField="RELATED_QUANTITY" caption={this.t("grdRelated.clmQuantity")} width={100} allowEditing={false}/>
                                    </NdGrid>
                                </Item>
                            </Form>
                        </div>
                    </div>
                    {/* BAĞLI STOK SEÇİM */}
                    <NdPopGrid id={"popRelatedSelect"} parent={this} container={"#root"}
                    visible={false}
                    position={{of:'#root'}} 
                    showTitle={true} 
                    showBorders={true}
                    width={'90%'}
                    height={'90%'}
                    title={this.t("popRelatedSelect.title")}
                    search={true}
                    data={{source:{select:{query : "SELECT GUID,CODE,NAME FROM ITEMS_VW_01 WHERE UPPER(CODE) LIKE UPPER(@VAL) OR UPPER(NAME) LIKE UPPER(@VAL)",param : ['VAL:string|50']},sql:this.core.sql}}}
                    >           
                        <Paging defaultPageSize={22} />
                        <Column dataField="CODE" caption={this.t("popRelatedSelect.clmCode")} width={150} />
                        <Column dataField="NAME" caption={this.t("popRelatedSelect.clmName")} width={200} />
                    </NdPopGrid>
                </ScrollView>
            </div>
        )
    }
}
