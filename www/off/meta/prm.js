export const prm =
[
    //#region Stok Tanıtım
    //txtRef
    {
        TYPE : 2,
        ID :"txtRef",
        VALUE : 
        {
            validation :
            {
                grp : "frmItems",
                val : 
                [
                    {
                        type : "required",
                        msg : "Referans'ı boş geçemezsiniz !"
                    }
                ]
            }
        },
        SPECIAL : "",
        PAGE : "stk_01_001",
        ELEMENT : "txtRef",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Stok Tanımları",
            CAPTION : "Referans"
        }
    },
    //txtUrunGrup
    {
        TYPE : 2,
        ID :"txtUrunGrup",
        VALUE : 
        {
            value : "",
            validation :
            {
                grp : "frmItems",
                val : 
                [
                    {
                        type : "required",
                        msg : "Ürün Grubu'nu boş geçemezsiniz !"
                    }
                ]
            }
        },
        SPECIAL : "",
        PAGE : "stk_01_001",
        ELEMENT : "txtUrunGrup",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Stok Tanımları",
            CAPTION : "Ürün Grup"
        }
    },
    //txtTedarikci
    {
        TYPE : 2,
        ID :"txtTedarikci",
        VALUE : 
        {
            value : "",
            validation :
            {
                grp : "frmItems",
                val : 
                [
                    {
                        type : "required",
                        msg : "Tedarikçi boş geçemezsiniz !"
                    }
                ]
            }
        },
        SPECIAL : "",
        PAGE : "stk_01_001",
        ELEMENT : "txtTedarikci",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Stok Tanımları",
            CAPTION : "Tedarikçi"
        }
    },
    //cmbUrunCins
    {
        TYPE : 2,
        ID :"cmbUrunCins",
        VALUE : 
        {
            value : "1"
        },
        SPECIAL : "",
        PAGE : "stk_01_001",
        ELEMENT : "cmbUrunCins",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Stok Tanımları",
            CAPTION : "Ürün Cinsi"
        }
    },
    //txtBarkod
    {
        TYPE : 2,
        ID :"txtBarkod",
        VALUE : 
        {
            value : ""
        },
        SPECIAL : "",
        PAGE : "stk_01_001",
        ELEMENT : "txtBarkod",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Stok Tanımları",
            CAPTION : "Barkod"
        }
    },
    //cmbVergi
    {
        TYPE : 2,
        ID :"cmbVergi",
        VALUE : 
        {
            value : "5.5"
        },
        SPECIAL : "",
        PAGE : "stk_01_001",
        ELEMENT : "cmbVergi",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Stok Tanımları",
            CAPTION : "Vergi"
        }
    },
    //cmbAnaBirim
    {
        TYPE : 2,
        ID :"cmbAnaBirim",
        VALUE : 
        {
            value : "001"
        },
        SPECIAL : "",
        PAGE : "stk_01_001",
        ELEMENT : "cmbAnaBirim",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Stok Tanımları",
            CAPTION : "Ana Birim Tipi"
        }
    },
    //txtAnaBirim
    {
        TYPE : 2,
        ID :"txtAnaBirim",
        VALUE : 
        {
            value : 1,
            validation :
            {
                grp : "frmItems",
                val : 
                [
                    {
                        type : "required",
                        msg : "Ana birim çarpanı'ı boş geçemezsiniz !"
                    },
                    {
                        type : "numeric",
                        msg : "Ana birim çarpanı'na sayısal değer giriniz !"
                    },
                    {
                        type : "range",
                        msg : "Ana birim çarpanı bir den küçük olamaz !",
                        min : 1
                    }
                ]
            }
        },
        SPECIAL : "",
        PAGE : "stk_01_001",
        ELEMENT : "txtAnaBirim",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Stok Tanımları",
            CAPTION : "Ana Birim Çarpan"
        }
    },
    //txtMensei
    {
        TYPE : 2,
        ID :"txtMensei",
        VALUE : 
        {
            value : ""
        },
        SPECIAL : "",
        PAGE : "stk_01_001",
        ELEMENT : "txtMensei",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Stok Tanımları",
            CAPTION : "Menşei"
        }
    },
    //cmbAltBirim
    {
        TYPE : 2,
        ID :"cmbAltBirim",
        VALUE : 
        {
            value : "001"
        },
        SPECIAL : "",
        PAGE : "stk_01_001",
        ELEMENT : "cmbAltBirim",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Stok Tanımları",
            CAPTION : "Alt Birim Tipi"
        }
    },
    //txtAltBirim
    {
        TYPE : 2,
        ID :"txtAltBirim",
        VALUE : 
        {
            value : 1,
            validation :
            {
                grp : "frmItems",
                val : 
                [
                    {
                        type : "required",
                        msg : "Alt birim çarpanı'ı boş geçemezsiniz !"
                    },
                    {
                        type : "numeric",
                        msg : "Alt birim çarpanı'na sayısal değer giriniz !"
                    },
                    {
                        type : "range",
                        msg : "Alt birim çarpanı sıfır ve sıfır dan küçük olamaz !",
                        min : 0.01
                    }
                ]
            }
        },
        SPECIAL : "",
        PAGE : "stk_01_001",
        ELEMENT : "txtAltBirim",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Stok Tanımları",
            CAPTION : "Alt Birim Çarpan"
        }
    },
    //txtUrunAdi
    {
        TYPE : 2,
        ID :"txtUrunAdi",
        VALUE : 
        {
            value : ""
        },
        SPECIAL : "",
        PAGE : "stk_01_001",
        ELEMENT : "txtUrunAdi",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Stok Tanımları",
            CAPTION : "Ürün Adı"
        }
    },
    //txtKisaAdi
    {
        TYPE : 2,
        ID :"txtKisaAdi",
        VALUE : 
        {
            value : ""
        },
        SPECIAL : "",
        PAGE : "stk_01_001",
        ELEMENT : "txtKisaAdi",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Stok Tanımları",
            CAPTION : "Kısa Adı"
        }
    },
    //chkAktif
    {
        TYPE : 2,
        ID :"chkAktif",
        VALUE : 
        {
            value : true
        },
        SPECIAL : "",
        PAGE : "stk_01_001",
        ELEMENT : "chkAktif",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Stok Tanımları",
            CAPTION : "Aktif"
        }
    },
    //chkKasaTartilsin
    {
        TYPE : 2,
        ID :"chkKasaTartilsin",
        VALUE : 
        {
            value : false
        },
        SPECIAL : "",
        PAGE : "stk_01_001",
        ELEMENT : "chkKasaTartilsin",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Stok Tanımları",
            CAPTION : "Kasada Tartılsın"
        }
    },
    //chkSatisBirlestir
    {
        TYPE : 2,
        ID :"chkSatisBirlestir",
        VALUE : 
        {
            value : false
        },
        SPECIAL : "",
        PAGE : "stk_01_001",
        ELEMENT : "chkSatisBirlestir",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Stok Tanımları",
            CAPTION : "Satır Birleştir"
        }
    },
    //chkTicketRest
    {
        TYPE : 2,
        ID :"chkTicketRest",
        VALUE : 
        {
            value : false
        },
        SPECIAL : "",
        PAGE : "stk_01_001",
        ELEMENT : "chkTicketRest",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Stok Tanımları",
            CAPTION : "Ticket Rest."
        }
    },
    //txtMaliyetFiyat
    {
        TYPE : 2,
        ID :"txtMaliyetFiyat",
        VALUE : 
        {
            value : 0,
            validation :
            {
                grp : "frmItems",
                val : 
                [
                    {
                        type : "range",
                        msg : "Sıfır değer giremezsiniz !",
                        min : 0.01
                    }
                ]
            }
        },
        SPECIAL : "",
        PAGE : "stk_01_001",
        ELEMENT : "txtMaliyetFiyat",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Stok Tanımları",
            CAPTION : "Ticket Rest."
        }
    },
    //txtMinSatisFiyat
    {
        TYPE : 2,
        ID :"txtMinSatisFiyat",
        VALUE : 
        {
            value : 0,
            validation :
            {
                grp : "frmItems",
                val : 
                [
                    {
                        type : "range",
                        msg : "Sıfır değer giremezsiniz !",
                        min : 0.01
                    }
                ]
            }
        },
        SPECIAL : "",
        PAGE : "stk_01_001",
        ELEMENT : "txtMinSatisFiyat",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Stok Tanımları",
            CAPTION : "Min. Satış Fiyatı"
        }
    },
    //txtMaxSatisFiyat
    {
        TYPE : 2,
        ID :"txtMaxSatisFiyat",
        VALUE : 
        {
            value : 0,
            validation :
            {
                grp : "frmItems",
                val : 
                [
                    {
                        type : "range",
                        msg : "Sıfır değer giremezsiniz !",
                        min : 0.01
                    }
                ]
            }
        },
        SPECIAL : "",
        PAGE : "stk_01_001",
        ELEMENT : "txtMaxSatisFiyat",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Stok Tanımları",
            CAPTION : "Max. Satış Fiyatı"
        }
    },
    //txtSonAlisFiyat
    {
        TYPE : 2,
        ID :"txtSonAlisFiyat",
        VALUE : 0,
        SPECIAL : "",
        PAGE : "stk_01_001",
        ELEMENT : "txtSonAlisFiyat",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Stok Tanımları",
            CAPTION : "Son Alış Fiyatı"
        }
    },
    //Urun Grubuna Göre Menşei Validation
    {
        TYPE : 1,
        ID :"UrunGrubuMenseiValidation",
        VALUE : ['019','021'],
        SPECIAL : "",
        PAGE : "stk_01_001",
        ELEMENT : "",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Stok Tanımları",
            CAPTION : "Ürün Grubuna Göre Menşei Validation"
        }
    },
    //Urun Grubuna Göre Min Max Yetki
    {
        TYPE : 1,
        ID :"UrunGrubuMinMaxYetki",
        VALUE : ['019','021'],
        SPECIAL : "",
        PAGE : "stk_01_001",
        ELEMENT : "",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Stok Tanımları",
            CAPTION : "Ürün Grubuna Göre Min Max Yetki"
        }
    },
    //#endregion

    //#region Cari Tanıtım
    //cmbType
    {
        TYPE : 2,
        ID :"cmbType",
        VALUE : 
        {
            value : "0"
        },
        SPECIAL : "",
        PAGE : "cri_01_001",
        ELEMENT : "cmbType",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Cari Tanımları",
            CAPTION : "Tip"
        }
    },
    //cmbType
    {
        TYPE : 2,
        ID :"cmbGenus",
        VALUE : 
        {
            value : "0"
        },
        SPECIAL : "",
        PAGE : "cri_01_001",
        ELEMENT : "cmbGenus",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Cari Tanımları",
            CAPTION : "Cinsi"
        }
    },
    //txtCode
    {
        TYPE : 2,
        ID :"txtCode",
        VALUE : 
        {
            validation :
            {
                grp : "frmCustomers",
                val : 
                [
                    {
                        type : "required",
                        msg : "Kodu'ı boş geçemezsiniz !"
                    }
                ]
            }
        },
        SPECIAL : "",
        PAGE : "cri_01_001",
        ELEMENT : "txtCode",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Cari Tanımları",
            CAPTION : "Cinsi"
        }
    },
    //txtCode
    {
        TYPE : 2,
        ID :"txtTitle",
        VALUE : 
        {
            
        },
        SPECIAL : "",
        PAGE : "cri_01_001",
        ELEMENT : "txtTitle",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Cari Tanımları",
            CAPTION : "Ünvan"
        }
    },
     //txtCustomerName
     {
        TYPE : 2,
        ID :"txtCustomerName",
        VALUE : 
        {
            validation :
            {
                grp : "frmCustomers",
                val : 
                [
                    {
                        type : "required",
                        msg : "Adı boş geçemezsiniz !"
                    }
                ]
            }
        },
        SPECIAL : "",
        PAGE : "cri_01_001",
        ELEMENT : "txtCustomerName",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Cari Tanımları",
            CAPTION : "Adı"
        }
    },
     //txtCustomerLastname
     {
        TYPE : 2,
        ID :"txtCustomerLastname",
        VALUE : 
        {
            validation :
            {
                grp : "frmCustomers",
                val : 
                [
                    {
                        type : "required",
                        msg : "Soyadı boş geçemezsiniz !"
                    }
                ]
            }
        },
        SPECIAL : "",
        PAGE : "cri_01_001",
        ELEMENT : "txtCustomerLastname",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Cari Tanımları",
            CAPTION : "Soyadı"
        }
    },
    //#endregion
]