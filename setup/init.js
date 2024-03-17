const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
main()
// rl.question('Server adresini giriniz: ', (server) => {
//   rl.question('Veritabanı adını giriniz: ', (database) => {
//     // Burada config dosyasını güncelleyin
//     const configPath = path.join(__dirname, 'piqoff', 'config.js');
//     let configContent = fs.readFileSync(configPath, 'utf8');
//     configContent = configContent.replace('YOUR_SERVER_HERE', server);
//     configContent = configContent.replace('YOUR_DATABASE_HERE', database);
//     fs.writeFileSync(configPath, configContent);

//     // Veritabanı kurulumunu gerçekleştir
//     console.log('Veritabanı kurulumu yapılıyor...');
//     execSync('cd piqoff/setup && node setup.js', { stdio: 'inherit' });

//     // Kurulum tamamlandı
//     console.log('Kurulum tamamlandı!');
//     rl.close();
//   });
// });
async function main()
{
    console.log('Welcome to the Piqoff installation wizard.');
    let server = await questions('Sql Server : ')
    let database = await questions('Sql Database : ')
    await questions('Sql User : ')
    await questions('Sql Password : ')
    console.log(server)
    console.log(database)
}
function questions(pQuest)
{
    return new Promise((resolve) => 
    {
        rl.question(pQuest, (pVal) => 
        {
            resolve(pVal)
        })
    })
}