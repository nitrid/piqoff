webpack config -> https://medium.com/@JedaiSaboteur/creating-a-react-app-from-scratch-f3c693b84658

# KREDI KARTI İŞLEM ŞEMASI 
-PROGRAM-           -CİHAZ-
    ENQ     ->      
            <-      ACK
    DATA    ->      
            <-      ACK
    EOT     ->      
            <-      ENQ
    ACK     ->      
            <-      RESULT

# TSE USB İÇİN KURULUM
Almanya da kullanılan TSE Usb stick için kurulum yönergeleri.
- DN_CDC_Virtual_COM_Port-1.0.0.0-2-setup kurulumu yapılacak.
- DN-TSE-Webservice-1.19.2-9-setup kurulumu yapılacak.
- http://127.0.0.1:10001/test-mf-public.html adresine girip sırasıyla burdan usb nin 
  setDefaultClientId ve Initalize butonuna basılıp cihaz ayarlanacak.
- Imzaların base64 formatında çıktısı için C:\Program Files (x86)\DieboldNixdorf\TSE-Webservice\bin\dn_main_mf_ge dosyası
  açılacak ve burdaki driver.transaction.format=1 şeklinde ayarlanacak.
- Piqpos da TSEUsb parametresi true şeklinde ayarlanacak.
