const Products = require('./products');
const inquirer = require('inquirer');

let productManager = new Products();

function displayUI () {
    inquirer.prompt([
        {
            type: 'input',
            message: 'Enter product id you wish you purchase',
            name: 'productId'
        }
    ]).then(productInput => {
        console.log(productInput.productId);
        console.log('Doing quantity input');
        inquirer.prompt([
            {
                type: 'input',
                message: 'Enter quantity of product',
                name: 'productQuantity'
            }
        ]).then(async function(quantityInput) {
            let productInfo = await productManager.getProdutInfo(productInput.productId);
            productManager.getProdutInfo(productInput.productId);

            if (quantityInput.productQuantity <= productInfo.stock_quantity) {
                var orderComplete = await productManager.updateProduct(productInput.productId, productInfo.stock_quantity - quantityInput.productQuantity);
                if (orderComplete) {
                    console.log(`Order Complete: $${(productInfo.price * quantityInput.productQuantity).toFixed(2)} Total`)
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
                            return;
                        }
                    } )
                }
            } else {
                console.log('Insufficient quantity, sorry!');
            }
        })
    })
}

async function init() {
    await productManager.getAllProducts();
    displayUI();
}

init();