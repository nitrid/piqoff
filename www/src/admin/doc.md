## PARAMETRE VIEW
- **TYPE :**
    - 0 = Sistem.
    - 1 = Evrak.
    - 2 = Element.
- **ID :** Parametrenin benzersiz kimliği. kod içerisinde bu id üzerinden parametreye erişilir. 
- **VALUE :** Parametrenin değeri. 5 tip de değer alabilir.
    - boolean
    - string
    - number
    - object
    - array
- **SPECIAL :** Özel değer yada serbest alan. istenirse kullanılabilir.
- **ELEMENT ** : Ekran üzerindeki textbox,combobox,label vs. gibi elementlerin id si burada tutulur TYPE => 2 olan element
  parametreleri için kullanılır.
- **APP ** : Parametrenin geçerli olduğu uygulama kısa kodu. Örn:OFF yada POS
- **VIEW ** : Admin sayfasındaki parametre düzenleme ekranındaki sayfa düzeni ve içeriği buradan belirlenir. 
- **VIEW.CAPTION ** : Parametre düzenleme ekranındaki parametrenin görünen adı.

### VIEW.TYPE -> CHECK
- Meta param dosyasında iki tip VALUE olabilir.
    - true/false
    - {value : true/false}
- Meta param dosyasındaki VIEW.TYPE = 'checkbox'
### VIEW.TYPE -> TEXT
- Meta param dosyasında iki tip VALUE olabilir.
    - 'text değeri'
    - {value : 'text değeri'}
- Meta param dosyasındaki VIEW.TYPE = 'text'
### VIEW.TYPE -> POPSELECT
- Meta param dosyasında 3 tip VALUE olabilir.
    - 'text değeri'
    - {name:'value'}
    - [{name:'value'}]
- Meta param dosyasındaki VIEW.TYPE = 'popSelect'
- Textbox şeklinde olan element içerisindeki butona bastığında popup şeklinde seçim grid listesi getirir. 
  Bu listeden seçilen data VIEW.FORM daki parametrelere göre VALUE elemanına text,obje yada dizi olarak 
  textbox ın obj elemanına atar.
- VIEW.FORM içerisinde açılacak popup ın içeriği ve stili belirlenebilir.
    - **VIEW.DISPLAY :** Textbox içerisinde gözükecek değerin grid datadaki field adı belirtilir. Eğer FIELD
      değeri belirtilmiş ise FIELD daki kolon değeri textbox üzerinde gözükür.
    - **VIEW.FIELD :** Eğer atanacak değer string ise, grid deki kolon adı girilir. FIELD obje ve dizi veri
      tipleri için geçerli değildir.
    - **VIEW.FORM.selection :** Grid de çoklu seçim yada tekli seçimi belirtir. Eğer çoklu seçim ise değer olarak 
      VALUE ya dizi ataması yapılır. Default olarak çoklu seçim dir.
      Kullanım şekli :
      - Tek seçim : {mode:'single'}
      - Çoklu seçim : {mode:'multiple'}
    - **VIEW.FORM.width :** Açılan popup ın genişliği.
    - **VIEW.FORM.height :** Açılan popup in yüksekliği.
    - **VIEW.FORM.data :** Grid içerisine gelecek datanın kaynağı belirtilir.
        - Veritabanı kullanımı : {select:{query : 'SELECT CODE,NAME FROM USERS ORDER BY CODE ASC'}},
        - Statik data : [{CODE:'001',NAME:'XXX'}]
    
    **NOT : Obje ve dizi kullanımında FIELD elemanını kaldırın. FIELD yanlızca string değer için geçerlidir.**
    
    EXAMPLE : 
    ``` js
    {
        TYPE : 0,
        ID :"Stoks",
        VALUE : "001",
        SPECIAL : "",
        ELEMENT : "",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "popSelect",
            PAGE_NAME : "Sistem",
            CAPTION : "Stok",
            DISPLAY : "CODE",
            FIELD : "CODE",
            FORM: 
            {
                selection:{mode:"single"},
                width:"600",
                height:"500",
                data:
                {
                    select:
                    {
                        query : "SELECT CODE,NAME FROM USERS ORDER BY CODE ASC"
                    },
                },
            }
        }
    }
    ```
### VIEW.TYPE -> POPINPUT
- popInput obje şeklinde tutulan datalar için kullanılır. Obje içerisinde bir den fazla veri tipi tutulabilir,
  bunlar aşağıdaki gibidir;
    - checkbox
    - text
    - popSelect
    - combobox
- Meta param dosyasındaki VIEW.TYPE = 'popInput'
- Textbox şeklinde olan element içerisindeki butona bastığında popup şeklinde form açılır. Girilen değerler textbox 
  nesnesine obj elemanına aktarılır.
- VIEW.FORM içerisinde açılacak popup ın içeriği ve stili belirlenebilir.
    - **VIEW.DISPLAY :** Textbox içerisinde gözükecek değerin datadaki field adı belirtilir.
    - **VIEW.FORM.width :** Açılan popup ın genişliği.
    - **VIEW.FORM.height :** Açılan popup in yüksekliği.
    - **VIEW.FORM.item :** Dizi içerisinde form elemanlarının tipi,başlığı vs. şeklinde özellikleri belirlenir.
    - **VIEW.FORM.item.type :** text - checkbox - popSelect - combobox
    - **VIEW.FORM.item.caption :** Form elemanın label başlığı.
    - **VIEW.FORM.item.field :** Form elemanın değerine atanacak obje adı.
    - **VIEW.FORM.item.id :** Form elemanın benzersiz kimlik adı.
    ``` js
     {
        TYPE : 0,
        ID :"MoneySymbol",
        VALUE : {code:"EUR",sign:"€"},
        SPECIAL : "",
        ELEMENT : "",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "popInput",
            PAGE_NAME : "System",
            CAPTION : "Money Sign",
            DISPLAY : "code",
            FORM: 
            {
                width:"400",
                height:"180",
                item:
                [
                    {type:"text",caption:"Code",field:"code",id:"txtPopMoneySymbolCode"},
                    {type:"text",caption:"Sign",field:"sign",id:"txtPopMoneySymbolSign"}
                ]
            }
        }
     }
    ```