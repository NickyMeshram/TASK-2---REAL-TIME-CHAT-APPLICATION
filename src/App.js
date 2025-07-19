import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import "./App.css";

// Connect to your backend server
const socket = io("http://localhost:3001");

function App() {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setChat((prev) => [...prev, data]);
    });

    // Cleanup the listener
    return () => socket.off("receive_message");
  }, []);

  const sendMessage = () => {
    if (message.trim() !== "") {
      socket.emit("send_message", {
        username,
        message,
      });
      setMessage("");
    }
  };

  return (
    <div className="chat-app">
      {!showChat ? (
        <div className="login">
          <h2>Popeye Chat</h2>
          <input
            type="text"
            placeholder="Enter your name"
            onChange={(e) => setUsername(e.target.value)}
          />
          <button
            onClick={() => {
              if (username.trim() !== "") setShowChat(true);
            }}
          >
            Join Chat
          </button>
        </div>
      ) : (
        <div className="chat-window">
          <div className="chat-header">
            <span>Hello, {username}</span>
            <button onClick={() => window.location.reload()}>Logout</button>
          </div>

          <div className="chat-body">
            {chat.map((msg, index) => (
              <div
                key={index}
                className={`chat-bubble ${
                  msg.username === username ? "self" : "other"
                }`}
              >
                <p>
                  <strong>{msg.username}:</strong> {msg.message}
                </p>
              </div>
            ))}
          </div>

          <div className="chat-footer">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
