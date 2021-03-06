import React from 'react';
import App from '../../../lib/app.js';
import {itemPriceCls} from '../../../../core/cls/items.js'

import ScrollView from 'devextreme-react/scroll-view';
import Toolbar from 'devextreme-react/toolbar';
import Form, { Label,Item,EmptyItem,GroupItem } from 'devextreme-react/form';
import { Button } from 'devextreme-react/button';

import NdTextBox, { Validator, NumericRule, RequiredRule, CompareRule, EmailRule, PatternRule, StringLengthRule, RangeRule, AsyncRule } from '../../../../core/react/devex/textbox.js'
import NdNumberBox from '../../../../core/react/devex/numberbox.js';
import NdSelectBox from '../../../../core/react/devex/selectbox.js';
import NdCheckBox from '../../../../core/react/devex/checkbox.js';
import NdPopGrid from '../../../../core/react/devex/popgrid.js';
import NdPopUp from '../../../../core/react/devex/popup.js';
import NdGrid,{Column,Editing,Paging,Scrolling,KeyboardNavigation,Pager} from '../../../../core/react/devex/grid.js';
import NdButton from '../../../../core/react/devex/button.js';
import NdDatePicker from '../../../../core/react/devex/datepicker.js';
import { dialog } from '../../../../core/react/devex/dialog.js';

