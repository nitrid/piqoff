//  "Alış Faturası"
const ftr_02_001 =
{
    txtRefRefno : "Réf.-Réf no:",
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
    getPayment : "Paiement",
    validDesign : "Veuillez sélectionner le design.", 
    cash : "Total" ,
    description :"Motif",
    checkReference : "Référence",
    btnCash : "Espèce",
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
    popExcel : {title:"Les en-têtes de ligne de votre fichier Excel doivent être corrects"}, 
    excelAdd : "Inscription à partir d'Excel",
    shemaSave : "Enregistrerle Format", 
    tabTitleSubtotal : "Total de la facture", 
    tabTitlePayments : "Informations de paiement", 
    txtDiffrentTotal : "Différence totale", 
    tabTitleOldInvoices : "Informations de facturation antérieures", 
    txtDiffrentNegative : "Différence de prix en baisse", 
    txtDiffrentPositive : "Différence de prix en hausse", 
    txtDiffrentInv : "Facture de différence de prix ",   
    txtbalance : "Solde total actuel",   
    getRemainder : "Recherche le montant restant",    
    txtUnitFactor : "Coefficient unitaire",  
    txtUnitQuantity : "Quantité Unitaire",  
    txtTotalQuantity : "Quantité totale",  
    txtUnitPrice : "Prix ​​unitaire",
    txtExpFee : "Pénalités de Retard ", 
    dtExpDate : "Date d'Echéance", 
    getOffers : "Recherche Proposition", 
    getProforma : "Rechercher Proforma ", 
    txtTotalHt : "Total HT",
    txtDocNo : "Numéro de document", 
    cmbOrigin : "Origine",
    txtTransport : "Type de Transport", 
    tabTitleDetail : "Informations complémentaires",
    validDesign : "Veuillez séléctionner le design.",   
    btnView : "Afficher",
    btnMailsend : "Envoyer Mail", 
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
        cmbMailAddress : "Gönderilen Mail Adresi" // BAK
    },
    pg_Docs : 
    {
        title : "Sélection Document",
        clmDate : "Date",
        clmRef : "Référence",
        clmRefNo : "Numéro",
        clmOutputName : "Nom Fournisseur",
        clmOutputCode  : "Code fournisseur",
        clmTotal : "Total TTC"
    },
    pg_txtCustomerCode : 
    {
        title : "Choix Fournisseur",
        clmCode :  "Code fournisseur",
        clmTitle : "Nom Fournisseur",
        clmTypeName : "Type",
        clmGenusName : "Genre"
    },
    pg_txtItemsCode : 
    {
        title : "Sélectionner Produit",
        clmCode :  "Référence Produit",
        clmName : "Nom Produit",
        clmMulticode : "FRN.Code",
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
        clmTotal : "Total" ,
        clmDate : "Date",
        clmDate : "Numéro de Document",
        
    },
    grdPurcInv: 
    {
        clmLineNo : "Nr",
        clmItemCode: "Code",
        clmItemName: "Nom",
        clmPrice: "Prix HT",
        clmQuantity : "Quantité",
        clmDiscount : "Remise",
        clmDiscountRate : "Remise %",
        clmVat : "TVA",
        clmAmount : "Total" ,
        clmTotal : "Total Général",
        clmTotalHt : "Total HT",
        clmDispatch : "No Bon de Livraison",
        clmDateDispatch : "Date",
        clmCreateDate: "Date d'Enregistrement",
        clmMargin :"Marge",
        clmDiffPrice : "Différence",
        clmCustomerPrice : "Prix F.",
        clmDescription :"Motif",
        clmCuser :"Utilisateur",
        clmMulticode : "FRN.Code",
        clmOrigin : "Origine",
        clmSubQuantity : "Quantité unitaire",  
        clmSubPrice : "Prix unitaire",  
        clmSubFactor : "Coefficient"
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
        title: "Paiement",
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
        title: "Veuillez Saisir MDP Administrateur pour Accès au Document ",
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
        msg: "Vous ne Pouvez Entrer de Montant Supérieur au Paiement Restant !"
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
        msgSuccess: "Enregistrement effectué avec succès !",
        msgFailed: "Enregistrement échoué !"
    },
    msgSaveValid:
    {
        title: "Attention",
        btn01: "OK",
        msg: "Veuillez saisir les zones concernées !"
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
    msgNegativePrice:
    {
        title: "Attention",
        btn01: "OK",
        msg: "Vous ne pouvez pas entrer une valeur de prix négative !"
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
        btn01: "Continue",
        btn02: "Abandonner",
        msg: "Le Produit Sélectionné n'a pas de Fournisseur Enregistré ! Voulez-vous Continuer "
    },
    msgNotCustomer:
    {
        title: "Attention",
        btn01: "OK",
        msg: "Fournisseur Inconnu"
    },
    msgUnderPrice1:
    {
        title: "Attention",
        btn01: "OK",
        btn02: "Abandonner",
        msg: "Prix Inférieur à l'Achat ! !"
    },
    msgUnderPrice2:
    {
        title: "Attention",
        btn01: "OK",
        msg: "Vous ne Pouvez Vendre en Dessous du Prix d'Achat ! !"
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
        title: "Saisir Virement",
        btnApprove : "Ajouter"
    },
    popDesign : 
    {
        title: "Choix du Design",
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
    popDetail:
    {
        title: "Contenu Document",
        count:  "Quantité Ligne",
        quantity: "Quantité Totale",
        quantity2: "Total 2eme Unit ",
        margin: "Marge"
    },
    grdUnit2 : 
    {
        clmName : "Nom",
        clmQuantity : "Quantité"
    },
    popUnit2 : 
    {
        title : "Détails des Contenus"
    },
    msgUnit:
    {
        title: "Sélection de l'unité",  
        btn01: "Valider",  
        btnFactorSave : "Mettre à jour la carte de stock" 
    },
    validRef :"Saisir Réf ",
    validRefNo : "Saisir Réf No ",
    validDepot : "Sélectionner Dépôt",
    validCustomerCode : "Le code fournisseur-client ne peut être vide",
    validDocDate : "Sélectionner Date" ,
    tagItemCodePlaceholder: "Veuillez Saisir les Codes à Ajouter",
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
    },
    msgPriceDateUpdate :
    {
        msg : "Souhaitez-vous mettre à jour la date des produits où le prix d’achat reste inchangé ? ", 
        btn01 : "Oui", 
        btn02 : "Non", 
        title : "Attention" 
    },
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
    serviceAdd : "Ajouter un service",  
    pg_service : 
    {
        title : "Prestations de service",   
        clmCode : "Code",   
        clmName : "Nom"   
    },
    cmbPayType : {
        title : "Mode de paiement",   
        cash : "Espèces",   
        check : "Chèque",   
        bankTransfer : "Virement Compte",   
        otoTransfer : "Prélèvement",   
        foodTicket : "T. Restaurant",   
        bill : "Facture",   
    },
    pg_adress : 
    {
        title : "Sélectionner Adresse",   
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
    pg_offersGrid : 
    {  
        title : "Sélection Commande",   
        clmReferans : "Réf.-Réf no:",  
        clmCode : "Code",  
        clmName : "Nom",  
        clmQuantity : "Quantité",  
        clmTotal : "Total",  
        clmPrice : "Prix",  
    },
    pg_proformaGrid : 
    {
        title : "Sélection Proforma",   
        clmReferans : "Réf.-Réf No:",   
        clmCode : "Code",   
        clmName : "Nom",   
        clmQuantity : "Quantité",   
        clmPrice : "Prix",   
        clmTotal : "Total"   
    },
    popRound : 
    {
        title : "Veuillez saisir le montant que vous souhaitez arrondir",  
        total : "Montant", 
    },
    msgCompulsoryCustomer:
    {
        title: "Attention",
        btn01: "OK",
        msg: "Le Produit Sélectionné n'a pas de Fournisseur Enregistré !"
    },
    msgWorngRound:
    {  
        title: "Attention",  
        btn01: "OK",  
        msg1: "Le montant que vous souhaitez arrondir est au maximum",  
        msg2: " Il peut avoir une différence !"  
    },
    msgDiscountEntry : 
    {
        title : "Saisie du montant de la remise",  
        btn01 : "Valider" 
    },
    msgGrdOrigins:
    {
        title: "Changement d'origine", 
        btn01: "Valider",   
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
    pg_transportType : 
    {
        title : "Codes transporteurs",  
        clmCode : "Code",  
        clmName : "Nom" 
    },
    msgCustomerLock: 
    {
        title: "Attention", 
        btn01: "OK", 
        msg: "Impossible de changer le fournisseur après avoir ajouter le produit !" 
    },
}
export default ftr_02_001