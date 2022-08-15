import React from 'react';
import {TreeView,SearchEditorOptions} from 'devextreme-react/tree-view';
import {menu} from './menu.js'
import App from './app.js';

// DOUBLE CLİCK ICIN YAPILDI
let timeout = null;
export default class Navigation extends React.PureComponent 
{
    constructor()
    {        
        super();
        this.core = App.instance.core;
       
        this.init();
    }
    async init()
    {
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
        this.menu = menu(App.instance.lang);   

        // POS RAPOLARI SADECE ADMİNDE GÖKUÜKMESİ İÇİN GEÇİCİ OLARAK YAPILDI BURAYA BAKILACAK
        if(this.core.auth.data.ROLE != 'Administrator')
        {
            this.menu[8].items[2] = {}

        }  

        

        this.state = 
        {
            loading: true,
            value: 'contains',
            currentItem: Object.assign({},this.menu[0]),
        }
        this.selectItem = this.selectItem.bind(this);
    }
    async pluginMenu()
    {
        return new Promise(async resolve => 
        {
            // let tmpFolders = await this.core.util.folder_list('./www/plugins/off');
            // for (let i = 0; i < tmpFolders.length; i++) 
            // {
            //     if(tmpFolders[i] != 'access' && tmpFolders[i] != 'param')
            //     {
            //         let tmpMenu = (await import('../../plugins/off/' + tmpFolders[i] + '/menu.js')).menu
            //         for (let x = 0; x < tmpMenu.length; x++) 
            //         {
            //             this.menu.push(tmpMenu[x])
            //         }
            //     }
            // }
            resolve()
        });
    }
    async componentDidMount()
    {
        await this.pluginMenu()

        this.setState({loading:false})
    }
    render()
    {
        const {currentItem,loading} = this.state;
        if(loading)
        {
            return <div style={{width:300}}>...</div>
        }
        else
        {
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