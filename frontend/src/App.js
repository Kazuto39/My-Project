// const res = await axios.post("https://web-app-98k6.onrender.com/api/check/", { text });
    import React, { useState } from "react";
    import axios from "axios";
    import "./App.css";
      

      // ★ 環境変数から API URL を取得（なければ localhost を使用）
    const API_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";
    function App() {
      const [text, setText] = useState("");
      const [result, setResult] = useState(null);
      const [error, setError] = useState(null);
      
      // --- API呼び出し ---
      const handleCheck = async () => {
        try {
          const res = await axios.post("http://127.0.0.1:8000/api/check/", {
            text: text.trim(), // 空白を除去
          });
            setResult(res.data);
            setError(null);
          } catch (err) {
            console.error(err);
            setError("Error connecting to server");
          }
        };
      
      // --- bigram を色でハイライトする関数 ---
      const highlightText = () => {
        if (!result || !result.marked) return text;
      
          let highlighted = text;
      
          result.marked.forEach(({ bigram, status }) => {
            const color = status === "Unnatural" ? "#ff4d4d" : "#2ecc71"; // 赤 or 緑
            // 正規表現をエスケープして、すべての一致を置換
            const escapedBigram = bigram.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            const regex = new RegExp(escapedBigram, "gi");
            highlighted = highlighted.replace(
              regex,
              `<span style="color:${color}; font-weight:bold">${bigram}</span>`
            );
          });
      
          return highlighted;
        };
      
      return (
        <div className="App" style={{ padding: "20px", fontFamily: "sans-serif" }}>
          <h1>English Naturalness Checker</h1>
      
          <textarea
            rows="3"
            cols="60"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter an English sentence"
          />
          <br />
      
          <button onClick={handleCheck}>Check</button>
      
          {error && <p style={{ color: "red" }}>{error}</p>}
      
          {result && (
            <div style={{ marginTop: "20px" }}>
              <h3>Result:</h3>
              <p>
                <b>Average z-score:</b> {result.average_z_score}
              </p>
      
              <div
                dangerouslySetInnerHTML={{ __html: highlightText() }}
                style={{
                  fontSize: "18px",
                  backgroundColor: "#f8f8f8",
                  padding: "10px",
                  borderRadius: "8px",
                }}
                ></div>
      
                <h4>Details:</h4>
                <ul style={{ listStyleType: "none", paddingLeft: 0, lineHeight: "1.8em" }}>
                  {result.marked.map((m, index) => (
                    <li key={index}>
                      <span style={{ color: m.status === "Unnatural" ? "red" : "green" }}>
                        <b>{m.bigram}</b>
                      </span>{" "}
                      → {m.status} ({m.z_score})
                    </li>
                  ))}
                </ul>
                
              </div>
            )}
          </div>
        );
      }
      
    export default App;
      
