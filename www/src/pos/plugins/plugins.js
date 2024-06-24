const plugins = 
{
  balanceCounter : () => import('./balanceCounter.js'),
  cordovaDevice : () => import('./cordovaDevice.js')
};
  
  export default plugins;