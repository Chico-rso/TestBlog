export const usePortfolioAnimations = (rootRef) => {
    let gsapContext;
    let cleanupCallbacks = [];

    const hasFinePointer = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    const setupHeroMotion = (gsap) => {
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

        const scrollMotion = [
            ['.hero__glow', {yPercent: 15}],
            ['.hero__orb--main', {yPercent: 12, xPercent: -6}],
            ['.hero__ring--one', {rotation: 24}],
            ['.hero__ring--two', {rotation: -18}],
            ['.hero__signal--one', {xPercent: 6}],
            ['.hero__signal--two', {xPercent: -6}],
        ];

        scrollMotion.forEach(([selector, values]) => {
            gsap.to(selector, {
                ...values,
                scrollTrigger: {
                    trigger: '.hero',
                    start: 'top top',
                    end: 'bottom top',
                    scrub: true,
                },
            });
        });
    };

    const setupRevealMotion = (gsap) => {
        gsap.utils.toArray('.reveal').forEach((element, index) => {
            gsap.from(element, {
                opacity: 0,
                y: 26,
                duration: 0.6,
                delay: Math.min(index * 0.025, 0.16),
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: element,
                    start: 'top 86%',
                    once: true,
                },
            });
        });

        gsap.utils.toArray('.section__head').forEach((element) => {
            gsap.from(element, {
                '--accent-progress': 0,
                duration: 0.8,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: element,
                    start: 'top 88%',
                    once: true,
                },
            });
        });
    };

    const setupHeroPointerMotion = (gsap, rootEl) => {
        if (!hasFinePointer()) {
            return;
        }

        const hero = rootEl.querySelector('.hero');
        const visual = rootEl.querySelector('.hero__visual');
        if (!hero || !visual) {
            return;
        }

        const moveX = gsap.quickTo(visual, 'x', {duration: 0.8, ease: 'power3.out'});
        const moveY = gsap.quickTo(visual, 'y', {duration: 0.8, ease: 'power3.out'});
        const onPointerMove = (event) => {
            const rect = hero.getBoundingClientRect();
            moveX((((event.clientX - rect.left) / rect.width) - 0.5) * 10);
            moveY((((event.clientY - rect.top) / rect.height) - 0.5) * 8);
        };
        const onPointerLeave = () => {
            moveX(0);
            moveY(0);
        };

        hero.addEventListener('pointermove', onPointerMove);
        hero.addEventListener('pointerleave', onPointerLeave);
        cleanupCallbacks.push(() => {
            hero.removeEventListener('pointermove', onPointerMove);
            hero.removeEventListener('pointerleave', onPointerLeave);
        });
    };

    const setupProjectCardMotion = (gsap, rootEl) => {
        if (!hasFinePointer()) {
            return;
        }

        rootEl.querySelectorAll('[data-project-card]').forEach((card) => {
            const rotateX = gsap.quickTo(card, 'rotationX', {duration: 0.35, ease: 'power2.out'});
            const rotateY = gsap.quickTo(card, 'rotationY', {duration: 0.35, ease: 'power2.out'});

            const onPointerMove = (event) => {
                const rect = card.getBoundingClientRect();
                const x = (event.clientX - rect.left) / rect.width;
                const y = (event.clientY - rect.top) / rect.height;
                card.style.setProperty('--pointer-x', `${ x * 100 }%`);
                card.style.setProperty('--pointer-y', `${ y * 100 }%`);
                rotateX((0.5 - y) * 5);
                rotateY((x - 0.5) * 6);
            };

            const onPointerLeave = () => {
                rotateX(0);
                rotateY(0);
            };

            card.addEventListener('pointermove', onPointerMove);
            card.addEventListener('pointerleave', onPointerLeave);
            cleanupCallbacks.push(() => {
                card.removeEventListener('pointermove', onPointerMove);
                card.removeEventListener('pointerleave', onPointerLeave);
            });
        });
    };

    const setupMagneticButtons = (gsap, rootEl) => {
        if (!hasFinePointer()) {
            return;
        }

        rootEl.querySelectorAll('.hero__cta .btn').forEach((button) => {
            const moveX = gsap.quickTo(button, 'x', {duration: 0.3, ease: 'power2.out'});
            const moveY = gsap.quickTo(button, 'y', {duration: 0.3, ease: 'power2.out'});
            const onPointerMove = (event) => {
                const rect = button.getBoundingClientRect();
                moveX((((event.clientX - rect.left) / rect.width) - 0.5) * 8);
                moveY((((event.clientY - rect.top) / rect.height) - 0.5) * 6);
            };
            const onPointerLeave = () => {
                moveX(0);
                moveY(0);
            };

            button.addEventListener('pointermove', onPointerMove);
            button.addEventListener('pointerleave', onPointerLeave);
            cleanupCallbacks.push(() => {
                button.removeEventListener('pointermove', onPointerMove);
                button.removeEventListener('pointerleave', onPointerLeave);
            });
        });
    };

    onMounted(async () => {
        const rootEl = rootRef?.value;
        if (!rootEl || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }

        const {gsap} = await import('gsap');
        const {ScrollTrigger} = await import('gsap/ScrollTrigger');
        gsap.registerPlugin(ScrollTrigger);

        gsapContext = gsap.context(() => {
            setupHeroMotion(gsap);
            setupRevealMotion(gsap);
            setupHeroPointerMotion(gsap, rootEl);
            setupProjectCardMotion(gsap, rootEl);
            setupMagneticButtons(gsap, rootEl);
        }, rootEl);
    });

    onBeforeUnmount(() => {
        cleanupCallbacks.splice(0).forEach((cleanup) => cleanup());
        if (gsapContext) {
            gsapContext.revert();
        }
    });
};
