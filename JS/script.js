var transactions = [];

var form = document.getElementById("transactionForm");
var description = document.getElementById("description");
var amount = document.getElementById("amount");
var type = document.getElementById("type");
var category = document.getElementById("category");
var date = document.getElementById("date");

var transactionList = document.getElementById("transactionList");
var emptyMessage = document.getElementById("emptyMessage");
var filter = document.getElementById("filter");

var totalIncome = document.getElementById("totalIncome");
var totalExpense = document.getElementById("totalExpense");
var balance = document.getElementById("balance");


// Set today's date
var today = new Date();

var year = today.getFullYear();
var month = today.getMonth() + 1;
var day = today.getDate();

if (month < 10) {
    month = "0" + month;
}

if (day < 10) {
    day = "0" + day;
}

date.value = year + "-" + month + "-" + day;


// Load saved data
var savedData = localStorage.getItem("transactions");

if (savedData) {
    transactions = JSON.parse(savedData);
}


// Save data
function saveData() {
    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );
}


// Format currency
function money(value) {
    return "Rs. " + Number(value).toFixed(2);
}


// Update summary
function updateSummary() {

    var income = 10000;
    var expense = 4738;

    for (var i = 0; i < transactions.length; i++) {

        if (transactions[i].type === "income") {
            income += Number(transactions[i].amount);
        } else {
            expense += Number(transactions[i].amount);
        }
    }

    totalIncome.textContent = money(income);
    totalExpense.textContent = money(expense);
    balance.textContent = money(income - expense);
}


// Display transactions
function displayTransactions() {

    transactionList.innerHTML = "";

    var selectedFilter = filter.value;
    var count = 0;

    for (var i = 0; i < transactions.length; i++) {

        var item = transactions[i];

        if (
            selectedFilter !== "all" &&
            item.type !== selectedFilter
        ) {
            continue;
        }

        count++;

        var row = document.createElement("div");
        row.className = "transaction";


        var information = document.createElement("div");
        information.className = "transaction-info";


        var name = document.createElement("h3");
        name.textContent = item.description;


        var details = document.createElement("small");
        details.textContent =
            item.category + " - " + item.date;


        information.appendChild(name);
        information.appendChild(details);


        var rightSide = document.createElement("div");
        rightSide.className = "transaction-right";


        var price = document.createElement("span");


        if (item.type === "income") {

            price.className = "amount-income";
            price.textContent =
                "+" + money(item.amount);

        } else {

            price.className = "amount-expense";
            price.textContent =
                "-" + money(item.amount);
        }


        var deleteButton =
            document.createElement("button");

        deleteButton.className = "delete-btn";
        deleteButton.textContent = "Delete";


        deleteButton.onclick = function() {

            var id = this.getAttribute("data-id");

            deleteTransaction(id);
        };


        deleteButton.setAttribute(
            "data-id",
            item.id
        );


        rightSide.appendChild(price);
        rightSide.appendChild(deleteButton);


        row.appendChild(information);
        row.appendChild(rightSide);


        transactionList.appendChild(row);
    }


    if (count === 0) {
        emptyMessage.style.display = "block";
    } else {
        emptyMessage.style.display = "none";
    }


    updateSummary();
}


// Add transaction
form.onsubmit = function(event) {

    event.preventDefault();


    var descriptionValue =
        description.value.trim();

    var amountValue =
        Number(amount.value);


    if (descriptionValue === "") {

        alert("Please enter a description.");

        return false;
    }


    if (amountValue <= 0) {

        alert("Please enter a valid amount.");

        return false;
    }


    var newTransaction = {

        id: String(new Date().getTime()),

        description: descriptionValue,

        amount: amountValue,

        type: type.value,

        category: category.value,

        date: date.value
    };


    transactions.push(newTransaction);

    saveData();

    displayTransactions();

    form.reset();


    date.value =
        year + "-" + month + "-" + day;


    return false;
};


// Delete transaction
function deleteTransaction(id) {

    var remainingTransactions = [];

    for (var i = 0; i < transactions.length; i++) {

        if (
            String(transactions[i].id) !== String(id)
        ) {

            remainingTransactions.push(
                transactions[i]
            );
        }
    }


    transactions =
        remainingTransactions;

    saveData();

    displayTransactions();
}


// Filter
filter.onchange = function() {
    displayTransactions();
};


// Start application
displayTransactions();
