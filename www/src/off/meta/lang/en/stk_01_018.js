// Property Definitions
const stk_01_018 = 
{
    txtCode : "Property Code",
    txtName : "Property Name",
    txtDescription : "Description",
    txtType : "Property Type",
    txtValue : "Value",
    txtRequired : "Required",
    txtActive : "Active",
    txtSortOrder : "Sort Order",
    
    // Property types
    typeText : "Text",
    typeNumber : "Number",
    typeDate : "Date",
    typeBoolean : "Yes/No",
    typeList : "List",
    typeColor : "Color",
    typeImage : "Image",
    
    // Popup titles
    popPropertySelect : 
    {
        title : "Select Property",
        clmCode : "Property Code",
        clmName : "Property Name",
        clmType : "Type"
    },
    
    // Messages
    msgSave : {
        title : "Save Operation",
        msg : "Are you sure you want to save?",
        btn01 : "Save",
        btn02 : "Cancel"
    },
    msgDelete : {
        title : "Delete Operation",
        msg : "Are you sure you want to delete?",
        btn01 : "Delete",
        btn02 : "Cancel"
    },
    msgError : {
        title : "Error",
        msg : "An error occurred",
        btn01 : "OK"
    },
    msgSaveResult : {
        title : "Save Result",
        msgSuccess : "Save operation completed successfully",
        msgError : "An error occurred during save operation"
    },
    
    // Validation messages
    validCode: "Property code cannot be empty",
    validName: "Property name cannot be empty",
    validType: "Property type must be selected",
    validSortOrder: "Sort order number must be entered",
    
    // Grid columns
    grdPropertyList: 
    {
        clmCode: "Code",
        clmName: "Name",
        clmType: "Type",
        clmRequired: "Required",
        clmActive: "Active",
        clmSortOrder: "Order"
    }
}

export default stk_01_018 