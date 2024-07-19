import json
from flask import Flask, request, jsonify
from flask_cors import CORS
import boto3

app = Flask(__name__)
CORS(app)

# AWS 설정
sns_client = boto3.client('sns', region_name='us-east-1')
ANtopic_arn = "arn:aws:sns:us-east-1:730335373015:ook-MSA_OrderProcess_SNS"
HAtopic_arn = "arn:aws:sns:us-east-1:730335373015:test_topic"

# Temporary lists to store data
cart_items = []
orders = []

@app.route('/', methods=['GET', 'POST'])
def checkout():
    global cart_items
    if request.method == 'GET':
        if cart_items:
            print("Retrieved data: ", cart_items)
            return jsonify({'data': cart_items}), 200
        else:
            print("GET execution failed")
            return jsonify({'message': 'GET request received!', 'data': 'No available data'}), 200

    if request.method == 'POST':
        if request.is_json:
            data = request.get_json()
            user_id = data.get('userId')
            new_cart_items = data.get('items')
            
            # Process failed orders
            for item in new_cart_items:
                cart_items.append(item)
            
            print('Failed order data:', cart_items)
            
            # SNS Message (AN Topic)
            message_str = json.dumps(cart_items)
            try:
                responseAN = sns_client.publish(
                    TopicArn=ANtopic_arn,
                    Message=message_str
                )
                
                print(f"SNS Message sent successfully (AN Topic): {responseAN}")
            except Exception as e:
                print(f"SNS Message failed to send (AN Topic): {str(e)}")

            return jsonify({'message': 'Failed order data successfully received!', 'cartItems': cart_items}), 200
        else:
            return jsonify({'error': 'Unsupported media type', 'message': 'Request Content-Type should be application/json'}), 415

    return jsonify({'error': 'Method not allowed', 'message': 'Supported methods: GET, POST'}), 405

@app.route('/order', methods=["GET", "POST"])
def get_orders():
    if request.method == 'GET':
        return jsonify({'orders': orders}), 200
        
    elif request.method == 'POST':
        data = request.get_json()
        orders.append(data)
        
        print("Successful order data = ", orders)

        # SNS Message to HA Topic
        message_str = json.dumps(data)
        try:
            responseHA = sns_client.publish(
                TopicArn=HAtopic_arn,
                Message=message_str
            )
            
            print(f"SNS Message sent successfully (HA Topic): {responseHA}")
            
        except Exception as e:
            print(f"SNS Message failed to send (HA Topic): {str(e)}")
        
        return jsonify({'message': 'Successful order data received!', 'data': data}), 200
        
    else:
        return jsonify({'error': 'Method not allowed', 'message': 'Supported methods: GET, POST'}), 405

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=3000)