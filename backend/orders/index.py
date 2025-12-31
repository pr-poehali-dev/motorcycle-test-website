"""API для управления заказами билетов и товаров"""
import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime, timedelta

def get_db_connection():
    """Подключение к базе данных"""
    dsn = os.environ.get('DATABASE_URL')
    return psycopg2.connect(dsn)

def handler(event: dict, context) -> dict:
    """Обработчик запросов заказов"""
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id'
            },
            'body': ''
        }
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        if method == 'POST':
            body = json.loads(event.get('body', '{}'))
            user_id = body.get('userId')
            movie_id = body.get('movieId')
            movie_title = body.get('movieTitle')
            seats = body.get('seats', [])
            products = body.get('products', [])
            ticket_price = body.get('ticketPrice', 500)
            
            if not user_id or not movie_id or not seats:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Заполните все поля'})
                }
            
            ticket_total = len(seats) * ticket_price
            session_date = datetime.now() + timedelta(days=30)
            
            cursor.execute(
                "INSERT INTO ticket_orders (user_id, movie_id, movie_title, seats, total_price, session_date) VALUES (%s, %s, %s, %s, %s, %s) RETURNING id",
                (user_id, movie_id, movie_title, json.dumps(seats), ticket_total, session_date)
            )
            order_id = cursor.fetchone()['id']
            
            product_total = 0
            if products:
                product_total = sum(p.get('price', 0) for p in products)
                cursor.execute(
                    "INSERT INTO product_orders (user_id, ticket_order_id, products, total_price) VALUES (%s, %s, %s, %s)",
                    (user_id, order_id, json.dumps(products), product_total)
                )
            
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'orderId': order_id,
                    'ticketTotal': ticket_total,
                    'productTotal': product_total,
                    'total': ticket_total + product_total,
                    'sessionDate': session_date.isoformat()
                })
            }
        
        elif method == 'GET':
            user_id = event.get('queryStringParameters', {}).get('userId')
            
            if not user_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'userId обязателен'})
                }
            
            cursor.execute(
                "SELECT t.*, p.products as purchased_products FROM ticket_orders t LEFT JOIN product_orders p ON t.id = p.ticket_order_id WHERE t.user_id = %s ORDER BY t.created_at DESC",
                (user_id,)
            )
            orders = cursor.fetchall()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps([dict(o) for o in orders], default=str)
            }
        
        cursor.close()
        conn.close()
        
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Метод не поддерживается'})
        }
    
    except Exception as e:
        if conn:
            conn.rollback()
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }
