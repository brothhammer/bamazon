var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");

var table;
var price;
var total;
var product;
var stockQuantity;
var sales;

var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,

	user: "root",
	password: "",
	database: "bamazon"
});

showProducts();

function showProducts(){

	table = new Table({
		head: ["ID", "Product", "Department", "Price", "In Stock"]
	});

	connection.query("SELECT * FROM products", function(error, results){

		for(var i = 0; i < results.length; i++){
			table.push([results[i].item_id, results[i].product_name, results[i].department_name, results[i].price, results[i].stock_quantity]);
		}
		console.log(table.toString());

		inquirer.prompt([{
			name: "id",
			type: "input",
			message: "Enter the ID of the item to purchase."
		},
		{
			name: "count",
			type: "input",
			message: "How many?"
		}

		]).then(function(userAnswers){
			
			var firstQuery = connection.query("SELECT price, product_name, stock_quantity FROM products WHERE item_id=?", [userAnswers.id], function(error, response){
				if(error) throw error;

				for(i=0; i<response.length; i++){
					price = parseInt(response[i].price);
					total = price * parseInt(userAnswers.count);
					stockQuantity = parseInt(response[i].stock_quantity);
					product = response[i].product_name;
					// sales = pareInt(response[i].product_sales);
				}
					console.log(parseInt(userAnswers.count));
					console.log(stockQuantity);
					console.log(total);

				if(userAnswers.count<stockQuantity){
					console.log("The total is " + total + " for " + userAnswers.count + " " + product);



					connection.query("UPDATE products SET ? WHERE ?", [{
						stock_quantity: (stockQuantity - parseInt(userAnswers.count)),
					},
					{
						item_id: userAnswers.id
					}],
					function(error){
						if(error) throw error;
						console.log("The product table has been updated.");
						connection.end();
					});



				}else{
						console.log("Not enough stock to fill the order request.");
						showProducts();
					 }
            });

        });

    });

}