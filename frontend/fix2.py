import re

with open('src/App.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("`${API_BASE}/api/restaurants'", "`${API_BASE}/api/restaurants`")
content = content.replace("`${API_BASE}/api/categories'", "`${API_BASE}/api/categories`")
content = content.replace("`${API_BASE}/api/ai/recommendations'", "`${API_BASE}/api/ai/recommendations`")
content = content.replace("`${API_BASE}/api/auth/me'", "`${API_BASE}/api/auth/me`")
content = content.replace("`${API_BASE}/api/admin/dashboard'", "`${API_BASE}/api/admin/dashboard`")
content = content.replace("`${API_BASE}/api/auth/login'", "`${API_BASE}/api/auth/login`")
content = content.replace("`${API_BASE}/api/auth/register'", "`${API_BASE}/api/auth/register`")
content = content.replace("`${API_BASE}/api/orders'", "`${API_BASE}/api/orders`")
content = content.replace("`${API_BASE}/api/admin/restaurants'", "`${API_BASE}/api/admin/restaurants`")

with open('src/App.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
