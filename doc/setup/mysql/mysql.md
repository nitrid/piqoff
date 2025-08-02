# EXPORT DATA
- C:\Program Files\MySQL\MySQL Server 8.0\bin>mysqldump -u root -p dbname > outfile.sql
# IMPORT DATA
- fruits database oluşturulacak.
- C:\Program Files\MySQL\MySQL Server 8.0\bin>mysql -u root -p fruits < outfile.sql
# ROOT CHANGE PASSWORD
- MySql servisi stop edilecek.,
- UPDATE mysql.user SET Password=PASSWORD('MyNewPass') WHERE User='root';
  FLUSH PRIVILEGES;
  C:\mysql-init.txt dosyasına kayıt edilecek.
- command propt dan C:\mysql\bin\mysqld --init-file=C:\mysql-init.txt çalıştırılacak.
# MYSQL ILE MSSQL İ BAĞLAMAK
- mysql-connector-odbc-5.1.8-winx64 kurulacak.
- Denetim masası -> Windows Araçları -> ODBC Veri Kaynakları (64 bit) -> System DNS yeni bir sürücü eklenecek.
- MySql ODBC 5.x.x Driver seçilecek.
- Burdaki bilgiler girilecek mysql e connection sağlanacak. (Resim1)
- Microsoft Sql Server Managment Studio açılacak ve veritabanına connect oldukdan sonra 
  Server Objects -> Linked Servers -> Providers altındaki MSDASQL Resim2 deki gibi olacak.
- Linked Servers da sağ tuş yapıp New Linked Server a basılacak.
- Burdaki ilk ekranda bilgiler Resim3 deki gibi girilecek. Dikkat edilmesi gereken MySql ODBC Driver System DNS de 
  ayarlanırken verilen isim buralara da verilecek.
- Security bölümü Resim4 deki gibi ayarlanacak.
- Server Options bölümü Resim5 deki gibi ayarlanacak ve Ok butonuna basıldığında başarılı şekilde eklenmiş olacaktır.


# RESIM AKTARIMI
- Resimler mysql ile connectoru yapıldıı yerde uygulamada _0.jpg yazarak aktarılır