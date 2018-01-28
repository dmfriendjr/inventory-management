const mysql = require('mysql');

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
    
    getAllProducts() {
        if (!this.isConnected) {
            this.makeConnection();
        }
    
        return new Promise( (resolve, reject) => {
            this.connection.query('SELECT * FROM products', (err, res) => {
                if (err) reject(err);
                this.logProductData(res);
                resolve();
            });
        })
    }
    
    getProdutInfo(productId) {
        if (!this.isConnected) {
            this.makeConnection();
        }
    
        return new Promise( (resolve, reject) => {
            this.connection.query('SELECT  * FROM products WHERE item_id = ?', productId, (err, res) => {
                if (err) reject(err);
                resolve(res[0]);
            });
        })
    }
    
    checkItemQuantity(productId) {
        if (!this.isConnected) {
            this.makeConnection();
        }
        return new Promise( (resolve, reject) => {
            this.connection.query('SELECT * FROM products WHERE item_id = ?', productId, (err, res) => {
                if (err) throw err;
                resolve(res[0].stock_quantity);
            });
        });
    }

    getLowQuantityItems() {
        if (!this.isConnected) {
            this.makeConnection();
        }

        return new Promise( (resolve, reject) => {
            this.connection.query('SELECT * FROM products WHERE stock_quantity <= 5', (err, res) => {
                if (err) reject(err);
                this.logProductData(res);
                resolve();
            })
        })
    }

    addProduct(productName, departmentName, price, currentStock) {
        if (!this.isConnected) {
            this.makeConnection();
        }

        this.connection.query('INSERT INTO products (product_name, department_name, price, stock_quantity) VALUE (?, ?, ?, ?)', 
            [productName, departmentName, price, currentStock], (err, res) => {
                if (err) throw err;
            });
    }

    updateProductQuantity(productId, quantity) {
        return new Promise( (resolve, reject) => {
            this.connection.query('UPDATE products SET stock_quantity = stock_quantity + ? WHERE item_id = ?', [quantity, productId], (err, res) => {
                if (err) reject(err);
                resolve(true);
            });
        });
    } 

    logProductData(data) {
        data.forEach(product => {
            let log = '';
            for (let attr in product) {
                log += `${(attr.charAt(0).toUpperCase() + attr.slice(1)).replace(/_/g, " ")}: ${product[attr]} | `
            }
            console.log(log);
        });
    }
    
    
}

