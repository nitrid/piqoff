// "Satış Fiş Raporu"
const pos_02_018 =
{
    TicketId :"Ticket ID",
    cmbCustomer :"Customer",
    btnGet :"Get",
    dtFirst : "First Date",
    dtLast : "Last Date",
    txtCustomerCode : "Customer",
    cmbDevice :"Device",
    txtTicketno : "Ticket ID",
    numFirstTicketAmount : "Lower Amount",
    numLastTicketAmount : "Upper Amount",
    cmbUser :"User",
    txtItem :"Product Code",
    ckhDoublePay : "Multiple Payment",
    pg_txtCustomerCode : 
    {
        title : "Customer Selection",
        clmCode :  "CUSTOMER CODE",
        clmTitle : "CUSTOMER NAME",
        clmTypeName : "TYPE",
        clmGenusName : "GENUS"
    },
    grdSaleTicketReport: 
    {
        clmDate: "Date",
        clmTime: "Time",
        slmUser: "User",
        clmCustomer : "Customer",
        clmCardId : "Card Id",
        clmDiscount : "Discount",
        clmLoyalyt: "Loyalyt",
        clmHT : "Subtotal",
        clmVTA : "VAT",
        clmTTC : "Total",
        clmTicketID :"Ticket ID",
        clmFacRef : "Fact. No",
        clmTotal : "Amount",
    },
    pg_txtItem:
    {
        title: "Product Selection",
        clmCode: "CODE",
        clmName: "NAME", 
    },
    grdSaleTicketItems :
    {
        clmBarcode : "Barcode",
        clmName : "Product Name",
        clmQuantity : "Quantity",
        clmPrice : "Price",
        clmTotal : "Amount",
        clmTime : "Time",
        clmDıscount: "Discount Amount"
    },
    grdSaleTicketPays : 
    {
        clmPayName : "Payment Type", 
        clmTotal : "Amount",
    },
    popDetail : 
    {
        title : "Ticket Detail"
    },
    cmbPayType : 
    {
        title : "Payment Type",
        esc:"Cash",
        cb : "Credit Card",
        check : "Check",
        ticket : "T.Rest",
        bonD : "Return Ticket",
        avoir : "Return",
        virment : "Havale",
        prlv :"Auto Payment",
        all :"All",
    },
    payChangeNote : "Ticket changes are special and should be made with permission!",
    payChangeNote2 : "Changes are recorded in the history!",
    txtPayChangeDescPlace : "Please enter the description",
    txtPayChangeDesc :"Payment type is incorrect. It has been corrected.",
    popLastTotal : 
    {
        title : "Collection"
    },
    trDeatil: "T.R Detail",
    lineDelete :"Line Delete",
    cancel : "Cancel",
    popOpenTike :
    {
        title : "Unfinished Tickets"
    },
    grdOpenTike: 
    {
        clmUser : "User",
        clmDevice : "Device",
        clmDate : "Date",
        clmTicketId : "Ticket ID",
        clmTotal : "Amount",
        clmDescription :"Description",
    },
    popDesign : 
    {
        title: "Design Selection",
        design : "Design",
        lang : "Document Language"
    },
    btnMailSend : "Send Mail", 
    mailPopup : 
    {
        title : "Mail Address Input"
    },
    msgFacture:
    {
        title: "Attention",
        btn01: "OK",
        btn02: "Cancel",
        msg: "The selected tickets will be converted to an invoice! Do you approve?"
    },
    msgFactureCustomer:
    {
        title: "Attention",
        btn01: "OK",
        msg: "A ticket that does not have a customer cannot be converted to an invoice !"
    },
}

export default pos_02_018