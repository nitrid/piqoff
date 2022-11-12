import React from 'react';
import App from '../../../lib/app.js';
import moment from 'moment';

import Toolbar,{Item} from 'devextreme-react/toolbar';
import Form, { Label,EmptyItem } from 'devextreme-react/form';
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

export default class customerPointReport extends React.PureComponent
{
    constructor(props)
    {
        super(props)
        
        this.core = App.instance.core;
        this.groupList = [];
        this._btnGetClick = this._btnGetClick.bind(this)
        this.btnAddPoint = this.btnAddPoint.bind(this)
        this.btnPointPopup = this.btnPointPopup.bind(this)
        this.state={ticketId :""}
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
                    query : "SELECT GUID,CODE,TITLE,dbo.FN_CUSTOMER_TOTAL_POINT(GUID,GETDATE()) AS POINT,(dbo.FN_CUSTOMER_TOTAL_POINT(GUID,GETDATE()) / 100) AS EURO,ISNULL((SELECT TOP 1 (CONVERT(NVARCHAR, LDATE, 101) + ' ' + CONVERT(NVARCHAR, LDATE, 24))  " + 
                    " FROM CUSTOMER_POINT WHERE CUSTOMER_POINT.CUSTOMER = CUSTOMER_VW_01.GUID ORDER BY LDATE DESC),'') AS LDATE_FORMAT FROM [dbo].[CUSTOMER_VW_01] WHERE ((CODE = @CODE) OR (@CODE = '')) ",
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
        this.popDetail.show()
    }
    async btnAddPoint()
    {
        if(this.txtDescription.value.length < 14)
        {
            let tmpConfObj =
            {
                id:'msgDescription',showTitle:true,title:this.t("msgDescription.title"),showCloseButton:true,width:'500px',height:'200px',
                button:[{id:"btn01",caption:this.t("msgDescription.btn01"),location:'after'}],
                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgDescription.msg")}</div>)
            }
            
            await dialog(tmpConfObj);
            return
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
                this._btnGetClick()
                this.getPointDetail(this.grdCustomerPointReport.getSelectedData()[0].CODE)
                resolve()
            });
    }
    btnPointPopup()
    {
        this.txtDescription.value = '',
        this.txtPointAmount.value =  0,
        this.txtPoint.value = 0,
        this.popPointEntry.show()
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
                                                        this.txtCustomerName.setState({value:data[0].TITLE})
                                                        this._btnGetClick()
                                                    }
                                                }
                                            }
                                        },
                                    ]
                                }
                                onEnterKey={(async()=>
                                    {
                                        await this.pg_txtCustomerCode.setVal(this.txtCustomerCode.value)
                                        this.pg_txtCustomerCode.show()
                                        this.pg_txtCustomerCode.onClick = (data) =>
                                        {
                                            if(data.length > 0)
                                            {
                                                this.txtCustomerCode.setState({value:data[0].CODE})
                                                this.txtCustomerName.setState({value:data[0].TITLE})
                                                this._btnGetClick()
                                            }
                                        }
                                    }).bind(this)}
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
                                 {/* txtCustomerName */}
                                 <Item>
                                    <Label text={this.t("txtCustomerName")} alignment="right" />
                                    <NdTextBox id="txtCustomerName" title={this.t("txtCustomerName")} parent={this} simple={true} readOnly={true}
                                        param={this.param.filter({ELEMENT:'txtCustomerName',USERS:this.user.CODE})}
                                        access={this.access.filter({ELEMENT:'txtCustomerName',USERS:this.user.CODE})}
                                        onValueChanged={(e)=>
                                        {
                                        
                                        }}>
                                    </NdTextBox>
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
                            <NdGrid id="grdCustomerPointReport" parent={this} 
                            selection={{mode:"single"}} 
                            showBorders={true}
                            filterRow={{visible:true}} 
                            headerFilter={{visible:true}}
                            columnAutoWidth={true}
                            allowColumnReordering={true}
                            allowColumnResizing={true}
                            onRowDblClick={async(e)=>
                                {
                                    this.getPointDetail(e.data.CODE)
                                }}
                            >                            
                                <Paging defaultPageSize={20} />
                                <Pager visible={true} allowedPageSizes={[5,10,50]} showPageSizeSelector={true} />
                                <Export fileName={this.lang.t("menu.pos_02_001")} enabled={true} allowExportSelectedData={true} />
                                <Column dataField="CODE" caption={this.t("grdCustomerPointReport.clmCode")} visible={true} width={200}/> 
                                <Column dataField="TITLE" caption={this.t("grdCustomerPointReport.clmTitle")} visible={true} width={300}/> 
                                <Column dataField="POINT" caption={this.t("grdCustomerPointReport.clmPoint")} visible={true} width={200}/> 
                                <Column dataField="EURO" caption={this.t("grdCustomerPointReport.clmEur")} dataType="number" format={{ style: "currency", currency: "EUR",precision: 2}} visible={true} width={200}/> 
                                <Column dataField="LDATE_FORMAT" caption={this.t("grdCustomerPointReport.clmLdate")} visible={true} /> 
                            </NdGrid>
                        </div>
                    </div>
                      <div className="row px-2 pt-2">
                        <div className="col-12">
                            <Form colCount={4} parent={this} id="frmPurcoffer">
                                {/* Ara Toplam-Stok Ekle */}
                                <EmptyItem colSpan={3}/>
                                <Item  >
                                <Label text={this.t("txtAmount")} alignment="right" />
                                    <NdTextBox id="txtAmount" parent={this} simple={true} readOnly={true} 
                                    maxLength={32}
                                   
                                    ></NdTextBox>
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
                        title={this.t("popPointDetail.title")}
                        container={"#root"} 
                        width={'800'}
                        height={'600'}
                        position={{of:'#root'}}
                        >
                            <Form colCount={1} height={'fit-content'}>
                                <Item>
                                    <NdGrid id="grdPointDetail" parent={this} 
                                    selection={{mode:"none"}} 
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
                                        <Export fileName={this.lang.t("menu.pos_02_001")} enabled={true} allowExportSelectedData={true} />
                                        <Column dataField="F_DATE" caption={this.t("grdPointDetail.clmDate")} visible={true} width={250}/> 
                                        <Column dataField="POS_ID" caption={this.t("grdPointDetail.clmPosId")} visible={true} width={200}/> 
                                        <Column dataField="POINT_TYPE" caption={this.t("grdPointDetail.clmPoint")} visible={true} width={150}/> 
                                        <Column dataField="DESCRIPTION" caption={this.t("grdPointDetail.clmDescription")} visible={true} width={150}/> 
                                    </NdGrid>
                                    </Item>
                                    <Item>
                                        <div className="row px-2 pt-2">
                                            <div className="col-8">
                                            </div>
                                            <div className="col-4">
                                                <NdButton text={this.t("btnAddpoint")}  width="100%" onClick={this.btnPointPopup}></NdButton>
                                            </div>
                                        </div>
                                    </Item>
                            </Form>
                        </NdPopUp>
                    </div> 
                    <div>
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
                            <div className="col-7 pe-0">
                            {this.t("TicketId")} : {this.state.ticketId}
                            </div>
                         </div>
                          <div className="row">
                          <div className="col-1 pe-0"></div>
                            <div className="col-7 pe-0">
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
                            <div className="col-3 ps-0">
                            <NdGrid id="grdSaleTicketPays" parent={this} 
                                selection={{mode:"multiple"}} 
                                showBorders={true}
                                filterRow={{visible:true}} 
                                headerFilter={{visible:true}}
                                columnAutoWidth={false}
                                allowColumnReordering={true}
                                allowColumnResizing={true}
                                onRowDblClick={async(e)=>
                                    {
                                    
                                    }}
                                >                            
                                    <Paging defaultPageSize={20} />
                                    <Pager visible={true} allowedPageSizes={[5,10,50]} showPageSizeSelector={true} />
                                    <Export fileName={this.lang.t("menu.pos_02_001")} enabled={true} allowExportSelectedData={true} />
                                    <Column dataField="PAY_TYPE_NAME" caption={this.t("grdSaleTicketPays.clmPayName")} visible={true} width={155}/> 
                                    <Column dataField="LINE_TOTAL" caption={this.t("grdSaleTicketPays.clmTotal")} visible={true} format={{ style: "currency", currency: "EUR",precision: 2}}  width={150}/> 
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
                        title={this.t("popPointEntry.title")}
                        container={"#root"} 
                        width={'600'}
                        height={'400'}
                        position={{of:'#root'}}
                        >
                            <Form colCount={1} height={'fit-content'}>
                                <Item>
                                    <Label text={this.t("cmbPointType")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbPointType"
                                    displayExpr="VALUE"                       
                                    valueExpr="ID"
                                    value={0}
                                    data={{source:[{ID:0,VALUE:this.t("cmbTypeData.in")},{ID:1,VALUE:this.t("cmbTypeData.out")}]}}
                                    >
                                    </NdSelectBox>
                                </Item>
                                <Item>
                                    <Label text={this.t("txtPoint")} alignment="right" />
                                    <NdNumberBox id="txtPoint"  parent={this} simple={true} 
                                        onValueChanged={(e)=>
                                        {
                                            this.txtPointAmount.value = (this.txtPoint.value / 100)
                                        }}>
                                    </NdNumberBox>
                                </Item>
                                <Item>
                                    <Label text={this.t("txtPointAmount")} alignment="right" />
                                    <NdNumberBox id="txtPointAmount"  parent={this} simple={true} 
                                        param={this.param.filter({ELEMENT:'txtCustomerName',USERS:this.user.CODE})}
                                        access={this.access.filter({ELEMENT:'txtCustomerName',USERS:this.user.CODE})}
                                        onValueChanged={(e)=>
                                        {
                                            this.txtPoint.value = (this.txtPointAmount.value * 100)
                                        }}>
                                    </NdNumberBox>
                                </Item>
                                 <Item>
                                    <Label text={this.t("txtDescription")} alignment="right" />
                                    <NdTextBox id="txtDescription" title={this.t("txtDescription")} parent={this} simple={true} placeholder={this.t("descriptionPlace")}
                                        upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                        onValueChanged={(e)=>
                                        {
                                        
                                        }}>
                                    </NdTextBox>
                                </Item>
                                <Item>
                                    <div className="row px-2 pt-2">
                                        <div className="col-9">
                                        </div>
                                        <div className="col-3">
                                            <NdButton text={this.t("btnAdd")}  width="100%" 
                                            onClick={this.btnAddPoint}></NdButton>
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