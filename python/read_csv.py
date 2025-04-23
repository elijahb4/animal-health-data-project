import pandas as pd
from datetime import datetime, timedelta

data = pd.read_csv('database/activityData.csv')

# create DataFrame
df = pd.DataFrame(data)

print(df.head())

# initialize a start date
start_date = datetime(2023, 1, 1) # example data!
current_date = start_date

# list to store the dates
dates = []

# iterate through the DataFrame
for index, row in df.iterrows():
    if row['Hour'] == 0 and row['DogID'] == 'ÇANINE001' and index != 0 and df.loc[index - 1, 'Hour'] == 23:
        # increment the date
        current_date += timedelta(days=1)
    # append the current date
    dates.append(current_date)

# add the date column to the DataFrame
df['Date'] = dates

# combine Date and Hour into a single datetime column
df['Date'] = pd.to_date(df['Date'].astype(str))

# set the datetime column as the index
df.set_index('Date', inplace=True)

# display the DataFrame
print(df)
