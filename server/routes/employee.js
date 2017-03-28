var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");

// Defines HOW Documents will be saved to the Database
var EmployeeSchema = mongoose.Schema({
  name : String,
  position: String,
  salary: Number
});

/*
  Employees - Is a reference to the collection when finding things in the DB,
  Employees - Is a reference to the Schema, when we are saving things to the DB.
*/
var Employees = mongoose.model("Employees", EmployeeSchema);

//GET employees
router.get("/", function(req,res){
  //Get all employees
  Employees.find(function(err, allEmployees){
    if(err){
      console.log(err);
      res.sendStatus(500);
    }
    res.send(allEmployees);
  });
});

//Save a new employee
router.post("/", function(req,res){
  //Instance of the Model to be saved to the database
  var employee = new Employees();
  employee.name = req.body.name;
  employee.position = req.body.position;
  employee.salary = req.body.salary;
  employee.save(function(err, savedEmployee){
    if(err){
      console.log(err);
      res.sendStatus(500);
    }

    res.send(savedEmployee);
  });
});

/*
  $.ajax({
      type: "DELETE",
      url: "/employees/" + id,
      success stuff
  });
  $.ajax({
      type: "DELETE",
      data: data,
      url: "/employees/",
      success stuff
  });
*/

//Delete an employee
router.delete("/", function(req,res){
  //Delete an employee
  // { "id" : "83275019375918538?"}
  var id = req.body.id;
  Employees.findByIdAndRemove(id, function(err, deletedEmployee){
    /*fffff
      if(undefined){} - False Value
      if("Some Error Code"){} - True Value
    */

    if(err){
      console.log(err);
      res.sendStatus(500);
    }

    res.send(deletedEmployee);
  });
});

//Update an employee
router.put("/", function(req, res){
  var id = req.body.id;
  Employees.findById(id, function(err, updatedEmployee){
    if (err) {
      res.status(500).send(err);
    } else {
      updatedEmployee.name = req.body.name || updatedEmployee.name;
      updatedEmployee.position = req.body.position|| updatedEmployee.position;
      updatedEmployee.salary = req.body.salary || updatedEmployee.salary;
      updatedEmployee.save(function(err, todo) {
        if(err) {
          res.status(500).send(err);
        }
        res.send(updatedEmployee);
      });
    }
  });
});

module.exports = router;
