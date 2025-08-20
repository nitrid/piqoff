import React from 'react';
import App from '../../lib/app';
import { datatable } from '../../../core/core.js'

import NdTextBox from '../../../core/react/devex/textbox';
import NdPopGrid from '../../../core/react/devex/popgrid';
import NdGrid,{ Column, Editing, Paging, Scrolling, KeyboardNavigation } from '../../../core/react/devex/grid';
import { dialog } from '../../../core/react/devex/dialog.js';
import NbLabel from '../../../core/react/bootstrap/label';
import NbButton from "../../../core/react/bootstrap/button.js";

import { PageBar } from '../../tools/pageBar';
import { PageView,PageContent } from '../../tools/pageView';
import moment from 'moment';
import NdPopUp  from '../../../core/react/devex/popup.js';
export default class priceCheck extends React.PureComponent
{
    constructor(props)
    {
        super(props)

        this.core = App.instance.core;
        this.itemDt = new datatable();
        this.customerDt = new datatable();
        this.priceDt = new datatable();

        this.itemDt.selectCmd = 
        {
            query : `SELECT * FROM ITEMS_BARCODE_MULTICODE_VW_01 WHERE (CODE = @CODE OR BARCODE = @CODE ) OR (@CODE = '')`,
            param : ['CODE:string|25'],
        }
        this.customerDt.selectCmd = 
        {
            query : `SELECT * FROM ITEM_MULTICODE_VW_01 WHERE (ITEM_CODE = @CODE) OR (@CODE = '')`,
            param : ['CODE:string|25'],
        }
        this.priceDt.selectCmd = 
        {
            query : `SELECT * FROM ITEM_PRICE_VW_01 WHERE ((ITEM_CODE = @CODE) OR (@CODE = '')) AND TYPE = 0`,
            param : ['CODE:string|25'],
        }
        this.priceDt.updateCmd = 
        {
            query : `EXEC [dbo].[PRD_ITEM_PRICE_UPDATE] 
                    @GUID = @PGUID, 
                    @CUSER = @PCUSER, 
                    @TYPE = @PTYPE, 
                    @LIST_NO = @PLIST_NO, 
                    @ITEM = @PITEM, 
                    @DEPOT = @PDEPOT, 
                    @START_DATE = @PSTART_DATE, 
                    @FINISH_DATE = @PFINISH_DATE, 
                    @PRICE = @PPRICE, 
                    @QUANTITY = @PQUANTITY, 
                    @CUSTOMER = @PCUSTOMER, 
                    @CONTRACT = @PCONTRACT `,  
            param : ['PGUID:string|50','PCUSER:string|25','PTYPE:int','PLIST_NO:int','PITEM:string|50','PDEPOT:string|50','PSTART_DATE:date','PFINISH_DATE:date',
                     'PPRICE:float','PQUANTITY:float','PCUSTOMER:string|50','PCONTRACT:string|50'],
            dataprm : ['GUID','CUSER','TYPE','LIST_NO','ITEM_GUID','DEPOT','START_DATE','FINISH_DATE','PRICE','QUANTITY','CUSTOMER_GUID','CONTRACT_GUID']
        } 

        this.alertContent = 
        {
            id:'msgAlert',showTitle:true,title:this.t("msgAlert.title"),showCloseButton:true,width:'90%',height:'auto',
            button:[{id:"btn01",caption:this.t("msgAlert.btn01"),location:'after'}],
            content:(<div style={{textAlign:"center",fontSize:"20px"}}></div>)
        }
    }
    async init()
    {
        this.clearEntry();

        await this.grdPrice.dataRefresh({source:this.priceDt});
        await this.grdCustomer.dataRefresh({source:this.customerDt});
    }
    async componentDidMount()
    {
        await this.core.util.waitUntil(0)
        this.pageView.activePage('Main')
        this.init()
    }
    clearEntry()
    {
        this.itemDt.clear();
        this.lblItemPrice.value = 0
    }

