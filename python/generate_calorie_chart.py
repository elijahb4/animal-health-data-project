import pandas as pd
import json

# load csv
df = pd.read_csv('database/activityData.csv')

df['Hour'] = pd.to_numeric(df['Hour'], errors='coerce')

# group by hour and calculate average calorie burn
avg_calories = df.groupby('Hour')['Calorie Burn'].mean().sort_index()

# prepare data for chart.js
chart_data = {
    "labels": avg_calories.index.tolist(),
    "datasets": [{
        "label": "Average Calorie Burn per Hour",
        "data": avg_calories.values.tolist(),
        "fill": False,
        "borderColor": "rgba(75, 192, 192, 1)",
        "tension": 0.1
    }]
}

# save to json
with open('data/chart_data_calories.json', 'w') as f:
    json.dump(chart_data, f, indent=2)

print("chart_data_calories.json created.")