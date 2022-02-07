import React from 'react';
import NdPopUp from './popup.js';
import NdGrid,{Column,ColumnChooser,ColumnFixing,Pager,Paging,Scrolling,Selection,Editing,FilterRow,SearchPanel,HeaderFilter,Popup,Toolbar,Item} from './grid.js';
import NdButton from './button.js';
import Base from './base.js';
import { access,param } from '../../core.js';

export default class NdPopGrid extends Base
{
    constructor(props)
    {
        super(props);
        
        this.state.show = typeof props.visible == 'undefined' ? false : props.visible
        this.state.closeOnOutsideClick = typeof props.closeOnOutsideClick == 'undefined' ? false : props.closeOnOutsideClick
        this.state.showCloseButton = typeof props.showCloseButton == 'undefined' ? true : props.showCloseButton
        this.state.showTitle = typeof props.showTitle == 'undefined' ? false : props.showTitle
        this.state.title = typeof props.title == 'undefined' ? '' : props.title
        this.state.container = typeof props.container == 'undefined' ? undefined : props.container
        this.state.width = typeof props.width == 'undefined' ? 'auto' : props.width
        this.state.height = typeof props.height == 'undefined' ? 'auto' : props.height
        this.state.position = typeof props.position == 'undefined' ? undefined : props.position
        
        this.state.columns = typeof props.columns == 'undefined' ? undefined : props.columns
        this.state.filterRow = typeof props.filterRow == 'undefined' ? {visible:true} : props.filterRow
        this.state.headerFilter = typeof props.headerFilter == 'undefined' ? {visible:true} : props.headerFilter
        this.state.selection = typeof props.selection == 'undefined' ? {mode:"single"} : props.selection
        this.state.paging = typeof props.paging == 'undefined' ? {} : props.paging
        this.state.pager = typeof props.pager == 'undefined' ? {} : props.pager
        this.state.editing = typeof props.editing == 'undefined' ? {} : props.editing

        this._onHiding = this._onHiding.bind(this);
        this._onSelectionChanged = this._onSelectionChanged.bind(this);
        this._onClick = this._onClick.bind(this);
        this._onRowDblClick = this._onRowDblClick.bind(this);

        this.access = {}
        this.param = {}
        //POPGRID İÇİN YETKİ DEĞERLERİ HAZIRLANIYOR.
        if(typeof this.props.access != 'undefined')
        {
            if(typeof this.props.access.getValue().btn != 'undefined')
            {
                let tmp = new access()
                tmp.add({VALUE:this.props.access.getValue().btn})
                this.access.btn = tmp
            }
            if(typeof this.props.access.getValue().grid != 'undefined')
            {
                let tmp = new access()
                tmp.add({VALUE:this.props.access.getValue().grid})
                this.access.grid = tmp
            }
        }
        //*************************************** */
        //POPGRID İÇİN PARAMETRE DEĞERLERİ HAZIRLANIYOR.
        if(typeof this.props.param != 'undefined')
        {
            if(typeof this.props.param.getValue().btn != 'undefined')
            {
                let tmp = new param()
                tmp.add({VALUE:this.props.param.getValue().btn})
                this.param.btn = tmp
            }
            if(typeof this.props.param.getValue().grid != 'undefined')
            {
                let tmp = new param()
                tmp.add({VALUE:this.props.param.getValue().grid})
                this.param.grid = tmp
            }
        }
        //******************************************* */
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
    _buttonView()
    {
        if(typeof this.props.button != 'undefined')
        {
            let tmp = []
            for (let i = 0; i < this.props.button.length; i++) 
            {
                tmp.push (
                    <Item key={i} location="after" locateInMenu="auto">
                        <NdButton  id={"btn_" + this.props.button[i].id} location="after" 
                        type="normal"
                        icon={this.props.button[i].icon}
                        stylingMode={"contained"}
                        onClick={this.props.button[i].onClick}
                        >
                        </NdButton>
                    </Item>
                )
            }   
            return (
            <div className="row">
                <div className="col-12 py-2">
                    <Toolbar>
                        {tmp}
                    </Toolbar>
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
        this.hide();
    }
    _onClick()
    {
        if(this.grid.getSelectedData().length > 0)
        {
            this.hide()
            this.onClick(this.grid.getSelectedData())
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
    //#endregion
    async componentDidMount()
    {
        this.popup = this["pop_" + this.props.id];
        this.grid = await this._isGrid();
    }
    setTitle(pVal)
    {
        this.popup.setTitle(pVal)
    }    
    async show()
    {
        //this.setState({show:true})
        this["pop_" + this.props.id].show();
        this.grid = await this._isGrid();
        await this.grid.dataRefresh(this.state.data)
    }
    hide()
    {
        this["pop_" + this.props.id].hide();
        //this.setState({show:false})
    }
    componentWillReceiveProps(pProps) 
    {
        // this.setState(
        //     {
        //         show : pProps.visible,
        //     }
        // )       
    }  
    render()
    {
        return (
            <React.Fragment>
                <NdPopUp parent={this} id={"pop_" + this.props.id} 
                    //visible={this.state.show}
                    onHiding={this._onHiding}                   
                    closeOnOutsideClick={this.state.closeOnOutsideClick}
                    showCloseButton={this.state.showCloseButton}
                    showTitle={this.state.showTitle}
                    title={this.state.title}
                    container={this.state.container}
                    width={this.state.width}
                    height={this.state.height}
                    position={this.state.position}
                >
                    {this._buttonView()}                 
                    <div className="row">
                        <div className="col-12 py-2">
                            <NdButton parent={this} id={"btn_" + this.props.id} text={this.lang.t('popGrid.btnSelection')} width={'100%'} type={"default"}
                                onClick={this._onClick}
                                param={this.param.btn} 
                                access={this.access.btn} 
                            />
                        </div>
                    </div>
                    <div className="row" style={{height:"89%"}}>
                        <div className="col-12">
                            <NdGrid parent={this} id={"grid_" + this.props.id} 
                            dataSource={typeof this.state.data == 'undefined' ? undefined : this.state.data.store} 
                            columnWidth={this.props.columnWidth}
                            showBorders={this.props.showBorders} 
                            columnsAutoWidth={this.props.columnsAutoWidth} 
                            allowColumnReordering={this.props.allowColumnReordering} 
                            allowColumnResizing={this.props.allowColumnResizing} 
                            height={'100%'} 
                            width={'100%'}
                            onSelectionChanged={this._onSelectionChanged} 
                            onRowDblClick={this._onRowDblClick}
                            columns={this.state.columns}
                            filterRow={this.state.filterRow}
                            headerFilter={this.state.headerFilter}
                            selection={this.state.selection}
                            paging={this.state.paging}
                            pager={this.state.pager}
                            editing={this.state.editing}  
                            param={this.param.grid} 
                            access={this.access.grid}
                            >                            
                            {this.props.children}
                            </NdGrid>
                        </div>
                    </div>
                </NdPopUp>
            </React.Fragment>
        )
    }
}