export const usePortfolioAnimations = (rootRef) => {
    let heroContext;
    let scrollContext;
    let idleCallbackId;
    let timeoutId;
    let isUnmounted = false;
    const cleanupCallbacks = [];
    const scrollTriggers = [];

    const hasFinePointer = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const selectAll = (rootEl, selector) => [...rootEl.querySelectorAll(selector)];

    const setupHeroMotion = (gsap, rootEl) => {
        const hero = rootEl.querySelector('.hero');
        if (!hero) {
            return;
        }

        const introGroups = [
            selectAll(hero, '.hero__boot p'),
            selectAll(hero, '.hero__title-main, .hero__title-role'),
            selectAll(hero, '.hero__subtitle, .hero__meta'),
            selectAll(hero, '.hero__cta .btn'),
        ].filter((group) => group.length);
        const heroTimeline = gsap.timeline({defaults: {duration: 0.28, ease: 'power2.out'}});

        introGroups.forEach((group, index) => {
            heroTimeline.from(group, {
                opacity: 0,
                y: index === 1 ? 18 : 10,
                stagger: 0.035,
            }, index === 0 ? 0 : '>-0.18');
        });

        const proofElements = selectAll(hero, '.hero__visual, .stat-card');
        if (proofElements.length) {
            heroTimeline.from(proofElements, {
                opacity: 0,
                y: 12,
                duration: 0.3,
                stagger: 0.04,
            }, 0.38);
        }
    };

    const setupRevealMotion = (gsap, ScrollTrigger, rootEl) => {
        selectAll(rootEl, '.reveal').forEach((element) => {
            const tween = gsap.from(element, {
                opacity: 0,
                y: 22,
                duration: 0.55,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: element,
                    start: 'top 88%',
                    once: true,
                },
            });

            if (tween.scrollTrigger) {
                scrollTriggers.push(tween.scrollTrigger);
            }
        });

        selectAll(rootEl, '.section__head').forEach((element) => {
            const tween = gsap.from(element, {
                '--accent-progress': 0,
                duration: 0.65,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: element,
                    start: 'top 90%',
                    once: true,
                },
            });

            if (tween.scrollTrigger) {
                scrollTriggers.push(tween.scrollTrigger);
            }
        });

        ScrollTrigger.refresh();
    };

    const setupHeroScrollMotion = (gsap, rootEl) => {
        if (!hasFinePointer()) {
            return;
        }

        const hero = rootEl.querySelector('.hero');
        if (!hero) {
            return;
        }

        [
            ['.hero__glow', {yPercent: 10}],
            ['.hero__orb--main', {yPercent: 8, xPercent: -4}],
            ['.hero__ring--one', {rotation: 16}],
            ['.hero__ring--two', {rotation: -12}],
        ].forEach(([selector, values]) => {
            const element = hero.querySelector(selector);
            if (!element) {
                return;
            }

            const tween = gsap.to(element, {
                ...values,
                ease: 'none',
                scrollTrigger: {
                    trigger: hero,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: true,
                },
            });

            if (tween.scrollTrigger) {
                scrollTriggers.push(tween.scrollTrigger);
            }
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

        const moveX = gsap.quickTo(visual, 'x', {duration: 0.7, ease: 'power3.out'});
        const moveY = gsap.quickTo(visual, 'y', {duration: 0.7, ease: 'power3.out'});
        const onPointerMove = (event) => {
            const rect = hero.getBoundingClientRect();
            moveX((((event.clientX - rect.left) / rect.width) - 0.5) * 8);
            moveY((((event.clientY - rect.top) / rect.height) - 0.5) * 6);
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
            const rotateX = gsap.quickTo(card, 'rotationX', {duration: 0.32, ease: 'power2.out'});
            const rotateY = gsap.quickTo(card, 'rotationY', {duration: 0.32, ease: 'power2.out'});
            const onPointerMove = (event) => {
                const rect = card.getBoundingClientRect();
                const x = (event.clientX - rect.left) / rect.width;
                const y = (event.clientY - rect.top) / rect.height;
                card.style.setProperty('--pointer-x', `${ x * 100 }%`);
                card.style.setProperty('--pointer-y', `${ y * 100 }%`);
                rotateX((0.5 - y) * 4);
                rotateY((x - 0.5) * 5);
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
            const moveX = gsap.quickTo(button, 'x', {duration: 0.28, ease: 'power2.out'});
            const moveY = gsap.quickTo(button, 'y', {duration: 0.28, ease: 'power2.out'});
            const onPointerMove = (event) => {
                const rect = button.getBoundingClientRect();
                moveX((((event.clientX - rect.left) / rect.width) - 0.5) * 7);
                moveY((((event.clientY - rect.top) / rect.height) - 0.5) * 5);
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

    const scheduleScrollMotion = (gsap, rootEl) => {
        const hasRevealElements = rootEl.querySelector('.reveal, .section__head');
        const hasHeroScrollElements = hasFinePointer() && rootEl.querySelector('.hero');
        if (!hasRevealElements && !hasHeroScrollElements) {
            return;
        }

        const setupWhenIdle = async () => {
            if (isUnmounted) {
                return;
            }

            try {
                const {ScrollTrigger} = await import('gsap/ScrollTrigger');
                if (isUnmounted) {
                    return;
                }

                gsap.registerPlugin(ScrollTrigger);
                scrollContext = gsap.context(() => {
                    if (hasRevealElements) {
                        setupRevealMotion(gsap, ScrollTrigger, rootEl);
                    }
                    if (hasHeroScrollElements) {
                        setupHeroScrollMotion(gsap, rootEl);
                    }
                }, rootEl);
            } catch {
                return;
            }
        };

        if ('requestIdleCallback' in window) {
            idleCallbackId = window.requestIdleCallback(setupWhenIdle, {timeout: 800});
            return;
        }

        timeoutId = window.setTimeout(setupWhenIdle, 240);
    };

    onMounted(async () => {
        const rootEl = rootRef?.value;
        if (!rootEl || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }

        try {
            const {gsap} = await import('gsap');
            if (isUnmounted) {
                return;
            }

            heroContext = gsap.context(() => {
                setupHeroMotion(gsap, rootEl);
                setupHeroPointerMotion(gsap, rootEl);
                setupProjectCardMotion(gsap, rootEl);
                setupMagneticButtons(gsap, rootEl);
            }, rootEl);
            scheduleScrollMotion(gsap, rootEl);
        } catch {
            return;
        }
    });

    onBeforeUnmount(() => {
        isUnmounted = true;
        if (idleCallbackId !== undefined && 'cancelIdleCallback' in window) {
            window.cancelIdleCallback(idleCallbackId);
        }
        if (timeoutId !== undefined) {
            window.clearTimeout(timeoutId);
        }
        cleanupCallbacks.splice(0).forEach((cleanup) => cleanup());
        scrollTriggers.splice(0).forEach((trigger) => trigger.kill());
        scrollContext?.revert();
        heroContext?.revert();
    });
};
