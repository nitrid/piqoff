import React from 'react';
import { itemsCls } from '../../core/cls/items.js';
import App from '../lib/app.js';

import Form, { Label,Item } from 'devextreme-react/form';

import NdTextBox, { Validator, NumericRule, RequiredRule, CompareRule, EmailRule, PatternRule, StringLengthRule, RangeRule, AsyncRule } from '../../core/react/devex/textbox.js';
import NdGrid,{Column,Editing,Paging,Scrolling} from '../../core/react/devex/grid.js';
import NdButton from '../../core/react/devex/button.js';

export default class Pos extends React.Component
{
    constructor()
    {
        super() 
        this.core = App.instance.core;
    }
    async componentDidMount()
    {
        let tmpDb = 
        {
            name : 'POS',
            tables :
            [
                {
                    name : 'ITEMS',
                    columns : 
                    {
                        GUID : {dataType:"string"},
                        CDATE : {dataType:"date_time"},
                        CUSER : {dataType:"string"},
                        LDATE : {dataType:"date_time"},
                        LUSER : {dataType:"string"},
                        TYPE : {dataType:"string"},
                        SPECIAL : {dataType:"string"},
                        CODE : {dataType:"string"},
                        NAME : {dataType:"string"},
                        SNAME : {dataType:"string"},
                        VAT : {dataType:"number"},
                        COST_PRICE : {dataType:"number"},
                        MIN_PRICE : {dataType:"number"},
                        MAX_PRICE : {dataType:"number"},
                        STATUS : {dataType:"boolean"},
                        MAIN_GRP : {dataType:"string"},
                        MAIN_GRP_NAME : {dataType:"string"},
                        SUB_GRP : {dataType:"string"},
                        ORGINS : {dataType:"string"},
                        ORGINS_NAME : {dataType:"string"},
                        SECTOR : {dataType:"string"},
                        RAYON : {dataType:"string"},
                        SHELF : {dataType:"string"},
                        WEIGHING : {dataType:"boolean"},
                        SALE_JOIN_LINE : {dataType:"boolean"},
                        TICKET_REST: {dataType:"boolean"},
                    } 
                }
            ]
        }
        await this.core.local.init(tmpDb);
        console.log(111)
        let tmpItems = new itemsCls
        await tmpItems.load()
        this.core.offline = true

        Object.setPrototypeOf(tmpItems.dt('ITEMS')[0],{stat:'new'})
        
        await tmpItems.save()
        await tmpItems.load()
        tmpItems.dt('ITEMS')[0].CODE = '1453'
        await tmpItems.save()
        await tmpItems.load()
        tmpItems.dt('ITEMS').removeAt(0)
        await tmpItems.save()
        await tmpItems.load()
        console.log(tmpItems.dt('ITEMS'))
    }
    render()
    {
        return(
            <div>                
                <div className='top-bar row'>
                    <div className='row m-2'>
                        <div className='col-1'>
                            <img src='./css/img/logo2.png' width='50px' height='50px'/>
                        </div>
                        <div className='col-1'>
                            <div className='row' style={{height:'25px'}}>
                                <div className='col-12'>
                                    <i className="text-white fa-solid fa-user p-2"></i>
                                    <span className='text-white'>TEST1</span>
                                </div>    
                            </div>
                            <div className='row' style={{height:'25px'}}>
                                <div className='col-12'>
                                    <i className="text-light fa-solid fa-tv p-2"></i>
                                    <span className='text-light'>004</span>
                                </div> 
                            </div>
                        </div>
                        <div className='col-2'>
                            <div className='row' style={{height:'25px'}}>
                                <div className='col-12'>                                
                                    <i className="text-white fa-solid fa-circle-user p-2"></i>
                                    <span className='text-white'>ALI KEMAL KARACA</span>
                                </div>    
                            </div>
                            <div className='row' style={{height:'25px'}}>
                                <div className='col-12'>
                                    <i className="text-light fa-solid fa-user-plus p-2"></i>
                                    <span className='text-light'>0</span>
                                </div> 
                            </div>
                        </div>
                        <div className='col-2'>
                            <div className='row' style={{height:'25px'}}>
                                <div className='col-12'>
                                    <i className="text-white fa-solid fa-calendar p-2"></i>
                                    <span className='text-white'>03.03.2022</span>
                                </div>    
                            </div>
                            <div className='row' style={{height:'25px'}}>
                                <div className='col-12'>
                                    <i className="text-light fa-solid fa-clock p-2"></i>
                                    <span className='text-light'>12:12:04</span>
                                </div> 
                            </div>
                        </div>
                    </div>       
                </div>
                <div className='row p-2'>
                    {/* Left Column */}
                    <div className='col-6'>
                        {/* txtBarcode */}
                        <div className='row'>
                            <div className='col-12'>
                                <NdTextBox id="txtBarcode" parent={this} simple={true} 
                                button=
                                {
                                    [
                                        {
                                            id:'01',
                                            icon:'more',
                                            onClick:()=>
                                            {
                                                this.pg_txtRef.show()
                                                this.pg_txtRef.onClick = (data) =>
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
                                            icon:'arrowdown',
                                            onClick:()=>
                                            {
                                                this.txtRef.value = Math.floor(Date.now() / 1000)
                                            }
                                        }
                                    ]
                                }
                                onChange={(async()=>
                                {
                                    let tmpResult = await this.checkItem(this.txtRef.value)
                                    if(tmpResult == 3)
                                    {
                                        this.txtRef.value = "";
                                    }
                                }).bind(this)} 
                                >     
                                </NdTextBox>  
                            </div>                            
                        </div>
                        {/* grdList */}
                        <div className='row'>
                            <div className='12'>
                                <NdGrid parent={this} id={"grdList"} 
                                showBorders={true} 
                                columnsAutoWidth={true} 
                                allowColumnReordering={true} 
                                allowColumnResizing={true} 
                                height={'156px'} 
                                width={'100%'}
                                dbApply={false}
                                data={{source:[{TYPE_NAME:0},{TYPE_NAME:1},{TYPE_NAME:2},{TYPE_NAME:3},{TYPE_NAME:4},{TYPE_NAME:5},{TYPE_NAME:6},{TYPE_NAME:7},{TYPE_NAME:8},{TYPE_NAME:9}]}}
                                onRowPrepared=
                                {
                                    (e)=>
                                    {
                                        if(e.rowType == "header")
                                        {
                                            e.rowElement.style.fontWeight = 'bold';    
                                        }
                                        e.rowElement.style.fontSize = '13px';
                                    }
                                }
                                onCellPrepared=
                                {
                                    (e)=>
                                    {
                                        e.cellElement.style.padding = '4px'
                                    }
                                }
                                >
                                    <Column dataField="TYPE_NAME" caption={"NO"} width={40} alignment={"center"}/>
                                    <Column dataField="DEPOT" caption={"ADI"} width={350} />
                                    <Column dataField="CUSTOMER_NAME" caption={"MIKTAR"} width={100}/>
                                    <Column dataField="QUANTITY" caption={"FIYAT"} width={100}/>
                                    <Column dataField="VAT_EXT" caption={"TUTAR"} width={100}/>                                                
                                </NdGrid>
                            </div>
                        </div>
                        {/* Grand Total */}
                        <div className='row'>
                            <div className='col-6'>
                                <div className='row'>
                                    <div className='col-3'>
                                        <p className='text-primary text-start m-0'>T.Satır : <span className='text-dark'>0</span></p>    
                                    </div>
                                    <div className='col-6'>
                                        <p className='text-primary text-start m-0'>T.Ürün Mik.: <span className='text-dark'>0</span></p>    
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col-12'>
                                        <p className='text-primary text-start m-0'>Sadakat İndirim : <span className='text-dark'>0.00 €</span></p>    
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col-12'>
                                        <p className='text-primary text-start m-0'>Ticket Rest.: <span className='text-dark'>0.00 €</span></p>    
                                    </div>
                                </div>
                            </div>
                            <div className='col-6'>
                                <div className='row'>
                                    <div className='col-12'>
                                        <p className='text-primary text-end m-0'>Ara Toplam : <span className='text-dark'>0.00 €</span></p>    
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col-12'>
                                        <p className='text-primary text-end m-0'>Kdv : <span className='text-dark'>0.00 €</span></p>    
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col-12'>
                                        <p className='text-primary text-end m-0'>İndirim : <span className='text-dark'>0.00 €</span></p>    
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-12'>
                                <p className="fs-2 fw-bold text-center m-0">0.00 €</p>
                            </div>
                        </div>
                        {/* Button Console */}
                        <div className='row'>
                            <div className='col-12'>
                                {/* Line 1 */}
                                <div className='row px-2'>
                                    {/* Payment */}
                                    <div className="col-2 px-1">
                                        <button className="form-group btn btn-info btn-block my-1" style={{height:'70px',width:'100%'}}>
                                            <i className="text-white fa-solid fa-euro-sign" style={{fontSize: '24px'}} />
                                        </button>
                                    </div>
                                    {/* Credit Card */}
                                    <div className="col-2 px-1">
                                        <button className="form-group btn btn-info btn-block my-1" style={{height:'70px',width:'100%'}}>
                                            <i className="text-white fa-solid fa-credit-card" style={{fontSize: '24px'}} />
                                        </button>
                                    </div>
                                    {/* 7 */}
                                    <div className="col-2 px-1">
                                        <button className="form-group btn btn-primary btn-block my-1" style={{height:'70px',width:'100%'}}>
                                            <i className="text-white fa-solid fa-7" style={{fontSize: '24px'}} />
                                        </button>
                                    </div>
                                    {/* 8 */}
                                    <div className="col-2 px-1">
                                        <button className="form-group btn btn-primary btn-block my-1" style={{height:'70px',width:'100%'}}>
                                            <i className="text-white fa-solid fa-8" style={{fontSize: '24px'}} />
                                        </button>
                                    </div>
                                    {/* 9 */}
                                    <div className="col-2 px-1">
                                        <button className="form-group btn btn-primary btn-block my-1" style={{height:'70px',width:'100%'}}>
                                            <i className="text-white fa-solid fa-9" style={{fontSize: '24px'}} />
                                        </button>
                                    </div>
                                    {/* Check */}
                                    <div className="col-2 px-1">
                                        <button className="form-group btn btn-primary btn-block my-1" style={{height:'70px',width:'100%'}}>
                                            <i className="text-white fa-solid fa-check" style={{fontSize: '24px'}} />
                                        </button>
                                    </div>
                                </div>  
                                {/* Line 2 */}
                                <div className='row px-2'>
                                    {/* Safe Open */}
                                    <div className="col-2 px-1">
                                        <button className="form-group btn btn-info btn-block my-1" style={{height:'70px',width:'100%'}}>
                                            <i className="text-white fa-solid fa-inbox" style={{fontSize: '24px'}} />
                                        </button>
                                    </div>
                                    {/* Cash */}
                                    <div className="col-2 px-1">
                                        <button className="form-group btn btn-info btn-block my-1" style={{height:'70px',width:'100%'}}>
                                            <i className="text-white fa-solid fa-money-bill-1" style={{fontSize: '24px'}} />
                                        </button>
                                    </div>
                                    {/* 4 */}
                                    <div className="col-2 px-1">
                                        <button className="form-group btn btn-primary btn-block my-1" style={{height:'70px',width:'100%'}}>
                                            <i className="text-white fa-solid fa-4" style={{fontSize: '24px'}} />
                                        </button>
                                    </div>
                                    {/* 5 */}
                                    <div className="col-2 px-1">
                                        <button className="form-group btn btn-primary btn-block my-1" style={{height:'70px',width:'100%'}}>
                                            <i className="text-white fa-solid fa-5" style={{fontSize: '24px'}} />
                                        </button>
                                    </div>
                                    {/* 6 */}
                                    <div className="col-2 px-1">
                                        <button className="form-group btn btn-primary btn-block my-1" style={{height:'70px',width:'100%'}}>
                                            <i className="text-white fa-solid fa-6" style={{fontSize: '24px'}} />
                                        </button>
                                    </div>
                                    {/* Backspace */}
                                    <div className="col-2 px-1">
                                        <button className="form-group btn btn-primary btn-block my-1" style={{height:'70px',width:'100%'}}>
                                            <i className="text-white fa-solid fa-delete-left" style={{fontSize: '24px'}} />
                                        </button>
                                    </div>
                                </div> 
                                {/* Line 3 */}
                                <div className='row px-2'>
                                    {/* Percent */}
                                    <div className="col-2 px-1">
                                        <button className="form-group btn btn-info btn-block my-1" style={{height:'70px',width:'100%'}}>
                                            <i className="text-white fa-solid fa-percent" style={{fontSize: '24px'}} />
                                        </button>
                                    </div>
                                    {/* Ticket */}
                                    <div className="col-2 px-1">
                                        <button className="form-group btn btn-info btn-block my-1" style={{height:'70px',width:'100%'}}>
                                            <i className="text-white fa-solid fa-ticket" style={{fontSize: '24px'}} />
                                        </button>
                                    </div>
                                    {/* 1 */}
                                    <div className="col-2 px-1">
                                        <button className="form-group btn btn-primary btn-block my-1" style={{height:'70px',width:'100%'}}>
                                            <i className="text-white fa-solid fa-1" style={{fontSize: '24px'}} />
                                        </button>
                                    </div>
                                    {/* 2 */}
                                    <div className="col-2 px-1">
                                        <button className="form-group btn btn-primary btn-block my-1" style={{height:'70px',width:'100%'}}>
                                            <i className="text-white fa-solid fa-2" style={{fontSize: '24px'}} />
                                        </button>
                                    </div>
                                    {/* 3 */}
                                    <div className="col-2 px-1">
                                        <button className="form-group btn btn-primary btn-block my-1" style={{height:'70px',width:'100%'}}>
                                            <i className="text-white fa-solid fa-3" style={{fontSize: '24px'}} />
                                        </button>
                                    </div>
                                    {/* X */}
                                    <div className="col-2 px-1">
                                        <button className="form-group btn btn-primary btn-block my-1" style={{height:'70px',width:'100%'}}>
                                            <i className="text-white fa-solid fa-xmark" style={{fontSize: '24px'}} />
                                        </button>
                                    </div>
                                </div> 
                                {/* Line 4 */}
                                <div className='row px-2'>
                                    {/* Calculator */}
                                    <div className="col-2 px-1">
                                        <button className="form-group btn btn-info btn-block my-1" style={{height:'70px',width:'100%'}}>
                                            <i className="text-white fa-solid fa-calculator" style={{fontSize: '24px'}} />
                                        </button>
                                    </div>
                                    {/* Info */}
                                    <div className="col-2 px-1">
                                        <button className="form-group btn btn-info btn-block my-1" style={{height:'70px',width:'100%'}}>
                                            <i className="text-white fa-solid fa-circle-info" style={{fontSize: '24px'}} />
                                        </button>
                                    </div>
                                    {/* . */}
                                    <div className="col-2 px-1">
                                        <button className="form-group btn btn-primary btn-block my-1" style={{height:'70px',width:'100%',fontSize:'26pt'}}>.</button>
                                    </div>
                                    {/* 0 */}
                                    <div className="col-2 px-1">
                                        <button className="form-group btn btn-primary btn-block my-1" style={{height:'70px',width:'100%'}}>
                                            <i className="text-white fa-solid fa-0" style={{fontSize: '24px'}} />
                                        </button>
                                    </div>
                                    {/* -1 */}
                                    <div className="col-2 px-1">
                                        <button className="form-group btn btn-primary btn-block my-1" style={{height:'70px',width:'100%',fontSize:'20pt'}}>-1</button>
                                    </div>
                                    {/* +1 */}
                                    <div className="col-2 px-1">
                                        <button className="form-group btn btn-primary btn-block my-1" style={{height:'70px',width:'100%',fontSize:'20pt'}}>+1</button>
                                    </div>
                                </div> 
                            </div>
                        </div>
                    </div>
                    {/* Right Column */}
                    <div className='col-6'>
                        {/* Button Console */}
                        <div className='row'>
                            <div className='col-12'>
                                {/* Line 1 */}
                                <div className='row px-2'>
                                    {/* Up */}
                                    <div className="col-2 px-1">
                                        <button className="form-group btn btn-success btn-block my-1" style={{height:'70px',width:'100%'}}>
                                            <i className="text-white fa-solid fa-arrow-up" style={{fontSize: '24px'}} />
                                        </button>
                                    </div>
                                    {/* Plu 1 */}
                                    <div className="col-2 px-1">
                                        <button className="form-group btn btn-success btn-block my-1" style={{height:'70px',width:'100%',fontSize:'10pt'}}>FRUITS LEGUMES PC</button>
                                    </div>
                                    {/* Plu 2 */}
                                    <div className="col-2 px-1">
                                        <button className="form-group btn btn-success btn-block my-1" style={{height:'70px',width:'100%',fontSize:'10pt'}}>FRUITS LEGUMES KG</button>
                                    </div>
                                    {/* Plu 3 */}
                                    <div className="col-2 px-1">
                                        <button className="form-group btn btn-success btn-block my-1" style={{height:'70px',width:'100%',fontSize:'10pt'}}>EPICERIE</button>
                                    </div>
                                    {/* Plu 4 */}
                                    <div className="col-2 px-1">
                                        <button className="form-group btn btn-success btn-block my-1" style={{height:'70px',width:'100%',fontSize:'10pt'}}>PATISSERIE ORIENTALE</button>
                                    </div>
                                    {/* Plu 5 */}
                                    <div className="col-2 px-1">
                                        <button className="form-group btn btn-success btn-block my-1" style={{height:'70px',width:'100%',fontSize:'10pt'}}>SACHET CAISSE</button>
                                    </div>
                                </div>  
                                {/* Line 2 */}
                                <div className='row px-2'>
                                    {/* Down */}
                                    <div className="col-2 px-1">
                                        <button className="form-group btn btn-success btn-block my-1" style={{height:'70px',width:'100%'}}>
                                            <i className="text-white fa-solid fa-arrow-down" style={{fontSize: '24px'}} />
                                        </button>
                                    </div>
                                    {/* Plu 6 */}
                                    <div className="col-2 px-1">
                                        <button className="form-group btn btn-success btn-block my-1" style={{height:'70px',width:'100%',fontSize:'10pt'}}>PIDE X2</button>
                                    </div>
                                    {/* Plu 7 */}
                                    <div className="col-2 px-1">
                                        <button className="form-group btn btn-success btn-block my-1" style={{height:'70px',width:'100%',fontSize:'10pt'}}>Boucherie / Charcuterie</button>
                                    </div>
                                    {/* Plu 8 */}
                                    <div className="col-2 px-1">
                                        <button className="form-group btn btn-success btn-block my-1" style={{height:'70px',width:'100%',fontSize:'10pt'}}>NAPPE TRANSPARENTE</button>
                                    </div>
                                    {/* Plu 9 */}
                                    <div className="col-2 px-1">
                                        <button className="form-group btn btn-success btn-block my-1" style={{height:'70px',width:'100%',fontSize:'10pt'}}>PAIN KEBAB LOT X5</button>
                                    </div>
                                    {/* Plu 10 */}
                                    <div className="col-2 px-1">
                                        <button className="form-group btn btn-success btn-block my-1" style={{height:'70px',width:'100%',fontSize:'10pt'}}>OLIVES AU CHOIX KG</button>
                                    </div>
                                </div>  
                                {/* Line 3 */}
                                <div className='row px-2'>
                                    {/* Delete */}
                                    <div className="col-2 px-1">
                                        <button className="form-group btn btn-danger btn-block my-1" style={{height:'70px',width:'100%'}}>
                                            <i className="text-white fa-solid fa-eraser" style={{fontSize: '24px'}} />
                                        </button>
                                    </div>
                                    {/* Category 1 */}
                                    <div className="col-2 px-1">
                                        <button className="form-group btn btn-info btn-block my-1 text-white" style={{height:'70px',width:'100%',fontSize:'10pt'}}>1</button>
                                    </div>
                                    {/* Category 2 */}
                                    <div className="col-2 px-1">
                                        <button className="form-group btn btn-info btn-block my-1 text-white" style={{height:'70px',width:'100%',fontSize:'10pt'}}>PAIN</button>
                                    </div>
                                    {/* Category 3 */}
                                    <div className="col-2 px-1">
                                        <button className="form-group btn btn-info btn-block my-1 text-white" style={{height:'70px',width:'100%',fontSize:'10pt'}}>FRUIT</button>
                                    </div>
                                    {/* Category 4 */}
                                    <div className="col-2 px-1">
                                        <button className="form-group btn btn-info btn-block my-1 text-white" style={{height:'70px',width:'100%',fontSize:'10pt'}}>BONBON</button>
                                    </div>
                                    {/* Category 5 */}
                                    <div className="col-2 px-1">
                                        <button className="form-group btn btn-info btn-block my-1 text-white" style={{height:'70px',width:'100%',fontSize:'10pt'}}></button>
                                    </div>
                                </div>    
                                {/* Line 4 */}
                                <div className='row px-2'>
                                    {/* Line Delete */}
                                    <div className="col-2 px-1">
                                        <button className="form-group btn btn-danger btn-block my-1" style={{height:'70px',width:'100%'}}>
                                            <i className="text-white fa-solid fa-outdent" style={{fontSize: '24px'}} />
                                        </button>
                                    </div>
                                    {/* Image Plu 1 */}
                                    <div className="col-2 px-1">
                                        <button className="form-group btn btn-dark btn-block my-1" style={{height:'70px',width:'100%',fontSize:'10pt'}}>FRUIT ET LEGUMES</button>
                                    </div>
                                    {/* Image Plu 2 */}
                                    <div className="col-2 px-1">
                                        <button className="form-group btn btn-dark btn-block my-1" style={{height:'70px',width:'100%',fontSize:'10pt'}}>PAIN</button>
                                    </div>
                                    {/* Image Plu 3 */}
                                    <div className="col-2 px-1">
                                        <button className="form-group btn btn-dark btn-block my-1" style={{height:'70px',width:'100%',fontSize:'10pt'}}>BOISSON</button>
                                    </div>
                                    {/* Image Plu 4 */}
                                    <div className="col-2 px-1">
                                        <button className="form-group btn btn-dark btn-block my-1" style={{height:'70px',width:'100%',fontSize:'10pt'}}>HYGIENE</button>
                                    </div>
                                    {/* Image Plu 5 */}
                                    <div className="col-2 px-1">
                                        <button className="form-group btn btn-dark btn-block my-1" style={{height:'70px',width:'100%',fontSize:'10pt'}}></button>
                                    </div>
                                </div>    
                                {/* Line 5 */}
                                <div className='row px-2'>
                                    {/* Item Return */}
                                    <div className="col-2 px-1">
                                        <button className="form-group btn btn-danger btn-block my-1" style={{height:'70px',width:'100%'}}>
                                            <i className="text-white fa-solid fa-retweet" style={{fontSize: '24px'}} />
                                        </button>
                                    </div>
                                    {/* Subtotal */}
                                    <div className="col-2 px-1">
                                        <button className="form-group btn btn-info btn-block my-1" style={{height:'70px',width:'100%'}}>
                                            <i className="text-white fa-solid fa-plus-minus" style={{fontSize: '24px'}} />
                                        </button>
                                    </div>
                                    {/* Blank */}
                                    <div className="col-2 px-1">
                                        <button className="form-group btn btn-secondary btn-block my-1" style={{height:'70px',width:'100%',fontSize:'10pt'}}></button>
                                    </div>
                                    {/* Blank */}
                                    <div className="col-2 px-1">
                                        <button className="form-group btn btn-secondary btn-block my-1" style={{height:'70px',width:'100%',fontSize:'10pt'}}></button>
                                    </div>
                                    {/* Blank */}
                                    <div className="col-2 px-1">
                                        <button className="form-group btn btn-secondary btn-block my-1" style={{height:'70px',width:'100%',fontSize:'10pt'}}></button>
                                    </div>
                                    {/* Blank */}
                                    <div className="col-2 px-1">
                                        <button className="form-group btn btn-secondary btn-block my-1" style={{height:'70px',width:'100%',fontSize:'10pt'}}></button>
                                    </div>
                                </div>
                                {/* Line 6 */}
                                <div className='row px-2'>
                                    {/* Park List */}
                                    <div className="col-2 px-1">
                                        <button className="form-group btn btn-warning btn-block my-1" style={{height:'70px',width:'100%'}}>
                                            <i className="text-white fa-solid fa-arrow-up-right-from-square" style={{fontSize: '24px'}} />
                                        </button>
                                    </div>
                                    {/* Advance */}
                                    <div className="col-2 px-1">
                                        <button className="form-group btn btn-info btn-block my-1" style={{height:'70px',width:'100%'}}>
                                            <i className="text-white fa-solid fa-circle-dollar-to-slot" style={{fontSize: '24px'}} />
                                        </button>
                                    </div>
                                    {/* Blank */}
                                    <div className="col-2 px-1">
                                        <button className="form-group btn btn-secondary btn-block my-1" style={{height:'70px',width:'100%',fontSize:'10pt'}}></button>
                                    </div>
                                    {/* Blank */}
                                    <div className="col-2 px-1">
                                        <button className="form-group btn btn-secondary btn-block my-1" style={{height:'70px',width:'100%',fontSize:'10pt'}}></button>
                                    </div>
                                    {/* Blank */}
                                    <div className="col-2 px-1">
                                        <button className="form-group btn btn-secondary btn-block my-1" style={{height:'70px',width:'100%',fontSize:'10pt'}}></button>
                                    </div>
                                    {/* Blank */}
                                    <div className="col-2 px-1">
                                        <button className="form-group btn btn-secondary btn-block my-1" style={{height:'70px',width:'100%',fontSize:'10pt'}}></button>
                                    </div>
                                </div>
                                {/* Line 7 */}
                                <div className='row px-2'>
                                    {/* Park */}
                                    <div className="col-2 px-1">
                                        <button className="form-group btn btn-warning btn-block my-1" style={{height:'70px',width:'100%'}}>
                                            <i className="text-white fa-solid fa-arrow-right-to-bracket" style={{fontSize: '24px'}} />
                                        </button>
                                    </div>
                                    {/* Customer Point */}
                                    <div className="col-2 px-1">
                                        <button className="form-group btn btn-info btn-block my-1" style={{height:'70px',width:'100%'}}>
                                            <i className="text-white fa-solid fa-gift" style={{fontSize: '24px'}} />
                                        </button>
                                    </div>
                                    {/* Blank */}
                                    <div className="col-2 px-1">
                                        <button className="form-group btn btn-secondary btn-block my-1" style={{height:'70px',width:'100%',fontSize:'10pt'}}></button>
                                    </div>
                                    {/* Blank */}
                                    <div className="col-2 px-1">
                                        <button className="form-group btn btn-secondary btn-block my-1" style={{height:'70px',width:'100%',fontSize:'10pt'}}></button>
                                    </div>
                                    {/* Blank */}
                                    <div className="col-2 px-1">
                                        <button className="form-group btn btn-secondary btn-block my-1" style={{height:'70px',width:'100%',fontSize:'10pt'}}></button>
                                    </div>
                                    {/* Blank */}
                                    <div className="col-2 px-1">
                                        <button className="form-group btn btn-secondary btn-block my-1" style={{height:'70px',width:'100%',fontSize:'10pt'}}></button>
                                    </div>
                                </div>
                                {/* Line 8 */}
                                <div className='row px-2'>
                                    {/* Get Customer */}
                                    <div className="col-2 px-1">
                                        <button className="form-group btn btn-info btn-block my-1" style={{height:'70px',width:'100%'}}>
                                            <i className="text-white fa-solid fa-circle-user" style={{fontSize: '24px'}} />
                                        </button>
                                    </div>
                                    {/* Customer List */}
                                    <div className="col-2 px-1">
                                        <button className="form-group btn btn-info btn-block my-1" style={{height:'70px',width:'100%'}}>
                                            <i className="text-white fa-solid fa-users" style={{fontSize: '24px'}} />
                                        </button>
                                    </div>
                                    {/* Print */}
                                    <div className="col-2 px-1">
                                        <button className="form-group btn btn-info btn-block my-1" style={{height:'70px',width:'100%'}}>
                                            <i className="text-white fa-solid fa-print" style={{fontSize: '24px'}} />
                                        </button>
                                    </div>
                                    {/* Blank */}
                                    <div className="col-2 px-1">
                                        <button className="form-group btn btn-secondary btn-block my-1" style={{height:'70px',width:'100%',fontSize:'10pt'}}></button>
                                    </div>
                                    {/* Blank */}
                                    <div className="col-2 px-1">
                                        <button className="form-group btn btn-secondary btn-block my-1" style={{height:'70px',width:'100%',fontSize:'10pt'}}></button>
                                    </div>
                                    {/* Blank */}
                                    <div className="col-2 px-1">
                                        <button className="form-group btn btn-secondary btn-block my-1" style={{height:'70px',width:'100%',fontSize:'10pt'}}></button>
                                    </div>
                                </div>       
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}