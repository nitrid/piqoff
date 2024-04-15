//  "Promosyon Tanımları"
const promo_01_001 =
{
    txtCode: "Code",
    txtName: "Nom",
    dtStartDate: "Date Début",
    dtFinishDate: "Date Fin",
    cmbDepot: "Réserve",
    txtCustomerCode: "Sélectionner Client",
    txtCustomerName: "Nom fournisseur",
    cmbPrmType: "Type de Promotion",
    txtPrmItem:  "Produit",
    btnPrmItem: "Rechercher", 
    txtPrmItemGrp: "Groupe" ,
    txtPrmQuantity: "Quantité",
    txtPrmAmount: "Total" ,
    cmbRstType: "Type",
    txtRstQuantity:  "Valeur",
    txtRstItem :  "Produit",
    cmbRstItemType: "Type",
    txtRstItemQuantity:  "Valeur",
    txtRstItemAmount: "Évaluer", 
    txtCodePlace: "Veuillez entrer le code promotionnel", 
    txtNamePlace: "Veuillez saisir le nom de la promotion", 
    txtCustomerCodePlace: "Vous pouvez choisir le client pour effectuer la promotion", 
    txtRstItemPlace: "Veuillez sélectionner le produit promotionnel", 
    pg_Grid:
    {
        title:  "Choix",
        clmBarcode: "Code-barres", 
        clmCode: "Code",
        clmName: "Nom", 
        clmStartDate : "Date Début",
        clmFinishDate : "Date Fin", 
        clmItem : "Nom De Produit",
        clmGrpName: "Groupe", 
        clmPrice : "Prix", 
        btnItem: "Sélection de produits promotionnels", 
    },
    msgRef:
    {
        title: "Attention",
        btn01: "Aller Promotion",
        btn02: "OK",
        msg: "Promotion Saisie Déja Existant "
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
    pop_PrmItemList: 
    {
        title: "Stock sélectionné",
        clmCode: "Code",
        clmName: "Nom", 
    },
    popDiscount: 
    {
        title: "Promotion",
        txtDiscRate : "Pourcentage",
        txtDiscAmount : "Total",
        btnSave: "Enregistrer"
    },
    msgDiscRate: 
    {
        title: "Attention",
        btn01: "OK",
        msg: "La remise que vous avez saisie ne peut être inférieure à 0 ou supérieure à 100 !",
    },
    cmbType: 
    {
        item: "Produit",
        generalAmount: "Montant général",
        discountRate: "Taux de remise",
        moneyPoint: "Money Point",
        giftCheck: "Bon D'Achat",
        generalDiscount: "Remise Totale",
        discountAmount: "Montant de la remise",
        promoType01: "Condition",
        promoType02: "Application",
    },
    msgHelp: 
    {
        title: "Information",
        btn01: "OK",
        condItemQuantity: "Veuillez saisir la quantité du ou des produits en promotion. Ex: Si vous saisissez la  quantité 5 , la promotion sera valable à partir du 5ème acheté.",
        condItemAmount: "Veuillez saisir le total du ou des produits en promotion.Ex: Si vous saisissez le total 10€ , la promotion sera valable à partir de 10€ d'achat sur le ou les produits sélectionnés.",
        condGeneralAmount: "Veuillez saisir le montant de la réduction sur le total du ticket. Ex: Si vous saisissez le total 10€ , la promotion sera valable à partir de 10€ d'achat sur le montant du ticket.",
        appDiscRate: "Veuillez saisir le % de remise quand les conditions sont requises. Ex: Appliquer 10% de remise quand les conditions sont requises.",
        appDiscAmount: "Veuillez saisir le prix promottionnel quand les conditions sont requises. Ex: Appliquer le prix du produit promotionnel à 0€99 quand les conditions sont requises.",
        appPoint: "Veuillez saisir le nombre de points à ajouter au client quand les conditions sont requises. Ex: Ajouter 100 points au client quand les conditions sont requises.",
        appGiftCheck: "Veuillez saisir le montant du bon d'achat quand les conditions sont requises. Ex: Offrir 100€ de bon d'achat au client quand les conditions sont requises.",
        appGeneralAmount: "Veuillez saisir le montant de la remise sur achat quand les conditions sont requises. Ex: remise de 10€ sur ticket au client quand les conditions sont requises.",
        appItemQuantity: "Veuillez saisir la quantité du ou des produits en promotion quand les conditions sont requises. Ex: Si vous saisissez la quantité 5 , la promotion sera valable à partir du 5ème acheté ou selon le % ou le prix saisi.",
        appItemAmount: "Veuillez saisir le prix ou le % du ou des produits en promotion quand les conditions sont requises. Ex: Appliquez le prix à 0€99 ou 50% le produit sera vendu à 0€99 ou 50%  si les conditions sont requises.",
    },
    validation: 
    {
        txtPrmQuantityValid: "Vous ne pouvez pas ignorer le montant",
        txtPrmQuantityMinValid: "La Valeur Doit Etre au Minimum 0.001 !", 
        txtRstItemQuantityValid: "le montant ne peut pas être inférieur à zéro",
    },
    msgDeleteAll: 
    {
        title: "Attention",
        btn01: "Oui",
        btn02: "Non",
        msg: "Voulez-vous vraiment tout supprimer ?",
    },
    msgItemAlert: 
    {
        title: "Attention",
        btn01: "OK",
        msg: "Le produit que vous essayez d'ajouter est déjà présent dans votre liste !",
    },
    msgQuantityOrAmount:
    {
        title: "Attention",   
        btn01: "OK",   
        msg: "Veluillez saisir la quantité ou le montant !",   
    },
}
export default promo_01_001