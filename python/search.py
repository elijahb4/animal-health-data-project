import sys
import pandas as pd
import json

query = sys.argv[1].lower()
column = sys.argv[2]
csv_file = '../database/activityData.csv'

results = []

for chunk in pd.read_csv(csv_file, chunksize=10000):
    chunk[column] = chunk[column].astype(str).str.lower()
    matched = chunk[chunk[column].str.contains(query, na=False)]
    results.extend(matched.to_dict(orient='records'))

print(json.dumps(results))