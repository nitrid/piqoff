import React from 'react';
import App from '../../../lib/app.js';
import { additionalTax,taxSugarCls } from '../../../../core/cls/additionalTax.js';
import moment from 'moment';


import Toolbar from 'devextreme-react/toolbar';
import Form, { Item } from 'devextreme-react/form';
import ScrollView from 'devextreme-react/scroll-view';
import { Button } from 'devextreme-react/button';

import { Validator,  RequiredRule, RangeRule } from '../../../../core/react/devex/textbox.js'
import NdNumberBox from '../../../../core/react/devex/numberbox.js';
import NdPopUp from '../../../../core/react/devex/popup.js';
import NdGrid,{Column,Editing,Popup,Scrolling,KeyboardNavigation,Export, Form as GrdForm} from '../../../../core/react/devex/grid.js';
import NdButton from '../../../../core/react/devex/button.js';
import NbDateRange from '../../../../core/react/bootstrap/daterange.js';
import { dialog } from '../../../../core/react/devex/dialog.js';
import {NdForm,NdItem,NdLabel} from '../../../../core/react/devex/form.js';
import { NdToast } from '../../../../core/react/devex/toast.js';

export default class taxSugar extends React.PureComponent
{
    constructor(props)
    {
        super(props)

        this.core = App.instance.core;
        this.prmObj = this.param.filter({TYPE:1,USERS:this.user.CODE});
        this.taxSugarObj = new taxSugarCls();
        this.addTaxObj = new additionalTax();
        this.tabIndex = props.data.tabkey;

    }
    componentDidMount()
    {
        setTimeout(async () =>  { this.init() }, 500);
    }
    async init()
    {
        this.taxSugarObj.clearAll()
        this.addTaxObj.clearAll()
        this.getDoc()

        this.taxSugarObj.ds.on('onAddRow',(pTblName,pData) =>
        {
            if(pData.stat == 'new')
            {
                this.btnBack.setState({disabled:false});
                this.btnSave.setState({disabled:false});
            }
        })
        this.taxSugarObj.ds.on('onEdit',(pTblName,pData) =>
        {            
            if(pData.rowData.stat == 'edit')
            {
                this.btnBack.setState({disabled:false});
                this.btnSave.setState({disabled:false});

                pData.rowData.CUSER = this.user.CODE
            }                 
        })
        this.taxSugarObj.ds.on('onRefresh',(pTblName) =>
        {            
            this.btnBack.setState({disabled:false});
            this.btnSave.setState({disabled:false});
        })
        this.taxSugarObj.ds.on('onDelete',(pTblName) =>
        {            
            this.btnBack.setState({disabled:false});
            this.btnSave.setState({disabled:false});
        })

        let tmpAdd = {...this.addTaxObj.empty}

        tmpAdd.TYPE = 0

        this.addTaxObj.addEmpty(tmpAdd);

        await this.grdTaxSugar.dataRefresh({source:this.taxSugarObj.dt('TAX_SUGAR_TABLE')});
    }
    async getDoc()
    {
        this.addTaxObj.clearAll()
        this.taxSugarObj.clearAll()

        await this.addTaxObj.load({TYPE:0});

        if(this.addTaxObj.dt().length == 0)
        {
            let tmpAdd = {...this.addTaxObj.empty}
            tmpAdd.TYPE = 0
            this.addTaxObj.addEmpty(tmpAdd);
        }

        await this.taxSugarObj.load({TYPE:0});
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
                                    onClick={()=>  { this.getDoc() }}/>
                                </Item>
                                <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnSave" parent={this} icon="floppy" type="success" 
                                    onClick={async(e)=>
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
                                            let Data = {data:this.taxSugarObj.dt().toArray()}
                                            console.log(this.addTaxObj.dt()[0].JSON )
                                            this.addTaxObj.dt()[0].JSON = JSON.stringify(Data)

                                            let tmpConfObj1 =
                                            {
                                                id:'msgSaveResult',showTitle:true,title:this.t("msgSave.title"),showCloseButton:true,width:'500px',height:'auto',
                                                button:[{id:"btn01",caption:this.t("msgSave.btn01"),location:'after'}],
                                            }
                                            
                                            if((await this.addTaxObj.save()) == 0)
                                            {                       
                                                this.toast.show({message:this.t("msgSaveResult.msgSuccess"),type:"success"});
                                                this.btnSave.setState({disabled:true});
                                            }
                                            else
                                            {
                                                tmpConfObj1.content = (<div style={{textAlign:"center",fontSize:"20px",color:"red"}}>{this.t("msgSaveResult.msgFailed")}</div>)
                                                await dialog(tmpConfObj1);
                                            }
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
                    {/* Grid */}
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <Form colCount={1} onInitialized={(e)=> { this.frmTrnsfItems = e.component }}>
                                <Item location="after">
                                    <Button icon="add" text={this.t("btnAdd")}
                                    onClick={async (e)=>
                                    {
                                        this.minValue.value = 0
                                        this.maxValue.value = 0
                                        this.price.value = 0
                                        this.dtDate.value =  moment(new Date()).format("YYYY-MM-DD - HH:mm")
                                        this.popTaxSugar.show()
                                    }}/>
                                </Item>
                                <Item>
                                    <NdGrid parent={this} id={"grdTaxSugar"} 
                                    showBorders={true} 
                                    columnsAutoWidth={true} 
                                    allowColumnReordering={true} 
                                    allowColumnResizing={true} 
                                    height={'500'} 
                                    width={'100%'}
                                    dbApply={false}
                                    onRowUpdated={async(e)=>
                                    {
                                        e.key.CDATE_FORMAT =  moment(new Date()).format("YYYY-MM-DD - HH:mm:ss")
                                        if(e.key.DATE)
                                        {
                                            let dates = e.key.DATE.split('/');
                                            if(dates.length === 2) {
                                                e.key.START_DATE = moment(dates[0].trim()).format("YYYY-MM-DD");
                                                e.key.END_DATE = moment(dates[1].trim()).format("YYYY-MM-DD");
                                            }
                                            else
                                            {
                                                let tmpConfObj =
                                                {
                                                    id:'msgError',showTitle:true,title:this.t("msgError.title"),showCloseButton:true,width:'500px',height:'auto',
                                                    button:[{id:"btn01",caption:this.t("msgError.btn01"),location:'before'}],
                                                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgError.msg")}</div>)
                                                }
                                                await dialog(tmpConfObj);
                                            }
                                        }
                                    }}
                                    loadPanel={{enabled:true}}
                                    >
                                        <KeyboardNavigation editOnKeyPress={true} enterKeyAction={'moveFocus'} enterKeyDirection={'column'} />
                                        <Scrolling mode="standard" />
                                        <Editing mode="popup" allowUpdating={true} allowDeleting={true} confirmDelete={false}>
                                            <Popup 
                                                title={this.t("popTaxSugar.title")} 
                                                showTitle={true} 
                                                width={900} 
                                                height={300}
                                                resizeEnabled={true}
                                                dragEnabled={true}
                                                wrapperAttr={{className: "compact-popup"}}
                                            >
                                                <GrdForm>
                                                    <Item itemType="group" colCount={2}>
                                                        <Item dataField="MIN_VALUE" format={"##0.00"}/>
                                                        <Item dataField="MAX_VALUE" format={"##0.00"}/>
                                                        <Item dataField="PRICE" format={"##0.00"}/>
                                                        <Item dataField="DATE" format={"DD/MM/YYYY"}/>
                                                    </Item>
                                                </GrdForm>
                                            </Popup>
                                        </Editing>
                                        <Export fileName={this.lang.t("menuOff.stk_02_002")} enabled={true} allowExportSelectedData={true} />
                                        <Column dataField="CUSER_NAME" caption={this.t("grdTaxSugar.clmCreateDate")} width={200} allowEditing={false}/>
                                        <Column dataField="CDATE_FORMAT" caption={this.t("grdTaxSugar.clmCreateDate")} width={200} allowEditing={false}/>
                                        <Column dataField="MIN_VALUE" caption={this.t("grdTaxSugar.clmMinValue")} width={200} dataType={'number'}  format={"#,##0.00 '(100ML/GR)'"}>
                                            <RangeRule min={0.01} message={this.t("validation.clmMinValue")} /><RequiredRule/>
                                        </Column>
                                        <Column dataField="MAX_VALUE" caption={this.t("grdTaxSugar.clmMaxvalue")} width={200} dataType={'number'} format={"#,##0.00 '(100ML/GR)'"}>
                                            <RangeRule min={0.01} message={this.t("validation.clmMaxvalue")} /><RequiredRule/>
                                        </Column>
                                        <Column dataField="PRICE" caption={this.t("grdTaxSugar.clmPrice")} dataType={'number'} width={200}  format={"#,##0.00 " + Number.money.sign + "'(100ML/GR)'"}>
                                            <RangeRule min={0.01} message={this.t("validation.clmPrice")} /><RequiredRule/>
                                        </Column>
                                        <Column dataField="DATE" caption={this.t("grdTaxSugar.clmDate")} width={200} />
                                    </NdGrid>
                                </Item>
                            </Form>
                            {/* TaxSugar PopUp */}
                            <div>
                                <NdPopUp parent={this} 
                                id={"popTaxSugar"} 
                                visible={false}
                                showCloseButton={true}
                                showTitle={true}
                                title={this.t("popTaxSugar.title")}
                                container={"#" + this.props.data.id + this.tabIndex} 
                                width={'500'}
                                height={'600'}
                                position={{of:'#' + this.props.data.id + this.tabIndex}}
                                >
                                    <NdForm colCount={1} height={'fit-content'}>
                                        <NdItem>
                                            <NdLabel text={this.t("popTaxSugar.minValue")} alignment="right" />
                                            <div className="col-4 pe-0">
                                                <NdNumberBox id="minValue" parent={this} simple={true} maxLength={32} format={"##0.00"} >
                                                    <Validator validationGroup={"frmPopTaxSugar"  + this.tabIndex}>
                                                        <RequiredRule message={this.t("validValue")} />
                                                        <RangeRule min={0.001} message={this.t("zeroValid")} />
                                                    </Validator>  
                                                </NdNumberBox>
                                            </div>
                                        </NdItem>
                                        <NdItem>
                                            <NdLabel text={this.t("popTaxSugar.maxValue")} alignment="right" />
                                            <div className="col-12 pe-0">
                                                <NdNumberBox id="maxValue" parent={this} simple={true} width={500}
                                                maxLength={32} format={"##0.00"}                                       
                                                param={this.param.filter({ELEMENT:'numCash',USERS:this.user.CODE})}
                                                access={this.access.filter({ELEMENT:'numCash',USERS:this.user.CODE})}
                                                >
                                                    <Validator validationGroup={"frmPopTaxSugar"  + this.tabIndex}>
                                                        <RequiredRule message={this.t("validValue")}/>
                                                        <RangeRule min={0.001} message={this.t("zeroValid")} />
                                                    </Validator>  
                                                </NdNumberBox>
                                            </div>
                                        </NdItem>
                                        <NdItem>
                                            <NdLabel text={this.t("popTaxSugar.price")} alignment="right" />
                                            <div className="col-12 pe-0">
                                                <NdNumberBox id="price" parent={this} simple={true} width={500} maxLength={32}  format={"##0.00"} >
                                                    <Validator validationGroup={"frmPopTaxSugar"  + this.tabIndex}>
                                                        <RequiredRule message={this.t("validValue")}/>
                                                        <RangeRule min={0.001} message={this.t("zeroValid")} />
                                                    </Validator>  
                                                </NdNumberBox>
                                            </div>
                                        </NdItem>
                                        <NdItem>
                                            <NdLabel text={this.t("popTaxSugar.date")} alignment="right" />
                                            <NbDateRange id={"dtDate"} parent={this} startDate={moment(new Date())} endDate={moment(new Date())}/>
                                        </NdItem>
                                        <NdItem>
                                            <div className='row'>
                                                <div className='col-6'>
                                                    <NdButton text={this.t("popTaxSugar.btnApprove")} type="normal" stylingMode="contained" width={'100%'} 
                                                    validationGroup={"frmPopTaxSugar"  + this.tabIndex}
                                                    onClick={async (e)=>
                                                    {       
                                                        if(e.validationGroup.validate().status == "valid")
                                                        {
                                                            let tmpDocItems = {...this.taxSugarObj.empty}
                                                            tmpDocItems.MIN_VALUE = this.minValue.value
                                                            tmpDocItems.MAX_VALUE = this.maxValue.value
                                                            tmpDocItems.PRICE =this.price.value
                                                            tmpDocItems.START_DATE = this.dtDate.startDate.format("YYYY-MM-DD")
                                                            tmpDocItems.END_DATE = this.dtDate.endDate.format("YYYY-MM-DD")
                                                            tmpDocItems.DATE = this.dtDate.startDate.format("YYYY-MM-DD") +'/' + this.dtDate.endDate.format("YYYY-MM-DD")

                                                            this.taxSugarObj.addEmpty(tmpDocItems)
                                                            this.popTaxSugar.hide();  
                                                        }
                                                        
                                                    }}/>
                                                </div>
                                                <div className='col-6'>
                                                    <NdButton text={this.lang.t("btnCancel")} type="normal" stylingMode="contained" width={'100%'}
                                                    onClick={()=> { this.popTaxSugar.hide() }}/>
                                                </div>
                                            </div>
                                        </NdItem>
                                    </NdForm>
                                </NdPopUp>
                            </div> 
                        </div>
                    </div>
                    <NdToast id="toast" parent={this} displayTime={2000} position={{at:"top center",offset:'0px 110px'}}/>
                </ScrollView>
            </div>
        )
    }
}