import React from 'react';
import App from '../../../lib/app.js';
import moment from 'moment';

import Toolbar from 'devextreme-react/toolbar';
import Form, {Item,  Label } from 'devextreme-react/form';
import ScrollView from 'devextreme-react/scroll-view';

import { Chart, Series, CommonSeriesSettings, Legend, ValueAxis, Title, Tooltip, Border, ArgumentAxis, CommonAxisSettings, Grid, Margin, Label as ChartLabel, Format, Strips, Strip, ZoomAndPan } from 'devextreme-react/chart';
import PieChart, { Legend as PieLegend, Series as PieSeries, Tooltip as PieTooltip, Label as PieLabel , Connector as PieConnector, LoadingIndicator as PieLoadingIndicator} from 'devextreme-react/pie-chart';
import NdSelectBox from '../../../../core/react/devex/selectbox.js'
import NbDateRange from '../../../../core/react/bootstrap/daterange.js';
import {Export} from '../../../../core/react/devex/pivot.js';
import NdButton from '../../../../core/react/devex/button.js';
import NdPopUp from '../../../../core/react/devex/popup.js';

export default class posSalesStatisticalReport extends React.PureComponent
{
    constructor(props)
    {
        super(props)
        this.core = App.instance.core;
        this.lang = App.instance.lang;

        // Grafik türü için state kullanılacak
        this.selectedProductGroup = null // Seçili ürün grubu

        this.state = 
        {
            selectedAnalysis: 'topDay',
            selectedAnalysisType: 'general', // 'general' veya 'products'
            selectedSubOption: null, // Alt seçenek
            analysisData: {},
            productAnalysisData: {},
            productGroups: [],
            isPopupVisible: false,
            // Ürün detay popup için yeni state'ler
            selectedProduct: null,
            productDetailData: {},
            isProductDetailPopupVisible: false,
            productDetailAnalysisType: 'daily',
            productDetailChartType: 'line',
            selectBoxResetKey: Date.now(),
            popAnalysisResetKey: Date.now(),
            // Saatlik satış verisi için
            hourlySalesData: []
        },
        this.tabIndex = props.data.tabkey

        this.dtDate = new Date();
    }
    async componentDidMount()
    {
        await this.init()
    }
    async init()
    {
        this.selectedProductGroup = null;
        
        // Ürün gruplarını yükle
        let productGroups = await this.getProductGroups()
        this.setState({ productGroups })
        
        // Varsayılan analiz tipini ayarla
        this.setState({
            selectedAnalysisType: 'products',
            selectedAnalysis: 'topSellingProducts',
            chartType: 'bar'
        }, 
        async () => 
        {
            // İlk veri yüklemesini yap
            let productAnalysisData = await this.calculateProductAnalysisData('topSellingProducts')
            this.setState({ productAnalysisData })
        })
    }
    getSubOptions() {
        let { selectedAnalysisType } = this.state;
        
        if (!selectedAnalysisType) 
        {
            return [
                { id: 'topDay', name: this.lang.t("topDay") },
                { id: 'top5Days', name: this.lang.t("top5Days") },
                { id: 'top10Days', name: this.lang.t("top10Days") },
                { id: 'top15Days', name: this.lang.t("top15Days") },
                { id: 'top20Days', name: this.lang.t("top20Days") },
                { id: 'bestMonday', name: this.lang.t("bestMonday") },
                { id: 'bestTuesday', name: this.lang.t("bestTuesday") },
                { id: 'bestWednesday', name: this.lang.t("bestWednesday") },
                { id: 'bestThursday', name: this.lang.t("bestThursday") },
                { id: 'bestFriday', name: this.lang.t("bestFriday") },
                { id: 'bestSaturday', name: this.lang.t("bestSaturday") },
                { id: 'bestSunday', name: this.lang.t("bestSunday") }
            ];
        }
        
        switch(selectedAnalysisType) 
        {
            case 'best':
                return [
                    { id: 'topDay', name: this.lang.t("topDay") },
                    { id: 'top5Days', name: this.lang.t("top5Days") },
                    { id: 'top10Days', name: this.lang.t("top10Days") },
                    { id: 'top15Days', name: this.lang.t("top15Days") },
                    { id: 'top20Days', name: this.lang.t("top20Days") },
                    { id: 'bestMonday', name: this.lang.t("bestMonday") },
                    { id: 'bestTuesday', name: this.lang.t("bestTuesday") },
                    { id: 'bestWednesday', name: this.lang.t("bestWednesday") },
                    { id: 'bestThursday', name: this.lang.t("bestThursday") },
                    { id: 'bestFriday', name: this.lang.t("bestFriday") },
                    { id: 'bestSaturday', name: this.lang.t("bestSaturday") },
                    { id: 'bestSunday', name: this.lang.t("bestSunday") }
                ];
            case 'worst':
                return [
                    { id: 'worstDay', name: this.lang.t("worstDay") },
                    { id: 'worst5Days', name: this.lang.t("worst5Days") },
                    { id: 'worst10Days', name: this.lang.t("worst10Days") },
                    { id: 'worst15Days', name: this.lang.t("worst15Days") },
                    { id: 'worst20Days', name: this.lang.t("worst20Days") },
                    { id: 'worstMonday', name: this.lang.t("worstMonday") },
                    { id: 'worstTuesday', name: this.lang.t("worstTuesday") },
                    { id: 'worstWednesday', name: this.lang.t("worstWednesday") },
                    { id: 'worstThursday', name: this.lang.t("worstThursday") },
                    { id: 'worstFriday', name: this.lang.t("worstFriday") },
                    { id: 'worstSaturday', name: this.lang.t("worstSaturday") },
                    { id: 'worstSunday', name: this.lang.t("worstSunday") }
                ];
            case 'comparison':
                return [
                    { id: 'weekendVsWeekday', name: this.lang.t("weekdayVsWeekend") },
                    { id: 'aboveAverage', name: this.lang.t("aboveAverage") },
                    { id: 'belowAverage', name: this.lang.t("belowAverage") },
                    { id: 'firstWeekVsLastWeek', name: this.lang.t("firstWeekVsLastWeek") }
                ];
            case 'distribution':
                return [
                    { id: 'monthlyDistribution', name: this.lang.t("monthlyDistribution") },
                    { id: 'weeklyDistribution', name: this.lang.t("weeklyDistribution") },
                    { id: 'dayOfWeekDistribution', name: this.lang.t("dayOfWeekDistribution") }
                ];
            case 'trend':
                return [
                    { id: 'growthTrend', name: this.lang.t("growthTrend") },
                    { id: 'weeklyTrend', name: this.lang.t("weeklyTrend") },
                    { id: 'monthlyTrend', name: this.lang.t("monthlyTrend") }
                ];
            case 'products':
                return [
                    { id: 'topSellingProducts', name: this.lang.t("topProducts") },
                    { id: 'worstSellingProducts', name: this.lang.t("worstProducts") },
                    { id: 'topSellingProductGroups', name: this.lang.t("topProductGroups") },
                    { id: 'topSellingProductsInGroup', name: this.lang.t("topSellingProductsInGroup") }
                ];
            default:
                return [
                    { id: 'topDay', name: this.lang.t("topDay") },
                    { id: 'top5Days', name: this.lang.t("top5Days") },
                    { id: 'top10Days', name: this.lang.t("top10Days") },
                    { id: 'top15Days', name: this.lang.t("top15Days") },
                    { id: 'top20Days', name: this.lang.t("top20Days") },
                    { id: 'bestMonday', name: this.lang.t("bestMonday") },
                    { id: 'bestTuesday', name: this.lang.t("bestTuesday") },
                    { id: 'bestWednesday', name: this.lang.t("bestWednesday") },
                    { id: 'bestThursday', name: this.lang.t("bestThursday") },
                    { id: 'bestFriday', name: this.lang.t("bestFriday") },
                    { id: 'bestSaturday', name: this.lang.t("bestSaturday") },
                    { id: 'bestSunday', name: this.lang.t("bestSunday") }
                ];
        }
    }

    calculateAnalysisData(dailySalesData) 
    {
        let analysisData = {}
        
        if (dailySalesData.length > 0) 
        {
            // En yüksek satış günü
            let topDay = dailySalesData.reduce((max, day) => 
                day.totalSales > max.totalSales ? day : max
            )
            analysisData.topDay = 
            [{
                category: topDay.date,
                value: topDay.totalSales,
                title: this.lang.t("topDay")
            }]
            
            // En düşük satış günü
            let worstDay = dailySalesData.reduce((min, day) => 
                day.totalSales < min.totalSales ? day : min
            )
            analysisData.worstDay = 
            [{
                category: worstDay.date,
                value: worstDay.totalSales,
                title: this.lang.t("worstDay")
            }]
            
            // En iyi 10 gün
            let top10Days = dailySalesData
                .sort((a, b) => b.totalSales - a.totalSales)
                .slice(0, 10)
                .map((day, index) => 
                ({
                    category: day.date,
                    value: day.totalSales,
                    title: this.lang.t("top10Days"),
                    rank: index + 1
                }))
            analysisData.top10Days = top10Days
            
            // En kötü 10 gün
            let worst10Days = dailySalesData
                .sort((a, b) => a.totalSales - b.totalSales)
                .slice(0, 10)
                .map((day, index) => 
                ({
                    category: day.date,
                    value: day.totalSales,
                    title: this.lang.t("worst10Days"),
                    rank: index + 1
                }))
                
            analysisData.worst10Days = worst10Days
            
            // Ortalama üstü günler
            let average = dailySalesData.reduce((sum, day) => sum + day.totalSales, 0) / dailySalesData.length
            let aboveAverageDays = dailySalesData
                .filter(day => day.totalSales > average)
                .sort((a, b) => b.totalSales - a.totalSales)
                .map(day => ({
                    category: day.date,
                    value: day.totalSales,
                    title: this.lang.t("aboveAverage")
                }))
            analysisData.aboveAverage = aboveAverageDays
            
            // Hafta sonu vs hafta içi
            let weekendDays = dailySalesData.filter(day => 
            {
                let date = moment(day.date, 'DD/MM/YYYY')
                return date.day() === 0 || date.day() === 6
            })
            let weekdays = dailySalesData.filter(day => 
            {
                let date = moment(day.date, 'DD/MM/YYYY')
                return date.day() !== 0 && date.day() !== 6
            })
            
            let weekendTotal = weekendDays.reduce((sum, day) => sum + day.totalSales, 0)
            let weekdayTotal = weekdays.reduce((sum, day) => sum + day.totalSales, 0)
            
            analysisData.weekendVsWeekday = 
            [
                { category: this.lang.t("weekday"), value: weekdayTotal, title: this.lang.t("weekdayVsWeekend") },
                { category: this.lang.t("weekend"), value: weekendTotal, title: this.lang.t("weekdayVsWeekend") }
            ]
            
            // Aylık dağılım
            let monthlyData = {}
            dailySalesData.forEach(day => 
            {
                let month = moment(day.date, 'DD/MM/YYYY').format('MMMM YYYY')
                if (!monthlyData[month]) 
                {
                    monthlyData[month] = 0
                }
                monthlyData[month] += day.totalSales
            })
            
            // Ayları kronolojik sıraya koy
            let sortedMonths = Object.keys(monthlyData).sort((a, b) => 
            {
                return moment(a, 'MMMM YYYY').diff(moment(b, 'MMMM YYYY'))
            })
            
            analysisData.monthlyDistribution = sortedMonths.map(month => 
            ({
                category: month,
                value: monthlyData[month],
                title: this.lang.t("monthlyDistribution")
            }))
            
            // Büyüme trendi (ilk yarı vs son yarı karşılaştırması)
            if (dailySalesData.length >= 4) 
            {
                let midPoint = Math.floor(dailySalesData.length / 2)
                let firstHalf = dailySalesData.slice(0, midPoint).reduce((sum, day) => sum + day.totalSales, 0)
                let secondHalf = dailySalesData.slice(midPoint).reduce((sum, day) => sum + day.totalSales, 0)
                
                analysisData.growthTrend = 
                [
                    { category: this.lang.t("firstHalf"), value: firstHalf, title: this.lang.t("growthTrend") },
                    { category: this.lang.t("secondHalf"), value: secondHalf, title: this.lang.t("growthTrend") }
                ]
            
            // Gün bazlı analizler
            let dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            let dayNumbers = [0, 1, 2, 3, 4, 5, 6];
            
            dayNumbers.forEach((dayNum, index) => {
                let dayName = dayNames[index];
                let dayData = dailySalesData.filter(day => 
                {
                    let date = moment(day.date, 'DD/MM/YYYY');
                    return date.day() === dayNum;
                });
                
                if (dayData.length > 0) 
                {
                    // En iyi günler
                    let bestDays = dayData
                        .sort((a, b) => b.totalSales - a.totalSales)
                        .slice(0, 10)
                        .map((day, idx) => 
                        ({
                            category: day.date,
                            value: day.totalSales,
                            title: this.lang.t(`best${dayName}`),
                            rank: idx + 1
                        }));
                    analysisData[`best${dayName}`] = bestDays;
                    
                    // En kötü günler
                    let worstDays = dayData
                        .sort((a, b) => a.totalSales - b.totalSales)
                        .slice(0, 10)
                        .map((day, idx) => 
                        ({
                            category: day.date,
                            value: day.totalSales,
                            title: this.lang.t(`worst${dayName}`),
                            rank: idx + 1
                        }));
                    analysisData[`worst${dayName}`] = worstDays;
                }
            });
            
            // Ek analizler
            analysisData.top5Days = dailySalesData
                .sort((a, b) => b.totalSales - a.totalSales)
                .slice(0, 5)
                .map((day, index) => 
                ({
                    category: day.date,
                    value: day.totalSales,
                    title: this.lang.t("top5Days"),
                    rank: index + 1
                }));
                
            analysisData.top15Days = dailySalesData
                .sort((a, b) => b.totalSales - a.totalSales)
                .slice(0, 15)
                .map((day, index) =>
                ({
                    category: day.date,
                    value: day.totalSales,
                    title: this.lang.t("top15Days"),
                    rank: index + 1
                }));
                
            analysisData.top20Days = dailySalesData
                .sort((a, b) => b.totalSales - a.totalSales)
                .slice(0, 20)
                .map((day, index) => 
                ({
                    category: day.date,
                    value: day.totalSales,
                    title: this.lang.t("top20Days"),
                    rank: index + 1
                }));
                
            analysisData.worst5Days = dailySalesData
                .sort((a, b) => a.totalSales - b.totalSales)
                .slice(0, 5)
                .map((day, index) => 
                ({
                    category: day.date,
                    value: day.totalSales,
                    title: this.lang.t("worst5Days"),
                    rank: index + 1
                }));
                
            analysisData.worst15Days = dailySalesData
                .sort((a, b) => a.totalSales - b.totalSales)
                .slice(0, 15)
                .map((day, index) => 
                ({
                    category: day.date,
                    value: day.totalSales,
                    title: this.lang.t("worst15Days"),
                    rank: index + 1
                }));
                
            analysisData.worst20Days = dailySalesData
                .sort((a, b) => a.totalSales - b.totalSales)
                .slice(0, 20)
                .map((day, index) => 
                ({
                    category: day.date,
                    value: day.totalSales,
                    title: this.lang.t("worst20Days"),
                    rank: index + 1
                }));
                
            // Ortalama altı günler
            let belowAverageDays = dailySalesData
                .filter(day => day.totalSales < average)
                .sort((a, b) => a.totalSales - b.totalSales)
                .map(day => 
                ({
                    category: day.date,
                    value: day.totalSales,
                    title: this.lang.t("belowAverage")
                }))
            analysisData.belowAverage = belowAverageDays
            
            // İlk hafta vs son hafta karşılaştırması
            if (dailySalesData.length >= 7) 
            {
                let firstWeek = dailySalesData.slice(0, 7).reduce((sum, day) => sum + day.totalSales, 0)
                let lastWeek = dailySalesData.slice(-7).reduce((sum, day) => sum + day.totalSales, 0)
                
                analysisData.firstWeekVsLastWeek =
                [
                    { category: this.lang.t("firstWeek"), value: firstWeek, title: this.lang.t("firstWeekVsLastWeek") },
                    { category: this.lang.t("lastWeek"), value: lastWeek, title: this.lang.t("firstWeekVsLastWeek") }
                ]
            }
            
            // Haftalık dağılım
            let weeklyData = {}
            dailySalesData.forEach(day => 
            {
                let week = moment(day.date, 'DD/MM/YYYY').format('YYYY-[W]WW')
                if (!weeklyData[week]) 
                {
                    weeklyData[week] = 0
                }
                weeklyData[week] += day.totalSales
            })
            
            let sortedWeeks = Object.keys(weeklyData).sort((a, b) => 
            {
                return moment(a, 'YYYY-[W]WW').diff(moment(b, 'YYYY-[W]WW'))
            })
            
            analysisData.weeklyDistribution = sortedWeeks.map(week => 
            ({
                category: week,
                value: weeklyData[week],
                title: this.lang.t("weeklyDistribution")
            }))
            
            // Günlük dağılım (haftanın günleri)
            let dayOfWeekData = {}
            
            // Her gün için toplam satışları hesapla
            dailySalesData.forEach(day => 
            {
                let date = moment(day.date, 'DD/MM/YYYY')
                let dayOfWeek = date.format('dddd')
                
                if (!dayOfWeekData[dayOfWeek]) 
                {
                    dayOfWeekData[dayOfWeek] = 0
                }
                dayOfWeekData[dayOfWeek] += day.totalSales
            })
            
            analysisData.dayOfWeekDistribution = Object.keys(dayOfWeekData).map(dayName => 
            ({
                category: this.lang.t(dayName.toLowerCase()),
                value: dayOfWeekData[dayName],
                title: this.lang.t("dayOfWeekDistribution")
            }))
            
            // Haftalık trend
            if (weeklyData && Object.keys(weeklyData).length > 1) 
            {
                analysisData.weeklyTrend = sortedWeeks.map(week => 
                ({
                    category: week,
                    value: weeklyData[week],
                    title: this.lang.t("weeklyTrend")
                }))
            }
            
            // Aylık trend
            if (monthlyData && Object.keys(monthlyData).length > 1) 
            {
                analysisData.monthlyTrend = sortedMonths.map(month => 
                ({
                    category: month,
                    value: monthlyData[month],
                    title: this.lang.t("monthlyTrend")
                }))
            }
            }
        }
        
        this.setState({ analysisData })
    }
    
