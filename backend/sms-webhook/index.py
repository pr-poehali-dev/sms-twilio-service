import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from typing import Dict, Any
from urllib.parse import parse_qs

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Receive SMS webhook from Twilio and store message in database
    Args: event with httpMethod POST and form data from Twilio
    Returns: HTTP response with TwiML
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
            'headers': {'Content-Type': 'text/xml', 'Access-Control-Allow-Origin': '*'},
            'body': '<?xml version="1.0" encoding="UTF-8"?><Response></Response>',
            'isBase64Encoded': False
        }
    
    body_str = event.get('body') or ''
    params = parse_qs(body_str)
    
    to_number = params.get('To', [''])[0]
    from_number = params.get('From', [''])[0]
    message_body = params.get('Body', [''])[0]
    
    if not to_number or not message_body:
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'text/xml', 'Access-Control-Allow-Origin': '*'},
            'body': '<?xml version="1.0" encoding="UTF-8"?><Response></Response>',
            'isBase64Encoded': False
        }
    
    db_url = os.environ.get('DATABASE_URL')
    
    try:
        conn = psycopg2.connect(db_url)
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        cur.execute("SELECT id FROM promocodes WHERE phone_number = '" + to_number + "' AND is_used = TRUE ORDER BY used_at DESC LIMIT 1")
        promo = cur.fetchone()
        
        if promo:
            cur.execute(
                "INSERT INTO sms_messages (promocode_id, phone_number, from_number, message_body) VALUES (" 
                + str(promo['id']) + ", '" + to_number + "', '" + from_number + "', '" + message_body.replace("'", "''") + "')"
            )
            conn.commit()
        
        cur.close()
        conn.close()
    except Exception as e:
        pass
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'text/xml', 'Access-Control-Allow-Origin': '*'},
        'body': '<?xml version="1.0" encoding="UTF-8"?><Response></Response>',
        'isBase64Encoded': False
    }
