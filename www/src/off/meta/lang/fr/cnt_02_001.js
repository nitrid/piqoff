// "Alış Anlaşması"
const cnt_02_001 = 
{
    cmbDepot: "Réserve",
    txtCustomerCode : "Sélection Fournisseur",
    txtCustomerName : "Nom fournisseur",
    btnMailsend : "Envoyer E-Mail",
    validDesign : "Veuillez séléctionner le design.",  
    validDocDate : "Vous devez choisir une date",
    cmbVatType : 
    {
        title : "Type de Taxe",
        vatInc : "TTC",
        vatExt : "HT"
    },
    pg_Docs : 
    {
        title : "Sélection Documents",
        clmDate : "Date",
        clmCode : "Code",     
        clmName : "Nom",
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
    pg_txtPopItemsCode : 
    {
        title : "Sélectionner Produit",
        clmCode :  "Référence Produit",
        clmName : "Nom Produit",
        clmMulticode : "Référence Fournisseur"
    },
    msgContractValid:
    {
        title: "Attention",
        btn01: "OK",
        msg: "Veuillez choisir d'abord le fournisseur !"
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
    msgDeleteResult:
    {
        msg: "Enregistrement supprimé avec succès !"
    },
    msgSaveValid:
    {
        title: "Attention",
        btn01: "OK",
        msg: "Veuillez saisir les zones nécessaires !",
        msgSuccess: "Enregistrement réussi !",
        msgFailed: "Enregistrement échoué !"
    },
    msgNotCustomerCount:
    {
        title: "Attention",
        btn01: "OK",
        msg: " Nombre de produits n'est pas reconnu à ce fournisseur. !"
    },
    msgDelete:
    {
        title: "Attention",
        btn01: "OK",
        btn02: "Abandonner",
        msg: "Etes-vous sûr(e) de vouloir supprimer l'enregistrement ?"
    },
    msgNotCustomer:
    {
        title: "Attention",
        btn01: "OK",
        msg: "Fournisseur Inconnu"
    },
    grdContracts: 
    {
        clmItemCode: "Code",
        clmItemName: "Nom",
        clmPrice: "Prix TTC",
        clmQuantity : "Quantité",
        clmStartDate : "Début ",
        clmFinishDate : "Fin ",
        clmCreateDate: "Date d'Enregistrement",
        clmDepotName : "Réserve",
        clmMargin :"Marge", 
        clmVatExtPrice : "Prix HT", 
        clmCostPrice : "Coût", 
        clmMulticode : "FRN. Code" ,
        clmUnit : "Unité",
        clmUnitPrice : "Unit Prix HT",
        clmOrgins : "Origine",
    },
    popItems: 
    {
        title: "Inclus un Accord",
        txtPopItemsCode : "Référence Produit",
        txtPopItemsName: "Nom Produit",
        txtPopItemsPrice : "Prix ",
        txtPopItemsQuantity : "Quantité",
        dtPopStartDate :"Début ",
        dtPopEndDate : "Fin "
    },
    validCustomerCode : "Le code fournisseur-client ne peut être vide",
    txtCode : "Code",
    txtName : "Nom",
    startDate :"Date Début",    
    finishDate : "Date Fin",    
    docDate : "Date", 
    msgMissItemCode:    
    {    
        title: "Attention",    
        btn01: "OK",    
        msg: "Code non trouvé :"    
    },    
    msgMultiCodeCount:    
    {    
        title: "Attention",    
        btn01: "OK",    
        msg: "Ajoute Produit"    
    },    
    popMultiItem:    
    {    
        title: "Ajouté plusieurs produits",    
        btnApprove: "Rechercher Produits",    
        btnClear : "Vider",    
        btnSave : "Ajouter les lignes",    
    },    
    cmbMultiItemType :     
    {    
        title : "Type De Recherche",    
        customerCode : "En Fonction du Code Fournisseur ",    
        ItemCode : "Référence Produit"    
    },    
    grdMultiItem :     
    {    
        clmCode : "Référence",    
        clmMulticode : "FRN.Code",    
        clmName : "Nom Produit",    
        clmQuantity : "Quantité",    
        clmPrice : "Prix Achat"    
    },    
    msgMultiData:    
    {    
        title: "Attention",    
        btn01: "Ajouter Les produits et réinitialiser la Liste",    
        btn02: "Ajouter les nouveaux produits à la liste",    
        msg: "Les produits saisis sont déjà existants. "    
    },    
    tagItemCodePlaceholder: "Saisir les références produits",    
    msgDocValid:    
    {    
        title: "Attention",    
        btn01: "OK",    
        msg: "Veuillez saisir l'en-tête avant l'achèvement !"    
    },
    validCode :"Code ne peut être vide !",
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
    txtUnitFactor : "Coefficient unitaire",  
    txtUnitQuantity : "Quantité unitaire",  
    txtTotalQuantity : "Quantité totale",  
    txtUnitPrice : "Prix unitaire",
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
}
export default cnt_02_001