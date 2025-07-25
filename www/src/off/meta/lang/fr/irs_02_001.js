// "Alış İrsaliyesi"
const irs_02_001 = 
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
    txtDocNo : "Numéro de document", 
    txtVat : "TVA",
    txtTotal : "Total Général",
    dtShipDate :"Date Expédition",
    txtBarcode: "Code-BarreS",
    txtBarcodePlace: "Scanner Code-Barres...",
    txtQuantity : "Quantité", 
    getOrders : "Rechercher la commande", 
    txtUnitFactor : "Coefficient unitaire",  
    txtUnitQuantity : "Quantité unitaire",  
    txtTotalQuantity : "Quantité totale",  
    txtUnitPrice : "Prix unitaire", 
    cmbOrigin: "Origine",
    validDesign : "Veuillez choisir le design de l'étiquette",
    txtTotalHt : "Total HT",
    btnMailsend : "Envoyer Mail", 
    btnView : "Afficher",
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
    pg_Docs : 
    {
        title : "Sélection Document",
        clmDate : "Date",
        clmRef : "Référence",
        clmRefNo : "Numéro",
        clmOutputName : "Nom Fournisseur",
        clmOutputCode  : "Code Client",
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
        clmMulticode : "FRN.Code",
        clmPrice : "Prix d'Achat" 
    },
    grdPurcDispatch: 
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
        clmCreateDate: "Date d'Enregistrement",
        clmMargin :"Marge",
        clmDescription :"Motif",
        clmCuser :"Utilisateur",
        clmOrder : "Commande No", 
        clmVatRate : "TVA %", 
        clmMulticode : "FRN.Code", 
        clmOrigin : "Origine",
        clmSubQuantity : "Quantité unitaire", 
        clmSubPrice : "Prix unitaire", 
        clmSubFactor : "Coefficient",
        clmDiffPrice : "Différence",
        clmCustomerPrice : "Prix F.",
        clmInvoiceRef : "Numéro de facture",
        clmPartiLot : "Numéro de lot",
    },
    pg_partiLot : 
    {
        title : "Sélectionner le lot",
        clmLotCode : "Numéro de lot",
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
    isMsgSave :
    {
        title: "Attention",
        btn01: "D'accord",
        msg: "Impossible de procéder sans enregistrement du document !"
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
        msg: "Veuillez saisir les en-têtes avant l'achèvement !"
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
    msgLockedType2:
    {
        title: "Attention",
        btn01: "OK",
        msg: "Document Transformé en Facture Vous ne Pouvez Dévérouiller"
    },
    msgGetLocked:
    {
        title: "Attention",
        btn01: "OK",
        msg: "Document Vérouillé !  \n  Veuillez Dévérouillez Pour Enregistrerles Modifications !"
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
    msgCombineItem:
    {
        title: "Attention",
        btn01: "Regroupe",
        btn02: "Nouvel Ajout",
        msg: "Produit Existant dans Document ! Voulez-vous Combiner ?"
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
        btnApprove: "Rechercher Produits",
        btnClear : "Vider",
        btnSave : "Ajouter Lignes",
    },
    cmbMultiItemType : 
    {
        title : "Mode de Recherche",
        customerCode : "En Fonction du Code Fournisseur ",
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
        btnFactorSave : "Mettre à jour la carte de stock" 
    }, 
    msgGrdOrigins:
    {
        title: "Changement d'origine",  
        btn01: "Enregistrer", 
    },
    validRef :"Saisir Réf ",
    validRefNo : "Saisir Réf No ",
    validDepot : "Sélectionner Dépot",
    validCustomerCode : "Le code fournisseur-client ne peut être vide",
    validDocDate : "Sélectionner Date" ,
    tagItemCodePlaceholder: "Veuillez Saisir les Codes à Ajouter",
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
    msgCustomerSelect:
    {
        title: "Attention",     
        btn01: "OK",   
        msg: "Veuillez sélectionner Client !"   
    },
    msgRowNotUpdate:
    {
        title: "Attention",  
        btn01: "Ok",  
        msg: "Cette ligne a été convertie en facture, vous ne pouvez effectuer aucune modification !"  
    },
    msgRowNotDelete :
    {
        title: "Attention",  
        btn01: "OK",  
        msg: "Cette ligne a été convertie en facture, vous ne pouvez pas la supprimer !"  
    },
    msgdocNotDelete : 
    {
        title: "Attention", 
        btn01: "OK", 
        msg: "Une ligne de votre document a été converti en facture. Ce document ne peut pas être supprimé !"  
    },
    pg_adress : 
    {
        title : "Sélection d'adresse",   
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
    msgDiscountEntry : 
    {   
        title : "Saisie du montant de rmise",    
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
    msgPriceDateUpdate :
    {
        msg : "Souhaitez-vous mettre à jour la date des produits où le prix d’achat reste inchangé ? ", 
        btn01 : "Oui", 
        btn02 : "Non", 
        title : "Attention" 
    },
    msgCustomerLock: 
    {
        title: "Attention", //BAK
        btn01: "OK", //BAK
        msg: "Impossible de changer le fournisseur après avoir ajouter le produit !" //BAK
    },
}
export default irs_02_001