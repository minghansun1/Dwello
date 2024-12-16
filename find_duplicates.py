import csv
from collections import defaultdict

def find_duplicates(file_path):
    duplicates = defaultdict(list)
    
    with open(file_path, mode='r') as file:
        reader = csv.DictReader(file)
        for row in reader:
            duplicates[row['neighborhood_id']].append(row)
    
    for neighborhood_id, rows in duplicates.items():
        if len(rows) > 1:
            for row in rows:
                print(row)

if __name__ == "__main__":
    find_duplicates('/Users/mingh/College/2024 Fall/CIS 5500/Project Data Processing/home_datapoints.csv')