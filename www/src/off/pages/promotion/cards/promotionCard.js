import React from 'react';
import App from '../../../lib/app.js';
import {promoCls} from '../../../../core/cls/promotion.js'
import moment from 'moment';

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
import NdGrid,{Column,Editing,Paging,Scrolling} from '../../../../core/react/devex/grid.js';
import NdButton from '../../../../core/react/devex/button.js';
import NdDatePicker from '../../../../core/react/devex/datepicker.js';
import { dialog } from '../../../../core/react/devex/dialog.js';
import NdListBox from '../../../../core/react/devex/listbox.js';
import { datatable } from '../../../../core/core.js';

export default class promotionCard extends React.PureComponent
{
    constructor(props)
    {
        super(props) 
        this.state = 
        {
            discPrice:0,
        }               
        this.core = App.instance.core;
        this.prmObj = this.param.filter({TYPE:1,USERS:this.user.CODE});

        this.promo = new promoCls();
        this.condDt = new datatable();
        this.appDt = new datatable();

        this.tabIndex = props.data.tabkey

        Number.money = this.sysParam.filter({ID:'MoneySymbol',TYPE:0}).getValue()
    }   
    async componentDidMount()
    {
        await this.core.util.waitUntil(0)
        this.init();
        if(typeof this.pagePrm != 'undefined')
        {
            console.log(this.pagePrm.CODE)
            await this.getPromotion(this.pagePrm.CODE);
        }
    }
    async init()
    {
        this.clearItemList();

        this.condDt.clear();
        this.appDt.clear();

        this.promo.clearAll();
        this.promo.addEmpty();
        
        this.condDt.push({...this.promo.cond.empty})        
        this.appDt.push({...this.promo.app.empty})  

        await this.lstPromo.dataRefresh({source:[{id:0,text:'Koşul',items:this.condDt},{id:1,text:'Uygulama',items:this.appDt}]});        

        this.promo.ds.on('onRefresh',async(pTblName)  =>
        {            
            
        })    
    }
    async getPromotion(pCode)
    {
        this.clearItemList();

        this.condDt.clear();
        this.appDt.clear();

        this.promo.clearAll();
        await this.promo.load({CODE:pCode});
        
        if(this.promo.cond.dt().length == 0)
        {
            this.promo.cond.addEmpty();
        }
        if(this.promo.app.dt().length == 0)
        {
            this.promo.app.addEmpty();
        }

        this.condDt.import(this.promo.cond.dt().groupBy('WITHAL').toArray())
        this.appDt.import(this.promo.app.dt().groupBy('WITHAL').toArray())

        this.setState({discPrice : 0})
        
        await this.core.util.waitUntil(0);
        await this.lstPromo.dataRefresh();
    }
    clearItemList()
    {
        for (let i = 0; i < 100; i++) 
        {
            delete this["itemList" + i]
        }
    }
    async checkPromotion(pCode)
    {
        return new Promise(async resolve => 
        {            
            if(pCode !== '')
            {
                let tmpData = await new promoCls().load({CODE:pCode});
    
                if(tmpData.length > 0)
                {
                    let tmpConfObj =
                    {
                        id:'msgRef',
                        showTitle:true,
                        title:this.t("msgRef.title"),
                        showCloseButton:true,
                        width:'500px',
                        height:'200px',
                        button:[{id:"btn01",caption:this.t("msgRef.btn01"),location:'before'},{id:"btn02",caption:this.t("msgRef.btn02"),location:'after'}],
                        content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgRef.msg")}</div>)
                    }
                    
                    let pResult = await dialog(tmpConfObj);
                    if(pResult == 'btn01')
                    {
                        this.getPromotion(pCode)
                        resolve(2) //KAYIT VAR
                    }
                    else
                    {
                        resolve(3) //TAMAM BUTONUNA BASILDI
                    }
                }
                else
                {
                    resolve(1) //KAYIT BULUNMADI
                }
            }
            else
            {
                resolve(0) //PARAMETRE BOŞ
            }
        });
    }
    async getPrice(pGuid)
    {
        return new Promise(async resolve => 
        {
            if(pGuid == '00000000-0000-0000-0000-000000000000')
            {
                resolve(0)
            }
            
            let tmpQuery = 
            {
                query : "SELECT dbo.FN_PRICE_SALE(@GUID,1,GETDATE(),@CUSTOMER) AS PRICE",
                param : ['GUID:string|50','CUSTOMER:string|50'],
                value : [pGuid,this.promo.dt()[0].CUSTOMER_GUID]           
            }

            let tmpData = await this.core.sql.execute(tmpQuery)

            if(tmpData.result.recordset.length > 0)
            {
                resolve(tmpData.result.recordset[0].PRICE)
            }
    
            resolve(0)
        });
    }
    groupTemplate(pItem) 
    {
        return (
            <div className='row'>
                <div className='col-6'>
                    {pItem.text}
                </div>
                <div className='col-6'>
                    <Toolbar style={{backgroundColor:"#f1f4f5"}}>
                        <Item location="after" locateInMenu="auto">
                            <NdButton id="btnPlus" parent={this} icon="plus" type="default"
                            onClick={async()=>
                            {
                                if(pItem.id == 0)
                                {
                                    let tmpEmpty = {...this.promo.cond.empty}
                                    tmpEmpty.GUID = datatable.uuidv4();
                                    tmpEmpty.WITHAL = this.condDt.max('WITHAL') + 1
                                    this.condDt.push(tmpEmpty);
                                }
                                if(pItem.id == 1)
                                {
                                    let tmpEmpty = {...this.promo.app.empty}
                                    tmpEmpty.GUID = datatable.uuidv4();
                                    tmpEmpty.WITHAL = this.appDt.max('WITHAL') + 1
                                    this.appDt.push(tmpEmpty);
                                }
                                
                                await this.core.util.waitUntil(0);
                                await this.lstPromo.dataRefresh();
                            }}/>
                        </Item>
                    </Toolbar>
                </div>
            </div>
        )
    }
    itemTemplate(pItem)
    {               
        console.log(pItem)
        if(pItem.SECTOR == 'COND')
        {            
            if(typeof this["itemList" + pItem.WITHAL] == 'undefined' || this["itemList" + pItem.WITHAL].length == 0)
            {
                this["itemList" + pItem.WITHAL] = this.promo.cond.dt().where({WITHAL:pItem.WITHAL})
                this["itemList" + pItem.WITHAL].forEach(async x =>
                {
                    x.PRICE = await this.getPrice(x.ITEM_GUID)
                })
            }

            this.state["prmType" + pItem.WITHAL] = pItem.TYPE

            return(
                <div className='row'>
                    <div className='col-12'>                    
                        <Form colCount={3} id={"frmCond"  + this.tabIndex}>
                            {/* cmbPrmType */}
                            <Item>
                                <Label text={this.t("cmbPrmType")} alignment="right" />
                                <NdSelectBox simple={true} parent={this} id={"cmbPrmType" + pItem.WITHAL}
                                displayExpr="NAME"                       
                                valueExpr="ID"
                                value={pItem.TYPE}
                                data={{source:[{ID:0,NAME:this.t("cmbType.item")},{ID:1,NAME:this.t("cmbType.generalAmount")}]}}
                                onValueChanged={(e)=>
                                {
                                    if(e.previousValue == 0 && this.promo.cond.dt().where({WITHAL:pItem.WITHAL}).length > 1)
                                    {
                                        this.promo.cond.dt().where({WITHAL:pItem.WITHAL}).forEach((item)=>
                                        {
                                            this.promo.cond.dt().removeAt(item)
                                        })
                                    }

                                    if(this.condDt.where({WITHAL:pItem.WITHAL}).length > 0)
                                    {
                                        this.condDt.where({WITHAL:pItem.WITHAL})[0].TYPE = e.value
                                    }

                                    this.setState({["prmType" + pItem.WITHAL] :e.value})
                                }}
                                />
                            </Item>
                            <EmptyItem />
                            <EmptyItem />
                            <GroupItem colSpan={3}>
                                <GroupItem colCount={3} visible={this.state["prmType" + pItem.WITHAL] == 0 ? true : false}>
                                    {/* txtPrmItem */}
                                    <Item>
                                        <Label text={this.t("txtPrmItem")} alignment="right" />
                                        <NdButton text={this.t("btnPrmItem")} type="default" width="100%" 
                                        onClick={()=>
                                        {
                                            this["grdPopItemList" + pItem.WITHAL].dataRefresh({source:this["itemList" + pItem.WITHAL]})
                                            this["pop_PrmItemList" + pItem.WITHAL].show()
                                        }}></NdButton> 
                                        {/* SEÇİM POPUP */}
                                        <NdPopGrid id={"pg_txtPrmItem" + pItem.WITHAL} parent={this} container={"#root"} 
                                        visible={false}
                                        position={{of:'#root'}} 
                                        showTitle={true} 
                                        showBorders={true}
                                        width={'90%'}
                                        height={'90%'}
                                        title={this.t("pg_Grid.title")} 
                                        search={true}
                                        data = 
                                        {{
                                            source:
                                            {
                                                select:
                                                {
                                                    query : "SELECT MAX(ITEM_GUID) AS GUID,MAX(BARCODE) AS BARCODE,ITEM_CODE AS CODE,ITEM_NAME AS NAME,MAIN_GRP_NAME AS MAIN_GRP_NAME, " + 
                                                            "ISNULL((SELECT dbo.FN_PRICE_SALE(ITEM_GUID,1,GETDATE(),'00000000-0000-0000-0000-000000000000')),0) AS PRICE " + 
                                                            "FROM ITEM_BARCODE_VW_01 WHERE (UPPER(ITEM_CODE) LIKE UPPER(@VAL) OR UPPER(ITEM_NAME) LIKE UPPER(@VAL) OR BARCODE LIKE @VAL) AND STATUS = 1 " + 
                                                            "GROUP BY ITEM_CODE,ITEM_NAME,MAIN_GRP_NAME,ITEM_GUID",
                                                    param : ['VAL:string|50']
                                                },
                                                sql:this.core.sql
                                            }
                                        }}>
                                            <Column dataField="BARCODE" caption={this.t("pg_Grid.clmBarcode")} width={150} />
                                            <Column dataField="CODE" caption={this.t("pg_Grid.clmCode")} width={150} />
                                            <Column dataField="NAME" caption={this.t("pg_Grid.clmName")} width={650} defaultSortOrder="asc" />
                                            <Column dataField="MAIN_GRP_NAME" caption={this.t("pg_Grid.clmGrpName")} width={150}/>
                                            <Column dataField="PRICE" caption={this.t("pg_Grid.clmPrice")} width={100}/>
                                        </NdPopGrid>
                                        {/* SEÇİM LİSTE POPUP */}
                                        <NdPopUp parent={this} id={"pop_PrmItemList" + pItem.WITHAL} container={"#root"}
                                        position={{of:'#root'}}
                                        showCloseButton={true}
                                        showTitle={true}
                                        title={this.t("pg_Grid.title")}
                                        width={'70%'}
                                        height={'90%'}
                                        >
                                            <div className="row pb-1">
                                                <div className='col-12'>
                                                <NdButton text={this.t("btnPrmItem")} type="default" width="100%" 
                                                onClick={()=>
                                                {
                                                    this["pg_txtPrmItem" + pItem.WITHAL]["txtpg_txtPrmItem" + pItem.WITHAL].value = ""
                                                    this["pg_txtPrmItem" + pItem.WITHAL].show()
                                                    this["pg_txtPrmItem" + pItem.WITHAL].onClick = async(data) =>
                                                    {         
                                                        this.promo.cond.dt().where({WITHAL:pItem.WITHAL}).forEach((item)=>
                                                        {
                                                            this.promo.cond.dt().removeAt(item)
                                                        })

                                                        //this["itemList" + pItem.WITHAL] = []

                                                        for (let i = 0; i < data.length; i++) 
                                                        {
                                                            let tmpData = {...this.promo.cond.empty}
                                                            
                                                            tmpData.GUID = datatable.uuidv4();
                                                            tmpData.ITEM_GUID = data[i].GUID;
                                                            tmpData.ITEM_CODE = data[i].CODE;
                                                            tmpData.ITEM_NAME = data[i].NAME;
                                                            tmpData.PRICE = data[i].PRICE;
                                                            tmpData.PROMO = this.promo.dt()[0].GUID
                                                            tmpData.QUANTITY = 1;
                                                            tmpData.AMOUNT = 0;
                                                            tmpData.WITHAL = pItem.WITHAL

                                                            this["itemList" + pItem.WITHAL].push(tmpData);
                                                        }

                                                        if(data.length > 0)
                                                        {
                                                            //this["txtPrmItem" + pItem.WITHAL].value = data[0].CODE;
                                                            //this["txtPrmItem" + pItem.WITHAL].displayValue = data[0].NAME

                                                            if(this.condDt.where({WITHAL:pItem.WITHAL}).length > 0)
                                                            {
                                                                this.condDt.where({WITHAL:pItem.WITHAL})[0].ITEM_GUID = data[0].GUID
                                                                this.condDt.where({WITHAL:pItem.WITHAL})[0].ITEM_CODE = data[0].CODE
                                                                this.condDt.where({WITHAL:pItem.WITHAL})[0].ITEM_NAME = data[0].NAME
                                                            }
                                                        }
                                                    }
                                                }}></NdButton> 
                                                </div>
                                            </div>
                                            {/* grdPopGridList */}
                                            <div className="row">
                                                <div className="col-12">
                                                    <NdGrid parent={this} id={"grdPopItemList" + pItem.WITHAL} 
                                                    showBorders={true} 
                                                    columnsAutoWidth={false} 
                                                    allowColumnResizing={true} 
                                                    allowColumnReordering={false}
                                                    height={"100%"} 
                                                    width={"100%"}
                                                    dbApply={false}
                                                    selection={{mode:"single"}}
                                                    loadPanel={{enabled:false}}
                                                    sorting={{ mode: 'none' }}
                                                    >
                                                        <Editing mode="cell" allowUpdating={false} allowDeleting={true} />
                                                        <Scrolling mode="standart" />
                                                        <Column dataField="ITEM_CODE" caption={this.t("pg_Grid.clmCode")} width={100}/>
                                                        <Column dataField="ITEM_NAME" caption={this.t("pg_Grid.clmName")} width={290}/>
                                                        <Column dataField="PRICE" caption={this.t("pg_Grid.clmPrice")} width={100}/>
                                                    </NdGrid>
                                                </div>
                                            </div>
                                        </NdPopUp>
                                    </Item>
                                    {/* txtPrmQuantity */}  
                                    <Item>                                                                    
                                        <Label text={this.t("txtPrmQuantity")} alignment="right" />
                                        <NdTextBox id={"txtPrmQuantity" + pItem.WITHAL} parent={this} simple={true} value={pItem.QUANTITY}
                                        onValueChanged={(e)=>
                                        {
                                            this["txtPrmAmount" + pItem.WITHAL].value = 0
                                            if(this.condDt.where({WITHAL:pItem.WITHAL}).length > 0)
                                            {
                                                this.condDt.where({WITHAL:pItem.WITHAL})[0].QUANTITY = e.value
                                            }
                                        }}
                                        button={
                                        [
                                            {
                                                id:'01',
                                                icon:'help',
                                                onClick:async()=>
                                                {
                                                    let tmpConfObj =
                                                    {
                                                        id:'msgSave',showTitle:true,title:this.t("msgHelp.title"),showCloseButton:true,width:'500px',height:'200px',
                                                        content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgHelp.condItemQuantity")}</div>)
                                                    }
                                                    await dialog(tmpConfObj);
                                                }
                                            }
                                        ]}>
                                            <Validator validationGroup={"frmPromo"  + this.tabIndex}>
                                                <RequiredRule message={this.t("validation.txtPrmQuantityValid")} />
                                            </Validator> 
                                        </NdTextBox>     
                                    </Item>
                                    {/* txtPrmAmount */}  
                                    <Item>                                                                    
                                        <Label text={this.t("txtPrmAmount")} alignment="right" />
                                        <NdTextBox id={"txtPrmAmount" + pItem.WITHAL} parent={this} simple={true} value={pItem.AMOUNT}
                                        onValueChanged={(e)=>
                                        {
                                            this["txtPrmQuantity" + pItem.WITHAL].value = 0
                                            if(this.condDt.where({WITHAL:pItem.WITHAL}).length > 0)
                                            {
                                                this.condDt.where({WITHAL:pItem.WITHAL})[0].AMOUNT = e.value
                                            }
                                        }}
                                        button={
                                        [
                                            {
                                                id:'01',
                                                icon:'help',
                                                onClick:async()=>
                                                {
                                                    let tmpConfObj =
                                                    {
                                                        id:'msgSave',showTitle:true,title:this.t("msgHelp.title"),showCloseButton:true,width:'500px',height:'200px',
                                                        content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgHelp.condItemAmount")}</div>)
                                                    }
                                                    await dialog(tmpConfObj);
                                                }
                                            }
                                        ]}/>     
                                    </Item>
                                </GroupItem>
                                <GroupItem colCount={3} visible={this.state["prmType" + pItem.WITHAL] == 1 ? true : false}>
                                    {/* txtPrmAmount */}  
                                    <Item>                                                                    
                                        <Label text={this.t("txtPrmAmount")} alignment="right" />
                                        <NdTextBox id={"txtPrmAmount" + pItem.WITHAL} parent={this} simple={true} value={pItem.AMOUNT}
                                        onValueChanged={(e)=>
                                        {
                                            if(this.condDt.where({WITHAL:pItem.WITHAL}).length > 0)
                                            {
                                                this.condDt.where({WITHAL:pItem.WITHAL})[0].AMOUNT = e.value
                                            }
                                        }}
                                        button={
                                        [
                                            {
                                                id:'01',
                                                icon:'help',
                                                onClick:async()=>
                                                {
                                                    let tmpConfObj =
                                                    {
                                                        id:'msgSave',showTitle:true,title:this.t("msgHelp.title"),showCloseButton:true,width:'500px',height:'200px',
                                                        content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgHelp.condGeneralAmount")}</div>)
                                                    }
                                                    await dialog(tmpConfObj);
                                                }
                                            }
                                        ]}/>     
                                    </Item> 
                                    <EmptyItem /> 
                                    <EmptyItem /> 
                                </GroupItem>
                            </GroupItem>
                        </Form>
                    </div>
                </div>            
            )
        }
        else if(pItem.SECTOR == 'APP')
        {
            this.state["rstType" + pItem.WITHAL] = pItem.TYPE
            
            return(
                <div className='row'>
                    <div className='col-12'>
                        <Form colCount={3} id={"frmApp"  + this.tabIndex}>
                            {/* cmbRstType */}
                            <Item>
                                <Label text={this.t("cmbRstType")} alignment="right" />
                                <NdSelectBox simple={true} parent={this} id={"cmbRstType" + pItem.WITHAL}
                                displayExpr="NAME"                       
                                valueExpr="ID"
                                value={pItem.TYPE}
                                data={{source:[{ID:0,NAME:this.t("cmbType.discountRate")},{ID:1,NAME:this.t("cmbType.moneyPoint")},{ID:2,NAME:this.t("cmbType.giftCheck")},{ID:3,NAME:this.t("cmbType.item")},{ID:4,NAME:this.t("cmbType.generalDiscount")},{ID:5,NAME:this.t("cmbType.discountAmount")}]}}  
                                onValueChanged={(e) =>
                                {
                                    if(this.appDt.where({WITHAL:pItem.WITHAL}).length > 0)
                                    {
                                        this.appDt.where({WITHAL:pItem.WITHAL})[0].TYPE = e.value
                                    }
                                    this.setState({["rstType" + pItem.WITHAL]:e.value,discPrice:0})
                                }}                                  
                                />
                            </Item>                                
                            <EmptyItem/>
                            <EmptyItem/>
                            <GroupItem colSpan={3}>
                                {/* İskonto Oran */}
                                <GroupItem colCount={3} visible={this.state["rstType" + pItem.WITHAL] == 0 || this.state["rstType" + pItem.WITHAL] == 5 ? true : false}>
                                    {/* txtRstDiscount */}
                                    <Item>
                                        <Label text={this.t("txtRstQuantity")} alignment="right" />
                                        <NdTextBox id={"txtRstQuantity" + pItem.WITHAL} parent={this} simple={true} readOnly={true} value={pItem.AMOUNT}                                        
                                        button=
                                        {[
                                            {
                                                id:'01',
                                                icon:'more',
                                                onClick:async()=>
                                                {
                                                    if(this.condDt.length > 0)
                                                    {
                                                        let tmpPrice = await this.getPrice(this.condDt[0].ITEM_GUID)
                                                        this.setState({discPrice:tmpPrice})
                                                    }
                                                    if(this.state["rstType" + pItem.WITHAL] == 0)
                                                    {
                                                        this["txtDiscRate" + pItem.WITHAL].value = this["txtRstQuantity" + pItem.WITHAL].value
                                                        this["txtDiscAmount" + pItem.WITHAL].value = Number(this.state.discPrice - Number(this.state.discPrice).rateInc(this["txtRstQuantity" + pItem.WITHAL].value,2)).toFixed(2)
                                                    }
                                                    else if(this.state["rstType" + pItem.WITHAL] == 5)
                                                    {
                                                        this["txtDiscRate" + pItem.WITHAL].value = Number(100 - Number(this.state.discPrice).rate2Num(this["txtRstQuantity" + pItem.WITHAL].value,2)).toFixed(2)
                                                        this["txtDiscAmount" + pItem.WITHAL].value = this["txtRstQuantity" + pItem.WITHAL].value
                                                    }                                                    
                                                    this["popDiscount" + pItem.WITHAL].show()
                                                }
                                            },
                                            {
                                                id:'02',
                                                icon:'help',
                                                onClick:async()=>
                                                {
                                                    let tmpConfObj = {}
                                                    if(this.state["rstType" + pItem.WITHAL] == 0)
                                                    {
                                                        tmpConfObj =
                                                        {
                                                            id:'msgSave',showTitle:true,title:this.t("msgHelp.title"),showCloseButton:true,width:'500px',height:'200px',
                                                            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgHelp.appDiscRate")}</div>)
                                                        }
                                                    }
                                                    else if(this.state["rstType" + pItem.WITHAL] == 5)
                                                    {
                                                        tmpConfObj =
                                                        {
                                                            id:'msgSave',showTitle:true,title:this.t("msgHelp.title"),showCloseButton:true,width:'500px',height:'200px',
                                                            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgHelp.appDiscAmount")}</div>)
                                                        }
                                                    }

                                                    await dialog(tmpConfObj);
                                                }
                                            }
                                        ]}/>
                                    </Item>
                                    <EmptyItem/>
                                    <EmptyItem/>
                                </GroupItem>
                                {/* Puan - Hediye Çeki - Genel İskonto */}
                                <GroupItem colCount={3} visible={this.state["rstType" + pItem.WITHAL] == 1 || this.state["rstType" + pItem.WITHAL] == 2 || this.state["rstType" + pItem.WITHAL] == 4 ? true : false}>
                                    {/* txtRstPointGift */}
                                    <Item>
                                        <Label text={this.t("txtRstQuantity")} alignment="right" />
                                        <NdTextBox id={"txtRstPointGift" + pItem.WITHAL} parent={this} simple={true} value={pItem.AMOUNT}
                                        onValueChanged={(e)=>
                                        {
                                            if(this.appDt.where({WITHAL:pItem.WITHAL}).length > 0)
                                            {
                                                this.appDt.where({WITHAL:pItem.WITHAL})[0].AMOUNT = e.value
                                            }
                                        }}
                                        button={
                                        [
                                            {
                                                id:'01',
                                                icon:'help',
                                                onClick:async()=>
                                                {
                                                    let tmpConfObj = {}
                                                    if(this.state["rstType" + pItem.WITHAL] == 1)
                                                    {
                                                        tmpConfObj =
                                                        {
                                                            id:'msgSave',showTitle:true,title:this.t("msgHelp.title"),showCloseButton:true,width:'500px',height:'200px',
                                                            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgHelp.appPoint")}</div>)
                                                        }
                                                    }
                                                    else if(this.state["rstType" + pItem.WITHAL] == 2)
                                                    {
                                                        tmpConfObj =
                                                        {
                                                            id:'msgSave',showTitle:true,title:this.t("msgHelp.title"),showCloseButton:true,width:'500px',height:'200px',
                                                            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgHelp.appGiftCheck")}</div>)
                                                        }
                                                    }
                                                    else if(this.state["rstType" + pItem.WITHAL] == 4)
                                                    {
                                                        tmpConfObj =
                                                        {
                                                            id:'msgSave',showTitle:true,title:this.t("msgHelp.title"),showCloseButton:true,width:'500px',height:'200px',
                                                            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgHelp.appGeneralAmount")}</div>)
                                                        }
                                                    }
                                                    await dialog(tmpConfObj);
                                                }
                                            }
                                        ]}/>
                                    </Item>
                                    <EmptyItem/>
                                    <EmptyItem/>
                                </GroupItem>
                                {/* Ürün İskonto */}
                                <GroupItem colCount={3} visible={this.state["rstType" + pItem.WITHAL] == 3 ? true : false}>
                                    {/* txtRstItem */}                                
                                    <Item>
                                        <Label text={this.t("txtRstItem")} alignment="right" />
                                        <NdTextBox id={"txtRstItem" + pItem.WITHAL} parent={this} simple={true} readOnly={true}
                                        upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                        value={pItem.ITEM_CODE}
                                        displayValue={pItem.ITEM_NAME}
                                        placeholder={"Açıklama girilecek"}
                                        button=
                                        {[
                                            {
                                                id:'01',
                                                icon:'more',
                                                onClick:()=>
                                                {
                                                    this["pg_txtRstItem" + pItem.WITHAL]["txtpg_txtRstItem" + pItem.WITHAL].value = ""
                                                    this["pg_txtRstItem" + pItem.WITHAL].show()
                                                    this["pg_txtRstItem" + pItem.WITHAL].onClick = (data) =>
                                                    {
                                                        if(data.length > 0)
                                                        {
                                                            this["txtRstItem" + pItem.WITHAL].value = data[0].CODE;
                                                            this["txtRstItem" + pItem.WITHAL].displayValue = data[0].NAME

                                                            if(this.appDt.where({WITHAL:pItem.WITHAL}).length > 0)
                                                            {
                                                                this.appDt.where({WITHAL:pItem.WITHAL})[0].ITEM_GUID = data[0].GUID
                                                                this.appDt.where({WITHAL:pItem.WITHAL})[0].ITEM_CODE = data[0].CODE
                                                                this.appDt.where({WITHAL:pItem.WITHAL})[0].ITEM_NAME = data[0].NAME
                                                                this.appDt.where({WITHAL:pItem.WITHAL})[0].QUANTITY = 1;
                                                                this.appDt.where({WITHAL:pItem.WITHAL})[0].AMOUNT = 0;
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        ]}
                                        >     
                                        </NdTextBox> 
                                        {/* SEÇİM POPUP */}
                                        <NdPopGrid id={"pg_txtRstItem" + pItem.WITHAL} parent={this} container={"#root"} 
                                        visible={false}
                                        position={{of:'#root'}} 
                                        showTitle={true} 
                                        showBorders={true}
                                        width={'90%'}
                                        height={'90%'}
                                        title={this.t("pg_Grid.title")} 
                                        search={true}
                                        data = 
                                        {{
                                            source:
                                            {
                                                select:
                                                {
                                                    query : "SELECT MAX(ITEM_GUID) AS GUID,MAX(BARCODE) AS BARCODE,ITEM_CODE AS CODE,ITEM_NAME AS NAME,MAIN_GRP_NAME AS MAIN_GRP_NAME FROM ITEM_BARCODE_VW_01 " +
                                                            "WHERE (UPPER(ITEM_CODE) LIKE UPPER(@VAL) OR UPPER(ITEM_NAME) LIKE UPPER(@VAL) OR BARCODE LIKE @VAL) AND STATUS = 1 " + 
                                                            "GROUP BY ITEM_CODE,ITEM_NAME,MAIN_GRP_NAME",
                                                    param : ['VAL:string|50']
                                                },
                                                sql:this.core.sql
                                            }
                                        }}>
                                            <Column dataField="BARCODE" caption={this.t("pg_Grid.clmBarcode")} width={150} />
                                            <Column dataField="CODE" caption={this.t("pg_Grid.clmCode")} width={150} />
                                            <Column dataField="NAME" caption={this.t("pg_Grid.clmName")} width={650} defaultSortOrder="asc" />
                                            <Column dataField="MAIN_GRP_NAME" caption={this.t("pg_Grid.clmGrpName")} width={150}/>
                                        </NdPopGrid>
                                    </Item>     
                                    {/* txtRstItemQuantity */}  
                                    <Item>                                                                    
                                        <Label text={this.t("txtRstItemQuantity")} alignment="right" />
                                        <NdTextBox id={"txtRstItemQuantity" + pItem.WITHAL} parent={this} simple={true} value={pItem.QUANTITY}
                                        onValueChanged={(e)=>
                                        {
                                            if(this.appDt.where({WITHAL:pItem.WITHAL}).length > 0)
                                            {
                                                this.appDt.where({WITHAL:pItem.WITHAL})[0].QUANTITY = e.value
                                            }
                                        }}
                                        button={
                                        [
                                            {
                                                id:'01',
                                                icon:'help',
                                                onClick:async()=>
                                                {
                                                    let tmpConfObj =
                                                    {
                                                        id:'msgSave',showTitle:true,title:this.t("msgHelp.title"),showCloseButton:true,width:'500px',height:'200px',
                                                        content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgHelp.appItemQuantity")}</div>)
                                                    }
                                                    await dialog(tmpConfObj);
                                                }
                                            }
                                        ]}>
                                            <Validator validationGroup={"frmPromo"  + this.tabIndex}>
                                                <RangeRule min={0.001} message={this.t("validation.txtRstItemQuantityValid")} />
                                            </Validator> 
                                        </NdTextBox>     
                                    </Item> 
                                    {/* txtRstItemAmount */}  
                                    <Item>                                                                    
                                        <Label text={this.t("txtRstItemAmount")} alignment="right" />
                                        <NdTextBox id={"txtRstItemAmount" + pItem.WITHAL} parent={this} simple={true} readOnly={true} value={pItem.AMOUNT}
                                        button=
                                        {[
                                            {
                                                id:'01',
                                                icon:'more',
                                                onClick:async()=>
                                                {
                                                    if(this.appDt.length > 0)
                                                    {
                                                        let tmpPrice = await this.getPrice(this.appDt[0].ITEM_GUID)
                                                        this.setState({discPrice:tmpPrice})
                                                    }
                                                    this["txtDiscRate" + pItem.WITHAL].value = this["txtRstItemAmount" + pItem.WITHAL].value
                                                    this["txtDiscAmount" + pItem.WITHAL].value = Number(this.state.discPrice - Number(this.state.discPrice).rateInc(this["txtRstItemAmount" + pItem.WITHAL].value,2)).toFixed(2)
                                                    this["popDiscount" + pItem.WITHAL].show()
                                                }
                                            },
                                            {
                                                id:'02',
                                                icon:'help',
                                                onClick:async()=>
                                                {
                                                    let tmpConfObj =
                                                    {
                                                        id:'msgSave',showTitle:true,title:this.t("msgHelp.title"),showCloseButton:true,width:'500px',height:'200px',
                                                        content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgHelp.appItemAmount")}</div>)
                                                    }
                                                    await dialog(tmpConfObj);
                                                }
                                            }
                                        ]}/>     
                                    </Item>
                                </GroupItem>
                            </GroupItem>
                        </Form>
                        {/* ISKONTO POPUP */}
                        <div>
                            <NdPopUp parent={this} id={"popDiscount" + pItem.WITHAL} container={"#root"}
                            position={{of:'#root'}}
                            showCloseButton={true}
                            showTitle={true}
                            title={this.t("popDiscount.title")}
                            width={'400'}
                            height={'260'}
                            >
                                <div className='row'>
                                    <div className='col-12'>
                                        <h5 className='text-center'>{this.state.discPrice}</h5>
                                    </div>
                                </div>
                                <div className='row'>
                                    <Form colCount={1}>
                                        <Item>
                                            <Label text={this.t("popDiscount.txtDiscRate")} alignment="right" />
                                            <NdTextBox id={"txtDiscRate" + pItem.WITHAL} parent={this} simple={true} 
                                            onValueChanged={async(e)=>
                                            {
                                                if(e.value >= 0 && e.value <= 100)
                                                {
                                                    this["txtDiscAmount" + pItem.WITHAL].value = Number(this.state.discPrice - Number(this.state.discPrice).rateInc(e.value,2)).toFixed(2)
                                                }
                                                else
                                                {
                                                    this["txtDiscAmount" + pItem.WITHAL].value = 0;
                                                    this["txtDiscRate" + pItem.WITHAL].value = 0;

                                                    let tmpConfObj =
                                                    {
                                                        id:'msgDiscRate',showTitle:true,title:this.t("msgDiscRate.title"),showCloseButton:true,width:'500px',height:'200px',
                                                        button:[{id:"btn01",caption:this.t("msgDiscRate.btn01"),location:'after'}],
                                                        content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgDiscRate.msg")}</div>)
                                                    }
                                                    await dialog(tmpConfObj);
                                                }                                                
                                            }}/>
                                        </Item>
                                        <Item>
                                            <Label text={this.t("popDiscount.txtDiscAmount")} alignment="right" />
                                            <NdTextBox id={"txtDiscAmount" + pItem.WITHAL} parent={this} simple={true}
                                            onValueChanged={async(e)=>
                                            { 
                                                if(Number(100 - Number(this.state.discPrice).rate2Num(e.value,2)) >= 0 && Number(100 - Number(this.state.discPrice).rate2Num(e.value,2)) <= 100)
                                                {
                                                    this["txtDiscRate" + pItem.WITHAL].value = Number(100 - Number(this.state.discPrice).rate2Num(e.value,2)).toFixed(2)
                                                }
                                                else
                                                {
                                                    this["txtDiscAmount" + pItem.WITHAL].value = 0;
                                                    this["txtDiscRate" + pItem.WITHAL].value = 0;

                                                    let tmpConfObj =
                                                    {
                                                        id:'msgDiscRate',showTitle:true,title:this.t("msgDiscRate.title"),showCloseButton:true,width:'500px',height:'200px',
                                                        button:[{id:"btn01",caption:this.t("msgDiscRate.btn01"),location:'after'}],
                                                        content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgDiscRate.msg")}</div>)
                                                    }
                                                    await dialog(tmpConfObj);
                                                }
                                            }}/>
                                        </Item>
                                        <Item>
                                            <NdButton id={"btnDiscSave" + pItem.WITHAL} parent={this} text={this.t("popDiscount.btnSave")} type="default" width={'100%'}
                                            onClick={()=>
                                            {
                                                if(this.state["rstType" + pItem.WITHAL] == 0)
                                                {
                                                    this["txtRstQuantity" + pItem.WITHAL].value = this["txtDiscRate" + pItem.WITHAL].value
                                                    this.appDt.where({WITHAL:pItem.WITHAL})[0].AMOUNT = this["txtDiscRate" + pItem.WITHAL].value
                                                }                                                
                                                else if(this.state["rstType" + pItem.WITHAL] == 3)
                                                {
                                                    this["txtRstItemAmount" + pItem.WITHAL].value = this["txtDiscRate" + pItem.WITHAL].value
                                                    this.appDt.where({WITHAL:pItem.WITHAL})[0].AMOUNT = this["txtDiscRate" + pItem.WITHAL].value
                                                }
                                                else if(this.state["rstType" + pItem.WITHAL] == 5)
                                                {
                                                    this["txtRstQuantity" + pItem.WITHAL].value = this["txtDiscAmount" + pItem.WITHAL].value
                                                    this.appDt.where({WITHAL:pItem.WITHAL})[0].AMOUNT = this["txtDiscAmount" + pItem.WITHAL].value
                                                }

                                                
                                                this["popDiscount" + pItem.WITHAL].hide()
                                            }}/>
                                        </Item>
                                    </Form>
                                </div>
                            </NdPopUp>
                        </div>
                    </div>
                </div> 
            )
        }
    }
    render()
    {
        return (
            <div>
                <ScrollView>
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
                                    <NdButton id="btnSave" parent={this} icon="floppy" type="default" validationGroup={"frmPromo"  + this.tabIndex}
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
                                                
                                                this.condDt.forEach((item)=>
                                                {
                                                    if(item.TYPE == 0)
                                                    {
                                                        if(this["itemList" + item.WITHAL].length > 0)
                                                        {
                                                            this["itemList" + item.WITHAL].forEach((list)=>
                                                            {
                                                                let tmpCond = this.promo.cond.dt().where({GUID:list.GUID}).where({ITEM_GUID:list.ITEM_GUID})
                                                                
                                                                if(tmpCond.length > 0)
                                                                {                                                                
                                                                    tmpCond[0].TYPE = item.TYPE
                                                                    tmpCond[0].ITEM_CODE = list.ITEM_CODE
                                                                    tmpCond[0].ITEM_NAME = list.ITEM_NAME
                                                                    tmpCond[0].QUANTITY = item.QUANTITY
                                                                    tmpCond[0].AMOUNT = item.AMOUNT
                                                                }
                                                                else
                                                                {                                                                    
                                                                    let tmpEmpty = {...this.promo.cond.empty}

                                                                    tmpEmpty.PROMO = this.promo.dt()[0].GUID
                                                                    tmpEmpty.ITEM_GUID = list.ITEM_GUID
                                                                    tmpEmpty.ITEM_CODE = list.ITEM_CODE
                                                                    tmpEmpty.ITEM_NAME = list.ITEM_NAME
                                                                    tmpEmpty.TYPE = item.TYPE
                                                                    tmpEmpty.QUANTITY = item.QUANTITY
                                                                    tmpEmpty.AMOUNT = item.AMOUNT
                                                                    tmpEmpty.WITHAL = item.WITHAL
                                                                    
                                                                    this.promo.cond.addEmpty(tmpEmpty)
                                                                }
                                                            })
                                                        }
                                                        else
                                                        {
                                                            let tmpEmpty = {...this.promo.cond.empty}
                                                                    
                                                            tmpEmpty.PROMO = this.promo.dt()[0].GUID
                                                            tmpEmpty.ITEM_GUID = '00000000-0000-0000-0000-000000000000'
                                                            tmpEmpty.ITEM_CODE = ''
                                                            tmpEmpty.ITEM_NAME = ''
                                                            tmpEmpty.TYPE = item.TYPE
                                                            tmpEmpty.QUANTITY = item.QUANTITY
                                                            tmpEmpty.AMOUNT = item.AMOUNT
                                                            tmpEmpty.WITHAL = item.WITHAL
                                                            
                                                            this.promo.cond.addEmpty(tmpEmpty)
                                                        }
                                                    }
                                                    else if(item.TYPE == 1)
                                                    {
                                                        let tmpCond = this.promo.cond.dt().where({GUID:item.GUID})
                                                        
                                                        if(tmpCond.length > 0)
                                                        {
                                                            tmpCond[0].TYPE = item.TYPE
                                                            tmpCond[0].ITEM_GUID = '00000000-0000-0000-0000-000000000000'
                                                            tmpCond[0].ITEM_CODE = ''
                                                            tmpCond[0].ITEM_NAME = ''
                                                            tmpCond[0].QUANTITY = item.QUANTITY
                                                            tmpCond[0].AMOUNT = item.AMOUNT
                                                        }
                                                        else
                                                        {
                                                            let tmpEmpty = {...this.promo.cond.empty}
                                                            tmpEmpty.PROMO = this.promo.dt()[0].GUID
                                                            tmpEmpty.ITEM_GUID = '00000000-0000-0000-0000-000000000000'
                                                            tmpEmpty.ITEM_CODE = ''
                                                            tmpEmpty.ITEM_NAME = ''
                                                            tmpEmpty.TYPE = item.TYPE
                                                            tmpEmpty.QUANTITY = item.QUANTITY
                                                            tmpEmpty.AMOUNT = item.AMOUNT
                                                            tmpEmpty.WITHAL = item.WITHAL
                                                            
                                                            this.promo.cond.addEmpty(tmpEmpty)
                                                        }
                                                    }
                                                })

                                                this.appDt.forEach((item)=>
                                                {
                                                    let tmpApp = this.promo.app.dt().where({GUID:item.GUID})

                                                    if(tmpApp.length > 0)
                                                    {
                                                        tmpApp[0].TYPE = item.TYPE

                                                        if(item.TYPE != 3)
                                                        {
                                                            tmpApp[0].ITEM_GUID = '00000000-0000-0000-0000-000000000000'
                                                            tmpApp[0].ITEM_CODE = ''
                                                            tmpApp[0].ITEM_NAME = ''
                                                        }
                                                        else
                                                        {
                                                            tmpApp[0].ITEM_GUID = item.ITEM_GUID
                                                            tmpApp[0].ITEM_CODE = item.ITEM_CODE
                                                            tmpApp[0].ITEM_NAME = item.ITEM_NAME
                                                        }

                                                        tmpApp[0].QUANTITY = item.QUANTITY
                                                        tmpApp[0].AMOUNT = item.AMOUNT
                                                    }
                                                    else
                                                    {
                                                        let tmpEmpty = {...this.promo.app.empty}

                                                        tmpEmpty.PROMO = this.promo.dt()[0].GUID
                                                        tmpEmpty.TYPE = item.TYPE

                                                        if(item.TYPE != 3)
                                                        {
                                                            tmpEmpty.ITEM_GUID = '00000000-0000-0000-0000-000000000000'
                                                            tmpEmpty.ITEM_CODE = ''
                                                            tmpEmpty.ITEM_NAME = ''
                                                        }
                                                        else
                                                        {
                                                            tmpEmpty.ITEM_GUID = item.ITEM_GUID
                                                            tmpEmpty.ITEM_CODE = item.ITEM_CODE
                                                            tmpEmpty.ITEM_NAME = item.ITEM_NAME
                                                        }

                                                        
                                                        tmpEmpty.QUANTITY = item.QUANTITY
                                                        tmpEmpty.AMOUNT = item.AMOUNT
                                                        tmpEmpty.WITHAL = item.WITHAL
                                                        
                                                        this.promo.app.addEmpty(tmpEmpty)
                                                    }
                                                })

                                                await this.core.util.waitUntil(0)
                                                
                                                if((await this.promo.save()) == 0)
                                                {                                                    
                                                    this.getPromotion(this.txtCode.value)

                                                    tmpConfObj1.content = (<div style={{textAlign:"center",fontSize:"20px",color:"green"}}>{this.t("msgSaveResult.msgSuccess")}</div>)
                                                    await dialog(tmpConfObj1);
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
                                            this.promo.dt().removeAt(0)
                                            await this.promo.dt().delete();
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
                    <div className="row px-2 pt-2"> 
                        <div className="col-12">
                            <Form colCount={3} id={"frmPromo"  + this.tabIndex}>
                                <GroupItem colSpan={3}>
                                    <GroupItem colCount={3}>
                                        {/* txtCode */}
                                        <Item>                                    
                                            <Label text={this.t("txtCode")} alignment="right" />
                                            <NdTextBox id="txtCode" parent={this} simple={true} tabIndex={this.tabIndex} 
                                            upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                            dt={{data:this.promo.dt(),field:"CODE"}}
                                            placeholder={this.t("txtCodePlace")}
                                            button=
                                            {
                                                [
                                                    {
                                                        id:'01',
                                                        icon:'more',
                                                        onClick:()=>
                                                        {
                                                            this.pg_txtCode.show()
                                                            this.pg_txtCode.onClick = (data) =>
                                                            {
                                                                if(data.length > 0)
                                                                {
                                                                    this.getPromotion(data[0].CODE)
                                                                }
                                                            }
                                                        }
                                                    },
                                                    {
                                                        id:'02',
                                                        icon:'arrowdown',
                                                        onClick:()=>
                                                        {
                                                            this.txtCode.value = Math.floor(Date.now() / 1000)
                                                        }
                                                    }
                                                ]
                                            }
                                            onChange={(async()=>
                                            {
                                                let tmpResult = await this.checkPromotion(this.txtCode.value)
                                                if(tmpResult == 3)
                                                {
                                                    this.txtCode.value = "";
                                                }
                                            }).bind(this)} 
                                            param={this.param.filter({ELEMENT:'txtCode',USERS:this.user.CODE})} 
                                            >     
                                                <Validator validationGroup={"frmPromo"  + this.tabIndex}>
                                                    <RequiredRule />
                                                </Validator>  
                                            </NdTextBox>  
                                            {/* PROMOSYON SEÇİM POPUP */}
                                            <NdPopGrid id={"pg_txtCode"} parent={this} container={"#root"} 
                                            visible={false}
                                            position={{of:'#root'}} 
                                            showTitle={true} 
                                            showBorders={true}
                                            width={'90%'}
                                            height={'90%'}
                                            title={this.t("pg_Grid.title")} 
                                            data={{source:{select:{query : "SELECT CODE,NAME FROM PROMO_VW_01 GROUP BY CODE,NAME"},sql:this.core.sql}}}
                                            >
                                                <Column dataField="CODE" caption={this.t("pg_Grid.clmCode")} width={150} />
                                                <Column dataField="NAME" caption={this.t("pg_Grid.clmName")} width={650} defaultSortOrder="asc" />
                                            </NdPopGrid>    
                                        </Item>
                                        {/* txtName */}
                                        <Item colSpan={2}>                                    
                                            <Label text={this.t("txtName")} alignment="right" />
                                            <NdTextBox id="txtName" parent={this} simple={true} 
                                            upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                            placeholder={this.t("txtNamePlace")}
                                            dt={{data:this.promo.dt(),field:"NAME"}}
                                            />     
                                        </Item>
                                        {/* dtStartDate */}
                                        <Item>
                                            <Label text={this.t("dtStartDate")} alignment="right" />
                                            <NdDatePicker simple={true}  parent={this} id={"dtStartDate"} 
                                            dt={{data:this.promo.dt(),field:"START_DATE"}}
                                            />
                                        </Item>
                                        {/* dtFinishDate */}
                                        <Item>
                                            <Label text={this.t("dtFinishDate")} alignment="right" />
                                            <NdDatePicker simple={true}  parent={this} id={"dtFinishDate"} 
                                            dt={{data:this.promo.dt(),field:"FINISH_DATE"}}
                                            />
                                        </Item>
                                        {/* cmbDepot */}
                                        <Item>
                                            <Label text={this.t("cmbDepot")} alignment="right" />
                                            <NdSelectBox simple={true} parent={this} id="cmbDepot"
                                            dt={{data:this.promo.dt(),field:"DEPOT_GUID",display:"DEPOT_NAME"}}
                                            displayExpr="DEPOT_NAME"                       
                                            valueExpr="DEPOT_GUID"
                                            data={{source:{select:{query : "SELECT '00000000-0000-0000-0000-000000000000' AS DEPOT_GUID, 'ALL DEPOT' AS DEPOT_NAME UNION ALL SELECT GUID AS DEPOT_GUID,NAME AS DEPOT_NAME FROM DEPOT_VW_01"},sql:this.core.sql}}}
                                            onValueChanged={(e)=>
                                            {
                                            }}
                                            />
                                        </Item>
                                        {/* txtCustomerCode */}
                                        <Item>                                    
                                            <Label text={this.t("txtCustomerCode")} alignment="right" />
                                            <NdTextBox id="txtCustomerCode" parent={this} simple={true} 
                                            upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                            dt={{data:this.promo.dt(),field:"CUSTOMER_CODE"}}
                                            placeholder={this.t("txtCustomerCodePlace")}
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
                                                                    this.promo.dt()[0].CUSTOMER_GUID = data[0].GUID
                                                                    this.txtCustomerCode.value = data[0].CODE;
                                                                    this.txtCustomerName.value = data[0].TITLE;
                                                                }
                                                            }
                                                        }
                                                    }
                                                ]
                                            }
                                            onChange={(async()=>
                                            {
                                                
                                            }).bind(this)} 
                                            >     
                                            </NdTextBox>      
                                            <NdPopGrid id={"pg_txtCustomerCode"} parent={this} container={".dx-multiview-wrapper"} 
                                            position={{of:'#page'}} 
                                            showTitle={true} 
                                            showBorders={true}
                                            width={'90%'}
                                            height={'90%'}
                                            title={this.t("pg_Grid.title")} 
                                            columnAutoWidth={true}
                                            allowColumnResizing={true}
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
                                            <Scrolling mode="standart" />                         
                                            <Column dataField="TITLE" caption={this.t("pg_Grid.clmName")} width={650} defaultSortOrder="asc" />
                                            <Column dataField="CODE" caption={this.t("pg_Grid.clmCode")} width={150} />
                                            </NdPopGrid>
                                        </Item>
                                        {/* txtCustomerName */}
                                        <Item colSpan={2}>                                    
                                            <Label text={this.t("txtCustomerName")} alignment="right" />
                                            <NdTextBox id="txtCustomerName" parent={this} simple={true} readOnly={true}
                                            upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                            dt={{data:this.promo.dt(),field:"CUSTOMER_NAME"}}
                                            />     
                                        </Item>
                                    </GroupItem>
                                </GroupItem>
                                <GroupItem colSpan={3}>
                                    <Item>
                                        <NdListBox id={"lstPromo"} parent={this}
                                        allowItemDeleting={true}
                                        itemDeleteMode={"static"}
                                        selectionMode={"none"}
                                        collapsibleGroups={false}
                                        grouped={true}
                                        height={"100%"}
                                        width={'100%'}
                                        itemRender={this.itemTemplate.bind(this)}
                                        groupRender={this.groupTemplate.bind(this)}
                                        onItemDeleted={(e)=>
                                        {
                                            if(e.itemIndex.group == 0)
                                            {
                                                this.promo.cond.dt().where({WITHAL:e.itemIndex.item}).forEach((item)=>
                                                {
                                                    this.promo.cond.dt().removeAt(item)
                                                })
                                            }
                                            else if(e.itemIndex.group == 1)
                                            {
                                                this.promo.app.dt().where({WITHAL:e.itemIndex.item}).forEach((item)=>
                                                {
                                                    this.promo.app.dt().removeAt(item)
                                                })
                                            }
                                        }}
                                        >
                                        </NdListBox>
                                    </Item>
                                </GroupItem>
                            </Form>
                        </div>
                    </div>                    
                </ScrollView>               
            </div>
        )
    }
}