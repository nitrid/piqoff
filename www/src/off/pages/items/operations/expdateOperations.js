import React from 'react';
import App from '../../../lib/app.js';
import { docCls,docItemsCls, docCustomerCls } from '../../../../core/cls/doc.js';
import { priLabelObj,labelMainCls } from '../../../../core/cls/label.js';
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
import NdGrid,{Column,Editing,Paging,Scrolling,Pager,KeyboardNavigation} from '../../../../core/react/devex/grid.js';
import NdButton from '../../../../core/react/devex/button.js';
import NdDatePicker from '../../../../core/react/devex/datepicker.js';
import NdImageUpload from '../../../../core/react/devex/imageupload.js';
import { dialog } from '../../../../core/react/devex/dialog.js';
import { datatable } from '../../../../core/core.js';
import tr from '../../../meta/lang/devexpress/tr.js';

export default class expdateOperations extends React.PureComponent
{
    constructor(props)
    {
        super(props)
        this.core = App.instance.core;
        this.prmObj = this.param.filter({TYPE:1,USERS:this.user.CODE});
        this.acsobj = this.access.filter({TYPE:1,USERS:this.user.CODE});
        this.prilabelCls = new priLabelObj();
        this.labelMainObj = new labelMainCls();
       
        this._btnGetClick = this._btnGetClick.bind(this)
        this._btnSave = this._btnSave.bind(this)
        this.tabIndex = props.data.tabkey
    }
    componentDidMount()
    {
        setTimeout(async () => 
        {
            this.Init()
        }, 1000);
    }
    async Init()
    {
        this.txtRef.GUID = '00000000-0000-0000-0000-000000000000'
    }
    async _btnGetClick()
    {
        
        let tmpSource =
        {
            source : 
            {
                select : 
                { 
                    query :"SELECT * FROM " +
                    "(SELECT *, " +
                    "ISNULL((SELECT SUM(QUANTITY) FROM POS_SALE  WHERE POS_SALE.ITEM = ITEM_EXPDATE_VW_01.ITEM_GUID AND POS_SALE.DELETED = 0 AND POS_SALE.CDATE > ITEM_EXPDATE_VW_01.CDATE),0) AS DIFF " +
                    "FROM [ITEM_EXPDATE_VW_01] WHERE ((ITEM_GUID = @ITEM) OR (@ITEM = '00000000-0000-0000-0000-000000000000' )) AND ((CDATE >= @FIRST_DATE) OR (@FIRST_DATE = '19700101')) AND((CDATE >= @LAST_DATE) OR (@LAST_DATE = '19700101'))) AS TMP WHERE QUANTITY - DIFF > 0 ",
                    param : ['ITEM:string|50','FIRST_DATE:date','LAST_DATE:date'],
                    value : [this.txtRef.GUID,this.dtFirstdate.value,this.dtLastDate.value]
                },
                sql : this.core.sql
            }
        }
        App.instance.setState({isExecute:true})
        await this.grdExpdateList.dataRefresh(tmpSource)
        App.instance.setState({isExecute:false})
    }
    async btnPrint()
    {
        this.prilabelCls.clearAll()
        this.labelMainObj.clearAll()
        this.txtQuantity.value = (this.grdExpdateList.getSelectedData()[0].QUANTITY - this.grdExpdateList.getSelectedData()[0].DIFF)

        this.popQuantity.show()
    }
    async _btnSave()
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
                tmpEmpty.CODE = this.grdExpdateList.getSelectedData()[0].ITEM_CODE
                tmpEmpty.ITEM =  this.grdExpdateList.getSelectedData()[0].ITEM_GUID
                tmpEmpty.NAME =  this.grdExpdateList.getSelectedData()[0].ITEM_NAME
                tmpEmpty.PRICE = this.txtPrice.value
                this.prilabelCls.addEmpty(tmpEmpty);  
                tmpdefCode = Number(tmpdefCode) + 1
            }
        }
        await this.prilabelCls.save()
        let Data = {data:this.prilabelCls.dt().toArray()}                                  
        let tmpLbl = {...this.labelMainObj.empty}
        tmpLbl.REF = 'SPECIAL'
        tmpLbl.DATA = JSON.stringify(Data)     
        this.labelMainObj.addEmpty(tmpLbl);
        console.log(this.labelMainObj.dt())
        await this.labelMainObj.save()
        let tmpPrintQuery = 
        {
            query:  "SELECT *, " +
                    "ISNULL((SELECT TOP 1 PATH FROM LABEL_DESIGN WHERE PAGE = @PAGE),'') AS PATH " +
                    "FROM  ITEM_LABEL_QUEUE_VW_01 WHERE GUID  = @GUID" ,
            param:  ['GUID:string|50','PAGE:string|25'],
            value:  [this.labelMainObj.dt()[0].GUID,'02']
        }
        App.instance.setState({isExecute:true})
        let tmpPrintData = await this.core.sql.execute(tmpPrintQuery) 
        App.instance.setState({isExecute:false})
        this.popQuantity.hide()
        this.core.socket.emit('devprint',"{TYPE:'REVIEW',PATH:'" + tmpPrintData.result.recordset[0].PATH.replaceAll('\\','/') + "',DATA:" +  JSON.stringify(tmpPrintData.result.recordset)+ "}",(pResult) => 
        {
            if(pResult.split('|')[0] != 'ERR')
            {
                var mywindow = window.open('printview.html','_blank',"width=900,height=1000,left=500");      
                mywindow.onload = function() 
                {
                    mywindow.document.getElementById("view").innerHTML="<iframe src='data:application/pdf;base64," + pResult.split('|')[1] + "' type='application/pdf' width='100%' height='100%'></iframe>"      
                } 
            }
        });
    }
    render()
    {
        return(
            <div>
                <ScrollView>
                <div className="row px-2 pt-2">
                        <div className="col-12">
                            <Toolbar>
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
                            <Form colCount={2} id="frmCriter">
                                {/* txtRef */}
                                <Item>                                    
                                    <Label text={this.t("txtRef")} alignment="right" />
                                    <NdTextBox id="txtRef" parent={this} simple={true} tabIndex={this.tabIndex}
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
                                                            this.txtRef.value = data[0].NAME
                                                            this.txtRef.GUID = data[0].GUID
                                                        }
                                                    }
                                                }
                                            },
                                        ]
                                    }
                                    onEnterKey={(async()=>
                                        {
                                            await this.pg_txtRef.setVal(this.txtRef.value)
                                            this.pg_txtRef.show()
                                            this.pg_txtRef.onClick = (data) =>
                                            {
                                                if(data.length > 0)
                                                {
                                                    this.txtRef.value = data[0].NAME
                                                    this.txtRef.GUID = data[0].GUID
                                                }
                                            }
                                        }).bind(this)}
                                        selectAll={true}                           
                                    >     
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
                                                query : "SELECT GUID,CODE,NAME,STATUS FROM ITEMS_VW_01 WHERE UPPER(CODE) LIKE UPPER(@VAL) OR UPPER(NAME) LIKE UPPER(@VAL)",
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
                                                    console.log(1111)
                                                }
                                            }
                                        ]
                                    }
                                    >
                                        <Column dataField="CODE" caption={this.t("pg_txtRef.clmCode")} width={'20%'} />
                                        <Column dataField="NAME" caption={this.t("pg_txtRef.clmName")} width={'70%'} defaultSortOrder="asc" />
                                        <Column dataField="STATUS" caption={this.t("pg_txtRef.clmStatus")} width={'10%'} />
                                    </NdPopGrid>
                                </Item>
                                <EmptyItem/>
                                <Item>
                                    <Label text={this.t("dtFirstdate")} alignment="right" />
                                    <NdDatePicker simple={true}  parent={this} id={"dtFirstdate"}
                                    onValueChanged={(async()=>
                                    {
                                     
                                    }).bind(this)}
                                    >
                                    </NdDatePicker>
                                </Item>
                                <Item>
                                    <Label text={this.t("dtLastDate")} alignment="right" />
                                    <NdDatePicker simple={true}  parent={this} id={"dtLastDate"}
                                    onValueChanged={(async()=>
                                    {
                                     
                                    }).bind(this)}
                                    >
                                    </NdDatePicker>
                                </Item>
                            </Form>
                        </div>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-3">
                            <NdButton text={this.t("btnGet")} type="success" width="100%" onClick={this._btnGetClick}></NdButton>
                        </div>
                        <div className="col-3">
                            
                        </div>
                        <div className="col-3">
                          
                        </div>
                        <div className="col-3">
                            <NdButton text={this.t("btnPrint")} type="default" width="100%" onClick={()=>{this.btnPrint()}}></NdButton>
                        </div>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <NdGrid id="grdExpdateList" parent={this} 
                            selection={{mode:"single"}} 
                            showBorders={true}
                            filterRow={{visible:true}} 
                            headerFilter={{visible:true}}
                            columnAutoWidth={true}
                            allowColumnReordering={true}
                            loadPanel={{enabled:true}}
                            allowColumnResizing={true}
                            >                            
                                <Paging defaultPageSize={20} />
                                <Pager visible={true} allowedPageSizes={[5,10,50]} showPageSizeSelector={true} />
                                <Column dataField="ITEM_CODE" caption={this.t("grdExpdateList.clmCode")} visible={true} width={200}/> 
                                <Column dataField="ITEM_NAME" caption={this.t("grdExpdateList.clmName")} visible={true} width={300}/> 
                                <Column dataField="QUANTITY" caption={this.t("grdExpdateList.clmQuantity")} visible={true}/> 
                                <Column dataField="DIFF" caption={this.t("grdExpdateList.clmDiff")} visible={true}/> 
                            </NdGrid>
                        </div>
                    </div>
                     {/* Miktar Fiyat PopUp */}
                     <div>
                        <NdPopUp parent={this} id={"popQuantity"} 
                        visible={false}
                        showCloseButton={true}
                        showTitle={true}
                        title={this.t("popQuantity.title")}
                        container={"#root"} 
                        width={'500'}
                        height={'250'}
                        position={{of:'#root'}}
                        >
                            <Form colCount={1} height={'fit-content'}>
                                <Item>
                                    <Label text={this.t("popQuantity.txtQuantity")} alignment="right" />
                                    <NdNumberBox id="txtQuantity" parent={this} simple={true} 
                                    >
                                    </NdNumberBox>   
                                </Item>
                                <Item>
                                    <Label text={this.t("popQuantity.txtPrice")} alignment="right" />
                                    <NdNumberBox id="txtPrice" parent={this} simple={true} 
                                    >
                                    </NdNumberBox>   
                                </Item>
                                <Item>
                                <div className='row'>
                                    <div className='col-6'>
                                       
                                    </div>
                                    <div className='col-6'>
                                        <NdButton text={this.t("popQuantity.btnSave")} type="normal" stylingMode="contained" width={'100%'}
                                        onClick={()=>
                                        {
                                            this._btnSave()
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