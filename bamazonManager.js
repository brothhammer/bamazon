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
			table.push([res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]);
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
			table.push([res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]);
		}
		console.log(table.toString());
		connection.end();
	});
}

function addNewProduct(){
	inquirer
        .prompt([{
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
        .then(function(answer) {
            // when finished prompting, insert a new item into the db with that info
            connection.query(
                "INSERT INTO products SET ?", {
                    product_name: answer.productName,
                    department_name: answer.department,
                    price: answer.price,
                    stock_quantity: answer.stock
                },
                function(err) {
                    if (err) throw err;
                    console.log("Your product inventory is created successfully!");
                    connection.end();
                }
            );
        });

}

