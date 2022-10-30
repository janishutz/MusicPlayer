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
var isrunning = "False"


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
    console.log("getting fullscreen status")
    response.send(fullscreen)
})

app.get('/isrunning', (request, response) => {
    response.send(isrunning)
})


// POST data (Interface for Player)
app.post('/postplayback', (request, response) => {
    playbackpos = request.body.pos
    response.send("ok")
})

app.post('/postupcomingsongs', (request, response) => {
    console.log("updating upcomingsongs")
    upcomingsongs = request.body.songs
    response.send("ok")
})

app.post('/postcurrentsong', (request, response) => {
    currentsong = request.body.songname
    response.send("ok")
})

app.get('/changefullscreen', (request, response) => {
    console.log("fullscreenmod")
    if (fullscreen == "True") {
        fullscreen = "False"
    } else {
        fullscreen = "True"
    }
    console.log(fullscreen)
    response.send("ok")
})

app.post('/postsonglength', (request, response) => {
    songmaxlength = request.body.length
    response.send("ok")
})

app.post('/poststatus', (request, response) => {
    console.log("updating status " + request.body.status)
    isrunning = request.body.status
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