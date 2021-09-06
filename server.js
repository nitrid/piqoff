import server from 'gensrv'
import config from './config.js'
import fs from 'fs'

let gensrv = new server.default(config);
gensrv.listen(80);

//PLUGIN YAPISI ******************************/
fs.readdirSync('./plugins').forEach(file => 
{
    import('./plugins/' + file).then(module =>
    {
        Object.keys(module).forEach(element => 
        {
            gensrv.plugins[element] = new module[element];
        });
    })
});
//*******************************************/