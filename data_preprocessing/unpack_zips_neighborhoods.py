import pandas as pd

# Input and output file names
input_file = "usneighborhoods_zips.csv"
output_file = "unpacked_usneighborhoods_zips.csv"

# Read the CSV file
df = pd.read_csv(input_file)

# Unpack zip codes into individual rows
df_unpacked = df.assign(zips=df['zips'].str.split()).explode('zips').reset_index(drop=True)

# Save the result to a new CSV file
df_unpacked.to_csv(output_file, index=False)

print(f"Unpacked data has been saved to {output_file}")