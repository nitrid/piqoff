const plugins = 
{
  balanceCounter : () => import('./balanceCounter.js'),
  wgtSalesDispatch : () => import('./wgtSaleDispatch/main.js'),
  mrminit : () => import('./mrminit/main.js')
};
  
export default plugins;