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

    // CSS stillerini ekle
    let style = document.createElement('style');
    style.innerHTML = `
      .summary-total, .group-total {
        font-weight: bold;
        color: #333;
        background-color: #f5f5f5;
      }
      .summary-paid, .group-paid {
        font-weight: bold;
        color: green;
        background-color: #f0fff0;
      }
      .summary-remainder, .group-remainder {
        font-weight: bold;
        color: red;
        background-color: #fff0f0;
      }
      .summary-green, .group-green {
        font-weight: bold;
        color: green;
        background-color: #f0fff0;
      }
      
      /* Grup başlıkları için stil */
      .dx-datagrid-group-row {
        background-color: #e6e6e6 !important;
        border-top: 2px solid #999 !important;
        border-bottom: 2px solid #999 !important;
        margin-top: 10px !important;
        margin-bottom: 10px !important;
      }
      
      /* Grup başlığı içeriği */
      .dx-datagrid-group-row .dx-group-row-content {
        color: #003366 !important;
        font-weight: bold !important;
        font-size: 12px !important;
        padding: 8px 0 !important;
        text-align: left !important;
        margin-left: 0 !important;
      }
      
      /* Grup başlığı hücresinin kendisi */
      .dx-datagrid-group-row td {
        padding-left: 0 !important;
      }
      
      /* Grup başlığı genişletildiğinde sonraki grup başlığı için boşluk */
      .dx-datagrid-group-opened + tr + .dx-datagrid-group-row {
        margin-top: 20px !important;
      }
      
      /* Grup içeriği ile grup başlığı arasında boşluk */
      .dx-datagrid-group-opened + tr {
        border-top: 1px solid #ddd !important;
      }
      
      /* Grup içeriği ile sonraki grup başlığı arasında boşluk */
      .dx-datagrid-rowsview .dx-row:not(.dx-group-row) + .dx-group-row {
        margin-top: 15px !important;
      }
      
      /* Alternatif satır renkleri */
      .dx-datagrid-rowsview .dx-row-alt {
        background-color: #f9f9f9 !important;
      }
      
      /* Grup içindeki satırlar için stil */
      .dx-datagrid-group-opened + tr .dx-data-row {
        border-bottom: 1px solid #eee !important;
      }
    `;
    document.head.appendChild(style);
    
    // DataGrid referansı için
    this.devGrid = null;

    // Seçili satırları saklamak için
    this.selectedRows = [];
  }

  setDataSource(data) {
    this.setState({ dataSource: data });
  }

  getSelectedData() {
    if (this.devGrid && this.devGrid.instance) {
      return this.devGrid.instance.getSelectedRowsData();
    }
    return [];
  }

  render() {
    let processedData = this.state.dataSource.map(item => {
      // satis input, iade output
      let displayName = (item.TYPE == 1 && item.REBATE == 0) ? item.INPUT_NAME : item.OUTPUT_NAME;
      let docTotal = item.DOC_TOTAL;
      let payingAmount = item.PAYING_AMOUNT;
      let remainder = item.REMAINDER;

      if (item.REBATE == 1) {
        // iade için değerler negatif
        docTotal = -Math.abs(docTotal);
        payingAmount = -Math.abs(payingAmount);
        remainder = -Math.abs(remainder);
      }

      return {
        ...item,
        DISPLAY_NAME: displayName || item.INPUT_NAME,
        DISPLAY_DOC_TOTAL: docTotal,
        DISPLAY_PAYING_AMOUNT: payingAmount,
        DISPLAY_REMAINDER: remainder,
        IS_REBATE: item.REBATE == 1,
        INVOICE_TYPE: item.REBATE == 1 ? 'Retour' : 'Facture Ouverte'
      };
    });

    let totalRemainder = 0;
    processedData.forEach(item => {
      totalRemainder += item.DISPLAY_REMAINDER || 0;
    });

    let groupTotals = {};
    processedData.forEach(item => {
      let key = item.DISPLAY_NAME;
      if (!groupTotals[key]) {
        groupTotals[key] = 0;
      }
      groupTotals[key] += item.DISPLAY_REMAINDER || 0;
    });

    let groupCounts = {};
    processedData.forEach(item => {
      let key = item.DISPLAY_NAME;
      if (!groupCounts[key]) {
        groupCounts[key] = 0;
      }
      groupCounts[key]++;
    });

    let dataSource = {
      store: processedData,
      group: [{ selector: 'DISPLAY_NAME' }]
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
            if (e.data.REBATE == 1) {
              App.instance.menuClick({
                id: 'ftr_02_003',
                text: this.t("menu"),
                path: 'invoices/documents/rebatePurcInvoice.js',
                pagePrm: { GUID: e.data.DOC_GUID }
              });
            } else {
              App.instance.menuClick({
                id: 'ftr_02_002',
                text: this.t("menu"),
                path: 'invoices/documents/salesInvoice.js',
                pagePrm: { GUID: e.data.DOC_GUID }
              });
            }
          }
        }}
        grouping={{
          autoExpandAll: false
        }}
        selection={{
          mode: 'multiple',
          showCheckBoxesMode: 'always'
        }}
        ref={(ref) => { this.devGrid = ref; }}
      >
        <Sorting mode="multiple" />
        <FilterRow visible={true} />
        <Export enabled={true} allowExportSelectedData={true} />
        <GroupPanel visible={false} />

        <Column dataField="DOC_DATE" caption={this.t("grdListe.clmDate")} dataType="date" format="dd.MM.yyyy" width={100} />
        <Column 
          dataField="DISPLAY_NAME" 
          caption={this.t("grdListe.clmCustomer")} 
          groupIndex={0}
          alignment="left"
          groupCellTemplate={(cellElement, cellInfo) => {
            let groupName = cellInfo.text;
            let count = groupCounts[groupName];
            
            // Özel HTML oluştur - sola yapışık stil
            let html = `
              <div style="color: #003366; font-weight: bold; font-size: 12px; background-color: #e6e6e6; padding: 8px; border-radius: 4px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); text-align: left; margin-left: 0;">
                ${groupName} (${this.t('grdListe.clmCount')}: ${count})
              </div>
            `;
            cellElement.innerHTML = html;
          }}
        />
        <Column dataField="DOC_REF" caption={this.t("grdListe.clmRef")} width={100} />
        <Column dataField="DOC_REF_NO" caption={this.t("grdListe.clmRefNo")} width={100} />
        <Column dataField="INVOICE_TYPE" caption={this.t("grdListe.clmRebate")} 
          lookup={{
            dataSource: [
              { value: 'Facture Ouverte', text: this.t("grdListe.clmNormal") },
              { value: 'Retour', text: this.t("grdListe.clmRebateFact") }
            ],
            valueExpr: 'value',
            displayExpr: 'text'
          }}
          cellRender={(cell) => {
            return cell.data.REBATE == 1 ? 
              <div style={{ color: 'red', fontWeight: 'bold' }}>{this.t("grdListe.clmRebateFact")}</div> : 
              <div>{this.t("grdListe.clmNormal")}</div>;
          }}
        />
        <Column dataField="DISPLAY_DOC_TOTAL" caption={this.t("grdListe.clmTotal")}
          format={{ style: "currency", currency: Number.money ? Number.money.code : "EUR", precision: 2 }}
          alignment="right"
          cellRender={(cell) => {
            let style = cell.data.IS_REBATE ? { color: 'red' } : {};
            return <div style={style}>{cell.text}</div>;
          }}
        />
        <Column dataField="DISPLAY_PAYING_AMOUNT" caption={this.t("grdListe.clmPaid")}
          format={{ style: "currency", currency: Number.money ? Number.money.code : "EUR", precision: 2 }}
          alignment="right"
          cellRender={(cell) => {
            let style = cell.data.IS_REBATE ? { color: 'red' } : { color: 'green' };
            return <div style={style}>{cell.text}</div>;
          }}
        />
        <Column dataField="DISPLAY_REMAINDER" caption={this.t("grdListe.clmRemainder")}
          format={{ style: "currency", currency: Number.money ? Number.money.code : "EUR", precision: 2 }}
          alignment="right"
          cellRender={(cell) => {
            if (cell.data.IS_REBATE || cell.data.DISPLAY_REMAINDER < 0) {
              return <div style={{ color: 'green' }}>{cell.text}</div>;
            }
            return <div>{cell.text}</div>;
          }}
        />

        <Summary>
          <TotalItem
            column="DISPLAY_DOC_TOTAL"
            summaryType="sum"
            valueFormat={{ style: "currency", currency: Number.money ? Number.money.code : "EUR", precision: 2 }}
            displayFormat={this.t('grdListe.clmTotal') + ": {0}"}
            showInGroupFooter={false}
            alignByColumn={true}
            cssClass="summary-total"
          />
          <TotalItem
            column="DISPLAY_PAYING_AMOUNT"
            summaryType="sum"
            valueFormat={{ style: "currency", currency: Number.money ? Number.money.code : "EUR", precision: 2 }}
            displayFormat={this.t('grdListe.clmPaid') + ": {0}"}
            showInGroupFooter={false}
            alignByColumn={true}
            cssClass="summary-paid"
          />
          <TotalItem
            column="DISPLAY_REMAINDER"
            summaryType="sum"
            valueFormat={{ style: "currency", currency: Number.money ? Number.money.code : "EUR", precision: 2 }}
            displayFormat={this.t('grdListe.clmRemainder') + ": {0}"}
            showInGroupFooter={false}
            alignByColumn={true}
            cssClass={totalRemainder < 0 ? "summary-green" : "summary-remainder"}
          />
          <TotalItem
            column="DOC_GUID"
            summaryType="count"
            displayFormat="this.t('grdListe.clmCount'): {0}"
            cssClass="summary-count"
          />
          <GroupItem
            column="DISPLAY_DOC_TOTAL"
            summaryType="sum"
            valueFormat={{ style: "currency", currency: Number.money ? Number.money.code : "EUR", precision: 2 }}
            displayFormat={this.t('grdListe.clmTotal') + ": {0}"}
            alignByColumn={true}
            cssClass="group-total"
          />
          <GroupItem
            column="DISPLAY_PAYING_AMOUNT"
            summaryType="sum"
            valueFormat={{ style: "currency", currency: Number.money ? Number.money.code : "EUR", precision: 2 }}
            displayFormat={this.t('grdListe.clmPaid') + ": {0}"}
            alignByColumn={true}
            cssClass="group-paid"
          />
          <GroupItem
            column="DISPLAY_REMAINDER"
            summaryType="sum"
            valueFormat={{ style: "currency", currency: Number.money ? Number.money.code : "EUR", precision: 2 }}
            displayFormat={this.t('grdListe.clmRemainder') + ": {0}"}
            alignByColumn={true}
            cssClass="group-remainder"
          />
          <GroupItem
            column="DOC_GUID"
            summaryType="count"
            displayFormat={this.t('grdListe.clmCount') + ": {0}"}
            cssClass="group-count"
          />
        </Summary>
      </DataGrid>
    );
  }
} 