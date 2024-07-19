import json
import boto3
import urllib3

sqs = boto3.client('sqs')
http = urllib3.PoolManager()

SQS_URL = ""
slack_webhook_url = ''

def lambda_handler(event, context):
    try:
        # SQS에서 메시지 받아오기
        response = sqs.receive_message(
            QueueUrl=SQS_URL,
            MaxNumberOfMessages=1,
            WaitTimeSeconds=10
        )

        # 메시지가 있는지 확인
        if 'Messages' in response:
            message = response['Messages'][0]
            receipt_handle = message['ReceiptHandle']
            
            # 메시지 본문 파싱
            body = json.loads(message['Body'])
            sns_message = json.loads(body['Message'])
            
            # product_name 추출 및 중복 제거
            product_names = {item['product_name'] for item in sns_message if 'product_name' in item}
            
            if product_names:
                print("추출된 제품 이름:", ", ".join(product_names))
                
                # Slack 메시지 구성
                slack_message = {
                    "text": f"{', '.join(product_names)}의 재고가 부족하여 주문에 실패했습니다."
                }
                
                # Slack 웹훅으로 메시지 전송
                response = http.request(
                    'POST',
                    slack_webhook_url,
                    body=json.dumps(slack_message),
                    headers={'Content-Type': 'application/json'}
                )

                print({
                    "message": slack_message,
                    "status_code": response.status,
                    "response": response.data.decode('utf-8')
                })
            else:
                print("제품 이름을 찾을 수 없습니다.")
            
            # 처리된 메시지 삭제
            sqs.delete_message(
                QueueUrl=SQS_URL,
                ReceiptHandle=receipt_handle
            )
            
            return {
                'statusCode': 200,
                'body': json.dumps('Message sent to Slack and processed successfully')
            }
        
        else:
            print("처리할 메시지가 없습니다.")
            return {
                'statusCode': 200,
                'body': json.dumps('처리할 메시지가 없습니다.')
            }
    
    except Exception as e:
        print(f"에러 발생: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps(str(e))
        }