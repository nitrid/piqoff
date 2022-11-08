import React from 'react';
import NdTextBox, { Validator, NumericRule, RequiredRule, CompareRule, EmailRule, PatternRule, StringLengthRule, RangeRule, AsyncRule } from '../../core/react/devex/textbox.js'
import NdPopUp from '../../core/react/devex/popup.js';
import NdGrid,{Column,Editing,Paging,Scrolling} from '../../core/react/devex/grid.js';
import NdPopGrid from '../../core/react/devex/popgrid.js';
import NdSelectBox from '../../core/react/devex/selectbox.js';
import NdDatePicker from '../../core/react/devex/datepicker.js';
import App from '../lib/app.js';
import { datatable } from '../../core/core.js';
import TextBox from 'devextreme-react/text-box';
import ScrollView from 'devextreme-react/scroll-view';
import Toolbar from 'devextreme-react/toolbar';
import NdButton from '../../core/react/devex/button.js';
import Form, { Label,Item } from 'devextreme-react/form';
import NdNumberBox from '../../core/react/devex/numberbox.js';
import NdImageUpload from '../../core/react/devex/imageupload.js';
import moment from 'moment';
export default class Test extends React.PureComponent
{
    constructor(props)
    {
        console.log("1 - " + moment(new Date()).format("YYYY-MM-DD HH:mm:ss SSS"))
        super(props)
        
        this.core = App.instance.core;
        //this.sysprm = this.param.
        //this.onSelectionChanged = this.onSelectionChanged.bind(this);
        //console.log(Button)
        
        //console.log(this.access.filter({ELEMENT:'txtSeri',USERS:this.user.CODE}))
        
        //console.log(this.param)
        //console.log(this.param.filter({ELEMENT:'txtSeri'}))

        //this.param.filter({ELEMENT:'txtSeri'}).setValue("112233");
        //this.param.filter({ELEMENT:'txtS'}).setValue({"KODU":"001"})
        //this.param.add({ID:"001",VALUE:"test"})
        //this.param.filter({ELEMENT_ID:'txtSeri'}).setValue()
        // this.access.filter({ELEMENT:'txtSeri',USERS:this.user.CODE}).setValue({"editable":true})
        // this.access.add({ID:"001",VALUE:"test"})
    }
    async componentDidMount() 
    {        
        //this.popgrid.show()

        // this.core.socket.emit('devprint',"{TYPE:'PRINT',PATH:'C:\\\\Project\\\\piqoff\\\\plugins\\\\devprint\\\\repx\\\\test\\\\test.repx',DATA:[{KODU:'001'}]}",(pResult) => 
        // {
        //     console.log(pResult)
        //     if(pResult.split('|')[0] != 'ERR')
        //     {
        //         var mywindow = window.open('printview.html','_blank',"width=900,height=1000,left=500");      
        //         mywindow.onload = function() 
        //         {
        //             mywindow.document.getElementById("view").innerHTML="<iframe src='data:application/pdf;base64," + pResult.split('|')[1] + "' type='application/pdf' width='100%' height='100%'></iframe>"      
        //         }   
        //     }
        // });
        //this.txtSeri.value = "aa"
        //this.txtSira.value = "100"
        // await this.access.save()
        //await this.param.save()
        //console.log(this.param)
        //this.pop.show()
        // this.test.setState(
        //     {
        //         showBorders : true,
        //         width : '100%',
        //         height : '100%',
        //         selection : {mode:"multiple"}
        //     }
        // )
        
        // let source = 
        // {
        //     source : 
        //     {
        //         select : 
        //         {
        //             query : "SELECT * FROM USERS ",
        //         },
        //         update : 
        //         {
        //             query : "UPDATE USERS SET NAME = @NAME WHERE CODE = @CODE",
        //             param : ['CODE:string|25','NAME:string|25']
        //         },
        //         insert : 
        //         {
        //             query : "INSERT INTO USERS (CODE,NAME,PWD,ROLE,SHA,STATUS) VALUES (@CODE,@NAME,'','','',1) ",
        //             param : ['CODE:string|25','NAME:string|25']
        //         },
        //         sql : this.core.sql
        //     }
        // }
        // await this.test.dataRefresh(source);

        // let tmp = 
        // {
        //     source:
        //     {
        //         select : 
        //         {
        //             query : "SELECT CODE,NAME,GUID FROM USERS ",
        //         },
        //         sql : this.core.sql
        //     }
        // }
        // await this.sbDepo.dataRefresh(tmp)

        console.log("2 - " + moment(new Date()).format("YYYY-MM-DD HH:mm:ss SSS"))
    }
    render()
    {
        console.log("3 - " + moment(new Date()).format("YYYY-MM-DD HH:mm:ss SSS"))
        return (
            <ScrollView>
                <div className="row px-2 pt-2">
                    <div className="col-12">
                        <Toolbar>
                            <Item location="after" locateInMenu="auto">
                                <NdButton id="btnBack" parent={this} icon="revert" type="default"
                                onClick={()=>
                                {
                                    if(this.prevCode != '')
                                    {
                                        this.getItem(this.prevCode); 
                                    }
                                }}/>
                            </Item>
                            <Item location="after" locateInMenu="auto">
                                <NdButton id="btnNew" parent={this} icon="file" type="default"
                                onClick={()=>
                                {
                                    this.init(); 
                                }}/>
                            </Item>
                            <Item location="after" locateInMenu="auto">
                                <NdButton id="btnSave" parent={this} icon="floppy" type="default" validationGroup={"frmItems" + this.tabIndex}/>
                            </Item>
                            <Item location="after" locateInMenu="auto">
                                <NdButton id="btnDelete" parent={this} icon="trash" type="default"/>
                            </Item>
                            <Item location="after" locateInMenu="auto">
                                <NdButton id="btnCopy" parent={this} icon="copy" type="default"
                                onClick={()=>
                                {
                                    
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
                <div className="row px-2 pt-2">                        
                    <div className="col-9">
                        <Form colCount={2} id={"frmItems" + this.tabIndex}>
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
                                                        this.getItem(data[0].CODE)
                                                    }
                                                }
                                            }
                                        },
                                        {
                                            id:'02',
                                            icon:'arrowdown',
                                            onClick:()=>
                                            {
                                                this.txtRef.value = Math.floor(Date.now() / 1000)
                                            }
                                        }
                                    ]
                                }
                                onChange={(async()=>
                                {
                                    let tmpResult = await this.checkItem(this.txtRef.value)
                                    if(tmpResult == 3)
                                    {
                                        this.txtRef.value = "";
                                    }
                                }).bind(this)} 
                                param={this.param.filter({ELEMENT:'txtRef',USERS:this.user.CODE})} 
                                access={this.access.filter({ELEMENT:'txtRef',USERS:this.user.CODE})}     
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
                                            query : "SELECT GUID,CODE,NAME FROM ITEMS_VW_01 WHERE UPPER(CODE) LIKE UPPER(@VAL) OR UPPER(NAME) LIKE UPPER(@VAL)",
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
                                    <Column dataField="CODE" caption={this.t("pg_txtRef.clmCode")} width={150} />
                                    <Column dataField="NAME" caption={this.t("pg_txtRef.clmName")} width={650} defaultSortOrder="asc" />
                                </NdPopGrid>
                            </Item>
                            {/* cmbItemGrp */}
                            <Item>
                                <Label text={this.t("cmbItemGrp")} alignment="right" />
                                <NdSelectBox simple={true} parent={this} id="cmbItemGrp" tabIndex={this.tabIndex}
                                displayExpr="NAME"                       
                                valueExpr="CODE"
                                value=""
                                searchEnabled={true} 
                                showClearButton={true}
                                pageSize ={50}
                                notRefresh={true}
                                param={this.param.filter({ELEMENT:'cmbItemGrp',USERS:this.user.CODE})}
                                access={this.access.filter({ELEMENT:'cmbItemGrp',USERS:this.user.CODE})}
                                data={{source:{select:{query : "SELECT CODE,NAME FROM ITEM_GROUP ORDER BY NAME ASC"},sql:this.core.sql}}}
                                onValueChanged={(e)=>
                                {
                                    this.itemGrpForOrginsValidCheck()
                                    this.taxSugarValidCheck()
                                    this.itemGrpForMinMaxAccessCheck()
                                }}
                                />
                            </Item>
                            {/* txtCustomer */}
                            <Item>
                                <Label text={this.t("txtCustomer")} alignment="right" />
                                <NdTextBox id="txtCustomer" parent={this} simple={true}
                                upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                readOnly={true}
                                displayValue={""}
                                button={[
                                {
                                    id:'001',
                                    icon:'add',
                                    onClick:()=>
                                    {
                                        this.txtPopCustomerCode.value = "";
                                        this.txtPopCustomerName.value = "";
                                        this.txtPopCustomerItemCode.value = "";
                                        this.txtPopCustomerPrice.value = "0";
                                        this.popCustomer.show();
                                    }
                                }]}
                                param={this.param.filter({ELEMENT:'txtCustomer',USERS:this.user.CODE})}
                                access={this.access.filter({ELEMENT:'txtCustomer',USERS:this.user.CODE})}>
                                </NdTextBox>
                            </Item>
                            {/* cmbItemGenus */}
                            <Item>
                                <Label text={this.t("cmbItemGenus")} alignment="right" />
                                <NdSelectBox simple={true} parent={this} id="cmbItemGenus" 
                                displayExpr="VALUE"                       
                                valueExpr="ID"
                                data={{source:{select:{query:"SELECT ID,VALUE FROM ITEM_TYPE ORDER BY ID ASC"},sql:this.core.sql}}}
                                param={this.param.filter({ELEMENT:'cmbItemGenus',USERS:this.user.CODE})}
                                access={this.access.filter({ELEMENT:'cmbItemGenus',USERS:this.user.CODE})}
                                />
                            </Item>
                            {/* txtBarcode */}
                            <Item>
                                <Label text={this.t("txtBarcode")} alignment="right" />
                                <NdTextBox id="txtBarcode" parent={this} simple={true}
                                upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                button=
                                {
                                    [
                                        {
                                            id:'001',
                                            icon:'add',
                                        }
                                    ]
                                }
                                onChange={(async()=>
                                {
                                    await this.checkBarcode(this.txtBarcode.value)
                                }).bind(this)}
                                param={this.param.filter({ELEMENT:'txtBarcode',USERS:this.user.CODE})}
                                access={this.access.filter({ELEMENT:'txtBarcode',USERS:this.user.CODE})}
                                >
                                </NdTextBox>
                            </Item>  
                            {/* cmbTax */}
                            <Item>
                                <Label text={this.t("cmbTax")} alignment="right" />
                                <NdSelectBox simple={true} parent={this} id="cmbTax" height='fit-content'
                                displayExpr="VAT"                       
                                valueExpr="VAT"
                                data={{source:{select:{query:"SELECT VAT FROM VAT ORDER BY ID ASC"},sql:this.core.sql}}}
                                param={this.param.filter({ELEMENT:'cmbTax',USERS:this.user.CODE})}
                                access={this.access.filter({ELEMENT:'cmbTax',USERS:this.user.CODE})}
                                />
                            </Item>                              
                            {/* cmbMainUnit */}
                            <Item>
                                <Label text={this.t("cmbMainUnit")} alignment="right" />
                                <div className="row">
                                    <div className="col-4 pe-0">
                                        <NdSelectBox simple={true} parent={this} id="cmbMainUnit" height='fit-content' 
                                        style={{borderTopRightRadius:'0px',borderBottomRightRadius:'0px'}}
                                        displayExpr="NAME"                       
                                        valueExpr="ID"
                                        data={{source:{select:{query:"SELECT ID,NAME,SYMBOL FROM UNIT ORDER BY ID ASC"},sql:this.core.sql}}}
                                        param={this.param.filter({ELEMENT:'cmbMainUnit',USERS:this.user.CODE})}
                                        access={this.access.filter({ELEMENT:'cmbMainUnit',USERS:this.user.CODE})}
                                        />
                                    </div>
                                    <div className="col-5 ps-0">
                                        <NdNumberBox id="txtMainUnit" parent={this} simple={true} tabIndex={this.tabIndex} style={{borderTopLeftRadius:'0px',borderBottomLeftRadius:'0px'}} 
                                        showSpinButtons={true} step={1.0} format={"###.000"}
                                        param={this.param.filter({ELEMENT:'txtMainUnit',USERS:this.user.CODE})}
                                        access={this.access.filter({ELEMENT:'txtMainUnit',USERS:this.user.CODE})}>
                                        </NdNumberBox>
                                    </div>
                                </div>
                            </Item>     
                            {/* cmbOrigin */}
                            <Item>
                                <Label text={this.t("cmbOrigin")} alignment="right" />
                                <NdSelectBox simple={true} parent={this} id="cmbOrigin"
                                displayExpr="NAME"                       
                                valueExpr="CODE"
                                value=""
                                searchEnabled={true} showClearButton={true}
                                param={this.param.filter({ELEMENT:'cmbOrigin',USERS:this.user.CODE})}
                                access={this.access.filter({ELEMENT:'cmbOrigin',USERS:this.user.CODE})}
                                data={{source:{select:{query : "SELECT CODE,NAME FROM COUNTRY ORDER BY CODE ASC"},sql:this.core.sql}}}
                                onValueChanged={(e)=>
                                    {
                                        this.taxSugarValidCheck()
                                    }}
                                >
                                    <Validator>
                                        <RequiredRule message="Menşei boş geçemezsiniz !" />
                                    </Validator>
                                </NdSelectBox>                                    
                            </Item>                           
                            {/* cmbUnderUnit */}
                            <Item>
                                <Label text={this.t("cmbUnderUnit")} alignment="right" />
                                <div className="row">
                                    <div className="col-4 pe-0">
                                        <NdSelectBox simple={true} parent={this} id="cmbUnderUnit" height='fit-content' 
                                        style={{borderTopRightRadius:'0px',borderBottomRightRadius:'0px'}}
                                        displayExpr="NAME"                       
                                        valueExpr="ID"
                                        data={{source:{select:{query:"SELECT ID,NAME,SYMBOL FROM UNIT ORDER BY ID ASC"},sql:this.core.sql}}}
                                        param={this.param.filter({ELEMENT:'cmbUnderUnit',USERS:this.user.CODE})}
                                        access={this.access.filter({ELEMENT:'cmbUnderUnit',USERS:this.user.CODE})}
                                        />
                                    </div>
                                    <div className="col-5 ps-0">
                                        <NdNumberBox id="txtUnderUnit" parent={this} simple={true} tabIndex={this.tabIndex} style={{borderTopLeftRadius:'0px',borderBottomLeftRadius:'0px'}} 
                                        showSpinButtons={true} step={0.1} format={"##0.000"}
                                        param={this.param.filter({ELEMENT:'txtUnderUnit',USERS:this.user.CODE})}
                                        access={this.access.filter({ELEMENT:'txtUnderUnit',USERS:this.user.CODE})}>
                                        </NdNumberBox>
                                    </div>
                                    <div className="col-3 pe-0">
                                        <div className="dx-field-label" style={{width:"100%"}}>0 €</div>
                                    </div>
                                </div>                                     
                            </Item>   
                            {/* TaxSugar */}
                            <Item>
                                <Label text={this.t("txtTaxSugar")} alignment="right" />
                                <NdNumberBox id="txtTaxSugar" parent={this} simple={true} readOnly={true}
                                param={this.param.filter({ELEMENT:'txtTaxSugar',USERS:this.user.CODE})}
                                access={this.access.filter({ELEMENT:'txtTaxSugar',USERS:this.user.CODE})}
                                onChange={()=>
                                {
                                    this.taxSugarCalculate()
                                }}>
                                    <Validator>
                                        <RequiredRule message="Şeker Oranını Girmelisiniz !" />
                                    </Validator>
                                </NdNumberBox>
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
                                    if(e.value.length <= 32)
                                        this.txtShortName.value = e.value.toUpperCase()
                                }}>
                                    <Validator validationGroup={"frmItems" + this.tabIndex}>
                                        <RequiredRule message="Adı boş geçemezsiniz !" />
                                    </Validator> 
                                </NdTextBox>
                            </Item>
                            {/* txtShortName */}
                            <Item>
                                <Label text={this.t("txtShortName")} alignment="right" />
                                    <NdTextBox id="txtShortName" parent={this} simple={true}
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    maxLength={32}
                                    param={this.param.filter({ELEMENT:'txtShortName',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'txtShortName',USERS:this.user.CODE})}
                                    />
                            </Item>
                        </Form>
                    </div>
                    <div className="col-3">
                        <div className='row'>
                            <div className='col-12'>                                
                                <NdImageUpload id="imgFile" parent={this} />
                            </div>
                        </div>
                        <div className='row pt-2'>
                        <div className='col-6'>
                                <NdButton id="btnNewImg" parent={this} icon="add" type="default" width='100%'
                                />
                            </div>
                            <div className='col-6'>
                                <NdButton id="btnImgDel" parent={this} icon="trash" type="default" width='100%'/>
                            </div>
                        </div>
                        
                    </div>
                </div>
            </ScrollView>
        )
    }
}