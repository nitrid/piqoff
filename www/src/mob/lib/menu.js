import React from 'react';
import NbButton from '../../core/react/bootstrap/button';
import NbPopUp from '../../core/react/bootstrap/popup';
import NbBase from '../../core/react/bootstrap/base';

export const menu = (e) => 
{
    return [
        {
            id : "dash",
            text : e.t('menu.dash'),
            icon : "fa-chart-pie",
            path: "dashboard.js"
        },
        //Stok
        {
            id: 'stk',
            text: e.t('menu.stk'),
            icon : "fa-barcode",
            items: 
            [
                {
                    id: 'stk_01',
                    text : e.t('menu.stk_01'), //'Fiyat Gör'
                    icon : "fa-money-check",
                    path : "items/priceCheck.js"
                },
                {
                    id: 'stk_02',
                    text : e.t('menu.stk_02'), //'Tedarikçi Gör'
                    icon : "fa-user-tie",
                    path : "items/customerCheck.js",
                    color: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"
                },
                {
                    id: 'stk_03',
                    text : e.t('menu.stk_03'), //'Barkod Tanımlama'
                    icon : "fa-barcode",
                    path : "items/barcodeCard.js",
                    color: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)"
                },
                {
                    id: 'stk_04',
                    text : e.t('menu.stk_04'), //'Ürün Grubu Güncelle'
                    icon : "fa-chart-bar",
                    path : "items/itemGroupCard.js",
                    color: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)"
                },
                {
                    id: 'stk_05',
                    text : e.t('menu.stk_05'), //'Sayım '
                    icon : "fa-paste",
                    path: "items/itemCount.js",
                    color: "linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)"
                },
                {
                    id: 'stk_06',
                    text : e.t('menu.stk_06'), //'Etiket '
                    icon : "fa-tag",
                    path : "items/labelPrint.js",
                    color: "linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)"
                },
                {
                    id: 'stk_07',
                    text : e.t('menu.stk_07'), //'Özel Etiket Basımı'
                    icon : "fa-tags",
                    path : "items/privatePrinting.js",
                    color: "linear-gradient(135deg, #fdbb2d 0%, #22c1c3 100%)"
                },
                {
                    id: 'stk_09',
                    text : e.t('menu.stk_09'), //'Fire Çıkışı'
                    icon : "fa-solid fa-trash-can-arrow-up",
                    path : "items/outageDoc.js",
                    color: "linear-gradient(135deg, #ee9ca7 0%, #ffdde1 100%)"
                },
                {
                    id: 'stk_08',
                    text : e.t('menu.stk_08'), //'İade Ürünü Toplama'
                    icon : "fa-arrow-right-arrow-left",
                    path : "items/rebateTransfer.js",
                    color: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)"
                },
                {
                    id: 'stk_10',
                    text : e.t('menu.stk_10'), //'Son Kullanma Tarihi İşlemleri'
                    icon : "fa-solid fa-calendar-days",
                    path : "items/expdateOperations.js",
                    color: "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)"
                },
            ]
        },
        //Depo
        {
            id: 'dep',
            text: e.t('menu.dep'),
            icon : "fa-warehouse",
            color: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
            items: 
            [
                {
                    id: 'dep_01',
                    text : e.t('menu.dep_01'), //'Depolar Arası Sevk'
                    icon : "fa-dolly",
                    path: "depot/depotTransfer.js",
                    color: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)"
                },
                {
                    id: 'dep_02',
                    text : e.t('menu.dep_02'), //'Depo Siparişi'
                    icon : "fa-box-open",
                    path : "empty.js",
                    color: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)"
                },
                {
                    id: 'dep_03',
                    text : e.t('menu.dep_03'), //'Depo Mal Kabul'
                    icon : "fa-boxes-packing",
                    path : "empty.js",
                    color: "linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)"
                }
            ]
        },
        //İrsaliye
        {
            id: 'irs',
            text: e.t('menu.irs'),
            icon : "fa-file-lines",
            color: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
            items: 
            [
                {
                    id: 'irs_01',
                    text : e.t('menu.irs_01'), //'Alış İrsaliye'
                    icon : "fa-file-arrow-up",
                    path: "dispatch/purchaseDispatch.js",
                    color: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                },
                {
                    id: 'irs_02',
                    text : e.t('menu.irs_02'), //'Satış İrsaliye'
                    icon : "fa-file-arrow-down",
                    path: "dispatch/salesDispatch.js",
                    color: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
                },
                {
                    id: 'irs_03',
                    text : e.t('menu.irs_03'), //'Şube Satış İrsaliye'
                    icon : "fa-copy",
                    path: "dispatch/branchSaleDispatch.js",
                    color: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
                },
                {
                    id: 'irs_04',
                    text : e.t('menu.irs_04'), //'İade İrsaliye'
                    icon : "fa-arrow-right-arrow-left",
                    path: "dispatch/rebateDispatch.js",
                    color: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"
                },
            ]
        },
        //Sipariş
        {
            id: 'sip',
            text: e.t('menu.sip'),
            icon : "fa-file-pen",
            color: "linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)",
            items: 
            [
                {
                    id: 'sip_01',
                    text : e.t('menu.sip_01'), //'Satış Siparişi'
                    icon : "fa-file-export",
                    path: "order/salesOrder.js",
                    color: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)"
                },
                {
                    id: 'sip_02',
                    text : e.t('menu.sip_02'), //'Alış Siparişi'
                    icon : "fa-file-import",
                    path: "order/purchaseOrder.js",
                    color: "linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)"
                },
                {
                    id: 'sip_03',
                    text : e.t('menu.sip_03'), //'Toplu Sipariş Toplama'
                    icon : "fa-file-circle-plus",
                    path: "order/collectiveOrder.js",
                    color: "linear-gradient(135deg, #fdbb2d 0%, #22c1c3 100%)"
                },
                {
                    id: 'sip_04',
                    text : e.t('menu.sip_04'), //'Pos Sipariş Toplama'
                    icon : "fa-solid fa-bag-shopping",
                    path: "order/posOrder.js",
                    color: "linear-gradient(135deg, #ee9ca7 0%, #ffdde1 100%)"
                }
            ]
        },
        //Sipariş Karşılama
        {
            id: 'kar',
            text: e.t('menu.kar'),
            icon : "fa-cart-flatbed",
            color: "linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)",
            items: 
            [
                {
                    id: 'kar_01',
                    text : e.t('menu.kar_01'), //'Sipariş Eşleştirme'
                    icon : "fa-paste",
                    path: "pairing/salesPairing.js",
                    color: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)"
                },
                {
                    id: 'kar_02',
                    text : e.t('menu.kar_02'), //'Sipariş Mal Kabul'
                    icon : "fa-boxes-packing",
                    path : "empty.js",
                    color: "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)"
                }
            ]
        }
    ]
}

