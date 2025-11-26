// 랜덤 함수
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

//////////////////////////////
// 1) 랜덤 숫자
window.generateNumber = function() {
  const minElem = document.getElementById("min");
  const maxElem = document.getElementById("max");
  if(!minElem || !maxElem) return;
  const min = +minElem.value;
  const max = +maxElem.value;
  const resultElem = document.getElementById("numResult");
  if(resultElem) resultElem.innerText = randInt(min, max);
};

//////////////////////////////
// 2) 랜덤 룰렛 (애니 포함)
let rouletteSpinning = false;
window.spinRoulette = function() {
  if(rouletteSpinning) return;
  const canvas = document.getElementById("rouletteCanvas");
  const optionsElem = document.getElementById("rouletteOptions");
  const resultElem = document.getElementById("rouletteResult");
  if(!canvas || !optionsElem || !resultElem) return;

  const ctx = canvas.getContext("2d");
  const options = optionsElem.value.split("\n").filter(v => v.trim());
  if(options.length === 0) { alert("항목을 입력해주세요!"); return; }

  const colors = ["#f1c40f","#e67e22","#e74c3c","#1abc9c","#9b59b6","#3498db"];
  const num = options.length;
  const arc = 2*Math.PI / num;

  // 초기 랜덤 회전 각도
  let angle = Math.random() * 2 * Math.PI;
  let spinTime = 0;
  const maxSpin = 3000 + Math.random() * 2000;
  rouletteSpinning = true;

  function drawRoulette() {
    ctx.clearRect(0, 0, 400, 400);
    for(let i = 0; i < num; i++){
      ctx.beginPath();
      ctx.moveTo(200, 200);
      ctx.arc(200, 200, 180, i*arc + angle, (i+1)*arc + angle);
      ctx.fillStyle = colors[i % colors.length];
      ctx.fill();
      ctx.save();
      ctx.translate(200, 200);
      ctx.rotate((i+0.5)*arc + angle);
      ctx.textAlign = "right";
      ctx.fillStyle = "#fff";
      ctx.font = "18px Arial";
      ctx.fillText(options[i], 180, 5);
      ctx.restore();
    }
	drawPointer();
  }

  function animate() {
    spinTime += 20;
    if(spinTime < maxSpin){
      angle += 0.3 * Math.exp(-spinTime / 1500);  // 감속
      drawRoulette();
      requestAnimationFrame(animate);
    } else {
      drawRoulette();
      // 중앙 y축 위쪽 선 기준 결과 계산
      const pointerAngle = -Math.PI/2;
      let finalAngle = (pointerAngle - angle) % (2*Math.PI);
      if(finalAngle < 0) finalAngle += 2*Math.PI;
      const index = Math.floor(finalAngle / arc) % num;

      resultElem.innerText = "🎉 결과: " + options[index];
      rouletteSpinning = false;
    }
  }
  // 삼각형 그리기 (거꾸로)
  function drawPointer() {
    ctx.save();
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.moveTo(200, 30);   // 위쪽 끝
    ctx.lineTo(190, 10);   // 왼쪽 아래
    ctx.lineTo(210, 10);   // 오른쪽 아래
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
  animate();
};
//////////////////////////////
// 3) 랜덤 뽑기
window.setupPick = function() {
  let items = document.getElementById("picker").value
                .split("\n")
                .map(v => v.trim())
                .filter(v => v);

  const pickArea = document.getElementById("pickArea");
  if(items.length === 0){
    alert("항목을 입력해주세요!");
    return;
  }

  // 랜덤 섞기
  items = items.sort(() => Math.random() - 0.5);

  pickArea.innerHTML = "";

  // 랜덤 색상 생성 함수
  const randomColor = () => {
    const r = Math.floor(Math.random()*256);
    const g = Math.floor(Math.random()*256);
    const b = Math.floor(Math.random()*256);
    return `rgb(${r},${g},${b})`;
  }

  items.forEach(item => {
    const circle = document.createElement("div");
    circle.className = "pick-circle";
    circle.style.backgroundColor = randomColor();
    circle.dataset.value = item;

    // 클릭 이벤트: 원 내부 중앙에 값 표시
    circle.addEventListener("click", function() {
      this.innerText = this.dataset.value;  // 원 안에 텍스트 넣기
      this.style.color = "#fff";            // 흰색
      this.style.fontWeight = "bold";
      this.style.cursor = "default";
      this.removeEventListener("click", arguments.callee);
    });

    pickArea.appendChild(circle);
  });
};

//////////////////////////////
// 4) 조짜기
window.makeGroups = function() {
  const listElem = document.getElementById("groupList");
  const sizeElem = document.getElementById("groupSize");
  const resultElem = document.getElementById("groupResult");
  if(!listElem || !sizeElem || !resultElem) return;

  const names = listElem.value.split("\n").filter(v=>v.trim());
  const size = +sizeElem.value;
  
  if(names.length===0){ alert("참가자 이름을 입력해주세요!"); return; }
  if(size <= 0){ alert("1명 이상의 인원 수를 입력하세요."); return; }

  const mix = [...names].sort(()=>Math.random()-0.5);
  let resultHTML = "";
  let index = 1;

  while(mix.length){
    resultHTML += `<p>조 ${index++}: ${mix.splice(0,size).join(", ")}</p>`;
  }

  resultElem.innerHTML = resultHTML;
};

