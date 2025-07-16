import React from 'react';
import App from '../../../lib/app.js';
import { docCls } from '../../../../core/cls/doc.js';
import moment from 'moment';

import ScrollView from 'devextreme-react/scroll-view';
import Toolbar,{ Item } from 'devextreme-react/toolbar';
import ContextMenu from 'devextreme-react/context-menu';

import NdTextBox, { Validator, RequiredRule } from '../../../../core/react/devex/textbox.js'
import NdSelectBox from '../../../../core/react/devex/selectbox.js';
import NdCheckBox from '../../../../core/react/devex/checkbox.js';
import NdPopGrid from '../../../../core/react/devex/popgrid.js';
import NdPopUp from '../../../../core/react/devex/popup.js';
import NdGrid,{Column,Editing,Paging,Pager,Scrolling,KeyboardNavigation,Export,Lookup} from '../../../../core/react/devex/grid.js';
import NdButton from '../../../../core/react/devex/button.js';
import NdDatePicker from '../../../../core/react/devex/datepicker.js';
import NdDialog, { dialog } from '../../../../core/react/devex/dialog.js';
import { datatable } from '../../../../core/core.js';
import { NdLayout,NdLayoutItem } from '../../../../core/react/devex/layout';
import NdAccessEdit from '../../../../core/react/devex/accesEdit.js';
import { NdForm, NdItem, NdLabel } from '../../../../core/react/devex/form.js';
import { NdToast } from '../../../../core/react/devex/toast.js';
export default class itemEntryOutDoc extends React.PureComponent
{
    constructor(props)
    {
        super(props)

        this.core = App.instance.core;
        this.prmObj = this.param.filter({TYPE:1,USERS:this.user.CODE});
        this.acsobj = this.access.filter({TYPE:1,USERS:this.user.CODE});

        this.InOutDt = new datatable()
        this.docInObj = new docCls();
        this.docOutObj = new docCls();

        this.cellRoleRender = this.cellRoleRender.bind(this)

        this.combineControl = true
        this.combineNew = false  
        this.tabIndex = props.data.tabkey
        
        this.rightItems = [{ text: this.t("getRecipe"), }]

        this.empty = 
        {
            GUID : '00000000-0000-0000-0000-000000000000',
            REF : '',
            REF_NO : 0,
            TYPE : 0,
            DOC_TYPE : 0,
            DOC_DATE : moment(new Date()).format("YYYY-MM-DD"),
            DEPOT : '00000000-0000-0000-0000-000000000000',
            QUANTITY : 0,
            COST_PRICE : 0,
            DEPOT_QUANTITY : 0,
            ITEM : '00000000-0000-0000-0000-000000000000',
            ITEM_CODE : '',
            ITEM_NAME : '',
        }
    }
    async componentDidMount()
    {
        await this.core.util.waitUntil(0)
        this.init()
    }
    async init()
    {
        this.InOutDt.clear()
        this.docInObj.clearAll()
        this.docOutObj.clearAll()

        this.InOutDt.on('onAddRow',async(pData) =>
        {
            if(pData.stat == 'new')
            {
                this.btnNew.setState({disabled:false});
                this.btnBack.setState({disabled:false});
                this.btnNew.setState({disabled:false});
                this.btnBack.setState({disabled:true});
                this.btnSave.setState({disabled:false});
                this.btnDelete.setState({disabled:false});
            }
        })
        this.InOutDt.on('onEdit',(pData) =>
        {       
            this.btnBack.setState({disabled:false});
            this.btnNew.setState({disabled:true});
            this.btnSave.setState({disabled:false});
            this.btnDelete.setState({disabled:false});

            pData.rowData.CUSER = this.user.CODE 
        })
        this.InOutDt.on('onRefresh',() =>
        {            
            this.btnBack.setState({disabled:true});
            this.btnNew.setState({disabled:false});
            this.btnSave.setState({disabled:false});
            this.btnDelete.setState({disabled:false});
        })
        this.InOutDt.on('onDelete',() =>
        {            
            this.btnBack.setState({disabled:false});
            this.btnNew.setState({disabled:false});
            this.btnSave.setState({disabled:false});
            this.btnDelete.setState({disabled:false});
        })

        this.quantityControl = this.prmObj.filter({ID:'negativeQuantity',USERS:this.user.CODE}).getValue().value
        
        this.txtRef.value = this.user.CODE
        this.cmbDepot.value = this.prmObj.filter({ID:'cmbDepot',USERS:this.user.CODE}).getValue().value
        this.dtDocDate.value = moment(new Date()).format("YYYY-MM-DD")

        this.txtRef.readOnly = true
        this.txtRefno.readOnly = true
        
        await this.grdList.dataRefresh({source:this.InOutDt});
        this.txtRef.props.onChange()
    }
    async getDoc(pRef,pRefno)
    {
        App.instance.setState({isExecute:true})
        this.InOutDt.clear()
        this.docInObj.clearAll()
        this.docOutObj.clearAll()
        
        await this.docInObj.load({REF:pRef,REF_NO:pRefno,TYPE:0,DOC_TYPE:0});
        await this.docOutObj.load({REF:pRef,REF_NO:pRefno,TYPE:1,DOC_TYPE:0});

        for (let i = 0; i < this.docInObj.docItems.dt().length; i++) 
        {
            let tmpEmpty = {...this.empty}
            tmpEmpty.GUID = this.docInObj.docItems.dt()[i].GUID
            tmpEmpty.TYPE = this.docInObj.docItems.dt()[i].TYPE
            tmpEmpty.REF = this.docInObj.docItems.dt()[i].REF
            tmpEmpty.REF_NO = this.docInObj.docItems.dt()[i].REF_NO
            tmpEmpty.DOC_TYPE = this.docInObj.docItems.dt()[i].DOC_TYPE
            tmpEmpty.DOC_DATE = this.docInObj.docItems.dt()[i].DOC_DATE
            tmpEmpty.DEPOT = this.docInObj.docItems.dt()[i].INPUT
            tmpEmpty.QUANTITY = this.docInObj.docItems.dt()[i].QUANTITY
            tmpEmpty.COST_PRICE = this.docInObj.docItems.dt()[i].COST_PRICE
            tmpEmpty.DEPOT_QUANTITY = this.docInObj.docItems.dt()[i].DEPOT_QUANTITY
            tmpEmpty.ITEM = this.docInObj.docItems.dt()[i].ITEM
            tmpEmpty.ITEM_CODE = this.docInObj.docItems.dt()[i].ITEM_CODE
            tmpEmpty.ITEM_NAME = this.docInObj.docItems.dt()[i].ITEM_NAME

            this.InOutDt.push(tmpEmpty)
        }
        
        for (let i = 0; i < this.docOutObj.docItems.dt().length; i++) 
        {
            let tmpEmpty = {...this.empty}
            tmpEmpty.GUID = this.docOutObj.docItems.dt()[i].GUID
            tmpEmpty.TYPE = this.docOutObj.docItems.dt()[i].TYPE
            tmpEmpty.REF = this.docOutObj.docItems.dt()[i].REF
            tmpEmpty.REF_NO = this.docOutObj.docItems.dt()[i].REF_NO
            tmpEmpty.DOC_TYPE = this.docOutObj.docItems.dt()[i].DOC_TYPE
            tmpEmpty.DOC_DATE = this.docOutObj.docItems.dt()[i].DOC_DATE
            tmpEmpty.DEPOT = this.docOutObj.docItems.dt()[i].OUTPUT
            tmpEmpty.QUANTITY = this.docOutObj.docItems.dt()[i].QUANTITY
            tmpEmpty.COST_PRICE = this.docOutObj.docItems.dt()[i].COST_PRICE
            tmpEmpty.DEPOT_QUANTITY = this.docOutObj.docItems.dt()[i].DEPOT_QUANTITY
            tmpEmpty.ITEM = this.docOutObj.docItems.dt()[i].ITEM
            tmpEmpty.ITEM_CODE = this.docOutObj.docItems.dt()[i].ITEM_CODE
            tmpEmpty.ITEM_NAME = this.docOutObj.docItems.dt()[i].ITEM_NAME

            this.InOutDt.push(tmpEmpty)
        }

        if(this.InOutDt.length > 0)
        {
            this.txtRef.value = this.InOutDt[0].REF
            this.txtRefno.value = this.InOutDt[0].REF_NO
            this.cmbDepot.value = this.InOutDt[0].DEPOT
            this.dtDocDate.value = this.InOutDt[0].DOC_DATE
        }
        
        this.txtRef.readOnly = true
        this.txtRefno.readOnly = true

        App.instance.setState({isExecute:false})
    }
    cellRoleRender(e)
    {
        if(e.column.dataField == "ITEM_CODE")
        {
            return (
                <NdTextBox id={"txtGrdItemsCode" + e.rowIndex} parent={this} simple={true} 
                upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                value={e.value}
                onKeyDown={async(k)=>
                {
                    if(k.event.key == 'F10' || k.event.key == 'ArrowRight')
                    {
                        this.combineControl = true
                        this.combineNew = false  
                        await this.pg_txtItemsCode.setVal(e.value)
                        this.pg_txtItemsCode.onClick = async(data) =>
                        {
                            for (let i = 0; i < data.length; i++) 
                            {
                                await this.addItem(data[i],e.rowIndex)
                            }
                        }
                    }
                }}
                onValueChanged={(v)=>{e.value = v.value}}
                onChange={(async(r)=>
                {
                    if(typeof r.event.isTrusted == 'undefined')
                    {
                        this.combineControl = true
                        this.combineNew = false 

                        let tmpQuery = 
                        {
                            query : `SELECT 
                                    ITEMS.GUID,
                                    ITEMS.CODE,
                                    ITEMS.NAME,
                                    ITEMS.VAT,
                                    ITEMS.COST_PRICE 
                                    FROM ITEMS_VW_04 AS ITEMS 
                                    INNER JOIN ITEM_BARCODE_VW_01 AS BARCODE ON ITEMS.GUID = BARCODE.ITEM_GUID 
                                    WHERE CODE = @CODE OR BARCODE.BARCODE = @CODE`,
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
                            this.toast.show({message:this.t("msgItemNotFound.msg"),type:"warning"})
                        }
                    }
                }).bind(this)}
                button=
                {
                    [
                        {
                            id:'01',
                            icon:'more',
                            onClick:()  =>
                            {
                                this.pg_txtItemsCode.show()
                                this.pg_txtItemsCode.onClick = async(data) =>
                                {
                                    this.combineControl = true
                                    this.combineNew = false  
                                    for (let i = 0; i < data.length; i++) 
                                    {
                                        await this.addItem(data[i],e.rowIndex)
                                    }
                                }
                            }
                        },
                    ]
                }
                />  
            )
        }
    }
    async addItem(pData,pIndex,pQuantity)
    {
        let tmpIndex = 0

        if(typeof pIndex == 'undefined')
        {
            this.InOutDt.push({...this.empty})
            tmpIndex = this.InOutDt.length - 1
        }
        else
        {
            tmpIndex = pIndex
        }

        if(typeof pQuantity == 'undefined')
        {
            pQuantity = 1
        }

        App.instance.setState({isExecute:true})
        
        if(typeof this.quantityControl != 'undefined' && this.quantityControl ==  true)
        {
            let tmpCheckQuery = 
            {
                query : `SELECT [dbo].[FN_DEPOT_QUANTITY](@GUID,@DEPOT,dbo.GETDATE()) AS QUANTITY`,
                param : ['GUID:string|50','DEPOT:string|50'],
                value : [pData.GUID,this.InOutDt[0].DEPOT]
            }

            let tmpQuantity = await this.core.sql.execute(tmpCheckQuery) 
            
            if(tmpQuantity.result.recordset.length > 0)
            {
                if(tmpQuantity.result.recordset[0].QUANTITY < 1)
                {
                    App.instance.setState({isExecute:false})
                    this.toast.show({message:this.t("msgNotQuantity.msg"),type:"warning"})
                    await this.grdList.devGrid.deleteRow(0)
                    return
                }
                else
                {
                    this.InOutDt[tmpIndex].DEPOT_QUANTITY = tmpQuantity.result.recordset[0].QUANTITY
                }
            }
        }

        for (let i = 0; i < this.InOutDt.length; i++) 
        {
            if(this.InOutDt[i].ITEM_CODE == pData.CODE)
            {
                if(this.combineControl == true)
                {
                    let tmpCombineBtn = ''
                    App.instance.setState({isExecute:false})

                    await this.msgCombineItem.show().then(async (e) =>
                    {
                        if(e == 'btn01')
                        {
                            this.InOutDt[i].QUANTITY = this.InOutDt[i].QUANTITY + pQuantity
                            await this.grdList.devGrid.deleteRow(0)
                            if(this.checkCombine.value == true)
                            {
                                this.combineControl = false
                            }
                            tmpCombineBtn = e
                            return
                        }
                        if(e == 'btn02')
                        {
                            if(this.checkCombine.value == true)
                            {
                                this.combineControl = false
                                this.combineNew = true
                            }
                            return
                        }
                    })
                    if(tmpCombineBtn == 'btn01')
                    {
                        return
                    }
                }
                else if(this.combineNew == false)
                {
                    this.InOutDt[i].QUANTITY = this.InOutDt[i].QUANTITY + pQuantity
                    await this.grdList.devGrid.deleteRow(0)
                    return
                }
            }
        }

        this.InOutDt[tmpIndex].GUID = datatable.uuidv4()
        this.InOutDt[tmpIndex].TYPE = typeof pData.TYPE == 'undefined' ? 0 : pData.TYPE
        this.InOutDt[tmpIndex].REF = this.txtRef.value
        this.InOutDt[tmpIndex].REF_NO = this.txtRefno.value
        this.InOutDt[tmpIndex].DOC_DATE = this.dtDocDate.value
        this.InOutDt[tmpIndex].DEPOT = this.cmbDepot.value
        this.InOutDt[tmpIndex].ITEM_CODE = pData.CODE
        this.InOutDt[tmpIndex].ITEM = pData.GUID
        this.InOutDt[tmpIndex].ITEM_NAME = pData.NAME
        this.InOutDt[tmpIndex].COST_PRICE = pData.COST_PRICE
        this.InOutDt[tmpIndex].QUANTITY = pQuantity
        
        App.instance.setState({isExecute:false})
    }
    checkRow()
    {
        this.InOutDt.forEach(item => 
        {
            item.REF = this.txtRef.value
            item.REF_NO = this.txtRefno.value
            item.DEPOT = this.cmbDepot.value
            item.DOC_DATE = this.dtDocDate.value
        });
    }
    docMerge()
    {
        let tmpInDt = this.InOutDt.where({TYPE:0})
        let tmpOutDt = this.InOutDt.where({TYPE:1})
        
        // INSERT UPDATE INPUT ****************************************************************************/
        if(tmpInDt.length > 0 && this.docInObj.dt().length == 0)
        {
            let tmpDocIn = {...this.docInObj.empty}
            tmpDocIn.REF = tmpInDt[0].REF
            tmpDocIn.REF_NO = tmpInDt[0].REF_NO
            tmpDocIn.TYPE = 0
            tmpDocIn.DOC_TYPE = 0
            tmpDocIn.REBATE = 0
            tmpDocIn.DOC_DATE = tmpInDt[0].DOC_DATE
            tmpDocIn.INPUT = tmpInDt[0].DEPOT
            tmpDocIn.OUTPUT = '00000000-0000-0000-0000-000000000000'
            this.docInObj.addEmpty(tmpDocIn);
        }

        for (let i = 0; i < tmpInDt.length; i++) 
        {
            let tmpItem = {}
            if(this.docInObj.docItems.dt().where({GUID:tmpInDt[i].GUID}).length > 0)
            {
                tmpItem = this.docInObj.docItems.dt().where({GUID:tmpInDt[i].GUID})[0]
            }
            else
            {
                this.docInObj.docItems.addEmpty()
                tmpItem = this.docInObj.docItems.dt()[this.docInObj.docItems.dt().length - 1]
            }
            
            tmpItem.GUID = tmpInDt[i].GUID
            tmpItem.DOC_GUID = this.docInObj.dt()[0].GUID
            tmpItem.TYPE = 0
            tmpItem.DOC_TYPE = 0
            tmpItem.REBATE = 0
            tmpItem.REF = tmpInDt[i].REF
            tmpItem.REF_NO = tmpInDt[i].REF_NO
            tmpItem.DOC_DATE = tmpInDt[i].DOC_DATE
            tmpItem.INPUT = tmpInDt[i].DEPOT
            tmpItem.OUTPUT = '00000000-0000-0000-0000-000000000000'
            tmpItem.ITEM_CODE = tmpInDt[i].ITEM_CODE
            tmpItem.ITEM = tmpInDt[i].ITEM
            tmpItem.ITEM_NAME = tmpInDt[i].ITEM_NAME
            tmpItem.COST_PRICE = tmpInDt[i].COST_PRICE
            tmpItem.QUANTITY = tmpInDt[i].QUANTITY
        }
        //***************************************************************************************** */
        // INSERT UPDATE OUTPUT ******************************************************************* */
        if(tmpOutDt.length > 0 && this.docOutObj.dt().length == 0)
        {
            let tmpDocOut = {...this.docOutObj.empty}
            tmpDocOut.REF = tmpOutDt[0].REF
            tmpDocOut.REF_NO = tmpOutDt[0].REF_NO
            tmpDocOut.TYPE = 1
            tmpDocOut.DOC_TYPE = 0
            tmpDocOut.REBATE = 0
            tmpDocOut.DOC_DATE = tmpOutDt[0].DOC_DATE
            tmpDocOut.INPUT = '00000000-0000-0000-0000-000000000000'
            tmpDocOut.OUTPUT = tmpOutDt[0].DEPOT
            this.docOutObj.addEmpty(tmpDocOut);
        }

        for (let i = 0; i < tmpOutDt.length; i++) 
        {
            let tmpItem = {}
            if(this.docOutObj.docItems.dt().where({GUID:tmpOutDt[i].GUID}).length > 0)
            {
                tmpItem = this.docOutObj.docItems.dt().where({GUID:tmpOutDt[i].GUID})[0]
            }
            else
            {
                this.docOutObj.docItems.addEmpty()
                tmpItem = this.docOutObj.docItems.dt()[this.docOutObj.docItems.dt().length - 1]
            }

            tmpItem.GUID = tmpOutDt[i].GUID
            tmpItem.DOC_GUID = this.docOutObj.dt()[0].GUID
            tmpItem.TYPE = 1
            tmpItem.DOC_TYPE = 0
            tmpItem.REBATE = 0
            tmpItem.REF = tmpOutDt[i].REF
            tmpItem.REF_NO = tmpOutDt[i].REF_NO
            tmpItem.DOC_DATE = tmpOutDt[i].DOC_DATE
            tmpItem.INPUT = '00000000-0000-0000-0000-000000000000'
            tmpItem.OUTPUT = tmpOutDt[i].DEPOT
            tmpItem.ITEM_CODE = tmpOutDt[i].ITEM_CODE
            tmpItem.ITEM = tmpOutDt[i].ITEM
            tmpItem.ITEM_NAME = tmpOutDt[i].ITEM_NAME
            tmpItem.COST_PRICE = tmpOutDt[i].COST_PRICE
            tmpItem.QUANTITY = tmpOutDt[i].QUANTITY
        }
        //***************************************************************************************** */
        // DELETE INPUT**************************************************************************** */
        for (let i = 0; i < this.InOutDt._deleteList.length; i++) 
        {
            let tmpInDelDt = this.docInObj.docItems.dt().where({GUID:this.InOutDt._deleteList[i].GUID})
            let tmpOutDelDt = this.docOutObj.docItems.dt().where({GUID:this.InOutDt._deleteList[i].GUID})

            if(tmpInDelDt.length > 0)
            {
                this.docInObj.docItems.dt().removeAt(tmpOutDelDt[0])
            }
            if(tmpOutDelDt.length > 0)
            {
                this.docOutObj.docItems.dt().removeAt(tmpOutDelDt[0])
            }
        }
    }
    render()
    {
        return(
            <div id={this.props.data.id + this.tabIndex}>
                <ScrollView>
                    {/* Toolbar */}
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
                                    onClick={()=>
                                    {
                                        if(this.InOutDt.length > 0)
                                        {
                                            this.getDoc(this.InOutDt[0].REF,this.InOutDt[0].REF_NO)
                                        }
                                    }}/>
                                </Item>
                                <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnNew" parent={this} icon="file" type="default" onClick={()=>{this.init()}}/>
                                </Item>
                                <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnSave" parent={this} icon="floppy" type="success" validationGroup={"frmFrom" + this.tabIndex}
                                    onClick={async (e)=>
                                    {
                                        if(this.InOutDt.length == 0)
                                        {
                                            return
                                        }

                                        if(typeof this.InOutDt[0] == 'undefined')
                                        {
                                            this.toast.show({message:this.lang.t("msgNotRow.msg"),type:"warning"})
                                            this.getDoc(this.InOutDt[0].REF,this.InOutDt[0].REF_NO)
                                            return
                                        }

                                        let tmpDatas = this.prmObj.filter({ID:'descriptionControl',USERS:this.user.CODE}).getValue()
                                        
                                        if(typeof tmpDatas != 'undefined' && tmpDatas.value ==  true)
                                        {
                                            for (let i = 0; i < this.InOutDt.length; i++) 
                                            {
                                                if(this.InOutDt[i].DESCRIPTION == '')
                                                {
                                                    this.toast.show({message:this.t("msgEmpDescription.msg"),type:"warning"})
                                                    return
                                                }
                                            }
                                        }

                                        if(this.InOutDt[this.InOutDt.length - 1].ITEM_CODE == '')
                                        {
                                            await this.grdList.devGrid.deleteRow(0)
                                        }

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
                                                this.docMerge()

                                                if((await this.docInObj.save()) == 0 && (await this.docOutObj.save()) == 0)
                                                {
                                                    this.toast.show({message:this.t("msgSaveResult.msgSuccess"),type:"success"})
                                                    this.btnSave.setState({disabled:true});
                                                    this.btnNew.setState({disabled:false});
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
                                            this.toast.show({message:this.t("msgSaveValid.msg"),type:"warning"})
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
                                            if(this.docInObj.dt().length > 0)
                                            {
                                                this.docInObj.dt().removeAt(0)
                                                await this.docInObj.dt().delete();
                                            }
                                            if(this.docOutObj.dt().length > 0)
                                            {
                                                this.docOutObj.dt().removeAt(0)
                                                await this.docOutObj.dt().delete();
                                            }
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
                                } />
                            </Toolbar>
                        </div>
                    </div>
                    {/* Form */}
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <NdLayout parent={this} id={"frmFrom" + this.tabIndex} cols={4}>
                                {/* txtRef */}
                                <NdLayoutItem key={"txtRefLy"} id={"txtRefLy"} parent={this} data-grid={{x:0,y:0,h:1,w:2}} access={this.access.filter({ELEMENT:'txtRefLy',USERS:this.user.CODE})}>
                                    <div className="row">
                                        <div className='col-4 p-0 pe-1'>
                                            <label className="col-form-label d-flex justify-content-end">{this.t("txtRef") + " :"}</label>
                                        </div>
                                        <div className="col-8 p-0">
                                            <div className="row">
                                                <div className="col-6">
                                                    <NdTextBox id="txtRef" parent={this} simple={true}
                                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                                    readOnly={true}
                                                    maxLength={32}
                                                    onChange={(async(e)=>
                                                    {
                                                        let tmpQuery = 
                                                        {
                                                            query : `SELECT ISNULL(MAX(REF_NO) + 1,1) AS REF_NO FROM DOC WHERE TYPE IN (0,1) AND DOC_TYPE = 0 AND REF = @REF`,
                                                            param : ['REF:string|25'],
                                                            value : [this.txtRef.value]
                                                        }

                                                        let tmpData = await this.core.sql.execute(tmpQuery) 
                                                        
                                                        if(tmpData.result.recordset.length > 0)
                                                        {
                                                            this.txtRefno.value = tmpData.result.recordset[0].REF_NO
                                                        }

                                                        this.checkRow()
                                                    }).bind(this)}
                                                    param={this.param.filter({ELEMENT:'txtRef',USERS:this.user.CODE})}
                                                    access={this.access.filter({ELEMENT:'txtRef',USERS:this.user.CODE})}
                                                    >
                                                        <Validator validationGroup={"frmFrom" + this.tabIndex}>
                                                            <RequiredRule message={this.t("validRef")} />
                                                        </Validator>  
                                                    </NdTextBox>
                                                </div>
                                                <div className="col-6">
                                                    <NdTextBox id="txtRefno" parent={this} simple={true}
                                                    readOnly={true}
                                                    button=
                                                    {
                                                        [
                                                            {
                                                                id:'01',
                                                                icon:'more',
                                                                onClick:()=>
                                                                {
                                                                    this.pg_Docs.show()
                                                                    this.pg_Docs.onClick = (data) =>
                                                                    {
                                                                        if(data.length > 0)
                                                                        {
                                                                            this.getDoc(data[0].REF,data[0].REF_NO)
                                                                        }
                                                                    }
                                                                        
                                                                }
                                                            },
                                                            {
                                                                id:'02',
                                                                icon:'arrowdown',
                                                                onClick:()=>
                                                                {
                                                                    this.txtRefno.value = Math.floor(Date.now() / 1000)
                                                                }
                                                            }
                                                        ]
                                                    }
                                                    param={this.param.filter({ELEMENT:'txtRefno',USERS:this.user.CODE})}
                                                    access={this.access.filter({ELEMENT:'txtRefno',USERS:this.user.CODE})}
                                                    >
                                                        <Validator validationGroup={"frmFrom" + this.tabIndex}>
                                                            <RequiredRule message={this.t("validRefNo")} />
                                                        </Validator> 
                                                    </NdTextBox>
                                                </div>
                                                {/*EVRAK SEÇİM */}
                                                <NdPopGrid id={"pg_Docs"} parent={this} container={'#' + this.props.data.id + this.tabIndex}
                                                visible={false}
                                                position={{of:'#' + this.props.data.id + this.tabIndex}} 
                                                showTitle={true} 
                                                showBorders={true}
                                                width={'90%'}
                                                height={'90%'}
                                                title={this.t("pg_Docs.title")} 
                                                data={{source:{select:{query : `SELECT REF,REF_NO,DOC_DATE_CONVERT FROM DOC_VW_01 WHERE TYPE IN (0,1) AND DOC_TYPE = 0 AND REBATE = 0 GROUP BY REF,REF_NO,DOC_DATE_CONVERT,DOC_DATE ORDER BY DOC_DATE DESC`},sql:this.core.sql}}}
                                                >
                                                    <Column dataField="REF" caption={this.t("pg_Docs.clmRef")} width={150}/>
                                                    <Column dataField="REF_NO" caption={this.t("pg_Docs.clmRefNo")} width={300} />
                                                    <Column dataField="DOC_DATE_CONVERT" caption={this.t("pg_Docs.clmDate")} width={300} />
                                                </NdPopGrid>
                                            </div>
                                        </div>
                                    </div>
                                </NdLayoutItem>
                                {/* cmbDepot */}
                                <NdLayoutItem key={"cmbDepotLy"} id={"cmbDepotLy"} parent={this} data-grid={{x:0,y:1,h:1,w:2}} access={this.access.filter({ELEMENT:'cmbDepotLy',USERS:this.user.CODE})}>
                                    <div className="row">
                                        <div className='col-4 p-0 pe-1'>
                                            <label className="col-form-label d-flex justify-content-end">{this.t("cmbDepot") + " :"}</label>
                                        </div>
                                        <div className="col-8 p-0">
                                            <NdSelectBox simple={true} parent={this} id="cmbDepot"
                                            displayExpr="NAME"                       
                                            valueExpr="GUID"
                                            value=""
                                            searchEnabled={true}
                                            notRefresh = {true}
                                            data={{source:{select:{query : "SELECT * FROM DEPOT_VW_01"},sql:this.core.sql}}}
                                            param={this.param.filter({ELEMENT:'cmbDepot',USERS:this.user.CODE})}
                                            access={this.access.filter({ELEMENT:'cmbDepot',USERS:this.user.CODE})}
                                            onValueChanged={(async()=>{this.checkRow()}).bind(this)}
                                            >
                                                <Validator validationGroup={"frmFrom" + this.tabIndex}>
                                                    <RequiredRule message={this.t("validDepot")} />
                                                </Validator> 
                                            </NdSelectBox>
                                        </div>
                                    </div>
                                </NdLayoutItem>
                                {/* dtDocDate */}
                                <NdLayoutItem key={"dtDocDateLy"} id={"dtDocDateLy"} parent={this} data-grid={{x:2,y:0,h:1,w:2}} access={this.access.filter({ELEMENT:'dtDocDateLy',USERS:this.user.CODE})}>
                                    <div className="row">
                                        <div className='col-4 p-0 pe-1'>
                                            <label className="col-form-label d-flex justify-content-end">{this.t("dtDocDate") + " :"}</label>
                                        </div>
                                        <div className="col-8 p-0">
                                            <NdDatePicker simple={true}  parent={this} id={"dtDocDate"}
                                            onValueChanged={(async()=>{this.checkRow()}).bind(this)}>
                                                <Validator validationGroup={"frmFrom" + this.tabIndex}>
                                                    <RequiredRule message={this.t("validDocDate")} />
                                                </Validator> 
                                            </NdDatePicker>
                                        </div>
                                    </div>
                                </NdLayoutItem>
                                {/* txtBarcode */}
                                <NdLayoutItem key={"txtBarcodeLy"} id={"txtBarcodeLy"} parent={this} data-grid={{x:0,y:2,h:1,w:2}} access={this.access.filter({ELEMENT:'txtBarcodeLy',USERS:this.user.CODE})}>
                                    <div className="row">
                                        <div className='col-4 p-0 pe-1'>
                                            <label className="col-form-label d-flex justify-content-end">{this.t("txtBarcode") + " :"}</label>
                                        </div>
                                        <div className="col-8 p-0">
                                            <NdTextBox id="txtBarcode" parent={this} simple={true}  
                                            upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                            button=
                                            {
                                                [
                                                    {
                                                        id:'01',
                                                        icon:"fa-solid fa-barcode",
                                                        onClick:async(e)=>
                                                        {
                                                            if(this.cmbDepot.value == '')
                                                            {
                                                                this.toast.show({message:this.t("msgDocValid.msg"),type:"warning"})
                                                                this.txtBarcode.setState({value:""})
                                                                return
                                                            }
                                                        
                                                            await this.pg_txtBarcode.setVal(this.txtBarcode.value)
                                                            this.pg_txtBarcode.show()
                                                            this.pg_txtBarcode.onClick = async(data) =>
                                                            {
                                                                this.txtBarcode.value = ""
                                                                if(data.length > 0)
                                                                {
                                                                    this.customerControl = true
                                                                    this.customerClear = false
                                                                    this.combineControl = true
                                                                    this.combineNew = false
                
                                                                    for (let i = 0; i < data.length; i++) 
                                                                    {
                                                                        await this.addItem(data[i])
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                ]
                                            }
                                            onEnterKey={(async(e)=>
                                            {
                                                if(this.cmbDepot.value == '')
                                                {
                                                    this.toast.show({message:this.t("msgDocValid.msg"),type:"warning"})
                                                    this.txtBarcode.setState({value:""})
                                                    return
                                                }

                                                let tmpQuery = 
                                                {
                                                    query : `SELECT 
                                                            ITEMS.GUID,
                                                            ITEMS.CODE,
                                                            ITEMS.NAME,
                                                            ITEMS.COST_PRICE 
                                                            FROM ITEMS_VW_04 AS ITEMS
                                                            INNER JOIN ITEM_BARCODE_VW_01 AS BARCODE ON ITEMS.GUID = BARCODE.ITEM_GUID 
                                                            WHERE CODE = @CODE OR BARCODE.BARCODE = @CODE ORDER BY BARCODE.CDATE DESC`,
                                                    param : ['CODE:string|50'],
                                                    value : [this.txtBarcode.value]
                                                }

                                                let tmpData = await this.core.sql.execute(tmpQuery) 
                                                this.txtBarcode.setState({value:""})
                                                
                                                if(tmpData.result.recordset.length > 0)
                                                {
                                                    this.combineControl = true
                                                    this.combineNew = false  
                                                    await this.msgQuantity.show().then(async (e) =>
                                                    {
                                                        if(e == 'btn01')
                                                        {
                                                            await this.addItem(tmpData.result.recordset[0],undefined,this.txtQuantity.value)
                                                        }
                                                    });
                                                }
                                                else
                                                {
                                                    this.toast.show({message:this.t("msgItemNotFound.msg"),type:"warning"})
                                                }
                                            }).bind(this)}
                                            param={this.param.filter({ELEMENT:'txtBarcode',USERS:this.user.CODE})}
                                            access={this.access.filter({ELEMENT:'txtBarcode',USERS:this.user.CODE})}
                                            />
                                        </div>
                                    </div>
                                </NdLayoutItem>
                                {/* ButtonBar */}
                                <NdLayoutItem key={"ButtonBarLy"} id={"ButtonBarLy"} parent={this} data-grid={{x:0,y:3,h:1,w:4}} access={this.access.filter({ELEMENT:'ButtonBarLy',USERS:this.user.CODE})}>
                                    <div className="row">
                                        <div className='col-1 p-0 pe-1'>
                                            <NdButton id="btnAdd" parent={this} icon="plus" type="normal"
                                            onClick={async()=>
                                            {
                                                this.pg_txtItemsCode.show()
                                                this.pg_txtItemsCode.onClick = async(data) =>
                                                {
                                                    this.combineControl = true
                                                    this.combineNew = false  
                                                    for (let i = 0; i < data.length; i++) 
                                                    {
                                                        await this.addItem(data[i])
                                                    }
                                                }
                                            }}/>
                                        </div>
                                    </div>
                                </NdLayoutItem>
                                {/* grdListLy */}
                                <NdLayoutItem key={"grdListLy"} id={"grdListLy"} parent={this} data-grid={{x:0,y:4,h:10,w:4}} access={this.access.filter({ELEMENT:'grdListLy',USERS:this.user.CODE})}>
                                    <div className="row" style={{height:'100%'}}>
                                        <div className="col-12 p-0">
                                            <React.Fragment>
                                                <NdGrid parent={this} id={"grdList"} 
                                                filterRow={{visible:true}} 
                                                height={'100%'} 
                                                width={'100%'}
                                                dbApply={false}
                                                loadPanel={{enabled:true}}
                                                onRowUpdating={async(e)=>
                                                {
                                                    if(this.quantityControl == true)
                                                    {
                                                        if(typeof e.newData.QUANTITY != 'undefined' && e.key.DEPOT_QUANTITY < e.newData.QUANTITY)
                                                        {
                                                            this.toast.show({message:this.t("msgNotQuantity.msg") + e.oldData.DEPOT_QUANTITY,type:"warning"})
                                                            e.key.QUANTITY = e.oldData.DEPOT_QUANTITY
                                                        }
                                                    }
                                                }}
                                                >
                                                    <Paging defaultPageSize={10} />
                                                    <Pager visible={true} allowedPageSizes={[5,10,20,50,100]} showPageSizeSelector={true} />
                                                    <KeyboardNavigation editOnKeyPress={true} enterKeyAction={'moveFocus'} enterKeyDirection={'column'} />
                                                    <Scrolling mode="standart"/>
                                                    <Editing mode="cell" allowUpdating={true} allowDeleting={true} confirmDelete={false}/>
                                                    <Export fileName={this.lang.t("menuOff.stk_02_003")} enabled={true} allowExportSelectedData={true} />
                                                    <Column dataField="TYPE" caption={this.t("grdList.clmType")} width={100}>
                                                        <Lookup dataSource={[{ID:0,VALUE:this.t("cmbType.input")},{ID:1,VALUE:this.t("cmbType.output")}]} displayExpr="VALUE"valueExpr="ID"/>
                                                    </Column>
                                                    <Column dataField="ITEM_CODE" caption={this.t("grdList.clmItemCode")} width={150} editCellRender={this.cellRoleRender}/>
                                                    <Column dataField="ITEM_NAME" caption={this.t("grdList.clmItemName")} width={500} />
                                                    <Column dataField="QUANTITY" caption={this.t("grdList.clmQuantity")} dataType={'number'} width={150}/>
                                                    <Column dataField="DESCRIPTION" caption={this.t("grdList.clmDescription")} />
                                                </NdGrid>
                                                <ContextMenu
                                                dataSource={this.rightItems}
                                                width={200}
                                                target="#grdList"
                                                onItemClick={(async(e)=>
                                                {
                                                    if(e.itemData.text == this.t("getRecipe"))
                                                    {
                                                        await this.popRecipe.show()
                                                        this.popRecipe.onClick = async(pRData) =>
                                                        {
                                                            await this.popRecipeDetail.show()

                                                            let tmpQuery = 
                                                            {
                                                                query : `SELECT 0 AS TYPE,'${this.t("cmbType.input")}' AS TYPE_NAME, PRODUCED_ITEM_GUID AS ITEM_GUID,PRODUCED_ITEM_CODE AS ITEM_CODE,PRODUCED_ITEM_NAME AS ITEM_NAME,PRODUCED_QTY AS QUANTITY,0 AS INPUT FROM PRODUCT_RECIPE_VW_01 
                                                                        WHERE PRODUCED_ITEM_GUID = @ITEM 
                                                                        GROUP BY PRODUCED_DATE,PRODUCED_ITEM_GUID,PRODUCED_ITEM_CODE,PRODUCED_ITEM_NAME,PRODUCED_QTY 
                                                                        UNION ALL 
                                                                        SELECT 1 AS TYPE,'${this.t("cmbType.output")}' AS TYPE_NAME, RAW_ITEM_GUID AS ITEM_GUID,RAW_ITEM_CODE AS ITEM_CODE,RAW_ITEM_NAME AS ITEM_NAME,RAW_QTY AS QUANTITY,0 AS INPUT FROM PRODUCT_RECIPE_VW_01 
                                                                        WHERE PRODUCED_ITEM_GUID = @ITEM`,
                                                                param : ['ITEM:string|50'],
                                                                value : [pRData[0].PRODUCED_ITEM_GUID]
                                                            }
                                                            
                                                            let tmpData = await this.core.sql.execute(tmpQuery) 

                                                            if(tmpData.result.recordset.length > 0)
                                                            {   
                                                                await this.popRecipeDetail.setData(tmpData.result.recordset)
                                                            }
                                                            else
                                                            {
                                                                await this.popRecipeDetail.setData([])
                                                            }

                                                            this.popRecipeDetail.onClick = async(pRdData)=>
                                                            {
                                                                for (let i = 0; i < pRdData.length; i++) 
                                                                {
                                                                    if(pRdData[i].INPUT > 0)
                                                                    {
                                                                        let tmpEmpty = 
                                                                        {
                                                                            TYPE : pRdData[i].TYPE,
                                                                            GUID : pRdData[i].ITEM_GUID,
                                                                            CODE : pRdData[i].ITEM_CODE,
                                                                            NAME : pRdData[i].ITEM_NAME,
                                                                            COST_PRICE : 0,
                                                                        }
                                                                        await this.addItem(tmpEmpty,undefined,pRdData[i].INPUT)
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }).bind(this)} />
                                            </React.Fragment>
                                        </div>
                                    </div>
                                </NdLayoutItem>
                            </NdLayout>
                        </div>
                    </div>
                    {/* ACCESS COMPONENT */}
                    <NdAccessEdit id={"accesComp"} parent={this}/>
                    {/* Stok Seçim */}
                    <NdPopGrid id={"pg_txtItemsCode"} parent={this} container={'#' + this.props.data.id + this.tabIndex}
                    visible={false}
                    position={{of:'#' + this.props.data.id + this.tabIndex}} 
                    showTitle={true} 
                    showBorders={true}
                    width={'90%'}
                    height={'90%'}
                    title={this.t("pg_txtItemsCode.title")} //
                    search={true}
                    data = 
                    {{
                        source:
                        {
                            select:
                            {
                                query : `SELECT GUID,CODE,NAME,VAT,COST_PRICE FROM ITEMS_VW_04 WHERE UPPER(CODE) LIKE UPPER(@VAL) OR UPPER(NAME) LIKE UPPER(@VAL)`,
                                param : ['VAL:string|50']
                            },
                            sql:this.core.sql
                        }
                    }}
                    >
                        <Column dataField="CODE" caption={this.t("pg_txtItemsCode.clmCode")} width={150} />
                        <Column dataField="NAME" caption={this.t("pg_txtItemsCode.clmName")} width={300} defaultSortOrder="asc" />
                    </NdPopGrid>
                    {/* Yönetici PopUp */}
                    <NdPopUp parent={this} id={"popPassword"} 
                    visible={false}
                    showCloseButton={true}
                    showTitle={true}
                    title={this.t("popPassword.title")}
                    container={'#' + this.props.data.id + this.tabIndex} 
                    width={'500'}
                    height={'200'}
                    position={{of:'#' + this.props.data.id + this.tabIndex}}
                    >
                        <NdForm colCount={1} height={'fit-content'}>
                            <NdItem>
                                <NdLabel text={this.t("popPassword.Password")} alignment="right" />
                                <NdTextBox id="txtPassword" mode="password" parent={this} simple={true} maxLength={32}/>
                            </NdItem>
                            <NdItem>
                                <div className='row'>
                                    <div className='col-6'>
                                        <NdButton text={this.t("popPassword.btnApprove")} type="normal" stylingMode="contained" width={'100%'} 
                                        onClick={async ()=>
                                        {       
                                            let tmpPass = btoa(this.txtPassword.value);
                                            let tmpQuery = 
                                            {
                                                query : `SELECT TOP 1 * FROM USERS WHERE PWD = @PWD AND ROLE = 'Administrator' AND STATUS = 1`, 
                                                param : ['PWD:string|50'],
                                                value : [tmpPass],
                                            }

                                            let tmpData = await this.core.sql.execute(tmpQuery) 
                                            
                                            if(tmpData.result.recordset.length > 0)
                                            {
                                                this.toast.show({message:this.t("msgPasswordSucces.msg"),type:"success"})
                                                this.popPassword.hide();  
                                            }
                                            else
                                            {
                                                this.toast.show({message:this.t("msgPasswordWrong.msg"),type:"warning"})
                                            }
                                        }}/>
                                    </div>
                                    <div className='col-6'>
                                        <NdButton text={this.lang.t("btnCancel")} type="normal" stylingMode="contained" width={'100%'} onClick={()=>{this.popPassword.hide()}}/>
                                    </div>
                                </div>
                            </NdItem>
                        </NdForm>
                    </NdPopUp>
                    {/* Hızlı Açıklama Ekle PopUp */}
                    <NdPopGrid id={"pg_quickDesc"} parent={this} container={'#' + this.props.data.id + this.tabIndex}
                    visible={false}
                    position={{of:'#' + this.props.data.id + this.tabIndex}} 
                    showTitle={true} 
                    showBorders={true}
                    width={'90%'}
                    height={'90%'}
                    selection={{mode:"single"}}
                    title={this.t("pg_quickDesc.title")} //
                    data = 
                    {{
                        source:
                        {
                            select:
                            {
                                query : `SELECT GUID,DESCRIPTION FROM [dbo].[QUICK_DESCRIPTION] WHERE PAGE = 'stk_02_003'`,
                            },
                            sql:this.core.sql
                        }
                    }}
                    button=
                    {
                        [
                            {
                                id:'01',
                                icon:'add',
                                onClick:()=>
                                {
                                    this.txtQdescAdd.value = ''
                                    this.popQDescAdd.show()
                                    this.pg_quickDesc.hide()
                                }
                            }
                        ]
                    }
                    >
                        <Column dataField="DESCRIPTION" caption={this.t("pg_quickDesc.clmDesc")} width={150} />
                    </NdPopGrid>
                    {/* Açıklama Ekle PopUp */}
                    <div>
                        <NdPopUp parent={this} id={"popQDescAdd"} 
                        visible={false}
                        showCloseButton={true}
                        showTitle={true}
                        title={this.t("popQDescAdd.title")}
                        container={'#' + this.props.data.id + this.tabIndex} 
                        width={'500'}
                        height={'200'}
                        position={{of:'#' + this.props.data.id + this.tabIndex}}
                        >
                            <NdForm colCount={1} height={'fit-content'}>
                                <NdItem>
                                    <NdLabel text={this.t("popQDescAdd.description")} alignment="right" />
                                    <NdTextBox id="txtQdescAdd" parent={this} simple={true} maxLength={32}/>
                                </NdItem>
                                <NdItem>
                                    <div className='row'>
                                        <div className='col-6'>
                                            <NdButton text={this.t("popQDescAdd.btnApprove")} type="normal" stylingMode="contained" width={'100%'} 
                                            onClick={async ()=>
                                            {       
                                                let tmpDesc = {...this.qDescObj.empty}
                                                tmpDesc.DESCRIPTION = this.txtQdescAdd.value
                                                tmpDesc.PAGE = this.props.data.id
                                                this.qDescObj.addEmpty(tmpDesc);
                                                await this.qDescObj.save()
                                                this.popQDescAdd.hide();
                                                this.pg_quickDesc.show()
                                            }}/>
                                        </div>
                                        <div className='col-6'>
                                            <NdButton text={this.lang.t("btnCancel")} type="normal" stylingMode="contained" width={'100%'} onClick={()=>{this.popQDescAdd.hide()}}/>
                                        </div>
                                    </div>
                                </NdItem>
                            </NdForm>
                        </NdPopUp>
                    </div> 
                    {/* combineItem Dialog  */}
                    <NdDialog id={"msgCombineItem"} container={"#root"} parent={this}
                    position={{of:'#root'}} 
                    showTitle={true} 
                    title={this.t("msgCombineItem.title")} 
                    showCloseButton={false}
                    width={"500px"}
                    height={"250px"}
                    button={[{id:"btn01",caption:this.t("msgCombineItem.btn01"),location:'before'},{id:"btn02",caption:this.t("msgCombineItem.btn02"),location:'after'}]}
                    >
                        <div className="row">
                            <div className="col-12 py-2">
                                <div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgCombineItem.msg")}</div>
                            </div>
                            <div className="col-12 py-2">
                                <NdForm>
                                    {/* checkCustomer */}
                                    <NdItem>
                                        <NdLabel text={this.lang.t("checkAll")} alignment="right" />
                                        <NdCheckBox id="checkCombine" parent={this} simple={true} value ={false}/>
                                    </NdItem>
                                </NdForm>
                            </div>
                        </div>
                    </NdDialog>
                    {/* Barkod PopUp */}
                    <NdPopGrid id={"pg_txtBarcode"} parent={this} container={'#' + this.props.data.id + this.tabIndex}
                    visible={false}
                    position={{of:'#' + this.props.data.id + this.tabIndex}} 
                    showTitle={true} 
                    showBorders={true}
                    width={'90%'}
                    height={'90%'}
                    title={this.t("pg_txtBarcode.title")} //
                    search={true}
                    data = 
                    {{
                        source:
                        {
                            select:
                            {
                                query : `SELECT 
                                        ITEMS.GUID,
                                        ITEMS.CODE,
                                        ITEMS.NAME,
                                        ITEMS.COST_PRICE,
                                        BARCODE.BARCODE AS BARCODE 
                                        FROM ITEMS_VW_04 AS ITEMS 
                                        INNER JOIN ITEM_BARCODE_VW_01 AS BARCODE ON ITEMS.GUID = BARCODE.ITEM_GUID WHERE BARCODE.BARCODE LIKE '%'+ @BARCODE ORDER BY BARCODE.CDATE DESC`,
                                param : ['BARCODE:string|50'],
                            },
                            sql:this.core.sql
                        }
                    }}
                    >
                        <Column dataField="BARCODE" caption={this.t("pg_txtBarcode.clmBarcode")} width={150} />
                        <Column dataField="CODE" caption={this.t("pg_txtBarcode.clmCode")} width={150} />
                        <Column dataField="NAME" caption={this.t("pg_txtBarcode.clmName")} width={300} defaultSortOrder="asc" />
                    </NdPopGrid>
                    {/* Miktar Dialog  */}
                    <NdDialog id={"msgQuantity"} container={"#root"} parent={this}
                    position={{of:'#root'}} 
                    showTitle={true} 
                    title={this.t("msgQuantity.title")} 
                    showCloseButton={false}
                    width={"500px"}
                    height={"250px"}
                    button={[{id:"btn01",caption:this.t("msgQuantity.btn01"),location:'before'},{id:"btn02",caption:this.t("msgQuantity.btn02"),location:'after'}]}
                    onShowed={()=>
                    {
                        this.txtQuantity.setState({value:1})
                        setTimeout(() => {this.txtQuantity.focus()}, 500);
                    }}
                    >
                        <div className="row">
                            <div className="col-12 py-2">
                                <div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgQuantity.msg")}</div>
                            </div>
                            <div className="col-12 py-2">
                                <NdForm>
                                    {/* txtQuantity */}
                                    <NdItem>
                                        <NdLabel text={this.t("txtQuantity")} alignment="right" />
                                        <NdTextBox id="txtQuantity" parent={this} simple={true}  
                                        param={this.param.filter({ELEMENT:'txtQuantity',USERS:this.user.CODE})}
                                        access={this.access.filter({ELEMENT:'txtQuantity',USERS:this.user.CODE})}
                                        value ={1}
                                        />
                                    </NdItem>
                                </NdForm>
                            </div>
                        </div>
                    </NdDialog>
                    {/* Urun Recete PopUp */}
                    <NdPopGrid id={"popRecipe"} parent={this} container={'#' + this.props.data.id + this.tabIndex}
                    visible={false}
                    position={{of:'#' + this.props.data.id + this.tabIndex}} 
                    showTitle={true} 
                    showBorders={true}
                    width={'90%'}
                    height={'90%'}
                    selection={{mode:"single"}}
                    title={this.t("popRecipe.title")} //
                    data = 
                    {{
                        source:
                        {
                            select:
                            {
                                query : `SELECT PRODUCED_DATE,PRODUCED_ITEM_GUID,PRODUCED_ITEM_CODE,PRODUCED_ITEM_NAME,PRODUCED_QTY 
                                        FROM PRODUCT_RECIPE_VW_01 GROUP BY PRODUCED_DATE,PRODUCED_ITEM_GUID,PRODUCED_ITEM_CODE,
                                        PRODUCED_ITEM_NAME,PRODUCED_QTY`,
                            },
                            sql:this.core.sql
                        }
                    }}
                    >
                        <Column dataField="PRODUCED_DATE" caption={this.t("popRecipe.clmDate")}  width={110} dataType={'date'} format={'dd/MM/yyyy'} defaultSortOrder="asc"/>
                        <Column dataField="PRODUCED_ITEM_CODE" caption={this.t("popRecipe.clmCode")} width={200}/>
                        <Column dataField="PRODUCED_ITEM_NAME" caption={this.t("popRecipe.clmName")} width={450} />
                        <Column dataField="PRODUCED_QTY" caption={this.t("popRecipe.clmQuantity")} width={200} />
                    </NdPopGrid>
                    {/* Urun Recete Detay PopUp */}
                    <NdPopGrid id={"popRecipeDetail"} parent={this} container={'#' + this.props.data.id + this.tabIndex}
                    visible={false}
                    position={{of:'#' + this.props.data.id + this.tabIndex}} 
                    showTitle={true} 
                    showBorders={true}
                    width={'90%'}
                    height={'90%'}
                    selection={{mode:"multiple"}}
                    title={this.t("popRecipeDetail.title")} //
                    dbApply={false}
                    onRowUpdated={async(e)=>
                    {
                        let tmpIndex = e.component.getRowIndexByKey(e.key)
                        let tmpData = e.component.getDataSource().items()
                        let tmpX =  e.data.INPUT / tmpData[tmpIndex].QUANTITY

                        for (let i = 0; i < tmpData.length; i++) 
                        {
                            if(tmpIndex != i)
                            {
                                tmpData[i].INPUT = Number(tmpX * tmpData[i].QUANTITY).round(3)
                            }
                        }
                        e.component.refresh()
                    }}
                    >
                        <Editing mode="cell" allowUpdating={true}/>
                        <Column dataField="TYPE_NAME" caption={this.t("popRecipeDetail.clmType")} width={80} allowEditing={false}/>
                        <Column dataField="ITEM_CODE" caption={this.t("popRecipeDetail.clmCode")} width={200} allowEditing={false}/>
                        <Column dataField="ITEM_NAME" caption={this.t("popRecipeDetail.clmName")} width={600} allowEditing={false}/>
                        <Column dataField="QUANTITY" caption={this.t("popRecipeDetail.clmQuantity")} width={100} allowEditing={false}/>
                        <Column dataField="INPUT" caption={this.t("popRecipeDetail.clmEntry")} width={100} allowEditing={true}/>
                    </NdPopGrid>
                    <NdToast id={"toast"} parent={this} displayTime={2000} position={{at:"top center",offset:'0px 110px'}}/>
                </ScrollView>                
            </div>
        )
    }
}