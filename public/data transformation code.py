import pandas as pd

raw = pd.read_csv("public/data/trajectory_data(in) (1).csv")

print(raw.columns.tolist())
print(raw.head())
rows = []

for _, row in raw.iterrows():
    d1 = row.get("disease 1")
    d2 = row.get("disease 2")
    d3 = row.get("disease 3")
    d4 = row.get("disease 4")

    t2n = row.get("t2n")
    t3n = row.get("t3n")
    t4n = row.get("t4n")

    if pd.notna(d1) and pd.notna(d2) and pd.notna(t2n):
        rows.append({
            "source": d1,
            "target": d2,
            "count": t2n,
            "stage": "d1-d2",
            "start_stage": "d1",
            "disease1": d1,
            "disease2": d2,
            "disease3": d3,
            "disease4": d4
        })

    if pd.notna(d2) and pd.notna(d3) and pd.notna(t3n):
        rows.append({
            "source": d2,
            "target": d3,
            "count": t3n,
            "stage": "d2-d3",
            "start_stage": "d2",
            "disease1": d1,
            "disease2": d2,
            "disease3": d3,
            "disease4": d4
        })

    if pd.notna(d3) and pd.notna(d4) and pd.notna(t4n):
        rows.append({
            "source": d3,
            "target": d4,
            "count": t4n,
            "stage": "d3-d4",
            "start_stage": "d3",
            "disease1": d1,
            "disease2": d2,
            "disease3": d3,
            "disease4": d4
        })

transformed = pd.DataFrame(rows)

print(transformed.head())
print("Rows created:", len(transformed))

transformed.to_csv("trajectory_transitions.csv", index=False)