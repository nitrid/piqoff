import React from 'react';
import {TreeView,SearchEditorOptions} from 'devextreme-react/tree-view';
import {menu} from './menu.js'
import App from './app.js';
import {menu as userMenu} from '../../core/core'
import NbLabel from '../../core/react/bootstrap/label.js';
import LoadPanel from 'devextreme-react/load-panel';

// DOUBLE CLİCK ICIN YAPILDI
let timeout = null;
export default class Navigation extends React.PureComponent 
{
    constructor()
    {        
        super();
        this.core = App.instance.core;
        this.menuobj = new userMenu(menu(App.instance.lang))
        this.menuRef = undefined

        this.state = 
        {
            loading: true,
            value: 'contains',
            menu:[]
        }

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
        let tmpM = menu(App.instance.lang)
        //SADECE ADMİNDE GÖKZÜKMESİ İÇİN GEÇİCİ OLARAK YAPILDI BURAYA BAKILACAK
        if(this.core.auth.data.ROLE != 'Administrator')
        {
            tmpM[6].items[2] = {}
        }  

        this.selectItem = this.selectItem.bind(this);

        // MENUNUN DATABASE PARAMETRESINDEN GELMESI
        let tmpMenuData = await this.menuobj.load({USER:this.core.auth.data.CODE,APP:"OFF"})
        let tmpMenu = await this.mergeMenu(tmpM,tmpMenuData)

        for (let i = 0; i < tmpMenu.length; i++) 
        {
            for (let x = 0; x < tmpMenuData.length; x++) 
            {
                if(tmpMenu[i].id == tmpMenuData[x].id)
                {
                    if(typeof tmpMenuData[x].visible != 'undefined')
                    {
                        tmpMenu[i].visible = tmpMenuData[x].visible
                    }
                }
            }
        }
        
        this.setState({menu:tmpMenu},()=>
        {
            this.menuRef.repaint()
            this.setState({loading:false})
        })
        
        App.instance.menuClick(
        {
            text: "PiqSoft",
            path: 'main.js',
        })
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
    }
    render()
    {
        return(
            <div style={this.style.div}>
                <LoadPanel
                shadingColor="rgba(255,255,255,1)"
                position={{ of: '#Menu' }}
                visible={this.state.loading}
                showIndicator={true}
                shading={true}
                showPane={false}
                />
                <div>
                    <TreeView id="Menu" style={this.style.treeview}
                    items = {this.state.menu}
                    width = {300}
                    height = {'100%'}
                    onItemClick = {this.selectItem}
                    searchMode={this.state.value}
                    searchEnabled={true}
                    onInitialized={(e)=>
                    {
                        this.menuRef = e.component
                    }}
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