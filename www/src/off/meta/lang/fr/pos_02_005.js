// "Degismis Fisler Raporu",
const pos_02_005 =
{
    TicketId :"Ticket No",
    cmbCustomer :"Client",
    btnGet :"Recherche",
    dtFirst : "Date Début",
    dtLast : "Date Fin",
    txtCustomerCode : "Client",
    cmbDevice :"Appareil",
    txtTicketno : "Ticket No",
    numFirstTicketAmount : "Montant inférieur",
    numLastTicketAmount : "Montant supérieur",
    cmbUser :"Utilisateur",
    txtItem :"Code du produit",
    ckhDoublePay : "Paiement multiples",
    cmbType :"Type De Motif",
    cmbTypeData : 
    {
        parkDesc : "Ticket Mis en Attente",
        fullDelete : "Annulation de vente",
        rowDelete : "Annulation de ligne",
        priceChange : "Changement de prix",
        rebate : "Ticket Retour"       
    },
    pg_txtCustomerCode : 
    {
        title : "Sélection Client",
        clmCode :  "Code Client",
        clmTitle : "Nom Client",
        clmTypeName : "Type",
        clmGenusName : "Type"
    },
    grdSaleTicketReport: 
    {
        clmUser: "Utilisateur",
        clmDate: "Date",
        clmTicketId: "Ticket No",
        clmDescription: "Motif",
        clmTime: "Heure", 
        clmTotal: "Total", 
    },
    pg_txtItem:
    {
        title: "Choix du produit",
        clmCode: "Code",
        clmName: "Nom", 
    },
    grdSaleTicketItems :
    {
        clmBarcode : "Code-barres",
        clmName : "Nom du produit",
        clmQuantity : "Quantité",
        clmPrice : "Prix",
        clmTotal : "Total",
        clmLastData : "Premier prix",
        clmDescription : "Motif",
        clmTime: "Heure",
    },
    grdSaleTicketPays : 
    {
        clmPayName : "Mode de paiement", 
        clmTotal : "Total",
    },
    popDetail : 
    {
        title : "Détaille de ticket"
    },
    cmbPayType : 
    {
        title : "Mode de paiement",
        esc:"Esèce",
        cb : "CB",
        check : "Chèque",
        ticket : "T. Rest",
        bonD : "Fiche de réception",
        avoir : "Réception",
        virment : "Transférer",
        prlv :"Paiement auto.",
        all :"tout",
    },
    payChangeNote : "Les modifications du ticket doivent être exceptionnelles et permettre de corriger les erreurs !",
    payChangeNote2 : "L'historique des modifications est sauvegardé !",
    txtPayChangeDescPlace : "Veuillez saisir une description",
    txtPayChangeDesc :"Le Mode de paiement a été saisi de manière incorrecte.Veuillez Corriger.",
    popLastTotal : 
    {
        title : "Réglement"
    },
    trDeatil: "T.R Detail",
    lineDelete :"Annulation de ligne",
    cancel : "Abandonner",
    popOpenTike :
    {
        title : "Ticket En Attente"
    },
    grdOpenTike: 
    {
        clmUser : "Utilisateur",
        clmDevice : "Pos No",
        clmDate : "Date",
        clmTicketId : "Ticket No",
        clmTotal : "Total",
        clmDescription :"Motif",
    }
}
export default pos_02_005