export const prm =
[
// Merkez kasa 
{
    TYPE : 1,
    ID :"SafeCenter",
    VALUE : "FB529408-4AE5-4B34-9262-7956E3477F47",
    SPECIAL : "",
    PAGE : "pos_03_001",
    ELEMENT : "",
    APP : "OFF",
    VIEW : 
    {
        TYPE : "combobox",
        PAGE_NAME : "Pos",
        CAPTION : "Merkez Kasa",
        DISPLAY : "NAME",
        FIELD : "GUID",
        DATA :
        {
            select:
            {
                query : "SELECT GUID,CODE,NAME FROM SAFE WHERE TYPE = 0 AND STATUS = 1 AND DELETED = 1 ORDER BY CODE ASC"
            },
        }
    }
},
// Kredi Kartı kasa 
{
    TYPE : 1,
    ID :"BankSafe",
    VALUE : "3848A862-D4FF-4BAD-9AB1-C1A29D9BC7F3",
    SPECIAL : "",
    PAGE : "pos_03_001",
    ELEMENT : "",
    APP : "OFF",
    VIEW : 
    {
        TYPE : "combobox",
        PAGE_NAME : "Pos",
        CAPTION : "Kredi Kartı Kasası",
        DISPLAY : "NAME",
        FIELD : "GUID",
        DATA :
        {
            select:
            {
                query : "SELECT GUID,CODE,NAME FROM SAFE WHERE TYPE = 0 AND STATUS = 1 AND DELETED = 1 ORDER BY CODE ASC"
            },
        }
    }
},
// Ticket Restorant Kasası kasa 
{
    TYPE : 1,
    ID :"TicketRestSafe",
    VALUE : "3848A862-D4FF-4BAD-9AB1-C1A29D9BC7F3",
    SPECIAL : "",
    PAGE : "pos_03_001",
    ELEMENT : "",
    APP : "OFF",
    VIEW : 
    {
        TYPE : "combobox",
        PAGE_NAME : "Pos",
        CAPTION : "Ticket Restorant Kasası",
        DISPLAY : "NAME",
        FIELD : "GUID",
        DATA :
        {
            select:
            {
                query : "SELECT GUID,CODE,NAME FROM SAFE WHERE TYPE = 0 AND STATUS = 1 AND DELETED = 1 ORDER BY CODE ASC"
            },
        }
    }
},
// Çek Kasası 
{
    TYPE : 1,
    ID :"CheckSafe",
    VALUE : "3848A862-D4FF-4BAD-9AB1-C1A29D9BC7F3",
    SPECIAL : "",
    PAGE : "pos_03_001",
    ELEMENT : "",
    APP : "OFF",
    VIEW : 
    {
        TYPE : "combobox",
        PAGE_NAME : "Pos",
        CAPTION : "Çek Kasası",
        DISPLAY : "NAME",
        FIELD : "GUID",
        DATA :
        {
            select:
            {
                query : "SELECT GUID,CODE,NAME FROM SAFE WHERE TYPE = 1 AND STATUS = 1 AND DELETED = 1 ORDER BY CODE ASC"
            },
        }
    }
},
]