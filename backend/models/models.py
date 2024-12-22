from config.database import db
from datetime import datetime
from sqlalchemy import func
from flask import jsonify

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    @staticmethod
    def get_all_users():
        users = db.session.query(User.id, User.username).all()
        user_list = [{'id': user.id, 'username': user.username} for user in users]
        return jsonify({'users': user_list})

class Transaction(db.Model):
    __tablename__ = 'transactions'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    type = db.Column(db.String(10), nullable=False)  
    date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    comment = db.Column(db.String(255), nullable=True)

    @staticmethod
    def get_user_transactions(user_id):
        transactions = db.session.query(Transaction).filter_by(user_id=user_id).all()
        transaction_list = [{
            'id': txn.id,
            'amount': txn.amount,
            'type': txn.type,
            'date': txn.date.strftime('%Y-%m-%d'), 
            'comment': txn.comment
        } for txn in transactions]
        return jsonify({'transactions': transaction_list})

    @staticmethod
    def get_current_balance(user_id):
        credits = db.session.query(func.sum(Transaction.amount)).filter_by(user_id=user_id, type='credit').scalar() or 0
        debits = db.session.query(func.sum(Transaction.amount)).filter_by(user_id=user_id, type='debit').scalar() or 0
        balance = credits - debits
        return jsonify({'balance': balance})