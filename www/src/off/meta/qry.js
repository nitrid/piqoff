export const qry =
{
    StokGetir : 
    {
        query : "SELECT * FROM ITEMS_VW_01 WHERE CODE = @CODE",
        param : ['CODE:string|25']
    }
}