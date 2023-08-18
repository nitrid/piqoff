export const langFr = 
{
    popGrid: {btnSelection:"Choix",btnSearch:"Listes"},
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
        itemDetail : "Détail du produit"
    },
    msgAnotherUserAlert: 
    {
        title : "Attention",
        msg : "Connexion avec vos informations d'utilisateur à partir d'un autre appareil.",
        btn01 : "D'accord"
    },
    sale:  // "Vente"
    {
        loadMore : "Afficher plus",
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
        },
        itemPopup : 
        {
            txtFactor : "Katsayı", // BAK
            txtPrice  :"Fiyat",
            cmbUnit : "Birim"
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
            clmTotalHt : "Montant sans la taxe",
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
            clmTotal : "Montant" 
        },
        popVatRate:
        {
            title : "Les taux d'imposition",
        },
        grdVatRate :
        {
            clmRate : "Taux d'imposition",
            clmVat : "Montant du taux", 
            clmTotalHt : "Montant", 
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
            msg: "S'il vous plaît choisissez un client"
        },
    },
    itemDetail :
    {
        txtItem : "S'il vous plait choissisez un produit", 
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
            msg: "S'il vous plaît choissiez un produit" 
        },
    },
    dashboard: 
    {
        lastDocumant : "Dernière commande",  
        mountSales : "Total des commandes de ce mois", 
        yearSales : "Total des commandes de cette année", 
        sale : "Montant des ventes"  
    }
}