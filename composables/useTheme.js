export const useTheme = () => {
    const theme = useState('theme', () => 'light');
    const initialized = useState('theme-initialized', () => false);
    
    const applyTheme = (value) => {
        if (!process.client) {
            return;
        }
        
        document.documentElement.setAttribute('data-theme', value);
        
        const themeColor = value === 'dark' ? '#0c111d' : '#f2f4ff';
        const themeColorTag = document.querySelector('meta[name="theme-color"]');
        if (themeColorTag) {
            themeColorTag.setAttribute('content', themeColor);
        }
    };
    
    const persistTheme = (value) => {
        if (!process.client) {
            return;
        }
        localStorage.setItem('theme', value);
    };
    
    const toggleTheme = () => {
        theme.value = theme.value === 'dark' ? 'light' : 'dark';
        applyTheme(theme.value);
        persistTheme(theme.value);
    };
    
    if (process.client && !initialized.value) {
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (savedTheme === 'light' || savedTheme === 'dark') {
            theme.value = savedTheme;
        } else {
            theme.value = prefersDark ? 'dark' : 'light';
        }
        applyTheme(theme.value);
        
        watch(
            theme,
            (value) => {
                applyTheme(value);
                persistTheme(value);
            },
        );
        
        initialized.value = true;
    }
    
    onMounted(() => {
        applyTheme(theme.value);
    });
    
    return {theme, toggleTheme};
};
