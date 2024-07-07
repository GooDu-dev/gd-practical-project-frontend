const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

// Create an Express application
const app = express();

// Create a HTTP server
const server = http.createServer(app);

// Create a Socket.IO server and attach it to the HTTP server
const io = socketIo(server);

// Serve static files from the "public" directory
app.use(express.static('public'));

// Listen for new connections from clients (socket)
io.on('connection', (socket) => {
    console.log('New client connected');

    // Listen for position updates from the client
    socket.on('positionUpdate', (position) => {
        console.log('Received position:', position);

        // Broadcast the position to all clients
        io.emit('positionUpdate', position);
    });

    // Handle client disconnection
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});