import './App.css';
import { useState } from "react";
import axios from "axios";

function App() {
  const [text, setText] = useState("");
  const [response, setResponse] = useState("");

  const handleCheck = () => {
    axios.post("http://127.0.0.1:8000/api/check/", { text })
      .then(res => {
        // Django からのレスポンスに合わせる
        const avg = res.data.average_z_score;
        const marked = res.data.marked;

        setResponse(
          `Average Z-Score: ${avg}\n\nMarked Bigrams:\n${JSON.stringify(marked, null, 2)}`
        );
      })
      .catch(err => console.error(err));
  };

  return (
    <div style={{ padding: "30px" }}>
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
      <pre>{response}</pre>
    </div>
  );
}

export default App;
