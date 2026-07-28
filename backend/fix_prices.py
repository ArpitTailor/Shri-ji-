import re
import random

with open('seed_data.py', 'r', encoding='utf-8') as f:
    text = f.read()

def repl(m):
    price_str = m.group(1)
    try:
        price = float(price_str)
        # Only change prices that are suspiciously small (like $13.99, 8.50)
        # Prices in Shri Ji Pure Veg are already integers >= 30, so they might pass through if we check for floats,
        # but 40.0 is float in python.
        # Let's just change anything less than 39.
        if price < 39:
            new_price = random.randint(39, 299)
            return f'", {new_price}, {m.group(2)}, '
        else:
            return m.group(0)
    except:
        return m.group(0)

# The pattern looks for string ending: `", 13.99, True, `
new_text = re.sub(r'",\s*(\d+(?:\.\d+)?),\s*(True|False),\s*', repl, text)

with open('seed_data.py', 'w', encoding='utf-8') as f:
    f.write(new_text)

print("Fixed prices in seed_data.py!")
