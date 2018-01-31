const Products = require('./products');
const inquirer = require('inquirer');

let productManager = new Products();

function displayUI () {
    inquirer.prompt([
        {
            type: 'input',
            message: 'Enter product id you wish you purchase',
            name: 'id',
            validate: (input) => {
                input = parseInt(input);
                if (isNaN(input) || input > productManager.totalProducts) {
                    return 'Please enter a valid number';
                } else {
                    return true;
                }
            }
        },
        {
            type: 'input',
            message: 'Enter quantity of product',
            name: 'quantity',
            validate: (input) => {
                input = parseInt(input);
                if (isNaN(input)) {
                    return 'Please enter a valid number';
                } else {
                    return true;
                }
            }
        }
    ]).then(async function (productInput) {
        let productInfo = await productManager.getProdutInfo(productInput.id);

        if (productInput.quantity <= productInfo.stock_quantity) {
            productManager.sellProduct(productInput.id, productInput.quantity);
            console.log(`Order Complete: $${(productInfo.price * productInput.quantity).toFixed(2)} Total`)
            promptForNewAction();
        } else {
            console.log('Insufficient quantity, sorry!');
            promptForNewAction();
        }
    })
}

function promptForNewAction() {
    inquirer.prompt([
        {
            type: 'confirm',
            message: 'Place another order?',
            name: 'confirm'
        }
    ]).then( res => {
        if (res.confirm) {
            init();
        } else {
            productManager.disconnect();
        }
    });
}

async function init() {
    await productManager.getAllProductsCustomerView();
    displayUI();
}

init();