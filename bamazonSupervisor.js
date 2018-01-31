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
                inquirer.prompt([
                    {
                        type: 'input',
                        message: 'Enter Department Name',
                        name: 'name'
                    }, 
                    {
                        type: 'input',
                        message: 'Enter Overhead Cost',
                        name: 'overhead',
                        validate: (input) => {
                            input = parseFloat(input);
                            if (isNaN(input) || input < 0) {
                                return 'Please enter a valid number';
                            } else {
                                return true;
                            }
                        }
                    }
                ]).then(async function(department) {
                    await productManager.createNewDepartment(department.name, department.overhead);
                    promptForNewAction();
                })
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
        } else {
            productManager.disconnect();
        }
    })
}

displayUI();