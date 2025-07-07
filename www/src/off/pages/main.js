import React from 'react';
import App from '../lib/app.js';
import moment from 'moment';
import ScrollView from 'devextreme-react/scroll-view';
import Toolbar from 'devextreme-react/toolbar';
import Form, { Label,Item,EmptyItem } from 'devextreme-react/form';
import TabPanel from 'devextreme-react/tab-panel';
import { Button } from 'devextreme-react/button';

import NdTextBox, { Validator, NumericRule, RequiredRule, CompareRule, EmailRule, PatternRule, StringLengthRule, RangeRule, AsyncRule } from '../../core/react/devex/textbox.js'
import NdNumberBox from '../../core/react/devex/numberbox.js';
import NdSelectBox from '../../core/react/devex/selectbox.js';
import NdCheckBox from '../../core/react/devex/checkbox.js';
import NdPopGrid from '../../core/react/devex/popgrid.js';
import NdPopUp from '../../core/react/devex/popup.js';
import NdGrid,{Column,Editing,Paging,Pager,Scrolling,KeyboardNavigation,Export} from '../../core/react/devex/grid.js';
import NdButton from '../../core/react/devex/button.js';
import NdDatePicker from '../../core/react/devex/datepicker.js';
import NdImageUpload from '../../core/react/devex/imageupload.js';
import NdDialog, { dialog } from '../../core/react/devex/dialog.js';
import { datatable } from '../../core/core.js';

