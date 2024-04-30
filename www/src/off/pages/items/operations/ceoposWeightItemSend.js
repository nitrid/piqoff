import React from 'react';
import App from '../../../lib/app.js';
import moment from 'moment';

import Toolbar,{Item} from 'devextreme-react/toolbar';
import Form, { Label,EmptyItem } from 'devextreme-react/form';
import ScrollView from 'devextreme-react/scroll-view';

import NdGrid,{Column,Editing,Paging,Pager,Scrolling,KeyboardNavigation,Export} from '../../../../core/react/devex/grid.js';
import NdButton from '../../../../core/react/devex/button.js';
import NdTextBox from '../../../../core/react/devex/textbox.js'
import NbDateRange from '../../../../core/react/bootstrap/daterange.js';
import { dialog } from '../../../../core/react/devex/dialog.js';


export default class ceoposWeightItemSend extends React.PureComponent
{
    constructor(props)
    {
        super(props)

        this.core = App.instance.core;
        this.btnPromoSend = this.btnPromoSend.bind(this)
        
    }
    async componentDidMount()
    {
        await this.core.util.waitUntil(0)
        this.init()
    }
    async init()
    {
        let tmpSource =
        {
            source : 
            {
                groupBy : this.groupList,
                select : 
                {
                    query :"select UNIT_ID,NAME,CODE,SUBSTRING(MAX(BARCODE),0,5) AS BARCODE,PRICE_SALE,MAIN_GRP from ITEMS_BARCODE_MULTICODE_VW_01 WHERE CEOPOS = 1 GROUP BY  UNIT_ID,NAME,CODE,PRICE_SALE,MAIN_GRP",
                },
                sql : this.core.sql
            }
        }
        App.instance.setState({isExecute:true})
        await this.grdItems.dataRefresh(tmpSource)
        App.instance.setState({isExecute:false})
    }
    async btnPromoSend()
    {
        let tmpFile = ''
        for (let i = 0; i < this.grdItems.data.datatable.length; i++) 
        {
            let tmptxt = ''
            if(this.grdItems.data.datatable[i].UNIT_ID == '001')
            {
                tmptxt = tmptxt + '26'
            }
            else
            {
                tmptxt = tmptxt + '27'
            }

            tmptxt = tmptxt + this.grdItems.data.datatable[i].NAME.substring(0,25)
            let tmpSpace = 27 -tmptxt.length 
            console.log(tmpSpace)
            for (let x = 0; x < tmpSpace; x++) 
            {
                tmptxt = tmptxt + ' '
            }
            let tmpPrice = (this.grdItems.data.datatable[i].PRICE_SALE * 100).toFixed(0)
            let tmpPriceControl = 6 - tmpPrice.length
            for (let r = 0; r < tmpPriceControl; r++) 
            {
                tmpPrice = '0'+tmpPrice
            }
            if(this.grdItems.data.datatable[i].UNIT_ID == '001')
            {
                tmptxt = tmptxt + '2'
            }
            else
            {
                tmptxt = tmptxt + '3'
            }
            tmptxt = tmptxt + tmpPrice + this.grdItems.data.datatable[i].BARCODE
            tmpFile = tmpFile+ tmptxt + '\n'
        }
        let tmppath =  '/plugins'
        await this.core.util.writeFile(tmppath + '/weightItems.txt',tmpFile)

        let tmpConfObj1 =
        {
            id:'msgPromoSend',showTitle:true,title:this.t("msgPromoSend.title"),showCloseButton:true,width:'500px',height:'200px',
            button:[{id:"btn01",caption:this.t("msgPromoSend.btn01"),location:'after'}],
        }
             
        tmpConfObj1.content = (<div style={{textAlign:"center",fontSize:"20px",color:"green"}}>{this.t("msgPromoSend.msgSuccess")}</div>)
        await dialog(tmpConfObj1);
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
                                }/>
                            </Toolbar>
                        </div>
                    </div>

                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <NdButton text={this.t("btnPromoSend")} type="default" width="100%" 
                            onClick={this.btnPromoSend}></NdButton>
                        </div>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <Form colCount={1} id="frmGrid">
                                <Item>
                                    <NdGrid parent={this} id={"grdItems"} 
                                        showBorders={true} 
                                        columnsAutoWidth={true} 
                                        allowColumnReordering={true} 
                                        allowColumnResizing={true} 
                                        height={'500'} 
                                        width={'100%'}
                                        dbApply={false}
                                        >
                                            <Paging defaultPageSize={20} />
                                            <Pager visible={true} allowedPageSizes={[5,10,20,50,100]} showPageSizeSelector={true} />
                                            <Scrolling mode="standart" />
                                            <Editing mode="cell" allowUpdating={false} allowDeleting={false} />
                                            <Column dataField="CODE" caption={this.t("grdItems.clmCode")} width={150} allowEditing={false}/>
                                            <Column dataField="NAME" caption={this.t("grdItems.clmName")} width={350} allowEditing={false}/>
                                            <Column dataField="PRICE" caption={this.t("grdItems.clmPrice")} format={{ style: "currency", currency: Number.money.code,precision: 2}} />
                                    </NdGrid>
                                </Item>
                            </Form>
                        </div>
                    </div>
                </ScrollView>
            </div>
        )
    }
}