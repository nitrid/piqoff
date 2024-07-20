export const acs =
[
    //#region Stok Tanıtım
    //numPrice
    {
        TYPE : 2,
        ID :"numPrice",
        VALUE : {visible:false,editable:false},
        SPECIAL : "",
        PAGE : "stk_01_002",
        ELEMENT : "numPrice",
        APP : "MOB",
        VIEW : 
        {
            TYPE : "popInput",
            PAGE_NAME : "Etiket Basım",
            CAPTION : "Fiyat",
            DISPLAY : "visible",
            FORM: 
            {
                width:"400",
                height:"180",
                item:
                [
                    {type:"checkbox",caption:"Visible",field:"visible",id:"chkPopNumPriceVisible"},
                    {type:"checkbox",caption:"Editable",field:"editable",id:"chkPopNumPriceEditable"}
                ]
            }
        }
    },
    //#endregion
]