import React from 'react';
import App from '../../../lib/app.js';
import moment from 'moment';

import Toolbar from 'devextreme-react/toolbar';
import Form, {Item, Label, EmptyItem} from 'devextreme-react/form';
import ScrollView from 'devextreme-react/scroll-view';
import { dialog } from '../../../../core/react/devex/dialog.js';
import TabPanel, { Item as TabItem } from 'devextreme-react/tab-panel';

import NdGrid,{Column, ColumnChooser,StateStoring,Paging,Pager,Scrolling,Export, Summary, TotalItem} from '../../../../core/react/devex/grid.js';
import NdTextBox from '../../../../core/react/devex/textbox.js';
import NdPopUp from '../../../../core/react/devex/popup.js';
import NdButton from '../../../../core/react/devex/button.js';
import NbDateRange from '../../../../core/react/bootstrap/daterange.js';
import NdPopGrid from '../../../../core/react/devex/popgrid.js';
import NdSelectBox from '../../../../core/react/devex/selectbox.js';
import { Chart, Series, ArgumentAxis, ValueAxis, Title, Legend, Tooltip } from 'devextreme-react/chart';

export default class supplierItemStatisticsReport extends React.PureComponent
{
    constructor(props)
    {
        super(props)
        
        this.core = App.instance.core
        this.tabIndex = props.data.tabKey

        this.state = 
        {
            selectedSupplier: this.props.selectedSupplier || null,
            selectedItemGroup: this.props.selectedItemGroup || null,
            showDetail: false,
            detailData: [],
            statisticsData: [],
            mainGridData: [],
            chartData: [],
            supplierChartData: [],
            itemGroupChartData: [],
            supplierComparisonData: [],
            itemGroupComparisonData: [],
            selectedTab: 0,
            analysisType: 'summary',
            showProductDetailPopup: false,  // YENİ
            productDetailData: [],          // YENİ
            productDetailTitle: ''          // YENİ
        }

        this.loadState = this.loadState.bind(this)
        this.saveState = this.saveState.bind(this)
        this.btnGetClick = this.btnGetClick.bind(this)
        this.getDetailStatistics = this.getDetailStatistics.bind(this)
        this.getTrendAnalysis = this.getTrendAnalysis.bind(this)
        this.getComparisonAnalysis = this.getComparisonAnalysis.bind(this)
        this.onTabSelectionChanged = this.onTabSelectionChanged.bind(this)
        this.btnTrendAnalysisClick = this.btnTrendAnalysisClick.bind(this)
        this.btnComparisonAnalysisClick = this.btnComparisonAnalysisClick.bind(this)
        this.onSupplierRowDblClick = this.onSupplierRowDblClick.bind(this)
        this.onItemGroupRowDblClick = this.onItemGroupRowDblClick.bind(this)
        this.closeProductDetailPopup = this.closeProductDetailPopup.bind(this)  // YENİ
    }

    componentDidMount()
    {
        this.init()
    }
    
    async init()
    {
        await this.core.util.waitUntil(0)
    }

    loadState()
    {
        let tmpLoad = this.access.filter({ELEMENT:'grdStatisticsReportState',USERS:this.user.CODE})
        return tmpLoad.getValue()
    }

    saveState(e)
    {
        let tmpSave = this.access.filter({ELEMENT:'grdStatisticsReportState',USERS:this.user.CODE, PAGE:this.props.data.id, APP:"OFF"})
        tmpSave.setValue(e)
        tmpSave.save()
    }

    // btnGetClick - Tedarikçi bazında ayrım yap
    async btnGetClick()
    {
        // Tedarikçi özeti için - Tedarikçi bazında ayrım
        let supplierSummarySource =
        {
            source : 
            {
                select : 
                {
                    query : `SELECT 
                            D.OUTPUT_CODE AS SUPPLIER_CODE,
                            D.OUTPUT_NAME AS SUPPLIER_NAME,
                            COUNT(DISTINCT DID.ITEM) AS TOTAL_ITEMS,
                            SUM(DID.QUANTITY) AS TOTAL_QUANTITY,
                            SUM(DID.TOTALHT) AS TOTAL_AMOUNT,
                            SUM(DID.TOTALHT - DID.TOTAL_COST) AS TOTAL_PROFIT,
                            CASE 
                                WHEN SUM(DID.TOTALHT) > 0 
                                THEN (SUM(DID.TOTALHT - DID.TOTAL_COST) / SUM(DID.TOTALHT)) * 100 
                                ELSE 0 
                            END AS PROFIT_MARGIN_PERCENT,
                            AVG(DID.TOTALHT) AS AVG_TICKET_AMOUNT,
                            COUNT(DISTINCT DID.MAIN_CODE) AS ITEM_GROUP_COUNT
                            FROM DOC_VW_01 D
                            INNER JOIN DOC_ITEMS_DETAIL_VW_01 DID ON D.GUID = DID.DOC_GUID
                            WHERE D.TYPE = 0 AND D.REBATE = 0 AND D.DOC_TYPE = 20
                            AND ((D.DOC_DATE >= @FIRST_DATE) OR (@FIRST_DATE = '19700101'))
                            AND ((D.DOC_DATE <= @LAST_DATE) OR (@LAST_DATE = '19700101'))
                            GROUP BY D.OUTPUT_CODE, D.OUTPUT_NAME
                            ORDER BY TOTAL_AMOUNT DESC`,
                    param : ['FIRST_DATE:date','LAST_DATE:date'],
                    value : [this.dtDate.startDate,this.dtDate.endDate]
                },
                sql : this.core.sql
            }
        }
        await this.grdSupplierSummary.dataRefresh(supplierSummarySource)
        
        // Ürün grubu özeti için - Ürün grubu bazında ayrım
        let itemGroupSummarySource =
        {
            source : 
            {
                select : 
                {
                    query : `SELECT 
                        DID.MAIN_CODE AS ITEM_GROUP_CODE,
                        DID.MAIN_GRP_NAME AS ITEM_GROUP_NAME,
                        COUNT(DISTINCT DID.ITEM) AS TOTAL_ITEMS,
                        SUM(DID.QUANTITY) AS TOTAL_QUANTITY,
                        SUM(DID.TOTALHT) AS TOTAL_AMOUNT,
                        SUM(DID.TOTALHT - DID.TOTAL_COST) AS TOTAL_PROFIT,
                        CASE 
                            WHEN SUM(DID.TOTALHT) > 0 
                            THEN (SUM(DID.TOTALHT - DID.TOTAL_COST) / SUM(DID.TOTALHT)) * 100 
                            ELSE 0 
                        END AS PROFIT_MARGIN_PERCENT,
                        AVG(DID.TOTALHT) AS AVG_TICKET_AMOUNT,
                        COUNT(DISTINCT D.OUTPUT_CODE) AS SUPPLIER_COUNT
                        FROM DOC_VW_01 D
                        INNER JOIN DOC_ITEMS_DETAIL_VW_01 DID ON D.GUID = DID.DOC_GUID
                        WHERE D.TYPE = 0 AND D.REBATE = 0 AND D.DOC_TYPE = 20
                        AND ((D.DOC_DATE >= @FIRST_DATE) OR (@FIRST_DATE = '19700101'))
                        AND ((D.DOC_DATE <= @LAST_DATE) OR (@LAST_DATE = '19700101'))
                        GROUP BY DID.MAIN_CODE, DID.MAIN_GRP_NAME
                        ORDER BY TOTAL_AMOUNT DESC`,
                    param : ['FIRST_DATE:date','LAST_DATE:date'],
                    value : [this.dtDate.startDate,this.dtDate.endDate]
                },
                sql : this.core.sql
            }
        }
        await this.grdItemGroupSummary.dataRefresh(itemGroupSummarySource)
    }

    // Trend Analiz için ayrı buton fonksiyonu
    async btnTrendAnalysisClick()
    {
        console.log('Trend Analiz başlatılıyor...');
        await this.getTrendAnalysis()
    }

    // Karşılaştırma Analiz için ayrı buton fonksiyonu
    async btnComparisonAnalysisClick()
    {
        console.log('Karşılaştırma Analiz başlatılıyor...');
        await this.getComparisonAnalysis()
    }

    // onTabSelectionChanged fonksiyonunu düzelt
    onTabSelectionChanged(e)
    {
        console.log('Tab değişti event:', e);
        
        // Event objesini kontrol et
        let selectedIndex = 0;
        if(e && e.selectedIndex !== undefined) {
            selectedIndex = e.selectedIndex;
        } else if(e && e.value !== undefined) {
            selectedIndex = e.value;
        } else if(e && e.component) {
            selectedIndex = e.component.option('selectedIndex');
        }
        
        console.log('Seçilen tab index:', selectedIndex);
        
        this.setState({selectedTab: selectedIndex})
        
        // Tab değiştiğinde ilgili veriyi yükle
        setTimeout(() => {
            if(selectedIndex === 1) // Trend sekmesi
            {
                console.log('Trend analiz yükleniyor...');
                this.getTrendAnalysis()
            }
            else if(selectedIndex === 2) // Karşılaştırma sekmesi
            {
                console.log('Karşılaştırma analiz yükleniyor...');
                this.getComparisonAnalysis()
            }
        }, 100);
    }

