export const prm = 
[
    //Personel Açıklama
    {
        TYPE : 0,
        ID :"popPersonTrackDesc",
        VALUE : 
        {
            disable:false,
            minCharSize:10,
            buttons:
            [
                {
                    id:"btn01",
                    title:"J'ai commencé mon travail.",
                    text:"J'ai commencé mon travail."
                },
                {
                    id:"btn02",
                    title:"J'ai pris une pause.",
                    text:"J'ai pris une pause."
                },
                {
                    id:"btn03",
                    title:"Je suis revenu de ma pause.",
                    text:"Je suis revenu de ma pause."
                },
                {
                    id:"btn04",
                    title:"Ma journée de travail est terminée.",
                    text:"Ma journée de travail est terminée."
                },
                {
                    id:"btn05",
                    title:"Description vide.",
                    text:"Description non saisie."
                },
                {
                    id:"btn06",
                    title:"Description vide.",
                    text:"Description non saisie."
                },
                {
                    id:"btn07",
                    title:"Description vide.",
                    text:"Description non saisie."
                },
                {
                    id:"btn08",
                    title:"Description vide.",
                    text:"Description non saisie."
                },
                {
                    id:"btn09",
                    title:"Description vide.",
                    text:"Description non saisie."
                },
                {
                    id:"btn10",
                    title:"Description vide.",
                    text:"Description non saisie."
                },
                {
                    id:"btn11",
                    title:"Description vide.",
                    text:"Description non saisie."
                },
                {
                    id:"btn12",
                    title:"Description vide.",
                    text:"Description non saisie."
                }
            ]
        },
        SPECIAL : "",
        PAGE : "pos",
        ELEMENT : "",
        APP : "POS",
        VIEW : 
        {
            TYPE : "popInput",
            PAGE_NAME : "Pos",
            CAPTION : "Personel Açıklama",
            DISPLAY : "disable",
            FORM: 
            {
                width:"400",
                height:"280",
                colCount:1,
                item:
                [
                    {type:"checkbox",caption:"Pasif",field:"disable",id:"chkPersonTrackDescriptionDisable"},
                    {type:"text",caption:"Min.Karakter",field:"minCharSize",id:"txtPersonTrackDescriptionMinChar"},
                    {type:"popObjectList",caption:"Açıklama",field:"buttons",id:"lstPersonTrackDescriptionDesc",
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