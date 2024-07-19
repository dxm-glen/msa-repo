import os
import time
from threading import Thread
from flask import Flask, request, jsonify
import boto3
from flask_cors import CORS
import logging
import threading
import requests
import json

# Load environment variables from .env file
from dotenv import load_dotenv
load_dotenv()

# CORS 설정
app = Flask(__name__)
CORS(app)

# AWS SNS 설정
sns_client = boto3.client('sns', region_name='us-east-1')
SNS_TOPIC_ARN = os.getenv('SNS_TOPIC_ARN')
TOPIC_SHIP_ARN = os.getenv('TOPIC_SHIP_ARN')

# 로깅 설정
logging.basicConfig(filename='app.log', level=logging.ERROR,
                    format='%(asctime)s %(levelname)s %(name)s %(message)s')
logger = logging.getLogger(__name__)

# AWS DynamoDB 설정 (리전을 us-east-1로 설정)
dynamodb = boto3.resource('dynamodb', region_name='us-east-1')
orders_table = dynamodb.Table(os.getenv('ORDERS_TABLE'))
production_table = dynamodb.Table(os.getenv('PRODUCTION_TABLE'))
shipments_table = dynamodb.Table(os.getenv('SHIPMENTS_TABLE'))

# 판매회사에서 주문DB에 데이터를 넣는 API
@app.route('/create_order', methods=['POST'])
def create_order():
    try:
        data = request.get_json()
        logger.error(f"Request data: {data}")

        if not isinstance(data, list):
            return jsonify({"error": "Expected a list of orders"}), 400

        for order in data:
            order_id = order.get('orderID')
            description = order.get('description', '')
            product = order.get('product', '')
            quantity = order.get('quantity', 0)
            stamp = order.get('stamp', '')
            status = 'Pending'  # 초기 상태는 "Pending"으로 설정

            if not order_id:
                return jsonify({"error": "Order ID is required for all orders"}), 400

            # 주문 데이터를 추가합니다
            orders_table.put_item(Item={
                'orderID': int(order_id),
                'description': description,
                'product': product,
                'quantity': int(quantity),
                'stamp': stamp,
                'status': status
            })

        return jsonify({"message": "Orders created successfully"}), 200
    except Exception as e:
        logger.error(f"Error in create_order: {str(e)}")
        return jsonify({"error": f"An error occurred while creating the orders: {str(e)}"}), 500

# 버튼을 누르면 Pending -> In Production로 변환, 생산 시작 SNS로 메시지 전달. -> 10초 후 In Production -> Completed로 변환, 생산 완료 SNS로 메시지 전달.
@app.route('/update_order_status_to_in_production', methods=['POST'])
def update_order_status_to_in_production():
    try:
        data = request.get_json()
        logger.error(f"Request data: {data}")

        order_id = data.get('orderID')

        if not order_id:
            return jsonify({"error": "Order ID is required"}), 400

        response = orders_table.get_item(Key={'orderID': int(order_id)})
        order = response.get('Item')

        if not order:
            return jsonify({"error": "Order not found"}), 404

        # 주문 상태를 "In Production"으로 변경
        orders_table.update_item(
            Key={'orderID': int(order_id)},
            UpdateExpression="set #st = :s",
            ExpressionAttributeNames={'#st': 'status'},
            ExpressionAttributeValues={':s': 'In Production'}
        )

        # SNS 메시지 게시
        try:
            dynamo_data = response['Item']
            app.logger.error(f"DynamoDB data: {dynamo_data}")

            # 필요한 데이터 추출 및 메시지 포맷
            order_id = dynamo_data.get('orderID', 'N/A')
            product = dynamo_data.get('product', 'N/A')
            quantity = dynamo_data.get('quantity', 'N/A')

            # 메시지 출력 내용
            message = f"물품아이디: {order_id}, 물품: {product}, 수량: {quantity}, 생산시작."
            app.logger.error(f"Message to publish: {message}")

            if not message:
                return jsonify({"error": "Message is required"}), 400

            # SNS 주제에 메시지를 게시합니다
            sns_response = sns_client.publish(
                TopicArn=SNS_TOPIC_ARN,
                Message=message
            )

            app.logger.error(f"SNS Publish Response: {sns_response}")

        except Exception as sns_error:
            app.logger.error(f"Error in publish_to_sns: {str(sns_error)}")
            return jsonify({"error": f"An error occurred while publishing the message to SNS: {str(sns_error)}"}), 500

        # 주문 상태를 "Completed"로 변경하는 스레드 시작
        thread = threading.Thread(target=update_status_to_completed, args=(order_id,))
        thread.start()

        return jsonify({"message": "Order status updated to In Production and message published to SNS successfully"}), 200

    except Exception as e:
        logger.error(f"Error in update_order_status_to_in_production: {str(e)}")
        return jsonify({"error": f"An error occurred while updating the order status: {str(e)}"}), 500

