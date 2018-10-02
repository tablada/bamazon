require ('dotenv').config();
var credentials = require('./credentials');
var inquirer = require('inquirer');
var mysql = require('mysql');
const Tablefy = require('tablefy');

//MySQL Parameters from credential and .env
var mysql_params = credentials.mysql_params;

//Parameters for MySQL connection
var serverParams = {
    host: mysql_params.host,
    port: mysql_params.port,
    user: mysql_params.user,
    password: mysql_params.password,
    database: 'bamazon'
}

// MySQL Server Connection
var connection = mysql.createConnection(serverParams);

// Product Table from Bamazon
function displayProducts() {
    var queryStr = 'Select item_id as ID, product_name as Product, department_name as Department, price as Price, stock_quantity as Stock from Products';
    var query = connection.query(queryStr, function(error, response) {
        if (error) throw error;
        console.log('\x1b[33m\x1b[44m'); // Console log background turns blue
        let tablefy = new Tablefy();
        tablefy.draw(response);
        console.log('\x1b[0m'); // Background reset

        mainMenu();
    });
}

function updateProducts(pid, newQty) {

    var queryStr = 'Update products Set? Where?';
    var queryParam = [{stock_quantity: newQty}, {item_id: pid}];

    var query = connection.query(queryStr, queryParam, function(error, response) {
        console.log(response.affectedRows + " product updated!\n");

        inquirer.prompt([
            {
                type: 'confirm',
                message: 'Press ANY key to continue...',
                name: 'anykey'
            }
        ]).then(function(answer){
            displayProducts();
        });
    });
}

function processOrder(pid, qty) {
    var queryStr = 'Select stock_quantity, price, product_name from products Where?';
    var queryParam = {item_id: pid};

    var query = connection.query(queryStr, queryParam, function(error, response){
        if (error) throw error;

        var stock = response[0].stock_quantity;
        var price = response[0].price;
        var productName = response[0].product_name;

        if (stock - qty < 0) {
            console.log('Out of stock! - Order canceled.');
            displayProducts();
        }
        else {
            console.log('INVOICE');
            console.log('You have purchased \x1b[37m%s\x1b[30m %s', qty, productName);
            console.log('The total amount due is \x1b[37m$' + qty * price);
            console.log('\x1b[0m');

            updateProducts(pid, (stock - qty));
        }
    });
}

function placeOrder() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'item_id',
            message: 'Desired product (ID): ',
            validate: function(value) {
                var pass = parseInt(value);
                if (pass === NaN) { return 'Please enter an integer number.'}
                else return true;
            }
        },
        {
            type: 'input',
            name: 'product_qty',
            message: 'Quantity: ',
            validate: function(value) {
                var pass = parseInt(value);
                if (pass === NaN) { return 'Please enter an integer number.'}
                else return true;
            }
        }
    ]).then( function(answer){
        var pid = answer.product_id;
        var qty = answer.product_qty;
        
        processOrder(pid, qty);
    });
}

function mainMenu() {
    inquirer.prompt([
        {
            type: 'list',
            message: 'Select an option: ',
            name: 'mainOption',
            choices: ['Place an Order', 'Quit']
        }
    ]).then(function(answer){
        switch (answer.mainOption) {
            case 'Place an order':
                placeOrder(pid, qty);
            break;
            case 'Quit':
                connection.end();
                console.log('Thank you, please come again!');
            break;
        }
    })
}

displayProducts();