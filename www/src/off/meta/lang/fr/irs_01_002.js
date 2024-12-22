//"Satış İrsaliye Listesi"
const irs_01_002 =
{
    cmbCustomer :"Client",
    btnGet :"Rechercher",
    dtFirst : "Date Début",
    dtLast : "Date Fin",
    txtCustomerCode : "Client",
    cmbMainGrp : "Groupe Client",
    menu:"Bon de Livraison de Vente ",
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
        clmFacture : "Converti en Facture "
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

}
export default irs_01_002