# 주문DB에서 상태가 In production 상태에서 10초뒤 completed로 변경
def update_status_to_completed(order_id):
    time.sleep(10)
    try:
        orders_table.update_item(
            Key={'orderID': int(order_id)},
            UpdateExpression="set #st = :s",
            ExpressionAttributeNames={'#st': 'status'},
            ExpressionAttributeValues={':s': 'Completed'}
        )
        logger.error(f"Status for orderId {order_id} updated to Completed")

        # 상태 업데이트 후 SNS 메시지 게시
        try:
            # DynamoDB에서 다시 데이터 가져오기
            response = orders_table.get_item(Key={'orderID': int(order_id)})
            dynamo_data = response['Item']
            app.logger.error(f"DynamoDB data: {dynamo_data}")

            # 필요한 데이터 추출 및 메시지 포맷
            order_id = dynamo_data.get('orderID', 'N/A')
            product = dynamo_data.get('product', 'N/A')
            quantity = dynamo_data.get('quantity', 'N/A')

            # 메시지 출력 내용
            message = f"물품아이디: {order_id}, 물품: {product}, 수량: {quantity}, 생산완료."
            app.logger.error(f"Message to publish: {message}")

            # SNS 주제에 메시지를 게시합니다
            sns_response = sns_client.publish(
                TopicArn=SNS_TOPIC_ARN,
                Message=message
            )

            app.logger.error(f"SNS Publish Response: {sns_response}")

        except Exception as sns_error:
            app.logger.error(f"Error in publish_to_sns after status update: {str(sns_error)}")

    except Exception as e:
        logger.error(f"Error updating status to Completed for orderId {order_id}: {str(e)}")

# 버튼을 누르면 주문DB -> In Production 상태를 Shipped로 바꾼후 sns 출고완료 메시지 출력
@app.route('/update_order_status_to_shipped', methods=['POST'])
def update_order_status_to_shipped():
    try:
        data = request.get_json()
        logger.error(f"Request data: {data}")

        order_id = data.get('orderID')

        if not order_id:
            return jsonify({"error": "order ID is required"}), 400

        response = orders_table.get_item(Key={'orderID': int(order_id)})
        order = response.get('Item')

        if not order:
            return jsonify({"error": "order not found"}), 404

        # 주문 상태를 "shipped"으로 변경
        orders_table.update_item(
            Key={'orderID': int(order_id)},
            UpdateExpression="set #st = :s",
            ExpressionAttributeNames={'#st': 'status'},
            ExpressionAttributeValues={':s': 'Shipped'}
        )

        # SNS 메시지 게시
        try:
            dynamo_data = response['Item']
            app.logger.error(f"DynamoDB data: {dynamo_data}")

            # 필요한 데이터 추출 및 메시지 포맷
            order_id = dynamo_data.get('orderID', 'N/A')
            product = dynamo_data.get('product', 'N/A')
            quantity = dynamo_data.get('quantity', 'N/A')

            # 메시지 출력 내용
            message = f"물품아이디: {order_id}, 물품: {product}, 수량: {quantity}, 출고완료."
            app.logger.error(f"Message to publish: {message}")

            if not message:
                return jsonify({"error": "Message is required"}), 400

            # SNS 주제에 메시지를 게시합니다
            sns_response = sns_client.publish(
                TopicArn=SNS_TOPIC_ARN,
                Message=message
            )

            app.logger.error(f"SNS Publish Response: {sns_response}")

        except Exception as sns_error:
            app.logger.error(f"Error in publish_to_sns: {str(sns_error)}")
            return jsonify({"error": f"An error occurred while publishing the message to SNS: {str(sns_error)}"}), 500

        return jsonify({"message": "Order status updated to Shipped and message published to SNS successfully"}), 200

    except Exception as e:
        logger.error(f"Error in update_orders_status_to_shipped: {str(e)}")
        return jsonify({"error": f"An error occurred while updating the order status: {str(e)}"}), 500



@app.route('/send_order_details_to_sns', methods=['POST'])
def send_order_details_to_sns():
    try:
        logger.info("send_order_details_to_sns called with request data")

        # 요청 본문 추출 및 JSON 디코딩
        if not request.data:
            logger.error("Request data is missing")
            return jsonify({"error": "Request data is missing"}), 400

        try:
            data = request.get_json()
        except json.JSONDecodeError:
            logger.error("Failed to decode JSON object")
            return jsonify({"error": "Invalid JSON format"}), 400

        # 주문 ID 추출
        order_id = data.get('orderID')
        if not order_id:
            logger.error("Order ID is required")
            return jsonify({"error": "Order ID is required"}), 400

        # 주문 ID 데이터 타입 확인 및 변환
        try:
            order_id = int(order_id)
        except ValueError:
            logger.error("Invalid Order ID format")
            return jsonify({"error": "Invalid Order ID format"}), 400

        # 데이터베이스에서 주문 항목 조회
        response = orders_table.get_item(Key={'orderID': order_id})
        logger.info(f"Database response: {response}")
        order = response.get('Item')
        if not order:
            logger.error(f"Order not found for Order ID: {order_id}")
            return jsonify({"error": "Order not found"}), 404

        # 주문 세부 사항 구성
        order_details = {
            "orderID": int(order['orderID']),  # Ensure orderID is an int
            "product": order['product'],
            "quantity": int(order['quantity'])  # Ensure quantity is an int
        }

        # JSON 형태로 메시지 작성
        message = {
            "default": json.dumps(order_details),
            "email": json.dumps(order_details),
            "sms": json.dumps(order_details),
        }

        # SNS에 JSON 메시지 게시
        sns_response = sns_client.publish(
            TopicArn=TOPIC_SHIP_ARN,
            Message=json.dumps(message),
            MessageStructure='json'
        )
        logger.info(f"SNS publish response: {sns_response}")
        return jsonify({"message": "Order details sent to SNS"}), 200

    except Exception as e:
        logger.error(f"Error in send_order_details_to_sns: {str(e)}")
        return jsonify({"error": str(e)}), 500



# 주문 db 조회
@app.route('/get_orders', methods=['GET'])
def get_orders():
    try:
        response = orders_table.scan()
        return jsonify(response['Items'])
    except Exception as e:
        logger.error(f"Error in get_orders: {str(e)}")
        return jsonify({"error": "An error occurred while fetching orders"}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000, debug=True)
