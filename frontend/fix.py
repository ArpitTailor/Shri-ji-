import sys

with open('src/App.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace all relative fetch calls with the API_BASE prefix
content = content.replace("fetch('/api/", "fetch(`${API_BASE}/api/")
content = content.replace("fetch(`/api/", "fetch(`${API_BASE}/api/")

# Inject the API_BASE definition
target = "import LocationModal from './components/LocationModal';\n\nexport default function App() {"
replacement = "import LocationModal from './components/LocationModal';\n\nconst API_BASE = import.meta.env.VITE_API_BASE_URL || '';\n\nexport default function App() {"

content = content.replace(target, replacement)

with open('src/App.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
