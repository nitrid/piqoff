//  "Promosyon Listesi"
const promo_02_001 =
{
    txtCode: "Code", 
    txtName: "Nom", 
    dtStartDate: "Date Début",
    dtFinishDate: "Date Fin",
    txtCodePlace: "Saisissez le code promo ou le code-barres du produit", 
    txtNamePlace: "Entrez le code promotionnel ou le nom du produit", 
    btnGet: "Recherche",
    grdListe: 
    {
        clmCode: "Code",
        clmName: "Nom", 
        clmStartDate: "Date Début", 
        clmFinishDate : "Date Fin",
        clmCondTypeName : "Type de condition",
        clmCondItemCode : "Code de condition",
        clmCondItemName : "Nom de condition",
        clmCondBarcode : "Condition de Code-Barres",
        clmCondQuantity : "Condition de quantité",
        clmCondAmount : "Condition Total",
        clmAppTypeName : "Application de type",
        clmAppItemCode : "Application de Code",
        clmAppItemName : "Application de Nom",
        clmAppBarcode : "Application de barre code",
        clmAppQuantity : "Application de quantité",
        clmAppAmount : "Application de montant",
    },
    msgDelete:
    {
        title: "Attention",   
        btn01: "D'accord",   
        btn02: "Abandonnez",  
        msg: "Etes-vous sûr de vouloir supprimer les promotions séletionnées?" 
    },
}
export default promo_02_001