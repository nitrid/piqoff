import {core} from 'gensrv';
import client from 'socket.io-client';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import AdmZip from 'adm-zip';
import { promisify } from 'util';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class piqhubApi
{
    constructor()
    {
        this.macId = this.getStableMacId();
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

        this.ioEvents()        
        // Her 6 saatte bir lisans kontrolü yap
        this.startLicenseUpdateInterval();
    }
    coreInit()
    {
        this.core = core.instance;

        if(this.core != null && typeof this.core.socket != 'undefined')
        {   
            this.connEvt = this.connEvt.bind(this)
            this.core.socket.on('connection',this.connEvt)
        }
        //UYGULAMALARDAN LOGIN OLDUĞUNDA BURASI ÇALIŞIYOR VE LISANS KONTROL EDILIYOR.
        if(this.core != null && typeof this.core.on != 'undefined')
        {
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
                        console.log('License is invalid! Please contact your product manager');
                        pResult.socket.emit('general',{id:"M001",data:"License is invalid! Please contact your product manager"});
                        return;
                    }

                    if(tmpUserCount < this.core.socket.clients(pResult.socket.userInfo.APP).length)
                    {
                        console.log('User limit exceeded. Please contact your product manager');
                        pResult.socket.emit('general',{id:"M001",data:"User limit exceeded. Please contact your product manager"});
                        return;
                    }
                    //***************************************************************************/
                    //SOCKET HUB'A KULLANICI LİSTESİ GÖNDERİLİYOR.
                    let tmpClients = this.core.socket.clients().filter(client => 
                    client.username !== undefined && 
                    client.sha !== undefined && 
                    client.role !== undefined && 
                    client.app !== undefined).map(({id, username, sha, role, app}) => ({id, username, sha, role, app}));
                    
                    this.socketHub.emit('piqhub-set-info', {macid: this.macId, userList: tmpClients});
                }
            })
        }
    }
    async getCustomerFiles(macId) 
    {
        try 
        {
            try 
            {
                const response = await axios(
                {
                    method: 'get',
                    url: `https://piqhub.piqsoft.com/api/customers/${macId}/cloud.zip`,
                    responseType: 'arraybuffer'
                });

                const tempZipPath = path.join(__dirname, 'temp.zip');
                await promisify(fs.writeFile)(tempZipPath, response.data);

                const zip = new AdmZip(tempZipPath);
                zip.extractAllTo(__dirname, true);
                await promisify(fs.unlink)(tempZipPath);
            } 
            catch (error) 
            {
                
            }
            // Her durumda local cloud klasörünü kontrol et
            if (fs.existsSync('cloud')) 
            {
                // Cloud klasöründeki tüm dosya ve klasörleri root'a kopyala
                const cloudFiles = await promisify(fs.readdir)('cloud');
                for (const file of cloudFiles) 
                {
                    const sourcePath = path.join('cloud', file);
                    const targetPath = path.join(__dirname, file);
                    
                    const stats = await promisify(fs.stat)(sourcePath);
                    if (stats.isDirectory()) 
                    {
                        // Klasör ise recursive kopyala
                        await promisify(fs.cp)(sourcePath, targetPath, { recursive: true });
                    } 
                    else 
                    {
                        // Dosya ise direkt kopyala
                        await promisify(fs.copyFile)(sourcePath, targetPath);
                    }
                }
            }

            return true;
        } 
        catch (error) 
        {
            console.error('Cloud data download error:');
            return false;
        }
    }
    getStableMacId() 
    {
        try 
        {
            if (!fs.existsSync('./config.js')) 
            {
                console.log('Config file not found. License system disabled.');
                return null;
            }

            const generateUniqueId = () => 
            {
                return crypto.randomBytes(8).toString('hex').toUpperCase();
            };

            let configContent = fs.readFileSync('./config.js', 'utf8');
            
            let configMatch = configContent.match(/export\s+default\s+({[\s\S]*})/);
            if (!configMatch) 
            {
                console.log('Invalid config file format');
                return null;
            }

            let config;
            try 
            {
                config = eval('(' + configMatch[1] + ')');
            } 
            catch (error) 
            {
                console.log('Error parsing config file');
                return null;
            }

            if (config.macId) 
            {
                return config.macId;
            }

            const macId = generateUniqueId();

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
            console.log('Error getting device ID. License system disabled.');
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
        this.socketHub.emit('piqhub-get-licence', {macid: this.macId}, (pData) => 
        {
            if(pData != null)
            {
                const licenseData = 
                {
                    ...pData,
                    lastUpdate: new Date().toISOString()
                };
                fs.writeFileSync('./lic', JSON.stringify(licenseData));
                console.log('License updated successfully');
                
                // package.json'ı doğrudan oku
                const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
                this.socketHub.emit('piqhub-set-info', {macid: this.macId,version: packageJson.version});
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
                console.log('License expired due to no internet connection for 15 days');
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
            pCallback(this.macId);
        });
        pSocket.on('disconnect', () =>
        {
            let tmpClients = this.core.socket.clients().filter(client => 
                client.username !== undefined && 
                client.sha !== undefined && 
                client.role !== undefined && 
                client.app !== undefined
            ).map(({id, username, sha, role, app}) => ({id, username, sha, role, app}));

            this.socketHub.emit('piqhub-set-info', {macid: this.macId, userList: tmpClients});
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
        this.socketHub.on('updateDatabase', async (versionId) => 
        {
            await this.updateDatabase(versionId, (progress) => 
            {
                this.socketHub.emit('updateDatabaseProgress', progress);
            });
        });
        this.socketHub.on('updateApp', async (versionId) => 
        {
            await this.updateApp(versionId, (progress) => 
            {
                this.socketHub.emit('updateAppProgress', progress);
            });
        });
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
    async updateDatabase(versionId, progressCallback) 
    {
        try 
        {
            const sqlFiles = ['T.sql', 'VFP.sql', 'I.sql'];
            const totalSteps = sqlFiles.length;
            let currentStep = 0;

            for (const file of sqlFiles) 
            {
                try 
                {
                    progressCallback(
                    {
                        status: 'downloading',
                        file: file,
                        progress: Math.round((currentStep / totalSteps) * 100)
                    });

                    const response = await axios(
                    {
                        method: 'get',
                        url: `https://piqhub.piqsoft.com/api/version/${versionId}/db/${file}`,
                        responseType: 'text'
                    });

                    const sqlBatches = response.data.split(/\nGO\n/).map(batch => batch.trim()).filter(batch => batch.length > 0);

                    for(let i = 0; i < sqlBatches.length; i++) 
                    {
                        progressCallback({
                            status: 'executing',
                            file: `${file} (${i + 1}/${sqlBatches.length})`,
                            progress: Math.round(((currentStep + (i / sqlBatches.length)) / totalSteps) * 100)
                        });

                        await this.core.sql.execute({
                            query: sqlBatches[i],
                            timeout: 60000
                        });
                    }

                    currentStep++;

                    progressCallback(
                    {
                        status: 'completed',
                        file: file,
                        progress: Math.round((currentStep / totalSteps) * 100)
                    });

                } 
                catch (error) 
                {
                    progressCallback(
                    {
                        status: 'error',
                        file: file,
                        error: error.message,
                        progress: Math.round((currentStep / totalSteps) * 100)
                    });
                    throw error;
                }
            }

            return true;
        } 
        catch (error) 
        {
            console.error('Database update error');
            return false;
        }
    }
    async updateApp(versionId, progressCallback) 
    {
        try 
        {
            progressCallback({
                status: 'downloading',
                file: 'public.zip',
                progress: 0
            });

            const response = await axios({
                method: 'get',
                url: `https://piqhub.piqsoft.com/api/version/${versionId}/public.zip`,
                responseType: 'arraybuffer'
            });

            progressCallback({
                status: 'extracting',
                file: 'public.zip',
                progress: 50
            });

            const tempZipPath = path.join(__dirname, 'temp.zip');
            await promisify(fs.writeFile)(tempZipPath, response.data);

            const zip = new AdmZip(tempZipPath);
            zip.extractAllTo(__dirname, true);
            await promisify(fs.unlink)(tempZipPath);

            progressCallback({
                status: 'completed',
                file: 'public.zip',
                progress: 100
            });

            return true;
        } 
        catch (error) 
        {
            console.error('App files update error');
            progressCallback({
                status: 'error',
                file: 'public.zip',
                error: error.message,
                progress: 0
            });
            return false;
        }
    }
}