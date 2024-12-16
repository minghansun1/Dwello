import pandas as pd

# Load your CSV file into a DataFrame
df = pd.read_csv('living_data.csv')

# Convert all columns that should be numerical to the correct type
numerical_columns = [
    'housing_cost', 'food_cost', 'healthcare_cost', 'childcare_cost',
    'taxes', 'total_cost', 'median_family_income'
]
df[numerical_columns] = df[numerical_columns].apply(pd.to_numeric, errors='coerce')

# Group by 'state', 'county', and 'family_member_count' and calculate the mean for numerical columns
grouped_df = df.groupby(['state_id', 'county', 'family_member_count'], as_index=False)[numerical_columns].mean()

# Export the result to a new CSV file
grouped_df.to_csv('averaged_living_data.csv', index=False)

print("Data has been grouped, averaged, and exported to 'averaged_data.csv'")