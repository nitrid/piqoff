import React from 'react';
import NbBase from './base.js';
import NbButton from './button.js';
import Keyboard from "react-simple-keyboard";

export default class NbKeyboard extends NbBase
{
    constructor(props)
    {
        super(props);
        this.state.layoutName = typeof this.props.layoutName == 'undefined' ?  "default" : this.props.layoutName
        this.state.inputName = this.props.inputName
        this.state.inputs = {}
        this.state.position = {top: 0}
        this.state.visible = false
        
        this.keyPattern = 
        {
            qwert : 
            {
                shift: 
                [
                    "q w e r t y u i o p ü . :",
                    "a s d f g h j k l ş - , /",
                    "z x c v b n m ö ç * _ % {shift}",
                    "{numbers} {space} {backspace} @" + (this.props.enter ? " {enter}" : "")
                ],
                default: 
                [
                    "Q W E R T Y U I O P Ü . :",
                    "A S D F G H J K L Ş - , /",
                    "Z X C V B N M Ö Ç * _ % {shift}",
                    "{numbers} {space} {backspace} @" + (this.props.enter ? " {enter}" : "")
                ],
                mail: 
                [
                    "q w e r t y u i o p ü . :",
                    "a s d f g h j k l ş - , /",
                    "z x c v b n m ö ç * _ % {capslock}",
                    "{numbers} {space} {backspace} @" + (this.props.enter ? " {enter}" : ""),
                    "hotmail gmail outlook .com",
                    "icloud orange yahoo .fr"
                ],
                mailShift: 
                [
                    "Q W E R T Y U I O P Ü . :",
                    "A S D F G H J K L Ş - , /",
                    "Z X C V B N M Ö Ç * _ % {capslock}",
                    "{numbers} {space} {backspace} @" + (this.props.enter ? " {enter}" : ""),
                    "hotmail gmail outlook .com",
                    "icloud orange yahoo .fr"
                ],
                numbers: ["1 2 3", "4 5 6", "7 8 9", "{abc} 0 {backspace}"],
                numberSimple: ["1 2 3", "4 5 6", "7 8 9", ", 0 {backspace}"]
            },
            azert :
            {
                shift: 
                [
                    "a z e r t y u i o p % *",
                    "q s d f g h j k l m - |",
                    "w x c v b n , : . _ {shift}",
                    "{numbers} {space} {backspace} @" + (this.props.enter ? " {enter}" : "")
                ],
                default: 
                [
                    "A Z E R T Y U I O P % *",
                    "Q S D F G H J K L M - |",
                    "W X C V B N , : . _ {shift}",
                    "{numbers} {space} {backspace} @" + (this.props.enter ? " {enter}" : "")
                ],
                mail: 
                [
                    "a z e r t y u i o p % *",
                    "q s d f g h j k l m - |",
                    "w x c v b n , : . _ {capslock}",
                    "{numbers} {space} {backspace} @" + (this.props.enter ? " {enter}" : ""),
                    "hotmail gmail outlook .com",
                    "icloud orange yahoo .fr"
                ],
                mailShift: 
                [
                    "A Z E R T Y U I O P % *",
                    "Q S D F G H J K L M - |",
                    "W X C V B N , : . _ {capslock}",
                    "{numbers} {space} {backspace} @" + (this.props.enter ? " {enter}" : ""),
                    "hotmail gmail outlook .com",
                    "icloud orange yahoo .fr"
                ],
                numbers: ["1 2 3", "4 5 6", "7 8 9", "{abc} 0 {backspace}"],
                numberSimple: ["1 2 3", "4 5 6", "7 8 9", ", 0 {backspace}"]
            }
        }
        
        if(typeof this.props.keyType == 'undefined')
        {
            this.state.keyboard = this.keyPattern.qwert
        }
        else
        {
            this.state.keyboard = this.keyPattern[this.props.keyType]
        }
    }
    get inputName()
    {
        return this.state.inputName
    }
    set inputName(e)
    {
        this.setState({inputName:e})
    }
    setInput(e)
    {
        if(typeof this.props.focusClear != 'undefined' && this.props.focusClear == true)
        {
            this.state.inputs[this.state.inputName] = ""
            this.setState({inputs:this.state.inputs})
            this.keyboard.setInput("")
            return
        }

        this.state.inputs[this.state.inputName] = e
        this.setState({inputs:this.state.inputs})
        this.keyboard.setInput(e)        
    }
    clearInput()
    {
        this.keyboard.clearInput();
    }
    getCaretPositionEnd()
    {
        return this.keyboard.getCaretPositionEnd()
    }
    setCaretPosition(e)
    {
        this.keyboard.setCaretPosition(e)
    }
    show(inputId)
    {
        if(this.props.autoPosition)
        {
            const element = document.getElementById(inputId);
            if(element)
            {
                const rect = element.getBoundingClientRect();
                this.setState({
                    visible: true,
                    position: {top: rect.bottom + window.scrollY}
                });
            }
        }
        else
        {
            this.setState({visible: true});
        }
    }
    hide()
    {
        this.setState({visible: false});
    }
    render()
    {
        if(this.props.autoPosition && !this.state.visible)
        {
            return null;
        }

        return(
            <div style={this.props.autoPosition ? {
                position: 'absolute',
                top: this.state.position.top + 'px',
                left: '0px',
                zIndex: 2000,
                backgroundColor: '#fff',
                boxShadow: '0px 2px 10px rgba(0,0,0,0.1)',
                padding: '10px',
                width: '100%'
                } : {}}>
                <Keyboard keyboardRef={(r) => (this.keyboard = r)}
                inputName={this.state.inputName}
                newLineOnEnter={this.props.newLineOnEnter}
                onChangeAll={(inputs) =>
                {
                    this.props.parent[this.state.inputName].value = inputs[this.state.inputName]
                    this.setState({inputs:inputs})
                }}
                onKeyPress={(button) => 
                {
                    if (button === "{shift}" || button === "{lock}") 
                    {
                        this.setState({layoutName: this.state.layoutName === "default" ? "shift" : "default"});
                    }
                    if (button === "{capslock}") 
                    {
                        this.setState({layoutName: this.state.layoutName === "mail" ? "mailShift" : "mail"});
                    }
                    if (button === "{numbers}" || button === "{abc}") 
                    {
                        this.setState({layoutName: this.state.layoutName === "numbers" ? this.props.layoutName : "numbers"});
                    }
                }}
                layoutName={this.state.layoutName}
                layout={this.state.keyboard}
                display={{
                    "{numbers}": "123",
                    "{enter}": "↵",
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
                    class: "simple-keyboard-ratea",
                    buttons: "%"
                }]}
                mergeDisplay={true}
                />
            </div>
        )
    }
}