    async getProductGroups() {
        // Loading başlat
        App.instance.setState({isExecute:true})
        
        try {
            let query = {
                query: `SELECT DISTINCT 
                            POS.ITEM_GRP_CODE,
                            POS.ITEM_GRP_NAME
                        FROM POS_SALE_VW_01 POS WITH (NOLOCK)
                        WHERE POS.STATUS = 1 
                        AND POS.DOC_DATE >= @FIRST_DATE 
                        AND POS.DOC_DATE <= @LAST_DATE
                        AND POS.DEVICE <> '9999'
                        AND POS.TOTAL > 0
                        AND POS.TYPE = 0
                        AND POS.ITEM_GRP_CODE IS NOT NULL
                        AND POS.ITEM_GRP_NAME IS NOT NULL
                        ORDER BY POS.ITEM_GRP_NAME`,
                param: ['FIRST_DATE:date', 'LAST_DATE:date'],
                value: [this.dtDate.startDate, this.dtDate.endDate]
            }
            
            let result = await this.core.sql.execute(query)
            
            if (result && result.result && result.result.recordset) 
            {
                let groups = result.result.recordset.map(item => 
                ({
                    id: item.ITEM_GRP_CODE,
                    name: item.ITEM_GRP_NAME
                }))
                return groups
            }
            
            return []
        } 
        catch (error) 
        {
            console.error('Error getting product groups:', error)
            return []
        }
        finally 
        {
            // Loading bitir
            App.instance.setState({isExecute:false})
        }
    }

