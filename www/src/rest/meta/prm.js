export const prm =
[
    // Özel Not
    {
        TYPE : 0,
        ID :"SpecialNote",
        VALUE : 
        {
            disable:true,
            minCharSize:10,
            buttons:
            [
                {
                    id:"btn01",
                    title:"Garantie Cordo.",
                    text:"Garantie Cordo."
                },
                {
                    id:"btn02",
                    title:"Promo en cours",
                    text:"Promo en cours."
                },
                {
                    id:"btn03",
                    title:"Remise quantitative clés.",
                    text:"Remise quantitative clés."
                },
                {
                    id:"btn04",
                    title:"Remise quantitative autre.",
                    text:"Remise quantitative autre produit"
                },
                {
                    id:"btn05",
                    title:"Remise suite a incident.",
                    text:"Remise suite a incident."
                },
                {
                    id:"btn06",
                    title:"Produit endommagé.",
                    text:"Produit endommagé."
                },
                {
                    id:"btn07",
                    title:"Erreur tarif.",
                    text:"Erreur tarif."
                },
                {
                    id:"btn08",
                    title:"Offre ponctuelle.",
                    text:"Offre ponctuelle."
                },
                {
                    id:"btn09",
                    title:"Remise premiére sur complet.",
                    text:"Remise premiére sur complet."
                },
                {
                    id:"btn10",
                    title:"Remise billet à gratter.",
                    text:"Remise billet à gratter."
                },
                {
                    id:"btn11",
                    title:"Remise Facebook...",
                    text:"Remise Facebook Cordonnerie/Clés/Smartphones/Horlogerie/Pressing."
                },
                {
                    id:"btn12",
                    title:"Description non saisie.",
                    text:"Description non saisie."
                }
            ]
        },
        SPECIAL : "",
        PAGE : "bill.js",
        ELEMENT : "",
        APP : "REST",
        VIEW : 
        {
            TYPE : "popInput",
            PAGE_NAME : "Rest",
            CAPTION : "Özel Not",
            DISPLAY : "disable",
            FORM: 
            {
                width:"400",
                height:"280",
                colCount:1,
                item:
                [
                    {type:"checkbox",caption:"Pasif",field:"disable",id:"chkPopSpecialNoteDisable"},
                    {type:"text",caption:"Min.Karakter",field:"minCharSize",id:"txtPopSpecialNoteMinChar"},
                    {type:"popObjectList",caption:"Açıklama",field:"buttons",id:"lstPopSpecialNoteDesc",
                        form:
                        {
                            width:"800",
                            height:"600",
                            formWidth:"600",
                            formHeight:"260",
                            allowAdding : false,
                            allowUpdating : true,
                            allowDeleting : false
                        }
                    }
                ]
            }
        }
    },
]