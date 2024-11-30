import json
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
import sys


# Read data from test_input.json
try:
    with open('test_input.json', 'r') as file:
        order_data = json.load(file)
except FileNotFoundError:
    print("Error: test_input.json not found. Make sure to generate it with fetchOrderData.js.")
    exit(1)

# Convert JSON data to Pandas DataFrame
df = pd.DataFrame(order_data)

# Clean the dataset: Convert `order_time` to datetime
df['order_time'] = pd.to_datetime(df['order_time'], format='%H:%M:%S', errors='coerce')
df = df.dropna(subset=['order_time'])

# Extract hour for analysis
df['hour'] = df['order_time'].dt.hour

# Classify orders into day and night
df['time_period'] = df['hour'].apply(lambda x: 'daytime' if 6 <= x < 18 else 'nighttime')

# Determine peak hours using value counts
daytime_df = df[df['time_period'] == 'daytime']
nighttime_df = df[df['time_period'] == 'nighttime']

if daytime_df.empty or nighttime_df.empty:
    print("Insufficient data for daytime or nighttime periods.")
    exit(1)

daytime_peak_hour = daytime_df['hour'].value_counts().idxmax()
nighttime_peak_hour = nighttime_df['hour'].value_counts().idxmax()

# Output results
print(f"Predicted Daytime Peak Hour: {daytime_peak_hour}:00")
print(f"Predicted Nighttime Peak Hour: {nighttime_peak_hour}:00")
