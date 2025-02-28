import {core} from 'gensrv';
import client from 'socket.io-client';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import AdmZip from 'adm-zip';
import { promisify } from 'util';
import { fileURLToPath } from 'url';
import unzipper from 'unzipper';
import { exec, spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class piqhubApi
{
    constructor()
    {
        this.root_path = '';
        if(typeof process.env.APP_DIR_PATH != 'undefined')
        {
            this.root_path = process.env.APP_DIR_PATH;
            this.fileRoot = process.env.APP_DIR_PATH;
        }
        else
        {
            this.fileRoot = path.join(__dirname);
        }

        this.macId = this.getStableMacId();
        this.checkLicenseExpiry();
        //this.socketHub = client('https://piqhub.piqsoft.com',
        this.socketHub = client('http://localhost:81',
        {
            reconnection: true,
            reconnectionAttempts: Infinity,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            timeout: 60000,
            forceNew: true,
            autoConnect: true,
            query: 
            {
                macId: this.macId
            }
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

            if (fs.existsSync(path.join(this.root_path, 'cloud'))) 
            {
                try 
                {
                    const files = fs.readdirSync(path.join(this.root_path, 'cloud'));
                    
                    for (const file of files) 
                    {
                        const sourcePath = path.join(this.root_path, 'cloud', file);
                        const targetPath = path.join(this.root_path, file);
                        
                        try 
                        {
                            const stats = await promisify(fs.stat)(sourcePath);

                            if (stats.isDirectory()) 
                            {
                                await promisify(fs.cp)(sourcePath, targetPath, { recursive: true });
                            } 
                            else 
                            {
                                await promisify(fs.copyFile)(sourcePath, targetPath);
                            }
                        }
                        catch (error) 
                        {
                            
                        }
                    }
                }
                catch (error) 
                {
                    
                }
            }

            if (fs.existsSync(path.join(__dirname, 'www', 'public'))) 
            {
                const publicZipPath = path.join(__dirname, 'www', 'public', 'public.zip');
                
                if (fs.existsSync(publicZipPath)) 
                {
                    fs.unlinkSync(publicZipPath);
                }

                const publicZip = new AdmZip();
                publicZip.addLocalFolder(path.join(__dirname, 'www', 'public'), 'public');
                publicZip.writeZip(publicZipPath);
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
            if (!fs.existsSync(this.root_path + './config.js')) 
            {
                console.log('Config file not found. License system disabled.');
                return null;
            }

            const generateUniqueId = () => 
            {
                return crypto.randomBytes(8).toString('hex').toUpperCase();
            };

            let configContent = fs.readFileSync(this.root_path + './config.js', 'utf8');
            
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

            fs.writeFileSync(this.root_path + './config.js', updatedContent);
            
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
                fs.writeFileSync(this.root_path + './lic', JSON.stringify(licenseData));
                console.log('License updated successfully');
                
                // package.json'ı doğrudan oku
                const packageJson = JSON.parse(fs.readFileSync(this.root_path + './package.json', 'utf8'));
                this.socketHub.emit('piqhub-set-info', {macid: this.macId,version: packageJson.version});
            }
            else
            {
                if (fs.existsSync(this.root_path + './lic')) 
                {
                    fs.unlinkSync(this.root_path + './lic');
                }
            }
        });
    }
    checkLicenseExpiry() 
    {
        try 
        {
            if (!fs.existsSync(this.root_path + './lic')) 
            {
                return;
            }

            const licData = JSON.parse(fs.readFileSync(this.root_path + './lic', 'utf8'));
            const lastUpdate = new Date(licData.lastUpdate || 0);
            const now = new Date();
            const diffDays = Math.floor((now - lastUpdate) / (1000 * 60 * 60 * 24));

            if (diffDays > 15) 
            {
                fs.unlinkSync(this.root_path + './lic');
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
            console.log('piqhub connected');
            this.updateLicense();
        });
        this.socketHub.on('disconnect', (reason) => 
        {
            console.log('piqhub disconnect, reason:', reason);
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
        this.socketHub.on('restartService', async () => 
        {
            this.restartService();
        });

        // Dosya listesi alma
        this.socketHub.on('piqhub-get-files', async (data, callback) => 
        {
            try 
            {
                // Path'i düzgün şekilde işle
                let pathStr = '/';
                if (data.path) 
                {
                    pathStr = typeof data.path === 'object' ? data.path.name || data.path.key || '/' : data.path;
                }

                const targetPath = path.join(this.fileRoot, pathStr);

                // Hedef klasör files klasörü dışına çıkıyorsa engelle
                if (!targetPath.startsWith(this.fileRoot)) 
                {
                    callback({success:false,error:'Access denied'});
                    return;
                }

                const files = await fs.promises.readdir(targetPath);
                const fileStats = [];

                for(const file of files) 
                {
                    try 
                    {
                        if(file.startsWith('.')) 
                        {
                            continue;
                        }

                        const filePath = path.join(targetPath, file);
                        const stat = await fs.promises.stat(filePath);
                        
                        fileStats.push({
                            name: file,
                            isDirectory: stat.isDirectory(),
                            size: stat.size,
                            dateModified: stat.mtime,
                            hasSubDirectories: stat.isDirectory()
                        });
                    }
                    catch(error)
                    {
                        console.log(`Skipping file ${file} due to permission error`);
                        continue;
                    }
                }
                callback({success:true,files:fileStats});
            } 
            catch (error) 
            {
                console.error('Get files error:', error);
                callback({success:false,error:error.message});
            }
        });

        // Dosya yükleme
        this.socketHub.on('piqhub-upload-file', async (data, callback) => 
        {
            try 
            {
                const filePath = path.join(this.fileRoot, data.path, data.fileName);
                
                // Path validation
                if (!filePath.startsWith(this.fileRoot)) {
                    callback({ 
                        success: false, 
                        error: 'Access denied' 
                    });
                    return;
                }

                // Klasör yoksa oluştur
                await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
                
                // Dosyayı yaz
                await fs.promises.writeFile(filePath, data.content);
                
                callback({ success: true });
            }
            catch (error) 
            {
                console.error('Upload file error:', error);
                callback({ 
                    success: false, 
                    error: error.message 
                });
            }
        });

        // Dosya indirme
        this.socketHub.on('piqhub-download-file', async (data, callback) => 
        {
            try 
            {
                const filePath = path.join(this.fileRoot, data.path, data.fileName);

                // Path validation
                if (!filePath.startsWith(this.fileRoot)) {
                    callback({ 
                        success: false, 
                        error: 'Access denied' 
                    });
                    return;
                }

                const fileContent = await fs.promises.readFile(filePath);
                
                callback({ 
                    success: true, 
                    data: fileContent 
                });
            }
            catch (error) 
            {
                console.error('Download file error:', error);
                callback({ 
                    success: false, 
                    error: error.message 
                });
            }
        });

        // Klasör oluşturma
        this.socketHub.on('piqhub-create-folder', async (data, callback) => 
        {
            try 
            {
                const folderPath = path.join(this.fileRoot, data.path);

                // Path validation
                if (!folderPath.startsWith(this.fileRoot)) {
                    callback({ 
                        success: false, 
                        error: 'Access denied' 
                    });
                    return;
                }

                await fs.promises.mkdir(folderPath, { recursive: true });
                
                callback({ success: true });
            }
            catch (error) 
            {
                console.error('Create folder error:', error);
                callback({ 
                    success: false, 
                    error: error.message 
                });
            }
        });
    }
    getLicence(pType,pField)
    {
        try
        {
            if(!fs.existsSync(this.root_path + './lic'))
            {
                return null;
            }
            
            let tmpLicData = fs.readFileSync(this.root_path + './lic','utf8');
            let tmpLicObj = JSON.parse(tmpLicData);
            
            const lastUpdate = new Date(tmpLicObj.lastUpdate || 0);
            const now = new Date();
            const diffDays = Math.floor((now - lastUpdate) / (1000 * 60 * 60 * 24));

            if (diffDays > 15) 
            {
                fs.unlinkSync(this.root_path + './lic');
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
            const requiredFiles = ['T.sql', 'VFP.sql', 'I.sql'];
            let sqlFiles = [...requiredFiles];

            try 
            {
                await axios.head(`https://piqhub.piqsoft.com/api/version/${versionId}/db/C.sql`);
                sqlFiles.push('C.sql');
            } 
            catch (error) 
            {
                
            }

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
            const response = await axios({
                method: 'get',
                url: `https://piqhub.piqsoft.com/api/version/${versionId}/public.zip`,
                responseType: 'arraybuffer',
                onDownloadProgress: (progressEvent) => 
                {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    progressCallback(
                    {
                        status: 'downloading',
                        file: 'public.zip',
                        progress: percentCompleted
                    });
                }
            });

            const tempZipPath = path.join(__dirname, 'temp.zip');
            await promisify(fs.writeFile)(tempZipPath, response.data);

            progressCallback(
            {
                status: 'extracting',
                file: 'public.zip',
                progress: 0
            });

            const directory = await unzipper.Open.file(tempZipPath);
            const totalEntries = directory.files.length;
            let extractedEntries = 0;
            await new Promise((resolve, reject) => 
            {
                fs.createReadStream(tempZipPath).pipe(unzipper.Parse()).on('entry', (entry) => 
                {
                    const fileName = entry.path;
                    const type = entry.type;
                    const fullPath = path.join(__dirname, fileName);

                    if (fileName === 'setup/appservice/startup.sh') 
                    {
                        entry.autodrain();
                        return;
                    }

                    if (type === 'File') 
                    {
                        const dirPath = path.dirname(fullPath);
                        if (!fs.existsSync(dirPath)) 
                        {
                            fs.mkdirSync(dirPath, { recursive: true });
                        }

                        entry.pipe(fs.createWriteStream(fullPath)).on('finish', () => 
                        {
                            extractedEntries++;
                            if (extractedEntries % 100 === 0 || extractedEntries === totalEntries)
                            {
                                const progress = Math.round((extractedEntries / totalEntries) * 100);
                                try 
                                {
                                    progressCallback({ status: 'extracting', file: fileName, progress });
                                } 
                                catch (error) 
                                {
                                    console.error('Progress callback error:', error);
                                }
                            }
                        });
                    } 
                    else 
                    {
                        entry.autodrain();
                    }
                }).on('close', resolve).on('error', reject);
            });

            fs.unlinkSync(tempZipPath);
            progressCallback(
            {
                status: 'completed',
                file: 'public.zip',
                progress: 100
            });

            return true;
        } 
        catch (error) 
        {
            console.error('App files update error', error.message);
            progressCallback(
            {
                status: 'error',
                file: 'public.zip',
                error: error.message,
                progress: 0
            });
            return false;
        }
    }
    restartService()
    {
        try 
        {
            console.log('Servis yeniden başlatma isteği alındı');
            spawn('cmd.exe', ['/c', 'start', '/b', path.join(__dirname, 'setup', 'restart.bat')], 
            {
                detached: true,
                stdio: 'ignore',
                windowsHide: true
            }).unref();
        }
        catch (error)
        {
            console.error('Restart hatası:', error);
        }
    }
}