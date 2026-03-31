document.addEventListener('DOMContentLoaded', function(){
    
    // 1. 탭 메뉴 기능 
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');

    tabButtons.forEach(function(button){
        button.addEventListener('click', function(){
            tabButtons.forEach(function(btn){
                btn.classList.remove('active');
            });
            tabPanels.forEach(function(panel){
                panel.classList.remove('active');
            });

            this.classList.add('active');
            const targetId = this.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
        });
    });

    // 2. 인피니트 롤링(Marquee) 복제 로직
    const track = document.getElementById('marqueeTrack');
    
    if(track){
        // 원본 12개의 리뷰 HTML 요소를 통째로 문자열로 가져옵니다.
        const cloneHTML = track.innerHTML;
        // 기존 12개 뒤에 동일한 12개를 이어 붙여 총 24개로 만듭니다.
        // CSS에서 translateX(-50%)를 적용하면, 정확히 앞의 12개 분량만큼만 이동하고 0%로 리셋되므로 무한히 도는 것처럼 보입니다.
        track.innerHTML += cloneHTML;
    }

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

            try {
                const response = await fetch("https://script.google.com/macros/s/AKfycbz9z6CdkklhV7X-1RCa3Bods3oVsMCQ795kuO00DU_n4_-MPKtTcYaq9m_XywDJFeGK/exec", {
                    method: "POST",
                    headers: {
                        "Content-Type": "text/plain;charset=utf-8"
                    },
                    body: JSON.stringify(payload)
                });

                const result = await response.json();

                if (result.success) {
                    alert("상담문의가 정상 접수되었습니다. 담당자가 확인 후 연락드리겠습니다.");
                    form.reset(); // 폼 초기화
                } else {
                    alert("저장 실패: " + result.message);
                }
            } catch (error) {
                console.error(error);
                alert("전송 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
            } finally {
                // 버튼 상태 원상복구
                submitBtn.textContent = originalText;
                submitBtn.style.backgroundColor = '';
                submitBtn.disabled = false;
            }
        });
    }

    // 4. 프로젝트 섹션 좌우 화살표 슬라이드 (무한 루프)
    const projectContainer = document.querySelector('.project-container');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    if (projectContainer && prevBtn && nextBtn) {
        // 카드 1개 너비 + 여백(gap) 구하기
        const getScrollAmount = () => {
            const card = projectContainer.querySelector('.project-card');
            return card.offsetWidth + 24; 
        };

        // 오른쪽(다음) 버튼 클릭
        nextBtn.addEventListener('click', () => {
            const scrollAmount = getScrollAmount();
            const maxScrollLeft = projectContainer.scrollWidth - projectContainer.clientWidth;
            
            // 현재 맨 오른쪽 끝에 도달했는지 확인 (오차 범위 10px 허용)
            if (projectContainer.scrollLeft >= maxScrollLeft - 10) {
                // 맨 끝이면 처음(1번)으로 슉! 돌아감
                projectContainer.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                projectContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
        });

        // 왼쪽(이전) 버튼 클릭
        prevBtn.addEventListener('click', () => {
            const scrollAmount = getScrollAmount();
            const maxScrollLeft = projectContainer.scrollWidth - projectContainer.clientWidth;
            
            // 현재 맨 앞(1번)에 있는지 확인
            if (projectContainer.scrollLeft <= 10) {
                // 맨 앞이면 끝(9번)으로 슉! 이동
                projectContainer.scrollTo({ left: maxScrollLeft, behavior: 'smooth' });
            } else {
                projectContainer.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            }
        });
    }

    // 5. 커리큘럼 아코디언 기능 (다른 항목 자동 닫힘 적용)
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            // 1. 내가 클릭한 요소가 아닌, 이미 열려있는 다른 아코디언들을 모두 찾아 닫기
            accordionHeaders.forEach(otherHeader => {
                if (otherHeader !== this && otherHeader.classList.contains('active')) {
                    otherHeader.classList.remove('active'); // active 클래스 제거 (아이콘 원상복구)
                    otherHeader.nextElementSibling.style.maxHeight = null; // 높이를 0으로 만들어 닫기
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
});