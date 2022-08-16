var Service = require('node-windows').Service;
const path = require('path');

var svc = new Service
({
    name:'piqsoft',
    description: 'piqsoft service.',
    script: path.join(process.cwd(), '..\\server.js'),
    env: 
    [
        {
            name: 'APP_DIR_PATH',
            value: path.join(process.cwd(), '..\\')
        }
    ]
});

svc.on('install',function()
{
    svc.start();
});

svc.install();