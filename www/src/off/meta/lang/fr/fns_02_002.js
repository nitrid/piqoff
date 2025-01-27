// Tahsilat
const fns_02_002 = 
{
    txtRefRefno : "Réf.-Réf. No:",
    menu : "Réglement",
    cmbDepot: "Dépôt",
    cmbCashSafe : "Sélectionner Coffre",
    cmbCheckSafe : "Chèque",
    cmbBank : "Sélectionner Banque",
    txtCustomerCode : "Code Client",
    txtCustomerName : "Nom Client",
    dtDocDate : "Date",
    txtAmount : "Total",
    txtTotal : "Total général",
    dtShipDate :"Date d'expédition",
    cash : "Total",
    description :"Motif",
    checkReference : "Référence",
    checkDate : "Date",
    btnCash : "Saisie Réglement",
    invoiceSelect : "Sélectionner Facture",
    ValidCash : "Veuillez saisir un montant supérieur à 0", 
    cmbPayType : 
    {
        title : "Mode de paiement",
        cash : "Espèce",
        check : "Chèque",
        bankTransfer : "Virement Compte",
        otoTransfer : "Prélèvement",
        foodTicket : "T. Restaurant",
        bill : "Facture",
    },
    pg_Docs : 
    {
        title : "Sélection de documents",
        clmDate : "Date",
        clmRef : "Référence",
        clmRefNo : "Réf. No",
        clmOutputName : "Nom Client",
        clmOutputCode  : "Code Client",
        clmTotal : "Total TTC"
    },
    pg_txtCustomerCode : 
    {
        title : "Sélection Client",
        clmCode :  "Code Client",
        clmTitle : "Nom Client",
        clmTypeName : "Type",
        clmGenusName : "Type"
    },
    grdDocPayments: 
    {
        clmCreateDate: "Date d'enregistrement",
        clmAmount : "Total",
        clmInputName : "Caisse/Banque",
        clmDescription : "Motif",
        clmInvoice : "Facture payée",
        clmFacDate : "Date de facture ",
        clmDocDate : "Date"
    },
    msgDocValid:
    {
        title: "Attention",
        btn01: "OK",
        msg: "L'inventaire ne peut pas être saisi avant que les en-têtes de document ne soient terminés !"
    },
    msgSave:
    {
        title: "Attention",
        btn01: "OK",
        btn02: "Abandonner",
        msg: "Êtes-vous sûr de vouloir enregistrer? "
    },
    msgSaveResult:
    {
        title: "Attention",
        btn01: "OK",
        msgSuccess: "Enregistrement réussi !",
        msgFailed: "Votre inscription est un échec !"
    },
    msgSaveValid:
    {
        title: "Attention",
        btn01: "OK",
        msg: "Veuillez remplir les champs obligatoires !"
    },
    msgDelete:
    {
        title: "Attention",
        btn01: "OK",
        btn02: "Abandonner",
        msg: "Voulez-vous vraiment supprimer l'enregistrement ?"
    },
    msgLocked:
    {
        title: "Attention",
        btn01: "OK",
        msg: "Document enregistré et verrouillé !"
    },
    msgPasswordSucces:
    {
        title: "Succès !",
        btn01: "OK",
        msg: "Document déverrouillé !",
    },
    msgPasswordWrong:
    {
        title: "Echec !",
        btn01: "OK",
        msg: "Mot de passe incorrect !"
    },
    msgGetLocked:
    {
        title: "Attention",
        btn01: "OK",
        msg: "Document verrouillé ! \n Pour Enregistrerles modifications, vous devez déverrouiller avec le mot de passe administrateur !"
    },
    msgDocLocked:
    {
        title: "Attention",
        btn01: "OK",
        msg: " Aucune transaction ne peut être effectuée sans dévérouiller le document !"
    },
    msgNotCustomer:
    {
        title: "Attention",
        btn01: "OK",
        msg: "Client introuvable !!"
    },
    popCash : 
    {
        title: "Saisi Espèce",
        btnApprove : "Ajouter"
    },
    popCheck : 
    {
        title: "Saisi Chèques",
        btnApprove : "Ajouter"
    },
    popBank : 
    {
        title: "Saisi Virement",
        btnApprove : "Ajouter"
    },
    validRef :"La référence ne peut pas être vide",
    validRefNo : "Le numéro de référence ne peut pas être vide",
    validDepot : "Vous devez choisir l'entrepôt",
    validCustomerCode : "Le code actuel ne peut pas être vide",
    validDocDate : "Vous devez choisir une date",
    msgInvoiceSelect:
    {
        title: "Attention",   
        btn01: "OK",    
        msg: "Vous ne pouvez pas effectuer le processus sans sélectionner une facture !"   
    },
    msgRowNotUpdate:
    {
        title: "Attention",
        btn01: "OK",
        msg: "Déconnectez la connexion associée pour effectuer cette opération.",
    },
}
export default fns_02_002