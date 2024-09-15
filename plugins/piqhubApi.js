// import {core} from 'gensrv'
// import client from 'socket.io-client';

// class piqhubApi
// {
//     constructor()
//     {
//         // this.core = core.instance;
//         // this.socketHub = client('http://localhost:82',
//         // {
//         //     reconnection: true,            // Yeniden bağlanma özelliğini etkinleştir
//         //     reconnectionAttempts: 5,       // Yeniden bağlanma deneme sayısı
//         //     reconnectionDelay: 1000,       // Yeniden bağlanma denemeleri arasındaki bekleme süresi (ms)
//         //     reconnectionDelayMax: 5000,    // Yeniden bağlanma denemeleri arasındaki maksimum bekleme süresi (ms)
//         //     timeout: 20000,                // Bağlantı zaman aşımı süresi (ms)
//         // });

//         // this.ioEvents()
//     }
//     ioEvents()
//     {
//         this.socketHub.on('connect', () => 
//         {
//             console.log('piqhub connect: ', this.socketHub.id);
//         });
//         this.socketHub.on('connect_error',(error) => 
//         {
//             //console.log('piqhub error : ',error);
//         });
//         this.socketHub.on('error', (error) => 
//         {
//             //console.log('piqhub error : ',error);
//         });
//         this.socketHub.on('disconnect', () => 
//         {
//             console.log('piqhub disconnect');
//         });
//     }
// }
// export const _piqhubApi = new piqhubApi()