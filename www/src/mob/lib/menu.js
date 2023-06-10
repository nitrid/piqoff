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
                },
                {
                    id: 'stk_02',
                    text : e.t('menu.stk_02'), //'Tedarikçi Gör'
                    icon : "fa-user-tie",
                },
                {
                    id: 'stk_03',
                    text : e.t('menu.stk_03'), //'Barkod Tanımlama'
                    icon : "fa-barcode",
                },
                {
                    id: 'stk_04',
                    text : e.t('menu.stk_04'), //'Ürün Grubu Güncelle'
                    icon : "fa-chart-bar",
                },
                {
                    id: 'stk_05',
                    text : e.t('menu.stk_05'), //'Sayım '
                    icon : "fa-paste",
                },
                {
                    id: 'stk_06',
                    text : e.t('menu.stk_06'), //'Etiket '
                    icon : "fa-tag",
                },
                {
                    id: 'stk_07',
                    text : e.t('menu.stk_07'), //'Özel Etiket Basımı'
                    icon : "fa-tags",
                },
                {
                    id: 'stk_08',
                    text : e.t('menu.stk_08'), //'İade Ürünü Toplama'
                    icon : "fa-arrow-right-arrow-left",
                }
            ]
        },
        //Depo
        {
            id: 'dep',
            text: e.t('menu.dep'),
            icon : "fa-warehouse",
            items: 
            [
                {
                    id: 'dep_01',
                    text : e.t('menu.dep_01'), //'Depolar Arası Sevk'
                    icon : "fa-dolly",
                },
                {
                    id: 'dep_02',
                    text : e.t('menu.dep_02'), //'Depo Siparişi'
                    icon : "fa-box-open",
                },
                {
                    id: 'dep_03',
                    text : e.t('menu.dep_03'), //'Depo Mal Kabul'
                    icon : "fa-boxes-packing",
                }
            ]
        },
        //İrsaliye
        {
            id: 'irs',
            text: e.t('menu.irs'),
            icon : "fa-file-lines",
            items: 
            [
                {
                    id: 'irs_01',
                    text : e.t('menu.irs_01'), //'Alış İrsaliye'
                    icon : "fa-file-arrow-up",
                },
                {
                    id: 'irs_02',
                    text : e.t('menu.irs_02'), //'Satış İrsaliye'
                    icon : "fa-file-arrow-down",
                },
                {
                    id: 'irs_03',
                    text : e.t('menu.irs_03'), //'Şube Satış İrsaliye'
                    icon : "fa-copy",
                },
            ]
        },
        //Sipariş
        {
            id: 'sip',
            text: e.t('menu.sip'),
            icon : "fa-file-pen",
            items: 
            [
                {
                    id: 'sip_01',
                    text : e.t('menu.sip_01'), //'Satış Siparişi'
                    icon : "fa-file-export",
                },
                {
                    id: 'sip_02',
                    text : e.t('menu.sip_02'), //'Alış Siparişi'
                    icon : "fa-file-import",
                    path: "order/purchaseOrder.js"
                },
                {
                    id: 'sip_03',
                    text : e.t('menu.sip_03'), //'Toplu Sipariş Toplama'
                    icon : "fa-file-circle-plus",
                }
            ]
        },
        //Sipariş Karşılama
        {
            id: 'kar',
            text: e.t('menu.kar'),
            icon : "fa-cart-flatbed",
            items: 
            [
                {
                    id: 'kar_01',
                    text : e.t('menu.kar_01'), //'Sipariş Eşleştirme'
                    icon : "fa-paste",
                },
                {
                    id: 'kar_02',
                    text : e.t('menu.kar_02'), //'Sipariş Mal Kabul'
                    icon : "fa-boxes-packing",
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
        this.state = {menuData : menu(props.lang)}
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
            this.hide()
            if(typeof this.props.onMenuClick != 'undefined')
            {
                this.props.onMenuClick(e)
            }    
        }
        else
        {
            this.prev = false
            this.setState({menuData:e.items})
        }
    }
    menuBuild(pMenu)
    {
        let tmpMenuItem = []

        pMenu.map((item) =>
        {
            tmpMenuItem.push(
                <div className='col-4 pb-2' key={item.id}>
                    <NbButton className="form-group btn btn-primary btn-purple-light btn-block" style={{height:"100%",width:"100%"}} onClick={this.onClick.bind(this,item)}>
                        <div className='row py-2'>
                            <div className='col-12'>
                                <i className={"fa-solid " + item.icon + " fa-2x"} style={{color:'#ecf0f1'}}></i>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-12'>
                                <h6 className='overflow-hidden d-flex align-items-center justify-content-center' style={{color:'#ecf0f1',height:'40px'}}>{item.text}</h6>
                            </div>
                        </div>
                    </NbButton>
                </div>
            )
        })

        return tmpMenuItem
    }
    render()
    {
        return (
            <NbPopUp id={"popMenu"} parent={this} title={""} fullscreen={true}>
                <div>
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
                            <div className='row' style={{paddingTop:"10px"}}>
                                <div className='col-12 pb-2'>
                                    <NbButton className="form-group btn btn-primary btn-purple-light btn-block" style={{height:"100%",width:"100%"}} 
                                    onClick=
                                    {
                                        ()=>
                                        {
                                            this.prevMenu.splice(this.prevMenu.length - 1,1)
                                            this.prev = true
                                            this.setState({menuData : this.prevMenu[this.prevMenu.length - 1]})
                                        }
                                    }>
                                        <div className='row'>
                                            <div className='col-2 py-2'>
                                                <i className={"fa-solid fa-arrow-left fa-2x"} style={{color:'#ecf0f1'}}></i>
                                            </div>
                                            <div className='col-10'>
                                                <h6 className='overflow-hidden d-flex align-items-center' style={{color:'#ecf0f1',height:'45px'}}>Geri</h6>
                                            </div>
                                        </div>
                                    </NbButton>
                                </div>
                            </div>
                            )
                        }
                    })()}
                    
                    <div className='row' style={{paddingTop:"10px"}}>
                        {this.menuBuild(this.state.menuData)}
                    </div>
                </div>
            </NbPopUp>
        )
    }
}