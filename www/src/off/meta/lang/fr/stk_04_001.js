//"Toplu Ürün Düzenleme"
const stk_04_001 =
{
    txtCustomerCode : "Fournisseur",
    codePlaceHolder : "Veuillez saisir le code produit, le code-barres ou le code fournisseur que vous souhaitez Chercher",  
    namePlaceHolder :"Saissir le nom complet ou une syllabe du produit",  
    pg_txtCustomerCode : 
    {
        title : "Choix Fournisseur",
        clmCode :  "Sélection Document",
        clmTitle : "Nom Fournisseur",
        clmTypeName : "Type",
        clmGenusName : "Genre"
    },
    cmbItemGroup : "Groupe Produit",
    btnGet : 'Chercher',
    txtCode : "Référence Produit",
    txtName : "Nom Produit",
    grdItemList : 
    {
        clmCode: "Code",
        clmName : "Nom",
        clmBarcode : "Code barre",
        clmMulticode : "FRN.Code",
        clmCustomerName : "Fournisseur",
        clmCustomerPrice : "Prix Fournisseur",
        clmPriceSale : "Prix Vente",
        clmVat : "Taxe",
        clmOrgins : "Origine",
        clmStatus : "Actif",
        clmUnderUnit : "Contenu du produit",
        clmMainUnit : "Unité Principale",
        clmUnderFactor : "Coefficient",
        clmWeighing : "Peser", 
        clmNetMargin :  "Marge Nette",
        clmGrossMargin : "Marge Brute",
    },
    msgSave:
    {
        title: "Attention",
        btn01: "Valider",
        btn02: "Abandonner",
        msg: "Etes-vous sûr(e) de Vouloir Enregistrer!"
    },
    msgSaveResult:
    {
        title: "Attention",
        btn01: "OK",
        msgSuccess: "Enregistré avec Succès ..!",
        msgFailed: "Enregistrement échoué !"
    },
}
export default stk_04_001