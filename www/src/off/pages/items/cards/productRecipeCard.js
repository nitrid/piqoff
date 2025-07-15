import moment from 'moment';
import React from 'react';
import App from '../../../lib/app.js';
import {productRecipeCls} from '../../../../core/cls/items.js'

import ScrollView from 'devextreme-react/scroll-view';
import Toolbar, { Item } from 'devextreme-react/toolbar';
import NdButton from '../../../../core/react/devex/button.js';
import { NdLayout,NdLayoutItem } from '../../../../core/react/devex/layout';
import NdTextBox, { Validator, RequiredRule } from '../../../../core/react/devex/textbox.js'
import NdPopGrid from '../../../../core/react/devex/popgrid.js';
import NdGrid,{Column,Editing,Paging,Scrolling,Button as grdbutton} from '../../../../core/react/devex/grid.js';
import NdDatePicker from '../../../../core/react/devex/datepicker.js';
import NdAccessEdit from '../../../../core/react/devex/accesEdit.js';
import { dialog } from '../../../../core/react/devex/dialog.js';
import { NdToast } from '../../../../core/react/devex/toast.js';
export default class productRecipeCard extends React.PureComponent
{
    constructor(props)
    {
        super(props) 
        this.core = App.instance.core;
        this.prmObj = this.param.filter({TYPE:1,USERS:this.user.CODE});

        this.productObj = new productRecipeCls();

        this.cellRoleRender = this.cellRoleRender.bind(this)
        this.prevCode = "";
        this.tabIndex = props.data.tabkey
    }
    async componentDidMount()
    {
        await this.core.util.waitUntil(0)
        this.init(); 
    }
    async init()
    {
        this.prevCode = ""
        this.productObj.clearAll();

        this.txtItemCode.GUID = ''
        this.txtItemCode.value = ''
        this.txtItemName.value = ''
        this.dtDate.value = moment(new Date()).format("YYYY-MM-DD")
        this.txtQuantity.value = 0

        this.productObj.ds.on('onAddRow',(pTblName,pData) =>
        {            
            if(pData.stat == 'new')
            {
                if(this.prevCode != '')
                {
                    this.btnNew.setState({disabled:true});
                    this.btnBack.setState({disabled:false});
                }
                else
                {
                    this.btnNew.setState({disabled:false});
                    this.btnBack.setState({disabled:false});
                }
                
                this.btnSave.setState({disabled:false});
                this.btnDelete.setState({disabled:false});
            }
        })
        this.productObj.ds.on('onEdit',(pTblName,pData) =>
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
        this.productObj.ds.on('onRefresh',(pTblName) =>
        {        
            this.prevCode = this.productObj.dt().length > 0 ? this.productObj.dt()[0].PRODUCED_ITEM_CODE : '';
            this.btnBack.setState({disabled:false});
            this.btnNew.setState({disabled:false});
            this.btnSave.setState({disabled:true});
            this.btnDelete.setState({disabled:false});
        })
        this.productObj.ds.on('onDelete',(pTblName) =>
        {            
            this.btnBack.setState({disabled:false});
            this.btnNew.setState({disabled:true});
            this.btnSave.setState({disabled:false});
            this.btnDelete.setState({disabled:false});
        })
    }
    cellRoleRender(e)
    {
        if(e.column.dataField == "RAW_ITEM_CODE")
        {
            return (
                <NdTextBox id={"txtGrdItemsCode" + e.rowIndex} parent={this} simple={true}
                value={e.value}
                onKeyDown={async(k)=>
                {
                    if(k.event.key == 'F10' || k.event.key == 'ArrowRight')
                    {
                        this.pg_txtItemCode.onClick = async(data) =>
                        {
                            this.grdList.devGrid.beginUpdate()
                            for (let i = 0; i < data.length; i++) 
                            {
                                await this.addItem(data[i],e.rowIndex)
                            }
                            this.grdList.devGrid.endUpdate()
                        }
                        this.pg_txtItemCode.setVal(e.value)
                    }
                }}
                onValueChanged={(v)=>{e.value = v.value}}
                onChange={(async(r)=>
                {
                    if(typeof r.event.isTrusted == 'undefined')
                    {
                        let tmpQuery = 
                        {
                            query : `SELECT TOP 1 GUID,CODE,NAME FROM ITEMS_VW_04 WHERE CODE = @CODE`,
                            param : ['CODE:string|50'],
                            value : [r.component._changedValue]
                        }
                        let tmpData = await this.core.sql.execute(tmpQuery) 
                        if(tmpData.result.recordset.length > 0)
                        {
                            await this.addItem(tmpData.result.recordset[0],e.rowIndex)
                        }
                        else
                        {
                            this.toast.show({message:this.t("msgItemNotFound.msg"),type:'warning'})
                        }
                    }
                }).bind(this)}
                button=
                {
                    [
                        {
                            id:'01',
                            icon:'more',
                            onClick:async()  =>
                            {
                                this.pg_txtItemCode.onClick = async(data) =>
                                {
                                    this.grdList.devGrid.beginUpdate()
                                    for (let i = 0; i < data.length; i++) 
                                    {
                                        await this.addItem(data[i],e.rowIndex)
                                    }
                                    this.grdList.devGrid.endUpdate()
                                }
                                this.pg_txtItemCode.show()
                            }
                        },
                    ]
                }
                >  
                </NdTextBox>
            )
        }
    }
    getItem(pCode)
    {
        return new Promise(async resolve => 
        {
            let tmpQuery = 
            {
                query : `SELECT TOP 1 GUID,CODE,NAME FROM ITEMS_VW_01 WHERE CODE = @CODE`,
                param : ['CODE:string|25'],
                value : [pCode]
            }
            let tmpData = await this.core.sql.execute(tmpQuery) 

            if(typeof tmpData.result.err == 'undefined' && tmpData.result.recordset.length > 0)
            {
                resolve(tmpData.result.recordset)
            }
        })
    }
    async getDoc(pCode)
    {
        await this.productObj.load({PRODUCED_ITEM_CODE:pCode})
        if(this.productObj.dt().length > 0)
        {
            this.txtItemCode.GUID = this.productObj.dt()[0].GUID
            this.txtItemCode.value = this.productObj.dt()[0].CODE
            this.txtItemName.value = this.productObj.dt()[0].NAME
            this.txtQuantity.value = this.productObj.dt()[0].PRODUCED_QTY
            this.dtDate.value = this.productObj.dt()[0].PRODUCED_DATE
        }
    }
    async addItem(pData,pRowIndex)
    {
        let tmpIndex = 0
        if(typeof pRowIndex == 'undefined')
        {
            this.productObj.addEmpty();
            tmpIndex = this.productObj.dt().length - 1
        }
        else
        {
            tmpIndex = pRowIndex
        }

        this.productObj.dt()[tmpIndex].PRODUCED_DATE = this.dtDate.value
        this.productObj.dt()[tmpIndex].PRODUCED_ITEM_GUID = this.txtItemCode.GUID
        this.productObj.dt()[tmpIndex].PRODUCED_ITEM_CODE = this.txtItemCode.value
        this.productObj.dt()[tmpIndex].PRODUCED_ITEM_NAME = this.txtItemName.value
        this.productObj.dt()[tmpIndex].PRODUCED_QTY = this.txtQuantity.value
        this.productObj.dt()[tmpIndex].RAW_ITEM_GUID = pData.GUID
        this.productObj.dt()[tmpIndex].RAW_ITEM_CODE = pData.CODE
        this.productObj.dt()[tmpIndex].RAW_ITEM_NAME = pData.NAME
        this.productObj.dt()[tmpIndex].RAW_QTY = 0
    }
    render()
    {
        return (
            <div id={this.props.data.id + this.tabIndex}>
                <ScrollView>
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <Toolbar>
                                <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnEdit" parent={this} icon="edit" type="default"
                                    onClick={async()=>
                                    {
                                        if(!this.accesComp.editMode)
                                        {
                                            this.accesComp.openEdit()
                                        }
                                        else
                                        {
                                            this.accesComp.closeEdit()
                                        }
                                    }}/>
                                </Item>
                                <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnBack" parent={this} icon="revert" type="default"
                                    onClick={async()=>
                                    {
                                        if(this.prevCode != '')
                                        {
                                            let tmpConfObj =
                                            {
                                                id:'msgItemBack',showTitle:true,title:this.t("msgItemBack.title"),showCloseButton:true,width:'500px',height:'auto',
                                                button:[{id:"btn01",caption:this.t("msgItemBack.btn01"),location:'before'},{id:"btn02",caption:this.t("msgItemBack.btn02"),location:'after'}],
                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgItemBack.msg")}</div>)
                                            }
                                            
                                            let pResult = await dialog(tmpConfObj);
                                            if(pResult == 'btn02')
                                            {
                                                return;
                                            }    
                                            this.getDoc(this.prevCode); 
                                        }
                                    }}/>
                                </Item>
                                <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnNew" parent={this} icon="file" type="default"
                                    onClick={async()=>
                                    {
                                        let tmpConfObj =
                                        {
                                            id:'msgNewItem',showTitle:true,title:this.t("msgNewItem.title"),showCloseButton:true,width:'500px',height:'auto',
                                            button:[{id:"btn01",caption:this.t("msgNewItem.btn01"),location:'before'},{id:"btn02",caption:this.t("msgNewItem.btn02"),location:'after'}],
                                            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgNewItem.msg")}</div>)
                                        }
                                        
                                        let pResult = await dialog(tmpConfObj);
                                        if(pResult == 'btn02')
                                        {
                                            return;
                                        }    
                                        this.init(); 
                                    }}/>
                                </Item>
                                <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnSave" parent={this} icon="floppy" type="success" validationGroup={"frmHeader" + this.tabIndex}
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
                                                if((await this.productObj.save()) == 0)
                                                {         
                                                    this.toast.show({message:this.t("msgSaveResult.msgSuccess"),type:'success'})
                                                    this.btnSave.setState({disabled:true});
                                                    this.btnNew.setState({disabled:false});
                                                }
                                                else
                                                {
                                                    let tmpConfObj1 =
                                                    {
                                                        id:'msgSaveResult',showTitle:true,title:this.t("msgSave.title"),showCloseButton:true,width:'500px',height:'auto',
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
                                            this.productObj.dt().removeAll()
                                            await this.productObj.dt().delete();
                                            this.init(); 
                                        }
                                    }}/>
                                </Item>
                                <Item location="after" locateInMenu="auto"
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
                        <div className="col-12 pe-0">
                            <NdLayout parent={this} id={"frmHeader" + this.tabIndex} cols={2}>
                                {/* txtItemCodeLy */}
                                <NdLayoutItem key={"txtItemCodeLy"} id={"txtItemCodeLy"} parent={this} data-grid={{x:0,y:0,h:1,w:1}} access={this.access.filter({ELEMENT:'txtItemCodeLy',USERS:this.user.CODE})}>
                                    <div className="row pe-3">
                                        <div className='col-4 p-0 pe-1'>
                                            <label className="col-form-label d-flex justify-content-end">{this.t("txtItemCode") + " :"}</label>
                                        </div>
                                        <div className="col-8 p-0">
                                            <NdTextBox id="txtItemCode" parent={this} tabIndex={this.tabIndex} simple={true}
                                            upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                            button={
                                            [
                                                {
                                                    id:'01',
                                                    icon:'more',
                                                    onClick:()=>
                                                    {
                                                        this.pg_txtItemCode.show()
                                                        this.pg_txtItemCode.onClick = (data) =>
                                                        {
                                                            if(data.length > 0)
                                                            {
                                                                this.txtItemCode.GUID = data[0].GUID
                                                                this.txtItemCode.value = data[0].CODE
                                                                this.txtItemName.value = data[0].NAME
                                                                this.getDoc(data[0].CODE)
                                                            }
                                                        }
                                                    }
                                                }
                                            ]}
                                            param={this.param.filter({ELEMENT:'txtItemCode',USERS:this.user.CODE})} 
                                            selectAll={true}                           
                                            >
                                                <Validator validationGroup={"frmHeader"  + this.tabIndex}>
                                                    <RequiredRule message={this.t("validItemCode")} />
                                                </Validator>
                                            </NdTextBox>      
                                            {/* STOK SEÇİM POPUP */}
                                            <NdPopGrid id={"pg_txtItemCode"} parent={this} container={'#' + this.props.data.id + this.tabIndex} 
                                            visible={false}
                                            position={{of:'#' + this.props.data.id + this.tabIndex}} 
                                            showTitle={true} 
                                            showBorders={true}
                                            width={'90%'}
                                            height={'90%'}
                                            title={this.t("pg_txtItemCode.title")} 
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
                                                <Column dataField="CODE" caption={this.t("pg_txtItemCode.clmCode")} width={'20%'} />
                                                <Column dataField="NAME" caption={this.t("pg_txtItemCode.clmName")} width={'70%'} defaultSortOrder="asc" />
                                                <Column dataField="STATUS" caption={this.t("pg_txtItemCode.clmStatus")} width={'10%'} />
                                            </NdPopGrid>
                                        </div>
                                    </div>
                                </NdLayoutItem>
                                {/* txtItemNameLy */}
                                <NdLayoutItem key={"txtItemNameLy"} id={"txtItemNameLy"} parent={this} data-grid={{x:1,y:0,h:1,w:1}} access={this.access.filter({ELEMENT:'txtItemNameLy',USERS:this.user.CODE})}>
                                    <div className="row pe-3">
                                        <div className='col-4 p-0 pe-1'>
                                            <label className="col-form-label d-flex justify-content-end">{this.t("txtItemName") + " :"}</label>
                                        </div>
                                        <div className="col-8 p-0">
                                            <NdTextBox id="txtItemName" parent={this} tabIndex={this.tabIndex} readOnly={true} simple={true}
                                            param={this.param.filter({ELEMENT:'txtItemName',USERS:this.user.CODE})} 
                                            selectAll={true}/>
                                        </div>
                                    </div>
                                </NdLayoutItem>
                                {/* dtDateLy */}
                                <NdLayoutItem key={"dtDateLy"} id={"dtDateLy"} parent={this} data-grid={{x:0,y:1,h:1,w:1}} access={this.access.filter({ELEMENT:'dtDateLy',USERS:this.user.CODE})}>
                                    <div className="row pe-3">
                                        <div className='col-4 p-0 pe-1'>
                                            <label className="col-form-label d-flex justify-content-end">{this.t("dtDate") + " :"}</label>
                                        </div>
                                        <div className="col-8 p-0">
                                            <NdDatePicker parent={this} id={"dtDate"} tabIndex={this.tabIndex} simple={true}
                                            onValueChanged={(async()=>
                                            {
                                                for (let i = 0; i < this.productObj.dt().length; i++) 
                                                {
                                                    this.productObj.dt()[i].PRODUCED_DATE = this.dtDate.value
                                                }
                                            }).bind(this)}
                                            >
                                                <Validator validationGroup={"frmHeader"  + this.tabIndex}>
                                                    <RequiredRule message={this.t("validDate")} />
                                                </Validator> 
                                            </NdDatePicker>
                                        </div>
                                    </div>
                                </NdLayoutItem>
                                {/* txtQuantityLy */}
                                <NdLayoutItem key={"txtQuantityLy"} id={"txtQuantityLy"} parent={this} data-grid={{x:1,y:1,h:1,w:1}} access={this.access.filter({ELEMENT:'txtQuantityLy',USERS:this.user.CODE})}>
                                    <div className="row pe-3">
                                        <div className='col-4 p-0 pe-1'>
                                            <label className="col-form-label d-flex justify-content-end">{this.t("txtQuantity") + " :"}</label>
                                        </div>
                                        <div className="col-8 p-0">
                                            <NdTextBox id="txtQuantity" parent={this} tabIndex={this.tabIndex} simple={true}
                                            param={this.param.filter({ELEMENT:'txtQuantity',USERS:this.user.CODE})} 
                                            selectAll={true}
                                            onValueChanged={(async()=>
                                            {
                                                for (let i = 0; i < this.productObj.dt().length; i++) 
                                                {
                                                    this.productObj.dt()[i].PRODUCED_QTY = this.txtQuantity.value
                                                }
                                            }).bind(this)}
                                            >
                                                <Validator validationGroup={"frmHeader"  + this.tabIndex}>
                                                    <RequiredRule message={this.t("validQuantity")} />
                                                </Validator>
                                            </NdTextBox>      
                                        </div>
                                    </div>
                                </NdLayoutItem>
                                {/* ButtonBar */}
                                <NdLayoutItem key={"ButtonBarLy"} id={"ButtonBarLy"} parent={this} data-grid={{x:0,y:2,h:1,w:2}} access={this.access.filter({ELEMENT:'ButtonBarLy',USERS:this.user.CODE})}>
                                    <div className="row pe-3">
                                        <div className='col-1 p-0 pe-1'>
                                            <NdButton id="btnAdd" parent={this} icon="plus" type="normal"
                                            onClick={async()=>
                                            {
                                                if(this.txtItemCode.GUID != '00000000-0000-0000-0000-000000000000' && this.txtQuantity.value > 0)
                                                {
                                                    this.pg_txtItemCode.show()
                                                    this.pg_txtItemCode.onClick = (data) =>
                                                    {
                                                        if(data.length > 0)
                                                        {
                                                            this.addItem(data[0])
                                                        }
                                                    }
                                                }
                                                else
                                                {
                                                    this.toast.show({message:this.t("msgAddItemWarning.msg"),type:'warning'})
                                                }
                                            }}/>
                                        </div>
                                    </div>
                                </NdLayoutItem>
                                {/* grdListLy */}
                                <NdLayoutItem key={"grdListLy"} id={"grdListLy"} parent={this} data-grid={{x:0,y:3,h:13,w:2}} access={this.access.filter({ELEMENT:'grdListLy',USERS:this.user.CODE})}>
                                    <div className="row pe-3" style={{height:'100%'}}>
                                        <div className="col-12 p-0">
                                            <NdGrid parent={this} id={"grdList"} 
                                            showBorders={true} 
                                            columnsAutoWidth={true} 
                                            allowColumnReordering={true} 
                                            allowColumnResizing={true} 
                                            height={'100%'} 
                                            width={'100%'}
                                            dbApply={false}
                                            onReady={async()=>
                                            {
                                                await this.grdList.dataRefresh({source:this.productObj.dt()});
                                            }}
                                            >
                                                <Paging enabled={false} />
                                                <Scrolling mode="virtual" />
                                                <Editing mode="cell" allowUpdating={true} allowDeleting={true} />
                                                <Column dataField="RAW_ITEM_CODE" caption={this.t("grdList.clmCode")} allowEditing={true} width={'30%'} editCellRender={this.cellRoleRender}/>
                                                <Column dataField="RAW_ITEM_NAME" caption={this.t("grdList.clmName")} allowEditing={false} width={'60%'}/>
                                                <Column dataField="RAW_QTY" caption={this.t("grdList.clmQuantity")} visible={true} allowEditing={true} width={'10%'}/>
                                            </NdGrid>
                                        </div>
                                    </div>
                                </NdLayoutItem>
                            </NdLayout>
                        </div>
                    </div>
                    {/* ACCESS COMPONENT */}
                    <div>
                        <NdAccessEdit id={"accesComp"} parent={this}/>
                    </div>                            
                    <NdToast id={"toast"} parent={this} displayTime={2000} position={{at:"top center",offset:'0px 110px'}}/>
                </ScrollView>
            </div>
        )
    }
}