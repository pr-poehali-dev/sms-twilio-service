import json
import os
import random
import string
import psycopg2
from psycopg2.extras import RealDictCursor
from typing import Dict, Any
from datetime import datetime, timedelta

def generate_code(length: int = 8) -> str:
    chars = string.ascii_uppercase + string.digits
    return ''.join(random.choice(chars) for _ in range(length))

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Generate new promocode for virtual phone number
    Args: event with httpMethod and body containing phone_number, country_code, expiry_days
    Returns: HTTP response with generated promocode
    '''
    method: str = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    body_str = event.get('body') or '{}'
    body_data = json.loads(body_str) if body_str else {}
    phone_number = body_data.get('phone_number', '').strip()
    country_code = body_data.get('country_code', 'US').strip().upper()
    expiry_days = int(body_data.get('expiry_days', 7))
    
    if not phone_number:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Номер телефона не указан'}),
            'isBase64Encoded': False
        }
    
    db_url = os.environ.get('DATABASE_URL')
    
    conn = psycopg2.connect(db_url)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    code = generate_code()
    expires_at = (datetime.now() + timedelta(days=expiry_days)).isoformat()
    
    cur.execute(
        "INSERT INTO promocodes (code, phone_number, country_code, expires_at) VALUES ('" 
        + code + "', '" + phone_number + "', '" + country_code + "', '" + expires_at + "') RETURNING code"
    )
    result = cur.fetchone()
    conn.commit()
    
    cur.close()
    conn.close()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'code': result['code']}),
        'isBase64Encoded': False
    }
