// call event listeners & functions to append initial stuff to DOM
$(document).ready(function(){
eventListeners();
getEmployees();
});

// Event listener to listen for form submits and call POST function
function eventListeners(){
  $( '#inputForm' ).on("submit",function(event){
    event.preventDefault();
    console.log("you've clicked submit!");
    var employee = {
      name: $('#name').val(),
      position: $('#position').val(),
      salary: $('#salary').val()
    };
    postEmployee(employee);
  });

// Event listener to listen for clicks to delete buttons and call DELETE function
  $('#displayDiv').on('click', 'button', function() {
    console.log("clicked delete");
    var employee_id = $(this).parent().data('id');
    var id_object = {id: employee_id};
    deleteEmployee(id_object);
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
   $el.append( '<p>'+name+'</p>');
   $el.append( '<p>'+position+'</p>');
   $el.append( '<p>'+salary+'</p>');
   $el.append( '<button>Delete</button>');
 }//ends for loop
 $('#name').val('');
 $('#position').val('');
 $('#salary').val('');
 $('#name').focus();
}//ends appendDom
