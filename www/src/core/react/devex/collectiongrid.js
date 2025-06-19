import React from 'react';
import Base from './base.js';
import moment from 'moment';
import DataGrid, { Column, MasterDetail, Summary, TotalItem } from 'devextreme-react/data-grid';

export default class NdCollectionGrid extends Base {
  constructor(props) {
    super(props);
    this.state = {
      id: props.id || 'collectionGrid',
      dataSource: props.dataSource || [],
      height: props.height || '600px'
    };
  }

  setDataSource(data) {
    let groupedData = this.props.group ? this.props.group(data) : data;
    this.setState({ dataSource: groupedData });
  }

  renderDetailGrid = (e) => {
    let facturas = e.data?.data?.FACTURAS ?? [];
    const tahsilatAmount = e.data?.data?.AMOUNT || 0;

    if (facturas.length === 0) {
      return (
        <div style={{ padding: '16px', fontStyle: 'italic', color: '#888' }}>
          {this.t("noData")}
        </div>
      );
    }

    return (
      <div>
        <style>{`
          .collection-summary-positive { color: green !important; }
          .collection-summary-negative { color: red !important; }
          .collection-summary-neutral { color: black !important; }
        `}</style>
        <DataGrid
          dataSource={facturas}
          showBorders={true}
          columnAutoWidth={true}
          rowAlternationEnabled={true}
          height="auto"
          onContentReady={(gridEvent) => {
            // Summary satırını renklendir
            setTimeout(() => {
              const summaryItems = gridEvent.component.element().querySelectorAll('.dx-datagrid-summary-item');
              summaryItems.forEach(item => {
                const text = item.textContent || '';
                if (text.includes(this.t("explanation"))) {
                  // Doğru tahsilat miktarını al
                  const amount = tahsilatAmount;
                  const factTotal = facturas.reduce((sum, item) => sum + (item.FACT_TOTAL || 0), 0);
                  const difference = amount - factTotal;
                  
                  if (Math.abs(difference) < 0.01) {
                    item.className += ' collection-summary-neutral';
                  } else if (difference < 0) {
                    item.className += ' collection-summary-positive';
                  } else {
                    item.className += ' collection-summary-negative';
                  }
                }
              });
            }, 100);
          }}
        >
          <Column dataField="FACT_DATE" caption={this.t("FACT_DATE")} dataType="date" format="dd.MM.yyyy" />
          <Column dataField="CUSTOMER_NAME" caption={this.t("CUSTOMER_NAME")} />
          <Column dataField="FACT_REF" caption={this.t("FACT_REF")} />
          <Column dataField="FACT_REF_NO" caption={this.t("FACT_REF_NO")} />
          <Column dataField="FACT_TYPE_NAME" caption={this.t("FACT_TYPE_NAME")} />
          <Column dataField="FACT_AMOUNT" caption={this.t("FACT_AMOUNT")} format={{ style: 'currency', currency: 'EUR', useGrouping: true, minimumFractionDigits: 2  }} />
          <Column dataField="FACT_TOTAL" caption={this.t("FACT_TOTAL")} format={{ style: 'currency', currency: 'EUR', useGrouping: true, minimumFractionDigits: 2  }} />
          <Summary>
            <TotalItem
              column="FACT_TOTAL"
              summaryType="sum"
              valueFormat={{ type: 'fixedPoint', precision: 2 }}
              alignment="right"
              showInColumn="FACT_TOTAL"
              customizeText={(data) => {
                const factTotal = data.value || 0;
                const amount = tahsilatAmount;
                const difference = factTotal - amount;
                
                // Formatları düzelt
                const factTotalFormatted = new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'EUR', useGrouping: true, minimumFractionDigits: 2 }).format(factTotal);
                const tahsilatFormatted = new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'EUR', useGrouping: true, minimumFractionDigits: 2 }).format(amount);
                const formattedDifference = new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'EUR', useGrouping: true, minimumFractionDigits: 2 }).format(difference);
                
                return `${this.t("factTotal")}: ${factTotalFormatted} | ${this.t("factPayment")}: ${tahsilatFormatted} | ${this.t("explanation")}: ${formattedDifference}`;
              }}
            />  
          </Summary>
        </DataGrid>
      </div>
    );
  };

  render() {
    return (
      <DataGrid
        id={this.state.id}
        dataSource={this.state.dataSource}
        showBorders={true}
        columnAutoWidth={true}
        rowAlternationEnabled={true}
        height={this.state.height}
        keyExpr="TAH_KEY"
      >
        <Column dataField="TAH_DATE" caption={this.t("TAH_DATE")} dataType="date" format="dd.MM.yyyy" />
        <Column dataField="CUSTOMER_NAME" caption={this.t("CUSTOMER_NAME")} />
        <Column dataField="TAH_REF_NO" caption={this.t("TAH_REF_NO")} />
        <Column dataField="TAH_PAY_TYPE" caption={this.t("TAH_PAY_TYPE")} />
        <Column dataField="BANK_NAME" caption={this.t("BANK_NAME")} />
        <Column dataField="AMOUNT" caption={this.t("AMOUNT")} format={{ style: 'currency', currency: 'EUR', useGrouping: true, minimumFractionDigits: 2  }} />
        <MasterDetail enabled={true} component={this.renderDetailGrid} />
      </DataGrid>
    );
  }
}

export function groupCollection(rows) {
  let map = new Map();

  for (let row of rows) {
    let key = `${row.TAH_REF}|${row.TAH_REF_NO}|${new Date(row.TAH_DATE).toISOString().split('T')[0]}`;
    if (!map.has(key)) {
      map.set(key, {
        TAH_KEY: key,
        TAH_DATE: row.TAH_DATE,
        TAH_REF: row.TAH_REF,
        TAH_REF_NO: row.TAH_REF_NO,
        BANK_NAME: row.BANK_NAME,
        TAH_PAY_TYPE: row.TAH_PAY_TYPE,
        AMOUNT: row.AMOUNT,
        CUSTOMER_NAME: row.CUSTOMER_NAME,
        FACTURAS: []
      });
    }

    let factura = {
      FACT_DATE: row.FACT_DATE,
      FACT_REF: row.FACT_REF,
      FACT_REF_NO: row.FACT_REF_NO,
      FACT_AMOUNT: row.FACT_AMOUNT,
      FACT_TYPE_NAME: row.FACT_TYPE_NAME,
      FACT_VAT: row.FACT_VAT,
      FACT_TOTAL: row.FACT_TOTAL,
      CUSTOMER_NAME: row.CUSTOMER_NAME
    };

    map.get(key).FACTURAS.push(factura);
  }

  let result = Array.from(map.values());
  return result;
}



