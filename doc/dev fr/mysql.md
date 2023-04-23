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