export class MenuView extends NbBase
{
    constructor(props)
    {
        super(props)
        this.isShowed = false
        this.state = {
            menuData : menu(props.lang),
            selectedCardId: null,
            parentCardId: null
        }
        this.prevMenu = []
        this.prev = false;
    }
    show()
    {
        this.isShowed = true
        this.popMenu.show()
    }
    hide()
    {
        this.isShowed = false
        this.popMenu.hide()
    }
    onClick(e)
    {
        if(typeof e.items == 'undefined')
        {
            // Son seviye menü öğesi - sayfaya git
            this.setState({selectedCardId: e.id})
            this.hide()
            if(typeof this.props.onMenuClick != 'undefined')
            {
                this.props.onMenuClick(e)
            }    
        }
        else
        {
            // Alt menü var - o menüye git
            this.setState({
                selectedCardId: e.id,
                parentCardId: e.id,
                menuData: e.items
            })
            this.prev = false
        }
    }
    menuBuild(pMenu)
    {
        let tmpMenuItem = []

        pMenu.map((item, index) =>
        {
            tmpMenuItem.push(
                <div className='col-4 pb-3' key={item.id}>
                    <div className='menu-card-corporate' style={{
                        background: 'linear-gradient(to right, #4a148c, #7b1fa2, #9c27b0, #ba68c8)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '16px',
                        boxShadow: '0 4px 15px rgba(74, 20, 140, 0.3)',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        position: 'relative',
                        height: '100px',
                        cursor: 'pointer',
                        overflow: 'hidden'
                    }}>
                        <NbButton className="form-group btn btn-block menu-button-corporate" 
                        style={{
                            height:"100%",
                            width:"100%",
                            background:"transparent",
                            border:"none",
                            borderRadius: '16px',
                        }} 
                        onClick={this.onClick.bind(this,item)}>
                            <div className='d-flex flex-column align-items-center' style={{padding: '3px 1px'}}>
                                {/* Icon without background */}
                                <div className='menu-icon-fixed' style={{
                                    width: '50px',
                                    height: '50px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: '2px',
                                    transition: 'all 0.3s ease',
                                    flexShrink: 0
                                }}>
                                    <i className={"fa-solid " + item.icon} style={{
                                        color:'#ffffff',
                                        fontSize: '28px',
                                        transition: 'all 0.3s ease'
                                    }}></i>
                            </div>
                                
                                {/* Text container with balanced spacing */}
                                <div style={{
                                    textAlign: 'center',
                                    width: '100%',
                                    minHeight: '20px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <span className='menu-text-corporate' style={{
                                        color:'#ffffff',
                                        fontSize:'12px',
                                        fontWeight:'600',
                                        lineHeight: '1.1',
                                        paddingTop: '1px',
                                        display: 'block',
                                        overflow: 'hidden',
                                        letterSpacing: '0',
                                        transition: 'all 0.3s ease',
                                        width: '100%'
                                    }}>
                                        {item.text}
                                    </span>
                        </div>
                            </div>
                        </NbButton>
                        </div>
                </div>
            )
        })
        return tmpMenuItem
    }
    
