import React from 'react';
import DataGrid,{Column,ColumnChooser,ColumnFixing,Pager,Paging,Scrolling,Selection,Editing,FilterRow,SearchPanel,HeaderFilter,Popup,KeyboardNavigation} from 'devextreme-react/data-grid';
import Toolbar,{Item} from 'devextreme-react/toolbar';
import Base from './base.js';

export {Column,ColumnChooser,ColumnFixing,Pager,Paging,Scrolling,Selection,Editing,FilterRow,SearchPanel,HeaderFilter,Popup,Toolbar,Item,KeyboardNavigation}
export default class NdGrid extends Base
{
    constructor(props)
    {
        super(props);
        
        this.devGrid = null;
        
        this.state.columns = typeof props.columns == 'undefined' ? undefined : props.columns
        this.state.filterRow = typeof props.filterRow == 'undefined' ? {} : props.filterRow
        this.state.headerFilter = typeof props.headerFilter == 'undefined' ? {} : props.headerFilter
        this.state.selection = typeof props.selection == 'undefined' ? {} : props.selection

        this._onInitialized = this._onInitialized.bind(this);
        this._onSelectionChanged = this._onSelectionChanged.bind(this);
        this._onInitNewRow = this._onInitNewRow.bind(this);
        this._onEditingStart = this._onEditingStart.bind(this);
        this._onRowInserting = this._onRowInserting.bind(this);
        this._onRowInserted = this._onRowInserted.bind(this);
        this._onRowUpdated = this._onRowUpdated.bind(this);
        this._onRowUpdating = this._onRowUpdating.bind(this);
        this._onRowRemoving = this._onRowRemoving.bind(this);
        this._onRowRemoved = this._onRowRemoved.bind(this);
        this._onSaving = this._onSaving.bind(this);
        this._onSaved = this._onSaved.bind(this);
        this._onEditCanceling = this._onEditCanceling.bind(this);
        this._onEditCanceled = this._onEditCanceled.bind(this);
        this._onCellPrepared = this._onCellPrepared.bind(this);   
        this._onRowDblClick = this._onRowDblClick.bind(this);      
        this._onEditorPrepared = this._onEditorPrepared.bind(this);
        this._onRowPrepared = this._onRowPrepared.bind(this);
    }
    //#region Private
    _onInitialized(e) 
    {
        this.devGrid = e.component;
    }    
    _onSelectionChanged(e) 
    {
        if(typeof this.props.onSelectionChanged != 'undefined')
        {
            this.props.onSelectionChanged(e);
        }
    }
    _onInitNewRow(e)
    {
        if(typeof this.props.onInitNewRow != 'undefined')
        {
            this.props.onInitNewRow(e);
        }
    }
    _onEditingStart(e)
    {
        if(typeof this.props.onEditingStart != 'undefined')
        {
            this.props.onEditingStart(e);
        }
    }
    async _onRowInserting(e)
    {
        if(typeof this.props.onRowInserting != 'undefined')
        {
            this.props.onRowInserting(e);
        }
    }
    async _onRowInserted(e)
    {
        if(typeof this.props.onRowInserted != 'undefined')
        {
            this.props.onRowInserted(e);
        }                               
    }    
    async _onRowUpdating(e)
    {
        if(typeof this.props.onRowUpdating != 'undefined')
        {
            this.props.onRowUpdating(e);
        }             
    }
    async _onRowUpdated(e)
    {
        if(typeof this.props.onRowUpdated != 'undefined')
        {
            this.props.onRowUpdated(e);
        }
    }
    _onRowRemoving(e)
    {
        if(typeof this.props.onRowRemoving != 'undefined')
        {
            this.props.onRowRemoving(e);
        }
    }
    _onRowRemoved(e)
    {
        if(typeof this.props.onRowRemoved != 'undefined')
        {
            this.props.onRowRemoved(e);
        }
    }
    _onSaving(e)
    {
        if(typeof this.props.onSaving != 'undefined')
        {
            this.props.onSaving(e);
        }
    }
    _onSaved(e)
    {
        if(typeof this.props.onSaved != 'undefined')
        {
            this.props.onSaved(e);
        }
    }
    _onEditCanceling(e)
    {
        if(typeof this.props.onEditCanceling != 'undefined')
        {
            this.props.onEditCanceling(e);
        }
    }
    _onEditCanceled(e)
    {
        if(typeof this.props.onEditCanceled != 'undefined')
        {
            this.props.onEditCanceled(e);
        }
    }
    _onCellPrepared(e)
    {
        if(typeof this.props.onCellPrepared != 'undefined')
        {
            this.props.onCellPrepared(e);
        }
    }
    _onRowDblClick(e)
    {
        if(typeof this.props.onRowDblClick != 'undefined')
        {
            this.props.onRowDblClick(e);
        }
    }
    _onEditorPrepared(e)
    {
        if(typeof this.props.onEditorPrepared != 'undefined')
        {
            this.props.onEditorPrepared(e);
        }             
    }
    _onRowPrepared(e)
    {
        if(typeof this.props.onRowPrepared != 'undefined')
        {
            this.props.onRowPrepared(e);
        }  
    }
    //#endregion
    componentDidUpdate()
    {
        setTimeout(() => 
        {
            if(typeof this.data != 'undefined' && typeof this.data.datatable != 'undefined' && (typeof arguments[1].data == 'undefined' || typeof arguments[1].data.datatable == 'undefined'))
            {
                this.data.datatable.on('onEdit',(e) =>
                {  
                    this.devGrid.refresh()
                });
                this.data.datatable.on('onNew',(e) =>
                {           
                    this.devGrid.refresh()
                });
                this.data.datatable.on('onRefresh',() =>
                {
                    this.devGrid.refresh()
                });
                this.data.datatable.on('onClear',() =>
                {
                    this.devGrid.refresh()
                });
            }
        }, 100);
    }
    async componentDidMount() 
    {        
        // KOLON ÜZERİNDEKİ YETKİLENDİRME DEĞERLERİNİN SET EDİLİYOR. 
        let tmpColmnAcs = null;
        if(typeof this.props.access != 'undefined' && typeof this.props.access.getValue() != 'undefined' && typeof this.props.access.getValue().columns != 'undefined')
        {            
            tmpColmnAcs = this.props.access.getValue().columns;
            for (let i = 0; i < Object.keys(tmpColmnAcs).length; i++) 
            {
                if(typeof tmpColmnAcs[Object.keys(tmpColmnAcs)[i]].visible != 'undefined')
                {
                    this.devGrid.columnOption(Object.keys(tmpColmnAcs)[i],'visible',tmpColmnAcs[Object.keys(tmpColmnAcs)[i]].visible)
                }
                if(typeof tmpColmnAcs[Object.keys(tmpColmnAcs)[i]].editable != 'undefined')
                {
                    this.devGrid.columnOption(Object.keys(tmpColmnAcs)[i],'allowEditing',tmpColmnAcs[Object.keys(tmpColmnAcs)[i]].editable)
                }
            }
        }
        //********************************************************/        
        if(typeof this.state.data != 'undefined')
        {
            await this.dataRefresh(this.state.data)                 
        }
    }
    componentWillReceiveProps(pProps) 
    {
        this.setState(
            {
                columnWidth : pProps.columnWidth,
                showBorders : pProps.showBorders,
                columnsAutoWidth : pProps.columnsAutoWidth,
                allowColumnReordering : pProps.allowColumnReordering,
                allowColumnResizing : pProps.allowColumnResizing,
                editOnKeyPress : pProps.editOnKeyPress,
                enterKeyAction : pProps.enterKeyAction,
                enterKeyDirection : pProps.enterKeyDirection,
            }
        )
    }  
    getSelectedData()
    {
        return this.devGrid.getSelectedRowsData()
    }
    render()
    {
        // YETKİLENDİRMEDEN GELEN GÖRÜNÜR GÖRÜNMEZ DURUMU. DEĞER BASE DEN GELİYOR.
        if(this.state.visible == false)
        {
            return <div></div>
        }
        
        if(typeof this.state.columns == 'undefined')
        {
            return (
                <DataGrid id={this.props.id} dataSource={typeof this.state.data == 'undefined' ? undefined : this.state.data.store} 
                showBorders={this.props.showBorders} 
                columnWidth={this.props.columnWidth} 
                columnAutoWidth={this.props.columnAutoWidth} 
                allowColumnReordering={this.props.allowColumnReordering} 
                allowColumnResizing={this.props.allowColumnResizing} 
                showRowLines={typeof this.props.showRowLines == 'undefined' ? true : this.props.showRowLines}
                showColumnLines={typeof this.props.showColumnLines == 'undefined' ? true : this.props.showColumnLines}
                showColumnHeaders={this.props.showColumnHeaders}
                height={this.props.height} 
                width={this.props.width}
                onInitialized={this._onInitialized} onSelectionChanged={this._onSelectionChanged} 
                onInitNewRow={this._onInitNewRow} onEditingStart={this._onEditingStart} onRowInserting={this._onRowInserting} onRowInserted={this._onRowInserted}
                onRowUpdating={this._onRowUpdating} onRowUpdated={this._onRowUpdated} onRowRemoving={this._onRowRemoving} onRowRemoved={this._onRowRemoved}
                onSaving={this._onSaving} onSaved={this._onSaved} onEditCanceling={this._onEditCanceling} onEditCanceled={this._onEditCanceled}
                onCellPrepared={this._onCellPrepared} onRowDblClick={this._onRowDblClick}
                filterRow={this.state.filterRow}
                headerFilter={this.state.headerFilter}
                selection={this.state.selection}
                onEditorPrepared={this._onEditorPrepared}
                onRowPrepared = {this._onRowPrepared}
                >
                    {this.props.children}
                </DataGrid>
            )            
        }
        else
        {
            return (
                <DataGrid id={this.props.id} dataSource={typeof this.state.data == 'undefined' ? undefined : this.state.data.store}
                    showBorders={this.props.showBorders} 
                    columnWidth={this.props.columnWidth}
                    columnAutoWidth={this.props.columnAutoWidth} 
                    allowColumnReordering={this.props.allowColumnReordering} 
                    allowColumnResizing={this.props.allowColumnResizing} 
                    height={this.props.height} 
                    width={this.props.width}
                    onInitialized={this._onInitialized} onSelectionChanged={this._onSelectionChanged} 
                    onInitNewRow={this._onInitNewRow} onEditingStart={this._onEditingStart} onRowInserting={this._onRowInserting} onRowInserted={this._onRowInserted}
                    onRowUpdating={this._onRowUpdating} onRowUpdated={this._onRowUpdated} onRowRemoving={this._onRowRemoving} onRowRemoved={this._onRowRemoved} 
                    onSaving={this._onSaving} onSaved={this._onSaved} onEditCanceling={this._onEditCanceling} onEditCanceled={this._onEditCanceled}
                    columns={this.state.columns}
                    filterRow={this.state.filterRow}
                    headerFilter={this.state.headerFilter}
                    selection={this.state.selection}
                    onEditorPrepared={this._onEditorPrepared}
                    onRowPrepared = {this._onRowPrepared}
                    >
                        {this.props.children}
                </DataGrid>
            )
        }
    }
}