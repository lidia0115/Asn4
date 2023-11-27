/******************************************************************************
***
* ITE5315 – Assignment 4
* I declare that this assignment is my own work in accordance with Humber Academic Policy. 
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students.
* 
* Name: __Lidia Abey_ Student ID: _N01546403__ Date: __26/11/2023__
*
*
******************************************************************************
**/ 

var express  = require('express');
var mongoose = require('mongoose');
var app      = express();
var database = require('./config/database');
var bodyParser = require('body-parser');         // pull information from HTML POST (express4)
 
var port = process.env.PORT || 8000;
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json

// Set up Handlebars as the view engine
const exphbs = require('express-handlebars');

app.engine('hbs', exphbs.engine({ extname: '.hbs'}));
app.set('view engine', 'hbs');

mongoose.connect(database.url);

var Employee = require('./models/employee');

var Invoice = require('./models/invoice');
 
// Root route ('/')
app.get('/', function(req, res) {
    res.render('index',{title:"Home"}); 
  });
 
//get all employee data from db
app.get('/api/employees', function(req, res) {
	// use mongoose to get all todos in the database
	Employee.find(function(err, employees) {
		// if there is an error retrieving, send the error otherwise send data
		if (err)
			res.send(err)
		res.json(employees); // return all employees in JSON format
	});
});

// get a employee with ID of 1
app.get('/api/employees/:employee_id', function(req, res) {
	let id = req.params.employee_id;
	Employee.findById(id, function(err, employee) {
		if (err)
			res.send(err)
 
		res.json(employee);
	});
 
});


// create employee and send back all employees after creation
app.post('/api/employees', function(req, res) {

    // create mongose method to create a new record into collection
    console.log(req.body);

	Employee.create({
		name : req.body.name,
		salary : req.body.salary,
		age : req.body.age
	}, function(err, employee) {
		if (err)
			res.send(err);
 
		// get and return all the employees after newly created employe record
		Employee.find(function(err, employees) {
			if (err)
				res.send(err)
			res.json(employees);
		});
	});
 
});


// create employee and send back all employees after creation
app.put('/api/employees/:employee_id', function(req, res) {
	// create mongose method to update an existing record into collection
    console.log(req.body);

	let id = req.params.employee_id;
	var data = {
		name : req.body.name,
		salary : req.body.salary,
		age : req.body.age
	}

	// save the user
	Employee.findByIdAndUpdate(id, data, function(err, employee) {
	if (err) throw err;

	res.send('Successfully! Employee updated - '+employee.name);
	});
});

// delete a employee by id
app.delete('/api/employees/:employee_id', function(req, res) {
	console.log(req.params.employee_id);
	let id = req.params.employee_id;
	Employee.remove({
		_id : id
	}, function(err) {
		if (err)
			res.send(err);
		else
			res.send('Successfully! Employee has been Deleted.');	
	});
});


// Route to show all invoice-info
// app.get('/api/invoices', function (req, res) {
//     Invoice.find(function (err, invoices) {
//         if (err)
//             res.send(err)
//         res.json(invoices);
//     });
// });

// Route to show all invoice-info
app.get('/api/invoices', function (req, res) {
    Invoice.find(function (err, invoices) {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
        } else {
            res.render('invoices', { invoices: invoices, title:"Invoices Data"});
        }
    });
});

// Route to render the form for filtering the invoice data
app.get('/api/filter-form', function (req, res) {
    res.render('filter-invoice');
});


// New route for handling invoice filtering options
app.get('/api/filterInvoices', function (req, res) {
    const filterOptions = {
        branch: req.query.branch,
        city: req.query.city,
        customerType: req.query['Customer type'],
        productLine: req.query['Product line'],
    };

    const filter = {};
    if (filterOptions.branch) {
        filter['Branch'] = filterOptions.branch;
    }
    if (filterOptions.city) {
        filter['City'] = filterOptions.city;
    }
    if (filterOptions.customerType) {
        filter['Customer type'] = filterOptions.customerType;
    }
    if (filterOptions.productLine) {
        filter['Product line'] = filterOptions.productLine;
    }

    Invoice.find(filter, function (err, filteredInvoices) {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
        } else {
            res.render('invoices', { invoices: filteredInvoices,title:"Filtered Invoice"});
        }
    });
});




// Route to show a specific invoice by ID
app.get('/api/invoices/:invoice_id', function (req, res) {
    let id = req.params.invoice_id;
    Invoice.findById(id, function (err, invoice) {
        if (err)
            res.send(err)
        res.json(invoice);
    });
});



// Route to render the form for a new invoice
app.get('/api/newInvoice', function (req, res) {
    console.log('Rendering new-invoice page...');
    res.render('new-invoice',{title:"New Invoice"});
});


// Post mwthod to insert a new invoice
app.post('/api/invoices', function (req, res) {
    //console.log(req.body);
    const newInvoiceData = {
        "Invoice ID": req.body['Invoice ID'],
        "Branch": req.body.Branch,
        "City": req.body.City,
        "Customer type": req.body['Customer type'],
        "Product line": req.body['Product line'],
        "name": req.body.name,
        "image": req.body.image,
        "Unit price": req.body['Unit price'],
        "Quantity": req.body.Quantity,
        "Tax 5%": req.body['Tax 5%'],
        "Total": req.body.Total,
        "Date": req.body.Date,
        "Time": req.body.Time,
        "Payment": req.body.Payment,
        "cogs": req.body.cogs,
        "gross income": req.body['gross income'],
        "Rating": req.body.Rating
    };

    Invoice.create(newInvoiceData, function (err, invoice) {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
        } else {
            console.log('Invoice inserted:', invoice);
            Invoice.find(function (err, invoices) {
                if (err) {
                    console.error(err);
                    res.status(500).send('Internal Server Error');
                } else {
                    //res.json(invoices);
                    res.status(200).redirect('/api/invoices');
                }
            });
        }
    });
});


// Route to delete an existing invoice by ID
app.delete('/api/invoices/:invoice_id', function (req, res) {
    let id = req.params.invoice_id;
    Invoice.remove({
        _id: id
    }, function (err) {
        if (err)
            res.send(err);
        else
            res.send('Invoice has been Deleted Successfully!');
    });
});

// Route to update "Customer type" & "unit price" of an existing invoice by ID
app.put('/api/invoices/:invoice_id', function (req, res) {
    console.log(req.body);
    let id = req.params.invoice_id;
    var data = {
        "Invoice ID": req.body['Invoice ID'],
        "Branch": req.body.Branch,
        "City": req.body.City,
        "Customer type": req.body['Customer type'],
        "Product line": req.body['Product line'],
        "name": req.body.name,
        "image": req.body.image,
        "Unit price": req.body['Unit price'],
        "Quantity": req.body.Quantity,
        "Tax 5%": req.body['Tax 5%'],
        "Total": req.body.Total,
        "Date": req.body.Date,
        "Time": req.body.Time,
        "Payment": req.body.Payment,
        "cogs": req.body.cogs,
        "gross income": req.body['gross income'],
        "Rating": req.body.Rating
    }
    Invoice.findByIdAndUpdate(id, data, function (err, invoice) {
        if (err) throw err;
        res.send('Successfully! Invoice updated - ' + invoice.name);
    });
});


app.listen(port);
console.log("App listening on port : " + port);