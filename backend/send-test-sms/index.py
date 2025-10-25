import json
import os
import base64
from urllib import request, error
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Send test SMS to a phone number via Twilio
    Args: event with httpMethod POST and body containing phone_number and message
    Returns: HTTP response with send status
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
    to_number = body_data.get('to_number', '').strip()
    message = body_data.get('message', 'Test message from Hey, SMS!')
    
    if not to_number:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Phone number required'}),
            'isBase64Encoded': False
        }
    
    account_sid = os.environ.get('TWILIO_ACCOUNT_SID')
    auth_token = os.environ.get('TWILIO_AUTH_TOKEN')
    from_number = os.environ.get('TWILIO_PHONE_NUMBER', to_number)
    
    if not account_sid or not auth_token:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Twilio credentials not configured'}),
            'isBase64Encoded': False
        }
    
    credentials = base64.b64encode(f'{account_sid}:{auth_token}'.encode()).decode()
    
    send_url = f'https://api.twilio.com/2010-04-01/Accounts/{account_sid}/Messages.json'
    
    params = f'To={to_number}&From={from_number}&Body={message}'
    
    req = request.Request(send_url, data=params.encode(), method='POST')
    req.add_header('Authorization', f'Basic {credentials}')
    req.add_header('Content-Type', 'application/x-www-form-urlencoded')
    
    try:
        with request.urlopen(req) as response:
            result = json.loads(response.read().decode())
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'success': True,
                    'sid': result.get('sid'),
                    'status': result.get('status'),
                    'to': to_number,
                    'from': from_number
                }),
                'isBase64Encoded': False
            }
    
    except error.HTTPError as e:
        error_body = e.read().decode()
        return {
            'statusCode': e.code,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': f'Twilio API error: {error_body}'}),
            'isBase64Encoded': False
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
