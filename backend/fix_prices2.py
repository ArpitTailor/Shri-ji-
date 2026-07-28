import re

with open('seed_data.py', 'r', encoding='utf-8') as f:
    text = f.read()

new_text = re.sub(r'round\(random\.uniform\([^)]+\),\s*2\)', 'random.randint(39, 299)', text)

with open('seed_data.py', 'w', encoding='utf-8') as f:
    f.write(new_text)

print("Updated dynamic prices in seed_data.py")
