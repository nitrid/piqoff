const { spawn } = require('child_process');
const path = require('path');

try 
{
    console.log('Restart script başlatıldı');
    
    // Kalıcı batch dosyasını çalıştır
    spawn('cmd.exe', ['/c', 'start', '/b', path.join(__dirname, 'restart.bat')], 
    {
        detached: true,
        stdio: 'ignore',
        windowsHide: true
    }).unref();

    process.exit(0);
}
catch (error)
{
    console.log('Hata:', error);
    process.exit(1);
} 