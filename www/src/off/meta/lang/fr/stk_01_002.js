// Barkod Tanımları
const stk_01_002 = 
{
    txtBarcode: "Code barre",
    txtItem: "Référence Produit",
    txtItemName: "Nom Produit",
    cmbBarUnit: "Unité",
    txtBarUnitFactor: "Coefficient",
    cmbPopBarType : "Type",
    MainUnit : "Code barre saisie à l'unité principale" , 
    SubUnit : "Code barre saisie au contenu principal",
    txtUnitTypeName :"Motif",
    barcodePlace : "Veuillez ajouter le code barre au produit sélectionné.", 
    txtPartiLot : "Numero de lot",
    pg_partiLot:
    {
        title: "Sélection Lot",
        clmLotCode: "Numero de lot",
        clmSkt: "DLC"
    },
    pg_txtItem:
    {
        title: "Sélection Produit",
        clmCode: "Code",
        clmName: "Nom", 
    },
    pg_txtBarcode:
    {
        title: "Sélection Code barre",
        clmBarcode: "Code Barre",
        clmItemName: "Nom Produit", 
        clmItemCode: "Référence Produit"
    },
   
    msgCheckBarcode:
    {
        title: "Attention",
        btn01: "OK",
        msg: "Code barre saisie déjà enregistré ! Importer Stock.",
    },
    msgBarcode:
    {
        title: "Attention",
        btn01: "Recherche Code barre",
        btn02: "OK",
        msg: "Code Barre Saisie Existant !",
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
        msgFailed: "Enregistrement échoué !",
    },
    msgSaveValid:
    {
        title: "Attention",
        btn01: "OK",
        msg: "Veuillez saisir les zones nécessaires !" ,
    },
    msgDelete:
    {
        title: "Attention",
        btn01: "OK",
        btn02: "Abandonner",
        msg: "Etes-vous sûr(e) de vouloir supprimer l'enregistrement ?" ,
    },
    validCode :"Veuillez Sélectionner le Produit",
}
export default stk_01_002