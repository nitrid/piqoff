import React from 'react';
import {TreeView,SearchEditorOptions, Item} from 'devextreme-react/tree-view';
import {menu} from './menu.js'
import App from './app.js';
import {menu as userMenu} from '../../core/core'
import NbLabel from '../../core/react/bootstrap/label.js';
import LoadPanel from 'devextreme-react/load-panel';
import TabPanel from 'devextreme-react/tab-panel';
import ContextMenu from 'devextreme-react/context-menu';
import { dialog } from '../../core/react/devex/dialog.js';
// DOUBLE CLİCK ICIN YAPILDI
let timeout = null;
export default class Navigation extends React.PureComponent 
{
    constructor()
    {        
        super();
        this.core = App.instance.core;
        this.menuobj = new userMenu(menu(App.instance.lang))
        this.favMenuObj = new userMenu(menu(App.instance.lang))
        this.menuRef = undefined
        this.lang = App.instance.lang;
        this._isMounted = false; // Component mount durumunu takip et

        this.state = 
        {
            loading: true,
            value: 'contains',
            menu:[],
            favMenu:[],
            firmName: ''
        }

        this.favArray = []
        this.selectedItem
        this.init();
    }
    async init()
    {
        this.style = 
        {
            div :
            {
                height:'94%'
            },
            treeview :
            {
                padding:'8px'
            }
        }
        let tmpM = menu(App.instance.lang)

        this.selectItem = this.selectItem.bind(this);
        this.onTreeViewItemContextMenu = this.onTreeViewItemContextMenu.bind(this)

        // MENUNUN DATABASE PARAMETRESINDEN GELMESI
        let tmpMenuData = await this.menuobj.load({USER:this.core.auth.data.CODE,APP:"OFF",ID:'menu'})
        let tmpFavMenuData = await this.favMenuObj.load({USER:this.core.auth.data.CODE,APP:"OFF",ID:'favMenu'})
        if(this.favMenuObj.dt().length == 0)
        {
            tmpFavMenuData = []
        }
        else
        {
            // FavMenu verilerini tam formata dönüştür (text bilgilerini ekle)
            tmpFavMenuData = tmpFavMenuData.map(item => {
                if(!item.text && item.id) {
                    return {
                        ...item,
                        text: this.lang.t(`menuOff.${item.id}`), // Text bilgisini ekle
                        visible: item.visible !== undefined ? item.visible : true
                    };
                }
                return item;
            });
        }
        
        let tmpMenu = await this.mergeMenu(tmpM,tmpMenuData)

        let tmpLicMenu = await App.instance.getLicence('OFF','MENU');
        tmpMenu = await this.mergeLicMenu(tmpMenu, tmpLicMenu);
        
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
        
        if(this._isMounted) {
            this.setState({menu:tmpMenu},()=>
            {
                if(this._isMounted) {
                    this.menuRef.repaint()
                    this.setState({loading:false})
                }
            })
        }
        if(this._isMounted) {
            this.setState({favMenu:tmpFavMenuData},()=>
            {
                if(this._isMounted) {
                    this.setState({loading:false})
                    
                    // Eğer favMenu'da text eksikse tekrar düzelt
                    if(this.state.favMenu.length > 0) {
                        const fixedFavMenu = this.state.favMenu.map(item => {
                            if(!item.text && item.id) {
                                return {
                                    ...item,
                                    text: this.lang.t(`menuOff.${item.id}`)
                                };
                            }
                            return item;
                        });
                        
                        if(JSON.stringify(fixedFavMenu) !== JSON.stringify(this.state.favMenu)) {
                            if(this._isMounted) {
                                this.setState({favMenu: fixedFavMenu});
                            }
                        }
                    }
                }
            })
        }
        
        let tmpQuery = 
        {
            query :"SELECT TOP 1 NAME  FROM COMPANY_VW_01 " ,
        }
        let tmpData = await this.core.sql.execute(tmpQuery) 
        this.firmName.value = tmpData.result.recordset[0].NAME
        if(this._isMounted) {
            this.setState({firmName:tmpData.result.recordset[0].NAME})
        }
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
    async mergeLicMenu(tmpMenu,tmpMenuData)
    {
        return new Promise(async resolve => 
        {
            if(typeof tmpMenuData == 'undefined' || tmpMenuData.length == 0)
            {
                resolve(tmpMenu)
                return
            }

            tmpMenu.forEach(async function (element,index,object)
            {
                let tmpMerge = await tmpMenuData.findSub({id:element.id},'items')

                if(typeof tmpMerge != 'undefined')
                {
                    object[index].visible = true
                }
                else
                {
                    object[index].visible = false
                }
                
                if(typeof element.items != 'undefined')
                {
                    this.mergeLicMenu(element.items,tmpMenuData)
                    
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
        this._isMounted = true; // Component mount edildi
        await this.pluginMenu()
    }
    componentWillUnmount()
    {
        this._isMounted = false; // Component unmount edildi
    }
    async onTreeViewItemContextMenu(e)
    {
        this.selectedItem = e.itemData
    }
    async favItemAdd()
    {
        let tmpMenu = this.state.favMenu
        if(typeof this.selectedItem.path == 'undefined')
        {
            let tmpConfObj =
            {
                id:'msgPageSelect',showTitle:true,title:this.lang.t("msgPageSelect.title"),showCloseButton:true,width:'500px',height:'200px',
                button:[{id:"btn01",caption:this.lang.t("msgPageSelect.btn01"),location:'after'}],
                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgPageSelect.msg")}</div>)
            }
            await dialog(tmpConfObj);
            return
        }
        let tmpMerge = await tmpMenu.findSub({id:this.selectedItem.id},'items')
        if(typeof tmpMerge == 'undefined')
        {
            tmpMenu.push(this.selectedItem)
            if(this._isMounted) {
                this.setState({loading:true})
            }
    
            if(this.favMenuObj.dt().length == 0)
            {
                let tmpEmpty = {...this.favMenuObj.empty};
                tmpEmpty.TYPE = 0
                tmpEmpty.ID = "favMenu"
                tmpEmpty.VALUE = JSON.stringify(tmpMenu)
                tmpEmpty.USERS = this.core.auth.data.CODE;
                tmpEmpty.APP ="OFF"
    
                this.favMenuObj.addEmpty(tmpEmpty);
                this.favMenuObj.save()
            }
            else
            {
                this.favMenuObj.dt()[0].VALUE = JSON.stringify(tmpMenu)
                this.favMenuObj.save()
            }
            if(this._isMounted) {
                this.setState({favMenu:[]},()=>
                {
                    if(this._isMounted) {
                        this.setState({favMenu:tmpMenu,loading:false})
                    }
                })
            }
        }
       
    }
    async favItemDell()
    {
        let tmpMenu = this.state.favMenu
        for (var i = tmpMenu.length - 1; i >= 0; i--) 
        {
            if (tmpMenu[i].path === this.selectedItem.path) 
            {
                tmpMenu.splice(i, 1);
            }
        }
        if(this._isMounted) {
            this.setState({loading:true})
        }
    
        this.favMenuObj.dt()[0].VALUE = JSON.stringify(tmpMenu)
        this.favMenuObj.save()
        
        if(this._isMounted) {
            this.setState({favMenu:[]},()=>
            {
                if(this._isMounted) {
                    this.setState({favMenu:tmpMenu,loading:false})
                }
            })
        }
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
                <React.Fragment>
                    <TabPanel id="tabPanel" width={300}>
                        <Item title={this.lang.t("menu")} icon="menu">
                            <TreeView id="Menu1" style={this.style.treeview}
                            items = {this.state.menu}
                            width = {300}
                            height = {'100%'}
                            onItemClick = {this.selectItem}
                            searchMode={this.state.value}
                            searchEnabled={true}
                            onItemContextMenu= {this.onTreeViewItemContextMenu}
                            displayExpr="text"
                            keyExpr="id"
                            onInitialized={(e)=>
                            {
                                this.menuRef = e.component
                            }}
                            >
                                <SearchEditorOptions height={'fit-content'} />                        
                            </TreeView> 
                        </Item>
                        <Item title={this.lang.t("favMenu")} icon="favorites">
                            <TreeView id="Menu2" style={this.style.treeview}
                            items = {this.state.favMenu}
                            width = {300}
                            height = {'100%'}
                            onItemClick = {this.selectItem}
                            searchMode={this.state.value}
                            searchEnabled={true}
                            onItemContextMenu= {this.onTreeViewItemContextMenu}
                            displayExpr="text"
                            keyExpr="id"
                            onInitialized={(e)=>
                            {
                                this.menuRef2 = e.component
                            }}
                            >
                                <SearchEditorOptions height={'fit-content'} />                        
                            </TreeView> 
                        </Item>
                    </TabPanel>
                    <ContextMenu
                    dataSource={[{ text: this.lang.t("favAdd")}]}
                    width={200}
                    target="#Menu1"
                    onItemClick={(async(e)=>
                    {
                        this.favItemAdd()
                    }).bind(this)} />
                    <ContextMenu
                    dataSource={[{ text: this.lang.t("favDell")}]}
                    width={200}
                    target="#Menu2"
                    onItemClick={(async(e)=>
                    {
                        this.favItemDell()
                    }).bind(this)} />
                </React.Fragment>

                </div>
                <div className="row">
                    <div className="col-12 px-4">
                        <NbLabel id="firmName" parent={this} value={this.state.firmName}/>
                    </div>
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