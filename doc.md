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

DELETE FROM ACCOUNT_BALANCE
DELETE FROM BALANCE_COUNTER
DELETE FROM BANK
DELETE FROM [CHECK]
DELETE FROM CHEQPAY
DELETE FROM COMPANY
DELETE FROM CONTRACT
DELETE FROM CURRENCY_TYPE
DELETE FROM CUSTOMER_ADRESS
DELETE FROM CUSTOMER_AREA
DELETE FROM CUSTOMER_BANK
DELETE FROM CUSTOMER_GROUP
DELETE FROM CUSTOMER_NOTE
DELETE FROM CUSTOMER_OFFICAL
DELETE FROM CUSTOMER_POINT
DELETE FROM CUSTOMER_SECTOR
DELETE FROM CUSTOMERS
DELETE FROM CUSTOMERS_GRP
DELETE FROM CUSTOMS_CODE
DELETE FROM DOC
DELETE FROM DOC_CONNECT
DELETE FROM DOC_CUSTOMER
DELETE FROM DOC_EXTRA
DELETE FROM DOC_ITEMS
DELETE FROM DOC_OFFERS
DELETE FROM DOC_ORDERS
DELETE FROM ENDDAY_DATA
DELETE FROM ITEM_BARCODE
DELETE FROM ITEM_COUNT
DELETE FROM ITEM_EXPDATE
DELETE FROM ITEM_GENRE
DELETE FROM ITEM_GROUP
DELETE FROM ITEM_IMAGE
DELETE FROM ITEM_MULTICODE
DELETE FROM ITEM_PRICE
DELETE FROM ITEM_QUANTITY
DELETE FROM ITEM_RELATED
DELETE FROM ITEM_TYPE
DELETE FROM ITEM_UNIQ
DELETE FROM ITEM_UNIT
DELETE FROM ITEMS
DELETE FROM ITEMS_CUSTOMS_DATA
DELETE FROM ITEMS_GRP
DELETE FROM ITEMS_SHOP
DELETE FROM LABEL_QUEUE
DELETE FROM LOG
DELETE FROM NF203_GRAND_TOTAL
DELETE FROM NF525_GRAND_TOTAL
DELETE FROM NF525_JET
DELETE FROM OTHER_SHOP_ITEMS
DELETE FROM PARAM
DELETE FROM PLU
DELETE FROM POS
DELETE FROM POS_DEVICE
DELETE FROM POS_EXTRA
DELETE FROM POS_FACTURE
DELETE FROM POS_PAYMENT
DELETE FROM POS_PROMO
DELETE FROM POS_SALE
DELETE FROM PROMO
DELETE FROM PROMO_APPLICATION
DELETE FROM PROMO_CONDITION
DELETE FROM PROMOTION
DELETE FROM QUICK_DESCRIPTION
DELETE FROM SAFE
DELETE FROM SERVICE_ITEMS
DELETE FROM SUPPORT_DETAIL
DELETE FROM TRANSPORT_TYPE