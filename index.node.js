// Requires: npm install express socket.io mongoose
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/collabeditor', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const docSchema = new mongoose.Schema({
    text: String,
});
const Doc = mongoose.model('Doc', docSchema);

// Load or create the document in DB
let documentText = '';
Doc.findOne().then(async (doc) => {
    if (doc) {
        documentText = doc.text;
    } else {
        const newDoc = new Doc({ text: '' });
        await newDoc.save();
        documentText = '';
    }
});
// Node.js backend for real-time collaborative document editor
// Requires: npm install express socket.io

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

let documentText = '';

// Serve static files (HTML, CSS, JS)
app.use(express.static(__dirname));

io.on('connection', (socket) => {
    // Send current document to new client
    socket.emit('update', documentText);

    // Listen for edits
    socket.on('edit', (text) => {
        documentText = text;
        // Broadcast update to all clients except sender
        socket.broadcast.emit('update', documentText);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
