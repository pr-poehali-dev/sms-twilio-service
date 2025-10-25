import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Receive SMS from Android device with Fanytel app
    Args: event with httpMethod POST and body containing phone_number, from_number, message
    Returns: HTTP response confirming receipt
    '''
    method: str = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Api-Key',
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
    from_number = body_data.get('from_number', '').strip()
    message_body = body_data.get('message', '').strip()
    
    if not phone_number or not message_body:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'phone_number and message are required'}),
            'isBase64Encoded': False
        }
    
    db_url = os.environ.get('DATABASE_URL')
    
    conn = psycopg2.connect(db_url)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    cur.execute("SELECT id FROM promocodes WHERE phone_number = '" + phone_number + "' AND is_used = TRUE ORDER BY used_at DESC LIMIT 1")
    promo = cur.fetchone()
    
    if promo:
        cur.execute(
            "INSERT INTO sms_messages (promocode_id, phone_number, from_number, message_body) VALUES (" 
            + str(promo['id']) + ", '" + phone_number + "', '" + (from_number or 'unknown') + "', '" + message_body.replace("'", "''") + "')"
        )
        conn.commit()
        
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'success': True, 'message': 'SMS saved'}),
            'isBase64Encoded': False
        }
    
    cur.close()
    conn.close()
    
    return {
        'statusCode': 404,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Phone number not found or promocode not activated'}),
        'isBase64Encoded': False
    }
