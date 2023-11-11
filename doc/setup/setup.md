## KURULUM
- Mssql ve managment studio kurulacak.
- Github desktop kurulacak.
- Visual studio kurulacak.
- Nodejs kurulacak.
- Sql managment studio dan sql şifresi belirlenecek ve sql ayarlarından Sql server and windows auth. mode yapılacak.
- Sql configuration manager dan network configuration bölümünden tcpip ve namepipes enable edilecek.
- Database setup klasörü altındaki scriptten kurulacak
- Üstüne en güncel dac dosyası ile güncelleme yapılacak
- Github dan piqoff main alınacak ve müşteri için yeni bir branch oluşturulacak.
- Visual studio da piqoff açılacak config.js düzenlenecek.
- piqoff klasörünün içerisinde konsol da npm i yapıp kurulacak.
- piqoff/www klasörünün içerisinde npm i --force yapılacak.
- piqoff/www klasörünün içerisinde npm run build yapılacak.

## KURULUM SONRASI
- Firma bilgileri tanımlanacak.
- Eğer marketse kasalar için pos kasası tanımlanacak.

## AKTARIM
- doc/setup altındaki myssql klasöründe bulunna resimler ve döküman yardımıyla mysql datası MSSQL e bağlanacak.
- NitroDBT kurulacak. 
- Veritabanı ayarları yapılarak aktarım yapılacak.

## AKTARIM SONRASI YAPILACAKLAR
- Kasada tartil işaretiliyse birinci birim kiloya çevrilecek
    - UPDATE ITEM_UNIT SET ID = '002' WHERE TYPE = 0 AND ITEM IN (SELECT ITEM FROM ITEMS_SHOP WHERE WEIGHING = 1)
- Müşteri isimleri kontrol edilecek
- Toptancı mi tedarikçi mi kontrol edilecek
- Puanlar excelden alinacak.
- Kendi adına olusturulan toptancı ya tedarikçi olarak gelecek. Aşağıdaki 2 sorgu ile tedarikci kodu ve tedarikci fiyatı oluşturulacak.
    -   INSERT INTO ITEM_MULTICODE
        SELECT 
        NEWID(),
        GETDATE(),
        'Admin',
        GETDATE(),
        'Admin',
        GUID,
        'BURAYA OLUSAN TEDARIKCININ GUID',
        CODE,
        0 FROM ITEMS
    -   INSERT INTO ITEM_PRICE
        SELECT 
        NEWID(),
        GETDATE(),
        'Admin',
        GETDATE(),
        'Admin',
        1,
        '00000000-0000-0000-0000-000000000000',
        '1970-01-01 00:00:00.000',
        '1970-01-01 00:00:00.000',
        COST_PRICE,
        1,
        'BURAYA OLUSAN TEDARIKCININ GUID',
        GETDATE(),
        0 
        FROM ITEMS
- Birimler kontrol edilecek
- Vergi oranları kontrol edilecek
- İsimlerde Büyük harfe cerilecek ve Türkçe karakter silinecek
    - UPDATE ITEMS SET NAME = UPPER(NAME)
- Kasap terazisinden tartilacak ürünlerde special atilacak.
    - UPDATE ITEMS SET SPECIAL = SUBSTRING(CODE,2,LEN(CODE)) WHERE CODE LIKE 'B0%'
- Bizim yaptığımız exe application ile fotoraflar aktarılacak.
- Puanlar CUSTOMERS tablosuna update edilecek.
    - UPDATE CUSTOMERS SET POINT = (SELECT dbo.FN_CUSTOMER_TOTAL_POINT(GUID,GETDATE()))
- Puanlar sıfırlanacak. puan parametresine piqsoft a geçiş tarihi yapılıp güncellenecek.