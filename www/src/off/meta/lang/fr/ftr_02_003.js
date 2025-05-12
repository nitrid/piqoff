// "İade Faturası"
const ftr_02_003 =
{
    txtRefRefno : "Réf. Réf No",
    cmbDepot: "Réserve",
    txtCustomerCode : "Code du fournisseur",
    txtCustomerName : "Nom fournisseur",
    dtDocDate : "Date",
    txtAmount : "Total" ,
    txtDiscount : "Remise sur les lignes",    
    txtDocDiscount : "Remise sous-total",   
    txtSubTotal : "Sous-total",    
    txtMargin : "Marge",
    txtVat : "TVA",
    txtTotal : "Total Général",
    dtShipDate :"Date Expédition",
    getPayment : "Encaissement",
    getDispatch : "Recherche BL",
    getRebate: "Lier à la facture",
    cash : "Total" ,
    description :"Motif",
    checkReference : "Référence",
    btnCash : "Espèce",
    btnCheck : "Chèque",
    btnBank : "Virement",
    cmbCashSafe : "Caisse Espèce",
    cmbCheckSafe : "Caisse Chèque",
    cmbBank : "Sélection Banque",
    txtPayInvoıceTotal : "Totale Facture",
    txtPayTotal : "Total Encaissement",
    txtRemainder : "Reste",
    txtBarcode: "Code barre",
    txtBarcodePlace: "Scanner Code Barre...",
    txtQuantity : "Quantité", 
    tabTitleSubtotal : "Total de la facture",  
    tabTitlePayments : "Informations de paiement",  
    tabTitleOldInvoices : "Informations de facturation antérieure",  
    getRemainder : "Recherche le montant restant",  
    txtbalance : "Solde total actuel",   
    txtUnitFactor : "Coefficient unitaire",  
    txtUnitQuantity : "Quantité unitaire",  
    txtTotalQuantity : "Quantité totale",  
    txtUnitPrice : "Prix unitaire", 
    txtExpFee : "Pénalités de Retard", 
    dtExpDate : "Date d'Echéance", 
    getProforma : "Rechercher Proforma ", 
    btnView : "Aperçu", 
    btnMailsend : "Envoyer Mail", 
    placeMailHtmlEditor : "Veuillez saisir votre texte .", 
    validDesign : "Veuillez choisir un design.",  
    validMail : "Veuillez ne pas laisser le champs vide.",  
    txtTotalHt : "Total HT",
    txtDocNo : "Numéro de document", 
    pg_Docs : 
    {
        title : "Sélection Document",
        clmDate : "Date",
        clmRef : "Référence",
        clmRefNo : "Numéro",
        clmInputName : "Nom Fournisseur",
        clmInputCode  : "Code Client",
        clmTotal : "Total TTC"
    },
    pg_txtCustomerCode : 
    {
        title : "Choix Fournisseur",
        clmCode :  "Code Client",
        clmTitle : "Nom Fournisseur",
        clmTypeName : "Type",
        clmGenusName : "Genre"
    },
    pg_txtItemsCode : 
    {
        title : "Sélectionner Produit",
        clmCode :  "Référence Produit",
        clmName : "Nom Produit",
        clmPrice : "Prix d'Achat" 
    },
    pg_dispatchGrid : 
    {
        title : "Sélectionner Bon De Livraison" ,
        clmReferans : "Références",
        clmCode : "Code",
        clmName : "Nom",
        clmQuantity : "Quantité",
        clmPrice : "Prix ",
        clmTotal : "Total",
        clmDate : "Date",
        clmDocNo : "N° de Document",
    },
    pg_getRebate : 
    {
        title : "Sélectionner Facture" ,
        clmReferans : "Références",
        clmCode : "Code",
        clmName : "Nom",
        clmQuantity : "Quantité",
        clmPrice : "Prix ",
        clmTotal : "Total",
        clmDate : "Date",
        clmDocNo : "N° de Document",
    },
    grdRebtInv: 
    {
        clmItemCode: "Code",
        clmItemName: "Nom",
        clmPrice: "Prix ",
        clmQuantity : "Quantité",
        clmDiscount : "Remise",
        clmDiscountRate : "Remise %",
        clmVat : "TVA",
        clmAmount : "Total" ,
        clmTotal : "Total Général",
        clmTotalHt : "Total HT",
        clmDispatch : "No Bon de Livraison",
        clmCreateDate: "Date d'Enregistrement",
        clmMargin :"Marge",
        clmDescription :"Motif",
        clmCuser :"Utilisateur",
        clmMulticode : "FRN.Code",    
        clmBarcode : "Code-barres",    
        clmVatRate :"TVA %",
        clmSubQuantity : "Qtt. Unitaire",
        clmSubPrice : "Prix Unitaire",
        clmSubFactor : "Coefficient",   
    },
    grdInvoicePayment: 
    {
        clmInputName: "Caisse",
        clmTypeName: "Type",
        clmPrice: "Prix ",
        clmCreateDate: "Date d'Enregistrement",

    },
    popPayment:
    {
        title: "Encaissement",
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
        title: "Veuillez Saisir MDP Administrateur pour Acces au Document ",
        Password : "Mot de passe",
        btnApprove : "Valider"
    },
    msgDocValid:
    {
        title: "Attention",
        btn01: "OK",
        msg: "Veuillez saisir les en-tête avant l'achèvement !"
    },
    msgMoreAmount:
    {
        title: "Attention",
        btn01: "OK",
        msg: "Le Montant restant ne peux être supérieur au total !"
    },
    msgSave:
    {
        title: "Attention",
        btn01: "OK",
        btn02: "Abandonner",
        msg: "Etes-vous sûr(e) de vouloir Enregistrer!"
    },
    msgSaveResult:
    {
        title: "Attention",
        btn01: "OK",
        msgSuccess: "Enregistré avec succès !",
        msgFailed: "Enregistrement échoué !"
    },
    msgSaveValid:
    {
        title: "Attention",
        btn01: "OK",
        msg: "Veuillez saisir les zones nécessaires !"
    },
    msgDelete:
    {
        title: "Attention",
        btn01: "OK",
        btn02: "Abandonner",
        msg: "Etes-vous sûr(e) de vouloir supprimer l'enregistrement ?"
    },
    msgVatDelete:
    {
        title: "Attention",
        btn01: "OK",
        btn02: "Abandonner",
        msg: "Etes-vous sûr(e) de Vouloir Mettre à Zéro la TVA !"
    },
    msgDiscountPrice:
    {
        title: "Attention",
        btn01: "OK",
        msg: "Vous ne Pouvez Appliquer de Remise Supérieure au Montant Total !"
    },
    msgDiscountPercent:
    {
        title: "Attention",
        btn01: "OK",
        msg: "Vous ne Pouvez Appliquer de Remise Supérieure au Montant Total !"
    },
    msgLocked:
    {
        title: "Attention",
        btn01: "OK",
        msg: "Document Enregistré et Vérouillé !"
    },
    msgPasswordSucces:
    {
        title: "Succès",
        btn01: "OK",
        msg: "Document Déverouillé !",
    },
    msgPasswordWrong:
    {
        title: "Echec",
        btn01: "OK",
        msg: "Mot de Passe Erroné"
    },
    msgGetLocked:
    {
        title: "Attention",
        btn01: "OK",
        msg: "Document Vérouillé !  \n  Veuillez Dévérouillez Pour Enregistrerles Modifications !"
    },
    msgPayNotDeleted:
    {
        title: "Attention",
        btn01: "OK",
        msg: "Le document ne peut être supprimé car règlement saisie!" 
    },
    msgDoclocked:
    {
        title: "Attention",
        btn01: "OK",
        msg: "Vous ne Pouvez EnregistrerSans Dévérouiller !"
    },
    msgDiscount:
    {
        title: "Attention",
        btn01: "OK",
        msg: "Remise ne peut être Supérieure au Total ! "
    },
    msgItemNotFound:
    {
        title: "Attention",
        btn01: "OK",
        msg: "Produit Introuvable !!"
    },
    msgCustomerNotFound:
    {
        title: "Attention",
        btn01: "Continuer",
        btn02: "Annuler",
        msg: "Le Produit Sélectionné n'est pas Associé au Client ! Voulez-vous Continuer ?"
    },
    msgNotCustomer:
    {
        title: "Attention",
        btn01: "OK",
        msg: "Fournisseur Inconnu"
    },
    msgCombineItem:
    {
        title: "Attention",
        btn01: "Regroupe",
        btn02: "Nouvel Ajout",
        msg: "Produit Existant dans Document ! Voulez-vous Combiner ?"
    },
    msgCustomerSelect:
    {
        title: "Attention",
        btn01: "OK",
        msg: "Veuillez Saisir un Client !"
    },
    popCash : 
    {
        title: "Entrée Espèce",
        btnApprove : "Ajouter"
    },
    popCheck : 
    {
        title: "Entrée Chèque",
        btnApprove : "Ajouter"
    },
    popBank : 
    {
        title: "Saisie Virement",
        btnApprove : "Ajouter"
    },
    popDesign : 
    {
        title: "Choix du Design",
        design : "Design" ,
        lang : "Langue Document" 
    },
    msgUnit:
    {
        title: "Sélection de l'unité",
        btn01: "Valider",
    }, 
    validRef :"Saisir Réf ",
    validRefNo : "Saisir Réf No ",
    validDepot : "Sélectionner Dépot",
    validCustomerCode : "Le code fournisseur-client ne peut être vide",
    validDocDate : "Sélectionner Date" ,
    pg_txtBarcode : 
    {
        title : "Sélectionner Barre",
        clmCode :  "Référence Produit",
        clmName : "Nom Produit",
        clmMulticode : "Référence Fournisseur",
        clmBarcode : "Code Barre"
    },
    msgQuantity:
    {
        title: "Quantité",
        btn01: "Ajouter",
        msg: "Ajouter quantité"
    },
    cmbPayType : {
        title : "Mode de paiement",   
        cash : "Espèce",   
        check : "Chèque",   
        bankTransfer : "Virement Compte",   
        otoTransfer : "Prélèvement",   
        foodTicket : "T. Restaurant",   
        bill : "Facture",   
    },
    popDetail:
    {
        title: "Contenu Document",
        count:  "Quantité Ligne",
        quantity: "Quantité Totale",
        quantity2: "Total 2eme Unit ",
        margin: "Marge"
    },
    popUnit2 : 
    {
        title : "Détail des Contenus"
    },
    grdUnit2 : 
    {
        clmName : "Nom",
        clmQuantity : "Quantité"
    },
    pg_adress : 
    {
        title : "Sélection d'Adresse",   
        clmAdress : "Adresse",   
        clmCiyt : "Ville",   
        clmZipcode : "Code Postal",   
        clmCountry : "Pays",   
    },
    msgCode : 
    {
        title: "Attention",
        btn01:"Aller au document",
        msg: "Document trouvé !"
    },
    pg_proformaGrid : 
    {
        title : "Sélection Proforma",   
        clmReferans : "Réf. Réf No",   
        clmCode : "Code",   
        clmName : "Nom",   
        clmQuantity : "Quantité",   
        clmPrice : "Prix",   
        clmTotal : "Total"   
    },
    popMailSend : 
    {
        title :"Envoyer E-Mail",   
        txtMailSubject : "Objet E-Mail",   
        txtSendMail : "Adresse E-Mail",   
        btnSend : "Envoyer",
        cmbMailAddress : "Adresse E-mail de l'Expéditeur" // BAK
    },
    msgMailSendResult:
    {
        title: "Attention",   
        btn01: "OK",   
        msgSuccess: "Mail envoyé avec succès!",   
        msgFailed: "Echec Envoi Mail!"   
    },
    msgMailSendResult:
    {
        title: "Attention",   
        btn01: "OK",   
        msgSuccess: "Mail envoyé avec succès !",   
        msgFailed: "Echec d'envoi de mail !"  
    },
    popRound : 
    {
        title : "Veuillez saisir le montant que vous souhaitez arrondir", 
        total : "Montant", 
    },
    msgWorngRound:
    {  
        title: "Attention", 
        btn01: "OK", 
        msg1: "Le montant que vous voulez arrondir est au maximum ", 
        msg2: " Il peut avoir une différence !" 
    },
    msgDiscountEntry : 
    {
        title : "Saisie du montant de la remise ",   
        btn01 : "Valider" 
    },
    txtDiscount1 : "1. Remise ",  
    txtDiscount2 : "2. Remise ",  
    txtDiscount3 : "3. Remise ",  
    txtTotalDiscount :"Total de Remise ",  
    msgDiscountPerEntry : 
    {
        title : "Saisie de Remise en %",  
        btn01 : "Valider" 
    },
    txtDiscountPer1 : "1. Remise % ",  
    txtDiscountPer2 : "2. Remise % ",  
    txtDiscountPer3 : "3. Remise % ", 
    serviceAdd : "Ajouter un service",  
    pg_service : 
    {
        title : "Prestations de service",   
        clmCode : "Code",   
        clmName : "Nom"   
    },
    msgMissItemCode:
    {
        title: "Attention",
        btn01: "OK",
        msg: "Code Non Retrouvé"
    },
    msgMultiCodeCount:
    {
        title: "Attention",
        btn01: "OK",
        msg: "Nombre de Produit Ajouté"
    },
    popMultiItem:
    {
        title: "Ajout Groupé de Produit",
        btnApprove: "Chercher Produits",
        btnClear : "Vider Liste",
        btnSave : "Ajouter Lignes",
    },
    cmbMultiItemType : 
    {
        title : "Mode de Recherche",
        customerCode : "En Fonction du Code Fournisseur",
        ItemCode : "En Fonction du Code Produit"
    },
    grdMultiItem : 
    {
        clmCode : "Référence Produit",
        clmMulticode : "FRN.Code",
        clmName : "Nom du produit",
        clmQuantity : "Quantité"
    },
    msgMultiData:
    {
        title: "Attention",
        btn01: "Effacer Liste et Ajoute le Tout",
        btn02: "Inclure Les Nouvelles Saisies à la Liste",
        msg: "Produits Présents dans la Liste! "
    },
    tagItemCodePlaceholder: "Veuillez Saisir les Codes à Ajouter",
    msgPrintforLocked:
    {
        title: "Attention",   
        btn01: "OK",   
        msg: "Le document ne peut pas être imprimé sans être verouillé!"  
    },
    msgCustomerLock: 
    {
        title: "Attention", 
        btn01: "OK", 
        msg: "Impossible de changer le fournisseur après avoir ajouter le produit !" 
    },
}
export default ftr_02_003