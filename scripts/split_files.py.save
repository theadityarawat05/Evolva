import os
import re
import sys

if len(sys.argv) < 2:
    print("Usage: python split_files.py bootstrap_v1.txt")
    sys.exit(1)

bootstrap_file = sys.argv[1]

with open(bootstrap_file, "r", encoding="utf-8") as f:
    content = f.read()

pattern = r"=== START_FILE: (.*?) ===\n(.*?)=== END_FILE: \1 ==="

matches = re.findall(pattern, content, re.DOTALL)

for filepath, filecontent in matches:
    filepath = filepath.strip()

    os.makedirs(os.path.dirname(filepath), exist_ok=True)

    with open(filepath, "w", encoding="utf-8") as outfile:
        outfile.write(filecontent.strip() + "\n")

    print(f"Created: {filepath}")

print(f"\nDone. Generated {len(matches)} files."


