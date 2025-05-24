// "Şube Alış Faturası"
const ftr_02_008 =
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
    getDispatch : "Recherche BL",
    getPayment : "Entrée du paiement",
    cash : "Total" ,
    description :"Motif",
    checkReference : "Référence",
    btnCash : "Ajouter Paiement", 
    btnCheck : "Chèque",
    btnBank : "Virement",
    cmbCashSafe : "Caisse Espèce",
    cmbCheckSafe : "Caisse Chèque",
    cmbBank : "Sélection Banque",
    txtPayInvoıceTotal : "Total Facture",
    txtPayTotal : "Total Paiement", 
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
    txtTotalHt : "Total HT",
    txtDocNo : "Numéro de document",
    LINE_NO: "Numéro de ligne",
    isMsgSave :
    {
        title: "Attention",
        btn01: "OK",
        msg: "Impossible d'effectuer l'action sans enregistrement du document !"
    },
    msgMailSendResult:
    {
        title: "Attention",
        btn01: "OK",
        msgSuccess: "Envoi de l'e-mail réussi !",
        msgFailed: "Échec de l'envoi de l'e-mail !"
    },
    popMailSend :
    {
        title :"Envoyer un e-mail",
        txtMailSubject : "Sujet de l'e-mail",
        txtSendMail : "Adresse e-mail",
        btnSend : "Envoyer",
        cmbMailAddress : "Adresse E-mail de l'Expéditeur" // BAK
    },
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
        clmPrice : "Prix",
        clmMulticode :"FRN.Code",
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
    pg_partiLot : 
    {
        title : "Sélection de lot",
        clmLotCode : "Numéro de lot",
        clmSkt : "DLC",
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
        msgFailed: "Echec envoie de Mail !" 
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
        title : "Saisie du montant de la remise", 
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
    msgCustomerLock: 
    {
        title: "Attention", //BAK
        btn01: "OK", //BAK
        msg: "Impossible de changer le magasin après avoir ajouter le produit !" //BAK
    },
    msgCompulsoryCustomer:
    {
        title: "Attention",
        btn01: "OK",
        msg: "Le Produit Sélectionné n'a pas de Fournisseur Enregistré !"
    },
    msgNewPrice :      
    {     
        title: "Attention",     
        btn01: "Ne pas mettre à jour",     
        btn02: "Mettre prix sélectionné à jour ",     
        msg: "Veuillez sélectionner et mettre à jour les prix du fournisseur... "     
    },     
    msgNewPriceDate : 
    {
        title: "Attention", 
        btn01: "Ne pas mettre a jour", 
        btn02: "Mettre à jour les produits sélectionnés", 
        msg: "Veuillez choisir les produits où vous souhaitez mettre à jour la date. " 
    },
    grdNewPrice:      
    {     
        clmCode: "Code",     
        clmName: "Nom",     
        clmPrice: "Ancien Prix",     
        clmPrice2: "Nouveau Prix",   
        clmSalePrice :"Prix de Vente",  
        clmMargin : "Marge Brute",
        clmCostPrice : "Coût", 
        clmNetMargin : "Marge Nette",
        clmMarge : "Marge"
    },
    grdNewPriceDate:      
    {     
        clmCode: "Code",     
        clmName: "Nom",     
        clmPrice: "Ancien Prix",     
        clmPrice2: "Nouveau Prix",   
        clmSalePrice :"Prix de Vente",  
        clmMargin : "Marge Brute",
        clmCostPrice : "Coût", 
        clmNetMargin : "Marge Nette",
        clmMarge : "Marge"
    },
    msgNewVat : 
    {
        title: "Attention",  
        btn01: "Ne faire aucune MAJ",  
        btn02: "Mettre à jour les lignes sélectionnées",  
        msg: "Différence du taux de TVA entre la facture et celui enregistré."  
    },  
    grdNewVat: 
    {
        clmCode: "Code",    
        clmName: "Nom",    
        clmVat: "TVA Saisie",    
        clmVat2: "Nouveau TVA",    
    },
    msgPriceDateUpdate :
    {
        msg : "Souhaitez-vous mettre à jour la date des produits où le prix d’achat reste inchangé ? ", 
        btn01 : "Oui", 
        btn02 : "Non", 
        title : "Attention" 
    },
}
export default ftr_02_008