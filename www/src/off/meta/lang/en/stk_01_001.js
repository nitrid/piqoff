//Yeni Ürün Tanımlama
const stk_01_001 = 
{
    txtRef: "Reference",
    cmbItemGrp: "Product Group",
    txtCustomer: "Supplier",
    cmbItemGenus: "Product Genus",
    txtBarcode: "Barcode",
    cmbTax: "Tax",
    cmbMainUnit: "Main Unit",
    cmbOrigin: "Origin" ,
    cmbUnderUnit: "Under Unit",
    txtItemName: "Product Name",
    txtShortName: "Short Name",
    chkActive: "Active",
    chkCaseWeighed: "Case Weighed",
    chkLineMerged: "Line Merged",
    chkTicketRest: "Ticket Rest.",
    chkInterfel : "Interfel",
    chkPartiLot : "Lot Number",
    txtCostPrice: "Cost Price",
    txtSalePrice : "Sale Price",
    txtMinSalePrice: "Min. Sale Price",
    txtMaxSalePrice: "Max. Sale Price",
    txtLastBuyPrice: "Last Buy Price",
    txtLastSalePrice: "Last Sale Price",
    tabTitlePrice: "Price",
    tabTitleUnit: "Unit",
    tabTitleBarcode: "Barcode",
    tabTitleCustomer: "Supplier",
    tabExtraCost: "Extra Costs",
    tabTitleCustomerPrice: "Supplier Price History",
    tabTitleSalesContract: "Sales Contracts",
    tabTitleInfo: "Info",
    tabTitleOtherShop :"Other Shop Info",
    tabTitleDetail : "Detail Info",
    txtTaxSugar: "Sugar Rate (100ML/GR)",
    txtTotalExtraCost : "Extra Costs",
    clmtaxSugar : "Sugar Tax",
    priceUpdate : "Price Update",
    underUnitPrice : "Under Unit Price",
    minBuyPrice : "Minimum Buy Price",
    maxBuyPrice : "Maximum Buy Price",
    sellPriceAdd : "Sell Price Add",
    clmInvoiceCost : "Invoice Cost",
    validOrigin : "Origin cannot be empty !",
    validTaxSucre : "Please enter the sugar rate correctly !",
    validName : "Name cannot be empty !",
    validQuantity : "Quantity cannot be empty !" ,
    validPrice :"Price cannot be empty !",
    validPriceFloat : "Price must be greater than 0 !",
    validCustomerCode :"Please enter the supplier code !",
    validOriginMax8 :"Please enter 8 characters !",
    validTax : "Tax cannot be empty !",
    mainUnitName :"Main Unit",
    underUnitName : "Under Unit",
    chkDayAnalysis : "Daily",
    chkMountAnalysis : "Monthly",
    txtUnitFactor : "Unit Factor",
    cmbAnlysType : "Type",
    txtCustoms : "Customs Code",
    txtGenus : "Product Genus",
    cmbAnlysTypeData : 
    {
        pos: "Pos",
        invoice : "Invoice"
    },
    pg_txtRef:
    {
        title: "Product Selection",
        clmCode: "CODE",
        clmName: "NAME",
        clmStatus: "STATUS"
    },
    pg_txtPopCustomerCode:
    {
        title: "Customer Selection",
        clmCode: "CODE",
        clmName: "NAME", 
    },
    popPrice:
    {
        title: "Price Add",
        cmbPopPriListNo: "List No",
        dtPopPriStartDate: "Start Date",
        dtPopPriEndDate: "End Date", 
        cmbPopPriDepot: "Depot",
        txtPopPriQuantity: "Quantity",
        txtPopPriPrice: "Price",
        txtPopPriHT: "Tax Free Price",
        txtPopPriTTC : "Tax Price",
        txtPopPriceMargin : "Margin %",
        txtPopPriceGrossMargin : "Gross Margin %",
        txtPopPriceNetMargin : "Net Margin %"
    },
    msgDateInvalid:
    {
        title: "Warning",
        msg: "Invalid date",
        btn01: "OK"
    },
    popUnit:
    {
        title: "Unit Add",
        cmbPopUnitType: "Type",
        cmbPopUnitName: "Unit Name", 
        txtPopUnitFactor: "Factor",
        txtPopUnitWeight: "Weight",
        txtPopUnitVolume: "Volume",
        txtPopUnitWidth: "Width",
        txtPopUnitHeight: "Height",
        txtPopUnitSize: "Size"
    },
    popBarcode:
    {
        title: "Barcode Add",
        txtPopBarcode: "Barcode",
        cmbPopBarUnit: "Unit", 
        cmbPopBarType: "Type"
    },
    popCustomer:
    {
        title: "Customer Add",
        txtPopCustomerCode: "Code",
        txtPopCustomerName: "Name", 
        txtPopCustomerItemCode: "Item Code",
        txtPopCustomerPrice: "Price"
    },
    grdPrice: 
    {
        clmListNo: "List No",
        clmDepot: "Depot",
        clmCustomerName: "Customer",
        clmStartDate: "Start Date",
        clmFinishDate: "End Date",
        clmQuantity: "Quantity",
        clmPriceHT: "Tax Free Price",
        clmPriceTTC : "Tax Price",
        clmPrice: "Price",
        clmGrossMargin: "Gross Margin",
        clmNetMargin: "Net Margin",
        clmMargin : "Margin %",
        clmListName: "List Name"
    },
    grdUnit: 
    {
        clmType: "Type",
        clmName: "Name",
        clmFactor: "Factor",
        clmWeight: "Weight",
        clmVolume: "Volume",
        clmWidth: "Width",
        clmHeight: "Height",
        clmSize: "Size"
    },
    grdBarcode: 
    {
        clmBarcode: "Barcode",
        clmUnit: "Unit",
        clmType: "Type"
    },
    grdExtraCost: 
    {
        clmDate: "Date",
        clmPrice: "Extra Cost",
        clmTypeName: "Type",
        clmCustomerPrice : "Customer Price",
        clmCustomer : "Customer",
        clmDescription : "Description",
    },
    grdCustomer: 
    {
        clmCode: "Code",
        clmName: "Name",
        clmPriceUserName: "User",
        clmPriceDate: "Last Price Date",
        clmPrice: "Price",
        clmMulticode: "Customer Item Code"
    },
    grdSalesContract: 
    {
        clmUser: "User",
        clmCode: "Code",
        clmName: "Name",
        clmDate: "Last Price Date",
        clmPrice: "Price",
        clmMulticode: "Customer Item Code"
    },
    grdCustomerPrice: 
    {
        clmUser: "User",
        clmCode: "Code",
        clmName: "Name",
        clmDate: "Last Price Date",
        clmPrice: "Price",
        clmMulticode: "Customer Item Code"
    },
    grdOtherShop: 
    {
        clmCode: "Product Code",
        clmName: "Product Name",
        clmBarcode: "Barcode",
        clmPrice: "Price",
        clmMulticode: "Customer Item Code",
        clmCustomer: "Customer",
        clmCustomerPrice: "Customer Price",
        clmShop: "Shop",
        clmDate: "Update Date"
    },
    msgRef:
    {
        title: "Warning",
        btn01: "Product",
        btn02: "OK",
        msg: "The product you entered is already in the system !"
    },
    msgBarcode:
    {
        title: "Warning",
        btn01: "Product",
        btn02: "OK",
        msg: "The barcode you entered is already in the system !"
    },
    msgCustomer:
    {
        title: "Warning",
        btn01: "Product",
        btn02: "OK",
        msg: "The customer item code you entered is already in the system !"
    },
    msgPriceSave:
    {
        title: "Warning",
        btn01: "OK",
        msg: "Please enter the price !"
    },
    msgSave:
    {
        title: "Warning",
        btn01: "OK",
        btn02: "Cancel",
        msg: "Are you sure you want to save the record ?"
    },
    msgSaveResult:
    {
        title: "Warning",
        btn01: "OK",
        msgSuccess: "The record has been saved successfully !",
        msgFailed: "The record has been saved unsuccessfully !"
    },
    msgSaveValid:
    {
        title: "Warning",
        btn01: "OK",
        msg: "Please fill in the required fields !"
    },
    msgDelete:
    {
        title: "Warning",
        btn01: "OK",
        btn02: "Cancel",
        msg: "Are you sure you want to delete the record ?"
    },
    msgCostPriceValid:
    {
        title: "Warning",
        btn01: "OK",
        msg: "Please enter a price higher than the purchase price !"
    },
    msgPriceAdd:
    {
        title: "Warning",
        btn01: "OK",
        msg: "Please fill in the required fields !"
    },
    tabTitleSalesPriceHistory : "Sales Price History",
    grdSalesPrice : 
    {
        clmUser : "User",
        clmDate : "Change Date",
        clmPrice : "Price",
    },
    grdItemInfo: 
    {
        cDate: "Creation Date",
        cUser: "Creator User",
        lDate: "Last Change Date",
        lUser : "Last Change User",
    },
    msgCheckPrice:
    {
        title: "Warning",
        btn01: "OK",
        msg: "You cannot create a similar record !"
    },
    msgCheckCustomerCode:
    {
        title: "Warning",
        btn01: "OK",
        msg: "The supplier you entered is already defined !"
    },
    msgSalePriceToCustomerPrice:
    {
        title: "Warning",
        btn01: "OK",
        msg: "The supplier price you entered cannot be higher than the sales price ! Please check your sales price."
    },
    popAnalysis :
    {
        title : "Sales Statistics"
    },
    popDescription :
    {
        title : "Product Language and Description",
        label : "Product Description"
    },
    grdLang : 
    {
        clmLang : "Language",
        clmName : "Product Name",
    },
    popItemLang : 
    {
        title : "Product Language",
        cmbPopItemLanguage : "Language",
        cmbPopItemLangName : "Product Name",
    },
    grdAnalysis: 
    {
        clmToday: "Today",
        clmYesterday: "Yesterday",
        clmWeek: "This Week",
        clmMount : "This Month",
        clmYear : "This Year",
        clmLastYear : "Last Year"
    },
    dtFirstAnalysis : "Start",
    dtLastAnalysis : "End",
    btnGet : "Get",
    msgNotDelete:
    {
        title: "Warning",
        btn01: "OK",
        msg: "This product has been processed and cannot be deleted !!"
    },
    cmbItemGenusData :
    {
        item : "Product",
        service : "Service",
        deposit : "Deposit"
    },
    msgUnit:
    {
        title: "Unit Calculation",
        btn01: "OK",
    },
    msgUnitRowNotDelete :
    {
        title: "Warning",
        btn01: "OK",
        msg: "You cannot delete the main unit or the under unit !"
    },
    pg_customsCode : 
    {
        title : "Customs Codes",
        clmCode : "CODE",
        clmName : "NAME"
    },
    pg_txtGenre : 
    {
        title : "Product Genus",   
        clmCode : "CODE",   
        clmName : "NAME"   
    },
    msgNewItem:
    {
        title: "Warning",
        btn01: "Yes",
        btn02: "Cancel",
        msg: "Are you sure you want to go to the new product ?!"
    },
    msgItemBack:
    {
        title: "Warning",
        btn01: "Yes",
        btn02: "Cancel",
        msg: "Are you sure you want to go back to the product ?!"
    },
    btnSubGroup : "Add Sub Group",
    pg_subGroup : 
    {
        title : "Sub Group Selection",
        clmName : "Name",
    },
    grdProperty : 
    {
        clmProperty : "Property",
        clmValue : "Value",
    },
    propertyPopup : 
    {
        title : "Add Property", 
        property : "Property",
        value : "Value",
        add : "Add",
    },
    btnProperty : "Add Property",
    grdProperty : 
    {
        clmProperty : "Property",
        clmValue : "Value",
    },
}
export default stk_01_001