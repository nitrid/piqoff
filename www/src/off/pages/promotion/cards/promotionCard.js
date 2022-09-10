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

export default class promotionCard extends React.PureComponent
{
    constructor(props)
    {
        super(props) 
        this.state = 
        {
            prmType:0,
            rstType:0,
            discPrice:0,
        }               
        this.core = App.instance.core;
        this.prmObj = this.param.filter({TYPE:1,USERS:this.user.CODE});

        this.promo = new promoCls();

        this.tabIndex = props.data.tabkey

        Number.money = this.sysParam.filter({ID:'MoneySymbol',TYPE:0}).getValue()
    }   
    async componentDidMount()
    {
        await this.core.util.waitUntil(0)
        this.init();
    }
    async init()
    {
        this.promo.clearAll();
        this.promo.addEmpty();
        this.promo.cond.addEmpty();
        this.promo.app.addEmpty();

        await this.grdPopItemList.dataRefresh({source:this.promo.cond.dt()});

        this.promo.ds.on('onRefresh',async(pTblName)  =>
        {            
            
        })        
    }
    async getPromotion(pCode)
    {
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

                                                this.promo.cond.dt()[0].PROMO = this.promo.dt()[0].GUID
                                                this.promo.app.dt()[0].PROMO = this.promo.dt()[0].GUID
                                                
                                                console.log(this.promo.app)

                                                if((await this.promo.save()) == 0)
                                                {                                                    
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
                                        data={{source:{select:{query : "SELECT GUID AS DEPOT_GUID,NAME AS DEPOT_NAME FROM DEPOT_VW_01 ORDER BY CODE ASC"},sql:this.core.sql}}}
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
                                        <Scrolling mode="virtual" />                         
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
                                <GroupItem colSpan={3} colCount={3} caption={"Promosyon Koşulları"}>
                                    {/* cmbPrmType */}
                                    <Item>
                                        <Label text={this.t("cmbPrmType")} alignment="right" />
                                        <NdSelectBox simple={true} parent={this} id="cmbPrmType"
                                        dt={{data:this.promo.dt("PROMO_CONDITION"),field:"TYPE"}}
                                        displayExpr="NAME"                       
                                        valueExpr="ID"
                                        value={0}
                                        data={{source:[{ID:0,NAME:"Stok"},{ID:1,NAME:"Genel Tutar"}]}}
                                        onValueChanged={(e)=>
                                        {
                                            this.setState({prmType:e.value})
                                        }}
                                        />
                                    </Item>
                                    <EmptyItem />
                                    <EmptyItem />
                                    <GroupItem colSpan={3}>
                                        <GroupItem colCount={3} visible={this.state.prmType == 0 ? true : false}>
                                            {/* txtPrmItem */}                                
                                            <Item>
                                                <Label text={this.t("txtPrmItem")} alignment="right" />
                                                <NdTextBox id="txtPrmItem" parent={this} simple={true} readOnly={true}
                                                upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                                dt={{data:this.promo.dt("PROMO_CONDITION"),field:"ITEM_CODE",display:"ITEM_NAME"}}
                                                displayValue={""}
                                                button={[
                                                {
                                                    id:'01',
                                                    icon:'more',
                                                    onClick:()=>
                                                    {
                                                        this.pg_txtPrmItem.show()
                                                        this.pg_txtPrmItem.onClick = (data) =>
                                                        {                         
                                                            let tmpArr = [...this.promo.cond.dt().toArray()]
                                                            for (let i = 0; i < tmpArr.length; i++) 
                                                            {
                                                                this.promo.cond.dt().removeAt(0)
                                                            }
                                                            
                                                            for (let i = 0; i < data.length; i++) 
                                                            {
                                                                let tmpData = {...this.promo.cond.empty}

                                                                tmpData.ITEM_GUID = data[i].GUID;
                                                                tmpData.ITEM_CODE = data[i].CODE;
                                                                tmpData.ITEM_NAME = data[i].NAME;
                                                                tmpData.PROMO = this.promo.dt()[0].GUID
                                                                tmpData.QUANTITY = 1;
                                                                tmpData.AMOUNT = 0;

                                                                this.promo.cond.addEmpty(tmpData);
                                                            }
                                                            
                                                            if(data.length > 0)
                                                            {
                                                                this.txtPrmItem.value = data[0].CODE;
                                                                this.txtPrmItem.displayValue = data[0].NAME
                                                            }
                                                        }
                                                    }
                                                },
                                                {
                                                    id:'02',
                                                    icon:'info',
                                                    onClick:()=>
                                                    {
                                                        this.pop_PrmItemList.show()
                                                    }
                                                }]}
                                                >     
                                                </NdTextBox> 
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
                                                            query : "SELECT GUID,CODE,NAME,VAT FROM ITEMS_VW_01 WHERE UPPER(CODE) LIKE UPPER(@VAL) OR UPPER(NAME) LIKE UPPER(@VAL)",
                                                            param : ['VAL:string|50']
                                                        },
                                                        sql:this.core.sql
                                                    }
                                                }}>
                                                    <Column dataField="CODE" caption={this.t("pg_Grid.clmCode")} width={150} />
                                                    <Column dataField="NAME" caption={this.t("pg_Grid.clmName")} width={650} defaultSortOrder="asc" />
                                                </NdPopGrid>
                                                {/* SEÇİM LİSTE POPUP */}
                                                <NdPopUp parent={this} id={"pop_PrmItemList"} container={"#root"}
                                                position={{of:'#root'}}
                                                showCloseButton={true}
                                                showTitle={true}
                                                title={this.t("pg_Grid.title")}
                                                width={'70%'}
                                                height={'50%'}
                                                >
                                                    {/* grdPopGridList */}
                                                    <div className="row">
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
                                                                <Editing confirmDelete={false}/>
                                                                <Scrolling mode="infinite" />
                                                                <Column dataField="ITEM_CODE" caption={this.t("pg_Grid.clmCode")} width={100}/>
                                                                <Column dataField="ITEM_NAME" caption={this.t("pg_Grid.clmName")} width={290}/>
                                                            </NdGrid>
                                                        </div>
                                                    </div>
                                                </NdPopUp>
                                            </Item>     
                                            {/* txtPrmQuantity */}  
                                            <Item>                                                                    
                                                <Label text={this.t("txtPrmQuantity")} alignment="right" />
                                                <NdTextBox id="txtPrmQuantity" parent={this} simple={true} dt={{data:this.promo.dt("PROMO_CONDITION"),field:"QUANTITY"}}/>     
                                            </Item>
                                            {/* txtPrmAmount */}  
                                            <Item>                                                                    
                                                <Label text={this.t("txtPrmAmount")} alignment="right" />
                                                <NdTextBox id="txtPrmAmount" parent={this} simple={true} dt={{data:this.promo.dt("PROMO_CONDITION"),field:"AMOUNT"}}/>     
                                            </Item>
                                        </GroupItem>
                                        <GroupItem colCount={3} visible={this.state.prmType == 1 ? true : false}>
                                            {/* txtPrmAmount */}  
                                            <Item>                                                                    
                                                <Label text={this.t("txtPrmAmount")} alignment="right" />
                                                <NdTextBox id="txtPrmAmount" parent={this} simple={true} 
                                                dt={{data:this.promo.dt("PROMO_CONDITION"),field:"AMOUNT"}}
                                                />     
                                            </Item> 
                                            <EmptyItem /> 
                                            <EmptyItem /> 
                                        </GroupItem>
                                    </GroupItem>
                                </GroupItem>   
                                <GroupItem colSpan={3} colCount={3} caption={"Promosyon Sonuç"}>
                                    {/* cmbRstType */}
                                    <Item>
                                        <Label text={this.t("cmbRstType")} alignment="right" />
                                        <NdSelectBox simple={true} parent={this} id="cmbRstType"
                                        dt={{data:this.promo.dt("PROMO_APPLICATION"),field:"TYPE"}}
                                        displayExpr="NAME"                       
                                        valueExpr="ID"
                                        value={0}
                                        data={{source:[{ID:0,NAME:"İskonto"},{ID:1,NAME:"Para Puan"},{ID:2,NAME:"Hediye Çeki"},{ID:3,NAME:"Stok"}]}}  
                                        onValueChanged={(e) =>
                                        {
                                            this.setState({rstType:e.value,discPrice:0})

                                            this.promo.app.dt()[0].ITEM_GUID = "00000000-0000-0000-0000-000000000000";
                                            this.promo.app.dt()[0].ITEM_CODE = "";
                                            this.promo.app.dt()[0].ITEM_NAME = "";
                                            this.promo.app.dt()[0].QUANTITY = 1;
                                            this.promo.app.dt()[0].AMOUNT = 0;                                            
                                        }}                                  
                                        />
                                    </Item>                                
                                    <EmptyItem/>
                                    <EmptyItem/>
                                    <GroupItem colSpan={3}>
                                        <GroupItem colCount={3} visible={this.state.rstType == 0 ? true : false}>
                                            {/* txtRstQuantity */}
                                            <Item>
                                                <Label text={this.t("txtRstQuantity")} alignment="right" />
                                                <NdTextBox id="txtRstQuantity" parent={this} simple={true} readOnly={true} dt={{data:this.promo.dt("PROMO_APPLICATION"),field:"AMOUNT"}} value={"0"}
                                                button=
                                                {[
                                                    {
                                                        id:'01',
                                                        icon:'more',
                                                        onClick:async()=>
                                                        {
                                                            if(this.promo.cond.dt().length > 0)
                                                            {
                                                                let tmpPrice = await this.getPrice(this.promo.cond.dt()[0].ITEM_GUID)
                                                                this.setState({discPrice:tmpPrice})
                                                            }
                                                            this.txtDiscRate.value = this.txtRstQuantity.value
                                                            this.txtDiscAmount.value = Number(this.state.discPrice - Number(this.state.discPrice).rateInc(this.txtRstQuantity.value,2)).toFixed(2)
                                                            this.popDiscount.show()
                                                        }
                                                    }
                                                ]}/>
                                            </Item>
                                            <EmptyItem/>
                                            <EmptyItem/>
                                        </GroupItem>
                                        <GroupItem colCount={3} visible={this.state.rstType == 1 || this.state.rstType == 2 ? true : false}>
                                            {/* txtRstQuantity */}
                                            <Item>
                                                <Label text={this.t("txtRstQuantity")} alignment="right" />
                                                <NdTextBox id="txtRstPointGift" parent={this} simple={true} dt={{data:this.promo.dt("PROMO_APPLICATION"),field:"AMOUNT"}} value={"0"}/>
                                            </Item>
                                            <EmptyItem/>
                                            <EmptyItem/>
                                        </GroupItem>
                                        <GroupItem colCount={3} visible={this.state.rstType == 3 ? true : false}>
                                            {/* txtRstItem */}                                
                                            <Item>
                                                <Label text={this.t("txtRstItem")} alignment="right" />
                                                <NdTextBox id="txtRstItem" parent={this} simple={true} readOnly={true}
                                                upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                                dt={{data:this.promo.dt("PROMO_APPLICATION"),field:"ITEM_CODE",display:"ITEM_NAME"}}
                                                displayValue={""}
                                                button=
                                                {[
                                                    {
                                                        id:'01',
                                                        icon:'more',
                                                        onClick:()=>
                                                        {
                                                            this.pg_txtRstItem.show()
                                                            this.pg_txtRstItem.onClick = (data) =>
                                                            {
                                                                if(data.length > 0)
                                                                {
                                                                    this.promo.app.dt()[0].ITEM_GUID = data[0].GUID;
                                                                    this.promo.app.dt()[0].ITEM_CODE = data[0].CODE;
                                                                    this.promo.app.dt()[0].ITEM_NAME = data[0].NAME;
                                                                    this.promo.app.dt()[0].QUANTITY = 1;
                                                                    this.promo.app.dt()[0].AMOUNT = 0;
                                                                }
                                                                console.log(this.promo.app.dt())
                                                            }
                                                        }
                                                    }
                                                ]}
                                                >     
                                                </NdTextBox> 
                                                {/* SEÇİM POPUP */}
                                                <NdPopGrid id={"pg_txtRstItem"} parent={this} container={"#root"} 
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
                                                            query : "SELECT GUID,CODE,NAME,VAT FROM ITEMS_VW_01 WHERE UPPER(CODE) LIKE UPPER(@VAL) OR UPPER(NAME) LIKE UPPER(@VAL)",
                                                            param : ['VAL:string|50']
                                                        },
                                                        sql:this.core.sql
                                                    }
                                                }}>
                                                    <Column dataField="CODE" caption={this.t("pg_Grid.clmCode")} width={150} />
                                                    <Column dataField="NAME" caption={this.t("pg_Grid.clmName")} width={650} defaultSortOrder="asc" />
                                                </NdPopGrid>
                                            </Item>     
                                            {/* txtRstItemQuantity */}  
                                            <Item>                                                                    
                                                <Label text={this.t("txtRstItemQuantity")} alignment="right" />
                                                <NdTextBox id="txtRstItemQuantity" parent={this} simple={true} dt={{data:this.promo.dt("PROMO_APPLICATION"),field:"QUANTITY"}} value={"1"}/>     
                                            </Item> 
                                            {/* txtRstItemAmount */}  
                                            <Item>                                                                    
                                                <Label text={this.t("txtRstItemAmount")} alignment="right" />
                                                <NdTextBox id="txtRstItemAmount" parent={this} simple={true} readOnly={true} dt={{data:this.promo.dt("PROMO_APPLICATION"),field:"AMOUNT"}} value={"0"}
                                                button=
                                                {[
                                                    {
                                                        id:'01',
                                                        icon:'more',
                                                        onClick:async()=>
                                                        {
                                                            if(this.promo.app.dt().length > 0)
                                                            {
                                                                let tmpPrice = await this.getPrice(this.promo.app.dt()[0].ITEM_GUID)
                                                                this.setState({discPrice:tmpPrice})
                                                            }
                                                            this.txtDiscRate.value = this.txtRstQuantity.value
                                                            this.txtDiscAmount.value = Number(this.state.discPrice - Number(this.state.discPrice).rateInc(this.txtRstItemAmount.value,2)).toFixed(2)
                                                            this.popDiscount.show()
                                                        }
                                                    }
                                                ]}/>     
                                            </Item>
                                        </GroupItem>
                                    </GroupItem>
                                </GroupItem>
                            </Form>
                        </div>
                    </div>                    
                </ScrollView>
                {/* ISKONTO POPUP */}
                <div>
                    <NdPopUp parent={this} id={"popDiscount"} container={"#root"}
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
                                    <NdTextBox id="txtDiscRate" parent={this} simple={true} 
                                    onValueChanged={(e)=>
                                    { 
                                        this.txtDiscAmount.value = Number(this.state.discPrice - Number(this.state.discPrice).rateInc(e.value,2)).toFixed(2)
                                    }}/>
                                </Item>
                                <Item>
                                    <Label text={this.t("popDiscount.txtDiscAmount")} alignment="right" />
                                    <NdTextBox id="txtDiscAmount" parent={this} simple={true}
                                    onValueChanged={(e)=>
                                    { 
                                        this.txtDiscRate.value = Number(100 - Number(this.state.discPrice).rate2Num(e.value,2)).toFixed(2)
                                    }}/>
                                </Item>
                                <Item>
                                    <NdButton id="btnDiscSave" parent={this} text={this.t("popDiscount.btnSave")} type="default" width={'100%'}
                                    onClick={()=>
                                    {
                                        if(this.state.rstType == 0)
                                        {
                                            this.txtRstQuantity.value = this.txtDiscRate.value
                                        }
                                        else if(this.state.rstType == 3)
                                        {
                                            this.txtRstItemAmount.value = this.txtDiscRate.value
                                        }
                                        this.popDiscount.hide()
                                    }}/>
                                </Item>
                            </Form>
                        </div>
                    </NdPopUp>
                </div>
            </div>
        )
    }
}