import React from 'react';
import App from '../../../lib/app.js';
import { docCls,docItemsCls, docCustomerCls } from '../../../../core/cls/doc.js';
import moment from 'moment';

import ScrollView from 'devextreme-react/scroll-view';
import Toolbar from 'devextreme-react/toolbar';
import Form, { Label,Item,EmptyItem } from 'devextreme-react/form';
import ContextMenu from 'devextreme-react/context-menu';
import TabPanel from 'devextreme-react/tab-panel';
import { Button } from 'devextreme-react/button';

import NdTextBox, { Validator, NumericRule, RequiredRule, CompareRule, EmailRule, PatternRule, StringLengthRule, RangeRule, AsyncRule } from '../../../../core/react/devex/textbox.js'
import NdNumberBox from '../../../../core/react/devex/numberbox.js';
import NdSelectBox from '../../../../core/react/devex/selectbox.js';
import NdCheckBox from '../../../../core/react/devex/checkbox.js';
import NdPopGrid from '../../../../core/react/devex/popgrid.js';
import NdPopUp from '../../../../core/react/devex/popup.js';
import NdGrid,{Column,Editing,Paging,Scrolling,KeyboardNavigation,Export} from '../../../../core/react/devex/grid.js';
import NdButton from '../../../../core/react/devex/button.js';
import NdDatePicker from '../../../../core/react/devex/datepicker.js';
import NdImageUpload from '../../../../core/react/devex/imageupload.js';
import { dialog } from '../../../../core/react/devex/dialog.js';
import { datatable } from '../../../../core/core.js';
import tr from '../../../meta/lang/devexpress/tr.js';

