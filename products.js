const mysql = require('mysql');
const Table = require('cli-table');

module.exports = class Products {
    constructor() {
        this.makeConnection();
    }

    makeConnection() {
        this.connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'bamazon'
        });
    
        this.connection.connect();
        this.isConnected = true;
    }
    
    disconnect() {
        this.connection.end();
        this.isConnected = false;
    }
    
    async getAllProducts() {
        let result = await this.doQuery('SELECT * FROM products');
        this.logProductData(result);
    }
    
    async getProdutInfo(productId) {
        let result = await this.doQuery('SELECT  * FROM products WHERE item_id = ?', productId);
        return result[0];
    }
    
    async sellProduct(productId, quantity) {
        await this.doQuery('UPDATE products SET stock_quantity = stock_quantity - ?, product_sales = product_sales + price * ? WHERE item_id = ?',
            [quantity, quantity, productId]);
    }

    async getLowQuantityItems() {
        let result = await this.doQuery('SELECT * FROM products WHERE stock_quantity <= 5');
        this.logProductData(result);
    }

    async addProduct(productName, departmentName, price, currentStock) {
        await this.doQuery('INSERT INTO products (product_name, department_name, price, stock_quantity) VALUE (?, ?, ?, ?)', 
            [productName, departmentName, price, currentStock]);
    }

    async updateProductQuantity(productId, quantity) {
        await this.doQuery('UPDATE products SET stock_quantity = stock_quantity + ? WHERE item_id = ?', [quantity, productId]);
    } 

    async doQuery(queryString, queryParams) {
        if (!this.isConnected) {
            this.makeConnection();
        }
        queryParams = queryParams || [];

        let result;
        await new Promise( (resolve, reject) => {
                this.connection.query(queryString, queryParams, (err, res) => {
                    if (err) result = err;
                    result = res;
                    resolve();
                });
            });

        return result;
    }

    logProductData(data) {
        let table = new Table({
            head: ['Product ID', 'Product Name', 'Department Name', 'Price', 'Stock', 'Sales'],
        });

        data.forEach(product => {
            let arr = []; 
            for (let attr in product) {
                arr.push(product[attr]);   
            }
            table.push(arr);
        });

        console.log(table.toString());
    }
    
    
}

