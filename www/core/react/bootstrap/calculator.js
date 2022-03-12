import React from 'react';
import NbBase from './base.js';
import NbButton from './button.js';
import NdPopUp from '../devex/popup.js';
import NdTextBox from '../devex/textbox.js';
import NdGrid,{Column,Editing,Paging,Scrolling} from '../devex/grid.js';

export default class NbCalculator extends NbBase
{
    constructor(props)
    {
        super(props);
    }
    show()
    {
        this["pop" + this.props.id].show()
    }
    render()
    {
        return(
            <div>
                <NdPopUp parent={this} id={"pop" + this.props.id} 
                visible={false}                        
                showCloseButton={true}
                showTitle={true}
                title={"Hesap Makinesi"}
                container={"#root"} 
                width={'600'}
                height={'545'}
                position={{of:'#root'}}
                >
                    {/* txtCalc */}
                    <div className='row py-1'>
                        <div className="col-12">
                            <NdTextBox id={"txtPop" + this.props.id} parent={this} simple={true}>     
                            </NdTextBox> 
                        </div>
                    </div>
                    {/* Line 1 */}
                    <div className='row pt-1'>
                        {/* 7 */}
                        <div className="col-3 pb-1 pe-1">
                            <NbButton id={"btn" + this.props.id + "01"} parent={this} keyBtn={{textbox:"txtPop" + this.props.id,key:"7"}} 
                            className="form-group btn btn-primary btn-block" style={{height:'60px',width:'100%'}}>
                                <i className="text-white fa-solid fa-7" style={{fontSize: '24px'}} />
                            </NbButton>
                        </div>
                        {/* 8 */}
                        <div className="col-3 pb-1 px-1">
                            <NbButton id={"btn" + this.props.id + "02"} parent={this} keyBtn={{textbox:"txtPop" + this.props.id,key:"8"}} 
                            className="form-group btn btn-primary btn-block" style={{height:'60px',width:'100%'}}>
                                <i className="text-white fa-solid fa-8" style={{fontSize: '24px'}} />
                            </NbButton>
                        </div>
                        {/* 9 */}
                        <div className="col-3 pb-1 px-1">
                            <NbButton id={"btn" + this.props.id + "03"} parent={this} keyBtn={{textbox:"txtPop" + this.props.id,key:"9"}} 
                            className="form-group btn btn-primary btn-block" style={{height:'60px',width:'100%'}}>
                                <i className="text-white fa-solid fa-9" style={{fontSize: '24px'}} />
                            </NbButton>
                        </div>
                        {/* + */}
                        <div className="col-3 pb-1 ps-1">
                            <NbButton id={"btn" + this.props.id + "04"} parent={this} keyBtn={{textbox:"txtPop" + this.props.id,key:"+"}} 
                            className="form-group btn btn-primary btn-block" style={{height:'60px',width:'100%'}}>
                                <i className="text-white fa-solid fa-plus" style={{fontSize: '24px'}} />
                            </NbButton>
                        </div>
                    </div>
                    {/* Line 2 */}
                    <div className='row'>
                        {/* 4 */}
                        <div className="col-3 py-1 pe-1">
                            <NbButton id={"btn" + this.props.id + "05"} parent={this} keyBtn={{textbox:"txtPop" + this.props.id,key:"4"}} 
                            className="form-group btn btn-primary btn-block" style={{height:'60px',width:'100%'}}>
                                <i className="text-white fa-solid fa-4" style={{fontSize: '24px'}} />
                            </NbButton>
                        </div>
                        {/* 5 */}
                        <div className="col-3 py-1 px-1">
                            <NbButton id={"btn" + this.props.id + "06"} parent={this} keyBtn={{textbox:"txtPop" + this.props.id,key:"5"}} 
                            className="form-group btn btn-primary btn-block" style={{height:'60px',width:'100%'}}>
                                <i className="text-white fa-solid fa-5" style={{fontSize: '24px'}} />
                            </NbButton>
                        </div>
                        {/* 6 */}
                        <div className="col-3 py-1 px-1">
                            <NbButton id={"btn" + this.props.id + "07"} parent={this} keyBtn={{textbox:"txtPop" + this.props.id,key:"6"}} 
                            className="form-group btn btn-primary btn-block" style={{height:'60px',width:'100%'}}>
                                <i className="text-white fa-solid fa-6" style={{fontSize: '24px'}} />
                            </NbButton>
                        </div>
                        {/* - */}
                        <div className="col-3 py-1 ps-1">
                            <NbButton id={"btn" + this.props.id + "08"} parent={this} keyBtn={{textbox:"txtPop" + this.props.id,key:"-"}} 
                            className="form-group btn btn-primary btn-block" style={{height:'60px',width:'100%'}}>
                                <i className="text-white fa-solid fa-minus" style={{fontSize: '24px'}} />
                            </NbButton>
                        </div>
                    </div>
                    {/* Line 3 */}
                    <div className='row'>
                        {/* 1 */}
                        <div className="col-3 py-1 pe-1">
                            <NbButton id={"btn" + this.props.id + "09"} parent={this} keyBtn={{textbox:"txtPop" + this.props.id,key:"1"}} 
                            className="form-group btn btn-primary btn-block" style={{height:'60px',width:'100%'}}>
                                <i className="text-white fa-solid fa-1" style={{fontSize: '24px'}} />
                            </NbButton>
                        </div>
                        {/* 2 */}
                        <div className="col-3 py-1 px-1">
                            <NbButton id={"btn" + this.props.id + "10"} parent={this} keyBtn={{textbox:"txtPop" + this.props.id,key:"2"}} 
                            className="form-group btn btn-primary btn-block" style={{height:'60px',width:'100%'}}>
                                <i className="text-white fa-solid fa-2" style={{fontSize: '24px'}} />
                            </NbButton>
                        </div>
                        {/* 3 */}
                        <div className="col-3 py-1 px-1">
                            <NbButton id={"btn" + this.props.id + "11"} parent={this} keyBtn={{textbox:"txtPop" + this.props.id,key:"3"}} 
                            className="form-group btn btn-primary btn-block" style={{height:'60px',width:'100%'}}>
                                <i className="text-white fa-solid fa-3" style={{fontSize: '24px'}} />
                            </NbButton>
                        </div>
                        {/* * */}
                        <div className="col-3 py-1 ps-1">
                            <NbButton id={"btn" + this.props.id + "12"} parent={this} keyBtn={{textbox:"txtPop" + this.props.id,key:"*"}} 
                            className="form-group btn btn-primary btn-block" style={{height:'60px',width:'100%'}}>
                                <i className="text-white fa-solid fa-asterisk" style={{fontSize: '24px'}} />
                            </NbButton>
                        </div>
                    </div>
                    {/* Line 4 */}
                    <div className='row'>
                        {/* C */}
                        <div className="col-3 py-1 pe-1">
                            <NbButton id={"btn" + this.props.id + "13"} parent={this} 
                            className="form-group btn btn-primary btn-block" style={{height:'60px',width:'100%'}}>
                                <i className="text-white fa-solid fa-c" style={{fontSize: '24px'}} />
                            </NbButton>
                        </div>
                        {/* 0 */}
                        <div className="col-3 py-1 px-1">
                            <NbButton id={"btn" + this.props.id + "14"} parent={this} keyBtn={{textbox:"txtPop" + this.props.id,key:"0"}} 
                            className="form-group btn btn-primary btn-block" style={{height:'60px',width:'100%'}}>
                                <i className="text-white fa-solid fa-0" style={{fontSize: '24px'}} />
                            </NbButton>
                        </div>
                        {/* . */}
                        <div className="col-3 py-1 px-1">
                            <NbButton id={"btn" + this.props.id + "15"} parent={this} keyBtn={{textbox:"txtPop" + this.props.id,key:"."}} 
                            className="form-group btn btn-primary btn-block" style={{height:'60px',width:'100%',fontSize:'26pt'}}>
                            .
                            </NbButton>
                        </div>
                        {/* / */}
                        <div className="col-3 py-1 ps-1">
                            <NbButton id={"btn" + this.props.id + "16"} parent={this} keyBtn={{textbox:"txtPop" + this.props.id,key:"/"}} 
                            className="form-group btn btn-primary btn-block" style={{height:'60px',width:'100%'}}>
                                <i className="text-white fa-solid fa-slash" style={{fontSize: '24px'}} />
                            </NbButton>
                        </div>
                    </div>
                    {/* Equal */}
                    <div className='row py-1'>
                        <div className="col-12">
                            <NbButton id={"btnPopQuantity"} parent={this} className="form-group btn btn-success btn-block" style={{height:'60px',width:'100%'}}>
                                <i className="text-white fa-solid fa-equals" style={{fontSize: '24px'}} />
                            </NbButton>
                        </div>
                    </div>
                    {/* Ce */}
                    <div className='row py-1'>
                        <div className="col-12">
                            <NbButton id={"btnPopQuantity"} parent={this} className="form-group btn btn-danger btn-block" style={{height:'60px',width:'100%',fontSize:'20pt'}}>
                            CE
                            </NbButton>
                        </div>
                    </div>
                </NdPopUp>
            </div>
        )
    }
}