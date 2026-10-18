// Case Study 리스트 ↔ 프리뷰 (index 전용)
// 행에 hover/focus하면 프리뷰 스크린샷을 opacity로 교체하고, 설명은 행의 .case-concept 문구를 그대로 옮겨 쓴다(문구 단일 소스).
// 924px 이하에서는 프리뷰가 숨겨지고 행 안의 .case-concept가 대신 노출된다.
const caseItems = document.querySelectorAll('.case-item');
const caseFrame = document.querySelector('.case-preview-frame');
const casePreviewDesc = document.querySelector('.case-preview-desc');
if (caseItems.length && caseFrame && casePreviewDesc) {
    const caseImgs = caseFrame.querySelectorAll('img');
    const activateCase = index => {
        caseItems.forEach((item, i) => item.classList.toggle('is-active', i === index));
        caseImgs.forEach((img, i) => {
            img.classList.toggle('is-active', i === index);
            img.style.top = '0';
        });
        casePreviewDesc.textContent = caseItems[index].querySelector('.case-concept').textContent.trim();
    };
    caseItems.forEach((item, i) => {
        item.addEventListener('mouseenter', () => activateCase(i));
        item.addEventListener('focusin', () => activateCase(i));
    });
    activateCase(0);

    // 프레임 hover 시 현재 스크린샷을 끝까지 스크롤 (scroll-figure와 같은 속도 공식)
    caseFrame.addEventListener('mouseenter', () => {
        const img = caseFrame.querySelector('img.is-active');
        const distance = img.offsetHeight - caseFrame.offsetHeight;
        if (distance <= 0) return;
        img.style.transition = `opacity 0.4s ease, top ${Math.max(3, (distance / 1000) * 3.5)}s linear`;
        img.style.top = `-${distance}px`;
    });
    caseFrame.addEventListener('mouseleave', () => {
        caseFrame.querySelector('img.is-active').style.top = '0';
    });
}

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

// 긴 스크린샷 figure hover 스크롤 (index Featured 카드 썸네일, sub06 Before/After 비교)
// 숨겨진 탭 안에서는 높이가 0으로 측정되므로, 로드 시점이 아니라 mouseenter 시점에 거리를 계산한다.
document.querySelectorAll('.scroll-figure').forEach(figure => {
    const img = figure.querySelector('img');
    if (!img) return;

    figure.addEventListener('mouseenter', () => {
        const distance = img.offsetHeight - figure.offsetHeight;
        if (distance <= 0) return;
        const duration = Math.max(3, (distance / 1000) * 3.5);
        img.style.transition = `top ${duration}s linear`;
        img.style.top = `-${distance}px`;
    });
    figure.addEventListener('mouseleave', () => { img.style.top = '0'; });
});

// 앵커 스크롤 목표 위치 계산
// #top(hero-reveal), #design(popup)은 GSAP pin 트리거라, 이미 스크롤을 지나친 뒤에는
// offset().top이 pin 구간이 끝난 지점(버블이 사라진 상태 / 팝업 마지막 이미지)을 가리키게 된다.
// ScrollTrigger 인스턴스가 미리 계산해둔 pin 시작 위치(progress 0)를 대신 사용한다.
const ANCHOR_PIN_IDS = { '#top': 'posterPin', '#design': 'popupPin' };
function getAnchorScrollTop(targetId, targetElement) {
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
            { href: '#top', start: '.hero-reveal', end: '.profile-section' },
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


