// "Müşteri Tanımları"
const cri_01_001 =
{
    cmbType :"Tip",
    cmbGenus :"Cinsi",
    txtCode : "Kodu",
    txtTitle : "Ünvan",
    txtCustomerName : "Adı",
    txtCustomerLastname : "Soyadı",
    txtPhone1 : "Telefon 1",
    txtPhone2 : "Telefon 2",
    txtGsmPhone : "Gsm Tel.",
    txtOtherPhone : "Diğer Tel.",
    txtEmail : "E-Mail",
    txtWeb : "Web",
    tabTitleAdress : "Adres",
    tabTitleLegal : "Yasal",
    tabTitleOffical : "Yetkili",
    tabCustomerBank : "Banka Bilgileri",
    tabTitleFinanceDetail : "Finans Bilgileri",
    txtLegal :"Yasal Bilgiler",
    chkRebate :"İade Alır",
    chkVatZero :"Vergisiz",
    txtExpiryDay : "Vade",
    txtRiskLimit : "Risk Limiti",
    expDay : "(Gün)",
    chkActive: "Aktif",
    pg_txtCode : 
    {
        title : "Müşteri Seçim",
        clmCode : "KODU",
        clmTitle : "Ünvan",
        clmName : "Adı",
        clmLastName  : "Soyadı",
        clmStatus  : "Durum",   
    },
    grdAdress : 
    {
        clmAdress : "Adres",
        clmZipcode : "Posta Kodu",
        clmCity :"Şehir",
        clmCountry : "Ülke",
    },
    grdLegal : 
    {
        clmSiretID : "Tic. Sicil Kaydı",
        clmApeCode : "Ape Kodu",
        clmTaxOffice : "Vergi Dairesi",
        clmTaxNo : "Vergi No",
        clmIntVatNo : "Ulus. KDV No",
        clmTaxType : "Vergi Tipi",
        clmSirenID : "Tic. Sicil No",
        clmRcs : "Ticaret Odası",
        clmCapital : "Sermaye",
        clmInsurance : "Sigorta No"
    },
    grdOffical : 
    {
        clmName :"Adı",
        clmLastName : "Soyadı",
        clmPhone1 : "Telefon 1",
        clmPhone2 : "Telefon 2",
        clmGsmPhone : "GSM Tel.",
        clmEMail : "E-Mail"
    },
    grdBank : 
    {
        clmName : "Banka Adı",
        clmIban : "IBAN",
        clmOffice : "Şube",
        clmSwift : "Swift Kodu",
    },
    popAdress : 
    {
        title : "Adres",
        txtPopAdress : "Adres",
        cmbPopZipcode :"Posta Kodu",
        cmbPopCity :"Şehir",
        cmbPopCountry :"Ülke",
    },
    popBank : 
    {
        title : "Banka Bilgileri",
        txtName : "Banka Adı",
        txtIban :"IBAN",
        txtOffice :"Şube",
        txtSwift :"Swift Kodu",
    },
    popOffical : 
    {
        title : "Yetkili",
        txtPopName : "Adı",
        txtPopLastName : "Soyadı",
        txtPopPhone1 :"Telefon 1",
        txtPopPhone2 :"Telefon 2",
        txtPopGsmPhone : "GSM Tel.",
        txtPopOtherPhone : "Diğer Tel.",
        txtPopMail :"E-Mail"
    },
    msgSave:
    {
        title: "Dikkat",
        btn01: "Tamam",
        btn02: "Vazgeç",
        msg: "Kayıt etmek istediğinize eminmisiniz !"
    },
    msgSaveResult:
    {
        title: "Dikkat",
        btn01: "Tamam",
        msgSuccess: "Kayıt işleminiz başarılı !",
        msgFailed: "Kayıt işleminiz başarısız !"
    },
    msgSaveValid:
    {
        title: "Dikkat",
        btn01: "Tamam",
        msg: "Lütfen gerekli alanları doldurunuz !"
    },
    msgLegalNotValid:
    {
        title: "Dikkat",
        btn01: "Tamam",
        msg: "Lütfen Yasal Bölümündeki alanları doldurunuz !"
    },
    msgTaxNo:
    {
        title: "Dikkat",
        btn01: "Tamam",
        msg: "Lütfen vergi numarasını doldurunuz !"
    },
    msgAdressNotValid:
    {
        title: "Dikkat",
        btn01: "Tamam",
        msg: "Lütfen Adres Bölümünden Müşterinin Ülkesini Seçiniz!"
    },
    msgDelete:
    {
        title: "Dikkat",
        btn01: "Tamam",
        btn02: "Vazgeç",
        msg: "Kaydı silmek istediğinize eminmisiniz ?"
    },
    cmbTypeData : 
    {
        individual : "Bireysel",
        company : "Firma",
        association : "Dernek"
    },
    cmbGenusData:
    {
        Customer : "Müşteri",
        supplier : "Tedarikçi",
        both : "Her İkisi",
        branch : "Şube"
    },
    cmbTaxTypeData : 
    {
        individual : "Bireysel",
        company : "Firma"
    },
    msgCode : 
    {
        title: "Dikkat",
        btn01: "Müşteriye Git",
        btn02: "Tamam",
        msg : "Girmiş olduğunuz Müşteri sistem de kayıtlı !"
    },
    chkTaxSucre : "Tax Sugar",
    tabTitleDetail : "Detay Bilgileri",
    validation :
    {
        frmCustomers: "Kodu boş geçemezsiniz !",
    },
    txtSubCustomer : "Alt Cari",
    pg_subCustomer : 
    {
        title : "Alt Cari Seçim",
        clmCode : "Kodu",
        clmTitle : "Ünvan",
        clmName : "Adı",
        clmLastName  : "Soyadı",
    },
    txtMainCustomer : "Ana Cari",
    pg_mainCustomer : 
    {
        title : "Ana Cari Seçim",
        clmCode : "Kodu",
        clmTitle : "Ünvan",
        clmName : "Adı",
        clmLastName  : "Soyadı",
    },
    txtArea : "Bölge",
    pg_AreaCode : 
    {
        title : "Bölge Seçim",
        clmCode : "KODU",
        clmName : "ADI",
    },
    txtSector : "Sektör",
    pg_SectorCode : 
    {
        title : "Bölge Seçim",
        clmCode : "KODU",
        clmName : "ADI",
    },
    txtPriceListNo : "Fiyat Liste No",
    pg_priceListNo : 
    {
        title : "Fiyat Liste Seçimi",
        clmNo : "No",
        clmName : "Adı"
    },
    popNote : 
    {
        title : "Not Ekle",
    },
    tabTitleNote : "Notlar",
    grdNote:
    {
        clmNote : "NOT"
    },
    txtMainGroup : "Ana Grup",
    pg_MainGroup : 
    {
        title : "Ana Grup Seçim",
        clmCode : "KODU",
        clmName : "ADI",
    },
    btnSubGroup : "Alt Grup Ekle",
    pg_subGroup : 
    {
        title : "Alt Grup Seçim",
        clmName : "Adı",
    },
}

export default cri_01_001