    calculateMarginForPrice(newPrice)
    {
        if(this.itemDt.length > 0 && newPrice)
        {
            let tmpMargin = (newPrice - (newPrice * this.itemDt[0].VAT/100)) - (this.itemDt[0].COST_PRICE)
            let tmpMarginRate = (tmpMargin / this.itemDt[0].COST_PRICE) * 100

            let marginDisplayPrm = this.param.filter({TYPE:0,ID:'marginDisplay'}).getValue();
            let marginFormat = "";
            this.itemDt[0].MARGIN = tmpMargin.toFixed(2) + marginDisplayPrm.currency + marginDisplayPrm.separator + tmpMarginRate.toFixed(2)
            this.priceDt[0].MARGIN = tmpMargin.toFixed(2) + marginDisplayPrm.currency + marginDisplayPrm.separator + tmpMarginRate.toFixed(2)
            
            
            if(marginDisplayPrm.showAmount) 
            {
                marginFormat += tmpMargin.toFixed(2) + marginDisplayPrm.currency;
            }
            if(marginDisplayPrm.showAmount && marginDisplayPrm.showRate) 
            {
                marginFormat += marginDisplayPrm.separator;
            }
            if(marginDisplayPrm.showRate) 
            {
                marginFormat += tmpMarginRate.toFixed(2);
            }

            this.txtMarginDisplay.value = marginFormat;
        }
    }
    getItem(pCode)
    {
        return new Promise(async resolve => 
        {
            this.clearEntry();
            
            this.itemDt.selectCmd.value = [pCode]
            await this.itemDt.refresh();
            


            if(this.itemDt.length > 0)
            {
                this.lblItemName.value = this.itemDt[0].NAME
                this.lblItemPrice.value = this.itemDt[0].PRICE_SALE + ' €'
                this.txtBarcode.value = ""

                this.customerDt.selectCmd.value = [this.itemDt[0].CODE]
                await this.customerDt.refresh();  
                
                this.priceDt.selectCmd.value = [this.itemDt[0].CODE]
                await this.priceDt.refresh();  
                
                // PriceDt'deki her satır için margin hesapla
                for(let i = 0; i < this.priceDt.length; i++)
                {
                    let priceRow = this.priceDt[i];
                    let tmpMargin = (priceRow.PRICE - (priceRow.PRICE * this.itemDt[0].VAT)/100) - (this.itemDt[0].COST_PRICE)
                    let tmpMarginRate = (tmpMargin / this.itemDt[0].COST_PRICE) * 100
                    
                    let marginDisplayPrm = this.param.filter({TYPE:0,ID:'marginDisplay'}).getValue();
                    let marginFormat = tmpMargin.toFixed(2) + marginDisplayPrm.currency + marginDisplayPrm.separator + tmpMarginRate.toFixed(2);
                    
                    this.priceDt[i].MARGIN = marginFormat;
                }
                
                if(this.itemDt[0].STATUS == false)
                {
                    document.getElementById("Sound2").play(); 
                    
                    let tmpConfObj = 
                    {
                        id:'msgPassiveItem',showTitle:true,title:this.lang.t("msgPassiveItem.title"),showCloseButton:true,width:'350px',height:'auto',
                        button:[{id:"btn01",caption:this.lang.t("msgPassiveItem.btn01"),location:'before'},{id:"btn02",caption:this.lang.t("msgPassiveItem.btn02"),location:'after'}],
                        content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgPassiveItem.msg")}</div>)
                    }

                    let pResult = await dialog(tmpConfObj);
                    
                    if(pResult == 'btn01')
                    {  
                        let tmpQuery = 
                        {
                            query : `UPDATE ITEMS SET STATUS = 1 WHERE GUID = @GUID `,
                            param : ['GUID:string|50'],
                            value : [this.itemDt[0].GUID]
                        }

                        await this.core.sql.execute(tmpQuery) 
                    }
                }
            }
            else
            {                               
                document.getElementById("Sound").play(); 

                this.alertContent.content = (<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgAlert.msgBarcodeNotFound")}</div>)
                await dialog(this.alertContent);
                
                this.txtBarcode.value = ""
                this.txtBarcode.focus();
            }
            resolve();
        });
    }
    render()
    {
        return(
            <div>
                <div>
                    <PageBar id={"pageBar"} parent={this} title={this.lang.t("menu.stk_01")} content=
                    {[
                        {
                            name : 'Main',isBack : false,isTitle : true,
                            menu :[]
                        },
                    ]}
                    onBackClick={()=>{this.pageView.activePage('Main')}}/>
                </div>
                <div style={{position:'relative',top:'1px',height:'calc(100vh - 1px)',overflow:'hidden'}}>
                    <PageView id={"pageView"} parent={this} onActivePage={(e)=>{this.pageBar.activePage(e)}}>
                        <PageContent id={"Main"}>
                            <div className='row px-2'>
                                <div className='col-12'>
                                    <div className='row pb-2'>
                                        <div className='col-12'>
                                            <NdTextBox id="txtBarcode" parent={this} simple={true} maxLength={32}
                                            onKeyUp={(async(e)=>
                                            {
                                                if(e.event.key == 'Enter')
                                                {
                                                    await this.getItem(this.txtBarcode.value)
                                                }
                                            }).bind(this)}
                                            button={[
                                                {
                                                    id:'01',
                                                    icon:'more',
                                                    onClick:async()=>
                                                    {
                                                        this.popItem.show()
                                                        this.popItem.onClick = (data) =>
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
                                                    icon:'photo',
                                                    onClick:()=>
                                                    {
                                                        if(typeof cordova == "undefined")
                                                        {
                                                            return;
                                                        }
                                                        cordova.plugins.barcodeScanner.scan(
                                                            async function (result) 
                                                            {
                                                                if(result.cancelled == false)
                                                                {
                                                                    this.txtBarcode.value = result.text;
                                                                    this.getItem(result.text)
                                                                }
                                                            }.bind(this),
                                                            function (error) 
                                                            {
                                                                
                                                            },
                                                            {
                                                                prompt : "Scan",
                                                                orientation : "portrait"
                                                            }
                                                        );
                                                    }
                                                }
                                            ]}/>
                                            {/*STOK SEÇİM */}
                                            <NdPopGrid id={"popItem"} parent={this} container={"#root"}
                                            selection={{mode:"single"}}
                                            visible={false}
                                            position={{of:'#root'}} 
                                            showTitle={true} 
                                            showBorders={true}
                                            width={'100%'}
                                            height={'100%'}
                                            search={true}
                                            title={this.lang.t("popItem.title")} 
                                            data = 
                                            {{
                                                source:
                                                {
                                                    select:
                                                    {
                                                        query : `SELECT CODE,NAME FROM ITEMS_VW_01 
                                                                WHERE (UPPER(CODE) LIKE UPPER(@VAL) OR UPPER(NAME) LIKE UPPER(@VAL))`,
                                                        param : ['VAL:string|50']
                                                    },
                                                    sql:this.core.sql
                                                }
                                            }}
                                            >
                                                <Column dataField="CODE" caption={this.lang.t("popItem.clmCode")} width={120} />
                                                <Column dataField="NAME" caption={this.lang.t("popItem.clmName")} width={100} />
                                            </NdPopGrid>
                                        </div>
                                    </div>
                                    <div className='row pb-1'>
                                        <div className='col-12'>
                                            <h6 style={{height:'40px',textAlign:"center",overflow:"hidden"}}>
                                                <NbLabel id="lblItemName" parent={this} value={""}/>
                                            </h6>
                                        </div>
                                    </div>
                                    <div className='row pb-1'>
                                        <div className='col-12'>
                                            <h6 style={{height:'40px',textAlign:"center",overflow:"hidden"}}>
                                                <NbLabel id="lblItemPrice" parent={this} value={""}/>
                                            </h6>
                                        </div>
                                    </div>
                                    <div className='row pb-1'>
                                        <div className='col-12'>
                                            <NdGrid parent={this} id={"grdPrice"} 
                                            showBorders={true} 
                                            columnsAutoWidth={true} 
                                            allowColumnReordering={true} 
                                            allowColumnResizing={true} 
                                            headerFilter = {{visible:false}}
                                            height={'auto'} 
                                            width={'100%'}
                                            dbApply={true}
                                            onCellClick={async (e)=>
                                            {
                                                if(e.column.dataField == "PRICE")
                                                {
                                                    // Popup'ı aç
                                                    this.popMargin.setTitle("FİYAT DEĞİŞTİR");
                                                    this.txtPrice.value = Number(e.value);
                                                    this.txtMarginDisplay.value = this.itemDt.length > 0 ? this.itemDt[0].MARGIN : "";
                                                    this.popMargin.show();
                                                    
                                                    // Return promise için değişken hazırla
                                                    this.currentData = e.data;
                                                }
                                            }}
                                            >
                                                <KeyboardNavigation editOnKeyPress={true} enterKeyAction={'moveFocus'} enterKeyDirection={'row'} />
                                                <Scrolling mode="standart" />
                                                <Paging defaultPageSize={10} />
                                                <Editing mode="cell" allowUpdating={true} allowDeleting={false} confirmDelete={false}/>
                                                <Column dataField="FINISH_DATE" caption={this.t("grdPrice.clmDate")} allowEditing={false}  width={120} dataType="datetime" format={"dd/MM/yyyy - HH:mm:ss"}
                                                cellRender={(e) => 
                                                {
                                                    if(moment(e.value).format("YYYY-MM-DD") != '1970-01-01')
                                                    {
                                                        return e.text
                                                    }
                                                    return
                                                }}/>
                                                <Column dataField="QUANTITY" caption={this.t("grdPrice.clmQuantity")} dataType={'number'} width={80}/>
                                                <Column dataField="MARGIN" caption={this.t("grdPrice.clmMargin")} dataType={'string'} width={120}/>
                                                <Column dataField="PRICE" caption={this.t("grdPrice.clmPrice")} dataType={'number'} format={{ style: "currency", currency: "EUR",precision: 3}} width={60}/>
                                            </NdGrid>
                                        </div>
                                    </div>
                                    <div className='row pb-2'>
                                        <div className='col-12'>
                                            <NdGrid parent={this} id={"grdCustomer"} 
                                            showBorders={true} 
                                            columnsAutoWidth={true} 
                                            allowColumnReordering={true} 
                                            allowColumnResizing={true} 
                                            headerFilter = {{visible:false}}
                                            height={'auto'} 
                                            width={'100%'}
                                            dbApply={false}
                                            >
                                                <KeyboardNavigation editOnKeyPress={true} enterKeyAction={'moveFocus'} enterKeyDirection={'row'} />
                                                <Scrolling mode="standart" />
                                                <Paging defaultPageSize={10} />
                                                <Editing mode="cell" allowUpdating={false} allowDeleting={false} confirmDelete={false}/>
                                                <Column dataField="CUSTOMER_NAME" caption={this.t("grdCustomer.clmCustomer")} dataType={'number'} width={150}/>
                                                <Column dataField="MULTICODE" caption={this.t("grdCustomer.clmMulticode")} dataType={'number'} width={100}/>
                                                <Column dataField="CUSTOMER_PRICE" caption={this.t("grdCustomer.clmPrice")} dataType={'number'} format={{ style: "currency", currency: "EUR",precision: 3}} width={60}/>
                                            </NdGrid>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Number Popup */}
                            {/* <div>
                                <NbPopNumber id={"popNumber"} parent={this} margin={this.itemDt.length > 0 ? this.itemDt[0].MARGIN : ""}/>
                            </div   > */}
                            <div>
                                <NdPopUp parent={this} id={"popMargin"} 
                                visible={false}                        
                                showCloseButton={true}
                                showTitle={true}
                                title={""}
                                container={"#root"} 
                                width={"300"}
                                height={"auto"}
                                onHiding={()=> {}}
                                position={{of:"#root"}}
                                margin={this.itemDt.length > 0 ? this.itemDt[0].MARGIN : ""}
                                >
                                    {/* Fiyat */}
                                    <div className="row pt-1">
                                        <div className="col-12">
                                            <div style={{fontSize: '12px', color: '#666', marginBottom: '2px'}}>Fiyat</div>
                                            <NdTextBox id={"txtPrice"} parent={this} simple={true} 
                                            onValueChanged={(e) => {
                                                // Fiyat değiştiğinde margin'ı yeniden hesapla
                                                this.calculateMarginForPrice(e.value);
                                            }}>     
                                            </NdTextBox> 
                                        </div>
                                    </div> 
                                    {/* Margin */}
                                    <div className="row pt-1">
                                        <div className="col-12">
                                            <div style={{display: 'flex', flexDirection: 'column'}}>
                                                <div style={{fontSize: '12px', color: '#666', marginBottom: '2px'}}>Margin</div>
                                                <NdTextBox id={"txtMarginDisplay"} parent={this} simple={true} readOnly={true} />
                                            </div>
                                        </div>
                                    </div>
                                    {/* btn */}
                                    <div className="row pt-2">
                                        <div className="col-12">
                                            <NbButton id={"btnMarginOk"} parent={this} className="form-group btn btn-success btn-block" style={{height:"60px",width:"100%"}}
                                            onClick={() => {
                                                // Fiyatı güncelle
                                                if(this.currentData) 
                                                {
                                                    this.currentData.PRICE = Number(this.txtPrice.value);
                                                    this.priceDt.update();
                                                }
                                                this.popMargin.hide();
                                            }}>
                                                <i className="text-white fa-solid fa-check" style={{fontSize: "24px"}} />
                                            </NbButton>
                                        </div>
                                    </div>
                                </NdPopUp>
                            </div>
                        </PageContent>
                    </PageView>
                </div>
            </div>
        )
    }
}