/* main.js — index(메인) 전용 GSAP 애니메이션. 서브페이지에서는 로드하지 않음. */

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText, Draggable, InertiaPlugin);

// ScrollSmoother - 터치 디바이스 제외
if (!('ontouchstart' in window)) {
    ScrollSmoother.create({
        wrapper: "#smooth-wrapper",
        content: "#smooth-content",
        smooth: 2,
        effects: true,
    });
}

if (scrollTopBtn) {
    ScrollTrigger.create({
        trigger: ".works-section",
        start: "top 80%",
        onEnter: () => scrollTopBtn.classList.add('show'),
        onLeaveBack: () => scrollTopBtn.classList.remove('show'),
    });
}

// title-group
document.fonts.ready.then(() => {
    let split = SplitText.create(".title-group", { type: "chars" });
    gsap.from(split.chars, {
        y: 20,
        autoAlpha: 0,
        rotate: 500,
        letterSpacing: '-0.2em',
        stagger: 0.05,
        duration: 1
    });

    initDescriptionBox();
});

// description-box
let split2;
let descBoxOriginalHTML = document.querySelector('.description-box').innerHTML;

function initDescriptionBox() {
    const descBox = document.querySelector('.description-box');
    const windowWidth = window.innerWidth;

    if (split2) split2.revert();
    descBox.innerHTML = descBoxOriginalHTML;
    descBox.style.display = '';

    if (windowWidth <= 200) {
        descBox.style.display = 'none';
    } else {
        const secondP = descBox.querySelectorAll('p')[1];
        const firstPSpan = descBox.querySelector('p span');

        if (windowWidth <= 924 && firstPSpan) firstPSpan.remove();
        if (windowWidth <= 1599 && secondP) secondP.remove();

        split2 = SplitText.create(".description-box", { type: "chars", wordsClass: "split-word" });
        gsap.from(split2.chars, {
            y: 100,
            autoAlpha: 0,
            rotate: 100,
            letterSpacing: '-0.2em',
            stagger: 0.01,
            duration: 0.1
        });
    }
}

// 버블 등장 후 떠다니기
let floatTween;

gsap.fromTo("#object",
    { scale: 0.85, opacity: 0 },
    {
        scale: 1, opacity: 1, duration: 1.4, ease: "power2.out",
        onComplete: () => {
            floatTween = gsap.to("#object", {
                y: -30,
                duration: 2,
                ease: "sine.inOut",
                yoyo: true,
                repeat: -1
            });
        }
    }
);

// 버블 스크롤 페이드아웃
ScrollTrigger.create({
    trigger: ".poster-container",
    start: "top top",
    end: () => "+=" + window.innerHeight,
    pin: true,
    scrub: 1,

    onUpdate: (self) => {
        if (self.progress > 0.01 && floatTween) {
            floatTween.kill();
            floatTween = null;
        }
        if (self.progress <= 0.01 && !floatTween) {
            gsap.set("#object", { y: 0 });
            floatTween = gsap.to("#object", {
                y: -30, duration: 2, ease: "sine.inOut", yoyo: true, repeat: -1
            });
        }

        if (floatTween) {
            gsap.set("#object", { opacity: 1, scale: 1 });
        } else {
            gsap.set("#object", {
                y: 150 * self.progress,
                opacity: 1 - self.progress,
                scale: 1 - (0.1 * self.progress)
            });
        }
    },

    onLeaveBack: () => {
        gsap.set("#object", { y: 0, opacity: 1, scale: 1 });
        if (!floatTween) {
            floatTween = gsap.to("#object", {
                y: -30,
                duration: 2,
                ease: "sine.inOut",
                yoyo: true,
                repeat: -1
            });
        }
    }
});

// 리사이즈 이벤트 - 가로 크기 변경 시에만 실행
let prevWidth = window.innerWidth;
let resizeTimer;
window.addEventListener('resize', function () {
    if (window.innerWidth === prevWidth) return;
    prevWidth = window.innerWidth;
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
        initDescriptionBox();
        if (initCards) initCards();
        ScrollTrigger.refresh();
    }, 250);
});

