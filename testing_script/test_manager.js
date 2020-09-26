"use strict";

// ===== On Load Script =====
// Adds the event listeners for the products on the page.
window.onload = function () {
  var addRow = document.getElementById('AddRowBtn');
  addRow.addEventListener('click', AddIssue());
}
function AddIssue() {
  var TestIssueNumber = prompt("Please enter Issue number: ", "#01");
  var IssueDescription = prompt("Please enter a description of the issue: ", "Enter Description Here");
  var RecreationParameters = prompt("Please describe how to recreate issue: ", "Issue");
  var DateDiscovery = prompt("Date Discovered: ", "DD/MM/YYYY");
  var TableId = document.getElementById('testtable');
  var testnum = "";
  // Insert a row at the end of the table
  let newRow = TableId.insertRow(-1);

  // Insert a cell in the row at index 0
  let newCell = TableId.insertCell(0);

  // Append a text node to the cell
  let newText = document.createTextNode('New bottom row');
  newCell.appendChild(newText);



  if (TestIssueNumber == null || TestIssueNumber == "") {
    testnum = "Invalid number";
  } else {
    testnum = TestIssueNumber;
  }
  //document.getElementById("demo").innerHTML = txt;
}