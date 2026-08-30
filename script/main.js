/* main.js — index(메인) 전용 GSAP 애니메이션. 서브페이지에서는 로드하지 않음. */

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText, Draggable, InertiaPlugin, Observer);

// 모바일 주소창 표시/숨김에 따른 뷰포트 높이 변화로 pin 좌표가 흔들리는 것을 방지
ScrollTrigger.config({ ignoreMobileResize: true });

// ScrollSmoother - 터치 디바이스 제외
if (!('ontouchstart' in window)) {
    ScrollSmoother.create({
        wrapper: "#smooth-wrapper",
        content: "#smooth-content",
        smooth: 2,
        effects: true,
    });
}

/* ===== 이전 오프닝(poster-container) 애니메이션 — 되돌리려면 주석 해제 후 아래 hero-reveal 블록을 지우세요 =====

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
    id: "posterPin",
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
===== 이전 오프닝 애니메이션 끝 ===== */

// 오프닝3(hero-reveal) — 타이핑으로 리빌 후, 스크롤에 따라 성(Na)이 먼저 사라지고 이름이 확대·이동하며 profile-section으로 이어짐
document.fonts.ready.then(() => {
    let heroChars = SplitText.create(".hero-reveal-name", { type: "chars" });
    gsap.set(heroChars.chars, { autoAlpha: 0 });

    gsap.timeline()
        .to(".hero-reveal-role", { autoAlpha: 1, duration: 0.8 })
        .to(heroChars.chars, {
            autoAlpha: 1,
            duration: 0.05,
            stagger: 0.08,
            ease: "none"
        });
});

gsap.timeline({
    scrollTrigger: {
        id: "posterPin",
        trigger: ".hero-reveal",
        start: "top top",
        end: "+=400%",
        scrub: 1.5,
        pin: true,
        anticipatePin: 1
    }
})
    .fromTo(".hero-reveal-role, .hero-reveal-surname",
        { autoAlpha: 1 },
        { autoAlpha: 0, duration: 0.3, ease: "power2.out" })
    .to(".hero-reveal-given", { fontSize: "18vw", duration: 2, ease: "power2.inOut" })
    .to(".hero-reveal-given", { xPercent: -150, duration: 4, ease: "none" })
    .fromTo("body",
        { backgroundColor: "#000" },
        { backgroundColor: "#F3F0E9", duration: 4, ease: "power2.out" }, "<")
    .fromTo(".hero-reveal-name",
        { color: "#F3F0E9" },
        { color: "#333", duration: 4, ease: "power2.out" }, "<");

