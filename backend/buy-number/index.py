import json
import os
import base64
from urllib import request, error
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Search and purchase phone number from Twilio
    Args: event with httpMethod and body containing country_code
    Returns: HTTP response with purchased phone number details
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
    country_code = body_data.get('country_code', 'US').strip().upper()
    
    account_sid = os.environ.get('TWILIO_ACCOUNT_SID')
    auth_token = os.environ.get('TWILIO_AUTH_TOKEN')
    
    if not account_sid or not auth_token:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Twilio credentials not configured'}),
            'isBase64Encoded': False
        }
    
    credentials = base64.b64encode(f'{account_sid}:{auth_token}'.encode()).decode()
    
    phone_number = None
    
    endpoints = ['Local', 'Mobile', 'TollFree']
    
    for endpoint_type in endpoints:
        search_url = f'https://api.twilio.com/2010-04-01/Accounts/{account_sid}/AvailablePhoneNumbers/{country_code}/{endpoint_type}.json?SmsEnabled=true&Limit=1'
        
        req = request.Request(search_url)
        req.add_header('Authorization', f'Basic {credentials}')
        
        try:
            with request.urlopen(req) as response:
                data = json.loads(response.read().decode())
                available_numbers = data.get('available_phone_numbers', [])
                
                if available_numbers:
                    phone_number = available_numbers[0]['phone_number']
                    break
        except error.HTTPError:
            continue
    
    if not phone_number:
        return {
            'statusCode': 404,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': f'No available numbers for {country_code}. Try another country or add number manually.'}),
            'isBase64Encoded': False
        }
    
    try:
            
            buy_url = f'https://api.twilio.com/2010-04-01/Accounts/{account_sid}/IncomingPhoneNumbers.json'
            buy_data = f'PhoneNumber={phone_number}&SmsUrl=https://functions.poehali.dev/edb93555-2925-4dcb-87ef-579c4eaedb3b'
            
            buy_req = request.Request(buy_url, data=buy_data.encode(), method='POST')
            buy_req.add_header('Authorization', f'Basic {credentials}')
            buy_req.add_header('Content-Type', 'application/x-www-form-urlencoded')
            
            with request.urlopen(buy_req) as buy_response:
                buy_result = json.loads(buy_response.read().decode())
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({
                        'phone_number': buy_result['phone_number'],
                        'country_code': country_code,
                        'sid': buy_result['sid']
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