from flask import Flask, jsonify
from flask_cors import CORS
import sqlite3
import pandas as pd

app = Flask(__name__)
CORS(app)


DB_PATH = "../stocks.db"  # Path to your SQLite database

def query_db(ticker):
    conn = sqlite3.connect(DB_PATH)
    df = pd.read_sql(f"SELECT * FROM {ticker}", conn)
    conn.close()
    return df

@app.route('/')
def home():
    return jsonify({"message": "Welcome to the Stock API!"})

@app.route('/stocks/<ticker>')
def get_stock_data(ticker):
    try:
        df = query_db(ticker.upper())
        return df.to_json(orient="records")
    except Exception as e:
        return jsonify({"error": str(e)})

@app.route('/stocks/<ticker>/summary')
def get_stock_summary(ticker):
    try:
        df = query_db(ticker.upper())
        summary = {
            "latest_close": round(df["Close"].iloc[-1], 2),
            "average_close": round(df["Close"].mean(), 2),
            "average_return": round(df["DailyReturn"].mean(), 5),
            "max_close": round(df["Close"].max(), 2),
            "min_close": round(df["Close"].min(), 2),
        }
        return jsonify(summary)
    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == '__main__':
    app.run(debug=True)
