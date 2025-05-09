let mediaRecorder;
let recordedChunks = [];

const recordBtn = document.getElementById("recordBtn");
const stopBtn = document.getElementById("stopBtn");
/*
recordBtn.onclick = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);

    recordedChunks = [];

    mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
            recordedChunks.push(event.data);
        }
    };

    mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunks, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);

        const audio = document.createElement("audio");
        audio.href = url;
        audio.download = "recorded_audio.webm";
        audio.textContent = "録音データをダウンロード";
        document.body.appendChild(audio);
    };

    mediaRecorder.start();
    recordBtn.disabled = true;
    stopBtn.disabled = false;
};
*/

recordBtn.onclick = async () => {
    // 音声合成でテスト用 MediaStream を作成
    const audioContext = new AudioContext();
    const oscillator = audioContext.createOscillator();
    oscillator.type = 'sine'; // 波形: sine, square, sawtooth, triangle
    oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // 440Hz = ラの音
    
    const dest = audioContext.createMediaStreamDestination();
    oscillator.connect(dest);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 3); // 3秒で停止

    const stream = dest.stream; // 仮想マイクとして録音対象にする

    mediaRecorder = new MediaRecorder(stream);
    recordedChunks = [];

    mediaRecorder.ondataavailable = (event) => {
    if (event.data.size > 0) {
        recordedChunks.push(event.data);
    }
    };
    
    mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunks, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
    
        const a = document.createElement("a");
        a.href = url;
        a.download = "synthetic_audio.webm";
        a.textContent = "録音済みの合成音をダウンロード";
        document.body.appendChild(a);
    };
    mediaRecorder.start();
    recordBtn.disabled = true;
    stopBtn.disabled = false;
    // 自動停止を3秒後にスケジュール（手動不要）
    setTimeout(() => {
        mediaRecorder.stop();
        recordBtn.disabled = false;
        stopBtn.disabled = true;
    }, 3100);
};  

stopBtn.onclick = () => {
    mediaRecorder.stop();
    recordBtn.disabled = false;
    stopBtn.disabled = true;
};