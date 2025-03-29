import os
from bs4 import BeautifulSoup

# Define the input and output directories
input_dir = 'data'
output_dir = 'out'

# Create the output directory if it doesn't exist
os.makedirs(output_dir, exist_ok=True)

# Iterate over all HTML files in the input directory
for filename in os.listdir(input_dir):
    if filename.endswith('.html'):
        input_file_path = os.path.join(input_dir, filename)

        # Open the HTML file and parse it with BeautifulSoup
        with open(input_file_path, 'r', encoding='utf-8') as file:
            soup = BeautifulSoup(file, 'lxml')

        # Find the desired div
        div_content = soup.find('div', class_='p-3 bg-white rounded')

        # If the div is found, create a new HTML file
        if div_content:
            # Create the new HTML structure
            new_html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="styles.css">
    <script src="https://cdn.jsdelivr.net/npm/mathjax@3.2.2/es5/tex-mml-chtml.min.js"></script>
    <script src="scripts.js"></script>
</head>
<body>
    {div_content}
</body>
</html>"""

            # Save the new HTML file in the output directory
            output_file_path = os.path.join(output_dir, filename)
            with open(output_file_path, 'w', encoding='utf-8') as output_file:
                output_file.write(new_html)

print("Extraction complete. New files saved in 'out/' directory.")
