export const langFr = 
{
    popGrid: 
    {
        btnSelection:"Choix",
        btnSearch:"Listes"
    },
    txtLangSelect : "Choix de la langue",
    userListTitle : "Liste des utilisateurs",
    txtUser : "Utilisateur",
    txtPass : "Mot de passe",
    btnLogin : "Entrer",
    btnLogout : "Sortie",
    btnUserSelect : "Choix de l'utilisateur",
    serverConnection : "Etablissement de la connexion avec le serveur",
    msgWarning : "Attention",
    msgSqlService1 : "Impossible de se connecter au serveur Sql",
    menu:
    {
        dashboard : "Tableau de bord",
        sale : "Vente",
        customerAccount : "Extrait client",
        itemDetail : "Détail du produit",
        collection: "Encaissement",
        customerCard : "Fournisseur-Client saisie",
        openInvoiceList : "Liste des factures ouvertes"
    },
    msgAnotherUserAlert: 
    {
        title : "Attention",
        msg : "Connexion avec vos informations d'utilisateur à partir d'un autre appareil.",
        btn01 : "D'accord"
    },
    msgDataTransfer: 
    {
        title : "Veuillez patienter !",
        msg : "Vos données sont en train de se mettre à jour..."
    },
    sale:  // "Vente"
    {
        loadMore : "Afficher plus",
        mostSalesFilter: "Produits les plus vendus",
        popCart:
        {
            txtCustomer: "Client",
            txtAmount : "Montant total",
            txtDiscount : "Remise sur les lignes",
            txtDocDiscount: "Remise sur les documents",
            txtTotalHt : "Sous-total", 
            txtVat : "Taxe",
            txtTotal : "Total",
            cmbDepot : "Dépôt",
            dtDocDate : "Date",
            txtDescription : "Information",
            cmbPricingList : "Numéro de tarif"
        },
        itemPopup:
        {
            txtFactor: "Coefficient", 
            txtPrice: "Prix",
            cmbUnit: "Unité",
            txtQuantity: "Quantité",
            txtDiscount: "Remise"
        },
        popCustomer:
        {
            title : "Choix du client",
            btn01 : "Recherche",
            btn02 : "Choisir",
            clmCode : "Code",
            clmName : "Nom"
        },
        grdSale: 
        {
            clmItemName: "Nom",
            clmPrice: "Prix",
            clmQuantity : "Quantité",
            clmDiscount : "Remise",
            clmDiscountRate : "Remise %",
            clmVat : "TVA",
            clmAmount : "Montant",
            clmTotal : "Montant total",
            clmTotalHt : "Montant Hors Taxe",
        },
        msgSave:
        {
            title: "Attention",
            btn01: "Commande",
            btn02: "Facture",
            btn03: "Abandonner",
            msg: "Veuillez choisir le type de document que vous souhaitez enregistrer!"
        },
        msgSaveResult:
        {
            title: "Attention",
            btn01: "D'accord",
            msgSuccess: "Enregistrement effectué!",
            msgFailed: "Enregistrement non effectué!"
        },
        msgDelete:
        {
            title: "Attention",
            btn01: "D'accord",
            btn02: "Abandonner",
            msg: "Etes-vous sûr de vouloir supprimer?"
        },
        msgCustomerSelect:
        {
            title: "Attention",
            btn01: "D'accord",
            msg: "Veuillez choisir un client"
        },
        msgDepotSelect:
        {
            title: "Attention",
            btn01: "D'accord",
            msg: "Veuillez choisir un dépôt"
        },
        msgLineNotFound:
        {
            title: "Attention",
            btn01: "D'accord",
            msg: "Impossible d'enregistrer un document sans ajout de produit!"
        },
        popDocs:
        {
            title : "Choix du document", 
            btn01 : "Apportez les documents", 
            btn02 : "Choisir" 
        },
        cmbDocType : 
        {
            order :"Commande", 
            invoice : "Facture" 
        },
        grdDocs : 
        {
            clmRef : "Série",  
            clmRefNo : "Ligne", 
            clmInputName : "Client", 
            clmDate : "Date", 
            clmTotal : "Total" 
        },
        popVatRate:
        {
            title : "Les taux d'imposition",
        },
        grdVatRate :
        {
            clmRate : "Taux d'imposition",
            clmVat : "Montant du taux", 
            clmTotalHt : "Montant Hors Taxe", 
        },
        btnVatToZero : "Mettre à 0 le taux", 
        btnCancel : "Fermez", 
        btnSave: "Enregistrer",
        popDiscount : 
        {
            title: "Remise lignes",  
            chkFirstDiscount : "Mettre à jour les 1 ère remise en ligne ", 
            chkDocDiscount : "Remise totale HT",  
            Percent1 : "1. remise %",  
            Price1 : "1. remise montant",  
            Percent2 : "2. remise %",  
            Price2 : "2. remise montant",  
            Percent3 : "3. remise %", 
            Price3 : "3. remise montant" 
        },
        popDocDiscount : 
        {
            title: "Remise totale HT",  
            Percent1 : "1. remise %",  
            Price1 : "1. remise montant",  
            Percent2 : "2. remise %", 
            Price2 : "2. remise montant",  
            Percent3 : "3. remise %",  
            Price3 : "3. remise montant" 
        },
        msgMemRecord:
        {
            title: "Attention", 
            btn01: "OK", 
            msg: "Vous avez des enregistrements non convertis dans votre document ! Veuillez vérifier vos opérations."
        },
        msgNew:
        {
            title: "Attention",
            btn01: "Oui",
            btn02: "Non",
            msg: "Êtes-vous sûr de vouloir créer un nouveau document ?"
        },
        popDesign : 
        {
            title: "Choix du Design",
            design : "Design" ,
            lang : "Langue Document",
            btnPrint :"Imprimer",
            btnCancel: "Supprimer",    
            btnView : "Aperçu", 
            btnMailsend : "Envoyer Mail", 
        },
        msgCollection:
        {
            title: "Attention",
            btn01: "Oui",
            btn02: "Non",
            msg: "Souhaitez-vous saisir un paiement pour votre facture ?"
        },
        grdQuantity: 
        {
            clmDepot: "Quantité en Dépôt",
            clmInput: "Quantité à Venir",
            clmOutput: "Commandé",
            clmTotal: "Total",
        },
        msgDiscountPrice:
        {
            title: "Attention",
            btn01: "OK",
            msg: "Vous ne Pouvez pas Appliquer de Remise Supérieure au Montant Total !"
        },
        msgDiscountPercent:
        {
            title: "Attention",
            btn01: "OK",
            msg: "Vous ne Pouvez pas Appliquer de Remise Supérieure au Montant Total !"
        },
    },
    extract :
    {
        txtCustomerCode : "Choissiez un client s'il vous plaît", 
        btnGet :"Apportez", 
        grdListe : 
        {
            clmDocDate: "Date",   
            clmTypeName : "Type de document",             
            clmRef : "Série du document",  
            clmRefNo : "Ligne du document",  
            clmDebit : "Dette",   
            clmReceive : "Recevoir",  
            clmBalance : "Equilibre",   
        },
        txtTotalBalance : "Equilibre",  
        popCustomer:
        {
            title : "Choix du client", 
            btn01 : "Rechercher", 
            btn02 : "Choisir",  
            clmCode : "Code",  
            clmName : "Nom"  
        },
        msgNotCustomer:
        {
            title: "Attention",
            btn01: "D'accord",
            msg: "Veuillez choisir un client"
        },
        grdDetail : 
        {
            clmCode: "Code",
            clmName : "Nom du produit",
            clmQuantity : "Quantité",
            clmPrice : "Prix",
            clmTotal : "Total",
        },
    },
    itemDetail :
    {
        txtItem : "Veuillez choisir un produit",
        txtItemGroup : "Groupe de produit",  
        txtItemPrice : "Prix",  
        grdListe : 
        {
           clmName : "Dépôt",  
           clmQuantity : "Quantité"  
        },
        popItem:
        {
            title : "Choix du client",  
            btn01 : "Rechercher",  
            btn02 : "Choisir", 
            clmCode : "Code",  
            clmName : "Nom" 
        },
        msgNotItem:
        {
            title: "Attention", 
            btn01: "D'accord", 
            msg: "Veuillez choisir un produit"
        },
    },
    dashboard: 
    {
        lastDocumant : "Dernière commande",  
        mountSales : "Total des commandes de ce mois", 
        yearSales : "Total des commandes de cette année", 
        sale : "Montant des ventes",        
    },
    collection:
    {
        txtCustomer: "Client", 
        dtDocDate : "Date",
        btnCash: "Saisie de paiement",
        txtTotal : "Total",
        cmbPayType : 
        {
            title : "Type de paiement",
            cash : "Espèces",
            check : "Chèque",
            bankTransfer : "Virement bancaire",
            otoTransfer : "Paiement automatique",
            foodTicket : "Ticket resto",
            bill : "Billet à ordre",
        },
        grdDocPayments: 
        {
            clmCreateDate: "Date d'enregistrement",
            clmAmount : "Montant",
            clmInputName : "Caisse/Banque",
            clmDescription : "Description",
            clmInvoice : "Facture payée",
            clmFacDate : "Date de la facture",
        },
        popCash : 
        {
            title: "Encaissement",
            btnApprove : "Ajouter",
            cash : "Montant",
            description : "Description",
            btnCancel : "Annuler",
            cmbCashSafe: "Caisse/Banque",
            invoiceSelect : "Sélection de facture",
        },
        ValidCash : "Veuillez saisir un montant supérieur à 0",
        msgNew:
        {
            title: "Attention",
            btn01: "Oui",
            btn02: "Non",
            msg: "Êtes-vous sûr de vouloir créer un nouveau document ?"
        },
        msgSave:
        {
            title: "Attention",
            btn01: "Oui",
            btn02: "Annuler",
            msg: "Êtes-vous sûr de vouloir enregistrer ?"
        },
        msgSaveResult:
        {
            title: "Attention",
            btn01: "OK",
            msgSuccess: "Enregistrement réussi !",
            msgFailed: "Enregistrement échoué !"
        },
        msgDelete:
        {
            title: "Attention",
            btn01: "OK",
            btn02: "Annuler",
            msg: "Êtes-vous sûr de vouloir supprimer l'enregistrement ? "
        },
        pg_invoices : 
        {
            title : "Sélection de facture",
            clmReferans : "Réf",
            clmInputName : "Nom du client",
            clmDate : "Date",
            clmTotal : "Total",
            clmRemaining  : "Reste",
        },
        popCustomer:
        {
            title : "Sélection du client",
            btn01 : "Rechercher",
            btn02 : "Choisir",
            clmCode : "Code",
            clmName : "Nom", 
        },
    },
    customerCard: // "Cari Tanımları"
    {
        cmbType :"Type",
        cmbGenus :"Genre",
        txtCode : "Code",
        txtTitle : "Titre",
        txtCustomerName : "Prénom",
        txtCustomerLastname : "Nom De Famille",
        txtPhone1 : "Téléphone 1",
        txtPhone2 : "Téléphone 2",
        txtGsmPhone : "Port Tel.",
        txtOtherPhone : "Autre Tel.",
        txtEmail : "E-Mail",
        txtWeb : "Web",
        tabTitleAdress : "Adresse",
        tabTitleLegal : "Légal",
        tabTitleOffical : "Administrateur",
        tabCustomerBank : "Données Bancaires",
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
        },
        grdAdress : 
        {
            clmAdress : "Adresse",
            clmZipcode : "Code Postal",
            clmCity : "Ville",
            clmCountry : "Pays",
        },
        grdLegal : 
        {
            clmSiretID : "N° Siret ",
            clmApeCode : "Code Ape",
            clmTaxOffice : "Impôt",
            clmTaxNo : "Numéro Impôt",
            clmIntVatNo : "N° TVA inter.",
            clmTaxType : "Type de Taxe",
            clmSirenID : "N° Siren ",
            clmRcs : "RCS",
            clmCapital : "Capital",
            clmInsurance : "N° Assurance " 
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
            cmbPopZipcode : "Code Postal",
            cmbPopCity : "Ville",
            cmbPopCountry : "Pays",
        },
        popBank : 
        {
            title : "Données Bancaires",
            txtName : "Nom de Banque",
            txtIban : "IBAN",
            txtOffice : "Centre",
            txtSwift : "Code Swift",
        },
        popOffical : 
        {
            title : "Administrateur",
            txtPopName : "Nom",
            txtPopLastName : "Nom De Famille",
            txtPopPhone1 : "Téléphone 1",
            txtPopPhone2 : "Téléphone  2",
            txtPopGsmPhone : "Port Tel.",
            txtPopOtherPhone : "Autre Tel.",
            txtPopMail : "E-Mail"
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
            Customer : "Client",
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
            frmCustomers: "Le Code ne peut être Vide !",
        },
        txtSubCustomer : "Fournisseur filiale", 
        pg_subCustomer : 
        {
            title : "Choix du fournisseur filiale",  
            clmCode : "Code", 
            clmTitle : "Titre", 
            clmName : "Prénom",  
            clmLastName  : "Nom", 
        },
        txtMainCustomer : "Fournissseur principal",
        pg_mainCustomer : 
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
        txtPriceListNo: "Numéro Liste Prix",
        pg_priceListNo:
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
    },
    openInvoiceList :
    {
        txtCustomerCode : "Veuillez sélectionner un client",
        btnGet :"Obtenir",
        grdListe : 
        {
            clmDocDate: "Date",
            clmTypeName : "Nom",           
            clmRef : "Référence du document",
            clmRefNo : "Numéro du document",
            clmDebit : "Dette",
            clmReceive : "Payé",
            clmBalance : "Restant",
        },
        txtTotalBalance : "Solde",
        popCustomer:
        {
            title : "Sélection de client",
            btn01 : "Chercher",
            btn02 : "Sélectionner",
            clmCode : "CODE",
            clmName : "NOM"
        },
        msgNotCustomer:
        {
            title: "Attention",
            btn01: "D'accord",
            msg: "Veuillez sélectionner un client..!"
        },
        grdDetail : 
        {
            clmCode: "Code",
            clmName : "Nom du produit",           
            clmQuantity : "Quantité",
            clmPrice : "Prix",
            clmTotal : "Total",
        },
    },

}