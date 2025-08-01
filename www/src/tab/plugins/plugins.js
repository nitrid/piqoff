import App from '../lib/app.js';

const orgInit = App.prototype.init

App.prototype.init = async function()
{
  orgInit.call(this);
  
  let plugins = [];
  let pluginsConf;

  try 
  {
    const response = await fetch('/config.js');
    const configText = await response.text();

    pluginsConf = eval('(' + configText.replace('export default','').replace(/;$/, '') + ')');
  } 
  catch (error) 
  {
    pluginsConf = { plugins: {} };
  }

  const pluginsContext = require.context('./', false, /\.js$/);

  pluginsContext.keys().forEach((key) => 
  {
    const fileName = key.replace('./', '').replace('.js', '');
    
    if(fileName != 'plugins' && typeof pluginsConf?.plugins?.tab != 'undefined' && pluginsConf?.plugins?.tab[fileName])
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
    console.log('error', e)
  }

  const loadedPlugins = await Promise.all(plugins.map(plugin => plugin()));
  console.log('loadedPlugins', loadedPlugins)
}