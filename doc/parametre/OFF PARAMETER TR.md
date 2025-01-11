# OFF Parametreleri Açıklamaları

## Sistem Parametreleri

### İkinci Birim
- **ID:** secondFactor
- **Açıklama:** İkinci birim ID'sini tanımlar. Varsayılan değer: `"003"`.

### Sadece Büyük Harf Kullanımı
- **ID:** onlyBigChar
- **Açıklama:** Sadece büyük harf kullanımını etkinleştirir. Varsayılan değer: `true`.

### Seri İçin Cari Kodu Kullan
- **ID:** refForCustomerCode
- **Açıklama:** Tedarikçi kodunun seri olarak kullanılmasını sağlar. Varsayılan değer: `true`.

### Seri Numarası Rastgele Oluştursun
- **ID:** randomRefNo
- **Açıklama:** Seri numarasının rastgele oluşturulmasını sağlar. Varsayılan değer: `false`.

### Alış Faturasından Alış Fiyatı Güncelleme
- **ID:** purcInvoıcePriceSave
- **Açıklama:** Alış faturasından alış fiyatı güncellemeyi etkinleştirir. Varsayılan değer: `true`.

### Alış Faturasında Eksi Miktar Girişi
- **ID:** negativeQuantityForPruchase
- **Açıklama:** Alış faturasında eksi miktar girişine izin verir. Varsayılan değer: `true`.

### Ödeme İşlemleri İçin Fatura Seçme Zorunluluğu
- **ID:** invoicesForPayment
- **Açıklama:** Ödeme ve tahsilat işlemleri için fatura seçme zorunluluğunu belirler. Varsayılan değer: `false`.

### Para Sembolü
- **ID:** MoneySymbol
- **Açıklama:** Para birimi sembolünü tanımlar. Örneğin, Euro için `code: "EUR", sign: "€"`.

### Daha Düşük Fiyatlı Tedarikçi Uyarısı
- **ID:** pruchasePriceAlert
- **Açıklama:** Daha düşük fiyatlı tedarikçi uyarısını etkinleştirir. Varsayılan değer: `true`.

### Otomatik Interfel Hesaplaması
- **ID:** autoInterfel
- **Açıklama:** Otomatik Interfel hesaplamasını etkinleştirir. Varsayılan değer: `false`.

### Faturadaki Hizmetten Maliyet Ekle
- **ID:** costForInvoıces
- **Açıklama:** Faturadaki hizmetten maliyet eklemeyi etkinleştirir. Varsayılan değer: `false`.

### Maliyetten Düşük Fiyata Satış Yapabilir
- **ID:** underMinCostPrice
- **Açıklama:** Maliyetten düşük fiyata satış yapabilme izni verir. Varsayılan değer: `false`.

### En fazla uygulanabilcek yuvarlama tutarı
- **ID:** maxRoundAmount
- **Açıklama:** En fazla uygulanabilecek yuvarlama tutarını tanımlar. Varsayılan değer: `0.05`.

### En fazla izin verilen miktar
- **ID:** maxUnitQuantity
- **Açıklama:** En fazla izin verilen miktarı tanımlar. Varsayılan değer: `100000`.

### En fazla izin verilen birim fiyatı
- **ID:** maxItemPrice
- **Açıklama:** En fazla izin verilen birim fiyatını tanımlar. Varsayılan değer: `100000`.

### Zorunlu Evrak Silme Açıklaması
- **ID:** docDeleteDesc
- **Açıklama:** Zorunlu evrak silme açıklamasını etkinleştirir. Varsayılan değer: `true`.

### Sabit Birim
- **ID:** cmbUnit
- **Açıklama:** Sabit birimi tanımlar. Varsayılan değer: `"Colis"`.

### Barkod Desenleri
- **ID:** BarcodePattern
- **Açıklama:** Desteklenen barkod desenlerini listeler. Örneğin, `'20XXXXXMMMCCF'`.

