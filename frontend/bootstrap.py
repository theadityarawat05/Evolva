import os

BOOTSTRAP_FILE = "../bootstrap_v2.txt"

if not os.path.exists(BOOTSTRAP_FILE):
    print(f"ERROR: {BOOTSTRAP_FILE} not found.")
    exit(1)

count = 0

with open(BOOTSTRAP_FILE, "r", encoding="utf-8") as f:
    lines = f.readlines()

current_file = None
buffer = []

def write_current():
    global count
    if current_file is None:
        return

    path = current_file
    if path.startswith("frontend/"):
        path = path[len("frontend/"):]

    os.makedirs(os.path.dirname(path), exist_ok=True)

    with open(path, "w", encoding="utf-8") as out:
        out.writelines(buffer)

    print(f"✓ {path}")
    count += 1

for line in lines:
    if line.startswith("=== FILE:"):
        write_current()
        current_file = (
            line.replace("=== FILE:", "")
                .replace("===", "")
                .strip()
        )
        buffer = []
    else:
        if current_file is not None:
            buffer.append(line)

write_current()

print(f"\nDone. {count} files written successfully.")
