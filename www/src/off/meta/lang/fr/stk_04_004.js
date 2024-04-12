// SKT operasyonu
const stk_04_004 =
{
    txtRef : "Produit",   
    dtFirstdate : "Date Début",   
    dtLastDate : "Date Fin",   
    btnGet : "Recherche",   
    btnPrint : "Imprimer étiquette spéciale au produit sélectionné",   
    txtCustomerCode : "Fournisseur", 
    cmbItemGroup : "Catégorie Produit", 
    grdExpdateList:   
    {   
        clmQuantity : "Quantité",   
        clmCode : "Code",   
        clmName : "Nom",   
        clmDiff : "Vente Depuis Date Saisie", 
        clmDate : "DLC",
        clmRemainder : "Restant", 
        clmCustomer :"Fournisseur",
        clmRebate : "Reprise-Retour",
        clmDescription :"Remarque",
        clmUser : "Utilisateur",
        clmCDate : "Date Entrée" ,
        clmPrintCount : "Quantité à Imprimer", 
        clmLUser : "Dernière Impression/Saisie"  
    },   
    popQuantity :    
    {   
        title : "Saisie Quantité-Prix",   
        txtQuantity : "Quantité",   
        txtPrice : "Prix",   
        btnSave : "Enregistrer et Imprimer"   
    },  
    pg_txtRef:  
    {  
        title: "Choix produit",   
        clmCode: "Code",   
        clmName: "Nom",   
        clmStatus: "Mode"   
    },
    pg_txtCustomerCode : 
    {
        title : "Choix Fournisseur",
        clmCode :  "Code Fournisseur",
        clmTitle : "Nom Fournisseur",
        clmTypeName : "Type",
        clmGenusName : "Genre"
    },
    msgLabelCount:
    {
        title: "Attention",  
        btn01: "OK",  
        btn02: "Abandonner",  
        msg: "Etiquette spéciale déja éditer pour le Produit Sélectionné !Êtes-vous sûr(e) de Vouloir le rééditer?" 
    },
    msgLabelCount:
    {
        title: "Attention",  
        btn01: "OK",  
        msg: "Impossible d'imprimer plus que la quantité du produit restant." 
    },
}
export default stk_04_004