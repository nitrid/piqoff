// Kayıp Ürün Çıkışı
const stk_02_003 = 
{
    txtRefRefno : "Réf. Réf No",
    cmbOutDepot: "Sortie Dépôt",
    dtDocDate : "Date",
    txtBarcode : "Ajouter Code Barre",
    getDispatch : "Recherche BL",
    txtTotalCost : "Coût Total",
    txtTotalQuantity: "Quantité Totale",
    pg_Docs : 
    {
        title : "Sélection Document",
        clmDate : "Date",
        clmRef : "Référence",
        clmRefNo : "Numéro",
        clmDocDate : "Date",
        clmInputName : "Entrée",
        clmOutputName : "Sortie",
    },
    pg_txtItemsCode : 
    {
        title : "Sélectionner Produit",
        clmCode :  "Référence Produit",
        clmName : "Nom Produit",
    },
    grdOutwasItems: 
    {
        clmItemCode: "Code",
        clmItemName: "Nom",
        clmQuantity : "Quantité",
        clmCreateDate: "Date d'Enregistrement",
        clmDescription :"Motif",
        clmCostPrice : "Prix de Revient" ,
        clmCuser : "Utilisateur",
    },
    pg_dispatchGrid : 
    {
        title : "Sélectionner Bon de Livraison" ,
        clmReferans : "Série - Réferences",
        clmCode : "Code",
        clmName : "Nom",
        clmQuantity : "Quantité",
        clmCuStomer : "Fournisseur",
        clmDate : "Date",
    },
    popPassword : 
    {
        title: "Veuillez Saisir MDP Administrateur pour Accéder au Document ",
        Password : "Mot de passe",
        btnApprove : "Valider"
    },
    msgGetLocked:
    {
        title: "Attention",
        btn01: "OK",
        msg: "Document Vérouillé !  \n  Veuillez Dévérouiller Pour Enregistrer les Modifications !"
    },
    msgDocLocked:
    {
        title: "Attention",
        btn01: "OK",
        msg: "Vous ne Pouvez Enregistrer sans Dévérouiller !"
    },
    msgDocValid:
    {
        title: "Attention",
        btn01: "OK",
        msg: "Veuillez saisir les en-têtes avant l'achèvement !"
    },
    msgEmpDescription:
    {
        title: "Attention",
        btn01: "OK",
        msg: "Information ligne ne peux pas être vide !"
    },
    msgSave:
    {
        title: "Attention",
        btn01: "OK",
        btn02: "Abandonner",
        msg: "Êtes-vous sûr(e) de vouloir Enregistrer!"
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
        msg: "Veuillez saisir les champs nécessaires !"
    },
    msgDelete:
    {
        title: "Attention",
        btn01: "OK",
        btn02: "Abandonner",
        msg: "Êtes-vous sûr(e) de vouloir supprimer l'enregistrement ?"
    },
    msgLocked:
    {
        title: "Attention",
        btn01: "OK",
        msg: "Document Enregistré et Vérouillé !"
    },
    msgPasswordSucces:
    {
        title: "Succès",
        btn01: "OK",
        msg: "Document Déverouillé !",
    },
    msgPasswordWrong:
    {
        title: "Echec",
        btn01: "OK",
        msg: "Mot de Passe Erroné"
    },
    msgGetLocked:
    {
        title: "Attention",
        btn01: "OK",
        msg: "Document Vérouillé !  \n  Veuillez Dévérouillez Pour Enregistrer les Modifications !"
    },
    msgDoclocked:
    {
        title: "Attention",
        btn01: "OK",
        msg: "Vous ne Pouvez Enregistrer Sans Dévérouiller !"
    },
    msgItemNotFound:
    {
        title: "Attention",
        btn01: "OK",
        msg: "Produit Introuvable !!"
    },
    msgCombineItem:
    {
        title: "Attention",
        btn01: "Regrouper",
        btn02: "Nouvel Ajout",
        msg: "Produit Existant dans le Document ! Voulez-vous Combiner ?"
    },
    validRef :"Saisir Réf ",
    validRefNo : "Saisir Réf No ",
    validDepot : "Sélectionner Dépôt",
    validCustomerCode : "Le code fournisseur-client ne peut être vide",
    validDocDate : "Sélectionner Date" ,
    pg_quickDesc : 
    {
        title : "Sélection Touche Rapide" ,
        clmDesc: "Motif" 
    },
    popQDescAdd : 
    {
        title : "Ajoute Saisie Rapide" ,
        description : "Nouvelle Saisie" ,
        btnApprove : "Enregistrer"        
    },
    popDesign : 
    {
        title: "Choix du Design",
        design : "Design" ,
        lang : "Langue Document" 
    },
    msgNotQuantity: 
    {
        title: "Attention",
        btn01: "Ok",
        msg: "La quantité présent au dépôt ne peut être négative ! Quantité existante:"
    },
    pg_txtBarcode : 
    {
        title : "Sélectionner Code Barre",
        clmCode :  "Référence Produit",
        clmName : "Nom Produit",
        clmMulticode : "Référence Fournisseur",
        clmBarcode : "Code Barre"
    },
    msgCode : 
    {
        title: "Attention",
        btn01: "Aller au document",
        msg: "Document trouvé !"
    },
    msgQuantity:
    {
        title: "Attention",
        btn01: "Ajouter",
        btn02: "Abandonner",
        msg: "Veuillez Saisir la Quantité !" ,
    },
    txtQuantity :"Quantité",
}
export default stk_02_003