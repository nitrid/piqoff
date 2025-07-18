// DevExtreme 25.x uyumluluğu için polyfill
if (!Object.hasOwn) 
{
    Object.hasOwn = function(obj, prop) 
    {
        return Object.prototype.hasOwnProperty.call(obj, prop);
    };
}
import React from 'react';
import App from './lib/app.js'
import ReactDOM from 'react-dom';
import plugins from './plugins/plugins.js';

ReactDOM.render(<App />,document.getElementById("root"));