let mediaRecorder, socket;

const recordBtn = document.getElementById("recordBtn");
const stopBtn   = document.getElementById("stopBtn");
const textarea  = document.getElementById("transcript");

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