### Terazi Fiyat Çarpanı
- **ID:** ScalePriceFactory
- **Açıklama:** Terazi fiyat çarpanını tanımlar. Varsayılan değer: `1`.

### Varsayılan Taşıma Kodu
- **ID:** DocTrasportType
- **Açıklama:** Varsayılan taşıma kodunu tanımlar. Varsayılan değer: `3`.

### Mail Ek Adresi
- **ID:** autoMailAdress
- **Açıklama:** Varsayılan mail adresini tanımlar. Varsayılan değer: `""`.

### Maliyet Fiyatı Elle Girişi Kilitle
- **ID:** costPriceReadOnly
- **Açıklama:** Maliyet fiyatı elle girişi kilitlemeyi etkinleştirir. Varsayılan değer: `false`.

### Otomatik mail gönderme
- **ID:** autoFactureMailSend
- **Açıklama:** Otomatik mail gönderme özelliğini etkinleştirir. Varsayılan değer: `true`.

### Mail Açıklaması
- **ID:** MailExplanation
- **Açıklama:** Mail açıklaması çıkacak yazısını tanımlar. Varsayılan değer: `""`.

## Stok Tanıtım Parametreleri

### Referans
- **ID:** txtRef
- **Açıklama:** Stok tanıtımında referans bilgisini tanımlar. Bu alan, belirli bir doğrulama grubuna aittir ve gerekli olarak işaretlenmiştir.

### Ürün Grup
- **ID:** cmbItemGrp
- **Açıklama:** Stok tanıtımında ürün grubunu tanımlar. Bu alan, belirli bir doğrulama grubuna aittir ve gerekli olarak işaretlenmiştir.

### Tedarikçi
- **ID:** txtCustomer
- **Açıklama:** Stok tanıtımında tedarikçi bilgisini tanımlar. Bu alan, belirli bir doğrulama grubuna aittir ve gerekli olarak işaretlenmiştir.

### Ürün Cinsi
- **ID:** cmbItemGenus
- **Açıklama:** Stok tanıtımında ürün cinsini tanımlar. Varsayılan değer: `"0"`.

### Barkod
- **ID:** txtBarcode
- **Açıklama:** Stok tanıtımında barkod bilgisini tanımlar.

### Vergi
- **ID:** cmbTax
- **Açıklama:** Stok tanıtımında vergi oranını tanımlar. Varsayılan değer: `"5.5"`.

### Ana Birim Tipi
- **ID:** cmbMainUnit
- **Açıklama:** Stok tanıtımında ana birim tipini tanımlar. Varsayılan değer: `"001"`.

### Ana Birim Çarpan
- **ID:** txtMainUnit
- **Açıklama:** Stok tanıtımında ana birim çarpanını tanımlar. Bu alan, belirli bir doğrulama grubuna aittir ve gerekli, sayısal ve belirli bir aralıkta olmalıdır.

### Menşei
- **ID:** cmbOrigin
- **Açıklama:** Varsayılan olarak stok tanıtımında ürünün menşeini tanımlar.

### Alt Birim Tipi
- **ID:** cmbUnderUnit
- **Açıklama:** Stok tanıtımında alt birim tipini tanımlar. Varsayılan değer: `"002"`.

### Alt Birim Çarpan
- **ID:** txtUnderUnit
- **Açıklama:** Stok tanıtımında alt birim çarpanını tanımlar. Bu alan, belirli bir doğrulama grubuna aittir ve gerekli, sayısal ve belirli bir aralıkta olmalıdır.

### Ürün Adı
- **ID:** txtItemName
- **Açıklama:** Varsayılan olarak stok tanıtımında ürün adını tanımlar. Varsayılan değer: `""`.

### Kısa Adı
- **ID:** txtShortName
- **Açıklama:** Stok tanıtımında ürünün kısa adını tanımlar.

