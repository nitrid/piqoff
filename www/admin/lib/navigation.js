import React from 'react';
import {TreeView,SearchEditorOptions} from 'devextreme-react/tree-view';
import {menu} from './menu.js'
import App from './app.js';

// DOUBLE CLİCK ICIN YAPILDI
let timeout = null;
export default class Navigation extends React.Component 
{
    constructor()
    {        
        super();
        this.style = 
        {
            div :
            {
                height:'100%'
            },
            treeview :
            {
                padding:'8px'
            }
        }
        this.menu = menu;
        this.state = 
        {
            value: 'contains',
            currentItem: Object.assign({},this.menu[0]),
        }
        this.selectItem = this.selectItem.bind(this);
    }
    render()
    {
        const {currentItem} = this.state;
        return(
            <div style={this.style.div}>
                <TreeView id="Menu" style={this.style.treeview}
                    items = {this.menu}
                    width = {300}
                    height = {'100%'}
                    onItemClick = {this.selectItem}
                    searchMode={this.state.value}
                    searchEnabled={true}                
                    >
                    <SearchEditorOptions height={'fit-content'} />
                </TreeView>  
            </div>
        )
    }
    selectItem(e) 
    {        
        // DOUBLE CLİCK ICIN YAPILDI
        if (!timeout) 
        {  
            timeout = setTimeout(function () 
            {  
                timeout = null;  
            }, 300);  
        } 
        else 
        {  
            App.instance.menuClick(e.itemData)
            this.setState(
            {
                currentItem: Object.assign({}, e.itemData)
            });
        }  
        
    }
} 