// 리사이즈 이벤트 - 가로 크기 변경 시에만 실행
let prevWidth = window.innerWidth;
let resizeTimer;
window.addEventListener('resize', function () {
    if (window.innerWidth === prevWidth) return;
    prevWidth = window.innerWidth;
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
        // initDescriptionBox(); // 이전 오프닝(poster-container) 전용 — hero-reveal로 교체되며 임시 비활성화
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
    .from(".profile-section .profile-block", {
        opacity: 0, filter: "blur(8px)", duration: 1.0, stagger: 0.25, ease: "power2.out"
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
        id: "featuredPin",
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
    .addLabel("bigtitleVisible", 0.95)
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
    id: "popupPin",
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

// banner - 가로로 긴 3D 원통(드럼)이 스크롤에 따라 카드 한 장씩 회전하며 넘어가는 인터랙션
let initCards = null;

const bannerSlider = document.querySelector('.banner-slider');
const bannerViewport = document.querySelector('.banner-viewport');
const bannerCylinder = document.querySelector('.banner-cylinder');
const bannerCards = gsap.utils.toArray('.banner-card');

if (bannerSlider && bannerViewport && bannerCylinder && bannerCards.length > 0) {
    const cardCount = bannerCards.length;
    const angleStep = 360 / cardCount; // 카드 사이 회전 각도
    let radius = 0;
    let currentRotation = 0;

    // 배너 이미지 비율(1200:300 = 4:1)에 맞춰 원통 크기를 컨테이너 폭 기준으로 계산.
    // 클리핑(overflow:hidden, .banner-slider)과 원근(perspective, .banner-viewport)을 서로 다른
    // 요소로 분리해둠 — 같은 요소가 둘 다 맡으면 pin(.banner)+ScrollSmoother(#smooth-content)처럼
    // transform이 중첩된 조상 안에서 3D 자식에 대한 overflow:hidden 클리핑이 브라우저마다 깨질 수 있음
    const layoutCylinder = () => {
        const width = bannerSlider.offsetWidth;
        const cardH = width / 4;
        radius = (cardH / 2) / Math.tan((angleStep / 2) * Math.PI / 180);

        bannerSlider.style.height = (cardH + radius) + 'px'; // 카드가 위아래로 회전할 여유 공간을 슬라이더 안에 확보해 타이틀과 겹치지 않게 함
        bannerViewport.style.perspective = (width * 1.2) + 'px';
        bannerViewport.style.height = cardH + 'px';
        bannerCylinder.style.height = cardH + 'px';
    };

    const renderCylinder = (rotation) => {
        currentRotation = rotation;
        bannerCards.forEach((card, i) => {
            // rotation이 커질수록 앞 카드가 위로 빠지고 다음 카드가 아래에서 올라오도록 부호 반전
            let angle = (rotation - i * angleStep) % 360;
            if (angle > 180) angle -= 360;
            if (angle < -180) angle += 360;

            gsap.set(card, {
                rotationX: angle,
                transformOrigin: `50% 50% -${radius}px`,
                opacity: gsap.utils.clamp(0, 1, 1 - Math.abs(angle) / 90),
                pointerEvents: Math.abs(angle) < angleStep / 2 ? 'auto' : 'none'
            });
        });
    };

    let activeIndex = 0;
    let isStepping = false;

    // 스크롤 거리에 progress를 매핑하지 않고, 한 스텝(휠/스와이프 1회)마다 카드 한 장을 빠르게 회전시켜 정중앙에 세움
    const goToIndex = (nextIndex) => {
        isStepping = true;
        activeIndex = nextIndex;
        gsap.to({ v: currentRotation }, {
            v: activeIndex * angleStep,
            duration: 0.5,
            ease: 'power2.inOut',
            onUpdate: function () { renderCylinder(this.targets()[0].v); },
            onComplete: () => { setTimeout(() => { isStepping = false; }, 180); }
        });
    };

    initCards = () => {
        layoutCylinder();
        renderCylinder(activeIndex * angleStep);
    };
    layoutCylinder();
    renderCylinder(0);

    if ('ontouchstart' in window) {
        // 모바일: touchmove.preventDefault()로 네이티브 스크롤을 완전히 가두는 게 iOS 등에서
        // 신뢰할 수 없어서(제스처를 스크롤로 이미 커밋한 뒤엔 막히지 않는 경우가 흔함), 데스크톱처럼
        // 스크롤을 가두는 대신 긴 pin 구간 + scrub + snap으로 실제 스크롤 진행률을 그대로 받아들임
        ScrollTrigger.create({
            trigger: '.banner',
            start: 'top top',
            end: () => '+=' + (cardCount - 1) * window.innerHeight * 0.8,
            pin: true,
            scrub: true,
            invalidateOnRefresh: true,
            onRefresh: layoutCylinder,
            snap: {
                snapTo: 1 / (cardCount - 1),
                duration: { min: 0.2, max: 0.5 },
                ease: 'power1.inOut'
            },
            onUpdate: (self) => {
                activeIndex = Math.round(self.progress * (cardCount - 1));
                renderCylinder(self.progress * angleStep * (cardCount - 1));
            }
        });
    } else {
        // 데스크톱: 직접 만든 wheel/touch 트래핑은 ScrollSmoother(smooth:2)의 관성 재생과 계속
        // 레이스가 나서, pin에 들어와 있는 동안만 스무더를 멈추고 GSAP Observer로
        // "제스처 1회 = 카드 1스텝"을 맡김
        const smoother = typeof ScrollSmoother !== 'undefined' ? ScrollSmoother.get() : null;
        const pauseSmoother = () => smoother && smoother.paused(true);
        const resumeSmoother = () => smoother && smoother.paused(false);

        // next가 범위를 벗어나면 스텝을 밟지 않고 false를 반환 → 호출부에서 Observer를 해제해 자연 스크롤로 넘김
        const stepTo = (nextIndex) => {
            if (nextIndex < 0 || nextIndex > cardCount - 1) return false;
            goToIndex(nextIndex);
            return true;
        };

        let bannerObserver = null;

        const createBannerObserver = () => {
            if (bannerObserver) return;
            bannerObserver = Observer.create({
                target: window,
                type: 'wheel,touch,pointer',
                preventDefault: true,
                tolerance: 10,
                onDown: () => { if (!isStepping && !stepTo(activeIndex + 1)) destroyBannerObserver(); },
                onUp: () => { if (!isStepping && !stepTo(activeIndex - 1)) destroyBannerObserver(); }
            });
        };

        const destroyBannerObserver = () => {
            if (!bannerObserver) return;
            bannerObserver.kill();
            bannerObserver = null;
            resumeSmoother();
        };

        ScrollTrigger.create({
            trigger: '.banner',
            start: 'top top',
            end: '+=100', // 실제 스크롤 거리로 쓰이지 않는 안전 버퍼일 뿐, 값 자체는 중요하지 않음
            pin: true,
            invalidateOnRefresh: true,
            onRefresh: layoutCylinder,
            onEnter: () => { pauseSmoother(); createBannerObserver(); },
            onEnterBack: () => { pauseSmoother(); createBannerObserver(); },
            onLeave: destroyBannerObserver,
            onLeaveBack: destroyBannerObserver
        });
    }
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
