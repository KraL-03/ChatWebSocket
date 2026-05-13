const express = require('express');
const {createServer} = require('node:http');
const {Server} = require('socket.io');

const app = express();
const server = createServer(app);

const io = new Server(server, {
    cors: {
        origin: '*',
    }
});

const mensajes = [];

io.on('connection', (socket) => {
    console.log('Alguien se conectó');
    // Mensajes a todos
    socket.emit('mensaje', mensajes);

    socket.on('mensaje', (mensaje) => {
        // A todos los que estén conectados
        //io.emit('mensaje', mensaje);

        // A todos menos al que lo envió
        mensajes.push(mensaje);
        io.emit('mensaje', mensajes);
    
    });
});


server.listen(3000, () => {
    console.log('Corriendo en el puerto 3000');
});