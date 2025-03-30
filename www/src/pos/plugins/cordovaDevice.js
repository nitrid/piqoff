import {posLcdCls,posScaleCls} from "../../core/cls/scale.js";
import {posDeviceCls} from "../../core/cls/pos.js";

const orgLcdPrint = posLcdCls.prototype.print
const orgEscPrinter = posDeviceCls.prototype.escPrinter
const orgMettlerScaleSend = posScaleCls.prototype.mettlerScaleSend

posLcdCls.prototype.print = async function(pData)
{
    if(window.SerialUSBPlugin)
    {
        let vendorId = 0;
        let productId = 0;
        
        if(this.port != null && typeof this.port != 'undefined' && this.port.indexOf('|') > -1)
        {
            vendorId = this.port.split('|')[0];
            productId = this.port.split('|')[1];
        }
        else
        {
            console.error('vendorId - productId is invalid');
            return
        }
        // let vendorId = 1659;
        // let productId = 9123;
        console.log(vendorId, productId)
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
            let vendorId = 0;
            let productId = 0;

            if(this.dt()[0].PRINTER_PORT != null && typeof this.dt()[0].PRINTER_PORT != 'undefined' && this.dt()[0].PRINTER_PORT == "D3 MINI")
            {
                vendorId = -1;
                productId = -1;
            }
            else if(this.dt()[0].PRINTER_PORT != null && typeof this.dt()[0].PRINTER_PORT != 'undefined' && this.dt()[0].PRINTER_PORT.indexOf('|') > -1)
            {
                vendorId = this.dt()[0].PRINTER_PORT.split('|')[0];
                productId = this.dt()[0].PRINTER_PORT.split('|')[1];
            }
            else
            {
                console.error('vendorId - productId is invalid');
                resolve();
                return
            }

            if(vendorId == -1)
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
                    if(typeof tmpArr[i].barcode != 'undefined')
                    {
                        if(typeof tmpArr[i].align != 'undefined')
                        {
                            tmpArr[i].options.align = tmpArr[i].align    
                        }
                        window.SunmiPlugin.printBarcode(tmpArr[i].barcode,'CODE39',tmpArr[i].options)
                    }
                    else if(typeof tmpArr[i].logo != 'undefined')
                    {
                        await window.SunmiPlugin.printImage(tmpArr[i].logo, 's8')
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

                        window.SunmiPlugin.print(tmpArr[i]);
                    }                        
                }                      
                window.SunmiPlugin.cut();
                resolve();
            }
            else
            {
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
        let vendorId = 0;
        let productId = 0;

        if(this.port != null && typeof this.port != 'undefined' && this.port.indexOf('|') > -1)
        {
            vendorId = this.port.split('|')[0];
            productId = this.port.split('|')[1];
        }
        else
        {
            console.error('vendorId - productId is invalid');
            return
        }

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
            window.SerialUSBPlugin.requestPermission(vendorId, productId,async  function(permissionMessage) 
            {
                window.SerialUSBPlugin.open(vendorId, productId, async function(connectMessage) 
                {
                    // Teraziye fiyat gönderiliyor
                    await window.SerialUSBPlugin.writeS('01' + TmpPrice +'');
                    
                    let timeoutHandle = setTimeout(() => 
                    {
                        window.SerialUSBPlugin.close(() => console.log('Zaman aşımı nedeniyle port kapatıldı.'));
                    }, 20000);

                    window.SerialUSBPlugin.readS(async(line) =>
                    {
                        //TERAZİDEN ONAY GELDİĞİNDE..
                        if(toHex(line.toString()) == "6")
                        {
                            await window.SerialUSBPlugin.writeS('')
                        }
                        //TERAZİDEN ONAY GELMEDİĞİNDE
                        else if(toHex(line.toString()) == "15")
                        {
                            //TEKRAR FİYAT GÖNDERİLİYOR.
                            await window.SerialUSBPlugin.writeS('01' + TmpPrice +'');
                        }
                        //VALİDASYON İŞLEMİ BAŞLANGIÇ
                        if(line.toString().substring(1,3) == "11")
                        {
                            //VALİDASYON İÇİN GEREKLİ OLAN RANDOM NUMARA
                            if(line.toString().substring(4,5) == "2")
                            {      
                                //RANDOM NUMARA BİT ÇEVİRİM İŞLEMİ      
                                let cs = ("000" + parseInt(Rol16(0x2C3C, line.toString().substring(5,6)) & 0xFFFF).toString(16)).slice(-4).toString().toUpperCase();
                                let kw = ("000" + parseInt(Ror16(0xFA07, line.toString().substring(6,7)) & 0xFFFF).toString(16)).slice(-4).toString().toUpperCase();
                                let cskw = cs + kw;
                                //VALİDASYON CS VE KW GÖNDERİLİYOR 
                                await window.SerialUSBPlugin.writeS('10'+ cskw.toString() + '')
                            }
                            else if(line.toString().substring(4,5) == "0")
                            {
                                //VALİDASYON BAŞARISIZ DURUMU
                                //console.log("Validasyon Başarısız");
                                await window.SerialUSBPlugin.writeS('01' + TmpPrice +'');
                            }
                            else if(line.toString().substring(4,5) == "1")
                            {
                                //VALİDASYON BAŞARILI DURUMU
                                console.log("Validasyon Başarılı");
                                let TmpResult = 
                                {
                                    Type: "01",
                                    Result :
                                    {
                                        Msg : "Validasyon Başarılı"
                                    }                            
                                }
                                resolve(TmpResult);
                                clearTimeout(timeoutHandle);
                                window.SerialUSBPlugin.close();
                            }
                        }
                        //TERAZİ SONUÇ DÖNDÜĞÜNDE
                        if(line.toString().substring(1,3) == "02" || ReciveBuffer.substring(1,3) == "02")
                        {
                            ReciveBuffer += line.toString()
                            if(ReciveBuffer.length >= 26)
                            {
                                let TmpScale = ReciveBuffer.substring(6,11)
                                let TmpPrice = ReciveBuffer.substring(12,18)
                                let TmpAmount = ReciveBuffer.substring(19,25)
                                
                                let TmpResult = 
                                {
                                    Type: "02",
                                    Result :
                                    {
                                        Scale : TmpScale / 1000,
                                        Price : TmpPrice / 100,
                                        Amount : TmpAmount / 100
                                    }
                                }
        
                                resolve(TmpResult);
                                clearTimeout(timeoutHandle);
                                ReciveBuffer = '';
                                window.SerialUSBPlugin.close();
                            }
                        }
                    })
                });
            })
        });
    }
    else
    {
        return new Promise((resolve) => {resolve(orgMettlerScaleSend.call(this, pPrice))});
    }
}
posDeviceCls.prototype.deviceList = async function(pData)
{
    return new Promise(async resolve => 
    {
        if(window.SerialUSBPlugin)
        {
            window.SerialUSBPlugin.list(function(devices) 
            {
                resolve(devices)
            },function()
            {
                resolve([])
            })
        }
        else
        {
            resolve([])
        }
    })
}