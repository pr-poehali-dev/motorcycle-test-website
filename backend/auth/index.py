"""API для регистрации, входа и управления профилем пользователей"""
import json
import hashlib
import os
import psycopg2
from psycopg2.extras import RealDictCursor

def get_db_connection():
    """Подключение к базе данных"""
    dsn = os.environ.get('DATABASE_URL')
    return psycopg2.connect(dsn)

def hash_password(password: str) -> str:
    """Хеширование пароля"""
    return hashlib.sha256(password.encode()).hexdigest()

def handler(event: dict, context) -> dict:
    """Обработчик запросов авторизации"""
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id'
            },
            'body': ''
        }
    
    path = event.get('queryStringParameters', {}).get('action', '')
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        if method == 'POST':
            body = json.loads(event.get('body', '{}'))
            
            if path == 'register':
                username = body.get('username')
                email = body.get('email')
                password = body.get('password')
                display_name = body.get('displayName', username)
                
                if not username or not email or not password:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Заполните все поля'})
                    }
                
                password_hash = hash_password(password)
                
                cursor.execute(
                    "INSERT INTO users (username, email, password_hash, display_name) VALUES (%s, %s, %s, %s) RETURNING id, username, email, display_name, created_at",
                    (username, email, password_hash, display_name)
                )
                user = cursor.fetchone()
                conn.commit()
                
                return {
                    'statusCode': 201,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps(dict(user), default=str)
                }
            
            elif path == 'login':
                username = body.get('username')
                password = body.get('password')
                
                if not username or not password:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Заполните все поля'})
                    }
                
                password_hash = hash_password(password)
                
                cursor.execute(
                    "SELECT id, username, email, display_name, created_at FROM users WHERE username = %s AND password_hash = %s",
                    (username, password_hash)
                )
                user = cursor.fetchone()
                
                if not user:
                    return {
                        'statusCode': 401,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Неверное имя пользователя или пароль'})
                    }
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps(dict(user), default=str)
                }
        
        elif method == 'PUT' and path == 'update-profile':
            body = json.loads(event.get('body', '{}'))
            user_id = body.get('userId')
            display_name = body.get('displayName')
            
            if not user_id or not display_name:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Заполните все поля'})
                }
            
            cursor.execute(
                "UPDATE users SET display_name = %s, updated_at = CURRENT_TIMESTAMP WHERE id = %s RETURNING id, username, email, display_name, created_at",
                (display_name, user_id)
            )
            user = cursor.fetchone()
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(dict(user), default=str)
            }
        
        elif method == 'GET' and path == 'users':
            search = event.get('queryStringParameters', {}).get('search', '')
            user_id = event.get('queryStringParameters', {}).get('userId')
            
            if search:
                cursor.execute(
                    "SELECT id, username, display_name FROM users WHERE username ILIKE %s OR display_name ILIKE %s LIMIT 20",
                    (f'%{search}%', f'%{search}%')
                )
            else:
                cursor.execute("SELECT id, username, display_name FROM users LIMIT 20")
            
            users = cursor.fetchall()
            
            if user_id:
                users = [u for u in users if str(u['id']) != user_id]
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps([dict(u) for u in users], default=str)
            }
        
        cursor.close()
        conn.close()
        
        return {
            'statusCode': 404,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Неизвестный путь'})
        }
    
    except psycopg2.IntegrityError as e:
        if conn:
            conn.rollback()
        return {
            'statusCode': 409,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Пользователь с таким именем или email уже существует'})
        }
    except Exception as e:
        if conn:
            conn.rollback()
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }
