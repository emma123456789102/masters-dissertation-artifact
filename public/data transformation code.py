import pandas as pd

raw = pd.read_csv("public/data/trajectory_data(in) (1).csv")

rows = []

for _, row in raw.iterrows():
    transitions = [
        ("d1", "d2", "t2n", "d1-d2"),
        ("d2", "d3", "t3n", "d2-d3"),
        ("d3", "d4", "t4n", "d3-d4")
    ]

    for source_col, target_col, count_col, stage in transitions:
        source = row.get(source_col)
        target = row.get(target_col)
        count = row.get(count_col)

        if pd.notna(source) and pd.notna(target) and pd.notna(count):
            rows.append({
                "Source": source,
                "Target": target,
                "Count": count,
                "Stage": stage
            })

transformed = pd.DataFrame(rows)

transformed.to_csv("trajectory_transitions.csv", index=False)