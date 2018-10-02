DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
    item_id INT(10) NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(225),
    department_name VARCHAR(50),
    price DECIMAL (10,4),
    stock_quantity INT(10),
    PRIMARY KEY (item_id)
);

SELECT * FROM products;

INSERT INTO products
    (item_id, product_name, department_name, price, stock_quantity)
VALUES
    ("1", "iPhone X", "Phones", 999.99, 20),
    ("2", "iPhone 8", "Phones", 999.99, 80),
    ("3", "MacBook", "Computers", 1299.99, 50),
    ("4", "MacBook Pro", "Computers", 1299.99, 60),
    ("5", "iMac", "Computers", 1799.99, 40),
    ("6", "iPad", "Tablets", 499.99, 50),
    ("7", "iPad Pro", "Tablets", 899.99, 300),
    ("8", "iPad Mini", "Tablets", 399.99, 10),
    ("9", "Apple Watch", "Wearable Tech", 599.99, 100),
    ("0", "AirPods", "Wearable Tech", 169.99, 90)