var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");
var table;

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "",
    database: "bamazon"
});

start();

function start(){
	inquirer.prompt({
		name: "options",
		type: "list",
		message: "Please select option below.",
		choices: ["Products for sale", "Low Inventory","Increase inventory", "Add new product"]
	})
	.then(function(userAnswer){
		if(userAnswer.options === "Products for sale"){
			viewProduct();
		}else if(userAnswer.options ==="Low Inventory"){
			lowInventory();
		}else if (userAnswer.options === "Add new product"){
			addNewProduct();
		}else if (userAnswer.options === "Increase inventory"){
			increaseInventory();
		}
	});
}


function viewProduct(){

	table = new Table({
		head: ["ID", "Product Name", "Department Name", "Price($)", "Stock Quantity"]
	});

	connection.query("SELECT * FROM products", function(error, response){

		for(var i = 0; i < response.length; i++){
			table.push([response[i].item_id, response[i].product_name, response[i].department_name, response[i].price, response[i].stock_quantity]);
		}
		console.log(table.toString());
		connection.end();
	});
}


function lowInventory(){
	table = new Table({
		head: ["ID", "Product Name", "Department Name", "Price($)", "Stock Quantity"]
	});

	connection.query("SELECT * FROM products WHERE stock_quantity<5", function(error, response){

		for(var i = 0; i < response.length; i++){
			table.push([response[i].item_id, response[i].product_name, response[i].department_name, response[i].price, response[i].stock_quantity]);
		}
		console.log(table.toString());
		connection.end();
	});
}

function addNewProduct(){
	inquirer
        .prompt([
            {
                name: "productName",
                type: "input",
                message: "What product is being added?"
            },
            {
                name: "department",
                type: "input",
                message: "What department?"
            },
            {
                name: "price",
                type: "input",
                message: "What is the price?"
            },
            {
                name: "stock",
                type: "input",
                message: "How many are in inventory?"
            }
        ])
        .then(function(userAnswer) {
            // when finished prompting, insert a new item into the db with that info
            connection.query(
                "INSERT INTO products SET ?", {
                    product_name: userAnswer.productName,
                    department_name: userAnswer.department,
                    price: userAnswer.price,
                    stock_quantity: userAnswer.stock
                },
                function(error) {
                    if (error) throw error;
                    console.log("Your new product is created successfully!");
                    connection.end();
                }
            );
        });
}


function increaseInventory(){

    inquirer
        .prompt([
            {
                name: "productId",
                type: "input",
                message: "Enter the ID of the product that is increaseing inventory?"
            },
            {
                name: "stock",
                type: "input",
                message: "How many are being added to inventory?"
            }
        ])
        .then(function(userAnswer){

            connection.query(
                "SELECT stock_quantity FROM products WHERE item_id=?",[userAnswer.productId],
            function(error, response){
                console.log(response[0].stock_quantity);
                var currentStock = parseInt(response[0].stock_quantity);
            
            // console.log(currentStock);
            // console.log(userAnswer.stock);

                connection.query(
                    "UPDATE products SET ? WHERE ?",
                [
                {
                    stock_quantity: parseInt(userAnswer.stock) + currentStock
                },
                {
                    item_id: userAnswer.productId
                }
                ],
                function(error) {
                        if (error) throw error;
                        console.log("Your stock has been updated successfully!");
                        connection.end();
                    }
                );
            });

        });
}

