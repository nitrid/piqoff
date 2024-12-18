import React from 'react';
import App from '../../../lib/app.js';
import {discountCls} from '../../../../core/cls/discount.js'
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

export default class discountCard extends React.PureComponent
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

        this.discount = new discountCls();
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
            this.txtCode.value = this.pagePrm.CODE
            await this.getDiscount(this.pagePrm.CODE);
        }
    }
    async init()
    {

    }
    async getDiscount(pCode)
    {
        this.condDt.clear();
        this.appDt.clear();

        this.discount.clearAll();
        
        await this.discount.load({CODE:pCode});
        
        if(this.discount.cond.dt().length == 0)
        {
            this.discount.cond.addEmpty();
        }
        if(this.discount.app.dt().length == 0)
        {
            this.discount.app.addEmpty();
        }

        this.condDt.import(this.discount.cond.dt().groupBy('WITHAL').toArray())
        this.appDt.import(this.discount.app.dt().groupBy('WITHAL').toArray())
        
        this.cmbPrmType.value = this.condDt.where({TYPE:{'IN':[0,1]}}).length > 0 ? this.condDt.where({TYPE:{'IN':[0,1]}})[0].TYPE : 0;
        this.cmbPrmType2.value = this.appDt.where({TYPE:{'IN':[10,11]}}).length > 0 ? this.appDt.where({TYPE:{'IN':[10,11]}})[0].TYPE : 0;
        
        console.log(this.condDt)
        this.setState({discPrice : 0})
        
        await this.core.util.waitUntil(0);
    }
    async checkDiscount(pCode)
    {
        return new Promise(async resolve => 
        {            
            if(pCode !== '')
            {
                let tmpData = await new discountCls().load({CODE:pCode});
    
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
                        this.getDiscount(pCode)
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
    async getDocs(pType)
    {
        let tmpQuery 
        if(pType == 0)
        {
            tmpQuery = 
            {
                query : "SELECT GUID,CODE,NAME,START_DATE,FINISH_DATE FROM DISCOUNT_VW_01 WHERE CDATE > dbo.GETDATE() - 30 GROUP BY GUID,CODE,NAME,START_DATE,FINISH_DATE "
            }
        }
        else
        {
            tmpQuery = 
            {
                query : "SELECT GUID,CODE,NAME,START_DATE,FINISH_DATE FROM DISCOUNT_VW_01 GROUP BY GUID,CODE,NAME,START_DATE,FINISH_DATE "
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
                this.getDiscount(data[0].CODE)
            }
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
                                    <NdButton id="btnSave" parent={this} icon="floppy" type="success" validationGroup={"frmDiscount"  + this.tabIndex}
                                    onClick={async (e)=>
                                    {
                                        if(this.condDt[0].AMOUNT == 0 && this.condDt[0].QUANTITY == 0)
                                        {
                                            let tmpConfObj =
                                            {
                                                id:'msgQuantityOrAmount',showTitle:true,title:this.t("msgQuantityOrAmount.title"),showCloseButton:true,width:'500px',height:'200px',
                                                button:[{id:"btn01",caption:this.t("msgQuantityOrAmount.btn01"),location:'after'}],
                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgQuantityOrAmount.msg")}</div>)
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
                                                
                                                this.condDt.forEach((item)=>
                                                {
                                                    if(item.TYPE == 0)
                                                    {
                                                        if(this["itemList" + item.WITHAL].length > 0)
                                                        {
                                                            this["itemList" + item.WITHAL].forEach((list)=>
                                                            {
                                                                let tmpCond = this.discount.cond.dt().where({GUID:list.GUID}).where({ITEM_GUID:list.ITEM_GUID})
                                                                
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
                                                                    let tmpEmpty = {...this.discount.cond.empty}

                                                                    tmpEmpty.PROMO = this.discount.dt()[0].GUID
                                                                    tmpEmpty.ITEM_GUID = list.ITEM_GUID
                                                                    tmpEmpty.ITEM_CODE = list.ITEM_CODE
                                                                    tmpEmpty.ITEM_NAME = list.ITEM_NAME
                                                                    tmpEmpty.TYPE = item.TYPE
                                                                    tmpEmpty.QUANTITY = item.QUANTITY
                                                                    tmpEmpty.AMOUNT = item.AMOUNT
                                                                    tmpEmpty.WITHAL = item.WITHAL
                                                                    
                                                                    this.discount.cond.addEmpty(tmpEmpty)
                                                                }
                                                            })
                                                        }
                                                    }
                                                    else if(item.TYPE == 1)
                                                    {
                                                        let tmpCond = this.discount.cond.dt().where({GUID:item.GUID})
                                                        
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
                                                            let tmpEmpty = {...this.discount.cond.empty}
                                                            tmpEmpty.PROMO = this.discount.dt()[0].GUID
                                                            tmpEmpty.ITEM_GUID = '00000000-0000-0000-0000-000000000000'
                                                            tmpEmpty.ITEM_CODE = ''
                                                            tmpEmpty.ITEM_NAME = ''
                                                            tmpEmpty.TYPE = item.TYPE
                                                            tmpEmpty.QUANTITY = item.QUANTITY
                                                            tmpEmpty.AMOUNT = item.AMOUNT
                                                            tmpEmpty.WITHAL = item.WITHAL
                                                            
                                                            this.discount.cond.addEmpty(tmpEmpty)
                                                        }
                                                    }
                                                })

                                                this.appDt.forEach((item)=>
                                                {
                                                    let tmpApp = this.discount.app.dt().where({GUID:item.GUID})

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
                                                        let tmpEmpty = {...this.discount.app.empty}

                                                        tmpEmpty.PROMO = this.discount.dt()[0].GUID
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
                                                        
                                                        this.discount.app.addEmpty(tmpEmpty)
                                                    }
                                                })

                                                this.discount.cond.dt()._deleteList = this["itemList" + this.condDt[0].WITHAL]._deleteList
                                                console.log(this["itemList" + this.condDt[0].WITHAL]._deleteList)
                                                await this.core.util.waitUntil(0)
                                                
                                                if((await this.discount.save()) == 0)
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
                                            this.discount.dt().removeAt(0)
                                            await this.discount.dt().delete();
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
                            <Form colCount={3} id={"frmDiscount"  + this.tabIndex}>
                                <GroupItem colSpan={3}>
                                    <GroupItem colCount={3}>
                                        {/* txtCode */}
                                        <Item>                                    
                                            <Label text={this.t("txtCode")} alignment="right" />
                                            <NdTextBox id="txtCode" parent={this} simple={true} tabIndex={this.tabIndex} 
                                            upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                            dt={{data:this.discount.dt(),field:"CODE"}}
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
                                                let tmpResult = await this.checkDiscount(this.txtCode.value)
                                                if(tmpResult == 3)
                                                {
                                                    this.txtCode.value = "";
                                                }
                                            }).bind(this)} 
                                            param={this.param.filter({ELEMENT:'txtCode',USERS:this.user.CODE})} 
                                            >     
                                                <Validator validationGroup={"frmDiscount"  + this.tabIndex}>
                                                    <RequiredRule />
                                                </Validator>  
                                            </NdTextBox>  
                                            {/* INDIRIM SEÇİM POPUP */}
                                            <NdPopGrid id={"pg_txtCode"} parent={this} container={"#root"} 
                                            visible={false}
                                            position={{of:'#root'}} 
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
                                            </NdPopGrid>    
                                        </Item>
                                        {/* txtName */}
                                        <Item colSpan={2}>                                    
                                            <Label text={this.t("txtName")} alignment="right" />
                                            <NdTextBox id="txtName" parent={this} simple={true} 
                                            upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                            placeholder={this.t("txtNamePlace")}
                                            dt={{data:this.discount.dt(),field:"NAME"}}
                                            />     
                                        </Item>
                                        {/* dtStartDate */}
                                        <Item>
                                            <Label text={this.t("dtStartDate")} alignment="right" />
                                            <NdDatePicker simple={true}  parent={this} id={"dtStartDate"} dt={{data:this.discount.dt(),field:"START_DATE"}}/>
                                        </Item>
                                        {/* dtFinishDate */}
                                        <Item>
                                            <Label text={this.t("dtFinishDate")} alignment="right" />
                                            <NdDatePicker simple={true}  parent={this} id={"dtFinishDate"} dt={{data:this.discount.dt(),field:"FINISH_DATE"}}/>
                                        </Item>
                                        {/* cmbDepot */}
                                        <Item>
                                            <Label text={this.t("cmbDepot")} alignment="right" />
                                            <NdSelectBox simple={true} parent={this} id="cmbDepot"
                                            dt={{data:this.discount.dt(),field:"DEPOT_GUID",display:"DEPOT_NAME"}}
                                            displayExpr="DEPOT_NAME"                       
                                            valueExpr="DEPOT_GUID"
                                            data={{source:{select:{query : "SELECT '00000000-0000-0000-0000-000000000000' AS DEPOT_GUID, 'ALL DEPOT' AS DEPOT_NAME UNION ALL SELECT GUID AS DEPOT_GUID,NAME AS DEPOT_NAME FROM DEPOT_VW_01"},sql:this.core.sql}}}
                                            onValueChanged={(e)=>
                                            {
                                            }}
                                            />
                                        </Item> 
                                        {/* cmbType */}
                                        <Item>
                                            <Label text={this.t("cmbPrmType")} alignment="right" />
                                            <NdSelectBox simple={true} parent={this} id={"cmbPrmType"}
                                            displayExpr="NAME"                       
                                            valueExpr="ID"
                                            data={{source:[{ID:0,NAME:this.t("cmbType.customer")},{ID:1,NAME:this.t("cmbType.customerGroup")}]}}
                                            onValueChanged={(e)=>
                                            {
                                            
                                            }}
                                            />
                                        </Item>
                                        <EmptyItem />
                                        <EmptyItem />
                                        {/* txtPrmCustomer */}
                                        <Item>
                                            <Label text={this.t("txtPrmCustomer")} alignment="right" />
                                            <NdButton text={this.t("btnPrmCustomer")} type="default" width="100%" 
                                            onClick={()=>
                                            {
                                                this.grdPopCustomerList.dataRefresh({source:this.condDt.where({TYPE:{'IN':[0,1]}})})
                                                this.popPrmCustomerList.show()
                                            }}></NdButton> 
                                            {/* SEÇİM POPUP */}
                                            <NdPopGrid id={"popPrmCustomer"} parent={this} container={"#root"} 
                                            visible={false}
                                            position={{of:'#root'}} 
                                            showTitle={true} 
                                            showBorders={true}
                                            width={'90%'}
                                            height={'90%'}
                                            title={this.t("pg_Grid.title")} 
                                            search={true}
                                            >
                                                <Column dataField="CODE" caption={this.t("pg_Grid.clmCode")} width={150} />
                                                <Column dataField="NAME" caption={this.t("pg_Grid.clmName")} width={650} defaultSortOrder="asc" />
                                            </NdPopGrid>
                                            {/* SEÇİM LİSTE POPUP */}
                                            <NdPopUp parent={this} id={"popPrmCustomerList"} container={"#root"}
                                            position={{of:'#root'}}
                                            showCloseButton={false}
                                            showTitle={true}
                                            title={this.t("pg_Grid.title")}
                                            width={'70%'}
                                            height={'90%'}
                                            >
                                                <div className="row pb-1">
                                                    <div className='col-12'>
                                                    <NdButton text={this.t("pg_Grid.btnCustomer")} type="default" width="100%" 
                                                    onClick={async()=>
                                                    {
                                                        if(this["cmbPrmType"].value == 0)
                                                        {
                                                            this.popPrmCustomer.setSource(
                                                            {
                                                                source:
                                                                {
                                                                    select:
                                                                    {
                                                                        query : "SELECT CODE,TITLE AS NAME FROM CUSTOMER_VW_01 WHERE (UPPER(CODE) LIKE UPPER(@VAL) OR UPPER(NAME) LIKE UPPER(@VAL)) AND STATUS = 1",
                                                                        param : ['VAL:string|50']
                                                                    },
                                                                    sql:this.core.sql
                                                                }
                                                            })
                                                        }
                                                        else
                                                        {
                                                            this.popPrmCustomer.setSource(
                                                            {
                                                                source:
                                                                {
                                                                    select:
                                                                    {
                                                                        query : "SELECT CODE,NAME FROM CUSTOMER_GROUP_VW_01 WHERE (UPPER(CODE) LIKE UPPER(@VAL) OR UPPER(NAME) LIKE UPPER(@VAL))",
                                                                        param : ['VAL:string|50']
                                                                    },
                                                                    sql:this.core.sql
                                                                }
                                                            })
                                                        }

                                                        this.popPrmCustomer.show()
                                                        this.popPrmCustomer.onClick = async(data) =>
                                                        {         
                                                            for (let i = 0; i < data.length; i++) 
                                                            {
                                                                if(this.condDt.where({LINK_GUID:data[i].GUID}).length > 0)
                                                                {
                                                                    let tmpConfObj =
                                                                    {
                                                                        id:'msgItemAlert',showTitle:true,title:this.t("msgItemAlert.title"),showCloseButton:true,width:'500px',height:'200px',
                                                                        button:[{id:"btn01",caption:this.t("msgItemAlert.btn01"),location:'after'}],
                                                                        content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgItemAlert.msg")}</div>)
                                                                    }
                                                                    await dialog(tmpConfObj)
                                                                    return
                                                                }
                                                            }
                                                            
                                                            for (let i = 0; i < data.length; i++) 
                                                            {
                                                                let tmpData = {...this.discount.cond.empty}

                                                                tmpData.GUID = datatable.uuidv4();
                                                                tmpData.TYPE = this.cmbPrmType.value;
                                                                tmpData.LINK_GUID = data[i].GUID;
                                                                tmpData.LINK_CODE = data[i].CODE;
                                                                tmpData.LINK_NAME = data[i].NAME;
                                                                tmpData.DISCOUNT = this.discount.dt()[0].GUID
                                                                tmpData.WITHAL = 0;

                                                                this.condDt.push(tmpData);
                                                            }

                                                            this.grdPopCustomerList.dataRefresh({source:this.condDt.where({TYPE:{'IN':[0,1]}})})
                                                        }
                                                    }}></NdButton> 
                                                    </div>
                                                </div>
                                                {/* grdPopGridList */}
                                                <div className="row pb-1" style={{height:"85%"}}>
                                                    <div className="col-12">
                                                        <NdGrid parent={this} id={"grdPopCustomerList"} 
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
                                                            <Column dataField="LINK_CODE" caption={this.t("pg_Grid.clmCode")} width={100}/>
                                                            <Column dataField="LINK_NAME" caption={this.t("pg_Grid.clmName")} width={290}/>
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
                                                            id:'msgDeleteAll',showTitle:true,title:this.t("msgDeleteAll.title"),showCloseButton:true,width:'500px',height:'200px',
                                                            button:[{id:"btn01",caption:this.t("msgDeleteAll.btn01"),location:'before'},{id:"btn02",caption:this.t("msgDeleteAll.btn02"),location:'after'}],
                                                            content:(<div style={{textAlign:"center",fontSize:"20px",color:"green"}}>{this.t("msgDeleteAll.msg")}</div>)
                                                        }
                                                        if((await dialog(tmpConfObj1)) == 'btn01')
                                                        {
                                                            this.condDt.where({TYPE:{'IN':[0,1]}}).removeAll()
                                                            this.grdPopCustomerList.dataRefresh({source:this.condDt.where({TYPE:{'IN':[0,1]}})})
                                                        }
                                                    }}>
                                                        <i className="text-white fa-solid fa-xmark" style={{fontSize: "24px"}} />
                                                    </NdButton>
                                                    </div>
                                                    <div className="col-6">
                                                        <NdButton type="success" width="100%" icon={"todo"}
                                                        onClick={()=>
                                                        {
                                                            this.popPrmCustomerList.hide()
                                                        }}>
                                                            <i className="text-white fa-solid fa-xmark" style={{fontSize: "24px"}} />
                                                        </NdButton>
                                                    </div>
                                                </div>
                                            </NdPopUp>
                                        </Item>
                                    </GroupItem>
                                    <EmptyItem />
                                    <EmptyItem />
                                    <GroupItem colCount={3}>
                                        {/* cmbPrmType ürün için*/}
                                        <Item>
                                            <Label text={this.t("cmbPrmType2")} alignment="right" />
                                            <NdSelectBox simple={true} parent={this} id={"cmbPrmType2"}
                                            displayExpr="NAME"                       
                                            valueExpr="ID"
                                            data={{source:[{ID:0,NAME:this.t("cmbType2.item")},{ID:1,NAME:this.t("cmbType2.generalAmount")}]}}
                                            onValueChanged={(e)=>
                                            {
                                            
                                            }}
                                            />
                                        </Item>
                                        <EmptyItem />
                                       <EmptyItem />
                                        {/* txtPrmItem */}
                                        <Item>
                                            <Label text={this.t("txtPrmItem2")} alignment="right" />
                                            <NdButton text={this.t("btnPrmItem2")} type="default" width="100%" 
                                            onClick={()=>
                                            {
                                                this["grdPopCustomerList"].dataRefresh({source:this["itemList"]})
                                                this["pop_PrmItemList"].show()
                                            }}></NdButton> 
                                            {/* SEÇİM POPUP */}
                                            <NdPopGrid id={"pg_txtPrmItem"} parent={this} container={"#root"} 
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
                                                        query : "SELECT MAX(ITEM_GUID) AS GUID,MAX(BARCODE) AS BARCODE,ITEM_CODE AS CODE,(SELECT TOP 1 COST_PRICE FROM ITEMS WHERE ITEMS.GUID = MAX(ITEM_GUID)) AS COST_PRICE,ITEM_NAME AS NAME,MAIN_GRP_NAME AS MAIN_GRP_NAME, " + 
                                                                "ISNULL(ROUND((SELECT dbo.FN_PRICE(ITEM_GUID,1,dbo.GETDATE(),'00000000-0000-0000-0000-000000000000','00000000-0000-0000-0000-000000000000',1,0,1)),2),0) AS PRICE " + 
                                                                "FROM ITEM_BARCODE_VW_01 WHERE (UPPER(ITEM_CODE) LIKE UPPER(@VAL) OR UPPER(ITEM_NAME) LIKE UPPER(@VAL) OR BARCODE LIKE @VAL) AND STATUS = 1 " + 
                                                                "GROUP BY ITEM_CODE,ITEM_NAME,MAIN_GRP_NAME,ITEM_GUID,VAT",
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
                                            <NdPopUp parent={this} id={"pop_PrmItemList"} container={"#root"}
                                            position={{of:'#root'}}
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
                                                        //this["pg_txtPrmItem" + pItem.WITHAL]["txtpg_txtPrmItem" + pItem.WITHAL].value = ""
                                                        this["pg_txtPrmItem"].show()
                                                        this["pg_txtPrmItem"].onClick = async(data) =>
                                                        {         
                                                            for (let i = 0; i < data.length; i++) 
                                                            {
                                                                if(this["itemList"].where({ITEM_GUID:data[i].GUID}).length > 0)
                                                                {
                                                                    let tmpConfObj =
                                                                    {
                                                                        id:'msgItemAlert',showTitle:true,title:this.t("msgItemAlert.title"),showCloseButton:true,width:'500px',height:'200px',
                                                                        button:[{id:"btn01",caption:this.t("msgItemAlert.btn01"),location:'after'}],
                                                                        content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgItemAlert.msg")}</div>)
                                                                    }
                                                                    await dialog(tmpConfObj)
                                                                    return
                                                                }
                                                            }
                                                            
                                                            for (let i = 0; i < data.length; i++) 
                                                            {
                                                                let tmpData = {...this.discount.cond.empty}

                                                                tmpData.GUID = datatable.uuidv4();
                                                                tmpData.ITEM_GUID = data[i].GUID;
                                                                tmpData.ITEM_CODE = data[i].CODE;
                                                                tmpData.ITEM_NAME = data[i].NAME;
                                                                tmpData.PRICE = data[i].PRICE;
                                                                tmpData.PROMO = this.discount.dt()[0].GUID
                                                                tmpData.QUANTITY = 1;
                                                                tmpData.AMOUNT = 0;
                                                            

                                                                this["itemList"].push(tmpData);
                                                            }

                                                            if(data.length > 0)
                                                            {
                                                                //this["txtPrmItem" + pItem.WITHAL].value = data[0].CODE;
                                                                //this["txtPrmItem" + pItem.WITHAL].displayValue = data[0].NAME

                                                                if(this.condDt.where({WITHAL:pItem.WITHAL}).length > 0)
                                                                {
                                                                    this.condDt.where({})[0].ITEM_GUID = data[0].GUID
                                                                    this.condDt.where({})[0].ITEM_CODE = data[0].CODE
                                                                    this.condDt.where({})[0].ITEM_NAME = data[0].NAME
                                                                }
                                                            }
                                                        }
                                                    }}></NdButton> 
                                                    </div>
                                                </div>
                                                {/* grdPopGridList */}
                                                <div className="row pb-1" style={{height:"85%"}}>
                                                    <div className="col-12">
                                                        <NdGrid parent={this} id={"grdPopItemList"} 
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
                                                            id:'msgDeleteAll',showTitle:true,title:this.t("msgDeleteAll.title"),showCloseButton:true,width:'500px',height:'200px',
                                                            button:[{id:"btn01",caption:this.t("msgDeleteAll.btn01"),location:'before'},{id:"btn02",caption:this.t("msgDeleteAll.btn02"),location:'after'}],
                                                            content:(<div style={{textAlign:"center",fontSize:"20px",color:"green"}}>{this.t("msgDeleteAll.msg")}</div>)
                                                        }
                                                        if((await dialog(tmpConfObj1)) == 'btn01')
                                                        {
                                                            this["itemList"]
                                                        }
                                                    }}>
                                                        <i className="text-white fa-solid fa-xmark" style={{fontSize: "24px"}} />
                                                    </NdButton>
                                                    </div>
                                                    <div className="col-6">
                                                        <NdButton type="success" width="100%" icon={"todo"}
                                                        onClick={()=>
                                                        {
                                                            this["pop_PrmItemList"]
                                                        }}>
                                                            <i className="text-white fa-solid fa-xmark" style={{fontSize: "24px"}} />
                                                        </NdButton>
                                                    </div>
                                                </div>
                                            </NdPopUp>
                                        </Item>
                                    </GroupItem>
                                    <EmptyItem />
                                    <EmptyItem />
                                    <GroupItem colCount={3}>
                                        {/* cmbRstType */}
                                        <Item>
                                            <Label text={this.t("cmbRstType")} alignment="right" />
                                            <NdSelectBox simple={true} parent={this} id={"cmbRstType"}
                                            displayExpr="NAME"                       
                                            valueExpr="ID"
                                            data={{source:[{ID:0,NAME:this.t("cmbType.discountRate")},{ID:1,NAME:this.t("cmbType.moneyPoint")},{ID:2,NAME:this.t("cmbType.giftCheck")},]}}  
                                            onValueChanged={(e) =>
                                            {
                                               
                                            }}                                  
                                            />
                                        </Item> 
                                        <EmptyItem/>
                                       <EmptyItem/>
                                         {/* txtName */}
                                        <Item colSpan={2}>                                    
                                            <Label text={this.t("cmbRstType")} alignment="right" />
                                            <NdTextBox id="cmbRstType" parent={this} simple={true} 
                                            upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                            placeholder={this.t("cmbType.discountRate")}
                                            dt={{data:this.discount.dt(),field:"NAME"}}
                                            />     
                                        </Item>       
                                    </GroupItem>
                                </GroupItem>
                            </Form>
                        </div>
                    </div>                    
                </ScrollView>               
            </div>
        )
    }
}