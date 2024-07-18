import os
from flask import Flask, request, jsonify, render_template, redirect, url_for, session, send_from_directory
import boto3
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.secret_key = 'supersecretkey'

# AWS DynamoDB 설정 (리전을 us-east-1로 변경)
dynamodb = boto3.resource('dynamodb', region_name='us-east-1')
users_table = dynamodb.Table('users')
purchases_table = dynamodb.Table('purchases')
cart_table = dynamodb.Table('cart')

@app.route('/')
def index():
    return send_from_directory('shopping/build', 'index.html')

@app.route('/<path:path>', methods=['GET'])
def static_proxy(path):
    return send_from_directory('shopping/build', path)

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        username = request.form['username']
        email = request.form['email']
        password = generate_password_hash(request.form['password'])

        users_table.put_item(
            Item={
                'username': username,
                'user_email': email,
                'user_PW': password
            }
        )
        return redirect(url_for('login'))
    return render_template('signup.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        response = users_table.get_item(Key={'username': username})
        user = response.get('Item')

        if user and check_password_hash(user['user_PW'], password):
            session['username'] = username
            return redirect(url_for('purchases'))
        else:
            return "로그인 실패. 다시 시도하세요."
    return render_template('login.html')

@app.route('/logout')
def logout():
    session.pop('username', None)
    return redirect(url_for('index'))

@app.route('/add_purchase', methods=['POST'])
def add_purchase():
    if 'username' not in session:
        return redirect(url_for('login'))

    product_id = request.form['product_id']
    product_name = request.form['product_name']
    price = int(request.form['price'])
    quantity = int(request.form['quantity'])

    purchases_table.put_item(
        Item={
            'product_id': product_id,
            'product_name': product_name,
            'price': price,
            'quantity': quantity
        }
    )
    return redirect(url_for('purchases'))

@app.route('/get_purchases', methods=['GET'])
def get_purchases():
    response = purchases_table.scan()
    return jsonify(response['Items'])

@app.route('/purchases')
def purchases():
    if 'username' not in session:
        return redirect(url_for('login'))

    response = purchases_table.scan()
    items = response['Items']
    return render_template('purchases.html', items=items)

@app.route('/add_to_cart', methods=['POST'])
def add_to_cart():
    data = request.get_json()
    user_id = data['user_id']
    product_id = data['product_id']
    product_name = data['product_name']
    price = data['price']
    amount = data['amount']

    cart_table.put_item(
        Item={
            'user_id': user_id,
            'product_id': product_id,
            'product_name': product_name,
            'price': price,
            'amount': amount
        }
    )
    return jsonify({'message': 'Item added to cart'})

@app.route('/get_cart/<user_id>', methods=['GET'])
def get_cart(user_id):
    response = cart_table.query(
        KeyConditionExpression=boto3.dynamodb.conditions.Key('user_id').eq(user_id)
    )
    return jsonify(response['Items'])

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True)
