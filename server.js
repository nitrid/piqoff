import {core} from 'gensrv'
import config from './config.js'

let gensrv = new core(config);
gensrv.listen(config.port);

const originalLog = console.log;
const originalError = console.error;
const originalWarn = console.warn;
const originalInfo = console.info;
function logWithTimestamp(logFunction, ...args)
{
    let getFormattedDate = () =>
    {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const milliseconds = String(now.getMilliseconds()).padStart(3, '0');

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
    }

    const timestamp = getFormattedDate();
    const newArgs = [`[${timestamp}]`, ...args];
    logFunction.apply(console, newArgs);
}
console.log = function(...args) 
{
    logWithTimestamp(originalLog, ...args);
};
console.error = function(...args) 
{
    logWithTimestamp(originalError, ...args);
};
console.warn = function(...args) 
{
    logWithTimestamp(originalWarn, ...args);
};
console.info = function(...args) 
{
    logWithTimestamp(originalInfo, ...args);
};