export default class mainPage extends React.PureComponent
{
    constructor(props)
    {
        super(props)
        this.core = App.instance.core;
        this.prmObj = this.param.filter({TYPE:1,USERS:this.user.CODE});
        this.acsobj = this.access.filter({TYPE:1,USERS:this.user.CODE});
        this.tmpLastMenu = []
        this.state = {
            tmpLastMenu:[],
            iconIndex: 0
        }
        
        // 5 farklı yıldız temalı icon
        this.favoriteIcons = [
            { icon: 'fa-solid fa-star', color: '#FFD700' }, 
            { icon: 'fa-solid fa-star', color: '#FFA500' },    
            { icon: 'fa-solid fa-star', color: '#FF4500' },      
            { icon: 'fa-solid fa-star', color: '#9370DB' },     
            { icon: 'fa-solid fa-star', color: '#1E90FF' }   
        ];
        
        // Ana ekranda gösterilecek menü öğelerini tanımla
        this.menuItems = [
            { id: 'stk_01_001', icon: 'fa-solid fa-box-open', color: '#28a745', path:'items/cards/itemCard' },
            { id: 'stk_03_001', icon: 'fa-solid fa-list', color: '#28a745', path:'items/lists/itemList' },
            { id: 'cri_01_001', icon: 'fa-solid fa-user-plus', color: '#28a745', path:'customers/cards/customerCard' },
            { id: 'cri_02_001', icon: 'fa-solid fa-users', color: '#28a745', path:'customers/lists/customerList' },
            { id: 'cri_04_001', icon: 'fa-solid fa-file-lines', color: '#6c757d', path:'customers/report/customerExtreReport' },
            { id: 'cri_04_002', icon: 'fa-solid fa-scale-balanced', color: '#6c757d', path:'customers/report/customerBalanceReport' },
            { id: 'tkf_02_002', icon: 'fa-solid fa-clipboard-list', color: '#ffc107', path:'offers/documents/salesOffer' },
            { id: 'irs_02_001', icon: 'fa-solid fa-truck-loading', color: '#6f42c1', path:'dispatch/documents/purchaseDispatch' },
            { id: 'irs_02_003', icon: 'fa-solid fa-exchange-alt', color: '#fd7e14', path:'dispatch/documents/rebatePurcDispatch' },
            { id: 'ftr_02_001', icon: 'fa-solid fa-file-invoice', color: '#20c997', path:'invoices/documents/purchaseInvoice' },
            { id: 'irs_02_002', icon: 'fa-solid fa-shipping-fast', color: '#fd7e14', path:'dispatch/documents/salesDispatch' },
            { id: 'ftr_02_002', icon: 'fa-solid fa-receipt', color: '#6c757d', path:'invoices/documents/salesInvoice' },
            { id: 'piqx_02_001', icon: 'fa-solid fa-file-import', color: '#343a40', path:'piqx/invoices/piqXPurcFactList'},
            { id: 'piqx_01_001', icon: 'fa-solid fa-truck-fast', color: '#e83e8c', path:'piqx/dispatch/piqXPurcDispatchList' },
            { id: 'fns_02_002', icon: 'fa-solid fa-file-invoice-dollar', color: '#e83e8c', path:'finance/documents/collection' },
            { id: 'fns_02_001', icon: 'fa-solid fa-money-bill-wave', color: '#28a745', path:'finance/documents/payment' },
            { id: 'slsRpt_01_003', icon: 'fa-solid fa-chart-pie', color: '#17a2b8', path:'sales/report/salesInvoiceReport' },
            { id: 'slsRpt_01_006', icon: 'fa-solid fa-chart-column', color: '#ffc107', path:'sales/report/customerBasedSaleAndReturnReport' },
            { id: 'slsRpt_01_007', icon: 'fa-solid fa-percent', color: '#fd7e14', path:'sales/report/rebateInvoiceReport' },
            { id: 'slsRpt_02_006', icon: 'fa-solid fa-folder-open', color: '#6f42c1', path:'purchase/report/openPurchaseInvoiceReport' },
            { id: 'slsRpt_01_013', icon: 'fa-solid fa-sack-dollar', color: '#28a745', path:'purchase/report/customerProfitReport' },
            { id: 'fns_04_005', icon: 'fa-solid fa-magnifying-glass-dollar', color: '#e83e8c', path:'finance/report/collectionReport' },
            { id: 'pos_02_021', icon: 'fa-solid fa-chart-line', color: '#17a2b8', path:'pos/report/posSalesStatisticalReport' },
            { id: 'pos_02_003', icon: 'fa-solid fa-clipboard-list', color: '#e83e8c', path:'pos/report/posSalesReport' },
            { id:'pos_02_002',icon:'fa-solid fa-gift',color:'#28a745',path:'pos/report/customerPointReport'}
        ]
    }
    componentDidMount()
    {
        if(typeof this.pagePrm != 'undefined')
        {
            this.init(this.pagePrm)
        }

    }
    async init(pMenu)
    {

        if(pMenu.length == 0)
        {
            this.setState({tmpLastMenu:this.menuItems.slice(0,4)})
        }
        else
        {
            await this.mergeMenu(pMenu,this.menuItems)
            setTimeout(() => {
                this.setState({tmpLastMenu:this.tmpLastMenu})
            }, 500);
        }
      
        // let tmpQuery = 
        // {
        //     query : "SELECT * FROM " +
        //             "(SELECT *, " +
        //             "ISNULL((SELECT SUM(QUANTITY) FROM POS_SALE  WHERE POS_SALE.ITEM = ITEM_EXPDATE_VW_01.ITEM_GUID AND POS_SALE.DELETED = 0 AND POS_SALE.CDATE > ITEM_EXPDATE_VW_01.CDATE),0) AS DIFF " +
        //             "FROM [ITEM_EXPDATE_VW_01] WHERE  " +
        //             " (dbo.GETDATE()+15 >  EXP_DATE) AND (EXP_DATE >= dbo.GETDATE())) AS TMP WHERE QUANTITY - DIFF > 0",
        // }
        // let tmpData = await this.core.sql.execute(tmpQuery) 
        // if(tmpData.result.recordset.length > 0)
        // {
        //     let tmpConfObj =
        //     {
        //         id:'msgExpUpcoming',showTitle:true,title:this.lang.t("msgExpUpcoming.title"),showCloseButton:true,width:'500px',height:'200px',
        //         button:[{id:"btn01",caption:this.lang.t("msgExpUpcoming.btn01"),location:'before'},{id:"btn02",caption:this.lang.t("msgExpUpcoming.btn02"),location:'after'}],
        //         content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgExpUpcoming.msg")}</div>)
        //     }
        //     let pResult = await dialog(tmpConfObj);
        //     if(pResult == 'btn02')
        //     {
        //         App.instance.menuClick(
        //         {
        //             id: 'stk_04_004',
        //             text: this.lang.t('menuOff.stk_04_004'),
        //             path: 'items/operations/expdateOperations',
        //         })
        //     }
           
        // }
    }
    getNextFavoriteIcon() {
        const currentIndex = this.state.iconIndex;
        const nextIndex = (currentIndex + 1) % this.favoriteIcons.length;
        this.setState({ iconIndex: nextIndex });
        return this.favoriteIcons[currentIndex];
    }
    async mergeMenu(tmpMenu,tmpMenuData)
    {
        console.log("tmpMenu",tmpMenu)
        return new Promise(async resolve => 
        {
            tmpMenu.forEach(async function (element,index,object)
            {
                let tmpMerge = await tmpMenuData.findSub({id:element.id},'items')
                if(typeof tmpMerge != 'undefined' )
                {
                    this.tmpLastMenu.push(tmpMerge)
                }
                else
                {
                    const nextIcon = this.getNextFavoriteIcon();
                    let tmpNewMerge = {
                        id: element.id,
                        icon: nextIcon.icon,
                        color: nextIcon.color,
                        path: element.path
                    }
                    this.tmpLastMenu.push(tmpNewMerge)
                }
            }.bind(this));
            
            resolve(this.tmpLastMenu)
        });
    }

    render()
    {
        return(
            <ScrollView>
                <div>
                    <div className='row pt-3' style={{paddingBottom:"20px"}}>
                        {this.state.tmpLastMenu.map((function(object, i)
                        {
                            return (
                                <div className="col-3 mb-4" key={object.id}>
                                    <div className="card text-center shadow-sm" 
                                        style={{
                                            cursor:'pointer', 
                                            height:'180px', 
                                            borderRadius:'10px', 
                                            background:'#f8f9fa', 
                                            border:'1px solid #dee2e6'
                                        }} 
                                        onClick={() => {
                                            App.instance.menuClick({
                                                id: object.id,
                                                text: this.lang.t(`menuOff.${object.id}`),
                                                path: object.path,
                                            })
                                        }}>
                                        <div className="card-body d-flex flex-column justify-content-center">
                                            <i className={object.icon + " mb-3"} 
                                                style={{fontSize:'50px', color:object.color}}></i>
                                            <h5 className="card-title" 
                                                style={{fontSize:'16px', fontWeight:'600'}}>
                                                {this.lang.t(`menuOff.${object.id}`)}
                                            </h5>
                                        </div>
                                    </div>
                                </div>
                                )
                    }).bind(this))}                
                </div>    
            </div>
        </ScrollView>
        )
    }
}