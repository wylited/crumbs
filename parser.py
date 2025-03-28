import os
import json
from bs4 import BeautifulSoup

HTML_FOLDER = "question_node_trees"

questions_index = []

def extract_question_data(file_path):
    with open(file_path, "r", encoding="utf-8") as file:
        soup = BeautifulSoup(file, "html.parser")

        # Extract the first table (metadata)
        table = soup.find("table", class_="meta_info")
        if not table:
            return None

        rows = table.find_all("tr")
        metadata = {}
        for row in rows:
            cells = row.find_all("td")
            for i in range(0, len(cells), 2):  # Process two columns at a time
                key = cells[i].text.strip()
                value = cells[i + 1].text.strip()
                metadata[key] = value.replace("\u00a0", " ")  # Replace non-breaking spaces

        # Extract the topic and sub-topic from the second table
        syllabus_sections = soup.find_all("div", class_="syllabus_section")
        topics = []
        for section in syllabus_sections:
            topics.append(section.text.strip())

        # Structure the question data
        question_data = {
            "date": metadata.get("Date", ""),
            "marks": metadata.get("Marks available", "").replace("[Maximum mark: ", "").replace("]", ""),
            "reference_code": metadata.get("Reference code", ""),
            "level": metadata.get("Level", ""),
            "paper": metadata.get("Paper", ""),
            "time_zone": metadata.get("Time zone", ""),
            "command_term": metadata.get("Command term", ""),
            "question_number": metadata.get("Question number", ""),
            "topics": topics,
        }
        return question_data

for filename in os.listdir(HTML_FOLDER):
    if filename.endswith(".html"):
        file_path = os.path.join(HTML_FOLDER, filename)
        question_data = extract_question_data(file_path)
        if question_data:
            questions_index.append(question_data)

with open("questions_index.json", "w", encoding="utf-8") as json_file:
    json.dump(questions_index, json_file, indent=4)

print(f"Indexed {len(questions_index)} questions.")
