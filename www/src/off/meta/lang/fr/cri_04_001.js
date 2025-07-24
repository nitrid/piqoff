// "Müşteri Extre Raporu"
const cri_04_001 =
{
    txtCustomerCode : "Client/Fournisseur", 
    btnGet :"Rechercher", 
    txtDate : "Date",
    grdListe : 
    {
        clmDocDate: "Date",  
        clmTypeName : "Type de document",      
        clmRef : "Série du document",   
        clmRefNo : "Ordre du document",   
        clmDebit : "Débit",   
        clmReceive : "Crédit",   
        clmBalance : "Solde",   
    },
    txtTotalBalance :"Solde", 
    pg_txtCustomerCode : 
    {
        title : "Choix Client/Fournisseur",
        clmCode :  "Code Client/Fournisseur",
        clmTitle : "Nom Client/Fournisseur",
        clmTypeName : "Type",
        clmGenusName : "Genre",
        clmBalance : "Solde",  
    },
    msgNotCustomer:
    {
        title: "Attention", 
        btn01: "OK", 
        msg:  "veuillez choisir le Client/Fournisseur"
    },
}
export default cri_04_001