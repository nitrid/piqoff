import App from '../lib/app.js';

const orgInit = App.prototype.init

App.prototype.init = async function()
{
  orgInit.call(this);
  
  let plugins = [];
  let pluginsConf;

  try 
  {
    let configPath;
    if(typeof App.instance.electron?.ipcRenderer != 'undefined') 
    {
      configPath = 'file://' + process.cwd() + '/public/config.js';
      const fs = window.require('fs');
      
      if (fs.existsSync(process.cwd() + '/config.json')) 
      {
        try 
        {
          const configData = JSON.parse(fs.readFileSync(process.cwd() + '/config.json', 'utf8'));
          if(configData.local === false)
          {
            configPath = '/config.js';
          }
        }
        catch(err) 
        {
          console.error('Error reading config.json:', err);
        }
      }
    } 
    else 
    {
      configPath = '/config.js';
    }
    const response = await fetch(configPath);
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
    
    if(fileName != 'plugins' && typeof pluginsConf?.plugins?.pos != 'undefined' && pluginsConf?.plugins?.pos[fileName])
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
    
  }

  const loadedPlugins = await Promise.all(plugins.map(plugin => plugin()));
}