    // Ürün detay analizi için yeni fonksiyon
    async calculateProductDetailData(productCode, productName, analysisType = 'daily') 
    {
        // Loading başlat
        App.instance.setState({isExecute:true})
        
        try {
            let productDetailData = {}
            
            if (analysisType === 'daily') 
            {
                // Günlük satış verileri
                let tmpQuery = 
                {
                    query: `SELECT 
                                POS.DOC_DATE,
                                SUM(POS.QUANTITY) AS TOTAL_QUANTITY,
                                SUM(POS.TOTAL) AS TOTAL_AMOUNT,
                                COUNT(DISTINCT POS.GUID) AS SALE_COUNT
                            FROM POS_SALE_VW_01 POS WITH (NOLOCK)
                            WHERE POS.STATUS = 1 
                            AND POS.DOC_DATE >= @FIRST_DATE 
                            AND POS.DOC_DATE <= @LAST_DATE
                            AND POS.DEVICE <> '9999'
                            AND POS.TOTAL > 0
                            AND POS.TYPE = 0
                            AND POS.ITEM_CODE = @ITEM_CODE
                            GROUP BY POS.DOC_DATE
                            ORDER BY POS.DOC_DATE`,
                    param: ['FIRST_DATE:date', 'LAST_DATE:date', 'ITEM_CODE:string|25'],
                    value: [this.dtDate.startDate, this.dtDate.endDate, productCode]
                }

                let tmpData = await this.core.sql.execute(tmpQuery)
                
                if (tmpData?.result?.recordset?.length > 0) 
                {
                    productDetailData.daily = tmpData.result.recordset.map((item) => 
                    ({
                        category: moment(item.DOC_DATE).format('DD/MM/YYYY'),
                        value: parseFloat(item.TOTAL_AMOUNT) || 0,
                        quantity: parseFloat(item.TOTAL_QUANTITY) || 0,
                        saleCount: parseInt(item.SALE_COUNT) || 0,
                        date: item.DOC_DATE,
                        title: `${productName} - ${this.lang.t("dailySales")}`
                    }))
                } else {
                    productDetailData.daily = []
                }
            }
            
            if (analysisType === 'weekly') 
            {
                // Haftalık satış verileri
                let tmpQuery = 
                {
                    query: `SELECT 
                                DATEPART(WEEK, POS.DOC_DATE) AS WEEK_NUMBER,
                                DATEPART(YEAR, POS.DOC_DATE) AS YEAR_NUMBER,
                                MIN(POS.DOC_DATE) AS WEEK_START,
                                MAX(POS.DOC_DATE) AS WEEK_END,
                                SUM(POS.QUANTITY) AS TOTAL_QUANTITY,
                                SUM(POS.TOTAL) AS TOTAL_AMOUNT,
                                COUNT(DISTINCT POS.GUID) AS SALE_COUNT
                            FROM POS_SALE_VW_01 POS WITH (NOLOCK)
                            WHERE POS.STATUS = 1 
                            AND POS.DOC_DATE >= @FIRST_DATE 
                            AND POS.DOC_DATE <= @LAST_DATE
                            AND POS.DEVICE <> '9999'
                            AND POS.TOTAL > 0
                            AND POS.TYPE = 0
                            AND POS.ITEM_CODE = @ITEM_CODE
                            GROUP BY DATEPART(WEEK, POS.DOC_DATE), DATEPART(YEAR, POS.DOC_DATE)
                            ORDER BY YEAR_NUMBER, WEEK_NUMBER`,
                    param: ['FIRST_DATE:date', 'LAST_DATE:date', 'ITEM_CODE:string|25'],
                    value: [this.dtDate.startDate, this.dtDate.endDate, productCode]
                }

                let tmpData = await this.core.sql.execute(tmpQuery)
                
                if (tmpData?.result?.recordset?.length > 0) 
                {
                    productDetailData.weekly = tmpData.result.recordset.map((item) => 
                    ({
                        category: `${this.lang.t("week")} ${item.WEEK_NUMBER} (${moment(item.WEEK_START).format('DD/MM')} - ${moment(item.WEEK_END).format('DD/MM')})`,
                        value: parseFloat(item.TOTAL_AMOUNT) || 0,
                        quantity: parseFloat(item.TOTAL_QUANTITY) || 0,
                        saleCount: parseInt(item.SALE_COUNT) || 0,
                        weekNumber: item.WEEK_NUMBER,
                        yearNumber: item.YEAR_NUMBER,
                        title: `${productName} - ${this.lang.t("weeklySales")}`
                    }))
                } 
                else
                {
                    productDetailData.weekly = []
                }
            }
            
            if (analysisType === 'monthly') 
            {
                // Aylık satış verileri
                let tmpQuery = 
                {
                    query: `SELECT 
                                DATEPART(MONTH, POS.DOC_DATE) AS MONTH_NUMBER,
                                DATEPART(YEAR, POS.DOC_DATE) AS YEAR_NUMBER,
                                SUM(POS.QUANTITY) AS TOTAL_QUANTITY,
                                SUM(POS.TOTAL) AS TOTAL_AMOUNT,
                                COUNT(DISTINCT POS.GUID) AS SALE_COUNT
                            FROM POS_SALE_VW_01 POS WITH (NOLOCK)
                            WHERE POS.STATUS = 1 
                            AND POS.DOC_DATE >= @FIRST_DATE 
                            AND POS.DOC_DATE <= @LAST_DATE
                            AND POS.DEVICE <> '9999'
                            AND POS.TOTAL > 0
                            AND POS.TYPE = 0
                            AND POS.ITEM_CODE = @ITEM_CODE
                            GROUP BY DATEPART(MONTH, POS.DOC_DATE), DATEPART(YEAR, POS.DOC_DATE)
                            ORDER BY YEAR_NUMBER, MONTH_NUMBER`,
                    param: ['FIRST_DATE:date', 'LAST_DATE:date', 'ITEM_CODE:string|25'],
                    value: [this.dtDate.startDate, this.dtDate.endDate, productCode]
                }

                let tmpData = await this.core.sql.execute(tmpQuery)
                
                if (tmpData?.result?.recordset?.length > 0) 
                {
                    productDetailData.monthly = tmpData.result.recordset.map((item) => 
                    ({
                        category: moment(`${item.YEAR_NUMBER}-${item.MONTH_NUMBER}-01`).format('MMMM YYYY'),
                        value: parseFloat(item.TOTAL_AMOUNT) || 0,
                        quantity: parseFloat(item.TOTAL_QUANTITY) || 0,
                        saleCount: parseInt(item.SALE_COUNT) || 0,
                        monthNumber: item.MONTH_NUMBER,
                        yearNumber: item.YEAR_NUMBER,
                        title: `${productName} - ${this.lang.t("monthlySales")}`
                    }))
                } 
                else 
                {
                    productDetailData.monthly = []
                }
            }
            
            if (analysisType === 'dayOfWeek') 
            {
                // Haftanın günlerine göre satış verileri
                let tmpQuery = 
                {
                    query: `SELECT 
                                DATEPART(WEEKDAY, POS.DOC_DATE) AS DAY_OF_WEEK,
                                SUM(POS.QUANTITY) AS TOTAL_QUANTITY,
                                SUM(POS.TOTAL) AS TOTAL_AMOUNT,
                                COUNT(DISTINCT POS.GUID) AS SALE_COUNT
                            FROM POS_SALE_VW_01 POS WITH (NOLOCK)
                            WHERE POS.STATUS = 1 
                            AND POS.DOC_DATE >= @FIRST_DATE 
                            AND POS.DOC_DATE <= @LAST_DATE
                            AND POS.DEVICE <> '9999'
                            AND POS.TOTAL > 0
                            AND POS.TYPE = 0
                            AND POS.ITEM_CODE = @ITEM_CODE
                            GROUP BY DATEPART(WEEKDAY, POS.DOC_DATE)
                            ORDER BY DAY_OF_WEEK`,
                    param: ['FIRST_DATE:date', 'LAST_DATE:date', 'ITEM_CODE:string|25'],
                    value: [this.dtDate.startDate, this.dtDate.endDate, productCode]
                }

                let tmpData = await this.core.sql.execute(tmpQuery)
                
                if (tmpData?.result?.recordset?.length > 0) 
                {
                    let dayNames = ['', 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
                    productDetailData.dayOfWeek = tmpData.result.recordset.map((item) => 
                    ({
                        category: this.lang.t(dayNames[item.DAY_OF_WEEK]),
                        value: parseFloat(item.TOTAL_AMOUNT) || 0,
                        quantity: parseFloat(item.TOTAL_QUANTITY) || 0,
                        saleCount: parseInt(item.SALE_COUNT) || 0,
                        dayOfWeek: item.DAY_OF_WEEK,
                        title: `${productName} - ${this.lang.t("dayOfWeekDistribution")}`
                    }))
                } 
                else 
                {
                    productDetailData.dayOfWeek = []
                }
            }
            
            if (analysisType === 'yearly') 
            {
                let tmpQuery = {
                    query: `SELECT 
                                DATEPART(YEAR, POS.DOC_DATE) AS YEAR_NUMBER,
                                SUM(POS.QUANTITY) AS TOTAL_QUANTITY,
                                SUM(POS.TOTAL) AS TOTAL_AMOUNT,
                                COUNT(DISTINCT POS.GUID) AS SALE_COUNT
                            FROM POS_SALE_VW_01 POS WITH (NOLOCK)
                            WHERE POS.STATUS = 1 
                            AND POS.DOC_DATE >= @FIRST_DATE 
                            AND POS.DOC_DATE <= @LAST_DATE
                            AND POS.DEVICE <> '9999'
                            AND POS.TOTAL > 0
                            AND POS.TYPE = 0
                            AND POS.ITEM_CODE = @ITEM_CODE
                            GROUP BY DATEPART(YEAR, POS.DOC_DATE)
                            ORDER BY YEAR_NUMBER`,
                    param: ['FIRST_DATE:date', 'LAST_DATE:date', 'ITEM_CODE:string|25'],
                    value: [this.dtDate.startDate, this.dtDate.endDate, productCode]
                }
                let tmpData = await this.core.sql.execute(tmpQuery)
                if (tmpData?.result?.recordset?.length > 0) 
                {
                    productDetailData.yearly = tmpData.result.recordset.map((item) => 
                    ({
                        category: item.YEAR_NUMBER ? item.YEAR_NUMBER.toString() : '',
                        value: parseFloat(item.TOTAL_AMOUNT) || 0,
                        quantity: parseFloat(item.TOTAL_QUANTITY) || 0,
                        saleCount: parseInt(item.SALE_COUNT) || 0,
                        yearNumber: item.YEAR_NUMBER,
                        title: `${productName} - ${this.lang.t("yearlySales")}`
                    }))
                } 
                else 
                {
                    productDetailData.yearly = []
                }
            }
            
            return productDetailData
        }
        catch (err) 
        {
            console.error('Error in calculateProductDetailData:', err)
            return {}
        }
        finally 
        {
            // Loading bitir
            App.instance.setState({isExecute:false})
        }
    }

    async calculateProductAnalysisData(analysisType) 
    {
        // Loading başlat
        App.instance.setState({isExecute:true})
        
        try {
            let productAnalysisData = {}
            
            if (analysisType === 'topSellingProducts') 
            {
                // En çok satan ürünler
                let tmpQuery = 
                {
                    query: `SELECT TOP 20 
                                POS.ITEM_CODE,
                                POS.ITEM_NAME,
                                SUM(POS.QUANTITY) AS TOTAL_QUANTITY,
                                SUM(POS.TOTAL) AS TOTAL_AMOUNT
                            FROM POS_SALE_VW_01 POS WITH (NOLOCK)
                            WHERE POS.STATUS = 1 
                            AND POS.DOC_DATE >= @FIRST_DATE 
                            AND POS.DOC_DATE <= @LAST_DATE
                            AND POS.DEVICE <> '9999'
                            AND POS.TOTAL > 0
                            AND POS.TYPE = 0
                            GROUP BY POS.ITEM_CODE, POS.ITEM_NAME
                            ORDER BY TOTAL_AMOUNT DESC`,
                    param: ['FIRST_DATE:date', 'LAST_DATE:date'],
                    value: [this.dtDate.startDate, this.dtDate.endDate]
                }

                let tmpData = await this.core.sql.execute(tmpQuery)
                
                if (tmpData?.result?.recordset?.length > 0) 
                {
                    productAnalysisData.topSellingProducts = tmpData.result.recordset.map((item, index) => 
                    ({
                        category: `${item.ITEM_CODE} - ${item.ITEM_NAME}`,
                        value: parseFloat(item.TOTAL_AMOUNT) || 0,
                        quantity: parseFloat(item.TOTAL_QUANTITY) || 0,
                        rank: index + 1,
                        title: this.t("productAnalysis.topSellingProducts"),
                        itemCode: item.ITEM_CODE,
                        itemName: item.ITEM_NAME
                    }))
                } 
                else 
                {
                    productAnalysisData.topSellingProducts = []
                }
            }
            
            if (analysisType === 'worstSellingProducts') 
            {
                // En az satan ürünler
                let tmpQuery = {
                    query: `SELECT TOP 20 
                                POS.ITEM_CODE,
                                POS.ITEM_NAME,
                                SUM(POS.QUANTITY) AS TOTAL_QUANTITY,
                                SUM(POS.TOTAL) AS TOTAL_AMOUNT
                            FROM POS_SALE_VW_01 POS WITH (NOLOCK)
                            WHERE POS.STATUS = 1 
                            AND POS.DOC_DATE >= @FIRST_DATE 
                            AND POS.DOC_DATE <= @LAST_DATE
                            AND POS.DEVICE <> '9999'
                            AND POS.TOTAL > 0
                            AND POS.TYPE = 0
                            GROUP BY POS.ITEM_CODE, POS.ITEM_NAME
                            ORDER BY TOTAL_AMOUNT ASC`,
                    param: ['FIRST_DATE:date', 'LAST_DATE:date'],
                    value: [this.dtDate.startDate, this.dtDate.endDate]
                }

                let tmpData = await this.core.sql.execute(tmpQuery)
                
                if (tmpData?.result?.recordset?.length > 0) 
                {
                    productAnalysisData.worstSellingProducts = tmpData.result.recordset.map((item, index) => 
                    ({
                        category: `${item.ITEM_CODE} - ${item.ITEM_NAME}`,
                        value: parseFloat(item.TOTAL_AMOUNT) || 0,
                        quantity: parseFloat(item.TOTAL_QUANTITY) || 0,
                        rank: index + 1,
                        title: this.t("productAnalysis.worstSellingProducts"),
                        itemCode: item.ITEM_CODE,
                        itemName: item.ITEM_NAME
                    }))
                } 
                else 
                {
                    productAnalysisData.worstSellingProducts = []
                }
            }
            
            if (analysisType === 'topSellingProductsInGroup' && this.selectedProductGroup) 
            {
                // Seçili gruptaki en çok satan ürünler
                let tmpQuery = 
                {
                    query: `SELECT TOP 20 
                                POS.ITEM_CODE,
                                POS.ITEM_NAME,
                                POS.ITEM_GRP_CODE,
                                POS.ITEM_GRP_NAME,
                                SUM(POS.QUANTITY) AS TOTAL_QUANTITY,
                                SUM(POS.TOTAL) AS TOTAL_AMOUNT
                            FROM POS_SALE_VW_01 POS WITH (NOLOCK)
                            WHERE POS.STATUS = 1 
                            AND POS.DOC_DATE >= @FIRST_DATE 
                            AND POS.DOC_DATE <= @LAST_DATE
                            AND POS.DEVICE <> '9999'
                            AND POS.TOTAL > 0
                            AND POS.TYPE = 0
                            AND POS.ITEM_GRP_CODE = @GROUP_CODE
                            GROUP BY POS.ITEM_CODE, POS.ITEM_NAME, POS.ITEM_GRP_CODE, POS.ITEM_GRP_NAME
                            ORDER BY TOTAL_AMOUNT DESC`,
                    param: ['FIRST_DATE:date', 'LAST_DATE:date', 'GROUP_CODE:string|25'],
                    value: [this.dtDate.startDate, this.dtDate.endDate, this.selectedProductGroup]
                }

                let tmpData = await this.core.sql.execute(tmpQuery)
                
                if (tmpData?.result?.recordset?.length > 0) 
                {
                    productAnalysisData.topSellingProductsInGroup = tmpData.result.recordset.map((item, index) => 
                    ({
                        category: `${item.ITEM_CODE} - ${item.ITEM_NAME}`,
                        value: parseFloat(item.TOTAL_AMOUNT) || 0,
                        quantity: parseFloat(item.TOTAL_QUANTITY) || 0,
                        rank: index + 1,
                        title: this.t("productAnalysis.topSellingProductsInGroup"),
                        itemCode: item.ITEM_CODE,
                        itemName: item.ITEM_NAME
                    }))
                } 
                else 
                {
                    productAnalysisData.topSellingProductsInGroup = []
                }
            }
            
            if (analysisType === 'topSellingProductGroups') 
            {
                // En çok satan ürün grupları
                let tmpQuery = 
                {
                    query: `SELECT TOP 15 
                                POS.ITEM_GRP_CODE,
                                POS.ITEM_GRP_NAME AS GROUP_NAME,
                                SUM(POS.TOTAL) AS TOTAL_AMOUNT,
                                COUNT(DISTINCT POS.ITEM_CODE) AS ITEM_COUNT
                            FROM POS_SALE_VW_01 POS WITH (NOLOCK)
                            WHERE POS.STATUS = 1 
                            AND POS.DOC_DATE >= @FIRST_DATE 
                            AND POS.DOC_DATE <= @LAST_DATE
                            AND POS.DEVICE <> '9999'
                            AND POS.TOTAL > 0
                            AND POS.TYPE = 0
                            GROUP BY POS.ITEM_GRP_CODE, POS.ITEM_GRP_NAME
                            ORDER BY TOTAL_AMOUNT DESC`,
                    param: ['FIRST_DATE:date', 'LAST_DATE:date'],
                    value: [this.dtDate.startDate, this.dtDate.endDate]
                }

                let tmpData = await this.core.sql.execute(tmpQuery)
                
                if (tmpData?.result?.recordset?.length > 0) 
                {
                    productAnalysisData.topSellingProductGroups = tmpData.result.recordset.map((item, index) => 
                    ({
                        category: item.GROUP_NAME,
                        value: parseFloat(item.TOTAL_AMOUNT) || 0,
                        itemCount: parseInt(item.ITEM_COUNT) || 0,
                        groupCode: item.ITEM_GRP_CODE,
                        rank: index + 1,
                        title: this.t("productAnalysis.topSellingProductGroups")
                    }))
                } 
                else 
                {
                    productAnalysisData.topSellingProductGroups = []
                }
            }
            
            return productAnalysisData
        }
        catch (err) 
        {
            console.error('Error in calculateProductAnalysisData:', err)
            return {}
        }
        finally 
        {
            // Loading bitir
            App.instance.setState({isExecute:false})
        }
    }


    render()
    {
        return(
            <div id={this.props.data.id + this.tabIndex}>
                <ScrollView>
                    <div className="row px-2 pt-2">
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
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <Form>
                                <Item>
                                    <Label text={this.lang.t("dtDate")} alignment="right" />
                                    <NbDateRange id={"dtDate"} parent={this} startDate={moment(new Date())} endDate={moment(new Date())}/>
                                </Item>
                            </Form>
                        </div>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                        </div>
                        <div className="col-12">
                        </div>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <NdButton text={this.lang.t("btnGet")} type="default" stylingMode="contained" width={'100%'}
                            onClick={async (e)=>
                            {
                                let tmpQuery = 
                                {
                                    query : `SELECT 
                                            POS.DOC_DATE AS DOC_DATE, 
                                            POS.DEVICE AS DEVICE, 
                                            CASE WHEN POS.TYPE = 0 THEN 'VENTE' ELSE 'REMB.MNT' END AS DOC_TYPE, 
                                            'SALES' AS TITLE, 
                                            'HT' AS TYPE, 
                                            POS.VAT_RATE AS VAT_RATE, 
                                            CASE WHEN POS.TYPE = 0 THEN SUM(POS.FAMOUNT) ELSE SUM(POS.FAMOUNT) * -1 END AS AMOUNT 
                                            FROM POS_SALE_VW_01 AS POS 
                                            WHERE POS.STATUS = 1 AND POS.DOC_DATE >= @START AND POS.DOC_DATE <= @END AND POS.DEVICE <> '9999' AND POS.TOTAL <> 0 
                                            GROUP BY POS.DOC_DATE,POS.TYPE,POS.VAT_RATE,POS.DEVICE 
                                            UNION ALL 
                                            SELECT 
                                            POS.DOC_DATE AS DOC_DATE, 
                                            POS.DEVICE AS DEVICE, 
                                            CASE WHEN POS.TYPE = 0 THEN 'VENTE' ELSE 'REMB.MNT' END AS DOC_TYPE, 
                                            'SALES' AS TITLE, 
                                            'TVA' AS TYPE, 
                                            POS.VAT_RATE AS VAT_RATE, 
                                            CASE WHEN POS.TYPE = 0 THEN SUM(POS.VAT) ELSE SUM(POS.VAT) * -1 END AS AMOUNT 
                                            FROM POS_SALE_VW_01 AS POS 
                                            WHERE POS.STATUS = 1 AND POS.DOC_DATE >= @START AND POS.DOC_DATE <= @END AND POS.DEVICE <> '9999' AND POS.TOTAL <> 0 
                                            GROUP BY POS.DOC_DATE,POS.TYPE,POS.VAT_RATE,POS.DEVICE 
                                            UNION ALL 
                                            SELECT 
                                            POS.DOC_DATE AS DOC_DATE, 
                                            POS.DEVICE AS DEVICE, 
                                            CASE WHEN POS.TYPE = 0 THEN 'VENTE' ELSE 'REMB.MNT' END AS DOC_TYPE, 
                                            'PAYMENT' AS TITLE, 
                                            PAY_TYPE_NAME AS TYPE, 
                                            0 AS VAT_RATE, 
                                            CASE WHEN POS.TYPE = 0 THEN SUM(AMOUNT - CHANGE) ELSE SUM(AMOUNT - CHANGE) * -1 END AS AMOUNT  
                                            FROM POS_PAYMENT_VW_01 AS POS 
                                            WHERE POS.STATUS = 1 AND POS.DOC_DATE >= @START AND POS.DOC_DATE <= @END AND POS.DEVICE <> '9999' 
                                            GROUP BY POS.GUID,POS.DOC_DATE,POS.TYPE,POS.PAY_TYPE_NAME,POS.PAY_TYPE,POS.DEVICE` , 
                                    param : ['START:date','END:date'],
                                    value : [this.dtDate.startDate,this.dtDate.endDate]
                                }
                                App.instance.setState({isExecute:true})
                                let tmpData = await this.core.sql.execute(tmpQuery)

                                App.instance.setState({isExecute:false})
                                let tmpPayType = 
                                {
                                    query : "SELECT NAME FROM POS_PAY_TYPE",
                                }
                                let tmpPayTypeData = await this.core.sql.execute(tmpPayType)
                                
                                // tmpPayTypeData'dan ödeme tiplerini al
                                if (tmpPayTypeData && tmpPayTypeData.result && tmpPayTypeData.result.recordset) 
                                {
                                    this.payTypeList = tmpPayTypeData.result.recordset.map(x => x.NAME)
                                }

                                if(tmpData.result.recordset.length > 0)
                                {
                                    // Chart data için kasa kasa ödeme yöntemleri işle
                                    let chartData = []
                                    let devicePaymentTotals = {}
                                    // Her kasa için ödeme yöntemlerini topla, ödeme tiplerini dinamik olarak oluştur
                                    tmpData.result.recordset.forEach(row => 
                                    {
                                        if (row.TITLE === 'PAYMENT' && row.TYPE !== 'Total') 
                                        {
                                            if (!devicePaymentTotals[row.DEVICE]) 
                                            {
                                                // Her cihaz için ödeme tiplerini sıfırla
                                                devicePaymentTotals[row.DEVICE] = {}
                                                this.payTypeList.forEach(type => 
                                                {
                                                    devicePaymentTotals[row.DEVICE][type] = 0
                                                })
                                            }
                                            // Eğer yeni bir ödeme tipi geldiyse ekle
                                            if (devicePaymentTotals[row.DEVICE][row.TYPE] === undefined) 
                                            {
                                                devicePaymentTotals[row.DEVICE][row.TYPE] = 0
                                            }
                                            devicePaymentTotals[row.DEVICE][row.TYPE] += Math.abs(parseFloat(row.AMOUNT) || 0)
                                        }
                                    })
                                    
                                    // Tüm ödeme tiplerini kontrol et
                                    let allPaymentTypes = new Set()
                                    tmpData.result.recordset.forEach(row => 
                                    {
                                        if (row.TITLE === 'PAYMENT' && row.TYPE !== 'Total') 
                                        {
                                            allPaymentTypes.add(row.TYPE)
                                        }
                                    })
                                    
                                    
                                    // Chart data formatına çevir - her kasa için 5 ödeme yöntemi
                                    Object.keys(devicePaymentTotals).forEach(device => 
                                    {
                                        let payments = devicePaymentTotals[device]
                                        // Ödeme tiplerini dinamik olarak işle
                                        let total = 0
                                        let chartItem = {
                                            device: `${this.lang.t("device")} ${device}`
                                        }
                                        this.payTypeList.forEach(type => 
                                        {
                                            chartItem[type] = payments[type] || 0
                                            total += payments[type] || 0
                                        })
                                        chartItem.total = total
                                        chartData.push(chartItem)
                                    })
                                    // Günlük satış verilerini işle
                                    let dailySalesData = []
                                    let dailyTotals = {}
                                    
                                    // Her gün için toplam satışları hesapla
                                    tmpData.result.recordset.forEach(row => 
                                    {
                                        if (row.TITLE === 'PAYMENT' && row.TYPE !== 'Total') 
                                        {
                                            let date = row.DOC_DATE
                                            if (!dailyTotals[date]) 
                                            {
                                                dailyTotals[date] = 0
                                            }
                                            dailyTotals[date] += Math.abs(parseFloat(row.AMOUNT) || 0)
                                        }
                                    })
                                    
                                    // Günlük verileri sırala ve formatla
                                    Object.keys(dailyTotals).sort().forEach(date => 
                                    {
                                        dailySalesData.push
                                        ({
                                            date: moment(date).format('DD/MM/YYYY'),
                                            totalSales: dailyTotals[date]
                                        })
                                    })
                                    
                                    this.calculateAnalysisData(dailySalesData)
                                    
                                    // Saatlik veriyi de yükle
                                    let hourlySalesData = await this.getHourlySalesData()
                                    
                                    this.setState
                                    ({ 
                                        chartData: chartData,
                                        dailySalesData: dailySalesData,
                                        hourlySalesData: hourlySalesData
                                    })
                                }
                                else
                                {
                                    this.setState
                                    ({ 
                                        chartData: [],
                                        dailySalesData: [],
                                        hourlySalesData: []
                                    })
                                }
                            }}/>
                        </div>
                    </div>
                    {/* Analiz Butonu */}
                    <div className="row px-2 pt-3">
                        <div className="col-12 text-center">
                            <NdButton 
                                text={this.lang.t("btnAnalysis")} 
                                width={'250px'}
                                type="success"
                                icon="fa-solid fa-chart-line"
                                elementAttr=
                                {{
                                    style: "font-weight:bold;font-size:16px"
                                }}
                                onClick={() => 
                                {
                                    this.popAnalysis.show()
                                }}
                            />
                        </div>
                    </div>
                    <div style={{height: "50px"}}></div>
                    
                    {/* Günlük Satış Spline Chart */}
                    <React.Suspense fallback={
                        <div style={{height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                            <span>{this.lang.t("loading")}</span>
                        </div>
                    }>
                        <div className="row px-2 pt-2">
                            <div className="col-12">
                                {
                                    this.state.dailySalesData && this.state.dailySalesData.length > 0 ?
                                    <div style={{minHeight: '400px', height: '400px', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px'}}>
                                        <Chart
                                            id="dailySalesChart"
                                            title={this.lang.t("dailySalesChart.title")}
                                            dataSource={this.state.dailySalesData.sort((a, b) => 
                                            {
                                                // Tarihe göre sırala - en eski tarih en solda
                                                let dateA = moment(a.date, 'DD/MM/YYYY');
                                                let dateB = moment(b.date, 'DD/MM/YYYY');
                                                return dateA.diff(dateB);
                                            })}
                                            palette="Violet"
                                        >
                                            <CommonSeriesSettings
                                                argumentField="date"
                                                type="spline"
                                            />
                                            <CommonAxisSettings>
                                                <Grid visible={true} />
                                            </CommonAxisSettings>
                                            <Series
                                                valueField="totalSales"
                                                name={this.lang.t("dailySalesChart.totalSales")}
                                            />
                                            <Margin bottom={20} />
                                            <ArgumentAxis
                                                allowDecimals={false}
                                                axisDivisionFactor={1}
                                            >
                                                <ChartLabel 
                                                    rotationAngle={45}
                                                    customizeText={(arg) => 
                                                    {
                                                        if (arg.value) 
                                                        {
                                                            let date = moment(arg.value, 'DD/MM/YYYY');
                                                            return date.format('DD/MM');
                                                        }
                                                        return arg.value;
                                                    }}
                                                />
                                            </ArgumentAxis>
                                            <Legend
                                                verticalAlignment="top"
                                                horizontalAlignment="right"
                                            />
                                            <Export enabled={true} />
                                            <ZoomAndPan 
                                                argumentAxis="both"
                                                valueAxis="both"
                                                panKey="shift"
                                                zoomKey="ctrl"
                                                allowMouseWheel={true}
                                                allowTouchGestures={true}
                                            />
                                            <Tooltip 
                                                enabled={true}
                                                customizeTooltip={(arg) => 
                                                {
                                                    let date = moment(arg.argumentText, 'DD/MM/YYYY');
                                                    let formattedDate = date.format('DD MMMM YYYY');
                                                    let dayName = date.format('dddd');
                                                    
                                                    return {
                                                        text: `${formattedDate} (${dayName})<br/>${this.lang.t("dailySalesChart.totalSales")}: ${parseFloat(arg.valueText).toFixed(2)} €`
                                                    };
                                                }}
                                            />
                                        </Chart>
                                    </div>
                                    :
                                    <div style={{minHeight: '400px', height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px'}}>
                                        <span>{this.lang.t("noData")}</span>
                                    </div>
                                }
                            </div>
                        </div>
                    </React.Suspense>
                    <div style={{height: "50px"}}></div>
                    
                    {/* Grafikler */}
                    <React.Suspense fallback=
                    {
                        <div style={{height: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                            <span>{this.lang.t("loading")}</span>
                        </div>
                    }>
                        <div className="row px-2 pt-2">
                            {/* Pasta Grafik - Sol */}
                            <div className="col-6">
                                {
                                    this.state.chartData && this.state.chartData.length > 0 ?
                                    <div style={{minHeight: '400px', height: '500px', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px'}}>
                                        <PieChart
                                            id="pieChart"
                                            type="doughnut"
                                            title={this.lang.t("pieChart.title")}
                                            palette="Bright"
                                            dataSource={this.state.chartData}
                                        >
                                            <PieSeries 
                                                argumentField="device"
                                                valueField="total"
                                            >
                                                <PieLabel visible={true} customizeText={(arg) => 
                                                {
                                                    let total = this.state.chartData.reduce((sum, item) => sum + item.total, 0)
                                                    let percentage = ((arg.value / total) * 100).toFixed(1)
                                                    return `${arg.argumentText}\n${arg.value.toFixed(2)} € (${percentage}%)`
                                                }}>
                                                    <PieConnector visible={true} /> 
                                                </PieLabel>
                                            </PieSeries>
                                            <PieLegend 
                                                margin={0} 
                                                horizontalAlignment="center" 
                                                verticalAlignment="bottom" 
                                            />
                                            <PieTooltip 
                                                enabled={true}
                                                customizeTooltip={(arg) => 
                                                {
                                                    return {
                                                        text: `${arg.argumentText}: ${parseFloat(arg.valueText).toFixed(2)} €`
                                                    };
                                                }}
                                            />
                                            <PieLoadingIndicator visible={true} enabled={true}/>
                                        </PieChart>
                                    </div>
                                    :
                                    <div style={{minHeight: '400px', height: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px'}}>
                                        <span>{this.lang.t("noData")}</span>
                                    </div>
                                }
                            </div>
                            
                            {/* Bar Grafik - Sağ */}
                            <div className="col-6">
                                {
                                    this.state.chartData && this.state.chartData.length > 0 ?
                                    <div style={{minHeight: '400px', height: '500px', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px'}}>
                                        <Chart
                                            id="deviceChart"
                                            style={{minHeight: '400px'}}
                                            title={this.lang.t("barChart.title")}
                                            dataSource={this.state.chartData}
                                        >
                                            <CommonSeriesSettings 
                                                argumentField="device" 
                                                type="stackedbar"
                                            />
                                                {
                                                (this.payTypeList || [])
                                                    .filter(payType => 
                                                    (this.state.chartData || []).some(item => item[payType] && item[payType] > 0)
                                                )
                                                .map((payType, idx) => 
                                                {
                                                    // Ödeme tipi için renk ve isim eşleştirmesi
                                                    let payTypeConfig = {
                                                        'ESC': { name: this.lang.t("barChart.cash"), color: "#ffeb3b" },
                                                        'CB': { name: this.lang.t("barChart.creditCard"), color: "#4caf50" },
                                                        'CB TICKET': { name: this.lang.t("barChart.creditCardTicket"), color: "#8bc34a" },
                                                        'CHECK': { name: this.lang.t("barChart.check"), color: "#ff9800" },
                                                        'BON D\'AVOIR': { name: this.lang.t("barChart.giftCard"), color: "#f44336" },
                                                        'AVOIR': { name: this.lang.t("barChart.credit"), color: "#9c27b0" },
                                                        'VIRM': { name: this.lang.t("barChart.transfer"), color: "#2196f3" },
                                                        'PRLV': { name: this.lang.t("barChart.directDebit"), color: "#607d8b" },
                                                        'T.R': { name: this.lang.t("barChart.ticketRest"), color: "#2196f3" }
                                                    };
                                                    
                                                    let config = payTypeConfig[payType] || { name: payType, color: "#9e9e9e" };
                                                    
                                                    return (
                                                        <Series
                                                            key={payType}
                                                            valueField={payType}
                                                            name={config.name}
                                                            stack="payments"
                                                            color={config.color}
                                                        />
                                                    );
                                                })
                                                }
                                            
                                            <ValueAxis>
                                                <Title text={this.lang.t("barChart.amount")} />
                                            </ValueAxis>
                                            <Legend 
                                                position="outside"
                                                horizontalAlignment="center"
                                                verticalAlignment="bottom"
                                                orientation="horizontal"
                                            >
                                                <Border visible={true} />
                                            </Legend>
                                            <Tooltip 
                                                enabled={true}
                                                customizeTooltip={(arg) => 
                                                {
                                                    return {
                                                        text: `${arg.seriesName}: ${parseFloat(arg.valueText).toFixed(2)} €`
                                                    };
                                                }}
                                            />
                                        </Chart>
                                    </div>
                                    :
                                    <div style={{minHeight: '400px', height: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px'}}>
                                        <span>{this.lang.t("noData")}</span>
                                    </div>
                                }
                            </div>
                        </div>
                        <div className="row px-2 pt-4">
                            <div className="col-6">
                                {
                                    this.state.chartData && this.state.chartData.length > 0 ?
                                    <div style={{minHeight: '400px', height: '500px', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'}}>
                                        <Chart
                                            id="currencyDistributionChart"
                                            style={{minHeight: '400px'}}
                                            title={this.lang.t("currencyDistributionChart.title")}
                                            dataSource={this.getCurrencyDistributionData()}
                                            palette="Bright"
                                        >
                                            <CommonSeriesSettings 
                                                argumentField="currency" 
                                                type="bar"
                                            />
                                            <Series
                                                valueField="amount"
                                                name={this.lang.t("currencyDistributionChart.totalAmount")}
                                                color="#4caf50"
                                                barPadding={0.1}
                                                minBarSize={3}
                                            >
                                                <Label visible={true} position="inside" backgroundColor="transparent" customizeText={(point) => `${parseFloat(point.value).toFixed(1)}€`} />
                                            </Series>
                                            <ArgumentAxis
                                                allowDecimals={false}
                                                axisDivisionFactor={1}
                                                discreteAxisDivisionMode="crossLabels"
                                            >
                                                <ChartLabel rotationAngle={45} />
                                                <Grid visible={true} opacity={0.2} />
                                            </ArgumentAxis>
                                            <ValueAxis>
                                                <Title text={this.lang.t("currencyDistributionChart.amount") + '€'} />
                                                <Grid visible={true} opacity={0.2} />
                                            </ValueAxis>
                                            <Legend 
                                                position="outside"
                                                horizontalAlignment="center"
                                                verticalAlignment="bottom"
                                                orientation="horizontal"
                                                columnCount={2}
                                                markerSize={12}
                                            >
                                                <Border visible={true} cornerRadius={4} />
                                            </Legend>
                                            <Tooltip 
                                                enabled={true}
                                                cornerRadius={6}
                                                shadow={{opacity: 0.2, blur: 5, color: "#000", offsetX: 2, offsetY: 2}}
                                                customizeTooltip={(arg) => 
                                                {
                                                    return {
                                                        text: `${arg.argumentText}: ${parseFloat(arg.valueText).toFixed(2)} €`,
                                                        color: '#ffffff',
                                                        fontWeight: 'bold',
                                                        backgroundColor: '#1e88e5'
                                                    };
                                                }}
                                            />
                                        </Chart>
                                    </div>
                                    :
                                    <div style={{minHeight: '400px', height: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'}}>
                                        <span>{this.lang.t("noData")}</span>
                                    </div>
                                }
                            </div>
                            {/* Saatlik Satış Dağılımı Grafiği - Sağ */}
                            <div className="col-6">
                                {
                                    this.state.chartData && this.state.chartData.length > 0 ?
                                    <div style={{minHeight: '400px', height: '500px', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px'}}>
                                        <Chart
                                            id="hourlySalesChart"
                                            style={{minHeight: '400px'}}
                                            title={this.lang.t("hourlySalesChart.title")}
                                            dataSource={this.state.hourlySalesData}
                                        >
                                            <CommonSeriesSettings 
                                                argumentField="hour" 
                                                type="bar"
                                            />
                                            <Series
                                                valueField="totalSales"
                                                name={this.lang.t("hourlySalesChart.totalSales")}
                                                color="#4caf50"
                                                barPadding={0.1}
                                                minBarSize={3}
                                            />
                                            <Series
                                                valueField="saleCount"
                                                name={this.lang.t("hourlySalesChart.saleCount")}
                                                color="#ff9800"
                                                barPadding={0.1}
                                                minBarSize={3}
                                            />
                                            <ArgumentAxis
                                                allowDecimals={false}
                                                axisDivisionFactor={1}
                                                discreteAxisDivisionMode="crossLabels"
                                            >
                                                <ChartLabel rotationAngle={0} />
                                                <Grid visible={true} />
                                            </ArgumentAxis>
                                            <ValueAxis>
                                                <Title text={this.lang.t("hourlySalesChart.amount") + '€'} />
                                                <Grid visible={true} />
                                            </ValueAxis>
                                            <Legend 
                                                position="outside"
                                                horizontalAlignment="center"
                                                verticalAlignment="bottom"
                                                orientation="horizontal"
                                            >
                                                <Border visible={true} />
                                            </Legend>
                                            <Tooltip 
                                                enabled={true}
                                                customizeTooltip={(arg) => 
                                                {
                                                    if (arg.seriesName.includes(this.lang.t("hourlySalesChart.saleCount"))) {
                                                        return {
                                                            text: `${arg.seriesName}: ${arg.valueText} ${this.lang.t("hourlySalesChart.saleCount")}`
                                                        };
                                                    } else {
                                                        return {
                                                            text: `${arg.seriesName}: ${parseFloat(arg.valueText).toFixed(2)} €`
                                                        };
                                                    }
                                                }}
                                            />
                                        </Chart>
                                    </div>
                                    :
                                    <div style={{minHeight: '400px', height: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px'}}>
                                        <span>{this.lang.t("noData")}</span>
                                    </div>
                                }
                            </div>
                        </div>
                        </React.Suspense>
                    
                    {/* Analiz PopUp */}
                    <NdPopUp parent={this} id={"popAnalysis"} 
                    visible={false}
                    showCloseButton={true}
                    showTitle={true}
                    title={this.lang.t("popAnalysis.title")}
                    container={'#' + this.props.data.id + this.tabIndex} 
                        width={'1200'}
                        height={'800'}
                    position={{of:'#' + this.props.data.id + this.tabIndex}}
                        ref={(el) => { this.popAnalysis = el }}
                        onHiding={async () => {
                            await new Promise(resolve => this.setState({
                                selectedProduct: null,
                                productDetailData: {},
                                productDetailAnalysisType: 'daily',
                                productDetailChartType: 'line'
                            }, resolve));
                            App.instance.setState({isExecute:false});
                        }}
                        onShowing={async () => {
                            const newKey = Date.now();
                            await new Promise(resolve => this.setState({
                                selectedAnalysisType: 'best',
                                selectedSubOption: 'topDay',
                                selectedAnalysis: 'topDay',
                                chartType: 'bar',
                                selectedProductGroup: null,
                                productAnalysisData: {},
                                popAnalysisResetKey: newKey
                            }, resolve));
                        }}
                        >
                        <div className="row p-4">
                            {/* Başlık ve Açıklama */}
                            <div className="col-12 mb-4 text-center">
                                <h4 style={{color: '#2c3e50', marginBottom: '10px'}}>
                                    {this.lang.t("popAnalysis.title")}
                                </h4>
                                <p style={{color: '#7f8c8d', fontSize: '14px'}}>
                                    {this.lang.t("popAnalysis.description")}
                                </p>
                            </div>
                            
                            {/* Analiz Seçim Paneli */}
                            <div className="col-12 mb-4">
                                <div style={{
                                    
                                    borderRadius: '12px',
                                    padding: '25px',
                                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                                }}>
                                    <div className="row" style={{marginBottom: '15px'}}>
                                        <div className="col-md-6">
                                            <div style={{marginBottom: '15px'}}>
                                                <Label 
                                                    text={this.lang.t("popAnalysis.selectAnalysis")} 
                                                    alignment="center"
                                                    style={{color: 'white', fontWeight: 'bold', fontSize: '16px'}}
                                                />
                                            </div>
                                            <NdSelectBox key={this.state.popAnalysisResetKey}
                                                id="selAnalysisType" 
                                            parent={this} 
                                            dataSource={[
                                                    { id: 'best', name: '🔝 ' + this.lang.t("bestDays") },
                                                    { id: 'worst', name: '🔻 ' + this.lang.t("worstDays") },
                                                    { id: 'comparison', name: '⚖️ ' + this.lang.t("comparison") },
                                                    { id: 'distribution', name: '📊 ' + this.lang.t("distribution") },
                                                    { id: 'trend', name: '📈 ' + this.lang.t("trend") },
                                                    { id: 'products', name: '📦 ' + this.lang.t("products") }
                                            ]}
                                            displayExpr="name"
                                            valueExpr="id"
                                                defaultValue="best"
                                                width="100%"
                                                onValueChanged={async (e) => 
                                                {
                                                    this.setState
                                                    ({ 
                                                        selectedAnalysisType: e.value,
                                                        selectedAnalysis: null,
                                                        selectedSubOption: null,
                                                        productAnalysisData: {} // Veriyi temizle
                                                    })
                                                    
                                                    if(e.value === 'products')
                                                    {
                                                        // Sadece ürün gruplarını yükle, analiz yapma
                                                        App.instance.setState({isExecute:true})
                                                        
                                                        try {
                                                            let productGroups = await this.getProductGroups()
                                                            this.setState
                                                            ({ 
                                                                productGroups: productGroups
                                                                // selectedAnalysis ve productAnalysisData ayarlama
                                                            })
                                                        } 
                                                        catch (error) 
                                                        {
                                                            console.error('Error loading product groups:', error)
                                                        }
                                                    }
                                                }}
                                            />
                                    </div>
                                        <div className="col-md-6">
                                            <div style={{marginBottom: '15px'}}>
                                                <Label 
                                                    text={this.lang.t("popAnalysis.selectSubOption")} 
                                                    alignment="center"
                                                    style={{color: 'white', fontWeight: 'bold', fontSize: '16px'}}
                                                />
                                            </div>
                                            <NdSelectBox key={this.state.popAnalysisResetKey}
                                                id="selSubOption" 
                                                parent={this} 
                                                dataSource={this.getSubOptions()}
                                                displayExpr="name"
                                                valueExpr="id"
                                                defaultValue="topDay"
                                                width="100%"
                                                onValueChanged={async (e) => 
                                                {
                                                    this.setState({ 
                                                        selectedSubOption: e.value,
                                                        selectedAnalysis: e.value
                                                    })
                                                    
                                                    // Ürün analizleri seçildiğinde ilgili veriyi yükle
                                                    if (this.state.selectedAnalysisType === 'products') {
                                                        App.instance.setState({isExecute:true})
                                                        
                                                        try 
                                                        {
                                                            if (e.value === 'topSellingProductsInGroup') 
                                                            {
                                                                // Sadece ürün gruplarını yükle, analiz yapma
                                                                let productGroups = await this.getProductGroups()
                                                                this.setState({ 
                                                                    selectedAnalysis: e.value,
                                                                    productGroups: productGroups,
                                                                    productAnalysisData: {} // Boş bırak, ürün grubu seçilince doldurulacak
                                                                }, async () => 
                                                                {
                                                                    // Sonra veriyi yükle
                                                                    let productAnalysisData = await this.calculateProductAnalysisData('topSellingProductsInGroup');
                                                                    this.setState({ productAnalysisData: productAnalysisData });
                                                                });
                                                            } 
                                                            else 
                                                            {
                                                                // Diğer ürün analizleri için veriyi yükle
                                                                let productData = await this.calculateProductAnalysisData(e.value)
                                                                this.setState({ 
                                                                    selectedAnalysis: e.value,
                                                                    productAnalysisData: productData
                                                                }, async () => 
                                                                {
                                                                    // Sonra veriyi yükle
                                                                    let productAnalysisData = await this.calculateProductAnalysisData(e.value);
                                                                    this.setState({ productAnalysisData: productAnalysisData });
                                                                });
                                                            }
                                                        } 
                                                        catch (error) 
                                                        {
                                                            console.error('Error loading product analysis:', error)
                                                        }
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>
                                    
                                    {/* Grafik Türü Seçimi - Her zaman görünür */}
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div style={{marginBottom: '15px'}}>
                                                <Label 
                                                    text={this.lang.t("chartType")} 
                                                    alignment="center"
                                                    style={{color: 'white', fontWeight: 'bold', fontSize: '16px'}}
                                                />
                                            </div>
                                            <NdSelectBox key={this.state.popAnalysisResetKey}
                                                id="selChartType" 
                                                parent={this} 
                                                dataSource={[
                                                    { id: 'bar', name: '📊 ' + this.lang.t("barChartPop") },
                                                    { id: 'pie', name: '🥧 ' + this.lang.t("pieChartPop") },
                                                    { id: 'line', name: '📈 ' + this.lang.t("lineChart") }
                                                ]}
                                                displayExpr="name"
                                                valueExpr="id"
                                                value={this.state.chartType || 'bar'}
                                                width="100%"
                                                onValueChanged={e => {
                                                    this.setState({ chartType: e.value });
                                                }}
                                            />
                                        </div>
                                    
                                    {/* Ürün Grubu Seçimi - Sadece topSellingProductsInGroup seçildiğinde görünür */}
                                    {this.state.selectedAnalysisType === 'products' && this.state.selectedSubOption === 'topSellingProductsInGroup' && (
                                        <div className="col-md-6">
                                            <div style={{marginBottom: '15px'}}>
                                                <Label 
                                                    text={this.lang.t("selectProductGroup")} 
                                                    alignment="center"
                                                    style={{color: 'white', fontWeight: 'bold', fontSize: '16px'}}
                                                />
                                            </div>
                                            <div style={{position: 'relative'}}>
                                                <NdSelectBox key={this.state.popAnalysisResetKey}
                                                    id="selProductGroup" 
                                                    parent={this} 
                                                    dataSource={this.state.productGroups}
                                                    displayExpr="name"
                                                    valueExpr="id"
                                                    width="100%"
                                                    placeholder={this.lang.t("selectProductGroup")}
                                                    onValueChanged={async (e) => 
                                                    {
                                                        if (e.value) 
                                                        {
                                                            App.instance.setState({isExecute:true})
                                                            
                                                            try 
                                                            {
                                                                // selectedProductGroup'u güncelle
                                                                this.selectedProductGroup = e.value
                                                                
                                                                // Veriyi yükle
                                                                let productData = await this.calculateProductAnalysisData('topSellingProductsInGroup')
                                                                this.setState({ 
                                                                    selectedProductGroup: e.value,
                                                                    selectedAnalysis: 'topSellingProductsInGroup',
                                                                    productAnalysisData: productData
                                                                }, 
                                                                async () => 
                                                                {
                                                                    // Sonra veriyi yükle
                                                                    let productAnalysisData = await this.calculateProductAnalysisData('topSellingProductsInGroup');
                                                                    this.setState({ productAnalysisData: productAnalysisData });
                                                                });
                                                            } 
                                                            catch (error) 
                                                            {
                                                                console.error('Error loading products in group:', error)
                                                            }
                                                        }
                                                    }}
                                                />
                                                <div style={{
                                                    position: 'absolute',
                                                    left: 0,
                                                    right: 0,
                                                    top: '100%',
                                                    marginTop: 4,
                                                    marginBottom: 10,
                                                    zIndex: 10
                                                }}>
                                                    <div className="alert alert-info" role="alert" style={{fontSize: '13px', padding: '8px 12px'}}>
                                                        {this.lang.t("topSellingProductsInGroupNote")}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    </div>
                                 </div>
                            </div>
                            
                            {/* Grafik Alanı */}
                            <div className="col-12">
                                <div style={{
                                    minHeight: '600px',
                                    border: '2px solid #e2e8f0', 
                                    borderRadius: '12px', 
                                    padding: '25px', 
                                    position: 'relative',
                                    background: 'white',
                                    boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
                                }}>
                                    {/* Ana grafik render kısmı */}
                                    {this.state.selectedAnalysisType === 'products' && this.state.productAnalysisData && this.state.productAnalysisData[this.state.selectedAnalysis] ? (
                                        this.state.chartType === 'pie' ? (
                                            <PieChart
                                                id="productAnalysisPieChart"
                                                type="doughnut"
                                                title={this.state.productAnalysisData[this.state.selectedAnalysis]?.[0]?.title || this.lang.t("productAnalysis.title")}
                                                palette="Bright"
                                                dataSource={this.state.productAnalysisData[this.state.selectedAnalysis] || []}
                                                visible={this.state.productAnalysisData[this.state.selectedAnalysis]?.length > 0}
                                                onPointClick={async (e) => {
                                                    // Eğer ürün grupları grafiğindeyse ve bir gruba tıklandıysa
                                                    if (this.state.selectedAnalysis === 'topSellingProductGroups' && e.target.data.groupCode)
                                                    {
                                                        // Önce state'i güncelle
                                                        this.setState({ 
                                                            selectedProductGroup: e.target.data.groupCode,
                                                            selectedAnalysis: 'topSellingProductsInGroup'
                                                        }, 
                                                        async () => 
                                                        {
                                                            // Sonra veriyi yükle
                                                            let productAnalysisData = await this.calculateProductAnalysisData('topSellingProductsInGroup');
                                                            this.setState({ productAnalysisData: productAnalysisData });
                                                        });
                                                    }
                                                    // Eğer ürün detay grafiğindeyse ve bir ürüne tıklandıysa
                                                    else if ((this.state.selectedAnalysis === 'topSellingProductsInGroup' || 
                                                             this.state.selectedAnalysis === 'topSellingProducts' || 
                                                             this.state.selectedAnalysis === 'worstSellingProducts') && 
                                                             e.target.data.itemCode)
                                                    {
                                                        // Ürün detay popup'ını aç
                                                        this.setState({ 
                                                            selectedProduct: {
                                                                code: e.target.data.itemCode,
                                                                name: e.target.data.itemName
                                                            },
                                                            productDetailData: {}, // Veriyi temizle
                                                            productDetailAnalysisType: 'daily',
                                                            productDetailChartType: 'line'
                                                        },  
                                                        async () => 
                                                        {
                                                            // Ürün detay verilerini yükle
                                                            App.instance.setState({isExecute:true})
                                                            
                                                            try 
                                                            {
                                                                let productDetailData = this.calculateProductDetailData(
                                                                    e.target.data.itemCode, 
                                                                    e.target.data.itemName, 
                                                                    'daily'
                                                                )
                                                                this.setState({ 
                                                                    productDetailData
                                                                })
                                                                
                                                                // Popup'ı aç
                                                                this.popProductDetail.show()
                                                            } 
                                                            catch (error) 
                                                            {
                                                                console.error('Error loading product detail:', error)
                                                            }
                                                        });
                                                    }
                                                }}
                                            >
                                                <PieSeries 
                                                    argumentField="category"
                                                    valueField="value"
                                                >
                                                    <PieLabel visible={true} customizeText={(arg) => 
                                                    {
                                                        let total = (this.state.productAnalysisData[this.state.selectedAnalysis] || []).reduce((sum, item) => sum + item.value, 0)
                                                        let percentage = ((arg.value / total) * 100).toFixed(1)
                                                        return `${arg.argumentText}\n${arg.value.toFixed(2)} € (${percentage}%)`
                                                    }}>
                                                        <PieConnector visible={true} /> 
                                                    </PieLabel>
                                                </PieSeries>
                                                <PieLegend 
                                                    margin={0} 
                                                    horizontalAlignment="center" 
                                                    verticalAlignment="bottom" 
                                                />
                                                <PieTooltip 
                                                    enabled={true}
                                                    customizeTooltip={(arg) => {
                                                        if (!arg || !arg.argumentText || !arg.valueText) {
                                                            return { text: this.lang.t("noData") };
                                                        }
                                                        
                                                        let tooltipText = `${arg.argumentText}: ${parseFloat(arg.valueText).toFixed(2)} €`
                                                        let dataItem = this.state.productAnalysisData[this.state.selectedAnalysis]?.find(item => 
                                                            item.category === arg.argumentText
                                                        )
                                                        
                                                        if (dataItem) 
                                                        {
                                                            if (dataItem.rank) 
                                                            {
                                                                tooltipText = `${dataItem.rank}. ${tooltipText}`
                                                            }
                                                            if (dataItem.quantity)
                                                             {
                                                                tooltipText += `\n${this.lang.t("quantity")}: ${dataItem.quantity}`
                                                            }
                                                            if (dataItem.itemCount)
                                                            {
                                                                tooltipText += `\n${this.lang.t("itemCount")}: ${dataItem.itemCount}`
                                                            }
                                                        }
                                                        
                                                        return {
                                                            text: tooltipText
                                                        };
                                                    }}
                                                />
                                            </PieChart>
                                        ) : this.state.chartType === 'line' ? 
                                        (
                                            <Chart
                                                id="productAnalysisLineChart"
                                                title={this.state.productAnalysisData[this.state.selectedAnalysis]?.[0]?.title || this.lang.t("productAnalysis.title")}
                                                dataSource={this.state.productAnalysisData[this.state.selectedAnalysis] || []}
                                                palette="Bright"
                                                style={{minHeight: '400px'}}
                                                visible={this.state.productAnalysisData[this.state.selectedAnalysis]?.length > 0}
                                                onPointClick={async (e) => {
                                                    // Eğer ürün grupları grafiğindeyse ve bir gruba tıklandıysa
                                                    if (this.state.selectedAnalysis === 'topSellingProductGroups' && e.target.data.groupCode)
                                                    {
                                                        // Önce state'i güncelle
                                                        this.setState({ 
                                                            selectedProductGroup: e.target.data.groupCode,
                                                            selectedAnalysis: 'topSellingProductsInGroup'
                                                        }, async () => 
                                                        {
                                                            // Sonra veriyi yükle
                                                            let productAnalysisData = await this.calculateProductAnalysisData('topSellingProductsInGroup');
                                                            this.setState({ productAnalysisData: productAnalysisData });
                                                        });
                                                    }
                                                    // Eğer ürün detay grafiğindeyse ve bir ürüne tıklandıysa
                                                    else if ((this.state.selectedAnalysis === 'topSellingProductsInGroup' || 
                                                             this.state.selectedAnalysis === 'topSellingProducts' || 
                                                             this.state.selectedAnalysis === 'worstSellingProducts') && 
                                                             e.target.data.itemCode)
                                                    {
                                                        // Ürün detay popup'ını aç
                                                        this.setState({ 
                                                            selectedProduct: 
                                                            {
                                                                code: e.target.data.itemCode,
                                                                name: e.target.data.itemName
                                                            },
                                                            productDetailData: {}, // Veriyi temizle
                                                            productDetailAnalysisType: 'daily',
                                                            productDetailChartType: 'line'
                                                        },  
                                                        async () => 
                                                        {
                                                            // Ürün detay verilerini yükle
                                                            App.instance.setState({isExecute:true})
                                                            
                                                            try 
                                                            {
                                                                let productDetailData = this.calculateProductDetailData(
                                                                    e.target.data.itemCode, 
                                                                    e.target.data.itemName, 
                                                                    'daily'
                                                                )
                                                                this.setState({ 
                                                                    productDetailData
                                                                })
                                                                
                                                                // Popup'ı aç
                                                                this.popProductDetail.show()
                                                            } 
                                                            catch (error) 
                                                            {
                                                                console.error('Error loading product detail:', error)
                                                            }
                                                        });
                                                    }
                                                }}
                                            >
                                                <CommonSeriesSettings 
                                                    argumentField="category" 
                                                    type="line"
                                                />
                                                <Series
                                                    valueField="value"
                                                    name={this.lang.t("productAnalysis.amount")}
                                                    hoverMode="allArgumentPoints"
                                                    point={{
                                                        hoverMode: "allArgumentPoints"
                                                    }}
                                                />
                                                <ArgumentAxis
                                                    allowDecimals={false}
                                                    axisDivisionFactor={1}
                                                    discreteAxisDivisionMode="crossLabels"
                                                >
                                                    <ChartLabel rotationAngle={45} />
                                                </ArgumentAxis>
                                                <ValueAxis>
                                                    <Title text={this.lang.t("productAnalysis.amount")} />
                                                </ValueAxis>
                                                <Legend 
                                                    position="outside"
                                                    horizontalAlignment="center"
                                                    verticalAlignment="bottom"
                                                    orientation="horizontal"
                                                />
                                                <Tooltip 
                                                    enabled={true}
                                                    zIndex={9999}
                                                    customizeTooltip={(arg) => 
                                                    {
                                                        if (!arg || !arg.argumentText || !arg.valueText) 
                                                        {
                                                            return { text: this.lang.t("noData") };
                                                        }
                                                        
                                                        let tooltipText = `${arg.argumentText}: ${parseFloat(arg.valueText).toFixed(2)} €`
                                                        let dataItem = this.state.productAnalysisData[this.state.selectedAnalysis]?.find(item => 
                                                            item.category === arg.argumentText
                                                        )
                                                        
                                                        if (dataItem) 
                                                        {
                                                            if (dataItem.rank) 
                                                            {
                                                                tooltipText = `${dataItem.rank}. ${tooltipText}`
                                                            }
                                                            if (dataItem.quantity) 
                                                            {    
                                                                tooltipText += `\n${this.lang.t("quantity")}: ${dataItem.quantity}`
                                                            }
                                                            if (dataItem.itemCount) 
                                                            {
                                                                tooltipText += `\n${this.lang.t("itemCount")}: ${dataItem.itemCount}`
                                                            }
                                                        }
                                                        
                                                        return { text: tooltipText };
                                                    }}
                                                />
                                            </Chart>
                                        ) : (
                                            // Default bar chart
                                    <Chart
                                        id="analysisChart"
                                                title={this.state.productAnalysisData[this.state.selectedAnalysis]?.[0]?.title || this.lang.t("analysisChart.title")}
                                                dataSource={this.state.productAnalysisData[this.state.selectedAnalysis] || []}
                                                palette="Bright"
                                                style={{minHeight: '400px'}}
                                                visible={this.state.productAnalysisData[this.state.selectedAnalysis]?.length > 0}
                                                onPointClick={async (e) => 
                                                {
                                                    // Eğer ürün grupları grafiğindeyse ve bir gruba tıklandıysa
                                                    if (this.state.selectedAnalysis === 'topSellingProductGroups' && e.target.data.groupCode)
                                                    {
                                                        // Önce state'i güncelle
                                                        this.setState({ 
                                                            selectedProductGroup: e.target.data.groupCode,
                                                            selectedAnalysis: 'topSellingProductsInGroup'
                                                        }, 
                                                        async () => 
                                                        {
                                                            // Sonra veriyi yükle
                                                            let productAnalysisData = await this.calculateProductAnalysisData('topSellingProductsInGroup');
                                                            this.setState({ productAnalysisData: productAnalysisData });
                                                        });
                                                    }
                                                    // Eğer ürün detay grafiğindeyse ve bir ürüne tıklandıysa
                                                    else if ((this.state.selectedAnalysis === 'topSellingProductsInGroup' || 
                                                             this.state.selectedAnalysis === 'topSellingProducts' || 
                                                             this.state.selectedAnalysis === 'worstSellingProducts') && 
                                                             e.target.data.itemCode)
                                                    {
                                                        // Ürün detay popup'ını aç
                                                        this.setState({ 
                                                            selectedProduct: {
                                                                code: e.target.data.itemCode,
                                                                name: e.target.data.itemName
                                                            },
                                                            productDetailChartType: 'line',
                                                            productDetailAnalysisType: 'daily'
                                                        }, 
                                                        () => 
                                                        {
                                                            // Ürün detay verilerini yükle
                                                            App.instance.setState({isExecute:true})
                                                            
                                                            try 
                                                            {
                                                                let productDetailData = this.calculateProductDetailData(
                                                                    e.target.data.itemCode, 
                                                                    e.target.data.itemName, 
                                                                    'daily'
                                                                )
                                                                this.setState({ 
                                                                    productDetailData
                                                                })
                                                                
                                                                // Popup'ı aç
                                                                this.popProductDetail.show()
                                                            } 
                                                            catch (error) 
                                                            {
                                                                console.error('Error loading product detail:', error)
                                                            }
                                                        });
                                                    }
                                                }}
                                            >
                                                <CommonSeriesSettings 
                                                    argumentField="category" 
                                                    type="bar"
                                                    barPadding={0.1}
                                                    minBarSize={3}
                                                />
                                                <Series
                                                    valueField="value"
                                                    name={this.lang.t("analysisChart.title")}
                                                    hoverMode="allArgumentPoints"
                                                    point={{
                                                        visible: true,
                                                        hoverMode: "allArgumentPoints",
                                                        color: "#1db2f5"
                                                    }}
                                                />
                                                <ArgumentAxis
                                                    allowDecimals={false}
                                                    axisDivisionFactor={1}
                                                    discreteAxisDivisionMode="crossLabels"
                                                >
                                                    <ChartLabel rotationAngle={45} wordWrap="none" textOverflow="ellipsis" />
                                                    <Grid visible={true} />
                                                </ArgumentAxis>
                                                <ValueAxis>
                                                    <Title text={this.lang.t("analysisChart.amount")} />
                                                    <Grid visible={true} />
                                                </ValueAxis>
                                                <Legend 
                                                    visible={true}
                                                    position="outside"
                                                    horizontalAlignment="center"
                                                    verticalAlignment="bottom"
                                                    orientation="horizontal"
                                                />
                                                <Tooltip 
                                                    enabled={true}
                                                    zIndex={9999}
                                                    customizeTooltip={(arg) => 
                                                    {
                                                        if (!arg || !arg.argumentText || !arg.valueText)
                                                        {
                                                            return { text: this.lang.t("noData") };
                                                        }
                                                        
                                                        let tooltipText = `${arg.argumentText}: ${parseFloat(arg.valueText).toFixed(2)} €`
                                                        let dataItem = this.state.productAnalysisData[this.state.selectedAnalysis]?.find(item => 
                                                            item.category === arg.argumentText
                                                        )
                                                        
                                                        if (dataItem) 
                                                        {
                                                            if (dataItem.rank) 
                                                            {
                                                                tooltipText = `${dataItem.rank}. ${tooltipText}`
                                                            }
                                                            if (dataItem.quantity) 
                                                            {    
                                                                tooltipText += `\n${this.lang.t("quantity")}: ${dataItem.quantity}`
                                                            }
                                                            if (dataItem.saleCount) {
                                                                tooltipText += `\n${this.lang.t("saleCount")}: ${dataItem.saleCount}`
                                                            }
                                                        }
                                                        
                                                        return {
                                                            text: tooltipText
                                                        };
                                                    }}
                                                />
                                            </Chart>
                                        )
                                    ) : this.state.selectedAnalysis === 'dayOfWeekDistribution' ? (
                                        <PieChart
                                            id="analysisPieChart"
                                            type="doughnut"
                                        title={this.state.analysisData[this.state.selectedAnalysis]?.[0]?.title || this.lang.t("analysisChart.title")}
                                            palette="Bright"
                                        dataSource={this.state.analysisData[this.state.selectedAnalysis] || []}
                                            visible={this.state.analysisData[this.state.selectedAnalysis]?.length > 0}
                                        >
                                            <PieSeries 
                                                argumentField="category"
                                                valueField="value"
                                            >
                                                <PieLabel visible={true} customizeText={(arg) => {
                                                    let total = (this.state.analysisData[this.state.selectedAnalysis] || []).reduce((sum, item) => sum + item.value, 0)
                                                    let percentage = ((arg.value / total) * 100).toFixed(1)
                                                    return `${arg.argumentText}\n${arg.value.toFixed(2)} € (${percentage}%)`
                                                }}>
                                                    <PieConnector visible={true} /> 
                                                </PieLabel>
                                            </PieSeries>
                                            <PieLegend 
                                                margin={0} 
                                                horizontalAlignment="center" 
                                                verticalAlignment="bottom" 
                                            />
                                            <PieTooltip 
                                                enabled={true}
                                                customizeTooltip={(arg) => 
                                                {
                                                    return {
                                                        text: `${arg.argumentText}: ${parseFloat(arg.valueText).toFixed(2)} €`
                                                    };
                                                }}
                                            />
                                        </PieChart>
                                    ) : this.state.chartType === 'pie' ? 
                                    (
                                        <PieChart
                                            id="analysisPieChart"
                                            type="doughnut"
                                            title={this.state.analysisData[this.state.selectedAnalysis]?.[0]?.title || this.lang.t("analysisChart.title")}
                                        palette="Bright"
                                            dataSource={this.state.analysisData[this.state.selectedAnalysis] || []}
                                            visible={this.state.analysisData[this.state.selectedAnalysis]?.length > 0}
                                        >
                                            <PieSeries 
                                                argumentField="category"
                                                valueField="value"
                                            >
                                                <PieLabel visible={true} customizeText={(arg) => 
                                                {
                                                    let total = (this.state.analysisData[this.state.selectedAnalysis] || []).reduce((sum, item) => sum + item.value, 0)
                                                    let percentage = ((arg.value / total) * 100).toFixed(1)
                                                    return `${arg.argumentText}\n${arg.value.toFixed(2)} € (${percentage}%)`
                                                }}>
                                                    <PieConnector visible={true} /> 
                                                </PieLabel>
                                            </PieSeries>
                                            <PieLegend 
                                                margin={0} 
                                                horizontalAlignment="center" 
                                                verticalAlignment="bottom" 
                                            />
                                            <PieTooltip 
                                                enabled={true}
                                                customizeTooltip={(arg) => 
                                                {
                                                    let tooltipText = `${arg.argumentText}: ${parseFloat(arg.valueText).toFixed(2)} €`
                                                    if (this.state.selectedAnalysis === 'top10Days' || this.state.selectedAnalysis === 'worst10Days') 
                                                    {
                                                        let dataItem = this.state.analysisData[this.state.selectedAnalysis]?.find(item => item.category === arg.argumentText)
                                                        if (dataItem && dataItem.rank) 
                                                        {
                                                            tooltipText = `${dataItem.rank}. ${tooltipText}`
                                                        }
                                                    }
                                                    return { text: tooltipText };
                                                }}
                                            />
                                        </PieChart>
                                    ) : this.state.chartType === 'line' ? 
                                    (
                                        <Chart
                                            id="analysisLineChart"
                                            title={this.state.analysisData[this.state.selectedAnalysis]?.[0]?.title || this.lang.t("analysisChart.title")}
                                            dataSource={this.state.analysisData[this.state.selectedAnalysis] || []}
                                            palette="Bright"
                                            style={{minHeight: '400px'}}
                                        visible={this.state.analysisData[this.state.selectedAnalysis]?.length > 0}
                                    >
                                        <CommonSeriesSettings 
                                            argumentField="category" 
                                                type="line"
                                        />
                                        <Series
                                            valueField="value"
                                            name={this.lang.t("analysisChart.title")}
                                                hoverMode="allArgumentPoints"
                                                point={{
                                                    hoverMode: "allArgumentPoints"
                                                }}
                                        />
                                        <ArgumentAxis
                                            allowDecimals={false}
                                            axisDivisionFactor={1}
                                            discreteAxisDivisionMode="crossLabels"
                                        >
                                            <ChartLabel rotationAngle={45} />
                                        </ArgumentAxis>
                                        <ValueAxis>
                                            <Title text={this.lang.t("analysisChart.amount")} />
                                        </ValueAxis>
                                        <Legend 
                                            position="outside"
                                            horizontalAlignment="center"
                                            verticalAlignment="bottom"
                                            orientation="horizontal"
                                        />
                                        <Tooltip 
                                            enabled={true}
                                                zIndex={9999}
                                                customizeTooltip={(arg) => 
                                                {
                                                let tooltipText = `${arg.argumentText}: ${parseFloat(arg.valueText).toFixed(2)} €`
                                                if (this.state.selectedAnalysis === 'top10Days' || this.state.selectedAnalysis === 'worst10Days') 
                                                {
                                                    let dataItem = this.state.analysisData[this.state.selectedAnalysis]?.find(item => item.category === arg.argumentText)
                                                    if (dataItem && dataItem.rank) 
                                                    {
                                                        tooltipText = `${dataItem.rank}. ${tooltipText}`
                                                    }
                                                }
                                                    return { text: tooltipText };
                                                }}
                                            />
                                        </Chart>
                                    ) : (
                                        // Diğer analizler için Bar Chart
                                        <Chart
                                            id="analysisChart"
                                            title={this.state.analysisData[this.state.selectedAnalysis]?.[0]?.title || this.lang.t("analysisChart.title")}
                                            dataSource={this.state.analysisData[this.state.selectedAnalysis] || []}
                                            palette="Bright"
                                            style={{minHeight: '400px'}}
                                            visible={this.state.analysisData[this.state.selectedAnalysis]?.length > 0}
                                            onPointClick={async (e) => 
                                            {
                                                
                                                // Eğer ürün grupları grafiğindeyse ve bir gruba tıklandıysa
                                                if (this.state.selectedAnalysis === 'topSellingProductGroups' && e.target.data.groupCode) {
                                                    
                                                    // Önce state'i güncelle
                                                    this.setState({ 
                                                        selectedProductGroup: e.target.data.groupCode,
                                                        selectedAnalysis: 'topSellingProductsInGroup'
                                                    },   
                                                    async () => 
                                                    {
                                                        // Sonra veriyi yükle
                                                        let productAnalysisData = await this.calculateProductAnalysisData('topSellingProductsInGroup');
                                                        this.setState({ productAnalysisData: productAnalysisData });
                                                    });
                                                }
                                            }}
                                        >
                                            <CommonSeriesSettings 
                                                argumentField="category" 
                                                type="bar"
                                            />
                                            <Series
                                                valueField="value"
                                                name={this.lang.t("analysisChart.title")}
                                                hoverMode="allArgumentPoints"
                                                point={{
                                                    hoverMode: "allArgumentPoints"
                                                }}
                                            />
                                            <ArgumentAxis
                                                allowDecimals={false}
                                                axisDivisionFactor={1}
                                                discreteAxisDivisionMode="crossLabels"
                                            >
                                                <ChartLabel rotationAngle={45} wordWrap="none" textOverflow="ellipsis" />
                                                <Grid visible={true} />
                                            </ArgumentAxis>
                                            <ValueAxis>
                                                <Title text={this.lang.t("analysisChart.amount")} />
                                                <Grid visible={true} />
                                            </ValueAxis>
                                            <Legend 
                                                position="outside"
                                                horizontalAlignment="center"
                                                verticalAlignment="bottom"
                                                orientation="horizontal"
                                            />
                                            <Tooltip 
                                                enabled={true}
                                                zIndex={9999}
                                                customizeTooltip={(arg) => {
                                                    if (!arg || !arg.argumentText || !arg.valueText) 
                                                    {
                                                        return { text: this.lang.t("noData") };
                                                    }
                                                    
                                                    let tooltipText = `${arg.argumentText}: ${parseFloat(arg.valueText).toFixed(2)} €`
                                                    let dataItem = this.state.analysisData[this.state.selectedAnalysis]?.find(item => 
                                                        item.category === arg.argumentText
                                                    )
                                                    
                                                    if (dataItem) 
                                                    {
                                                        if (dataItem.rank) 
                                                        {
                                                            tooltipText = `${dataItem.rank}. ${tooltipText}`
                                                        }
                                                        if (dataItem.quantity) 
                                                        {
                                                            tooltipText += `\n${this.lang.t("quantity")}: ${dataItem.quantity}`
                                                        }
                                                        if (dataItem.saleCount) 
                                                        {
                                                            tooltipText += `\n${this.lang.t("saleCount")}: ${dataItem.saleCount}`
                                                    }
                                                }
                                                
                                                return {
                                                    text: tooltipText
                                                };
                                            }}
                                        />
                                    </Chart>
                                    )}
                                
                                </div>
                            </div>
                        </div>
                    </NdPopUp>
                    
                    {/* Ürün Detay PopUp */}
                    <NdPopUp parent={this} id={"popProductDetail"} 
                    visible={false}
                    showCloseButton={true}
                    showTitle={true}
                    title={this.state.selectedProduct ? `${this.state.selectedProduct.name} - ${this.lang.t("productDetailAnalysis")}` : this.lang.t("productDetailAnalysis")}
                    container={'#' + this.props.data.id + this.tabIndex}       
                    width={'1400'}
                    height={'900'}
                    position={{of:'#' + this.props.data.id + this.tabIndex}}
                    ref={(el) => { this.popProductDetail = el }}
                    onHiding={async () => 
                    {
                        await new Promise(resolve => this.setState({
                            selectedProduct: null,
                            productDetailData: {},
                            productDetailAnalysisType: 'daily',
                            productDetailChartType: 'line'
                        }, resolve));
                        App.instance.setState({isExecute:false});
                    }}
                    onShowing={async () => 
                    {
                        const newKey = Date.now();
                        await new Promise(resolve => this.setState({
                            productDetailAnalysisType: 'daily',
                            productDetailChartType: 'line',
                            productDetailData: {},
                            selectBoxResetKey: newKey
                        }, resolve));
                        if (this.state.selectedProduct) 
                        {
                            App.instance.setState({isExecute:true})
                            try {
                                let productDetailData = await this.calculateProductDetailData(
                                    this.state.selectedProduct.code,
                                    this.state.selectedProduct.name,
                                    'daily'
                                )
                                this.setState({ productDetailData })
                            } 
                            catch (err) 
                            {
                                this.setState({ productDetailData: {} })
                            } 
                            finally 
                            {
                                App.instance.setState({isExecute:false})
                            }
                            } 
                        else 
                        {
                            this.setState({ productDetailData: {} })
                        }
                    }}
                    >
                        <div className="row p-4">
                            {/* Başlık ve Açıklama */}
                            <div className="col-12 mb-4 text-center">
                                <h4 style={{color: '#2c3e50', marginBottom: '10px'}}>
                                    {this.state.selectedProduct ? this.state.selectedProduct.name : this.lang.t("productDetailAnalysis")}
                                </h4>
                                <p style={{color: '#7f8c8d', fontSize: '14px'}}>
                                    {this.lang.t("productDetailDescription")}
                                </p>
                            </div>
                            
                            {/* Analiz Seçim Paneli */}
                            <div className="col-12 mb-4">
                                <div style={{
                                    borderRadius: '12px',
                                    padding: '25px',
                                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                                }}>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div style={{marginBottom: '15px'}}>
                                                <Label 
                                                    text={this.lang.t("selectAnalysisType")} 
                                                    alignment="center"
                                                    style={{color: 'white', fontWeight: 'bold', fontSize: '16px'}}
                                                />
                                            </div>
                                            <NdSelectBox key={this.state.selectBoxResetKey}
                                                id="selProductDetailAnalysisType" 
                                                parent={this} 
                                                dataSource={[
                                                    { id: 'daily', name: '📅 ' + this.lang.t("dailyAnalysis") },
                                                    { id: 'weekly', name: '📊 ' + this.lang.t("weeklyAnalysis") },
                                                    { id: 'monthly', name: '📈 ' + this.lang.t("monthlyAnalysis") },
                                                    { id: 'dayOfWeek', name: '🗓️ ' + this.lang.t("dayOfWeekAnalysis") },
                                                    { id: 'yearly', name: '📆 ' + this.lang.t("yearlyAnalysis") }
                                                ]}
                                                displayExpr="name"
                                                valueExpr="id"
                                                value={this.state.productDetailAnalysisType}
                                                width="100%"
                                                onValueChanged={async (e) => 
                                                {
                                                    if (this.state.selectedProduct) 
                                                    {
                                                        this.setState({ productDetailAnalysisType: e.value })
                                                        App.instance.setState({isExecute:true})
                                                        try 
                                                        {
                                                            let productDetailData = await this.calculateProductDetailData(
                                                                this.state.selectedProduct.code, 
                                                                this.state.selectedProduct.name, 
                                                                e.value
                                                            )
                                                            this.setState({ productDetailData })
                                                        } 
                                                        catch (error) 
                                                        {
                                                            console.error('Error loading product detail data:', error)
                                                        }
                                                        finally
                                                        {
                                                            App.instance.setState({isExecute:false})
                                                        }
                                                    }
                                                }}
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <div style={{marginBottom: '15px'}}>
                                                <Label 
                                                    text={this.lang.t("chartType")} 
                                                    alignment="center"
                                                    style={{color: 'white', fontWeight: 'bold', fontSize: '16px'}}
                                                />
                                            </div>
                                            <NdSelectBox key={this.state.selectBoxResetKey}
                                                id="selProductDetailChartType" 
                                                parent={this} 
                                                dataSource={[
                                                    { id: 'line', name: '📈 ' + this.lang.t("lineChart") },
                                                    { id: 'bar', name: '📊 ' + this.lang.t("barChartPop") }
                                                ]}
                                                displayExpr="name"
                                                valueExpr="id"
                                                value={this.state.productDetailChartType}
                                                width="100%"
                                                onValueChanged={e => 
                                                {
                                                    this.setState({ productDetailChartType: e.value });
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Grafik Alanı */}
                            <div className="col-12">
                                <div style={{
                                    minHeight: '600px',
                                    border: '2px solid #e2e8f0', 
                                    borderRadius: '12px', 
                                    padding: '25px', 
                                    position: 'relative',
                                    background: 'white',
                                    boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
                                }}>
                                    {/* Ürün detay grafiği render kısmı */}
                                    {this.state.productDetailData && this.state.productDetailData[this.state.productDetailAnalysisType] ? (
                                        this.state.productDetailChartType === 'pie' ? 
                                        (
                                            <PieChart
                                            key={this.state.popProductDetailResetKey}
                                                id="productDetailPieChart"
                                                type="doughnut"
                                                title={this.state.productDetailData[this.state.productDetailAnalysisType]?.[0]?.title || this.lang.t("productDetailAnalysis")}
                                                palette="Bright"
                                                dataSource={this.state.productDetailData[this.state.productDetailAnalysisType] || []}
                                                visible={this.state.productDetailData[this.state.productDetailAnalysisType]?.length > 0}
                                            >
                                                <PieSeries 
                                                    argumentField="category"
                                                    valueField="value"
                                                >
                                                    <PieLabel visible={true} customizeText={(arg) => 
                                                    {
                                                        let total = (this.state.productDetailData[this.state.productDetailAnalysisType] || []).reduce((sum, item) => sum + item.value, 0)
                                                        let percentage = ((arg.value / total) * 100).toFixed(1)
                                                        return `${arg.argumentText}\n${arg.value.toFixed(2)} € (${percentage}%)`
                                                    }}>
                                                        <PieConnector visible={true} /> 
                                                    </PieLabel>
                                                </PieSeries>
                                                <PieLegend 
                                                    margin={0} 
                                                    horizontalAlignment="center" 
                                                    verticalAlignment="bottom" 
                                                />
                                                <PieTooltip 
                                                    enabled={true}
                                                    customizeTooltip={(arg) => {
                                                        if (!arg || !arg.argumentText || !arg.valueText) {
                                                            return { text: this.lang.t("noData") };
                                                        }
                                                        
                                                        let tooltipText = `${arg.argumentText}: ${parseFloat(arg.valueText).toFixed(2)} €`
                                                        let dataItem = this.state.productDetailData[this.state.productDetailAnalysisType]?.find(item => 
                                                            item.category === arg.argumentText
                                                        )
                                                        
                                                        if (dataItem) 
                                                        {
                                                            if (dataItem.quantity) 
                                                            {
                                                                tooltipText += `\n${this.lang.t("quantity")}: ${dataItem.quantity}`
                                                            }
                                                            if (dataItem.saleCount) 
                                                            {
                                                                tooltipText += `\n${this.lang.t("saleCount")}: ${dataItem.saleCount}`
                                                            }
                                                        }
                                                        
                                                        return {
                                                            text: tooltipText
                                                        };
                                                    }}
                                                />
                                            </PieChart>
                                        ) : this.state.productDetailChartType === 'line' ? 
                                        (
                                            <Chart
                                                key={this.state.popProductDetailResetKey}
                                                id="productDetailLineChart"
                                                title={this.state.productDetailData[this.state.productDetailAnalysisType]?.[0]?.title || this.lang.t("productDetailAnalysis")}
                                                dataSource={this.state.productDetailData[this.state.productDetailAnalysisType] || []}
                                                palette="Bright"
                                                style={{minHeight: '400px'}}
                                                visible={this.state.productDetailData[this.state.productDetailAnalysisType]?.length > 0}
                                            >
                                                <CommonSeriesSettings 
                                                    argumentField="category" 
                                                    type="spline"
                                                />
                                                <Series
                                                    valueField="value"
                                                    name={this.lang.t("amount")}
                                                    hoverMode="allArgumentPoints"
                                                    point={{
                                                        hoverMode: "allArgumentPoints"
                                                    }}
                                                />
                                                <ArgumentAxis
                                                    allowDecimals={false}
                                                    axisDivisionFactor={1}
                                                    discreteAxisDivisionMode="crossLabels"
                                                >
                                                    <ChartLabel rotationAngle={45} />
                                                </ArgumentAxis>
                                                <ValueAxis>
                                                    <Title text={this.lang.t("amount")} />
                                                </ValueAxis>
                                                <Legend 
                                                    position="outside"
                                                    horizontalAlignment="center"
                                                    verticalAlignment="bottom"
                                                    orientation="horizontal"
                                                />
                                                <Tooltip 
                                                    enabled={true}
                                                    zIndex={9999}
                                                    customizeTooltip={(arg) => 
                                                    {
                                                        if (!arg || !arg.argumentText || !arg.valueText) 
                                                        {
                                                            return { text: this.lang.t("noData") };
                                                        }
                                                        
                                                        let tooltipText = `${arg.argumentText}: ${parseFloat(arg.valueText).toFixed(2)} €`
                                                        let dataItem = this.state.productDetailData[this.state.productDetailAnalysisType]?.find(item => 
                                                            item.category === arg.argumentText
                                                        )
                                                        
                                                        if (dataItem) 
                                                        {
                                                            if (dataItem.quantity) 
                                                            {
                                                                tooltipText += `\n${this.lang.t("quantity")}: ${dataItem.quantity}`
                                                            }
                                                            if (dataItem.saleCount) 
                                                            {
                                                                tooltipText += `\n${this.lang.t("saleCount")}: ${dataItem.saleCount}`
                                                            }
                                                        }
                                                        
                                                        return { text: tooltipText };
                                                    }}
                                                />
                                            </Chart>
                                        ) : this.state.productDetailChartType === 'bar' ? 
                                        (
                                            <Chart
                                                key={this.state.popProductDetailResetKey}
                                                id="productDetailBarChart"
                                                title={this.state.productDetailData[this.state.productDetailAnalysisType]?.[0]?.title || this.lang.t("productDetailAnalysis")}
                                                dataSource={this.state.productDetailData[this.state.productDetailAnalysisType] || []}
                                                palette="Bright"
                                                style={{minHeight: '400px'}}
                                                visible={this.state.productDetailData[this.state.productDetailAnalysisType]?.length > 0}
                                            >
                                                <CommonSeriesSettings 
                                                    argumentField="category" 
                                                    type="bar"
                                                    barPadding={0.1}
                                                    minBarSize={3}
                                                />
                                                <Series
                                                    valueField="value"
                                                    name={this.lang.t("amount")}
                                                    hoverMode="allArgumentPoints"
                                                    point={{
                                                        visible: true,
                                                        hoverMode: "allArgumentPoints",
                                                        color: "#1db2f5"
                                                    }}
                                                />
                                                <ArgumentAxis
                                                    allowDecimals={false}
                                                    axisDivisionFactor={1}
                                                    discreteAxisDivisionMode="crossLabels"
                                                >
                                                    <ChartLabel rotationAngle={45} wordWrap="none" textOverflow="ellipsis" />
                                                    <Grid visible={true} />
                                                </ArgumentAxis>
                                                <ValueAxis>
                                                    <Title text={this.lang.t("amount")} />
                                                    <Grid visible={true} />
                                                </ValueAxis>
                                                <Legend 
                                                    visible={true}
                                                    position="outside"
                                                    horizontalAlignment="center"
                                                    verticalAlignment="bottom"
                                                    orientation="horizontal"
                                                />
                                                <Tooltip 
                                                    enabled={true}
                                                    zIndex={9999}
                                                    customizeTooltip={(arg) => 
                                                    {
                                                        if (!arg || !arg.argumentText || !arg.valueText) 
                                                        {
                                                            return { text: this.lang.t("noData") };
                                                        }
                                                        
                                                        let tooltipText = `${arg.argumentText}: ${parseFloat(arg.valueText).toFixed(2)} €`
                                                        let dataItem = this.state.productDetailData[this.state.productDetailAnalysisType]?.find(item => 
                                                            item.category === arg.argumentText
                                                        )
                                                        
                                                        if (dataItem) 
                                                        {
                                                            if (dataItem.quantity) 
                                                            {
                                                                tooltipText += `\n${this.lang.t("quantity")}: ${dataItem.quantity}`
                                                            }
                                                            if (dataItem.saleCount) 
                                                            {
                                                                tooltipText += `\n${this.lang.t("saleCount")}: ${dataItem.saleCount}`
                                                            }
                                                        }
                                                        
                                                        return {
                                                            text: tooltipText
                                                        };
                                                    }}
                                                />
                                            </Chart>
                                        ) : (
                                            // Default line chart
                                            <Chart
                                                key={this.state.popProductDetailResetKey}
                                                id="productDetailLineChart"
                                                title={this.state.productDetailData[this.state.productDetailAnalysisType]?.[0]?.title || this.lang.t("productDetailAnalysis")}
                                                dataSource={this.state.productDetailData[this.state.productDetailAnalysisType] || []}
                                                palette="Bright"
                                                style={{minHeight: '400px'}}
                                                visible={this.state.productDetailData[this.state.productDetailAnalysisType]?.length > 0}
                                            >
                                                <CommonSeriesSettings 
                                                    argumentField="category" 
                                                    type="spline"
                                                />
                                                <Series
                                                    valueField="value"
                                                    name={this.lang.t("amount")}
                                                    hoverMode="allArgumentPoints"
                                                    point={{
                                                        hoverMode: "allArgumentPoints"
                                                    }}
                                                />
                                                <ArgumentAxis
                                                    allowDecimals={false}
                                                    axisDivisionFactor={1}
                                                    discreteAxisDivisionMode="crossLabels"
                                                >
                                                    <ChartLabel rotationAngle={45} />
                                                </ArgumentAxis>
                                                <ValueAxis>
                                                    <Title text={this.lang.t("amount")} />
                                                </ValueAxis>
                                                <Legend 
                                                    position="outside"
                                                    horizontalAlignment="center"
                                                    verticalAlignment="bottom"
                                                    orientation="horizontal"
                                                />
                                                <Tooltip 
                                                    enabled={true}
                                                    zIndex={9999}
                                                    customizeTooltip={(arg) => 
                                                    {
                                                        if (!arg || !arg.argumentText || !arg.valueText) 
                                                        {
                                                            return { text: this.lang.t("noData") };
                                                        }
                                                        
                                                        let tooltipText = `${arg.argumentText}: ${parseFloat(arg.valueText).toFixed(2)} €`
                                                        let dataItem = this.state.productDetailData[this.state.productDetailAnalysisType]?.find(item => 
                                                            item.category === arg.argumentText
                                                        )
                                                        
                                                        if (dataItem) 
                                                        {
                                                            if (dataItem.quantity) 
                                                            {
                                                                tooltipText += `\n${this.lang.t("quantity")}: ${dataItem.quantity}`
                                                            }
                                                            if (dataItem.saleCount) 
                                                            {
                                                                tooltipText += `\n${this.lang.t("saleCount")}: ${dataItem.saleCount}`
                                                            }
                                                        }
                                                        
                                                        return { text: tooltipText };
                                                    }}
                                                />
                                            </Chart>
                                        )
                                    ) : (
                                        <div style={{minHeight: '600px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                            <span>{this.lang.t("noData")}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </NdPopUp>
                </ScrollView>
            </div>
        )
    }

    // Para birimi dağılımı verisi
    getCurrencyDistributionData() 
    {
        if (!this.state.chartData || this.state.chartData.length === 0) 
        {
            return [];
        }

        let currencyData = {};
        
        this.state.chartData.forEach(item => {
            // Para birimi kategorileri
            let cashAmount = (item['ESC'] || 0) + (item['FRANC'] || 0);
            let cardAmount = (item['CB'] || 0) + (item['CB TICKET'] || 0);
            let checkAmount = item['CHECK'] || 0;
            let voucherAmount = (item['BON DE VALAUER'] || 0) + (item['BON D\'AVOIR'] || 0);
            let creditAmount = item['AVOIR'] || 0;
            let transferAmount = (item['VIRM'] || 0) + (item['PRLV'] || 0);
            let ticketAmount = item['T.R'] || 0;

            // Kategorilere göre grupla
            if (cashAmount > 0) currencyData[this.lang.t("currencyDistributionChart.cash")] = (currencyData[this.lang.t("currencyDistributionChart.cash")] || 0) + cashAmount;
            if (cardAmount > 0) currencyData[this.lang.t("currencyDistributionChart.card")] = (currencyData[this.lang.t("currencyDistributionChart.card")] || 0) + cardAmount;
            if (checkAmount > 0) currencyData[this.lang.t("currencyDistributionChart.check")] = (currencyData[this.lang.t("currencyDistributionChart.check")] || 0) + checkAmount;
            if (voucherAmount > 0) currencyData[this.lang.t("currencyDistributionChart.voucher")] = (currencyData[this.lang.t("currencyDistributionChart.voucher")] || 0) + voucherAmount;
            if (creditAmount > 0) currencyData[this.lang.t("currencyDistributionChart.credit")] = (currencyData[this.lang.t("currencyDistributionChart.credit")] || 0) + creditAmount;
            if (transferAmount > 0) currencyData[this.lang.t("currencyDistributionChart.transfer")] = (currencyData[this.lang.t("currencyDistributionChart.transfer")] || 0) + transferAmount;
            if (ticketAmount > 0) currencyData[this.lang.t("currencyDistributionChart.ticket")] = (currencyData[this.lang.t("currencyDistributionChart.ticket")] || 0) + ticketAmount;
        });

        // Array formatına çevir
        return Object.keys(currencyData).map(currency => (
        {
            currency: currency,
            amount: parseFloat(currencyData[currency].toFixed(2))
        })).sort((a, b) => b.amount - a.amount);
    }

    // Saatlik satış dağılımı verisi (Gerçek verilerden)
    async getHourlySalesData() 
    {
        try 
        {
            // Gerçek saatlik veri çek
            let tmpQuery = 
            {
                query: `SELECT 
                        DATEPART(HOUR, POS.CDATE) AS HOUR,
                        SUM(CASE WHEN POS.TYPE = 0 THEN POS.TOTAL ELSE POS.TOTAL * -1 END) AS TOTAL_SALES,
                        COUNT(*) AS SALE_COUNT
                        FROM POS_SALE_VW_01 AS POS 
                        WHERE POS.STATUS = 1 
                        AND POS.DOC_DATE >= @START 
                        AND POS.DOC_DATE <= @END 
                        AND POS.DEVICE <> '9999' 
                        AND POS.TOTAL <> 0
                        GROUP BY DATEPART(HOUR, POS.CDATE)
                        ORDER BY DATEPART(HOUR, POS.CDATE)`,
                param: ['START:date', 'END:date'],
                value: [this.dtDate.startDate, this.dtDate.endDate]
            };

            App.instance.setState({ isExecute: true });
            let tmpData = await this.core.sql.execute(tmpQuery);
            App.instance.setState({ isExecute: false });

            let hourlyData = [];
            
            for (let hour = 7; hour <= 22; hour++) 
            {
                let hourLabel = hour < 10 ? `0${hour}:00` : `${hour}:00`;

            let realData = tmpData && tmpData.result && tmpData.result.recordset ? 
                tmpData.result.recordset.find(row => row.HOUR === hour) : null;
                
                let totalSales = 0;
                let saleCount = 0;
                
                if (realData) 
                {
                    totalSales = parseFloat(realData.TOTAL_SALES || 0);
                    saleCount = parseInt(realData.SALE_COUNT || 0);
                }
                
                hourlyData.push(
                {
                    hour: hourLabel,
                    totalSales: parseFloat(totalSales.toFixed(2)),
                    saleCount: saleCount
                });
            }

            return hourlyData;
        } 
        catch (error) 
        {
            console.error(this.lang.t("hourlySalesChart.error"), error);
            return [];
        }
    }
}