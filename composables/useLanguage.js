import { portfolioCopy } from '~/data/portfolioCopy.js';

export const useLanguage = () => {
    const lang = useState('lang', () => 'ru');
    const initialized = useState('lang-initialized', () => false);
    const t = computed(() => portfolioCopy[lang.value]);
    
    const toggleLang = () => {
        lang.value = lang.value === 'ru' ? 'en' : 'ru';
    };
    
    if (!initialized.value) {
        if (process.client) {
            const saved = localStorage.getItem('lang');
            if (saved === 'ru' || saved === 'en') {
                lang.value = saved;
            }
        }
        
        watch(
            lang,
            (value) => {
                if (process.client) {
                    localStorage.setItem('lang', value);
                }
            },
        );
        
        initialized.value = true;
    }
    
    return {lang, t, toggleLang};
};
