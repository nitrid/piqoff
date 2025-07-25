import React from 'react';
import App from '../../../lib/app.js';
import moment from 'moment';

import Toolbar,{ Item } from 'devextreme-react/toolbar';
import ScrollView from 'devextreme-react/scroll-view';

import NdGrid,{Column,Editing,Paging,Pager,Scrolling} from '../../../../core/react/devex/grid.js';
import NdButton from '../../../../core/react/devex/button.js';
import NbDateRange from '../../../../core/react/bootstrap/daterange.js';
import { dialog } from '../../../../core/react/devex/dialog.js';
import { NdForm, NdItem, NdLabel } from '../../../../core/react/devex/form.js';
export default class priceAllItemSend extends React.PureComponent
{
    constructor(props)
    {
        super(props)

        this.core = App.instance.core;
        this.btnItemsSend = this.btnItemsSend.bind(this)
        this.btnDateItemsSend = this.btnDateItemsSend.bind(this)
    }
    async componentDidMount()
    {
        await this.core.util.waitUntil(0)
        this.init()
    }
    async init()
    {
      this.getItems()
    }
    async btnItemsSend()
    {
        this.core.socket.emit('priceAllItemSend')
        let tmpConfObj1 =
        {
            id:'msgItemSend',showTitle:true,title:this.t("msgItemSend.title"),showCloseButton:true,width:'500px',height:'auto',
            button:[{id:"btn01",caption:this.t("msgItemSend.btn01"),location:'after'}],
        }
             
        tmpConfObj1.content = (<div style={{textAlign:"center",fontSize:"20px",color:"green"}}>{this.t("msgItemSend.msgSuccess")}</div>)
        await dialog(tmpConfObj1);
    }
    async btnDateItemsSend()
    {
        this.core.socket.emit('priceDateItemSend',[this.dtDate.startDate,this.dtDate.endDate])
        let tmpConfObj1 =
        {
            id:'msgItemSend',showTitle:true,title:this.t("msgItemSend.title"),showCloseButton:true,width:'500px',height:'auto',
            button:[{id:"btn01",caption:this.t("msgItemSend.btn01"),location:'after'}],
        }
             
        tmpConfObj1.content = (<div style={{textAlign:"center",fontSize:"20px",color:"green"}}>{this.t("msgItemSend.msgSuccess")}</div>)
        await dialog(tmpConfObj1);
    }
    async getItems()
    {
        let tmpSource =
        {
            source : 
            {
                groupBy : this.groupList,
                select : 
                {
                    query : `SELECT CODE AS ITEM_CODE,NAME AS ITEM_NAME,PRICE_SALE AS PRICE FROM ITEMS_BARCODE_MULTICODE_VW_01 WHERE CONVERT(nvarchar,LDATE,110) >= @FISRT_DATE AND CONVERT(nvarchar,LDATE,110) <= @LAST_DATE AND STATUS = 1 GROUP BY CODE,NAME,PRICE_SALE`,
                    param : ['FISRT_DATE:date','LAST_DATE:date'],
                    value : [this.dtDate.startDate,this.dtDate.endDate]
                },
                sql : this.core.sql
            }
        }

        App.instance.loading.show()
        await this.grdItems.dataRefresh(tmpSource)
        App.instance.loading.hide()
    }
    render()
    {
        return(
            <div>
                <ScrollView>
                    <div className="row px-2 pt-1">
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
                                                id:'msgClose',showTitle:true,title:this.lang.t("msgWarning"),showCloseButton:true,width:'500px',height:'auto',
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
                                }/>
                            </Toolbar>
                        </div>
                    </div>
                    <div className="row px-2 pt-1">
                        <div className="col-6" style={{height: '60px'}}>
                            <NdForm colCount={1} id="frmDate">
                                <NdItem>
                                    <NdLabel text={this.t("grdItems.clmDate")}/>
                                    <NbDateRange id={"dtDate"} parent={this} startDate={moment(new Date())} endDate={moment(new Date())}
                                    onApply={(async()=>{this.getItems()}).bind(this)}/>
                                </NdItem>
                            </NdForm>
                        </div>  
                    </div>
                    <div className="row px-2 pt-1">
                        <div className="col-12">
                            <NdForm colCount={1} id="frmGrid" height={'100%'}>
                                <NdItem height={'100%'}>
                                    <NdGrid parent={this} id={"grdItems"} 
                                    showBorders={true} 
                                    columnsAutoWidth={true} 
                                    allowColumnReordering={true} 
                                    allowColumnResizing={true} 
                                    height={'690px'} 
                                    width={'100%'}
                                    dbApply={false}
                                    >
                                        <Paging defaultPageSize={20} />
                                        <Pager visible={true} allowedPageSizes={[5,10,20,50,100]} showPageSizeSelector={true} />
                                        <Scrolling mode="standart" />
                                        <Editing mode="cell" allowUpdating={false} allowDeleting={false} />
                                        <Column dataField="ITEM_CODE" caption={this.t("grdItems.clmItemCode")} width={160}/>
                                        <Column dataField="ITEM_NAME" caption={this.t("grdItems.clmItemName")} width={600}/>
                                        <Column dataField="PRICE" caption={this.t("grdItems.clmPrice")} format={{ style: "currency", currency: Number.money.code,precision: 2}} />
                                    </NdGrid>
                                </NdItem>
                            </NdForm>
                        </div>
                    </div>
                    <div className="row px-2 pt-1">
                        <div className="col-12">
                            <NdButton text={this.t("btnDateItemsSend")} type="default" width="100%" onClick={this.btnDateItemsSend}/>
                        </div>
                    </div>
                    <div className="row px-2 pt-2   ">
                        <div className="col-12">
                            <NdButton text={this.t("btnItemsSend")} type="default" width="100%" onClick={this.btnItemsSend}/>
                        </div>
                    </div>
                </ScrollView>
            </div>
        )
    }
}