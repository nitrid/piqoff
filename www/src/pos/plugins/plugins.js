const plugins = 
{
  balanceCounter : () => import('./balanceCounter.js'),
  cordovaDevice : () => import('./cordovaDevice.js'),
  // resto : () => import('./resto/main.js')
};
  
  export default plugins;