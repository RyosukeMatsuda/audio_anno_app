document.getElementById("recordBtn").onclick = () => {
    alert("録音開始（MediaRecorderのコードは後で追加）");
  };
  
  document.getElementById("stopBtn").onclick = () => {
    alert("録音停止");
  };
  
  document.getElementById("submitBtn").onclick = () => {
    const text = document.getElementById("transcript").value;
    alert("確定テキスト: " + text);
  };
  