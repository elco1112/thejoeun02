// - HTML 클래스명 변경 시 기능 작동 안함
// - active 클래스는 상태 제어용 (삭제 금지)
// - 기능은 클래스명을 기준으로 동작함
// - HTML 구조 변경 시 JS 수정 필요
// - 반복 구조(카드)는 자동으로 적용됨

document.addEventListener('DOMContentLoaded', function(){
    
    // 1. 탭 메뉴 기능 
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');

    tabButtons.forEach(function(button){
        button.addEventListener('click', function(){
            tabButtons.forEach(function(btn){
                btn.classList.remove('active');
            });
            // 모든 콘텐츠 숨김
            tabPanels.forEach(function(panel){
                panel.classList.remove('active');
            });
            // 현재 클릭한 버튼 활성화
            this.classList.add('active');

            // 연결된 콘텐츠 표시
            const targetId = this.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
        });
    });

    // 3. 상담 폼 제출 (구글 시트 연동)
    const form = document.getElementById('newApplyForm');
    
    if (form) {
        form.addEventListener("submit", async function (e) {
            e.preventDefault();

            // 스팸봇 방지용 (숨김칸에 값이 들어오면 차단)
            if (form.website.value) {
                alert("정상적인 요청이 아닙니다.");
                return;
            }

            // 구글 시트로 보낼 데이터 취합
            const payload = {
                name: form.name.value.trim(),
                phone: form.phone.value.trim(),
                // 희망과목과 문의내용을 하나로 합쳐서 전송
                message: `[희망과목: ${form.subject.value.trim()}]\n${form.message.value.trim()}`,
                page: window.location.href
            };

            if (!payload.name || !payload.phone || !form.message.value.trim()) {
                alert("이름, 연락처, 문의내용을 모두 입력해주세요.");
                return;
            }

            const submitBtn = form.querySelector('.btn-submit-large');
            const originalText = submitBtn.textContent;
            
            // 전송 중 버튼 상태 변경
            submitBtn.textContent = '예약 정보 전송 중...';
            submitBtn.style.backgroundColor = '#1e40af';
            submitBtn.disabled = true;

            // 🚀 핵심: await를 빼서 구글 서버의 응답을 기다리지 않고 바로 다음 줄로 넘어갑니다.
            fetch("https://script.google.com/macros/s/AKfycbz9z6CdkklhV7X-1RCa3Bods3oVsMCQ795kuO00DU_n4_-MPKtTcYaq9m_XywDJFeGK/exec", {
                method: "POST",
                headers: {
                    "Content-Type": "text/plain;charset=utf-8"
                },
                body: JSON.stringify(payload)
            }).catch(error => {
                // 에러가 나도 사용자 화면은 멈추지 않고, 개발자 도구(콘솔)에만 에러를 남깁니다.
                console.error("구글 시트 전송 에러:", error);
            });

            // fetch를 던지자마자(0.1초 만에) 바로 고객에게 완료 알림을 띄웁니다!
            alert("상담문의가 정상 접수되었습니다. 담당자가 확인 후 연락드리겠습니다.");
            
            // 폼 초기화 및 버튼 원상복구
            form.reset(); 
            submitBtn.textContent = originalText;
            submitBtn.style.backgroundColor = '';
            submitBtn.disabled = false;
        });
    }

    // 4. [통합] 포토스토리, 프로젝트, 수강생 후기 좌우 화살표 슬라이드 처리
    function initSlider(containerSelector, wrapperSelector) {
        const container = document.querySelector(containerSelector);
        if (!container) return; // 요소가 없으면 실행 안함
        
        const prevBtn = document.querySelector(`${wrapperSelector} .prev-btn`);
        const nextBtn = document.querySelector(`${wrapperSelector} .next-btn`);

        if (prevBtn && nextBtn) {
            const getScrollAmount = () => {
                const card = container.children[0];
                return card.offsetWidth + 24; // 카드 너비 + gap(24px)
            };

            nextBtn.addEventListener('click', () => {
                const scrollAmount = getScrollAmount();
                const maxScrollLeft = container.scrollWidth - container.clientWidth;
                
                if (container.scrollLeft >= maxScrollLeft - 10) {
                    container.scrollTo({ left: 0, behavior: 'smooth' }); // 맨 끝이면 처음으로
                } else {
                    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
                }
            });

            prevBtn.addEventListener('click', () => {
                const scrollAmount = getScrollAmount();
                const maxScrollLeft = container.scrollWidth - container.clientWidth;
                
                if (container.scrollLeft <= 10) {
                    container.scrollTo({ left: maxScrollLeft, behavior: 'smooth' }); // 처음이면 맨 끝으로
                } else {
                    container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
                }
            });
        }
    }

    // 함수 호출 (3개 섹션 모두 적용!)
    initSlider('.photostory-container', '.photostory-wrapper');
    initSlider('.project-container', '.project-wrapper');

    // 5. 커리큘럼 아코디언 기능 (다른 항목 자동 닫힘 적용)
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            // 다른 열린 항목 닫기
            accordionHeaders.forEach(otherHeader => {
                if (otherHeader !== this && otherHeader.classList.contains('active')) {
                    otherHeader.classList.remove('active');
                    otherHeader.nextElementSibling.style.maxHeight = null;
                }
            });

            // 2. 클릭한 요소의 상태 토글 (열기/닫기)
            this.classList.toggle('active');
            const content = this.nextElementSibling;
            
            if (content.style.maxHeight) {
                // 이미 열려있다면 닫기
                content.style.maxHeight = null;
            } else {
                // 닫혀있다면 콘텐츠의 실제 높이(scrollHeight)만큼 열어주기
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    });

    // 6. 메인 배너(Hero) 페이드 슬라이드 자동 재생 active 클래스로 상태 관리
    const heroSlides = document.querySelectorAll('.hero-slide');
    const heroPrev = document.querySelector('.hero-prev');
    const heroNext = document.querySelector('.hero-next');
    const heroDots = document.querySelectorAll('.hero-dots .dot');
    let currentSlide = 0;
    let heroInterval;

    if (heroSlides.length > 0) {
        const showSlide = (index) => {
            // 초기화
            heroSlides.forEach(slide => slide.classList.remove('active'));
            heroDots.forEach(dot => dot.classList.remove('active'));

            // 인덱스 범위 순환 처리 (처음 <-> 끝)
            if (index < 0) currentSlide = heroSlides.length - 1;
            else if (index >= heroSlides.length) currentSlide = 0;
            else currentSlide = index;

            // 새 슬라이드 활성화
            heroSlides[currentSlide].classList.add('active');
            heroDots[currentSlide].classList.add('active');
        };

        const nextSlide = () => showSlide(currentSlide + 1);
        const prevSlide = () => showSlide(currentSlide - 1);

        // 버튼 클릭 이벤트
        if (heroNext) heroNext.addEventListener('click', () => { nextSlide(); resetInterval(); });
        if (heroPrev) heroPrev.addEventListener('click', () => { prevSlide(); resetInterval(); });

        // 하단 닷(점) 클릭 이벤트
        heroDots.forEach((dot, idx) => {
            dot.addEventListener('click', () => {
                showSlide(idx);
                resetInterval();
            });
        });

        // 3초마다 자동 슬라이드
        const startInterval = () => {
            heroInterval = setInterval(nextSlide, 3000); 
        };

        // 수동으로 눌렀을 때 타이머 초기화 (안 그러면 두 번 연속 넘어가버림)
        const resetInterval = () => {
            clearInterval(heroInterval);
            startInterval();
        };

        startInterval(); // 최초 실행
    }

    // 7. 모달창 (이용약관, 개인정보처리방침) 열기/닫기 기능
    const modalOpenBtns = document.querySelectorAll('.modal-open-btn');
    const modalCloseBtns = document.querySelectorAll('.modal-close-btn');
    const modalOverlays = document.querySelectorAll('.modal-overlay');

    modalOpenBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('data-modal');
            document.getElementById(targetId).classList.add('show');
            document.body.classList.add('modal-open');
        });
    });

    modalCloseBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.modal-overlay').classList.remove('show');
            document.body.classList.remove('modal-open');
        });
    });

    modalOverlays.forEach(overlay => {
        overlay.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('show');
                document.body.classList.remove('modal-open');
            }
        });
    });

