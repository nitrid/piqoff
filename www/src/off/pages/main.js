import React from 'react';
import App from '../lib/app.js';
import moment from 'moment';
import ScrollView from 'devextreme-react/scroll-view';
import Toolbar from 'devextreme-react/toolbar';
import Form, { Label,Item,EmptyItem } from 'devextreme-react/form';
import TabPanel from 'devextreme-react/tab-panel';
import { Button } from 'devextreme-react/button';
import Sortable from 'devextreme-react/sortable';

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
            iconIndex: 0,
            draggedItem: null,
            draggedIndex: null
        }
        
        // Drag & Drop için method bind
        this.onDragStart = this.onDragStart.bind(this);
        this.onDragOver = this.onDragOver.bind(this);
        this.onDragLeave = this.onDragLeave.bind(this);
        this.onDrop = this.onDrop.bind(this);
        this.onDragEnd = this.onDragEnd.bind(this);
        
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
            { id: 'tkf_02_002', icon: 'fa-solid fa-clipboard-list', color: '#ffc107', path:'offers/documents/salesOffer' },
            { id: 'irs_02_001', icon: 'fa-solid fa-truck-loading', color: '#6f42c1', path:'dispatch/documents/purchaseDispatch' },
            { id: 'irs_02_003', icon: 'fa-solid fa-exchange-alt', color: '#fd7e14', path:'dispatch/documents/rebatePurcDispatch' },
            { id: 'ftr_02_001', icon: 'fa-solid fa-file-invoice', color: '#20c997', path:'invoices/documents/purchaseInvoice' },
            { id: 'irs_02_002', icon: 'fa-solid fa-shipping-fast', color: '#fd7e14', path:'dispatch/documents/salesDispatch' },
            { id: 'ftr_02_002', icon: 'fa-solid fa-receipt', color: '#6c757d', path:'invoices/documents/salesInvoice' },
            { id: 'piqx_02_001', icon: 'fa-solid fa-file-import', color: '#343a40', path:'piqx/invoices/piqXPurcFactList'},
            { id: 'piqx_01_001', icon: 'fa-solid fa-file-invoice-dollar', color: '#e83e8c', path:'piqx/dispatch/piqXPurcDispatchList' },
            { id: 'fns_02_002', icon: 'fa-solid fa-file-invoice-dollar', color: '#e83e8c', path:'finance/documents/collection' },
            { id: 'ftr_02_003', icon: 'fa-solid fa-file-invoice-dollar', color: '#17a2b8', path:'invoices/documents/rebateInvoice' },
            { id: 'ftr_02_004', icon: 'fa-solid fa-file-contract', color: '#6f42c1', path:'invoices/documents/branchPurcInvoice' },
            { id: 'irs_02_004', icon: 'fa-solid fa-undo', color: '#dc3545', path:'dispatch/documents/rebateDispatch' },
            { id: 'stk_02_001', icon: 'fa-solid fa-boxes', color: '#28a745', path:'items/cards/itemGroupCard' },
            { id: 'stk_04_001', icon: 'fa-solid fa-warehouse', color: '#28a745', path:'items/reports/itemMoveReport' },
            { id: 'fns_02_003', icon: 'fa-solid fa-credit-card', color: '#ffc107', path:'finance/documents/payment' },
            { id: 'fns_02_004', icon: 'fa-solid fa-exchange-alt', color: '#17a2b8', path:'finance/lists/collectionList' },
            { id: 'fns_02_005', icon: 'fa-solid fa-chart-line', color: '#6f42c1', path:'finance/reports/collectionReport' },
            { id: 'slsRpt_01_009', icon: 'fa-solid fa-chart-bar', color: '#dc3545', path:'invoices/reports/openInvoiceSalesReport' },
            { id: 'slsRpt_01_012', icon: 'fa-solid fa-chart-pie', color: '#fd7e14', path:'invoices/reports/productProfitReport' },
            { id: 'slsRpt_01_013', icon: 'fa-solid fa-user-chart', color: '#6f42c1', path:'invoices/reports/customerProfitReport' },

        ];

    }
    componentDidMount()
    {
        if(typeof this.pagePrm != 'undefined')
        {
            this.init(this.pagePrm)
        }
        else
        {
            this.init([]);
        }
    }
    async init(pMenu)
    {
        if(pMenu.length == 0)
        {
            // localStorage'dan kaydedilmiş sıralamayı kontrol et
            try {
                const savedOrder = localStorage.getItem('userMenuOrder');
                if(savedOrder) {
                    const parsedOrder = JSON.parse(savedOrder);
                    
                    // Kaydedilmiş sıralamaya göre menü öğelerini sırala
                    const orderedMenu = [];
                    parsedOrder.forEach(savedItem => {
                        const menuItem = this.menuItems.find(item => item.id === savedItem.id);
                        if(menuItem) {
                            orderedMenu.push(menuItem);
                        }
                    });
                    
                    // Eğer kaydedilmiş sıralamada olmayan yeni öğeler varsa, onları da ekle
                    this.menuItems.slice(0, 4).forEach(item => {
                        if(!orderedMenu.find(ordered => ordered.id === item.id)) {
                            orderedMenu.push(item);
                        }
                    });
                    
                    this.setState({tmpLastMenu: orderedMenu.slice(0, 4)});
                } else {
                    // Kaydedilmiş sıralama yoksa varsayılan ilk 4 öğeyi göster
                    this.setState({tmpLastMenu:this.menuItems.slice(0,4)});
                }
            } catch (error) {
                this.setState({tmpLastMenu:this.menuItems.slice(0,4)});
            }
        }
        else
        {
            await this.mergeMenu(pMenu,this.menuItems)
            setTimeout(() => {
                this.setState({tmpLastMenu:this.tmpLastMenu})
            }, 500);
        }
    }
    getNextFavoriteIcon() {
        const currentIndex = this.state.iconIndex;
        const nextIndex = (currentIndex + 1) % this.favoriteIcons.length;
        this.setState({ iconIndex: nextIndex });
        return this.favoriteIcons[currentIndex];
    }
    async mergeMenu(tmpMenu,tmpMenuData)
    {
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
    onDragStart(e) {
        const index = parseInt(e.currentTarget.dataset.index);
        const item = this.state.tmpLastMenu[index];
        
        e.dataTransfer.setData('text/plain', JSON.stringify(item));
        e.dataTransfer.setData('text/index', index.toString());
        e.dataTransfer.effectAllowed = 'move';
        
        this.setState({ draggedItem: item, draggedIndex: index });
        
        // Drag görünümü için
        e.currentTarget.style.opacity = '0.5';
    }
    
    onDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        
        // Drop zone görsel feedback
        if(e.currentTarget.classList.contains('sortable-item')) {
            e.currentTarget.style.borderLeft = '3px solid #007bff';
        }
    }
    
    onDragLeave(e) {
        // Drop zone görsel feedback temizle
        if(e.currentTarget.classList.contains('sortable-item')) {
            e.currentTarget.style.borderLeft = '';
        }
    }
    
    onDrop(e) {
        e.preventDefault();
        
        const dropIndex = parseInt(e.currentTarget.dataset.index);
        const dragIndex = this.state.draggedIndex;
        
        if(dragIndex !== dropIndex && dragIndex !== null) {
            const reorderedMenu = [...this.state.tmpLastMenu];
            const [movedItem] = reorderedMenu.splice(dragIndex, 1);
            reorderedMenu.splice(dropIndex, 0, movedItem);
            
            this.setState({ tmpLastMenu: reorderedMenu });
            
            // localStorage'a kaydet
            try {
                const menuOrder = reorderedMenu.map(item => ({ id: item.id, path: item.path }));
                localStorage.setItem('userMenuOrder', JSON.stringify(menuOrder));
            } catch (error) {
                // Hata durumunda sessizce devam et
            }
            
            // favMenu sıralamasını da güncelle
            this.updateFavMenuOrder(reorderedMenu);
        }
        
        // Görsel feedback temizle
        e.currentTarget.style.borderLeft = '';
    }
    
    async updateFavMenuOrder(reorderedMenu) {
        try {
            // Tam menu objelerini oluştur (sadece id/path değil)
            const fullMenuItems = reorderedMenu.map(item => {
                return {
                    id: item.id,
                    text: this.lang.t(`menuOff.${item.id}`), // Text bilgisini ekle
                    icon: item.icon,
                    color: item.color,
                    path: item.path,
                    visible: true // Görünürlük ekle
                };
            });
            
            // Navigation component'ine erişim için App instance kullan
            if(App.instance.navigation && App.instance.navigation.favMenuObj) {
                const favMenuObj = App.instance.navigation.favMenuObj;
                
                if(favMenuObj.dt().length > 0) {
                    // Mevcut favMenu'yu güncelle
                    favMenuObj.dt()[0].VALUE = JSON.stringify(fullMenuItems);
                    await favMenuObj.save();
                    
                    // Navigation state'ini de güncelle
                    if(App.instance.navigation.setState) {
                        App.instance.navigation.setState({ favMenu: fullMenuItems });
                    }
                } else {
                    // Yeni favMenu kaydı oluştur
                    let tmpEmpty = {...favMenuObj.empty};
                    tmpEmpty.TYPE = 0;
                    tmpEmpty.ID = "favMenu";
                    tmpEmpty.VALUE = JSON.stringify(fullMenuItems);
                    tmpEmpty.USERS = this.core.auth.data.CODE;
                    tmpEmpty.APP = "OFF";
                    
                    favMenuObj.addEmpty(tmpEmpty);
                    await favMenuObj.save();
                    
                    // Navigation state'ini de güncelle
                    if(App.instance.navigation.setState) {
                        App.instance.navigation.setState({ favMenu: fullMenuItems });
                    }
                }
            }
        } catch (error) {
            // Hata durumunda sessizce devam et
        }
    }
    
    onDragEnd(e) {
        // Opacity'yi geri getir
        e.currentTarget.style.opacity = '1';
        
        // State temizle
        this.setState({ draggedItem: null, draggedIndex: null });
        
        // Tüm görsel feedback'leri temizle
        document.querySelectorAll('.sortable-item').forEach(item => {
            item.style.borderLeft = '';
        });
    }
    render()
    {
        return(
            <ScrollView>
                <style>{`
                    .sortable-item {
                        transition: all 0.2s ease;
                    }
                    .sortable-item:hover {
                        z-index: 10;
                    }
                    .sortable-item[draggable="true"] {
                        cursor: grab;
                    }
                    .sortable-item[draggable="true"]:active {
                        cursor: grabbing;
                    }
                `}</style>
                <div>
                    <div className='row pt-3' style={{
                        paddingBottom:"20px",
                        minHeight: "200px",
                        position: "relative",
                        overflow: "visible"
                    }}>
                        {this.state.tmpLastMenu.map((function(object, i)
                        {
                            return (
                                <div className="col-3 mb-4 sortable-item" key={object.id} data-id={object.id} data-index={i}>
                                    <div className="card text-center shadow-sm" 
                                        draggable={true}
                                        onDragStart={this.onDragStart}
                                        onDragOver={this.onDragOver}
                                        onDragLeave={this.onDragLeave}
                                        onDrop={this.onDrop}
                                        onDragEnd={this.onDragEnd}
                                        data-index={i}
                                        style={{
                                            cursor:'grab', 
                                            height:'180px', 
                                            borderRadius:'10px', 
                                            background:'#f8f9fa', 
                                            border:'1px solid #dee2e6',
                                            transition: 'all 0.2s ease',
                                            userSelect: 'none',
                                            position: 'relative',
                                            touchAction: 'none'
                                        }} 
                                        onMouseDown={(e) => {
                                            e.currentTarget.style.cursor = 'grabbing';
                                        }}
                                        onMouseUp={(e) => {
                                            e.currentTarget.style.cursor = 'grab';
                                        }}
                                        onMouseEnter={(e) => {
                                            if(!this.state.draggedItem) {
                                                e.currentTarget.style.transform = 'translateY(-3px)';
                                                e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.12)';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if(!this.state.draggedItem) {
                                                e.currentTarget.style.transform = 'translateY(0)';
                                                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                                                e.currentTarget.style.cursor = 'grab';
                                            }
                                        }}
                                        onClick={(e) => {
                                            // Sadece drag işlemi değilse click eventi çalıştır
                                            if(!this.state.draggedItem) {
                                                App.instance.menuClick({
                                                    id: object.id,
                                                    text: this.lang.t(`menuOff.${object.id}`),
                                                    path: object.path,
                                                });
                                            }
                                        }}>
                                        <div className="card-body d-flex flex-column justify-content-center" style={{pointerEvents: 'none'}}>
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