import {core} from 'gensrv';
import client from 'socket.io-client';
import macid from 'node-machine-id';
import crypto from 'crypto';
import * as fs from 'fs';

class piqhubApi
{
    constructor()
    {
        this.core = core.instance;
        this.macid = this.getStableMacId();
        this.checkLicenseExpiry();
        this.socketHub = client('http://piqhub.piqsoft.com',
        //this.socketHub = client('http://localhost:81',
        {
            reconnection: true,
            reconnectionAttempts: Infinity,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            timeout: 20000,
        });

        this.connEvt = this.connEvt.bind(this)
        this.core.socket.on('connection',this.connEvt)

        this.ioEvents()
        
        // Her 6 saatte bir lisans kontrolü yap
        this.startLicenseUpdateInterval();
    }
    getStableMacId() 
    {
        try 
        {
            // Config dosyasının varlığını kontrol et
            if (!fs.existsSync('./config.js')) 
            {
                this.core.log.msg('Config file not found. License system disabled.', 'Licence');
                return null;
            }

            // Benzersiz bir ID oluştur (16 karakter, büyük harf ve rakamlar)
            const generateUniqueId = () => 
            {
                return crypto.randomBytes(8).toString('hex').toUpperCase();
            };

            // Config dosyasını oku
            let configContent = fs.readFileSync('./config.js', 'utf8');
            
            // Config içeriğini parse et
            let configMatch = configContent.match(/export\s+default\s+({[\s\S]*})/);
            if (!configMatch) 
            {
                this.core.log.msg('Invalid config file format', 'Licence');
                return null;
            }

            let config;
            try 
            {
                // Var olan config yapısını koru
                config = eval('(' + configMatch[1] + ')');
            } 
            catch (error) 
            {
                this.core.log.msg('Error parsing config file', 'Licence');
                return null;
            }

            // Eğer config içinde deviceId varsa onu kullan
            if (config.macId) 
            {
                return config.macId;
            }

            // Yoksa yeni bir macId oluştur
            const macId = generateUniqueId();

            // Config yapısını koru ve macId ekle
            const updatedContent = configContent.replace(
                /export\s+default\s+{/,
                `export default {\n  macId: "${macId}",`
            );

            fs.writeFileSync('./config.js', updatedContent);
            
            return macId;
        } 
        catch (error) 
        {
            console.error('Error in getStableMacId:', error);
            this.core.log.msg('Error getting device ID. License system disabled.', 'Licence');
            return null;
        }
    }
    startLicenseUpdateInterval()
    {
        // 6 saat = 6 * 60 * 60 * 1000 ms
        const updateInterval = 6 * 60 * 60 * 1000;
        setInterval(() => 
        {
            if (this.socketHub.connected) 
            {
                this.updateLicense();
            }
        }, updateInterval);
    }
    updateLicense()
    {
        this.socketHub.emit('piqhub-get-licence', {macid: this.macid}, (pData) => 
        {
            if(pData != null)
            {
                const licenseData = 
                {
                    ...pData,
                    lastUpdate: new Date().toISOString()
                };
                fs.writeFileSync('./lic', JSON.stringify(licenseData));
                this.core.log.msg('License updated successfully', 'Licence');
                
                // package.json'ı doğrudan oku
                const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
                this.socketHub.emit('piqhub-set-info', {macid: this.macid,version: packageJson.version});
            }
            else
            {
                if (fs.existsSync('./lic')) 
                {
                    fs.unlinkSync('./lic');
                }
            }
        });
    }
    checkLicenseExpiry() 
    {
        try 
        {
            if (!fs.existsSync('./lic')) 
            {
                return;
            }

            const licData = JSON.parse(fs.readFileSync('./lic', 'utf8'));
            const lastUpdate = new Date(licData.lastUpdate || 0);
            const now = new Date();
            const diffDays = Math.floor((now - lastUpdate) / (1000 * 60 * 60 * 24));

            if (diffDays > 15) 
            {
                fs.unlinkSync('./lic');
                this.core.log.msg('License expired due to no internet connection for 15 days', 'Licence');
            }
        } 
        catch (error) 
        {
            console.log('License check error:', error);
        }
    }
    connEvt(pSocket)
    {
        pSocket.on('get-licence',async (pParam,pCallback) =>
        {
            try
            {
                let tmpLic = this.getLicence(pParam.type, pParam.field);
                if(tmpLic === null)
                {
                    pCallback(null);
                    return;
                }
                
                pCallback({[pParam.field]:JSON.stringify(tmpLic)});
            }
            catch (error)
            {
                console.log(error)
                pCallback(null);
            }
        });
        pSocket.on('get-macid',async (pParam,pCallback) =>
        {
            pCallback(this.macid);
        });
    }
    ioEvents()
    {
        this.socketHub.on('connect', () => 
        {
            this.updateLicense();
        });
        this.socketHub.on('disconnect', () => 
        {
            console.log('piqhub disconnect');
        });
        //UYGULAMALARDAN LOGIN OLDUĞUNDA BURASI ÇALIŞIYOR VE LISANS KONTROL EDILIYOR.
        this.core.on('Logined',async(pResult) =>
        {
            if(typeof pResult.socket.userInfo == 'undefined' || pResult.socket.userInfo.APP == 'ADMIN')
            {
                return;
            }
            //LISANS KONTROL EDILIYOR EĞER PROBLEM VARSA KULLANICI DISCONNECT EDİLİYOR.
            if(pResult.result.length > 0)
            {
                let tmpUserList = await this.core.socket.getUser(pResult.result[0].CODE)
                if(tmpUserList.length > 1)
                {
                    return;
                }
                
                let tmpUserCount = this.getLicence(pResult.socket.userInfo.APP,'USER_COUNT')?.USER_COUNT;
                
                if(tmpUserCount == null || typeof tmpUserCount == 'undefined')
                {
                    this.core.log.msg('License is invalid! Please contact your product manager','Licence');
                    pResult.socket.emit('general',{id:"M001",data:"License is invalid! Please contact your product manager"});
                    return;
                }

                if(tmpUserCount < this.core.socket.clients(pResult.socket.userInfo.APP).length)
                {
                    this.core.log.msg('User limit exceeded. Please contact your product manager','Licence');
                    pResult.socket.emit('general',{id:"M001",data:"User limit exceeded. Please contact your product manager"});
                    return;
                }
            }
            //***************************************************************************/
        })
    }
    getLicence(pType,pField)
    {
        try
        {
            if(!fs.existsSync('./lic'))
            {
                return null;
            }

            let tmpLicData = fs.readFileSync('./lic','utf8');
            let tmpLicObj = JSON.parse(tmpLicData);
            
            const lastUpdate = new Date(tmpLicObj.lastUpdate || 0);
            const now = new Date();
            const diffDays = Math.floor((now - lastUpdate) / (1000 * 60 * 60 * 24));

            if (diffDays > 15) 
            {
                fs.unlinkSync('./lic');
                return null;
            }

            if(!tmpLicObj?.LICENCE)
            {
                return null;
            }

            let tmpLic = JSON.parse(tmpLicObj.LICENCE);
            
            if(!pType || !pField || !tmpLic?.[pType]?.[pField])
            {
                return null;
            }
        
            return {[pField]:tmpLic[pType][pField]};
        }
        catch (error)
        {
            return null;
        }
    }
}

export const _piqhubApi = new piqhubApi()