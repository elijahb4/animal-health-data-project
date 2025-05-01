import pandas as pd
import numpy as np
from datetime import timedelta
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import PolynomialFeatures
from sklearn.svm import SVR
from sklearn.ensemble import RandomForestRegressor
import json
import sys
import warnings

warnings.filterwarnings("ignore")  # stupid warning go away

def predict_metric(csv_path, dog_id, column, start_date, days, training_days=30, model_type='linear', debug=False):
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

    recent_df = df.tail(training_days).copy()
    recent_df['DayIndex'] = np.arange(len(recent_df))
    X = recent_df[['DayIndex']]
    y = recent_df[column]

    start_dt = pd.to_datetime(start_date)
    start_index = (start_dt - df['Date'].min()).days
    future_indices = np.array([start_index + i for i in range(days)]).reshape(-1, 1)
    future_dates = [start_dt + timedelta(days=i) for i in range(days)]

    # select model!
    if model_type == 'polynomial':
        pf = PolynomialFeatures(degree=2)
        X_poly = pf.fit_transform(X)
        future_poly = pf.transform(future_indices)
        model = LinearRegression().fit(X_poly, y)
        predictions = model.predict(future_poly)

    elif model_type == 'svr':
        model = SVR(kernel='rbf')
        model.fit(X, y)
        predictions = model.predict(future_indices)

    elif model_type in ('rf', 'random_forest'):
        model = RandomForestRegressor(n_estimators=100, random_state=42)
        model.fit(X, y)
        predictions = model.predict(future_indices)

    else:  # default to linear
        model = LinearRegression().fit(X, y)
        predictions = model.predict(future_indices)

    # debug logging
    if debug:
        print("==== DEBUG INFO ====", file=sys.stderr)
        print(f"Model used: {model_type}", file=sys.stderr)
        print(f"Dog ID: {dog_id}", file=sys.stderr)
        print(f"Metric: {column}", file=sys.stderr)
        print(f"Start Date: {start_date}", file=sys.stderr)
        print(f"Prediction Days: {days}", file=sys.stderr)
        print(f"Training Days: {training_days}", file=sys.stderr)
        print(f"Training Data Points: {len(recent_df)}", file=sys.stderr)
        print("Training Dates:", recent_df['Date'].dt.strftime('%Y-%m-%d').tolist(), file=sys.stderr)
        print("Training Values:", recent_df[column].tolist(), file=sys.stderr)
        print("Future Indices:", future_indices.flatten().tolist(), file=sys.stderr)
        print("Future Dates:", [d.strftime('%Y-%m-%d') for d in future_dates], file=sys.stderr)
        print("Predicted Values:", predictions.tolist(), file=sys.stderr)
        print("====================", file=sys.stderr)

    output = [{"date": d.strftime('%Y-%m-%d'), "value": round(v, 2)} for d, v in zip(future_dates, predictions)]
    training_output = [{"date": d.strftime('%Y-%m-%d'), "value": round(v, 2)} for d, v in zip(recent_df['Date'], recent_df[column])]
    return json.dumps({"predictions": output, "training": training_output})

if __name__ == '__main__':
    csv_path = sys.argv[1] if len(sys.argv) > 1 else 'activityData.csv'
    dog_id = sys.argv[2] if len(sys.argv) > 2 else 'CANINE001'
    column = sys.argv[3] if len(sys.argv) > 3 else 'Calorie Burn'
    start_date = sys.argv[4] if len(sys.argv) > 4 else '2024-03-30'
    days = int(sys.argv[5]) if len(sys.argv) > 5 else 7
    training_days = int(sys.argv[6]) if len(sys.argv) > 6 else 30
    model_type = sys.argv[7] if len(sys.argv) > 7 else 'linear'

    result = predict_metric(csv_path, dog_id, column, start_date, days, training_days, model_type, debug=True) # debug to thingy
    print(result, file=sys.stdout)