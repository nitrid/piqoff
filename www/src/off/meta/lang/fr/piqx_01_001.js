// "Liste des factures entrantes"
const piqx_01_001 = //BAK
{
    btnGet: "Récupérer",
    dtFirst: "Date de début",
    dtLast: "Date de fin",
    grdList: 
    {
        clmDate: "Date",
        clmFromNo: "Numéro fiscal",
        clmFromTitle: "Dénomination",
        clmStatus: "Statut"
    },
    popImport:
    {
        title: "Importer",
        btnImport: "Importer",
        txtCustomerCode: "Code fournisseur",
        txtCustomerName: "Nom du fournisseur",
        dtDocDate: "Date du document",
        dtShipDate: "Date d'expédition",
        cmbDepot: "Dépôt",
        txtHT: "Total HT",
        txtTax: "Taxes",
        txtTTC: "Total TTC",
        clmItemCode: "Code article",
        clmMulticode: "Code multiple",
        clmItemName: "Nom de l'article",
        clmQuantity: "Quantité",
        clmPrice: "Prix",
        clmDiscount: "Remise",
        clmAmount: "Montant",
        msgImport:
        {
            title: "Attention",
            btn01: "OK",
            msg1: "Aucune donnée à importer !",
            msg2: "Veuillez sélectionner un dépôt !",
            msg3: "Impossible de réaliser l'importation, fournisseur introuvable !",
            msg4: "Vous ne pouvez pas effectuer le transfert tant que la liste contient des articles non définis !",
            msg5: "La facture d'achat a été enregistrée sous le numéro.",
            msg6: "Vous ne pouvez pas enregistrer à nouveau une facture déjà importée !",
        }
    },
}

export default piqx_01_001;