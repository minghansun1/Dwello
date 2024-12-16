import pandas as pd

# Load the CSV file into a DataFrame
file_path = '/Users/mingh/College/2024 Fall/CIS 5500/Project Data Processing/housing_data.csv'
df = pd.read_csv(file_path)
# Create a new DataFrame of unique neighborhood, city, state combinations
unique_combinations = df[['neighborhood', 'city', 'state']].drop_duplicates().reset_index(drop=True)
unique_combinations['unique_id'] = range(1, len(unique_combinations) + 1)
print(unique_combinations.head())
# Save the unique combinations DataFrame to a new CSV file
unique_combinations_path = '/Users/mingh/College/2024 Fall/CIS 5500/Project Data Processing/unique_neighborhoods.csv'
unique_combinations.to_csv(unique_combinations_path, index=False)

home_datapoints_df = df

# Add the 'id' column with distinct numbers from 1 to n
home_datapoints_df['id'] = range(1, len(df) + 1)

# Merge the home_datapoints_df with unique_combinations to get the neighborhood_id
home_datapoints_df = home_datapoints_df.merge(unique_combinations, on=['neighborhood', 'city', 'state'])

# Rename the 'unique_id' column to 'neighborhood_id'
home_datapoints_df.rename(columns={'unique_id': 'neighborhood_id'}, inplace=True)
home_datapoints_df=home_datapoints_df.sort_values(by=['neighborhood_id', 'period_begin'], ascending=[True, True])
print(home_datapoints_df.head())
# Save the updated DataFrame back to the CSV file
home_datapoints_path = '/Users/mingh/College/2024 Fall/CIS 5500/Project Data Processing/home_datapoints.csv'
home_datapoints_df.to_csv(home_datapoints_path, index=False)

print("The 'id' column has been added successfully.")
# Split the DataFrame into two halves
unique_combinations_mid_index = len(unique_combinations) // 2
home_datapoints_mid_index = len(home_datapoints_df) // 2
unique_combinations_first_half = unique_combinations.iloc[:unique_combinations_mid_index]
unique_combinations_second_half = unique_combinations.iloc[unique_combinations_mid_index:]
home_datapoints_df_first_half = home_datapoints_df.iloc[:home_datapoints_mid_index]
home_datapoints_df_second_half = home_datapoints_df.iloc[home_datapoints_mid_index:]

# Define file paths for the two halves
home_datapoints_first_half_path = '/Users/mingh/College/2024 Fall/CIS 5500/Project Data Processing/home_datapoints_first_half.csv'
home_datapoints_second_half_path = '/Users/mingh/College/2024 Fall/CIS 5500/Project Data Processing/home_datapoints_second_half.csv'
unique_combinations_first_half_path = '/Users/mingh/College/2024 Fall/CIS 5500/Project Data Processing/unique_neighborhoods_first_half.csv'
unique_combinations_second_half_path = '/Users/mingh/College/2024 Fall/CIS 5500/Project Data Processing/unique_neighborhoods_second_half.csv'

# Save the two halves to separate CSV files
home_datapoints_df_first_half.to_csv(home_datapoints_first_half_path, index=False)
home_datapoints_df_second_half.to_csv(home_datapoints_second_half_path, index=False)
unique_combinations_first_half.to_csv(unique_combinations_first_half_path, index=False)
unique_combinations_second_half.to_csv(unique_combinations_second_half_path, index=False)

print("The DataFrame has been split and saved into two separate files successfully.")