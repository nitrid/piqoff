// "Proforma Fiyat Farkı Faturası"
const ftr_04_001 =
{
    txtRefRefno : "Réf. Réf No",
    cmbDepot: "Dépot",
    txtCustomerCode : "Code du fournisseur",
    txtCustomerName : "Nom fournisseur",
    dtDocDate : "Date",
    txtAmount : "Total",
    txtDiscount : "Remise sur les lignes",    
    txtDocDiscount : "Remise sous-total",  
    txtSubTotal : "Sous-total", 
    txtMargin : "Marge",
    txtVat : "TVA",
    txtTotal : "Total Général",
    dtShipDate :"Date de Livraison",
    getContract : "Sélectionner la Date d'Achat",
    getPayment : "Entrée Paiement",
    cash : "Total",
    description :"Remarque",
    checkReference : "Référence",
    btnCash : "Ajouter Paiement",
    btnCheck : "Chèque",
    btnBank : "Virement",
    cmbCashSafe : "Choix de Coffre",
    cmbCheckSafe : "Caisse Chèque",
    cmbBank : "Choix Banque ",
    txtPayInvoıceTotal : "Total Facture",
    txtPayTotal : "Total Paiement",
    txtRemainder : "Restant",
    txtBarcode : "Ajoute Code-Barres ",
    txtBarcodePlace: "Lecture Code-Barres",
    txtQuantity :"Total",
    tabTitleSubtotal : "Total Facture",
    tabTitlePayments : "Détail de Règlement",
    tabTitleOldInvoices : "Information Facture Antérieure ",
    getRemainder : "Recherche Montant Restant",
    txtUnitFactor : "Coefficient unitaire",  
    txtUnitQuantity : "Quantité unitaire",  
    txtTotalQuantity : "Quantité totale",  
    txtUnitPrice : "Prix unitaire",
    txtTotalHt : "Total HT",
    validDesign : "Veuillez choisir le design de l'étiquette",
    txtDocNo : "Numéro de document", 
    btnView : "Afficher",
    btnMailsend : "Envoyer un courriel",
    validMail : "Veuillez ne pas laisser ce champ vide.",
    placeMailHtmlEditor : "Vous pouvez entrer une description de votre courrier.",
    isMsgSave :
    {
        title: "Attention",
        btn01: "D'accord",
        msg: "Impossible de procéder sans enregistrement du document !"
    },
    msgMailSendResult:
    {
        title: "Attention",
        btn01: "D'accord",
        msgSuccess: "L'envoi du courrier a réussi !",
        msgFailed: "L'envoi du courrier a échoué !"
    },
    popMailSend :
    {
        title :"Envoyer un e-mail",
        txtMailSubject : "Objet du courriel",
        txtSendMail : "Adresse e-mail",
        btnSend : "Envoyer",
        cmbMailAddress : "Adresse E-mail de l'Expéditeur" // BAK
    },
    msgDiscount:
    {
        title: "Attention",  
        btn01: "Ok",
        msg: " Montant ne peut être Inférieur à 0 !"
    },
    pg_Docs : 
    {
        title : "Choix Document",
        clmDate : "Date",
        clmRef : "Réf.",
        clmRefNo : "Réf.No",
        clmInputName : "Nom Client",
        clmInputCode  : "Code Client",
        clmTotal : "Total TTC"
    },
    pg_txtCustomerCode : 
    {
        title : "Choix Client",
        clmCode :  "Code Client",
        clmTitle : "Nom Client",
        clmTypeName : "Mode",
        clmGenusName : "Genre"
    },
    pg_txtItemsCode : 
    {
        title : "Choix Stock",
        clmCode :  "CODE STOCK",
        clmName : "NOM STOCK",
        clmPrice : "Prix de Vente"
    },
    pg_contractGrid : 
    {
        title : "Choix Facture",
        clmReferans : "Réf.N°-Réf.",
        clmDocDate : "Date Facture",
        clmTotal : "Total"
    },
    grdDiffInv: 
    {
        clmItemCode: "Code",
        clmItemName: "Nom",
        clmPrice: "Prix",
        clmQuantity : "Quantité",
        clmDiscount : "Remise",
        clmDiscountRate : "Remise %",
        clmVat : "TVA",
        clmAmount : "Total",
        clmTotal : "Total Général",
        clmTotalHt : "Total HT",
        clmCreateDate: "Date Enregistrement",
        clmInvNo : "No Facture",
        clmInvDate : "Date Facture",
        clmDescription :"Remarque",
        clmCuser :"Utilisateur",
        clmMulticode : "Code FRN",
        clmCustomerPrice : "Montant Total",
        clmPurcPrice : "Montant Facture",
        clmVatRate : "TVA %"
    },
    grdInvoicePayment: 
    {
        clmInputName: "Caisse",
        clmTypeName: "Mode",
        clmPrice: "Prix",
        clmCreateDate: "Date Enregistrement",

    },
    popPayment:
    {
        title: "Règlements",
    },
    popDiscount : 
    {
       title: "Remise sur les lignes", 
        chkFirstDiscount : "Ne pas changer les remises de la 1ère ligne",
        chkDocDiscount : "Remise sous-total",
        Percent1 : "1. Remise % ",
        Price1 : "1. Remise",
        Percent2 : "2. Remise %",
        Price2 : "2. Remise",
        Percent3 : "3. Remise %",
        Price3 : "3. Remise"
    },
    popDocDiscount : 
    {
       title: "Remise sous-total", 
        Percent1 : "1. Remise % ",
        Price1 : "1. Remise",
        Percent2 : "2. Remise %",
        Price2 : "2. Remise",
        Percent3 : "3. Remise %",
        Price3 : "3. Remise"
    },
    popPassword : 
    {
        title: "Veuillez Saisir MDP Responsable pour Dévérouiller",
        Password : "MDP",
        btnApprove : "Valider"
    },
    msgDocValid:
    {
        title: "Attention",
        btn01: "Ok",
        msg: "Vous ne Pouvez Saisir le Stock Sans Saisir Tous les Champs du Document !"
    },
    msgSave:
    {
        title: "Attention",
        btn01: "Ok",
        btn02: "Abandonner",
        msg: "Etes-vous Sûr(e) de Vouloir Enregistrer!"
    },
    msgSaveResult:
    {
        title: "Attention",
        btn01: "Ok",
        msgSuccess: "Enregistrement Effectué Avec Succès !",
        msgFailed: "Echec Enregistrement !"
    },
    msgSaveValid:
    {
        title: "Attention",
        btn01: "Ok",
        msg: "Veuillez Saisir les Champs Vides !"
    },
    msgDelete:
    {
        title: "Attention",
        btn01: "Ok",
        btn02: "Abandonner",
        msg: "Etes-vous sû(e) de Vouloir Supprimer l'Enregistrement ?"
    },
    msgVatDelete:
    {
        title: "Attention",
        btn01: "Ok",
        btn02: "Abandonner",
        msg: "Etes-vous sûr(e) de Vouloir Metrre la TVA à Zéro !"
    },
    msgMoreAmount:
    {
        title: "Attention",
        btn01: "Ok",
        msg: "Vous ne Pouvez Saisir de Réglement Supérieur au Montant Restant !"
    },
    msgDiscountPrice:
    {
        title: "Attention",
        btn01: "Ok",
        msg: "Ne Peut Faire de Remise Supérieure au Montant !"
    },
    msgDiscountPercent:
    {
        title: "Attention",
        btn01: "Ok",
        msg: "Ne Peut Faire de Remise Supérieure au Montant!"
    },
    msgLocked:
    {
        title: "Attention",
        btn01: "Ok",
        msg: "Document Enregistré et Vérouillé !"
    },
    msgPasswordSucces:
    {
        title: "Succès",
        btn01: "Ok",
        msg: "Document Dévérouillé !",
    },
    msgPasswordWrong:
    {
        title: "Echec",
        btn01: "Ok",
        msg: "MDP Erroné !"
    },
    msgGetLocked:
    {
        title: "Attention",
        btn01: "Ok",
        msg: "Document Vérouillé!  \n Pour Enregistrerles Modifications Vous Devez Saisir MDP Responsable pour Dévérouiller !"
    },
    msgDocLocked:
    {
        title: "Attention",
        btn01: "Ok",
        msg: "Ne Peut Entreprendre Aucune Action sans Dévérouiller le Document !"
    },
    msgDiscount:
    {
        title: "Attention",
        btn01: "Ok",
        msg: "La Remise ne peut être Supérieure au Montant !"
    },
    msgItemNotFound:
    {
        title: "Attention",
        btn01: "Ok",
        msg: "Stock non Trouvé !!"
    },
    msgNotCustomer:
    {
        title: "Attention",
        btn01: "Ok",
        msg: "Client non Trouvé !!"
    },
    msgCombineItem:
    {
        title: "Attention",
        btn01: "Fusionne",
        btn02: "Nouvel Ajout",
        msg: "Le Produit vouloir ajouter est existant dans le Document ! Fusionner les Lignes ?"
    },
    popCash : 
    {
        title: "Entrée Espèce",
        btnApprove : "Ajoute"
    },
    popCheck : 
    {
        title: "Entrée Chèque",
        btnApprove : "Ajoute"
    },
    popBank : 
    {
        title: "Entrée Virement",
        btnApprove : "Ajoute"
    },
    popDesign : 
    {
        title: "Choix Design",
        design : "Design",
        lang : "Langue Document"
    },
    msgUnit:
    {
        title: "Sélection de l'unité",
        btn01: "Valider",
    },
    validRef :"Ne pas laisser Vide Réf.",
    validRefNo : "Ne pas Laisser Vide la Ligne",
    validDepot : "Veuillez Sélectionner le Dépot",
    validCustomerCode : "Code Client ne peut être vide",
    validDocDate : "Choisir une Date",
    pg_txtBarcode : 
    {
        title : "Choix Code-barres",
        clmCode :  "Code Stock",
        clmName : "Nom Stock",
        clmMulticode : "Code Fournisseur",
        clmBarcode : "Code-barres"
    },
    msgQuantity:
    {
        title: "Montant",
        btn01: "Ajoute",
        msg: "Entrez Montant"
    },
    cmbPayType : 
    {
        title : "Mode de règlement",
        cash : "Espèce",
        check : "Chèque",
        bankTransfer : "Virement",
        otoTransfer : "Prélèvement",
        foodTicket : "Ticket Restaurant",
        bill : "Senet",
    },
    msgRowNotUpdate:
    {
        title: "Attention",
        btn01: "Ok",
        msg: "Cette ligne à été transformé en facture vous ne pouvez pas faire de modifications!"
    },
    msgRowNotDelete :
    {
        title: "Attention",
        btn01: "Ok",
        msg: " Cette ligne à été transformé en facture vous ne pouvez pas supprimer!"
    },
    msgdocNotDelete : 
    {
        title: "Attention",
        btn01: "Ok",
        msg: "Dans votre document se trouve une ligne transformé en facture .. Vous ne pouvez supprimer le document !"
    },
    pg_adress : 
    {
        title : "Choix d'adresse",   
        clmAdress : "Adresse",   
        clmCiyt : "Ville",   
        clmZipcode : "Code postal",   
        clmCountry : "Pays",   
    },
    msgCode : 
    {
        title: "Attention",
        btn01:"Aller au document",
        msg: "Document trouvé !"
    },
    serviceAdd : "Ajouter un service",  
    pg_service : 
    {
        title : "Prestations de service",   
        clmCode : "Code",   
        clmName : "Nom"   
    },
    msgCustomerLock: 
    {
        title: "Attention", //BAK
        btn01: "OK", //BAK
        msg: "Impossible de changer le client après avoir ajouter le produit !" //BAK
    },
}
export default ftr_04_001