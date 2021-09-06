export default 
[
    {
        name : "DEPOT",
        selectCmd : 
        {
            query : "SELECT * FROM DEPOT"
        },
        insertCmd : 
        {
            query:  "INSERT INTO [DEPOT] (" +
                    " [CUSER] " +
                    ",[CDATE] " +
                    ",[LUSER] " +
                    ",[LDATE] " +
                    ",[TYPE] " +
                    ",[CODE] " +
                    ",[NAME] " +
                    ") VALUES ( " +
                    "'ADMIN' " +
                    ",GETDATE() " + 
                    ",'ADMIN' " +
                    ",GETDATE() " + 
                    ",0 " +
                    ",@CODE " +
                    ",@NAME " +
                    ")",
            param: ['CODE:string|25','NAME:string|50']
        },
        updateCmd :
        {
            query: "UPDATE DEPOT SET NAME = @NAME WHERE GUID = @GUID",
            param: ['NAME:string|50','GUID:string|50']
        }
    }
]