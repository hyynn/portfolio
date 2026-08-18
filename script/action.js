// Intersection Observer로 스크롤 감지
const observerOptions = {
    threshold: 0.2,  // 20% 보이면 트리거
    rootMargin: '0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target); // 최초 1회만 실행되도록 이후 관찰 중단
        }
        // else {
        //     entry.target.classList.remove('active');
        // }
    });
}, observerOptions);

//Visualbox img control (transition 시간 계산 + hover 스크롤)
document.querySelectorAll('.sectionbox .visualbox .screen img, .sectionbox .mobilebox .visualbox2 .screen img').forEach(img => {
    const screen = img.closest('.screen');

    img.addEventListener('load', function () {
        const screenHeight = screen.offsetHeight;
        const imgHeight = this.offsetHeight;
        const distance = imgHeight - screenHeight;

        const correctionFactor = this.closest('.vis2') ? 0.5 :
            this.closest('.vis3') ? 0.1 : 1;
        // 기준 속도: 1000px당 2초
        const duration = Math.max(3, (distance / 1000) * 3.5) * correctionFactor;
        this.style.transition = `${duration}s linear`;
    });
    // 이미 로드된 이미지 처리
    if (img.complete) img.dispatchEvent(new Event('load'));

    screen.addEventListener('mouseenter', () => {
        img.style.top = (screen.offsetHeight - img.offsetHeight) + 'px';
    });
    screen.addEventListener('mouseleave', () => {
        img.style.top = '0';
    });
});

// 모든 sectionbox의 textbox 관찰
document.querySelectorAll('.sectionbox .textbox').forEach(textbox => {
    observer.observe(textbox);
});

// 탭 전환 함수
function showTab(tabName, event) {
    // 모든 탭 버튼에서 active 클래스 제거 + aria-selected 초기화
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
    });

    // 클릭된 탭 버튼에 active 클래스 추가 + aria-selected 설정
    if (event) {
        const clickedButton = event.target.closest('.tab-button');
        if (clickedButton) {
            clickedButton.classList.add('active');
            clickedButton.setAttribute('aria-selected', 'true');
        }
    } else {
        const activeButton = document.querySelector(`[data-tab="${tabName}"]`);
        if (activeButton) {
            activeButton.classList.add('active');
            activeButton.setAttribute('aria-selected', 'true');
        }
    }

    // 모든 탭 컨텐츠 숨기기
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });

    // 모든 사이드바 숨기기
    document.querySelectorAll('.sidebar-content').forEach(sidebar => {
        sidebar.classList.remove('active');
    });

    // 해당 탭 컨텐츠 보이기
    document.getElementById(tabName + '-tab').classList.add('active');

    // 해당 사이드바 보이기
    document.getElementById(tabName + '-sidebar').classList.add('active');

    // 탭 전환 시 인터랙티브 기능 초기화
    setTimeout(() => {
        if (tabName === 'main' || tabName === 'sub1' || tabName === 'sub2' || tabName === 'sub3') {
            initSectionNavigation(tabName);
        } else if (tabName === 'mobile') {
            initMobileNavigation();
        }
    }, 100);
}

