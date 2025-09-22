import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

// const socket = io("http://localhost:3001");

const App = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = io("http://localhost:3001");
    // Listen for incoming messages from the server
    socketRef.current.on("chat message", (msg) => {
      // Add the new message to our list of messages
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    // Clean up the socket connection when the component unmounts
    return () => socketRef.current.disconnect();
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (input.trim()) {
      // Emit the message to the server
      socketRef.current.emit("chat message", input);
      setInput("");
    }
  };

  return (
    <div className="App">
      <div className="chat-container">
        <div className="messages">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message ${
                msg.id === socketRef.current.id
                  ? "self-message"
                  : "other-message"
              }`}
            >
              {msg.txt}
            </div>
          ))}
        </div>
        <form onSubmit={handleSendMessage} className="form">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
};

export default App;
