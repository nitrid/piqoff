## PARAMETRE VIEW
    {
        TYPE : 0,
        ID :"onlyBigChar",
        VALUE : 
        {
            value : true
        },
        APP : "OFF",
        VIEW : 
        {
            TYPE : "checkbox",
            PAGE_NAME : "Sistem",
            CAPTION : "Sadece Büyük Harf Kullanımı"
        }
    },
### TYPE -> CHECK
- Meta param dosyasında iki tip VALUE olabilir.
    - true/false
    - {value : true/false}
- Meta param dosyasındaki VIEW.TYPE = 'checkbox'
### TYPE -> TEXT
- Meta param dosyasında iki tip VALUE olabilir.
    - 'text değeri'
    - {value : 'text değeri'}
- Meta param dosyasındaki VIEW.TYPE = 'text'
### TYPE -> POPINPUT
- popInput obje şeklinde tutulan datalar için kullanılır. Obje içerisinde bir den fazla veri tipi tutulabilir,
  bunlar aşağıdaki gibidir;
    - checkbox
    - text
    - popSelect
    - combobox
- Meta param dosyasındaki VIEW.TYPE = 'popInput'
- VIEW.FORM içerisinde açılacak popup ın içeriği ve stili belirlenebilir.    
    ``` js
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
    ```