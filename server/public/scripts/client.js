var updating = false;

// call event listeners & functions to append initial stuff to DOM
$(document).ready(function(){
eventListeners();
getEmployees();
});

// Event listener to listen for form submits and call POST function
function eventListeners(){
  $( '#inputForm' ).on("submit",function(event){
    event.preventDefault();
    var employee;
    if (updating) {
      console.log("submitted update");
      updating = false;
      var id = $('#submitEmployee').data("id");
      employee = createEmployeeObject();
      employee.id = id;
      $('#submitEmployee').data("id", "");
      updateEmployee(employee);
    } else {
      console.log("you've submitted new stuff");
      employee = createEmployeeObject();
      postEmployee(employee);
    }
  });

// Function to create employee object from input fields
function createEmployeeObject() {
  var employee = {
    name: $('#name').val(),
    position: $('#position').val(),
    salary: $('#salary').val()
  };
  return employee;
}

// Event listener to listen for clicks to delete buttons and call DELETE function
  $('#displayDiv').on('click', '.deleteBtn', function() {
    console.log("clicked delete");
    var employee_id = $(this).parent().data('id');
    var id_object = {id: employee_id};
    deleteEmployee(id_object);
  });

// Event listener to listen for clicks to update buttons and call prepareForUpdate
  $('#displayDiv').on('click', '.updateBtn', function() {
    console.log("clicked update");
    var $employeeDiv = $(this).closest(".personDiv");
    var employeeObject = {
      id: $employeeDiv.data("id"),
      name: $employeeDiv.find(".name").text(),
      position: $employeeDiv.find(".position").text(),
      salary: $employeeDiv.find(".salary").text(),
    };
    prepareForUpdate(employeeObject);
  });

}


// AJAX GET request to get all employees
function getEmployees() {
  $.ajax({
    type: 'GET',
    url: '/employees',
    success: function(response) {
      console.log("Got from server:", response);
      appendDom(response);
    }
  });
}

// AJAX POST request to /employee to store entered data to DB
function postEmployee(employee) {
  $.ajax({
    type: 'POST',
    url: '/employees',
    data: employee,
    success: function(response) {
      getEmployees();
    }
  });
}

// AJAX DELETE request to delete data for a given id, passed via the key "id" in an object
function deleteEmployee(deleteEmployeeObject){
  $.ajax({
    type: 'DELETE',
    url: '/employees',
    data: deleteEmployeeObject,
    success: function(response){
      getEmployees();
    }
  });
}

// AJAX UPDATE request to update data for a given id, passed an object that contains the key "id"
function updateEmployee(updateEmployeeObject) {
  $.ajax({
    type: 'PUT',
    url: '/employees',
    data: updateEmployeeObject,
    success: function(response) {
      console.log(response);
      getEmployees();
    }
  });
}

// Function to put employee info back in input fields for updating
function prepareForUpdate(employeeObject) {
  $('#name').val(employeeObject.name);
  $('#position').val(employeeObject.position);
  $('#salary').val(employeeObject.salary);
  $('#submitEmployee').data("id", employeeObject.id);
  updating = true;
}

// Function to append all employees in divs to DOM
function appendDom(dataArray){
 var $displayDiv = $( '#displayDiv' );
 $displayDiv.empty();
 for ( var i = 0; i < dataArray.length; i++){
   var id = dataArray[i]._id;
   var name = dataArray[i].name;
   var position = dataArray[i].position;
   var salary = dataArray[i].salary;
   $displayDiv.append( '<div class = "personDiv"></div>');
   var $el = $displayDiv.children().last();
   $el.data("id",id);
   $el.append( '<p class="name">'+name+'</p>');
   $el.append( '<p class="position">'+position+'</p>');
   $el.append( '<p class="salary">'+salary+'</p>');
   $el.append( '<button class="deleteBtn">Delete</button>');
   $el.append( '<button class="updateBtn">Update</button>');
 }//ends for loop
 $('#name').val('');
 $('#position').val('');
 $('#salary').val('');
 $('#name').focus();
}//ends appendDom
