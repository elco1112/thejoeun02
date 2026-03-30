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

    // 3. 폼 제출 방지 이벤트
    const newApplyForm = document.getElementById('newApplyForm');
    
    if (newApplyForm) {
        newApplyForm.addEventListener('submit', function(e){
            e.preventDefault();
            
            const submitBtn = newApplyForm.querySelector('.btn-submit-large');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = '예약 정보 전송 중...';
            submitBtn.style.backgroundColor = '#1e40af';
            
            setTimeout(function(){
                alert('무료 방문 상담 예약이 완료되었습니다. 담당자가 확인 후 연락드리겠습니다.');
                newApplyForm.reset();
                submitBtn.textContent = originalText;
                submitBtn.style.backgroundColor = '';
            }, 1200);
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
});