// profile
gsap.timeline({
    scrollTrigger: {
        trigger: ".profile-section",
        start: "top 60%",
        end: "top 10%",
        scrub: true,
    }
})
    .from(".profile-section .profile-card", {
        opacity: 0, filter: "blur(8px)", duration: 1.2, ease: "power2.out"
    })
    .from(".profile-section .profile-body", {
        opacity: 0, filter: "blur(8px)", duration: 1.2, ease: "power2.out"
    }, "-=0.8")

// works
gsap.timeline({
    scrollTrigger: {
        trigger: ".works-section h2",
        start: "top 60%",
        end: "top 10%",
        scrub: true,
    }
})
    .from(".works-category:first-child .works-card", {
        opacity: 0, filter: "blur(8px)", duration: 1.0, stagger: 0.2, ease: "power2.out"
    })
    .from(".works-category:last-child .works-card", {
        opacity: 0, filter: "blur(8px)", duration: 1.0, stagger: 0.2, ease: "power2.out"
    }, "+=0.3")

// process (How I Work) — 타이틀은 고정, 비디오만 중앙에서 확대되며 등장
gsap.timeline({
    scrollTrigger: {
        trigger: ".process-section",
        start: "top 60%",
        end: "top 10%",
        scrub: true,
    }
})
    .from(".process-video", {
        opacity: 0, scale: 0.6, filter: "blur(8px)", duration: 1.0, ease: "power2.out"
    })

// featured project intro - featured-curtain을 고정한 채 레이어들이 차례로 위로 올라와 덮는 커튼 리빌
// featured-points-section은 pin 밖 일반 문서 흐름으로 이어지므로(카드 리빌 대상 아님) 이 타임라인에 포함하지 않는다.
gsap.timeline({
    scrollTrigger: {
        trigger: ".featured-curtain",
        start: "top top",
        end: "+=393%",
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true
    }
})
    .to({}, { duration: 0.2 }, 0)
    .fromTo(".featured-bigtitle-wrap", { y: "100vh" }, { y: "0vh", ease: "none", duration: 0.6 }, 0.2)
    .to({}, { duration: 0.3 }, 0.8)
    .fromTo(".featured-header", { y: "100vh" }, { y: "0vh", ease: "none", duration: 1 }, 1.1)
    .to({}, { duration: 0.3 }, 2.1)
    .fromTo(".compare-main", { y: "100vh" }, { y: "0vh", ease: "none", duration: 1 }, 2.4)
    .to({}, { duration: 0.3 }, 3.4)
    .fromTo(".compare-category", { y: "100vh" }, { y: "0vh", ease: "none", duration: 1 }, 3.7)
    .to({}, { duration: 0.3 }, 4.7);

// selected works intro 핀 + 헤딩 등장
ScrollTrigger.create({
    trigger: ".portfolio-intro",
    pin: true,
    start: "top top",
    end: "+=80%",
    invalidateOnRefresh: true
});

gsap.from(".portfolio-intro h2", {
    scrollTrigger: {
        trigger: ".portfolio-intro",
        start: "top 70%",
        end: "top 10%",
        scrub: true
    },
    opacity: 0,
    y: 60,
    ease: "none"
});

// section5
gsap.timeline({
    scrollTrigger: {
        trigger: ".section5",
        start: "top 70%",
        end: "bottom bottom",
        scrub: true,
    }
}).from(".vis1", { x: 400 }, 'moScreen')
    .from(".vis2", { x: 200 }, 'moScreen')
    .from(".vis3", { x: 0 }, 'moScreen');


// popup
const popupCenterContent = document.getElementById('popup-center-content');
const popupCenterFold = document.getElementById('popup-center-fold');
const popupFoldsContent = document.querySelectorAll('.popup-fold-content');

ScrollTrigger.create({
    trigger: '.popup',
    start: 'top top',
    end: () => '+=' + (popupCenterContent.scrollHeight - popupCenterFold.clientHeight) * 0.8,
    pin: true,
    scrub: 1,
    invalidateOnRefresh: true,
    onUpdate: (self) => {
        const maxScroll = popupCenterContent.scrollHeight - popupCenterFold.clientHeight;
        const scrollY = -self.progress * maxScroll;
        popupFoldsContent.forEach(content => {
            content.style.transform = `translateY(${scrollY}px)`;
        });
    }
});

