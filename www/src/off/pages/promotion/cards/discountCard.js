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
        this.customerCondDt = new datatable();
        this.itemCondDt = new datatable();

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
        this.customerCondDt.clear();
        this.itemCondDt.clear();

        this.discount.clearAll();
        this.discount.addEmpty();
        this.discount.app.addEmpty();

        this.cmbPrmType.value = 0;
        this.cmbPrmType2.value = 10;        
        this.cmbRstType.value = 0;
        this.txtAmount.value = 0;
    }
    async getDiscount(pCode)
    {
        this.customerCondDt.clear();
        this.itemCondDt.clear();

        this.discount.clearAll();
        
        await this.discount.load({CODE:pCode});

        this.customerCondDt = this.discount.cond.dt().where({TYPE:{'IN':[0,1]}})
        this.itemCondDt = this.discount.cond.dt().where({TYPE:{'IN':[10,11]}})
        
        this.cmbPrmType.value = this.customerCondDt.length > 0 ? this.customerCondDt[0].TYPE : 0;
        this.cmbPrmType2.value = this.itemCondDt.length > 0 ? this.itemCondDt[0].TYPE : 10;
        
        this.cmbRstType.value = this.discount.app.dt().length > 0 ? this.discount.app.dt()[0].TYPE : 0;
        this.txtAmount.value = this.discount.app.dt().length > 0 ? this.discount.app.dt()[0].AMOUNT : 0;

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
                                        if(this.txtAmount.value == 0)
                                        {
                                            let tmpConfObj =
                                            {
                                                id:'msgAmount',showTitle:true,title:this.t("msgAmount.title"),showCloseButton:true,width:'500px',height:'200px',
                                                button:[{id:"btn01",caption:this.t("msgAmount.btn01"),location:'after'}],
                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgAmount.msg")}</div>)
                                            }
                                            await dialog(tmpConfObj);
                                            return
                                        }
                                        if(this.customerCondDt.length == 0 || this.itemCondDt.length == 0)
                                        {
                                            let tmpConfObj =
                                            {
                                                id:'msgCondOrApp',showTitle:true,title:this.t("msgCondOrApp.title"),showCloseButton:true,width:'500px',height:'200px',
                                                button:[{id:"btn01",caption:this.t("msgCondOrApp.btn01"),location:'after'}],
                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgCondOrApp.msg")}</div>)
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
                                                
                                                this.customerCondDt.forEach((item)=>
                                                {
                                                    let tmpCond = this.discount.cond.dt().where({LINK_GUID:item.LINK_GUID})
                                                                
                                                    if(tmpCond.length > 0)
                                                    {                                                                
                                                        tmpCond[0].TYPE = item.TYPE
                                                        tmpCond[0].LINK_GUID = item.LINK_GUID
                                                        tmpCond[0].LINK_CODE = item.LINK_CODE
                                                        tmpCond[0].LINK_NAME = item.LINK_NAME
                                                        tmpCond[0].WITHAL = item.WITHAL
                                                    }
                                                    else
                                                    {                                                                    
                                                        let tmpEmpty = {...this.discount.cond.empty}

                                                        tmpEmpty.GUID = item.GUID
                                                        tmpEmpty.DISCOUNT = item.DISCOUNT
                                                        tmpEmpty.TYPE = item.TYPE
                                                        tmpEmpty.TYPE_NAME = item.TYPE_NAME
                                                        tmpEmpty.LINK_GUID = item.LINK_GUID
                                                        tmpEmpty.LINK_CODE = item.LINK_CODE
                                                        tmpEmpty.LINK_NAME = item.LINK_NAME
                                                        tmpEmpty.WITHAL = item.WITHAL
                                                        
                                                        this.discount.cond.addEmpty(tmpEmpty)
                                                    }
                                                })
                                                this.itemCondDt.forEach((item)=>
                                                {
                                                    let tmpCond = this.discount.cond.dt().where({LINK_GUID:item.LINK_GUID})

                                                    if(tmpCond.length > 0)
                                                    {
                                                        tmpCond[0].TYPE = item.TYPE
                                                        tmpCond[0].LINK_GUID = item.LINK_GUID
                                                        tmpCond[0].LINK_CODE = item.LINK_CODE
                                                        tmpCond[0].LINK_NAME = item.LINK_NAME
                                                        tmpCond[0].WITHAL = item.WITHAL
                                                    }
                                                    else
                                                    {
                                                        let tmpEmpty = {...this.discount.cond.empty}

                                                        tmpEmpty.GUID = item.GUID
                                                        tmpEmpty.DISCOUNT = item.DISCOUNT
                                                        tmpEmpty.TYPE = item.TYPE
                                                        tmpEmpty.TYPE_NAME = item.TYPE_NAME
                                                        tmpEmpty.LINK_GUID = item.LINK_GUID
                                                        tmpEmpty.LINK_CODE = item.LINK_CODE
                                                        tmpEmpty.LINK_NAME = item.LINK_NAME
                                                        tmpEmpty.WITHAL = item.WITHAL

                                                        this.discount.cond.addEmpty(tmpEmpty)
                                                    }
                                                }) 

                                                this.discount.app.dt()[0].DISCOUNT = this.discount.dt()[0].GUID
                                                this.discount.app.dt()[0].TYPE = this.cmbRstType.value 
                                                this.discount.app.dt()[0].AMOUNT = this.txtAmount.value
                                                this.discount.app.dt()[0].WITHAL = 0

                                                this.customerCondDt._deleteList.forEach((item)=>
                                                {
                                                    console.log(item)
                                                    this.discount.cond.dt()._deleteList.push(item)
                                                })
                                                this.itemCondDt._deleteList.forEach((item)=>
                                                {
                                                    this.discount.cond.dt()._deleteList.push(item)
                                                })

                                                await this.core.util.waitUntil(0)
                                                
                                                if((await this.discount.save()) == 0)
                                                {                                                    
                                                    this.getDiscount(this.txtCode.value)

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
                                                this.customerCondDt.removeAll();
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
                                                this.grdPopCustomerList.dataRefresh({source:this.customerCondDt})
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
                                                            if(this.cmbPrmType.value == 0)
                                                            {
                                                                this.popPrmCustomer.setSource(
                                                                {
                                                                    source:
                                                                    {
                                                                        select:
                                                                        {
                                                                            query : "SELECT GUID,CODE,TITLE AS NAME FROM CUSTOMER_VW_01 WHERE (UPPER(CODE) LIKE UPPER(@VAL) OR UPPER(TITLE) LIKE UPPER(@VAL)) AND STATUS = 1",
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
                                                                            query : "SELECT GUID,CODE,NAME FROM CUSTOMER_GROUP_VW_01 WHERE (UPPER(CODE) LIKE UPPER(@VAL) OR UPPER(NAME) LIKE UPPER(@VAL))",
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
                                                                    if(this.customerCondDt.where({LINK_GUID:data[i].GUID}).length > 0)
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

                                                                    this.customerCondDt.push(tmpData);
                                                                }
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
                                                                this.customerCondDt.removeAll()
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
                                        {/* cmbPrmType2 */}
                                        <Item>
                                            <Label text={this.t("cmbPrmType2")} alignment="right" />
                                            <NdSelectBox simple={true} parent={this} id={"cmbPrmType2"}
                                            displayExpr="NAME"                       
                                            valueExpr="ID"
                                            data={{source:[{ID:10,NAME:this.t("cmbType2.item")},{ID:11,NAME:this.t("cmbType2.itemGroup")}]}}
                                            onValueChanged={(e)=>
                                            {
                                                this.itemCondDt.removeAll();
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
                                                this.grdPopItemList.dataRefresh({source:this.itemCondDt})
                                                this.popPrmItemList.show()
                                            }}></NdButton> 
                                            {/* SEÇİM POPUP */}
                                            <NdPopGrid id={"popPrmItem"} parent={this} container={"#root"} 
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
                                            <NdPopUp parent={this} id={"popPrmItemList"} container={"#root"}
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
                                                        if(this.cmbPrmType2.value == 10)
                                                        {
                                                            this.popPrmItem.setSource(
                                                            {
                                                                source:
                                                                {
                                                                    select:
                                                                    {
                                                                        query : "SELECT GUID,CODE,NAME FROM ITEMS_VW_01 WHERE (UPPER(CODE) LIKE UPPER(@VAL) OR UPPER(NAME) LIKE UPPER(@VAL)) AND STATUS = 1",
                                                                        param : ['VAL:string|50']
                                                                    },
                                                                    sql:this.core.sql
                                                                }
                                                            })
                                                        }
                                                        else
                                                        {
                                                            this.popPrmItem.setSource(
                                                            {
                                                                source:
                                                                {
                                                                    select:
                                                                    {
                                                                        query : "SELECT GUID,CODE,NAME FROM ITEM_GROUP WHERE (UPPER(CODE) LIKE UPPER(@VAL) OR UPPER(NAME) LIKE UPPER(@VAL)) AND STATUS = 1",
                                                                        param : ['VAL:string|50']
                                                                    },
                                                                    sql:this.core.sql
                                                                }
                                                            })
                                                        }

                                                        this.popPrmItem.show()
                                                        this.popPrmItem.onClick = async(data) =>
                                                        {         
                                                            for (let i = 0; i < data.length; i++) 
                                                            {
                                                                if(this.itemCondDt.where({LINK_GUID:data[i].GUID}).length > 0)
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
                                                                tmpData.TYPE = this.cmbPrmType2.value;
                                                                tmpData.LINK_GUID = data[i].GUID;
                                                                tmpData.LINK_CODE = data[i].CODE;
                                                                tmpData.LINK_NAME = data[i].NAME;
                                                                tmpData.DISCOUNT = this.discount.dt()[0].GUID
                                                                tmpData.WITHAL = 1;

                                                                this.itemCondDt.push(tmpData);
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
                                                            this.itemCondDt.removeAll()
                                                        }
                                                    }}>
                                                        <i className="text-white fa-solid fa-xmark" style={{fontSize: "24px"}} />
                                                    </NdButton>
                                                    </div>
                                                    <div className="col-6">
                                                        <NdButton type="success" width="100%" icon={"todo"}
                                                        onClick={()=>
                                                        {
                                                            this.popPrmItemList.hide()
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
                                            data={{source:[{ID:0,NAME:this.t("cmbType2.discountRate")},{ID:1,NAME:this.t("cmbType2.discountAmount")}]}}  
                                            onValueChanged={(e) =>
                                            {
                                               
                                            }}
                                            />
                                        </Item> 
                                        <EmptyItem/>
                                        <EmptyItem/>
                                        {/* txtAmount */}
                                        <Item>                                    
                                            <Label text={this.t("txtAmount")} alignment="right" />
                                            <NdTextBox id="txtAmount" parent={this} simple={true} 
                                            upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
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