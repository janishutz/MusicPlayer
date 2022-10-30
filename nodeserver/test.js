var XMLHttpRequest = require('./node_modules/xmlhttprequest').XMLHttpRequest;
var xhrq = new XMLHttpRequest();

xhrq.open('POST', "http://localhost:8000/testrequest", true);
xhrq.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
xhrq.send(JSON.stringify({"Test": "Test2"})); 
xhrq.onload = function () {
    console.log(this.responseText)
};