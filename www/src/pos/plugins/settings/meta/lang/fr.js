const lang =
{
    posSettings :
    {
        posItemsList : "Produits",
        posSaleReport : "Rapport de Vente",
        posCustomerPointReport : "Rapport de Points Client",
        posTicketEndDescription : "Description de Fin de Ticket",
        posGroupSaleReport : "Rapport de Vente par Groupe",
        posCompanyInfo : "Informations sur l'Entreprise",
        btnExit : "Sortie",

    },
    posItemsList :
    {
        title : "Liste des Produits",
        btnItemSearch : "Rechercher",
        txtItemSearchPholder : "Entrez le nom ou le code du produit",
        grdItemList :
        {
            CODE : "Code Produit",
            NAME : "Nom Produit",
            VAT : "TVA"
        },
        popItemEdit :
        {
            title : "Nouveau Produit",
            txtRef : "Code Produit",
            txtName : "Nom Produit",
            cmbMainUnit : "Unité Principale",
            cmbUnderUnit : "Unité Secondaire",
            cmbItemGrp : "Groupe de Produits",
            cmbOrigin : "Origine",
            cmbTax : "Taxe",
            chkActive : "Actif",
            chkCaseWeighed : "Pesé à la Caisse",
            chkLineMerged : "Fusionner les Lignes",
            chkTicketRest : "Ticket Rest.",
            tabTitlePrice : "Prix",
            tabTitleUnit : "Unité",
            tabTitleBarcode : "Code-barres",
            msgItemValidation :
            {
                title : "Attention",
                btn01 : "OK",
                msg1 : "Le code produit ne peut pas être vide !",
                msg2 : "Le nom du produit ne peut pas être vide !",
            },
            msgPriceSave:
            {
                title: "Attention",
                btn01: "OK",
                msg: "Veuillez entrer un prix !"
            },
            msgNewItem :
            {
                title : "Attention",
                btn01 : "OK",
                btn02 : "Annuler",
                msg : "Êtes-vous sûr de vouloir créer un nouveau produit ?"
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
            msgDelete:
            {
                title: "Attention",
                btn01: "OK",
                btn02: "Annuler",
                msg: "Êtes-vous sûr de vouloir supprimer l'enregistrement ?"
            },
            msgNotDelete:
            {
                title: "Attention",
                btn01: "OK",
                msg: "Ce produit ne peut pas être supprimé car il est utilisé !"
            },
            msgItemExist:
            {
                title: "Attention",
                btn01: "Oui",
                btn02: "Non",
                msg: "Le produit que vous avez entré existe déjà. Voulez-vous aller au produit ?"
            },
            grdPrice :
            {
                clmStartDate : "Date Début",
                clmFinishDate : "Date Fin",
                clmQuantity : "Quantité",
                clmPrice : "Prix",
                clmPriceHT : "Hors Taxe",
                clmPriceTTC : "Prix TTC",
            },
            grdUnit :
            {
                clmType : "Type",
                clmName : "Nom",
                clmFactor : "Facteur",
            },
            grdBarcode :
            {
                clmBarcode : "Code-barres",
                clmUnit : "Unité",
                clmType : "Type",
            },
            cmbMainUnit : "Unité Principale",
            cmbUnderUnit : "Unité Secondaire",
            popPrice :
            {
                title : "Prix",
                dtPopPriStartDate : "Date Début",
                dtPopPriEndDate : "Date Fin",
                txtPopPriQuantity : "Quantité",
                txtPopPriPrice : "Prix",
                btnSave : "Enregistrer",
                btnCancel : "Annuler",
                msgCheckPrice:
                {
                    title: "Attention",
                    btn01: "OK",
                    msg: "Vous ne pouvez pas créer un enregistrement similaire !"
                },
                msgCostPriceValid:
                {
                    title: "Attention",
                    btn01: "OK",
                    msg: "Veuillez entrer un prix supérieur au prix d'achat !"
                },
                msgPriceAdd:
                {
                    title: "Attention",
                    btn01: "OK",
                    msg: "Veuillez remplir les champs requis !"
                },
                msgPriceEmpty :
                {
                    title: "Attention",
                    btn01: "OK",
                    msg: "Le champ prix ne peut pas être vide ou égal à zéro !"
                },
                msgPriceNotNumber :
                {
                    title: "Attention",
                    btn01: "OK",
                    msg: "Le champ prix doit être une valeur numérique !"
                },
                msgPriceQuantityEmpty :
                {
                    title: "Attention",
                    btn01: "OK",
                    msg: "Le champ quantité ne peut pas être vide ou égal à zéro !"
                },
                msgPriceQuantityNotNumber :
                {
                    title: "Attention",
                    btn01: "OK",
                    msg: "Le champ quantité doit être une valeur numérique !"
                }
            },
            popUnit :
            {
                title : "Unité",
                cmbPopUnitName : "Unité",
                txtPopUnitFactor : "Facteur",
                btnSave : "Enregistrer",
                btnCancel : "Annuler",
                msgUnitRowNotDelete :
                {
                    title: "Attention",
                    btn01: "OK",
                    msg: "Vous ne pouvez pas supprimer l'unité principale ou secondaire !"
                },
                msgUnitRowNotEdit :
                {
                    title: "Attention",
                    btn01: "OK",
                    msg: "Vous ne pouvez pas modifier l'unité principale ou secondaire !"
                },
                msgUnitFactorEmpty :
                {
                    title : "Attention",
                    btn01 : "OK",
                    msg : "Le champ facteur ne peut pas être vide ou égal à zéro !"
                },
                msgUnitFactorNotNumber :
                {
                    title : "Attention",
                    btn01 : "OK",
                    msg : "Le champ facteur doit être une valeur numérique !"
                }
            },
            popBarcode :
            {
                title : "Code-barres",
                txtPopBarcode : "Code-barres",
                cmbPopBarType : "Type",
                cmbPopBarUnitType : "Unité",
                btnSave : "Enregistrer",
                btnCancel : "Annuler",
                msgBarcodeExist :
                {
                    title : "Attention",
                    btn01 : "OK",
                    msg : "Ce code-barres existe déjà !"
                },
                msgBarcodeEmpty :
                {
                    title : "Attention",
                    btn01 : "OK",
                    msg : "Le champ code-barres ne peut pas être vide !"
                }
            },
            popAddItemGrp :
            {
                title : "Ajouter Groupe de Produits",
                txtAddItemGrpCode : "Code",
                txtAddItemGrpName : "Nom",
                btnSave : "Enregistrer",
                btnCancel : "Annuler",
                msgAddItemGrpEmpty :
                {
                    title : "Attention",
                    btn01 : "OK",
                    msg : "Veuillez remplir les champs requis !"
                },
                msgAddItemGrpExist :
                {
                    title : "Attention",
                    btn01 : "OK",
                    msg : "Ce code existe déjà !"
                },
                grpListPopup :
                {
                    msgGrpDelete :
                    {
                        title : "Attention",
                        btn02 : "Non",
                        btn01 : "Supprimer",
                        msg : "Êtes-vous sûr de vouloir supprimer l'enregistrement ?"
                    },
                    title : "Liste des Groupes de Produits",
                    grdGrpList :
                    {
                        clmCode : "Code",
                        clmName : "Nom",
                    }
                }
            }
        }
    },
    posSaleReport :
    {
        btnGet : "Obtenir",
        txtTotalTicket : "Nombre Total de Tickets",
        txtTicketAvg : "Montant Moyen du Ticket",
    },
    posCustomerPointReport :
    {
        txtCustomerCode : "Code Client",
        txtCustomerName : "Nom Client",
        txtAmount : "Montant Total",
        btnGet : "Obtenir",
        popCustomers :
        {
            title : "Sélection du Client",
            clmCode : "Code",
            clmTitle : "Nom",
            clmTypeName : "Type",
            clmGenusName : "Genre",
            btnSelectCustomer : "Sélectionner",
            btnCustomerSearch : "Rechercher",
        },
        grdCustomerPointReport :
        {
            clmCode: "Code",
            clmTitle: "Nom",
            clmPoint: "Points",
            clmLdate : "Dernière Mise à Jour",
            clmEur : "Euro"
        },
        popPointDetail :
        {
            title : "Détail des Points",
            clmDate : "Date",
            clmPosId : "Code Pos",
            clmPoint : "Points",
            clmDescription : "Description",
            exportFileName : "detail_points_client",
            btnAddPoint : "Ajouter Points",
        },
        popPointSaleDetail :
        {
            title : "Détail des Ventes par Points",
            TicketId : "Numéro de Ticket",
            clmBarcode : "Code-barres",
            clmName : "Nom Produit",
            clmQuantity : "Quantité",
            clmPrice : "Prix",
            clmTotal : "Total",
            clmPayName : "Type de Paiement",
            clmLineTotal : "Total",
            exportFileName : "detail_ventes_points_client",
        },
        popPointEntry :
        {
            title : "Entrée de Points",
            cmbPointType : "Type",
            cmbTypeData :
            {
                in : "Entrée",
                out : "Sortie",
            },
            txtPoint : "Points",
            txtPointAmount : "Montant des Points",
            txtDescription : "Description",
            descriptionPlace : "Entrez une description",
            btnAdd : "Ajouter",
            msgDescription :
            {
                title : "Attention",
                btn01 : "OK",
                msg : "La description doit comporter au moins 14 caractères !",
            },
            msgPointNotNumber :
            {
                title : "Attention",
                btn01 : "OK",
                msg : "Le champ points doit être une valeur numérique !",
            }
        }
    },
    posTicketEndDescription :
    {
        cmbFirm : "Entreprise",
        txtDescriptionPlaceHolder : "Entrez une description",
        msgSaveResult :
        {
            title : "Attention",
            btn01 : "OK",
            msgSuccess : "Enregistrement réussi !",
        }
    },
    posGrpSalesReport :
    {
        chkTicket : "Nombre de Tickets",
        txtTotalTicket : "Nombre Total de Tickets",
        txtTicketAvg : "Montant Moyen du Ticket",
        btnGet : "Obtenir",
        btnGetAnalysis : "Analyse",
        grdGroupSalesReport :
        {
            clmGrpCode : "Code",
            clmGrpName : "Nom",
            clmTicket : "Nombre de Tickets",
            clmQuantity : "Quantité",
            clmTotalCost : "Coût Total",
            clmFamount : "Hors Taxe",
            clmVat : "TVA",
            clmTotal : "Total",
            clmRestTotal : "Total Restant",
            exportFileName : "rapport_ventes_groupe",
        },
        grpGrpDetail :
        {
            title : "Détail du Groupe de Produits",
            clmCode : "Code",
            clmName : "Nom",
            clmQuantity : "Quantité",
            clmTotalCost : "Coût Total",
            clmFamount : "Hors Taxe",
            clmVat : "TVA",
            clmTotal : "Total",
            clmRestTotal : "Total Restant",
            exportFileName : "detail_groupe_produits",
        },
        popAnalysis :
        {
            title : "Analyse",
        }
    },
    posCompanyInfo :
    {
        validation :
        {
            notValid : "Veuillez remplir les champs requis !",
        },
        txtTitle : "Nom de l'Entreprise",
        txtBrandName : "Nom de la Marque",
        txtCustomerName : "Nom du Responsable",
        txtCustomerLastname : "Prénom du Responsable",
        txtAddress : "Adresse",
        txtCountry : "Pays",
        txtZipCode : "Code Postal",
        txtCity : "Ville",
        txtPhone : "Téléphone",
        txtFax : "Fax",
        txtEmail : "Email",
        txtWeb : "Site Web",
        txtApeCode : "Code Ape",
        txtRSC : "RSC",
        txtTaxOffice : "Bureau des Impôts",
        txtTaxNo : "Numéro de Taxe",
        txtIntVatNo : "Numéro de TVA",
        txtSirenNo : "Numéro Siren",
        txtSiretId : "Numéro Siret",
        msgSave :
        {
            title : "Attention",
            btn01 : "Oui",
            btn02 : "Non",
            msg : "Êtes-vous sûr de vouloir enregistrer ?",
        },
        msgSaveResult :
        {
            title : "Attention",
            btn01 : "OK",
            msgSuccess : "Enregistrement réussi !",
            msgFailed : "Échec de l'enregistrement !",
        },
        msgSaveValid :
        {
            title : "Attention",
            btn01 : "OK",
            msg : "Veuillez remplir les champs requis !",
        }
    },
    dtToday : "Aujourd'hui",
    tdLastDay : "Hier",
    dtThisWeek : "Cette Semaine",
    dtLastWeek : "Semaine Dernière",
    dtMount : "Ce Mois",
    dtLastMount : "Mois Dernier",
    dtYear : "Cette Année",
    dtLastYear : "Année Dernière",
    
}
export default lang