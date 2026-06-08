// Intersection Observer로 스크롤 감지
const observerOptions = {
    threshold: 0.2,  // 20% 보이면 트리거
    rootMargin: '0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
        else {
            entry.target.classList.remove('active');
        }
    });
}, observerOptions);

//Visualbox img control
document.querySelectorAll('.sectionbox .visualbox .screen img, .sectionbox .mobilebox .visualbox2 .screen img').forEach(img => {
    img.addEventListener('load', function () {
        const screen = this.closest('.screen');
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
    const sectionCards = sidebar.querySelectorAll('.section-card[data-section]');

    if (!sidebar || sectionCards.length === 0) return;

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
                    top: targetElement.offset().top,
                    behavior: 'smooth'
                });
            }, 500);
        }
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


