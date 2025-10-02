// DOM 요소 선택 - HTML에서 필요한 요소들을 가져옴
const input = document.querySelector('#input'); // 사용자 입력 필드
const form = document.querySelector('#form'); // 폼 요소(제출 버튼 포함)
const logs = document.querySelector('#logs'); // 결과를 표시할 로그 영역
const button = form.querySelector('button'); // 확인 버튼
const restartButton = document.createElement('button'); // 다시하기 버튼을 미리 생성
restartButton.textContent = '다시하기';
restartButton.id = 'restart-button';

// 게임 상태 관리 변수
let answerArray = [];
const tries = [];

// 정답 생성 함수
function generateAnswer() {
    const answer = new Set();
    while (answer.size < 4) {
        // 0을 제외하고 1부터 9까지의 숫자만 사용
        const randomNum = Math.floor(Math.random() * 9) + 1;
        answer.add(randomNum);
    }
    // 배열을 문자열 배열로 변환 (입력값 비교를 위해)
    answerArray = Array.from(answer).map(String); 
    console.log('정답:', answerArray);
}

// 게임 초기화 및 시작 함수
function startGame() {
    logs.innerHTML = ''; // 로그 초기화
    tries.length = 0; // 시도 기록 초기화
    input.value = ''; // 입력값 초기화
    input.disabled = false; // 입력 활성화
    button.disabled = false; // 확인 버튼 활성화
    
    // 다시하기 버튼 제거
    const existingRestartButton = document.getElementById('restart-button');
    if (existingRestartButton) {
        existingRestartButton.remove();
    }
    
    generateAnswer(); // 새로운 정답 생성
}

// 게임 종료 처리 함수
function endGame(message, success) {
    input.disabled = true; // 입력 비활성화
    button.disabled = true; // 확인 버튼 비활성화

    // 게임 결과를 logs에 표시
    // 기존 로그를 보존하고 아래에 최종 메시지 추가
    logs.append(document.createElement('br'), message, document.createElement('br')); 

    // 다시하기 버튼을 logs 영역에 추가
    logs.appendChild(restartButton);
}

// 입력값 검증 함수
function checkInput(input) {
    // 1. 입력값 내 공백 검증
    if (input.includes(' ')) {
        return alert('공백을 입력할 수 없습니다.');
    }

    // 2. 숫자가 아닌 문자(특수문자, 한글, 영어 등) 검증
    if (!/^\d+$/.test(input)) {
        return alert('숫자만 입력해 주세요.');
    }

    // 3. 4자리가 아닐 경우 검증
    if (input.length !== 4) {
        return alert('4자리를 입력하세요');
    }

    // 4. 중복된 숫자가 있을 경우 검증 (예: 1111, 1212, 3355)
    // Set의 크기가 입력 길이와 다르면 중복이 있다는 뜻입니다.
    if (new Set(input).size !== 4) {
        return alert("중복된 숫자를 입력했습니다");
    }
    
    // 5. 이미 시도한 값일 경우 검증
    if (tries.includes(input)) {
        return alert('이미 시도한 값입니다.');
    }

    return true;
}

// 메인 게임 로직 - 폼 제출 이벤트 처리
form.addEventListener('submit', (event) => {
    event.preventDefault();

    const value = input.value;
    input.value = '';

    const valid = checkInput(value);
    if (!valid) {
        return;
    }

    // 정답 확인 (홈런)
    if (answerArray.join('') === value ) {
        endGame('✨ 홈런! 축하합니다! ✨', true);
        return; 
    }

    // 스트라이크와 볼 계산
    let strike = 0;
    let ball = 0;

    for (let i = 0; i < answerArray.length; i++) {
        const answerDigit = answerArray[i];
        const index = value.indexOf(answerDigit); 

        if (index > -1) { // 숫자가 포함되어 있으면 (Ball 또는 Strike)
            if (index === i) {
                strike += 1; // 위치도 같으면 Strike
            } else {
                ball += 1; // 위치가 다르면 Ball
            }
        }
    }

    // 결과 메시지 생성 및 업데이트
    // 스트라이크와 볼 개수만 표시
    const resultMessage = `${strike} 스트라이크, ${ball} 볼`;

    // 결과 표시 및 게임 상태 업데이트
    logs.append(`${value} : ${resultMessage}`, document.createElement('br'));
    tries.push(value);

    // 게임 오버 조건 확인 (10번째 시도에 패배)
    if (tries.length >= 10) { 
        endGame(`😭 패배! 정답은 ${answerArray.join('')}였습니다.`, false);
    }
});

// '다시하기' 버튼 이벤트 리스너
restartButton.addEventListener('click', () => {
    startGame();
});

// 페이지 로드 시 게임 시작
startGame();