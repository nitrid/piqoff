import React from "react";
import App from "../lib/app.js";

import Toolbar,{Item} from 'devextreme-react/toolbar';
import Form, { Label,EmptyItem } from 'devextreme-react/form';
import ScrollView from 'devextreme-react/scroll-view';

import NdGrid,{Column, ColumnChooser,ColumnFixing,Paging,Pager,Scrolling,Export} from '../../core/react/devex/grid.js';
import NdTextBox from '../../core/react/devex/textbox.js'
import NdSelectBox from '../../core/react/devex/selectbox.js';
import NdPopUp from '../../core/react/devex/popup.js';
import NdButton from '../../core/react/devex/button.js';
import { dialog } from '../../core/react/devex/dialog.js';
import NbKeyboard from "../../core/react/bootstrap/keyboard.js";
export default class posCustomerPointReport extends React.PureComponent
{
    constructor(props)
    {
        super(props);

        this.core = App.instance.core;
        this.lang = App.instance.lang;
        this.user = this.core.auth.data
        this.prmObj = App.instance.prmObj

        Number.money = this.prmObj.filter({ID:'MoneySymbol',TYPE:0}).getValue()

        this.groupList = [];
        this.btnGetClick = this.btnGetClick.bind(this)
        this.btnAddPoint = this.btnAddPoint.bind(this)
        this.btnPointPopup = this.btnPointPopup.bind(this)
        this.state={ticketId :""}
    }
    componentDidMount()
    {
        setTimeout(()=>
        {
            this.txtCustomerCode.CODE = ''
        },1000)
    }
    async btnGetClick()
    {        
        let tmpSource =
        {
            source : 
            {
                groupBy : this.groupList,
                select : 
                {
                    query : "SELECT GUID,CODE,TITLE,CUSTOMER_POINT AS POINT,(CUSTOMER_POINT / 100) AS EURO,ISNULL((SELECT TOP 1 (CONVERT(NVARCHAR, LDATE, 101) + ' ' + CONVERT(NVARCHAR, LDATE, 24))  " + 
                            "FROM CUSTOMER_POINT WHERE CUSTOMER_POINT.CUSTOMER = CUSTOMER_VW_02.GUID ORDER BY LDATE DESC),'') AS LDATE_FORMAT FROM [dbo].[CUSTOMER_VW_02] WHERE ((CODE = @CODE) OR (@CODE = '')) ",
                    param : ['CODE:string|50'],
                    value : [this.txtCustomerCode.value]
                },
                sql : this.core.sql
            }
        }
        App.instance.setState({isExecute:true})
        await this.grdCustomerPointReport.dataRefresh(tmpSource)
        let tmpTotal = 0
        for (let i = 0; i < this.grdCustomerPointReport.data.datatable.length; i++) 
        {
            tmpTotal = tmpTotal + this.grdCustomerPointReport.data.datatable[i].EURO
        }
        this.txtAmount.value = tmpTotal
        App.instance.setState({isExecute:false})
    }
    async getPointDetail(pCustomer)
    {
        let tmpSource =
        {
            source : 
            {
                groupBy : this.groupList,
                select : 
                {
                    query : "SELECT *, CASE TYPE WHEN 0 THEN '+' + CONVERT(NVARCHAR, POINT) WHEN 1 THEN '-' + CONVERT(NVARCHAR, POINT) END AS POINT_TYPE, " +
                            "(CONVERT(NVARCHAR, CDATE, 104) + ' ' + CONVERT(NVARCHAR, CDATE, 24)) AS F_DATE,SUBSTRING(CONVERT(NVARCHAR(50),DOC),20,25) AS POS_ID FROM CUSTOMER_POINT_VW_01 WHERE CUSTOMER_CODE = @CODE ORDER BY CDATE DESC " ,
                    param : ['CODE:string|50'],
                    value : [pCustomer]
                },
                sql : this.core.sql
            }
        }
        await this.grdPointDetail.dataRefresh(tmpSource)
        this.popPointDetail.show()
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
        this.popPointSaleDetail.show()
    }
    async btnAddPoint()
    {
        if(this.txtDescription.value.length < 14)
        {
            let tmpConfObj =
            {
                id:'msgDescription',showTitle:true,title:this.lang.t("posCustomerPointReport.popPointEntry.msgDescription.title"),showCloseButton:true,width:'500px',height:'200px',
                button:[{id:"btn01",caption:this.lang.t("posCustomerPointReport.popPointEntry.msgDescription.btn01"),location:'after'}],
                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("posCustomerPointReport.popPointEntry.msgDescription.msg")}</div>)
            }
            
