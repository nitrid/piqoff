import React from 'react';
import { itemsCls } from '../../core/cls/items.js';
import App from '../lib/app.js';

import Form, { Label,Item } from 'devextreme-react/form';
import { ButtonGroup } from 'devextreme-react/button-group';

import NdTextBox, { Validator, NumericRule, RequiredRule, CompareRule, EmailRule, PatternRule, StringLengthRule, RangeRule, AsyncRule } from '../../core/react/devex/textbox.js';
import NdGrid,{Column,Editing,Paging,Scrolling} from '../../core/react/devex/grid.js';
import NbButton from '../../core/react/bootstrap/button.js';
import NdPopUp from '../../core/react/devex/popup.js';
import NbNumberBoard from '../../core/react/bootstrap/numberboard.js';

export default class posDoc extends React.Component
{
    constructor()
    {
        super() 
        this.core = App.instance.core;
        this.lang = App.instance.lang;
        this.t = App.instance.lang.getFixedT(null,null,"this.props.data.id")
    }
    async componentDidMount()
    {
        console.log(this)
        // let tmpDb = 
        // {
        //     name : 'POS',
        //     tables :
        //     [
        //         {
        //             name : 'ITEMS',
        //             columns : 
        //             {
        //                 GUID : {dataType:"string"},
        //                 CDATE : {dataType:"date_time"},
        //                 CUSER : {dataType:"string"},
        //                 LDATE : {dataType:"date_time"},
        //                 LUSER : {dataType:"string"},
        //                 TYPE : {dataType:"string"},
        //                 SPECIAL : {dataType:"string"},
        //                 CODE : {dataType:"string"},
        //                 NAME : {dataType:"string"},
        //                 SNAME : {dataType:"string"},
        //                 VAT : {dataType:"number"},
        //                 COST_PRICE : {dataType:"number"},
        //                 MIN_PRICE : {dataType:"number"},
        //                 MAX_PRICE : {dataType:"number"},
        //                 STATUS : {dataType:"boolean"},
        //                 MAIN_GRP : {dataType:"string"},
        //                 MAIN_GRP_NAME : {dataType:"string"},
        //                 SUB_GRP : {dataType:"string"},
        //                 ORGINS : {dataType:"string"},
        //                 ORGINS_NAME : {dataType:"string"},
        //                 SECTOR : {dataType:"string"},
        //                 RAYON : {dataType:"string"},
        //                 SHELF : {dataType:"string"},
        //                 WEIGHING : {dataType:"boolean"},
        //                 SALE_JOIN_LINE : {dataType:"boolean"},
        //                 TICKET_REST: {dataType:"boolean"},
        //             } 
        //         }
        //     ]
        // }
        // await this.core.local.init(tmpDb);
        // console.log(111)
        // let tmpItems = new itemsCls
        // await tmpItems.load()
        // this.core.offline = true

        // Object.setPrototypeOf(tmpItems.dt('ITEMS')[0],{stat:'new'})
        
        // await tmpItems.save()
        // await tmpItems.load()
        // tmpItems.dt('ITEMS')[0].CODE = '1453'
        // await tmpItems.save()
        // await tmpItems.load()
        // tmpItems.dt('ITEMS').removeAt(0)
        // await tmpItems.save()
        // await tmpItems.load()
        // console.log(tmpItems.dt('ITEMS'))
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
                                    {/* Total */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btnTotal"} parent={this} className="form-group btn btn-info btn-block my-1" style={{height:'70px',width:'100%'}}
                                        onClick={()=>
                                        {                                                        
                                            this.popTotal.show();
                                        }}>
                                            <i className="text-white fa-solid fa-euro-sign" style={{fontSize: '24px'}} />
                                        </NbButton>
                                    </div>
                                    {/* Credit Card */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btn"} parent={this} className="form-group btn btn-info btn-block my-1" style={{height:'70px',width:'100%'}}
                                        onClick={()=>
                                        {                                                        
                                            this.popCardPay.show();
                                        }}>
                                            <i className="text-white fa-solid fa-credit-card" style={{fontSize: '24px'}} />
                                        </NbButton>
                                    </div>
                                    {/* 7 */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btnKey7"} parent={this} keyBtn={{textbox:"txtBarcode",key:"7"}} 
                                        className="form-group btn btn-primary btn-block my-1" style={{height:'70px',width:'100%'}}>
                                            <i className="text-white fa-solid fa-7" style={{fontSize: '24px'}} />
                                        </NbButton>
                                    </div>
                                    {/* 8 */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btnKey8"} parent={this} keyBtn={{textbox:"txtBarcode",key:"8"}} 
                                        className="form-group btn btn-primary btn-block my-1" style={{height:'70px',width:'100%'}}>
                                            <i className="text-white fa-solid fa-8" style={{fontSize: '24px'}} />
                                        </NbButton>
                                    </div>
                                    {/* 9 */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btnKey9"} parent={this} keyBtn={{textbox:"txtBarcode",key:"9"}} 
                                        className="form-group btn btn-primary btn-block my-1" style={{height:'70px',width:'100%'}}>
                                            <i className="text-white fa-solid fa-9" style={{fontSize: '24px'}} />
                                        </NbButton>
                                    </div>
                                    {/* Check */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btn"} parent={this} className="form-group btn btn-primary btn-block my-1" style={{height:'70px',width:'100%'}}>
                                            <i className="text-white fa-solid fa-check" style={{fontSize: '24px'}} />
                                        </NbButton>
                                    </div>
                                </div>  
                                {/* Line 2 */}
                                <div className='row px-2'>
                                    {/* Safe Open */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btn"} parent={this} className="form-group btn btn-info btn-block my-1" style={{height:'70px',width:'100%'}}
                                        onClick={()=>
                                        {                             
                                            this.popAccessPass.show();
                                        }}
                                        >
                                            <i className="text-white fa-solid fa-inbox" style={{fontSize: '24px'}} />
                                        </NbButton>
                                    </div>
                                    {/* Cash */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btn"} parent={this} className="form-group btn btn-info btn-block my-1" style={{height:'70px',width:'100%'}}>
                                            <i className="text-white fa-solid fa-money-bill-1" style={{fontSize: '24px'}} />
                                        </NbButton>
                                    </div>
                                    {/* 4 */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btnKey4"} parent={this} keyBtn={{textbox:"txtBarcode",key:"4"}} 
                                        className="form-group btn btn-primary btn-block my-1" style={{height:'70px',width:'100%'}}>
                                            <i className="text-white fa-solid fa-4" style={{fontSize: '24px'}} />
                                        </NbButton>
                                    </div>
                                    {/* 5 */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btnKey5"} parent={this} keyBtn={{textbox:"txtBarcode",key:"5"}} 
                                        className="form-group btn btn-primary btn-block my-1" style={{height:'70px',width:'100%'}}>
                                            <i className="text-white fa-solid fa-5" style={{fontSize: '24px'}} />
                                        </NbButton>
                                    </div>
                                    {/* 6 */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btnKey6"} parent={this} keyBtn={{textbox:"txtBarcode",key:"6"}} 
                                        className="form-group btn btn-primary btn-block my-1" style={{height:'70px',width:'100%'}}>
                                            <i className="text-white fa-solid fa-6" style={{fontSize: '24px'}} />
                                        </NbButton>
                                    </div>
                                    {/* Backspace */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btnKeyBs"} parent={this} keyBtn={{textbox:"txtBarcode",key:"Backspace"}} 
                                        className="form-group btn btn-primary btn-block my-1" style={{height:'70px',width:'100%'}}>
                                            <i className="text-white fa-solid fa-delete-left" style={{fontSize: '24px'}} />
                                        </NbButton>
                                    </div>
                                </div> 
                                {/* Line 3 */}
                                <div className='row px-2'>
                                    {/* Percent */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btn"} parent={this} className="form-group btn btn-info btn-block my-1" style={{height:'70px',width:'100%'}}
                                        onClick={()=>
                                        {                                                        
                                            this.popPrice.show();
                                        }}>
                                            <i className="text-white fa-solid fa-percent" style={{fontSize: '24px'}} />
                                        </NbButton>
                                    </div>
                                    {/* Ticket */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btn"} parent={this} className="form-group btn btn-info btn-block my-1" style={{height:'70px',width:'100%'}}>
                                            <i className="text-white fa-solid fa-ticket" style={{fontSize: '24px'}} />
                                        </NbButton>
                                    </div>
                                    {/* 1 */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btnKey1"} parent={this} keyBtn={{textbox:"txtBarcode",key:"1"}} 
                                        className="form-group btn btn-primary btn-block my-1" style={{height:'70px',width:'100%'}}>
                                            <i className="text-white fa-solid fa-1" style={{fontSize: '24px'}} />
                                        </NbButton>
                                    </div>
                                    {/* 2 */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btnKey2"} parent={this} keyBtn={{textbox:"txtBarcode",key:"2"}} 
                                        className="form-group btn btn-primary btn-block my-1" style={{height:'70px',width:'100%'}}>
                                            <i className="text-white fa-solid fa-2" style={{fontSize: '24px'}} />
                                        </NbButton>
                                    </div>
                                    {/* 3 */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btnKey3"} parent={this} keyBtn={{textbox:"txtBarcode",key:"3"}} 
                                        className="form-group btn btn-primary btn-block my-1" style={{height:'70px',width:'100%'}}>
                                            <i className="text-white fa-solid fa-3" style={{fontSize: '24px'}} />
                                        </NbButton>
                                    </div>
                                    {/* X */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btnKeyX"} parent={this} keyBtn={{textbox:"txtBarcode",key:"*"}} 
                                        className="form-group btn btn-primary btn-block my-1" style={{height:'70px',width:'100%'}}>
                                            <i className="text-white fa-solid fa-xmark" style={{fontSize: '24px'}} />
                                        </NbButton>
                                    </div>
                                </div> 
                                {/* Line 4 */}
                                <div className='row px-2'>
                                    {/* Calculator */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btn"} parent={this} className="form-group btn btn-info btn-block my-1" style={{height:'70px',width:'100%'}}>
                                            <i className="text-white fa-solid fa-calculator" style={{fontSize: '24px'}} />
                                        </NbButton>
                                    </div>
                                    {/* Info */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btn"} parent={this} className="form-group btn btn-info btn-block my-1" style={{height:'70px',width:'100%'}}>
                                            <i className="text-white fa-solid fa-circle-info" style={{fontSize: '24px'}} />
                                        </NbButton>
                                    </div>
                                    {/* . */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btnKeyDot"} parent={this} keyBtn={{textbox:"txtBarcode",key:"."}}
                                        className="form-group btn btn-primary btn-block my-1" style={{height:'70px',width:'100%',fontSize:'26pt'}}>.</NbButton>
                                    </div>
                                    {/* 0 */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btnKey0"} parent={this} keyBtn={{textbox:"txtBarcode",key:"0"}}
                                        className="form-group btn btn-primary btn-block my-1" style={{height:'70px',width:'100%'}}>
                                            <i className="text-white fa-solid fa-0" style={{fontSize: '24px'}} />
                                        </NbButton>
                                    </div>
                                    {/* -1 */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btn"} parent={this} className="form-group btn btn-primary btn-block my-1" style={{height:'70px',width:'100%',fontSize:'20pt'}}>-1</NbButton>
                                    </div>
                                    {/* +1 */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btn"} parent={this} className="form-group btn btn-primary btn-block my-1" style={{height:'70px',width:'100%',fontSize:'20pt'}}>+1</NbButton>
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
                                        <NbButton id={"btn"} parent={this} className="form-group btn btn-success btn-block my-1" style={{height:'70px',width:'100%'}}>
                                            <i className="text-white fa-solid fa-arrow-up" style={{fontSize: '24px'}} />
                                        </NbButton>
                                    </div>
                                    {/* Plu 1 */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btn"} parent={this} className="form-group btn btn-success btn-block my-1" style={{height:'70px',width:'100%',fontSize:'10pt'}}>FRUITS LEGUMES PC</NbButton>
                                    </div>
                                    {/* Plu 2 */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btn"} parent={this} className="form-group btn btn-success btn-block my-1" style={{height:'70px',width:'100%',fontSize:'10pt'}}>FRUITS LEGUMES KG</NbButton>
                                    </div>
                                    {/* Plu 3 */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btn"} parent={this} className="form-group btn btn-success btn-block my-1" style={{height:'70px',width:'100%',fontSize:'10pt'}}>EPICERIE</NbButton>
                                    </div>
                                    {/* Plu 4 */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btn"} parent={this} className="form-group btn btn-success btn-block my-1" style={{height:'70px',width:'100%',fontSize:'10pt'}}>PATISSERIE ORIENTALE</NbButton>
                                    </div>
                                    {/* Plu 5 */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btn"} parent={this} className="form-group btn btn-success btn-block my-1" style={{height:'70px',width:'100%',fontSize:'10pt'}}>SACHET CAISSE</NbButton>
                                    </div>
                                </div>  
                                {/* Line 2 */}
                                <div className='row px-2'>
                                    {/* Down */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btn"} parent={this} className="form-group btn btn-success btn-block my-1" style={{height:'70px',width:'100%'}}>
                                            <i className="text-white fa-solid fa-arrow-down" style={{fontSize: '24px'}} />
                                        </NbButton>
                                    </div>
                                    {/* Plu 6 */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btn"} parent={this} className="form-group btn btn-success btn-block my-1" style={{height:'70px',width:'100%',fontSize:'10pt'}}>PIDE X2</NbButton>
                                    </div>
                                    {/* Plu 7 */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btn"} parent={this} className="form-group btn btn-success btn-block my-1" style={{height:'70px',width:'100%',fontSize:'10pt'}}>Boucherie / Charcuterie</NbButton>
                                    </div>
                                    {/* Plu 8 */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btn"} parent={this} className="form-group btn btn-success btn-block my-1" style={{height:'70px',width:'100%',fontSize:'10pt'}}>NAPPE TRANSPARENTE</NbButton>
                                    </div>
                                    {/* Plu 9 */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btn"} parent={this} className="form-group btn btn-success btn-block my-1" style={{height:'70px',width:'100%',fontSize:'10pt'}}>PAIN KEBAB LOT X5</NbButton>
                                    </div>
                                    {/* Plu 10 */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btn"} parent={this} className="form-group btn btn-success btn-block my-1" style={{height:'70px',width:'100%',fontSize:'10pt'}}>OLIVES AU CHOIX KG</NbButton>
                                    </div>
                                </div>  
                                {/* Line 3 */}
                                <div className='row px-2'>
                                    {/* Delete */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btn"} parent={this} className="form-group btn btn-danger btn-block my-1" style={{height:'70px',width:'100%'}}>
                                            <i className="text-white fa-solid fa-eraser" style={{fontSize: '24px'}} />
                                        </NbButton>
                                    </div>
                                    {/* Category 1 */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btn"} parent={this} className="form-group btn btn-info btn-block my-1 text-white" style={{height:'70px',width:'100%',fontSize:'10pt'}}>1</NbButton>
                                    </div>
                                    {/* Category 2 */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btn"} parent={this} className="form-group btn btn-info btn-block my-1 text-white" style={{height:'70px',width:'100%',fontSize:'10pt'}}>PAIN</NbButton>
                                    </div>
                                    {/* Category 3 */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btn"} parent={this} className="form-group btn btn-info btn-block my-1 text-white" style={{height:'70px',width:'100%',fontSize:'10pt'}}>FRUIT</NbButton>
                                    </div>
                                    {/* Category 4 */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btn"} parent={this} className="form-group btn btn-info btn-block my-1 text-white" style={{height:'70px',width:'100%',fontSize:'10pt'}}>BONBON</NbButton>
                                    </div>
                                    {/* Category 5 */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btn"} parent={this} className="form-group btn btn-info btn-block my-1 text-white" style={{height:'70px',width:'100%',fontSize:'10pt'}}></NbButton>
                                    </div>
                                </div>    
                                {/* Line 4 */}
                                <div className='row px-2'>
                                    {/* Line Delete */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btn"} parent={this} className="form-group btn btn-danger btn-block my-1" style={{height:'70px',width:'100%'}}>
                                            <i className="text-white fa-solid fa-outdent" style={{fontSize: '24px'}} />
                                        </NbButton>
                                    </div>
                                    {/* Image Plu 1 */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btn"} parent={this} className="form-group btn btn-dark btn-block my-1" style={{height:'70px',width:'100%',fontSize:'10pt'}}>FRUIT ET LEGUMES</NbButton>
                                    </div>
                                    {/* Image Plu 2 */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btn"} parent={this} className="form-group btn btn-dark btn-block my-1" style={{height:'70px',width:'100%',fontSize:'10pt'}}>PAIN</NbButton>
                                    </div>
                                    {/* Image Plu 3 */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btn"} parent={this} className="form-group btn btn-dark btn-block my-1" style={{height:'70px',width:'100%',fontSize:'10pt'}}>BOISSON</NbButton>
                                    </div>
                                    {/* Image Plu 4 */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btn"} parent={this} className="form-group btn btn-dark btn-block my-1" style={{height:'70px',width:'100%',fontSize:'10pt'}}>HYGIENE</NbButton>
                                    </div>
                                    {/* Image Plu 5 */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btn"} parent={this} className="form-group btn btn-dark btn-block my-1" style={{height:'70px',width:'100%',fontSize:'10pt'}}></NbButton>
                                    </div>
                                </div>    
                                {/* Line 5 */}
                                <div className='row px-2'>
                                    {/* Item Return */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btn"} parent={this} className="form-group btn btn-danger btn-block my-1" style={{height:'70px',width:'100%'}}>
                                            <i className="text-white fa-solid fa-retweet" style={{fontSize: '24px'}} />
                                        </NbButton>
                                    </div>
                                    {/* Subtotal */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btn"} parent={this} className="form-group btn btn-info btn-block my-1" style={{height:'70px',width:'100%'}}>
                                            <i className="text-white fa-solid fa-plus-minus" style={{fontSize: '24px'}} />
                                        </NbButton>
                                    </div>
                                    {/* Blank */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btn"} parent={this} className="form-group btn btn-secondary btn-block my-1" style={{height:'70px',width:'100%',fontSize:'10pt'}}></NbButton>
                                    </div>
                                    {/* Blank */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btn"} parent={this} className="form-group btn btn-secondary btn-block my-1" style={{height:'70px',width:'100%',fontSize:'10pt'}}></NbButton>
                                    </div>
                                    {/* Blank */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btn"} parent={this} className="form-group btn btn-secondary btn-block my-1" style={{height:'70px',width:'100%',fontSize:'10pt'}}></NbButton>
                                    </div>
                                    {/* Blank */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btn"} parent={this} className="form-group btn btn-secondary btn-block my-1" style={{height:'70px',width:'100%',fontSize:'10pt'}}></NbButton>
                                    </div>
                                </div>
                                {/* Line 6 */}
                                <div className='row px-2'>
                                    {/* Park List */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btn"} parent={this} className="form-group btn btn-warning btn-block my-1" style={{height:'70px',width:'100%'}}>
                                            <i className="text-white fa-solid fa-arrow-up-right-from-square" style={{fontSize: '24px'}} />
                                        </NbButton>
                                    </div>
                                    {/* Advance */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btn"} parent={this} className="form-group btn btn-info btn-block my-1" style={{height:'70px',width:'100%'}}>
                                            <i className="text-white fa-solid fa-circle-dollar-to-slot" style={{fontSize: '24px'}} />
                                        </NbButton>
                                    </div>
                                    {/* Blank */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btn"} parent={this} className="form-group btn btn-secondary btn-block my-1" style={{height:'70px',width:'100%',fontSize:'10pt'}}></NbButton>
                                    </div>
                                    {/* Blank */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btn"} parent={this} className="form-group btn btn-secondary btn-block my-1" style={{height:'70px',width:'100%',fontSize:'10pt'}}></NbButton>
                                    </div>
                                    {/* Blank */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btn"} parent={this} className="form-group btn btn-secondary btn-block my-1" style={{height:'70px',width:'100%',fontSize:'10pt'}}></NbButton>
                                    </div>
                                    {/* Blank */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btn"} parent={this} className="form-group btn btn-secondary btn-block my-1" style={{height:'70px',width:'100%',fontSize:'10pt'}}></NbButton>
                                    </div>
                                </div>
                                {/* Line 7 */}
                                <div className='row px-2'>
                                    {/* Park */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btn"} parent={this} className="form-group btn btn-warning btn-block my-1" style={{height:'70px',width:'100%'}}>
                                            <i className="text-white fa-solid fa-arrow-right-to-bracket" style={{fontSize: '24px'}} />
                                        </NbButton>
                                    </div>
                                    {/* Customer Point */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btn"} parent={this} className="form-group btn btn-info btn-block my-1" style={{height:'70px',width:'100%'}}>
                                            <i className="text-white fa-solid fa-gift" style={{fontSize: '24px'}} />
                                        </NbButton>
                                    </div>
                                    {/* Blank */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btn"} parent={this} className="form-group btn btn-secondary btn-block my-1" style={{height:'70px',width:'100%',fontSize:'10pt'}}></NbButton>
                                    </div>
                                    {/* Blank */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btn"} parent={this} className="form-group btn btn-secondary btn-block my-1" style={{height:'70px',width:'100%',fontSize:'10pt'}}></NbButton>
                                    </div>
                                    {/* Blank */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btn"} parent={this} className="form-group btn btn-secondary btn-block my-1" style={{height:'70px',width:'100%',fontSize:'10pt'}}></NbButton>
                                    </div>
                                    {/* Blank */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btn"} parent={this} className="form-group btn btn-secondary btn-block my-1" style={{height:'70px',width:'100%',fontSize:'10pt'}}></NbButton>
                                    </div>
                                </div>
                                {/* Line 8 */}
                                <div className='row px-2'>
                                    {/* Get Customer */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btn"} parent={this} className="form-group btn btn-info btn-block my-1" style={{height:'70px',width:'100%'}}>
                                            <i className="text-white fa-solid fa-circle-user" style={{fontSize: '24px'}} />
                                        </NbButton>
                                    </div>
                                    {/* Customer List */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btn"} parent={this} className="form-group btn btn-info btn-block my-1" style={{height:'70px',width:'100%'}}>
                                            <i className="text-white fa-solid fa-users" style={{fontSize: '24px'}} />
                                        </NbButton>
                                    </div>
                                    {/* Print */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btn"} parent={this} className="form-group btn btn-info btn-block my-1" style={{height:'70px',width:'100%'}}>
                                            <i className="text-white fa-solid fa-print" style={{fontSize: '24px'}} />
                                        </NbButton>
                                    </div>
                                    {/* Blank */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btn"} parent={this} className="form-group btn btn-secondary btn-block my-1" style={{height:'70px',width:'100%',fontSize:'10pt'}}></NbButton>
                                    </div>
                                    {/* Blank */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btn"} parent={this} className="form-group btn btn-secondary btn-block my-1" style={{height:'70px',width:'100%',fontSize:'10pt'}}></NbButton>
                                    </div>
                                    {/* Blank */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btn"} parent={this} className="form-group btn btn-secondary btn-block my-1" style={{height:'70px',width:'100%',fontSize:'10pt'}}></NbButton>
                                    </div>
                                </div>       
                            </div>
                        </div>
                    </div>
                </div>
                {/* Total Popup */}
                <div>
                    <NdPopUp parent={this} id={"popTotal"} 
                    visible={false}                        
                    showCloseButton={true}
                    showTitle={true}
                    title={"Ara Toplam"}
                    container={"#root"} 
                    width={'600'}
                    height={'590'}
                    position={{of:'#root'}}
                    >
                        <div className='row'>
                            <div className='col-12'>
                                {/* Top Total Indicator */}
                                <div className='row'>
                                    <div className='col-4'>
                                        <p className='text-primary text-start m-0'>Toplam : <span className='text-dark'>12.94€</span></p>    
                                    </div>
                                    <div className='col-4'>
                                        <p className='text-primary text-start m-0'>Kalan : <span className='text-dark'>12.94€</span></p>    
                                    </div>
                                    <div className='col-4'>
                                        <p className='text-primary text-start m-0'>Para Üstü : <span className='text-dark'>12.94€</span></p>    
                                    </div>
                                </div>
                                <div className='row pt-2'>
                                    {/* Payment Type Selection */}
                                    <div className="col-2">
                                        
                                    </div>
                                    {/* Payment Grid */}
                                    <div className="col-7">
                                        <div className="row">
                                            <div className='col-12'>
                                                <NdGrid parent={this} id={"grdPay"} 
                                                showBorders={true} 
                                                columnsAutoWidth={true} 
                                                allowColumnReordering={true} 
                                                allowColumnResizing={true} 
                                                showRowLines={true}
                                                showColumnLines={true}
                                                showColumnHeaders={false}
                                                height={'138px'} 
                                                width={'100%'}
                                                dbApply={false}
                                                data={{source:[{TYPE_NAME:'ESC',AMOUNT:100.99}]}}
                                                onRowPrepared=
                                                {
                                                    (e)=>
                                                    {
                                                        e.rowElement.style.fontSize = '13px';
                                                        e.rowElement.style.backgroundColor = '#ecf0f1'
                                                    }
                                                }
                                                >
                                                    <Column dataField="TYPE_NAME" caption={"NO"} width={100} alignment={"center"}/>
                                                    <Column dataField="AMOUNT" caption={"TUTAR"} width={40}/>                                                
                                                </NdGrid>
                                            </div>
                                        </div>
                                        <div className='row pt-1'>
                                            <div className="col-12">
                                                <NdTextBox id="txtPopTotal" parent={this} simple={true} elementAttr={{style:'font-size:15pt;font-weight:bold;border:3px solid #428bca;'}}>     
                                                </NdTextBox> 
                                            </div>
                                        </div>                                        
                                    </div>
                                    {/* Cash Button Group */}
                                    <div className="col-3">
                                        {/* 1 € */}
                                        <div className="row pb-1">
                                            <div className="col-12">
                                                <NbButton id={"btnPopTotalCash1"} parent={this} className="btn btn-block" 
                                                style={{height:'60px',width:'100%',backgroundImage:'url(css/img/1€.png)',backgroundRepeat:'no-repeat',backgroundSize:'55% 100%',backgroundPosition: 'center',borderColor:'#6c757d'}}
                                                onClick={()=>
                                                {                                                        
                                                    
                                                }}/>
                                            </div>
                                        </div>
                                        {/* 2 € */}
                                        <div className="row py-1">
                                            <div className="col-12">
                                                <NbButton id={"btnPopTotalCash2"} parent={this} className="btn btn-block" 
                                                style={{height:'60px',width:'100%',backgroundImage:'url(css/img/2€.png)',backgroundRepeat:'no-repeat',backgroundSize:'55% 100%',backgroundPosition: 'center',borderColor:'#6c757d'}}
                                                onClick={()=>
                                                {                                                        
                                                    
                                                }}/>
                                            </div>
                                        </div>
                                        {/* 5 € */}
                                        <div className="row py-1">
                                            <div className="col-12">
                                                <NbButton id={"btnPopTotalCash5"} parent={this} className="btn btn-block" 
                                                style={{height:'60px',width:'100%',backgroundImage:'url(css/img/5€.jfif)',backgroundSize:'cover',borderColor:'#6c757d'}}
                                                onClick={()=>
                                                {                                                        
                                                    
                                                }}/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='row pt-1'>
                                    {/* Number Board */}
                                    <div className='col-6'>
                                        <NbNumberBoard id={'numPopTotal'} parent={this} textobj="txtPopTotal" span={1} buttonHeight={'60px'}/>
                                    </div>
                                    <div className='col-6'>
                                        <div className='row pb-1'>
                                            {/* T.R Detail */}
                                            <div className="col-6">
                                                <NbButton id={"btnPopTotalTRDetail"} parent={this} className="form-group btn btn-danger btn-block" style={{height:'60px',width:'100%'}}>
                                                    T.R Detay
                                                </NbButton>
                                            </div>
                                            {/* 10 € */}
                                            <div className="col-6">
                                                <NbButton id={"btnPopTotalCash10"} parent={this} className="btn btn-block" 
                                                style={{height:'60px',width:'100%',backgroundImage:'url(css/img/10€.jpg)',backgroundSize:'cover',borderColor:'#6c757d'}}
                                                onClick={()=>
                                                {                                                        
                                                    
                                                }}/>
                                            </div>
                                        </div>
                                        <div className='row py-1'>
                                            {/* Line Delete */}
                                            <div className="col-6">
                                                <NbButton id={"btnPopTotalLineDel"} parent={this} className="form-group btn btn-danger btn-block" style={{height:'60px',width:'100%'}}>
                                                    Satır İptal
                                                </NbButton>
                                            </div>
                                            {/* 20 € */}
                                            <div className="col-6">
                                                <NbButton id={"btnPopTotalCash20"} parent={this} className="btn btn-block" 
                                                style={{height:'60px',width:'100%',backgroundImage:'url(css/img/20€.jpg)',backgroundSize:'cover',borderColor:'#6c757d'}}
                                                onClick={()=>
                                                {                                                        
                                                    
                                                }}/>
                                            </div>
                                        </div>
                                        <div className='row py-1'>
                                            {/* Cancel */}
                                            <div className="col-6">
                                                <NbButton id={"btnPopTotalCancel"} parent={this} className="form-group btn btn-danger btn-block" style={{height:'60px',width:'100%'}}>
                                                    Vazgeç
                                                </NbButton>
                                            </div>
                                            {/* 50 € */}
                                            <div className="col-6">
                                                <NbButton id={"btnPopTotalCash50"} parent={this} className="btn btn-block" 
                                                style={{height:'60px',width:'100%',backgroundImage:'url(css/img/50€.jpg)',backgroundSize:'cover',borderColor:'#6c757d'}}
                                                onClick={()=>
                                                {                                                        
                                                    
                                                }}/>
                                            </div>
                                        </div>
                                        <div className='row py-1'>
                                            {/* Okey */}
                                            <div className="col-6">
                                                <NbButton id={"btnPopTotalOkey"} parent={this} className="form-group btn btn-success btn-block" style={{height:'60px',width:'100%'}}>
                                                    <i className="text-white fa-solid fa-check" style={{fontSize: '24px'}} />
                                                </NbButton>
                                            </div>
                                            {/* 100 € */}
                                            <div className="col-6">
                                                <NbButton id={"btnPopTotalCash100"} parent={this} className="btn btn-block" 
                                                style={{height:'60px',width:'100%',backgroundImage:'url(css/img/100€.jpg)',backgroundSize:'cover',borderColor:'#6c757d'}}
                                                onClick={()=>
                                                {                                                        
                                                    
                                                }}/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </NdPopUp>
                </div>
                {/* Card Pay Popup */}
                <div>
                    <NdPopUp parent={this} id={"popCardPay"} 
                    visible={false}                        
                    showCloseButton={true}
                    showTitle={true}
                    title={"Kart Ödeme"}
                    container={"#root"} 
                    width={'300'}
                    height={'500'}
                    position={{of:'#root'}}
                    >
                        <div className='row'>
                            <div className='col-12'>
                               {/* Top Total Indicator */}
                               <div className='row'>
                                    <div className='col-6'>
                                        <p className='text-primary text-start m-0'>Toplam : <span className='text-dark'>12.94€</span></p>    
                                    </div>
                                    <div className='col-6'>
                                        <p className='text-primary text-start m-0'>Kalan : <span className='text-dark'>12.94€</span></p>    
                                    </div>
                                </div> 
                            </div>
                        </div>
                        <div className='row pt-1'>
                            <div className="col-12">
                                <NdTextBox id="txtPopCardPay" parent={this} simple={true} elementAttr={{style:'font-size:15pt;font-weight:bold;border:3px solid #428bca;'}}>     
                                </NdTextBox> 
                            </div>
                        </div> 
                        <div className='row pt-2'>
                            {/* Number Board */}
                            <div className='col-12'>
                                <NbNumberBoard id={'numPopCardPay'} parent={this} textobj="txtPopCardPay" span={1} buttonHeight={'60px'}/>
                            </div>
                        </div>
                        <div className='row pt-2'>
                            <div className="col-12">
                                <NbButton id={"btnPopCardPaySend"} parent={this} className="form-group btn btn-danger btn-block" style={{height:'60px',width:'100%'}}>
                                    Gönder
                                </NbButton>
                            </div>
                        </div>
                    </NdPopUp>
                </div>
                {/* Access Pass Popup */}
                <div>
                    <NdPopUp parent={this} id={"popAccessPass"} 
                    visible={false}                        
                    showCloseButton={true}
                    showTitle={true}
                    title={"Yetkili Şifresi Giriniz"}
                    container={"#root"} 
                    width={'300'}
                    height={'500'}
                    position={{of:'#root'}}
                    >
                        <div className='row pt-1'>
                            <div className="col-12">
                                <NdTextBox id="txtPopAccessPass" parent={this} simple={true}>     
                                </NdTextBox> 
                            </div>
                        </div> 
                        <div className='row pt-2'>
                            {/* Number Board */}
                            <div className='col-12'>
                                <NbNumberBoard id={'numPopAccessPass'} parent={this} textobj="txtPopAccessPass" span={1} buttonHeight={'60px'}/>
                            </div>
                        </div>
                        <div className='row pt-2'>
                            <div className="col-12">
                                <NbButton id={"btnPopAccessPass"} parent={this} className="form-group btn btn-success btn-block" style={{height:'60px',width:'100%'}}>
                                    <i className="text-white fa-solid fa-check" style={{fontSize: '24px'}} />
                                </NbButton>
                            </div>
                        </div>
                    </NdPopUp>
                </div>
                {/* Quantity Popup */}
                <div>
                    <NdPopUp parent={this} id={"popQuantity"} 
                    visible={false}                        
                    showCloseButton={true}
                    showTitle={true}
                    title={"Miktar"}
                    container={"#root"} 
                    width={'300'}
                    height={'500'}
                    position={{of:'#root'}}
                    >
                        <div className='row pt-1'>
                            <div className="col-12">
                                <NdTextBox id="txtPopQuantity" parent={this} simple={true}>     
                                </NdTextBox> 
                            </div>
                        </div> 
                        <div className='row pt-2'>
                            {/* Number Board */}
                            <div className='col-12'>
                                <NbNumberBoard id={'numPopQuantity'} parent={this} textobj="txtPopQuantity" span={1} buttonHeight={'60px'}/>
                            </div>
                        </div>
                        <div className='row pt-2'>
                            <div className="col-12">
                                <NbButton id={"btnPopQuantity"} parent={this} className="form-group btn btn-success btn-block" style={{height:'60px',width:'100%'}}>
                                    <i className="text-white fa-solid fa-check" style={{fontSize: '24px'}} />
                                </NbButton>
                            </div>
                        </div>
                    </NdPopUp>
                </div>
                {/* Price Popup */}
                <div>
                    <NdPopUp parent={this} id={"popPrice"} 
                    visible={false}                        
                    showCloseButton={true}
                    showTitle={true}
                    title={"Fiyat"}
                    container={"#root"} 
                    width={'300'}
                    height={'500'}
                    position={{of:'#root'}}
                    >
                        <div className='row pt-1'>
                            <div className="col-12">
                                <NdTextBox id="txtPopPrice" parent={this} simple={true}>     
                                </NdTextBox> 
                            </div>
                        </div> 
                        <div className='row pt-2'>
                            {/* Number Board */}
                            <div className='col-12'>
                                <NbNumberBoard id={'numPopPrice'} parent={this} textobj="txtPopPrice" span={1} buttonHeight={'60px'}/>
                            </div>
                        </div>
                        <div className='row pt-2'>
                            <div className="col-12">
                                <NbButton id={"btnPopPrice"} parent={this} className="form-group btn btn-success btn-block" style={{height:'60px',width:'100%'}}>
                                    <i className="text-white fa-solid fa-check" style={{fontSize: '24px'}} />
                                </NbButton>
                            </div>
                        </div>
                    </NdPopUp>
                </div>
            </div>
        )
    }
}