### Aktif
- **ID:** chkActive
- **Açıklama:** Ürünün aktif olup olmadığını belirler.Varsayılan değer: `true`.

### Kasada Tartılsın
- **ID:** chkCaseWeighed
- **Açıklama:** Ürünün kasada tartılıp tartılmayacağını belirler. Varsayılan değer: `false`.

### Satır Birleştir
- **ID:** chkLineMerged
- **Açıklama:** Ürün satırlarının birleştirilip birleştirilmeyeceğini belirler. Varsayılan değer: `true`.

### Ticket Rest.
- **ID:** chkTicketRest
- **Açıklama:** Ürünün Ticket Rest. özelliğine sahip olup olmadığını belirler. Varsayılan değer: `false`.

### İnterfel
- **ID:** chkInterfel
- **Açıklama:** Ürünün İnterfel özelliğine sahip olup olmadığını belirler. Varsayılan değer: `false`.

### Maliyet Fiyatı
- **ID:** txtCostPrice
- **Açıklama:** Ürünün maliyet fiyatını tanımlar. 0'dan büyük olmalıdır.

### Min. Satış Fiyatı
- **ID:** txtMinSalePrice
- **Açıklama:** Ürünün minimum satış fiyatını tanımlar. 0'dan büyük olmalıdır.

### Max. Satış Fiyatı
- **ID:** txtMaxSalePrice
- **Açıklama:** Ürünün maksimum satış fiyatını tanımlar. 0'dan büyük olmalıdır.

### Son Alış Fiyatı
- **ID:** txtLastBuyPrice
- **Açıklama:** Ürünün son alış fiyatını tanımlar.

### Son Satış Fiyatı
- **ID:** txtLastSalePrice
- **Açıklama:** Ürünün son satış fiyatını tanımlar.

### Ürün Grubuna Göre Menşei Validation
- **ID:** ItemGrpForOrginsValidation
- **Açıklama:** Ürün grubuna göre menşei doğrulamasını tanımlar.

### Ürün Grubuna Göre Min Max Yetki
- **ID:** ItemGrpForMinMaxAccess
- **Açıklama:** Ürün grubuna göre minimum ve maksimum yetkiyi tanımlar.

### Ürün Grubuna Göre Fiyatsız Kayıt
- **ID:** ItemGrpForNotPriceSave
- **Açıklama:** Ürün grubuna göre fiyatsız kayıt yapabilme izni verir.

### Ürün Minimum Satış Yüzdesi
- **ID:** ItemMinPricePercent
- **Açıklama:** Ürün için minimum satış yüzdesini tanımlar.

### Ürün Maximum Satış Yüzdesi
- **ID:** ItemMaxPricePercent
- **Açıklama:** Ürün için maksimum satış yüzdesini tanımlar.

### Satış Fiyatı Maliyet Kontrolü
- **ID:** SalePriceCostCtrl
- **Açıklama:** Satış fiyatının maliyet kontrolünü etkinleştirir.

### Ted. Fiyatı Yüksek Olamaz Kontrolü
- **ID:** SalePriceToCustomerPriceCtrl
- **Açıklama:** Tedarikçi fiyatının satış fiyatından yüksek olamayacağını kontrol eder.

### Tax Sugar Uygulanacak Gruplar
- **ID:** taxSugarGroupValidation
- **Açıklama:** Tax Sugar uygulanacak grupları tanımlar.

### Ürün Cinsi
- **ID:** txtGenre
- **Açıklama:** Stok tanıtımında ürün cinsini tanımlar. Varsayılan değer: `"11"`.

## Stok Liste Parametreleri

### Bulunamayan Ürünler İçin Boş Satır Atılsın
- **ID:** emptyCode
- **Açıklama:** Bulunamayan ürünler için stok listesine boş satır eklenip eklenmeyeceğini belirler. Varsayılan değer: `true`.

## Cari Tanıtım Parametreleri

### Tip
- **ID:** cmbType
- **Açıklama:** Cari tanıtımında tip bilgisini tanımlar. Varsayılan değer: `"0"`.

