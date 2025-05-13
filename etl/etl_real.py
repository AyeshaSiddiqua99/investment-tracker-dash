import pandas as pd
import sqlite3
import os

# List of stock tickers
tickers = ['AAPL', 'MSFT', 'AMZN']

# Find the correct path to data/ and create db file
base_path = os.path.dirname(os.path.dirname(__file__))  # Goes up to root folder
data_path = os.path.join(base_path, 'data')
db_path = os.path.join(base_path, 'stocks.db')

# Connect to SQLite (creates the DB if it doesn't exist)
conn = sqlite3.connect(db_path)

for ticker in tickers:
    print(f"Processing {ticker}...")

    csv_file = os.path.join(data_path, f"{ticker}.csv")

    if not os.path.exists(csv_file):
        print(f"File not found: {csv_file}")
        continue

    # Load CSV into a DataFrame
    df = pd.read_csv(csv_file)

    # Convert types safely
    df['Date'] = pd.to_datetime(df['Date'], errors='coerce')
    df['Close'] = pd.to_numeric(df['Close'], errors='coerce')

    # Calculate metrics
    df['DailyReturn'] = df['Close'].pct_change()
    df['MA7'] = df['Close'].rolling(window=7).mean()

    # Drop rows where critical columns are missing
    df = df.dropna(subset=['Date', 'Close', 'DailyReturn', 'MA7'])

    # Save into SQLite with table name as the ticker
    df.to_sql(ticker, conn, if_exists='replace', index=False)

    print(f"{ticker} data loaded into database.")

# Check one sample
sample = pd.read_sql("SELECT * FROM AMZN LIMIT 3", conn)
print("\nSample data from AMZN:")
print(sample)

conn.close()
