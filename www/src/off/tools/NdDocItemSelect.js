import React from "react";
import NdPopUp from '../../core/react/devex/popup.js';
import NdGrid,{Column} from '../../core/react/devex/grid.js';
import NdButton from '../../core/react/devex/button.js';
import NdTextBox from '../../core/react/devex/textbox.js'
import NdBase from '../../core/react/devex/base.js';
import NdSelectBox from '../../core/react/devex/selectbox.js';
import { datatable } from '../../core/core.js';

export default class NdDocItemSelect extends NdBase
{
    constructor(props)
    {
        super(props)
        
        this.state = 
        {
            columns : this.props.columns || []
        }

        this.listeners = Object();
        this.viewQuery = this.props.viewQuery || ''
        this.selectQuery = this.props.selectQuery || ''
        this.unitParam = this.props.unitParam || ''

        this._onHiding = this._onHiding.bind(this);
        this._onSelectionChanged = this._onSelectionChanged.bind(this);
        this._onClick = this._onClick.bind(this);
        this._onRowDblClick = this._onRowDblClick.bind(this);
        this.setSource = this.setSource.bind(this);
        this.setData = this.setData.bind(this);
        this.setVal = this.setVal.bind(this);
    }
    //#region Private
    _isGrid()
    {
        return new Promise(async resolve => 
        {
            if(typeof this["grid_" + this.props.id] == 'undefined')
            {
                setTimeout(() => 
                {
                    resolve(this["grid_" + this.props.id])    
                }, 100);
            }
            else
            {
                resolve(this["grid_" + this.props.id]) 
            }
        });
    }
    _formView()
    {
        if(typeof this.props.search == 'undefined' || this.props.search == false)
        {
            return (
                <div className="row p-2">
                    <div className="col-12 py-2">
                        <NdButton parent={this} id={"btn2_" + this.props.id} text={this.props.parent.lang.t('popGrid.btnSelection')} width={'100%'} type={"default"} onClick={this._onClick}/>
                    </div>
                </div>
            )
        }
        else
        {
            return (
                <div className="row p-2">
                    <div className='col-12'>
                        <div className="row pb-1">
                            <div className="col-12">
                                <NdTextBox id={"txt" + this.props.id} parent={this} simple={true} 
                                onChange={(async()=>{this.getData()}).bind(this)}
                                />     
                            </div>                            
                        </div>           
                        <div className="row">
                            <div className="col-6 py-2">
                                <NdButton parent={this} id={"btn1_" + this.props.id} text={this.props.parent.lang.t('popGrid.btnSearch')} width={'100%'} type={"default"} onClick={()=> {this.getData()}}/>
                            </div>
                            <div className="col-6 py-2">
                                <NdButton parent={this} id={"btn2_" + this.props.id} text={this.props.parent.lang.t('popGrid.btnSelection')} width={'100%'} type={"default"} onClick={this._onClick}/>
                            </div>
                        </div>
                    </div>
                </div>   
            )
        }
    }
    _onSelectionChanged(e) 
    {
        if(typeof this.props.onSelectionChanged != 'undefined')
        {
            this.props.onSelectionChanged(e);
        }
    }
    _onHiding() 
    {
        if(typeof this.props.onHiding != 'undefined')
        {
            this.props.onHiding();
        }
        if(typeof this.onHiding != 'undefined')
        {
            this.onHiding()
        }
        
        this.hide();
    }
    _onClick()
    {
        if(this.grid.getSelectedData().length > 0)
        {
            this.hide()
            this.getItem(this.grid.getSelectedData().map(x => x.GUID)).then(tmpDt =>
            {
                this.onClick(tmpDt)
            })
        }
    }
    _onRowDblClick(e)
    {
        this._onClick();
        
        if(typeof this.props.onRowDblClick != 'undefined')
        {
            this.props.onRowDblClick(e);
        }
    }
    on(pEvt, pCallback) 
    {
        if (!this.listeners.hasOwnProperty(pEvt))
        this.listeners[pEvt] = Array();

        this.listeners[pEvt].push(pCallback); 
    }
    emit(pEvt, pParams)
    {
        if (pEvt in this.listeners) 
        {
            let callbacks = this.listeners[pEvt];
            for (var x in callbacks)
            {
                callbacks[x](pParams);
            }
        } 
    }
    //#endregion
    getItem(pGuid)
    {
        return new Promise(async resolve => 
        {
            let tmpGuidList = '';
            if(Array.isArray(pGuid)) 
            {
                tmpGuidList = pGuid.map(guid => `'${guid}'`).join(',');
            } 
            else 
            {
                tmpGuidList = `'${pGuid}'`;
            }

            let tmpDt = new datatable()
            let tmpQuery = this.selectQuery.query

            tmpQuery = tmpQuery.replaceAll('{UNIT}',this.unitParam)
            tmpQuery = tmpQuery.replaceAll('{INPUT}',this.docObj.dt()[0].INPUT)
            tmpQuery = tmpQuery.replaceAll('{OUTPUT}',this.docObj.dt()[0].OUTPUT)
            tmpQuery = tmpQuery.replaceAll('{PRICE_LIST_NO}',this.docObj.dt()[0].PRICE_LIST_NO)
            
            tmpQuery = tmpQuery.replaceAll('{GUID}',tmpGuidList)

            tmpDt.selectCmd = 
            {
                query : tmpQuery
            }
            
            await tmpDt.refresh()
            resolve(tmpDt)
        })
    }
    get columns()
    {
        return this.state.columns
    }
    set columns(pColumns)
    {
        this.setState({columns:pColumns})
    }
    async componentDidMount()
    {
        this.popup = this["pop_" + this.props.id];
        this.grid = await this._isGrid();

        this.on('showing',()=>
        {
            let tmpQuery = this.viewQuery.query
            
            tmpQuery = tmpQuery.replaceAll('{INPUT}',this.docObj.dt()[0].INPUT)
            tmpQuery = tmpQuery.replaceAll('{OUTPUT}',this.docObj.dt()[0].OUTPUT)
            tmpQuery = tmpQuery.replaceAll('{PRICE_LIST_NO}',this.docObj.dt()[0].PRICE_LIST_NO)
            
            this.setSource(
            {
                source:
                {
                    select:{query : tmpQuery,param : this.viewQuery.param},
                    sql:this.props.parent.core.sql
                }
            })
        })
    }
    async show()
    {
        return new Promise(async resolve => 
        {
            this.emit('showing')
            await this["pop_" + this.props.id].show();
            this.emit('showed')
            resolve();
        })
    }
    hide()
    {
        this["pop_" + this.props.id].hide();
    }
    async setVal(pValue)
    {
        if(typeof pValue != 'undefined')
        {
            await this.show();
            await this["txt" + this.props.id].setState({value:pValue})
            await this.getData()
        }
    }
    async setSource(pSource)
    {
        this.SourceData = pSource  
    } 
    async getData()
    {
        let tmpQuery
        if(typeof this.data == 'undefined' )
        {
            tmpQuery = this.SourceData
        }
        else
        {
            tmpQuery =  {...this.data}
        }
        
        tmpQuery.source.select.value = []
        if(tmpQuery.source.select.param[0] == "VAL:string|50")
        {
            tmpQuery.source.select.value.push(this["txt" + this.props.id].value.replaceAll('*','%')+'%')
        }
        else
        {
            tmpQuery.source.select.value.push(this["txt" + this.props.id].value.replaceAll('*','%'))
        }
        await this.grid.dataRefresh(tmpQuery)
    }
    async setData(pData)
    {
        await this.grid.dataRefresh({source:pData})
    }
    setSelection(pMode)
    {
        this.setState({selection:{mode:pMode}})
    }
    async onItemSelection(pData,pIndex,pColumn)
    {
        if(pData != null && typeof pData != "undefined" && typeof pData.GUID != "undefined" && pData.GUID != "")
        {
            let tmpDt = await this.getItem(pData.GUID)
            
            if(tmpDt.length > 0 && this.docItems.dt()[pIndex].ITEM != tmpDt[0].GUID)
            {
                await this.addItem(tmpDt[0],pIndex)
                
                const newRowGuid = this.docItems.dt()[pIndex];
                await this.props.parent.grid.devGrid.navigateToRow(newRowGuid);
                let tmpCell = this.props.parent.grid.devGrid.getCellElement(this.props.parent.grid.devGrid.getRowIndexByKey(newRowGuid), pColumn)
                this.props.parent.grid.devGrid.focus(tmpCell)
            }
        }
        else
        {
            this.setSelection('single')
            if(pData != null && typeof pData != "undefined" && pData.CODE == "" && pData.NAME == "")
            {
                this.show()
            }
            else if(pData != null && typeof pData != "undefined" && typeof pData.NAME != "undefined" && pData.NAME != "")
            {
                this.setVal(pData.NAME)
            }
            else if(pData != null && typeof pData != "undefined" && typeof pData.CODE != "undefined" && pData.CODE != "")
            {
                this.setVal(pData.CODE)
            }
            else
            {
                return
            }
            
            this.onClick = async(data) =>
            {
                if(data.length > 0)
                {
                    this.onItemSelection(data[0],pIndex,pColumn)
                }
            }

            this.onHiding = async() =>
            {
                const newRowGuid = this.docItems.dt()[pIndex];
                await this.props.parent.grid.devGrid.navigateToRow(newRowGuid);
                let tmpCell = this.props.parent.grid.devGrid.getCellElement(this.props.parent.grid.devGrid.getRowIndexByKey(newRowGuid),pColumn)
                this.props.parent.grid.devGrid.focus(tmpCell)
            }
        }
    }
    cellRoleRender(e)
    {
        if(e.column.dataField == "ITEM_CODE")
        {
            return (
                <NdSelectBox id={"txtGrdItemCode"+e.rowIndex} parent={this} simple={true} 
                value={e.value}
                displayExpr="CODE"                       
                valueExpr="CODE"
                searchEnabled={true}
                searchTimeout={200}
                minSearchLength={2}
                acceptCustomValue={true}
                openOnFieldClick={false}
                buttons={[
                {
                    location:'after',name:'txtGrdItemCode',
                    options:
                    {
                        icon:'more',
                        elementAttr: {style: 'border:none; box-shadow:none; background:none;'},
                        onClick:()=>
                        {
                            this.onItemSelection({CODE:'',NAME:''},e.rowIndex,"ITEM_CODE")
                        }
                    }
                }]}
                data={{
                    source:
                    {
                        select:
                        {
                            query : `SELECT TOP 20 GUID,CODE,NAME FROM ITEMS_VW_04 WHERE UPPER(CODE) LIKE UPPER(@SEARCH + '%') ORDER BY CODE ASC`,
                            param : ['SEARCH:string|50']
                        },
                        sql:this.props.parent.core.sql
                    },
                    dbSearch:true
                }}
                onSelectionChanged={(async(c)=>
                {
                    const dataIndex = this.docItems.dt().findIndex(x => x === e.key);

                    if(c.selectedItem?.CODE != this.docItems.dt()[dataIndex].ITEM_CODE)
                    {
                        this.onItemSelection(c.selectedItem,dataIndex,"ITEM_CODE")
                    }
                }).bind(this)}
                onCustomItemCreating={(async(c)=>
                {
                    c.customItem = {GUID:'',CODE:c.text};
                    const dataIndex = this.docItems.dt().findIndex(x => x === e.key);
                    this.onItemSelection(c.customItem,dataIndex,"ITEM_CODE")
                }).bind(this)}
                />  
            )
        }
        if(e.column.dataField == "ITEM_NAME")
        {
            return (
                <NdSelectBox id={"txtGrdItemName"+e.rowIndex} parent={this} simple={true} 
                value={e.value}
                displayExpr="NAME"                       
                valueExpr="NAME"
                searchEnabled={true}
                searchTimeout={200}
                minSearchLength={3}
                acceptCustomValue={true}
                openOnFieldClick={false}
                buttons={[
                {
                    location:'after',name:'txtGrdItemName',
                    options:
                    {
                        icon:'more',
                        elementAttr: {style: 'border:none; box-shadow:none; background:none;'},
                        onClick:()=>
                        {
                            this.onItemSelection({CODE:'',NAME:''},e.rowIndex,"ITEM_NAME")
                        }
                    }
                }]}
                data={{
                    source:
                    {
                        select:
                        {
                            query : `SELECT TOP 20 GUID,CODE,NAME FROM ITEMS_VW_04 WHERE UPPER(NAME) LIKE UPPER(@SEARCH + '%') ORDER BY NAME ASC`,
                            param : ['SEARCH:string|50']
                        },
                        sql:this.props.parent.core.sql
                    },
                    dbSearch:true
                }}
                onSelectionChanged={(async(c)=>
                {
                    const dataIndex = this.docItems.dt().findIndex(x => x === e.key);

                    if(c.selectedItem?.NAME != this.docItems.dt()[dataIndex].ITEM_NAME)
                    {
                        this.onItemSelection(c.selectedItem,dataIndex,"ITEM_NAME")
                    }
                }).bind(this)}
                onCustomItemCreating={(async(c)=>
                {
                    c.customItem = {GUID:'',NAME:c.text};
                    const dataIndex = this.docItems.dt().findIndex(x => x === e.key);
                    this.onItemSelection(c.customItem,dataIndex,"ITEM_NAME")
                }).bind(this)}
                />  
            )
        }
        if(e.column.dataField == "UNIT")
        {
            const itemGuid = e.data.ITEM

            return (
                <NdSelectBox id={"txtGrdUnit"+e.rowIndex} parent={this} simple={true} displayExpr="NAME" valueExpr="GUID"
                value={e.value}
                data={{source:
                {
                    select:
                    {
                        query : `SELECT GUID,TYPE,ID,NAME,SYMBOL,FACTOR FROM ITEM_UNIT_VW_01 
                        WHERE ITEM_GUID = '${itemGuid}' AND ITEM_GUID <> '00000000-0000-0000-0000-000000000000' 
                        AND TYPE IN (0,2) ORDER BY TYPE ASC`
                    },
                    sql:this.props.parent.core.sql
                }}}  
                onSelectionChanged={(c)=>
                {
                    if(c.selectedItem != null)
                    {
                        e.data.UNIT = c.selectedItem.GUID
                        e.data.UNIT_NAME = c.selectedItem.NAME
                        e.data.UNIT_SHORT = c.selectedItem.SYMBOL || e.data.UNIT_SHORT
                        e.data.UNIT_FACTOR = c.selectedItem.FACTOR || e.data.UNIT_FACTOR
                        e.data.UNIT_PRICE = Number(e.data.PRICE * e.data.UNIT_FACTOR).round(4)
                        e.data.QUANTITY = Number(e.data.UNIT_QUANTITY * e.data.UNIT_FACTOR).round(4)

                        if(this.docItemsGrid.devGrid.option('onRowUpdated') && typeof  c.selectedItem.SYMBOL != 'undefined')
                        {
                            let tmpData = {...e}
                            tmpData.data = { QUANTITY: e.data.QUANTITY }
                            this.docItemsGrid.devGrid.option('onRowUpdated')({ ...tmpData});
                        }
                    }
                }}              
                />
            )
        }
    }
    render()
    {
        return(
        <React.Fragment>
            <NdPopUp parent={this} id={"pop_" + this.props.id} 
            onHiding={this._onHiding}                   
            closeOnOutsideClick={false}
            showCloseButton={true}
            showTitle={this.props.showTitle}
            title={this.props.title}
            container={this.props.container}
            width={this.props.width}
            height={this.props.height}
            position={this.props.position}
            deferRendering={true}
            onShowed={async()=>
            {
                this.grid = await this._isGrid();
                this.grid.devGrid.clearSelection()

                if(typeof this.props.search == 'undefined' || this.props.search == false)
                {
                    await this.grid.dataRefresh(this.state.data)
                }
                else
                {                    
                    if(this["txt" + this.props.id].value == '')
                    {
                        this.grid.devGrid.clearFilter()
                        await this.grid.dataRefresh({source:[]})
                        this["txt" + this.props.id].setState({value:''})
                    }
                
                    setTimeout(() => 
                    {
                        this["txt" + this.props.id].focus()
                    }, 700);
                }
            }}>
                {this._formView()}      
                <div className="row p-2" style={{height:"85%"}}>
                    <div className="col-12">
                        <NdGrid parent={this} id={"grid_" + this.props.id} 
                        dataSource={typeof this.state.data == 'undefined' ? undefined : this.state.data.store} 
                        showBorders={true} 
                        height={'100%'} 
                        width={'100%'}
                        onSelectionChanged={this._onSelectionChanged} 
                        onRowDblClick={this._onRowDblClick}
                        onRowPrepared={(e)=>
                        {
                            if(e.rowType == 'data' && e.data.STATUS == false)
                            {
                                e.rowElement.style.color ="Silver"
                            }
                            else if(e.rowType == 'data' && e.data.STATUS == true)
                            {
                                e.rowElement.style.color ="Black"
                            }
                        }}
                        filterRow={{visible:true}}
                        headerFilter={{visible:true}}
                        selection={this.state.selection}
                        loadPanel={{enabled:true}}
                        >                            
                            {(()=>
                                {
                                    let tmpArr = []
                                    for(let i = 0; i < this.state.columns.length; i++)
                                    {
                                        tmpArr.push(
                                            <Column key={this.state.columns[i].dataField} dataField={this.state.columns[i].dataField} 
                                            caption={this.props.parent.lang.t("popItemSelect." + this.state.columns[i].dataField)} 
                                            width={this.state.columns[i].width}
                                            sortOrder={this.state.columns[i].sortOrder}
                                            format={this.state.columns[i].format}/>
                                        )
                                    }
                                    return tmpArr
                                }
                            )()}
                        </NdGrid>
                    </div>
                </div>
            </NdPopUp>
        </React.Fragment>
        )
    }
}