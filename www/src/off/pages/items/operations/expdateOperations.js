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
        this.txtCustomerCode.CODE = ''
        this.txtCustomerCode.value = ''
        this.txtRef.value = ''
    }
    async _btnGetClick()
    {
        
        let tmpSource =
        {
            source : 
            {
                select : 
                { 
                    query :"SELECT *, " +
                            "(QUANTITY-DIFF) AS REMAINDER,[dbo].[FN_PRICE_SALE](ITEM_GUID,1,GETDATE(),'00000000-0000-0000-0000-000000000000') AS PRICE FROM " +
                            "(SELECT *,ISNULL((SELECT TOP 1 REBATE FROM CUSTOMER_VW_01 WHERE CUSTOMER_VW_01.CODE = ITEM_EXPDATE_VW_01.CUSTOMER_CODE),0) AS REBATE, " +
                            "ISNULL((SELECT SUM(QUANTITY) FROM POS_SALE  WHERE POS_SALE.ITEM = ITEM_EXPDATE_VW_01.ITEM_GUID AND POS_SALE.DELETED = 0 AND POS_SALE.CDATE > ITEM_EXPDATE_VW_01.CDATE),0) AS DIFF " +
                            "FROM [ITEM_EXPDATE_VW_01] WHERE ((ITEM_GUID = @ITEM) OR (@ITEM = '00000000-0000-0000-0000-000000000000' )) AND ((CUSTOMER_CODE = @CUSTOMER_CODE) OR (@CUSTOMER_CODE = '')) " + 
                            " AND  ((MAIN_GRP = @MAIN_GRP) OR (@MAIN_GRP = ''))  AND ((EXP_DATE >= @FIRST_DATE) OR (@FIRST_DATE = '19700101')) AND ((EXP_DATE >= @LAST_DATE) OR (@LAST_DATE = '19700101'))) AS TMP WHERE QUANTITY - DIFF > 0 ",
                    param : ['ITEM:string|50','CUSTOMER_CODE:string|50','MAIN_GRP:string|25','FIRST_DATE:date','LAST_DATE:date'],
                    value : [this.txtRef.GUID,this.txtCustomerCode.CODE,this.cmbItemGroup.value,this.dtFirstdate.value,this.dtLastDate.value]
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
        this.txtPrice.value = this.grdExpdateList.getSelectedData()[0].PRICE

        this.popQuantity.show()
    }
    async _btnSave()
    {
            // geçici olarak kapatıldı..... bu parametreye bağlanacak

            // let tmpQuery = 
            // {
            //     query:  "SELECT CUSTOMER_PRICE FROM ITEM_MULTICODE_VW_01 WHERE ITEM_GUID = @ITEM_GUID ORDER BY LDATE DESC ",
            //     param:  ['ITEM_GUID:string|50'],
            //     value:  [this.grdExpdateList.getSelectedData()[0].ITEM_GUID]
            // }

            // let tmpData = await this.core.sql.execute(tmpQuery) 
            // if(tmpData.result.recordset.length > 0)
            // {
            //     if(tmpData.result.recordset[0].CUSTOMER_PRICE >= parseFloat(this.txtPrice.value))
            //     {
            //         let tmpConfObj =
            //         {
            //             id:'msgPrice',showTitle:true,title:this.t("msgPrice.title"),showCloseButton:true,width:'500px',height:'200px',
            //             button:[{id:"btn01",caption:this.t("msgPrice.btn01"),location:'after'}],
            //             content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgPrice.msg")}</div>)
            //         }
                    
            //         await dialog(tmpConfObj);
            //         return
            //     }
            // }
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
                            <Item location="after" locateInMenu="auto">
                                <NdButton id="btnNew" parent={this} icon="file" type="default"
                                onClick={()=>
                                {
                                    this.init(); 
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
                                <Item>
                                    <Label text={this.t("txtCustomerCode")} alignment="right" />
                                    <NdTextBox id="txtCustomerCode" parent={this} simple={true}  notRefresh = {true}
                                    onEnterKey={(async()=>
                                    {
                                        await this.pg_txtCustomerCode.setVal(this.txtCustomerCode.value)
                                        this.pg_txtCustomerCode.show()
                                        this.pg_txtCustomerCode.onClick = (data) =>
                                        { 
                                            if(data.length > 0)
                                            {
                                                this.txtCustomerCode.setState({value:data[0].TITLE})
                                                this.txtCustomerCode.CODE = data[0].CODE
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
                                                            this.txtCustomerCode.setState({value:data[0].TITLE})
                                                            this.txtCustomerCode.CODE = data[0].CODE
                                                        }
                                                    }
                                                }
                                            },
                                            {
                                                id:'02',
                                                icon:'clear',
                                                onClick:()=>
                                                {
                                                    this.txtCustomerCode.setState({value:''})
                                                    this.txtCustomerCode.CODE =''
                                                }
                                            },
                                        ]
                                    }
                                    >
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
                                    button=
                                    {
                                        {
                                            id:'01',
                                            icon:'more',
                                            onClick:()=>
                                            {
                                                console.log(1111)
                                            }
                                        }
                                    }
                                    >
                                        <Column dataField="CODE" caption={this.t("pg_txtCustomerCode.clmCode")} width={150} />
                                        <Column dataField="TITLE" caption={this.t("pg_txtCustomerCode.clmTitle")} width={500} defaultSortOrder="asc" />
                                        <Column dataField="TYPE_NAME" caption={this.t("pg_txtCustomerCode.clmTypeName")} width={150} />
                                        <Column dataField="GENUS_NAME" caption={this.t("pg_txtCustomerCode.clmGenusName")} width={150} filterType={"include"} filterValues={['Tedarikçi']}/>
                                        
                                    </NdPopGrid>
                                </Item> 
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
                                {/* cmbItemGroup */}
                                <Item>
                                    <Label text={this.t("cmbItemGroup")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbItemGroup"
                                    displayExpr="NAME"                       
                                    valueExpr="CODE"
                                    value=""
                                    showClearButton={true}
                                    searchEnabled={true}
                                    notRefresh = {true}
                                    onValueChanged={(async()=>
                                        {
                                        }).bind(this)}
                                    data={{source:{select:{query : "SELECT CODE,NAME FROM ITEM_GROUP ORDER BY NAME ASC"},sql:this.core.sql}}}
                                    param={this.param.filter({ELEMENT:'cmbItemGroup',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'cmbItemGroup',USERS:this.user.CODE})}
                                    button=
                                    {
                                        [
                                            {
                                                id:'02',
                                                icon:'clear',
                                                onClick:()=>
                                                {
                                                    this.cmbItemGroup.valueExpr =''
                                                }
                                            },
                                        ]
                                    }
                                    >
                                    </NdSelectBox>
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
                            height={'650'} 
                            width={'100%'}
                            filterRow={{visible:true}} 
                            columnAutoWidth={true}
                            allowColumnReordering={true}
                            loadPanel={{enabled:true}}
                            allowColumnResizing={true}
                            >                            
                                <Paging defaultPageSize={20} />
                                <Pager visible={true} allowedPageSizes={[5,10,50]} showPageSizeSelector={true} />
                                <Column dataField="ITEM_CODE" caption={this.t("grdExpdateList.clmCode")} visible={true} width={200}/> 
                                <Column dataField="ITEM_NAME" caption={this.t("grdExpdateList.clmName")} visible={true} width={300}/> 
                                <Column dataField="QUANTITY" caption={this.t("grdExpdateList.clmQuantity")} visible={true} width={100}/> 
                                <Column dataField="DIFF" caption={this.t("grdExpdateList.clmDiff")} visible={true} width={130}/> 
                                <Column dataField="REMAINDER" caption={this.t("grdExpdateList.clmRemainder")} visible={true} width={100}/> 
                                <Column dataField="EXP_DATE" caption={this.t("grdExpdateList.clmDate")} width={200} dataType="date" allowEditing={false}
                                editorOptions={{value:null}}
                                cellRender={(e) => 
                                {
                                    if(moment(e.value).format("YYYY-MM-DD") != '1970-01-01')
                                    {
                                        return e.text
                                    }
                                    
                                    return
                                }}/>
                                 <Column dataField="CUSTOMER_NAME" caption={this.t("grdExpdateList.clmCustomer")} visible={true}  allowEditing={false}/> 
                                 <Column dataField="REBATE" caption={this.t("grdExpdateList.clmRebate")} visible={true}  allowEditing={false}/> 
                                 <Column dataField="DESCRIPTION" caption={this.t("grdExpdateList.clmDescription")} visible={true}  allowEditing={false}/> 
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