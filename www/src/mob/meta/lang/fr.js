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
    comingSoon : "Bientôt actif... ", 
    btnBarcodeEntry: "Entrée du code-barres",   
    btnProcessLines: "Traiter les lignes",   
    btnNewDoc: "Nouveau document",   
    btnDocDelete: "Supprimer le document",   
    btnLineDisc: "Remise de ligne",       
    chkRememberMe : "Souviens-toi de moi", 
    msgAnotherUserAlert: 
    {
        title : "Attention",
        msg : "Vous êtes connecté à partir d'un autre appareil avec vos informations d'utilisateur",
        btn01 : "OK"
    },
    msgSaveResult:
    {
        title: "Attention",
        btn01: "OK",
        msgSuccess: "Enregistré avec succès !",
        msgFailed: "Enregistrement échoué !",
    },
    msgCombineItem:
    {
        title: "Attention",
        btn01: "Assembler",
        btn02: "Déjà saisi",
        btn03 : "Abandonner",
        msg: "Le produit scanné est déjà saisi! Voulez-vous le réajouter?"
    },
    msgDiffCustomer:
    {
        title: "Attention",
        btn01: "Abandonner",
        btn02: "Continuer",
        msg: "Le fournisseur enregistré ne correspond pas au produit saisi. Voulez-vous continuer?"
    },
    popCustomer : 
    {
        title : "Choix du client", 
        clmCode :  "Mot de passe",
        clmTitle : "Catégorie",
        clmTypeName : "Type",
        clmGenusName : "Genre"
    },
    popItem : 
    {
        title : "Choix du stock",
        clmCode : "Mot de passe",
        clmName : "Nom",
    },
    popDiscount:
    {
        title: "Remise sur la ligne",
        lblPopDisc : "Montant total",
        lblPopDiscRate : "%",
        btnSave: "Enregister"
    },
    popDocDiscount:
    {
        title: "Remise sur le document",
        Percent1: "1. %",
        Price1: "1. montant",
        Percent2: "2. %",
        Price2: "2. montant",
        Percent3: "3. Yüzde",
        Price3: "3. montant ",
        btnSave: "Enregister"
    },
    menu:
    {
        dash : "Tableau de bord",
        stk : "Traitement stocks",
        dep : "Traitement dépôts",
        irs : "Traitement livraison",
        sip : "Traitement commande",
        kar : "Comparer commande", 
        stk_01 : "Voir le prix",
        stk_02 : "Voir fournisseur",
        stk_03 : "Code - barres",
        stk_04 : "Groupe de produit",
        stk_05 : "Compter",
        stk_06 : "Imprimer étiquette",
        stk_07 : "Etiquette spéciale",
        stk_08 : "Retour des Produits",
        dep_01 : "Transfert",
        dep_02 : "Commande dépôt",
        dep_03 : "Accepter marchandise",
        irs_01 : "BL achat",
        irs_02 : "BL vente",
        irs_03 : "Saisie BL interne", 
        irs_04 : "BL retour",
        sip_01 : "Commande de vente",
        sip_02 : "Commande d'achat",
        sip_03 : "Commande regroupée",
        sip_04 : "Commande POS",
        kar_01 : "Vente", 
        kar_02 : "Achat" 
    },
    login:
    {
        login:"Entrer",
        logout : "Sortie",
        selectUser : "Choix d'utilisateur",
    },
    stk_01 : // "Voir prix"
    {
        msgAlert :
        {
            btn01 : "D'accord",
            title : "Attention",
            msgBarcodeNotFound : "Code-barre inconnu!",
            msgBarcodeCheck : "Veuillez-lire le code-barre !",
            msgLimitQuantityCheck :"La quantité ne peut pas être supérieure à 9 999 !",
            msgNotSave : "Echec de l'enregistrement",
        },
        grdPrice : 
        {
            clmDate : "Date de fin",
            clmQuantity :  "Quantité",
            clmPrice : "Prix"
        },
        grdCustomer : 
        {
            clmMulticode :  "Code fournisseur",
            clmPrice : "Prix fournisseur",
            clmCustomer : "Fournisseur"
        },
    },
    stk_02 : // "Voir fournisseur"
    {
        msgAlert :
        {
            btn01 : "D'accord",
            title : "Attention",
            msgBarcodeNotFound : "Code-barre inconnu!",
            msgBarcodeCheck : "Veuillez-lire le code-barre!",
            msgLimitQuantityCheck :"La quantité ne peut pas être supérieure à 9 999 !",
            msgNotSave : "Echec de l'enregistrement",
        },
        grdCustomer : 
        {
            clmMulticode :  "Code fournisseur",
            clmPrice : "Prix fournisseur",
            clmCustomer : "Fournisseur"
        },
    },
    stk_03 : // "Identification du code-barre"
    {
        lblBarcode : "Code-barre",
        lblType : "Type de code-barre",
        lblUnit : "Unité",
        lblFactor : "Coefficient",
        lblSave  : "Enregistrer",
        msgAlert :
        {
            btn01 : "D'accord",
            title : "Attention",
            msgBarcodeNotFound : "Code-barre inconnu!",
            msgDblBarcode : "Le code-barre saisi est déjà enregistré dans la base des données!",
            msgBarcodeCheck : "S'il vous plaît choissisez un produit.",
            msgLimitQuantityCheck :"La quantité ne peut pas être supérieure à 9 999 !",
            msgSave : "Succès de l'enregistrement",
            msgNotSave : "Echec de l'enregistrement",
        },
        grdCustomer : 
        {
            clmMulticode :  "Code fournisseur",
            clmPrice : "Prix fournisseur",
            clmCustomer : "Fournisseur"
        },
    },
    stk_04 : // "Groupe de produit"
    {
        lblBarcode : "Code-barre",
        lblSave  : "Enregistrer",
        lblAutoAdd : "Enregister automatiquement",
        lblGroup : "Groupe de produit",
        msgAlert :
        {
            btn01 : "D'accord",
            title : "Attention",
            msgBarcodeNotFound : "Code-barre inconu!",
            msgDblBarcode : "Le code-barre saisi est déjà enregistré dans la base des données!",
            msgBarcodeCheck : "S'il vous plaîot choissisez un produit.",
            msgLimitQuantityCheck :"La quantité ne peut pas être supérieure à 9 999 !",
            msgSave : "Succès de l'enregistrement",
            msgNotSave : "Echec de l'enregistrement",
            
        },
    },
    stk_05 : // "Compte"
    {
        lblRef : "Ligne-colonne:",
        lblDepot : "Dépôt :",
        lblDate : "Date:",
        lblDepotQuantity : "Quantité dépôt:",
        lblUnit : "Unité:",
        lblQuantity : "Quantité :",
        lblAdd: "Ajouter",
        lblTotalLine : "Montant ligne",
        lblTotalCount : "Montant produit",
        msgAlert :
        {
            btn01 : "D'accord",
            title : "Attention",
            msgDepot : "S'il vous plaît choissisez un dépôt!",
            msgCustomer : "S'il vous plaît choissisez un client!",
            msgProcess : "Aucun produit saisi actuellement!",
            msgBarcodeNotFound : "Code-barre inconnu!",
            msgBarcodeCheck : "Veuillez-lire le code-barre!",
            msgLimitQuantityCheck :"La quantité ne peut pas être supérieure à 9 999 !",
            msgQuantityCheck : "Impossible d'entrer un produit sans saisi de prix!",
            msgRowNotDelete : "Cette ligne a été convertie en facture ou en bon de livraison, vous ne pouvez pas la supprimer!",
            msgRowNotUpdate : "Ce décompte est définitif et ne peut être modifié !",
            msgDiscount : "La remise ne peut pas être supérieure au montant!",
            msgNotSave : "Echec de l'enregistrement",
        },
        grdList : 
        {
            clmItemName : "Nom",
            clmQuantity :  "Quantité",
        },
        popDoc : 
        {
            title : "Choix du document",
            clmRef :  "Référence",
            clmRefNo : "Numéro de référence",
            clmDate : "Date",
            clmDepotName : "Dépôt",
            clmTotalLine : "Total ligne",
            clmQuantity : "Total produit"
        },
    },
    stk_06 : // "Impression d'étiquette"
    {
        lblRef : "Ligne-colonne :",
        lblDesing : "Design :",
        lblPageCount : "Nombre de pages :",
        lblFreeLabel : "Espace libre:",
        lblLine : "Montant ligne:",
        lblAdd: "Ajouter",
        lblPrice : "Prix",
        lblAutoAdd : "Ajouter automatiquement",
        msgAlert :
        {
            btn01 : "D'accord",
            title : "Attention",
            msgProcess : "Aucun produit saisi actuellement!",
            msgBarcodeNotFound : "Code-barre inconnu!",
            msgBarcodeCheck : "Veuillez-lire le code-barre!",
            msgLimitQuantityCheck :"La quantité ne peut pas être supérieure à 9 999 !",
            msgNotSave : "Echec de l'enregistrement",
        },
        grdList : 
        {
            clmBarcode : "Code-barre",
            clmName :  "Nom du produit",
            clmPrice : "Prix"
        },
        popDoc : 
        {
            title : "Choix du document",
            clmRef :  "Référence",
            clmRefNo : "Numéro de référence",
        },
    },
    stk_07 : // "Özel Etiket Bas"  KOMPLE BAK
    {
        lblPrice : "Prix",
        lblQuantity : "Quantité",
        lblDescription : "Description",
        lblAdd : "Ajouter",
        msgAlert :
        {
            btn01 : "OK",
            title : "Attention",
            msgProcess : "Aucun produit n'a encore été saisi !",
            msgBarcodeNotFound : "Code-barres introuvable !",
            msgBarcodeCheck : "Veuillez scanner le code-barres !",
            msgLimitQuantityCheck :"La quantité ne peut pas être supérieure à 9 999 !",
            msgNotSave : "Échec de l'enregistrement.",
        },
        grdList : 
        {
            clmBarcode : "code-barres",
            clmName :  "Nom du produit",
            clmPrice : "Prix"
        },
    },
    stk_08 : // "Transfert dépôt de retour"
    {
        lblRef : "Ligne-colonne :",
        lblDepot1 : "Sortie de dépôt:",
        lblDepot2 : "Dépôt de retour:",
        lblDate : "Date :",
        lblDepotQuantity : "Quantité dépôt:",
        lblUnit : "Unité:",
        lblQuantity : "Quantité:",
        lblPrice : "Prix:",
        lblAmount : "Montant:",
        lblDiscount : "Remise sur la ligne :",
        lblDocDiscount : "Remise sur le document :",
        lblTotalHt: "Sous-total:",
        lblVat : "TVA:",
        lblSumAmount : "Montant total :",
        lblGenAmount : "Total :",
        lblAdd: "Ajouter",
        msgAlert :
        {
            btn01 : "D'accord",
            title : "Attention",
            msgOutDepot : "S'il vous plaît choissisez le dépôt de sortie!",
            msgInDepot : "S'il vous plaît choissisez le dépôt d'entrée!",
            msgProcess : "Aucun produit saisi actuellement!",
            msgBarcodeNotFound : "Code-barre inconnu!",
            msgBarcodeCheck : "Veuillez-lire le code-barre!",
            msgLimitQuantityCheck :"La quantité ne peut pas être supérieure à 9 999 !",
            msgQuantityCheck : "Impossible d'entrer un produit sans saisi de prix!",
            msgRowNotDelete : "Cette ligne a été convertie en facture ou en bon de livraison, vous ne pouvez pas la supprimer.!",
            msgRowNotUpdate : "Étant donné que cette ligne provient de la facture ou du bon de livraison , le montant ne peut pas être modifié!",
            msgDiscount : "La remise ne peut pas être supérieure au montant!",
            msgNotSave : "Echec de l'enregistrement",
        },
        grdList : 
        {
            clmItemName : "Nom",
            clmQuantity :  "Quantité",
            clmPrice : "Prix",
            clmAmount : "Total",
            clmDiscount : "Remise",
            clmDiscountRate : "Remise %",
            clmVat : "TVA",
            clmTotal : "Total"
        },
        popDoc : 
        {
            title : "Choix du document",
            clmRef :  "Référence",
            clmRefNo : "Numéro de référence",
            clmDate : "Date",
            clmInputName : "Nom du dépôt",
            clmInputCode : "Code dépôt",
        },
    },
    sip_01 : // "Commande de vente"
    {
        lblRef : "Ligne-colonne:",
        lblDepot : "Dépôt :",
        lblCustomerCode : "Code client:",
        lblCustomerName : "Nom client:",
        lblDate : "Date :",
        lblDepotQuantity : "Quantité dépôt:",
        lblUnit : "Unité:",
        lblQuantity : "Quantité :",
        lblPrice : "Prix :",
        lblAmount : "Total :",
        lblDiscount : "Remise sur la ligne :",
        lblDocDiscount : "Remise sur le document :",
        lblTotalHt: "Sous total :",
        lblVat : "TVA :",
        lblSumAmount : "Montant total:",
        lblGenAmount : "Total:",
        lblAdd: "Ajouter",
        msgAlert :
        {
            btn01 : "D'accord",
            title : "Attention",
            msgDepot : "S'il vous plaît choissisez un dépôt!",
            msgCustomer : "S'il vous plaît choissisez un client !",
            msgProcess : "Aucun produit saisi actuellement!",
            msgBarcodeNotFound : "Code-barre inconnu!",
            msgBarcodeCheck : "Veuillez-lire le code-barre!",
            msgLimitQuantityCheck :"La quantité ne peut pas être supérieure à 9 999 !",
            msgQuantityCheck : "Impossible d'entrer un produit sans saisi de prix!",
            msgRowNotDelete : "Cette ligne a été convertie en facture ou en bon de livraison, vous ne pouvez pas la supprimer!",
            msgRowNotUpdate : "Étant donné que cette ligne provient de la facture ou du bon de livraison , le montant ne peut pas être modifié!",
            msgDiscount : "La remise ne peut pas être supérieure au montant!",
            msgNotSave : "Echec de l'enregistrement",
        },
        grdList : 
        {
            clmItemName : "Nom",
            clmQuantity :  "Quantité",
            clmPrice : "Prix",
            clmAmount : "Total",
            clmDiscount : "Remise",
            clmDiscountRate : "Remise %",
            clmVat : "TVA",
            clmTotal : "Total"
        },
        popDoc : 
        {
            title : "Choix du document",
            clmRef :  "Référence",
            clmRefNo : "Numéro de référence",
            clmDate : "Date",
            clmInputName : "Nom actuel",
            clmInputCode : "Code actuel",
        },
    },
    sip_02 : // "Commande d'achat"
    {
        lblRef : "Ligne-colonne :",
        lblDepot : "Dépôt:",
        lblCustomerCode : "Code client:",
        lblCustomerName : "Nom client:",
        lblDate : "Date :",
        lblDepotQuantity : "Quantité dépôt :",
        lblUnit : "Unité:",
        lblQuantity : "Quantité:",
        lblPrice : "Prix :",
        lblAmount : "Total :",
        lblDiscount : "Remise sur la ligne :",
        lblDocDiscount : "Remise sur le document :",
        lblTotalHt: "Sous total :",
        lblVat : "TVA:",
        lblSumAmount : "Montant total:",
        lblGenAmount : "Total:",
        lblAdd: "Ajouter",
        msgAlert :
        {
            btn01 : "D'accord",
            title : "Attention",
            msgDepot : "S'il vous plaît choissisez un dépôt!",
            msgCustomer : "S'il vous plaît choissisez un client!",
            msgProcess : "Aucun produit saisi actuellement!",
            msgBarcodeNotFound : "Code-barre inconnu!",
            msgBarcodeCheck : "Veuillez-lire le code-barre!",
            msgLimitQuantityCheck :"La quantité ne peut pas être supérieure à 9 999 !",
            msgQuantityCheck : "Impossible d'entrer un produit sans saisi de prix!",
            msgRowNotDelete : "Cette ligne a été convertie en facture ou en bon de livraison, vous ne pouvez pas la supprimer.!",
            msgRowNotUpdate : "Étant donné que cette ligne provient de la facture ou du bon de livraison , le montant ne peut pas être modifié!",
            msgDiscount : "La remise ne peut pas être supérieure au montant!",
            msgNotSave : "Echec de l'enregistrement",
        },
        grdList : 
        {
            clmItemName : "Nom",
            clmQuantity :  "Quantité",
            clmPrice : "Prix",
            clmAmount : "Total",
            clmDiscount : "Remise",
            clmDiscountRate : "Remise %",
            clmVat : "TVA",
            clmTotal : "Total"
        },
        popDoc : 
        {
            title : "Choix du document",
            clmRef :  "Référence",
            clmRefNo : "Numéro de référence",
            clmDate : "Date",
            clmOutputName : "Nom actuel",
            clmOutputCode : "Code actuel",
        },
    },
    sip_03 : // "Commande regroupée"
    {
        lblRef : "Ligne-colonne:",
        lblDepot : "Dépôt :",
        lblDate : "Date :",
        lblDepotQuantity : "Quantité dépôt :",
        lblUnit : "Unité:",
        lblQuantity : "Quantité:",
        lblPrice : "Prix :",
        lblAmount : "Total :",
        lblDiscount : "Remise sur la ligne :",
        lblDocDiscount : "Remise sur le document :",
        lblTotalHt: "Sous total :",
        lblVat : "TVA:",
        lblSumAmount : "Montant total:",
        lblGenAmount : "Total:",
        lblAdd: "Ajouter",
        msgAlert :
        {
            btn01 : "D'accord",
            title : "Attention",
            msgDepot : "S'il vous plaît choissisez un dépôt!",
            msgProcess : "Aucun produit saisi actuellement!",
            msgBarcodeNotFound : "Code-barre inconnu!",
            msgBarcodeCheck : "Veuillez-lire le code-barre!",
            msgLimitQuantityCheck :"La quantité ne peut pas être supérieure à 9 999 !",
            msgQuantityCheck : "Impossible d'entrer un produit sans saisi de prix!",
            msgRowNotDelete : "Cette ligne a été convertie en facture ou en bon de livraison, vous ne pouvez pas la supprimer.!",
            msgRowNotUpdate : "Étant donné que cette ligne provient de la facture ou du bon de livraison , le montant ne peut pas être modifié!",
            msgDiscount : "La remise ne peut pas être supérieure au montant!",
            msgNotSave : "Echec de l'enregistrement",
        },
        grdList : 
        {
            clmItemName : "Nom",
            clmQuantity :  "Quantité",
            clmPrice : "Prix",
            clmAmount : "Total",
            clmDiscount : "Remise",
            clmDiscountRate : "Remise %",
            clmVat : "TVA",
            clmTotal : "Total"
        },
        popDoc : 
        {
            title : "Choix du document",
            clmRef :  "Référence",
            clmRefNo : "Numéro de référence",
            clmDate : "Date",
            clmInputName : "Nom dépôt",
            clmInputCode : "Code dépôt",
        },
    },
    sip_04 : // "Commande de vente POS"
    {
        lblRef : "Ligne-colonne:",
        lblDepot : "Dépôt:",
        lblCustomerCode : "Code client :",
        lblCustomerName : "Nom client :",
        lblDate : "Date :",
        lblDepotQuantity : "Quantité dépôt :",
        lblUnit : "Unité:",
        lblQuantity : "Quantité:",
        lblPrice : "Prix :",
        lblAmount : "Total :",
        lblDiscount : "Remise sur la ligne :",
        lblDocDiscount : "Remise sur le document :",
        lblTotalHt: "Sous total :",
        lblVat : "TVA:",
        lblSumAmount : "Montant total:",
        lblGenAmount : "Total:",
        lblAdd: "Ajouter",
        msgAlert :
        {
            btn01 : "D'accord",
            title : "Attention",
            msgDepot : "S'il vous plaît choissisez un dépôt!",
            msgCustomer : "S'il vous plaît choissisez un client!",
            msgProcess : "Aucun produit saisi actuellement!",
            msgBarcodeNotFound : "Code-barre inconnu!",
            msgBarcodeCheck : "Veuillez-lire le code-barre!",
            msgLimitQuantityCheck :"La quantité ne peut pas être supérieure à 9 999 !",
            msgQuantityCheck : "Impossible d'entrer un produit sans saisi de prix!",
            msgRowNotDelete : "Cette ligne a été convertie en facture ou en bon de livraison, vous ne pouvez pas la supprimer.!",
            msgRowNotUpdate : "Étant donné que cette ligne provient de la facture ou du bon de livraison , le montant ne peut pas être modifié!",
            msgDiscount : "La remise ne peut pas être supérieure au montant!",
            msgNotSave : "Echec de l'enregistrement",
        },
        grdList : 
        {
            clmItemName : "Nom",
            clmQuantity :  "Quantité",
            clmPrice : "Prix",
            clmAmount : "Total",
            clmDiscount : "Remise",
            clmDiscountRate : "Remise %",
            clmVat : "TVA",
            clmTotal : "Total"
        },
        popDoc : 
        {
            title : "Choix du document",
            clmRef :  "Référence",
            clmRefNo : "Numéro de référence",
            clmDate : "Date",
            clmInputName : "Nom actuel",
            clmInputCode : "Code actuel",
        },
    },
    dep_01 : // "Transfert entre les dépôts"
    {
        lblRef : "Ligne-colonne:",
        lblDepot1 : "Dépôt de sortie:",
        lblDepot2 : "Dépôt d'entrée:",
        lblDate : "Date :",
        lblDepotQuantity : "Quantité dépôt :",
        lblUnit : "Unité:",
        lblQuantity : "Quantité :",
        lblPrice : "Prix :",
        lblAmount : "Total :",
        lblDiscount : "Remise sur la ligne :",
        lblDocDiscount : "Remise sur le document :",
        lblTotalHt: "Sous total :",
        lblVat : "TVA:",
        lblSumAmount : "Montant total:",
        lblGenAmount : "Total:",
        lblAdd: "Ajouter",
        msgAlert :
        {
            btn01 : "D'accord",
            title : "Attention",
            msgOutDepot : "S'il vous plaît choissisez le dépôt de sortie !",
            msgInDepot : "S'il vous plaît choissisez le dépôt d'entrée!",
            msgProcess : "Aucun produit saisi actuellement!",
            msgBarcodeNotFound : "Code-barre inconnu!",
            msgBarcodeCheck : "Veuillez-lire le code-barre!",
            msgLimitQuantityCheck :"La quantité ne peut pas être supérieure à 9 999 !",
            msgQuantityCheck : "Impossible d'entrer un produit sans saisi de prix!",
            msgRowNotDelete : "Cette ligne a été convertie en facture ou en bon de livraison, vous ne pouvez pas la supprimer!",
            msgRowNotUpdate : "Étant donné que cette ligne provient de la facture ou du bon de livraison , le montant ne peut pas être modifié!",
            msgDiscount : "La remise ne peut pas être supérieure au montant!",
            msgNotSave : "Echec de l'enregistrement",
        },
        grdList : 
        {
            clmItemName : "Nom",
            clmQuantity :  "Quantité",
            clmPrice : "Prix",
            clmAmount : "Total",
            clmDiscount : "Remise",
            clmDiscountRate : "Remise %",
            clmVat : "TVA",
            clmTotal : "Total"
        },
        popDoc : 
        {
            title : "Choix du document",
            clmRef :  "Référence",
            clmRefNo : "Numéro de référence",
            clmDate : "Date",
            clmInputName : "Nom dépôt",
            clmInputCode : "Code dépôt",
        },
    },
    irs_01 : // "Bon d'achat"
    {
        lblRef : "Ligne-colonne:",
        lblDepot : "Dépôt :",
        lblCustomerCode : "Code client :",
        lblCustomerName : "Nom client :",
        lblDate : "Date :",
        lblDepotQuantity : "Quantité dépôt :",
        lblUnit : "Unité:",
        lblQuantity : "Quantité:",
        lblPrice : "Prix :",
        lblAmount : "Total :",
        lblDiscount : "Remise sur la ligne :",
        lblDocDiscount : "Remise sur le document :",
        lblTotalHt: "Sous total :",
        lblVat : "TVA:",
        lblSumAmount : "Montant total:",
        lblGenAmount : "Total:",
        lblAdd: "Ajouter",
        msgAlert :
        {
            btn01 : "D'accord",
            title : "Attention",
            msgDepot : "S'il vous plaît choissisez un dépôt!",
            msgCustomer : "S'il vous plaît choissisez un client!",
            msgProcess : "Aucun produit saisi actuellement!",
            msgBarcodeNotFound : "Code-barre inconnu!",
            msgBarcodeCheck : "Veuillez-lire le code-barre!",
            msgLimitQuantityCheck :"La quantité ne peut pas être supérieure à 9 999 !",
            msgQuantityCheck : "Impossible d'entrer un produit sans saisi de prix!",
            msgRowNotDelete : "Cette ligne a été convertie en facture, vous ne pouvez pas la supprimer!",
            msgRowNotUpdate : "Le montant ne peut pas être modifié car cette ligne figure sur la facture!",
            msgDiscount : "La remise ne peut pas être supérieure au montant!",
            msgNotSave : "Echec de l'enregistrement",
        },
        grdList : 
        {
            clmItemName : "Nom",
            clmQuantity :  "Quantité",
            clmPrice : "Prix",
            clmAmount : "Total",
            clmDiscount : "Remise",
            clmDiscountRate : "Remise %",
            clmVat : "TVA",
            clmTotal : "Total"
        },
        popDoc : 
        {
            title : "Choix du document",
            clmRef :  "Référence",
            clmRefNo : "Numéro de référence",
            clmDate : "Date",
            clmOutputName : "Nom actuel",
            clmOutputCode : "Code actuel",
        },
    },
    irs_02 : // "Bon de vente"
    {
        lblRef : "Ligne-colonne:",
        lblDepot : "Dépôt :",
        lblCustomerCode : "Code client :",
        lblCustomerName : "Nom client:",
        lblDate : "Date :",
        lblDepotQuantity : "Quantité dépôt :",
        lblUnit : "Unité:",
        lblQuantity : "Quantité:",
        lblPrice : "Prix :",
        lblAmount : "Total :",
        lblDiscount : "Remise sur la ligne :",
        lblDocDiscount : "Remise sur le document :",
        lblTotalHt: "Sous total :",
        lblVat : "TVA:",
        lblSumAmount : "Montant total:",
        lblGenAmount : "Total:",
        lblAdd: "Ajouter",
        msgAlert :
        {
            btn01 : "D'accord",
            title : "Attention",
            msgDepot : "S'il vous plaît choissisez un dépôt!",
            msgCustomer : "Sil vous plaît choissisez un client!",
            msgProcess : "Aucun produit saisi actuellement!",
            msgBarcodeNotFound : "Code-barre inconnu!",
            msgBarcodeCheck : "Veuillez-lire le code-barre!",
            msgLimitQuantityCheck :"La quantité ne peut pas être supérieure à 9 999 !",
            msgQuantityCheck : "Impossible d'entrer un produit sans saisi de prix!",
            msgRowNotDelete : "Cette ligne a été convertie en facture, vous ne pouvez pas la supprimer!",
            msgRowNotUpdate : "Le montant ne peut pas être modifié car cette ligne figure sur la facture!",
            msgDiscount : "La remise ne peut pas être supérieure au montant!",
            msgNotSave : "Echec de l'enregistrement",
        },
        grdList : 
        {
            clmItemName : "Nom",
            clmQuantity :  "Quantité",
            clmPrice : "Prix",
            clmAmount : "Total",
            clmDiscount : "Remise",
            clmDiscountRate : "Remise %",
            clmVat : "TVA",
            clmTotal : "Total"
        },
        popDoc : 
        {
            title : "Choix du document",
            clmRef :  "Référence",
            clmRefNo : "Numéro de référence",
            clmDate : "Date",
            clmInputName : "Nom actuel",
            clmInputCode : "Code actuel",
        },
    },
    irs_03 : // "Bon de vente"
    {
        lblRef : "Ligne-colonne:",
        lblDepot : "Dépôt :",
        lblCustomerCode : "Code client :",
        lblCustomerName : "Nom client :",
        lblDate : "Date :",
        lblDepotQuantity : "Quantité dépôt :",
        lblUnit : "Unité:",
        lblQuantity : "Quantité:",
        lblPrice : "Prix :",
        lblAmount : "Total :",
        lblDiscount : "Remise sur la ligne :",
        lblDocDiscount : "Remise sur le document :",
        lblTotalHt: "Sous total :",
        lblVat : "TVA:",
        lblSumAmount : "Montant total:",
        lblGenAmount : "Total:",
        lblAdd: "Ajouter",
        msgAlert :
        {
            btn01 : "D'accord",
            title : "Attention",
            msgDepot : "S'il vous plaît choissisez un dépôt!",
            msgCustomer : "S'il vous plaît choissisez un client!",
            msgProcess : "Aucun produit saisi actuellement!",
            msgBarcodeNotFound : "Code-barre inconnu!",
            msgBarcodeCheck : "Veuillez-lire le code-barre!",
            msgLimitQuantityCheck :"La quantité ne peut pas être supérieure à 9 999 !",
            msgQuantityCheck : "Impossible d'entrer un produit sans saisi de prix!",
            msgRowNotDelete : "Cette ligne a été convertie en facture, vous ne pouvez pas la supprimer !",
            msgRowNotUpdate : "Le montant ne peut pas être modifié car cette ligne figure sur la facture!",
            msgDiscount : "La remise ne peut pas être supérieure au montant!",
            msgNotSave : "Echec de l'enregistrement",
        },
        grdList : 
        {
            clmItemName : "Nom",
            clmQuantity :  "Quantité",
            clmPrice : "Prix",
            clmAmount : "Total",
            clmDiscount : "Remise",
            clmDiscountRate : "Remise %",
            clmVat : "TVA",
            clmTotal : "Total"
        },
        popDoc : 
        {
            title : "Choix du document",
            clmRef :  "Référence",
            clmRefNo : "Numéro de référence",
            clmDate : "Date",
            clmInputName : "Nom actuel",
            clmInputCode : "Code actuel",
        },
    },
    irs_04 : // "Bon de retour"
    {
        lblRef : "Ligne-colonne:",
        lblDepot : "Dépôt :",
        lblCustomerCode : "Code client :",
        lblCustomerName : "Nom client :",
        lblDate : "Date :",
        lblDepotQuantity : "Quantité dépôt :",
        lblUnit : "Unité:",
        lblQuantity : "Quantité:",
        lblPrice : "Prix :",
        lblAmount : "Total :",
        lblDiscount : "Remise sur la ligne :",
        lblDocDiscount : "Remise sur le document :",
        lblTotalHt: "Sous total :",
        lblVat : "TVA:",
        lblSumAmount : "Montant total:",
        lblGenAmount : "Total:",
        lblAdd: "Ajouter",
        msgAlert :
        {
            btn01 : "D'accord",
            title : "Attention",
            msgDepot : "S'il vous plaît choissisez un dépôt!",
            msgCustomer : "S'il vous plaît choissisez un client!",
            msgProcess : "Aucun produit saisi actuellement!",
            msgBarcodeNotFound : "Code-barre inconnu!",
            msgBarcodeCheck : "Veuillez-lire le code-barre!",
            msgLimitQuantityCheck :"La quantité ne peut pas être supérieure à 9 999 !",
            msgQuantityCheck : "Impossible d'entrer un produit sans saisi de prix!",
            msgRowNotDelete : "Cette ligne a été convertie en facture, vous ne pouvez pas la supprimer !",
            msgRowNotUpdate : "Le montant ne peut pas être modifié car cette ligne figure sur la facture!",
            msgDiscount : "La remise ne peut pas être supérieure au montant!",
            msgNotSave : "Echec de l'enregistrement",
        },
        grdList : 
        {
            clmItemName : "Nom",
            clmQuantity :  "Quantité",
            clmPrice : "Prix",
            clmAmount : "Total",
            clmDiscount : "Remise",
            clmDiscountRate : "Remise %",
            clmVat : "TVA",
            clmTotal : "Total"
        },
        popDoc : 
        {
            title : "Choix du document",
            clmRef :  "Référence",
            clmRefNo : "Numéro de référence",
            clmDate : "Date",
            clmInputName : "Nom actuel",
            clmInputCode : "Code actuel",
        },
    },
}