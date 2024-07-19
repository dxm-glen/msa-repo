import json
import boto3
import time
import requests

SQS_URL = ""
EC2_INSTANCE_ID = ""
orderEC2API = ""

ec2 = boto3.client('ec2')
sqs = boto3.client('sqs')

def lambda_handler(event, context):
    try:
        # EC2 상태 확인
        response = ec2.describe_instances(InstanceIds=[EC2_INSTANCE_ID])
        instance_status = response['Reservations'][0]['Instances'][0]['State']['Name']
        print(f"EC2 상태 확인: 현재 상태는 '{instance_status}'입니다.")
        ec2_running = instance_status == 'running'
        
        # SQS 메시지 처리
        messages_processed = 0
        if ec2_running:
            response = sqs.receive_message(
                QueueUrl=SQS_URL,
                MaxNumberOfMessages=3,
                WaitTimeSeconds=10
            )
            
            messages = response.get('Messages', [])
            print("Received messages: ", messages)
            
            for message in messages:
                try:
                    body = json.loads(message['Body'])
                    message_data = json.loads(body['Message'])
                    data = message_data 
                    
                    if not data:
                        print("Received empty data list, skipping message.")
                        continue
                    
                    print(f"Received data: {data}")
                    
                    transformed_data = transform_data(data)
                    
                    # EC2로 데이터 전송 시도
                    if Post_EC2(transformed_data):
                        # EC2로 전송 성공 시 메시지 삭제
                        sqs.delete_message(
                            QueueUrl=SQS_URL,
                            ReceiptHandle=message['ReceiptHandle']
                        )
                        messages_processed += 1
                        print(f"SQS 메시지 처리 완료: {message['MessageId']}")
                    else:
                        print(f"EC2로 데이터 전송 실패: {message['MessageId']}")
                        # 메시지 삭제를 하지 않음
                
                except Exception as e:
                    print(f"Error processing message: {str(e)}")
        
        if ec2_running:
            return {
                'statusCode': 200,
                'body': json.dumps(f'EC2 서버 정상 작동. {messages_processed}개의 메시지 처리됨.')
            }
        else:
            return {
                'statusCode': 503,
                'body': json.dumps('EC2 서버가 실행 중이 아닙니다. 메시지가 SQS에 유지됩니다.')
            }
    except Exception as e:
        print(f"Lambda 함수 실행 중 오류 발생: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps(f'오류 발생: {str(e)}')
        }

def Post_EC2(datas):
    try:
        response = requests.post(orderEC2API, json=datas)
        if response.status_code == 200:
            print("EC2로 데이터 전송 성공")
            return True
        else:
            print(f"EC2로 데이터 전송 실패. 상태 코드: {response.status_code}")
            return False
    except Exception as e:
        print(f"EC2로 데이터 전송 중 오류: {str(e)}")
        return False

def transform_data(data):
    utcTime = time.gmtime()
    timeCal = 9 * 3600
    orderTime = time.strftime('%Y-%m-%d %H:%M', time.gmtime(time.mktime(utcTime) + timeCal))
    
    transformed_data = []
    for item in data:
        transformed_item = {
            'orderID': int(item['product_id']),
            'product': item['product_name'],
            'quantity': item['quantity'],
            'stamp': orderTime,
            'status': ''
        }
        transformed_data.append(transformed_item)
    
    print(f"Transformed data: {transformed_data}")
    return transformed_data