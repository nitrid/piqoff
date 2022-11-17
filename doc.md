# SETUP
piqoff/ npm i
piqoff/www npm i
piqoff/www npm i devextreme@21.1.5
piqoff/www npm i devextreme-react@21.1.5

- 20 - Günlük fiş arşivlendi. (excel-archive fiscal) - nf525.js
- 30 - Yıllık grand total arşivlendi.(excel-archive fiscal) - nf525.js
+ 40 - Kasa offline döndü yada kasa kapandı. - nf525.js içerisinde socket durumu event
- 50 - Günlük ve Aylık grand total yapıldı. - nf525.js
- 60 - Yıllık grand total yapıldı. - nf525.js
70 - Kasa offline çalışıyor. 
+ 80 - Kasa işleme başladı. (Kasa ilk açıldığında) - posDoc.js
+ 90 - Programdaki kayıt hatası. - posDoc.js
+ 100 - Formasyon başladı. - posDoc.js
+ 105 - Formasyon bitti. - posDoc.js
+ 120 - Kasa offline dan çıkıp online a döndü. - posDoc.js
+ 123 - Online döndükden sonra eldeki kayıtları sunucuya gönderdim. - posDoc.js
125 - Online a döndüm sunucuya gönderdim sonra da genel merkeze gönderildi. - nf525.js
- 128 - Şirket bilgisi değiştirildi. - off içerisinde firma değiştirme durumunda
- 130 - Kullanıcı yetkisi değişitirildi. - admin içerisinde
140 - 
- 150 - Yazıcı ile bağlantım kesildi. - posDoc.js
+ 155 - Duplicate yazdırıldı. - posDoc.js
- 170 - Avans giriş çıkış işlemi yapıldı. - posDoc.js
180 - Cari extre ve muhasebeye hesap dökümü gönderildi. - off içerisinde
190 - fiş silindi. - bizde yok
200 - Jet de silinebilir kayıtları temizledim. - admin içerisinde log giriş ekranı yapılacak.
205 - Jet yedeklendi ve yeniden başladım. - admin içerisinde log giriş ekranı yapılacak.
210 - Devir gerçekleşti. (yeni yıla geçildi gibi...) - admin içerisinde log giriş ekranı yapılacak.
220 - Vt de yeni bir kolon ekledim yada değiştirdim. - admin içerisinde log giriş ekranı yapılacak.
230 - Program otomatik vt yedeklendi. - admin içerisinde log giriş ekranı yapılacak.
240 - Vt üzerinde manuel değişiklik yapıldı. - admin içerisinde log giriş ekranı yapılacak.
250 - programda major değişiklik yapıldı. - admin içerisinde log giriş ekranı yapılacak.
255 - versiyon güncelledim. - admin içerisinde log giriş ekranı yapılacak.
260 - programı yeni kurdum. - admin içerisinde log giriş ekranı yapılacak.
- 270 - parametredeki değişiklik yapıldım. - admin içerisinde.
280 - vergi müfettişi geldi kontrol başladı yada bitti. - admin içerisinde log giriş ekranı yapılacak.
+ 320 - beklemedeki fiş silindi - posDoc.js
+ 323 - beklemedeki satır silindi. - posDoc.js
324 - sipariş kaydı silindi. - bizde yok
325 - sipariş satırı silindi. - bizde yok
+ 326 - iade alındı. - posDoc.js
327 - 
328 -
410 - sipariş alan firma bilgisi değişti.
420 - ödeme değişti.
430 - masa değiştirdim. (restoranlar için)
450 - imzalama değiştirildi (base64 değişti)

### SENARYO ###
plugin olarak nf525.js altında bu işlemleri yapan bir socket aracı yapılacak. burda client dan gelen istekler dinlenecek
sabit bir fonksiyon ile log durumları vt ye kayıt edilecek. 
eğer 40 nolu hata kodu oluşursa bunun için nf525 içerisinde socket dinlenecek disconnect durumuna geçerse kasa kapandı işlenecek.