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
            const heroTimeline = gsap.timeline();

            heroTimeline.from('.hero__boot p', {
                opacity: 0,
                x: -14,
                duration: 0.25,
                stagger: 0.08,
                ease: 'none',
            });
            heroTimeline.from('.hero__eyebrow', {opacity: 0, y: 12, duration: 0.35, ease: 'none'}, '-=0.04');
            heroTimeline.from('.hero__title-reveal', {
                opacity: 0,
                y: 36,
                duration: 0.45,
                stagger: 0.08,
                ease: 'none',
            }, '-=0.08');
            heroTimeline.from('.hero__subtitle', {opacity: 0, y: 14, duration: 0.35, ease: 'none'}, '-=0.05');
            heroTimeline.from('.hero__meta', {opacity: 0, y: 12, duration: 0.35, ease: 'none'}, '-=0.1');
            heroTimeline.from('.hero__cta .btn', {
                opacity: 0,
                y: 12,
                duration: 0.35,
                stagger: 0.12,
                ease: 'none',
            }, '-=0.08');
            heroTimeline.from('.hero__command-hint', {opacity: 0, y: 8, duration: 0.3, ease: 'none'}, '-=0.08');

            gsap.from('.stat-card', {
                opacity: 0,
                y: 14,
                duration: 0.45,
                delay: 0.5,
                stagger: 0.1,
                ease: 'none',
            });
            gsap.from('.hero__visual', {
                opacity: 0,
                scale: 0.94,
                duration: 0.55,
                delay: 0.45,
                ease: 'none',
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
            
            gsap.to('.hero__signal--one', {
                xPercent: 6,
                scrollTrigger: {
                    trigger: '.hero',
                    start: 'top top',
                    end: 'bottom top',
                    scrub: true,
                },
            });

            gsap.to('.hero__signal--two', {
                xPercent: -6,
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
                    y: 28,
                    duration: 0.5,
                    delay: Math.min(index * 0.03, 0.18),
                    ease: 'none',
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
