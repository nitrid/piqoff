import React from 'react';
import App from '../../../lib/app.js';
import moment from 'moment';

import Toolbar,{Item} from 'devextreme-react/toolbar';
import Form, { Label } from 'devextreme-react/form';
import ScrollView from 'devextreme-react/scroll-view';

import NdGrid,{Column, ColumnChooser,ColumnFixing,Paging,Pager,Scrolling,Export} from '../../../../core/react/devex/grid.js';
import NdTextBox from '../../../../core/react/devex/textbox.js'
import NdSelectBox from '../../../../core/react/devex/selectbox.js';
import NdNumberBox from '../../../../core/react/devex/numberbox.js';
import NdDropDownBox from '../../../../core/react/devex/dropdownbox.js';
import NdListBox from '../../../../core/react/devex/listbox.js';
import NdPopUp from '../../../../core/react/devex/popup.js';
import NdButton from '../../../../core/react/devex/button.js';
import NdCheckBox from '../../../../core/react/devex/checkbox.js';
import NdDatePicker from '../../../../core/react/devex/datepicker.js';
import NdPopGrid from '../../../../core/react/devex/popgrid.js';
import { dialog } from '../../../../core/react/devex/dialog.js';

export default class salesOrdList extends React.Component
{
    constructor(props)
    {
        super(props)
        
        this.core = App.instance.core;
        this.groupList = [];
        this._btnGetClick = this._btnGetClick.bind(this)
        this.btnGetDetail = this.btnGetDetail.bind(this)
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
        this.dtFirst.value=moment(new Date()).format("YYYY-MM-DD");
        this.dtLast.value=moment(new Date()).format("YYYY-MM-DD");
        this.txtCustomerCode.CODE = ''
    }
    async _btnGetClick()
    {
        
        let tmpSource =
        {
            source : 
            {
                groupBy : this.groupList,
                select : 
                {
                    query :  "SELECT "  +
                    " MAX(ITEM_CODE) AS ITEM_CODE,  "  +
                    " MAX(ITEM_NAME) AS ITEM_NAME,  "  +
                    " MAX(TIME) AS TIME,  "  +
                    " MAX(DATE) AS DATE,  "  +
                    " MAX(DEVICE) AS DEVICE,  "  +
                    " MAX(USERS) AS USERS, "  +
                    " SUBSTRING(CONVERT(NVARCHAR(50),SALE_POS_GUID),20,25) AS POS_ID, "  +
                    " SALE_POS_GUID AS POS_GUID, " +
                    " MAX(SALE_TYPE) AS SALE_TYPE,  "  +
                    " COUNT(PAYMENT_TYPE) AS PAY_COUNT,  "  +
                    " MAX(CUSTOMER) AS CUSTOMER,  "  +
                    " MAX(DISCOUNT) AS DISCOUNT,  "  +
                    " MAX(LOYALTY) AS LOYALTY,  "  +
                    " MAX(HT) AS HT,  "  +
                    " MAX(TVA) AS TVA,  "  +
                    " MAX(TTC) AS TTC,  "  +
                    " MAX(PAYMENT) AS PAYMENT  "  +
                    " FROM (  "  +
                    " SELECT  "  +
                    "SALE.POS_GUID AS SALE_POS_GUID, "  +
                    "PAYMENT.POS_GUID AS PAYMENT_POS_GUID, "  +
                    " MAX(SALE.ITEM_CODE) AS ITEM_CODE,  "  +
                    " MAX(SALE.ITEM_NAME) AS ITEM_NAME,  "  +
                    " CONVERT(NVARCHAR,MAX(SALE.CDATE),101) AS DATE,   "  +
                    " CONVERT(NVARCHAR,MAX(SALE.CDATE),108) AS TIME,   "  +
                    " MAX(SALE.DEVICE) AS DEVICE,  "  +
                    " ISNULL((SELECT NAME FROM USERS WHERE CODE = MAX(SALE.LUSER)),'') AS USERS,  "  +
                    " SALE.TYPE AS SALE_TYPE,  "  +
                    " PAYMENT.TYPE AS PAYMENT_TYPE,  "  +
                    "PAYMENT.PAY_TYPE_NAME AS PAY_TYPE_NAME, "  +
                    " MAX(SALE.CUSTOMER_CODE) AS CUSTOMER,  "  +
                    " ROUND(MAX(SALE.GRAND_DISCOUNT),2) DISCOUNT,  "  +
                    " ROUND(MAX(SALE.GRAND_LOYALTY),2) LOYALTY,  "  +
                    " ROUND(MAX(SALE.GRAND_AMOUNT),2) HT, "  +
                    " ROUND(MAX(SALE.GRAND_VAT),2) TVA, "  +
                    " ROUND(MAX(SALE.GRAND_TOTAL),2) TTC,  "  +
                    " ROUND((SELECT SUM(AMOUNT) FROM [POS_PAYMENT_VW_01] AS PAY WHERE PAY.POS_GUID = SALE.POS_GUID ) ,2) AS PAYMENT   "  +
                    " FROM [dbo].[POS_SALE_VW_01] AS SALE  "  +
                    " INNER JOIN [dbo].[POS_PAYMENT_VW_01] AS PAYMENT ON  "  +
                    " PAYMENT.POS_GUID = SALE.POS_GUID AND PAYMENT.STATUS = 1  "  +
                    " WHERE SALE.DOC_DATE >= @FIRST_DATE AND SALE.DOC_DATE <= @LAST_DATE AND   "  +
                    " ((SALE.CUSTOMER_CODE = @CUSTOMER_CODE) OR (@CUSTOMER_CODE = '')) AND  "  +
                    " ((SALE.DEVICE = @DEVICE) OR (@DEVICE = '')) AND  "  +
                    " ((PAYMENT.TYPE = @PAY_TYPE) OR (@PAY_TYPE = -1)) AND  "  +
                    " ((ITEM_CODE = @ITEM_CODE) OR (@ITEM_CODE = '')) AND  ((SUBSTRING(CONVERT(NVARCHAR(50),SALE.POS_GUID),19,25) = @TICKET_ID) OR (@TICKET_ID = '')) AND "  +
                    " ((SALE.LUSER = @LUSER) OR (@LUSER = '')) AND SALE.STATUS = 1  "  +
                    " GROUP BY SALE.TYPE,PAYMENT.TYPE,PAYMENT.PAY_TYPE_NAME,PAYMENT.POS_GUID,SALE.POS_GUID) AS TMP  "  +
                    "GROUP BY SALE_POS_GUID,PAYMENT_POS_GUID HAVING COUNT(PAYMENT_TYPE) >= @PAY_COUNT",
                    param : ['FIRST_DATE:date','LAST_DATE:date','CUSTOMER_CODE:string|50','DEVICE:string|25','PAY_TYPE:int','ITEM_CODE:string|50','TICKET_ID:string|50','LUSER:string|50','PAY_COUNT:string|50'],
                    value : [this.dtFirst.value,this.dtLast.value,this.txtCustomerCode.value,this.cmbDevice.value,-1,this.txtItem.value,this.txtTicketno.value,this.cmbUser.value,this.ckhDoublePay.value ? 2 : 1]
                },
                sql : this.core.sql
            }
        }
        await this.grdSaleTicketReport.dataRefresh(tmpSource)
    }
    async btnGetDetail(pGuid)
    {
        let tmpItemsSource =
        {
            source : 
            {
                groupBy : this.groupList,
                select : 
                {
                    query :  "SELECT BARCODE,ITEM_NAME,QUANTITY,PRICE,TOTAL FROM POS_SALE_VW_01  WHERE POS_GUID = @POS_GUID ",
                    param : ['POS_GUID:string|50'],
                    value : [pGuid]
                },
                sql : this.core.sql
            }
        }
        await this.grdSaleTicketItems.dataRefresh(tmpItemsSource)
        let tmpPaysSource =
        {
            source : 
            {
                groupBy : this.groupList,
                select : 
                {
                    query :  "SELECT PAY_TYPE_NAME,(AMOUNT-CHANGE) AS LINE_TOTAL FROM POS_PAYMENT_VW_01  WHERE POS_GUID = @POS_GUID ",
                    param : ['POS_GUID:string|50'],
                    value : [pGuid]
                },
                sql : this.core.sql
            }
        }
        await this.grdSaleTicketPays.dataRefresh(tmpPaysSource)

        this.popDetail.show()
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
                            <Form colCount={4} id="frmCriter">
                                {/* dtFirst */}
                                <Item>
                                    <Label text={this.t("dtFirst")} alignment="right" />
                                    <NdDatePicker simple={true}  parent={this} id={"dtFirst"}
                                    >
                                    </NdDatePicker>
                                </Item>
                                {/* dtLast */}
                                <Item>
                                    <Label text={this.t("dtLast")} alignment="right" />
                                    <NdDatePicker simple={true}  parent={this} id={"dtLast"}
                                    >
                                    </NdDatePicker>
                                </Item>
                                <Item>
                                <Label text={this.t("txtCustomerCode")} alignment="right" />
                                <NdTextBox id="txtCustomerCode" parent={this} simple={true}  
                                upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
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
                                                        this.txtCustomerCode.setState({value:data[0].CODE})
                                                    }
                                                }
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
                                    <Column dataField="GENUS_NAME" caption={this.t("pg_txtCustomerCode.clmGenusName")} width={150}/>
                                    
                                </NdPopGrid>
                                </Item> 
                                {/* cmbDevice */}
                                <Item>
                                    <Label text={this.t("cmbDevice")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbDevice"
                                    displayExpr="DISPLAY"                       
                                    valueExpr="CODE"
                                    showClearButton={true}
                                    data={{source:{select:{query:"SELECT CODE + '-' + NAME AS DISPLAY,CODE,NAME FROM POS_DEVICE_VW_01 ORDER BY CODE ASC"},sql:this.core.sql}}}
                                    param={this.param.filter({ELEMENT:'cmbDevice',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'cmbDevice',USERS:this.user.CODE})}
                                    />
                                </Item>
                                {/* txtTicketno */}
                                <Item>
                                    <Label text={this.t("txtTicketno")} alignment="right" />
                                    <NdTextBox id="txtTicketno" title={this.t("txtTicketno")} parent={this} simple={true} 
                                        param={this.param.filter({ELEMENT:'txtTicketno',USERS:this.user.CODE})}
                                        access={this.access.filter({ELEMENT:'txtTicketno',USERS:this.user.CODE})}
                                        onValueChanged={(e)=>
                                        {
                                        
                                        }}>
                                    </NdTextBox>
                                </Item>
                                {/* numTicketAmount */}
                                <Item>
                                    <Label text={this.t("numTicketAmount")} alignment="right" />
                                    <NdNumberBox id="numTicketAmount" title={this.t("numTicketAmount")} parent={this} simple={true} tabIndex={this.tabIndex} style={{borderTopLeftRadius:'0px',borderBottomLeftRadius:'0px'}} 
                                        param={this.param.filter({ELEMENT:'numTicketAmount',USERS:this.user.CODE})}
                                        access={this.access.filter({ELEMENT:'numTicketAmount',USERS:this.user.CODE})}>
                                    </NdNumberBox>
                                </Item>
                               {/* cmbPayType */}
                               <Item>
                                    <Label text={this.t("cmbPayType")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbPayType"
                                    displayExpr="DISPLAY"                       
                                    valueExpr="CODE"
                                    showClearButton={true}
                                    data={{source:{select:{query:""},sql:this.core.sql}}}
                                    param={this.param.filter({ELEMENT:'cmbPayType',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'cmbPayType',USERS:this.user.CODE})}
                                    />
                                </Item>
                                 {/* cmbUser */}
                               <Item>
                                    <Label text={this.t("cmbUser")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbUser"
                                    displayExpr="NAME"                       
                                    valueExpr="CODE"
                                    showClearButton={true}
                                    data={{source:{select:{query:"SELECT CODE,NAME FROM USERS"},sql:this.core.sql}}}
                                    param={this.param.filter({ELEMENT:'cmbUser',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'cmbUser',USERS:this.user.CODE})}
                                    />
                                </Item>
                                       {/* txtItem */}
                                       <Item>                                    
                                    <Label text={this.t("txtItem")} alignment="right" />
                                    <NdTextBox id="txtItem" parent={this} simple={true} tabIndex={this.tabIndex}
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    showClearButton = {true}
                                    button=
                                    {
                                        [
                                            {
                                                id:'01',
                                                icon:'more',
                                                onClick:()=>
                                                {
                                                    this.pg_txtItem.show()
                                                    this.pg_txtItem.onClick = (data) =>
                                                    {
                                                        this.txtItem.setState({value:data[0].CODE})
                                                    }
                                                }
                                            },
                                        ]
                                    }
                                    param={this.param.filter({ELEMENT:'txtItem',USERS:this.user.CODE})} 
                                    access={this.access.filter({ELEMENT:'txtItem',USERS:this.user.CODE})}     
                                    selectAll={true}                           
                                    >     
                                    </NdTextBox>      
                                    {/* STOK SEÇİM POPUP */}
                                    <NdPopGrid id={"pg_txtItem"} parent={this} container={"#root"} 
                                    visible={false}
                                    position={{of:'#root'}} 
                                    showTitle={true} 
                                    showBorders={true}
                                    width={'90%'}
                                    height={'90%'}
                                    title={this.t("pg_txtItem.title")} 
                                    search={true}
                                    selection={{mode:"single"}} 
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
                                                }
                                            }
                                        ]
                                    }
                                    >
                                        <Column dataField="CODE" caption={this.t("pg_txtItem.clmCode")} width={150} />
                                        <Column dataField="NAME" caption={this.t("pg_txtItem.clmName")} width={650} defaultSortOrder="asc" />
                                    </NdPopGrid>
                                </Item>
                                {/* ckhDoublePay */}
                                <Item>
                                    <Label text={this.t("ckhDoublePay")} alignment="right" />
                                    <NdCheckBox id="ckhDoublePay" parent={this} defaultValue={false}
                                    param={this.param.filter({ELEMENT:'ckhDoublePay',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'ckhDoublePay',USERS:this.user.CODE})}/>
                                </Item>
                            </Form>
                        </div>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-3">
                        </div>
                        <div className="col-3">
                            
                        </div>
                        <div className="col-3">
                            
                        </div>
                        <div className="col-3">
                            <NdButton text={this.t("btnGet")} type="success" width="100%" onClick={this._btnGetClick}></NdButton>
                        </div>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <NdGrid id="grdSaleTicketReport" parent={this} 
                            selection={{mode:"multiple"}} 
                            showBorders={true}
                            filterRow={{visible:true}} 
                            headerFilter={{visible:true}}
                            columnAutoWidth={true}
                            allowColumnReordering={true}
                            allowColumnResizing={true}
                            onRowDblClick={async(e)=>
                                {
                                  this.btnGetDetail(e.data.POS_GUID)
                                }}
                            >                            
                                <Paging defaultPageSize={20} />
                                <Pager visible={true} allowedPageSizes={[5,10,50]} showPageSizeSelector={true} />
                                <Export fileName={this.lang.t("menu.pos_02_001")} enabled={true} allowExportSelectedData={true} />
                                <Column dataField="DATE" caption={this.t("grdSaleTicketReport.clmDate")} visible={true} width={150}/> 
                                <Column dataField="TIME" caption={this.t("grdSaleTicketReport.clmTime")} visible={true} width={100}/> 
                                <Column dataField="USERS" caption={this.t("grdSaleTicketReport.slmUser")} visible={true} width={100}/> 
                                <Column dataField="CUSTOMER_NAME" caption={this.t("grdSaleTicketReport.clmCustomer")} visible={true} width={300}/> 
                                <Column dataField="DISCOUNT" caption={this.t("grdSaleTicketReport.clmDiscount")} visible={true} width={100} format={{ style: "currency", currency: "EUR",precision: 2}}/> 
                                <Column dataField="LOYALYT" caption={this.t("grdSaleTicketReport.clmLoyalyt")} visible={true} width={100} format={{ style: "currency", currency: "EUR",precision: 2}}/> 
                                <Column dataField="HT" caption={this.t("grdSaleTicketReport.clmHT")} visible={true} width={100} format={{ style: "currency", currency: "EUR",precision: 2}}/> 
                                <Column dataField="TVA" caption={this.t("grdSaleTicketReport.clmVTA")} visible={true} width={100} format={{ style: "currency", currency: "EUR",precision: 2}}/>  
                                <Column dataField="TTC" caption={this.t("grdSaleTicketReport.clmTTC")} visible={true} width={100} format={{ style: "currency", currency: "EUR",precision: 2}}/>  
                                <Column dataField="POS_ID" caption={this.t("grdSaleTicketReport.clmTicketID")} visible={true} /> 

                            </NdGrid>
                        </div>
                    </div>
                    <NdPopUp parent={this} id={"popDetail"} 
                        visible={false}                        
                        showCloseButton={true}
                        showTitle={true}
                        title={this.t("popDetail.title")}
                        container={"#root"} 
                        width={'100%'}
                        height={'100%'}
                        position={{of:'#root'}}
                        >
                         
                          <div className="row">
                          <div className="col-1 pe-0"></div>
                            <div className="col-6 pe-0">
                            <NdGrid id="grdSaleTicketItems" parent={this} 
                                selection={{mode:"multiple"}} 
                                showBorders={true}
                                filterRow={{visible:true}} 
                                headerFilter={{visible:true}}
                                columnAutoWidth={true}
                                allowColumnReordering={true}
                                allowColumnResizing={true}
                                onRowDblClick={async(e)=>
                                    {
                                    }}
                                >                            
                                    <Paging defaultPageSize={20} />
                                    <Pager visible={true} allowedPageSizes={[5,10,50]} showPageSizeSelector={true} />
                                    <Export fileName={this.lang.t("menu.pos_02_001")} enabled={true} allowExportSelectedData={true} />
                                    <Column dataField="BARCODE" caption={this.t("grdSaleTicketItems.clmBarcode")} visible={true} width={150}/> 
                                    <Column dataField="ITEM_NAME" caption={this.t("grdSaleTicketItems.clmName")} visible={true} width={250}/> 
                                    <Column dataField="QUANTITY" caption={this.t("grdSaleTicketItems.clmQuantity")} visible={true} width={100}/> 
                                    <Column dataField="PRICE" caption={this.t("grdSaleTicketItems.clmPrice")} visible={true} width={150} format={{ style: "currency", currency: "EUR",precision: 2}}/> 
                                    <Column dataField="TOTAL" caption={this.t("grdSaleTicketItems.clmTotal")} visible={true} width={150} format={{ style: "currency", currency: "EUR",precision: 2}}/> 
                            </NdGrid>
                            </div>
                            <div className="col-4 ps-0">
                            <NdGrid id="grdSaleTicketPays" parent={this} 
                                selection={{mode:"multiple"}} 
                                showBorders={true}
                                filterRow={{visible:true}} 
                                headerFilter={{visible:true}}
                                columnAutoWidth={true}
                                allowColumnReordering={true}
                                allowColumnResizing={true}
                                onRowDblClick={async(e)=>
                                    {
                                    
                                    }}
                                >                            
                                    <Paging defaultPageSize={20} />
                                    <Pager visible={true} allowedPageSizes={[5,10,50]} showPageSizeSelector={true} />
                                    <Export fileName={this.lang.t("menu.pos_02_001")} enabled={true} allowExportSelectedData={true} />
                                    <Column dataField="PAY_TYPE_NAME" caption={this.t("grdSaleTicketPays.clmPayName")} visible={true} width={200}/> 
                                    <Column dataField="LINE_TOTAL" caption={this.t("grdSaleTicketPays.clmTotal")} visible={true} format={{ style: "currency", currency: "EUR",precision: 2}}/> 
                            </NdGrid>
                            </div>
                            </div>
                        </NdPopUp>
                </ScrollView>
            </div>
        )
    }
}