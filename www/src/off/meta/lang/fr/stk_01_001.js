//Yeni Ürün Tanımlama
const stk_01_001 =
{
    txtRef: "Référence",
    cmbItemGrp: "Famille produit",
    txtCustomer: "Fournisseur",
    cmbItemGenus: "Type de produit",
    txtBarcode: "Code barre",
    cmbTax: "Classe de Taxation",
    cmbMainUnit: "Unité principale",
    cmbOrigin: "Origine",
    cmbUnderUnit: "Contenu du produit",
    txtItemName: "Nom du produit",
    txtShortName: "Désignation Courte",
    chkActive: "Produit Actif",
    chkCaseWeighed: "Peser Produit en caisse",
    chkLineMerged: "Détacher les Lignes à la Caisse",
    chkTicketRest: "Ticket Rest.",
    chkInterfel : "Interfel",
    chkPartiLot : "Lot Party",
    txtCostPrice: "Prix de Revient",
    txtSalePrice : "Prix Vente",
    txtMinSalePrice: "Prix Vente Min.",
    txtMaxSalePrice: "Prix Vente Max.",
    txtLastBuyPrice: "Der. Prix Achat",
    txtLastSalePrice: "Der. Prix Vente",
    tabTitlePrice: "Prix Vente ",
    tabTitleUnit: "Unités",
    tabTitleBarcode: "Code barre",
    tabTitleCustomer: "Fournisseur",
    tabExtraCost: "Charge Supplément.",
    tabTitleCustomerPrice: "Historique Prix Fournisseur",
    tabTitleSalesContract: "Accord de Vente",
    tabTitleInfo: "Information",
    tabTitleOtherShop :"Autre information sur les Magasins",
    tabTitleDetail : "Infomations détaillées",
    txtTaxSugar: "Taux Sucre(100ML/GR)",
    txtTotalExtraCost : "Charge Supp.",
    clmtaxSugar : "Taxe Sucre",
    priceUpdate : "Ajout Prix", 
    underUnitPrice : "Prix Sous Unité", 
    minBuyPrice : "Prix Achat Min.",
    maxBuyPrice : "Prix Achat Max.",
    sellPriceAdd : "Ajout Prix Vente",
    clmInvoiceCost : "Frais de service", 
    validOrigin : "L'origine ne peut être vide !",
    validTaxSucre : "Veuillez saisir correctement le taux de sucre !",
    validName : "Le nom ne peut être vide !",
    validQuantity : "Le montant ne peut être vide !" ,
    validPrice :"Le prix ne peut être vide !",
    validPriceFloat : "Le montant doit être supérieur à 0 !",
    validCustomerCode :"Veuillez Entrer un Code Fournisseur !",
    validOriginMax8 :"Entrez au maximum 8 caractères !",
    mainUnitName :"Unité Principale",
    underUnitName : "Sous Unité",
    chkDayAnalysis : "Journalier",  
    chkMountAnalysis : "Mensuel",  
    txtUnitFactor : "Quantité unitaire", 
    cmbAnlysType : "Type", 
    txtCustoms : "Code de la douane", 
    txtGenus : "Type de produit",
    cmbAnlysTypeData : 
    {
        pos: "Pos", 
        invoice : "Facture"
    },
    msgDateInvalid:
    {
        title: "Avertissement",
        msg: "Mauvaise date",
        btn01: "Ok"
    },

    pg_txtRef :
    {
        title: "Sélectionner Produit",
        clmCode: "Code",
        clmName: "Nom", 
        clmStatus: "Statut" 
    },
    pg_txtPopCustomerCode:
    {
        title: "Choix Fournisseur",
        clmCode: "Code",
        clmName: "Nom", 
    },
    popPrice:
    {
        title: "Ajouter Prix",
        cmbPopPriListNo: "Numéro de Liste", //BAK
        dtPopPriStartDate: "Date Début",
        dtPopPriEndDate: "Date Fin", 
        cmbPopPriDepot: "Depot",
        txtPopPriQuantity: "Quantité",
        txtPopPriPrice: "Prix de Vente",
        txtPopPriHT: "Prix de Vente HT",
        txtPopPriTTC : "Prix de Vente TTC",
        txtPopPriceMargin : "Marge %",
        txtPopPriceGrossMargin :"Brute marge %",
        txtPopPriceNetMargin:"Net marge %",
    },
    popUnit:
    {
        title: "Ajouter Unité",
        cmbPopUnitType: "Type",
        cmbPopUnitName: "Nom contenu", 
        txtPopUnitFactor: "Coefficient",
        txtPopUnitWeight: "Poids",
        txtPopUnitVolume: "Volume",
        txtPopUnitWidth: "Largeur",
        txtPopUnitHeight: "Longueur",
        txtPopUnitSize: "Hauteur"
    },
    popBarcode:
    {
        title: "Ajouter Code Barre",
        txtPopBarcode: "Code Barre",
        cmbPopBarUnit: "Unité", 
        cmbPopBarType: "Type"
    },
    popCustomer:
    {
        title: "Nouveau fournisseur",
        txtPopCustomerCode: "Code",
        txtPopCustomerName: "Nom", 
        txtPopCustomerItemCode: "Référence Fournisseur",
        txtPopCustomerPrice: "Prix d'Achat "
    },
    grdPrice: 
    {
        clmListNo: "No. de Liste", //BAK
        clmDepot: "Réserve",
        clmCustomerName: "Fournisseur",
        clmStartDate: "Date Début",
        clmFinishDate: "Date Fin",
        clmQuantity: "Quantité",
        clmPriceTTC : "Prix TTC",
        clmPriceHT: "Prix HT",
        clmPrice: "Prix",
        clmGrossMargin: "Marge Brute",
        clmNetMargin: "Marge Nette",
        clmMargin : "Marge %",
        clmListName: "Nom de Liste"

    },
    grdUnit: 
    {
        clmType: "Type",
        clmName: "Nom",
        clmFactor: "Coefficient",
        clmWeight: "Poids",
        clmVolume: "Volume",
        clmWidth: "Largeur",
        clmHeight: "Longueur",
        clmSize: "Hauteur"
    },
    grdBarcode: 
    {
        clmBarcode: "Code Barre",
        clmUnit: "Unité",
        clmType: "Type"
    },
    grdExtraCost: 
    {
        clmDate: "Date",
        clmPrice: "Charge Surcoût",
        clmTypeName: "Type",
        clmCustomerPrice : "Prix Fournisseur",
        clmCustomer : "Fournisseur",
        clmDescription : "Motif",  
    },
    grdCustomer: 
    {
        clmCode: "Code",
        clmName: "Nom",
        clmPriceUserName: "Utilisateur",
        clmPriceDate: "Date Dernier Prix de Revient",
        clmPrice: "Prix ",
        clmMulticode: "Code Produit Fournisseur"
    },
    grdSalesContract: 
    {
        clmUser: "Utilisateur",
        clmCode: "Code",
        clmName: "Nom",
        clmDate: "Date Dernier Prix de Revient",
        clmPrice: "Prix ",
        clmMulticode: "Code Produit Fournisseur"
    },
    grdCustomerPrice: 
    {
        clmUser: "Utilisateur",
        clmCode: "Code",
        clmName: "Nom",
        clmDate: "Date Dernier Prix de Revient",
        clmPrice: "Prix ",
        clmMulticode: "Code Produit Fournisseur"
    },
    grdOtherShop: 
    {
        clmCode: "Référence Fournisseur",
        clmName: "Nom de Produit",
        clmBarcode: "Code Barre",
        clmPrice: "Prix Vente",
        clmMulticode: "FRN.Code",
        clmCustomer: "Fournisseur",
        clmCustomerPrice: "Prix Achat",
        clmShop: "Magasin",
        clmDate: "Dernière Date D'Achat" 
    },
    msgRef:
    {
        title: "Attention",
        btn01: "Aller au Produit",
        btn02: "OK",
        msg: "Produit Saisie Existant !"
    },
    msgBarcode:
    {
        title: "Attention",
        btn01: "Aller au Produit",
        btn02: "OK",
        msg: "Code Barre Saisie Existant !"
    },
    msgCustomer:
    {
        title: "Attention",
        btn01: "Aller au Produit",
        btn02: "OK",
        msg: "Code Produit Fournisseur Saisie Existant !"
    },
    msgPriceSave:
    {
        title: "Attention",
        btn01: "OK",
        msg: "Veuillez Saisir Un Prix !"
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
        msg: "Veuillez saisir les zones nécessairess !"
    },
    msgDelete:
    {
        title: "Attention",
        btn01: "OK",
        btn02: "Abandonner",
        msg: "Etes-vous sûr(e) de vouloir supprimer l'enregistrement ?"
    },
    msgCostPriceValid:
    {
        title: "Attention",
        btn01: "OK",
        msg: "Veuillez saisir un montant supérieur au prix d'achat !"
    },
    msgPriceAdd:
    {
        title: "Attention",
        btn01: "OK",
        msg: "Veuillez saisir les zones nécessairess !"
    },
    tabTitleSalesPriceHistory : "Historique Prix de Vente",
    grdSalesPrice : 
    {
        clmUser : "Utilisateur",
        clmDate : "Date Modification",
        clmPrice : "Prix ",
    },
    grdItemInfo: 
    {
        cDate: "Date Création",
        cUser: "Utilisateur Ayant Créé",
        lDate: "Dernière Date de Modification",
        lUser : "Utilisateur Ayant Modifié",
    },
    msgCheckPrice:
    {
        title: "Attention", 
        btn01: "OK", 
        msg: "Enregistrement similaire non créable" 
    },
    msgCheckCustomerCode:
    {
        title: "Attention", 
        btn01: "OK", 
        msg: "Fournisseur déjà existant !" 
    },
    msgSalePriceToCustomerPrice:
    {
        title: "Attention", 
        btn01: "OK", 
        msg: "Prix de revient ne peux être plus élevé que le prix de vente! Veuillez verifier le prix de vente." 
    },
    popAnalysis :  
    {
        title : "Statistique de Vente" 
    },
    popDescription :
    {
        title : "Langue et Description du Produit",
        label : "Description du Produit"
    },
    grdLang : 
    {
        clmLang : "Langue",
        clmName : "Nom du Produit",
    },
    popItemLang : 
    {
        title : "Langue du Produit",
        cmbPopItemLanguage : "Langue",
        cmbPopItemLangName : "Nom du Produit",
    },
    grdAnalysis:  
    {
        clmToday: "Aujourd'hui",
        clmYesterday: "Hier",
        clmWeek: "Cette Semaine",
        clmMount : "Ce Mois-ci",
        clmYear : "Cette Année",
        clmLastYear : "Année Précédente"
    },
    dtFirstAnalysis : "Début",  
    dtLastAnalysis : "Fin", 
    btnGet : "Valider", 
    msgNotDelete: 
    {
        title: "Attention",
        btn01: "OK",
        msg: "Produit déja traité suppression impossible !"
    },
    cmbItemGenusData :
    {
        item : "Article",
        service : "Service",
        deposit : "Consigné"
    },
    msgUnit:
    {
        title: "Calcul unitaire",  
        btn01: "Valider",   
    },
    msgUnitRowNotDelete :
    {
        title: "Attention",
        btn01: "OK",
        msg: "Vous ne pouvez pas supprimé l'unité principale et la sous-unité !" 
    },
    pg_customsCode : 
    {
        title : "Codes douanier",  
        clmCode : "Code",  
        clmName : "Nom" 
    },
    pg_txtGenre : 
    {
        title : "Type de produit",  
        clmCode : "Code", 
        clmName : "Nom"  
    },
    msgNewItem:
    {
        title: "Attention",   
        btn01: "OK",
        btn02: "Abandonner",
        msg: "Êtes-vous sûr(e) de vouloir actualiser la page ?"  
    },
    msgItemBack:
    {
        title: "Attention",  
        btn01: "OK",  
        btn02: "Abandonner",  
        msg: "Êtes-vous sûr(e) de vouloir ramener le produit à nouveau ?"  
    },
    btnSubGroup: "Ajouter un Sous-groupe",
    pg_subGroup: 
    {
        title: "Sélection de Sous-groupe",
        clmName: "Nom",
    },
}
export default stk_01_001