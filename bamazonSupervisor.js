const inquirer = require('inquirer');
const Products = require('./products');

let productManager = new Products();

function displayUI () {
    inquirer.prompt([{
        type: 'list',
        message: 'Choose An Action',
        choices: ['View Product Sales By Department', 'Create New Department'],
        name: 'action' 
    }]).then( async function (result) {
        switch(result.action) {
            case 'View Product Sales By Department':
                await productManager.getSalesByDepartment();
                promptForNewAction();
            break;
            case 'Create New Department':
                await productManager.getLowQuantityItems();
                promptForNewAction();
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

displayUI();