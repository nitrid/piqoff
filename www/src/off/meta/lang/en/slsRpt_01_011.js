// "Satış Teklifi Listesi"
const slsRpt_01_011 =
{
    cmbCustomer :"Customer",
    btnGet :"Get",
    dtFirst : "First Date",
    dtLast : "Last Date",
    txtCustomerCode : "Customer",
    menu:"Sales Order List",
    pg_txtCustomerCode : 
    {
        title : "Customer Selection",
        clmCode :  "Customer Code",
        clmTitle : "Customer Name",
        clmTypeName : "Type",
        clmGenusName : "Genus"
    },
    grdSlsOrdList: 
    {
        clmRef: "Series",
        clmRefNo: "Sequence",
        clmPrice: "Price",
        clmInputCode : "Customer Code",
        clmInputName : "Customer Name",
        clmDate: "Date",
        clmVat : "VAT",
        clmQuantıty : "Sales Quantity",
        clmCompQuantıty : "Delivered",
        clmPendQuantıty :"To be Delivered",
        clmItemName :"Product Name",
        clmLivre : "Sent"
    },
    msgConvertDispatch : 
    {
        title : "Delivery Conversion",
        msg : "The delivery conversion was successful.",
        btn01 : "OK",
        btn02 : "Cancel"
    },
    msgConvertSucces : 
    {
        title : "Delivery Conversion",
        msg : "The delivery conversion was successful.",
        btn01 : "OK",
        btn02 : "Cancel"
    },
    popDesign : {
        title : "Print Design",
        clmDesign : "Print Design",
        clmPath : "Path"
    }
}

export default slsRpt_01_011