export default class virement extends React.PureComponent
{
    constructor(props)
    {
        super(props)
        this.core = App.instance.core;
        this.prmObj = this.param.filter({TYPE:1,USERS:this.user.CODE});
        this.acsobj = this.access.filter({TYPE:1,USERS:this.user.CODE});
        this.docObj = new docCls();

        this._calculateTotal = this._calculateTotal.bind(this)
        this._addVirement = this._addVirement.bind(this)
       

        this.docLocked = false;        
        this.tabIndex = props.data.tabkey
    }
    async componentDidMount()
    {
        await this.core.util.waitUntil(0)
        this.init()
    }
    async init()
    {
        this.docObj.clearAll()

        this.docObj.ds.on('onAddRow',(pTblName,pData) =>
        {
            if(pData.stat == 'new')
            {
                this.btnNew.setState({disabled:false});
                this.btnBack.setState({disabled:false});
                this.btnNew.setState({disabled:false});
                this.btnBack.setState({disabled:true});
                this.btnSave.setState({disabled:false});
                this.btnDelete.setState({disabled:false});
                this.btnCopy.setState({disabled:false});
                this.btnPrint.setState({disabled:false});
            }
        })
        this.docObj.ds.on('onEdit',(pTblName,pData) =>
        {            
            if(pData.rowData.stat == 'edit')
            {
                this.btnBack.setState({disabled:false});
                this.btnNew.setState({disabled:true});
                this.btnSave.setState({disabled:false});
                this.btnDelete.setState({disabled:false});
                this.btnCopy.setState({disabled:false});
                this.btnPrint.setState({disabled:false});

                pData.rowData.CUSER = this.user.CODE
            }                 
        })
        this.docObj.ds.on('onRefresh',(pTblName) =>
        {            
            this.btnBack.setState({disabled:true});
            this.btnNew.setState({disabled:false});
            this.btnSave.setState({disabled:false});
            this.btnDelete.setState({disabled:false});
            this.btnCopy.setState({disabled:false});
            this.btnPrint.setState({disabled:false});          
        })
        this.docObj.ds.on('onDelete',(pTblName) =>
        {            
            this.btnBack.setState({disabled:false});
            this.btnNew.setState({disabled:false});
            this.btnSave.setState({disabled:false});
            this.btnDelete.setState({disabled:false});
            this.btnCopy.setState({disabled:false});
            this.btnPrint.setState({disabled:false});
        })

        this.dtDocDate.value = moment(new Date())

        let tmpDoc = {...this.docObj.empty}
        tmpDoc.TYPE = 2
        tmpDoc.DOC_TYPE = 201
        tmpDoc.INPUT = '00000000-0000-0000-0000-000000000000'
        tmpDoc.OUTPUT = '00000000-0000-0000-0000-000000000000'
        this.docObj.addEmpty(tmpDoc);

        

        this.txtRef.readOnly = false
        this.txtRefno.readOnly = false
        this.docLocked = false
        
        this.frmPayment.option('disabled',false)
        await this.grdDocVirement.dataRefresh({source:this.docObj.docCustomer.dt('DOC_CUSTOMER')});
    }
    async getDoc(pGuid,pRef,pRefno)
    {
        this.docObj.clearAll()
        await this.docObj.load({GUID:pGuid,REF:pRef,REF_NO:pRefno,TYPE:2,DOC_TYPE:201});

        this.txtRef.readOnly = true
        this.txtRefno.readOnly = true
        
        if(this.docObj.dt()[0].LOCKED != 0)
        {
            this.docLocked = true
            let tmpConfObj =
            {
                id:'msgGetLocked',showTitle:true,title:this.t("msgGetLocked.title"),showCloseButton:true,width:'500px',height:'200px',
                button:[{id:"btn01",caption:this.t("msgGetLocked.btn01"),location:'after'}],
                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgGetLocked.msg")}</div>)
            }

            await dialog(tmpConfObj);
            this.frmPayment.option('disabled',true)
        }
        else
        {
            this.docLocked = false
            this.frmPayment.option('disabled',false)
        }
    }
    async checkDoc(pGuid,pRef,pRefno)
    {
        return new Promise(async resolve =>
        {
            if(pRef !== '')
            {
                let tmpData = await new docCls().load({GUID:pGuid,REF:pRef,REF_NO:pRefno});

                if(tmpData.length > 0)
                {
                    let tmpConfObj = 
                    {
                        id: 'msgCode',
                        showTitle:true,
                        title:"Dikkat",
                        showCloseButton:true,
                        width:'500px',
                        height:'200px',
                        button:[{id:"btn01",caption:"Evrağa Git",location:'before'}],
                        content:(<div style={{textAlign:"center",fontSize:"20px"}}>{"Evrak Bulundu"}</div>)
                    }
    
                    let pResult = await dialog(tmpConfObj);
                    if(pResult == 'btn01')
                    {
                        this.getDoc(pGuid,pRef,pRefno)
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
    async _calculateTotal()
    {
        this.docObj.dt()[0].AMOUNT = this.docObj.docCustomer.dt().sum("AMOUNT",2)
        this.docObj.dt()[0].TOTAL = this.docObj.docCustomer.dt().sum("AMOUNT",2)
    }
    async _addVirement(pType)
    {
        let tmpDocCustomer = {...this.docObj.docCustomer.empty}
            tmpDocCustomer.DOC_GUID = this.docObj.dt()[0].GUID
            tmpDocCustomer.TYPE = this.docObj.dt()[0].TYPE
            tmpDocCustomer.REF = this.docObj.dt()[0].REF
            tmpDocCustomer.REF_NO = this.docObj.dt()[0].REF_NO
            tmpDocCustomer.DOC_TYPE = this.docObj.dt()[0].DOC_TYPE
            tmpDocCustomer.DOC_DATE = this.docObj.dt()[0].DOC_DATE

            if(pType == 20)
            {
                tmpDocCustomer.OUTPUT = this.cmbSafeToSafe.value
                tmpDocCustomer.OUTPUT_NAME = this.cmbSafeToSafe.displayValue
                tmpDocCustomer.INPUT = this.cmbSafeToSafe2.value
                tmpDocCustomer.INPUT_NAME = this.cmbSafeToSafe2.displayValue
                tmpDocCustomer.PAY_TYPE = pType
                tmpDocCustomer.AMOUNT = this.safeToSafeAmount.value
                tmpDocCustomer.DESCRIPTION = this.safeToSafeDescription.value
            }
            else if(pType == 21)
            {
                tmpDocCustomer.OUTPUT = this.cmbSafeToBank.value
                tmpDocCustomer.OUTPUT_NAME = this.cmbSafeToBank.displayValue
                tmpDocCustomer.INPUT = this.cmbSafeToBank2.value
                tmpDocCustomer.INPUT_NAME = this.cmbSafeToBank2.displayValue
                tmpDocCustomer.PAY_TYPE = pType
                tmpDocCustomer.AMOUNT = this.safeToBankAmount.value
                tmpDocCustomer.DESCRIPTION = this.safeToBankDescription.value
            }
            else if(pType == 22)
            {
                tmpDocCustomer.OUTPUT = this.cmbBankToSafe.value
                tmpDocCustomer.OUTPUT_NAME = this.cmbBankToSafe.displayValue
                tmpDocCustomer.INPUT = this.cmbBankToSafe2.value
                tmpDocCustomer.INPUT_NAME = this.cmbBankToSafe2.displayValue
                tmpDocCustomer.PAY_TYPE = pType
                tmpDocCustomer.AMOUNT = this.bankToSafeAmount.value
                tmpDocCustomer.DESCRIPTION = this.bankToSafeDescription.value
            }
            else if(pType == 23)
            {
                tmpDocCustomer.OUTPUT = this.cmbBankToBank.value
                tmpDocCustomer.OUTPUT_NAME = this.cmbBankToBank.displayValue
                tmpDocCustomer.INPUT = this.cmbBankToBank2.value
                tmpDocCustomer.INPUT_NAME = this.cmbBankToBank2.displayValue
                tmpDocCustomer.PAY_TYPE = pType
                tmpDocCustomer.AMOUNT = this.bankToBankAmount.value
                tmpDocCustomer.DESCRIPTION = this.bankToBankDescription.value
            }

            this.docObj.docCustomer.addEmpty(tmpDocCustomer)

          
            this._calculateTotal()
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
                                    <NdButton id="btnBack" parent={this} icon="revert" type="default"
                                        onClick={()=>
                                        {
                                            this.getDoc(this.docObj.dt()[0].GUID,this.docObj.dt()[0].REF,this.docObj.dt()[0].REF_NO)
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
                                    <NdButton id="btnSave" parent={this} icon="floppy" type="default" validationGroup={"frmVirement"  + this.tabIndex}
                                    onClick={async (e)=>
                                    {
                                        if(this.docLocked == true)
                                        {
                                            let tmpConfObj =
                                            {
                                                id:'msgDocLocked',showTitle:true,title:this.t("msgDocLocked.title"),showCloseButton:true,width:'500px',height:'200px',
                                                button:[{id:"btn01",caption:this.t("msgDocLocked.btn01"),location:'after'}],
                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgDocLocked.msg")}</div>)
                                            }
                                
                                            await dialog(tmpConfObj);
                                            return
                                        }
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
                                                
                                                if((await this.docObj.save()) == 0)
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
                                    <NdButton id="btnDelete" parent={this} icon="trash" type="default"
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
                                            this.docObj.dt('DOC').removeAt(0)
                                            await this.docObj.dt('DOC').delete();
                                            this.init(); 
                                        }
                                        
                                    }}/>
                                </Item>
                                <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnLock" parent={this} icon="key" type="default"
                                    onClick={async ()=>
                                    {
                                        if(this.docObj.dt()[0].LOCKED == 0)
                                        {
                                            this.docObj.dt()[0].LOCKED = 1
                                            if((await this.docObj.save()) == 0)
                                            {                                                    
                                                let tmpConfObj =
                                                {
                                                    id:'msgLocked',showTitle:true,title:this.t("msgLocked.title"),showCloseButton:true,width:'500px',height:'200px',
                                                    button:[{id:"btn01",caption:this.t("msgLocked.btn01"),location:'after'}],
                                                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgLocked.msg")}</div>)
                                                }

                                                await dialog(tmpConfObj);
                                            }
                                            else
                                            {
                                                tmpConfObj1.content = (<div style={{textAlign:"center",fontSize:"20px",color:"red"}}>{this.t("msgSaveResult.msgFailed")}</div>)
                                                await dialog(tmpConfObj1);
                                            }
                                            
                                        }
                                        else
                                        {
                                            this.popPassword.show()
                                        }
                                        
                                    }}/>
                                </Item>
                                <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnCopy" parent={this} icon="copy" type="default"
                                    onClick={()=>
                                    {
                                        
                                    }}/>
                                </Item>
                                <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnPrint" parent={this} icon="print" type="default"
                                    onClick={()=>
                                    {
                                        this.popDesign.show()
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
                    {/* Form */}
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <Form colCount={3} id="frmPayment">
                                {/* txtRef-Refno */}
                                <Item>
                                    <Label text={this.t("txtRefRefno")} alignment="right" />
                                    <div className="row">
                                        <div className="col-4 pe-0">
                                            <NdTextBox id="txtRef" parent={this} simple={true} dt={{data:this.docObj.dt('DOC'),field:"REF"}}
                                            upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                            readOnly={true}
                                            maxLength={32}
                                            onChange={(async(e)=>
                                            {
                                                let tmpQuery = 
                                                {
                                                    query :"SELECT ISNULL(MAX(REF_NO) + 1,1) AS REF_NO FROM DOC WHERE TYPE = 2 AND DOC_TYPE = 201 AND REF = @REF ",
                                                    param : ['REF:string|25'],
                                                    value : [this.txtRef.value]
                                                }
                                                let tmpData = await this.core.sql.execute(tmpQuery) 
                                                if(tmpData.result.recordset.length > 0)
                                                {
                                                    this.txtRefno.value = tmpData.result.recordset[0].REF_NO
                                                }
                                            }).bind(this)}
                                            param={this.param.filter({ELEMENT:'txtRef',USERS:this.user.CODE})}
                                            access={this.access.filter({ELEMENT:'txtRef',USERS:this.user.CODE})}
                                            >
                                            <Validator validationGroup={"frmVirement"  + this.tabIndex}>
                                                    <RequiredRule message={this.t("validRef")} />
                                                </Validator>  
                                            </NdTextBox>
                                        </div>
                                        <div className="col-5 ps-0">
                                            <NdTextBox id="txtRefno" parent={this} simple={true} dt={{data:this.docObj.dt('DOC'),field:"REF_NO"}}
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
                                                                    this.getDoc(data[0].GUID,data[0].REF,data[0].REF_NO)
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
                                            onChange={(async()=>
                                            {
                                                let tmpResult = await this.checkDoc('00000000-0000-0000-0000-000000000000',this.txtRef.value,this.txtRefno.value)
                                                if(tmpResult == 3)
                                                {
                                                    this.txtRefno.value = "";
                                                }
                                            }).bind(this)}
                                            param={this.param.filter({ELEMENT:'txtRefno',USERS:this.user.CODE})}
                                            access={this.access.filter({ELEMENT:'txtRefno',USERS:this.user.CODE})}
                                            >
                                            <Validator validationGroup={"frmVirement"  + this.tabIndex}>
                                                    <RequiredRule message={this.t("validRefNo")} />
                                                </Validator> 
                                            </NdTextBox>
                                        </div>
                                    </div>
                                    {/*EVRAK SEÇİM */}
                                    <NdPopGrid id={"pg_Docs"} parent={this} container={"#root"}
                                    visible={false}
                                    position={{of:'#root'}} 
                                    showTitle={true} 
                                    showBorders={true}
                                    width={'90%'}
                                    height={'90%'}
                                    title={this.t("pg_Docs.title")} 
                                    data={{source:{select:{query : "SELECT GUID,REF,REF_NO,DOC_DATE_CONVERT FROM DOC_VW_01 WHERE TYPE = 2 AND DOC_TYPE = 201"},sql:this.core.sql}}}
                                    button=
                                    {
                                        [
                                            {
                                                id:'01',
                                                icon:'more',
                                                onClick:()=>
                                                {
                                                   
                                                }
                                            }
                                        ]
                                        
                                    }
                                    >
                                        <Column dataField="REF" caption={this.t("pg_Docs.clmRef")} width={150} defaultSortOrder="asc"/>
                                        <Column dataField="REF_NO" caption={this.t("pg_Docs.clmRefNo")} width={300} defaultSortOrder="asc" />
                                        <Column dataField="DOC_DATE_CONVERT" caption={this.t("pg_Docs.clmDate")} width={300} defaultSortOrder="asc" />
                                        
                                    </NdPopGrid>
                                </Item>
                               {/* dtDocDate */}
                               <Item>
                                    <Label text={this.t("dtDocDate")} alignment="right" />
                                    <NdDatePicker simple={true}  parent={this} id={"dtDocDate"}
                                    dt={{data:this.docObj.dt('DOC'),field:"DOC_DATE"}}
                                    onValueChanged={(async()=>
                                        {
                                            
                                    }).bind(this)}
                                    >
                                        <Validator validationGroup={"frmVirement"  + this.tabIndex}>
                                            <RequiredRule message={this.t("validDocDate")} />
                                        </Validator> 
                                    </NdDatePicker>
                                </Item>
                            </Form>
                        </div>
                    </div>
                    {/* Grid */}
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <Form colCount={4} onInitialized={(e)=>
                            {
                                this.frmPayment = e.component
                            }}>
                                <Item location="after">
                                    <Button icon="add" text={this.t("btnSafeToSafe")}
                                    validationGroup={"frmVirement"  + this.tabIndex}
                                    onClick={async (e)=>
                                    {
                                        if(e.validationGroup.validate().status == "valid")
                                        {
                                            this.cmbSafeToSafe.setState({value:''});
                                            this.cmbSafeToSafe2.setState({value:''});
                                            this.safeToSafeAmount.setState({value:0});
                                            this.safeToSafeDescription.setState({value:''});
                                            this.popSafeToSafe.show()
                                        }
                                        else
                                        {
                                            let tmpConfObj =
                                            {
                                                id:'msgDocValid',showTitle:true,title:this.t("msgDocValid.title"),showCloseButton:true,width:'500px',height:'200px',
                                                button:[{id:"btn01",caption:this.t("msgDocValid.btn01"),location:'after'}],
                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgDocValid.msg")}</div>)
                                            }
                                            
                                            await dialog(tmpConfObj);
                                        }
                                    }}/>
                                </Item>
                                <Item location="after">
                                    <Button icon="add" text={this.t("btnSafeToBank")}
                                    validationGroup={"frmVirement"  + this.tabIndex}
                                    onClick={async (e)=>
                                    {
                                        if(e.validationGroup.validate().status == "valid")
                                        {
                                            this.cmbSafeToBank.setState({value:''});
                                            this.cmbSafeToBank2.setState({value:''});
                                            this.safeToBankAmount.setState({value:0});
                                            this.safeToBankDescription.setState({value:''});
                                            this.popSafeToBank.show()
                                        }
                                        else
                                        {
                                            let tmpConfObj =
                                            {
                                                id:'msgDocValid',showTitle:true,title:this.t("msgDocValid.title"),showCloseButton:true,width:'500px',height:'200px',
                                                button:[{id:"btn01",caption:this.t("msgDocValid.btn01"),location:'after'}],
                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgDocValid.msg")}</div>)
                                            }
                                            
                                            await dialog(tmpConfObj);
                                        }
                                    }}/>
                                </Item>
                                <Item location="after">
                                    <Button icon="add" text={this.t("btnBankToSafe")}
                                    validationGroup={"frmVirement"  + this.tabIndex}
                                    onClick={async (e)=>
                                    {
                                        if(e.validationGroup.validate().status == "valid")
                                        {
                                            this.cmbBankToSafe.setState({value:''});
                                            this.cmbBankToSafe2.setState({value:''});
                                            this.bankToSafeAmount.setState({value:0});
                                            this.bankToSafeDescription.setState({value:''});
                                            this.popBankToSafe.show()
                                        }
                                        else
                                        {
                                            let tmpConfObj =
                                            {
                                                id:'msgDocValid',showTitle:true,title:this.t("msgDocValid.title"),showCloseButton:true,width:'500px',height:'200px',
                                                button:[{id:"btn01",caption:this.t("msgDocValid.btn01"),location:'after'}],
                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgDocValid.msg")}</div>)
                                            }
                                            
                                            await dialog(tmpConfObj);
                                        }
                                    }}/>
                                </Item>
                                <Item location="after">
                                    <Button icon="add" text={this.t("btnBankToBank")}
                                    validationGroup={"frmVirement"  + this.tabIndex}
                                    onClick={async (e)=>
                                    {
                                        if(e.validationGroup.validate().status == "valid")
                                        {
                                            this.cmbBankToBank.setState({value:''});
                                            this.cmbBankToBank2.setState({value:''});
                                            this.bankToBankAmount.setState({value:0});
                                            this.bankToBankDescription.setState({value:''});
                                            this.popBankToBank.show()
                                        }
                                        else
                                        {
                                            let tmpConfObj =
                                            {
                                                id:'msgDocValid',showTitle:true,title:this.t("msgDocValid.title"),showCloseButton:true,width:'500px',height:'200px',
                                                button:[{id:"btn01",caption:this.t("msgDocValid.btn01"),location:'after'}],
                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgDocValid.msg")}</div>)
                                            }
                                            
                                            await dialog(tmpConfObj);
                                        }
                                    }}/>
                                </Item>
                                 <Item colSpan={4}>
                                 <React.Fragment>
                                    <NdGrid parent={this} id={"grdDocVirement"} 
                                    showBorders={true} 
                                    columnsAutoWidth={true} 
                                    allowColumnReordering={true} 
                                    allowColumnResizing={true} 
                                    height={'500'} 
                                    width={'100%'}
                                    dbApply={false}
                                    onRowUpdated={async(e)=>{
                                        let rowIndex = e.component.getRowIndexByKey(e.key)

                                        this._calculateTotal()
                                    }}
                                    onRowRemoved={async (e)=>{
                                        this._calculateTotal()
                                        await this.docObj.save()
                                    }}
                                    >
                                        <KeyboardNavigation editOnKeyPress={true} enterKeyAction={'moveFocus'} enterKeyDirection={'column'} />
                                        <Scrolling mode="standart" />
                                        <Editing mode="cell" allowUpdating={true} allowDeleting={true} />
                                        <Export fileName={this.lang.t("menu.fns_03_003")} enabled={true} allowExportSelectedData={true} />
                                        <Column dataField="CDATE_FORMAT" caption={this.t("grdDocVirement.clmCreateDate")} width={200} allowEditing={false}/>
                                        <Column dataField="OUTPUT_NAME" caption={this.t("grdDocVirement.clmOutputName")} allowEditing={false}/>
                                        <Column dataField="INPUT_NAME" caption={this.t("grdDocVirement.clmInputName")} allowEditing={false}/>
                                        <Column dataField="AMOUNT" caption={this.t("grdDocVirement.clmAmount")} format={{ style: "currency", currency: "EUR",precision: 2}} />
                                        <Column dataField="DESCRIPTION" caption={this.t("grdDocVirement.clmDescription")} />
                                    </NdGrid>
                                    <ContextMenu
                                    dataSource={this.rightItems}
                                    width={200}
                                    target="#grdDocVirement"
                                    onItemClick={(async(e)=>
                                    {
                                    }).bind(this)} />
                                </React.Fragment>     
                                </Item>
                            </Form>
                        </div>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <Form colCount={4} parent={this} id="frmPayment">                            
                                {/* TOPLAM */}
                                <EmptyItem />
                                <Item>
                                <Label text={this.t("txtTotal")} alignment="right" />
                                    <NdTextBox id="txtTotal" parent={this} simple={true} readOnly={true} dt={{data:this.docObj.dt('DOC'),field:"TOTAL"}}
                                    maxLength={32}
                                    param={this.param.filter({ELEMENT:'txtTotal',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'txtTotal',USERS:this.user.CODE})}
                                    ></NdTextBox>
                                </Item>
                            </Form>
                        </div>
                    </div>
                      {/* Kasadan Kasaya */}
                      <div>
                        <NdPopUp parent={this} id={"popSafeToSafe"} 
                        visible={false}
                        showCloseButton={true}
                        showTitle={true}
                        title={this.t("popSafeToSafe.title")}
                        container={"#root"} 
                        width={'500'}
                        height={'300'}
                        position={{of:'#root'}}
                        >
                            <Form colCount={1} height={'fit-content'}>
                                {/* cmbSafe */}
                                <Item>
                                    <Label text={this.t("cmbSafe")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbSafeToSafe"
                                    displayExpr="NAME"                       
                                    valueExpr="GUID"
                                    value=""
                                    searchEnabled={true}
                                    notRefresh={true}
                                    onValueChanged={(async()=>
                                        {
                                            if(this.cmbSafeToSafe.value == this.cmbSafeToSafe2.value)
                                            {
                                                let tmpConfObj =
                                                {
                                                    id:'msgDblAccount',showTitle:true,title:this.t("msgDblAccount.title"),showCloseButton:true,width:'500px',height:'200px',
                                                    button:[{id:"btn01",caption:this.t("msgDblAccount.btn01"),location:'after'}],
                                                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgDblAccount.msg")}</div>)
                                                }
                                            
                                                await dialog(tmpConfObj);
                                                this.cmbSafeToSafe.setState({value:''});
                                            }
                                        }).bind(this)}
                                    data={{source:{select:{query : "SELECT * FROM SAFE_VW_01"},sql:this.core.sql}}}
                                    param={this.param.filter({ELEMENT:'cmbSafeToSafe',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'cmbSafeToSafe',USERS:this.user.CODE})}
                                    >
                                        <Validator validationGroup={"frmCaseToCase"  + this.tabIndex}>
                                            <RequiredRule message={this.t("validSafe")} />
                                        </Validator> 
                                    </NdSelectBox>
                                </Item>
                                   {/* cmbSafe2 */}
                                   <Item>
                                    <Label text={this.t("cmbSafe2")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbSafeToSafe2"
                                    displayExpr="NAME"                       
                                    valueExpr="GUID"
                                    value=""
                                    searchEnabled={true}
                                    notRefresh={true}
                                    onValueChanged={(async()=>
                                        {
                                            if(this.cmbSafeToSafe.value == this.cmbSafeToSafe2.value)
                                            {
                                                let tmpConfObj =
                                                {
                                                    id:'msgDblAccount',showTitle:true,title:this.t("msgDblAccount.title"),showCloseButton:true,width:'500px',height:'200px',
                                                    button:[{id:"btn01",caption:this.t("msgDblAccount.btn01"),location:'after'}],
                                                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgDblAccount.msg")}</div>)
                                                }
                                            
                                                await dialog(tmpConfObj);
                                                this.cmbSafeToSafe2.setState({value:''});
                                            }
                                        }).bind(this)}
                                    data={{source:{select:{query : "SELECT * FROM SAFE_VW_01"},sql:this.core.sql}}}
                                    param={this.param.filter({ELEMENT:'cmbSafeToSafe2',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'cmbSafeToSafe2',USERS:this.user.CODE})}
                                    >
                                        <Validator validationGroup={"frmCaseToCase"  + this.tabIndex}>
                                            <RequiredRule message={this.t("validSafe")} />
                                        </Validator> 
                                    </NdSelectBox>
                                </Item>
                                <Item>
                                    <Label text={this.t("amount")} alignment="right" />
                                    <div className="col-4 pe-0">
                                        <NdNumberBox id="safeToSafeAmount" parent={this} simple={true}
                                        maxLength={32}                                        
                                        param={this.param.filter({ELEMENT:'safeToSafeAmount',USERS:this.user.CODE})}
                                        access={this.access.filter({ELEMENT:'safeToSafeAmount',USERS:this.user.CODE})}
                                        >
                                        <Validator validationGroup={"frmCaseToCase"  + this.tabIndex}>
                                            <RequiredRule message={this.t("ValidAmount")} />
                                        </Validator>  
                                        </NdNumberBox>
                                    </div>
                                </Item>
                                <Item>
                                    <Label text={this.t("description")} alignment="right" />
                                    <div className="col-12 pe-0">
                                        <NdTextBox id="safeToSafeDescription" parent={this} simple={true} width={500}
                                        upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                        maxLength={32}                                        
                                        param={this.param.filter({ELEMENT:'safeToSafeDescription',USERS:this.user.CODE})}
                                        access={this.access.filter({ELEMENT:'safeToSafeDescription',USERS:this.user.CODE})}
                                        >
                                        </NdTextBox>
                                    </div>
                                </Item>
                                <Item>
                                    <div className='row'>
                                        <div className='col-6'>
                                            <NdButton text={this.t("popSafeToSafe.btnApprove")} type="normal" stylingMode="contained" width={'100%'} 
                                            validationGroup={"frmCaseToCase"  + this.tabIndex}
                                            onClick={async (e)=>
                                            {       
                                               
                                                    this._addVirement(20)
                                                    this.popSafeToSafe.hide(); 
                                                
                                            }}/>
                                        </div>
                                        <div className='col-6'>
                                            <NdButton text={this.lang.t("btnCancel")} type="normal" stylingMode="contained" width={'100%'}
                                            onClick={()=>
                                            {
                                                this.popSafeToSafe.hide();  
                                            }}/>
                                        </div>
                                    </div>
                                </Item>
                            </Form>
                        </NdPopUp>
                    </div> 
                    {/* Kasadan Bankaya */}
                    <div>
                        <NdPopUp parent={this} id={"popSafeToBank"} 
                        visible={false}
                        showCloseButton={true}
                        showTitle={true}
                        title={this.t("popSafeToBank.title")}
                        container={"#root"} 
                        width={'500'}
                        height={'300'}
                        position={{of:'#root'}}
                        >
                            <Form colCount={1} height={'fit-content'}>
                                {/* cmbSafe */}
                                <Item>
                                    <Label text={this.t("cmbSafe")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbSafeToBank"
                                    displayExpr="NAME"                       
                                    valueExpr="GUID"
                                    value=""
                                    searchEnabled={true}
                                    notRefresh={true}
                                    onValueChanged={(async()=>
                                        {
                                            if(this.cmbSafeToBank.value == this.cmbSafeToBank2.value)
                                            {
                                                let tmpConfObj =
                                                {
                                                    id:'msgDblAccount',showTitle:true,title:this.t("msgDblAccount.title"),showCloseButton:true,width:'500px',height:'200px',
                                                    button:[{id:"btn01",caption:this.t("msgDblAccount.btn01"),location:'after'}],
                                                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgDblAccount.msg")}</div>)
                                                }
                                            
                                                await dialog(tmpConfObj);
                                                this.cmbSafeToBank.setState({value:''});
                                            }
                                        }).bind(this)}
                                    data={{source:{select:{query : "SELECT * FROM SAFE_VW_01"},sql:this.core.sql}}}
                                    param={this.param.filter({ELEMENT:'cmbSafeToBank',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'cmbSafeToBank',USERS:this.user.CODE})}
                                    >
                                        <Validator validationGroup={"frmSafeToBank" + this.tabIndex}>
                                            <RequiredRule message={this.t("validSafe")} />
                                        </Validator> 
                                    </NdSelectBox>
                                </Item>
                                   {/* cmbSafe2 */}
                                   <Item>
                                    <Label text={this.t("cmbSafe2")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbSafeToBank2"
                                    displayExpr="NAME"                       
                                    valueExpr="GUID"
                                    value=""
                                    searchEnabled={true}
                                    notRefresh={true}
                                    onValueChanged={(async()=>
                                        {
                                            if(this.cmbSafeToBank.value == this.cmbSafeToBank2.value)
                                            {
                                                let tmpConfObj =
                                                {
                                                    id:'msgDblAccount',showTitle:true,title:this.t("msgDblAccount.title"),showCloseButton:true,width:'500px',height:'200px',
                                                    button:[{id:"btn01",caption:this.t("msgDblAccount.btn01"),location:'after'}],
                                                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgDblAccount.msg")}</div>)
                                                }
                                            
                                                await dialog(tmpConfObj);
                                                this.cmbSafeToBank2.setState({value:''});
                                            }
                                        }).bind(this)}
                                    data={{source:{select:{query : "SELECT * FROM BANK_VW_01"},sql:this.core.sql}}}
                                    param={this.param.filter({ELEMENT:'cmbSafeToBank2',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'cmbSafeToBank2',USERS:this.user.CODE})}
                                    >
                                        <Validator validationGroup={"frmSafeToBank" + this.tabIndex}>
                                            <RequiredRule message={this.t("validSafe")} />
                                        </Validator> 
                                    </NdSelectBox>
                                </Item>
                                <Item>
                                    <Label text={this.t("amount")} alignment="right" />
                                    <div className="col-4 pe-0">
                                        <NdNumberBox id="safeToBankAmount" parent={this} simple={true}
                                        maxLength={32}                                        
                                        param={this.param.filter({ELEMENT:'safeToBankAmount',USERS:this.user.CODE})}
                                        access={this.access.filter({ELEMENT:'safeToBankAmount  ',USERS:this.user.CODE})}
                                        >
                                        <Validator validationGroup={"frmSafeToBank" + this.tabIndex}>
                                            <RequiredRule message={this.t("ValidAmount")} />
                                        </Validator>  
                                        </NdNumberBox>
                                    </div>
                                </Item>
                                <Item>
                                    <Label text={this.t("description")} alignment="right" />
                                    <div className="col-12 pe-0">
                                        <NdTextBox id="safeToBankDescription" parent={this} simple={true} width={500}
                                        upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                        maxLength={32}                                        
                                        param={this.param.filter({ELEMENT:'safeToBankDescription',USERS:this.user.CODE})}
                                        access={this.access.filter({ELEMENT:'safeToBankDescription',USERS:this.user.CODE})}
                                        >
                                        </NdTextBox>
                                    </div>
                                </Item>
                                <Item>
                                    <div className='row'>
                                        <div className='col-6'>
                                            <NdButton text={this.t("popSafeToBank.btnApprove")} type="normal" stylingMode="contained" width={'100%'} 
                                            validationGroup={"frmCollCheck" + this.tabIndex}
                                            onClick={async (e)=>
                                            {       
                                                    this._addVirement(21)
                                                    this.popSafeToBank.hide(); 
                                            }}/>
                                        </div>
                                        <div className='col-6'>
                                            <NdButton text={this.lang.t("btnCancel")} type="normal" stylingMode="contained" width={'100%'}
                                            onClick={()=>
                                            {
                                                this.popSafeToBank.hide();  
                                            }}/>
                                        </div>
                                    </div>
                                </Item>
                            </Form>
                        </NdPopUp>
                    </div> 
                    {/* Bankadan Kasaya */}
                    <div>
                        <NdPopUp parent={this} id={"popBankToSafe"} 
                        visible={false}
                        showCloseButton={true}
                        showTitle={true}
                        title={this.t("popBankToSafe.title")}
                        container={"#root"} 
                        width={'500'}
                        height={'300'}
                        position={{of:'#root'}}
                        >
                            <Form colCount={1} height={'fit-content'}>
                                {/* cmbSafe */}
                                <Item>
                                    <Label text={this.t("cmbSafe")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbBankToSafe"
                                    displayExpr="NAME"                       
                                    valueExpr="GUID"
                                    value=""
                                    searchEnabled={true}
                                    notRefresh={true}
                                    onValueChanged={(async()=>
                                        {
                                            if(this.cmbBankToSafe.value == this.cmbBankToSafe2.value)
                                            {
                                                let tmpConfObj =
                                                {
                                                    id:'msgDblAccount',showTitle:true,title:this.t("msgDblAccount.title"),showCloseButton:true,width:'500px',height:'200px',
                                                    button:[{id:"btn01",caption:this.t("msgDblAccount.btn01"),location:'after'}],
                                                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgDblAccount.msg")}</div>)
                                                }
                                            
                                                await dialog(tmpConfObj);
                                                this.cmbBankToSafe.setState({value:''});
                                            }
                                        }).bind(this)}
                                    data={{source:{select:{query : "SELECT * FROM BANK_VW_01"},sql:this.core.sql}}}
                                    param={this.param.filter({ELEMENT:'cmbBankToSafe',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'cmbBankToSafe',USERS:this.user.CODE})}
                                    >
                                        <Validator validationGroup={"frmBankToSafe" + this.tabIndex}>
                                            <RequiredRule message={this.t("validSafe")} />
                                        </Validator> 
                                    </NdSelectBox>
                                </Item>
                                {/* cmbSafe2 */}
                                <Item>
                                    <Label text={this.t("cmbSafe2")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbBankToSafe2"
                                    displayExpr="NAME"                       
                                    valueExpr="GUID"
                                    value=""
                                    searchEnabled={true}
                                    notRefresh={true}
                                    onValueChanged={(async()=>
                                        {
                                            if(this.cmbBankToSafe.value == this.cmbBankToSafe2.value)
                                            {
                                                let tmpConfObj =
                                                {
                                                    id:'msgDblAccount',showTitle:true,title:this.t("msgDblAccount.title"),showCloseButton:true,width:'500px',height:'200px',
                                                    button:[{id:"btn01",caption:this.t("msgDblAccount.btn01"),location:'after'}],
                                                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgDblAccount.msg")}</div>)
                                                }
                                            
                                                await dialog(tmpConfObj);
                                                this.cmbBankToSafe2.setState({value:''});
                                            }
                                        }).bind(this)}
                                    data={{source:{select:{query : "SELECT * FROM SAFE_VW_01"},sql:this.core.sql}}}
                                    param={this.param.filter({ELEMENT:'cmbBankToSafe2',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'cmbBankToSafe2',USERS:this.user.CODE})}
                                    >
                                        <Validator validationGroup={"frmBankToSafe" + this.tabIndex}>
                                            <RequiredRule message={this.t("validSafe")} />
                                        </Validator> 
                                    </NdSelectBox>
                                </Item>
                                <Item>
                                    <Label text={this.t("amount")} alignment="right" />
                                    <div className="col-4 pe-0">
                                        <NdNumberBox id="bankToSafeAmount" parent={this} simple={true}
                                        maxLength={32}                                        
                                        param={this.param.filter({ELEMENT:'bankToSafeAmount',USERS:this.user.CODE})}
                                        access={this.access.filter({ELEMENT:'bankToSafeAmount  ',USERS:this.user.CODE})}
                                        >
                                        <Validator validationGroup={"frmBankToSafe" + this.tabIndex}>
                                            <RequiredRule message={this.t("ValidAmount")} />
                                        </Validator>  
                                        </NdNumberBox>
                                    </div>
                                </Item>
                                <Item>
                                    <Label text={this.t("description")} alignment="right" />
                                    <div className="col-12 pe-0">
                                        <NdTextBox id="bankToSafeDescription" parent={this} simple={true} width={500}
                                        upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                        maxLength={32}                                        
                                        param={this.param.filter({ELEMENT:'bankToSafeDescription',USERS:this.user.CODE})}
                                        access={this.access.filter({ELEMENT:'bankToSafeDescription',USERS:this.user.CODE})}
                                        >
                                        </NdTextBox>
                                    </div>
                                </Item>
                                <Item>
                                    <div className='row'>
                                        <div className='col-6'>
                                            <NdButton text={this.t("popBankToSafe.btnApprove")} type="normal" stylingMode="contained" width={'100%'} 
                                            validationGroup={"frmCollCheck" + this.tabIndex}
                                            onClick={async (e)=>
                                            {       
                                                this._addVirement(22)
                                                this.popBankToSafe.hide(); 
                                            }}/>
                                        </div>
                                        <div className='col-6'>
                                            <NdButton text={this.lang.t("btnCancel")} type="normal" stylingMode="contained" width={'100%'}
                                            onClick={()=>
                                            {
                                                this.popBankToSafe.hide();  
                                            }}/>
                                        </div>
                                    </div>
                                </Item>
                            </Form>
                        </NdPopUp>
                    </div> 
                      {/* Bankadan Bankaya */}
                      <div>
                        <NdPopUp parent={this} id={"popBankToBank"} 
                        visible={false}
                        showCloseButton={true}
                        showTitle={true}
                        title={this.t("popBankToBank.title")}
                        container={"#root"} 
                        width={'500'}
                        height={'300'}
                        position={{of:'#root'}}
                        >
                            <Form colCount={1} height={'fit-content'}>
                                {/* cmbSafe */}
                                <Item>
                                    <Label text={this.t("cmbSafe")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbBankToBank"
                                    displayExpr="NAME"                       
                                    valueExpr="GUID"
                                    value=""
                                    searchEnabled={true}
                                    notRefresh={true}
                                    onValueChanged={(async()=>
                                        {
                                            if(this.cmbBankToBank.value == this.cmbBankToBank2.value)
                                            {
                                                let tmpConfObj =
                                                {
                                                    id:'msgDblAccount',showTitle:true,title:this.t("msgDblAccount.title"),showCloseButton:true,width:'500px',height:'200px',
                                                    button:[{id:"btn01",caption:this.t("msgDblAccount.btn01"),location:'after'}],
                                                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgDblAccount.msg")}</div>)
                                                }
                                            
                                                await dialog(tmpConfObj);
                                                this.cmbBankToBank.setState({value:''});
                                            }
                                        }).bind(this)}
                                    data={{source:{select:{query : "SELECT * FROM BANK_VW_01"},sql:this.core.sql}}}
                                    param={this.param.filter({ELEMENT:'cmbBankToBank',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'cmbBankToBank',USERS:this.user.CODE})}
                                    >
                                        <Validator validationGroup={"frmBankToBank" + this.tabIndex}>
                                            <RequiredRule message={this.t("validSafe")} />
                                        </Validator> 
                                    </NdSelectBox>
                                </Item>
                                {/* cmbSafe2 */}
                                <Item>
                                    <Label text={this.t("cmbSafe2")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbBankToBank2"
                                    displayExpr="NAME"                       
                                    valueExpr="GUID"
                                    value=""
                                    searchEnabled={true}
                                    notRefresh={true}
                                    onValueChanged={(async()=>
                                        {
                                            if(this.cmbBankToBank.value == this.cmbBankToBank2.value)
                                            {
                                                let tmpConfObj =
                                                {
                                                    id:'msgDblAccount',showTitle:true,title:this.t("msgDblAccount.title"),showCloseButton:true,width:'500px',height:'200px',
                                                    button:[{id:"btn01",caption:this.t("msgDblAccount.btn01"),location:'after'}],
                                                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgDblAccount.msg")}</div>)
                                                }
                                            
                                                await dialog(tmpConfObj);
                                                this.cmbBankToBank2.setState({value:''});
                                            }
                                        }).bind(this)}
                                    data={{source:{select:{query : "SELECT * FROM BANK_VW_01"},sql:this.core.sql}}}
                                    param={this.param.filter({ELEMENT:'cmbBankToBank2',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'cmbBankToBank2',USERS:this.user.CODE})}
                                    >
                                        <Validator validationGroup={"frmBankToBank" + this.tabIndex}>
                                            <RequiredRule message={this.t("validSafe")} />
                                        </Validator> 
                                    </NdSelectBox>
                                </Item>
                                <Item>
                                    <Label text={this.t("amount")} alignment="right" />
                                    <div className="col-4 pe-0">
                                        <NdNumberBox id="bankToBankAmount" parent={this} simple={true}
                                        maxLength={32}                                        
                                        param={this.param.filter({ELEMENT:'bankToBankAmount',USERS:this.user.CODE})}
                                        access={this.access.filter({ELEMENT:'bankToBankAmount  ',USERS:this.user.CODE})}
                                        >
                                        <Validator validationGroup={"frmBankToBank" + this.tabIndex}>
                                            <RequiredRule message={this.t("ValidAmount")} />
                                        </Validator>  
                                        </NdNumberBox>
                                    </div>
                                </Item>
                                <Item>
                                    <Label text={this.t("description")} alignment="right" />
                                    <div className="col-12 pe-0">
                                        <NdTextBox id="bankToBankDescription" parent={this} simple={true} width={500}
                                        upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                        maxLength={32}                                        
                                        param={this.param.filter({ELEMENT:'bankToBankDescription',USERS:this.user.CODE})}
                                        access={this.access.filter({ELEMENT:'bankToBankDescription',USERS:this.user.CODE})}
                                        >
                                        </NdTextBox>
                                    </div>
                                </Item>
                                <Item>
                                    <div className='row'>
                                        <div className='col-6'>
                                            <NdButton text={this.t("popBankToBank.btnApprove")} type="normal" stylingMode="contained" width={'100%'} 
                                            validationGroup={"frmCollCheck" + this.tabIndex}
                                            onClick={async (e)=>
                                            {       
                                              
                                                this._addVirement(23)
                                                this.popBankToBank.hide(); 
                                                
                                            }}/>
                                        </div>
                                        <div className='col-6'>
                                            <NdButton text={this.lang.t("btnCancel")} type="normal" stylingMode="contained" width={'100%'}
                                            onClick={()=>
                                            {
                                                this.popBankToBank.hide();  
                                            }}/>
                                        </div>
                                    </div>
                                </Item>
                            </Form>
                        </NdPopUp>
                    </div> 
                </ScrollView>     
            </div>
        )
    }
}