import pandas as pd
from datetime import datetime, timedelta

data = pd.read_csv('database/activityData.csv')

# Create DataFrame
df = pd.DataFrame(data)

print(df.head())

# Initialize a start date
start_date = datetime(2023, 1, 1)  # Example start date
current_date = start_date

# List to store the dates
dates = []

# Iterate through the DataFrame
for index, row in df.iterrows():
    if row['Hour'] == 0 and row['DogID'] == 'ÇANINE001' and index != 0 and df.loc[index - 1, 'Hour'] == 23:
        # Increment the date
        current_date += timedelta(days=1)
    # Append the current date
    dates.append(current_date)

# Add the date column to the DataFrame
df['Date'] = dates

# Combine Date and Hour into a single datetime column
df['Date'] = pd.to_date(df['Date'].astype(str))

# Set the datetime column as the index
df.set_index('Date', inplace=True)

# Display the DataFrame
print(df)
