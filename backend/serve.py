import os
from dotenv import load_dotenv
load_dotenv()

from waitress import serve
from app import app

if __name__ == '__main__':
    host = os.environ.get("HOST", "0.0.0.0")
    port = int(os.environ.get("PORT", 5050))
    print(f"Starting Shri Ji Production Server on http://{host}:{port}")
    print("Optimizations Active: WAL Mode, LRU Caching, GZIP Compression, Advanced AI Engine")
    serve(app, host=host, port=port, threads=8)
