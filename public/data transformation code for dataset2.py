import pandas as pd
from pathlib import Path

input_folder = Path("C:/Users/Emma Davidson/masters-dissertation-artifact/public/data/DataSet2 fife and tayside")
output_file = Path("public/data/dataset2_demographic_transitions.csv")

files = [
    ("trj5.csv", "All", "All", "All"),
    ("trj5_F.csv", "Female", "All", "All"),
    ("trj5_M.csv", "Male", "All", "All"),
    ("trj5_1834.csv", "All", "18-34", "All"),
    ("trj5_3564.csv", "All", "35-64", "All"),
    ("trj5_65.csv", "All", "65+", "All"),
    ("trj5_simd1.csv", "All", "All", "SIMD 1"),
    ("trj5_simd2.csv", "All", "All", "SIMD 2"),
    ("trj5_simd3.csv", "All", "All", "SIMD 3"),
    ("trj5_simd4.csv", "All", "All", "SIMD 4"),
    ("trj5_simd5.csv", "All", "All", "SIMD 5"),
]

rows = []

for filename, sex, age_group, simd in files:
    path = input_folder / filename
    if not path.exists():
        print(f"Skipping missing file: {filename}")
        continue

    df = pd.read_csv(path)

    for _, row in df.iterrows():
        d1, d2, d3 = row.get("d1"), row.get("d2"), row.get("d3")
        n2, n3 = row.get("n2"), row.get("n3")
        n_death = row.get("n_death")

        if pd.notna(d1) and pd.notna(d2) and pd.notna(n2):
            rows.append({
                "source": d1,
                "target": d2,
                "count": n2,
                "stage": "d1-d2",
                "start_stage": "d1",
                "disease1": d1,
                "disease2": d2,
                "disease3": d3,
                "sex": sex,
                "age_group": age_group,
                "simd": simd,
                "n_death": n_death,
                "dataset": filename
            })

        if pd.notna(d2) and pd.notna(d3) and pd.notna(n3):
            rows.append({
                "source": d2,
                "target": d3,
                "count": n3,
                "stage": "d2-d3",
                "start_stage": "d2",
                "disease1": d1,
                "disease2": d2,
                "disease3": d3,
                "sex": sex,
                "age_group": age_group,
                "simd": simd,
                "n_death": n_death,
                "dataset": filename
            })

out = pd.DataFrame(rows)
out.to_csv(output_file, index=False)

print("Rows created:", len(out))
print("Saved to:", output_file)
print(out.head())