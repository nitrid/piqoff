//  "İndirim Tanımları"
const promo_01_002 =
{
    txtCode: "Code",        
    txtName: "Nom",
    txtCustomer: "Client",
    dtStartDate: "Date.Début",
    dtFinishDate: "Date.Fin",
    cmbDepot: "Dépôt",
    txtCustomerCode: "Code Client",
    txtCustomerName: "Nom Client",
    cmbPrmType: "Type Client",
    txtPrmCustomer: "Client",
    btnPrmCustomer: "Sélection Client / liste", 
    cmbPrmType2: "Type Produit",
    txtPrmItem2: "Produit",
    btnPrmItem2: "Sélection Produit / liste", 
    txtPrmItemGrp: "Groupe",
    txtPrmQuantity: "Quantité",
    txtPrmAmount: "Montant",
    cmbRstType: "Type",
    txtRstQuantity: "Valeur",
    txtRstItem : "Produit",
    cmbRstItemType: "Type",
    txtRstItemQuantity: "Quantité",
    txtRstItemAmount: "Valeur",
    txtCodePlace: "Veuillez entrer le code de réduction que vous souhaitez définir",
    txtNamePlace: "Veuillez entrer le nom de la réduction que vous souhaitez définir",
    txtAmount: "Montant",
    pg_Grid:
    {
        title: "Sélection",
        clmBarcode: "Code-barres",
        clmCode: "Code",
        clmName: "Nom", 
        clmItem : "Produit",
        clmStartDate : "Début",
        clmFinishDate : "Fin",
        clmGrpName: "Groupe", 
        clmPrice : "Prix",
        btnItem: "Sélectionner le produit ou le groupe de produits à appliquer la réduction",
        btnCustomer: "Sélectionner le client ou le groupe de clients à appliquer la réduction",
    },
    msgRef:
    {
        title: "Attention",
        btn01: "Aller à la réduction",
        btn02: "D'accord",
        msg: "La réduction que vous avez entrée est déjà enregistrée dans le système !"
    },
    msgSave:
    {
        title: "Attention",
        btn01: "D'accord",
        btn02: "Annuler",
        msg: "Êtes-vous sûr de vouloir enregistrer ?"
    },
    msgSaveResult:
    {
        title: "Attention",
        btn01: "D'accord",
        msgSuccess: "Votre enregistrement a réussi !",
        msgFailed: "Votre enregistrement a échoué !"
    },
    msgSaveValid:
    {
        title: "Attention",
        btn01: "D'accord",
        msg: "Veuillez remplir les champs requis !"
    },
    msgDelete:
    {
        title: "Attention",
        btn01: "D'accord",
        btn02: "Annuler",
        msg: "Êtes-vous sûr de vouloir supprimer l'enregistrement ?"
    },
    popDiscount:
    {
        title: "Réduction",
        txtDiscRate : "Pourcentage",
        txtDiscAmount : "Prix",
        btnSave: "Enregistrer"
    },
    msgDiscRate:
    {
        title: "Attention",
        btn01: "D'accord",
        msg: "La réduction que vous avez entrée ne peut pas être inférieure à 0 ou supérieure à 100 !",
    },
    cmbType:
    {
        customer: "Client",
        customerGroup: "Groupe Client"
    },
    cmbType2:
    {
        item: "Produit",
        itemGroup: "Groupe Produit",
        discountRate: "Taux de Réduction",
        discountAmount: "Montant de Réduction"
    },
    validation:
    {
        txtPrmQuantityValid: "Vous ne pouvez pas laisser la quantité vide !",
        txtPrmQuantityMinValid: "La valeur minimale doit être d'au moins 0.001 !",
        txtRstItemQuantityValid: "La quantité ne peut pas être inférieure à zéro !",
    },
    msgDeleteAll:
    {
        title: "Attention",
        btn01: "Oui",
        btn02: "Non",
        msg: "Êtes-vous sûr de vouloir tout supprimer ?",
    },
    msgItemAlert:
    {
        title: "Attention",
        btn01: "D'accord",
        msg: "Le produit que vous essayez d'ajouter est déjà dans votre liste !",
    },
    msgAmount:
    {
        title: "Attention",
        btn01: "D'accord",
        msg: "Veuillez entrer le montant !",
    },
    msgCondOrApp:
    {
        title: "Attention",
        btn01: "D'accord",
        msg: "Veuillez entrer un client ou un produit !",
    },
}

export default promo_01_002