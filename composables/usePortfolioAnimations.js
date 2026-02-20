export const usePortfolioAnimations = (rootRef) => {
    let gsapContext;
    
    onMounted(async () => {
        const rootEl = rootRef?.value;
        if (!rootEl) {
            return;
        }
        
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) {
            return;
        }
        
        const {gsap} = await import('gsap');
        const {ScrollTrigger} = await import('gsap/ScrollTrigger');
        gsap.registerPlugin(ScrollTrigger);
        
        gsapContext = gsap.context(() => {
            gsap.from('.hero__eyebrow', {opacity: 0, y: 20, duration: 0.6, ease: 'power3.out'});
            gsap.from('.hero__title-main', {opacity: 0, y: 30, duration: 0.7, delay: 0.05, ease: 'power3.out'});
            gsap.from('.hero__title-role', {opacity: 0, y: 30, duration: 0.7, delay: 0.15, ease: 'power3.out'});
            gsap.from('.hero__subtitle', {opacity: 0, y: 24, duration: 0.6, delay: 0.2, ease: 'power3.out'});
            gsap.from('.hero__meta', {opacity: 0, y: 20, duration: 0.6, delay: 0.3, ease: 'power3.out'});
            gsap.from('.hero__cta .btn', {
                opacity: 0,
                y: 20,
                duration: 0.6,
                delay: 0.35,
                stagger: 0.1,
                ease: 'power3.out',
            });
            gsap.from('.stat-card', {
                opacity: 0,
                y: 20,
                duration: 0.5,
                delay: 0.45,
                stagger: 0.12,
                ease: 'power3.out',
            });
            gsap.from('.hero__visual', {
                opacity: 0,
                scale: 0.9,
                duration: 0.9,
                delay: 0.2,
                ease: 'power3.out',
            });
            
            gsap.to('.hero__glow', {
                yPercent: 15,
                scrollTrigger: {
                    trigger: '.hero',
                    start: 'top top',
                    end: 'bottom top',
                    scrub: true,
                },
            });
            
            gsap.to('.hero__orb--main', {
                yPercent: 12,
                xPercent: -6,
                scrollTrigger: {
                    trigger: '.hero',
                    start: 'top top',
                    end: 'bottom top',
                    scrub: true,
                },
            });
            
            gsap.to('.hero__ring--one', {
                rotation: 24,
                scrollTrigger: {
                    trigger: '.hero',
                    start: 'top top',
                    end: 'bottom top',
                    scrub: true,
                },
            });
            
            gsap.to('.hero__ring--two', {
                rotation: -18,
                scrollTrigger: {
                    trigger: '.hero',
                    start: 'top top',
                    end: 'bottom top',
                    scrub: true,
                },
            });
            
            gsap.utils.toArray('.reveal').forEach((el, index) => {
                gsap.from(el, {
                    opacity: 0,
                    y: 36,
                    duration: 0.6,
                    delay: Math.min(index * 0.03, 0.18),
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 85%',
                    },
                });
            });
        }, rootEl);
    });
    
    onBeforeUnmount(() => {
        if (gsapContext) {
            gsapContext.revert();
        }
    });
};
