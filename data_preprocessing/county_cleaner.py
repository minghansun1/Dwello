import pandas as pd

# Load data into DataFrames
df1 = pd.read_csv('merged_us_counties.csv') 
df2 = pd.read_csv('averaged_living_data.csv')

# Data cleaning: Ensure column names match and are in a consistent format
df1.columns = df1.columns.str.strip().str.lower()
df2.columns = df2.columns.str.strip().str.lower()

# Convert columns to appropriate data types where necessary
numeric_columns_df1 = ['lat', 'lng', 'population', 'density']
df1[numeric_columns_df1] = df1[numeric_columns_df1].apply(pd.to_numeric, errors='coerce')

numeric_columns_df2 = ['family_member_count', 'housing_cost', 'food_cost', 'healthcare_cost', 'childcare_cost', 'taxes', 'total_cost', 'median_family_income']
df2[numeric_columns_df2] = df2[numeric_columns_df2].apply(pd.to_numeric, errors='coerce')

# Merge the DataFrames on 'county' and 'state_id'
merged_df = pd.merge(df1, df2, on=['county', 'state_id'], how='inner')

# Display merged DataFrame to verify results
print(merged_df)

# If you'd like to save the merged result to a new CSV file:
merged_df.to_csv('county_x_living_data.csv', index=False)