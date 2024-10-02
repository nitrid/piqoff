import App from '../lib/app.js';

const orgInit = App.prototype.init

App.prototype.init = async function()
{
  orgInit.call(this);
  
  let plugins = [];
  let pluginsConf;

  try 
  {
    pluginsConf = (await import('../../config.js')).default;
  } 
  catch (error) 
  {
    pluginsConf = { plugins: [] };
  }
  console.log(pluginsConf.plugins)
  const pluginsContext = require.context('./', false, /\.js$/);
  pluginsContext.keys().forEach((key) => 
  {
    const fileName = key.replace('./', '').replace('.js', '');
    if(fileName != 'plugins' && pluginsConf.plugins.includes(fileName))
    {
      plugins.push(() => pluginsContext(key));
    }
  });

  try 
  {
    const privatePluginsContext = require.context('./private', false, /\.js$/);
    privatePluginsContext.keys().forEach((key) => 
    {
      plugins.push(() => privatePluginsContext(key));
    });
  } 
  catch (e) 
  {
    console.log('private klasörü bulunamadı veya boş.');
  }

  const loadedPlugins = await Promise.all(plugins.map(plugin => plugin()));
  console.log('Yüklenen pluginler:', loadedPlugins);
}