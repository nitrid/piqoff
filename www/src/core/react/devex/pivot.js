import React from 'react';
import Base from './base.js';
import PivotGrid,{FieldChooser,Export,StateStoring,PivotGridTypes} from 'devextreme-react/pivot-grid';
import PivotGridDataSource from 'devextreme/ui/pivot_grid/data_source';
import { Workbook } from 'exceljs';
import { exportPivotGrid } from 'devextreme/excel_exporter';

export {FieldChooser,Export,StateStoring}
export default class NdPivot extends Base
{
    constructor(props)
    {
        super(props)

        this.state = 
        {
            id : props.id,
            dataSource : props.dataSource,
            fields : props.fields,
            allowSortingBySummary : props.allowSortingBySummary,
            allowFiltering : props.allowFiltering,
            showBorders : props.showBorders,
            showColumnTotals : props.showColumnTotals,
            showColumnGrandTotals : props.showColumnGrandTotals,
            showRowTotals : props.showRowTotals,
            showRowGrandTotals : props.showRowGrandTotals,
        } 
    }

    onExporting = (e) => 
    {
        const workbook = new Workbook();
        const worksheet = workbook.addWorksheet('Sales');
      
        exportPivotGrid({
          component: e.component,
          worksheet,
        })
        .then(() => 
        {
            workbook.xlsx.writeBuffer().then((buffer) => 
            {
            saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'Sales.xlsx');
            });
        });
    };
    setDataSource(pData,pField)
    {
        this.setState(
        {
            dataSource : new PivotGridDataSource(
                {
                    retrieveFields: false,
                    fields: typeof pField == 'undefined' ? this.state.fields : pField,
                    store:pData
                }
            )
        })
    }
    render()
    {
        return(
            <PivotGrid
            id={this.state.id}
            dataSource={this.state.dataSource}
            allowSortingBySummary={this.state.allowSortingBySummary}
            allowFiltering={this.state.allowFiltering}
            showBorders={this.state.showBorders}
            showColumnTotals={this.state.showColumnTotals}
            showColumnGrandTotals={this.state.showColumnGrandTotals}
            showRowTotals={this.state.showRowTotals}
            showRowGrandTotals={this.state.showRowGrandTotals}
            onCellPrepared={this.props.onCellPrepared}
            height={this.props.height}
            onExporting={this.onExporting}
            >
                {this.props.children}
            </PivotGrid>
        )
    }
}