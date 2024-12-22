var loginApiUrl = 'http://127.0.0.1:5000/login';
var registerApiUrl = 'http://127.0.0.1:5000/register';
var addTransactionApiUrl = 'http://127.0.0.1:5000/add_transaction';
var transactionsApiUrl = 'http://127.0.0.1:5000/transactions';
var balanceApiUrl = 'http://127.0.0.1:5000/balance';

function toggleNav() {
    var navLinks = document.getElementById("navLinks");
    navLinks.classList.toggle("show");
}

function login() {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    fetch(loginApiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: username, password: password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'Login successful') {
            localStorage.setItem('username', username);
            localStorage.setItem('user_id', data.user_id);
            window.location.href = 'dashboard.html';
        } else {
            document.getElementById("loginStatus").innerHTML = data.message;
        }
    });
}

function register() {
    var username = document.getElementById("regUsername").value;
    var password = document.getElementById("regPassword").value;

    fetch(registerApiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: username, password: password })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById("registerStatus").innerHTML = data.message;
    });
}

function addTransaction() {
    var user_id = localStorage.getItem('user_id'); 
    var amount = document.getElementById("amount").value;
    var type = document.getElementById("type").value;
    var date = document.getElementById("date").value;
    var comment = document.getElementById("comment").value;

    fetch(addTransactionApiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user_id: user_id, amount: amount, type: type, date: date, comment: comment })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        loadTransactions();
        loadBalance();
    });
}

function loadTransactions() {
    var user_id = localStorage.getItem('user_id'); 

    fetch(`${transactionsApiUrl}/${user_id}`)
    .then(response => response.json())
    .then(data => {
        var transactionList = document.getElementById("transactionList");
        transactionList.innerHTML = '';
        data.transactions.forEach(transaction => {
            var li = document.createElement("li");
            li.className = transaction.type;
            li.innerHTML = `${transaction.date}: ${transaction.type === 'credit' ? '+' : '-'}${transaction.amount} (${transaction.comment})`;
            transactionList.appendChild(li);
        });
    });
}

function loadBalance() {
    var user_id = localStorage.getItem('user_id'); 

    fetch(`${balanceApiUrl}/${user_id}`)
    .then(response => response.json())
    .then(data => {
        document.getElementById("currentBalance").innerHTML = data.balance;
    });
}

function logout() {
    localStorage.removeItem('username');
    localStorage.removeItem('user_id'); 
    window.location.href = 'login.html';
}

document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.endsWith('dashboard.html')) {
        var username = localStorage.getItem('username');
        if (!username) {
            window.location.href = 'login.html';
        } else {
            document.getElementById("usernameDisplay").innerHTML = username;
            loadTransactions();
            loadBalance();
        }
    }
});