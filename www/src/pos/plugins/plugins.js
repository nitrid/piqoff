const plugins = 
{
  balanceCounter : () => import('./balanceCounter.js'),
  wgtSalesDispatch : () => import('./wgtSaleDispatch/main.js')
};
  
  export default plugins;