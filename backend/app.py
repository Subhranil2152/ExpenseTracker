from flask import Flask, jsonify, request
from config.database import app, db
from models.models import User, Transaction
from datetime import datetime

@app.route('/', methods=['GET'])
def greetings():
    return "Welcome"

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    new_user = User(username=data['username'], password=data['password'])
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'User registered successfully'})

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data['username'], password=data['password']).first()
    if user:
        return jsonify({'message': 'Login successful', 'user_id': user.id})
    return jsonify({'message': 'Invalid credentials'}), 401

@app.route('/add_transaction', methods=['POST'])
def add_transaction():
    data = request.get_json()
    new_transaction = Transaction(
        user_id=data['user_id'],
        amount=data['amount'],
        type=data['type'],
        date=datetime.strptime(data['date'], '%Y-%m-%d'),
        comment=data.get('comment')
    )
    db.session.add(new_transaction)
    db.session.commit()
    return jsonify({'message': 'Transaction added successfully'})

@app.route('/transactions/<user_id>', methods=['GET'])
def get_transactions(user_id):
    return Transaction.get_user_transactions(user_id)

@app.route('/balance/<user_id>', methods=['GET'])
def get_balance(user_id):
    return Transaction.get_current_balance(user_id)

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)