// Section Navigation (Main, Sub1, Sub2, sub3 탭용)
function initSectionNavigation(tabName) {
    const sidebar = document.getElementById(`${tabName}-sidebar`);
    if (!sidebar) return;

    const sectionCards = sidebar.querySelectorAll('.section-card[data-section]');
    if (sectionCards.length === 0) return;

    // 사이드바 카드 클릭 이벤트
    sectionCards.forEach(card => {
        card.addEventListener('click', function () {
            // Active 클래스 전환
            sectionCards.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

//Data-location 현재 날짜로 표기
const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Seoul' }));
const day = now.getDate();
const month = now.toLocaleString('en-US', { month: 'short' });
const year = now.getFullYear();
const liveDate = document.getElementById('live-date');
if (liveDate) {
    liveDate.innerHTML = `${day}, ${month}<br>${year}`;
}


// Mobile Navigation
function initMobileNavigation() {
    const mobileItems = document.querySelectorAll('.mobile-preview-item');
    const mobileSidebar = document.getElementById('mobile-sidebar');
    const sectionCards = mobileSidebar.querySelectorAll('.section-card[data-section]');

    if (mobileItems.length === 0) return;

    // 사이드바 카드 호버 시 해당 이미지 활성화
    sectionCards.forEach(card => {
        card.addEventListener('mouseenter', function () {  // click → mouseenter
            const sectionName = this.getAttribute('data-section');
            const targetItem = document.querySelector(`.mobile-preview-item[data-section="${sectionName}"]`);

            if (targetItem) {
                mobileItems.forEach(item => item.classList.remove('active'));
                targetItem.classList.add('active');
                sectionCards.forEach(c => c.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });

    // 모바일 이미지 호버 시
    mobileItems.forEach((item, index) => {
        item.addEventListener('mouseenter', function () {  // click → mouseenter
            mobileItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');

            sectionCards.forEach(c => c.classList.remove('active'));
            if (sectionCards[index]) {
                sectionCards[index].classList.add('active');
            }
        });
    });
}

// Featured Compare 이미지 hover 스크롤
document.querySelectorAll('.featured-compare figure').forEach(figure => {
    const img = figure.querySelector('img');
    if (!img) return;

    const setup = () => {
        const distance = img.offsetHeight - figure.offsetHeight;
        if (distance <= 0) return;
        const duration = Math.max(3, (distance / 1000) * 3.5);
        img.style.transition = `top ${duration}s linear`;
        figure.addEventListener('mouseenter', () => { img.style.top = `-${distance}px`; });
        figure.addEventListener('mouseleave', () => { img.style.top = '0'; });
    };

    if (img.complete && img.naturalHeight > 0) setup();
    else img.addEventListener('load', setup);
});

// Featured Project 아코디언
const featuredToggles = document.querySelectorAll('.featured-point .point-toggle');
const featuredPointsList = document.querySelector('.featured-points');
const featuredFirstPointBody = document.getElementById('point-body-1');
const FEATURED_SAFE_HEIGHT_RATIO = 0.85;
let featuredFirstPointUserTouched = false;

// point 1이 열렸을 때 아코디언 리스트 높이가 뷰포트를 과하게 초과하면 자동으로 닫는다 (사용자가 직접 토글하기 전까지만 적용)
// aria-expanded를 임시로 바꿔서 재는 방식은 grid-template-rows transition 때문에 직후 read가 이전 값을 반환해 신뢰할 수 없으므로,
// transition에 영향받지 않는 scrollHeight로 "열렸을 때 높이"를 계산한다.
function evaluateFeaturedFirstPoint() {
    const firstToggle = featuredToggles[0];
    if (featuredFirstPointUserTouched || !firstToggle || !featuredPointsList || !featuredFirstPointBody) return;

    const wasOpen = firstToggle.getAttribute('aria-expanded') === 'true';
    const openHeight = wasOpen
        ? featuredPointsList.offsetHeight
        : featuredPointsList.offsetHeight + featuredFirstPointBody.scrollHeight;
    const fits = openHeight <= window.innerHeight * FEATURED_SAFE_HEIGHT_RATIO;
    firstToggle.setAttribute('aria-expanded', String(fits));
}

evaluateFeaturedFirstPoint();
document.fonts.ready.then(evaluateFeaturedFirstPoint);

featuredToggles.forEach(toggle => {
    toggle.addEventListener('click', function () {
        featuredFirstPointUserTouched = true;
        const isOpen = this.getAttribute('aria-expanded') === 'true';
        featuredToggles.forEach(t => t.setAttribute('aria-expanded', 'false'));
        this.setAttribute('aria-expanded', String(!isOpen));
    });
});

let featuredResizeWidth = window.innerWidth;
let featuredResizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(featuredResizeTimer);
    featuredResizeTimer = setTimeout(() => {
        if (window.innerWidth === featuredResizeWidth) return;
        featuredResizeWidth = window.innerWidth;
        evaluateFeaturedFirstPoint();
    }, 250);
});

// 앵커 스크롤 목표 위치 계산
// #top(poster-container), #design(popup)은 GSAP pin 트리거라, 이미 스크롤을 지나친 뒤에는
// offset().top이 pin 구간이 끝난 지점(버블이 사라진 상태 / 팝업 마지막 이미지)을 가리키게 된다.
// ScrollTrigger 인스턴스가 미리 계산해둔 pin 시작 위치(progress 0)를 대신 사용한다.
const ANCHOR_PIN_IDS = { '#top': 'posterPin', '#design': 'popupPin' };
function getAnchorScrollTop(targetId, targetElement) {
    // #featured는 pin 시작(progress 0) 대신, featured-bigtitle-wrap이 다 올라와
    // 멈춰있는 구간(bigtitleVisible 라벨)까지 진행된 지점으로 이동한다.
    if (targetId === '#featured' && typeof ScrollTrigger !== 'undefined') {
        const featuredPin = ScrollTrigger.getById('featuredPin');
        const tl = featuredPin && featuredPin.animation;
        const labelTime = tl && tl.labels && tl.labels.bigtitleVisible;
        if (featuredPin && labelTime !== undefined) {
            const progress = labelTime / tl.duration();
            return featuredPin.start + progress * (featuredPin.end - featuredPin.start);
        }
    }

    const pinId = ANCHOR_PIN_IDS[targetId];
    if (pinId && typeof ScrollTrigger !== 'undefined') {
        const pinTrigger = ScrollTrigger.getById(pinId);
        if (pinTrigger) return pinTrigger.start;
    }
    return targetElement.offset().top;
}

// Document Ready
$(document).ready(function () {
    // Footer 로드
    $('footer').load('include/footer.html', function () {
        if (typeof initFooterAnim === 'function') {
            initFooterAnim();
            ScrollTrigger.refresh();
        }
    });

    // 탭 버튼 이벤트
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', function (e) {
            showTab(this.dataset.tab, e);
        });
    });

    // 해시 스크롤 (페이지 로드 시 해시가 있으면 해당 위치로 스크롤)
    if (window.location.hash) {
        const targetId = window.location.hash;
        const targetElement = $(targetId);
        if (targetElement.length) {
            setTimeout(function () {
                window.scrollTo({
                    top: getAnchorScrollTop(targetId, targetElement),
                    behavior: 'smooth'
                });
            }, 500);
        }
    }

    // 세로 nav 앵커 스크롤
    document.querySelectorAll('.site-nav a[href^="#"]').forEach(function (link) {
        link.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            const targetElement = $(targetId);
            if (!targetElement.length) return;
            e.preventDefault();
            window.scrollTo({
                top: getAnchorScrollTop(targetId, targetElement),
                behavior: 'smooth'
            });
            history.pushState(null, '', targetId);
        });
    });

    // 세로 nav 현재 위치 표시 (구간 단위로 active 처리: about=profile~works, featured=featured~popup 직전, design=popup~banner)
    const siteNav = document.querySelector('.site-nav');
    if (siteNav) {
        const navZones = [
            { href: '#top', start: '.poster-container', end: '.profile-section' },
            { href: '#about', start: '.profile-section', end: '.featured-section' },
            { href: '#featured', start: '.featured-section', end: '.popup' },
            { href: '#design', start: '.popup', end: '.process-section' },
            { href: '#process', start: '.process-section', end: '.thankyou-section' }
        ].map(function (zone) {
            return {
                link: siteNav.querySelector('a[href="' + zone.href + '"]'),
                startEl: document.querySelector(zone.start),
                endEl: document.querySelector(zone.end)
            };
        }).filter(function (zone) { return zone.link && zone.startEl && zone.endEl; });

        let navSpyTicking = false;
        function updateNavSpy() {
            navSpyTicking = false;
            const centerY = window.innerHeight / 2;
            let activeLink = null;
            navZones.forEach(function (zone) {
                const startTop = zone.startEl.getBoundingClientRect().top;
                const endTop = zone.endEl.getBoundingClientRect().top;
                if (centerY >= startTop && centerY < endTop) activeLink = zone.link;
            });
            siteNav.querySelectorAll('.site-nav-link').forEach(function (link) {
                link.classList.toggle('active', link === activeLink);
            });
        }
        window.addEventListener('scroll', function () {
            if (navSpyTicking) return;
            navSpyTicking = true;
            requestAnimationFrame(updateNavSpy);
        }, { passive: true });
        updateNavSpy();
    }
});

// Scroll Top Button
const scrollTopBtn = document.getElementById('scrollTop');

if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', function () {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/* Scroll Top Button 표시 — 서브페이지용 Observer */
if (scrollTopBtn) {
    const isMain = document.body.id === 'main';

    if (!isMain) {
        const projectHeader = document.querySelector('.project-header');
        if (projectHeader) {
            new IntersectionObserver((entries) => {
                scrollTopBtn.classList.toggle('show', !entries[0].isIntersecting);
            }, { threshold: 0 }).observe(projectHeader);
        }
    }
}

/* How I Work 영상: 화면 진입 시 자동재생(음소거), 이탈 시 정지+음소거. 소리는 사용자가 버튼을 눌러야만 켜짐(브라우저 자동재생 정책상 스크립트로 강제 언뮤트하면 재생이 막히므로 실제 클릭으로만 언뮤트) */
const processVideo = document.querySelector('.process-video-el');
if (processVideo) {
    processVideo.volume = 0.2;

    const processPlayBtn = document.querySelector('.process-play-btn');
    const processMuteBtn = document.querySelector('.process-mute-btn');
    const processVolumeSlider = document.querySelector('.process-volume');
    const processProgress = document.querySelector('.process-progress');
    const iconPlay = processPlayBtn.querySelector('.icon-play');
    const iconPause = processPlayBtn.querySelector('.icon-pause');
    const iconVolumeOn = processMuteBtn.querySelector('.icon-volume-on');
    const iconVolumeOff = processMuteBtn.querySelector('.icon-volume-off');

    let processVideoInView = false;
    let processUserPaused = false; // 사용자가 버튼으로 직접 일시정지했는지
    let processUserUnmuted = false; // 사용자가 버튼/슬라이더로 소리를 켠 적 있는지

    function updateProcessControls() {
        const playing = !processVideo.paused && !processVideo.ended;
        iconPlay.classList.toggle('hidden', playing);
        iconPause.classList.toggle('hidden', !playing);

        const isMuted = processVideo.muted || processVideo.volume === 0;
        iconVolumeOn.classList.toggle('hidden', isMuted);
        iconVolumeOff.classList.toggle('hidden', !isMuted);
        processVolumeSlider.value = isMuted ? 0 : processVideo.volume;
    }
    ['play', 'pause', 'ended', 'volumechange'].forEach(ev => processVideo.addEventListener(ev, updateProcessControls));
    updateProcessControls();

    function tryPlayProcessVideo() {
        processVideo.play().catch(() => {});
    }

    // 최초 진입 시 아직 버퍼링이 덜 된 상태에서 play()가 조용히 실패하면 canplay 시점에 재시도
    processVideo.addEventListener('canplay', () => {
        if (processVideoInView && !processUserPaused && processVideo.paused && !processVideo.ended) {
            tryPlayProcessVideo();
        }
    });

    new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            processVideoInView = entry.isIntersecting;
            if (entry.isIntersecting) {
                processVideo.muted = !processUserUnmuted;
                if (!processUserPaused && !processVideo.ended) tryPlayProcessVideo();
            } else {
                processVideo.muted = true; // 화면 밖에서는 항상 무음
                processVideo.pause();
            }
        });
    }, { threshold: 0.5 }).observe(processVideo);

    function toggleProcessPlay() {
        if (processVideo.paused || processVideo.ended) {
            processUserPaused = false;
            if (processVideo.ended) processVideo.currentTime = 0;
            tryPlayProcessVideo();
        } else {
            processUserPaused = true;
            processVideo.pause();
        }
    }
    processPlayBtn.addEventListener('click', toggleProcessPlay);
    processVideo.addEventListener('click', toggleProcessPlay); // 영상 어느 부분을 클릭해도 토글

    processMuteBtn.addEventListener('click', () => {
        const isMuted = processVideo.muted || processVideo.volume === 0;
        if (isMuted) {
            processUserUnmuted = true;
            processVideo.muted = false;
            if (processVideo.volume === 0) processVideo.volume = 0.2;
        } else {
            processUserUnmuted = false;
            processVideo.muted = true;
        }
    });

    processVolumeSlider.addEventListener('input', () => {
        const vol = parseFloat(processVolumeSlider.value);
        processVideo.volume = vol;
        processVideo.muted = vol === 0;
        processUserUnmuted = vol > 0;
    });

    // 재생 위치 스크러버
    let processSeeking = false;

    function setProcessProgressFill(percent) {
        processProgress.style.background = `linear-gradient(to right, #fff ${percent}%, rgba(255, 255, 255, 0.35) ${percent}%)`;
    }

    function updateProcessProgress() {
        if (processSeeking || !processVideo.duration) return;
        const percent = (processVideo.currentTime / processVideo.duration) * 100;
        processProgress.value = percent;
        setProcessProgressFill(percent);
    }
    processVideo.addEventListener('timeupdate', updateProcessProgress);
    processVideo.addEventListener('loadedmetadata', updateProcessProgress);

    processProgress.addEventListener('pointerdown', () => { processSeeking = true; });
    processProgress.addEventListener('pointerup', () => { processSeeking = false; });
    processProgress.addEventListener('input', () => {
        setProcessProgressFill(processProgress.value);
        if (processVideo.duration) {
            processVideo.currentTime = (processProgress.value / 100) * processVideo.duration;
        }
    });
}


