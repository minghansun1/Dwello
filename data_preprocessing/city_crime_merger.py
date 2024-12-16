import pandas as pd

# Load data into DataFrames
df_city_info = pd.read_csv('uscities.csv') 
df_crime_stats = pd.read_csv('merged_crime_and_states.csv') 

# Clean column names and standardize them for easier merging
df_city_info.columns = df_city_info.columns.str.strip().str.lower()
df_crime_stats.columns = df_crime_stats.columns.str.strip().str.lower()

# Standardize the city name columns for a consistent merge
df_city_info['city'] = df_city_info['city'].str.strip().str.title()
df_crime_stats['city'] = df_crime_stats['city'].str.strip().str.title()

# Perform a left merge on 'city' and 'state_id', keeping all data from df_city_info
merged_df = pd.merge(df_city_info, df_crime_stats, on=['city', 'state_id'], how='left')

# Drop the 'state' column from the resulting DataFrame
merged_df = merged_df.drop(columns=['state'])

# Display the merged DataFrame
print(merged_df)

# Optionally, save the merged DataFrame to a CSV file
merged_df.to_csv('merged_city_crime_data.csv', index=False)