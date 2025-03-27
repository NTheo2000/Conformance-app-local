# process_mining/conformance_alignments.py

import os
import pm4py
from pm4py.objects.log.importer.xes import importer as xes_importer
from pm4py.algo.conformance.alignments.petri_net import algorithm as alignments

def calculate_alignments(bpmn_path: str, xes_path: str):
    if not os.path.exists(bpmn_path):
        raise FileNotFoundError(f"BPMN file not found: {bpmn_path}")
    if not os.path.exists(xes_path):
        raise FileNotFoundError(f"XES file not found: {xes_path}")

    bpmn_model = pm4py.read_bpmn(bpmn_path)
    net, initial_marking, final_marking = pm4py.convert.convert_to_petri_net(bpmn_model)
    log = xes_importer.apply(xes_path)
    aligned_traces = alignments.apply_log(log, net, initial_marking, final_marking)

    return aligned_traces

def get_fitness_per_trace(aligned_traces):
    fitness_data = []
    for i, alignment in enumerate(aligned_traces):
        fitness = round(alignment.get("fitness", 0), 4)
        fitness_data.append({
            "trace": f"Trace {i + 1}",
            "conformance": fitness
        })
    return fitness_data

def get_conformance_bins(fitness_data):
    bins = [ { "averageConformance": 0, "traceCount": 0 } for _ in range(10) ]

    for item in fitness_data:
        conformance = item["conformance"]
        index = min(int(conformance * 10), 9)
        bins[index]["averageConformance"] += conformance
        bins[index]["traceCount"] += 1

    for bin in bins:
        if bin["traceCount"] > 0:
            bin["averageConformance"] /= bin["traceCount"]

    return bins

