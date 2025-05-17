import React from 'react';
import Base from './base.js';
import App from '../../../off/lib/app.js';
import DataGrid, { Column, Summary, TotalItem, Sorting, FilterRow, Export, GroupPanel, GroupItem } from 'devextreme-react/data-grid';


export default class NdOpenInvoiceReport extends Base {
  constructor(props) {
    super(props);
    this.state = {
      id: props.id || 'openInvoiceGrid',
      dataSource: props.dataSource || [],
      height: props.height || '600px',
      groupBy: props.groupBy 
    };
  }

  setDataSource(data) {
    this.setState({ dataSource: data });
  }

  render() {
    const dataSource = {
      store: this.state.dataSource,
      group: this.state.groupBy
    };
    
    return (
      <DataGrid
        id={this.state.id}
        dataSource={dataSource}
        showBorders={true}
        columnAutoWidth={true}
        rowAlternationEnabled={true}
        height={this.state.height}
        onRowDblClick={(e) => {
          if (e.rowType === 'data' && e.data && e.data.DOC_GUID) {
            App.instance.menuClick({
              id: 'ftr_02_002',
              text: this.t("menu"),
              path: 'invoices/documents/salesInvoice.js',
              pagePrm: { GUID: e.data.DOC_GUID }
            });
          }
        }}
        grouping={{
          autoExpandAll: false
        }}
      >
        <Sorting mode="multiple" />
        <FilterRow visible={true} />
        <Export enabled={true} allowExportSelectedData={true} />
        <GroupPanel visible={false} />
        
        <Column dataField="DOC_DATE" caption={this.t("grdListe.clmDate")} dataType="date" format="dd.MM.yyyy" />
        <Column dataField="INPUT_NAME" caption={this.t("grdListe.clmName")} groupIndex={0} />
        <Column dataField="DOC_REF" caption={this.t("grdListe.clmRef")} />
        <Column dataField="DOC_REF_NO" caption={this.t("grdListe.clmRefNo")} />
        <Column dataField="DOC_TOTAL" caption={this.t("grdListe.clmTotal")} 
          format={{ style: "currency", currency: Number.money ? Number.money.code : "EUR", precision: 2 }} 
          alignment="right"
        />
        <Column dataField="PAYING_AMOUNT" caption={this.t("grdListe.clmPaid")} 
          format={{ style: "currency", currency: Number.money ? Number.money.code : "EUR", precision: 2 }} 
          alignment="right" 
          cellRender={(cell) => {
            return <div style={{color: 'green'}}>{cell.text}</div>
          }}
        />
        <Column dataField="REMAINDER" caption={this.t("grdListe.clmRemainder")} 
          format={{ style: "currency", currency: Number.money ? Number.money.code : "EUR", precision: 2 }} 
          alignment="right"
          cellRender={(cell) => {
            return <div style={{color: 'red'}}>{cell.text}</div>
          }}
        />

        <Summary>
          <TotalItem
            column="DOC_TOTAL"
            summaryType="sum"
            valueFormat={{ style: "currency", currency: Number.money ? Number.money.code : "EUR", precision: 2 }}
          />
          <TotalItem
            column="PAYING_AMOUNT"
            summaryType="sum"
            valueFormat={{ style: "currency", currency: Number.money ? Number.money.code : "EUR", precision: 2 }}
          />
          <TotalItem
            column="REMAINDER"
            summaryType="sum"
            valueFormat={{ style: "currency", currency: Number.money ? Number.money.code : "EUR", precision: 2 }}
          />
          
          {/* Grup özetleri */}
          <GroupItem
            column="DOC_TOTAL"
            summaryType="sum"
            valueFormat={{ style: "currency", currency: Number.money ? Number.money.code : "EUR", precision: 2 }}
            showInGroupFooter={false}
            alignByColumn={true}
          />
          <GroupItem
            column="PAYING_AMOUNT"
            summaryType="sum"
            valueFormat={{ style: "currency", currency: Number.money ? Number.money.code : "EUR", precision: 2 }}
            showInGroupFooter={false}
            alignByColumn={true}
          />
          <GroupItem
            column="REMAINDER"
            summaryType="sum"
            valueFormat={{ style: "currency", currency: Number.money ? Number.money.code : "EUR", precision: 2 }}
            showInGroupFooter={false}
            alignByColumn={true}
          />
          <GroupItem
            column="DOC_TOTAL"
            summaryType="count"
            displayFormat="{0}"
          />
        </Summary>
      </DataGrid>
    );
  }
} 