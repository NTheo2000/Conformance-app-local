import pm4py

def parse_bpmn(bpmn_path):
    """Parses BPMN file and extracts process structure."""
    try:
        bpmn_model = pm4py.read_bpmn(bpmn_path)
        process_graph = pm4py.convert_to_process_tree(bpmn_model)
        return {"nodes": len(process_graph.children), "description": "BPMN model loaded successfully"}
    except Exception as e:
        return {"error": str(e)}
