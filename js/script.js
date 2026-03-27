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
});