    // Detay Analiz fonksiyonunu düzelt
    async getDetailStatistics()
    {
        console.log('getDetailStatistics çağrıldı');
        
        // Tedarikçi bazında detay - Seçilen tedarikçinin ürün gruplarına göre analizi
        let supplierDetailQuery =
        {
            source : 
            {
                select : 
                {
                    query : `SELECT 
                            D.MAIN_CODE AS ITEM_GROUP_CODE,
                            D.MAIN_GRP_NAME AS ITEM_GROUP_NAME,
                            COUNT(DISTINCT D.DOC_GUID) AS TICKET_COUNT,
                            SUM(D.QUANTITY) AS TOTAL_QUANTITY,
                            SUM(D.TOTALHT) AS TOTAL_AMOUNT,
                            SUM(D.TOTALHT - D.TOTAL_COST) AS TOTAL_PROFIT,
                            CASE 
                                WHEN SUM(D.TOTALHT) > 0 
                                THEN (SUM(D.TOTALHT - D.TOTAL_COST) / SUM(D.TOTALHT)) * 100 
                                ELSE 0 
                            END AS PROFIT_MARGIN_PERCENT
                            FROM DOC_ITEMS_DETAIL_VW_01 D
                            WHERE D.TYPE = 1 AND D.REBATE = 0 
                            AND (D.DOC_TYPE = 20 OR (D.DOC_TYPE = 40 AND D.INVOICE_DOC_GUID <> '00000000-0000-0000-0000-000000000000'))
                            AND (D.DOC_DATE >= @FIRST_DATE AND D.DOC_DATE <= @LAST_DATE)
                            AND D.INPUT_CODE = @SELECTED_SUPPLIER_CODE
                            GROUP BY D.MAIN_CODE, D.MAIN_GRP_NAME
                            ORDER BY TOTAL_AMOUNT DESC`,
                    param : ['FIRST_DATE:date','LAST_DATE:date','SELECTED_SUPPLIER_CODE:string|25'],
                    value : [this.dtDate.startDate,this.dtDate.endDate,this.cmbDetailSupplier.value || '']
                },
                sql : this.core.sql
            }
        }
        console.log('Tedarikçi detay sorgusu:', supplierDetailQuery);
        await this.grdSupplierDetail.dataRefresh(supplierDetailQuery)
        
        // Ürün grubu bazında detay - Seçilen ürün grubunun tedarikçilerine göre analizi
        let itemGroupDetailQuery =
        {
            source : 
            {
                select : 
                {
                    query : `SELECT 
                            D.INPUT_CODE AS SUPPLIER_CODE,
                            D.INPUT_NAME AS SUPPLIER_NAME,
                            COUNT(DISTINCT D.DOC_GUID) AS TICKET_COUNT,
                            SUM(D.QUANTITY) AS TOTAL_QUANTITY,
                            SUM(D.TOTALHT) AS TOTAL_AMOUNT,
                            SUM(D.TOTALHT - D.TOTAL_COST) AS TOTAL_PROFIT,
                            CASE 
                            WHEN SUM(D.TOTALHT) > 0 
                            THEN (SUM(D.TOTALHT - D.TOTAL_COST) / SUM(D.TOTALHT)) * 100 
                            ELSE 0 
                            END AS PROFIT_MARGIN_PERCENT
                            FROM DOC_ITEMS_DETAIL_VW_01 D
                            WHERE D.TYPE = 1 AND D.REBATE = 0 
                            AND (D.DOC_TYPE = 20 OR (D.DOC_TYPE = 40 AND D.INVOICE_DOC_GUID <> '00000000-0000-0000-0000-000000000000'))
                            AND (D.DOC_DATE >= @FIRST_DATE AND D.DOC_DATE <= @LAST_DATE)
                            AND D.MAIN_CODE = @SELECTED_ITEM_GROUP_CODE
                            GROUP BY D.INPUT_CODE, D.INPUT_NAME
                            ORDER BY TOTAL_AMOUNT DESC`,
                    param : ['FIRST_DATE:date','LAST_DATE:date','SELECTED_ITEM_GROUP_CODE:string|25'],
                    value : [this.dtDate.startDate,this.dtDate.endDate,this.cmbDetailItemGroup.value || '']
                },
                sql : this.core.sql
            }
        }
        console.log('Ürün grubu detay sorgusu:', itemGroupDetailQuery);
        await this.grdItemGroupDetail.dataRefresh(itemGroupDetailQuery)
    }

    // Trend Analiz fonksiyonunu düzelt - Debug ekle ve sorguyu kontrol et
    async getTrendAnalysis()
    {
        console.log('getTrendAnalysis çağrıldı');
        
        // Grid verisi - DOC_VW_01 ile DOC_ITEMS_DETAIL_VW_01 birleştir
        let trendQuery =
        {
            source : 
            {
                select : 
                {
                    query : `SELECT 
                            YEAR(D.DOC_DATE) AS SALE_YEAR,
                            MONTH(D.DOC_DATE) AS SALE_MONTH,
                            DATENAME(MONTH, D.DOC_DATE) + ' ' + CAST(YEAR(D.DOC_DATE) AS VARCHAR) AS PERIOD_NAME,
                            SUM(DID.TOTALHT) AS MONTHLY_SALES,
                            SUM(DID.TOTALHT - DID.TOTAL_COST) AS MONTHLY_PROFIT,
                            SUM(DID.QUANTITY) AS MONTHLY_QUANTITY,
                            COUNT(DISTINCT D.OUTPUT_CODE) AS MONTHLY_SUPPLIERS,
                            COUNT(DISTINCT DID.MAIN_CODE) AS MONTHLY_ITEM_GROUPS
                            FROM DOC_VW_01 D
                            INNER JOIN DOC_ITEMS_DETAIL_VW_01 DID ON D.GUID = DID.DOC_GUID
                            WHERE D.TYPE = 0 AND D.REBATE = 0 AND D.DOC_TYPE = 20
                            AND ((D.DOC_DATE >= @FIRST_DATE) OR (@FIRST_DATE = '19700101'))
                            AND ((D.DOC_DATE <= @LAST_DATE) OR (@LAST_DATE = '19700101'))
                            AND (@TREND_SUPPLIER_CODE = '' OR D.OUTPUT_CODE = @TREND_SUPPLIER_CODE)
                            AND (@TREND_ITEM_GROUP_CODE = '' OR DID.MAIN_CODE = @TREND_ITEM_GROUP_CODE)
                            GROUP BY YEAR(D.DOC_DATE), MONTH(D.DOC_DATE), DATENAME(MONTH, D.DOC_DATE)
                            ORDER BY YEAR(D.DOC_DATE), MONTH(D.DOC_DATE)`,
                    param : ['FIRST_DATE:date','LAST_DATE:date','TREND_SUPPLIER_CODE:string|25','TREND_ITEM_GROUP_CODE:string|25'],
                    value : [this.dtDate.startDate,this.dtDate.endDate,this.cmbTrendSupplier?.value || '',this.cmbTrendItemGroup?.value || '']
                },
                sql : this.core.sql
            }
        }
        console.log('Trend sorgusu parametreleri:', trendQuery.source.select.value);
        
        try {
            await this.grdTrendAnalysis.dataRefresh(trendQuery)
            console.log('Trend analiz grid refresh tamamlandı');
        } catch(error) {
            console.error('Trend analiz grid refresh hatası:', error);
        }
        
        // Chart verilerini güncelle
        await this.loadTrendChartData()
    }

    // loadTrendChartData - DOC_VW_01 ile DOC_ITEMS_DETAIL_VW_01 birleştir
    async loadTrendChartData()
    {
        try {
            let hasSupplier = this.cmbTrendSupplier?.value && this.cmbTrendSupplier.value !== ''
            let hasItemGroup = this.cmbTrendItemGroup?.value && this.cmbTrendItemGroup.value !== ''
            
            // Trend chart sorgusu - DOC_VW_01 ile DOC_ITEMS_DETAIL_VW_01 birleştir
            let trendChartQuery = 
            {
                query: `SELECT 
                        YEAR(D.DOC_DATE) AS SALE_YEAR,
                        MONTH(D.DOC_DATE) AS SALE_MONTH,
                        DATENAME(MONTH, D.DOC_DATE) + ' ' + CAST(YEAR(D.DOC_DATE) AS VARCHAR) AS PERIOD_NAME,
                        SUM(DID.TOTALHT) AS MONTHLY_SALES,
                        SUM(DID.TOTALHT - DID.TOTAL_COST) AS MONTHLY_PROFIT,
                        SUM(DID.QUANTITY) AS MONTHLY_QUANTITY
                        FROM DOC_VW_01 D
                        INNER JOIN DOC_ITEMS_DETAIL_VW_01 DID ON D.GUID = DID.DOC_GUID
                        WHERE D.TYPE = 0 AND D.REBATE = 0 AND D.DOC_TYPE = 20
                        AND ((D.DOC_DATE >= @FIRST_DATE) OR (@FIRST_DATE = '19700101'))
                        AND ((D.DOC_DATE <= @LAST_DATE) OR (@LAST_DATE = '19700101'))
                        AND (@TREND_SUPPLIER_CODE = '' OR D.OUTPUT_CODE = @TREND_SUPPLIER_CODE)
                        AND (@TREND_ITEM_GROUP_CODE = '' OR DID.MAIN_CODE = @TREND_ITEM_GROUP_CODE)
                        GROUP BY YEAR(D.DOC_DATE), MONTH(D.DOC_DATE), DATENAME(MONTH, D.DOC_DATE)
                        ORDER BY YEAR(D.DOC_DATE), MONTH(D.DOC_DATE)`,
                param: ['FIRST_DATE:date', 'LAST_DATE:date', 'TREND_SUPPLIER_CODE:string|25', 'TREND_ITEM_GROUP_CODE:string|25'],
                value: [this.dtDate.startDate, this.dtDate.endDate, this.cmbTrendSupplier?.value || '', this.cmbTrendItemGroup?.value || '']
            };
            
            let trendResult = await this.core.sql.execute(trendChartQuery);
            let trendData = trendResult?.result?.recordset || [];
            
            console.log('Trend chart data:', trendData);
            this.setState({ chartData: trendData });
            
        } catch(error) {
            console.error('Trend Chart Data Loading Error:', error);
            this.setState({ chartData: [] });
        }
    }

