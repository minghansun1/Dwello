import pandas as pd

# Load the CSV file
df = pd.read_csv('crime_data.csv')

# Filter records from 2000 to 2014
filtered_df = df[(df['Year'] >= 2000) & (df['Year'] <= 2014)]

# Group by City and State, and sum the incidents for each crime type
result = filtered_df.pivot_table(
    index=['City', 'State'],
    columns='Crime Type',
    values='Incident',
    aggfunc='sum',
).reset_index()

# Rename columns for clarity
result.columns.name = None  # Remove pivot column name
result.rename(columns={
    'Murder or Manslaughter': 'Murder_or_Manslaughter',
    'Manslaughter by Negligence': 'Manslaughter_by_Negligence'
}, inplace=True)

# Save the result to a new CSV file or display it
result.to_csv('crime_summary.csv', index=False)
print(result)