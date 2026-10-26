import json, re

ids = {}
with open(r"C:\Users\januk\.gemini\antigravity-ide\brain\725577fb-8288-4429-9b3b-969b4a0a52cc\.system_generated\logs\transcript_full.jsonl", "r", encoding="utf-8") as f:
    for line in f:
        if "driveId" in line:
            matches = re.findall(r"['\"](\d{2})['\"]\s*:\s*\{[^}]*?driveId\s*:\s*['\"]([a-zA-Z0-9_-]+)['\"]", line)
            for num, d_id in matches:
                ids[num] = d_id

print("Extracted Drive IDs:")
for k in sorted(ids.keys()):
    print(f"'{k}': '{ids[k]}'")