### Cinsi
- **ID:** cmbGenus
- **Açıklama:** Cari tanıtımında cins bilgisini tanımlar. Varsayılan değer: `"0"`.

### Kodu
- **ID:** txtCode
- **Açıklama:** Cari tanıtımında kod bilgisini tanımlar. Bu alan, belirli bir doğrulama grubuna aittir ve gerekli olarak işaretlenmiştir. Mesaj: "Vous ne pouvez pas laisser le code vide!"

### Ünvan
- **ID:** txtTitle
- **Açıklama:** Cari tanıtımında ünvan bilgisini tanımlar. Varsayılan değer: `""`.

### Adı
- **ID:** txtCustomerName
- **Açıklama:** Cari tanıtımında ad bilgisini tanımlar. Bu alan, belirli bir doğrulama grubuna aittir ve gerekli olarak işaretlenmiştir. Mesaj: "Vous ne pouvez pas laisser le nom vide. !"

### Soyadı
- **ID:** txtCustomerLastname
- **Açıklama:** Cari tanıtımında soyad bilgisini tanımlar. Bu alan, belirli bir doğrulama grubuna aittir ve gerekli olarak işaretlenmiştir. Mesaj: "Vous ne pouvez pas laisser le nom vide"

## Fiyat Liste Tanımı Parametreleri

### No
- **ID:** txtNo
- **Açıklama:** Fiyat liste tanımında numara bilgisini tanımlar. Bu alan, belirli bir doğrulama grubuna aittir ve gerekli olarak işaretlenmiştir.

### Adı
- **ID:** txtName
- **Açıklama:** Fiyat liste tanımında ad bilgisini tanımlar. Bu alan, belirli bir doğrulama grubuna aittir ve gerekli olarak işaretlenmiştir.

## Satış Faturası Parametreleri

### Seri
- **ID:** txtRef
- **Açıklama:** Satış faturasında seri bilgisini tanımlar. Varsayılan değer: `""`.

### Sıra
- **ID:** txtRefno
- **Açıklama:** Satış faturasında sıra bilgisini tanımlar. Varsayılan değer: `"0"`.

### Depo
- **ID:** cmbDepot
- **Açıklama:** Satış faturasında depo bilgisini tanımlar. Varsayılan değer: `"EEB85132-6BCB-4C18-B6FA-46A1E0C1C813"`.

### Cari Kodu
- **ID:** txtCustomerCode
- **Açıklama:** Satış faturasında cari kod bilgisini tanımlar. Varsayılan değer: `""`.

### Cari Adı
- **ID:** txtCustomerName
- **Açıklama:** Satış faturasında cari ad bilgisini tanımlar. Varsayılan değer: `""`.

### Eksiye Düşemeye İzin Verme
- **ID:** negativeQuantity
- **Açıklama:** Satış faturasında eksiye düşmeye izin verilip verilmeyeceğini belirler. Varsayılan değer: `false`.

### Otomatik mail gönderilcek adress
- **ID:** autoMailAdress
- **Açıklama:** Satış faturasında otomatik mail gönderilecek adresi tanımlar. Varsayılan değer: `""`.

### Belge no kontrolu
- **ID:** checkDocNo
- **Açıklama:** Satış faturasında belge numarası kontrolünü etkinleştirir. Varsayılan değer: `true`.

## Fire Alış Faturası Parametreleri

### Seri
- **ID:** txtRef
- **Açıklama:** Fire alış faturasında seri bilgisini tanımlar. Varsayılan değer: `""`.

### Sıra
- **ID:** txtRefno
- **Açıklama:** Fire alış faturasında sıra bilgisini tanımlar. Varsayılan değer: `"0"`.

### Depo
- **ID:** cmbDepot
- **Açıklama:** Fire alış faturasında depo bilgisini tanımlar. Varsayılan değer: `""`.

