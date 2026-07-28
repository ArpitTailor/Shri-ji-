import os
import re

components_dir = os.path.join(os.path.dirname(__file__), 'src', 'components')

for root, _, files in os.walk(components_dir):
    for f in files:
        if f.endswith('.jsx'):
            path = os.path.join(root, f)
            with open(path, 'r', encoding='utf-8') as file:
                content = file.read()
            
            new_content = content
            
            # Replace dark mode specific background colors with variables
            new_content = re.sub(r"background:\s*'rgba\(255,255,255,0\.06\)'", "background: 'var(--bg-tertiary)'", new_content)
            new_content = re.sub(r"background:\s*'rgba\(255,\s*255,\s*255,\s*0\.06\)'", "background: 'var(--bg-tertiary)'", new_content)
            
            new_content = re.sub(r"background:\s*'rgba\(255,255,255,0\.04\)'", "background: 'var(--border-glass)'", new_content)
            
            if f in ['AdminModal.jsx', 'CheckoutModal.jsx', 'AuthModal.jsx', 'ProfileModal.jsx']:
                new_content = re.sub(r"color:\s*'#FFF'", "color: 'var(--text-primary)'", new_content)

            if new_content != content:
                with open(path, 'w', encoding='utf-8') as file:
                    file.write(new_content)
                print(f"Updated {f}")
