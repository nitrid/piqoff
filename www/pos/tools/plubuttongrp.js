import React from "react";
import NbBase from "../../core/react/bootstrap/base.js";
import NbButton from "../../core/react/bootstrap/button.js";
import { posPluCls } from "../../core/cls/pos.js";

export default class NbPluButtonGrp extends NbBase
{
    constructor(props)
    {
        super(props)
        this.pluObj = new posPluCls()
        this.state =
        {
            btnCategory : [],
            btnImage : [],
            btnPlu : []
        }
        this.init()

        this._onClick = this._onClick.bind(this);
    }
    async init()
    {
        await this.pluObj.load({CUSER:'1'})
        this.setCategory(0)
    }
    setCategory(pIndex)
    {
        this.setState(
        {
            btnCategory:this.pluObj.dt().where({TYPE:0}),
            btnPlu:this.pluObj.dt().where({TYPE:1}).where({GROUP_INDEX:pIndex}),
            btnImage:this.pluObj.dt().where({TYPE:2}).where({GROUP_INDEX:pIndex})
        })
    }
    _btnCategoryView()
    {
        let tmpView = []
        for (let i = 0; i < 5; i++) 
        {
            if(typeof this.state.btnCategory[i] == 'undefined')
            {
                tmpView.push
                (
                    <div key={this.props.id + "_btnCategory" + i} className="col px-1">
                        <NbButton id={this.props.id + "_btnCategory" + i} 
                        parent={this} className="form-group btn btn-info btn-block my-1 text-white" 
                        style={{height:"70px",width:"100%",fontSize:"10pt"}}>
                        </NbButton>
                    </div>
                )    
            }
            else
            {                
                tmpView.push
                (
                    <div key={this.props.id + "_btnCategory" + i} className="col px-1">
                        <NbButton id={this.props.id + "_btnCategory" + i} 
                        parent={this} className="form-group btn btn-info btn-block my-1 text-white" 
                        style={{height:"70px",width:"100%",fontSize:"10pt"}}
                        onClick={()=>{this._onClick(i,this.state.btnCategory[i])}}>
                        {this.state.btnCategory[i].NAME}
                        </NbButton>
                    </div>
                )
            }
            
        }
        return tmpView;
    }
    _btnImageView()
    {
        let tmpView = []
        for (let i = 0; i < 5; i++) 
        {
            if(typeof this.state.btnImage[i] == 'undefined')
            {
                tmpView.push
                (
                    <div key={this.props.id + "_btnImage" + i} className="col px-1">
                        <NbButton id={this.props.id + "_btnImage" + i} parent={this} className="form-group btn btn-dark btn-block my-1" 
                        style={{height:"70px",width:"100%",fontSize:"10pt"}}>
                        </NbButton>
                    </div>
                )    
            }
            else
            {                
                tmpView.push
                (
                    <div key={this.props.id + "_btnImage" + i} className="col px-1">
                        <NbButton id={this.props.id + "_btnImage" + i} parent={this} className="form-group btn btn-dark btn-block my-1" 
                        style={{height:"70px",width:"100%",fontSize:"10pt"}}
                        onClick={()=>{this._onClick(i,this.state.btnImage[i])}}>
                        {this.state.btnImage[i].NAME}
                        </NbButton>
                    </div>
                )
            }
        }
        return tmpView;
    }
    _onClick(pIndex,pData)
    {
        if(typeof this.props.onClick != 'undefined')
        {
            this.props.onClick(pIndex,pData);
        }
        if(pData.TYPE == 0)
        {
            this.setCategory(pIndex)
        }
    }
    render()
    {
        return(
            <div>
                {/* PLU (Line 1)  */}
                <div className="row">
                    {/* Plu 1 */}
                    <div className="col px-1">
                        <NbButton id={"btn"} parent={this} className="form-group btn btn-success btn-block my-1" style={{height:"70px",width:"100%",fontSize:"10pt"}}>FRUITS LEGUMES PC</NbButton>
                    </div>
                    {/* Plu 2 */}
                    <div className="col px-1">
                        <NbButton id={"btn"} parent={this} className="form-group btn btn-success btn-block my-1" style={{height:"70px",width:"100%",fontSize:"10pt"}}>FRUITS LEGUMES KG</NbButton>
                    </div>
                    {/* Plu 3 */}
                    <div className="col px-1">
                        <NbButton id={"btn"} parent={this} className="form-group btn btn-success btn-block my-1" style={{height:"70px",width:"100%",fontSize:"10pt"}}>EPICERIE</NbButton>
                    </div>
                    {/* Plu 4 */}
                    <div className="col px-1">
                        <NbButton id={"btn"} parent={this} className="form-group btn btn-success btn-block my-1" style={{height:"70px",width:"100%",fontSize:"10pt"}}>PATISSERIE ORIENTALE</NbButton>
                    </div>
                    {/* Plu 5 */}
                    <div className="col px-1">
                        <NbButton id={"btn"} parent={this} className="form-group btn btn-success btn-block my-1" style={{height:"70px",width:"100%",fontSize:"10pt"}}>SACHET CAISSE</NbButton>
                    </div>
                </div>
                {/* PLU (Line 2) */}
                <div className="row">
                    {/* Plu 6 */}
                    <div className="col px-1">
                        <NbButton id={"btn"} parent={this} className="form-group btn btn-success btn-block my-1" style={{height:"70px",width:"100%",fontSize:"10pt"}}>PIDE X2</NbButton>
                    </div>
                    {/* Plu 7 */}
                    <div className="col px-1">
                        <NbButton id={"btn"} parent={this} className="form-group btn btn-success btn-block my-1" style={{height:"70px",width:"100%",fontSize:"10pt"}}>Boucherie / Charcuterie</NbButton>
                    </div>
                    {/* Plu 8 */}
                    <div className="col px-1">
                        <NbButton id={"btn"} parent={this} className="form-group btn btn-success btn-block my-1" style={{height:"70px",width:"100%",fontSize:"10pt"}}>NAPPE TRANSPARENTE</NbButton>
                    </div>
                    {/* Plu 9 */}
                    <div className="col px-1">
                        <NbButton id={"btn"} parent={this} className="form-group btn btn-success btn-block my-1" style={{height:"70px",width:"100%",fontSize:"10pt"}}>PAIN KEBAB LOT X5</NbButton>
                    </div>
                    {/* Plu 10 */}
                    <div className="col px-1">
                        <NbButton id={"btn"} parent={this} className="form-group btn btn-success btn-block my-1" style={{height:"70px",width:"100%",fontSize:"10pt"}}>OLIVES AU CHOIX KG</NbButton>
                    </div>
                </div>
                {/* PLU Group (Line 3) */}
                <div className="row">
                    {this._btnCategoryView()}
                    {/*
                    <div className="col px-1">
                        <NbButton id={"btn"} parent={this} className="form-group btn btn-info btn-block my-1 text-white" style={{height:"70px",width:"100%",fontSize:"10pt"}}>1</NbButton>
                    </div>
                    <div className="col px-1">
                        <NbButton id={"btn"} parent={this} className="form-group btn btn-info btn-block my-1 text-white" style={{height:"70px",width:"100%",fontSize:"10pt"}}>PAIN</NbButton>
                    </div>
                    <div className="col px-1">
                        <NbButton id={"btn"} parent={this} className="form-group btn btn-info btn-block my-1 text-white" style={{height:"70px",width:"100%",fontSize:"10pt"}}>FRUIT</NbButton>
                    </div>
                    <div className="col px-1">
                        <NbButton id={"btn"} parent={this} className="form-group btn btn-info btn-block my-1 text-white" style={{height:"70px",width:"100%",fontSize:"10pt"}}>BONBON</NbButton>
                    </div>
                    <div className="col px-1">
                        <NbButton id={"btn"} parent={this} className="form-group btn btn-info btn-block my-1 text-white" style={{height:"70px",width:"100%",fontSize:"10pt"}}></NbButton>
                    </div>
                    */}
                </div>
                {/* PLU Image Group (Line 4) */}
                <div className="row">
                    {this._btnImageView()}
                    {/* <div className="col px-1">
                        <NbButton id={"btn"} parent={this} className="form-group btn btn-dark btn-block my-1" style={{height:"70px",width:"100%",fontSize:"10pt"}}
                        onClick={()=>
                        {                                                        
                            this.popPluGroup.show();
                        }}>
                            FRUIT ET LEGUMES
                        </NbButton>
                    </div>
                    <div className="col px-1">
                        <NbButton id={"btn"} parent={this} className="form-group btn btn-dark btn-block my-1" style={{height:"70px",width:"100%",fontSize:"10pt"}}>PAIN</NbButton>
                    </div>
                    <div className="col px-1">
                        <NbButton id={"btn"} parent={this} className="form-group btn btn-dark btn-block my-1" style={{height:"70px",width:"100%",fontSize:"10pt"}}>BOISSON</NbButton>
                    </div>
                    <div className="col px-1">
                        <NbButton id={"btn"} parent={this} className="form-group btn btn-dark btn-block my-1" style={{height:"70px",width:"100%",fontSize:"10pt"}}>HYGIENE</NbButton>
                    </div>
                    <div className="col px-1">
                        <NbButton id={"btn"} parent={this} className="form-group btn btn-dark btn-block my-1" style={{height:"70px",width:"100%",fontSize:"10pt"}}></NbButton>
                    </div> */}
                </div>
            </div>
        )
    }
}