export default class salesContract extends React.PureComponent
{
    constructor()
    {
        super() 
               
        this.core = App.instance.core;
        this.prmObj = this.param.filter({TYPE:1,USERS:this.user.CODE});
        this.itemPriceObj = new itemPriceCls();

        this._getContracts = this._getContracts.bind(this)

        
    } 
    async componentDidMount()
    {
        await this.core.util.waitUntil(0)
        this.init();
    }
    async init()
    {
        this.itemPriceObj.clearAll();
             
        await this.grdContracts.dataRefresh({source:this.itemPriceObj.dt('ITEM_PRICE')});
    }
    async _getContracts()
    {
        await this.itemPriceObj.load({ITEM_GUID:'00000000-0000-0000-0000-000000000000',CUSTOMER_GUID:this.txtCustomerCode.GUID,TYPE:2});
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
                                    <NdButton id="btnSave" parent={this} icon="floppy" type="default" validationGroup="frmSlsContract"
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
                                                
                                                if((await this.itemPriceObj.save()) == 0)
                                                {                                                    
                                                    tmpConfObj1.content = (<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgSaveResult.msgSuccess")}</div>)
                                                    await dialog(tmpConfObj1);
                                                }
                                                else
                                                {
                                                    tmpConfObj1.content = (<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgSaveResult.msgFailed")}</div>)
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
                            <Form colCount={3} id="frmHeader">
                                 {/* txtCustomerCode */}
                                 <Item>
                                    <Label text={this.t("txtCustomerCode")} alignment="right" />
                                    <NdTextBox id="txtCustomerCode" parent={this} simple={true}  
                                    onChange={(async(r)=>
                                    {
                                        if(r.event.isTrusted == true)
                                        {
                                            let tmpQuery = 
                                            {
                                                query :"SELECT GUID,CODE,TITLE,NAME,LAST_NAME,[TYPE_NAME],[GENUS_NAME] FROM CUSTOMER_VW_01 WHERE CODE = @CODE",
                                                param : ['CODE:string|50'],
                                                value : [r.component._changedValue]
                                            }
                                            let tmpData = await this.core.sql.execute(tmpQuery) 
                                            if(tmpData.result.recordset.length > 0)
                                            {
                                                this.txtCustomerCode.GUID = tmpData.result.recordset[0].GUID
                                                this.txtCustomerCode.value = tmpData.result.recordset[0].CODE;
                                                this.txtCustomerName.value = tmpData.result.recordset[0].TITLE;
                                                
                                                this._getContracts()
                                            }
                                            else
                                            {
                                                let tmpConfObj =
                                                {
                                                    id:'msgNotCustomer',showTitle:true,title:this.t("msgNotCustomer.title"),showCloseButton:true,width:'500px',height:'200px',
                                                    button:[{id:"btn01",caption:this.t("msgNotCustomer.btn01"),location:'after'}],
                                                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgNotCustomer.msg")}</div>)
                                                }
                                    
                                                await dialog(tmpConfObj);
                                                this.txtCustomerCode.GUID = ''
                                                this.txtCustomerCode.value = '';
                                                this.txtCustomerName.value = '';
                                            }
                                        }
                                    }).bind(this)}
                                    button=
                                    {
                                        [
                                            {
                                                id:'01',
                                                icon:'more',
                                                onClick:()=>
                                                {
                                                    this.pg_txtCustomerCode.show()
                                                    this.pg_txtCustomerCode.onClick = (data) =>
                                                    {
                                                        if(data.length > 0)
                                                        {
                                                            this.txtCustomerCode.GUID = data[0].GUID
                                                            this.txtCustomerCode.value = data[0].CODE;
                                                            this.txtCustomerName.value = data[0].TITLE;
                                                            
                                                            this._getContracts()
                                                        }
                                                    }
                                                }
                                            },
                                        ]
                                    }
                                    param={this.param.filter({ELEMENT:'txtCustomerCode',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'txtCustomerCode',USERS:this.user.CODE})}
                                    >
                                        <Validator validationGroup={"frmSlsContract"}>
                                            <RequiredRule message={this.t("validCustomerCode")} />
                                        </Validator>  
                                    </NdTextBox>
                                    {/*CARI SECIMI POPUP */}
                                    <NdPopGrid id={"pg_txtCustomerCode"} parent={this} container={"#root"}
                                    visible={false}
                                    position={{of:'#root'}} 
                                    showTitle={true} 
                                    showBorders={true}
                                    width={'90%'}
                                    height={'90%'}
                                    title={this.t("pg_txtCustomerCode.title")} //
                                    search={true}
                                    data = 
                                    {{
                                        source:
                                        {
                                            select:
                                            {
                                                query : "SELECT GUID,CODE,TITLE,NAME,LAST_NAME,[TYPE_NAME],[GENUS_NAME] FROM CUSTOMER_VW_01 WHERE UPPER(CODE) LIKE UPPER(@VAL) OR UPPER(TITLE) LIKE UPPER(@VAL)",
                                                param : ['VAL:string|50']
                                            },
                                            sql:this.core.sql
                                        }
                                    }}
                                    >
                                        <Column dataField="CODE" caption={this.t("pg_txtCustomerCode.clmCode")} width={150} />
                                        <Column dataField="TITLE" caption={this.t("pg_txtCustomerCode.clmTitle")} width={500} defaultSortOrder="asc" />
                                        <Column dataField="TYPE_NAME" caption={this.t("pg_txtCustomerCode.clmTypeName")} width={150} />
                                        <Column dataField="GENUS_NAME" caption={this.t("pg_txtCustomerCode.clmGenusName")} width={150}/>
                                        
                                    </NdPopGrid>
                                </Item> 
                                {/* txtCustomerName */}
                                <Item>
                                    <Label text={this.t("txtCustomerName")} alignment="right" />
                                    <NdTextBox id="txtCustomerName" parent={this} simple={true}  
                                    readOnly={true}
                                    param={this.param.filter({ELEMENT:'txtCustomerName',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'txtCustomerName',USERS:this.user.CODE})}
                                    >
                                    </NdTextBox>
                                </Item> 
                                 {/* Bo?? */}
                                 <EmptyItem />
                                
                                {/* Bo?? */}
                                <EmptyItem />
                                 {/* cmbDepot */}
                                 <Item>
                                    <Label text={this.t("cmbDepot")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbDepot"
                                    dt={{data:this.itemPriceObj.dt('ITEM_PRICE'),field:"DEPOT"}}  
                                    displayExpr="NAME"                       
                                    valueExpr="GUID"
                                    value=""
                                    searchEnabled={true}
                                    onValueChanged={(async()=>
                                        {
                                        }).bind(this)}
                                    data={{source:{select:{query : "SELECT * FROM DEPOT_VW_01 WHERE TYPE = 0"},sql:this.core.sql}}}
                                    param={this.param.filter({ELEMENT:'cmbDepot',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'cmbDepot',USERS:this.user.CODE})}
                                    >
                                    </NdSelectBox>
                                </Item>
                            </Form>
                        </div>
                    </div>
                     {/* Grid */}
                     <div className="row px-2 pt-2">
                        <div className="col-12">
                            <Form colCount={1} onInitialized={(e)=>
                            {
                                this.frmSlsContract = e.component
                            }}>
                                <Item location="after">
                                    <Button icon="add"
                                    validationGroup="frmSlsContract"
                                    onClick={async (e)=>
                                    {
                                        if(e.validationGroup.validate().status == "valid")
                                        {
                                            this.txtPopItemsQuantity.setState({value:1})
                                            this.txtPopItemsCode.setState({value:''})
                                            this.txtPopItemsName.setState({value:''})
                                            this.txtPopItemsPrice.setState({value:0})
                                            this.popItems.show()
                                        }
                                        else
                                        {
                                            let tmpConfObj =
                                            {
                                                id:'msgContractValid',showTitle:true,title:this.t("msgContractValid.title"),showCloseButton:true,width:'500px',height:'200px',
                                                button:[{id:"btn01",caption:this.t("msgContractValid.btn01"),location:'after'}],
                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgContractValid.msg")}</div>)
                                            }
                                            
                                            await dialog(tmpConfObj);
                                        }
                                    }}/>
                                </Item>
                                 <Item>
                                    <NdGrid parent={this} id={"grdContracts"} 
                                    showBorders={true} 
                                    columnsAutoWidth={true} 
                                    allowColumnReordering={true} 
                                    allowColumnResizing={true} 
                                    filterRow={{visible:true}}
                                    height={'500'} 
                                    width={'100%'}
                                    dbApply={false}
                                    onRowUpdated={async(e)=>
                                    {
                                       
                                    }}
                                    onRowRemoved={async (e)=>{
                                        await this.itemPriceObj.save()
                                    }}
                                    >
                                        <KeyboardNavigation editOnKeyPress={true} enterKeyAction={'moveFocus'} enterKeyDirection={'row'} />
                                        <Editing mode="cell" allowUpdating={true} allowDeleting={true} />
                                        <Paging defaultPageSize={10} />
                                        <Pager
                                        visible={true} />
                                        <Column dataField="CDATE_FORMAT" caption={this.t("grdContracts.clmCreateDate")} width={200}/>
                                        <Column dataField="ITEM_CODE" caption={this.t("grdContracts.clmItemCode")} width={150} />
                                        <Column dataField="ITEM_NAME" caption={this.t("grdContracts.clmItemName")} width={350} />
                                        <Column dataField="PRICE" caption={this.t("grdContracts.clmPrice")} dataType={'number'} format={{ style: "currency", currency: "EUR",precision: 2}}/>
                                        <Column dataField="QUANTITY" caption={this.t("grdContracts.clmQuantity")} dataType={'number'}/>
                                        <Column dataField="START_DATE" caption={this.t("grdContracts.clmStartDate")} 
                                        editorOptions={{value:null}}
                                        cellRender={(e) => 
                                        {
                                            if(moment(e.value).format("YYYY-MM-DD") != '1970-01-01')
                                            {
                                                return e.text
                                            }
                                            
                                            return
                                        }}/>
                                        <Column dataField="FINISH_DATE" caption={this.t("grdContracts.clmFinishDate")}
                                         editorOptions={{value:null}}
                                         cellRender={(e) => 
                                         {
                                             if(moment(e.value).format("YYYY-MM-DD") != '1970-01-01')
                                             {
                                                 return e.text
                                             }
                                             
                                             return
                                         }}/>
                                        <Column dataField="DEPOT_NAME" caption={this.t("grdContracts.clmDepotName")} />
                                    </NdGrid>
                                </Item>
                            </Form>
                        </div>
                    </div>
                     {/* STOK POPUP */}
                     <div>
                        <NdPopUp parent={this} id={"popItems"} 
                        visible={false}
                        showCloseButton={true}
                        showTitle={true}
                        title={this.t("popItems.title")}
                        container={"#root"} 
                        width={'500'}
                        height={'450'}
                        position={{of:'#root'}}
                        >
                            <Form colCount={1} height={'fit-content'}>
                                <Item>
                                    <Label text={this.t("popItems.txtPopItemsCode")} alignment="right" />
                                    <NdTextBox id={"txtPopItemsCode"} parent={this} simple={true}
                                    button=
                                    {
                                        [
                                            {
                                                id:'01',
                                                icon:'more',
                                                onClick:()=>
                                                {                  
                                                    this.txtPopItemsQuantity.value = 1 
                                                    this.txtPopItemsCode.value = ''
                                                    this.txtPopItemsName.value = ''
                                                                              
                                                    this.pg_txtPopItemsCode.show()
                                                    this.pg_txtPopItemsCode.onClick = (data) =>
                                                    {
                                                        if(data.length > 0)
                                                        {
                                                            this.txtPopItemsCode.GUID = data[0].GUID
                                                            this.txtPopItemsCode.value = data[0].CODE;
                                                            this.txtPopItemsName.value = data[0].NAME;
                                                            this.txtPopItemsCode.PRICE = data[0].PRICE;
                                                        }
                                                    }
                                                }
                                            },
                                        ]
                                    }>       
                                    <Validator validationGroup={"frmSlsContItems"}>
                                            <RequiredRule message={this.t("validItemsCode")} />
                                    </Validator>                                 
                                    </NdTextBox>
                                    
                                </Item>
                                <Item>
                                    <Label text={this.t("popItems.txtPopItemsName")} alignment="right" />
                                    <NdTextBox id={"txtPopItemsName"} parent={this} simple={true} editable={true}/>
                                </Item>
                                <Item>
                                    <Label text={this.t("popItems.txtPopItemsPrice")} alignment="right" />
                                    <NdTextBox id={"txtPopItemsPrice"} parent={this} simple={true} >
                                        <Validator validationGroup={"frmSlsContItems"}>
                                                <RequiredRule message={this.t("validItemPrice")} />
                                        </Validator>
                                    </NdTextBox>
                                </Item>
                                <Item>
                                    <Label text={this.t("popItems.txtPopItemsQuantity")} alignment="right" />
                                    <NdTextBox id={"txtPopItemsQuantity"} parent={this} simple={true} />
                                </Item>
                                <Item>
                                    <Label text={this.t("popItems.dtPopStartDate")} alignment="right" />
                                    <NdDatePicker simple={true}  parent={this} id={"dtPopStartDate"}/>
                                </Item>
                                <Item>
                                    <Label text={this.t("popItems.dtPopEndDate")} alignment="right" />
                                    <NdDatePicker simple={true}  parent={this} id={"dtPopEndDate"}/>
                                </Item>
                                <Item>
                                    <div className='row'>
                                        <div className='col-6'>
                                            <NdButton text={this.lang.t("btnSave")} type="normal" stylingMode="contained" width={'100%'} validationGroup="frmSlsContItems"
                                            onClick={async (e)=>
                                            {       
                                                if(e.validationGroup.validate().status == "valid")
                                                {
                                                    let tmpDatas = this.prmObj.filter({ID:'maxDiscount',USERS:this.user.CODE}).getValue()
                                                    if(typeof tmpDatas != 'undefined' && tmpDatas.value > 0)
                                                    {
                                                        if(this.txtPopItemsPrice.value < (this.txtPopItemsCode.PRICE - (this.txtPopItemsCode.PRICE * tmpDatas.value / 100)))
                                                        {
                                                            let tmpConfObj =
                                                            {
                                                                id:'msgDiscount',showTitle:true,title:this.t("msgDiscount.title"),showCloseButton:true,width:'500px',height:'200px',
                                                                button:[{id:"btn01",caption:this.t("msgDiscount.btn01"),location:'after'}],
                                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgDiscount.msg") + (this.txtPopItemsCode.PRICE - (this.txtPopItemsCode.PRICE * tmpDatas.value / 100))}</div>)
                                                            }
                                                        
                                                            dialog(tmpConfObj);
                                                            this.docObj.docItems.dt()[rowIndex].DISCOUNT = 0 
                                                            return
                                                        }
                                                       
                                                    }
                                                    let tmpEmpty = {...this.itemPriceObj.empty};
                                                    
                                                    tmpEmpty.CUSER = this.core.auth.data.CODE,  
                                                    tmpEmpty.TYPE = 2,  
                                                    tmpEmpty.ITEM_GUID = this.txtPopItemsCode.GUID
                                                    tmpEmpty.ITEM_CODE = this.txtPopItemsCode.value
                                                    tmpEmpty.ITEM_NAME = this.txtPopItemsName.value
                                                    tmpEmpty.CUSTOMER_GUID = this.txtCustomerCode.GUID
                                                    tmpEmpty.QUANTITY = this.txtPopItemsQuantity.value
                                                    tmpEmpty.PRICE = this.txtPopItemsPrice.value
                                                    tmpEmpty.START_DATE = this.dtPopStartDate.value
                                                    tmpEmpty.FINISH_DATE = this.dtPopEndDate.value
                                                    if(this.cmbDepot.value != '')
                                                    {
                                                        tmpEmpty.DEPOT = this.cmbDepot.value 
                                                        tmpEmpty.DEPOT_NAME = this.cmbDepot.displayExpr 
                                                    }   
                                                    
                                                
                                                    this.itemPriceObj.addEmpty(tmpEmpty);
                                                    this.popItems.hide();
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
                                        </div>
                                        <div className='col-6'>
                                            <NdButton text={this.lang.t("btnCancel")} type="normal" stylingMode="contained" width={'100%'}
                                            onClick={()=>
                                            {
                                                this.popItems.hide();  
                                            }}/>
                                        </div>
                                    </div>
                                </Item>
                            </Form>
                        </NdPopUp>
                    </div>  
                    {/* Stok Grid */}
                    <NdPopGrid id={"pg_txtPopItemsCode"} parent={this} container={"#root"}
                    visible={false}
                    position={{of:'#root'}} 
                    showTitle={true} 
                    showBorders={true}
                    width={'90%'}
                    height={'90%'}
                    title={this.t("pg_txtPopItemsCode.title")} //
                    search={true}
                    data = 
                    {{
                        source:
                        {
                            select:
                            {
                                query : "SELECT GUID,CODE,NAME,COST_PRICE,(select dbo.FN_PRICE_SALE_VAT_EXT(GUID,1,GETDATE())) AS PRICE FROM ITEMS_VW_01 WHERE UPPER(CODE) LIKE UPPER(@VAL) OR UPPER(NAME) LIKE UPPER(@VAL)",
                                param : ['VAL:string|50']
                            },
                            sql:this.core.sql
                        }
                    }}
                    >           
                    <Column dataField="CODE" caption={this.t("pg_txtPopItemsCode.clmCode")} width={150} />
                    <Column dataField="NAME" caption={this.t("pg_txtPopItemsCode.clmName")} width={500} defaultSortOrder="asc" />
                    <Column dataField="COST_PRICE" caption={this.t("pg_txtPopItemsCode.clmCostPrice")} width={300}  />
                    <Column dataField="PRICE" caption={this.t("pg_txtPopItemsCode.clmSalesPrice")} width={300}  />
                    </NdPopGrid>
                                    
                </ScrollView>
            </div>
        )
    }
}
