//"Satış Müşteri Evrak Listesi"
const saleList_01 =
{
    cmbCustomer :"Client",
    btnGet :"Rechercher",
    dtFirst : "Date Début",
    dtLast : "Date Fin",
    txtCustomerCode : "Client",
    cmbListType : "Type Document",
    cmbFtr : "Facture",
    cmbIrs : "Livraison",
    cmbSip : "Commande",
    cmbTklf : "Offre",
    cmbMainGrp : "Groupe Client",
    tabTitleOffer : "Offre",
    tabTitleOrder : "Commande",
    tabTitleDispatch : "Livraison",
    tabTitleInvoice : "Facture",
    menu:
    {
        tabTitleOffer : "Offre de Vente",
        tabTitleOrder : "Commande de Vente",
        tabTitleDispatch : "Livraison de Vente",
        tabTitleInvoice : "Facture de Vente"
    },
    chkOpenDispatch : "Affichez uniquement ceux sans facture", 
    msgNoMailAddress : "Le client n'a pas d'adresse e-mail. ",
    pg_txtCustomerCode : 
    {
        title : "Choix Client",
        clmCode :  "Code Client",
        clmTitle : "Nom Client",
        clmTypeName : "Type",
        clmGenusName : "Genre"
    },
    grdSlsDisList: 
    {
        clmRef: "Référence",
        clmRefNo: "Ligne",
        clmPrice: "Prix ",
        clmInputCode : "Sélection Document",
        clmInputName : "Nom Client",
        clmDate: "Date",
        clmVat : "TVA",
        clmAmount : "Total TH" ,
        clmTotal : "Total TTC",
        clmMainGroup : "Groupe Client",
        clmOutputName :"Réserve",
        clmFacture : "Converti en Facture ",
        clmMail : "Mail envoyé"
    },
    msgConvertInvoices:
{  
    title: "Attention",
    btn01: "D'accord",
    btn02: "Annuler",
    msg: "Êtes-vous sûr de vouloir convertir les bons de livraison sélectionnés en facture ? Une fois la facture créée, elle ne peut plus être modifiée !!"         
},
msgConvertSucces:
{  
    title: "Attention",
    btn01: "Imprimer",
    btn02: "Fermer",
    msg: "Les factures ont été créées. Voulez-vous les imprimer ?"         
},
msgPrintDispatch :
{  
    title: "Attention",
    btn01: "Imprimer",
    btn02: "Fermer",
    msg: "Les bons de livraison seront imprimés. Voulez-vous les imprimer ?"         
},

}
export default saleList_01