from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlite3
import pandas as pd
import yfinance as yf

app = Flask(__name__)
CORS(app)

# ----------- STATIC DB ENDPOINTS (from SQLite) -----------

@app.route("/stocks/<ticker>")
def get_stock_data(ticker):
    try:
        conn = sqlite3.connect("../stocks.db")
        query = f"SELECT Date, Close, DailyReturn, MA7 FROM {ticker}"
        df = pd.read_sql(query, conn)
        conn.close()

        # Convert and return as JSON
        return jsonify(df.tail(30).to_dict(orient="records"))
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@app.route("/stocks/<ticker>/summary")
def get_summary(ticker):
    try:
        conn = sqlite3.connect("../stocks.db")
        query = f"SELECT AVG(DailyReturn) as avg_return, MAX(MA7) as max_ma FROM {ticker}"
        df = pd.read_sql(query, conn)
        conn.close()

        return jsonify({
            "avg_daily_return": df['avg_return'].iloc[0],
            "max_moving_avg": df['max_ma'].iloc[0]
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# ----------- REAL-TIME LIVE SEARCH ENDPOINT -----------

@app.route("/live/<ticker>")
def get_live_data(ticker):
    try:
        # Download last 1 month of daily data
        df = yf.download(ticker, period="1mo", interval="1d")

        # Compute new columns
        df['DailyReturn'] = df['Close'].pct_change()
        df['MA7'] = df['Close'].rolling(7).mean()
        df = df.dropna(subset=['Close', 'DailyReturn', 'MA7'])
        df.reset_index(inplace=True)

        # Return last 30 rows
        return jsonify(df[['Date', 'Close', 'DailyReturn', 'MA7']].tail(30).to_dict(orient="records"))

    except Exception as e:
        return jsonify({"error": str(e)}), 400

# ----------- HEALTH CHECK -----------

@app.route("/")
def welcome():
    return jsonify({"message": "Welcome to the Stock API!"})

# ----------- RUN APP -----------

import os

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(debug=True, host="0.0.0.0", port=port)
