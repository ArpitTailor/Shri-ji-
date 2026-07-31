import os
import re

directory = r"c:\Users\Administrator\OneDrive\Desktop\shree-ji"

replacements = [
    (r'Shri Ji', 'Shri Ji'),
    (r'shri_ji\.db', 'shri_ji.db'),
    (r'shri_ji_theme', 'shri_ji_theme'),
    (r'shri_ji_location', 'shri_ji_location'),
    (r'shri_ji_user_data', 'shri_ji_user_data'),
    (r'shri_ji_token', 'shri_ji_token'),
    (r'shri_ji_wishlist', 'shri_ji_wishlist'),
    (r'shri_ji_cart', 'shri_ji_cart'),
    (r'shri-ji-react-cache-v1', 'shri-ji-react-cache-v1'),
    (r'SHRIJI20', 'SHRIJI20'),
    (r'admin@shri_ji\.com', 'admin@shriji.com'),
    (r'verify_test@shri_ji\.com', 'verify_test@shriji.com'),
    (r'shri_ji', 'shri_ji') # fallback for any remaining lowercase ones
]

def replace_in_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        new_content = content
        for pattern, repl in replacements:
            new_content = re.sub(pattern, repl, new_content)
            
        if new_content != content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Updated {filepath}")
    except Exception as e:
        print(f"Error on {filepath}: {e}")

for root, _, files in os.walk(directory):
    if 'node_modules' in root or '.git' in root or '.snapshots' in root:
        continue
    for file in files:
        if file.endswith(('.py', '.js', '.jsx', '.json', '.html', '.css', '.md', '.sql', '.txt')):
            replace_in_file(os.path.join(root, file))

# Rename DB if exists
db_path = os.path.join(directory, 'backend', 'shri_ji.db')
new_db_path = os.path.join(directory, 'backend', 'shri_ji.db')
if os.path.exists(db_path):
    os.rename(db_path, new_db_path)
    print(f"Renamed {db_path} to {new_db_path}")

print("Done!")
