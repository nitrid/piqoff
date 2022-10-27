import {core} from 'gensrv'

const test = async() =>
{
    let tmpQuery = 
    {
        query : "SELECT TOP 100 * FROM ITEMS"
    }
    let rst = await core.instance.sql.execute(tmpQuery)
    console.log(rst)
}

core.instance.on('onSqlConnected',(status)=>
{
    console.log(status)
    test()
})