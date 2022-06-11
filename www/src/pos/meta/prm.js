export const prm =
[
    //#region Pos
    //Para Sembolu
    {
        TYPE : 0,
        ID :"MoneySymbol",
        VALUE : {code:"EUR",sign:"€"},
        SPECIAL : "",
        PAGE : "pos",
        ELEMENT : "",
        APP : "POS",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Pos",
            CAPTION : "Para Sembolü"
        }
    },
    //BarcodePattern
    {
        TYPE : 0,
        ID :"BarcodePattern",
        VALUE : 
        [
            '20NNNNMMMCCF',
            '29NNNNMMMCCF',
            '29NNNNNMMMCCF',
            '020NNNNMMMCCF',
        ],
        SPECIAL : "",
        PAGE : "pos",
        ELEMENT : "",
        APP : "POS",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Pos",
            CAPTION : "Barkod Desenleri"
        }
    },
    //Ticket Rest. Sadakat Puan Kullanımı
    {
        TYPE : 0,
        ID :"UseTicketRestLoyalty",
        VALUE : 0, //0: Kullanamaz. 1: Kullanılır Puan İşlemez. 2: Kullanılır 
        SPECIAL : "",
        PAGE : "pos",
        ELEMENT : "",
        APP : "POS",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Pos",
            CAPTION : "Ticket Rest. Puan Kullanımı"
        }
    },
    //Ticket Rest. Kullanım Süresi
    {
        TYPE : 0,
        ID :"UseTicketRest",
        VALUE : 0, //Ticket Geçerlilik Süresi 
        SPECIAL : "",
        PAGE : "pos",
        ELEMENT : "",
        APP : "POS",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Pos",
            CAPTION : "Ticket Rest. Süresi"
        }
    },
    //Fiyat Açıklama
    {
        TYPE : 0,
        ID :"PriceDescription",
        VALUE : 
        {
            disable:false,
            minCharSize:5,
            buttons:
            [
                {
                    id:"btn01",
                    title:"Ürün Barkodu Çift Okutulmuş",
                    text:"Ürün Barkodu Çift Okutulmuş"
                },
                {
                    id:"btn02",
                    title:"Ürün Arızalı Yada Defolu",
                    text:"Ürün Arızalı Yada Defolu"
                },
                {
                    id:"btn03",
                    title:"Müşteri Ürünü Beğenmedi",
                    text:"Müşteri Ürünü Beğenmedi"
                },
                {
                    id:"btn04",
                    title:"Müşteri Yanlış Ürünü Aldı",
                    text:"Müşteri Yanlış Ürünü Aldı"
                },
                {
                    id:"btn05",
                    title:"Boş",
                    text:"Detaylı açıklama alanı"
                },
                {
                    id:"btn06",
                    title:"Boş",
                    text:"Detaylı açıklama alanı"
                },
                {
                    id:"btn07",
                    title:"Boş",
                    text:"Detaylı açıklama alanı"
                },
                {
                    id:"btn08",
                    title:"Boş",
                    text:"Detaylı açıklama alanı"
                },
                {
                    id:"btn09",
                    title:"Boş",
                    text:"Detaylı açıklama alanı"
                },
                {
                    id:"btn10",
                    title:"Boş",
                    text:"Detaylı açıklama alanı"
                },
                {
                    id:"btn11",
                    title:"Boş",
                    text:"Detaylı açıklama alanı"
                },
                {
                    id:"btn12",
                    title:"Boş",
                    text:"Detaylı açıklama alanı"
                }
            ]
        },
        SPECIAL : "",
        PAGE : "pos",
        ELEMENT : "",
        APP : "POS",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Pos",
            CAPTION : "İade Açıklama"
        }
    },
    //İade Açıklama
    {
        TYPE : 0,
        ID :"RebateDescription",
        VALUE : 
        {
            disable:false,
            minCharSize:25,
            buttons:
            [
                {
                    id:"btn01",
                    title:"Ürün Barkodu Çift Okutulmuş",
                    text:"Ürün Barkodu Çift Okutulmuş"
                },
                {
                    id:"btn02",
                    title:"Ürün Arızalı Yada Defolu",
                    text:"Ürün Arızalı Yada Defolu"
                },
                {
                    id:"btn03",
                    title:"Müşteri Ürünü Beğenmedi",
                    text:"Müşteri Ürünü Beğenmedi"
                },
                {
                    id:"btn04",
                    title:"Müşteri Yanlış Ürünü Aldı",
                    text:"Müşteri Yanlış Ürünü Aldı"
                },
                {
                    id:"btn05",
                    title:"Boş",
                    text:"Detaylı açıklama alanı"
                },
                {
                    id:"btn06",
                    title:"Boş",
                    text:"Detaylı açıklama alanı"
                },
                {
                    id:"btn07",
                    title:"Boş",
                    text:"Detaylı açıklama alanı"
                },
                {
                    id:"btn08",
                    title:"Boş",
                    text:"Detaylı açıklama alanı"
                },
                {
                    id:"btn09",
                    title:"Boş",
                    text:"Detaylı açıklama alanı"
                },
                {
                    id:"btn10",
                    title:"Boş",
                    text:"Detaylı açıklama alanı"
                },
                {
                    id:"btn11",
                    title:"Boş",
                    text:"Detaylı açıklama alanı"
                },
                {
                    id:"btn12",
                    title:"Boş",
                    text:"Detaylı açıklama alanı"
                }
            ]
        },
        SPECIAL : "",
        PAGE : "pos",
        ELEMENT : "",
        APP : "POS",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Pos",
            CAPTION : "İade Açıklama"
        }
    },
    //Evrak Sil Açıklama
    {
        TYPE : 0,
        ID :"DocDelDescription",
        VALUE : 
        {
            disable:false,
            minCharSize:25,
            buttons:
            [
                {
                    id:"btn01",
                    title:"Alış Verişten Vazgeçti",
                    text:"Alış Verişten Vazgeçti"
                },
                {
                    id:"btn02",
                    title:"Yetersiz Ödeme",
                    text:"Yetersiz Ödeme"
                },
                {
                    id:"btn03",
                    title:"K.Karti Yetersiz Bakiye",
                    text:"K.Karti Yetersiz Bakiye"
                },
                {
                    id:"btn04",
                    title:"Test Amaçlı",
                    text:"Test Amaçlı"
                },
                {
                    id:"btn05",
                    title:"Boş",
                    text:"Detaylı açıklama alanı"
                },
                {
                    id:"btn06",
                    title:"Boş",
                    text:"Detaylı açıklama alanı"
                },
                {
                    id:"btn07",
                    title:"Boş",
                    text:"Detaylı açıklama alanı"
                },
                {
                    id:"btn08",
                    title:"Boş",
                    text:"Detaylı açıklama alanı"
                },
                {
                    id:"btn09",
                    title:"Boş",
                    text:"Detaylı açıklama alanı"
                },
                {
                    id:"btn10",
                    title:"Boş",
                    text:"Detaylı açıklama alanı"
                },
                {
                    id:"btn11",
                    title:"Boş",
                    text:"Detaylı açıklama alanı"
                },
                {
                    id:"btn12",
                    title:"Boş",
                    text:"Detaylı açıklama alanı"
                }
            ]
        },
        SPECIAL : "",
        PAGE : "pos",
        ELEMENT : "",
        APP : "POS",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Pos",
            CAPTION : "Evrak Sil Açıklama"
        }
    },
    //Evrak Satır Sil Açıklama
    {
        TYPE : 0,
        ID :"DocRowDelDescription",
        VALUE : 
        {
            disable:false,
            minCharSize:25,
            buttons:
            [
                {
                    id:"btn01",
                    title:"Üründen Vazgeçti",
                    text:"Üründen Vazgeçti"
                },
                {
                    id:"btn02",
                    title:"Fiyat Hatalı",
                    text:"Fiyat Hatalı"
                },
                {
                    id:"btn03",
                    title:"Hatalı Ürün",
                    text:"Hatalı Ürün"
                },
                {
                    id:"btn04",
                    title:"Test Amaçlı Okutm",
                    text:"Test Amaçlı Okutma"
                },
                {
                    id:"btn05",
                    title:"Boş",
                    text:"Detaylı açıklama alanı"
                },
                {
                    id:"btn06",
                    title:"Boş",
                    text:"Detaylı açıklama alanı"
                },
                {
                    id:"btn07",
                    title:"Boş",
                    text:"Detaylı açıklama alanı"
                },
                {
                    id:"btn08",
                    title:"Boş",
                    text:"Detaylı açıklama alanı"
                },
                {
                    id:"btn09",
                    title:"Boş",
                    text:"Detaylı açıklama alanı"
                },
                {
                    id:"btn10",
                    title:"Boş",
                    text:"Detaylı açıklama alanı"
                },
                {
                    id:"btn11",
                    title:"Boş",
                    text:"Detaylı açıklama alanı"
                },
                {
                    id:"btn12",
                    title:"Boş",
                    text:"Detaylı açıklama alanı"
                }
            ]
        },
        SPECIAL : "",
        PAGE : "pos",
        ELEMENT : "",
        APP : "POS",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Pos",
            CAPTION : "Satır Sil Açıklama"
        }
    },
    //Park Açıklama
    {
        TYPE : 0,
        ID :"ParkDelDescription",
        VALUE : 
        {
            disable:false,
            minCharSize:25,
            buttons:
            [
                {
                    id:"btn01",
                    title:"Yetersiz Ödeme",
                    text:"Müşteri ödemesi gereken tutarı karşılayamadı terkrar gelecek."
                },
                {
                    id:"btn02",
                    title:"Ek Alış Veriş",
                    text:"Müşteri ek ürün almak için reyona gitti."
                },
                {
                    id:"btn03",
                    title:"Mağaza Personeli",
                    text:"Mağaza personeli ödemesini sonra yapacak."
                },
                {
                    id:"btn04",
                    title:"K.Kartı Geçmedi",
                    text:"K.Kartı geçmedi müştere ödemesini yapabilmesi için tekrar gelecek."
                },
                {
                    id:"btn05",
                    title:"Boş",
                    text:"Detaylı açıklama alanı"
                },
                {
                    id:"btn06",
                    title:"Boş",
                    text:"Detaylı açıklama alanı"
                },
                {
                    id:"btn07",
                    title:"Boş",
                    text:"Detaylı açıklama alanı"
                },
                {
                    id:"btn08",
                    title:"Boş",
                    text:"Detaylı açıklama alanı"
                },
                {
                    id:"btn09",
                    title:"Boş",
                    text:"Detaylı açıklama alanı"
                },
                {
                    id:"btn10",
                    title:"Boş",
                    text:"Detaylı açıklama alanı"
                },
                {
                    id:"btn11",
                    title:"Boş",
                    text:"Detaylı açıklama alanı"
                },
                {
                    id:"btn12",
                    title:"Boş",
                    text:"Detaylı açıklama alanı"
                }
            ]
        },
        SPECIAL : "",
        PAGE : "pos",
        ELEMENT : "",
        APP : "POS",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Pos",
            CAPTION : "Park Açıklama"
        }
    },
    //Açılış da Park Getir
    {
        TYPE : 0,
        ID :"OpeningPark",
        VALUE : true,
        SPECIAL : "",
        PAGE : "pos",
        ELEMENT : "",
        APP : "POS",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Pos",
            CAPTION : "Açılış Park Getir"
        }
    },
    //Miktar Düzenle
    {
        TYPE : 0,
        ID :"QuantityEdit",
        VALUE : true,
        SPECIAL : "",
        PAGE : "pos",
        ELEMENT : "",
        APP : "POS",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Pos",
            CAPTION : "Miktar Düzenle"
        }
    },
    //Fiyat Düzenle
    {
        TYPE : 0,
        ID :"PriceEdit",
        VALUE : true,
        SPECIAL : "",
        PAGE : "pos",
        ELEMENT : "",
        APP : "POS",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Pos",
            CAPTION : "Fiyat Düzenle"
        }
    },
    //Miktar Sıfır Kontrolü
    {
        TYPE : 0,
        ID :"QuantityCheckZero",
        VALUE : true,
        SPECIAL : "",
        PAGE : "pos",
        ELEMENT : "",
        APP : "POS",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Pos",
            CAPTION : "Sıfır Miktar Kontrolü"
        }
    },
    //Fiyat Sıfır Kontrolü
    {
        TYPE : 0,
        ID :"PriceCheckZero",
        VALUE : true,
        SPECIAL : "",
        PAGE : "pos",
        ELEMENT : "",
        APP : "POS",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Pos",
            CAPTION : "Sıfır Fiyat Kontrolü"
        }
    },
    //Min Fiyat Kontrolü
    {
        TYPE : 0,
        ID :"MinPriceCheck",
        VALUE : true,
        SPECIAL : "",
        PAGE : "pos",
        ELEMENT : "",
        APP : "POS",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Pos",
            CAPTION : "Min. Fiyat Kontrolü"
        }
    },
    //Maliyet Fiyat Kontrolü
    {
        TYPE : 0,
        ID :"CostPriceCheck",
        VALUE : true,
        SPECIAL : "",
        PAGE : "pos",
        ELEMENT : "",
        APP : "POS",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Pos",
            CAPTION : "Maliyet Fiyat Kontrolü"
        }
    },
    //Merkez Kasa
    {
        TYPE : 0,
        ID :"SafeCenter",
        VALUE : "df8b4f69-9e2d-449a-996a-0001abcf0308",
        SPECIAL : "",
        PAGE : "pos",
        ELEMENT : "",
        APP : "POS",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Pos",
            CAPTION : "Merkez Kasa"
        }
    }
    //#endregion
]