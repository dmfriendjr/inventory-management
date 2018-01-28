const mysql = require('mysql');
const inquirer = require('inquirer');

let isConnected = false;
let connection;

function makeConnection() {
    connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'bamazon'
    });

    connection.connect();
    isConnected = true;
}

function disconnect() {
    connection.end();
    isConnected = false;
}

function getAllProducts() {
    if (!isConnected) {
        makeConnection();
    }

    connection.query('SELECT * FROM products', (err, res) => {
        logProductData(res);
        displayUI();
    });
}

function getProdutInfo(productId) {
    if (!isConnected) {
        makeConnection();
    }

    return new Promise( (resolve, reject) => {
        connection.query('SELECT  * FROM products WHERE item_id = ?', productId, (err, res) => {
            if (err) reject(err);
            resolve(res[0]);
        });
    })
}

function checkItemQuantity(productId) {
    if (!isConnected) {
        makeConnection();
    }
    let quantity;    
    return new Promise( (resolve, reject) => {
        connection.query('SELECT * FROM products WHERE item_id = ?', productId, (err, res) => {
            if (err) throw err;
            quantity = res[0].stock_quantity;
            resolve(res[0].stock_quantity);
        });
    });
}

function logProductData(data) {
    data.forEach(product => {
        let log = '';
        for (let attr in product) {
            log += `${(attr.charAt(0).toUpperCase() + attr.slice(1)).replace(/_/g, " ")}: ${product[attr]} | `
        }
        console.log(log);
    });
}

function updateProduct(productId, quantity) {
    return new Promise( (resolve, reject) => {
        connection.query('UPDATE products SET stock_quantity = ? WHERE item_id = ?', [quantity, productId], (err, res) => {
            if (err) reject(err);
            resolve(true);
        });
    });
}

function displayUI () {
    inquirer.prompt([
        {
            type: 'input',
            message: 'Enter product id you wish you purchase',
            name: 'productId'
        }
    ]).then(productInput => {
        console.log(productInput.productId);
        inquirer.prompt([
            {
                type: 'input',
                message: 'Enter quantity of product',
                name: 'productQuantity'
            }
        ]).then(async function(quantityInput) {
            let productInfo = await getProdutInfo(productInput.productId);
            getProdutInfo(productInput.productId);

            if (quantityInput.productQuantity <= productInfo.stock_quantity) {
                var orderComplete = await updateProduct(productInput.productId, productInfo.stock_quantity - quantityInput.productQuantity);
                if (orderComplete) {
                    console.log(`Order Complete: $${productInfo.price * quantityInput.productQuantity} Total`)
                }
            } else {
                console.log('Insufficient quantity, sorry!');
            }
        })
    })
}

makeConnection();
getAllProducts();