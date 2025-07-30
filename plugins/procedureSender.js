import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { core } from 'gensrv';
import fetch from 'node-fetch';
import config from '../config.js';

class ProcedureSender {
    constructor() {
        this.core = core.instance;
        this.__dirname = dirname(fileURLToPath(import.meta.url));
        this.connEvt = this.connEvt.bind(this);
        this.core.socket.on('connection', this.connEvt);
        
        // Konfigürasyon
        this.active = false;
        this.merkezHost = 'localhost:3001';
        this.subeId = process.env.SUBE_ID || 'SUBE_001';
        this.subeAdi = process.env.SUBE_ADI || 'Ana Şube';
        
        // Config'den ayarları yükle
        if (config?.plugins?.procedureSender?.active) {
            this.active = config.plugins.procedureSender.active;
            this.merkezHost = config.plugins.procedureSender.host || this.merkezHost;
            this.subeId = config.plugins.procedureSender.subeId || this.subeId;
            this.subeAdi = config.plugins.procedureSender.subeAdi || this.subeAdi;
        }
        
        // İstatistikler
        this.stats = {
            gonderilen: 0,
            basarili: 0,
            hata: 0,
            sonGonderim: null
        };
        
        this.processRun();
        console.log(`🔌 ProcedureSender başlatıldı - Şube: ${this.subeId}, Aktif: ${this.active}`);
    }

    async connEvt(pSocket) {
        if (!this.active) return;

        pSocket.on('sql', async (pParam, pCallback) => {
            if (typeof pParam.length != 'undefined') {
                for (let i = 0; i < pParam.length; i++) {
                    await this.handleSqlProcedure(pParam[i]);
                }
            }
        });
    }

    async handleSqlProcedure(procedureData) {
        try {
            // SQL prosedürünü olduğu gibi al
            const procedureQuery = procedureData.query;
            const paramArray = procedureData.param || [];
            const valueArray = procedureData.value || [];
            
            console.log(`📤 SQL Prosedürü yakalandı: ${procedureQuery.substring(0, 50)}...`);
            
            // Param ve value dizilerini sırayla eşleştir
            const procedureParams = {};
            for (let i = 0; i < paramArray.length; i++) {
                const paramName = paramArray[i].split(':')[0]; // 'PGUID:string|50' -> 'PGUID'
                const paramValue = valueArray[i];
                procedureParams[paramName] = paramValue;
            }
            
            console.log('📋 Parametreler sırayla eşleştirildi:', procedureParams);
            
            // Merkeze gönderilecek veri paketini hazırla
            const procedurePaketi = {
                subeId: this.subeId,
                subeAdi: this.subeAdi,
                procedureQuery: procedureQuery,
                procedureParams: procedureParams,
                paramArray: paramArray, // Orijinal param dizisi
                valueArray: valueArray, // Orijinal value dizisi
                zaman: new Date().toISOString(),
                gensrvData: true
            };

            // Merkeze gönder
            await this.merkezeGonder(procedurePaketi);
            
        } catch (error) {
            console.error('❌ SQL prosedür işleme hatası:', error);
            this.stats.hata++;
        }
    }

    async merkezeGonder(procedurePaketi) {
        try {
            const response = await fetch(`http://${this.merkezHost}/procedure-execute`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(procedurePaketi)
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();
            
            if (result.başarılı) {
                this.stats.basarili++;
                console.log(`✅ Prosedür merkeze gönderildi: ${result.veriId}`);
            } else {
                throw new Error(result.hata || 'Bilinmeyen hata');
            }

            this.stats.gonderilen++;
            this.stats.sonGonderim = new Date().toISOString();

        } catch (error) {
            console.error('❌ Merkeze gönderme hatası:', error.message);
            this.stats.hata++;
            
            // Fallback: Alternatif endpoint dene
            try {
                console.log('🔄 Fallback endpoint deneniyor...');
                const fallbackResponse = await fetch(`http://${this.merkezHost}/procedure-fallback`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(procedurePaketi)
                });
                
                if (fallbackResponse.ok) {
                    console.log('✅ Fallback endpoint ile gönderildi');
                    this.stats.basarili++;
                }
            } catch (fallbackError) {
                console.error('❌ Fallback de başarısız:', fallbackError.message);
            }
        }
    }

    processRun() {
        // Her dakika istatistikleri yazdır
        setInterval(() => {
            console.log(`📊 ProcedureSender İstatistikleri: Gönderilen=${this.stats.gonderilen}, Başarılı=${this.stats.basarili}, Hata=${this.stats.hata}`);
        }, 60000);
    }

    getStats() {
        return {
            ...this.stats,
            subeId: this.subeId,
            subeAdi: this.subeAdi,
            active: this.active
        };
    }

    setActive(active) {
        this.active = active;
        console.log(`🔌 ProcedureSender ${active ? 'etkinleştirildi' : 'devre dışı bırakıldı'}`);
    }
}

// Singleton instance
const _procedureSender = new ProcedureSender();

export { _procedureSender };
export default _procedureSender; 