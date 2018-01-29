const Products = require('./products');
const inquirer = require('inquirer');

let productManager = new Products();

function displayUI () {
    inquirer.prompt([
        {
            type: 'input',
            message: 'Enter product id you wish you purchase',
            name: 'id'
        },
        {
            type: 'input',
            message: 'Enter quantity of product',
            name: 'quantity'
        }
    ]).then(async function (productInput) {
        let productInfo = await productManager.getProdutInfo(productInput.id);
        productManager.getProdutInfo(productInput.id);

        if (productInput.quantity <= productInfo.stock_quantity) {
            productManager.sellProduct(productInput.id, productInput.quantity);
            console.log(`Order Complete: $${(productInfo.price * productInput.quantity).toFixed(2)} Total`)
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
        } else {
            console.log('Insufficient quantity, sorry!');
        }
    })
}

async function init() {
    await productManager.getAllProducts();
    displayUI();
}

init();