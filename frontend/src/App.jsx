import React, { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

const API_BASE = "http://127.0.0.1:5000";

function App() {
  const [stock, setStock] = useState("AAPL");
  const [summary, setSummary] = useState({});
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/stocks/${stock}/summary`)
      .then(res => res.json())
      .then(setSummary);

     fetch(`${API_BASE}/stocks/${stock}`)
    .then(res => res.json())
    .then((d) => {
      console.log("📦 Data received from API:", d);  // ADD THIS
      setData(d);
    });
}, [stock]);

  return (
    <div style={{
      fontFamily: "Roboto, sans-serif",
      maxWidth: "1000px",
      margin: "0 auto",
      padding: "20px"
    }}>
      <h1 style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        📊 <span>Stock Dashboard</span>
      </h1>

      <div style={{ marginBottom: "20px" }}>
        {["AAPL", "MSFT", "AMZN"].map(ticker => (
          <button
            key={ticker}
            onClick={() => setStock(ticker)}
            style={{
              marginRight: "10px",
              padding: "10px 16px",
              backgroundColor: stock === ticker ? "#4b5563" : "#d1d5db",
              color: stock === ticker ? "#fff" : "#111",
              border: "none",
              borderRadius: "6px",
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            {ticker}
          </button>
        ))}
      </div>

      <h2>Summary for {stock}</h2>
      <div style={{
        display: "flex",
        gap: "20px",
        flexWrap: "wrap",
        marginBottom: "20px"
      }}>
        {Object.entries(summary).map(([key, value]) => (
          <div key={key} style={{
            padding: "10px 15px",
            backgroundColor: "#f3f4f6",
            borderRadius: "8px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
          }}>
            <strong>{key.replace("_", " ")}:</strong><br />
            {value}
          </div>
        ))}
      </div>

      <h2>Recent Data</h2>
      <div style={{ overflowX: "auto", marginBottom: "30px" }}>
        <table style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: "14px"
        }}>
          <thead>
            <tr style={{ backgroundColor: "#f9fafb" }}>
              <th style={thStyle}>Date</th>
              <th style={thStyle}>Close</th>
              <th style={thStyle}>Daily Return</th>
              <th style={thStyle}>MA7</th>
            </tr>
          </thead>
          <tbody>
            {data.slice(-10).map((row, i) => (
              <tr key={i}>
                <td style={tdStyle}>{row.Date}</td>
                <td style={tdStyle}>${Number(row.Close).toFixed(2)}</td>
                <td style={tdStyle}>{(row.DailyReturn * 100).toFixed(2)}%</td>
                <td style={tdStyle}>${Number(row.MA7).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Price Trend</h2>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <LineChart data={data.slice(-30)}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="Date" tick={{ fontSize: 10 }} />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="Close" stroke="#4b5563" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

const thStyle = {
  padding: "10px",
  borderBottom: "2px solid #ddd",
  textAlign: "left",
  fontWeight: "bold"
};

const tdStyle = {
  padding: "8px",
  borderBottom: "1px solid #eee"
};

export default App;
