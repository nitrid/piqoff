// "Şube Satış Faturası"
const ftr_02_005 = 
{
    txtRefRefno : "Réf.-Réf no:",
    cmbDepot: "Réserve",
    txtCustomerCode : "Code du Client",
    txtCustomerName : "Nom Client",
    dtDocDate : "Date",
    txtAmount : "Total" ,
    txtDiscount : "Remise sur les lignes",  
    txtDocDiscount : "Remise sous-total",   
    txtSubTotal : "Sous-total",   
    txtMargin : "Marge",
    txtVat : "TVA",
    txtTotal : "Total Général",
    dtShipDate :"Date Expédition",
    getDispatch : "Recherche BL",
    getPayment : "Encaissement",
    cash : "Total" ,
    description :"Motif",
    checkReference : "Référence",
    btnCash : "Espèce",
    btnCheck : "Chèque",
    btnBank : "Virement",
    cmbCashSafe : "Caisse Espèce",
    cmbCheckSafe : "Caisse Chèque",
    cmbBank : "Sélection Banque",
    cmbPricingList : "Liste de prix",
    txtPayInvoıceTotal : "Total Facture",
    LINE_NO: "Numéro de ligne",
    txtPayTotal : "Total Encaissement",
    txtRemainder : "Reste",
    txtBarcode: "Code barre",
    txtBarcodePlace: "Scanner Code Barre...",
    txtQuantity : "Quantité", 
    getOrders : "Rechercher la commande", 
    tabTitleSubtotal : "Totale de la facture",  
    tabTitlePayments : "Informations de paiement",  
    tabTitleOldInvoices : "Informations de facturation antérieure",  
    getRemainder : "Recherche le montant restant",  
    txtbalance : "Solde total restant",   
    txtUnitFactor : "Coefficient unitaire",  
    txtUnitQuantity : "Quantité unitaire",  
    txtTotalQuantity : "Quantité totale", 
    txtUnitPrice : "Prix unitaire",
    txtExpFee : "Pénalités de Retard", 
    dtExpDate : "Date d'Echéance", 
    btnView : "Aperçu", 
    btnMailsend : "Envoyer E-Mail", 
    placeMailHtmlEditor : "Veuillez saisir votre texte .", 
    validDesign : "Veuillez sélectionner le design.",  
    validMail : "Veuillez ne pas laisser le champs vide.",  
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
        title : "Choix Client",
        clmCode :  "Code Client",
        clmTitle : "Nom Client",
        clmTypeName : "Type",
        clmGenusName : "Genre"
    },
    pg_txtItemsCode : 
    {
        title : "Sélectionner Produit",
        clmCode :  "Référence Produit",
        clmName : "Nom Produit",
        clmPrice: "Prix",
    },
    pg_dispatchGrid : 
    {
        title : "Sélectionner Bon De Livraison" ,
        clmReferans : "Réferences",
        clmCode : "Code",
        clmName : "Nom",
        clmQuantity : "Quantité",
        clmPrice : "Prix ",
        clmTotal : "Total",
        clmDate : "Date",
        clmDocNo : "N° de Document",

    },
    grdSlsInv: 
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
        clmDescription : "Motif",
        clmCuser :"Utilisateur",
        clmVatRate : "TVA %",
        clmSubQuantity : "Quantité unitaire",   
        clmSubPrice : "Prix unitaire",  
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
        msg: "Le Règlement ne peut être Supérieur au Montant Restant !"
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
    isMsgSave: {  
        title: "Attention",
        btn01: "D'accord",
        msg: "L'opération ne peut pas être effectuée sans enregistrement du document !"
    },
    msgMailSendResult: {
        title: "Attention",
        btn01: "D'accord",
        msgSuccess: "L'envoi de l'e-mail a réussi !",
        msgFailed: "L'envoi de l'e-mail a échoué !"
    },
    popMailSend: {
        title: "Envoyer un e-mail",
        txtMailSubject: "Objet de l'e-mail",
        txtSendMail: "Adresse e-mail",
        btnSend: "Envoyer",
        cmbMailAddress : "Adresse E-mail de l'Expéditeur" // BAK
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
        msg: "Le document ne peut être supprimé car règlement saisi!" 
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
        msg: "Remise ne peut être Supérieur au Total ! "
    },
    msgItemNotFound:
    {
        title: "Attention",
        btn01: "OK",
        msg: "Produit Introuvable !!"
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
        msg: "Produit Existant dans Document ! Voulez-vous Regrouper ?"
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
        title: "Choix du Désign",
        design : "Design" ,
        lang : "Langue Document" 
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
        btnApprove: "Chercher Produit",
        btnClear : "Vider",
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
    tagItemCodePlaceholder: "Veuillez Saisir les Codes à Ajouter",
    msgNotQuantity: 
    {
        title: "Attention",
        btn01: "Ok",
        msg: "Le document ne peut être supprimé car règlement saisie!" 
    },
    pg_txtBarcode : 
    {
        title : "Sélectionner Barre",
        clmCode :  "Référence Produit",
        clmName : "Nom Produit",
        clmMulticode : "Référence Fournisseur",
        clmBarcode : "Code-Barres"
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
        title : "Choix d'adresse",   
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
    popMailSend : 
    {
        title :"Envoyer Mail ",   
        txtMailSubject : "Objet E-Mail ",   
        txtSendMail : "Adresse E-Mail ",   
        btnSend : "Envoyer",
        cmbMailAddress : "Adresse E-mail de l'Expéditeur" // BAK
    },
    msgMailSendResult:
    {
        title: "Attention",   
        btn01: "OK",   
        msgSuccess: "Mail envoyé avec succès  !",   
        msgFailed: "Echec envoie Mail  !"   
    },
    msgMailSendResult:
    {
        title: "Attention",   
        btn01: "OK",   
        msgSuccess: "Mail envoyé avec succès !", 
        msgFailed: "Echec d'envoi de Mail !" 
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
        msg1: "Le montant que vous voulez arrondir est au maximum",  
        msg2: "Il peut avoir une différence" 
    },
    msgDiscountEntry : 
    {
        title : "Saisie du montant de remise",   
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
    txtTotalHt : "Total HT",
    txtDocNo : "Numéro de document", 
    serviceAdd : "Ajouter un service",  
    pg_service : 
    {
        title : "Prestations de service",   
        clmCode : "Code",   
        clmName : "Nom"   
    },
    msgPrintforLocked:
    {
        title: "Attention",  
        btn01: "OK",  
        msg: "Le document ne peut pas être imprimé sans être vérouillé !"  
    },
    msgCustomerLock: 
    {
        title: "Attention", 
        btn01: "OK", 
        msg: "Impossible de changer le magasin après avoir ajouter le produit !" 
    },
}
export default ftr_02_005