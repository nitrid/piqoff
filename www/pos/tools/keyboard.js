import React from 'react';
import NbBase from '../../core/react/bootstrap/base.js';
import NbButton from '../../core/react/bootstrap/button.js';

export default class NbKeyboard extends NbBase
{
    constructor(props)
    {
        super(props);
        this.state =
        {
            span: typeof this.props.span == 'undefined' ? '0' : this.props.span,
            buttonHeight : typeof this.props.buttonHeight == 'undefined' ? '60px' : this.props.buttonHeight
        }
        if(typeof this.props.textobj != 'undefined')
        {
            this[this.props.textobj] = this.props.parent[this.props.textobj]
        }
    }
    render()
    {
        return(
            <div>
                <div className='row'>
                    <div className={'col-1 pb-' + this.state.span + ' pe-' + this.state.span}>
                        <NbButton id={"btn" + this.props.id + "01"} parent={this} keyBtn={{textbox:this.props.textobj,key:"1"}} 
                        className="form-group btn btn-primary btn-block" style={{height:this.state.buttonHeight,width:'100%',fontSize:'16px'}}>1</NbButton> 
                    </div>
                    <div className={'col-1 pb-' + this.state.span + ' px-' + this.state.span}>
                        <NbButton id={"btn" + this.props.id + "02"} parent={this} keyBtn={{textbox:this.props.textobj,key:"2"}} 
                        className="form-group btn btn-primary btn-block" style={{height:this.state.buttonHeight,width:'100%',fontSize:'16px'}}>2</NbButton> 
                    </div>
                    <div className={'col-1 pb-' + this.state.span + ' px-' + this.state.span}>
                        <NbButton id={"btn" + this.props.id + "03"} parent={this} keyBtn={{textbox:this.props.textobj,key:"3"}} 
                        className="form-group btn btn-primary btn-block" style={{height:this.state.buttonHeight,width:'100%',fontSize:'16px'}}>3</NbButton> 
                    </div>
                    <div className={'col-1 pb-' + this.state.span + ' px-' + this.state.span}>
                        <NbButton id={"btn" + this.props.id + "04"} parent={this} keyBtn={{textbox:this.props.textobj,key:"4"}} 
                        className="form-group btn btn-primary btn-block" style={{height:this.state.buttonHeight,width:'100%',fontSize:'16px'}}>4</NbButton> 
                    </div>
                    <div className={'col-1 pb-' + this.state.span + ' px-' + this.state.span}>
                        <NbButton id={"btn" + this.props.id + "05"} parent={this} keyBtn={{textbox:this.props.textobj,key:"5"}} 
                        className="form-group btn btn-primary btn-block" style={{height:this.state.buttonHeight,width:'100%',fontSize:'16px'}}>5</NbButton> 
                    </div>
                    <div className={'col-1 pb-' + this.state.span + ' px-' + this.state.span}>
                        <NbButton id={"btn" + this.props.id + "06"} parent={this} keyBtn={{textbox:this.props.textobj,key:"6"}} 
                        className="form-group btn btn-primary btn-block" style={{height:this.state.buttonHeight,width:'100%',fontSize:'16px'}}>6</NbButton> 
                    </div>
                    <div className={'col-1 pb-' + this.state.span + ' px-' + this.state.span}>
                        <NbButton id={"btn" + this.props.id + "07"} parent={this} keyBtn={{textbox:this.props.textobj,key:"7"}} 
                        className="form-group btn btn-primary btn-block" style={{height:this.state.buttonHeight,width:'100%',fontSize:'16px'}}>7</NbButton> 
                    </div>
                    <div className={'col-1 pb-' + this.state.span + ' px-' + this.state.span}>
                        <NbButton id={"btn" + this.props.id + "08"} parent={this} keyBtn={{textbox:this.props.textobj,key:"8"}} 
                        className="form-group btn btn-primary btn-block" style={{height:this.state.buttonHeight,width:'100%',fontSize:'16px'}}>8</NbButton> 
                    </div>
                    <div className={'col-1 pb-' + this.state.span + ' px-' + this.state.span}>
                        <NbButton id={"btn" + this.props.id + "09"} parent={this} keyBtn={{textbox:this.props.textobj,key:"9"}} 
                        className="form-group btn btn-primary btn-block" style={{height:this.state.buttonHeight,width:'100%',fontSize:'16px'}}>9</NbButton> 
                    </div>
                    <div className={'col-1 pb-' + this.state.span + ' px-' + this.state.span}>
                        <NbButton id={"btn" + this.props.id + "10"} parent={this} keyBtn={{textbox:this.props.textobj,key:"0"}} 
                        className="form-group btn btn-primary btn-block" style={{height:this.state.buttonHeight,width:'100%',fontSize:'16px'}}>0</NbButton> 
                    </div>
                    <div className={'col-2 pb-' + this.state.span + ' ps-' + this.state.span}>
                        <NbButton id={"btn" + this.props.id + "11"} parent={this} keyBtn={{textbox:this.props.textobj,key:"Backspace"}} 
                        className="form-group btn btn-primary btn-block" style={{height:this.state.buttonHeight,width:'100%'}}>
                            <i className="text-white fa-solid fa-delete-left" style={{fontSize: '16px'}} />
                        </NbButton> 
                    </div>
                </div>
                <div className='row'>
                    <div className={'col-1 py-' + this.state.span + ' pe-' + this.state.span}>
                        <NbButton id={"btn" + this.props.id + "12"} parent={this} keyBtn={{textbox:this.props.textobj,key:"Q"}} 
                        className="form-group btn btn-primary btn-block" style={{height:this.state.buttonHeight,width:'100%',fontSize:'16px'}}>Q</NbButton> 
                    </div>
                    <div className={'col-1 py-' + this.state.span + ' px-' + this.state.span}>
                        <NbButton id={"btn" + this.props.id + "13"} parent={this} keyBtn={{textbox:this.props.textobj,key:"W"}} 
                        className="form-group btn btn-primary btn-block" style={{height:this.state.buttonHeight,width:'100%',fontSize:'16px'}}>W</NbButton> 
                    </div>
                    <div className={'col-1 py-' + this.state.span + ' px-' + this.state.span}>
                        <NbButton id={"btn" + this.props.id + "14"} parent={this} keyBtn={{textbox:this.props.textobj,key:"E"}} 
                        className="form-group btn btn-primary btn-block" style={{height:this.state.buttonHeight,width:'100%',fontSize:'16px'}}>E</NbButton> 
                    </div>
                    <div className={'col-1 py-' + this.state.span + ' px-' + this.state.span}>
                        <NbButton id={"btn" + this.props.id + "15"} parent={this} keyBtn={{textbox:this.props.textobj,key:"R"}} 
                        className="form-group btn btn-primary btn-block" style={{height:this.state.buttonHeight,width:'100%',fontSize:'16px'}}>R</NbButton> 
                    </div>
                    <div className={'col-1 py-' + this.state.span + ' px-' + this.state.span}>
                        <NbButton id={"btn" + this.props.id + "16"} parent={this} keyBtn={{textbox:this.props.textobj,key:"T"}} 
                        className="form-group btn btn-primary btn-block" style={{height:this.state.buttonHeight,width:'100%',fontSize:'16px'}}>T</NbButton> 
                    </div>
                    <div className={'col-1 py-' + this.state.span + ' px-' + this.state.span}>
                        <NbButton id={"btn" + this.props.id + "17"} parent={this} keyBtn={{textbox:this.props.textobj,key:"Y"}} 
                        className="form-group btn btn-primary btn-block" style={{height:this.state.buttonHeight,width:'100%',fontSize:'16px'}}>Y</NbButton> 
                    </div>
                    <div className={'col-1 py-' + this.state.span + ' px-' + this.state.span}>
                        <NbButton id={"btn" + this.props.id + "18"} parent={this} keyBtn={{textbox:this.props.textobj,key:"U"}} 
                        className="form-group btn btn-primary btn-block" style={{height:this.state.buttonHeight,width:'100%',fontSize:'16px'}}>U</NbButton> 
                    </div>
                    <div className={'col-1 py-' + this.state.span + ' px-' + this.state.span}>
                        <NbButton id={"btn" + this.props.id + "19"} parent={this} keyBtn={{textbox:this.props.textobj,key:"I"}} 
                        className="form-group btn btn-primary btn-block" style={{height:this.state.buttonHeight,width:'100%',fontSize:'16px'}}>I</NbButton> 
                    </div>
                    <div className={'col-1 py-' + this.state.span + ' px-' + this.state.span}>
                        <NbButton id={"btn" + this.props.id + "20"} parent={this} keyBtn={{textbox:this.props.textobj,key:"O"}} 
                        className="form-group btn btn-primary btn-block" style={{height:this.state.buttonHeight,width:'100%',fontSize:'16px'}}>O</NbButton> 
                    </div>
                    <div className={'col-1 py-' + this.state.span + ' px-' + this.state.span}>
                        <NbButton id={"btn" + this.props.id + "21"} parent={this} keyBtn={{textbox:this.props.textobj,key:"P"}} 
                        className="form-group btn btn-primary btn-block" style={{height:this.state.buttonHeight,width:'100%',fontSize:'16px'}}>P</NbButton> 
                    </div>
                    <div className={'col-1 py-' + this.state.span + ' px-' + this.state.span}>
                        <NbButton id={"btn" + this.props.id + "22"} parent={this} keyBtn={{textbox:this.props.textobj,key:"Ğ"}} 
                        className="form-group btn btn-primary btn-block" style={{height:this.state.buttonHeight,width:'100%',fontSize:'16px'}}>Ğ</NbButton> 
                    </div>
                    <div className={'col-1 py-' + this.state.span + ' ps-' + this.state.span}>
                    <NbButton id={"btn" + this.props.id + "23"} parent={this} keyBtn={{textbox:this.props.textobj,key:"Ü"}} 
                        className="form-group btn btn-primary btn-block" style={{height:this.state.buttonHeight,width:'100%',fontSize:'16px'}}>Ü</NbButton> 
                    </div>
                </div>
                <div className='row'>
                    <div className={'col-1 py-' + this.state.span + ' pe-' + this.state.span}>
                        <NbButton id={"btn" + this.props.id + "24"} parent={this} keyBtn={{textbox:this.props.textobj,key:"A"}} 
                        className="form-group btn btn-primary btn-block" style={{height:this.state.buttonHeight,width:'100%',fontSize:'16px'}}>A</NbButton> 
                    </div>
                    <div className={'col-1 py-' + this.state.span + ' px-' + this.state.span}>
                        <NbButton id={"btn" + this.props.id + "25"} parent={this} keyBtn={{textbox:this.props.textobj,key:"S"}} 
                        className="form-group btn btn-primary btn-block" style={{height:this.state.buttonHeight,width:'100%',fontSize:'16px'}}>S</NbButton> 
                    </div>
                    <div className={'col-1 py-' + this.state.span + ' px-' + this.state.span}>
                        <NbButton id={"btn" + this.props.id + "26"} parent={this} keyBtn={{textbox:this.props.textobj,key:"D"}} 
                        className="form-group btn btn-primary btn-block" style={{height:this.state.buttonHeight,width:'100%',fontSize:'16px'}}>D</NbButton> 
                    </div>
                    <div className={'col-1 py-' + this.state.span + ' px-' + this.state.span}>
                        <NbButton id={"btn" + this.props.id + "27"} parent={this} keyBtn={{textbox:this.props.textobj,key:"F"}} 
                        className="form-group btn btn-primary btn-block" style={{height:this.state.buttonHeight,width:'100%',fontSize:'16px'}}>F</NbButton> 
                    </div>
                    <div className={'col-1 py-' + this.state.span + ' px-' + this.state.span}>
                        <NbButton id={"btn" + this.props.id + "28"} parent={this} keyBtn={{textbox:this.props.textobj,key:"G"}} 
                        className="form-group btn btn-primary btn-block" style={{height:this.state.buttonHeight,width:'100%',fontSize:'16px'}}>G</NbButton> 
                    </div>
                    <div className={'col-1 py-' + this.state.span + ' px-' + this.state.span}>
                        <NbButton id={"btn" + this.props.id + "29"} parent={this} keyBtn={{textbox:this.props.textobj,key:"H"}} 
                        className="form-group btn btn-primary btn-block" style={{height:this.state.buttonHeight,width:'100%',fontSize:'16px'}}>H</NbButton> 
                    </div>
                    <div className={'col-1 py-' + this.state.span + ' px-' + this.state.span}>
                        <NbButton id={"btn" + this.props.id + "30"} parent={this} keyBtn={{textbox:this.props.textobj,key:"J"}} 
                        className="form-group btn btn-primary btn-block" style={{height:this.state.buttonHeight,width:'100%',fontSize:'16px'}}>J</NbButton> 
                    </div>
                    <div className={'col-1 py-' + this.state.span + ' px-' + this.state.span}>
                        <NbButton id={"btn" + this.props.id + "31"} parent={this} keyBtn={{textbox:this.props.textobj,key:"K"}} 
                        className="form-group btn btn-primary btn-block" style={{height:this.state.buttonHeight,width:'100%',fontSize:'16px'}}>K</NbButton> 
                    </div>
                    <div className={'col-1 py-' + this.state.span + ' px-' + this.state.span}>
                        <NbButton id={"btn" + this.props.id + "32"} parent={this} keyBtn={{textbox:this.props.textobj,key:"L"}} 
                        className="form-group btn btn-primary btn-block" style={{height:this.state.buttonHeight,width:'100%',fontSize:'16px'}}>L</NbButton> 
                    </div>
                    <div className={'col-1 py-' + this.state.span + ' px-' + this.state.span}>
                        <NbButton id={"btn" + this.props.id + "33"} parent={this} keyBtn={{textbox:this.props.textobj,key:"Ş"}} 
                        className="form-group btn btn-primary btn-block" style={{height:this.state.buttonHeight,width:'100%',fontSize:'16px'}}>Ş</NbButton> 
                    </div>
                    <div className={'col-1 py-' + this.state.span + ' px-' + this.state.span}>
                        <NbButton id={"btn" + this.props.id + "34"} parent={this} keyBtn={{textbox:this.props.textobj,key:"İ"}} 
                        className="form-group btn btn-primary btn-block" style={{height:this.state.buttonHeight,width:'100%',fontSize:'16px'}}>İ</NbButton> 
                    </div>
                    <div className={'col-1 py-' + this.state.span + ' ps-' + this.state.span}>
                    <NbButton id={"btn" + this.props.id + "35"} parent={this} keyBtn={{textbox:this.props.textobj,key:","}} 
                        className="form-group btn btn-primary btn-block" style={{height:this.state.buttonHeight,width:'100%',fontSize:'16px'}}>,</NbButton> 
                    </div>
                </div>
                <div className='row'>
                    <div className={'col-1 py-' + this.state.span + ' pe-' + this.state.span}>
                        <NbButton id={"btn" + this.props.id + "36"} parent={this} keyBtn={{textbox:this.props.textobj,key:"Z"}} 
                        className="form-group btn btn-primary btn-block" style={{height:this.state.buttonHeight,width:'100%',fontSize:'16px'}}>Z</NbButton> 
                    </div>
                    <div className={'col-1 py-' + this.state.span + ' px-' + this.state.span}>
                        <NbButton id={"btn" + this.props.id + "37"} parent={this} keyBtn={{textbox:this.props.textobj,key:"X"}} 
                        className="form-group btn btn-primary btn-block" style={{height:this.state.buttonHeight,width:'100%',fontSize:'16px'}}>X</NbButton> 
                    </div>
                    <div className={'col-1 py-' + this.state.span + ' px-' + this.state.span}>
                        <NbButton id={"btn" + this.props.id + "38"} parent={this} keyBtn={{textbox:this.props.textobj,key:"C"}} 
                        className="form-group btn btn-primary btn-block" style={{height:this.state.buttonHeight,width:'100%',fontSize:'16px'}}>C</NbButton> 
                    </div>
                    <div className={'col-1 py-' + this.state.span + ' px-' + this.state.span}>
                        <NbButton id={"btn" + this.props.id + "39"} parent={this} keyBtn={{textbox:this.props.textobj,key:"V"}} 
                        className="form-group btn btn-primary btn-block" style={{height:this.state.buttonHeight,width:'100%',fontSize:'16px'}}>V</NbButton> 
                    </div>
                    <div className={'col-1 py-' + this.state.span + ' px-' + this.state.span}>
                        <NbButton id={"btn" + this.props.id + "40"} parent={this} keyBtn={{textbox:this.props.textobj,key:"B"}} 
                        className="form-group btn btn-primary btn-block" style={{height:this.state.buttonHeight,width:'100%',fontSize:'16px'}}>B</NbButton> 
                    </div>
                    <div className={'col-1 py-' + this.state.span + ' px-' + this.state.span}>
                        <NbButton id={"btn" + this.props.id + "41"} parent={this} keyBtn={{textbox:this.props.textobj,key:"N"}} 
                        className="form-group btn btn-primary btn-block" style={{height:this.state.buttonHeight,width:'100%',fontSize:'16px'}}>N</NbButton> 
                    </div>
                    <div className={'col-1 py-' + this.state.span + ' px-' + this.state.span}>
                        <NbButton id={"btn" + this.props.id + "42"} parent={this} keyBtn={{textbox:this.props.textobj,key:"M"}} 
                        className="form-group btn btn-primary btn-block" style={{height:this.state.buttonHeight,width:'100%',fontSize:'16px'}}>M</NbButton> 
                    </div>
                    <div className={'col-1 py-' + this.state.span + ' px-' + this.state.span}>
                        <NbButton id={"btn" + this.props.id + "43"} parent={this} keyBtn={{textbox:this.props.textobj,key:"Ö"}} 
                        className="form-group btn btn-primary btn-block" style={{height:this.state.buttonHeight,width:'100%',fontSize:'16px'}}>Ö</NbButton> 
                    </div>
                    <div className={'col-1 py-' + this.state.span + ' px-' + this.state.span}>
                        <NbButton id={"btn" + this.props.id + "44"} parent={this} keyBtn={{textbox:this.props.textobj,key:"Ç"}} 
                        className="form-group btn btn-primary btn-block" style={{height:this.state.buttonHeight,width:'100%',fontSize:'16px'}}>Ç</NbButton> 
                    </div>
                    <div className={'col-1 py-' + this.state.span + ' px-' + this.state.span}>
                        <NbButton id={"btn" + this.props.id + "45"} parent={this} keyBtn={{textbox:this.props.textobj,key:"."}} 
                        className="form-group btn btn-primary btn-block" style={{height:this.state.buttonHeight,width:'100%',fontSize:'16px'}}>.</NbButton> 
                    </div>
                    <div className={'col-1 py-' + this.state.span + ' px-' + this.state.span}>
                        <NbButton id={"btn" + this.props.id + "46"} parent={this} keyBtn={{textbox:this.props.textobj,key:"-"}} 
                        className="form-group btn btn-primary btn-block" style={{height:this.state.buttonHeight,width:'100%',fontSize:'16px'}}>-</NbButton> 
                    </div>
                    <div className={'col-1 py-' + this.state.span + ' ps-' + this.state.span}>
                        <NbButton id={"btn" + this.props.id + "47"} parent={this} keyBtn={{textbox:this.props.textobj,key:"%"}} 
                        className="form-group btn btn-primary btn-block" style={{height:this.state.buttonHeight,width:'100%',fontSize:'16px'}}>%</NbButton> 
                    </div>
                </div>
                <div className='row'>
                    <div className={'col-1 pt-' + this.state.span + ' pe-' + this.state.span}>
                        
                    </div>
                    <div className={'col-1 pt-' + this.state.span + ' px-' + this.state.span}>
                        
                    </div>
                    <div className={'col-1 pt-' + this.state.span + ' px-' + this.state.span}>
                        
                    </div>
                    <div className={'col-1 pt-' + this.state.span + ' px-' + this.state.span}>
                        
                    </div>
                    <div className={'col-1 pt-' + this.state.span + ' px-' + this.state.span}>
                        
                    </div>
                    <div className={'col-2 pt-' + this.state.span + ' px-' + this.state.span}>
                        <NbButton id={"btn" + this.props.id + "53"} parent={this} keyBtn={{textbox:this.props.textobj,key:" "}} 
                        className="form-group btn btn-primary btn-block" style={{height:this.state.buttonHeight,width:'100%',fontSize:'16px'}}>Space</NbButton> 
                    </div>
                    <div className={'col-1 pt-' + this.state.span + ' px-' + this.state.span}>
                        
                    </div>
                    <div className={'col-1 pt-' + this.state.span + ' px-' + this.state.span}>
                        
                    </div>
                    <div className={'col-1 pt-' + this.state.span + ' px-' + this.state.span}>
                        
                    </div>
                    <div className={'col-1 pt-' + this.state.span + ' px-' + this.state.span}>
                        
                    </div>
                    <div className={'col-1 pt-' + this.state.span + ' ps-' + this.state.span}>
                        
                    </div>
                </div>
            </div>
        )
    }
}