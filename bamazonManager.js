const Products = require('./products');
const inquirer = require('inquirer');

let productManager = new Products();

function displayUI () {
    inquirer.prompt([{
        type: 'list',
        message: 'Choose An Action',
        choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product'],
        name: 'action' 
    }]).then( async function (result) {
        switch(result.action) {
            case 'View Products for Sale':
                await productManager.getAllProducts();
                promptForNewAction();
            break;
            case 'View Low Inventory':
                await productManager.getLowQuantityItems();
                promptForNewAction();
            break;
            case 'Add to Inventory':
                inquirer.prompt([
                    {
                        type: 'input',
                        message: 'Enter Product ID',
                        name: 'productId'
                    },
                    {
                        type: 'input',
                        message: 'Enter Stock To Add',
                        name: 'productQuantity'
                    }
                ]).then( res => {
                    addToInventory(res.productId, res.productQuantity);
                })
            break;
            case 'Add New Product':
                addProduct();
            break;
        }
    })

    return;
}

function promptForNewAction() {
    inquirer.prompt([
        {
        type: 'confirm',
        message: 'Perform another action?',
        name: 'confirm'
        }
    ]).then ( res => {
        if (res.confirm) {
            displayUI();
        }
    })
}

function addProduct() {
    inquirer.prompt([
        {
        type: 'input',
        message: 'Enter Product Name',
        name: 'name'
        },
        {
            type: 'input',
            message: 'Enter Department Name',
            name: 'department'
        },
        {
            type: 'input',
            message: 'Enter Product Price',
            name: 'price'
        },
        {
            type: 'input',
            message: 'Enter Product Quantity',
            name: 'quantity'
        }
    ]).then( product => {
        productManager.addProduct(product.name, product.department, product.price, product.quantity);
        console.log('Product Added!');
        promptForNewAction();
    })
}

async function addToInventory(productId, quantityToAdd) {
    await productManager.updateProductQuantity(productId, quantityToAdd);
    console.log('Updated product quantity.');
    promptForNewAction();
}

displayUI();