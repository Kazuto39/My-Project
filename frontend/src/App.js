import './App.css';
import { useState } from "react";
import axios from "axios";

function App() {
  const [text, setText] = useState("");
  const [response, setResponse] = useState("");

  const handleCheck = () => {
    axios.post("http://localhost:8000/api/check/", { text })
      .then(res => setResponse(res.data.message))
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
      <p>{response}</p>
    </div>
  );
}

export default App;