    render()
    {
        return (
            <NbPopUp id={"popMenu"} parent={this} title={""} fullscreen={true} header={false}>
                <div style={{
                    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)',
                    minHeight: '100vh',
                    position: 'fixed',
                    top: '0',
                    left: '0',
                    right: '0',
                    bottom: '0',
                    padding: '0',
                    zIndex: '1050'
                }}>
                    {/* Minimal Header */}
                    <div className="top-bar" style={{
                        background: 'linear-gradient(to right, #4a148c, #7b1fa2, #9c27b0, #ba68c8)',
                        height: "60px",
                        borderBottom: '1px solid rgba(255,255,255,0.2)',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0 10px',
                        zIndex: 1000,
                        position: 'relative',
                        borderRadius: '10px'
                    }}>
                        {/* Logo */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center'
                        }}>
                            <img src="./css/img/logo.png" width="40px" height="40px" style={{
                                borderRadius: '8px'
                            }}/>
                        </div>

                        {/* Hamburger Menu */}
                        <NbButton className="form-group btn btn-menu" style={{
                            height: "45px",
                            width: "45px",
                            background: 'transparent',
                            border: 'none',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        onClick={()=>
                        {
                            if(!this.popMenu.isShowed)
                            {                                
                                this.popMenu.show()
                            }
                            else
                            {
                                this.popMenu.hide()
                            }
                        }}>
                        <span style={{
                            color: '#ffffff',
                            fontSize: '36px',
                            fontFamily: 'Font Awesome 6 Free',
                            fontWeight: '900'
                        }}>☰</span>
                        </NbButton>

                        {/* Çıkış Butonu */}
                        <NbButton className="form-group btn btn-logout" style={{
                            height: "45px",
                            width: "45px",
                            background: 'transparent',
                            border: 'none',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        onClick={()=>
                        {
                            if(this.props.parent && this.props.parent.core)
                            {
                                this.props.parent.core.auth.logout()
                                window.location.reload()
                            }
                        }}>
                        <i className="fa-solid fa-door-open" style={{
                            color: '#ffffff',
                            fontSize: '28px'
                        }}></i>
                        </NbButton>
                    </div>

                    {/* Subtle background decoration */}
                    <div style={{
                        position: 'absolute',
                        top: 70,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: `
                            radial-gradient(circle at 25% 25%, rgba(102, 126, 234, 0.05) 0%, transparent 50%),
                            radial-gradient(circle at 75% 75%, rgba(118, 75, 162, 0.05) 0%, transparent 50%)
                        `,
                        pointerEvents: 'none'
                    }}></div>

                    <div style={{position: 'relative', zIndex: 1, padding: '15px 20px 20px 20px', height: 'calc(100vh - 60px)', overflowY: 'auto', marginTop: '10px'}}>
                    {(()=>
                    {
                        if(!this.prev)
                        {
                            this.prevMenu.push(this.state.menuData)
                        }
                        else
                        {
                            this.prev = false
                        }

                        if(this.prevMenu.length > 1)
                        {
                            return(
                                <div className='row' style={{paddingTop:"0px", marginBottom: "20px"}}>
                                    <div className='col-12'>
                                        <div style={{
                                            background: '#ffffff',
                                            borderRadius: '12px',
                                            border: '1px solid #e2e8f0',
                                            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                                        }}>
                                            <NbButton className="form-group btn btn-block back-button-modern" 
                                            style={{
                                                height:"40px",
                                                width:"100%",
                                                background:"transparent",
                                                border:"none",
                                                borderRadius: '12px'
                                            }} 
                                            onClick=
                                            {
                                                ()=>
                                                {
                                                    this.prevMenu.splice(this.prevMenu.length - 1,1)
                                                    this.prev = true
                                                        this.setState({
                                                            menuData : this.prevMenu[this.prevMenu.length - 1],
                                                            selectedCardId: null,
                                                            parentCardId: null
                                                        })
                                                    }
                                            }>
                                                <div className='d-flex align-items-center justify-content-start h-100 px-3'>
                                                    <div style={{
                                                    background: 'linear-gradient(135deg, #4a148c, #7b1fa2)',
                                                    borderRadius: '10px',
                                                    width: '36px',
                                                    height: '36px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    marginRight: '12px',
                                                    border: '1px solid rgba(255,255,255,0.2)',
                                                    transition: 'all 0.2s ease'
                                                }}>
                                                        <i className={"fa-solid fa-arrow-left"} style={{
                                                            color:'#ffffff',
                                                            fontSize: '24px'
                                                        }}></i>
                                                </div>
                                                    <span style={{
                                                        color:'#4a148c',
                                                        margin: '0',
                                                        fontSize: '14px',
                                                        fontWeight: '600'
                                                    }}>
                                                        {this.props.lang.t("btnBack")}
                                                    </span>
                                            </div>
                                            </NbButton>
                                        </div>
                                    </div>
                            </div>
                            )
                        }
                    })()}
                    
                        <div className='row' style={{paddingTop:"0px"}}>
                        {this.menuBuild(this.state.menuData)}
                        </div>
                    </div>
                </div>

                <style>{`
                    @media (max-width: 768px) {
                        .menu-card-corporate {
                            height: 100px;
                        }
                        
                        .menu-icon-fixed {
                            width: 60px;
                            height: 60px;
                            margin-bottom: 12px;
                        }
                        
                        .menu-icon-fixed i {
                            font-size: 22px;
                        }
                        
                        .menu-text-corporate {
                            font-size: 12px;
                            line-height: 1.2;
                        }
                    }
                `}</style>
            </NbPopUp>
        )
    }
}