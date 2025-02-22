// Paiement par Tranches
const fns_02_003 = 
{
    txtRefRefno : "Série-Numéro",
    txtCustomerCode : "Code Client",
    txtCustomerName : "Nom Client",
    lblInstallment : "Sélection de la Facture",
    lblInstallmentCount : "Création de Tranches",
    installmentPeriod : "Nombre de Tranches",
    paymentDate : "Date de Début du Paiement",
    installmentTotal : "Total des Tranches",
    dtDocDate : "Date",
    dtFirst : "Date de la Facture",
    installmentAdd : "Ajouter",
    btnInstallment : "Sélection de la Facture",
    btnInstallmentCount : "Création de Tranches",
    popInstallment :
    {
        title : "Sélection de la Facture",
    },
    popInstallmentCount :
    {
        title : "Création de Tranches",
    },
    pg_txtCustomerCode : 
    {
        title : "Sélection du Client",
        clmCode :  "CODE CLIENT",
        clmTitle : "NOM CLIENT",
        clmTypeName : "TYPE",
        clmGenusName : "GENRE"
    },
    pg_Docs : 
    {
        title : "Sélection des Documents",
        clmDate : "DATE",
        clmRef : "SERIE",
        clmRefNo : "NUMERO",
        clmCustomerName : "NOM CLIENT",
        clmCustomerCode : "CODE CLIENT",
        clmInstallmentNo : "NUMERO DE TRANCHE",
        clmInstallmentDate : "DATE DE DEBUT DE TRANCHE",
        clmAmount : "MONTANT DE TRANCHE",
        clmTotal : "TOTAL"
    },
    grdInstallment : 
    {
        clmDocDate : "DATE",
        clmRef : "SERIE",
        clmRefNo : "NUMERO",
        clmCustomerName : "NOM CLIENT",
        clmCustomerCode : "CODE CLIENT",
        clmInstallmentNo : "NUMERO DE TRANCHE",
        clmInstallmentDate : "DATE DE TRANCHE",
        clmAmount : "MONTANT DE TRANCHE",
        clmTotal : "TOTAL"
    },
    grdPopInstallment : 
    {
        clmDocDate : "DATE",
        clmRef : "SERIE",
        clmRefNo : "NUMERO",
        clmInputName : "NOM DE L'ENTREPRISE",
        clmDate : "DATE",
        clmAmount : "MONTANT"
    },
    msgDocValid:
    {
        title: "Attention",
        btn01: "OK",
        msg: "Les informations de base du document ne peuvent pas être laissées vides avant de saisir un produit !"
    },
    msgCustomerNotSelected:
    {
        title: "Attention",
        btn01: "OK",
        msg: "Client non sélectionné !"
    },
    msgFactureNotSelected:
    {
        title: "Attention",
        btn01: "OK",
        msg: "Facture ou numéro de document non sélectionné !"
    },
    msgSave:
    {
        title: "Attention",
        btn01: "OK",
        btn02: "Annuler",
        msg: "Êtes-vous sûr de vouloir enregistrer ?"
    },
    msgSaveResult:
    {
        title: "Attention",
        btn01: "OK",
        msgSuccess: "Enregistrement réussi !",
        msgFailed: "Échec de l'enregistrement !"
    },
    msgSaveValid:
    {
        title: "Attention",
        btn01: "OK",
        msg: "Veuillez remplir les champs obligatoires !"
    },
    msgDelete:
    {
        title: "Attention",
        btn01: "OK",
        btn02: "Annuler",
        msg: "Êtes-vous sûr de vouloir supprimer ?"
    },
    msgLocked:
    {
        title: "Attention",
        btn01: "OK",
        msg: "Le document a été enregistré et verrouillé !"
    },
    msgPasswordSucces:
    {
        title: "Succès",
        btn01: "OK",
        msg: "Le verrou du document a été ouvert !",
    },
    msgPasswordWrong:
    {
        title: "Échec",
        btn01: "OK",
        msg: "Mot de passe incorrect !"
    },
    msgGetLocked:
    {
        title: "Attention",
        btn01: "OK",
        msg: "Le document est verrouillé ! \n Pour enregistrer les modifications, vous devez d'abord déverrouiller avec le mot de passe administrateur !"
    },
    msgDocLocked:
    {
        title: "Attention",
        btn01: "OK",
        msg: "Aucune transaction ne peut être effectuée sans d'abord déverrouiller le document !"
    },
    msgNotCustomer:
    {
        title: "Attention",
        btn01: "OK",
        msg: "Client non trouvé !!"
    },
    validRef :"La série ne peut pas être vide",
    validRefNo : "Le numéro de série ne peut pas être vide",
    validCustomerCode : "Le code client ne peut pas être vide",
    validDocDate : "Vous devez choisir une date",
    msgInvoiceSelect:
    {
        title: "Attention",
        btn01: "OK",
        msg: "Vous ne pouvez pas procéder sans sélectionner une facture !"
    },
    msgRowNotUpdate:
    {
        title:"Attention",
        btn01:"OK",
        msg:"Pour effectuer cette opération, vous devez d'abord couper la connexion associée.",
    },
}

export default fns_02_003;