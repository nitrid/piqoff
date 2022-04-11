export const prm =
[
    //#region Pos
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
    //İade Açıklama
    {
        TYPE : 0,
        ID :"RebateDescription",
        VALUE : true,
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
        VALUE : true,
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
        VALUE : true,
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
        VALUE : true,
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
    //LCD Port
    {
        TYPE : 0,
        ID :"LCDPort",
        VALUE : "COM4",
        SPECIAL : "001",
        PAGE : "pos",
        ELEMENT : "",
        APP : "POS",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Pos",
            CAPTION : "LCD Port"
        }
    },
    //Scale Port
    {
        TYPE : 0,
        ID :"ScalePort",
        VALUE : "COM2",
        SPECIAL : "001",
        PAGE : "pos",
        ELEMENT : "",
        APP : "POS",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Pos",
            CAPTION : "Terazi Port"
        }
    },
    //PayCard Port
    {
        TYPE : 0,
        ID :"PayCardPort",
        VALUE : "COM6",
        SPECIAL : "001",
        PAGE : "pos",
        ELEMENT : "",
        APP : "POS",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Pos",
            CAPTION : "K.Kart Port"
        }
    }
    //#endregion
]