            await dialog(tmpConfObj);
            return
        }
        
        if(isNaN(this.txtPoint.value))
        {
            let tmpConfObj =
            {
                id:'msgPointNotNumber',showTitle:true,title:this.lang.t("posCustomerPointReport.popPointEntry.msgPointNotNumber.title"),showCloseButton:true,width:'500px',height:'200px',
                button:[{id:"btn01",caption:this.lang.t("posCustomerPointReport.popPointEntry.msgPointNotNumber.btn01"),location:'after'}],
                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("posCustomerPointReport.popPointEntry.msgPointNotNumber.msg")}</div>)
            }
            await dialog(tmpConfObj);
            return;
        }

        return new Promise(async resolve => 
        {
            let tmpQuery = 
            {
                query : "EXEC [dbo].[PRD_CUSTOMER_POINT_INSERT] " + 
                        "@CUSER = @PCUSER, " + 
                        "@TYPE = @PTYPE, " +     
                        "@CUSTOMER = @PCUSTOMER, " +                  
                        "@DOC = @PDOC, " + 
                        "@POINT = @PPOINT, " + 
                        "@DESCRIPTION = @PDESCRIPTION ", 
                param : ['PCUSER:string|25','PTYPE:int','PCUSTOMER:string|50','PDOC:string|50','PPOINT:float','PDESCRIPTION:string|250'],
                value : [this.core.auth.data.CODE,this.cmbPointType.value,this.grdCustomerPointReport.getSelectedData()[0].GUID,'00000000-0000-0000-0000-000000000000',this.txtPoint.value,this.txtDescription.value]
            }
            await this.core.sql.execute(tmpQuery)
            this.popPointEntry.hide()
            this.btnGetClick()
            this.getPointDetail(this.grdCustomerPointReport.getSelectedData()[0].CODE)
            resolve()
        });
    }
    btnPointPopup()
    {
        this.txtDescription.value = '',
        this.txtPoint.value = 0,
        this.popPointEntry.show()
    }
    render()
    {
        return (
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
                                                App.instance.setPage('menu')
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
                                <Item>
                                    <Label text={this.lang.t("posCustomerPointReport.txtCustomerCode")} alignment="right" />
                                    <NdTextBox id="txtCustomerCode" parent={this} simple={true} selectAll={false} readOnly={true}
                                    button=
                                    {[
                                        {
                                            id:'01',
                                            icon:'more',
                                            onClick:()=>
                                            {
                                                this.popCustomers.show()
                                            }
                                        }
                                    ]}
                                    />
                                    {/* Cari Seçimi Popup */}
                                    <NdPopUp parent={this} id={"popCustomers"} 
                                    visible={false}
                                    showCloseButton={true}
                                    showTitle={true}
                                    title={this.lang.t("posCustomerPointReport.popCustomers.title")}
                                    container={"#root"} 
                                    width={'90%'}
                                    height={'90%'}
                                    position={{of:'#root'}}
                                    >
                                        <div className="row">
                                            <div className="col-10 pe-0">
                                                <NdTextBox id="txtSearchCustomer" parent={this} simple={true}
                                                onEnterKey={async()=>
                                                {
                                                    let tmpCustomersSource =
                                                    {
                                                        source : 
                                                        {
                                                            groupBy : this.groupList,
                                                            select : 
                                                            {
                                                                query :  "SELECT GUID,CODE,TITLE,NAME,LAST_NAME,[TYPE_NAME],[GENUS_NAME] FROM CUSTOMER_VW_01 WHERE (UPPER(CODE) LIKE UPPER(@VAL) OR UPPER(TITLE) LIKE UPPER(@VAL)) AND STATUS = 1",
                                                                param : ['VAL:string|50'],
                                                                value : [this.txtSearchCustomer.value.replace('*','%') + '%']
                                                            },
                                                            sql : this.core.sql
                                                        }
                                                    }
                                                    await this.grdCustomers.dataRefresh(tmpCustomersSource)
                                                }}
                                                button=
                                                {[
                                                    {
                                                        id:'01',
                                                        icon:'edit',
                                                        onClick:async()=>
                                                        {
                                                            const tmpKeyboard = document.querySelector('.simple-keyboard');
                                                            if(tmpKeyboard && !tmpKeyboard.contains(document.activeElement))
                                                            {
                                                                this.keyboardRef.hide()
                                                                if(this.txtSearchCustomer.value != '')
                                                                {
                                                                    this.txtSearchCustomer._onEnterKey()
                                                                }
                                                            }
                                                            else
                                                            {
                                                                this.keyboardRef.show('txtSearchCustomer')
                                                                this.keyboardRef.inputName = "txtSearchCustomer"
                                                                this.keyboardRef.setInput(this.txtSearchCustomer.value)
                                                            }
                                                        }
                                                    }
                                                ]}/>
                                            </div>
                                            <div className="col-2">
                                                <NdButton text={this.lang.t("posCustomerPointReport.popCustomers.btnCustomerSearch")} width="100%" height="35px" type="success"
                                                onClick={()=>
                                                {
                                                    this.txtSearchCustomer._onEnterKey()
                                                }}/>
                                            </div>
                                        </div>
                                        <div className="row pt-2">
                                            <div className="col-12">
                                                <NdButton text={this.lang.t("posCustomerPointReport.popCustomers.btnSelectCustomer")} width="100%" type="default"
                                                onClick={()=>
                                                {
                                                    if(this.grdCustomers.getSelectedData().length > 0)
                                                    {
                                                        this.txtCustomerCode.setState({value:this.grdCustomers.getSelectedData()[0].CODE})
                                                        this.txtCustomerName.setState({value:this.grdCustomers.getSelectedData()[0].TITLE})
                                                        this.btnGetClick()
                                                        this.popCustomers.hide()
                                                    }
                                                }}/>
                                            </div>
                                        </div>
                                        <div className="row pt-2" style={{height:'85%'}}>
                                            <div className="col-12">
                                                <NdGrid id="grdCustomers" parent={this} 
                                                selection={{mode:"single"}} 
                                                showBorders={true}
                                                columnAutoWidth={true}
                                                allowColumnReordering={true}
                                                allowColumnResizing={true}
                                                width={'100%'}
                                                height={'100%'}
                                                >
                                                    <Column dataField="CODE" caption={this.lang.t("posCustomerPointReport.popCustomers.clmCode")} width={'20%'} />
                                                    <Column dataField="TITLE" caption={this.lang.t("posCustomerPointReport.popCustomers.clmTitle")} width={'50%'} defaultSortOrder="asc" />
                                                    <Column dataField="TYPE_NAME" caption={this.lang.t("posCustomerPointReport.popCustomers.clmTypeName")} width={'15%'} />
                                                    <Column dataField="GENUS_NAME" caption={this.lang.t("posCustomerPointReport.popCustomers.clmGenusName")} width={'15%'}/>
                                                </NdGrid>
                                            </div>
                                        </div>
                                    </NdPopUp>
                                </Item> 
                                {/* txtCustomerName */}
                                <Item>
                                    <Label text={this.lang.t("posCustomerPointReport.txtCustomerName")} alignment="right" />
                                    <NdTextBox id="txtCustomerName" parent={this} simple={true} readOnly={true}/>
                                </Item>
                            </Form>
                        </div>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-3 offset-9">
                            <NdButton text={this.lang.t("posCustomerPointReport.btnGet")} type="success" width="100%" onClick={this.btnGetClick}></NdButton>
                        </div>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <NdGrid id="grdCustomerPointReport" parent={this} 
                            selection={{mode:"single"}} 
                            showBorders={true}
                            columnAutoWidth={true}
                            allowColumnReordering={true}
                            allowColumnResizing={true}
                            width={'100%'}
                            height={'100%'}
                            onRowDblClick={async(e)=>
                            {
                                this.getPointDetail(e.data.CODE)
                            }}
                            >                            
                                <Paging defaultPageSize={20} />
                                <Pager visible={true} allowedPageSizes={[5,10,50]} showPageSizeSelector={true} />
                                <Scrolling mode="standart" />
                                <Export fileName={"customer_point_report"} enabled={true} allowExportSelectedData={true} />
                                <Column dataField="CODE" caption={this.lang.t("posCustomerPointReport.grdCustomerPointReport.clmCode")} visible={true} width={'20%'}/> 
                                <Column dataField="TITLE" caption={this.lang.t("posCustomerPointReport.grdCustomerPointReport.clmTitle")} visible={true} width={'40%'}/> 
                                <Column dataField="POINT" caption={this.lang.t("posCustomerPointReport.grdCustomerPointReport.clmPoint")} visible={true} width={'12%'}/> 
                                <Column dataField="EURO" caption={this.lang.t("posCustomerPointReport.grdCustomerPointReport.clmEur")} dataType="number" format={{ style: "currency", currency: Number.money.code,precision: 2}} visible={true} width={'13%'}/> 
                                <Column dataField="LDATE_FORMAT" caption={this.lang.t("posCustomerPointReport.grdCustomerPointReport.clmLdate")} visible={true} width={'15%'}/> 
                            </NdGrid>
                        </div>
                    </div>
                    <div className="row px-2 py-3">
                        <div className="col-12">
                            <Form colCount={4} parent={this} id="frmPurcoffer">
                                {/* Ara Toplam-Stok Ekle */}
                                <EmptyItem colSpan={3}/>
                                <Item>
                                <Label text={this.lang.t("posCustomerPointReport.txtAmount")} alignment="right" />
                                    <NdTextBox id="txtAmount" parent={this} simple={true} readOnly={true} maxLength={32}/>
                                </Item>
                            </Form>
                        </div>
                    </div>
                    {/* Puan Detayı PopUp */}
                    <div>
                        <NdPopUp parent={this} id={"popPointDetail"} 
                        visible={false}
                        showCloseButton={true}
                        showTitle={true}
                        title={this.lang.t("posCustomerPointReport.popPointDetail.title")}
                        container={"#root"} 
                        width={'800'}
                        height={'540'}
                        position={{of:'#root'}}
                        >
                            <Form colCount={1} height={'fit-content'}>
                                <Item>
                                    <NdGrid id="grdPointDetail" parent={this} 
                                    selection={{mode:"single"}} 
                                    showBorders={true}
                                    filterRow={{visible:true}} 
                                    headerFilter={{visible:true}}
                                    height={'400'} 
                                    width={'100%'}
                                    columnAutoWidth={true}
                                    allowColumnReordering={true}
                                    allowColumnResizing={true}
                                    onCellPrepared={(e) =>
                                    {
                                        if(e.rowType === "data" && e.column.dataField === "POINT_TYPE" )
                                        {
                                            if(e.data.TYPE == 0)
                                            {
                                                e.cellElement.style.color ="blue"
                                            }
                                            else
                                            {
                                                e.cellElement.style.color ="red"
                                            }
                                        }
                                    }}
                                    onRowDblClick={async(e)=>
                                    {
                                        this.btnGetDetail(e.data.DOC)
                                        this.setState({ticketId:e.data.POS_ID})
                                    }}
                                    >                            
                                        <Scrolling mode="standart" />
                                        <Export fileName={this.lang.t("posCustomerPointReport.popPointDetail.exportFileName")} enabled={true} allowExportSelectedData={true} />
                                        <Column dataField="F_DATE" caption={this.lang.t("posCustomerPointReport.popPointDetail.clmDate")} visible={true} width={250}/> 
                                        <Column dataField="POS_ID" caption={this.lang.t("posCustomerPointReport.popPointDetail.clmPosId")} visible={true} width={200}/> 
                                        <Column dataField="POINT_TYPE" caption={this.lang.t("posCustomerPointReport.popPointDetail.clmPoint")} visible={true} width={150}/> 
                                        <Column dataField="DESCRIPTION" caption={this.lang.t("posCustomerPointReport.popPointDetail.clmDescription")} visible={true} width={150}/> 
                                    </NdGrid>
                                </Item>
                                <Item>
                                    <div className="row pb-1">
                                        <div className="col-4 offset-8">
                                            <NdButton text={this.lang.t("posCustomerPointReport.popPointDetail.btnAddPoint")}  width="100%" onClick={this.btnPointPopup}></NdButton>
                                        </div>
                                    </div>
                                </Item>
                            </Form>
                        </NdPopUp>
                    </div> 
                    <div>
                        <NdPopUp parent={this} id={"popPointSaleDetail"} 
                        visible={false}                        
                        showCloseButton={true}
                        showTitle={true}
                        title={this.lang.t("posCustomerPointReport.popPointSaleDetail.title")}
                        container={"#root"} 
                        width={'90%'}
                        height={'90%'}
                        position={{of:'#root'}}
                        >
                            <div className="row">
                                <div className="col-7">
                                    {this.lang.t("posCustomerPointReport.popPointSaleDetail.TicketId")} : {this.state.ticketId}
                                </div>
                            </div>
                            <div className="row" style={{height:'95%'}}>
                                <div className="col-7">
                                    <NdGrid id="grdSaleTicketItems" parent={this} 
                                    showBorders={true}
                                    filterRow={{visible:true}} 
                                    headerFilter={{visible:true}}
                                    columnAutoWidth={true}
                                    allowColumnReordering={true}
                                    allowColumnResizing={true}
                                    >                            
                                        <Paging defaultPageSize={20} />
                                        <Pager visible={true} allowedPageSizes={[5,10,50]} showPageSizeSelector={true} />
                                        <Scrolling mode="standart" />
                                        <Export fileName={this.lang.t("posCustomerPointReport.popPointSaleDetail.exportFileName")} enabled={true} allowExportSelectedData={true} />
                                        <Column dataField="BARCODE" caption={this.lang.t("posCustomerPointReport.popPointSaleDetail.clmBarcode")} visible={true} width={150}/> 
                                        <Column dataField="ITEM_NAME" caption={this.lang.t("posCustomerPointReport.popPointSaleDetail.clmName")} visible={true} width={250}/> 
                                        <Column dataField="QUANTITY" caption={this.lang.t("posCustomerPointReport.popPointSaleDetail.clmQuantity")} visible={true} width={100}/> 
                                        <Column dataField="PRICE" caption={this.lang.t("posCustomerPointReport.popPointSaleDetail.clmPrice")} visible={true} width={150} format={{ style: "currency", currency: Number.money.code,precision: 2}}/> 
                                        <Column dataField="TOTAL" caption={this.lang.t("posCustomerPointReport.popPointSaleDetail.clmTotal")} visible={true} width={150} format={{ style: "currency", currency: Number.money.code,precision: 2}}/> 
                                    </NdGrid>
                                </div>
                                <div className="col-5">
                                    <NdGrid id="grdSaleTicketPays" parent={this} 
                                    showBorders={true}
                                    filterRow={{visible:true}} 
                                    headerFilter={{visible:true}}
                                    columnAutoWidth={false}
                                    allowColumnReordering={true}
                                    allowColumnResizing={true}
                                    >                            
                                        <Paging defaultPageSize={20} />
                                        <Pager visible={true} allowedPageSizes={[5,10,50]} showPageSizeSelector={true} />
                                        <Scrolling mode="standart" />
                                        <Export fileName={this.lang.t("posCustomerPointReport.popPointSaleDetail.exportFileName")} enabled={true} allowExportSelectedData={true} />
                                        <Column dataField="PAY_TYPE_NAME" caption={this.lang.t("posCustomerPointReport.popPointSaleDetail.clmPayName")} visible={true} width={155}/> 
                                        <Column dataField="LINE_TOTAL" caption={this.lang.t("posCustomerPointReport.popPointSaleDetail.clmLineTotal")} visible={true} format={{ style: "currency", currency: Number.money.code,precision: 2}}  width={150}/> 
                                    </NdGrid>
                                </div>
                            </div>
                        </NdPopUp>
                    </div>
                    {/* Puan Giriş PopUp */}
                    <div>
                        <NdPopUp parent={this} id={"popPointEntry"} 
                        visible={false}
                        showCloseButton={true}
                        showTitle={true}
                        title={this.lang.t("posCustomerPointReport.popPointEntry.title")}
                        container={"#root"} 
                        width={'600'}
                        height={'270'}
                        position={{of:'#root'}}
                        >
                            <Form colCount={1} height={'fit-content'}>
                                <Item>
                                    <Label text={this.lang.t("posCustomerPointReport.popPointEntry.cmbPointType")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbPointType" displayExpr="VALUE" valueExpr="ID" value={0}
                                    data={{source:[{ID:0,VALUE:this.lang.t("posCustomerPointReport.popPointEntry.cmbTypeData.in")},{ID:1,VALUE:this.lang.t("posCustomerPointReport.popPointEntry.cmbTypeData.out")}]}}
                                    />
                                </Item>
                                <Item>
                                    <Label text={this.lang.t("posCustomerPointReport.popPointEntry.txtPoint")} alignment="right" />
                                    <NdTextBox id="txtPoint"  parent={this} simple={true} selectAll={false}
                                    button=
                                    {[
                                        {
                                            id:'01',
                                            icon:'edit',
                                            onClick:async()=>
                                            {
                                                const tmpKeyboard = document.querySelector('.simple-keyboard');
                                                if(tmpKeyboard && !tmpKeyboard.contains(document.activeElement))
                                                {
                                                    this.keyboardRef.hide()
                                                }
                                                else
                                                {
                                                    this.keyboardRef.show('txtPoint')
                                                    this.keyboardRef.inputName = "txtPoint"
                                                    this.keyboardRef.setInput(this.txtPoint.value)
                                                }
                                            }
                                        },
                                    ]}
                                    />
                                </Item>
                                <Item>
                                    <Label text={this.lang.t("posCustomerPointReport.popPointEntry.txtDescription")} alignment="right" />
                                    <NdTextBox id="txtDescription" title={this.lang.t("posCustomerPointReport.popPointEntry.txtDescription")} parent={this} simple={true} 
                                    selectAll={false} placeholder={this.lang.t("posCustomerPointReport.popPointEntry.descriptionPlace")}
                                    button=
                                    {[
                                        {
                                            id:'01',
                                            icon:'edit',
                                            onClick:async()=>
                                            {
                                                const tmpKeyboard = document.querySelector('.simple-keyboard');
                                                if(tmpKeyboard && !tmpKeyboard.contains(document.activeElement))
                                                {
                                                    this.keyboardRef.hide()
                                                }
                                                else
                                                {
                                                    this.keyboardRef.show('txtDescription')
                                                    this.keyboardRef.inputName = "txtDescription"
                                                    this.keyboardRef.setInput(this.txtDescription.value)
                                                }
                                            }
                                        },
                                    ]}
                                    />
                                </Item>
                                <Item>
                                    <div className="row pb-1">
                                        <div className="col-3 offset-9">
                                            <NdButton text={this.lang.t("posCustomerPointReport.popPointEntry.btnAdd")} width="100%" 
                                            onClick={this.btnAddPoint}/>
                                        </div>
                                    </div>
                                </Item>
                            </Form>
                        </NdPopUp>
                    </div>
                    <div>
                        <NbKeyboard id={"keyboardRef"} parent={this} autoPosition={true} keyType={this.prmObj.filter({ID:'KeyType',TYPE:0,USERS:this.user.CODE}).getValue()}/>
                    </div>
                </ScrollView>
            </div>
        );
    }
}