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

import { datatable } from '../../../../core/core.js';

export default class promoPricerSend extends React.PureComponent
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
                    query : "SELECT CASE APP_TYPE WHEN 5 THEN APP_AMOUNT " + 
                            " WHEN 0 THEN ROUND((SELECT [dbo].[FN_PRICE](COND_ITEM_GUID,1,GETDATE(),'00000000-0000-0000-0000-000000000000','00000000-0000-0000-0000-000000000000',1,0,1)) - (SELECT [dbo].[FN_PRICE](COND_ITEM_GUID,1,GETDATE(),'00000000-0000-0000-0000-000000000000','00000000-0000-0000-0000-000000000000',1,0,1)) * ((APP_AMOUNT / 100)),2) END AS PRICE," +
                            "COND_ITEM_GUID AS ITEM, " +
                            "COND_ITEM_NAME AS ITEM_NAME, " +
                            "COND_ITEM_CODE AS ITEM_CODE, " +
                            "CODE AS CODE, " +
                            "NAME AS NAME " +
                            " FROM PROMO_COND_APP_VW_01  WHERE  APP_TYPE IN(5,0) AND START_DATE <= CONVERT(nvarchar,GETDATE(),112) AND FINISH_DATE >= CONVERT(nvarchar,GETDATE(),112)  ",
                },
                sql : this.core.sql
            }
        }
        App.instance.setState({isExecute:true})
        await this.grdPromotion.dataRefresh(tmpSource)
        App.instance.setState({isExecute:false})
    }
    async btnPromoSend()
    {
        this.core.socket.emit('allPromoSend')
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
                                    <NdGrid parent={this} id={"grdPromotion"} 
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
                                            <Column dataField="CODE" caption={this.t("grdPromotion.clmCode")} width={100} allowEditing={false}/>
                                            <Column dataField="NAME" caption={this.t("grdPromotion.clmName")} width={150} allowEditing={false}/>
                                            <Column dataField="ITEM_CODE" caption={this.t("grdPromotion.clmItemCode")} width={100}/>
                                            <Column dataField="ITEM_NAME" caption={this.t("grdPromotion.clmItemName")} width={200}/>
                                            <Column dataField="PRICE" caption={this.t("grdPromotion.clmPrice")} format={{ style: "currency", currency: Number.money.code,precision: 2}} />
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