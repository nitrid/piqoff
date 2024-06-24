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

            if(this.dt()[0].PRINTER_PORT != null && typeof this.dt()[0].PRINTER_PORT != 'undefined' && this.dt()[0].PRINTER_PORT.indexOf('|') > -1)
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
        console.log(11111)
        console.log(this.port)
        if(this.port != null && typeof this.port != 'undefined' && this.port.indexOf('|') > -1)
        {
            vendorId = this.port.split('|')[0];
            productId = this.port.split('|')[1];
        }
        else
        {
            console.log(11111)
            console.error('vendorId - productId is invalid');
            return
        }

        // let vendorId = 1659;
        // let productId = 8963;

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
            window.SerialUSBPlugin.requestPermission(vendorId, productId, function(permissionMessage) 
            {
                window.SerialUSBPlugin.open(vendorId, productId, function(connectMessage) 
                {
                    // Teraziye fiyat gönderiliyor
                    window.SerialUSBPlugin.write(`\x04\x02\x01\x1B${TmpPrice}\x1B\x03`);
                    window.SerialUSBPlugin.read((line) => 
                    {
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