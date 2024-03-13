// Depo/Mağaza Tanımları
const stk_01_006 = 
{
    txtCode : "Kodu",
    txtName :"Adı",
    cmbType :"Tip",
    validCode :"Kodu Boş Geçemezsiniz !",
    cmbTypeData : 
    {
        normal : "Merkezi",
        rebate : "İade",
        shop : "Mağaza",
        outage : "Fire",
    },
    pg_txtCode : 
    {
        title : "Depo Seçimi",
        clmCode : "KODU",
        clmName : "ADI",
        clmType : "TİPİ",
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
    msgDelete:
    {
        title: "Dikkat",
        btn01: "Tamam",
        btn02: "Vazgeç",
        msg: "Kaydı silmek istediğinize eminmisiniz ?"
    },
    msgCode : 
    {
        title: "Dikkat",
        btn01: "Kasaya Git",
        btn02: "Tamam",
        msg : "Girmiş olduğunuz Kasa sistem de kayıtlı !"
    },
    chkActive: "Aktif",
    msgNotDeleted : 
    {
        title: "Dikkat",
        btn01: "Tamam",
        msg : "Bu depo üzerinde işlem yapıldığı için silinemez !"
    },
}
export default stk_01_006