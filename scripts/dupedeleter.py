#!/usr/bin/env python3

import json
import os

def remove_duplicates(input_file, output_file):
    with open(input_file, 'r') as file:
        data = json.load(file)

    seen = set()
    unique_questions = []

    for question in data:
        identifier = (
            question.get("content", ""),
            tuple(question.get("topics", [])),
            question.get("command_term", ""),
            question.get("marks", "")
        )

        if identifier not in seen:
            seen.add(identifier)
            unique_questions.append(question)
        else:
            # delete the file at data/question['id'].html
            os.remove(f"data/{question['id']}.html")

    with open(output_file, 'w') as file:
        json.dump(unique_questions, file, indent=4)

    print(f"Processed {len(data)} questions. Reduced to {len(unique_questions)} unique questions.")

input_file = "questions.json"
output_file = "questions_index.json"

remove_duplicates(input_file, output_file)
