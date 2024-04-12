// "İade Alış İrsaliyesi"
const irs_02_005 = 
{
    getRebate : "Cherche dépôt retour",
    txtRefRefno : "Réf.-Réf no:",
    validDesign : "Veuillez sélectionner le design.",  
    cmbDepot: "Réserve",
    txtCustomerCode : "Code du Client",
    txtCustomerName : "Nom Client",
    LINE_NO: "Numéro de ligne",
    txtDocNo : "Numéro de document", 
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
    txtUnitFactor : "Coefficient unitaire",  
    txtUnitQuantity : "Quantité unitaire",  
    txtTotalQuantity : "Quantité totale",  
    txtUnitPrice : "Prix unitaire", 
    txtTotalHt : "Total HT",
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
        cmbMailAddress : "Gönderilen Mail Adresi" // BAK
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
        clmDocNo : "N° de Document",
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
        clmMulticode : "Multicode",
        clmPrice : "Prix de Vente" 
    },
    pg_RebateGrid : 
    {
        title : "Choix du Stock de Retour ",
        clmCode :  "Référence Produit",
        clmName : "Nom Produit",
        clmQuantity :"Quantité "
    },
    grdRebtDispatch: 
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
        clmMulticode : "Référence Fournisseur",
        clmBarcode : "Code Barre",
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
    popDesign : 
    {
        title: "Choix du Désign",
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
    msgRowNotUpdate:
    {
        title: "Attention",  
        btn01: "OK",  
        msg: "Cette ligne a été converti en facture, vous ne pouvez effectuer aucune modification !"
    },
    msgRowNotDelete :
    {
        title: "Attention",  
        btn01: "OK",  
        msg: "Cette ligne a été converti en facture, vous ne pouvez pas la supprimer !"  
    },
    msgdocNotDelete : 
    {
        title: "Attention", 
        btn01: "OK", 
        msg: "Une ligne a été converti en facture dans votre document. Ce document ne peut pas être supprimé !"  
    },
    pg_adress : 
    {
        title : "Sélection d'adresse",   
        clmAdress : "Adresse",   
        clmCiyt : "Ville",   
        clmZipcode : "Code postal",   
        clmCountry : "Pays",   
    },
    msgCustomerNotFound:
    {
        title: "Attention",
        btn01: "Continue",
        btn02: "Abandonner",
        msg: "Le Produit Sélectionné n'a pas de Fournisseur Enregistré ! Voulez-vous Continuer "
    },
    msgCode : 
    {
        title: "Attention",
        btn01:"Aller au document",
        msg: "Document trouvé !"
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
    msgCustomerLock: 
    {
        title: "Attention", //BAK
        btn01: "OK", //BAK
        msg: "Impossible de changer le client après avoir ajouter le produit !" //BAK
    },
}
export default irs_02_005