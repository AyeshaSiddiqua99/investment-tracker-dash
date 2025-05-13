import yfinance as yf
import pandas as pd

# Define the stock tickers and time range
tickers = ['AAPL', 'MSFT', 'AMZN']
start_date = '2023-01-01'
end_date = '2023-12-31'

# Create a folder path to save CSVs
save_path = 'data/'


for ticker in tickers:
    print(f"Fetching data for {ticker}")
    stock_data = yf.download(ticker, start=start_date, end=end_date)
    
    # Reset index so Date becomes a column
    stock_data.reset_index(inplace=True)

    # Save as CSV
    file_path = f"{save_path}{ticker}.csv"
    stock_data.to_csv(file_path, index=False)
    print(f"Saved {file_path}")
