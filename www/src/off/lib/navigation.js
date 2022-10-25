import React from 'react';
import {TreeView,SearchEditorOptions} from 'devextreme-react/tree-view';
import {menu} from './menu.js'
import App from './app.js';
import {menu as userMenu} from '../../core/core'
import NbLabel from '../../core/react/bootstrap/label.js';

// DOUBLE CLİCK ICIN YAPILDI
let timeout = null;
export default class Navigation extends React.PureComponent 
{
    constructor()
    {        
        super();
        this.core = App.instance.core;
        this.menuobj= new userMenu(menu(App.instance.lang))

        this.init();
    }
    async init()
    {
        this.style = 
        {
            div :
            {
                height:'97%'
            },
            treeview :
            {
                padding:'8px'
            }
        }
        
        this.menu = menu(App.instance.lang);   
        //  SADECE ADMİNDE GÖKZÜKMESİ İÇİN GEÇİCİ OLARAK YAPILDI BURAYA BAKILACAK
        if(this.core.auth.data.ROLE != 'Administrator')
        {
            this.menu[8].items[2] = {}
            this.menu[6] = {}
        }  

        this.state = 
        {
            loading: true,
            value: 'contains',
            currentItem: Object.assign({},this.menu[0]),
        }
        this.selectItem = this.selectItem.bind(this);

        // MENUNUN DATABASE PARAMETRESINDEN GELMESI

        let tmpMenuData = await this.menuobj.load({USER:this.core.auth.data.CODE,APP:"OFF"})
        let tmpMenu = await this.mergeMenu(this.menu,tmpMenuData)
        for (let i = 0; i < tmpMenu.length; i++) 
        {
            tmpMenu[i].id
            for (let x = 0; x < tmpMenuData.length; x++) 
            {
                tmpMenuData[x]
                if(tmpMenu[i].id == tmpMenuData[x].id)
                {
                    if(typeof tmpMenuData[x].visible != 'undefined')
                    {
                        tmpMenu[i].visible = tmpMenuData[x].visible
                    }
                    
                }
            }
        }

        await this.core.util.waitUntil(0)
        this.menu= tmpMenu
        this.setState({menu:tmpMenu})
    }
    async mergeMenu(tmpMenu,tmpMenuData)
    {
        return new Promise(async resolve => 
        {
            tmpMenu.forEach(async function (element,index,object)
            {
                let tmpMerge = await tmpMenuData.findSub({id:element.id},'items')
                if(typeof tmpMerge != 'undefined' && typeof tmpMerge.visible != 'undefined')
                {
                    object[index].visible = tmpMerge.visible
                }
                if(typeof element.items != 'undefined')
                {
                    this.mergeMenu(element.items,tmpMenuData)
                    
                }
            }.bind(this));
            
            resolve(tmpMenu)
        });
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
                    <div>
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
                    <div className="row">
                        <div className="col-12 px-4">
                            <NbLabel id="info" parent={this} value={this.core.appInfo.name + " version : " + this.core.appInfo.version}/>
                        </div>
                    </div>
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