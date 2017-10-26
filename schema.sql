DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products(
	item_id INT(10) AUTO_INCREMENT NOT NULL,
	product_name VARCHAR(100),
	department_name VARCHAR(100),
	price DECIMAL(10,2),
	stock_quantity INT(10),
	PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Dolorian", "Time Travel", 24000, 10);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("X-Wing", "Spave Travel", 94000.20, 4);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Portal Gun", "Time Travel", 900, 24);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Light Saber", "Weapon", 650, 40);


