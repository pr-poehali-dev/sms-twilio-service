import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Get virtual number details and SMS messages by promocode
    Args: event with httpMethod and query parameter 'code'
    Returns: HTTP response with number details and messages
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    params = event.get('queryStringParameters', {}) or {}
    code = params.get('code', '').strip().upper()
    
    if not code:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Промокод не указан'}),
            'isBase64Encoded': False
        }
    
    db_url = os.environ.get('DATABASE_URL')
    
    conn = psycopg2.connect(db_url)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    cur.execute("SELECT * FROM promocodes WHERE code = '" + code + "' AND is_used = TRUE")
    promo = cur.fetchone()
    
    if not promo:
        cur.close()
        conn.close()
        return {
            'statusCode': 404,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Промокод не найден или не активирован'}),
            'isBase64Encoded': False
        }
    
    cur.execute("SELECT * FROM sms_messages WHERE promocode_id = " + str(promo['id']) + " ORDER BY received_at DESC")
    messages = cur.fetchall()
    
    result = {
        'phone_number': promo['phone_number'],
        'country_code': promo['country_code'],
        'expires_at': promo['expires_at'].isoformat() if promo['expires_at'] else None,
        'messages': [
            {
                'id': msg['id'],
                'from_number': msg['from_number'],
                'message_body': msg['message_body'],
                'received_at': msg['received_at'].isoformat() if msg['received_at'] else None
            }
            for msg in messages
        ]
    }
    
    cur.close()
    conn.close()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps(result),
        'isBase64Encoded': False
    }
