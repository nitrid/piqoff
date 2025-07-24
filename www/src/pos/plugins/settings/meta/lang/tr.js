const lang =
{
    posSettings :
    {
        posItemsList : "Ürünler",
        posSaleReport : "Pos Satış Raporu",
        posCustomerPointReport : "Müşteri Puan Raporu",
        posTicketEndDescription : "Fiş Sonu Açıklama",
        posGroupSaleReport : "Grup Bazlı Satış Raporu",
        posCompanyInfo : "Firma Bilgileri",
        btnExit : "Çıkış",
    },
    posItemsList :
    {
        title : "Ürün Listesi",
        btnItemSearch : "Ara",
        txtItemSearchPholder : "Ürün adı yada kodu giriniz",
        grdItemList :
        {
            CODE : "Ürün Kodu",
            NAME : "Ürün Adı",
            VAT : "Vat"
        },
        popItemEdit :
        {
            title : "Yeni Ürün",
            txtRef : "Ürün Kodu",
            txtName : "Ürün Adı",
            cmbMainUnit : "Ana Birim",
            cmbUnderUnit : "Alt Birim",
            cmbItemGrp : "Ürün Grubu",
            cmbOrigin : "Menşei",
            cmbTax : "Vergi",
            chkActive : "Aktif",
            chkCaseWeighed : "Kasada Tartılsın",
            chkLineMerged : "Satış da Satırları Ayır",
            chkTicketRest : "Ticket Rest.",
            tabTitlePrice : "Fiyat",
            tabTitleUnit : "Birim",
            tabTitleBarcode : "Barkod",
            msgItemValidation :
            {
                title : "Dikkat",
                btn01 : "Tamam",
                msg1 : "Ürün kodunu boş bırakamazsınız !",
                msg2 : "Ürün adını boş bırakamazsınız !",
            },
            msgPriceSave:
            {
                title: "Dikkat",
                btn01: "Tamam",
                msg: "Lütfen fiyat giriniz !"
            },
            msgNewItem :
            {
                title : "Dikkat",
                btn01 : "Tamam",
                btn02 : "İptal",
                msg : "Yeni ürün oluşturmak istediğinize emin misiniz ?"
            },
            msgSave:
            {
                title: "Dikkat",
                btn01: "Tamam",
                btn02: "Vazgeç",
                msg: "Kayıt etmek istediğinize emin misiniz !"
            },
            msgSaveResult:
            {
                title: "Dikkat",
                btn01: "Tamam",
                msgSuccess: "Kayıt işleminiz başarılı !",
                msgFailed: "Kayıt işleminiz başarısız !"
            },
            msgDelete:
            {
                title: "Dikkat",
                btn01: "Tamam",
                btn02: "Vazgeç",
                msg: "Kaydı silmek istediğinize emin misiniz ?"
            },
            msgNotDelete:
            {
                title: "Dikkat",
                btn01: "Tamam",
                msg: "Bu ürün işlem gördüğü için silinemez !!"
            },
            msgItemExist:
            {
                title: "Dikkat",
                btn01: "Evet",
                btn02: "Hayır",
                msg: "Girmiş olduğunuz ürün mevcut. Ürüne gitmek istermisiniz ?"
            },
            grdPrice :
            {
                clmStartDate : "Baş. Tarihi",
                clmFinishDate : "Bit. Tarihi",
                clmQuantity : "Miktar",
                clmPrice : "Fiyat",
                clmPriceHT : "Vergi Hariç",
                clmPriceTTC : "Vergi Fiyat",
            },
            grdUnit :
            {
                clmType : "Tip",
                clmName : "Adı",
                clmFactor : "Çarpan",
            },
            grdBarcode :
            {
                clmBarcode : "Barkod",
                clmUnit : "Birim",
                clmType : "Tip",
            },
            cmbMainUnit : "Ana Birim",
            cmbUnderUnit : "Alt Birim",
            popPrice :
            {
                title : "Fiyat",
                dtPopPriStartDate : "Baş. Tarihi",
                dtPopPriEndDate : "Bit. Tarihi",
                txtPopPriQuantity : "Miktar",
                txtPopPriPrice : "Fiyat",
                btnSave : "Kaydet",
                btnCancel : "İptal",
                msgCheckPrice:
                {
                    title: "Dikkat",
                    btn01: "Tamam",
                    msg: "Benzer kayıt oluşturamazsınız !"
                },
                msgCostPriceValid:
                {
                    title: "Dikkat",
                    btn01: "Tamam",
                    msg: "Lütfen alış fiyatından yüksek fiyat giriniz !"
                },
                msgPriceAdd:
                {
                    title: "Dikkat",
                    btn01: "Tamam",
                    msg: "Lütfen gerekli alanları doldurunuz !"
                },
                msgPriceEmpty :
                {
                    title: "Dikkat",
                    btn01: "Tamam",
                    msg: "Fiyat alanı boş bırakılamaz yada sıfır olamaz !"
                },
                msgPriceNotNumber :
                {
                    title: "Dikkat",
                    btn01: "Tamam",
                    msg: "Fiyat alanı sayısal bir değer olmalıdır !"
                },
                msgPriceQuantityEmpty :
                {
                    title: "Dikkat",
                    btn01: "Tamam",
                    msg: "Miktar alanı boş bırakılamaz yada sıfır olamaz !"
                },
                msgPriceQuantityNotNumber :
                {
                    title: "Dikkat",
                    btn01: "Tamam",
                    msg: "Miktar alanı sayısal bir değer olmalıdır !"
                }
            },
            popUnit :
            {
                title : "Birim",
                cmbPopUnitName : "Birim",
                txtPopUnitFactor : "Çarpan",
                btnSave : "Kaydet",
                btnCancel : "İptal",
                msgUnitRowNotDelete :
                {
                    title: "Dikkat",
                    btn01: "Tamam",
                    msg: "Ana birim yada Alt birim i silemezsiniz !"
                },
                msgUnitRowNotEdit :
                {
                    title: "Dikkat",
                    btn01: "Tamam",
                    msg: "Ana birim yada Alt birim i düzenleyemezsiniz !"
                },
                msgUnitFactorEmpty :
                {
                    title : "Dikkat",
                    btn01 : "Tamam",
                    msg : "Çarpan alanı boş bırakılamaz yada sıfır olamaz !"
                },
                msgUnitFactorNotNumber :
                {
                    title : "Dikkat",
                    btn01 : "Tamam",
                    msg : "Çarpan alanı sayısal bir değer olmalıdır !"
                }
            },
            popBarcode :
            {
                title : "Barkod",
                txtPopBarcode : "Barkod",
                cmbPopBarType : "Tip",
                cmbPopBarUnitType : "Birim",
                btnSave : "Kaydet",
                btnCancel : "İptal",
                msgBarcodeExist :
                {
                    title : "Dikkat",
                    btn01 : "Tamam",
                    msg : "Bu barkod zaten mevcut !"
                },
                msgBarcodeEmpty :
                {
                    title : "Dikkat",
                    btn01 : "Tamam",
                    msg : "Barkod alanı boş bırakılamaz !"
                }
            },
            popAddItemGrp :
            {
                title : "Ürün Grubu Ekle",
                txtAddItemGrpCode : "Kodu",
                txtAddItemGrpName : "Adı",
                btnSave : "Kaydet",
                btnCancel : "İptal",
                msgAddItemGrpEmpty :
                {
                    title : "Dikkat",
                    btn01 : "Tamam",
                    msg : "Lütfen gerekli alanları doldurunuz !"
                },
                msgAddItemGrpExist :
                {
                    title : "Dikkat",
                    btn01 : "Tamam",
                    msg : "Bu kod zaten mevcut !"
                },
                grpListPopup :
                {
                    msgGrpDelete :
                    {
                        title : "Dikkat",
                        btn02 : "Vazgeç",
                        btn01 : "Sil",
                        msg : "Bu ürün grubunu silmek istediğinize emin misiniz ?"
                    },
                    title : "Ürün Grubu Listesi",
                    grdGrpList :
                    {
                        clmCode : "Kodu",
                        clmName : "Adı",
                    }
                }
            }
        }
    },
    posSaleReport :
    {
        btnGet : "Getir",
        txtTotalTicket : "Toplam Fiş Adedi",
        txtTicketAvg : "Ortalama Fiş Tutarı",
    },
    popMailSend : 
    {
        title :"E-Mail Gönder",
        txtMailSubject : "E-Mail Başlığı",
        txtSendMail : "E-Mail Adresi",
        btnSend : "Gönder",
        cmbMailAddress : "Gönderilecek E-Mail Adresi"
    },
    msgMailSendResult:
    {
        title: "Dikkat",
        btn01: "Tamam",
        msgSuccess: "Mail gönderimi başarılı !",
        msgFailed: "Mail gönderimi başarısız !"
    },
    placeMailHtmlEditor : "Mail içeriğini buraya yazınız",
    posCustomerPointReport :
    {
        txtCustomerCode : "Müşteri Kodu",
        txtCustomerName : "Müşteri Adı",
        txtAmount : "Toplam Tutar",
        btnGet : "Getir",
        popCustomers :
        {
            title : "Müşteri Seçimi",
            clmCode : "Kodu",
            clmTitle : "Adı",
            clmTypeName : "Tipi",
            clmGenusName : "Cinsi",
            btnSelectCustomer : "Seç",
            btnCustomerSearch : "Ara",
        },
        grdCustomerPointReport :
        {
            clmCode: "Kodu",
            clmTitle: "Adı",
            clmPoint: "Puan",
            clmLdate : "Son Günc.Tarihi",
            clmEur : "Euro"
        },
        popPointDetail :
        {
            title : "Puan Detayı",
            clmDate : "Tarih",
            clmPosId : "Pos Kodu",
            clmPoint : "Puan",
            clmDescription : "Açıklama",
            exportFileName : "customer_point_detail",
            btnAddPoint : "Puan Ekle",
        },
        popPointSaleDetail :
        {
            title : "Puan Satış Detayı",
            TicketId : "Fiş No",
            clmBarcode : "Barkod",
            clmName : "Ürün Adı",
            clmQuantity : "Miktar",
            clmPrice : "Fiyat",
            clmTotal : "Toplam",
            clmPayName : "Ödeme Tipi",
            clmLineTotal : "Toplam",
            exportFileName : "customer_point_sale_detail",
        },
        popPointEntry :
        {
            title : "Puan Girişi",
            cmbPointType : "Tip",
            cmbTypeData :
            {
                in : "Giriş",
                out : "Çıkış",
            },
            txtPoint : "Puan",
            txtPointAmount : "Puan Tutarı",
            txtDescription : "Açıklama",
            descriptionPlace : "Açıklama giriniz",
            btnAdd : "Ekle",
            msgDescription :
            {
                title : "Dikkat",
                btn01 : "Tamam",
                msg : "Açıklama en az 14 karakter olmalıdır !",
            },
            msgPointNotNumber :
            {
                title : "Dikkat",
                btn01 : "Tamam",
                msg : "Puan alanı sayısal bir değer olmalıdır !",
            }
        }
    },
    posTicketEndDescription :
    {
        cmbFirm : "Firma",
        txtDescriptionPlaceHolder : "Açıklama giriniz",
        msgSaveResult :
        {
            title : "Dikkat",
            btn01 : "Tamam",
            msgSuccess : "Kayıt işleminiz başarılı !",
        }
    },
    posGrpSalesReport :
    {
        chkTicket : "Fiş Adedi",
        txtTotalTicket : "Toplam Fiş Adedi",
        txtTicketAvg : "Ortalama Fiş Tutarı",
        btnGet : "Getir",
        btnGetAnalysis : "Analiz",
        grdGroupSalesReport :
        {
            clmGrpCode : "Kodu",
            clmGrpName : "Adı",
            clmTicket : "Fiş Adedi",
            clmQuantity : "Miktar",
            clmTotalCost : "Toplam Maliyet",
            clmFamount : "Vergi Hariç",
            clmVat : "Vergi",
            clmTotal : "Toplam",
            clmRestTotal : "Kalan Toplam",
            exportFileName : "grp_sales_report",
        },
        grpGrpDetail :
        {
            title : "Ürün Grubu Detayı",
            clmCode : "Kodu",
            clmName : "Adı",
            clmQuantity : "Miktar",
            clmTotalCost : "Toplam Maliyet",
            clmFamount : "Vergi Hariç",
            clmVat : "Vergi",
            clmTotal : "Toplam",
            clmRestTotal : "Kalan Toplam",
            exportFileName : "grp_grp_detail",
        },
        popAnalysis :
        {
            title : "Analiz",
        }
    },
    posCompanyInfo :
    {
        validation :
        {
            notValid : "Lütfen gerekli alanları doldurunuz !",
        },
        txtTitle : "Firma Adı",
        txtBrandName : "Marka Adı",
        txtCustomerName : "Yetkili Adı",
        txtCustomerLastname : "Yetkili Soyadı",
        txtAddress : "Adres",
        txtCountry : "Ülke",
        txtZipCode : "Posta Kodu",
        txtCity : "Şehir",
        txtPhone : "Telefon",
        txtFax : "Fax",
        txtEmail : "Email",
        txtWeb : "Web Sitesi",
        txtApeCode : "Ape Code",
        txtRSC : "RSC",
        txtTaxOffice : "Vergi Dairesi",
        txtTaxNo : "Vergi No",
        txtIntVatNo : "InT.Vat No",
        txtSirenNo : "Siren No",
        txtSiretId : "Siret No",
        msgSave :
        {
            title : "Dikkat",
            btn01 : "Evet",
            btn02 : "Hayır",
            msg : "Kayıt etmek istediğinize emin misiniz ?",
        },
        msgSaveResult :
        {
            title : "Dikkat",
            btn01 : "Tamam",
            msgSuccess : "Kayıt işleminiz başarılı !",
            msgFailed : "Kayıt işleminiz başarısız !",
        },
        msgSaveValid :
        {
            title : "Dikkat",
            btn01 : "Tamam",
            msg : "Lütfen gerekli alanları doldurunuz !",
        }
    },
    dtToday : "Bugün",
    tdLastDay : "Dün",
    dtThisWeek : "Bu Hafta",
    dtLastWeek : "Geçen Hafta",
    dtMount : "Bu Ay",
    dtLastMount : "Geçen Ay",
    dtYear : "Bu Yıl",
    dtLastYear : "Geçen Yıl"
}
export default lang