### Cari Kodu
- **ID:** txtCustomerCode
- **Açıklama:** Fire alış faturasında cari kod bilgisini tanımlar. Varsayılan değer: `""`.

### Cari Adı
- **ID:** txtCustomerName
- **Açıklama:** Fire alış faturasında cari ad bilgisini tanımlar. Varsayılan değer: `""`.

### Eksiye Düşemeye İzin Verme
- **ID:** negativeQuantity
- **Açıklama:** Fire alış faturasında eksiye düşmeye izin verilip verilmeyeceğini belirler. Varsayılan değer: `false`.

### Belge no kontrolu
- **ID:** checkDocNo
- **Açıklama:** Fire alış faturasında belge numarası kontrolünü etkinleştirir. Varsayılan değer: `false`.

## Şubeler Arası Satış Faturası Parametreleri

### Seri
- **ID:** txtRef
- **Açıklama:** Şubeler arası satış faturasında seri bilgisini tanımlar. Varsayılan değer: `""`.

### Sıra
- **ID:** txtRefno
- **Açıklama:** Şubeler arası satış faturasında sıra bilgisini tanımlar. Varsayılan değer: `"0"`.

### Depo
- **ID:** cmbDepot
- **Açıklama:** Şubeler arası satış faturasında depo bilgisini tanımlar. Varsayılan değer: `""`.

### Cari Kodu
- **ID:** txtCustomerCode
- **Açıklama:** Şubeler arası satış faturasında cari kod bilgisini tanımlar. Varsayılan değer: `""`.

### Cari Adı
- **ID:** txtCustomerName
- **Açıklama:** Şubeler arası satış faturasında cari ad bilgisini tanımlar. Varsayılan değer: `""`.

### Eksiye Düşemeye İzin Verme
- **ID:** negativeQuantity
- **Açıklama:** Şubeler arası satış faturasında eksiye düşmeye izin verilip verilmeyeceğini belirler. Varsayılan değer: `false`.

### Belge no kontrolu
- **ID:** checkDocNo
- **Açıklama:** Şubeler arası alış faturasında belge numarası kontrolünü etkinleştirir. Varsayılan değer: `false`.

## Fiyat Farki Alış Faturası Parametreleri

### Belge no kontrolu
- **ID:** checkDocNo
- **Açıklama:** Fiyat farkı alış faturasında belge numarası kontrolünü etkinleştirir. Varsayılan değer: `false`.

## Gelen İade Alış Faturası Parametreleri

### Belge no kontrolu
- **ID:** checkDocNo
- **Açıklama:** Gelen iade alış faturasında belge numarası kontrolünü etkinleştirir. Varsayılan değer: `false`.

## Alış Faturası Parametreleri

### Seri
- **ID:** txtRef
- **Açıklama:** Alış faturasında seri bilgisini tanımlar. Varsayılan değer: `""`.

### Sıra
- **ID:** txtRefno
- **Açıklama:** Alış faturasında sıra bilgisini tanımlar. Varsayılan değer: `"0"`.

### Tax Sugar Uygulanacak Gruplar
- **ID:** taxSugarGroupValidation
- **Açıklama:** Alış faturasında Tax Sugar uygulanacak grupları tanımlar.

### Depo
- **ID:** cmbDepot
- **Açıklama:** Alış faturasında depo bilgisini tanımlar. Varsayılan değer: `"EEB85132-6BCB-4C18-B6FA-46A1E0C1C813"`.

### Cari Kodu
- **ID:** txtCustomerCode
- **Açıklama:** Alış faturasında cari kod bilgisini tanımlar. Varsayılan değer: `""`.

### Cari Adı
- **ID:** txtCustomerName
- **Açıklama:** Alış faturasında cari ad bilgisini tanımlar. Varsayılan değer: `""`.

