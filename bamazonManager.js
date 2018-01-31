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
                addToInventory();
                break;
            case 'Add New Product':
                addProduct();
                break;
        }
    })
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

async function addProduct() {
    let validDepartmentNames = await productManager.getAllDepartments();

    inquirer.prompt([
        {
        type: 'input',
        message: 'Enter Product Name',
        name: 'name'
        },
        {
            type: 'list',
            choices: validDepartmentNames,
            message: 'Choose Department (Contact Supervisor To Add New Departments)',
            name: 'department'
        },
        {
            type: 'input',
            message: 'Enter Product Price',
            name: 'price',
            validate: (input) => {
                input = parseFloat(input);
                if (isNaN(input)) {
                    return 'Please enter a valid price'
                } else {
                    return true;
                }
            }
        },
        {
            type: 'input',
            message: 'Enter Product Quantity',
            name: 'quantity',
            validate: (input) => {
                input = parseInt(input);
                if (isNaN(input) || input < 0) {
                    return 'Please enter a valid number';
                } else {
                    return true;
                }
            }
        }
    ]).then( product => {
        productManager.addProduct(product.name, product.department, product.price, product.quantity);
        console.log('Product Added!');
        promptForNewAction();
    })
}

async function addToInventory() {
    await productManager.getAllProducts();

    await inquirer.prompt([
        {
            type: 'input',
            message: 'Enter Product ID',
            name: 'productId',
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
            message: 'Enter Stock To Add',
            name: 'quantityToAdd'
        }
    ]).then(async function(res) {
        await productManager.updateProductQuantity(res.productId, res.quantityToAdd);
        console.log('Updated product quantity.');
        promptForNewAction();
    })
}

displayUI();