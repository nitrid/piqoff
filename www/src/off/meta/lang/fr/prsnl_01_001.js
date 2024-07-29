// "Müşteri Tanımları"
const prsnl_01_001 =
{
    cmbType :"Type",
    cmbGenus :"Genre",
    txtCode : "Code",
    txtTitle : "Titre",
    txtEmployeeName : "Prénom",
    txtEmployeeLastname : "Nom De Famille",
    txtPhone1 : "Téléphone 1",
    txtPhone2 : "Téléphone 2",
    txtGsmPhone : "Port Tel.",
    txtOtherPhone : "Autre Tel.",
    txtEmail : "E-Mail",
    txtAge: "Âge",
    txtWage: "Salaire",
    txtInsuranceNo: "Numéro d'assurance",
    txtGender: "Sexe",
    txtMarialStatus: "État civil",
    txtWeb : "Web",
    tabTitleAdress : "Adresse",
    tabTitleLegal : "Légal",
    tabTitleOffical : "Administrateur",
    tabEmployeeBank : "Données Bancaires",
    tabTitleFinanceDetail : "Informations Financières", 
    txtLegal :"Données Légales",
    chkRebate :"Retour-Reprise",
    chkVatZero :"Sans TVA",
    txtExpiryDay : "Echéance",  
    txtRiskLimit : "Limite de Risque",  
    expDay : "(Jour)", 
    chkActive: "Actif",
    pg_txtCode : 
    {
        title : "Sélectionner Client",
        clmCode : "Code",
        clmTitle : "Titre",
        clmName : "Prénom",
        clmLastName  : "Nom",
        clmStatus  : "Statut",
        clmGender  : "Sexe",
    },
    grdAdress : 
    {
        clmAdress : "Adresse",
        clmZipcode : "Code Postal",
        clmCity :"Ville",
        clmCountry : "Pays",
        clmSiret : "Siret"
    },
    grdLegal : 
    {
        clmSiretID : "Siret No",
        clmApeCode : "Code Ape",
        clmTaxOffice : "Impôt",
        clmTaxNo : "Numéro Impôt",
        clmIntVatNo : "No EORI",
        clmTaxType : "Type de Taxe",
        clmSirenID : "Siren No",
        clmRcs : "RCS",
        clmCapital : "Capital",
        clmInsurance : "Assurance No" 
    },
    grdOffical : 
    {
        clmName :"Nom",
        clmLastName : "Nom De Famille",
        clmPhone1 : "Téléphone 1",
        clmPhone2 : "Téléphone 2",
        clmGsmPhone : "Tél. Port",
        clmEMail : "E-Mail"
    },
    grdBank : 
    {
        clmName : "Nom Banque",
        clmIban : "IBAN",
        clmOffice : "Centre",
        clmSwift : "Code Swift",
    },
    popAdress : 
    {
        title : "Adresse",
        txtPopAdress : "Adresse",
        cmbPopZipcode :"Code Postal",
        cmbPopCity :"Ville",
        cmbPopCountry :"Pays",
        txtPopAdressSiret : "Siret"
    },
    popBank : 
    {
        title : "Données Bancaires",
        txtName : "Nom de Banque",
        txtIban :"IBAN",
        txtOffice :"Centre",
        txtSwift :"Code Swift",
    },
    popOffical : 
    {
        title : "Administrateur",
        txtPopName : "Nom",
        txtPopLastName : "Nom De Famille",
        txtPopPhone1 :"Téléphone 1",
        txtPopPhone2 :"Téléphone  2",
        txtPopGsmPhone : "Port Tel.",
        txtPopOtherPhone : "Autre Tel.",
        txtPopMail :"E-Mail"
    },
    msgSave:
    {
        title: "Attention",
        btn01: "OK",
        btn02: "Abandonner",
        msg: "Etês-vous sûr(e) de vouloir Enregistrer!"
    },
    msgSaveResult:
    {
        title: "Attention",
        btn01: "OK",
        msgSuccess: "Enregistré avec succès !",
        msgFailed: "Enregistrement échoué !"
    },
    msgSaveValid:
    {
        title: "Attention",
        btn01: "OK",
        msg: "Veuillez saisir les zones nécessairess !"
    },
    msgLegalNotValid:
    {
        title: "Attention",
        btn01: "OK",
        msg: "Veuillez Saisir les Zones Légales !"
    },
    msgTaxNo:
    {
        title: "Attention",   
        btn01: "OK",   
        msg: "Veuillez Saisir le Numéro TVA !"   
    },
    msgAdressNotValid:
    {
        title: "Attention",
        btn01: "OK",
        msg: "Saisir pays de résidence !"
    },
    msgDelete:
    {
        title: "Attention",
        btn01: "OK",
        btn02: "Abandonner",
        msg: "Êtes-vous sûr(e) de vouloir supprimer l'enregistrement ?"
    },
    cmbTypeData : 
    {
        individual :  "Particulier",
        company :  "Entreprise",
        association : "Association"
    },
    cmbGenusData:
    {
        Employee : "Client",
        supplier : "Fournisseur",
        both : "Tous les Deux",
        branch : "Magasin" 
    },
    cmbTaxTypeData : 
    {
        individual :  "Particulier",
        company :  "Entreprise"
    },
    msgCode : 
    {
        title: "Attention",
        btn01: "Rechercher Client",
        btn02: "OK",
        msg : "Client déjà existant!"
    },
    chkTaxSucre : "Taxe sucrée",
    tabTitleDetail : "Information détail",
    validation : 
    {
        frmEmployees: "Le Code ne peut être Vide !",
    },
    txtSubEmployee : "Fournisseur filiale", 
    pg_subEmployee : 
    {
        title : "Choix du fournisseur filiale",  
        clmCode : "Code", 
        clmTitle : "Titre", 
        clmName : "Prénom",  
        clmLastName  : "Nom", 
    },
    txtMainEmployee : "Fournissseur principal",
    pg_mainEmployee : 
    {
        title : "Choix du fournisseur principal", 
        clmCode : "Code",   
        clmTitle : "Titre",  
        clmName : "Prénom",   
        clmLastName  : "Nom", 
    },
    txtArea : "Zone", 
    pg_AreaCode : 
    {
        title : "Choix de la zone", 
        clmCode : "Code", 
        clmName : "Nom", 
    },
    txtSector : "Secteur",
    pg_SectorCode : 
    {
        title : "Choix de la zone",  
        clmCode : "Code",  
        clmName : "Nom", 
    },
    txtPriceListNo: "Numéro Liste Prix", //BAK
    pg_priceListNo: //BAK
    {
        title: "Sélection de la Liste de Prix",
        clmNo: "Numéro",
        clmName: "Nom"
    },
    popNote : 
    {
        title : "Ajouter une note", 
    },
    tabTitleNote : "Les notes", 
    grdNote:
    {
        clmNote : "Note",
        clmName : "Nom", 
    },
    txtMainGroup : "Groupe principale ",
    pg_MainGroup : 
    {
        title : "Choix du groupe",
        clmCode : "Code",
        clmName : "Nom",
    },
    btnSubGroup: "Ajouter un Sous-groupe",
    pg_subGroup: 
    {
        title: "Sélection de Sous-groupe",
        clmName: "Nom",
    },
    msgTaxInSpace: 
    {
        title: "Attention",
        btn01: "D'accord",
        msg: "Veuillez écrire le numéro de TVA sans espaces !"
    }
}
export default prsnl_01_001