    // Karşılaştırma Analiz fonksiyonunu düzelt - Daha detaylı bilgiler
    async getComparisonAnalysis()
    {
        console.log('getComparisonAnalysis çağrıldı');
        
        // Tedarikçi karşılaştırması - DOC_VW_01 ile DOC_ITEMS_DETAIL_VW_01 birleştir
        let supplierComparisonQuery =
        {
            source : 
            {
                select : 
                {
                    query : `SELECT 
                            D.OUTPUT_CODE AS SUPPLIER_CODE,
                            D.OUTPUT_NAME AS SUPPLIER_NAME,
                            DID.MAIN_CODE AS ITEM_GROUP_CODE,
                            DID.MAIN_GRP_NAME AS ITEM_GROUP_NAME,
                            SUM(DID.TOTALHT) AS SUPPLIER_TOTAL_AMOUNT,
                            SUM(DID.TOTALHT - DID.TOTAL_COST) AS SUPPLIER_TOTAL_PROFIT,
                            CASE 
                            WHEN SUM(DID.TOTALHT) > 0 
                            THEN (SUM(DID.TOTALHT - DID.TOTAL_COST) / SUM(DID.TOTALHT)) * 100 
                            ELSE 0 
                            END AS SUPPLIER_PROFIT_MARGIN,
                            COUNT(DISTINCT DID.ITEM) AS SUPPLIER_ITEM_COUNT,
                            AVG(DID.TOTALHT) AS SUPPLIER_AVG_TICKET,
                            SUM(DID.QUANTITY) AS SUPPLIER_TOTAL_QUANTITY,
                            AVG(DID.QUANTITY) AS SUPPLIER_AVG_QUANTITY,
                            MIN(D.DOC_DATE) AS SUPPLIER_FIRST_SALE,
                            MAX(D.DOC_DATE) AS SUPPLIER_LAST_SALE,
                            COUNT(DISTINCT CAST(D.DOC_DATE AS DATE)) AS SUPPLIER_ACTIVE_DAYS
                            FROM DOC_VW_01 D
                            INNER JOIN DOC_ITEMS_DETAIL_VW_01 DID ON D.GUID = DID.DOC_GUID
                            WHERE D.TYPE = 0 AND D.REBATE = 0 AND D.DOC_TYPE = 20
                            AND ((D.DOC_DATE >= @FIRST_DATE) OR (@FIRST_DATE = '19700101'))
                            AND ((D.DOC_DATE <= @LAST_DATE) OR (@LAST_DATE = '19700101'))
                            AND (@COMPARISON_SUPPLIER_CODE = '' OR D.OUTPUT_CODE = @COMPARISON_SUPPLIER_CODE)
                            AND (@COMPARISON_ITEM_GROUP_CODE = '' OR DID.MAIN_CODE = @COMPARISON_ITEM_GROUP_CODE)
                            GROUP BY D.OUTPUT_CODE, D.OUTPUT_NAME, DID.MAIN_CODE, DID.MAIN_GRP_NAME
                            ORDER BY D.OUTPUT_NAME, SUPPLIER_TOTAL_AMOUNT DESC`,
                    param : ['FIRST_DATE:date','LAST_DATE:date','COMPARISON_SUPPLIER_CODE:string|25','COMPARISON_ITEM_GROUP_CODE:string|25'],
                    value : [this.dtDate.startDate,this.dtDate.endDate,this.cmbComparisonSupplier?.value || '',this.cmbComparisonItemGroup?.value || '']
                },
                sql : this.core.sql
            }
        }
        
        // Ürün grubu karşılaştırması - DOC_VW_01 ile DOC_ITEMS_DETAIL_VW_01 birleştir
        let itemGroupComparisonQuery =
        {
            source : 
            {
                select : 
                {
                    query : `SELECT 
                        DID.MAIN_CODE AS ITEM_GROUP_CODE,
                        DID.MAIN_GRP_NAME AS ITEM_GROUP_NAME,
                        D.OUTPUT_CODE AS SUPPLIER_CODE,
                        D.OUTPUT_NAME AS SUPPLIER_NAME,
                        SUM(DID.TOTALHT) AS GROUP_TOTAL_AMOUNT,
                        SUM(DID.TOTALHT - DID.TOTAL_COST) AS GROUP_TOTAL_PROFIT,
                        CASE 
                            WHEN SUM(DID.TOTALHT) > 0 
                            THEN (SUM(DID.TOTALHT - DID.TOTAL_COST) / SUM(DID.TOTALHT)) * 100 
                            ELSE 0 
                        END AS GROUP_PROFIT_MARGIN,
                        COUNT(DISTINCT DID.ITEM) AS GROUP_ITEM_COUNT,
                        AVG(DID.TOTALHT) AS GROUP_AVG_TICKET,
                        SUM(DID.QUANTITY) AS GROUP_TOTAL_QUANTITY,
                        AVG(DID.QUANTITY) AS GROUP_AVG_QUANTITY,
                        MIN(D.DOC_DATE) AS GROUP_FIRST_SALE,
                        MAX(D.DOC_DATE) AS GROUP_LAST_SALE,
                        COUNT(DISTINCT CAST(D.DOC_DATE AS DATE)) AS GROUP_ACTIVE_DAYS
                        FROM DOC_VW_01 D
                        INNER JOIN DOC_ITEMS_DETAIL_VW_01 DID ON D.GUID = DID.DOC_GUID
                        WHERE D.TYPE = 0 AND D.REBATE = 0 AND D.DOC_TYPE = 20
                        AND ((D.DOC_DATE >= @FIRST_DATE) OR (@FIRST_DATE = '19700101'))
                        AND ((D.DOC_DATE <= @LAST_DATE) OR (@LAST_DATE = '19700101'))
                        AND (@COMPARISON_SUPPLIER_CODE = '' OR D.OUTPUT_CODE = @COMPARISON_SUPPLIER_CODE)
                        AND (@COMPARISON_ITEM_GROUP_CODE = '' OR DID.MAIN_CODE = @COMPARISON_ITEM_GROUP_CODE)
                        GROUP BY DID.MAIN_CODE, DID.MAIN_GRP_NAME, D.OUTPUT_CODE, D.OUTPUT_NAME
                        ORDER BY DID.MAIN_GRP_NAME, GROUP_TOTAL_AMOUNT DESC`,
                    param : ['FIRST_DATE:date','LAST_DATE:date','COMPARISON_SUPPLIER_CODE:string|25','COMPARISON_ITEM_GROUP_CODE:string|25'],
                    value : [this.dtDate.startDate,this.dtDate.endDate,this.cmbComparisonSupplier?.value || '',this.cmbComparisonItemGroup?.value || '']
                },
                sql : this.core.sql
            }
        }
    
        await this.grdSupplierComparison.dataRefresh(supplierComparisonQuery)
        await this.grdItemGroupComparison.dataRefresh(itemGroupComparisonQuery)
    }

