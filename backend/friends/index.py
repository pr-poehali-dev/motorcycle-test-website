"""API для управления друзьями и сообщениями"""
import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor

def get_db_connection():
    """Подключение к базе данных"""
    dsn = os.environ.get('DATABASE_URL')
    return psycopg2.connect(dsn)

def handler(event: dict, context) -> dict:
    """Обработчик запросов друзей и сообщений"""
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
        
        if method == 'POST' and path == 'add-friend':
            body = json.loads(event.get('body', '{}'))
            user_id = body.get('userId')
            friend_id = body.get('friendId')
            
            if not user_id or not friend_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Заполните все поля'})
                }
            
            cursor.execute(
                "INSERT INTO friendships (user_id, friend_id, status) VALUES (%s, %s, 'accepted') RETURNING id",
                (user_id, friend_id)
            )
            friendship_id = cursor.fetchone()['id']
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'friendshipId': friendship_id})
            }
        
        elif method == 'GET' and path == 'friends':
            user_id = event.get('queryStringParameters', {}).get('userId')
            
            if not user_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'userId обязателен'})
                }
            
            cursor.execute("""
                SELECT u.id, u.username, u.display_name, f.created_at as friend_since
                FROM friendships f
                JOIN users u ON f.friend_id = u.id
                WHERE f.user_id = %s AND f.status = 'accepted'
                ORDER BY f.created_at DESC
            """, (user_id,))
            friends = cursor.fetchall()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps([dict(f) for f in friends], default=str)
            }
        
        elif method == 'POST' and path == 'send-message':
            body = json.loads(event.get('body', '{}'))
            sender_id = body.get('senderId')
            receiver_id = body.get('receiverId')
            message_text = body.get('message')
            
            if not sender_id or not receiver_id or not message_text:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Заполните все поля'})
                }
            
            cursor.execute(
                "INSERT INTO messages (sender_id, receiver_id, message_text) VALUES (%s, %s, %s) RETURNING id, created_at",
                (sender_id, receiver_id, message_text)
            )
            result = cursor.fetchone()
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(dict(result), default=str)
            }
        
        elif method == 'GET' and path == 'messages':
            user_id = event.get('queryStringParameters', {}).get('userId')
            friend_id = event.get('queryStringParameters', {}).get('friendId')
            
            if not user_id or not friend_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'userId и friendId обязательны'})
                }
            
            cursor.execute("""
                SELECT m.*, u.username as sender_username, u.display_name as sender_name
                FROM messages m
                JOIN users u ON m.sender_id = u.id
                WHERE (m.sender_id = %s AND m.receiver_id = %s) OR (m.sender_id = %s AND m.receiver_id = %s)
                ORDER BY m.created_at ASC
            """, (user_id, friend_id, friend_id, user_id))
            messages = cursor.fetchall()
            
            cursor.execute(
                "UPDATE messages SET is_read = TRUE WHERE receiver_id = %s AND sender_id = %s",
                (user_id, friend_id)
            )
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps([dict(m) for m in messages], default=str)
            }
        
        cursor.close()
        conn.close()
        
        return {
            'statusCode': 404,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Неизвестный путь'})
        }
    
    except Exception as e:
        if conn:
            conn.rollback()
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }
