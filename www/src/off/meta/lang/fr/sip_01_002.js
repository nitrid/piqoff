// "Satış Sipariş Listesi"
const sip_01_002 =
{
    cmbCustomer :"Client",
    btnGet :"Rechercher",
    chkInvOrDisp: "Afficher uniquement les commandes ouvertes",
    dtFirst : "Date Début",
    dtLast : "Date Fin",
    txtCustomerCode : "Client",
    menu:"Liste de vente  ",
    pg_txtCustomerCode : 
    {
        title : "Choix Client",
        clmCode :  "Code Client",
        clmTitle : "Nom Client",
        clmTypeName : "Type",
        clmGenusName : "Genre"
    },
    grdSlsOrdList: 
    {
        clmRef: "Référence",
        clmRefNo: "Ligne",
        clmPrice: "Prix ",
        clmInputCode : "Sélection Document",
        clmInputName : "Nom Client",
        clmDate: "Date",
        clmVat : "TVA",
        clmAmount : "Total HT" ,
        clmTotal : "Total",
        clmOutputName :"Réserve",
        clmMainGroup : "Client Groupe",
        clmLivre : "Livré"
    },
    popDesign : 
    {
        title: "Choix du Design",
        design : "Design" ,
        lang : "Langue Document" 
    },
    msgConvertDispatch :
    {  
        title: "Attention",   // BAK
        btn01: "Continuer",   // BAK
        btn02: "Annuler",   // BAK
        msg: "Voulez-vous convertir les bons de commande sélectionnés en livraison ?"            // BAK
    },
    msgConvertSucces :
    {  
        title: "Attention",  // BAK
        btn01: "Imprimer",  // BAK
        msg: "Les livraisons ont été créées."           // BAK
    },
    btnView : "Aperçu", 
    btnMailsend : "Envoyer E-Mail", 
    cmbMainGrp : "Client Groupe",
    btnPrint : "Imprimer",
    msgPrintOrders :
    {
        title : "Attention",
        btn01 : "Imprimer",
        btn02 : "Annuler",
        msg : "Voulez-vous imprimer les commandes sélectionnées ?"
    }
}
export default sip_01_002