import i18n from 'i18next';
import {langTr} from '../meta/lang/tr.js'
import {langFr} from '../meta/lang/fr.js'
import {langDe} from '../meta/lang/de.js'
import {langEn} from '../meta/lang/en.js'
i18n.init(
{
    lng: 'en',
    resources: 
    {
        tr: 
        {
            translation: langTr
        },
        fr: 
        {
            translation: langFr
        },
        de: 
        {
            translation: langDe
        },
        en: 
        {
            translation: langEn
        }
    },
});

export default i18n;