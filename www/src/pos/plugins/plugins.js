const plugins = 
{
  balanceCounter : () => import('./balanceCounter.js'),
  wgtSalesDispatch : () => import('./wgtSaleDispatch/main.js'),
  wgtPersonTrack : () => import('./wgtPersonTrack/main.js'),
  wgtEndOfDay : () => import('./wgtEndOfDay/main.js'),
  mrminit : () => import('./mrminit/main.js')
};
  
export default plugins;