var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(8000, function(){
    console.log("We are listening on port 8000!");
});

app.use(express.static('static'));
app.use('/', express.static('index.html'));

io.of('/').on('connection', function(socket) {
    socket.on('value', function (data) {
        console.log(data);
        socket.broadcast.emit('value', data);
    });
});