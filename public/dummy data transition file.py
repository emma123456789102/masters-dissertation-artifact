# dummy data file 
# here we need to create a dummy data file to test the upload functionality 

import pandas as pd
from pathlib import Path
output_Directory = Path("dummy_data_test")
output_Directory.mkdir(parents=True, exist_ok=True)

# we need to create both a national dataset and a regional dataset to test

# National transition data
national_rows = [
    {"Source": "A04", "Target": "J18", "Count": 20, "Stage": "d1-d2"},
    {"Source": "J18", "Target": "I50", "Count": 15, "Stage": "d2-d3"},
    {"Source": "J18", "Target": "E11", "Count": 5, "Stage": "d2-d3"},
    {"Source": "C34", "Target": "J44", "Count": 10, "Stage": "d1-d2"},
    {"Source": "J44", "Target": "I50", "Count": 10, "Stage": "d2-d3"},
]

national_df = pd.DataFrame(national_rows)
national_df.to_csv(
    output_Directory / "dummy_trajectory_transitions.csv",
    index=False
)

# Demographic transition data
demographic_rows = [
    {
        "source": "A04",
        "target": "J18",
        "count": 12,
        "stage": "d1-d2",
        "start_stage": "d1",
        "disease1": "A04",
        "disease2": "J18",
        "disease3": "I50",
        "sex": "Female",
        "age_group": "45-64",
        "simd": "1",
        "n_death": 2,
        "dataset": "Dummy demographic",
    },
    {
        "source": "J18",
        "target": "I50",
        "count": 12,
        "stage": "d2-d3",
        "start_stage": "d1",
        "disease1": "A04",
        "disease2": "J18",
        "disease3": "I50",
        "sex": "Female",
        "age_group": "45-64",
        "simd": "1",
        "n_death": 2,
        "dataset": "Dummy demographic",
    },
    {
        "source": "A04",
        "target": "J18",
        "count": 8,
        "stage": "d1-d2",
        "start_stage": "d1",
        "disease1": "A04",
        "disease2": "J18",
        "disease3": "E11",
        "sex": "Male",
        "age_group": "65-74",
        "simd": "3",
        "n_death": 1,
        "dataset": "Dummy demographic",
    },
    {
        "source": "J18",
        "target": "E11",
        "count": 8,
        "stage": "d2-d3",
        "start_stage": "d1",
        "disease1": "A04",
        "disease2": "J18",
        "disease3": "E11",
        "sex": "Male",
        "age_group": "65-74",
        "simd": "3",
        "n_death": 1,
        "dataset": "Dummy demographic",
    },
    {
        "source": "C34",
        "target": "J44",
        "count": 5,
        "stage": "d1-d2",
        "start_stage": "d1",
        "disease1": "C34",
        "disease2": "J44",
        "disease3": "I50",
        "sex": "Female",
        "age_group": "75+",
        "simd": "5",
        "n_death": 3,
        "dataset": "Dummy demographic",
    },
    {
        "source": "J44",
        "target": "I50",
        "count": 5,
        "stage": "d2-d3",
        "start_stage": "d1",
        "disease1": "C34",
        "disease2": "J44",
        "disease3": "I50",
        "sex": "Female",
        "age_group": "75+",
        "simd": "5",
        "n_death": 3,
        "dataset": "Dummy demographic",
    },
]

demographic_df = pd.DataFrame(demographic_rows)
demographic_df.to_csv(
    output_Directory / "dummy_demographic_transitions.csv",
    index=False
)

print("Dummy datasets created in:", output_Directory.resolve())