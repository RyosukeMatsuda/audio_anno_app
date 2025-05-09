let mediaRecorder, socket;

const recordBtn = document.getElementById("recordBtn");
const stopBtn   = document.getElementById("stopBtn");
const textarea  = document.getElementById("transcript");

const submitBtn = document.getElementById("submitBtn");
const urlParams = new URLSearchParams(window.location.search);
const pid       = urlParams.get("PROLIFIC_PID") || "local_test";

const qs =new URLSearchParams(window.location.search);
const PID = qs.get("PROLIFIC_PID") || null;
const STUDY = qs.get("STUDY_ID") || null;
const SESSION = qs.get("SESSION_ID") || null;

if (!PID){
    location.href = "/frontend/sorry.html";
}

recordBtn.onclick = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);

    socket = new WebSocket("ws://localhost:8000/ws/audio");

    socket.onopen = () => mediaRecorder.start(250); // 250 ms チャンク

    mediaRecorder.ondataavailable = e => {
        if (e.data.size && socket.readyState === WebSocket.OPEN) {
        e.data.arrayBuffer().then(buf => socket.send(buf));
        }
    };

    socket.onmessage = e => {
        const data = JSON.parse(e.data);
        if (data.event === "transcript") {
        textarea.value = data.text;            //テキスト反映
        socket.close();
        recordBtn.disabled = false;
        stopBtn.disabled   = true;
        }
    };

    recordBtn.disabled = true;
    stopBtn.disabled   = false;
};

stopBtn.onclick = () => {
  mediaRecorder.stop();      // 録音停止
  socket.send("EOF");        // EOF 告知（サーバも同じ文字列を期待）
  stopBtn.disabled = true;   // 二重クリック防止
};

submitBtn.onclick = async () => {
    const text = textarea.value.trim();
    if (!text) {
        alert("テキストが空です！！");
        return;
    }

    const res = await fetch("/submit", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            text,
            pid,
            text,
        })
    });
    
    if(res.ok){
        const data = await res.json();
        window.location.href =`https://app.prolific.co/submissions/complete?cc=${data.code}`;
    }else{
        alert("送信エラー" + res.status);
    }
};