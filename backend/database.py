import sqlite3
import os
from dotenv import load_dotenv
load_dotenv()

default_db = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'shri_ji.db')
DB_PATH = os.environ.get("DATABASE_PATH", default_db)
if not os.path.isabs(DB_PATH):
    DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), DB_PATH)

SCHEMA_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'schema.sql')

def get_db():
    timeout = int(os.environ.get("DATABASE_TIMEOUT", 20))
    conn = sqlite3.connect(DB_PATH, timeout=timeout)
    conn.row_factory = sqlite3.Row
    # Apply performance PRAGMAs
    journal_mode = os.environ.get("DATABASE_JOURNAL_MODE", "WAL")
    synchronous = os.environ.get("DATABASE_SYNCHRONOUS", "NORMAL")
    cache_size = os.environ.get("DATABASE_CACHE_SIZE", "10000")
    conn.execute(f'PRAGMA journal_mode = {journal_mode};')
    conn.execute(f'PRAGMA synchronous = {synchronous};')
    conn.execute(f'PRAGMA cache_size = {cache_size};')
    return conn

def init_db():
    conn = get_db()
    cursor = conn.cursor()
    
    with open(SCHEMA_PATH, 'r', encoding='utf-8') as f:
        schema_sql = f.read()
        cursor.executescript(schema_sql)
        
    conn.commit()
    conn.close()
    print("Database initialized successfully.")

def query_db(query, args=(), one=False):
    conn = get_db()
    cur = conn.cursor()
    cur.execute(query, args)
    rv = cur.fetchall()
    conn.commit()
    conn.close()
    
    dict_results = [dict(row) for row in rv]
    return (dict_results[0] if dict_results else None) if one else dict_results

def execute_db(query, args=()):
    conn = get_db()
    cur = conn.cursor()
    cur.execute(query, args)
    last_id = cur.lastrowid
    conn.commit()
    conn.close()
    return last_id
