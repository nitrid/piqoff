import App from '../../lib/app.js'

const orgInit = App.prototype.init
App.prototype.init = function()
{
    console.log(1453)
    orgInit.call(this)
}