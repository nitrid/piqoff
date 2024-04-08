// "Sipariş Ayrıştırma"
const sip_04_001 =  
{
    txtCustomerCode : "Fournisseur",
    validDepot : "Veuillez sélectionner un entrepôt",
    ItemNamePlaceHolder :"Entrez le nom complet du produit ou une syllabe le contenant",
    pg_txtCustomerCode : 
    {
        title : "Choix du fournisseur",
        clmCode :  "Code de fournisseur",
        clmTitle : "Nom de fournisseur",
        clmTypeName : "Type",
        clmGenusName : "Type"
    },
    cmbDepot : 'Dépôt',
    btnGet : 'Rechercher',
    btnOrder : 'Créer une commande',
    grdOrderList : 
    {
        clmCode: "Code",
        clmName : "Nom",
        clmQuantity : "Quantité",
        clmCustomer : "Fournisseur",
        clmPrice : "Prix"
    },
    msgSave:
    {
        title: "Attention",
        btn01: "Valider",
        btn02: "Abandonner",
        msg: "Êtes-vous sûr de vouloir faire retour des lignes sélectionnées !"
    },
    msgSaveResult:
    {
        title: "Attention",
        btn01: "OK",
        msgSuccess: " Vos documents de retour ont été créés.. !",
        msgFailed: "Votre Enregistrement a échoué !"
    },
    msgDublicateItem : 
    {
        title: " Attention",
        btn01 : "OK",
        msg : "Le produit a été sélectionné pour plus d'un fournisseur Veuillez vérifier"
    },
    msgCustomerFound : 
    {
        title: "Attention",
        btn01 : "OK",
        msg : "Les produits dont le fournisseur n'est pas défini ne peuvent pas être sélectionnés. Veuillez définir le fournisseur"
    }
}
export default sip_04_001