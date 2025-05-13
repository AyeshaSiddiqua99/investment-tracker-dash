import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

function App() {
  const [selectedTicker, setSelectedTicker] = useState("AAPL");
  const [data, setData] = useState([]);
  const [summary, setSummary] = useState({});
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    if (!selectedTicker) return;

    fetch(`${API_BASE}/stocks/${selectedTicker}`)
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch((err) => console.error("Data fetch error:", err));

    fetch(`${API_BASE}/stocks/${selectedTicker}/summary`)
      .then((res) => res.json())
      .then((json) => setSummary(json))
      .catch((err) => console.error("Summary fetch error:", err));
  }, [selectedTicker]);

  return (
    <div className="p-6 font-sans">
      <h1 className="text-4xl font-bold mb-4 flex items-center gap-2">
        📊 Stock Dashboard
      </h1>

      {/* Optional hardcoded buttons */}
      <div className="flex gap-3 mb-4">
        {["AAPL", "MSFT", "AMZN"].map((ticker) => (
          <button
            key={ticker}
            onClick={() => setSelectedTicker(ticker)}
            className={`px-4 py-2 rounded ${
              selectedTicker === ticker ? "bg-gray-700 text-white" : "bg-gray-300"
            }`}
          >
            {ticker}
          </button>
        ))}
      </div>

      {/* Real-time Search */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Search any stock (e.g. TSLA)"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value.toUpperCase())}
          className="border rounded px-3 py-2 w-60"
        />
        <button
          onClick={() => setSelectedTicker(searchInput)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Search
        </button>
      </div>

      {/* Summary */}
      <h2 className="text-2xl font-semibold mb-2">Summary for {selectedTicker}</h2>
      <div className="flex gap-6 mb-6">
        <div className="bg-gray-100 p-4 rounded shadow">
          <strong>avg daily_return:</strong>
          <div>{summary.avg_daily_return}</div>
        </div>
        <div className="bg-gray-100 p-4 rounded shadow">
          <strong>max moving_avg:</strong>
          <div>{summary.max_moving_avg}</div>
        </div>
      </div>

      {/* Table */}
      <h2 className="text-xl font-semibold mb-2">Recent Data</h2>
      <div className="overflow-x-auto mb-6">
        <table className="table-auto w-full border-collapse">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="px-3 py-2">Date</th>
              <th className="px-3 py-2">Close</th>
              <th className="px-3 py-2">Daily Return</th>
              <th className="px-3 py-2">MA7</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i} className="border-t">
                <td className="px-3 py-2">{row.Date}</td>
                <td className="px-3 py-2">${parseFloat(row.Close).toFixed(2)}</td>
                <td className="px-3 py-2">{(row.DailyReturn * 100).toFixed(2)}%</td>
                <td className="px-3 py-2">${parseFloat(row.MA7).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Chart */}
      <h2 className="text-xl font-semibold mb-2">Price Trend</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="Date" hide />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="Close" stroke="#8884d8" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default App;
