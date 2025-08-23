// "Satış Fiş Raporu"
const pos_02_001 =
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
    chkDeletedTicket : "Show Deleted Tickets",
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
        clmRef : "Ref No",
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
        clmTotal : "Total",
        clmTime : "Time"
    },
    grdSaleTicketPays : 
    {
        clmPayName : "Payment Type", 
        clmTotal : "Total",
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
        virment : "Transfer",
        prlv :"Auto Payment",
        all :"All",
        cbRest : "T.Rest Card"
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
        clmTotal : "Total",
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
        title : "Mail Address Input",
        cmbMailAddress : "Sender Mail Address",
        txtMailSubject : "Mail Subject",
        txtSendMail : "Mail to be sent",
        txtMailHtmlEditor : "Mail Content"
    },
    msgFacture:
    {
        title: "Attention",
        btn01: "OK",
        btn02: "Cancel",
        msg: "Do you want to convert the selected tickets to an invoice? "
    },
    msgFactureCustomer:
    {
        title: "Attention",
        btn01: "OK",
        msg: "A ticket that does not have a customer cannot be converted to an invoice !"
    },
    msgNoFacture:
    {
        msg: "Tickets without an invoice cannot be converted to an invoice!"
    }
}

export default pos_02_001