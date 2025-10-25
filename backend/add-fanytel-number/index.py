import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Manually add Fanytel phone number to database
    Args: event with httpMethod POST and body containing phone_number, country_code, notes
    Returns: HTTP response with confirmation
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
    country_code = body_data.get('country_code', 'GB').strip().upper()
    notes = body_data.get('notes', '').strip()
    
    if not phone_number:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Phone number is required'}),
            'isBase64Encoded': False
        }
    
    db_url = os.environ.get('DATABASE_URL')
    
    conn = psycopg2.connect(db_url)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    cur.execute("SELECT id FROM fanytel_numbers WHERE phone_number = '" + phone_number + "'")
    existing = cur.fetchone()
    
    if existing:
        cur.close()
        conn.close()
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Phone number already exists'}),
            'isBase64Encoded': False
        }
    
    notes_sql = "'" + notes.replace("'", "''") + "'" if notes else 'NULL'
    
    cur.execute(
        "INSERT INTO fanytel_numbers (phone_number, country_code, notes) VALUES ('" 
        + phone_number + "', '" + country_code + "', " + notes_sql + ") RETURNING id, phone_number, country_code"
    )
    result = cur.fetchone()
    conn.commit()
    
    cur.close()
    conn.close()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({
            'success': True,
            'id': result['id'],
            'phone_number': result['phone_number'],
            'country_code': result['country_code']
        }),
        'isBase64Encoded': False
    }
