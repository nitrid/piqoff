// "Müşteri Puanı Raporu"
const cri_04_003 =
{
    cmbCustomer :"Fournisseur",
    btnGet :"Rechercher",
    txtCustomerCode : "Sélection Client",
    txtCustomerName : "Nom Client",
    txtAmount : "Total Points", 
    pg_txtCustomerCode : 
    {
        title : "Choix Client",
        clmCode :  "Code Client",
        clmTitle : "Nom Client",
        clmTypeName : "Type",
        clmGenusName : "Genre"
    },
    grdCustomerPointReport: 
    {
        clmCode: "Code",
        clmTitle: "Nom",
        clmPoint: "Points",
        clmLdate : "Dernière Date MAJ",
        clmEur : "EURO"
    },
    popPointDetail : 
    {
        title: "Détail de point"
    },
    grdPointDetail : 
    {
        clmDate : "Date",
        clmPoint : "Point",
        clmPointType : "Type",
        clmPosId :"Numéro de ticket",
        clmDescription :"Motif",
    },
    grdSaleTicketItems :
    {
        clmBarcode : "Code barre",
        clmName : "Nom produit ",
        clmQuantity : "Quantité",
        clmPrice : "Prix",
        clmTotal : "Montant"
    },
    grdSaleTicketPays : 
    {
        clmPayName : "Mode de paiement", 
        clmTotal : "Total",
    },
    popDetail : 
    {
        title : "Détail Ticket"
    },
    TicketId :"Ticket No", 
    popLastTotal : 
    {
        title : "Règlement"
    },
    trDeatil: "T.R Détail", 
    lineDelete :"Ligne annulée", 
    cancel : "Abandonner", 
    btnAddpoint : "Entrée et Sortie Point",     
    popPointEntry :     
    {    
        title : "Entrée et Sortie Point"     
    },    
    txtPoint : "Point",     
    txtPointAmount : "Equivalent Somme",     
    cmbPointType : "Type de Saisie",     
    cmbTypeData :    
    {     
        in : "Entrée Point",     
        out : "Sortie Point"     
    },     
    txtDescription : "Information",
    msgDescription:
    {
        title: "Attention",  
        btn01: "OK",   
        msg: "Veuillez Saisir au moins 15 Caractères.."  
    },
    btnAdd : "Ajoute", 
    descriptionPlace : "Veuillez Saisir au moins 15 Caractères.."
}
export default cri_04_003