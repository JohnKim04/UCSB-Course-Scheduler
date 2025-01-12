import json

# Load JSON data from a file
with open('output.json', 'r') as file:
    json_data = json.load(file)

# List of course IDs to look for
# course_ids_to_match = [
#     "ANTH2", "ANTH3", "ASAM1", "ASAM9", "CHST1B", "COMM1", "ECON1",
#     "ECON2", "ECON9", "FEMST20", "FEMST30", "GEOG5", "GEOG20",
#     "GLOBL2", "HIST17B", "LING20", "LING70", "PSY1", "RGST14", "SOC1"
# ]

course_ids_to_match = [
    "ARTHI6B", "BLST3", "BLST7", "BLST49B", "CLIT35", "CLIT50B", "CLIT50C",
    "CLASS50", "EACS3", "EACS4A", "EACS5", "ENGL23", "FR50BX",
    "FR50CX", "GER35", "HIST2B", "HIST4B", "HIST8A", "HIST20", "HIST46B", "HIST49B",
    "PHIL1", "PHIL3", "PHIL4", "PHIL20B", "RGST3", "RGST4"
]

# Function to process JSON data
def add_ge_area_to_courses(data):
    for course in data.get("classes", []):
        # Normalize the courseId by removing whitespace
        normalized_course_id = "".join(course["courseId"].split())
        
        # Check if normalized courseId is in the list of IDs to match
        if normalized_course_id in course_ids_to_match:
            # Add the geArea attribute to the course
            course["geArea"] = "E"

# Process the JSON
add_ge_area_to_courses(json_data)

# Save the modified JSON back to a file
with open('output.json', 'w') as file:
    json.dump(json_data, file, indent=2)

print("Updated JSON has been saved to output.json")
