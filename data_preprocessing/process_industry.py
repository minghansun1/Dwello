import pandas as pd
import csv

# Load the CSV file into a DataFrame
df = pd.read_csv('MSA_M2023_dl.csv')
# Remove all non-text characters from the start and end of OCC_TITLE
df['OCC_TITLE'] = df['OCC_TITLE'].str.replace(r"^['\"]+|['\"]+$", '', regex=True)

new_df = df

unique_job_titles_df = pd.DataFrame(new_df['OCC_TITLE'].unique())
unique_job_titles_df = unique_job_titles_df.rename(columns={0: 'job_title'})
unique_job_titles_df['id'] = range(1, len(unique_job_titles_df) + 1)

unique_job_categories_df = unique_job_titles_df[unique_job_titles_df['job_title'].str.endswith('Occupations')].reset_index(drop=True)
unique_job_categories_df = unique_job_categories_df.rename(columns={'job_title': 'job_category'})
unique_job_categories_df['id'] = range(1, len(unique_job_categories_df) + 1)
#print(unique_job_categories_df.head())

# Create a new column 'job_category' which includes the last job_category that comes before a certain row
unique_job_titles_df['job_category'] = unique_job_titles_df['job_title'].apply(
    lambda x: unique_job_categories_df.loc[unique_job_categories_df['job_category'] == x, 'job_category'].values[0]
    if x in unique_job_categories_df['job_category'].values else None
).ffill()

# Remove rows where the job title is in unique_job_categories_df
unique_job_titles_df = unique_job_titles_df[~unique_job_titles_df['job_title'].isin(unique_job_categories_df['job_category'])]

#print(unique_job_titles_df.head())

unique_job_titles_df['job_title'] = unique_job_titles_df['job_title'].str.replace(r"^['\"]+|['\"]+$", '', regex=True)
unique_job_categories_df['job_category'] = unique_job_categories_df['job_category'].str.replace(r"^['\"]+|['\"]+$", '', regex=True)

# Save the unique job titles DataFrame to a new CSV file
unique_job_titles_path = 'unique_job_titles.csv'
unique_job_titles_df.to_csv(unique_job_titles_path, index=False)

# Save the unique job categories DataFrame to a new CSV file
unique_job_categories_path = 'unique_job_categories.csv'
unique_job_categories_df.to_csv(unique_job_categories_path, index=False)

# new_df['AREA_TITLE'] = df['AREA_TITLE'].apply(lambda x: x.split(',')[0])

# print(new_df.head())

new_df = new_df.rename({"AREA_TITLE": "city", "PRIM_STATE": "state"}, axis=1)

new_df = new_df.drop(['AREA', 'AREA_TYPE', 'NAICS', 'NAICS_TITLE', 'I_GROUP', 'OWN_CODE', 'OCC_CODE', 'O_GROUP', 'EMP_PRSE', 'LOC_QUOTIENT', 'PCT_TOTAL', 'PCT_RPT', 'MEAN_PRSE', 'ANNUAL','HOURLY'], axis=1)

columns_to_replace=['H_PCT10', 'H_PCT25', 'H_MEDIAN', 'H_PCT75', 'H_PCT90']

new_df[columns_to_replace] = new_df[columns_to_replace].replace("#", "115")

columns_to_replace=['A_PCT10', 'A_PCT25', 'A_MEDIAN', 'A_PCT75', 'A_PCT90']

new_df[columns_to_replace] = new_df[columns_to_replace].replace("#", "239200")

# Casting columns to correct data types
columns_to_convert = ['city', 'state', 'OCC_TITLE']
new_df[columns_to_convert] = new_df[columns_to_convert].astype(str)

new_df['TOT_EMP'] = pd.to_numeric(new_df['TOT_EMP'].str.replace(',', ''), errors='coerce').fillna(0).astype(int)
new_df['JOBS_1000'] = pd.to_numeric(new_df['JOBS_1000'].str.replace(',', ''), errors='coerce').fillna(0).astype(float)

hourly_columns = ['H_MEAN', 'H_PCT10', 'H_PCT25', 'H_MEDIAN', 'H_PCT75', 'H_PCT90']
for column in hourly_columns:
    new_df[column] = pd.to_numeric(new_df[column].str.replace(',', ''), errors='coerce').fillna(0).astype(float)

annual_columns = ['A_MEAN', 'A_PCT10', 'A_PCT25', 'A_MEDIAN', 'A_PCT75', 'A_PCT90']
for column in annual_columns:
    new_df[column] = pd.to_numeric(new_df[column].str.replace(',', ''), errors='coerce').fillna(0).astype(int)

new_df = new_df[~new_df['OCC_TITLE'].isin(unique_job_categories_df['job_category'])]
new_df['job_id'] = new_df['OCC_TITLE'].apply(lambda x: unique_job_titles_df.loc[unique_job_titles_df['job_title'] == x, 'id'].values[0])

new_df['id'] = range(1, len(new_df) + 1)

new_df['city'] = new_df['city'].apply(lambda x: x.split(',')[0])

print(new_df.head())
print(new_df.dtypes)

new_df.to_csv('processed_industry.csv', index=False)
unique_job_titles_df.to_csv('unique_job_titles.csv', index=False)