// 8. 수강생 후기 전용: 무한 롤링 + 마우스 호버 정지 + 마우스 드래그 (버튼 없음)
    function initReviewMarquee() {
        const wrapper = document.querySelector('.review-wrapper');
        const container = document.querySelector('.review-container'); 

        if (!container) return;

        container.style.scrollBehavior = 'auto';

        const originalCards = [...container.children];
        const cardWidth = originalCards[0].offsetWidth + 24; 
        const originalWidth = cardWidth * originalCards.length;

        // 1. 기존 카드 복제 (무한 스크롤을 위해)
        originalCards.forEach(card => {
            const clone = card.cloneNode(true);
            container.appendChild(clone);
        });

        let isPaused = false;
        let speed = 1; 
        let animationId;

        // 2. 무한 롤링 애니메이션
        function playMarquee() {
            if (!isPaused) {
                container.scrollLeft += speed;
                
                if (container.scrollLeft >= originalWidth) {
                    container.scrollLeft -= originalWidth;
                }
            }
            animationId = requestAnimationFrame(playMarquee);
        }

        // 3. 마우스 호버 시 일시정지
        wrapper.addEventListener('mouseenter', () => isPaused = true);
        wrapper.addEventListener('mouseleave', () => isPaused = false);

        // 4. 마우스 드래그 (스와이프) 기능
        let isDown = false;
        let startX;
        let scrollLeft;

        container.style.cursor = 'grab';

        container.addEventListener('mousedown', (e) => {
            isDown = true;
            isPaused = true; // 드래그 중 롤링 정지
            container.style.cursor = 'grabbing'; 
            startX = e.pageX - container.offsetLeft;
            scrollLeft = container.scrollLeft;
        });

        container.addEventListener('mouseleave', () => {
            isDown = false;
            container.style.cursor = 'grab';
        });

        container.addEventListener('mouseup', () => {
            isDown = false;
            container.style.cursor = 'grab';
        });

        container.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault(); 
            
            const x = e.pageX - container.offsetLeft;
            const walk = (x - startX) * 1.5; // 스와이프 감도
            container.scrollLeft = scrollLeft - walk;

            // 드래그 중 무한 연결
            if (container.scrollLeft >= originalWidth) {
                container.scrollLeft -= originalWidth;
                startX = e.pageX - container.offsetLeft; 
                scrollLeft = container.scrollLeft;
            } else if (container.scrollLeft <= 0) {
                container.scrollLeft += originalWidth;
                startX = e.pageX - container.offsetLeft; 
                scrollLeft = container.scrollLeft;
            }
        });

        // 5. 최초 애니메이션 실행
        playMarquee();
    }
    
    // 무한 롤링 함수 실행
    initReviewMarquee();
});