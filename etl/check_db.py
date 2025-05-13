import sqlite3
import pandas as pd

# Connect to your SQLite database
conn = sqlite3.connect("../stocks.db")

# Read table for AAPL
df = pd.read_sql("SELECT Date, Close, DailyReturn, MA7 FROM AAPL LIMIT 10", conn)

# Show the DataFrame in terminal
print(df)

# Optional: check data types
print("\nColumn types:")
print(df.dtypes)

conn.close()