// thankyou
function initThankyouAnim() {
    const el = document.querySelector('.long-sentence');
    if (!el) return;

    const text = el.textContent;
    el.innerHTML = text.split('').map(c =>
        c === ' ' ? '<span>&nbsp;</span>' : `<span class="ty-letter">${c}</span>`
    ).join('');

    const letters = document.querySelectorAll('.ty-letter');
    const overflowX = el.clientWidth - window.innerWidth;

    gsap.set(el, { x: window.innerWidth });

    const scrollAnim = gsap.to(el, {
        x: () => -(el.clientWidth) + 'px',
        ease: 'none',
        scrollTrigger: {
            trigger: '.thankyou-section',
            pin: true,
            scrub: true,
            end: () => '+=' + (el.clientWidth + window.innerWidth) * 0.6,
            invalidateOnRefresh: true
        }
    });

    letters.forEach(letter => {
        const props = {
            y: (Math.floor(7 * Math.random()) + 10) * (20 * Math.round(Math.random()) - 10),
            rotation: (Math.floor(11 * Math.random()) + 10) * (2 * Math.round(Math.random()) - 1)
        };
        gsap.fromTo(letter,
            { rotation: props.rotation, yPercent: props.y },
            {
                rotation: 0,
                yPercent: 0,
                ease: 'elastic.out(1.2, 1)',
                scrollTrigger: {
                    trigger: letter,
                    containerAnimation: scrollAnim,
                    start: 'left 100%',
                    end: 'left 0%',
                    scrub: 0.5
                }
            }
        );
    });
}

document.fonts.ready.then(() => {
    initThankyouAnim();
});

// banner
let initCards = null;

const bannerCards = gsap.utils.toArray('.banner-card');
if (bannerCards.length > 0) {
    const getCardHeight = () => bannerCards[0].offsetHeight;

    initCards = () => {
        const cardH = getCardHeight();
        const gap = cardH * 1.8;
        const spacing = cardH + gap;
        bannerCards.forEach((card, i) => {
            gsap.set(card, {
                position: 'absolute', top: 0, left: 0, width: '100%',
                y: i * spacing,
                zIndex: bannerCards.length - i
            });
        });
    };
    initCards();

    ScrollTrigger.create({
        trigger: '.banner',
        start: 'top top',
        end: () => {
            const cardH = getCardHeight();
            const gap = cardH * 1.8;
            return '+=' + (bannerCards.length - 1) * (cardH + gap) * 0.8;
        },
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
            const cardH = getCardHeight();
            const gap = cardH * 1.8;
            const spacing = cardH + gap;
            const totalMoveDist = (bannerCards.length - 1) * spacing;
            const currentScrollMove = self.progress * totalMoveDist;

            bannerCards.forEach((card, i) => {
                const yPos = (i * spacing) - currentScrollMove;
                const isEven = i % 2 === 0;

                const rotationVal = yPos > 0
                    ? (yPos / (cardH * 3)) * (isEven ? 6 : -6)
                    : yPos < 0
                        ? (yPos / window.innerHeight) * (isEven ? 15 : -15)
                        : 0;

                gsap.set(card, {
                    y: yPos,
                    rotation: rotationVal,
                    transformOrigin: isEven ? 'right top' : 'left top'
                });
            });
        }
    });
}

// footer
function initFooterAnim() {
    gsap.timeline({
        scrollTrigger: {
            trigger: 'footer',
            start: '40% bottom',
            end: 'bottom bottom',
            scrub: 1,
        }
    })
        .to('.footer-name', { duration: 6 })
        .fromTo('.footer-name',
            { fontSize: 'clamp(60px, 8vw, 120px)', opacity: 1 },
            { fontSize: '28vw', opacity: 0, duration: 12, ease: 'power2.inOut' }
        )
        .fromTo('.footer-contact-layer',
            { opacity: 0 },
            { opacity: 1, duration: 2 },
            '-=1.5'
        );
}

window.addEventListener('load', () => {
    setTimeout(() => {
        ScrollTrigger.refresh(true);
    }, 1000);
});
