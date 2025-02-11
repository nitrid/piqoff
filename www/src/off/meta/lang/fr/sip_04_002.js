// "Satış Siparişi Dağıtım Operasyonu"
const sip_04_002 = 
{
    cmbCustomer: "Client",
    btnGet: "Rechercher",
    dtFirst: "Première Date",
    dtLast: "Dernière Date",
    cmbDepot: "Dépôt",
    menu: "Commande de Vente",
    itemTotalQyt: "Quantité pouvant être expédiée",
    popOrderDetail: 
    {
        title: "Détail de la Commande"
    },
    pg_txtCustomerCode: 
    {
        title: "Sélection du Client",
        clmCode: "CODE CLIENT",
        clmTitle: "NOM DU CLIENT",
        clmTypeName: "TYPE",
        clmGenusName: "GENRE"
    },
    grdSlsOrdList: 
    {
        clmItemCode: "Code Produit",
        clmItemName: "Nom du Produit",
        clmDepotQuantity: "Quantité en Stock",
        clmComingQuantity: "Quantité à Venir",
        clmTotalQuantity: "Total pouvant être Envoyé",
        clmQuantity: "Quantité Commandée",
        clmApprovedQuantity: "Quantité à Approuver",
        clmTotalHt: "Total HT",
        clmTotal: "Total TTC",
        clmLivre : "Livré"
    },
    btnSave: "Approuver les Lignes Sélectionnées",
    msgApprovedBig: 
    {
        title: "Attention",
        btn01: "D'accord",
        msg: "La quantité approuvée ne peut pas être supérieure à la quantité commandée!",
    },
    grdOrderDetail: 
    {
        clmCode: "Code Produit",
        clmName: "Nom du Produit",
        clmDate: "Date de Commande",
        clmCustomer: "Nom du Client",
        clmQuantity: "Quantité Commandée",
        clmApprovedQuantity: "Quantité à Approuver",
    },
    btnDetailCancel: "Annuler",
    btnDetailApproved: "Approuver",
    msgSave: 
    {
        title: "Attention",
        btn01: "Oui",
        btn02: "Non",
        msg: "Approuvez-vous les lignes sélectionnées?",
    },
    msgSaveSuccess:
    {
        title: "Attention",
        btn01: "Imprimer",
        btn02: "Fermer",
        msg: "Les lignes sélectionnées ont été approuvées. Voulez-vous imprimer les commandes ?",
    },
}
export default sip_04_002