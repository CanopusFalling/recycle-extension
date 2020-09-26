"use strict";

// ===== On Load Script =====
// Adds the event listeners for the products on the page.
window.onload = function(){ 
    
}
function AddIssue(){
    var TestIssueNumber = prompt("Please enter Issue number: ","#01");
    var IssueDescription = prompt("Please enter a description of the issue: ","Enter Description Here");
    var RecreationParameters = prompt("Please describe how to recreate issue: ","Issue");
    var DateDiscovery = prompt("Date Discovered: ","DD/MM/YYYY");
    
    if (TestIssueNumber == null || TestIssueNumber == "") {
      testnum = "Invalid number";
    } else {
      testnum = TestIssueNumber;
    }
    //document.getElementById("demo").innerHTML = txt;
  }


}