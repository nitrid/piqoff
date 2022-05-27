import React from "react";
import NbBase from "../../core/react/bootstrap/base.js";
import NbButton from "../../core/react/bootstrap/button.js";
import NdGrid,{Paging,Pager,Column} from "../../core/react/devex/grid.js";
import NdTextBox from "../../core/react/devex/textbox.js";
import NdPopUp from "../../core/react/devex/popup.js";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";

export {Column}
export default class NbPosPopGrid extends NbBase
{
    constructor(props)
    {
        super(props)
        this.state = 
        {
            title:this.props.title,
            width:this.props.width,
            height:this.props.height,
            position:this.props.position,
            layoutName: "default"
        }
        this.data = this.props.data
        this._onSelection = this._onSelection.bind(this)
    }
    _onSelection(pData)
    {
        if(typeof this.props.onSelection != 'undefined')
        {
            this.props.onSelection(pData);
        }
    }
    setTitle(pTitle)
    {
        this[this.props.id].setTitle(pTitle)
    }
    async getData()
    {
        let tmpQuery = {...this.data}
        tmpQuery.source.select.value = []
        tmpQuery.source.select.value.push(this["txt" + this.props.id].value.replaceAll('%','%')+'%')
        await this["grd" + this.props.id].dataRefresh(tmpQuery)
    }
    async show()
    {
        //this["txt" + this.props.id].value = ""
        //await this["grd" + this.props.id].dataRefresh({source:[]})
        this[this.props.id].show()
    }
    render()
    {
        return(
            <div>
                <NdPopUp parent={this} id={this.props.id} 
                visible={false}                        
                showCloseButton={true}
                showTitle={true}
                title={this.state.title}
                container={this.state.position} 
                width={this.state.width}
                height={this.state.height}
                position={{of:this.state.position}}>
                    <div className="row pb-1">
                        <div className="col-12">
                            <NdTextBox id={"txt" + this.props.id} parent={this} simple={true} 
                            onChange={(async()=>{this.getData()}).bind(this)}
                            />     
                        </div>                            
                    </div>
                    <div className="row py-1">
                        <div className="12">
                            <NdGrid parent={this} id={"grd" + this.props.id} 
                            showBorders={true} 
                            columnsAutoWidth={true} 
                            allowColumnReordering={true} 
                            allowColumnResizing={true} 
                            filterRow={{visible:true}} 
                            headerFilter={{visible:true}}
                            height={"290px"} 
                            width={"100%"}
                            dbApply={false}
                            selection={{mode:'single'}}
                            onRowPrepared={(e)=>
                                {
                                    if(e.rowType == "header")
                                    {
                                        e.rowElement.style.fontWeight = "bold";                                          
                                    }
                                    e.rowElement.style.fontSize = "13px";  
                                }
                            }
                            onCellPrepared=
                            {
                                (e)=>
                                {
                                    if(e.rowType == "data")
                                    {
                                        e.cellElement.style.padding = "12px"
                                    }
                                }
                            }
                            
                            >
                                <Paging defaultPageSize={5} />
                                <Pager visible={true}/>
                                {this.props.children}
                            </NdGrid>
                        </div>
                    </div>
                    <div className="row py-1">
                        <div className="col-6">
                            <NbButton id={"btnList" + this.props.id} parent={this} className="form-group btn btn-success btn-block" 
                            style={{height:"45px",width:"100%",fontSize:"16px"}}
                            onClick={async ()=>{this.getData()}}>Listele</NbButton>
                        </div>
                        <div className="col-6">
                            <NbButton id={"btnSelect" + this.props.id} parent={this} className="form-group btn btn-success btn-block" 
                            style={{height:"45px",width:"100%",fontSize:"16px"}}
                            onClick={async ()=>
                            {
                                this._onSelection(this["grd" + this.props.id].devGrid.getSelectedRowsData())
                                this[this.props.id].hide()
                            }}>Seç</NbButton> 
                        </div>                        
                    </div>
                    <div className="row pt-1">
                        <Keyboard keyboardRef={(r) => (this.keyboard = r)}
                        onChange={(input) => 
                        {
                            this["txt" + this.props.id].value = input
                        }}
                        onKeyPress={(button) => 
                        {
                            if (button === "{shift}" || button === "{lock}") 
                            {
                                this.setState(
                                {
                                    layoutName: this.state.layoutName === "default" ? "shift" : "default"
                                });
                            }
                            if (button === "{numbers}" || button === "{abc}") 
                            {
                                this.setState(
                                {
                                    layoutName: this.state.layoutName === "default" ? "numbers" : "default"
                                });
                            }
                        }}
                        layoutName={this.state.layoutName}
                        layout={{
                            shift: 
                            [
                            "q w e r t y u i o p ü .",
                            "a s d f g h j k l ş - ,",
                            "z x c v b n m ö ç * / %",
                            "{numbers} {space} {backspace}"
                            ],
                            default: 
                            [
                            "Q W E R T Y U I O P Ü .",
                            "A S D F G H J K L Ş - ,",
                            "Z X C V B N M Ö Ç * / %",
                            "{numbers} {space} {backspace}"
                            ],
                            numbers: ["1 2 3", "4 5 6", "7 8 9", "{abc} 0 {backspace}"]
                        }}
                        display={{
                            "{numbers}": "123",
                            "{ent}": "return",
                            "{escape}": "esc ⎋",
                            "{tab}": "tab ⇥",
                            "{backspace}": "⌫",
                            "{capslock}": "caps lock ⇪",
                            "{shift}": "⇧",
                            "{controlleft}": "ctrl ⌃",
                            "{controlright}": "ctrl ⌃",
                            "{altleft}": "alt ⌥",
                            "{altright}": "alt ⌥",
                            "{metaleft}": "cmd ⌘",
                            "{metaright}": "cmd ⌘",
                            "{abc}": "ABC"
                        }}
                        buttonTheme={[
                        {
                            class: "simple-keyboard-rate",
                            buttons: "%"
                        }]}
                        mergeDisplay={true}
                        />
                    </div>
                </NdPopUp>
            </div> 
        )
    }
}