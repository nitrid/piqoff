import App from '../lib/app.js';

const orgInit = App.prototype.init

App.prototype.init = async function()
{
  orgInit.call(this);
  const plugins = [];

  const pluginsContext = require.context('./', false, /\.js$/);
  pluginsContext.keys().forEach((key) => 
  {
    plugins.push(() => pluginsContext(key));
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