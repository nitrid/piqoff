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
        itemDetail : "Détail du produit",
        collection: "Encaissement",
        CustomerCard : "Fournisseur-Client saisie"
    },
    msgAnotherUserAlert: 
    {
        title : "Attention",
        msg : "Connexion avec vos informations d'utilisateur à partir d'un autre appareil.",
        btn01 : "D'accord"
    },
    msgDataTransfer: 
    {
        title : "Lütfen Bekleyiniz !", //BAK
        msg : "Verileriniz güncelleniyor..." //BAK,
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
            cmbPricingList : "Numéro de tarif"
        },
        itemPopup: // BAK
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
        msgMemRecord:
        {
            title: "Dikkat", //BAK
            btn01: "Tamam", //BAK
            msg: "Evrak a dönüşmemiş kayıtlarınız mevcut ! Lütfen işlemlerinizi kontrol ediniz." //BAK
        },
        msgNew:
        {
            title: "Dikkat", //BAK
            btn01: "Evet", //BAK
            btn02: "Hayır", //BAK
            msg: "Yeni evrak oluşturmak istediğinize eminmisiniz ?" //BAK
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
            title: "Dikkat",   // BAK
            btn01: "Evet",   // BAK
            btn02: "Hayır",   // BAK
            msg: "Faturanıza tahsilat girmek istermisiniz ?"   // BAK
        },
        grdLastSales : 
        {
            clmDocDate: "Tarih",  // BAK
            clmRef : "Evrak No",  // BAK
            clmQuantity : "Miktar",  // BAK
            clmPrice : "Fiyat",  // BAK
            clmTotal : "Tutar",  // BAK
        },
        msgDiscountPrice:
        {
            title: "Attention",
            btn01: "OK",
            msg: "Vous ne Pouvez Appliquer de Remise Supérieure au Montant Total !"
        },
        msgDiscountPercent:
        {
            title: "Attention",
            btn01: "OK",
            msg: "Vous ne Pouvez Appliquer de Remise Supérieure au Montant Total !"
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
        grdDetail : 
        {
            clmCode: "Kodu",  // BAK
            clmName : "Ürün Adı",  // BAK
            clmQuantity : "Miktar",  // BAK
            clmPrice : "Fiyat",  // BAK
            clmTotal : "Toplam",  // BAK
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
        sale : "Montant des ventes",        
    },
    collection:  // KOMPLE BAK
    {
        txtCustomer: "Müşteri",
        dtDocDate : "Tarih",
        btnCash: "Tahilat Girişi",
        txtTotal : "Toplam Tutar",
        cmbPayType : {
            title : "Ödeme Tipi",
            cash : "Nakit",
            check : "Çek",
            bankTransfer : "Hesaba Havale",
            otoTransfer : "Otomatik Ödeme",
            foodTicket : "Yemek Çeki",
            bill : "Senet",
        },
        grdDocPayments: 
        {
            clmCreateDate: "Kayıt Tarihi",
            clmAmount : "Tutar",
            clmInputName : "Kasa/Banka",
            clmDescription : "Açıklama",
            clmInvoice : "Ödenen Fatura",
            clmFacDate : "Fatura Tarihi "
        },
        popCash : 
        {
            title: "Tahsilat Girişi",
            btnApprove : "Ekle",
            cash : "Tutar",
            description : "Açıklama",
            btnCancel : "Vazgeç",
            cmbCashSafe: "Kasa/Banka",
            invoiceSelect : "Fatura Seçimi",
        },
        ValidCash : "0'dan büyük bir tutar giriniz",
        msgNew:
        {
            title: "Dikkat",
            btn01: "Evet",
            btn02: "Hayır",
            msg: "Yeni evrak oluşturmak istediğinize eminmisiniz ?"
        },
        msgSave:
        {
            title: "Dikkat",
            btn01: "Evet",
            btn02: "Vazgeç",
            msg: "Kayıt etmek istediğinize emin misiniz?"
        },
        msgSaveResult:
        {
            title: "Dikkat",
            btn01: "Tamam",
            msgSuccess: "Kayıt işleminiz başarılı !",
            msgFailed: "Kayıt işleminiz başarısız !"
        },
        msgDelete:
        {
            title: "Dikkat",
            btn01: "Tamam",
            btn02: "Vazgeç",
            msg: "Kaydı silmek istediğinize eminmisiniz ?"
        },
        pg_invoices : 
        {
            title : "Fatura Seçimi",
            clmReferans : "REFERANS",
            clmInputName : "CARİ ADI",
            clmDate : "TARIH",
            clmTotal : "TOPLAM",
            clmRemaining  : "KALAN",
        },
        popCustomer:
        {
            title : "Müşteri Seçimi",
            btn01 : "Ara",
            btn02 : "Seç",
            clmCode : "KODU",
            clmName : "ADI"
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
            clmCity :"Ville",
            clmCountry : "Pays",
        },
        grdLegal : 
        {
            clmSiretID : "Siret No",
            clmApeCode : "Code Ape",
            clmTaxOffice : "Impôt",
            clmTaxNo : "Numéro Impôt",
            clmIntVatNo : "No TVA inter.",
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
    },
}