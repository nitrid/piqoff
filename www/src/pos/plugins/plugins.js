import App from '../lib/app.js';

const orgInit = App.prototype.init
function cordovaConfigRead()
{
  return new Promise((resolve) => 
  {
    document.addEventListener('deviceready', function() 
    {
      window.resolveLocalFileSystemURL("file://" + localStorage.getItem("path") + "/public/config.js", 
      function(fileEntry) 
      {        
        fileEntry.file(function(file) 
        {
          var reader = new FileReader();
          reader.onloadend = function() 
          {
            resolve(this.result)
          };
          reader.readAsText(file);
        }, 
        function(error) 
        {
          console.error("Dosya okuma hatası:", error);
          resolve('');
        });
      }, 
      function(error) 
      {
        console.log('Dosya mevcut değil veya erişim hatası:', error);
        resolve('');
      });
    })
  })
}
App.prototype.init = async function()
{
  orgInit.call(this);
  
  let plugins = [];
  let pluginsConf;
  let response;
  let configText;
  let configPath;

  try 
  {
    if(typeof window.cordova !== 'undefined') 
    {
      console.log("Cordova ortamında çalışıyor");
      configText = await cordovaConfigRead();
    }
    else if(typeof App.instance.electron?.ipcRenderer != 'undefined') 
    {
      console.log("Electron ortamında çalışıyor");
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

      response = await fetch(configPath);
      configText = await response.text();
    } 
    else 
    {
      console.log("Web ortamında çalışıyor");
      configPath = '/config.js';

      response = await fetch(configPath);
      configText = await response.text();
    }
    pluginsConf = eval('(' + configText.replace('export default','').replace(/;$/, '') + ')');
  } 
  catch (error) 
  {
    console.log("Hata:", error);
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