// Ödeme
const fns_02_001 =
{
    txtRefRefno : "Réf.-Réf. No:",
    menu  : "Paiement",
    cmbDepot: "Dépôt",
    cmbCashSafe : "Sélectionner Coffre",
    cmbCheckSafe : "Chèque",
    cmbBank : "Sélection de banque",
    txtCustomerCode : "Code Client",
    txtCustomerName : "Nom Client",
    dtDocDate : "Date",
    txtAmount : "Total",
    txtDiscount : "Promotion",
    txtMargin : "Marge",
    txtVat : "TVA",
    txtTotal : "Total général",
    dtShipDate :"La date d'expédition",
    getDispatch : "Obtenir la lettre de voiture",
    cash : "Total",
    description :"Motif",
    checkReference : "Référence",
    btnAddPay : "Entrée de paiement",
    invoiceSelect : "Sélection de facture",
    btnCash : "Entrée de paiement",
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
        title : "Sélection de document",
        clmDate : "Date",
        clmRef : "Référence",
        clmRefNo : "Séquence",
        clmInputName : "Nom Client",
        clmInputCode  : "Code Client",
        clmTotal : "Total TTC"
    },
    pg_invoices : 
    {
        title : "Sélection de facture",
        clmReferans : "Référence",
        clmOutputName : "Nom Client",
        clmDate : "Date",
        clmTotal : "Total",
        clmRemaining  : "Reste",
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
        clmOutputName : "Coffre-fort/Banque",
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
        msgFailed: "Votre Enregistrement a échoué !"
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
        title: "Succès",
        btn01: "OK",
        msg: "Document déverrouillé !",
    },
    msgPasswordWrong:
    {
        title: "Echec",
        btn01: "OK",
        msg: "Votre mot de passe est incorrect!"
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
        msg: "Aucune transaction ne peut être effectuée sans dévérouiller le document !"
    },
    msgNotCustomer:
    {
        title: "Attention",
        btn01: "OK",
        msg: "Client introuvable !!"
    },
    popCash : 
    {
        title: "Saisie Espèce ",
        btnApprove : "Ajouter"
    },
    popCheck : 
    {
        title: "Saisie Chèque",
        btnApprove : "Ajouter"
    },
    popBank : 
    {
        title: "Saisie Remise",
        btnApprove : "Ajouter"
    },
    validRef :"La Rérérence ne peut être vide",
    validRefNo : "Réf. No ne peut être vide",
    validDepot : "Vous devez choisir l'entrepôt",
    validCustomerCode : "Le code actuel ne peut pas être vide",
    validDocDate : "Vous devez choisir une date",
    msgInvoiceSelect:
    {
        title: "Attention",   
        btn01: "OK",    
        msg: "Vous ne pouvez pas effectuer le processus sans sélectionner une facture !"  
    },
}
export default fns_02_001