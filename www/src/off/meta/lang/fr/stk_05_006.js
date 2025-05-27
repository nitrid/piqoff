// "Stok Hareket Raporu"
const stk_05_006 =
{
    txtRef : "Code du Produit",
    cmbCustomer :"Client",
    btnGet :"Rechercher",
    dtFirst : "Première Date",
    dtLast : "Dernière Date",
    txtCustomerCode : "Code Client",
    cmbDevice :"Appareil",
    txtTicketno : "ID Ticket",
    numFirstTicketAmount : "Unité Principale",
    numLastTicketAmount : "Contenu Principal ",
    cmbUser :"Utilisateur",
    txtItem :"Code Produit",
    ckhDoublePay : "Paiement Multiple",
    cmbType :"Type de Description",
    dtDate : "Date",
    txtTotal : "Total des Ventes",
    txtPartiLot : "Numéro de Lot",
    grdItemMovementReport: 
    {
        clmLuser: "Utilisateur",
        clmLdate: "Date",
        clmTypeName: "Type de Document",
        clmRef: "Série",
        clmRefNo : "Numéro",
        clmDocDate : "Date du Document",
        clmItemName : "Nom du Produit",
        clmInputName : "Entrée",
        clmOutputName : "Sortie",
        clmQuantity : "Quantité",
        clmDepoQuantity: "Quantité en Stock",
        clmPrice : "Prix",
        clmTotalHt : "Montant HT",
    },
    pg_txtRef:
    {
        title: "Sélection de Produit",
        clmCode: "CODE",
        clmName: "NOM", 
        clmBarcode: "CODE-BARRES", 
        clmStatus : "STATUT"
    },
    pg_partiLot:
    {
        title: "Sélection de Parti Lot",
        clmCode: "CODE",
        clmSkt: "DLC", 
    },
    cancel : "Annuler",
    msgItemSelect:
    {
        title: "Attention",
        btn01: "OK",
        msg: "Veuillez sélectionner un produit !"
    },
}
export default stk_05_006