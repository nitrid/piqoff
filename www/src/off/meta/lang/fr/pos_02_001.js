// "Satış Fiş Raporu"
const pos_02_001 =
{
    TicketId :"Ticket I.D",
    cmbCustomer :"Client",
    validDesign : "Veuillez choisir le design",
    btnGet :"Rechercher",
    dtFirst : "Date Début",
    dtLast : "Date Fin",
    txtCustomerCode : "Code Client",
    cmbDevice :"Appareil",
    txtTicketno : "Numéro de ticket",
    numFirstTicketAmount : "Contenu", 
    numLastTicketAmount : "Unité supérieure", 
    cmbUser :"Utilisateur",
    txtItem :"Référence Produit",
    ckhDoublePay : "Paiement multiple",
    pg_txtCustomerCode : 
    {
        title : "Choix Client",
        clmCode :  "Code Client",
        clmTitle : "Nom Client",
        clmTypeName : "Type",
        clmGenusName : "Genre"
    },
    grdSaleTicketReport: 
    {
        clmDate: "Date",
        clmTime: "Heure",
        slmUser: "Utilisateur",
        clmCustomer : "Nom De Client",
        clmCardId : "Numéro de Client", 
        clmDiscount : "Remise",
        clmLoyalyt: "Fidélité",
        clmHT : "Total",
        clmVTA : "Taxe",
        clmTTC : "Total",
        clmTicketID :"ID Ticket",
        clmFacRef : "Fact. No",
    },
    pg_txtItem:
    {
        title: "Sélection Produit",
        clmCode: "Code",
        clmName: "Nom", 
    },
    grdSaleTicketItems :
    {
        clmBarcode : "Code barre",
        clmName : "Nom du produit",
        clmQuantity : "Quantité",
        clmPrice : "Prix ",
        clmTotal : "Total" ,
        clmTime: "Heure",
    },
    grdSaleTicketPays : 
    {
        clmPayName : "Mode de Règlement ", 
        clmTotal : "Total" ,
    },
    popDetail : 
    {
        title : "Détail Ticket "
    },
    cmbPayType : 
    {
        title : "Mode de Règlement ",
        esc:"Espèce",
        cb : "CB",
        check : "Chèque",
        ticket : "Ticket Resto",
        bonD : "Bon D'Avoir",
        avoir : "Avoir",
        virment : "Virement",
        prlv :"Prélèvement ",
        all :"Tout"
    },
    payChangeNote : "La modification de ticket doit rester exceptionnelle et permetter de corriger les erreurs !",
    payChangeNote2 : "Un historique des modifications est enregistré !",
    txtPayChangeDescPlace : "Veuillez entrér la description.", 
    txtPayChangeDesc :"Le Mode de paiement a été saisi de manière incorrecte.Il a été Corrigé.", 
    popLastTotal :       
    {      
        title : "Règlement"      
    },      
    trDeatil: "T.R Detail",      
    lineDelete :"ligne annulé",      
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
    },
    popDesign : 
    {
        title: "Choix du Design",
        design : "Design" ,
        lang : "Langue Document" 
    },
    btnMailSend : "Envoyer E-mail",  
    mailPopup : 
    {
        title : "Saisie d'adresse E-mail"  
    },
    msgFacture:
    {
        title: "Attention",   
        btn01: "OK",   
        btn02: "Annuler",  
        msg: "Les tickets choisis vont être convertis en facture, êtes-vous sûr ?" 
    },
    msgFactureCustomer:
    {  
        title: "Attention",  
        btn01: "Ok", 
        msg: "Une facture ne peut pas être établie si vous ne choissisez pas de client pour le ticket" 
    },
}
export default pos_02_001