    // Chart verilerini yükleyen fonksiyon
    async loadChartData()
    {
        try {
            let hasDate = this.dtDate.startDate && this.dtDate.endDate
            let hasSupplier = this.cmbSupplier?.value && this.cmbSupplier.value !== ''  // Güvenli erişim
            let hasItemGroup = this.cmbItemGroup?.value && this.cmbItemGroup.value !== ''  // Güvenli erişim
            
            // Genel trend analizi
            let generalChartQuery = 
            {
                query: `SELECT 
                        YEAR(D.DOC_DATE) AS SALE_YEAR,
                        MONTH(D.DOC_DATE) AS SALE_MONTH,
                        DATENAME(MONTH, D.DOC_DATE) + ' ' + CAST(YEAR(D.DOC_DATE) AS VARCHAR) AS PERIOD_NAME,
                        SUM(D.TOTALHT) AS MONTHLY_SALES,
                        SUM(D.TOTALHT - D.TOTAL_COST) AS MONTHLY_PROFIT,
                        COUNT(DISTINCT D.DOC_GUID) AS MONTHLY_TICKETS,
                        SUM(D.QUANTITY) AS MONTHLY_QUANTITY
                        FROM DOC_ITEMS_DETAIL_VW_01 D
                        WHERE D.TYPE = 1 AND D.REBATE = 0 
                        AND (D.DOC_TYPE = 20 OR (D.DOC_TYPE = 40 AND D.INVOICE_DOC_GUID <> '00000000-0000-0000-0000-000000000000'))
                        AND (D.DOC_DATE >= @FIRST_DATE AND D.DOC_DATE <= @LAST_DATE)
                        GROUP BY YEAR(D.DOC_DATE), MONTH(D.DOC_DATE), DATENAME(MONTH, D.DOC_DATE)
                        ORDER BY YEAR(D.DOC_DATE), MONTH(D.DOC_DATE)`,
                param: ['FIRST_DATE:date', 'LAST_DATE:date'],
                value: [this.dtDate.startDate, this.dtDate.endDate]
            };
            
            // Tedarikçi bazında trend analizi
            let supplierChartQuery = {
                query: `SELECT 
                        D.INPUT_NAME AS SUPPLIER_NAME,
                        SUM(D.TOTALHT) AS SUPPLIER_SALES,
                        SUM(D.TOTALHT - D.TOTAL_COST) AS SUPPLIER_PROFIT,
                        COUNT(DISTINCT D.DOC_GUID) AS SUPPLIER_TICKETS,
                        COUNT(DISTINCT D.ITEM) AS SUPPLIER_ITEMS
                        FROM DOC_ITEMS_DETAIL_VW_01 D
                        WHERE D.TYPE = 1 AND D.REBATE = 0 
                        AND (D.DOC_TYPE = 20 OR (D.DOC_TYPE = 40 AND D.INVOICE_DOC_GUID <> '00000000-0000-0000-0000-000000000000'))
                        AND (D.DOC_DATE >= @FIRST_DATE AND D.DOC_DATE <= @LAST_DATE)
                        ${hasSupplier ? 'AND D.INPUT_CODE = @SUPPLIER_CODE' : ''}
                        GROUP BY D.INPUT_NAME
                        ORDER BY SUPPLIER_SALES DESC`,
                param: hasSupplier ? ['FIRST_DATE:date', 'LAST_DATE:date', 'SUPPLIER_CODE:string|25'] : ['FIRST_DATE:date', 'LAST_DATE:date'],
                value: hasSupplier ? [this.dtDate.startDate, this.dtDate.endDate, this.cmbSupplier.value] : [this.dtDate.startDate, this.dtDate.endDate]
            };
            
            // Ürün grubu bazında trend analizi
            let itemGroupChartQuery = {
                query: `SELECT 
                        D.MAIN_GRP_NAME AS ITEM_GROUP_NAME,
                        SUM(D.TOTALHT) AS GROUP_SALES,
                        SUM(D.TOTALHT - D.TOTAL_COST) AS GROUP_PROFIT,
                        COUNT(DISTINCT D.DOC_GUID) AS GROUP_TICKETS,
                        COUNT(DISTINCT D.ITEM) AS GROUP_ITEMS
                        FROM DOC_ITEMS_DETAIL_VW_01 D
                        WHERE D.TYPE = 1 AND D.REBATE = 0 
                        AND (D.DOC_TYPE = 20 OR (D.DOC_TYPE = 40 AND D.INVOICE_DOC_GUID <> '00000000-0000-0000-0000-000000000000'))
                        AND (D.DOC_DATE >= @FIRST_DATE AND D.DOC_DATE <= @LAST_DATE)
                        ${hasItemGroup ? 'AND D.MAIN_CODE = @ITEM_GROUP_CODE' : ''}
                        GROUP BY D.MAIN_GRP_NAME
                        ORDER BY GROUP_SALES DESC`,
                param: hasItemGroup ? ['FIRST_DATE:date', 'LAST_DATE:date', 'ITEM_GROUP_CODE:string|25'] : ['FIRST_DATE:date', 'LAST_DATE:date'],
                value: hasItemGroup ? [this.dtDate.startDate, this.dtDate.endDate, this.cmbItemGroup.value] : [this.dtDate.startDate, this.dtDate.endDate]
            };
            
            let generalResult = await this.core.sql.execute(generalChartQuery);
            let supplierResult = await this.core.sql.execute(supplierChartQuery);
            let itemGroupResult = await this.core.sql.execute(itemGroupChartQuery);
            
            console.log('General Chart Result:', generalResult);
            console.log('Supplier Chart Result:', supplierResult);
            console.log('Item Group Chart Result:', itemGroupResult);
            
            // Result yapısını kontrol et ve veriyi al
            let generalData = generalResult?.result?.recordset || [];
            let supplierData = supplierResult?.result?.recordset || [];
            let itemGroupData = itemGroupResult?.result?.recordset || [];
            
            console.log('Setting chart data - General:', generalData.length, 'Supplier:', supplierData.length, 'Item Group:', itemGroupData.length);
            this.setState({
                chartData: generalData,
                supplierChartData: supplierData,
                itemGroupChartData: itemGroupData
            });
            
            // Chart'lar state'ten veri alıyor, sadece state güncellemesi yeterli
            console.log('Chart data updated - General:', generalData.length, 'Supplier:', supplierData.length, 'Item Group:', itemGroupData.length);
            
        } catch(error) {
            console.error('Chart Data Loading Error:', error);
            this.setState({
                chartData: [],
                supplierChartData: [],
                itemGroupChartData: []
            });
        }
    }

    // Tedarikçi satırına çift tıklama - Ürün detayları
    async onSupplierRowDblClick(e)
    {
        console.log('Tedarikçi satırına çift tıklandı:', e.data);
        
        try {
            // ITEM_GROUP_CODE kullanarak sorgu yap
            let productDetailQuery = 
            {
                source : 
                {
                    select : 
                    {
                        query : `SELECT 
                                I.GUID AS ITEM_GUID,
                                I.CODE AS ITEM_CODE,
                                I.NAME AS ITEM_NAME,
                                I.MAIN_GUID AS ITEM_GROUP_GUID,
                                IG.CODE AS ITEM_GROUP_CODE,
                                IG.NAME AS ITEM_GROUP_NAME,
                    COUNT(DISTINCT D.DOC_GUID) AS ITEM_TICKET_COUNT,
                    SUM(D.QUANTITY) AS ITEM_TOTAL_QUANTITY,
                    SUM(D.TOTALHT) AS ITEM_TOTAL_AMOUNT,
                    SUM(D.TOTALHT - D.TOTAL_COST) AS ITEM_TOTAL_PROFIT,
                    CASE 
                        WHEN SUM(D.TOTALHT) > 0 
                        THEN (SUM(D.TOTALHT - D.TOTAL_COST) / SUM(D.TOTALHT)) * 100 
                        ELSE 0 
                    END AS ITEM_PROFIT_MARGIN,
                                AVG(D.QUANTITY) AS ITEM_AVG_QUANTITY,
                                AVG(D.TOTALHT) AS ITEM_AVG_TICKET,
                                MIN(D.DOC_DATE) AS ITEM_FIRST_SALE,
                                MAX(D.DOC_DATE) AS ITEM_LAST_SALE
                    FROM DOC_ITEMS_DETAIL_VW_01 D
                                INNER JOIN ITEMS_VW_01 I ON D.ITEM = I.GUID
                                INNER JOIN ITEM_GROUP IG ON I.MAIN_GUID = IG.GUID
                    WHERE D.TYPE = 1 AND D.REBATE = 0 
                    AND (D.DOC_TYPE = 20 OR (D.DOC_TYPE = 40 AND D.INVOICE_DOC_GUID <> '00000000-0000-0000-0000-000000000000'))
                    AND (D.DOC_DATE >= @FIRST_DATE AND D.DOC_DATE <= @LAST_DATE)
                                AND D.INPUT_CODE = @SUPPLIER_CODE
                                AND IG.CODE = @ITEM_GROUP_CODE
                                GROUP BY I.GUID, I.CODE, I.NAME, I.MAIN_GUID, IG.CODE, IG.NAME
                    ORDER BY ITEM_TOTAL_AMOUNT DESC`,
                        param : ['FIRST_DATE:date','LAST_DATE:date','SUPPLIER_CODE:string|25','ITEM_GROUP_CODE:string|25'],
                        value : [this.dtDate.startDate,this.dtDate.endDate,e.data.SUPPLIER_CODE,e.data.ITEM_GROUP_CODE || '']
                    },
                    sql : this.core.sql
                }
            }
            
            console.log('Ürün detay sorgusu parametreleri:', productDetailQuery.source.select.value);
            let result = await this.core.sql.execute(productDetailQuery);
            let productData = result?.result?.recordset || [];
            
            console.log('Ürün detay verisi:', productData);
            console.log('Veri sayısı:', productData.length);
            
            this.setState({
                showProductDetailPopup: true,
                productDetailData: productData,
                productDetailTitle: `${e.data.SUPPLIER_NAME} - ${e.data.ITEM_GROUP_NAME} Ürün Detayları`
            });
            
        } catch(error) {
            console.error('Ürün detayları yüklenirken hata:', error);
        }
    }

