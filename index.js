// Real-time collaborative editor logic using Socket.IO
// Make sure to include socket.io client in your HTML

document.addEventListener('DOMContentLoaded', function() {
	const editor = document.getElementById('editor');
	if (!editor) return;

	// Connect to Socket.IO server
	const socket = window.io ? window.io() : null;
	if (!socket) {
		console.warn('Socket.IO client not found. Please include it in your HTML.');
		return;
	}

	// Send changes to server
	editor.addEventListener('input', function() {
		socket.emit('edit', editor.value);
	});

	// Receive updates from server
	socket.on('update', function(text) {
		if (editor.value !== text) {
			editor.value = text;
		}
	});
});
