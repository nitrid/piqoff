import i18n from 'i18next';
import {langTr} from '../meta/lang/tr/tr.js'
import {langFr} from '../meta/lang/fr/fr.js'
import {langDe} from '../meta/lang/de/de.js'
import {langEn} from '../meta/lang/en/en.js'
import {langAt} from '../meta/lang/at/at.js'
async function loadLocaleResources(language, page) 
{
    try
    {
        const resources = await import(`../meta/lang/${language}/${page}.js`)
        i18n.addResource(language, 'translation', `${page}`, resources.default)
    }catch{}
}
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
        }, 
        at: 
        {
            translation: langAt
        }

    },
});
export { i18n, loadLocaleResources };