import React from 'react';
import App from './lib/app.js'
import ReactDOM from 'react-dom';
import plugins from './plugins/plugins.js';

async function loadPlugins() 
{
    const loadedPlugins = [];
    for (const key in plugins) 
    {
        const plugin = await plugins[key]();
        loadedPlugins.push(plugin);
    }
}
loadPlugins().then(() => 
{
    ReactDOM.render(<App />,document.getElementById("root"));
});