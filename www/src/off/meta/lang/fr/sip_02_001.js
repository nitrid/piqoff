// "Alış Sipariş"
const sip_02_001 =
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
    txtBarcode: "Code barre",
    txtBarcodePlace: "Scanner Code-Barres...",
    txtQuantity : "Quantité", 
    getOffers : "Rechercher l'offre", 
    txtUnitFactor : "Coefficient unitaire",  
    txtUnitQuantity : "Quantité unitaire",  
    txtTotalQuantity : "Quantité totale",  
    txtUnitPrice : "Prix unitaire", 
    txtTotalHt : "Total HT",
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
    msgDuplicateItems : 
    {
        title: "Attention",
        btn01: "D'accord",
        msg: "Attention! Le document contient des lignes avec le même code de produit:\n"
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
        clmMulticode : "Référence Fournisseur",
        clmPrice : "Prix d'Achat" 
    },
    pg_txtBarcode : 
    {
        title : "Sélectionner Barre",
        clmCode :  "Référence Produit",
        clmName : "Nom Produit",
        clmMulticode : "Référence Fournisseur",
        clmBarcode : "Code Barre"
    },
    grdPurcOrders: 
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
        clmMulticode :"FRN. Code",
        clmBarcode :"Code Barre",
        clmDescription :"Motif",
        clmCuser :"Utilisateur",
        clmOffer : "Proposition No", 
        clmVatRate : "TVA %",
        clmSubQuantity : "Qtt. Unitaire",
        clmSubPrice : "Prix Unitaire",
        clmSubFactor : "Coefficient",
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
    popDesign : 
    {
        title: "Choix du Design",
        design : "Design" ,
        lang : "Langue Document" 
    },
    msgDocValid:
    {
        title: "Attention",
        btn01: "OK",
        msg: "Veuillez saisir les en-tête avant l'achèvement !"
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
    msgCombineItem:
    {
        title: "Attention",
        btn01: "Regroupe",
        btn02: "Nouvel Ajout",
        msg: "Produit Existant dans Document ! Voulez-vous Combiner ?"
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
    }, 
    validRef :"Saisir Réf ",
    validRefNo : "Saisir Réf No ",
    validDepot : "Sélectionner Dépot",
    validCustomerCode : "Le code fournisseur-client ne peut être vide",
    validDocDate : "Sélectionner Date" ,
    tagItemCodePlaceholder: "Veuillez Saisir les Codes à Ajouter",
    popUnderPrice :
    {
        title : "Fournisseur moins cher de ce produit disponible" 
    }, 
    grdUnderPrice : 
    { 
        clmItemName :"Produit", 
        clmCustomerName : "Nom Client", 
        clmPrice : "Prix", 
        clmCode : "Code" , 
        clmMulticode : "FRN. Code" 
    },
    msgQuantity:
    {
        title: "Quantité",
        btn01: "Ajouter",
        msg: "Ajouter quantité"
    },
    pg_offersGrid : 
    {
        title : "Sélection d'offres",  
        clmReferans : "Réf. Réf No",  
        clmCode : "Code",  
        clmName : "Nom",  
        clmQuantity : "Quantité",  
        clmTotal : "Total",  
        clmPrice : "Prix",  
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
        btn01: "OK",  
        msg: "Cette ligne a été converti en bordereau d'expédition ou en facture. Vous ne pouvez effectuer aucune modification !"  
    },
    msgRowNotDelete :
    {
        title: "Attention",  
        btn01: "OK",  
        msg: "Cette ligne a été converti en bordereau d'expédition ou en facture, vous ne pouvez pas la supprimer !"  
    },
    msgdocNotDelete : 
    {
        title: "Attention",   
        btn01: "OK",   
        msg: "Votre document comporte une ligne qui a été converti en bordereau d'expédition ou en facture. Ce document ne peut pas être supprimé !"   
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
    msgCustomerLock: 
    {
        title: "Attention", //BAK
        btn01: "OK", //BAK
        msg: "Impossible de changer le fournisseur après avoir ajouter le produit !" //BAK
    },
}
export default sip_02_001