const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const ip = require('ip')

// GET IP OF SYSTEM AND DISPLAY TO USER
console.log("\n\nThis PC's IP address: " + ip.address());
console.log("Use this IP address when connecting to this server from the player and display!")

// INITIALIZE VARIABLES
var app = express();


app.use(bodyParser.urlencoded({extended : true}))


/////////////////
////// API //////
/////////////////

app.get('/tryconnect', (request, response) => {
    console.log("connecting")
    response.send("ok")
})


// Get data (Interface for Screen)
app.get('/playbackpos', (request, response) => {
    response.send(1)
})

app.get('/upcomingsongs', (request, response) => {
    response.send("This is a song")
})

app.get('/songmaxlength', (request, response) => {
    response.send(100)
})

app.get('/currentsong', (request, response) => {
    response.send("Test\nTest2\nTest3")
})




// POST data (Interface for Player)
app.post('/posplayback', (request, response) => {

})

app.post('/postupcomingsogns', (request, response) => {

})


// Test functions
app.post('/testrequest', (request, response) => {
    console.log("request received")
    console.log(request.body)
    response.send(request.body)
    response.status(200)
}) 

// Create and run server
http.createServer(app).listen(8000, function () {
    console.log("\n\n-------------------\n\n  Server started\n\n-------------------\n")
})