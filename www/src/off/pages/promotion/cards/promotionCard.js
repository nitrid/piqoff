import React from 'react';
import App from '../../../lib/app.js';
import {promoCls} from '../../../../core/cls/promotion.js'

import ScrollView from 'devextreme-react/scroll-view';
import Toolbar from 'devextreme-react/toolbar';
import Form, { Label,Item,EmptyItem,GroupItem } from 'devextreme-react/form';

import NdTextBox, { Validator,  RequiredRule, RangeRule} from '../../../../core/react/devex/textbox.js'
import NdSelectBox from '../../../../core/react/devex/selectbox.js';
import NdCheckBox from '../../../../core/react/devex/checkbox.js';
import NdPopGrid from '../../../../core/react/devex/popgrid.js';
import NdPopUp from '../../../../core/react/devex/popup.js';
import NdGrid,{Column,Editing, Scrolling} from '../../../../core/react/devex/grid.js';
import NdButton from '../../../../core/react/devex/button.js';
import NdDatePicker from '../../../../core/react/devex/datepicker.js';
import { dialog } from '../../../../core/react/devex/dialog.js';
import NdListBox from '../../../../core/react/devex/listbox.js';
import { datatable } from '../../../../core/core.js';
import { NdForm, NdItem, NdLabel, NdGroupItem, NdEmptyItem } from '../../../../core/react/devex/form.js';
import { NdToast } from '../../../../core/react/devex/toast.js';

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
            setTimeout(async() => 
            {
                this.txtCode.value = this.pagePrm.CODE
                await this.getPromotion(this.pagePrm.CODE);
            }, 1000);
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

        await this.lstPromo.dataRefresh({source:[{id:0,text:this.t('cmbType.promoType01'),items:this.condDt},{id:1,text:this.t('cmbType.promoType02'),items:this.appDt}]});
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
                        height:'auto',
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
                query : `SELECT (SELECT dbo.FN_PRICE(GUID,1,dbo.GETDATE(),@CUSTOMER,'00000000-0000-0000-0000-000000000000',1,0,1)) AS PRICE FROM ITEMS WHERE GUID = @GUID`,
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
            <div className='row' style={{width:"100%"}}>
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
    async getDocs(pType)
    {
        let tmpQuery 
        if(pType == 0)
        {
            tmpQuery = 
            {
                query : `SELECT GUID,CODE,NAME,START_DATE,FINISH_DATE,
                        ISNULL((SELECT TOP 1 COND_ITEM_NAME FROM PROMO_COND_APP_VW_01 WHERE PROMO_COND_APP_VW_01.GUID =PROMO_VW_01.GUID),'') AS ITEM 
                        FROM PROMO_VW_01 WHERE CDATE > dbo.GETDATE() - 30 GROUP BY GUID,CODE,NAME,START_DATE,FINISH_DATE`
            }
        }
        else
        {
            tmpQuery = 
            {
                query : `SELECT GUID,CODE,NAME,START_DATE,FINISH_DATE,
                        ISNULL((SELECT TOP 1 COND_ITEM_NAME FROM PROMO_COND_APP_VW_01 WHERE PROMO_COND_APP_VW_01.GUID =PROMO_VW_01.GUID),'') AS ITEM 
                        FROM PROMO_VW_01 GROUP BY GUID,CODE,NAME,START_DATE,FINISH_DATE`
            }
        }

        let tmpData = await this.core.sql.execute(tmpQuery) 
        let tmpRows = []
        
        if(tmpData.result.recordset.length > 0)
        {
            tmpRows = tmpData.result.recordset
        }

        await this.pg_txtCode.setData(tmpRows)
     
        this.pg_txtCode.show()
        this.pg_txtCode.onClick = (data) =>
        {
            if(data.length > 0)
            {
                this.getPromotion(data[0].CODE)
            }
        }
    }
    itemTemplate(pItem)
    {               
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
                    <div className='col-12 pb-4'>                    
                        <NdForm colCount={3} id={"frmCond"  + this.tabIndex}>
                            {/* cmbPrmType */}
                            <NdItem>
                                <NdLabel text={this.t("cmbPrmType")} alignment="right" />
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
                            </NdItem>
                            <NdEmptyItem />
                            <NdEmptyItem />
                            <NdGroupItem colSpan={3}>
                                <NdGroupItem colCount={3} visible={this.state["prmType" + pItem.WITHAL] == 0 ? true : false}>
                                    {/* txtPrmItem */}
                                    <NdItem>
                                        <NdLabel text={this.t("txtPrmItem")} alignment="right" />
                                        <NdButton text={this.t("btnPrmItem")} type="default" width="100%" 
                                        onClick={()=>
                                        {
                                            this["grdPopItemList" + pItem.WITHAL].dataRefresh({source:this["itemList" + pItem.WITHAL]})
                                            this["pop_PrmItemList" + pItem.WITHAL].show()
                                        }}/>
                                        {/* SEÇİM POPUP */}
                                        <NdPopGrid id={"pg_txtPrmItem" + pItem.WITHAL} parent={this} 
                                        container={"#" + this.props.data.id + this.tabIndex}     
                                        visible={false}
                                        position={{of:'#' + this.props.data.id + this.tabIndex}} 
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
                                                    query : `SELECT MAX(ITEM_GUID) AS GUID,MAX(BARCODE) AS BARCODE,ITEM_CODE AS CODE,
                                                            (SELECT TOP 1 COST_PRICE FROM ITEMS WHERE ITEMS.GUID = MAX(ITEM_GUID)) AS COST_PRICE,
                                                            ITEM_NAME AS NAME,MAIN_GRP_NAME AS MAIN_GRP_NAME, 
                                                            ISNULL(ROUND((SELECT dbo.FN_PRICE(ITEM_GUID,1,dbo.GETDATE(),'00000000-0000-0000-0000-000000000000','00000000-0000-0000-0000-000000000000',1,0,1)),2),0) AS PRICE 
                                                            FROM ITEM_BARCODE_VW_01 WHERE (UPPER(ITEM_CODE) LIKE UPPER(@VAL) OR UPPER(ITEM_NAME) LIKE UPPER(@VAL) OR BARCODE LIKE @VAL) AND STATUS = 1 
                                                            GROUP BY ITEM_CODE,ITEM_NAME,MAIN_GRP_NAME,ITEM_GUID,VAT`,
                                                    param : ['VAL:string|50']
                                                },
                                                sql:this.core.sql
                                            }
                                        }}>
                                            <Column dataField="BARCODE" caption={this.t("pg_Grid.clmBarcode")} width={150} />
                                            <Column dataField="CODE" caption={this.t("pg_Grid.clmCode")} width={150} />
                                            <Column dataField="NAME" caption={this.t("pg_Grid.clmName")} width={650} defaultSortOrder="asc" />
                                            <Column dataField="MAIN_GRP_NAME" caption={this.t("pg_Grid.clmGrpName")} width={150}/>
                                            <Column dataField="COST_PRICE" caption={this.t("pg_Grid.clmCostPrice")} width={100}/>
                                            <Column dataField="PRICE" caption={this.t("pg_Grid.clmPrice")} width={100}/>
                                        </NdPopGrid>
                                        {/* SEÇİM LİSTE POPUP */}
                                        <NdPopUp parent={this} id={"pop_PrmItemList" + pItem.WITHAL} 
                                        container={"#" + this.props.data.id + this.tabIndex}
                                        position={{of:'#' + this.props.data.id + this.tabIndex}}
                                        showCloseButton={false}
                                        showTitle={true}
                                        title={this.t("pg_Grid.title")}
                                        width={'70%'}
                                        height={'90%'}
                                        >
                                            <div className="row pb-1">
                                                <div className='col-12'>
                                                <NdButton text={this.t("pg_Grid.btnItem")} type="default" width="100%" 
                                                onClick={()=>
                                                {
                                                    this["pg_txtPrmItem" + pItem.WITHAL].show()
                                                    this["pg_txtPrmItem" + pItem.WITHAL].onClick = async(data) =>
                                                    {         
                                                        for (let i = 0; i < data.length; i++) 
                                                        {
                                                            if(this["itemList" + pItem.WITHAL].where({ITEM_GUID:data[i].GUID}).length > 0)
                                                            {
                                                                this.toast.show(this.t("msgItemAlert.msg"),'warning')
                                                                return
                                                            }
                                                        }
                                                        
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
                                            <div className="row pb-1" style={{height:"85%"}}>
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
                                                        <Editing mode="cell" allowUpdating={false} allowDeleting={true}/>
                                                        <Scrolling mode="standart" />
                                                        <Column dataField="ITEM_CODE" caption={this.t("pg_Grid.clmCode")} width={100}/>
                                                        <Column dataField="ITEM_NAME" caption={this.t("pg_Grid.clmName")} width={290}/>
                                                        <Column dataField="PRICE" caption={this.t("pg_Grid.clmPrice")} width={100}/>
                                                    </NdGrid>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-6">
                                                <NdButton type="danger" width="100%" icon={"trash"}
                                                onClick={async()=>
                                                {
                                                    let tmpConfObj1 =
                                                    {
                                                        id:'msgDeleteAll',showTitle:true,title:this.t("msgDeleteAll.title"),showCloseButton:true,width:'500px',height:'auto',
                                                        button:[{id:"btn01",caption:this.t("msgDeleteAll.btn01"),location:'before'},{id:"btn02",caption:this.t("msgDeleteAll.btn02"),location:'after'}],
                                                        content:(<div style={{textAlign:"center",fontSize:"20px",color:"green"}}>{this.t("msgDeleteAll.msg")}</div>)
                                                    }

                                                    if((await dialog(tmpConfObj1)) == 'btn01')
                                                    {
                                                        this["itemList" + pItem.WITHAL].removeAll()
                                                    }
                                                }}>
                                                    <i className="text-white fa-solid fa-xmark" style={{fontSize: "24px"}} />
                                                </NdButton>
                                                </div>
                                                <div className="col-6">
                                                    <NdButton type="success" width="100%" icon={"todo"}
                                                    onClick={()=>
                                                    {
                                                        this["pop_PrmItemList" + pItem.WITHAL].hide()
                                                    }}>
                                                        <i className="text-white fa-solid fa-xmark" style={{fontSize: "24px"}} />
                                                    </NdButton>
                                                </div>
                                            </div>
                                        </NdPopUp>
                                    </NdItem>
                                    {/* txtPrmQuantity */}  
                                    <NdItem>                                                                    
                                        <NdLabel text={this.t("txtPrmQuantity")} alignment="right" />
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
                                                        id:'msgSave',showTitle:true,title:this.t("msgHelp.title"),showCloseButton:true,width:'550px',height:'auto',
                                                        content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgHelp.condItemQuantity")}</div>)
                                                    }
                                                    await dialog(tmpConfObj);
                                                }
                                            }
                                        ]}>
                                            <Validator validationGroup={"frmPromo"  + this.tabIndex}>
                                                <RequiredRule message={this.t("validation.txtPrmQuantityValid")} />
                                                <RangeRule min={0} message={this.t("validation.txtPrmQuantityMinValid")}/>
                                            </Validator> 
                                        </NdTextBox>     
                                    </NdItem>
                                    {/* txtPrmAmount */}  
                                    <NdItem>                                                                    
                                        <NdLabel text={this.t("txtPrmAmount")} alignment="right" />
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
                                                        id:'msgSave',showTitle:true,title:this.t("msgHelp.title"),showCloseButton:true,width:'550px',height:'auto',
                                                        content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgHelp.condItemAmount")}</div>)
                                                    }
                                                    await dialog(tmpConfObj);
                                                }
                                            }
                                        ]}/>     
                                    </NdItem>
                                </NdGroupItem>
                                <NdGroupItem colCount={3} visible={this.state["prmType" + pItem.WITHAL] == 1 ? true : false}>
                                    {/* txtPrmAmount */}  
                                    <NdItem>                                                                    
                                        <NdLabel text={this.t("txtPrmAmount")} alignment="right" />
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
                                                        id:'msgSave',showTitle:true,title:this.t("msgHelp.title"),showCloseButton:true,width:'550px',height:'auto',
                                                        content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgHelp.condGeneralAmount")}</div>)
                                                    }
                                                    await dialog(tmpConfObj);
                                                }
                                            }
                                        ]}/>     
                                    </NdItem> 
                                    <NdEmptyItem /> 
                                    <NdEmptyItem /> 
                                </NdGroupItem>
                            </NdGroupItem>
                        </NdForm>
                    </div>
                </div>            
            )
        }
        else if(pItem.SECTOR == 'APP')
        {
            this.state["rstType" + pItem.WITHAL] = pItem.TYPE
            
            return(
                <div className='row'>
                    <div className='col-12 pb-4'>
                        <NdForm colCount={3} id={"frmApp"  + this.tabIndex}>
                            {/* cmbRstType */}
                            <NdItem>
                                <NdLabel text={this.t("cmbRstType")} alignment="right" />
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
                            </NdItem>                                
                            <NdEmptyItem/>
                            <NdEmptyItem/>
                            <NdGroupItem colSpan={3}>
                                {/* İskonto Oran */}
                                <NdGroupItem colCount={3} visible={this.state["rstType" + pItem.WITHAL] == 0 || this.state["rstType" + pItem.WITHAL] == 5 ? true : false}>
                                    {/* txtRstDiscount */}
                                    <NdItem>
                                        <NdLabel text={this.t("txtRstQuantity")} alignment="right" />
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
                                                            id:'msgSave',showTitle:true,title:this.t("msgHelp.title"),showCloseButton:true,width:'550px',height:'auto',
                                                            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgHelp.appDiscRate")}</div>)
                                                        }
                                                    }
                                                    else if(this.state["rstType" + pItem.WITHAL] == 5)
                                                    {
                                                        tmpConfObj =
                                                        {
                                                            id:'msgSave',showTitle:true,title:this.t("msgHelp.title"),showCloseButton:true,width:'550px',height:'auto',
                                                            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgHelp.appDiscAmount")}</div>)
                                                        }
                                                    }
                                                    await dialog(tmpConfObj);
                                                }
                                            }
                                        ]}/>
                                    </NdItem>
                                    <NdEmptyItem/>
                                    <NdEmptyItem/>
                                </NdGroupItem>
                                {/* Puan - Hediye Çeki - Genel İskonto */}
                                <NdGroupItem colCount={3} visible={this.state["rstType" + pItem.WITHAL] == 1 || this.state["rstType" + pItem.WITHAL] == 2 || this.state["rstType" + pItem.WITHAL] == 4 ? true : false}>
                                    {/* txtRstPointGift */}
                                    <NdItem>
                                        <NdLabel text={this.t("txtRstQuantity")} alignment="right" />
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
                                                            id:'msgSave',showTitle:true,title:this.t("msgHelp.title"),showCloseButton:true,width:'550px',height:'300px',
                                                            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgHelp.appPoint")}</div>)
                                                        }
                                                    }
                                                    else if(this.state["rstType" + pItem.WITHAL] == 2)
                                                    {
                                                        tmpConfObj =
                                                        {
                                                            id:'msgSave',showTitle:true,title:this.t("msgHelp.title"),showCloseButton:true,width:'550px',height:'auto',
                                                            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgHelp.appGiftCheck")}</div>)
                                                        }
                                                    }
                                                    else if(this.state["rstType" + pItem.WITHAL] == 4)
                                                    {
                                                        tmpConfObj =
                                                        {
                                                            id:'msgSave',showTitle:true,title:this.t("msgHelp.title"),showCloseButton:true,width:'550px',height:'auto',
                                                            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgHelp.appGeneralAmount")}</div>)
                                                        }
                                                    }
                                                    await dialog(tmpConfObj);
                                                }
                                            }
                                        ]}/>
                                    </NdItem>
                                    <NdEmptyItem/>
                                    <NdEmptyItem/>
                                </NdGroupItem>
                                {/* Ürün İskonto */}
                                <NdGroupItem colCount={3} visible={this.state["rstType" + pItem.WITHAL] == 3 ? true : false}>
                                    {/* txtRstItem */}                                
                                    <NdItem>
                                        <NdLabel text={this.t("txtRstItem")} alignment="right" />
                                        <NdTextBox id={"txtRstItem" + pItem.WITHAL} parent={this} simple={true} readOnly={true}
                                        upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                        value={pItem.ITEM_CODE}
                                        displayValue={pItem.ITEM_NAME}
                                        placeholder={this.t("txtRstItemPlace")}
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
                                        <NdPopGrid id={"pg_txtRstItem" + pItem.WITHAL} parent={this}    
                                        container={"#" + this.props.data.id + this.tabIndex} 
                                        visible={false}
                                        position={{of:'#' + this.props.data.id + this.tabIndex}} 
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
                                                    query : `SELECT MAX(ITEM_GUID) AS GUID,MAX(BARCODE) AS BARCODE,ITEM_CODE AS CODE,ITEM_NAME AS NAME, 
                                                            MAIN_GRP_NAME AS MAIN_GRP_NAME FROM ITEM_BARCODE_VW_01 
                                                            WHERE (UPPER(ITEM_CODE) LIKE UPPER (@VAL) OR UPPER(ITEM_NAME) LIKE UPPER(@VAL) OR 
                                                            BARCODE LIKE @VAL) AND STATUS = 1 
                                                            GROUP BY ITEM_CODE,ITEM_NAME,MAIN_GRP_NAME`,
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
                                    </NdItem>     
                                    {/* txtRstItemQuantity */}  
                                    <NdItem>                                                                    
                                        <NdLabel text={this.t("txtRstItemQuantity")} alignment="right" />
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
                                                        id:'msgSave',showTitle:true,title:this.t("msgHelp.title"),showCloseButton:true,width:'550px',height:'auto',
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
                                    </NdItem> 
                                    {/* txtRstItemAmount */}  
                                    <NdItem>                                                                    
                                        <NdLabel text={this.t("txtRstItemAmount")} alignment="right" />
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
                                                        id:'msgSave',showTitle:true,title:this.t("msgHelp.title"),showCloseButton:true,width:'550px',height:'auto',
                                                        content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgHelp.appItemAmount")}</div>)
                                                    }
                                                    await dialog(tmpConfObj);
                                                }
                                            }
                                        ]}/>     
                                    </NdItem>
                                </NdGroupItem>
                            </NdGroupItem>
                        </NdForm>
                        {/* ISKONTO POPUP */}
                        <div>
                            <NdPopUp parent={this} id={"popDiscount" + pItem.WITHAL} 
                            container={"#" + this.props.data.id + this.tabIndex}
                            position={{of:'#' + this.props.data.id + this.tabIndex}}
                            showCloseButton={true}
                            showTitle={true}
                            title={this.t("popDiscount.title")}
                            width={'350'}
                            height={'auto'}
                            >
                                <div className='row'>
                                    <div className='col-12'>
                                        <h5 className='text-center'>{this.state.discPrice}</h5>
                                    </div>
                                </div>
                                <div className='row'>
                                    <NdForm colCount={1} style={{padding:"0px 20px"}}>
                                        <NdItem>
                                            <NdLabel text={this.t("popDiscount.txtDiscRate")} alignment="right" />
                                            <NdTextBox id={"txtDiscRate" + pItem.WITHAL} parent={this} simple={true} 
                                            onValueChanged={async(e)=>
                                            {
                                                if(this["txtDiscAmount" + pItem.WITHAL].isFocused)
                                                {
                                                    return
                                                }

                                                if(e.value >= 0 && e.value <= 100)
                                                {
                                                    this["txtDiscAmount" + pItem.WITHAL].value = Number(this.state.discPrice - Number(this.state.discPrice).rateInc(e.value,2)).toFixed(2)
                                                }
                                                else
                                                {
                                                    this["txtDiscAmount" + pItem.WITHAL].value = 0;
                                                    this["txtDiscRate" + pItem.WITHAL].value = 0;
                                                    this.toast.show(this.t("msgDiscRate.msg"),'warning')
                                                }                                                
                                            }}/>
                                        </NdItem>
                                        <NdItem>
                                            <NdLabel text={this.t("popDiscount.txtDiscAmount")} alignment="right" />
                                            <NdTextBox id={"txtDiscAmount" + pItem.WITHAL} parent={this} simple={true}
                                            onValueChanged={async(e)=>
                                            { 
                                                if(this["txtDiscRate" + pItem.WITHAL].isFocused)
                                                {
                                                    return
                                                }

                                                if(Number(100 - Number(this.state.discPrice).rate2Num(Number(e.value.replace(",",".")),2)) >= 0 && Number(100 - Number(this.state.discPrice).rate2Num(Number(e.value.replace(",",".")),2)) <= 100)
                                                {
                                                    this["txtDiscRate" + pItem.WITHAL].value = Number(100 - Number(this.state.discPrice).rate2Num(e.value.replace(",","."),2)).toFixed(2)
                                                }
                                                else
                                                {
                                                    this["txtDiscAmount" + pItem.WITHAL].value = 0;
                                                    this["txtDiscRate" + pItem.WITHAL].value = 0;
                                                    this.toast.show(this.t("msgDiscRate.msg"),'warning')
                                                }
                                            }}/>
                                        </NdItem>
                                        <NdItem>
                                            <NdButton id={"btnDiscSave" + pItem.WITHAL} parent={this} text={this.t("popDiscount.btnSave")} type="success" width={'100%'}
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
                                                    this["txtRstQuantity" + pItem.WITHAL].value = Number(this["txtDiscAmount" + pItem.WITHAL].value)
                                                    this.appDt.where({WITHAL:pItem.WITHAL})[0].AMOUNT = Number(this["txtDiscAmount" + pItem.WITHAL].value)
                                                }
                                                
                                                this["popDiscount" + pItem.WITHAL].hide()
                                            }}/>
                                        </NdItem>
                                    </NdForm>
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
            <div id={this.props.data.id + this.tabIndex}>
                <ScrollView>
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <Toolbar>
                                <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnNew" parent={this} icon="file" type="default"
                                    onClick={async (e)=>
                                    {
                                        let tmpConfObj =
                                        {
                                            id:'msgNewPage',showTitle:true,title:this.t("msgNewPage.title"),showCloseButton:true,width:'500px',height:'auto',
                                            button:[{id:"btn01",caption:this.t("msgNewPage.btn01"),location:'before'},{id:"btn02",caption:this.t("msgNewPage.btn02"),location:'after'}],
                                            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgNewPage.msg")}</div>)
                                        }

                                        let pResult = await dialog(tmpConfObj);
                                        
                                        if(pResult == 'btn01')
                                        {    
                                            this.init();
                                        } 
                                    }}/>
                                </Item>
                                <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnSave" parent={this} icon="floppy" type="success" validationGroup={"frmPromo"  + this.tabIndex}
                                    onClick={async (e)=>
                                    {
                                        if(this.condDt[0].AMOUNT == 0 && this.condDt[0].QUANTITY == 0)
                                        {
                                            this.toast.show({message:this.t("msgQuantityOrAmount.msg"),type:"warning"})
                                            return
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

                                                this.promo.cond.dt()._deleteList = this["itemList" + this.condDt[0].WITHAL]._deleteList
                                                await this.core.util.waitUntil(0)
                                                
                                                if((await this.promo.save()) == 0)
                                                {                                                    
                                                    this.getPromotion(this.txtCode.value)
                                                    this.toast.show({message:this.t("msgSaveResult.msgSuccess"),type:"success"})
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
                                            this.promo.dt().removeAt(0)
                                            await this.promo.dt().delete();
                                            this.toast.show({message:this.t("msgDeleteResult.msgSuccess"),type:"success"})
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
                    <div className="row px-2 pt-2"> 
                        <div className="col-12">
                            <NdForm colCount={3} id={"frmPromo"  + this.tabIndex}>
                                <NdGroupItem colSpan={3}>
                                    <NdGroupItem colCount={3}>
                                        {/* txtCode */}
                                        <NdItem>                                    
                                            <NdLabel text={this.t("txtCode")} alignment="right" />
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
                                                           this.getDocs(0)
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
                                            <NdPopGrid id={"pg_txtCode"} parent={this} 
                                            container={"#" + this.props.data.id + this.tabIndex} 
                                            visible={false}
                                            position={{of:'#' + this.props.data.id + this.tabIndex}} 
                                            showTitle={true} 
                                            showBorders={true}
                                            width={'90%'}
                                            height={'90%'}
                                            title={this.t("pg_Grid.title")} 
                                            button=
                                            {
                                                [
                                                    {
                                                        id:'01',
                                                        icon:'more',
                                                        onClick:()=>
                                                        {
                                                            this.getDocs(1)
                                                        }
                                                    }
                                                ]
                                            }
                                            >
                                                <Column dataField="CODE" caption={this.t("pg_Grid.clmCode")} width={150} />
                                                <Column dataField="NAME" caption={this.t("pg_Grid.clmName")} width={350}  />
                                                <Column dataField="START_DATE" caption={this.t("pg_Grid.clmStartDate")} width={150} dataType="datetime" format={"dd/MM/yyyy"} defaultSortOrder="asc"/>
                                                <Column dataField="FINISH_DATE" caption={this.t("pg_Grid.clmFinishDate")} width={150} dataType="datetime" format={"dd/MM/yyyy"}/>
                                                <Column dataField="ITEM" caption={this.t("pg_Grid.clmItem")} width={350} defaultSortOrder="asc" />
                                            </NdPopGrid>    
                                        </NdItem>
                                        {/* txtName */}
                                        <NdItem colSpan={2}>                                    
                                            <NdLabel text={this.t("txtName")} alignment="right" />
                                            <NdTextBox id="txtName" parent={this} simple={true} 
                                            upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                            placeholder={this.t("txtNamePlace")}
                                            dt={{data:this.promo.dt(),field:"NAME"}}
                                            />     
                                        </NdItem>
                                        {/* dtStartDate */}
                                        <NdItem>
                                            <NdLabel text={this.t("dtStartDate")} alignment="right" />
                                            <NdDatePicker simple={true}  parent={this} id={"dtStartDate"} dt={{data:this.promo.dt(),field:"START_DATE"}}/>
                                        </NdItem>
                                        {/* dtFinishDate */}
                                        <NdItem>
                                            <NdLabel text={this.t("dtFinishDate")} alignment="right" />
                                            <NdDatePicker simple={true}  parent={this} id={"dtFinishDate"} dt={{data:this.promo.dt(),field:"FINISH_DATE"}}/>
                                        </NdItem>
                                        {/* cmbDepot */}
                                        <NdItem>
                                            <NdLabel text={this.t("cmbDepot")} alignment="right" />
                                            <NdSelectBox simple={true} parent={this} id="cmbDepot"
                                            dt={{data:this.promo.dt(),field:"DEPOT_GUID",display:"DEPOT_NAME"}}
                                            displayExpr="DEPOT_NAME"                       
                                            valueExpr="DEPOT_GUID"
                                            data=
                                            {{
                                                source:
                                                {
                                                    select:
                                                    {
                                                        query:  `SELECT '00000000-0000-0000-0000-000000000000' AS DEPOT_GUID, 'ALL DEPOT' AS DEPOT_NAME 
                                                                UNION ALL SELECT GUID AS DEPOT_GUID,NAME AS DEPOT_NAME FROM DEPOT_VW_01`
                                                    },
                                                    sql:this.core.sql
                                                }
                                            }}
                                            />
                                        </NdItem>
                                        {/* txtCustomerCode */}
                                        <NdItem>                                    
                                            <NdLabel text={this.t("txtCustomerCode")} alignment="right" />
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
                                            />     
                                            <NdPopGrid id={"pg_txtCustomerCode"} parent={this} 
                                            container={"#" + this.props.data.id + this.tabIndex} 
                                            position={{of:'#' + this.props.data.id + this.tabIndex}} 
                                            showTitle={true} 
                                            showBorders={true}
                                            width={'75%'}
                                            height={'75%'}
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
                                                        query : `SELECT GUID,CODE,TITLE,NAME,LAST_NAME,[TYPE_NAME],[GENUS_NAME] FROM CUSTOMER_VW_01 
                                                                WHERE (UPPER(CODE) LIKE UPPER(@VAL) OR UPPER(TITLE) LIKE UPPER(@VAL)) AND STATUS = 1`,
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
                                        </NdItem>
                                        {/* txtCustomerName */}
                                        <NdItem colSpan={2}>                                    
                                            <NdLabel text={this.t("txtCustomerName")} alignment="right" />
                                            <NdTextBox id="txtCustomerName" parent={this} simple={true} readOnly={true}
                                            upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                            dt={{data:this.promo.dt(),field:"CUSTOMER_NAME"}}
                                            />     
                                        </NdItem>
                                        <NdItem>
                                            <NdLabel text={this.t("chkLoyalty")} alignment="right" />
                                            <NdCheckBox id="chkLoyalty" parent={this} simple={true} value={false} dt={{data:this.promo.dt(),field:"LOYALTY"}}/>
                                        </NdItem>
                                    </NdGroupItem>
                                </NdGroupItem>
                                <NdGroupItem colSpan={3}>
                                    <NdItem>
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
                                        />
                                    </NdItem>
                                </NdGroupItem>
                            </NdForm>
                        </div>
                    </div>                    
                </ScrollView>
                <NdToast id="toast" parent={this} displayTime={2000} position={{at:"top center",offset:'0px 110px'}}/>               
            </div>
        )
    }
}