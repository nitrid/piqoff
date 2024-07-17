import {core} from 'gensrv'
import cron from 'node-cron';

class customerpoint
{
    constructor()
    {
        this.core = core.instance;
        this.connEvt = this.connEvt.bind(this)
        this.core.socket.on('connection',this.connEvt)

        this.processRun()
    }
    connEvt(pSocket)
    {       
        
    }
    async processRun()
    {
        cron.schedule('0 1 1 2 *', async () => 
        {
            try
            {
                let tmpCustomerQuery = 
                {
                    query : "SELECT GUID FROM CUSTOMERS WHERE DELETED = 0"
                }

                let tmpResultCustomer = await core.instance.sql.execute(tmpCustomerQuery)

                if(typeof tmpResultCustomer.result.err == 'undefined' && tmpResultCustomer.result.recordset.length > 0)
                {
                    for (let i = 0; i < tmpResultCustomer.result.recordset.length; i++) 
                    {
                        let tmpQuery = 
                        {
                            query : "SELECT ISNULL(SUM(CASE WHEN TYPE = 0 THEN POINT ELSE POINT * -1 END),0) AS POINT FROM CUSTOMER_POINT WHERE CUSTOMER = '" + tmpResultCustomer.result.recordset[i].GUID + "' AND DELETED = 0 " +
                                    "UNION ALL " +
                                    "SELECT ISNULL(SUM(CASE WHEN TYPE = 0 THEN POINT ELSE POINT * -1 END),0) AS POINT FROM CUSTOMER_POINT WHERE CUSTOMER = '" + tmpResultCustomer.result.recordset[i].GUID + "' AND TYPE = 0 AND " +
                                    "CDATE >= CONVERT(NVARCHAR(4),YEAR(GETDATE())) + '0101' AND CDATE <= CONVERT(NVARCHAR(4),YEAR(GETDATE())) + '0131' AND DELETED = 0",
                        }
        
                        let tmpResult = await core.instance.sql.execute(tmpQuery)
                        
                        if(typeof tmpResult.result.err == 'undefined' && tmpResult.result.recordset.length > 0)
                        {
                            if(tmpResult.result.recordset[0].POINT > tmpResult.result.recordset[1].POINT)
                            {
                                let uuidv4 = ()=>
                                {
                                    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
                                        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
                                      ).toString().toUpperCase();
                                }
                                
                                let tmpInsertQuery = 
                                {
                                    query : "EXEC [dbo].[PRD_CUSTOMER_POINT_INSERT] " + 
                                            "@GUID = @PGUID, " + 
                                            "@CUSER = @PCUSER, " + 
                                            "@TYPE = @PTYPE, " +     
                                            "@CUSTOMER = @PCUSTOMER, " +                  
                                            "@DOC = @PDOC, " + 
                                            "@POINT = @PPOINT, " + 
                                            "@DESCRIPTION = @PDESCRIPTION ", 
                                    param : ['PGUID:string|50','PCUSER:string|25','PTYPE:int','PCUSTOMER:string|50','PDOC:string|50','PPOINT:float','PDESCRIPTION:string|250'],
                                    value : [uuidv4(),'Admin',1,tmpResultCustomer.result.recordset[i].GUID,'00000000-0000-0000-0000-000000000000',Number(tmpResult.result.recordset[0].POINT) - Number(tmpResult.result.recordset[1].POINT),'TRANSFER'],
                                }
                                await core.instance.sql.execute(tmpInsertQuery)

                                let tmpUpdateQuery = 
                                {
                                    query : "UPDATE CUSTOMERS SET POINT = (SELECT dbo.FN_CUSTOMER_TOTAL_POINT(GUID,GETDATE())) WHERE GUID = @CUSTOMER", 
                                    param : ['CUSTOMER:string|50'],
                                    value : [tmpResultCustomer.result.recordset[i].GUID],
                                }
                                await core.instance.sql.execute(tmpUpdateQuery)
                            }
                        }
                    }
                }
            }
            catch (err) 
            {
                console.log(err);
            }
        });
        
    }
}
export const _customerpoint = new customerpoint()