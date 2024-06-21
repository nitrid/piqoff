import {posLcdCls,posScaleCls} from "../../core/cls/scale.js";
import {posDeviceCls} from "../../core/cls/pos.js";

const orgLcdPrint = posLcdCls.prototype.print
const orgEscPrinter = posDeviceCls.prototype.escPrinter
const orgMettlerScaleSend = posScaleCls.prototype.mettlerScaleSend

posLcdCls.prototype.print = async function(pData)
{
    if(window.SerialUSBPlugin)
    {
        window.SerialUSBPlugin.list(function(devices) 
        {
            console.log(devices)
            let vendorId = 1659;
            let productId = 9123;

            window.SerialUSBPlugin.requestPermission(vendorId, productId, function(permissionMessage) 
            {
                window.SerialUSBPlugin.open(vendorId, productId, function(connectMessage) 
                {
                    window.SerialUSBPlugin.write('\x0c');
                    window.SerialUSBPlugin.write(pData.text);
                    setTimeout(() => 
                    {
                        window.SerialUSBPlugin.close();  
                    }, 100);
                });
            }, function(permissionError) 
            {
                console.error(permissionError);
            });
        })
    }
    else
    {
        orgLcdPrint.call(this,pData)
    }
}
posDeviceCls.prototype.escPrinter = async function(pData)
{
    return new Promise(async resolve => 
    {
        if(window.SerialUSBPlugin)
        {
            let vendorId = 1208;
            let productId = 3624;

            window.SerialUSBPlugin.requestPermission(vendorId, productId, function(permissionMessage) 
            {
                window.SerialUSBPlugin.open(vendorId, productId, async function(connectMessage) 
                {
                    let tmpArr = [];
                    for (let i = 0; i < pData.length; i++) 
                    {
                        let tmpObj = pData[i]
                        if(typeof pData[i] == 'function')
                        {
                            tmpObj = pData[i]()
                        }
                        if(Array.isArray(tmpObj))
                        {
                            tmpArr.push(...tmpObj)
                        }
                        else if(typeof tmpObj == 'object')
                        {
                            tmpArr.push(tmpObj)
                        }
                    }
                    
                    for (let i = 0; i < tmpArr.length; i++) 
                    {   
                        console.log(tmpArr[i].logo)
                        if(typeof tmpArr[i].barcode != 'undefined')
                        {
                            if(typeof tmpArr[i].align != 'undefined')
                            {
                                tmpArr[i].options.align = tmpArr[i].align    
                            }
                            window.SerialUSBPlugin.printBarcode(tmpArr[i].barcode,'CODE39',tmpArr[i].options)
                        }
                        else if(typeof tmpArr[i].logo != 'undefined')
                        {
                            await window.SerialUSBPlugin.printImage(tmpArr[i].logo, 's8')
                        }
                        else    
                        {
                            if(typeof tmpArr[i].style == 'undefined')
                            {
                                tmpArr[i].style = "normal";
                            }
                            if(typeof tmpArr[i].size == 'undefined')
                            {
                                tmpArr[i].size = [0,0]
                            }
    
                            window.SerialUSBPlugin.print(tmpArr[i]);
                        }                        
                    }                      
                    console.log(3)
                    window.SerialUSBPlugin.cut();
                    window.SerialUSBPlugin.close();
                    resolve();
                });
            },function(permissionError) 
            {
                resolve();
                console.error(permissionError);
            });
        }
        else
        {
            resolve(orgEscPrinter.call(this, pData))
        }
    })
    
}
posScaleCls.prototype.mettlerScaleSend = async function(pPrice)
{
    if(window.SerialUSBPlugin)
    {
        let vendorId = 1659;
        let productId = 8963;

        let toHex = (pStr) =>
        {
            let result = '';
            for (let i = 0; i < pStr.length; i++) 
            {
                result += pStr.charCodeAt(i).toString(16);
            }
            return result;
        }
        let Ror16 = (pData,pDistance) =>
        {
            pDistance &= 15;
            pData &= 0xFFFF;
            return (pData >> pDistance) | (pData << (16 - pDistance));
        }
        let Rol16 = (pData,pDistance) =>
        {
            pDistance &= 15;
            pData &= 0xFFFF;
            return (pData << pDistance) | (pData >> (16 - pDistance));
        }

        let TmpPrice = parseInt(pPrice * 100).toString().padStart(6, '0');
        let ReciveBuffer = '';
        
        return new Promise((resolve) =>
        {
            console.log(1)
            window.SerialUSBPlugin.requestPermission(vendorId, productId, function(permissionMessage) 
            {
                console.log(2)
                window.SerialUSBPlugin.open(vendorId, productId, function(connectMessage) 
                {
                    console.log(3)
                    // Teraziye fiyat gönderiliyor
                    window.SerialUSBPlugin.write(`\x04\x02\x01\x1B${TmpPrice}\x1B\x03`);
                    console.log(4)
                    window.SerialUSBPlugin.read((line) => 
                    {
                        console.log(5)
                        console.log(line)
                        line = new TextDecoder().decode(line);
                        // Teraziden onay geldiğinde
                        if (toHex(line) === "6") 
                        {
                            window.SerialUSBPlugin.write('\x04\x05');
                        }
                        // Teraziden onay gelmediğinde
                        else if (toHex(line) === "15") 
                        {
                            window.SerialUSBPlugin.write(`\x04\x02\x01\x1B${TmpPrice}\x1B\x03`);
                        }
                        
                        // Validasyon işlemi başlangıç
                        if (line.substring(1, 3) === "11") 
                        {
                            if (line.substring(4, 5) === "2") 
                            {
                                let cs = ("000" + parseInt(Rol16(0x2C3C, line.substring(5, 6)) & 0xFFFF).toString(16)).slice(-4).toString().toUpperCase();
                                let kw = ("000" + parseInt(Ror16(0xFA07, line.substring(6, 7)) & 0xFFFF).toString(16)).slice(-4).toString().toUpperCase();
                                let cskw = cs + kw;
                                window.SerialUSBPlugin.write(`\x04\x02\x10\x1B${cskw}\x03`);
                            } 
                            else if (line.substring(4, 5) === "0") 
                            {
                                window.SerialUSBPlugin.write(`\x04\x02\x01\x1B${TmpPrice}\x1B\x03`);
                            } 
                            else if (line.substring(4, 5) === "1") 
                            {
                                console.log("Validasyon Başarılı");
                                let TmpResult = 
                                {
                                    Type: "01",
                                    Result: 
                                    {
                                        Msg: "Validasyon Başarılı"
                                    }
                                };
                                resolve(TmpResult);
                                window.SerialUSBPlugin.close(() => console.log('Port kapatıldı.'));
                            }
                        }
                        // Terazi sonuç döndüğünde
                        if (line.substring(1, 3) === "02" || ReciveBuffer.substring(1, 3) === "02") 
                        {
                            ReciveBuffer += line;
                            if (ReciveBuffer.length >= 26) 
                            {
                                let TmpScale = ReciveBuffer.substring(6, 11);
                                let TmpPrice = ReciveBuffer.substring(12, 18);
                                let TmpAmount = ReciveBuffer.substring(19, 25);

                                let TmpResult = 
                                {
                                    Type: "02",
                                    Result: 
                                    {
                                        Scale: TmpScale / 1000,
                                        Price: TmpPrice / 100,
                                        Amount: TmpAmount / 100
                                    }
                                };

                                resolve(TmpResult);
                                ReciveBuffer = '';
                                window.SerialUSBPlugin.close(() => console.log('Port kapatıldı.'));
                            }
                        }
                    });
                    setTimeout(() => 
                    {
                        window.SerialUSBPlugin.close(() => console.log('Zaman aşımı nedeniyle port kapatıldı.'));
                    }, 20000);
                });
            })
        });
        
    }
    else
    {
        resolve(orgMettlerScaleSend.call(this, pData))
    }
}