import i18n from 'i18next';
import {langTr} from '../meta/lang/tr.js'

i18n.init(
{
    resources: 
    {
        tr: 
        {
            translation: langTr
        }
    }
});

export default i18n;