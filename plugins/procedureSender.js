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
        
        // İzin verilen prosedür listesi
        this.allowedProcedures = [
            'PRD_ITEMS_INSERT',
            'PRD_ITEMS_UPDATE',
            'PRD_ITEMS_DELETE',
            'PRD_CUSTOMERS_INSERT',
            'PRD_CUSTOMERS_UPDATE',
            'PRD_CUSTOMERS_DELETE',
            'PRD_ITEM_PRICE_INSERT',
            'PRD_ITEM_PRICE_UPDATE',
            'PRD_ITEM_PRICE_DELETE',
            'PRD_ITEMS_MULTICODE_UPDATE',
            'PRD_ITEMS_MULTICODE_DELETE',
            'PRD_ITEMS_UNIT_INSERT',
            'PRD_ITEMS_UNIT_UPDATE',
            'PRD_ITEMS_UNIT_DELETE',
            'PRD_INVOICE_PRICE_UPDATE',
            'PRD_COLLECTIVE_ITEMS_EDIT',
            'PRD_ITEM_BARCODE_INSERT',
            'PRD_ITEM_BARCODE_UPDATE',
            'PRD_ITEM_BARCODE_DELETE',
            'PRD_PROMO_INSERT',
            'PRD_PROMO_UPDATE',
            'PRD_PROMO_DELETE',
            'PRD_VAT_INSERT',
            'PRD_VAT_UPDATE',
            'PRD_VAT_DELETE',
            'PRD_UNIT_INSERT',
            'PRD_UNIT_UPDATE',
        ];
        
        // Config'den ayarları yükle
        if (config?.plugins?.procedureSender?.active) {
            this.active = config.plugins.procedureSender.active;
            this.merkezHost = config.plugins.procedureSender.host || this.merkezHost;
            this.subeId = config.plugins.procedureSender.subeId || this.subeId;
            this.subeAdi = config.plugins.procedureSender.subeAdi || this.subeAdi;
            
        }
        
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

    // Prosedür adını çıkar
    extractProcedureName(query) {
        try {
            // EXEC [dbo].[PRD_ITEMS_UPDATE] -> PRD_ITEMS_UPDATE
            const match = query.match(/\[dbo\]\.\[([^\]]+)\]/);
            if (match) {
                return match[1];
            }
            
            // EXEC PRD_ITEMS_UPDATE -> PRD_ITEMS_UPDATE
            const match2 = query.match(/EXEC\s+([^\s]+)/i);
            if (match2) {
                return match2[1];
            }
            
            return null;
        } catch (error) {
            console.error('❌ Prosedür adı çıkarma hatası:', error);
            return null;
        }
    }

    // Prosedürün izin verilen listede olup olmadığını kontrol et
    isProcedureAllowed(procedureName) {
        return this.allowedProcedures.includes(procedureName);
    }

    async handleSqlProcedure(procedureData) {
        try {
            // SQL prosedürünü olduğu gibi al
            const procedureQuery = procedureData.query;
            const paramArray = procedureData.param || [];
            const valueArray = procedureData.value || [];
            
            // Prosedür adını çıkar
            const procedureName = this.extractProcedureName(procedureQuery);
            
            if (!procedureName) {
                console.log(`⚠️ Prosedür adı çıkarılamadı: ${procedureQuery.substring(0, 50)}...`);
                return;
            }
            
            // Prosedürün izin verilen listede olup olmadığını kontrol et
            if (!this.isProcedureAllowed(procedureName)) {
                console.log(`🚫 Prosedür izin verilmeyen listede: ${procedureName}`);
                return;
            }
            
            console.log(`📤 İzin verilen prosedür yakalandı: ${procedureName}`);
            
            // Param ve value dizilerini sırayla eşleştir
            const procedureParams = {};
            for (let i = 0; i < paramArray.length; i++) {
                const paramName = paramArray[i].split(':')[0]; // 'PGUID:string|50' -> 'PGUID'
                let paramValue = valueArray[i];
                
                // Boş string'leri NULL yap (PRODOR validasyonu için)
                if (paramValue === '' || paramValue === '') {
                    paramValue = null;
                }
                
                procedureParams[paramName] = paramValue;
            }
            
            // Merkeze gönderilecek veri paketini hazırla
            const procedurePaketi = {
                subeId: this.subeId,
                subeAdi: this.subeAdi,
                procedureQuery: procedureQuery,
                procedureParams: procedureParams,
                paramArray: paramArray,
                valueArray: valueArray,
                procedureName: procedureName, // Prosedür adını da ekle
                zaman: new Date().toISOString()
            };

            // Merkeze gönder
            await this.merkezeGonder(procedurePaketi);
            
        } catch (error) {
            console.error('❌ SQL prosedür işleme hatası:', error);
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
                console.log(`✅ Prosedür merkeze gönderildi: ${procedurePaketi.procedureName}`);
            } else {
                throw new Error(result.hata || 'Bilinmeyen hata');
            }

        } catch (error) {
            console.error('❌ Merkeze gönderme hatası:', error.message);
        }
    }

    // İzin verilen prosedür listesini güncelle
    updateAllowedProcedures(newList) {
        this.allowedProcedures = newList;
        console.log(`📋 İzin verilen prosedürler güncellendi: ${this.allowedProcedures.join(', ')}`);
    }

    // Prosedür listesine ekle
    addAllowedProcedure(procedureName) {
        if (!this.allowedProcedures.includes(procedureName)) {
            this.allowedProcedures.push(procedureName);
            console.log(`➕ Prosedür eklendi: ${procedureName}`);
        }
    }

    // Prosedür listesinden çıkar
    removeAllowedProcedure(procedureName) {
        const index = this.allowedProcedures.indexOf(procedureName);
        if (index > -1) {
            this.allowedProcedures.splice(index, 1);
            console.log(`➖ Prosedür çıkarıldı: ${procedureName}`);
        }
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