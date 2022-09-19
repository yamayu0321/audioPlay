// 再生
function audioPlay(num) {
  document.getElementById("btn_audio" + num).play();
  document.getElementById("audio" + num).style.background = "#ffd5d5";
}

// 一時停止
function audioPause(num) {
  let nowTime = document.getElementById("btn_audio" + num).currentTime;
  if (nowTime != 0) {
    document.getElementById("btn_audio" + num).pause();
    document.getElementById("audio" + num).style.background = "#ffd7a9";
  }
}

// 停止
function audioStop(num) {
  document.getElementById("btn_audio" + num).pause();
  document.getElementById("btn_audio" + num).currentTime = 0;
  document.getElementById("audio" + num).style.background = "white";
}

// 音量UP
function audioUp(num) {
  let volume = document.getElementById("btn_audio" + num).volume;
  let volumeCount = document.getElementById("audioLevel" + num);
  document.getElementById("btn_audio" + num).volume = volume + 0.1;
  volumeCount.innerHTML = Math.round(volume * 10);
}

// 音量DOWN
function audioDown(num) {
  let volume = document.getElementById("btn_audio" + num).volume;
  document.getElementById("btn_audio" + num).volume = volume - 0.1;
  let volumeCount = document.getElementById("audioLevel" + num);
  volumeCount.innerHTML = Math.round(volume * 10);
}

// 全部停止
function allStop() {
  let result = confirm("すべて停止&スタート位置をリセットしますか？");
  if (result) {
    for (let i = 1; i < 10; i++) {
      audioStop(i);
    }
  }
}

// ゴリラSE再生
function playGorilla() {
  document.getElementById("gorilla").currentTime = 0;
  document.getElementById("gorilla").play();
}
