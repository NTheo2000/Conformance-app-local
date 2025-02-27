import pm4py
import pandas as pd

def parse_csv(csv_path):
    """Parses event log CSV file into a process model."""
    try:
        df = pd.read_csv(csv_path)
        event_log = pm4py.format_dataframe(df, case_id='case:concept:name', activity_key='concept:name', timestamp_key='time:timestamp')
        process_model = pm4py.discover_petri_net_alpha(event_log)
        return {"transitions": len(process_model[1]), "description": "Event log processed successfully"}
    except Exception as e:
        return {"error": str(e)}
