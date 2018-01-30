DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE	products (
	item_id INTEGER NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(200) NOT NULL,
    department_name VARCHAR(100),
    price DECIMAL(15,2),
    stock_quantity INTEGER,
    product_sales DECIMAL(15,2) DEFAULT 0,
    PRIMARY KEY(item_id)
);

CREATE TABLE departments (
		department_id INTEGER NOT NULL AUTO_INCREMENT,
        department_name VARCHAR(100) NOT NULL,
        over_head_costs DECIMAL(15,2) NOT NULL,
        PRIMARY KEY(department_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('TV', 'Electronics', '499.99', '100'),
('Xbox', 'Electronics' , '399.99', '2000'),
('Computer', 'Electronics', '999.99', '100000'),
('Desk', 'Furniture', '199.99', '25'),
('Sofa', 'Furniture', '499.95', '5'),
('Soda', 'Food', '1.99', '500'),
('Chips', 'Food', '2.99', '10'),
('Wine', 'Alcohol', '19.99', '50'),
('Xbox Game', 'Video Games', '59.99', '250');

INSERT INTO departments (department_name, over_head_costs) 
VALUES ('Electronics', 10000), ('Furniture', 250000), ('Food', 10000), 
('Alcohol', 500), ('Video Games', 10000);

SELECT * FROM products;