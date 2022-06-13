import React from 'react';
import NbBase from './base.js';
import NbButton from './button.js';
import Keyboard from "react-simple-keyboard";

export default class NbKeyboard extends NbBase
{
    constructor(props)
    {
        super(props);
        this.state =
        {
            layoutName: "default",
            inputName: this.props.inputName,
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
        this.keyboard.setInput(e)
    }
    clearInput()
    {
        this.keyboard.clearInput();
    }
    render()
    {
        return(
            <div>
                <Keyboard keyboardRef={(r) => (this.keyboard = r)}
                inputName={this.state.inputName}
                onChange={(input) => 
                {                    
                    this.props.parent[this.state.inputName].value = input
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
                layout={
                {
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
        )
    }
}