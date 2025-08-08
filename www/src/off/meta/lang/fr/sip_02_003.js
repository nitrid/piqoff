// "Pos Satış Sipariş"
const sip_02_003 = 
{
    txtRefRefno : "Réf. Réf No",
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
    txtBarcode: "Code barre",
    txtBarcodePlace: "Scanner Code Barre...",
    txtQuantity : "Quantité", 
    getOffers : "Rechercher l'offre", 
    txtUnitFactor : "Coefficient unitaire",  
    txtUnitQuantity : "Quantité unitaire",  
    txtTotalQuantity : "Quantité totale",  
    txtUnitPrice : "Prix unitaire",
    btnView : "Aperçu", 
    btnMailsend : "Envoyer E-Mail", 
    placeMailHtmlEditor : "Veuillez saisir votre texte .", 
    validDesign : "Veuillez sélectionner le design.",  
    validMail : "Veuillez ne pas laisser le champs vide.",  
    txtTotalHt : "Total HT",
    txtDocNo : "Numéro de document", 
    cmbPricingList : "Liste de prix",
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
    pg_Docs : 
    {
        title : "Sélection Document",
        clmDate : "Date",
        clmRef : "Référence",
        clmRefNo : "Numéro",
        clmInputName : "Nom Client",
        clmInputCode  : "Code Client",
        clmAddress : "Adresse",
        clmClosed: "État des Caisse",
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
        clmPrice : "Prix de Vente",
        clmBarcode : "Code Barre",
    },
    grdSlsOrder: 
    {
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
        clmCreateDate: "Date d'Enregistrement",
        clmMargin :"Marge",
        clmDescription : "Motif",
        clmCuser :"Utilisateur",
        clmOffer : "N° de l'offre", 
        clmBarcode : "Code Barre",
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
    msgDuplicateItems : 
    {
        title: "Attention",
        btn01: "D'accord",
        msg: "Attention! Le document contient des lignes avec le même code de produit:\n"
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
    msgNotCustomer:
    {
        title: "Attention",
        btn01: "OK",
        msg: "Client Inconnu"
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
        msg: "Code Non Trouvé"
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
    }, 
    validRef :"Saisir Réf ",
    validRefNo : "Saisir Réf No ",
    validDepot : "Sélectionner Dépot",
    validCustomerCode : "Le code fournisseur-client ne peut être vide",
    validDocDate : "Sélectionner Date" ,
    tagItemCodePlaceholder: "Veuillez Saisir les Codes à Ajouter",
    msgQuantity:
    {
        title: "Quantité",
        btn01: "Ajouter",
        msg: "Ajouter quantité"
    },
    pg_txtBarcode : 
    {
        title : "Sélectionner Barre",
        clmCode :  "Référence Produit",
        clmName : "Nom Produit",
        clmMulticode : "Référence Fournisseur",
        clmBarcode : "Code Barre"
    },
    pg_offersGrid : 
    {
        title : "Sélection d'offres",  
        clmReferans : "Réf.-Réf. No",  
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
    popDetail:
    {
        title: "Contenu Document",
        count:  "Quantité Ligne",
        quantity: "Quantité Totale",
        quantity2: "Total 2eme Unit ",
        margin: "Marge"
    },
    msgCustomerLock: 
    {
        title: "Attention", //BAK
        btn01: "OK", //BAK
        msg: "Impossible de changer le client après avoir ajouter le produit !" //BAK
    },
}
export default sip_02_003