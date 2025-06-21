// Définitions des propriétés
const stk_01_018 = 
{
    txtCode : "Code de propriété",
    txtName : "Nom de propriété",
    txtDescription : "Description",
    txtType : "Type de propriété",
    txtValue : "Valeur",
    txtRequired : "Obligatoire",
    txtActive : "Actif",
    txtSortOrder : "Ordre de tri",
    
    // Types de propriétés
    typeText : "Texte",
    typeNumber : "Nombre",
    typeDate : "Date",
    typeBoolean : "Oui/Non",
    typeList : "Liste",
    typeColor : "Couleur",
    typeImage : "Image",
    
    // Titres de popup
    popPropertySelect : 
    {
        title : "Sélectionner la propriété",
        clmCode : "Code de propriété",
        clmName : "Nom de propriété",
        clmType : "Type"
    },
    
    // Messages
    msgSave : {
        title : "Opération de sauvegarde",
        msg : "Êtes-vous sûr de vouloir sauvegarder ?",
        btn01 : "Sauvegarder",
        btn02 : "Annuler"
    },
    msgDelete : {
        title : "Opération de suppression",
        msg : "Êtes-vous sûr de vouloir supprimer ?",
        btn01 : "Supprimer",
        btn02 : "Annuler"
    },
    msgError : {
        title : "Erreur",
        msg : "Une erreur s'est produite",
        btn01 : "OK"
    },
    msgSaveResult : {
        title : "Résultat de sauvegarde",
        msgSuccess : "Opération de sauvegarde terminée avec succès",
        msgError : "Une erreur s'est produite lors de l'opération de sauvegarde"
    },
    
    // Messages de validation
    validCode: "Le code de propriété ne peut pas être vide",
    validName: "Le nom de propriété ne peut pas être vide",
    validType: "Le type de propriété doit être sélectionné",
    validSortOrder: "L'ordre de tri doit être saisi",
    
    // Colonnes de grille
    grdPropertyList: 
    {
        clmCode: "Code",
        clmName: "Nom",
        clmType: "Type",
        clmRequired: "Obligatoire",
        clmActive: "Actif",
        clmSortOrder: "Ordre"
    }
}

export default stk_01_018 