    // Ürün grubu satırına çift tıklama - Ürün detayları
    async onItemGroupRowDblClick(e)
    {
        console.log('Ürün grubu satırına çift tıklandı:', e.data);
        
        try {
            let productDetailQuery = 
            {
                source : 
                {
                    select : 
                    {
                        query : `SELECT 
                                I.GUID AS ITEM_GUID,
                                I.CODE AS ITEM_CODE,
                                I.NAME AS ITEM_NAME,
                                I.MAIN_GUID AS ITEM_GROUP_GUID,
                                IG.CODE AS ITEM_GROUP_CODE,
                                IG.NAME AS ITEM_GROUP_NAME,
                                COUNT(DISTINCT D.DOC_GUID) AS ITEM_TICKET_COUNT,
                                SUM(D.QUANTITY) AS ITEM_TOTAL_QUANTITY,
                                SUM(D.TOTALHT) AS ITEM_TOTAL_AMOUNT,
                                SUM(D.TOTALHT - D.TOTAL_COST) AS ITEM_TOTAL_PROFIT,
                                CASE 
                                    WHEN SUM(D.TOTALHT) > 0 
                                    THEN (SUM(D.TOTALHT - D.TOTAL_COST) / SUM(D.TOTALHT)) * 100 
                                    ELSE 0 
                                END AS ITEM_PROFIT_MARGIN,
                                AVG(D.QUANTITY) AS ITEM_AVG_QUANTITY,
                                AVG(D.TOTALHT) AS ITEM_AVG_TICKET,
                                MIN(D.DOC_DATE) AS ITEM_FIRST_SALE,
                                MAX(D.DOC_DATE) AS ITEM_LAST_SALE
                                FROM DOC_ITEMS_DETAIL_VW_01 D
                                INNER JOIN ITEMS_VW_01 I ON D.ITEM = I.GUID
                                INNER JOIN ITEM_GROUP IG ON I.MAIN_GUID = IG.GUID
                                WHERE D.TYPE = 1 AND D.REBATE = 0 
                                AND (D.DOC_TYPE = 20 OR (D.DOC_TYPE = 40 AND D.INVOICE_DOC_GUID <> '00000000-0000-0000-0000-000000000000'))
                                AND (D.DOC_DATE >= @FIRST_DATE AND D.DOC_DATE <= @LAST_DATE)
                                AND I.MAIN_GUID = @ITEM_GROUP_CODE
                                AND (@SUPPLIER_CODE = '' OR D.INPUT_CODE = @SUPPLIER_CODE)
                                GROUP BY I.GUID, I.CODE, I.NAME, I.MAIN_GUID, IG.CODE, IG.NAME
                                ORDER BY ITEM_TOTAL_AMOUNT DESC`,
                        param : ['FIRST_DATE:date','LAST_DATE:date','ITEM_GROUP_CODE:string|25','SUPPLIER_CODE:string|25'],
                        value : [this.dtDate.startDate,this.dtDate.endDate,e.data.ITEM_GROUP_CODE,e.data.SUPPLIER_CODE || '']
                    },
                    sql : this.core.sql
                }
            }
            
            let result = await this.core.sql.execute(productDetailQuery);
            let productData = result?.result?.recordset || [];
            
            this.setState({
                showProductDetailPopup: true,
                productDetailData: productData,
                productDetailTitle: `${e.data.ITEM_GROUP_NAME} - ${e.data.SUPPLIER_NAME} Ürün Detayları`
            });
            
        } catch(error) {
            console.error('Ürün detayları yüklenirken hata:', error);
        }
    }

    // Popup'ı kapat
    closeProductDetailPopup()
    {
            this.setState({
            showProductDetailPopup: false,
            productDetailData: [],
            productDetailTitle: ''
        });
    }

