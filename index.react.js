import React, { useEffect, useRef } from 'react';

// Make sure to include socket.io-client in your project
// npm install socket.io-client
import { io } from 'socket.io-client';

const socket = io(); // Connects to backend server

const CollaborativeEditor = () => {
	const editorRef = useRef(null);

	useEffect(() => {
		const editor = editorRef.current;
		if (!editor) return;

		// Send changes to server
		const handleInput = () => {
			socket.emit('edit', editor.value);
		};
		editor.addEventListener('input', handleInput);

		// Receive updates from server
		socket.on('update', (text) => {
			if (editor.value !== text) {
				editor.value = text;
			}
		});

		return () => {
			editor.removeEventListener('input', handleInput);
			socket.off('update');
		};
	}, []);

	return (
		<div style={{ textAlign: 'center', marginTop: 30 }}>
			<h2>Real-Time Collaborative Document Editor</h2>
			<textarea
				id="editor"
				ref={editorRef}
				style={{
					width: '80vw',
					height: '60vh',
					fontSize: '1.2em',
					padding: '16px',
					border: '1.5px solid #bdbdbd',
					borderRadius: '8px',
					background: '#fff',
					boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
					resize: 'vertical',
				}}
				placeholder="Start typing..."
			/>
		</div>
	);
};

export default CollaborativeEditor;
