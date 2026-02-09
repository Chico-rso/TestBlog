export const useActiveSection = (sectionIds, options = {}) => {
    const route = useRoute();
    const router = useRouter();
    const activeSection = ref('');
    let rafId;
    let sections = [];
    let onScroll;
    let lockUntil = 0;
    
    const setFromHash = (hash) => {
        if (!hash) {
            activeSection.value = '';
            return;
        }
        activeSection.value = hash.replace('#', '');
        lockUntil = Date.now() + (options.lockDuration ?? 650);
    };

    const clearHash = () => {
        if (!route.hash) {
            return;
        }
        const hashId = route.hash.replace('#', '');
        if (!sectionIds.includes(hashId)) {
            return;
        }
        router.replace({path: route.path, query: route.query, hash: ''});
    };
    
    const refreshSections = () => {
        if (typeof document === 'undefined') {
            return;
        }
        sections = sectionIds.map((id) => document.getElementById(id)).filter(Boolean);
    };

    onMounted(() => {
        refreshSections();
        setFromHash(route.hash);

        if (!sections.length || typeof window === 'undefined') {
            return;
        }
        
        const markerRatio = options.markerRatio ?? 0.62;
        const bottomOffset = options.bottomOffset ?? 4;
        const contactThreshold = options.contactThreshold ?? 0.8;

        const updateActive = () => {
            if (Date.now() < lockUntil) {
                return;
            }
            if (sections.length < sectionIds.length) {
                refreshSections();
            }
            if (!sections.length) {
                return;
            }
            const marker = window.scrollY + window.innerHeight * markerRatio;
            let current = '';
            
            for (const section of sections) {
                if (section.offsetTop <= marker) {
                    current = section.id;
                }
            }

            if (!current) {
                activeSection.value = '';
                clearHash();
                return;
            }
            
            const lastId = sectionIds[sectionIds.length - 1];
            const contactSection = sections.find((section) => section.id === lastId);
            if (contactSection) {
                const rect = contactSection.getBoundingClientRect();
                if (rect.top <= window.innerHeight * contactThreshold) {
                    current = contactSection.id;
                }
            }

            if (window.innerHeight + window.scrollY >= document.body.scrollHeight - bottomOffset) {
                current = lastId || current;
            }
            
            activeSection.value = current;
        };
        
        onScroll = () => {
            if (rafId) {
                cancelAnimationFrame(rafId);
            }
            rafId = requestAnimationFrame(updateActive);
        };
        
        updateActive();
        window.addEventListener('scroll', onScroll, {passive: true});
        window.addEventListener('resize', onScroll);
    });
    
    onBeforeUnmount(() => {
        if (onScroll) {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onScroll);
        }
        if (rafId) {
            cancelAnimationFrame(rafId);
        }
    });
    
    watch(
        () => route.hash,
        (hash) => {
            setFromHash(hash);
        },
    );
    
    return {activeSection};
};
