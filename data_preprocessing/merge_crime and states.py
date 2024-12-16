import pandas as pd

# Read the CSV files into DataFrames
us_states_df = pd.read_csv('US States List.csv')
crime_summary_df = pd.read_csv('crime_summary.csv')

# Perform the right join on the DataFrames
merged_df = pd.merge(crime_summary_df, us_states_df, how='right', on='State')

# Save the result to a new CSV file
merged_df.to_csv('merged_crime_and_states.csv', index=False)