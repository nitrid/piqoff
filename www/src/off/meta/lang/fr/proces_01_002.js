// "Ürün Grubu Güncelleme"
const proces_01_001 =
{
    txtItemName : "Nom du produit",
    txtBarkod : "Code barre",
    cmbCustomer : "Fournisseur",
    cmbMainGrp : "Famille produit",
    btnCheck : "Actif",
    btnGet :"Rechercher",
    chkMasterBarcode : "Regrouper code barre ",
    txtMulticode : "Sélection Document",
    multicodePlaceHolder : "Veuillez Entrer les Codes Fournisseur Recherchés" ,
    barkodPlaceHolder :"Veuillez Entrer Le ou Les Codes Produits ou Codes Barres",
    ItemNamePlaceHolder :"Veuillez Entrer le Nom Complet ou une Syllabe",
    btnOk : "Mettre à jour",
    toolMenu01: "Définition des Produits",  
    grdListe : 
    {
        clmCode: "Référence Produit",
        clmName : "Nom du produit",
        clmMainGrp : "Famille produit",
        clmCustomer : "Fournisseur",
        clmSname : "Nom Court",
        clmMulticode : "Code fournisseur ",
        clmUnit : "Unité",
        clmBarcode : "Code barre",
        clmCostPrice : "Prix achat",
        clmPriceSale : "Prix Vente",
        clmVat : "Taxe",
        clmMinPrice : "Prix Min",
        clmMaxPrice : "Prix Max",
        clmStatus : "Etat",
        clmNetMargin : "Marge Nette",
        clmMargin : "Marge Brute",
        clmRayonCode : "Reyon-Code",
        clmRayonName : "Reyon-Name"
    },
    msgWarning : 
    {
        title : "Attention",
        msg: "Les Familles de produits des produits sélectionnés changeront. Confirmez Vous ?",
        btn01 : "Abandonner",
        btn02 : "Valider"
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
}
export default proces_01_001