### Excel Formatı
- **ID:** excelFormat
- **Açıklama:** Alış faturasında Excel formatını tanımlar. Varsayılan değerler: `CODE:'CODE', QTY:'QTY', PRICE:'PRICE', DISC:'DISC', DISC_PER:'DISC_PER', TVA:'TVA'`.

### Tedarikçişi olmayan ürünü kaydetme
- **ID:** compulsoryCustomer
- **Açıklama:** Alış faturasında tedarikçisi olmayan ürünü kaydetmeyi engeller. Varsayılan değer: `true`.

### Belge no kontrolu
- **ID:** checkDocNo
- **Açıklama:** Alış faturasında belge numarası kontrolünü etkinleştirir. Varsayılan değer: `false`.

## Gönderilen İade Faturası Parametreleri

### Belge no kontrolu
- **ID:** checkDocNo
- **Açıklama:** Gönderilen iade faturasında belge numarası kontrolünü etkinleştirir. Varsayılan değer: `false`.

## Fiyat Farki Faturası Parametreleri

### Belge no kontrolu
- **ID:** checkDocNo
- **Açıklama:** Fiyat farkı faturasında belge numarası kontrolünü etkinleştirir. Varsayılan değer: `false`.

## Şubeler Arası Alış Faturası Parametreleri

### Belge no kontrolu
- **ID:** checkDocNo
- **Açıklama:** Şubeler arası alış faturasında belge numarası kontrolünü etkinleştirir. Varsayılan değer: `false`.

### Tedarikçişi olmayan ürünü kaydetme
- **ID:** compulsoryCustomer
- **Açıklama:** Şubeler arası alış faturasında tedarikçisi olmayan ürünü kaydetmeyi engeller. Varsayılan değer: `true`.

## Promosyon Parametreleri

### Kodu
- **ID:** txtCode
- **Açıklama:** Promosyon tanımlarında kod bilgisini tanımlar. Bu alan, belirli bir doğrulama grubuna aittir ve gerekli olarak işaretlenmiştir.

## Proforma Satış Faturası Parametreleri

### Seri
- **ID:** txtRef
- **Açıklama:** Proforma satış faturasında seri bilgisini tanımlar. Varsayılan değer: `""`.

### Sıra
- **ID:** txtRefno
- **Açıklama:** Proforma satış faturasında sıra bilgisini tanımlar. Varsayılan değer: `"0"`.

### Depo
- **ID:** cmbDepot
- **Açıklama:** Proforma satış faturasında depo bilgisini tanımlar. Varsayılan değer: `""`.

### Cari Kodu
- **ID:** txtCustomerCode
- **Açıklama:** Proforma satış faturasında cari kod bilgisini tanımlar. Varsayılan değer: `""`.

### Cari Adı
- **ID:** txtCustomerName
- **Açıklama:** Proforma satış faturasında cari ad bilgisini tanımlar. Varsayılan değer: `""`.

### Eksiye Düşemeye İzin Verme
- **ID:** negativeQuantity
- **Açıklama:** Proforma satış faturasında eksiye düşmeye izin verilip verilmeyeceğini belirler. Varsayılan değer: `false`.

## Depo Miktar Listesi Parametreleri

### Varsayılan Depo
- **ID:** cmbDepot
- **Açıklama:** Depo miktar listesinde varsayılan depo bilgisini tanımlar. Varsayılan değer: `'1A428DFC-48A9-4AC6-AF20-4D0A4D33F316'`.

## Depo Sevk Parametreleri

### Eksiye Düşemeye İzin Verme
- **ID:** negativeQuantity
- **Açıklama:** Depolar arası transferde eksiye düşmeye izin verilip verilmeyeceğini belirler. Varsayılan değer: `false`.

## İade Ürün Toplama Parametreleri

### Eksiye Düşemeye İzin Verme
- **ID:** negativeQuantity
- **Açıklama:** İade ürün toplamada eksiye düşmeye izin verilip verilmeyeceğini belirler. Varsayılan değer: `false`.

