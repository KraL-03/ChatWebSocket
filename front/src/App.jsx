import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import "./App.css";

function App(){
  const [inputMessage, setInputMessage] = useState("");
  const [mensajeRecibido, setMensajeRecibido] = useState([]);
  const [socket, setSocket] = useState();
  const [user, setUser] = useState("");
  const messagesEndRef = useRef(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [mensajeRecibido]);
  
  useEffect(() => {
    const newSocket = io("localhost:3000");
    setSocket(newSocket);

    newSocket.on("mensaje", (msg) => {
      setMensajeRecibido(msg);
    })

    const userName = prompt("Ingrese su nombre: ") || "Usuario";
    setUser(userName);

    return () => { newSocket.disconnect() }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      socket.emit("mensaje", {user, inputMessage, fecha: new Date().toLocaleTimeString()});
      setInputMessage("");
    }
  }

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h1>💬 Chat en Tiempo Real</h1>
        <p style={{fontSize: '12px', opacity: 0.9}}>Conectado como: <strong>{user}</strong></p>
      </div>
      
      <div className="messages-container">
        {mensajeRecibido.map((mensaje, index) => (
          <div key={index} className={`message ${mensaje.user === user ? 'own' : 'other'}`}>
            {mensaje.user !== user && <div className="message-user">{mensaje.user}</div>}
            <div className="message-bubble">{mensaje.inputMessage}</div>
            <div className="message-info">{mensaje.fecha}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="input-container">
        <form onSubmit={handleSubmit} className="message-form">
          <input 
            type="text"
            className="message-input"
            placeholder="Escribe tu mensaje..." 
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            autoFocus
          />
          <button type="submit" className="send-button">Enviar</button>
        </form>
      </div>
    </div>
  );
}

export default App;