    render()
    {
        return (
            <div id={this.props.data.id + this.tabIndex} style={{height:'100%'}}>
                <ScrollView>
                <div className="row px-2 pt-1">
                    <div className="col-12">
                        <Toolbar>
                            <Item location="after"
                            locateInMenu="auto"
                            widget="dxButton"
                            options=
                            {
                                {
                                    type: 'default',
                                    icon: 'clear',
                                    onClick: async () => 
                                    {
                                        let tmpConfObj =
                                        {
                                            id:'msgClose',showTitle:true,title:this.lang.t("msgWarning"),showCloseButton:true,width:'500px',height:'auto',
                                            button:[{id:"btn01",caption:this.lang.t("btnYes"),location:'before'},{id:"btn02",caption:this.lang.t("btnNo"),location:'after'}],
                                            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgClose")}</div>)
                                        }
                                        
                                        let pResult = await dialog(tmpConfObj);
                                        if(pResult == 'btn01')
                                        {
                                            App.instance.panel.closePage()
                                        }
                                    }
                                }    
                            } />
                        </Toolbar>
                    </div>
                </div>

                {/* FİLTRE ALANI */}
                <div className="row px-2 pt-1" style={{height:'120px'}}>
                    <div className="col-12">
                        <Form colCount={1} id="frmCriter">
                            {/* Tarih */}
                            <Item colSpan={1}>
                                <Label text={this.lang.t("dtDate")} alignment="right" />
                                <NbDateRange id={"dtDate"} parent={this} startDate={moment(new Date()).subtract(1, 'months')} endDate={moment(new Date())}/>
                            </Item>
                        </Form>
                    </div>
                </div>

                {/* BUTTON */}
                <div className="row px-2 pt-1">
                    <div className="col-3">
                    </div>
                    <div className="col-3">
                    </div>
                    <div className="col-3">
                    </div>
                    <div className="col-3">
                        <NdButton text="Analiz Et" type="success" width="100%" onClick={this.btnGetClick}/>
                    </div>
                </div>

                {/* TAB PANEL */}
                <div className="row px-2 pt-1">
                    <div className="col-12">
                        <TabPanel 
                        selectedIndex={this.state.selectedTab}
                        onSelectionChanged={this.onTabSelectionChanged}
                        animationEnabled={true}
                        swipeEnabled={true}
                        height={'auto'}
                        >
                            {/* ÖZET ANALİZ SEKMESI */}
                            <TabItem title="Özet Analiz">
                                <div className="row">
                                    <div className="col-12">
                                        <h5>Tedarikçi Bazında Özet</h5>
                                        <p className="text-muted">Şirketin tedarikçileri bazında satış istatistikleri</p>
                                        <NdGrid id="grdSupplierSummary" parent={this} 
                                        selection={{mode:"single"}} 
                                        showBorders={true}
                                        height={'300px'} 
                                        width={'100%'}
                                        filterRow={{visible:true}} 
                                        headerFilter={{visible:true}}
                                        columnAutoWidth={true}
                                        allowColumnReordering={true}
                                        allowColumnResizing={true}
                                        loadPanel={{enabled:true}}
                                        >                            
                                            <ColumnChooser enabled={true} />
                                            <Export fileName="Tedarikçi Özeti" enabled={true} allowExportSelectedData={true} />
                                            
                                            <Column dataField="SUPPLIER_CODE" caption="Tedarikçi Kodu" visible={true} width={120}/> 
                                            <Column dataField="SUPPLIER_NAME" caption="Tedarikçi Adı" visible={true} width={200}/> 
                                            <Column dataField="TOTAL_AMOUNT" caption="Toplam Satış" visible={true} format="€ #,##0.00" width={150} allowHeaderFiltering={false}/> 
                                            <Column dataField="TOTAL_PROFIT" caption="Toplam Kar" visible={true} format="€ #,##0.00" width={150} allowHeaderFiltering={false}/> 
                                            <Column dataField="PROFIT_MARGIN_PERCENT" caption="Kar Marjı %" visible={true} format="#0.00%" width={120} allowHeaderFiltering={false}/> 
                                            <Column dataField="TOTAL_QUANTITY" caption="Toplam Miktar" visible={true} format="#,##0.00" width={120} allowHeaderFiltering={false}/> 
                                            <Column dataField="TOTAL_ITEMS" caption="Ürün Çeşidi" visible={true} width={100} allowHeaderFiltering={false}/> 
                                            <Column dataField="ITEM_GROUP_COUNT" caption="Ürün Grubu" visible={true} width={100} allowHeaderFiltering={false}/> 
                                            <Column dataField="AVG_TICKET_AMOUNT" caption="Ort. Fiş Tutarı" visible={true} format="€ #,##0.00" width={150} allowHeaderFiltering={false}/> 
                                            
                                            <Summary>
                                                <TotalItem column="TOTAL_AMOUNT" summaryType="sum" valueFormat={{ style: "currency", currency: Number.money.code,precision: 2}} />
                                                <TotalItem column="TOTAL_PROFIT" summaryType="sum" valueFormat={{ style: "currency", currency: Number.money.code,precision: 2}} />
                                                <TotalItem column="TOTAL_QUANTITY" summaryType="sum" valueFormat="fixedPoint" />
                                                <TotalItem column="TOTAL_ITEMS" summaryType="sum" />
                                            </Summary>
                                        </NdGrid>
                                    </div>
                                </div>
                                
                                <div className="row mt-3">
                                    <div className="col-12">
                                        <h5>Ürün Grubu Bazında Özet</h5>
                                        <p className="text-muted">Şirketin ürün grupları bazında satış istatistikleri</p>
                                        <NdGrid id="grdItemGroupSummary" parent={this} 
                                        selection={{mode:"single"}} 
                                        showBorders={true}
                                        height={'300px'} 
                                        width={'100%'}
                                        filterRow={{visible:true}} 
                                        headerFilter={{visible:true}}
                                        columnAutoWidth={true}
                                        allowColumnReordering={true}
                                        allowColumnResizing={true}
                                        loadPanel={{enabled:true}}
                                        >                            
                                            <ColumnChooser enabled={true} />
                                            <Export fileName="Ürün Grubu Özeti" enabled={true} allowExportSelectedData={true} />
                                            
                                            <Column dataField="ITEM_GROUP_CODE" caption="Ürün Grubu Kodu" visible={true} width={120}/> 
                                            <Column dataField="ITEM_GROUP_NAME" caption="Ürün Grubu Adı" visible={true} width={200}/> 
                                            <Column dataField="TOTAL_AMOUNT" caption="Toplam Satış" visible={true} format="€ #,##0.00" width={150} allowHeaderFiltering={false}/> 
                                            <Column dataField="TOTAL_PROFIT" caption="Toplam Kar" visible={true} format="€ #,##0.00" width={150} allowHeaderFiltering={false}/> 
                                            <Column dataField="PROFIT_MARGIN_PERCENT" caption="Kar Marjı %" visible={true} format="#0.00%" width={120} allowHeaderFiltering={false}/> 
                                            <Column dataField="TOTAL_QUANTITY" caption="Toplam Miktar" visible={true} format="#,##0.00" width={120} allowHeaderFiltering={false}/> 
                                            <Column dataField="TOTAL_ITEMS" caption="Ürün Çeşidi" visible={true} width={100} allowHeaderFiltering={false}/> 
                                            <Column dataField="SUPPLIER_COUNT" caption="Tedarikçi Sayısı" visible={true} width={120} allowHeaderFiltering={false}/> 
                                            <Column dataField="AVG_TICKET_AMOUNT" caption="Ort. Fiş Tutarı" visible={true} format="€ #,##0.00" width={150} allowHeaderFiltering={false}/> 
                                            
                                            <Summary>
                                                <TotalItem column="TOTAL_AMOUNT" summaryType="sum" valueFormat={{ style: "currency", currency: Number.money.code,precision: 2}} />
                                                <TotalItem column="TOTAL_PROFIT" summaryType="sum" valueFormat={{ style: "currency", currency: Number.money.code,precision: 2}} />
                                                <TotalItem column="TOTAL_QUANTITY" summaryType="sum" valueFormat="fixedPoint" />
                                                <TotalItem column="TOTAL_ITEMS" summaryType="sum" />
                                            </Summary>
                                        </NdGrid>
                                    </div>
                                </div>
                            </TabItem>
                            
                            {/* TREND ANALİZ SEKMESI - Label'lar ve doğru parametre geçişi */}
                            <TabItem title="Trend Analiz">
                                <div className="row">
                                    <div className="col-6">
                                        <h5>Tedarikçi Seçimi</h5>
                                        <p className="text-muted">Seçilen tedarikçinin aylık satış trendini görüntülemek için tedarikçi seçin</p>
                                <NdTextBox
                                            id="cmbTrendSupplier"
                                    parent={this}
                                    simple={true}
                                    tabIndex={this.tabIndex}
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                            onValueChanged={(e) => this.onTrendSupplierValueChanged(e)}  // Direkt yazma için
                                    button=
                                            {[
                                            {
                                                id:'01',
                                                icon:'more',
                                                onClick:()=>
                                                {
                                                        this.pg_cmbTrendSupplier.show()
                                                        this.pg_cmbTrendSupplier.onClick = (data) =>
                                                    {
                                                        if(data.length > 0)
                                                        {
                                                                this.cmbTrendSupplier.value = data[0].CODE
                                                                this.cmbTrendSupplier.GUID = data[0].GUID
                                                                console.log('Trend Supplier seçildi - CODE:', data[0].CODE, 'GUID:', data[0].GUID);
                                                        }
                                                    }
                                                }
                                            },
                                            {
                                                id:'02',
                                                icon:'clear',
                                                onClick:()=>
                                                {
                                                        this.cmbTrendSupplier.value = ''
                                                        this.cmbTrendSupplier.GUID = null
                                                }
                                            }
                                            ]}
                                />      
                                        <NdPopGrid id={"pg_cmbTrendSupplier"} parent={this} container={'#' + this.props.data.id + this.tabIndex} 
                                visible={false}
                                position={{of:'#' + this.props.data.id + this.tabIndex}} 
                                showTitle={true} 
                                showBorders={true}
                                width={'90%'}
                                height={'90%'}
                                        title="Tedarikçi Seç" 
                                selection={{mode:"single"}}
                                search={true}
                                data = 
                                {{
                                    source:
                                    {
                                        select:
                                        {
                                            query : `SELECT GUID,CODE,TITLE FROM CUSTOMERS WHERE TYPE IN(1,2) AND STATUS = 1 AND DELETED = 0 AND (UPPER(CODE) LIKE UPPER(@VAL) OR UPPER(TITLE) LIKE UPPER(@VAL))`,
                                            param : ['VAL:string|50']
                                        },
                                        sql:this.core.sql
                                    }
                                }}
                                >
                                    <Column dataField="CODE" caption={this.lang.t("Code")} width={'30%'} />
                                            <Column dataField="TITLE" caption="Tedarikçi" width={'70%'} defaultSortOrder="asc" />
                                </NdPopGrid>
                                    </div>
                                    <div className="col-6">
                                        <h5>Ürün Grubu Seçimi</h5>
                                        <p className="text-muted">Seçilen ürün grubunun aylık satış trendini görüntülemek için ürün grubu seçin</p>
                                <NdTextBox
                                            id="cmbTrendItemGroup"
                                    parent={this}
                                    simple={true}
                                    tabIndex={this.tabIndex}
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                            onValueChanged={(e) => this.onTrendItemGroupValueChanged(e)}  // Direkt yazma için
                                    button=
                                            {[
                                            {
                                                id:'01',
                                                icon:'more',
                                                onClick:()=>
                                                {
                                                        this.pg_cmbTrendItemGroup.show()
                                                        this.pg_cmbTrendItemGroup.onClick = (data) =>
                                                    {
                                                        if(data.length > 0)
                                                        {
                                                                this.cmbTrendItemGroup.value = data[0].CODE
                                                                this.cmbTrendItemGroup.GUID = data[0].GUID
                                                                console.log('Trend Item Group seçildi - CODE:', data[0].CODE, 'GUID:', data[0].GUID);
                                                        }
                                                    }
                                                }
                                            },
                                            {
                                                id:'02',
                                                icon:'clear',
                                                onClick:()=>
                                                {
                                                        this.cmbTrendItemGroup.value = ''
                                                        this.cmbTrendItemGroup.GUID = null
                                                }
                                            }
                                            ]}
                                />      
                                        <NdPopGrid id={"pg_cmbTrendItemGroup"} parent={this} container={'#' + this.props.data.id + this.tabIndex} 
                                visible={false}
                                position={{of:'#' + this.props.data.id + this.tabIndex}} 
                                showTitle={true} 
                                showBorders={true}
                                width={'90%'}
                                height={'90%'}
                                        title="Ürün Grubu Seç" 
                                selection={{mode:"single"}}
                                search={true}
                                data = 
                                {{
                                    source:
                                    {
                                        select:
                                        {
                                            query : `SELECT GUID,CODE,NAME FROM ITEM_GROUP WHERE STATUS = 1 AND (UPPER(CODE) LIKE UPPER(@VAL) OR UPPER(NAME) LIKE UPPER(@VAL))`,
                                            param : ['VAL:string|50']
                                        },
                                        sql:this.core.sql
                                    }
                                }}
                                >
                                    <Column dataField="CODE" caption={this.lang.t("Code")} width={'30%'} />
                                            <Column dataField="NAME" caption="Ürün Grubu" width={'70%'} defaultSortOrder="asc" />
                                </NdPopGrid>
                    </div>
                </div>

                                {/* TREND ANALİZ BUTONU */}
                                <div className="row mt-3">
                                    <div className="col-12 text-center">
                                        <NdButton text="Trend Analizi Yap" type="success" width="200px" onClick={this.btnTrendAnalysisClick}/>
                    </div>
                </div>

                                <div className="row mt-3">
                    <div className="col-12">
                                        <h5>Aylık Trend Analizi</h5>
                                        <p className="text-muted">Seçilen tedarikçi veya ürün grubunun aylık satış ve kar trendi</p>
                                        <NdGrid id="grdTrendAnalysis" parent={this} 
                                selection={{mode:"single"}} 
                                showBorders={true}
                                        height={'400px'} 
                                width={'100%'}
                                filterRow={{visible:true}} 
                                headerFilter={{visible:true}}
                                columnAutoWidth={true}
                                allowColumnReordering={true}
                                allowColumnResizing={true}
                                loadPanel={{enabled:true}}
                                >                            
                                    <ColumnChooser enabled={true} />
                                            <Export fileName="Trend Analiz" enabled={true} allowExportSelectedData={true} />
                                            
                                            <Column dataField="SALE_YEAR" caption="Yıl" visible={true} width={80}/> 
                                            <Column dataField="SALE_MONTH" caption="Ay" visible={true} width={80}/> 
                                            <Column dataField="PERIOD_NAME" caption="Dönem" visible={true} width={150}/> 
                                            <Column dataField="MONTHLY_SALES" caption="Aylık Satış" visible={true} format="€ #,##0.00" width={150} allowHeaderFiltering={false}/> 
                                            <Column dataField="MONTHLY_PROFIT" caption="Aylık Kar" visible={true} format="€ #,##0.00" width={150} allowHeaderFiltering={false}/> 
                                            <Column dataField="MONTHLY_TICKETS" caption="Aylık Fiş" visible={true} width={120} allowHeaderFiltering={false}/> 
                                            <Column dataField="MONTHLY_QUANTITY" caption="Aylık Miktar" visible={true} width={120} allowHeaderFiltering={false}/> 
                                            <Column dataField="MONTHLY_SUPPLIERS" caption="Aylık Tedarikçi" visible={true} width={120} allowHeaderFiltering={false}/> 
                                            <Column dataField="MONTHLY_ITEM_GROUPS" caption="Aylık Ürün Grubu" visible={true} width={120} allowHeaderFiltering={false}/> 
                                    
                                    <Summary>
                                        <TotalItem column="MONTHLY_SALES" summaryType="sum" valueFormat={{ style: "currency", currency: Number.money.code,precision: 2}} />
                                        <TotalItem
                                                column="MONTHLY_PROFIT"
                                        summaryType="sum"
                                                valueFormat={{ style: "currency", currency: Number.money.code,precision: 2}} />
                                        <TotalItem
                                                column="MONTHLY_TICKETS"
                                        summaryType="sum" />
                                        <TotalItem
                                                column="MONTHLY_QUANTITY"
                                        summaryType="sum" />
                                    </Summary>
                                </NdGrid>
                                    </div>
                                </div>
                                
                                {/* TREND CHART'LAR */}
                                <div className="row mt-3">
                                    <div className="col-6">
                                        <Chart dataSource={this.state.chartData || []} height={300}>
                                            <Title text="Aylık Satış Trendi" />
                                            <ArgumentAxis />
                                            <ValueAxis />
                                            <Series
                                                type="line"
                                                valueField="MONTHLY_SALES"
                                                argumentField="PERIOD_NAME"
                                                name="Aylık Satış"
                                                color="#ff6b6b"
                                            />
                                            <Legend visible={true} />
                                            <Tooltip enabled={true} />
                                        </Chart>
                                            </div>
                                    <div className="col-6">
                                        <Chart dataSource={this.state.chartData || []} height={300}>
                                            <Title text="Aylık Kar Trendi" />
                                            <ArgumentAxis />
                                            <ValueAxis />
                                            <Series
                                                type="line"
                                                valueField="MONTHLY_PROFIT"
                                                argumentField="PERIOD_NAME"
                                                name="Aylık Kar"
                                                color="#4ecdc4"
                                            />
                                            <Legend visible={true} />
                                            <Tooltip enabled={true} />
                                        </Chart>
                                            </div>
                                    </div>
                            </TabItem>
                            
                            {/* KARŞILAŞTIRMA ANALİZ SEKMESI - Her biri için ayrı textbox */}
                            <TabItem title="Karşılaştırma Analiz">
                                <div className="row">
                                    <div className="col-6">
                                        <h5>Tedarikçi Karşılaştırması</h5>
                                        <p className="text-muted">Tedarikçi seçerek o tedarikçinin detaylı analizini görüntüleyin</p>
                                        <NdTextBox
                                            id="cmbComparisonSupplier"
                                            parent={this}
                                            simple={true}
                                            tabIndex={this.tabIndex}
                                            upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                            onValueChanged={(e) => this.onComparisonSupplierValueChanged(e)}  // Direkt yazma için
                                            button=
                                            {[
                                                {
                                                    id:'01',
                                                    icon:'more',
                                                    onClick:()=>
                                                    {
                                                        this.pg_cmbComparisonSupplier.show()
                                                        this.pg_cmbComparisonSupplier.onClick = (data) =>
                                                        {
                                                            if(data.length > 0)
                                                            {
                                                                this.cmbComparisonSupplier.value = data[0].CODE
                                                                this.cmbComparisonSupplier.GUID = data[0].GUID
                                                                console.log('Comparison Supplier seçildi - CODE:', data[0].CODE, 'GUID:', data[0].GUID);
                                                            }
                                                        }
                                                    }
                                                },
                                                {
                                                    id:'02',
                                                    icon:'clear',
                                                    onClick:()=>
                                                    {
                                                        this.cmbComparisonSupplier.value = ''
                                                        this.cmbComparisonSupplier.GUID = null
                                                    }
                                                }
                                            ]}
                                        />
                                        <NdPopGrid id={"pg_cmbComparisonSupplier"} parent={this} container={'#' + this.props.data.id + this.tabIndex} 
                                        visible={false}
                                        position={{of:'#' + this.props.data.id + this.tabIndex}} 
                                        showTitle={true} 
                                        showBorders={true}
                                        width={'90%'}
                                        height={'90%'}
                                        title="Tedarikçi Seç" 
                                        selection={{mode:"single"}}
                                        search={true}
                                        data = 
                                        {{
                                            source:
                                            {
                                                select:
                                                {
                                                    query : `SELECT GUID,CODE,TITLE FROM CUSTOMERS WHERE TYPE IN(1,2) AND STATUS = 1 AND DELETED = 0 AND (UPPER(CODE) LIKE UPPER(@VAL) OR UPPER(TITLE) LIKE UPPER(@VAL))`,
                                                    param : ['VAL:string|50']
                                                },
                                                sql:this.core.sql
                                            }
                                        }}
                                        >
                                            <Column dataField="CODE" caption={this.lang.t("Code")} width={'30%'} />
                                            <Column dataField="TITLE" caption="Tedarikçi" width={'70%'} defaultSortOrder="asc" />
                                        </NdPopGrid>
                                    </div>
                                    <div className="col-6">
                                        <h5>Ürün Grubu Karşılaştırması</h5>
                                        <p className="text-muted">Ürün grubu seçerek o grubun detaylı analizini görüntüleyin</p>
                                        <NdTextBox
                                            id="cmbComparisonItemGroup"
                                            parent={this}
                                            simple={true}
                                            tabIndex={this.tabIndex}
                                            upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                            onValueChanged={(e) => this.onComparisonItemGroupValueChanged(e)}  // Direkt yazma için
                                            button=
                                            {[
                                                {
                                                    id:'01',
                                                    icon:'more',
                                                    onClick:()=>
                                                    {
                                                        this.pg_cmbComparisonItemGroup.show()
                                                        this.pg_cmbComparisonItemGroup.onClick = (data) =>
                                                        {
                                                            if(data.length > 0)
                                                            {
                                                                this.cmbComparisonItemGroup.value = data[0].CODE
                                                                this.cmbComparisonItemGroup.GUID = data[0].GUID
                                                                console.log('Comparison Item Group seçildi - CODE:', data[0].CODE, 'GUID:', data[0].GUID);
                                                            }
                                                        }
                                                    }
                                                },
                                                {
                                                    id:'02',
                                                    icon:'clear',
                                                    onClick:()=>
                                                    {
                                                        this.cmbComparisonItemGroup.value = ''
                                                        this.cmbComparisonItemGroup.GUID = null
                                                    }
                                                }
                                            ]}
                                        />
                                        <NdPopGrid id={"pg_cmbComparisonItemGroup"} parent={this} container={'#' + this.props.data.id + this.tabIndex} 
                                        visible={false}
                                        position={{of:'#' + this.props.data.id + this.tabIndex}} 
                                        showTitle={true} 
                                        showBorders={true}
                                        width={'90%'}
                                        height={'90%'}
                                        title="Ürün Grubu Seç" 
                                        selection={{mode:"single"}}
                                        search={true}
                                        data = 
                                        {{
                                            source:
                                            {
                                                select:
                                                {
                                                    query : `SELECT GUID,CODE,NAME FROM ITEM_GROUP WHERE STATUS = 1 AND (UPPER(CODE) LIKE UPPER(@VAL) OR UPPER(NAME) LIKE UPPER(@VAL))`,
                                                    param : ['VAL:string|50']
                                                },
                                                sql:this.core.sql
                                            }
                                        }}
                                        >
                                            <Column dataField="CODE" caption={this.lang.t("Code")} width={'30%'} />
                                            <Column dataField="NAME" caption="Ürün Grubu" width={'70%'} defaultSortOrder="asc" />
                                        </NdPopGrid>
                                            </div>
                                    </div>
                                
                                {/* KARŞILAŞTIRMA ANALİZ BUTONU */}
                                <div className="row mt-3">
                                    <div className="col-12 text-center">
                                        <NdButton text="Karşılaştırma Analizi Yap" type="success" width="250px" onClick={this.btnComparisonAnalysisClick}/>
                                </div>
                                </div>

                                {/* Karşılaştırma Analiz grid'lerini düzelt */}
                                <div className="row mt-3">
                                    <div className="col-12">
                                        <h5>Tedarikçi Karşılaştırması</h5>
                                        <p className="text-muted">Seçilen tedarikçinin hangi ürün gruplarını tedarik ettiği ve performans detayları</p>
                                            <NdGrid id="grdSupplierComparison" parent={this} 
                                            selection={{mode:"single"}} 
                                            showBorders={true}
                                            height={'400px'} 
                                            width={'100%'}
                                            filterRow={{visible:true}} 
                                            headerFilter={{visible:true}}
                                            columnAutoWidth={true}
                                            allowColumnReordering={true}
                                            allowColumnResizing={true}
                                            loadPanel={{enabled:true}}
                                        onRowDblClick={(e) => this.onSupplierRowDblClick(e)}  // Çift tıklama ekle
                                            >                            
                                                <ColumnChooser enabled={true} />
                                            <Export fileName="Tedarikçi Karşılaştırma" enabled={true} allowExportSelectedData={true} />
                                            
                                            <Column dataField="SUPPLIER_CODE" caption="Tedarikçi Kodu" visible={true} width={120}/> 
                                            <Column dataField="SUPPLIER_NAME" caption="Tedarikçi Adı" visible={true} width={200}/> 
                                            <Column dataField="ITEM_GROUP_CODE" caption="Ürün Grubu Kodu" visible={true} width={120}/> 
                                            <Column dataField="ITEM_GROUP_NAME" caption="Ürün Grubu Adı" visible={true} width={200}/> 
                                            <Column dataField="SUPPLIER_TOTAL_AMOUNT" caption="Toplam Tutar" visible={true} format="€ #,##0.00" width={150} allowHeaderFiltering={false}/> 
                                            <Column dataField="SUPPLIER_TOTAL_PROFIT" caption="Toplam Kar" visible={true} format="€ #,##0.00" width={150} allowHeaderFiltering={false}/> 
                                            <Column dataField="SUPPLIER_PROFIT_MARGIN" caption="Kar Marjı %" visible={true} format="#0.00%" width={120} allowHeaderFiltering={false}/> 
                                            <Column dataField="SUPPLIER_ITEM_COUNT" caption="Ürün Çeşidi" visible={true} width={120} allowHeaderFiltering={false}/> 
                                            <Column dataField="SUPPLIER_TOTAL_QUANTITY" caption="Toplam Miktar" visible={true} width={120} allowHeaderFiltering={false}/> 
                                            <Column dataField="SUPPLIER_AVG_QUANTITY" caption="Ort. Miktar" visible={true} format="#,##0.00" width={120} allowHeaderFiltering={false}/> 
                                            <Column dataField="SUPPLIER_AVG_TICKET" caption="Ort. Fiş Tutarı" visible={true} format="€ #,##0.00" width={150} allowHeaderFiltering={false}/> 
                                            <Column dataField="SUPPLIER_FIRST_SALE" caption="İlk Satış" visible={true} width={120} allowHeaderFiltering={false} dataType="date" format="dd.MM.yyyy"/> 
                                            <Column dataField="SUPPLIER_LAST_SALE" caption="Son Satış" visible={true} width={120} allowHeaderFiltering={false} dataType="date" format="dd.MM.yyyy"/> 
                                                
                                                <Summary>
                                                <TotalItem column="SUPPLIER_TOTAL_AMOUNT" summaryType="sum" valueFormat={{ style: "currency", currency: Number.money.code,precision: 2}} />
                                                <TotalItem column="SUPPLIER_TOTAL_PROFIT" summaryType="sum" valueFormat={{ style: "currency", currency: Number.money.code,precision: 2}} />
                                                <TotalItem column="SUPPLIER_ITEM_COUNT" summaryType="sum" />
                                                <TotalItem column="SUPPLIER_TOTAL_QUANTITY" summaryType="sum" />
                                                </Summary>
                                            </NdGrid>
                                            </div>
                                    <div className="col-12">
                                        <h5>Ürün Grubu Karşılaştırması</h5>
                                        <p className="text-muted">Seçilen ürün grubunu hangi tedarikçilerin tedarik ettiği ve performans detayları</p>
                                            <NdGrid id="grdItemGroupComparison" parent={this} 
                                            selection={{mode:"single"}} 
                                            showBorders={true}
                                            height={'400px'} 
                                            width={'100%'}
                                            filterRow={{visible:true}} 
                                            headerFilter={{visible:true}}
                                            columnAutoWidth={true}
                                            allowColumnReordering={true}
                                            allowColumnResizing={true}
                                            loadPanel={{enabled:true}}
                                            onRowDblClick={(e) => this.onItemGroupRowDblClick(e)}  // Çift tıklama ekle
                                            >                            
                                                <ColumnChooser enabled={true} />
                                                <Export fileName="Ürün Grubu Karşılaştırma" enabled={true} allowExportSelectedData={true} />
                                                
                                                <Column dataField="ITEM_GROUP_CODE" caption="Ürün Grubu Kodu" visible={true} width={120}/> 
                                                <Column dataField="ITEM_GROUP_NAME" caption="Ürün Grubu Adı" visible={true} width={200}/> 
                                                <Column dataField="SUPPLIER_CODE" caption="Tedarikçi Kodu" visible={true} width={120}/> 
                                                <Column dataField="SUPPLIER_NAME" caption="Tedarikçi Adı" visible={true} width={200}/> 
                                                <Column dataField="GROUP_TOTAL_AMOUNT" caption="Toplam Tutar" visible={true} format="€ #,##0.00" width={150} allowHeaderFiltering={false}/> 
                                                <Column dataField="GROUP_TOTAL_PROFIT" caption="Toplam Kar" visible={true} format="€ #,##0.00" width={150} allowHeaderFiltering={false}/> 
                                                <Column dataField="GROUP_PROFIT_MARGIN" caption="Kar Marjı %" visible={true} format="#0.00%" width={120} allowHeaderFiltering={false}/> 
                                                <Column dataField="GROUP_ITEM_COUNT" caption="Ürün Çeşidi" visible={true} width={120} allowHeaderFiltering={false}/> 
                                                <Column dataField="GROUP_TOTAL_QUANTITY" caption="Toplam Miktar" visible={true} width={120} allowHeaderFiltering={false}/> 
                                                <Column dataField="GROUP_AVG_QUANTITY" caption="Ort. Miktar" visible={true} format="#,##0.00" width={120} allowHeaderFiltering={false}/> 
                                                <Column dataField="GROUP_AVG_TICKET" caption="Ort. Fiş Tutarı" visible={true} format="€ #,##0.00" width={150} allowHeaderFiltering={false}/> 
                                                <Column dataField="GROUP_FIRST_SALE" caption="İlk Satış" visible={true} width={120} allowHeaderFiltering={false} dataType="date" format="dd.MM.yyyy"/> 
                                                <Column dataField="GROUP_LAST_SALE" caption="Son Satış" visible={true} width={120} allowHeaderFiltering={false} dataType="date" format="dd.MM.yyyy"/> 
                                                    
                                                <Summary>
                                                <TotalItem column="GROUP_TOTAL_AMOUNT" summaryType="sum" valueFormat={{ style: "currency", currency: Number.money.code,precision: 2}} />
                                                <TotalItem column="GROUP_TOTAL_PROFIT" summaryType="sum" valueFormat={{ style: "currency", currency: Number.money.code,precision: 2}} />
                                                <TotalItem column="GROUP_ITEM_COUNT" summaryType="sum" />
                                                <TotalItem column="GROUP_TOTAL_QUANTITY" summaryType="sum" />
                                                </Summary>
                                            </NdGrid>
                                    </div>
                                </div>
                            </TabItem>
                        </TabPanel>
                    </div>
                </div>
                </ScrollView>
                
                {/* ÜRÜN DETAY POPUP'ı */}
                {this.state.showProductDetailPopup && (
                    <div className="modal fade show" style={{display: 'block', backgroundColor: 'rgba(0,0,0,0.5)', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1050}}>
                        <div className="modal-dialog modal-xl" style={{maxWidth: '95%', margin: '20px auto'}}>
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">{this.state.productDetailTitle}</h5>
                                    <button type="button" className="btn-close" onClick={() => this.closeProductDetailPopup()}></button>
                                </div>
                                <div className="modal-body">
                                    <NdGrid 
                                    id="grdProductDetail" 
                                    parent={this} 
                                    dataSource={this.state.productDetailData || []} 
                                    selection={{mode:"single"}} 
                                    showBorders={true}
                                    height={'600px'} 
                                    width={'100%'}
                                    filterRow={{visible:true}} 
                                    headerFilter={{visible:true}}
                                    columnAutoWidth={true}
                                    allowColumnReordering={true}
                                    allowColumnResizing={true}
                                    loadPanel={{enabled:true}}
                                    >                            
                                        <ColumnChooser enabled={true} />
                                        <Export fileName="Ürün Detayları" enabled={true} allowExportSelectedData={true} />
                                        
                                        <Column dataField="ITEM_CODE" caption="Ürün Kodu" visible={true} width={120}/> 
                                        <Column dataField="ITEM_NAME" caption="Ürün Adı" visible={true} width={250}/> 
                                        <Column dataField="ITEM_GROUP_CODE" caption="Ürün Grubu Kodu" visible={true} width={120}/> 
                                        <Column dataField="ITEM_GROUP_NAME" caption="Ürün Grubu Adı" visible={true} width={200}/> 
                                        <Column dataField="ITEM_TOTAL_QUANTITY" caption="Toplam Miktar" visible={true} format="#,##0.00" width={120} allowHeaderFiltering={false}/> 
                                        <Column dataField="ITEM_TOTAL_AMOUNT" caption="Toplam Tutar" visible={true} format="€ #,##0.00" width={150} allowHeaderFiltering={false}/> 
                                        <Column dataField="ITEM_TOTAL_PROFIT" caption="Toplam Kar" visible={true} format="€ #,##0.00" width={150} allowHeaderFiltering={false}/> 
                                        <Column dataField="ITEM_PROFIT_MARGIN" caption="Kar Marjı %" visible={true} format="#0.00%" width={120} allowHeaderFiltering={false}/> 
                                        <Column dataField="ITEM_AVG_QUANTITY" caption="Ort. Miktar" visible={true} format="#,##0.00" width={120} allowHeaderFiltering={false}/> 
                                        <Column dataField="ITEM_AVG_TICKET" caption="Ort. Fiş Tutarı" visible={true} format="€ #,##0.00" width={150} allowHeaderFiltering={false}/> 
                                        <Column dataField="ITEM_FIRST_SALE" caption="İlk Satış" visible={true} width={120} allowHeaderFiltering={false} dataType="date" format="dd.MM.yyyy"/> 
                                        <Column dataField="ITEM_LAST_SALE" caption="Son Satış" visible={true} width={120} allowHeaderFiltering={false} dataType="date" format="dd.MM.yyyy"/> 
                                        
                                        <Summary>
                                        <TotalItem column="ITEM_TOTAL_QUANTITY" summaryType="sum" valueFormat="fixedPoint" />
                                        <TotalItem column="ITEM_TOTAL_AMOUNT" summaryType="sum" valueFormat={{ style: "currency", currency: Number.money.code,precision: 2}} />
                                        <TotalItem column="ITEM_TOTAL_PROFIT" summaryType="sum" valueFormat={{ style: "currency", currency: Number.money.code,precision: 2}} />
                                        </Summary>
                                    </NdGrid>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        )
    }

    // TextBox değer değişikliği fonksiyonları
    onTrendSupplierValueChanged(e)
    {
        console.log('Trend Supplier değeri değişti:', e.value);
        // Burada otomatik arama yapabilirsiniz
    }

    onTrendItemGroupValueChanged(e)
    {
        console.log('Trend Item Group değeri değişti:', e.value);
        // Burada otomatik arama yapabilirsiniz
    }

    onComparisonSupplierValueChanged(e)
    {
        console.log('Comparison Supplier değeri değişti:', e.value);
        // Burada otomatik arama yapabilirsiniz
    }

    onComparisonItemGroupValueChanged(e)
    {
        console.log('Comparison Item Group değeri değişti:', e.value);
        // Burada otomatik arama yapabilirsiniz
    }
} 