### Çıkış Depo
- **ID:** cmbDepot1
- **Açıklama:** İade ürün toplamada çıkış depo bilgisini tanımlar. Varsayılan değer: `""`.

### Giriş Depo
- **ID:** cmbDepot2
- **Açıklama:** İade ürün toplamada giriş depo bilgisini tanımlar. Varsayılan değer: `""`.

## Kayıp Ürün Parametreleri

### Satır Açıklamalarını Zorunlu Kıl
- **ID:** descriptionControl
- **Açıklama:** Kayıp ürün fişinde satır açıklamalarını zorunlu kılar. Varsayılan değer: `true`.

### Eksiye Düşemeye İzin Verme
- **ID:** negativeQuantity
- **Açıklama:** Kayıp ürün fişinde eksiye düşmeye izin verilip verilmeyeceğini belirler. Varsayılan değer: `false`.

## Gün Sonu Parametreleri

### Merkez Kasa
- **ID:** SafeCenter
- **Açıklama:** Gün sonu işlemlerinde merkez kasayı tanımlar. Varsayılan değer: `"FB529408-4AE5-4B34-9262-7956E3477F47"`.

### Kredi Kartı Kasası
- **ID:** BankSafe
- **Açıklama:** Gün sonu işlemlerinde kredi kartı kasasını tanımlar. Varsayılan değer: `"3848A862-D4FF-4BAD-9AB1-C1A29D9BC7F3"`.

### Ticket Restorant Kasası
- **ID:** TicketRestSafe
- **Açıklama:** Gün sonu işlemlerinde Ticket Restorant kasasını tanımlar. Varsayılan değer: `"3848A862-D4FF-4BAD-9AB1-C1A29D9BC7F3"`.

### Çek Kasası
- **ID:** CheckSafe
- **Açıklama:** Gün sonu işlemlerinde çek kasasını tanımlar. Varsayılan değer: `"3848A862-D4FF-4BAD-9AB1-C1A29D9BC7F3"`.

### Avans Tutarı
- **ID:** advanceAmount
- **Açıklama:** Gün sonu işlemlerinde avans tutarını tanımlar. Varsayılan değer: `"450"`.

## Satış İrsaliye Parametreleri

### Eksiye Düşemeye İzin Verme
- **ID:** negativeQuantity
- **Açıklama:** Satış irsaliyesinde eksiye düşmeye izin verilip verilmeyeceğini belirler. Varsayılan değer: `false`.

### Depo
- **ID:** cmbDepot
- **Açıklama:** Satış irsaliyesinde depo bilgisini tanımlar. Varsayılan değer: `"EEB85132-6BCB-4C18-B6FA-46A1E0C1C813"`.

## Şube Satış İrsaliye Parametreleri

### Eksiye Düşemeye İzin Verme
- **ID:** negativeQuantity
- **Açıklama:** Şube satış irsaliyesinde eksiye düşmeye izin verilip verilmeyeceğini belirler. Varsayılan değer: `false`.

### Otomatik mail gönderme
- **ID:** autoMailSend
- **Açıklama:** Şube satış irsaliyesinde otomatik mail gönderme özelliğini etkinleştirir. Varsayılan değer: `true`.

## Alış Anlaşması Parametreleri

### Depo
- **ID:** cmbDepot
- **Açıklama:** Alış anlaşmasında depo bilgisini tanımlar. Varsayılan değer: `"1A428DFC-48A9-4AC6-AF20-4D0A4D33F316"`.

## Satış Anlaşması Parametreleri

### Depo
- **ID:** cmbDepot
- **Açıklama:** Satış anlaşmasında depo bilgisini tanımlar. Varsayılan değer: `"1A428DFC-48A9-4AC6-AF20-4D0A4D33F316"`.

### İzin Verilen En Yüksek İndirim Yüzde
- **ID:** maxDiscount
- **Açıklama:** Satış anlaşmasında izin verilen en yüksek indirim yüzdesini tanımlar. Varsayılan değer: `30`.

