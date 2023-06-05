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
            dtDocDate : "Date"
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
            title : "Evrak Seçimi",  // BAK
            btn01 : "Evrakları Getir",  // BAK
            btn02 : "Seç"   // BAK
        },
        cmbDocType : 
        {
            order :"Sipariş", // BAK
            invoice : "Fatura" // BAK
        },
        grdDocs : 
        {
            clmRef : "Seri",  // BAK
            clmRefNo : "Sıra",  // BAK
            clmInputName : "Müşteri",  // BAK
            clmDate : "Tarih",  // BAK
            clmTotal : "Tutar"  // BAK
        },
        popVatRate:
        {
            title : "Vergi Oranları", // BAK
        },
        grdVatRate :
        {
            clmRate : "Vergi Oranı", // BAK
            clmVat : "Vergi Tutarı", // BAK
            clmTotalHt : "Tutar", // BAK
        },
        btnVatToZero : "Vergiyi Sıfırla", // BAK
        btnCancel : "Kapat", // BAK
        popDiscount : 
        {
            title: "Satır İndirimi",  // BAK
            chkFirstDiscount : "Satırdaki 1. İndirimleri Güncelleme",  // BAK
            chkDocDiscount : "Evrak İndirimi Olarak Uygula",  // BAK
            Percent1 : "1. İnd. Yüzde",  // BAK
            Price1 : "1. İnd. Tutar",  // BAK
            Percent2 : "2. İnd. Yüzde",  // BAK
            Price2 : "2. İnd. Tutar",  // BAK
            Percent3 : "3. İnd. Yüzde",  // BAK
            Price3 : "3. İnd. Tutar"  // BAK
        },
        popDocDiscount : 
        {
            title: "Evrak İndirimi",  // BAK
            Percent1 : "1. İnd. Yüzde",  // BAK
            Price1 : "1. İnd. Tutar",  // BAK
            Percent2 : "2. İnd. Yüzde",  // BAK
            Price2 : "2. İnd. Tutar",  // BAK
            Percent3 : "3. İnd. Yüzde",  // BAK
            Price3 : "3. İnd. Tutar"  // BAK
        },
    },
    extract :
    {
        txtCustomerCode : "Lütfen Müşteri Seçiniz",  // BAK
        btnGet :"Getir",  // BAK
        grdListe : 
        {
            clmDocDate: "Tarih",   // BAK
            clmTypeName : "Evrak Tipi",              // BAK
            clmRef : "Evrak Seri",   // BAK
            clmRefNo : "Evrak Sıra",   // BAK
            clmDebit : "Borç",   // BAK
            clmReceive : "Alacak",   // BAK
            clmBalance : "Bakiye",   // BAK
        },
        txtTotalBalance : "Bakiye",  // BAK
        popCustomer:
        {
            title : "Müşteri Seçimi",  // BAK
            btn01 : "Ara",  // BAK
            btn02 : "Seç",  // BAK
            clmCode : "KODU",  // BAK
            clmName : "ADI"  // BAK
        },
        msgNotCustomer:
        {
            title: "Dikkat",// BAK
            btn01: "Tamam",// BAK
            msg: "Lütfen Müşteri Seçiniz..!"// BAK
        },
    },
    itemDetail :
    {
        txtItem : "Lütfen Ürün Seçiniz",  // BAK
        txtItemGroup : "Ürün Grubu",  // BAK
        txtItemPrice : "Fiyat",  // BAK
        grdListe : 
        {
           clmName : "Depo",  // BAK
           clmQuantity : "Miktar"  // BAK
        },
        popItem:
        {
            title : "Müşteri Seçimi",  // BAK
            btn01 : "Ara",  // BAK
            btn02 : "Seç",  // BAK
            clmCode : "KODU",  // BAK
            clmName : "ADI"  // BAK
        },
        msgNotItem:
        {
            title: "Dikkat",  // BAK
            btn01: "Tamam",  // BAK
            msg: "Lütfen Ürün Seçiniz..!"  // BAK
        },
    },
    dashboard: 
    {
        lastDocumant : "Son Sipariş",   // BAK
        mountSales : "Bu Ayki Sipariş Toplamı",   // BAK
        yearSales : "Bu Yılki Sipariş Toplamı",   // BAK
        sale : "Satış Tutarı"   // BAK
    }
}