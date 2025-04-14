import pandas as pd # requires libraries to be installed. need to add to readme. problem with the python file too. need workaround soon. environment variable inaccessible from apache? idk
import numpy as np
from datetime import timedelta
from sklearn.linear_model import LinearRegression
import json
import sys
import warnings
warnings.filterwarnings("ignore") # get rid of annoying sklearn warning

# use only last 30 days of TRAINING data to make model more reactive!!! (DEFAULT)
def predict_metric(csv_path, dog_id, column, start_date, days, training_days=30, debug=False): # leave last param alone please thanks
    df = pd.read_csv(csv_path)
    df['Date'] = pd.to_datetime(df['Date'], format='%d-%m-%Y')
    df = df[df['DogID'] == dog_id]
    df = df[pd.to_numeric(df[column], errors='coerce').notnull()]
    df[column] = df[column].astype(float)

    df = df.groupby('Date')[column].mean().reset_index()
    full_range = pd.date_range(start=df['Date'].min(), end=df['Date'].max())
    df = df.set_index('Date').reindex(full_range).interpolate(method='linear').reset_index()
    df.columns = ['Date', column]
    df = df.dropna()

    # use only last 30 days of TRAINING data to make model more reactive!!!
    recent_df = df.tail(training_days).copy()
    recent_df['DayIndex'] = np.arange(len(recent_df)) # map dates to nums
    X = recent_df[['DayIndex']]
    y = recent_df[column]

    model = LinearRegression()
    model.fit(X, y)

    if debug:
        print("Filtered rows for training:", len(df), file=sys.stderr)
        print("Training dates:", df['Date'].dt.strftime('%Y-%m-%d').tolist(), file=sys.stderr)
        print("Training values:", df[column].tolist(), file=sys.stderr)

    start_dt = pd.to_datetime(start_date)
    start_index = (start_dt - df['Date'].min()).days
    future_indices = np.array([start_index + i for i in range(days)]).reshape(-1, 1) # time series linear regression
    future_dates = [start_dt + timedelta(days=i) for i in range(days)]
    predictions = model.predict(future_indices)

    output = [{"date": d.strftime('%Y-%m-%d'), "value": round(v, 2)} for d, v in zip(future_dates, predictions)]
    return json.dumps(output)

# for CLI/testing
if __name__ == '__main__':
    csv_path = sys.argv[1] if len(sys.argv) > 1 else 'activityData.csv'
    dog_id = sys.argv[2] if len(sys.argv) > 2 else 'CANINE001'
    column = sys.argv[3] if len(sys.argv) > 3 else 'Calorie Burn'
    start_date = sys.argv[4] if len(sys.argv) > 4 else '2024-03-30'
    days = int(sys.argv[5]) if len(sys.argv) > 5 else 7

    training_days = int(sys.argv[6]) if len(sys.argv) > 6 else 30
    result = predict_metric(csv_path, dog_id, column, start_date, days, training_days, debug=False) # leave last param alone please thanks
    print(result)