## Özel Etiket Basımı Parametreleri

### Maliyet Fiyatından Düşük Etikete İzin Verme
- **ID:** underMinCostPrice
- **Açıklama:** Özel etiket basımında maliyet fiyatından düşük etikete izin verilip verilmeyeceğini belirler. Varsayılan değer: `false`.

## Stok Çıkış Fişi Parametreleri

### Eksiye Düşemeye İzin Verme
- **ID:** negativeQuantity
- **Açıklama:** Stok çıkış fişinde eksiye düşmeye izin verilip verilmeyeceğini belirler. Varsayılan değer: `false`.

## Ürün Giriş Çıkış Fişi Parametreleri

### Eksiye Düşemeye İzin Verme
- **ID:** negativeQuantity
- **Açıklama:** Ürün giriş çıkış fişinde eksiye düşmeye izin verilip verilmeyeceğini belirler. Varsayılan değer: `false`.

### Depo
- **ID:** cmbDepot
- **Açıklama:** Ürün giriş çıkış fişinde depo bilgisini tanımlar. Varsayılan değer: `"00000000-0000-0000-0000-000000000000"`.

## Toplu Tahsilat Giriş Parametreleri

### Seri
- **ID:** txtRef
- **Açıklama:** Toplu tahsilat girişinde seri bilgisini tanımlar. Varsayılan değer: `""`.

### Excel Formatı
- **ID:** excelFormat
- **Açıklama:** Toplu tahsilat girişinde Excel formatını tanımlar. Varsayılan değerler: `DATE:'DATE', DESC:'DESC', AMOUNT:'AMOUNT'`.

## Tax Sugar Report Parametreleri

### Tax Sugar Uygulanacak Gruplar
- **ID:** taxSugarGroupValidation
- **Açıklama:** Tax Sugar raporunda uygulanacak grupları tanımlar.

## Satış Sipariş Parametreleri

### Kapanmış Sipaişleri Gösterme
- **ID:** closedOrder
- **Açıklama:** Satış siparişinde kapanmış siparişlerin gösterilip gösterilmeyeceğini belirler. Varsayılan değer: `true`.

### Depo
- **ID:** cmbDepot
- **Açıklama:** Satış siparişinde depo bilgisini tanımlar. Varsayılan değer: `"EEB85132-6BCB-4C18-B6FA-46A1E0C1C813"`.

## Alış Sipariş Parametreleri

### Depo
- **ID:** cmbDepot
- **Açıklama:** Alış siparişinde depo bilgisini tanımlar. Varsayılan değer: `"EEB85132-6BCB-4C18-B6FA-46A1E0C1C813"`.

## Alış İrsaliye Parametreleri

### Depo
- **ID:** cmbDepot
- **Açıklama:** Alış irsaliyesinde depo bilgisini tanımlar. Varsayılan değer: `"EEB85132-6BCB-4C18-B6FA-46A1E0C1C813"`.

## Satış Teklif Parametreleri

### Depo
- **ID:** cmbDepot
- **Açıklama:** Satış teklifinde depo bilgisini tanımlar. Varsayılan değer: `"EEB85132-6BCB-4C18-B6FA-46A1E0C1C813"`.

### Mail Açıklaması
- **ID:** mailText
- **Açıklama:** Satış teklifinde mail açıklamasını tanımlar. Varsayılan değer: `""`.

## Satış Sipariş Onaylama Parametreleri

### Depo
- **ID:** cmbDepot
- **Açıklama:** Satış sipariş onaylamada depo bilgisini tanımlar. Varsayılan değer: `"EEB85132-6BCB-4C18-B6FA-46A1E0C1C813"`.

### Yazdırma Dizaynı Tagı
- **ID:** printDesing
- **Açıklama:** Satış sipariş onaylamada yazdırma dizaynı tagını tanımlar. Varsayılan değer: `"55"`.
