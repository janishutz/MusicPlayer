const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const ip = require('ip')

// GET IP OF SYSTEM AND DISPLAY TO USER
console.log("\n\nThis PC's IP address: " + ip.address());
console.log("Use this IP address when connecting to this server from the player and display!")

// INITIALIZE VARIABLES
var app = express();
var playbackpos = "1"
var upcomingsongs = "Test\nTest2\nTest3"
var currentsong = "This is a song"
var songmaxlength = "100"
var fullscreen = "False"
var status = "n/a"
var doupdateUI = "False"
var isplaying = "False"


// CONFIG FOR EXPRESS
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
    response.send(playbackpos)
})

app.get('/upcomingsongs', (request, response) => {
    console.log("getting upcoming songs")
    response.send(upcomingsongs)
})

app.get('/songmaxlength', (request, response) => {
    response.send(songmaxlength)
})

app.get('/currentsong', (request, response) => {
    response.send(currentsong)
})

app.get('/fullscreen', (request, response) => {
    response.send(fullscreen)
})

app.get('/isrunning', (request, response) => {
    response.send(status)
})

app.get('/uiupdate', (request, response) => {
    response.send(doupdateUI)
    doupdateUI = "False"
})

app.get('/isplaying', (request, response) => {
    response.send(isplaying)
})



// POST data (Interface for Player)
app.post('/postplayback', (request, response) => {
    playbackpos = request.body.pos
    doupdateUI = "True"
    response.send("ok")
})

app.post('/postupcomingsongs', (request, response) => {
    upcomingsongs = request.body.songs
    doupdateUI = "True"
    response.send("ok")
})

app.post('/postcurrentsong', (request, response) => {
    currentsong = request.body.songname
    doupdateUI = "True"
    response.send("ok")
})

app.get('/changefullscreen', (request, response) => {
    console.log("fullscreenmod")
    if (fullscreen == "True") {
        fullscreen = "False"
    } else {
        fullscreen = "True"
    }
    response.send("ok")
})

app.post('/postsonglength', (request, response) => {
    songmaxlength = request.body.length
    console.log(songmaxlength)
    doupdateUI = "True"
    response.send("ok")
})

app.post('/poststatus', (request, response) => {
    status = request.body.status
    doupdateUI = "True"
    response.send("ok")
})

app.get('/requestuiupdate', (request, response) => {
    doupdateUI = "True"
    response.send("ok")
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