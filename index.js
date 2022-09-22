//固定値
const baseVol = 1.0; //同時再生する曲の音量一括設定
const fadeSpeed = 4000; //フェードインスピード(2000で1小節)

//SEのレベル調整
const seLevel = new Map([
  ["gorilla", 0.8], //ゴリラ
  ["gun", 0.9], //銃声
  ["bomb", 0.9], //爆発音
  ["hyuun", 0.9], //ヒューン
  ["deden", 0.9], //出題
  ["pinpon", 0.9], //正解
  ["bubu", 0.9], //ブブ
  ["gabu", 0.9], //サメのガブー
]);

//ページ読み込み時実行プログラム
window.onload = function () {
  let audioList = getAudioList();

  for (let i = 0; i < audioList.length; i++) {
    if (i != 0) {
      create(
        audioList[i][0],
        audioList[i][1],
        audioList[i][2],
        audioList[i][3]
      );
    }
  }
};

/**
 * 再生
 */
function audioPlay(num) {
  document.getElementById("btn_audio" + num).play();
  document.getElementById("audio" + num).style.background = "#ffd5d5";
}

/**
 * 一時停止
 */
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

// 同時再生開始
function allStart() {
  let cueList = [5, 6, 7, 8]; //同時再生する曲のidリスト
  let result = confirm("同期再生を開始しますか？※進め船長以外音量0");
  if (result) {
    for (let i = 0; i < cueList.length; i++) {
      console.log(i);
      audioPlay(cueList[i]);
      if (i != 0) {
        document.getElementById("btn_audio" + cueList[i]).volume = 0;
      }
    }
  }
}

// SE再生
function playSE(seName) {
  try {
    document.getElementById(seName).volume = seLevel.get(seName);
  } catch (e) {
    console.log(e);
  }
  document.getElementById(seName).currentTime = 0;
  document.getElementById(seName).play();
}

// 追加
function create(id, title, path, memo) {
  let newElement = document.createElement("div");
  newElement.setAttribute("class", "box");
  newElement.setAttribute("id", "audio" + id);
  //親要素を取得しdiv要素を追加
  let parentBody = document.getElementsByTagName("body");
  parentBody[0].appendChild(newElement);

  let parentDiv = document.getElementById("audio" + id);

  //曲名追加
  let titleElement = document.createElement("h1");
  let titleContent = document.createTextNode(title);
  titleElement.appendChild(titleContent);
  parentDiv.appendChild(titleElement);

  //ボタン追加
  createBtn(id, "audioPlay", "再生");
  createBtn(id, "audioPause", "一時停止");
  createBtn(id, "audioStop", "停止");
  createBtn(id, "audioUp", "UP");
  createBtn(id, "audioDown", "DOWN");
  createBtn(id, "audioFadeOut", "フェードアウト");

  //音量追加
  let levelElement = document.createElement("p");
  let levelContent = document.createTextNode("10");
  levelElement.setAttribute("id", "audioLevel" + id);
  levelElement.setAttribute("style", "display: inline");
  levelElement.appendChild(levelContent);
  parentDiv.appendChild(levelElement);

  //オーディオオブジェクト追加
  let audioElement = document.createElement("audio");
  audioElement.setAttribute("id", "btn_audio" + id);
  audioElement.setAttribute("controls", "true");
  parentDiv.appendChild(audioElement);
  let audioFile = document.createElement("source");
  audioFile.setAttribute("src", "./audio/" + path);
  audioFile.setAttribute("type", "audio/mp3");
  audioElement.appendChild(audioFile);
}

//ボタン追加
function createBtn(id, methodName, BtnName) {
  let newElement = document.createElement("button");
  let newContent = document.createTextNode(BtnName);
  newElement.appendChild(newContent);
  newElement.setAttribute("class", "btn");
  newElement.setAttribute("onclick", methodName + "(" + id + ")");

  let parent = document.getElementById("audio" + id);
  parent.appendChild(newElement);
}

//CSVファイルを読み取って配列を返す
function getAudioList() {
  // CSVファイルを文字列として取得
  let srt = new XMLHttpRequest();

  srt.open("GET", "music_list.csv", false);

  try {
    srt.send(null);
  } catch (err) {
    console.log(err);
  }

  // 配列を用意
  let csletr = [];

  // 改行ごとに配列化
  let lines = srt.responseText.split(/\r\n|\n/);

  // 1行ごとに処理
  for (let i = 0; i < lines.length; ++i) {
    let cells = lines[i].split(",");
    if (cells.length != 1) {
      csletr.push(cells);
    }
  }

  return csletr;
}

/**
 * オーディオ入れ替え
 */
function audioTransition() {
  let inNum = document.transition.inMusic.selectedIndex;
  let outNum = document.transition.outMusic.selectedIndex;

  let inMusicId = document.transition.inMusic.options[inNum].value;
  let outMusicId = document.transition.outMusic.options[outNum].value;

  audioFadeOut(inMusicId);
  audioFadeIn(outMusicId);
}

/**
 * フェードイン
 */
async function audioFadeIn(num) {
  let audioIn = document.getElementById("btn_audio" + num);
  audioIn.volume = 0;
  var start_func = setInterval(function () {
    audioIn.volume = audioIn.volume + baseVol / 100;
    if (audioIn.volume >= baseVol - baseVol / 100) {
      audioIn.volume = baseVol;
      clearInterval(start_func);
    }
  }, (fadeSpeed * baseVol) / 100);
}

/**
 * フェードアウト
 */
async function audioFadeOut(num) {
  let audio = document.getElementById("btn_audio" + num);
  var end_func = setInterval(function () {
    audio.volume = audio.volume - baseVol / 100;
    if (audio.volume <= 0.03) {
      clearInterval(end_func);
      audio.volume = 0;
    }
  }, (fadeSpeed * baseVol) / 100);
}
