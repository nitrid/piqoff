import React from 'react';
import App from '../../../lib/app.js';
import { priLabelObj,labelMainCls } from '../../../../core/cls/label.js';
import moment from 'moment';

import ScrollView from 'devextreme-react/scroll-view';
import Toolbar from 'devextreme-react/toolbar';
import Form, { Label,Item,EmptyItem } from 'devextreme-react/form';
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

export default class outageDoc extends React.Component
{
    constructor()
    {
        super()
        this.core = App.instance.core;
        this.prmObj = this.param.filter({TYPE:1,USERS:this.user.CODE});
        this.acsobj = this.access.filter({TYPE:1,USERS:this.user.CODE});
        this.prilabelCls = new priLabelObj();
        this.labelMainObj = new labelMainCls();
    }
    async componentDidMount()
    {
        await this.core.util.waitUntil(0)
        this.init()
    }
    async init()
    {
        this.prilabelCls.clearAll()
        this.labelMainObj.clearAll()
        this.txtRef.value = ''
        this.txtItemName.value = ''
        this.txtPrice.value = 0
        this.txtQuantity.value = 1
        this.txtDescription.value = ''
    }
    render()
    {
        return(
            <ScrollView>
            <div>
                <Form colCount={1} id={"frmPriLabel" + this.tabIndex}>
                    {/* txtRef */}
                    <Item>                                    
                        <Label text={this.t("txtRef")} alignment="right" />
                        <NdTextBox id="txtRef" parent={this} simple={true} tabIndex={this.tabIndex} readOnly={true}
                        upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                        button=
                        {
                            [
                                {
                                    id:'01',
                                    icon:'more',
                                    onClick:()=>
                                    {
                                        this.pg_txtRef.show()
                                        this.pg_txtRef.onClick = (data) =>
                                        {
                                            if(data.length > 0)
                                            {
                                                this.txtRef.value = data[0].CODE
                                                this.txtItemName.value = data[0].NAME
                                                this.txtRef.GUID = data[0].GUID
                                                this.txtPrice.value = data[0].PRICE
                                            }
                                        }
                                    }
                                },
                            ]
                        }
                        onChange={(async()=>
                        {

                        }).bind(this)} 
                        param={this.param.filter({ELEMENT:'txtRef',USERS:this.user.CODE})} 
                        access={this.access.filter({ELEMENT:'txtRef',USERS:this.user.CODE})}     
                        selectAll={true}                           
                        >     
                            <Validator validationGroup={"frmPriLabel" + this.tabIndex}>
                                <RequiredRule message={this.t("valCode")} />
                            </Validator> 
                        </NdTextBox>      
                        {/* STOK SEÇİM POPUP */}
                        <NdPopGrid id={"pg_txtRef"} parent={this} container={"#root"} 
                        visible={false}
                        position={{of:'#root'}} 
                        showTitle={true} 
                        showBorders={true}
                        width={'90%'}
                        height={'90%'}
                        title={this.t("pg_txtRef.title")} 
                        search={true}
                        data = 
                        {{
                            source:
                            {
                                select:
                                {
                                    query : "SELECT GUID,CODE,NAME,[dbo].[FN_PRICE_SALE](GUID,1,GETDATE()) AS PRICE FROM ITEMS_VW_01 WHERE UPPER(CODE) LIKE UPPER(@VAL) OR UPPER(NAME) LIKE UPPER(@VAL)",
                                    param : ['VAL:string|50']
                                },
                                sql:this.core.sql
                            }
                        }}
                        button=
                        {
                            [
                                {
                                    id:'tst',
                                    icon:'more',
                                    onClick:()=>
                                    {
                                    }
                                }
                            ]
                        }
                        >
                            <Column dataField="CODE" caption={this.t("pg_txtRef.clmCode")} width={100} />
                            <Column dataField="NAME" caption={this.t("pg_txtRef.clmName")} defaultSortOrder="asc" />
                            <Column dataField="PRICE" caption={this.t("pg_txtRef.clmPrice")}  type={"text"}/>
                        </NdPopGrid>
                    </Item>
                    {/* txtItemName */}
                    <Item>
                        <Label text={this.t("txtItemName")} alignment="right" />
                        <NdTextBox id="txtItemName" parent={this} simple={true} 
                        param={this.param.filter({ELEMENT:'txtItemName',USERS:this.user.CODE})}
                        access={this.access.filter({ELEMENT:'txtItemName',USERS:this.user.CODE})}
                        upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                        onValueChanged={(e)=>
                        {
                        }}>
                            <Validator validationGroup={"frmPriLabel" + this.tabIndex}>
                                <RequiredRule message={this.t("valName")} />
                            </Validator> 
                        </NdTextBox>
                    </Item>
                        {/* txtPrice */}
                    <Item>
                        <Label text={this.t("txtPrice")} alignment="right" />
                        <NdNumberBox id="txtPrice" parent={this} simple={true} dt={{data:this.prilabelCls.dt('ITEM_UNIQ'),field:"PRICE"}}
                        param={this.param.filter({ELEMENT:'txtPrice',USERS:this.user.CODE})}
                        access={this.access.filter({ELEMENT:'txtPrice',USERS:this.user.CODE})}
                        onValueChanged={(e)=>
                        {
                        }}>
                            <Validator validationGroup={"frmPriLabel" + this.tabIndex}>
                                <RangeRule min={0.001} message={this.t("valPrice")} />
                            </Validator> 
                        </NdNumberBox>
                    </Item>
                        {/* txtDescription */}
                    <Item>
                        <Label text={this.t("txtDescription")} alignment="right" />
                        <NdTextBox id="txtDescription" parent={this} simple={true} dt={{data:this.prilabelCls.dt('ITEM_UNIQ'),field:"DESCRIPTION"}}
                        param={this.param.filter({ELEMENT:'txtDescription',USERS:this.user.CODE})}
                        access={this.access.filter({ELEMENT:'txtDescription',USERS:this.user.CODE})}
                        upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                        onValueChanged={(e)=>
                        {
                        }}>
                        </NdTextBox>
                    </Item>
                        {/* txtQuantity */}
                    <Item>
                        <Label text={this.t("txtQuantity")} alignment="right" />
                        <NdTextBox id="txtQuantity" parent={this} simple={true}
                        param={this.param.filter({ELEMENT:'txtQuantity',USERS:this.user.CODE})}
                        access={this.access.filter({ELEMENT:'txtQuantity',USERS:this.user.CODE})}
                        upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                        onValueChanged={(e)=>
                        {
                        }}>
                            
                        </NdTextBox>
                    </Item>
                    <Item>
                        <div className="row">
                            <div className="col-6 px-4 pt-4">
                                <NdButton text={this.t("btnSave")} type="default" width="100%" 
                                onClick=
                                {async (e)=>
                                    {
                                        if(e.validationGroup.validate().status == "valid")
                                        {
                                            let tmpConfObj =
                                            {
                                                id:'msgSave',showTitle:true,title:this.t("msgSave.title"),showCloseButton:true,width:'90%',height:'200px',
                                                button:[{id:"btn01",caption:this.t("msgSave.btn01"),location:'before'},{id:"btn02",caption:this.t("msgSave.btn02"),location:'after'}],
                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgSave.msg")}</div>)
                                            }
                                            
                                            let pResult = await dialog(tmpConfObj);
                                            if(pResult == 'btn01')
                                            {
                                                
                                                let tmpQuery = 
                                                {
                                                    query : "SELECT ISNULL(REPLACE(STR(SUBSTRING(MAX(CODE),0,8) + 1, 7), SPACE(1), '0'),'2700001') AS CODE FROM ITEM_UNIQ WHERE CODE LIKE '27%' ",
                                                }
                                                let tmpData = await this.core.sql.execute(tmpQuery) 
                                                if(tmpData.result.recordset.length > 0)
                                                {   
                                                    let tmpdefCode = tmpData.result.recordset[0].CODE
                                                    for (let i = 0; i < this.txtQuantity.value; i++) 
                                                    {
                                                        tmpdefCode = tmpdefCode.toString()
                                                        let tmpCode = ''
                                                        let output = []
                                                        for (var x = 0, len = tmpdefCode.length; x < len; x += 1) {
                                                            output.push(+tmpdefCode.charAt(x));
                                                        }
                                                
                                                        var tek=(output[0]+output[2]+output[4]+output[6])*3
                                                        var cift=output[1]+output[3]+output[5]
                                                        var say = tek+cift
                                                        let sonuc = (10 - (say %= 10))
                                                        if(sonuc == 10)
                                                        {
                                                            sonuc = 0
                                                        }
                                                        tmpCode = tmpdefCode + sonuc.toString();
                                                        let tmpEmpty = {...this.prilabelCls.empty};
                                                        tmpEmpty.CODE = tmpCode
                                                        tmpEmpty.ITEM = this.txtRef.GUID
                                                        tmpEmpty.NAME = this.txtItemName.value
                                                        tmpEmpty.PRICE = this.txtPrice.value
                                                        tmpEmpty.DESCRIPTION = this.txtDescription.value
                                                        this.prilabelCls.addEmpty(tmpEmpty);  
                                                        tmpdefCode = Number(tmpdefCode) + 1
                                                    }
                                                }
                                                let tmpConfObj1 =
                                                {
                                                    id:'msgSaveResult',showTitle:true,title:this.t("msgSave.title"),showCloseButton:true,width:'90%',height:'200px',
                                                    button:[{id:"btn01",caption:this.t("msgSave.btn01"),location:'after'}],
                                                }
                                                if((await this.prilabelCls.save()) == 0)
                                                {                  
                                                    let Data = {data:this.prilabelCls.dt().toArray()}                                  
                                                    let tmpLbl = {...this.labelMainObj.empty}
                                                    tmpLbl.REF = 'SPECIAL'
                                                    tmpLbl.DATA = JSON.stringify(Data)
                                                    this.labelMainObj.addEmpty(tmpLbl);
                                                    this.labelMainObj.save()
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
                                                id:'msgSaveValid',showTitle:true,title:this.t("msgSaveValid.title"),showCloseButton:true,width:'90%',height:'200px',
                                                button:[{id:"btn01",caption:this.t("msgSaveValid.btn01"),location:'after'}],
                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgSaveValid.msg")}</div>)
                                            }
                                            
                                            await dialog(tmpConfObj);
                                        }
                                    }
                                }/>
                            </div>
                            <div className="col-6 px-4 pt-4">
                                <NdButton text={this.t("btnPrint")} type="default" width="100%" 
                                onClick={async ()=>
                                    {
                                        let tmpQuery = 
                                        {
                                            query:  "SELECT *, " +
                                                    "ISNULL((SELECT TOP 1 PATH FROM LABEL_DESIGN WHERE TAG = @DESIGN),'') AS PATH " +
                                                    "FROM  ITEM_LABEL_QUEUE_VW_01 WHERE GUID  = @GUID" ,
                                            param:  ['GUID:string|50','DESIGN:string|25'],
                                            value:  [this.labelMainObj.dt()[0].GUID,9]
                                        }

                                        let tmpData = await this.core.sql.execute(tmpQuery) 
                                        this.core.socket.emit('devprint',"{TYPE:'REVIEW',PATH:'" + tmpData.result.recordset[0].PATH.replaceAll('\\','/') + "',DATA:" +  JSON.stringify(tmpData.result.recordset)+ "}",(pResult) => 
                                        {
                                            if(pResult.split('|')[0] != 'ERR')
                                            {
                                                var mywindow = window.open('printview.html','_blank',"width=900,height=1000,left=500");      
                                                mywindow.onload = async function() 
                                                {
                                                    mywindow.document.getElementById("view").innerHTML="<iframe src='data:application/pdf;base64," + pResult.split('|')[1] + "' type='application/pdf' width='100%' height='100%'></iframe>"  
                                                }   
                                            }
                                        });
                                    }}/>
                            </div>
                        </div>
                    </Item>
                </Form>
            </div>
            </ScrollView>

        )
    }
}