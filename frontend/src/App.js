import './App.css';
import { useState } from "react";
import axios from "axios";

function App() {
  const [text, setText] = useState("");
  const [avgZ, setAvgZ] = useState(null);
  const [marked, setMarked] = useState([]);

  const handleCheck = () => {
    // React（フロントエンド）から Django（バックエンド）のAPIへ
    // text を JSON として POST する
    axios.post("http://127.0.0.1:8000/api/check/", { text })
      .then(res => {
        setAvgZ(res.data.average_z_score);
        setMarked(res.data.marked);
      })
      .catch(err => console.error(err));
  };

  // 色づけ関数
  const getColor = (status) => {
    switch (status) {
      case "Very Natural": return "green";
      case "Natural": return "darkgreen";
      case "Slightly Unnatural": return "orange";
      case "Unnatural": return "red";
      default: return "black";
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1>English Naturalness Checker</h1>

      <textarea
        rows="4"
        cols="60"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <br /><br />

      <button onClick={handleCheck}>Check</button>

      <h3>Result:</h3>

      {avgZ !== null && (
        <div>
          <p><strong>Average Z-score:</strong> {avgZ}</p>

          <h3>Details:</h3>

          <ul>
            {marked.map((item, index) => (
              <li key={index} style={{ color: getColor(item.status), marginBottom: "6px" }}>
                <strong>{item.bigram}</strong> →
                {" "}{item.status} ({item.z_score})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
